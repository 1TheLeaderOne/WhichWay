import { whichWayUtil } from "../../../utill.js";
import { character, characterIntro, characterTitle, skill, translate } from "../../hooks.ts";
import { get, game, lib } from "noname";

character("wangmrfz", {
	sex: "male",
	group: "suimrfz",
	skills: ["qushimrfz", "dingshengmrfz"],
	hp: 4,
	pack: "legendSJZX",
});

characterTitle("wangmrfz", "<font color = #2263b766>胜天半子</font>");

const yearsTrans = {
	shuomrfz: "朔",
	shuomrfz_info: "对此牌的一名目标角色造成一点伤害。",
	wangmrfz: "望",
	wangmrfz_info: "视为使用一张刺【杀】（无距离次数限制）",
	lingmrfz: "令",
	lingmrfz_info: "视为使用一张【酒】。",
	junmrfz: "均",
	junmrfz_info: "无法被其他角色响应。",
	jiemrfz: "颉",
	jiemrfz_info: "视为使用一张你本回合使用过的基本牌（无次数限制）。",
	shumrfz: "黍",
	shumrfz_info: "下次摸牌数翻倍。",
	jimrfz: "绩",
	jimrfz_info: "将手牌补至手牌上限（至多为5）。",
	yimrfz: "易",
	yimrfz_info: `${get.poptip("sjzx_zhiheng")}3`,
	nianmrfz: "年",
	nianmrfz_info: "随机获得一个武器牌的技能直到回合结束。",
	ximrfz: "夕",
	ximrfz_info: "额外结算一次。",
	fangmrfz: "方",
	fangmrfz_info: "回复体力至体力上限。",
	yumrfz: "余",
	yumrfz_info: "从牌堆中获得任意类型的一张牌。",
};

translate({
	...Object.fromEntries(Object.entries(yearsTrans).map(([key, value]) => [`wangmrfz_${key}`, value])),

	wangmrfz: "望",

	qushimrfz: "取势",
	qushimrfz_info: `锁定技,当你首次使用一种牌名的普通锦囊牌时，你为该种牌名的牌选择一个效果，你对应的牌获得对应的效果：<br>朔：对此牌的一名目标角色造成一点伤害;<br>望：视为使用一张刺【杀】（无距离次数限制）;<br>令：结算完毕后视为使用一张【酒】;<br>均：无法被其他角色响应;<br>颉：视为使用一张你本回合使用过的基本牌（无次数限制）;<br>黍：下次摸牌数翻倍;<br>绩：将手牌补至手牌上限（至多为5）;<br>易：${get.poptip("sjzx_zhiheng")}3;<br>年：随机获得一个武器牌的技能直到回合结束;<br>夕：额外结算一次;<br>方：回复体力至体力上限;<br>余：选择从牌堆中获得任意类型的一张牌。`,
	dingshengmrfz: "定胜",
	dingshengmrfz_info:
		"限定技，出牌阶段，你可以从牌堆或弃牌堆中获得本局游戏你使用过的普通锦囊牌各一张，且令其他角色从牌堆或弃牌堆中获得你未因此获得的一张普通锦囊牌。",
});

//———————奇策十二———————//
let yearsMap: Record<string, string> = {};

