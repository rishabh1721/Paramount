"use client";

import { Card, CardDescription, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GithubIcon, Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function LoginForm(){
    const router = useRouter();
    const[githubPending, startGithubTransition] = useTransition();
    const[googlePending, startGoogleTransition] = useTransition();
    const[emailPending, startEmailTransition] = useTransition();
    const [email, setEmail] = useState("");

  async function signInWithGithub(){
    startGithubTransition(async()=>{
      await authClient.signIn.social({
      provider: 'github',
      callbackURL : "/",
      fetchOptions: {
        onSuccess : () => {
          toast.success("Successfully signed in!");
        },
        onError : (error) => {
          toast.error("Internal Server Error");
        },
      },
    });
    });
  }

  async function signInWithGoogle(){
    startGoogleTransition(async()=>{
      await authClient.signIn.social({
      provider: 'google',
      callbackURL : "/",
      fetchOptions: {
        onSuccess : () => {
          toast.success("Successfully signed in!");
        },
        onError : (error) => {
          toast.error("Internal Server Error");
        },
      },
    });
    });
  }

  function signInWithEmail(){
    startEmailTransition(async()=>{
      await authClient.emailOtp.sendVerificationOtp({
        email : email,
        type : 'sign-in',
        fetchOptions: {
          onSuccess : () => {
            toast.success("OTP sent to your email!");
            router.push(`/verify-request?email=${email}`);
          },
          onError : () => {
            toast.error("Internal Server Error");
          },
        },
      });
    });
  }

  return(
  <Card className="transition duration-300 bg-background shadow-lg hover:shadow-[0_4px_32px_0_rgba(0,0,0,0.12),0_0_16px_2px_rgba(255,255,255,0.10)] hover:scale-[1.02] hover:border hover:border-primary/30 w-[420px] max-w-none rounded-2xl flex flex-col justify-center items-center p-6">
    <CardHeader className="w-full text-center mb-2">
      <CardTitle className="text-2xl font-medium text-primary mb-1">Welcome Back!</CardTitle>
      <CardDescription className="text-base text-muted-foreground">Login with your account</CardDescription>
    </CardHeader>
  <CardContent className="flex flex-col gap-4 w-full">
          <Button disabled={githubPending} onClick={signInWithGithub} variant="outline" className="w-full py-3 text-base font-normal">
            {githubPending ? (
              <>
               <Loader  className="size-4 animate-spin" />
               <span>Loading...</span>
              </> ) : (
              <>
              <GithubIcon className="size-4 mr-2"/>
            Sign in with Github
              </>
            )}
          </Button>

          <Button disabled={googlePending} onClick={signInWithGoogle} variant="outline" className="w-full py-3 text-base font-normal">
            {googlePending ? (
              <>
               <Loader  className="size-4 animate-spin" />
               <span>Loading...</span>
              </> ) : (
              <>
              <svg className="size-4 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            Sign in with Google
              </>
            )}
          </Button>

            <div className="flex items-center w-full my-2">
              <div className="flex-grow h-px bg-border" />
              <span className="mx-3 text-muted-foreground text-sm">Or continue with</span>
              <div className="flex-grow h-px bg-border" />
            </div>

            <div className="grid gap-3">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="m@example.com" required/>
              </div>
              <Button className="w-full" onClick={signInWithEmail} disabled={emailPending}>
                {emailPending ? (
                  <>
                   <Loader  className="size-4 animate-spin" />
                   <span>Loading...</span>
                  </> ) : (
                  <>
                Continue with Email
                  </>
                )}
              </Button>
            </div>
       </CardContent>
     </Card>
  )
}
