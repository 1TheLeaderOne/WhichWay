import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("splapulandemrfz", {
			sex: "female",
			group: "xumrfz",
			hp: 3,
			skills: ["shilangmrfz","toulangmrfz","kuanglangmrfz"],
		});

skill({
	"shilangmrfz": {
			audio: 2,
			forced: true,
			trigger: { player: "phaseEnd" },
			filter: function (event, player) {
				return player.storage.phaseHistory;
			},
			async content(event, trigger, player) {
				const phaseHistory = player.storage.phaseHistory;
				if (lib.phaseName.isSubset(Object.keys(phaseHistory))) player.draw();
				else player.loseHp();
			},
		},
	"toulangmrfz": {
			audio: 2,
			trigger: {
				global: ["damageEnd", "useSkill", "logSkillBegin", "useCard", "respond"],
			},
			init(player, skill) {
				game.broadcastAll(() => {
					lib.translate["visible_toulangmrfz"] = "明置";
				});
				player.storage[skill] = {
					damage: false,
					useSkill: false,
				};
			},
			onremove: true,
			forced: true,
			filter(event, player) {
				if (event.name == "damage") {
					return (
						!player.storage.toulangmrfz[event.name] &&
						event.player &&
						event.player.isIn() &&
						event.player.countCards("h", card => !get.is.shownCard(card)) > 0
					);
				} else {
					if (["global", "equip"].includes(event.type)) return false;
					let skill = get.sourceSkillFor(event);
					if (!skill || skill === "toulangmrfz") return false;
					let info = get.info(skill);
					while (true) {
						if (!info || info.charlotte || info.equipSkill) return false;
						if (info && !info.sourceSkill) break;
						skill = info.sourceSkill;
						info = get.info(skill);
					}
					return (
						!player.storage.toulangmrfz["useSkill"] &&
						event.player &&
						event.player.isIn() &&
						event.player.countCards("h", card => !get.is.shownCard(card)) > 0
					);
				}
				return false;
			},
			async content(event, trigger, player) {
				let target = trigger.player;
				player.storage.toulangmrfz[trigger.name === "damage" ? trigger.name : "useSkill"] = true;
				const { cards } = await target
					.chooseCard(true, "h", card => !get.is.shownCard(card), [1, 2])
					.set("prompt", `【头狼】:请明置1-2张手牌`)
					.set("ai", card => {
						return -get.value(card);
					})
					.forResult();
				if (!cards) return;
				target.addShownCards(cards, "visible_toulangmrfz");
			},
			group: "toulangmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					lastDo: true,
					trigger: { global: "roundStart" },
					content() {
						player.storage["toulangmrfz"] = {
							damage: false,
							useSkill: false,
						};
					},
				},
			},
		},
	"kuanglangmrfz": {
			audio: 2,
			enable: "chooseToUse",
			hiddenCard(player, name) {
				return (
					get
						.inpileVCardList(info => {
							const name = info[2];
							return get.type(name) === "basic" || (get.type(name) === "trick" && get.isSingle(name));
						})
						.map(i => i[2])
						.includes(name) &&
					game.hasPlayer(current => {
						return current.countCards("ej") > 0 || current.countCards("h", card => get.is.shownCard(card)) > 0;
					})
				);
			},
			onChooseToUse(event) {
				let player = get.player();
				event.kuanglangmrfz_list = get
					.inpileVCardList(info => {
						const name = info[2];
						return get.type(name) === "basic" || (get.type(name) === "trick" && get.isSingle(name));
					})
					.filter(card => event.filterCard({ name: card[2], nature: card[3] }, player, event));
			},
			filter(event, player) {
				return (
					game.hasPlayer(current => {
						return current.countCards("ej") > 0 || current.countCards("h", card => get.is.shownCard(card)) > 0;
					}) && event.kuanglangmrfz_list.length > 0
				);
			},
			filterTarget(card, player, target) {
				return target.countCards("ej") > 0 || target.countCards("h", card => get.is.shownCard(card)) > 0;
			},
			prompt(event, player) {
				return `你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊`;
			},
			async content(event, trigger, player) {
				const target = event.targets[0];
				if (
					!target.countGainableCards(
						player,
						"hej",
						card => get.is.shownCard(card) || get.position(card) === "e" || get.position(card) === "j"
					)
				)
					return;
				const { links: links2 } = await player
					.choosePlayerCard("hej", target, true)
					.set("filterButton", button => {
						return get.position(button.link) === "e" || get.position(button.link) === "j" || get.is.shownCard(button.link);
					})
					.set("target", target)
					.set("complexSelect", false)
					.set("ai", lib.card.shunshou.ai.button)
					.forResult();
				const list = event.getParent(2)?.kuanglangmrfz_list;
				const { links } = await player
					.chooseButton(["狂狼", [list, "vcard"]], true)
					.set("ai", button => {
						return get.event().player.getUseValue({
							name: button.link[2],
							nature: button.link[3],
						});
					})
					.forResult();

				const evt = event.getParent(2);

				if (!links || !evt) return;

				let name = links[0][2],
					nature = links[0][3];
				game.broadcastAll(
					function (result, name, nature) {
						lib.skill.kuanglangmrfz_backup.viewAs = {
							name: name,
							nature: nature,
							cards: result,
						};
						lib.skill.kuanglangmrfz_backup.prompt = "选择" + get.translation(name) + "（" + get.translation(result) + "）的目标";
					},
					links2,
					name,
					nature
				);
				evt.set("_backupevent", "kuanglangmrfz_backup");
				evt.backup("kuanglangmrfz_backup");
				evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(links2) + "）的目标");
				evt.set("norestore", true);
				evt.set("custom", {
					add: {},
					replace: { window() {} },
				});
				evt.goto(0);
			},
			ai: {
				threaten: 2,
				order: 6,
				result: {
					player(player, target) {
						let val = 1,
							att = get.attitude(player, target);
						if (player.countCards("j") > 0 && target === player) return 114514;
						if (att > 0 && target.countCards("j") > 0) val += 5;
						if (
							att <= 0 &&
							target.countCards("j") > 0 &&
							target.countCards("e") < 1 &&
							target.countCards("h", card => get.is.shownCard(card)) < 1
						)
							val -= 5;
						if (att > 0) val -= 0.5;
						if (att <= 0) val += 1;
						if (target === player) val -= 0.9;
						return val;
					},
				},
			},
		},
});

translate({
	"splapulandemrfz": "荒芜拉普兰德",
	"splapulandemrfz_prefix": "荒芜",
	"shilangmrfz": "时狼",
	"shilangmrfz_info": "锁定技，回合结束时，若你没有阶段被跳过，你摸一张牌，反之你流失一点体力。",
	"toulangmrfz": "头狼",
	"toulangmrfz_info": "锁定技，每轮第一个[受到伤害/发动技能]的角色须明置一到两张手牌。",
	"kuanglangmrfz": "狂狼",
	"kuanglangmrfz_info": "你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊使用。",
});

characterTitle("splapulandemrfz", "<font color='#8b008b'>恣意英杰</font>");

characterIntro("splapulandemrfz", "拉普兰德，无业，叙拉古萨卢佐家族现任家主阿尔贝托的独女，目前已从家族脱离。拉普兰德擅长单兵作战，经常在战术攻坚与肃清作战中为罗德岛提供协助。");
