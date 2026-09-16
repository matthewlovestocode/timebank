import { useState } from 'react'

export function useExchangeActions(apiUrl: string) {
  const [status, setStatus] = useState('')
  const act = async (exchangeId: string, action: 'accept' | 'complete' | 'cancel') => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) return false
    try {
      const response = await fetch(`${apiUrl}/marketplace/exchanges/${exchangeId}/${action}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      if (!response.ok) throw new Error('Exchange update failed')
      setStatus(`Exchange ${action}ed.`)
      return true
    } catch {
      setStatus(`Could not ${action} exchange.`)
      return false
    }
  }
  return { act, status }
}
