import { Helmet } from 'react-helmet-async'

export default function SEO({
  title = "Atharva Baodhankar — Web3 & Full Stack Developer",
  description = "Atharva Baodhankar is a Web3 and full-stack developer from Solapur, India. Builder of ZKredential, erc4337-kit, Socio3, ChainVidya, and more.",
  url = "https://atharvabaodhankar.me",
  image = "https://atharvabaodhankar.me/og-image.png",
  type = "website"
}) {
  return (
    <Helmet>
      {/* Core */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph (LinkedIn, WhatsApp, Discord previews) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Atharva Baodhankar" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@atharvabaodhankar" />

      {/* Indexing */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Atharva Baodhankar" />
      <meta name="keywords" content="Atharva Baodhankar, Web3 developer, blockchain developer, Solapur, MITAOE, ZKredential, erc4337-kit, Socio3, ChainVidya, full stack developer India" />
    </Helmet>
  )
}
