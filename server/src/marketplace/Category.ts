import { randomUUID } from 'node:crypto'

export type CategoryAttributes = {
  id: string
  name: string
  appliesTo: Array<'item' | 'service'>
  createdAt: string
}

export class Category {
  constructor(readonly attributes: CategoryAttributes) {}

  static create(name: string, appliesTo: CategoryAttributes['appliesTo']): Category {
    return new Category({ id: randomUUID(), name, appliesTo, createdAt: new Date().toISOString() })
  }

  toJSON(): CategoryAttributes {
    return this.attributes
  }
}
