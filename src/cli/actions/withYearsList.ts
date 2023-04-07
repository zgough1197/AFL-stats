import { toYearsList } from '../../utils'

interface HasYearOptions {
	startYear: number
	endYear: number
	years?: number[] | undefined
}

type DataWithYearsList<T extends HasYearOptions> = Omit<T, 'startYear' | 'endYear' | 'years'> & {
	years: number[]
}

export const withYearsList = <T extends HasYearOptions>(fn: (args_0: DataWithYearsList<T>) => Promise<void>): (args_0: T) => Promise<void> => {
	return async ({ startYear, endYear, years, ...remaining }: T): Promise<void> => {
		const yearsList = toYearsList(startYear, endYear, years)

		await fn({
			years: yearsList,
			...remaining
		})
	}
}

