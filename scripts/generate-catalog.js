/**
 * scripts/generate-catalog.js
 * Generates the complete 37-unit data/units.json catalog, merging:
 * 1. The exact Curitiba setup
 * 2. Real photos and galleries from assets/images/units/manifest.json
 * 3. The official 37 units list provided by the user
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_FILE = path.join(ROOT_DIR, 'assets', 'images', 'units', 'manifest.json');
const TARGET_FILE = path.join(ROOT_DIR, 'data', 'units.json');

const RAW_UNITS = [
  { name: 'Balneário Camboriú', state: 'SC', stateName: 'Santa Catarina', region: 'Sul', url: 'https://www.inspirar.com.br/sc-balneario-camboriu/', slug: 'balneario-camboriu', address: 'Av. do Estado Dalmo Vieira, 1200 — Pioneiros', instagram: 'https://www.instagram.com/inspirarbalcamboriu/', instagramUser: '@inspirarbalcamboriu' },
  { name: 'Bauru', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-bauru/', slug: 'bauru', address: 'Rua Rio Branco, 20-40 — Altos da Cidade', instagram: 'https://www.instagram.com/inspirarbauru/', instagramUser: '@inspirarbauru' },
  { name: 'Belém', state: 'PA', stateName: 'Pará', region: 'Norte', url: 'https://www.inspirar.com.br/pa-belem/', slug: 'belem', address: 'Av. Gov. José Malcher, 168 — Nazaré', instagram: 'https://www.instagram.com/faculdadeinspirarbelem/', instagramUser: '@faculdadeinspirarbelem' },
  { name: 'Belo Horizonte', state: 'MG', stateName: 'Minas Gerais', region: 'Sudeste', url: 'https://www.inspirar.com.br/mg-belo-horizonte/', slug: 'belo-horizonte', address: 'Av. Afonso Pena, 3111 — Funcionários', instagram: 'https://www.instagram.com/inspirarbelohorizonte/', instagramUser: '@inspirarbelohorizonte' },
  { name: 'Blumenau', state: 'SC', stateName: 'Santa Catarina', region: 'Sul', url: 'https://www.inspirar.com.br/sc-blumenau/', slug: 'blumenau', address: 'Rua 7 de Setembro, 1574 — Centro', instagram: 'https://www.instagram.com/inspirarblumenau/', instagramUser: '@inspirarblumenau' },
  { name: 'Brasília', state: 'DF', stateName: 'Distrito Federal', region: 'Centro-Oeste', url: 'https://www.inspirar.com.br/df-distrito-federal-brasilia/', slug: 'brasilia', address: 'SCRN 702/703 Bloco B — Asa Norte', instagram: 'https://www.instagram.com/faculdadeinspirar/', instagramUser: '@faculdadeinspirar' },
  { name: 'Campinas', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-campinas/', slug: 'campinas', address: 'Av. Barão de Itapura, 2137 — Guanabara', instagram: 'https://www.instagram.com/inspirarcampinas/', instagramUser: '@inspirarcampinas' },
  { name: 'Campo Grande', state: 'MS', stateName: 'Mato Grosso do Sul', region: 'Centro-Oeste', url: 'https://www.inspirar.com.br/ms-campo-grande/', slug: 'campo-grande', address: 'Rua 13 de Maio, 2500 — Centro', instagram: 'https://www.instagram.com/inspirar.campogrande/', instagramUser: '@inspirar.campogrande' },
  { name: 'Cuiabá', state: 'MT', stateName: 'Mato Grosso', region: 'Centro-Oeste', url: 'https://www.inspirar.com.br/mt-cuiaba/', slug: 'cuiaba', address: 'Av. Fernando Corrêa da Costa, 1500 — Poção', instagram: 'https://www.instagram.com/inspirarcuiaba/', instagramUser: '@inspirarcuiaba' },
  { name: 'Curitiba', state: 'PR', stateName: 'Paraná', region: 'Sul', url: 'https://www.inspirar.com.br/pr-curitiba/', slug: 'curitiba', address: 'Rua João Tschannerl, 880 — Jardim Schaffer', instagram: 'https://www.instagram.com/inspirar_curitiba/', instagramUser: '@inspirar_curitiba' },
  { name: 'Dourados', state: 'MS', stateName: 'Mato Grosso do Sul', region: 'Centro-Oeste', url: 'https://www.inspirar.com.br/ms-dourados-3/', slug: 'dourados', address: 'Rua Toshinobu Katayama, 720 — Centro', instagram: 'https://www.instagram.com/inspirardourados/', instagramUser: '@inspirardourados' },
  { name: 'Florianópolis', state: 'SC', stateName: 'Santa Catarina', region: 'Sul', url: 'https://www.inspirar.com.br/sc-florianopolis/', slug: 'florianopolis', address: 'Rua Felipe Schmidt, 515 — Centro', instagram: 'https://www.instagram.com/florianopolisinspirar/', instagramUser: '@florianopolisinspirar' },
  { name: 'Fortaleza', state: 'CE', stateName: 'Ceará', region: 'Nordeste', url: 'https://www.inspirar.com.br/ce-fortaleza-slim/', slug: 'fortaleza', address: 'Av. Santos Dumont, 1200 — Aldeota', instagram: 'https://www.instagram.com/inspirarfortaleza/', instagramUser: '@inspirarfortaleza' },
  { name: 'Goiânia', state: 'GO', stateName: 'Goiás', region: 'Centro-Oeste', url: 'https://www.inspirar.com.br/go-goiania/', slug: 'goiania', address: 'Av. T-9, 150 — Setor Marista', instagram: 'https://www.instagram.com/inspirargoiania/', instagramUser: '@inspirargoiania' },
  { name: 'Guarulhos', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-guarulhos/', slug: 'guarulhos', address: 'Rua Claudino Barbosa, 180 — Macedo', instagram: 'https://www.instagram.com/inspirarguarulhos/', instagramUser: '@inspirarguarulhos' },
  { name: 'Ipatinga', state: 'MG', stateName: 'Minas Gerais', region: 'Sudeste', url: 'https://www.inspirar.com.br/mg-ipatinga/', slug: 'ipatinga', address: 'Rua Belo Horizonte, 450 — Centro', instagram: 'https://www.instagram.com/inspiraripatinga/', instagramUser: '@inspiraripatinga' },
  { name: 'Joinville', state: 'SC', stateName: 'Santa Catarina', region: 'Sul', url: 'https://www.inspirar.com.br/sc-joinville/', slug: 'joinville', address: 'Rua Blumenau, 64 — Centro', instagram: 'https://www.instagram.com/inspirarjoinville/', instagramUser: '@inspirarjoinville' },
  { name: 'Londrina', state: 'PR', stateName: 'Paraná', region: 'Sul', url: 'https://www.inspirar.com.br/pr-londrina/', slug: 'londrina', address: 'Rua Pará, 1550 — Centro', instagram: 'https://www.instagram.com/inspirarlondrina/', instagramUser: '@inspirarlondrina' },
  { name: 'Luanda', state: 'AO', stateName: 'Angola', region: 'Internacional', url: 'https://www.inspirar.com.br/ao-luanda/', slug: 'luanda', address: 'Edifício Kilamba — Luanda, Angola', instagram: 'https://www.instagram.com/faculdadeinspirar/', instagramUser: '@faculdadeinspirar' },
  { name: 'Maceió', state: 'AL', stateName: 'Alagoas', region: 'Nordeste', url: 'https://www.inspirar.com.br/al-maceio-slim/', slug: 'maceio', address: 'Av. Comendador Gustavo Paiva, 2990 — Mangabeiras', instagram: 'https://www.instagram.com/faculdadeinspirar/', instagramUser: '@faculdadeinspirar' },
  { name: 'Parauapebas', state: 'PA', stateName: 'Pará', region: 'Norte', url: 'https://www.inspirar.com.br/pa-parauapebas-slim/', slug: 'parauapebas', address: 'Rua D, 250 — Cidade Nova', instagram: 'https://www.instagram.com/faculdadeinspirar/', instagramUser: '@faculdadeinspirar' },
  { name: 'Porto Alegre', state: 'RS', stateName: 'Rio Grande do Sul', region: 'Sul', url: 'https://www.inspirar.com.br/rs-porto-alegre/', slug: 'porto-alegre', address: 'Av. Cristóvão Colombo, 2140 — Floresta', instagram: 'https://www.instagram.com/inspirarportoalegre/', instagramUser: '@inspirarportoalegre' },
  { name: 'Porto Velho', state: 'RO', stateName: 'Rondônia', region: 'Norte', url: 'https://www.inspirar.com.br/ro-porto-velho/', slug: 'porto-velho', address: 'Av. Gov. Jorge Teixeira, 1800 — Embratel', instagram: 'https://www.instagram.com/inspirarportovelho/', instagramUser: '@inspirarportovelho' },
  { name: 'Ribeirão Preto', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-ribeirao-preto/', slug: 'ribeirao-preto', address: 'Av. Independência, 3840 — Alto da Boa Vista', instagram: 'https://www.instagram.com/inspirar.ribeiraopreto/', instagramUser: '@inspirar.ribeiraopreto' },
  { name: 'Rio de Janeiro', state: 'RJ', stateName: 'Rio de Janeiro', region: 'Sudeste', url: 'https://www.inspirar.com.br/rj-rio-de-janeiro/', slug: 'rio-de-janeiro', address: 'Rua do Ouvidor, 50 — Centro', instagram: 'https://www.instagram.com/inspirar.riodejaneiro/', instagramUser: '@inspirar.riodejaneiro' },
  { name: 'Salvador', state: 'BA', stateName: 'Bahia', region: 'Nordeste', url: 'https://www.inspirar.com.br/ba-salvador-slim/', slug: 'salvador', address: 'Av. Tancredo Neves, 1283 — Caminho das Árvores', instagram: 'https://www.instagram.com/inspirarsalvador/', instagramUser: '@inspirarsalvador' },
  { name: 'Santo André', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-santo-andre-slim/', slug: 'santo-andre', address: 'Rua General Glicério, 350 — Centro', instagram: 'https://www.instagram.com/inspirar_santoandre/', instagramUser: '@inspirar_santoandre' },
  { name: 'Santos', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-sao-paulo-santos/', slug: 'santos', address: 'Av. Ana Costa, 484 — Gonzaga', instagram: 'https://www.instagram.com/inspirar.santos/', instagramUser: '@inspirar.santos' },
  { name: 'São José do Rio Preto', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-sao-jose-do-rio-preto-2/', slug: 'sao-jose-do-rio-preto', address: 'Rua Bernardino de Campos, 3180 — Centro', instagram: 'https://www.instagram.com/inspirarsjrp/', instagramUser: '@inspirarsjrp' },
  { name: 'São José dos Campos', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-sao-jose-dos-campos/', slug: 'sao-jose-dos-campos', address: 'Av. Cassiano Ricardo, 601 — Parque Residencial Aquarius', instagram: 'https://www.instagram.com/inspirarsaojosecampos/', instagramUser: '@inspirarsaojosecampos' },
  { name: 'São Luís', state: 'MA', stateName: 'Maranhão', region: 'Nordeste', url: 'https://www.inspirar.com.br/ma-sao-luis/', slug: 'sao-luis', address: 'Av. dos Holandeses, 10 — Calhau', instagram: 'https://www.instagram.com/faculdadeinspirarsaoluis/', instagramUser: '@faculdadeinspirarsaoluis' },
  { name: 'São Paulo - Borba Gato', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-sao-paulo-borba-gato/', slug: 'sao-paulo-borba-gato', address: 'Rua Américo Brasiliense, 2171 — Chácara Santo Antônio', instagram: 'https://www.instagram.com/inspirarsaopauloborbagato/', instagramUser: '@inspirarsaopauloborbagato' },
  { name: 'São Paulo - Vila Mariana', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-sao-paulo-vila-mariana/', slug: 'sao-paulo-vila-mariana', address: 'Rua Domingos de Morais, 2187 — Vila Mariana', instagram: 'https://www.instagram.com/inspirarsaopaulo/', instagramUser: '@inspirarsaopaulo' },
  { name: 'Sorocaba', state: 'SP', stateName: 'São Paulo', region: 'Sudeste', url: 'https://www.inspirar.com.br/sp-sorocaba/', slug: 'sorocaba', address: 'Av. Barão de Tatuí, 850 — Jardim Vergueiro', instagram: 'https://www.instagram.com/inspirarsorocaba/', instagramUser: '@inspirarsorocaba' },
  { name: 'Teresina', state: 'PI', stateName: 'Piauí', region: 'Nordeste', url: 'https://www.inspirar.com.br/pi-teresina/', slug: 'teresina', address: 'Av. Frei Serafim, 2300 — Centro', instagram: 'https://www.instagram.com/inspirar.teresina/', instagramUser: '@inspirar.teresina' },
  { name: 'Uberlândia', state: 'MG', stateName: 'Minas Gerais', region: 'Sudeste', url: 'https://www.inspirar.com.br/mg-uberlandia/', slug: 'uberlandia', address: 'Av. Rondon Pacheco, 3000 — Santa Maria', instagram: 'https://www.instagram.com/inspiraruberlandia/', instagramUser: '@inspiraruberlandia' },
  { name: 'Vitória', state: 'ES', stateName: 'Espírito Santo', region: 'Sudeste', url: 'https://www.inspirar.com.br/es-vitoria/', slug: 'vitoria', address: 'Av. Nossa Senhora dos Navegantes, 955 — Enseada do Suá', instagram: 'https://www.instagram.com/inspirarvitoria/', instagramUser: '@inspirarvitoria' }
];

function buildCatalog() {
  console.log('--- Generating Expanded 37-Unit Catalog ---');

  let manifest = {};
  if (fs.existsSync(MANIFEST_FILE)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  }

  // Load existing catalog if present to preserve Curitiba custom text
  let existingCatalog = {};
  if (fs.existsSync(TARGET_FILE)) {
    try {
      existingCatalog = JSON.parse(fs.readFileSync(TARGET_FILE, 'utf8'));
    } catch (_) {}
  }

  const existingUnitsMap = new Map();
  if (existingCatalog.units) {
    existingCatalog.units.forEach(u => existingUnitsMap.set(u.slug, u));
  }

  const units = RAW_UNITS.map(raw => {
    const existing = existingUnitsMap.get(raw.slug);
    const photosInfo = manifest[raw.slug];

    // Priority for cover image
    let coverImage = 'assets/images/UNIDADE CWB sem gourmet.png';
    let gallery = [
      { src: 'assets/images/UNIDADE CWB sem gourmet.png', caption: `Unidade ${raw.name}` },
      { src: 'assets/images/UNIDADE CWB sem gourmet 2.png', caption: 'Estrutura Inspirar' },
      { src: 'assets/images/WhatsApp Image 2024-07-24 at 16.50.30.jpeg', caption: 'Área de Convivência' }
    ];

    if (raw.slug === 'curitiba') {
      coverImage = 'assets/images/UNIDADE CWB sem gourmet.png';
      gallery = [
        { src: 'assets/images/UNIDADE CWB sem gourmet.png', caption: 'Fachada' },
        { src: 'assets/images/UNIDADE CWB sem gourmet 2.png', caption: 'Entrada e Estacionamento' },
        { src: 'assets/images/WhatsApp Image 2024-07-24 at 16.50.30.jpeg', caption: 'Área de Convivência' }
      ];
      // Include additional photos if available
      if (photosInfo && photosInfo.gallery) {
        gallery = gallery.concat(photosInfo.gallery.map(g => ({ src: g.src, caption: g.caption })));
      }
    } else if (photosInfo) {
      coverImage = photosInfo.coverImage;
      gallery = photosInfo.gallery.map(g => ({ src: g.src, caption: g.caption }));
    }

    const defaultPhone = '558006022828';
    const defaultPhoneDisplay = '0800 602 2828';

    const unitObj = {
      slug: raw.slug,
      name: raw.name,
      state: raw.state,
      stateName: raw.stateName,
      region: raw.region,
      badge: 'Unidade Oficial',
      bio: existing ? existing.bio : `Referência no ensino da área da Saúde e Pós-graduação. Cursos, especializações e extensão em ${raw.name} (${raw.state}).`,
      address: raw.address,
      fullAddress: existing ? (existing.fullAddress || `${raw.address}, ${raw.name} — ${raw.state}`) : `${raw.address}, ${raw.name} — ${raw.state}`,
      director: existing ? existing.director : `Coordenação Regional Inspirar — ${raw.name}`,
      mapsUrl: existing ? existing.mapsUrl : `https://maps.google.com/?q=Faculdade+Inspirar+${encodeURIComponent(raw.name)}`,
      coverImage,
      logoImage: 'assets/images/Logo branca - horizontal.png',
      whatsapp: existing ? existing.whatsapp : defaultPhone,
      whatsappDisplay: existing ? existing.whatsappDisplay : defaultPhoneDisplay,
      whatsappDefaultMessage: `Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - ${raw.name}`,
      instagram: raw.instagram || (existing ? existing.instagram : 'https://www.instagram.com/faculdadeinspirar/'),
      instagramUser: raw.instagramUser || (existing ? existing.instagramUser : '@faculdadeinspirar'),
      website: raw.url,
      sympla: 'https://www.sympla.com.br/produtor/faculdadeinspirar',
      gallery,
      sections: existing && existing.sections ? existing.sections : [
        {
          id: 'cursos',
          title: 'Cursos & Pós-Graduação',
          icon: 'graduation-cap',
          items: [
            {
              title: 'Fisioterapia em Terapia Intensiva',
              desc: 'Adulto, Pediátrica e Neonatal — formação prática completa',
              tag: 'Pós-Graduação',
              badge: 'Semipresencial',
              url: 'https://faculdadeinspirar.com.br/semi-intensiva/',
              icon: 'activity',
              accent: 'cyan'
            },
            {
              title: 'Estética Avançada e Cosmetologia',
              desc: 'Especialização para profissionais da área da saúde',
              tag: 'Pós-Graduação',
              badge: 'Turmas 2026',
              url: 'https://faculdadeinspirar.com.br/',
              icon: 'award',
              accent: 'orange'
            }
          ]
        },
        {
          id: 'eventos',
          title: 'Eventos',
          icon: 'calendar',
          items: [
            {
              title: 'Amo Fisio',
              desc: 'O maior evento presencial de Fisioterapia da Inspirar. Confira a programação!',
              tag: 'Evento Presencial',
              badge: '',
              url: 'https://amofisio.vercel.app/',
              icon: 'heart',
              accent: 'purple',
              startDate: '2024-01-01',
              endDate: '2027-12-31'
            },
            {
              title: 'Congresso Internacional em Estética',
              desc: 'Congresso da Faculdade Inspirar — Inscrições abertas',
              tag: 'Congresso',
              badge: 'Internacional',
              url: 'https://faculdadeinspirar.com.br/congresso-de-estetica/',
              icon: 'award',
              accent: 'orange',
              startDate: '2024-01-01',
              endDate: '2027-12-31'
            }
          ]
        },
        {
          id: 'campus',
          title: 'Nossa Unidade',
          icon: 'image',
          type: 'campus_banner',
          bannerTitle: `Conheça a Unidade ${raw.name}`,
          bannerSub: `${raw.address}`,
          thumb: gallery.length > 1 ? gallery[1].src : gallery[0].src
        },
        {
          id: 'acesso_rapido',
          title: 'Acesso Rápido',
          icon: 'settings',
          items: [
            {
              title: `Site Oficial — ${raw.name}`,
              desc: 'Todos os cursos, informações e matrículas',
              url: raw.url,
              icon: 'globe',
              accent: ''
            },
            {
              title: 'Matricule-se pelo WhatsApp',
              desc: 'Fale com nossa equipe de consultores',
              url: `https://api.whatsapp.com/send?phone=${defaultPhone}&text=${encodeURIComponent(`Olá! Tenho interesse nos cursos da Inspirar ${raw.name}`)}`,
              icon: 'whatsapp',
              accent: 'green'
            }
          ]
        }
      ]
    };

    return unitObj;
  });

  const fullData = {
    project: {
      name: 'Bio no Link',
      brand: 'Faculdade Inspirar',
      hubTitle: 'Faculdade Inspirar — Bio no Link | Todas as 37 Unidades',
      hubDescription: 'Hub oficial de links da Faculdade Inspirar. Escolha a sua unidade para acessar cursos, eventos, inscrições e atendimento direto.',
      globalSocial: {
        instagram: 'https://www.instagram.com/faculdadeinspirar/',
        website: 'https://www.inspirar.com.br/',
        sympla: 'https://www.sympla.com.br/produtor/faculdadeinspirar',
        portalAluno: 'https://portal.faculdadeinspirar.com.br/',
        whatsappCentral: 'https://api.whatsapp.com/send?phone=558006022828&text=Ol%C3%A1!%20Gostaria%20de%20informa%C3%A7%C3%B5es%20sobre%20a%20Faculdade%20Inspirar'
      }
    },
    units
  };

  fs.writeFileSync(TARGET_FILE, JSON.stringify(fullData, null, 2), 'utf8');
  console.log(`Saved catalog to ${TARGET_FILE} with ${units.length} units.`);
}

buildCatalog();
