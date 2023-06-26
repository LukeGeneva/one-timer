import type { HeadersFunction, LoaderFunction } from '@remix-run/node';
import { retrieveOneTimeSecret } from '../compositionRoot.server';
import { useLoaderData } from '@remix-run/react';

export const headers: HeadersFunction = () => {
  return { 'cache-control': 'no-cache' };
};

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id;
  if (typeof id !== 'string') throw new Error('Expected ID.');
  const message = await retrieveOneTimeSecret.execute(id);
  return { message };
};

export default function SecretId() {
  const { message } = useLoaderData();

  return <div>{message}</div>;
}
