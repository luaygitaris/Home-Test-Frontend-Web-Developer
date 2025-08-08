// src/app/_components/protected-route.tsx
'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAuth } from '../_providers/auth-provider'

export default function ProtectedRoute({ role, children }: { role: 'admin' | 'user', children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || user.role !== role)) {
      router.push('/login')
    }
  }, [user, loading, role, router])

  if (loading || !user || user.role !== role) {
    return <div>Loading...</div>
  }

  return <>{children}</>
}