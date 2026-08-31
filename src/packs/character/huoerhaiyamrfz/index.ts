import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";

character("huoerhaiyamrfz", { pack: "legendSJZX",
			sex: "female",
			hp: 4,
			skills: ["yumengmrfz"],
			group: "gemrfz",
			designer: "涵涵",
		});

skill({
	"yumengmrfz": {
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
	"newkuangyumrfz": {
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
	"tanxianmrfz": {
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
	"yushenmrfz": {
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
});

translate({
	"huoerhaiyamrfz": "霍尔海雅",
	"yumengmrfz": "羽梦",
	"yumengmrfz_info": "使命技。<br>①出牌阶段限四次，你可以#g弃置N张手牌且本次使用此技能不计入使用次数#，若你的手牌数小于N，你此次发动本技能时，将绿色部分改为“摸N张牌”，然后N+1。（N=2）<br>②成功：你的回合结束后，若N大于牌堆数与全场人数之积，你获得“羽神”。<br>③失败：第二轮开始时，你失去一点体力上限，获得“诳语”和“昙现”。",
	"newkuangyumrfz": "诳语",
	"newkuangyumrfz_info": "每回合限一次，当你使用【杀】或普通锦囊牌指定唯一目标后，你可以为此牌额外指定至多X个合法目标，若此牌没有造成伤害，你失去一点体力，反之，你摸一张牌且此技能本回合视为未发动过。（X=你当前体力值）",
	"tanxianmrfz": "昙现",
	"tanxianmrfz_info": "锁定技。<br>①你的额定摸牌数为#r4#;出牌阶段【杀】的使用次数+#r1#;你的基础攻击范围为#r5#;<br>②你的回合结束时，你令其中最大的数字-1，然后须重新分配此技能所有红色的数字。",
	"yushenmrfz": "羽神",
	"yushenmrfz_info": "锁定技。<br>①当你死亡时，若牌堆中有牌，你销毁之，然后你防止死亡，将体力值调整至1。<br>②回合开始时，你选择获得一个武将包中的所有武将的技能。",
});

characterTitle("huoerhaiyamrfz", "<font color=#00868B>但为求索</font>");

characterIntro("huoerhaiyamrfz", "投稿来源：涵涵<br>霍尔海雅，前梅兰德基金会所属特工，在凯尔希医生与博士的引荐下加入罗德岛。</br>擅长单兵作战，并且能够应对各种极端环境，在各类隐秘行动中发挥了重大价值。");
