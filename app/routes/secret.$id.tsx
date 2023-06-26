import type { ActionFunction, HeadersFunction } from '@remix-run/node';
import { retrieveOneTimeSecret } from '../compositionRoot.server';
import { useActionData } from '@remix-run/react';

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

  return (
    <div>
      {data ? (
        <p>{data.message}</p>
      ) : (
        <form method="post">
          <button type="submit">View Secret</button>
        </form>
      )}
    </div>
  );
}
