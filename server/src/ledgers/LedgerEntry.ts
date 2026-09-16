import { randomUUID } from 'node:crypto'

export type LedgerEntryAttributes = {
  id: string
  ledgerId: string
  direction: 'credit' | 'debit'
  kind: 'account-creation-deposit' | 'exchange-settlement'
  minutes: number
  exchangeId: string | null
  createdAt: string
}

export class LedgerEntry {
  readonly id: string
  readonly ledgerId: string
  readonly direction: 'credit' | 'debit'
  readonly kind: 'account-creation-deposit' | 'exchange-settlement'
  readonly minutes: number
  readonly exchangeId: string | null
  readonly createdAt: string

  constructor(attributes: LedgerEntryAttributes) {
    this.id = attributes.id
    this.ledgerId = attributes.ledgerId
    this.direction = attributes.direction
    this.kind = attributes.kind
    this.minutes = attributes.minutes
    this.exchangeId = attributes.exchangeId
    this.createdAt = attributes.createdAt
  }

  static createAccountCreationDeposit(ledgerId: string, minutes: number): LedgerEntry {
    return new LedgerEntry({
      id: randomUUID(),
      ledgerId,
      direction: 'credit',
      kind: 'account-creation-deposit',
      minutes,
      exchangeId: null,
      createdAt: new Date().toISOString(),
    })
  }

  static createExchangeSettlement(
    ledgerId: string,
    exchangeId: string,
    direction: 'credit' | 'debit',
    minutes: number,
  ): LedgerEntry {
    return new LedgerEntry({
      id: randomUUID(), ledgerId, exchangeId, direction, minutes,
      kind: 'exchange-settlement', createdAt: new Date().toISOString(),
    })
  }

  toJSON(): LedgerEntryAttributes {
    return {
      id: this.id,
      ledgerId: this.ledgerId,
      direction: this.direction,
      kind: this.kind,
      minutes: this.minutes,
      exchangeId: this.exchangeId,
      createdAt: this.createdAt,
    }
  }
}
