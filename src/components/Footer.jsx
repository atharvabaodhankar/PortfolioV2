import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

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
      style={{ minHeight: '100vh' }} // Ensure it has substantial height for the effect
    >
        {/* Simple subtle noise overlay if desired, can be added via CSS later */}
        <div ref={containerRef} className="footer-container min-h-screen w-full flex flex-col justify-between px-[5vw] py-[8vw]">
            
            {/* Row 1: Identity */}
            <div className="footer-row footer-top flex flex-col gap-4">
                <h2 className="font-arsenica text-[clamp(2.5rem,5vw,5rem)] leading-tight font-light">
                    Atharva Baodhankar
                </h2>
                <p className="text-white/60 text-xl font-light tracking-wide mt-2">
                    Web • Systems • Blockchain
                </p>
            </div>

            {/* Row 2: Navigation / Links */}
            <div className="footer-row footer-center my-20 md:my-0">
                <nav className="footer-links flex flex-col md:flex-row gap-8 md:gap-16">
                    <a href="#projects" className="text-3xl md:text-2xl font-light text-white/70 hover:text-white transition-colors duration-300">Projects</a>
                    <a href="#about" className="text-3xl md:text-2xl font-light text-white/70 hover:text-white transition-colors duration-300">About</a>
                    <a href="#contact" className="text-3xl md:text-2xl font-light text-white/70 hover:text-white transition-colors duration-300">Contact</a>
                </nav>
            </div>

            {/* Row 3: Closing */}
            <div className="footer-row footer-bottom flex justify-between items-end border-t border-white/10 pt-8 mt-12">
                <span className="text-sm md:text-base text-white/40 uppercase tracking-wider">
                    Based in India • Building globally
                </span>
                <span className="text-sm md:text-base text-white/40 uppercase tracking-wider">
                    © {new Date().getFullYear()}
                </span>
            </div>
        </div>
    </footer>
  );
};

export default Footer;

