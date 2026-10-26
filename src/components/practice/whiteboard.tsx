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
  const dprRef = useRef(1);
  const [tool, setTool] = useState<Tool>("pen");

  useEffect(() => {
    toolRef.current = tool;
  }, [tool]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function paintGrid() {
      if (!canvas || !ctx) return;
      const w = canvas.width;
      const h = canvas.height;
      const dpr = dprRef.current;
      const step = 24 * dpr;

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#f4f7f2";
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(15, 55, 40, 0.12)";
      ctx.lineWidth = Math.max(1, dpr * 0.75);
      for (let x = 0; x <= w; x += step) {
        ctx.beginPath();
        ctx.moveTo(x + 0.5, 0);
        ctx.lineTo(x + 0.5, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y + 0.5);
        ctx.lineTo(w, y + 0.5);
        ctx.stroke();
      }
      ctx.restore();
    }

    function resize() {
      if (!canvas || !container || !ctx) return;
      const rect = container.getBoundingClientRect();
      const cssW = Math.max(Math.floor(rect.width), 280);
      const cssH = Math.max(240, Math.min(380, Math.round(cssW * 0.42)));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const nextW = Math.round(cssW * dpr);
      const nextH = Math.round(cssH * dpr);

      if (canvas.width === nextW && canvas.height === nextH) return;

      let snapshot: ImageData | null = null;
      if (canvas.width > 0 && canvas.height > 0) {
        try {
          snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
        } catch {
          snapshot = null;
        }
      }

      dprRef.current = dpr;
      canvas.width = nextW;
      canvas.height = nextH;
      canvas.style.width = `${cssW}px`;
      canvas.style.height = `${cssH}px`;
      paintGrid();

      if (snapshot) {
        const tmp = document.createElement("canvas");
        tmp.width = snapshot.width;
        tmp.height = snapshot.height;
        const tmpCtx = tmp.getContext("2d");
        if (tmpCtx) {
          tmpCtx.putImageData(snapshot, 0, 0);
          ctx.drawImage(tmp, 0, 0, nextW, nextH);
        }
      }
    }

    resize();
    const ro = new ResizeObserver(() => {
      requestAnimationFrame(resize);
    });
    ro.observe(container);
    window.addEventListener("resize", resize);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  function eventPoint(
    e: Pick<PointerEvent | MouseEvent | Touch, "clientX" | "clientY">,
  ): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const dpr = dprRef.current || 1;
    return {
      x: (e.clientX - rect.left) * dpr,
      y: (e.clientY - rect.top) * dpr,
    };
  }

  function brush(ctx: CanvasRenderingContext2D) {
    const dpr = dprRef.current || 1;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    if (toolRef.current === "eraser") {
      ctx.globalCompositeOperation = "destination-out";
      ctx.strokeStyle = "rgba(0,0,0,1)";
      ctx.fillStyle = "rgba(0,0,0,1)";
      ctx.lineWidth = 22 * dpr;
    } else {
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "#14352c";
      ctx.fillStyle = "#14352c";
      ctx.lineWidth = 3 * dpr;
    }
  }

  function stamp(ctx: CanvasRenderingContext2D, point: Point) {
    brush(ctx);
    const dpr = dprRef.current || 1;
    const r = (toolRef.current === "eraser" ? 11 : 1.5) * dpr;
    ctx.beginPath();
    ctx.arc(point.x, point.y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  function strokeTo(ctx: CanvasRenderingContext2D, point: Point) {
    if (!lastPointRef.current) {
      stamp(ctx, point);
      lastPointRef.current = point;
      return;
    }
    brush(ctx);
    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
    lastPointRef.current = point;
  }

  function beginDraw(
    e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>,
  ) {
    if ("button" in e && e.button !== 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    e.preventDefault();
    if ("pointerId" in e) {
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }

    drawingRef.current = true;
    const point = eventPoint(e.nativeEvent);
    lastPointRef.current = point;
    stamp(ctx, point);
  }

  function moveDraw(
    e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>,
  ) {
    if (!drawingRef.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    e.preventDefault();
    strokeTo(ctx, eventPoint(e.nativeEvent));
  }

  function endDraw(
    e: React.PointerEvent<HTMLCanvasElement> | React.MouseEvent<HTMLCanvasElement>,
  ) {
    if (!drawingRef.current) return;
    drawingRef.current = false;
    lastPointRef.current = null;
    if ("pointerId" in e) {
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
    }
  }

  function clearBoard() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = dprRef.current || 1;
    const step = 24 * dpr;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#f4f7f2";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(15, 55, 40, 0.12)";
    ctx.lineWidth = Math.max(1, dpr * 0.75);
    for (let x = 0; x <= canvas.width; x += step) {
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, canvas.height);
      ctx.stroke();
    }
    for (let y = 0; y <= canvas.height; y += step) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(canvas.width, y + 0.5);
      ctx.stroke();
    }
    ctx.restore();
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <div className="flex flex-wrap items-center gap-2">
        <div>
          <p className="text-sm text-[color:var(--chalk)]">Дошка для розв’язку</p>
          <p className="text-xs text-[color:var(--mist)]">
            Пишіть мишею або пальцем — олівець активний
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
          className="touch-none block cursor-crosshair"
          style={{ touchAction: "none", display: "block", width: "100%" }}
          onPointerDown={beginDraw}
          onPointerMove={moveDraw}
          onPointerUp={endDraw}
          onPointerCancel={endDraw}
          onMouseDown={beginDraw}
          onMouseMove={moveDraw}
          onMouseUp={endDraw}
          onMouseLeave={(e) => {
            if (drawingRef.current) endDraw(e);
          }}
        />
      </div>
    </div>
  );
}
