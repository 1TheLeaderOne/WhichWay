import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("longshelanmrfz", {
			sex: "male",
			group: "bomrfz",
			hp: 4,
			skills: ["tiaojiumrfz","pianfengmrfz"],
		});

skill({
	"pianfengmrfz": {
			audio: 2,
			trigger: { source: "damageSource" },
			filter(event, player) {
				return (
					event.player && event.player.isIn() && event.card.isCard && event.cards.filterInD().length > 0 && event.player.countCards("h") > 0
				);
			},
			prompt(event, player) {
				var num =
					event.player.getHistory("damage", evt => {
						return evt.card && evt.card.name == event.card.name;
					}).length + 1;
				return `【偏锋】:是否令${get.translation(event.player)}回复一点体力并展示其${get.cnNumber(num)}张手牌`;
			},
			check(event, player) {
				var num = event.player.getHistory("damage", evt => {
						return evt.card && evt.card.name == event.card.name;
					}).length,
					//@ts-ignore
					att = get.attitude(event.player.player);
				/*
					if(num<2&&att>0) return true;
					return num>1&&att<0&&event.player.countCards('h')>=num;
					*/
				return att < 0 && event.player.countCards("h") >= num;
			},
			async content(event, trigger, player) {
				let num =
						trigger.player.getHistory("damage", evt => {
							return evt.card && evt.card.name == trigger.card.name;
						}).length + 1,
					target = trigger.player;
				target.recover();
				const { cards } = await player
					.choosePlayerCard()
					.set("selectButton", num)
					.set("forced", true)
					.set("position", "h")
					.set("target", target)
					.set("prompt", `【偏锋】:请选择展示${get.translation(target)}的${get.cnNumber(num)}张牌`)
					.forResult();
				if (!cards) return;
				player.showCards(cards, `${get.translation(player)}展示了${get.translation(target)}的${get.cnNumber(num)}张牌`);
				game.delay();
				let bool = false;
				for (var i of cards) {
					if (get.type2(i) != get.type2(trigger.card)) continue;
					bool = true;
				}
				if (!bool) {
					player.draw(num);
					return;
				}
				target.discard(cards);
				target.loseHp(num);
			},
			ai: {
				threaten: 1.5,
			},
		},
});

translate({
	"longshelanmrfz": "龙舌兰",
	"pianfengmrfz": "偏锋",
	"pianfengmrfz_info": "当你对其他角色造成伤害后，若有对应的实体牌，你可以令其回复一点体力，并展示其X张牌，若展示的牌中有与对其造成的伤害的牌类型相同的牌，其弃置展示的牌，然后其流失X点体力，反之你摸X张牌。（X=其本回合受到对其造成伤害牌的相同牌名的牌的次数+1）",
});

characterIntro("longshelanmrfz", "龙舌兰，本名埃内斯托·萨拉斯，前多索雷斯国际贸易管理部副主任，于多索雷斯城内暴乱事件中被革职，后经由干员陈引荐，通过测试加入罗德岛。<br>被数日前刚与自己发生过冲突的对象带上罗德岛，在这样尴尬的情况之下依然表现得若无其事，并一路维持着友好爽朗的社交氛围，干员龙舌兰确实不愧为多索雷斯市长女士手下不可多得的外交人才。");
