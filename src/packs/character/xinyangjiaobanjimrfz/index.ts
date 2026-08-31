import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xinyangjiaobanjimrfz", {
			sex: "male",
			group: "lamrfz",
			hp: 4,
			skills: ["daoweimrfz","chongzhoumrfz","shiyimrfz"],
		});

skill({
	"daoweimrfz": {
			audio: 2,
			trigger: { player: "phaseDrawEnd" },
			forced: true,
			filter(event, player) {
				let cards = [];
				let histories = player.getHistory("gain", evt => {
					let evtx = evt.getParent(2);
					return evtx.name === "phaseDraw" || (evtx.triggername && evtx.triggername.includes("phaseDraw"));
				});
				for (let history of histories) {
					if (history.cards) cards.push(...history.cards);
				}
				return cards.length > 0;
			},
			async content(event, trigger, player) {
				let cards = [];
				let histories = player.getHistory("gain", evt => {
					let evtx = evt.getParent(2);
					//@ts-ignore
					return evtx.name === "phaseDraw" || (evtx.triggername && evtx.triggername.includes("phaseDraw"));
				});
				for (let history of histories) {
					if (history.cards) cards.push(...history.cards);
				}
				await player.discard(cards);
				player.draw(cards.length * 2);
				player.storage.daoweimrfz_ban = Array.from(new Set(cards.map(card => card.name)));
				player.addTempSkill("daoweimrfz_ban", { player: "phaseEnd" });
			},
			subSkill: {
				ban: {
					charlotte: true,
					onremove: true,
					mark: true,
					intro: {
						content(_, player) {
							return `·无法使用或打出${get.translation(player.storage.daoweimrfz_ban)}`;
						},
					},
					mod: {
						cardEnabled2(card, player) {
							if (player.storage.daoweimrfz_ban.includes(card.name)) return false;
						},
					},
				},
			},
		},
	"chongzhoumrfz": {
			audio: 2,
			enable: ["chooseToUse", "chooseToRespond"],
			usable: 1,
			intro: {
				name: "铳胄",
				content: "本回合手牌上限+2",
			},
			filter(event, player) {
				if (event.type == "wuxie") return false;
				for (var name of ["sha", "shan"]) {
					if (event.filterCard({ name: name, isCard: true }, player, event)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog(event, player) {
					var vcards = [];
					for (var name of ["sha", "shan"]) {
						var card = { name: name, isCard: true };
						if (event.filterCard(card, player, event)) {
							if (name === "sha") {
								for (var j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
							}
							vcards.push(["基本", "", name]);
						}
					}
					/**@type {Dialog}*/
					//@ts-ignore
					var dialog = ui.create.dialog("铳胄", [vcards, "vcard"], "hidden");
					//@ts-ignore
					dialog.direct = true;
					return dialog;
				},
				backup(links, player) {
					return {
						audio: "chongzhoumrfz",
						filterCard: () => true,
						selectCard: 1,
						viewAs: {
							name: links[0][2],
							nature: links[0][3],
							isCard: true,
						},
						popname: true,
						async precontent(event, trigger, player) {
							//@ts-ignore
							let target = _status.currentPhase;
							if (
								target.getSkills().filter(skill => {
									let info = get.info(skill);
									return info.sourceSkill && info.sourceSkill === "chongzhoumrfz";
								}).length < 1
							) {
								target.markSkill("chongzhoumrfz");
								target
									.when({ player: "phaseEnd" })
									.then(() => {
										player.unmarkSkill("chongzhoumrfz");
									})
									.assign({
										mod: {
											maxHandcard: function (player, num) {
												return (num += 2);
											},
										},
									});
							}
						},
					};
				},
				prompt(links, player) {
					return "铳胄：视为使用一张" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】";
				},
			},
			ai: {
				order(item, player) {
					var player = _status.event.player;
					var event = _status.event;
					if (event.filterCard({ name: "sha" }, player, event)) {
						if (
							!player.hasShan() &&
							//@ts-ignore
							!game.hasPlayer(function (current) {
								return player.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player, player) > 0;
							})
						) {
							return 0;
						}
						return 2.95;
					} else {
						var player = _status.event.player;
						if (player.hasSkill("qingzhong_give")) return 2.95;
						return 3.15;
					}
				},
				respondSha: true,
				respondShan: true,
				skillTagFilter(player, tag, arg) {
					if (arg === "respond") return false;
				},
				result: {
					player: 1,
				},
			},
		},
	"shiyimrfz": {
			audio: 2,
			derivation: ["xiangle"],
			init(player, skill) {
				player.storage[skill] = false;

				let info = get.info("xiangle");
				if (!info.audioname2) info.audioname2 = {};
				info.audioname2["xinyangjiaobanjimrfz"] = "xiangle_xinyangjiaobanjimrfz";
			},
			trigger: {
				player: ["dying", "loseAfter"],
				global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			skillAnimation: true,
			animationColor: "wood",
			juexingji: true,
			unique: true,
			filter: function (event, player) {
				if (event.name === "dying") return !player.storage.shiyimrfz;
				else {
					if (player.countCards("h")) return false;
					const evt = event.getl(player);
					return evt && evt.player == player && evt.hs && evt.hs.length > 0 && !player.storage.shiyimrfz;
				}
			},
			forced: true,
			content: async function (event, trigger, player) {
				player.loseMaxHp();
				player.recover();
				player.addSkill("xiangle");
				player.removeSkill("daoweimrfz");
				game.log(player, "获得了技能", "#g【享乐】");
				player.awakenSkill(event.name);
				player.storage[event.name] = true;

				let num = 5 - player.getAllHistory("useSkill", evt => evt.skill === "daoweimrfz").length;
				num = Math.max(num, 1);
				player.draw(num);
				player.storage.shiyimrfz_eff = num;
				player.addSkill("shiyimrfz_eff");
			},
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					onremove: true,
					mark: true,
					intro: {
						content(_, player) {
							let num = player.storage.shiyimrfz_eff;
							return `·手牌上限+${num}<br>·额定摸牌数+${num}`;
						},
					},
					trigger: { player: "phaseDrawBegin2" },
					filter(event, player) {
						return !event.numFixed;
					},
					async content(event, trigger, player) {
						trigger.num += player.storage.shiyimrfz_eff;
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + player.storage.shiyimrfz_eff;
						},
					},
				},
			},
		},
});

