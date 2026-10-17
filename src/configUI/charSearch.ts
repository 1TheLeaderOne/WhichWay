import * as pinyinPro from "pinyin-pro";
import { get } from "noname";

/**
 * 干员搜索的通用工具：把「中文名 / 干员id(拼音串) / 中文名的拼音 / 技能名与技能id」汇成一条待匹配串。
 *
 * ConfigUI 里多个面板都要同一套搜索（配音设置、模组切换、皮肤位置调整……），
 * 匹配规则以前抄在各组件里，改一处就得记着改全部，所以抽到这里：
 * - `createCharSearchIndex` 建索引（按干员列表缓存，返回 `Map<干员id, 小写待匹配串>`）；
 * - `filterCharsByQuery` 按关键词过滤。
 * 展示层（列表、下拉、轮切）各不相同，因此这里只管「搜不搜得到」，不管怎么渲染。
 */

/** 干员名可能带 `<font>` 等标签，搜索与展示都只要纯文本 */
export function charDisplayName(name: string): string {
	return String(get.translation(name) || name).replace(/<[^>]+>/g, "");
}

/**
 * 建索引：`Map<干员id, 已小写的待匹配串>`。
 * 拼音转换对每个干员都要跑一遍，列表大时不便宜，所以调用方把它放在 `computed` 里复用。
 */
export function createCharSearchIndex(names: string[]): Map<string, string> {
	const map = new Map<string, string>();
	for (const name of names) {
		const cn = charDisplayName(name);
		const parts = [cn, name];

		try {
			if (typeof pinyinPro !== "undefined") {
				const py = pinyinPro
					.pinyin(cn, {
						type: "array",
						toneType: "none",
					})
					.join(" ")
					.toLowerCase();
				parts.push(py, py.replace(/\s/g, ""));
			}
		} catch (e) {
			console.warn("[charSearch] 拼音转换失败:", e);
		}

		for (const skill of get.character(name)?.skills || []) {
			parts.push(skill);
			parts.push(String(get.translation(skill) || "").replace(/<[^>]+>/g, ""));
		}

		map.set(name, parts.join(" ").toLowerCase());
	}
	return map;
}

/**
 * 按关键词过滤。空关键词返回原列表。
 * 除了带空格的原文匹配，再去掉空格比一次（`amiya` 要能命中拼音 `a mi ya`）。
 */
export function filterCharsByQuery(names: string[], query: string, index: Map<string, string>): string[] {
	const trimmed = query.trim().toLowerCase();
	if (!trimmed) return names;
	const compact = trimmed.replace(/\s/g, "");
	const list: string[] = [];
	for (const name of names) {
		const hay = index.get(name) || "";
		if (hay.includes(trimmed) || hay.replace(/\s/g, "").includes(compact)) list.push(name);
	}
	return list;
}
