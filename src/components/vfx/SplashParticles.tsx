import React, { useEffect, useRef } from 'react';

export const triggerSplash = (x: number, y: number) => {
  const event = new CustomEvent('vfx-splash', { detail: { x, y } });
  window.dispatchEvent(event);
};

class Drop {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 10;
    this.vy = -Math.random() * 10 - 5;
    this.size = Math.random() * 4 + 2;
    this.life = 1.0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.5; // Gravity
    this.life -= 0.02;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.fillStyle = `rgba(14, 165, 233, ${this.life})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const SplashParticles: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drops = useRef<Drop[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = drops.current.length - 1; i >= 0; i--) {
        const d = drops.current[i];
        d.update();
        d.draw(ctx);
        if (d.life <= 0) {
          drops.current.splice(i, 1);
        }
      }
      animId = requestAnimationFrame(loop);
    };
    loop();

    const handleTrigger = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        if (!detail) return;
        
        // Convert world coordinates to screen if needed, 
        // but typically the overlay is screen space and we project 
        // Logic for projection is usually handled by passing screen Coords to trigger
        // For simplicity here we assume X is relative to screen width or passed correctly
        // Real implementation requires projecting World -> Screen in BridgeSim
        
        for (let i = 0; i < 30; i++) {
          drops.current.push(new Drop(detail.x, detail.y));
        }
    };

    window.addEventListener('vfx-splash', handleTrigger);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('vfx-splash', handleTrigger);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-40" />;
};

export default SplashParticles;