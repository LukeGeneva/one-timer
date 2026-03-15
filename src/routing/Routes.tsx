import type { FC } from 'react';
import { Route, Routes as ReactRoutes } from 'react-router';
import { App } from '../App';
import { ViewSecret } from '../ViewSecret';

export const Routes: FC = () => (
  <ReactRoutes>
    <Route path="/" element={<App />} />
    <Route path="/secret/:id" element={<ViewSecret />} />
  </ReactRoutes>
);
