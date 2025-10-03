import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link"
// ...existing code...

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return(
   <div className="relativ flex min-h-svh flex-col items-center justify-center">
    <Link href ="/" className={buttonVariants({variant:"ghost", size:"sm"}) + " absolute left-4 top-4 md:left-8 md:top-8"}>
    <ArrowLeft className="h-4 w-4"/>
    Back

    </Link>


      <div className="flex w-full max-w-sm flex-col gap-6">
        {children}

        <div className="mt-4 text-xs text-center text-muted-foreground px-2">
          By clicking continue, you agree to our
          <Link href="/terms" className="underline hover:text-primary transition-colors mx-1">Terms of Service</Link>
          and
          <Link href="/privacy" className="underline hover:text-primary transition-colors mx-1">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}