import { useState } from 'react'

type ListingInput = { categoryId: string; kind: 'item' | 'service'; title: string; description: string; creditMinutes: number | null }

async function authenticatedPost(apiUrl: string, path: string, body: unknown) {
  const token = localStorage.getItem('timebank.authToken')
  if (!token) throw new Error('Please sign in')
  const response = await fetch(`${apiUrl}/marketplace/${path}`, { method: 'POST', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!response.ok) throw new Error('Request failed')
  return response.json()
}

export function useMarketplaceActions(apiUrl: string) {
  const [status, setStatus] = useState('')
  const createListing = async (input: ListingInput) => {
    try { await authenticatedPost(apiUrl, 'listings', input); setStatus('Listing created.'); return true }
    catch { setStatus('Could not create listing.'); return false }
  }
  const createCategory = async (name: string, appliesTo: Array<'item' | 'service'>) => {
    try { await authenticatedPost(apiUrl, 'categories', { name, appliesTo }); setStatus('Category created.'); return true }
    catch { setStatus('Could not create category.'); return false }
  }
  return { createCategory, createListing, status }
}
