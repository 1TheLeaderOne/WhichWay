/**
 * 明日方舟角色数据类型声明文件
 */
declare interface ArknightCharacter {
	name: string;
	description: string;
	sortIndex: number;
	spTargetType: string;
	spTargetId: null;
	canUseGeneralPotentialItem: boolean;
	canUseActivityPotentialItem: boolean;
	potentialItemId: string;
	activityPotentialItemId: null;
	classicPotentialItemId: null;
	nationId: string;
	groupId: null;
	teamId: null;
	mainPower: {
		nationId: string;
		groupId: null;
		teamId: null;
	};
	subPower: null;
	displayNumber: string;
	appellation: string;
	position: "MELEE" | "RANGED";
	tagList: string[];
	itemUsage: string;
	itemDesc: string;
	itemObtainApproach: string;
	isNotObtainable: boolean;
	isSpChar: boolean;
	maxPotentialLevel: number;
	rarity: "TIER_1" | "TIER_2" | "TIER_3" | "TIER_4" | "TIER_5" | "TIER_6";
	profession: "WARRIOR" | "SNIPER" | "CASTER" | "MEDIC" | "SUPPORT" | "TANK" | "SPECIAL" | "PIONEER";
	subProfessionId: string;
	trait: {
		candidates: Array<{
			unlockCondition: {
				phase: "PHASE_0" | "PHASE_1" | "PHASE_2";
				level: number;
			};
			requiredPotentialRank: number;
			blackboard: Array<{
				key: string;
				value: number;
				valueStr: null;
			}>;
			overrideDescripton: string;
			prefabKey: null;
			rangeId: null;
		}>;
	};
	phase: any;
	potentialRanks: Array<{
		type: "BUFF" | "CUSTOM";
		description: string;
		buff: {
			attributes: {
				abnormalFlags: null;
				abnormalImmunes: null;
				abnormalAntis: null;
				abnormalCombos: null;
				abnormalComboImmunes: null;
				attributeModifiers: Array<{
					attributeType: string;
					formulaItem: "ADDITION";
					value: number;
					loadFromBlackboard: boolean;
					fetchBaseValueFromSourceEntity: boolean;
				}>;
			};
		} | null;
		equivalentCost: null;
	}>;
	favorKeyFrames: Array<any>;
	allSkillLvlup: Array<{
		unlockCond: {
			phase: "PHASE_0" | "PHASE_1" | "PHASE_2";
			level: number;
		};
		lvlUpCost: Array<{
			id: string;
			count: number;
			type: "MATERIAL";
		}>;
	}>;
}

/**
 * ArknightCamps 类型声明文件
 * 描述《明日方舟》中所有可归属的势力/阵营（如罗德岛、龙门、企鹅物流等）
 */
interface ArknightTeam {
	/**
	 * 阵营唯一标识符（如 "rhodes", "lungmen"）
	 */
	powerId: string;

	/**
	 * 排序序号，用于 UI 中按顺序展示（数值越小越靠前）
	 */
	orderNum: number;

	/**
	 * 阵营层级（0 = 国家/地区级, 1 = 组织/公司级, 2 = 小队/团体级）
	 */
	powerLevel: 0 | 1 | 2;

	/**
	 * 阵营中文显示名称（如 "罗德岛", "龙门近卫局"）
	 */
	powerName: string;

	/**
	 * 阵营英文/代码名称（常用于内部标识或国际化，如 "Rhodes Island", "L.G.D."）
	 */
	powerCode: string;

	/**
	 * 阵营代表颜色（十六进制 RGB，不含 # 前缀；当前均为 "000000" 占位）
	 */
	color: string;

	/**
	 * 是否为限时/活动专属阵营（true 表示仅在特定活动期间出现）
	 */
	isLimited: boolean;

	/**
	 * 是否为联动/外部 IP 阵营（true 表示来自非鹰角原创内容，如彩虹小队、Ave Mujica）
	 */
	isRaw: boolean;
}

declare interface ArknightTeams {
	[powerId: string]: ArknightTeam;
}

/**
 * 明日方舟阵营列表
 */
declare type ArksCamps = "iberia" | "rhodes" | "leithanien" | "karlan" | "siracusa" | "babel" | "abyssal" | "penguin" | "kazimierz" | "columbia" | "lgd" | "victoria" | "laterano" | "ursus" | "sargon" | "rainbow" | "sui" | "lee" | "siesta" | "pinus" | "higashi" | "yan" | "rhine" | "followers" | "minos" | "rim" | "abyssal" | "tara" | "egir" | "sami" | "bolivar" | "elite";

