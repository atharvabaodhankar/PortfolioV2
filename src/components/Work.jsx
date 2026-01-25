import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import workImg from '../assets/imgs/work.png';

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const workRef = useRef(null);
  const portraitRef = useRef(null);
  const emailSectionRef = useRef(null);
  const tiltRef = useRef(null);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);

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

  const handleMouseMove = (e) => {
    if (!tiltRef.current) return;

    const { left, top, width, height } = tiltRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;

    gsap.to(tiltRef.current, {
      rotationY: -x * 20, // Negative to pull towards mouse
      rotationX: y * 20,  // Positive to pull towards mouse (since y is inverted in DOM)
      transformPerspective: 1000,
      scale: 1.02,
      ease: 'power2.out',
      duration: 0.5,
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    if (!tiltRef.current) return;
    
    gsap.to(tiltRef.current, {
      rotationY: 0,
      rotationX: 0,
      scale: 1,
      ease: 'power2.out',
      duration: 1,
      overwrite: 'auto'
    });
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Responsive animation values
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      const isTablet = window.matchMedia('(max-width: 1024px)').matches;
      
      // Set initial states to ensure visibility
      gsap.set('.work-headline', { opacity: 1, y: 0 });
      gsap.set('.work-question', { opacity: 1, y: 0 });
      gsap.set('.intent-card', { opacity: 1, y: 0 });
      gsap.set('.work-portrait', { opacity: 1, scale: 1 });
      
      // Fallback timeout to ensure visibility
      const fallbackTimeout = setTimeout(() => {
        gsap.set('.intent-card', { opacity: 1, y: 0, clearProps: 'all' });
        gsap.set('.work-headline', { opacity: 1, y: 0, clearProps: 'all' });
        gsap.set('.work-question', { opacity: 1, y: 0, clearProps: 'all' });
        gsap.set('.work-portrait', { opacity: 1, scale: 1, clearProps: 'all' });
      }, 1000);
      
      // Animate from visible state for better reliability
      gsap.fromTo('.work-headline', 
        { opacity: 0, y: isMobile ? 30 : 40 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 1.4 : 1.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.work-headline',
            start: isMobile ? 'top 85%' : 'top 80%',
            end: isMobile ? 'top 60%' : 'top 50%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          },
        }
      );

      gsap.fromTo('.work-question',
        { opacity: 0, y: isMobile ? 15 : 20 },
        {
          opacity: 1,
          y: 0,
          duration: isMobile ? 1.2 : 1.4,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: '.work-question',
            start: isMobile ? 'top 85%' : 'top 80%',
            end: isMobile ? 'top 65%' : 'top 60%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          },
        }
      );

      gsap.fromTo('.intent-card',
        { opacity: 0, y: isMobile ? 10 : 15 },
        {
          opacity: 1,
          y: 0,
          stagger: isMobile ? 0.1 : 0.15,
          duration: isMobile ? 0.8 : 1,
          ease: 'power2.out',
          delay: 0.4,
          scrollTrigger: {
            trigger: '.intent-cards-container',
            start: isMobile ? 'top 90%' : 'top 85%',
            end: isMobile ? 'top 70%' : 'top 65%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          },
        }
      );

      gsap.fromTo('.work-portrait',
        { opacity: 0, scale: isMobile ? 0.98 : 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: isMobile ? 1.6 : 2,
          ease: 'power2.out',
          delay: 0.6,
          scrollTrigger: {
            trigger: workRef.current,
            start: isMobile ? 'top 85%' : 'top 80%',
            end: isMobile ? 'top 60%' : 'top 50%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true
          },
        }
      );

      // Parallax effect for all devices (including mobile)
      gsap.fromTo(
        '.work-portrait',
        { y: '-10%' },
        { 
          y: '10%', 
          scrollTrigger: { 
            trigger: workRef.current, 
            scrub: 1,
            invalidateOnRefresh: true 
          } 
        }
      );

      // Responsive refresh on window resize
      const handleResize = () => {
        ScrollTrigger.refresh();
      };

      window.addEventListener('resize', handleResize);
      
      return () => {
        clearTimeout(fallbackTimeout);
        window.removeEventListener('resize', handleResize);
      };
    }, workRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="work" 
      ref={workRef} 
      className="relative min-h-screen py-12 sm:py-16 md:py-20 lg:py-24 overflow-hidden bg-white"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 min-h-screen items-center">
          
          {/* Left Column - Work Content */}
          <div className="lg:col-span-7 space-y-8 sm:space-y-10 md:space-y-12 lg:pr-8 order-2 lg:order-1">
            
            {/* Headline with Scramble Effect */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="work-headline font-arsenica text-[2.5rem] xs:text-[3rem] sm:text-[3.5rem] md:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem] 2xl:text-[7.5rem] leading-[0.85] sm:leading-[0.9] tracking-tight text-gray-900">
                Let's create
                <br />
                something together
              </h1>
              
              <div className="w-16 sm:w-20 md:w-24 h-0.5 sm:h-1 bg-gradient-to-r from-gray-900 to-gray-600 rounded-full"></div>
            </div>

            {/* Question */}
            <p className="work-question text-[1.1rem] xs:text-[1.2rem] sm:text-[1.4rem] md:text-[1.6rem] lg:text-[1.8rem] xl:text-[2rem] text-gray-600 font-light leading-relaxed max-w-2xl">
              {selectedIntent ? 
                `Perfect. I'd love to ${selectedIntent.label.toLowerCase()}.` : 
                'What brings you here today?'
              }
            </p>

            {/* Intent Cards - Responsive Grid */}
            <div className="intent-cards-container">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 max-w-2xl">
                {intents.map((intent, index) => (
                  <button
                    key={intent.id}
                    onClick={() => handleIntentSelect(intent)}
                    className={`intent-card text-left px-4 sm:px-5 md:px-6 py-4 sm:py-5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 ease-out ${
                      selectedIntent?.id === intent.id
                        ? 'border-black bg-black text-white shadow-xl scale-[1.01]'
                        : 'border-gray-200 bg-white text-black hover:border-gray-300 hover:shadow-md hover:scale-[1.005]'
                    }`}
                  >
                    <span className="block text-[1.1rem] xs:text-[1.2rem] sm:text-[1.3rem] md:text-[1.4rem] lg:text-[1.6rem] font-medium leading-tight">
                      {intent.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Email Section - Always Visible */}
            <div 
              ref={emailSectionRef} 
              className="space-y-6 sm:space-y-8"
            >
              <div className="space-y-4 sm:space-y-6 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-white/60 backdrop-blur-sm border border-gray-200 shadow-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-[0.9rem] sm:text-[1rem] md:text-[1.1rem] lg:text-[1.2rem] text-gray-500 font-medium">
                    {selectedIntent ? 'Ready when you are' : 'Get in touch'}
                  </p>
                </div>
                
                <div className="flex flex-col gap-4 sm:gap-6">
                  <a 
                    href={`mailto:${email}?subject=${encodeURIComponent(selectedIntent?.subject || 'Hello')}`}
                    className="text-[1.8rem] xs:text-[1.6rem] sm:text-[1.8rem] md:text-[2rem] lg:text-[2.2rem] xl:text-[2.4rem] font-arsenica text-gray-900 hover:text-gray-600 transition-colors duration-300 leading-tight break-all sm:break-normal"
                  >
                    {email}
                  </a>
                  
                  <button
                    onClick={handleCopyEmail}
                    className="self-start px-5 sm:px-6 py-2.5 sm:py-3 text-[1rem] sm:text-[1.1rem] font-medium bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all duration-300 whitespace-nowrap shadow-lg hover:shadow-xl active:scale-95"
                  >
                    {emailCopied ? '✓ Copied!' : 'Copy email'}
                  </button>
                </div>
              </div>

              {/* Social Links - Responsive Layout */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-4">
                <div className="flex items-center flex-wrap gap-4 sm:gap-6">
                  <span className="text-[0.9rem] sm:text-[1rem] text-gray-400 font-medium">Connect</span>
                  
                  <div className="flex items-center gap-3 sm:gap-4">
                    {[
                      { href: "https://github.com/atharvabaodhankar", icon: "fa-github", label: "GitHub" },
                      { href: "https://www.linkedin.com/in/atharva-baodhankar", icon: "fa-linkedin-in", label: "LinkedIn" },
                      { href: "https://www.instagram.com/atharvabaodhankar/", icon: "fa-instagram", label: "Instagram" },
                      { href: "https://www.facebook.com/profile.php?id=100069517304222", icon: "fa-facebook-f", label: "Facebook" }
                    ].map((social, index) => (
                      <a 
                        key={index}
                        href={social.href} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gray-100 hover:bg-gray-900 flex items-center justify-center transition-all duration-300 hover:scale-110"
                        aria-label={social.label}
                      >
                        <i className={`fa-brands ${social.icon} text-[1.4rem] sm:text-[1.6rem] md:text-[1.8rem] text-gray-600 group-hover:text-white transition-colors duration-300`}></i>
                      </a>
                    ))}
                  </div>
                </div>
                
                <div className="text-[0.9rem] sm:text-[1rem] text-gray-400 font-light">
                  Solapur, Maharashtra
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Image with Proper Parallax */}
          <div className="lg:col-span-5 relative h-[400px] sm:h-[500px] md:h-[600px] lg:h-screen flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full max-w-[300px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[450px] h-[350px] sm:h-[450px] md:h-[550px] lg:h-[600px] xl:h-[700px]">
              
              {/* Background Elements - Responsive */}
              <div className="absolute -top-2 -right-2 sm:-top-4 sm:-right-4 w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full opacity-60 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 md:-bottom-8 md:-left-8 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full opacity-40 blur-lg"></div>
              
              {/* Fixed Container for Parallax */}
              <div 
                ref={tiltRef}
                onMouseMove={window.matchMedia('(min-width: 768px)').matches ? handleMouseMove : undefined}
                onMouseLeave={window.matchMedia('(min-width: 768px)').matches ? handleMouseLeave : undefined}
                className="relative w-full h-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transition-all duration-300 ease-out will-change-transform"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0)',
                  WebkitMaskImage: '-webkit-radial-gradient(white, black)',
                  maskImage: 'radial-gradient(white, black)',
                  backfaceVisibility: 'hidden',
                  MozBackfaceVisibility: 'hidden',
                  isolation: 'isolate'
                }}
              >
                {/* Moving Image Inside Fixed Container - Parallax enabled for all devices */}
                <div ref={portraitRef} className="work-portrait absolute inset-0 w-full h-[120%] -top-[10%]">
                  <img 
                    src={workImg} 
                    alt="Atharva Baodhankar" 
                    className="w-full h-full object-cover transition-all duration-700 hover:scale-[1.02]"
                  />
                </div>
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent z-10"></div>
                
                {/* Floating Badge - Responsive */}
                <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-20 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
                  <span className="text-xs sm:text-sm font-semibold text-gray-900">Available for work</span>
                </div>
              </div>
              
              {/* Decorative Grid - Responsive */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-5">
                <div className="w-full h-full" style={{
                  backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
                  backgroundSize: '20px 20px'
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
