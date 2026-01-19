import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Magnetic from './Magnetic';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const containerRef = useRef(null);
  const footerRef = useRef(null);

  useGSAP(() => {
    // Start footer hidden (pushed up or down depending on effect, 
    // but for "uncover", the footer usually sits at the bottom and the previous section scrolls away to reveal it,
    // OR the footer is fixed/sticky at bottom z-index -1 and the body scrolls over it.
    // However, the user's prompt specifically asked for:
    // "Footer is positioned normally (not fixed). GSAP moves the inner container... yPercent."
    // "Start footer hidden halfway... yPercent: -50"
    
    // Setting initial state
    gsap.set(containerRef.current, { yPercent: -50 });

    const uncover = gsap.timeline({
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top bottom", // When top of footer hits bottom of viewport
        end: "bottom bottom", // When bottom of footer hits bottom of viewport (fully in view)
        scrub: true,
      }
    });

    uncover.to(containerRef.current, {
      yPercent: 0,
      ease: "none"
    });

    // Optional: Fade in text elements
    gsap.from(".footer-row", {
      opacity: 0,
      y: 30,
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
        <div ref={containerRef} className="footer-container min-h-screen w-full flex flex-col justify-between px-[5vw] py-[8vw]">
            
            {/* Row 1: Identity + Philosophy */}
            <div className="footer-row footer-top flex flex-col gap-6">
                <div>
                    <h2 className="font-arsenica text-[clamp(2.5rem,5vw,5rem)] leading-tight font-light bg-gradient-to-b from-white to-white/60 bg-clip-text text-transparent">
                        Atharva Baodhankar
                    </h2>
                    <p className="text-white/60 text-xl font-light tracking-wide mt-2">
                        Web • Systems • Blockchain
                    </p>
                </div>
                
                {/* Philosophy Line - Center-Left / Subtly below name */}
                <p className="text-white/40 text-lg md:text-xl font-light tracking-wider mt-4 max-w-md">
                    Designing systems that feel simple.
                </p>
            </div>

            {/* Row 2: Navigation / Links */}
            <div className="footer-row footer-center my-20 md:my-0 flex-1 flex flex-col justify-center items-end text-right">
                <nav className="footer-links flex flex-col gap-2">
                    {['/ Projects', '/ About', '/ Contact'].map((item) => (
                        <Magnetic key={item} strength={0.2}>
                            <a 
                                href={`#${item.toLowerCase()}`} 
                                className="block text-[12vw] md:text-[8vw] leading-[0.85] font-arsenica font-thin bg-gradient-to-b from-white via-white/80 to-white/40 bg-clip-text text-transparent opacity-80 hover:opacity-100 transition-opacity duration-500"
                            >
                                <span className="text-[5vw] md:text-[3vw] opacity-40 font-light mr-4 align-top font-sans">/</span>
                                {item}
                            </a>
                        </Magnetic>
                    ))}
                </nav>
            </div>

            {/* Row 3: Closing */}
            <div className="footer-row footer-bottom flex flex-col md:flex-row justify-between items-start md:items-end border-t border-white/5 pt-8 mt-12 gap-4 md:gap-0">
                <span className="text-sm md:text-[0.9rem] text-white/30 tracking-widest font-light uppercase">
                    Based in India — Building globally
                </span>
                <span className="text-sm md:text-[0.9rem] text-white/30 tracking-widest font-light uppercase">
                    © 2026
                </span>
            </div>
        </div>
    </footer>
  );
};

export default Footer;

