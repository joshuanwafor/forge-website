"use client";

import { useState } from "react";
import Link from "next/link";

export default function Academy() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
              <Link href="/academy" className="hidden md:block text-white transition-colors">
                Academy
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Apply
              </button>
              <button className="px-6 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                Join Waitlist
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
              <Link href="/academy" className="block py-2 text-white transition-colors">Academy</Link>
              <button className="w-full mt-2 px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Apply
              </button>
              <button className="w-full mt-2 px-6 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                Join Waitlist
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
            Founder's Journey
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            The Only Academy Where
          </h1>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-12 leading-tight bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
            Failure
          </h1>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-12 leading-tight">
            is Mandatory
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Real teams. Real clients. Real equity.
          </p>
          
          <div className="mb-12">
            <p className="text-lg text-gray-500 mb-4">We Make You Know</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-lg">
              Apply
            </button>
            <button className="px-8 py-4 border border-white/30 rounded-full hover:bg-white/10 transition-all text-lg">
              Join Waitlist
            </button>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">WHAT WE DO</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-5xl mx-auto">
              Revolutionary approach where theory meets practice in the most demanding environments.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: "01", title: "Run Real Companies", desc: "Not case studies — you'll lead real projects with real stakes like you're the CEO" },
              { num: "02", title: "Earn Equity as You Learn", desc: "Get actual ownership in the companies you help build" },
              { num: "03", title: "Switch Roles Weekly", desc: "Experience every aspect of running a startup" },
              { num: "04", title: "Get Mentored by Founders", desc: "Learn directly from those who've built successful companies" },
              { num: "05", title: "Track Progress Like a Game", desc: "Gamified learning with real-world achievements" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className="text-gray-500 text-sm mb-4">{item.num}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-orange-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 transition-all text-lg">
              Experience the Future
            </button>
          </div>
        </div>
      </section>

      {/* Who It's For Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">WHO IT'S FOR</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Elite pathways designed for those who demand excellence<br />and refuse to settle for conventional learning experiences.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                num: "01",
                badge: "Academic Excellence Redefined",
                title: "Students tired of theory",
                points: ["Hands-on experience", "Real startup environments"]
              },
              { 
                num: "02",
                badge: "Vision Meets Execution",
                title: "Aspiring entrepreneurs",
                points: ["Build without risking money", "Learn by doing"]
              },
              { 
                num: "03",
                badge: "Innovation Without Limits",
                title: "Creators & hustlers",
                points: ["Explore startup roles", "Expand your expertise"]
              },
              { 
                num: "04",
                badge: "Performance Over Theory",
                title: "Action-based learners",
                points: ["Learn by doing", "Immersive approach"]
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-orange-500/50 transition-all group"
              >
                <div className="text-gray-500 text-sm mb-6">{item.num}</div>
                <div className="mb-4 text-xs uppercase tracking-wider text-orange-500">
                  {item.badge}
                </div>
                <h3 className="text-2xl font-bold mb-6">{item.title}</h3>
                <ul className="space-y-2">
                  {item.points.map((point, i) => (
                    <li key={i} className="text-gray-400 flex items-start">
                      <span className="mr-2">→</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-lg">
              Begin Assessment
            </button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-y border-white/10 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-bold mx-8 text-white/20">
              How It Works ✦
            </span>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Real <span className="italic">Business.</span>
            </h2>
          </div>

          <div className="space-y-12">
            {[
              {
                step: "Step 1",
                title: "Choose Your Business Niche",
                desc: "Browse live startup models inside the academy and join the one that aligns with your interests."
              },
              {
                step: "Step 2",
                title: "Knowledge Grill",
                desc: "Before you take action, you'll go through a 3-day crash course—just enough to start confidently, not endlessly."
              },
              {
                step: "Step 3",
                title: "Execute in Real-Time",
                desc: "Start managing the business: handle real tasks, join client meetings, and work like a startup team member."
              },
              {
                step: "Step 4",
                title: "Weekly Role Rotations",
                desc: "Every 7 days, you'll switch your role. Marketing this week, sales the next, and operations after that."
              },
              {
                step: "Step 5",
                title: "You Become an Experienced Business Owner",
                desc: "You walk away with equity ownership in a real company and practical experience across departments."
              }
            ].map((item, idx) => (
              <div 
                key={idx}
                className="grid md:grid-cols-2 gap-8 items-center p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all"
              >
                <div>
                  <div className="text-sm text-orange-500 mb-4">{item.step}</div>
                  <h3 className="text-3xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed">{item.desc}</p>
                </div>
                <div className="h-64 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center border border-white/10">
                  <span className="text-6xl font-bold text-white/10">{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-sm text-orange-500">
            Exclusive Invitation
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            You've Been <span className="italic bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Selected</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            The academy identifies and cultivates exceptional talent. Those prepared to commit, persist through adversity, and build lasting value.
          </p>

          <button className="px-12 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-xl mb-8">
            APPLY NOW
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-xl mx-auto">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Application Status</div>
              <div className="text-2xl font-bold text-green-500">OPEN</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Capacity</div>
              <div className="text-2xl font-bold text-orange-500">LIMITED</div>
            </div>
          </div>

          <p className="text-gray-500 mb-2">
            Contact: <a href="mailto:support@theforgeacademy.in" className="text-white hover:text-orange-500 transition-colors">support@theforgeacademy.in</a>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>Commitment required</span>
            <span>•</span>
            <span>Results guaranteed</span>
            <span>•</span>
            <span>Elite network access</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center text-gray-500">
          <p className="text-2xl font-bold text-white mb-4">FORGE</p>
          <p className="text-sm">© 2025 The Forge Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

