/**
 * scripts/apply-address-and-whatsapp-updates.js
 * Applies:
 * 1. São Luís address update to "Rua dos Lótus, 11 — Jardim Renascença II"
 * 2. São Luís gallery photo 7 removal (recepcao.webp)
 * 3. Synchronization of all 37 unit addresses to the official map/website addresses
 * 4. Guarulhos 2 WhatsApp numbers: (11) 96977-1841 and Ale (11) 99508-3057
 * 5. Borba Gato WhatsApp: (11) 97625-9223
 * 6. Fortaleza dual WhatsApp: Local (85) 99135-0955 + Institutional 0800 602 2828
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const UNITS_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const MANIFEST_FILE = path.join(ROOT_DIR, 'assets', 'images', 'units', 'manifest.json');
const CATALOG_FILE = path.join(ROOT_DIR, 'scripts', 'generate-catalog.js');

const UPDATED_ADDRESSES = {
  'balneario-camboriu': {
    address: 'Rua Peru, 21 — Nações',
    fullAddress: 'Rua Peru, 21 — Nações, Balneário Camboriú — SC'
  },
  'bauru': {
    address: 'Rua Luiz Bleriot, 9-25 — Vila Aviação',
    fullAddress: 'Rua Luiz Bleriot, 9-25 — Vila Aviação, Bauru — SP'
  },
  'belem': {
    address: 'Rua Bernal do Couto, 229 — Umarizal',
    fullAddress: 'Rua Bernal do Couto, 229 — Umarizal, Belém — PA'
  },
  'belo-horizonte': {
    address: 'Av. Raja Gabáglia, 3950 — Estoril (Casa Raja Shopping)',
    fullAddress: 'Av. Raja Gabáglia, 3950 — Estoril (Casa Raja Shopping), Belo Horizonte — MG'
  },
  'blumenau': {
    address: 'Rua Antônio da Veiga, 416 — Victor Konder',
    fullAddress: 'Rua Antônio da Veiga, 416 — Victor Konder, Blumenau — SC'
  },
  'brasilia': {
    address: 'SCS Qd. 08, Bloco B-60, Salas 414 a 418 — Asa Sul',
    fullAddress: 'SCS Qd. 08, Bloco B-60, Salas 414 a 418 — Asa Sul, Brasília — DF'
  },
  'campinas': {
    address: 'Rua Oliveira Cardoso, 126 — Jardim Chapadão',
    fullAddress: 'Rua Oliveira Cardoso, 126 — Jardim Chapadão, Campinas — SP'
  },
  'campo-grande': {
    address: 'Rua Jeribá, 730 — Chácara Cachoeira',
    fullAddress: 'Rua Jeribá, 730 — Chácara Cachoeira, Campo Grande — MS'
  },
  'cuiaba': {
    address: 'Av. Miguel Sutil, 9299 — Duque de Caxias',
    fullAddress: 'Av. Miguel Sutil, 9299 — Duque de Caxias, Cuiabá — MT'
  },
  'curitiba': {
    address: 'Rua João Tschannerl, 880 — Jardim Schaffer',
    fullAddress: 'Rua João Tschannerl, 880 — Jardim Schaffer, Curitiba — PR'
  },
  'dourados': {
    address: 'Rua Ponta Porã, 1540, Sala 4 — Jardim América',
    fullAddress: 'Rua Ponta Porã, 1540, Sala 4 — Jardim América, Dourados — MS'
  },
  'florianopolis': {
    address: 'Rua Pintor Eduardo Dias, 466 — Jardim Atlântico',
    fullAddress: 'Rua Pintor Eduardo Dias, 466 — Jardim Atlântico, Florianópolis — SC'
  },
  'fortaleza': {
    address: 'Av. Santos Dumont, 779 — Centro',
    fullAddress: 'Av. Santos Dumont, 779 — Centro, Fortaleza — CE'
  },
  'goiania': {
    address: 'Av. Ipanema, 684, Sala 01 — Jardim Atlântico (Clínica ABBA)',
    fullAddress: 'Av. Ipanema, 684, Sala 01 — Jardim Atlântico, Goiânia — GO'
  },
  'guarulhos': {
    address: 'Rua Maria de Castro Mesquita, 50 — Jardim São Paulo',
    fullAddress: 'Rua Maria de Castro Mesquita, 50 — Jardim São Paulo, Guarulhos — SP'
  },
  'ipatinga': {
    address: 'Av. Itália, 1910 — Cariru',
    fullAddress: 'Av. Itália, 1910 — Cariru, Ipatinga — MG'
  },
  'joinville': {
    address: 'Rua Henrique Meyer, 340 — Centro (Hotel Tannenhof)',
    fullAddress: 'Rua Henrique Meyer, 340 — Centro, Joinville — SC'
  },
  'londrina': {
    address: 'Rua Piauí, 399 — Centro (Ed. São Paulo Towers)',
    fullAddress: 'Rua Piauí, 399 — Centro, Londrina — PR'
  },
  'luanda': {
    address: 'Município de Belas, Zona Verde II — Benfica',
    fullAddress: 'Município de Belas, Zona Verde II — Benfica, Luanda — Angola'
  },
  'maceio': {
    address: 'Av. Comendador Gustavo Paiva, 2990 — Mangabeiras',
    fullAddress: 'Av. Comendador Gustavo Paiva, 2990 — Mangabeiras, Maceió — AL'
  },
  'parauapebas': {
    address: 'Av. Tupinambá, Qd. 38, Lt. 13 — Parque dos Carajás (Clínica Longevitá)',
    fullAddress: 'Av. Tupinambá, Qd. 38, Lt. 13 — Parque dos Carajás, Parauapebas — PA'
  },
  'porto-alegre': {
    address: 'Rua Alberto Torres, 195 — Cidade Baixa',
    fullAddress: 'Rua Alberto Torres, 195 — Cidade Baixa, Porto Alegre — RS'
  },
  'porto-velho': {
    address: 'Rua Abunã, 1385 — Olaria',
    fullAddress: 'Rua Abunã, 1385 — Olaria, Porto Velho — RO'
  },
  'ribeirao-preto': {
    address: 'Rua Floriano Peixoto, 1602 — Jardim Sumaré',
    fullAddress: 'Rua Floriano Peixoto, 1602 — Jardim Sumaré, Ribeirão Preto — SP'
  },
  'rio-de-janeiro': {
    address: 'Av. Ator José Wilker, 600, Lojas 116 e 117 — Barra da Tijuca',
    fullAddress: 'Av. Ator José Wilker, 600, Lojas 116 e 117 — Barra da Tijuca, Rio de Janeiro — RJ'
  },
  'salvador': {
    address: 'Av. Tancredo Neves, 2227 — Caminho das Árvores',
    fullAddress: 'Av. Tancredo Neves, 2227 — Caminho das Árvores, Salvador — BA'
  },
  'santo-andre': {
    address: 'Av. Industrial, 600, Sala 279 — Jardim (Shopping Grand Plaza)',
    fullAddress: 'Av. Industrial, 600, Sala 279 — Jardim, Santo André — SP'
  },
  'santos': {
    address: 'Av. Ana Costa, 25 — Gonzaga',
    fullAddress: 'Av. Ana Costa, 25 — Gonzaga, Santos — SP'
  },
  'sao-jose-do-rio-preto': {
    address: 'Rua Bernardino de Campos, 3180 — Centro',
    fullAddress: 'Rua Bernardino de Campos, 3180 — Centro, São José do Rio Preto — SP'
  },
  'sao-jose-dos-campos': {
    address: 'Rua Justino Cobra, 25 — Vila Ema',
    fullAddress: 'Rua Justino Cobra, 25 — Vila Ema, São José dos Campos — SP'
  },
  'sao-luis': {
    address: 'Rua dos Lótus, 11 — Jardim Renascença II',
    fullAddress: 'Rua dos Lótus, 11 — Jardim Renascença II, São Luís — MA'
  },
  'sao-paulo-borba-gato': {
    address: 'Av. Adolfo Pinheiro, 2051 — Santo Amaro',
    fullAddress: 'Av. Adolfo Pinheiro, 2051 — Santo Amaro, São Paulo — SP'
  },
  'sao-paulo-vila-mariana': {
    address: 'Rua Vergueiro, 3170 — Vila Mariana',
    fullAddress: 'Rua Vergueiro, 3170 — Vila Mariana, São Paulo — SP'
  },
  'sorocaba': {
    address: 'Rua Gustavo Magalhães, 114 — Jardim Faculdade',
    fullAddress: 'Rua Gustavo Magalhães, 114 — Jardim Faculdade, Sorocaba — SP'
  },
  'teresina': {
    address: 'Av. Universitária, 750, Lojas 74 — Fátima (Ed. Diamond Center)',
    fullAddress: 'Av. Universitária, 750, Lojas 74 — Fátima, Teresina — PI'
  },
  'uberlandia': {
    address: 'Av. Jaime Ribeiro da Luz, 971, Loja 34 — Santa Mônica',
    fullAddress: 'Av. Jaime Ribeiro da Luz, 971, Loja 34 — Santa Mônica, Uberlândia — MG'
  },
  'vitoria': {
    address: 'Rua Eng. Guilherme José Monjardim Varejão, 165 — Enseada do Suá',
    fullAddress: 'Rua Eng. Guilherme José Monjardim Varejão, 165 — Enseada do Suá, Vitória — ES'
  }
};

const data = JSON.parse(fs.readFileSync(UNITS_FILE, 'utf8'));

// 1. Update addresses for all 37 units
data.units.forEach(unit => {
  const updated = UPDATED_ADDRESSES[unit.slug];
  if (updated) {
    unit.address = updated.address;
    unit.fullAddress = updated.fullAddress;
    
    // Update campus banner if present
    const campusSec = (unit.sections || []).find(s => s.id === 'campus');
    if (campusSec) {
      campusSec.bannerSub = updated.fullAddress;
    }
  }
});

// 2. Remove photo 7 (recepcao.webp) from São Luís gallery
const slz = data.units.find(u => u.slug === 'sao-luis');
if (slz && slz.gallery) {
  slz.gallery = slz.gallery.filter(item => !item.src.includes('recepcao.webp'));
}

// Also update manifest.json for sao-luis
if (fs.existsSync(MANIFEST_FILE)) {
  const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  if (manifest['sao-luis'] && manifest['sao-luis'].gallery) {
    manifest['sao-luis'].gallery = manifest['sao-luis'].gallery.filter(item => !item.file.includes('recepcao.webp') && !item.src.includes('recepcao.webp'));
    fs.writeFileSync(MANIFEST_FILE, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
    console.log('Updated manifest.json: removed recepcao.webp from sao-luis');
  }
}

// 3. Update Guarulhos WhatsApps
const gua = data.units.find(u => u.slug === 'guarulhos');
if (gua) {
  gua.whatsapp = '5511969771841';
  gua.whatsappDisplay = '(11) 96977-1841';
  
  let rapido = (gua.sections || []).find(s => s.id === 'acesso_rapido');
  if (!rapido) {
    rapido = { id: 'acesso_rapido', title: 'Acesso Rápido', icon: 'settings', items: [] };
    gua.sections.push(rapido);
  }
  
  const msgGua = encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Guarulhos');
  rapido.items = [
    {
      title: 'Atendimento via WhatsApp',
      desc: 'Fale com nossa equipe • (11) 96977-1841',
      url: `https://api.whatsapp.com/send?phone=5511969771841&text=${msgGua}`,
      icon: 'whatsapp',
      accent: 'green'
    },
    {
      title: 'Atendimento WhatsApp — Alê',
      desc: 'Fale com a Alê • (11) 99508-3057',
      url: `https://api.whatsapp.com/send?phone=5511995083057&text=${msgGua}`,
      icon: 'whatsapp',
      accent: 'green'
    }
  ];
}

// 4. Update Borba Gato WhatsApp
const bg = data.units.find(u => u.slug === 'sao-paulo-borba-gato');
if (bg) {
  bg.whatsapp = '5511976259223';
  bg.whatsappDisplay = '(11) 97625-9223';
  
  let rapido = (bg.sections || []).find(s => s.id === 'acesso_rapido');
  if (!rapido) {
    rapido = { id: 'acesso_rapido', title: 'Acesso Rápido', icon: 'settings', items: [] };
    bg.sections.push(rapido);
  }
  
  const msgBg = encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - São Paulo - Borba Gato');
  rapido.items = [
    {
      title: 'Matricule-se pelo WhatsApp',
      desc: 'Fale com nossa equipe • (11) 97625-9223',
      url: `https://api.whatsapp.com/send?phone=5511976259223&text=${msgBg}`,
      icon: 'whatsapp',
      accent: 'green'
    }
  ];
}

// 5. Update Fortaleza WhatsApp (keeps institutional and adds local)
const forta = data.units.find(u => u.slug === 'fortaleza');
if (forta) {
  forta.whatsapp = '5585991350955';
  forta.whatsappDisplay = '(85) 99135-0955';
  
  let rapido = (forta.sections || []).find(s => s.id === 'acesso_rapido');
  if (!rapido) {
    rapido = { id: 'acesso_rapido', title: 'Acesso Rápido', icon: 'settings', items: [] };
    forta.sections.push(rapido);
  }
  
  const msgForta = encodeURIComponent('Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - Fortaleza');
  rapido.items = [
    {
      title: 'WhatsApp da Unidade Fortaleza',
      desc: 'Atendimento direto com a unidade • (85) 99135-0955',
      url: `https://api.whatsapp.com/send?phone=5585991350955&text=${msgForta}`,
      icon: 'whatsapp',
      accent: 'green'
    },
    {
      title: 'Central de Atendimento Inspirar',
      desc: 'Central de Relacionamento • 0800 602 2828',
      url: `https://api.whatsapp.com/send?phone=558006022828&text=${msgForta}`,
      icon: 'whatsapp',
      accent: 'green'
    }
  ];
}

// Save units.json
fs.writeFileSync(UNITS_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Successfully updated data/units.json with new addresses and WhatsApp contacts!');

// Also update RAW_UNITS in scripts/generate-catalog.js
if (fs.existsSync(CATALOG_FILE)) {
  let catalogSrc = fs.readFileSync(CATALOG_FILE, 'utf8');
  for (const [slug, item] of Object.entries(UPDATED_ADDRESSES)) {
    const slugRegex = new RegExp(`(\\{[^{}]*slug:\\s*['"]${slug}['"][^{}]*address:\\s*['"])([^'"]+)(['"])`);
    if (slugRegex.test(catalogSrc)) {
      catalogSrc = catalogSrc.replace(slugRegex, `$1${item.address}$3`);
    }
  }
  fs.writeFileSync(CATALOG_FILE, catalogSrc, 'utf8');
  console.log('Successfully updated RAW_UNITS addresses in scripts/generate-catalog.js');
}
