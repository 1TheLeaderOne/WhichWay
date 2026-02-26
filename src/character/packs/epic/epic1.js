import { lib, game, ui, get, ai, _status } from "noname";

/**
 * 五星武将的第一部分
 */
/**
 * @type { WhichWayCharacterPack }
 */
export default {
	character: {
		fulankamrfz: ["female", "gemrfz", 3, ["jifengmrfz", "xiqiaomrfz"], []],
		xingjimrfz: ["female", "gemrfz", 4, ["tianyimrfz", "huijianmrfz", "bingmingmrfz"], []],
		xingyuanmrfz: ["female", "lymrfz", 4, ["daoliumrfz", "gewumrfz"], []],
		zhanchemrfz: ["male", "othermrfz", "4/4/2", ["jiqiangmrfz", "qingxiemrfz"], []],
		shanjimrfz: ["male", "othermrfz", 4, ["shandunmrfz", "xuanmumrfz", "chuandunmrfz"], []],
		shuanghuamrfz: ["female", "othermrfz", 3, ["tadianmrfz", "xinjimrfz"], []],
		bohuimrfz: ["female", "samimrfz", 4, ["shehunmrfz", "yirenmrfz"], []],
		baimianxiaomrfz: ["female", "lymrfz", 3, ["jinaomrfz", "wutaimrfz"], []],
		cimeimrfz: ["female", "weimrfz", 3, ["huabumrfz", "shixinmrfz"], []],
		hongmrfz: ["female", "luomrfz", 4, ["qunlangmrfz", "cigumrfz", "qingchumrfz"], ["hiddenSkill"]],
		dekesasimrfz: ["female", "qimrfz", 4, ["sudimrfz", "jianyumrfz"], []],
		baijinmrfz: ["female", "kamrfz", 3, ["xujimrfz", "shiyumrfz"], []],
		yintuoluomrfz: ["female", "weimrfz", 4, ["suijiamrfz", "huquanmrfz"], []],
		wenmimrfz: ["female", "leimrfz", 3, ["baiweimrfz", "nuanxiangmrfz"], []],
		meiermrfz: ["female", "lymrfz", 3, ["shuitamrfz"], []],
		lindongmrfz: ["female", "wumrfz", 4, ["xianlingmrfz", "dongjiangmrfz"], []],
		yunxingmrfz: ["female", "luomrfz", 4, ["yxliumingmrfz", "dingyuanmrfz"], []],
		yumaobimrfz: ["female", "bomrfz", 4, ["tiaojiumrfz", "rujingmrfz"], []],
		ailisimrfz: ["female", "weimrfz", 3, ["rumianmrfz", "alsmengxiangmrfz"], []],
		tianhuomrfz: ["female", "weimrfz", 3, ["zhuihuomrfz", "yihuomrfz"], []],
		linguangmrfz: ["female", "shimrfz", "3/4/3", ["anranmrfz", "huchimrfz", "chongyaomrfz"], []],
		haimomrfz: ["female", "yimrfz", 4, ["xunchaomrfz", "paoyingmrfz"], []],
		xiaomanmrfz: ["female", "yanmrfz", 4, ["mushoumrfz"], []],
		wanqingmrfz: ["male", "yanmrfz", 4, ["guantianmrfz", "yingfengmrfz"], []],
		gelaokesimrfz: ["female", "yimrfz", 4, ["cichongmrfz", "ganraomrfz"], []],
		haidimrfz: ["female", "weimrfz", 3, ["anxinmrfz", "gongchoumrfz", "yinshimrfz"], []],
		yaxinmrfz: ["female", "xiemrfz", 4, ["lingdingmrfz", "yabengmrfz"], []],
		chuxuemrfz: ["female", "xiemrfz", 3, ["shengnvmrfz", "shenshemrfz"], []],
		shixiemrfz: ["female", "samrfz", 3, ["qianzongmrfz", "xiedumrfz", "lijimrfz"], ["hiddenSkill"]],
		hongsunmrfz: ["female", "samrfz", 4, ["chihenmrfz", "haomingmrfz"], []],
		xiyinmrfz: ["female", "samrfz", 3, ["sheyingmrfz", "chaozaimrfz"], []],
		yemomrfz: ["female", "weimrfz", 3, ["biaolimrfz", "ymkongwomrfz"], []],
		jingzhemrfz: ["female", "yanmrfz", 3, ["chunleimrfz", "zheqimrfz"], []],
		longshelanmrfz: ["male", "bomrfz", 4, ["tiaojiumrfz", "pianfengmrfz"], []],
		spamiyamrfz: ["female", "luomrfz", 4, ["chenxianmrfz", "benyemrfz", "newjueyingmrfz"], []],
		amiyamrfz: ["female", "luomrfz", 3, ["newtongganmrfz", "shijiemrfz", "qinghemrfz"], ["zhu"]],
		docmrfz: ["male", "othermrfz", 4, ["yizhemrfz", "zhulimrfz"], []],
		// innamrfz: ['female', 'othermrfz', 4, ['shuangzimrfz'], []],
		linshimrfz: ["female", "samimrfz", 3, ["jiangtumrfz", "jieshimrfz"], []],
		medical_amiyamrfz: ["female", "luomrfz", 3, ["tongqingmrfz", "cibeimrfz"], []],
		spfenmrfz: ["female", "luomrfz", 4, ["xiaozhimrfz", "zhishoumrfz"], []],
		hainimrfz: ["female", "a_groupmrfz", 3, ["jingchaomrfz", "cehuimrfz"], []],
		shenxunmrfz: ["female", "a_groupmrfz", 5, ["yuchaomrfz", "yanhuimrfz"], []],
		mingjiaomrfz: ["female", "luomrfz", 3, ["suozemrfz", "youyimrfz"], []],
		daifeienmrfz: ["female", "weimrfz", 3, ["zhuofengmrfz", "qianggongmrfz"], []],
		xirenmrfz: ["male", "gemrfz", 4, ["suximrfz", "sanzhongmrfz"], []],
		suocaomrfz: ["female", "samrfz", 3, ["lanjuanmrfz", "xinglumrfz"], []],
		laiousimrfz: ["male", "othermrfz", 4, ["shijianmrfz", "shimomrfz"], []],
		senximrfz: ["male", "othermrfz", 4, ["micaimrfz", "beicaimrfz", "pengcaimrfz"], []],
		qierchakemrfz: ["male", "othermrfz", 3, ["tangongmrfz", "ruiganmrfz"], []],
		kaiselinmrfz: ["female", "weimrfz", 3, ["ksl_zhuzhimrfz", "duantiemrfz"], []],
		bobumrfz: ["male", "gemrfz", 4, ["qingtingmrfz", "qingtanmrfz"], []],
		feilaimrfz: ["female", "samrfz", 5, ["qianxiumrfz", "mingzhoumrfz"], []],
		caidumrfz: ["male", "xumrfz", 4, ["caiyimrfz", "mingjiangmrfz"], []],
		tekenuomrfz: ["female", "bomrfz", 4, ["suoumrfz"], []],
		guiyanmrfz: ["female", "yimrfz", 3, ["qiyimrfz", "guiyaomrfz", "xiadumrfz"], []],
		xingzhumrfz: ["female", "yanmrfz", 3, ["xingzhumrfz", "zhizhumrfz"], []],
		xunlanmrfz: ["female", "gemrfz", 4, ["tanxunmrfz", "dongximrfz"], []],
		nuoweiermrfz: ["male", "weimrfz", 3, ["butingmrfz", "buximrfz"], []],
		spfurongmrfz: ["female", "luomrfz", 3, ["dichenmrfz", "zhuoxinmrfz"], []],
		anzhelamrfz: ["female", "liemrfz", 3, ["jianmomrfz", "zhishemrfz", "ruijuemrfz", "tongmaimrfz"], ["clan:深海猎人"]],

		//————测试————//
		//ceshisjzx:['female','shen',5,['diymengxian','diyfujing','diyhesheng'],[]],
	},
	skill: {
		// 安哲拉
		zhishemrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return player.countCards("he") > 0 && game.hasPlayer(current => current.countCards("h") > 0 && current !== player);
			},
			filterTarget(card, player, target) {
				return target !== player && target.countCards("h") > 0;
			},
			filterCard: true,
			async content(event, trigger, player) {
				const { targets, cards } = event;
				let target = targets[0];
				const { cards: card2 } = await player
					.discardPlayerCard("h", target, true)
					.set("target", target)
					.set("complexSelect", false)
					.set("ai", lib.card.guohe.ai.button)
					.forResult();
				if (card2) player.draw(new Set([].concat(cards, card2).map(i => get.type2(i, player))).size);
				else player.draw();
				if (target.countCards("h") === 0 && card2) player.getStat("skill").zhishemrfz = 0;
			},
		},
		jianmomrfz: {
			audio: 2,
			mod: {
				targetEnabled(card) {
					if (get.type(card) == "trick" || get.type(card) == "delay") return false;
				},
			},
			forced: true,
			firstDo: true,
			filter(event, player) {
				if (event.player == player) return false;
				if (get.color(event.card) != "black" || get.type(event.card) != "trick") return false;
				var info = lib.card[event.card.name];
				return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
			},
			async content(event,trigger,player) {},
		},
		ruijuemrfz: {
			audio: 2,
			trigger: {
				player: ["loseAfter", "gainAfter"],
			},
			filter(event, player) {
				if (player.countCards("he") < 1) return false;
				if (event.name === "lose") return event.type === "discard" && event.getl(player).cards2.length > 0;
				else {
					const evt = event.getParent("phaseDraw");
					if (evt?.player == player) return false;
					return event.getg(player).length > 0 && player.getCards("h").some(card => player.hasUseTarget(card, false));
				}
			},
			async cost(event, trigger, player) {
				if (trigger.name === "lose") {
					event.result = await player
						.chooseCard("he", [1, player.countCards("he")])
						.set("prompt", `【锐觉】:你可以重铸任意张牌`)
						.set("ai", card => get.value(card, player) < 7)
						.set("filterCard", (card, player) => player.canRecast(card))
						.forResult();
				} else {
					event.result = await player
						.chooseBool()
						.set("prompt", `【锐觉】:你可以使用一张牌（无距离限制且不计入次数限制）`)
						.set("ai", () => {
							let player = get.player();
							return player.getCards("h").some(card => {
								return player.hasUseTarget(card, false) && game.hasPlayer(char => get.effect(char, card, player, player) > 0);
							});
						})
						.forResult();
				}
			},
			async content(event, trigger, player) {
				if (trigger.name === "lose") {
					player.recast(event.cards);
				} else {
					player.chooseToUse().set("prompt", `【锐觉】:请使用一张手牌`).set("addCount", false).set("nodistance", true);
				}
			},
			mod: {
				targetInRange(card, player, target, now) {
					let event = get.event();
					if (event.nodistance) return true;
				},
			},
		},

		//剑兔 近卫阿米娅
		amy_qingyanmrfz: {
			audio: 2,
			trigger: { player: "phaseUseEnd" },
			intro: {
				content: function (event, player) {
					var str = "";
					var list = [
						player.hasSkill("amy_qingyanmrfz_damage"),
						player.hasSkill("amy_qingyanmrfz_time"),
						player.hasSkill("amy_qingyanmrfz_direct"),
					];
					var text = [
						"·你每回合使用的第一张【杀】的伤害基数+1</br>",
						"·你使用【杀】的次数+1</br>",
						"·你使用的【杀】需要两张【闪】才可抵消</br>",
					];
					for (var i = 0; i < list.length; i++) {
						if (list[i]) str = str + text[i];
					}
					return str;
				},
			},
			filter: function (event, player) {
				return !player.storage.amy_qingyanmrfz_time || !player.storage.amy_qingyanmrfz_damage || !player.storage.amy_qingyanmrfz_direct;
			},
			check: function (event, player) {
				return game.hasPlayer(function (current) {
					return current != player && get.attitude(current, player) > 2;
				});
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				result = await player
					.chooseTarget("【青焱】：请选择一名其他角色", true, (card, player, target) => {
						return target !== player;
					})
					.set("ai", target => {
						const aiPlayer = _status.event.player;
						const att = get.attitude(aiPlayer, target);
						return att > 2;
					})
					.forResult();

				// step 1
				if (result.targets) {
					const target = result.targets[0];
					event.target = target;
					const list = [];

					if (!player.storage.amy_qingyanmrfz_time) list.push("你使用【杀】的次数 +1");
					if (!player.storage.amy_qingyanmrfz_damage) list.push("你每回合使用的第一张【杀】的伤害基数 +1");
					if (!player.storage.amy_qingyanmrfz_direct) list.push("你使用的【杀】需要两张【闪】才可抵消");

					if (list.length === 1) {
						if (!player.storage.amy_qingyanmrfz_time) {
							player.storage.amy_qingyanmrfz_time = true;
							target.addSkill("amy_qingyanmrfz_time");
						}
						if (!player.storage.amy_qingyanmrfz_damage) {
							player.storage.amy_qingyanmrfz_damage = true;
							target.addSkill("amy_qingyanmrfz_damage", false);
							target.addMark("amy_qingyanmrfz");
						}
						if (!player.storage.amy_qingyanmrfz_direct) {
							player.storage.amy_qingyanmrfz_direct = true;
							target.addSkill("amy_qingyanmrfz_direct", false);
							target.addMark("amy_qingyanmrfz");
						}
						return;
					} else {
						result = await player
							.chooseControl(list)
							.set("prompt", "请选择删除一句话并令" + get.translation(target) + "获得该效果")
							.set("ai", () => {
								return [0, 1, 2].randomGet();
							})
							.forResult();

						// step 2 logic
						if (result.control === "你使用【杀】的次数 +1") {
							event.target.addMark("amy_qingyanmrfz", 1, false);
							player.storage.amy_qingyanmrfz_time = true;
							event.target.addSkill("amy_qingyanmrfz_time");
						}
						if (result.control === "你每回合使用的第一张【杀】的伤害基数 +1") {
							event.target.addMark("amy_qingyanmrfz", 1, false);
							player.storage.amy_qingyanmrfz_damage = true;
							event.target.addSkill("amy_qingyanmrfz_damage");
						}
						if (result.control === "你使用的【杀】需要两张【闪】才可抵消") {
							event.target.addMark("amy_qingyanmrfz", 1, false);
							player.storage.amy_qingyanmrfz_direct = true;
							event.target.addSkill("amy_qingyanmrfz_direct");
						}
					}
				} else {
					return;
				}
			},
			ai: {
				expose: 0.1,
				threaten: 1.1,
			},
			group: ["amy_qingyanmrfz_damage", "amy_qingyanmrfz_time", "amy_qingyanmrfz_direct"],
			subSkill: {
				direct: {
					audio: "amy_qingyanmrfz",
					trigger: {
						player: "useCardToPlayered",
					},
					forced: true,
					filter: function (event, player) {
						if (player.storage.amy_qingyanmrfz_direct == true && player.hasSkill("amy_qingyanmrfz_mark")) return false;
						//@ts-ignore
						return (
							event.card.name == "sha" && !event.getParent().directHit.includes(event.target) && get.distance(player, event.target) <= 1
						);
					},
					logTarget: "target",
					async content(event, trigger, player) {
						const id = trigger.target.playerid;
						const map = trigger.getParent()?.customArgs;
						if (!map || !id) return;
						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired++;
						} else {
							map[id].shanRequired = 2;
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1)
								return false;
						},
					},
					group: "amy_qingyanmrfz_remove2",
				},
				remove2: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return !player.hasSkill("amy_qingyanmrfz");
					},
					async content(event, trigger, player) {
						player.removeSkill("amy_qingyanmrfz_direct");
						player.removeMark("amy_qingyanmrfz", 1, false);
						game.countPlayer(function (current) {
							if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_direct = false;
							return false;
						});
					},
				},
				time: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return !player.hasSkill("amy_qingyanmrfz");
					},
					async content(event, trigger, player) {
						player.removeMark("amy_qingyanmrfz", 1, false);
						player.removeSkill("amy_qingyanmrfz_time");
						game.countPlayer(function (current) {
							if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_time = false;
							return false;
						});
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha" && (!player.storage.amy_qingyanmrfz || player.hasMark("amy_qingyanmrfz"))) return num + 1;
						},
					},
				},
				damage: {
					audio: "amy_qingyanmrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (player.storage.amy_qingyanmrfz_damage && player.hasSkill("amy_qingyanmrfz_mark")) return false;
						if (player.hasSkill("amy_qingyanmrfz_mark")) return false;
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage++;
						player.addTempSkill("amy_qingyanmrfz_mark", "phaseEnd");
					},
					ai: {
						damageBonus: true,
					},
					group: "amy_qingyanmrfz_remove1",
				},
				remove1: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return !player.hasSkill("amy_qingyanmrfz");
					},
					async content(event, trigger, player) {
						player.removeSkill("amy_qingyanmrfz_damage");
						player.removeMark("amy_qingyanmrfz", 1, false);
						game.countPlayer(function (current) {
							if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_damage = false;
							return false;
						});
					},
				},
				mark: {
					silent: true,
					charlotte: true,
				},
			},
		},
		yingxiaomrfz: {
			audio: 4,
			intro: {
				content: function (event, player) {
					if (player.storage.yingxiaomrfz) return "已发动";
					if (!player.storage.yingxiaomrfz) {
						if (player.countMark("yingxiaomrfz_mark") < 5)
							return "未发动（不满足发动条件）</br>已累计使用" + player.countMark("yingxiaomrfz_mark") + "张【杀】";
						else return "未发动（已满足发动条件）";
					}
				},
			},
			mark: true,
			limited: true,
			animationStr: "影宵",
			animationColor: "gold",
			trigger: { player: "phaseZhunbeiBegin" },
			check: function (event, player) {
				return game.hasPlayer(function (current) {
					return current != player && get.attitude(current, player) < 0 && player.inRange(current);
				});
			},
			init: function (player) {
				player.storage.yingxiaomrfz = false;
			},
			filter: function (event, player) {
				return !player.storage.yingxiaomrfz && player.countMark("yingxiaomrfz_mark") >= 5;
			},
			async content(event, trigger, player) {
				// step 0
				player.storage.yingxiaomrfz = true;
				player.awakenSkill(event.name);
				event.num = 0;

				// step 1 loop (original event.redo())
				while (event.num < 3) {
					if (event.num === 2) {
						player.addTempSkill("yingxiaomrfz_damage", "useCardAfter");
						player.addTempSkill("yingxiaomrfz_wushi", "useCardAfter");
						player.addTempSkill("yingxiaomrfz_total", "useCardAfter");
						await player.chooseUseTarget(
							{
								name: "sha",
								isCard: true,
							},
							"请选择【杀】的目标",
							false
						);
					} else {
						player.addTempSkill("yingxiaomrfz_total", "useCardAfter");
						await player.chooseUseTarget(
							{
								name: "sha",
								nature: event.num === 0 ? "thunder" : "fire",
								isCard: true,
							},
							"请选择" +
								(event.num === 0 ? "雷【杀】" : "火【杀】") +
								"的目标 (下一张使用的牌为：" +
								(event.num === 0 ? "火【杀】" : "伤害基数为翻倍且无视防具的【杀】") +
								")",
							false
						);
						//@ts-ignore
						player.logSkill("yingxiaomrfz");
					}
					event.num++;
				}

				// step 2
				await player.draw(player.countMark("yingxiaomrfz_total"));
				player.addSkill("yingxiaomrfz_handlit");
				player.addSkill("yingxiaomrfz_round2");
			},
			group: "yingxiaomrfz_time",
			subSkill: {
				mark: {
					charlotte: true,
				},
				time: {
					silent: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						return event.card && event.card.name == "sha" && player.countMark("yingxiaomrfz_mark") < 5;
					},
					async content(event, trigger, player) {
						player.addMark("yingxiaomrfz_mark", 1, false);
					},
				},
				damage: {
					forced: true,
					charlotte: true,
					trigger: { player: "useCard2" },
					filter: function (event, player) {
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage += 2;
					},
					ai: {
						damageBonus: true,
					},
				},
				wushi: {
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event) {
						return event.card.name == "sha";
					},
					silent: true,
					logTarget: "target",
					async content(event, trigger, player) {
						trigger.target.addTempSkill("qinggang2");
						trigger.target.storage.qinggang2.add(trigger.card);
						trigger.target.markSkill("qinggang2");
					},
					ai: {
						unequip_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg && arg.name == "sha") return true;
							return false;
						},
					},
				},
				total: {
					silent: true,
					charlotte: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.card.name == "sha";
					},
					async content(event, trigger, player) {
						player.addMark("yingxiaomrfz_total", trigger.num, false);
					},
				},
				handlit: {
					silent: true,
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return num + player.countMark("yingxiaomrfz_total");
						},
					},
				},
				round1: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "roundStart",
					},
					async content(event, trigger, player) {
						player.addMark("yingxiaomrfz_round1", 1, false);
						if (player.countMark("yingxiaomrfz_round1") > 2) {
							player.removeSkill("yingxiaomrfz_round2");
							player.removeMark("yingxiaomrfz_round1", player.countMark("yingxiaomrfz_round1"), false);
						}
					},
				},
				round2: {
					audio: "yingxiaomrfz",
					trigger: { source: "damageBefore" },
					forced: true,
					charlotte: true,
					mark: true,
					intro: {
						content: function (event, player) {
							return "你造成的伤害均视为体力流失</br>效果剩余时间：" + (2 - player.countMark("yingxiaomrfz_round1")) + "轮";
						},
					},
					check: function () {
						return false;
					},
					async content(event, trigger, player) {
						trigger.cancel();
						trigger.player.loseHp(trigger.num);
					},
					ai: {
						jueqing: true,
					},
					group: "yingxiaomrfz_round1",
				},
			},
		},
		//芙兰卡
		jifengmrfz: {
			audio: 2,
			trigger: {
				player: "useCard2",
			},
			filter: function (event, player) {
				if (event.targets && event.targets.length > 1) return false;
				return event.cards && event.card.name == "sha";
			},
			check: function (event, player) {
				return get.attitude(player, event.targets[0]) < 0;
			},
			prompt: function (event, player) {
				var target = event.targets[0],
					list = [];
				if (!target.hasEmptySlot(2)) list.push("无视防具");
				if (target.countCards("h") > 0) list.push("此【杀】需要两张闪才可抵消");
				if (target.hujia > 0) list.push("无视护甲");
				return "【极锋】:是否对" + get.translation(target) + "发动‘极锋’？（" + list + "）";
			},
			async content(event, trigger, player) {
				var target = trigger.targets[0],
					num = 0;
				if (!target.hasEmptySlot(2)) {
					num++;
					target.addTempSkill("qinggang2");
					target.storage.qinggang2.add(trigger.card);
					target.markSkill("qinggang2");
				}
				if (target.countCards("h") > 0) {
					num++;
					player.addTempSkill("jifengmrfz_sha");
					player.storage.jifengmrfz = {
						card: trigger.card,
					};
				}
				if (target.hujia > 0) {
					target.addTempSkill("jifengmrfz_ighujia");
					target.storage.jifengmrfz_ighujia.add(trigger.card);
					target.markSkill("jifengmrfz_ighujia");
					num++;
				}
				if (!player.hasSkill("jifengmrfz_used")) {
					player.addTempSkill("jifengmrfz_used", "phaseEnd");
					player.draw(3 - num);
				}
			},
			subSkill: {
				sha: {
					trigger: {
						player: "useCardToPlayered",
					},
					forced: true,
					silent: true,
					filter: function (event, player) {
						var info = player.storage.jifengmrfz;
						if (!event.card || event.card != info.card) return false;
						//@ts-ignore
						return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
					},
					logTarget: "target",
					async content(event, trigger, player) {
						const id = trigger.target.playerid;
						const map = trigger.getParent()?.customArgs;

						if (!map || !id) return;

						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired++;
						} else {
							map[id].shanRequired = 2;
						}
						delete player.storage.jifengmrfz;
						player.removeSkill("jifengmrfz_sha");
					},
					ai: {
						directHit_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1)
								return false;
						},
					},
				},
				used: {
					charlotte: true,
				},
				ighujia: {
					ai: {
						nohujia: true,
					},
					init: function (player, skill) {
						if (!player.storage[skill]) player.storage[skill] = [];
					},
					onremove: true,
					trigger: {
						player: ["damage", "damageCancelled", "damageZero"],
						source: ["damage", "damageCancelled", "damageZero"],
						target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
						global: ["useCardEnd"],
					},
					charlotte: true,
					firstDo: true,
					filter: function (event, player) {
						return (
							player.storage.jifengmrfz_ighujia &&
							event.card &&
							player.storage.jifengmrfz_ighujia.includes(event.card) &&
							(event.name != "damage" || event.notLink())
						);
					},
					silent: true,
					forced: true,
					popup: false,
					priority: 12,
					async content(event, trigger, player) {
						player.storage.jifengmrfz_ighujia.remove(trigger.card);
						if (!player.storage.jifengmrfz_ighujia.length) player.removeSkill("jifengmrfz_ighujia");
					},
					marktext: "✘",
					intro: {
						name: "✘",
						content: "当前护甲已失效",
					},
				},
			},
			ai: {
				threaten: 1.2,
			},
		},
		xiqiaomrfz: {
			audio: 2,
			trigger: {
				player: ["chooseToRespondBegin", "chooseToUseBegin"],
			},
			filter: function (event, player) {
				if (player.hasSkill("xiqiaomrfz_used")) return false;
				if (event.responded) return false;
				if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) return false;
				if (event.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) return false;
				return true;
			},
			check: () => true,
			async content(event, trigger, player) {
				player.addTempSkill("xiqiaomrfz_used", "phaseEnd");
				const next = player.chooseToDiscard("he", true);
				next.set("prompt", "【细巧】:你可以弃置一张牌，然后摸一张牌并展示之，若类型不同，视为使用或打出一张【闪】");

				const result = await next.forResult();

				if (!result.cards) return;

				let cardl = result.cards[0];

				const { cards } = await player.draw("visible").forResult();

				if (!cards) return;
				let card = cards[0];

				if (get.type2(card) != get.type2(cardl)) {
					trigger.untrigger();
					trigger.set("responded", true);
					trigger.result = { bool: true, card: { name: "shan", isCard: true } };
				}
			},
			subSkill: {
				used: {
					charlotte: true,
				},
			},
			ai: {
				respondShan: true,
				threaten: 0.8,
			},
		},
		//D32 星极
		tianyimrfz: {
			audio: 2,
			mark: true,
			locked: false,
			zhuanhuanji: true,
			marktext: "☯",
			init: function (player, skill) {
				player.storage[skill] = true;
			},
			intro: {
				content: function (storage, player, skill) {
					if (player.storage.tianyimrfz == true) return "观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底"; //阳
					return "进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）"; //阴
				},
			},
			trigger: { global: "phaseJudgeBegin" },
			prompt: function (event, player) {
				if (player.storage.tianyimrfz == true)
					var str = "观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底"; //阳
				else var str = "进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）"; //阴
				return "【天仪】:你可以" + str;
			},
			async callback(event, trigger, player) {
				if (event.judgeResult.suit == "club") {
					if (player.countMark("tianyimrfz_shacount") < 3) player.addMark("tianyimrfz_shacount", 1, false);
				}
				player.gain(event.card, "gain2").gaintag.add("tianyimrfz");
				player.addTempSkill("tianyimrfz_remove", "phaseEnd");
			},
			async content(event, trigger, player) {
				if (player.storage.tianyimrfz) await player.chooseToGuanxing(2);
				else
					await player
						.judge(function (card) {
							if (get.suit(card) == "club") return 0;
							return -4;
						})
						.set("callback", lib.skill.tianyimrfz.callback);
				player.changeZhuanhuanji("tianyimrfz");
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("tianyimrfz_shacount");
				},
			},
			subSkill: {
				shacount: {
					charlotte: true,
					intro: {
						content: "使用【杀】的次数+#",
					},
				},
				remove: {
					onremove: function (player) {
						player.removeGaintag("tianyimrfz");
					},
					charlotte: true,
					mod: {
						cardname: function (card, player, name) {
							if (card.hasGaintag("tianyimrfz")) return "shan";
						},
					},
				},
			},
		},
		huijianmrfz: {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (!event.targets || event.targets.length > 1) return false;
				if (!player.hasUseTarget(event.card, true, false)) return false;
				if (!player.isPhaseUsing()) return false;
				if (player.getCardUsable("sha") < 1) return false;
				//@ts-ignore
				return get.type(event.card) == "trick" || get.type(event.card) == "basic";
			},
			usable: 1,
			direct: true,
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(
						[1, player.getCardUsable("sha")],
						get.prompt("huijianmrfz"),
						"为" + get.translation(trigger.card) + "增加至多" + player.getCardUsable("sha") + "个目标",
						function (card, player, target) {
							return !_status.event.sourcex.includes(target) && player.canUse(_status.event.card, target);
						}
					)
					.set("sourcex", trigger.targets)
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.effect(target, _status.event.card, player, player);
					})
					.set("card", trigger.card)
					.setHiddenSkill(event.name)
					.forResult();

				if (result.targets) {
					if (!event.isMine() && !event.isOnline()) game.delayx();
					for (var i = 0; i < result.targets.length; i++) {
						trigger.targets.push(result.targets[i]);
						player.line(result.targets[i]);
					}
					//@ts-ignore
					player.logSkill("huijianmrfz");
					player.addMark("huijianmrfz_minus", result.targets.length, false);
					player.addTempSkill("huijianmrfz_minus", "phaseUseAfter");
				} else {
					player.storage.counttrigger.huijianmrfz--;
				}
			},
			subSkill: {
				minus: {
					onremove: function (player) {
						player.removeMark("huijuanmrfz_minus", player.countMark("huijuanmrfz_minus"), false);
					},
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num - player.countMark("huijianmrfz_minus");
						},
					},
				},
			},
		},
		bingmingmrfz: {
			audio: 2,
			trigger: { global: "roundStart" },
			filter: function (event, player) {
				if (
					!game.findPlayer(function (current) {
						return current.name == "xingyuanmrfz";
					})
				)
					return false;
				return game.roundNumber == 2;
			},
			forced: true,
			async content(event, trigger, player) {
				const target = game.findPlayer(function (current) {
					return current.name == "xingyuanmrfz";
				});
				if (!target) return;
				const num1 = player.countCards("h") - target.countCards("h");
				const num2 = player.getHandcardLimit() - target.getHandcardLimit();
				if (num1 > 0) {
					player.chooseToDiscard(true, "【病鸣】:请将手牌调整至" + num1, num1);
					//@ts-ignore
				} else if (num1 < 0) player.drawTo(-num1);
				if (num2 != 0) {
					player.addMark("bingmingmrfz", Math.abs(num2), false);
				}
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + player.countMark("bingmingmrfz");
				},
			},
		},
		//星源
		daoliumrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 2,
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			check: function (card) {
				return 6 - get.value(card);
			},
			filterCard: true,
			selectCard: 1,
			filterTarget: function (card, player, target) {
				return target != player;
			},
			selectTarget: 1,
			lose: false,
			discard: false,
			async content(event, trigger, player) {
				const target = event.target;
				const cards = event.cards;

				// step 0
				event.targetx = target;
				event.targets = [];
				event.discard = [];
				event.discard.push(target);
				//@ts-ignore
				if (target.getNext()) event.targets.push(target.getNext());
				//@ts-ignore
				if (target.getPrevious()) event.targets.push(target.getPrevious());
				if (event.targets.includes(player)) event.targets.remove(player);
				await player.give(cards, target);

				// step 1 & 2 loop (original event.goto(1))
				while (event.targets.length && event.targetx.countCards("he") > 0) {
					const currentTarget = event.target[0];
					const result = await event.targetx
						.chooseCard("【导流】:请交给" + get.translation(currentTarget) + "一张牌", "he")
						.set("forced", true)
						.forResult();

					if (result.cards && result.cards.length) {
						const card = result.cards[0];
						await event.targetx.give(card, currentTarget);
						event.discard.push(currentTarget);
					}
					event.targets.shift();
				}

				// step 3 loop (original event.redo())
				while (event.discard.length) {
					const discardTarget = event.discard[0];
					if (discardTarget.countCards("he") > 0) {
						await discardTarget.chooseToDiscard("he", true, "【导流】:请弃置一张牌");
					}
					event.discard.shift();
				}
			},
			ai: {
				order: 4,
				expose: 0.1,
				result: {
					target: function (player, target) {
						var pre = target.getPrevious(),
							net = target.getNext(),
							num = 0;
						if (game.players.length == 2) return 0;
						if (get.attitude(pre, player) > 2 && get.attitude(net, player) > 2) return 0;
						return -1;
					},
				},
			},
		},
		gewumrfz: {
			audio: 2,
			trigger: {
				global: "gainEnd",
			},
			filter: function (event, player) {
				return event.source && event.source.isIn() && event.source == player && event.cards.length >= 1;
			},
			direct: true,
			logTarget: "source",
			async content(event, trigger, player) {
				if (player.countMark("gewumrfz") < 5) {
					player.addMark("gewumrfz", 1, false);
					//@ts-ignore
					player.logSkill("gewumrfz");
				}
				for (var i = 0; i < trigger.cards.length; i++) {
					if (!player.getStorage("gewumrfz_mark").includes(trigger.cards[i].name)) {
						player.markAuto("gewumrfz_mark", [trigger.cards[i].name]);
						if (player.storage.gewumrfz_mark.length % 2 == 0) {
							player.draw();
							//@ts-ignore
							player.logSkill("gewumrfz");
						}
						if (player.storage.gewumrfz_mark.length % 4 == 0) {
							player.addMark("gewumrfz_draw", 1, false);
							//@ts-ignore
							player.logSkill("gewumrfz");
						}
					}
				}
			},
			mod: {
				maxHandcard: function (player, num) {
					return num + player.countMark("gewumrfz");
				},
			},
			group: ["gewumrfz_mark", "gewumrfz_draw"],
			subSkill: {
				mark: {
					intro: {
						content: function (event, player) {
							return (
								"记录的牌名：" +
								get.translation(player.storage.gewumrfz_mark) +
								"</br>" +
								(player.countMark("gewumrfz_draw") > 0 ? "额定摸牌数+" + player.countMark("gewumrfz_draw") : "")
							);
						},
					},
					onremove: true,
					charlotte: true,
				},
				draw: {
					audio: "gewumrfz",
					forced: true,
					charlotte: true,
					trigger: { player: "phaseDrawBegin2" },
					filter: function (event, player) {
						return player.countMark("gewumrfz_draw") > 0;
					},
					async content(event, trigger, player) {
						trigger.num += player.countMark("gewumrfz_draw");
					},
				},
			},
		},
		//战车
		jiqiangmrfz: {
			audio: 2,
			derivation: ["DP27mrfz"],
			trigger: { global: "roundStart" },
			forced: true,
			filter: function (event, player) {
				return !player.isDisabled(1) && (event.name != "phase" || game.phaseNumber == 0);
			},
			async content(event, trigger, player) {
				const card = game.createCard("DP27mrfz", "diamond", 13);
				player.$gain2(card);
				game.delayx();
				player.equip(card);
			},
			group: "jiqiangmrfz_get",
			subSkill: {
				get: {
					audio: "jiqiangmrfz",
					forced: true,
					trigger: { player: "phaseZhunbeiBegin" },
					filter: function (event, player) {
						return (
							!player.isDisabled(1) &&
							player.getCards("e", function (card) {
								return get.name(card) == "DP27mrfz";
							}).length == 0
						);
					},
					async content(event, trigger, player) {
						const card = game.createCard("DP27mrfz", "diamond", 13);
						player.$gain2(card);
						game.delayx();
						player.equip(card);
					},
				},
			},
		},
		qingxiemrfz: {
			audio: 2,
			trigger: { player: "phaseDrawEnd" },
			firstDo: true,
			filter: function (event, player) {
				if (player.skipList.includes("phaseUse")) return false;
				return (
					game.countPlayer(function (current) {
						return player.inRangeOf(current) && current != player;
					}) > 0
				);
			},
			check: function (event, player) {
				if (get.value(player.getCards("h")) >= 10) return false;
				if (
					game.countPlayer(function (current) {
						return player.inRangeOf(current) && current != player && get.attitude(player, current) < 0;
					}) < 1
				)
					return false;
				return true;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				const next = player.chooseTarget("【倾泻】:请选择一名攻击范围内的其他角色", true, (card, target, player) => {
					return target !== player && player.inRangeOf(target);
				});
				next.ai = target => {
					return get.effect(target, { name: "sha" }, _status.event.player);
				};
				result = await next.forResult();

				event.num = 0;
				event.skip = 0;

				// step 1
				if (result.targets && result.targets.length) {
					event.target = result.targets[0];
				} else {
					return;
				}

				// step 2 & 3 loop (original event.goto(2))
				while (event.num < 3) {
					// step 2
					if (!event.target.isAlive()) {
						break;
					}

					const judgeEvent = player.judge(card => {
						const color = get.color(card);
						if (color === "red") return 4;
						return -4;
					});
					result = await judgeEvent.forResult();

					// step 3
					if (result.color === "red") {
						await player.useCard({ name: "sha", isCard: true }, false, event.target);
						event.skip++;
					}
					event.num++;
				}

				// step 4
				if (event.skip > 1) {
					player.skip("phaseUse");
				}
			},
		},
		//闪盾 闪击
		shandunmrfz: {
			mod: {
				globalFrom: function (from, to, distance) {
					if (from.isAction()) return distance - 1;
					return distance + 1;
				},
				globalTo: function (from, to, distance) {
					if (!to.isAction()) return distance + 1;
					return distance - 1;
				},
			},
		},
		xuanmumrfz: {
			audio: 2,
			trigger: { player: "useCard2" },
			filter: function (event, player) {
				if (player.storage.xuanmumrfz_roundcount >= 4) return false;
				if (!event.targets || event.targets.length > 1) return false;
				if (get.distance(player, event.targets[0]) > 1) return false;
				if (event.targets[0].countCards("h") < 1) return false;
				//@ts-ignore
				const type = get.type(event.card);
				return event.targets[0] != player && (type == "basic" || type == "trick");
			},
			check: function (event, player) {
				return get.attitude(event.targets[0], player) < 0;
			},
			async content(event, trigger, player) {
				if (!player.storage.xuanmumrfz_roundcount) player.storage.xuanmumrfz_roundcount = 0;
				player.storage.xuanmumrfz_roundcount++;
				const result = await player.choosePlayerCard(trigger.targets[0], true, "h").forResult();
				("step 1");
				if (result.cards) {
					const card = result.cards[0];
					//@ts-ignore
					player.showCards(card, get.translation(player) + "对" + get.translation(trigger.target) + "发动了【炫目】");

					if (!canRespond(trigger.card, card)) {
						//@ts-ignore
						trigger.directHit.addArray(
							game.filterPlayer(function (current) {
								return current != player && current == trigger.targets[0];
							})
						);
						if (trigger.targets[0].countGainableCards(player, "h")) {
							player.gainPlayerCard("h", trigger.targets[0], true);
						}
						if (Math.random() < 0.25) trigger.targets[0].chat("有闪盾！");
					}
				}

				function canRespond(card1, card2) {
					/**@ts-ignore */
					var info1 = get.name(card1),
						/** @ts-ignore */
						info2 = get.name(card2);
					var tmp_bool = false;
					if ((info1 == "sha" || info1 == "wanjian") && info2 == "shan") tmp_bool = true;
					if ((info1 == "juedou" || info1 == "nanman") && info2 == "sha") tmp_bool = true;
					/**@ts-ignore */
					if (get.type(card1) == "trick" && info2 == "wuxie") tmp_bool = true;
					var str = (tmp_bool == true ? "" : "不") + "能响应";
					info1 = "<font color=rgb(255,255,122)>【" + get.translation(info1) + "】</font>";
					info2 = "<font color=rgb(255,255,122)>【" + get.translation(info2) + "】</font>";
					game.log(info2, str, info1);
					return tmp_bool;
				}
			},
			group: "xuanmumrfz_roundcount",
			subSkill: {
				roundcount: {
					mark: true,
					init: player => {
						player.storage.xuanmumrfz_roundcount = 0;
						player.markSkill("xuanmumrfz_roundcount");
					},
					onremove: true,
					intro: {
						content: function (event, player) {
							return player.storage.xuanmumrfz_roundcount + "/4";
						},
						markcount: function (event, player) {
							if (!player.storage.xuanmumrfz_roundcount) return 4;
							return 4 - player.storage.xuanmumrfz_roundcount;
						},
					},
					trigger: {
						global: "roundStart",
					},
					forced: true,
					popup: false,
					silent: true,
					async content(event, trigger, player) {
						player.storage.xuanmumrfz_roundcount = 0;
					},
				},
			},
		},
		chuandunmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "damageEnd" },
			async content(event, trigger, player) {
				const result = await player.draw("visible").forResult();

				if (result.cards) {
					var card = result.cards[0];
					if ((card.suit == "heart" || card.suit == "spade") && card.number == 6) {
						player.loseHp(player.hp);
					}
				}
			},
		},

		//霜华 夹子妹
		tadianmrfz: {
			markimage: "extension/WhichWay/image/orther/shuanghuajiazimrfz.png",
			intro: {
				markcount: "expansion",
				mark: function (dialog, content, player) {
					content = player.getExpansions("tadianmrfz");
					if (content && content.length) {
						if (player == game.me || player.isUnderControl()) {
							dialog.addAuto(content);
						} else {
							return "共有" + get.cnNumber(content.length) + "张踏垫";
						}
					}
				},
				content: function (content, player) {
					content = player.getExpansions("tadianmrfz");
					if (content && content.length) {
						if (player == game.me || player.isUnderControl()) {
							return get.translation(content);
						}
						return "共有" + get.cnNumber(content.length) + "张踏垫";
					}
				},
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 2,
			trigger: { global: "roundStart" },
			forced: true,
			async content(event, trigger, player) {
				if (player.getExpansions("tadianmrfz").length > 0) {
					await player.gain(player.getExpansions("tadianmrfz"), "gain2");
				}

				await player.draw(3);
				const result = await player
					.chooseCard(true, 3, "【踏垫】:请选择将三张手牌置于你武将牌上")
					.set("ai", function (card) {
						return 8 - get.value(card);
					})
					.forResult();

				if (result.cards) {
					player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("tadianmrfz");
				}
			},
			group: "tadianmrfz_tri",
			subSkill: {
				rec: {
					trigger: { player: "dyingAfter" },
					silent: true,
					charlotte: true,
					async content(event, trigger, player) {
						player.recover();
						player.removeSkill("tadianmrfz_rec");
					},
				},
				tri: {
					audio: "tadianmrfz",
					trigger: {
						target: "useCardToTargeted",
					},
					filter: function (event, player) {
						if (!event.card || player.getExpansions("tadianmrfz").length < 1) return false;
						return (
							player.getExpansions("tadianmrfz").filter(function (magic) {
								return magic.name == event.card.name;
							}).length > 0
						);
					},
					check: function (event, player) {
						return get.attitude(player, event.player) < 0;
					},
					prompt: function (event, player) {
						return "【踏垫】:是否弃置一张‘踏垫’，令" + get.translation(event.player) + "流失所有体力？";
					},
					async content(event, trigger, player) {
						//@ts-ignore
						const cards = player.getExpansions("tadianmrfz").filter(function (magic) {
							return get.name(magic) == get.name(trigger.card);
						});
						if (!cards.length) return;
						const result = await player
							.chooseButton(["你可以选择移去一张与其使用的牌的牌名相同的“踏垫”，令其流失所有体力", cards])
							.forResult();

						if (result.links) {
							player.loseToDiscardpile(result.links);
							player.draw(3);
							trigger.player.loseHp(trigger.player.hp);
							trigger.player.addSkill("tadianmrfz_rec");
						}
					},
				},
			},
		},
		xinjimrfz: {
			audio: 2,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			direct: true,
			filter: function (event, player) {
				return player.getExpansions("tadianmrfz").length > 0 && player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const cards = player.getExpansions("tadianmrfz");
				if (!cards.length || !player.countCards("h")) {
					return;
				}
				const next = player.chooseToMove("【踏垫】：是否交换“踏垫”和手牌？");
				next.set("list", [
					[get.translation(player) + "（你）的‘踏垫’", cards],
					["手牌区", player.getCards("h")],
				]);
				next.set("filterMove", function (from, to) {
					return typeof to != "number";
				});
				next.set("processAI", function (list) {
					var player = _status.event.player,
						cards = list[0][1].concat(list[1][1]).sort(function (a, b) {
							return get.value(a) - get.value(b);
						}),
						cards2 = cards.splice(0, player.getExpansions("tadianmrfz").length);
					return [cards2, cards];
				});

				const result = await next.forResult();

				if (result.moved) {
					var pushs = result.moved[0],
						gains = result.moved[1];
					pushs.removeArray(player.getExpansions("tadianmrfz"));
					gains.removeArray(player.getCards("h"));
					if (!pushs.length || pushs.length != gains.length) return;
					//@ts-ignore
					player.logSkill("tadianmrfz");
					player.addToExpansion(pushs, player, "giveAuto").gaintag.add("tadianmrfz");
					game.log(player, "交换了手牌区与‘踏垫’的牌");
					player.gain(gains, "draw");
				}
			},
		},
		//柏喙
		yirenmrfz: {
			audio: 4,
			chargeGet: 1,
			chargeSkill: true,
			forced: true,
			onremove: true,
			trigger: {
				player: "phaseJieshuBegin",
			},
			filter: function (event, player) {
				var num = 0;
				var history = player.getHistory("useCard");
				for (var i = 0; i < history.length; i++) {
					//@ts-ignore
					if (history[i].card.name == "sha" && history[i].isPhaseUsing()) {
						num++;
					}
				}
				if (player.countMark("charge") + player.getCardUsable("sha") - num >= 15) return false;
				return player.getCardUsable("sha") - num > 0;
			},
			async content(event, trigger, player) {
				var num = 0;
				var history = player.getHistory("useCard");
				for (var i = 0; i < history.length; i++) {
					//@ts-ignore
					if (history[i].card.name == "sha" && history[i].isPhaseUsing()) {
						num++;
					}
				}
				num = player.getCardUsable("sha") - num;
				num = Math.min(num, 15 - player.countMark("charge"));
				player.addMark("charge", num);
			},
			group: "yirenmrfz_use",
			subSkill: {
				lim: {
					silent: true,
					charlotte: true,
					onremove: true,
					intro: {
						content: "下回合使用【杀】的次数-#",
					},
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num - player.countMark("yirenmrfz_lim");
						},
					},
				},
				use: {
					init: (player, skill) => (player.storage[skill] = 1),
					audio: "yirenmrfz",
					enable: "phaseUse",
					filter: function (event, player) {
						if (player.countMark("charge") < player.storage.yirenmrfz_use) return false;
						if (player.countCards("h") < 2) return false;
						return game.hasPlayer(function (current) {
							return current != player && !!player.canUse("sha", current);
						});
					},
					selectCard: 2,
					position: "h",
					filterCard: true,
					selectTarget: [1, 2],
					filterTarget: function (card, player, target) {
						return player.canUse("sha", target) === true && target != player;
					},
					multitarget: true,
					multiline: true,
					check: function (card) {
						return 8 - get.value(card);
					},
					prompt: "【异刃】：请弃置两张手牌并选择至多两名角色",
					async content(event, trigger, player) {
						for (let i of event.targets) {
							if (player.canUse("sha", i)) player.useCard({ name: "sha", isCard: true }, i, false);
							i.addTempSkill("yirenmrfz_lim", { player: "phaseEnd" });
							i.addMark("yirenmrfz_lim", 1, false);
						}
						player.removeMark("charge", player.storage.yirenmrfz_use);
						player.storage.yirenmrfz_use++;
					},
					ai: {
						order: function (item, player) {
							if (player.hasSkillTag("presha", true, null, true)) return 10;
							if (game.hasNature(item, "linked")) {
								if (
									game.hasPlayer(function (current) {
										return (
											current != player &&
											current.isLinked() &&
											player.canUse(item, current, undefined, true) &&
											get.effect(current, item, player, player) > 0 &&
											lib.card.sha.ai.canLink(player, current, item)
										);
									}) &&
									game.countPlayer(function (current) {
										//@ts-ignore
										return current.isLinked() && get.damageEffect(current, player, player, get.nature(item)) > 0;
									}) > 1
								)
									return 3.1;
								return 3;
							}
							return 3.05;
						},
						result: {
							target: function (player, target) {
								var enemyIR = game.filterPlayer(function (current) {
									return current != player && get.attitude(player, current) < 0 && !!player.canUse("sha", current);
								});
								if (enemyIR.length < 1) return 0;
								else if (enemyIR.length == 1) {
									if (target.hp <= 2) return -4;
								}
								return -1;
							},
						},
					},
				},
			},
		},
		shehunmrfz: {
			trigger: {
				source: "damageEnd",
			},
			intro: {
				content: "使用【杀】的次数+#",
			},
			onremove: true,
			forced: true,
			popup: false,
			filter: function (event, player) {
				return player.countMark("shehunmrfz") < 5;
			},
			async content(event, trigger, player) {
				var mark = player.countMark("shehunmrfz");
				var num = trigger.num;
				if (mark + num > 5) var add = 5 - mark;
				else var add = num;
				player.addMark("shehunmrfz", add, false);
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (card.name == "sha") return num + player.countMark("shehunmrfz");
				},
			},
		},
		//白面鸮
		jinaomrfz: {
			audio: 2,
			mark: true,
			marktext: "机脑",
			intro: {
				content: function (event, player) {
					var storage = player.storage.jinaomrfz;
					if (storage == true) return "递增";
					if (storage == false) return "递减";
					return "无限制";
				},
			},
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				var history = player.getHistory("useCard");
				if (history.indexOf(event) != 1) return false;
				return history[0].card.number != undefined && history[1].card.number != undefined;
			},
			direct: true,
			async content(event, trigger, player) {
				var history = player.getHistory("useCard");
				if (history[0].card.number < history[1].card.number) {
					player.storage.jinaomrfz = true;
					player.marks.jinaomrfz.innerText = "递增";
				} else {
					player.storage.jinaomrfz = false;
					player.marks.jinaomrfz.innerText = "递减";
				}
				player.storage.jinaomrfz_lim = history[1].card.number;
				player.addTempSkill("jinaomrfz_lim", "phaseEnd");
			},
			group: ["jinaomrfz_draw"],
			subSkill: {
				handlit: {
					onremove: true,
					charlotte: true,
					intro: {
						content: "手牌上限+#",
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + player.countMark("jinaomrfz_handlit");
						},
					},
				},
				draw: {
					trigger: { player: "useCardAfter" },
					lastDo: true,
					forced: true,
					audio: "jinaomrfz",
					filter: function (event, player) {
						var history = player.getHistory("useCard");
						if (history.length < 2) return false;
						if (!history[history.length - 2].card.color || get.color(event.card) == "none") return false;
						//console.log(history[history.length-2].card.color);console.log(get.color(event.card));
						return history[history.length - 2].card.color == get.color(event.card);
					},
					async content(event, trigger, player) {
						var color = get.color(trigger.card);
						if (color == "red") player.draw(2);
						else {
							player.addTempSkill("jinaomrfz_handlit", "phaseEnd");
							player.addMark("jinaomrfz_handlit", 1, false);
						}
					},
				},
				lim: {
					onremove: function (player) {
						//@ts-ignore
						if (player.marks?.jinaomrfz?.text?.innerText) player.marks.jinaomrfz.text.innerText = "机脑";
						delete player.storage.jinaomrfz;
						delete player.storage.jinaomrfz_lim;
					},
					direct: true,
					charlotte: true,
					trigger: { player: "useCardAfter" },
					firstDo: true,
					filter: function (event, player) {
						if (!event.card.number) return false;
						return true;
					},
					async content(event, trigger, player) {
						player.storage.jinaomrfz_lim = trigger.card.number;
						var cards = player.getCards("h");
						let max = 0,
							min = 0,
							num = 0;
						for (var i = 0; i < cards.length; i++) {
							//@ts-ignore
							if (typeof cards[i].number === "number") num = cards[i].number;
							if (i == 0) {
								max = num;
								min = num;
								continue;
							}
							if (num > max) max = num;
							if (min > num) min = num;
						}
						if (trigger.card.number >= max) {
							player.storage.jinaomrfz = false;
							//@ts-ignore
							player.marks.jinaomrfz.text.innerText = "递减";
							player.draw();
							//@ts-ignore
							player.logSkill("jinaomrfz");
						}
						if (trigger.card.number <= min) {
							player.storage.jinaomrfz = true;
							//@ts-ignore
							player.marks.jinaomrfz.text.innerText = "递增";
							player.draw();
							//@ts-ignore
							player.logSkill("jinaomrfz");
						}
					},
					mod: {
						cardEnabled2: function (card, player) {
							if (player.storage.jinaomrfz == true) {
								if (card.number && card.number <= player.storage.jinaomrfz_lim) return false;
							} else {
								if (card.number && card.number >= player.storage.jinaomrfz_lim) return false;
							}
						},
					},
				},
			},
		},
		wutaimrfz: {
			audio: 2,
			trigger: { player: "phaseEnd" },
			direct: true,
			filter: function (event, player) {
				var cards = player.getCards("h");
				if (cards.length < 2) return false;
				for (var i = 0; i < cards.length; i++) {
					if (i == 0) {
						var tmp_cards = cards[i];
						continue;
					}
					//@ts-ignore
					if (get.type2(tmp_cards) != get.type2(cards[i])) return true;
					//@ts-ignore
					if (get.color(tmp_cards) != get.color(cards[i])) return true;
					tmp_cards = cards[i];
				}
				return false;
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseToDiscard(
						2,
						"h",
						false,
						"【五肽】：你可以弃置两张类型或颜色不相同的手牌并选择一名角色，直到你的下个回合开始，其每回合第一次受到的伤害-1",
						function (card) {
							if (ui.selected.cards.length == 0) return true;
							if (ui.selected.cards.length) {
								return (
									get.type2(card, player) != get.type2(ui.selected.cards[0], player) ||
									get.color(card, player) != get.color(ui.selected.cards[0], player)
								);
							}
							return false;
						}
					)
					.set("complexCard", true)
					.set("ai", function (card) {
						return 10 - get.value(card);
					})
					.forResult();

				if (result.bool) {
					const { targets } = await player
						.chooseTarget("【五肽】：请选择一名角色", true, function (card, player, target) {
							return !target.hasSkill("wutaimrfz_eff");
						})
						.set("ai", target => {
							let att = get.attitude(get.player(), target);
							if (target.hp < 3) att /= 1.5;
							return att;
						})
						.forResult();
					if (targets) {
						//@ts-ignore
						player.logSkill("wutaimrfz_eff", targets[0]);
						player.addTempSkill("wutaimrfz_eff", { player: "phaseBegin" });
						player.storage.wutaimrfz_eff = targets[0];
					}
				}
			},
			subSkill: {
				mark: {
					charlotte: true,
				},
				eff: {
					onremove: true,
					audio: "wutaimrfz",
					mark: true,
					intro: {
						content: function (event, player) {
							var char = get.translation(player.storage.wutaimrfz_eff);
							if (player.hasSkill("wutaimrfz_mark")) return "本回合" + char + "已触发过此效果";
							return char + "受到的伤害-1";
						},
					},
					trigger: {
						global: "damageBegin",
					},
					forced: true,
					charlotte: true,
					logTarget: "player",
					filter: function (event, player) {
						if (player.hasSkill("wutaimrfz_mark")) return false;
						return event.player == player.storage.wutaimrfz_eff;
					},
					async content(event, trigger, player) {
						player.addTempSkill("wutaimrfz_mark", "phaseEnd");
						trigger.num--;
					},
				},
			},
		},
		//刺玫
		huabumrfz: {
			audio: 2,
			global: "huabumrfz_eff",
			subSkill: {
				eff: {
					enable: "phaseUse",
					usable: 1,
					filter: function (event, player) {
						return (
							!player.hasSkill("huabumrfz") &&
							game.hasPlayer(current => {
								return current.hasSkill("huabumrfz");
							})
						);
					},
					async content(event, trigger, player) {
						let result, target;

						// step 0
						const targets = game.filterPlayer(current => {
							return current.hasSkill("huabumrfz");
						});

						if (targets.length === 1) {
							//@ts-ignore
							player.logSkill("huabumrfz", targets);
							target = targets[0];
							// goto 2: skip target selection, proceed to draw
						} else if (targets.length > 1) {
							result = await player
								.chooseTarget(true, "选择【花卜】的目标", (card, player, target) => {
									return _status.event.list.includes(target);
								})
								.set("list", targets)
								.set("ai", target => {
									const aiPlayer = _status.event.player;
									return get.attitude(aiPlayer, target);
								})
								.forResult();

							// step 1
							if (result.targets && result.targets.length) {
								//@ts-ignore
								player.logSkill("huabumrfz", result.targets);
								target = result.targets[0];
							} else {
								return;
							}
						} else {
							return;
						}

						// step 2
						if (target) {
							result = await target.draw().forResult();
						} else {
							return;
						}

						// step 3
						if (result && result.cards && result.cards.length) {
							const card = result.cards[0];
							const cards = player.getCards("h");
							let bool = false;
							for (const c of cards) {
								if (get.type2(c) === get.type2(card)) {
									bool = true;
									break;
								}
							}
							event.is = bool;

							result = await target
								.chooseControl("有", "没有")
								.set(
									"prompt",
									"【花卜】:" +
										get.translation(player) +
										"手牌中是否有与" +
										get.translation(card) +
										"(" +
										get.translation(get.type2(card)) +
										")" +
										"类型相同的牌？"
								)
								.set("ai", () => {
									const aiPlayer = _status.event.player;
									const is = _status.event.is;
									const aiTarget = _status.event.target;
									const answer = is === true ? "有" : "没有";
									if (get.attitude(aiPlayer, aiTarget) > 0 && aiTarget.hasSkill("shixinmrfz")) return answer;
									else if (aiTarget.hasSkill("shixinmrfz")) return answer === "有" ? "没有" : "有";
									return ["有", "没有"].randomGet();
								})
								.set("is", event.is)
								.set("target", target)
								.forResult();
						} else {
							return;
						}

						// step 4
						if (result.control) {
							const bool = result.control === "有";
							if (event.is === bool) {
								await player.draw();
								await target.draw();
							} else {
								await target.chooseToDiscard("【花卜】:请选择弃置一张牌", true);
							}
						}
					},
					ai: {
						order: 13,
						threaten: 1.5,
						result: {
							player: function (player, target) {
								target =
									game.findPlayer(function (current) {
										return current.hasSkill("huabumrfz");
									}) || target;
								if (target) {
									return get.attitude(player, target);
								}
							},
						},
					},
				},
			},
		},
		shixinmrfz: {
			audio: 2,
			trigger: { player: "gainAfter" },
			filter: function (event, player) {
				if (!_status.currentPhase) return false;
				if (player.hasSkill("shixinmrfz_ban")) return false;
				if (_status.currentPhase.countCards("h") == 0) return false;
				return _status.currentPhase != player;
			},
			prompt: "【识心】:是否观看当前回合角色的手牌？",
			async content(event, trigger, player) {
				if (!_status.currentPhase) return;
				player.viewHandcards(_status.currentPhase);
				player.addTempSkill("shixinmrfz_ban", "phaseEnd");
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		//红
		qunlangmrfz: {
			audio: 2,
			trigger: {
				player: "showCharacterAfter",
			},
			hiddenSkill: true,
			filter: function (event, player) {
				if (!event.toShow || !event.toShow.includes("hongmrfz")) return false;
				return game.hasPlayer(current => {
					return current != player && player.inRangeOf(current);
				});
			},
			check: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && player.inRangeOf(current) && get.attitude(current, player) < 0;
				});
			},
			prompt: "【群狼】:你可以对你攻击范围内的一名其他角色造成一点伤害",
			async content(event, trigger, player) {
				const result = await player
					.chooseTarget(true, "【群狼】:请选择一名其他角色并对其造成一点伤害", function (card, player, target) {
						return target != player && player.inRangeOf(target);
					})
					.set("ai", function (target) {
						var player = _status.event.player;
						return get.damageEffect(target, player, player);
					})
					.forResult();

				if (result.targets) {
					const target = result.targets[0];
					target.damage("player");
				}
			},
		},
		cigumrfz: {
			mod: {
				cardnature: function (card, player) {
					if (!card.nature && card.name == "sha") return "stab";
				},
			},
			audio: 2,
			trigger: {
				global: ["respond", "useCard"],
			},
			frequent: true,
			filter: function (event, player) {
				if (!event.respondTo) return false;
				if (event.player == player) return false;
				if (player != event.respondTo[0]) return false;
				else return event.cards.filterInD("o").filterInD("d").length > 0;
			},
			prompt: function (event, player) {
				var cards = event.cards.filterInD("o").filterInD("d");
				return "【刺骨】:是否获得" + get.translation(cards) + "?";
			},
			async content(event, trigger, player) {
				var cards = trigger.cards.filterInD("o").filterInD("d");
				player.gain(cards, "log", "gain2");
			},
		},
		qingchumrfz: {
			group: ["qingchumrfz_sha", "qingchumrfz_shan"],
			audio: 2,
			trigger: { player: ["useCard", "respond"] },
			filter: function (event, player) {
				var target = _status.currentPhase;
				if (!target || target.countCards("he") == 0) return false;
				return event.card && event.card.name == "sha" && target != player;
			},
			check: function (event, player) {
				var target = _status.currentPhase;
				return get.attitude(target, player) < 0;
			},
			prompt: function (event, player) {
				var target = _status.currentPhase;
				return "【清处】:是否弃置当前回合角色（" + get.translation(target) + "）一张牌？";
			},
			async content(event, trigger, player) {
				const target = _status.currentPhase;
				let result;
				if (!target || target.countCards("he") == 0) event.finish();
				else result = await player.discardPlayerCard(target, "he", true).forResult();

				if (result?.cards) {
					if (get.suit(result.cards[0]) == get.suit(trigger.card)) {
						event.goto(0);
					}
				}
			},
			subSkill: {
				shan: {
					audio: "qingchumrfz",
					enable: ["chooseToRespond", "chooseToUse"],
					filter: function (event, player) {
						return _status.currentPhase != player;
					},
					filterCard: {
						name: "sha",
					},
					viewAs: {
						name: "shan",
					},
					prompt: "将一张杀当闪使用或打出",
					check: function () {
						return 1;
					},
					position: "hs",
					viewAsFilter: function (player) {
						if (!player.countCards("hs", "sha")) return false;
					},
					ai: {
						respondShan: true,
						skillTagFilter: function (player) {
							if (!player.countCards("hs", "sha") || _status.currentPhase != player) return false;
						},
						effect: {
							target: function (card, player, target, current) {
								if (get.tag(card, "respondShan") && current < 0) return 0.6;
							},
						},
						order: 4,
						useful: -1,
						value: -1,
						basic: {
							useful: [7, 5.1, 2],
							value: [7, 5.1, 2],
						},
						result: {
							player: 1,
						},
					},
				},
				sha: {
					audio: "qingchumrfz",
					enable: ["chooseToUse", "chooseToRespond"],
					filter: function (event, player) {
						return _status.currentPhase != player;
					},
					filterCard: {
						name: "shan",
					},
					viewAs: {
						name: "sha",
					},
					viewAsFilter: function (player) {
						if (!player.countCards("hs", "shan")) return false;
					},
					position: "hs",
					prompt: "将一张闪当杀使用或打出",
					check: function () {
						return 1;
					},
					ai: {
						effect: {
							target: function (card, player, target, current) {
								if (get.tag(card, "respondSha") && current < 0) return 0.6;
							},
						},
						respondSha: true,
						skillTagFilter: function (player) {
							if (!player.countCards("hs", "shan") || _status.currentPhase != player) return false;
						},
						order: function () {
							return get.order({ name: "sha" }) + 0.1;
						},
						useful: -1,
						value: -1,
						yingbian: function (card, player, targets, viewer) {
							if (get.attitude(viewer, player) <= 0) return 0;
							var base = 0,
								hit = false;
							if (get.cardtag(card, "yingbian_hit")) {
								hit = true;
								if (
									targets.filter(function (target) {
										return (
											target.hasShan() &&
											get.attitude(viewer, target) < 0 &&
											get.damageEffect(target, player, viewer, get.nature(card)) > 0
										);
									})
								)
									base += 5;
							}
							if (get.cardtag(card, "yingbian_all")) {
								if (
									game.hasPlayer(function (current) {
										return (
											!targets.includes(current) &&
											lib.filter.targetEnabled2(card, player, current) &&
											get.effect(current, card, player, player) > 0
										);
									})
								)
									base += 5;
							}
							if (get.cardtag(card, "yingbian_damage")) {
								if (
									targets.filter(function (target) {
										return (
											get.attitude(player, target) < 0 &&
											(hit ||
												!target.mayHaveShan() ||
												player.hasSkillTag(
													"directHit_ai",
													true,
													{
														target: target,
														card: card,
													},
													true
												)) &&
											!target.hasSkillTag("filterDamage", null, {
												player: player,
												card: card,
												jiu: true,
											})
										);
									})
								)
									base += 5;
							}
							return base;
						},
						canLink: function (player, target, card) {
							if (!target.isLinked() && !player.hasSkill("wutiesuolian_skill")) return false;
							if (
								target.mayHaveShan() &&
								!player.hasSkillTag(
									"directHit_ai",
									true,
									{
										target: target,
										card: card,
									},
									true
								)
							)
								return false;
							if (player.hasSkill("jueqing") || player.hasSkill("gangzhi") || target.hasSkill("gangzhi")) return false;
							return true;
						},
						basic: {
							useful: [5, 3, 1],
							value: [5, 3, 1],
						},
						result: {
							target: function (player, target, card, isLink) {
								var eff = (function () {
									if (!isLink && player.hasSkill("jiu")) {
										if (
											!target.hasSkillTag("filterDamage", null, {
												player: player,
												card: card,
												jiu: true,
											})
										) {
											if (get.attitude(player, target) > 0) {
												return -7;
											} else {
												return -4;
											}
										}
										return -0.5;
									}
									return -1.5;
								})();
								if (
									!isLink &&
									target.mayHaveShan() &&
									!player.hasSkillTag(
										"directHit_ai",
										true,
										{
											target: target,
											card: card,
										},
										true
									)
								)
									return eff / 1.2;
								return eff;
							},
						},
						tag: {
							respond: 1,
							respondShan: 1,
							damage: function (card) {
								if (game.hasNature(card, "poison")) return false;
								return 1;
							},
							natureDamage: function (card) {
								if (game.hasNature(card)) return 1;
								return 0;
							},
							fireDamage: function (card, nature) {
								if (game.hasNature(card, "fire")) return 1;
								return 0;
							},
							thunderDamage: function (card, nature) {
								if (game.hasNature(card, "thunder")) return 1;
								return 0;
							},
							poisonDamage: function (card, nature) {
								if (game.hasNature(card, "poison")) return 1;
								return 0;
							},
						},
					},
				},
			},
		},

		//德克萨斯
		jianyumrfz: {
			audio: 2,
			usable: 1,
			enable: "phaseUse",
			async content(event, trigger, player) {
				let result;
				/** @type {Array<Card>} */
				//@ts-ignore
				const cards = get.cards(4);
				game.cardsGotoOrdering(cards);
				player.showCards(cards, "剑雨");
				var suit = [];
				for (var i = 0; i < cards.length; i++) {
					var suitcard = get.suit(cards[i]);
					if (suit.includes(suitcard)) continue;
					suit.add(suitcard);
				}
				var num = suit.length;
				if (player.countCards("he") >= suit.length)
					result = await player
						.chooseCard("he", true, "【剑雨】:将至少" + num + "张牌当作【万箭齐发】对你选择牌的等量名其他角色使用", [num, Infinity])
						.set("ai", function (card) {
							return get.value(card) <= 6;
						})
						.forResult();
				else return;

				if (result?.cards) {
					player.addTempSkill("jianyumrfz_dam", "jianyumrfzAfter");
					player.chooseUseTarget({ name: "wanjian" }, result.cards, true, false).set("selectTarget", function (card, player, target) {
						var num = result.cards?.length || 1;
						return [1, num];
					}).viewAs = true;
				}
			},
			subSkill: {
				dam: {
					silent: true,
					charlotte: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.player.isAlive() && event.cards && event.card.name == "wanjian" && !event.player.hasSkill("jianyumrfz_debuff");
					},
					async content(event, trigger, player) {
						trigger.player.addTempSkill("jianyumrfz_debuff", { player: "phaseEnd" });
					},
				},
				debuff: {
					mark: true,
					intro: {
						content: "使用【杀】的次数-1",
					},
					charlotte: true,
					mod: {
						cardUsable: function (card, player, num) {
							if (card.name == "sha") return num - 1;
						},
					},
				},
			},
			ai: {
				order: 2.95,
				result: {
					player: 1,
				},
			},
		},
		sudimrfz: {
			audio: 2,
			trigger: { global: "roundStart" },
			frequent: true,
			async content(event, trigger, player) {
				let result;

				// Main loop for skill repetition (original steps 6-7 goto 1)
				while (event.count > 0 && player.hasSkill(event.name) && !get.is.blocked(event.name, player)) {
					// step 0 & 1
					event.count--;
					event.cards = game.cardsGotoOrdering(get.cards(2)).cards;
					if (_status.connectMode) {
						game.broadcastAll(function () {
							//@ts-ignore
							_status.noclearcountdown = true;
						});
					}
					event.given_map = {};

					// step 2, 3, 4 loop (original event.goto(2))
					while (event.cards && event.cards.length > 0) {
						// step 2
						if (event.cards.length > 1) {
							result = await player
								.chooseCardButton("【速递】:请选择要分配的牌", true, event.cards, [1, event.cards.length])
								.set("ai", button => {
									if (ui.selected.buttons.length === 0) return 1;
									return 0;
								})
								.forResult();
						} else if (event.cards.length === 1) {
							result = { links: event.cards.slice(0), bool: true };
						} else {
							break;
						}

						// step 3
						if (result.links) {
							event.cards = event.cards.filter(c => !result.links.includes(c));
							event.togive = result.links.slice(0);
							result = await player
								.chooseTarget("选择一名角色获得" + get.translation(result.links), true)
								.set("ai", target => {
									const aiPlayer = _status.event.player;
									const att = get.attitude(aiPlayer, target);
									if (_status.event.enemy) {
										return -att;
									} else if (att > 0) {
										return att / (1 + target.countCards("h"));
									} else {
										return att / 100;
									}
								})
								.set("enemy", get.value(event.togive[0], player, "raw") < 0)
								.forResult();

							// step 4
							if (result.targets && result.targets.length) {
								const id = result.targets[0].playerid;
								const map = event.given_map;

								if (!id || !map) return;

								if (!map[id]) map[id] = [];
								map[id].addArray(event.togive);
							}
						} else {
							break;
						}
					}

					// step 5
					if (_status.connectMode) {
						game.broadcastAll(function () {
							//@ts-ignore
							delete _status.noclearcountdown;
							game.stopCountChoose();
						});
					}
					const list = [];
					for (const i in event.given_map) {
						const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
						player.line(source, "green");
						list.push([source, event.given_map[i]]);
					}
					await game
						.loseAsync({
							gain_list: list,
							giver: player,
							animate: "draw",
						})
						.setContent("gaincardMultiple");

					// step 6: check repetition condition (while loop condition handles this)
					if (!player.hasSkill(event.name) || get.is.blocked(event.name, player)) {
						break;
					}

					result = await player.chooseBool(get.prompt2(event.name)).set("frequentSkill", event.name).forResult();

					// step 7: if player cancels, break the loop
					if (!result.bool) {
						break;
					}
					// else: loop continues to next iteration (original event.goto(1))
				}
			},
			ai: {
				expose: 0.1,
				threaten: 1.1,
			},
		},
		//白金
		xujimrfz: {
			init: function (player) {
				player.storage.xujimrfz = {
					damage: 0,
					maxhand: 0,
				};
			},
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.xujimrfz;
					var str;
					if (storage["damage"] > 0) str = "下次使用【杀】的伤害基数+" + storage["damage"] + "</br>";
					if (storage["maxhand"] > 0) str = str + "手牌上限+" + storage["maxhand"];
					if (!str) return "没有效果";
					return str;
				},
			},
			audio: 3,
			trigger: { player: "phaseDiscardBegin" },
			frequent: true,
			filter: function (event, player) {
				return (
					player.getHistory("useCard", function (evt) {
						if (!get.tag(evt.card, "damage")) return false;
						if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
							var targets = evt.targets.slice(0);
							while (targets.includes(player)) targets.remove(player);
							return targets.length > 0;
						}
						return false;
					}).length === 0
				);
			},
			async content(event, trigger, player) {
				let result;

				player.storage.xujimrfz["damage"] += 1;
				player.storage.xujimrfz["maxhand"] += 5;
				if (player.hasUseTarget("sha", false) && player.hasSha())
					result = await player.chooseControl("摸牌", "出杀").set("prompt", "【蓄击】:请选择一项").forResult();
				else {
					var num = 2 + player.storage.shiyumrfz_buff;
					player.draw(num || 2);
					event.finish();
				}

				if (result && result.index == 0) {
					var num = 2 + player.storage.shiyumrfz_buff;
					player.draw(num || 2);
				} else {
					player.addTempSkill("xujimrfz_sha", "xujimrfzAfter");
					player
						.chooseToUse(
							true,
							function (card, player, event) {
								if (get.name(card) != "sha") return false;
								//@ts-ignore
								return lib.filter.filterCard.apply(this, arguments);
							},
							"【蓄击】：请你使用一张【杀】"
						)
						.set("logSkill", "xujimrfz")
						.set("complexSelect", true);
				}
			},
			group: ["xujimrfz_clear", "xujimrfz_dam"],
			subSkill: {
				sha: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event, player) {
						//@ts-ignore
						return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
					},
					logTarget: "target",
					async content(event, trigger, player) {
						var storage = player.storage.shiyumrfz_buff;
						if (!storage) storage = 0;
						const id = trigger.target.playerid;
						const map = trigger.getParent()?.customArgs;

						if (!id || !map) return;

						if (!map[id]) map[id] = {};
						if (typeof map[id].shanRequired == "number") {
							map[id].shanRequired++;
						} else {
							map[id].shanRequired = 2 + storage;
						}
						player.removeSkill("xujimrfz_sha");
					},
				},
				clear: {
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.xujimrfz["maxhand"] = 0;
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + (player.storage.xujimrfz["maxhand"] || 0);
						},
					},
				},
				dam: {
					charlotte: true,
					direct: true,
					trigger: { player: "useCard" },
					filter: function (event, player) {
						if (player.storage.xujimrfz["damage"] < 1) return false;
						return event.card && event.card.name == "sha";
					},
					async content(event, trigger, player) {
						const storage = player.storage.xujimrfz["damage"];
						//@ts-ignore
						player.logSkill("xujimrfz");
						if (!trigger.baseDamage) trigger.baseDamage = 1;
						trigger.baseDamage += storage;
						player.storage.xujimrfz["damage"] = 0;
					},
				},
			},
		},
		shiyumrfz: {
			audio: 2,
			skillAnimation: true,
			animationColor: "wood",
			juexingji: true,
			forced: true,
			unique: true,
			trigger: { source: "damageEnd" },
			filter: function (event, player) {
				return event.num >= 2;
			},
			async content(event, trigger, player) {
				player.storage.shiyumrfz = true;
				player.awakenSkill("shiyumrfz");
				player.addSkill("shiyumrfz_buff");
				if (!player.storage.shiyumrfz_buff) player.storage.shiyumrfz_buff = 0;
				player.storage.shiyumrfz_buff += 1;
			},
			subSkill: {
				buff: {
					charlotte: true,
					mod: {
						attackRange: function (player, num) {
							return (num += 1);
						},
					},
					ai: {
						viewHandcard: true,
						skillTagFilter(player, tag, arg) {
							if (player === arg || !player.inRange(arg)) return false;
						},
					},
				},
			},
		},
		//因陀罗
		suijiamrfz: {
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
		huquanmrfz: {
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
		//温米
		baiweimrfz: {
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.baiweimrfz,
						text;
					if (Object.keys(player.storage.baiweimrfz).length < 1) return "没有记录的牌";
					for (var key in storage) {
						text = (text === undefined ? "" : text) + get.translation(key) + ":" + storage[key] + "</br>";
					}
					return text;
				},
			},
			audio: 4,
			init: function (player) {
				player.storage.baiweimrfz = {};
			},
			enable: ["chooseToUse", "chooseToRespond"],
			filter: function (event, player) {
				if (player.countCards("h") < 1 || Object.keys(player.storage.baiweimrfz).length < 1) return false;
				for (var i of lib.inpile) {
					var type = get.type(i);
					if ((type == "basic" || type == "trick") && event.filterCard({ name: i }, player, event) && player.storage.baiweimrfz[i])
						return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var number = {};
					for (var i = 1; i <= lib.inpile.length; i++) {
						number[i] = [];
					}
					for (var i = 1; i <= lib.inpile.length; i++) {
						for (var j = 0; j < lib.inpile.length; j++) {
							var name = lib.inpile[j];
							if (get.type(name) == "delay" || get.type(name) == "equip") continue;
							if (!event.filterCard({ name: name }, player, event)) continue;
							if (!player.storage.baiweimrfz[name]) continue;
							if (get.cardNameLength(name) == i) {
								if (name == "sha") {
									if (event.filterCard({ name: name }, player, event)) number[i].push(["基本", "", "sha"]);
									for (var k of ["fire", "thunder", "ice", "stab"]) {
										if (event.filterCard({ name: name, nature: k }, player, event)) number[i].push(["基本", "", "sha", k]);
									}
								} else if (get.type(name) == "trick" && event.filterCard({ name: name }, player, event))
									number[i].push(["锦囊", "", name]);
								else if (get.type(name) == "basic" && event.filterCard({ name: name }, player, event))
									number[i].push(["基本", "", name]);
							}
						}
					}
					/**
					 * @type {Dialog}
					 */
					//@ts-ignore
					var dialog = ui.create.dialog;
					//@ts-ignore
					dialog = ["百味：请选择一张牌"];
					for (var i = 1; i < Object.keys(number).length; i++) {
						if (!number[i].length) continue;
						//@ts-ignore
						dialog.push('<div class="text center">' + get.cnNumber(i) + "字</div>");
						//@ts-ignore
						dialog.push([number[i], "vcard"]);
					}
					return dialog;
				},
				backup: function (links, player) {
					return {
						filterCard: function (card) {
							var selected = ui.selected.cards,
								num = get.cardNameLength(links[0][2]);
							if (selected.length) {
								var num2 = 0;
								for (var i = 0; i < selected.length; i++) {
									num2 += get.cardNameLength(selected[i]);
								}
								num -= num2;
								return get.cardNameLength(card) <= num;
							} else return get.cardNameLength(card) <= num;
						},
						selectCard: function () {
							var num = Infinity,
								selected = ui.selected.cards,
								num2 = get.cardNameLength(links[0][2]);
							if (selected.length) {
								var num3 = 0;
								for (var i = 0; i < selected.length; i++) {
									num3 += get.cardNameLength(selected[i]);
								}
								if ((num = Infinity)) num = 1;
								if (num3 != num2) num = num + selected.length;
							}
							return num;
						},
						audio: "baiweimrfz",
						popname: true,
						check: function (card) {
							return 8 - get.value(card);
						},
						position: "h",
						viewAs: { name: links[0][2], nature: links[0][3] },
						async precontent(event, trigger, player) {
							//@ts-ignore
							const name = lib.skill.baiweimrfz_backup.viewAs.name;
							player.storage.baiweimrfz[name]--;
							if (player.storage.baiweimrfz[name] == 0) delete player.storage.baiweimrfz[name];
						},
					};
				},
				prompt: function (links, player) {
					return (
						"将任意张字数之和为" +
						get.cnNumber(links[0][2]) +
						"的牌为当做" +
						(get.translation(links[0][3]) || "") +
						get.translation(links[0][2]) +
						"使用"
					);
				},
			},
			hiddenCard: function (player, name) {
				if (!lib.inpile.includes(name)) return false;
				var type = get.type(name);
				return (type == "basic" || type == "trick") && player.storage.baiweimrfz[name] && player.countCards("h") > 0;
			},
			ai: {
				fireAttack: true,
				respondShan: true,
				respondSha: true,
				skillTagFilter: function (player) {
					if (!player.countCards("h") || player.hasSkill("baiweimrfz_ban")) return false;
				},
				order: 1,
				result: {
					player: function (player) {
						if (_status.event.dying) return get.attitude(player, _status.event.dying);
						return 1;
					},
				},
			},
			group: "baiweimrfz_use",
			subSkill: {
				ban: {
					charlotte: true,
				},
				use: {
					silent: true,
					trigger: { global: "useCard" },
					filter: function (event, player) {
						if (!event.card || !event.card.isCard || player.hasSkill("baiweimrfz_ban")) return false;
						//@ts-ignore
						return get.type(event.card) == "trick" || get.type(event.card) == "basic";
					},
					async content(event, trigger, player) {
						var name = trigger.card.name;
						if (!player.storage.baiweimrfz) player.storage.baiweimrfz = {};
						if (player.storage.baiweimrfz[name]) {
							player.storage.baiweimrfz[name]++;
						} else {
							player.storage.baiweimrfz[name] = 1;
						}
						if (trigger.player != player && _status.currentPhase != player) player.addTempSkill("baiweimrfz_ban", { global: "phaseEnd" });
					},
				},
			},
		},
		nuanxiangmrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				if (player.hasSkill("nuanxiangmrfz_ban")) return false;
				return event.card && event.card.cards && !event.card.isCard;
			},
			prompt: function (event, player) {
				return "【暖香】:是否令至多" + get.cnNumber(event.card.cards.length) + "名角色摸一张牌？";
			},
			async content(event, trigger, player) {
				const num = trigger.card.cards.length;
				player.addTempSkill("nuanxiangmrfz_ban", { global: "phaseEnd" });
				const result = await player
					.chooseTarget(true, [1, num], "【暖香】:请选择至多" + get.cnNumber(num) + "名角色")
					.set("ai", target => get.attitude(player, target) > 0)
					.forResult();

				if (result.targets) {
					//@ts-ignore
					player.logSkill("nuanxiangmrfz");
					for (var i of result.targets) {
						player.line(i);
						i.draw();
					}
				}
			},
			ai: {
				expose: 0.1,
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		//梅尔
		shuitamrfz: {
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			mod: {
				ignoredHandcard: function (card, player) {
					if (card.hasGaintag("shuitamrfzx")) {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && card.hasGaintag("shuitamrfzx")) return false;
				},
			},
			audio: 2,
			derivation: ["baopomrfz", "mihuomrfz"],
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			locked: false,
			filter: function (event, player) {
				return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const result = await player
					.chooseCard(true, "【水獭】:请选择至多三张牌并标记为‘咪啵’", [1, 3])
					.set("ai", function (card) {
						return get.type(card) != "equip" && get.type(card) != "delay";
					})
					.forResult();

				if (result.cards) {
					player.addGaintag(result.cards, "shuitamrfzx");
					for (let i of result.cards) {
						i.storage.shuitamrfzx = true;
					}
				}

				const { index } = await player
					.chooseControl("爆破", "迷惑")
					.set("prompt", "【水獭】:请选择获得一个技能")
					.set("ai", function () {
						return [0, 1].randomGet();
					})
					.forResult();

				if (index === 0) {
					player.addSkill("baopomrfz");
				} else if (index === 1) {
					player.addSkill("mihuomrfz");
				}
			},
			group: ["shuitamrfz_reget", "shuitamrfz_end"],
			subSkill: {
				end: {
					direct: true,
					trigger: { global: "phaseEnd" },
					filter: function (event, player) {
						return player.getExpansions("shuitamrfz").length > 0;
					},
					async content(event, trigger, player) {
						let result;

						const cards = player.getExpansions("shuitamrfz");
						if (cards.length == 1) {
							for (let i of cards) {
								i.storage.shuitamrfzx = true;
							}
							player.gain(cards, "gain2").gaintag = ["shuitamrfzx"];
							game.log(player, "收回了" + get.translation(cards));
							//@ts-ignore
							player.logSkill("shuitamrfz");
							event.finish();
						} else {
							result = await player
								.chooseButton(["【水獭】:请选择获得其中一张牌", cards])
								.set("ai", button => get.value(button.links))
								.forResult();
						}
						("step 1");
						if (result?.links) {
							for (let i of result.links) {
								i.storage.shuitamrfzx = true;
							}
							player.gain(result.links, "gain2").gaintag = ["shuitamrfzx"];
							game.log(player, "收回了" + get.translation(result.links));
							//@ts-ignore
							player.logSkill("shuitamrfz");
						}
					},
				},
				reget: {
					direct: true,
					trigger: {
						player: "loseAfter",
					},
					filter: function (event, player) {
						var evt = event.getl(player);
						if (!evt || !evt.hs || !evt.hs.length) return false;
						if (event.name == "lose") {
							for (var i in event.gaintag_map) {
								if (event.gaintag_map[i].includes("shuitamrfzx")) return true;
							}
							return false;
						}
						return player.hasHistory("lose", function (evt) {
							if (event != evt.getParent()) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("shuitamrfzx")) return true;
							}
							return false;
						});
					},
					async content(event, trigger, player) {
						if (trigger.delay == false) game.delay();
						var cards = [];
						for (var i = 0; i < trigger.cards2.length; i++) {
							var card = trigger.cards2[i];
							if (card.storage.shuitamrfzx) {
								cards.push(card);
								clearTimeout(card.timeout);
								card.classList.remove("removing");
							}
						}
						if (cards.length > 0) {
							//@ts-ignore
							player.logSkill("shuitamrfz");
							player.addToExpansion(cards, player, "giveAuto").gaintag.add("shuitamrfz");
						}
					},
				},
			},
		},
		baopomrfz: {
			init: function (player) {
				player.storage.baopomrfz = false;
			},
			audio: 2,
			limited: true,
			charlotte: true,
			skillAnimation: true,
			animationColor: "gray",
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return (
					!player.storage.baopomrfz &&
					player.countCards("h", function (card) {
						return card.storage.shuitamrfzx;
					}) > 0
				);
			},
			check: function (event, player) {
				if (player.hasUnknown()) return false;
				return true;
			},
			async content(event, trigger, player) {
				let result;

				// step 0
				player.awakenSkill(event.name);
				player.storage.baopomrfz = true;
				player.removeGaintag("shuitamrfzx");
				for (const card of player.getCards("h")) {
					delete card.storage.shuitamrfzx;
				}
				player.addTempSkill("baopomrfz_tmp", { player: "baopomrfzAfter" });

				result = await player
					.chooseTarget(true, "【爆破】:请选择至多三名其他角色", [1, 3], (card, player, target) => {
						return target !== player;
					})
					.set("ai", target => {
						return get.damageEffect(target, player) && !target.hasSkillTag("nofire");
					})
					.forResult();

				// step 1
				if (result.targets && result.targets.length) {
					event.targets = result.targets;
					event.cards = [];
				} else {
					return;
				}

				// step 2 & 3 loop (original event.goto(2))
				while (event.targets.length > 0) {
					const currentTarget = event.targets[0];

					// step 2: judge with custom judge2
					const judgeEvent = currentTarget.judge(card => {
						if (get.color(card) === "red") return -4;
						return 0;
					});
					judgeEvent.judge2 = judgeResult => {
						return judgeResult.bool === false;
					};
					result = await judgeEvent.forResult();

					// step 3 logic
					if (result.bool === false) {
						await currentTarget.damage(2, "fire");
						//@ts-ignore
						player.logSkill("baopomrfz", currentTarget);
					}
					//@ts-ignore
					if (result.card) event.cards.push(result.card);
					event.targets.shift();
				}

				// step 4
				if (event.cards && event.cards.length) {
					const cards = [];
					for (const card of event.cards) {
						if (get.position(card, true) === "d") {
							cards.push(card);
						}
					}
					for (const card of cards) {
						card.storage.shuitamrfzx = true;
					}
					const next = player.gain(cards, "gain2");
					next.gaintag.add("shuitamrfzx");
					await next;
				}
			},
			subSkill: {
				tmp: {
					charlotte: true,
				},
			},
		},
		mihuomrfz: {
			audio: 2,
			trigger: { player: "damageBegin" },
			filter: function (event, player) {
				if (event.source == undefined) return false;
				return player.countCards("h") > 0;
			},
			prompt: function (event, player) {
				return "【迷惑】:你可以令" + get.translation(event.source) + "展示你的一张手牌，若为‘咪啵’则此伤害-1";
			},
			check: function (event, player) {
				for (var i of player.getCards("h")) {
					if (i.storage.shuitamrfzx) return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				const result = await trigger.source.choosePlayerCard(player, "h", true).forResult();

				if (!result.cards) return;

				player.showCards(
					result.cards,
					get.translation(trigger.source) +
						"展示了" +
						get.translation(player) +
						"一张牌</br>此牌" +
						(result.cards[0].storage.shuitamrfzx ? "<font color=#FF0000>有</font>" : "<font color=#00FF1A>无</font>") +
						"‘咪啵’标记"
				);
				if (result.cards[0].storage.shuitamrfzx) {
					player.discard(result.cards[0]);
					trigger.num--;
				}
			},
		},
		//凛冬
		dongjiangmrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("h") > 0;
			},
			check: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && get.attitude(current, player) > 0;
				});
			},
			async content(event, trigger, player) {
				let result;

				// Steps 0-3 loop (original event.goto(0))
				while (player.countCards("h") > 0) {
					// step 0
					result = await player.chooseCard("【冬将】:请选择你要分配的牌", true, [1, Infinity]).forResult();

					// step 1
					let cards = result.cards;

					if (!cards) continue;

					result = await player
						.chooseTarget("【冬将】:请选择你要分配的角色（" + get.translation(cards) + "）", true, (card, player, target) => {
							return target !== player;
						})
						.set("ai", target => {
							return get.attitude(target, player) > 0;
						})
						.forResult();

					// step 2
					if (result.targets) await player.give(cards, result.targets[0]);
					// step 3: loop condition checked at while start
				}

				// step 4
				if (player.hasUseTarget("sha")) {
					player.addTempSkill("dongjiangmrfz_dam", "useCardAfter");
					await player
						.chooseUseTarget(
							{
								name: "sha",
								isCard: true,
							},
							"请选择【杀】的目标"
						)
						.set("forced", true)
						.set("addCount", false)
						.forResult();
				}
			},
			subSkill: {
				dam: {
					direct: true,
					trigger: { source: "damageEnd" },
					filter: function (event, player) {
						return event.card.name == "sha" && event.card.cards.length == 0;
					},
					async content(event, trigger, player) {
						//@ts-ignore
						player.drawTo(3);
						player.removeSkill("dongjiangmrfz_dam");
						//@ts-ignore
						player.logSkill("dongjiangmrfz");
					},
				},
			},
		},
		xianlingmrfz: {
			audio: 2,
			trigger: { global: "roundStart" },
			async content(event, trigger, player) {
				let result;

				// Steps 0-1 Loop: Player prepares to use a card (draw until usable)
				while (true) {
					const cards = player.getCards("h");
					if (player.countCards("h") < 1) {
						await player.draw();
						continue;
					}
					let hasUsable = false;
					for (const card of cards) {
						if (player.hasUseTarget(card, false)) {
							hasUsable = true;
							break;
						}
					}
					if (hasUsable) break;
					await player.draw();
				}

				// Step 2: Player chooses to use a card
				await player
					.chooseToUse("【先领】:请使用一张牌", true)
					.set("complexSelect", true)
					.set("filterTarget", (card, player, target) => {
						return player.canUse(card, target, false);
					})
					.set("addCount", false)
					.set("forced", true);

				// Steps 3-4: Select target to repeat (if not round 1)
				if (game.roundNumber !== 1) {
					result = await player
						.chooseTarget("【先领】:你可以令一名其他角色执行一次相同的流程", (card, player, target) => {
							return target !== player;
						})
						.set("ai", target => {
							return get.attitude(target, player) > 0;
						})
						.forResult();

					if (result.targets && result.targets.length) {
						event.target = result.targets[0];
					} else {
						return;
					}
				} else {
					return;
				}

				// Steps 5-6 Loop: Target prepares to use a card (draw until usable)
				while (true) {
					const cards = event.target.getCards("h");
					if (event.target.countCards("h") < 1) {
						await event.target.draw();
						continue;
					}
					let hasUsable = false;
					for (const card of cards) {
						if (event.target.hasUseTarget(card, false)) {
							hasUsable = true;
							break;
						}
					}
					if (hasUsable) break;
					await event.target.draw();
				}

				// Step 7: Target chooses to use a card
				await event.target
					.chooseToUse("【先领】:请使用一张牌")
					.set("complexSelect", true)
					.set("filterTarget", (card, player, target) => {
						return event.target.canUse(card, target, false);
					})
					.set("addCount", false)
					.set("forced", true);
			},
		},
		//陨星
		dingyuanmrfz: {
			derivation: "zhimingmrfz",
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.yxliumingmrfz_count;
					if (player.awakenedSkills && player.awakenedSkills.includes("dingyuanmrfz")) {
						return "置于过武将牌上的牌:" + get.translation(storage["card"]);
					}
					return (
						"已置于过武将牌上" +
						storage["count"] +
						"张牌</br>置于过武将牌上的牌（装备牌和延时锦囊除外）:" +
						get.translation(storage["card"])
					);
				},
			},
			onremove: true,
			audio: 2,
			forced: true,
			skillAnimation: true,
			animationColor: "thunder",
			unique: true,
			juexingji: true,
			trigger: {
				player: "phaseZhunbeiBegin",
			},
			filter: function (event, player) {
				return player.storage.yxliumingmrfz_count["count"] >= 3;
			},
			async content(event, trigger, player) {
				player.awakenSkill("dingyuanmrfz");
				player.loseMaxHp();
				player.addSkill("zhimingmrfz");
			},
		},
		yxliumingmrfz: {
			audio: 2,
			forced: true,
			trigger: {
				global: "phaseBegin",
			},
			marktext: "铭",
			intro: {
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			filter: function (event, player) {
				return player.getExpansions("yxliumingmrfz").length < 1;
			},
			async content(event, trigger, player) {
				var cards = game.cardsGotoOrdering(get.cards(1)).cards[0];
				player.addToExpansion(cards, player, "giveAuto").gaintag.add("yxliumingmrfz");
			},
			group: ["yxliumingmrfz_target", "yxliumingmrfz_use", "yxliumingmrfz_count"],
			subSkill: {
				count: {
					init: function (player) {
						player.storage.yxliumingmrfz_count = {
							count: 0,
							card: [],
						};
					},
					onremove: function (player) {
						delete player.storage.yxliumingmrfz_count;
					},
					silent: true,
					charlotte: true,
					trigger: {
						player: "addToExpansionAfter",
					},
					filter: function (event, player) {
						//@ts-ignore
						return event.getParent().name == "yxliumingmrfz";
					},
					async content(event, trigger, player) {
						if (!player.storage.yxliumingmrfz_count)
							player.storage.yxliumingmrfz_count = {
								count: 0,
								card: [],
							};
						if (!player.awakenedSkills || !player.awakenedSkills.includes("dingyuanmrfz")) player.storage.yxliumingmrfz_count["count"]++;
						if (trigger.cards) {
							for (var i of trigger.cards) {
								if (get.type(i) == "equip" || get.type(i) == "delay") continue;
								if (player.storage.yxliumingmrfz_count["card"].includes(i.name)) continue;
								player.storage.yxliumingmrfz_count["card"].add(i.name);
							}
						}
					},
				},
				ban: {
					charlotte: true,
				},
				use: {
					enable: "chooseToUse",
					hiddenCard: function (player, name) {
						if (player.getExpansions("yxliumingmrfz").length < 1) return false;
						return name == player.getExpansions("yxliumingmrfz")[0].name;
					},
					filter: function (event, player) {
						if (player.getExpansions("yxliumingmrfz").length < 1) return false;
						return event.filterCard({ name: player.getExpansions("yxliumingmrfz")[0].name, isCard: true }, player, event);
					},
					chooseButton: {
						dialog: function (event, player) {
							var vcards = [];
							var card = player.getExpansions("yxliumingmrfz")[0].name;
							var type = get.translation(get.type2(card));
							if (event.filterCard({ name: card, isCard: true }, player, event)) vcards.push([type, "", card]);

							/**
							 * @type { Dialog }
							 */
							//@ts-ignore
							var dialog = ui.create.dialog("流铭", [vcards, "vcard"], "hidden");
							//@ts-ignore
							dialog.direct = true;
							return dialog;
						},
						backup: function (links, player) {
							return {
								filterCard: card => {
									var player = _status.event.player;
									return !!player.getExpansions("yxliumingmrfz")[0];
								},
								selectCard: -1,
								position: "x",
								viewAs: {
									name: links[0][2],
									nature: links[0][3],
								},
								async precontent(event, trigger, player) {
									//@ts-ignore
									player.logSkill("yxliumingmrfz");
								},
							};
						},
						prompt: function (links, player) {
							return (
								"【流铭】：使用一张" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】"
							);
						},
					},
					ai: {
						order: function () {
							var player = _status.event.player;
							var card = player.getExpansions("yxliumingmrfz")[0];
							return get.order(card) + 0.1;
						},
						result: {
							player: 1,
						},
					},
				},
				target: {
					trigger: {
						target: "useCardToPlayered",
					},
					filter: function (event, player) {
						if (event.player == player) return false;
						if (player.getExpansions("yxliumingmrfz").length == 0 || !event.card) return false;
						var suit = get.suit(event.card);
						return !!player.getExpansions("yxliumingmrfz").filter(function (magic) {
							return get.suit(magic) == suit || magic.number != event.card.number;
						}).length;
					},
					forced: true,
					async content(event, trigger, player) {
						const card = player.getExpansions("yxliumingmrfz")[0];
						var num1 = card.number,
							num2 = trigger.card.number;
						if (num1 != num2) {
							var type = get.type2(card);
							var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
							const result = await trigger.player
								.chooseToDiscard(
									"【流铭】:请弃置一张" + get.translation(get.type(card)) + "牌，否则此牌对" + get.translation(player) + "无效"
								)
								.set("filterCard", function (card) {
									return get.type2(card) == _status.event.type;
								})
								.set("ai", function (card) {
									if (_status.event.eff > 0) {
										return 10 - get.value(card);
									}
									return 0;
								})
								.set("eff", eff)
								.set("type", type)
								.forResult();

							if (result.bool == false) {
								trigger.targets.remove(player);
								//@ts-ignore
								trigger.getParent().triggeredTargets2.remove(player);
								trigger.untrigger();
								player.removeSkill("yxliumingmrfz_target");
								player.addTempSkill("yxliumingmrfz_reget", { global: "phaseBegin" });
								player.addTempSkill("yxliumingmrfz_ban", { global: "phaseEnd" });
							}
						}
						("step 1");
						const cardx = player.getExpansions("yxliumingmrfz")[0];
						if (get.suit(cardx) == get.suit(trigger.card)) {
							player.gain(cardx, "gain2");
						}
						//@ts-ignore
						player.logSkill("yxliumingmrfz");
					},
				},
				reget: {
					silent: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.addSkill("yxliumingmrfz_target");
					},
				},
			},
		},
		zhimingmrfz: {
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.yxliumingmrfz_count;
					if (player.awakenedSkills && player.awakenedSkills.includes("dingyuanmrfz")) {
						return "置于过武将牌上的牌（装备牌和延时锦囊除外）:" + get.translation(storage["card"]);
					}
					return (
						"已置于过武将牌上" +
						storage["count"] +
						"张牌</br>置于过武将牌上的牌（装备牌和延时锦囊除外）:" +
						get.translation(storage["card"])
					);
				},
			},
			audio: 2,
			enable: ["chooseToUse", "chooseToRespond"],
			hiddenCard: function (player, name) {
				var cards = player.storage.yxliumingmrfz_count["card"];
				if (player.countCards("he") < 1 || !cards || player.hasSkill("zhimingmrfz_ban")) return false;
				for (var i of cards) {
					if (name == i) return true;
				}
				return false;
			},
			filter: function (event, player) {
				var cards = player.storage.yxliumingmrfz_count["card"];
				if (player.countCards("he") < 1 || !cards || player.hasSkill("zhimingmrfz_ban")) return false;
				for (var i of cards) {
					if (event.filterCard({ name: i, isCard: true }, player, event)) return true;
				}
				return false;
			},
			chooseButton: {
				dialog: function (event, player) {
					var vcards = [];
					var list = player.storage.yxliumingmrfz_count["card"];
					for (var name of list) {
						var card = { name: name, isCard: true };
						var type = get.type(name);
						if (event.filterCard(card, player, event)) vcards.push([type, "", name]);
					}
					/**
					 * @type { Dialog }
					 */
					//@ts-ignore
					var dialog = ui.create.dialog("祗铭", [vcards, "vcard"], "hidden");
					//@ts-ignore
					dialog.direct = true;
					return dialog;
				},
				backup: function (links, player) {
					return {
						filterCard: () => true,
						selectCard: 1,
						viewAs: {
							name: links[0][2],
						},
						position: "he",
						async precontent(event, trigger, player) {
							//@ts-ignore
							player.logSkill("zhimingmrfz");
							player.addTempSkill("zhimingmrfz_ban", { global: "phaseEnd" });
						},
					};
				},
				prompt: function (links, player) {
					return "【祗铭】：将一张牌当作【" + get.translation(links[0][2]) + "】使用或打出";
				},
			},
			ai: {
				order: 1,
				result: {
					player: 1,
				},
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},
		//羽毛笔
		tiaojiumrfz: {
			audio: 2,
			audioname: ["longshelanmrfz"],
			derivation: ["jiu"],
			enable: "chooseToUse",
			filterCard: function (card, player) {
				if (ui.selected.cards.length) {
					return get.color(card) != get.color(ui.selected.cards[0]);
				}
				return true;
			},
			complexCard: true,
			selectCard: 2,
			viewAs: {
				name: "jiu",
			},
			position: "hs",
			viewAsFilter: function (player) {
				var hs = player.getCards("hs");
				if (hs.length < 2) return false;
				var bool = false,
					map = {};
				for (var card of hs) {
					var color = get.color(card);
					if (!map[color]) map[color] = true;
					else {
						bool = true;
						break;
					}
				}
				if (!bool) return false;
				return true;
			},
			prompt: "【调酒】:将两张不同颜色的手牌当酒使用",
			check: function (card) {
				return 10 - get.value(card);
			},
			ai: {
				threaten: 1.5,
				order: () => {
					let player = _status.event.player;
					if (_status.event.dying) return 9;
					let cards = player.getCards("h", card => {
						return get.type(card) != "equip" && get.type(card) != "delay";
					});
					if (cards.length > 0) return 13;
					return 0;
				},
				result: {
					target: 1,
				},
				tag: {
					save: 1,
					recover: 0.1,
				},
			},
		},
		rujingmrfz: {
			audio: 2,
			direct: true,
			lastDo: true,
			mark: true,
			intro: {
				content: function (event, player) {
					var storage = player.storage.rujingmrfz;
					storage["number"].sort(function (a, b) {
						return a - b;
					});
					var str1 = "",
						str2 = "";
					if (storage["number"].length) str1 = str1 + storage["number"];
					else str1 = "无";
					if (storage["suit"].length) str2 = str2 + get.translation(storage["suit"]);
					else str2 = "无";
					return "记录的数字:" + str1 + "</br>" + "记录的花色:" + str2;
				},
			},
			init: player => {
				player.storage.rujingmrfz = {
					suit: [],
					number: [],
					ban: [],
					card: [],
				};
			},
			onremove: player => {
				delete player.storage.rujingmrfz;
			},
			trigger: { player: "useCardAfter" },
			filter: function (event, player) {
				return event.card && (event.card.number || event.card.suit);
			},
			async content(event, trigger, player) {
				if (!player.storage.rujingmrfz)
					player.storage.rujingmrfz = {
						suit: [],
						number: [],
						ban: [],
						card: [],
					};
				var card = trigger.card,
					storage = player.storage.rujingmrfz;
				if (!storage["card"].includes(trigger.card)) {
					if (card.number && !storage["number"].includes(card.number)) {
						player.storage.rujingmrfz["number"].add(card.number);
					}
					if (card.suit && !storage["suit"].includes(card.suit) && card.suit != "none") {
						player.storage.rujingmrfz["suit"].add(card.suit);
					}
				} else player.storage.rujingmrfz["card"].remove(trigger.card);
			},
			group: ["rujingmrfz_addcount", "rujingmrfz_clear"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					lastDo: true,
					trigger: { player: "phaseUseEnd" },
					filter: function (event, player) {
						return player.storage.rujingmrfz;
					},
					async content(event, trigger, player) {
						player.storage.rujingmrfz["ban"] = [];
					},
				},
				addcount: {
					audio: "rujingmrfz",
					trigger: { player: "useCard" },
					direct: true,
					filter: function (event, player) {
						var storage = player.storage.rujingmrfz;
						if (!event.card || !(event.card.number && event.card.suit)) return false;
						var cardNumber = event.card.number;
						var cardSuit = event.card.suit;
						if (!storage["number"].includes(cardNumber) && !storage["suit"].includes(cardSuit)) return false;
						//@ts-ignore
						if (get.type(event.card) == "equip" || get.type(event.card) == "delay") return false;
						if (["shan", "wuxie"].includes(event.card.name)) return false;
						return (
							(storage["number"].includes(cardNumber) && !storage["ban"].includes("number")) ||
							(storage["suit"].includes(cardSuit) && !storage["ban"].includes("suit"))
						);
					},
					async content(event, trigger, player) {
						let result;
						let storage = player.storage.rujingmrfz,
							number = trigger.card.number,
							suit = trigger.card.suit;
						const list = [];
						if (storage["number"].includes(number) && !storage["ban"].includes("number")) list.add("number");
						if (storage["suit"].includes(suit) && !storage["ban"].includes("suit")) list.add("suit");
						event.list = list;
						if (list.length == 1) {
							var goon = true;
							if (trigger.card.name == "du") goon = false;
							if (trigger.card.name == "jiedao") goon = false;
							if (trigger.card.name == "tao" && player.getDamagedHp() == 1) goon = false;
							if (list.includes("suit")) {
								result = await player
									.chooseBool("【入境】:是否令此牌额外结算一次？（同花色）")
									.set("ai", function () {
										return _status.event.goon;
									})
									.set("goon", goon)
									.forResult();
							} else {
								result = await player
									.chooseBool("【入境】:是否令此牌额外结算一次？（同点数）")
									.set("ai", function () {
										return _status.event.goon;
									})
									.set("goon", goon)
									.forResult();
							}
						} else {
							result = await player
								.chooseControl("点数", "花色", "全部", "cancel2")
								.set("prompt", "【入境】:请选择一项")
								.set("prompt2", "选择‘点数’或者‘花色’为额外结算一次，选择‘全部’为额外结算两次，选择‘取消’为不发动此技能")
								.set("ai", function () {
									var player = _status.event.player,
										card = _status.event.card;
									if (card.name == "du" || card.name == "jiedao") return "cancel2";
									if (card.name == "tao") {
										var hp = player.getDamagedHp();
										switch (hp) {
											case 0:
												return "cancel2";
											case 1:
												return ["点数", "花色"].randomGet();
											default:
												return "全部";
										}
									}
									return "全部";
								})
								.set("card", trigger.card)
								.forResult();
						}

						if (result?.bool) {
							player.storage.rujingmrfz["card"].add(trigger.card);
							if (event.list.includes("suit")) {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("suit");
								player.storage.rujingmrfz["suit"].remove(suit);
							} else {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("number");
								player.storage.rujingmrfz["number"].remove(number);
							}
						} else if (result.control != "cancel2" && result.bool != false) {
							player.storage.rujingmrfz["card"].add(trigger.card);
							if (result.control == "点数") {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("number");
								player.storage.rujingmrfz["number"].remove(number);
							} else if (result.control == "花色") {
								trigger.effectCount++;
								player.storage.rujingmrfz["ban"].add("suit");
								player.storage.rujingmrfz["suit"].remove(suit);
							} else {
								trigger.effectCount += 2;
								player.storage.rujingmrfz["ban"].add("suit");
								player.storage.rujingmrfz["suit"].remove(suit);
								player.storage.rujingmrfz["ban"].add("number");
								player.storage.rujingmrfz["number"].remove(number);
							}
						}
					},
				},
			},
		},
		//爱丽丝
		alsmengxiangmrfz: {
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
		rumianmrfz: {
			markimage: "extension/WhichWay/image/orther/rumianmrfz.png",
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
		//天火
		zhuihuomrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			audio: 2,
			enable: "phaseUse",
			filter: function (event, player) {
				return (
					player.countCards("hs", card => {
						return (get.name(card) == "sha" && get.nature(card) == "fire") || get.name(card) == "huogong";
					}) > 0
				);
			},
			filterCard: function (card) {
				return (get.name(card) == "sha" && get.nature(card) == "fire") || get.name(card) == "huogong";
			},
			filterTarget: function (card, player, target) {
				return target != player && !player.storage.zhuihuomrfz.includes(target);
			},
			discard: false,
			lose: false,
			delay: false,
			async content(event, trigger, player) {
				player.storage.zhuihuomrfz.add(target);
				//@ts-ignore
				target.addJudge({ name: "sjzx_zhuihuomrfz" }, cards);
			},
			ai: {
				order: 5,
				result: {
					player: 1,
					target: function (player, target) {
						if (
							get.attitude(player, target) < 0 &&
							target.getCards("j", function (card) {
								return get.name(card) == "sjzx_zhuihuomrfz";
							}).length < target.hp
						) {
							if (target.countCards("he") < 2 && target.hp < 2) return -3;
							if (target.countCards("he") < 2) return -2;
						}
						return -1;
					},
				},
			},
			group: ["zhuihuomrfz_clear"],
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "phaseUseEnd" },
					async content(event, trigger, player) {
						player.storage.zhuihuomrfz = [];
					},
				},
			},
		},
		yihuomrfz: {
			mod: {
				cardname: function (card, player) {
					if (card.storage && card.storage.yihuomrfz == true) return "sha";
				},
				cardnature: function (card, player) {
					if (card.storage && card.storage.yihuomrfz == true) return "fire";
				},
			},
			audio: 2,
			trigger: {
				global: "damageEnd",
			},
			usable: 2,
			filter: function (event, player) {
				return event.nature == "fire";
			},
			forced: true,
			async content(event, trigger, player) {
				player.draw(2);
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (get.tag(card, "respondSha") && current < 0) return 0.6;
					},
				},
				respondSha: true,
			},
			group: ["yihuomrfz_gain", "yihuomrfz_cancel"],
			subSkill: {
				cancel: {
					direct: true,
					trigger: { player: "damageBegin4" },
					filter: function (event, player) {
						return event.nature == "fire";
					},
					async content(event, trigger, player) {
						trigger.cancel();
						player.draw(3);
						//@ts-ignore
						player.logSkill("yihuomrfz");
					},
					ai: {
						effect: {
							target: function (card, player, target) {
								if (get.tag(card, "fireDamage")) return [0, 1];
							},
						},
					},
				},
				gain: {
					direct: true,
					trigger: { player: "gainAfter" },
					filter: function (event, player) {
						if (!event.cards || event.cards.length < 2) return false;
						return event.cards.some(element => player.getCards("h").includes(element));
					},
					async content(event, trigger, player) {
						const result = await player
							.chooseCard(true, "【溢火】:请选择一张牌，令此牌视为火【杀】", function (card) {
								return trigger.cards.includes(card);
							})
							.set("ai", function (card) {
								return -get.value(card);
							})
							.forResult();

						if (result.cards) {
							result.cards[0].storage.yihuomrfz = true;
						}
						var color,
							bool = true;
						for (var i of trigger.cards) {
							if (typeof color !== "string") color = get.color(i, player);
							if (get.color(i, player) != color) {
								bool = false;
								break;
							}
						}
						if (bool == true) player.draw();
						//@ts-ignore
						player.logSkill("yihuomrfz");
					},
				},
			},
		},
		//临光
		anranmrfz: {
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			forced: true,
			filter: function (event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			async content(event, trigger, player) {
				const cards = player.getCards("h");
				player.discard(cards);
			},
			group: ["anranmrfz_draw"],
			subSkill: {
				draw: {
					audio: "anranmrfz",
					trigger: { player: "phaseBegin" },
					init: player => {
						player.storage.anranmrfz_draw = false;
					},
					filter: function (event, player) {
						return !player.storage.anranmrfz_draw;
					},
					forced: true,
					async content(event, trigger, player) {
						var num = player.hujia + player.hp;
						player.storage.anranmrfz_draw = true;
						player.draw(2 * num);
						player.changeHujia(-player.hujia);
						player.recover();
						player.when("phaseDiscardBefore").then(async (event, trigger, player) => {
							trigger.cancel();
							//@ts-ignore
							player.logSkill("anranmrfz");
						});
						// .emb({ firstDo: true });
					},
				},
			},
		},
		huchimrfz: {
			audio: 2,
			usable: 1,
			enable: "phaseUse",
			filter: function (event, player) {
				return player.countCards("he") > 0;
			},
			filterTarget: function (card, player, target) {
				return target != player;
			},
			filterCard: true,
			position: "he",
			check: function (card) {
				return 6 - get.value(card);
			},
			lose: false,
			discard: false,
			delay: false,
			async content(event, trigger, player) {
				const { target, cards } = event;

				await player.give(cards, target, true);
				for (let i of cards) {
					i.storage.huchimrfz = true;
				}

				var view = get.autoViewAs({ name: "sha" }, cards);
				const result = await target
					.chooseTarget("【互持】:请选择使用【杀】的目标", function (card, player, target) {
						var view = _status.event.view;
						var playerx = _status.event.playerx;
						return target != playerx && playerx.canUse(view, target);
					})
					.set("view", view)
					.set("playerx", target)
					.set("ai", target => {
						var view = _status.event.view;
						var player = _status.event.playerx;
						return get.effect(target, view, player, player);
					})
					.forResult();

				if (result.targets) {
					var card = get.autoViewAs({ name: "sha" }, cards);
					if (
						target.hasCard(card => {
							return card == cards[0];
						}, "h")
					)
						target.useCard(result.targets[0], card, cards);
				}
			},
			ai: {
				order: 4,
				result: {
					target: function (player, target) {
						if (get.attitude(player, target) > 2) {
							if (
								game.hasPlayer(current => {
									return target.canUse("sha", current) && get.attitude(player, target);
								})
							)
								return 2;
						}
						return 1;
					},
				},
			},
			group: ["huchimrfz_recover", "huchimrfz_gain"],
			subSkill: {
				recover: {
					trigger: {
						player: "recoverEnd",
						global: "recoverEnd",
					},
					usable: 1,
					filter: function (event, player) {
						if (!event.source.isIn() || !event.player.isIn() || event.source === undefined || !event.player) return false;
						if (event.source == player && event.player == player) return false;
						if (event.source != player && event.player != player) return false;
						return true;
					},
					direct: true,
					async content(event, trigger, player) {
						const result = await trigger.player
							.chooseCardTarget({
								prompt: "【互持】:你可以将一张牌交给回复来源",
								filterCard: true,
								position: "he",
								filterTarget: function (card, player, target) {
									var source = _status.event.source;
									return target != player && target == source;
								},
								ai1: function (card) {
									return 8 - get.value(card);
								},
								ai2: function (target) {
									var playerx = _status.event.playerx;
									return get.attitude(playerx, target) > 0;
								},
							})
							.set("source", trigger.source)
							.set("playerx", trigger.player)
							.forResult();

						if (result.cards && result.targets) {
							trigger.player.give(result.cards, result.targets[0]);
							trigger.player.draw();
							trigger.source.draw();
							//@ts-ignore
							trigger.player.logSkill("huchimrfz", trigger.source);
						} else player.storage.counttrigger.huchimrfz_recover--;
					},
				},
				gain: {
					direct: true,
					trigger: {
						player: "gainEnd",
						global: "gainEnd",
					},
					filter: function (event, player) {
						if (event.source == undefined || event.player == undefined) return false;
						if (!event.source.isIn() || !event.player.isIn()) return false;
						if (event.source == player && event.player == player) return false;
						if (event.source != player && event.player != player) return false;
						return true;
					},
					usable: 1,
					async content(event, trigger, player) {
						const result = await trigger.player
							.chooseCardTarget({
								prompt: "【互持】:你可以将一张牌交给给予来源",
								filterCard: true,
								position: "he",
								filterTarget: function (card, player, target) {
									var source = _status.event.source;
									return target != player && target == source;
								},
								ai1: function (card) {
									if (card.storage.huchimrfz) return 0;
									return 8 - get.value(card);
								},
								ai2: function (target) {
									var playerx = _status.event.playerx;
									return get.attitude(playerx, target) > 0;
								},
							})
							.set("source", trigger.source)
							.set("playerx", trigger.player)
							.forResult();

						if (result.cards && result.targets) {
							trigger.player.give(result.cards, result.targets[0]);
							trigger.player.draw();
							trigger.source.draw();
							//@ts-ignore
							trigger.player.logSkill("huchimrfz", trigger.source);
						} else player.storage.counttrigger.huchimrfz_gain--;
					},
				},
			},
		},
		chongyaomrfz: {
			audio: 2,
			mark: true,
			intro: {
				content: function (event, player) {
					return `${player.storage.chongyaomrfz_mark["count"]}/5`;
				},
			},
			derivation: ["zhuguangmrfz"],
			init: player => {
				player.storage.chongyaomrfz = false;
			},
			trigger: {
				player: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
				global: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
			},
			filter: function (event, player) {
				return player.storage.chongyaomrfz_mark["count"] >= 5 && !player.storage.chongyaomrfz;
			},
			juexingji: true,
			skillAnimation: true,
			animationColor: "wood",
			unique: true,
			forced: true,
			async content(event, trigger, player) {
				player.loseMaxHp();
				player.addSkill("zhuguangmrfz");
				player.awakenSkill("chongyaomrfz");
				game.log(player, "获得了技能", "#g【逐光】");
				player.storage.chongyaomrfz = true;
				delete player.storage.chongyaomrfz_mark;
				player.removeSkill("chongyaomrfz_mark");
			},
			group: ["chongyaomrfz_mark", "chongyaomrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					firstDo: true,
					charlotte: true,
					trigger: {
						global: "phaseBegin",
					},
					async content(event, trigger, player) {
						player.storage.chongyaomrfz_mark["skill"] = [];
					},
				},
				mark: {
					init: player => {
						player.storage.chongyaomrfz_mark = {
							count: 0,
							skill: [],
						};
					},
					onremove: player => {
						delete player.storage.chongyaomrfz_mark;
					},
					silent: true,
					charlotte: true,
					firstDo: true,
					trigger: {
						player: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
						global: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
					},
					async content(event, trigger, player) {
						if (!player.storage.chongyaomrfz_mark) player.storage.chongyaomrfz_mark = 0;
						for (var i of ["huchimrfz", "huchimrfz_gain", "huchimrfz_recover"]) {
							if (!player.storage.counttrigger[trigger.name] && i != "huchimrfz") continue;
							if (player.storage.chongyaomrfz_mark["skill"].includes(trigger.name)) continue;
							if (i == "huchimrfz" && trigger.name == "huchimrfz") {
								player.storage.chongyaomrfz_mark["count"]++;
								player.storage.chongyaomrfz_mark["skill"].add(trigger.name);
								break;
							}
							if (player.storage.counttrigger[trigger.name] > 0) {
								player.storage.chongyaomrfz_mark["count"]++;
								player.storage.chongyaomrfz_mark["skill"].add(trigger.name);
								break;
							}
						}
					},
				},
			},
		},
		//海沫
		xunchaomrfz: {
			intro: {
				content: "下次造成的伤害+#",
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				if (player.countCards("h") < 1) return false;
				return game.hasPlayer(current => {
					return (
						current != player &&
						(current.hp > player.hp ||
							current.countCards("h") > player.countCards("h") ||
							current.countCards("e") > player.countCards("e"))
					);
				});
			},
			complexCard: true,
			filterCard: function (card, player) {
				var selected = ui.selected.cards;
				if (!selected.length) return true;
				for (var i = 0; i < selected.length; i++) {
					if (get.type2(card) == get.type2(selected[i])) return false;
				}
				return true;
			},
			filterTarget: function (card, player, target) {
				return (
					target != player &&
					(target.hp > player.hp || target.countCards("h") > player.countCards("h") || target.countCards("e") > player.countCards("e"))
				);
			},
			selectCard: [1, Infinity],
			check: function (card) {
				return 10 - get.value(card);
			},
			discard: false,
			lose: false,
			delay: false,
			async content(event, trigger, player) {
				const { cards, target } = event;

				await player.give(cards, target);

				const num = cards.length;
				if (num >= 1) {
					player.recover();
				}
				if (num >= 2) {
					player.adjustHandCardTo(target.countCards("h"));
				}
				if (num >= 3) {
					player.addMark("xunchaomrfz", 1, false);
					player.when({ source: "damageBegin3" }).then(async (event, trigger, player) => {
						player.removeMark("xunchaomrfz", 1, false);
						trigger.num++;
					});
					// .emb({ firstDo: true });
				}
			},
			ai: {
				expose: 0.1,
				order: 3,
				result: {
					target: function (player, target) {
						if (get.attitude(target, player) > 0) {
							return 1 + target.countCards("h") * 0.1;
						}
					},
				},
			},
		},
		paoyingmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseZhunbeiBegin" },
			filter: function (event, player) {
				return player.countCards("h") > player.hp && player.getDamagedHp() > 0;
			},
			async content(event, trigger, player) {
				const result = await player.adjustHandCardTo(player.hp).forResult();

				if (result.cards) {
					player.recover(Math.min(result.cards.length, 2));
				}
			},
		},

		//小满
		mushoumrfz: {
			audio: 2,
			trigger: { global: "phaseEnd" },
			direct: true,
			getCanUseCard: function (event, player) {
				var history = event.player.getHistory("lose", function (evt) {
						return evt && evt.type == "discard";
					}),
					cards = [];
				if (history.length == 0) return cards;
				for (var i = 0; i < history.length; i++) {
					var cardsList = history[i].cards;
					for (var j = 0; j < cardsList.length; j++) {
						if (!player.canUseToAnyone(cardsList[j])) continue;
						if (get.position(cardsList[j], true) != "d") continue;
						cards.push(cardsList[j]);
					}
				}
				return cards;
			},
			filter: function (event, player) {
				var cards = lib.skill.mushoumrfz.getCanUseCard(event, player);
				return cards.length > 0 && event.player != player;
			},
			async content(event, trigger, player) {
				let cards = lib.skill.mushoumrfz.getCanUseCard(trigger, player);
				while (true) {
					const {
						result: { bool, links },
					} = await player
						.chooseButton(["【牧兽】：是否使用这些牌？", cards])
						.set("filterButton", button => {
							return _status.event.player.hasUseTarget(button.link);
						})
						.set("ai", button => {
							return _status.event.player.getUseValue(button.link);
						});
					if (!bool) return;
					cards.remove(links[0]);
					player.$gain2(links[0], false);
					player.chooseUseTarget(links[0], true);
					//@ts-ignore
					player.logSkill("mushoumrfz");
					cards = cards.filter(card => {
						return get.position(card, true) == "d" && player.hasUseTarget(card);
					});
					if (cards.length == 0) return;
				}
			},
		},

		//万顷
		guantianmrfz: {
			audio: 2,
			forced: true,
			trigger: { global: "drawBegin" },
			filter: function (event, player) {
				//@ts-ignore
				return _status.currentPhase == player && event.getParent(1).name != "guantianmrfz";
			},
			async content(event, trigger, player) {
				trigger.cancel();
				trigger.player.chooseToGuanxing(trigger.num);
				trigger.player.draw(trigger.num);
			},
		},
		yingfengmrfz: {
			audio: 2,
			trigger: { player: "phaseBeginStart" },
			frequent: true,
			async content(event, trigger, player) {
				var list = Array.from({ length: lib.phaseName.length }, (_, index) => (index + 1).toString());
				const { index } = await player
					.chooseControl(list)
					.set("prompt", "【万顷】:请选择你要跳过的阶段数")
					.set("ai", function () {
						var player = _status.event.player;
						var friend = game.filterPlayer(current => {
							return get.attitude(current, player) > 0;
						});
						var list = _status.event.list;
						if (friend.length > 3 && player.getSkillsList().length > 1) return list.length - 1;
						if (player.countCards("h") <= player.getHandcardLimit() && friend.length > 2) return 3;
						return 1;
					})
					.set("list", list)
					.forResult();
				if (!index) return;
				let phase = [],
					num = index + 1;
				for (var i = 0; i < num; i++) {
					player.skip(lib.phaseName[i]);
					phase.push(lib.phaseName[i]);
				}
				game.log(player, "跳过了", `#y${get.tranPhase(phase)}`);
				player
					.when("phaseEnd")
					.then(async (event, trigger, player) => {
						const result = await player
							.chooseTarget(true, `【应风】:请选择至多${get.cnNumber(index)}名角色，令其摸${get.cnNumber(Math.floor(index / 2))}张牌`, [
								1,
								index,
							])
							.set("ai", target => get.attitude(player, target) > 0)
							.forResult();
						if (result.targets) {
							await game.asyncDraw(result.targets, Math.floor(index / 2));

							const list = player.getSkillsList();
							if (index > 4 && list.length > 0) {
								if (list.length == 1) {
									player.removeSkill(list[0]);
									event.finish();
								} else {
									const { control } = await player
										.chooseControl(list)
										.set("prompt", "【应风】:请选择失去一个技能")
										.set("ai", function () {
											var list = _status.event.list;
											if (list.includes("yingfengmrfz") && list.length > 1) list.remove("yingfengmrfz");
											return list.randomGet();
										})
										.set("list", list)
										.forResult();
									if (control) {
										player.removeSkill(control);
										game.log(player, `失去了技能<span class="yellowtext">【${get.translation(control)}】</span>`);
									}
								}
							}
						}
					})
					.vars({ index: num });
			},
			ai: {
				effect: {
					target: function (card, player, target, current) {
						if (get.type(card) == "delay") return "zeroplayertarget";
					},
				},
			},
		},

		//格劳克斯
		cichongmrfz: {
			audio: 2,
			init: (player, skill) => {
				player.storage.cichongmrfz = [];
			},
			intro: {
				content: (event, player, storage) => {
					return `已经弃置过的类型：${get.translation(player.storage[storage])}`;
				},
			},
			enable: "phaseUse",
			filter: function (event, player) {
				var hs = player.countCards("he", function (card) {
						return !player.storage.cichongmrfz.includes(get.type2(card));
					}),
					bool = false;
				for (var i of game.players) {
					if (player.canUse("sha", i) || i != player) continue;
					bool = true;
					break;
				}
				return hs > 0 && bool;
			},
			filterCard: function (card) {
				var storage = _status.event.player.storage.cichongmrfz;
				return !storage.includes(get.type2(card));
			},
			filterTarget: lib.filter.notMe,
			position: "he",
			async content(event, trigger, player) {
				player.markSkill("cichongmrfz");
				const target = event.targets[0],
					card = event.cards[0];
				player.storage.cichongmrfz.add(get.type2(card));
				const { bool } = await target
					.chooseToDiscard()
					.set("prompt", `【磁冲】:请弃置一张【闪】或防具牌，否则受到来自${get.translation(player)}的一点伤害`)
					.set("filterCard", card => get.name(card, target) == "shan" || get.subtype(card) == "equip2")
					.set("ai", card => get.value(card) < 8)
					.forResult();
				if (bool) return;
				target.damage();
			},
			ai: {
				order: 4,
				result: {
					target: function (player, target) {
						if (get.attitude(player, target) < 0) {
							return -(1 + target.countCards("h") * 0.1 + target.hp * 0.5);
						}
					},
				},
			},
			group: ["cichongmrfz_add", "cichongmrfz_clear"],
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event, trigger, player) {
						player.unmarkSkill("cichongmrfz");
						player.storage.cichongmrfz = [];
					},
				},
				add: {
					forced: true,
					firstDo: true,
					trigger: { source: "damageBegin3" },
					filter: function (event, player) {
						return !player.canUse("sha", event.player) && event.player.isIn();
					},
					async content(event, trigger, player) {
						trigger.num++;
					},
				},
			},
		},
		ganraomrfz: {
			audio: 2,
			init: (player, skill) => {
				player.storage[skill] = [];
			},
			trigger: { source: "damageBegin3" },
			filter: function (event, player) {
				var storage = player.storage.ganraomrfz;
				return !storage.includes(event.player) && event.player.isIn();
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			async content(event, trigger, player) {
				let dialog = ["【干扰】:请选择一张牌"],
					list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type(name) == "equip") list.push(["装备", "", name]);
					else if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				//@ts-ignore
				dialog.push([list, "vcard"]);
				const { links } = await player
					.chooseButton(1, true)
					.set("createDialog", dialog)
					.set("ai", button => {
						var target = _status.event.target;
						if (target.hp < 2) return ["tao", "jiu"].randomGet();
						return ["shan", "wuxie", "tao"].randomGet();
					})
					.set("target", trigger.player)
					.forResult();
				if (!links) return;
				if (!trigger.player.storage.ganraomrfz_ban) trigger.player.storage.ganraomrfz_ban = [];
				trigger.player.storage.ganraomrfz_ban.add(links[0][2]);
				trigger.player.addTempSkill("ganraomrfz_ban", { global: "phaseEnd" });
				player.storage.ganraomrfz.add(trigger.player);
			},
			group: ["ganraomrfz_clear"],
			subSkill: {
				ban: {
					mod: {
						cardEnabled2: function (card, player) {
							if (player.storage.ganraomrfz_ban.includes(get.name(card, player))) return false;
						},
					},
					charlotte: true,
					silent: true,
					onremove: (player, skill) => {
						delete player.storage[skill];
					},
					mark: true,
					intro: {
						content: (event, player, storage) => {
							return `不能使用或打出${get.translation(player.storage[storage])}`;
						},
					},
				},
				clear: {
					charlotte: true,
					silent: true,
					trigger: { global: "phaseEnd" },
					async content(event, trigger, player) {
						player.storage.ganraomrfz = [];
					},
				},
			},
		},

		//海蒂
		anxinmrfz: {
			audio: 2,
			trigger: { global: "gainEnd" },
			filter: function (event, player) {
				if (event.source === undefined || !event.source.isIn()) return false;
				if (event.source != player || !event.cards) return false;
				return event.cards.length > 0;
			},
			async content(event, trigger, player) {
				let num = trigger.cards.length,
					dialog = ["【暗信】:请选择一张牌"],
					list = [],
					count = 0;
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (get.type(name) == "delay" || get.type(name) == "equip") continue;
					if (name == "sha") {
						list.push(["基本", "", "sha"]);
						for (var j of lib.inpile_nature) {
							list.push(["基本", "", "sha", j]);
						}
					} else if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
					else if (get.type(name) == "basic") list.push(["基本", "", name]);
				}
				//@ts-ignore
				dialog.push([list, "vcard"]);
				while (num--) {
					var { links } = await player
						.chooseButton(1, true)
						.set("createDialog", dialog)
						.set("ai", button => {
							var card = {
									name: button.link[2],
									nature: button.link[3],
								},
								player = _status.event.player,
								target = _status.event.target,
								att = _status.event.att,
								num = target.getUseValue(card, undefined, true);
							if (card.name == "jiedao" && att < 0) num -= 10;
							if ((card.name == "tao" || card.name == "shan") && att < 0) num -= 5;
							return num * att;
						})
						.set("target", trigger.player)
						.set("att", get.attitude(trigger.player, player) > 0 ? 1 : -1)
						.forResult();
					if (!links) continue;
					let viewCards = {
						name: links[0][2],
						nature: links[0][3],
					};
					var gaincards = trigger.cards.filter(card => {
							return !card.hasGaintag("anxinmrfz") && get.position(card) == "h";
						}),
						tmpnum = gaincards.length;
					if (gaincards.length == 0) return;
					var { links } =
						gaincards.length == 1
							? { links: gaincards }
							: await player
									.chooseCardButton(
										`【暗信】:请你选择视为${viewCards["nature"] === undefined ? "" : get.translation(viewCards["nature"])}${get.translation(viewCards["name"])}的牌`,
										true,
										gaincards,
										[1, tmpnum]
									)
									.set("ai", () => {
										if (ui.selected.buttons.length == 0) return 1;
										return 0;
									})
									.forResult();
					if (!links) continue;
					for (var i = 0; i < links.length; i++) {
						links[i].gaintag.add("anxinmrfz");
						links[i].storage.anxinmrfz = viewCards;
						//console.log('storage:',links[i].storage);
						//console.log('gaintag:',links[i].gaintag);
					}
					var gaincards = trigger.cards.filter(card => {
						return !card.hasGaintag("anxinmrfz") && get.position(card) == "h";
					});
					if (gaincards.length == 0) return;
				}
			},
			global: "anxinmrfz_views",
			group: ["anxinmrfz_use"],
			subSkill: {
				use: {
					charlotte: true,
					forced: true,
					trigger: { global: "useCardAfter" },
					filter: function (event, player) {
						return event.player.hasHistory("lose", function (evt) {
							if (evt.getParent() != event) return false;
							for (var i in evt.gaintag_map) {
								if (evt.gaintag_map[i].includes("anxinmrfz")) return true;
							}
							return false;
						});
					},
					async content(event, trigger, player) {
						player.draw();
						//@ts-ignore
						player.logSkill("anxinmrfz");
					},
				},
				views: {
					charlotte: true,
					mod: {
						aiOrder: function (player, card, num) {
							if (get.itemtype(card) == "card" && card.hasGaintag("anxinmrfz")) return num + 1;
						},
						cardname: function (card, player) {
							var viewsCard = card.storage.anxinmrfz;
							if (get.itemtype(card) == "card" && card.hasGaintag("anxinmrfz")) return viewsCard.name;
						},
						cardnature(card, player) {
							var viewsCard = card.storage.anxinmrfz;
							if (get.itemtype(card) == "card" && card.hasGaintag("anxinmrfz")) return viewsCard.nature;
						},
					},
				},
			},
		},
		gongchoumrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return game.hasPlayer(current => {
					return current != player && current.countCards("h") > 0;
				});
			},
			filterTarget: function (card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			selectTarget: -1,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let targets = event.targets,
					list = [];
				while (true) {
					if (targets[0].countCards("h") == 0) {
						targets.shift();
						continue;
					}
					var { cards } = await targets[0]
						.chooseCard(true)
						.set("prompt", `【觥筹】:请选择一张牌交给${get.translation(player)}`)
						.set("ai", function (card) {
							return get.value(card) < 6;
						})
						.forResult();
					if (!cards) {
						targets.shift();
						continue;
					}
					targets[0].give(cards, player);
					list.add(targets[0]);
					targets.shift();
					if (targets.length == 0) break;
				}
				if (list.length == 0) return;
				while (true) {
					if (player.countCards("he") == 0) return;
					var { cards } = await player
						.chooseCard(true, "he")
						.set("prompt", `【觥筹】:请选择一张牌交给${get.translation(list[0])}`)
						.set("ai", function (card) {
							return get.value(card) < 6;
						})
						.forResult();
					if (!cards) {
						list.shift();
						continue;
					}
					player.give(cards, list[0]);
					list.shift();
					if (list.length == 0) break;
				}
			},
			ai: {
				order: 13,
				result: {
					player: 1,
				},
			},
		},
		yinshimrfz: {
			mod: {
				targetEnabled: function (card, player, target) {
					var num = 0,
						list = ["h", "j", "e"];
					for (var i = 0; i < list.length; i++) {
						if (target.countCards(list[i]) == 0) continue;
						num++;
					}
					if (player.getHistory("useCard").length < num && _status.currentPhase != target) return false;
				},
			},
			audio: 2,
			trigger: {
				global: "useCard",
			},
			forced: true,
			filter: (event, player) => {
				var num = 0,
					list = ["h", "j", "e"];
				for (var i = 0; i < list.length; i++) {
					if (player.countCards(list[i]) == 0) continue;
					num++;
				}
				return (
					event.player.getHistory("useCard").length < num &&
					_status.currentPhase != player &&
					((event.card.name == "nanman" && player != event.player) ||
						(event.card.name == "wanjian" && player != event.player) ||
						(event.card.name == "taoyuan" && player.hp < player.maxHp) ||
						event.card.name == "wugu")
				);
			},
			content: () => {},
		},

		//崖心
		lingdingmrfz: {
			init: (player, skill) => {
				/*
					[记录的牌的数量,[]中的数字]
					*/
				player.storage[skill] = [0, 1];
			},
			mark: true,
			intro: {
				markcount: "",
				content: (event, player, storage) => {
					return `${player.storage[storage][0]}/${player.storage[storage][1]}`;
				},
			},
			audio: 2,
			direct: true,
			trigger: {
				player: ["respond", "useCard"],
			},
			async content(event, trigger, player) {
				player.storage.lingdingmrfz[0]++;
				let usenum = player.storage.lingdingmrfz[0],
					num = player.storage.lingdingmrfz[1];
				if (usenum < num) return;
				const { bool } = await player
					.chooseBool(`【凌顶】:你可以摸${num}张牌`)
					.set("frequentSkill", "lingdingmrfz")
					.set(
						"prompt2",
						get
							.prompt2("lingdingmrfz")
							.substring(get.prompt2("lingdingmrfz").indexOf("###", get.prompt2("lingdingmrfz").indexOf("###") + 3) + 3)
					)
					.forResult();
				if (!bool) return;
				player.storage.lingdingmrfz[0] = 0;
				if (player.storage.lingdingmrfz[1] < player.maxHp) player.storage.lingdingmrfz[1]++;
				player.draw(num);
				//@ts-ignore
				player.logSkill("lingdingmrfz");
			},
		},
		yabengmrfz: {
			audio: 2,
			trigger: { player: "dying" },
			forced: true,
			async content(event, trigger, player) {
				player.draw(Math.min(2, player.storage.lingdingmrfz[0]));
				player.storage.lingdingmrfz = [0, 0];
			},
		},

		//初雪
		shengnvmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter: function (event, player) {
				return (
					game.countPlayer(current => {
						return current != player;
					}) > 1
				);
			},
			selectTarget: 2,
			filterTarget: lib.filter.notMe,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let targets = event.targets,
					targets2 = [],
					// [<第二名角色的选项>，<第一名角色的选项>]
					csn = [undefined, undefined];
				while (targets.length > 0) {
					var target = targets[0],
						list = [],
						csList = ["收回所有装备区的牌", "将一张手牌当【乐不思蜀】置于你的判定区", "不能响应下一张指定你为目标的基本牌或普通锦囊牌"];
					if (target.countCards("e") > 0) {
						list.push("选项一");
					} else csList[0] = '<span style="opacity:0.5; ">' + csList[0] + "（不可选：装备区没有牌）" + "</span>";
					for (var i of target.getCards("h")) {
						//@ts-ignore
						if (!target.canAddJudge({ name: "lebu", cards: [i] })) continue;
						list.push("选项二");
						break;
					}
					if (!list.includes("选项二"))
						csList[1] = '<span style="opacity:0.5; ">' + csList[1] + "（不可选：无法对自己使用【乐不思蜀】）" + "</span>";
					list.push("选项三");
					if (list.length == 0) continue;
					const { control } = await target
						.chooseControl(list)
						.set("choiceList", csList)
						.set("ai", function () {
							var list = _status.event.list;
							if (list.includes("选项二")) list.remove("选项二");
							return list.randomGet();
						})
						.set("target", target)
						.set("list", list)
						.forResult();
					if (!control) continue;
					//@ts-ignore
					csn[targets.length - 1] = control;
					targets2.add(target);
					switch (control) {
						case "选项一":
							target.gain(target.getCards("e"), "gain2");
							break;
						case "选项二": {
							const { cards } = await target
								.chooseCard(true)
								.set("prompt", "【圣女】:请选择一张手牌当【乐不思蜀】置于你的判定区")
								.set("filterCard", card => {
									//@ts-ignore
									return target.canAddJudge({ name: "lebu", cards: [card] });
								})
								.set("ai", card => {
									return 6 - get.value(card);
								})
								.forResult();
							if (!cards) break;
							target.useCard({ name: "lebu" }, cards, target);
							break;
						}
						case "选项三":
							target.addMark("shengnvmrfz_direct", 1, false);
							break;
					}
					targets.shift();
				}
				if (csn[0] != csn[1]) {
					for (let i of targets2) {
						if (!i.countGainableCards(player, "he")) continue;
						player.gainPlayerCard("he", i, true).set("ai", lib.card.shunshou.ai.button);
					}
				} else player.draw(2);
			},
			ai: {
				order: 13,
				result: {
					target: -1,
				},
			},
			global: "shengnvmrfz_direct",
			subSkill: {
				direct: {
					charlotte: true,
					direct: true,
					intro: {
						content: "不能响应下#张指定你为目标的基本牌或普通锦囊牌",
					},
					trigger: {
						target: "useCardToPlayered",
					},
					filter: function (event, player) {
						//@ts-ignore
						return player.countMark("shengnvmrfz_direct") > 0 && (get.type(event.card) == "basic" || get.type(event.card) == "trick");
					},
					async content(event, trigger, player) {
						//@ts-ignore
						player.logSkill("shengnvmrfz");
						player.removeMark("shengnvmrfz_direct", 1, false);
						//@ts-ignore
						trigger.directHit.add(player);
					},
				},
			},
		},
		shenshemrfz: {
			audio: 2,
			forced: true,
			trigger: { target: "useCardToTargeted" },
			filter: function (event, player) {
				if (player.countCards("h", card => get.is.shownCard(card)) < 1) return false;
				var max = 0,
					shown = player.getCards("h", card => get.is.shownCard(card));
				for (var i of shown) {
					//@ts-ignore
					if ((i?.number || 0) > max) max = i.number;
				}
				var number = get.number(event.card);
				if (number != null && Number(number) > max) return false;
				return event.player.countCards("he") > 0 && event.player != player && get.tag(event.card, "damage") > 0;
			},
			async content(event, trigger, player) {
				let list = [],
					source = trigger.player,
					tranTmp = function (str) {
						var list = ["e", "h"];
						var cn = ["装备", "手牌"];
						for (var i = 0; i < list.length; i++) {
							if (str == list[i]) return cn[i];
						}
					};
				if (source.countCards("h") > 0) list.push("h");
				if (source.countCards("e") > 0) list.push("e");
				let num = list.length;
				if (num == 0) return;
				source
					.chooseToDiscard(true)
					.set("position", "he")
					.set("prompt", `【神慑】:请弃置${list.length > 1 ? tranTmp(list[0]) + "和" + tranTmp(list[1]) : tranTmp(list[0])}区的一张牌`)
					.set("selectCard", num)
					.set("filterCard", card => {
						if (ui.selected.cards.length == 0) return true;
						if (get.position(ui.selected.cards[0]) == "h") return get.position(card) == "e";
						return get.position(card) == "h";
					})
					.set("complexCard", true)
					.set("ai", card => {
						return 8 - get.value(card);
					});
			},
			ai: {
				threaten: 0.6,
			},
			group: "shenshemrfz_show",
			subSkill: {
				show: {
					audio: "shenshemrfz",
					forced: true,
					trigger: { player: "phaseJieshuBegin" },
					filter: function (event, player) {
						return (
							player.countCards("h", card => !get.is.shownCard(card)) > 0 && player.countCards("h", card => get.is.shownCard(card)) == 0
						);
					},
					async content(trigger, event, player) {
						let hs = player.getCards("h", card => !get.is.shownCard(card));
						if (hs.length == 0) return;
						player.addShownCards(hs, "visible_shenshemrfz");
					},
				},
			},
		},

		//狮蝎
		qianzongmrfz: {
			audio: 2,
			trigger: {
				player: "showCharacterAfter",
			},
			direct: true,
			hiddenSkill: true,
			filter: function (event, player) {
				return event.toShow.includes("shixiemrfz");
			},
			async content(event, trigger, player) {
				if (player == _status.currentPhase) {
					let list = ["摸一张牌"];
					if (player.getDamagedHp() > 0) list.push("回复体力");
					list.push("cancel2");
					const { control } = await player
						.chooseControl(list)
						.set("prompt", "【潜踪】:你可以回复一点体力或摸一张牌")
						.set("ai", function () {
							var player = _status.event.player;
							if (player.hp < 3) return "回复体力";
							return "摸一张牌";
						})
						.forResult();
					if (!control || control == "cancel2") return;
					switch (control) {
						case "摸一张牌":
							player.draw();
							break;
						case "回复体力":
							player.recover();
					}
					//@ts-ignore
					player.logSkill("qianzongmrfz");
				} else {
					const { targets } = await player
						.chooseTarget()
						.set("prompt", "【潜踪】:你可以对一名其他角色造成一点伤害")
						.set("filterTarget", lib.filter.notMe)
						.set("ai", function (target) {
							var player = _status.event.player;
							return get.attitude(target, player) < 0;
						})
						.forResult();
					if (!targets) return;
					//@ts-ignore
					player.logSkill("qianzongmrfz", targets[0]);
					targets[0].damage();
				}
			},
			group: "qianzongmrfz_rehidden",
			subSkill: {
				rehidden: {
					direct: true,
					trigger: { player: "phaseEnd" },
					filter: function (event, player) {
						return (
							player.getHistory("lose", function (evt) {
								return evt.type == "discard";
							}).length == 0 && !player.isUnseen()
						);
					},
					async content(trigger, event, player) {
						const { bool } = await player.chooseBool().set("prompt", "【潜踪】:是否进入隐匿状态？").forResult();
						if (bool != true) return;
						player.reUnseen();
					},
				},
			},
		},
		xiedumrfz: {
			mod: {
				cardname(card, player) {
					if (card.name == "du") return "sha";
				},
			},
			audio: 2,
			trigger: { source: "damageSource" },
			filter: function (event, player) {
				return (
					event.player.isIn() &&
					event.player.countCards("he") > 0 &&
					(player != _status.currentPhase || (event.card && event.card.name == "sha"))
				);
			},
			async content(trigger, event, player) {
				var target = event.player;
				const { cards } = await player
					.choosePlayerCard(target, "he", true, 1, "【蝎毒】:请选择一张牌")
					.set("ai", button => {
						return get.value(button.link);
					})
					.forResult();
				if (!cards) return;
				for (var i of cards) {
					if (get.position(i) == "e") {
						target.discard(i);
						continue;
					}
					//@ts-ignore
					i.init([i.suit, i.number, "du"]);
				}
			},
		},
		lijimrfz: {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			mark: true,
			intro: {
				markcount: function (storage, player) {
					let list = [];
					//@ts-ignore
					player.getHistory("useCard", function (evt) {
						list.add(get.suit(evt.card));
					});
					return `${list.length}`;
				},
				content: function (event, player, skill) {
					let list = [];
					//@ts-ignore
					player.getHistory("useCard", function (evt) {
						list.add(get.suit(evt.card));
					});
					return `你使用的【杀】需要${list.length}张【闪】才可抵消<br>已经使用的花色：${get.translation(list)}`;
				},
			},
			forced: true,
			filter(event, player) {
				//@ts-ignore
				return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
			},
			logTarget: "target",
			async content(event, trigger, player) {
				let list = [];
				//@ts-ignore
				await player.getHistory("useCard", function (evt) {
					list.add(get.suit(evt.card));
				});
				const needNum = list.length;
				const id = trigger.target.playerid;
				const map = trigger.getParent()?.customArgs;

				if (!id || !map) return;

				if (!map[id]) map[id] = {};
				if (typeof map[id].shanRequired == "number") {
					map[id].shanRequired = needNum;
				} else {
					map[id].shanRequired = needNum;
				}
			},
			ai: {
				directHit_ai: true,
				skillTagFilter(player, tag, arg) {
					let list = [];
					//@ts-ignore
					player.getHistory("useCard", function (evt) {
						list.add(get.suit(evt.card));
					});
					if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > list.length) return false;
				},
			},
		},

		//红隼
		chihenmrfz: {
			marktext: "护",
			intro: {
				name: "护",
				content: "你有#个‘护’标记",
			},
			audio: 2,
			trigger: { player: "phaseDiscardBegin" },
			forced: true,
			filter: function (event, player) {
				return !player.hasEmptySlot(2);
			},
			async content(event, trigger, player) {
				let num = player.countCards("e");
				const { targets } = await player
					.chooseTarget(`【齿痕】:请选择至多${get.cnNumber(num)}角色，令这些角色获得一个‘护’`)
					.set("selectTarget", function () {
						var num = _status.event.num;
						return [0, num];
					})
					.set("ai", target => {
						var player = _status.event.player;
						return get.attitude(target, player) > 0;
					})
					.set("num", num)
					.forResult();
				if (!targets) return;
				for (var i of targets) {
					i.addMark("chihenmrfz");
				}
			},
			global: "chihenmrfz_eff1",
			group: ["chihenmrfz_eff2"],
			subSkill: {
				eff1: {
					charlotte: true,
					mod: {
						maxHandcard: function (player, num) {
							return (num += player.countMark("chihenmrfz"));
						},
					},
				},
				eff2: {
					audio: "chihenmrfz",
					forced: true,
					trigger: { global: "useCardToTargeted" },
					filter: function (event, player) {
						/*
							event.player 使用者
							event.targets 目标角色
							*/
						if (!get.tag(event.card, "damage") || !event.targets) return false;
						if (player.hp < event.player.hp) return false;
						return event.target.hasMark("chihenmrfz");
					},
					async content(event, trigger, player) {
						let target = trigger.target,
							eff = get.effect(target, trigger.card, trigger.player, trigger.player);
						const { bool } = await trigger.player
							.chooseToDiscard(`【齿痕】:你须弃置一张牌，否则此牌(${get.translation(trigger.card)})对${get.translation(target)}无效`)
							.set("ai", function (card) {
								if (_status.event.eff > 0) return 10 - get.value(card);
								return 0;
							})
							.set("eff", eff)
							.forResult();
						if (bool) {
							target.removeMark("chihenmrfz");
							return;
						}
						//@ts-ignore
						trigger.getParent().excluded.add(target);
						target.removeMark("chihenmrfz");
					},
				},
			},
		},
		haomingmrfz: {
			audio: 2,
			direct: true,
			trigger: { source: "damageSource" },
			usable: 1,
			async content(event, trigger, player) {
				const { control } = await player
					.chooseControl("basic", "trick", "equip", "cancel2")
					.set("prompt", "【号鸣】:请选择你要获得的牌的类型")
					.set("ai", function () {
						var player = _status.event.player;
						if (player.hp < 3) return "basic";
						if (player.countCards("e") >= 3) return ["equip", "trick", "trick", "trick", "basic"].randomGet();
						return ["basic", "trick", "trick", "equip", "equip"].randomGet();
					})
					.forResult();
				if (!control || control == "cancel2") {
					player.storage.counttrigger.haomingmrfz--;
					return;
				}
				//@ts-ignore
				player.logSkill("haomingmrfz");
				var card = get.cardPile2(function (card) {
					return get.type(card, "trick") == control;
				});
				if (card) player.gain(card, "gain2", "log");
				else player.chat(`牌堆中没有${get.translation(control)}牌了！`);
			},
			group: ["haomingmrfz_jd", "haomingmrfz_find"],
			subSkill: {
				ban: {
					charlotte: true,
					mark: true,
					intro: {
						content: "使用牌不能指定有‘护’标记的牌的角色",
					},
					mod: {
						playerEnabled: function (card, player, target) {
							if (target.hasMark("chihenmrfz")) return false;
						},
					},
				},
				jd: {
					trigger: { player: "phaseJieshuBegin" },
					direct: true,
					filter: function (event, player) {
						return player.hasUseTarget("juedou");
					},
					async content(event, trigger, player) {
						const { targets } = await player
							.chooseTarget("【号鸣】:你可以选择一名其他角色，视为对其使用一张【决斗】")
							.set("filterTarget", (card, player, target) => {
								return player.canUse("juedou", target);
							})
							.set("ai", target => {
								var player = _status.event.player,
									eff = get.effect(target, { name: "juedou", isCard: true }, player, player);
								if (eff < 0) return 0;
								return eff;
							})
							.forResult();
						if (!targets) return;
						player
							.when({ global: ["damageEnd", "phaseJieshuAfter"] })
							.filter((event, player) => {
								if (event.name == "phaseJieshu") return true;
								return event.card && event.card.storage.haomingmrfz == true;
							})
							.then(async (event, trigger, player) => {
								if (trigger.name == "phaseJieshu") return;
								var target = trigger.player,
									num = Math.ceil(target.countCards("h") / 2);
								if (num > 0) target.chooseToDiscard(true, num, `【号鸣】:请弃置${get.translation(num)}张手牌`);
								target.addTempSkill("haomingmrfz_ban", { player: "phaseEnd" });
							});
						player.useCard({ name: "juedou", isCard: true, storage: { haomingmrfz: true } }, targets[0]).logSkill = "haomingmrfz";
					},
				},
				find: {
					audio: "haomingmrfz",
					enable: "phaseUse",
					usable: 1,
					filter: function (event, player) {
						return player.countCards("h") > 0;
					},
					prompt: "【号鸣】:你可以弃置任意张手牌，然后从牌堆中获得一张与弃置的牌字数相同的牌",
					filterCard: true,
					selectCard: [1, Infinity],
					check(card) {
						var player = _status.event.player;
						if (player.hp < 3) {
							if (ui.selected.cards.length == 0) return 6 - get.value(card);
							return 0;
						}
						if (!player.hasEmptySlot(2)) {
							if (ui.selected.cards.length < 2) return 6 - get.value(card);
							return 0;
						}
						if (ui.selected.cards.length < 3) return 6 - get.value(card);
						return 0;
					},
					async content(event, trigger, player) {
						let cards = event.cards,
							num = cards.length,
							list = [];
						for (var i of ui.cardPile.childNodes) {
							//@ts-ignore
							if (get.cardNameLength(i) != num) continue;
							list.push(i);
						}
						if (list.length == 0) {
							player.chat(`牌堆中没有字数为${get.cnNumber(num)}的牌！`);
							return;
						}
						const { links } =
							list.length == 1
								? { links: list[0] }
								: await player
										.chooseCardButton("【号鸣】:请选择你要获得的牌", true, list)
										.set("ai", function (button) {
											var name = button.name,
												player = _status.event.player;
											if (player.hp < 3 && name == "tao") return 10;
											return get.value(button);
										})
										.forResult();
						if (!links) return;
						var card = get.cardPile2(function (card) {
							return card == links[0];
						});
						if (card) player.gain(card, "gain2", "log");
						else player.chat(`牌堆中没有${get.translation(links)}了！`);
					},
					ai: {
						order: 5,
						result: {
							player: 1,
						},
					},
				},
			},
		},

		//稀音
		sheyingmrfz: {
			mod: {
				maxHandcard: function (player, num) {
					var bool = false;
					for (var i of game.players) {
						for (var j of [1, 2, 3, 4, 5]) {
							if (i.hasCard(`jingtouE${j}mrfz`, "e")) {
								bool = true;
								break;
							}
						}
					}
					if (bool) return num + 2;
				},
				globalTo(from, to, distance) {
					var bool = false;
					for (var i of game.players) {
						for (var j of [1, 2, 3, 4, 5]) {
							if (i.hasCard(`jingtouE${j}mrfz`, "e")) {
								bool = true;
								break;
							}
						}
					}
					if (bool) return distance + 1;
				},
			},
			audio: 2,
			derivation: ["jingtoumrfz_show"],
			enable: "phaseUse",
			filter: function (event, player) {
				var num = 0;
				for (var i of game.players) {
					for (var j of [1, 2, 3, 4, 5]) {
						if (i.hasCard(`jingtouE${j}mrfz`, "e")) num++;
					}
				}
				return player.countCards("h") > 0 && num < 4;
			},
			usable: 2,
			position: "he",
			filterCard: true,
			filterTarget: lib.filter.notMe,
			check(card) {
				return 6 - get.value(card);
			},
			async content(event, trigger, player) {
				let targets = event.targets,
					list1 = [],
					list2 = [];
				for (let i of [1, 2, 3, 4, 5]) list1.push(`jingtouE${i}mrfz`);
				for (let i of list1) {
					list2.push(["装备", "", i]);
				}
				const { links } = await player
					.chooseButton(["稀音", [list2, "vcard"]], true)
					.set("ai", function (button) {
						var target = _status.event.target,
							list = _status.event.list,
							card = { name: button.link[2] },
							equip = [];
						for (var i of target.getCards("e")) equip.push(get.name(i));
						if (equip.includes(card.name)) return 0;
						if (get.subtype(card) == "equip2") return 5;
						if (get.subtype(card) == "equip1") return 4;
						if (get.subtype(card) == "equip5") return 3;
						if (get.subtype(card) == "equip3" || get.subtype(card) == "equip3") return 2;
						return 1;
					})
					.set("target", targets[0])
					.set("list", list1)
					.forResult();
				if (!links) return;
				var suit,
					list3 = ["heart", "club", "spade", "spade", "diamond"];
				for (var i = 0; i < list1.length; i++) {
					if (links[0][2] == list1[i]) suit = list3[i];
				}
				var card = game.createCard(links[0][2], suit, 7);
				targets[0].$gain2(card);
				game.delayx();
				targets[0].equip(card);
			},
			ai: {
				order: 13,
				result: {
					target: -1,
				},
			},
		},
		chaozaimrfz: {
			audio: 2,
			hasJingtou(player) {
				return this.getJingtou(player).length > 0 ? true : false;
			},
			getJingtou(player) {
				let cards = [];
				let names = Array.from({ length: 5 }, (v, i) => `jingtouE${i + 1}mrfz`);
				for (let card of player.getCards("e")) {
					//@ts-ignore
					if (names.includes(get.name(card))) cards.push(card);
				}
				return cards;
			},
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return game.hasPlayer(current => lib.skill.chaozaimrfz.hasJingtou(current));
			},
			prompt2(event, player) {
				let targets = game.filterPlayer(current => lib.skill.chaozaimrfz.hasJingtou(current));
				let jingtous = [];
				for (let char of game.players) {
					if (targets.includes(char)) jingtous.addArray(lib.skill.chaozaimrfz.getJingtou(char));
				}
				return `你可以弃置${get.translation(targets)}区域中的镜头并摸${jingtous.length}张牌`;
			},
			async content(event, trigger, player) {
				let targets = game.filterPlayer(current => lib.skill.chaozaimrfz.hasJingtou(current));
				let jingtous = [];
				for (let char of game.players) {
					if (targets.includes(char)) jingtous.addArray(lib.skill.chaozaimrfz.getJingtou(char));
				}
				game.cardsDiscard(jingtous);
				player.draw(jingtous.length);
				for (let i of targets) {
					i.addSkill("chaozaimrfz_eff");
					i.storage.chaozaimrfz = player;
				}
			},
			subSkill: {
				eff: {
					mark: true,
					markimage: "extension/WhichWay/image/orther/xiyinchaozaimrfz.png",
					intro: {
						name: "超载",
						content(event, player) {
							let str = `
									·XXX<br>
									·其他角色对你使用牌无次数限制<br>
									·其他角色对你使用牌无距离限制
								`;
							let str2 = `受到的伤害+1`;
							if (player.storage.chaozaimrfz_eff) return str.replace(/XXX/g, `<font color = gray>${str2}（已触发）</font>`);
							return str.replace(/XXX/g, str2);
						},
					},
					global: "chaozaimrfz_eff2",
					firstDo: true,
					direct: true,
					charlotte: true,
					trigger: {
						player: "damageBegin2",
						global: ["dieAfter", "phaseBegin"],
					},
					filter(event, player) {
						if (event.name == "damage") return true;
						return player.storage.chaozaimrfz == event.player;
					},
					async content(event, trigger, player) {
						if (trigger.name == "die" || trigger.name == "phase") {
							player.removeSkill("chaozaimrfz_eff");
							delete player.storage.chaozaimrfz;
							delete player.storage.chaozaimrfz_eff;
						} else if (player.storage.chaozaimrfz_eff != true) {
							trigger.num++;
							//@ts-ignore
							player.logSkill("chaozaimrfz");
							player.storage.chaozaimrfz_eff = true;
							player.when({ global: "phaseEnd" }).then(async (event, trigger, player) => {
								delete player.storage.chaozaimrfz_eff;
							});
						}
					},
				},
				eff2: {
					charlotte: true,
					mod: {
						targetInRange(card, player, target) {
							if (target.hasSkill("chaozaimrfz_eff")) {
								return true;
							}
						},
						cardUsableTarget(card, player, target) {
							if (target.hasSkill("chaozaimrfz_eff")) return true;
						},
					},
				},
			},
		},

		//夜魔
		biaolimrfz: {
			mod: {
				aiOrder(player, card, num) {
					if (get.itemtype(card) == "card" && card.storage && card.storage.biaolimrfz == true) return num + 1;
				},
				cardname(card, player, name) {
					var storage = player.storage.biaolimrfz == "red" ? "tao" : "sha";
					if (card.storage && card.storage.biaolimrfz == true) return storage;
				},
				targetInRange(card, player, target) {
					if (card.storage && card.storage.biaolimrfz == true && get.name(card) == "sha" && target.hp >= player.hp) return true;
				},
			},
			audio: 2,
			forced: true,
			trigger: { player: "phaseUseBegin" },
			async content(event, trigger, player) {
				const result = await player.draw(3).forResult();
				let cards = result.cards;
				if (!cards) return;
				var red = 0;
				for (let i of cards) {
					if (get.color(i) == "red") red++;
					i.storage.biaolimrfz = true;
					i.addGaintag("biaolimrfz");
				}
				if (red > 1) player.storage.biaolimrfz = "red";
				else player.storage.biaolimrfz = "black";
			},
			group: ["biaolimrfz_nocount", "biaolimrfz_set"],
			subSkill: {
				set: {
					charlotte: true,
					silent: true,
					unique: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					filter(event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					async content(event,trigger,player) {
						var enable = lib.card.tao.enable;
						lib.card.tao.enable = function (card, player) {
							if (player.storage.biaolimrfz && player.storage.biaolimrfz == "red" && player.isPhaseUsing()) {
								if (card.storage.biaolimrfz) return true;
								return player.hp < player.maxHp;
							}
							return enable(card, player);
						};
						var selectTarget = lib.card.tao.selectTarget;
						lib.card.tao.selectTarget = function () {
							var player = _status.event.player;
							if (player.storage.biaolimrfz && player.storage.biaolimrfz == "red" && player.isPhaseUsing()) {
								return [1, 1]; //QQQ
							}
							return selectTarget;
						};
						var filterTarget = lib.card.tao.filterTarget;
						lib.card.tao.filterTarget = function (card, player, target) {
							if (player.storage.biaolimrfz && player.storage.biaolimrfz == "red" && player.isPhaseUsing()) {
								if (card.storage.biaolimrfz) return target.hp < target.maxHp;
								return target.hp < target.maxHp && target == player;
							}
							return filterTarget(card, player, target);
						};
					},
				},
				nocount: {
					silent: true,
					trigger: { player: "useCard2" },
					filter(event, player) {
						if (!event.card) return false;
						if (event.card.storage.biaolimrfz != true || get.name(event.card) != "sha") return false;
						for (var i of event.targets) {
							if (player.hp <= i.hp) return true;
						}
						return false;
					},
					async content(event, trigger, player) {
						if (trigger.addCount !== false) {
							trigger.addCount = false;
							trigger.player.getStat().card.sha--;
						}
					},
				},
			},
		},
		ymkongwomrfz: {
			audio: 2,
			direct: true,
			trigger: { player: "phaseDrawEnd" },
			filter(event, player) {
				return player.countCards("he") > 0;
			},
			async content(event, trigger, player) {
				const { bool } = await player
					.chooseToDiscard()
					.set("position", "he")
					.set("prompt", "【控我】:你可以弃置一张牌，然后观看牌堆顶两张牌，并以任意顺序将其置于牌堆顶或牌堆底")
					.set("ai", function (card) {
						var player = _status.event.player;
						if (player.skipList.includes("phaseUse")) return 0;
						if (card.storage.biaolimrfz == true) return 10 - get.value(card);
						return 6 - get.value(card);
					})
					.forResult();
				if (!bool) return;
				//@ts-ignore
				player.logSkill("ymkongwomrfz");
				var cards = get.cards(2);
				game.cardsGotoOrdering(cards);
				const { moved } = await player
					.chooseToMove()
					.set("list", [["牌堆顶", cards], ["牌堆底"]])
					.set("prompt", "点击将牌移动到牌堆顶或牌堆底")
					.set("processAI", function (list) {
						var cards = list[0][1],
							player = _status.event.player;
						var top = [];
						var bottom;
						cards.sort(function (a, b) {
							var a_value = get.color(a, player) == "red" ? 3 : 5,
								b_value = get.color(b, player) == "red" ? 3 : 5,
								hp = player.hp;
							if (hp < 3) {
								if (get.color(a, player) == "red") a_value + 3;
								if (get.color(b, player) == "red") b_value + 3;
							}
							return b_value - a_value;
						});
						while (cards.length) {
							var value = 0;
							if (player.hp < 3) {
								if (get.color(cards[0], player) == "red") value++;
							} else if (get.color(cards[0], player) == "black") value++;
							if (value <= 0) break;
							top.unshift(cards.shift());
						}
						bottom = cards;
						return [top, bottom];
					})
					.forResult();
				if (!moved) return;
				var top = moved[0];
				var bottom = moved[1];
				top.reverse();
				for (var i = 0; i < top.length; i++) {
					ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
				}
				for (i = 0; i < bottom.length; i++) {
					ui.cardPile.appendChild(bottom[i]);
				}
				game.addCardKnower(top, [player]);
				game.addCardKnower(bottom, [player]);
				player.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
				game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
				game.updateRoundNumber();
				let { promise, resolve } = Promise.withResolvers();
				setTimeout(() => {
					resolve(true);
				}, 500);
				await promise;
			},
		},

		//惊蛰
		chunleimrfz: {
			audio: 2,
			trigger: { global: "phaseZhunbeiBegin" },
			direct: true,
			filter(event, player) {
				return player.countCards("he", { color: "black" }) > 0;
			},
			async content(event, trigger, player) {
				const { cards } = await player
					.chooseCard()
					.set("prompt", `【春雷】:你可以弃置一张黑色的牌，对${get.translation(trigger.player)}造成一点雷属性的伤害`)
					.set("filterCard", card => get.color(card) == "black")
					.set("position", "he")
					.set("ai", card => {
						var player = _status.event.player;
						if (get.damageEffect(_status.event.target, player, player, "thunder") > 0) return 6 - get.value(card);
						return 0;
					})
					.set("target", trigger.player)
					.forResult();
				if (!cards) return;
				player.discard(cards);
				trigger.player.damage("thunder");
				//@ts-ignore
				player.logSkill("chunleimrfz", trigger.player);
			},
			ai: {
				expose: 0.1,
				threaten: 1.3,
			},
		},
		zheqimrfz: {
			audio: 2,
			forced: true,
			trigger: { global: "damageEnd" },
			usable: 1,
			filter(event, player) {
				return event.nature && event.nature == "thunder";
			},
			async content(event, trigger, player) {
				var target = _status.currentPhase;
				if (!target) return;
				target.addTempSkill("zheqimrfz_eff1");
				player.addTempSkill("zheqimrfz_eff2", { global: "phaseBegin" });
			},
			subSkill: {
				eff1: {
					mark: true,
					intro: {
						content: "<i>正月启蛰，言发蛰也。万物出乎震，震为雷，故曰惊蛰。是蛰虫惊而出走矣。<br>————《大戴礼记·夏小正》</i>",
					},
					mod: {
						cardUsable(card) {
							if (get.itemtype(card) == "card") return Infinity;
						},
					},
					forced: true,
					charlotte: true,
					trigger: { player: "useCard" },
					filter(event, player) {
						//@ts-ignore
						return event.card && get.type(event.card) != "equip" && player.countCards("h") > 0;
					},
					async content(event, trigger, player) {
						player.chooseToDiscard(true, "【蛰起】:请选择弃置一张手牌").set("ai", card => 6 - get.value(card));
					},
				},
				eff2: {
					audio: "zheqimrfz",
					forced: true,
					charlotte: true,
					trigger: { global: "phaseEnd" },
					getDiscard: function (event, player) {
						var history = event.player.getHistory("lose", function (evt) {
								return evt && evt.type == "discard";
							}),
							cards = [];
						if (history.length == 0) return cards;
						for (var i = 0; i < history.length; i++) {
							var cardsList = history[i].cards;
							for (var j = 0; j < cardsList.length; j++) {
								if (get.position(cardsList[j], true) != "d") continue;
								cards.push(cardsList[j]);
							}
						}
						return cards;
					},
					filter(event, player) {
						var cards = lib.skill.zheqimrfz_eff2.getDiscard(event, player);
						return cards.length > 0;
					},
					async content(event, trigger, player) {
						let cards = lib.skill.zheqimrfz_eff2.getDiscard(trigger, player);
						const { links } = await player
							.chooseButton(["【蛰起】:请选择你要获得的牌", cards])
							.set("forced", true)
							.set("filterButton", button => {
								var player = _status.event.player;
								return !ui.selected.buttons.some(i => get.type2(i, player) == get.type2(button, player));
							})
							.set("selectButton", [1, Infinity])
							.set("ai", button => {
								return _status.event.player.getUseValue(button.link);
							})
							.forResult();
						if (!links) return;
						player.gain(links, "gain2");
					},
				},
			},
			ai: {
				threaten: 1.3,
			},
		},

		//龙舌兰
		pianfengmrfz: {
			audio: 2,
			trigger: { source: "damageSource" },
			filter(event, player) {
				return (
					event.player && event.player.isIn() && event.card.isCard && event.cards.filterInD().length > 0 && event.player.countCards("h") > 0
				);
			},
			prompt(event, player) {
				var num =
					event.player.getHistory("damage", evt => {
						return evt.card && evt.card.name == event.card.name;
					}).length + 1;
				return `【偏锋】:是否令${get.translation(event.player)}回复一点体力并展示其${get.cnNumber(num)}张手牌`;
			},
			check(event, player) {
				var num = event.player.getHistory("damage", evt => {
						return evt.card && evt.card.name == event.card.name;
					}).length,
					//@ts-ignore
					att = get.attitude(event.player.player);
				/*
					if(num<2&&att>0) return true;
					return num>1&&att<0&&event.player.countCards('h')>=num;
					*/
				return att < 0 && event.player.countCards("h") >= num;
			},
			async content(event, trigger, player) {
				let num =
						trigger.player.getHistory("damage", evt => {
							return evt.card && evt.card.name == trigger.card.name;
						}).length + 1,
					target = trigger.player;
				target.recover();
				const { cards } = await player
					.choosePlayerCard()
					.set("selectButton", num)
					.set("forced", true)
					.set("position", "h")
					.set("target", target)
					.set("prompt", `【偏锋】:请选择展示${get.translation(target)}的${get.cnNumber(num)}张牌`)
					.forResult();
				if (!cards) return;
				player.showCards(cards, `${get.translation(player)}展示了${get.translation(target)}的${get.cnNumber(num)}张牌`);
				game.delay();
				let bool = false;
				for (var i of cards) {
					if (get.type2(i) != get.type2(trigger.card)) continue;
					bool = true;
				}
				if (!bool) {
					player.draw(num);
					return;
				}
				target.discard(cards);
				target.loseHp(num);
			},
			ai: {
				threaten: 1.5,
			},
		},

		//阿米娅
		tongganmrfz: {
			audio: 2,
			trigger: {
				global: "drawAfter",
			},
			usable: 3,
			forced: true,
			filter: function (event, player) {
				return event.player !== player;
			},
			async content(event, trigger, player) {
				player.draw();
			},
			group: "tonggan_discardmrfz",
			ai: {
				threaten: 2,
			},
		},
		tonggan_discardmrfz: {
			audio: 2,
			trigger: {
				global: "loseAfter",
			},
			usable: 3,
			filter: function (event, player) {
				if (event.type != "discard") return false;
				return event.player !== player;
			},
			forced: true,
			async content(event, trigger, player) {
				player.chooseToDiscard("he", true, 1);
			},
		},
		qinghemrfz: {
			audio: 2,
			zhuSkill: true,
			trigger: {
				player: "loseAfter",
				global: "loseAsyncAfter",
			},
			filter: function (event, player) {
				if (player == _status.currentPhase) return false;
				return event.type == "discard" && event.getl(player).cards2.length > 0 && !player.hasSkill("qinghemrfz_ban");
			},
			direct: true,
			async content(event, trigger, player) {
				var target = _status.currentPhase;
				if (!target) return;
				const { bool } = await target
					.chooseBool("【亲和】：是否让" + get.translation(player) + "其弃置的牌中的一张牌？")
					.set("ai", () => {
						return get.attitude(_status.currentPhase, _status.event.targetx) > 0;
					})
					.set("targetx", player)
					.forResult();

				if (bool) {
					let target = _status.currentPhase;
					if (!target) return;
					player.addTempSkill("qinghemrfz_ban", "phaseEnd");
					if (trigger.cards.length == 1) {
						player.gain(trigger.cards, "gain2");
						event.finish();
					}
					if (trigger.cards.length > 1) {
						const result = await target
							.chooseButton(["选择获得令其获得其中的一张牌", trigger.cards.slice(0)], true)
							.set("ai", button => get.value(button.link))
							.forResult();
						if (result.links) {
							//@ts-ignore
							player.logSkill("qinghemrfz");
							player.gain(result.links, "gain2");
						}
					}
				}
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
			},
		},

		//doc 医生
		yizhemrfz: {
			mod: {
				ignoredHandcard: function (card, player) {
					if (get.name(card) == "tao") {
						return true;
					}
				},
				cardDiscardable: function (card, player, name) {
					if (name == "phaseDiscard" && get.name(card) == "tao") return false;
				},
			},
			init() {
				var enable = lib.card.tao.enable;
				lib.card.tao.enable = function (card, player) {
					if (player.hasSkill("yizhemrfz")) {
						return true;
					}
					return enable(card, player);
				};
				var selectTarget = lib.card.tao.selectTarget;
				lib.card.tao.selectTarget = function () {
					var player = _status.event.player;
					if (player.hasSkill("yizhemrfz")) {
						return [1, 1]; //QQQ
					}
					return selectTarget;
				};
				var filterTarget = lib.card.tao.filterTarget;
				lib.card.tao.filterTarget = function (card, player, target) {
					if (player.hasSkill("yizhemrfz")) {
						return target.hp < target.maxHp && (player.inRange(target) || player == target);
					}
					return filterTarget(card, player, target);
				};
				lib.card.tao.content = async function (event, trigger, player) {
					const { target } = event;
					if (player.hasSkill("yizhemrfz")) {
						var num = target.getDamagedHp();
						target.recover(5);
						if (5 - num > 0) {
							target.addSkill("yizhemrfz_eff");
							target.storage.yizhemrfz_eff = 5 - num;
							target.changeHujia(5 - num);
						}
					} else target.recover();
				};
			},
			audio: 2,
			trigger: {
				global: "phaseBefore",
				player: "enterGame",
			},
			filter(event, player) {
				return event.name != "phase" || game.phaseNumber == 0;
			},
			forced: true,
			async content(event, trigger, player) {
				var cards = [];
				if (ui.cardPile.childNodes.length < 1) return;
				for (var i of ui.cardPile.childNodes) {
					if (cards.length > 2) break;
					//@ts-ignore
					if (i.name == "tao") cards.push(i);
				}
				if (cards.length > 0) player.gain(cards, "gain2");
				else player.chat("byd怎么开局牌堆中的桃就没了？");
			},
			subSkill: {
				eff: {
					mark: true,
					intro: {
						content(event, player) {
							return `你因【桃】而获得的护甲数:${player.storage.yizhemrfz_eff}`;
						},
					},
					charlotte: true,
					silent: true,
					trigger: { global: "roundStart" },
					async content(event, trigger, player) {
						if (!player.hujia) return;
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff > 0) {
							player.storage.yizhemrfz_eff--;
							player.changeHujia(-1);
							player.popup("失去护甲");
							game.log(player, "失去了一点因【桃】而获得的护甲值");
						}
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff == 0) {
							player.removeSkill("yizhemrfz_eff");
							delete player.storage.yizhemrfz_eff;
							player.unmarkSkill("yizhemrfz_eff");
						}
					},
					group: "yizhemrfz_lose",
				},
				lose: {
					trigger: { player: "damageEnd" },
					filter: function (event, player) {
						return event.hujia;
					},
					charlotte: true,
					silent: true,
					async content(event, trigger, player) {
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff > 0) {
							player.storage.yizhemrfz_eff--;
						}
						if (player.storage.yizhemrfz_eff && player.storage.yizhemrfz_eff == 0) {
							player.removeSkill("yizhemrfz_eff");
							delete player.storage.yizhemrfz_eff;
							player.unmarkSkill("yizhemrfz_eff");
						}
					},
				},
			},
		},
		zhulimrfz: {
			mod: {
				cardname(card, player, name) {
					if (card.hasGaintag("zhulimrfz")) return "tao";
				},
			},
			audio: 2,
			trigger: { player: "phaseJieshuBegin" },
			forced: true,
			async content(event, trigger, player) {
				if (player.getStat("damage") != undefined) {
					if (player.countCards("he") > 0) player.chooseToDiscard("he", true, `【医者】:请选择弃置一张牌`);
				} else {
					const result = await player.draw(2).forResult();
					if (!result) return;
					var cards = result.cards;
					if (!cards) return;
					for (var i of cards) {
						var num = get.number(i);
						//@ts-ignore
						if (get.suit(i) == "heart" && num >= 2 && num <= 9) {
							i.addGaintag("zhulimrfz");
						}
					}
				}
			},
		},

		//inna 双月
		shuangzimrfz: {
			audio: 2,
		},

		//凛视
		/** @type { Skill } */
		jiangtumrfz: {
			audio: 2,
			direct: true,
			trigger: { player: ["gainPlayerCardBegin", "discardPlayerCardBegin", "choosePlayerCardBegin"] },
			filter(event, player) {
				return _status.currentPhase == event.target;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.logSkill("jiangtumrfz", _status.currentPhase);
				trigger.visible = true;
			},
			ai: {
				threaten: 1.1,
				viewHandcard: true,
				skillTagFilter(player, tag, arg) {
					if (tag === "viewHandcard" && arg !== _status.currentPhase) return false;
				},
			},
		},
		/** @type { Skill } */
		jieshimrfz: {
			mod: {
				aiOrder: function (player, card, num) {
					var list = player.storage.jieshimrfz;
					if (typeof card == "object" && player.isPhaseUsing() && list && list.length > 0) {
						if (get.type2(card) == list[0]) return num + 10;
					}
				},
			},
			audio: 3,
			trigger: { global: "phaseUseBegin" },
			filter(event, player) {
				return player.countCards("he") > 0;
			},
			direct: true,
			async content(event, trigger, player) {
				const { cards } = await player
					.chooseToDiscard("he")
					.set(
						"prompt",
						`【揭示】:你可以弃置一张牌，然后猜测${trigger.player == player ? "你" : get.translation(trigger.player)}本阶段前三张牌分别使用的类型（对${trigger.player == player ? "你" : get.translation(trigger.player)}不可见）。`
					)
					.set("ai", function (card) {
						return 8 - get.value(card);
					})
					.forResult();
				if (!cards) return;
				//@ts-ignore
				player.logSkill("jieshimrfz");
				var list = [
					["待选择的牌的类型", [["basic", "basic", "basic", "trick", "trick", "trick", "equip", "equip", "equip"], "vcard"]],
					["请调整顺序<br>从左到右:第一、二、三张牌", []],
				];
				const { moved } = await player
					.chooseToMove(`【揭示】:请猜测${trigger.player == player ? "你" : get.translation(trigger.player)}本阶段前三张牌分别使用的类型`)
					.set("list", list)
					.set("filterMove", function (from, to, moved) {
						return (to == 1 && moved[1].length < 3) || to == 0 || typeof to !== "number";
					})
					.set("processAI", () => {
						var moved = [[114514], []],
							//@ts-ignore
							cards = _status.currentPhase.getCards("h"),
							order = [
								[0, 0],
								[0, 0],
								[0, 0],
							];
						for (var i of cards) {
							for (var j = 0; j < order.length; j++) {
								if (get.order(i) > order[j][1]) {
									order[j] = [i, get.order(i)];
									break;
								}
							}
						}
						for (var i of order) {
							//@ts-ignore
							moved[1].push(["ByTheLeaderOne", "作者：林登万", get.type2(i[0])]);
						}
						return moved;
					})
					.forResult();
				if (!moved) return;
				const listx = moved[1].map(i => i[2]);
				trigger.player.addTempSkill("jieshimrfz_eff", { player: "phaseUseEnd" });
				trigger.player.storage.jieshimrfz = listx;
				//@ts-ignore
				trigger.player.storage.jieshimrfz_eff = player;
				//@ts-ignore
				_status.tmpTotal_jieshimrfz = 0;
			},
			subSkill: {
				eff: {
					onremove(player) {
						delete player.storage.jieshimrfz;
						delete player.storage.jieshimrfz_eff;
						//@ts-ignore
						delete _status.tmpTotal_jieshimrfz;
					},
					direct: true,
					charlotte: true,
					mark: true,
					intro: {
						content(event, player) {
							var storage = player.storage.jieshimrfz;
							if (storage === "error") return `未知错误`;
							if (game.me === player && game.me.hasSkill("jieshimrfz") && storage.length > 0) return get.translation(storage);
							if (storage.length == 0) return "全部已猜测完毕";
							return `剩余${storage.length}张`;
						},
					},
					trigger: { player: "useCardAfter" },
					filter(event, player) {
						if (!player.storage.jieshimrfz_eff.isIn()) return false;
						return player.storage.jieshimrfz && player.storage.jieshimrfz.length > 0;
					},
					async content(event, trigger, player) {
						if (!_status.tmpTotal_jieshimrfz) _status.tmpTotal_jieshimrfz = 0;
						var target = player.storage.jieshimrfz_eff;
						if (get.type2(trigger.card) == player.storage.jieshimrfz[0]) {
							_status.tmpTotal_jieshimrfz++;
							if (_status.tmpTotal_jieshimrfz == 3 && target != player) player.chat("被看穿了吗？");
							else if (_status.tmpTotal_jieshimrfz == 3) player.chat("我猜的真准！");
							target.logSkill("jieshimrfz", player);
							target.popup("猜测正确");
							target.draw(_status.tmpTotal_jieshimrfz);
							if (_status.tmpTotal_jieshimrfz > 1) {
								var num = Math.min(_status.tmpTotal_jieshimrfz - 1, 1);
								const { bool } = await target
									.chooseBool(`【揭示】:是否对${get.translation(player)}造成${get.cnNumber(num)}点伤害？`)
									.set("ai", () => get.damageEffect(target, player) > 0)
									.forResult();
								if (bool) player.damage(num, target);
							}
						} else {
							if (target == player)
								player.chat(
									"<img style='width:100px;height:100px' src=" +
										lib.assetURL +
										"extension/WhichWay/image/skill/jieshiError.png></img>"
								);
							target.popup("猜测错误");
						}
						player.storage.jieshimrfz.shift();
					},
				},
			},
		},

		//医疗阿米娅
		tongqingmrfz: {
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: function (player, skill) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("tongqingmrfzx");
				});
				if (cards.length) {
					player.lose(cards, ui.discardPile);
					player.$throw(cards, 1000);
					game.log(cards, "进入了弃牌堆");
				}
			},
			marktext: "情绪",
			intro: {
				name: "情绪",
				mark(dialog, content, player) {
					var cards = player.getCards("s", function (card) {
						return card.hasGaintag("tongqingmrfzx");
					});
					if (!cards || cards.length < 1) {
						dialog.addText(`没有‘情绪’`);
					} else {
						dialog.addText(`共有${cards.length}张‘情绪’`);
						dialog.addSmall(cards);
					}
				},
			},
			audio: 2,
			trigger: { global: "phaseJieshuBegin" },
			getDiscard: function (event, player) {
				let cards = [];
				for (var character of game.players) {
					var history = character.getHistory("lose", function (evt) {
						return evt && evt.type == "discard";
					});
					if (history.length == 0) continue;
					for (var i = 0; i < history.length; i++) {
						var cardsList = history[i].cards;
						for (var j = 0; j < cardsList.length; j++) {
							if (get.position(cardsList[j], true) != "d") continue;
							cards.push(cardsList[j]);
						}
					}
				}
				return cards;
			},
			filter(event, player) {
				let cardsList = lib.skill.tongqingmrfz.getDiscard(event, player);
				return cardsList && cardsList.length > 0;
			},
			prompt2(event, player) {
				let cardsList = lib.skill.tongqingmrfz.getDiscard(event, player),
					cards = player.getCards("s", function (card) {
						return card.hasGaintag("tongqingmrfzx");
					});
				return `【恸请】:你可以将所有的‘情绪’（${cards.length > 0 ? `共有${cards.length}张‘情绪’` : "没有‘情绪’"}）置入弃牌堆，然后将${get.translation(cardsList)}置于你的武将牌上，称之为‘情绪’`;
			},
			check(event, player) {
				let cardsList = lib.skill.tongqingmrfz.getDiscard(event, player),
					cards = player.getCards("s", function (card) {
						return card.hasGaintag("tongqingmrfzx");
					});
				if (cards.length < 1) return true;
				return get.value(cardsList) - get.value(cards) > 0;
			},
			async content(event, trigger, player) {
				var cards = player.getCards("s", function (card) {
					return card.hasGaintag("tongqingmrfzx");
				});
				if (cards && cards.length > 0) {
					await player.loseToDiscardpile(cards);
				}
				let cardsList = lib.skill.tongqingmrfz.getDiscard(trigger, player);
				game.log(player, "将", cardsList.length, "张牌置于在武将牌上");
				player.loseToSpecial(cardsList, "tongqingmrfzx");
				player.markSkill("tongqingmrfz");
			},
		},
		cibeimrfz: {
			audio: 2,
			trigger: { player: "loseAfter" },
			filter(event, player) {
				var position = event.cards.map(i => i.original);
				return position.every(item => item != "h");
			},
			direct: true,
			async content(event, trigger, player) {
				const { targets } = await player
					.chooseTarget()
					.set("prompt", `【慈悲】:你可以令你攻击范围内的一名角色或你回复一点体力或摸一张牌`)
					.set("filterTarget", (card, player, target) => {
						return player.inRange(target) || target == player;
					})
					.set("ai", target => get.attitude(_status.event.player, target) > 0)
					.forResult();
				if (!targets) return;
				let target = targets[0];
				if (target.getDamagedHp() < 1) {
					target.draw();
					player.logSkill("cibeimrfz", target);
					return;
				}
				const { control } = await player
					.chooseControl("回复体力", "摸一张牌")
					.set("prompt", `【慈悲】:请选择一项`)
					.set("ai", () => 0)
					.forResult();
				if (!control) return;
				if (control == "回复体力") {
					target.recover();
				} else target.draw();
				player.logSkill("cibeimrfz", target);
			},
		},

		// 异格芬 历战锐枪芬
		xiaozhimrfz: {
			audio: 2,
			trigger: {
				player: "useCardToPlayered",
			},
			check: function (event, player) {
				return get.attitude(player, event.target) < 0;
			},
			filter: function (event, player) {
				return event.card.name == "sha" && player.canCompare(event.target);
			},
			logTarget: "target",
			async content(event, trigger, player) {
				var result = await player.chooseToCompare(trigger.target).forResult();
				if (!result || !result.cards) return;
				result = result.cards;
				if (result.winner != player) player.draw(2);
				if (result.winner != trigger.target) {
					var cards = [result.player, result.target];
					cards = cards.filter(card => player.hasUseTarget(card) && !get.owner(card));
					if (cards.length) {
						var { links } = await player
							.chooseButton(["是否使用其中的牌？", cards])
							.set("ai", button => _status.event.player.getUseValue(button.link))
							.forResult();
						if (links) {
							var card = links[0];
							player.$gain2(card, false);
							game.delayx();
							player.chooseUseTarget(true, card, false);
						}
					}
					//@ts-ignore
					trigger.getParent().directHit.add(trigger.target);
				}
			},
		},
		zhishoumrfz: {
			audio: 2,
			enable: "chooseToUse",
			filterCard(card) {
				return get.itemtype(card) == "card" && card.hasGaintag("zhishoumrfz");
			},
			subfrequent: ["addcount"],
			position: "h",
			viewAs(cards, player) {
				if (cards.length) {
					if (_status.currentPhase == player) return { name: "sha" };
					return { name: "shan" };
				}
				return null;
			},
			viewAsFilter(player) {
				if (!player.countCards("h", card => card.hasGaintag("zhishoumrfz"))) return false;
			},
			prompt(event) {
				return `【执守】:将本轮出牌阶段内获得的牌当作${_status.currentPhase === event.player ? "【闪】" : "【杀】"}使用`;
			},
			check(card) {
				return 7 - get.value(card);
			},
			onremove(player) {
				player.removeGaintag("zhishoumrfz");
			},
			ai: {
				order: 2,
				respondShan: true,
				respondSha: true,
				skillTagFilter(player, tag, arg) {
					if (arg == "respond" || !player.countCards("h", card => _status.connectMode || card.hasGaintag("zhishoumrfz"))) return false;
				},
				result: {
					player: 1,
				},
			},
			group: ["zhishoumrfz_mark", "zhishoumrfz_addcount"],
			subSkill: {
				addcount: {
					audio: "zhishoumrfz",
					trigger: { player: "gainAfter" },
					lastDo: true,
					frequent: true,
					filter(event, player) {
						var evt = event.getParent("phaseDraw");
						if (player.hasSkill("zhishoumrfz_eff")) return false;
						if (evt && evt.player == player) return false;
						return event.getg(player).length > 0;
					},
					prompt: "【执守】:是否令本轮使用【杀】的次数+1？",
					check() {
						return true;
					},
					async content(event, trigger, player) {
						player.addTempSkill("zhishoumrfz_eff", { global: "roundStart" });
					},
				},
				eff: {
					mark: true,
					intro: {
						content: "使用【杀】的次数+1",
					},
					charlotte: true,
					mod: {
						cardUsable(card, player, num) {
							if (card.name == "sha") return num + 1;
						},
					},
				},
				mark: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "roundStart",
						player: "gainBegin",
					},
					filter(event, player) {
						if (event.name == "gain") return player.isPhaseUsing();
						else return game.roundNumber > 1;
					},
					async content(event, trigger, player) {
						if (trigger.name == "gain") trigger.gaintag.add("zhishoumrfz");
						else player.removeGaintag("zhishoumrfz");
					},
				},
			},
		},

		// 海霓
		jingchaomrfz: {
			audio: 2,
			trigger: { player: "damageEnd" },
			filter(event, player) {
				return player.countCards("he") > 1;
			},
			check(event, player) {
				if (player.getDamagedHp() < 1) return false;
				return 3 - player.getDamagedHp() + player.getCards("he", card => get.value(card) < 7).length;
			},
			async cost(event, trigger, player) {
				const { result } = await player
					.chooseToDiscard(2, "he")
					.set("prompt2", `你可以弃置两张牌并回复${trigger.num}点体力，若你弃置的牌类别不同，你将手牌补至5张`)
					.set("ai", card => {
						var player = get.event().player,
							selected = ui.selected.cards,
							num = get.value(card);
						for (var i of selected) {
							if (get.type2(i) == get.type2(card)) num - 3;
							else num + 2;
						}
						return 7 - num + player.getDamagedHp();
					});
				event.result = result;
			},
			async content(event, trigger, player) {
				let cards = event.cards;
				player.recover(trigger.num);
				if (cards.length != 2) return;
				if (get.type2(cards[0]) != get.type2(cards[1])) {
					//@ts-ignore
					player.drawTo(5);
					player.tempBanSkill("jingchaomrfz", "phaseEnd", false);
					game.log(this, "的技能", `#g【静潮】`, `本回合失效了`);
				}
			},
			ai: {
				maixie_hp: true,
				threaten: 0.8,
			},
		},
		cehuimrfz: {
			init(player, skill) {
				player.storage[skill] = 0;
			},
			audio: 2,
			mark: true,
			intro: {
				content: "本回合开始时手牌数为：#",
			},
			trigger: {
				global: "phaseJieshuBegin",
			},
			getDiscardCards(event) {
				let cards = [];
				for (var i of game.players.slice().concat(game.dead)) {
					var history = i.getHistory("lose", function (evt) {
						return evt && evt.type == "discard";
					});
					if (history.length == 0) continue;
					for (var k of history) {
						if (k.cards.length == 0) continue;
						for (var j of k.cards) {
							if (get.position(j) != "d") continue;
							cards.push(j);
						}
					}
				}
				return cards;
			},
			filter(event, player) {
				var cards = lib.skill.cehuimrfz.getDiscardCards(event);
				if (!game.hasPlayer(current => current != player && player.canCompare(current, true, false))) return false;
				return player.countCards("h") != player.storage.cehuimrfz && cards.length > 0;
			},
			async cost(event, trigger, player) {
				var cards = lib.skill.cehuimrfz.getDiscardCards(trigger);
				const result = await player
					.chooseCardButton(cards)
					.set("prompt2", `你可以选择一张牌并与一名其他角色进行拼点，若你赢，你使用牌堆顶3张牌`)
					.set("ai", link => get.number(link))
					.forResult();
				//@ts-ignore
				result.cost_data = result.links;
				event.result = result;
			},
			async content(event, trigger, player) {
				let card = event.cost_data[0];
				var { targets } = await player
					.chooseTarget(true)
					.set("prompt", `【测绘】:请选择一名其他角色进行拼点`)
					.set("filterTarget", (card, player, target) => target != player && player.canCompare(target, true, false))
					.set("ai", target => {
						var player = get.event().player;
						return get.attitude(player, target) < 0;
					})
					.forResult();
				if (!targets) return;
				var tmpfuc = async function () {
					let next = player.chooseToCompare(targets[0]);
					if (!next.fixedResult) next.fixedResult = {};
					next.fixedResult[player.playerid] = card;
					return next;
				};
				var next = await tmpfuc();
				if (next.result.bool) {
					var cards = game.cardsGotoOrdering(get.cards(3)).cards;
					player.showCards(cards, `${get.translation(player)}展示了牌堆顶三张牌`);
					let canUse = cards.filter(i => player.hasUseTarget(i, false));
					if (canUse.length == 0) return;
					while (canUse.length > 0) {
						const { links } =
							canUse.length == 1
								? { links: canUse }
								: await player
										.chooseCardButton(canUse, true)
										.set("prompt", `【测绘】:请选择你要使用的牌`)
										.set("ai", link => get.number(link))
										.forResult();
						if (!links) continue;
						await player
							.chooseUseTarget(links[0])
							.set("nodistance", true)
							.set("prompt", `请选择${get.translation(links[0])}的目标`);
						canUse.remove(links[0]);
					}
				}
			},
			group: ["cehuimrfz_record"],
			subSkill: {
				record: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBegin",
					},
					async content(event, trigger, player) {
						if (typeof player.storage.cehuimrfz !== "number") player.storage.cehuimrfz = 0;
						player.storage.cehuimrfz = player.countCards("h");
					},
				},
			},
		},

		// 深巡
		yuchaomrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return game.hasPlayer(current => current != player && player.canCompare(current, true, false)) && player.countCards("hej") > 0;
			},
			filterTarget(card, player, target) {
				return player.canCompare(target, true, false) && target != player;
			},
			selectTarget: [1, 2],
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				let targets = event.targets;
				const { links } = await player
					.choosePlayerCard(player, "hej", true)
					.set("prompt", `【御潮】:请选择你的拼点牌`)
					.set("ai", function (button) {
						var card = button.link;
						var player = get.event().player,
							num = 0;
						if (get.position(card) == "j") num += 3 + get.value(card) / 2;
						if (get.position(card) == "e") num -= 2;
						return get.number(card) + num - get.value(card) / 2;
					})
					.forResult();
				if (!links) return;
				let next = player.chooseToCompare(targets);
				if (!next.fixedResult) next.fixedResult = {};
				next.fixedResult[player.playerid] = links[0];
				next.callback = lib.skill.yuchaomrfz.callback;
			},
			async callback(event, trigger, player) {
				if (event.num1 < event.num2) player.link(true);
				else if (event.num1 > event.num2) {
					event.target.link(true);
					player.addTempSkill("yuchaomrfz_eff", "phaseEnd");
				} else {
					event.target.link(true);
					player.link(true);
				}
			},
			subSkill: {
				eff: {
					charlotte: true,
					mod: {
						cardUsableTarget(card, player, target) {
							if (target.isLinked()) return true;
						},
					},
				},
			},
			ai: {
				order: 8,
				result: {
					target: -1,
					player: 1,
				},
			},
		},
		yanhuimrfz: {
			audio: 2,
			derivation: ["binglinchengxia"],
			trigger: { player: "phaseUseBegin" },
			forced: true,
			filter(event, player) {
				var card = get.autoViewAs({ name: "binglinchengxia" }, [_status.pileTop]);
				return player.canAddJudge(card);
			},
			async content(event, trigger, player) {
				await player.addJudge({ name: "binglinchengxia" }, [_status.pileTop]);
				player.draw(player.hp);
				player.loseHp();
			},
		},

		// 明椒
		suozemrfz: {
			mark: true,
			intro: {
				content(event, player) {
					return `记录的牌名：${player.storage.suozemrfz.length > 0 ? get.translation(player.storage.suozemrfz) : "无"}`;
				},
			},
			audio: 2,
			init(player, skill) {
				player.storage[skill] = [];
			},
			trigger: {
				player: ["useCardEnd", "respondEnd"],
			},
			filter(event, player) {
				if (event.cards.length < 1) return false;
				return !player.storage.suozemrfz.includes(event.card.name) && (get.type2(event.card) == "basic" || get.type(event.card) == "trick");
			},
			prompt2(event, player) {
				return `是否记录${get.translation(event.card)}，然后观看牌堆顶${player.maxHp}张牌，并用等量手牌交换其中至多${player.storage.suozemrfz.length + 1}张牌？`;
			},
			async content(event, trigger, player) {
				player.storage.suozemrfz.add(trigger.card.name);
				game.log(player, `的`, `#g【索赜】`, `记录了`, trigger.card.name);
				var cards = get.cards(player.maxHp);
				let cardsc = cards.slice(0);
				const { moved } = await player
					.chooseToMove(`【索赜】:请选择你要交换的牌（至多交换${player.storage.suozemrfz.length}张牌）`)
					.set("filterMove", (from, to) => {
						return typeof to !== "number";
					})
					.set("list", [
						["牌堆顶", cardsc],
						["你的手牌", player.getCards("h")],
					])
					.set("filterOk", moved => {
						let h = get.event().cardsh;
						return h.filter(i => moved[0].includes(i)).length <= get.event().num;
					})
					.set("processAI", list => {
						var player = get.event().player;
						let cards1 = list[0][1].slice(),
							cards2 = player.getCards("h");

						if (cards2.length === 0) {
							return [cards1, []];
						}

						let maxC = Math.max(...cards1.map(i => get.value(i)));
						let minH = Math.min(...cards2.map(i => get.value(i)));

						let count = 0,
							num = get.event().num;

						while (minH < maxC && count < num) {
							count++;

							let maxCIndex = cards1.map(i => get.value(i)).indexOf(maxC);

							let minHIndex = cards2.map(i => get.value(i)).indexOf(minH);

							[cards1[maxCIndex], cards2[minHIndex]] = [cards2[minHIndex], cards1[maxCIndex]];

							maxC = Math.max(...cards1.map(i => get.value(i)));
							minH = Math.min(...cards2.map(i => get.value(i)));
						}
						return [cards1, cards2];
					})
					.set("num", player.storage.suozemrfz.length)
					.set("cardsh", player.getCards("h"))
					.forResult();
				const puts = player.getCards("h", i => moved[0].includes(i));
				const gains = cardsc.filter(i => moved[1].includes(i));
				if (puts.length && gains.length) {
					player.$throw(puts.length, 1000);
					await player.lose(puts, ui.special);
					await player.gain(gains, "giveAuto");
				}
				cardsc = moved[0].slice();
				if (cardsc.length) {
					await game.cardsGotoOrdering(cardsc);
					for (let i = cardsc.length - 1; i >= 0; i--) {
						ui.cardPile.insertBefore(cardsc[i], ui.cardPile.firstChild);
					}
					game.log(get.cnNumber(cardsc.length, true), "张牌被放回了牌堆顶");
					game.updateRoundNumber();
				}
			},
		},
		youyimrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseJieshuBegin" },
			filter(event, player) {
				return player.storage.suozemrfz.length > 0;
			},
			async content(event, trigger, player) {
				var list = [];
				for (var i = 0; i < lib.inpile.length; i++) {
					var name = lib.inpile[i];
					if (!player.storage.suozemrfz.includes(name)) continue;
					if (get.type(name) == "basic") list.push(["基本", "", name]);
					else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
				}
				let { links } = await player
					.chooseButton([`游移:请移除${Math.ceil(list.length / 2)}张牌`, [list, "vcard"]], true)
					.set("selectButton", Math.ceil(list.length / 2))
					.set("ai", button => {
						return _status.event.player.getUseValue(button.link, null, true);
					})
					.forResult();
				if (!links) return;
				player.storage.suozemrfz.removeArray(links.map(i => i[2]));
				let names = links.filter(i => player.hasUseTarget(i[2])).map(i => [get.translation(get.type(i[2])), "", i[2]]);
				if (names.length < 1) return;

				let { links2 } =
					names.length == 1
						? { links2: names }
						: await player
								.chooseButton(["游移:请选择一张你要使用的牌", [names, "vcard"]], true)
								.set("ai", button => {
									return _status.event.player.getUseValue({ name: button.link[2] }, undefined, true);
								})
								.forResult();
				player.chooseUseTarget({ name: links2[0][2] }, true);
			},
		},

		// 戴菲恩
		zhuofengmrfz: {
			audio: 2,
			usable: 1,
			enable: "phaseUse",
			filter(event, player) {
				return player.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				let list = [];
				if (player.getCards("h", { color: "red" }).length) list.push("red");
				if (player.getCards("h", { color: "black" }).length) list.push("black");
				list.push("cancel2");
				const { control } = await player
					.chooseControl(list)
					.set("prompt", `是否发动【濯锋】？`)
					.set("prompt2", `你可以重铸手牌中一种颜色的所有牌，若你重铸了不少于2张牌，你摸一张牌，然后你视为本回合没有使用过【杀】。`)
					.set("ai", () => {
						let player = get.player(),
							list = get.event().list;
						let value = get.value(player.getCards("h", { color: "red" })) - get.value(player.getCards("h", { color: "black" }));
						if (list.length > 2) {
							if (value > 0) return "red";
							return "black";
						} else {
							if (get.value(player.getCards("h")) < 20) return list[0];
							return "cancel2";
						}
					})
					.set("list", list)
					.forResult();
				if (control === "cancel2") {
					delete player.getStat("skill")["zhuofengmrfz"];
					return;
				}
				let cards = player.getCards("h").filter(i => get.color(i) == control && player.canRecast(i));
				if (!cards) return;
				player.recast(cards);
				if (cards.length >= 2) player.draw();
				if (player.getStat("card")["sha"]) {
					//@ts-ignore
					delete player.getStat("card")["sha"];
				}
			},
			ai: {
				order: 3,
				result: {
					player: 1,
				},
			},
		},
		qianggongmrfz: {
			mod: {
				targetInRange(card, player, target, now) {
					let mark = player.getStat("card")["sha"];
					if (card.name == "sha" && (!mark || mark == 0)) return true;
				},
			},
			audio: 2,
			trigger: {
				player: "useCard",
				source: "damageEnd",
			},
			filter(event, player) {
				let mark = player.getStat("card")["sha"],
					storage = player.storage.qianggongmrfz;
				if (event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
				if (mark && mark > 1) return false;
				return event.card && event.card.name == "sha" && (!storage || event.card == storage);
			},
			forced: true,
			async content(event, trigger, player) {
				if (!player.storage.qianggongmrfz) {
					player.storage.qianggongmrfz = trigger.card;
					player
						.when({
							global: "phaseBegin",
							player: "useCardAfter",
						})
						.filter((event, player) => {
							let storage = player.storage.qianggongmrfz;
							if (event.name == "phase") return true;
							return event.card && storage && event.card == storage;
						})
						.then(async (event, trigger, player) => {
							delete player.storage.qianggongmrfz;
						});
				}

				if (trigger.name == "useCard") {
					if (typeof trigger.baseDamage != "number") trigger.baseDamage = 1;
					trigger.baseDamage++;
				} else {
					delete player.storage.qianggongmrfz;
					let skills = player.getStockSkills(true, true);
					const { control } = await player
						.chooseControl(skills)
						.set("prompt", "【抢攻】:请选择你要重置的技能")
						.set("ai", () => {
							let list = get.event().list,
								suffixs = ["used", "round", "block", "blocker"],
								skills = [];
							if (list.includes("zhuofengmrfz")) return "zhuofengmrfz";
							for (let skill of list) {
								let info = get.info(skill);
								for (let key of suffixs) {
									if (info[key]) skills.push(skill);
								}
							}
							if (skills.length == 0) skills.push(list[0]);
							return skills.randomGet();
						})
						.set("list", skills)
						.forResult();
					if (!control) return;
					let skillx = [control];
					game.expandSkills(skillx);
					var resetSkills = [];
					var suffixs = ["used", "round", "block", "blocker"];
					for (var skill of skillx) {
						var info = get.info(skill);
						if (typeof info.usable == "number") {
							if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
								delete player.storage.counttrigger[skill];
								resetSkills.add(skill);
							}
							if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
								delete player.getStat("skill")[skill];
								resetSkills.add(skill);
							}
						}
						if (info.round && player.storage[skill + "_roundcount"]) {
							delete player.storage[skill + "_roundcount"];
							resetSkills.add(skill);
						}
						if (player.storage[`temp_ban_${skill}`]) {
							delete player.storage[`temp_ban_${skill}`];
						}
						if (player.awakenedSkills.includes(skill)) {
							player.restoreSkill(skill);
							resetSkills.add(skill);
						}
						for (var suffix of suffixs) {
							if (player.hasSkill(skill + "_" + suffix)) {
								player.removeSkill(skill + "_" + suffix);
								resetSkills.add(skill);
							}
						}
					}
					if (resetSkills.length) {
						var str = "";
						for (var i of resetSkills) {
							str += "【" + get.translation(i) + "】、";
						}
						game.log(player, "重置了技能", "#g" + str.slice(0, -1));
					}
				}
			},
		},

		// 锡人
		suximrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter(event, player) {
				let cards = event.card.cards.filter(i => player.hasUseTarget(i, false, false) && get.position(i) == "d");
				return !event.card.isCard && event.card.cards.length > 0 && cards.length > 0;
			},
			frequent: true,
			async content(event, trigger, player) {
				let cards = trigger.card.cards.filter(i => player.hasUseTarget(i, false, false) && get.position(i) == "d");
				while (cards.length > 0) {
					const { links } =
						cards.length == 1
							? { links: cards }
							: await player
									.chooseCardButton("【宿锡】:请选择你要使用的牌", cards)
									.set("ai", button => get.player().getUseValue(button, undefined, true))
									.forResult();
					if (!links) return;
					await player.chooseUseTarget(links[0]).set("nodistance", true).set("addCount", false);
					cards.remove(links[0]);
				}
			},
		},
		sanzhongmrfz: {
			init(player, skill) {
				player.storage[skill] = {
					basic: false,
					trick: false,
					equip: false,
				};
			},
			maps: {
				basic: "tao",
				trick: "shunshou",
				equip: "wuzhong",
			},
			onremove: true,
			audio: 2,
			enable: "chooseToUse",
			hiddenCard: function (player, name) {
				const maps = lib.skill.sanzhongmrfz.maps;
				if (!Object.values(maps).includes(name)) return false;
				for (let key in maps) {
					if (name == maps[key] && player.countCards("hes", { type: key }) > 0) return true;
				}
			},
			filter(event, player) {
				const types = Object.entries(player.storage.sanzhongmrfz)
					.filter(([key, value]) => value === false)
					.map(([key, value]) => key);
				const maps = lib.skill.sanzhongmrfz.maps;
				if (types.length < 1) return false;
				for (let type of types) {
					if (
						player.countCards("hes", { type: type }) < 1 ||
						!event.filterCard(get.autoViewAs({ name: maps[type] }, "unsure"), player, event)
					)
						continue;
					return true;
				}
			},
			chooseButton: {
				dialog: function (event, player) {
					const maps = lib.skill.sanzhongmrfz.maps;
					const swapped = {};
					Object.keys(maps).forEach(key => {
						swapped[maps[key]] = key;
					});
					let list = [];
					for (let name of Object.values(maps)) {
						if (event.filterCard && event.filterCard({ name: name }, player, event)) {
							if (player.storage.sanzhongmrfz[swapped[name]] != false) continue;
							if (player.countCards("hes", { type: swapped[name] }) < 1) continue;
							if (get.type2(name) == "trick") {
								list.push(["锦囊", "", name]);
							} else if (get.type(name) == "basic") {
								list.push(["基本", "", name]);
							}
						}
					}
					return ui.create.dialog("三众", [list, "vcard"]);
				},
				check: function (button) {
					//@ts-ignore
					if (_status.event.getParent().type != "phase") return 1;
					var player = _status.event.player;
					return player.getUseValue({
						name: button.link[2],
					});
				},
				backup: function (links, player) {
					return {
						filterCard(card) {
							const player = get.player();
							const maps = lib.skill.sanzhongmrfz.maps;
							const swapped = {};
							Object.keys(maps).forEach(key => {
								swapped[maps[key]] = key;
							});
							const name = lib.skill.sanzhongmrfz_backup.card;
							return get.type2(card) == swapped[name];
						},
						audio: "sanzhongmrfz",
						popname: true,
						check: function (card) {
							return 8 - get.value(card);
						},
						position: "hse",
						viewAs: { name: links[0][2] },
						card: links[0][2],
						precontent: function () {
							const maps = lib.skill.sanzhongmrfz.maps;
							const swapped = {};
							Object.keys(maps).forEach(key => {
								swapped[maps[key]] = key;
							});
							const name = lib.skill.sanzhongmrfz_backup.card;

							let type = swapped[name];
							player.storage.sanzhongmrfz[type] = true;
						},
					};
				},
				prompt: function (links, player) {
					const swapped = {};
					const maps = lib.skill.sanzhongmrfz.maps;
					const name = links[0][2];
					Object.keys(maps).forEach(key => {
						swapped[maps[key]] = key;
					});
					return `将一张${get.translation(swapped[name])}牌当做${get.translation(name)}使用`;
				},
			},
			group: "sanzhongmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: { global: "phaseBegin" },
					async content(event, trigger, player) {
						//@ts-ignore
						lib.skill.sanzhongmrfz.init(player, "sanzhongmrfz");
					},
				},
			},
			ai: {
				order: 1,
				result: {
					player: function (player) {
						if (_status.event.dying) return get.attitude(player, _status.event.dying);
						return 1;
					},
				},
			},
		},

		// 莎草
		lanjuanmrfz: {
			intro: {
				content(event, player) {
					let storage = player.storage.lanjuanmrfz;

					let nameList = storage["name"].length > 0 ? storage["name"] : "无";
					let numberList = storage["number"].length > 0 ? storage["number"] : "无";
					let suitTranslation = storage["suit"].length > 0 ? get.translation(storage["suit"]) : "无";

					if (Array.isArray(nameList)) {
						nameList.sort((a, b) => a.length - b.length);
					}

					if (Array.isArray(numberList)) {
						numberList.sort((a, b) => a - b);
					}

					return `
    					    ·牌名: ${get.translation(nameList)}<br>
    					    ·点数: ${get.translation(numberList)}<br>
    					    ·花色: ${suitTranslation}
    					`;
				},
			},
			mark: true,
			init(player, skill) {
				player.storage[skill] = {
					name: [],
					suit: [],
					number: [],
				};
			},
			onremove: true,
			audio: 2,
			trigger: {
				player: ["useCardAfter", "respondAfter", "phaseDrawBegin2"],
			},
			filterType(card, player, modify) {
				let storage = player.storage.lanjuanmrfz;
				let result = {
					name: [],
					suit: [],
					number: [],
				};

				const maps = {
					name: lib.inpile,
					suit: lib.suit,
					number: Array.from({ length: 13 }, (v, i) => i + 1),
				};

				function checkAndAdd(type) {
					const value = get[type](card);
					if (!storage[type].includes(value)) {
						result[type].push(value);
						result[type] = result[type].filter(item => new Set(maps[type]).has(item));
					}
				}

				checkAndAdd("name");
				checkAndAdd("suit");
				checkAndAdd("number");

				if (modify) {
					player.storage.lanjuanmrfz = {
						name: [...result.name, ...storage.name],
						suit: [...result.suit, ...storage.suit],
						number: [...result.number, ...storage.number],
					};
					return result;
				}

				const intersection = (arr1, arr2) => arr1.filter(item => new Set(arr2).has(item));

				return result.name.length > 0 || result.suit.length > 0 || result.number.length > 0;
			},
			filter(event, player) {
				if (event.name == "phaseDraw") {
					let count = Object.values(player.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
					return !event.numFixed && Math.pow(count, 1 / 3) >= 1;
				} else return event.card && lib.skill.lanjuanmrfz.filterType(event.card, player, false);
			},
			direct: true,
			async content(event, trigger, player) {
				// 毒哑莎草的嗓子(
				if (_status.poison_suocaoSJZX != true) {
					player.logSkill("lanjuanmrfz");
					_status.poison_suocaoSJZX = true;
					setTimeout(() => delete _status.poison_suocaoSJZX, 3000);
				}
				if (trigger.name == "phaseDraw") {
					let count = Object.values(player.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
					trigger.num += Math.floor(Math.pow(count, 1 / 3));
				} else lib.skill.lanjuanmrfz.filterType(trigger.card, player, true);
			},
			mod: {
				maxHandcard: function (player, num) {
					let count = Object.values(player.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
					return num + Math.floor(Math.pow(count, 1 / 3));
				},
			},
		},
		xinglumrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			findCards(info) {
				const { name, suit, number } = info;
				const filter = function (card) {
					return get.number(card) == number && get.suit(card) == suit && get.name(card) == name;
				};
				let list = [];
				for (let i = 0; i < ui.cardPile.childNodes.length; i++) {
					var j = i;
					if (j >= ui.cardPile.childNodes.length) j -= ui.cardPile.childNodes.length;
					if (filter(ui.cardPile.childNodes[j])) {
						list.push(ui.cardPile.childNodes[j]);
					}
				}
				return list;
			},
			getResult(info) {
				const { name, suit, number } = info;
				let cardsList = [];
				for (let keyName of name) {
					for (let keySuit of suit) {
						for (let keyNum of number) {
							let find = lib.skill.xinglumrfz.findCards({ name: keyName, suit: keySuit, number: keyNum });
							if (find.length > 0) cardsList.push(find);
						}
					}
				}
				return cardsList;
			},
			filter(event, player) {
				let storage = player.storage.lanjuanmrfz;
				return storage["name"].length > 0 && storage["suit"].length > 0 && storage["number"].length > 0;
			},
			async content(event, trigger, player) {
				const storage = player.storage.lanjuanmrfz;

				const { control } = await player
					.chooseControl("自动选择", "手动选择")
					.set("prompt", "【行路】:是否让系统自动为你提供方案？")
					.set("ai", () => "自动选择")
					.forResult();
				if (control === "自动选择") {
					let cards = lib.skill.xinglumrfz.getResult(storage);
					const maxIndex = cards.map(i => player.getUseValue(i)).indexOf(Math.max(...cards.map(i => player.getUseValue(i))));
					if (cards.length < 1) {
						player.popup("没有符合条件的组合");
						return;
					}
					let control = [];
					for (let i = 0; i < cards.length; i++) {
						control.push([i, `第${get.cnNumber(i + 1, true)}组`]);
					}
					let dialogAuto = [
						`【行路】:请选择一个组合<br>推荐选择第${get.cnNumber(maxIndex + 1, true)}组(${get.translation(cards[maxIndex])})`,
						[control, "tdnodes"],
					];

					for (let i = 0; i < cards.length; i++) {
						dialogAuto.addArray([`第${get.cnNumber(i + 1, true)}组`, cards[i]]);
					}
					const result = !event.isMine()
						? { links: [maxIndex] }
						: await player.chooseButton().set("createDialog", dialogAuto).set("cards", cards).forResult();
					if (!result || !result.links) return;
					player.gain(cards[result.links[0]], "gain2", "log");
					return;
				}

				let dialog = ["【行路】:请选择牌名、花色和数字各一个"];
				dialog.addArray(["待选择的牌名", [storage.name.slice().map(i => [get.type2(i), "", i]), "vcard"]]);
				dialog.addArray(["待选择的花色", [storage.suit.slice().map(i => [i, get.translation(i)]), "tdnodes"]]);
				dialog.addArray([
					"待选择的数字",
					[
						storage.number
							.slice()
							.sort((a, b) => a - b)
							.map(i => [i, i]),
						"tdnodes",
					],
				]);

				const { links } = await player
					.chooseButton()
					.set("createDialog", dialog)
					.set("filterButton", button => {
						let list = ui.selected.buttons;
						if (Array.isArray(button.link) && list.some(item => Array.isArray(item.link))) return false;
						else if (typeof button.link === "number" && list.some(item => typeof item.link === "number")) return false;
						else if (typeof button.link === "string" && list.some(item => typeof item.link === "string")) return false;
						return true;
					})
					.set("selectButton", 3)
					.forResult();
				if (!links) return;
				const info = {
					name: links.filter(i => Array.isArray(i)).map(i => i[2]),
					suit: links.filter(i => typeof i === "string"),
					number: links.filter(i => typeof i === "number"),
				};
				let cards = lib.skill.xinglumrfz.findCards(info);
				if (cards.length > 0) player.gain(cards, "gain2", "log");
				else {
					player.popup("没有符合条件的组合");
				}
			},
			ai: {
				order: 1,
				result: {
					player: 1,
				},
			},
		},

		// 莱欧斯
		shijianmrfz: {
			audio: 2,
			derivation: ["jianzhumrfz"],
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return player.countCards("he") > 0 && !player.isDisabled(1) && !player.hasCard(card => card.name == "jianzhumrfz", "e");
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseToDiscard(`【拾剑】:你可以弃置一张牌，将【剑助】置入你的武器栏`, "he")
					.set("ai", card => {
						return 6 - get.value(card);
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const card = game.createCard("jianzhumrfz", "spade", 12);
				player.$gain2(card);
				player.equip(card);
			},
			ai: {
				threaten: 0.8,
			},
		},
		shimomrfz: {
			audio: 2,
			init(player, skill) {
				player.storage[skill] = {};
				const translates = {
					2: '富甲<font color="red">目标+</font>',
					3: '空巢<font color="red">摸牌</font>',
					4: '残躯<font color="red">伤害+</font>',
				};
				for (let i = 2; i <= 4; i++) {
					lib.translate[skill + "_" + i] = translates[i];
				}
			},
			onremove: true,
			mark: true,
			proficiency: new Proxy(
				{
					baka: '<font color = "#FFFFFF">一无所知</font>',
					master: '<font color = "#FF0000">融会贯通</font>',
					1: '<font color="#FFCCCC">已有耳闻</font>',
					2: '<font color="#FF9999">略知一二</font>',
					3: '<font color="#FF6666">初步掌握</font>',
					4: '<font color="#FF3333">烂熟于心</font>',
				},
				{
					get(target, prop) {
						if (typeof prop !== "symbol") {
							const value = Number(prop);
						} else {
							return target["baka"];
						}
						if (!isNaN(value)) {
							if (value < 1) return target["baka"];
							if (value > 4) return target["master"];
							return target[value];
						}
						return target["baka"];
					},
				}
			),
			intro: {
				name: "莱欧斯的魔物宝典",
				content: function (event, player) {
					const storage = player.storage.shimomrfz;
					let intro = [];
					if (storage === undefined) return "没有记录的魔物";
					const sorted = Object.entries(storage)
						.sort((a, b) => b[1] - a[1])
						.map(([key, value]) => ({ key, value }));
					for (let obj of sorted) {
						intro.push(`【${get.translation(obj["key"])}】是${lib.skill.shimomrfz.proficiency[obj["value"]]}（${obj["value"]}）`);
					}
					return `莱欧斯对‘魔物’:<br>` + intro.join("<br>");
				},
			},
			trigger: { player: "gainAfter" },
			direct: true,
			async content(event, trigger, player) {
				// 毒哑莱欧斯的嗓子
				if (_status.poison_laiousiSJZX != true) {
					player.logSkill("shimomrfz");
					_status.poison_laiousiSJZX = true;
					setTimeout(() => delete _status.poison_laiousiSJZX, 3000);
				}
				const cards = trigger.cards,
					storage = player.storage.shimomrfz;
				for (let card of cards) {
					let name = get.name(card);
					storage.hasOwnProperty(name) ? player.storage.shimomrfz[name]++ : (player.storage.shimomrfz[name] = 1);
					if (storage.hasOwnProperty(name)) {
						let num = storage[name];
						if (num < 2) continue;
						if (num > 4) num = 4;
						for (let i = 2; i <= num; i++) player.addGaintag(card, `shimomrfz_${i}`);
					}
				}
			},
			group: "shimomrfz_yingbian",
			subSkill: {
				yingbian: {
					audio: "shimomrfz",
					silent: true,
					trigger: { player: "yingbian" },
					filter(event, player) {
						return (
							event.card.isCard &&
							player.hasHistory("lose", evt => {
								return (
									evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.join(" ").includes("shimomrfz_"))
								);
							})
						);
					},
					async content(event, trigger, player) {
						let tags;
						player.getHistory("lose", evt => {
							if (evt.getParent() != trigger) return;
							const maps = evt.gaintag_map;
							for (let key in maps) {
								if (maps[key].join(" ").includes("shimomrfz_")) tags = maps[key];
							}
						});
						const index = Math.max(...tags.filter(i => /^shimomrfz_\d+$/.test(i)).map(i => Number(i.replace(/\D+/g, ""))));
						if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
						trigger.temporaryYingbian.add("force");
						if (index >= 2 && player.satisfyYingbian("fujia", trigger)) {
							trigger.temporaryYingbian.add("add");
						}
						if (index >= 3 && player.satisfyYingbian("kongchao", trigger)) {
							trigger.temporaryYingbian.add("draw");
						}
						if (index >= 4 && player.satisfyYingbian("canqu", trigger)) {
							trigger.temporaryYingbian.add("damage");
						}
					},
				},
			},
		},

		// 森西
		micaimrfz: {
			audio: 2,
			trigger: {
				global: ["loseAfter", "loseAsyncAfter"],
			},
			usable: 1,
			filter(event, player) {
				if (event.type != "discard" || event.position != ui.discardPile || event.player == player) return false;
				let cards = event.getd();
				if (!cards.filter(card => get.position(card, true) == "d").length) return false;
				return true;
			},
			async cost(event, trigger, player) {
				let cards = trigger.getd().filter(i => get.position(i, true) == "d");
				event.result = await player
					.chooseCardButton("【觅材】:你可以获得一张牌", cards)
					.set("ai", button => get.value(button))
					.forResult();
				event.result.cost_data = event.result;
			},
			async content(event, trigger, player) {
				player.gain(event.cost_data.links, "gain2");
			},
		},
		beicaimrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			init(player, skill) {
				player.storage[skill] = {};
			},
			onremove: true,
			filter(event, player) {
				return player.countCards("h", card => get.cardNameLength(card) > 1) > 0;
			},
			lessNameLength(card) {
				const list = [];
				const original = get.cardNameLength(card);
				for (let name of lib.inpile) {
					if (get.cardNameLength(name) >= original) continue;
					list.push([get.translation(get.type(name)), "", name]);
					if (name == "sha") {
						for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
					}
				}
				return list;
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseCard("h")
					.set("prompt2", "你可以将一张手牌视为任意小于此牌字数的一张牌。")
					.set("prompt", "是否发动【备材】？")
					.set("filterCard", card => get.cardNameLength(card) > 1)
					.set("ai", card => {
						const player = get.player();
						if (get.cardNameLength(card) < 2) return -1;
						const less = lib.skill.beicaimrfz.lessNameLength(card).map(i => i[2]);
						if (!Array.isArray(less.filter(i => player.getUseValue(i) > player.getUseValue(card)))) return -1;
						let OptimalSolution = less.filter(i => player.getUseValue(i) > player.getUseValue(card)) || null;
						if (OptimalSolution === null || OptimalSolution.length < 1) return -1;
						OptimalSolution = OptimalSolution.reduce((a, b) => (player.getUseValue(a) >= player.getUseValue(b) ? a : b)) || null;
						return OptimalSolution ? player.getUseValue(OptimalSolution) - player.getUseValue(card) : -1;
					})
					.forResult();
			},
			async content(event, trigger, player) {
				const list = lib.skill.beicaimrfz.lessNameLength(event.cards[0]);
				const { links } = await player
					.chooseButton([`备材<br>把${get.translation(event.cards)}视为：`, [list, "vcard"]], true)
					.set("ai", button => {
						const player = get.player(),
							card = {
								name: button.link[2],
								nature: button.link[3],
							};
						return player.getUseValue(card, null, true);
					})
					.forResult();
				if (!links) return;
				player.addGaintag(event.cards, "beicaimrfzx");
				if (!player.storage.beicaimrfz) player.storage.beicaimrfz = {};
				player.storage.beicaimrfz[event.cards[0].cardid] = { name: links[0][2], nature: links[0][3] };
			},
			mod: {
				cardname(card, player, name) {
					const storage = player.storage.beicaimrfz;
					if (card.hasGaintag("beicaimrfzx") && Object.keys(storage).includes(card.cardid) && storage[card.cardid]["name"])
						return storage[card.cardid]["name"];
				},
				cardnature(card, player) {
					const storage = player.storage.beicaimrfz;
					if (card.hasGaintag("beicaimrfzx") && Object.keys(storage).includes(card.cardid) && storage[card.cardid]["nature"])
						return storage[card.cardid]["nature"];
				},
			},
			group: "beicaimrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: { player: "loseAfter" },
					filter(event, player) {
						return Object.keys(player.storage.beicaimrfz).length > 0;
					},
					async content(event, trigger, player) {
						const hs = player.getCards("he").map(card => card.cardid);
						for (let id in player.storage.beicaimrfz) {
							if (!hs.includes(id)) delete player.storage.beicaimrfz[id];
						}
					},
				},
			},
		},
		pengcaimrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterCard(card) {
				const player = get.player();
				return !ui.selected.cards.some(cardx => get.type2(cardx, player) == get.type2(card, player));
			},
			selectCard: 2,
			filterTarget(card, player, target) {
				return player.canUse("wugu", target);
			},
			selectTarget: [1, 4],
			check(card) {
				return 8 - get.value(card);
			},
			complexCard: true,
			discard: false,
			lose: false,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				player.storage.pengcaimrfz = event.targets.slice();
				await player.useCard({ name: "wugu", pengcaimrfz: true }, event.targets, event.cards, false, "pengcaimrfz");
				const store = player.storage.pengcaimrfz;
				if (!Array.isArray(store)) return;
				let type = [];
				for (let i = 0; i < store.length; i++) {
					let target = store[i][0],
						cards = store[i][1];
					if (!event.targets.includes(target) || !cards) continue;
					type.push(...cards.map(i => get.type2(i)));
				}
				let SetType = new Set(type.slice());
				if (SetType.size !== type.length) return;
				await player.useCard({ name: "wugu", pengcaimrfz: true }, event.targets, event.cards, false, "pengcaimrfz");
				delete player.storage.pengcaimrfz;
			},
			group: ["pengcaimrfz_wugu"],
			global: "pengcaimrfz_eff",
			subSkill: {
				eff: {
					silent: true,
					charlotte: true,
					trigger: { player: "yingbian" },
					filter(event, player) {
						return (
							event.card.isCard &&
							event.player.hasHistory(
								"lose",
								evt => evt.getParent() == event && Object.values(evt.gaintag_map).some(value => value.includes("pengcaimrfzx"))
							)
						);
					},
					async content(event, trigger, player) {
						if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
						trigger.temporaryYingbian.add("force");
						trigger.temporaryYingbian.addArray(get.yingbianEffects());
					},
				},
				wugu: {
					silent: true,
					charlotte: true,
					lastDo: true,
					trigger: { global: "gainAfter" },
					filter(event, player) {
						const evt = event.getParent();
						return (
							evt &&
							evt.card &&
							evt.card.pengcaimrfz &&
							player.storage.pengcaimrfz &&
							player.storage.pengcaimrfz.some(i => (Array.isArray(i) ? i[0] == event.player : i == event.player))
						);
					},
					async content(event, trigger, player) {
						const cards = trigger.cards.filter(i => get.itemtype(i) == "card");
						player.storage.pengcaimrfz[player.storage.pengcaimrfz.indexOf(trigger.player)] = [trigger.player, cards];
						trigger.player.addGaintag(cards, "pengcaimrfzx");
					},
				},
			},
			ai: {
				order: 13,
				threaten: 1.8,
				result: {
					target: 1,
					player: 1,
				},
			},
		},

		// 奇尔查克
		tangongmrfz: {
			audio: 2,
			trigger: { player: ["drawBegin", "damageBegin3"] },
			init(player, skill) {
				player.storage[skill] = [];
			},
			filter(event, player) {
				return event.num > 0 && !player.storage.tangongmrfz.includes(event.name);
			},
			createDialog(id, showCards) {
				var dialog = ui.create.dialog("hidden");
				(dialog.textPrompt = dialog.add("探宫")).style.textAlign = "center";
				dialog.cards = [];
				dialog.rawButtons = [];
				dialog.videoId = id;
				var cards = [];
				for (var y = 0; y < 3; y++) {
					for (var x = 0; x < 3; x++) {
						var card = ui.create.card(null, null, true);
						card.pos = y * 3 + x;
						card.pos_x = x;
						card.pos_y = y;
						cards.push(card);
						dialog.rawButtons.push(card);
					}
					dialog.add(cards);
					cards = [];
				}
				for (var i of dialog.buttons) {
					i.pos_x = i.link.pos_x;
					i.pos_y = i.link.pos_y;
					i.link = i.link.pos;
				}

				// 放弃选择
				// dialog.addAuto([['放弃选择'],"tdnodes"]);

				// 展示待选择的牌
				showCards = showCards ? showCards : game.cardsGotoOrdering(get.cards(9)).cards;

				showCards.map(i => (i.tangongmrfz = true));

				dialog.addAuto("待选择的牌");

				dialog.showCards = showCards;

				dialog.add(showCards);

				dialog.open();
			},
			addCard(card, id, pos) {
				var dialog = get.idDialog(id);
				if (!dialog) return;
				for (var i = 0; i < dialog.buttons.length; i++) {
					var button = dialog.buttons[i];

					if (button.link == pos) {
						var card2 = ui.create.button(card, "card");
						card2.pos = button.link;
						card2.pos_x = button.pos_x;
						card2.pos_y = button.pos_y;
						card2.classList.add("noclick");
						button.parentNode.insertBefore(card2, button);
						dialog.cards.push(card2);
						button.remove();
						dialog.buttons.splice(i, 1);
					} else if (get.itemtype(button.link) == "card") {
						if (button.link == card) {
							button.remove();
							dialog.showCards.remove(card);
							break;
						}
					}
				}
			},
			changePrompt(str, id) {
				var dialog = get.idDialog(id);
				if (!dialog) return;
				dialog.textPrompt.innerHTML = str;
			},
			getValidMatrix(suits) {
				function isValid(matrix, row, col, value) {
					for (let i = 0; i < col; i++) {
						if (matrix[row][i] === value) {
							return false;
						}
					}
					for (let i = 0; i < row; i++) {
						if (matrix[i][col] === value) {
							return false;
						}
					}
					return true;
				}

				// 回溯函数：尝试构建3x3矩阵
				function backtrack(matrix, suits, row, col) {
					if (row === 3) {
						return true;
					}

					let nextRow = col === 2 ? row + 1 : row;
					let nextCol = (col + 1) % 3;

					for (let i = 0; i < suits.length; i++) {
						let suit = suits[i];

						if (isValid(matrix, row, col, suit)) {
							matrix[row][col] = suit;

							let remainingSuits = suits.slice(0, i).concat(suits.slice(i + 1));

							if (backtrack(matrix, remainingSuits, nextRow, nextCol)) {
								return true;
							}

							// 如果无法填充成功，则回溯
							matrix[row][col] = null;
						}
					}

					return false;
				}

				let matrix = Array.from({ length: 3 }, () => Array(3).fill(null));

				// 尝试构建3x3矩阵
				if (backtrack(matrix, suits, 0, 0)) {
					return matrix;
				}

				return false;
			},
			async content(event, trigger, player) {
				// 限制每回合发动次数
				if (!player.storage.tangongmrfz) player.storage.tangongmrfz = [];
				player.storage.tangongmrfz.add(trigger.name);

				let autoMode = false;
				const { bool } = await player
					.chooseBool(`是否让系统帮你组方阵？`)
					.set("ai", () => true)
					.forResult();
				if (bool) autoMode = true;

				let next = game.createEvent("cardsGotoOrdering");
				next.cards = [];
				next.setContent("cardsGotoOrdering");
				event.videoId = lib.status.videoId++;
				event.forceDie = true;
				event.cards = [];
				event.positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
				let showCards = game.cardsGotoOrdering(get.cards(12)).cards;
				game.broadcastAll(
					function (id, showCards) {
						lib.skill.tangongmrfz.createDialog(id, showCards);
					},
					event.videoId,
					showCards.slice()
				);
				let autoSelected = lib.skill.tangongmrfz.getValidMatrix(showCards.slice().map(i => get.suit(i)));
				let cards = [];

				while (showCards.length > 0) {
					let str = "请将一张牌放置到方阵中";
					if (player == game.me || player.isUnderControl()) {
						lib.skill.tangongmrfz.changePrompt(str, event.videoId);
					} else if (player.isOnline()) {
						player.send(
							function (str, id) {
								lib.skill.tangongmrfz.changePrompt(str, event.videoId);
							},
							str,
							id
						);
					}
					let links;
					if ((player.isUnderControl() || game.me == player) && !autoMode) {
						// if(false){
						const result1 = await player
							.chooseButton()
							.set("filterOk", button => {
								const selected = ui.selected.buttons.slice().map(i => get.itemtype(i.link) || typeof i.link);
								return selected.includes("card") && selected.includes("number");
							})
							.set("dialog", event.videoId)
							.set("filterButton", function (button) {
								return true;
							})
							.set("selectButton", 2)
							.set("autoSelected", autoSelected)
							.set("showCards", showCards)
							.set("cards", cards.slice())
							.forResult();
						links = result1.links;
					} else {
						if (!autoSelected) {
							player.popup("探索失败");
							game.broadcastAll("closeDialog", event.videoId);
							return;
						}
						let posx = cards.slice(0).map(i => i[1]);
						links = [];
						let selectedList = [...autoSelected[0], ...autoSelected[1], ...autoSelected[2]];
						for (let i = 0; i < 9; i++) {
							if (posx.includes(i)) continue;
							let getValidSuit = showCards.filter(j => get.suit(j) == selectedList[i])[0];
							links.push(getValidSuit, i);
							break;
						}
					}
					if (!links) {
						player.popup("探索失败");
						game.broadcastAll("closeDialog", event.videoId);
						return;
					}
					let pos = links.filter(i => typeof i == "number")[0],
						tranCard = links.filter(i => get.itemtype(i) == "card")[0];
					game.broadcastAll(
						function (card, id, pos, player) {
							lib.skill.tangongmrfz.addCard(card, id, pos);
							lib.skill.tangongmrfz.changePrompt(get.translation(player) + "放置了" + get.translation(card), id);
						},
						tranCard,
						event.videoId,
						pos,
						player
					);
					let { promise, resolve } = Promise.withResolvers();
					setTimeout(() => {
						resolve(true);
					}, 1000);
					await promise;
					cards.push([tranCard, pos]);
					showCards.remove(tranCard);
					if (cards.length > 8) {
						game.broadcastAll("closeDialog", event.videoId);
						break;
					}
				}
				const suits = cards.map(i => [get.suit(i[0]), i[1]]);
				const matrix = Array.from({ length: 3 }, () => Array(3));
				suits.forEach(([suit, index]) => (matrix[Math.floor(index / 3)][index % 3] = suit));

				// 检查是否有重复的花色
				const hasDuplicates = matrix.some((row, i) => new Set(row).size < 3 || new Set(matrix.map(r => r[i])).size < 3);

				if (!hasDuplicates) {
					const isDraw = trigger.name === "draw" ? true : false;
					const { control } = await player
						.chooseControl(`减半`, `翻倍`)
						.set("prompt", `令${trigger.name === "draw" ? "摸牌数" : "伤害值"}(${trigger.num})翻倍或减半`)
						.set("ai", () => {
							return get.event().isDraw ? "翻倍" : "减半";
						})
						.set("isDraw", isDraw)
						.forResult();
					trigger.num = control === `翻倍` ? trigger.num * 2 : Math.floor(trigger.num / 2);
				}
			},
			group: "tangongmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					lastDo: true,
					trigger: { global: "phaseEnd" },
					filter(event, player) {
						return player.storage.tangongmrfz;
					},
					async content(event, trigger, player) {
						player.storage.tangongmrfz = [];
					},
				},
			},
			ai: {
				threaten: 1.5,
			},
		},
		ruiganmrfz: {
			audio: 2,
			trigger: {
				global: "useCard1",
			},
			forced: true,
			filter(event, player) {
				//@ts-ignore
				return get.cardNameLength(event.card) == player.countCards("h") && event.targets.includes(player) && event.player != player;
			},
			async content(event, trigger, player) {},
			mod: {
				targetEnabled(card, player, target) {
					if (get.cardNameLength(card) == target.countCards("h") && player != target) return false;
				},
			},
		},

		// 凯瑟琳
		ksl_zhuzhimrfz: {
			onremove(player) {
				for (let t of game.players) {
					t.removeSkill("duantiemrfz");
				}
			},
			derivation: ["ksl_lulitongxinmrfz"],
			audio: 2,
			trigger: { global: "linkAfter" },
			silent: true,
			forced: true,
			filter(event, player) {
				return event.player != player;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				if (!target.isLinked() && target.hasSkill("duantiemrfz")) target.removeSkill("duantiemrfz");
				else if (target.isLinked() && !target.hasSkill("duantiemrfz")) target.addSkill("duantiemrfz");
			},
			group: ["ksl_zhuzhimrfz_add", "ksl_zhuzhimrfz_gain"],
			subSkill: {
				gain: {
					audio: "ksl_zhuzhimrfz",
					forced: true,
					trigger: {
						player: "phaseZhunbeiBegin",
					},
					async content(event, trigger, player) {
						var card = get.cardPile(function (card) {
							return get.name(card) == "ksl_lulitongxinmrfz";
						});
						if (card) player.gain(card, "gain2", "log");
						else player.draw();
					},
				},
				add: {
					audio: "ksl_zhuzhimrfz",
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					forced: true,
					filter(event, player) {
						return (event.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("ksl_lulitongxinmrfz");
					},
					async content(event, trigger, player) {
						var cards = [];
						for (var i = 0; i < 4; i++) {
							cards.push(game.createCard2("ksl_lulitongxinmrfz", lib.suit.randomGet(), [2, 4, 3, 10, 13].randomGet()));
						}
						game.broadcastAll(function () {
							lib.inpile.add("ksl_lulitongxinmrfz");
						});
						game.cardsGotoPile(cards, () => {
							return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
						});
					},
				},
			},
		},
		duantiemrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			position: "he",
			filter(event, player) {
				let list = [];
				for (let card of player.getCards("he")) {
					list.add(get.type2(card));
				}
				return list.length >= 2;
			},
			filterCard(card, player) {
				return !ui.selected.cards.some(cardx => get.type2(cardx) == get.type2(card));
			},
			complexCard: true,
			selectCard: 2,
			async content(event, trigger, player) {
				player.storage.duantiemrfz_buff = player.name;
				let audio = new Audio("extension/WhichWay/audio/up.mp3");
				audio.play();
				await player.reinitCharacter(player.name, "paxinghaomrfz", false);
				player.addSkill("duantiemrfz_buff");
			},
			subSkill: {
				buff: {
					onremove: true,
					charlotte: true,
					silent: true,
					mark: true,
					intro: {
						content(event, player) {
							return `当前机甲驾驶员:${get.translation(player.storage.duantiemrfz_buff)}`;
						},
					},
					trigger: { player: "dying" },
					async content(event, trigger, player) {
						let audio = new Audio("extension/WhichWay/audio/down.mp3");
						audio.play();
						await player.reinitCharacter("paxinghaomrfz", player.storage.duantiemrfz_buff, false);
						player.recoverTo(2);
						player.removeSkill("duantiemrfz_buff");
					},
				},
			},
			ai: {
				order: 6,
				result: {
					player(player, target) {
						if (player.hp < 3) return 1;
						let threaten = -(get.skillthreaten("jushoumrfz") + get.skillthreaten("yinqingmrfz"));
						for (let skill of player.getSkills(null, false, false)) {
							threaten += get.skillthreaten(skill);
						}
						return threaten;
					},
				},
			},
		},

		// 波卜
		qingtingmrfz: {
			audio: 2,
			trigger: { player: ["loseBegin", "loseAsyncBegin"] },
			filter(event, player) {
				let evt = event.getParent();
				if (event.name === "lose") {
					return event.type === "gain" && event.cards.length >= 1 && evt.player !== player;
				} else if (event.name === "loseAsync") {
					return evt.name === "swapHandcards" && event.target != event.player && event.cards1.length >= 1;
				}
				return false;
			},
			async cost(event, trigger, player) {
				let evt = trigger.getParent();
				event.result = await player
					.chooseBool()
					.set("ai", () => {
						let evt = get.event().evt;
						let event = get.event().evt2;
						return get.attitude2(event.target || evt.player) < 0;
					})
					.set("prompt", get.prompt("qingtingmrfz"))
					.set(
						"prompt2",
						`是否取消${get.translation(trigger.target || evt.player)}获得你的牌${get.translation(trigger.cards1 || trigger.cards)}？`
					)
					.set("evt", evt)
					.set("evt2", trigger)
					.forResult();
			},
			async content(event, trigger, player) {
				if (trigger.name === "lose") trigger.cancel();
				else {
					let evt = trigger.getParent();
					player.directgain(evt.cards1);
					player.$update();
					evt.cards1 = [];
				}
			},
		},
		qingtanmrfz: {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filterTarget(card, player, target) {
				return target != player && target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				let target = event.target;
				let tHs = target.getCards("h"),
					pHs = player.getCards("h");
				await player.viewHandcards(target);
				await target.viewHandcards(player);
				const { cards: cards1 } =
					pHs.length < 2
						? { cards: pHs }
						: await player
								.chooseCard(true)
								.set("ai", card => {
									let player = get.player();
									let target = get.event().target;
									return get.value(card) * get.attitude2(target);
								})
								.set("prompt", "请选择两张类型不同的牌")
								.set("filterCard", card => {
									return !ui.selected.cards.some(cardx => get.type2(cardx, player) == get.type2(card, player));
								})
								.set("selectCard", () => {
									let hs = get.event().hs;
									return new Set(hs.map(i => get.type2(i))).size < 2 ? 1 : 2;
								})
								.set("complexCard", true)
								.set("target", target)
								.set("hs", pHs)
								.forResult();
				const { cards: cards2 } =
					tHs.length < 2
						? { cards: tHs }
						: await target
								.chooseCard(true)
								.set("prompt", "请选择两张类型不同的牌")
								.set("ai", card => {
									let player = get.player();
									let target = get.event().target;
									return get.value(card) * get.attitude2(target);
								})
								.set("filterCard", card => {
									return !ui.selected.cards.some(cardx => get.type2(cardx, player) == get.type2(card, player));
								})
								.set("selectCard", () => {
									let hs = get.event().hs;
									return new Set(hs.map(i => get.type2(i))).size < 2 ? 1 : 2;
								})
								.set("complexCard", true)
								.set("hs", tHs)
								.set("target", player)
								.forResult();
				if (cards1 && cards2) {
					player.swapHandcards(target, cards1, cards2);
				}
			},
			async contentAfter(event, trigger, player) {
				const target = event.targets[0];
				if (target.countCards("h") === player.countCards("h")) return;
				for (let char of [player, target]) {
					if (char.hasSkill("qingtanmrfz_hd")) {
						char.draw();
						continue;
					}
					const { bool } = await char
						.chooseBool()
						.set("prompt", "是否摸一张牌？")
						.set("prompt2", "选择‘取消’则为手牌上限+1")
						.set("ai", () => {
							let player = get.player();
							return player.countCards("h") < 2 ? true : false;
						})
						.forResult();
					if (bool === true) {
						char.draw();
					}
					if (bool === false) {
						char.addSkill("qingtanmrfz_hd");
					}
				}
			},
			subSkill: {
				hd: {
					charlotte: true,
					mark: true,
					intro: {
						content: "手牌上限+1",
					},
					mod: {
						maxHandcard: function (player, num) {
							return num + 1;
						},
					},
				},
			},
			ai: {
				order: 13,
				result: {
					target: -1,
				},
			},
		},

		// 菲莱
		qianxiumrfz: {
			audio: 2,
			intro: {
				content(event, player) {
					return `少女祈祷中...`;
				},
			},
			trigger: { player: "phaseDrawBegin1" },
			filter: function (event, player) {
				return !event.numFixed;
			},
			prompt(event, player) {
				return get.prompt("qianxiumrfz");
			},
			prompt2(event, player) {
				return `你可以放弃摸牌，并展示牌堆顶${player.maxHp}张牌`;
			},
			async content(event, trigger, player) {
				trigger.changeToZero();
				let shows = game.cardsGotoOrdering(get.cards(player.maxHp)).cards;
				await player.showCards(shows, get.translation(player) + "发动了【虔修】");
				if (shows.filter(i => get.tag(i, "damage") > 0).length < 1) {
					player.gain(shows);
					if (player.countMark("qianxiumrfz") < 5) player.addMark("qianxiumrfz", 1, false);
					return;
				}
				const { links } = await player
					.chooseButton(["【虔修】:你可以使用一张带有伤害类标签的牌", shows])
					.set("filterButton", button => {
						let player = get.player();
						return get.tag(button.link, "damage") > 0 && player.hasUseTarget(button.link);
					})
					.set("ai", button => {
						let player = get.player();
						if (player.countMark("qianxiumrfz") < 3) return false;
						return get.value(button.link);
					})
					.forResult();
				if (links) {
					let nums = player.countMark("qianxiumrfz");
					links[0].storage.qianxiumrfz = nums;
					player.removeMark("qianxiumrfz", 1145141919810);
					player.chooseUseTarget(links[0]);
				} else {
					player.gain(shows);
					if (player.countMark("qianxiumrfz") < 5) player.addMark("qianxiumrfz", 1, false);
				}
			},
			group: ["qianxiumrfz_add"],
			subSkill: {
				add: {
					audio: "qianxiumrfz",
					charlotte: true,
					silent: true,
					trigger: { source: "damageBegin3" },
					filter(event, player) {
						return (
							event.card &&
							event.card.storage &&
							typeof event.card.storage.qianxiumrfz === "number" &&
							event.card.storage.qianxiumrfz > 0
						);
					},
					async content(event, trigger, player) {
						trigger.num += trigger.card.storage.qianxiumrfz;
					},
				},
			},
		},
		mingzhoumrfz: {
			audio: 2,
			forced: true,
			trigger: {
				player: "gainAfter",
			},
			filter(event, player) {
				return event.cards.length > 0 && _status.currentPhase !== player;
			},
			async content(event, trigger, player) {
				player.chooseToDiscard(true, `he`, `请弃置${trigger.cards.length}张牌`, trigger.cards.length).set("ai", card => -get.value(card));
			},
			ai: {
				threaten: 0.9,
				nogain: 1,
				skillTagFilter: function (player) {
					return player != _status.currentPhase;
				},
			},
		},

		// 裁度
		caiyimrfz: {
			audio: 2,
			trigger: { player: "equipBefore" },
			forced: true,
			filter(event, player) {
				return event.card && get.type(event.card) === "equip" && event.getParent().name != "caiyimrfz";
			},
			async content(event, trigger, player) {
				const subtype = ["equip1", "equip2", "equip3", "equip4", "equip5"];
				const { control } = await player
					.chooseControl(subtype)
					.set("prompt", `请选择将${get.translation(trigger.card)}置入一个装备栏`)
					.set("ai", () => {
						let player = get.player();
						let subtype = get.event().subtype.filter(i => player.hasEmptySlot(i));
						let card = get.event().card;
						if (subtype.length > 0) {
							return subtype.includes("equip2") && subtype.length > 1 ? subtype.remove("equip2").randomGet() : subtype.randomGet();
						} else {
							let equips = player.getCards("e").sort((a, b) => get.value(b) - get.value(a));
							for (let equip of equips) {
								if (get.value(card) > get.value(equip)) return get.subtype(equip);
							}
							return ["equip1", "equip2", "equip3", "equip4", "equip5"].randomGet();
						}
					})
					.set("subtype", subtype)
					.set("card", trigger.card)
					.forResult();
				if (!control) return;
				trigger.card.subtypes = [control];
			},
		},
		mingjiangmrfz: {
			audio: 2,
			init(player, skill) {
				let puyuanEquip = Object.keys(lib.card).filter(i => {
					return (
						get.type(i) === "equip" &&
						lib.card?.[i]?.skills &&
						(lib.card[i]?.derivation === "ol_puyuan" || lib.card[i]?.derivation === "puyuan")
					);
				});
				player.storage[skill] = [...lib.inpile.filter(i => get.type(i) === "equip"), ...puyuanEquip];
				_status.mingjiangmrfz = puyuanEquip;
			},
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				return game.hasPlayer(current => {
					return current.hasEmptySlot(2);
				});
			},
			async content(event, trigger, player) {
				let list = player.storage.mingjiangmrfz;
				await player.draw();
				if (player.countCards("h") < 1) return;
				const { links } = await player
					.chooseButton(["名匠", [list, "vcard"]], true)
					.set("ai", button => {
						let card = {
							name: button.link[2],
							nature: button.link[3],
						};
						let num = get.value(card);
						if (_status.mingjiangmrfz.includes(card.name)) num += 5;
						if (player.countCards("e", card => get.subtype(card) === "equip2") < 1)
							get.subtype(card) === "equip2" ? (num += 5) : (num -= 2);
						return num;
					})
					.forResult();
				if (!links) return;
				const { result } = await player.chooseCardTarget({
					prompt: `将一张手牌视为${get.translation(links[0][2])}置入一名角色的装备区`,
					filterCard: true,
					forced: true,
					filterTarget: function (card, player, target) {
						return target.hasEmptySlot(2);
					},
					ai1(card) {
						return -get.value(card);
					},
					ai2(target) {
						let player = get.player();
						let att = get.attitude2(target);
						return att > 0 ? att + (5 - target.countCards("e")) : -1;
					},
				});
				if (!result) return;
				const { targets, cards } = result;
				let card = get.autoViewAs({ name: links[0][2] }, cards);
				targets[0].equip(card);
			},
		},

		// 特克诺
		suoumrfz: {
			init(player) {
				game.addGlobalSkill("autoswap");
			},
			onremove(player) {
				for (let i of game.players) {
					if (i.name === "muouwuzhemrfz") i.die();
				}
			},
			audio: 2,
			trigger: { source: "damageEnd" },
			filter(event, player) {
				return event.player && event.player.isIn() && event.player.name !== "muouwuzhemrfz" && event.player.getNext().name != "muouwuzhemrfz";
			},
			prompt(event, player) {
				return `【塑偶】:是否在${get.translation(event.player)}和${get.translation(event.player.getNext())}之间放置一个‘木偶舞者’？`;
			},
			async content(event, trigger, player) {
				let target = trigger.player.getNext();
				var fellow = game.addPlayer(trigger.player.getSeatNum(), "muouwuzhemrfz").animate("start");
				fellow.getId();
				fellow.host = player;
				if (player.identity != "zhu" || get.mode() === "doudizhu") fellow.identity = player.identity;
				else fellow.identity = "zhong";
				fellow.node.identity.dataset.color = fellow.identity;
				fellow.identityShown = true;
				fellow.init("muouwuzhemrfz");
				fellow.draw(3);
				fellow.update();
				fellow.addSkill("suoumrfz_dead");
				fellow.suoumrfz = player;
				let skillList = trigger.player.getOriginalSkills();
				let introSkill = skillList.map(i => get.translation(i) + ":" + get.skillInfoTranslation(i));
				const { index } = skillList.length === 1 ? { index: 0 } : await player.chooseControl().set("choiceList", introSkill).forResult();
				fellow.addSkill(skillList[index] === "suoumrfz" ? "yingzi" : skillList[index]);
				for (let i = 0; i < game.players.length; i++) {
					let current = game.players[i];
					current.seatNum = i + 1;
					current.update();
				}
				await game.updateRoundNumber();
				for (let i of game.players) {
					if (i === player || i.suoumrfz === true) {
						i.draw();
					}
				}
			},
			group: ["suoumrfz_swap", "suoumrfz_die"],
			subSkill: {
				die: {
					charlotte: true,
					silent: true,
					trigger: { global: "dieBegin" },
					async content(event, trigger, player) {
						if (trigger.player === player) lib.skill.suoumrfz.onremove(player);
						else {
							let chars = game.players.slice();
							chars.remove(player);
							chars.remove(trigger.player);
							chars = chars.map(i => i.name);
							if (chars.every(i => i === "muouwuzhemrfz") || chars.length === 0) {
								player.when({ global: "dieAfter" }).then(() => {
									game.over(true);
								});
							}
						}
					},
				},
				swap: {
					init(player, skill) {
						player.storage[skill] = player;
					},
					onremove: true,
					firstDo: true,
					charlotte: true,
					silent: true,
					trigger: {
						global: [
							"playercontrol",
							"chooseToUseBegin",
							"chooseToRespondBegin",
							"chooseToDiscardBegin",
							"chooseToCompareBegin",
							"chooseButtonBegin",
							"chooseCardBegin",
							"chooseTargetBegin",
							"chooseCardTargetBegin",
							"chooseControlBegin",
							"chooseBoolBegin",
							"choosePlayerCardBegin",
							"discardPlayerCardBegin",
							"gainPlayerCardBegin",
							"chooseToMoveBegin",
							"chooseToPlayBeatmapBegin",
							"chooseToGiveBegin",
						],
					},
					filter(event, player) {
						return (
							!event.player.isUnderControl(true) &&
							!_status.auto &&
							(event.player.suoumrfz || event.player === player.storage.suoumrfz_swap)
						);
					},
					async content(event, trigger, player) {
						game.swapPlayer(trigger.player);
					},
				},
				dead: {
					charlotte: true,
					silent: true,
					trigger: { player: "dieBegin" },
					async content(event, trigger, player) {
						if (game.me != player.suoumrfz) await game.swapPlayer(player.suoumrfz);
						game.removePlayer(player);
						game.log(player, `被移出游戏`);
					},
				},
			},
		},

		// 瑰盐
		qiyimrfz: {
			audio: 2,
			enable: ["phaseUse", "chooseToUse"],
			usable: 1,
			hiddenCard: function (player, name) {
				let event = get.event();
				let evt = event.getParent("phaseUse");
				// if(_status.currentPhase===player && evt && evt.player == player) return true;
				if (player.countCards("he") < 1 || _status.currentPhase == player) return false;
				if (name != "tao") return false;
				return true;
			},
			filter(event, player) {
				let evt = event.getParent("phaseUse");
				if (player.countCards("he") < 1) return false;
				if (evt && evt.player == player) return true;
				else {
					return event.filterCard({ name: "tao", isCard: true }, player, event) && _status.currentPhase != player;
				}
			},
			filterTarget(card, player, target) {
				return target.getDamagedHp() > 0;
			},
			filterCard: true,
			selectTarget() {
				return [1, Infinity];
			},
			selectCard() {
				return [1, Infinity];
			},
			filterOk() {
				let player = get.player();
				if (_status.auto || !player.isUnderControl(true)) return true;
				return ui.selected.cards.length === ui.selected.targets.length;
			},
			position: "he",
			discard: false,
			lose: false,
			multitarget: true,
			multiline: true,
			check(card) {
				return lib.skill.qiyimrfz.getResult(get.player()) === false ? false : true;
			},
			getResult(player) {
				let cards = player.getCards("h");
				if (!player.hasSkill("guiyaomrfz")) {
					let choiceCards = cards.filter(card => 6 - get.value(card));
					let choiceTargets = player.getFriends().filter(i => i.getDamagedHp() > 0);
					if (choiceCards.length !== choiceTargets.length) {
						if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets);
						else choiceTargets = choiceTargets.slice(0, choiceCards);
					}
					if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
					return {
						targets: choiceTargets,
						cards: choiceCards,
					};
				} else {
					if (game.countPlayer(current => get.attitude2(current) > 2 && current.getDamagedHp() > 0) > 1) {
						let choiceCards = cards.filter(card => 8 - get.value(card) && get.color(card) === "red");
						let choiceTargets = player
							.getFriends()
							.filter(i => i.getDamagedHp() > 0)
							.sort((i, j) => j.hp - i.hp);
						if (choiceCards.length !== choiceTargets.length) {
							if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets.length);
							else choiceTargets = choiceTargets.slice(0, choiceCards.length);
						}
						if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
						return {
							targets: choiceTargets,
							cards: choiceCards,
						};
					} else {
						let choiceCards = cards.filter(card => 6 - get.value(card));
						let choiceTargets = player.getEnemies().filter(i => i.getDamagedHp() > 0);
						choiceCards = choiceCards.sort((i, j) => get.value(i) - get.value(j));
						if (choiceCards.length !== choiceTargets.length) {
							if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets.length);
							else choiceTargets = choiceTargets.slice(0, choiceCards.length);
						}
						if (choiceCards.every(i => get.color(i) === "red")) {
							let lowValueRed = choiceCards[0];
							let lowValueOther = cards
								.filter(card => 6 - get.value(card) && get.color(card) !== "red")
								.sort((i, j) => get.value(i) - get.value(j));
							if (lowValueOther.length === 0) return false;
							choiceCards = [lowValueRed, lowValueOther[0]];
						}
						if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
						return {
							targets: choiceTargets,
							cards: choiceCards,
						};
					}
				}
			},
			async content(event, trigger, player) {
				if (!player.isUnderControl(true) || _status.auto) {
					let result = lib.skill.qiyimrfz.getResult(player);
					player.useCard({ name: "tao" }, result.targets, result.cards);
				} else {
					let targets = event.targets;
					let cards = event.cards;
					player.useCard({ name: "tao" }, targets, cards);
				}
			},
			ai: {
				order: 8,
				result: {
					player: 1,
					target(player, target) {
						if (!player.hasSkill("guiyaomrfz")) return 1;
						let result = lib.skill.qiyimrfz.getResult(player);
						if (result === false) return 0;
						let att = get.attitude2(lib.skill.qiyimrfz.getResult(player).targets[0]);
						return att > 2 ? 1 : -1;
					},
				},
			},
		},
		guiyaomrfz: {
			audio: 2,
			trigger: {
				global: "recoverBegin",
			},
			filter(event, player) {
				return event.cards && event.cards.length > 0 && event.source && event.source === player;
			},
			forced: true,
			async content(event, trigger, player) {
				const cards = trigger.cards;
				let target = trigger.player;
				target.addTempSkill("guiyaomrfz_eff", { player: "phaseEnd" });
				if (cards.every(card => get.color(card) === "red")) {
					if (!target.storage.guiyaomrfz_eff) target.storage.guiyaomrfz_eff = 0;
					target.storage.guiyaomrfz_eff++;
				} else {
					if (!target.storage.guiyaomrfz_eff) target.storage.guiyaomrfz_eff = 0;
					target.storage.guiyaomrfz_eff--;
					target.loseHp(2);
				}
			},
			subSkill: {
				eff: {
					silent: true,
					charlotte: true,
					mark: true,
					intro: {
						content(event, player) {
							let num = player.storage.guiyaomrfz_eff;
							if (num === 0) return `无效果`;
							return `额定摸牌数、手牌上限、使用牌的次数和攻击范围${num > 0 ? "+" : ""}${num}`;
						},
					},
					onremove(player) {
						delete player.storage.guiyaomrfz_eff;
					},
					trigger: {
						player: "phaseDrawBegin2",
					},
					filter(event, player) {
						return !event.numFixed && player.storage.guiyaomrfz_eff != 0;
					},
					async content(event, trigger, player) {
						trigger.num += player.storage.guiyaomrfz_eff;
					},
					mod: {
						maxHandcard: function (player, num) {
							return (num += player.storage.guiyaomrfz_eff);
						},
						cardUsable(card, player, num) {
							return (num += player.storage.guiyaomrfz_eff);
						},
						attackRange: function (player, num) {
							return (num += player.storage.guiyaomrfz_eff);
						},
					},
				},
			},
		},
		xiadumrfz: {
			audio: 2,
			forced: true,
			trigger: {
				global: "roundStart",
			},
			firstDo: true,
			async content(event, trigger, player) {
				let cards = player.getCards("h", card => card.hasGaintag("xiadumrfz"));
				if (cards) await player.discard(cards);
				await player.changeHujia(-1);
				const { result } = await player.draw(2).forResult();
				player.addGaintag(result, "xiadumrfz");
				player.changeHujia(1);
			},
		},

		// 行著
		xingzhumrfz: {
			marktext: "帙",
			intro: {
				name: "帙",
				content: "expansion",
				markcount: "expansion",
			},
			onremove: function (player, skill) {
				var cards = player.getExpansions(skill);
				if (cards.length) player.loseToDiscardpile(cards);
			},
			audio: 2,
			forced: true,
			trigger: {
				global: ["loseAfter", "loseAsyncAfter"],
			},
			filter: function (event, player) {
				if (event.type != "discard") return false;
				for (let current of game.players) {
					if (current === player) continue;
					let evt = event.getl(current);
					if (!evt || !evt.cards2) continue;
					return true;
				}
				return false;
			},
			async content(event, trigger, player) {
				let cards = [];
				var players = game.filterPlayer();
				for (var current of players) {
					if (current === player) continue;
					var evt = trigger.getl(current);
					if (!evt || !evt.cards2) continue;
					var cardsx = evt.cards2.filterInD("d");
					cards.addArray(cardsx);
				}
				if (cards.length) {
					player.addToExpansion(cards, player, "giveAuto").gaintag.add("xingzhumrfz");
				}
			},
			group: ["xingzhumrfz_start", "xingzhumrfz_check", "xingzhumrfz_init"],
			subSkill: {
				check: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: {
						player: "addToExpansionEnd",
					},
					filter: function (event, player) {
						return event.gaintag.includes("xingzhumrfz");
					},
					lastDo: true,
					async content(event, trigger, player) {
						let cards = player.getExpansions("xingzhumrfz");
						if (cards.length >= 9) {
							const { links } = await player
								.chooseCardButton(`【行著】:请弃置${Math.max(1, cards.length - 9)}张‘帙’`, true, cards)
								.set("selectButton", () => {
									let cards2 = get.player().getExpansions("xingzhumrfz");
									return Math.max(1, cards2.length - 9);
								})
								.set("ai", button => {
									return -get.value(button.link);
								})
								.forResult();
							if (!links) return;
							player.loseToDiscardpile(links);
						}
					},
				},
				start: {
					audio: "xingzhumrfz",
					forced: true,
					trigger: {
						global: "phaseBefore",
						player: "enterGame",
					},
					filter(event, player) {
						return event.name != "phase" || game.phaseNumber == 0;
					},
					async content(event, trigger, player) {
						player.addToExpansion(get.cards(3), "draw").gaintag.add("xingzhumrfz");
					},
				},
				init: {
					audio: "xingzhumrfz",
					trigger: {
						player: ["loseEnd", "dying", "phaseBefore", "phaseAfter", "dyingAfter", "die"],
						global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"],
					},
					filter: function (event, player) {
						//@ts-ignore
						return (player.getExpansions("xingzhumrfz").length > 0) ^ player.hasSkill("xingzhumrfz_in");
					},
					forced: true,
					firstDo: true,
					silent: true,
					forceDie: true,
					async content(event, trigger, player) {
						if (player.getExpansions("xingzhumrfz").length) {
							var cards = player.getExpansions("xingzhumrfz");
							var cardsx = cards.map(card => {
								var cardx = ui.create.card();
								cardx.init(get.cardInfo(card));
								cardx._cardid = card.cardid;
								return cardx;
							});
							player.directgains(cardsx, null, "xingzhumrfz_tag");
							player.addSkill("xingzhumrfz_in");
						} else player.removeSkill("xingzhumrfz_in");
					},
				},
				in: {
					charlotte: true,
					audio: false,
					trigger: {
						player: "addToExpansionEnd",
					},
					filter: function (event, player) {
						return event.gaintag.includes("xingzhumrfz");
					},
					forced: true,
					locked: false,
					silent: true,
					async content(event, trigger, player) {
						var cards2 = player.getCards("s", card => card.hasGaintag("xingzhumrfz_tag"));
						if (player.isOnline2()) {
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards2,
								player
							);
						}
						cards2.forEach(i => i.delete());

						var cards = player.getExpansions("xingzhumrfz");
						var cardsx = cards.map(card => {
							var cardx = ui.create.card();
							cardx.init(get.cardInfo(card));
							cardx._cardid = card.cardid;
							return cardx;
						});
						player.directgains(cardsx, null, "xingzhumrfz_tag");
					},
					onremove: function (player) {
						var cards2 = player.getCards("s", card => card.hasGaintag("xingzhumrfz_tag"));
						if (player.isOnline2()) {
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards2,
								player
							);
						}
						cards2.forEach(i => i.delete());
						if (player == game.me) ui.updatehl();
					},
					group: ["xingzhumrfz_use", "xingzhumrfz_sync"],
				},
				use: {
					charlotte: true,
					trigger: {
						player: ["useCardBefore", "respondBefore"],
					},
					filter: function (event, player) {
						var cards = player.getCards("s", card => card.hasGaintag("xingzhumrfz_tag") && card._cardid);
						return (
							event.cards &&
							event.cards.some(card => {
								return cards.includes(card);
							})
						);
					},
					forced: true,
					popup: false,
					firstDo: true,
					async content(event, trigger, player) {
						var idList = player.getCards("s", card => card.hasGaintag("xingzhumrfz_tag")).map(i => i._cardid);
						var cards = player.getExpansions("xingzhumrfz");
						var cards2 = [];
						for (var card of trigger.cards) {
							var cardx = cards.find(cardx => cardx.cardid == card._cardid);
							if (cardx) cards2.push(cardx);
						}
						var cards3 = trigger.cards.slice();
						trigger.cards = cards2;
						trigger.card.cards = cards2;
						if (player.isOnline2()) {
							player.send(
								function (cards, player) {
									cards.forEach(i => i.delete());
									if (player == game.me) ui.updatehl();
								},
								cards3,
								player
							);
						}
						cards3.forEach(i => i.delete());
						if (player == game.me) ui.updatehl();
					},
				},
				sync: {
					charlotte: true,
					silent: true,
					audio: false,
					trigger: {
						player: ["loseToDiscardpileEnd"],
					},
					filter(event, player) {
						let cardsx = player.getCards("s", card => card.hasGaintag("xingzhumrfz_tag"));
						let cards = player.getExpansions("xingzhumrfz");
						return cardsx.length !== cards.length;
					},
					async content(event, trigger, player) {
						let cardsx = player.getCards("s", card => card.hasGaintag("xingzhumrfz_tag"));
						let cards = player.getExpansions("xingzhumrfz");
						cardsx.forEach(i => {
							if (!cards.map(i => i.cardid).includes(i._cardid)) i.delete();
						});
						ui.updatehl();
					},
				},
			},
		},
		zhizhumrfz: {
			audio: 2,
			trigger: { player: "useCardAfter" },
			init(player, skill) {
				player.storage[skill] = [];
			},
			mark: true,
			intro: {
				content(event, player) {
					let storage = player.storage.zhizhumrfz;
					return `·本轮已使用的花色：${get.translation(storage)}`;
				},
			},
			firstDo: true,
			filter(event, player) {
				if (!player.storage.zhizhumrfz_check || player.storage.zhizhumrfz.includes(get.suit(event.card)) || get.position(event.card) !== "d")
					return false;
				for (let current of game.players) {
					if (current === player) continue;
					for (let key in player.storage.zhizhumrfz_check) {
						if (event.card.cardid !== key) continue;
						let arrs = player.storage.zhizhumrfz_check[key];
						for (let arr of arrs) {
							if (arr[0] === current && arr[1] != current.countCards("h")) return true;
						}
					}
				}
				return false;
			},
			async content(event, trigger, player) {
				player.storage.zhizhumrfz.push(get.suit(trigger.card));
				player.addToExpansion(trigger.cards, player, "giveAuto").gaintag.add("xingzhumrfz");
			},
			group: ["zhizhumrfz_check", "zhizhumrfz_remove"],
			subSkill: {
				remove: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: {
						global: "roundStart",
						player: "useCardAfter",
					},
					lastDo: true,
					async content(event, trigger, player) {
						if (trigger.name === "useCard") {
							if (player.storage.zhizhumrfz_check.hasOwnProperty(trigger.card.cardid)) {
								delete player.storage.zhizhumrfz_check[trigger.card.cardid];
							}
						} else {
							player.storage.zhizhumrfz = [];
						}
					},
				},
				check: {
					audio: false,
					charlotte: true,
					silent: true,
					trigger: {
						player: "useCard",
					},
					async content(event, trigger, player) {
						if (!player.storage.zhizhumrfz_check) player.storage.zhizhumrfz_check = {};
						for (let current of game.players) {
							if (current === player) continue;
							if (!player.storage.zhizhumrfz_check[trigger.card.cardid]) player.storage.zhizhumrfz_check[trigger.card.cardid] = [];
							player.storage.zhizhumrfz_check[trigger.card.cardid].push([current, current.countCards("h")]);
						}
					},
				},
			},
		},

		// 寻澜
		tanxunmrfz: {
			audio: 2,
			forced: true,
			trigger: { player: "phaseBegin" },
			filter(event, player) {
				return !event.audioed;
			},
			async content(event, trigger, player) {
				trigger.audioed = true;
			},
			ai: {
				viewHandcard: true,
				skillTagFilter(player, tag, arg) {
					if (player === arg || !player.inRange(arg) || _status.currentPhase !== player) return false;
				},
			},
		},
		dongximrfz: {
			audio: 2,
			enable: "phaseUse",
			filter(event, player) {
				return (
					player.countCards("h", card => player.canRecast(card)) > 0 &&
					game.hasPlayer(
						current =>
							current != player &&
							player.inRange(current) &&
							!current.hasSkill("dongximrfz_ban") &&
							current.countCards("h", card => current.canRecast(card)) > 0
					)
				);
			},
			filterTarget(card, player, target) {
				return (
					target != player &&
					player.inRange(target) &&
					!target.hasSkill("dongximrfz_ban") &&
					target.countCards("h", cardx => target.canRecast(cardx)) > 0
				);
			},
			filterCard(card) {
				return get.player().canRecast(card);
			},
			selectCard: [1, 2],
			check(card) {
				return 1;
			},
			discard: false,
			lose: false,
			async content(event, trigger, player) {
				const target = event.targets[0];

				target.addTempSkill("dongximrfz_ban", { global: "phaseUseEnd" });

				let cards1;
				if (_status.auto || !player.isUnderControl(true)) {
					let cards = [];

					for (let i of target.getCards("h")) {
						if (get.attitude(player, target) > 0) {
							for (let j of player.getCards("h")) {
								if (get.suit(i) !== get.suit(j)) continue;
								cards.push(j);
							}
						} else {
							for (let j of player.getCards("h")) {
								if (get.suit(i) === get.suit(j)) continue;
								cards.push(j);
							}
						}
					}
					if (cards.length > 2) cards = cards.slice(0, 2);
					cards1 = cards.length > 0 ? cards : player.getCards("h").randomGet();
				} else {
					cards1 = event.cards;
				}

				const { cards: cards2 } = await target
					.chooseCard([1, 2], true)
					.set("filterCard", card => {
						return get.event().playerx.canRecast(card);
					})
					.set("prompt", `【洞悉】:你可以重铸至多两张牌`)
					.set("prompt2", get.prompt2("dongximrfz"))
					.set("ai", card => {
						let target = get.event().target,
							player = get.event().playerx;
						if (target.countCards("h") > 2 && ui.selected.cards.length > 0 && get.attitude(player, target) < 0) return -1;
						return 8 - get.value(card, player);
					})
					.set("playerx", target)
					.set("target", player)
					.forResult();
				if (!cards2) return;
				let bool = true;
				outerLoop: for (let i = 0; i < cards1.length; i++) {
					for (let j = 0; j < cards2.length; j++) {
						if (get.suit(cards1[i]) === get.suit(cards2[j])) {
							bool = false;
							break outerLoop;
						}
					}
				}
				player.recast(cards1);
				target.recast(cards2);
				let num = cards2.length;
				if (bool) {
					if (num < 1) return;
					if (target.countGainableCards(player, "h"))
						await player
							.gainPlayerCard("h", target, num, true)
							.set("target", target)
							.set("complexSelect", false)
							.set("ai", lib.card.shunshou.ai.button);
					await target.damage(num, player);
				} else {
					player.disableSkill("dongximrfz", ["dongximrfz"]);
					player.addTempSkill("dongximrfz_restore", { player: "phaseUseEnd" });
					game.log(player, "的技能", "#g" + get.translation("dongximrfz"), "失效了");
				}
			},
			subSkill: {
				ban: {
					charlotte: true,
				},
				restore: {
					charlotte: true,
					forced: true,
					popup: false,
					onremove: function (player) {
						player.enableSkill("dongximrfz");
						game.log(player, "恢复了技能");
					},
				},
			},
			ai: {
				order: 2,
				result: {
					player: 1,
					target: -1,
				},
			},
		},

		// 诺威尔
		butingmrfz: {
			audio: 2,
			comboSkill: true,
			mod: {
				aiOrder(player, card, num) {
					if (typeof card == "object") {
						const evt = player.getLastUsed(1);
						if (evt?.card && get.type2(evt.card) === get.type2(card)) {
							return num + 10;
						}
					}
				},
			},
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				let evt = player.getLastUsed(1);
				return evt && get.type2(evt.card) === get.type2(event.card);
			},
			frequent: true,
			async content(event, trigger, player) {
				player.draw();
			},
			ai: {
				threaten: 1.5,
			},
		},
		buximrfz: {
			audio: 2,
			trigger: {
				player: "dyingAfter",
			},
			filter(event, player) {
				return player.hasUseTarget("tao");
			},
			async content(event, trigger, player) {
				player.chooseUseTarget({ name: "tao" }, true);
			},
		},

		// 濯尘芙蓉
		dichenmrfz: {
			init(player, skill) {
				player.storage[skill] = [
					target => {
						target.discard(target.getCards("j"));
					},
					target => {
						target.draw(2);
					},
					target => {
						target.recover();
						target
							.when({ player: "phaseEnd" })
							.then(async (event, trigger, player) => {
								if (player.countCards("h") < 5) player.gain(lib.card.ying.getYing(5 - player.countCards("h")), "gain2");
							})
							.assign({
								mark: true,
								intro: {
									name: "涤尘",
									content(_, player) {
										return `在你的回合结束获得${Math.max(5 - player.countCards("h"), 0)}张【影】`;
									},
								},
								dichenmrfz: true,
							})
							.translation("涤尘")
							.finish();
						let skillList = target.getSkills();
						skillList.forEach(skill => {
							let info = lib.skill[skill];
							if (info.dichenmrfz) {
								target.markSkill(skill);
							}
						});
					},
					target => {
						target.link(false);
						target.turnOver(false);

						// 并入上一项
						const player = get.player();
						const storage = player.storage.dichenmrfz;
						const index = storage.length - 1;
						if (index <= 0) return;

						const prevFunc = storage[index - 1];
						const currentFunc = storage[index];

						storage[index - 1] = target => {
							prevFunc(target);
							currentFunc(target);
						};

						storage.splice(index, 1);
					},
				];
			},
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			onremove: true,
			filterTarget(card, player, target) {
				let num = player.getAttackRange() - get.distance(player, target) + 1;
				let prompt = num < player.storage.dichenmrfz.length ? `执行至第${num}项` : `执行所有项`;
				if (player.inRange(target) || target === player) target.showPrompt(prompt);
				return player.inRange(target) || target === player;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				let storage = player.storage.dichenmrfz;
				let num = Math.min(player.getAttackRange() - get.distance(player, target) + 1, 4);
				if (storage[0] && num > 0) storage[0](target);
				if (storage[1] && num > 1) storage[1](target);
				if (storage[2] && num > 2) storage[2](target);
				if (storage[3] && num > 3) storage[3](target);
			},
			ai: {
				order: 7.49,
				result: {
					player: 1,
					target(player, target) {
						let storage = player.storage.dichenmrfz;
						let x = Math.min(player.getAttackRange() - get.distance(player, target) + 1, 4);
						let num = 1;
						if (get.attitude2(target) < 0) return 0;
						if (x >= storage.length && storage.length > 2) num += 5;
						if (target.hp < 2) num += 3;
						if (target.countCards("h") < 3) num += 1;
						if (target.isTurnedOver()) num += 5;
						if (target.isLinked()) num += 0.5;
						if (target.hasSkill("zhuoxinmrfz")) num += 0.5;
						return num;
					},
				},
			},
		},
		zhuoxinmrfz: {
			audio: 2,
			trigger: { player: "phaseZhunbeiBegin" },
			filter(event, player) {
				return game.hasPlayer(current => {
					return current !== player && get.distance(player, current) < 2 && !!player.canUse({ name: "tuixinzhifu" }, current);
				});
			},
			prompt(event, player, name) {
				return get.prompt("zhuoxinmrfz");
			},
			async content(event, trigger, player) {
				player
					.chooseToUse()
					.set("openskilldialog", "视为使用一张【推心置腹】")
					.set("norestore", true)
					.set("_backupevent", "zhuoxinmrfz_backup")
					.set("custom", {
						add: {},
						replace: { window() {} },
					})
					.backup("zhuoxinmrfz_backup");
			},
			subSkill: {
				backup: {
					filterCard: () => false,
					filterTarget(card, player, target) {
						return target !== player && get.distance(player, target) < 2 && player.canUse({ name: "tuixinzhifu" }, target);
					},
					selectTarget: -1,
					selectCard: -1,
					log: false,
					viewAs: {
						name: "tuixinzhifu",
						isCard: true,
					},
				},
			},
		},

		// 新术士阿米娅
		newtongganmrfz: {
			audio: "tongganmrfz",
			trigger: {
				global: "phaseEnd",
			},
			findGainAndDiscardHistory() {
				let result = {
					gain: [],
					discard: [],
				};
				game.players.forEach(char => {
					char.getHistory("gain", evt => {
						if (evt.name === "gain") result.gain.add(char);
					});
					char.getHistory("lose", evt => {
						if (evt.type === "discard") result.discard.add(char);
					});
				});
				return result;
			},
			filter(event, player) {
				let result = lib.skill.newtongganmrfz.findGainAndDiscardHistory();
				return (result.gain.length > 0 || result.discard.length > 0) && event.player !== player;
			},
			forced: true,
			async content(event, trigger, player) {
				let { gain, discard } = lib.skill.newtongganmrfz.findGainAndDiscardHistory();
				await player.draw(gain.length);
				if (discard.length) player.chooseToDiscard(discard.length, true, `【同感】:请弃置${discard.length}张牌`, "he");
			},
		},
		shijiemrfz: {
			mod: {
				canBeDiscarded(card, target, player) {
					if (get.position(card) === "h" && player.countCards("h") <= 5) return false;
				},
			},
			audio: 2,
			trigger: {
				player: ["gainBegin", "loseBegin"],
			},
			forced: true,
			filter(event, player) {
				return event.name === "gain"
					? player.countCards("h") >= 10 && event.getParent().name === "draw"
					: player.countCards("h") <= 5 && event.type === "discard";
			},
			async content(event, trigger, player) {
				if (event.name === "gain") {
					let cards = trigger.getParent().result;
					game.cardsDiscard(cards);
					game.log(player, "取消了此次摸牌");
				} else {
					game.log(player, "取消了此次弃牌");
				}
				trigger.cancel();
			},
		},

		// 新近卫阿米娅
		chenxianmrfz: {
			audio: 2,
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter(event, player) {
				return game.countPlayer(current => current.getDamagedHp() > 0) > 0 && !event.numFixed;
			},
			prompt() {
				return `【沉弦】:是否多摸${game.countPlayer(current => current.getDamagedHp() > 0)}张牌,然后其中每包含一张【万箭齐发】、【杀】或【酒】，你便弃置一张牌？`;
			},
			async content(event, trigger, player) {
				let num = game.countPlayer(current => current.getDamagedHp() > 0);
				trigger.num += num;
				player.when({ player: "phaseDrawAfter" }).then(async (event, trigger, player) => {
					let cards = trigger.cards;
					let num = cards.filter(card => {
						return card.name === "wanjian" || card.name === "sha" || card.name === "jiu";
					}).length;
					if (num > 0) player.chooseToDiscard("he", true, `【沉弦】:请弃置${get.cnNumber(num)}张牌`, num);
				});
			},
			ai: {
				threaten: 2,
			},
		},
		benyemrfz: {
			audio: "amy_qingyanmrfz",
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return game.hasPlayer(current => {
					return current !== player && current.countCards("h") > 0;
				});
			},
			filterTarget(card, player, target) {
				return target !== player && target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				const { cards } = await player
					.choosePlayerCard(target, "h")
					.set("prompt", `【奔夜】:你可以使用其中一张【杀】或【顺手牵羊】`)
					.set("visible", true)
					.set("filterButton", button => {
						let link = button.link;
						return link.name === "sha" || link.name === "shunshou";
					})
					.set("ai", button => {
						let link = button.link;
						let player = get.player();
						let max = 0;
						game.players.forEach(char => {
							if (player.canUse(link, char)) {
								max = Math.max(max, get.effect(char, link, player, player));
							}
						});
						return max;
					})
					.forResult();
				if (!cards) return;
				if (player.hasUseTarget(cards[0])) {
					await player.$gain2(cards[0], false);
					player.chooseUseTarget(cards[0]).set("addCount", false);
				}
			},
			ai: {
				order: 3,
				result: {
					player: 1,
					target(player, target) {
						let att = get.attitude(player, target);
						return att > 0 ? 0 : -1 * target.countCards("h");
					},
				},
			},
		},
		newjueyingmrfz: {
			audio: "yingxiaomrfz",
			trigger: { global: "phaseEnd" },
			skillAnimation: true,
			animationColor: "red",
			mark: true,
			unique: true,
			limited: true,
			filter: function (event, player) {
				let color = new Set(
					get
						.discarded()
						.filter(card => card.name === "sha")
						.map(card => get.color(card))
				);
				if (color.size < 2) return false;
				return !player.storage.newjueyingmrfz;
			},
			init: (player, skill) => (player.storage[skill] = false),
			async content(event, trigger, player) {
				player.awakenSkill("newjueyingmrfz");
				player.storage.newjueyingmrfz = true;

				let skills = player.getSkills(null, false, undefined).filter(skill => lib.translate[skill + "_info"]);
				let awakenedSkills = player.awakenedSkills.filter(skill => lib.translate[skill + "_info"]);
				skills.add(...awakenedSkills);
				let cards = [];
				let names = {};
				lib.inpile.forEach(i => {
					names[i] = get.translation(i);
				});

				let pattern = new RegExp(Object.values(names).join("|"), "g");
				skills.forEach(skill => {
					let translate = lib.translate[skill + "_info"];
					let matches = translate.match(pattern);
					if (matches) {
						let arr = matches.map(match => {
							return Object.keys(names).find(key => names[key] === match);
						});
						if (arr.length > 0) {
							cards.push(...arr);
						}
					}
				});

				while (cards.length) {
					let card = { name: cards.shift(), isCard: true };
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget(card).set("prompt2", `待使用：${get.translation(cards)}`);
					}
				}
			},
		},
	},
};
