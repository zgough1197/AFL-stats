import { ClubName } from './names'

export class YearClub extends ClubName {
	readonly id: string

	constructor(cn: ClubName, id: string)
	constructor(cn: string, id: string)
	constructor(name: ClubName|string, id: string) {
		super(name)

		this.id = id
	}
}
