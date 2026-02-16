import { lib, game, ui, get, ai, _status } from "noname";

//一星武将
const tmpSave = window.whichWaySave.tmpSave;

/** @type {WhichWayCharacterPack} */
export default {
	character: {
		friston3mrfz: ["male", "luomrfz", 4, ["shantanmrfz"], []],
		Lancet2mrfz: {
			hp: 4,
			group: "luomrfz",
			sex: "female",
			skills: ["linyuanmrfz"],
		},
		THRMEXmrfz: {
			hp: 6,
			group: "luomrfz",
			sex: "male",
			skills: ["reqingmrfz", "nuanrenmrfz"],
		},
		Castle3mrfz: {
			hp: 4,
			group: "luomrfz",
			sex: "male",
			skills: ["xunrongmrfz", "chongcimrfz"],
		},
		PhonoR0mrfz :{
			hp:3,
			group:"luomrfz",
			sex:"female",
			skills:["songgemrfz"],
		},
	},
	skill: {
		//妈妈车 罗妈车 PhonoR-0
		songgemrfz:{
			audio:["作战中1", "作战中2","作战中3"],
			trigger:{
				player:["damageEnd","phaseUseBegin"],
			},
			frequent:true,
			async content(event,trigger,player){
				/** @type { Array<Card> } */
				let cards = [];
				while(true){
					const  result  = await player.judge()
						.set("judge",card=>{
							//@ts-ignore
							let { judgeSuits , judgeNames} = get.event();
							return judgeSuits.includes(get.suit(card)) || judgeNames.includes(get.name(card)) ? -1 : 4;
						})
						.set("judge2",result=>result.bool)
						.set("judgeSuits",cards.map(i=>get.suit(i)))
						.set("judgeNames",cards.map(i=>get.name(i)))
						.set("callback",async event=>{
							event.parent?.orderingCards.remove(event.card)
						}).forResult();
					//@ts-ignore
					if(result.card) cards.push(result.card);
					if(
						cards.map(i=>get.suit(i)).length !== new Set(cards.map(i=>get.suit(i))).size ||
						cards.map(i=>get.name(i)).length !== new Set(cards.map(i=>get.name(i))).size
					) break;

					const {bool} = await player.chooseBool(get.prompt("songgemrfz"))
						.set("frequentSkill","songgemrfz").forResult();
					if(bool !== true) break; 
				}
				cards = cards.filterInD();
				if(cards.length) player.gain(cards,"gain2");
			},
			ai:{
				threaten:0.5,
				maixie:true,
				maixie_hp:true,
				maixie_defend:true,
			},
		},

		//近卫车 Castle-3
		xunrongmrfz: {
			audio: ["作战中3", "作战中4"],
			forced: true,
			mod: {
				cardUsable(card, player, num) {
					if (card.name === "sha") return (num += game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length);
				},
			},
			mark: true,
			intro: {
				content(_, player) {
					return `·额定摸牌数和出牌阶段使用【杀】的次数+${game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length}`;
				},
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter(event, player) {
				return game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length > 0 && !event.numFixed;
			},
			async content(event, trigger, player) {
				trigger.num += game.getAllGlobalHistory("everything", evt => evt.name === "dying" && evt.source && evt.source === player).length;
			},
		},
		chongcimrfz: {
			audio: ["作战中1", "作战中2", "行动开始", "任命队长"],
			forced: true,
			derivation: ["retieji", "yimie"],
			init(player) {
				//@ts-ignore
				game.broadcastAll(function (name) {
					["retieji", "yimie"].forEach(skill => {
						if (!lib.skill[skill].audioname2) lib.skill[skill].audioname2 = {};
						lib.skill[skill].audioname2[name] = "chongcimrfz";
					});
					//@ts-ignore
				}, player.name);
				//@ts-ignore
				lib.skill.chongcimrfz.content(_status.event, null, player);
			},
			trigger: {
				player: ["loseAfter", "gainAfter"],
				global: ["equipAfter", "addJudgeAfter", "loseAsyncAfter", "addToExpansionAfter"],
			},
			filter(event, player) {
				return (!player.getOriginalSkills().includes("retieji") && player.hasSkill("retieji") !== player.hasEmptySlot(2)) || (!player.getOriginalSkills().includes("yimie") && player.hasSkill("yimie") !== player.hasEmptySlot(3));
			},
			async content(event, trigger, player) {
				if (!player.getOriginalSkills().includes("retieji")) {
					if (player.hasSkill("retieji") && !player.hasEmptySlot(2)) {
						player.removeSkill("retieji");
					} else if (!player.hasSkill("retieji") && player.hasEmptySlot(2)) {
						player.addSkill("retieji");
					}
				}

				if (!player.getOriginalSkills().includes("yimie")) {
					if (player.hasSkill("yimie") && !player.hasEmptySlot(3)) {
						player.removeSkill("yimie");
					} else if (!player.hasSkill("yimie") && player.hasEmptySlot(3)) {
						player.addSkill("yimie");
					}
				}
			},
		},

		//自爆车 THRM-EX
		reqingmrfz: {
			audio: ["观看作战记录", "编入队伍"],
			forced: true,
			trigger: {
				player: "phaseDrawBegin",
				source: "damageEnd",
			},
			filter(event, player) {
				return event.name === "damage" ? event.num > 0 && event.player !== player : true;
			},
			async content(event, trigger, player) {
				if (trigger.name === "damage") player.draw(trigger.num);
				else {
					player.recover(trigger.num);
					trigger.cancel();
				}
			},
			ai: {
				combo: "nuanrenmrfz",
				threaten: 0.8,
			},
		},
		nuanrenmrfz: {
			audio: ["行动出发", "作战中1", "作战中2", "作战中3", "作战中4"],
			trigger: { player: "phaseZhunbeiBegin" },
			async cost(event, trigger, player) {
				const half = char => Math.max(1, Math.floor(char.hp / 2));
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("nuanrenmrfz"))
					.set("prompt2", `你可以对自己造成${half(player)}点伤害并对一名其他角色造成相当于其体力值一半（向下取整）的伤害`)
					.set("ai", target => {
						let player = get.player();
						if (get.attitude2(target) > 0) return -1;
						if (player.hp < 3 && player.countCards("hs", card => ["tao", "jiu"].includes(get.name(card) || ""))) return -1;
						return target.hp / 2;
					})
					.set("targetprompt2", [target => `${get.cnNumber(half(target))}点伤害`])
					.set("filterTarget", lib.filter.notMe)
					.forResult();
			},
			async content(event, trigger, player) {
				const half = char => Math.max(1, Math.floor(char.hp / 2));
				event.targets[0].damage(half(event.targets[0]));
				player.damage(half(player));
			},
		},

		//医疗小车 Lancet-2
		linyuanmrfz: {
			audio: ["行动开始", "作战中2", "作战中3", "作战中4"],
			trigger: { global: "roundStart" },
			filter(event, player) {
				return ["wugu", "taoyuan", "yiyi"].some(name => player.hasUseTarget(name));
			},
			async cost(event, trigger, player) {
				let names = ["wugu", "taoyuan", "yiyi"];
				let result = {};
				for (let name of names) {
					let resultx = await player
						.chooseTarget()
						.set("prompt", get.prompt("linyuanmrfz"))
						.set("prompt2", `请选择${get.translation(name)}的目标`)
						.set("filterTarget", (card, player, target) => {
							//@ts-ignore
							return player.canUse(get.event().namex, target);
						})
						.set("selectTarget", [1, Infinity])
						.set("namex", name)
						.forResult();
					if (resultx.bool === true) result[name] = resultx;
				}
				if (!result.isEmpty()) {
					event.result = {
						bool: true,
						cost_data: result,
					};
				}
			},
			async content(event, trigger, player) {
				for (let name in event.cost_data) {
					let info = event.cost_data[name];
					await player
						.chooseUseTarget({ name: name }, info.targets)
						.set("forced", true)
						.set("filterTarget", () => true);
				}
			},
			group: "linyuanmrfz_yiyi",
			subSkill: {
				yiyi: {
					charlotte: true,
					silent: true,
					trigger: { player: "chooseTargetBegin" },
					filter(event, player) {
						//@ts-ignore
						return event.getParent(2)?.name === "linyuanmrfz";
					},
					async content(event, trigger, player) {
						trigger.result = {
							bool: true,
							confirm: "ok",
							//@ts-ignore
							targets: trigger.getParent().targets,
						};
						trigger.cancel();
					},
				},
			},
		},
	},
};
