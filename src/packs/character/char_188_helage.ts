import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

character("char_188_helage", { pack: "legendSJZX", sex: "male", group: "wumrfz", hp: 3, maxHp: 4, skills: ["yingkuimrfz", "cangfengmrfz", "yuexiangmrfz"] });

skill({
	yingkuimrfz: {
		mod: {
			maxHandcard: function (player, num) {
				return (num += 2);
			},
		},
		audio: ["选中干员1", "选中干员2"],
		forced: true,
		trigger: { player: "dying" },
		async content(event, trigger, player) {
			await player.recover();
			player.removeSkill("yingkuimrfz");
		},
	},
	cangfengmrfz: {
		mod:{
			cardname: function (card, player) {
				if (card.name == "tao") return "sha";
			},
		},
		audio: ["部署1", "观看作战记录"],
		trigger: { source: "damageSource" },
		intro: {
			content: "#/2",
		},
		onremove: true,
		filter(event, player, name, target) {
			return player.countMark("cangfengmrfz") > 1;
		},
		forced: true,
		async content(event, trigger, player) {
			while (player.countMark("cangfengmrfz") >= 2) {
				const controls: string[] = [];
				if (player.getDamagedHp() > 0) controls.push("回复体力");
				controls.push("摸一张牌");
				const result = await player
					.chooseControl({
						controls,
						prompt: "【藏锋】:请选择一项",
						ai(event, player) {
							if (player.countCards("h", "jiu") > 0 || player.hp > 1) return "摸一张牌";
							return Math.random() > 0.8 ? "摸一张牌" : "回复体力";
						},
					})
					.forResult();
				console.log(result.control);
				if (result.control) {
					if (result.control === "摸一张牌") await player.draw();
					else await player.recover();
					player.removeMark("cangfengmrfz", 2, false);
				} else {
					break;
				}
			}
		},
		group: "cangfengmrfz_mark",
		subSkill: {
			mark: {
				charlotte: true,
				silent: true,
				forced: true,
				trigger: {
					source: "damageSource",
				},
				firstDo: true,
				async content(event, trigger, player) {
					player.addMark("cangfengmrfz", trigger.num, false);
				},
			},
		},
	},
	yuexiangmrfz: {
		audio: ["作战中1", "作战中2", "作战中3"],
		forced: true,
		mark: true,
		intro: {
			content(storage, player, skill) {
				const texts: string[] = [];
				const damaged = player.getDamagedHp();
				if (damaged < 1) return `·无效果`;
				if (damaged >= 1) {
					texts.push("·你使用的【杀】不可响应");
				}
				if (damaged >= 2) {
					texts.push("·你使用的红色【杀】伤害基数+1且无次数限制");
				}
				if (damaged >= 3) {
					texts.push("·当你的手牌数小于你已损失的体力值时，你将手牌补至你已损失的体力值");
				}
				if (damaged >= 4) {
					if (!player.hasSkill("yuexiangmrfz_round")) texts.push("·每轮限一次，你可以将一张牌当【酒】使用");
					else texts.push(whichWayUtil.colorize("#s·每轮限一次，你可以将一张牌当【酒】使用#"));
				}
				return texts.join("<br>");
			},
		},
		group: ["phase1", "phase2", "phase3", "phase4"].map(i => `yuexiangmrfz_${i}`),
		subSkill: {
			phase1: {
				audio: "yuexiangmrfz",
				forced: true,
				trigger: {
					player: "useCard",
				},
				lastDo: true,
				filter(event, player, name, target) {
					if (player.getDamagedHp() < 1) return false;
					return event.card && get.name(event.card) === "sha";
				},
				async content(event, trigger, player) {
					trigger.directHit.addArray(game.players);
				},
			},
			phase2: {
				audio: "yuexiangmrfz",
				forced: true,
				trigger: {
					source: "damageBegin4",
				},
				filter(event, player, name, target) {
					if (player.getDamagedHp() < 2) return false;
					return event.card && get.name(event.card) === "sha" && get.color(event.card) === "red";
				},
				async content(event, trigger, player) {
					trigger.num += 1;
				},
				mod: {
					cardEnabled(card: Card, player, event, result) {
						if (player.getDamagedHp() >= 2 && get.color(card) === "red" && get.name(card) === "sha") return true;
					},
				},
			},
			phase3: {
				audio: "yuexiangmrfz",
				forced: true,
				trigger: {
					player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
					global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
				},
				filter(event, player) {
					if (player.getDamagedHp() < 3) return false;
					if (event.getl && !event.getl(player)) {
						return false;
					}
					return player.countCards("h") < player.getDamagedHp();
				},
				async content(event, trigger, player) {
					player.draw(player.getDamagedHp() - player.countCards("h"));
				},
				ai: {
					noh: true,
					freeSha: true,
					freeShan: true,
					skillTagFilter(player, tag) {
						if (player.getDamagedHp() < player.countCards("h") || player.getDamagedHp() < 3) {
							return false;
						}
					},
				},
			},
			phase4: {
				audio: "yuexiangmrfz",
				enable: ["chooseToUse"],
				filter(event, player, name, target) {
					return player.countCards("hes") > 0 && player.getDamagedHp() >= 4 && !player.hasSkill("yuexiangmrfz_round");
				},
				filterCard: () => true,
				position: "hes",
				viewAs: { name: "jiu" },
				viewAsFilter(player) {
					return player.countCards("hes") > 0 && player.getDamagedHp() >= 4 && !player.hasSkill("yuexiangmrfz_round");
				},
				prompt: "将一张牌当酒使用",
				check(card) {
					const val = get.value(card);
					if (_status.event.type == "dying") {
						return 1 / Math.max(0.1, val);
					}
					return 5 - val;
				},
				onuse(result, player) {
					player.addTempSkill("yuexiangmrfz_round", { global: "roundStart" });
				},
			},
			round: {
				charlotte: true,
				onremove: true,
			},
		},
	},
});

translate({
	char_188_helage: "赫拉格",
	yingkuimrfz: "盈亏",
	yingkuimrfz_info: "锁定技，你的手牌上限+2；当你进入濒死状态后，你回复一点体力，然后移除技能【盈亏】。",
	cangfengmrfz: "藏锋",
	cangfengmrfz_info: "锁定技，每当你累计造成两点伤害后，你选择回复一点体力或摸一张牌；你的【桃】均视为【杀】。",
	yuexiangmrfz: "月相",
	yuexiangmrfz_info: "锁定技，若你已损失的体力值不小于：<br>1:你使用的【杀】不可响应;<br>2：你使用红色的【杀】造成的伤害+1且无次数限制;<br>3：当你的手牌数小于你已损失的体力值时，你将手牌补至你已损失的体力值。<br>4：每轮限一次，你可以将一张牌当【酒】使用。",
});

characterIntro("char_188_helage", "赫拉格，曾隶属于乌萨斯帝国近卫军，切尔诺伯格感染者地下诊所“阿撒兹勒”的现任管理者，其他相关履历缺失。拥有成熟的军事理论体系知识，战斗技巧几乎能满足绝大部分类型作战的需求。现正依合作协议长驻罗德岛，为罗德岛提供战术指挥支援。");

characterTitle("char_188_helage", "藏锋守拙");
