import { Txt } from '../fs'
import { CEntry, CacheDataHandler, CacheHandler } from './cache'

type InfoFields = 'id' | 'name'
type YearFields = 'year' | 'club' | 'num'
type StatFields = 'ki' | 'mk' | 'hb' | 'gl' | 'bh' | 'ho' | 'tk' | 'i50' | 'cl' | 'cg' | 'ff' | 'fa' | 'bv'

export type GameFields = 'id' | 'year' | 'round' | 'opponent' | 'result' | StatFields

export type PlayerCData = {
	info: CEntry<InfoFields>[]
	years: CEntry<YearFields>[]
	games: CEntry<GameFields>[]
}

class PlayerCacheDataHandler extends CacheDataHandler<PlayerCData> {
	protected cData: PlayerCData = {
		info: [],
		years: [],
		games: []
	}

	override parseFn(d: string): void {
		const [ i, y, g ] = d.split('\n')

		const info = i.split(';').map((e: string): CEntry<InfoFields> => {
			const [ id, name ] = e.split('|')

			return {
				id,
				name
			}
		})

		const years = y.split(';').map((e: string): CEntry<YearFields> => {
			const [ year, club, num ] = e.split('|')

			return {
				year,
				club,
				num
			}
		})

		const games = g.split(';').map((e: string): CEntry<GameFields> => {
			const [ id, year, round, opponent, result, ki, mk, hb, gl, bh, ho, tk, i50, cl, cg, ff, fa, bv ] = e.split('|')

			return {
				id,
				year,
				round,
				opponent,
				result,
				ki,
				mk,
				hb,
				gl,
				bh,
				ho,
				tk,
				i50,
				cl,
				cg,
				ff,
				fa,
				bv
			}
		})

		this.cData = {
			info,
			years,
			games
		}
	}

	override get data(): PlayerCData {
		if (!this.ready) {
			throw new Error('data was not ready to be read, not yet instantialised')
		}

		return this.cData
	}
}

export const getPlayerCacheHandler = (id: string): CacheHandler<PlayerCData> => {
	const fileKey = new Txt('raw/player', id)
	const dataHandler = new PlayerCacheDataHandler()

	return new CacheHandler<PlayerCData>(fileKey, dataHandler)
}
