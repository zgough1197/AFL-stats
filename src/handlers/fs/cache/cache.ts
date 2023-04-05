import { HasStatus } from '../../types'
import { Txt } from '../fs'

export type CEntry<K extends string> = {
	[key in K]: string
}

export type CData<K extends string> = {
	[key in K]: CEntry<string>[]
}

export abstract class CacheDataHandler<T extends CData<string>> {
	protected ready = false

	protected abstract cData: CData<string>

	abstract parseFn(d: string): void
	abstract data: T

	update(d: T): void {
		this.cData = d
		this.ready = true
	}

	parse(d: string): void {
		this.parseFn(d)
		this.ready = true
	}

	get cacheData(): string {
		if (!this.ready) {
			throw new Error('data was not ready to be read, not yet instantialised')
		}

		const strings = Object.values(this.cData).map((entries): string => {
			return entries.map((e): string => Object.values(e).join('|')).join(';')
		})

		return strings.join('\n')
	}
}

export class CacheHandler<T extends CData<string>> extends HasStatus {
	protected readonly fileKey: Txt
	protected readonly dHandler: CacheDataHandler<T>

	constructor(fKey: Txt, dHandler: CacheDataHandler<T>) {
		super()

		this.fileKey = fKey
		this.dHandler = dHandler

		if (this.fileKey.exists) {
			this.whenReady(() => this.load())
		}
	}

	async update(d: T): Promise<void> {
		this.dHandler.update(d)

		await this.whenReady(() => this.save())
	}

	protected async load(): Promise<void> {
		const d = await this.fileKey.load()

		this.dHandler.parse(d)
	}

	protected async save(): Promise<void> {
		const d = this.dHandler.cacheData

		await this.fileKey.save(d)
	}

	get data(): CData<string> {
		return this.dHandler.data
	}

	get isCached(): boolean {
		return this.fileKey.exists
	}
}
