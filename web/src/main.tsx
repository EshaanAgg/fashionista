import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import { ReactFlowProvider } from 'reactflow';

import { ImageData } from './components/ImageData';
import { Cluster } from './components/Cluster';
import { Clusters } from './components/Clusters';
import { Router } from './components/Router';
import { NetworkClusters } from './components/NetworkClusters';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GraphOptionsProvider } from './context/GraphOptions';

const router = createBrowserRouter([
  {
    path: '/graph',
    element: <Cluster />,
  },
  {
    path: '/images',
    element: <ImageData />,
  },
  {
    path: '/clusters',
    element: <Clusters />,
  },
  {
    path: '/',
    element: <Router />,
  },
  {
    path: '/network',
    element: <NetworkClusters />,
  },
]);

import './index.css';
import '@mantine/core/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MantineProvider>
      <ReactFlowProvider>
        <GraphOptionsProvider>
          <RouterProvider router={router} />
        </GraphOptionsProvider>
      </ReactFlowProvider>
    </MantineProvider>
  </React.StrictMode>,
);
