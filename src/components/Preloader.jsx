import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useLoader } from '../context/LoaderContext';

const Preloader = ({ progress = 0 }) => {
  const { isLoaded } = useLoader();
  const containerRef = useRef(null);
  const progressRef = useRef(null);
  const counterRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(containerRef.current, { opacity: 1, yPercent: 0 });
      gsap.set(".preloader-text", { opacity: 1 });
      gsap.set(".char-animate", { y: 100, opacity: 0 });
      gsap.set(".preloader-subtitle", { y: 50, opacity: 0 });
      gsap.set(".progress-line", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".counter", { opacity: 0 });

      // Entrance animation - clean and simple
      const tl = gsap.timeline();

      tl.to(".char-animate", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.03
      })
      .to(".preloader-subtitle", {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.3")
      .to(".counter", {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out"
      }, "-=0.2");

      // NO continuous animations - keep text static and clean

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Enhanced progress updates with smooth animations
  useEffect(() => {
    if (counterRef.current && progressRef.current) {
      const currentProgress = Math.min(progress, 100);
      
      // Smooth counter animation
      gsap.to(counterRef.current, {
        innerHTML: currentProgress,
        duration: 0.6,
        ease: "power2.out",
        snap: { innerHTML: 1 }
      });

      // Smooth progress line animation
      gsap.to(".progress-line", {
        scaleX: currentProgress / 100,
        duration: 0.6,
        ease: "power2.out"
      });
    }
  }, [progress]);

  useEffect(() => {
    if (isLoaded && containerRef.current && isVisible) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete: () => {
            setIsVisible(false);
          }
        });

        // Clean exit animation - consistent upward movement
        tl.to(".counter", {
          y: -20,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in"
        })
        .to(".progress-line", {
          scaleX: 1,
          duration: 0.2,
          ease: "power2.out"
        }, "-=0.2")
        .to(".preloader-subtitle", {
          y: -40,
          opacity: 0,
          duration: 0.4,
          ease: "power2.in"
        }, "-=0.1")
        .to(".char-animate", {
          y: -80,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          stagger: 0.02
        }, "-=0.2")
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power3.inOut"
        }, "-=0.3");

      }, containerRef);

      return () => ctx.revert();
    }
  }, [isLoaded, isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={containerRef} 
      className="preloader-bg fixed inset-0 w-full h-full z-[99999] bg-[#0a0a0a] flex items-center justify-center"
      style={{ pointerEvents: 'all' }}
    >
      <div className="relative flex flex-col items-center justify-center text-center px-8">
        
        {/* Main Typography */}
        <div className="mb-4 md:mb-8 overflow-hidden">
          <h1 className="preloader-text text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6rem] xl:text-[8rem] font-black text-white leading-[0.8] tracking-[-0.05em]" style={{ fontFamily: "'Impact', 'Arial Black', sans-serif" }}>
            {"CRAFTING".split("").map((char, i) => (
              <span key={i} className="inline-block char-animate" style={{animationDelay: `${i * 0.1}s`}}>
                {char}
              </span>
            ))}
          </h1>
        </div>
        
        <div className="mb-8 md:mb-16 overflow-hidden">
          <h2 className="preloader-text text-[12vw] sm:text-[10vw] md:text-[8vw] lg:text-[6rem] xl:text-[8rem] font-thin text-white leading-[0.8] tracking-[0.1em] italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            {"EXPERIENCE".split("").map((char, i) => (
              <span key={i} className="inline-block char-animate" style={{animationDelay: `${(i + 8) * 0.1}s`}}>
                {char}
              </span>
            ))}
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mb-12 md:mb-20 overflow-hidden">
          <p className="preloader-subtitle text-white/60 text-sm md:text-lg lg:text-xl font-light tracking-[0.1em] uppercase">
            Loading Portfolio
          </p>
        </div>

        {/* Progress Section */}
        <div className="w-full max-w-md">
          {/* Progress Line */}
          <div className="relative w-full h-[1px] bg-white/10 mb-6">
            <div 
              ref={progressRef}
              className="progress-line absolute top-0 left-0 w-full h-full bg-white"
            ></div>
          </div>

          {/* Counter */}
          <div className="flex justify-center">
            <span 
              ref={counterRef}
              className="counter text-white/80 text-sm font-mono tracking-[0.2em]"
            >
              0
            </span>
            <span className="counter text-white/40 text-sm font-mono tracking-[0.2em] ml-1">
              %
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Preloader;
