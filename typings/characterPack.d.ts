/**
 * 驶舰之向角色设置（挂在 `char.whichWay` 上）。
 *
 * **声明时每个字段都可以自定义**：写了就一律以声明为准（包括显式写 `false`），
 * 没写的字段在注册阶段（`initCharConfig` → `whichWayArknight.initCharArknight`）
 * 用默认值 / 明日方舟数据补全 —— 补全规则写在每个字段的注释里。
 */
declare type WhichWayCharConfig = {
	/**
	 * 是否为支援器械
	 *
	 * 缺省（`undefined`）时按明日方舟 tag 里的「支援机器」推导
	 */
	supportingEquipment?: boolean;

	/**
	 * 设计者
	 *
	 * 声明成字符串时会被规整成数组
	 */
	designer?: string | Array<string>;

	/**
	 * 真正的势力（明日方舟势力 id，取值见 `src/packs/base/groups.js` 的 `groupData.reallyGroup`）
	 *
	 * 缺省时取角色的 `group`
	 */
	reallyGroup?: string;

	/**
	 * 角色id(驶舰之向)
	 *
	 * 缺省时取角色的名字（注册时的 `name`）
	 */
	charId?: string;

	/**
	 * 是不是联动角色
	 *
	 * 缺省（`undefined`）时按明日方舟可用配音语言里是否含 `LINKAGE` 推导
	 */
	linkage?: boolean;

	/**
	 * 死亡音频相关
	 *
	 * 运行期由音频模块（`whichWayAudio.initDieAudio`）在「本地缺少阵亡语音 + 明日方舟干员」时挂载；
	 * 自行提供实现即可覆盖模块行为（提供了就不再被模块改写/清除）。
	 */
	dieAudio?: {
		that: WhichWayCharConfig;
		get useLocalAudio(): boolean;
		get lang(): string;
		get voiceUrl(): string[];
		voicesTitle: string[];
		play(): HTMLAudioElement;
	};

	/**
	 * 明日方舟数据
	 *
	 * 每个字段同样可自定义，缺省时才用明日方舟表格补全（`initCharArknight`），详见各字段注释。
	 */
	arknight?: {
		/**
		 * 角色id(明日方舟)
		 *
		 * 缺省时优先取角色声明的 `arkuid`，再按角色id反查
		 */
		charId?: string;
		/**
		 * 明日方舟阵营
		 *
		 * 缺省时按真实势力（`reallyGroup`）映射
		 */
		camp?: ArksCamps | string;
		/**
		 * 明日方舟可用配音语言
		 *
		 * 声明了就完全采用声明的列表（不再按明日方舟数据推导）
		 */
		avaiableLangs?: string[];
		/**
		 * 角色tag
		 *
		 * 声明了就完全采用声明的列表（不再按明日方舟数据推导）
		 */
		tags?: string[];
	};
};

declare type WhichWayCharacterArray = [Sex, string, number | string, string[], string[]];

interface WhichWayCharacterPrototype {
	/**
	 * 武将牌的性别
	 * @type { Sex | "" }
	 **/
	sex: Sex | "";
	/**
	 * 武将牌的体力值
	 * @type { number }
	 **/
	hp: number;
	/**
	 * 武将牌的体力上限
	 * @type { number }
	 **/
	maxHp?: number;
	/**
	 * 武将牌的护甲值
	 * @type { number }
	 **/
	hujia?: number;
	/**
	 * 武将姓名
	 * @type { string|undefined }
	 */
	names?: string;
	/**
	 * 武将牌的势力
	 * @type { string }
	 **/
	group: string;
	/**
	 * 武将牌的势力边框颜色（如徐庶“身在曹营心在汉”）
	 * @type { string|undefined }
	 **/
	groupBorder?: string;
	/**
	 * 神武将牌在国战模式下的势力
	 * @type { string|undefined }
	 **/
	groupInGuozhan?: string;
	/**
	 * 该武将在国战模式下对应君主武将的id，不写默认为`gz_jun_${name}`
	 * @type { string|undefined }
	 **/
	junName?: string;
	/**
	 * 武将牌拥有的技能
	 * @type { string[] }
	 **/
	skills: string[];
	/**
	 * 武将牌是否为常备主公
	 * @type { boolean }
	 **/
	isZhugong?: boolean;
	/**
	 * 武将牌是否为隐藏武将
	 * @type { boolean }
	 **/
	isUnseen?: boolean;
	/**
	 * 武将牌是否拥有隐匿技能
	 * @type { boolean }
	 **/
	hasHiddenSkill?: boolean;
	/**
	 * 垃圾桶，用于存储原本Character[4]的垃圾数据
	 * @type { any[] }
	 **/
	trashBin?: any[];
	/**
	 * 武将牌对应的另一半双面武将牌
	 * @type { string|undefined }
	 **/
	dualSideCharacter?: string;
	/**
	 * 多势力武将牌的全部势力
	 * @type { string[] }
	 **/
	doubleGroup?: string[];
	/**
	 * 武将牌是否为minskin
	 * @type { boolean }
	 **/
	isMinskin?: boolean;
	/**
	 * 武将牌是否为挑战模式下的BOSS
	 * @type { boolean }
	 **/
	isBoss?: boolean;
	/**
	 * 武将牌是否为隐藏BOSS
	 * @type { boolean }
	 **/
	isHiddenBoss?: boolean;
	/**
	 * 武将牌是否“仅点将可用”
	 * @type { boolean }
	 **/
	isAiForbidden?: boolean;
	/**
	 * 武将牌在炉石模式/挑战模式下的特殊信息
	 * @type { any[]|undefined }
	 **/
	extraModeData?: any[] | undefined;
	/**
	 * 武将牌是否为炉石模式下的随从
	 * @type { boolean }
	 **/
	isFellowInStoneMode?: boolean;
	/**
	 * 武将牌是否为炉石模式下的隐藏武将
	 * @type { boolean }
	 **/
	isHiddenInStoneMode?: boolean;
	/**
	 * 武将牌是否为炉石模式下的特殊随从（可以使用装备和法术）
	 * @type { boolean }
	 **/
	isSpecialInStoneMode?: boolean;
	/**
	 * 武将牌是否为bossallowed
	 * @type { boolean }
	 **/
	isBossAllowed?: boolean;
	/**
	 * 武将牌是否为战旗模式下的BOSS
	 * @type { boolean }
	 **/
	isChessBoss?: boolean;
	/**
	 * 武将牌是否为剑阁模式下的BOSS
	 * @type { boolean }
	 **/
	isJiangeBoss?: boolean;
	/**
	 * 武将牌是否为剑阁模式下的机械
	 * @type { boolean }
	 **/
	isJiangeMech?: boolean;
	/**
	 * 武将牌是否在国战模式下拥有独立的皮肤
	 * @type { boolean }
	 **/
	hasSkinInGuozhan?: boolean;
	/**
	 * 武将牌对应的全部宗族
	 * @type { string[] }
	 **/
	clans?: string[];
	/**
	 * 武将牌的图片信息
	 * @type {string | undefined}
	 */
	img?: string | undefined;
	/**
	 * 武将牌拥有的全部阵亡语音
	 * @type { string[] }
	 **/
	dieAudios?: string[];
	/**
	 * 武将牌“无法享受到的主公/地主红利”
	 * @type { string[] }
	 **/
	initFilters?: string[];
	/**
	 * 武将牌的“临时名称”
	 * @type { string[] }
	 */
	tempname?: string[];
	/**
	 * 武将牌是否存在(get.character未找到武将使用)
	 * @type { boolean }
	 */
	isNull?: boolean;
}

