import React, { useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'revealed'; value: string }
  | { status: 'error' };

export const ViewSecret: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const key = searchParams.get('key');

  const [state, setState] = useState<State>({ status: 'idle' });
  const [isTextCopied, setIsTextCopied] = useState(false);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const onViewClick = async () => {
    setState({ status: 'loading' });
    try {
      const res = await fetch(`/api/secret/${id}?key=${key}`);
      if (!res.ok) {
        setState({ status: 'error' });
        return;
      }
      const { value } = await res.json();
      setState({ status: 'revealed', value });
    } catch {
      setState({ status: 'error' });
    }
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
          {state.status === 'error' ? (
            <div className="flex flex-col gap-4 items-center text-center">
              <p className="text-white/70">
                This secret does not exist. It may have already been viewed.
              </p>
              <a className="text-secondary text-sm font-semibold hover:opacity-80 transition-opacity" href="/">
                Back home
              </a>
            </div>
          ) : state.status === 'revealed' ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <p className="text-white/70 text-xs uppercase tracking-widest font-semibold">
                  Your secret
                </p>
                <textarea
                  className="p-3 resize-none rounded-lg bg-white/10 text-white border border-white/20 outline-none text-sm"
                  ref={textRef}
                  disabled
                  defaultValue={state.value}
                  rows={10}
                />
                <button
                  className="bg-secondary text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  type="button"
                  onClick={onCopyClick}
                >
                  {isTextCopied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <ul className="flex flex-col gap-2 text-white/60 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-secondary mt-0.5">✓</span> This secret
                  is now deleted. Once you close this page, it will be gone.
                </li>
              </ul>
            </div>
          ) : (
            <div className="flex flex-col gap-5 items-center">
              <p className="text-white/70 text-sm text-center">
                Click below to reveal and permanently delete this secret.
              </p>
              <button
                className="bg-secondary text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                type="button"
                onClick={onViewClick}
                disabled={state.status === 'loading'}
              >
                {state.status === 'loading' ? 'Loading…' : 'View Secret'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
