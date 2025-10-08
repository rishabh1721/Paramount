"use client";

import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import {
  IconSchool,
  IconChartBar,
  IconShieldCheck,
  IconUsers,
  IconClock,
  IconDeviceMobile,
  IconCertificate,
  IconDashboard,
  IconVideo,
  IconFileText,
  IconBell,
  IconSettings,
  IconPalette,
  IconCloud,
  IconMessageCircle,
  IconTrendingUp,
  IconAward,
  IconCode,
  IconBrain,
  IconRocket,
  IconBackpack,
  IconTarget,
  IconStar,
  IconCheck,
  IconArrowRight,
  IconSparkles,
  IconBolt,
  IconInfinity,
  IconShield,
  IconDevices,
  IconDatabase,
  IconApi,
  IconBrandStripe,
  IconMail,
  IconLock,
  IconEye,
  IconHeart,
  IconTrophy,
  IconCalendar,
  IconDownload,
  IconShare,
  IconBookmark,
  IconSearch,
  IconFilter,
  IconChartLine,
  IconUserCheck,
  IconShoppingCart,
  IconWallet,
  IconCreditCard,
  IconReceipt,
  IconFileUpload,
  IconPencil,
  IconPlayerPlay,
  IconThumbUp,
  IconMessage,
  IconGlobe,
} from "@tabler/icons-react";

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  category?: string;
  color?: string;
}

const coreFeatures: FeatureProps[] = [
  {
    title: "Expert-Led Courses",
    description: "Learn from industry professionals with comprehensive curricula designed to advance your skills and career prospects.",
    icon: <IconSchool className="size-8" />,
    category: "Learning",
    color: "from-blue-500/20 to-blue-500/5",
  },
  {
    title: "Interactive Learning",
    description: "Engage with hands-on projects, quizzes, and real-world assignments that reinforce your understanding.",
    icon: <IconBrain className="size-8" />,
    category: "Learning",
    color: "from-purple-500/20 to-purple-500/5",
  },
  {
    title: "Progress Analytics",
    description: "Track your learning journey with detailed progress reports, completion certificates, and personalized dashboards.",
    icon: <IconChartBar className="size-8" />,
    category: "Analytics",
    color: "from-green-500/20 to-green-500/5",
  },
  {
    title: "Global Community",
    description: "Connect with fellow learners worldwide through discussion forums, study groups, and peer collaboration.",
    icon: <IconUsers className="size-8" />,
    category: "Community",
    color: "from-pink-500/20 to-pink-500/5",
  },
  {
    title: "Flexible Schedule",
    description: "Study at your own pace with 24/7 access to course materials, allowing you to balance learning with life.",
    icon: <IconClock className="size-8" />,
    category: "Learning",
    color: "from-orange-500/20 to-orange-500/5",
  },
  {
    title: "Mobile Learning",
    description: "Access your courses anywhere with our mobile-optimized platform for seamless learning on the go.",
    icon: <IconDeviceMobile className="size-8" />,
    category: "Platform",
    color: "from-cyan-500/20 to-cyan-500/5",
  },
  {
    title: "Certification Ready",
    description: "Earn industry-recognized certificates and credentials that validate your expertise and boost your career.",
    icon: <IconCertificate className="size-8" />,
    category: "Learning",
    color: "from-yellow-500/20 to-yellow-500/5",
  },
  {
    title: "Secure & Private",
    description: "Enterprise-grade security with encrypted data, secure authentication, and GDPR compliance.",
    icon: <IconShieldCheck className="size-8" />,
    category: "Security",
    color: "from-red-500/20 to-red-500/5",
  },
];

