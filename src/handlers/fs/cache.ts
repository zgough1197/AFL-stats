import { HasStatus } from '../types'
import { Txt } from './fs'

export interface CacheData {
	[key: string]: CacheEntry[]
}

export interface CacheEntry {
	[key: string]: string
}

export interface YearPageCacheData extends CacheData {
	clubs:{
		id: string
		n: string
	}[]
	players: {
		clubForYear: string
		id: string
		n: string
	}[]
}

export abstract class CacheHandler<T extends CacheData> extends HasStatus {
	protected readonly fileKey: Txt
	protected cacheData?: T

	constructor(categoryString: string, n: string) {
		super()

		this.fileKey = new Txt(categoryString, n)

		if (this.fileKey.exists) {
			this.whenReady(() => this.load())
		}
	}

	async setData(d: T): Promise<void> {
		this.cacheData = d

		await this.whenReady(() => this.save())
	}

	protected abstract load(): Promise<void>

	protected abstract save(): Promise<void>

	get isCached(): boolean {
		return this.fileKey.exists
	}

	get data(): T|undefined {
		return this.cacheData
	}
}

export class YearCacheHandler extends CacheHandler<YearPageCacheData> {
	constructor(year: number) {
		super('raw/year', String(year))
	}

	protected override async load(): Promise<void> {
		const d = await this.fileKey.load()

		const [ clubsData, playersData ] = d.split('\n')

		const clubEntries = clubsData.split(';')
		const playerEntries = playersData.split(';')

		const clubs = clubEntries.map((c) => {
			const [ id, n ] = c.split(':')

			return {
				id,
				n
			}
		})

		const players = playerEntries.map((c) => {
			const [ clubName, id, n ] = c.split(':')

			return {
				clubForYear: clubName,
				id,
				n
			}
		})

		this.cacheData = {
			clubs,
			players
		}
	}

	protected override async save(): Promise<void> {
		if (!this.cacheData) throw new Error('asked to save cache with no data loaded')

		const { clubs, players } = this.cacheData

		const clubsData = clubs.map((c) => c.id + ':' + c.n)
		const playerData = players.map((p) => p.clubForYear + ':' + p.id + ':' + p.n)

		const d = clubsData.join(';') + '\n' + playerData.join(';')

		this.fileKey.save(d)
	}
}
