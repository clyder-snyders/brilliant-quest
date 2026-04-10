import React, { useState } from 'react';

export function FeedbackButton() {
  const [showForm, setShowForm] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      alert('Please enter feedback before submitting');
      return;
    }

    try {
      // Create a simple data string to send
      const feedbackData = {
        message: feedback,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        userAgent: navigator.userAgent,
      };

      // Log to browser console (for development)
      console.log('Feedback submitted:', feedbackData);

      // Option: Send to a webhook service like Discord, Telegram, or email service
      // Example using Discord webhook (you would need to set this up):
      // await fetch('YOUR_DISCORD_WEBHOOK_URL', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     content: `**New Feedback**\n${feedback}\n\nTime: ${new Date().toLocaleString()}`
      //   })
      // });

      setSubmitted(true);
      setTimeout(() => {
        setShowForm(false);
        setSubmitted(false);
        setFeedback('');
      }, 2000);
    } catch (e) {
      console.error('Feedback submission failed', e);
      alert('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <>
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-5 py-3 rounded-full shadow-lg font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
          title="Send us your feedback!"
        >
          <span>📝</span> Feedback
        </button>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full animate-fade-in-up">
            {submitted ? (
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="font-bold text-lg text-green-600">Thank you!</h3>
                <p className="text-gray-600 text-sm mt-1">Your feedback helps us improve</p>
              </div>
            ) : (
              <>
                <h3 className="font-bold text-lg mb-2">Help us improve! 🚀</h3>
                <p className="text-sm text-gray-600 mb-4">Found a bug? Have a feature request? Let us know!</p>

                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="What should we improve? Any bugs or ideas?"
                  className="w-full p-3 border-2 border-gray-300 rounded-lg mb-4 text-sm focus:border-blue-500 focus:outline-none resize-none"
                  rows={4}
                />

                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    Send Feedback
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <p className="text-xs text-gray-500 mt-3 text-center">
                  Your feedback is valuable and will be reviewed
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
