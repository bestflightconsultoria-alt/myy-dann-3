import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');
const indexHtmlPath = path.resolve(distDir, 'index.html');

const BASE_URL = 'https://www.cannaguia.com.br';

async function prerender() {
  console.log('Iniciando pre-renderizacao estatica de HTML (SSG SEO)...');

  if (!fs.existsSync(indexHtmlPath)) {
    throw new Error(`Arquivo base ${indexHtmlPath} nao encontrado. Execute 'vite build' primeiro.`);
  }

  const baseHtml = fs.readFileSync(indexHtmlPath, 'utf-8');

  // Inicializa servidor Vite em memoria para carregar os modulos TypeScript de dados
  const vite = await createServer({
    root: rootDir,
    server: { middlewareMode: true }
  });

  let mockPosts = [];
  let initialStrains = [];
  let initialDoctors = [];
  let mockAssociations = [];

  try {
    const blogModule = await vite.ssrLoadModule('/src/data/blogData.ts');
    mockPosts = blogModule.MOCK_POSTS || [];

    const strainsModule = await vite.ssrLoadModule('/src/data/strainsData.ts');
    initialStrains = strainsModule.INITIAL_STRAINS || [];

    const doctorsModule = await vite.ssrLoadModule('/src/data/doctorsData.ts');
    initialDoctors = doctorsModule.INITIAL_DOCTORS || [];

    const associationsModule = await vite.ssrLoadModule('/src/data/associationsData.ts');
    mockAssociations = associationsModule.MOCK_ASSOCIATIONS || [];
  } catch (err) {
    console.error('Erro ao carregar dados TypeScript via Vite:', err);
    await vite.close();
    throw err;
  }

  await vite.close();

  console.log(`Dados carregados: ${mockPosts.length} posts, ${initialStrains.length} strains, ${initialDoctors.length} medicos, ${mockAssociations.length} associacoes.`);

  const pages = [];

  // 1. Paginas Institucionais / Centrais
  pages.push({
    route: '/catalogo-flores',
    title: 'Catalogo de Flores Medicinais de Cannabis no Brasil | CannaGuia',
    description: 'Consulte geneticas de flores de cannabis autorizadas no Brasil por associacoes de pacientes. Perfis de canabinoides (THC/CBD), terpenos e avaliacoes terapeuticas.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Catalogo de Flores de Cannabis Medicinal no Brasil</h1>
          <p>Consulte geneticas terapeuticas de associacoes de pacientes autorizadas, laudos analiticos e perfis de terpenos.</p>
        </header>
        <section>
          <h2>Flores Medicinais em Destaque</h2>
          <ul>
            ${initialStrains.slice(0, 15).map(s => `<li><strong>${s.name}</strong> (${s.type}): ${s.thc || ''} THC / ${s.cbd || ''} CBD. Terpenos: ${s.terpenes?.join(', ') || 'Equilibrado'}.</li>`).join('\n')}
          </ul>
        </section>
      </main>
    `
  });

  pages.push({
    route: '/catalogo-oleos',
    title: 'Catalogo de Oleos de Cannabis Full Spectrum e Isolados | CannaGuia',
    description: 'Compare oleos de cannabis medicinal de associacoes autorizadas no Brasil. Concentracoes de CBD, THC e CBG com controle de qualidade e laudos laboratoriais.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Catalogo de Oleos de Cannabis Medicinal no Brasil</h1>
          <p>Extratos Full Spectrum, Broad Spectrum e Isolados produzidos por associacoes regulamentadas sob a RDC 1015/2026.</p>
        </header>
      </main>
    `
  });

  pages.push({
    route: '/sommelier',
    title: 'Fummelier IA - Recomendador Inteligente de Cannabis Medicinal | CannaGuia',
    description: 'Descubra a genetica ou produto de cannabis ideal para sua patologia atraves de inteligencia artificial especializada em canabinoides, terpenos e fitoterapia.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Fummelier IA - Inteligencia de Recomendacao de Cannabis Medicinal</h1>
          <p>Algoritmo clinico para recomendacao de strains e canabinoides baseado no Sistema Endocanabinoide e perfis terpenicos.</p>
        </header>
      </main>
    `
  });

  pages.push({
    route: '/associacoes',
    title: 'Associacoes de Cannabis Medicinal Autorizadas no Brasil | CannaGuia',
    description: 'Guia completo e diretorio unificado de associacoes de pacientes de cannabis no Brasil. Informacoes de acolhimento, taxas e cardapios solidarios.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Associacoes de Pacientes de Cannabis Medicinal no Brasil</h1>
          <p>Conheca as entidades sem fins lucrativos que operam no modelo de cultivo coletivo solidario amparadas judicialmente e pela Anvisa.</p>
        </header>
        <section>
          <h2>Associacoes Catalogadas</h2>
          <ul>
            ${mockAssociations.map(a => `<li><strong>${a.name}</strong> (${a.city || ''} - ${a.state}): ${a.description || 'Acolhimento de pacientes e dispensacao solidaria.'}</li>`).join('\n')}
          </ul>
        </section>
      </main>
    `
  });

  pages.push({
    route: '/medicos',
    title: 'Medicos Prescritores de Cannabis Medicinal no Brasil | CannaGuia',
    description: 'Encontre medicos e profissionais de saude especialistas em prescricao de cannabis medicinal e telemedicina em todo o Brasil.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Medicos Prescritores de Cannabis Medicinal</h1>
          <p>Profissionais de saude cadastrados para avaliacao de patologias, acompanhamento terapeutico e emissao de laudo e receita.</p>
        </header>
        <section>
          <ul>
            ${initialDoctors.map(d => `<li><strong>${d.name}</strong> (${d.crm}) - ${d.specialties?.join(', ')}</li>`).join('\n')}
          </ul>
        </section>
      </main>
    `
  });

  pages.push({
    route: '/blog',
    title: 'Guia do Paciente e Artigos sobre Cannabis Medicinal | CannaGuia',
    description: 'Artigos educativos, orientacoes regulatorias da Anvisa, guias de associacao e ciencia dos canabinoides para pacientes e medicos.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Guia do Paciente & Blog CannaGuia</h1>
          <p>Artigos aprofundados sobre terapia canabinoide, terpenos, legislacao e reducao de danos.</p>
        </header>
        <section>
          <h2>Artigos Recentes</h2>
          <ul>
            ${mockPosts.map(p => `<li><a href="/blog/${p.slug}"><strong>${p.title}</strong></a> - ${p.excerpt}</li>`).join('\n')}
          </ul>
        </section>
      </main>
    `
  });

  pages.push({
    route: '/faq',
    title: 'Duvidas Frequentes sobre Cannabis Medicinal no Brasil (FAQ) | CannaGuia',
    description: 'Respostas para as principais duvidas sobre legalidade, processo de prescricao medica, filiacao a associacoes e uso terapeutico de cannabis.',
    contentHtml: `
      <main style="max-width: 1200px; margin: 0 auto; padding: 2rem 1rem;">
        <header>
          <h1>Perguntas Frequentes (FAQ) - Cannabis Medicinal no Brasil</h1>
          <p>Tire suas duvidas sobre o tratamento legal com canabinoides no Brasil.</p>
        </header>
      </main>
    `
  });

  // 2. Artigos do Blog (Rotas /blog/:slug)
  for (const post of mockPosts) {
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': ['Article', 'MedicalWebPage'],
      'headline': post.title,
      'description': post.excerpt,
      'image': 'https://www.cannaguia.com.br/logo_cannaguia_transparente.png',
      'author': {
        '@type': 'Person',
        'name': post.author || 'Redacao CannaGuia'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'CannaGuia - Seu Guia de Cannabis Medicinal',
        'logo': {
          '@type': 'ImageObject',
          'url': 'https://www.cannaguia.com.br/logo_cannaguia_transparente.png'
        }
      },
      'datePublished': '2026-09-01',
      'dateModified': '2026-09-22',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/blog/${post.slug}`
      }
    };

    pages.push({
      route: `/blog/${post.slug}`,
      title: `${post.title} | CannaGuia`,
      description: post.excerpt,
      schema: articleSchema,
      contentHtml: `
        <article style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
          <header>
            <span style="font-size: 13px; font-weight: 700; color: #059669;">${post.category || 'Guia Terapeutico'} • ${post.readTime || '5 min'}</span>
            <h1 style="font-size: 2rem; margin: 0.5rem 0 1rem 0;">${post.title}</h1>
            <p style="font-size: 1.1rem; color: #4b5563; line-height: 1.6;">${post.excerpt}</p>
          </header>
          <div style="margin-top: 2rem; line-height: 1.8;">
            ${post.content || ''}
          </div>
        </article>
      `
    });
  }

  // 3. Strains do Catalogo (Rotas /strains/:id)
  for (const strain of initialStrains) {
    const productSchema = {
      '@context': 'https://schema.org',
      '@type': ['Product', 'MedicalWebPage'],
      'name': `${strain.name} - ${strain.category === 'flores' ? 'Flor Medicinal' : 'Oleo de Cannabis'}`,
      'description': strain.description || `Genetica terapeutica ${strain.name}. Perfil: ${strain.thc || ''} THC / ${strain.cbd || ''} CBD. Terpenos: ${strain.terpenes?.join(', ') || 'Equilibrado'}.`,
      'image': 'https://www.cannaguia.com.br/logo_cannaguia_transparente.png',
      'brand': {
        '@type': 'Brand',
        'name': 'CannaGuia Brasil'
      },
      'offers': {
        '@type': 'AggregateOffer',
        'priceCurrency': 'BRL',
        'lowPrice': '45.00',
        'highPrice': '75.00',
        'offerCount': Math.max(strain.associations?.length || 1, 1),
        'availability': 'https://schema.org/InStock',
        'url': `${BASE_URL}/strains/${strain.id}`
      }
    };

    pages.push({
      route: `/strains/${strain.id}`,
      title: `${strain.name} - ${strain.category === 'flores' ? 'Flor Medicinal' : 'Oleo de Cannabis'} | CannaGuia`,
      description: strain.description || `Consulte laudos, perfil terpenico e associacoes autorizadas para ${strain.name} no CannaGuia.`,
      schema: productSchema,
      contentHtml: `
        <article style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
          <header>
            <span style="font-size: 13px; font-weight: 700; color: #059669;">${strain.category === 'flores' ? 'Flor In Natura' : 'Oleo Medicinal'} • ${strain.type || 'Equilibrada'}</span>
            <h1>${strain.name}</h1>
            <p style="color: #4b5563;">${strain.description || ''}</p>
          </header>
          <section style="margin-top: 1.5rem;">
            <h2>Ficha Tecnica e Canabinoides</h2>
            <p><strong>Potencia estimada:</strong> ${strain.thc || ''} THC | ${strain.cbd || ''} CBD</p>
            <p><strong>Terpenos dominantes:</strong> ${strain.terpenes?.join(', ') || 'Equilibrado'}</p>
            <p><strong>Efeitos e indicacoes clinicas:</strong> ${strain.effects?.join(', ') || 'Consulte seu medico prescritor'}</p>
          </section>
        </article>
      `
    });
  }

  // 4. Medicos Prescritores (Rotas /medicos/:id)
  for (const doc of initialDoctors) {
    const docSchema = {
      '@context': 'https://schema.org',
      '@type': ['Physician', 'MedicalBusiness'],
      'name': doc.name,
      'identifier': doc.crm,
      'description': doc.bio,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': doc.city,
        'addressRegion': doc.state,
        'addressCountry': 'BR'
      },
      'url': `${BASE_URL}/medicos/${doc.id}`
    };

    pages.push({
      route: `/medicos/${doc.id}`,
      title: `${doc.name} - Medico Prescritor de Cannabis Medicinal | CannaGuia`,
      description: doc.bio,
      schema: docSchema,
      contentHtml: `
        <article style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
          <header>
            <h1>${doc.name}</h1>
            <p><strong>${doc.crm}</strong> - ${doc.city} / ${doc.state}</p>
          </header>
          <section>
            <p>${doc.bio}</p>
            <h3>Especialidades</h3>
            <ul>
              ${doc.specialties?.map(s => `<li>${s}</li>`).join('') || ''}
            </ul>
          </section>
        </article>
      `
    });
  }

  // 5. Associacoes (Rotas /associacoes/:id)
  for (const assoc of mockAssociations) {
    pages.push({
      route: `/associacoes/${assoc.id}`,
      title: `${assoc.name} - Associacao de Cannabis Medicinal | CannaGuia`,
      description: assoc.description || `Informacoes e cardapio de produtos da associacao ${assoc.name}.`,
      contentHtml: `
        <article style="max-width: 900px; margin: 0 auto; padding: 2rem 1rem;">
          <header>
            <h1>${assoc.name}</h1>
            <p>Localizacao: ${assoc.city || ''} - ${assoc.state || ''}</p>
          </header>
          <section>
            <p>${assoc.description || ''}</p>
          </section>
        </article>
      `
    });
  }

  let generatedCount = 0;

  for (const page of pages) {
    const cleanRoute = page.route.startsWith('/') ? page.route.substring(1) : page.route;
    const targetDir = path.resolve(distDir, cleanRoute);
    const targetFile = path.resolve(targetDir, 'index.html');

    // Cria os diretorios necessarios
    fs.mkdirSync(targetDir, { recursive: true });

    let pageHtml = baseHtml;

    // Substitui o Title
    if (page.title) {
      pageHtml = pageHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`);
    }

    // Substitui o Meta Description
    if (page.description) {
      const cleanDesc = page.description.replace(/"/g, '&quot;');
      if (pageHtml.includes('<meta name="description"')) {
        pageHtml = pageHtml.replace(/<meta name="description" content="[\s\S]*?" \/>/i, `<meta name="description" content="${cleanDesc}" />`);
      } else {
        pageHtml = pageHtml.replace('</head>', `  <meta name="description" content="${cleanDesc}" />\n</head>`);
      }
    }

    // Injeta a Tag Canonica Exata
    const canonicalTag = `<link rel="canonical" href="${BASE_URL}${page.route}" />`;
    if (pageHtml.includes('<link rel="canonical"')) {
      pageHtml = pageHtml.replace(/<link rel="canonical" href="[\s\S]*?" \/>/i, canonicalTag);
    } else {
      pageHtml = pageHtml.replace('</head>', `  ${canonicalTag}\n</head>`);
    }

    // Injeta OpenGraph tags
    const ogTags = `
    <!-- OpenGraph SEO -->
    <meta property="og:title" content="${(page.title || '').replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${(page.description || '').replace(/"/g, '&quot;')}" />
    <meta property="og:url" content="${BASE_URL}${page.route}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="CannaGuia" />
    `;
    pageHtml = pageHtml.replace('</head>', `${ogTags}\n</head>`);

    // Injeta Schema especifico se existir
    if (page.schema) {
      const schemaTag = `\n  <script type="application/ld+json">\n  ${JSON.stringify(page.schema, null, 2)}\n  </script>\n`;
      pageHtml = pageHtml.replace('</head>', `${schemaTag}</head>`);
    }

    // Injeta o Conteudo Textual em <div id="root">
    if (page.contentHtml) {
      pageHtml = pageHtml.replace('<div id="root"></div>', `<div id="root">${page.contentHtml}</div>`);
    }

    fs.writeFileSync(targetFile, pageHtml, 'utf-8');
    generatedCount++;
  }

  console.log(`Concluido! ${generatedCount} arquivos HTML estaticos pre-renderizados gerados em dist/`);
}

prerender().catch(err => {
  console.error('Falha na pre-renderizacao:', err);
  process.exit(1);
});
