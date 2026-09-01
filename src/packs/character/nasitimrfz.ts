import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("nasitimrfz", { pack: "legendSJZX",
			sex: "female",
			hp: 3,
			skills: ["wangqiongmrfz", "tadimrfz"],
			group: "gemrfz",
		});

skill({
	"wangqiongmrfz": {
			audio: ["闲置", "行动出发"],
			trigger: {
				player: ["loseAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			filter(event, player) {
				console.log(event);
				//@ts-ignore
				if (_status.currentPhase !== player) return false;
				//@ts-ignore
				if (event.hs && event.hs.length < 1) return false;
				return [2, 4].includes(player.countCards("h"));
			},
			prompt(event, player) {
				return `【望穹】:你可以使用一张【${player.countCards("h") === 2 ? "无中生有" : "火攻"}】`;
			},
			async content(event, trigger, player) {
				const name = player.countCards("h") === 2 ? "wuzhong" : "huogong";
				await player
					.chooseUseTarget({
						card:get.autoViewAs({name:name})
					})
					.set("forced", true)
					.set("prompt", `请选择【${get.translation(name)}】的目标`)
					.forResult();
			},
		},
	"tadimrfz": {
			audio: ["选中干员1", "选中干员2"],
			trigger: {
				player: "changeHpAfter",
			},
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove: true,
			filter(event, player) {
				return !player.storage.tadimrfz.includes(player.hp);
			},
			intro: {
				content(storage, player) {
					if (storage.length < 1) return `·本轮体力值没有发生过改变`;
					return `·已在体力值为 ${storage.join("、")} 时摸过牌`;
				},
			},
			forced: true,
			locked: true,
			async content(event, trigger, player) {
				player.draw();
				player.storage.tadimrfz.push(player.hp);
				player.markSkill("tadimrfz");
			},
			group: "tadimrfz_clear",
			subSkill: {
				clear: {
					charlotte: true,
					silent: true,
					trigger: {
						global: "roundStart",
					},
					async content(event, trigger, player) {
						player.storage.tadimrfz = [];
						player.unmarkSkill("tadimrfz");
					},
				},
			},
		},
});

translate({
	"nasitimrfz": "娜斯提",
	"wangqiongmrfz": "望穹",
	"wangqiongmrfz_info": "你的回合内，当你的手牌变化后,若你的手牌数为 2/4 ,你可以视为使用一张 【无中生有】/【火攻】。",
	"tadimrfz": "踏地",
	"tadimrfz_info": "锁定技，你的体力值发生变化后，若当前体力值为你本轮首次达到，你摸一张牌。",
});

characterTitle("nasitimrfz", "<font color = #2263b766>悬于天际</font>");

characterIntro("nasitimrfz", "娜斯提·鲁诺瑞伊，莱茵生命工程科主任，哥伦比亚工程科学领域的专家，在应用语言学方面也有一定造诣。经塞雷娅介绍，现与罗德岛签订长期合作条款，作为工程部特聘顾问，为罗德岛多个项目提供支持。");
