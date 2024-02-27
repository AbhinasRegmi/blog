import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '@/App'
import '@/globals.css'

import { PageNotFound } from '@/components/pages/PageNotFound';
import { Home } from "@/components/pages/Home";
import { NewStory } from '@/components/pages/NewStory';
import { Search } from "@/components/pages/Search";
import { Notifications } from "@/components/pages/Notifications";
import { Me } from "@/components/pages/Me";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/search',
        element: <Search />
      },
      {
        path: '/new-story',
        element: <ProtectedRoute link='/new-story'><NewStory /></ProtectedRoute>
      },
      {
        path: '/me/notifications',
        element: <ProtectedRoute link='/me/notifications'><Notifications /></ProtectedRoute>
      },
      {
        path: '/me',
        element: <Me />
      }
    ]
  },

  // this must always be the final route.
  {
    path: '/*',
    element: <PageNotFound />
  }
])

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={client} >
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
