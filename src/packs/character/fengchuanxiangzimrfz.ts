import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("fengchuanxiangzimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 3,
			skills: ["songyuemrfz", "yuxiangmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		});

skill({
	"songyuemrfz": {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			frequent: true,
			async content(event, trigger, player) {
				for (let t of [1, 2, 3]) {
					const { color } = await player.judge().forResult();
					if (player.countCards("h") < 1) continue;
					const { cards } = await player
						.chooseCard({
							position:"h",
							forced:true
						})
						.set(
							"prompt",
							`你可以重铸一张手牌，若重铸的牌与判定牌颜色(${get.translation(color)})一致，你摸${lib.skill.wuweimrfz.getNum(player, event.name)}张牌。`
						)
						.set("ai", card => {
							//@ts-ignore
							let { player, color, num } = get.event();
							return (get.color(card) === color ? 8 : 6) - get.value(card);
						})
						.set("color", color)
						.set("num", lib.skill.wuweimrfz.getNum(player, event.name))
						.forResult();
					if (!cards) return;
					let card = cards[0];
					player.recast(card);
					if (!card || lib.skill.wuweimrfz.getNum(player, event.name) < 1) continue;
					if (get.color(card) === color) player.draw(lib.skill.wuweimrfz.getNum(player, event.name));
				}
			},
		},
	"yuxiangmrfz": {
			audio: 2,
			trigger: {
				global: "phaseEnd",
			},
			filter(event, player) {
				let centralArea = get.discarded();
				return (
					centralArea.filter(card => {
						return (
							game.getGlobalHistory("changeHp", evt => {
								let evtx = evt.getParent();
								//@ts-ignore
								if (evtx.name === "damage" && evtx.num > 0) return evtx.cards?.includes(card);
								return false;
							}).length > 0
						);
					}).length > 0
				);
			},
			async cost(event, trigger, player) {
				let centralArea = get.discarded().filter(card => {
					return (
						game.getGlobalHistory("changeHp", evt => {
							let evtx = evt.getParent();
							//@ts-ignore
							if (evtx.name === "damage" && evtx.num > 0) return evtx.cards?.includes(card);
							return false;
						}).length > 0
					);
				});

				const result = await player
					.chooseButton()
					.set("createDialog", [get.prompt(event.skill) + `选择你要${get.poptip("sjzx_byRecast")}使用的牌`, centralArea])
					.set("ai", button => {
						let player = get.player();
						return player.getUseValue(button);
					})
					.set("filterButton", button => {
						let player = get.player();
						return player.hasUseTarget(button);
					})
					.forResult();
				event.result = {
					...result,
					cost_data: {
						cards: result?.links,
					},
				};
			},
			async content(event, trigger, player) {
				let [card] = event.cost_data.cards;
				player.recast(card);
				player.chooseUseTarget(card, true);
			},
		},
	"wuweimrfz": {
			audioname: ["ruoyemumrfz", "youtiansiruomaimrfz", "sanjiaochuhuamrfz", "bafanhailingmrfz"],
			audio: 2,
			init(player, skill) {
				player.storage[skill] = {};

				//添加动态翻译
				game.broadcastAll(skills => {
					skills.forEach(skill => {
						let info = get.skillInfoTranslation(skill);
						lib.dynamicTranslate[skill] = function (player) {
							if (!player.storage.wuweimrfz || lib.skill.wuweimrfz.getNum(player, skill) < 1) return info;
							return info + `（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`;
						};
					});

					lib.dynamicTranslate["wuweimrfz"] = function (player) {
						let info = get.skillInfoTranslation("wuweimrfz");
						if (!player.storage.wuweimrfz) return info;
						for (let skill of skills) {
							if (lib.skill.wuweimrfz.getNum(player, skill) > 0)
								return info.replace(`（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`, "");
						}
						return info;
					};
				}, lib.skill.wuweimrfz.validSkills);
			},
			clanSkill: true,
			getNum(receiver, skill) {
				for (let player of game.players) {
					let storage = player.storage.wuweimrfz;
					if (!storage) continue;
					for (let id in storage) {
						let info = storage[id];
						if (info.receiver.playerid !== receiver.playerid) continue;
						if (info.skill === skill) {
							let num = 0;
							//重铸
							if (receiver.getRoundHistory("lose", evt => evt.getParent(2).name === "recast").length > 0) num++;
							//使用
							if (receiver.getRoundHistory("useCard").length > 0) num++;
							//打出
							if (receiver.getRoundHistory("respond").length > 0) num++;
							//弃置
							if (receiver.getRoundHistory("lose", evt => evt.type === "discard").length > 0) num++;
							return num;
						}
					}
				}
				return 0;
			},
			trigger: {
				player: "recastAfter",
			},
			validSkills: [
				"songyuemrfz",
				"yuxiangmrfz",
				"lingwomrfz",
				"pojianmrfz",
				"leigumrfz",
				"jiaoyingmrfz",
				"weimianmrfz",
				"weiquanmrfz",
				"chendiemrfz",
				"umiri_chenxianmrfz",
			],
			filter(event, player) {
				return Object.keys(player.storage.wuweimrfz).length < 1;
			},
			async cost(event, trigger, player) {
				const { targets } = await player
					.chooseTarget()
					.set("prompt2", `你可以将本技能句号之后的描述移至同族武将的武将牌上任意一个技能直到本轮结束`)
					.set("prompt", `【毋畏】:请选择一名${get.poptip("sjzx_AveMujica")}角色`)
					.set("filterTarget", (card, player, target) => {
						let flag = false;
						let skills = target.getOriginalSkills().filter(skill => lib.skill.wuweimrfz.validSkills.includes(skill));
						for (let skill of skills) {
							if (lib.skill.wuweimrfz.getNum(target, skill) < 1) {
								flag = true;
								break;
							}
						}
						return flag && target.getClans(true).includes("AveMujica");
					})
					.set("ai", target => get.attitude2(target) > 0)
					.forResult();
				if (!targets) return;
				let target = targets[0];
				if (!target) {
					event.result = {
						bool: false,
					};
					return;
				}

				let skills = target.getOriginalSkills().filter(skill => lib.skill.wuweimrfz.validSkills.includes(skill));
				if (skills.length < 1) {
					event.result = {
						bool: false,
					};
					return;
				}
				const result = await player
					.chooseControl({controls:skills.concat("cancel2")})
					.set("prompt", `为一个技能添加下列描述直到本轮结束：“（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）”`)
					.set("ai", () => {
						//@ts-ignore
						return get.event().skills.randomGet();
					})
					.set("skills", skills)
					.forResult();
				event.result = {
					...result,
					cost_data: result,
				};
			},
			async content(event, trigger, player) {
				let skill = event.cost_data.control;
				if (!player.storage.wuweimrfz) player.storage.wuweimrfz = {};
				if (player.playerid) {
					player.storage.wuweimrfz[player.playerid] = {
						skill: skill,
						receiver: player,
					};
					player.when({ global: "roundStart" }).then(async (event,trigger,player) => {
						if (player.playerid) delete player.storage.wuweimrfz[player.playerid];
					});
				}
			},
		},
});

translate({
	"fengchuanxiangzimrfz": "丰川祥子",
	"songyuemrfz": "颂乐",
	"songyuemrfz_info": "准备阶段，你可以进行三次判定，每次判定后你重铸一张手牌，若重铸的牌与判定牌颜色一致，你摸X张牌。",
	"yuxiangmrfz": "余响",
	"yuxiangmrfz_info": `任意角色的结束阶段，你可以${get.poptip("sjzx_byRecast")}使用${get.poptip("sjzx_centralArea")}中本回合造成过伤害的一张牌，若此牌造成伤害，你可以弃置至多X名角色的一张手牌。`,
	"wuweimrfz": "毋畏",
	"wuweimrfz_info": `宗族技（${get.poptip("sjzx_AveMujica")}），当你重铸牌后，你可以将本技能句号之后的描述移至同族武将的武将牌上任意一个技能直到本轮结束。（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`,
});

characterTitle("fengchuanxiangzimrfz", "<font color = #db7093>毋畏遗忘</font>");

characterIntro("fengchuanxiangzimrfz", "Ave Mujica的键盘手丰川祥子。与其他成员一起暂居罗德岛，在此期间，积极参与舰上的各项工作。不管是音乐上的造诣，还是行为礼仪，都彰显了她不折不扣的名门大小姐身份。");