translate({
	"xinyangjiaobanjimrfz": "信仰搅拌机",
	"daoweimrfz": "蹈卫",
	"daoweimrfz_info": "锁定技，摸牌阶段结束时，你弃置所有本阶段获得的牌且你本回合无法使用或打出手牌中与你因此弃置的牌牌名相同的牌，然后摸X张牌。（X=你因此弃置的牌的数量的两倍）",
	"chongzhoumrfz": "铳胄",
	"chongzhoumrfz_info": "每回合限一次，你可以将一张牌当作【杀】或【闪】使用或打出，然后你令当前回合角色手牌上限+2。",
	"shiyimrfz": "拾遗",
	"shiyimrfz_info": "觉醒技，当你进入濒死状态或失去所有手牌时，你失去一点体力上限并恢复一点体力值，失去“蹈卫”，获得“享乐”，然后你令你的额定摸牌数和手牌上限+Y，摸Y张牌。（Y= 5 - 你发动“蹈卫”的次数，Y至少为1）",
});

characterTitle("xinyangjiaobanjimrfz", "<font color='#6495ed'>律法守卫</font>");

characterIntro("xinyangjiaobanjimrfz", "帕特里奇昂，拉特兰公民，拉特兰目前任职时间最长的铳骑，适用于拉特兰一至十三项公民权益，熟练掌握所有种类铳械的使用方式。现因拉特兰教皇厅与罗德岛友好协议，以“信仰搅拌机”为代号，作为合作干员为罗德岛提供协助。");
