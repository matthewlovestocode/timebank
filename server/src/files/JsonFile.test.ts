import { mkdir, mkdtemp } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { JsonFile } from './JsonFile.js'

describe('JsonFile', () => {
  it('uses a neighboring example file until local data exists', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'timebank-json-'))
    const example = new JsonFile<{ name: string }>(join(directory, 'listings.example.json'))
    await example.write([{ name: 'Useful listing' }])
    const local = new JsonFile<{ name: string }>(join(directory, 'listings.json'))
    expect(await local.read()).toEqual([{ name: 'Useful listing' }])
    await local.write([{ name: 'My local listing' }])
    expect(await local.read()).toEqual([{ name: 'My local listing' }])
  })

  it('can use an explicit application seed path', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'timebank-json-'))
    const seedPath = join(directory, 'seeds', 'categories.json')
    await new JsonFile<{ name: string }>(seedPath).write([{ name: 'Home & garden' }])
    const local = new JsonFile<{ name: string }>(join(directory, 'categories.json'), seedPath)
    expect(await local.read()).toEqual([{ name: 'Home & garden' }])
  })

  it('returns an empty collection when neither local nor example data exists', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'timebank-json-'))
    expect(await new JsonFile(join(directory, 'missing.json')).read()).toEqual([])
  })

  it('surfaces unreadable local and example files', async () => {
    const directory = await mkdtemp(join(tmpdir(), 'timebank-json-'))
    await expect(new JsonFile(join(directory, '.')).read()).rejects.toBeDefined()
    await mkdir(join(directory, 'example.example.json'))
    await expect(new JsonFile(join(directory, 'example.json')).read()).rejects.toBeDefined()
  })
})
