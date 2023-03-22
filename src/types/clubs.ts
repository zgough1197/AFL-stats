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

export class ClubName {
	private static readonly aliases: {[name in CLUB_NAME]: string[]} = {
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

	static fromString(s: string): ClubName|undefined {
		const name = this.getMatch(s)

		if (name === undefined) return undefined

		return new ClubName(name)
	}

	protected static getMatch(s: string): CLUB_NAME|undefined {
		const n = s.toLowerCase()

		let name: CLUB_NAME|undefined

		for (const cn of Object.values(CLUB_NAME)) {
			const as = this.aliases[cn]

			if (as.includes(n.toLowerCase())) {
				name = cn

				break
			}
		}

		return name
	}

	static fromName(n: CLUB_NAME): ClubName {
		return new ClubName(n)
	}

	static getAll(): ClubName[] {
		const o: ClubName[] = []

		for (const cn of Object.values(CLUB_NAME)) {
			o.push(ClubName.fromName(cn))
		}

		return o
	}

	private readonly n: CLUB_NAME

	protected constructor(cn: CLUB_NAME) {
		this.n = cn
	}

	get name(): CLUB_NAME {
		return this.n
	}

	toString(): string {
		return String(this.n)
	}

	is(searchTerm: string|ClubName) {
		const a = ClubName.aliases[this.name]
		const n = this.name

		if (typeof searchTerm === 'string') {
			return a.includes(searchTerm.toLowerCase())
		}

		return searchTerm.name === n
	}

	isOneOf(searchTerms: string[]|ClubName[]): boolean {
		return searchTerms.map((s) => this.is(s)).includes(true)
	}
}

export class YearClub extends ClubName {
	readonly id: string

	constructor(cn: ClubName, id: string)
	constructor(cn: CLUB_NAME, id: string)
	constructor(a: CLUB_NAME|ClubName, id: string) {
		super(a instanceof ClubName ? a.name : a)

		this.id = id
	}
}
