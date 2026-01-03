import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import TransitionLink from './TransitionLink';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef(null);
  const footerRef = useRef(null);

  useGSAP(() => {
    // Setting initial state
    gsap.set(containerRef.current, { yPercent: -50 });

    const uncover = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom",
        end: "bottom bottom",
        scrub: true,
      }
    });

    uncover.to(containerRef.current, {
      yPercent: 0,
      ease: "none"
    });

    // Responsive animations
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    
    gsap.from(".footer-row", {
      opacity: 0,
      y: isMobile ? 20 : 30,
      stagger: 0.1,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 75%",
      }
    });

  }, { scope: footerRef });

  return (
    <footer 
      ref={footerRef} 
      className="footer relative bg-[#0b0b0b] text-[#f5f5f5] overflow-hidden w-full z-10"
      style={{ minHeight: '100vh' }}
    >
        <div ref={containerRef} className="footer-container min-h-screen w-full flex flex-col justify-between px-4 py-8 sm:px-6 sm:py-12 md:px-[5vw] md:py-[8vw]">
            
            {/* Row 1: Identity + Philosophy */}
            <div className="footer-row footer-top flex flex-col gap-4 sm:gap-6 md:gap-8">
                <div>
                    <h2 className="footer-h1 font-arsenica text-[2.5rem] xs:text-[3rem] sm:text-[3.5rem] md:text-[clamp(2.5rem,5vw,5rem)] leading-none md:leading-tight font-light bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Atharva Baodhankar
                    </h2>
                    <p className="text-white/60 text-base sm:text-lg md:text-xl font-light tracking-wide mt-2 sm:mt-3 md:mt-2">
                        Web • Systems • Blockchain
                    </p>
                </div>
                
                {/* Philosophy Line */}
                <p className="text-white/40 text-sm sm:text-base md:text-xl font-light tracking-wider mt-3 sm:mt-4 max-w-md leading-relaxed">
                    Designing systems that feel simple.
                </p>
            </div>

            {/* Row 2: Navigation / Links - Mobile Optimized */}
            <div className="footer-row footer-center my-8 sm:my-12 md:my-0 flex-1 flex flex-col justify-center items-start md:items-end text-left md:text-right">
                <nav className="footer-links flex flex-col gap-3 sm:gap-4 md:gap-2 w-full md:w-auto">
                    {['Projects', 'About', 'Contact'].map((item) => {
                        const isProjects = item === 'Projects';
                        const Component = isProjects ? TransitionLink : 'a';
                        const linkProps = isProjects ? { to: '/projects' } : { href: `#${item.toLowerCase()}` };

                        return (
                            <Magnetic key={item} strength={0.2}>
                                <Component 
                                    {...linkProps}
                                    className="group block text-[12vw] xs:text-[11vw] sm:text-[9vw] md:text-[8vw] leading-[0.85] opacity-80 hover:opacity-100 transition-opacity duration-500 cursor-pointer w-full md:w-auto my-2 sm:my-4 md:my-6"
                                >
                                    <span className="hidden md:inline text-white/40 font-light mr-2 font-sans">/</span>&nbsp;
                                     <div className="relative inline-block overflow-hidden align-bottom">
                                        <span className="block bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent transition-transform duration-500 ease-[0.76,0,0.24,1] group-hover:-translate-y-full font-arsenica">
                                            {item}
                                        </span>
                                        <span className="block absolute top-0 left-0 w-full bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent transition-transform duration-500 ease-[0.76,0,0.24,1] translate-y-full group-hover:translate-y-0 font-arsenica">
                                            {item}
                                        </span>
                                     </div>
                                </Component>
                            </Magnetic>
                        );
                    })}
                </nav>
            </div>

            {/* Row 3: Closing - Mobile Optimized */}
            <div className="footer-row footer-bottom flex flex-col sm:flex-row justify-between items-start sm:items-end border-t border-white/5 pt-6 sm:pt-8 mt-6 sm:mt-8 md:mt-12 gap-4 sm:gap-6 md:gap-0">
                <span className="text-[0.7rem] xs:text-xs sm:text-xs md:text-[0.9rem] text-white/30 tracking-widest font-light uppercase">
                    Based in India — Building globally
                </span>
                <span className="text-[0.7rem] xs:text-xs sm:text-xs md:text-[0.9rem] text-white/30 tracking-widest font-light uppercase">
                    © 2026
                </span>
            </div>
        </div>
    </footer>
  );
};

export default Footer;

