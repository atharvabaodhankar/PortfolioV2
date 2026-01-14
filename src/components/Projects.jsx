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
    if (loading || projects.length === 0) return;

    // 1. Intro Animation
    const introTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        toggleActions: 'play none none reverse'
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
    
    // The container pins for the duration of all slides
    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: '.gallery-pin-container',
        pin: true,
        start: 'top top',
        end: `+=${totalSections * 100}%`, // Scroll distance proportional to items
        scrub: 1,
        snap: 1 / totalSections,
      }
    });

    sections.forEach((section, i) => {
      // Logic: 
      // Current item (i) is visible initially (or slides in).
      // As we scroll, current item zooms out/fades, next item slides in.
      
      if (i === totalSections - 1) return; // Last item doesn't animate out to another item here

      const nextSection = sections[i + 1];

      scrollTl.to(section, {
        opacity: 0,
        scale: 1.1, // Zoom affect before disappearing
        filter: 'blur(10px)',
        duration: 1,
        ease: 'none'
      })
      .fromTo(nextSection, 
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1, ease: 'none' }, 
        "<" // Start at the same time
      );
    });

    // 3. Final Transition to "Archive" CTA
    // This happens after the last project is fully visible
    scrollTl.to(sections[totalSections - 1], {
      opacity: 0,
      scale: 0.9,
      filter: 'blur(20px)',
      duration: 1,
      ease: 'none'
    })
    .fromTo('.gallery-archive', 
      { opacity: 0, scale: 1.2 },
      { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' },
      "<"
    );

  }, { scope: containerRef, dependencies: [loading, projects] });


  if (loading) return null;

  return (
    <section 
      ref={containerRef} 
      id="projects" 
      className="relative w-full bg-[#0a0a0a] text-white selection:bg-indigo-500/30"
    >
      {/* Dynamic Background Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#1e1b4b] to-[#000000]" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      {/* Intro Title (Scrolls away normally) */}
      <div className="relative z-10 w-full h-[60vh] flex flex-col items-center justify-center pointer-events-none">
        <h2 className="gallery-title text-[clamp(3rem,8vw,8rem)] font-arsenica leading-[0.9] text-center mix-blend-overlay">
          <span className="inline-block">Selected</span> <br/>
          <span className="inline-block italic font-light">Works</span>
        </h2>
        <div className="absolute bottom-12 w-[1px] h-24 bg-gradient-to-b from-white to-transparent opacity-50"></div>
      </div>

      {/* Pinned Exhibition Container */}
      <div className="gallery-pin-container relative w-full h-screen z-10 overflow-hidden">
        
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
               <div className="w-full md:w-[60%] h-[40vh] md:h-[80vh] relative group rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-indigo-900/20">
                  <div className="absolute inset-0 bg-indigo-900/20 mix-blend-color group-hover:bg-transparent transition-all duration-700"></div>
                  <img 
                    src={project.image_url} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
                  />
                  {/* Subtle noise overlay on image */}
                  <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
               </div>

               {/* 2. Content Side */}
               <div className="w-full md:w-[40%] flex flex-col items-start text-left">
                  <span className="font-mono text-indigo-300/80 mb-6 tracking-widest text-sm">
                    0{index + 1} — EXHIBITION
                  </span>
                  
                  <h3 className="text-[clamp(2.5rem,4vw,4.5rem)] font-arsenica leading-[1.1] mb-4">
                    {project.title}
                  </h3>
                  
                  <p className="font-mono text-white/60 mb-8 italic text-lg border-l-2 border-indigo-500/50 pl-6">
                    {project.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-12">
                     {project.technologies && Array.isArray(project.technologies) && project.technologies.slice(0, 4).map(tech => (
                       <span key={tech} className="px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-mono text-indigo-100/70 hover:bg-white/10 transition-colors">
                         {tech}
                       </span>
                     ))}
                  </div>

                  <a 
                    href={project.link} 
                    target="_blank"
                    className="group relative inline-flex items-center gap-4 px-8 py-4 bg-white text-black hover:bg-indigo-300 transition-colors duration-500 rounded-full font-medium"
                  >
                    View Project
                    <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
               </div>

            </div>
          </div>
        ))}

        {/* Archive Call to Action (The "End" Card) */}
        <div className="gallery-archive absolute inset-0 w-full h-full z-[50] flex flex-col items-center justify-center bg-transparent backdrop-blur-xl pointer-events-none opacity-0">
           <div className="relative p-12 md:p-24 border border-white/10 bg-black/60 rounded-3xl flex flex-col items-center text-center max-w-2xl pointer-events-auto shadow-2xl shadow-indigo-500/10">
              <h2 className="text-5xl md:text-7xl font-arsenica mb-6 bg-gradient-to-br from-white to-indigo-400 bg-clip-text text-transparent">
                The Archive
              </h2>
              <p className="font-mono text-white/50 mb-12 max-w-md">
                There is more to explore. Deep dive into the full collection of experiments and case studies.
              </p>
              <button 
                onClick={() => navigate('/projects')}
                className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/25 flex items-center gap-3"
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
