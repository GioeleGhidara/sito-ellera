import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Layers } from "@/lib/icons";
import { Link } from "react-router-dom";
import { createDirectionalArrows } from "@/lib/trailDirectionArrows";
import { computeParallelOffsets } from "@/lib/trailParallelOffset";
import { fetchTrackJSON, gpxUrlToJson } from "@/lib/trackJson";
import { trails as trailCatalog, type TrailDirection } from "@/data/trails";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface TrailLayer {
  slug: string;
  name: string;
  gpxUrl: string;
  color: string;
  direction: TrailDirection;
}

export interface ConnectorLayer {
  name: string;
  gpxUrl: string;
}

const defaultTrails: TrailLayer[] = trailCatalog
  .filter((trail) => Boolean(trail.gpxPath))
  .map((trail) => ({
    slug: trail.slug,
    name: trail.name,
    gpxUrl: trail.gpxPath!,
    color: trail.gpxColor.toUpperCase(),
    direction: trail.travelDirection,
  }));

const defaultConnectors: ConnectorLayer[] = [
  {
    name: "Collegamento Cresta-Luceto",
    gpxUrl: "/tracks/collegamento_cresta-luceto.gpx",
  },
  {
    name: "Collegamento Cresta-Rio",
    gpxUrl: "/tracks/collegamento_cresta-rio.gpx",
  },
];

interface LoadedTrail {
  slug: string;
  name: string;
  color: string;
  line: L.Polyline;
  hitArea: L.Polyline;
  arrows: L.LayerGroup;
  pinnedState: { value: boolean };
  visible: boolean;
}

const BASE_LINE_WEIGHT = 4;
const HOVER_LINE_WEIGHT = 7;
const BASE_LINE_OPACITY = 0.9;
const CONNECTOR_LINE_COLOR = "#475569";
const CONNECTOR_LINE_WEIGHT = 3.5;
const CONNECTOR_LINE_OPACITY = 0.46;
const CONNECTOR_DASH_ARRAY = "9 10";
const DEFAULT_CENTER: [number, number] = [44.35, 8.42];
const DEFAULT_ZOOM = 14;
const MAX_ZOOM_OUT_LEVELS = 1;
const ABSOLUTE_MIN_ZOOM = 10;
const MAX_BOUNDS_PADDING = 0.5;
const MAX_BOUNDS_VISCOSITY = 1.0;
const CONNECTOR_PANE = "trail-connectors";

const TrailLegend = ({ loadedTrails, toggleTrail }: { loadedTrails: LoadedTrail[]; toggleTrail: (i: number) => void }) => (
  <div className="space-y-1.5">
    <p className="text-xs font-semibold text-foreground mb-2 font-serif tracking-wide uppercase">Sentieri</p>
    {loadedTrails.map((trail, idx) => (
      <div
        key={trail.name}
        className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-muted/60 transition-colors"
      >
        <input
          type="checkbox"
          checked={trail.visible}
          onChange={() => toggleTrail(idx)}
          className="h-3.5 w-3.5 rounded border-border accent-current cursor-pointer"
          style={{ accentColor: trail.color }}
          aria-label={`Mostra o nascondi ${trail.name}`}
        />
        <Link
          to={`/mtb/${trail.slug}`}
          className={`text-xs transition-opacity hover:underline underline-offset-2 ${trail.visible ? "opacity-100 font-medium" : "opacity-50"
            }`}
          style={{ color: trail.visible ? trail.color : undefined }}
        >
          {trail.name}
        </Link>
      </div>
    ))}
  </div>
);

interface TrailMapProps {
  customTrails?: TrailLayer[];
  customConnectors?: ConnectorLayer[];
  hideLegend?: boolean;
}

