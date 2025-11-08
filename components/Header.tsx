"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface HeaderProps {
  activePage: "hub" | "academy" | "courses";
}

export default function Header({ activePage }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const getPageConfig = () => {
    switch (activePage) {
      case "hub":
        return {
          primary: { text: "Book a Tour", href: "#tour" },
          secondary: { text: "Membership", href: "#pricing" },
          gradient: "from-cyan-400 via-blue-500 to-blue-600",
          shadow: "hover:shadow-cyan-500/50"
        };
      case "academy":
        return {
          primary: { text: "Apply", href: "#apply" },
          secondary: { text: "Join Waitlist", href: "#waitlist" },
          gradient: "from-orange-400 via-red-500 to-red-600",
          shadow: "hover:shadow-orange-500/50"
        };
      case "courses":
        return {
          primary: { text: "Enroll Now", href: "#courses" },
          secondary: { text: "View Schedule", href: "#schedule" },
          gradient: "from-purple-400 via-pink-500 to-pink-600",
          shadow: "hover:shadow-purple-500/50"
        };
    }
  };

  const config = getPageConfig();

  const getNavIndicator = (page: typeof activePage) => {
    const gradients = {
      hub: "from-cyan-400 to-blue-500",
      academy: "from-orange-400 to-red-500",
      courses: "from-purple-400 to-pink-500"
    };
    return gradients[page];
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? "bg-black/95 backdrop-blur-xl border-b border-white/20 shadow-2xl shadow-black/50" 
          : "bg-gradient-to-b from-black/90 via-black/80 to-transparent backdrop-blur-md border-b border-white/10"
      }`}
    >
      {/* Ambient gradient glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-10">
            {/* Logo */}
            <Link href="/" className="group relative flex items-center gap-3">
              <div className="relative">
                {/* Logo glow effect */}
                <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500`}></div>
                
                {/* Logo text */}
                <span className="relative text-2xl font-black tracking-tight bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent group-hover:from-cyan-300 group-hover:via-purple-300 group-hover:to-pink-300 transition-all duration-500">
                  FORGE
                </span>
                
                {/* Animated underline */}
                <div className={`absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r ${config.gradient} group-hover:w-full transition-all duration-500 ease-out`}></div>
              </div>
              
              {/* Optional badge */}
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/60 bg-white/5 border border-white/10 rounded-full group-hover:border-white/20 transition-colors">
                Beta
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1">
              {[
                { name: "Hub", path: "/", page: "hub" as const },
                { name: "Academy", path: "/academy", page: "academy" as const },
                { name: "Courses", path: "/courses", page: "courses" as const }
              ].map((item) => (
                <Link 
                  key={item.page}
                  href={item.path} 
                  className={`relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg group ${
                    activePage === item.page 
                      ? "text-white" 
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {/* Hover background glow */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${getNavIndicator(item.page)} opacity-0 group-hover:opacity-10 rounded-lg blur-sm transition-opacity duration-300`}></div>
                  
                  <span className="relative">{item.name}</span>
                  
                  {/* Active indicator */}
                  {activePage === item.page && (
                    <div className="absolute inset-0 rounded-lg">
                      <div className={`absolute bottom-0 left-2 right-2 h-[2px] bg-gradient-to-r ${getNavIndicator(item.page)} shadow-lg`}></div>
                      <div className={`absolute inset-0 bg-gradient-to-r ${getNavIndicator(item.page)} opacity-5 rounded-lg`}></div>
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
          
          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {/* Primary CTA - Gradient Button */}
            <a 
              href={config.primary.href}
              className={`group relative px-6 py-2.5 text-sm font-bold rounded-full overflow-hidden transition-all duration-300 transform hover:scale-105 ${config.shadow}`}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-100 group-hover:opacity-90 transition-opacity`}></div>
              
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Button text */}
              <span className="relative text-white drop-shadow-sm">{config.primary.text}</span>
            </a>

            {/* Secondary CTA - Glass Button */}
            <a 
              href={config.secondary.href}
              className="group relative px-6 py-2.5 text-sm font-semibold rounded-full border border-white/20 hover:border-white/40 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300"
            >
              <span className="relative text-white">{config.secondary.text}</span>
              
              {/* Hover glow */}
              <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-10 rounded-full blur transition-opacity duration-300`}></div>
            </a>
          </div>

          {/* Mobile menu button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative p-2.5 text-white hover:bg-white/10 rounded-xl transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-20 rounded-xl blur transition-opacity duration-300`}></div>
            <svg className="w-6 h-6 relative z-10 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path className="origin-center rotate-0 transition-all duration-300" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-white/10 animate-fadeIn space-y-2">
            {[
              { name: "Hub", path: "/", page: "hub" as const },
              { name: "Academy", path: "/academy", page: "academy" as const },
              { name: "Courses", path: "/courses", page: "courses" as const }
            ].map((item) => (
              <Link 
                key={item.page}
                href={item.path} 
                className={`block py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                  activePage === item.page 
                    ? `text-white bg-gradient-to-r ${getNavIndicator(item.page)} bg-opacity-10 border border-white/20` 
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-4 space-y-2">
              <a 
                href={config.primary.href}
                className={`block w-full px-6 py-3.5 bg-gradient-to-r ${config.gradient} text-white text-center font-bold rounded-xl hover:opacity-90 transition-all transform active:scale-95`}
                onClick={() => setIsMenuOpen(false)}
              >
                {config.primary.text}
              </a>
              <a 
                href={config.secondary.href}
                className="block w-full px-6 py-3.5 border-2 border-white/30 text-center font-semibold rounded-xl hover:bg-white/10 hover:border-white/40 transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                {config.secondary.text}
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

