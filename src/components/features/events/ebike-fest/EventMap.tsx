import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { fetchTrackJSON, gpxUrlToJson } from "@/lib/trackJson";
import { createDirectionalArrows } from "@/lib/trailDirectionArrows";

interface EventMapProps {
    tracks: {
        name: string;
        gpxUrl: string;
        color: string;
    }[];
}

const DEFAULT_CENTER: [number, number] = [44.364, 8.463]; // Roughly Prato Feste
const DEFAULT_ZOOM = 14;

export function EventMap({ tracks }: EventMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const mapInstance = useRef<L.Map | null>(null);
    
    const { data: mapData } = useQuery({
        queryKey: ["event-map-data", tracks],
        queryFn: async () => {
            const promises = tracks.map(async (track) => {
                try {
                    const coords = await fetchTrackJSON(gpxUrlToJson(track.gpxUrl));
                    return { track, coords };
                } catch (e) {
                    console.warn(`Failed to load JSON for: ${track.name}`, e);
                    return null;
                }
            });
            const results = await Promise.all(promises);
            return results.filter(Boolean) as { track: EventMapProps["tracks"][0]; coords: [number, number][] }[];
        },
        staleTime: Infinity,
    });

    useEffect(() => {
        if (!mapRef.current || mapInstance.current) return;

        const map = L.map(mapRef.current, {
            zoomControl: true,
            minZoom: 12,
        }).setView(DEFAULT_CENTER, DEFAULT_ZOOM);
        mapInstance.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        return () => { map.remove(); mapInstance.current = null; };
    }, []);

    useEffect(() => {
        const map = mapInstance.current;
        if (!map || !mapData) return;

        // Rimuoviamo vecchi polyline e frecce se i dati cambiano
        map.eachLayer((layer) => {
            if (layer instanceof L.Polyline || layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });

        const allBounds = L.latLngBounds([]);

        mapData.forEach(({ track, coords }) => {
            const line = L.polyline(coords, {
                color: track.color,
                weight: 5,
                opacity: 0.9,
                interactive: false,
            }).addTo(map);
            allBounds.extend(line.getBounds());

            // Aggiungiamo le frecce direzionali usando "downhill" per avere la singola freccia in avanti
            createDirectionalArrows(coords, map, track.color, {
                direction: "downhill",
                spacingMeters: 500,
                arrowSize: 12
            }).addTo(map);
        });

        if (allBounds.isValid()) {
            map.fitBounds(allBounds, { padding: [30, 30] });
        }
    }, [mapData]);

    return (
        <div className="relative rounded-2xl overflow-hidden border border-border shadow-lg">
            <div ref={mapRef} style={{ height: 400, width: "100%", backgroundColor: "#e5e5e5" }} />
            
        </div>
    );
}
