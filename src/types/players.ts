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

export class PlayerLink extends Player {
	static fromStringAndId(id: string, name: string): PlayerLink {
		return new PlayerLink(name, id)
	}

	readonly id: string

	protected constructor(n: string, id: string) {
		super(n)

		this.id = id
	}
}
