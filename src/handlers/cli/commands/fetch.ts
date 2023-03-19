import { Command, InvalidArgumentError } from '@commander-js/extra-typings'
import { clubOption, endYearOption, forYearOption, startYearOption } from '../components/options'
import { getAllForYearRange } from '../../http'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)
	.addOption(clubOption)

program.parseAsync()

const { startYear, endYear, years = [] } = program.opts()

if (years.length === 0) {
	if (startYear > endYear) throw new InvalidArgumentError('The start year must come before the end year')

	for (let y = startYear; y <= endYear; y++) {
		years.push(y)
	}
}

getAllForYearRange(years)
