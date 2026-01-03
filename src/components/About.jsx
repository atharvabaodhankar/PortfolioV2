import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const aboutRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#aboutme',
          start: '10% 50%',
          end: '50% 50%',
          scrub: 2,
        },
      });

      tl.from('.aboutmeimg-outer', {
        opacity: 0,
        y: 100,
        ease: 'ease',
      });

      tl.from('.aboutme-right h1', {
        opacity: 0,
        x: -100,
        ease: 'ease',
      });

      tl.from('.aboutme-left-text-h1, .aboutme-left-text-p span', {
        opacity: 0,
        x: 100,
        stagger: 0.2,
        skewX: 40,
        ease: 'ease',
      });
    }, aboutRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="aboutme" ref={aboutRef} className="flex items-start justify-center min-h-[90vh] py-28">
      <div className="aboutme-right w-fit flex items-center justify-start flex-col mr-20">
        <h1 className="text-[5vw] font-normal -mb-10 relative z-[2]">About Me</h1>
        <div className="aboutmeimg-outer">
          <div className="aboutme-img non-hover w-[300px] h-[400px] relative">
            <img src="/src/assets/imgs/aboutme-img.jpeg" alt="" className="w-full h-full object-cover" />
          </div>
        </div>
      </div>
      <div className="aboutme-left flex items-start justify-start flex-col text-left px-8 w-[550px] mt-8 overflow-hidden">
        <h1 className="aboutme-left-text-h1 text-[3rem] mb-8">
          Bringing websites to life, one pixel at a time.
        </h1>
        <p className="aboutme-left-text-p text-[1.9rem]">
          <span className="inline-block">
            I'm a passionate web designer with over 50+ websites under my belt. I bring
            sites to life with clean, user-friendly interfaces and a knack for captivating animations. My toolbox
            overflows with expertise in JavaScript and its libraries, allowing me to push the boundaries of web
            design.
          </span>
          <br /> <br />
          <span className="inline-block">
            But my skills don't stop there. I'm a tech enthusiast who thrives on learning and integrating the latest
            advancements. Whether it's video editing or exploring cutting-edge tools, I'm always up for a
            challenge.
          </span>
          <br /> <br />
          <span className="inline-block">
            I believe in the power of websites to not just look good, but to truly engage and connect with users.
            Let's collaborate and bring your vision to life!
          </span>
        </p>
      </div>
    </section>
  );
};

export default About;
