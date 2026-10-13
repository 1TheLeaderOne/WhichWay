/**
 * 角色势力数据
 *
 * - `group`：驶舰之向势力 id（就是这里的键，注册进 `lib.group`）
 * - `sort`：势力排序 / 显示用的中文名（如「炎国-岁兽」）
 * - `reallyGroup`：该势力在明日方舟里的**真实势力 id**，`char.whichWay.reallyGroup` 用它映射阵营；
 *   少数势力（前文明 / 整合运动 / 卡兹戴尔相关）在明日方舟里没有对应，留空即可
 * - `logo`：势力图标名，对应 `image/camplogo/arknight/<logo>.png`；**默认就是真实势力名**，
 *   需要换图标时才单独写（`CharacterCard` 取势力图标时优先用这里的配置）
 * - `filter`：图标是否反色（`src/characterCard/CharacterCard.vue` 的 `.arknightCamp`，即 `filter: invert(1)`）。
 *   **不写**则沿用原流程：用明日方舟图标就反色、非明日方舟（`noname/name_*.png`）不反色
 *
 * @typedef {{ group: string, sort: string, reallyGroup?: string, logo?: string, filter?: boolean }} GroupDataItem
 */

/**
 * @type {Record<string, GroupDataItem>}
 * @example
 * {
 *   suimrfz: { group: "岁", sort: "炎国-岁兽", reallyGroup: "sui", logo: "sui" },
 *   luomrfz: { group: "罗", sort: "罗德岛", reallyGroup: "rhodes", logo: "rhodes", filter: false }
 * }
 */
