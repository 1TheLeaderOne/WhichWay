import { lib, game, ui, get, ai, _status } from "noname";
import { skillCustomFunc } from "../../../nonameEx/custom/skill.ts";
import { whichWayTips } from "../../../tips/index.ts";
import { whichWayUtil } from "../../../utill.js";

const tmpSave = window.whichWaySave.tmpSave;

/** @type { WhichWayCharacterPack } */
export default {
	character: {
		spweicaomrfz: {
			sex: "female",
			group: "shenmrfz",
			hp: 3,
			skills: ["gongximrfz", "huamianmrfz"],
		},
		spsikadimrfz: {
			sex: "female",
			group: "haimrfz",
			hp: 4,
			skills: ["newqianximrfz", "haixuanmrfz"],
		},
		zhenyanmrfz: {
			sex: "female",
			group: "luomrfz",
			hp: 3,
			skills: ["lingxinmrfz", "lianganmrfz", "qinyinmrfz"],
		},
		huoerhaiyamrfz: {
			sex: "female",
			hp: 4,
			skills: ["yumengmrfz"],
			group: "gemrfz",
			designer: "涵涵",
		},
		spyinhuimrfz: {
			sex: "male",
			hp: 4,
			skills: ["kuangshimrfz", "muzhimrfz"],
			group: "xiemrfz",
		},
		spchuxuemrfz: {
			sex: "female",
			hp: 3,
			skills: ["fulingmrfz", "shengweimrfz"],
			group: "xiemrfz",
		},
		spxingyuanmrfz: {
			sex: "female",
			hp: 4,
			skills: ["yulimrfz", "sulimrfz"],
			group: "gemrfz",
		},
		nasitimrfz: {
			sex: "female",
			hp: 3,
			skills: ["wangqiongmrfz", "tadimrfz"],
			group: "gemrfz",
		},
		titimrfz: {
			sex: "female",
			hp: 3,
			skills: ["xiushimrfz", "canshimrfz", "titimrfz_mingshimrfz"],
			group: "samrfz",
			designer: "涵涵",
		},
		wangmrfz:{
			sex:"male",
			hp:4,
			skills:["qushimrfz","dingshengmrfz"],
			group:"suimrfz",
		},
	},
	skill: {
		//望 二哥
		qushimrfz:{
			audio:["作战中1", "作战中2","作战中3", "作战中4","部署1","部署2","行动出发","行动开始"],
		},
		dingshengmrfz:{
			audio:["精英化晋升2","编入队伍"],
		},

		//缇缇
		xiushimrfz: {
			audio: ["作战中1", "作战中2"],
			enable: "phaseUse",
			usable: 1,
			filter(event, player) {
				return player.countCards("he") > 0 && game.hasPlayer(c => c !== player && c.countCards("he") > 0);
			},
			filterTarget(card, player, target) {
				return target.countCards("he") > 0 && target!==player;
			},
			filterCard(card, player) {
				if (get.type(card) === "trick") {
					whichWayTips.addPrompt(card, `可摸牌`, "xiushimrfz_tip", "uncheckBegin");
				}
				return true;
			},
			position: "he",
			check(card) {
				if (get.type(card) !== "trick") return -1;
				return 114514 - get.value(card);
			},
			discard:false,
			lose:false,
			async content(event, trigger, player) {
				const {
					targets: [target],
					cards: [card],
				} = event;
				const {
					//@ts-ignore
					cards: [card2],
				} = await target
					.chooseCard("he")
					.set("forced", true)
					.set("position", "he")
					.set("prompt", whichWayUtil.colorize(`【修使】:请选择你要交给${get.translation(player)}的牌，若为#r装备牌#，你与其各摸一张牌`))
					.set("ai", card => {
						let player = get.player(),
							/** @type {Player} */
							//@ts-ignore
							target = get.event().targetx;
						if (get.attitude(player, target) < 0) return -get.value(card);
						if (get.type(card) === "equip") return 10 - get.value(card);
						if (get.tag(card, "damage") > 0) return 8 - get.value(card);
						return -get.value(card);
					})
					.set("targetx", player)
					.forResult();
				if (!card2) return;
				await player.swapHandcards(target, [card], [card2]);
				const count = [];
				if (get.type(card2) === "equip") count.push("林登万");
				if (get.type(card) === "trick") count.push("林登万");
				for (const i of count) {
					game.asyncDraw([target, player], 1);
				}
			},
			ai: {
				order: 13,
				result: {
					target(player, target) {
						let res = 0;
						if (get.attitude(player, target) < 0) return;
						if (player.countCards("h", { type: "trick" }) > 0) res += 2;
						if (target.countCards("e") > 0) res += 2;
						return res;
					},
				},
			},
		},
		canshimrfz: {
			audio: ["部署1", "部署2"],
			forced: true,
			global: "canshimrfz_eff",
			mod: {
				maxHandcard(player, num) {
					return (num += game.countPlayer(char => char.group === player.group) || 0);
				},
			},
			subSkill: {
				eff: {
					charlotte: true,
					silent: true,
					mod: {
						playerEnabled(card, player, target, result) {
							if (_status.currentPhase !== player) return result;
							const targets = game.filterPlayer(c => c.hasSkill("canshimrfz") && c !== player) || [];
							if (targets.some(char => player.inRange(char)) && get.tag(card, "damage") > 0) {
								for (let targetx of targets) {
									if (!player.inRange(targetx)) continue;
									let num = game.countPlayer(c => c.group === targetx.group);
									if (player.getHistory("useCard")?.length + 1 === num) {
										return target === targetx;
									}
								}
							}
							return result;
						},
					},
				},
			},
		},
		titimrfz_mingshimrfz: {
			audio: ["作战中3", "作战中4"],
			init(player,skill){
				player.storage[skill] = false;
			},
			onremove:true,
			mark: true,
			zhuanhuanji: true,
			marktext: "☯",
			intro: {
				content(storage, player, skill) {
					return whichWayUtil.colorize(`转换技，${storage ? "#s阳：出牌阶段限一次#;#y阴：当你受到伤害后#" : "#r阳：出牌阶段限一次#;#s阴：当你受到伤害后#"}。你可以展示手牌，并使用其中一张普通锦囊牌，你因此使用的普通锦囊牌额外结算Y次。（Y=你手牌中普通锦囊牌的数量）`);
				},
			},
			trigger:{
				player:"damageEnd"
			},
			filter(event,player){
				return player.storage.titimrfz_mingshimrfz===true&&player.countCards("h")>0;
			},
			check(){
				const player = get.player();
				return player.countCards("h",card=>get.type(card) === "trick"&&player.hasUseTarget(card)&&game.hasPlayer(c=>get.effect(c,card,player,player)>0));
			},
			async content(event, trigger,player) {
				player.changeZhuanhuanji("titimrfz_mingshimrfz");

				const extra = player.countCards("h", card=>get.type(card) === "trick");
				const cards = player.getCards("h");
				player.showCards(player.getCards("h"),`${get.translation(player)}【明史】展示的牌`);

				if(extra<1) return;

				player.when({player:"useCard"})
					.filter(event=>{
						//@ts-ignore
						return event.getParent().titimrfz_mingshimrfz_useCard === true;
					})
					.step(async (event,trigger,player)=>{
						//@ts-ignore
						trigger.effectCount += extra;
						game.log(player,"因","#g【明史】","令",`#y${get.translation(trigger.card)}`,"额外结算", extra, "次");
					})

				await player.chooseToUse()
					.set("titimrfz_mingshimrfz_useCard",true)
					.set("filterCard",(card)=>{
						if(cards.includes(card)){
							whichWayTips.addPrompt(card, "【明史】展示", "titimrfz_mingshimrfz_tip", "uncheckEnd");
						}
						return get.type(card) === "trick"&&cards.includes(card);
					})
					.set("forced",true)
					.set("prompt",whichWayUtil.colorize(`【明史】:请选择你要使用的普通锦囊牌<br>#r此牌额外结算${extra}次#`))
					.set("ai",card=>get.value(card));
			},
			group:["titimrfz_mingshimrfz_phaseUse"],
			subSkill:{
				phaseUse:{
					audio:"titimrfz_mingshimrfz",
					enable:"phaseUse",
					usable:1,
					filter(event,player){
						return player.storage.titimrfz_mingshimrfz===false&&player.countCards("h")>0;
					},
					async content(event,trigger,player){
						//@ts-ignore
						await lib.skill.titimrfz_mingshimrfz.content(event,trigger,player);
					},
					ai:{
						order:10,
						result:{
							player(player){
								const cards = player.getCards("h",card=>get.type(card) === "trick"&&player.hasUseTarget(card));
								return cards.some(card=>game.hasPlayer(c=>get.effect(c,card,player,player)>0)) ? 1 : 0;
							},
						},
					},
				},
			},
		},

		//娜斯提
		wangqiongmrfz: {
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
					.chooseUseTarget({ name: name })
					.set("forced", true)
					.set("prompt", `请选择【${get.translation(name)}】的目标`)
					.forResult();
			},
		},
		tadimrfz: {
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

		//溯光星源
		yulimrfz: {
			audio: ["观看作战记录", "非3星结束行动"],
			derivation: ["yulimrfz_rewirte"],
			init(player, skill) {
				player.storage[skill] = false;
			},
			onremove: true,
			trigger: {
				player: "gainAfter",
			},
			locked(skill, player) {
				return !player || !player.storage.yulimrfz;
			},
			filter(event, player) {
				//@ts-ignore
				if (Object.keys(event.getParent("yulimrfz")).length > 0) return false;
				let types = ["basic", "trick", "equip"];
				return player.storage.yulimrfz ? new Set(event.cards.map(i => get.type2(i)).filter(i => types.includes(i))).size !== types.length : !event.cards.map(i => get.type2(i)).includes("basic");
			},
			async cost(event, trigger, player) {
				if (player.storage.yulimrfz) {
					let types = ["basic", "trick", "equip"].filter(type => !trigger.cards.map(i => get.type2(i)).includes(type));
					const result = await player
						.chooseControl(...types, "cancel2")
						.set("prompt", `【迂理】:请选择你要从牌堆中获得的牌的类型`)
						.set("ai", () => {
							//@ts-ignore
							let { types, player } = get.event();
							if (player.getDamagedHp() > 1 && types.includes("basic")) return "basic";
							if (player.countEquipableSlot() > 0 && types.includes("equip")) return "equip";
							return types.includes("trick") ? "trick" : types.randomGet();
						})
						.set("types", types)
						.forResult();
					event.result = {
						...result,
						cost_data: result,
					};
				} else {
					event.result = {
						bool: true,
						cost_data: {
							control: "basic",
						},
					};
				}
			},
			async content(event, trigger, player) {
				let { control } = event.cost_data;
				let card = get.cardPile(card => get.type2(card) === control, "cardPile");
				if (card) player.gain(card, "gain2");
				else player.chat(`牌堆中没有${get.translation(control)}牌了！`);
			},
			ai: {
				threaten: 1.1,
			},
		},
		sulimrfz: {
			audio: ["作战中1", "作战中4"],
			enable: "phaseUse",
			filter(event, player) {
				return player.countCards("he") > 0;
			},
			position: "he",
			filterCard(card) {
				let player = get.player();
				let event = get.event();
				let maxType = lib.skill.sulimrfz.getMaxType(player);

				if (get.type2(card) === maxType) {
					whichWayTips.addPrompt(card, "最多类型", "sulimrfz_tip", "uncheckBegin");
				}

				return !player.getStorage("sulimrfz").includes(get.type2(card));
			},
			selectCard: [1, 2],
			mark: true,
			intro: {
				content(storage, player) {
					let list = [];
					if (Array.isArray(storage) && storage.length > 0) list.push(`·本阶段已弃置的类型：${get.translation(storage)}`);
					if (player.storage.yulimrfz === true) {
						if (player.hasSkill("yulimrfz")) list.push("·已修改【迂理】");
						list.push("·已修改【溯理】");
					}
					return list.length > 0 ? list.join("<br>") : "无信息";
				},
			},
			getMaxType(player) {
				const handTypes = player.getCards("h").map(card => get.type2(card));

				const counts = { basic: 0, trick: 0, equip: 0 };
				for (const type of handTypes) {
					if (type in counts) counts[type]++;
				}
				// 找出最大值及出现次数
				const values = Object.values(counts);
				const maxCount = Math.max(...values);
				const maxCountOccurrences = values.filter(v => v === maxCount).length;

				return maxCountOccurrences === 1 ? Object.keys(counts).find(type => counts[type] === maxCount) : undefined;
			},
			discard: false,
			lose: false,
			delay: 0,
			check(card) {
				let player = get.player(),
					cards = ui.selected.cards,
					maxType = lib.skill.sulimrfz.getMaxType(player);
				if (get.type(card) === maxType) return -1;
				if (cards.length > 0 && get.position(card) === "e") return -1;
				return 8 - get.value(card);
			},
			async content(event, trigger, player) {
				const cards = event.cards;

				const loseAllCard = player.countCards("h") - cards.length === 0;

				player.storage.sulimrfz.addArray(cards.map(i => get.type2(i)));

				await player.discard(cards);

				const maxType = lib.skill.sulimrfz.getMaxType(player);

				if (player.countCards("h") === 0 && !player.storage.yulimrfz && loseAllCard) {
					player.storage.yulimrfz = true;
					player.loseMaxHp();
					player.$skill(get.translation("sulimrfz"), true, "wood");
				}

				let num = 3 - new Set(player.getCards("h").map(card => get.type2(card))).size;
				if ((!maxType || !cards.map(i => get.type2(i)).includes(maxType)) && num > 0) {
					await player.draw(num);
				}
			},
			init(player, skill) {
				player.storage[skill] = [];
			},
			onremove(player, skill) {
				delete player.storage[skill];
				if (!player.hasSkill("yulimrfz") && player.storage.yulimrfz === true) delete player.storage.yulimrfz;
			},
			group: "sulimrfz_clear",
			subSkill: {
				clear: {
					silent: true,
					charlotte: true,
					trigger: {
						player: "phaseUseEnd",
					},
					async content(event, trigger, player) {
						//@ts-ignore
						lib.skill.sulimrfz.init(player, "sulimrfz");
					},
				},
			},
			ai: {
				order: 4,
				result: {
					player: 1,
				},
			},
		},

		//圣聆初雪
		shengweimrfz: {
			mod: {
				aiOrder(player, card, num) {
					//@ts-ignore
					if (get.type(card) !== "basic" && card?.cards?.some(i => i.hasGaintag("shengweimrfz_pile"))) return num + 1;
				},
				aiValue(player, card, num) {
					//@ts-ignore
					if (get.type(card) !== "basic" && card?.cards?.some(i => i.hasGaintag("shengweimrfz_pile"))) return num - 10;
				},
				cardUsable(card, player) {
					//@ts-ignore
					if (get.type(card) !== "basic" && card?.cards?.some(i => i.hasGaintag("shengweimrfz_pile"))) return false;
				},
				cardEnabled(card, player) {
					//@ts-ignore
					if (get.type(card) !== "basic" && card?.cards?.some(i => i.hasGaintag("shengweimrfz_pile"))) return false;
				},
				cardEnabled2(card, player) {
					//@ts-ignore
					if (get.type(card) !== "basic" && card?.cards?.some(i => i.hasGaintag("shengweimrfz_pile"))) return false;
				},
				cardSavable(card, player) {
					//@ts-ignore
					if (get.type(card) !== "basic" && card?.cards?.some(i => i.hasGaintag("shengweimrfz_pile"))) return false;
				},
			},
			init(player, skill) {
				lib.translate["shengweimrfz_pile"] = "牌堆顶";

				lib.skill.shengweimrfz.observerPile(player);

				tmpSave.fulingmrfz_acted_callback = function (player, args) {
					if (args.p !== "length" && args.p !== void 0) return;
					player.getCards("s", card => card.hasGaintag("shengweimrfz_pile")).forEach(i => i.delete());
					tmpSave[player.playerid]["observer_shengweimrfz"].disconnect();
					tmpSave[player.playerid]["observer_shengweimrfz"].takeRecords();
					tmpSave[player.playerid]["observer_shengweimrfz"] = null;
					lib.skill.shengweimrfz.observerPile(player);
				};
			},
			observerPile(player) {
				getCopyCard(player);
				let recordCount;
				const observer = new MutationObserver(() => {
					if (player.isDead()) {
						//@ts-ignore
						lib.skill.shengweimrfz.onremove(player, "shengweimrfz");
						return;
					}

					let currentCount = ui.cardPile.childNodes.length;
					if (currentCount !== recordCount) {
						recordCount = currentCount;

						let pileCards = player.getCards("s", card => card.hasGaintag("shengweimrfz_pile"));

						let tops = get.cards((player.storage?.fulingmrfz?.acted?.length || 0) + 1, true);
						//@ts-ignore
						if (tops.every(card => pileCards.map(i => i._cardid).includes(card.cardid))) return;

						pileCards.forEach(card => card.delete());

						getCopyCard(player);
					}
				});

				observer.observe(ui.cardPile, {
					childList: true,
					subtree: false,
				});

				tmpSave[player.playerid] ??= {};
				tmpSave[player.playerid]["observer_shengweimrfz"] = observer;

				function getCopyCard(player) {
					let num = (player.storage?.fulingmrfz?.acted?.length || 0) + 1;
					let cards = get.cards(num, true);
					//@ts-ignore
					let copy_cards = cards.map(card => {
						let copy_card = ui.create.card();
						//@ts-ignore
						copy_card.init(get.cardInfo(card));
						//@ts-ignore
						copy_card._cardid = card.cardid;
						//@ts-ignore
						copy_card._destroy = true;
						return copy_card;
					});
					for (let i = 0; i < copy_cards.length; i++) {
						let card = copy_cards[i];
						card.addPromptSJZX(`第${i + 1}张`);
						skillCustomFunc.invisableJiZhan(card, player);
					}
					player.directgains(copy_cards, null, "shengweimrfz_pile");
				}
			},
			onremove(player, skill) {
				delete tmpSave.fulingmrfz_acted_callback;
				player.getCards("s", card => card.hasGaintag("shengweimrfz_pile")).forEach(i => i.delete());
				if (player.playerid === undefined) return;
				tmpSave[player.playerid]["observer_shengweimrfz"].disconnect();
				tmpSave[player.playerid]["observer_shengweimrfz"].takeRecords();
				tmpSave[player.playerid]["observer_shengweimrfz"] = null;
			},
			audio: ["作战中1", "作战中2"],
			trigger: {
				global: ["useSkill", "logSkillBegin"],
			},
			forced: true,
			filter(event, player) {
				//@ts-ignore
				let skill = event.skill;
				//@ts-ignore
				if (!skill || skill === "shengweimrfz" || event.sourceSkill === "shengweimrfz") {
					return false;
				}
				let info = get.info(skill);
				if (!info || info.equipSkill) {
					return false;
				}
				return skill.startsWith("fulingmrfz_");
			},
			async content(event, trigger, player) {},
			group: ["shengweimrfz_replace"],
			subSkill: {
				replace: {
					audio: "shengweimrfz",
					charlotte: true,
					trigger: {
						player: ["useCardBefore", "respondBefore"],
					},
					filter(event, player) {
						//@ts-ignore
						let cards = player.getCards("s", card => card.hasGaintag("shengweimrfz_pile") && card._cardid);
						return (
							event.cards &&
							event.cards.some(card => {
								return cards.includes(card);
							})
						);
					},
					forced: true,
					async content(event, trigger, player) {
						let num = (player.storage?.fulingmrfz?.acted?.length || 0) + 1;
						//@ts-ignore
						let cardsid = get.cards(num, true).map(i => i.cardid);

						trigger.cards = trigger.cards.map(card => {
							//@ts-ignore
							if (!cardsid.includes(card._cardid)) return card;
							//@ts-ignore
							return get.cards(num, true).find(cardx => cardx.cardid === card._cardid);
						});
						//@ts-ignore
						trigger.card.cards = trigger.card.cards.map(card => {
							if (!cardsid.includes(card._cardid)) return card;
							//@ts-ignore
							return get.cards(num, true).find(cardx => cardx.cardid === card._cardid);
						});
					},
				},
			},
		},
		fulingmrfz: {
			audio: ["作战中4", "作战中3", "行动出发", "行动开始", "观看作战记录"],
			derivation: ["fangzhu", "rexingxue", "yanru"],
			trigger: {
				global: "roundStart",
			},
			lastDo: true,
			init(player, skill) {
				let handler = {
					set(t, p, v, r) {
						if (typeof tmpSave.fulingmrfz_acted_callback === "function") tmpSave.fulingmrfz_acted_callback(player, { t, p, v, r });

						return Reflect.set(t, p, v, r);
					},
				};
				player.storage[skill] = {
					target: 0,
					// purge education cohesion
					acted: new Proxy([], handler),
				};
				if (typeof tmpSave.fulingmrfz_acted_callback === "function") tmpSave.fulingmrfz_acted_callback(player, {});
				if (!lib.skill.rexingxue.audioname2) lib.skill.rexingxue.audioname2 = {};
				if (!lib.skill.rexingxue.audioname2[player.name]) lib.skill.rexingxue.audioname2[player.name] = "fulingmrfz";
			},
			mark: true,
			intro: {
				content(storage, player) {
					if (!storage || !player) return `没有标记！`;
					let cnplayer = get.translation(player),
						acted = storage.acted;
					if (storage.target < 1) return `·看来${cnplayer}不打算采取任何行动`;
					let str = [`·${cnplayer}需要推动#r${storage.target}#项改革，否则其会失去#r1#点体力！`, "———已行之事———"];
					if (acted.includes("purge")) str.push(`已放逐蔓珠院保守派`);
					if (acted.includes("education")) str.push(`已推动基础教育`);
					if (acted.includes("cohesion")) str.push(`已加强宗教凝聚力`);
					return str.map(i => whichWayUtil.colorize(i)).join("<br>");
				},
			},
			onremove: true,
			async cost(event, trigger, player) {
				//无论如何都要重置的
				//@ts-ignore
				lib.skill.fulingmrfz.init(player, "fulingmrfz");
				const result = await player
					.chooseControl("一", "二", "三", "cancel2")
					.set("prompt", get.prompt("fulingmrfz"))
					.set("prompt2", `你可以摸至多三张牌，然后你的回合结束时，若你执行选项的数量少于你摸的牌数，你失去X点体力。(X=你摸的牌数 - 你执行的项数)`)
					.set("ai", () => {
						let player = get.player();
						return player.hp > 2 ? "三" : ["一", "二", "三"].randomGet();
					})
					.forResult();
				if (result?.control !== "cancel2") {
					event.result = {
						...result,
						cost_data: {
							index: result.index,
						},
					};
				}
			},
			async content(event, trigger, player) {
				let { index } = event.cost_data;
				player.draw(index + 1);
				player.storage.fulingmrfz.target = index + 1;
			},
			group: ["fulingmrfz_purge", "fulingmrfz_education", "fulingmrfz_cohesion", "fulingmrfz_loseHp"],
			subSkill: {
				loseHp: {
					audio: "fulingmrfz",
					forced: true,
					trigger: {
						global: "roundEnd",
					},
					lastDo: true,
					filter(event, player) {
						let storage = player.getStorage("fulingmrfz");
						return storage.target > storage.acted.length;
					},
					async content(event, trigger, player) {
						player.loseHp();
					},
				},
				purge: {
					audio: "fulingmrfz",
					forced: true,
					trigger: {
						source: "damageSource",
					},
					filter(event, player) {
						let storage = player.getStorage("fulingmrfz");
						return !storage.acted.includes("purge") && storage.target > storage.acted.length && event.player !== player;
					},
					async content(event, trigger, player) {
						let cost = game.createEvent("cost_fangzhu_fulingmrfz");
						//@ts-ignore
						cost.player = player;
						cost.skill = "fangzhu";
						//@ts-ignore
						cost.setContent(lib.skill.fangzhu.cost);
						await cost;
						if (cost.result && cost.result.bool === true && cost.result.targets) {
							game.log(player, "对", cost.result.targets[0], "发动了", "#y【放逐】");
							let content = game.createEvent("fangzhu_fangzhu_fulingmrfz");
							//@ts-ignore
							content.player = player;
							//@ts-ignore
							content.targets = cost.result.targets;
							//@ts-ignore
							content.setContent(lib.skill.fangzhu.content);
						}
						player.storage.fulingmrfz.acted.add("purge");
					},
				},
				education: {
					audio: "fulingmrfz",
					forced: true,
					trigger: {
						player: "useCardAfter",
					},
					filter(event, player) {
						let storage = player.getStorage("fulingmrfz");
						return !storage.acted.includes("education") && storage.target > storage.acted.length && get.type(event.card) === "equip";
					},
					async content(event, trigger, player) {
						game.log(player, "发动了", "#y【兴学】");
						let content = game.createEvent("rexingxue_fulingmrfz");
						//@ts-ignore
						content.player = player;
						//@ts-ignore
						content.setContent(lib.skill.rexingxue.content);
						player.storage.fulingmrfz.acted.add("education");
					},
				},
				cohesion: {
					audio: "fulingmrfz",
					forced: true,
					trigger: {
						global: "roundEnd",
					},
					filter(event, player) {
						let storage = player.getStorage("fulingmrfz");
						//@ts-ignore
						return !storage.acted.includes("cohesion") && storage.target > storage.acted.length && player.getRoundHistory("lose", evt => evt.type === "discard").length < 1 && player.countCards("h") > 0;
					},
					async content(event, trigger, player) {
						game.log(player, "发动了", "#y【宴如】");
						let info = lib.skill.yanru;
						let cards;
						if (player.countCards("h") % 2 === 0) {
							const result = await player
								.chooseCard()
								//@ts-ignore
								.set("prompt", info.prompt())
								.set("filterCard", info.filterCard)
								.set("selectCard", info.selectCard)
								.set("complexCard", true)
								.set("forced", true)
								.set("ai", info.check)
								.forResult();
							cards = result.cards;
						}
						let content = game.createEvent("yanru_fulingmrfz");
						//@ts-ignore
						content.player = player;
						//@ts-ignore
						content.cards = cards;
						//@ts-ignore
						content.setContent(info.content);
						player.storage.fulingmrfz.acted.add("cohesion");
					},
				},
			},
		},

		//凛御银灰
		kuangshimrfz: {
			audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
			enable: "phaseUse",
			filter(event, player) {
				return player.countCards("he") > 0 && player.getHandcardLimit() > 0;
			},
			filterCard: true,
			filterTarget(card, player, target) {
				return player.canUse("juedou", target) === true;
			},
			mark: true,
			intro: {
				content(storage, player) {
					return `·本回合手牌上限-${storage ? storage : "0"}<br>·【诓势】已使用的颜色:${!player?.storage?.kuangshimrfz_used ? "无" : get.translation(player.storage.kuangshimrfz_used)}`;
				},
			},
			multitarget: true,
			multiline: true,
			discard: false,
			lose: false,
			delay: false,
			prompt() {
				let player = get.player();
				let storage = player?.storage?.kuangshimrfz_used || [];
				return whichWayUtil.colorize(`请将一张手牌当【决斗】使用${storage.length > 0 ? `<br>选择#r${get.translation(storage)}#的牌会令#r手牌上限-1#` : ""}`);
			},
			check(card) {
				//开摆，这ai写不了一点
				return 8 - get.value(card);
			},
			async content(event, trigger, player) {
				const { cards, targets } = event;
				if (!Array.isArray(player.storage.kuangshimrfz_used)) {
					player.storage.kuangshimrfz_used = [];
				}
				let used = player.storage.kuangshimrfz_used;
				if (used.some(i => cards.map(j => get.color(j)).includes(i))) {
					player.addMark("kuangshimrfz", 1, false);
				} else player.storage.kuangshimrfz_used.addArray(cards.map(j => get.color(j)));
				await player
					.chooseUseTarget({ name: "juedou" }, cards, targets)
					.set("forced", true)
					//@ts-ignore
					.set("filterTarget", (card, player, target) => get.event().targetsx.includes(target))
					.set("selectTarget", targets.length)
					.set("targetsx", targets);

				let list = ["摸两张牌", "失去一点体力", "将手牌调整至手牌上限并结束出牌阶段"];

				const { links } = await player
					.chooseButton()
					.set("createDialog", ["【诓势】:请选择一项", [[[0, list[0]]], "tdnodes"], [[[1, list[1]]], "tdnodes"], [[[2, list[2]]], "tdnodes"]])
					.set("forced", true)
					.set("filterButton", button => {
						let index = button.link;
						//@ts-ignore
						return get.event().indexCheck(index);
					})
					.set("ai", button => {
						let index = button.link;
						//@ts-ignore
						if (!get.event().indexCheck(index)) return -114514;
						return index === 0 ? 114514 : Math.random();
					})
					.set("indexCheck", check)
					.forResult();
				if (!links) return;
				switch (links[0]) {
					case 0:
						player.draw(2);
						break;
					case 1:
						player.loseHp();
						break;
					case 2: {
						const num = player.countCards("h") - player.getHandcardLimit();
						if (num === 0) {
							//
						} else if (num > 0) await player.chooseToDiscard("h", num, true, `请弃置${get.cnNumber(num)}张牌`);
						else await player.draw(Math.abs(num));
						let evt = event.getParent("phaseUse");
						if (evt) {
							//@ts-ignore
							evt.skipped = true;
							game.log(player, "跳过了出牌阶段");
						} else player.chat("由于你的插入结算过多，你可以不用跳过出牌阶段了");
						break;
					}
				}

				function check(index) {
					switch (index) {
						case 0:
							if (player.countCards("h") + 2 === player.getHandcardLimit()) return true;
							break;
						case 1:
							if (player.countCards("h") + 1 === player.getHandcardLimit()) return true;
							break;
						case 2:
							return true;
					}
					return false;
				}
			},
			group: ["kuangshimrfz_clear"],
			subSkill: {
				used: {
					charlotte: true,
					silent: true,
					onremove(player) {
						player.storage.kuangshimrfz_used = [];
					},
				},
				clear: {
					mod: {
						maxHandcard(player, num) {
							return (num -= player.countMark("kuangshimrfz"));
						},
					},
					audio: false,
					silent: true,
					charlotte: true,
					trigger: { player: "phaseEnd" },
					filter(event, player) {
						return player.countMark("kuangshimrfz") > 0 || player.getStorage("kuangshimrfz_used").length > 0;
					},
					async content(event, trigger, player) {
						player.storage.kuangshimrfz_used = [];
						player.removeMark("kuangshimrfz", player.countMark("kuangshimrfz"), false);
					},
				},
			},
			ai: {
				order: 1,
				result: {
					target(player, target) {
						return get.effect(target, { name: "juedou" }, player, player) > 0 ? -1 : 0;
					},
				},
			},
		},
		muzhimrfz: {
			mod: {
				aiOrder(player, card, num) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return num + 1;
				},
				aiValue(player, card, num) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return num - 10;
				},
				cardUsable(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
				cardEnabled(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
				cardEnabled2(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
				cardSavable(card, player) {
					//@ts-ignore
					if (!lib.skill.muzhimrfz.includeDiscard(card.name) && card?.cards?.some(i => i.hasGaintag("muzhimrfz_pile"))) return false;
				},
			},
			includeDiscard(name) {
				return (
					Array.from(ui.discardPile.children)
						//@ts-ignore
						.map(i => i.name)
						.includes(name)
				);
			},
			audio: ["部署1", "部署2"],
			init(player, skill) {
				lib.translate["muzhimrfz_pile"] = "牌堆底";

				let recordCount;
				const observer = new MutationObserver(() => {
					if (player.isDead()) {
						//@ts-ignore
						lib.skill.muzhimrfz.onremove(player, skill);
						return;
					}

					let currentCount = ui.cardPile.childNodes.length;
					if (currentCount !== recordCount) {
						recordCount = currentCount;

						let pileCards = player.getCards("s", card => card.hasGaintag("muzhimrfz_pile"));

						let bottoms = get.bottomCards(4, true);

						//@ts-ignore
						if (bottoms.every(card => pileCards.map(i => i._cardid).includes(card.cardid))) return;

						pileCards.forEach(card => card.delete());

						let cards = get.bottomCards(4, true);
						//@ts-ignore
						let copy_cards = cards.map(card => {
							let copy_card = ui.create.card();
							//@ts-ignore
							copy_card.init(get.cardInfo(card));
							//@ts-ignore
							copy_card._cardid = card.cardid;
							//@ts-ignore
							copy_card._destroy = true;
							return copy_card;
						});
						for (let i = 0; i < copy_cards.length; i++) {
							/** @type { Card } */
							let card = copy_cards[i];
							//@ts-ignore
							card.addPromptSJZX(`第${i + 1}张`);
						}
						player.directgains(copy_cards, null, "muzhimrfz_pile");
					}
				});

				observer.observe(ui.cardPile, {
					childList: true,
					subtree: false,
				});

				if (!player.playerid) return;

				tmpSave[player.playerid] ??= {};
				tmpSave[player.playerid]["observer_muzhimrfz"] = observer;
			},
			onremove(player, skill) {
				player.getCards("s", card => card.hasGaintag("muzhimrfz_pile")).forEach(i => i.delete());

				if (!player.playerid) return;

				tmpSave[player.playerid]["observer_muzhimrfz"].disconnect();
				tmpSave[player.playerid]["observer_muzhimrfz"].takeRecords();
				tmpSave[player.playerid]["observer_muzhimrfz"] = null;
			},
			trigger: {
				player: ["useCardBefore", "respondBefore"],
			},
			filter(event, player) {
				//@ts-ignore
				let cards = player.getCards("s", card => card.hasGaintag("muzhimrfz_pile") && card._cardid);
				return (
					event.cards &&
					event.cards.some(card => {
						return cards.includes(card);
					})
				);
			},
			forced: true,
			async content(event, trigger, player) {
				//@ts-ignore
				let cardsid = get.bottomCards(4, true).map(i => i.cardid);

				trigger.cards = trigger.cards.map(card => {
					//@ts-ignore
					if (!cardsid.includes(card._cardid)) return card;
					//@ts-ignore
					return get.bottomCards(4, true).find(cardx => cardx.cardid === card._cardid);
				});
				//@ts-ignore
				trigger.card.cards = trigger.card.cards.map(card => {
					if (!cardsid.includes(card._cardid)) return card;
					//@ts-ignore
					return get.bottomCards(4, true).find(cardx => cardx.cardid === card._cardid);
				});
			},
		},

		//新霍尔海雅
		yumengmrfz: {
			_textList: ["距离梦醒还有4年", "距离达成目标还差1000步"],
			get textList() {
				return this._textList;
			},
			set textList(value) {
				const texts = document.querySelectorAll(".canonization .text").length ? document.querySelectorAll(".canonization .text") : document.querySelectorAll(".canonization-simple .text");
				if (texts) {
					for (let i = 0; i < value.length; i++) {
						texts[i].innerHTML = value[i];
					}
				}
				this._textList = value;
			},
			createTip() {
				const warpper = ui.create.div(".canonization", document.body);
				const title = ui.create.div(".title", warpper);
				title.innerHTML = "·羽蛇之梦·";
				const subtitle = ui.create.div(".subtitle", warpper);
				subtitle.innerHTML = `我们自当与神明同位`;
				for (let str of this.textList) {
					const text = ui.create.div(".text", warpper);
					text.innerHTML = str;
				}

				warpper.hide();

				return warpper;
			},
			update(player) {
				//@ts-ignore
				let skillcount = _status.currentPhase === player ? 4 - player.countSkill("yumengmrfz") : "???";
				//@ts-ignore
				let canonization = ui.cardPile.childNodes.length * game.countPlayer() - player.storage.yumengmrfz;
				this.textList = [`距离梦醒还有${skillcount}年`, `距离达成目标还差${canonization}步`];
			},
			init(player, skill) {
				let name = `yumengmrfz_${player.playerid}`;

				tmpSave[name] = {};

				player.storage[skill] = 2;
				tmpSave[name]["ui"] = this.createTip();

				let lastChildCount = 0;
				const observer = new MutationObserver(() => {
					const currentChildCount = ui.cardPile.children.length;
					if (currentChildCount !== lastChildCount) {
						lib.skill.yumengmrfz.update(player);
						lastChildCount = currentChildCount;
					}
				});
				observer.observe(ui.cardPile, {
					childList: true,
					subtree: false,
				});

				tmpSave[name]["observer"] = observer;

				tmpSave[name]["remove"] = () => {
					tmpSave[name]["observer"].disconnect();
					tmpSave[name]["ui"].remove();
					delete tmpSave[name];
				};
			},
			intro: {
				content: "N:#",
			},
			mark: true,
			onremove(player, skill) {
				let name = `yumengmrfz_${player.playerid}`;
				delete player.storage[skill];
				tmpSave[name]["remove"]();
			},
			audio: ["编入队伍", "任命队长"],
			derivation: ["yushenmrfz", "newkuangyumrfz", "tanxianmrfz"],
			enable: "phaseUse",
			usable: 4,
			filterCard(card) {
				let player = get.player();
				return player.countCards("h") >= player.storage.yumengmrfz;
			},
			prompt() {
				let player = get.player();
				let num = player.storage.yumengmrfz;
				return player.countCards("h") >= num ? `请弃置${get.cnNumber(num)}张手牌` : `摸${get.cnNumber(num)}张牌`;
			},
			selectCard() {
				let player = get.player();
				return player.countCards("h") < player.storage.yumengmrfz ? -1 : player.storage.yumengmrfz;
			},
			check(card) {
				let player = get.player();
				return 114514 - player.getUseValue(card);
			},
			async content(event, trigger, player) {
				let num = player.storage.yumengmrfz;
				if (event.cards.length < 1) player.draw(num);
				//@ts-ignore
				else player.setSkillCount("yumengmrfz", -1);
				player.storage.yumengmrfz++;
				lib.skill.yumengmrfz.update(player);
			},
			ai: {
				order: 1,
				result: {
					player: 1,
				},
			},
			group: ["yumengmrfz_canonization", "yumengmrfz_fail", "yumengmrfz_changeBackground"],
			subSkill: {
				changeBackground: {
					silent: true,
					charlotte: true,
					trigger: {
						player: ["phaseBegin", "phaseAfter"],
					},
					async content(event, trigger, player) {
						tmpSave[`yumengmrfz_${player.playerid}`].ui[event.triggername === "phaseBegin" ? "show" : "hide"]();
					},
				},
				canonization: {
					audio: "yumengmrfz",
					forced: true,
					trigger: {
						player: "phaseEnd",
					},
					filter(event, player) {
						//@ts-ignore
						return player.storage.yumengmrfz > ui.cardPile.childNodes.length * game.countPlayer();
					},
					async content(event, trigger, player) {
						player.awakenSkill("yumengmrfz");
						game.log(player, "使命成功");
						player.addSkill("yushenmrfz");
						tmpSave[`yumengmrfz_${player.playerid}`]["remove"]();
					},
				},
				fail: {
					audio: "yumengmrfz",
					trigger: {
						global: "roundStart",
					},
					filter(event, player) {
						return game.roundNumber === 2;
					},
					forced: true,
					async content(event, trigger, player) {
						player.awakenSkill("yumengmrfz");
						player.loseMaxHp();
						game.log(player, "使命失败");
						player.chat("腾蛇乘雾，终为土灰...");
						player.addSkill(["newkuangyumrfz", "tanxianmrfz"]);
						tmpSave[`yumengmrfz_${player.playerid}`]["remove"]();
					},
				},
			},
		},
		newkuangyumrfz: {
			audio: "kuangyumrfz",
			usable: 1,
			trigger: {
				player: "useCardToTargeted",
			},
			filter(event, player) {
				//@ts-ignore
				if (event.getParent().triggeredTargets3.length > 1) {
					return false;
				}
				//@ts-ignore
				return game.filterPlayer(char => player.canUse(event.card, char) && !event.targets.includes(char)) && (get.name(event.card) === "sha" || get.type(event.card) === "trick");
			},
			async cost(event, trigger, player) {
				event.result = await player
					.chooseTarget()
					.set("prompt", get.prompt("newkuangyumrfz"))
					.set("prompt2", `你可以为此牌额外指定至多${get.cnNumber(player.hp)}个合法目标，若此牌没有造成伤害，你失去一点体力，反之，此技能本回合视为未发动过`)
					.set("selectTarget", [0, player.hp])
					.set("filterTarget", (card, player, target) => {
						//@ts-ignore
						let targets = get.event().targetsx;
						//@ts-ignore
						return !targets.includes(target) && player.canUse(get.event().cardx, target);
					})
					.set("cardx", trigger.card)
					.set("targetsx", trigger.targets)
					.set("ai", target => {
						let val = 0,
							player = get.player(),
							//@ts-ignore
							card = get.event().cardx;
						if (get.attitude(target, player) > 0) return -1;
						if (get.tag(card, "damage")) val += 2;
						if (get.canRespond(card, target).includes("sha") && !target.mayHaveSha()) val += 10;
						if (get.canRespond(card, target).includes("shan") && !target.mayHaveShan()) val += 10;
						if (target.countCards("h") < 1) val += 3;
						if (target.countCards("h") > 5) val -= 3;
						return val;
					})
					.forResult();
			},
			async content(event, trigger, player) {
				let { targets } = event;
				if (Array.isArray(targets) && targets.length > 0) {
					player.line(targets);
					trigger.targets.addArray(targets);
				}
				player
					.when({ player: "useCardAfter", source: "damageSource" })
					.filter((event, player) => {
						return event.card && event.card.cardid === trigger.card.cardid;
					})
					.step(async (event, trigger, player) => {
						if (trigger.name === "useCard") {
							player.loseHp();
						} else {
							player.draw();
							//@ts-ignore
							player.setSkillCount("newkuangyumrfz", -1);
						}
					});
			},
		},
		tanxianmrfz: {
			audio: "chuangzhongmrfz",
			forced: true,
			init(player, skill) {
				player.storage[skill] = {
					draw: 4,
					sha: 1,
					attack: 5,
				};
			},
			mark: true,
			intro: {
				content(storage) {
					return "额定摸牌数、杀的次数、基础攻击距离为：" + Object.values(storage).join("、");
				},
			},
			onremove: true,
			mod: {
				attackRangeBase(player, num) {
					if (player.storage?.tanxianmrfz?.attack) return player.storage.tanxianmrfz.attack;
				},
				cardUsable(card, player, num) {
					if (get.name(card) === "sha") return (num += player.storage?.tanxianmrfz?.sha || 0);
				},
			},
			trigger: {
				player: "phaseDrawBegin2",
			},
			filter(event, player) {
				return !event.numFixed && player.storage?.tanxianmrfz?.draw;
			},
			firstDo: true,
			async content(event, trigger, player) {
				trigger.num = player.storage.tanxianmrfz.draw;
			},
			/** @type { ContentFuncByAll } */
			async exchanging(event, trigger, player) {
				const { promise, resolve } = Promise.withResolvers();

				/** @type { Record<string,number> } */
				let { draw, sha, attack } = player.storage.tanxianmrfz;
				let list = ["请选择你要交换的数字<br>(选择两个数字即可交换)", "你的额定摸牌数为", [[draw], "tdnodes"], "出牌阶段【杀】的使用次数+", [[sha], "tdnodes"], "你的基础攻击范围为", [[attack], "tdnodes"]];
				let dialog = ui.create.dialog(...list, "hidden");

				let texts = [],
					buttons = [];
				let content = dialog.querySelector(".content");
				let firstSelected;
				//@ts-ignore
				event.sort = [];
				const listener = function () {
					//@ts-ignore
					if (_status.dragged || _status.justdragged) return;

					if (!firstSelected) {
						//@ts-ignore
						firstSelected = this;
						//@ts-ignore
						this.classList.add("bluebg");
						//@ts-ignore
					} else if (firstSelected === this) {
						firstSelected.classList.remove("bluebg");
						firstSelected = null;
					} else {
						const firstSpan = firstSelected.querySelector("span");
						//@ts-ignore
						const secondSpan = this.querySelector("span");

						[firstSpan.textContent, secondSpan.textContent] = [secondSpan.textContent, firstSpan.textContent];
						//@ts-ignore
						[firstSelected.link, this.link] = [this.link, firstSelected.link];

						//@ts-ignore
						event.sort = Array.from(content.querySelectorAll(".buttons")).map(b => b.childNodes[0]);

						firstSelected.classList.remove("bluebg");
						//@ts-ignore
						this.classList.remove("bluebg");
						firstSelected = null;
					}
				};
				//@ts-ignore
				for (let el of Array.from(content.children)) {
					if (el.innerHTML === list[0]) continue;

					if (el.classList.contains("caption")) {
						texts.push(el);
					} else {
						let td = el.childNodes[0];
						buttons.push(el);
						//@ts-ignore
						event.sort.push(td);
						td.addEventListener("click", listener);
					}
					el.remove();
				}

				for (let i = 0; i < texts.length; i++) {
					let wrapper = ui.create.div(".specialDialogWrapper", content);
					wrapper.appendChild(texts[i]);
					wrapper.appendChild(buttons[i]);
				}
				//@ts-ignore
				event.dialog = dialog;

				dialog.open();
				//@ts-ignore
				event.switchToAuto = function () {
					//@ts-ignore
					event.dialog.close();
					//@ts-ignore
					event.control.close();
					game.resume();
					_status.imchoosing = false;
				};
				//@ts-ignore
				event.control = ui.create.control("ok", function () {
					//@ts-ignore
					event.dialog.close();
					//@ts-ignore
					event.control.close();
					//@ts-ignore
					event.sort = event.sort.map(i => i.link);
					game.resume();
					_status.imchoosing = false;
					//@ts-ignore
					resolve(event.sort);
				});

				game.pause();

				return promise;
			},
			group: "tanxianmrfz_exchange",
			subSkill: {
				exchange: {
					audio: "tanxianmrfz",
					forced: true,
					trigger: { player: "phaseEnd" },
					filter(event, player) {
						return Object.values(player.storage.tanxianmrfz).some(i => i > 0);
					},
					async content(event, trigger, player) {
						let nums = Object.values(player.storage.tanxianmrfz);
						let max = Math.max(...nums);
						for (let i = 0; i < 3; i++) {
							let list = Object.keys(player.storage.tanxianmrfz);
							let num = nums[i];
							if (nums[i] === max) {
								num -= 1;
								max += 114151919810; // 使得只会减一次
							}
							player.storage.tanxianmrfz[list[i]] = num;
						}

						if (player.isUnderControl()) {
							game.swapPlayerAuto(player);
						}
						let next;
						if (!event.isMine() && !event.isOnline()) {
							next = switchAuto();
						} else {
							next = lib.skill.tanxianmrfz.exchanging(event, trigger, player);
						}
						const result = await next;

						if (!result) return;

						for (let i = 0; i < result.length; i++) {
							let keys = Object.keys(player.storage.tanxianmrfz);
							let key = keys[i];
							player.storage.tanxianmrfz[key] = result[i];
						}

						game.log(player, "调整了", `#y【${get.translation(event.name)}】`, "的数字");

						function switchAuto() {
							_status.imchoosing = false;
							//@ts-ignore
							if (event.dialog) event.dialog.close();
							//@ts-ignore
							if (event.control) event.control.close();
							//@ts-ignore
							event.sort = Object.values(player.storage.tanxianmrfz).sort((a, b) => b - a);
						}
					},
				},
			},
		},
		yushenmrfz: {
			audio: ["选中干员1", "选中干员2"],
			trigger: {
				player: "dieBegin",
			},
			filter(event, player) {
				//@ts-ignore
				if (!(event.getParent().name !== "giveup" && player.maxHp > 0)) return false;
				return ui.cardPile.childNodes.length > 0;
			},
			forced: true,
			async content(event, trigger, player) {
				const card = get.cardPile2(true, "random");
				if (!card) {
					return;
				}
				//@ts-ignore
				await game.cardsGotoSpecial(card);
				game.log(player, "将", card, "移出游戏");
				trigger.cancel();
				await player.recoverTo(1);
			},
			group: "yushenmrfz_hack",
			subSkill: {
				hack: {
					audio: "yushenmrfz",
					trigger: { player: "phaseBegin" },
					forced: true,
					async content(event, trigger, player) {
						let packs = Object.keys(lib.characterSort);

						let buttonList = [`请选择一个将包`];
						let count = 0;
						let list = [];
						for (let i = 0; i < packs.length; i++) {
							list.push([i, getPacksTranslation(packs[i])]);
						}
						for (var i = 0; i < Math.ceil(list.length / 4); i++) {
							//@ts-ignore
							buttonList.push([list.slice(count, count + 4 >= list.length ? list.length : count + 4), "tdnodes"]);
							count += 4;
						}

						const packsResult = await player.chooseButton(buttonList).set("forced", true).forResult();
						//@ts-ignore
						let choosePack = packs[packsResult.buttons[0].link];

						let sorts = Object.keys(lib.characterSort[choosePack]);

						let buttonList_sorts = [`请选择一个子包`];
						let count_sorts = 0;
						let list_sorts = [];
						for (let i = 0; i < sorts.length; i++) {
							list_sorts.push([i, lib.translate[sorts[i]]]);
						}

						for (var i = 0; i < Math.ceil(list_sorts.length / 4); i++) {
							//@ts-ignore
							buttonList_sorts.push([list_sorts.slice(count_sorts, count_sorts + 4 >= list_sorts.length ? list_sorts.length : count_sorts + 4), "tdnodes"]);
							count_sorts += 4;
						}

						const sortsResult = await player.chooseButton(buttonList_sorts).set("forced", true).forResult();

						//@ts-ignore
						let chooseSort = sorts[sortsResult.buttons[0].link];

						let characters = Object.values(lib.characterSort[choosePack][chooseSort]);

						for (let name of characters) {
							if (get.character(name)?.skills) {
								get.character(name).skills.forEach(i => player.addSkill(i));
							}
						}

						game.log(player, "获得了武将包", `#y${getPacksTranslation(choosePack)}`, "的", `#y${lib.translate[chooseSort]}`, "中所有武将的技能");

						function getPacksTranslation(pack) {
							return lib.translate[`${pack}_character_config`];
						}
					},
				},
			},
		},

		// 真言
		lingxinmrfz: {
			audio: ["任命队长", "作战中4"],
			trigger: {
				player: ["logSkillBegin", "useSkill"],
			},
			filter(event, player) {
				if (!game.expandSkills(player.getSkills()).includes(event.skill)) return false;
				return event.skill !== "lingxinmrfz" && !event.skill.startsWith("lingxinmrfz");
			},
			forced: true,
			async content(event, trigger, player) {
				player
					.when({ global: [`${trigger.skill}After`, `${trigger.skill}_costAfter`] })
					.filter(event => {
						console.log(event);
						return !(event.name.endsWith("_cost") && event.result?.bool === true);
					})
					.then(() => {})
					.assign({
						ai: {
							viewHandcard: true,
							skillTagFilter(player, tag, arg) {
								if (player == arg) return false;
							},
						},
					});
			},
			group: "lingxinmrfz_addTrigger",
			subSkill: {
				addTrigger: {
					silent: true,
					charlotte: true,
					trigger: {
						global: "phaseBefore",
						player: ["enterGame", "changeSkillsAfter"],
					},
					filter: function (event, player) {
						return event.name !== "phase" || game.phaseNumber == 0 || event.skill === "changeSkills";
					},
					async content(event, trigger, player) {
						let skills = [];
						skills.addArray(player.getSkills().map(i => i + "_costBegin"));
						game.broadcastAll(
							//@ts-ignore
							(skills, player) => {
								//@ts-ignore
								lib.skill.lingxinmrfz.trigger.player.addArray(skills);
								player.addSkillTrigger("lingxinmrfz", null, true);
							},
							skills,
							//@ts-ignore
							player
						);
					},
				},
			},
		},
		lianganmrfz: {
			audio: ["部署1", "作战中1"],
			trigger: {
				global: "phaseDrawAfter",
			},
			filter(event, player) {
				//@ts-ignore
				return event.player.countCards("h", card => !card.isConnect()) > 0;
			},
			check(event, player) {
				return get.attitude2(event.player) < 0;
			},
			async cost(event, trigger, player) {
				let target = trigger.player;
				event.result = await player
					.choosePlayerCard(target)
					.set("prompt", get.prompt("lianganmrfz"))
					.set("prompt2", `你可以连接${get.translation(target)}的一张手牌`)
					.set("ai", button => get.value(button.link))
					.forResult();
			},
			async content(event, trigger, player) {
				//@ts-ignore
				event.cards.forEach(card => card.addConnect());
			},
			group: "lianganmrfz_view",
			subSkill: {
				view: {
					audio: "lianganmrfz",
					enable: "chooseToUse",
					filter(event, player) {
						//@ts-ignore
						return game.getConnectCards().length > 1 && player.countCards("h", card => card.isConnect()) > 0;
					},
					hiddenCard(player, name) {
						return (
							game
								//@ts-ignore
								.getConnectCards()
								.map(card => get.name(card))
								.includes(name)
						);
					},
					chooseButton: {
						dialog(event, player) {
							//@ts-ignore
							let list = game.getConnectCards().map(card => [get.type(card), "", get.name(card), get.nature(card)]);
							/**
							 * @type { Dialog }
							 */
							//@ts-ignore
							const dialog = ui.create.dialog("联感", [list, "vcard"]);
							return dialog;
						},
						filter(button, player) {
							//@ts-ignore
							return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
						},
						check(button) {
							var player = _status.event.player;
							//@ts-ignore
							var card = { name: button.link[2], nature: button.link[3] };
							if (player.countCards("hes", cardx => cardx.name == card.name)) {
								return 0;
							}
							//@ts-ignore
							return _status.event.getParent().type == "phase" ? player.getUseValue(card) : 1;
						},
						backup(links, player) {
							return {
								audio: "lianganmrfz",
								filterCard(card) {
									//@ts-ignore
									return card.isConnect();
								},
								popname: true,
								check(card) {
									return 7 - get.value(card);
								},
								position: "h",
								viewAs: { name: links[0][2], nature: links[0][3] },
							};
						},
						prompt(links, player) {
							return "将一张连接牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
						},
					},
					ai: {
						order: 1,
					},
				},
			},
		},
		qinyinmrfz: {
			audio: ["编入队伍", "作战中3"],
			enable: "phaseUse",
			filter(event, player) {
				//@ts-ignore
				return game.hasPlayer(char => char.countCards("h") > 0) && player.hasUseTarget("shunshou", true);
			},
			usable: 1,
			filterTarget(card, player, target) {
				return target.countCards("h") > 0;
			},
			async content(event, trigger, player) {
				const {
					targets: [target],
				} = event;
				const { cards } = await player
					.choosePlayerCard(target, true)
					.set("prompt", `请以弃置的方式将${get.translation(target)}的一张手牌当【顺手牵羊】使用`)
					.set("nodistance", true)
					.set("ai", button => {
						let card = button.link;
						let val = get.value(card);
						if (card.isConnect()) return val + 3;
						return val;
					})
					.forResult();
				player.chooseUseTarget({ name: "shunshou" }, cards).set("forced", true).set("qinyinmrfz", true);
			},
			ai: {
				result: {
					target(player, target) {
						return -1;
					},
				},
			},
			group: ["qinyinmrfz_discard", "qinyinmrfz_roundEnd"],
			subSkill: {
				roundEnd: {
					auio: "qinyinmrfz",
					trigger: {
						global: "roundEnd",
					},
					filter() {
						//@ts-ignore
						return lib.skill.qinyinmrfz.filter.apply(this, arguments);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseTarget()
							.set("prompt", get.prompt("qinyinmrfz"))
							.set("filterTarget", lib.skill.qinyinmrfz.filterTarget)
							.set("ai", target => get.attitude2(target) < 0)
							.set("nodistance", true)
							.forResult();
					},
					async content(event, trigger, player) {
						//@ts-ignore
						await lib.skill.qinyinmrfz.content(event, trigger, player);
					},
				},
				discard: {
					charlotte: true,
					silent: true,
					trigger: {
						player: "chooseUseTargetBegin",
					},
					filter(event, player) {
						//@ts-ignore
						return event.qinyinmrfz === true;
					},
					async content(event, trigger, player) {
						for (let target of trigger.targets) {
							await target.discard(trigger.cards);
						}
					},
				},
			},
		},

		//新浊心斯卡蒂 红蒂
		newqianximrfz: {
			audio: "qianximrfz",
			trigger: {
				global: "phaseOver",
			},
			forced: true,
			getNextByAll(player) {
				let chars = game.players.slice().concat(game.dead).sort(lib.sort.position);
				let index = chars.indexOf(player);
				return chars[index + 1 > chars.length ? 0 : index + 1];
			},
			filter(event, player) {
				//@ts-ignore
				let evt = event.getChildren("phase");
				if (!evt.player) return false;
				let target = this.getNextByAll(evt.player);
				return target && !target.isAlive();
			},
			async content(event, trigger, player) {
				//@ts-ignore
				let evt = trigger.getChildren("phase");
				let target = lib.skill.newqianximrfz.getNextByAll(evt.player);
				game.broadcastAll(
					//@ts-ignore
					function (char1, char2) {
						game.swapSeat(char1, char2);
					},
					//@ts-ignore
					player,
					target
				);
				trigger.player = target;
			},
		},
		haixuanmrfz: {
			audio: ["作战中2", "作战中4"],
			trigger: {
				global: "phaseZhunbeiBegin",
			},
			derivation: ["duwu"],
			filter(event, player) {
				return event.player !== player && event.player.countCards("he") > 0;
			},
			prompt(event, player) {
				return `【海漩】:是否令${get.translation(event.player)}对你发动一次【黩武】？`;
			},
			check(event, player) {
				return get.attitude2(event.player) < 0 && player.hp > 2 && event.player.countCards("he") > 1;
			},
			async content(event, trigger, player) {
				const target = trigger.player;
				const { cards } = await target
					.chooseToDiscard("he", true)
					.set("prompt", `弃置${player.hp}张牌`)
					.set("prompt2", get.skillInfoTranslation("duwu"))
					.set("selectCard", Math.min(player.hp, target.countCards("he")))
					.set("ai", card => -get.value(card))
					.forResult();
				if (!cards) return;
				const next = game.createEvent("haixuanmrfz_duwu");
				//@ts-ignore
				next.target = player;
				//@ts-ignore
				next.player = target;
				//@ts-ignore
				next.setContent(lib.skill.duwu.content);
				let cardsx = cards.filter(card => !get.tag(card, "damage") && get.position(card) === "d");
				if (cardsx.length) {
					player.gain(cardsx, "gain2");
					if (new Set(cardsx.map(card => get.suit(card))).size === cardsx.length) player.recover();
				}
			},
		},

		//新焰影苇草
		gongximrfz: {
			audio: "yingyaomrfz",
			derivation: ["huoshaolianying"],
			enable: "phaseUse",
			filter(event, player) {
				if (
					Object.entries(player.getStat("skill"))
						.filter(i => ["gongximrfz", "gongximrfz_dying"].includes(i[0]))
						.reduce((n, arr) => n + arr[1], 0) > 0
				)
					return false;
				return player.countCards("he", card => get.tag(card, "damage")) > 0 && player.hasUseTarget("huoshaolianying");
			},
			filterCard(card) {
				return get.tag(card, "damage");
			},
			filterTarget(card, player, target) {
				return !target.isLinked();
			},
			selectTarget() {
				//@ts-ignore
				let num = get.targetCounts(ui.selected.cards[0]);
				return [0, num];
			},
			check(card) {
				let player = get.player();
				return (
					8 -
					get.value(card) +
					Math.min(
						game.countPlayer(char => {
							return get.effect(char, { name: "huoshaolianying" }, player, player) > 0;
						}),
						//@ts-ignore
						get.targetCounts(card)
					)
				);
			},
			complexSelect: true,
			discard: false,
			lose: false,
			multitarget: true,
			multiline: true,
			async content(event, trigger, player) {
				const {
					cards: [card],
					targets,
				} = event;
				if (Array.isArray(targets))
					targets.forEach(target => {
						//@ts-ignore
						if (!target.isLinked()) target.link();
					});
				if (player.hasUseTarget("huoshaolianying")) {
					player
						.when({ player: "useCardAfter" })
						.filter(event => event.card?.storage?.gongximrfz === true)
						.step(async (event, trigger, player) => {
							const damages = player.getHistory("sourceDamage", evt => evt.card && evt.card.storage && evt.card.storage.gongximrfz === true).length;
							if (damages > 0) {
								const { targets } = await player
									.chooseTarget()
									.set("selectTarget", [0, damages])
									.set("prompt", `你可以令至多${damages}名角色回复一点体力并摸一张牌`)
									.set("ai", target => {
										let player = get.player();
										let att = get.attitude(player, target);
										let num = att > 0 ? 1 : -114514;
										if (att > 0 && target.hp < 2) num += 10;
										if (target === player) num += 2;
										if (att > 0 && target.getDamagedHp() > 0) num += 2;
										return num;
									})
									.forResult();
								if (targets) {
									//@ts-ignore
									player.logSkill("gongximrfz", targets);
									targets.forEach(target => {
										target.recover();
										target.draw();
									});
								}
							}
						});

					await player
						.chooseUseTarget({ name: "huoshaolianying", storage: { gongximrfz: true } }, [card])
						.set("forced", true)
						.set("prompt2", `此牌结算完成后，你令至多Y名角色回复一点体力并摸一张牌。（Y=【火烧连营】此次造成的伤害值）`);
				}
			},
			group: "gongximrfz_dying",
			subSkill: {
				dying: {
					audio: "gongximrfz",
					trigger: {
						global: "dying",
					},
					filter() {
						//@ts-ignore
						return lib.skill.gongximrfz.filter.apply(this, arguments);
					},
					async cost(event, trigger, player) {
						event.result = await player
							.chooseCardTarget({
								prompt: get.prompt("gongximrfz"),
								prompt2: get.skillInfoTranslation("gongximrfz"),
								filterCard: lib.skill.gongximrfz.filterCard,
								filterTarget: lib.skill.gongximrfz.filterTarget,
								selectTarget: lib.skill.gongximrfz.selectTarget,
								check1: lib.skill.gongximrfz.check,
								check2(target) {
									//@ts-ignore
									return lib.skill.gongximrfz.ai.result.target(get.player(), target);
								},
								complexSelect: true,
							})
							.forResult();
					},
					async content(event, trigger, player) {
						//@ts-ignore
						await lib.skill.gongximrfz.content(event, trigger, player);
					},
				},
			},
			ai: {
				order: 5,
				result: {
					target(player, target) {
						let att = get.attitude(player, target);
						if (att > 0) return;
						return -1;
					},
				},
			},
		},
		huamianmrfz: {
			audio: "minghuomrfz",
			derivation: ["jsrgjishan", "dcctjiuxian", "newminghuomrfz"],
			trigger: {
				player: "phaseJieshuEnd",
			},
			getNum(player) {
				let [drawPlayer, recoverPlayer] = [[], []];
				//@ts-ignore
				game.getGlobalHistory("changeHp", evt => {
					let evtx = evt.parent;
					//@ts-ignore
					if (evtx?.name === "recover" && evtx?.source === player && !Object.isEmpty(evtx?.getParent("phaseUse"))) recoverPlayer.add(evtx.player);
				});

				for (let char of game.players.concat(game.dead)) {
					if (
						char.getHistory("gain", evt => {
							let evtx = evt.parent;
							//@ts-ignore
							return evtx?.name === "draw" && evtx?.source === player && !Object.isEmpty(evtx?.getParent("phaseUse"));
						}).length > 0
					)
						//@ts-ignore
						drawPlayer.add(char);
				}

				console.log(drawPlayer, recoverPlayer);

				return drawPlayer.length + recoverPlayer.length;
			},
			filter(event, player) {
				return this.getNum(player) > 0;
			},
			forced: true,
			init(player) {
				//@ts-ignore
				game.broadcastAll(function () {
					["jsrgjishan", "dcctjiuxian", "newminghuomrfz"].forEach(skill => {
						let info = get.info(skill);
						if (!info.audioname2) info.audioname2 = {};
						info.audioname2[player.name] = "huamianmrfz";
					});
				});
			},
			async content(event, trigger, player) {
				let num = lib.skill.huamianmrfz.getNum(player);
				console.log(num);
				if (num >= 4) player.addTempSkill("newminghuomrfz", { player: "phaseJieshuBegin" });
				if (num >= 3) player.addTempSkill("dcctjiuxian", { player: "phaseJieshuBegin" });
				if (num >= 2) player.addTempSkill("jsrgjishan", { player: "phaseJieshuBegin" });
				if (num >= 1) player.draw();
			},
		},
		newminghuomrfz: {
			audio: ["3星结束行动", "任命队长"],
			usable: 1,
			trigger: {
				global: ["dyingAfter", "recoverAfter"],
			},
			forced: true,
			filter(event, player) {
				if (event.name === "dying") {
					//@ts-ignore
					let evt = event.getChildren("recover");
					return evt?.source === player;
				}
				return event?.source === player && event.player.getDamagedHp() === 0;
			},
			async content(event, trigger, player) {
				//@ts-ignore
				player.insertPhase();
			},
		},
	},
};
