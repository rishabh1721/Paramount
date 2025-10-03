"use client" ;

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
  <Card className="transition duration-300 bg-background shadow-lg hover:shadow-[0_4px_32px_0_rgba(0,0,0,0.12),0_0_16px_2px_rgba(255,255,255,0.10)] hover:scale-[1.02] hover:border hover:border-primary/30 w-[420px] h-[420px] max-w-none rounded-2xl flex flex-col justify-center items-center">
    <CardHeader className="w-full text-center mb-2">
      <CardTitle className="text-2xl font-medium text-primary mb-1">Welcome Back!</CardTitle>
      <CardDescription className="text-base text-muted-foreground">Login with your Github or Email account</CardDescription>
    </CardHeader>
  <CardContent className="flex flex-col gap-6 w-full">
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