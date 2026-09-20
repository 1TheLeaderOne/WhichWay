/**
 * `char.whichWay` 的默认值模板。
 *
 * 武将包声明时可以自定义其中**任意**字段（见 {@link WhichWayCharConfig}）：
 * `initCharConfig` 只做「缺省补全」—— 声明过的值一律保留，包括显式写的 `false`。
 * 各字段的补全规则见 `typings/characterPack.d.ts` 的 WhichWayCharConfig。
 */
export class WhichWayCharConfig {
	/** 是否为支援器械（缺省时按明日方舟 tag「支援机器」推导，见 `initCharArknight`） */
	supportingEquipment?: boolean;

	/** 设计者（字符串会被 `initCharConfig` 规整成数组） */
	designer?: string | Array<string>;

	/** 真正的势力（缺省时取角色的 `group`） */
	reallyGroup?: string;

	/** 角色id(驶舰之向)（缺省时取注册时的角色名） */
	charId?: string;

	/** 是不是联动角色（缺省时按明日方舟可用配音语言里的 `LINKAGE` 推导） */
	linkage?: boolean;

	/** 死亡音频相关（运行期由音频模块挂载，也可自行提供覆盖） */
	dieAudio?: NonNullable<WhichWayCharConfig["dieAudio"]>;

	/** 明日方舟数据（逐字段缺省补全，见 `initCharArknight`） */
	arknight: NonNullable<WhichWayCharConfig["arknight"]> = {};
}

/**
 * 初始化 / 补全 `char.whichWay`。
 *
 * 只做三件事，**不改写声明过的值**（因此每个字段都支持自定义）：
 * 1. `designer` 声明成字符串时规整成数组，缺省给空数组；
 * 2. `arknight` 缺省时建出空对象，便于后续逐字段补全；
 * 3. `pack` 缺省时归入 `specialSJZX`。
 *
 * 其余字段（`charId` / `reallyGroup` / `supportingEquipment` / `linkage` 以及 `arknight.*`）
 * 的默认值由注册流程后续补：`packs/index.ts` 补角色自身的，`initCharArknight` 补明日方舟数据的。
 *
 * @param char 武将包声明的角色数据（可在 `whichWay` 里自定义任意字段）
 * @returns 补全后的角色数据（`whichWay` / `pack` 必定存在）
 */
export const initCharConfig = (char: WhichWayCharacter): WhichWayCharacterInitialized => {
	const whichWay = (char.whichWay ??= {}) as WhichWayCharConfig;
	whichWay.designer = whichWay.designer === void 0 ? [] : Array.isArray(whichWay.designer) ? whichWay.designer : [whichWay.designer];
	whichWay.arknight ??= {};
	char.pack ??= "specialSJZX";
	return char as WhichWayCharacterInitialized;
};
