import { getPlayerCacheHandler, CacheHandler, PlayerCData, CEntry, GameFields } from '../../handlers/fs/cache'
import { FetchHandler } from '../../handlers/http/fetch'
import { PlayerName } from '../players/name'
import { PlayerYear, PlayerYearInfo, YearPlayer } from '../players'
import { Page } from './page'
import { GameResult, PlayerGameStats, RoundLabel } from '../stats/game'
import { ClubName } from '../clubs'

export class PlayerPage extends Page implements PlayerName {
	private static yearTableRegex = /<table[^>]*?><thead><tr><th colspan=28[^<>]*?>([a-z ]*) - (\d{4}).*?<tbody[^>]*>(.*?)<\/tbody>.*?<\/table>/gmi
	private static matchRegex = /<tr>(?:<td[^>]*>([^]*?)<\/td>){28}<\/tr>/gmi
	private static statRegex = /<td[^>]*>(<a href="[^>]*?games\/\d{4}\/(\d+?).html">([egpqs]f|\d{1,2})<\/a>|([^<>]*?))<\/td>/gi

	protected override fetch: FetchHandler
	protected override cache: CacheHandler<PlayerCData>

	private readonly yearPlayer: YearPlayer

	private readonly years: PlayerYear[] = []

	constructor(yp: YearPlayer) {
		super()

		this.fetch = new FetchHandler(Page.baseUrl, `/afl/stats/players/${yp.id.charAt(0)}/${yp.id}.html`)
		this.cache = getPlayerCacheHandler(yp.id)

		this.yearPlayer = yp
	}

	protected override async parse(): Promise<void> {
		if (this.years.length > 0) throw new Error('was asked to parse new data but it already exists, player: ' + this.yearPlayer.id)

		if (this.fetch.data) {
			const d = this.fetch.data

			const yearMatches = d.matchAll(PlayerPage.yearTableRegex)

			for (const ym of yearMatches) {
				const club = ym[1]
				const year = Number(ym[2])

				const matchMatches = Array.from(ym[3].matchAll(PlayerPage.matchRegex))

				let num = -1

				const stats = matchMatches.map((mm): PlayerGameStats => {
					const statMatches = Array.from(mm[0].matchAll(PlayerPage.statRegex))

					const opponent = new ClubName(statMatches[1][1])

					const [ , , id, rd ] = statMatches[2]
					const round = RoundLabel(rd)

					const result = statMatches[3][1] as GameResult

					const [
						,
						,
						,
						,
						pNum,
						ki,
						mk,
						hb,
						gl,
						bh,
						ho,
						tk,
						,
						i50,
						cl,
						cg,
						ff,
						fa,
						bv
					] = statMatches.map((r): number => {
						return r[1] === '&nbsp;' ? 0 : Number(r[1]) || -1
					})

					num = pNum

					return new PlayerGameStats({
						id,
						year,
						round,
						opponent,
						result,
						ki,
						mk,
						hb,
						gl,
						bh,
						ho,
						tk,
						i50,
						cl,
						cg,
						ff,
						fa,
						bv
					})
				})

				const py = new PlayerYear(this.yearPlayer, new ClubName(club), year, num, stats)

				this.years.push(py)
			}

			await this.cache.update({
				info: [
					{
						id: this.id,
						name: this.yearPlayer.toCacheFormat()
					}
				],
				years: this.years.map((y) => ({
					year: String(y.year),
					club: y.club.name,
					num: String(y.num)
				})),
				games: this.years.reduce((a: CEntry<GameFields>[], c: PlayerYear): CEntry<GameFields>[] => {
					const s = c.games

					const o = s.map((e) => ({
						id: e.id,
						year: String(e.year),
						round: RoundLabel(e.round),
						opponent: e.opponent.name,
						result: e.result,
						ki: String(e.ki),
						mk: String(e.mk),
						hb: String(e.hb),
						gl: String(e.gl),
						bh: String(e.bh),
						ho: String(e.ho),
						tk: String(e.tk),
						i50: String(e.i50),
						cl: String(e.cl),
						cg: String(e.cg),
						ff: String(e.ff),
						fa: String(e.fa),
						bv: String(e.bv)
					} as CEntry<GameFields>))

					return a.concat(o)
				}, [])
			})
		} else {
			const d = this.cache.data as PlayerCData

			if (!d) throw new Error('attempted to get data from cache but found none, year: ' + this.yearPlayer.id)

			const info = d.info[0]

			d.years.forEach((y) => {
				const g = d.games.filter((g) => g.year === y.year)
				const club = new ClubName(y.club)
				const stats = g.map((gm): PlayerGameStats => new PlayerGameStats({
					id: gm.id,
					year: Number(gm.year),
					round: RoundLabel(gm.round),
					opponent: new ClubName(gm.opponent),
					result: gm.result as GameResult,
					ki: Number(gm.ki),
					mk: Number(gm.mk),
					hb: Number(gm.hb),
					gl: Number(gm.gl),
					bh: Number(gm.bh),
					ho: Number(gm.ho),
					tk: Number(gm.tk),
					i50: Number(gm.i50),
					cl: Number(gm.cl),
					cg: Number(gm.cg),
					ff: Number(gm.ff),
					fa: Number(gm.fa),
					bv: Number(gm.bv)
				}))

				const py = new PlayerYear(new YearPlayer(info.name, info.id, Number(y.year), club), club, Number(y.year), Number(y.num), stats)

				this.years.push(py)
			})
		}
	}

	get id(): string {
		return this.yearPlayer.id
	}

	get firstName(): string {
		return this.yearPlayer.firstName
	}

	get lastName(): string {
		return this.yearPlayer.lastName
	}

	get fullName(): string {
		return this.yearPlayer.fullName
	}

	get yearsInfo(): PlayerYearInfo[] {
		return this.years.map((y): PlayerYearInfo => ({
			club: y.club,
			year: y.year,
			num: y.num
		}))
	}

	get games(): PlayerGameStats[] {
		return this.years.reduce((a: PlayerGameStats[], y: PlayerYear): PlayerGameStats[] => {
			return a.concat(y.games)
		}, [])
	}

	toCacheFormat(): string {
		return this.yearPlayer.toCacheFormat()
	}

	override toString(): string {
		return this.fullName
	}
}
