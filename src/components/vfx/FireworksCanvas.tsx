import React, { useEffect, useRef } from 'react';

export const triggerFireworks = (x?: number, y?: number) => {
  const event = new CustomEvent('vfx-fireworks', { detail: { x, y } });
  window.dispatchEvent(event);
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;

  constructor(x: number, y: number, color: string) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 5 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.color = color;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += 0.1; // gravity
    this.alpha -= 0.015;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

const FireworksCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const loop = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.current.length - 1; i >= 0; i--) {
        const p = particles.current[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.current.splice(i, 1);
        }
      }
      animId = requestAnimationFrame(loop);
    };
    loop();

    const handleTrigger = (e: Event) => {
        const detail = (e as CustomEvent).detail;
        const x = detail?.x ?? canvas.width / 2;
        const y = detail?.y ?? canvas.height / 3;
        const colors = ['#00FF9F', '#FCEE0C', '#BD00FF', '#FF0055'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        for (let i = 0; i < 50; i++) {
          particles.current.push(new Particle(x, y, color));
        }
    };

    window.addEventListener('vfx-fireworks', handleTrigger);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    return () => {
      window.removeEventListener('vfx-fireworks', handleTrigger);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-50" />;
};

export default FireworksCanvas;