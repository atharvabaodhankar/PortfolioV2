import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

// Import assets
import heroImg from '../assets/imgs/hero-img.jpg';
import aboutImg from '../assets/imgs/aboutme-img.jpeg';
import skillsImg from '../assets/imgs/skills.png';
import rejouiceImg from '../assets/sites/rejouice.png';
import navImg from '../assets/imgs/navBar-img.jpg'; // Backup/Default

const contentMap = {
  home: {
    type: 'hero-image',
    image: heroImg,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: 'Creative Developer & Designer'
  },
  about: {
    type: 'image-grid',
    image: aboutImg, // Using single image for now based on available assets
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    text: 'Passionate about crafting digital experiences'
  },
  projects: {
    type: 'featured-preview',
    image: rejouiceImg,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    text: 'Featured Project: Rejouice'
  },
  contact: {
    type: 'social-grid',
    image: navImg, // Placeholder for contact visual
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    text: 'Let\'s create something together'
  }
};

const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [hoveredLink, setHoveredLink] = useState(null);
  
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const backdropRef = useRef(null);
  const navLinksRef = useRef([]);
  const customCursorRef = useRef(null);
  const rightContentRef = useRef(null);
  
  // Register GSAP plugins if needed (ScrollTrigger is usually global but good practice)
  gsap.registerPlugin(useGSAP);

  const toggleNav = () => {
    setNavActive((prev) => !prev);
  };

  /* Removed duplicate useGSAP block */
    
  const tl = useRef();

  useGSAP(() => {
    tl.current = gsap.timeline({
      paused: true,
    });

    // Opening Sequence
    tl.current.to(backdropRef.current, {
      opacity: 0.95,
      duration: 0.4,
      ease: 'power2.out',
      pointerEvents: 'auto'
    })
    .to(containerRef.current, {
      display: 'flex',
      duration: 0
    }, 0)
    .fromTo([leftPanelRef.current, rightPanelRef.current], {
      xPercent: (i) => i === 0 ? -100 : 100,
    }, {
      xPercent: 0,
      duration: 1.2,
      ease: 'expo.inOut',
      stagger: 0.1,
    }, 0.2)
    
    // Content Cascade
    .fromTo(navLinksRef.current, {
      yPercent: 120,
      skewY: 12,
      opacity: 0
    }, {
      yPercent: 0,
      skewY: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: 'back.out(1.2)'
    }, 1.2)
    
    // Right Panel Initial Content
    .fromTo(rightContentRef.current, {
        opacity: 0,
        scale: 0.92,
        rotationY: 5
    }, {
        opacity: 1,
        scale: 1,
        rotationY: 0,
        duration: 0.8,
        ease: 'power2.out'
    }, 1.4);

  }, { scope: containerRef }); // Removed navActive dependency

  useEffect(() => {
    if (navActive) {
      tl.current?.play();
    } else {
      tl.current?.reverse();
    }
  }, [navActive]);

  // Custom Cursor Logic
  useGSAP(() => {
    const cursor = customCursorRef.current;
    if (!cursor) return;

    const xTo = gsap.quickTo(cursor, "x", { duration: 0.2, ease: "power3" });
    const yTo = gsap.quickTo(cursor, "y", { duration: 0.2, ease: "power3" });

    const moveCursor = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener('mousemove', moveCursor);

    return () => window.removeEventListener('mousemove', moveCursor);
  }, { scope: containerRef });

  // Magnetic Effect for Links with Cursor Interaction
  const handleMouseMove = (e, index) => {
    const el = navLinksRef.current[index];
    if (!el) return;
    
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    if (Math.abs(x) < 120 && Math.abs(y) < 120) {
        gsap.to(el, {
            x: x * 0.2, // Max displacement factor
            y: y * 0.2,
            duration: 0.4,
            ease: 'power2.out'
        });
    }
  };

  const handleMouseLeave = (index) => {
      gsap.to(navLinksRef.current[index], {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: 'elastic.out(1, 0.4)'
      });
  };

  const handleLinkEnter = (key) => {
      handleLinkHover(key);
      gsap.to(customCursorRef.current, {
          scale: 3.5,
          borderColor: 'transparent',
          backgroundColor: 'rgba(255,255,255,0.2)',
          duration: 0.3
      });
      // Optional: Add text inside cursor here if component structure supports it
  };

  const handleLinkLeave = (index) => {
      handleMouseLeave(index);
      gsap.to(customCursorRef.current, {
          scale: 1,
          borderColor: 'white',
          backgroundColor: 'transparent',
          duration: 0.3
      });
  };

  // Content Transition on Hover
  const handleLinkHover = (key) => {
      if (key === activeLink) return;
      setHoveredLink(key);
      
      // Animate Right Panel Content Change
      const tl = gsap.timeline();
      
      tl.to(rightContentRef.current, {
          scale: 1.08,
          opacity: 0,
          filter: 'blur(8px)',
          rotationY: -5,
          duration: 0.4,
          ease: 'power2.in',
          onComplete: () => setActiveLink(key)
      })
      .set(rightContentRef.current, {
          scale: 0.92,
          rotationY: 5,
          filter: 'blur(8px)'
      })
      .to(rightContentRef.current, {
          scale: 1,
          opacity: 1,
          filter: 'blur(0px)',
          rotationY: 0,
          duration: 0.6,
          ease: 'power3.out'
      });
  };

  // Render
  return (
    <>
      <div className="navbar pointer-events-auto">
        <div className="logo">
          <a href="#hero" className="btn-underline font-arsenica text-3xl text-black">ATHARVA</a>
        </div>
        <div className="menu btn-underline text-2xl cursor-pointer text-black" onClick={toggleNav}>
          Menu
        </div>
      </div>

      <div 
        ref={containerRef} 
        className="fixed inset-0 z-[99] hidden pointer-events-none"
      >
        {/* Backdrop */}
        <div 
          ref={backdropRef}
          className="absolute inset-0 bg-black/20 backdrop-blur-md opacity-0 pointer-events-none"
        ></div>

        {/* Left Panel */}
        <div 
          ref={leftPanelRef}
          className="w-full md:w-[40%] h-full bg-[#1a1a1a] relative flex flex-col justify-center pl-8 md:pl-20 z-10 pointer-events-auto overflow-hidden"
        >
          {/* Noise Overlay would go here as CSS pseudo-element or div */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJmIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNmKSIgb3BhY2l0eT0iMC40Ii8+PC9zdmc+')]"></div>

          <div 
            className="absolute top-8 left-8 md:right-8 md:left-auto text-white/60 hover:text-white cursor-pointer z-50 text-xl font-light tracking-widest"
            onClick={toggleNav}
          >
            CLOSE
          </div>

          <div className="flex flex-col space-y-8 md:space-y-12">
            {Object.keys(contentMap).map((key, index) => (
              <div 
                key={key} 
                className="nav-item-wrapper group relative"
                onMouseEnter={() => handleLinkEnter(key)}
                onMouseLeave={() => handleLinkLeave(index)}
              >
                <div 
                    ref={el => navLinksRef.current[index] = el}
                    className="relative inline-block"
                    onMouseMove={(e) => handleMouseMove(e, index)}
                    onMouseLeave={() => handleMouseLeave(index)} // Keep magnetic reset separate if needed, or combine
                >
                    <span className="absolute -left-8 top-2 text-sm md:text-lg text-white/40 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-4 group-hover:translate-x-0">
                        0{index + 1}
                    </span>
                    <a 
                        href={`#${key === 'home' ? 'hero' : key}`} 
                        className="text-[clamp(3rem,6vw,6rem)] font-arsenica text-white leading-none block transition-colors duration-300 group-hover:text-[#00ff87]"
                        onClick={toggleNav}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                    </a>
                    <span className="block h-[2px] w-0 bg-gradient-to-r from-[#00ff87] to-[#60efff] transition-all duration-500 group-hover:w-full mt-2"></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Panel */}
        <div 
          ref={rightPanelRef}
          className="hidden md:block w-[60%] h-full bg-[#EDECE7] relative overflow-hidden z-10 pointer-events-auto"
        >
            <div className="absolute inset-0 transition-all duration-1000 ease-in-out mix-blend-overlay opacity-30"
                 style={{ background: contentMap[activeLink]?.gradient }}></div>
            
            <div 
                ref={rightContentRef}
                className="w-full h-full flex flex-col items-center justify-center p-12 relative"
            >
                <div className="relative w-[80%] aspect-video shadow-2xl overflow-hidden rounded-lg">
                    <img 
                        src={contentMap[activeLink]?.image} 
                        alt={activeLink} 
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="mt-8 text-4xl font-arsenica text-gray-800 text-center">
                    {contentMap[activeLink]?.text}
                </h3>
            </div>
        </div>
      </div>
      
      {/* Custom Cursor for Nav */}
      <div 
        ref={customCursorRef}
        className="fixed top-0 left-0 w-6 h-6 border-2 border-white rounded-full pointer-events-none z-[100] mix-blend-difference hidden md:block -translate-x-1/2 -translate-y-1/2"
      ></div>
    </>
  );
};

export default Navbar;
