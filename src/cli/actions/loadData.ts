import { PromiseHandler } from '../../handlers/promises'
import { ClubName, YearClub, YearPage, YearPlayer } from '../../types'
import { PlayerPage } from '../../types/pages/player'
import { Player } from '../../types/players/player'
import { compareStrings } from '../../utils'

interface YearPageData {
	clubs: YearClub[]
	players: YearPlayer[]
}

export const loadData = async (years: number[], clubs: ClubName[], forceOnline: boolean): Promise<{clubs: ClubName[], players: Player[]}> => {
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

	const { clubs: yearClubs, players: yearPlayers } = yearPages.reduce((acc: YearPageData, curr: YearPageData) => {
		const existingClubs = acc.clubs.map((c) => c.id)
		const existingPlayers = acc.players.map((p) => p.id)

		curr.clubs.forEach((c) => {
			if (!existingClubs.includes(c.id)) acc.clubs.push(c)
		})

		curr.players.forEach((p) => {
			if (!existingPlayers.includes(p.id)) acc.players.push(p)
		})

		acc.clubs.sort((a, b) => compareStrings(a.name, b.name))

		acc.players.sort((a, b) => {
			const res = compareStrings(a.lastName, b.lastName)

			return res !== 0 ? res : compareStrings(a.firstName, b.firstName)
		})

		return acc
	}, {
		clubs: [],
		players: []
	})

	const promiseHandler = new PromiseHandler(yearPlayers.map((yp: YearPlayer): () => Promise<Player> => {
		const pp = new PlayerPage(yp)

		const fn = async () => {
			await pp.load(forceOnline)

			return new Player(pp, years)
		}

		return fn
	}))

	const players = await promiseHandler.getResult()

	return {
		clubs: yearClubs,
		players
	}
}
