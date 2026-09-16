import { useEffect, useState } from 'react'
import type { Listing } from './useListings'

export function useListing(apiUrl: string, listingId: string | undefined) {
  const [listing, setListing] = useState<Listing | null>(null)
  const [status, setStatus] = useState('Loading listing…')

  useEffect(() => {
    if (!listingId) {
      return
    }
    fetch(`${apiUrl}/marketplace/listings/${listingId}`)
      .then((response) => {
        if (!response.ok) throw new Error('Listing not found')
        return response.json() as Promise<Listing>
      })
      .then((data) => { setListing(data); setStatus('') })
      .catch(() => { setListing(null); setStatus('Listing not found.') })
  }, [apiUrl, listingId])

  return { listing, status: listingId ? status : 'Listing not found.' }
}