/**
 * 明日方舟台词文本类声明文件
 */
type ArkLangsGroup = "CN_MANDARIN" | "JP" | "EN" | "KR" | "CUSTOM";

type ArkLangs = "CN_MANDARIN" | "CN_TOPOLECT" | "JP" | "EN" | "KR" | "ITA" | "GER" | "RUS" | "FRE" | "SPA";

declare type ArkAllLangs = "CN_MANDARIN" | "CN_TOPOLECT" | "JP" | "EN" | "KR" | "ITA" | "GER" | "RUS" | "FRE" | "SPA" | "LINKAGE";

type CharExtraWords = {
	charId: string;
	wordKey: string;
	voiceId: string;
	voiceText: string;
};

type CharWords = {
	charWordId: string;
	wordKey: string;
	charId: string;
	voiceId: string;
	voiceText: string;
	voiceTitle: string;
	voiceIndex: number;
	voiceType: "ONLY_TEXT" | string;
	unlockType: "DIRECT" | string;
	unlockParam: any[];
	lockDescription: string;
	placeType: "HOME_PLACE" | string;
	voiceAsset: string;
};

/**
 * 时间区间定义
 */
interface TimeInterval {
	/**
	 * 起始时间戳（秒级 Unix timestamp）
	 */
	startTs: number;

	/**
	 * 结束时间戳（秒级 Unix timestamp）；
	 * 若为 -1，表示长期有效或无明确结束时间（如生日语音通常永久可用）
	 */
	endTs: number;
}

/**
 * 单条时间规则
 */
interface ShowTimeRule {
	/**
	 * 时间类型：
	 * - "FESTIVAL"：节日活动（如新年、周年庆）
	 * - "BIRTHDAY"：干员生日
	 */
	timeType: "FESTIVAL" | "BIRTHDAY";

	/**
	 * 对应的时间区间
	 */
	interval: TimeInterval;
}

/**
 * 单个展示类型（如 ANNIVERSARY、NEW_YEAR）的完整配置
 */
interface ShowTimeEntry {
	/**
	 * 展示类型标识符，与键名一致（如 "ANNIVERSARY"）
	 */
	showType: "ANNIVERSARY" | "NEW_YEAR" | "BIRTHDAY" | string;

	/**
	 * 时间规则列表（通常只包含一项，但保留数组结构以支持扩展）
	 */
	timeData: ShowTimeRule[];
}

interface CharVoiceLangDict {
	charId: string;
	wordKeys: string[];
	dict: Record<
		ArkLangs,
		{
			cvName: string[];
			voiceLangType: ArkLangs;
			voicePath: string | null;
			wordkey: string;
		}
	>;
}

declare interface ArknightVoice {
	/**
	 * 角色的默认语言
	 */
	charDefaultTypeDict: Record<string, ArkLangs>;

	charExtraWords: Record<string, CharExtraWords>;

	charWords: Record<string, CharWords>;

	defaultLangType: ArkLangs;

	extraVoiceConfigData: Record<
		string,
		{
			validVoiceLangs: Array<ArkLangs | "LINKAGE">;
			voiceId: string;
		}
	>;

	fesVoiceWeight: Record<
		string,
		{
			showType: string;
			weight: number;
			priority: number;
		}
	>;

	fesVoiceData: Record<string, ShowTimeEntry>;

	newTagList: string[];

	playVoiceRange: string;

	startTimeWithTypeDict: Record<
		ArkLangs,
		Array<{
			timestamp: number;
			charSet: Array<string>;
		}>
	>;

	voiceLangDict: Record<string, CharVoiceLangDict>;

	voiceLangGroupTypeDict: Record<
		ArkLangsGroup,
		{
			name: string;
			members: Array<ArkAllLangs>;
		}
	>;

	voiceLangTypeDict: Record<
		ArkAllLangs,
		{
			name: string;
			groupType: ArkLangsGroup | "LINKAGE";
		}
	>;
}

declare interface ArknightCharacterPatch {
	infos: Record<
		string,
		{
			default: string;
			tmplIds: string[];
		}
	>;
	patchChars: Record<string, ArknightCharacter>;
	patchDetailInfoList: Record<
		string,
		Record<
			string,
			{
				infoParam: string;
				patchId: string;
				sortId: number;
				transSortId: number;
			}
		>
	>;
	unlockConds: Record<
		string,
		Record<
			string,
			{
				conds: Array<{
					completeState: string;
					stageId: string;
					unlockTs: number;
				}>;
			}
		>
	>;
}
