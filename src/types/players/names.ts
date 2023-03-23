type NameFormat = 'cache' | 'web' | 'invalid'

interface IPlayerName {
	firstName: string
	lastName: string
	fullName: string
}

export class PlayerName implements IPlayerName {
	readonly firstName: string
	readonly lastName: string

	constructor(n: string) {
		const format: NameFormat = n.split(/,|_/).length !== 2 ? 'invalid' : n.split(',').length === 2 ? 'web' : n.split('_').length === 2 ? 'cache' : 'invalid'

		let f: string
		let l: string

		switch (format) {
		case 'cache':
			[ f, l ] = n.split('_')
			break
		case 'web':
			[ l, f ] = n.split(',')
			break
		case 'invalid':
			throw new Error('invalid base name string, expected either a single comma or a single underscore: ' + n)
		}

		this.firstName = f.trim()
		this.lastName = l.trim()
	}

	toCacheFormat(): string {
		return `${this.firstName}_${this.lastName}`
	}

	toString(): string {
		return this.fullName
	}

	get fullName(): string {
		return `${this.firstName} ${this.lastName}`
	}
}

