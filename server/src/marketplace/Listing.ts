import { randomUUID } from 'node:crypto'

export type ListingKind = 'item' | 'service'
export type ListingStatus = 'active' | 'paused' | 'completed'

export type ListingAttributes = {
  id: string
  ownerId: string
  categoryId: string
  kind: ListingKind
  title: string
  description: string
  creditMinutes: number | null
  status: ListingStatus
  createdAt: string
  updatedAt: string
}

export class Listing {
  constructor(readonly attributes: ListingAttributes) {}

  static create(attributes: Omit<ListingAttributes, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Listing {
    const timestamp = new Date().toISOString()
    return new Listing({ ...attributes, id: randomUUID(), status: 'active', createdAt: timestamp, updatedAt: timestamp })
  }

  toJSON(): ListingAttributes {
    return this.attributes
  }
}
