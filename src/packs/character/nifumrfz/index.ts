import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("nifumrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["xunxinmrfz","chixinmrfz","kuixinmrfz"],
		});

skill({
	"xunxinmrfz": {
			audio: 2,
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return game.hasPlayer(current => {
					return !current.hasCard(card => get.is.shownCard(card), "h") && current.countCards("h") > 0;
				});
			},
			filterTarget(card, player, target) {
				return !target.hasCard(card => get.is.shownCard(card), "h") && target.countCards("h") > 0;
			},
			prompt: "【巡心】:请选择一名没有明置牌的角色",
			async content(event, trigger, player) {
				const target = event.targets[0];
				const { cards } = await player
					.choosePlayerCard("h", target)
					.set("prompt", `请选择明置${get.translation(target)}一张手牌`)
					.set("visible", true)
					.set("filterButton", button => {
						return !get.is.shownCard(button);
					})
					.set("ai", button => {
						let target = get.event().target,
							player = get.player();
						let value = get.value(button);
						if (get.attitude(player, target) < 0) {
							let value = get.value(button);
							return target.hasUseTarget(button) ? value - 10 : value;
						}
						return value;
					})
					.set("target", target)
					.forResult();
				if (!cards) return;
				await target.addShownCards(cards, "visible_xunxinmrfz");

				let showncards = [];
				for (let char of game.players) {
					let shown = char.getCards("h", card => get.is.shownCard(card));
					if (shown) showncards.push(...shown);
				}
				let setShown = new Set(showncards.map(i => get.type2(i)));
				let hasTarget = game.hasPlayer(current => {
					return !current.hasCard(card => get.is.shownCard(card), "h") && current.countCards("h") > 0;
				});
				if (setShown.size === showncards.map(i => get.type2(i)).length && hasTarget) {
					const { targets } = await player
						.chooseTarget()
						.set("prompt", `【巡心】:请选择一名没有明置牌的角色`)
						.set("ai", target => {
							let player = get.player();
							return get.attitude(player, target) < 0;
						})
						.set("filterTarget", function (card, player, target) {
							return !target.hasCard(card => get.is.shownCard(card), "h") && target.countCards("h") > 0;
						})
						.forResult();
					if (!targets) return;
					//@ts-ignore
					player.logSkill("xunxinmrfz", targets[0]);
					var next = game.createEvent("xunxinmrfz_cycle");
					next.player = player;
					next.target = targets[0];
					next.targets = targets;
					//@ts-ignore
					next.setContent(lib.skill.xunxinmrfz.content);
				}
			},
		},
	"chixinmrfz": {
			audio: 2,
			global: "chixinmrfz_eff",
			subSkill: {
				eff: {
					forced: true,
					silent: true,
					charlotte: true,
					mod: {
						aiOrder(player, card, num) {
							if (!player.hasCard(card => get.is.shownCard(card), "h")) return;
							if (!get.is.shownCard(card)) {
								let shown = player.getCards("h", card => get.is.shownCard(card));
								if (shown.length > 1) return num - 10;
								return num + get.value({ name: card.name }) - get.value(shown[0]);
							}
							if (get.name(card) == "sha" && player.getCardUsable("sha") < 2) return num + 10;
							if (get.name(card) == "tao" && player.getDamagedHp() == 1) return num + 10;
							if (get.name(card) == "jiu" && player.getCardUsable("jiu") < 2 && player.isPhaseUsing()) return num + 10;
							if (get.name(card) == "wuxie") return num + 10;
						},
						cardname(card, player, name) {
							let shown = player.getCards("h", card => get.is.shownCard(card));
							if (shown && shown.length == 1 && lib.card[shown[0].name].type != "equip") {
								return shown[0].name;
							} else if (shown && (shown.length > 1 || (shown.length == 1 && lib.card[shown[0].name].type == "equip"))) {
								return "wuxie";
							}
						},
					},
				},
			},
		},
	"kuixinmrfz": {
			audio: 2,
			trigger: {
				source: "damageEnd",
			},
			filter(event, player) {
				return event.player != player && event.player.isIn() && event.player.countCards("h") > 0;
			},
			prompt2(event, player) {
				let tran = get.translation(event.player);
				return `是否令${tran}所有的[明置/暗置]牌[暗置/明置]，然后${tran}弃置两张暗置的牌？`;
			},
			check(event, player) {
				return get.attitude(event.player, player) < 0;
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				for (let card of target.getCards("h")) {
					if (get.is.shownCard(card)) target.hideShownCards(card);
					else target.addShownCards(card, "visible_xunxinmrfz");
				}
				let { promise, resolve } = Promise.withResolvers();
				setTimeout(() => {
					resolve(true);
				}, 10);
				await promise;
				if (target.countCards("h", card => !get.is.shownCard(card)) > 0) {
					target
						.chooseToDiscard(true, 2)
						.set("prompt", `【溃心】:请弃置两张暗置的牌`)
						.set("filterCard", card => !get.is.shownCard(card))
						.set("ai", card => get.value({ name: card.name }));
				}
			},
		},
});

translate({
	"nifumrfz": "妮芙",
	"xunxinmrfz": "巡心",
	"xunxinmrfz_info": "出牌阶段限一次，你可以观看一名没有明置牌的角色手牌并明置其中一张牌，若场上没有相同类型的明置牌，你可以重复执行此操作。",
	"chixinmrfz": "笞心",
	"chixinmrfz_info": "锁定技，当一名角色有[唯一的非装备/不唯一或唯一的装备]明置牌时，其所有手牌均视为[明置牌/【无懈可击】]。",
	"kuixinmrfz": "溃心",
	"kuixinmrfz_info": "当你对一名其他角色造成伤害后，你可以令其所有的[明置/暗置]牌[暗置/明置]，然后其弃置两张暗置的牌。",
});

characterTitle("nifumrfz", "<font color=#00868B>耀阳映友</font>");

characterIntro("nifumrfz", "妮芙，卡兹戴尔市民，通过罗德岛驻卡兹戴尔办事处加入罗德岛外勤部门。<br>擅长使用心灵相关的源石技艺，配合其笞心魔的天赋，可在诸多领域发挥特长。");
