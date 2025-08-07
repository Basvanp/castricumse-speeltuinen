/**
 * Utility functies voor Google Maps integratie
 */

export interface LocationData {
  latitude?: number
  longitude?: number
  address?: string
  name?: string
}

/**
 * Genereert een Google Maps URL op basis van locatie data
 * @param location - Locatie data (latitude/longitude of address/name)
 * @returns Google Maps URL
 */
export const generateGoogleMapsUrl = (location: LocationData): string => {
  // Prioriteit: coordinates > address > name
  if (location.latitude && location.longitude) {
    return `https://www.google.com/maps?q=${location.latitude},${location.longitude}`
  }
  
  if (location.address) {
    return `https://www.google.com/maps/search/${encodeURIComponent(location.address)}`
  }
  
  if (location.name) {
    return `https://www.google.com/maps/search/${encodeURIComponent(location.name)}`
  }
  
  // Fallback naar algemene Google Maps
  return 'https://www.google.com/maps'
}

/**
 * Genereert een Google Maps directions URL
 * @param destination - Bestemming locatie
 * @param origin - Start locatie (optioneel)
 * @returns Google Maps directions URL
 */
export const generateGoogleMapsDirectionsUrl = (
  destination: LocationData,
  origin?: LocationData
): string => {
  let url = 'https://www.google.com/maps/dir/'
  
  if (origin) {
    if (origin.latitude && origin.longitude) {
      url += `${origin.latitude},${origin.longitude}/`
    } else if (origin.address) {
      url += `${encodeURIComponent(origin.address)}/`
    } else if (origin.name) {
      url += `${encodeURIComponent(origin.name)}/`
    }
  }
  
  if (destination.latitude && destination.longitude) {
    url += `${destination.latitude},${destination.longitude}`
  } else if (destination.address) {
    url += encodeURIComponent(destination.address)
  } else if (destination.name) {
    url += encodeURIComponent(destination.name)
  }
  
  return url
}

/**
 * Genereert een Google Maps street view URL
 * @param location - Locatie data
 * @returns Google Maps street view URL
 */
export const generateGoogleMapsStreetViewUrl = (location: LocationData): string => {
  if (location.latitude && location.longitude) {
    return `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${location.latitude},${location.longitude}`
  }
  
  if (location.address) {
    return `https://www.google.com/maps/@?api=1&map_action=pano&query=${encodeURIComponent(location.address)}`
  }
  
  return 'https://www.google.com/maps'
}

/**
 * Controleert of de huidige locatie beschikbaar is
 * @returns Promise<boolean>
 */
export const isLocationAvailable = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(false)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      () => resolve(true),
      () => resolve(false),
      { timeout: 5000 }
    )
  })
}

/**
 * Haalt de huidige locatie op
 * @returns Promise<{latitude: number, longitude: number} | null>
 */
export const getCurrentLocation = (): Promise<{latitude: number, longitude: number} | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null)
      return
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      },
      () => resolve(null),
      { 
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000 // 5 minuten cache
      }
    )
  })
} 