import { useState, useMemo } from 'react';
import { Strain } from '../types/strain';
import { INITIAL_STRAINS } from '../data/strainsData';

export function useStrains() {
  const [strains] = useState<Strain[]>(INITIAL_STRAINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCannabinoid, setSelectedCannabinoid] = useState<string>('todos');
  const [selectedEffect, setSelectedEffect] = useState<string>('todos');

  const filteredStrains = useMemo(() => {
    return strains.filter((strain) => {
      const matchesSearch = 
        strain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (strain.aromaFlavor && strain.aromaFlavor.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (strain.effects && strain.effects.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()))) ||
        (strain.associations && strain.associations.some(a => a.associationName.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCannabinoid = 
        selectedCannabinoid === 'todos' || 
        strain.dominantCannabinoid === selectedCannabinoid;

      const matchesEffect = 
        selectedEffect === 'todos' || 
        (strain.effects && strain.effects.some(e => e.toLowerCase().includes(selectedEffect.toLowerCase())));

      return matchesSearch && matchesCannabinoid && matchesEffect;
    });
  }, [strains, searchQuery, selectedCannabinoid, selectedEffect]);

  return {
    strains: filteredStrains,
    allStrains: strains,
    searchQuery,
    setSearchQuery,
    selectedCannabinoid,
    setSelectedCannabinoid,
    selectedEffect,
    setSelectedEffect,
    loading: false,
  };
}
