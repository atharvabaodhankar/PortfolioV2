import React, { useEffect, useLayoutEffect, useRef } from 'react';
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

  const projects = [
    {
      img: '/src/assets/sites/shoetopia.png',
      title: 'Shoetopia',
      subtitle: 'The revamped version of the classic',
      description: 'Shoetopia is my project to help underfunded startups build legendary brands. We\'re a venture firm and digital agency offering both traditional payment and a venture partnership model where we invest and share in the success. This lets us help startups with great ideas overcome funding challenges.',
      link: 'https://atharvabaodhankar.github.io/shoetopia/'
    },
    {
      img: '/src/assets/sites/wellhall.png',
      title: 'Wellhall',
      subtitle: 'The best place to be',
      description: 'Welcome to your luxurious home away from home. Wellhall hotel is a luxurious hotel that offers a unique experience. We offer a range of services from luxurious rooms to a range of restaurants and a spa. We also offer a range of events and activities to keep you entertained.',
      link: 'https://atharvabaodhankar.github.io/Wellhall/'
    },
    {
      img: '/src/assets/sites/BusinessEvent.png',
      title: 'Business Event',
      subtitle: 'The Event Organizers',
      description: 'Business Event is a platform that helps you find the best event organizers for your business. We offer a range of services from event planning to event management. We also offer a range of events and activities to keep you entertained.',
      link: 'https://atharvabaodhankar.github.io/BusinessEvent/'
    },
    {
      img: '/src/assets/sites/rejouice.png',
      title: 'Rejouice',
      subtitle: 'The ultimate remake of the classic',
      description: 'Want to build a legendary brand but unsure about funding? We\'ve got you covered. We\'re a venture firm and digital agency duo, transforming visions into reality. Choose traditional pay or share in the success with our Venture Model - you decide! Let\'s make your brand dream a reality.',
      link: 'https://atharvabaodhankar.github.io/rejouice'
    },
    {
      img: '/src/assets/sites/polystudi.png',
      title: 'Polystudi',
      subtitle: 'Students Hub',
      description: 'Polystudi is more than just a website, it\'s a movement. We\'re passionate about empowering polytechnic students to achieve their academic dreams. So, what are you waiting for? Join the Polystudi fam, crank up your learning curve, and watch your potential explode!',
      link: 'https://polystudi.com'
    },
    {
      img: '/src/assets/sites/cars.png',
      title: 'Cars',
      subtitle: 'Luxury of car',
      description: 'Finding the Perfect Car Insurance Fit. Price is a big factor, but it\'s not the only one! We explore what matters when choosing car insurance. From comparing quotes to evaluating customer service, we\'ll help you find the company that protects your car and your peace of mind.',
      link: 'https://atharvabaodhankar.github.io/cars/'
    },
    {
      img: '/src/assets/sites/fips.png',
      title: 'Fips',
      subtitle: 'Comfort of life',
      description: 'We craft furniture for lives well-lived. Comfort isn\'t a luxury, it\'s a necessity. That\'s why quality is our obsession. Handcrafted with meticulous detail, our furniture becomes an extension of your home, offering lasting comfort and timeless style.',
      link: 'https://atharvabaodhankar.github.io/fips/'
    },
    {
      img: '/src/assets/sites/TrainingStudio.png',
      title: 'Training Studio',
      subtitle: 'Fit and Strong',
      description: 'Unleash your potential. Our gym makes it simple to achieve your fitness goals. We offer a supportive environment with everything you need to WORK HARDER and GET STRONGER - all conveniently at your fingertips.',
      link: 'https://atharvabaodhankar.github.io/trainingstudio/'
    },
    {
      img: '/src/assets/sites/glassm5.png',
      title: 'Glass M5',
      subtitle: 'Transparency of glass',
      description: 'Welcome to a world of transparency in corporate governance. glassM5 leverages the power of glassmorphism design to create a clear and open environment. Our team of experts is dedicated to empowering businesses with the tools and knowledge they need to build strong governance practices.',
      link: 'https://atharvabaodhankar.github.io/GlassM5-/'
    },
    {
      img: '/src/assets/sites/cofffee.png',
      title: 'Coffee',
      subtitle: 'Focus on Ambiance',
      description: 'Cafe & Restaurant Est.2023: Your haven for delicious eats & coffee. Savor hand-crafted dishes and barista-brewed beverages in our warm and inviting atmosphere.From mouthwatering brunch options to perfectly roasted coffee, we fuel your day with flavor.',
      link: 'https://atharvabaodhankar.github.io/cofffee/'
    },
    {
      img: '/src/assets/sites/elvo.png',
      title: 'Elvo',
      subtitle: 'Built for you',
      description: 'Elvo Construction: Built by me, built for you. This website is more than just code and design - it\'s a testament to the dedication and expertise that goes into every Elvo project. Since 1998, I\'ve poured my passion for construction into building dreams, and now I\'m making it easier than ever for you to be a part of that process.',
      link: 'https://atharvabaodhankar.github.io/elvo/'
    },
    {
      img: '/src/assets/sites/dotcom.png',
      title: 'DotCom',
      subtitle: 'Ignite your brand',
      description: 'Ignite your brand with Creative Agency. Our passionate team transforms brands with creative muscle - crafting captivating stories and designing cutting-edge digital experiences. We offer a full suite of services, from user-friendly websites to strategic marketing campaigns.',
      link: 'https://atharvabaodhankar.github.io/dotcom/'
    },
    {
      img: '/src/assets/sites/lendo.png',
      title: 'Lendo',
      subtitle: 'Focus on what matters',
      description: 'We\'re a leading provider of top-tier technology and exceptional service, empowering companies to reach their full potential. Our comprehensive solutions encompass cutting-edge technology to streamline operations and a dedicated team committed to exceeding your expectations.',
      link: 'https://atharvabaodhankar.github.io/lendo/'
    },
  ];

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
                      src={project.image_url || project.img}
                      alt={project.title}
                      width="800"
                      height="400"
                      data-swiper-parallax="80"
                      data-swiper-parallax-duration="2000"
                      className="w-full h-auto mb-6 rounded-[5px]"
                    />
                    <h2 className="title text-[2.2rem] leading-[110%] my-0 mb-2 font-fontstyle font-normal tracking-wider text-white" data-swiper-parallax="80" data-swiper-parallax-duration="1000">
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