const platformFeatures: FeatureProps[] = [
  {
    title: "Student Dashboard",
    description: "Personalized learning hub with course progress, upcoming lessons, achievement tracking, and smart recommendations.",
    icon: <IconDashboard className="size-8" />,
  },
  {
    title: "Instructor Dashboard",
    description: "Comprehensive analytics, student management, course creation tools, revenue tracking, and performance insights.",
    icon: <IconTrendingUp className="size-8" />,
  },
  {
    title: "Admin Panel",
    description: "Complete platform control with user management, content moderation, revenue oversight, and system configuration.",
    icon: <IconSettings className="size-8" />,
  },
  {
    title: "Video Streaming",
    description: "HD video playback with adaptive quality, progress tracking, speed control, subtitles, and offline download.",
    icon: <IconVideo className="size-8" />,
  },
  {
    title: "Course Builder",
    description: "Drag-and-drop course creation with chapters, lessons, quizzes, assignments, and rich media support.",
    icon: <IconFileText className="size-8" />,
  },
  {
    title: "Real-time Notifications",
    description: "Instant alerts for course updates, assignments, messages, achievements, and community interactions.",
    icon: <IconBell className="size-8" />,
  },
  {
    title: "Theme Customization",
    description: "Multiple themes, color schemes, dark mode, custom branding, and personalized UI preferences.",
    icon: <IconPalette className="size-8" />,
  },
  {
    title: "Cloud Storage",
    description: "Unlimited storage with AWS S3 integration for videos, documents, assignments, and course materials.",
    icon: <IconCloud className="size-8" />,
  },
  {
    title: "Discussion Forums",
    description: "Threaded conversations, upvoting, markdown support, moderation tools, and real-time chat.",
    icon: <IconMessageCircle className="size-8" />,
  },
  {
    title: "Search & Filter",
    description: "Advanced search with filters, sorting, categories, price ranges, ratings, and instant results.",
    icon: <IconSearch className="size-8" />,
  },
  {
    title: "Payment Integration",
    description: "Secure Stripe payments, multiple currencies, subscription plans, and automated invoicing.",
    icon: <IconBrandStripe className="size-8" />,
  },
  {
    title: "Email System",
    description: "Automated emails for enrollment, progress updates, certificates, and marketing campaigns via Resend.",
    icon: <IconMail className="size-8" />,
  },
];

const instructorFeatures: FeatureProps[] = [
  {
    title: "Revenue Analytics",
    description: "Real-time earnings dashboard, enrollment trends, course performance, and detailed financial reports with charts.",
    icon: <IconChartLine className="size-8" />,
  },
  {
    title: "Student Management",
    description: "Monitor progress, engagement metrics, completion rates, provide feedback, and track individual student journeys.",
    icon: <IconUserCheck className="size-8" />,
  },
  {
    title: "Content Management",
    description: "Upload videos, PDFs, presentations, code files, and interactive content with version control and organization.",
    icon: <IconFileUpload className="size-8" />,
  },
  {
    title: "Quiz Builder",
    description: "Create multiple choice, true/false, essay questions with auto-grading, time limits, and detailed analytics.",
    icon: <IconTarget className="size-8" />,
  },
  {
    title: "Certification Creator",
    description: "Design custom certificates with branding, verification codes, PDF generation, and automated delivery.",
    icon: <IconAward className="size-8" />,
  },
  {
    title: "Marketing Tools",
    description: "Landing pages, discount codes, affiliate programs, email campaigns, and SEO optimization tools.",
    icon: <IconRocket className="size-8" />,
  },
  {
    title: "Live Sessions",
    description: "Host live classes, webinars, Q&A sessions with screen sharing, recording, and real-time interaction.",
    icon: <IconPlayerPlay className="size-8" />,
  },
  {
    title: "Assignment Grading",
    description: "Review submissions, provide feedback, automated grading, rubrics, and grade book management.",
    icon: <IconPencil className="size-8" />,
  },
  {
    title: "Course Pricing",
    description: "Flexible pricing models, one-time purchase, subscriptions, bundles, early bird discounts, and promotions.",
    icon: <IconWallet className="size-8" />,
  },
];

