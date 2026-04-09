import React from 'react';
import { useGame } from '../game/GameContext';

export default function WelcomeScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #F0F5FF 0%, #F7F9FC 100%)' }}>
      {/* Logo */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0ms' }}>
        <svg width="48" height="48" viewBox="0 0 48 48" className="mx-auto mb-4">
          {[0,1,2].map(r => [0,1,2].map(c => (
            <circle key={`${r}-${c}`} cx={12 + c * 12} cy={12 + r * 12} r="3.5" fill="hsl(217, 91%, 60%)" />
          )))}
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-[2.4rem] font-extrabold animate-fade-in-up" style={{ animationDelay: '100ms', color: 'hsl(217, 33%, 17%)' }}>
        Brilliant OS
      </h1>

      {/* Tagline */}
      <p className="text-lg mt-1 animate-fade-in-up" style={{ animationDelay: '200ms', color: 'hsl(215, 16%, 47%)' }}>
        Think in Code. Play for Real.
      </p>

      {/* Robot Illustration */}
      <div className="my-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <svg width="180" height="160" viewBox="0 0 180 160">
          {/* Grid tiles underneath */}
          {[0,1,2,3].map(i => (
            <rect key={i} x={30 + i * 32} y="110" width="30" height="30" rx="4" fill={i % 2 === 0 ? 'hsl(168, 76%, 90%)' : 'white'} stroke="hsl(214, 32%, 91%)" strokeWidth="1" />
          ))}
          {/* Robot body */}
          <rect x="62" y="30" width="56" height="70" rx="12" fill="hsl(217, 91%, 60%)" />
          {/* Antenna */}
          <line x1="90" y1="12" x2="90" y2="30" stroke="hsl(217, 91%, 60%)" strokeWidth="3" />
          <circle cx="90" cy="10" r="5" fill="hsl(43, 96%, 56%)" />
          {/* Eyes */}
          <circle cx="78" cy="55" r="8" fill="white" />
          <circle cx="102" cy="55" r="8" fill="white" />
          <circle cx="78" cy="55" r="4" fill="hsl(217, 33%, 17%)" />
          <circle cx="102" cy="55" r="4" fill="hsl(217, 33%, 17%)" />
          {/* Smile */}
          <path d="M78 72 Q90 82 102 72" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Arms */}
          <rect x="46" y="50" width="16" height="8" rx="4" fill="hsl(217, 91%, 60%)" />
          <rect x="118" y="50" width="16" height="8" rx="4" fill="hsl(217, 91%, 60%)" />
          {/* Legs */}
          <rect x="72" y="100" width="10" height="14" rx="4" fill="hsl(217, 91%, 60%)" />
          <rect x="98" y="100" width="10" height="14" rx="4" fill="hsl(217, 91%, 60%)" />
        </svg>
      </div>

      {/* Feature Badges */}
      <div className="flex gap-3 mb-8 animate-fade-in-up" style={{ animationDelay: '400ms' }}>
        {[
          { icon: '🧠', label: '50 Levels' },
          { icon: '⚡', label: 'Real Code Logic' },
          { icon: '🏆', label: 'Compete & Win' },
        ].map(b => (
          <span key={b.label} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm" style={{ background: 'hsl(220, 33%, 95%)', color: 'hsl(215, 16%, 47%)' }}>
            {b.icon} {b.label}
          </span>
        ))}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full max-w-[320px] animate-fade-in-up" style={{ animationDelay: '500ms' }}>
        <button className="btn-primary text-base" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'setup' })}>
          Get Started
        </button>
        <button className="btn-secondary text-base" onClick={() => {
          dispatch({ type: 'SET_PRACTICE', practice: true });
          dispatch({ type: 'SET_SCREEN', screen: 'levelMap' });
        }}>
          Practice Mode
        </button>
        <button className="btn-secondary text-base" onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'levelMap' })}>
          Level Map
        </button>
      </div>

      {/* Footer */}
      <p className="mt-6 flex items-center gap-1 text-xs" style={{ color: 'hsl(215, 16%, 47%)' }}>
        <svg width="14" height="14" viewBox="0 0 14 14"><rect x="3" y="6" width="8" height="6" rx="1" fill="currentColor" /><path d="M5 6 V4 a2 2 0 0 1 4 0 V6" fill="none" stroke="currentColor" strokeWidth="1.5" /></svg>
        Progress auto-saved locally
      </p>
    </div>
  );
}
