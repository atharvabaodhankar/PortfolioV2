import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import SEO from '../SEO';
import TransitionLink from '../TransitionLink';
import { ArrowLeft, ExternalLink, Github, Cpu, ShieldCheck, Mail, Navigation, GraduationCap, Info } from 'lucide-react';
import gsap from 'gsap';

const PROJECT_DATA = {
  'erc4337-kit': {
    title: 'erc4337-kit',
    subtitle: 'A Lightweight, Type-Safe TS/JS SDK for ERC-4337 Account Abstraction',
    category: 'Developer Tooling / Web3',
    icon: Cpu,
    seoTitle: 'erc4337-kit — SDK for ERC-4337 Account Abstraction | Atharva Baodhankar',
    seoDescription: 'erc4337-kit is a lightweight, type-safe TypeScript/JavaScript SDK for ERC-4337 Account Abstraction. Easily assemble, sign, and send UserOperations. Built by Atharva Baodhankar.',
    description: `Working with account abstraction smart contracts can be complex due to the multi-step process of constructing, signing, and gas-estimating UserOperations. 

erc4337-kit is a production-grade TypeScript/JavaScript SDK designed to streamline the implementation of ERC-4337. It wraps complex interactions with smart accounts, bundlers, and paymasters into intuitive, developer-friendly methods. 

Whether you are building a custom smart contract wallet, setting up social logins, or implementing gas sponsorship (gasless transactions), erc4337-kit handles the cryptography, ABI encoding, and RPC communication under the hood.`,
    highlights: [
      'Type-safe UserOperation construction and validation',
      'Plug-and-play bundler client integration',
      'Paymaster helper functions for sponsorship and gas payment in ERC-20 tokens',
      'Extensive testing suite using local Hardhat/Anvil networks'
    ],
    technologies: ['TypeScript', 'Viem', 'Ethers.js', 'Solidity', 'ERC-4337', 'NPM', 'Node.js'],
    github: 'https://github.com/atharvabaodhankar/erc4337-kit',
    live: 'https://www.npmjs.com/package/erc4337-kit'
  },
  'chainvidya': {
    title: 'ChainVidya',
    subtitle: 'Decentralized Peer-to-Peer Learning & Education Verification Platform',
    category: 'Web3 / Education',
    icon: GraduationCap,
    seoTitle: 'ChainVidya — Decentralized Peer-to-Peer Learning | Atharva Baodhankar',
    seoDescription: 'ChainVidya is a decentralized peer-to-peer learning platform built on Ethereum and IPFS, featuring verifiable proof-of-knowledge tokens and academic credential sharing. Built by Atharva Baodhankar.',
    description: `Traditional online learning environments are centralized, siloed, and fail to cryptographically verify peer study sessions or informal mentoring. 

ChainVidya is a Web3-native learning platform designed to decentralize education. It allows students, tutors, and researchers to share study materials on IPFS, organize peer-to-peer study sessions, and issue digital proof-of-participation tokens.

All knowledge contributions, study session completions, and peer reviews are recorded on-chain, creating a transparent, cryptographic resume for students and educators alike.`,
    highlights: [
      'IPFS-backed decentralized file sharing for academic notes',
      'On-chain proof of participation & learning certificates',
      'Gas-optimized smart contracts for study group organization',
      'Smooth responsive frontend with Web3 wallet support'
    ],
    technologies: ['Solidity', 'Next.js', 'IPFS', 'Ethereum', 'Tailwind CSS', 'Hardhat'],
    github: 'https://github.com/atharvabaodhankar/ChainVidya',
    live: 'https://chainvidya.vercel.app'
  },
  'zeroleak': {
    title: 'ZeroLeak',
    subtitle: 'Privacy-Focused Zero-Disclosure File Transfer & Storage Utility',
    category: 'Security / Cryptography',
    icon: ShieldCheck,
    seoTitle: 'ZeroLeak — Privacy-Preserving File Transfer | Atharva Baodhankar',
    seoDescription: 'ZeroLeak is a privacy-first file sharing utility leveraging client-side encryption and decentralized networks for secure, zero-leak file exchanges. Built by Atharva Baodhankar.',
    description: `ZeroLeak is a utility designed for secure file transfer and decentralized storage. It utilizes client-side AES-256-GCM encryption to ensure files are fully encrypted before leaving the user's browser, preventing server-side administrators or intermediaries from viewing the contents.

Uploaded files are split, encrypted, and distributed across the decentralized IPFS network (via Web3.Storage/Filecoin). File recovery is managed through cryptographically verified access tokens, ensuring absolute file privacy and data sovereignty.`,
    highlights: [
      'End-to-end client-side encryption using Web Crypto API',
      'Decentralized storage with IPFS and Filecoin integrations',
      'Disposable access links with auto-expiry tokens',
      'No registration or personal metadata collection'
    ],
    technologies: ['React', 'IPFS', 'Web Crypto API', 'Tailwind CSS', 'Vite'],
    github: 'https://github.com/atharvabaodhankar/ZeroLeak',
    live: 'https://zeroleak.vercel.app'
  },
  'roadsense': {
    title: 'RoadSense',
    subtitle: 'Decentralized Crowdsourced Road Quality Mapping & Reward System',
    category: 'IoT / Web3 / Mobile',
    icon: Navigation,
    seoTitle: 'RoadSense — Crowdsourced Road Quality Mapping | Atharva Baodhankar',
    seoDescription: 'RoadSense maps urban road conditions by analyzing crowdsourced telemetry data and incentivizes drivers with Web3 rewards. Built by Atharva Baodhankar.',
    description: `Local municipalities often struggle to map potholes and evaluate road conditions in real-time, resulting in delayed repairs and vehicle damage.

RoadSense leverages crowdsourced mobile telemetry (accelerometer, gyroscope, GPS) to classify road quality. The application tracks vibration metrics as users drive, maps pothole clusters, and uploads the analyzed data to a public dashboard. 

To encourage participation, drivers are rewarded with Web3 tokens via an Ethereum smart contract when submitting validated road quality reports.`,
    highlights: [
      'Mobile telemetry analysis for pothole and bumper detection',
      'Dynamic mapping visualization using Leaflet and OpenStreetMap',
      'Token reward smart contracts with anti-spam telemetry validation',
      'Sleek analytical admin dashboard for municipal insights'
    ],
    technologies: ['React Native', 'Leaflet.js', 'Solidity', 'Web3', 'Node.js', 'Firebase'],
    github: 'https://github.com/atharvabaodhankar/RoadSense',
    live: 'https://roadsense.vercel.app'
  },
  'plugmail': {
    title: 'PlugMail',
    subtitle: 'Web3-Native Email Client with Wallet Authentication & Encrypted Delivery',
    category: 'Web3 / Communication',
    icon: Mail,
    seoTitle: 'PlugMail — Web3-Native Encrypted Email | Atharva Baodhankar',
    seoDescription: 'PlugMail connects standard email protocols to Web3 wallets, offering end-to-end encrypted mail delivery using public key cryptography. Built by Atharva Baodhankar.',
    description: `Standard email platforms lack native integration with cryptographic wallets and do not support end-to-end encryption by default.

PlugMail bridges this gap by offering a Web3-native email experience. Users log in securely with their Ethereum wallets (MetaMask/WalletConnect), which derive cryptographic keypairs. 

Emails sent between PlugMail users are automatically encrypted using the recipient's public key before delivery, ensuring that only the intended recipient can read the message, all while maintaining compatibility with legacy SMTP/IMAP configurations.`,
    highlights: [
      'Ethereum wallet authentication (SIWE - Sign-In with Ethereum)',
      'End-to-end encryption using PGP / public key cryptography',
      'Legacy mail server bridge (SMTP/IMAP integrations)',
      'Clean, glassmorphic UI matching modern email app design'
    ],
    technologies: ['React', 'Node.js', 'Sign-In with Ethereum', 'PGP', 'Socket.io', 'Tailwind CSS'],
    github: 'https://github.com/atharvabaodhankar/PlugMail',
    live: 'https://plugmail.vercel.app'
  }
};

