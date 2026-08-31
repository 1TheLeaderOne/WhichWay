import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("alannamrfz", {
			sex: "female",
			group: "leimrfz",
			hp: 4,
			skills: ["qixiemrfz"],
		});

skill({
	"qixiemrfz": {
			audio: 2,
			enable: "phaseUse",
			init(player, skill) {
				player.storage[skill] = [];
			},
			// @ts-ignore
			filter(event, player) {
				return player.countCards("h", card => !player.storage.qixiemrfz.includes(get.type2(card))) > 0;
			},
			filterCard(card, player) {
				return !player.storage.qixiemrfz.includes(get.type2(card));
			},
			// @ts-ignore
			filterTarget(card, player, target) {
				return (target === player || target.inRange(player)) && target.hasEnabledSlot();
			},
			check(card) {
				let player = get.player();
				let num = 8 - get.value(card, player);
				if (card.name === "sha" || card.name === "shan") num += 5;
				if (get.type2(card) === "equip") num -= 5;
				return num;
			},
			discard: false,
			lose: false,
			delay: 0,
			// @ts-ignore
			async content(event, trigger, player) {
				let card = event.cards[0];
				let target = event.targets[0];
				player.storage.qixiemrfz.push(get.type2(card));
				let skillpool = Object.keys(lib.skill).filter(skill => {
					let info = get.info(skill);
					if (!info || info.charlotte || !lib.translate[skill + "_info"]) return false;
					return get.skillInfoTranslation(skill).includes(`【${get.translation(card.name)}】`);
				});
				if (!skillpool.length) {
					player.chat("无对应的技能");
					return;
				}
				let subtypes = ["equip1", "equip2", "equip3", "equip4", "equip5"];
				subtypes = subtypes.filter(i => player.hasEnabledSlot(i));
				const { control } = await player
					.chooseControl(subtypes)
					.set("prompt", "请选择一个装备栏")
					.set("ai", () => {
						// @ts-ignore
						let subtypes = get.event().subtypes;
						let player = get.player();
						let list = subtypes.filter(i => !player.getEquip(i));
						return list.length > 0 ? list.randomGet() : subtypes.randomGet();
					})
					.set("subtypes", subtypes)
					.forResult();
				let name = skillpool.randomGet();
				await lib.skill.qixiemrfz.createEquip(name, control);
				let cardx = {
					name: "qixiemrfz_" + name,
					suit: "none",
					number: "none",
				};
				target.useCard(cardx, [card], target);
			},
			async createEquip(skill, subtype) {
				if (!lib.card["qixiemrfz_" + skill]) {
					if (lib.translate[skill + "_ab"]) lib.translate["qixiemrfz_" + skill] = lib.translate[skill + "_ab"] + "-" + get.translation(subtype)[subtype === "equip2" ? 1 : 0];
					else lib.translate["qixiemrfz_" + skill] = lib.translate[skill] + "-" + get.translation(subtype)[subtype === "equip2" ? 1 : 0];
					lib.translate["qixiemrfz_" + skill + "_info"] = `锁定技，你视为拥有【${get.translation(skill)}】；当此牌离开你的装备区后，销毁之`;
					lib.translate["qixiemrfz_" + skill + "_append"] = '<div class="skill">【' + get.translation(skill) + '】</div><div><span style="font-family: yuanli">' + get.skillInfoTranslation(skill) + "</span></div><br><br>";
					var card = {
						fullimage: true,
						image: "ext:WhichWay/image/skill/alannamrfz_equip.png",
						type: "equip",
						enable: true,
						selectTarget: -1,
						filterCard(card, player, target) {
							if (player != target) return false;
							return target.canEquip(card, true);
						},
						modTarget: true,
						allowMultiple: false,
						content: lib.element.content.equipCard,
						toself: true,
						ai: {},
						skills: [],
						destroy: true,
					};
					if (subtype === "equip1") card.distance = { attackFrom: -2 };
					else if (subtype === "equip3") card.distance = { globalTo: 1 };
					else if (subtype === "equip4") card.distance = { globalFrom: -1 };
					// @ts-ignore
					card.ai.equipValue = function (card, player) {
						let val = 10;
						if (player.hasSkill("qixiemrfz")) val *= 0.4;
						else val *= 0.6;
						return val;
					};
					card.subtype = subtype;
					// @ts-ignore
					card.skills.add(skill);

					lib.card["qixiemrfz_" + skill] = card;
				}
			},
			group: ["qixiemrfz_clear"],
			subSkill: {
				clear: {
					trigger: { player: "phaseEnd" },
					charlotte: true,
					silent: true,
					// @ts-ignore
					async content(event, trigger, player) {
						player.storage.qixiemrfz = [];
					},
				},
			},
			ai: {
				order: 10,
				result: {
					player(player) {
						if (game.countPlayer(char => char.hasEmptySlot() && get.attitude(player, char) > 2) < 1) return 0;
						return 1;
					},
					target(player, target) {
						let att = get.attitude(player, target);
						let num = 1;
						if (att > 2 && target.hasEmptySlot()) num += 1;
						if (target === player) num += 0.5;
						return num;
					},
				},
			},
		},
});

translate({
	"alannamrfz": "阿兰娜",
	"qixiemrfz": "奇械",
	"qixiemrfz_info": "出牌阶段每种类型的牌限一次，你可以将一张手牌按照如下规则转化成任意类型的装备牌并置入你或你攻击范围内的任意角色的装备区：<br>1.此装备牌的技能为随机一个包含此牌名的技能（无对应技能则无法创建）；<br>2.若此牌为武器牌，攻击距离为3，若此牌为[进攻/防御]马，[攻击/防御]距离[-/+]1；<br>3.此牌离开你的装备区时，销毁之。",
});

characterTitle("alannamrfz", "<font color='#00008b'>能工巧匠</font>");

characterIntro("alannamrfz", "阿兰娜，原雷姆必拓比格皮勒自治州运载车驾驶员，熟练掌握多种机械操控与维修技巧，现就职于罗德岛工程部第三维修工坊，参与由可露希尔主持的各类新型设备的研发与调试工作。");
