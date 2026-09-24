/**
 * scripts/build-v2.js
 * Static site generator for Version 2 (Impeccable Craft Edition).
 * Generates:
 * 1. v2/index.html (Central Hub v2 with scroll mask, a11y improvements, and 44px touch targets)
 * 2. v2/[slug]/index.html for all 37 units (with WebP imagery, semantic H2s, calm status, accessible modal)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');
const V2_DIR = path.join(ROOT_DIR, 'v2');

if (!fs.existsSync(V2_DIR)) {
  fs.mkdirSync(V2_DIR, { recursive: true });
}

const rawData = fs.readFileSync(DATA_FILE, 'utf8');
const data = JSON.parse(rawData);

const TODAY = new Date().toISOString().split('T')[0];

const ICONS = {
  verified: `<svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 1l3.09 3.26L19 3.27l.71 4.03 3.29 2.7-2 3.57.56 4.07L17.5 19.7 14.91 23 12 21.18 9.09 23 6.5 19.7l-4.06-2.06.56-4.07-2-3.57L4.29 7.3 5 3.27l3.91.99L12 1z"/><path fill="#080B10" d="M10 15.5l-3.5-3.5 1.41-1.41L10 12.67l5.59-5.58L17 8.5l-7 7z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  photos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>`,
  graduationCap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`
};

function getIconSvg(name) {
  switch (name) {
    case 'graduation-cap': return ICONS.graduationCap;
    case 'calendar': return ICONS.calendar;
    case 'activity': return ICONS.activity;
    case 'clock': return ICONS.clock;
    case 'heart': return ICONS.heart;
    case 'award': return ICONS.award;
    case 'settings': return ICONS.settings;
    case 'globe': return ICONS.globe;
    case 'whatsapp': return ICONS.whatsapp;
    case 'instagram': return ICONS.instagram;
    case 'youtube': return ICONS.youtube;
    case 'image': return ICONS.photos;
    default: return ICONS.arrowRight;
  }
}

function cleanSubtext(desc) {
  if (!desc) return '';
  // Variar em-dashes para cadência natural e menos repetitiva
  return desc.replace(/\s*—\s*/g, ' • ');
}

function isEventActive(item, referenceDate = TODAY) {
  if (item.startDate && item.startDate > referenceDate) return false;
  if (item.endDate && item.endDate < referenceDate) return false;
  return true;
}

/**
 * Builds Unit HTML for Version 2
 */
