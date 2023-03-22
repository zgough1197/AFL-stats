import { HasStatus } from '../types'
import { getPage } from './http'

export class FetchHandler extends HasStatus {
	private readonly url: URL
	private d?: string

	constructor(urlBase: string, urlInput: string) {
		super()

		this.url = new URL(urlInput, urlBase)
	}

	async get(): Promise<void> {
		await this.whenReady(async () => {
			this.d = await getPage(this.url)
		})
	}

	get data(): string {
		return this.d || ''
	}
}
