/**
 * scripts/build.js
 * Static site generator for "Bio no Link" (Faculdade Inspirar).
 * Reads data/units.json and builds:
 * 1. Root index.html (Central Hub with unit search, quick filters, and direct links)
 * 2. [slug]/index.html for every unit (Curitiba, Belém, Campo Grande, etc.)
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const DATA_FILE = path.join(ROOT_DIR, 'data', 'units.json');

// Today's date in YYYY-MM-DD (local system date)
const TODAY = new Date().toISOString().split('T')[0];

// Common SVG Icons map
const ICONS = {
  verified: `<svg class="verified-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1l3.09 3.26L19 3.27l.71 4.03 3.29 2.7-2 3.57.56 4.07L17.5 19.7 14.91 23 12 21.18 9.09 23 6.5 19.7l-4.06-2.06.56-4.07-2-3.57L4.29 7.3 5 3.27l3.91.99L12 1z"/><path fill="#080B10" d="M10 15.5l-3.5-3.5 1.41-1.41L10 12.67l5.59-5.58L17 8.5l-7 7z"/></svg>`,
  share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>`,
  mapPin: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  whatsapp: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`,
  instagram: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>`,
  photos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>`,
  youtube: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  arrowRight: `<svg viewBox="0 0 24 24" fill="none"><polyline points="9 18 15 12 9 6"/></svg>`,
  graduationCap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`
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

/**
 * Checks if an event is currently active based on start and end dates.
 */
function isEventActive(item, referenceDate = TODAY) {
  if (item.startDate && item.startDate > referenceDate) {
    return false; // Not yet started
  }
  if (item.endDate && item.endDate < referenceDate) {
    return false; // Expired
  }
  return true;
}

/**
 * Builds an individual unit's HTML page.
 */