function generateUnitHtmlV2(unit, data) {
  const relativeRoot = '../..';
  const cssPath = `${relativeRoot}/assets/css/style-v2.css`;
  const logoPath = `${relativeRoot}/${unit.logoImage || 'assets/images/Logo branca - horizontal.png'}`;
  const faviconPath = `${relativeRoot}/assets/images/favicon.png`;
  
  // Use optimized WebP cover for Curitiba, fallback to unit cover
  let coverPath = `${relativeRoot}/${unit.coverImage || 'assets/images/UNIDADE CWB sem gourmet.png'}`;
  if (unit.slug === 'curitiba' && fs.existsSync(path.join(ROOT_DIR, 'assets', 'images', 'webp', 'unidade-cwb-cover.webp'))) {
    coverPath = `${relativeRoot}/assets/images/webp/unidade-cwb-cover.webp`;
  }

  const v1Url = `../../${unit.slug}/index.html`;
  const v2HubUrl = `../index.html`;

  // Gallery items with WebP support when available
  let galleryItems = (unit.gallery && unit.gallery.length > 0)
    ? unit.gallery.map(g => {
        let src = g.src.startsWith('http') ? g.src : `${relativeRoot}/${g.src}`;
        if (unit.slug === 'curitiba') {
          if (g.src.includes('UNIDADE CWB sem gourmet.png')) src = `${relativeRoot}/assets/images/webp/unidade-cwb-cover.webp`;
          if (g.src.includes('UNIDADE CWB sem gourmet 2.png')) src = `${relativeRoot}/assets/images/webp/unidade-cwb-cover-2.webp`;
          if (g.src.includes('WhatsApp Image 2024-07-24')) src = `${relativeRoot}/assets/images/webp/cwb-area-convivencia.webp`;
          if (g.src.includes('biblioteca.jpeg')) src = `${relativeRoot}/assets/images/webp/cwb-biblioteca.webp`;
          if (g.src.includes('sala-de-aula-2.jpeg')) src = `${relativeRoot}/assets/images/webp/cwb-sala-de-aula-2.webp`;
        }
        return { src, caption: g.caption };
      })
    : [{ src: coverPath, caption: `Fachada ${unit.name}` }];

  let streamItemsHtml = '';
  if (Array.isArray(unit.sections)) {
    unit.sections.forEach(sec => {
      if (sec.type === 'campus_banner') {
        const thumbPath = sec.thumb.startsWith('http') ? sec.thumb : `${relativeRoot}/${sec.thumb}`;
        streamItemsHtml += `
      <!-- Conheça a Unidade / Tour de Fotos -->
      <div role="button" tabindex="0" onclick="openGallery()" onkeydown="if(event.key==='Enter'||event.key===' ')openGallery()" class="link-card accent-cyan" style="cursor: pointer;" title="Abrir fotos da unidade ${unit.name}" aria-label="Abrir galeria de fotos da unidade ${unit.name}">
        <div class="link-icon-box campus-thumb-icon">
          <img src="${thumbPath}" alt="${sec.bannerTitle}" loading="lazy">
        </div>
        <div class="link-details">
          <div class="link-tag-row">
            <span class="link-tag">Nossa Estrutura</span>
            <span class="link-badge-pill">Fotos da Unidade</span>
          </div>
          <h3 class="link-title">${sec.bannerTitle}</h3>
          <p class="link-desc">${cleanSubtext(sec.bannerSub)} • Clique para ver fotos</p>
        </div>
        <span class="link-action-indicator">
          ${ICONS.photos}
        </span>
      </div>`;
        return;
      }

      const activeItems = (sec.items || []).filter(item => {
        if (sec.id === 'eventos') return isEventActive(item);
        return true;
      });

      activeItems.forEach(item => {
        const accentClass = item.accent ? ` accent-${item.accent}` : '';
        const tagRow = (item.tag || item.badge) ? `
          <div class="link-tag-row">
            ${item.tag ? `<span class="link-tag">${item.tag}</span>` : ''}
            ${item.badge ? `<span class="link-badge-pill">${item.badge}</span>` : ''}
          </div>` : '';

        const dateAttrs = (item.startDate || item.endDate)
          ? ` data-start-date="${item.startDate || ''}" data-end-date="${item.endDate || ''}"`
          : '';

        streamItemsHtml += `
      <!-- ${item.title} -->
      <a href="${item.url}" target="_blank" rel="noopener" class="link-card${accentClass}"${dateAttrs}>
        <div class="link-icon-box">
          ${getIconSvg(item.icon)}
        </div>
        <div class="link-details">
          ${tagRow}
          <h3 class="link-title">${item.title}</h3>
          ${item.desc ? `<p class="link-desc">${cleanSubtext(item.desc)}</p>` : ''}
        </div>
        <span class="link-action-indicator">
          ${ICONS.arrowRight}
        </span>
      </a>`;
      });
    });
  }

  if (!streamItemsHtml.includes('portaldoaluno.inspirar.com.br')) {
    streamItemsHtml += `
      <!-- Portal do Aluno -->
      <a href="${data.project.globalSocial.portalAluno}" target="_blank" rel="noopener" class="link-card accent-cyan">
        <div class="link-icon-box">
          ${ICONS.graduationCap}
        </div>
        <div class="link-details">
          <div class="link-tag-row">
            <span class="link-tag">Área Acadêmica</span>
            <span class="link-badge-pill">Login</span>
          </div>
          <h3 class="link-title">Portal do Aluno</h3>
          <p class="link-desc">Acesso a notas, frequência, materiais didáticos e financeiro</p>
        </div>
        <span class="link-action-indicator">
          ${ICONS.arrowRight}
        </span>
      </a>`;
  }

  const waMsg = encodeURIComponent(unit.whatsappDefaultMessage || `Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - ${unit.name}`);
  const waLink = `https://api.whatsapp.com/send?phone=${unit.whatsapp}&text=${waMsg}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faculdade Inspirar — ${unit.name} (${unit.state}) | Versão 2</title>

  <!-- SEO & Social -->
  <meta name="description" content="Links da unidade ${unit.name} (${unit.state}) da Faculdade Inspirar. Cursos, eventos, pós-graduação e inscrições.">
  <meta property="og:title" content="Faculdade Inspirar — ${unit.name} (${unit.state})">
  <meta property="og:description" content="${unit.bio}">
  <meta property="og:image" content="${coverPath}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#080B10">

  <!-- Favicon / Símbolo Branco -->
  <link rel="icon" type="image/png" href="${faviconPath}">
  <link rel="shortcut icon" type="image/png" href="${faviconPath}">
  <link rel="apple-touch-icon" href="${faviconPath}">

  <!-- Stylesheet Versão 2 -->
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>

  <!-- ── V2 COMPARISON BAR ── -->
  <aside class="v2-comparison-bar" aria-label="Seletor de Versão">
    <span class="v2-pill-tag">
      <span class="v2-pill-sparkle">✨</span>
      Versão 2 (Impeccable Craft)
    </span>
    <a href="${v1Url}" class="v2-pill-switch-btn" title="Alternar para a versão 1 original">
      Ver Versão 1 (Original) →
    </a>
  </aside>

  <!-- ========== MAIN CONTAINER ========== -->
  <main class="app-container">

    <!-- ── TOP NAV ── -->
    <nav class="top-nav" aria-label="Navegação da Unidade">
      <a href="${v2HubUrl}" class="top-badge" title="Ver todas as unidades Inspirar">
        <span class="status-indicator-dot" aria-hidden="true"></span>
        ${unit.name} • ${unit.state}
        <span style="font-size:0.75rem; opacity:0.7; margin-left:4px;">(Trocar)</span>
      </a>
      <div class="nav-actions">
        <a href="${v2HubUrl}" class="icon-button" title="Hub de Unidades Inspirar" aria-label="Voltar para a lista de todas as unidades">
          ${ICONS.home}
        </a>
        <button class="icon-button" title="Compartilhar página" aria-label="Compartilhar link desta unidade" onclick="shareLink()">
          ${ICONS.share}
        </button>
      </div>
    </nav>

    <!-- ── HERO PROFILE CARD ── -->
    <section class="hero-card" aria-label="Perfil da Unidade ${unit.name}">
      <div class="hero-cover">
        <img src="${coverPath}" alt="Fachada Faculdade Inspirar ${unit.name}" class="hero-cover-img" loading="eager" decoding="async">
        <div class="hero-cover-gradient"></div>
        
        <a href="${unit.googleMapsUrl || '#'}" target="_blank" rel="noopener" class="hero-campus-pill" title="Ver localização da unidade no Google Maps">
          <span class="hero-campus-pill-icon">${ICONS.mapPin}</span>
          <span>Ver no Mapa</span>
        </a>
      </div>
      <div class="hero-body">
        <div class="hero-logo-box">
          <img src="${logoPath}" alt="Logo Faculdade Inspirar" class="hero-logo-img">
        </div>
        <div class="hero-title-group">
          <h1 class="hero-title">
            ${unit.name}
            ${ICONS.verified}
          </h1>
          <span class="hero-badge-tag">Unidade Oficial</span>
        </div>
        <p class="hero-bio">${unit.bio}</p>
        <div class="hero-location-bar">
          ${ICONS.mapPin}
          <span>${unit.address}</span>
        </div>
        <div class="hero-handle-bar">
          <a href="${unit.instagram}" target="_blank" rel="noopener" class="hero-ig-pill" title="Instagram oficial: ${unit.instagramUser}">
            ${ICONS.instagram}
            <span>${unit.instagramUser}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ── QUICK ACTIONS ── -->
    <nav class="quick-actions-bar" aria-label="Ações Rápidas">
      <a href="${waLink}" target="_blank" rel="noopener" class="quick-action-btn btn-whatsapp" aria-label="Conversar no WhatsApp">
        <span class="quick-action-icon">${ICONS.whatsapp}</span>
        <span>WhatsApp</span>
      </a>
      <a href="${unit.instagram}" target="_blank" rel="noopener" class="quick-action-btn btn-instagram" aria-label="Abrir Instagram oficial ${unit.instagramUser}">
        <span class="quick-action-icon">${ICONS.instagram}</span>
        <span>Instagram</span>
      </a>
      <a href="${unit.googleMapsUrl || '#'}" target="_blank" rel="noopener" class="quick-action-btn btn-maps" aria-label="Abrir localização no Google Maps">
        <span class="quick-action-icon">${ICONS.mapPin}</span>
        <span>Mapa</span>
      </a>
      <button class="quick-action-btn btn-tour" id="btn-open-gallery" onclick="openGallery()" aria-label="Abrir fotos das instalações da unidade">
        <span class="quick-action-icon">${ICONS.photos}</span>
        <span>Fotos</span>
      </button>
    </nav>

    <!-- ── UNIFIED LINKTREE STREAM (SEM SKIPPED HEADINGS) ── -->
    <section class="links-stream" id="links-stream" aria-label="Links e Cursos da Unidade ${unit.name}">
      <!-- Heading H2 semântico intermediário para leitores de tela -->
      <h2 class="sr-only">Cursos, Eventos e Links de Atendimento</h2>
      ${streamItemsHtml}
    </section>

    <!-- ── FOOTER INSTITUCIONAL ── -->
    <footer class="app-footer">
      <div class="footer-brand-seal">
        <span>30 Anos de Inspirar</span>
      </div>
      <p class="footer-director">Faculdade Inspirar • Excelência e Referência na Saúde</p>
      <p class="footer-address">${unit.address} • ${unit.name} - ${unit.state}</p>
      <div class="footer-social-row">
        <a href="${unit.instagram}" target="_blank" rel="noopener" class="footer-social-link">Instagram</a>
        <span class="footer-separator">•</span>
        <a href="https://www.inspirar.com.br" target="_blank" rel="noopener" class="footer-social-link">Site Oficial</a>
        <span class="footer-separator">•</span>
        <a href="${data.project.globalSocial.portalAluno}" target="_blank" rel="noopener" class="footer-social-link">Portal do Aluno</a>
        <span class="footer-separator">•</span>
        <a href="${v2HubUrl}" class="footer-social-link" style="color:var(--color-primary-light);">Todas as 37 Unidades</a>
      </div>
    </footer>

  </main>

  <!-- ── ACCESSIBLE GALLERY MODAL (COM FOCO NATIVO E ARIA) ── -->
  <div class="gallery-modal-overlay" id="gallery-modal" role="dialog" aria-modal="true" aria-labelledby="gallery-modal-title" onclick="closeGalleryOnOverlay(event)">
    <div class="gallery-modal-content">
      <div class="gallery-header">
        <h2 class="gallery-title" id="gallery-modal-title">Unidade ${unit.name}</h2>
        <button class="gallery-close-btn" id="gallery-close-btn" onclick="closeGallery()" aria-label="Fechar galeria de fotos">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="gallery-slider-viewport">
        <img id="gallery-img" class="gallery-slide-img" src="${galleryItems[0].src}" alt="${galleryItems[0].caption}" loading="lazy">
        <button class="gallery-nav-btn prev" id="gallery-prev-btn" onclick="galleryPrev()" aria-label="Foto anterior">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="gallery-nav-btn next" id="gallery-next-btn" onclick="galleryNext()" aria-label="Próxima foto">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="gallery-caption-bar">
        <span class="gallery-caption-text" id="gallery-caption">${galleryItems[0].caption}</span>
        <span class="gallery-counter" id="gallery-counter">1 / ${galleryItems.length}</span>
      </div>
    </div>
  </div>

  <!-- ── TOAST ── -->
  <div class="toast-box" id="toast" role="status" aria-live="polite">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toast-msg">Link copiado!</span>
  </div>

  <!-- ── SCRIPTS ── -->
  <script>
    const galleryData = ${JSON.stringify(galleryItems)};
    let galleryIndex = 0;
    let lastActiveElement = null;

    function updateGallery() {
      const img = document.getElementById('gallery-img');
      const caption = document.getElementById('gallery-caption');
      const counter = document.getElementById('gallery-counter');
      img.style.opacity = '0';
      setTimeout(() => {
        img.src = galleryData[galleryIndex].src;
        img.alt = galleryData[galleryIndex].caption;
        caption.textContent = galleryData[galleryIndex].caption;
        counter.textContent = (galleryIndex + 1) + ' / ' + galleryData.length;
        img.style.opacity = '1';
      }, 150);
    }

    function openGallery() {
      lastActiveElement = document.activeElement;
      galleryIndex = 0;
      updateGallery();
      const modal = document.getElementById('gallery-modal');
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      // Mover foco para o botão de fechar (A11y)
      setTimeout(() => {
        const closeBtn = document.getElementById('gallery-close-btn');
        if (closeBtn) closeBtn.focus();
      }, 50);
    }

    function closeGallery() {
      const modal = document.getElementById('gallery-modal');
      modal.classList.remove('active');
      document.body.style.overflow = '';
      if (lastActiveElement && typeof lastActiveElement.focus === 'function') {
        lastActiveElement.focus();
      }
    }

    function closeGalleryOnOverlay(e) {
      if (e.target === e.currentTarget) closeGallery();
    }

    function galleryNext() {
      galleryIndex = (galleryIndex + 1) % galleryData.length;
      updateGallery();
    }

    function galleryPrev() {
      galleryIndex = (galleryIndex - 1 + galleryData.length) % galleryData.length;
      updateGallery();
    }

    /* Suporte a Teclado & Focus Trap no Modal */
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('gallery-modal');
      if (!modal || !modal.classList.contains('active')) return;

      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') galleryNext();
      if (e.key === 'ArrowLeft') galleryPrev();

      // Focus trap
      if (e.key === 'Tab') {
        const focusables = modal.querySelectorAll('button:not([disabled])');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    async function shareLink() {
      const url = window.location.href;
      const title = 'Faculdade Inspirar — ${unit.name}';
      if (navigator.share) {
        try {
          await navigator.share({ title, url });
        } catch {}
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        showToast('Link copiado!');
      }
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-msg').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }

    /* Touch Swipe */
    (function() {
      const viewport = document.querySelector('.gallery-slider-viewport');
      if (!viewport) return;
      let startX = 0;
      viewport.addEventListener('touchstart', (e) => { startX = e.changedTouches[0].screenX; }, { passive: true });
      viewport.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - startX;
        if (Math.abs(diff) > 50) {
          diff < 0 ? galleryNext() : galleryPrev();
        }
      }, { passive: true });
    })();
  </script>

</body>
</html>`;
}

