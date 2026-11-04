import { Navigate, createBrowserRouter } from 'react-router-dom'

import { publicRoutes } from '@/app/router/publicRoutes'
import { RouteErrorElement } from '@/app/router/RouteErrorElement'

export const router = createBrowserRouter([
  {
    errorElement: <RouteErrorElement />,
    children: [
      { path: '/privacy', element: <Navigate to="/privacy-policy" replace /> },
      { path: '/terms', element: <Navigate to="/terms-conditions" replace /> },
      { path: '/pricing', element: <Navigate to={{ pathname: '/', hash: 'pricing' }} replace /> },
      ...publicRoutes,
    ],
  },
])
