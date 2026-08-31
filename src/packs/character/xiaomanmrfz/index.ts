import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("xiaomanmrfz", { pack: "epicSJZX",
			sex: "female",
			group: "yanmrfz",
			hp: 4,
			skills: ["mushoumrfz"],
		});

skill({
	"mushoumrfz": {
			audio: 2,
			trigger: { global: "phaseEnd" },
			direct: true,
			getCanUseCard: function (event, player) {
				var history = event.player.getHistory("lose", function (evt) {
						return evt && evt.type == "discard";
					}),
					cards = [];
				if (history.length == 0) return cards;
				for (var i = 0; i < history.length; i++) {
					var cardsList = history[i].cards;
					for (var j = 0; j < cardsList.length; j++) {
						if (!player.canUseToAnyone(cardsList[j])) continue;
						if (get.position(cardsList[j], true) != "d") continue;
						cards.push(cardsList[j]);
					}
				}
				return cards;
			},
			filter: function (event, player) {
				var cards = lib.skill.mushoumrfz.getCanUseCard(event, player);
				return cards.length > 0 && event.player != player;
			},
			async content(event, trigger, player) {
				let cards = lib.skill.mushoumrfz.getCanUseCard(trigger, player);
				while (true) {
					const { bool, links } = await player
						.chooseButton(["【牧兽】：是否使用这些牌？", cards])
						.set("filterButton", button => {
							return _status.event.player.hasUseTarget(button.link);
						})
						.set("ai", button => {
							return _status.event.player.getUseValue(button.link);
						}).forResult();
					if (!bool || !links) return;
					cards.remove(links[0]);
					player.$gain2(links[0], false);
					player.chooseUseTarget(links[0], true);
					//@ts-ignore
					player.logSkill("mushoumrfz");
					cards = cards.filter(card => {
						return get.position(card, true) == "d" && player.hasUseTarget(card);
					});
					if (cards.length == 0) return;
				}
			},
		},
});

translate({
	"xiaomanmrfz": "小满",
	"mushoumrfz": "牧兽",
	"mushoumrfz_info": "当一名其他角色回合结束时，你可以使用其本回合因弃置而进入弃牌堆的牌。",
});

characterTitle("xiaomanmrfz", "<font color=#42b983>竹笛飞声</font>");

characterIntro("xiaomanmrfz", "小满，来自炎国北部农业重镇大荒城的普通女孩，在管理牧兽方面颇有心得。跟随黍以访客身份暂居罗德岛。");
