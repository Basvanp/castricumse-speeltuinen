import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import { SiteSettings } from '@/types/siteSettings';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  structuredData?: any;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData
}) => {
  const { data: settings } = useSiteSettings();
  
  // Use site settings with fallbacks
  const pageTitle = title || settings?.meta_title || settings?.site_name || 'Castricum Speeltuinen Gids';
  const pageDescription = description || settings?.meta_description || settings?.site_description || 'Ontdek de beste speeltuinen in Castricum';
  const pageKeywords = keywords || settings?.keywords || 'speeltuinen, castricum, kinderen, spelen';
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const defaultImage = '/placeholder.svg'; // fallback image
  const pageImage = image || defaultImage;
  const siteName = settings?.site_name || 'Castricum Speeltuinen Gids';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content={settings?.contact_email ? settings.contact_email.split('@')[1] : 'Gemeente Castricum'} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHead;