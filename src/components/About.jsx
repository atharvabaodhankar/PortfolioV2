import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About = () => {
  const aboutRef = useRef(null);

  useGSAP(() => {
    // Set initial states for all animated elements
    gsap.set('.about-title', { opacity: 0, y: 50 });
    gsap.set('.about-image', { scale: 0.8, rotation: -10, opacity: 0, y: 50 });
    gsap.set('.text-line', { opacity: 0, y: 40, x: 20 });
    gsap.set('.highlight', { opacity: 0, scale: 0.9 });
    gsap.set('.skill-tag', { opacity: 0, y: 20, scale: 0.9 });
    gsap.set('.floating-element', { opacity: 0, scale: 0 });

    // Create main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 85%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
        markers: false, // Set to true for debugging
        refreshPriority: -1,
      },
    });

    // Animate title first
    tl.to('.about-title', {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
    })
    // Then image with premium easing
    .to('.about-image', {
      scale: 1,
      rotation: 0,
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    }, '-=0.5')
    // Then text lines with stagger
    .to('.text-line', {
      opacity: 1,
      y: 0,
      x: 0,
      duration: 0.8,
      stagger: {
        amount: 0.6,
        from: 'start',
        ease: 'power2.out'
      },
      ease: 'power2.out',
    }, '-=0.8')
    // Then highlights with stagger
    .to('.highlight', {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: {
        amount: 0.4,
        from: 'start',
        ease: 'back.out(1.7)'
      },
      ease: 'back.out(1.7)',
    }, '-=0.4')
    // Skill tags with bounce effect
    .to('.skill-tag', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      stagger: {
        amount: 0.3,
        from: 'start',
        ease: 'back.out(1.4)'
      },
      ease: 'back.out(1.4)',
    }, '-=0.2')
    // Finally floating elements
    .to('.floating-element', {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.5)',
    }, '-=0.5');

    // Add continuous hover effects for image
    const imageElement = aboutRef.current?.querySelector('.about-image');
    if (imageElement) {
      const hoverTl = gsap.timeline({ paused: true });
      hoverTl.to(imageElement, { 
        scale: 1.05, 
        rotation: 2, 
        duration: 0.4,
        ease: 'power2.out'
      });

      imageElement.addEventListener('mouseenter', () => hoverTl.play());
      imageElement.addEventListener('mouseleave', () => hoverTl.reverse());
    }

    // Parallax effect for image
    gsap.to('.about-image', {
      y: -30,
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
      },
    });

    // Floating elements continuous animation
    gsap.to('.floating-element', {
      y: -10,
      duration: 2,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: -1,
      stagger: 0.2,
    });

    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };

  }, { scope: aboutRef });

  return (
    <section 
      id="aboutme" 
      ref={aboutRef} 
      className="relative min-h-screen flex items-center justify-center py-20 px-8 overflow-hidden bg-gradient-to-br from-gray-50 to-white"
    >
      {/* Background elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-black/5 to-black/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-10 w-48 h-48 bg-gradient-to-tr from-gray-900/5 to-gray-600/10 rounded-full blur-2xl"></div>
      
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
          <div className="text-line">
            <h2 className="text-3xl lg:text-4xl font-light leading-tight text-gray-900 mb-6">
              I'm <span className="highlight relative inline-block font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Atharva Baodhankar</span> — a <span className="highlight relative inline-block font-medium bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Web Engineer</span> focused on crafting high-performance, animation-rich, and system-driven web applications.
            </h2>
          </div>
          
          <div className="text-line">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
              From <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">interactive frontend experiences</span> to <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">blockchain-backed systems</span> and <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">AI-powered tools</span>, I build products that feel modern, fast, and intentional.
            </p>
          </div>
          
          <div className="text-line">
            <p className="text-xl lg:text-2xl text-gray-700 leading-relaxed font-light">
              I enjoy working <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">close to the metal</span> — understanding how things work, optimizing flows, and shipping <span className="highlight relative inline-block font-medium text-gray-900 border-b-2 border-gray-900/20 hover:border-gray-900 transition-colors duration-300">production-grade systems</span>.
            </p>
          </div>

          {/* Premium skill tags */}
          <div className="pt-8">
            <div className="flex flex-wrap gap-4">
              <div className="skill-tag px-6 py-3 bg-gray-900 text-white rounded-full text-sm font-medium tracking-wide hover:bg-gray-800 transition-colors duration-300 cursor-pointer">
                Frontend Engineering
              </div>
              <div className="skill-tag px-6 py-3 bg-gray-100 text-gray-900 rounded-full text-sm font-medium tracking-wide hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                System Architecture
              </div>
              <div className="skill-tag px-6 py-3 bg-gray-100 text-gray-900 rounded-full text-sm font-medium tracking-wide hover:bg-gray-200 transition-colors duration-300 cursor-pointer">
                Performance Optimization
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating elements */}
      <div className="floating-element absolute top-1/4 left-8 w-2 h-2 bg-gray-900 rounded-full opacity-20"></div>
      <div className="floating-element absolute bottom-1/3 right-12 w-3 h-3 bg-gray-600 rounded-full opacity-30"></div>
      <div className="floating-element absolute top-1/2 right-1/4 w-1 h-1 bg-gray-800 rounded-full opacity-40"></div>
    </section>
  );
};

export default About;
