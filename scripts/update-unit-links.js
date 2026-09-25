/**
 * scripts/update-unit-links.js
 * Updates data/units.json according to user instructions:
 * 1. Deduplicate WhatsApp: keep ONLY the specific WhatsApp sent in the update (Cuiabá, Goiânia, Santo André, São Luís).
 * 2. Set auto-expiration on all Sympla events to exact event start date and time:
 *    - Brasília (I Simpósio de Acupuntura): 05/12/2026 08:00
 *    - São Luís (Pelve Expert): 10/12/2026 18:30
 *    - Vila Mariana (Workshop Estética Íntima): 07/11/2026 09:00
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

const raw = fs.readFileSync(DATA_FILE, 'utf8');
const data = JSON.parse(raw);

// Standard item definitions
const itemAmoFisio = {
  title: "Amo Fisio",
  desc: "O maior evento presencial de Fisioterapia da Inspirar. Confira a programação!",
  tag: "Evento Presencial",
  badge: "Oficial",
  url: "https://amofisio.vercel.app/",
  icon: "heart",
  accent: "purple",
  startDate: "2024-01-01",
  endDate: "2027-12-31"
};

const itemSemiIntensiva = {
  title: "Fisioterapia em Terapia Intensiva",
  desc: "Pós-graduação com certificação e prática clínica avançada",
  tag: "Pós-Graduação",
  badge: "Inscrições Abertas",
  url: "https://faculdadeinspirar.com.br/semi-intensiva/",
  icon: "graduation-cap",
  accent: "coral"
};

const itemCongressoEstetica = {
  title: "Congresso Internacional em Estética",
  desc: "Congresso da Faculdade Inspirar — Inscrições abertas",
  tag: "Congresso",
  badge: "Internacional",
  url: "https://faculdadeinspirar.com.br/congresso-de-estetica/",
  icon: "award",
  accent: "purple",
  startDate: "2024-01-01",
  endDate: "2027-12-31"
};

const itemDermatoInternacional = {
  title: "Dermatofuncional Internacional",
  desc: "Capacitação avançada e prática em Fisioterapia Dermatofuncional",
  tag: "Curso de Extensão",
  badge: "Internacional",
  url: "https://cursoinspirar.com.br/dermatofuncional-internacional/",
  icon: "award",
  accent: "coral"
};

function getInstitutionalItems(unit) {
  const items = [];
  if (unit.website) {
    items.push({
      title: `Site Oficial — ${unit.name}`,
      desc: "Todos os cursos, informações e matrículas",
      url: unit.website,
      icon: "globe",
      accent: ""
    });
  }

  // Only add standard 0800 WhatsApp if unit does NOT have a dedicated custom WhatsApp
  const unitsWithCustomWhatsApp = ['cuiaba', 'goiania', 'sao-luis'];
  if (!unitsWithCustomWhatsApp.includes(unit.slug)) {
    const defaultMsg = unit.whatsappDefaultMessage
      ? encodeURIComponent(unit.whatsappDefaultMessage)
      : encodeURIComponent(`Olá! Tenho interesse nos cursos da Inspirar ${unit.name}`);
    const phone = unit.whatsapp ? unit.whatsapp.replace(/\D/g, '') : '558006022828';
    const displayPhone = unit.whatsappDisplay || '0800 602 2828';

    items.push({
      title: "Matricule-se pelo WhatsApp",
      desc: `Fale com nossa equipe • ${displayPhone}`,
      url: `https://api.whatsapp.com/send?phone=${phone}&text=${defaultMsg}`,
      icon: "whatsapp",
      accent: "green"
    });
  }

  return items;
}

function getCampusBanner(unit) {
  return {
    type: "campus_banner",
    id: "campus",
    bannerTitle: "Conheça a Unidade",
    bannerSub: unit.fullAddress || unit.address || `${unit.name} - ${unit.state}`,
    thumb: unit.coverImage || "assets/images/UNIDADE CWB sem gourmet.png"
  };
}

data.units = data.units.map(unit => {
  const slug = unit.slug;
  const cursos = [];
  const eventos = [];
  const institucionais = getInstitutionalItems(unit);
  const campusBanner = getCampusBanner(unit);

  // Clear any existing whatsappCustomUrl by default
  delete unit.whatsappCustomUrl;

  switch (slug) {
    case 'balneario-camboriu':
      // Balneario: mantenha só os institucionais
      break;

    case 'bauru':
      // Bauru: institucionais, amofisio
      eventos.push(itemAmoFisio);
      break;

    case 'belem':
      // belém: amofisio, https://tr.ee/Yb2RHb61F2, institucionais
      eventos.push(itemAmoFisio);
      institucionais.push({
        title: "Linktree Oficial — Belém",
        desc: "Todos os cursos, eventos e comunicados da Inspirar Belém",
        tag: "Linktree",
        badge: "Oficial",
        url: "https://tr.ee/Yb2RHb61F2",
        icon: "globe",
        accent: ""
      });
      break;

    case 'belo-horizonte':
      // bh: amofisio e institucionais
      eventos.push(itemAmoFisio);
      break;

    case 'blumenau':
      // blumenau: amofisio e institucionais
      eventos.push(itemAmoFisio);
      break;

    case 'brasilia':
      // brasilia: institucionais e simpósio acupuntura (inicia 05/12/2026 às 08:00)
      eventos.push({
        title: "I Simpósio de Acupuntura — Inspirar Brasília",
        desc: "Garanta sua vaga no I Simpósio de Acupuntura da Faculdade Inspirar Brasília",
        tag: "Simpósio",
        badge: "Inscrições",
        url: "https://www.sympla.com.br/evento/i-simposio-de-acupuntura-da-faculdade-inspirar-brasilia/3565985?share_id=copiarlink",
        icon: "calendar",
        accent: "coral",
        startDate: "2026-09-01",
        endDate: "2026-12-05T08:00:00-03:00"
      });
      break;

    case 'campinas':
      // campinas: amofisio, institucionais e https://cursoinspirar.com.br/fisioterapia-vestibular/?...
      cursos.push({
        title: "Fisioterapia Vestibular",
        desc: "Avaliação e tratamento das disfunções vestibulares",
        tag: "Curso de Extensão",
        badge: "Novo",
        url: "https://cursoinspirar.com.br/fisioterapia-vestibular/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaccEPg8deK-5BrzIzDPxqUwdnLPmGw8kLXZQkXNC1och6NoiulA0KLY5hNnVQ_aem_PCcDNCxVijxPrcV-_UTP9Q",
        icon: "activity",
        accent: "coral"
      });
      eventos.push(itemAmoFisio);
      break;

    case 'campo-grande':
      // campo grande : institucionais e amofisio
      eventos.push(itemAmoFisio);
      break;

    case 'cuiaba':
      // cuiaba: amofisio, institucional e WhatsApp único enviado pelo usuário
      eventos.push(itemAmoFisio);
      unit.whatsappCustomUrl = "https://api.whatsapp.com/send/?phone=%2B5565999572156&text&type=phone_number&app_absent=0&utm_source=ig";
      institucionais.push({
        title: "Atendimento via WhatsApp — Cuiabá",
        desc: "Fale diretamente com a equipe da Inspirar Cuiabá",
        tag: "WhatsApp",
        badge: "Online",
        url: "https://api.whatsapp.com/send/?phone=%2B5565999572156&text&type=phone_number&app_absent=0&utm_source=ig",
        icon: "whatsapp",
        accent: "green"
      });
      break;

    case 'curitiba':
      // curitiba: institucionais e copiar desse site: https://linktreecuritiba.vercel.app/
      cursos.push(itemSemiIntensiva);
      cursos.push({
        title: "Fisioterapia Vestibular",
        desc: "Avaliação e tratamento das disfunções vestibulares",
        tag: "Curso de Extensão",
        badge: "Novo",
        url: "https://cursoinspirar.com.br/fisioterapia-vestibular/",
        icon: "activity",
        accent: "coral"
      });
      eventos.push(itemAmoFisio);
      eventos.push(itemCongressoEstetica);
      break;

    case 'dourados':
      // dourados: institucionais
      break;

    case 'florianopolis':
      // florianopolis: institucionais, amofisio, e https://faculdadeinspirar.com.br/semi-intensiva/
      cursos.push(itemSemiIntensiva);
      eventos.push(itemAmoFisio);
      break;

    case 'fortaleza':
      // fortaleza: institucionais, amofisio e https://faculdadeinspirar.com.br/semi-intensiva/
      cursos.push(itemSemiIntensiva);
      eventos.push(itemAmoFisio);
      break;

    case 'goiania':
      // goiania: institucionais , amofisio e WhatsApp único enviado pelo usuário
      eventos.push(itemAmoFisio);
      unit.whatsappCustomUrl = "https://api.whatsapp.com/send/?phone=5562999909917&text&type=phone_number&app_absent=0&utm_source=ig";
      institucionais.push({
        title: "Fale no WhatsApp — Goiânia",
        desc: "Atendimento direto com a equipe de Goiânia",
        tag: "WhatsApp",
        badge: "Online",
        url: "https://api.whatsapp.com/send/?phone=5562999909917&text&type=phone_number&app_absent=0&utm_source=ig",
        icon: "whatsapp",
        accent: "green"
      });
      break;

    case 'guarulhos':
      // guarulhos: institucional, amofisio
      eventos.push(itemAmoFisio);
      break;

    case 'ipatinga':
      // ipatinga: institucional, e https://faculdadeinspirar.com.br/semi-intensiva/
      cursos.push(itemSemiIntensiva);
      break;

    case 'joinville':
      // joiville: institucional
      break;

    case 'londrina':
      // londrina: amofisio, institucional
      eventos.push(itemAmoFisio);
      break;

    case 'luanda':
      // luanda: institucional
      break;

    case 'maceio':
      // maceio: institucional, amofisio
      eventos.push(itemAmoFisio);
      break;

    case 'parauapebas':
      // parauapebas: institucional
      break;

    case 'porto-alegre':
      // porto alegre: institucional e https://faculdadeinspirar.com.br/semi-intensiva/
      cursos.push(itemSemiIntensiva);
      break;

    case 'porto-velho':
      // porto velho: amofisio e institucional
      eventos.push(itemAmoFisio);
      break;

    case 'ribeirao-preto':
      // rbeirao preto: institucional e amofisio
      eventos.push(itemAmoFisio);
      break;

    case 'rio-de-janeiro':
      // rio de janeiro: amofisio, institucional e https://faculdadeinspirar.com.br/semi-intensiva/
      cursos.push(itemSemiIntensiva);
      eventos.push(itemAmoFisio);
      break;

    case 'salvador':
      // salvador: institucional
      break;

    case 'santo-andre':
      // santo andre: institucional (Site + WhatsApp Matricule-se) e Grupo VIP WhatsApp
      institucionais.push({
        title: "Grupo VIP WhatsApp — Santo André",
        desc: "Acesse nosso grupo exclusivo no WhatsApp",
        tag: "Grupo VIP",
        badge: "Exclusivo",
        url: "https://chat.whatsapp.com/FoL3NtlyVanFISrz20muP6?mode=gi_t&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0DMTAwAHBkb2YCc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGnNHIRTMbhHiisZSU1FeX335d48FyQPSe8Nw_IgWKDF0Z44e2yjDx3JRtSKmY_aem_k_59wE_els5hN8giRS88dw",
        icon: "whatsapp",
        accent: "green"
      });
      break;

    case 'santos':
      // santos: institucional
      break;

    case 'sao-jose-do-rio-preto':
      // sao jose do rio preto: institucional
      break;

    case 'sao-jose-dos-campos':
      // sao jose dos campos: amofisio e institucional
      eventos.push(itemAmoFisio);
      break;

    case 'sao-luis':
      // sao luis: amofisio, institucional, whatsapp único e sympla pelve expert (inicia 10/12/2026 às 18:30)
      eventos.push(itemAmoFisio);
      eventos.push({
        title: "Pelve Expert — São Luís do Maranhão",
        desc: "Inscrições abertas para o evento Pelve Expert em São Luís",
        tag: "Evento",
        badge: "Sympla",
        url: "https://www.sympla.com.br/evento/pelve-expert-sao-luis-do-maranhao/3578577?share_id=copiarlink&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAadGoaxKcEBtBo3p15vT13mhFZHRzyTnQ1MsPK3XrG7zLj8prqblFos25wIRKw_aem_5l1tPJLkRK_d6LWXGjU6Ow&utm_id=97760_v0_s00_e0_tv3&referrer=l.instagram.com",
        icon: "calendar",
        accent: "coral",
        startDate: "2026-09-01",
        endDate: "2026-12-10T18:30:00-03:00"
      });
      unit.whatsappCustomUrl = "https://api.whatsapp.com/message/7HAT7265HDZNL1?autoload=1&app_absent=0&utm_source=ig";
      institucionais.push({
        title: "Fale no WhatsApp — São Luís",
        desc: "Atendimento direto pelo WhatsApp da Inspirar São Luís",
        tag: "WhatsApp",
        badge: "Online",
        url: "https://api.whatsapp.com/message/7HAT7265HDZNL1?autoload=1&app_absent=0&utm_source=ig",
        icon: "whatsapp",
        accent: "green"
      });
      break;

    case 'sao-paulo-borba-gato':
      // borbagato: amo fisio, institucional, vestibular e dermatofuncional internacional
      cursos.push({
        title: "Fisioterapia Vestibular",
        desc: "Avaliação e tratamento das disfunções vestibulares",
        tag: "Curso de Extensão",
        badge: "Novo",
        url: "https://cursoinspirar.com.br/fisioterapia-vestibular/",
        icon: "activity",
        accent: "coral"
      });
      cursos.push(itemDermatoInternacional);
      eventos.push(itemAmoFisio);
      break;

    case 'sao-paulo-vila-mariana':
      // vila mariana: amofisio, institucional e workshop sympla (inicia 07/11/2026 às 09:00 BRT)
      eventos.push(itemAmoFisio);
      eventos.push({
        title: "Workshop Estética Íntima Feminina na Fisioterapia Pélvica",
        desc: "Workshop presencial na Inspirar Vila Mariana • Inscrições abertas",
        tag: "Workshop",
        badge: "Sympla",
        url: "https://www.sympla.com.br/evento/workshop-estetica-intima-feminina-na-fisioterapia-pelvica/3590103?share_id=copiarlink%2F&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAcGRvZgJzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAadsjolk_hhPzaursBaOIL7pr4iGbrqYzBJWgTjSlkOJW3Co-PsCeU4L1Y8crA_aem_k2l8iFfmgjWP_yqpXPXV1g&utm_id=97760_v0_s00_e0_tv3&referrer=l.instagram.com&referrer=l.instagram.com",
        icon: "calendar",
        accent: "coral",
        startDate: "2026-09-01",
        endDate: "2026-11-07T09:00:00-03:00"
      });
      break;

    case 'sorocaba':
      // sorocaba: amofisio e institucional
      eventos.push(itemAmoFisio);
      break;

    case 'teresina':
      // teresina: institucionak
      break;

    case 'uberlandia':
      // uberlandia: institucional
      break;

    case 'vitoria':
      // vitoria: institucional , amofisio e https://faculdadeinspirar.com.br/semi-intensiva/
      cursos.push(itemSemiIntensiva);
      eventos.push(itemAmoFisio);
      break;

    default:
      console.warn(`Unidade desconhecida: ${slug}`);
  }

  // Construct cleanly structured sections array
  const sections = [];
  if (cursos.length > 0) {
    sections.push({
      id: "cursos",
      title: "Cursos & Pós-Graduação",
      icon: "graduation-cap",
      items: cursos
    });
  }
  if (eventos.length > 0) {
    sections.push({
      id: "eventos",
      title: "Eventos",
      icon: "calendar",
      items: eventos
    });
  }
  sections.push(campusBanner);
  sections.push({
    id: "acesso_rapido",
    title: "Acesso Rápido",
    icon: "settings",
    items: institucionais
  });

  unit.sections = sections;
  return unit;
});

fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Successfully updated data/units.json with deduplicated WhatsApp and Sympla expirations!');
