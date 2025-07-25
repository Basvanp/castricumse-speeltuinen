import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeeltuinFilters as FiltersType } from '@/types/speeltuin';

interface SpeeltuinFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

const SpeeltuinFilters: React.FC<SpeeltuinFiltersProps> = ({ filters, onFiltersChange }) => {
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
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Leeftijd</h3>
          <div className="space-y-2">
            {Object.entries(filters.leeftijd).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`leeftijd-${key}`}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateFilter('leeftijd', key, checked as boolean)
                  }
                />
                <Label htmlFor={`leeftijd-${key}`} className="capitalize">
                  {key}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Voorzieningen</h3>
          <div className="space-y-2">
            {Object.entries(filters.voorzieningen).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`voorzieningen-${key}`}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateFilter('voorzieningen', key, checked as boolean)
                  }
                />
                <Label htmlFor={`voorzieningen-${key}`} className="capitalize">
                  {key}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Ondergrond</h3>
          <div className="space-y-2">
            {Object.entries(filters.ondergrond).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`ondergrond-${key}`}
                  checked={value}
                  onCheckedChange={(checked) =>
                    updateFilter('ondergrond', key, checked as boolean)
                  }
                />
                <Label htmlFor={`ondergrond-${key}`} className="capitalize">
                  {key}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Grootte</h3>
          <div className="space-y-2">
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
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Overig</h3>
          <div className="space-y-2">
            {Object.entries(filters.overig).map(([key, value]) => {
              const labels: { [key: string]: string } = {
                omheind: 'Omheind',
                schaduw: 'Schaduw',
                rolstoeltoegankelijk: 'Rolstoeltoegankelijk',
                horeca: 'Horeca aanwezig',
                toilet: 'Toilet beschikbaar',
                parkeerplaats: 'Parkeerplaats nabij',
              };
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={`overig-${key}`}
                    checked={value}
                    onCheckedChange={(checked) =>
                      updateFilter('overig', key, checked as boolean)
                    }
                  />
                  <Label htmlFor={`overig-${key}`}>
                    {labels[key] || key}
                  </Label>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinFilters;