import { randomUUID } from 'node:crypto'

export type ExchangeStatus = 'requested' | 'accepted' | 'completed' | 'cancelled'
export type ExchangeAttributes = {
  id: string
  listingId: string
  requesterId: string
  ownerId: string
  agreedCreditMinutes: number | null
  status: ExchangeStatus
  createdAt: string
  updatedAt: string
  completedAt: string | null
}

export class Exchange {
  constructor(readonly attributes: ExchangeAttributes) {}

  static create(attributes: Omit<ExchangeAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt' | 'completedAt'>): Exchange {
    const timestamp = new Date().toISOString()
    return new Exchange({ ...attributes, id: randomUUID(), status: 'requested', createdAt: timestamp, updatedAt: timestamp, completedAt: null })
  }

  accept(): Exchange {
    if (this.attributes.status !== 'requested') throw new Error('Only requested exchanges can be accepted')
    return new Exchange({ ...this.attributes, status: 'accepted', updatedAt: new Date().toISOString() })
  }

  complete(): Exchange {
    if (this.attributes.status !== 'accepted') throw new Error('Only accepted exchanges can be completed')
    const timestamp = new Date().toISOString()
    return new Exchange({ ...this.attributes, status: 'completed', updatedAt: timestamp, completedAt: timestamp })
  }

  cancel(): Exchange {
    if (this.attributes.status === 'completed' || this.attributes.status === 'cancelled') {
      throw new Error('This exchange cannot be cancelled')
    }
    return new Exchange({ ...this.attributes, status: 'cancelled', updatedAt: new Date().toISOString() })
  }

  toJSON(): ExchangeAttributes {
    return this.attributes
  }
}