declare type WhichWayCharacterPackNames = "epicSJZX" | "legendSJZX" | "especialSJZX" | "plotSJZX" | "specialSJZX" | "rareSJZX" | "mediocreSJZX" | "normalSJZX";

/**
 * 驶舰之向角色数据（**声明态**：武将包里写的、`get.character()` 拿到的原始对象）。
 *
 * 除 {@link WhichWayCharacterPrototype} 的必填字段外都可缺省，注册阶段会补默认值，
 * 补全后的形态见 {@link WhichWayCharacterInitialized}。
 */
declare interface WhichWayCharacter extends WhichWayCharacterPrototype {
	/**
	 * 驶舰之向角色设置（声明时每个字段都可自定义，见 {@link WhichWayCharConfig}）
	 */
	whichWay?: WhichWayCharConfig;

	/**
	 * 设计者（可写字符串，注册时会规整成数组；也可写在 `whichWay.designer` 里）
	 */
	designer?: string | Array<string>;

	/**
	 * 所属将包(会自动添加到对应将包)；缺省归入 `specialSJZX`
	 */
	pack?: WhichWayCharacterPackNames;

	/**
	 * 明日方舟角色uid（显式指定可跳过按名字反查）
	 */
	arkuid?: string;
}

/**
 * 注册完成后的驶舰之向角色数据：`whichWay` 与 `pack` 必定存在。
 *
 * 由 `initCharConfig()` 产出，注册流程（`packs/index.ts`）与依赖补全结果的模块使用。
 */
declare interface WhichWayCharacterInitialized extends WhichWayCharacter {
	whichWay: WhichWayCharConfig;
	pack: WhichWayCharacterPackNames;
}

declare interface WhichWayCharacterPack {
	character: Record<string, WhichWayCharacter | WhichWayCharacterArray>;
	skill: Record<string, ExtendedSkill>;
}

declare interface WhichWayObjectificationCharacterPack {
	character: Record<string, WhichWayCharacterInitialized>;
	skill: Record<string, ExtendedSkill>;
}

interface SkillFieldOverrides {
	audio?: number | string | boolean | [string, number] | Array<AudioTitle>;
	locked?: boolean | ((skill: string, player: Player) => boolean);
	filter?: (event: GameEvent, player: Player, name: string, target: Player) => any;
	subSkill?: Record<string, ExtendedSkill>;
	/**
	 * 连招技tag，仅标识，无其他用途
	 */
	comboSkill?:boolean;
}

type AudioTitle = "任命助理" | "交谈1" | "交谈2" | "交谈3" | "晋升后交谈1" | "晋升后交谈2" | "信赖提升后交谈1" | "信赖提升后交谈2" | "信赖提升后交谈3" | "闲置" | "干员报到" | "观看作战记录" | "精英化晋升1" | "精英化晋升2" | "编入队伍" | "任命队长" | "行动出发" | "行动开始" | "选中干员1" | "选中干员2" | "部署1" | "部署2" | "作战中1" | "作战中2" | "作战中3" | "作战中4" | "完成高难行动" | "3星结束行动" | "非3星结束行动" | "行动失败" | "进驻设施" | "戳一下" | "信赖触摸" | "标题" | "新年祝福" | "问候" | "生日" | "周年庆典";

type CustomExtend<T, O extends Partial<Record<keyof T, any>>> = {
	[K in keyof T]: K extends keyof O ? O[K] : T[K];
};

type ExtendedSkill = CustomExtend<Skill, SkillFieldOverrides>;