const years: Record<string, ExtendedSkill> = {
	shuomrfz: {
		audio: "wowumrfz",
		filter(event, player) {
			const targets = event.targets.filter(t => t.isAlive() && t.isIn());
			return targets && targets.length > 0;
		},
		async content(event, trigger, player) {
			const targets = trigger.targets.filter(t => t.isAlive() && t.isIn());
			const result = await player
				.chooseTarget()
				.set("forced", true)
				.set("prompt", `朔：对一名目标角色造成一点伤害`)
				.set("prompt2", whichWayUtil.colorize(`#r劲发江潮落，气收秋毫平！#`))
				.set("filterTarget", (card, player, target) => {
					return targets.includes(target);
				})
				.set("ai", target => get.damageEffect(target, player, player))
				.forResult();
			if (!result.targets) return;
			const target = result.targets[0];
			target.damage();
			player.line(target);
		},
	},
	wangmrfz: {
		filter(event, player, name, target) {
			//@ts-ignore
			return player.hasUseTarget({ name: "sha", nature: "stab", isCard: true }, true, true);
		},
		async content(event, trigger, player) {
			await player
				.chooseUseTarget({ name: "sha", nature: "stab", isCard: true })
				.set("prompt", `望：视为使用一张刺【杀】`)
				.set("prompt2", whichWayUtil.colorize("#r眼观全局，胜负不在一处。#"))
				.set("addCount", false)
				.set("nodistance", true);
		},
	},
	lingmrfz: {
		audio: "shixingmrfz",
		trigger: {
			player: "useCardAfter",
		},
		filter(event, player) {
			return player.hasUseTarget(get.autoViewAs("jiu"));
		},
		async content(event, trigger, player) {
			await player
				.chooseUseTarget(get.autoViewAs("jiu"))
				.set("prompt", `令：视为使用一张【酒】`)
				.set("prompt2", whichWayUtil.colorize("#r直抒胸臆，酣畅淋漓。#"));
		},
	},
	junmrfz: {
		async content(event, trigger, player) {
			//@ts-ignore
			trigger.directHit ??= [];
			//@ts-ignore
			trigger.directHit.push(...game.players.filter(p => p.isAlive() && p !== player));
		},
	},
	jiemrfz: {
		filter(event, player, name, target) {
			const names = Array.from(
				new Set(
					player
						.getHistory("useCard", evt => {
							//@ts-ignore
							return evt.card && get.type(evt.card) === "basic";
						})
						.map(evt => evt.card.name)
						.flat()
				)
			);
			//@ts-ignore
			return names.filter(name => player.hasUseTarget(name, true, false)).length > 0;
		},
		async content(event, trigger, player) {
			const names = Array.from(
				new Set(
					player
						.getHistory("useCard", evt => {
							//@ts-ignore
							return evt.card && get.type(evt.card) === "basic";
						})
						.map(evt => evt.card.name)
						.flat()
				)
				//@ts-ignore
			).filter(name => player.hasUseTarget(name, true, false));

			const vcards = names.map(name => [get.type(name), "", name]);
			const result = await player
				.chooseButton()
				.set("createDialog",["颉", [vcards, "vcard"]])
				.set("prompt", `颉：视为使用一张你本回合使用过的基本牌`)
				.set("prompt2", whichWayUtil.colorize("#r就这样吧#"))
				.set("ai", button => {
					const player = get.player();
					const name = button.link[2];
					//@ts-ignore
					return player.getUseValue(name, true, false);
				})
				.forResult();
			if (!result.links) return;
			const name = result.links[0][2];
			player
				.chooseUseTarget({ name: name, isCard: true })
				.set("forced", true)
				.set("prompt", `颉：视为使用一张你本回合使用过的基本牌`)
				.set("prompt2", whichWayUtil.colorize("#r就这样吧#"))
				.set("addCount", false)
				.set("nodistance", true);
		},
	},
	shumrfz: {
		marktext: "黍",
		intro: {
			name: "黍",
			content(storage, player) {
				return `下次摸牌数翻${2 ** storage}倍`;
			},
		},
		audio: "kenyemrfz",
		silent: true,
		async content(event, trigger, player) {
			player.addMark("wangmrfz_shumrfz", 1, false);
			player.markSkill("wangmrfz_shumrfz");
			player.addTempSkill("wangmrfz_shumrfz_draw", { player: "drawAfter" });
		},
		subSkill: {
			draw: {
				audio: "wangmrfz_shumrfz",
				forced: true,
				charlotte: true,
				popup: false,
				trigger: {
					player: "drawBegin",
				},
				async content(event, trigger, player) {
					trigger.num *= 2 ** player.countMark("wangmrfz_shumrfz");
					game.log(player, `此次摸牌数翻${2 ^ player.countMark("wangmrfz_shumrfz")}倍`);
					player.removeMark("wangmrfz_shumrfz", 1145141919810, false);
					player.unmarkSkill("wangmrfz_shumrfz");
				},
			},
		},
	},
	jimrfz: {
		filter(event, player) {
			return player.countCards("h") < 5 && Math.min(5, 5 - player.countCards("h")) > 0;
		},
		async content(event, trigger, player) {
			player.draw(Math.min(5, player.getHandcardLimit() - player.countCards("h")));
		},
	},
	yimrfz: {
		filter(event, player) {
			return player.countCards("he") > 0;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseToDiscard()
				.set("prompt", `易：${get.poptip("sjzx_zhiheng")}3`)
				.set("prompt2", whichWayUtil.colorize("#r纵横捭阖，自有制衡之道。#"))
				.set("ai", card => get.value(card, player) < 6)
				.set("selectCard", [0, 3])
				.set("position", "he")
				.forResult();
			if (result.cards) {
				player.draw(result.cards.length);
			}
		},
	},
	nianmrfz: {
		filter(event, player) {
			const skills = getVaildEquipSkills(player);
			return skills.length > 0;
		},
		async content(event, trigger, player) {
			const skill = getVaildEquipSkills(player).randomGet();
			player.addTempSkill(skill, { player: "phaseEnd" });
			game.log(player, `获得 ${get.translation(skill)} 直到回合结束`);
		},
	},
	ximrfz: {
		audio: "huijuanmrfz",
		async content(event, trigger, player) {
			trigger.effectCount ??= 1;
			trigger.effectCount++;
		},
	},
	fangmrfz: {
		async content(event, trigger, player) {
			player.recoverTo(player.maxHp);
		},
	},
	yumrfz: {
		audio: "qizaomrfz",
		async content(event, trigger, player) {
			const result = await player
				.chooseControl("basic", "trick", "equip")
				.set("prompt", "余：选择从牌堆中获得任意类型的一张牌。")
				.set("prompt2", whichWayUtil.colorize("#r热锅冷油，火候正好#"))
				.set("ai", function () {
					const player = get.player();
					if (player.hp <= 3 && !player.countCards("h", { name: ["shan", "tao"] })) {
						return "basic";
					}
					if (player.countCards("he", { type: "equip" }) < 2) {
						return "equip";
					}
					return "trick";
				})
				.forResult();
			const card = get.cardPile(function (card) {
				return get.type(card, "trick") == result.control;
			});
			if (card) {
				await player.gain(card, "gain2", "log");
			}
		},
	},
};

