import { PlayerPage } from '../pages/player'
import { PlayerGameStats } from '../stats/game'
import { PlayerClub } from './club'
import { PlayerName } from './name'
import { WornNumber } from './number'
import { PlayerYearInfo } from './year'

export class Player extends PlayerName {
	private y: PlayerYearInfo[]
	private g: PlayerGameStats[]

	private f: number[]

	constructor(pp: PlayerPage, f: number[]) {
		super(pp.id, pp.toCacheFormat())

		this.y = pp.yearsInfo
		this.g = pp.games

		this.f = f
	}

	get years(): PlayerYearInfo[] {
		return this.y
	}

	get clubs(): PlayerClub[] {
		const clubs: PlayerClub[] = []

		this.years.forEach((y) => {
			const found = clubs.filter((c): boolean => c.club.is(y.club))

			switch (found.length) {
			case 0:
				clubs.push({
					club: y.club,
					years: [ y.year ]
				})

				return
			case 1:
				found[0].years.push(y.year)

				return
			default:
				throw new Error('duplicate club found where it shouldn\'t exist')
			}
		})

		return clubs
	}

	get wornNumbers(): WornNumber[] {
		const wornNums: WornNumber[] = []

		this.years.forEach((y) => {
			const found = wornNums.filter((wn: WornNumber) => wn.is(y.num, y.club))

			switch (found.length) {
			case 0:
				wornNums.push(new WornNumber(y))

				return
			case 1:
				found[0].addYear(y)

				return
			default:
				throw new Error('duplicate worn number found where it shouldn\'t exist')
			}
		})

		return wornNums
	}

	get statsForYears(): number[] {
		return this.f
	}

	get games(): PlayerGameStats[] {
		return this.g.filter((pg: PlayerGameStats): boolean => this.f ? this.f.includes(pg.year) : true)
	}
}
