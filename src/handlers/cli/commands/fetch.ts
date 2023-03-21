import { Command, InvalidArgumentError } from '@commander-js/extra-typings'
import { clubOption, endYearOption, forYearOption, forceUpdate, startYearOption } from '../components/options'
import { ClubName, YearPage } from '../../../types'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)
	.addOption(clubOption)
	.addOption(forceUpdate)

program.action(({ startYear, endYear, years = [], clubs = [], force }) => {
	if (years.length === 0) {
		if (startYear > endYear) throw new InvalidArgumentError('the start year must come before the end year')

		for (let y = startYear; y <= endYear; y++) {
			years.push(y)
		}
	}

	if (clubs.length === 0) {
		clubs.push(...ClubName.getAll())
	}

	const yearPages = years.map((y) => new YearPage(y))

	yearPages.forEach(async (yp) => {
		await yp.init(force)

		const clubLinks = yp.clubs.filter((c) => c.isOneOf(clubs))

		console.log(clubLinks.map((c) => c.name + ' ' + yp.year))
	})
})

program.parseAsync()

