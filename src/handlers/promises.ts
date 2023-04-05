export class PromiseHandler<T> {
	private static maxConcurrency = 15
	private static runningCount = 0

	private static async startAction(fn: () => Promise<void>) {
		this.runningCount++

		await fn()

		this.runningCount--
		this.run()
	}

	private static queue: (() => void)[] = []

	private static run() {
		while (this.runningCount < this.maxConcurrency && this.queue.length > 0) {
			const action = this.queue.shift()

			if (action) {
				action()
			}
		}
	}

	static setLimit(n: number): void {
		this.maxConcurrency = n
	}

	private q: (() => Promise<T>)[] = []
	private active = 0
	private d: T[] = []
	private r: ((res: T[]) => void)[] = []

	constructor(fns: (() => Promise<T>)[]) {
		this.addFn(...fns)
	}

	addFn(...fns: (() => Promise<T>)[]) {
		fns.forEach((f) => {
			this.q.push(f)

			PromiseHandler.queue.push(() => this.go())
		})

		PromiseHandler.run()
	}

	private go(): void {
		const fn = this.q.shift()

		if (fn) {
			this.startAction(async () => {
				const res = await fn()

				this.d.push(res)
			})
		}
	}

	private startAction(action: () => Promise<void>) {
		PromiseHandler.startAction(async () => {
			this.active++

			await action()

			this.active--

			this.checkFinish()
		})
	}

	private checkFinish(): void {
		if (this.active === 0 && this.q.length === 0) {
			this.r.forEach((resolve) => {
				resolve(this.d)
			})
		}
	}

	async getResult(): Promise<T[]> {
		return new Promise((res) => {
			this.r.push(res)
		})
	}
}
