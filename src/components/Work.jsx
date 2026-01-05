import React, { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Work = () => {
  const workRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(min-width: 768px)').matches) {
        gsap.fromTo(
          '.work-img img',
          { y: '-9vw' },
          { y: '9vw', scrollTrigger: { trigger: '.work-img', scrub: 3 } }
        );
      } else {
        gsap.from('.work-img img', {
          opacity: 0,
          rotate: 10,
          y: 10,
          skewY: -10,
          ease: 'ease',
          scrollTrigger: {
            trigger: '.work-img',
            start: '0% 60%',
            end: '20% 60%',
            scrub: 2,
          },
        });
      }

      gsap.from('.work-left h2, .work-left h1', {
        opacity: 0,
        stagger: 0.1,
        y: 100,
        skewX: 10,
        ease: 'ease',
        scrollTrigger: {
          trigger: '.work-left',
          start: '0% 80%',
          end: '30% 80%',
          scrub: 2,
        },
      });

      gsap.from('.work-left ul li', {
        opacity: 0,
        stagger: 0.1,
        x: 100,
        ease: 'ease',
        scrollTrigger: {
          trigger: '.work-left',
          start: '0% 50%',
          end: '20% 50%',
          scrub: 2,
        },
      });
    }, workRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={workRef} className="flex items-center justify-center py-28">
      <div className="work-left flex items-start justify-start flex-col mx-16 mr-40 overflow-hidden">
        <h2 className="text-[2.5rem] font-[FontStyleNew] font-normal">Atharva Baodhankar</h2>
        <h1 className="text-[5vw] font-normal my-8">
          WORK <br /> WITH ME
        </h1>

        <div className="social-media-list relative text-[22px] text-center w-[70%] px-4 flex items-center justify-between flex-wrap">
          <a href="https://github.com/atharvabaodhankar" target="_blank" rel="noopener noreferrer" className="contact-icon">
            <li className="relative inline-block h-[60px] w-[60px] my-2.5 mx-1 leading-[60px] rounded-full text-white bg-white text-[rgb(27,27,27)] cursor-pointer transition-all duration-200 shadow-[0_0_0_1px_#020202]">
              <i className="fa-brands fa-github"></i>
            </li>
          </a>
          <a href="https://www.facebook.com/profile.php?id=100069517304222" target="_blank" rel="noopener noreferrer" className="contact-icon">
            <li className="relative inline-block h-[60px] w-[60px] my-2.5 mx-1 leading-[60px] rounded-full text-white bg-white text-[rgb(27,27,27)] cursor-pointer transition-all duration-200 shadow-[0_0_0_1px_#020202]">
              <i className="fa-brands fa-facebook-f"></i>
            </li>
          </a>
          <a href="https://www.instagram.com/op_athu_/" target="_blank" rel="noopener noreferrer" className="contact-icon">
            <li className="relative inline-block h-[60px] w-[60px] my-2.5 mx-1 leading-[60px] rounded-full text-white bg-white text-[rgb(27,27,27)] cursor-pointer transition-all duration-200 shadow-[0_0_0_1px_#020202]">
              <i className="fa-brands fa-instagram"></i>
            </li>
          </a>
          <a href="https://www.linkedin.com/in/atharva-baodhankar" target="_blank" rel="noopener noreferrer" className="contact-icon">
            <li className="relative inline-block h-[60px] w-[60px] my-2.5 mx-1 leading-[60px] rounded-full text-white bg-white text-[rgb(27,27,27)] cursor-pointer transition-all duration-200 shadow-[0_0_0_1px_#020202]">
              <i className="fa-brands fa-linkedin-in"></i>
            </li>
          </a>
        </div>

        <ul className="list-none text-[3rem] mt-20">
          <li className="font-[FontStyleNew] my-4">Solapur, Maharashtra</li>
          <li className="font-[FontStyleNew] my-4">+91 9373924727</li>
          <li className="font-[FontStyleNew] my-4">baodhankaratharva@.gmail.com</li>
        </ul>
      </div>
      <div className="work-img non-hover w-[400px] h-[500px] rotate-[8deg] ml-20 relative overflow-hidden">
        <img src="/src/assets/imgs/navBar-img.jpg" alt="" className="w-full -top-[7vw] left-0 h-[calc(100%+2vw)] object-cover absolute" />
      </div>
    </section>
  );
};

export default Work;
