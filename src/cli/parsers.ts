import { InvalidArgumentError } from '@commander-js/extra-typings'
import { ClubName } from '../types'
import { maxYear, minYear } from '../utils'

export const toYear = (v: string): number => {
	const n = parseInt(v)

	if (isNaN(n)) {
		throw new InvalidArgumentError('Year was not a valid number')
	}

	if (n > maxYear || n < minYear) {
		throw new InvalidArgumentError(`Year was outside of allowed range. Must be between ${minYear} and ${maxYear}`)
	}

	return n
}

export const toYears = (v: string, p: number[] = []): number[] => {
	return p.concat(toYear(v)).sort()
}

export const toClub = (v: string): ClubName => {
	return new ClubName(v)
}

export const toClubs = (v: string, p: ClubName[] = []): ClubName[] => {
	return p.concat(toClub(v)).sort()
}
