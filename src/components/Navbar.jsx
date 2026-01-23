import React, { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { X } from 'lucide-react';
import TransitionLink from './TransitionLink';

// Import assets
import heroImg from '../assets/imgs/hero.png';
import aboutImg from '../assets/imgs/Web_Photo_Editor.png';
import rejouiceImg from '../assets/sites/polystudi.png';
import navImg from '../assets/imgs/wow.png'; // Backup/Default

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
    text: 'Featured Project: Polystudi'
  },
  contact: {
    type: 'social-grid',
    image: navImg, // Placeholder for contact visual
    gradient: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    text: 'Let\'s create something together'
  }
};

gsap.registerPlugin(useGSAP);

const Navbar = () => {
  console.log('Navbar component is rendering!');
  
  const [navActive, setNavActive] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  
  const containerRef = useRef(null);
  const navbarRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const backdropRef = useRef(null);
  const navLinksRef = useRef([]);
  const rightContentRef = useRef(null);
  const closeBtnRef = useRef(null);

  const toggleNav = () => {
    setNavActive((prev) => !prev);
  };

  useEffect(() => {
    let lastScroll = 0;

    const handleScroll = (e) => {
      const currentScroll = e?.scroll || window.pageYOffset;
      
      if (currentScroll <= 0) {
        // At top - show navbar
        if (navbarRef.current) {
          navbarRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
        return;
      }

      if (navActive) return; // Don't hide if menu is open

      if (currentScroll > lastScroll) {
        // Scrolling down - hide navbar
        if (navbarRef.current) {
          navbarRef.current.style.transform = 'translate3d(0, -100%, 0)';
        }
      } else if (currentScroll < lastScroll) {
        // Scrolling up - show navbar
        if (navbarRef.current) {
          navbarRef.current.style.transform = 'translate3d(0, 0, 0)';
        }
      }

      lastScroll = currentScroll;
    };

    // Wait for Lenis to be available
    const attachScrollListener = () => {
      if (window.lenis) {
        window.lenis.on('scroll', handleScroll);
        console.log('Lenis scroll listener attached');
      } else {
        // Fallback to regular scroll
        window.addEventListener('scroll', handleScroll);
        console.log('Regular scroll listener attached');
      }
    };

    // Try to attach immediately or wait a bit
    const timer = setTimeout(attachScrollListener, 100);

    // Cleanup
    return () => {
      clearTimeout(timer);
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
      // Reset navbar position on cleanup
      if (navbarRef.current) {
        navbarRef.current.style.transform = 'translate3d(0, 0, 0)';
      }
    };
  }, [navActive]);
    
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
      gsap.to('.ferro-mouse-follower-ball', {
          scale: 3,
          duration: 0.3,
          opacity: 1
      });
  };

  const handleLinkLeave = (index) => {
      handleMouseLeave(index);
      gsap.to('.ferro-mouse-follower-ball', {
          scale: 1,
          duration: 0.3
      });
  };

  // Content Transition on Hover
  const handleLinkHover = (key) => {
      if (key === activeLink) return;
      
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
      <div 
        ref={navbarRef} 
        className="navbar pointer-events-auto"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '80px',
          zIndex: 99,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 3vw',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          transition: 'transform 0.3s ease-in-out',
          transform: 'translate3d(0, 0, 0)'
        }}
      >
        <div className="logo">
          <a href="/#hero" className="font-arsenica text-3xl text-black font-semibold">ATHARVA</a>
        </div>
        <div className="menu text-2xl cursor-pointer text-black font-medium" onClick={toggleNav}>
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
            ref={closeBtnRef}
            className="nav-close-trigger absolute top-6 left-6 md:left-auto md:right-12 md:top-10 w-14 h-14 md:w-16 md:h-16 rounded-full border border-white/20 flex items-center justify-center cursor-pointer group hover:bg-white hover:scale-110 transition-all duration-300 z-50 backdrop-blur-sm"
            onClick={toggleNav}
            onMouseEnter={() => {
                gsap.to(closeBtnRef.current, { scale: 1.1, duration: 0.3 });
                gsap.to('.ferro-mouse-follower-ball', { scale: 0, opacity: 0 }); // Hide global cursor for clean interaction
            }}
            onMouseLeave={() => {
                gsap.to(closeBtnRef.current, { scale: 1, x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
                 gsap.to('.ferro-mouse-follower-ball', { scale: 1, opacity: 1 });
            }}
            onMouseMove={(e) => {
                const bg = closeBtnRef.current;
                const r = bg.getBoundingClientRect();
                const x = e.clientX - r.left - r.width / 2;
                const y = e.clientY - r.top - r.height / 2;
                gsap.to(bg, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.2
                });
            }}
          >
            <X strokeWidth={1.5} className="text-white group-hover:text-black w-6 h-6 md:w-8 md:h-8 transition-colors duration-300" />
          </div>

          <div className="flex flex-col space-y-0 md:space-y-12">
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
                    <span className="absolute -left-6 top-1 text-sm md:-left-8 md:top-2 md:text-lg text-white/40 font-mono opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-x-4 group-hover:translate-x-0 hidden md:block">
                        0{index + 1}
                    </span>
                    {key === 'projects' || key === 'home' ? (
                        <TransitionLink
                            to={key === 'projects' ? '/projects' : '/'}
                            className="text-[clamp(5rem,18vw,9rem)] md:text-[clamp(3rem,6vw,6rem)] font-arsenica block relative overflow-hidden leading-[1.1] mix-blend-difference"
                            onClick={toggleNav}
                        >
                            <span className="block transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-hover:skew-y-2 active:-translate-y-full active:skew-y-2 text-white/90 font-arsenica">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="block absolute top-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-[110%] rotate-2 skew-y-6 group-hover:translate-y-0 group-hover:rotate-0 group-hover:skew-y-0 active:translate-y-0 active:rotate-0 active:skew-y-0 text-white font-arsenica">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                        </TransitionLink>
                    ) : (
                        <a 
                            href={`/${key === 'home' ? '#hero' : '#' + key}`} 
                            className="text-[clamp(5rem,18vw,9rem)] md:text-[clamp(3rem,6vw,6rem)] font-arsenica block relative overflow-hidden leading-[1.1] mix-blend-difference"
                            onClick={toggleNav}
                        >
                            <span className="block transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full group-hover:skew-y-2 active:-translate-y-full active:skew-y-2 text-white/90 font-arsenica">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                            <span className="block absolute top-0 left-0 transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-[110%] rotate-2 skew-y-6 group-hover:translate-y-0 group-hover:rotate-0 group-hover:skew-y-0 active:translate-y-0 active:rotate-0 active:skew-y-0 text-white font-arsenica">
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </span>
                        </a>
                    )}
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
      
    </>
  );
};

export default Navbar;
