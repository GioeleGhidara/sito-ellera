import L from "leaflet";
import type { TrailDirection } from "@/data/trails/trails";

interface TrailDirectionArrowOptions {
  spacingMeters?: number;
  arrowColor?: string;
  arrowSize?: number;
  lookaheadPoints?: number;
  direction?: TrailDirection;
}

const DEFAULT_SPACING_METERS = 380;
const DEFAULT_ARROW_COLOR = "rgba(255, 255, 255, 0.9)";
const DEFAULT_ARROW_SIZE = 13;
const DEFAULT_LOOKAHEAD_POINTS = 3;
const DIRECTION_GLYPH: Record<TrailDirection, string> = {
  downhill: "&#10148;",
  uphill: "&#10148;",
  bidirectional: "&#8596;",
};

function bearingDegrees(from: L.LatLng, to: L.LatLng): number {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLon = ((to.lng - from.lng) * Math.PI) / 180;

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  return (((Math.atan2(y, x) * 180) / Math.PI) + 360) % 360;
}

export function createDirectionalArrows(
  coords: [number, number][],
  map: L.Map,
  glowColor: string,
  options: TrailDirectionArrowOptions = {}
): L.LayerGroup {
  if (coords.length < 2) {
    return L.layerGroup([]);
  }

  const spacingMeters = options.spacingMeters ?? DEFAULT_SPACING_METERS;
  const arrowColor = options.arrowColor ?? DEFAULT_ARROW_COLOR;
  const arrowSize = options.arrowSize ?? DEFAULT_ARROW_SIZE;
  const lookaheadPoints = options.lookaheadPoints ?? DEFAULT_LOOKAHEAD_POINTS;
  const direction = options.direction ?? "downhill";
  const arrowGlyph = DIRECTION_GLYPH[direction];

  const latLngs = coords.map(([lat, lng]) => L.latLng(lat, lng));
  const cumulativeDistances: number[] = [0];

  for (let i = 1; i < latLngs.length; i++) {
    const segmentDistance = map.distance(latLngs[i - 1], latLngs[i]);
    cumulativeDistances.push(cumulativeDistances[i - 1] + segmentDistance);
  }

  const totalDistance = cumulativeDistances[cumulativeDistances.length - 1];
  if (totalDistance < spacingMeters) {
    return L.layerGroup([]);
  }

  const markers: L.Marker[] = [];
  let segmentIndex = 1;

  for (
    let distance = spacingMeters;
    distance < totalDistance;
    distance += spacingMeters
  ) {
    while (
      segmentIndex < cumulativeDistances.length &&
      cumulativeDistances[segmentIndex] < distance
    ) {
      segmentIndex++;
    }

    if (segmentIndex >= latLngs.length) {
      break;
    }

    const from = latLngs[segmentIndex - 1];
    const to = latLngs[segmentIndex];
    const segmentStart = cumulativeDistances[segmentIndex - 1];
    const segmentEnd = cumulativeDistances[segmentIndex];
    const segmentLength = segmentEnd - segmentStart;

    if (segmentLength <= 0) {
      continue;
    }

    const t = (distance - segmentStart) / segmentLength;
    const lat = from.lat + (to.lat - from.lat) * t;
    const lng = from.lng + (to.lng - from.lng) * t;
    const arrowPoint = L.latLng(lat, lng);

    const targetIdx = Math.min(
      segmentIndex + lookaheadPoints,
      latLngs.length - 1
    );
    const targetPoint = latLngs[targetIdx];

    const bearing = bearingDegrees(arrowPoint, targetPoint);
    // The glyph points to the right by default, so rotate by (bearing - 90).
    const rotation = bearing - 90;

    const marker = L.marker([lat, lng], {
      interactive: false,
      keyboard: false,
      icon: L.divIcon({
        className: "trail-direction-arrow",
        html: `<span style="display:block;transform:rotate(${rotation}deg);font-size:${arrowSize}px;line-height:1;color:${arrowColor};text-shadow:0 0 2px rgba(0,0,0,0.7),0 0 4px ${glowColor};">${arrowGlyph}</span>`,
        iconSize: [arrowSize, arrowSize],
        iconAnchor: [arrowSize / 2, arrowSize / 2],
      }),
    });

    markers.push(marker);
  }

  return L.layerGroup(markers);
}
