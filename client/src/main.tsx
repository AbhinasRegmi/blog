import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from '@/App'
import '@/globals.css'

import { PageNotFound } from '@/components/PageNotFound';
import {Home} from "@/components/Home";
import {NewStory} from '@/components/NewStory';
import {Search} from "@/components/Search";
import {Notifications} from "@/components/Notifications";
import {Me} from "@/components/Me";


import { createBrowserRouter, RouterProvider } from 'react-router-dom';

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
        element: <NewStory />
      },
      {
        path: '/me/notifications',
        element: <Notifications />
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
