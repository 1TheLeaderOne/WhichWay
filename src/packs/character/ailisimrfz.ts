import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("ailisimrfz", { pack: "epicSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 3,
			skills: ["rumianmrfz","alsmengxiangmrfz"],
		});

skill({
	"alsmengxiangmrfz": {
			audio: 2,
			frequent: true,
			trigger: { global: "phaseUseBegin" },
			filter: function (event, player) {
				return event.player.storage.phaseHistory && event.player.storage.phaseHistory["phaseUse"];
			},
			prompt: function (event, player) {
				return "是否对" + get.translation(event.player) + "发动【梦乡】？";
			},
			async content(event, trigger, player) {
				let result;

				event.list = [];
				for (var name of lib.inpile) {
					if (get.type(name) == "delay" || get.type(name) == "equip") continue;
					if (get.tag({ name: name }, "damage")) continue;
					event.list.push([get.type(name), "", name]);
				}
				var dialog = ["为" + get.translation(trigger.player) + "选择至多三个牌名"];
				if (event.list.length) {
					//@ts-ignore
					dialog.push([event.list, "vcard"]);
				}
				if (!event.list.length) event.finish();
				else {
					result = await player
						.chooseButton(dialog, [1, 3])
						.set("ai", function (button) {
							let name = button.link[2],
								list = _status.event.list.map(i => i[2]),
								player = _status.event.player,
								trigger = _status.event.getTrigger(),
								target = trigger.player,
								getv = (name, player) => {
									let v = trigger.getTempCache("alsmengxiangmrfz", player.id + name);
									if (typeof v === "number") return v;
									v = player.getUseValue({ name: name });
									trigger.putTempCache("alsmengxiangmrfz", player.id + name, v);
									return v;
								};
							if (get.attitude(player, target) < 0) {
								if (!list.includes(name)) return 0;
								let val = 0;
								if (target.getDamagedHp() == 0 && name == "tao") val += 25;
								else if (name === "wuxie") val += 20;
								else if (name === "shan") val += 15;
								else if (name === "jiu") val += 6;
								return -getv(name, target) + val;
							} else {
								if (!list.includes(name)) return 0;
								let val = getv(name, target),
									base = 5;
								val = Math.min(15, val - base);
								if (name === "wuzhong" || name === "dongzhuxianji") val += 20;
								else if (name === "tao" && player.getDamagedHp() > 0) val += 15;
								else if (name === "shunshou") val += 6;
								return val;
							}
						})
						.set("list", event.list)
						.forResult();
				}

				if (result?.links) {
					var names = result.links.map(i => i[2]),
						target = trigger.player;
					if (!target.storage.alsmengxiangmrfz_eff) target.storage.alsmengxiangmrfz_eff = [];
					target.storage.alsmengxiangmrfz_eff = target.storage.alsmengxiangmrfz_eff.concat(names);
					game.log(player, "为", target, "选择了", "#y" + get.translation(names));
					target.addTempSkill("alsmengxiangmrfz_eff", { player: "phaseUseAfter" });
					target.markSkill("alsmengxiangmrfz_eff");
					//@ts-ignore
					player.logSkill("alsmengxiangmrfz", trigger.player);
				}
			},
			subSkill: {
				eff: {
					audio: false,
					onremove: true,
					intro: {
						mark: function (dialog, storage, player) {
							if (!storage || !storage.length) return "当前无可用牌";
							//@ts-ignore
							dialog.add([[storage[0]], "vcard"]);
							if (storage.length > 1) dialog.addSmall([storage.slice(1), "vcard"]);
						},
						content: "$",
					},
					mod: {
						//@ts-ignore
						hiddenCard: function (player, name) {
							var storage = player.getStorage("alsmengxiangmrfz_eff");
							if (storage.length) return name == storage[0];
						},
						cardname: function (card, player) {
							if (_status.event.name != "chooseToUse" || _status.event.skill) return;
							var storage = player.getStorage("alsmengxiangmrfz_eff");
							if (storage.length) return storage[0];
						},
						cardnature: function (card, player) {
							if (_status.event.name != "chooseToUse" || _status.event.skill) return;
							var storage = player.getStorage("alsmengxiangmrfz_eff");
							if (storage.length) return false;
						},
					},
					trigger: {
						player: ["useCard", "respond"],
					},
					forced: true,
					charlotte: true,
					filter: function (event, player) {
						return event.cards.length > 0 && player.getStorage("alsmengxiangmrfz_eff").length > 0;
					},
					async content(event, trigger, player) {
						player.unmarkAuto("alsmengxiangmrfz_eff", [player.getStorage("alsmengxiangmrfz_eff")[0]]);
					},
				},
			},
			ai: {
				threaten: 1.5,
			},
		},
	"rumianmrfz": {
			markimage: "extension/WhichWay/image/skill/rumianmrfz.png",
			intro: {
				content: "下个结束阶段开始额外执行#个出牌阶段",
			},
			audio: 2,
			trigger: {
				player: ["phaseDiscardAfter", "damageEnd"],
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(true, "【入眠】:请选择一名角色，令其于下个结束阶段开始时额外执行一个出牌阶段")
					.set("ai", target => {
						let player = get.player();
						if (get.attitude(player, target) > 4) {
							return get.threaten(target) / Math.sqrt(target.hp + 1) / Math.sqrt(target.countCards("h") + 1);
						}
						return get.attitude(player, target) > 0;
					})
					.forResult();

				if (result.targets) {
					var target = result.targets[0];
					target.addMark("rumianmrfz", 1, false);
					target.when({ player: "phaseJieshuBegin" }).then(async (event, trigger, player) => {
						var next = trigger.player.phaseUse();
						event.next.remove(next);
						//@ts-ignore
						trigger.getParent("phase").next.push(next);
						player.removeMark("rumianmrfz", 1, false);
						game.log(player, "执行了一个额外的出牌阶段");
					});
					// .emb({ firstDo: true });
					player.line(target);
				}
			},
			ai: {
				//expose: 0.1,
				threaten: 0.7,
				maixie: true,
				maixie_hp: true,
			},
		},
});

translate({
	"ailisimrfz": "爱丽丝",
	"alsmengxiangmrfz": "梦乡",
	"alsmengxiangmrfz_info": "一名角色出牌阶段开始时，若该角色本回合执行过出牌阶段，则你选择至多三张不带有伤害类标签的基本牌或普通锦囊牌，令其记录之，其的手牌于需要使用时均视为记录的牌名中的第一张牌直到此阶段结束，且当其使用或打出有对应实体牌的牌时，移除这些牌中的第一张牌",
	"rumianmrfz": "入眠",
	"rumianmrfz_info": "当你受到伤害后，或你的弃牌阶段结束时，你可以令一名角色在其结束阶段开始时执行一个出牌阶段。",
});

characterTitle("ailisimrfz", "<font color=#77be6a>梦境守护者</font>");

characterIntro("ailisimrfz", "爱丽丝，罗德岛临时干员，为了归还某位干员的寄存物而来到罗德岛的维多利亚术师，在处理完相关事项前，她会暂留罗德岛。</br>使用着特殊的源石技艺，能够引人沉眠并适当操控梦的内容。");
