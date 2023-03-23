type ClubNameAliases = {
	[key in CLUB_NAME]: Lowercase<string>[]
}

enum CLUB_NAME {
  ADEL = 'Adelaide',
  BRIS = 'Brisbane',
  CARL = 'Carlton',
  COLL = 'Collingwood',
  ESS = 'Essendon',
  FITZ = 'Fitzroy',
  FRE = 'Fremantle',
  GEEL = 'Geelong',
  GC = 'Gold Coast',
  GWS = 'Greater Western Sydney',
  HAW = 'Hawthorn',
  MEL = 'Melbourne',
  NM = 'North Melbourne',
  PA = 'Port Adelaide',
  RICH = 'Richmond',
  STK = 'St Kilda',
  SYD = 'Sydney',
  UNIV = 'University',
  WC = 'West Coast',
  WB = 'Western Bulldogs'
}

const aliases: ClubNameAliases = {
	[CLUB_NAME.ADEL]: [
		'adelaide',
		'adel',
		'ac',
		'crows',
		'ad'
	],
	[CLUB_NAME.BRIS]: [
		'brisbane',
		'bris',
		'bl',
		'bb',
		'bears',
		'lions',
		'brisbane lions',
		'brisbane bears'
	],
	[CLUB_NAME.CARL]: [
		'carlton',
		'carl',
		'cb',
		'blues'
	],
	[CLUB_NAME.COLL]: [
		'collingwood',
		'coll',
		'cwood',
		'pies',
		'magpies',
		'cw',
		'cm'
	],
	[CLUB_NAME.ESS]: [
		'essendon',
		'ess',
		'bombers'
	],
	[CLUB_NAME.FITZ]: [
		'fitzroy',
		'fitz',
		'fl',
		'fr'
	],
	[CLUB_NAME.FRE]: [
		'fremantle',
		'fre',
		'dockers',
		'freo',
		'fd'
	],
	[CLUB_NAME.GEEL]: [
		'geelong',
		'geel',
		'cats',
		'gee',
		'gl'
	],
	[CLUB_NAME.GC]: [
		'gold coast',
		'gc',
		'suns'
	],
	[CLUB_NAME.GWS]: [
		'greater western sydney',
		'gws',
		'giants'
	],
	[CLUB_NAME.HAW]: [
		'hawthorn',
		'haw',
		'hh',
		'hawks'
	],
	[CLUB_NAME.MEL]: [
		'melbourne',
		'mel',
		'demons',
		'md'
	],
	[CLUB_NAME.NM]: [
		'north melbourne',
		'nm',
		'kangaroos',
		'roos',
		'kangas'
	],
	[CLUB_NAME.PA]: [
		'port adelaide',
		'pa',
		'port',
		'power'
	],
	[CLUB_NAME.RICH]: [
		'richmond',
		'rich',
		'tigers',
		'rt'
	],
	[CLUB_NAME.STK]: [
		'saint kilda',
		'st kilda',
		'sk',
		'stk',
		'saints'
	],
	[CLUB_NAME.SYD]: [
		'sydney',
		'south melbourne',
		'sm',
		'syd',
		'swans',
		'ss'
	],
	[CLUB_NAME.UNIV]: [
		'university',
		'uni'
	],
	[CLUB_NAME.WC]: [
		'west coast',
		'eagles',
		'wce',
		'wc'
	],
	[CLUB_NAME.WB]: [
		'western bulldogs',
		'wb',
		'bulldogs',
		'footscray',
		'dogs',
		'foot'
	]
}

export class ClubName {
	static getAll(): ClubName[] {
		return Object.values(CLUB_NAME).map((n) => new ClubName(n))
	}

	readonly name: CLUB_NAME

	protected readonly aliases: Lowercase<string>[]

	constructor(n: ClubName|CLUB_NAME|string) {
		const name = n instanceof ClubName ? n.name : n

		const parseAliasEntry = ([ clubName, aliases ]: [string, Lowercase<string>[]]): [CLUB_NAME, Lowercase<string>[]] => [ <CLUB_NAME>clubName, aliases ]

		const matches = Object.entries(aliases)
			.map(parseAliasEntry)
			.filter(([ clubName, aliases ]) => String(clubName) === name || aliases.includes(name.toLowerCase() as Lowercase<string>))

		if (matches.length !== 1) {
			throw new Error('name string was not a valid club name, input: ' + name)
		}

		[ this.name, this.aliases ] = matches[0]
	}

	toString(): string {
		return String(this.name)
	}

	is(term: string|ClubName) {
		return term instanceof ClubName ? term.name === this.name : this.aliases.includes(term.toLowerCase() as Lowercase<string>)
	}

	isOneOf(searchTerms: string[]|ClubName[]): boolean {
		return searchTerms.map((s) => this.is(s)).includes(true)
	}
}
