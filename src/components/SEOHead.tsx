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
  noindex?: boolean;
  twitterSite?: string;
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  noindex = false,
  twitterSite = '@speeltuincastricum'
}) => {
  const { data: settings } = useSiteSettings();
  
  // Use site settings with fallbacks optimized for families with children
  const pageTitle = title || settings?.meta_title || settings?.site_name || 'Speeltuinen in Castricum - Complete Gids';
  const pageDescription = description || settings?.meta_description || settings?.site_description || 'Ontdek alle speeltuinen in Castricum met foto\'s, locaties en faciliteiten. Complete gids voor gezinnen met kinderen van peuters tot tieners.';
  const pageKeywords = keywords || settings?.keywords || 'speeltuinen Castricum, speeltuin Castricum, kinderen spelen Castricum, speelplaats Castricum, buitenspelen Castricum, peuterspeeltuin Castricum, speelpark Castricum, Noord-Holland speeltuinen, familie uitje Castricum, kindvriendelijk Castricum, glijbaan Castricum, schommel Castricum, zandbak Castricum';
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : 'https://speeltuincastricum.nl');
  const defaultImage = 'https://speeltuincastricum.nl/lovable-uploads/2ea4b2d6-5537-43cf-a522-d1571d0f5108.png';
  const pageImage = image || defaultImage;
  const siteName = settings?.site_name || 'Speeltuinen Castricum';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
      {pageKeywords && <meta name="keywords" content={pageKeywords} />}
      
      {/* Local SEO Meta Tags */}
      <meta name="geo.region" content="NL-NH" />
      <meta name="geo.placename" content="Castricum" />
      <meta name="geo.position" content="52.5455;4.6583" />
      <meta name="ICBM" content="52.5455, 4.6583" />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={pageImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="nl_NL" />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDescription} />
      <meta name="twitter:image" content={pageImage} />
      
      {/* Additional SEO Meta Tags */}
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
      <meta name="author" content={settings?.contact_email ? settings.contact_email.split('@')[1] : 'Gemeente Castricum'} />
      <link rel="canonical" href={currentUrl} />
      
      {/* Mobile and App Meta Tags */}
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content="Speeltuinen Castricum" />
      <meta name="theme-color" content="#10b981" />
      
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