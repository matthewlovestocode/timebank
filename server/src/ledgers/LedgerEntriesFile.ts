import type { JsonFile } from '../files/JsonFile.js'
import type { LedgerEntry, LedgerEntryAttributes } from './LedgerEntry.js'

export class LedgerEntriesFile {
  constructor(private readonly file: JsonFile<LedgerEntryAttributes>) {}

  async findByLedgerId(ledgerId: string): Promise<LedgerEntryAttributes[]> {
    return (await this.file.read()).filter((entry) => entry.ledgerId === ledgerId)
  }

  async add(entry: LedgerEntry): Promise<void> {
    const entries = await this.file.read()
    await this.file.write([...entries, entry.toJSON()])
  }
}
