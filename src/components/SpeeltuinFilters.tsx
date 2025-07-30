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
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`leeftijd-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('leeftijd', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`leeftijd-${key}`}>
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
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`voorzieningen-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('voorzieningen', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`voorzieningen-${key}`}>
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
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`praktisch-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('praktisch', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`praktisch-${key}`}>
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