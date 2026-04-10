import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { AvatarDisplay, avatarNames } from '../game/avatars';
import { AvatarId } from '../game/types';

const avatarIds: AvatarId[] = ['spark', 'nova', 'bolt', 'pixel', 'orbit', 'ghost'];

export default function SetupScreen() {
  const { dispatch } = useGame();
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState<AvatarId>('spark');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter your name.');
      return;
    }
    if (trimmed.length > 50) {
      setError('Name must be 50 characters or less.');
      return;
    }
    dispatch({ type: 'SET_PROFILE', name: trimmed, avatar });
    dispatch({ type: 'SET_SCREEN', screen: 'levelMap' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #F0F5FF 0%, #F7F9FC 100%)' }}>
      <div className="game-card w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={() => dispatch({ type: 'SET_SCREEN', screen: 'welcome' })} className="mr-3 p-1 rounded-lg hover:bg-[hsl(220,33%,95%)] transition-colors" style={{ color: 'hsl(215, 16%, 47%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(217, 33%, 17%)' }}>Set Up Your Profile</h2>
            <p className="text-sm mt-1" style={{ color: 'hsl(215, 16%, 47%)' }}>Personalize your experience before you start</p>
          </div>
          <div className="w-8" />
        </div>

        {/* Name Input */}
        <div className="mb-6">
          <label className="block text-xs font-medium uppercase tracking-wider mb-2" style={{ color: 'hsl(215, 16%, 47%)' }}>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError(''); }}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 rounded-[14px] text-base outline-none transition-colors"
            style={{
              border: error ? '2px solid hsl(0, 84%, 60%)' : '2px solid hsl(214, 32%, 91%)',
              background: 'white',
              fontFamily: 'Inter, sans-serif',
            }}
            onFocus={e => { if (!error) e.target.style.borderColor = 'hsl(217, 91%, 60%)'; }}
            onBlur={e => { if (!error) e.target.style.borderColor = 'hsl(214, 32%, 91%)'; }}
          />
          {error && <p className="text-xs mt-1" style={{ color: 'hsl(0, 84%, 60%)' }}>{error}</p>}
        </div>

        {/* Avatar Selection */}
        <div className="mb-6">
          <label className="block text-xs font-medium uppercase tracking-wider mb-3" style={{ color: 'hsl(215, 16%, 47%)' }}>Choose Your Avatar</label>
          <div className="grid grid-cols-3 gap-3">
            {avatarIds.map(id => (
              <button
                key={id}
                onClick={() => setAvatar(id)}
                className="flex flex-col items-center p-3 rounded-[14px] transition-all duration-200"
                style={{
                  border: avatar === id ? '2px solid hsl(217, 91%, 60%)' : '2px solid transparent',
                  background: avatar === id ? 'hsl(217, 91%, 97%)' : 'hsl(220, 33%, 95%)',
                }}
              >
                <AvatarDisplay avatarId={id} size={48} />
                <span className="text-xs font-medium mt-1" style={{ color: 'hsl(217, 33%, 17%)' }}>{avatarNames[id]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* How it works */}
        <div className="rounded-[14px] p-4 mb-6" style={{ background: 'hsl(220, 33%, 95%)' }}>
          <div className="flex items-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="hsl(217, 91%, 60%)"><circle cx="9" cy="9" r="8" fill="none" stroke="currentColor" strokeWidth="1.5" /><text x="9" y="13" textAnchor="middle" fontSize="12" fill="currentColor" fontWeight="bold">i</text></svg>
            <span className="font-bold text-sm" style={{ color: 'hsl(217, 33%, 17%)' }}>How it works</span>
          </div>
          <div className="text-sm space-y-1" style={{ color: 'hsl(215, 16%, 47%)' }}>
            <p>• Build command sequences to guide your robot to the goal</p>
            <p>• Earn up to 3 stars per level — speed, efficiency, and accuracy</p>
            <p>• Unlock harder levels as you complete each stage</p>
          </div>
        </div>

        {/* Submit */}
        <button className="btn-primary w-full text-base" onClick={handleSubmit}>
          Start Playing →
        </button>
      </div>
    </div>
  );
}
