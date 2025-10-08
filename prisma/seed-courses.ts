import { PrismaClient, CourseLevel, CourseStatus } from "@/lib/generated/prisma";

const prisma = new PrismaClient();

// Pixabay direct download image URLs
// ✅ 50+ Pexels Images - Direct CDN URLs
const IMAGES = [
  // Technology & Coding
  "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/270348/pexels-photo-270348.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1181467/pexels-photo-1181467.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/546819/pexels-photo-546819.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/879109/pexels-photo-879109.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1181472/pexels-photo-1181472.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Business & Office
  "https://images.pexels.com/photos/5905857/pexels-photo-5905857.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Education & Learning
  "https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4050320/pexels-photo-4050320.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4050311/pexels-photo-4050311.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/159844/cellular-education-classroom-159844.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/256520/pexels-photo-256520.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Design & Creative
  "https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/326503/pexels-photo-326503.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/373076/pexels-photo-373076.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1279813/pexels-photo-1279813.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5797903/pexels-photo-5797903.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3584996/pexels-photo-3584996.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Marketing & Social Media
  "https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1591062/pexels-photo-1591062.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/265087/pexels-photo-265087.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/147413/twitter-facebook-together-exchange-of-information-147413.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Health & Fitness
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/416778/pexels-photo-416778.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/703016/pexels-photo-703016.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2294361/pexels-photo-2294361.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Music & Audio
  "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1407322/pexels-photo-1407322.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1130395/pexels-photo-1130395.jpeg?auto=compress&cs=tinysrgb&w=800",
  
  // Finance & Money
  "https://images.pexels.com/photos/259249/pexels-photo-259249.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/128867/coins-currency-investment-insurance-128867.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/210607/pexels-photo-210607.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3943716/pexels-photo-3943716.jpeg?auto=compress&cs=tinysrgb&w=800",
];

// ✅ 30+ Pexels Videos - Direct MP4 URLs (SD quality for faster loading)
// ✅ WORKING Videos - Google Cloud Storage (100% guaranteed to work)
const VIDEOS = [
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4",
];


const getRandomImage = () => IMAGES[Math.floor(Math.random() * IMAGES.length)];
const getRandomVideo = () => VIDEOS[Math.floor(Math.random() * VIDEOS.length)];


