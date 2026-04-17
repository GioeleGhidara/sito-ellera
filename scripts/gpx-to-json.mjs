#!/usr/bin/env node
/**
 * gpx-to-json.mjs
 *
 * Converte tutti i file .gpx in public/tracks/ in JSON semplificati
 * per la visualizzazione sulla mappa, mantenendo i GPX originali per il download.
 *
 * Output: public/tracks/json/<nome>.json
 *
 * Uso:
 *   node scripts/gpx-to-json.mjs
 *   node scripts/gpx-to-json.mjs --tolerance 15   # più semplificato
 *   node scripts/gpx-to-json.mjs --tolerance 5    # meno semplificato
 *
 * Algoritmo semplificazione: Ramer–Douglas–Peucker
 * tolerance = distanza massima in metri tra punto originale e linea semplificata
 * Default: 10m - buon compromesso per zoom 12-14
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DOMParser } from '@xmldom/xmldom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const TRACKS_DIR = join(ROOT, 'public', 'tracks');
const OUT_DIR = join(ROOT, 'public', 'tracks', 'json');

// Leggi tolerance da args
const toleranceArg = process.argv.indexOf('--tolerance');
const TOLERANCE_M = toleranceArg !== -1 ? parseFloat(process.argv[toleranceArg + 1]) : 10;

// ── Geometria ────────────────────────────────────────────────────────────────

const EARTH_R = 6371000;

function toRad(deg) { return deg * Math.PI / 180; }

function haversine(a, b) {
  const dLat = toRad(b[0] - a[0]);
  const dLon = toRad(b[1] - a[1]);
  const la1 = toRad(a[0]), la2 = toRad(b[0]);
  const x = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLon/2)**2;
  return 2 * EARTH_R * Math.asin(Math.sqrt(x));
}

/** Distanza perpendicolare di un punto da una linea (in metri) */
function perpendicularDist(pt, lineStart, lineEnd) {
  if (lineStart[0] === lineEnd[0] && lineStart[1] === lineEnd[1]) {
    return haversine(pt, lineStart);
  }
  // Usa approssimazione planare locale (valida per distanze < 100km)
  const lat = toRad((pt[0] + lineStart[0]) / 2);
  const mPerDegLat = Math.PI * EARTH_R / 180;
  const mPerDegLon = mPerDegLat * Math.cos(lat);

  const x  = (pt[0]        - lineStart[0]) * mPerDegLat;
  const y  = (pt[1]        - lineStart[1]) * mPerDegLon;
  const x2 = (lineEnd[0]   - lineStart[0]) * mPerDegLat;
  const y2 = (lineEnd[1]   - lineStart[1]) * mPerDegLon;

  const len2 = x2*x2 + y2*y2;
  if (len2 === 0) return Math.sqrt(x*x + y*y);

  const t = Math.max(0, Math.min(1, (x*x2 + y*y2) / len2));
  const dx = x - t*x2, dy = y - t*y2;
  return Math.sqrt(dx*dx + dy*dy);
}

/** Ramer–Douglas–Peucker */
function rdp(points, toleranceM) {
  if (points.length <= 2) return points;

  let maxDist = 0, maxIdx = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const d = perpendicularDist(points[i], points[0], points[points.length - 1]);
    if (d > maxDist) { maxDist = d; maxIdx = i; }
  }

  if (maxDist > toleranceM) {
    const left  = rdp(points.slice(0, maxIdx + 1), toleranceM);
    const right = rdp(points.slice(maxIdx), toleranceM);
    return [...left.slice(0, -1), ...right];
  }
  return [points[0], points[points.length - 1]];
}

// ── GPX parser ───────────────────────────────────────────────────────────────

