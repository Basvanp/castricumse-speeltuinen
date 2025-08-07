# 🗺️ Google Maps Button Component

Een herbruikbare Google Maps button component voor de Nederlandse speeltuinen website, geoptimaliseerd voor jonge gezinnen.

## 🎯 Features

- **Outline naar Filled Hover Effect**: Smooth transitie van outline naar gevulde stijl
- **Google Kleuren**: Gebruikt officiële Google Maps kleuren (#4285f4)
- **Responsive Design**: Automatisch aangepast voor mobile en desktop
- **Nederlandse Tekst**: Standaard "Route" tekst, aanpasbaar
- **Toegankelijk**: Semantisch correct HTML met ARIA labels
- **Flexibel**: Kan gebruikt worden als button of link

## 📦 Installatie

De component is al geïntegreerd in het project. Importeer als volgt:

```tsx
import { GoogleMapsButton } from '@/components/ui/google-maps-button';
import { generateGoogleMapsUrl } from '@/utils/googleMaps';
```

## 🚀 Gebruik

### Basis Gebruik

```tsx
// Als link naar Google Maps
<GoogleMapsButton 
  href="https://www.google.com/maps?q=52.5455,4.6583"
  variant="outline"
>
  Route
</GoogleMapsButton>
```

### Met Utility Functie

```tsx
import { generateGoogleMapsUrl } from '@/utils/googleMaps';

const mapsUrl = generateGoogleMapsUrl({
  latitude: 52.5455,
  longitude: 4.6583,
  name: "Speeltuin Castricum"
});

<GoogleMapsButton 
  href={mapsUrl}
  variant="outline"
  size="default"
>
  Route
</GoogleMapsButton>
```

### Als Button (voor custom handlers)

```tsx
<GoogleMapsButton 
  variant="filled"
  size="lg"
  onClick={() => handleCustomAction()}
>
  Navigeer naar Speeltuin
</GoogleMapsButton>
```

## 🎨 Varianten

### Outline (Default)
```tsx
<GoogleMapsButton variant="outline">
  Route
</GoogleMapsButton>
```

### Filled
```tsx
<GoogleMapsButton variant="filled">
  Maps
</GoogleMapsButton>
```

## 📏 Groottes

### Small
```tsx
<GoogleMapsButton size="sm">
  Route
</GoogleMapsButton>
```

### Default
```tsx
<GoogleMapsButton size="default">
  Route
</GoogleMapsButton>
```

### Large
```tsx
<GoogleMapsButton size="lg">
  Google Maps
</GoogleMapsButton>
```

## 🎯 Props

| Prop | Type | Default | Beschrijving |
|------|------|---------|--------------|
| `variant` | `'outline' \| 'filled'` | `'outline'` | Visuele stijl van de button |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Grootte van de button |
| `href` | `string` | - | URL voor Google Maps (maakt het een link) |
| `target` | `string` | `'_blank'` | Target voor links |
| `rel` | `string` | `'noopener noreferrer'` | Rel attribuut voor links |
| `children` | `ReactNode` | `'Route'` | Button tekst |
| `className` | `string` | - | Extra CSS classes |

## 🛠️ Utility Functies

### `generateGoogleMapsUrl(location)`

Genereert een Google Maps URL op basis van locatie data.

```tsx
import { generateGoogleMapsUrl } from '@/utils/googleMaps';

// Met coördinaten
const url1 = generateGoogleMapsUrl({
  latitude: 52.5455,
  longitude: 4.6583
});

// Met adres
const url2 = generateGoogleMapsUrl({
  address: "Castricum, Nederland"
});

// Met naam
const url3 = generateGoogleMapsUrl({
  name: "Speeltuin Castricum"
});
```

### `generateGoogleMapsDirectionsUrl(destination, origin?)`

Genereert een Google Maps directions URL.

```tsx
const directionsUrl = generateGoogleMapsDirectionsUrl(
  { latitude: 52.5455, longitude: 4.6583 }, // bestemming
  { latitude: 52.5460, longitude: 4.6590 }  // start (optioneel)
);
```

## 🎨 Styling

### CSS Classes

De component gebruikt Tailwind CSS classes:

```css
/* Basis stijl */
.inline-flex items-center justify-center gap-2 
whitespace-nowrap rounded-lg text-sm font-medium 
transition-all duration-200

/* Outline variant */
.border-2 border-[#4285f4] bg-transparent text-[#4285f4] 
hover:bg-[#4285f4] hover:text-white hover:transform 
hover:-translate-y-0.5 hover:shadow-md

/* Filled variant */
.border-2 border-[#4285f4] bg-[#4285f4] text-white 
hover:bg-[#3367d6] hover:border-[#3367d6]
```

### Custom Styling

```tsx
<GoogleMapsButton 
  className="custom-class"
  variant="outline"
>
  Route
</GoogleMapsButton>
```

## 📱 Responsive Design

De component is automatisch responsive:

- **Desktop**: Volledige padding en font-size
- **Mobile**: Kleinere padding en font-size via Tailwind responsive classes
- **Touch-friendly**: Minimale 44px touch target

## ♿ Toegankelijkheid

- **Semantisch HTML**: Gebruikt `<button>` of `<a>` tags
- **ARIA Labels**: Automatisch toegevoegd voor screen readers
- **Keyboard Navigation**: Volledig toetsenbord toegankelijk
- **Focus States**: Duidelijke focus indicators
- **Screen Reader**: Beschrijvende tekst voor locatie icoon

## 🔧 Integratie in SpeeltuinCard

De component is geïntegreerd in de SpeeltuinCard:

```tsx
// In de card header (kleine outline variant)
<GoogleMapsButton
  href={generateGoogleMapsUrl({
    latitude: speeltuin.latitude,
    longitude: speeltuin.longitude,
    name: speeltuin.naam
  })}
  variant="outline"
  size="sm"
  className="opacity-0 group-hover:opacity-100 transition-opacity"
>
  Route
</GoogleMapsButton>

// In de popup (grote filled variant)
<GoogleMapsButton 
  href={generateGoogleMapsUrl({
    latitude: speeltuin.latitude,
    longitude: speeltuin.longitude,
    name: speeltuin.naam
  })}
  variant="filled"
  size="lg"
  className="w-full"
>
  Route naar {speeltuin.naam}
</GoogleMapsButton>
```

## 🎯 Best Practices

1. **Gebruik altijd de utility functie** voor consistente URLs
2. **Voeg altijd een href toe** voor betere UX (opent in nieuwe tab)
3. **Gebruik beschrijvende tekst** zoals "Route naar [Speeltuin Naam]"
4. **Test op mobile** voor touch-friendly ervaring
5. **Controleer toegankelijkheid** met screen readers

## 🐛 Troubleshooting

### Button opent niet in Google Maps
- Controleer of `href` prop is toegevoegd
- Verifieer dat coördinaten correct zijn
- Test URL handmatig in browser

### Styling ziet er niet uit
- Controleer of Tailwind CSS is geladen
- Verifieer dat geen conflicterende CSS classes zijn toegevoegd
- Test in verschillende browsers

### Mobile responsive issues
- Controleer viewport meta tag
- Test op verschillende schermformaten
- Verifieer touch target grootte (minimaal 44px) 