export const groupData = {
	persona:{
		group:"女",
		sort:"联动-女神异闻录",
		reallyGroup:"persona",
		logo:"persona",
		filter:false,
	},
	suimrfz: {
		group: "岁",
		sort: "炎国-岁兽",
		reallyGroup: "sui",
		logo: "sui",
	},
	luomrfz: {
		group: "罗",
		sort: "罗德岛",
		reallyGroup: "rhodes",
		logo: "rhodes",
	},
	xiemrfz: {
		group: "谢",
		sort: "谢拉格",
		reallyGroup: "karlan",
		logo: "karlan",
	},
	bamrfz: {
		group: "巴",
		sort: "卡兹戴尔-巴别塔",
		reallyGroup: "babel",
		logo: "babel",
	},
	yimrfz: {
		group: "伊",
		sort: "伊比利亚",
		reallyGroup: "iberia",
		logo: "iberia",
	},
	laimrfz: {
		group: "莱",
		sort: "莱塔尼亚",
		reallyGroup: "leithanien",
		logo: "leithanien",
	},
	xumrfz: {
		group: "叙",
		sort: "叙拉古",
		reallyGroup: "siracusa",
		logo: "siracusa",
	},
	haimrfz: {
		group: "海",
		sort: "海嗣",
		reallyGroup: "egir",
		logo: "egir",
	},
	liemrfz: {
		group: "深",
		sort: "深海猎人",
		reallyGroup: "abyssal",
		logo: "abyssal",
	},
	qimrfz: {
		group: "企",
		sort: "企鹅物流",
		reallyGroup: "penguin",
		logo: "penguin",
	},
	kamrfz: {
		group: "卡",
		sort: "卡西米尔",
		reallyGroup: "kazimierz",
		logo: "kazimierz",
	},
	gemrfz: {
		group: "哥",
		sort: "哥伦比亚",
		reallyGroup: "columbia",
		logo: "columbia",
	},
	longmrfz: {
		group: "龙",
		sort: "炎国-龙门",
		reallyGroup: "lgd",
		logo: "lgd",
	},
	weimrfz: {
		group: "维",
		sort: "维多利亚",
		reallyGroup: "victoria",
		logo: "victoria",
	},
	lamrfz: {
		group: "拉",
		sort: "拉特兰",
		reallyGroup: "laterano",
		logo: "laterano",
	},
	shimrfz: {
		group: "使",
		sort: "使徒",
		reallyGroup: "followers",
		logo: "followers",
	},
	wumrfz: {
		group: "乌",
		sort: "乌萨斯",
		reallyGroup: "ursus",
		logo: "ursus",
	},
	samrfz: {
		group: "萨",
		sort: "萨尔贡",
		reallyGroup: "sargon",
		logo: "sargon",
	},
	othermrfz: {
		group: "联",
		sort: "联动",
		reallyGroup: "rainbow",
		logo: "rainbow",
	},
	yanmrfz: {
		group: "炎",
		sort: "炎国",
		reallyGroup: "yan",
		logo: "yan",
	},
	limrfz: {
		group: "鲤",
		sort: "炎-龙门-鲤氏侦探事务所",
		reallyGroup: "lee",
		logo: "lee",
	},
	ximrfz: {
		group: "汐",
		sort: "汐斯塔",
		reallyGroup: "siesta",
		logo: "siesta",
	},
	hongmrfz: {
		group: "红",
		sort: "卡西米尔-红松骑士团",
		reallyGroup: "pinus",
		logo: "pinus",
	},
	dongmrfz: {
		group: "东",
		sort: "东国",
		reallyGroup: "higashi",
		logo: "higashi",
	},
	lymrfz: {
		group: "茵",
		sort: "哥伦比亚-莱茵生命",
		reallyGroup: "rhine",
		logo: "rhine",
	},
	shenmrfz: {
		group: "深",
		sort: "深池",
		reallyGroup: "tara",
		logo: "tara",
	},
	//前文明在明日方舟里没有对应势力，不配真实势力与图标（角色卡回退为显示势力文字）
	qianmrfz: {
		group: "前",
		sort: "前文明",
	},
	mimrfz: {
		group: "诺",
		sort: "米诺斯",
		reallyGroup: "minos",
		logo: "minos",
	},
	samimrfz: {
		group: "米",
		sort: "萨米",
		reallyGroup: "sami",
		logo: "sami",
	},
	//同上：整合运动在 image/camplogo/arknight 里没有对应图标
	zhmrfz: {
		group: "整",
		sort: "整合运动",
	},
	leimrfz: {
		group: "雷",
		sort: "雷姆必拓",
		reallyGroup: "rim",
		logo: "rim",
	},
	bomrfz: {
		group: "玻",
		sort: "玻利瓦尔",
		reallyGroup: "bolivar",
		logo: "bolivar",
	},
	//同上：卡兹戴尔相关（军事委员会 / 卡兹戴尔）没有独立图标，巴别塔另有 bamrfz
	junmrfz: {
		group: "军",
		sort: "卡兹戴尔-军事委员会",
	},
	kaizidaiermrfz: {
		group: "卡",
		sort: "卡兹戴尔",
	},
	a_groupmrfz: {
		group: "阿",
		sort: "阿戈尔",
		reallyGroup: "abyssal",
		logo: "abyssal",
	},
};

/**
 * 取角色所属势力的数据。
 *
 * 匹配顺序（越靠前越精确）：
 * 1. `camp`：角色的明日方舟阵营（`char.whichWay.arknight.camp`，可能是自定义阵营，如 `persona`）。
 *    与条目的**键 / reallyGroup / logo** 任一相等即算命中 —— 这样"为某个阵营单独开一条 groupData
 *    （键直接写成阵营名）"就能对自定义阵营生效；
 * 2. `group`：`groupData` 的键（角色的 `group`）；
 * 3. `reallyGroup`：角色的真实势力。角色的 `group` 可能被「统一势力」配置改成 `sjzx_group`（泰拉），
 *    这时按 group 查不到，需要靠它兜底。
 *
 * @param {string} [group] 角色的 `group`
 * @param {string} [reallyGroup] 角色的真实势力（`char.whichWay.reallyGroup`）
 * @param {string} [camp] 角色的明日方舟阵营（`char.whichWay.arknight.camp`）
 * @returns {GroupDataItem | undefined}
 */
export const getGroupData = (group, reallyGroup, camp) =>
	(camp
		? groupData[camp] ?? Object.values(groupData).find(info => info.reallyGroup === camp || info.logo === camp)
		: undefined) ?? groupData[group] ?? Object.values(groupData).find(info => !!info.reallyGroup && info.reallyGroup === reallyGroup);
