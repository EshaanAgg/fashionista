import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ImageData } from './components/ImageData';
import { Cluster } from './components/Cluster';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GraphOptionsProvider } from './context/GraphOptions';

const router = createBrowserRouter([
  {
    path: '/',
    element: (<GraphOptionsProvider><Cluster /></GraphOptionsProvider>),
  },
  {
    path: '/images',
    element: <ImageData />,
  },
]);

import './index.css';
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <RouterProvider router={router} />;
    </MantineProvider>
  </React.StrictMode>
);
