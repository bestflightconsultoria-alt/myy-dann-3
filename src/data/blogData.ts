import { BlogPost } from "../types/blog";

export const MOCK_POSTS: BlogPost[] = [
  {
    id: "8",
    slug: "quanto-custa-tratamento-cannabis-medicinal-brasil-precos",
    title: "Quanto Custa o Tratamento com Cannabis Medicinal no Brasil em 2026? Guia Completo de Preços de Flores, Óleos e Consultas",
    excerpt: "Descubra os valores reais de consultas médicas, taxas de associações, preços médios de flores por grama (R$ 35 a R$ 75) e óleos de CBD/THC, além de dicas para economizar até 50% no tratamento.",
    category: "Economia & Preços",
    readTime: "6 min de leitura",
    date: "01 de Setembro de 2026",
    author: "Redação CannaGuia",
    tags: ["Preço Flor Medicinal", "Óleo CBD Preço", "Valor Consulta", "Associações", "Economia", "Transparência"],
    isPinned: true,
    content: `
      <h3>1. Panorama Geral: Quanto Custa o Tratamento no Brasil?</h3>
      <p>Uma das maiores dúvidas de quem deseja iniciar a terapia canabinoide é o <strong>custo real mensal</strong>. Antigamente, o tratamento era restrito a produtos importados que custavam milhares de reais por mês. Hoje, com o avanço das <strong>associações de pacientes brasileiras</strong> e a telemedicina, o tratamento tornou-se muito mais acessível.</p>
      
      <p>Em média, o custo inicial do tratamento divide-se em 3 pilares principais:</p>
      <ul>
        <li><strong>1. Consulta Médica Especializada:</strong> R$ 150 a R$ 600 (paga uma vez no início, com retorno periódico a cada 3 a 6 meses).</li>
        <li><strong>2. Taxa de Filiação à Associação (Anual ou Mensal):</strong> R$ 0 a R$ 50/mês (muitas associações possuem taxa zero ou anuidade simbólica).</li>
        <li><strong>3. Medicamento Mensal (Óleo ou Flores):</strong> R$ 150 a R$ 450/mês, dependendo da dosagem e da via de administração prescrita pelo seu médico.</li>
      </ul>

      <h3>2. Tabela de Preços Médios de Flores Medicinais In Natura (Por Grama)</h3>
      <p>As flores in natura são dispensadas por associações registradas exclusivamente para associados com prescrição médica. Os valores variam conforme o método de cultivo (Indoor, Greenhouse ou Outdoor) e a genética:</p>
      
      <div style="overflow-x: auto; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background: #f0fdf4; border-bottom: 2px solid #10b981; color: #064e3b;">
              <th style="padding: 10px 12px; font-weight: 800;">Tipo de Flor</th>
              <th style="padding: 10px 12px; font-weight: 800;">Método de Cultivo</th>
              <th style="padding: 10px 12px; font-weight: 800;">Preço Médio por Grama</th>
              <th style="padding: 10px 12px; font-weight: 800;">Indicação Comum</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 12px; font-weight: 700; color: #111827;">Flores Ricas em THC (Ex: Gorilla, Mimosa)</td>
              <td style="padding: 10px 12px; color: #4b5563;">Indoor / Greenhouse</td>
              <td style="padding: 10px 12px; font-weight: 800; color: #059669;">R$ 45,00 a R$ 70,00/g</td>
              <td style="padding: 10px 12px; color: #4b5563;">Dor Crônica, Insônia e Enxaqueca</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 12px; font-weight: 700; color: #111827;">Flores Ricas em CBD (Ex: Solodiol, CBD Pure)</td>
              <td style="padding: 10px 12px; color: #4b5563;">Greenhouse / Padronizado</td>
              <td style="padding: 10px 12px; font-weight: 800; color: #059669;">R$ 35,00 a R$ 55,00/g</td>
              <td style="padding: 10px 12px; color: #4b5563;">Ansiedade, Foco e Sem Psicoatividade</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px 12px; font-weight: 700; color: #111827;">Flores Balanceadas 1:1 (THC / CBD)</td>
              <td style="padding: 10px 12px; color: #4b5563;">Indoor Especial</td>
              <td style="padding: 10px 12px; font-weight: 800; color: #059669;">R$ 50,00 a R$ 65,00/g</td>
              <td style="padding: 10px 12px; color: #4b5563;">Espasticidade e Relaxamento Muscular</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="background: #f0fdf4; border: 1.5px solid #10b981; padding: 18px 24px; border-radius: 16px; margin: 24px 0; text-align: center;">
        <p style="color: #064e3b; font-size: 14px; font-weight: 700; margin-bottom: 10px;">🔍 Quer consultar o cardápio completo com preços e avaliações de cada flor?</p>
        <p style="color: #047857; font-size: 13px; margin-bottom: 0;">Navegue pela aba <strong>Catálogo</strong> no menu principal do CannaGuia para comparar os valores atualizados de mais de 95 produtos.</p>
      </div>

      <h3>3. Preços de Óleos Sublinguais (CBD Full Spectrum, Broad Spectrum e Isolado)</h3>
      <p>Os óleos medicinais são a principal porta de entrada do tratamento. Os valores dependem da concentração de miligramas (mg) por frasco de 30ml:</p>
      <ul>
        <li><strong>Óleos Nacionais de Associações (300mg a 1500mg):</strong> R$ 140,00 a R$ 280,00 por frasco (dura de 1 a 2 meses dependendo da posologia).</li>
        <li><strong>Óleos de Alta Concentração (3000mg a 6000mg):</strong> R$ 320,00 a R$ 550,00 por frasco.</li>
        <li><strong>Óleos Importados via Anvisa (RDC 660):</strong> R$ 350,00 a R$ 900,00 por frasco + frete internacional.</li>
        <li><strong>Óleos de Farmácia Convencional (RDC 327):</strong> R$ 250,00 a R$ 800,00 por frasco.</li>
      </ul>

      <h3>4. Como Economizar até 50% no Custo do seu Tratamento?</h3>
      <ol>
        <li><strong>Opte por Associações de Pacientes Brasileiras:</strong> As associações dispensam medicamentos a preço de custo operacional, chegando a ser 60% mais baratos que farmácias e importações.</li>
        <li><strong>Use um Vaporizador de Ervas Secas (Economia de Flor):</strong> Pacientes que vaporizam em vez de queimar na seda economizam até 40% da quantidade de flores, pois a extração térmica aproveita praticamente 100% dos canabinoides.</li>
        <li><strong>Aproveite Descontos da Comunidade:</strong> Na AirVape Brasil, leitores do CannaGuia têm 5% OFF com o cupom <strong>CANNAGUIA</strong>.</li>
        <li><strong>Escolha Médicos com Retorno Incluso:</strong> Ao agendar sua consulta, opte por profissionais que oferecem acompanhamento e titulação de dosagem nos primeiros meses sem custo de consulta avulsa.</li>
      </ol>

      <div style="background: #ffffff; border: 2px solid #059669; padding: 22px; border-radius: 20px; margin: 30px 0; text-align: center; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">
        <h4 style="color: #064e3b; font-size: 18px; font-weight: 900; margin-bottom: 8px;">🩺 Precisa de Consulta Médica para Iniciar?</h4>
        <p style="color: #374151; font-size: 13px; margin-bottom: 16px;">Consulte nosso <strong>Diretório de Prescritores Verificados</strong> e agende diretamente com médicos especialistas em terapia canabinoide.</p>
        <p style="color: #059669; font-weight: 800; font-size: 14px;">Acesse a aba 'Prescritores' no CannaGuia!</p>
      </div>
    `
  },
  {
    id: "1",
    slug: "passo-a-passo-tratamento-cannabis-medicinal-brasil",
    title: "Como Iniciar o Tratamento com Cannabis Medicinal no Brasil: Guia Passo a Passo",
    excerpt: "Entenda os 4 passos obrigatórios para conseguir sua prescrição médica, escolher uma associação e ter acesso legal a flores e óleos.",
    category: "Guia do Paciente",
    readTime: "4 min de leitura",
    date: "15 de Agosto de 2026",
    author: "Redação CannaGuia",
    tags: ["Prescrição Médica", "Associações", "Iniciantes", "Acolhimento"],
    isPinned: false,
    content: `
      <h3>1. Consulta Médica e Prescrição</h3>
      <p>Qualquer médico registrado no CRM (ou odontólogo com CFO) pode prescrever cannabis medicinal no Brasil para qualquer condição em que haja justificativa clínica (como ansiedade, insônia, dor crônica, TDAH, entre outros).</p>
      <p>O médico emitirá uma <strong>receita médica de controle especial</strong> e um <strong>laudo médico com justificativa terapêutica</strong>.</p>

      <h3>2. Escolha da Associação ou Via de Acesso</h3>
      <p>Com o laudo e a receita em mãos, você pode se filiar a uma <strong>associação de pacientes</strong> legalmente constituída (como ABECMed, AdaptaCann, ALCA, Abrapango, etc.).</p>

      <h3>3. Envio de Documentos e Acolhimento</h3>
      <p>A maioria das associações solicita via formulário online ou WhatsApp:</p>
      <ul>
        <li>Documento oficial de identidade (RG ou CNH)</li>
        <li>Comprovante de residência atualizado</li>
        <li>Receita médica válida e laudo médico detalhado</li>
        <li>Termo de filiação/adesão assinado</li>
      </ul>

      <h3>4. Dispensação e Acompanhamento Clínico</h3>
      <p>Após a validação da documentação pelo corpo técnico da entidade, o associado tem acesso ao catálogo interno para dispensação dos produtos prescritos, mantendo sempre o acompanhamento com seu médico assistente.</p>
    `
  },
  {
    id: "5",
    slug: "qual-a-melhor-flor-de-cannabis-para-ansiedade-brasil",
    title: "Qual a Melhor Flor de Cannabis para Ansiedade no Brasil? Guia Comparativo",
    excerpt: "Descubra quais genéticas de cannabis in natura apresentam o melhor perfil de terpenos (como linalol e mirceno) para controle de crises de ansiedade, estresse e pânico.",
    category: "Guia Terapêutico",
    readTime: "6 min de leitura",
    date: "27 de Agosto de 2026",
    author: "Redação CannaGuia",
    tags: ["Ansiedade", "Flores Terapêuticas", "Terpenos Ansiolíticos", "Linalol", "Mirceno"],
    content: `
      <h3>1. Como a Cannabis Atua na Ansiedade e no Estresse?</h3>
      <p>A ansiedade é uma das principais razões pelas quais pacientes buscam tratamento com Cannabis Medicinal no Brasil. Os fitocanabinoides (como o CBD e o THC em proporções adequadas) interagem com os receptores <strong>CB1 e 5-HT1A (serotoninérgicos)</strong> do sistema endocanabinoide, promovendo regulação emocional e descompressão do sistema nervoso central.</p>

      <h3>2. O Papel Crucial dos Terpenos Ansiolíticos</h3>
      <p>Mais do que a porcentagem isolada de THC ou CBD, o efeito modulador na ansiedade é guiado pelos <strong>terpenos aromáticos</strong> presentes na flor:</p>
      <ul>
        <li><strong>Linalol (Aroma Floral/Lavanda):</strong> Conhecido por suas propriedades sedativas, ansiolíticas e moduladoras de estresse.</li>
        <li><strong>Mirceno (Aroma Terroso/Herbal):</strong> Potencializa a permeabilidade da barreira hematoencefálica, proporcionando relaxamento físico e mental profundo.</li>
        <li><strong>Limoneno (Aroma Cítrico):</strong> Estimula a elevação de humor e combate sentimentos de angústia sem provocar sedação excessiva.</li>
        <li><strong>Beta-Cariofileno (Aroma Picante/Amadeirado):</strong> Atua diretamente no receptor CB2 com forte ação anti-inflamatória e anxiolítica.</li>
      </ul>

      <h3>3. Genéticas Mais Recomendadas pela Comunidade no CannaGuia</h3>
      <ol>
        <li><strong>Gorilla Freak / Gorilla Kush:</strong> Predomínio Indica rico em mirceno e cariofileno. Excelente para descompressão noturna da mente agitada.</li>
        <li><strong>24K Gold / Tangie:</strong> Híbridas ricas em limoneno. Ideais para desacelerar pensamentos intrusivos ao longo do dia sem comprometer a clareza.</li>
        <li><strong>Mimosa:</strong> Perfil terpênico vibrante para elevação de humor e alívio do aperto no peito causado pela ansiedade social.</li>
      </ol>

      <h3>4. Qual a Forma Correta de Consumo para Crises de Ansiedade?</h3>
      <p>Para o manejo de crises agudas de ansiedade, a <strong>vaporização de ervas secas</strong> (sem combustão) é o método mais indicado por médicos, pois o início dos efeitos ocorre em apenas 1 a 3 minutos, permitindo ao paciente controlar o momento exato do alívio.</p>
    `
  },
  {
    id: "6",
    slug: "diferenca-entre-thc-cbd-cbn-cbg-na-pratica",
    title: "Diferença entre THC, CBD, CBN e CBG na Prática Terapêutica",
    excerpt: "Conheça as características dos principais fitocanabinoides da planta e entenda qual a função de cada um no alívio de dor, sono, ansiedade e inflamações.",
    category: "Farmacologia Medicinal",
    readTime: "5 min de leitura",
    date: "27 de Agosto de 2026",
    author: "Redação CannaGuia",
    tags: ["CBD", "THC", "CBN", "CBG", "Fitocanabinoides", "Ciência"],
    content: `
      <h3>1. Entendendo os Canabinoides da Planta de Cannabis</h3>
      <p>A planta de cannabis produz mais de 100 compostos ativos conhecidos como fitocanabinoides. Embora o THC e o CBD sejam os mais famosos, canabinoides secundários como o CBN e o CBG vêm revolucionando os tratamentos medicinais no Brasil.</p>

      <h3>2. CBD (Canabidiol) — O Modulador sem Euforia</h3>
      <p>O <strong>CBD</strong> é um composto não intoxicante amplamente prescrito para ansiedade, autismo, epilepsia refratária, dores inflamatórias e proteção neuronal. Ele atua como um modulador alostérico negativo do receptor CB1, amenizando eventuais efeitos psicoativos do THC.</p>

      <h3>3. THC (Tetrahidrocanabinol) — Analgesia e Estímulo de Apetite</h3>
      <p>O <strong>THC</strong> é o principal responsável pelos efeitos analgésicos potentes, relaxamento muscular profundo, estímulo de apetite e controle de náuseas em pacientes neurológicos ou em quimioterapia. Quando administrado em doses terapêuticas corretas, é um dos recursos analgésicos mais eficazes da medicina fitoterápica.</p>

      <h3>4. CBN (Canabinol) — O Canabinoide do Sono Profundo</h3>
      <p>O <strong>CBN</strong> é formado pela degradação natural e oxidação do THC. Possui propriedades sedativas acentuadas, sendo o principal aliado nos óleos medicinais focados em <strong>insônia severa e qualidade do sono repousante</strong>.</p>

      <h3>5. CBG (Canabigerol) — A "Célula-Tronco" da Cannabis</h3>
      <p>O <strong>CBG</strong> é o precursor químico do qual derivam o THC e o CBD. Destaca-se por suas potentes propriedades bactericidas, neuroprotetoras e por combater o glaucoma e inflamações gastrointestinais (como Síndrome do Intestino Irritável).</p>
    `
  },
  {
    id: "7",
    slug: "guia-vaporizadores-ervas-secas-uso-medicinal-brasil",
    title: "Vaporização vs Combustão Medicinal: Por Que Médicos Proíbem Fumar Flores e Indicam Vaporizadores?",
    excerpt: "Entenda a diferença científica entre queimar flores na seda e vaporizar com controle térmico, como preservar 100% dos terpenos e garanta 5% OFF com o cupom CANNAGUIA na AirVape Brasil.",
    category: "Dispositivos & Redução de Danos",
    readTime: "5 min de leitura",
    date: "05 de Setembro de 2026",
    author: "Redação CannaGuia",
    tags: ["Vaporizadores", "AirVape Brasil", "Redução de Danos", "Terpenos", "Cupom CANNAGUIA", "Ciência"],
    content: `
      <h3>1. Por Que Médicos Proíbem Fumar e Exigem o Vaporizador de Ervas Secas?</h3>
      <p>Ao queimar uma flor medicinal de cannabis na seda (combustão), a temperatura na ponta acesa ultrapassa <strong>800°C</strong>. Nessa temperatura extrema, ocorrem dois problemas críticos para o tratamento:</p>
      <ul>
        <li><strong>Destruição de até 50% dos Remédios:</strong> Mais da metade dos canabinoides (CBD/THC) e óleos essenciais (terpenos) são destruídos antes de chegarem ao pulmão.</li>
        <li><strong>Geração de Toxinas Nocivas:</strong> A queima produz alcatrão, monóxido de carbono e substâncias tóxicas que causam irritação nas vias aéreas.</li>
      </ul>
      <p>Por essa razão, os médicos prescritores recomendam exclusivamente o uso de <strong>vaporizadores de ervas secas</strong>. O dispositivo apenas aquece a flor até a temperatura exata de ebulição dos canabinoides (entre 160°C e 210°C), entregando um vapor 100% puro, saboroso e com máxima eficácia terapêutica em apenas 2 minutos.</p>

      <div style="background: #ecfdf5; border: 2px solid #10b981; padding: 24px; border-radius: 20px; margin: 28px 0; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
        <h4 style="color: #064e3b; font-size: 20px; font-weight: 900; margin-bottom: 8px;">🎁 Parceria Exclusiva CannaGuia & AirVape Brasil</h4>
        <p style="color: #047857; font-size: 14px; margin-bottom: 16px; font-weight: 600;">Garanta <strong>5% DE DESCONTO EXCLUSIVO</strong> em qualquer vaporizador oficial da AirVape Brasil com o cupom da nossa comunidade!</p>
        <div style="background: #ffffff; display: inline-block; padding: 10px 24px; border-radius: 12px; font-weight: 900; font-size: 20px; color: #047857; border: 2px dashed #10b981; margin-bottom: 20px;">CUPOM: CANNAGUIA</div>
        <br />
        <a href="https://www.airvapebrasil.com/?utm_source=cannaguia&utm_medium=affiliate&utm_campaign=parceria_cannaguia" target="_blank" rel="noopener noreferrer" style="background: #059669; color: #ffffff; padding: 16px 32px; border-radius: 14px; font-weight: 900; text-decoration: none; display: inline-block; font-size: 16px; box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);">💨 Comprar Meu Vaporizador AirVape com 5% OFF (Clique Aqui) →</a>
      </div>

      <h3>2. Tabela de Temperaturas de Extração de Terpenos</h3>
      <p>Com um vaporizador digital com controle grau a grau, você escolhe exatamente qual efeito deseja extrair da sua flor:</p>
      <ul>
        <li><strong>160°C - 175°C (Baixa Temperatura):</strong> Extrai Pineno e Beta-Cariofileno. Sabor cítrico e fresco muito intenso, foco mental e clareza (ideal para trabalhar durante o dia).</li>
        <li><strong>175°C - 190°C (Média Temperatura):</strong> Extrai Limoneno e Mirceno. Equilíbrio perfeito para alívio imediato da ansiedade, estresse e relaxamento físico.</li>
        <li><strong>190°C - 210°C (Alta Temperatura):</strong> Extrai Linalol e canabinoides mais pesados. Sedação profunda, combate à insônia e alívio de dores crônicas intensas.</li>
      </ul>

      <h3>3. Qual o Melhor Modelo para Iniciantes no Brasil?</h3>
      <p>Para quem está iniciando o tratamento, recomendamos dispositivos com câmara de aquecimento híbrida (cerâmica/aço), fluxo de ar isolado e bateria removível de longa duração (como os modelos da linha AirVape).</p>

      <div style="text-align: center; margin-top: 36px;">
        <a href="https://www.airvapebrasil.com/?utm_source=cannaguia&utm_medium=affiliate&utm_campaign=parceria_cannaguia" target="_blank" rel="noopener noreferrer" style="background: #047857; color: #ffffff; padding: 18px 36px; border-radius: 16px; font-weight: 900; text-decoration: none; display: inline-block; font-size: 17px; box-shadow: 0 6px 16px rgba(4, 120, 87, 0.3);">🔥 Ver Modelos Testados na Loja Oficial AirVape Brasil →</a>
      </div>
    `
  },
  {
    id: "4",
    slug: "como-se-associar-associacao-cannabis-medicinal-brasil",
    title: "Como se Associar a uma Associação de Cannabis Medicinal no Brasil: Guia Completo",
    excerpt: "Entenda os requisitos legais, documentos necessários e o passo a passo para se filiar com segurança a uma associação dispensadora de cannabis medicinal.",
    category: "Guia de Filiação",
    readTime: "4 min de leitura",
    date: "27 de Agosto de 2026",
    author: "Redação CannaGuia",
    tags: ["Associações", "Filiação", "Direitos do Paciente", "Receita Médica", "Acolhimento"],
    content: `
      <h3>1. O Que É uma Associação de Cannabis Medicinal no Brasil?</h3>
      <p>As <strong>associações de pacientes</strong> são entidades civis sem fins lucrativos legalmente respaldadas que apoiam pacientes em tratamento com Cannabis Medicinal. Elas realizam o acolhimento, orientação terapêutica e dispensação de produtos derivados de cannabis (como óleos, extratos e flores in natura) exclusivamente para associados devidamente cadastrados.</p>

      <h3>2. Quais Documentos São Necessários para se Associar?</h3>
      <p>Para realizar a filiação em qualquer associação autorizada no Brasil, você precisará apresentar:</p>
      <ul>
        <li><strong>Documento Oficial com Foto:</strong> RG ou CNH do paciente (ou do responsável legal, caso o paciente seja menor de idade ou incapaz).</li>
        <li><strong>Comprovante de Residência:</strong> Conta recente de água, luz ou telefone.</li>
        <li><strong>Prescrição Médica Válida:</strong> Emitida por médico (CRM) ou cirurgião-dentista (CRO) contendo o nome do paciente, dosagem e tipo de produto.</li>
        <li><strong>Laudo Médico ou Relatório Clínico:</strong> Detalhando a condição diagnóstica (ansiedade, dor crônica, epilepsia, insônia, etc.) e a justificativa terapêutica.</li>
      </ul>

      <h3>3. Passo a Passo do Processo de Filiação</h3>
      <ol>
        <li><strong>Consulta e Prescrição:</strong> Realize uma consulta com um médico ou dentista prescritor habilitado para receber sua receita e laudo.</li>
        <li><strong>Escolha da Associação:</strong> Acesse o diretório do CannaGuia na aba <strong>Associações</strong> e selecione a entidade que possui os produtos e óleos indicados no seu tratamento.</li>
        <li><strong>Envio da Documentação:</strong> Acesse o site oficial da associação escolhida e preencha a ficha de filiação anexando sua receita e documentos.</li>
        <li><strong>Análise do Corpo Técnico:</strong> O departamento jurídico e farmacêutico da entidade valida seus documentos de acordo com o prazo e procedimentos de cada associação.</li>
        <li><strong>Acesso ao Cardápio:</strong> Com o cadastro aprovado, o associado recebe autorização de acesso ao catálogo exclusivo da entidade para solicitar a dispensação dos produtos prescritos.</li>
      </ol>

      <h3>4. Direitos e Suporte ao Associado</h3>
      <p>Ao se filiar, o paciente passa a ter direito ao acolhimento contínuo, suporte farmacêutico para dúvidas sobre dosagem, e apoio em caso de dúvidas sobre transporte ou uso do medicamento.</p>
    `
  },
  {
    id: "3",
    slug: "dentistas-podem-prescrever-cannabis-medicinal-brasil",
    title: "Dentistas Podem Prescrever Cannabis Medicinal? Entenda Quem Pode Prescrever no Brasil",
    excerpt: "Descubra o papel dos Cirurgiões-Dentistas no tratamento de DTM, bruxismo e dor orofacial com fitocanabinoides, e saiba quem são os profissionais habilitados pela lei.",
    category: "Regulamentação & Direitos",
    readTime: "4 min de leitura",
    date: "26 de Agosto de 2026",
    author: "Redação CannaGuia",
    tags: ["Dentistas", "Prescrição Médica", "DTM", "Bruxismo", "Legislação"],
    content: `
      <h3>1. Sim! Cirurgiões-Dentistas Podem Prescrever Cannabis Medicinal</h3>
      <p>Muitos pacientes não sabem, mas no Brasil os <strong>Cirurgiões-Dentistas devidamente registrados no CFO (Conselho Federal de Odontologia)</strong> possuem autorização legal e respaldo regulatório para prescrever produtos e fitocanabinoides à base de Cannabis (CBD e THC).</p>
      
      <p>A amparo legal apoia-se na <strong>Lei Federal nº 5.081/1966</strong> (Art. 6º, II), combinada com a <strong>Nota Técnica CFO-01/2020</strong> e as Resoluções RDC 660/2022 e RDC 327/2019 da Anvisa.</p>

      <h3>2. Em Quais Casos a Odontologia Utiliza a Cannabis Medicinal?</h3>
      <p>Os Cirurgiões-Dentistas prescrevem fitocanabinoides principalmente para condições da região buco-maxilo-facial e manifestações de dor e estresse orofacial:</p>
      <ul>
        <li><strong>DTM (Disfunção Temporomandibular):</strong> Alívio de dores nas articulações da mandíbula e músculos mastigatórios.</li>
        <li><strong>Bruxismo Severo e Apertamento Dental:</strong> Relaxamento muscular e controle da ansiedade noturna que causa o ranger de dentes.</li>
        <li><strong>Neuralgia do Trigêmeo:</strong> Manejo de dores neuropáticas faciais de alta intensidade.</li>
        <li><strong>Analgesia e Anti-inflamatório Pós-Cirúrgico:</strong> Controle da dor e cicatrização pós-procedimentos invasivos.</li>
      </ul>

      <h3>3. Quem Mais Pode Prescrever no Brasil?</h3>
      <ul>
        <li><strong>Médicos (CRM):</strong> Qualquer médico generalista ou especialista com registro ativo no CRM tem autonomia técnica para prescrever fitocanabinoides para qualquer indicação clínica justificável.</li>
        <li><strong>Cirurgiões-Dentistas (CRO):</strong> Habilitados para prescrição em condições no âmbito da odontologia e dor orofacial.</li>
        <li><strong>Médicos Veterinários (CRMV):</strong> Para tratamentos em animais de companhia (como cães e gatos com dor crônica, epilepsia ou ansiedade de separação).</li>
      </ul>

      <h3>4. Como Agendar uma Consulta com Prescritor?</h3>
      <p>No CannaGuia, você encontra o diretório de <strong>Médicos e Odontólogos Prescritores Verificados</strong>. Basta acessar a aba <strong>Médicos Prescritores</strong> no menu principal para encontrar profissionais que atendem presencialmente ou via Telemedicina em todo o Brasil.</p>
    `
  },
  {
    id: "2",
    slug: "vaporizacao-vs-oleo-como-escolher",
    title: "Flores In Natura vs. Óleo Full Spectrum: Qual a Diferença no Tratamento?",
    excerpt: "Inalação rápida ou ingestão prolongada? Compare início de ação, duração e indicações clínicas de cada formato.",
    category: "Uso Medicinal",
    readTime: "5 min de leitura",
    date: "18 de Agosto de 2026",
    author: "Equipe CannaGuia",
    tags: ["Flores", "Óleos", "Vaporização", "Farmacocinética"],
    content: `
      <h3>Via Inalatória (Flores In Natura Vaporizadas)</h3>
      <p>A inalação através de <strong>vaporizadores de ervas secas</strong> (sem combustão) é amplamente utilizada para alívio rápido de crises agudas:</p>
      <ul>
        <li><strong>Início da Ação:</strong> 1 a 3 minutos.</li>
        <li><strong>Duração do Efeito:</strong> 1 a 3 horas.</li>
        <li><strong>Indicações Clínicas:</strong> Crises repentinas de ansiedade, pânico, enxaqueca aguda ou episódios de dor de alta intensidade.</li>
      </ul>

      <h3>Via Oral (Óleos e Extratos Full Spectrum)</h3>
      <p>A ingestão sublingual de óleos medicinais proporciona uma absorção constante e prolongada:</p>
      <ul>
        <li><strong>Início da Ação:</strong> 30 a 90 minutos.</li>
        <li><strong>Duração do Efeito:</strong> 6 a 8 horas.</li>
        <li><strong>Indicações Clínicas:</strong> Manutenção de quadros de insônia, dores crônicas persistentes, espasticidade e controle de rigidez.</li>
      </ul>

      <h3>Associação de Terapias (Uso Combinado)</h3>
      <p>Muitos médicos prescrevem o <strong>uso combinado</strong>: o óleo como tratamento contínuo de fundo ao longo do dia, e a vaporização da flor apenas como resgate para crises agudas de dor ou estresse.</p>
    `
  }
];
