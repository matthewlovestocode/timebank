import type { JsonFile } from '../files/JsonFile.js'
import { Ledger, type LedgerAttributes } from './Ledger.js'

export class LedgersFile {
  constructor(private readonly file: JsonFile<LedgerAttributes>) {}

  async findByUserId(userId: string): Promise<Ledger | undefined> {
    const attributes = (await this.file.read()).find((ledger) => ledger.userId === userId)
    return attributes ? new Ledger(attributes) : undefined
  }

  async add(ledger: Ledger): Promise<void> {
    const ledgers = await this.file.read()
    await this.file.write([...ledgers, ledger.toJSON()])
  }
}
