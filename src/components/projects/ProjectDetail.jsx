import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import ZKredential from './ZKredential';
import ProjectPlaceholder from './ProjectPlaceholders';
import SEO from '../SEO';
import TransitionLink from '../TransitionLink';
import { ArrowLeft, ExternalLink, Github, Cpu, ShieldCheck, Info } from 'lucide-react';
import gsap from 'gsap';

export default function ProjectDetail() {
  const { slug } = useParams();
  const lowerSlug = slug?.toLowerCase();

  // Route static pages immediately
  if (lowerSlug === 'zkredential') {
    return <ZKredential />;
  }
  
  const staticSlugs = ['erc4337-kit', 'chainvidya', 'zeroleak', 'roadsense', 'plugmail'];
  if (staticSlugs.includes(lowerSlug)) {
    return <ProjectPlaceholder />;
  }

  // Dynamic DB Projects logic
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setError(false);
    setProject(null);

    const fetchProject = async () => {
      try {
        const { supabase } = await import('../../lib/supabaseClient');
        const { data, error: dbError } = await supabase
          .from('projects')
          .select('*');

        if (dbError) throw dbError;

        // Find matches by generating slugs on the fly
        const getSlug = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const match = (data || []).find(p => getSlug(p.title) === lowerSlug);

        if (match) {
          setProject(match);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching project:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [lowerSlug]);

  useEffect(() => {
    if (!loading && project) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.anim-fade',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15 }
      );
    }
  }, [loading, project]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-white font-mono">
        <span className="animate-pulse tracking-widest uppercase text-sm">Loading Project...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] text-white flex flex-col items-center justify-center font-mono p-6">
        <h2 className="text-2xl mb-4">Project Not Found</h2>
        <p className="text-zinc-500 mb-8">The requested project details page could not be located.</p>
        <TransitionLink to="/projects" className="px-6 py-3 bg-white text-black rounded-full font-sans text-sm">
          Return to Archive
        </TransitionLink>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#E4E4E7]/10 selection:text-white"
    >
      <SEO
        title={`${project.title} | Atharva Baodhankar`}
        description={project.subtitle || project.description || `Case study for ${project.title}. Built by Atharva Baodhankar.`}
        url={`https://atharvabaodhankar.me/projects/${lowerSlug}`}
        image={project.image_url}
        type="article"
      />

      {/* Ambient glowing blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-full blur-[120px] -top-80 -left-60" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#8B5CF6]/5 to-transparent rounded-full blur-[100px] bottom-1/4 -right-40" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-24">
        
        {/* Navigation back */}
        <div className="anim-fade mb-16">
          <TransitionLink 
            to="/projects"
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 text-sm font-mono tracking-wider transition-all duration-300 group text-[#A1A1AA] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Archive
          </TransitionLink>
        </div>

        {/* Header Block */}
        <header className="anim-fade space-y-8 max-w-4xl">
          <div>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-xs font-mono text-[#818CF8]">
              <Cpu className="w-3.5 h-3.5" />
              {project.category || 'Portfolio Case Study'}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-arsenica leading-[1.05] text-white">
            {project.title}
          </h1>

          {project.subtitle && (
            <p className="text-xl md:text-2xl text-[#A1A1AA] font-mono font-light italic leading-relaxed border-l-2 border-white/10 pl-6">
              {project.subtitle}
            </p>
          )}
        </header>

        {/* Details Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20">
          
          {/* Main writeup */}
          <section className="anim-fade lg:col-span-7 space-y-12">
            
            {/* Project Image */}
            {project.image_url && (
              <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
                <img 
                  src={project.image_url} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#818CF8] flex items-center gap-2">
                <Info className="w-4 h-4" />
                Description
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-[#A1A1AA] space-y-6 font-sans leading-relaxed">
                {(project.description || '').split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

          </section>

          {/* Sidebar */}
          <aside className="anim-fade lg:col-span-5 space-y-12">
            
            {/* Project Details Panel */}
            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-8">
              <h3 className="text-sm font-mono tracking-widest text-white uppercase pb-4 border-b border-white/5">
                Specifications
              </h3>

              <div className="space-y-6">
                {project.technologies && project.technologies.length > 0 && (
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">Technologies</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <span key={tech} className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs font-mono text-[#D4D4D8]">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Status</h4>
                    <p className="text-sm font-medium text-white">Active Production</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Developer</h4>
                    <p className="text-sm font-medium text-white">Atharva Baodhankar</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full px-6 py-4 bg-white text-black hover:bg-[#E4E4E7] transition-all duration-300 rounded-full font-medium group text-sm"
                  >
                    <span>Visit Live URL</span>
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>

          </aside>

        </main>
        
      </div>
    </div>
  );
}
