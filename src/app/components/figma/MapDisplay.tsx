import { useRef, useEffect } from "react";
import { latLngToPixel, MAJOR_CITIES_TN } from "../../../lib/mapUtils";
import type { Outlet } from "../../../lib/types";

interface MapDisplayProps {
  outlets: Outlet[];
  selectedOutletId?: string | null;
  onOutletSelect: (outletId: string) => void;
}

export function MapDisplay({
  outlets,
  selectedOutletId,
  onOutletSelect,
}: MapDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    // Clear canvas
    ctx.fillStyle = "#E0F2FE";
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 0.5;
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

    // Draw Tamil Nadu outline
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 30, width - 40, height - 60);

    // Draw city markers
    MAJOR_CITIES_TN.forEach((city) => {
      const { x, y } = latLngToPixel(city.lat, city.lng, width, height);

      ctx.fillStyle = "#E2E8F0";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = "#94A3B8";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Draw outlet markers
    outlets.forEach((outlet) => {
      // Check if outlet has valid coordinates
      if (!outlet.location || typeof outlet.location !== "object") {
        return;
      }

      const lat = (outlet.location as any).lat;
      const lng = (outlet.location as any).lng;

      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }

      const { x, y } = latLngToPixel(lat, lng, width, height);
      const colors = getVolumeColor(outlet.salesVolume);
      const isSelected = outlet.id === selectedOutletId;

      // Draw outlet marker
      const markerSize = isSelected ? 12 : 8;

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
    });

    // Draw title
    ctx.fillStyle = "#1E293B";
    ctx.font = "bold 14px sans-serif";
    ctx.fillText(`Outlets Distribution Map - ${outlets.length} Active`, 20, 20);

    // Draw legend
    const legendY = height - 35;
    const legendItems = [
      { label: "High Volume", color: "#2ECC71" },
      { label: "Medium", color: "#FF8A00" },
      { label: "Low", color: "#94A3B8" },
    ];

    ctx.font = "12px sans-serif";
    let legendX = 20;

    legendItems.forEach((item) => {
      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(legendX + 5, legendY, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#1E293B";
      ctx.fillText(item.label, legendX + 12, legendY + 4);

      legendX += 120;
    });
  };

  useEffect(() => {
    drawMap();
  }, [outlets, selectedOutletId]);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

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

      const { x: mx, y: my } = latLngToPixel(
        lat,
        lng,
        canvas.width,
        canvas.height,
      );

      const distance = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);

      if (distance < 15) {
        onOutletSelect(outlet.id);
      }
    });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let isOverMarker = false;

    outlets.forEach((outlet) => {
      if (!outlet.location || typeof outlet.location !== "object") {
        return;
      }

      const lat = (outlet.location as any).lat;
      const lng = (outlet.location as any).lng;

      if (typeof lat !== "number" || typeof lng !== "number") {
        return;
      }

      const { x: mx, y: my } = latLngToPixel(
        lat,
        lng,
        canvas.width,
        canvas.height,
      );

      const distance = Math.sqrt((x - mx) ** 2 + (y - my) ** 2);

      if (distance < 15) {
        isOverMarker = true;
      }
    });

    canvas.style.cursor = isOverMarker ? "pointer" : "default";
  };

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={500}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      className="w-full border border-gray-300 rounded-lg"
      style={{ background: "#E0F2FE" }}
    />
  );
}
