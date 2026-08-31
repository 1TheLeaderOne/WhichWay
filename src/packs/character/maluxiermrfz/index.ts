import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("maluxiermrfz", { pack: "legendSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["kumomrfz","cainvmrfz","cangshumrfz"],
		});

skill({
	"kumomrfz": {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				if (!player.isPhaseUsing()) return false;
				//@ts-ignore
				return event.card && get.type(event.card) == "trick";
			},
			forced: true,
			async content(event, trigger, player) {
				if (!player.getStat("card").sha) player.getStat("card").sha = 0;
				player.getStat("card").sha++;
			},
			mod: {
				cardEnabled(card, player) {
					if (get.type(card) == "trick" && player.getCardUsable("sha") < 1) return false;
				},
				cardUsable: function (card, player, num) {
					if (card.name != "sha") return;
					//@ts-ignore
					if (!_status.kumomrfz_tmp) {
						//@ts-ignore
						_status.kumomrfz_tmp = true;
						const count = player.getCardUsable("sha");
						//@ts-ignore
						_status.kumomrfz_tmp = false;
						if (player.isPhaseUsing() && count >= player.maxHp) {
							return player.maxHp;
						}
					}
					return;
				},
			},
			ai: {
				combo: "cainvmrfz",
				threaten: 0.8,
			},
		},
	"cainvmrfz": {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			filter(event, player) {
				//@ts-ignore
				if (event.getParent().triggeredTargets3.length > 1) return false;
				//@ts-ignore
				return event.card && get.type(event.card) == "trick" && player.getCardUsable("sha") > 0;
			},
			prompt(event, player) {
				return `【才女】:是否令${get.translation(event.card)}额外结算${Math.min(player.maxHp, player.getCardUsable("sha"))}次？`;
			},
			async content(event, trigger, player) {
				const num = Math.min(player.getCardUsable("sha"), player.maxHp);
				if (trigger.parent) trigger.parent.effectCount += num;
			},
			group: "cainvmrfz_trick",
			subSkill: {
				trick: {
					hiddenCard: function (player, name) {
						if (player.getStat("skill").cainvmrfz_trick && player.getStat("skill").cainvmrfz_trick >= player.maxHp) return false;
						return player.countCards("hes", "sha") < 1 && !lib.inpile.includes(name) && get.type(name) != "trick";
					},
					audio: "cainvmrfz",
					enable: "chooseToUse",
					filter: function (event, player) {
						if (player.getStat("skill").cainvmrfz_trick && player.getStat("skill").cainvmrfz_trick >= player.maxHp) return false;
						return player.hasCard(card =>
							lib.inpile.some(name => {
								if (get.name(card) != "sha") return false;
								if (get.type(name) != "trick") return false;
								if (event.filterCard({ name: name, isCard: true, cards: [card] }, player, event)) return true;
								return false;
							}, "hes")
						);
					},
					chooseButton: {
						dialog: function (event, player) {
							var list = [];
							for (var name of lib.inpile) {
								if (get.type(name) == "trick") {
									list.push([get.translation(get.type(name)), "", name]);
								}
							}
							return ui.create.dialog("才女", [list, "vcard"]);
						},
						filter: function (button, player) {
							//@ts-ignore
							return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
						},
						check: function (button) {
							var player = _status.event.player;
							//@ts-ignore
							var card = { name: button.link[2], nature: button.link[3] };
							if (player.countCards("hes", cardx => cardx.name == card.name)) return 0;
							//@ts-ignore
							return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
						},
						backup: function (links, player) {
							return {
								audio: "cainvmrfz",
								filterCard(card) {
									return card.name == "sha";
								},
								popname: true,
								check: function (card) {
									return 7 - get.value(card);
								},
								position: "hes",
								viewAs: { name: links[0][2], nature: links[0][3] },
							};
						},
						prompt: function (links, player) {
							return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
						},
					},
					ai: {
						order: 13,
						threaten: 1.8,
						result: {
							player: 1,
						},
					},
				},
			},
		},
	"cangshumrfz": {
			audio: 2,
			trigger: { player: ["phaseUseEnd", "phaseUseBegin"] },
			intro: {
				content(event, player) {
					const storage = player.storage.cangshumrfz;
					if (storage.index == 0) return `下个出牌阶段开始时摸${storage.num}张牌`;
					return `下个出牌阶段阶段使用【杀】的次数+1`;
				},
			},
			filter(event, player) {
				return get.is.object(player.storage.cangshumrfz) || player.getCardUsable("sha") > 0;
			},
			async cost(event, trigger, player) {
				if (event.triggername == "phaseUseBegin") {
					if (!event.result) event.result = {};
					event.result.bool = get.is.object(player.storage.cangshumrfz);
					return;
				} else if (player.getCardUsable("sha") < 1) {
					if (!event.result) event.result = {};
					event.result.bool = false;
					return;
				}
				event.result = await player
					.chooseControl("选项一", "选项二", "cancel2")
					.set("choiceList", [`摸${Math.min(player.getCardUsable("sha"), player.maxHp)}张牌`, `使用【杀】的次数+1`])
					.set("ai", () => {
						const player = get.player();
						const num = player.getCardUsable("sha");
						return num > 1 ? 0 : 1;
					})
					.forResult();
				//@ts-ignore
				event.result.cost_data = event.result.index;
			},
			async content(event, trigger, player) {
				if (event.triggername == "phaseUseBegin") {
					const result = player.storage.cangshumrfz;
					if (result["index"] == 0) {
						player.draw(result["num"]);
					} else player.addTempSkill("cangshumrfz_sha", { player: "phaseUseEnd" });
					delete player.storage.cangshumrfz;
					player.unmarkSkill("cangshumrfz");
					return;
				}
				const index = event.cost_data;
				player.storage.cangshumrfz = {
					index: index,
					//@ts-ignore
					num: index === 0 ? Math.min(player.getCardUsable("sha"), player.maxHp) : 1,
				};
				player.markSkill("cangshumrfz");
			},
			subSkill: {
				sha: {
					charlotte: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
			},
		},
});

translate({
	"maluxiermrfz": "玛露希尔",
	"kumomrfz": "枯魔",
	"kumomrfz_info": "锁定技，当你于出牌阶段使用普通锦囊牌后，你使用【杀】的次数-1，当你剩余使用【杀】的次数不大于0时，你不能使用普通锦囊牌；出牌阶段你使用【杀】的次数至多为X。（X=本阶段你剩余可以使用【杀】的次数，X至多为你的体力上限）",
	"cainvmrfz": "才女",
	"cainvmrfz_info": "出牌阶段限X次，你可以将【杀】当作任意普通锦囊牌使用；你使用的普通锦囊牌可以额外结算X次。（X=本阶段你剩余可以使用【杀】的次数，X至多为你的体力上限）",
	"cangshumrfz": "藏书",
	"cangshumrfz_info": "出牌阶段结束时，若X不小于1，你可以令你下个出牌阶段开始时执行一项：<br>1.摸X张牌;2.本阶段使用【杀】的次数+1。<br>（X=本阶段你剩余可以使用【杀】的次数，X至多为你的体力上限）",
});

characterTitle("maluxiermrfz", "<font color=#00868B>建校以来第一才女</font>");

characterIntro("maluxiermrfz", "玛露西尔，莱欧斯小队的魔法师。<br>自称在迷宫中尝试救回朋友法琳时意外来到泰拉，现于罗德岛寻找返回原本所在地的方法，并为罗德岛提供医疗、法术方面的协助。");
