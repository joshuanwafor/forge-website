"use client";

import { useState } from "react";
import Link from "next/link";

export default function Courses() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const courses = [
    {
      id: 1,
      title: "Web Development",
      icon: "🌐",
      gradient: "from-blue-500 to-cyan-500",
      description: "Master modern web technologies and build responsive, dynamic websites",
      topics: [
        "HTML5, CSS3 & JavaScript",
        "React.js & Next.js",
        "Responsive Design",
        "Web APIs & Performance",
        "Progressive Web Apps"
      ],
      duration: "12 weeks",
      level: "Beginner to Advanced",
      price: "₦150,000"
    },
    {
      id: 2,
      title: "Mobile Development",
      icon: "📱",
      gradient: "from-purple-500 to-pink-500",
      description: "Build native and cross-platform mobile applications for iOS and Android",
      topics: [
        "React Native & Flutter",
        "iOS & Android Development",
        "Mobile UI/UX Patterns",
        "App Store Deployment",
        "Push Notifications & APIs"
      ],
      duration: "14 weeks",
      level: "Intermediate",
      price: "₦180,000"
    },
    {
      id: 3,
      title: "Backend Development",
      icon: "⚙️",
      gradient: "from-green-500 to-emerald-500",
      description: "Learn server-side programming, databases, and API development",
      topics: [
        "Node.js & Express",
        "Database Design (SQL & NoSQL)",
        "RESTful & GraphQL APIs",
        "Authentication & Security",
        "Cloud Deployment & DevOps"
      ],
      duration: "16 weeks",
      level: "Intermediate to Advanced",
      price: "₦200,000"
    },
    {
      id: 4,
      title: "Design",
      icon: "🎨",
      gradient: "from-orange-500 to-red-500",
      description: "Create stunning user interfaces and experiences for digital products",
      topics: [
        "UI/UX Design Principles",
        "Figma & Design Tools",
        "Design Systems",
        "Prototyping & Wireframing",
        "User Research & Testing"
      ],
      duration: "10 weeks",
      level: "Beginner to Intermediate",
      price: "₦120,000"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-2xl font-bold">
                <span className="text-white">FORGE</span>
              </Link>
              <Link href="/" className="hidden md:block text-gray-300 hover:text-white transition-colors">
                Hub
              </Link>
              <Link href="/academy" className="hidden md:block text-gray-300 hover:text-white transition-colors">
                Academy
              </Link>
              <Link href="/courses" className="hidden md:block text-white transition-colors">
                Courses
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Enroll Now
              </button>
              <button className="px-6 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                View Schedule
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/10">
              <Link href="/" className="block py-2 text-gray-300 hover:text-white transition-colors">Hub</Link>
              <Link href="/academy" className="block py-2 text-gray-300 hover:text-white transition-colors">Academy</Link>
              <Link href="/courses" className="block py-2 text-white transition-colors">Courses</Link>
              <button className="w-full mt-2 px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Enroll Now
              </button>
              <button className="w-full mt-2 px-6 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                View Schedule
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
            Professional Training Programs
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Learn to Build
          </h1>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-12 leading-tight bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            The Future
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-12 max-w-3xl mx-auto">
            Industry-leading courses taught by experienced developers. Build real projects, earn certificates, and launch your tech career.
          </p>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">OUR COURSES</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Choose Your Path
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {courses.map((course) => (
              <div 
                key={course.id}
                className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all group"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className={`text-6xl mb-4 bg-gradient-to-r ${course.gradient} bg-clip-text`}>
                    {course.icon}
                  </div>
                  <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold">
                    {course.level}
                  </span>
                </div>
                
                <h3 className={`text-3xl font-bold mb-4 bg-gradient-to-r ${course.gradient} bg-clip-text text-transparent`}>
                  {course.title}
                </h3>
                
                <p className="text-gray-400 mb-6 leading-relaxed">
                  {course.description}
                </p>

                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-white mb-3">What You'll Learn:</h4>
                  <ul className="space-y-2">
                    {course.topics.map((topic, idx) => (
                      <li key={idx} className="text-gray-400 text-sm flex items-start">
                        <svg className="w-4 h-4 mr-2 mt-0.5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {topic}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/10">
                  <div>
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="text-lg font-semibold">{course.duration}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Price</div>
                    <div className="text-2xl font-bold">{course.price}</div>
                  </div>
                </div>

                <button className={`w-full mt-6 py-3 rounded-full font-semibold transition-all bg-gradient-to-r ${course.gradient} hover:opacity-90`}>
                  Enroll Now
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">WHY FORGE COURSES</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Learn From the Best
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "👨‍💻",
                title: "Expert Instructors",
                desc: "Learn from industry professionals with years of real-world experience"
              },
              {
                icon: "🚀",
                title: "Real Projects",
                desc: "Build portfolio-worthy projects that showcase your skills to employers"
              },
              {
                icon: "🎓",
                title: "Certificates",
                desc: "Earn recognized certificates upon completion to boost your career"
              },
              {
                icon: "💼",
                title: "Career Support",
                desc: "Get job placement assistance and career guidance from our team"
              },
              {
                icon: "🤝",
                title: "Community Access",
                desc: "Join our thriving tech community and network with fellow learners"
              },
              {
                icon: "⚡",
                title: "Lifetime Access",
                desc: "Access course materials and updates for life after enrollment"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-center"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm text-purple-500">
            Start Learning Today
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to <span className="italic bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Transform</span> Your Career?
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Join thousands of students who have launched successful tech careers through our comprehensive training programs.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button className="px-12 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-xl">
              Browse All Courses
            </button>
            <button className="px-12 py-5 border border-white/30 rounded-full hover:bg-white/10 transition-all text-xl">
              Talk to Advisor
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl font-bold text-purple-500 mb-1">5000+</div>
              <div className="text-sm text-gray-500">Students Trained</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl font-bold text-pink-500 mb-1">95%</div>
              <div className="text-sm text-gray-500">Completion Rate</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl font-bold text-cyan-500 mb-1">4.8/5</div>
              <div className="text-sm text-gray-500">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <p className="text-2xl font-bold text-white mb-4">FORGE</p>
              <p className="text-sm text-gray-500">Where developers build together.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Hub</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/" className="hover:text-white transition-colors">Workspace</Link></li>
                <li><Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/#tour" className="hover:text-white transition-colors">Book Tour</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Learn</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link href="/academy" className="hover:text-white transition-colors">Academy</Link></li>
                <li><Link href="/courses" className="hover:text-white transition-colors">Courses</Link></li>
                <li><Link href="/academy" className="hover:text-white transition-colors">Apply</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500">© 2025 Forge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

