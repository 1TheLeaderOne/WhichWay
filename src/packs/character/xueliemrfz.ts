import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("xueliemrfz", { pack: "epicSJZX",
			sex: "female",
			group: "xiemrfz",
			hp: 4,
			skills: ["queliemrfz", "liexuemrfz"],
		});

skill({
	"queliemrfz": {
			audio: ["闲置", "行动出发"],
			trigger: {
				source: "damageSource",
			},
			filter(event, player) {
				return player.getHistory("sourceDamage", evt => evt !== event).length > 0 && event.player.isIn();
			},
			check(event) {
				return get.attitude(get.player(), event.player) > 0;
			},
			prompt2(event) {
				//@ts-ignore
				return `你可以令${get.translation(event.player)}回复${event.num}点体力？`;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				target.recover(trigger.num);
				//@ts-ignore
				target.markSkill("queliemrfz", {
					content: `下次获得牌后，${get.translation(player)}摸等量的牌`,
				});
				if (
					target.getSkills().filter(skill => {
						let info = get.info(skill);
						return info && info.queliemrfz_release;
					}).length < 1
				)
					target
						.when({ player: "gainAfter" })
						.step(async (event, trigger, playerx) => {
							if (player.isIn()) {
								player.draw(trigger.cards.length);
								//@ts-ignore
								player.logSkill("queliemrfz", playerx);
							}
							//@ts-ignore
							playerx.unmarkSkill("queliemrfz");
						})
						.assign({
							queliemrfz_release: true,
						});
			},
		},
	"liexuemrfz": {
			audio: ["作战中1", "作战中4"],
			forced: true,
			trigger: {
				player: "useCardToPlayered",
			},
			/**
			 * @param { Player } player
			 * @param { Player } target
			 */
			getTargets(player, target) {
				if (target === player) return [];

				const clockwise = [],
					anticlockwise = [];
				let current;
				//优先逆时针找，再顺时针找，最后取角色最多的边，若相同则取逆时针的一边
				while (true) {
					if (current === target) break;
					else current = current ? current.getNext() : player.getNext();

					anticlockwise.push(current);
				}

				current = null;
				while (true) {
					if (current === target) break;
					else current = current ? current.getPrevious() : player.getPrevious();

					clockwise.push(current);
				}

				return clockwise.length > anticlockwise.length ? clockwise : anticlockwise;
			},
			filter(event, player) {
				return event.card.name === "sha" && event.targets && event.targets.length === 1 && lib.skill.liexuemrfz.getTargets(player, event.targets[0]).length > 0;
			},
			async content(event, trigger, player) {
				let targets = lib.skill.liexuemrfz.getTargets(player, trigger.targets[0]);
				trigger.targets.addArray(targets);
				//@ts-ignore
				player.line(targets);
			},
			group: ["liexuemrfz_direct"],
			subSkill: {
				direct: {
					silent: true,
					trigger: {
						player: "useCard",
						source: "damageBegin3",
					},
					filter(event, player) {
						const neighbour = [player.getPrevious(), player.getNext()];
						if (event.name === "damage") return event.card && event.card.name === "sha" && !event.numFixed && neighbour.includes(event.player);
						return event.card.name === "sha" && event.targets.some(t => neighbour.includes(t));
					},
					async content(event, trigger, player) {
						if (trigger.name === "damage") trigger.num += 1;
						else {
							//@ts-ignore
							trigger.directHit.addArray(
								game.filterPlayer(function (current) {
									return current != player && [player.getPrevious(), player.getNext()].includes(current);
								})
							);
						}
					},
					ai: {
						directHit_ai: true,
						skillTagFilter(player, tag, arg) {
							return [player.getPrevious(), player.getNext()].includes(arg.target);
						},
					},
				},
			},
		},
});

translate({
	"xueliemrfz": "雪猎",
	"queliemrfz": "阙猎",
	"queliemrfz_info": "当你造成伤害后，若本回合除本次造成伤害外已经造成过伤害,你可以令受伤的角色回复X点体力,然后其下次获得牌后，你摸等量的牌。（X=造成的伤害值）",
	"liexuemrfz": "裂雪",
	"liexuemrfz_info": "锁定技。<br>①当你使用的【杀】指定唯一目标后，目标角色与你之间的所有角色均成为此牌的目标。<br>②座次与你相邻的角色无法响应你使用的【杀】且你使用的【杀】对其伤害+1。",
});

characterTitle("xueliemrfz", "<font color = #1a3cac66>虔信猎人</font>");

characterIntro("xueliemrfz", "雪猎，出身于谢拉格佩尔罗契家迁入雪山生活的一支，祖辈以在山中捕猎为生，雕刻耶拉冈德像的手艺代代相传。<br>雪猎擅长在雪山中狩猎，身体素质极佳，不幸在一次捕猎中感染了矿石病，现于罗德岛接受治疗，并根据个人意愿成为一名外勤干员。");
