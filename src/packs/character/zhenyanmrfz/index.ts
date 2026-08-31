import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("zhenyanmrfz", { pack: "legendSJZX",
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["lingxinmrfz", "lianganmrfz", "qinyinmrfz"],
		});

skill({
	"lingxinmrfz": {
			audio: ["任命队长", "作战中4"],
			trigger: {
				player: ["logSkillBegin", "useSkill"],
			},
			filter(event, player) {
				if (!game.expandSkills(player.getSkills()).includes(event.skill)) return false;
				return event.skill !== "lingxinmrfz" && !event.skill.startsWith("lingxinmrfz");
			},
			forced: true,
			async content(event, trigger, player) {
				player
					.when({ global: [`${trigger.skill}After`, `${trigger.skill}_costAfter`] })
					.filter(event => {
						console.log(event);
						return !(event.name.endsWith("_cost") && event.result?.bool === true);
					})
					.then(() => {})
					.assign({
						ai: {
							viewHandcard: true,
							skillTagFilter(player, tag, arg) {
								if (player == arg) return false;
							},
						},
					});
			},
			group: "lingxinmrfz_addTrigger",
			subSkill: {
				addTrigger: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBefore",
						player: ["enterGame", "changeSkillsAfter"],
					},
					filter: function (event, player) {
						return event.name !== "phase" || game.phaseNumber == 0 || event.skill === "changeSkills";
					},
					async content(event, trigger, player) {
						let skills = [];
						skills.addArray(player.getSkills().map(i => i + "_costBegin"));
						game.broadcastAll(
							//@ts-ignore
							(skills, player) => {
								//@ts-ignore
								lib.skill.lingxinmrfz.trigger.player.addArray(skills);
								player.addSkillTrigger("lingxinmrfz", null, true);
							},
							skills,
							//@ts-ignore
							player
						);
					},
				},
			},
		},
	"lianganmrfz": {
			audio: ["部署1", "作战中1"],
			trigger: {
				global: "phaseDrawAfter",
			},
			filter(event, player) {
				//@ts-ignore
				return event.player.countCards("h", card => !card.isConnect()) > 0;
			},
			check(event, player) {
				return get.attitude2(event.player) < 0;
			},
			async cost(event, trigger, player) {
				let target = trigger.player;
				event.result = await player
					.choosePlayerCard(target)
					.set("prompt", get.prompt("lianganmrfz"))
					.set("prompt2", `你可以连接${get.translation(target)}的一张手牌`)
					.set("ai", button => get.value(button.link))
					.forResult();
			},
			async content(event, trigger, player) {
				//@ts-ignore
				event.cards.forEach(card => card.addConnect());
			},
			group: "lianganmrfz_view",
			subSkill: {
				view: {
					audio: "lianganmrfz",
					enable: "chooseToUse",
					filter(event, player) {
						//@ts-ignore
						return game.getConnectCards().length > 1 && player.countCards("h", card => card.isConnect()) > 0;
					},
					hiddenCard(player, name) {
						return (
							game
								//@ts-ignore
								.getConnectCards()
								.map(card => get.name(card))
								.includes(name)
						);
					},
					chooseButton: {
						dialog(event, player) {
							//@ts-ignore
							let list = game.getConnectCards().map(card => [get.type(card), "", get.name(card), get.nature(card)]);
							/**
							 * @type { Dialog }
							 */
							//@ts-ignore
							const dialog = ui.create.dialog("联感", [list, "vcard"]);
							return dialog;
						},
						filter(button, player) {
							//@ts-ignore
							return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
						},
						check(button) {
							var player = _status.event.player;
							//@ts-ignore
							var card = { name: button.link[2], nature: button.link[3] };
							if (player.countCards("hes", cardx => cardx.name == card.name)) {
								return 0;
							}
							//@ts-ignore
							return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
						},
						backup(links, player) {
							return {
								audio: "lianganmrfz",
								filterCard(card) {
									//@ts-ignore
									return card.isConnect();
								},
								popname: true,
								check(card) {
									return 7 - get.value(card);
								},
								position: "h",
								viewAs: { name: links[0][2], nature: links[0][3] },
							};
						},
						prompt(links, player) {
							return "将一张连接牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
						},
					},
					ai: {
						order: 1,
					},
				},
			},
		},
	"qinyinmrfz": {
			audio: ["编入队伍", "作战中3"],
			enable: "phaseUse",
			filter(event, player) {
				//@ts-ignore
				return game.hasPlayer(char => char.countCards("h") > 0) && player.hasUseTarget("shunshou", true);
			},
			usable: 1,
			filterTarget(card, player, target) {
				return target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const {
					targets: [target],
				} = event;
				const { cards } = await player
					.choosePlayerCard(target, true)
					.set("prompt", `请以弃置的方式将${get.translation(target)}的一张手牌当【顺手牵羊】使用`)
					.set("nodistance", true)
					.set("ai", button => {
						let card = button.link;
						let val = get.value(card);
						if (card.isConnect()) return val + 3;
						return val;
					})
					.forResult();
				player.chooseUseTarget({ name: "shunshou" }, cards).set("forced", true).set("qinyinmrfz", true);
			},
			ai: {
				result: {
					target(player, target) {
						return -1;
					},
				},
			},
			group: ["qinyinmrfz_discard", "qinyinmrfz_roundEnd"],
			subSkill: {
				roundEnd: {
					auio: "qinyinmrfz",
					trigger: {
						global: "roundEnd",
					},
					filter() {
						//@ts-ignore
						return lib.skill.qinyinmrfz.filter.apply(this, arguments);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget()
							.set("prompt", get.prompt("qinyinmrfz"))
							.set("filterTarget", lib.skill.qinyinmrfz.filterTarget)
							.set("ai", target => get.attitude2(target) < 0)
							.set("nodistance", true)
							.forResult();
					},
					async content(event, trigger, player) {
						//@ts-ignore
						await lib.skill.qinyinmrfz.content(event, trigger, player);
					},
				},
				discard: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "chooseUseTargetBegin",
					},
					filter(event, player) {
						//@ts-ignore
						return event.qinyinmrfz === true;
					},
					async content(event, trigger, player) {
						for (let target of trigger.targets) {
							await target.discard(trigger.cards);
						}
					},
				},
			},
		},
});

translate({
	"zhenyanmrfz": "真言",
	"lingxinmrfz": "聆心",
	"lingxinmrfz_info": "锁定技，你的技能发动期间，其他角色的手牌对你可见。",
	"lianganmrfz": "联感",
	"lianganmrfz_info": "➀任意角色的摸牌阶段结束后，你可以连接其一张手牌;<br>➁你的连接牌可当任意处于连接状态的牌使用。",
	"qinyinmrfz": "侵音",
	"qinyinmrfz_info": "出牌阶段限一次，或每轮结束时，你可以以弃置的方式把一名角色的手牌当无距离限制的【顺手牵羊】使用。",
});

characterTitle("zhenyanmrfz", "<font color = #128985ff>噤声限域</font>");

characterIntro("zhenyanmrfz", "真言，罗德岛精英干员。受凯尔希邀请加入巴别塔，曾参与卡兹戴尔内战，后成为罗德岛首批精英干员之一。<br>真言长期担任特殊行动第三小队领队，能与通讯员配合，在难以建立稳定通讯或需要秘密行动的情况下，使用源石技艺维持沟通和协调各方，是任务中不可或缺的存在。");
