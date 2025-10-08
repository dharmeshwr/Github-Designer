"use client"
import { useEffect, useRef } from 'react';

// Define an interface for the component's props for type safety
interface SparkEffectProps {
  selector?: string;
  amount?: number;
  speed?: number;
  lifetime?: number;
  direction?: { x: number; y: number };
  size?: [number, number];
  maxopacity?: number;
  color?: string;
  randColor?: boolean;
  acceleration?: [number, number];
}

// Define the shape of the options object for internal use
type SparkOptions = Required<Omit<SparkEffectProps, 'selector'>>;

// --- Main Component ---
export function SparkEffect({
  selector = '#sparks',
  amount = 50,
  speed = 0.05,
  lifetime = 200,
  direction = { x: -0.5, y: 1 },
  size = [2, 2],
  maxopacity = 1,
  color = '150, 150, 150',
  randColor = true,
  acceleration = [5, 40]
}: SparkEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Check for the canvas element before proceeding. This solves the "'canvas' is possibly 'null'" error.
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Build the options object with runtime adjustments
    const OPT: SparkOptions = {
      amount,
      speed: window.innerWidth < 520 ? 0.05 : speed,
      lifetime,
      direction,
      size,
      maxopacity,
      color: window.innerWidth < 520 ? '150, 150, 150' : color,
      randColor,
      acceleration
    };

    // Explicitly type the sparks array
    let sparks: Spark[] = [];
    let animationFrameId: number;
    let intervalId: NodeJS.Timeout;

    // Helper function with typed parameters
    const rand = (min: number, max: number): number => {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    // --- Spark Class ---
    // Converting the constructor function to a class solves all 'this' and 'new' expression errors.
    class Spark {
      x: number;
      y: number;
      age: number = 0;
      acceleration: number;
      color: string;
      opacity: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.acceleration = rand(OPT.acceleration[0], OPT.acceleration[1]);
        this.color = OPT.randColor
          ? `${rand(0, 255)},${rand(0, 255)},${rand(0, 255)}`
          : OPT.color;
        this.opacity = OPT.maxopacity;
      }

      go() {
        this.x += OPT.speed * OPT.direction.x * this.acceleration / 2;
        this.y += OPT.speed * OPT.direction.y * this.acceleration / 2;
        this.opacity = OPT.maxopacity - ++this.age / OPT.lifetime;
      }
    }

    const setCanvasWidth = () => {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
    };

    const addSpark = () => {
      const x = rand(-200, window.innerWidth + 200);
      const y = rand(-200, window.innerHeight + 200);
      sparks.push(new Spark(x, y));
    };

    // The 'spark' parameter is now correctly typed because 'sparks' is a typed array.
    const drawSpark = (spark: Spark) => {
      spark.go();
      ctx.beginPath();
      ctx.fillStyle = `rgba(${spark.color}, ${spark.opacity})`;
      ctx.rect(spark.x, spark.y, OPT.size[0], OPT.size[1]);
      ctx.fill();
    };

    const draw = () => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Filter out dead sparks first to avoid issues with splicing while iterating
      sparks = sparks.filter(spark => spark.opacity > 0);

      sparks.forEach(drawSpark);

      animationFrameId = window.requestAnimationFrame(draw);
    };

    const init = () => {
      setCanvasWidth();
      intervalId = setInterval(() => {
        if (sparks.length < OPT.amount) {
          addSpark();
        }
      }, 1000 / OPT.amount);
      animationFrameId = window.requestAnimationFrame(draw);
    };

    window.addEventListener('resize', setCanvasWidth);
    init();

    // Cleanup function to prevent memory leaks
    return () => {
      window.removeEventListener('resize', setCanvasWidth);
      window.cancelAnimationFrame(animationFrameId);
      clearInterval(intervalId);
    };
  }, [selector, amount, speed, lifetime, direction, size, maxopacity, color, randColor, acceleration]);

  return (
    <canvas
      ref={canvasRef}
      id={selector.replace('#', '')}
      style={{
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: -1,
        background: 'transparent',
        pointerEvents: 'none',
        opacity: 0.5,
      }}
    />
  );
}
