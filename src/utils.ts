import { InvalidArgumentError } from '@commander-js/extra-typings'
import { Player } from './types/players/player'
import { PlayerGameStats } from './types/stats/game'

export const minYear = 1965
export const maxYear = 2022

const validYear = (y: number): boolean => {
	return y <= maxYear && y >= minYear
}

export const toYearsList = (s: number, e: number, f?: number[]): number[] => {
	const years = f ? f.filter(validYear) : []

	if (years.length > 0) {
		if (f && f.length > years.length) console.log('some years supplied were outside of the acceptable range (1965-2022), only using: ' + years.join(', '))

		return years.sort()
	}

	if (f && f.length > 0) console.log('the years supplied were outside of the acceptable range (1965-2022), defaulting to 1990-2022')

	if (s > e) throw new InvalidArgumentError('the start year must come before the end year')

	for (let y = s; y <= e; y++) {
		years.push(y)
	}

	return years
}

export const compareStrings = (a: string, b: string): number => {
	return a.toLowerCase() > b.toLowerCase() ? 1 : a.toLowerCase() < b.toLowerCase() ? -1 : 0
}

interface YearRun {
	startYear: number
	endYear: number
}

export const yearListToString = (...years: number[]): string => {
	let runs: YearRun[] = []

	years.forEach((y) => {
		const runMatches: YearRun[] = []

		runs.forEach((r) => {
			const min = r.startYear - 1
			const max = r.endYear + 1

			if (max >= y && y >= min) {
				runMatches.push(r)
			}
		})

		if (runMatches.length === 0) {
			runs.push({
				startYear: y,
				endYear: y
			})
		} else {
			const otherRuns = runs.filter((r) => !runMatches.includes(r))

			const years = runMatches.reduce((a: number[], m: YearRun): number[] => {
				for (let i = m.startYear; i <= m.endYear; i++) {
					a.push(i)
				}

				return a
			}, [])

			years.push(y)

			const runToAdd: YearRun = {
				startYear: Math.min(...years),
				endYear: Math.max(...years)
			}

			runs = [ ...otherRuns, runToAdd ]
		}
	})

	return runs.map((r) => r.startYear === r.endYear ? String(r.startYear) : `${r.startYear}-${r.endYear}`).join(', ')
}

export const logPlayer = (p: Player) => {
	console.log(p.fullName)
	p.clubs.forEach((c) => {
		console.log(`\tPlayed for ${c.club.name} ${c.years.length > 1 ? 'from' : 'in'} ${yearListToString(...c.years)}`)

		const numStrings = p.wornNumbers.filter((wn) => wn.club.is(c.club)).map((wn): string => {
			return `${wn.num} (${yearListToString(...wn.years)})`
		})

		console.log('\t\tWore number ' + numStrings.join(', '))

		const clubGames = p.games.filter((g) => c.years.includes(g.year))

		const [ totalGames, wins, losses, draws ] = reduceYearGames(clubGames)

		console.log(`\t\tPlayed ${totalGames} games (${wins}-${losses}-${draws}) over ${c.years.length} years`)

		c.years.forEach((y) => {
			const yearGames = clubGames.filter((g) => g.year === y)

			const [ totalGames, wins, losses, draws ] = reduceYearGames(yearGames)

			console.log(`\t\t\t${y}: ${totalGames} games (${wins}-${losses}-${draws})`)
		})
	})
}

const reduceYearGames = (games: PlayerGameStats[]): number[] => {
	return games.reduce((a, g) => {
		const [ tg, w, l, d ] = a

		return [
			tg + 1,
			g.result === 'W' ? w + 1 : w,
			g.result === 'L' ? l + 1 : l,
			g.result === 'D' ? d + 1 : d
		]
	}, [ 0, 0, 0, 0 ])
}
