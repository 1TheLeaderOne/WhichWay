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
		 * 缺省时按角色id反查（干员id 已与明日方舟 uid 统一，同 id 者即自身）
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


type LLM_Names = "Qwen-3.8-Flash" | "DeepSeek-4.1-Flash"

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
	 * 技能代码是否由AI生成,当此项不存在时默认为不是由AI生成的
	 * 填AI的名称,会在驶舰之向武将卡界面展示
	 */
	llm?:LLM_Names;
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

/**
 * 技能字段**覆盖表**：只允许写 {@link Skill} 里**已经声明**的字段，用来放宽 / 收窄其类型。
 *
 * ⚠️ 这里的键必须已经存在于 `Skill` 中。`CustomExtend` 只遍历 `keyof Skill`，
 * 写一个 `Skill` 没有的键**既不会报错也不会生效** —— 它会落到 `Skill` 的
 * `[key: string]: any` 索引签名上，最终类型退化成 `any`（`markimage` 以前就是这样失效的）。
 * 要新增 `Skill` 没有的字段，请写到 {@link SkillSupplement}。
 */
interface SkillFieldOverrides {
	/**
	 * 技能配音配置。除了引擎原生的几种形态，本扩展额外支持**对象形态**：
	 *
	 * ```ts
	 * audio: {
	 *   default: ["部署2"],                        // 基础（非残余）的「部署2」
	 *   "char_003_kalts@boc#6": ["部署1", "部署2"], // 残余皮肤的「部署1」「部署2」
	 * }
	 * ```
	 *
	 * 对象形态的含义：**key = 皮肤 id 或 `"default"`，value = 该皮肤下要用到的语音条目数组**。
	 *
	 * 为什么是「皮肤 → 条目数组」而不是「条目 → 皮肤」：同一个标题在**不同皮肤下是两条不同的音频**，
	 * 反过来的写法没法同时表达「残余的部署1」和「非残余的部署1」——后者会把前者覆盖掉。
	 *
	 * - key 写明日方舟的 **skinId**（如 `char_003_kalts@boc#6`，不是显示名）；
	 * - key 写 `"default"` 表示这一组用干员自己的（基础）语音；
	 * - value 是配音标题数组（也可写单个字符串）；组内顺序就是播放顺序。
	 *
	 * **数组是语法糖**：`audio: ["作战中1", "作战中2"]` 等价于
	 * `audio: { default: ["作战中1", "作战中2"] }`，内部会先归一化再处理，
	 * 因此运行期只有「对象形态」这一条路径。
	 *
	 * 引擎本身不支持对象形态 —— 初始化时（`applySkillAudio`）会把它展开成
	 * 「标题序列 + 语音库序列」并存进旁路表，`lib.skill[x].audio` 仍落成
	 * `ext:WhichWay/audio/{语言}:{N}` 字符串。因此**运行期看到的永远是字符串**，
	 * 不需要（也不应该）在别处判断对象形态。
	 */
	audio?:
		| number
		| string
		| boolean
		| [string, number]
		| Array<AudioTitle>
		| Partial<Record<AudioSkinId, AudioTitle | AudioTitle[]>>;
	locked?: boolean | ((skill: string, player: Player) => boolean);
	filter?: (event: GameEvent, player: Player, name: string, target: Player) => any;
	subSkill?: Record<string, ExtendedSkill>;
}

/**
 * 技能字段**补充表**：收录引擎会读取、但 {@link Skill} 没有声明的字段。
 *
 * 与 {@link SkillFieldOverrides} 的分工（两者最终都会合并进 {@link ExtendedSkill}，
 * 使用时没有任何区别，分开写只是为了「一眼看出哪个是覆盖、哪个是新增」）：
 * - `SkillFieldOverrides`：`Skill` 里**已有**的字段 ⇒ 只改类型；
 * - `SkillSupplement`：`Skill` 里**没有**的字段 ⇒ 纯新增。
 *
 * 下面每个字段都注明引擎的读取位置。若无名杀本体日后给 `Skill` 补上了其中某个字段，
 * 底部的编译期自检会报错，届时把该字段从本表删掉即可（`Skill` 会直接提供它）。
 */
interface SkillSupplement {
	/**
	 * 标记显示图片（与 `marktext` 同理，只不过显示的是图片而不是文字）
	 *
	 * 读取处：`Player#markSkill`（`library/element/player.js`）
	 */
	markimage?: string;
	/**
	 * 次级标记显示图片，绘制在 `.background.skillmark` 节点上（`markimage` 为空时才生效）
	 *
	 * 读取处：`Player#markSkill`（`library/element/player.js`）
	 */
	markimage2?: string;
	/**
	 * 连招技：仅作技能分类标签，无其他用途
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	comboSkill?: boolean;
	/**
	 * 隐匿技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	hiddenSkill?: boolean;
	/**
	 * 宗族技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	clanSkill?: boolean;
	/**
	 * 使命技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	dutySkill?: boolean;
	/**
	 * 阵法技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	zhenfa?: boolean;
	/**
	 * 主将技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	mainSkill?: boolean;
	/**
	 * 副将技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	viceSkill?: boolean;
	/**
	 * 君主技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	lordSkill?: boolean;
	/**
	 * 蓄能技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	chargingSkill?: boolean;
	/**
	 * 昂扬技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	sunbenSkill?: boolean;
	/**
	 * 威主技（技能分类标签）
	 *
	 * 读取处：`get.skillCategoriesOf`（`get/index.js`）
	 */
	feedPigSkill?: boolean;
	/**
	 * 蓄力技：既作技能分类标签，又作蓄力值上限
	 *
	 * - 作标签：`get.skillCategoriesOf`（`get/index.js`），此时取值 `true` 即可；
	 * - 作上限：`Player#getMaxCharge`（`library/element/player.js`）会累加**数值型**取值，
	 *   `Infinity` 表示无上限。注意 `typeof true != "number"`，写 `true` 不会增加上限。
	 */
	chargeSkill?: boolean | number;
}

