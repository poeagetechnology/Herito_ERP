// Tamil Nadu Map Boundaries (approximate)
export const TAMIL_NADU_BOUNDS = {
  north: 13.5, // Latitude
  south: 8.0,
  east: 80.5, // Longitude
  west: 76.5,
};

// Major cities in Tamil Nadu with their coordinates
export const MAJOR_CITIES_TN = [
  { name: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "Coimbatore", lat: 11.0086, lng: 76.9011 },
  { name: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "Trichy", lat: 10.7905, lng: 78.7047 },
  { name: "Salem", lat: 11.6643, lng: 78.146 },
  { name: "Tiruppur", lat: 11.1085, lng: 77.3411 },
  { name: "Erode", lat: 11.3919, lng: 77.7197 },
  { name: "Kanchipuram", lat: 12.8342, lng: 79.7029 },
  { name: "Vellore", lat: 12.9689, lng: 79.1288 },
  { name: "Thanjavur", lat: 10.787, lng: 79.1378 },
  { name: "Tirunelveli", lat: 8.7139, lng: 77.2567 },
  { name: "Kanyakumari", lat: 8.0883, lng: 77.5385 },
];

export const DEFAULT_ZOOM = 1;
export const MIN_ZOOM = 0.8;
export const MAX_ZOOM = 3;
export const ZOOM_STEP = 0.2;

/**
 * Convert latitude/longitude to pixel coordinates for display with zoom support
 */
export function latLngToPixel(
  lat: number,
  lng: number,
  mapWidth: number,
  mapHeight: number,
  zoom: number = 1,
  panX: number = 0,
  panY: number = 0,
): { x: number; y: number } {
  const latRange = TAMIL_NADU_BOUNDS.north - TAMIL_NADU_BOUNDS.south;
  const lngRange = TAMIL_NADU_BOUNDS.east - TAMIL_NADU_BOUNDS.west;

  const centerX = mapWidth / 2;
  const centerY = mapHeight / 2;

  const x =
    ((lng - TAMIL_NADU_BOUNDS.west) / lngRange) * mapWidth * zoom -
    (mapWidth * (zoom - 1)) / 2 +
    panX;
  const y =
    ((TAMIL_NADU_BOUNDS.north - lat) / latRange) * mapHeight * zoom -
    (mapHeight * (zoom - 1)) / 2 +
    panY;

  return { x, y };
}

/**
 * Convert pixel coordinates to latitude/longitude with zoom support
 */
export function pixelToLatLng(
  x: number,
  y: number,
  mapWidth: number,
  mapHeight: number,
  zoom: number = 1,
  panX: number = 0,
  panY: number = 0,
): { lat: number; lng: number } {
  const latRange = TAMIL_NADU_BOUNDS.north - TAMIL_NADU_BOUNDS.south;
  const lngRange = TAMIL_NADU_BOUNDS.east - TAMIL_NADU_BOUNDS.west;

  const adjustedX =
    (x - panX + (mapWidth * (zoom - 1)) / 2) / (mapWidth * zoom);
  const adjustedY =
    (y - panY + (mapHeight * (zoom - 1)) / 2) / (mapHeight * zoom);

  const lng = TAMIL_NADU_BOUNDS.west + adjustedX * lngRange;
  const lat = TAMIL_NADU_BOUNDS.north - adjustedY * latRange;

  return { lat, lng };
}

/**
 * Get location name from coordinates
 */
export function getLocationName(lat: number, lng: number): string {
  const city = MAJOR_CITIES_TN.find(
    (c) => Math.abs(c.lat - lat) < 0.3 && Math.abs(c.lng - lng) < 0.3,
  );

  if (city) {
    return city.name;
  }

  return `${lat.toFixed(3)}, ${lng.toFixed(3)}`;
}