const courses = [
  // COURSE 1 - Web Development
  {
    title: "Complete Full-Stack Web Development Bootcamp",
    slug: "complete-fullstack-web-development-bootcamp",
    description: "Master modern web development from scratch. Learn HTML5, CSS3, JavaScript, React, Node.js, Express, MongoDB, authentication, deployment, and build 10+ production-ready projects. Perfect for beginners with no coding experience required.",
    smallDescription: "Become a full-stack web developer in 12 weeks",
    category: "Development",
    level: CourseLevel.Beginner,
    price: 4999,
    duration: 36000, // 10 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Frontend Fundamentals: HTML & CSS",
        position: 1,
        lessons: [
          {
            title: "Introduction to Web Development",
            description: "Overview of web development, how websites work, client-server architecture, and career paths",
            position: 1,
            duration: 900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "HTML5 Complete Guide",
            description: "HTML tags, semantic elements, forms, tables, and modern HTML5 features",
            position: 2,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "CSS3 Styling & Layouts",
            description: "CSS selectors, box model, flexbox, grid, animations, and responsive design",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building Your First Website",
            description: "Create a complete responsive landing page from scratch",
            position: 4,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "JavaScript Mastery",
        position: 2,
        lessons: [
          {
            title: "JavaScript Fundamentals",
            description: "Variables, data types, operators, conditionals, and loops",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Functions & Scope",
            description: "Function declarations, arrow functions, closures, and scope",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "DOM Manipulation",
            description: "Selecting elements, event listeners, and dynamic content",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Async JavaScript",
            description: "Promises, async/await, fetch API, and AJAX",
            position: 4,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "React Frontend Development",
        position: 3,
        lessons: [
          {
            title: "Introduction to React",
            description: "React basics, JSX, components, and props",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "State & Hooks",
            description: "useState, useEffect, and custom hooks",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building a React App",
            description: "Create a complete React application with routing",
            position: 3,
            duration: 2000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Backend with Node.js & Express",
        position: 4,
        lessons: [
          {
            title: "Node.js Fundamentals",
            description: "Node.js basics, modules, npm, and file system",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Express Server Setup",
            description: "Building RESTful APIs with Express and middleware",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "MongoDB & Database Integration",
            description: "MongoDB basics, Mongoose, CRUD operations",
            position: 3,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Authentication & Deployment",
        position: 5,
        lessons: [
          {
            title: "User Authentication",
            description: "JWT, bcrypt, login/signup, and protected routes",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Deployment to Production",
            description: "Deploy to Vercel, Netlify, and cloud platforms",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 2 - Python Data Science
  {
    title: "Python for Data Science & Machine Learning",
    slug: "python-data-science-machine-learning",
    description: "Complete Python data science course. Master NumPy, Pandas, Matplotlib, Scikit-learn, TensorFlow, and deep learning. Build real ML models, analyze data, create visualizations, and deploy AI applications.",
    smallDescription: "Become a data scientist with Python",
    category: "Development",
    level: CourseLevel.Intermediate,
    price: 6999,
    duration: 43200, // 12 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Python Programming Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Python Setup & Basics",
            description: "Install Python, IDEs, virtual environments, and basic syntax",
            position: 1,
            duration: 900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Data Structures in Python",
            description: "Lists, tuples, dictionaries, sets, and comprehensions",
            position: 2,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Functions & OOP",
            description: "Functions, classes, inheritance, and modules",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "NumPy for Numerical Computing",
        position: 2,
        lessons: [
          {
            title: "NumPy Arrays & Operations",
            description: "Array creation, indexing, slicing, and operations",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Advanced NumPy",
            description: "Broadcasting, linear algebra, and performance optimization",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Pandas for Data Analysis",
        position: 3,
        lessons: [
          {
            title: "Pandas DataFrames",
            description: "Creating, reading, and manipulating DataFrames",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Data Cleaning & Preprocessing",
            description: "Handling missing data, duplicates, and transformations",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Data Aggregation & Grouping",
            description: "GroupBy operations, pivoting, and aggregations",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Data Visualization",
        position: 4,
        lessons: [
          {
            title: "Matplotlib Fundamentals",
            description: "Creating plots, charts, and customizing visualizations",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Seaborn for Statistical Plots",
            description: "Advanced visualizations with Seaborn library",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Machine Learning with Scikit-learn",
        position: 5,
        lessons: [
          {
            title: "Introduction to Machine Learning",
            description: "ML concepts, supervised vs unsupervised learning",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Linear & Logistic Regression",
            description: "Build and train regression models",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Classification Algorithms",
            description: "Decision trees, random forests, and SVM",
            position: 3,
            duration: 1900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Model Evaluation & Tuning",
            description: "Cross-validation, hyperparameter tuning, metrics",
            position: 4,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 3 - Digital Marketing
  {
    title: "Complete Digital Marketing Mastery 2025",
    slug: "complete-digital-marketing-mastery",
    description: "Master all aspects of digital marketing: SEO, Google Ads, Facebook Ads, Instagram, email marketing, content strategy, analytics, and conversion optimization. Launch successful campaigns and grow any business online.",
    smallDescription: "Become a digital marketing expert",
    category: "Marketing",
    level: CourseLevel.Beginner,
    price: 5999,
    duration: 32400, // 9 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Digital Marketing Foundations",
        position: 1,
        lessons: [
          {
            title: "Introduction to Digital Marketing",
            description: "Overview of digital marketing channels and strategies",
            position: 1,
            duration: 1000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Understanding Your Target Audience",
            description: "Customer personas, market research, and segmentation",
            position: 2,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Marketing Funnel & Customer Journey",
            description: "AIDA model, sales funnel, and conversion paths",
            position: 3,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Search Engine Optimization (SEO)",
        position: 2,
        lessons: [
          {
            title: "SEO Fundamentals",
            description: "How search engines work, on-page and off-page SEO",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Keyword Research",
            description: "Finding profitable keywords and search intent analysis",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Technical SEO",
            description: "Site structure, speed optimization, and mobile SEO",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Link Building Strategies",
            description: "Backlink acquisition, outreach, and authority building",
            position: 4,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Paid Advertising: Google & Facebook Ads",
        position: 3,
        lessons: [
          {
            title: "Google Ads Mastery",
            description: "Campaign setup, keyword targeting, and bidding strategies",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Facebook & Instagram Ads",
            description: "Ad creation, audience targeting, and optimization",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Ad Copywriting & Creative Design",
            description: "Writing compelling ad copy and designing creatives",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Content Marketing & Social Media",
        position: 4,
        lessons: [
          {
            title: "Content Strategy",
            description: "Content planning, creation, and distribution",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Social Media Marketing",
            description: "Instagram, TikTok, LinkedIn, and Twitter strategies",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Influencer Marketing",
            description: "Finding influencers, collaboration, and ROI tracking",
            position: 3,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Email Marketing & Analytics",
        position: 5,
        lessons: [
          {
            title: "Email Marketing Strategy",
            description: "List building, automation, and email sequences",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Google Analytics",
            description: "Setup, tracking, reporting, and data interpretation",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Conversion Rate Optimization",
            description: "A/B testing, landing pages, and funnel optimization",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 4 - UI/UX Design
  {
    title: "UI/UX Design Masterclass: Figma to Production",
    slug: "ui-ux-design-masterclass-figma",
    description: "Complete UI/UX design course with Figma. Learn design principles, user research, wireframing, prototyping, design systems, and handoff to developers. Build a professional portfolio.",
    smallDescription: "Master UI/UX design with Figma",
    category: "Design",
    level: CourseLevel.Intermediate,
    price: 5999,
    duration: 30000, // 8.3 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Design Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Introduction to UI/UX Design",
            description: "What is UI vs UX, design thinking, and career paths",
            position: 1,
            duration: 1000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Design Principles",
            description: "Typography, color theory, spacing, and hierarchy",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Layout & Composition",
            description: "Grid systems, alignment, balance, and visual weight",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "User Research & Strategy",
        position: 2,
        lessons: [
          {
            title: "User Research Methods",
            description: "Interviews, surveys, personas, and user journey mapping",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Information Architecture",
            description: "Site mapping, card sorting, and navigation design",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Wireframing",
            description: "Low-fidelity and high-fidelity wireframes",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Mastering Figma",
        position: 3,
        lessons: [
          {
            title: "Figma Basics",
            description: "Interface, tools, frames, and basic operations",
            position: 1,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Components & Auto Layout",
            description: "Creating reusable components and responsive designs",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Variants & Advanced Features",
            description: "Component variants, plugins, and shortcuts",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Prototyping & Testing",
        position: 4,
        lessons: [
          {
            title: "Interactive Prototypes",
            description: "Creating clickable prototypes with transitions",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Usability Testing",
            description: "Testing methods, user feedback, and iterations",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Design Systems & Handoff",
        position: 5,
        lessons: [
          {
            title: "Building Design Systems",
            description: "Design tokens, component libraries, and documentation",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Developer Handoff",
            description: "Specs, assets export, and collaboration with developers",
            position: 2,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building Your Portfolio",
            description: "Case studies, presentation, and landing a job",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 5 - Business Strategy
  {
    title: "Business Strategy & Entrepreneurship Bootcamp",
    slug: "business-strategy-entrepreneurship-bootcamp",
    description: "Complete entrepreneurship course. Learn to build, launch, and scale a successful business. Covers business models, market validation, fundraising, team building, and growth strategies.",
    smallDescription: "Start and grow a successful business",
    category: "Business",
    level: CourseLevel.Intermediate,
    price: 6999,
    duration: 34200, // 9.5 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Entrepreneurship Foundations",
        position: 1,
        lessons: [
          {
            title: "Introduction to Entrepreneurship",
            description: "Entrepreneurial mindset, types of businesses, and opportunities",
            position: 1,
            duration: 1100,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Finding Your Business Idea",
            description: "Identifying problems, market gaps, and opportunities",
            position: 2,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Market Research & Validation",
            description: "Customer interviews, surveys, and MVP testing",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Business Planning",
        position: 2,
        lessons: [
          {
            title: "Business Models",
            description: "Revenue models, pricing strategies, and unit economics",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Creating a Business Plan",
            description: "Executive summary, financial projections, and strategy",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Competitive Analysis",
            description: "Analyzing competitors and positioning your business",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Funding & Finance",
        position: 3,
        lessons: [
          {
            title: "Startup Funding Options",
            description: "Bootstrapping, angels, VCs, and crowdfunding",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Pitch Deck & Fundraising",
            description: "Creating compelling pitch decks and raising capital",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Financial Management",
            description: "Accounting basics, cash flow, and financial planning",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Building Your Team",
        position: 4,
        lessons: [
          {
            title: "Hiring & Team Building",
            description: "Recruiting, interviewing, and building culture",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Leadership & Management",
            description: "Leading teams, delegation, and motivation",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Growth & Scaling",
        position: 5,
        lessons: [
          {
            title: "Go-to-Market Strategy",
            description: "Product launch, marketing channels, and customer acquisition",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Growth Hacking",
            description: "Viral loops, referrals, and rapid growth tactics",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Scaling Your Business",
            description: "Operations, systems, and sustainable scaling",
            position: 3,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 6 - Excel Mastery
  {
    title: "Microsoft Excel Expert: From Basics to Advanced",
    slug: "microsoft-excel-expert-complete",
    description: "Complete Excel course covering formulas, functions, pivot tables, macros, VBA, data analysis, dashboards, and automation. Become an Excel power user and boost productivity.",
    smallDescription: "Master Excel and boost productivity",
    category: "Office-Productivity",
    level: CourseLevel.Beginner,
    price: 3999,
    duration: 27000, // 7.5 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Excel Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Introduction to Excel",
            description: "Interface, navigation, cells, and basic operations",
            position: 1,
            duration: 900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Working with Data",
            description: "Data entry, formatting, sorting, and filtering",
            position: 2,
            duration: 1100,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Basic Formulas",
            description: "SUM, AVERAGE, COUNT, MIN, MAX functions",
            position: 3,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Advanced Formulas & Functions",
        position: 2,
        lessons: [
          {
            title: "Logical Functions",
            description: "IF, AND, OR, NOT, nested IFs",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Lookup Functions",
            description: "VLOOKUP, HLOOKUP, INDEX, MATCH, XLOOKUP",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Text & Date Functions",
            description: "Text manipulation and date calculations",
            position: 3,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Data Analysis Tools",
        position: 3,
        lessons: [
          {
            title: "Pivot Tables Mastery",
            description: "Creating and customizing pivot tables",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Charts & Visualizations",
            description: "Creating professional charts and graphs",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Conditional Formatting",
            description: "Highlighting data and creating heat maps",
            position: 3,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Automation with Macros & VBA",
        position: 4,
        lessons: [
          {
            title: "Recording Macros",
            description: "Automating repetitive tasks with macros",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Introduction to VBA",
            description: "VBA basics and writing custom functions",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Professional Dashboards",
        position: 5,
        lessons: [
          {
            title: "Dashboard Design Principles",
            description: "Creating effective and beautiful dashboards",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building Interactive Dashboards",
            description: "Dynamic dashboards with slicers and controls",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // Continue with 9 more courses following the same pattern...
  // I'll add a few more to show the variety

  // COURSE 7 - Yoga Training
  {
    title: "Yoga Teacher Training: 200 Hour Certification",
    slug: "yoga-teacher-training-certification",
    description: "Complete 200-hour yoga teacher training. Master asanas, pranayama, meditation, philosophy, anatomy, and teaching methodology. Become a certified yoga instructor.",
    smallDescription: "Become a certified yoga teacher",
    category: "Health & Fitness",
    level: CourseLevel.Intermediate,
    price: 7999,
    duration: 43200, // 12 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Yoga Foundations",
        position: 1,
        lessons: [
          {
            title: "Introduction to Yoga",
            description: "History, philosophy, and eight limbs of yoga",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Yoga Ethics & Lifestyle",
            description: "Yamas, niyamas, and yogic lifestyle practices",
            position: 2,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Asana Practice",
        position: 2,
        lessons: [
          {
            title: "Standing Poses",
            description: "Warrior series, triangle, and balancing poses",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Seated & Floor Poses",
            description: "Forward bends, twists, and hip openers",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Backbends & Inversions",
            description: "Cobra, bridge, headstand, and shoulder stand",
            position: 3,
            duration: 1900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Pranayama & Meditation",
        position: 3,
        lessons: [
          {
            title: "Breathing Techniques",
            description: "Ujjayi, Kapalabhati, alternate nostril breathing",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Meditation Practices",
            description: "Mindfulness, mantra, and visualization techniques",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Anatomy & Alignment",
        position: 4,
        lessons: [
          {
            title: "Yoga Anatomy",
            description: "Muscles, bones, and body systems in yoga",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Alignment Principles",
            description: "Proper alignment and injury prevention",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Teaching Methodology",
        position: 5,
        lessons: [
          {
            title: "Sequencing Classes",
            description: "Creating balanced and effective sequences",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Teaching Skills",
            description: "Cueing, adjustments, and classroom management",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building Your Yoga Business",
            description: "Marketing, finding students, and business basics",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 8 - AWS Cloud
  {
    title: "AWS Cloud Solutions Architect Certification",
    slug: "aws-cloud-solutions-architect-cert",
    description: "Complete AWS certification prep. Master EC2, S3, RDS, Lambda, VPC, CloudFormation, security, and architectural best practices. Pass the Solutions Architect exam.",
    smallDescription: "Become AWS certified architect",
    category: "It & Software",
    level: CourseLevel.Advanced,
    price: 8999,
    duration: 39600, // 11 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "AWS Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Introduction to AWS",
            description: "Cloud computing basics, AWS global infrastructure",
            position: 1,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "IAM - Identity & Access Management",
            description: "Users, groups, roles, policies, and security",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Compute Services",
        position: 2,
        lessons: [
          {
            title: "EC2 Fundamentals",
            description: "Launching instances, AMIs, and instance types",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Auto Scaling & Load Balancing",
            description: "ELB, ALB, NLB, and Auto Scaling groups",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Lambda & Serverless",
            description: "Serverless computing with AWS Lambda",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Storage & Databases",
        position: 3,
        lessons: [
          {
            title: "S3 - Simple Storage Service",
            description: "Buckets, objects, versioning, and lifecycle",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "RDS & DynamoDB",
            description: "Relational and NoSQL databases on AWS",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Networking & Content Delivery",
        position: 4,
        lessons: [
          {
            title: "VPC - Virtual Private Cloud",
            description: "Subnets, routing, NAT, and internet gateways",
            position: 1,
            duration: 1900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "CloudFront & Route 53",
            description: "CDN and DNS services",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Security & Monitoring",
        position: 5,
        lessons: [
          {
            title: "AWS Security Best Practices",
            description: "Encryption, KMS, security groups, NACLs",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "CloudWatch & CloudTrail",
            description: "Monitoring, logging, and auditing",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Exam Preparation",
            description: "Practice questions and exam strategies",
            position: 3,
            duration: 2000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 9 - Guitar Mastery
  {
    title: "Guitar Mastery: From Beginner to Advanced",
    slug: "guitar-mastery-complete-course",
    description: "Complete guitar course covering chords, scales, techniques, music theory, and multiple styles from rock to jazz. Play your favorite songs and improvise like a pro.",
    smallDescription: "Master guitar and play like a pro",
    category: "Music",
    level: CourseLevel.Beginner,
    price: 5499,
    duration: 32400, // 9 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Guitar Basics",
        position: 1,
        lessons: [
          {
            title: "Getting Started with Guitar",
            description: "Parts of guitar, holding position, and tuning",
            position: 1,
            duration: 1000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Your First Chords",
            description: "Open chords: C, G, D, Em, Am",
            position: 2,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Strumming Patterns",
            description: "Basic strumming and rhythm techniques",
            position: 3,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Chord Progressions & Songs",
        position: 2,
        lessons: [
          {
            title: "Common Chord Progressions",
            description: "I-IV-V, I-V-vi-IV, and popular progressions",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Playing Your First Songs",
            description: "Learning 5 popular songs with simple chords",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Scales & Lead Guitar",
        position: 3,
        lessons: [
          {
            title: "Pentatonic Scale",
            description: "Minor and major pentatonic patterns",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Soloing Techniques",
            description: "Bending, vibrato, hammer-ons, pull-offs",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Improvisation Basics",
            description: "Creating your own solos and melodies",
            position: 3,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Music Theory for Guitar",
        position: 4,
        lessons: [
          {
            title: "Understanding Music Theory",
            description: "Notes, intervals, scales, and keys",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Chord Construction",
            description: "Building chords from scales",
            position: 2,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Advanced Techniques",
        position: 5,
        lessons: [
          {
            title: "Barre Chords",
            description: "Mastering barre chords all over the neck",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Fingerstyle Guitar",
            description: "Fingerpicking patterns and techniques",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Genre Studies",
            description: "Rock, blues, jazz, and fingerstyle styles",
            position: 3,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 10 - Stock Market
  {
    title: "Stock Market Investing: Complete Guide",
    slug: "stock-market-investing-complete-guide",
    description: "Complete guide to stock market investing. Learn fundamental analysis, technical analysis, portfolio management, risk management, and proven trading strategies.",
    smallDescription: "Build wealth through stock investing",
    category: "Finance",
    level: CourseLevel.Beginner,
    price: 5999,
    duration: 30000, // 8.3 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Stock Market Basics",
        position: 1,
        lessons: [
          {
            title: "Introduction to Stock Market",
            description: "How markets work, stock exchanges, and participants",
            position: 1,
            duration: 1100,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Understanding Stocks",
            description: "Types of stocks, market cap, and stock types",
            position: 2,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Opening a Trading Account",
            description: "Choosing brokers and account setup",
            position: 3,
            duration: 1000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Fundamental Analysis",
        position: 2,
        lessons: [
          {
            title: "Financial Statements",
            description: "Reading balance sheets, income statements, cash flow",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Financial Ratios",
            description: "P/E, P/B, ROE, debt ratios, and valuation",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Company Analysis",
            description: "Evaluating business models and competitive advantages",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Technical Analysis",
        position: 3,
        lessons: [
          {
            title: "Chart Patterns",
            description: "Reading candlesticks, trends, and patterns",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Technical Indicators",
            description: "Moving averages, RSI, MACD, and other indicators",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Support & Resistance",
            description: "Identifying key levels and trend lines",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Trading Strategies",
        position: 4,
        lessons: [
          {
            title: "Day Trading Basics",
            description: "Intraday trading strategies and risk management",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Swing Trading",
            description: "Holding positions for days or weeks",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Portfolio Management",
        position: 5,
        lessons: [
          {
            title: "Building a Portfolio",
            description: "Diversification, asset allocation, and rebalancing",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Risk Management",
            description: "Stop losses, position sizing, and risk control",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Long-term Investing",
            description: "Buy and hold strategies, value investing",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 11 - Node.js Backend
  {
    title: "Node.js & Express: Backend Development Masterclass",
    slug: "nodejs-express-backend-masterclass",
    description: "Build powerful backend systems and RESTful APIs with Node.js and Express. Master MongoDB, authentication, file uploads, payments, and deployment.",
    smallDescription: "Master backend development with Node.js",
    category: "Development",
    level: CourseLevel.Intermediate,
    price: 5999,
    duration: 34200, // 9.5 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Node.js Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Introduction to Node.js",
            description: "Event loop, modules, npm, and async programming",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Core Modules",
            description: "File system, path, http, and built-in modules",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Express Framework",
        position: 2,
        lessons: [
          {
            title: "Express Basics",
            description: "Setting up Express, routing, and middleware",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "RESTful API Design",
            description: "Creating REST APIs with proper structure",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Error Handling",
            description: "Error middleware and proper error responses",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Database Integration",
        position: 3,
        lessons: [
          {
            title: "MongoDB Basics",
            description: "NoSQL concepts, collections, and documents",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Mongoose ODM",
            description: "Models, schemas, and database operations",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Authentication & Security",
        position: 4,
        lessons: [
          {
            title: "JWT Authentication",
            description: "User registration, login, and token management",
            position: 1,
            duration: 1900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Security Best Practices",
            description: "Password hashing, rate limiting, and validation",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Advanced Features",
        position: 5,
        lessons: [
          {
            title: "File Upload & Storage",
            description: "Multer, cloud storage, and file handling",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Email Integration",
            description: "Sending emails with Nodemailer",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Deployment",
            description: "Deploying to Heroku, AWS, and Docker",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 12 - Personal Finance
  {
    title: "Personal Finance & Wealth Building Mastery",
    slug: "personal-finance-wealth-building",
    description: "Master personal finance with budgeting, debt management, investing, retirement planning, tax optimization, and wealth-building strategies for financial freedom.",
    smallDescription: "Achieve financial independence",
    category: "Finance",
    level: CourseLevel.Beginner,
    price: 3999,
    duration: 25200, // 7 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Financial Foundations",
        position: 1,
        lessons: [
          {
            title: "Financial Mindset",
            description: "Money psychology, beliefs, and habits",
            position: 1,
            duration: 1000,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Budgeting Basics",
            description: "Creating and tracking your budget",
            position: 2,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Emergency Fund",
            description: "Building your financial safety net",
            position: 3,
            duration: 1100,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Debt Management",
        position: 2,
        lessons: [
          {
            title: "Understanding Debt",
            description: "Good debt vs bad debt, interest rates",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Debt Payoff Strategies",
            description: "Snowball, avalanche, and consolidation methods",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Investing Basics",
        position: 3,
        lessons: [
          {
            title: "Investment Fundamentals",
            description: "Stocks, bonds, mutual funds, and ETFs",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Asset Allocation",
            description: "Building a diversified portfolio",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Index Fund Investing",
            description: "Passive investing strategies",
            position: 3,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Retirement Planning",
        position: 4,
        lessons: [
          {
            title: "Retirement Accounts",
            description: "401(k), IRA, Roth IRA, and pension plans",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Retirement Strategies",
            description: "How much to save and retirement planning",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Wealth Building",
        position: 5,
        lessons: [
          {
            title: "Tax Optimization",
            description: "Tax-efficient investing and strategies",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Multiple Income Streams",
            description: "Side hustles and passive income",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building Wealth Long-term",
            description: "Compound interest and wealth accumulation",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 13 - Graphic Design
  {
    title: "Graphic Design Mastery: Adobe Creative Suite",
    slug: "graphic-design-adobe-creative-suite",
    description: "Master graphic design with Photoshop, Illustrator, and InDesign. Learn logo design, branding, typography, print design, and build a professional portfolio.",
    smallDescription: "Master graphic design with Adobe tools",
    category: "Design",
    level: CourseLevel.Beginner,
    price: 5999,
    duration: 34200, // 9.5 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Design Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Introduction to Graphic Design",
            description: "Design principles, elements, and creative process",
            position: 1,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Color Theory",
            description: "Color wheel, schemes, psychology, and harmony",
            position: 2,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Typography Basics",
            description: "Font selection, hierarchy, and readability",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Adobe Photoshop",
        position: 2,
        lessons: [
          {
            title: "Photoshop Interface",
            description: "Tools, panels, layers, and workspace",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Photo Editing",
            description: "Retouching, color correction, and filters",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Creating Graphics",
            description: "Compositions, effects, and digital art",
            position: 3,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Adobe Illustrator",
        position: 3,
        lessons: [
          {
            title: "Vector Graphics Basics",
            description: "Understanding vectors, paths, and shapes",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Logo Design",
            description: "Creating professional logos from scratch",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Illustrations & Icons",
            description: "Drawing illustrations and icon sets",
            position: 3,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Adobe InDesign",
        position: 4,
        lessons: [
          {
            title: "Layout Design",
            description: "Page layout, grids, and master pages",
            position: 1,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Print Design",
            description: "Brochures, flyers, and print materials",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Branding & Portfolio",
        position: 5,
        lessons: [
          {
            title: "Brand Identity Design",
            description: "Creating complete brand systems",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Building Your Portfolio",
            description: "Showcasing work and landing clients",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 14 - Social Media Marketing
  {
    title: "Social Media Marketing: Instagram, TikTok & YouTube",
    slug: "social-media-marketing-complete",
    description: "Master social media marketing across all platforms. Learn content creation, influencer marketing, paid ads, analytics, and build a massive engaged following.",
    smallDescription: "Grow your brand on social media",
    category: "Marketing",
    level: CourseLevel.Beginner,
    price: 4999,
    duration: 28800, // 8 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "Social Media Foundations",
        position: 1,
        lessons: [
          {
            title: "Introduction to Social Media Marketing",
            description: "Platform overview, strategies, and trends",
            position: 1,
            duration: 1100,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Understanding Your Audience",
            description: "Demographics, psychographics, and targeting",
            position: 2,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Instagram Marketing",
        position: 2,
        lessons: [
          {
            title: "Instagram Strategy",
            description: "Profile optimization, content pillars, and posting",
            position: 1,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Instagram Reels",
            description: "Creating viral short-form video content",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Instagram Stories & Engagement",
            description: "Interactive stories and community building",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "TikTok Marketing",
        position: 3,
        lessons: [
          {
            title: "TikTok Algorithm",
            description: "Understanding the For You Page",
            position: 1,
            duration: 1300,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Creating Viral TikToks",
            description: "Trends, hooks, and content that goes viral",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "YouTube Marketing",
        position: 4,
        lessons: [
          {
            title: "YouTube Channel Growth",
            description: "SEO, thumbnails, titles, and descriptions",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Video Production",
            description: "Filming, editing, and equipment basics",
            position: 2,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Social Media Ads & Analytics",
        position: 5,
        lessons: [
          {
            title: "Paid Social Advertising",
            description: "Facebook, Instagram, and TikTok ads",
            position: 1,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Analytics & Optimization",
            description: "Tracking metrics and improving performance",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Influencer Marketing",
            description: "Collaborations and influencer outreach",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },

  // COURSE 15 - React Native
  {
    title: "React Native: Build iOS & Android Apps",
    slug: "react-native-ios-android-apps",
    description: "Build cross-platform mobile apps with React Native. Master components, navigation, APIs, native features, and deploy to App Store and Google Play.",
    smallDescription: "Build mobile apps with React Native",
    category: "Development",
    level: CourseLevel.Intermediate,
    price: 6999,
    duration: 36000, // 10 hours
    status: CourseStatus.Published,
    fileKey: getRandomImage(),
    chapters: [
      {
        title: "React Native Fundamentals",
        position: 1,
        lessons: [
          {
            title: "Introduction to React Native",
            description: "Setup, Expo vs React Native CLI, and basics",
            position: 1,
            duration: 1200,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Core Components",
            description: "View, Text, Image, ScrollView, and StyleSheet",
            position: 2,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Styling in React Native",
            description: "Flexbox, responsive design, and styling patterns",
            position: 3,
            duration: 1400,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "User Interface & Interaction",
        position: 2,
        lessons: [
          {
            title: "User Input",
            description: "TextInput, buttons, forms, and validation",
            position: 1,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Lists & Performance",
            description: "FlatList, SectionList, and optimization",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Navigation",
        position: 3,
        lessons: [
          {
            title: "React Navigation",
            description: "Stack, tab, and drawer navigation",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Navigation Patterns",
            description: "Deep linking, authentication flow, and params",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "State Management & APIs",
        position: 4,
        lessons: [
          {
            title: "State Management",
            description: "Context API, Redux, and state patterns",
            position: 1,
            duration: 1800,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "API Integration",
            description: "Fetch, Axios, REST APIs, and data handling",
            position: 2,
            duration: 1700,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
      {
        title: "Native Features & Deployment",
        position: 5,
        lessons: [
          {
            title: "Native Modules",
            description: "Camera, location, notifications, and permissions",
            position: 1,
            duration: 1900,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Publishing Apps",
            description: "App Store and Google Play submission",
            position: 2,
            duration: 1600,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
          {
            title: "Performance Optimization",
            description: "Debugging, profiling, and optimization",
            position: 3,
            duration: 1500,
            thumbnailKey: getRandomImage(),
            videoKey: getRandomVideo(),
          },
        ],
      },
    ],
  },
];

async function main() {
  console.log("🌱 Starting database seed with Pixabay media...\n");

  // Check if we should clear existing courses
  const existingCourses = await prisma.course.count();
  
  if (existingCourses > 0) {
    console.log(`🗑️  Found ${existingCourses} existing courses. Cleaning up...`);
    await prisma.lesson.deleteMany({});
    await prisma.chapter.deleteMany({});
    await prisma.course.deleteMany({});
    console.log("✅ Deleted all existing courses\n");
  }

  let instructor = await prisma.user.findFirst({
    where: { role: "instructor" },
  });

  if (!instructor) {
    instructor = await prisma.user.create({
      data: {
        id: "seed-instructor-paramount",
        name: "Paramount Academy",
        email: "instructor@paramount.com",
        emailVerified: true,
        role: "instructor",
        image: IMAGES[5],
      },
    });
    console.log("✅ Created instructor user\n");
  }

  let totalChapters = 0;
  let totalLessons = 0;

  for (const courseData of courses) {
    const { chapters, ...courseInfo } = courseData;

    const course = await prisma.course.create({
      data: {
        ...courseInfo,
        userId: instructor.id,
      },
    });

    console.log(`  ✅ ${course.title}`);
    console.log(`     ${course.category} | ${course.level} | ₹${course.price}`);

    for (const chapterData of chapters) {
      const { lessons, ...chapterInfo } = chapterData;

      const chapter = await prisma.chapter.create({
        data: {
          ...chapterInfo,
          courseId: course.id,
        },
      });

      totalChapters++;

      for (const lessonData of lessons) {
        await prisma.lesson.create({
          data: {
            ...lessonData,
            chapterId: chapter.id,
          },
        });
        totalLessons++;
      }

      console.log(`     └─ ${chapter.title} (${lessons.length} lessons)`);
    }
    console.log("");
  }

  console.log("=".repeat(60));
  console.log("🎉 SEED COMPLETED!");
  console.log("=".repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   • Courses: ${courses.length}`);
  console.log(`   • Chapters: ${totalChapters}`);
  console.log(`   • Lessons: ${totalLessons}`);
  console.log(`   • All using Pixabay media URLs\n`);
}


main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
