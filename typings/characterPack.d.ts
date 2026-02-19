declare type WhichWayCharConfig = {
	/**
	 * 是否为支援器械
	 * @type { boolean }
	 */
	supportingEquipment: boolean;

	/**
	 * 设计者
	 * @type { Array<string> }
	 */
	designer: Array<string>;

	/**
	 * 真正的势力
	 */
	reallyGroup: string;

	/**
	 * 角色id(驶舰之向)
	 */
	charId: string;

	/**
	 * 是不是联动角色
	 */
	linkage: boolean;

	/**
	 * 死亡音频相关
	 */
	dieAudio: {
		that: WhichWayCharConfig;
		get useLocalAudio(): boolean;
		get lang(): string;
		get voiceUrl(): string[];
		voicesTitle: string[];
		play(): HTMLAudioElement;
	};

	/**
	 * 明日方舟数据
	 */
	arknight: {
		/**
		 * 角色id(明日方舟)
		 */
		charId: string;
		/**明日方舟阵营 */
		camp: ArksCamps | string;
		/**明日方舟可用配音语言 */
		avaiableLangs: string[];
		/**角色tag */
		tags: string[];
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

declare interface WhichWayCharacter extends WhichWayCharacterPrototype {
	whichWay: WhichWayCharConfig;
}

declare interface WhichWayCharacterPending extends WhichWayCharacterPrototype {
	/**
	 * 设计者
	 * @type { string|Array<string> }
	 */
	designer?: string | Array<string>;

	whichWay?: WhichWayCharConfig;
}

declare interface WhichWayCharacterPack {
	character: Record<string, WhichWayCharacter | WhichWayCharacterPending | WhichWayCharacterArray>;
	skill: Record<string, ExtendedSkill>;
}

declare interface WhichWayObjectificationCharacterPack {
	character: Record<string, WhichWayCharacter>;
	skill: Record<string, ExtendedSkill>;
}

interface SkillFieldOverrides {
	audio?: number | string | boolean | [string, number] | Array<AudioTitle>;
	locked?: boolean | ((skill: string, player: Player) => boolean);
	filter?:(event: GameEvent, player: Player,name:string,target:Player)=>any;
	subSkill?: Record<string, ExtendedSkill>;
}

type AudioTitle = "任命助理" | "交谈1" | "交谈2" | "交谈3" | "晋升后交谈1" | "晋升后交谈2" | "信赖提升后交谈1" | "信赖提升后交谈2" | "信赖提升后交谈3" | "闲置" | "干员报到" | "观看作战记录" | "精英化晋升1" | "精英化晋升2" | "编入队伍" | "任命队长" | "行动出发" | "行动开始" | "选中干员1" | "选中干员2" | "部署1" | "部署2" | "作战中1" | "作战中2" | "作战中3" | "作战中4" | "完成高难行动" | "3星结束行动" | "非3星结束行动" | "行动失败" | "进驻设施" | "戳一下" | "信赖触摸" | "标题" | "新年祝福" | "问候" | "生日" | "周年庆典";

type CustomExtend<T, O extends Partial<Record<keyof T, any>>> = {
	[K in keyof T]: K extends keyof O ? O[K] : T[K];
};

type ExtendedSkill = CustomExtend<Skill, SkillFieldOverrides>;
