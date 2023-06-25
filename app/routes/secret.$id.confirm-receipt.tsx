import type { ActionFunction } from '@remix-run/node';
import { confirmReceipt } from '../compositionRoot.server';

export const action: ActionFunction = async ({ request }) => {
  const data = await request.formData();
  const id = data.get('id');
  if (typeof id !== 'string') throw new Error('Expected id.');
  await confirmReceipt.execute(id);
  return true;
};
