import { lib, get } from "noname";

/** 轮播素材目录：所有「内置模式」的主视觉、以及任何模式的兜底图都取自这里 */
const CAROUSEL_ART = "ext:WhichWay/image/splash/carousel/";
/** 目录内 carousel_1..N.png 的数量（新增素材时同步改这里） */
const CAROUSEL_COUNT = 18;

export interface LaunchPadItem {
	mode: string;
	serial: string;
	title: string;
	desc: string;
	art: string;
	thumb: string;
}

const MODE_DESC: Record<string, string> = {
	identity: "身份局：主公与忠臣讨伐内奸与反贼的经典对局",
	guozhan: "国战：群雄逐鹿，问鼎中原",
	boss: "身份 3v3：三人小队携手挑战高难 BOSS",
	brawl: "乱斗模式：规则与武将池大幅改动的娱乐对局",
	versus: "1v1 对决：单挑见真章",
	doudizhu: "斗地主：农民与地主的三方博弈",
	tafang: "塔防模式：以将筑塔，抵御进犯",
	stone: "炉石模式：趣味性对抗玩法",
	chess: "战旗模式：战场如棋局",
	connect: "联机对战：与好友线上切磋",
	single: "单人挑战：自己与 AI 的对局",
	guandu: "官渡之战：历史战役还原",
};

/**
 * 人工指定的模式主视觉：值为 carousel_N.png 的 N（1 起）。
 * 想给某个模式固定某张图时在这里加一行即可，例如 `identity: 5`；
 * 未指定的模式按 lib.config.all.mode 的顺序依次分配（同一顺序下每页一张，互不重复）。
 */
const MODE_ART_MAP: Record<string, number> = {};

/** 把一个封面地址解析成可直接使用的绝对 URL；失败返回空串（调用方兜底） */
function resolveBg(raw: string | undefined): string {
	if (!raw) return "";
	try {
		const url = lib.init.parseResourceAddress(raw) as URL;
		return url?.href || "";
	} catch {
		return "";
	}
}

/** 取第 n 张轮播素材（n 从 0 起，内部换算成 carousel_1..N） */
function carouselArt(n: number): string {
	const idx = (((n % CAROUSEL_COUNT) + CAROUSEL_COUNT) % CAROUSEL_COUNT) + 1;
	return resolveBg(`${CAROUSEL_ART}carousel_${idx}.png`);
}

function isStockMode(mode: string): boolean {
	return Array.isArray(lib.config.all.stockmode) && (lib.config.all.stockmode as string[]).includes(mode);
}

/**
 * 取模式的「封面图」：
 *   - 内置模式（lib.config.all.stockmode）：统一使用 WhichWay/image/splash/carousel 的素材；
 *   - 扩展注册的模式：优先用模式自带的 splash（OnloadSplash 同口径：lib.mode[mode].splash），
 *     没有自带封面时同样回退到 carousel 素材。
 */
function modeCover(mode: string, order: number): string {
	const fixed = MODE_ART_MAP[mode];
	if (typeof fixed === "number") return carouselArt(fixed - 1);
	if (isStockMode(mode)) return carouselArt(order);
	const own = resolveBg((lib.mode as any)[mode]?.splash);
	return own || carouselArt(order);
}

/**
 * 构建全部轮播分页。
 * 模式集合口径与引擎 splash 页一致：lib.config.all.mode（含扩展注册的模式）。
 */
export function buildLaunchPadItems(): LaunchPadItem[] {
	const modes = Array.isArray(lib.config.all.mode) ? (lib.config.all.mode as string[]) : [];
	return modes
		.map((mode, i) => {
			let title = "";
			try {
				title = get.translation(mode) || mode;
			} catch {
				title = mode;
			}
			const stock = isStockMode(mode);
			const cover = modeCover(mode, i);
			return {
				mode,
				serial: String(i + 1).padStart(2, "0"),
				title,
				desc: MODE_DESC[mode] || (stock ? "选择此模式开始游戏" : "WhichWay 提供的自定义玩法"),
				art: cover,
				thumb: cover,
			};
		})
		.filter(item => item.art || item.thumb);
}
