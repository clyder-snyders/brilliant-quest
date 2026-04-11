import React from 'react';
import { useGame } from '../game/GameContext';
import { IconGamepad, IconLightbulb, IconCode, IconCheck, IconShield, IconSchool, IconUsers, IconHeart, IconLock } from '../components/Icons';

export default function AboutScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8" style={{ background: 'linear-gradient(180deg, #F0F5FF 0%, #F7F9FC 100%)' }}>
      <button
        onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'welcome' })}
        className="absolute top-4 left-4 p-2 rounded-lg transition-colors"
        style={{ color: 'hsl(215, 16%, 47%)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="max-w-2xl w-full game-card">
        <h1 className="text-4xl font-bold mb-6 text-center" style={{ color: 'hsl(217, 33%, 17%)' }}>
          About Brilliant OS
        </h1>

        <div className="space-y-6" style={{ color: 'hsl(215, 16%, 47%)' }}>
          <section>
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              What is Brilliant OS?
            </h2>
            <p className="text-base leading-relaxed">
              Brilliant OS is an interactive educational game designed to teach programming concepts through engaging puzzle challenges. Perfect for students aged 8-18 and anyone interested in learning to code!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <IconGamepad size={22} color="hsl(217, 91%, 60%)" /> How It Works
            </h2>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>50 Levels:</strong> Progress through 4 difficulty zones</li>
              <li><strong>Learn Concepts:</strong> Sequencing, Loops, Conditionals, Functions</li>
              <li><strong>Puzzle Solving:</strong> Program a robot to reach the goal</li>
              <li><strong>Earn Stars:</strong> Master each level for optimal solutions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <IconLightbulb size={22} color="hsl(43, 96%, 56%)" /> Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { zone: 'Zone 1', title: 'Foundations', color: 'hsl(168, 76%, 90%)', textColor: 'hsl(168, 76%, 40%)' },
                { zone: 'Zone 2', title: 'Builder', color: 'hsl(217, 91%, 95%)', textColor: 'hsl(217, 91%, 60%)' },
                { zone: 'Zone 3', title: 'Architect', color: 'hsl(258, 90%, 92%)', textColor: 'hsl(258, 90%, 66%)' },
                { zone: 'Zone 4', title: 'Master', color: 'hsl(217, 33%, 30%)', textColor: 'white' },
              ].map((z) => (
                <div
                  key={z.zone}
                  className="p-4 rounded-lg text-center font-semibold"
                  style={{ background: z.color, color: z.textColor }}
                >
                  <p className="font-bold">{z.zone}</p>
                  <p className="text-sm">{z.title}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <IconCheck size={22} color="hsl(168, 76%, 40%)" /> Features
            </h2>
            <ul className="space-y-2">
              {[
                { icon: <IconCheck size={14} color="hsl(168, 76%, 40%)" />, text: <><strong>Completely Free</strong> — No ads, no charges, ever</> },
                { icon: <IconCode size={14} color="hsl(168, 76%, 40%)" />, text: <><strong>Offline Support</strong> — Play without internet connection</> },
                { icon: <IconGamepad size={14} color="hsl(168, 76%, 40%)" />, text: <><strong>Fully Responsive</strong> — Works on all devices</> },
                { icon: <IconLock size={14} color="hsl(168, 76%, 40%)" />, text: <><strong>Save Progress</strong> — Your progress is saved automatically</> },
                { icon: <IconLightbulb size={14} color="hsl(168, 76%, 40%)" />, text: <><strong>Educational</strong> — Real coding concepts</> },
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">{item.icon} {item.text}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <IconSchool size={22} color="hsl(258, 90%, 66%)" /> For Educators
            </h2>
            <p className="mb-3">
              Brilliant OS is perfect for classrooms, coding clubs, and independent learning. Use it to teach fundamental programming concepts in an engaging, game-based format.
            </p>
            <p className="text-sm font-semibold">
              Questions? Use the Feedback button to reach out!
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <IconUsers size={22} color="hsl(217, 91%, 60%)" /> Help & Support
            </h2>
            <p className="mb-3">
              Found a bug? Have suggestions? Click the Feedback button in-game to share your thoughts! We read every message.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <IconShield size={22} color="hsl(168, 76%, 40%)" /> Privacy & License
            </h2>
            <p className="text-sm">
              Brilliant OS respects your privacy. We don't track personal data or show ads. Your game progress is saved locally on your device using browser storage.
            </p>
          </section>

          <section style={{ background: 'hsl(220, 33%, 95%)', padding: '1rem', borderRadius: '0.875rem' }}>
            <p className="text-center text-sm flex items-center justify-center gap-1" style={{ color: 'hsl(217, 33%, 17%)' }}>
              <strong>Made with</strong> <IconHeart size={14} color="hsl(0, 84%, 60%)" /> <strong>for learners everywhere</strong>
              <br />
            </p>
            <p className="text-center text-xs mt-1" style={{ color: 'hsl(215, 16%, 47%)' }}>Version 1.0.0 — April 2026</p>
          </section>
        </div>

        <button
          onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'welcome' })}
          className="mt-8 w-full btn-primary"
        >
          Back to Welcome
        </button>
      </div>
    </div>
  );
}
