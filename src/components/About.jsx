import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const About = () => {
  const aboutRef = useRef(null);

  useGSAP(() => {
    // Set initial states for reveal animations
    gsap.set('.reveal-text', { opacity: 0, y: 40 });
    gsap.set('.tilt-card', { scale: 0.9, opacity: 0, rotationY: -15 });
    gsap.set('.skill-pill', { opacity: 0, y: 20, scale: 0.9 });

    // Create main timeline with ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
    });

    // Animate elements in sequence with delays
    tl.to('.reveal-text', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.2,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    })
    .to('.tilt-card', {
      scale: 1,
      opacity: 1,
      rotationY: 0,
      duration: 0.8,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }, '-=0.8')
    .to('.skill-pill', {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.6,
      stagger: 0.05,
      ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
    }, '-=0.4');

    // Image hover effect
    const imageContainer = aboutRef.current?.querySelector('.image-container');
    const tiltCard = aboutRef.current?.querySelector('.tilt-card');
    
    if (imageContainer && tiltCard) {
      imageContainer.addEventListener('mouseenter', () => {
        gsap.to(tiltCard, { 
          rotationY: -5, 
          rotationX: 2, 
          duration: 0.8,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
      });
      
      imageContainer.addEventListener('mouseleave', () => {
        gsap.to(tiltCard, { 
          rotationY: 0, 
          rotationX: 0, 
          duration: 0.8,
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)'
        });
      });
    }

  }, { scope: aboutRef });

  return (
    <section 
      id="aboutme" 
      ref={aboutRef} 
      className="w-full px-6 md:px-12 lg:px-24 pt-32 pb-20 max-w-[1600px] mx-auto relative font-sans"
    >
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1] overflow-hidden">
        <div className="absolute top-[20%] right-[10%] w-[500px] h-[500px] bg-gray-100 rounded-full blur-[100px] opacity-60"></div>
        <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-gray-200 rounded-full blur-[80px] opacity-40"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start relative">
        {/* Title */}
        <div className="lg:col-span-12 mb-12 lg:mb-0 lg:absolute lg:-left-4 lg:top-0 reveal-text z-10">
          <h1 
            className="text-6xl md:text-8xl font-display font-medium tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-black to-gray-600 opacity-90"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            About Me
          </h1>
        </div>

        {/* Image */}
        <div className="lg:col-span-5 lg:col-start-2 lg:mt-32 relative reveal-text image-container">
          <div className="relative tilt-card group cursor-none" style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}>
            {/* Shadow/background card */}
            <div className="absolute inset-0 bg-gray-200 rounded-lg transform translate-x-3 translate-y-3 -rotate-2 transition-transform duration-700 ease-expo-out group-hover:translate-x-8 group-hover:translate-y-6 group-hover:-rotate-6 z-0"></div>
            
            {/* Main image card */}
            <div className="relative overflow-hidden rounded-sm shadow-2xl bg-white p-1.5 transform rotate-2 transition-transform duration-700 ease-expo-out group-hover:rotate-0 z-10">
              <div className="aspect-[3/4.2] overflow-hidden rounded-sm relative">
                <img 
                  alt="Portrait of Atharva Baodhankar" 
                  className="w-full h-full object-cover filter grayscale contrast-[1.05] brightness-105 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-expo-out"
                  src="/src/assets/imgs/aboutme-img.jpeg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-6 lg:col-start-7 lg:mt-32 flex flex-col gap-12 pl-0 lg:pl-12 reveal-text">
          <div className="space-y-8 relative">
            <h2 
              className="text-3xl md:text-4xl lg:text-[2.75rem] leading-[1.15] font-light tracking-tight text-primary"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              I'm Atharva Baodhankar — a{' '}
              <span className="font-normal relative inline-block">
                Web Engineer
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-gray-200 -z-10" preserveAspectRatio="none" viewBox="0 0 100 20">
                  <path d="M0 15 Q 50 25 100 15" fill="none" stroke="currentColor" strokeWidth="8"></path>
                </svg>
              </span>{' '}
              focused on crafting high-performance, animation-rich, and system-driven web applications.
            </h2>
            
            <div className="space-y-6 text-lg md:text-xl text-gray-500 font-light leading-relaxed max-w-2xl" style={{ fontFamily: "'Inter', sans-serif" }}>
              <p>
                From{' '}
                <span className="text-black font-normal underline-anim">interactive frontend experiences</span>{' '}
                to blockchain-backed systems and{' '}
                <span className="text-black font-normal underline-anim">AI-powered tools</span>, 
                I build products that feel modern, fast, and intentional.
              </p>
              <p>
                I enjoy working{' '}
                <span className="italic font-display font-medium text-xl text-black" style={{ fontFamily: "'Bodoni Moda', serif" }}>close to the metal</span>{' '}
                — understanding how things work, optimizing flows, and shipping{' '}
                <span className="text-black font-normal underline-anim">production-grade systems</span>.
              </p>
            </div>
          </div>

          {/* Skill tags */}
          <div className="flex flex-wrap gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="group px-6 py-3 rounded-full bg-black text-white text-sm font-medium tracking-wide border border-transparent hover:scale-105 transition-transform duration-500 cursor-default shadow-lg shadow-black/10">
              Frontend Engineering
            </span>
            <span className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 border border-transparent hover:border-gray-300 text-sm font-medium tracking-wide transition-all duration-300 cursor-default hover:bg-white">
              System Architecture
            </span>
            <span className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 border border-transparent hover:border-gray-300 text-sm font-medium tracking-wide transition-all duration-300 cursor-default hover:bg-white">
              Performance Optimization
            </span>
            <span className="px-6 py-3 rounded-full bg-gray-100 text-gray-600 border border-transparent hover:border-gray-300 text-sm font-medium tracking-wide transition-all duration-300 cursor-default hover:bg-white">
              WebGL & Animations
            </span>
          </div>

          {/* Location info */}
          <div className="pt-8 opacity-40 flex items-center gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
            <div className="h-px w-16 bg-current"></div>
            <p className="text-xs uppercase tracking-[0.2em] font-medium">Based in India • Available Worldwide</p>
          </div>
        </div>
      </div>

      {/* Skills section */}
      <div className="mt-32 lg:mt-48 pt-10 border-t border-gray-100 reveal-text">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <h3 className="text-3xl font-display italic text-primary" style={{ fontFamily: "'Bodoni Moda', serif" }}>Skills & Expertise</h3>
          <p className="text-sm text-gray-400 font-medium tracking-wide uppercase" style={{ fontFamily: "'Inter', sans-serif" }}>Curated tech stack for modern web</p>
        </div>
        
        <div className="flex flex-wrap gap-3" style={{ fontFamily: "'Inter', sans-serif" }}>
          {['Javascript', 'React', 'Next.js', 'Node.js', 'GSAP', 'Three.js', 'PostgreSQL', 'Solidity', 'Python'].map((skill) => (
            <div 
              key={skill}
              className="skill-pill group px-5 py-2 border border-gray-200 rounded-full text-xs uppercase tracking-widest font-medium hover:bg-black hover:border-black hover:text-white transition-all duration-300 cursor-default"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
