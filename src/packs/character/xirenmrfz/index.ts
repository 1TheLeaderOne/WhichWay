import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xirenmrfz", { pack: "epicSJZX",
			sex: "male",
			group: "gemrfz",
			hp: 4,
			skills: ["suximrfz","sanzhongmrfz"],
		});

skill({
	"suximrfz": {
			audio: 2,
			trigger: { player: "useCardAfter" },
			filter(event, player) {
				let cards = event.card.cards.filter(i => player.hasUseTarget(i, false, false) && get.position(i) == "d");
				return !event.card.isCard && event.card.cards.length > 0 && cards.length > 0;
			},
			frequent: true,
			async content(event, trigger, player) {
				let cards = trigger.card.cards.filter(i => player.hasUseTarget(i, false, false) && get.position(i) == "d");
				while (cards.length > 0) {
					const { links } =
						cards.length == 1
							? { links: cards }
							: await player
									.chooseCardButton("【宿锡】:请选择你要使用的牌", cards)
									.set("ai", button => get.player().getUseValue(button, undefined, true))
									.forResult();
					if (!links) return;
					await player.chooseUseTarget(links[0]).set("nodistance", true).set("addCount", false);
					cards.remove(links[0]);
				}
			},
		},
	"sanzhongmrfz": {
			init(player, skill) {
				player.storage[skill] = {
					basic: false,
					trick: false,
					equip: false,
				};
			},
			maps: {
				basic: "tao",
				trick: "shunshou",
				equip: "wuzhong",
			},
			onremove: true,
			audio: 2,
			enable: "chooseToUse",
			hiddenCard: function (player, name) {
				const maps = lib.skill.sanzhongmrfz.maps;
				if (!Object.values(maps).includes(name)) return false;
				for (let key in maps) {
					if (name == maps[key] && player.countCards("hes", { type: key }) > 0) return true;
				}
			},
			filter(event, player) {
				const types = Object.entries(player.storage.sanzhongmrfz)
					.filter(([key, value]) => value === false)
					.map(([key, value]) => key);
				const maps = lib.skill.sanzhongmrfz.maps;
				if (types.length < 1) return false;
				for (let type of types) {
					if (
						player.countCards("hes", { type: type }) < 1 ||
						!event.filterCard(get.autoViewAs({ name: maps[type] }, "unsure"), player, event)
					)
						continue;
					return true;
				}
			},
			chooseButton: {
				dialog: function (event, player) {
					const maps = lib.skill.sanzhongmrfz.maps;
					const swapped = {};
					Object.keys(maps).forEach(key => {
						swapped[maps[key]] = key;
					});
					let list = [];
					for (let name of Object.values(maps)) {
						if (event.filterCard && event.filterCard({ name: name }, player, event)) {
							if (player.storage.sanzhongmrfz[swapped[name]] != false) continue;
							if (player.countCards("hes", { type: swapped[name] }) < 1) continue;
							if (get.type2(name) == "trick") {
								list.push(["锦囊", "", name]);
							} else if (get.type(name) == "basic") {
								list.push(["基本", "", name]);
							}
						}
					}
					return ui.create.dialog("三众", [list, "vcard"]);
				},
				check: function (button) {
					//@ts-ignore
					if (_status.event.getParent().type != "phase") return 1;
					var player = _status.event.player;
					return player.getUseValue({
						name: button.link[2],
					});
				},
				backup: function (links, player) {
					return {
						filterCard(card) {
							const player = get.player();
							const maps = lib.skill.sanzhongmrfz.maps;
							const swapped = {};
							Object.keys(maps).forEach(key => {
								swapped[maps[key]] = key;
							});
							const name = lib.skill.sanzhongmrfz_backup.card;
							return get.type2(card) == swapped[name];
						},
						audio: "sanzhongmrfz",
						popname: true,
						check: function (card) {
							return 8 - get.value(card);
						},
						position: "hse",
						viewAs: { name: links[0][2] },
						card: links[0][2],
						precontent: function () {
							const maps = lib.skill.sanzhongmrfz.maps;
							const swapped = {};
							Object.keys(maps).forEach(key => {
								swapped[maps[key]] = key;
							});
							const name = lib.skill.sanzhongmrfz_backup.card;

							let type = swapped[name];
							player.storage.sanzhongmrfz[type] = true;
						},
					};
				},
				prompt: function (links, player) {
					const swapped = {};
					const maps = lib.skill.sanzhongmrfz.maps;
					const name = links[0][2];
					Object.keys(maps).forEach(key => {
						swapped[maps[key]] = key;
					});
					return `将一张${get.translation(swapped[name])}牌当做${get.translation(name)}使用`;
				},
			},
			group: "sanzhongmrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					direct: true,
					trigger: { global: "phaseBegin" },
					async content(event, trigger, player) {
						//@ts-ignore
						lib.skill.sanzhongmrfz.init(player, "sanzhongmrfz");
					},
				},
			},
			ai: {
				order: 1,
				result: {
					player: function (player) {
						if (_status.event.dying) return get.attitude(player, _status.event.dying);
						return 1;
					},
				},
			},
		},
});

translate({
	"xirenmrfz": "锡人",
	"suximrfz": "宿锡",
	"suximrfz_info": "当你使用的转化牌结算完成后，你可以使用此牌对应的实体牌。",
	"sanzhongmrfz": "三众",
	"sanzhongmrfz_info": "每回合每项限一次，你可以将一张[基本/锦囊/装备]牌当做[【桃】/【顺手牵羊】/【无中生有】]使用。",
});

characterTitle("xirenmrfz", "<font color=#00868B>凋敝魂灵</font>");

characterIntro("xirenmrfz", "锡人，哥伦比亚侦探，梅兰德基金会高级特工，曾在特里蒙与罗德岛有过数次接触。<br>罗德岛与梅兰德基金会已经正式展开合作，不过锡人先生并不负责专门的对接工作。尽管他偶尔也会在梅兰德一侧的接洽人员不方便时临时顶替，但这只是特殊情况，并非常规，请多加注意。");
