import { ClubName } from '../clubs'
import { PlayerYearInfo } from './year'

export interface PlayerNumber {
	readonly num: number
	readonly club: ClubName
	readonly years: number[]
}

export class WornNumber {
	readonly num: number
	readonly club: ClubName
	readonly years: number[] = []

	constructor(yi: PlayerYearInfo) {
		this.num = yi.num
		this.club = yi.club
		this.years.push(yi.year)
	}

	is(n: number, c: ClubName): boolean {
		return this.num === n && this.club.is(c)
	}

	addYear(yi: PlayerYearInfo) {
		if (this.num === yi.num && this.club.is(yi.club)) {
			this.years.push(yi.year)
		} else {
			throw new Error('year and club did not match when computing player worn numbers')
		}
	}
}
