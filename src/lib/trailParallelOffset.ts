/**
 * trailParallelOffset.ts
 *
 * Calcola offset laterali per tracce che si sovrappongono sulla mappa,
 * in modo che siano visibili in parallelo invece di sovrapporsi.
 *
 * Logica:
 * - Per ogni punto di ogni traccia, cerca quali altre tracce hanno un punto
 *   entro `toleranceMeters`. Quelle sono le tracce "co-presenti".
 * - Se N tracce sono co-presenti, vengono distribuite simmetricamente:
 *   rank 0 → −(N−1)/2 × step, rank 1 → −(N−3)/2 × step, ecc.
 * - Se una traccia è sola, offset = 0 (larghezza normale).
 * - L'offset è applicato perpendicolarmente alla direzione di percorrenza.
 */

const EARTH_RADIUS_M = 6371000;

/** Distanza haversine in metri tra due coordinate [lat, lng] */
function haversineDistance(
  a: [number, number],
  b: [number, number],
): number {
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLon = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(x));
}

/** Bearing (radianti) da p1 a p2 */
function bearingRad(
  p1: [number, number],
  p2: [number, number],
): number {
  const dLon = ((p2[1] - p1[1]) * Math.PI) / 180;
  const lat1 = (p1[0] * Math.PI) / 180;
  const lat2 = (p2[0] * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return Math.atan2(y, x);
}

/** Sposta un punto di `offsetMeters` in direzione perpendicolare al bearing dato */
function offsetPoint(
  point: [number, number],
  bearing: number,
  offsetMeters: number,
): [number, number] {
  const perpBearing = bearing + Math.PI / 2;
  const lat = (point[0] * Math.PI) / 180;
  const dLat = (offsetMeters * Math.cos(perpBearing)) / EARTH_RADIUS_M;
  const dLon =
    (offsetMeters * Math.sin(perpBearing)) /
    (EARTH_RADIUS_M * Math.cos(lat));
  return [
    point[0] + (dLat * 180) / Math.PI,
    point[1] + (dLon * 180) / Math.PI,
  ];
}

/**
 * Indice spaziale a griglia per velocizzare le query di prossimità.
 * Bucket size ≈ toleranceMeters (in gradi).
 */
function buildGrid(
  coords: [number, number][],
  cellDeg: number,
): Map<string, number[]> {
  const grid = new Map<string, number[]>();
  for (let i = 0; i < coords.length; i++) {
    const key = `${Math.floor(coords[i][0] / cellDeg)},${Math.floor(coords[i][1] / cellDeg)}`;
    const bucket = grid.get(key);
    if (bucket) bucket.push(i);
    else grid.set(key, [i]);
  }
  return grid;
}

function hasNearbyPoint(
  point: [number, number],
  grid: Map<string, number[]>,
  coords: [number, number][],
  toleranceM: number,
  cellDeg: number,
): boolean {
  // Controlla la cella del punto e le 8 celle adiacenti
  const cx = Math.floor(point[0] / cellDeg);
  const cy = Math.floor(point[1] / cellDeg);
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const key = `${cx + dx},${cy + dy}`;
      const bucket = grid.get(key);
      if (!bucket) continue;
      for (const idx of bucket) {
        if (haversineDistance(point, coords[idx]) < toleranceM) return true;
      }
    }
  }
  return false;
}

/**
 * Calcola le coordinate con offset laterale per ogni traccia.
 *
 * @param allCoords     Array di coordinate per ogni traccia
 * @param toleranceM    Distanza (m) entro cui due tracce sono considerate sovrapposte
 * @param offsetStepM   Distanza (m) tra due tracce parallele adiacenti
 * @returns             Array di coordinate offset (stessa struttura di allCoords)
 */
export function computeParallelOffsets(
  allCoords: [number, number][][],
  toleranceM = 12,
  offsetStepM = 5,
): [number, number][][] {
  const n = allCoords.length;
  if (n <= 1) return allCoords;

  // Costruisci un indice spaziale per ogni traccia
  const cellDeg = toleranceM / 111111; // 1° ≈ 111111 m
  const grids = allCoords.map((coords) => buildGrid(coords, cellDeg));

  return allCoords.map((coords, trailIdx) => {
    return coords.map((point, ptIdx) => {
      // Quali tracce sono co-presenti in questo punto?
      const coPresent: number[] = [trailIdx];
      for (let other = 0; other < n; other++) {
        if (other === trailIdx) continue;
        if (
          hasNearbyPoint(
            point,
            grids[other],
            allCoords[other],
            toleranceM,
            cellDeg,
          )
        ) {
          coPresent.push(other);
        }
      }

      // Sola → nessun offset
      if (coPresent.length === 1) return point;

      // Ordina per indice per avere un rank stabile
      coPresent.sort((a, b) => a - b);
      const rank = coPresent.indexOf(trailIdx);
      const total = coPresent.length;

      // Offset centrato: rank 0 → -(total-1)/2 * step, ecc.
      const offset = (rank - (total - 1) / 2) * offsetStepM;
      if (offset === 0) return point;

      // Bearing locale (usa il punto precedente e successivo per stabilità)
      const prev = ptIdx > 0 ? coords[ptIdx - 1] : point;
      const next = ptIdx < coords.length - 1 ? coords[ptIdx + 1] : point;
      const rawB = prev === point && next === point ? 0 : bearingRad(prev, next);
      const b = ((rawB % Math.PI) + Math.PI) % Math.PI;

      return offsetPoint(point, b, offset);
    });
  });
}
