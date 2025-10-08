"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Award, BookOpen, Lightbulb, Loader2 } from "lucide-react";
import { submitInstructorApplicationAction } from "../actions";
import { toast } from "sonner";

interface InstructorApplicationFormProps {
  userId: string;
  userName: string;
}

export function InstructorApplicationForm({ userId, userName }: InstructorApplicationFormProps) {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    fullName: userName || "",
    bio: "",
    expertise: "",
    experience: "",
    motivation: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.bio.length < 100) {
      toast.error("Bio must be at least 100 characters");
      return;
    }
    
    startTransition(async () => {
      const result = await submitInstructorApplicationAction(formData);
      
      if (result.status === "success") {
        toast.success(result.message);
        window.location.reload();
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-xl">
            <Award className="size-12 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
          Become an Instructor
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Share your knowledge with thousands of students. Apply now to start teaching on Paramount.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          {
            icon: BookOpen,
            title: "Create Courses",
            description: "Build and publish unlimited courses on topics you're passionate about"
          },
          {
            icon: Sparkles,
            title: "Earn Revenue",
            description: "Earn money from course sales and reach a global audience"
          },
          {
            icon: Lightbulb,
            title: "Impact Lives",
            description: "Help students learn new skills and achieve their goals"
          }
        ].map((benefit, index) => (
          <Card key={index} className="border-border/50 hover:border-primary/30 transition-all duration-300">
            <CardHeader>
              <benefit.icon className="size-8 text-primary mb-2" />
              <CardTitle className="text-lg">{benefit.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{benefit.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Application Form */}
      <Card className="border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle>Instructor Application</CardTitle>
          <CardDescription>
            Tell us about yourself and why you want to teach
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio *</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell us about yourself, your background, and achievements..."
                rows={4}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/100 characters minimum
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expertise">Area of Expertise *</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                placeholder="e.g., Web Development, Digital Marketing, Data Science"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Teaching Experience *</Label>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                placeholder="Describe your teaching experience, courses taught, or training provided..."
                rows={4}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="motivation">Why do you want to teach on Paramount? *</Label>
              <Textarea
                id="motivation"
                value={formData.motivation}
                onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                placeholder="Share your motivation and what you hope to achieve..."
                rows={4}
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
