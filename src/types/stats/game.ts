import { ClubName } from '../clubs'
import { Stats } from './stats'

export type GameResult = 'W' | 'L' | 'D'
export type RoundLabel = 'EF' | 'QF' | 'SF' | 'PF' | 'GF' | number

export const RoundLabel = (r: string|number): RoundLabel => {
	if (typeof r === 'string' && [ 'EF', 'QF', 'SF', 'PF', 'GF' ].includes(r)) {
		return r as RoundLabel
	} else {
		const rOut = Number(r)

		if (isNaN(rOut)) throw new Error('')

		return rOut
	}
}

export interface HasGameStats extends Stats {
	id: string
	year: number
	round: RoundLabel
	opponent: ClubName
	result: GameResult
}

export class PlayerGameStats implements HasGameStats {
	readonly id: string
	readonly year: number
	readonly round: RoundLabel
	readonly opponent: ClubName
	readonly result: GameResult

	readonly ki: number
	readonly mk: number
	readonly hb: number
	readonly gl: number
	readonly bh: number
	readonly ho: number
	readonly tk: number
	readonly i50: number
	readonly cl: number
	readonly cg: number
	readonly ff: number
	readonly fa: number
	readonly bv: number

	constructor(gs: HasGameStats) {
		const { id, year, round, opponent, result, ...stats } = gs

		const { ki, mk, hb, gl, bh, ho, tk, i50, cl, cg, ff, fa, bv } = stats as Stats

		this.id = id
		this.year = year
		this.round = round
		this.opponent = opponent
		this.result = result

		this.ki = ki
		this.mk = mk
		this.hb = hb
		this.gl = gl
		this.bh = bh
		this.ho = ho
		this.tk = tk
		this.i50 = i50
		this.cl = cl
		this.cg = cg
		this.ff = ff
		this.fa = fa
		this.bv = bv
	}

	get gameStats(): HasGameStats {
		return {
			id: this.id,
			year: this.year,
			round: this.round,
			opponent: this.opponent,
			result: this.result,
			...this.stats
		}
	}

	get stats(): Stats {
		return {
			ki: this.ki,
			mk: this.mk,
			hb: this.hb,
			gl: this.gl,
			bh: this.bh,
			ho: this.ho,
			tk: this.tk,
			i50: this.i50,
			cl: this.cl,
			cg: this.cg,
			ff: this.ff,
			fa: this.fa,
			bv: this.bv
		}
	}
}
