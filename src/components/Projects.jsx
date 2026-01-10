import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Parallax, EffectCoverflow, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/parallax';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const projectsRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { supabase } = await import('../lib/supabaseClient');
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.projects-header h1', {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        ease: 'ease',
        scrollTrigger: {
          trigger: '.projects-header',
          start: '0% 80%',
          end: '40% 50%',
          scrub: 2,
        },
      });

      gsap.from('.project-article', {
        opacity: 0,
        y: 100,
        stagger: 0.2,
        ease: 'ease',
        scrollTrigger: {
          trigger: '.project-article',
          start: '0% 80%',
          end: '40% 50%',
          scrub: 2,
        },
      });
    }, projectsRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="projects" ref={projectsRef} className="overflow-hidden flex items-center justify-center flex-col py-24">
      <div className="projects-header">
        <h1 className="text-[5vw] font-normal mb-16">MY ART</h1>
      </div>
      <article className="project-article non-hover w-full h-full flex flex-col items-center justify-center">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-xl text-white">Loading projects...</p>
            </div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-white">No projects available yet.</p>
          </div>
        ) : (
          <section className="sectionWrapper w-full h-full flex flex-col items-start justify-start">
            <Swiper
              modules={[Parallax, EffectCoverflow, Autoplay]}
              direction="horizontal"
              loop={false}
              speed={1500}
              slidesPerView={4}
              spaceBetween={60}
              parallax={true}
              centeredSlides={true}
              effect="coverflow"
              coverflowEffect={{
                rotate: 40,
                slideShadows: true,
              }}
              autoplay={{
                delay: 2000,
                pauseOnMouseEnter: true,
              }}
              breakpoints={{
                0: {
                  slidesPerView: 1,
                  spaceBetween: 60,
                },
                600: {
                  slidesPerView: 2,
                  spaceBetween: 60,
                },
                1000: {
                  slidesPerView: 3,
                  spaceBetween: 60,
                },
                1400: {
                  slidesPerView: 4,
                  spaceBetween: 60,
                },
                2300: {
                  slidesPerView: 5,
                  spaceBetween: 60,
                },
                2900: {
                  slidesPerView: 6,
                  spaceBetween: 60,
                },
              }}
              className="w-full h-full py-[50px] px-5 overflow-visible"
            >
              <div className="parallax-bg" data-swiper-parallax="600" data-swiper-parallax-scale="0.85"></div>
              {projects.map((project, index) => (
                <SwiperSlide key={project.id || index} className="swiper-slide">
                  <div className="cardPopout" data-swiper-parallax="30" data-swiper-parallax-scale="0.9" data-swiper-parallax-opacity="0.8" data-swiper-parallax-duration="1000">
                    <img
                      src={project.image_url}
                      alt={project.title}
                      width="800"
                      height="400"
                      data-swiper-parallax="80"
                      data-swiper-parallax-duration="2000"
                      className="w-full h-auto mb-6 rounded-[5px]"
                    />
                    <h2 className="title text-[2.2rem] leading-[110%] my-0 mb-2 font-arsenica font-normal tracking-wider text-white" data-swiper-parallax="80" data-swiper-parallax-duration="1000">
                      {project.title}
                    </h2>
                    <h4 className="subtitle text-[110%] leading-[120%] font-bold my-0 mb-3 text-[#bbb] italic" data-swiper-parallax="80" data-swiper-parallax-duration="1500">
                      {project.subtitle}
                    </h4>
                    <figcaption className="flex flex-col items-start justify-start my-0 mb-5 pl-5 border-l border-white" data-swiper-parallax="80" data-swiper-parallax-duration="1250">
                      <p className="text-[#999] m-0 line-clamp-4">{project.description}</p>
                    </figcaption>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Visit Now"
                      data-swiper-parallax="80"
                      data-swiper-parallax-opacity="0.2"
                      data-swiper-parallax-duration="1750"
                      className="relative flex items-center justify-between py-2.5 px-5 bg-black text-white rounded-[3px] no-underline overflow-hidden z-[1] text-[1.9rem]"
                    >
                      Visit Now
                    </a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </section>
        )}
      </article>
    </section>
  );
};

export default Projects;
