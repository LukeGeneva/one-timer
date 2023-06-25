import type { ActionFunction } from '@remix-run/node';
import { createOneTimeSecret } from '../compositionRoot.server';
import { useActionData } from '@remix-run/react';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const message = data.get('message');
  if (typeof message !== 'string') throw new Error('Expected message.');
  const secretId = await createOneTimeSecret.execute(message);
  return secretId;
};

export default function Secret() {
  const secretId = useActionData();

  return secretId ? (
    <p>{`http://localhost:3000/secret/${secretId}`}</p>
  ) : (
    <form method="post">
      <textarea name="message"></textarea>
      <button type="submit">Create</button>
    </form>
  );
}
