import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Baby, User, Users } from 'lucide-react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { SpeeltuinFilters as FiltersType } from '@/types/speeltuin';

interface SpeeltuinFiltersProps {
  filters: FiltersType;
  onFiltersChange: (filters: FiltersType) => void;
  onApplyFilters?: () => void;
  onClearFilters?: () => void;
}

const SpeeltuinFilters: React.FC<SpeeltuinFiltersProps> = ({ 
  filters = {}, 
  onFiltersChange, 
  onApplyFilters, 
  onClearFilters 
}) => {
  const { trackEvent } = useAnalytics();

  const updateFilter = (key: string, value: boolean | string) => {
    const newFilters = {
      ...filters,
      [key]: value,
    };
    onFiltersChange(newFilters);
    
    // Track filter usage
    if (value) {
      trackEvent('filter_used', undefined, { filter_key: key });
    }
  };

  const clearAllFilters = () => {
    onFiltersChange({});
    onClearFilters?.();
  };

  const hasActiveFilters = Object.values(filters).some(value => value === true);
  const activeFilterCount = Object.values(filters).filter(v => v === true || (typeof v === 'string' && v)).length;

  return (
    <Card className="w-full max-h-[80vh] flex flex-col">
      <CardHeader className="flex-shrink-0">
        <CardTitle className="text-lg">Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 overflow-y-auto overscroll-contain touch-pan-y flex-1 min-h-0">
        
        <div className='filter-sections-container space-y-6'>
          
          {/* Voorzieningen */}
          <div className='filter-section'>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className='section-toggle flex justify-between items-center w-full p-3 bg-gray-50 rounded-lg'>
                <span className='font-semibold'>Voorzieningen</span>
                <ChevronDown className='chevron w-5 h-5' />
              </CollapsibleTrigger>
              <CollapsibleContent className='filter-options pl-2 space-y-2'>
                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasGlijbaan"
                    checked={filters.hasGlijbaan || false}
                    onCheckedChange={(checked) => updateFilter('hasGlijbaan', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-teal-100 text-teal-700 px-2 py-1 rounded'>🛝</span>
                  <span>Glijbaan</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasSchommel"
                    checked={filters.hasSchommel || false}
                    onCheckedChange={(checked) => updateFilter('hasSchommel', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-orange-100 text-orange-700 px-2 py-1 rounded'>⚡</span>
                  <span>Schommel</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasZandbak"
                    checked={filters.hasZandbak || false}
                    onCheckedChange={(checked) => updateFilter('hasZandbak', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-yellow-100 text-yellow-700 px-2 py-1 rounded'>🏖️</span>
                  <span>Zandbak</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasKlimtoestel"
                    checked={filters.hasKlimtoestel || false}
                    onCheckedChange={(checked) => updateFilter('hasKlimtoestel', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-blue-100 text-blue-700 px-2 py-1 rounded'>🏗️</span>
                  <span>Klimtoestel</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasKabelbaan"
                    checked={filters.hasKabelbaan || false}
                    onCheckedChange={(checked) => updateFilter('hasKabelbaan', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-purple-100 text-purple-700 px-2 py-1 rounded'>🚡</span>
                  <span>Kabelbaan</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasWaterPomp"
                    checked={filters.hasWaterPomp || false}
                    onCheckedChange={(checked) => updateFilter('hasWaterPomp', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-cyan-100 text-cyan-700 px-2 py-1 rounded'>💧</span>
                  <span>Waterpomp</span>
                </Label>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Type Speeltuin */}
          <div className='filter-section'>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className='section-toggle flex justify-between items-center w-full p-3 bg-gray-50 rounded-lg'>
                <span className='font-semibold'>Type Speeltuin</span>
                <ChevronDown className='chevron w-5 h-5' />
              </CollapsibleTrigger>
              <CollapsibleContent className='filter-options pl-2 space-y-2'>
                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="typeNatuurspeeltuin"
                    checked={filters.isTypeNatuurspeeltuin || false}
                    onCheckedChange={(checked) => updateFilter('isTypeNatuurspeeltuin', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-green-100 text-green-700 px-2 py-1 rounded'>🌳</span>
                  <span>Natuurspeeltuin</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="typeBuurtspeeltuin"
                    checked={filters.isTypeBuurtspeeltuin || false}
                    onCheckedChange={(checked) => updateFilter('isTypeBuurtspeeltuin', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-indigo-100 text-indigo-700 px-2 py-1 rounded'>🏘️</span>
                  <span>Buurtspeeltuin</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="typeSchoolplein"
                    checked={filters.isTypeSchoolplein || false}
                    onCheckedChange={(checked) => updateFilter('isTypeSchoolplein', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-amber-100 text-amber-700 px-2 py-1 rounded'>🎓</span>
                  <span>Schoolplein</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="typeSpeelbos"
                    checked={filters.isTypeSpeelbos || false}
                    onCheckedChange={(checked) => updateFilter('isTypeSpeelbos', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-emerald-100 text-emerald-700 px-2 py-1 rounded'>🌲</span>
                  <span>Speelbos</span>
                </Label>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Praktische Zaken */}
          <div className='filter-section'>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className='section-toggle flex justify-between items-center w-full p-3 bg-gray-50 rounded-lg'>
                <span className='font-semibold'>Praktische Zaken</span>
                <ChevronDown className='chevron w-5 h-5' />
              </CollapsibleTrigger>
              <CollapsibleContent className='filter-options pl-2 space-y-2'>
                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="isRolstoeltoegankelijk"
                    checked={filters.isRolstoeltoegankelijk || false}
                    onCheckedChange={(checked) => updateFilter('isRolstoeltoegankelijk', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-blue-100 text-blue-700 px-2 py-1 rounded'>♿</span>
                  <span>Rolstoeltoegankelijk</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasSchaduw"
                    checked={filters.hasSchaduw || false}
                    onCheckedChange={(checked) => updateFilter('hasSchaduw', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-green-100 text-green-700 px-2 py-1 rounded'>🌳</span>
                  <span>Schaduw</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasParkeerplaats"
                    checked={filters.hasParkeerplaats || false}
                    onCheckedChange={(checked) => updateFilter('hasParkeerplaats', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-gray-100 text-gray-700 px-2 py-1 rounded'>🚗</span>
                  <span>Parkeerplaats</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="hasToilet"
                    checked={filters.hasToilet || false}
                    onCheckedChange={(checked) => updateFilter('hasToilet', checked as boolean)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-pink-100 text-pink-700 px-2 py-1 rounded'>🚻</span>
                  <span>Toilet</span>
                </Label>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Grootte */}
          <div className='filter-section'>
            <Collapsible defaultOpen>
              <CollapsibleTrigger className='section-toggle flex justify-between items-center w-full p-3 bg-gray-50 rounded-lg'>
                <span className='font-semibold'>Grootte</span>
                <ChevronDown className='chevron w-5 h-5' />
              </CollapsibleTrigger>
              <CollapsibleContent className='filter-options pl-2 space-y-2'>
                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="grootteKlein"
                    checked={filters.grootte === 'klein'}
                    onCheckedChange={(checked) => updateFilter('grootte', checked ? 'klein' : undefined)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-lime-100 text-lime-700 px-2 py-1 rounded'>🔸</span>
                  <span>Klein</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="grootteMiddel"
                    checked={filters.grootte === 'middel'}
                    onCheckedChange={(checked) => updateFilter('grootte', checked ? 'middel' : undefined)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-orange-100 text-orange-700 px-2 py-1 rounded'>🔶</span>
                  <span>Middel</span>
                </Label>

                <Label className='checkbox-item flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg'>
                  <Checkbox
                    id="grootteGroot"
                    checked={filters.grootte === 'groot'}
                    onCheckedChange={(checked) => updateFilter('grootte', checked ? 'groot' : undefined)}
                    className="w-5 h-5"
                  />
                  <span className='emoji-badge bg-blue-100 text-blue-700 px-2 py-1 rounded'>🔵</span>
                  <span>Groot</span>
                </Label>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Filter Footer */}
          <div className='filter-footer pt-4 border-t border-gray-200'>
            <div className='text-sm text-gray-600'>
              {activeFilterCount > 0 ? (
                <span>Actieve filters: <span className="font-medium">{activeFilterCount}</span></span>
              ) : (
                <span className='italic'>Geen filters geselecteerd</span>
              )}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 pt-4 border-t">
          {hasActiveFilters && (
            <Button 
              onClick={clearAllFilters}
              variant="outline"
              className="w-full"
            >
              Alle filters wissen
            </Button>
          )}
          
          {onApplyFilters && (
            <Button 
              onClick={onApplyFilters}
              className="w-full"
            >
              Filters toepassen
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SpeeltuinFilters;