import { useRef, useEffect, useState } from "react";
import {
  ZoomIn,
  ZoomOut,
  Crosshair,
  RotateCcw,
  MapPin,
  Info,
} from "lucide-react";
import {
  latLngToPixel,
  pixelToLatLng,
  getLocationName,
  MAJOR_CITIES_TN,
  TAMIL_NADU_BOUNDS,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
} from "../../../lib/mapUtils";
import type { Outlet } from "../../../lib/types";

interface InteractiveMapProps {
  outlets: Outlet[];
  selectedOutletId?: string | null;
  onOutletSelect: (outletId: string) => void;
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  isSelectionMode?: boolean;
}

export function InteractiveMap({
  outlets,
  selectedOutletId,
  onOutletSelect,
  onLocationSelect,
  isSelectionMode = false,
}: InteractiveMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [hoveredOutletId, setHoveredOutletId] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const getVolumeColor = (volume: string) => {
    switch (volume) {
      case "high":
        return { fill: "#2ECC71", border: "#27AE60" };
      case "medium":
        return { fill: "#FF8A00", border: "#E67E22" };
      case "low":
        return { fill: "#94A3B8", border: "#64748B" };
      default:
        return { fill: "#94A3B8", border: "#64748B" };
    }
  };

  const drawMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas with gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#E0F2FE");
    gradient.addColorStop(1, "#F0E7FF");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Draw grid for reference
    const gridSize = 40 * zoom;
    ctx.strokeStyle = "rgba(203, 213, 225, 0.3)";
    ctx.lineWidth = 0.5;

    for (let i = -gridSize; i < width + gridSize; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(i + panX, -gridSize + panY);
      ctx.lineTo(i + panX, height + gridSize + panY);
      ctx.stroke();
    }

    for (let i = -gridSize; i < height + gridSize; i += gridSize) {
      ctx.beginPath();
      ctx.moveTo(-gridSize + panX, i + panY);
      ctx.lineTo(width + gridSize + panX, i + panY);
      ctx.stroke();
    }

    // Draw Tamil Nadu outline
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 2;
    const topLeft = latLngToPixel(
      TAMIL_NADU_BOUNDS.north,
      TAMIL_NADU_BOUNDS.west,
      width,
      height,
      zoom,
      panX,
      panY,
    );
    const bottomRight = latLngToPixel(
      TAMIL_NADU_BOUNDS.south,
      TAMIL_NADU_BOUNDS.east,
      width,
      height,
      zoom,
      panX,
      panY,
    );

    ctx.strokeRect(
      topLeft.x,
      topLeft.y,
      bottomRight.x - topLeft.x,
      bottomRight.y - topLeft.y,
    );

    // Draw major cities as reference points
    MAJOR_CITIES_TN.forEach((city) => {
      const { x, y } = latLngToPixel(
        city.lat,
        city.lng,
        width,
        height,
        zoom,
        panX,
        panY,
      );

      const isHovered = hoveredCity === city.name;
      const markerRadius = isHovered ? 6 : 4;

      ctx.fillStyle = isHovered ? "#64748B" : "#E2E8F0";
      ctx.beginPath();
      ctx.arc(x, y, markerRadius, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#94A3B8";
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw city label if hovered
      if (isHovered) {
        ctx.font = "11px sans-serif";
        ctx.fillStyle = "#1E293B";
        const textWidth = ctx.measureText(city.name).width;
        ctx.fillRect(x - textWidth / 2 - 3, y - 18, textWidth + 6, 16);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(city.name, x - textWidth / 2, y - 6);
      }
    });

    // Draw outlet markers
    outlets.forEach((outlet) => {
      if (!outlet.location || typeof outlet.location !== "object") {
        return;
      }

      const lat = (outlet.location as any).lat;
      const lng = (outlet.location as any).lng;

      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }

      const { x, y } = latLngToPixel(lat, lng, width, height, zoom, panX, panY);
      const colors = getVolumeColor(outlet.salesVolume);
      const isSelected = outlet.id === selectedOutletId;
      const isHovered = outlet.id === hoveredOutletId;

      const markerSize = isSelected ? 12 : isHovered ? 10 : 8;

      // Draw shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.beginPath();
      ctx.arc(x + 1, y + 1, markerSize, 0, Math.PI * 2);
      ctx.fill();

      // Draw marker
      ctx.fillStyle = colors.fill;
      ctx.beginPath();
      ctx.arc(x, y, markerSize, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = colors.border;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.stroke();

      // Draw glow effect if selected
      if (isSelected) {
        ctx.strokeStyle = colors.fill + "40";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, y, markerSize + 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw outlet label if hovered
      if (isHovered) {
        ctx.font = "bold 12px sans-serif";
        ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
        const textWidth = ctx.measureText(outlet.name).width;
        ctx.fillRect(x - textWidth / 2 - 4, y - 24, textWidth + 8, 18);
        ctx.fillStyle = "#ffffff";
        ctx.fillText(outlet.name, x - textWidth / 2, y - 10);
      }
    });

    // Draw crosshair if in selection mode
    if (isSelectionMode && selectedLocation) {
      const { x, y } = latLngToPixel(
        selectedLocation.lat,
        selectedLocation.lng,
        width,
        height,
        zoom,
        panX,
        panY,
      );

      ctx.strokeStyle = "#2ECC71";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(x, y, 15, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = "#2ECC7722";
      ctx.beginPath();
      ctx.arc(x, y, 12, 0, Math.PI * 2);
      ctx.fill();

      // Draw crosshair lines
      ctx.strokeStyle = "#2ECC71";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x - 20, y);
      ctx.lineTo(x - 8, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + 8, y);
      ctx.lineTo(x + 20, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y - 20);
      ctx.lineTo(x, y - 8);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y + 8);
      ctx.lineTo(x, y + 20);
      ctx.stroke();
    }

    // Draw zoom level
    ctx.font = "12px sans-serif";
    ctx.fillStyle = "rgba(30, 41, 59, 0.7)";
    ctx.fillText(`Zoom: ${zoom.toFixed(1)}x`, 10, height - 10);

    // Draw title
    ctx.font = "bold 14px sans-serif";
    ctx.fillStyle = "#1E293B";
    ctx.fillText(
      `Tamil Nadu Distribution Map - ${outlets.length} Outlets`,
      10,
      25,
    );
  };

  useEffect(() => {
    drawMap();
  }, [
    zoom,
    panX,
    panY,
    selectedOutletId,
    hoveredCity,
    hoveredOutletId,
    selectedLocation,
    outlets,
  ]);

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;

      setPanX((prev) => prev + deltaX);
      setPanY((prev) => prev + deltaY);
      setDragStart({ x: e.clientX, y: e.clientY });

      canvas.style.cursor = "grabbing";
      return;
    }

    // Check hover over cities
    let overCity = false;
    MAJOR_CITIES_TN.forEach((city) => {
      const { x: cx, y: cy } = latLngToPixel(
        city.lat,
        city.lng,
        canvas.width,
        canvas.height,
        zoom,
        panX,
        panY,
      );

      const distance = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (distance < 12) {
        setHoveredCity(city.name);
        overCity = true;
      }
    });

    if (!overCity) {
      setHoveredCity(null);
    }

    // Check hover over outlets
    let overOutlet = false;
    outlets.forEach((outlet) => {
      if (!outlet.location || typeof outlet.location !== "object") {
        return;
      }

      const lat = (outlet.location as any).lat;
      const lng = (outlet.location as any).lng;

      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }

      const { x: ox, y: oy } = latLngToPixel(
        lat,
        lng,
        canvas.width,
        canvas.height,
        zoom,
        panX,
        panY,
      );

      const distance = Math.sqrt((x - ox) ** 2 + (y - oy) ** 2);
      if (distance < 18) {
        setHoveredOutletId(outlet.id);
        overOutlet = true;
      }
    });

    if (!overOutlet) {
      setHoveredOutletId(null);
    }

    canvas.style.cursor = overOutlet
      ? "pointer"
      : hoveredCity
        ? "help"
        : "grab";
  };

  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };

  const handleCanvasMouseLeave = () => {
    setIsDragging(false);
    setHoveredCity(null);
    setHoveredOutletId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if clicked on an outlet marker
    outlets.forEach((outlet) => {
      if (!outlet.location || typeof outlet.location !== "object") {
        return;
      }

      const lat = (outlet.location as any).lat;
      const lng = (outlet.location as any).lng;

      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }

      const { x: ox, y: oy } = latLngToPixel(
        lat,
        lng,
        canvas.width,
        canvas.height,
        zoom,
        panX,
        panY,
      );

      const distance = Math.sqrt((x - ox) ** 2 + (y - oy) ** 2);

      if (distance < 18) {
        onOutletSelect(outlet.id);
        return;
      }
    });

    // If in selection mode and not clicked on outlet, select location
    if (isSelectionMode) {
      const { lat, lng } = pixelToLatLng(
        x,
        y,
        canvas.width,
        canvas.height,
        zoom,
        panX,
        panY,
      );

      setSelectedLocation({
        lat: Math.max(
          TAMIL_NADU_BOUNDS.south,
          Math.min(TAMIL_NADU_BOUNDS.north, lat),
        ),
        lng: Math.max(
          TAMIL_NADU_BOUNDS.west,
          Math.min(TAMIL_NADU_BOUNDS.east, lng),
        ),
      });

      if (onLocationSelect) {
        onLocationSelect({
          lat: Math.max(
            TAMIL_NADU_BOUNDS.south,
            Math.min(TAMIL_NADU_BOUNDS.north, lat),
          ),
          lng: Math.max(
            TAMIL_NADU_BOUNDS.west,
            Math.min(TAMIL_NADU_BOUNDS.east, lng),
          ),
        });
      }
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(MAX_ZOOM, prev + ZOOM_STEP));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(MIN_ZOOM, prev - ZOOM_STEP));
  };

  const handleReset = () => {
    setZoom(DEFAULT_ZOOM);
    setPanX(0);
    setPanY(0);
    setSelectedLocation(null);
  };

  const handleCenterCity = (city: (typeof MAJOR_CITIES_TN)[0]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Calculate pan to center the city
    const { x, y } = latLngToPixel(
      city.lat,
      city.lng,
      canvas.width,
      canvas.height,
      zoom,
      0,
      0,
    );

    setPanX((canvas.width / 2 - x) * 1.2);
    setPanY((canvas.height / 2 - y) * 1.2);
    setZoom(1.5);
  };

  return (
    <div
      ref={containerRef}
      className="space-y-4"
      role="region"
      aria-label="Tamil Nadu Distribution Map"
    >
      {/* Controls */}
      <div className="flex items-center justify-between bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomIn}
            aria-label="Zoom in"
            title="Zoom in (press + or scroll up)"
            className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-all"
          >
            <ZoomIn className="w-5 h-5" />
          </button>

          <div className="px-3 py-1 bg-gray-100 rounded text-sm font-medium text-gray-700">
            {zoom.toFixed(1)}x
          </div>

          <button
            onClick={handleZoomOut}
            aria-label="Zoom out"
            title="Zoom out (press - or scroll down)"
            className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-all"
          >
            <ZoomOut className="w-5 h-5" />
          </button>

          <div className="w-px h-6 bg-gray-300" />

          <button
            onClick={handleReset}
            aria-label="Reset map"
            title="Reset map view"
            className="p-2 hover:bg-orange-100 rounded-lg text-orange-600 transition-all"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {isSelectionMode && selectedLocation && (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-lg border border-green-200">
            <MapPin className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              {getLocationName(selectedLocation.lat, selectedLocation.lng)}
            </span>
          </div>
        )}
      </div>

      {/* Quick city selector */}
      <div className="bg-white rounded-lg p-3 border border-gray-200">
        <p className="text-xs font-semibold text-gray-600 mb-2">
          Quick Navigation:
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MAJOR_CITIES_TN.slice(0, 6).map((city) => (
            <button
              key={city.name}
              onClick={() => handleCenterCity(city)}
              className="px-2 py-1 text-xs font-medium bg-orange-50 hover:bg-orange-100 text-orange-700 rounded transition-all"
              title={`Center map on ${city.name}`}
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1000}
        height={600}
        onClick={handleCanvasClick}
        onMouseDown={handleCanvasMouseDown}
        onMouseMove={handleCanvasMouseMove}
        onMouseUp={handleCanvasMouseUp}
        onMouseLeave={handleCanvasMouseLeave}
        onWheel={(e) => {
          e.preventDefault();
          if (e.deltaY < 0) {
            handleZoomIn();
          } else {
            handleZoomOut();
          }
        }}
        className="w-full border-2 border-gray-300 rounded-lg cursor-grab active:cursor-grabbing"
        style={{ background: "#E0F2FE", touchAction: "none" }}
        role="img"
        aria-label={`Tamil Nadu map with ${outlets.length} outlets. Use mouse to pan, scroll or buttons to zoom.`}
      />

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-700 space-y-1">
          <p className="font-medium">
            {isSelectionMode
              ? "Click on the map to select a location for the outlet"
              : "Click on markers to view outlet details"}
          </p>
          <p className="text-xs opacity-90">
            Drag to pan • Scroll or use buttons to zoom • Click quick navigation
            buttons to jump to cities
          </p>
        </div>
      </div>
    </div>
  );
}
