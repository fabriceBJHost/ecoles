import { useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuthContext } from '../contexts/AuthContext'
import Navigation from '../components/Navigation'

const DefaultLayout = () => {
  const { token } = useAuthContext()
  const [searchItem, setSearchItem] = useState('')

  if (!token) {
    return <Navigate to={'/'} />
  }

  // eslint-disable-next-line react/no-children-prop
  return <Navigation setSearchItem={setSearchItem} children={<Outlet context={{ searchItem }} />} />
}

export default DefaultLayout
