import { useState } from 'react'

export function useExchangeRequest(apiUrl: string) {
  const [status, setStatus] = useState('')

  const requestExchange = async (listingId: string) => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) {
      setStatus('Sign in to request a listing.')
      return false
    }

    setStatus('Sending request…')

    try {
      const response = await fetch(`${apiUrl}/marketplace/exchanges`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ listingId }),
      })

      if (!response.ok) throw new Error('Could not request listing')

      setStatus('Request sent.')
      return true
    } catch {
      setStatus('Could not send the request.')
      return false
    }
  }

  return { requestExchange, status }
}
