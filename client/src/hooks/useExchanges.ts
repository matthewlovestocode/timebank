import { useCallback, useEffect, useState } from 'react'

export type Exchange = {
  id: string
  listingId: string
  requesterId: string
  ownerId: string
  agreedCreditMinutes: number | null
  status: 'requested' | 'accepted' | 'completed' | 'cancelled'
  createdAt: string
}

export function useExchanges(apiUrl: string) {
  const [exchanges, setExchanges] = useState<Exchange[]>([])

  const reload = useCallback(() => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) return
    fetch(`${apiUrl}/marketplace/exchanges`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json() as Promise<Exchange[]>)
      .then(setExchanges)
      .catch(() => setExchanges([]))
  }, [apiUrl])

  useEffect(() => { void reload() }, [reload])

  return { exchanges, reload }
}
