import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "miuyinmrfz";

character(NAME, {
	sex: "female",
	hp: 3,
    maxHp:4,
	skills: ["miuyuanmrfz", "zhengguomrfz", "qianshimrfz"],
	group: "gemrfz",
	pack: "legendSJZX",
});

characterTitle(NAME, whichWayUtil.colorize(`#r绕动之谬#`));
characterIntro(NAME, "谬因，哥伦比亚人，常居玻利瓦尔。原哥伦比亚卢米内斯大学（拉乌尼达分校）副教授，在应用源石学、信息与计算科学领域造诣颇深。于玻利瓦尔大行军事件后辞去教学职务，现以术师干员身份供职于罗德岛。");

translate({
	[NAME]: "谬因",

	miuyuanmrfz: "谬源",
	miuyuanmrfz_info: "出牌阶段限一次，你可以将一张牌置于牌堆顶，并令一名其他角色选择一项：<br>1.令你摸两张牌;<br>2.摸一张牌，然后交给你两张牌，<br>然后因此摸牌的角色使用下一张基本牌或普通锦囊牌选择目标时，你为此牌额外指定一名角色作为目标。",
	zhengguomrfz: "正果",
	zhengguomrfz_info: "其他角色使用的基本牌或普通锦囊牌指定了至少两个目标后，你可以重新指定此牌的一个目标。",
	qianshimrfz: "潜识",
	qianshimrfz_info: "锁定技，每回合你首次不因【潜识】而[受到伤害/回复体力]时，你改为[回复/流失]一点体力。",
});

