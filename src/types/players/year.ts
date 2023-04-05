import { ClubName } from '../clubs'
import { PlayerGameStats } from '../stats/game'
import { PlayerName } from './name'

export class YearPlayer extends PlayerName {
	readonly club: ClubName
	readonly year: number

	constructor(n: string, id: string, year: number, club: ClubName) {
		super(id, n)

		this.club = club
		this.year = year
	}
}

export type PlayerYearInfo = {
	readonly club: ClubName
	readonly year: number
	readonly num: number
}

export class PlayerYear extends PlayerName implements PlayerYearInfo {
	readonly club: ClubName
	readonly year: number
	readonly num: number
	readonly games: PlayerGameStats[]

	constructor(yp: YearPlayer, club: ClubName, year:number, num: number, games: PlayerGameStats[]) {
		super(yp.id, yp.toCacheFormat())

		this.club = club
		this.year = year
		this.num = num
		this.games = games
	}
}