const TrailMap = ({ customTrails, customConnectors, hideLegend }: TrailMapProps = {}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const activeMobileTrailRef = useRef<LoadedTrail | null>(null);
  const [loadedTrails, setLoadedTrails] = useState<LoadedTrail[]>([]);

  const toggleTrail = useCallback((index: number) => {
    setLoadedTrails((prev) =>
      prev.map((trail, i) => {
        if (i !== index) return trail;
        const map = mapInstance.current;
        if (!map) return trail;
        const newVisible = !trail.visible;
        if (newVisible) {
          trail.pinnedState.value = false;
          trail.line.setStyle({ weight: BASE_LINE_WEIGHT, opacity: BASE_LINE_OPACITY });
          trail.line.addTo(map);
          trail.hitArea.addTo(map);
        } else {
          if (activeMobileTrailRef.current?.slug === trail.slug) {
            activeMobileTrailRef.current = null;
          }
          trail.pinnedState.value = false;
          trail.line.setStyle({ weight: BASE_LINE_WEIGHT, opacity: BASE_LINE_OPACITY });
          map.removeLayer(trail.line);
          map.removeLayer(trail.hitArea);
          map.removeLayer(trail.arrows);
        }
        return { ...trail, visible: newVisible };
      })
    );
  }, []);

  const activeTrails = customTrails || defaultTrails;
  const activeConnectors = customConnectors || defaultConnectors;

  const { data: mapData } = useQuery({
    queryKey: ["trail-map-data", activeTrails, activeConnectors],
    queryFn: async () => {
      const connectorPromises = activeConnectors.map(async (connector) => {
        try {
          const coords = await fetchTrackJSON(gpxUrlToJson(connector.gpxUrl));
          return coords.length > 0 ? { connector, coords } : null;
        } catch (e) {
          console.warn(`Failed to load connector GPX: ${connector.name}`, e);
          return null;
        }
      });

      const trailPromises = activeTrails.map(async (trail) => {
        try {
          const coords = await fetchTrackJSON(gpxUrlToJson(trail.gpxUrl));
          return coords.length > 0 ? { trail, coords } : null;
        } catch (e) {
          console.warn(`Failed to load JSON: ${trail.name}`, e);
          return null;
        }
      });

      const [connectorResults, trailResults] = await Promise.all([
        Promise.all(connectorPromises),
        Promise.all(trailPromises),
      ]);

      const validConnectors = connectorResults.filter(Boolean) as { connector: ConnectorLayer; coords: [number, number][] }[];
      const validTrails = trailResults.filter(Boolean) as { trail: TrailLayer; coords: [number, number][] }[];

      const allTrailCoords = validTrails.map((r) => r.coords);
      const offsetCoords = computeParallelOffsets(allTrailCoords);

      const processedTrails = validTrails.map((r, i) => ({
        trail: r.trail,
        hitCoords: r.coords,
        displayCoords: offsetCoords[i],
      }));

      return { connectors: validConnectors, trails: processedTrails };
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      minZoom: Math.max(ABSOLUTE_MIN_ZOOM, DEFAULT_ZOOM - MAX_ZOOM_OUT_LEVELS),
      maxBoundsViscosity: MAX_BOUNDS_VISCOSITY,
    }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    mapInstance.current = map;
    map.createPane(CONNECTOR_PANE);
    const connectorPane = map.getPane(CONNECTOR_PANE);
    if (connectorPane) {
      connectorPane.style.zIndex = "350";
      connectorPane.style.pointerEvents = "none";
    }

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    return () => { map.remove(); mapInstance.current = null; };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapData || loadedTrails.length > 0) return;

    const allBounds = L.latLngBounds([]);

    // ── Connectors
    mapData.connectors.forEach(({ coords }) => {
      const line = L.polyline(coords, {
        color: CONNECTOR_LINE_COLOR,
        weight: CONNECTOR_LINE_WEIGHT,
        opacity: CONNECTOR_LINE_OPACITY,
        dashArray: CONNECTOR_DASH_ARRAY,
        interactive: false,
        pane: CONNECTOR_PANE,
      }).addTo(map);
      allBounds.extend(line.getBounds());
    });

    // ── Trails
    const newLoadedTrails = mapData.trails.map(({ trail, displayCoords, hitCoords }) => {
      const line = L.polyline(displayCoords, {
        color: trail.color,
        weight: BASE_LINE_WEIGHT,
        opacity: BASE_LINE_OPACITY,
        interactive: false,
      }).addTo(map);

      // La hit area segue le coordinate originali per un'interazione precisa
      const hitArea = L.polyline(hitCoords, {
        color: "transparent",
        weight: 20,
        opacity: 0,
      }).addTo(map);

      const arrows = createDirectionalArrows(hitCoords, map, trail.color, {
        direction: trail.direction,
      });

      const pinnedState = { value: false };
      const loadedTrail: LoadedTrail = {
        slug: trail.slug,
        name: trail.name,
        color: trail.color,
        line,
        hitArea,
        arrows,
        pinnedState,
        visible: true,
      };

      hitArea.bindTooltip(`<strong>${trail.name}</strong>`, {
        sticky: true,
        direction: "top",
        offset: [0, -10],
        className: "trail-tooltip",
      });

      hitArea.on("mouseover", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        line.setStyle({ weight: HOVER_LINE_WEIGHT, opacity: 1 });
        arrows.addTo(map);
      });

      hitArea.on("mouseout", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        if (!pinnedState.value) {
          line.setStyle({ weight: BASE_LINE_WEIGHT, opacity: BASE_LINE_OPACITY });
          map.removeLayer(arrows);
        }
      });

      hitArea.on("click", (e: L.LeafletMouseEvent) => {
        L.DomEvent.stopPropagation(e);
        if (pinnedState.value) {
          pinnedState.value = false;
          line.setStyle({ weight: BASE_LINE_WEIGHT, opacity: BASE_LINE_OPACITY });
          map.removeLayer(arrows);
          if (activeMobileTrailRef.current?.slug === loadedTrail.slug) {
            activeMobileTrailRef.current = null;
          }
        } else {
          if (
            activeMobileTrailRef.current &&
            activeMobileTrailRef.current.slug !== loadedTrail.slug
          ) {
            activeMobileTrailRef.current.pinnedState.value = false;
            activeMobileTrailRef.current.line.setStyle({
              weight: BASE_LINE_WEIGHT,
              opacity: BASE_LINE_OPACITY,
            });
            map.removeLayer(activeMobileTrailRef.current.arrows);
          }
          pinnedState.value = true;
          activeMobileTrailRef.current = loadedTrail;
          line.setStyle({ weight: HOVER_LINE_WEIGHT, opacity: 1 });
          arrows.addTo(map);
        }
      });

      allBounds.extend(line.getBounds());
      return loadedTrail;
    });

    setLoadedTrails(newLoadedTrails);

    if (allBounds.isValid()) {
      map.fitBounds(allBounds, { padding: [30, 30] });
      const fullTrailsZoom = map.getZoom();
      const minZoomLevel = Math.max(
        ABSOLUTE_MIN_ZOOM,
        fullTrailsZoom - MAX_ZOOM_OUT_LEVELS,
      );
      map.setMinZoom(minZoomLevel);
      map.setMaxBounds(allBounds.pad(MAX_BOUNDS_PADDING));
    } else {
      map.setMinZoom(
        Math.max(ABSOLUTE_MIN_ZOOM, DEFAULT_ZOOM - MAX_ZOOM_OUT_LEVELS),
      );
    }
  }, [mapData, loadedTrails.length]);

  return (
    <div className="rounded-2xl overflow-hidden border border-border shadow-lg">
      <div className="relative">
        <div ref={mapRef} style={{ height: 400, width: "100%" }} />

        {loadedTrails.length > 0 && !hideLegend && (
          <>
            {/* Desktop legend */}
            <div className="absolute top-3 right-3 z-[1000] hidden lg:block rounded-lg border border-border bg-card/90 backdrop-blur-md p-3 shadow-lg max-w-[220px]">
              <TrailLegend loadedTrails={loadedTrails} toggleTrail={toggleTrail} />
            </div>

            {/* Mobile FAB + Popover */}
            <div className="absolute top-3 right-3 z-[9999] pointer-events-auto lg:hidden">
              <Popover>
                <PopoverTrigger asChild>
                  <button className="w-10 h-10 rounded-full bg-card/90 backdrop-blur-md border border-border shadow-lg flex items-center justify-center hover:bg-card transition-colors">
                    <Layers className="w-5 h-5 text-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent side="bottom" align="end" className="w-56 p-3 z-[9999]">
                  <TrailLegend loadedTrails={loadedTrails} toggleTrail={toggleTrail} />
                </PopoverContent>
              </Popover>
            </div>
          </>
        )}
      </div>

      <div className="bg-card px-5 py-4 flex flex-wrap gap-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#00AA00" }} />
          Facile
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#0000FF" }} />
          Media
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#FF0000" }} />
          Esperti
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full border border-border" style={{ backgroundColor: "#000000" }} />
          Difficile
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: "#800080" }} />
          Trasferimenti / Risalite
        </span>
      </div>
    </div>
  );
};

export default TrailMap;
