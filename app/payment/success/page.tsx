import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { CheckCircle, Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

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
          // Check current status
          const enrollment = await prisma.enrollment.findUnique({
            where: { id: enrollmentId },
          });

          if (enrollment && enrollment.status === "Pending") {
            // Update enrollment to Active
            await prisma.enrollment.update({
              where: { id: enrollmentId },
              data: { status: "Active" },
            });
            
            console.log(`✅ Enrollment ${enrollmentId} activated via success page`);
            
            // Revalidate dashboard and my-courses pages
            revalidatePath("/dashboard");
            revalidatePath("/my-courses");
          }
        }
      }
    } catch (error) {
      console.error("❌ Error activating enrollment:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        {/* Success Animation */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 animate-ping">
              <div className="size-24 rounded-full bg-green-400/30" />
            </div>
            <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/50 mx-auto">
              <CheckCircle className="size-14 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Success Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="size-5 text-yellow-500 animate-pulse" />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Payment Successful!
              </h1>
              <Sparkles className="size-5 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Congratulations! Your enrollment has been confirmed and you now have full access to your course.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Features List */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-green-900 flex items-center gap-2">
                <BookOpen className="size-5" />
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-sm text-green-800">
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-green-600 shrink-0" />
                  <span>Access all course materials immediately</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-green-600 shrink-0" />
                  <span>Download resources and watch videos offline</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-green-600 shrink-0" />
                  <span>Track your progress on your dashboard</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="size-4 mt-0.5 text-green-600 shrink-0" />
                  <span>Get your certificate upon completion</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                asChild 
                size="lg" 
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg shadow-green-500/25"
              >
                <Link href="/dashboard" className="flex items-center justify-center gap-2">
                  Go to Dashboard
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="flex-1 border-2 hover:bg-green-50"
              >
                <Link href="/courses">
                  Browse More Courses
                </Link>
              </Button>
            </div>

            {/* Receipt Info */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                A confirmation email has been sent to your inbox with your receipt and course details.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
