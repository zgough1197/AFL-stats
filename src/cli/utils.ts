import { InvalidArgumentError } from '@commander-js/extra-typings'


export const minYear = 1965
export const maxYear = 2022

const validYear = (y: number): boolean => {
	return y < maxYear && y > minYear
}

export const toYearsList = (s: number, e: number, f?: number[]): number[] => {
	const years = f ? f.filter(validYear) : []

	if (years.length > 0) {
		if (f && f.length > years.length) console.log('some years supplied were outside of the acceptable range (1965-2022), only using: ' + years.join(', '))

		return years.sort()
	}

	if (f && f.length > 0) console.log('some years supplied were outside of the acceptable range (1965-2022), defaulting to 1990-2022')

	if (s > e) throw new InvalidArgumentError('the start year must come before the end year')

	for (let y = s; y <= e; y++) {
		years.push(y)
	}

	return years
}
