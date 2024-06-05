import type { ActionFunction, HeadersFunction } from '@remix-run/node';
import { retrieveOneTimeSecret } from '../compositionRoot.server';
import { useActionData } from '@remix-run/react';
import React, { useRef } from 'react';

export const headers: HeadersFunction = () => {
  return { 'cache-control': 'no-cache' };
};

export const action: ActionFunction = async ({ params }) => {
  const id = params.id;
  if (typeof id !== 'string') throw new Error('Expected ID.');
  const message = await retrieveOneTimeSecret.execute(id);
  return { message };
};

export function ErrorBoundary() {
  return (
    <div className="flex flex-col gap-2 items-center">
      <p className="text-primary p-4 text-center">
        This secret does not exist. It may have already been viewed.
      </p>
      <a className="text-link" href="/">
        Back home
      </a>
    </div>
  );
}

export default function SecretId() {
  const data = useActionData();
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isTextCopied, setIsTextCopied] = React.useState(false);

  const onCopyClick = () => {
    if (!textRef.current) return;
    textRef.current.select();
    textRef.current.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textRef.current.value);
    setIsTextCopied(true);
  };

  return (
    <div className="mx-auto md:w-3/4 p-4">
      {data ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <textarea
              className="p-2 bg-white rounded flex-1"
              ref={textRef}
              disabled
              defaultValue={data.message}
            ></textarea>
            <button
              className="bg-secondary text-primary rounded p-2"
              type="button"
              onClick={onCopyClick}
            >
              {isTextCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-primary">
            <ul className="flex flex-col gap-4 text-center md:text-left">
              <li>
                This secret is now deleted. Once you close this page, it will be
                gone.
              </li>
            </ul>
          </p>
        </div>
      ) : (
        <form className="flex justify-center p-4" method="post">
          <button
            className="bg-secondary text-primary rounded p-4"
            type="submit"
          >
            View Secret
          </button>
        </form>
      )}
    </div>
  );
}
