import { XCircle, ArrowLeft, RefreshCw, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="container max-w-2xl">
        {/* Cancel Icon */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 animate-ping">
              <div className="size-24 rounded-full bg-red-400/20" />
            </div>
            <div className="relative flex size-24 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-orange-600 shadow-2xl shadow-red-500/50 mx-auto">
              <XCircle className="size-14 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Cancel Card */}
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4 pb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              Payment Canceled
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Your enrollment was not completed. No charges were made to your account.
            </p>
          </CardHeader>

          <CardContent className="space-y-6 pb-8">
            {/* Info Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-amber-900 flex items-center gap-2">
                <HelpCircle className="size-5" />
                Common Reasons for Cancellation
              </h3>
              <ul className="space-y-2 text-sm text-amber-800">
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                  <span>Changed your mind about the purchase</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                  <span>Payment information was incorrect</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                  <span>Need more time to think about it</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="size-1.5 rounded-full bg-amber-600 mt-2 shrink-0" />
                  <span>Accidentally closed the payment window</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                asChild 
                size="lg" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/25"
              >
                <Link href="/courses" className="flex items-center justify-center gap-2">
                  <RefreshCw className="size-4" />
                  Try Again
                </Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="flex-1 border-2 hover:bg-amber-50"
              >
                <Link href="/" className="flex items-center justify-center gap-2">
                  <ArrowLeft className="size-4" />
                  Go Home
                </Link>
              </Button>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <div className="shrink-0 size-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <HelpCircle className="size-5 text-blue-600" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-blue-900 text-sm">Need Help?</h4>
                  <p className="text-sm text-blue-700">
                    If you're experiencing issues with payment or have questions about our courses, our support team is here to help.
                  </p>
                  <Button asChild variant="link" className="text-blue-600 p-0 h-auto">
                    <Link href="/support">Contact Support →</Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Reassurance Text */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Your course is still available. You can enroll anytime you're ready!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