export default function ProjectPlaceholder() {
  const { slug } = useParams();
  const project = PROJECT_DATA[slug?.toLowerCase()];
  const containerRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (project) {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo('.anim-fade',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, stagger: 0.15 }
      );
    }
  }, [slug, project]);

  if (!project) {
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

  const IconComponent = project.icon || Info;

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-[#E4E4E7]/10 selection:text-white"
    >
      <SEO
        title={project.seoTitle}
        description={project.seoDescription}
        url={`https://atharvabaodhankar.me/projects/${slug}`}
        type="article"
      />

      {/* Ambient glowing blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 opacity-20">
        <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-[#6366F1]/10 to-transparent rounded-full blur-[120px] -top-80 -left-60" />
        <div className="absolute w-[500px] h-[500px] bg-gradient-to-br from-[#10B981]/5 to-transparent rounded-full blur-[100px] bottom-1/4 -right-40" />
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
              <IconComponent className="w-3.5 h-3.5" />
              {project.category}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-arsenica leading-[1.05] text-white">
            {project.title}
          </h1>

          <p className="text-xl md:text-2xl text-[#A1A1AA] font-mono font-light italic leading-relaxed border-l-2 border-white/10 pl-6">
            {project.subtitle}
          </p>
        </header>

        {/* Details Grid */}
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-16 mt-20">
          
          {/* Main writeup */}
          <section className="anim-fade lg:col-span-7 space-y-12">
            
            {/* Overview */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#818CF8] flex items-center gap-2">
                <Info className="w-4 h-4" />
                Overview & Context
              </h2>
              <div className="prose prose-invert prose-lg max-w-none text-[#A1A1AA] space-y-6 font-sans leading-relaxed">
                {project.description.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div className="space-y-6">
              <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-[#818CF8] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                Key Highlights
              </h2>
              <ul className="space-y-4 font-sans text-lg text-[#A1A1AA]">
                {project.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#818CF8] mt-3 flex-shrink-0" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
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
                <div>
                  <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-2">Technologies Used</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map(tech => (
                      <span key={tech} className="px-3.5 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs font-mono text-[#D4D4D8]">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Status</h4>
                    <p className="text-sm font-medium text-white">Completed Experiment</p>
                  </div>
                  <div>
                    <h4 className="text-[11px] font-mono text-[#A1A1AA] uppercase tracking-wider mb-1">Developer</h4>
                    <p className="text-sm font-medium text-white">Atharva Baodhankar</p>
                  </div>
                </div>
              </div>

              {/* Links */}
              <div className="pt-6 border-t border-white/5 space-y-4">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-6 py-4 bg-white text-black hover:bg-[#E4E4E7] transition-all duration-300 rounded-full font-medium group text-sm"
                >
                  <span>Explore Repository</span>
                  <Github size={16} />
                </a>

                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between w-full px-6 py-4 border border-white/10 text-white hover:bg-white/5 transition-all duration-300 rounded-full group text-sm font-mono"
                >
                  <span>Live URL</span>
                  <ExternalLink size={16} className="text-[#A1A1AA] group-hover:text-white" />
                </a>
              </div>
            </div>

          </aside>

        </main>
        
      </div>
    </div>
  );
}
