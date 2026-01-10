import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { useLoader } from '../context/LoaderContext';

const Preloader = () => {
  const { isLoaded } = useLoader();
  const containerRef = useRef(null);
  const overlayRef = useRef(null);
  const loadingTextRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
        // Entrance Animation
        const tl = gsap.timeline();

        tl.from(overlayRef.current, {
            yPercent: 100,
            duration: 1,
            ease: "power3.inOut"
        });

        tl.from(".loading-text span", {
            y: 100,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power4.out",
            delay: 0.2
        });

        tl.to(".loader-box", {
            rotate: 360,
            duration: 2,
            repeat: -1,
            ease: "linear"
        }, "<");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isLoaded && containerRef.current) {
        // Exit Animation
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                   if (containerRef.current) containerRef.current.style.display = 'none';
                }
            });

            // Text flies up
            tl.to(".loading-text span", {
                y: -100,
                opacity: 0,
                duration: 0.8,
                stagger: 0.05,
                ease: "power3.in"
            });

            // Black overlay slides up
            tl.to(overlayRef.current, {
                yPercent: -100,
                duration: 1.2,
                ease: "power4.inOut"
            }, "-=0.4");
            
            // White background (container) cleanup
            tl.to(containerRef.current, {
                opacity: 0,
                duration: 0.5,
                delay: 0.5
            }, "<");

        }, containerRef);

        return () => ctx.revert();
    }
  }, [isLoaded]);

  return (
    <div ref={containerRef} className="fixed inset-0 w-full h-full z-[9999] pointer-events-none">
       {/* Background (white) implied or added if needed, handled by overlay */}
       
       <div ref={overlayRef} className="absolute inset-0 w-full h-full bg-[#1a1a1a] flex items-center justify-center z-[10000]">
           <div className="relative flex flex-col items-center justify-center overflow-hidden">
               {/* Loader Box */}
               <div className="loader-box w-16 h-16 border-2 border-white/20 mb-8 relative rotate-45">
                   <div className="absolute inset-0 border-2 border-white animate-pulse"></div>
               </div>

               {/* Text */}
               <div ref={loadingTextRef} className="loading-text text-white text-4xl md:text-7xl font-arsenica uppercase tracking-wider text-center leading-tight mix-blend-difference">
                   <div className="overflow-hidden"><span className="inline-block">Building</span></div>
                   <div className="overflow-hidden"><span className="inline-block">Your</span></div>
                   <div className="overflow-hidden"><span className="inline-block">Experience</span></div>
               </div>
           </div>
       </div>
    </div>
  );
};

export default Preloader;
