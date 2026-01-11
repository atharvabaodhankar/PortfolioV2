import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
  const containerRef = useRef(null);
  
  const skillGroups = [
    {
      title: "Web Engineering",
      description: "Building the backbone of modern web experiences.",
      skills: ["JavaScript (ES6+)", "React / Vite", "MERN Stack", "API Design", "Performance Optimization"]
    },
    {
      title: "Blockchain & Web3",
      description: "Decentralized systems and smart contract logic.",
      skills: ["Solidity", "Ethers.js", "Smart Contracts", "Account Abstraction (ERC-4337)", "Polygon / Ethereum Testnets"]
    },
    {
      title: "System Design",
      description: "Architecting scalable and maintainable data flows.",
      skills: ["Application Architecture", "Data Modeling", "Auth & Role Systems", "Scalable Frontend Patterns"]
    },
    {
      title: "Motion & Interaction",
      description: "Bringing interfaces to life with fluid motion.",
      skills: ["GSAP", "ScrollTrigger", "Smooth Scrolling Systems", "Micro-interactions"]
    },
    {
      title: "Tooling & Learning",
      description: "The ecosystem that powers the workflow.",
      skills: ["Git & GitHub", "Docker (Foundations)", "Agentic AI Tools", "Continuous Experimentation"]
    }
  ];

  useGSAP(() => {
    // Reveal section header
    gsap.from('.skills-header', {
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        end: 'top 60%',
        toggleActions: 'play none none reverse'
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });

    // Reveal each group
    const groups = gsap.utils.toArray('.skill-group');
    
    groups.forEach((group, i) => {
      gsap.from(group, {
        scrollTrigger: {
          trigger: group,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 40,
        opacity: 0,
        duration: 1,
        delay: i * 0.1, // Stagger groups slightly
        ease: 'power2.out'
      });
      
      // Animate skills within the group
      const skills = group.querySelectorAll('.skill-item');
      gsap.from(skills, {
        scrollTrigger: {
          trigger: group,
          start: 'top 85%'
        },
        y: 20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.2 // Wait for group to start appearing
      });
    });

  }, { scope: containerRef });

  return (
    <section 
      ref={containerRef} 
      className="w-full min-h-screen bg-white text-black px-6 md:px-12 lg:px-24 py-32 relative z-10 font-sans"
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Editorial Header */}
        <div className="skills-header mb-24 lg:mb-32 border-b border-black/10 pb-8">
          <h2 
            className="text-5xl md:text-7xl lg:text-[6rem] leading-[0.9] font-medium tracking-tight"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            Technical Practice
          </h2>
          <div className="flex justify-end mt-4">
            <p 
              className="text-sm uppercase tracking-[0.2em] text-gray-400 font-medium max-w-xs text-right"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Curated capabilities for high-end digital production
            </p>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-20 lg:gap-x-12">
          {skillGroups.map((group, index) => (
            <div 
              key={group.title} 
              className={`skill-group lg:col-span-4 ${index === 0 || index === 3 ? 'lg:col-start-1' : ''} ${index === 1 || index === 4 ? 'lg:col-start-5' : ''} ${index === 2 ? 'lg:col-start-9' : ''} flex flex-col gap-6`}
            >
              <div className="border-t border-black/5 pt-6">
                <h3 
                  className="text-2xl font-light mb-2 text-primary"
                  style={{ fontFamily: "'Bodoni Moda', serif" }}
                >
                  {group.title}
                </h3>
                <p 
                  className="text-sm text-gray-400 font-light leading-relaxed mb-6"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {group.description}
                </p>
                
                <ul className="space-y-4">
                  {group.skills.map((skill) => (
                    <li 
                      key={skill} 
                      className="skill-item text-lg md:text-xl font-light tracking-wide group cursor-default w-fit"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      <span className="relative inline-block overflow-hidden">
                        <span className="block transition-transform duration-500 ease-out group-hover:-translate-y-full">
                          {skill}
                        </span>
                        <span className="absolute top-0 left-0 block translate-y-full transition-transform duration-500 ease-out group-hover:translate-y-0 italic text-gray-500 font-medium">
                          {skill}
                        </span>
                        <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black transform scale-x-0 transition-transform duration-500 origin-left group-hover:scale-x-100"></span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
