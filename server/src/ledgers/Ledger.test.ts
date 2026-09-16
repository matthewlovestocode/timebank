import { describe, expect, it } from 'vitest'
import { Ledger } from './Ledger.js'

describe('Ledger', () => {
  it('creates a ledger for one user', () => {
    const ledger = Ledger.create('user-1')

    expect(ledger.id).toBeTypeOf('string')
    expect(ledger.userId).toBe('user-1')
    expect(ledger.updatedAt).toBe(ledger.createdAt)
  })

  it('calculates credits minus debits', () => {
    const ledger = new Ledger({
      id: 'ledger-1',
      userId: 'user-1',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    })

    expect(
      ledger.balance([
        {
          id: 'entry-1',
          ledgerId: ledger.id,
          direction: 'credit',
          kind: 'account-creation-deposit',
          minutes: 1200,
          exchangeId: null,
          createdAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'entry-2',
          ledgerId: ledger.id,
          direction: 'debit',
          kind: 'account-creation-deposit',
          minutes: 90,
          exchangeId: null,
          createdAt: '2026-01-02T00:00:00.000Z',
        },
      ]),
    ).toBe(1110)
  })
})
