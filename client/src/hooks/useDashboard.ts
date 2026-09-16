import { useEffect, useState } from 'react'
import type { AuthUser } from './useDemoAuth'

export type DashboardData = {
  user: AuthUser
  balanceMinutes: number
}

export function useDashboard(apiUrl: string) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [status, setStatus] = useState(() =>
    localStorage.getItem('timebank.authToken')
      ? 'Loading your account…'
      : 'Please sign in to view your dashboard.',
  )

  useEffect(() => {
    const token = localStorage.getItem('timebank.authToken')

    if (!token) return

    fetch(`${apiUrl}/auth/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load dashboard')
        return response.json() as Promise<DashboardData>
      })
      .then((data) => {
        setDashboard(data)
        setStatus('')
      })
      .catch(() => setStatus('Could not load your dashboard.'))
  }, [apiUrl])

  return { dashboard, status }
}
