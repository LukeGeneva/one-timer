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
    <div className="mx-auto md:w-3/4 p-4">
      <h1 className="text-primary text-center text-2xl pb-4">
        Create a "one-timer" link
      </h1>
      {data?.secretId ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              className="p-2 bg-white rounded flex-1"
              ref={textRef}
              type="text"
              disabled
              defaultValue={`${data.BASE_URL}/secret/${data.secretId}`}
            />
            <button
              className="bg-secondary text-white p-2 rounded"
              type="button"
              onClick={onCopyClick}
            >
              Copy
            </button>
          </div>
          <p className="text-primary">
            <ul className="flex flex-col gap-4 text-center md:text-left">
              <li>Here is the link to your secret.</li>
              <li>Remember, this can only be accessed once.</li>
              <li>After the secret is viewed, it will be deleted.</li>
            </ul>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <form className="flex flex-col gap-2" method="post">
            <textarea
              className="p-2 resize-none rounded"
              name="message"
              rows={15}
              placeholder="Place your secret here"
            ></textarea>
            <button
              className="bg-secondary text-primary p-2 rounded"
              type="submit"
            >
              Create
            </button>
          </form>
          <p className="text-primary">
            <ul className="flex flex-col gap-4 text-center md:text-left">
              <li>After creating your secret, we'll give you a link.</li>
              <li>
                The link can only be accessed once. Then it will be deleted
                forever.
              </li>
            </ul>
          </p>
        </div>
      )}
    </div>
  );
}
