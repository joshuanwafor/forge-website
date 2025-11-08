"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  const team = [
    {
      name: "David Okechukwu",
      role: "Founder & CEO",
      bio: "Serial entrepreneur with 10+ years building and scaling tech companies. Passionate about democratizing startup education.",
      gradient: "from-cyan-400 to-blue-600",
      image: "👨‍💼"
    },
    {
      name: "Sarah Johnson",
      role: "Head of Academy",
      bio: "Former startup founder turned educator. Believes in learning through failure and practical experience.",
      gradient: "from-orange-400 to-red-600",
      image: "👩‍🏫"
    },
    {
      name: "Michael Chen",
      role: "Head of Operations",
      bio: "Operations expert who has helped 50+ startups optimize their processes and scale efficiently.",
      gradient: "from-purple-400 to-pink-600",
      image: "👨‍💻"
    },
    {
      name: "Amara Williams",
      role: "Community Manager",
      bio: "Community builder extraordinaire. Creates spaces where developers and entrepreneurs thrive together.",
      gradient: "from-green-400 to-emerald-600",
      image: "👩‍💼"
    },
    {
      name: "James Okonkwo",
      role: "Lead Instructor",
      bio: "Full-stack developer and startup advisor. Teaches practical skills that actually matter in real businesses.",
      gradient: "from-blue-400 to-cyan-600",
      image: "👨‍🎓"
    },
    {
      name: "Lisa Anderson",
      role: "Head of Design",
      bio: "Award-winning designer who believes great design drives business success. Creates memorable user experiences.",
      gradient: "from-pink-400 to-purple-600",
      image: "👩‍🎨"
    }
  ];

  const stats = [
    { number: "5000+", label: "Students Trained", icon: "👥" },
    { number: "100+", label: "Companies Built", icon: "🏢" },
    { number: "₦2B+", label: "Revenue Generated", icon: "💰" },
    { number: "95%", label: "Success Rate", icon: "📈" }
  ];

  const values = [
    {
      title: "Failure First",
      description: "We believe the fastest way to success is through calculated failure. Learn what doesn't work, then iterate.",
      icon: "🔥",
      gradient: "from-orange-500 to-red-600"
    },
    {
      title: "Real Results",
      description: "No theory. No fluff. Just real projects with real clients generating real revenue.",
      icon: "💎",
      gradient: "from-cyan-500 to-blue-600"
    },
    {
      title: "Community Driven",
      description: "Success is a team sport. We build together, learn together, and grow together.",
      icon: "🤝",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Equity for All",
      description: "Everyone who contributes gets a piece of the pie. Your work = your ownership.",
      icon: "🎯",
      gradient: "from-green-500 to-emerald-600"
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen">
      <Header activePage="hub" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-400/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              ></div>
            ))}
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full text-sm backdrop-blur-sm font-medium text-cyan-400 shadow-lg shadow-cyan-500/10 animate-fadeInUp">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            About Forge
          </div>
          
          <div className="mb-6 space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp">
              <span className="block">Where Ideas Become</span>
            </h1>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="block bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                Reality
              </span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-4xl mx-auto leading-relaxed font-light animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            We're building the future of tech education in Nigeria. A place where developers collaborate, entrepreneurs learn by doing, and everyone gets equity in what they build.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div 
                key={idx}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-center">
                  <div className="text-4xl mb-3">{stat.icon}</div>
                  <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Our Mission
              </h2>
              <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                To democratize startup education and create opportunities for African developers and entrepreneurs to build real businesses, gain real experience, and earn real equity.
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                We're tired of courses that teach theory without practice. Tired of programs that promise everything but deliver nothing. Tired of education that doesn't translate to real-world success.
              </p>
              <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-full">
                <span className="text-2xl">🚀</span>
                <span className="font-semibold">Building the future, together</span>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
              <div className="relative p-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      💡
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Learn by Doing</h3>
                      <p className="text-gray-400 text-sm">Work on real projects with real clients from day one.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🎯
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Own What You Build</h3>
                      <p className="text-gray-400 text-sm">Get equity in every company you help create.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🌟
                    </div>
                    <div>
                      <h3 className="font-bold text-lg mb-2">Community First</h3>
                      <p className="text-gray-400 text-sm">Join a network of ambitious builders and makers.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Our Values</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <div 
                key={idx}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${value.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
                <div className="relative p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all h-full">
                  <div className="text-5xl mb-4">{value.icon}</div>
                  <h3 className={`text-xl font-bold mb-3 bg-gradient-to-r ${value.gradient} bg-clip-text text-transparent`}>
                    {value.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-4">Meet the Team</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              The people making it all happen
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div 
                key={idx}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${member.gradient} rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                
                <div className="relative p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all">
                  {/* Avatar */}
                  <div className="mb-6 relative">
                    <div className={`w-24 h-24 mx-auto bg-gradient-to-r ${member.gradient} rounded-2xl flex items-center justify-center text-5xl transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                      {member.image}
                    </div>
                    <div className={`absolute inset-0 mx-auto w-24 h-24 bg-gradient-to-r ${member.gradient} rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                  </div>

                  {/* Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                    <p className={`text-sm font-semibold mb-4 bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent`}>
                      {member.role}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 mt-6">
                    <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-center transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-center transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a href="#" className="w-8 h-8 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-lg flex items-center justify-center transition-all">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-3xl blur-3xl opacity-20"></div>
            <div className="relative p-12 bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl backdrop-blur-sm">
              <h2 className="text-3xl md:text-4xl font-black mb-4">
                Ready to Build with Us?
              </h2>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join our community of developers, entrepreneurs, and makers who are building the future.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/apply" className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-full transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 text-lg overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Join Forge
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
                </a>
                <a href="mailto:hello@forge.com" className="group px-10 py-4 border-2 border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 transition-all text-lg backdrop-blur-sm font-semibold relative overflow-hidden">
                  <span className="relative z-10 flex items-center gap-2 justify-center">
                    Get in Touch
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

