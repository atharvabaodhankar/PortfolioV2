import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpRight, ArrowUp, Grid, List } from 'lucide-react';
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
  const [isGridView, setIsGridView] = useState(true);
  const containerRef = useRef(null);
  
  // Custom tech stack icons or text would go here
  const filters = ['All', 'Web', 'App', '3D', 'Design'];

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

  // Filter Logic
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
  }, [activeFilter, projects]);

  // Entrance Animation
  useGSAP(() => {
    if (loading) return;
    
    gsap.from('.archive-title span', {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out'
    });

    // Animate grid items when they mount or when filter changes (re-trigger)
    // Actually, simple staggering on mount is safer for now.
    gsap.from('.project-card-anim', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.projects-grid',
            start: 'top 80%',
        }
    });

  }, [loading]); 

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) return <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center text-[#1C1917] font-mono">Loading Archive...</div>;

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAFAF9] text-[#1C1917] selection:bg-[#1C1917] selection:text-white pb-24">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[50vh] flex flex-col items-center justify-center px-6">
        <div className="text-center max-w-4xl mx-auto">
           <span className="block text-xs font-mono tracking-[0.2em] text-[#78716C] mb-6 uppercase">
             Portfolio
           </span>
           <h1 className="archive-title text-[clamp(3rem,6vw,6rem)] font-arsenica leading-none mb-6">
             <span className="inline-block">All</span> <span className="inline-block italic text-[#78716C]">Projects</span>
           </h1>
           <p className="font-mono text-[#78716C] text-sm md:text-base max-w-lg mx-auto leading-relaxed">
             A curated collection of experiments, case studies, and digital products spanning web, mobile, and 3D design.
           </p>
        </div>
      </section>

      {/* 2. Sticky Filter Bar */}
      <div className="sticky top-0 z-40 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#E7E5E4] mb-12">
         <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
             
             {/* Count (Hidden on small mobile) */}
             <div className="hidden md:block font-mono text-xs text-[#78716C]">
                ({filteredProjects.length}) Projects
             </div>

             {/* Filters */}
             <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                {filters.map(filter => (
                    <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                            activeFilter === filter 
                            ? 'bg-[#1C1917] text-white shadow-md' 
                            : 'bg-[#F5F5F4] text-[#1C1917] hover:bg-[#E7E5E4]'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
             </div>

             {/* View Toggle */}
             <div className="hidden md:flex items-center gap-2">
                 <button onClick={() => setIsGridView(true)} className={`p-2 rounded-lg transition-colors ${isGridView ? 'bg-[#E7E5E4]' : 'hover:bg-[#F5F5F4]'}`}>
                    <Grid size={18} />
                 </button>
                 <button onClick={() => setIsGridView(false)} className={`p-2 rounded-lg transition-colors ${!isGridView ? 'bg-[#E7E5E4]' : 'hover:bg-[#F5F5F4]'}`}>
                    <List size={18} />
                 </button>
             </div>
         </div>
      </div>

      {/* 3. Projects Grid (Bento) */}
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
          <div className={`projects-grid ${isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10' : 'flex flex-col gap-8'}`}>
              
              {filteredProjects.map((project, index) => {
                  // Determine span classes based on index (Bento Logic)
                  // Pattern: 0 (Large), 1, 2, 3 (Wide), 4, 5
                  const isLarge = index % 6 === 0;
                  const isWide = index % 6 === 3;
                  
                  let gridClass = "col-span-1 row-span-1";
                  if (isGridView) {
                      if (isLarge) gridClass = "lg:col-span-2 lg:row-span-2";
                      else if (isWide) gridClass = "lg:col-span-2 lg:row-span-1";
                  }

                  return (
                      <article 
                        key={project.id}
                        className={`project-card-anim group relative bg-white rounded-2xl overflow-hidden border border-[#E7E5E4] shadow-sm hover:shadow-xl transition-all duration-500 ${gridClass} ${isGridView ? 'aspect-[4/3] lg:aspect-auto' : 'h-[300px] flex'}`}
                      >
                          {/* Image */}
                          <div className={`relative overflow-hidden ${isGridView ? 'w-full h-full' : 'w-2/5 h-full'}`}>
                              <img 
                                src={project.image_url} 
                                alt={project.title}
                                className="w-full h-full object-cover filter grayscale md:grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          </div>

                          {/* Content Overlay (Grid Mode: Hover | List Mode: Side) */}
                          {/* We adjust this to ensure it's visible on mobile (no hover required) or keep hover.
                              The user spec said "Hover card: ... Content overlay slides up".
                              I will keep hover logic but ensure it's functional.
                          */}
                          <div 
                             className={
                                 isGridView 
                                 ? "absolute bottom-0 left-0 right-0 p-6 md:p-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-white/90 backdrop-blur-md border-t border-black/5"
                                 : "w-3/5 p-8 flex flex-col justify-center bg-white"
                             }
                          >
                              <div className="flex items-center justify-between mb-3">
                                  <span className="font-mono text-xs text-[#78716C] uppercase tracking-wider">
                                      0{index + 1}
                                  </span>
                                  {project.is_featured && (
                                      <span className="px-2 py-1 bg-[#1C1917] text-white text-[10px] uppercase font-bold tracking-widest rounded-full">
                                          Featured
                                      </span>
                                  )}
                              </div>
                              
                              <h3 className="text-2xl md:text-3xl font-arsenica text-[#1C1917] mb-2">
                                  {project.title}
                              </h3>
                              
                              <p className="font-mono text-sm text-[#78716C] line-clamp-2 mb-6">
                                  {project.subtitle || project.description}
                              </p>

                              <div className="flex items-center justify-between">
                                  <div className="flex flex-wrap gap-2">
                                    {project.technologies && project.technologies.slice(0, 3).map(tech => (
                                        <span key={tech} className="text-xs px-2 py-1 bg-[#F5F5F4] text-[#78716C] rounded-md border border-[#E7E5E4]">
                                            {tech}
                                        </span>
                                    ))}
                                  </div>
                                  
                                  <a 
                                    href={project.link || '#'} 
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-3 bg-[#1C1917] text-white rounded-full hover:bg-black transition-transform hover:scale-110"
                                  >
                                      <ArrowUpRight size={16} />
                                  </a>
                              </div>
                          </div>
                      </article>
                  );
              })}
          </div>
          
          {filteredProjects.length === 0 && (
              <div className="py-24 text-center">
                  <p className="font-mono text-[#78716C]">No projects found in this category.</p>
                  <button onClick={() => setActiveFilter('All')} className="mt-4 text-[#1C1917] underline hover:text-black">Clear filters</button>
              </div>
          )}
      </div>

      {/* Back to Top */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-12 right-12 p-4 bg-[#1C1917] text-white rounded-full shadow-2xl hover:bg-black hover:scale-110 transition-all duration-300 z-50 group hidden md:block"
      >
          <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
      </button>

      <Footer />
    </main>
  );
};

export default ProjectsArchive;
