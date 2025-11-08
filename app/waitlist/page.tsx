"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Waitlist() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    interest: "",
    referral: "",
    message: ""
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Submission failed:', result.error);
        alert('Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.fullName && formData.email && formData.interest;

  if (isSubmitted) {
    return (
      <div className="bg-black text-white min-h-screen">
        <Header activePage="academy" />

        <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
          {/* Animated Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>
          </div>

          <div className="max-w-2xl mx-auto text-center relative z-10">
            <div className="mb-8 inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full animate-fadeInUp">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-4xl md:text-5xl font-black mb-4 animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              You're on the List! 🎉
            </h1>

            <p className="text-xl text-gray-400 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Thank you for joining the waitlist. We'll reach out to you soon with exclusive updates and early access opportunities.
            </p>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-gray-400 mb-2">We sent a confirmation email to:</p>
              <p className="text-lg font-semibold text-white">{formData.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <a href="/" className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all">
                Back to Home
              </a>
              <a href="/academy" className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-all">
                Explore Academy
              </a>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Header activePage="academy" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-float"
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

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <div className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full text-sm backdrop-blur-sm font-medium text-orange-400 shadow-lg shadow-orange-500/10">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            Join the Waitlist
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.1] tracking-tight mb-6">
            <span className="block">Be the First to</span>
            <span className="block bg-gradient-to-r from-orange-400 via-red-500 to-orange-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              Experience Forge
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            Get early access to exclusive programs, special discounts, and be part of the founding community.
          </p>

          <div className="flex items-center justify-center gap-8 mb-8">
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                1000+
              </div>
              <div className="text-sm text-gray-500">On Waitlist</div>
            </div>
            <div className="w-px h-12 bg-white/10"></div>
            <div className="text-center">
              <div className="text-3xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
                50
              </div>
              <div className="text-sm text-gray-500">Spots Left</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="+234"
                    />
                  </div>
                </div>

                {/* Interest */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    I'm interested in <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                  >
                    <option value="" className="bg-black">Select an option</option>
                    <option value="hub" className="bg-black">Hub (Workspace)</option>
                    <option value="academy" className="bg-black">Academy (Startup Program)</option>
                    <option value="courses" className="bg-black">Courses (Training)</option>
                    <option value="all" className="bg-black">All of the above</option>
                  </select>
                </div>

                {/* How did you hear about us */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    How did you hear about us?
                  </label>
                  <select
                    name="referral"
                    value={formData.referral}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                  >
                    <option value="" className="bg-black">Select an option</option>
                    <option value="social" className="bg-black">Social Media</option>
                    <option value="friend" className="bg-black">Friend/Colleague</option>
                    <option value="search" className="bg-black">Google Search</option>
                    <option value="event" className="bg-black">Event/Conference</option>
                    <option value="other" className="bg-black">Other</option>
                  </select>
                </div>

                {/* Additional Message */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Anything you'd like to share? (Optional)
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                    placeholder="Tell us what you're looking forward to..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.message.length} characters
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`group relative px-12 py-4 rounded-full font-bold text-lg transition-all transform ${
                  isFormValid && !isSubmitting
                    ? "bg-gradient-to-r from-orange-500 to-red-600 text-white hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/50"
                    : "bg-white/10 text-gray-500 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Joining...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                      Join Waitlist
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                    {isFormValid && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                    )}
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4">
                By joining, you agree to receive updates from Forge. Unsubscribe anytime.
              </p>
            </div>
          </form>

          {/* Benefits */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Early Access",
                desc: "Be first to know about new programs"
              },
              {
                icon: "💰",
                title: "Special Discounts",
                desc: "Exclusive pricing for waitlist members"
              },
              {
                icon: "🎁",
                title: "Bonus Content",
                desc: "Free resources and training materials"
              }
            ].map((benefit, idx) => (
              <div key={idx} className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="text-4xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-400">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

