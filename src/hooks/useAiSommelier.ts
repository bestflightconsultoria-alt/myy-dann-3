import { useState } from 'react';
import type { Strain } from '../types/strain';

export interface AiRecommendation {
  recommendation: Strain;
  reasoning: string;
}

type AiState = 'idle' | 'searching' | 'done';

interface UseAiSommelierArgs {
  strains: Strain[];
}

const PROFILE_KEYWORDS: Record<string, string[]> = {
  Sono: ['sono', 'dormir', 'relaxar', 'insônia', 'insomnia', 'noite', 'descansar'],
  Estudo: ['estud', 'foco', 'trabalh', 'clareza', 'atenção', 'concentra', 'produtiv', 'tdah'],
  'Dor Crônica': ['dor', 'muscular', 'cólica', 'inflama', 'analgesia', 'cãibra', 'enxaqueca'],
  Ansiedade: ['ansiedad', 'ansioso', 'estresse', 'stress', 'calma', 'trankilo', 'tranquilo', 'pânico'],
  Criatividade: ['criativ', 'arte', 'inspir', 'imagina', 'música', 'escrever'],
};

function matchStrain(prompt: string, strains: Strain[]): Strain | null {
  if (!strains || strains.length === 0) return null;
  const query = prompt.toLowerCase();

  for (const [profile, keywords] of Object.entries(PROFILE_KEYWORDS)) {
    if (keywords.some((k) => query.includes(k))) {
      const match = strains.find((s) => s.usageProfiles?.includes(profile) || s.effects?.some(e => e.toLowerCase().includes(profile.toLowerCase())));
      if (match) return match;
    }
  }

  if (query.includes('cbd') || query.includes('sem euforia') || query.includes('psicoat')) {
    const highCbd = strains.find((s) => {
      const cbdNum = parseFloat(s.cbd?.replace(/[^\d.]/g, '') || '0');
      return !isNaN(cbdNum) && (cbdNum >= 5 || s.dominantCannabinoid === 'CBD');
    });
    if (highCbd) return highCbd;
  }

  return strains[0];
}

function buildReasoning(prompt: string, strain: Strain): string {
  const terpenes = (strain.terpenes || ['Mirceno', 'Cariofileno']).join(' e ');
  const assoc = strain.associations?.[0]?.associationName || 'associações parceiras';
  return `Com base na sua necessidade ("${prompt}"), o Fummelier IA indica a ${strain.name}. Seu perfil rico em ${terpenes} e proporção de fitocanabinoides (${strain.thc || 'THC'} / ${strain.cbd || 'CBD'}) atua diretamente nos receptores do sistema endocanabinoide para essa finalidade clínica. Disponível em ${assoc}.`;
}

export function useAiSommelier({ strains }: UseAiSommelierArgs) {
  const [prompt, setPrompt] = useState('');
  const [state, setState] = useState<AiState>('idle');
  const [response, setResponse] = useState<AiRecommendation | null>(null);

  function ask(input: string) {
    const trimmed = input.trim();
    if (!trimmed || !strains || strains.length === 0) return;

    setPrompt(trimmed);
    setState('searching');
    setResponse(null);

    setTimeout(() => {
      const matched = matchStrain(trimmed, strains);
      if (!matched) {
        setState('idle');
        return;
      }
      setResponse({
        recommendation: matched,
        reasoning: buildReasoning(trimmed, matched),
      });
      setState('done');
    }, 600);
  }

  function reset() {
    setState('idle');
    setResponse(null);
    setPrompt('');
  }

  return { prompt, state, response, ask, setPrompt, reset };
}
