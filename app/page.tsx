import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-black text-white min-h-screen">
      <Header activePage="hub" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Large Gradient Orbs with Movement */}
          <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-cyan-500/40 rounded-full blur-3xl animate-blob"></div>
          <div className="absolute top-1/3 -right-32 w-[600px] h-[600px] bg-blue-500/40 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
          
          {/* Rotating Gradient Mesh */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 via-transparent to-blue-500/30 animate-spin-slow"></div>
          </div>
          
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff15_1px,transparent_1px),linear-gradient(to_bottom,#ffffff15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-grid-flow"></div>
          
          {/* Animated Beams */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-full left-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-500/60 to-transparent animate-beam" style={{ animationDelay: '0s' }}></div>
            <div className="absolute -top-full left-1/2 w-1 h-full bg-gradient-to-b from-transparent via-blue-500/60 to-transparent animate-beam" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute -top-full right-1/3 w-1 h-full bg-gradient-to-b from-transparent via-purple-500/60 to-transparent animate-beam" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(40)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-cyan-400/60 rounded-full animate-float shadow-lg shadow-cyan-400/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${10 + Math.random() * 20}s`
                }}
              ></div>
            ))}
          </div>
          
          {/* Moving Gradient Waves */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 bg-gradient-to-t from-cyan-500/40 via-transparent to-transparent animate-wave"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/40 via-transparent to-transparent animate-wave" style={{ animationDelay: '3s' }}></div>
          </div>
          
          {/* Gradient Mesh Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/80"></div>
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="mb-10 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-full text-sm backdrop-blur-sm font-medium text-cyan-400 shadow-lg shadow-cyan-500/10 animate-fadeInUp">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
            Tech Hub & Workspace
          </div>
          
          <div className="mb-6 space-y-2">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp">
              <span className="block">Where Developers</span>
            </h1>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(34,211,238,0.3)]">
                Build
              </span>
            </h1>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[1.1] tracking-tight animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              <span className="block">Together</span>
          </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-gray-400 mb-6 max-w-3xl mx-auto leading-relaxed font-light animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            Premium workspace. Private offices. Unlimited coffee.
          </p>
          
          <div className="mb-12 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 border-2 border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 border-2 border-black"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 border-2 border-black"></div>
              </div>
              <span className="text-sm font-medium text-gray-300">Join 500+ developers</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
            <button className="group relative px-10 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full transition-all transform hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/50 text-lg overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                Book a Tour
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </button>
            <button className="group px-10 py-4 border-2 border-white/30 rounded-full hover:bg-white/10 hover:border-white/50 transition-all text-lg backdrop-blur-sm font-semibold relative overflow-hidden">
              <span className="relative z-10 flex items-center gap-2">
                View Plans
                <svg className="w-5 h-5 group-hover:rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Flexible <span className="italic">Pricing.</span>
            </h2>
            <p className="text-xl text-gray-400">Choose the plan that works best for you</p>
          </div>

          {/* Normal Workspace */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Normal Workspace</h3>
              <p className="text-gray-500 text-sm">Shared coworking space</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                <div className="text-center mb-8">
                  <div className="h-6 mb-3"></div>
                  <div className="text-sm text-gray-500 mb-2">Daily Rate</div>
                  <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                    ₦2,000
                  </div>
                  <div className="text-gray-400 text-sm">/day</div>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Hot desk access
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-speed WiFi
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Coffee & refreshments
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Community access
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all">
                  Get Started
                </button>
              </div>

              <div className="flex flex-col p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                <div className="text-center mb-8">
                  <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-semibold mb-3">
                    SAVE 30%
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Weekly Rate</div>
                  <div className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-1">
                    ₦10,000
                  </div>
                  <div className="text-gray-400 text-sm">/week</div>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All daily pass benefits
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    7 days of access
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Meeting room access
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Better value per day
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Private Workspace */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Private Workspace</h3>
              <p className="text-gray-500 text-sm">Your own dedicated office</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-3xl hover:border-blue-500/50 transition-all">
                <div className="text-center mb-8">
                  <div className="h-6 mb-3"></div>
                  <div className="text-sm text-gray-500 mb-2">Daily Rate</div>
                  <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-1">
                    ₦6,000
                  </div>
                  <div className="text-gray-400 text-sm">/day</div>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Private office space
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Full privacy & security
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    High-speed WiFi
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Premium amenities
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all">
                  Get Started
                </button>
              </div>

              <div className="flex flex-col p-8 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-3xl hover:border-blue-500/50 transition-all">
                <div className="text-center mb-8">
                  <div className="inline-block px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full text-xs text-green-400 font-semibold mb-3">
                    BEST VALUE
                  </div>
                  <div className="text-sm text-gray-500 mb-2">Weekly Rate</div>
                  <div className="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-1">
                    ₦42,000
                  </div>
                  <div className="text-gray-400 text-sm">/week</div>
                </div>
                <ul className="space-y-3 flex-grow">
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    All daily benefits
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    7 days of private space
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save ₦6,000/week
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all">
                  Get Started
                </button>
              </div>
            </div>
          </div>

          {/* Monthly Plans */}
          <div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Monthly Membership</h3>
              <p className="text-gray-500 text-sm">Long-term commitment plans</p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <div className="flex flex-col p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all">
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold mb-2">Business Hours</h4>
                  <p className="text-gray-400 text-sm mb-4">9 AM - 6 PM, Monday to Friday</p>
                  <div className="text-5xl font-bold mb-1">₦40,000</div>
                  <div className="text-gray-400 text-sm">/month</div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated desk
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    9 AM - 6 PM access
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited coffee
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Meeting room access
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Community events
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-all">
                  Get Started
                </button>
              </div>

              <div className="relative flex flex-col p-8 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/50 rounded-3xl transform md:scale-105">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full text-xs font-bold text-white shadow-lg">
                  MOST POPULAR
                </div>
                <div className="text-center mb-8">
                  <h4 className="text-xl font-bold mb-2">24/7 Access</h4>
                  <p className="text-gray-400 text-sm mb-4">Round-the-clock workspace access</p>
                  <div className="text-5xl font-bold mb-1">₦120,000</div>
                  <div className="text-gray-400 text-sm">/month</div>
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Dedicated desk
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    24/7 access
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Unlimited coffee & snacks
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Meeting rooms included
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Mail handling
                  </li>
                  <li className="flex items-start text-gray-300 text-sm">
                    <svg className="w-5 h-5 mr-3 mt-0.5 text-cyan-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                </ul>
                <button className="w-full mt-6 py-3 bg-white text-black hover:bg-gray-200 rounded-full font-semibold transition-all">
                  Get Started
                </button>
              </div>
            </div>
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

      <Footer />
    </div>
  );
}
