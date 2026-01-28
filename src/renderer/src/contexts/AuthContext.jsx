import { createContext, useContext, useState } from 'react'

const AuthContext = createContext({
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {}
})

// eslint-disable-next-line react/prop-types
export const AuthContextProvider = ({ children }) => {
  const [user, _setUser] = useState(localStorage.getItem('user'))
  const [token, _setToken] = useState(sessionStorage.getItem('token'))

  const setToken = async (newToken) => {
    _setToken(newToken)

    if (newToken) {
      sessionStorage.setItem('token', newToken)
    } else {
      sessionStorage.removeItem('token')
    }
  }

  const setUser = async (newUser) => {
    _setUser(newUser)

    if (newUser) {
      localStorage.setItem('user', newUser)
    } else {
      localStorage.removeItem('user')
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        setUser,
        setToken
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext)
