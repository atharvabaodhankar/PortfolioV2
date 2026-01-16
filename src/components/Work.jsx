import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const workRef = useRef(null);
  const [selectedIntent, setSelectedIntent] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const contactRef = useRef(null);

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
    setSelectedIntent(intent);
    setEmailCopied(false);

    // Animate contact details reveal
    if (contactRef.current) {
      gsap.fromTo(
        contactRef.current,
        { 
          opacity: 0, 
          y: 20,
          height: 0
        },
        { 
          opacity: 1, 
          y: 0,
          height: 'auto',
          duration: 0.6,
          ease: 'power2.out'
        }
      );

      // Stagger social icons
      gsap.fromTo(
        '.social-icon',
        { opacity: 0, scale: 0.8, y: 10 },
        { 
          opacity: 1, 
          scale: 1, 
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'back.out(1.4)',
          delay: 0.3
        }
      );
    }
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopied(true);
      
      // Reset copied state after 2 seconds
      setTimeout(() => setEmailCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy email:', err);
      // Fallback to mailto
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(selectedIntent?.subject || 'Hello')}`;
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Headline animation
      gsap.from('.work-headline', {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-headline',
          start: 'top 85%',
          end: 'top 60%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      // Question animation
      gsap.from('.work-question', {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.work-question',
          start: 'top 85%',
          end: 'top 65%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      // Intent cards stagger
      gsap.from('.intent-card', {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.intent-cards-container',
          start: 'top 80%',
          end: 'top 60%',
          scrub: 1,
          invalidateOnRefresh: true
        },
      });

      // Portrait parallax (subtle)
      if (window.matchMedia('(min-width: 768px)').matches) {
        gsap.fromTo(
          '.work-portrait',
          { y: '-30px' },
          { 
            y: '30px', 
            scrollTrigger: { 
              trigger: workRef.current, 
              scrub: 2,
              invalidateOnRefresh: true 
            } 
          }
        );
      }
    }, workRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="work" 
      ref={workRef} 
      className="relative min-h-screen flex items-center justify-center py-24 md:py-32 px-6 md:px-16 overflow-hidden bg-[#fafafa]"
    >
      {/* Background Portrait - Subtle and Secondary */}
      <div className="hidden md:block absolute right-8 lg:right-16 top-1/2 -translate-y-1/2 w-[280px] h-[360px] lg:w-[320px] lg:h-[400px] opacity-[0.08] pointer-events-none z-0">
        <div className="work-portrait relative w-full h-full">
          <img 
            src="/src/assets/imgs/navBar-img.jpg" 
            alt="" 
            className="w-full h-full object-cover rounded-3xl grayscale blur-[2px]"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full">
        {/* Headline */}
        <h1 className="work-headline font-arsenica text-[4rem] md:text-[6rem] lg:text-[7.5rem] leading-[1.05] mb-6 md:mb-10">
          Let's create
          <br />
          something together
        </h1>

        {/* Guiding Question */}
        <p className="work-question text-[1.7rem] md:text-[2rem] text-gray-600 mb-10 md:mb-14 font-light max-w-2xl">
          What do you want to build?
        </p>

        {/* Intent Selection Cards */}
        <div className="intent-cards-container grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mb-12 max-w-3xl">
          {intents.map((intent) => (
            <button
              key={intent.id}
              onClick={() => handleIntentSelect(intent)}
              className={`intent-card text-left px-6 md:px-7 py-5 md:py-6 rounded-2xl border-2 transition-all duration-300 ease-out ${
                selectedIntent?.id === intent.id
                  ? 'border-black bg-black text-white shadow-xl scale-[1.01]'
                  : 'border-gray-200 bg-white text-black hover:border-gray-300 hover:shadow-md hover:scale-[1.005]'
              }`}
            >
              <span className="block text-[1.5rem] md:text-[1.7rem] font-medium">
                {intent.label}
              </span>
            </button>
          ))}
        </div>

        {/* Contact Details - Revealed after selection */}
        {selectedIntent && (
          <div ref={contactRef} className="contact-reveal mt-12 opacity-0">
            {/* Email Section */}
            <div className="mb-8 pb-8 border-b border-gray-200">
              <p className="text-[1.4rem] text-gray-500 mb-3">Get in touch</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a 
                  href={`mailto:${email}?subject=${encodeURIComponent(selectedIntent.subject)}`}
                  className="text-[2rem] md:text-[2.4rem] font-arsenica hover:text-gray-600 transition-colors"
                >
                  {email}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="px-5 py-2 text-[1.4rem] border-2 border-black rounded-full hover:bg-black hover:text-white transition-all duration-300 whitespace-nowrap"
                >
                  {emailCopied ? '✓ Copied!' : 'Copy email'}
                </button>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-4 flex-wrap">
              <p className="text-[1.4rem] text-gray-500 mr-2">Find me on</p>
              
              <a 
                href="https://github.com/atharvabaodhankar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon group"
              >
                <div className="w-[50px] h-[50px] rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-github text-[2rem]"></i>
                </div>
              </a>

              <a 
                href="https://www.linkedin.com/in/atharva-baodhankar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon group"
              >
                <div className="w-[50px] h-[50px] rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-linkedin-in text-[2rem]"></i>
                </div>
              </a>

              <a 
                href="https://www.instagram.com/op_athu_/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon group"
              >
                <div className="w-[50px] h-[50px] rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-instagram text-[2rem]"></i>
                </div>
              </a>

              <a 
                href="https://www.facebook.com/profile.php?id=100069517304222" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon group"
              >
                <div className="w-[50px] h-[50px] rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-700 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <i className="fa-brands fa-facebook-f text-[2rem]"></i>
                </div>
              </a>
            </div>

            {/* Optional: Location info */}
            <div className="mt-8 text-[1.4rem] text-gray-500">
              <p>Based in Solapur, Maharashtra</p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Work;
