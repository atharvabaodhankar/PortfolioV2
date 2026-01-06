import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
// import Shery from 'sheryjs'; // TODO: Fix Shery imports
import { useLoader } from '../context/LoaderContext';

const Hero = () => {
  const { isLoaded } = useLoader();
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);

  useLayoutEffect(() => {
    if (!isLoaded) return;

    // Magnet effect
    if (window.matchMedia('(min-width: 768px)').matches) {
      Shery.makeMagnet('.hero-img, .logo', {
        ease: 'cubic-bezier(0.23, 1, 0.320, 1)',
        duration: 1,
      });
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      tl.from('.hero-img', {
        height: 0,
        scale: 0.8,
        ease: 'elastic',
        duration: 3,
      }, 'HeroH1H2');

      tl.from('.hero h1', {
        skewY: -10,
        delay: 1,
        opacity: 0,
      }, 'HeroH1H2');

      tl.from('.hero h2', {
        skewY: -10,
        delay: 1.3,
        opacity: 0,
      }, 'HeroH1H2');

      tl.from('.hero p', {
        y: 20,
        opacity: 0,
      });
    }, heroRef);

    return () => ctx.revert();
  }, [isLoaded]);

  return (
    <section id="hero" ref={heroRef} className="h-screen flex items-center justify-center relative">
      <div className="hero flex items-center justify-center flex-col">
        <h1 className="hero-hover text-[7vw] font-light -mb-10 z-[2] select-none font-[ArsenicaDemibold]">
          ATHARVA
        </h1>
        <div className="hero-img non-hover w-[23vw] h-[16vw] object-cover -rotate-[5deg]" ref={heroImgRef}>
          <img src="/src/assets/imgs/hero-img.jpg" alt="hero" className="w-full h-full object-cover object-center" />
        </div>
        <h2 className="hero-hover text-[7vw] font-light -mt-10 z-[2] select-none font-[ArsenicaDemibold]">
          BAODHANKAR
        </h2>
        <p className="text-[3rem] mt-16">Web Designer and Video Editor</p>
      </div>
    </section>
  );
};

export default Hero;