const advancedFeatures: FeatureProps[] = [
  {
    title: "Advanced Security",
    description: "OAuth2, JWT tokens, rate limiting, SQL injection protection, XSS prevention, and Arcjet security integration.",
    icon: <IconLock className="size-8" />,
  },
  {
    title: "Performance Monitoring",
    description: "Real-time performance metrics, error tracking, uptime monitoring, and optimization recommendations.",
    icon: <IconEye className="size-8" />,
  },
  {
    title: "API Access",
    description: "RESTful API with authentication, webhooks, SDKs, and comprehensive documentation for integrations.",
    icon: <IconApi className="size-8" />,
  },
  {
    title: "Database Management",
    description: "PostgreSQL with Prisma ORM, migrations, backups, query optimization, and data integrity.",
    icon: <IconDatabase className="size-8" />,
  },
  {
    title: "Multi-device Sync",
    description: "Seamless experience across desktop, tablet, and mobile with progress synchronization.",
    icon: <IconDevices className="size-8" />,
  },
  {
    title: "Offline Mode",
    description: "Download courses for offline viewing with automatic sync when back online.",
    icon: <IconDownload className="size-8" />,
  },
  {
    title: "Social Sharing",
    description: "Share achievements, certificates, and course progress on social media platforms.",
    icon: <IconShare className="size-8" />,
  },
  {
    title: "Bookmarking System",
    description: "Save favorite courses, lessons, and resources for quick access later.",
    icon: <IconBookmark className="size-8" />,
  },
  {
    title: "Internationalization",
    description: "Multi-language support, currency conversion, and localized content delivery.",
    icon: <IconGlobe className="size-8" />,
  },
];

const stats = [
  { label: "Active Students", value: "50,000+", icon: <IconUsers className="size-6" />, change: "+12% this month" },
  { label: "Expert Instructors", value: "1,200+", icon: <IconSchool className="size-6" />, change: "+8% this month" },
  { label: "Courses Available", value: "5,000+", icon: <IconFileText className="size-6" />, change: "+150 new courses" },
  { label: "Success Rate", value: "94%", icon: <IconTrendingUp className="size-6" />, change: "Industry leading" },
];

const benefits = [
  { text: "Lifetime access to all course materials", icon: <IconInfinity className="size-5" /> },
  { text: "30-day money-back guarantee", icon: <IconShield className="size-5" /> },
  { text: "Downloadable resources and templates", icon: <IconDownload className="size-5" /> },
  { text: "Certificate of completion", icon: <IconCertificate className="size-5" /> },
  { text: "Direct instructor support", icon: <IconMessage className="size-5" /> },
  { text: "Community access and networking", icon: <IconUsers className="size-5" /> },
  { text: "Regular content updates", icon: <IconSparkles className="size-5" /> },
  { text: "Mobile app access", icon: <IconDeviceMobile className="size-5" /> },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    content: "Paramount transformed my career. The courses are comprehensive and the instructors are world-class.",
    rating: 5,
    image: "SJ",
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    content: "Best investment in my professional development. The platform is intuitive and the content is top-notch.",
    rating: 5,
    image: "MC",
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    content: "The interactive projects and real-world assignments helped me land my dream job. Highly recommended!",
    rating: 5,
    image: "ER",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring and getting started",
    features: [
      "Access to free courses",
      "Basic progress tracking",
      "Community access",
      "Mobile app access",
      "Email support",
    ],
    popular: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Ideal for serious learners",
    features: [
      "Unlimited course access",
      "Advanced analytics",
      "Priority support",
      "Downloadable content",
      "Certificates",
      "Exclusive webinars",
      "Ad-free experience",
    ],
    popular: true,
  },
  {
    name: "Instructor",
    price: "$99",
    period: "per month",
    description: "For educators and content creators",
    features: [
      "All Pro features",
      "Create unlimited courses",
      "Revenue analytics",
      "Marketing tools",
      "Custom branding",
      "Priority listing",
      "Dedicated account manager",
    ],
    popular: false,
  },
];

