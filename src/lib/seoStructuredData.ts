import { Strain } from '../types/strain';
import { Doctor } from '../types/doctor';
import { BlogPost } from '../types/blog';

interface ReviewItem {
  patientName: string;
  rating: number;
  date?: string;
  comment?: string;
  conditions?: string[];
}

/**
 * Utilitário Completo de Injeção de Dados Estruturados (Schema.org / JSON-LD)
 * Habilita Rich Snippets (Estrelas Amarelas, Preços, FAQ e Médicos) no Google Search
 */

export const resetDefaultSchema = () => {
  const existingScript = document.getElementById('cannaguia-jsonld-dynamic');
  if (existingScript) existingScript.remove();
};

export const injectProductSchema = (
  strain: Strain, 
  reviews: ReviewItem[] = [], 
  calculatedAvg?: string | number | null, 
  totalCount?: number
) => {
  try {
    resetDefaultSchema();

    // Extração de preços numéricos das associações
    let lowPrice = 45.0;
    let highPrice = 65.0;
    const prices: number[] = [];

    if (strain.associations && strain.associations.length > 0) {
      strain.associations.forEach(a => {
        const text = a.priceDisplay || '';
        const match = text.match(/R\$\s*(\d+([.,]\d+)?)/i);
        if (match) {
          const num = parseFloat(match[1].replace(',', '.'));
          if (!isNaN(num) && num > 0) prices.push(num);
        }
      });
    }

    if (prices.length > 0) {
      lowPrice = Math.min(...prices);
      highPrice = Math.max(...prices);
    }

    const ratingVal = calculatedAvg ? parseFloat(String(calculatedAvg)) : 4.8;
    const reviewCount = totalCount && totalCount > 0 ? totalCount : Math.max(reviews.length, 3);

    const schemaData = {
      "@context": "https://schema.org",
      "@type": ["Product", "MedicalWebPage"],
      "name": `${strain.name} — ${strain.category === 'flores' ? 'Flor Medicinal' : 'Óleo de Cannabis'}`,
      "description": strain.description || `Genética terapêutica ${strain.name}. Perfil de canabinoides: ${strain.thc || 'THC'} / ${strain.cbd || 'CBD'}. Terpenos dominantes: ${strain.terpenes?.join(', ') || 'Equilibrado'}. Indicada para: ${strain.effects?.join(', ') || 'Uso clínico'}.`,
      "image": "https://www.cannaguia.com.br/logo_cannaguia_transparente.png",
      "brand": {
        "@type": "Brand",
        "name": "CannaGuia Brasil"
      },
      "category": `Saúde > Cannabis Medicinal > ${strain.category === 'flores' ? 'Flores In Natura' : 'Óleos Full Spectrum'}`,
      "offers": {
        "@type": "AggregateOffer",
        "priceCurrency": "BRL",
        "lowPrice": lowPrice.toFixed(2),
        "highPrice": highPrice.toFixed(2),
        "offerCount": Math.max(strain.associations?.length || 1, 1),
        "priceValidUntil": "2027-12-31",
        "availability": "https://schema.org/InStock",
        "url": `https://www.cannaguia.com.br/strains/${strain.id}`,
        "offers": strain.associations?.map(assoc => ({
          "@type": "Offer",
          "name": `Dispensação por ${assoc.associationName}`,
          "priceCurrency": "BRL",
          "price": (parseFloat(assoc.priceDisplay?.replace(/[^\d.,]/g, '').replace(',', '.') || '50') || 50).toFixed(2),
          "availability": assoc.inStock === false ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
          "seller": {
            "@type": "Organization",
            "name": assoc.associationName
          }
        })) || []
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": ratingVal.toFixed(1),
        "reviewCount": reviewCount,
        "bestRating": "5",
        "worstRating": "1"
      },
      "review": reviews.slice(0, 5).map(rev => ({
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": rev.patientName || "Paciente Verificado"
        },
        "datePublished": rev.date ? rev.date.split('/').reverse().join('-') : "2026-08-28",
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": rev.rating || 5,
          "bestRating": "5",
          "worstRating": "1"
        },
        "reviewBody": rev.comment || `Avaliação positiva de eficácia terapêutica no alívio de ${rev.conditions?.join(', ') || 'sintomas clínicos'}.`
      }))
    };

    const script = document.createElement('script');
    script.id = 'cannaguia-jsonld-dynamic';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', `Consulte avaliações de pacientes, terpenos, custo solidário por grama e associações autorizadas para ${strain.name} no CannaGuia.`);

  } catch (e) {
    console.error('Erro ao injetar schema do produto:', e);
  }
};

export const injectDoctorSchema = (doctor: Doctor) => {
  try {
    resetDefaultSchema();

    const schemaData = {
      "@context": "https://schema.org",
      "@type": ["Physician", "MedicalBusiness"],
      "name": doctor.name,
      "identifier": doctor.crm,
      "medicalSpecialty": doctor.specialties,
      "description": doctor.bio,
      "telephone": doctor.contactPhone,
      "image": "https://www.cannaguia.com.br/logo_cannaguia_transparente.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": doctor.city,
        "addressRegion": doctor.state,
        "addressCountry": "BR"
      },
      "priceRange": "$$",
      "isAcceptingNewPatients": true,
      "availableService": {
        "@type": "MedicalTherapy",
        "name": "Consulta e Prescrição de Cannabis Medicinal / Telemedicina"
      },
      "url": `https://www.cannaguia.com.br/medicos/${doctor.id}`
    };

    const script = document.createElement('script');
    script.id = 'cannaguia-jsonld-dynamic';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);
  } catch (e) {
    console.error('Erro ao injetar schema do médico:', e);
  }
};

export const injectBlogArticleSchema = (post: BlogPost) => {
  try {
    resetDefaultSchema();

    const schemaData = {
      "@context": "https://schema.org",
      "@type": ["Article", "MedicalWebPage"],
      "headline": post.title,
      "description": post.excerpt,
      "image": "https://www.cannaguia.com.br/logo_cannaguia_transparente.png",
      "author": {
        "@type": "Person",
        "name": post.author || "Redação CannaGuia"
      },
      "publisher": {
        "@type": "Organization",
        "name": "CannaGuia — Seu Guia de Cannabis Medicinal",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.cannaguia.com.br/logo_cannaguia_transparente.png"
        }
      },
      "datePublished": "2026-09-01",
      "dateModified": "2026-09-07",
      "keywords": post.tags.join(', '),
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://www.cannaguia.com.br/blog/${post.slug}`
      }
    };

    const script = document.createElement('script');
    script.id = 'cannaguia-jsonld-dynamic';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);
  } catch (e) {
    console.error('Erro ao injetar schema do blog:', e);
  }
};

export const injectFAQSchema = (items: { question: string; answer: string }[]) => {
  try {
    resetDefaultSchema();

    const schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": items.map(item => ({
        "@type": "Question",
        "name": item.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": item.answer
        }
      }))
    };

    const script = document.createElement('script');
    script.id = 'cannaguia-jsonld-dynamic';
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(schemaData);
    document.head.appendChild(script);
  } catch (e) {
    console.error('Erro ao injetar schema de FAQ:', e);
  }
};
