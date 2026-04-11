import React, { useEffect, useState } from 'react';

export default function SplashScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'text' | 'exit'>('logo');

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('text'), 600);
    const t2 = setTimeout(() => setPhase('exit'), 2000);
    const t3 = setTimeout(onComplete, 2600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500"
      style={{
        background: 'linear-gradient(135deg, hsl(217, 91%, 60%) 0%, hsl(258, 90%, 66%) 50%, hsl(217, 33%, 17%) 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        pointerEvents: phase === 'exit' ? 'none' : 'auto',
      }}
    >
      {/* Logo mark */}
      <div
        className="transition-all duration-700 ease-out"
        style={{
          opacity: phase === 'logo' || phase === 'text' ? 1 : 0,
          transform: phase === 'logo' ? 'scale(0.8)' : 'scale(1)',
        }}
      >
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          {/* Grid of dots forming the logo mark */}
          {[0, 1, 2].map(r =>
            [0, 1, 2].map(c => (
              <circle
                key={`${r}-${c}`}
                cx={20 + c * 20}
                cy={20 + r * 20}
                r="5"
                fill="white"
                opacity={0.9}
              >
                <animate
                  attributeName="opacity"
                  values="0;0.9"
                  dur="0.3s"
                  begin={`${(r * 3 + c) * 0.05}s`}
                  fill="freeze"
                />
              </circle>
            ))
          )}
          {/* Connecting lines */}
          <path d="M20 20L60 20L60 60L20 60Z" stroke="white" strokeWidth="1.5" opacity="0.3" fill="none">
            <animate attributeName="stroke-dasharray" values="0 200;200 0" dur="0.8s" begin="0.3s" fill="freeze" />
          </path>
        </svg>
      </div>

      {/* Wordmark */}
      <div
        className="mt-6 text-center transition-all duration-700 ease-out"
        style={{
          opacity: phase === 'text' ? 1 : 0,
          transform: phase === 'text' ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        <h1
          className="text-3xl sm:text-4xl font-extrabold tracking-tight"
          style={{ color: 'white', fontFamily: 'Nunito, sans-serif' }}
        >
          Brilliant OS
        </h1>
        <p
          className="text-sm sm:text-base mt-2 font-medium tracking-wide"
          style={{ color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter, sans-serif' }}
        >
          Code. Solve. Level Up.
        </p>
      </div>

      {/* Subtle loading indicator */}
      <div
        className="absolute bottom-12 transition-opacity duration-500"
        style={{ opacity: phase === 'text' ? 0.6 : 0 }}
      >
        <div className="w-8 h-0.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <div
            className="h-full rounded-full"
            style={{
              background: 'rgba(255,255,255,0.7)',
              animation: 'shimmer 1.2s ease-in-out infinite',
              width: '60%',
            }}
          />
        </div>
      </div>
    </div>
  );
}
