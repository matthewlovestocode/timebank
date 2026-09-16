import { Router } from 'express'
import { resolve } from 'node:path'
import { sessions } from './auth.js'
import { CreateCategoryContract, CreateListingContract } from '../contracts/marketplace.js'
import { ErrorResponseContract } from '../contracts/auth.js'
import { JsonFile } from '../files/JsonFile.js'
import { Category } from '../marketplace/Category.js'
import { Exchange } from '../marketplace/Exchange.js'
import { CategoriesFile, ExchangesFile, ListingsFile } from '../marketplace/MarketplaceFiles.js'
import { Listing } from '../marketplace/Listing.js'
import { LedgerEntriesFile } from '../ledgers/LedgerEntriesFile.js'
import { LedgerEntry } from '../ledgers/LedgerEntry.js'
import { LedgersFile } from '../ledgers/LedgersFile.js'

const categories = new CategoriesFile(
  new JsonFile(
    resolve(process.cwd(), 'data/categories.json'),
    resolve(process.cwd(), 'data/seeds/categories.json'),
  ),
)
const listings = new ListingsFile(new JsonFile(resolve(process.cwd(), 'data/listings.json')))
const exchanges = new ExchangesFile(new JsonFile(resolve(process.cwd(), 'data/exchanges.json')))
const ledgers = new LedgersFile(new JsonFile(resolve(process.cwd(), 'data/ledgers.json')))
const ledgerEntries = new LedgerEntriesFile(new JsonFile(resolve(process.cwd(), 'data/ledger-entries.json')))

function currentUser(authorization: string | undefined) {
  return sessions.find(authorization?.replace(/^Bearer\s+/i, ''))
}
function error(message: string) { return ErrorResponseContract.parse({ error: message }) }

export const marketplaceRouter = Router()

marketplaceRouter.get('/categories', async (_request, response) => response.json(await categories.all()))
marketplaceRouter.get('/listings', async (_request, response) => response.json(await listings.all()))
marketplaceRouter.get('/listings/:id', async (request, response) => {
  const listing = await listings.find(request.params.id)
  if (!listing) return response.status(404).json(error('Listing not found'))
  return response.json(listing)
})
marketplaceRouter.get('/my-listings', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  if (!user) return response.status(401).json(error('Authentication is required'))
  return response.json(await listings.forOwner(user.id))
})

marketplaceRouter.post('/categories', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  if (!user || user.role !== 'admin') return response.status(403).json(error('Admin access is required'))
  const result = CreateCategoryContract.safeParse(request.body)
  if (!result.success) return response.status(400).json(error('Invalid category'))
  const category = Category.create(result.data.name, result.data.appliesTo)
  await categories.add(category)
  return response.status(201).json(category.toJSON())
})

marketplaceRouter.post('/listings', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  if (!user) return response.status(401).json(error('Authentication is required'))
  const result = CreateListingContract.safeParse(request.body)
  if (!result.success) return response.status(400).json(error('Invalid listing'))
  const category = await categories.find(result.data.categoryId)
  if (!category || !category.appliesTo.includes(result.data.kind)) return response.status(400).json(error('Category cannot be used for this listing'))
  const listing = Listing.create({ ...result.data, ownerId: user.id })
  await listings.add(listing)
  return response.status(201).json(listing.toJSON())
})

marketplaceRouter.post('/exchanges', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  if (!user) return response.status(401).json(error('Authentication is required'))
  const listingId = typeof request.body?.listingId === 'string' ? request.body.listingId : ''
  const listing = await listings.find(listingId)
  if (!listing || listing.status !== 'active') return response.status(404).json(error('Listing not found'))
  if (listing.ownerId === user.id) return response.status(400).json(error('You cannot request your own listing'))
  const exchange = Exchange.create({ listingId, requesterId: user.id, ownerId: listing.ownerId, agreedCreditMinutes: listing.creditMinutes })
  await exchanges.add(exchange)
  return response.status(201).json(exchange.toJSON())
})

marketplaceRouter.get('/exchanges', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  if (!user) return response.status(401).json(error('Authentication is required'))
  return response.json(await exchanges.forUser(user.id))
})

marketplaceRouter.post('/exchanges/:id/accept', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  const exchange = await exchanges.find(request.params.id)
  if (!user || !exchange || exchange.attributes.ownerId !== user.id) return response.status(404).json(error('Exchange not found'))
  try { const accepted = exchange.accept(); await exchanges.update(accepted); return response.json(accepted.toJSON()) }
  catch { return response.status(400).json(error('Exchange cannot be accepted')) }
})

marketplaceRouter.post('/exchanges/:id/complete', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  const exchange = await exchanges.find(request.params.id)
  if (!user || !exchange || exchange.attributes.ownerId !== user.id) return response.status(404).json(error('Exchange not found'))
  try {
    const completed = exchange.complete()
    if (completed.attributes.agreedCreditMinutes) {
      const [requesterLedger, ownerLedger] = await Promise.all([ledgers.findByUserId(completed.attributes.requesterId), ledgers.findByUserId(completed.attributes.ownerId)])
      if (!requesterLedger || !ownerLedger) return response.status(400).json(error('Exchange ledgers are unavailable'))
      await ledgerEntries.add(LedgerEntry.createExchangeSettlement(requesterLedger.id, completed.attributes.id, 'debit', completed.attributes.agreedCreditMinutes))
      await ledgerEntries.add(LedgerEntry.createExchangeSettlement(ownerLedger.id, completed.attributes.id, 'credit', completed.attributes.agreedCreditMinutes))
    }
    await exchanges.update(completed)
    return response.json(completed.toJSON())
  } catch { return response.status(400).json(error('Exchange cannot be completed')) }
})

marketplaceRouter.post('/exchanges/:id/cancel', async (request, response) => {
  const user = currentUser(request.header('authorization'))
  const exchange = await exchanges.find(request.params.id)
  if (!user || !exchange || (exchange.attributes.requesterId !== user.id && exchange.attributes.ownerId !== user.id)) {
    return response.status(404).json(error('Exchange not found'))
  }
  try {
    const cancelled = exchange.cancel()
    await exchanges.update(cancelled)
    return response.json(cancelled.toJSON())
  } catch {
    return response.status(400).json(error('Exchange cannot be cancelled'))
  }
})
