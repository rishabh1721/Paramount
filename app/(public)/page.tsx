"use client";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface featureProps{
  title: string;
  description: string;
  icon: string;
}

const features: featureProps[] = [
  {
    title: 'Expert-Led Courses' , 
    description: "Learn from industry professionals with comprehensive curricula designed to advance your skills and career prospects.",
    icon: '🎓'
  },
  {
    title: 'Interactive Learning' , 
    description: "Engage with hands-on projects, quizzes, and real-world assignments that reinforce your understanding.",
    icon: '💻'
  },
  {
    title: 'Progress Analytics' , 
    description: "Track your learning journey with detailed progress reports, completion certificates, and personalized dashboards.",
    icon: '📊'
  },
  {
    title: 'Global Community' , 
    description: "Connect with fellow learners worldwide through discussion forums, study groups, and peer collaboration.",
    icon: '🌍'
  },
  {
    title: 'Flexible Schedule' , 
    description: "Study at your own pace with 24/7 access to course materials, allowing you to balance learning with life.",
    icon: '⏰'
  },
  {
    title: 'Mobile Learning' , 
    description: "Access your courses anywhere with our mobile-optimized platform for seamless learning on the go.",
    icon: '📱'
  },
  {
    title: 'Certification Ready' , 
    description: "Earn industry-recognized certificates and credentials that validate your expertise and boost your career.",
    icon: '🏆'
  }
]

export default function Home() {
  return (
   <>
   <section className="relative py-20">
    <div className="flex flex-col items-center text-center space-y-8">
      <Badge variant="outline">
        The Future of Online Education
      </Badge>

      <h1 className="text-4xl md:text-6xl font-bold tracking-tight ">
      Master New Skills with Expert-Led Courses
      </h1>
      <p className="max-w-[700px] text-muted-foreground md:text-xl">
        Unlock your potential with our comprehensive learning platform. Access world-class courses, learn from industry experts, and advance your career at your own pace.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link className={buttonVariants({
          size: "lg",  
         })} href="/courses">Explore Courses</Link>

         <Link className={buttonVariants({
          size: "lg",  
          variant: 'outline',
         })} href="/login">Sign In</Link>
      </div>
    </div>
   </section>

   <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-32">
    {features.map((feature, index)=>(
  <Card key={index} className="bg-background shadow-lg hover:shadow-[0_4px_32px_0_rgba(0,0,255,0.12),0_0_16px_2px_rgba(0,0,255,0.10)] hover:scale-[1.03] hover:border hover:border-primary/30 rounded-2xl border border-border transition duration-300 ease-in-out"> 
       <CardHeader>
          <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-200">
            {feature.icon}
          </div>
          <CardTitle className="text-lg font-semibold">
            {feature.title}
          </CardTitle>
          <CardContent className="p-0 pt-2">
            <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
          </CardContent>
       </CardHeader>
      </Card>
    ))}
   </section>
   </>
  );
}
