"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Apply() {
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    email: "",
    phone: "",
    challenge: "",
    hasCourse: "",
    skills: "",
    equity: "",
    likelihood: 5,
    likelihoodReason: ""
  });

  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

  const updateProgress = () => {
    const fields = Object.values(formData);
    const filled = fields.filter(val => val !== "").length;
    const percentage = (filled / fields.length) * 100;
    setProgress(Math.round(percentage));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setTimeout(updateProgress, 0);
  };

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/apply', {
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

  const isStepComplete = () => {
    if (currentStep === 1) {
      return formData.fullName && formData.age && formData.email;
    }
    return true;
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
              Application Submitted! 🎉
            </h1>

            <p className="text-xl text-gray-400 mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Thank you for applying to The Forge Academy. Our team will review your application and get back to you within 48 hours.
            </p>

            <div className="p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm mb-8 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
              <p className="text-sm text-gray-400 mb-2">Confirmation sent to:</p>
              <p className="text-lg font-semibold text-white">{formData.email}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
              <a href="/academy" className="px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-gray-200 transition-all">
                Back to Academy
              </a>
              <a href="/" className="px-8 py-3 border border-white/30 rounded-full hover:bg-white/10 transition-all">
                Go Home
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
        </div>

        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-6 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-full text-sm backdrop-blur-sm font-medium text-orange-400">
            <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            Application Form
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.1] tracking-tight mb-4">
            The Forge Academy
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Apply now to join our elite program where failure is mandatory and success is inevitable.
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
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Personal Information */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
              </div>

              <div className="space-y-6">
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

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                      placeholder="Your age"
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
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white"
                      placeholder="+234 xxx xxx xxxx"
                    />
                  </div>
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
            </div>

            {/* Step 2: Application Questions */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-white font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold">Application Questions</h2>
              </div>

              <div className="space-y-6">
                {/* Question 1 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Question 1 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    What is your current biggest challenge in starting or running a business?
                  </p>
                  <textarea
                    name="challenge"
                    value={formData.challenge}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                    placeholder="Share your biggest challenge..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.challenge.length} characters
                  </div>
                </div>

                {/* Question 2 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Question 2 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    Have you ever invested in any online course or business program before?
                  </p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                      <input
                        type="radio"
                        name="hasCourse"
                        value="yes"
                        checked={formData.hasCourse === "yes"}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span>Yes</span>
                    </label>
                    <label className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
                      <input
                        type="radio"
                        name="hasCourse"
                        value="no"
                        checked={formData.hasCourse === "no"}
                        onChange={handleChange}
                        className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                      />
                      <span>No</span>
                    </label>
                  </div>
                </div>

                {/* Question 3 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Question 3 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    What skills or knowledge do you want to gain from The Forge Academy?
                  </p>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                    placeholder="Describe the skills you want to learn..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.skills.length} characters
                  </div>
                </div>

                {/* Question 4 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Question 4 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    Would you be interested in earning equity while learning real-time business strategies?
                  </p>
                  <textarea
                    name="equity"
                    value={formData.equity}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                    placeholder="Share your thoughts..."
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.equity.length} characters
                  </div>
                </div>

                {/* Question 5 */}
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Question 5 <span className="text-red-500">*</span>
                  </label>
                  <p className="text-sm text-gray-400 mb-3">
                    How likely are you to invest in a hands-on business learning platform like ours?
                  </p>
                  <p className="text-xs text-gray-500 mb-4">
                    Rate from 1 (Not likely) to 10 (Very likely)
                  </p>
                  
                  <div className="flex items-center gap-2 mb-4">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, likelihood: num }));
                          updateProgress();
                        }}
                        className={`flex-1 py-3 rounded-lg font-bold transition-all ${
                          formData.likelihood === num
                            ? "bg-gradient-to-r from-orange-500 to-red-500 text-white scale-110"
                            : "bg-white/5 border border-white/10 hover:bg-white/10"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Please explain your rating
                    </label>
                    <textarea
                      name="likelihoodReason"
                      value={formData.likelihoodReason}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all text-white placeholder-gray-500 resize-none"
                      placeholder="Explain why you chose this rating..."
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      {formData.likelihoodReason.length} characters
                    </div>
                  </div>
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
                    Submitting...
                  </span>
                ) : progress === 100 ? (
                  <>
                    <span className="relative z-10 flex items-center gap-2 justify-center">
                      Submit Application
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 rounded-full"></div>
                  </>
                ) : (
                  "Complete All Fields to Submit"
                )}
              </button>

              <p className="text-xs text-gray-500 mt-4">
                By submitting this application, you agree to our{" "}
                <a href="#" className="text-orange-400 hover:text-orange-300 underline">
                  terms and conditions
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

