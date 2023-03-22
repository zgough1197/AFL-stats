import { CacheData, CacheHandler, YearCacheHandler } from '../handlers/fs/cache'
import { FetchHandler } from '../handlers/http/fetch'
import { HasChildrenWithStatus } from '../handlers/types'
import { YearClub, ClubName } from './clubs'
import { YearPlayer } from './players'

abstract class Page extends HasChildrenWithStatus {
	protected static readonly baseUrl: string = 'https://afltables.com/'

	protected abstract fetch: FetchHandler
	protected abstract cache: CacheHandler<CacheData>

	async load(forceOnlineUpdate = false): Promise<void> {
		return this.whenReady(() => this.doLoad(forceOnlineUpdate))
	}

	private async doLoad(force: boolean): Promise<void> {
		if (force || !this.cache.isCached) {
			await this.fetch.get()
		}

		return this.parse()
	}

	protected abstract parse(): Promise<void>
}

export class YearPage extends Page {
	private static tableRegex = /<table[^>]*?>.*?<tbody[^>]*>(.*?)<\/tbody>.*?<\/table>/gmi
	private static teamLinkRegex = /<a href="[^"<>]*?teams\/[^"<>]*?([^"<>/]+?)_idx.html">([a-z ,-]*?)<\/a>/mi
	private static playerLinkRegex = /<a href="[^"<>]*?players\/[^"<>]*?([^"<>/]+?).html">([a-z ,-]*?)<\/a>/gmi

	protected override fetch: FetchHandler
	protected override cache: YearCacheHandler

	readonly year: number

	readonly clubs: YearClub[] = []
	readonly players: YearPlayer[] = []

	constructor(year: number) {
		super()

		this.fetch = new FetchHandler(Page.baseUrl, `/afl/stats/${year}.html`)
		this.cache = new YearCacheHandler(year)

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

				const club = ClubName.fromString(clubMatch[2])

				if (!club) throw new Error('could not find valid name of club in discovered table, string: ' + clubMatch[2])

				this.clubs.push(new YearClub(club, clubMatch[1]))

				const playerMatches = tm[1].matchAll(YearPage.playerLinkRegex)

				for (const pm of playerMatches) {
					this.players.push(new YearPlayer(pm[2], pm[1], club))
				}
			}

			this.cache.setData({
				clubs: this.clubs.map((c) => ({
					id: c.id,
					n: c.name
				})),
				players: this.players.map((p) => ({
					clubForYear: p.club.toString(),
					id: p.id,
					n: p.name
				}))
			})
		} else {
			const d = this.cache.data

			if (!d) throw new Error('attempted to get data from cache but found none, year: ' + String(this.year))

			d.clubs.forEach((c) => {
				const clubName = ClubName.fromString(c.n)

				if (!clubName) throw new Error(`could not get valid club name from cache, record: id: ${c.id}, name: ${c.n}`)

				this.clubs.push(new YearClub(clubName, c.id))
			})

			d?.players.forEach((p) => {
				const clubName = ClubName.fromString(p.clubForYear)

				if (!clubName) throw new Error(`could not get valid club name from cache, record: id: ${p.id}, name: ${p.n}, club: ${p.clubForYear}`)

				this.players.push(new YearPlayer(p.n, p.id, clubName))
			})
		}
	}
}
