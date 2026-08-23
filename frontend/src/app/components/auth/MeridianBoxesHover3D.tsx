import React, { useRef, useEffect } from "react";

interface MeridianBoxesHover3DProps {
  isDark: boolean;
}

export default function MeridianBoxesHover3D({ isDark }: MeridianBoxesHover3DProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Full-screen native 60FPS isometric 3D canvas fallback engine (Natural Palette)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let mouse = { x: -1000, y: -1000, isInside: false };

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY, isInside: true };
    };

    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000, isInside: false };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Dynamic isometric grid covering the screen
    const tileW = 52;
    const tileH = 28;
    const boxBaseHeight = 22;
    const maxDeform = 38;
    const influenceRadius = 160;

    const cols = Math.ceil(window.innerWidth / tileW) + 6;
    const rows = Math.ceil(window.innerHeight / tileH) + 8;

    interface GridBox {
      gx: number;
      gy: number;
      curH: number;
      targetH: number;
      glow: number;
    }

    const gridBoxes: GridBox[] = [];
    for (let x = -3; x < cols; x++) {
      for (let y = -4; y < rows; y++) {
        gridBoxes.push({
          gx: x,
          gy: y,
          curH: boxBaseHeight,
          targetH: boxBaseHeight,
          glow: 0,
        });
      }
    }

    const render = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      ctx.clearRect(0, 0, w, h);

      // Depth sort for isometric projection
      gridBoxes.sort((a, b) => (a.gx + a.gy) - (b.gx + b.gy));

      gridBoxes.forEach((box) => {
        const isoX = (box.gx - box.gy) * (tileW / 2) + w / 2;
        const isoY = (box.gx + box.gy) * (tileH / 2) - 100;

        // Distance to cursor
        let targetHeight = boxBaseHeight;
        let glowFactor = 0;

        if (mouse.isInside) {
          const dx = mouse.x - isoX;
          const dy = mouse.y - isoY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < influenceRadius) {
            const f = Math.pow(Math.max(0, 1 - dist / influenceRadius), 1.8);
            targetHeight = boxBaseHeight + f * maxDeform;
            glowFactor = f;
          }
        }

        box.targetH = targetHeight;
        box.curH += (box.targetH - box.curH) * 0.18;
        box.glow += (glowFactor - box.glow) * 0.2;

        const curH = box.curH;
        const g = box.glow;

        const topCenterY = isoY - curH;
        const ptTop = { x: isoX, y: topCenterY - tileH / 2 };
        const ptRight = { x: isoX + tileW / 2 - 1.5, y: topCenterY };
        const ptBottom = { x: isoX, y: topCenterY + tileH / 2 };
        const ptLeft = { x: isoX - tileW / 2 + 1.5, y: topCenterY };

        const bRight = { x: ptRight.x, y: ptRight.y + curH };
        const bBottom = { x: ptBottom.x, y: ptBottom.y + curH };
        const bLeft = { x: ptLeft.x, y: ptLeft.y + curH };

        // Left Face (Deep Forest & Sage Tonal Gradient)
        ctx.beginPath();
        ctx.moveTo(ptLeft.x, ptLeft.y);
        ctx.lineTo(ptBottom.x, ptBottom.y);
        ctx.lineTo(bBottom.x, bBottom.y);
        ctx.lineTo(bLeft.x, bLeft.y);
        ctx.closePath();

        const lGrad = ctx.createLinearGradient(ptLeft.x, ptLeft.y, ptBottom.x, bBottom.y);
        if (isDark) {
          lGrad.addColorStop(0, `rgba(78, 125, 99, ${0.12 + g * 0.6})`);
          lGrad.addColorStop(1, "rgba(23, 36, 29, 0.95)");
        } else {
          lGrad.addColorStop(0, `rgba(78, 125, 99, ${0.15 + g * 0.5})`);
          lGrad.addColorStop(1, "rgba(235, 231, 223, 0.95)");
        }
        ctx.fillStyle = lGrad;
        ctx.fill();

        ctx.strokeStyle = isDark
          ? `rgba(78, 125, 99, ${0.2 + g * 0.6})`
          : `rgba(28, 46, 36, ${0.15 + g * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Right Face (Muted Sage)
        ctx.beginPath();
        ctx.moveTo(ptBottom.x, ptBottom.y);
        ctx.lineTo(ptRight.x, ptRight.y);
        ctx.lineTo(bRight.x, bRight.y);
        ctx.lineTo(bBottom.x, bBottom.y);
        ctx.closePath();

        const rGrad = ctx.createLinearGradient(ptBottom.x, ptBottom.y, ptRight.x, bRight.y);
        if (isDark) {
          rGrad.addColorStop(0, `rgba(110, 155, 130, ${0.15 + g * 0.6})`);
          rGrad.addColorStop(1, "rgba(15, 26, 20, 0.95)");
        } else {
          rGrad.addColorStop(0, `rgba(78, 125, 99, ${0.18 + g * 0.5})`);
          rGrad.addColorStop(1, "rgba(226, 222, 214, 0.95)");
        }
        ctx.fillStyle = rGrad;
        ctx.fill();

        ctx.strokeStyle = isDark
          ? `rgba(110, 155, 130, ${0.2 + g * 0.6})`
          : `rgba(78, 125, 99, ${0.2 + g * 0.4})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Top Face (Rhombus - Oatmeal/Cream)
        ctx.beginPath();
        ctx.moveTo(ptTop.x, ptTop.y);
        ctx.lineTo(ptRight.x, ptRight.y);
        ctx.lineTo(ptBottom.x, ptBottom.y);
        ctx.lineTo(ptLeft.x, ptLeft.y);
        ctx.closePath();

        if (isDark) {
          ctx.fillStyle = g > 0.05 ? `rgba(29, 45, 36, ${0.85 + g * 0.15})` : "#142019";
        } else {
          ctx.fillStyle = g > 0.05 ? `rgba(242, 239, 233, 0.98)` : "#FAF8F5";
        }
        ctx.fill();

        ctx.strokeStyle = isDark
          ? `rgba(244, 247, 245, ${0.1 + g * 0.5})`
          : `rgba(28, 46, 36, ${0.1 + g * 0.4})`;
        ctx.lineWidth = 1.1;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isDark]);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-auto z-0 overflow-hidden select-none">
      {/* Live Spline 3D Scene Iframe */}
      <iframe
        src="https://my.spline.design/boxeshover-9EvC3RwTbMp9fWgfwhAPjM8n/"
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-full border-0 absolute inset-0 z-10 pointer-events-auto opacity-50 dark:opacity-35"
        title="Spline Fullscreen Boxes Hover"
        loading="lazy"
      />

      {/* 60FPS Native WebGL/Canvas Fallback Engine behind iframe */}
      <canvas ref={canvasRef} className="w-full h-full absolute inset-0 z-0" />
    </div>
  );
}
