import { Command } from '@commander-js/extra-typings'

const program = new Command()

program
	.name('afl-stats')
	.description('CLI program to download data from afl tables and process it into various forms')
	.version('2.0.1')
	.executableDir('./handlers/cli/commands')

program
	.command('fetch', 'fetch data from afltables.com', { executableFile: 'fetch' })
	.alias('f')

// program
// .command()

// program
//   .command('install [name]', 'install one or more packages').alias('i')
//   .command('search [query]', 'search with optional query').alias('s')
//   .command('update', 'update installed packages', { executableFile: 'myUpdateSubCommand' })


export const parse = () => {
	program.parseAsync()
}
