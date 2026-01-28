import { Outlet, Navigate } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'

const AuthLayout = () => {
  const { token } = useAuthContext()

  // If token is present, redirect to home
  if (token) {
    return <Navigate to={'/dashboard'} /> // Prevent rendering the layout
  }

  return <Outlet />
}

export default AuthLayout
