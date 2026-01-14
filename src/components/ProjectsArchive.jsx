import React, { useEffect, useState } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar'; // Reuse Navbar if desired, or simpler one
import Footer from './Footer';

const ProjectsArchive = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    window.scrollTo(0, 0);
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
      console.error('Error fetching all projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-[#EDECE7] font-sans selection:bg-white selection:text-black">
      {/* Navigation Bar (Simplified) */}
      <nav className="fixed top-0 left-0 w-full p-8 z-50 flex justify-between items-center mix-blend-difference">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 group cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span className="font-mono text-sm uppercase tracking-wide">Back to Home</span>
        </button>
        <div className="font-arsenica text-xl">Archive</div>
      </nav>

      <main className="pt-32 px-4 md:px-12 pb-24 max-w-[1600px] mx-auto">
        <header className="mb-24">
          <h1 className="text-[clamp(3rem,8vw,8rem)] font-arsenica leading-[0.9] mb-6">
            Everything<br/>I've Built
          </h1>
          <p className="font-mono text-white/50 max-w-xl text-sm md:text-base">
            A comprehensive list of experiments, client work, and personal tools.
            Sorted by relevance.
          </p>
        </header>

        {loading ? (
           <div className="w-full text-center py-20 font-mono animate-pulse">Loading Archive...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-24">
            {projects.map((project, index) => (
              <article key={project.id} className="group flex flex-col gap-6">
                
                {/* Image */}
                <div className="w-full aspect-[4/3] overflow-hidden rounded-sm bg-white/5 relative">
                   <img 
                      src={project.image_url} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                   />
                </div>

                {/* Content */}
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-baseline border-b border-white/10 pb-4">
                     <h2 className="text-3xl font-arsenica group-hover:text-white transition-colors text-white/90">{project.title}</h2>
                     <span className="font-mono text-xs opacity-40">0{index+1}</span>
                  </div>
                  
                  <p className="text-white/60 text-sm leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-auto">
                    {project.technologies && Array.isArray(project.technologies) && project.technologies.slice(0, 5).map(tech => (
                       <span key={tech} className="text-[10px] font-mono border border-white/10 px-2 py-1 rounded-sm text-white/50 bg-white/5">{tech}</span>
                    ))}
                  </div>

                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-mono mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -translate-x-2 group-hover:translate-x-0"
                  >
                    Visit Site <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProjectsArchive;
