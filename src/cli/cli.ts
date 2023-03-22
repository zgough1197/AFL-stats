import { Command } from '@commander-js/extra-typings'

const program = new Command()

program
	.name('afl-stats')
	.description('CLI program to download data from afl tables and process it into various forms')
	.version('2.0.1')
	.executableDir('./cli/commands')

program
	.command('fetch', 'fetch data from afltables.com', { executableFile: 'fetch' })
	.alias('f')


export const parse = () => {
	program.parseAsync()
}
