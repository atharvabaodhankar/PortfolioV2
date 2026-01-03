import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

const Marquee = () => {
  const marqueeRef = useRef(null);

  useEffect(() => {
    let currentScroll = 0;
    let isScrollingDown = true;
    const arrows = document.querySelectorAll('.arrow');

    const tween = gsap
      .to('.marquee_part', {
        xPercent: -100,
        repeat: -1,
        duration: 5,
        ease: 'linear',
      })
      .totalProgress(0.5);

    gsap.set('.marquee_inner', { xPercent: -50 });

    const handleScroll = () => {
      if (window.pageYOffset > currentScroll) {
        isScrollingDown = true;
      } else {
        isScrollingDown = false;
      }

      gsap.to(tween, {
        timeScale: isScrollingDown ? 1 : -1,
      });

      arrows.forEach((arrow) => {
        if (isScrollingDown) {
          arrow.classList.remove('active');
        } else {
          arrow.classList.add('active');
        }
      });

      currentScroll = window.pageYOffset;
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      tween.kill();
    };
  }, []);

  return (
    <section id="marquee" ref={marqueeRef} className="relative bg-[#0f0f0f] text-[#eee] py-12 font-semibold text-[4rem] uppercase overflow-hidden select-none">
      <div className="marquee_inner flex w-fit flex-auto flex-row">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="marquee_part flex items-center flex-shrink-0 px-2">
            modern web designs
            <div className="arrow w-32 h-24 mx-4 -rotate-180 transition-all duration-600">
              <img src="/src/assets/arrow.svg" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