function parseGPX(text) {
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  const result = { tracks: [], waypoints: [] };

  // Track points
  const trksegs = doc.getElementsByTagName('trkseg');
  for (let s = 0; s < trksegs.length; s++) {
    const pts = trksegs[s].getElementsByTagName('trkpt');
    const coords = [];
    for (let i = 0; i < pts.length; i++) {
      const lat = parseFloat(pts[i].getAttribute('lat') || '');
      const lon = parseFloat(pts[i].getAttribute('lon') || '');
      const eleEl = pts[i].getElementsByTagName('ele')[0];
      const ele = eleEl ? parseFloat(eleEl.textContent) : undefined;
      if (!isNaN(lat) && !isNaN(lon)) coords.push(ele !== undefined ? [lat, lon, ele] : [lat, lon]);
    }
    if (coords.length) result.tracks.push(coords);
  }

  // Waypoints
  const wpts = doc.getElementsByTagName('wpt');
  for (let i = 0; i < wpts.length; i++) {
    const lat = parseFloat(wpts[i].getAttribute('lat') || '');
    const lon = parseFloat(wpts[i].getAttribute('lon') || '');
    if (isNaN(lat) || isNaN(lon)) continue;
    const nameEl = wpts[i].getElementsByTagName('name')[0];
    const descEl = wpts[i].getElementsByTagName('desc')[0];
    result.waypoints.push({
      name: nameEl?.textContent?.trim() || 'POI',
      desc: descEl?.textContent?.trim() || '',
      lat, lon,
    });
  }

  return result;
}

// ── Trova tutti i GPX ricorsivamente ─────────────────────────────────────────

function findGPX(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    if (entry === 'json') continue; // salta output dir
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) findGPX(full, files);
    else if (entry.endsWith('.gpx')) files.push(full);
  }
  return files;
}

// ── Main ─────────────────────────────────────────────────────────────────────

mkdirSync(OUT_DIR, { recursive: true });

const gpxFiles = findGPX(TRACKS_DIR);

if (gpxFiles.length === 0) {
  console.log('Nessun file .gpx trovato in', TRACKS_DIR);
  process.exit(0);
}

console.log(`Trovati ${gpxFiles.length} file GPX - tolerance: ${TOLERANCE_M}m\n`);

let totalOriginal = 0, totalSimplified = 0;

for (const file of gpxFiles) {
  const text = readFileSync(file, 'utf8');
  const parsed = parseGPX(text);

  // Semplifica ogni traccia
  const simplifiedTracks = parsed.tracks.map(coords => {
    const pts2d = coords.map(c => [c[0], c[1]]); // ignora elevazione per RDP
    const simplified = rdp(pts2d, TOLERANCE_M);
    // Riattacca elevazione se presente
    const hasEle = coords[0]?.length === 3;
    if (hasEle) {
      return simplified.map(([lat, lon]) => {
        const orig = coords.find(c => c[0] === lat && c[1] === lon);
        return orig ? [lat, lon, orig[2]] : [lat, lon];
      });
    }
    return simplified;
  });

  const origCount = parsed.tracks.reduce((s, t) => s + t.length, 0);
  const simpCount = simplifiedTracks.reduce((s, t) => s + t.length, 0);
  totalOriginal += origCount;
  totalSimplified += simpCount;

  // Percorso relativo per il JSON (mantiene struttura subdirectory)
  const rel = file.replace(TRACKS_DIR, '').replace(/\\/g, '/').replace(/^\//, '');
  const outPath = join(OUT_DIR, rel.replace('.gpx', '.json'));
  mkdirSync(dirname(outPath), { recursive: true });

  const output = {
    source: rel,
    simplifiedAt: TOLERANCE_M,
    tracks: simplifiedTracks,
    waypoints: parsed.waypoints,
  };

  writeFileSync(outPath, JSON.stringify(output));

  const ratio = Math.round((1 - simpCount / origCount) * 100);
  console.log(`  ${rel}`);
  console.log(`    ${origCount} punti → ${simpCount} punti (-${ratio}%)`);
}

const totalRatio = Math.round((1 - totalSimplified / totalOriginal) * 100);
console.log(`\nTotale: ${totalOriginal} → ${totalSimplified} punti (-${totalRatio}%)`);
console.log(`Output: ${OUT_DIR}`);
