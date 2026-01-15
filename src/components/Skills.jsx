import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
  const containerRef = useRef(null);
  
  const skillGroups = [
    {
      title: "01 / Web Engineering",
      description: "Designing and engineering modern web applications with a strong focus on performance, maintainability, and real-world usability.",
      skills: ["JavaScript (ES6+)", "React", "Vite", "Node.js", "REST APIs"]
    },
    {
      title: "02 / Blockchain & Web3",
      description: "Building decentralized applications and smart contract systems that prioritize security, clarity, and developer experience.",
      skills: ["Solidity", "Ethers.js", "Smart Contracts", "ERC-4337", "Polygon / Testnets"]
    },
    {
      title: "03 / System Design",
      description: "Approaching problems with a system-first mindset — focusing on structure, data flow, and long-term scalability.",
      skills: ["Application Architecture", "Auth & Role Systems", "Database Design", "API Structuring", "Performance Thinking"]
    },
    {
      title: "04 / Motion & Interaction",
      description: "Using motion as a functional layer — guiding attention, improving clarity, and enhancing the feel of the interface.",
      skills: ["GSAP", "ScrollTrigger", "Smooth Scrolling", "Micro-interactions"]
    },
    {
      title: "05 / Tooling & Learning",
      description: "The instruments of creation and the perpetual pursuit of knowledge.",
      skills: ["Git & GitHub", "Docker (Foundations)", "Agentic AI Tools", "Continuous Learning"]
    }
  ];

  useGSAP(() => {
    // 1. Initial reveal for Left Column
    const leftTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 70%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true
      }
    });

    leftTl.from('.left-inv', {
      y: 30,
      opacity: 0,
      duration: 1.2,
      stagger: 0.15,
      ease: 'power3.out'
    });

    // 5. Left Column Parallax (Subtle)
    gsap.to('.left-column-content', {
      y: -20, // Tiny parallax drift
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        invalidateOnRefresh: true
      }
    });

    // Animate each right-column section with rhythm
    const sections = gsap.utils.toArray('.skill-section');
    
    sections.forEach((section, index) => {
      const border = section.querySelector('.section-border');
      const header = section.querySelector('.section-header');
      const list = section.querySelector('.skills-list');

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true
        }
      });

      // 3. Divider Line Animation (Premium ScaleX)
      tl.fromTo(border, 
        { scaleX: 0, transformOrigin: 'left center' },
        { scaleX: 1, duration: 0.8, ease: 'power3.out' }
      )
      // 1. Section Reveal (Staggered Content)
      .from(header, {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.4')
      .from(list, {
        y: 16,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.6');
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="w-full min-h-screen bg-white text-black px-6 md:px-12 lg:px-24 py-20 relative z-10 font-sans"
    >
      <div className="max-w-[1600px] mx-auto flex flex-col lg:flex-row gap-16 lg:gap-32">
        
        {/* LEFT COLUMN - STICKY */}
        <div className="lg:w-1/3 flex flex-col justify-between lg:h-[calc(100vh-160px)] lg:sticky lg:top-32 left-column-content">
          <div className="left-inv">
            <h1 
              className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] mb-8"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Areas<br/>of Craft
            </h1>
            <div className="h-1 w-24 bg-black mb-8"></div>
            <p 
              className="text-lg text-gray-500 font-normal leading-relaxed max-w-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              A focused overview of how I build modern web systems — blending engineering fundamentals, decentralized technology, and thoughtful interaction design.
            </p>
          </div>
          
          <div className="left-inv hidden lg:flex items-center gap-3 opacity-60 mt-auto">
            <span className="animate-spin-slow text-2xl">✳</span>
            <span className="text-xs font-mono uppercase tracking-widest">System Status: Online</span>
          </div>
        </div>

        {/* RIGHT COLUMN - SCROLLABLE */}
        <div className="lg:w-2/3 flex flex-col gap-20 pt-10 lg:pt-0">
          {skillGroups.map((group) => (
            <div key={group.title} className="skill-section pt-8 relative">
               {/* 3. Independent Border for Animation */}
              <div className="section-border absolute top-0 left-0 w-full h-[1px] bg-gray-200"></div>
              
              {/* Header Row */}
              <div className="section-header flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                <h3 
                  className="text-2xl md:text-3xl font-medium tracking-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {group.title}
                </h3>
                <p 
                  className="text-sm md:text-base text-gray-400 max-w-md text-left md:text-right leading-relaxed font-normal"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {group.description}
                </p>
              </div>

              {/* Skills List */}
              <div className="skills-list flex flex-wrap gap-x-6 gap-y-3 text-xl md:text-2xl lg:text-3xl leading-snug">
                {group.skills.map((skill, i) => (
                  <div key={skill} className="flex items-center gap-6">
                    <span 
                      className="relative cursor-default font-normal transition-all duration-500 hover:tracking-tight hover:-translate-y-[2px] inline-block group"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {skill}
                      <span className="absolute bottom-0 left-0 w-full h-[1px] bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left ease-expo-out"></span>
                    </span>
                    {i !== group.skills.length - 1 && (
                      <span className="text-gray-200 font-light">/</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
