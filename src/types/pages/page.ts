import { CData, CacheHandler } from '../../handlers/fs/cache/cache'
import { FetchHandler } from '../../handlers/http/fetch'
import { HasChildrenWithStatus } from '../../handlers/types'

export abstract class Page extends HasChildrenWithStatus {
	protected static readonly baseUrl: string = 'https://afltables.com/'

	protected abstract fetch: FetchHandler
	protected abstract cache: CacheHandler<CData<string>>

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
