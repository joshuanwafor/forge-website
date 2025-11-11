import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Courses() {
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
        "Full-Stack Development"
      ],
      duration: "4-6 months",
      level: "Beginner to Advanced"
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
        "Cross-platform Development"
      ],
      duration: "4-6 months",
      level: "Intermediate"
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
      duration: "4-6 months",
      level: "Intermediate to Advanced"
    },
    {
      id: 4,
      title: "Frontend Development",
      icon: "💻",
      gradient: "from-cyan-500 to-blue-500",
      description: "Master modern frontend frameworks and build interactive user interfaces",
      topics: [
        "React.js & Vue.js",
        "TypeScript & JavaScript",
        "State Management",
        "Performance Optimization",
        "Modern CSS & Animations"
      ],
      duration: "4-6 months",
      level: "Beginner to Advanced"
    },
    {
      id: 5,
      title: "Design Mastery",
      icon: "🎨",
      gradient: "from-orange-500 to-red-500",
      description: "Comprehensive design training across multiple disciplines",
      topics: [
        "Graphic Design",
        "Product Design (UI/UX)",
        "3D Design & Modeling",
        "Illustration & Branding",
        "Design Systems & Tools"
      ],
      duration: "4-6 months",
      level: "Beginner to Intermediate"
    },
    {
      id: 6,
      title: "Digital Marketing & Strategy",
      icon: "📊",
      gradient: "from-pink-500 to-purple-500",
      description: "Master digital marketing, social media strategy, and growth tactics",
      topics: [
        "Social Media Marketing",
        "SEO & Content Strategy",
        "Analytics & Data-Driven Marketing",
        "Email & Conversion Marketing",
        "Brand Strategy & Growth"
      ],
      duration: "4-6 months",
      level: "Beginner to Advanced"
    },
    {
      id: 7,
      title: "WordPress Training",
      icon: "📝",
      gradient: "from-blue-500 to-indigo-500",
      description: "Build professional websites and manage content with WordPress",
      topics: [
        "WordPress Setup & Hosting",
        "Theme Customization",
        "Plugin Development",
        "WooCommerce & E-commerce",
        "SEO & Performance"
      ],
      duration: "4-6 months",
      level: "Beginner"
    },
    {
      id: 8,
      title: "Advanced AI",
      icon: "🤖",
      gradient: "from-violet-500 to-purple-500",
      description: "Learn artificial intelligence, machine learning, and AI integration",
      topics: [
        "AI Fundamentals & Concepts",
        "Machine Learning Basics",
        "AI Tools & Platforms",
        "AI Integration in Apps",
        "Prompt Engineering & GPT"
      ],
      duration: "4-6 months",
      level: "Intermediate to Advanced"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <Header activePage="courses" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Gradient Mesh Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full text-sm backdrop-blur-sm font-medium text-purple-400 shadow-lg shadow-purple-500/10 animate-fadeInUp">
            <span className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></span>
            taught by experienced professionals
          </div>
          
          <div className="mb-6 space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp">
              <span className="block">Learn to Build</span>
            </h1>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">
                The Future
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed font-light animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Join our 4-6 month intensive mentorship program with expert-led training, hands-on projects, and career support.
          </p>

          {/* Program Highlights Section */}
          <div className="max-w-6xl mx-auto mb-12 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="text-center mb-8 px-4">
              <h3 className="text-2xl font-bold mb-2">Program Highlights</h3>
              <p className="text-gray-500 text-sm">What makes our mentorship program unique</p>
            </div>
            
            {/* Grid Layout - Responsive */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4">
              {[
                { icon: "📚", title: "Personalized Learning" },
                { icon: "👨‍🏫", title: "Expert Mentorship" },
                { icon: "🏫", title: "Physical & Hybrid" },
                { icon: "💼", title: "Portfolio Development" },
                { icon: "💰", title: "Flexible Payment" }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <h4 className="text-sm font-semibold text-white leading-snug">
                      {item.title}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Location Info */}
            <div className="mt-8 mx-4 p-4 bg-gradient-to-r from-purple-500/5 to-pink-500/5 border border-purple-500/10 rounded-xl text-center">
              <p className="text-sm text-gray-400">
                📍 <span className="font-semibold text-white">Jos-based Academy</span> • Hands-on projects & career support included
              </p>
            </div>
          </div>
          
          <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-red-600 border-2 border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-black"></div>
              </div>
              <span className="text-sm font-medium text-gray-300">Join 5000+ students</span>
            </div>
          </div>
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

                <div className="pt-6 border-t border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="text-lg font-semibold">{course.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">Application Fee</div>
                      <div className="text-xl font-bold text-purple-400">₦5,000</div>
                    </div>
                  </div>
                </div>

                <a href="/apply" className={`block w-full mt-4 py-3 rounded-full font-semibold transition-all bg-gradient-to-r ${course.gradient} hover:opacity-90 text-center`}>
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Program */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">INTENSIVE MENTORSHIP PROGRAM</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              4-6 Month Journey to Mastery
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Our comprehensive program equips you with high-demand digital skills through practical, expert-led training at our Jos-based academy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "👨‍🏫",
                title: "Expert Mentorship",
                desc: "Learn directly from industry professionals with years of real-world experience and practical insights"
              },
              {
                icon: "🎯",
                title: "Hands-On Projects",
                desc: "Build portfolio-worthy projects while working on real-world challenges and client work"
              },
              {
                icon: "🏢",
                title: "Physical & Hybrid Classes",
                desc: "Attend classes at our Jos-based academy with flexible online options available"
              },
              {
                icon: "📈",
                title: "Personalized Learning",
                desc: "Get customized learning paths tailored to your goals, pace, and experience level"
              },
              {
                icon: "💼",
                title: "Portfolio Development",
                desc: "Build a professional portfolio that showcases your skills to potential employers"
              },
              {
                icon: "🎓",
                title: "Career Support",
                desc: "Receive job placement assistance, interview prep, and ongoing career guidance"
              },
              {
                icon: "💰",
                title: "Flexible Payment Plans",
                desc: "Choose from multiple payment options that fit your budget and schedule"
              },
              {
                icon: "🤝",
                title: "Community Network",
                desc: "Join our thriving tech community and connect with peers, mentors, and industry professionals"
              },
              {
                icon: "🏆",
                title: "Recognized Certification",
                desc: "Earn industry-recognized certificates that validate your skills and boost your career"
              }
            ].map((feature, idx) => (
              <div 
                key={idx}
                className="group p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-purple-500/30 transition-all text-center"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location & Format */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl"></div>
            <div className="relative p-10 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-black mb-4">Jos-Based Academy</h3>
                <p className="text-gray-400">Learn in person with hybrid options available</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-black/30 rounded-2xl border border-white/10">
                  <div className="text-3xl mb-3">🏫</div>
                  <h4 className="text-lg font-bold mb-2">Physical Classes</h4>
                  <p className="text-sm text-gray-400">
                    Attend in-person sessions at our state-of-the-art facility in Jos with hands-on equipment and collaborative spaces.
                  </p>
                </div>
                <div className="p-6 bg-black/30 rounded-2xl border border-white/10">
                  <div className="text-3xl mb-3">💻</div>
                  <h4 className="text-lg font-bold mb-2">Hybrid Learning</h4>
                  <p className="text-sm text-gray-400">
                    Can't attend in person? Join remotely with live sessions, recorded classes, and online mentorship support.
                  </p>
                </div>
              </div>
            </div>
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
            Join thousands of students who have launched successful tech careers through our comprehensive 4-6 month intensive program.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <a href="/apply" className="px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-full hover:opacity-90 transition-all transform hover:scale-105 text-xl">
              Apply Now - ₦5,000
            </a>
            <a href="#courses" className="px-12 py-5 border border-white/30 rounded-full hover:bg-white/10 transition-all text-xl">
              View All Courses
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl font-bold text-purple-500 mb-1">5000+</div>
              <div className="text-sm text-gray-500">Students Trained</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl font-bold text-pink-500 mb-1">8</div>
              <div className="text-sm text-gray-500">Available Courses</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-3xl font-bold text-cyan-500 mb-1">4-6</div>
              <div className="text-sm text-gray-500">Months Duration</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

