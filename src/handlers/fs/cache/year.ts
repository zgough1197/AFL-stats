import { Txt } from '../fs'
import { CEntry, CacheDataHandler, CacheHandler } from './cache'

type ClubFields = 'id' | 'n'
type PlayerFields = 'clubForYear' | 'id' | 'n'

export type YearCData = {
	clubs: CEntry<ClubFields>[]
	players: CEntry<PlayerFields>[]
}

class YearCacheDataHandler extends CacheDataHandler<YearCData> {
	protected cData: YearCData = {
		clubs: [],
		players: []
	}

	override parseFn(d: string): void {
		const [ c, p ] = d.split('\n')

		const clubs = c.split(';').map((e: string): CEntry<ClubFields> => {
			const [ id, n ] = e.split('|')

			return {
				id,
				n
			}
		})

		const players = p.split(';').map((e: string): CEntry<PlayerFields> => {
			const [ clubForYear, id, n ] = e.split('|')

			return {
				clubForYear,
				id,
				n
			}
		})

		this.cData = {
			clubs,
			players
		}

		this.ready = true
	}

	override get data(): YearCData {
		if (!this.ready) {
			throw new Error('data was not ready to be read, not yet instantialised')
		}

		return this.cData
	}
}

export const getYearCacheHandler = (year: number): CacheHandler<YearCData> => {
	const fileKey = new Txt('raw/year', String(year))
	const dataHandler = new YearCacheDataHandler()

	return new CacheHandler<YearCData>(fileKey, dataHandler)
}
