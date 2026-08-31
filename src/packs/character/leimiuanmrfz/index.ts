import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("leimiuanmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "lamrfz",
			hp: 3,
			skills: ["feiyimrfz","mingzhengmrfz","zhuijimrfz"],
		});

skill({
	"feiyimrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			intro: {
				content(_, player) {
					let index;
					player.getSkills().forEach(skill => {
						let info = get.info(skill);
						if (typeof info.feiyimrfz === "number") {
							index = info.feiyimrfz;
						}
					});
					return `·回合内你的攻击距离${index === 0 ? "+1" : "-1"}<br>·其他角色计算与你的距离${index === 0 ? "-1" : "+1"}`;
				},
			},
			async cost(event, trigger, player) {
				const { index } = await player
					.chooseControl({
						controls:["选项一", "选项二", "cancel2"]
					})
					.set("prompt", get.prompt("feiyimrfz"))
					.set("choiceList", [
						"你可以令你本回合的攻击距离+1，然后直到下个准备阶段开始时，其他角色计算与你的距离-1。",
						"你可以令你本回合的攻击距离-1，然后直到下个准备阶段开始时，其他角色计算与你的距离+1。",
					])
					.set("ai", () => 1)
					.forResult();
				if (typeof index === "number")
					event.result = {
						bool: true,
						cost_data: {
							index: index,
						},
					};
				else event.result = { bool: false };
			},
			async content(event, trigger, player) {
				const { index } = event.cost_data;
				player.markSkill("feiyimrfz");
				player
					.when({ player: "phaseBegin" })
					.then(async (event,trigger,player) => {
						player.unmarkSkill("feiyimrfz");
					})
					.assign({
						mod: {
							globalTo(from, to, distance) {
								return distance + (index === 0 ? -1 : 1);
							},
							attackRange: function (player, num) {
								return (num += index === 0 ? 1 : -1);
							},
						},
						feiyimrfz: index,
					});
			},
			ai: {
				threaten: 0.8,
				combo: "mingzhengmrfz",
			},
		},
	"mingzhengmrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return event.filterCard ? player.countCards("h", card => event.filterCard(card, player, event)) > 0 : player.countCards("h") > 0;
			},
			filterCard: (card, player, event) => {
				return !lib.filter.filterCard(card, player, event);
			},
			selectCard: () => {
				let player = get.player();
				let num = player.getCards("h", card => lib.filter.filterCard(card, player)).length;
				num = Math.max(num, 1);
				return [0, num];
			},
			discard: false,
			lose: false,
			intro: {
				content: "·使用牌无距离限制<br>·使用的牌无视防具",
			},
			check(card) {
				let player = get.player();
				return get.value(card, player) < 6;
			},
			async content(event, trigger, player) {
				await player.recast(event.cards);
				let canUseCount = player.getCards("h", card => lib.filter.filterCard(card, player)).length;
				let cantUseCount = player.getCards("h", card => !lib.filter.filterCard(card, player)).length;
				if (canUseCount > cantUseCount) {
					player.draw(2);
					player.markSkill("mingzhengmrfz");
					player.addTempSkill("mingzhengmrfz_ig", { player: "phaseEnd" });
					player
						.when({ player: "phaseEnd" })
						.then(async (event,trigger,player) => {
							player.unmarkSkill("mingzhengmrfz");
						})
						.assign({
							mod: {
								targetInRange: function () {
									return true;
								},
							},
						});
				}
			},
			subSkill: {
				ig: {
					trigger: {
						player: "useCardToPlayered",
					},
					silent: true,
					charlotte: true,
					logTarget: "target",
					async content(event, trigger, player) {
						trigger.target.addTempSkill("qinggang2");
						trigger.target.storage.qinggang2.add(trigger.card);
						trigger.target.markSkill("qinggang2");
					},
					ai: {
						unequip_ai: true,
						skillTagFilter(player, tag, arg) {
							if (arg && arg.name == "sha") return true;
							return false;
						},
					},
				},
			},
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
		},
	"zhuijimrfz": {
			audio: 3,
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				//@ts-ignore
				return game.countPlayer(c => c.countCards("h") && c !== player && !player.inRange(c)) > 0;
			},
			prompt2(event, player) {
				//@ts-ignore
				let targets = game.filterPlayer(c => c.countCards("h") && c !== player && !player.inRange(c));
				return `你可以展示你攻击范围外所有角色（${get.translation(targets)}）的一张牌，所有因此展示了伤害类牌的角色本阶段成为你使用牌的目标时，你可以对其造成一点伤害或摸一张牌（每项每名角色每阶段限一次）。`;
			},
			intro: {
				content(_, player) {
					return `成为通缉的目标`;
				},
			},
			async content(event, trigger, player) {
				//@ts-ignore
				let targets = game.filterPlayer(c => c.countCards("h") && c !== player && !player.inRange(c));
				let obj = {
					cards: [],
					targets: [],
				};
				for (let target of targets) {
					const { cards } = await player
						.choosePlayerCard({
							position:"h",
							forced:true,
							target:target,
						})
						.set("ai", () => get.rand(0, 1))
						.set("prompt", `展示${get.translation(target)}一张手牌`)
						.forResult();
					if (!cards) return;
					let card = cards[0];
					if (card) {
						//@ts-ignore
						obj.cards.push(card);
						//@ts-ignore
						obj.targets.push(target);
						if (get.suit(card) !== "spade") {
							target.storage.zhuijimrfz = [];
							target.markSkill("zhuijimrfz");
						}
					}
				}
				if (obj.cards.length > 0) {
					//@ts-ignore
					event.videoId = lib.status.videoId++;
					game.log(player, "展示了", obj.targets, "的", obj.cards);
					game.broadcastAll(
						function (info, id, player) {
							let { targets, cards } = info;
							var dialog = ui.create.dialog(`因${get.translation(player)}的【追缉】而展示的牌`, cards);
							//@ts-ignore
							dialog.videoId = id;
							var getName = function (target) {
								if (target._tempTranslate) return target._tempTranslate;
								var name = target.name;
								if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
								return get.translation(name);
							};
							for (var i = 0; i < targets.length; i++) {
								//@ts-ignore
								dialog.buttons[i].querySelector(".info").innerHTML = getName(targets[i]);
							}
							setTimeout(() => {
								dialog.show();
							}, 1);
						},
						//@ts-ignore
						obj,
						//@ts-ignore
						event.videoId,
						player
					);
					game.delay(3);
					setTimeout(() => {
						//@ts-ignore
						game.broadcastAll("closeDialog", event.videoId);
					}, 3000);
				}
			},
			group: ["zhuijimrfz_clear", "zhuijimrfz_eff"],
			subSkill: {
				eff: {
					mod: {
						cardUsableTarget(card, player, target) {
							if (Array.isArray(target.storage.zhuijimrfz)) return true;
						},
					},
					audio: "zhuijimrfz",
					charlotte: true,
					trigger: { player: "useCardToTargeted" },
					filter(event, player) {
						let storage = event.target.storage.zhuijimrfz;
						return storage && storage.length < 2;
					},
					async cost(event, trigger, player) {
						let storage = trigger.target.storage.zhuijimrfz;
						let list = ["摸一张牌", `对${get.translation(trigger.target)}造成一点伤害`];
						if (storage.includes("damage") || storage.includes("draw")) {
							let str = storage.includes("draw") ? `是否对${get.translation(trigger.target)}造成一点伤害？` : `是否摸一张牌？`;
							let aiBool = true;
							if (storage.includes("draw") && get.damageEffect(trigger.target, player, player) < 0) aiBool = false;
							const { bool } = await player
								.chooseBool()
								.set("prompt", str)
								.set("ai", () => aiBool)
								.forResult();
							event.result = {
								bool: bool,
								cost_data: {
									index: storage.includes("draw") ? 1 : 0,
								},
							};
						} else {
							const { index } = await player
								.chooseControl("选项一", "选项二", "cancel2")
								.set("choiceList", list)
								.set("ai", () => {
									let player = get.player();
									let target = get.event().target;
									return get.damageEffect(target, player, player) > 0 ? 1 : 0;
								})
								.set("target", trigger.target)
								.forResult();
							if (typeof index === "number") {
								event.result = {
									bool: true,
									cost_data: {
										index: index,
									},
								};
							} else event.result = { bool: false };
						}
					},
					async content(event, trigger, player) {
						const { index } = event.cost_data;
						if (index === 0) {
							player.draw();
						} else {
							trigger.target.damage(player);
							player.line(trigger.target);
						}
						trigger.target.storage.zhuijimrfz.push(index === 0 ? "draw" : "damage");
					},
				},
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseUseEnd" },
					content() {
						for (let char of game.players) {
							if (Array.isArray(char.storage.zhuijimrfz)) {
								char.unmarkSkill("zhuijimrfz");
								delete char.storage.zhuijimrfz;
							}
						}
					},
				},
			},
		},
});

