import type { ActionFunction, HeadersFunction } from '@remix-run/node';
import { retrieveOneTimeSecret } from '../compositionRoot.server';
import { useActionData } from '@remix-run/react';
import { useRef } from 'react';

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
  return <p>This secret does not exist. It may have already been viewed.</p>;
}

export default function SecretId() {
  const data = useActionData();
  const textRef = useRef<HTMLTextAreaElement>(null);

  const onCopyClick = () => {
    if (!textRef.current) return;
    textRef.current.select();
    textRef.current.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textRef.current.value);
  };

  return (
    <div>
      {data ? (
        <>
          <textarea
            ref={textRef}
            disabled
            defaultValue={data.message}
          ></textarea>
          <button type="button" onClick={onCopyClick}>
            Copy
          </button>
        </>
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
