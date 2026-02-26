import { createHashRouter } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout'
import Home from './pages/Home'
import AuthLayout from './layouts/AuthLayout'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Users from './pages/Users'
import Classes from './pages/Classes'
import Etablissements from './pages/Etablissements'
import Profile from './pages/Profile'
import Eleves from './pages/Eleves'
import Matieres from './pages/Matieres'
import Schedules from './pages/Schedules'

const Router = createHashRouter([
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        path: '/',
        element: <Login />
      }
    ]
  },
  {
    path: '/',
    element: <DefaultLayout />,
    children: [
      {
        path: '/dashboard',
        element: <Home />
      },
      {
        path: '/users',
        element: <Users />
      },
      {
        path: '/classes',
        element: <Classes />
      },
      {
        path: '/etablissement',
        element: <Etablissements />
      },
      {
        path: '/profile',
        element: <Profile />
      },
      {
        path: '/eleves',
        element: <Eleves />
      },
      {
        path: '/matieres',
        element: <Matieres />
      },
      {
        path: '/schedule',
        element: <Schedules />
      }
    ]
  },
  {
    path: '/*',
    element: <NotFound />
  }
])

export default Router
