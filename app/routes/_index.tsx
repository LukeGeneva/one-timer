import {
  redirect,
  type LoaderFunction,
  type V2_MetaFunction,
} from '@remix-run/node';

export const meta: V2_MetaFunction = () => {
  return [
    { title: 'One Timer' },
    {
      name: 'description',
      content: 'Create one-time links for sensitive information',
    },
  ];
};

export const loader: LoaderFunction = () => {
  return redirect('/secret');
};
