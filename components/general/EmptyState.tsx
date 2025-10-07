import { PlusCircle, BookOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col flex-1 min-h-[500px] items-center justify-center rounded-2xl border-2 border-dashed p-12 text-center animate-in fade-in-50 duration-500">
      {/* Icon Container with Gradient Background */}
      <div className="relative mb-6">
        {/* Animated Background Glow */}
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
        
        {/* Icon */}
        <div className="relative flex items-center justify-center size-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border-2 border-primary/20">
          <BookOpen className="size-12 text-primary" />
        </div>

        {/* Sparkle Decoration */}
        <Sparkles className="absolute -top-2 -right-2 size-6 text-primary animate-pulse" />
      </div>

      {/* Content */}
      <div className="space-y-3 max-w-md">
        <h2 className="text-2xl font-bold text-foreground">
          No Courses Yet
        </h2>
        <p className="text-base text-muted-foreground leading-relaxed">
          Get started by creating your first course. Share your knowledge and help others learn something new.
        </p>
      </div>

      {/* Call to Action */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Button size="lg" asChild className="group">
          <Link href="/admin/courses/create">
            <PlusCircle className="mr-2 size-5 transition-transform group-hover:rotate-90" />
            Create Your First Course
          </Link>
        </Button>
        
        <Button size="lg" variant="outline" asChild>
          <Link href="/admin/courses/templates">
            <Sparkles className="mr-2 size-5" />
            Browse Templates
          </Link>
        </Button>
      </div>

      {/* Optional: Quick Tips */}
      <div className="mt-12 pt-8 border-t max-w-2xl">
        <p className="text-sm font-semibold text-foreground mb-4">Quick Tips:</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { step: "1", title: "Create", desc: "Add course details" },
            { step: "2", title: "Structure", desc: "Organize chapters" },
            { step: "3", title: "Publish", desc: "Share with students" },
          ].map((tip) => (
            <div key={tip.step} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center size-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                {tip.step}
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">{tip.title}</p>
                <p className="text-xs text-muted-foreground">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
