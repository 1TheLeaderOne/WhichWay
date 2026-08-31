import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../../file.js";
import { packHooks } from "../hooks.js";

/**
 * 卡牌包组装器
 *
 * 扫描 src:packs/card/ 下的所有卡牌目录（每张卡一个目录，index.ts 内部调用
 * card()/cardSkill()/cardTranslate() 钩子注册），然后从 packHooks 收集所有
 * card/cardSkill/cardTranslate 钩子，组装成 mrfzcard 包对象，通过
 * game.import("card") 注册给 noname 引擎。
 *
 * 新增卡牌：在 src/packs/card/ 下新建目录，index.ts 按同样格式调用
 * card()/cardSkill()/cardTranslate() 即可，无需修改本文件。
 * 共享技能（多卡共用的）请放入 shared.ts。
 */
export async function initCardPack(): Promise<void> {
	// 先加载共享技能/翻译
	await import("./shared.js");

	const folders = await whichWayFile.listDirNames("src:packs/card/");
	const importTasks: Promise<void>[] = [];

	for (const folderName of folders) {
		if (!folderName.includes("mrfz")) continue;
		importTasks.push(
			(async () => {
				try {
					await import(`./${folderName}/index.js`);
				} catch (e) {
					try {
						await import(`./${folderName}/index.ts`);
					} catch (e) {
						console.warn(`${folderName} 卡牌加载失败 : ${e}`);
					}
				}
			})()
		);
	}

	// 16 并发限流（与干员加载一致，避免过度并行）
	const limit = 16;
	let cursor = 0;
	const workers = Array.from({ length: Math.min(limit, importTasks.length) }, async () => {
		while (true) {
			const idx = cursor++;
			if (idx >= importTasks.length) return;
			await importTasks[idx];
		}
	});
	await Promise.all(workers);

	// 从 packHooks 收集卡牌钩子（card/cardSkill/cardTranslate 不进 pendingRun，
	// 不会自动落库 lib，由本组装器统一收集后构造 mrfzcard 包给引擎 loadCard 处理）
	const cardHooks = packHooks.getHooks("card");
	const skillHooks = packHooks.getHooks("cardSkill");
	const transHooks = packHooks.getHooks("cardTranslate");

	const card: Record<string, any> = {};
	const skill: Record<string, any> = {};
	const translate: Record<string, any> = {};
	for (const h of cardHooks) card[h.key] = h.obj;
	for (const h of skillHooks) skill[h.key] = h.obj;
	for (const h of transHooks) translate[h.key] = h.obj;

	const mrfzcard = { name: "mrfzcard", connect: true, card, skill, translate, list: [] };
	lib.translate["mrfzcard_card_config"] = "驶舰之向";
	if (!lib.config.cards.includes("mrfzcard")) lib.config.cards.push("mrfzcard");
	await game.import("card", () => mrfzcard);
}
