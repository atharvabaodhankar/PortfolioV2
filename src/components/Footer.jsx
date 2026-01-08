import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Footer = () => {
  const footerRef = useRef(null);

  useGSAP(() => {
    gsap.from('.footer-h1', {
      opacity: 0,
      y: 450,
      duration: 1.5,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer',
        scrub: 2,
        start: 'top 90%',
        end: 'top 30%',
      },
    });

    gsap.from('.footer-img', {
      opacity: 0,
      rotate: 30,
      scale: 0,
      duration: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: '.footer',
        scrub: 2,
        start: 'top 85%',
        end: 'top 30%',
      },
    });
  }, { scope: footerRef });

  return (
    <section id="footer" ref={footerRef} className="non-hover flex items-center justify-center flex-col py-20 pt-0">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="-mb-2">
        <path
          fill="#000"
          fillOpacity="1"
          d="M0,96L48,80C96,64,192,32,288,58.7C384,85,480,171,576,224C672,277,768,299,864,277.3C960,256,1056,192,1152,165.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>
      <div className="footer w-full bg-black px-20 pb-40 flex items-start justify-between">
        <div className="footer-left text-white w-[500px]">
          <h1 className="font-fontstyle text-[8rem]">Get in touch.</h1>
          <p className="text-[1.9rem] my-8">Crafting beautiful & engaging websites. Let's collaborate!</p>
          <a href="#work" className="capsule-btn">
            <span>Explore Now</span>
            <span>Explore Now</span>
          </a>
        </div>
        <div className="footer-right w-auto">
          <ul className="list-none">
            <li className="my-4">
              <a href="#" className="nav-btn text-white text-[3rem]">
                Home
              </a>
            </li>
            <li className="my-4">
              <a href="#" className="nav-btn text-white text-[3rem]">
                AboutMe
              </a>
            </li>
            <li className="my-4">
              <a href="#" className="nav-btn text-white text-[3rem]">
                Projects
              </a>
            </li>
            <li className="my-4">
              <a href="#" className="nav-btn text-white text-[3rem]">
                ContactMe
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-logo h-[30vw] w-full overflow-hidden bg-black select-none">
        <div className="footer-text w-full h-full relative">
          <h2 className="absolute text-white text-[21vw] text-transparent [-webkit-text-stroke:2px_#faf6f6]">
            ATHARVA
          </h2>
          <h2 className="absolute text-white text-[21vw] animate-footerWave">ATHARVA</h2>
        </div>
      </div>
    </section>
  );
};

export default Footer;
