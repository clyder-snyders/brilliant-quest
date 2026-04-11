import React, { useState } from 'react';
import { IconMail, IconSend, IconX } from './Icons';

const FEEDBACK_EMAIL = 'clydesnyders17@gmail.com';

export function FeedbackButton() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [feedback, setFeedback] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = () => {
    if (!feedback.trim()) return;

    const subject = encodeURIComponent(`[Brilliant OS Feedback] ${category.charAt(0).toUpperCase() + category.slice(1)}`);
    const body = encodeURIComponent(
      `Hi Brilliant OS Team,\n\n${feedback.trim()}\n\n---\nFrom: ${name.trim() || 'Anonymous'}\nCategory: ${category}\nPage: ${window.location.href}\nDate: ${new Date().toLocaleString()}`
    );

    window.open(`mailto:${FEEDBACK_EMAIL}?subject=${subject}&body=${body}`, '_self');
    setShowForm(false);
    setFeedback('');
    setName('');
  };

  return (
    <>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105"
          style={{
            background: 'hsl(217, 91%, 60%)',
            color: 'white',
            boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
            fontFamily: 'Nunito, sans-serif',
          }}
        >
          <IconMail size={18} color="white" />
          Feedback
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="game-card w-full max-w-sm animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-extrabold" style={{ color: 'hsl(217, 33%, 17%)', fontFamily: 'Nunito, sans-serif' }}>
                Send Feedback
              </h3>
              <button onClick={() => setShowForm(false)} className="p-1 rounded-lg transition-colors hover:bg-[hsl(220,33%,95%)]">
                <IconX size={20} color="hsl(215, 16%, 47%)" />
              </button>
            </div>

            <p className="text-sm mb-4" style={{ color: 'hsl(215, 16%, 47%)' }}>
              Your feedback is sent directly via email. We read every message.
            </p>

            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name (optional)"
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-3 outline-none transition-colors"
              style={{ border: '2px solid hsl(214, 32%, 91%)', background: 'white', fontFamily: 'Inter, sans-serif' }}
              onFocus={e => (e.target.style.borderColor = 'hsl(217, 91%, 60%)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(214, 32%, 91%)')}
            />

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-3 outline-none"
              style={{ border: '2px solid hsl(214, 32%, 91%)', background: 'white', fontFamily: 'Inter, sans-serif', color: 'hsl(217, 33%, 17%)' }}
            >
              <option value="general">General Feedback</option>
              <option value="bug">Bug Report</option>
              <option value="feature">Feature Request</option>
              <option value="education">Education / Classroom Use</option>
            </select>

            <textarea
              value={feedback}
              onChange={e => setFeedback(e.target.value)}
              placeholder="Tell us what you think..."
              className="w-full px-3 py-2.5 rounded-xl text-sm mb-4 outline-none resize-none"
              rows={4}
              style={{ border: '2px solid hsl(214, 32%, 91%)', background: 'white', fontFamily: 'Inter, sans-serif' }}
              onFocus={e => (e.target.style.borderColor = 'hsl(217, 91%, 60%)')}
              onBlur={e => (e.target.style.borderColor = 'hsl(214, 32%, 91%)')}
            />

            <button
              onClick={handleSubmit}
              disabled={!feedback.trim()}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
              style={{ opacity: !feedback.trim() ? 0.5 : 1 }}
            >
              <IconSend size={16} color="white" />
              Send via Email
            </button>

            <p className="text-xs mt-3 text-center" style={{ color: 'hsl(215, 16%, 47%)' }}>
              Opens your email client to send to our team
            </p>
          </div>
        </div>
      )}
    </>
  );
}
