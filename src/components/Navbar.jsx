import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Shery from 'sheryjs';
import { useLoader } from '../context/LoaderContext';

const Navbar = () => {
  const [navActive, setNavActive] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    let lastScroll = 0;
    const handleScroll = () => {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll <= 0) {
        document.body.classList.remove('scroll-down');
      }

      if (currentScroll > lastScroll && !document.body.classList.contains('scroll-down')) {
        document.body.classList.add('scroll-down');
      }

      if (currentScroll < lastScroll && document.body.classList.contains('scroll-down')) {
        document.body.classList.remove('scroll-down');
      }

      lastScroll = currentScroll;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMenuClick = () => {
    setNavActive(true);
    
    gsap.from('.nav-img', {
      opacity: 0,
      xPercent: -100,
      duration: 2,
      ease: 'power4.inOut',
    });

    gsap.from('.nav-ul li a', {
      opacity: 0,
      skewY: 60,
      yPercent: -360,
      stagger: 0.2,
      duration: 1,
      ease: 'easeIn',
    });
  };

  const handleCloseNav = () => {
    setNavActive(false);
  };

  return (
    <>
      <nav className={`nav ${navActive ? 'active' : ''}`} ref={navRef}>
        <div className="nav-menu btn-underline" onClick={handleCloseNav}>
          Close
        </div>
        <div className="nav-img non-hover">
          <img className="img" src="/src/assets/imgs/Web_Photo_Editor.jpg" alt="hero" />
        </div>
        <div className="nav-ul">
          <ul>
            <li><a className="nav-btn" href="#hero" onClick={handleCloseNav}><span>Home</span><span>Home</span></a></li>
            <li><a className="nav-btn" href="#aboutme" onClick={handleCloseNav}><span>AboutMe</span><span>AboutMe</span></a></li>
            <li><a className="nav-btn" href="#projects" onClick={handleCloseNav}><span>Projects</span><span>Projects</span></a></li>
            <li><a className="nav-btn" href="#work" onClick={handleCloseNav}><span>ContactMe</span><span>ContactMe</span></a></li>
          </ul>
        </div>
      </nav>
      
      <div className="navbar">
        <div className="logo">
          <a href="#hero" className="btn-underline non-hover">ATHARVA</a>
        </div>
        <div className="menu btn-underline non-hover" onClick={handleMenuClick}>
          Menu
        </div>
      </div>
    </>
  );
};

export default Navbar;
