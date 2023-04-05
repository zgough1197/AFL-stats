import { Command } from '@commander-js/extra-typings'
import { clubOption, endYearOption, forYearOption, forceUpdate, startYearOption } from '../components/options'
import { logPlayer, toYearsList } from '../../utils'
import { loadData } from '../actions'
import { ClubName } from '../../types'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)
	.addOption(clubOption)
	.addOption(forceUpdate)

program.action(async ({ startYear, endYear, years, clubs, force }) => {
	const yearsList = toYearsList(startYear, endYear, years)

	if (!clubs || clubs.length === 0) {
		clubs = ClubName.getAll()
	}

	const { players } = await loadData(yearsList, clubs, force)

	const randomPlayer = players[Math.floor(Math.random() * players.length)]

	logPlayer(randomPlayer)

	const pendlesMatches = players.filter((p) => p.id === 'Scott_Pendlebury')

	if (pendlesMatches.length > 0) logPlayer(pendlesMatches[0])
})

program.parseAsync()
