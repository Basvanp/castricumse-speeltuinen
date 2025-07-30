import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeeltuinFilters as FiltersType } from '@/types/speeltuin';

interface SpeeltuinFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

const SpeeltuinFilters: React.FC<SpeeltuinFiltersProps> = ({ filters, onFiltersChange, onApplyFilters, onClearFilters }) => {
  const { trackEvent } = useAnalytics();

  const updateFilter = (
    category: keyof FiltersType,
    key: string,
    value: boolean
  ) => {
    onFiltersChange({
      ...filters,
      [category]: {
        ...filters[category],
        [key]: value,
      },
    });
    
    // Track filter usage
    if (value) {
      trackEvent('filter_used', undefined, { filter_category: category, filter_key: key });
    }
  };

  return (
    <Card className="w-full max-h-[80vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto overscroll-contain touch-pan-y flex-1 min-h-0">
        {/* Geschikt voor leeftijd */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Geschikt voor leeftijd</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.leeftijd).map(([key, value]) => {
              const labels = {
                geschikt_peuters: 'Peuters (0-2 jaar)',
                geschikt_kleuters: 'Kleuters (3-5 jaar)',
                geschikt_kinderen: 'Kinderen (6+ jaar)',
              };
              const icons = {
                geschikt_peuters: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <circle cx="12" cy="8" r="3" fill="#FF6B6B"/>
                    <path d="M16 14v6H8v-6c0-2.2 1.8-4 4-4s4 1.8 4 4z" fill="#FFD93D"/>
                  </svg>
                ),
                geschikt_kleuters: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <circle cx="12" cy="7" r="3" fill="#4ECDC4"/>
                    <path d="M18 15v5H6v-5c0-3.3 2.7-6 6-6s6 2.7 6 6z" fill="#98D8C8"/>
                  </svg>
                ),
                geschikt_kinderen: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <circle cx="12" cy="6" r="3" fill="#95A5A6"/>
                    <path d="M20 16v4H4v-4c0-4.4 3.6-8 8-8s8 3.6 8 8z" fill="#BDC3C7"/>
                  </svg>
                ),
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`leeftijd-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('leeftijd', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`leeftijd-${key}`} className="flex items-center">
                    {icons[key as keyof typeof icons]}
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Voorzieningen */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Voorzieningen</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.voorzieningen).map(([key, value]) => {
              const labels = {
                heeft_glijbaan: 'Glijbaan',
                heeft_schommel: 'Schommel',
                heeft_zandbak: 'Zandbak',
                heeft_klimtoestel: 'Klimtoestel',
                heeft_kabelbaan: 'Kabelbaan',
                heeft_water_pomp: 'Water / pomp',
                heeft_trapveld: 'Panakooi',
                heeft_skatebaan: 'Skatebaan',
                heeft_basketbalveld: 'Basketbalveld',
                heeft_wipwap: 'Wipwap',
                heeft_duikelrek: 'Duikelrek',
              };
              const icons = {
                heeft_glijbaan: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <path d="M4 20 L20 4" stroke="#FF6B6B" strokeWidth="3"/>
                    <rect x="18" y="2" width="4" height="4" fill="#FFD93D"/>
                    <rect x="2" y="18" width="4" height="4" fill="#4ECDC4"/>
                  </svg>
                ),
                heeft_schommel: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="6" y="2" width="2" height="16" fill="#8B4513"/>
                    <rect x="16" y="2" width="2" height="16" fill="#8B4513"/>
                    <rect x="6" y="2" width="12" height="2" fill="#8B4513"/>
                    <rect x="9" y="14" width="6" height="2" rx="1" fill="#FFD93D"/>
                    <path d="M8 4 L12 14" stroke="#333" strokeWidth="1"/>
                    <path d="M16 4 L12 14" stroke="#333" strokeWidth="1"/>
                  </svg>
                ),
                heeft_zandbak: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="4" y="8" width="16" height="12" fill="#F4A460" stroke="#DEB887" strokeWidth="2"/>
                    <circle cx="8" cy="12" r="1" fill="#DAA520"/>
                    <circle cx="12" cy="14" r="1" fill="#DAA520"/>
                    <circle cx="16" cy="12" r="1" fill="#DAA520"/>
                  </svg>
                ),
                heeft_klimtoestel: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="6" y="4" width="2" height="16" fill="#FF6B6B"/>
                    <rect x="16" y="4" width="2" height="16" fill="#FF6B6B"/>
                    <rect x="6" y="8" width="12" height="2" fill="#4ECDC4"/>
                    <rect x="6" y="12" width="12" height="2" fill="#4ECDC4"/>
                    <rect x="6" y="16" width="12" height="2" fill="#4ECDC4"/>
                  </svg>
                ),
                heeft_kabelbaan: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <path d="M2 8 L22 12" stroke="#333" strokeWidth="2"/>
                    <rect x="10" y="10" width="4" height="3" fill="#FFD93D"/>
                    <path d="M10 10 L8 8" stroke="#333" strokeWidth="1"/>
                    <path d="M14 10 L16 8" stroke="#333" strokeWidth="1"/>
                  </svg>
                ),
                heeft_water_pomp: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="10" y="8" width="4" height="12" fill="#4ECDC4"/>
                    <circle cx="12" cy="6" r="2" fill="#2E86AB"/>
                    <path d="M12 2 L12 6" stroke="#2E86AB" strokeWidth="2"/>
                    <circle cx="6" cy="18" r="1" fill="#87CEEB"/>
                    <circle cx="18" cy="16" r="1" fill="#87CEEB"/>
                    <circle cx="8" cy="20" r="0.5" fill="#87CEEB"/>
                  </svg>
                ),
                heeft_trapveld: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="6" y="8" width="12" height="8" stroke="#32CD32" strokeWidth="2" fill="none"/>
                    <rect x="5" y="6" width="2" height="12" fill="#FFF"/>
                    <rect x="17" y="6" width="2" height="12" fill="#FFF"/>
                    <rect x="7" y="14" width="10" height="1" fill="#32CD32"/>
                    <circle cx="12" cy="12" r="1" fill="#FFF"/>
                  </svg>
                ),
                heeft_skatebaan: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <path d="M4 16 Q12 8 20 16" stroke="#666" strokeWidth="2" fill="none"/>
                    <rect x="10" y="14" width="4" height="1" fill="#FFD93D"/>
                    <circle cx="8" cy="15" r="1" fill="#333"/>
                    <circle cx="16" cy="15" r="1" fill="#333"/>
                  </svg>
                ),
                heeft_basketbalveld: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <circle cx="12" cy="16" r="6" stroke="#FF8C00" strokeWidth="2" fill="none"/>
                    <rect x="10" y="4" width="4" height="6" fill="#FF8C00"/>
                    <rect x="8" y="10" width="8" height="1" fill="#FF8C00"/>
                    <path d="M10 10 L10 14 M14 10 L14 14" stroke="#FF8C00" strokeWidth="1"/>
                  </svg>
                ),
                heeft_wipwap: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="11" y="8" width="2" height="8" fill="#8B4513"/>
                    <rect x="6" y="11" width="12" height="2" rx="1" fill="#FFD93D"/>
                    <circle cx="8" cy="10" r="1.5" fill="#FF6B6B"/>
                    <circle cx="16" cy="13" r="1.5" fill="#4ECDC4"/>
                    <rect x="10" y="16" width="4" height="2" fill="#8B4513"/>
                  </svg>
                ),
                heeft_duikelrek: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="4" y="6" width="2" height="12" fill="#FF6B6B"/>
                    <rect x="18" y="6" width="2" height="12" fill="#FF6B6B"/>
                    <rect x="4" y="8" width="16" height="2" fill="#4ECDC4"/>
                    <circle cx="7" cy="11" r="1" fill="#FFD93D"/>
                    <circle cx="10" cy="11" r="1" fill="#FFD93D"/>
                    <circle cx="13" cy="11" r="1" fill="#FFD93D"/>
                    <circle cx="16" cy="11" r="1" fill="#FFD93D"/>
                  </svg>
                ),
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`voorzieningen-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('voorzieningen', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`voorzieningen-${key}`} className="flex items-center">
                    {icons[key as keyof typeof icons]}
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Praktische zaken */}
        <Collapsible defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Praktische zaken</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.praktisch).map(([key, value]) => {
              const labels = {
                heeft_parkeerplaats: 'Parkeerplaats',
                heeft_toilet: 'Toilet',
                is_omheind: 'Omheind',
                heeft_schaduw: 'Schaduw / bomen',
                is_rolstoeltoegankelijk: 'Rolstoeltoegankelijk',
              };
              const icons = {
                heeft_parkeerplaats: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="6" y="8" width="12" height="8" rx="2" fill="#4ECDC4"/>
                    <rect x="8" y="10" width="8" height="4" fill="#FFF"/>
                    <circle cx="9" cy="16" r="1" fill="#333"/>
                    <circle cx="15" cy="16" r="1" fill="#333"/>
                  </svg>
                ),
                heeft_toilet: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="8" y="6" width="8" height="14" rx="1" fill="#E6F3FF"/>
                    <rect x="10" y="8" width="4" height="2" fill="#4ECDC4"/>
                    <circle cx="12" cy="4" r="2" fill="#FF6B6B"/>
                  </svg>
                ),
                is_omheind: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <rect x="4" y="8" width="2" height="8" fill="#8B4513"/>
                    <rect x="8" y="8" width="2" height="8" fill="#8B4513"/>
                    <rect x="12" y="8" width="2" height="8" fill="#8B4513"/>
                    <rect x="16" y="8" width="2" height="8" fill="#8B4513"/>
                    <rect x="20" y="8" width="2" height="8" fill="#8B4513"/>
                  </svg>
                ),
                heeft_schaduw: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <circle cx="12" cy="8" r="4" fill="#32CD32"/>
                    <rect x="11" y="12" width="2" height="8" fill="#8B4513"/>
                    <circle cx="8" cy="6" r="2" fill="#228B22"/>
                    <circle cx="16" cy="10" r="1.5" fill="#228B22"/>
                  </svg>
                ),
                is_rolstoeltoegankelijk: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="w-5 h-5 mr-2">
                    <circle cx="12" cy="12" r="6" stroke="#4ECDC4" strokeWidth="2" fill="none"/>
                    <circle cx="9" cy="7" r="1.5" fill="#4ECDC4"/>
                    <path d="M9 9 L9 13 L11 13" stroke="#4ECDC4" strokeWidth="2" fill="none"/>
                    <circle cx="8" cy="16" r="2" stroke="#4ECDC4" strokeWidth="2" fill="none"/>
                    <circle cx="14" cy="16" r="2" stroke="#4ECDC4" strokeWidth="2" fill="none"/>
                  </svg>
                ),
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`praktisch-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('praktisch', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`praktisch-${key}`} className="flex items-center">
                    {icons[key as keyof typeof icons]}
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Type speeltuin */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Type speeltuin</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.type).map(([key, value]) => {
              const labels = {
                type_natuurspeeltuin: 'Natuurspeeltuin',
                type_buurtspeeltuin: 'Buurtspeeltuin',
                type_schoolplein: 'Schoolplein',
                type_speelbos: 'Speelbos',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`type-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('type', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`type-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Grootte */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Grootte</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.grootte).map(([key, value]) => {
              const labels: { [key: string]: string } = {
                klein: 'Klein (buurt speeltuintje)',
                middel: 'Middel',
                groot: 'Groot (speelpark)',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`grootte-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('grootte', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`grootte-${key}`}>
                    {labels[key] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>

        {/* Ondergrond */}
        <Collapsible>
          <CollapsibleTrigger className="flex w-full items-center justify-between">
            <h3 className="font-medium">Ondergrond</h3>
            <ChevronDown className="h-4 w-4" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 space-y-2">
            {Object.entries(filters.ondergrond).map(([key, value]) => {
              const labels = {
                ondergrond_zand: 'Zand',
                ondergrond_gras: 'Gras',
                ondergrond_rubber: 'Rubber',
                ondergrond_tegels: 'Tegels',
                ondergrond_kunstgras: 'Kunstgras',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ondergrond-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('ondergrond', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`ondergrond-${key}`}>
                    {labels[key as keyof typeof labels] || key}
                  </Label>
                </div>
              );
            })}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
      
      <div className="flex-shrink-0 p-4 border-t border-border bg-card">
        <div className="flex gap-3">
          <Button
            variant="default"
            className="flex-1"
            onClick={onApplyFilters}
          >
            Pas toe
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClearFilters}
          >
            Wis selectie
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SpeeltuinFilters;