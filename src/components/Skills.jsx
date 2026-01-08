import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import Shery from 'sheryjs'; // TODO: Fix Shery imports

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Skills = () => {
  const skillsRef = useRef(null);

  useGSAP(() => {
      const skillsTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#skills',
          start: '40% 50%',
          end: '50% 50%',
          scrub: 2,
        },
      });

      // Animate each skill appearing
      const skillIds = ['#js', '#react', '#tw', '#mysql', '#bs', '#gs', '#solidity', '#node', '#express', '#python', '#jquery', '#supabase', '#firebase', '#php'];
      
      skillIds.forEach(id => {
        skillsTl.to(id, {
          filter: 'blur(0px)',
          opacity: 1,
        });
      });

      // Skills heading animation
      gsap.from('.skills-left h1', {
        opacity: 0,
        yPercent: -100,
        duration: 2,
        ease: 'easeIn',
        scrollTrigger: {
          trigger: '#skills',
          start: '40% 50%',
          end: '55% 50%',
          scrub: 2,
        },
      });

      //Skills image animation
      gsap.from('.skills-img', {
        scale: 0.5,
        duration: 1.5,
        opacity: 0,
        ease: 'easeIn',
        scrollTrigger: {
          trigger: '#skills',
          start: '0 50%',
          end: '50% 50%',
          scrub: 2,
        },
      });

    // Shery effect for desktop (TODO: Re-enable when Shery is properly imported)
    // if (window.matchMedia('(min-width: 768px)').matches) {
    //   Shery.imageEffect('.skills-img', {
    //     style: 3,
    //     // preset: './presets/wigglewobble.json', // Missing file, using default
    //   });
    // }

  }, { scope: skillsRef });

  const skills = [
    { id: 'js', name: 'JAVASCRIPT' },
    { id: 'bs', name: 'BOOTSTRAP' },
    { id: 'tw', name: 'TAILWIND' },
    { id: 'gs', name: 'GSAP' },
    { id: 'mysql', name: 'MY SQL' },
    { id: 'solidity', name: 'SOLIDITY' },
    { id: 'react', name: 'REACT' },
    { id: 'node', name: 'NODE.JS' },
    { id: 'express', name: 'EXPRESS.JS' },
    { id: 'python', name: 'PYTHON' },
    { id: 'jquery', name: 'JQUERY' },
    { id: 'php', name: 'PHP' },
    { id: 'firebase', name: 'FIREBASE' },
    { id: 'supabase', name: 'SUPABASE' },
  ];

  return (
    <section id="skills" ref={skillsRef} className="flex items-center justify-center py-56">
      <div className="skills-left mr-16 w-fit">
        <h1 className="text-[5vw] z-[2] font-normal leading-[5vw] relative text-center uppercase">
          Skills & <br /> Expertise
        </h1>
        <div className="skills-img non-hover w-[500px] h-[250px] -mt-[35px]">
          <img src="/src/assets/imgs/skills.png" alt="" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="skills-right flex items-center justify-center self-end flex-wrap w-[40%]">
        {skills.map((skill) => (
          <span
            key={skill.id}
            id={skill.id}
            className="block m-4 text-black text-[3rem] py-4 px-8 rounded-[3rem] border-2 border-black relative z-[2] cursor-pointer overflow-hidden transition-all duration-300 blur-[10px] select-none opacity-0"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
};

export default Skills;
