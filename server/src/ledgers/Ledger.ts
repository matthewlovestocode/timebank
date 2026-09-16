import { randomUUID } from 'node:crypto'
import type { LedgerEntryAttributes } from './LedgerEntry.js'

export type LedgerAttributes = {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
}

export class Ledger {
  readonly id: string
  readonly userId: string
  readonly createdAt: string
  readonly updatedAt: string

  constructor(attributes: LedgerAttributes) {
    this.id = attributes.id
    this.userId = attributes.userId
    this.createdAt = attributes.createdAt
    this.updatedAt = attributes.updatedAt
  }

  static create(userId: string): Ledger {
    const timestamp = new Date().toISOString()

    return new Ledger({
      id: randomUUID(),
      userId,
      createdAt: timestamp,
      updatedAt: timestamp,
    })
  }

  balance(entries: LedgerEntryAttributes[]): number {
    return entries.reduce(
      (balance, entry) =>
        entry.direction === 'credit' ? balance + entry.minutes : balance - entry.minutes,
      0,
    )
  }

  toJSON(): LedgerAttributes {
    return {
      id: this.id,
      userId: this.userId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    }
  }
}
