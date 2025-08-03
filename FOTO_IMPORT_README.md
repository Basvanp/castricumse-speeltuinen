# 📸 Foto Import Tool

## Overzicht

De **Foto Import Tool** is een admin functie die foto's uit de Supabase storage bucket (`lovable-uploads`) automatisch omzet naar speeltuin records met behulp van EXIF GPS-data.

## 🎯 Functionaliteiten

### 1. **Automatische GPS Extractie**
- Leest alle foto's uit de `lovable-uploads` bucket
- Extraheert GPS-coördinaten uit EXIF metadata met behulp van de `exifr` library
- Slaat foto's zonder GPS-data over

### 2. **Locatie Clustering**
- Groepeert foto's op basis van GPS-locatie
- **Maximale afstand**: 20 meter tussen foto's in een cluster
- Berekent het centrum van elke cluster voor de speeltuin locatie
- Genereert automatisch voorgestelde namen (`Speeltuin 1`, `Speeltuin 2`, etc.)

### 3. **Interactieve Interface**
- **Cluster Grid**: Toont alle gevonden locatie clusters in een overzichtelijk grid
- **Foto Preview**: Toont thumbnails van foto's in elke cluster
- **GPS Coördinaten**: Toont de exacte GPS-locatie van elke cluster
- **Foto Selectie**: Checkbox interface om specifieke foto's te selecteren

### 4. **Complete Speeltuin Formulier**
- **Basis Informatie**: Naam en omschrijving
- **Foto Selectie**: Checkbox per foto om te bepalen welke foto's worden toegevoegd
- **Alle Voorzieningen**: Alle boolean velden uit de `speeltuin.ts` interface
- **Type Speeltuin**: Natuurspeeltuin, buurtspeeltuin, schoolplein, speelbos
- **Leeftijdsgroep**: Specifieke leeftijdsgroepen (0-2, 2-6, 6-12, 12+)
- **Ondergrond**: Zand, gras, rubber, tegels, kunstgras
- **Overige Kenmerken**: Omheind, schaduw
- **Grootte en Badge**: Klein/middel/groot en badge selectie

## 🛠️ Technische Details

### **Database Operaties**
- **Insert Target**: `speeltuinen` tabel
- **Required Fields**: `naam`, `latitude`, `longitude`, `fotos[]`, alle voorzieningen booleans
- **Optional Fields**: `omschrijving`
- **Foto URLs**: Worden opgeslagen in het `fotos` array veld

### **GPS Clustering Algoritme**
```typescript
// Haversine formule voor afstandsberekening
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Aardradius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c * 1000; // Converteer naar meters
};
```

### **EXIF Data Extractie**
- Gebruikt `exifr` library voor EXIF parsing
- Downloadt elke foto uit Supabase storage voor EXIF extractie
- Extraheert `latitude`, `longitude`, en `DateTimeOriginal`
- Slaat foto's over die geen GPS-data bevatten

## 📋 Gebruik

### **Toegang**
1. Log in als admin gebruiker
2. Ga naar `/admin/import` in de admin interface
3. De tool laadt automatisch alle foto's uit de bucket

### **Workflow**
1. **Foto's Laden**: Klik op "Ververs" om foto's opnieuw te laden
2. **Cluster Selectie**: Klik op "Speeltuin aanmaken" bij een gewenste cluster
3. **Formulier Invullen**: Vul alle gewenste velden in
4. **Foto Selectie**: Selecteer welke foto's je wilt toevoegen
5. **Aanmaken**: Klik op "Speeltuin aanmaken" om de record te creëren

### **Foto Selectie**
- Elke foto heeft een checkbox in de rechterbovenhoek
- Standaard zijn alle foto's in een cluster geselecteerd
- Je kunt specifieke foto's deselecteren door de checkbox uit te vinken
- Alleen geselecteerde foto's worden toegevoegd aan de `fotos[]` array

## 🔒 Beveiliging

### **Access Control**
- Alleen toegankelijk voor gebruikers met `admin` rol
- Gebruikt `SecurityGuard` component voor toegangscontrole
- Volledig geïntegreerd in de bestaande admin interface

### **Error Handling**
- Graceful handling van foto's zonder GPS-data
- Duidelijke foutmeldingen bij upload/verwerking problemen
- Toast notifications voor succes en fout feedback

## 📊 Statistieken

De tool toont real-time statistieken:
- **Totaal aantal foto's**: Alle foto's in de bucket
- **Aantal clusters**: Gevonden locatie groepen
- **GPS succes rate**: Percentage foto's met GPS-data

## 🚀 Toekomstige Verbeteringen

### **Geplande Features**
1. **Bulk Import**: Meerdere speeltuinen tegelijk aanmaken
2. **Geocoding**: Automatische adres lookup op basis van GPS
3. **Foto Analyse**: AI-gebaseerde voorzieningen detectie
4. **Batch Processing**: Achtergrond verwerking voor grote datasets
5. **Import History**: Overzicht van geïmporteerde speeltuinen

### **Performance Optimalisaties**
1. **Caching**: Cache GPS-data om herhaalde downloads te voorkomen
2. **Pagination**: Ondersteuning voor grote aantallen foto's
3. **Background Jobs**: Asynchrone verwerking van grote imports
4. **Progress Tracking**: Voortgangsindicator voor lange operaties

## 🐛 Troubleshooting

### **Veelvoorkomende Problemen**

1. **"Geen foto's met GPS-data gevonden"**
   - Controleer of foto's EXIF GPS-data bevatten
   - Zorg dat foto's correct zijn geüpload naar de bucket

2. **"Fout bij laden foto's"**
   - Controleer Supabase storage permissions
   - Verifieer bucket naam (`lovable-uploads`)

3. **"Fout bij aanmaken speeltuin"**
   - Controleer database schema
   - Verifieer dat alle required fields zijn ingevuld

### **Debug Tips**
- Open browser console voor gedetailleerde error logs
- Controleer Supabase logs voor storage/database errors
- Verifieer EXIF data met externe tools

## 📝 Database Schema

De tool gebruikt het volledige `speeltuinen` schema:

```sql
-- Required fields voor import
naam: TEXT NOT NULL
latitude: DECIMAL
longitude: DECIMAL
fotos: TEXT[] NOT NULL

-- Alle boolean voorzieningen
heeft_glijbaan: BOOLEAN
heeft_schommel: BOOLEAN
-- ... (alle andere voorzieningen)

-- Type en leeftijd velden
type_natuurspeeltuin: BOOLEAN
leeftijd_0_2_jaar: BOOLEAN
-- ... (alle andere type/leeftijd velden)

-- Overige velden
grootte: 'klein' | 'middel' | 'groot'
badge: BadgeType
```

## 🎉 Conclusie

De Foto Import Tool biedt een krachtige en gebruiksvriendelijke manier om foto's uit de Supabase bucket automatisch om te zetten naar gestructureerde speeltuin records. Met GPS clustering, complete formulier ondersteuning en robuuste error handling is het de ideale oplossing voor bulk import van speeltuin data. 