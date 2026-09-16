import { describe, expect, it } from 'vitest'
import { Exchange } from './Exchange.js'

describe('Exchange', () => {
  it('only allows valid state transitions', () => {
    const exchange = Exchange.create({
      listingId: 'listing-1', requesterId: 'requester-1', ownerId: 'owner-1', agreedCreditMinutes: 60,
    })

    expect(() => exchange.complete()).toThrow('Only accepted exchanges can be completed')

    const accepted = exchange.accept()
    expect(() => accepted.accept()).toThrow('Only requested exchanges can be accepted')
  })
})
