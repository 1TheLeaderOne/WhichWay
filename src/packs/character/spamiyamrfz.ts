import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("spamiyamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 4,
			skills: ["chenxianmrfz","benyemrfz","newjueyingmrfz"],
			arkuid:"char_1001_amiya2",
		});

skill({
	"chenxianmrfz": {
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
	"benyemrfz": {
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
	"newjueyingmrfz": {
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
					let card = get.autoViewAs({ name: cards.shift(), isCard: true });
					if (player.hasUseTarget(card)) {
						await player.chooseUseTarget({card:card}).set("prompt2", `待使用：${get.translation(cards)}`);
					}
				}
			},
		},
});

translate({
	"spamiyamrfz": "近卫阿米娅",
	"spamiyamrfz_prefix": "近卫",
	"chenxianmrfz": "沉弦",
	"chenxianmrfz_info": "摸牌阶段，你可以额外摸X张牌，其中每包含一张【万箭齐发】、【杀】或【酒】，你便须弃置一张牌。（X=场上受伤角色数）",
	"benyemrfz": "奔夜",
	"benyemrfz_info": "出牌阶段限一次，你可以展示一名其他角色的手牌，并使用其中的一张【顺手牵羊】或【杀】。",
	"newjueyingmrfz": "绝影",
	"newjueyingmrfz_info": "限定技，任意角色的回合结束时，若本回合有两种颜色的【杀】进入弃牌堆，你可以选择一名你攻击范围内的其他角色，然后你依次视为使用你技能中包含的牌名。",
});

characterTitle("spamiyamrfz", "<font color=#00868B>争斗在此止歇</font>");

characterIntro("spamiyamrfz", "阿米娅，罗德岛的公开领袖，在内部拥有最高执行权。虽然，从外表上看起来仅仅是个不成熟的少女，实际上，她却是深受大家信任的合格的领袖。</br>现在，阿米娅正带领着罗德岛，为了感染者的未来，为了让这片大地挣脱矿石病的阴霾而不懈努力。</br>史载，萨卡兹君王奎隆的佩剑，长度约在0.9到1.2米之间，宽约5厘米，材质不明，通体呈黑色，剑身铭刻萨卡兹传统文字，释作“争斗在此止歇”。");
