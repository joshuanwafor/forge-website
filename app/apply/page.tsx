"use client";

import { useState, useEffect } from "react";
import Script from "next/script";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Application fee (same for all courses)
const APPLICATION_FEE = 500000; // ₦5,000 in kobo

const COURSE_NAMES: Record<string, string> = {
  "web-development": "Web Development",
  "mobile-development": "Mobile Development",
  "backend-development": "Backend Development",
  "frontend-development": "Frontend Development",
  "design-mastery": "Design Mastery",
  "digital-marketing": "Digital Marketing & Strategy",
  "wordpress": "WordPress Training",
  "advanced-ai": "Advanced AI"
};

export default function Apply() {
  const [formData, setFormData] = useState({
    fullName: "",
    location: "",
    gender: "",
    phone: "",
    email: "",
    courseOfInterest: "",
    whyInterested: "",
    availability: ""
  });

  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [paystackLoaded, setPaystackLoaded] = useState(false);

  const updateProgress = () => {
    const requiredFields = [
      formData.fullName,
      formData.location,
      formData.gender,
      formData.phone,
      formData.email,
      formData.courseOfInterest,
      formData.whyInterested,
      formData.availability
    ];
    const filled = requiredFields.filter(val => val !== "").length;
    const percentage = (filled / requiredFields.length) * 100;
    setProgress(Math.round(percentage));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTimeout(updateProgress, 0);
  };

  // Handle successful payment
  const onPaymentSuccess = async (reference: any) => {
    console.log('Payment successful:', reference);
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          paymentReference: reference.reference,
          paymentStatus: 'success',
          amountPaid: APPLICATION_FEE / 100 // ₦5,000
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        console.error('Submission failed:', result.error);
        alert('Payment successful but failed to save application. Please contact support with reference: ' + reference.reference);
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('Payment successful but failed to save application. Please contact support with reference: ' + reference.reference);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment close/cancel
  const onPaymentClose = () => {
    console.log('Payment closed');
    setShowPayment(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, Paystack loaded:', paystackLoaded);
    console.log('PaystackPop available:', typeof (window as any).PaystackPop);
    
    if (!paystackLoaded || typeof window === 'undefined' || !(window as any).PaystackPop) {
      console.error('Paystack not ready. Loaded:', paystackLoaded, 'Window:', typeof window);
      alert('Payment system is loading, please try again in a moment.');
      return;
    }
    
    // Show payment indicator
    setShowPayment(true);
    console.log('Opening Paystack payment modal...');
    
    try {
      // Initialize Paystack Popup
      const PaystackPop = (window as any).PaystackPop;
      const handler = PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_xxxxxxxxxxxxxxxx',
        email: formData.email,
        amount: APPLICATION_FEE,
        ref: '' + Math.floor((Math.random() * 1000000000) + 1), // Generate random reference
        metadata: {
          custom_fields: [
            {
              display_name: 'Full Name',
              variable_name: 'full_name',
              value: formData.fullName
            },
            {
              display_name: 'Course',
              variable_name: 'course',
              value: formData.courseOfInterest
            },
            {
              display_name: 'Phone',
              variable_name: 'phone',
              value: formData.phone
            }
          ]
        },
        callback: function(response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          onPaymentSuccess(response);
        },
        onClose: function() {
          // Payment closed
          console.log('Payment closed');
          onPaymentClose();
        }
      });
      
      console.log('Paystack handler created:', handler);
      handler.openIframe();
    } catch (error) {
      console.error('Error initializing Paystack:', error);
      setShowPayment(false);
      alert('Error initializing payment. Please try again or contact support.');
    }
  };

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
              Application Fee Paid! 🎉
            </h1>

            <p className="text-xl text-gray-400 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Your application has been received. Our team will contact you within 24 hours with course details, full pricing, and next steps.
            </p>

            <div className="space-y-4 mb-8">
              <div className="p-6 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl backdrop-blur-sm animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
                <p className="text-sm text-green-400 mb-2">Application Fee Paid:</p>
                <p className="text-3xl font-black text-white">₦5,000</p>
              </div>

              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-fadeInUp" style={{ animationDelay: '0.35s' }}>
                <p className="text-sm text-gray-400 mb-2">Course Applied For:</p>
                <p className="text-lg font-semibold text-white">
                  {formData.courseOfInterest ? COURSE_NAMES[formData.courseOfInterest] : 'N/A'}
                </p>
              </div>
              
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
                <p className="text-sm text-gray-400 mb-2">Confirmation sent to:</p>
                <p className="text-lg font-semibold text-white">{formData.email}</p>
              </div>

              <div className="p-6 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl animate-fadeInUp" style={{ animationDelay: '0.45s' }}>
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm font-semibold text-cyan-400 mb-1">What's Next?</p>
                    <p className="text-xs text-gray-400">
                      Our team will contact you within 24 hours via email and phone with full course details, pricing, and enrollment instructions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <a href="/courses" className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full hover:opacity-90 transition-all">
                View All Courses
              </a>
              <a href="/" className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-all">
                Go Home
              </a>
            </div>
            
            <p className="text-sm text-gray-500 mt-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              📧 Check your email for payment receipt. We'll contact you within 24 hours!
            </p>
          </div>
        </section>

        <Footer />
      </div>
    );
  }

  return (
    <>
      <Script 
        src="https://js.paystack.co/v1/inline.js"
        onLoad={() => {
          console.log('Paystack script loaded successfully');
          setPaystackLoaded(true);
        }}
        onError={(e) => {
          console.error('Failed to load Paystack script:', e);
        }}
        strategy="afterInteractive"
      />
      <div className="bg-black text-white min-h-screen">
        <Header activePage="academy" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full text-sm backdrop-blur-sm font-medium text-orange-400">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            Course Application
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-4">
            Apply for a Course
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Pay ₦5,000 application fee. You'll be contacted within 24 hours with full course details and pricing.
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-400">Progress</span>
              <span className="text-sm font-bold text-orange-400">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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

                {/* Location & Gender */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="City, State"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                    >
                      <option value="" className="bg-black">Select gender</option>
                      <option value="male" className="bg-black">Male</option>
                      <option value="female" className="bg-black">Female</option>
                      <option value="other" className="bg-black">Other</option>
                      <option value="prefer-not-to-say" className="bg-black">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>

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
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                {/* Course of Interest */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Course of Interest <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="courseOfInterest"
                    value={formData.courseOfInterest}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                  >
                    <option value="" className="bg-black">Select a course</option>
                    <option value="web-development" className="bg-black">Web Development</option>
                    <option value="mobile-development" className="bg-black">Mobile Development</option>
                    <option value="backend-development" className="bg-black">Backend Development</option>
                    <option value="frontend-development" className="bg-black">Frontend Development</option>
                    <option value="design-mastery" className="bg-black">Design Mastery (Graphic, UI/UX, 3D, Illustration)</option>
                    <option value="digital-marketing" className="bg-black">Digital Marketing & Strategy</option>
                    <option value="wordpress" className="bg-black">WordPress Training</option>
                    <option value="advanced-ai" className="bg-black">Advanced AI</option>
                  </select>
                  
                  {formData.courseOfInterest && (
                    <div className="mt-3 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-400 mb-1">Application Fee</p>
                          <p className="text-2xl font-bold text-orange-400">₦5,000</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 mb-1">Selected Course</p>
                          <p className="text-sm font-semibold text-white">{COURSE_NAMES[formData.courseOfInterest]}</p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-3">
                        ℹ️ Pay application fee now. Full course details and payment will be shared within 24 hours.
                      </p>
                    </div>
                  )}
                </div>

                {/* Why Interested */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Why are you interested? <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="whyInterested"
                    value={formData.whyInterested}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                    placeholder="Tell us why you want to join this course and what you hope to achieve..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.whyInterested.length} characters
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Availability <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                  >
                    <option value="" className="bg-black">Select your availability</option>
                    <option value="weekdays" className="bg-black">Weekdays (Mon-Fri)</option>
                    <option value="weekends" className="bg-black">Weekends (Sat-Sun)</option>
                    <option value="evenings" className="bg-black">Evenings only</option>
                    <option value="flexible" className="bg-black">Flexible schedule</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={progress < 100 || isSubmitting}
                className={`group relative px-12 py-4 rounded-full font-bold text-lg transition-all transform ${
                  progress === 100 && !isSubmitting
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
                    Processing...
                  </span>
                ) : progress === 100 ? (
                  <>
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                      Pay Application Fee
                      <span className="ml-2 px-3 py-1 bg-white/20 rounded-full text-sm font-bold">
                        ₦5,000
                      </span>
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                  </>
                ) : (
                  "Complete All Fields to Continue"
                )}
              </button>

              <div className="mt-4 p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl space-y-2">
                <p className="text-sm text-cyan-400 font-semibold flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Application Fee: ₦5,000
                </p>
                <p className="text-xs text-gray-400">
                  Pay the application fee now. You'll be contacted within 24 hours with full course details and payment information.
                </p>
                <p className="text-xs text-gray-500 pt-2 border-t border-white/10">
                  By proceeding, you agree to our{" "}
                  <a href="#" className="text-orange-400 hover:text-orange-300 underline">
                    terms and conditions
                  </a>
                  .
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
}
