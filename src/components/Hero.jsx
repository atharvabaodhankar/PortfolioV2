import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
// import Shery from 'sheryjs'; // TODO: Fix Shery imports
import { useLoader } from '../context/LoaderContext';
import useParallaxTilt from '../hooks/useParallaxTilt';
import heroImg from '../assets/imgs/hero-img.png';

gsap.registerPlugin(useGSAP);

const Hero = () => {
  const { isLoaded } = useLoader();
  const heroRef = useRef(null);
  const heroImgRef = useRef(null);
  const tiltImgRef = useParallaxTilt(heroRef, {
    tiltStrength: 12,
    moveStrength: 15,
    scale: 1.03,
    speed: 0.5
  });

  useGSAP(() => {
    if (!isLoaded) return;

    // Magnet effect (TODO: Re-enable when Shery is properly imported)
    // if (window.matchMedia('(min-width: 768px)').matches) {
    //   Shery.makeMagnet('.hero-img, .logo', {
    //     ease: 'cubic-bezier(0.23, 1, 0.320, 1)',
    //     duration: 1,
    //   });
    // }
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
  }, { scope: heroRef, dependencies: [isLoaded] });

  return (
    <section id="hero" ref={heroRef} className="h-screen flex items-center justify-center relative bg-white">
      <div className="hero flex items-center justify-center flex-col">
        <h1 className="hero-hover text-[13vw] md:text-[7vw] font-light -mb-8 md:-mb-20 z-[2] select-none font-arsenica">
          ATHARVA
        </h1>
        <div className="hero-img non-hover w-[60vw] h-[40vw] md:w-[23vw] md:h-[16vw] object-cover -rotate-[5deg]" ref={heroImgRef}>
          <img 
            ref={tiltImgRef}
            src={heroImg} 
            alt="hero" 
            className="w-full h-full object-cover object-center will-change-transform" 
          />
        </div>
        <h2 className="hero-hover text-[13vw] md:text-[7vw] font-light -mt-8 md:-mt-20 z-[2] select-none font-arsenica">
          BAODHANKAR
        </h2>
        <p className="text-xl md:text-[3rem] mt-8 md:mt-16 font-light text-center px-4 md:px-0">MERN • Systems • Blockchain • AI Tooling</p>
      </div>
    </section>
  );
};

export default Hero;
