import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { createDirectionalArrows } from "@/lib/trailDirectionArrows";
import type { TrailDirection } from "@/data/trails";

interface TrailMiniMapProps {
  gpxUrl: string;
  color: string;
  direction: TrailDirection;
}

const DEFAULT_CENTER: [number, number] = [44.35, 8.42];
const DEFAULT_ZOOM = 14;
const MAX_ZOOM_OUT_LEVELS = 1;
const MAX_BOUNDS_PADDING = 1;
const MAX_BOUNDS_VISCOSITY = 1.0;

function parseGPX(gpxText: string): [number, number][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(gpxText, "application/xml");
  const points: [number, number][] = [];
  doc.querySelectorAll("trkpt").forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "0");
    const lon = parseFloat(pt.getAttribute("lon") || "0");
    if (lat && lon) points.push([lat, lon]);
  });

  return points;
}

const TrailMiniMap = ({ gpxUrl, color, direction }: TrailMiniMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      scrollWheelZoom: false,
      maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    mapInstance.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    fetch(gpxUrl)
      .then((res) => res.text())
      .then((text) => {
        const coords = parseGPX(text);
        if (coords.length === 0) return;

        const line = L.polyline(coords, {
          color,
          weight: 5,
          opacity: 0.9,
          interactive: false,
        }).addTo(map);

        const hitArea = L.polyline(coords, {
          color: "transparent",
          weight: 20,
          opacity: 0,
        }).addTo(map);

        const arrows = createDirectionalArrows(coords, map, color, {
          spacingMeters: 260,
          arrowSize: 15,
          direction,
        });
        arrows.addTo(map);

        hitArea.on("mouseover", (e: L.LeafletMouseEvent) => {
          e.originalEvent.stopPropagation();
          line.setStyle({ weight: 7, opacity: 1 });
        });

        hitArea.on("mouseout", (e: L.LeafletMouseEvent) => {
          e.originalEvent.stopPropagation();
          line.setStyle({ weight: 5, opacity: 0.9 });
        });

        const bounds = line.getBounds();
        map.fitBounds(bounds, { padding: [40, 40] });

        const zoomAfterFit = map.getZoom();
        map.setMinZoom(Math.max(1, zoomAfterFit - MAX_ZOOM_OUT_LEVELS));
        map.setMaxBounds(bounds.pad(MAX_BOUNDS_PADDING));
      })
      .catch((e) => console.warn("Failed to load GPX", e));

    return () => {
      map.remove();
      mapInstance.current = null;
    };
  }, [gpxUrl, color, direction]);

  return (
    <div className="relative isolate overflow-hidden rounded-xl border border-border shadow-warm">
      <div ref={mapRef} style={{ height: 360, width: "100%" }} />
    </div>
  );
};

export default TrailMiniMap;
