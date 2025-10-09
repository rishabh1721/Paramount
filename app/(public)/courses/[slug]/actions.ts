"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export async function enrollInCourseAction(courseId: string): Promise<ApiResponse> {
  
  const user = await requireUser();
  let shouldRedirect = false;
  let redirectUrl = "";

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        price: true,
        slug: true,
        status: true,
      },
    });

    if (!course) {
      return { status: "error", message: "Course not found" };
    }

    if (course.status !== "Published") {
      return { status: "error", message: "This course is not available for enrollment" };
    }

    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      return { status: "error", message: "You are already enrolled in this course" };
    }

    // Free course
    if (course.price === 0) {
      await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId: courseId,
          amount: 0,
          status: "Active",
        },
      });

      revalidatePath(`/courses/${course.slug}`);
      revalidatePath("/dashboard");
      revalidatePath("/my-courses");

      return { status: "success", message: `Successfully enrolled in ${course.title}!` };
    }

    // Paid course - Stripe flow
    let stripeCustomerId: string;
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user.id },
      });

      stripeCustomerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id },
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
        amount: course.price,
        status: "Pending",
      },
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description: `Enrollment in ${course.title}`,
            },
            unit_amount: course.price * 100,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id,
        courseId: course.id,
        enrollmentId: enrollment.id,
      },
      // ✅ FIXED: Added {CHECKOUT_SESSION_ID} placeholder
      success_url: `${env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.NEXT_PUBLIC_APP_URL}/payment/cancel`,
    });

    if (checkoutSession.url) {
      shouldRedirect = true;
      redirectUrl = checkoutSession.url;
    }

  } catch (error) {
    console.error("Enrollment error:", error);
    return { status: "error", message: "Failed to enroll in course" };
  }

  // Redirect outside try-catch
  if (shouldRedirect && redirectUrl) {
    redirect(redirectUrl);
  }

  return { status: "error", message: "Failed to create checkout session" };
}
