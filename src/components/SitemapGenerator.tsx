import { useEffect } from 'react';
import { useSpeeltuinen } from '@/hooks/useSpeeltuinen';

const SitemapGenerator = () => {
  const { data: speeltuinen = [], isLoading, error } = useSpeeltuinen();

  useEffect(() => {
    // Set response headers for XML
    const meta = document.querySelector('meta[http-equiv="Content-Type"]');
    if (meta) {
      meta.setAttribute('content', 'application/xml; charset=utf-8');
    }
  }, []);

  if (isLoading) {
    return <div>Loading sitemap...</div>;
  }

  // Get the most recent update date for homepage lastmod
  const mostRecentUpdate = speeltuinen.length > 0 
    ? Math.max(...speeltuinen.map(s => new Date(s.updated_at).getTime()))
    : Date.now();
  
  const mostRecentDate = new Date(mostRecentUpdate).toISOString().split('T')[0];

  const generateSitemap = () => {
    const baseUrl = 'https://castricum-speeltuinen.lovable.app';
    
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${mostRecentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

    // Add individual speeltuinen if data is available
    if (!error && speeltuinen.length > 0) {
      speeltuinen.forEach(speeltuin => {
        const lastmod = new Date(speeltuin.updated_at).toISOString().split('T')[0];
        sitemap += `
  <url>
    <loc>${baseUrl}/speeltuin/${speeltuin.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });
    }

    // Add auth page
    sitemap += `
  <url>
    <loc>${baseUrl}/auth</loc>
    <lastmod>2024-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

    return sitemap;
  };

  // Return the XML as pre-formatted text
  return (
    <pre 
      style={{ 
        fontFamily: 'monospace', 
        fontSize: '12px',
        margin: 0,
        padding: 0,
        whiteSpace: 'pre-wrap'
      }}
    >
      {generateSitemap()}
    </pre>
  );
};

export default SitemapGenerator;