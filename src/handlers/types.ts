export abstract class HasStatus {
	private action?: Promise<void>

	private async startAction(fn: () => Promise<void>): Promise<void> {
		this.action = fn()
		await this.action
		this.action = undefined
	}

	async whenReady(callback?: () => Promise<void>): Promise<void> {
		if (!this.ready) {
			await this.action
		}

		return callback && this.startAction(callback)
	}

	protected get ready() {
		return this.action === undefined
	}
}

export abstract class HasChildrenWithStatus {
	protected async whenReady(callback?: () => Promise<void>): Promise<void> {
		const children: HasStatus[] = Object.values(this).filter((c): boolean => c instanceof HasStatus)

		await Promise.all(children.map((c) => c.whenReady()))

		return callback && callback()
	}
}
