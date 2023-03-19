import { Command, InvalidArgumentError } from '@commander-js/extra-typings'
import { endYearOption, forYearOption, startYearOption } from '../components/options'
import { getAllForYearRange } from '../../http'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)

program.parseAsync()

const { startYear, endYear, forYears } = program.opts()
const years: number[] = forYears || []

if (!forYears) {
	if (startYear > endYear) throw new InvalidArgumentError('The start year must come before the end year')

	for (let y = startYear; y <= endYear; y++) {
		years.push(y)
	}
}

getAllForYearRange(years)
