import { useEffect, useState } from 'react'
import type { AuthUser } from './useDemoAuth'

export function useMembers(apiUrl: string) {
  const [members, setMembers] = useState<AuthUser[]>([])
  useEffect(() => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) return
    fetch(`${apiUrl}/auth/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json() as Promise<{ users: AuthUser[] }>)
      .then((data) => setMembers(data.users ?? []))
      .catch(() => setMembers([]))
  }, [apiUrl])
  return members
}