const AnimatedCounter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(Math.floor(end * progress));
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <span>{count.toLocaleString()}</span>;
};

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 xl:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5 pointer-events-none" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 animate-bounce delay-100">
          <div className="size-16 rounded-full bg-primary/10 blur-xl" />
        </div>
        <div className="absolute bottom-20 right-10 animate-bounce delay-300">
          <div className="size-20 rounded-full bg-primary/10 blur-xl" />
        </div>

        <div className="container relative z-10">
          <div 
            className={cn(
              "flex flex-col items-center text-center space-y-8 max-w-6xl mx-auto transition-all duration-1000",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            )}
          >
            <Badge 
              variant="outline" 
              className="px-6 py-2 text-sm animate-in fade-in-0 zoom-in-95 duration-500 hover:scale-110 transition-transform"
            >
              <IconBackpack className="size-4 mr-2 animate-pulse" />
              The Future of Online Education
            </Badge>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-100">
              Master New Skills with
              <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent animate-pulse">
                Expert-Led Courses
              </span>
            </h1>

            <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl lg:text-2xl leading-relaxed animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
              Unlock your potential with our comprehensive learning platform. Access world-class courses, 
              learn from industry experts, and advance your career at your own pace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
              <Link
                className={buttonVariants({
                  size: "lg",
                  className: "text-lg px-10 py-6 shadow-2xl shadow-primary/25 hover:shadow-primary/50 transition-all duration-300 hover:scale-105 group",
                })}
                href="/courses"
              >
                <IconRocket className="size-6 mr-2 group-hover:translate-x-1 transition-transform" />
                Explore Courses
                <IconArrowRight className="size-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                className={buttonVariants({
                  size: "lg",
                  variant: "outline",
                  className: "text-lg px-10 py-6 hover:scale-105 transition-all duration-300",
                })}
                href="/login"
              >
                Sign In
              </Link>
            </div>

            {/* Animated Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mt-20 w-full animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-500">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className={cn(
                    "group flex flex-col items-center space-y-3 p-6 rounded-2xl bg-background/80 backdrop-blur-xl border border-border/50",
                    "hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 hover:scale-105",
                    "transition-all duration-500 cursor-pointer"
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-primary group-hover:scale-125 transition-transform duration-300">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold group-hover:text-primary transition-colors">
                    {stat.value}
                  </div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                  <div className="text-xs text-primary/70">{stat.change}</div>
                </div>
              ))}
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center justify-center gap-8 pt-12 flex-wrap animate-in fade-in-0 zoom-in-95 duration-700 delay-700">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
                <div className="flex -space-x-3">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="size-10 rounded-full bg-gradient-to-br from-primary to-primary/50 border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium">
                  Join 50,000+ students
                </span>
              </div>
              <div className="flex items-center gap-2 p-4 rounded-xl bg-background/50 backdrop-blur-sm border border-border/50">
                {[...Array(5)].map((_, i) => (
                  <IconStar key={i} className="size-6 fill-primary text-primary animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                ))}
                <span className="text-sm font-medium ml-2">
                  4.9/5 (10,000+ reviews)
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section className="container py-20 md:py-32">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
            <IconSparkles className="size-4 mr-2" />
            Core Features
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Everything You Need to
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Succeed
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Powerful features designed to enhance your learning experience and accelerate your growth with cutting-edge technology.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {coreFeatures.map((feature, index) => (
            <Card
              key={index}
              className={cn(
                "group relative overflow-hidden bg-background border-border",
                "hover:shadow-[0_8px_48px_0_rgba(0,0,0,0.15),0_0_24px_4px_rgba(255,255,255,0.10)]",
                "hover:scale-[1.05] hover:border-primary/50",
                "transition-all duration-500 ease-out cursor-pointer"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500", feature.color)} />
              <div className="absolute inset-0 bg-grid-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative space-y-4 pb-4">
                <div className="flex items-start justify-between">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                  {feature.category && (
                    <Badge variant="secondary" className="text-xs group-hover:scale-110 transition-transform">
                      {feature.category}
                    </Badge>
                  )}
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="relative py-20 md:py-32 bg-muted/30">
        <div className="absolute inset-0 bg-grid-white/5" />
        <div className="container relative">
          <div className="text-center space-y-6 mb-16">
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
              <IconBolt className="size-4 mr-2 animate-pulse" />
              Platform Features
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Comprehensive Learning
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Platform
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Advanced tools and features designed for students, instructors, and administrators to create the ultimate learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {platformFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group relative overflow-hidden hover:shadow-2xl hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 bg-background/80 backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <CardHeader className="relative space-y-4">
                  <div className="p-4 w-fit rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary group-hover:from-primary group-hover:to-primary/80 group-hover:text-primary-foreground group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 shadow-lg">
                    {feature.icon}
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Instructor Features Section */}
      <section className="container py-20 md:py-32">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
            <IconTrophy className="size-4 mr-2" />
            For Instructors
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Powerful Tools for
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Educators
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Everything you need to create, manage, and monetize your courses effectively with professional-grade tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {instructorFeatures.map((feature, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden border-2 hover:border-primary hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardHeader className="relative space-y-4">
                <div className="p-5 w-fit rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-2xl shadow-primary/50">
                  {feature.icon}
                </div>
                <div className="space-y-3">
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Advanced Features */}
      <section className="relative py-20 md:py-32 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-6 mb-16">
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
              <IconShield className="size-4 mr-2" />
              Advanced Features
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Enterprise-Grade
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Technology
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
              Built with cutting-edge technology and best practices for security, performance, and scalability.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {advancedFeatures.map((feature, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 bg-background/50 backdrop-blur-sm"
              >
                <CardHeader className="space-y-4">
                  <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div className="space-y-2">
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container py-20 md:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
              <IconHeart className="size-4 mr-2 fill-current" />
              Student Benefits
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              What's Included with
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Every Course
              </span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
              Amazing benefits to maximize your learning experience and ensure your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-background border-2 border-border hover:border-primary/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex-shrink-0 size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-300">
                  {benefit.icon}
                </div>
                <span className="text-base md:text-lg font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20 md:py-32 bg-muted/30 overflow-hidden">
        <div className="container">
          <div className="text-center space-y-6 mb-16">
            <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
              <IconThumbUp className="size-4 mr-2" />
              Testimonials
            </Badge>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Loved by Thousands of
              <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Students Worldwide
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="group hover:shadow-2xl hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 bg-background/80 backdrop-blur-sm"
              >
                <CardHeader className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-xl font-bold text-primary-foreground">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">{testimonial.name}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <IconStar key={i} className="size-5 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-20 md:py-32">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="mb-4 px-6 py-2 text-sm">
            <IconCreditCard className="size-4 mr-2" />
            Pricing Plans
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            Choose the Perfect Plan
            <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              For Your Journey
            </span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-3xl mx-auto">
            Flexible pricing options for every learner and educator. Start free, upgrade anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={cn(
                "relative overflow-hidden transition-all duration-500",
                plan.popular 
                  ? "border-2 border-primary shadow-2xl shadow-primary/25 scale-105" 
                  : "border-2 border-border hover:border-primary/30 hover:shadow-xl hover:scale-105"
              )}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              <CardHeader className="space-y-6 pb-8">
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground">{plan.description}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>
                <Link
                  href="/courses"
                  className={buttonVariants({
                    variant: plan.popular ? "default" : "outline",
                    className: "w-full py-6 text-base font-semibold",
                  })}
                >
                  Get Started
                </Link>
              </CardHeader>
              <CardContent className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <IconCheck className="size-5 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container py-20 md:py-32">
        <Card className="relative overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/10 via-background to-primary/5 shadow-2xl">
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
          <CardContent className="relative py-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto text-center space-y-10">
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Ready to Transform
                  <span className="block mt-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Your Future?
                  </span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-2xl leading-relaxed">
                  Join thousands of students already learning on Paramount. Start your journey today and unlock your full potential.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link
                  className={buttonVariants({
                    size: "lg",
                    className: "text-lg px-12 py-7 shadow-2xl shadow-primary/30 hover:shadow-primary/50 hover:scale-110 transition-all duration-300 group",
                  })}
                  href="/courses"
                >
                  <IconRocket className="size-6 mr-2 group-hover:translate-y-[-4px] transition-transform" />
                  Get Started Free
                  <IconSparkles className="size-6 ml-2 animate-pulse" />
                </Link>

                <Link
                  className={buttonVariants({
                    size: "lg",
                    variant: "outline",
                    className: "text-lg px-12 py-7 hover:scale-110 transition-all duration-300",
                  })}
                  href="/admin/applications"
                >
                  <IconSchool className="size-6 mr-2" />
                  Become an Instructor
                </Link>
              </div>

              <div className="flex items-center justify-center gap-12 pt-12 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-4">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="size-12 rounded-full bg-gradient-to-br from-primary to-primary/50 border-4 border-background flex items-center justify-center text-sm font-bold text-primary-foreground shadow-lg animate-pulse"
                        style={{ animationDelay: `${i * 100}ms` }}
                      >
                        {String.fromCharCode(65 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold">50,000+</div>
                    <div className="text-sm text-muted-foreground">Happy Students</div>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <IconStar key={i} className="size-7 fill-primary text-primary" />
                    ))}
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">4.9/5</div>
                    <div className="text-sm text-muted-foreground">10,000+ Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
