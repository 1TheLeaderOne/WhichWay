import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("yintuoluomrfz", { pack: "epicSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 4,
			skills: ["suijiamrfz","huquanmrfz"],
		});

skill({
	"suijiamrfz": {
			init: function (player) {
				player.storage.suijiamrfz = {
					del: false,
					damage: 0,
				};
			},
			onremove: true,
			audio: 2,
			trigger: { source: "damageBegin" },
			filter: function (event, player) {
				var isdel = player.storage.suijiamrfz["del"];
				return (isdel == false && event.player.hujia > 0) || isdel == true;
			},
			forced: true,
			async content(event, trigger, player) {
				trigger.num += 1 + player.storage.suijiamrfz["damage"] || 1;
			},
			group: "suijiamrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.suijiamrfz = {
							del: false,
							damage: 0,
						};
					},
				},
			},
		},
	"huquanmrfz": {
			audio: 2,
			enable: ["chooseToRespond", "chooseToUse"],
			hiddenCard: function (player, name) {
				if (player.countCards("h") < 1 || player.hasSkill("huquanmrfz_ban")) return false;
				if (name != "shan" && name != "wuxie") return false;
				return true;
			},
			filter: function (event, player) {
				if (player.hasSkill("huquanmrfz_ban") || player.countCards("h") < 1) return false;
				for (var name of ["wuxie", "shan"]) {
					if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var vcards = [];
					for (var name of ["wuxie", "shan"]) {
						var card = { name: name, isCard: true };
						if (event.filterCard && event.filterCard(card, player, event)) {
							if (name == "shan") vcards.push(["基本", "", name]);
							if (name == "wuxie") vcards.push(["锦囊", "", name]);
						}
					}
					/**
					 * @type {Dialog}
					 */
					//@ts-ignore
					var dialog = ui.create.dialog("虎拳", [vcards, "vcard"], "hidden");
					//@ts-ignore
					dialog.direct = true;
					return dialog;
				},
				backup: function (links, player) {
					return {
						filterCard: card => {
							return (card?.number || 0) > 5;
						},
						selectCard: 1,
						viewAs: {
							name: links[0][2],
						},
						popname: true,
						async precontent(event, trigger, player) {
							let result;

							const list = ["【碎甲】中{ }内的数字+1直到你下个回合结束"];
							if (!player.storage.suijiamrfz)
								player.storage.suijiamrfz = {
									del: false,
									damage: 0,
								};
							if (player.storage.suijiamrfz["del"] == false) list.push("删除【碎甲】中[ ]内的描述直到你下个回合结束");
							if (list.length > 1)
								result = await player
									.chooseControl()
									.set("choiceList", list)
									.set("ai", function () {
										return 1;
									})
									.set("prompt", "【虎拳】:请选择一项")
									.forResult();
							else {
								player.storage.suijiamrfz["damage"] = +1;
								//@ts-ignore
								player.logSkill("huquanmrfz");
								player.addTempSkill("huquanmrfz_ban", { global: "phaseEnd" });
								return;
							}

							if (result && result.index == 0) {
								player.storage.suijiamrfz["damage"] = +1;
							} else player.storage.suijiamrfz["del"] = true;
							//@ts-ignore
							player.logSkill("huquanmrfz");
							player.addTempSkill("huquanmrfz_ban", { global: "phaseEnd" });
						},
					};
				},
				prompt: function (links, player) {
					return "【虎拳】：视为使用一张【" + get.translation(links[0][2]) + "】";
				},
			},
			ai: {
				respondShan: true,
				order: 10,
				skillTagFilter: function (player, tag, arg) {
					return (
						player.countCards("h", function (card) {
							return (card?.number || 0) > 5;
						}) > 0 && !player.hasSkill("huquanmrfz_ban")
					);
				},
				result: { player: 1 },
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
});

translate({
	"yintuoluomrfz": "因陀罗",
	"suijiamrfz": "碎甲",
	"suijiamrfz_info": "锁定技，当你造成伤害时，[ 若其有护甲 ]，则此伤害+{ 1 }。",
	"huquanmrfz": "虎拳",
	"huquanmrfz_info": "每回合限一次，当你需要使用【闪】或【无懈可击】时，你可以将一张点数不小于6的手牌当作【闪】或【无懈可击】使用或打出，然后你选择一项：1.删除【碎甲】中[ ]内的描述直到你下个回合结束;2.令【碎甲】中{ }内的数字+1直到你下个回合结束。",
});

characterIntro("yintuoluomrfz", "因陀罗，维多利亚格拉斯哥帮武斗派头目。推进之王的下属之一。在罗德岛担任推进之王的直属护卫，偶尔会被邀请参与一些实战指导的工作（其实就是实战训练的对手）。");
