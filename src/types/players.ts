import { ClubName } from './clubs'

interface IPlayerName {
	name: string
	firstName: string
	lastName: string
	fullName: string
}

export class Player implements IPlayerName {
	readonly f: string
	readonly l: string

	constructor(n: string) {
		const name = n.split(',')

		if (name.length === 2) {
			[ this.l, this.f ] = name
		} else {
			throw new Error('invalid base name string, expected a single comma: ' + n)
		}
	}

	get name(): string {
		return `${this.l}, ${this.f}`
	}

	get firstName(): string {
		return this.f
	}

	get lastName(): string {
		return this.l
	}

	get fullName(): string {
		return `${this.f} ${this.l}`
	}
}

export class YearPlayer extends Player {
	readonly id: string
	readonly club: ClubName

	constructor(n: string, id: string, club: ClubName) {
		super(n)

		this.id = id
		this.club = club
	}
}