for (const key in years) {
	const info = years[key];
	if (!info.audio) info.audio = "qushimrfz";
	if (!info.trigger)
		info.trigger = {
			player: "useCard1",
		};
	info.charlotte = true;
	info.forced = true;
	// info.popup = false;
	const originalFilter = info.filter;
	info.filter = (event, player, name, target) => {
		if (!event.card || yearsMap[`wangmrfz_${key}`] !== event.card.name) return false;
		return originalFilter ? originalFilter.bind(this)(event, player, name, target) : true;
	};
}

skill({
	qushimrfz: {
		audio: ["作战中1", "作战中2", "作战中3", "作战中4", "部署1", "部署2", "行动出发", "行动开始"],
		trigger: {
			player: "useCardBegin",
		},
		filter(event, player) {
			return (
				event.card &&
				//@ts-ignore
				get.type(event.card) === "trick" &&
				!Object.values(yearsMap).includes(event.card.name) &&
				Object.keys(yearsMap).length < 12
			);
		},
		async content(event, trigger, player) {
			const list = Object.keys(years)
				.filter(year => !yearsMap[`wangmrfz_${year}`])
				.map(year => [get.translation(`wangmrfz_${year}`), get.skillInfoTranslation(`wangmrfz_${year}`)]);

			//TODO:暂时这么写着 有时间用Vue做一个帅的
			const result = await player
				.chooseControl(
					Object.keys(years)
						.filter(year => !yearsMap[`wangmrfz_${year}`])
						.map(i => `wangmrfz_${i}`)
				)
				.set("prompt", `【取势】:为${get.translation(trigger.card)}分配一个效果`)
				.set(
					"choiceList",
					list.map(i => i.join(":"))
				)
				.set("ai", () => get.rand(0, get.event().list.length - 1))
				.set("list", list)
				.set("displayIndex", false)
				.forResult();
			if (result.control) {
				yearsMap[result.control] = trigger.card.name;
				game.log(`将${get.translation(trigger.card)}的效果分配给${get.translation(result.control)}`);
				player.addSkill(result.control);
			}
		},
	},
	dingshengmrfz: {
		audio: ["精英化晋升2", "编入队伍"],
		enable: "phaseUse",
		limited: true,
		mark: true,
		intro: {
			content(storage, player) {
				const usedTricks = getUsedTricks(player);
				const unusedTricks = lib.inpile.filter(name => get.type(name) === "trick" && !usedTricks.includes(name));
				return `·已使用的锦囊牌：${get.translation(usedTricks)}<br>·未使用的锦囊牌：${get.translation(unusedTricks)}<br>·${storage === true ? "已" : "未"}发动限定技`;
			},
		},
		filter(event, player) {
			return player.getStorage("dingshengmrfz") !== true;
		},
		async content(event, trigger, player) {
			const usedTricks = getUsedTricks(player);
			const unusedTricks = lib.inpile.filter(name => get.type(name) === "trick" && !usedTricks.includes(name));

			const gains = [];
			for(let name of usedTricks){
				let card = get.cardPile(name);
				//@ts-ignore
				if(card) gains.push(card);
				else player.chat(`没有${get.translation(name)}了！`);
			}

			if(gains.length){
				await player.gain(gains, "gain2", "log");
			} else{
				player.chat("你布局了个什么？？？");
			}

			const enemyGains = [];
			for(let name of unusedTricks){
				let card = get.cardPile(name);
				//@ts-ignore
				if(card) enemyGains.push(card);
			}

			if(enemyGains.length){
				for(let char of game.players){
					if(char===player) continue;
					await char.gain(enemyGains.randomGet(), "gain2");
				}
			} else{
				player.chat("绝杀无解！");
			}

			player.awakenSkill(event.name);
		},
	},
	...Object.fromEntries(Object.entries(years).map(([key, value]) => [`wangmrfz_${key}`, value])),
});

characterIntro(
	"wangmrfz",
	"望，曾担任炎国军事顾问，现为无业棋手。年、夕、令等人的兄长，重岳的弟弟。经重岳先生介绍来到罗德岛养病，偶尔会为作战任务提供建议。"
);

function getVaildEquipSkills(player: Player): string[] {
	const equips = Object.keys(lib.card).filter(name => get.subtype(name) !== "equip1");
	const skills = [];
	const playerSkills = player.getSkills();
	for (let equipName of equips) {
		const info = lib.card[equipName];
		if (!Array.isArray(info.skills)) continue;
		info.skills.forEach(skill => {
			//@ts-ignore
			if (!playerSkills.includes(skill) && !skills.includes(skill)) skills.push(skill);
		});
	}
	return skills;
}

function getUsedTricks(player: Player): string[] {
	//@ts-ignore
	const history = player.getAllHistory("useCard", evt => evt.card && get.type(evt.card) === "trick");
	return Array.from(new Set(history.map(evt => evt.card.name)));
}
