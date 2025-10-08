import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    console.error("No Stripe signature found");
    return NextResponse.json(
      { error: "No signature" },
      { status: 400 }
    );
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  console.log("Webhook event received:", event.type);

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const { enrollmentId, userId, courseId } = session.metadata || {};

        if (!enrollmentId) {
          console.error("No enrollmentId in metadata");
          break;
        }

        console.log(`Activating enrollment ${enrollmentId}`);

        await prisma.enrollment.update({
          where: { id: enrollmentId },
          data: { status: "Active" },
        });

        console.log(`Enrollment ${enrollmentId} activated for user ${userId}`);
        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object;
        const { enrollmentId } = session.metadata || {};

        if (enrollmentId) {
          await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { status: "Cancelled" },
          });
          
          console.log(`Enrollment ${enrollmentId} cancelled (session expired)`);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
