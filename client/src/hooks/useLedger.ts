import { useEffect, useState } from 'react'

export type LedgerEntry = {
  id: string
  direction: 'credit' | 'debit'
  kind: 'account-creation-deposit' | 'exchange-settlement'
  minutes: number
  createdAt: string
}

export function useLedger(apiUrl: string) {
  const [entries, setEntries] = useState<LedgerEntry[]>([])
  const [balanceMinutes, setBalanceMinutes] = useState<number | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('timebank.authToken')
    if (!token) return
    fetch(`${apiUrl}/auth/ledger`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.json() as Promise<{ balanceMinutes: number; entries: LedgerEntry[] }>)
      .then((data) => { setBalanceMinutes(data.balanceMinutes); setEntries(data.entries) })
      .catch(() => { setBalanceMinutes(null); setEntries([]) })
  }, [apiUrl])

  return { balanceMinutes, entries }
}
