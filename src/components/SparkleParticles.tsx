import React, { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

export default function SparkleParticles() {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setInit(true));
  }, []);

  if (!init) return null;

  return (
    <Particles
      id="quiz-sparkle"
      options={{
        background: { color: { value: "transparent" } },
        fpsLimit: 60,
        emitters: { position: { x: 20, y: 80 }, rate: { quantity: 15, delay: 0 }, life: { count: 1 } },
        particles: {
          color: { value: ["#ffcc00", "#ff69b4", "#58cc02", "#00e5ff", "#e040fb"] },
          move: { enable: true, speed: { min: 3, max: 8 }, direction: "top-right" as const, outModes: { default: "out" as const } },
          number: { value: 0 },
          opacity: { value: { min: 0.5, max: 1 }, animation: { enable: true, speed: 3, startValue: "max" as const, destroy: "min" as const } },
          shape: { type: ["star", "circle"] },
          size: { value: { min: 3, max: 8 } },
          life: { duration: { value: 1.5 }, count: 1 },
        },
        detectRetina: true,
      }}
      className="absolute inset-0 z-[30] pointer-events-none"
    />
  );
}
