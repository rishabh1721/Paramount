import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { revalidatePath } from "next/cache";
import { CheckCircle, Sparkles, ArrowRight, BookOpen, Trophy, Video, FileText, Award, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function PaymentSuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  console.log("🎯 Success page loaded with sessionId:", sessionId);

  // Activate enrollment if session_id exists
  if (sessionId) {
    try {
      console.log("🔍 Retrieving checkout session...");
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      
      console.log("💳 Payment status:", checkoutSession.payment_status);
      console.log("📦 Metadata:", checkoutSession.metadata);
      
      if (checkoutSession.payment_status === "paid") {
        const enrollmentId = checkoutSession.metadata?.enrollmentId;
        
        if (enrollmentId) {
          console.log("🔄 Attempting to activate enrollment:", enrollmentId);
          
          const result = await prisma.enrollment.updateMany({
            where: { 
              id: enrollmentId,
              status: "Pending"
            },
            data: { status: "Active" },
          });
          
          console.log("✅ Update result:", result);
          
          if (result.count > 0) {
            console.log(`✅ Successfully activated enrollment ${enrollmentId}`);
            revalidatePath("/dashboard");
            revalidatePath("/my-courses");
          } else {
            console.log("⚠️ No enrollment updated - might already be Active");
          }
        } else {
          console.log("❌ No enrollmentId in metadata");
        }
      } else {
        console.log("❌ Payment not completed:", checkoutSession.payment_status);
      }
    } catch (error) {
      console.error("❌ Error in success page:", error);
    }
  } else {
    console.log("⚠️ No session_id in URL");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 size-72 bg-emerald-200/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 size-96 bg-teal-200/30 rounded-full blur-3xl animate-pulse [animation-delay:700ms]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] bg-cyan-200/20 rounded-full blur-3xl animate-pulse [animation-delay:1000ms]" />
      </div>

      <div className="container max-w-4xl mx-auto px-4 py-16 relative z-10">
        {/* Success Animation */}
        <div className="text-center mb-12 animate-in fade-in-0 zoom-in-95 duration-700">
          <div className="relative inline-block mb-6">
            {/* Outer ring - pulsing */}
            <div className="absolute inset-0 animate-ping">
              <div className="size-32 rounded-full bg-emerald-400/30" />
            </div>
            {/* Middle ring - rotating */}
            <div className="absolute inset-2 animate-spin [animation-duration:8s]">
              <div className="size-28 rounded-full border-4 border-dashed border-emerald-300/50" />
            </div>
            {/* Inner circle - gradient */}
            <div className="relative flex size-32 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 shadow-2xl shadow-emerald-500/50">
              <CheckCircle className="size-16 text-white drop-shadow-lg" strokeWidth={2.5} />
            </div>
            {/* Sparkle effects */}
            <Sparkles className="absolute -top-2 -right-2 size-8 text-yellow-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 size-6 text-yellow-300 animate-pulse [animation-delay:300ms]" />
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent animate-in slide-in-from-bottom-4 duration-700 delay-200">
            Payment Successful!
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium animate-in slide-in-from-bottom-4 duration-700 delay-300">
            🎉 Welcome to your learning journey!
          </p>
        </div>

        {/* Main Card */}
        <div className="grid gap-8 animate-in fade-in-0 slide-in-from-bottom-8 duration-700 delay-400">
          {/* Quick Actions */}
          <Card className="border-2 border-emerald-200/50 shadow-2xl bg-white/90 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-teal-500/5 to-cyan-500/5" />
            <CardContent className="p-8 relative">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <Button 
                  asChild 
                  size="lg" 
                  className="flex-1 h-14 text-lg font-semibold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 shadow-xl shadow-emerald-500/25 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/40"
                >
                  <Link href="/dashboard" className="flex items-center justify-center gap-3">
                    <Play className="size-5" />
                    Start Learning Now
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="flex-1 h-14 text-lg font-semibold border-2 border-emerald-300 hover:bg-emerald-50 hover:border-emerald-400 transition-all duration-300 hover:scale-105"
                >
                  <Link href="/courses" className="flex items-center justify-center gap-2">
                    <BookOpen className="size-5" />
                    Explore More Courses
                  </Link>
                </Button>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="size-10 rounded-full bg-emerald-600 flex items-center justify-center">
                    <Trophy className="size-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800">
                    Your Premium Access Includes
                  </h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { icon: Video, text: "Unlimited access to all course videos" },
                    { icon: FileText, text: "Downloadable resources & materials" },
                    { icon: Award, text: "Certificate upon completion" },
                    { icon: Trophy, text: "Track progress & achievements" },
                  ].map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center gap-3 group hover:translate-x-1 transition-transform duration-300"
                    >
                      <div className="size-8 rounded-lg bg-white shadow-md flex items-center justify-center group-hover:shadow-lg group-hover:scale-110 transition-all duration-300">
                        <item.icon className="size-4 text-emerald-600" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="border-2 border-slate-200/50 shadow-xl bg-white/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="size-6 text-amber-500" />
                What Happens Next?
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  "Your enrollment is now active and ready to go",
                  "All course materials are unlocked and waiting for you",
                  "A confirmation email has been sent to your inbox",
                  "Start watching from your dashboard anytime",
                ].map((step, idx) => (
                  <div key={idx} className="flex items-start gap-3 group">
                    <div className="mt-0.5 size-6 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="size-4 text-white" strokeWidth={3} />
                    </div>
                    <p className="text-slate-700 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Support Banner */}
          <div className="text-center space-y-2 py-6 px-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200/50">
            <p className="text-slate-600 font-medium">
              Need help? Our support team is here for you 24/7
            </p>
            <p className="text-sm text-slate-500">
              Contact us anytime at support@paramount.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