/**
 * Builds Hub HTML for Version 2
 */
function generateHubHtmlV2(data) {
  const cssPath = `../assets/css/style-v2.css`;
  const logoPath = `../assets/images/Logo branca - horizontal.png`;
  const faviconPath = `../assets/images/favicon.png`;
  const v1HubUrl = `../index.html`;

  const regions = ['Todas (37)', 'Sul', 'Sudeste', 'Centro-Oeste', 'Nordeste', 'Norte', 'Internacional'];

  const sortedUnits = [...data.units].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

  let unitCardsHtml = '';
  sortedUnits.forEach(u => {
    let thumb = u.coverImage ? `../${u.coverImage}` : `../assets/images/UNIDADE CWB sem gourmet.png`;
    if (u.slug === 'curitiba' && fs.existsSync(path.join(ROOT_DIR, 'assets', 'images', 'webp', 'unidade-cwb-cover.webp'))) {
      thumb = `../assets/images/webp/unidade-cwb-cover.webp`;
    }

    unitCardsHtml += `
      <a href="${u.slug}/index.html" class="hub-unit-card" data-region="${u.region}" data-name="${u.name.toLowerCase()}" data-state="${u.state.toLowerCase()}">
        <img src="${thumb}" alt="Fachada Unidade ${u.name}" class="hub-unit-thumb" loading="lazy" decoding="async">
        <div class="hub-unit-info">
          <div class="hub-unit-name">${u.name} (${u.state})</div>
          <div class="hub-unit-region">${u.region} • ${u.coursesCount || 'Cursos e Pós'}</div>
        </div>
        <span class="hub-unit-arrow">${ICONS.arrowRight}</span>
      </a>`;
  });

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Faculdade Inspirar — Bio no Link | Todas as 37 Unidades (Versão 2)</title>

  <!-- SEO & Social -->
  <meta name="description" content="Hub oficial de links da Faculdade Inspirar. Escolha a sua unidade para acessar cursos, eventos, inscrições e atendimento direto.">
  <meta property="og:title" content="Faculdade Inspirar — Bio no Link | Todas as 37 Unidades">
  <meta property="og:description" content="Hub oficial de links da Faculdade Inspirar. Escolha a sua unidade para acessar cursos, eventos, inscrições e atendimento direto.">
  <meta property="og:image" content="../assets/images/favicon.png">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#080B10">

  <!-- Favicon / Símbolo Branco -->
  <link rel="icon" type="image/png" href="${faviconPath}">
  <link rel="shortcut icon" type="image/png" href="${faviconPath}">
  <link rel="apple-touch-icon" href="${faviconPath}">

  <!-- Stylesheet Versão 2 -->
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>

  <!-- ── V2 COMPARISON BAR ── -->
  <aside class="v2-comparison-bar" aria-label="Seletor de Versão">
    <span class="v2-pill-tag">
      <span class="v2-pill-sparkle">✨</span>
      Versão 2 (Impeccable Craft)
    </span>
    <a href="${v1HubUrl}" class="v2-pill-switch-btn" title="Alternar para o Hub da versão 1 original">
      Ver Versão 1 (Original) →
    </a>
  </aside>

  <!-- ========== MAIN CONTAINER ========== -->
  <main class="app-container">

    <!-- ── HUB HEADER ── -->
    <header class="hub-header">
      <img src="${logoPath}" alt="Faculdade Inspirar" class="hub-logo">
      <h1 class="sr-only">Faculdade Inspirar — Hub de Unidades Oficiais</h1>
      <p class="hub-subtitle">Selecione sua unidade para acessar cursos, especializações, inscrições e atendimento direto via WhatsApp.</p>
    </header>

    <!-- ── SEARCH BOX ── -->
    <div class="hub-search-box">
      <span class="hub-search-icon">${ICONS.search}</span>
      <input type="text" id="unit-search" class="hub-search-input" placeholder="Buscar unidade por cidade ou estado (ex: Curitiba, SP, Sul)..." aria-label="Buscar unidade por cidade ou estado">
    </div>

    <!-- ── REGION CHIPS COM MÁSCARA DE GRADIENTE SUAVE ── -->
    <div class="hub-chips-wrapper" aria-label="Filtro de Unidades por Região">
      <div class="hub-region-chips" role="tablist">
        ${regions.map((r, i) => `
        <button class="hub-chip${i === 0 ? ' active' : ''}" data-region="${r}" role="tab" aria-selected="${i === 0}">
          ${r}
        </button>`).join('')}
      </div>
    </div>

    <!-- ── UNITS GRID ── -->
    <section class="hub-units-grid" id="units-grid" aria-label="Lista de Unidades">
      ${unitCardsHtml}
    </section>

    <!-- ── FOOTER INSTITUCIONAL ── -->
    <footer class="app-footer" style="margin-top: 36px;">
      <div class="footer-brand-seal">
        <span>30 Anos de Inspirar</span>
      </div>
      <p class="footer-director">Faculdade Inspirar • Rede Nacional de Pós-Graduação e Extensão na Saúde</p>
      <div class="footer-social-row">
        <a href="https://www.inspirar.com.br" target="_blank" rel="noopener" class="footer-social-link">Site Oficial</a>
        <span class="footer-separator">•</span>
        <a href="${data.project.globalSocial.portalAluno}" target="_blank" rel="noopener" class="footer-social-link">Portal do Aluno</a>
        <span class="footer-separator">•</span>
        <a href="https://www.sympla.com.br/produtor/faculdadeinspirar" target="_blank" rel="noopener" class="footer-social-link">Eventos Nacionais</a>
      </div>
    </footer>

  </main>

  <!-- ── SEARCH & FILTER JAVASCRIPT ── -->
  <script>
    const searchInput = document.getElementById('unit-search');
    const chips = document.querySelectorAll('.hub-chip');
    const cards = document.querySelectorAll('.hub-unit-card');

    let activeRegion = 'Todas (37)';

    function filterUnits() {
      const query = searchInput.value.toLowerCase().trim();

      cards.forEach(card => {
        const name = card.getAttribute('data-name');
        const state = card.getAttribute('data-state');
        const region = card.getAttribute('data-region');

        const matchesRegion = (activeRegion === 'Todas (37)') || (region === activeRegion);
        const matchesQuery = !query || name.includes(query) || state.includes(query) || region.toLowerCase().includes(query);

        if (matchesRegion && matchesQuery) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    }

    searchInput.addEventListener('input', filterUnits);

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => {
          c.classList.remove('active');
          c.setAttribute('aria-selected', 'false');
        });
        chip.classList.add('active');
        chip.setAttribute('aria-selected', 'true');
        activeRegion = chip.getAttribute('data-region');
        filterUnits();
      });
    });
  </script>

</body>
</html>`;
}

console.log('Generating Version 2 (Impeccable Craft Edition)...');

// 1. Generate v2/index.html (Hub)
const v2HubHtml = generateHubHtmlV2(data);
fs.writeFileSync(path.join(V2_DIR, 'index.html'), v2HubHtml, 'utf8');
console.log('✅ Generated: v2/index.html (Hub)');

// 2. Generate v2/[slug]/index.html for all 37 units
let unitCount = 0;
data.units.forEach(unit => {
  const unitDir = path.join(V2_DIR, unit.slug);
  if (!fs.existsSync(unitDir)) {
    fs.mkdirSync(unitDir, { recursive: true });
  }

  const unitHtml = generateUnitHtmlV2(unit, data);
  fs.writeFileSync(path.join(unitDir, 'index.html'), unitHtml, 'utf8');
  unitCount++;
});
console.log(`✅ Generated: ${unitCount} unit pages in v2/ (all 37 units)`);
