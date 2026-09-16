import { mkdir, readFile, rename, writeFile } from 'node:fs/promises'
import { dirname, extname } from 'node:path'

export class JsonFile<T> {
  constructor(
    private readonly path: string,
    private readonly seedPath?: string,
  ) {}

  async read(): Promise<T[]> {
    try {
      return JSON.parse(await readFile(this.path, 'utf8')) as T[]
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        const examplePath = this.seedPath ?? this.path.replace(new RegExp(`${extname(this.path)}$`), `.example${extname(this.path)}`)
        try {
          return JSON.parse(await readFile(examplePath, 'utf8')) as T[]
        } catch (exampleError) {
          if ((exampleError as NodeJS.ErrnoException).code === 'ENOENT') return []
          throw exampleError
        }
      }
      throw error
    }
  }

  async write(items: T[]): Promise<void> {
    await mkdir(dirname(this.path), { recursive: true })

    const temporaryPath = `${this.path}.tmp`
    await writeFile(temporaryPath, JSON.stringify(items, null, 2))
    await rename(temporaryPath, this.path)
  }
}
