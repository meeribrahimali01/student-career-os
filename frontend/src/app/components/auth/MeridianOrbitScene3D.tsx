import React, { useRef, useEffect, useState } from "react";
import { motion } from "motion/react";
import { Orbit, Sparkles, BookOpen, Target, Briefcase, Award, MessageSquare } from "lucide-react";

interface MeridianOrbitScene3DProps {
  mousePos: { x: number; y: number }; // normalized -0.5 to 0.5
  onNodeClick?: (nodeId: string) => void;
}

interface OrbitingNode {
  id: string;
  label: string;
  tagline: string;
  angleOffset: number;
  radius: number;
  color: string;
  speed: number;
}

const NODES: OrbitingNode[] = [
  { id: "academics", label: "Academics", tagline: "8.60 CGPA • Semester 5 Gradebook", angleOffset: 0, radius: 110, color: "#38BDF8", speed: 0.007 },
  { id: "skills", label: "Skills", tagline: "Verified DSA, Graphs & Systems", angleOffset: Math.PI * 0.4, radius: 140, color: "#818CF8", speed: 0.005 },
  { id: "projects", label: "Projects", tagline: "Full Stack & Distributed Systems", angleOffset: Math.PI * 0.8, radius: 170, color: "#C084FC", speed: 0.004 },
  { id: "career", label: "Career", tagline: "Tier-1 Super Dream 72% Ready", angleOffset: Math.PI * 1.2, radius: 195, color: "#F59E0B", speed: 0.0035 },
  { id: "interview", label: "Interview", tagline: "Gemini AI Mock Screening", angleOffset: Math.PI * 1.6, radius: 130, color: "#10B981", speed: 0.006 },
];

export default function MeridianOrbitScene3D({
  mousePos,
  onNodeClick,
}: MeridianOrbitScene3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [activeHoverNode, setActiveHoverNode] = useState<OrbitingNode | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let baseAngle = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio || 500 * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio || 450 * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;
      const centerX = width / 2 + mousePos.x * 24;
      const centerY = height / 2 + mousePos.y * 18;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Multi-Track Orbital Guide Rings
      [80, 110, 140, 170, 195].forEach((r, idx) => {
        ctx.beginPath();
        ctx.ellipse(centerX, centerY, r, r * 0.45, mousePos.x * 0.08, 0, Math.PI * 2);
        ctx.strokeStyle = idx === 2 ? "rgba(79, 70, 229, 0.3)" : "rgba(148, 163, 184, 0.12)";
        ctx.lineWidth = idx === 2 ? 1.5 : 1;
        ctx.setLineDash(idx % 2 === 0 ? [4, 6] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      // 2. Draw Central Glowing VIT Blue Core Sphere
      const glowGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 55);
      glowGrad.addColorStop(0, "rgba(37, 99, 235, 0.95)");
      glowGrad.addColorStop(0.4, "rgba(79, 70, 229, 0.45)");
      glowGrad.addColorStop(1, "rgba(79, 70, 229, 0)");

      ctx.beginPath();
      ctx.arc(centerX, centerY, 55, 0, Math.PI * 2);
      ctx.fillStyle = glowGrad;
      ctx.fill();

      // Solid Core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 22, 0, Math.PI * 2);
      ctx.fillStyle = "#1E40AF";
      ctx.shadowColor = "#3B82F6";
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0; // reset

      // 3. Draw Orbiting Nodes & Tracks
      NODES.forEach((node) => {
        const curAngle = baseAngle * (node.speed / 0.005) + node.angleOffset;
        const x = centerX + Math.cos(curAngle) * node.radius;
        const y = centerY + Math.sin(curAngle) * (node.radius * 0.45);
        const z = Math.sin(curAngle); // pseudo depth (-1 to 1)

        const radiusScale = 6 + (z + 1) * 2;
        const alpha = 0.45 + (z + 1) * 0.28;

        // Connector line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = `rgba(129, 140, 248, ${alpha * 0.18})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Node Glow Halo
        ctx.beginPath();
        ctx.arc(x, y, radiusScale + 5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(129, 140, 248, ${alpha * 0.25})`;
        ctx.fill();

        // Node Body
        ctx.beginPath();
        ctx.arc(x, y, radiusScale, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Node Text Label
        ctx.font = "bold 10px sans-serif";
        ctx.fillStyle = `rgba(241, 245, 249, ${alpha})`;
        ctx.textAlign = "center";
        ctx.fillText(node.label, x, y - radiusScale - 4);
      });

      baseAngle += 0.008;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [mousePos]);

  return (
    <div className="relative w-full h-[380px] lg:h-[460px] flex items-center justify-center select-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full" />

      {/* Floating Center Orbit Badge */}
      <div className="absolute pointer-events-none text-center select-none">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 drop-shadow-sm block">
          MERIDIAN
        </span>
        <span className="text-sm font-black text-white drop-shadow-md">
          LEARNING ORBIT
        </span>
        <span className="text-[9px] font-mono text-slate-300 block opacity-80">
          VIT Chennai
        </span>
      </div>
    </div>
  );
}
