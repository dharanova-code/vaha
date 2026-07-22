/**
 * VAHA Branding Asset Generator
 * Run from project root: node generate-assets.js
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets');
const BRANDING_DIR = path.join(ASSETS_DIR, 'branding');

// ─── SVG generators ─────────────────────────────────────────────────────────

function iconSvg(size) {
  const cx = size / 2;
  const R = size * 0.29;
  const L = cx - R, Ri = cx + R;
  // Basin: diameter at y=T, arc curves upward (SVG: smaller y = higher)
  // T is the y-coordinate of the arc endpoints (flat side)
  const T = size * 0.595, B = T + size * 0.075;
  const sw = Math.max(2, size * 0.035);
  // Dot hovers at 4R/3π above the diameter — centroid of semicircle
  // In SVG, upward means smaller y: dotY = T - 4R/3π
  const dotY = T - (4 * R) / (3 * Math.PI);
  const dotR = size * 0.052;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="#FAF8F5"/>`,
    `<path d="M ${L} ${T} A ${R} ${R} 0 0 1 ${Ri} ${T}" fill="none" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${Ri}" y1="${T}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${B}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="#C07D53"/>`,
    `</svg>`,
  ].join('');
}


function adaptiveSvg(size) {
  const cx = size / 2;
  const R = size * 0.24;
  const L = cx - R, Ri = cx + R;
  const T = size * 0.58, B = T + size * 0.065;
  const sw = Math.max(2, size * 0.032);
  const dotY = T - R * 0.28, dotR = size * 0.046;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="#FAF8F5"/>`,
    `<path d="M ${L} ${T} A ${R} ${R} 0 0 1 ${Ri} ${T}" fill="none" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${Ri}" y1="${T}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${B}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="#C07D53"/>`,
    `</svg>`,
  ].join('');
}

function splashSvg(w, h) {
  const cx = w / 2, cy = h / 2;
  const R = w * 0.22;
  const L = cx - R, Ri = cx + R;
  const T = cy - w * 0.03, B = T + w * 0.06;
  const sw = Math.max(4, w * 0.028);
  const dotY = T - R * 0.28, dotR = w * 0.04;
  const wordY = B + w * 0.13;
  const fs = Math.round(w * 0.055);
  const ls = Math.round(w * 0.025);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">`,
    `<rect width="${w}" height="${h}" fill="#FAF8F5"/>`,
    `<path d="M ${L} ${T} A ${R} ${R} 0 0 1 ${Ri} ${T}" fill="none" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${Ri}" y1="${T}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${B}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="#C07D53"/>`,
    `<text x="${cx}" y="${wordY}" text-anchor="middle" font-family="Georgia, serif" font-size="${fs}" font-weight="400" letter-spacing="${ls}" fill="#1B3629">VAHA</text>`,
    `</svg>`,
  ].join('');
}

function faviconSvg(size) {
  const cx = size / 2;
  const R = size * 0.29;
  const L = cx - R, Ri = cx + R;
  const T = size * 0.6, B = T + size * 0.07;
  const sw = Math.max(1, size * 0.09);
  const dotY = T - R * 0.28, dotR = size * 0.1;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="#FAF8F5"/>`,
    `<path d="M ${L} ${T} A ${R} ${R} 0 0 1 ${Ri} ${T}" fill="none" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${Ri}" y1="${T}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${B}" x2="${Ri}" y2="${B}" stroke="#1B3629" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="#C07D53"/>`,
    `</svg>`,
  ].join('');
}

function notificationSvg(size) {
  const cx = size / 2;
  const R = size * 0.28;
  const L = cx - R, Ri = cx + R;
  const T = size * 0.58, B = T + size * 0.08;
  const sw = Math.max(1, size * 0.08);
  const dotY = T - R * 0.28, dotR = size * 0.1;

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">`,
    `<rect width="${size}" height="${size}" fill="transparent"/>`,
    `<path d="M ${L} ${T} A ${R} ${R} 0 0 1 ${Ri} ${T}" fill="none" stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${T}" x2="${L}" y2="${B}" stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${Ri}" y1="${T}" x2="${Ri}" y2="${B}" stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<line x1="${L}" y1="${B}" x2="${Ri}" y2="${B}" stroke="#FFFFFF" stroke-width="${sw}" stroke-linecap="round"/>`,
    `<circle cx="${cx}" cy="${dotY}" r="${dotR}" fill="#FFFFFF"/>`,
    `</svg>`,
  ].join('');
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const sharp = require('sharp');

  if (!fs.existsSync(BRANDING_DIR)) fs.mkdirSync(BRANDING_DIR, { recursive: true });

  const jobs = [
    { svg: iconSvg(1024),           out: path.join(ASSETS_DIR, 'icon.png'),              w: 1024, h: 1024 },
    { svg: adaptiveSvg(1024),       out: path.join(ASSETS_DIR, 'adaptive-icon.png'),      w: 1024, h: 1024 },
    { svg: splashSvg(1284, 2778),   out: path.join(ASSETS_DIR, 'splash.png'),             w: 1284, h: 2778 },
    { svg: faviconSvg(48),          out: path.join(ASSETS_DIR, 'favicon.png'),            w: 48,   h: 48   },
    { svg: notificationSvg(96),     out: path.join(ASSETS_DIR, 'notification-icon.png'),  w: 96,   h: 96   },
  ];

  for (const j of jobs) {
    await sharp(Buffer.from(j.svg, 'utf8'))
      .resize(j.w, j.h)
      .png({ compressionLevel: 9 })
      .toFile(j.out);
    console.log(`  OK  ${path.basename(j.out)} (${j.w}x${j.h})`);
  }

  // Persist SVG sources
  const svgSources = [
    { data: iconSvg(1024),           name: 'app-icon-source.svg' },
    { data: adaptiveSvg(1024),       name: 'adaptive-icon-source.svg' },
    { data: splashSvg(1284, 2778),   name: 'splash-source.svg' },
    { data: faviconSvg(48),          name: 'favicon-source.svg' },
    { data: notificationSvg(96),     name: 'notification-icon-source.svg' },
  ];
  for (const s of svgSources) {
    fs.writeFileSync(path.join(BRANDING_DIR, s.name), s.data, 'utf8');
    console.log(`  OK  branding/${s.name}`);
  }

  console.log('\nAll VAHA branding assets generated.');
}

main().catch(e => { console.error(e); process.exit(1); });
