import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, characterReplace } from "../hooks.ts";
import { whichWayUtil } from "../../utill.js";

const NAME = "spanjielinamrfz";

character(NAME, {
	hp: 3,
	pack: "legendSJZX",
	group: "luomrfz",
	skills: ["feijianmrfz", "zhixingmrfz"],
	sex: "female",
});

characterIntro(NAME, "安洁莉娜，服务于罗德岛的资深信使，足迹遍布迄今为止已知的大多数国家。同时，她也作为资深术师干员，利用其独特的源石技艺为罗德岛提供帮助。");
characterTitle(NAME, whichWayUtil.colorize("#y不一样的愿景#"));
characterReplace(NAME, [NAME, "anjielinamrfz"]);

translate({
	[NAME]: "予愿安洁莉娜",
	[`${NAME}_prefix`]: "予愿",

	feijianmrfz: "飞笺",
	feijianmrfz_info: "使命技，每种类型的牌限一次，你可以视为使用你手牌中的一张基本牌或普通锦囊牌并将此牌交给一名其他角色，获得此牌的角色选择令你模一张牌或弃置此牌。<br>成功：你因【飞笺】而摸至少两次牌：回复一点体力。",

    "feijianmrfz_draw":"invisible",
});

skill({
	feijianmrfz: {
        dutySkill:true,
		audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
		enable: "phaseUse",
        mark:true,
        intro:{
            content(storage, player, skill) {
                const types:string[] = storage || [];
                return `·已使用过的类型:${types.length>0 ? get.translation(types) : "无"}<br>·已因【飞笺】摸了${(player.storage.feijianmrfz_count || 0)}张牌`
            },
        },
		init(player, skill) {
			player.storage.feijianmrfz = [];
		},
        onremove(player, type) {
            delete player.storage[type];
            delete player.storage.feijianmrfz_count;
        },
		hiddenCard(player, name) {
			const storage = player.getStorage("feijianmrfz");
			return player.hasCard(card => {
				const type = get.type(card);
				if (type == "trick" || type == "basic") {
					return !storage.includes(type) && get.name(card, player) == name;
				}
				return false;
			}, "h");
		},
		filter(event, player) {
			const storage = player.getStorage("feijianmrfz");
			return player.hasCard(card => {
				const type = get.type(card);
				if (type == "trick" || type == "basic") {
					return (
						event.filterCard(
							get.autoViewAs({
								name: get.name(card, player),
								suit: get.suit(card, player),
								nature: get.nature(card, player),
								number: get.number(card, player) as number,
								isCard: true,
							}),
							player,
							event
						) && !storage.includes(type)
					);
				}
				return false;
			}, "h");
		},
		//@ts-ignore
		filterCard(card, player, event) {
			event = event || _status.event;
			const storage = player.getStorage("feijianmrfz");
			const type = get.type(card, player);
			if (type == "trick" || type == "basic") {
				return !!(
					event._backup.filterCard(
						get.autoViewAs({
							name: get.name(card, player),
							suit: get.suit(card, player),
							nature: get.nature(card, player),
							number: get.number(card, player) as number,
							isCard: true,
						}),
						player,
						event
					) && !storage.includes(type)
				);
			}
			return false;
		},
		ignoreMod: true,
		position: "h",
		//@ts-ignore
		viewAs(cards, player) {
			if (cards.length) {
				const card = cards[0];
				return {
					name: get.name(card, player),
					suit: get.suit(card, player),
					nature: get.nature(card, player),
					number: get.number(card, player) as number,
					isCard: true,
				};
			}
			return null;
		},
		prompt: "视为使用手牌中一张普通锦囊牌或基本牌并将此牌交给一名其他角色",
		async precontent(event, trigger, player) {
			const cards = event.result.cards as Card[];
			const card = event.result.card as Card;
			const type = get.type(card);
			player.markAuto("feijianmrfz", type);
			delete event.result.cards;
			const result = await player
				.chooseTarget({
					prompt: "【飞笺】:将此牌交给一名其他角色",
					filterTarget: lib.filter.notMe,
					ai(target) {
						return get.attitude2(target) > 0 ? 1 : 0;
					},
				})
				.forResult();
			if (result && result.targets) {
				const target = result.targets[0];
				await target.gain({ cards, animate: "gain2" });
				const result2 = await target
					.chooseToDiscard({
						prompt: `【飞笺】:请弃置${get.translation(cards)}，否则${get.translation(player)}摸一张牌`,
						filterCard(card, player, event) {
							return cards.includes(card);
						},
						selectCard() {
							return cards.length;
						},
						ai(card) {
							const player = get.player();
							const { target } = get.event();
							if (get.attitude(player, target) > 0) return -1;
							return 6 - get.value(card);
						},
					})
					.set("targetx", player)
					.forResult();
				if (!result2.bool) {
					player.draw({
                        gaintag:["feijianmrfz_draw"]
                    });
				}
			}
		},
        group:["feijianmrfz_achieve","feijianmrfz_count"],
        subSkill:{
            count:{
                charlotte:true,
                silent:true,
                trigger:{
                    player:"drawAfter"
                },
                filter(event, player, name, target) {
                    const tags = event.gaintag as any[] || undefined;
                    console.log(event,tags,tags.includes("feijianmrfz_draw"))
                    return tags && tags.includes("feijianmrfz_draw");
                },
                async content(event, trigger, player) {
                    player.storage.feijianmrfz_count ??=0;
                    player.storage.feijianmrfz_count += 1;
                },
            },
            achieve:{
                audio:"feijianmrfz",
                forced:true,
                trigger:{
                    player:"feijianmrfz_countAfter"
                },
                filter(event, player, name, target) {
                    return (player.storage.feijianmrfz_count || 0) > 1;
                },
                async content(event, trigger, player) {
                    delete player.storage.feijianmrfz_count;
                    game.log(player, "成功完成使命");
					player.awakenSkill("feijianmrfz");
                    player.recover();
                },
            },
        },
	},
});