translate({
	"leimiuanmrfz": "蕾缪安",
	"feiyimrfz": "飞椅",
	"feiyimrfz_info": "准备阶段，你可以令你本回合的攻击距离[+1/-1]，然后直到你的下个回合开始时，其他角色计算与你的距离[-1/+1]。",
	"mingzhengmrfz": "明政",
	"mingzhengmrfz_info": "出牌阶段限一次，你可以重铸至多X张此时机不可使用的牌，然后若你手牌中此时机可使用的牌占绝对多数，你摸两张牌、本回合使用牌无距离限制且使用的牌无视防具。（X=你此时机可使用的牌，X至少为1）",
	"zhuijimrfz": "追缉",
	"zhuijimrfz_info": "出牌阶段开始时，你可以展示你攻击范围外所有角色的一张牌，所有因此展示了非黑桃牌的角色本阶段成为你使用牌的目标时，你可以对其造成一点伤害或摸一张牌（每项每名角色每阶段限一次），且你对这些角色使用牌无次数限制。",
});

characterTitle("leimiuanmrfz", "<font color='#6495ed'>第七枢机</font>");

characterIntro("leimiuanmrfz", "蕾缪安，拉特兰公民，适用于拉特兰一至十三项公民权益，现任拉特兰教皇厅第七厅枢机。<br>蕾缪安本人称自己来到罗德岛可以被视作干员家属来舰探亲，但她的到访在程序上仍需被认定为拉特兰代表对罗德岛的正式访问。访问期间，蕾缪安将依照协议为罗德岛提供各种形式的协助。");
