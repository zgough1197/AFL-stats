import { ClubName } from '../clubs'
import { PlayerName } from './names'

export class YearPlayer extends PlayerName {
	readonly id: string
	readonly club: ClubName

	constructor(n: string, id: string, club: ClubName) {
		super(n)

		this.id = id
		this.club = club
	}
}
