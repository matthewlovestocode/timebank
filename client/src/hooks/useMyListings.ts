import { useCallback, useEffect, useState } from 'react'
import type { Listing } from './useListings'

export function useMyListings(apiUrl: string) {
  const [listings, setListings] = useState<Listing[]>([])
  const reload = useCallback(() => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) return Promise.resolve()
    return fetch(`${apiUrl}/marketplace/my-listings`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => {
        if (!response.ok) throw new Error('Could not load listings')
        return response.json() as Promise<unknown>
      })
      .then((data) => setListings(Array.isArray(data) ? data as Listing[] : []))
      .catch(() => setListings([]))
  }, [apiUrl])
  useEffect(() => { void reload() }, [reload])
  return { listings, reload }
}
