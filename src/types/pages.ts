import { ClubLink, ClubName } from './clubs'
import { getPage } from '../handlers/http'
import { URL } from 'url'
import { Txt } from './fs'
import { Player, PlayerLink } from './players'

interface INameId {
	id: string
	name: string
}

abstract class Page {
	private static readonly baseUrl: string = 'https://afltables.com/'

	private readonly url: URL
	private readonly fKey: Txt

	constructor(u: string, f: Txt) {
		this.url = new URL(u, Page.baseUrl)
		this.fKey = f
	}

	async init(force = false): Promise<void> {
		if (force || !this.isCached) {
			const d = await getPage(this.url)

			await this.fromWeb(d)

			await this.saveCache()
		} else {
			await this.loadCache()
		}
	}

	protected get isCached() {
		return this.fKey.exists
	}

	protected nameIdToCache(i: INameId[]): string {
		return i.map((o) => `${o.id}:${o.name}`).join(';')
	}

	protected nameIdFromCache(i: string): INameId[] {
		const e = i.split(';')

		return e.map((s) => {
			const [ id, name ] = s.split(':')

			return {
				id,
				name
			}
		})
	}

	protected abstract saveCache(): Promise<void>

	protected async saveTxt(d: string): Promise<void> {
		this.fKey.save(d)
	}

	protected abstract loadCache(): Promise<void>

	protected async loadTxt(): Promise<string> {
		return this.fKey.load()
	}

	protected abstract fromWeb(d: string): Promise<void>
}

export class YearPage extends Page {
	private static teamLinkRegex = /<a href="[^"<>]*?teams\/[^"<>]*?([^"<>/]+?)_idx.html">([a-z ,-]*?)<\/a>/gmi
	private static playerLinkRegex = /<a href="[^"<>]*?players\/[^"<>]*?([^"<>/]+?).html">([a-z ,-]*?)<\/a>/gmi

	readonly year: number

	private readonly c: ClubLink[] = []
	private readonly p: PlayerLink[] = []

	constructor(year: number) {
		super(`/afl/stats/${year}.html`, new Txt('raw/year', String(year)))

		this.year = year
	}

	protected override async saveCache(): Promise<void> {
		const o: string[] = [
			this.nameIdToCache(this.c),
			this.nameIdToCache(this.p)
		]

		this.saveTxt(o.join('\n'))
	}

	protected override async loadCache(): Promise<void> {
		if (this.c.length > 0 || this.p.length > 0) return

		const d = await this.loadTxt()

		const [ c, p ] = d.split('\n').map(this.nameIdFromCache)

		const cl = c.map((c) => ClubLink.fromStringAndId(c.id, c.name))
		const pl = p.map((p) => PlayerLink.fromStringAndId(p.id, p.name))

		this.c.push(...cl)
		this.p.push(...pl)
	}

	protected override async fromWeb(d: string): Promise<void> {
		if (this.c.length > 0 || this.p.length > 0) return

		const cm = this.matchesFrom(YearPage.teamLinkRegex, d, ClubLink.fromStringAndId)
		const pm = this.matchesFrom(YearPage.playerLinkRegex, d, PlayerLink.fromStringAndId)

		this.c.push(...cm)
		this.p.push(...pm)
	}

	private matchesFrom<T extends ClubLink|PlayerLink>(r: RegExp, s: string, parser: (id: string, name: string) => T): T[] {
		const ms = s.matchAll(r)

		const o: T[] = []

		for (const m of ms) {
			o.push(parser(m[1], m[2]))
		}

		return o
	}

	get clubs(): ClubName[] {
		return this.c
	}

	get players(): Player[] {
		return this.p
	}
}
