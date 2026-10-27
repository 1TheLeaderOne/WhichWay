import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("char_437_mizuki", { pack: "legendSJZX", sex: "male", group: "dongmrfz", hp: 3, skills: ["liqunmrfz", "chuangshangmrfz", "jinghuamrfz"] });

//创伤：统计满足的项数
function chuangshangNum(target, player) {
	return (
		(target.isMinHp() ? 1 : 0) +
		(player.getDamagedHp() > 0 ? 1 : 0) +
		(game.hasPlayer(current => current !== player && player.inRange(current) && current.getHp() * 2 <= current.maxHp) ? 1 : 0)
	);
}

//镜花：正在响应的牌若与弃置牌同花色则禁用，返回 false 即禁止
function banSuit(card, player) {
	let evt = get.event();
	if (evt.name !== "chooseToRespond" && evt.name !== "chooseToUse") {
		evt = evt.getParent(current => current.name === "chooseToRespond" || current.name === "chooseToUse");
	}
	if (evt?.respondTo?.[1]?.storage?.jinghuamrfz?.includes(get.suit(card, player))) {
		return false;
	}
}

skill({
	liqunmrfz: {
		audio: ["编入队伍", "任命队长"],
		mod: {
			playerEnabled(card, player, target) {
				if (target !== player && !player.inRange(target)) {
					return false;
				}
			},
			targetEnabled(card, player, target) {
				if (player !== target && !target.inRange(player)) {
					return false;
				}
			},
		},
	},
	chuangshangmrfz: {
		audio: ["作战中3", "作战中4"],
		trigger: { source: "damageEnd" },
		filter(event, player) {
			return event.player !== player && chuangshangNum(event.player, player) > 0;
		},
		async content(event, trigger, player) {
			await player.draw(chuangshangNum(trigger.player, player));
		},
	},
	jinghuamrfz: {
		audio: ["作战中2", "作战中1"],
		usable: 1,
		trigger: { player: "useCard" },
		filter(event, player) {
			return get.is.damageCard(event.card) && player.countDiscardableCards(player, "he") > 0;
		},
		async cost(event, trigger, player) {
			event.result = await player.chooseToDiscard({ prompt: get.prompt2(event.skill), selectCard: [1, Infinity], position: "he" }).forResult();
		},
		async content(event, trigger, player) {
			const card = trigger.card;
			card.storage ??= {};
			card.storage.jinghuamrfz = event.cards.map(current => get.suit(current, player)).unique();
			game.filterPlayer(current => current !== player).forEach(current => current.addTempSkill("jinghuamrfz_ban"));
			player.when({ player: "useCardAfter" }).filter(evt => evt.card === card).step(async (evt, trigger, player) => {
				delete card.storage.jinghuamrfz;
				if (!player.getHistory("sourceDamage", current => current.card === card).length) {
					await player.loseHp();
				}
			});
		},
		subSkill: {
			ban: {
				charlotte: true,
				mod: {
					cardEnabled: banSuit,
					cardRespondable: banSuit,
				},
			},
		},
	},
});

translate({
	char_437_mizuki: "水月",
	liqunmrfz: "离群",
	liqunmrfz_info: "锁定技，你只能指定攻击范围内的角色为目标，不在你攻击范围的其他角色不能指定你为目标。",
	chuangshangmrfz: "创伤",
	chuangshangmrfz_info: "当你对其他角色造成伤害后，每满足下列一项你便可以摸一张牌：①目标是场上体力值最少的角色；②你的攻击范围内有生命值不大于一半的其他角色；③你损失的体力值不小于1。",
	jinghuamrfz: "镜花",
	jinghuamrfz_info: "每回合限一次，当你使用伤害类牌时，你可以弃置任意张牌，然后其他角色不能用与你弃置的牌相同花色的牌响应此牌，然后若此牌没有造成伤害，你失去一点体力。",
});

characterIntro("char_437_mizuki", "水月于玻利瓦尔的多索雷斯城与我们的部分干员有所接触，并随行至本舰，经相关干员初步问询考察后批准其暂时留舰。</br>其学习能力较为优秀，现阶段已经能协助完成相当一部分的文职工作内容，或可考虑往干员的方向培养。经调查与评估后批准其长期留舰。");

characterTitle("char_437_mizuki","深蓝之籽");
