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

const ClubAliases = {
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
	static fromString(s: string): ClubName|undefined {
		let name: CLUB_NAME|undefined
		let aliases: string[] = []
		const n = s.toLowerCase()

		for (const cn of Object.values(CLUB_NAME)) {
			const as = ClubAliases[cn]

			if (as.includes(n.toLowerCase())) {
				name = cn
				aliases = as

				break
			}
		}

		if (name === undefined) return undefined

		return new ClubName(name, aliases)
	}

	private readonly n: CLUB_NAME
	private readonly a: string[]

	constructor(cn: CLUB_NAME, a: string[]) {
		this.n = cn
		this.a = a
	}

	get name(): CLUB_NAME|undefined {
		return this.n
	}

	is(o: string|ClubName) {
		return ClubName.name === this.n || typeof o === 'string' && this.a.includes(o.toLowerCase())
	}
}
