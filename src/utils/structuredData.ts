import { Speeltuin } from '@/types/speeltuin';

export const generateOrganizationSchema = (settings: Record<string, string>) => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": settings.organization_name || "Gemeente Castricum",
    "url": window.location.origin,
    "logo": `${window.location.origin}/placeholder.svg`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": settings.contact_phone || "",
      "contactType": "customer service",
      "email": settings.contact_email || ""
    },
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.organization_address || "Dorpsstraat 30",
      "addressLocality": "Castricum",
      "postalCode": "1901 EN",
      "addressCountry": "NL"
    },
    "sameAs": [
      settings.social_facebook,
      settings.social_instagram,
      settings.social_twitter
    ].filter(Boolean)
  };
};

export const generateLocalBusinessSchema = (settings: Record<string, string>) => {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": settings.site_name || "Castricum Speeltuinen Gids",
    "description": settings.site_description || "",
    "url": window.location.origin,
    "telephone": settings.contact_phone || "",
    "email": settings.contact_email || "",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": settings.organization_address || "Dorpsstraat 30",
      "addressLocality": "Castricum",
      "postalCode": "1901 EN",
      "addressCountry": "NL"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": settings.map_center_lat || "52.5463",
      "longitude": settings.map_center_lng || "4.6748"
    },
    "openingHours": "Mo-Su 00:00-23:59",
    "priceRange": "€"
  };
};

export const generateSpeeltuinSchema = (speeltuin: Speeltuin, settings: Record<string, string>) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": speeltuin.naam,
    "description": speeltuin.omschrijving || `Speeltuin ${speeltuin.naam} in Castricum`,
    "url": `${window.location.origin}/#speeltuin-${speeltuin.id}`,
    "image": speeltuin.afbeelding_url || "/placeholder.svg",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": speeltuin.latitude?.toString() || "",
      "longitude": speeltuin.longitude?.toString() || ""
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Castricum",
      "addressCountry": "NL"
    },
    "amenityFeature": [
      speeltuin.heeft_glijbaan && {
        "@type": "LocationFeatureSpecification",
        "name": "Glijbaan",
        "value": true
      },
      speeltuin.heeft_schommel && {
        "@type": "LocationFeatureSpecification",
        "name": "Schommel",
        "value": true
      },
      speeltuin.heeft_zandbak && {
        "@type": "LocationFeatureSpecification",
        "name": "Zandbak",
        "value": true
      },
      speeltuin.heeft_bankjes && {
        "@type": "LocationFeatureSpecification",
        "name": "Bankjes",
        "value": true
      },
      speeltuin.is_rolstoeltoegankelijk && {
        "@type": "LocationFeatureSpecification",
        "name": "Rolstoeltoegankelijk",
        "value": true
      },
      speeltuin.heeft_toilet && {
        "@type": "LocationFeatureSpecification",
        "name": "Toilet",
        "value": true
      },
      speeltuin.heeft_parkeerplaats && {
        "@type": "LocationFeatureSpecification",
        "name": "Parkeerplaats",
        "value": true
      }
    ].filter(Boolean),
    "audience": {
      "@type": "PeopleAudience",
      "suggestedMinAge": speeltuin.geschikt_peuters ? 1 : speeltuin.geschikt_kleuters ? 3 : 6,
      "suggestedMaxAge": speeltuin.geschikt_kinderen ? 12 : speeltuin.geschikt_kleuters ? 6 : 3
    },
    "isAccessibleForFree": true,
    "publicAccess": true
  };
};

export const generateWebsiteSchema = (settings: Record<string, string>) => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": settings.site_name || "Castricum Speeltuinen Gids",
    "description": settings.site_description || "",
    "url": window.location.origin,
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${window.location.origin}/?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "ItemList",
      "name": "Speeltuinen in Castricum",
      "description": "Complete lijst van alle speeltuinen in Castricum en omgeving"
    }
  };
};