"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eraser, Pencil, Trash2 } from "lucide-react";

type Tool = "pen" | "eraser";

type Point = { x: number; y: number };

export function Whiteboard({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const drawingRef = useRef(false);
  const toolRef = useRef<Tool>("pen");
  const lastPointRef = useRef<Point | null>(null);
  const strokesRef = useRef<ImageData | null>(null);
  const sizeRef = useRef({ w: 0, h: 0, ratio: 1 });
  const [tool, setTool] = useState<Tool>("pen");
  const [ready, setReady] = useState(true);

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setReady(true);
      return;
    }

    function paintBackground(width: number, height: number, ratio: number) {
      if (!ctx) return;
      const step = 24 * ratio;
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#f4f7f2";
      ctx.fillRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(15, 55, 40, 0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(width, y + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    function setupSurface(preserve: boolean) {
      if (!canvas || !container || !ctx) return;
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      const cssW = Math.max(container.clientWidth, 280);
      const cssH = Math.max(240, Math.min(380, Math.round(cssW * 0.42)));
      const pixelW = Math.round(cssW * ratio);
      const pixelH = Math.round(cssH * ratio);

      let snapshot: ImageData | null = null;
      if (
        preserve &&
        canvas.width > 0 &&
        canvas.height > 0 &&
        sizeRef.current.w === cssW &&
        sizeRef.current.h === cssH &&
        sizeRef.current.ratio === ratio
      ) {
        return;
      }

      if (preserve && canvas.width > 0 && canvas.height > 0) {
        try {
          snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          snapshot = strokesRef.current;
        }
      }

      canvas.width = pixelW;
      canvas.height = pixelH;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      sizeRef.current = { w: cssW, h: cssH, ratio };

      paintBackground(pixelW, pixelH, ratio);

      if (snapshot) {
        const tmp = document.createElement("canvas");
        tmp.width = snapshot.width;
        tmp.height = snapshot.height;
        const tmpCtx = tmp.getContext("2d");
        if (tmpCtx) {
          tmpCtx.putImageData(snapshot, 0, 0);
          ctx.drawImage(tmp, 0, 0, pixelW, pixelH);
        }
      }

      strokesRef.current = ctx.getImageData(0, 0, pixelW, pixelH);
      setReady(true);
    }

    setupSurface(false);

    const onOrient = () => setupSurface(true);
    const ro = new ResizeObserver(() => setupSurface(true));
    ro.observe(container);
    window.addEventListener("orientationchange", onOrient);

    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", onOrient);
    };
  }, []);

  function getPoint(e: React.PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const ratio = sizeRef.current.ratio || 1;
    return {
      x: (e.clientX - rect.left) * ratio,
      y: (e.clientY - rect.top) * ratio,
    };
  }

  function configureBrush(ctx: CanvasRenderingContext2D) {
    const ratio = sizeRef.current.ratio || 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (toolRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 22 * ratio;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#14352c";
      ctx.lineWidth = 2.8 * ratio;
    }
  }

  function drawDot(ctx: CanvasRenderingContext2D, point: Point) {
    configureBrush(ctx);
    ctx.beginPath();
    ctx.arc(
      point.x,
      point.y,
      (toolRef.current === "eraser" ? 11 : 1.4) * (sizeRef.current.ratio || 1),
      0,
      Math.PI * 2,
    );
    if (toolRef.current === "eraser") {
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.fill();
    } else {
      ctx.fillStyle = "#14352c";
      ctx.fill();
    }
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    if (e.button !== undefined && e.button !== 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    e.preventDefault();
    canvas.setPointerCapture(e.pointerId);
    drawingRef.current = true;

    const point = getPoint(e);
    lastPointRef.current = point;
    drawDot(ctx, point);
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPointRef.current) return;

    e.preventDefault();
    const point = getPoint(e);
    configureBrush(ctx);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function end(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* already released */
    }
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx && canvas.width > 0) {
      strokesRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const ratio = sizeRef.current.ratio || 1;
    const step = 24 * ratio;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#f4f7f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(15, 55, 40, 0.1)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(canvas.width, y + 0.5);
      ctx.stroke();
    }
    ctx.restore();
    strokesRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <p className="text-sm text-[color:var(--chalk)]">Дошка для розв’язку</p>
          <p className="text-xs text-[color:var(--mist)]">
            {ready
              ? "Пишіть мишею або пальцем — олівець активний"
              : "Готуємо полотно…"}
          </p>
        </div>
        <div className="ml-auto flex gap-1">
          <Button
            type="button"
            size="sm"
            variant={tool === "pen" ? "default" : "outline"}
            onClick={() => setTool("pen")}
            aria-label="Олівець"
            aria-pressed={tool === "pen"}
          >
            <Pencil className="size-4" />
            <span className="hidden sm:inline">Олівець</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={tool === "eraser" ? "default" : "outline"}
            onClick={() => setTool("eraser")}
            aria-label="Гумка"
            aria-pressed={tool === "eraser"}
          >
            <Eraser className="size-4" />
            <span className="hidden sm:inline">Гумка</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={clearBoard}
            aria-label="Очистити"
          >
            <Trash2 className="size-4" />
            <span className="hidden sm:inline">Очистити</span>
          </Button>
        </div>
      </div>
      <div
        ref={containerRef}
        className="relative min-h-[240px] overflow-hidden rounded-xl border border-[color:var(--chalk-line)] bg-[#f4f7f2] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]"
      >
        <canvas
          ref={canvasRef}
          className="touch-none block h-full w-full cursor-crosshair"
          style={{ touchAction: "none" }}
          onPointerDown={start}
          onPointerMove={move}
          onPointerUp={end}
          onPointerCancel={end}
          onPointerLeave={(e) => {
            if (drawingRef.current) end(e);
          }}
        />
      </div>
    </div>
  );
}
