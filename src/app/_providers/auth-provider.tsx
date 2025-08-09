'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/lib/types'
import axios from 'axios'

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string, role: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('https://test-fe.mysellerpintar.com/api/login', { email, password })
      const userData = response.data.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      router.push(userData.role === 'admin' ? '/admin' : '/user')
    } catch (error) {
      throw new Error('Login failed')
    }
  }

  const register = async (name: string, email: string, password: string, role: string) => {
    try {
      const response = await axios.post('https://test-fe.mysellerpintar.com/api/register', { name, email, password, role })
      const userData = response.data.data
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      router.push(userData.role === 'admin' ? '/admin' : '/user')
    } catch (error) {
      throw new Error('Registration failed')
    }
  }

  const logout = async () => {
    try {
      await axios.post('https://test-fe.mysellerpintar.com/api/logout')
      setUser(null)
      localStorage.removeItem('user')
      router.push('/login')
    } catch (error) {
      throw new Error('Logout failed')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}