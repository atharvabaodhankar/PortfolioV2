import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About = () => {
  const aboutRef = useRef(null);

  useGSAP(() => {
    // Main timeline for the entire section
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: '#aboutme',
        start: '0% 80%',
        end: '60% 50%',
        scrub: 1.2,
      },
    });

    // Image entrance with magnetic effect
    mainTl.from('.about-image', {
      scale: 0.6,
      rotation: -20,
      opacity: 0,
      y: 120,
      ease: 'power3.out',
      duration: 1.8,
    }, 0);

    // Title reveal with split text effect
    mainTl.from('.about-title', {
      opacity: 0,
      y: 100,
      skewY: 8,
      ease: 'power3.out',
      duration: 1.4,
    }, 0.2);

    // Premium text blocks with stagger
    mainTl.from('.text-block', {
      opacity: 0,
      y: 80,
      x: 60,
      skewX: 5,
      stagger: 0.2,
      ease: 'power2.out',
      duration: 1.2,
    }, 0.5);

    // Highlight words animation
    mainTl.from('.highlight', {
      opacity: 0,
      scale: 0.7,
      ease: 'back.out(2)',
      stagger: 0.08,
      duration: 1,
    }, 1);

    // Floating animation for image on scroll
    gsap.to('.about-image', {
      y: -30,
      rotation: 3,
      ease: 'none',
      scrollTrigger: {
        trigger: '#aboutme',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2,
      },
    });

    // Parallax effect for background elements
    gsap.to('.bg-element', {
      y: -80,
      rotation: 10,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: '#aboutme',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 3,
      },
    });

    // Continuous floating animation for highlights
    gsap.to('.highlight', {
      y: -2,
      duration: 2,
      ease: 'power1.inOut',
      stagger: 0.1,
      repeat: -1,
      yoyo: true,
    });

  }, { scope: aboutRef });

  return (
    <section 
      id="aboutme" 
      ref={aboutRef} 
      className="relative min-h-screen flex items-center justify-center py-20 px-8 overflow-hidden bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Background decorative elements */}
      <div className="bg-element absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-black/5 to-black/10 rounded-full blur-3xl"></div>
      <div className="bg-element absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-gray-900/5 to-gray-600/10 rounded-full blur-2xl"></div>
      
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Left side - Image */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="about-title absolute -top-16 left-0 lg:-left-8">
            <h1 className="text-6xl lg:text-7xl font-light text-gray-900 tracking-tight">
              About Me
            </h1>
          </div>
          
          <div className="about-image relative group cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-2xl transform rotate-3 group-hover:rotate-6 transition-transform duration-700"></div>
            <div className="relative w-80 h-96 lg:w-96 lg:h-[480px] rounded-2xl overflow-hidden shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-all duration-700">
              <img 
                src="/src/assets/imgs/aboutme-img.jpeg" 
                alt="Atharva Baodhankar" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Right side - Content */}
        <div className="space-y-8 lg:pl-8">
          <div className="text-block">
            <h2 className="text-3xl lg:text-4xl font-light leading-tight text-gray-900 mb-6">
              I'm <span className="highlight relative inline-block font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Atharva Baodhankar</span> — a <span className="highlight relative inline-block font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Web Engineer</span> focused on crafting high-performance, animation-rich, and system-driven web applications.
            </h2>
          </div>
          
          <div className="text-block">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
              From <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">interactive frontend experiences</span> to <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">blockchain-backed systems</span> and <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">AI-powered tools</span>, I build products that feel modern, fast, and intentional.
            </p>
          </div>
          
          <div className="text-block">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
              I enjoy working <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">close to the metal</span> — understanding how things work, optimizing flows, and shipping <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">production-grade systems</span>.
            </p>
          </div>

          {/* Premium CTA */}
          <div className="text-block pt-8">
            <div className="flex flex-wrap gap-4">
              <div className="px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 cursor-pointer">
                Frontend Engineering
              </div>
              <div className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full text-sm font-medium tracking-wide hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                System Architecture
              </div>
              <div className="px-6 py-3 bg-gray-100 text-gray-900 rounded-full text-sm font-medium tracking-wide hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                Performance Optimization
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="absolute top-1/4 left-8 w-2 h-2 bg-gray-900 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-1/3 right-12 w-3 h-3 bg-gray-600 rounded-full opacity-30 animate-bounce"></div>
      <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-gray-800 rounded-full opacity-40"></div>
    </section>
  );
};

export default About;
