import type { ActionFunction } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { createOneTimeSecret } from '../compositionRoot.server';
import { BASE_URL } from '../env';
import { useRef } from 'react';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const message = data.get('message');
  if (typeof message !== 'string') throw new Error('Expected message.');
  const secretId = await createOneTimeSecret.execute(message);
  return { BASE_URL, secretId };
};

export default function Secret() {
  const data = useActionData();
  const textRef = useRef<HTMLInputElement>(null);

  const onCopyClick = () => {
    if (!textRef.current) return;
    textRef.current.select();
    textRef.current.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(textRef.current.value);
  };

  return (
    <div className="mx-auto w-3/4 p-4">
      {data?.secretId ? (
        <>
          <input
            ref={textRef}
            type="text"
            disabled
            defaultValue={`${data.BASE_URL}/secret/${data.secretId}`}
          />
          <button type="button" onClick={onCopyClick}>
            Copy
          </button>
        </>
      ) : (
        <form className="flex flex-col gap-2" method="post">
          <textarea
            className="p-2 resize-none rounded"
            name="message"
          ></textarea>
          <button
            className="bg-secondary text-primary p-2 rounded"
            type="submit"
          >
            Create
          </button>
        </form>
      )}
    </div>
  );
}
