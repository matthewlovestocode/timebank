import request from 'supertest'
import { describe, expect, it } from 'vitest'
import { app } from '../app.js'

const suffix = `${Date.now()}-${Math.random().toString(16).slice(2)}`

async function signUp(name: string, role: 'member' | 'admin' = 'member') {
  const response = await request(app).post('/api/auth/sign-up').send({
    name,
    email: `${name.toLowerCase().replaceAll(' ', '-')}-${suffix}@example.timebank`,
    password: 'timebank-test-password',
    role,
  })
  return response.body.token as string
}

describe('marketplace routes', () => {
  it('creates, exchanges, and settles a time-priced service', async () => {
    const adminToken = await signUp('Catalog Admin', 'admin')
    const ownerToken = await signUp('Service Owner')
    const requesterToken = await signUp('Service Requester')

    const category = await request(app)
      .post('/api/marketplace/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Home help', appliesTo: ['service'] })

    expect(category.status).toBe(201)

    const listing = await request(app)
      .post('/api/marketplace/listings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        categoryId: category.body.id,
        kind: 'service',
        title: 'Help assemble furniture',
        description: 'Two hours of careful assembly help.',
        creditMinutes: 120,
      })

    expect(listing.status).toBe(201)

    const listingDetail = await request(app).get(`/api/marketplace/listings/${listing.body.id}`)
    expect(listingDetail.status).toBe(200)
    expect(listingDetail.body.title).toBe('Help assemble furniture')
    expect((await request(app).get('/api/marketplace/listings/not-a-listing')).status).toBe(404)

    const ownerListings = await request(app)
      .get('/api/marketplace/my-listings')
      .set('Authorization', `Bearer ${ownerToken}`)
    expect(ownerListings.body).toHaveLength(1)

    const exchange = await request(app)
      .post('/api/marketplace/exchanges')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ listingId: listing.body.id })

    expect(exchange.status).toBe(201)
    expect(exchange.body.agreedCreditMinutes).toBe(120)

    const accepted = await request(app)
      .post(`/api/marketplace/exchanges/${exchange.body.id}/accept`)
      .set('Authorization', `Bearer ${ownerToken}`)
    expect(accepted.body.status).toBe('accepted')

    const completed = await request(app)
      .post(`/api/marketplace/exchanges/${exchange.body.id}/complete`)
      .set('Authorization', `Bearer ${ownerToken}`)
    expect(completed.body.status).toBe('completed')

    const requesterDashboard = await request(app)
      .get('/api/auth/dashboard')
      .set('Authorization', `Bearer ${requesterToken}`)
    const ownerDashboard = await request(app)
      .get('/api/auth/dashboard')
      .set('Authorization', `Bearer ${ownerToken}`)

    expect(requesterDashboard.body.balanceMinutes).toBe(1080)
    expect(ownerDashboard.body.balanceMinutes).toBe(1320)

    const exchanges = await request(app)
      .get('/api/marketplace/exchanges')
      .set('Authorization', `Bearer ${requesterToken}`)
    expect(exchanges.body).toHaveLength(1)

    const ledger = await request(app)
      .get('/api/auth/ledger')
      .set('Authorization', `Bearer ${requesterToken}`)
    expect(ledger.body).toMatchObject({ balanceMinutes: 1080 })
    expect(ledger.body.entries).toHaveLength(2)
  })

  it('rejects unauthenticated, incompatible, and self-requested listings', async () => {
    expect((await request(app).post('/api/marketplace/listings')).status).toBe(401)

    const adminToken = await signUp('Second Admin', 'admin')
    const ownerToken = await signUp('Item Owner')
    expect(
      (await request(app).post('/api/marketplace/categories').set('Authorization', `Bearer ${ownerToken}`).send({ name: 'Nope', appliesTo: ['item'] })).status,
    ).toBe(403)
    const category = await request(app)
      .post('/api/marketplace/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Items only', appliesTo: ['item'] })

    const incompatible = await request(app)
      .post('/api/marketplace/listings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryId: category.body.id, kind: 'service', title: 'Help', description: 'Help', creditMinutes: 60 })
    expect(incompatible.status).toBe(400)

    const item = await request(app)
      .post('/api/marketplace/listings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ categoryId: category.body.id, kind: 'item', title: 'Garden tools', description: 'A useful set.', creditMinutes: null })
    const ownRequest = await request(app)
      .post('/api/marketplace/exchanges')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ listingId: item.body.id })
    expect(ownRequest.status).toBe(400)

    const requesterToken = await signUp('Gift Requester')
    const giftExchange = await request(app)
      .post('/api/marketplace/exchanges')
      .set('Authorization', `Bearer ${requesterToken}`)
      .send({ listingId: item.body.id })
    expect(giftExchange.status).toBe(201)

    const cancelled = await request(app)
      .post(`/api/marketplace/exchanges/${giftExchange.body.id}/cancel`)
      .set('Authorization', `Bearer ${requesterToken}`)
    expect(cancelled.body.status).toBe('cancelled')

    const cancelledAgain = await request(app)
      .post(`/api/marketplace/exchanges/${giftExchange.body.id}/cancel`)
      .set('Authorization', `Bearer ${requesterToken}`)
    expect(cancelledAgain.status).toBe(400)
  })
})
