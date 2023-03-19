import { Option } from '@commander-js/extra-typings'
import { toYear, toYears } from '../utils'

const deafultStartYear = 1990
const defaultEndYear = 2022

export const forYearOption = new Option('-f, --for-years <years...>', 'specify the only years for the operation')
	.argParser(toYears)
export const startYearOption = new Option('-s, --start-year <year>', 'starting year for the operation')
	.default(deafultStartYear)
	.argParser(toYear)
	.conflicts('forYears')
export const endYearOption = new Option('-e, --end-year <year>', 'end year for the operation')
	.default(defaultEndYear)
	.argParser(toYear)
	.conflicts('forYears')
