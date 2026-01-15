import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Ferro = () => {
  const ferroRef = useRef(null);

  useGSAP(() => {
    gsap.to('.ferro-c1', {
      xPercent: -200,
      ease: 'none',
      scrollTrigger: {
        trigger: '#ferro',
        scrub: true,
        start: 'top top',
        end: '+300% top',
        pin: true,
        invalidateOnRefresh: true
      },
    });
  }, { scope: ferroRef });

  return (
    <section id="ferro" ref={ferroRef} className="overflow-hidden flex items-center justify-center flex-col w-full py-24 pt-0">
      <div className="ferro-header w-full text-center font-[Arimo]">
        <h1 className="text-[5vw] font-normal mb-16 inline-block font-[ArsenicaSemibold]">&nbsp;</h1>
      </div>
      <div className="ferro-container w-screen h-[600px] flex overflow-x-hidden">
        <div className="ferro-c1 ferro-section-1 w-screen h-full flex-shrink-0 py-12 px-16 flex items-center justify-center">
          <div className="ferro-section-1-text flex items-start justify-center flex-col gap-8">
            <h1 className="ferro-h1 text-[9vw] font-arsenica tracking-wider">What is Ferro.Js?</h1>
            <h2 className="ferro-h2 text-[3rem]">A Dynamic JavaScript Animation Library</h2>
          </div>
        </div>
        <div className="ferro-c1 ferro-section-2 w-screen h-full flex-shrink-0 py-12 px-16 flex items-center justify-center flex-col text-center">
          <div className="ferro-img w-1/2 h-auto mb-16">
            <img 
              src="/src/assets/imgs/ferro.png" 
              data-tilt 
              data-tilt-full-page-listening 
              alt="" 
              className="w-full h-full object-contain grayscale brightness-[0.1]"
            />
          </div>
          <p className="text-[2vw] leading-[2.5vw] w-4/5">
            Ferro.js is a versatile JavaScript library I developed to enhance web design with engaging, interactive
            animations. Built on top of the powerful GSAP (GreenSock Animation Platform), Ferro.js offers a suite of
            customizable effects designed to bring elements like headings, buttons, images, and more to life. Whether
            you're aiming for subtle animations or eye-catching interactions, Ferro.js provides the tools to create a
            unique user experience.
          </p>
        </div>
        <div className="ferro-c1 ferro-section-3 w-screen h-full flex-shrink-0 py-12 px-16 flex items-center justify-center">
          <div className="ferro-section-1-text py-16 text-center flex items-center justify-center flex-col gap-8">
            <h1 className="ferro-h1 text-[7vw] !important font-arsenica">Elevate Your Web Experience with Interactive Animations</h1>
            <a href="https://www.npmjs.com/package/ferro-js" className="ferro-btn text-[3em] font-arsenica text-black border-b-2 border-black">
              Visit NPM
            </a>
            <a href="https://github.com/atharvabaodhankar/ferro.js" className="ferro-btn text-[3em] font-arsenica text-black border-b-2 border-black">
              Visit GITHUB
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Ferro;