type AudioTitle = "任命助理" | "交谈1" | "交谈2" | "交谈3" | "晋升后交谈1" | "晋升后交谈2" | "信赖提升后交谈1" | "信赖提升后交谈2" | "信赖提升后交谈3" | "闲置" | "干员报到" | "观看作战记录" | "精英化晋升1" | "精英化晋升2" | "编入队伍" | "任命队长" | "行动出发" | "行动开始" | "选中干员1" | "选中干员2" | "部署1" | "部署2" | "作战中1" | "作战中2" | "作战中3" | "作战中4" | "完成高难行动" | "3星结束行动" | "非3星结束行动" | "行动失败" | "进驻设施" | "戳一下" | "信赖触摸" | "标题" | "新年祝福" | "问候" | "生日" | "周年庆典";

/**
 * `audio` 对象形态里 **key** 的取值：**皮肤 id** 或 `"default"`。
 *
 * - `"default"`：这一组用干员自己的（基础）语音；
 * - 其余字符串：明日方舟 **skinId**，形如 `char_003_kalts@boc#6`（`@` 前是干员 id，
 *   `@` 后是皮肤组与序号）。⚠️ 不是皮肤显示名（「残余」），也不是语音库名
 *   （`char_003_kalts_boc#6`）——扩展会自动查 `skin_table` 做转换。
 *
 * 用 `(string & {})` 而不是纯 `string`：既保留字面量补全（IDE 里能看到 `"default"`），
 * 又允许写任意皮肤 id（皮肤 id 太多、且会随版本新增，不适合枚举）。
 */
type AudioSkinId = "default" | (string & {});

type CustomExtend<T, O extends Partial<Record<keyof T, any>>> = {
	[K in keyof T]: K extends keyof O ? O[K] : T[K];
};

/**
 * 驶舰之向技能类型 = `Skill` 本体 + 字段覆盖 + 字段补充。
 *
 * ⚠️ 这里必须用 `interface extends` 而不是交叉类型 `A & B`：
 * 交叉类型会让**嵌套对象字面量里方法**的 `this` 从字面量本身退化成 `{}`，
 * 导致 `this.cardManager` / `this.loseSlot()` 这类写法报「Property 'x' does not exist on type '{}'」
 * （`char_4016_kazema.ts` 的 `cardManager` 就会踩到）。`interface extends` 没有这个副作用。
 *
 * 另外，补充字段**不能**塞进 `CustomExtend` 的第二个参数：`CustomExtend` 只遍历 `keyof Skill`，
 * 那些键不在其中，会被静默丢掉并退化成 `any`（这正是 `markimage` 以前失效的原因）。
 */
interface ExtendedSkill extends CustomExtend<Skill, SkillFieldOverrides>, SkillSupplement {}

// ===== 编译期自检：确保「覆盖」与「新增」两张表不会互相放错位置 =====

/** 是否为 `any`（`Skill` 有 `[key: string]: any` 索引签名，非具名成员会被解析成 `any`） */
type IsAny<T> = 0 extends 1 & T ? true : false;

/** 取出 `Skill` 中键 `K` 的类型；不是具名成员时退化为索引签名的 `any` */
type SkillMemberType<K extends PropertyKey> = K extends keyof Skill ? Skill[K] : never;

/** `K` 是 `Skill` 的具名成员时为 `true`（`Skill` 现有 146 个具名成员，没有一个是 `any`） */
type IsSkillMember<K extends PropertyKey> = IsAny<SkillMemberType<K>> extends true ? false : true;

/** 挑出「`Skill` 里不存在、却被写进覆盖表」的键（应为 `never`） */
type BadOverrideKeys<O> = {
	[K in keyof O]-?: IsSkillMember<K> extends true ? never : K;
}[keyof O];

/** 挑出「`Skill` 里已存在、却被写进补充表」的键（应为 `never`，说明该从补充表删掉） */
type BadSupplementKeys<S> = {
	[K in keyof S]-?: IsSkillMember<K> extends true ? K : never;
}[keyof S];

type AssertNever<T extends never> = T;

/**
 * 若这两行报错，按报错里出现的键名处理：
 * - `_AssertSkillFieldOverrides` 报错 ⇒ 该键 `Skill` 里没有，请从 `SkillFieldOverrides` 移到 `SkillSupplement`；
 * - `_AssertSkillSupplement` 报错 ⇒ 该键 `Skill` 里已声明，请从 `SkillSupplement` 删掉（`Skill` 已提供）。
 */
type _AssertSkillFieldOverrides = AssertNever<BadOverrideKeys<SkillFieldOverrides>>;
type _AssertSkillSupplement = AssertNever<BadSupplementKeys<SkillSupplement>>;
