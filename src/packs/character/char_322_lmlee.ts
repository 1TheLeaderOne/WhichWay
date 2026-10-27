import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";
import { gameUtils } from "../../nonameEx/custom/gameUtils.ts";
import { whichwayAI } from "../../ai/index.ts";

character("char_322_lmlee", { pack: "legendSJZX", sex: "male", group: "limrfz", hp: 3, skills: ["linhuamrfz", "yourenmrfz", "beiyumrfz"] });

skill({
	linhuamrfz: {
		mod: {
			targetEnabled(card: Card) {
				if (get.type(card) == "delay") {
					return false;
				}
			},
		},
		audio: ["作战中1", "作战中2"],
		trigger: { source: "damageBefore" },
		forced: true,
		async content(event, trigger, player) {
			trigger.cancel();
			trigger.player.damage({
				num: trigger.num,
				nature: trigger.nature,
				nosource: true,
				nocard: true,
			});
		},
	},
	yourenmrfz: {
		audio: ["作战中4", "部署2"],
		trigger: { global: "useCardAfter" },
		filter(event, player, name, target) {
			const damaged = player.hasHistory("damage", evt => evt.card && evt.getParent(2) == event);
			const num = Math.min(player.getHandcardLimit(), 5);
			if (event.card && event.cards && get.is.damageCard(event.card) && event.targets?.includes(player)) {
				if (damaged) return (num > 0 && player.countCards("he", card => player.canRecast(card)) > 0) || event.cards.filterInD().length > 0;
				return player.countCards("h") < num;
			}
			return false;
		},
		async cost(event, trigger, player) {
			const damaged = player.hasHistory("damage", evt => evt.card && evt.getParent(2) == trigger);
			const num = Math.min(player.getHandcardLimit(), 5);
			event.result = await player
				.chooseBool({
					prompt: get.prompt("yourenmrfz"),
					prompt2: damaged ? `是否获得对你造成伤害的牌（${get.translation(trigger.cards.filterInD())}）${num > 0 ? `并重铸至多${get.cnNumber(num)}张牌` : ``}？` : `是否将手牌补至${get.cnNumber(num)}？`,
					ai(event, player) {
						return true;
					},
				})
				.forResult();
		},
		async content(event, trigger, player) {
			const damaged = player.hasHistory("damage", evt => evt.card && evt.getParent(2) == trigger);
			const num = Math.min(player.getHandcardLimit(), 5);
			if (!damaged) {
				await player.drawTo(num);
			} else {
				const cards = trigger.cards.filterInD();
				if (cards.length > 0) {
					await player.gain({
						cards,
						animate: "gain2",
					});
				}
				if (num > 0 && player.countCards("he", card => player.canRecast(card)) > 0) {
					const result = await player
						.chooseCard({
							prompt: `请重铸至多${get.cnNumber(num)}张牌`,
							filterCard(card, player, event) {
								return player.canRecast(card);
							},
							selectCard: [1, num],
							position:"he",
							ai(card) {
								let val = 8 - get.value(card);
								if (whichwayAI.triggerBaiyin(player)) val += 10;
								if (player.hasSkill("linhuamrfz") && get.name(card) === "shandian") val += 5;
								return val;
							},
						})
						.forResult();
					if (result.cards) {
						await player.recast(result.cards);
					}
				}
			}
		},
	},
	beiyumrfz: {
		mod: {
			maxHandcard(player, num) {
				return (num += player.countMark("beiyumrfz"));
			},
		},
		intro: {
			content(storage, player, skill) {
				return `·手牌上限+${storage}`;
			},
		},
		audio: ["行动开始", "选中干员2"],
		trigger: {
			global: "roundStart",
		},
		onremove: true,
		check: () => true,
		async content(event, trigger, player) {
			const cards = lib.inpile.map(name => get.autoViewAs({ name, suit: "none" })).filter(i => ["trick", "basic"].includes(get.type2(i)));
			const result = await player
				.chooseFakeCard({
					tagName: "待声明",
					cards,
					selectCard: [1, 2],
					filterCard: () => true,
					ai(card) {
						let val = Math.random();
						let name = get.name(card)!;
						if (name === "sha") val += 0.2;
						if (name === "juedou") val += 0.1;
						if (name === "nanman") val += 0.15;
						if (name === "wanjian") val += 0.05;
						if( ["shan","wuxie"].includes(name)) val -= 100;
						if(get.is.damageCard(get.autoViewAs({name}))) val += 0.1;
						return val;
					},
					forced: true,
					prompt: "请声明至多两种牌，当你于本轮首次成为你声明的牌的目标后，你摸一张牌或使用一张手牌",
				})
				.forResult();
			if (result.cards) {
				game.log(player, "声明了一些牌");
				player.storage.beiyumrfz_eff ??= [];
				player.storage.beiyumrfz_eff.push(...result.cards.map(i => get.name(i)));
				player.addTempSkill("beiyumrfz_eff", { global: "roundEnd" });
			}
		},
		subSkill: {
			eff: {
				audio: "beiyumrfz",
				charlotte: true,
				forced: true,
				trigger: { target: "useCardToTargeted" },
				onremove(player, type) {
					player.storage["beiyumrfz_eff"] = [];
				},
				mark: true,
				intro: {
					content(x, player, skill) {
						const storage: string[] | undefined = player.storage["beiyumrfz_eff"];
						if (player.isUnderControl(true)) {
							return storage ? `声明的牌:${get.translation(storage)}` : `没有声明的牌或声明的牌均已被触发`;
						}
						return `猜猜看呐~`;
					},
				},
				filter(event, player, name, target) {
					const names: string[] | undefined = player.storage.beiyumrfz_eff;
					return names && event.card && names.includes(get.name(event.card)!);
				},
				async content(event, trigger, player) {
					player.storage.beiyumrfz_eff.remove(get.name(trigger.card));

					const result = await player
						.chooseToUse({
							prompt: "【备豫】：你可以使用一张手牌，若不使用手牌则摸一张牌",
							filterCard(card, player, event) {
								if (get.itemtype(card) != "card" || !["h", "s"].includes(get.position(card))) {
									return false;
								}
								return lib.filter.filterCard.apply(this, arguments);
							},
							filterTarget(card, player, target) {
								return lib.filter.targetEnabled.apply(this, arguments);
							},
						})
						.set("addCount", false)
						.set("nodistance", true)
						.forResult();
					if (result.bool === false) await player.draw();
					player.addMark("beiyumrfz", 1, false);
				},
			},
		},
	},
});

translate({
	char_322_lmlee: "老鲤",
	linhuamrfz: "鳞滑",
	linhuamrfz_info: "锁定技，你造成的伤害始终视为无卡牌且无来源伤害;你不能成为延时锦囊的目标。",
	yourenmrfz: "游刃",
	yourenmrfz_info: "当其他角色对你使用的伤害类牌结算完毕后，若此牌没有对你造成伤害，你可以将手牌补至X，否则你可以获得此牌并重铸至多X张牌。（X=你的手牌上限，X至多为5）",
	beiyumrfz: "备豫",
	beiyumrfz_info: "每轮开始时，你可以秘密声明至多两种基本牌或普通锦囊牌，当你于本轮首次成为你声明的牌的目标后，你摸一张牌或使用一张手牌(无距离次数限制)，然后你的手牌上限+1。",
});

characterIntro("char_322_lmlee", "老鲤，私家侦探，龙门鲤氏侦探事务所的创办者。在罗德岛于龙门发展业务的过程中与罗德岛相识，随后建立合作关系。为罗德岛提供关于龙门本地信息的咨询服务，也向罗德岛引荐过一些人才。");

characterTitle("char_322_lmlee","但思善恶");