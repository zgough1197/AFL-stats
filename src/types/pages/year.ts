import { getYearCacheHandler, CacheHandler, YearCData } from '../../handlers/fs/cache'
import { FetchHandler } from '../../handlers/http/fetch'
import { compareStrings } from '../../utils'
import { ClubName, YearClub } from '../clubs'
import { YearPlayer } from '../players'
import { Page } from './page'

export class YearPage extends Page {
	private static tableRegex = /<table[^>]*?>.*?<tbody[^>]*>(.*?)<\/tbody>.*?<\/table>/gmi
	private static teamLinkRegex = /<a href="[^"<>]*?teams\/[^"<>]*?([^"<>/]+?)_idx.html">([a-z ,-]*?)<\/a>/mi
	private static playerLinkRegex = /<a href="[^"<>]*?players\/[^"<>]*?([^"<>/]+?).html">([a-z ,-]*?)<\/a>/gmi

	protected override fetch: FetchHandler
	protected override cache: CacheHandler<YearCData>

	readonly year: number

	readonly clubs: YearClub[] = []
	readonly players: YearPlayer[] = []

	constructor(year: number) {
		super()

		this.fetch = new FetchHandler(Page.baseUrl, `/afl/stats/${year}.html`)
		this.cache = getYearCacheHandler(year)

		this.year = year
	}

	protected override async parse(): Promise<void> {
		if (this.clubs.length > 0 || this.players.length > 0) throw new Error('was asked to parse new data but it already exists, year: ' + String(this.year))

		if (this.fetch.data) {
			const d = this.fetch.data

			const tableMatches = d.matchAll(YearPage.tableRegex)

			for (const tm of tableMatches) {
				const clubMatch = tm[0].match(YearPage.teamLinkRegex)

				if (!clubMatch) throw new Error('could not find name of club in discovered table, year: ' + String(this.year))

				const club = new YearClub(clubMatch[2], clubMatch[1])

				this.clubs.push(club)

				const playerMatches = tm[1].matchAll(YearPage.playerLinkRegex)

				for (const pm of playerMatches) {
					this.players.push(new YearPlayer(pm[2], pm[1], this.year, club))
				}
			}

			await this.cache.update({
				clubs: this.clubs.sort((a, b): number => compareStrings(a.name, b.name)).map((c) => ({
					id: c.id,
					n: c.name
				})),
				players: this.players.sort((a, b): number => compareStrings(a.lastName, b.lastName)).map((p) => ({
					clubForYear: p.club.toString(),
					id: p.id,
					n: p.toCacheFormat()
				}))
			})
		} else {
			const d = this.cache.data as YearCData

			if (!d) throw new Error('attempted to get data from cache but found none, year: ' + String(this.year))

			d.clubs.forEach((c) => {
				this.clubs.push(new YearClub(c.n, c.id))
			})

			d.players.forEach((p) => {
				const clubName = new ClubName(p.clubForYear)

				if (!clubName) throw new Error(`could not get valid club name from cache, record: id: ${p.id}, name: ${p.n}, club: ${p.clubForYear}`)

				this.players.push(new YearPlayer(p.n, p.id, this.year, clubName))
			})
		}
	}
}
