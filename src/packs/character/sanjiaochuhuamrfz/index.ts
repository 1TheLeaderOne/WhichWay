import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("sanjiaochuhuamrfz", { pack: "epicSJZX",
			sex: "female",
			group: "othermrfz",
			hp: 5,
			skills: ["weimianmrfz", "weiquanmrfz", "wuweimrfz"],
			clans: ["AveMujica"],
		});

skill({
	"weimianmrfz": {
			audio: 2,
			trigger: {
				player: "useCardAfter",
			},
			filter(event, player) {
				return ["basic", "trick"].includes(get.type(event.card)) && player.countCards("he", card => player.canRecast(card)) > 0;
			},
			forced: true,
			// @ts-ignore
			async content(event, trigger, player) {
				let num = lib.skill.wuweimrfz.getNum(player, "weimianmrfz");
				let centralArea = get.discarded().slice();
				//@ts-ignore
				let max = centralArea.length > 0 ? Math.max(...centralArea.map(card => get.number(card))) : 0;

				const { cards } = await player
					.chooseCard("he", true)
					.set("prompt", `【伪面】:请重铸一张牌,然后若重铸的牌的点数为${get.poptip("sjzx_centralArea")}的牌中点数最大的，你摸${2 * num}张牌。`)
					.set("prompt2", `${get.poptip("sjzx_centralArea")}点数最大的牌：${max}`)
					.set("filterCard", card => player.canRecast(card))
					.set("ai", card => -get.value(card))
					.forResult();
				if (!cards) return;
				let card = cards[0];
				if (card) await player.recast(card);
				//@ts-ignore
				if (get.number(card) > max && num > 0) await player.draw(2 * num);
			},
		},
	"weiquanmrfz": {
			audio: 2,
			trigger: {
				player: "damageBegin3",
			},
			forced: true,
			// @ts-ignore
			filter(event, player) {
				return !!event.card;
			},
			// @ts-ignore
			async content(event, trigger, player) {
				let num = lib.skill.wuweimrfz.getNum(player, "weiquanmrfz");
				//@ts-ignore
				if (get.number(trigger.card) > 3 * num) trigger.num++;
				else num--;
			},
		},
});

translate({
	"sanjiaochuhuamrfz": "三角初华",
	"weimianmrfz": "伪面",
	"weimianmrfz_info": "锁定技，当你使用一张${get.poptip(\"sjzx_jishipai\")}后，你重铸一张牌，然后若重铸的牌的点数为${get.poptip(\"sjzx_centralArea\")}的牌中点数最大的，你摸2X张牌。",
	"weiquanmrfz": "伪全",
	"weiquanmrfz_info": "锁定技，当你受到实体牌的伤害时，若此牌的点数大于3X，此伤害+1，反之此伤害-1。",
});

characterTitle("sanjiaochuhuamrfz", "<font color = #db7093>毋畏悲伤</font>");

characterIntro("sanjiaochuhuamrfz", "Ave Mujica的主唱兼吉他手三角初华。既是Mujica的成员，也是著名偶像组合sumimi的一员。拥有出众的个人魅力，爱好观星，总是把祥子挂在嘴边。");
