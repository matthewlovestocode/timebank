import { randomUUID } from 'node:crypto'

export type LedgerEntryAttributes = {
  id: string
  ledgerId: string
  direction: 'credit' | 'debit'
  kind: 'account-creation-deposit'
  minutes: number
  createdAt: string
}

export class LedgerEntry {
  readonly id: string
  readonly ledgerId: string
  readonly direction: 'credit' | 'debit'
  readonly kind: 'account-creation-deposit'
  readonly minutes: number
  readonly createdAt: string

  constructor(attributes: LedgerEntryAttributes) {
    this.id = attributes.id
    this.ledgerId = attributes.ledgerId
    this.direction = attributes.direction
    this.kind = attributes.kind
    this.minutes = attributes.minutes
    this.createdAt = attributes.createdAt
  }

  static createAccountCreationDeposit(ledgerId: string, minutes: number): LedgerEntry {
    return new LedgerEntry({
      id: randomUUID(),
      ledgerId,
      direction: 'credit',
      kind: 'account-creation-deposit',
      minutes,
      createdAt: new Date().toISOString(),
    })
  }

  toJSON(): LedgerEntryAttributes {
    return {
      id: this.id,
      ledgerId: this.ledgerId,
      direction: this.direction,
      kind: this.kind,
      minutes: this.minutes,
      createdAt: this.createdAt,
    }
  }
}
