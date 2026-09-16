import { useEffect, useState } from 'react'

export type Listing = {
  id: string
  ownerId: string
  categoryId: string
  kind: 'item' | 'service'
  title: string
  description: string
  creditMinutes: number | null
  status: 'active' | 'paused' | 'completed'
}

export function useListings(apiUrl: string) {
  const [listings, setListings] = useState<Listing[]>([])

  useEffect(() => {
    fetch(`${apiUrl}/marketplace/listings`)
      .then((response) => response.json() as Promise<Listing[]>)
      .then((data) => setListings(data.filter((listing) => listing.status === 'active')))
      .catch(() => setListings([]))
  }, [apiUrl])

  return listings
}
