import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("caidumrfz", {
			sex: "male",
			group: "xumrfz",
			hp: 4,
			skills: ["caiyimrfz","mingjiangmrfz"],
		});

skill({
	"caiyimrfz": {
			audio: 2,
			trigger: { player: "equipBefore" },
			forced: true,
			filter(event, player) {
				return event.card && get.type(event.card) === "equip" && event.getParent().name != "caiyimrfz";
			},
			async content(event, trigger, player) {
				const subtype = ["equip1", "equip2", "equip3", "equip4", "equip5"];
				const { control } = await player
					.chooseControl(subtype)
					.set("prompt", `请选择将${get.translation(trigger.card)}置入一个装备栏`)
					.set("ai", () => {
						let player = get.player();
						let subtype = get.event().subtype.filter(i => player.hasEmptySlot(i));
						let card = get.event().card;
						if (subtype.length > 0) {
							return subtype.includes("equip2") && subtype.length > 1 ? subtype.remove("equip2").randomGet() : subtype.randomGet();
						} else {
							let equips = player.getCards("e").sort((a, b) => get.value(b) - get.value(a));
							for (let equip of equips) {
								if (get.value(card) > get.value(equip)) return get.subtype(equip);
							}
							return ["equip1", "equip2", "equip3", "equip4", "equip5"].randomGet();
						}
					})
					.set("subtype", subtype)
					.set("card", trigger.card)
					.forResult();
				if (!control) return;
				trigger.card.subtypes = [control];
			},
		},
	"mingjiangmrfz": {
			audio: 2,
			init(player, skill) {
				let puyuanEquip = Object.keys(lib.card).filter(i => {
					return (
						get.type(i) === "equip" &&
						lib.card?.[i]?.skills &&
						(lib.card[i]?.derivation === "ol_puyuan" || lib.card[i]?.derivation === "puyuan")
					);
				});
				player.storage[skill] = [...lib.inpile.filter(i => get.type(i) === "equip"), ...puyuanEquip];
				_status.mingjiangmrfz = puyuanEquip;
			},
			trigger: { player: "phaseUseBegin" },
			filter(event, player) {
				return game.hasPlayer(current => {
					return current.hasEmptySlot(2);
				});
			},
			async content(event, trigger, player) {
				let list = player.storage.mingjiangmrfz;
				await player.draw();
				if (player.countCards("h") < 1) return;
				const { links } = await player
					.chooseButton(["名匠", [list, "vcard"]], true)
					.set("ai", button => {
						let card = {
							name: button.link[2],
							nature: button.link[3],
						};
						let num = get.value(card);
						if (_status.mingjiangmrfz.includes(card.name)) num += 5;
						if (player.countCards("e", card => get.subtype(card) === "equip2") < 1)
							get.subtype(card) === "equip2" ? (num += 5) : (num -= 2);
						return num;
					})
					.forResult();
				if (!links) return;
				const result = await player
					.chooseCardTarget({
						prompt: `将一张手牌视为${get.translation(links[0][2])}置入一名角色的装备区`,
						filterCard: true,
						forced: true,
						filterTarget: function (card, player, target) {
							return target.hasEmptySlot(2);
						},
						ai1(card) {
							return -get.value(card);
						},
						ai2(target) {
							let player = get.player();
							let att = get.attitude2(target);
							return att > 0 ? att + (5 - target.countCards("e")) : -1;
						},
					})
					.forResult();
				if (!result) return;
				const { targets, cards } = result;
				if (!targets || !cards) return;
				let card = get.autoViewAs({ name: links[0][2] }, cards);
				targets[0].equip(card);
			},
		},
});

translate({
	"caidumrfz": "裁度",
	"caiyimrfz": "裁体",
	"caiyimrfz_info": "锁定技，你使用的装备牌不受装备栏的限制。",
	"mingjiangmrfz": "名匠",
	"mingjiangmrfz_info": "出牌阶段开始时，你可以摸一张牌，然后将一张牌当任意装备牌置入一名防具栏为空的角色的装备区内。",
});

characterTitle("caidumrfz", "<font color='#00008b'>量体裁衣</font>");

characterIntro("caidumrfz", "裁度，本名卢奇诺·德蒙塔诺，叙拉古裁缝名店德蒙塔诺现任主理人，经由叙拉古办事处推介至罗德岛交流访问，留舰期间暂时分配至后勤部，为罗德岛提供各项支持。");
