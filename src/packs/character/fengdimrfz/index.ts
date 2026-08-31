import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("fengdimrfz", { pack: "legendSJZX",
			sex: "female",
			group: "weimrfz",
			hp: 4,
			skills: ["newjuntongmrfz","newpochengmrfz"],
		});

skill({
	"newjuntongmrfz": {
			audio: "juntongmrfz",
			init(player, skill) {
				player.storage[skill] = [];
			},
			trigger: {
				player: ["phaseDrawBegin", "useCard"],
				global: "roundStart",
			},
			filter(event, player) {
				if (event.name === "useCard") {
					const cards = player.storage.newjuntongmrfz;
					return (
						!cards.includes(get.name(event.card)) &&
						(get.type(event.card) === "basic" || (get.isSingle(event.card) && get.type(event.card) === "trick"))
					);
				} else return true;
			},
			forced: true,
			async content(event, trigger, player) {
				if (trigger.name === "useCard") {
					player.storage.newjuntongmrfz.push(get.name(trigger.card));
				} else if (trigger.name === "phaseDraw") trigger.cancel();
				else player.draw(3);
			},
			mod: {
				targetInRange: function (card, player, target, now) {
					if (
						!player.storage.newjuntongmrfz.includes(get.name(card)) &&
						(get.type(card) === "basic" || (get.isSingle(card) && get.type(card) === "trick"))
					)
						return true;
				},
				selectTarget: function (card, player, range) {
					if (
						!player.storage.newjuntongmrfz.includes(get.name(card)) &&
						range[1] != -1 &&
						(get.type(card) === "basic" || (get.isSingle(card) && get.type(card) === "trick"))
					)
						range[1]++;
				},
			},
		},
	"newpochengmrfz": {
			audio: "pochengmrfz",
			trigger: {
				player: "useCard2",
				source: "dieAfter",
			},
			filter(event, player) {
				if (event.name === "useCard") return get.name(event.card) === "sha";
				else return true;
			},
			async cost(event, trigger, player) {
				event.result = {};
				if (trigger.name === "useCard") {
					let list = ["额外目标", "额外结算", "cancel2"];
					if (
						!game.hasPlayer(current => {
							return !!player.canUse(trigger.card, current) && !trigger.targets.includes(current);
						})
					)
						list.remove("额外目标");
					let prompt = "【破城】:你可以令此杀额外结算一次或额外指定一个目标";
					if (!list.includes("额外目标")) prompt.replace("或额外指定一个目标", "");
					const { control } = await player
						.chooseControl(list)
						.set("prompt", prompt)
						.set("ai", () => {
							let list = get.event().list,
								card = get.event().card,
								targets = get.event().targets,
								player = get.player();
							if (
								!list.includes("额外目标") ||
								!game.hasPlayer(current => get.attitude2(current) < 0 && !targets.includes(current) && !!player.canUse(card, current))
							)
								return "额外结算";
							if (targets.some(i => i.hp < 2)) return "额外结算";
							return Math.random() > 0.5 ? "额外结算" : "额外目标";
						})
						.set("list", list)
						.set("targets", trigger.targets)
						.set("card", trigger.card)
						.forResult();
					if (control === "cancel2") return (event.result.bool = false);
					else if (control === "额外结算")
						event.result = {
							bool: true,
							//@ts-ignore
							cost_data: control,
						};
					else {
						const { targets } = await player
							.chooseTarget(true)
							.set("prompt", `请额外选择一个目标`)
							.set("filterTarget", (card, player, target) => {
								let targets = get.event().targets,
									cardx = get.event().cardx;
								return player != target && player.canUse(cardx, target) && !targets.includes(target);
							})
							.set("ai", target => get.attitude2(target) < 0)
							.set("targets", trigger.targets)
							.set("cardx", trigger.card)
							.forResult();
						event.result = {
							bool: true,
							cost_data: targets,
						};
					}
				} else {
					const { control } = await player
						.chooseControl("cancel2")
						.set("prompt", `请选择一个选项`)
						.set("choiceList", ["发动一次【军统①】", "重置【军统②】"])
						.set("ai", () => {
							let player = get.player();
							return player.storage.newjuntongmrfz.length > 4 ? "选项二" : "选项一";
						})
						.forResult();
					event.result = {
						bool: true,
						//@ts-ignore
						cost_data: control,
					};
				}
			},
			async content(event, trigger, player) {
				if (trigger.name === "useCard") {
					console.log(event.cost_data);
					//@ts-ignore
					if (event.cost_data === "额外结算") trigger.effectCount++;
					else trigger.targets.push(event.cost_data[0]);
				} else {
					let control = event.cost_data;
					//@ts-ignore
					if (control === "选项一") {
						//@ts-ignore
						let next = game.createEvent("roundStart", false, { next: [] });
						//@ts-ignore
						await game.createTrigger("roundStart", "newjuntongmrfz", player, next);
					} else player.storage.newjuntongmrfz = [];
				}
			},
		},
});

translate({
	"fengdimrfz": "风笛",
	"newjuntongmrfz": "军统",
	"newjuntongmrfz_info": "锁定技。<br>①每轮开始时，你摸三张牌；你跳过摸牌阶段。<br>②你首次使用的一种牌名的基本牌或单一目标的普通锦囊牌目标+1且无距离限制。",
	"newpochengmrfz": "破城",
	"newpochengmrfz_info": "①当你使用【杀】指定目标后，你可以选择令此牌额外结算一次或额外指定一个目标。<br>②当你杀死一名其他角色后，你可以发动一次【军统①】或重置【军统②】。",
});

characterIntro("fengdimrfz", "风笛，维多利亚皇家近卫学校毕业，在维多利亚军队中服役满3年后，退役并经由陈警司介绍加入罗德岛。</br>接受过系统训练的职业军人，经过一段时间的磨合，在罗德岛的各类任务中体现出了专业的战斗技巧与战术素养。");
