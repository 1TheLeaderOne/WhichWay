import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("qiaojiakelifumrfz", { pack: "plotSJZX",
			sex: "male",
			group: "gemrfz",
			hp: 4,
			skills: ["chongxiemrfz","qj_chongjimrfz","leitingmrfz"],
		});

skill({
	"chongxiemrfz": {
			marktext: "弹药",
			intro: {
				name: "弹药",
				content: "共有#枚弹药",
			},
			trigger: {
				player: "useCardToPlayered",
			},
			// @ts-ignore
			filter: function (event, player) {
				// @ts-ignore
				if (event.getParent().triggeredTargets3.length > 1) return false;
				if (get.name(event.card) == "sha") return true;
				return false;
			},
			direct: true,
			// @ts-ignore
			async content(event, trigger, player) {
				const { targets } = await player
					// @ts-ignore
					.chooseTarget(get.prompt("chongxiemrfz"), "你可以弃置其中一名角色的手牌", function (card, player, target) {
						return (_status.event.targets.includes(target) || target == player) && target.countDiscardableCards(player, "h");
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						if (
							player.countCards("h", card => {
								return get.value(card) < 6;
							}) &&
							player == target
						)
							return 114514;
						return 2 - get.attitude(_status.event.player, target);
					})
					.set("targets", trigger.targets)
					.forResult();
				if (!targets) return;
				var target = targets[0];
				// @ts-ignore
				player.logSkill("chongxiemrfz", target);
				const { links } = await player
					.discardPlayerCard("h", target, true)
					.set("target", target)
					.set("complexSelect", false)
					.set("ai", lib.card.guohe.ai.button)
					.forResult();
				if (!links) return;
				if (player == target) player.draw();
				if (get.color(links[0]) == "black") {
					// @ts-ignore
					if (trigger.addCount !== false) {
						// @ts-ignore
						trigger.addCount = false;
						trigger.player.getStat().card.sha--;
					}
				} else if (get.color(links[0]) == "red") {
					player.addMark("chongxiemrfz", 1, false);
				} else return;
			},
		},
	"qj_chongjimrfz": {
			enable: "chooseToUse",
			filter: function (event, player) {
				if (player.countMark("chongxiemrfz") < 1 || !player.isPhaseUsing()) return false;
				return event.filterCard({ name: "sha" }, player, event);
			},
			// @ts-ignore
			async content(event, trigger, player) {
				await player.chooseUseTarget({ name: "sha", nature: "thunder", isCard: true }, true, "nodistance");
				player.removeMark("chongxiemrfz", 1, false);
			},
			ai: {
				order: 2.95,
				respondSha: true,
				// @ts-ignore
				skillTagFilter: function (player, tag, arg) {
					if (player.countMark("chongxiemrfz") < 1 || !player.isPhaseUsing()) return false;
				},
			},
		},
	"leitingmrfz": {
			init: function (player) {
				player.storage.leitingmrfz = false;
			},
			limited: true,
			skillAnimation: true,
			animationColor: "gray",
			trigger: {
				player: "phaseUseBegin",
			},
			// @ts-ignore
			filter: function (event, player) {
				return player.countMark("chongxiemrfz") > 5 && !player.storage.leitingmrfz;
			},
			// @ts-ignore
			check: function (event, player) {
				if (player.hasUnknown()) return false;
				return true;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				player.removeMark("chongxiemrfz", 6, false);
				const { targets } = await player
					.chooseTarget(true, "【雷霆】:请选择一个其他角色，对其使用6张雷【杀】")
					// @ts-ignore
					.set("filterTarget", (card, player, target) => {
						return player.canUse({ name: "sha", nature: "thunder", isCard: true }, target, false) && player != target;
					})
					.set("ai", target => {
						return get.attitude(_status.event.player, target) < 0;
					})
					.forResult();
				if (!targets) return;
				let num = 6;
				while (num > 0) {
					if (!targets[0].isIn()) break;
					if (player.canUse({ name: "sha", nature: "thunder", isCard: true }, targets[0], false)) {
						await player.useCard({ name: "sha", nature: "thunder", isCard: true }, targets[0]);
					}
					num--;
				}
				player.storage.leitingmrfz = true;
				// @ts-ignore
				_status.SJZX_tmpleitingmrfz = targets[0];
				player
					.when({
						player: "phaseEnd",
						global: "dieAfter",
					})
					// @ts-ignore
					.filter((event, player) => {
						// @ts-ignore
						var target = _status.SJZX_tmpleitingmrfz;
						if (event.name == "phase") return true;
						else return event.player == target;
					})
					.then(() => {
						// @ts-ignore
						var target = _status.SJZX_tmpleitingmrfz;
						if (trigger.name == "die") {
							player.storage.leitingmrfz = false;
							// @ts-ignore
							player.logSkill("leitingmrfz", target);
						}
						// @ts-ignore
						delete _status.SJZX_tmpleitingmrfz;
					});
			},
		},
});

translate({
	"qiaojiakelifumrfz": "桥夹克里夫",
	"chongxiemrfz": "统械",
	"chongxiemrfz_info": "当你使用杀指定目标后，你可以弃置你或其中一名目标角色一张手牌，如果弃置的是你的牌，你摸一张牌。若弃置的牌为：黑色，此杀不计入次数限制；红色，你获得一个“弹药”",
	"qj_chongjimrfz": "铳击",
	"qj_chongjimrfz_info": "出牌阶段，你可以消耗一枚“弹药”，视为使用一张雷【杀】（无距离限制）",
	"leitingmrfz": "雷霆",
	"leitingmrfz_info": "限定技，出牌阶段开始时，你可以消耗6枚“弹药”，选择一名角色，视为对其使用6张雷杀，若其本回合死亡，你重置此技能。",
});

characterIntro("qiaojiakelifumrfz", "设计：落尘星河<br>‘桥夹’克里夫，原名鲁伯特，黑钢国际的创始人，猎人伍德洛·比安奇的旧友。曾领导若干人离开拉特兰远赴哥伦比亚参加独立战争。期间在某次次营救计划中派遣伍德洛的队伍作诱兵，但因为各种原因无法按原计划行动导致伍德洛被俘。派遣B.P.R.S.前往达维镇前委托杰西卡将克里夫与伍德洛某位战友遗物的一枚子弹交予伍德洛。巴伦基地接驳达维镇，克里夫与伍德洛前后会面两次，在二人的第二次对峙中认输，但被伍德洛以“应背之罪”的理由和解，在安排好伍德洛的后续事项后与银行行长达成交易，填补资金空缺的同时收获了平台。");
