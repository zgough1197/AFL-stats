import { existsSync } from 'fs'
import { writeFile, mkdir, readFile } from 'fs/promises'
import path from 'path'

const outputDir = '../../../data'

export const txtFileExists = (k: Txt): boolean => existsSync(k.loc)

export const getFromFile = async (k: Txt): Promise<string> => readFile(k.loc, 'utf8')


abstract class File {
	readonly loc: string

	protected static async verifyDirs(dir: string) {
		await mkdir(dir, { recursive: true })
	}

	constructor(d: string, f: string, ext: string) {
		f = f.endsWith(ext) ? f : f + ext
		this.loc = path.join(__dirname, outputDir, d, f)
	}

	get dir(): string {
		return path.dirname(this.loc)
	}

	get exists(): boolean {
		return existsSync(this.loc)
	}
}

export class Txt extends File {
	constructor(d: string, f: string) {
		super(d, f, '.txt')
	}

	async save(data: string): Promise<void> {
		await File.verifyDirs(this.dir)
		await writeFile(this.loc, data, 'utf8')
	}

	async load(): Promise<string> {
		return readFile(this.loc, 'utf8')
	}
}
