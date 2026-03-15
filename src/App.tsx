import React, { useEffect, useRef, useState } from 'react';

export const App: React.FC = () => {
  const [secretCount, setSecretCount] = useState<number | null>(null);
  const [secretUrl, setSecretUrl] = useState<string | null>(null);
  const [isTextCopied, setIsTextCopied] = useState(false);
  const textRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/secret-count')
      .then((res) => res.json())
      .then((data) => setSecretCount(data.count))
      .catch(() => {});
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const message = (form.elements.namedItem('message') as HTMLTextAreaElement)
      .value;
    const res = await fetch('/api/secret', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value: message }),
    });
    const { id, key } = await res.json();
    setSecretUrl(`${window.location.origin}/secret/${id}?key=${key}`);
  };

  const onCopyClick = () => {
    if (!textRef.current) return;
    textRef.current.select();
    textRef.current.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textRef.current.value);
    setIsTextCopied(true);
  };

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-bold tracking-tight">
            One-Timer
          </h1>
          <p className="text-white/50 mt-1 text-sm">
            Share a secret that self-destructs after one view
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/10">
          {secretUrl ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1">
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">
                  Your secret link
                </p>
                <div className="flex gap-2">
                  <input
                    className="p-3 bg-white/10 text-white rounded-lg flex-1 text-sm border border-white/20 outline-none truncate"
                    ref={textRef}
                    type="text"
                    disabled
                    defaultValue={secretUrl}
                  />
                  <button
                    className="bg-secondary text-white px-4 py-3 rounded-lg text-sm font-semibold shrink-0 hover:opacity-90 transition-opacity"
                    type="button"
                    onClick={onCopyClick}
                  >
                    {isTextCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <ul className="flex flex-col gap-2 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span> Link is ready
                  to share.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span> Can only be
                  accessed once.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span> Deleted
                  forever after viewing.
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              <form className="flex flex-col gap-3" onSubmit={onSubmit}>
                <textarea
                  className="p-3 resize-none rounded-lg bg-white/10 text-white placeholder-white/30 border border-white/20 outline-none focus:border-secondary transition-colors text-sm"
                  name="message"
                  rows={10}
                  placeholder="Paste your secret here…"
                  maxLength={5000}
                ></textarea>
                <button
                  className="bg-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  type="submit"
                >
                  Create secret link
                </button>
              </form>
              <ul className="flex flex-col gap-2 text-white/50 text-xs">
                <li>We'll give you a one-time link to share.</li>
                <li>Once viewed, it's gone forever.</li>
                {secretCount !== null && (
                  <li className="text-secondary/70">
                    {secretCount.toLocaleString()} one-timers created so far
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
