"use client";

import { useState } from "react";
import Link from "next/link";

export default function Home() {
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
              <Link href="/" className="hidden md:block text-white transition-colors">
                Hub
              </Link>
              <Link href="/academy" className="hidden md:block text-gray-300 hover:text-white transition-colors">
                Academy
              </Link>
              <Link href="/courses" className="hidden md:block text-gray-300 hover:text-white transition-colors">
                Courses
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Book a Tour
              </button>
              <button className="px-6 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                Membership
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
              <Link href="/" className="block py-2 text-white transition-colors">Hub</Link>
              <Link href="/academy" className="block py-2 text-gray-300 hover:text-white transition-colors">Academy</Link>
              <Link href="/courses" className="block py-2 text-gray-300 hover:text-white transition-colors">Courses</Link>
              <button className="w-full mt-2 px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-colors">
                Book a Tour
              </button>
              <button className="w-full mt-2 px-6 py-2.5 border border-white/30 rounded-full hover:bg-white/10 transition-colors">
                Membership
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-white/5 border border-white/10 rounded-full text-sm">
            Tech Hub & Workspace
          </div>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
            Where Developers
          </h1>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-12 leading-tight bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Build
          </h1>
          
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-12 leading-tight">
            Together
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
            Premium workspace. Private offices. Unlimited coffee.
          </p>
          
          <div className="mb-12">
            <p className="text-lg text-gray-500 mb-4">Code in Community</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-lg">
              Book a Tour
            </button>
            <button className="px-8 py-4 border border-white/30 rounded-full hover:bg-white/10 transition-all text-lg">
              View Plans
            </button>
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm uppercase tracking-wider text-gray-500 mb-4">WHAT WE OFFER</p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 max-w-5xl mx-auto">
              Everything you need to build your next big thing.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { num: "01", title: "Private Offices", desc: "Dedicated spaces for your team with 24/7 access and custom setups" },
              { num: "02", title: "Hot Desks", desc: "Flexible workspace solutions perfect for freelancers and remote workers" },
              { num: "03", title: "Meeting Rooms", desc: "Professional spaces equipped with latest tech for your client calls" },
              { num: "04", title: "High-Speed Internet", desc: "Gigabit fiber connections designed for developers who can't wait" },
              { num: "05", title: "Community Events", desc: "Regular tech talks, hackathons, and networking sessions" }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all group cursor-pointer"
              >
                <div className="text-gray-500 text-sm mb-4">{item.num}</div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-cyan-500 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-full hover:bg-white/10 transition-all text-lg">
              Explore Spaces
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
              Built for developers, designers, and makers who need more than just a desk.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { 
                num: "01",
                badge: "Solo Developers",
                title: "Freelance & Remote",
                points: ["Escape home distractions", "Professional workspace"]
              },
              { 
                num: "02",
                badge: "Startup Teams",
                title: "Growing Companies",
                points: ["Scalable office spaces", "Flexible lease terms"]
              },
              { 
                num: "03",
                badge: "Tech Nomads",
                title: "On-the-Go Coders",
                points: ["Day passes available", "Global network access"]
              },
              { 
                num: "04",
                badge: "Creative Studios",
                title: "Design & Dev Teams",
                points: ["Collaborative spaces", "High-spec equipment"]
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className="p-8 bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl hover:border-cyan-500/50 transition-all group"
              >
                <div className="text-gray-500 text-sm mb-6">{item.num}</div>
                <div className="mb-4 text-xs uppercase tracking-wider text-cyan-500">
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
              Find Your Plan
            </button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="py-8 border-y border-white/10 overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-2xl font-bold mx-8 text-white/20">
              Membership Plans ✦
            </span>
          ))}
        </div>
      </div>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Simple <span className="italic">Pricing.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Day Pass",
                price: "₦5,000",
                period: "/day",
                desc: "Perfect for trying out the space",
                features: ["Hot desk access", "High-speed WiFi", "Coffee & snacks", "Meeting room (2hrs)"],
                highlight: false
              },
              {
                name: "Monthly",
                price: "₦75,000",
                period: "/month",
                desc: "Best for freelancers & remote workers",
                features: ["Dedicated desk", "24/7 access", "Unlimited coffee", "Meeting rooms", "Mail handling", "Community events"],
                highlight: true
              },
              {
                name: "Private Office",
                price: "Custom",
                period: "",
                desc: "For teams that need privacy",
                features: ["Your own office", "Custom setup", "Team lockers", "Priority booking", "Dedicated parking", "Premium support"],
                highlight: false
              }
            ].map((plan, idx) => (
              <div 
                key={idx}
                className={`p-8 rounded-3xl border transition-all ${
                  plan.highlight 
                    ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/50 scale-105' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.desc}</p>
                <div className="mb-8">
                  <span className="text-5xl font-bold">{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start text-gray-300">
                      <svg className="w-5 h-5 mr-2 mt-0.5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-full font-semibold transition-all ${
                  plan.highlight
                    ? 'bg-white text-black hover:bg-gray-200'
                    : 'bg-white/10 hover:bg-white/20'
                }`}>
                  {plan.price === "Custom" ? "Contact Us" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8 inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-sm text-cyan-500">
            Visit Us Today
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Ready to <span className="italic bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">Join?</span>
          </h2>
          
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Visit our space, meet the community, and see why developers love working at Forge Hub.
          </p>

          <button className="px-12 py-5 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 text-xl mb-8">
            BOOK A TOUR
          </button>

          <div className="grid md:grid-cols-2 gap-4 mb-8 max-w-xl mx-auto">
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Available Desks</div>
              <div className="text-2xl font-bold text-green-500">15+</div>
            </div>
            <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Opening Hours</div>
              <div className="text-2xl font-bold text-cyan-500">24/7</div>
            </div>
          </div>

          <p className="text-gray-500 mb-2">
            Contact: <a href="mailto:hello@forgehub.in" className="text-white hover:text-cyan-500 transition-colors">hello@forgehub.in</a>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span>Premium workspace</span>
            <span>•</span>
            <span>Tech community</span>
            <span>•</span>
            <span>Central location</span>
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
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#tour" className="hover:text-white transition-colors">Book Tour</a></li>
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
