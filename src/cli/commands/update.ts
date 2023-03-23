import { Command } from '@commander-js/extra-typings'
import { clubOption, endYearOption, forYearOption, forceUpdate, startYearOption } from '../components/options'
import { toYearsList } from '../utils'
import { loadData } from '../actions'
import { ClubName } from '../../types'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)
	.addOption(clubOption)
	.addOption(forceUpdate)

program.action(({ startYear, endYear, years, clubs, force }) => {
	const yearsList = toYearsList(startYear, endYear, years)

	if (!clubs || clubs.length === 0) {
		clubs = ClubName.getAll()
	}

	loadData(yearsList, clubs, force)
})

program.parseAsync()

