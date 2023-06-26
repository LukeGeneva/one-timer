import type { ActionFunction } from '@remix-run/node';
import { useActionData } from '@remix-run/react';
import { createOneTimeSecret } from '../compositionRoot.server';
import { BASE_URL } from '../env';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const message = data.get('message');
  if (typeof message !== 'string') throw new Error('Expected message.');
  const secretId = await createOneTimeSecret.execute(message);
  return { BASE_URL, secretId };
};

export default function Secret() {
  const data = useActionData();

  return data?.secretId ? (
    <p>{`${data.BASE_URL}/secret/${data.secretId}`}</p>
  ) : (
    <form method="post">
      <textarea name="message"></textarea>
      <button type="submit">Create</button>
    </form>
  );
}
