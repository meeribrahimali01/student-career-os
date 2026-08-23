import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Orbit } from "lucide-react";
import { GlassBadge } from "./ui/LiquidGlass";

interface MeridianOrbit3DProps {
  score?: number;
  activeStage?: string;
  onSelectStage?: (stage: string) => void;
}

export default function MeridianOrbit3D({
  score = 72,
  activeStage = "Core CS",
  onSelectStage,
}: MeridianOrbit3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Interactive 3D Canvas Simulation (Smooth 60FPS Particle Orbit)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let angle = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio || 320 * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio || 280 * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    // Natural Academic Orbit Pillars
    const nodes = [
      { id: "foundations", name: "Foundations", angleOffset: 0, radius: 80, color: "#4E7D63" },
      { id: "core_cs", name: "Core CS", angleOffset: Math.PI * 0.5, radius: 95, color: "#1C2E24" },
      { id: "systems", name: "Systems & Cloud", angleOffset: Math.PI, radius: 108, color: "#3B624E" },
      { id: "placement", name: "Career & FAANG", angleOffset: Math.PI * 1.5, radius: 118, color: "#709D85" },
    ];

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2 + mousePos.x * 10;
      const centerY = height / 2 + mousePos.y * 8;

      ctx.clearRect(0, 0, width, height);

      // Draw Orbit Ellipses
      [65, 85, 105, 120].forEach((r, idx) => {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, r, r * 0.42, mousePos.x * 0.08, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 1 ? "rgba(78, 125, 99, 0.45)" : "rgba(28, 46, 36, 0.1)";
        ctx.lineWidth = idx === 1 ? 1.5 : 1;
        ctx.stroke();
      });

      // Draw Central Meridian Core Aura
      const coreGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 32);
      coreGradient.addColorStop(0, "rgba(78, 125, 99, 0.25)");
      coreGradient.addColorStop(0.5, "rgba(28, 46, 36, 0.12)");
      coreGradient.addColorStop(1, "rgba(28, 46, 36, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Draw Central Core Sphere
      ctx.beginPath();
      ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#1C2E24";
      ctx.fill();

      // Draw Revolving Orbit Nodes
      nodes.forEach((node) => {
        const currentAngle = angle + node.angleOffset;
        const x = centerX + Math.cos(currentAngle) * node.radius;
        const y = centerY + Math.sin(currentAngle) * (node.radius * 0.42);
        const z = Math.sin(currentAngle);

        const nodeSize = 5 + z * 2;
        const alpha = 0.5 + (z + 1) * 0.25;

        // Connecting Line to Center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(78, 125, 99, ${alpha * 0.25})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Glow
        ctx.beginPath();
        ctx.arc(x, y, nodeSize + 3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(78, 125, 99, ${alpha * 0.2})`;
        ctx.fill();

        // Node Solid
        ctx.beginPath();
        ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
      });

      angle += 0.007;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative rounded-2xl bg-[#F2EFE9] dark:bg-[#1A2820] border border-[rgba(28,46,36,0.1)] dark:border-[rgba(244,247,245,0.08)] p-3.5 shadow-xs overflow-hidden flex flex-col items-center justify-between min-h-[250px]"
    >
      {/* Top Telemetry Tag */}
      <div className="w-full flex items-center justify-between text-xs z-10">
        <GlassBadge
          label="Meridian Learning Orbit"
          variant="primary"
          icon={<Orbit size={12} className="animate-spin-slow text-[#4E7D63]" />}
        />
        <span className="text-[11px] font-mono font-bold text-[#1C2E24] dark:text-[#F4F7F5]">
          {score}% Benchmark
        </span>
      </div>

      {/* Interactive 3D Canvas */}
      <div className="relative w-full h-40 flex items-center justify-center my-1 cursor-grab active:cursor-grabbing">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Center Floating Readout */}
        <div className="absolute pointer-events-none text-center select-none">
          <span className="text-[9px] font-bold uppercase tracking-wider text-[#4E7D63] dark:text-[#6E9B82] block font-mono">
            Tier-1 Radar
          </span>
          <span className="text-xl font-bold text-[#1C2E24] dark:text-[#F4F7F5] font-mono">
            {score}%
          </span>
        </div>
      </div>

      {/* Bottom Stage Stepper Pill */}
      <div className="w-full pt-2 border-t border-[rgba(28,46,36,0.08)] dark:border-[rgba(244,247,245,0.08)] flex items-center justify-between text-[11px] text-[#556B5F] dark:text-[#95AFA1] z-10">
        <span className="truncate">
          Focus: <strong className="text-[#1C2E24] dark:text-[#F4F7F5]">{activeStage}</strong>
        </span>
        <span className="text-[10px] font-semibold text-[#4E7D63] dark:text-[#6E9B82] bg-[#EDF4F0] dark:bg-[#1E2F26] border border-[rgba(78,125,99,0.3)] px-2 py-0.5 rounded-full flex items-center gap-1 flex-shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4E7D63] pulse-ai-dot" />
          Active Orbit
        </span>
      </div>
    </div>
  );
}
