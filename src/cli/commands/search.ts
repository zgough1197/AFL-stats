import { Command } from '@commander-js/extra-typings'
import { clubOption, endYearOption, forYearOption, startYearOption } from '../components/options'
import { logPlayer, toYearsList } from '../../utils'
import { loadData } from '../actions/loadData'
import { ClubName } from '../../types'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)
	.addOption(clubOption)

program.action(async ({ startYear, endYear, years, clubs }) => {
	const yearsList = toYearsList(startYear, endYear, years)

	if (!clubs || clubs.length === 0) {
		clubs = ClubName.getAll()
	}

	const { players } = await loadData(yearsList, clubs, false)

	const randomPlayer = players[Math.floor(Math.random() * players.length)]

	logPlayer(randomPlayer)

	const pendlesMatches = players.filter((p) => p.id === 'Scott_Pendlebury')

	if (pendlesMatches.length > 0) logPlayer(pendlesMatches[0])
})

program.parseAsync()
