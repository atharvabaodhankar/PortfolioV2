import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowUp } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Footer from './Footer';

gsap.registerPlugin(ScrollTrigger);

const ProjectsArchive = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  
  const filters = ['All', 'Web', 'App', '3D', 'Design'];

  // --- Fetch Data ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { supabase } = await import('../lib/supabaseClient');
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;

        setProjects(data || []);
        setFilteredProjects(data || []);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // --- Filter Logic ---
  useEffect(() => {
    if (activeFilter === 'All') {
      setFilteredProjects(projects);
    } else {
        const lowerFilter = activeFilter.toLowerCase();
        const filtered = projects.filter(p => {
             const typeMatch = p.project_type?.toLowerCase() === lowerFilter;
             const techMatch = Array.isArray(p.technologies) && p.technologies.some(t => t.toLowerCase().includes(lowerFilter));
             return typeMatch || techMatch;
        });
        setFilteredProjects(filtered);
    }

    // Trigger layout animation update on filter change
    if (!loading) {
       ScrollTrigger.refresh();
    }
  }, [activeFilter, projects, loading]);


  // --- Animations ---
  
  // 1. Hero Animation (Runs ONCE after loading)
  useGSAP(() => {
    if (loading) return;

    const tl = gsap.timeline({ delay: 0.2 });
    
    tl.from('.hero-word', {
      y: '100%',
      opacity: 0,
      rotate: 3,
      duration: 1.4,
      stagger: 0.15,
      ease: 'power3.out'
    })
    .from('.hero-subtitle', {
      opacity: 0,
      y: 20,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.8")
    .from('.scroll-indicator', {
      opacity: 0,
      y: -20,
      duration: 1,
      ease: 'power3.out'
    }, "-=0.5");

  }, { scope: containerRef, dependencies: [loading] });

  // 2. Grid Animation (Runs on Load & Filter Change)
  useGSAP(() => {
    if (loading) return;

    // Batch animations for grid items
    const cards = gsap.utils.toArray('.project-card');
    
    if (cards.length > 0) {
        ScrollTrigger.batch(cards, {
          onEnter: (elements) => {
            gsap.from(elements, {
              y: 60,
              opacity: 0,
              duration: 1,
              stagger: 0.15,
              ease: 'power4.out',
              overwrite: true
            });
          },
          start: "top 90%",
          once: true 
        });
    }

    ScrollTrigger.refresh(); // Ensure locations are correct after render

  }, { scope: containerRef, dependencies: [loading, filteredProjects] });


  // --- Interaction Handlers ---
  const handleMouseEnter = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector('.project-img');
    const overlay = card.querySelector('.project-overlay');
    
    gsap.to(img, { scale: 1.05, filter: 'grayscale(0%)', duration: 0.6, ease: 'power2.out' });
    gsap.to(overlay, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.inOut' });
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    const img = card.querySelector('.project-img');
    const overlay = card.querySelector('.project-overlay');
    
    gsap.to(img, { scale: 1, filter: 'grayscale(100%)', duration: 0.6, ease: 'power2.out' });
    gsap.to(overlay, { opacity: 0, y: 15, duration: 0.4, ease: 'power3.inOut' });
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


  if (loading) return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center text-[#1C1917] font-mono">
       <span className="animate-pulse tracking-widest uppercase text-sm">Loading Archive...</span>
    </div>
  );

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAFAF9] text-[#1C1917] selection:bg-[#1C1917] selection:text-white pb-24">
      
      {/* --- 1. Hero Section --- */}
      <section ref={heroRef} className="relative w-full min-h-[70vh] flex flex-col justify-center items-start px-6 md:px-12 lg:px-24 pt-32 pb-12 max-w-[1800px] mx-auto">
         <div className="overflow-hidden mb-2">
            <h1 className="text-[clamp(3.5rem,8vw,9rem)] font-arsenica leading-[0.9] tracking-tight text-[#1C1917]">
               <span className="hero-word inline-block origin-left">Selected</span>
            </h1>
         </div>
         <div className="overflow-hidden">
             <h1 className="text-[clamp(3.5rem,8vw,9rem)] font-arsenica leading-[0.9] tracking-tight text-[#1C1917]/90">
                <span className="hero-word inline-block origin-left italic font-light">Work</span>
             </h1>
         </div>
         
         <div className="hero-subtitle mt-8 md:mt-12 flex flex-col md:flex-row gap-6 md:items-center max-w-2xl">
            <div className="h-[1px] w-12 bg-[#1C1917]/20 hidden md:block"></div>
            <p className="font-mono text-[#78716C] text-sm md:text-base leading-relaxed">
               Crafting digital experiences that merge systems thinking with editorial aesthetics. 
               A curated archive of web, mobile, and 3D experiments.
            </p>
         </div>

         {/* Scroll Indicator - Adjusted positioning */}
         <div className="scroll-indicator absolute bottom-0 right-6 md:right-24 md:bottom-12 animate-bounce duration-[2000ms]">
            <ArrowUp className="rotate-180 text-[#1C1917]/40" size={24} />
         </div>
      </section>


      {/* --- 2. Filter System --- */}
      <div className="sticky top-0 z-40 bg-[#FAFAF9]/90 backdrop-blur-md border-b border-[#E7E5E4] mb-16 md:mb-24">
         <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
             
             {/* Count */}
             <div className="font-mono text-xs tracking-widest text-[#78716C] uppercase">
                [{filteredProjects.length} Projects]
             </div>

             {/* Filters */}
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`relative px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-500 overflow-hidden group ${
                            activeFilter === filter 
                            ? 'text-[#FAFAF9]' 
                            : 'text-[#1C1917] hover:text-[#1C1917]/70'
                        }`}
                    >
                         {/* Active Background Pill */}
                         {activeFilter === filter && (
                             <span className="absolute inset-0 bg-[#1C1917] z-[-1]"></span>
                         )}
                         {/* Hover Background (Subtle) */}
                         {activeFilter !== filter && (
                            <span className="absolute inset-0 bg-[#E7E5E4] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 z-[-1] origin-left rounded-full"></span>
                         )}
                        {filter}
                    </button>
                ))}
             </div>
         </div>
      </div>


      {/* --- 3. Bento Grid --- */}
      <div className="max-w-[1800px] mx-auto px-4 md:px-12 lg:px-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-[400px] md:auto-rows-[500px]">
              
              {filteredProjects.map((project, index) => {
                  // --- Bento Layout Logic ---
                  // Featured projects or specific indices span 2 columns/rows
                  // Pattern: 0 (Span 2x2), 3 (Span 2x1), etc. or randomized based on 'is_featured'
                  
                  const isFeatured = project.is_featured;
                  const isLarge = index === 0 || (index % 7 === 0);
                  const isWide = (index % 7 === 3) || (index % 7 === 4);
                  
                  // Default CSS classes
                  let gridClass = "col-span-1 row-span-1";
                  
                  // Apply Bento rules (Desktop only mostly)
                  if (window.innerWidth >= 1024) {
                      if (isLarge) gridClass = "lg:col-span-2 lg:row-span-2";
                      else if (isWide) gridClass = "lg:col-span-2 lg:row-span-1";
                  }

                  return (
                      <article 
                        key={project.id}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={`project-card group relative bg-[#F5F5F4] rounded-sm overflow-hidden cursor-pointer ${gridClass}`}
                      >
                          {/* Image Container */}
                          <div className="w-full h-full overflow-hidden">
                              <img 
                                src={project.image_url} 
                                alt={project.title}
                                className="project-img w-full h-full object-cover filter grayscale scale-100 transition-transform duration-700 ease-out"
                              />
                          </div>
                      
                          {/* Content Overlay */}
                          <div className="project-overlay absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 translate-y-4 flex flex-col justify-end p-8 md:p-12 transition-all duration-500">
                                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex gap-2">
                                            {project.technologies?.slice(0,3).map((t, i) => (
                                                <span key={i} className="text-[10px] font-mono uppercase tracking-wider text-white/80 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-sm border border-white/10">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                        <a href={project.link} target="_blank" rel="noreferrer" className="bg-white/90 p-3 rounded-full text-black hover:scale-110 transition-transform">
                                            <ArrowUpRight size={16} />
                                        </a>
                                    </div>
                                    <h3 className="text-3xl md:text-5xl font-arsenica text-[#FAFAF9] mb-2 leading-none">
                                        {project.title}
                                    </h3>
                                    <p className="text-[#FAFAF9]/70 font-mono text-sm line-clamp-2 max-w-lg">
                                        {project.subtitle || project.description}
                                    </p>
                                </div>
                          </div>
                          
                          {/* Idle Title (Visible when not hovered, optional) - Keeping it clean per request ("Overlay... reveal") */}
                          {/* If we want a always-visible title, we can add it here. But the "Reveal" request suggests clean idle state. */}
                          
                      </article>
                  );
              })}
          </div>

          {filteredProjects.length === 0 && (
              <div className="py-32 text-center border-t border-[#E7E5E4] mt-12">
                   <h3 className="text-2xl font-arsenica text-[#1C1917]/40 mb-4">Empty Archive</h3>
                   <p className="font-mono text-[#78716C]">No projects found in this category.</p>
                   <button onClick={() => setActiveFilter('All')} className="mt-8 px-6 py-2 border border-[#1C1917] rounded-full text-xs uppercase tracking-widest hover:bg-[#1C1917] hover:text-white transition-colors">
                       Clear Filter
                   </button>
              </div>
          )}
      </div>


      {/* --- Footer / Navigation --- */}
      <div className="mt-32 border-t border-[#E7E5E4]">
          <Footer />
      </div>

      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-12 right-12 p-5 bg-[#1C1917] text-[#FAFAF9] rounded-full shadow-2xl z-50 hover:scale-110 transition-transform duration-300 hidden md:flex items-center justify-center group"
      >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>

    </main>
  );
};

export default ProjectsArchive;
