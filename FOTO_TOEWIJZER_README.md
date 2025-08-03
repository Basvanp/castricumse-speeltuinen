# Foto Toewijzer - Admin Functie

## Overzicht

De Foto Toewijzer is een adminfunctie die foto's vanuit de Supabase bucket `lovable-uploads` automatisch toewijst aan speeltuinen op basis van GPS-coördinaten.

## Functionaliteiten

### 🔍 Foto Detectie
- **Automatische scan** van alle foto's in de `lovable-uploads` bucket
- **EXIF parsing** om GPS-coördinaten te extraheren uit foto's
- **Image filtering** - alleen ondersteunde formaten (JPG, PNG, GIF, WebP)

### 📍 Locatie Groepering
- **GPS clustering** - foto's worden gegroepeerd op basis van afgeronde coördinaten (4 decimalen precisie)
- **Afstandsberekening** - automatische berekening van afstand tussen foto-locatie en speeltuinen
- **Voorgestelde koppeling** - dichtstbijzijnde speeltuin wordt automatisch voorgesteld

### 🎯 Toewijzing Interface
- **Visuele foto grid** - alle foto's per locatie worden getoond
- **Checkbox selectie** - selecteer welke foto's toegewezen moeten worden
- **Speeltuin dropdown** - kies de doel-speeltuin (met afstandsindicatie)
- **Bulk toewijzing** - meerdere foto's tegelijk toewijzen

### 🔄 Database Integratie
- **Automatische update** van het `fotos` veld in de `speeltuinen` tabel
- **Array management** - nieuwe foto's worden toegevoegd aan bestaande arrays
- **URL generatie** - automatische public URL generatie voor Supabase storage

## Technische Details

### GPS Coördinaten Extractie
```typescript
// Gebruikt exifr library voor EXIF parsing
const exifData = await exifr.parse(blob, { gps: true });
if (exifData && exifData.latitude && exifData.longitude) {
  return {
    latitude: exifData.latitude,
    longitude: exifData.longitude
  };
}
```

### Locatie Groepering
```typescript
// Coördinaten worden afgerond naar 4 decimalen voor groepering
const locationKey = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;
```

### Afstandsberekening
```typescript
// Haversine formule voor nauwkeurige afstandsberekening
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Aardradius in kilometers
  // ... Haversine berekening
};
```

## Gebruik

### 1. Toegang
- Ga naar `/admin/fotos` in de admin interface
- Alleen toegankelijk voor gebruikers met admin rol

### 2. Foto's Laden
- Klik op "Foto's laden" om de bucket te scannen
- Systeem toont voortgang tijdens EXIF parsing
- Foto's met GPS-coördinaten worden gegroepeerd per locatie

### 3. Toewijzing
- Per locatie groep:
  - Bekijk de voorgestelde speeltuin (dichtstbijzijnde)
  - Selecteer alternatieve speeltuin indien gewenst
  - Vink foto's aan die toegewezen moeten worden
  - Klik "Toewijzen aan Speeltuin"

### 4. Resultaat
- Geselecteerde foto's worden toegevoegd aan het `fotos` veld van de speeltuin
- URLs worden automatisch gegenereerd voor Supabase storage
- Bestaande foto's blijven behouden

## Database Schema

### Speeltuinen Tabel
```sql
-- Het fotos veld wordt gebruikt voor foto toewijzing
fotos text[] DEFAULT '{}' -- Array van foto URLs
```

### Voorbeeld Update
```sql
-- Voor toewijzing
fotos: ['https://old-photo1.jpg', 'https://old-photo2.jpg']

-- Na toewijzing
fotos: ['https://old-photo1.jpg', 'https://old-photo2.jpg', 'https://new-photo1.jpg', 'https://new-photo2.jpg']
```

## Beveiliging

### Toegangscontrole
- **Admin-only** - alleen gebruikers met admin rol kunnen toegang krijgen
- **SecurityGuard** component zorgt voor extra beveiliging
- **Supabase RLS** - database-level beveiliging

### Data Validatie
- **File type checking** - alleen ondersteunde image formaten
- **GPS validatie** - controle op geldige coördinaten
- **URL sanitization** - veilige URL generatie

## Troubleshooting

### Geen Foto's Gevonden
- Controleer of foto's GPS-coördinaten bevatten in EXIF data
- Verifieer bucket toegang en bestandsnamen
- Check browser console voor error details

### GPS Extractie Fails
- Zorg dat foto's EXIF data bevatten
- Controleer of foto's niet gecorrumpeerd zijn
- Verifieer CORS instellingen voor bucket

### Toewijzing Fails
- Controleer database connectie
- Verifieer speeltuin ID en fotos veld
- Check voor storage bucket permissions

## Toekomstige Verbeteringen

### Geplande Features
- **Batch processing** - meerdere locaties tegelijk verwerken
- **Manual GPS input** - handmatige coördinaten voor foto's zonder EXIF
- **Photo preview** - grotere preview van foto's
- **Undo functionality** - ongedaan maken van toewijzingen
- **Export/Import** - bulk operaties via CSV

### Performance Optimalisatie
- **Caching** - cache GPS data om herhaalde parsing te voorkomen
- **Background processing** - async verwerking van grote batches
- **Progressive loading** - lazy loading van foto previews

## Support

Voor vragen of problemen:
1. Check de browser console voor error details
2. Verifieer Supabase bucket instellingen
3. Controleer admin rechten en database connectie
4. Raadpleeg de technische documentatie 