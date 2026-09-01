import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("doushitalulamrfz", { pack: "plotSJZX",
			sex: "female",
			group: "zhmrfz",
			hp: 4,
			skills: ["zhuoximrfz","talula_shixinmrfz"],
		});

skill({
	"talula_shixinmrfz": {
			audio: 2,
			trigger: {
				source: "damageEnd",
			},
			filter(event, player) {
				return event.player && event.player.isIn() && !!event.player.countGainableCards(player, "hes");
			},
			async content(event, trigger, player) {
				var pos = [];
				for (var i of trigger.player.getCards("hes")) {
					pos.add(get.position(i));
				}
				var { cards } = await player
					.choosePlayerCard("hes", trigger.player, true)
					.set("prompt", `【拾薪】:请选择其各区域内的一张牌`)
					.set("selectButton", pos.length)
					.set("filterButton", button => {
						let cards = ui.selected.cards;
						let pos = cards.slice().map(card => get.position(card));
						return !pos.includes(get.position(button));
					})
					.set("complexSelect", true)
					.set("ai", lib.card.shunshou.ai.button)
					.forResult();
				if (!cards) return;
				if (_status.connectMode)
					// @ts-ignore
					game.broadcastAll(function () {
						// @ts-ignore
						_status.noclearcountdown = true;
					});
				// @ts-ignore
				event.given_map = {};
				while (cards.length > 0) {
					var { links } =
						cards.length == 1
							? { links: cards }
							: await player
									.chooseCardButton("【拾薪】:请选择要分配的牌", true, cards, [1, cards.length])
									.set("ai", () => {
										if (ui.selected.buttons.length == 0) return 1;
										return 0;
									})
									.forResult();
					if (!links) continue;
					// @ts-ignore
					event.togive = links.slice();
					cards.removeArray(links);
					const { targets } = await player
						// @ts-ignore
						.chooseTarget("选择一名角色获得" + get.translation(event.togive), true)
						.set("ai", target => {
							const att = get.attitude(_status.event.player, target);
							// @ts-ignore
							if (_status.event.enemy) {
								return -att;
							} else if (att > 0) {
								return att / (1 + target.countCards("h"));
							} else {
								return att / 100;
							}
						})
						// @ts-ignore
						.set("enemy", get.value(event.togive[0], player, "raw") < 0)
						.forResult();
					if (targets) {
						const id = targets[0].playerid,
							// @ts-ignore
							map = event.given_map;
						if (!map[id]) map[id] = [];
						// @ts-ignore
						map[id].addArray(event.togive);
					}
				}
				if (_status.connectMode) {
					// @ts-ignore
					game.broadcastAll(function () {
						// @ts-ignore
						delete _status.noclearcountdown;
						game.stopCountChoose();
					});
				}
				const list = [];
				// @ts-ignore
				for (const i in event.given_map) {
					const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i];
					player.line(source, "green");
					if (player !== source && (get.mode() !== "identity" || player.identity !== "nei")) player.addExpose(0.2);
					// @ts-ignore
					list.push([source, event.given_map[i]]);
				}
				game.loseAsync({
					gain_list: list,
					giver: player,
					animate: "draw",
				}).setContent("gaincardMultiple");
			},
		},
	"zhuoximrfz": {
			init(player, skill) {
				player.storage[skill] = [];
			},
			audio: 2,
			trigger: {
				player: "useCard",
			},
			filter(event, player) {
				if (!event.card) return false;
				return (
					!player.storage.zhuoximrfz.includes(get.type2(event.card)) &&
					game.hasPlayer(current => {
						return get.distance(current, player) == player.hp && current != player;
					})
				);
			},
			// @ts-ignore
			async cost(event, trigger, player) {
				const { result } = await player
					.chooseTarget(`【灼息】:你可以对一名与你距离为${player.hp}的角色造成一点火焰伤害`)
					// @ts-ignore
					.set("filterTarget", (card, player, target) => {
						return get.distance(target, player) == player.hp && target != player;
					})
					.set("ai", target => {
						var player = get.event().player;
						return get.damageEffect(target, player, player, "fire") > 0;
					});
				if (!result) return;
				event.result = result;
			},
			async content(event, trigger, player) {
				let target = event.targets[0];
				target.damage("fire");
				player.line(target);
				if (!player.storage.zhuoximrfz) player.storage.zhuoximrfz = [];
				player.storage.zhuoximrfz.add(get.type2(trigger.card));
			},
			group: "zhuoximrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					async content(event,trigger,player) {
						// @ts-ignore
						player.storage.zhuoximrfz = [];
					},
				},
			},
		},
});

translate({
	"doushitalulamrfz": "斗士塔露拉",
	"doushitalulamrfz_prefix": "{\r\n\t\tname:\"斗士\"",
	"talula_shixinmrfz": "拾薪",
	"talula_shixinmrfz_info": "当你造成伤害后，你可以选择其各区域内的一张牌，然后将这些牌任意分配给任意角色。",
	"zhuoximrfz": "灼息",
	"zhuoximrfz_info": "每回合每种类型的牌各限一次，当你使用一张牌后，你可以对一名与你距离为X的其他角色造成1点火焰伤害（X=你的体力值）。",
});

characterTitle("doushitalulamrfz", "<font color=#be260e>诅咒缠身</font>");

characterIntro("doushitalulamrfz", "摘自PRST的梗概</br>塔露拉，全名塔露拉·雅特利亚斯，种族德拉克。整合运动领袖兼发言人，性格坚定而富有感染力。使用火焰系源石技艺。爱德华的遗腹子。幼年时与陈相伴，后被科西切公爵掳走并受其教育。为防止科西切利用自己，将一小块源石结晶刺进自己的胳膊，成为了感染者，后将科西切杀死。为了自己的理想在乌萨斯的雪原上建立了感染者组织“整合运动”。但在到达雪原上的某个村庄时，目睹了人们对感染者残酷对待的现实并对自己的信念产生怀疑。受科西切留下的法术的影响，其身体被科西切的意识控制。随后将整合运动单纯地用作工具。与阿米娅和陈于切尔诺伯格核心城的指挥塔塔顶决战后，在两人的劝说下回归其原本人格，被罗德岛收监。后被九劫走。目前扣押于新整合并与其一同活跃于维多利亚，由于其被黑蛇掌控时的作为并不被维多利亚人所知，因此作为新整合用以拉拢维多利亚感染者的旗帜。");
