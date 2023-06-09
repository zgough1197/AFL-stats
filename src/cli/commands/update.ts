import { Command } from '@commander-js/extra-typings'
import { clubOption, endYearOption, forYearOption, forceUpdate, startYearOption } from '../components/options'
import { logPlayer } from '../../utils'
import { loadData } from '../actions/loadData'
import { ClubName } from '../../types'
import { withYearsList } from '../actions/withYearsList'

const program = new Command()
	.addOption(forYearOption)
	.addOption(startYearOption)
	.addOption(endYearOption)
	.addOption(clubOption)
	.addOption(forceUpdate)

program.action(withYearsList<typeof program extends Command<[], infer O> ? O : never>(async ({ years, clubs, force }) => {
	if (!clubs || clubs.length === 0) {
		clubs = ClubName.getAll()
	}

	const { players } = await loadData(years, clubs, force)

	const randomPlayer = players[Math.floor(Math.random() * players.length)]

	logPlayer(randomPlayer)

	const pendlesMatches = players.filter((p) => p.id === 'Scott_Pendlebury')

	if (pendlesMatches.length > 0) logPlayer(pendlesMatches[0])
}))

program.parseAsync()
