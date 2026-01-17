import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const workRef = useRef(null);
  const portraitRef = useRef(null);
  const emailSectionRef = useRef(null);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const [emailRevealed, setEmailRevealed] = useState(false);

  const intents = [
    { 
      id: 'product', 
      label: 'Build a product together',
      subject: 'Let\'s build something together'
    },
    { 
      id: 'project', 
      label: 'Discuss a project idea',
      subject: 'I have a project idea to discuss'
    },
    { 
      id: 'collaborate', 
      label: 'Explore collaboration',
      subject: 'Collaboration opportunity'
    },
    { 
      id: 'hello', 
      label: 'Just say hello',
      subject: 'Hello from your portfolio'
    },
  ];

  const email = 'baodhankaratharva@gmail.com';

  const handleIntentSelect = (intent) => {
    if (selectedIntent?.id === intent.id) return;
    
    setSelectedIntent(intent);
    setEmailCopied(false);
    
    if (!emailRevealed) {
      setEmailRevealed(true);
      gsap.fromTo(emailSectionRef.current, 
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out', delay: 0.3 }
      );
    }
    
    if (portraitRef.current) {
      gsap.to(portraitRef.current, {
        scale: 1.05,
        duration: 1.5,
        ease: 'power2.out'
      });
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      
      if (portraitRef.current) {
        gsap.to(portraitRef.current, {
          scale: 1.08,
          duration: 0.8,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1
        });
      }
      
      setTimeout(() => setEmailCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(selectedIntent?.subject || 'Hello')}`;
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.work-headline', {
        opacity: 0,
        y: 40,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-headline',
          start: 'top 80%',
          end: 'top 50%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      gsap.from('.work-question', {
        opacity: 0,
        y: 20,
        duration: 1.4,
        ease: 'power2.out',
        delay: 0.3,
        scrollTrigger: {
          trigger: '.work-question',
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      gsap.from('.intent-card', {
        opacity: 0,
        y: 15,
        stagger: 0.15,
        duration: 1,
        ease: 'power2.out',
        delay: 0.6,
        scrollTrigger: {
          trigger: '.intent-cards-container',
          start: 'top 75%',
          end: 'top 55%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      gsap.from('.work-portrait', {
        opacity: 0,
        scale: 0.95,
        duration: 2,
        ease: 'power2.out',
        delay: 0.8,
        scrollTrigger: {
          trigger: workRef.current,
          start: 'top 70%',
          end: 'top 40%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      // Enhanced parallax effect for image - Strong movement
      gsap.fromTo(
        '.work-portrait',
        { y: '-80px' },
        { 
          y: '80px', 
          scrollTrigger: { 
            trigger: workRef.current, 
            scrub: 0.5,
            invalidateOnRefresh: true 
          } 
        }
      );
    }, workRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="work" 
      ref={workRef} 
      className="relative min-h-screen py-16 md:py-24 overflow-hidden bg-gradient-to-br from-[#fafafa] to-[#f5f5f5]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 min-h-screen items-center">
          
          {/* Left Column - Work Content */}
          <div className="lg:col-span-7 space-y-12 lg:pr-8">
            
            {/* Headline with Scramble Effect */}
            <div className="space-y-6">
              <h1 className="work-headline font-arsenica text-[3.5rem] md:text-[5rem] lg:text-[6.5rem] xl:text-[7.5rem] leading-[0.9] tracking-tight text-gray-900">
                Let's create
                <br />
                something together
              </h1>
              
              <div className="w-24 h-1 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full"></div>
            </div>

            {/* Question */}
            <p className="work-question text-[1.4rem] md:text-[1.8rem] lg:text-[2rem] text-gray-600 font-light leading-relaxed max-w-2xl">
              {selectedIntent ? 
                `Perfect. I'd love to ${selectedIntent.label.toLowerCase()}.` : 
                'What brings you here today?'
              }
            </p>

            {/* Intent Cards - Modern Grid */}
            <div className="intent-cards-container space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                {intents.map((intent, index) => (
                  <button
                    key={intent.id}
                    onClick={() => handleIntentSelect(intent)}
                    className={`intent-card group relative text-left px-8 py-6 rounded-2xl border transition-all duration-500 ease-out overflow-hidden ${
                      selectedIntent?.id === intent.id
                        ? 'border-gray-900 bg-gray-900 text-white shadow-2xl scale-[1.02]'
                        : 'border-gray-200 bg-white/80 backdrop-blur-sm text-gray-800 hover:border-gray-400 hover:shadow-xl hover:scale-[1.01] hover:bg-white'
                    }`}
                  >
                    {/* Gradient overlay for selected state */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-700 transition-opacity duration-500 ${
                      selectedIntent?.id === intent.id ? 'opacity-100' : 'opacity-0'
                    }`}></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      <span className="block text-[1.3rem] md:text-[1.5rem] font-semibold leading-tight">
                        {intent.label}
                      </span>
                      <div className={`mt-2 text-sm opacity-70 transition-all duration-300 ${
                        selectedIntent?.id === intent.id ? 'text-gray-200' : 'text-gray-500'
                      }`}>
                        0{index + 1}
                      </div>
                    </div>
                    
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Section - Modern Design */}
            <div 
              ref={emailSectionRef} 
              className={`space-y-8 transition-all duration-1000 ${emailRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <div className="space-y-6 p-8 rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[1.2rem] text-gray-500 font-medium">
                    {selectedIntent ? 'Ready when you are' : 'Get in touch'}
                  </p>
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  <a 
                    href={`mailto:${email}?subject=${encodeURIComponent(selectedIntent?.subject || 'Hello')}`}
                    className="text-[1.6rem] md:text-[2rem] lg:text-[2.2rem] font-arsenica text-gray-900 hover:text-gray-600 transition-colors duration-300 leading-tight"
                  >
                    {email}
                  </a>
                  
                  <button
                    onClick={handleCopyEmail}
                    className="px-6 py-3 text-[1.1rem] font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {emailCopied ? '✓ Copied!' : 'Copy email'}
                  </button>
                </div>
              </div>

              {/* Social Links - Minimal Modern */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                  <span className="text-[1rem] text-gray-400 font-medium">Connect</span>
                  
                  {[
                    { href: "https://github.com/atharvabaodhankar", icon: "fa-github", label: "GitHub" },
                    { href: "https://www.linkedin.com/in/atharva-baodhankar", icon: "fa-linkedin-in", label: "LinkedIn" },
                    { href: "https://www.instagram.com/op_athu_/", icon: "fa-instagram", label: "Instagram" },
                    { href: "https://www.facebook.com/profile.php?id=100069517304222", icon: "fa-facebook-f", label: "Facebook" }
                  ].map((social, index) => (
                    <a 
                      key={index}
                      href={social.href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 hover:scale-110"
                      aria-label={social.label}
                    >
                      <i className={`fa-brands ${social.icon} text-[1.2rem] text-gray-600 group-hover:text-white transition-colors duration-300`}></i>
                    </a>
                  ))}
                </div>
                
                <div className="text-[1rem] text-gray-400 font-light">
                  Solapur, Maharashtra
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image with Strong Parallax */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-screen flex items-center justify-center">
            <div className="relative w-full max-w-[450px] h-[600px] lg:h-[700px]">
              
              {/* Background Elements */}
              <div className="absolute -top-4 -right-4 w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-40 blur-lg"></div>
              
              {/* Main Image Container */}
              <div className="relative w-full h-full">
                <div ref={portraitRef} className="work-portrait relative w-full h-full group">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent rounded-3xl z-10"></div>
                  <img 
                    src="/src/assets/imgs/navBar-img.jpg" 
                    alt="Atharva Baodhankar" 
                    className="w-full h-full object-cover rounded-3xl shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
                  />
                  
                  {/* Floating Badge */}
                  <div className="absolute bottom-6 left-6 z-20 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                    <span className="text-sm font-semibold text-gray-900">Available for work</span>
                  </div>
                </div>
              </div>
              
              {/* Decorative Grid */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                  backgroundSize: '30px 30px'
                }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Work;
