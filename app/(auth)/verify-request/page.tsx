"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import { Loader } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

// Separate component that uses useSearchParams
function VerifyRequestContent() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startTransition] = useTransition();
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isOtpCompleted = otp.length === 6;

  function verifyOtp() {
    startTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified");
            router.push("/");
          },
          onError: () => {
            toast.error("Error verifying Email/OTP");
          },
        },
      });
    });
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full px-4">
      <div className="flex items-center justify-center gap-3 mb-6">
        <Image 
          src="/logo123.PNG" 
          alt="logo" 
          width={40} 
          height={40} 
          className="rounded-full shadow-lg transition duration-300 hover:shadow-[0_0_8px_2px_rgba(255,255,255,0.25)] hover:scale-102" 
        />
        <span className="text-2xl font-semibold tracking-wide uppercase text-neutral-800 dark:text-white">
          PARAMOUNT
        </span>
      </div>
      
      <Card className="w-full max-w-2xl bg-background shadow-lg hover:shadow-[0_4px_32px_0_rgba(0,0,0,0.12),0_0_16px_2px_rgba(255,255,255,0.10)] hover:scale-[1.02] hover:border hover:border-primary/30 rounded-2xl border border-border p-8 transition duration-300 min-h-[340px]">
        <CardHeader className="text-center p-0 mb-4">
          <CardTitle className="text-2xl font-bold text-primary mb-3">
            Please Check Your Email
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground leading-relaxed">
            We have sent you a one-time password (OTP) to your email address.<br />
            Please enter the OTP to verify your account.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center gap-6 mt-2">
          <InputOTP 
            value={otp} 
            onChange={(value) => setOtp(value)} 
            maxLength={6} 
            className="mx-auto gap-2"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </CardContent>
        
        <Button 
          onClick={verifyOtp} 
          disabled={emailPending || !isOtpCompleted} 
          className="w-full mt-4"
        >
          {emailPending ? (
            <>
              <Loader className="size-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            "Verify Account"
          )}
        </Button>
      </Card>
    </div>
  );
}

// Main component with Suspense boundary
export default function VerifyRequest() {
  return (
    <Suspense 
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[60vh] w-full">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Image 
              src="/logo123.PNG" 
              alt="logo" 
              width={40} 
              height={40} 
              className="rounded-full shadow-lg" 
            />
            <span className="text-2xl font-semibold tracking-wide uppercase text-neutral-800 dark:text-white">
              PARAMOUNT
            </span>
          </div>
          <Card className="w-full max-w-2xl p-8">
            <div className="flex items-center justify-center gap-2">
              <Loader className="size-5 animate-spin" />
              <span>Loading verification...</span>
            </div>
          </Card>
        </div>
      }
    >
      <VerifyRequestContent />
    </Suspense>
  );
}
