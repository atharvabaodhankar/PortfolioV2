import React, { useEffect, useRef } from 'react';
import SEO from '../SEO';
import TransitionLink from '../TransitionLink';
import { ArrowLeft, ExternalLink, Github, ShieldCheck, Cpu, Code2, Award, Info } from 'lucide-react';
import gsap from 'gsap';

export default function ZKredential() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Fade-in animations
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.fromTo('.anim-fade',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 1, stagger: 0.15 }
    );
  }, []);

  const circomCircuitCode = `pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/poseidon.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template VerifyCredential() {
    // Public Inputs
    signal input institutionPubKeyHash;
    signal input expectedDegreeHash;

    // Private Inputs
    signal input studentId;
    signal input credentialSecret;
    signal input degreeHash;
    signal input signatureR[2];
    signal input signatureS;

    // Output Verification
    signal output isValid;

    // 1. Verify degree type matches expected degree
    component degreeCheck = IsEqual();
    degreeCheck.in[0] <== degreeHash;
    degreeCheck.in[1] <== expectedDegreeHash;
    degreeCheck.out === 1;

    // 2. Compute credential commitment hash
    component hasher = Poseidon(3);
    hasher.inputs[0] <== studentId;
    hasher.inputs[1] <== degreeHash;
    hasher.inputs[2] <== credentialSecret;

    // 3. Output valid status
    isValid <== degreeCheck.out;
}`;

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#E4E4E7]/10 selection:text-white"
    >
      <SEO
        title="ZKredential — Decentralized Academic Credentials | Atharva Baodhankar"
        description="ZKredential is a ZK proof-based academic credential system using Circom, Groth16, and ERC-5192 soulbound NFTs on Polygon Amoy. Built by Atharva Baodhankar. Top-15 at Velora 1.0 hackathon."
        url="https://atharvabaodhankar.me/projects/zkredential"
        type="article"
      />

      {/* Ambient glowing blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-30">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-full blur-[120px] -top-80 -left-60" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#8B5CF6]/10 to-transparent rounded-full blur-[100px] bottom-1/4 -right-40" />
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
          <div className="flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/20 text-xs font-mono text-[#818CF8]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Web3 & Zero-Knowledge
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-mono text-amber-400">
              <Award className="w-3.5 h-3.5" />
              Top-15 @ Velora 1.0 Hackathon
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-arsenica leading-[1.05] text-white">
            ZKredential
          </h1>

          <p className="text-xl md:text-2xl text-[#A1A1AA] font-mono font-light italic leading-relaxed border-l-2 border-white/10 pl-6">
            Decentralized Academic Credentials with Zero-Knowledge Proofs
          </p>
        </header>

        {/* Details Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20">
          
          {/* Main writeup - 7 cols */}
          <section className="anim-fade lg:col-span-7 space-y-12">
            
            {/* Overview */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#818CF8] flex items-center gap-2">
                <Info className="w-4 h-4" />
                Context & Objectives
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-[#A1A1AA] space-y-4 font-sans leading-relaxed">
                <p>
                  Academic credentials are a cornerstone of career advancement. However, traditional paper or PDF-based degrees are easily forged, and verifying them requires manually contacting universities or third-party institutions—a process that takes weeks and is prone to human error.
                </p>
                <p>
                  Furthermore, when students share their academic transcripts with recruiters, they are forced to expose sensitive personal data (e.g., date of birth, identity card numbers, detailed grades) when they only need to verify a basic claim, such as degree completion or GPA threshold.
                </p>
                <p>
                  <strong>ZKredential</strong> was engineered to solve this privacy-accuracy trade-off. It combines zero-knowledge proof technology with non-transferable <strong>Soulbound NFTs (ERC-5192)</strong> to deliver a tamper-proof system where individuals can instantly verify credentials to third parties while maintaining absolute data sovereignty.
                </p>
              </div>
            </div>

            {/* Architecture */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#818CF8] flex items-center gap-2">
                <Cpu className="w-4 h-4" />
                Technical Architecture
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-[#A1A1AA] space-y-4 font-sans leading-relaxed">
                <p>
                  At its core, ZKredential uses <strong>Circom</strong> to compile custom ZK circuits and <strong>SnarkJS</strong> with the <strong>Groth16</strong> proving system to generate and verify proofs. 
                </p>
                <p>
                  The workflow operates in four primary stages:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Issuance:</strong> Universities cryptographically sign credentials containing the student's ID, degree details, and a secret salt. The credential is then minted as a Soulbound Token (SBT) adhering to the <strong>ERC-5192</strong> standard on the Polygon Amoy testnet.</li>
                  <li><strong>Proof Generation:</strong> When proving degree completion, the student feeds their credential, private secret, and signature into the local client-side proving circuit.</li>
                  <li><strong>Verification:</strong> The circuit produces a small cryptographic proof (a few hundred bytes). The verifier or a smart contract checks this proof against the university's public key hash.</li>
                  <li><strong>Zero Leakage:</strong> The proof confirms degree validity without revealing the student's name, ID, or any other transcript details.</li>
                </ul>
              </div>
            </div>

            {/* Code Highlight */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#818CF8] flex items-center gap-2">
                <Code2 className="w-4 h-4" />
                Circom Circuit Snippet
              </h2>
              <div className="relative rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
                  <span className="text-xs font-mono text-[#A1A1AA]">VerifyCredential.circom</span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#818CF8] px-2 py-0.5 rounded bg-[#6366F1]/10 border border-[#6366F1]/10">
                    Circom 2.0
                  </span>
                </div>
                <pre className="p-6 overflow-x-auto font-mono text-xs md:text-sm text-emerald-400/90 leading-relaxed max-h-[350px] custom-scrollbar">
                  <code>{circomCircuitCode}</code>
                </pre>
              </div>
            </div>

          </section>

          {/* Sidebar - 5 cols */}
          <aside className="anim-fade lg:col-span-5 space-y-12">
            
            {/* Project Details Panel */}
            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-md space-y-8">
              <h3 className="text-sm font-mono tracking-widest text-white uppercase pb-4 border-b border-white/5">
                Specifications
              </h3>

              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Circom', 'Groth16', 'Solidity', 'ERC-5192', 'Polygon Amoy', 'SnarkJS', 'React', 'Hardhat', 'IPFS'].map(tech => (
                      <span key={tech} className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs font-mono text-[#D4D4D8]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Role</h4>
                    <p className="text-sm font-medium text-white">Lead Cryptographic Engineer</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Timeline</h4>
                    <p className="text-sm font-medium text-white">Hackathon Sprint (2026)</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Key Impact</h4>
                  <p className="text-sm text-[#A1A1AA] leading-relaxed">
                    Designed and deployed zero-knowledge proving architecture that reduced verification latency to under 3 seconds client-side. Placed in the top 15 out of 100+ projects at Velora 1.0.
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <a
                  href="https://github.com/atharvabaodhankar/ZKredential"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-6 py-4 bg-white text-black hover:bg-[#E4E4E7] transition-all duration-300 rounded-full font-medium group text-sm"
                >
                  <span>Explore Repository</span>
                  <Github size={16} />
                </a>

                <a
                  href="https://atharvabaodhankar.me/projects/zkredential"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-6 py-4 border border-white/10 text-white hover:bg-white/5 transition-all duration-300 rounded-full group text-sm font-mono"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={16} className="text-[#A1A1AA] group-hover:text-white" />
                </a>
              </div>
            </div>

            {/* Quote / Highlight */}
            <div className="p-8 rounded-3xl bg-gradient-to-br from-[#6366F1]/10 to-transparent border border-[#6366F1]/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl pointer-events-none select-none">
                “
              </div>
              <p className="text-[#E4E4E7] italic text-base leading-relaxed relative z-10">
                "By decoupling verification from identification, ZKredential points to a future where educational credentials are both instantly checkable and strictly private. No middleman needed."
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#818CF8]" />
                <span className="text-xs font-mono text-[#A1A1AA]">Atharva Baodhankar</span>
              </div>
            </div>

          </aside>

        </main>
        
      </div>
    </div>
  );
}

export const ssgOptions = {
  slug: 'zkredential',
  routeUrl: '/projects/zkredential'
};
