import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    if (typeof window === 'undefined') {
      return null
    }

    const saved = localStorage.getItem('usuario')
    return saved ? JSON.parse(saved) : null
  })

  useEffect(() => {
    if (usuario) {
      localStorage.setItem('usuario', JSON.stringify(usuario))
    } else {
      localStorage.removeItem('usuario')
    }
  }, [usuario])

  const value = useMemo(() => ({ usuario, setUsuario }), [usuario])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)

  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }

  return context
}
