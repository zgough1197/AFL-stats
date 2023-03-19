export const getAllForYearRange = (years: number[]): string[] => {
	return years.map(getAllForYear)
}

export const getAllForYear = (year: number) => {
	return getPage(`www.afltables.com/${year}`)
}

const getPage = (url: string): string => {
	console.log(url)

	return 'test'
}

