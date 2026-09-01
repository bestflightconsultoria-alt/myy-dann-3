import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Association } from '../types/association';
import { MOCK_ASSOCIATIONS } from '../data/associationsData';

export { type Association, type AssociationPriceItem } from '../types/association';
export { MOCK_ASSOCIATIONS } from '../data/associationsData';

function cleanStr(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]/g, '');
}

export function useAssociations() {
  const [associations, setAssociations] = useState<Association[]>(MOCK_ASSOCIATIONS);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function loadStatsFromSupabase() {
      if (!supabase) return;
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('reviews')
          .select('association_id, association_name, rating');

        if (!error && data && data.length > 0) {
          const rawReviews = data;

          setAssociations((prevList) =>
            prevList.map((assoc) => {
              const assocCleanName = cleanStr(assoc.name);
              const assocCleanAcronym = cleanStr(assoc.acronym);
              const assocCleanId = cleanStr(assoc.id.replace(/-[a-z]{2}$/, ''));

              const matched = rawReviews.filter((r: any) => {
                const rName = cleanStr(r.association_name || '');
                const rId = cleanStr(r.association_id || '');

                return (
                  rName.includes(assocCleanName) ||
                  assocCleanName.includes(rName) ||
                  rName.includes(assocCleanAcronym) ||
                  assocCleanAcronym.includes(rName) ||
                  rId.includes(assocCleanId) ||
                  assocCleanId.includes(rId)
                );
              });

              if (matched.length > 0) {
                const total = matched.reduce((acc: number, curr: any) => acc + Number(curr.rating || 5), 0);
                return {
                  ...assoc,
                  rating: Number((total / matched.length).toFixed(1)),
                  reviewCount: matched.length
                };
              }

              return {
                ...assoc,
                rating: 0,
                reviewCount: 0
              };
            })
          );
        }
      } catch (err) {
        console.warn('Usando dados locais de associações:', err);
      } finally {
        setLoading(false);
      }
    }

    loadStatsFromSupabase();
  }, []);

  return { associations, loading };
}