skill({
	miuyuanmrfz: {
		audio: ["行动出发", "行动开始"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("h") > 0 && game.hasPlayer(p => p !== player && p.isIn());
		},
		ai: {
			order: 8,
			result: { player: 1,target:-1 },
		},
        filterCard:()=>true,
        filterTarget(card, player, target) {
            return target !== player && target.isIn();
        },
        check(card){
            return 8 - get.value(card)
        },
        prompt(event, player) {
            return `你可以将一张牌置于牌堆顶，并令一名其他角色选择一项：<br>1.令你摸两张牌;<br>2.摸一张牌，然后交给你两张牌，<br>然后因此摸牌的角色使用下一张基本牌或普通锦囊牌选择目标时，你为此牌额外指定一名角色作为目标。`;
        },
        init(player, skill) {
            player.storage[skill] = [];
        },
        onremove(player, type) {
            delete player.storage.miuyuanmrfz;
        },
        intro:{
            content(storage, player, skill) {
                if(!storage || (Array.isArray(storage) && storage.length < 0)) return `·无效果`
                return `·你为${get.translation(storage)}使用的下一张基本牌或普通锦囊牌额外指定一名角色为目标`
            },
        },
        discard:false,
        lose:false,
        delay:false,
		async content(event, trigger, player) {
			const card = event.cards && event.cards[0];
			const target = event.targets && event.targets[0];
			if (!card || !target) return;
			// 1. 手牌置于牌堆顶
			player.$throw(1, 1000);
			await player.lose({
				position: ui.cardPile,
				cards: [card],
				insert_card: true,
			});
			game.log(player, "将一张牌置于牌堆顶");
			// 2. 目标角色选择：令谬因摸两张 / 自己摸一张并交给谬因两张
			const opt2 = target.countCards("h") >= 2;
			const choices = opt2 ? ["令" + get.translation(player) + "摸两张牌", "摸一张牌，然后交给" + get.translation(player) + "两张手牌"] : ["令" + get.translation(player) + "摸两张牌"];
			const { index } = opt2 ? await target
				.chooseControl({ choiceList: choices })
				.set("prompt", "【谬源】：请选择一项")
				.set("ai", () => (get.attitude(target, player) > 0 ? 0 : 1))
				.forResult() : {index:0};
			if (typeof index !== "number" || index < 0) return;
			let buffUser = player;
			if (index === 0) {
				buffUser = player;
				await player.draw(2);
			} else {
				buffUser = target;
				await target.draw(1);
				if (target.countCards("h") >= 2) {
					const give = await target
						.chooseCard({
							prompt: "【谬源】：交给" + get.translation(player) + "两张手牌",
							position: "h",
							selectCard: [2, 2],
							ai: card => -get.value(card),
                            forced:true,
						})
						.forResult();
					if (give.bool && give.cards && give.cards.length) {
						await player.gain({
							cards: give.cards,
							source: target,
						});
                        target.$give(2,player);
					}
				} else {
					await player.gain({
						cards: target.getCards("h"),
						source: target,
					});
                    target.$give(target.getCards("h").length,player);
				}
			}
			// 4. 记录加成：摸牌角色使用下一张基本/普通锦囊时，谬因可为它额外指定目标
            player.storage.miuyuanmrfz ??= [];
            player.storage.miuyuanmrfz.add(buffUser);
            player.markSkill("miuyuanmrfz");
		},
		// 触发段：buff 生效
		group: "miuyuanmrfz_zeng",
		subSkill: {
			zeng: {
				// useCard2：整张牌目标确定后、结算前一次性触发（event.targets 为全体）
				trigger: { global: "useCard2" },
				filter(event, player) {
					const buffs = (player.storage.miuyuanmrfz || []) as Player[];
                    if(!buffs.includes(event.player)) return false;
					const card = event.card;
					if (!card || !event.targets || event.targets.length < 1) return false;
					const type = get.type(card);
					if (type !== "basic" && type !== "trick") return false;
					return game.hasPlayer(target => {
						if (event.targets.includes(target)) return false;
                        //@ts-ignore
						return event.player.canUse(card,target,true,false);
					});
				},
				async cost(event, trigger, player) {
					const card = trigger.card;
					const user = trigger.player;
					const targets = game.filterPlayer(target => {
						if (trigger.targets.includes(target)) return false;
						//@ts-ignore
						return user.canUse(card,target,true,false);
					});
					if (!targets.length) return;
					event.result = await player
						.chooseTarget({
							prompt: get.prompt("miuyuanmrfz"),
							prompt2: "为" + get.translation(card) + "额外指定一名角色作为目标",
							filterTarget(card, player, target) {
								return targets.includes(target);
							},
							ai(target) {
								const p = get.player();
								return get.effect(target, _status.event.getTrigger().card, p, p);
							},
						})
						.forResult();
				},
				async content(event, trigger, player) {
					(player.storage.miuyuanmrfz as Player[]).remove(trigger.player);
					const { targets } = event;
					if (!targets || !targets.length) return;
					trigger.targets.addArray(targets);
					game.log(targets, "成为了", trigger.card, "的额外目标");
				},
			},
		},
	},
	zhengguomrfz: {
		audio: ["作战中1", "作战中3"],
		// useCard2：整张牌目标确定后、结算前一次性触发（event.targets 为全体）
		trigger: { global: "useCard2" },
		filter(event, player) {
			// 其他角色使用的基本/普通锦囊指定了至少两个目标
			if (event.player === player || !event.player.isIn()) return false;
			const card = event.card;
			if (!card || !event.targets || event.targets.length < 2) return false;
			const type = get.type(card);
			if (type !== "basic" && type !== "trick") return false;
			return event.targets.some(t => t.isIn());
		},
		async cost(event, trigger, player) {
			const card = trigger.card;
			const user = trigger.player; // 牌的使用者（不是谬因自己）
			// 一次选择两名角色：第一个 = 要移出的原目标；第二个 = 新增目标。
			// 新增目标只需“这张牌对该目标合法”（按使用者 user 判定），与谬因自身无关。
			event.result = await player
				.chooseTarget({
					prompt: get.prompt("zhengguomrfz"),
					prompt2: "依次点选两名角色：先选一张原目标（移出），再选一名新增目标",
					selectTarget: [2, 2],
					filterTarget(card, player, target) {
						const cardx = _status.event.cardx;
						const usery:Player = _status.event.usery;
						const oldList = _status.event.oldList;
						const first = ui.selected.targets[0];
						if (!first) {
							// 第一个选择：必须是这张牌的原目标
							return oldList.includes(target);
						}
						// 第二个选择：新增目标（不得是已选原目标 / 不得已在原目标中）
						if (target === first) return false;
						if (oldList.includes(target)) return false;
						//@ts-ignore
						return usery.canUse(cardx,target,true,false);
					},
					ai(target) {
						const p = get.player();
						const ev = get.effect(target, _status.event.cardx, p, p);
						// 第 1 个目标用于移出（倾向移出收益小的），第 2 个用于新增（倾向收益大）
						const oldList = _status.event.oldList || [];
						return oldList.includes(target) ? 10 - ev : ev;
					},
				})
                .set("targetprompt",["移除目标","新增目标"])
                .set("cardx",card)
                .set("usery",user)
                .set("oldList",trigger.targets.filter(t => t.isIn()))
				.forResult();
		},
		async content(event, trigger, player) {
            const { targets:[oldTarget,newTarget] } = event;
			if (!oldTarget || !newTarget) return;
			trigger.targets.remove(oldTarget);
            if(!trigger.targets.includes(newTarget)) trigger.targets.push(newTarget);
		},
	},
	qianshimrfz: {
		audio: ["部署1", "部署2"],
		forced: true,
		trigger: { global: ["damageBegin3", "recoverBegin"] },
		filter(event, player) {
			if (event.player !== player || !player.isIn()) return false;
            const evt = event.getParent();
            if(evt && evt.name === "qianshimrfz") return false;
            const mark = player.storage.qianshimrfz;
            if(event.name === "damage") return !mark.damage;
			return !mark.recover;
		},
        init(player, skill) {
            return player.storage[skill] = {
                damage:false,
                recover:false
            }
        },
        onremove:true,
		async content(event, trigger, player) {
            console.log(trigger)
            if(!player.storage.qianshimrfz){
                lib.skill["qianshimrfz"].init && lib.skill["qianshimrfz"].init(player,"qianshimrfz");
            }

			if (trigger.name === "damage") {
				trigger.cancel();
				game.log(player, "将受到的伤害改为回复体力");
				await player.recover(1);
                player.storage.qianshimrfz["damage"] = true;
			} else {
				trigger.num = 0;
				game.log(player, "将回复的体力改为流失体力");
				await player.loseHp(1);
                player.storage.qianshimrfz["recover"] = true;
			}
		},
		group: "qianshimrfz_reset",
		subSkill: {
			reset: {
				trigger: { global: "phaseBegin" },
				forced: true,
				silent: true,
				async content(event, trigger, player) {
					lib.skill["qianshimrfz"].init && lib.skill["qianshimrfz"].init(player,"qianshimrfz");
				},
			},
		},
	},
});
