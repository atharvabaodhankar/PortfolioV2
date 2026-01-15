import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const containerRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Logic
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { supabase } = await import('../lib/supabaseClient');
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_featured', true)
          .order('display_order', { ascending: true })
          .limit(4);

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Error fetching featured projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  // Animation Logic
  useGSAP(() => {
    if (loading) return;
    if (projects.length === 0) {
        console.warn("Projects: No projects loaded to animate.");
        return;
    }

    console.log("Projects: UseGSAP starting. Loaded projects:", projects.length);

    // 1. Intro Animation
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        once: true,
      }
    });
    
    introTl.from('.gallery-title span', {
      y: 100,
      opacity: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'power4.out'
    });

    // 2. Main Scroll Exhibition
    const sections = gsap.utils.toArray('.gallery-item');
    const totalSections = sections.length;
    
    if (totalSections === 0) {
        console.error("Projects: No .gallery-item elements found!");
        return;
    }

    // Explicitly set initial states to avoid Z-fighting or FOUC
    // First item: Visible
    gsap.set(sections[0], { autoAlpha: 1, yPercent: 0 });
    // Subsequent items: Hidden and moved down
    if (totalSections > 1) {
        gsap.set(sections.slice(1), { autoAlpha: 0, yPercent: 100 });
    }
    
    // Archive: Hidden
    gsap.set('.gallery-archive', { autoAlpha: 0, scale: 1.1 });

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.gallery-pin-container',
        pin: true,
        start: 'top top',
        end: `+=${totalSections * 100}%`, 
        scrub: 0.5,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      }
    });

    sections.forEach((section, i) => {
      if (i === totalSections - 1) return; 

      const nextSection = sections[i + 1];
      const position = i === 0 ? '+=0.2' : '+=0';

      scrollTl.to(section, {
        autoAlpha: 0, // handles opacity + visibility
        scale: 0.95,
        filter: 'blur(5px)',
        duration: 1,
        ease: 'none'
      }, position)
      .to(nextSection, 
        { yPercent: 0, autoAlpha: 1, duration: 1, ease: 'none' }, 
        "<" 
      );
    });

    // 3. Final Transition to "Archive" CTA
    scrollTl.to(sections[totalSections - 1], {
      autoAlpha: 0,
      scale: 0.9,
      filter: 'blur(10px)',
      duration: 1,
      ease: 'none'
    })
    .to('.gallery-archive', 
      { autoAlpha: 1, scale: 1, duration: 1, ease: 'none' },
      "<"
    );

  }, { scope: containerRef, dependencies: [loading, projects] });


  if (loading) return null;

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative w-full bg-[#EDECE7] text-[#1a1a1a] selection:bg-black/10"
    >
      {/* Subtle Noise Overlay (Light Mode) */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-multiply"></div>
      </div>

      {/* Intro Title */}
      <div className="relative z-10 w-full h-[60vh] flex flex-col items-center justify-center pointer-events-none">
        <h2 className="gallery-title text-[clamp(3rem,8vw,8rem)] font-arsenica leading-[0.9] text-center text-[#1a1a1a] mix-blend-darken">
          <span className="inline-block">Selected</span> <br/>
          <span className="inline-block italic font-light opacity-60">Works</span>
        </h2>
        <div className="absolute bottom-12 w-[1px] h-24 bg-gradient-to-b from-[#1a1a1a] to-transparent opacity-20"></div>
      </div>

      {/* Pinned Exhibition Container */}
      <div className="gallery-pin-container relative w-full h-screen z-10 overflow-hidden bg-[#EDECE7]">
        
        {/* Projects Stack */}
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`gallery-item absolute inset-0 w-full h-full flex items-center justify-center p-4 md:p-12 ${index === 0 ? 'z-10' : 'z-0'}`}
            style={{ zIndex: 10 + index }} // Correct stacking
          >
            {/* Split Layout */}
            <div className={`w-full max-w-[1600px] h-full flex flex-col md:flex-row ${index % 2 === 1 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-20 items-center`}>
               
               {/* 1. Image Side (Glass Container) */}
               <div className="w-full md:w-[60%] h-[40vh] md:h-[80vh] relative group rounded-2xl overflow-hidden shadow-2xl shadow-black/5">
                  <div className="absolute inset-0 bg-black/5 mix-blend-multiply group-hover:bg-transparent transition-all duration-700"></div>
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                  />
               </div>

               {/* 2. Content Side */}
               <div className="w-full md:w-[40%] flex flex-col items-start text-left">
                  <span className="font-mono text-[#1a1a1a]/40 mb-6 tracking-widest text-sm uppercase">
                    0{index + 1} — Exhibition
                  </span>
                  
                  <h3 className="text-[clamp(2.5rem,4vw,4.5rem)] font-arsenica leading-[1.1] mb-4 text-[#1a1a1a]">
                    {project.title}
                  </h3>
                  
                  <p className="font-mono text-[#1a1a1a]/60 mb-8 italic text-lg border-l-2 border-[#1a1a1a]/10 pl-6">
                    {project.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-12">
                     {project.technologies && Array.isArray(project.technologies) && project.technologies.slice(0, 4).map(tech => (
                       <span key={tech} className="px-4 py-2 rounded-full border border-[#1a1a1a]/10 bg-white/40 backdrop-blur-sm text-xs font-mono text-[#1a1a1a]/60 hover:bg-[#1a1a1a] hover:text-white transition-colors">
                         {tech}
                       </span>
                     ))}
                  </div>

                  <a 
                    href={project.link} 
                    target="_blank"
                    className="group relative inline-flex items-center gap-4 px-8 py-4 bg-[#1a1a1a] text-white hover:bg-black transition-colors duration-500 rounded-full font-medium shadow-lg shadow-black/10 hover:shadow-xl"
                  >
                    View Project
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
               </div>

            </div>
          </div>
        ))}

        {/* Archive Call to Action (Light Mode) */}
        <div className="gallery-archive absolute inset-0 w-full h-full z-[50] flex flex-col items-center justify-center bg-transparent backdrop-blur-sm pointer-events-none opacity-0">
           <div className="relative p-12 md:p-24 border border-[#1a1a1a]/10 bg-white/80 rounded-3xl flex flex-col items-center text-center max-w-2xl pointer-events-auto shadow-2xl shadow-black/5">
              <h2 className="text-5xl md:text-7xl font-arsenica mb-6 text-[#1a1a1a]">
                The Archive
              </h2>
              <p className="font-mono text-[#1a1a1a]/50 mb-12 max-w-md">
                There is more to explore. Deep dive into the full collection of experiments and case studies.
              </p>
              <button 
                onClick={() => navigate('/projects')}
                className="px-10 py-5 bg-[#1a1a1a] hover:bg-black text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center gap-3"
              >
                Explore All Projects
                <ExternalLink className="w-4 h-4" />
              </button>
           </div>
        </div>

      </div>

    </section>
  );
};

export default Projects;
