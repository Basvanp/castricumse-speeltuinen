# 🗺️ Google Maps Route Button

Een specifieke Google Maps Route Button component die exact de gewenste styling heeft voor de Nederlandse speeltuinen website.

## 🎯 Exacte Specificaties

### Styling
```css
display: inline-flex
align-items: center
justify-content: center
gap: 8px
padding: 12px 20px
min-width: 140px
background: #4285f4
color: white
text-decoration: none
border-radius: 8px
font-weight: 500
font-size: 14px
border: none
cursor: pointer
transition: all 0.2s ease
```

### Hover Effect
```css
background: #3367d6
transform: translateY(-1px)
box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3)
```

### SVG Icoon
- **Type**: Location pin
- **Size**: 16x16px
- **Fill**: currentColor
- **ViewBox**: 0 0 24 24
- **Path**: `M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z`

### Tekst
- **Default**: "Route"
- **Font**: System font stack
- **Weight**: 500 (medium)

## 📦 Installatie

```tsx
import { GoogleMapsRouteButton } from '@/components/ui/google-maps-route-button';
import { generateGoogleMapsUrl } from '@/utils/googleMaps';
```

## 🚀 Gebruik

### Basis Gebruik
```tsx
<GoogleMapsRouteButton 
  href="https://www.google.com/maps?q=52.5455,4.6583"
>
  Route
</GoogleMapsRouteButton>
```

### Met Utility Functie
```tsx
const mapsUrl = generateGoogleMapsUrl({
  latitude: 52.5455,
  longitude: 4.6583,
  name: "Speeltuin Castricum"
});

<GoogleMapsRouteButton 
  href={mapsUrl}
  variant="default"
  size="default"
>
  Route
</GoogleMapsRouteButton>
```

### Als Button (zonder href)
```tsx
<GoogleMapsRouteButton 
  onClick={() => handleCustomAction()}
>
  Route
</GoogleMapsRouteButton>
```

## 🎨 Varianten

### Default (Filled)
```tsx
<GoogleMapsRouteButton variant="default">
  Route
</GoogleMapsRouteButton>
```

### Outline
```tsx
<GoogleMapsRouteButton variant="outline">
  Route
</GoogleMapsRouteButton>
```

## 📏 Groottes

### Small
```tsx
<GoogleMapsRouteButton size="sm">
  Route
</GoogleMapsRouteButton>
```

### Default
```tsx
<GoogleMapsRouteButton size="default">
  Route
</GoogleMapsRouteButton>
```

### Large
```tsx
<GoogleMapsRouteButton size="lg">
  Route
</GoogleMapsRouteButton>
```

## 🎯 Props

| Prop | Type | Default | Beschrijving |
|------|------|---------|--------------|
| `variant` | `'default' \| 'outline'` | `'default'` | Visuele stijl |
| `size` | `'sm' \| 'default' \| 'lg'` | `'default'` | Grootte |
| `href` | `string` | - | Google Maps URL |
| `target` | `string` | `'_blank'` | Link target |
| `rel` | `string` | `'noopener noreferrer'` | Link rel |
| `children` | `ReactNode` | `'Route'` | Button tekst |
| `className` | `string` | - | Extra CSS classes |

## 🎨 CSS Classes

### Basis Klasse
```css
.maps-btn-route {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  min-width: 140px;
  background: #4285f4;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}
```

### Hover State
```css
.maps-btn-route:hover {
  background: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(66, 133, 244, 0.3);
}
```

### Focus State
```css
.maps-btn-route:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3), 0 4px 12px rgba(66, 133, 244, 0.3);
}
```

## 📱 Responsive Design

### Mobile Aanpassingen
```css
@media (max-width: 768px) {
  .maps-btn-route {
    min-width: 120px;
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .maps-btn-route svg {
    width: 14px;
    height: 14px;
  }
}
```

### Touch Device Optimalisaties
```css
@media (hover: none) and (pointer: coarse) {
  .maps-btn-route {
    min-height: 44px; /* Touch target minimum */
  }
  
  .maps-btn-route:hover {
    transform: none; /* Geen hover effect op touch devices */
  }
}
```

## ♿ Toegankelijkheid

### ARIA Labels
- Automatische aria-hidden op SVG icoon
- Semantisch correct HTML (button of anchor)
- Focus states voor keyboard navigation

### Screen Reader Ondersteuning
- Beschrijvende tekst voor locatie icoon
- Duidelijke button labels
- Proper link relaties

### Keyboard Navigation
- Volledig toetsenbord toegankelijk
- Enter en Space key ondersteuning
- Focus indicators

## 🔧 Integratie in SpeeltuinCard

```tsx
// In de SpeeltuinCard component
{speeltuin.latitude && speeltuin.longitude && (
  <GoogleMapsRouteButton 
    href={generateGoogleMapsUrl({
      latitude: speeltuin.latitude,
      longitude: speeltuin.longitude,
      name: speeltuin.naam
    })}
    variant="default"
    size="default"
    className="w-full"
    onClick={(e) => e.stopPropagation()}
  >
    Route
  </GoogleMapsRouteButton>
)}
```

## 🎯 Best Practices

1. **Gebruik altijd de utility functie** voor consistente URLs
2. **Voeg altijd een href toe** voor betere UX
3. **Gebruik beschrijvende tekst** voor screen readers
4. **Test op mobile** voor touch-friendly ervaring
5. **Controleer toegankelijkheid** met screen readers

## 🐛 Troubleshooting

### Button ziet er niet uit zoals verwacht
- Controleer of CSS bestand is geïmporteerd
- Verifieer dat geen conflicterende styles zijn toegevoegd
- Test in verschillende browsers

### Hover effect werkt niet
- Controleer of CSS transitions zijn ingeschakeld
- Test op desktop (hover werkt niet op touch devices)
- Verifieer dat geen JavaScript de hover blokkeert

### Icoon wordt niet getoond
- Controleer of SVG path correct is
- Verifieer dat fill="currentColor" is ingesteld
- Test of icoon grootte correct is (16x16px)

## 📋 Checklist voor Implementatie

- [ ] Component geïmporteerd
- [ ] CSS bestand geladen
- [ ] Utility functie gebruikt voor URL generatie
- [ ] Href prop toegevoegd
- [ ] Target="_blank" ingesteld
- [ ] Rel="noopener noreferrer" toegevoegd
- [ ] Toegankelijkheid getest
- [ ] Mobile responsive getest
- [ ] Hover effecten getest
- [ ] Screen reader compatibiliteit getest 