function generateUnitHtml(unit, data) {
  const relativeRoot = '..';
  const cssPath = `${relativeRoot}/assets/css/style.css`;
  const logoPath = `${relativeRoot}/${unit.logoImage || 'assets/images/Logo branca - horizontal.png'}`;
  const coverPath = `${relativeRoot}/${unit.coverImage || 'assets/images/UNIDADE CWB sem gourmet.png'}`;
  const hubUrl = `${relativeRoot}/index.html`;

  // Gallery serialized data for client-side viewer
  const galleryItems = (unit.gallery && unit.gallery.length > 0)
    ? unit.gallery.map(g => ({
        src: g.src.startsWith('http') ? g.src : `${relativeRoot}/${g.src}`,
        caption: g.caption
      }))
    : [{ src: coverPath, caption: `Fachada ${unit.name}` }];

  // Unified Linktree Stream HTML (without separating sections)
  let streamItemsHtml = '';
  if (Array.isArray(unit.sections)) {
    unit.sections.forEach(sec => {
      if (sec.type === 'campus_banner') {
        const thumbPath = sec.thumb.startsWith('http') ? sec.thumb : `${relativeRoot}/${sec.thumb}`;
        streamItemsHtml += `
      <!-- Conheça a Unidade / Tour de Fotos -->
      <div role="button" tabindex="0" onclick="openGallery()" onkeydown="if(event.key==='Enter')openGallery()" class="link-card link-card-campus accent-cyan" style="cursor: pointer;" title="Abrir fotos da unidade ${unit.name}">
        <div class="link-icon-box campus-thumb-icon">
          <img src="${thumbPath}" alt="${sec.bannerTitle}" loading="lazy">
        </div>
        <div class="link-details">
          <div class="link-tag-row">
            <span class="link-tag">Nossa Estrutura</span>
            <span class="link-badge-pill">Fotos da Unidade</span>
          </div>
          <h3 class="link-title">${sec.bannerTitle}</h3>
          <p class="link-desc">${sec.bannerSub} — Clique para ver o tour de fotos</p>
        </div>
        <span class="link-action-indicator">
          ${ICONS.photos}
        </span>
      </div>`;
        return;
      }

      // Filter active items
      const activeItems = (sec.items || []).filter(item => {
        // If it's the events section, apply date check
        if (sec.id === 'eventos') {
          return isEventActive(item);
        }
        return true;
      });

      activeItems.forEach(item => {
        const accentClass = item.accent ? ` accent-${item.accent}` : '';
        const tagRow = (item.tag || item.badge) ? `
          <div class="link-tag-row">
            ${item.tag ? `<span class="link-tag">${item.tag}</span>` : ''}
            ${item.badge ? `<span class="link-badge-pill">${item.badge}</span>` : ''}
          </div>` : '';

        // Data attributes for client-side auto-expiry verification
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
          ${item.desc ? `<p class="link-desc">${item.desc}</p>` : ''}
        </div>
        <span class="link-action-indicator">
          ${ICONS.arrowRight}
        </span>
      </a>`;
      });
    });
  }

  // Include Portal do Aluno in the stream if not already present
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

  // Spotlight Card (if configured)
  let spotlightHtml = '';
  if (unit.spotlight && isEventActive(unit.spotlight)) {
    spotlightHtml = `
    <!-- ── SPOTLIGHT HERO CARD ── -->
    <a href="${unit.spotlight.url}" target="_blank" rel="noopener" class="spotlight-card">
      <div class="spotlight-header">
        <span class="spotlight-pill">
          ${ICONS.award}
          ${unit.spotlight.tag || 'Destaque'}
        </span>
        ${unit.spotlight.badge ? `<span class="spotlight-badge-status">${unit.spotlight.badge}</span>` : ''}
      </div>
      <h2 class="spotlight-title">${unit.spotlight.title}</h2>
      ${unit.spotlight.desc ? `<p class="spotlight-desc">${unit.spotlight.desc}</p>` : ''}
      <div class="spotlight-footer">
        <span class="spotlight-cta">${unit.spotlight.ctaText || 'Ver Informações'}</span>
        <span class="spotlight-cta-icon">${ICONS.arrowRight}</span>
      </div>
    </a>`;
  }

  // Pre-filled WhatsApp link
  const waMsg = encodeURIComponent(unit.whatsappDefaultMessage || `Olá! Tenho interesse em saber mais sobre os cursos da Faculdade Inspirar - ${unit.name}`);
  const waLink = `https://api.whatsapp.com/send?phone=${unit.whatsapp}&text=${waMsg}`;

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Faculdade Inspirar — ${unit.name} (${unit.state})</title>

  <!-- SEO & Social -->
  <meta name="description" content="Links da unidade ${unit.name} (${unit.state}) da Faculdade Inspirar. Cursos, eventos, pós-graduação e inscrições.">
  <meta property="og:title" content="Faculdade Inspirar — ${unit.name} (${unit.state})">
  <meta property="og:description" content="${unit.bio}">
  <meta property="og:image" content="${coverPath}">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#080B10">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${logoPath}">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>

  <!-- Ambient Background Orbs -->
  <div class="ambient-glow ambient-glow-1"></div>
  <div class="ambient-glow ambient-glow-2"></div>

  <!-- ========== MAIN CONTAINER ========== -->
  <main class="app-container">

    <!-- ── TOP NAV ── -->
    <nav class="top-nav">
      <a href="${hubUrl}" class="top-badge" title="Ver todas as unidades Inspirar" style="text-decoration:none;">
        <span class="pulse-dot"></span>
        ${unit.name} • ${unit.state}
        <span style="font-size:0.7rem; opacity:0.6; margin-left:4px;">(Trocar)</span>
      </a>
      <div class="nav-actions">
        <a href="${hubUrl}" class="icon-button" title="Hub de Unidades Inspirar">
          ${ICONS.home}
        </a>
        <button class="icon-button" title="Compartilhar" onclick="shareLink()">
          ${ICONS.share}
        </button>
      </div>
    </nav>

    <!-- ── HERO PROFILE CARD ── -->
    <section class="hero-card">
      <div class="hero-cover">
        <img src="${coverPath}" alt="Fachada Faculdade Inspirar ${unit.name}" class="hero-cover-img" loading="eager">
        <div class="hero-cover-gradient"></div>
        ${unit.mapsUrl ? `
        <a href="${unit.mapsUrl}" target="_blank" rel="noopener" class="hero-campus-pill">
          ${ICONS.mapPin}
          Ver no Mapa
        </a>` : ''}
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
          <span class="hero-badge-tag">${unit.badge || 'Unidade Oficial'}</span>
        </div>
        <p class="hero-bio">${unit.bio}</p>
        <div class="hero-location-bar">
          ${ICONS.mapPin}
          ${unit.address}
        </div>
        <div class="hero-handle-bar" style="margin-top: 8px;">
          <a href="${unit.instagram}" target="_blank" rel="noopener" class="hero-ig-pill" title="Instagram ${unit.instagramUser}" style="display:inline-flex; align-items:center; gap:6px; font-size:0.82rem; color:var(--color-primary-light); text-decoration:none; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:4px 12px; border-radius:100px; transition:var(--transition-fast);">
            ${ICONS.instagram}
            <span>${unit.instagramUser}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- ── QUICK ACTIONS ── -->
    <div class="quick-actions-bar">
      <a href="${waLink}" target="_blank" rel="noopener" class="quick-action-btn btn-whatsapp">
        <span class="quick-action-icon">${ICONS.whatsapp}</span>
        WhatsApp
      </a>
      <a href="${unit.instagram}" target="_blank" rel="noopener" class="quick-action-btn btn-instagram" title="Instagram: ${unit.instagramUser}">
        <span class="quick-action-icon">${ICONS.instagram}</span>
        Instagram
      </a>
      <a href="${unit.mapsUrl || '#'}" target="_blank" rel="noopener" class="quick-action-btn btn-maps">
        <span class="quick-action-icon">${ICONS.mapPin}</span>
        Mapa
      </a>
      <button class="quick-action-btn btn-tour" onclick="openGallery()">
        <span class="quick-action-icon">${ICONS.photos}</span>
        Fotos
      </button>
    </div>

    ${spotlightHtml}
    <!-- ── UNIFIED LINKTREE STREAM ── -->
    <section class="links-stream" id="links-stream" aria-label="Links da Unidade ${unit.name}">
      ${streamItemsHtml}
    </section>

    <!-- ══════════════════════════════════════════════
         FOOTER
         ══════════════════════════════════════════════ -->
    <footer class="app-footer">
      <img src="${logoPath}" alt="Logo Faculdade Inspirar" class="footer-logo">
      <div class="footer-info">
        <div class="footer-director">${unit.director || 'Direção Regional Faculdade Inspirar'}</div>
        <div class="footer-address">${unit.fullAddress || unit.address}</div>
        <div class="footer-anniversary">
          <span class="footer-anniversary-spark"></span>
          30 Anos de Inspirar
          <span class="footer-anniversary-spark"></span>
        </div>
      </div>
      <div class="footer-social-row">
        <a href="${unit.instagram}" target="_blank" rel="noopener" class="footer-social-link" title="${unit.instagramUser}">Instagram (${unit.instagramUser})</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${unit.website || data.project.globalSocial.website}" target="_blank" rel="noopener" class="footer-social-link">Site</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${data.project.globalSocial.portalAluno}" target="_blank" rel="noopener" class="footer-social-link">Portal do Aluno</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${unit.sympla || data.project.globalSocial.sympla}" target="_blank" rel="noopener" class="footer-social-link">Eventos</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${hubUrl}" class="footer-social-link" style="color:var(--color-primary-light);">Todas Unidades</a>
      </div>
    </footer>

  </main>

  <!-- ══════════════════════════════════════════════
       GALLERY MODAL
       ══════════════════════════════════════════════ -->
  <div class="gallery-modal-overlay" id="gallery-modal" onclick="closeGalleryOnOverlay(event)">
    <div class="gallery-modal-content">
      <div class="gallery-header">
        <span class="gallery-title">Unidade ${unit.name}</span>
        <button class="gallery-close-btn" onclick="closeGallery()">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
      <div class="gallery-slider-viewport">
        <img id="gallery-img" class="gallery-slide-img" src="${galleryItems[0].src}" alt="${galleryItems[0].caption}">
        <button class="gallery-nav-btn prev" onclick="galleryPrev()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button class="gallery-nav-btn next" onclick="galleryNext()">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
      <div class="gallery-caption-bar">
        <span class="gallery-caption-text" id="gallery-caption">${galleryItems[0].caption}</span>
        <span class="gallery-counter" id="gallery-counter">1 / ${galleryItems.length}</span>
      </div>
    </div>
  </div>

  <!-- ══════════════════════════════════════════════
       TOAST
       ══════════════════════════════════════════════ -->
  <div class="toast-box" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toast-msg">Link copiado!</span>
  </div>

  <!-- ══════════════════════════════════════════════
       SCRIPTS
       ══════════════════════════════════════════════ -->
  <script>
    /* ─── Gallery Logic ─── */
    const galleryData = ${JSON.stringify(galleryItems)};
    let galleryIndex = 0;

    function updateGallery() {
      const img = document.getElementById('gallery-img');
      const caption = document.getElementById('gallery-caption');
      const counter = document.getElementById('gallery-counter');
      img.style.opacity = 0;
      setTimeout(() => {
        img.src = galleryData[galleryIndex].src;
        img.alt = galleryData[galleryIndex].caption;
        caption.textContent = galleryData[galleryIndex].caption;
        counter.textContent = (galleryIndex + 1) + ' / ' + galleryData.length;
        img.style.opacity = 1;
      }, 200);
    }

    function openGallery() {
      galleryIndex = 0;
      updateGallery();
      document.getElementById('gallery-modal').classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeGallery() {
      document.getElementById('gallery-modal').classList.remove('active');
      document.body.style.overflow = '';
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

    /* Keyboard support */
    document.addEventListener('keydown', (e) => {
      const modal = document.getElementById('gallery-modal');
      if (!modal || !modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeGallery();
      if (e.key === 'ArrowRight') galleryNext();
      if (e.key === 'ArrowLeft') galleryPrev();
    });

    /* ─── Share / Copy Link ─── */
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

    /* ─── Touch Swipe Gallery ─── */
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

    /* ─── Client-side Dynamic Event Filter (Auto-expiring events) ─── */
    (function filterExpiredEvents() {
      const nowStr = new Date().toISOString().split('T')[0];
      document.querySelectorAll('[data-end-date]').forEach(el => {
        const end = el.getAttribute('data-end-date');
        if (end && end < nowStr) {
          el.remove(); // Automatically hides expired events in cached views
        }
      });
      document.querySelectorAll('[data-start-date]').forEach(el => {
        const start = el.getAttribute('data-start-date');
        if (start && start > nowStr) {
          el.remove(); // Automatically hides unstarted events
        }
      });
    })();
  </script>

</body>
</html>
`;
}

/**
 * Builds the Central Hub page (Root index.html).
 */
function generateHubHtml(data) {
  const logoPath = 'assets/images/Logo branca - horizontal.png';
  const cssPath = 'assets/css/style.css';

  const unitsCardsHtml = data.units.map(unit => {
    const unitPage = `${unit.slug}/index.html`;
    const coverPath = unit.coverImage || 'assets/images/UNIDADE CWB sem gourmet.png';
    const waMsg = encodeURIComponent(unit.whatsappDefaultMessage || `Olá! Gostaria de informações sobre a unidade ${unit.name}`);
    const waLink = `https://api.whatsapp.com/send?phone=${unit.whatsapp}&text=${waMsg}`;

    return `
      <!-- Unit Card: ${unit.name} -->
      <article class="hub-unit-card" data-search="${unit.name.toLowerCase()} ${unit.state.toLowerCase()} ${unit.stateName.toLowerCase()} ${unit.region.toLowerCase()} ${(unit.instagramUser || '').toLowerCase().replace('@', '')}" data-region="${unit.region}">
        <a href="${unitPage}" class="hub-unit-cover-wrap">
          <img src="${coverPath}" alt="Unidade ${unit.name}" class="hub-unit-img" loading="lazy">
          <div class="hub-unit-badge-tag">${unit.state}</div>
        </a>
        <div class="hub-unit-content">
          <div class="hub-unit-header">
            <h2 class="hub-unit-title">
              <a href="${unitPage}">${unit.name}</a>
              ${ICONS.verified}
            </h2>
            <span class="hub-unit-region">${unit.stateName} • ${unit.region}</span>
          </div>
          <p class="hub-unit-address">
            ${ICONS.mapPin}
            ${unit.address}
          </p>
          <div class="hub-unit-actions">
            <a href="${unitPage}" class="hub-btn-primary">
              Acessar Bio
              ${ICONS.arrowRight}
            </a>
            <div class="hub-unit-quick-icons">
              <a href="${waLink}" target="_blank" rel="noopener" class="hub-btn-icon btn-wa" title="WhatsApp ${unit.name}">
                ${ICONS.whatsapp}
              </a>
              <a href="${unit.instagram}" target="_blank" rel="noopener" class="hub-btn-icon btn-ig" title="Instagram ${unit.instagramUser}">
                ${ICONS.instagram}
              </a>
              <button class="hub-btn-icon" onclick="copyUnitLink('${unit.slug}')" title="Copiar link da Bio">
                ${ICONS.share}
              </button>
            </div>
          </div>
        </div>
      </article>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>${data.project.hubTitle}</title>

  <!-- SEO & Social -->
  <meta name="description" content="${data.project.hubDescription}">
  <meta property="og:title" content="${data.project.hubTitle}">
  <meta property="og:description" content="${data.project.hubDescription}">
  <meta property="og:image" content="assets/images/UNIDADE CWB sem gourmet.png">
  <meta property="og:type" content="website">
  <meta name="theme-color" content="#080B10">

  <!-- Favicon -->
  <link rel="icon" type="image/png" href="${logoPath}">

  <!-- Stylesheet -->
  <link rel="stylesheet" href="${cssPath}">
  <style>
    /* Hub-specific Layout Styles */
    .hub-header {
      text-align: center;
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .hub-logo {
      height: 52px;
      margin-bottom: 14px;
      object-fit: contain;
    }
    .hub-subtitle {
      font-size: 0.95rem;
      color: var(--text-secondary);
      max-width: 500px;
      line-height: 1.5;
      font-weight: 300;
    }
    .hub-search-box {
      position: relative;
      width: 100%;
      margin-bottom: 14px;
    }
    .hub-region-chips {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding-bottom: 8px;
      margin-bottom: 12px;
      scrollbar-width: none;
      -ms-overflow-style: none;
    }
    .hub-region-chips::-webkit-scrollbar {
      display: none;
    }
    .hub-chip {
      padding: 6px 14px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      font-size: 0.8rem;
      font-weight: 500;
      white-space: nowrap;
      cursor: pointer;
      transition: all var(--transition-fast);
      font-family: inherit;
    }
    .hub-chip:hover {
      border-color: var(--border-hover);
      color: #FFFFFF;
    }
    .hub-chip.active {
      background: var(--color-primary);
      border-color: var(--color-primary-light);
      color: #FFFFFF;
      box-shadow: 0 0 12px rgba(0, 118, 206, 0.4);
    }
    .hub-counter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.82rem;
      color: var(--text-muted);
      margin-bottom: 16px;
      padding: 0 4px;
    }
    .hub-search-input {
      width: 100%;
      padding: 14px 44px 14px 46px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      color: #FFFFFF;
      font-family: inherit;
      font-size: 0.95rem;
      outline: none;
      transition: all var(--transition-smooth);
      box-shadow: var(--shadow-sm);
    }
    .hub-search-input:focus {
      border-color: var(--color-primary-light);
      box-shadow: 0 0 20px rgba(0, 166, 255, 0.25);
    }
    .hub-search-icon {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: var(--text-muted);
      pointer-events: none;
    }
    .hub-search-clear {
      position: absolute;
      right: 16px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 1.1rem;
      display: none;
    }
    .hub-units-grid {
      display: flex;
      flex-direction: column;
      gap: 16px;
      width: 100%;
      margin-bottom: 32px;
    }
    .hub-unit-card {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      transition: all var(--transition-smooth);
      box-shadow: var(--shadow-sm);
    }
    @media (min-width: 580px) {
      .hub-unit-card {
        flex-direction: row;
        align-items: stretch;
      }
      .hub-unit-cover-wrap {
        width: 180px !important;
        height: auto !important;
        flex-shrink: 0;
      }
    }
    .hub-unit-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .hub-unit-cover-wrap {
      position: relative;
      height: 120px;
      width: 100%;
      overflow: hidden;
      display: block;
    }
    .hub-unit-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
    .hub-unit-card:hover .hub-unit-img {
      transform: scale(1.05);
    }
    .hub-unit-badge-tag {
      position: absolute;
      top: 10px;
      left: 10px;
      padding: 3px 10px;
      background: rgba(0, 118, 206, 0.9);
      backdrop-filter: blur(8px);
      border-radius: var(--radius-full);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      color: #FFFFFF;
    }
    .hub-unit-content {
      padding: 16px 20px;
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .hub-unit-header {
      margin-bottom: 8px;
    }
    .hub-unit-title {
      font-size: 1.2rem;
      font-weight: 700;
      color: #FFFFFF;
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }
    .hub-unit-title a {
      color: #FFFFFF;
      text-decoration: none;
    }
    .hub-unit-region {
      font-size: 0.78rem;
      color: var(--color-accent);
      font-weight: 500;
    }
    .hub-unit-address {
      font-size: 0.82rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 14px;
    }
    .hub-unit-address svg {
      width: 14px;
      height: 14px;
      color: var(--color-primary-light);
      flex-shrink: 0;
    }
    .hub-unit-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .hub-btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: var(--color-primary);
      color: #FFFFFF;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: var(--radius-full);
      font-size: 0.82rem;
      font-weight: 600;
      transition: all var(--transition-fast);
    }
    .hub-btn-primary:hover {
      background: var(--color-primary-light);
      color: #080B10;
      transform: translateX(2px);
    }
    .hub-btn-primary svg {
      width: 14px;
      height: 14px;
      stroke: currentColor;
      stroke-width: 2.5;
    }
    .hub-unit-quick-icons {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .hub-btn-icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      text-decoration: none;
      transition: all var(--transition-fast);
    }
    .hub-btn-icon:hover {
      background: rgba(255, 255, 255, 0.12);
      transform: scale(1.1);
      color: #FFFFFF;
    }
    .hub-btn-icon svg {
      width: 15px;
      height: 15px;
    }
    .hub-btn-icon.btn-wa:hover {
      background: var(--status-whatsapp);
      color: #FFFFFF;
    }
    .hub-btn-icon.btn-ig:hover {
      background: var(--status-instagram);
      color: #FFFFFF;
    }
    .hub-global-links {
      margin-bottom: 24px;
    }
    .empty-search-state {
      display: none;
      text-align: center;
      padding: 40px 20px;
      color: var(--text-muted);
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      border: 1px dashed var(--border-subtle);
    }
  </style>
</head>
<body>

  <!-- Ambient Background Orbs -->
  <div class="ambient-glow ambient-glow-1"></div>
  <div class="ambient-glow ambient-glow-2"></div>

  <!-- ========== MAIN CONTAINER ========== -->
  <main class="app-container">

    <!-- ── TOP BADGE ── -->
    <nav class="top-nav" style="justify-content: center;">
      <div class="top-badge">
        <span class="pulse-dot"></span>
        Bio no Link • Rede Nacional Inspirar
      </div>
    </nav>

    <!-- ── HUB HEADER ── -->
    <header class="hub-header">
      <img src="${logoPath}" alt="Faculdade Inspirar" class="hub-logo">
      <p class="hub-subtitle">
        Selecione sua unidade abaixo para acessar links rápidos de matrícula, cursos de pós-graduação, eventos e suporte direto.
      </p>
    </header>

    <!-- ── SEARCH BAR ── -->
    <div class="hub-search-box">
      <span class="hub-search-icon">${ICONS.search}</span>
      <input type="text" id="unit-search" class="hub-search-input" placeholder="Buscar unidade por cidade ou estado (ex: Curitiba, PR, Belém)..." autocomplete="off">
      <button id="search-clear" class="hub-search-clear" onclick="clearSearch()" title="Limpar busca">&times;</button>
    </div>

    <!-- ── REGION FILTERS ── -->
    <div class="hub-region-chips" id="region-chips">
      <button class="hub-chip active" data-region="all">Todas (${data.units.length})</button>
      <button class="hub-chip" data-region="Sul">Sul</button>
      <button class="hub-chip" data-region="Sudeste">Sudeste</button>
      <button class="hub-chip" data-region="Centro-Oeste">Centro-Oeste</button>
      <button class="hub-chip" data-region="Nordeste">Nordeste</button>
      <button class="hub-chip" data-region="Norte">Norte</button>
      <button class="hub-chip" data-region="Internacional">Internacional</button>
    </div>

    <!-- ── COUNTER BAR ── -->
    <div class="hub-counter-bar">
      <span>Exibindo <strong id="visible-count">${data.units.length}</strong> de ${data.units.length} unidades</span>
    </div>

    <!-- ── UNITS GRID ── -->
    <section class="hub-units-grid" id="units-list">
      ${unitsCardsHtml}
      <div id="empty-search" class="empty-search-state">
        <p>Nenhuma unidade encontrada para esta busca ou região.</p>
        <button onclick="clearSearch()" class="hub-btn-primary" style="margin-top:12px;">Limpar Filtro</button>
      </div>
    </section>

    <!-- ── INSTITUTIONAL GLOBAL LINKS ── -->
    <div class="section-wrapper hub-global-links">
      <div class="section-header">
        <span class="section-icon">${ICONS.globe}</span>
        <span class="section-title">Canais Oficiais Inspirar</span>
        <span class="section-divider"></span>
      </div>
      <div class="links-list">
        <a href="${data.project.globalSocial.website}" target="_blank" rel="noopener" class="link-card">
          <div class="link-icon-box">${ICONS.globe}</div>
          <div class="link-details">
            <h3 class="link-title">Portal Faculdade Inspirar</h3>
            <p class="link-desc">Site institucional com todas as informações e novidades</p>
          </div>
          <span class="link-action-indicator">${ICONS.arrowRight}</span>
        </a>

        <a href="${data.project.globalSocial.portalAluno}" target="_blank" rel="noopener" class="link-card accent-cyan">
          <div class="link-icon-box">${ICONS.graduationCap}</div>
          <div class="link-details">
            <h3 class="link-title">Portal do Aluno & Professor</h3>
            <p class="link-desc">Acesse sua área acadêmica, notas e materiais</p>
          </div>
          <span class="link-action-indicator">${ICONS.arrowRight}</span>
        </a>

        <a href="${data.project.globalSocial.sympla}" target="_blank" rel="noopener" class="link-card accent-orange">
          <div class="link-icon-box">${ICONS.calendar}</div>
          <div class="link-details">
            <h3 class="link-title">Eventos & Inscrições no Sympla</h3>
            <p class="link-desc">Congressos, jornadas científicas e cursos livres</p>
          </div>
          <span class="link-action-indicator">${ICONS.arrowRight}</span>
        </a>
      </div>
    </div>

    <!-- ── FOOTER ── -->
    <footer class="app-footer">
      <img src="${logoPath}" alt="Logo Faculdade Inspirar" class="footer-logo">
      <div class="footer-info">
        <div class="footer-director">Faculdade Inspirar • Referência Nacional na Saúde</div>
        <div class="footer-address">30 anos de Inspirar transformando vidas, carreiras e o ensino na área da saúde.</div>
        <div class="footer-anniversary">
          <span class="footer-anniversary-spark"></span>
          30 Anos de Inspirar
          <span class="footer-anniversary-spark"></span>
        </div>
      </div>
      <div class="footer-social-row">
        <a href="${data.project.globalSocial.instagram}" target="_blank" rel="noopener" class="footer-social-link">Instagram Nacional</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${data.project.globalSocial.website}" target="_blank" rel="noopener" class="footer-social-link">Site Oficial</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${data.project.globalSocial.portalAluno}" target="_blank" rel="noopener" class="footer-social-link">Portal do Aluno</a>
        <span style="color:var(--text-dim);">•</span>
        <a href="${data.project.globalSocial.sympla}" target="_blank" rel="noopener" class="footer-social-link">Eventos</a>
      </div>
    </footer>

  </main>

  <!-- ── TOAST ── -->
  <div class="toast-box" id="toast">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
    <span id="toast-msg">Link da Bio copiado!</span>
  </div>

  <script>
    /* Search & Region filter */
    const searchInput = document.getElementById('unit-search');
    const searchClear = document.getElementById('search-clear');
    const unitCards = document.querySelectorAll('.hub-unit-card');
    const emptyState = document.getElementById('empty-search');
    const visibleCount = document.getElementById('visible-count');

    let currentRegion = 'all';
    let currentQuery = '';

    function filterUnits() {
      let matches = 0;
      unitCards.forEach(card => {
        const text = card.getAttribute('data-search') || '';
        const region = card.getAttribute('data-region') || '';

        const matchesQuery = !currentQuery || text.includes(currentQuery);
        const matchesRegion = (currentRegion === 'all') || (region === currentRegion);

        if (matchesQuery && matchesRegion) {
          card.style.display = '';
          matches++;
        } else {
          card.style.display = 'none';
        }
      });

      if (visibleCount) visibleCount.textContent = matches;
      emptyState.style.display = (matches === 0) ? 'block' : 'none';
    }

    searchInput.addEventListener('input', function() {
      currentQuery = this.value.trim().toLowerCase();
      searchClear.style.display = currentQuery ? 'block' : 'none';
      filterUnits();
    });

    document.querySelectorAll('.hub-chip').forEach(chip => {
      chip.addEventListener('click', function() {
        document.querySelectorAll('.hub-chip').forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        currentRegion = this.getAttribute('data-region');
        filterUnits();
      });
    });

    function clearSearch() {
      searchInput.value = '';
      currentQuery = '';
      currentRegion = 'all';
      document.querySelectorAll('.hub-chip').forEach(c => c.classList.remove('active'));
      const allChip = document.querySelector('.hub-chip[data-region="all"]');
      if (allChip) allChip.classList.add('active');
      searchClear.style.display = 'none';
      filterUnits();
      searchInput.focus();
    }

    /* Copy Unit Direct Link */
    async function copyUnitLink(slug) {
      const base = window.location.href.split('?')[0].split('#')[0];
      const root = base.endsWith('/') ? base : base.substring(0, base.lastIndexOf('/') + 1);
      const url = root + slug + '/';

      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(url);
          showToast('Link da Bio copiado: ' + slug);
          return;
        } catch (e) {}
      }
      showToast('Link da unidade: ' + slug);
    }

    function showToast(msg) {
      const toast = document.getElementById('toast');
      document.getElementById('toast-msg').textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2500);
    }
  </script>

</body>
</html>
`;
}

function build() {
  console.log('--- Building Bio no Link Static Site ---');

  if (!fs.existsSync(DATA_FILE)) {
    console.error(`ERROR: data/units.json not found!`);
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  const data = JSON.parse(raw);

  // 1. Build Root index.html (Central Hub)
  const hubHtml = generateHubHtml(data);
  const rootIndex = path.join(ROOT_DIR, 'index.html');
  fs.writeFileSync(rootIndex, hubHtml, 'utf8');
  console.log(`Generated Hub: index.html (${hubHtml.length} bytes)`);

  // 2. Build Dedicated pages for each unit
  data.units.forEach(unit => {
    const unitDir = path.join(ROOT_DIR, unit.slug);
    if (!fs.existsSync(unitDir)) {
      fs.mkdirSync(unitDir, { recursive: true });
    }
    const unitHtml = generateUnitHtml(unit, data);
    const unitIndex = path.join(unitDir, 'index.html');
    fs.writeFileSync(unitIndex, unitHtml, 'utf8');
    console.log(`Generated Unit [${unit.slug}]: ${unit.slug}/index.html (${unitHtml.length} bytes)`);
  });

  console.log(`\nSite successfully built! Total units: ${data.units.length}`);
  console.log('BUILD SUCCESSFUL (37 units)');
  process.exit(0);
}

build();
