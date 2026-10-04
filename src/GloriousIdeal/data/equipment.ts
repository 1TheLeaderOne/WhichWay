/**
 * equipment.ts —— 干员装备注册表（策划案「砍诺特（商人）：提供装备售卖」「装备各占一格」）
 *
 * 设计口径（用户 2026-09-22 确认）：
 *  - 装备栏是**战役层干员个人槽**（OperatorState.maxEquipSlots，初始 1，2 级 +1），
 *    与无名杀原生装备区（武器/防具/±1马）**无关**；装备存放于**全局仓库（无上限）**，不占局内背包格。
 *  - 每件装备自带效果；效果用**可序列化字段**描述（存进战役存档无副作用），
 *    战斗内的施加（护甲/手牌/杀次数…）在 Phase C 通过 dungeon.ts 开局钩子落地。
 *  - 提供注册表：registerEquipment()/getEquipment()/allEquipment()，商店库存与装备 UI 都查这里。
 */

export type EquipRarity = "common" | "rare" | "epic" | "legendary";

/** 装备属性加成（可序列化；Phase C 负责在战斗开局施加） */
export interface EquipStat {
	/** 体力上限 + */
	maxHp?: number;
	/** 开局护甲 + */
	hujia?: number;
	/** 手牌上限 + */
	maxHandcard?: number;
	/** 开局额外摸牌 + */
	drawStart?: number;
	/** 出牌阶段【杀】次数 + */
	attackExtra?: number;
	/** 受到伤害时压力减免比例（0~1），Phase C 结算用 */
	stressReduce?: number;
}

export interface EquipmentDef {
	id: string;
	name: string;
	rarity: EquipRarity;
	/** 基础售价（局外源石碇，商人折扣前） */
	price: number;
	stat: EquipStat;
	desc: string;
	/** 指定图片名（image/model/GloriousIdeal/equips/ 下、不含扩展名）；缺省用同 id 图片，找不到回退默认图 */
	img?: string;
	/**
	 * 战斗内自定义效果（补充 stat 之外的复杂行为）。在所有角色初始化完成后、每场战斗对**持有者**各调用一次。
	 * 与 stat 并存：stat 由 dungeon.ts 自动施加（护甲/手牌/摸牌/杀次数/体力上限），effect 负责额外逻辑。
	 * @param event 当前 _status.event
	 * @param player 装备持有者（无名杀 Player）
	 */
	effect?: (event: any, player: GameStatusPlayer) => void;
}

/** 稀有度展示名 / 顺序（数值大=稀有）。四档口径（用户 2026-10-02）：普通/罕见/史诗/传奇 */
export const RARITY_LABEL: Record<EquipRarity, string> = { common: "普通", rare: "罕见", epic: "史诗", legendary: "传奇" };
export const RARITY_ORDER: Record<EquipRarity, number> = { common: 0, rare: 1, epic: 2, legendary: 3 };

// ---------------- 注册表 ----------------

const REGISTRY = new Map<string, EquipmentDef>();

/** 注册（或覆盖）一件装备定义，返回该定义以便链式使用 */
export function registerEquipment(def: EquipmentDef): EquipmentDef {
	REGISTRY.set(def.id, def);
	return def;
}

export const getEquipment = (id: string): EquipmentDef | undefined => REGISTRY.get(id);
export const allEquipment = (): EquipmentDef[] => [...REGISTRY.values()];
/** 某一品质档的全部装备（掉落抽品级后用；空档会让该权重落空，调用方需兜底降级） */
export const equipsOfRarity = (rarity: EquipRarity): EquipmentDef[] => allEquipment().filter(e => e.rarity === rarity);

// ---------------- 初始装备表（占位数值，待平衡） ----------------

const EQUIPMENTS: EquipmentDef[] = [
	{ id: "eq_first_aid", name: "急救包", rarity: "common", price: 20, stat: { maxHp: 1 }, desc: "体力上限 +1" },
	{ id: "eq_plate", name: "防弹插板", rarity: "common", price: 24, stat: { hujia: 1 }, desc: "开局获得 1 点护甲" },
	{ id: "eq_ration_pouch", name: "口粮囊", rarity: "common", price: 18, stat: { drawStart: 1 }, desc: "游戏开始时额外摸 1 张牌" },
	{ id: "eq_scope", name: "战术瞄具", rarity: "common", price: 22, stat: { attackExtra: 1 }, desc: "出牌阶段【杀】次数 +1" },
	{ id: "eq_grimoire", name: "源石法典", rarity: "common", price: 20, stat: { maxHandcard: 1 }, desc: "手牌上限 +1" },
	{ id: "eq_charm", name: "静心护符", rarity: "common", price: 26, stat: { stressReduce: 0.1 }, desc: "受到伤害时压力减免 10%" },
	{ id: "eq_vest", name: "复合战术背心", rarity: "rare", price: 46, stat: { maxHp: 1, hujia: 1 }, desc: "体力上限 +1，开局护甲 +1" },
	{ id: "eq_dual", name: "双持武器组", rarity: "rare", price: 52, stat: { attackExtra: 1, drawStart: 1 }, desc: "【杀】次数 +1，开局额外摸 1 张" },
	{ id: "eq_focus", name: "稳定药剂环", rarity: "rare", price: 50, stat: { maxHandcard: 1, stressReduce: 0.1 }, desc: "手牌上限 +1，压力减免 10%" },
	{ id: "eq_ward", name: "守护符文", rarity: "rare", price: 54, stat: { hujia: 2 }, desc: "开局获得 2 点护甲" },
	{ id: "eq_banner", name: "军旗", rarity: "rare", price: 48, stat: { drawStart: 2 }, desc: "游戏开始时额外摸 2 张牌" },
	{ id: "eq_ace", name: "王牌瞄准镜", rarity: "epic", price: 90, stat: { attackExtra: 2 }, desc: "出牌阶段【杀】次数 +2" },
	{ id: "eq_aegis", name: "埃癸斯装甲", rarity: "epic", price: 100, stat: { maxHp: 2, hujia: 2 }, desc: "体力上限 +2，开局护甲 +2" },
	{ id: "eq_crown", name: "王冠残片", rarity: "epic", price: 110, stat: { maxHandcard: 2, stressReduce: 0.2 }, desc: "手牌上限 +2，压力减免 20%" },
	// 传奇（Phase D 新增第四档；仅供主力难度 10% 传奇权重抽取，数值待平衡）
	{ id: "eq_calamity", name: "天灾核心", rarity: "legendary", price: 180, stat: { attackExtra: 2, drawStart: 2 }, desc: "【杀】次数 +2，开局额外摸 2 张" },
	{ id: "eq_monument", name: "卡兹戴尔纪念碑", rarity: "legendary", price: 200, stat: { maxHp: 2, hujia: 3, stressReduce: 0.2 }, desc: "体力上限 +2，开局护甲 +3，压力减免 20%" },
	{ id: "eq_starsteel", name: "星钢法典", rarity: "legendary", price: 190, stat: { maxHandcard: 3, drawStart: 1 }, desc: "手牌上限 +3，开局额外摸 1 张" },
];

for (const def of EQUIPMENTS) registerEquipment(def);
