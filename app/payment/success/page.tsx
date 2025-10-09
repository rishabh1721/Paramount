import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import PaymentSuccessContent from "./_components/PaymentSuccessContent";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: { session_id?: string };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session?.user) {
    redirect("/login");
  }

  const sessionId = searchParams.session_id;

  // Activate enrollment if session_id exists
  if (sessionId) {
    try {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      
      if (checkoutSession.payment_status === "paid") {
        const { enrollmentId } = checkoutSession.metadata || {};
        
        if (enrollmentId) {
          // Update enrollment to Active
          await prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { status: "Active" },
          });
          
          console.log(`✅ Enrollment ${enrollmentId} activated via success page`);
        }
      }
    } catch (error) {
      console.error("Error activating enrollment:", error);
    }
  }

  return <PaymentSuccessContent />;
}
