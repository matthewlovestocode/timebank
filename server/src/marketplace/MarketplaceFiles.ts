import type { JsonFile } from '../files/JsonFile.js'
import { Category, type CategoryAttributes } from './Category.js'
import { Exchange, type ExchangeAttributes } from './Exchange.js'
import { Listing, type ListingAttributes } from './Listing.js'

export class CategoriesFile {
  constructor(private readonly file: JsonFile<CategoryAttributes>) {}
  async all() { return this.file.read() }
  async find(id: string) { return (await this.file.read()).find((category) => category.id === id) }
  async add(category: Category) { await this.file.write([...(await this.file.read()), category.toJSON()]) }
}

export class ListingsFile {
  constructor(private readonly file: JsonFile<ListingAttributes>) {}
  async all() { return this.file.read() }
  async forOwner(ownerId: string) { return (await this.file.read()).filter((listing) => listing.ownerId === ownerId) }
  async find(id: string) { return (await this.file.read()).find((listing) => listing.id === id) }
  async add(listing: Listing) { await this.file.write([...(await this.file.read()), listing.toJSON()]) }
}

export class ExchangesFile {
  constructor(private readonly file: JsonFile<ExchangeAttributes>) {}
  async all() { return this.file.read() }
  async forUser(userId: string) {
    return (await this.file.read()).filter((exchange) =>
      exchange.requesterId === userId || exchange.ownerId === userId,
    )
  }
  async find(id: string) { const value = (await this.file.read()).find((exchange) => exchange.id === id); return value ? new Exchange(value) : undefined }
  async add(exchange: Exchange) { await this.file.write([...(await this.file.read()), exchange.toJSON()]) }
  async update(exchange: Exchange) {
    await this.file.write((await this.file.read()).map((value) => value.id === exchange.attributes.id ? exchange.toJSON() : value))
  }
}
