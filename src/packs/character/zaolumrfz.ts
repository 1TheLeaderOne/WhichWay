import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("zaolumrfz", { pack: "legendSJZX",
			sex: "female",
			group: "wumrfz",
			hp: 4,
			skills: ["zhongxiemrfz","rusuimrfz"],
		});

skill({
	"zhongxiemrfz": {
			audio: 2,
			forced: true,
			trigger: {
				player: "useCardToPlayered",
			},
			filter: function (event, player) {
				if (event.card.name != "sha" || typeof get.number(event.card) != "number") return false;
				return event.target.countCards("h") <= Number(get.number(event.card));
			},
			async content(event, trigger, player) {
				//@ts-ignore
				trigger.getParent().directHit.add(trigger.target);
			},
			ai: {
				directHit_ai: true,
				skillTagFilter: function (player, tag, arg) {
					if (tag == "directHit_ai") {
						if (arg.card.name == "sha" && typeof get.number(arg.card) == "number")
							return arg.card.name == "sha" && arg.target.countCards("h") <= Number(get.number(arg.card));
					}
					return false;
				},
			},
			mod: {
				attackRange: function (player, num) {
					return (num += 2);
				},
			},
			group: ["zhongxiemrfz_damage", "zhongxiemrfz_wushi"],
			subSkill: {
				damage: {
					audio: "zhongxiemrfz",
					forced: true,
					trigger: { source: "damageBegin" },
					filter: function (event, player) {
						return event.player.hujia > 0;
					},
					async content(event, trigger, player) {
						trigger.num += trigger.player.hujia;
					},
				},
				wushi: {
					trigger: {
						player: "useCardToPlayered",
					},
					filter: function (event) {
						return event.card.name == "sha";
					},
					direct: true,
					logTarget: "target",
					async content(event, trigger, player) {
						trigger.target.addTempSkill("qinggang2");
						trigger.target.storage.qinggang2.add(trigger.card);
						trigger.target.markSkill("qinggang2");
					},
					ai: {
						unequip_ai: true,
						skillTagFilter: function (player, tag, arg) {
							if (arg && arg.name == "sha") return true;
							return false;
						},
					},
				},
			},
		},
	"rusuimrfz": {
			audio: 2,
			trigger: { source: "damageBegin2" },
			filter: function (event, player) {
				var num = 0,
					target = event.player;
				if (!event.card) return false;
				if (target.countCards("h") >= target.hp) num++;
				if (target.countCards("e") > 0) num++;
				if (target.getDamagedHp() <= target.hp) num++;
				return event.player != player && event.card.name == "sha" && num != 0;
			},
			check: function (event, player) {
				return get.attitude(player, event.player) < 0;
			},
			prompt: function (event, player) {
				var num = 0,
					target = event.player;
				if (target.countCards("h") >= target.hp) num++;
				if (target.countCards("e") > 0) num++;
				if (target.getDamagedHp() <= target.hp) num++;
				if (num < 3) return "【入髓】：是否令" + get.translation(target) + "弃置" + num + "张牌";
				else return "【入髓】：是否令" + get.translation(target) + "弃置" + num + "张牌并令此杀伤害+1";
			},
			prompt2: false,
			async content(event, trigger, player) {
				let num = 0,
					target = trigger.player;
				if (target.countCards("h") >= target.hp) num++;
				if (target.countCards("e") > 0) num++;
				if (target.getDamagedHp() <= target.hp) num++;
				target.chooseToDiscard("he", true, "【入髓】：请弃置" + num + "张牌", num);
				if (num == 3) trigger.num++;
			},
		},
});

translate({
	"zaolumrfz": "早露",
	"zhongxiemrfz": "重械",
	"zhongxiemrfz_info": "①锁定技，当你造成伤害时，此伤害+X。（X=受到伤害的角色的护甲值）</br>②锁定技，当你使用的【杀】指定目标后，若此杀的点数不小于其手牌数，此杀不可被【闪】响应；你使用的【杀】无视防具。</br>③锁定技，你的攻击距离+2。",
	"rusuimrfz": "入髓",
	"rusuimrfz_info": "当你使用【杀】对一名其他角色造成伤害时，每满足下列一项你可令该角色弃置一张牌，若全部满足，则此【杀】伤害+1：</br>1.手牌数不小于体力值；</br>2.已损失体力不大于其体力值：</br>3.装备栏有牌。",
});

characterIntro("zaolumrfz", "早露，切尔诺伯格事变前于切城某中学就读，并担任学生会长。</br>事变后加入罗德岛，隶属后勤部门，工作期间风评极佳。现经本人申请，作为狙击干员转入前线。");
