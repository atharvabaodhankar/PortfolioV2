import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import arrowImg from '../assets/arrow.svg';

gsap.registerPlugin(ScrollTrigger);

const Marquee = () => {
  const marqueeRef = useRef(null);
  const arrowRefs = useRef([]);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      let currentScroll = 0;
      let isScrollingDown = true;
      
      const tween = gsap.to('.marquee_part', {
        xPercent: -100,
        repeat: -1,
        duration: 50,
        ease: 'linear',
      }).totalProgress(0.5);

      gsap.set('.marquee_inner', { xPercent: -50 });

      const handleScroll = () => {
        const newScroll = window.scrollY;
        
        if (newScroll > currentScroll) {
          isScrollingDown = true;
        } else {
          isScrollingDown = false;
        }

        // Smoothly change timeScale
        gsap.to(tween, {
          timeScale: isScrollingDown ? 1 : -1,
          overwrite: true
        });

        // Rotate arrows
        gsap.to('.arrow', {
          rotate: isScrollingDown ? 180 : 0,
          duration: 0.6,
          overwrite: true,
          ease: 'power2.out',
        });

        currentScroll = newScroll;
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        window.removeEventListener('scroll', handleScroll);
      };
    }, marqueeRef);

    return () => ctx.revert();
  }, []);

  const quotes = [
  "Design is Intelligence Made Visible",
  "Trust in Code",
  "Scalable Systems Architecture",
  "Crafting Digital Experiences",
  "Designing for Decentralization",
  "Systems Built to Endure",
  "Simplicity is the Ultimate Sophistication",
  "Engineering with Intent"
];


  return (
    <section 
      id="marquee" 
      ref={marqueeRef} 
      className="relative bg-white text-black/75 py-12 mt-20 font-semibold text-[4rem] uppercase overflow-hidden select-none"
    >
      <div className="marquee_inner flex w-fit whitespace-nowrap">
        {[0, 1].map((partKey) => (
          <div key={partKey} className="marquee_part flex items-center flex-shrink-0">
            {quotes.map((quote, i) => (
              <div key={i} className="flex items-center">
                <span className="font-arsenica px-9">{quote}</span>
                <div className="arrow w-24 h-24 ml-2 mr-6 transition-transform">
                  <img src={arrowImg} alt="-> " className="w-full h-full object-contain invert" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
