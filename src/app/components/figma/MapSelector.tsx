import { useRef, useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import {
  latLngToPixel,
  pixelToLatLng,
  getLocationName,
  MAJOR_CITIES_TN,
} from "../../../lib/mapUtils";

interface MapSelectorProps {
  onLocationSelect: (location: { lat: number; lng: number }) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export function MapSelector({
  onLocationSelect,
  selectedLocation,
}: MapSelectorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = "#E0F2FE";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let i = 0; i < height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(width, i);
      ctx.stroke();
    }

    // Draw Tamil Nadu outline (simplified)
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 30, width - 40, height - 60);

    // Draw major cities
    MAJOR_CITIES_TN.forEach((city) => {
      const { x, y } = latLngToPixel(city.lat, city.lng, width, height);

      // Draw city marker
      ctx.fillStyle = "#FF8A00";
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 6, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Draw selected location
    if (selectedLocation) {
      const { x, y } = latLngToPixel(
        selectedLocation.lat,
        selectedLocation.lng,
        width,
        height,
      );

      // Draw selection circle
      ctx.strokeStyle = "#2ECC71";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.stroke();

      // Draw inner fill
      ctx.fillStyle = "#2ECC7177";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw title
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText("Tamil Nadu Map - Click to select location", 20, 20);
  };

  useEffect(() => {
    drawMap();
  }, [selectedLocation]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const { lat, lng } = pixelToLatLng(x, y, canvas.width, canvas.height);

    // Clamp to Tamil Nadu bounds
    onLocationSelect({
      lat: Math.max(8.0, Math.min(13.5, lat)),
      lng: Math.max(76.5, Math.min(80.5, lng)),
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let cityFound: string | null = null;

    MAJOR_CITIES_TN.forEach((city) => {
      const { x: px, y: py } = latLngToPixel(
        city.lat,
        city.lng,
        canvas.width,
        canvas.height,
      );

      const distance = Math.sqrt((x - px) ** 2 + (y - py) ** 2);
      if (distance < 12) {
        cityFound = city.name;
      }
    });

    setHoveredCity(cityFound);
    canvas.style.cursor = cityFound ? "pointer" : "crosshair";
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          onMouseLeave={() => setHoveredCity(null)}
          className="w-full border border-gray-300 rounded-lg cursor-crosshair"
          style={{ background: "#E0F2FE" }}
        />
      </div>

      {hoveredCity && (
        <div className="px-3 py-2 rounded-lg bg-blue-50 border border-blue-200">
          <p className="text-sm font-medium text-blue-900">{hoveredCity}</p>
        </div>
      )}

      {selectedLocation && (
        <div className="px-4 py-3 rounded-lg bg-green-50 border border-green-200 space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">
              Selected Location
            </span>
          </div>
          <p className="text-xs text-green-700">
            Latitude: {selectedLocation.lat.toFixed(4)}°N
          </p>
          <p className="text-xs text-green-700">
            Longitude: {selectedLocation.lng.toFixed(4)}°E
          </p>
          <p className="text-xs text-green-700 font-medium">
            Location:{" "}
            {getLocationName(selectedLocation.lat, selectedLocation.lng)}
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {MAJOR_CITIES_TN.slice(0, 6).map((city) => (
          <button
            key={city.name}
            onClick={() => onLocationSelect({ lat: city.lat, lng: city.lng })}
            className="px-3 py-2 text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-all"
          >
            {city.name}
          </button>
        ))}
      </div>
    </div>
  );
}
