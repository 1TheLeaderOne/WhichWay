import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../../../utill.js";

/**
 * @type {SMap<((player:Player)=>string)>}
 *
 * 说明：绝大多数动态翻译已迁移到 `src/packs/character/*.ts`，
 * 由各武将文件用 `dynamicTranslate()` 就地注册（`packs` 阶段落库）。
 * 因为 `src/packs/base/index.ts` 的 `initTranslate()` 执行的是
 * `lib.dynamicTranslate = dynamicTranslate`（整体覆盖），而 `base` 阶段早于 `packs` 阶段，
 * 所以这里**不要**再保留已迁移的键，否则会被 packs 阶段的注册覆盖（重复键还会被
 * `WhichWayPackHooks` 的防重复校验直接抛错）。
 *
 * 现存条目只剩「技能 id 在当前源码里已找不到」的废弃项，保留以避免影响旧存档。
 */
const dynamicTranslate = {
	xunlumrfz: function (player) {
		return '锁定技，摸牌阶段，你改为随机摸<span class=thundertext>' + player.storage.xunlumrfz_draw + '</span>至6张牌；准备阶段，你将本回合出牌阶段使用【杀】的基数随机改为<span class=firetext>' + player.storage.xunlumrfz_sha + '</span>至5次；你的手牌上限随机改为<span class=greentext>' + player.storage.xunlumrfz_h + '</span>至8张。当你造成伤害时，你可以令一个有颜色的数字+1。（有颜色的数字的最大值至多为4，且本技能中的随机生成的随机数均符合正态分布）'
	},
	yiyinmrfz: function (player) {
		return '①蓄力技（' + player.countMark('charge') + '/3），出牌阶段，你可以弃置一张带有伤害类标签的牌，然后增加一点蓄力值。②当你使用【杀】的时，你可以消耗一点蓄力值并令此【杀】的伤害基数+1。';
	},
	amy_qingyanmrfz: function (player) {
		var str1 = '①锁定技，';
		var str2 = '。②出牌阶段结束时，你可以删除【青焱①】中[]、{}或（）的内容直到本轮结束，然后令一名其他角色获得你删除的内容的效果直到其回合结束。';
		var str = '';
		var list = [player.storage.amy_qingyanmrfz_damage, player.storage.amy_qingyanmrfz_time, player.storage.amy_qingyanmrfz_direct];
		var del = ['<span style="text-decoration:line-through">{你每回合使用的第一张【杀】的伤害基数+1},</span>',
			'<span style="text-decoration:line-through">[你使用【杀】的次数+1],</span>',
			'<span style="text-decoration:line-through">(你使用的【杀】需要两张【闪】才可抵消),</span>'];
		var text = ['{你每回合使用的第一张【杀】的伤害基数+1},', '[你使用【杀】的次数+1],', '(你使用的【杀】需要两张【闪】才可抵消),'];
		for (var i = 0; i < list.length; i++) {
			if (list[i]) str = str + del[i];
			else str = str + text[i];
		}
		return str1 + str + str2;
	},
	tanxianmrfz: function (player) {
		let { draw, sha, attack } = player.storage.tanxianmrfz;
		let str = `锁定技。<br>①你的额定摸牌数为#r${draw}#;出牌阶段【杀】的使用次数+#r${sha}#;你的基础攻击范围为#r${attack}#;<br>②你的回合结束时，你令其中最大的数字-1，然后须重新分配此技能所有红色的数字。`;
		return whichWayUtil.colorize(str);
	},
	yirenmrfz: function (player) {
		return '蓄力技（<span class=thundertext>' + (player.countMark('charge') != undefined ? player.countMark('charge') : 0) + '</span>/∞）。①锁定技，回合结束时，你增加X点蓄力值。（X=本回合出牌阶段剩余使用【杀】的次数）②出牌阶段，你可以消耗[<span class=thundertext> ' + (player.storage.yirenmrfz_use != undefined ? Math.min(player.storage.yirenmrfz_use, 5) : 1) + ' </span>]点蓄力值，弃置两张手牌并选择至多两名其他角色，视为你对其各使用一张【杀】（目标必须合法且不计入次数限制）且其下个回合使用【杀】的次数-1，然后令[ ]中的数字+1（至多为5）。';
	},
}

export default dynamicTranslate;
