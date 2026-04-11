import React, { useState } from 'react';
import { useGame } from '../game/GameContext';
import { AvatarDisplay, avatarNames } from '../game/avatars';
import { AvatarId } from '../game/types';
import { hasProfile } from '../game/storage';

const avatarIds: AvatarId[] = ['spark', 'nova', 'bolt', 'pixel', 'orbit', 'ghost'];

export default function SetupScreen() {
  const { dispatch, state } = useGame();
  const [name, setName] = useState(state.playerName || '');
  const [avatar, setAvatar] = useState<AvatarId>(state.avatar || 'spark');
  const [error, setError] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const profileExists = !!(state.playerName && state.playerName.trim().length > 0);

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

  const handleBack = () => {
    if (profileExists) {
      dispatch({ type: 'SET_SCREEN', screen: 'levelMap' });
    } else {
      dispatch({ type: 'SET_SCREEN', screen: 'welcome' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(180deg, #F0F5FF 0%, #F7F9FC 100%)' }}>
      <div className="game-card w-full max-w-[480px]">
        {/* Header */}
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="mr-3 p-1 rounded-lg hover:bg-[hsl(220,33%,95%)] transition-colors" style={{ color: 'hsl(215, 16%, 47%)' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <div className="flex-1 text-center">
            <h2 className="text-2xl font-bold" style={{ color: 'hsl(217, 33%, 17%)' }}>{profileExists ? 'Edit Your Profile' : 'Set Up Your Profile'}</h2>
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
          {profileExists ? 'Update Profile →' : 'Start Playing →'}
        </button>

        {/* Delete Profile Option - Only show if profile already exists */}
        {profileExists && (
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-3 w-full py-2.5 rounded-[14px] text-sm font-bold transition-colors"
            style={{ background: 'hsl(0, 84%, 95%)', color: 'hsl(0, 84%, 60%)' }}
          >
            Delete This Profile
          </button>
        )}

        {/* Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 flex items-center justify-center p-4 bg-black bg-opacity-40" style={{ zIndex: 50 }}>
            <div className="game-card w-full max-w-[320px]">
              <h3 className="text-lg font-bold mb-2" style={{ color: 'hsl(217, 33%, 17%)' }}>Delete Profile?</h3>
              <p className="text-sm mb-4" style={{ color: 'hsl(215, 16%, 47%)' }}>
                This will permanently erase "{state.playerName}", your progress, and all game data. This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="btn-secondary py-2.5 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const { deleteProfile } = require('../game/storage');
                    deleteProfile();
                    dispatch({ type: 'SET_SCREEN', screen: 'welcome' });
                    setShowConfirm(false);
                  }}
                  className="py-2.5 rounded-[14px] text-sm font-bold text-white transition-colors"
                  style={{ background: 'hsl(0, 84%, 60%)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
