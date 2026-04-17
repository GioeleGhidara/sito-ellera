type TrackJsonPoint = [number, number] | [number, number, number];

export interface TrackJsonWaypoint {
  name: string;
  desc?: string;
  lat: number;
  lon: number;
}

interface TrackJsonPayload {
  tracks?: TrackJsonPoint[][];
  waypoints?: TrackJsonWaypoint[];
}

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const toLatLngTuple = (value: unknown): [number, number] | null => {
  if (!Array.isArray(value) || value.length < 2) {
    return null;
  }

  const [lat, lon] = value;
  if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) {
    return null;
  }

  return [lat, lon];
};

const fetchTrackFileJson = async (jsonUrl: string): Promise<TrackJsonPayload> => {
  const response = await fetch(jsonUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${jsonUrl}: ${response.status}`);
  }

  return (await response.json()) as TrackJsonPayload;
};

export const gpxUrlToJson = (gpxUrl: string) =>
  gpxUrl.replace("/tracks/", "/tracks/json/").replace(".gpx", ".json");

export const fetchTrackJSON = async (jsonUrl: string): Promise<[number, number][]> => {
  const data = await fetchTrackFileJson(jsonUrl);
  return (data.tracks?.[0] ?? [])
    .map((point) => toLatLngTuple(point))
    .filter((point): point is [number, number] => point !== null);
};

export const fetchTrackWaypointsJSON = async (
  jsonUrl: string,
): Promise<TrackJsonWaypoint[]> => {
  const data = await fetchTrackFileJson(jsonUrl);
  return (data.waypoints ?? []).filter(
    (waypoint) =>
      typeof waypoint?.name === "string" &&
      isFiniteNumber(waypoint?.lat) &&
      isFiniteNumber(waypoint?.lon),
  );
};
