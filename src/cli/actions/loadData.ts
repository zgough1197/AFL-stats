import { ClubName, YearClub, YearPage, YearPlayer } from '../../types'

interface YearPageData {
	clubs: YearClub[]
	players: YearPlayer[]
}

export const loadData = async (years: number[], clubs: ClubName[], forceOnline: boolean): Promise<void> => {
	if (clubs.length === 0) {
		clubs.push(...ClubName.getAll())
	}

	const yearPages: YearPageData[] = await Promise.all(years.map(async (y: number) => {
		const yp = new YearPage(y)

		await yp.load(forceOnline)

		return {
			clubs: yp.clubs.filter((c) => c.isOneOf(clubs)),
			players: yp.players.filter((c) => c.club.isOneOf(clubs))
		}
	}))

	const { clubs: yearClubs, players: yearPlayers } = yearPages.reduce((curr: YearPageData, acc: YearPageData) => {
		acc.clubs.push(...curr.clubs)
		acc.players.push(...curr.players)

		return acc
	}, {
		clubs: [],
		players: []
	})

	console.log(yearClubs.map((yc) => yc.name).join(' | '))
	console.log(yearPlayers.map((yp) => yp.firstName.charAt(0) + ' ' + yp.lastName).join(','))
}
