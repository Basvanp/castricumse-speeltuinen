import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { SpeeltuinFilters as FiltersType } from '@/types/speeltuin';

interface SpeeltuinFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
}

const SpeeltuinFilters: React.FC<SpeeltuinFiltersProps> = ({ filters, onFiltersChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  
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
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <CollapsibleTrigger className="flex items-center justify-between w-full hover:bg-accent/50 rounded-md p-2 -m-2 transition-colors">
            <CardTitle className="text-lg">Filters</CardTitle>
            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
          </CollapsibleTrigger>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="space-y-6 pt-0">
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
          <h3 className="font-medium mb-3">Overig</h3>
          <div className="space-y-2">
            {Object.entries(filters.overig).map(([key, value]) => {
              const labels: { [key: string]: string } = {
                omheind: 'Omheind',
                schaduw: 'Schaduw',
                rolstoeltoegankelijk: 'Rolstoeltoegankelijk',
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default SpeeltuinFilters;