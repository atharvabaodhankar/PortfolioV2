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
      gsap.set(".preloader-text", { y: 100, opacity: 0 });
      gsap.set(".preloader-subtitle", { y: 50, opacity: 0 });
      gsap.set(".progress-line", { scaleX: 0, transformOrigin: "left" });
      gsap.set(".counter", { opacity: 0 });

      // Entrance animation
      const tl = gsap.timeline();

      tl.to(".preloader-text", {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
        stagger: 0.1
      })
      .to(".preloader-subtitle", {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      .to(".counter", {
        opacity: 1,
        duration: 0.6,
        ease: "power2.out"
      }, "-=0.4");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Update progress based on actual loading progress
  useEffect(() => {
    if (counterRef.current && progressRef.current) {
      const currentProgress = Math.min(progress, 100);
      
      gsap.to(counterRef.current, {
        innerHTML: currentProgress,
        duration: 0.5,
        ease: "power2.out",
        snap: { innerHTML: 1 }
      });

      gsap.to(".progress-line", {
        scaleX: currentProgress / 100,
        duration: 0.5,
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

        // Smooth slide-up exit animation
        tl.to(".counter", {
          opacity: 0,
          duration: 0.4,
          ease: "power2.in"
        })
        .to(".progress-line", {
          scaleX: 1,
          duration: 0.3,
          ease: "power2.out"
        }, "-=0.3")
        .to(".preloader-subtitle", {
          y: -30,
          opacity: 0,
          duration: 0.5,
          ease: "power2.in"
        }, "-=0.2")
        .to(".preloader-text", {
          y: -80,
          opacity: 0,
          duration: 0.7,
          ease: "power3.in",
          stagger: 0.05
        }, "-=0.4")
        .to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut"
        }, "-=0.5");

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
        <div className="mb-12 overflow-hidden">
          <h1 className="preloader-text text-[8vw] md:text-[4.5rem] font-arsenica font-light text-white leading-[0.9] tracking-[-0.02em]">
            CRAFTING
          </h1>
        </div>
        
        <div className="mb-16 overflow-hidden">
          <h2 className="preloader-text text-[8vw] md:text-[4.5rem] font-arsenica font-light text-white leading-[0.9] tracking-[-0.02em]">
            EXPERIENCE
          </h2>
        </div>

        {/* Subtitle */}
        <div className="mb-20 overflow-hidden">
          <p className="preloader-subtitle text-white/60 text-lg md:text-xl font-light tracking-[0.1em] uppercase">
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
