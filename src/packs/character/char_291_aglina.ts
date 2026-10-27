import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro, card } from "../hooks.ts";
import { gameUtils } from "../../nonameEx/custom/gameUtils.ts";

character("char_291_aglina", { pack: "legendSJZX", sex: "female", group: "xumrfz", hp: 3, skills: ["aglina_fengjianmrfz", "zhangzhongmrfz", "xiexinmrfz"] });

const FENGJIAN_TAG = "aglina_fengjianmrfz";

// 目标区域内与给定牌同类型的牌数，即封缄的 X
function countSameType(target, card) {
	return target.countCards("hej", cardx => get.type2(cardx) == get.type2(card));
}

// 掌重的 Y：本回合进入弃牌堆的牌的类型数
function countCentralTypes() {
	return new Set(
		get
			.discarded()
			.filterInD("d")
			.map(card => get.type2(card))
	).size;
}

skill({
	aglina_fengjianmrfz: {
		audio:["完成高难行动","非3星结束行动"],
		enable: "phaseUse",
		usable: 1,
		filter(event, player) {
			return player.countCards("he") > 0 && game.hasPlayer(current => current != player);
		},
		filterCard: () => true,
		selectCard: 1,
		position: "he",
		filterTarget: (card, player, target) => target != player,
		async content(event, trigger, player) {
			const card = event.cards[0],
				target = event.targets[0];
			const result = await target.chooseControl({ controls: ["获得此牌", "弃置此牌"], prompt: `封缄：${get.translation(player)}对你使用了【封缄】` ,ai(event, player) {
				const target = get.event().targetx as Player;
				const x= countSameType(player,card);
				if(get.attitude(player,target)>0) return "弃置此牌";
				return x >= 3 ? "获得此牌" : "弃置此牌";
			},}).set("targetx",player).forResult();
			if (result.control == "获得此牌") {
				await player.give([card], target, false);
				const x = countSameType(target, card);
				const num = Math.min(x, target.countCards("h"));
				if (num < 1) return;
				const choose = await target
					.chooseCard({
						prompt: `封缄：将${get.cnNumber(num)}张手牌置于你的武将牌上`,
						position: "h",
						selectCard: num,
						forced: true,
						ai(card) {
							return -get.value(card);
						},
					})
					.forResult();
				if (!choose.cards?.length) return;
				await target.addToExpansion({ cards: choose.cards, source: player, animate: "giveAuto" }).gaintag.add(FENGJIAN_TAG);
				target.markSkill(FENGJIAN_TAG);
				target.addTempSkill("aglina_fengjianmrfz_back", { player: "phaseBegin" });
			} else {
				const x = countSameType(target, card);
				await player.loseToDiscardpile({ cards: [card] });
				if (x > 0) await player.draw(x);
			}
		},
		ai: {
			order: 8,
			result: { target: (player, target) => (get.attitude(player, target) < 0 ? -1 : 1) },
		},
		intro: {
			mark(dialog, storage, player, event, skill) {
				const cards = player.getCards("x", card => card.hasGaintag(FENGJIAN_TAG));
				if (!cards.length) {
					dialog.addText(`武将牌上有${get.rand(-10, 10)}个棍木`);
					return;
				}
				dialog.addAuto(cards);
			},
		},
		subSkill: {
			back: {
				charlotte: true,
				silent: true,
				forced: true,
				trigger: { player: "phaseBeginStart" },
				async content(event, trigger, player) {
					const cards = player.getExpansions(FENGJIAN_TAG);
					console.log(cards);
					if (cards.length) await player.gain({ cards, animate: "gain2", source: player });
					player.unmarkSkill(FENGJIAN_TAG);
					player.removeSkill("aglina_fengjianmrfz_back");
				},
			},
		},
	},
	/**
	 * 结束阶段，你可以使用一名角色武将牌上的Y张牌或令一名角色将Y张牌置于其武将牌上直到你死亡或失去此技能。（Y=中央区牌的类型数）
	 */
	zhangzhongmrfz: {
		audio:["作战中1","作战中4"],
		trigger: { player: "phaseJieshuBegin" },
		intro: {
			mark(dialog, storage, player, event, skill) {
				const cards = player.getCards("x", card => card.hasGaintag("zhangzhongmrfz"));
				if (!cards.length) {
					dialog.addText(`武将牌上有${get.rand(-10, 10)}个棍木`);
					return;
				}
				dialog.addAuto(cards);
			},
		},
		filter(event, player) {
			return countCentralTypes() > 0 && game.hasPlayer(current => current.countCards("hex") > 0);
		},
		async cost(event, trigger, player) {
			const result = await player
				.chooseTargetControl({
					controls(targets) {
						//["使用牌","放置牌"]
						const list: string[] = [];
						const target = targets[0];

						if (!target) return [];

						if (target.countCards("he") > 0) list.push("放置牌");
						if (target.countCards("x", card => player.hasUseTarget(card, false, false)) > 0) list.push("使用牌");

						return list.add("cancel2");
					},
					prompt: get.prompt("zhangzhongmrfz"),
					prompt2: get.skillInfoTranslation("zhangzhongmrfz"),
					filterTarget(card, player, target) {
						return target.countCards("he") > 0 || target.countCards("x", card => player.hasUseTarget(card, false, false)) > 0;
					},
					controlAi(event, player) {
						const target = ui.selected.targets[0];
						if (target.countCards("x", card => player.hasUseTarget(card, false, false)) > 0) return "使用牌";
						return target.countCards("he") > 0 ? "放置牌" : "cancel2";
					},
					ai(target) {
						return get.attitude2(target) < 0 ? 1 : -1;
					},
				})
				.forResult();

			event.result = gameUtils.createResult({
				bool: result.bool,
				cost_data: {
					control: result.control,
					targets: result.targets,
				},
			});
		},
		async content(event, trigger, player) {
			const {
				control,
				targets: [target],
			} = event.cost_data as {
				control: "使用牌" | "放置牌";
				targets: Player[];
			};

			const count = countCentralTypes();

			if (control === "使用牌") {
				let used = 0;

				while (used < count) {
					const cards = target.getCards("x");

					const result = await player
						.chooseFakeCard({
							tagName: `${get.translation(target)}武将牌上的牌`,
							cards,
							filterCard(card, player, event) {
								return player.hasUseTarget(card, false, false);
							},
							ai(card) {
								const player = get.player();
								if (!game.hasPlayer(cur => get.effect(cur, card, player, player) > 0)) return -1;
								return get.useful(card, player);
							},
							prompt: `请使用${get.translation(target)}武将牌上的一张牌`,
							prompt2: `已使用${used}张,还可使用${count - used}张`,
						})
						.forResult();
					if (result.links && result.links.length>0) {
						const card: Card = result.links[0];
						await player.chooseUseTarget({
							card,
							forced: true,
							ai(target) {
								return get.effect(target, card, player, player);
							},
						});
					}
					used += 1;
				}
			} else {
				const result = await target
					.chooseCard({
						prompt: `请将${count}张牌置于武将牌上`,
						forced: true,
						filterCard(card, player, event) {
							return true;
						},
						position: "he",
						selectCard: count,
						ai(card) {
							return -get.value(card);
						},
					})
					.forResult();
				if (result.cards) {
					target.addToExpansion({
						cards: result.cards,
						source: target,
						animate: "giveAuto",
						gaintag: ["zhangzhongmrfz"],
					});
					target.markSkill("zhangzhongmrfz");
				}
			}
		},
		onremove(player) {
			for (const current of game.players) {
				const cards = current.getExpansions(FENGJIAN_TAG);
				if (cards.length) current.loseToDiscardpile({ cards });
				current.unmarkSkill("zhangzhongmrfz");
			}
		},
		group: "zhangzhongmrfz_die",
		subSkill: {
			die: {
				silent: true,
				charlotte: true,
				trigger: { global: "dieAfter" },
				filter(event, player, name, target) {
					return event.player.getExpansions("zhangzhongmrfz").length;
				},
				async content(event, trigger, player) {
					const target = trigger.player;
					await target.loseToDiscardpile({
						cards: target.getExpansions("zhangzhongmrfz"),
					});
				},
			},
		},
	},
	xiexinmrfz: {
		audio:["闲置","信赖提升后交谈3"],
		trigger: { global: "phaseBefore", player: "enterGame" },
		ondisable: true,
		forced:true,
		filter(event, player) {
			return (event.name !== "phase" || game.phaseNumber === 0) && !player.storage.xiexinmrfz;
		},
		async content(event, trigger, player) {
			const result = await player
				.chooseTarget({
					//"偕星：选择一名其他角色作为伴星", (card, actor, target) => actor !== target
					prompt: "偕星：选择一名其他角色作为伴星",
					filterTarget(card, player, target) {
						return player !== target;
					},
				})
				.set("ai", target => get.attitude(player, target))
				.forResult();
			if (!result.bool) return;
			const target = result.targets![0],
				tools = lib.skill.xiexinmrfz.tools;
			player.logSkill("xiexinmrfz", target);
			player.storage.xiexinmrfz = target;
			player.syncStorage("xiexinmrfz");
			player.markSkill("xiexinmrfz");
			tools.state().links.push({ owner: player, target });
			game.addGlobalSkill("xiexinmrfz_global");
			await tools.reconcile(tools.members(player));
		},
		marktext: "星",
		intro: { content: "伴星：$" },
		onremove(player) {
			lib.skill.xiexinmrfz.tools.scheduleUnlink(player);
		},
		tools: {
			state() {
				//@ts-ignore
				return (game._xiexinmrfz ||= { links: [], records: [], busy: 0 });
			},
			members(player) {
				const members = [player];
				for (let i = 0; i < members.length; i++) {
					for (const link of this.state().links) {
						if (link.owner === members[i] && !members.includes(link.target)) members.push(link.target);
						if (link.target === members[i] && !members.includes(link.owner)) members.push(link.owner);
					}
				}
				return members.filter(p => p.isIn());
			},
			ordered(players) {
				const result:Player[] = [],
					start = _status.currentPhase || _status.event?.player || game.players[0];
				let current = start;
				do {
					if (players.includes(current)) result.push(current);
					current = current?.previous;
				} while (current && current !== start && result.length < players.length);
				return result.concat(players.filter(p => !result.includes(p)));
			},
			fakeRecord(card) {
				return this.state().records.find(r => r.copies.some(c => c.card === card));
			},
			realRecord(card) {
				return this.state().records.find(r => r.real === card);
			},
			forget(record) {
				const records = this.state().records,
					index = records.indexOf(record);
				if (index >= 0) records.splice(index, 1);
			},
			erase(card, owner) {
				// 只销毁假牌；不可将真牌的 _destroy/destroyed 改成销毁标记。
				const vcard = card[card.cardSymbol];
				if (vcard && owner.vcardsMap?.equips.includes(vcard)) owner.removeVirtualEquip(vcard);
				game.broadcastAll(
					(card, owner) => {
						card.delete();
						card.destroyed = true;
						owner.update();
					},
					card,
					owner
				);
			},
			// 只访问牌移动字段，绝不递归改动角色storage、历史、整个引擎对象图。
			editEvent(event, from, to) {
				const seen = new Set();
				const edit = value => {
					if (!value || seen.has(value)) return;
					if (Array.isArray(value)) {
						seen.add(value);
						for (let i = value.length - 1; i >= 0; i--) {
							if (value[i] === from) {
								if (to) value[i] = to;
								else value.splice(i, 1);
							} else edit(value[i]);
						}
					} else if (value.constructor === Object) {
						seen.add(value);
						// losing_map/gaining_map的键是playerid。
						for (const key of Object.keys(value)) if (Array.isArray(value[key])) edit(value[key]);
					}
				};
				const visited = new Set();
				const visit = evt => {
					if (!evt || visited.has(evt)) return;
					visited.add(evt);
					for (const key of ["cards", "cards1", "cards2", "hs", "es", "js", "xs", "ss", "lose_list", "gain_list", "losing_map", "gaining_map", "orderingCards", "stockcards"]) edit(evt[key]);
					if (evt.card === from) {
						if (to) evt.card = to;
						else if (["equip", "useCard", "respond"].includes(evt.name)) evt.cancel?.();
					}
					if (evt.result) {
						edit(evt.result.cards);
						edit(evt.result.links);
					}
					for (const child of evt.next || []) visit(child);
				};
				let current = event;
				while (current && !visited.has(current)) {
					visit(current);
					current = current.parent;
				}
			},
			realPending(event, record) {
				// 在同一次批量移动/交换内真牌优先，不把整段技能历史当同一次移动。
				const includes = value => Array.isArray(value) && value.some(v => v === record.real || includes(v));
				if (includes(event.cards)) return true;
				let current = event.parent;
				while (current && ["loseAsync", "gain", "equip", "discard", "loseToDiscardpile", "addToExpansion", "swapEquip", "swapHandcards"].includes(current.name)) {
					for (const key of ["cards", "cards1", "cards2", "lose_list", "gain_list"]) if (includes(current[key])) return true;
					current = current.parent;
				}
				return false;
			},
			async beforeLose(event) {
				const state = this.state();
				if (event._xiexinmrfz_internal) return;
				// 快照保证先扫真牌，后扫假牌。
				const original = (event.cards || []).slice();
				for (const card of original) {
					const record = this.realRecord(card);
					if (!record || !record.owner.getCards("e").includes(card)) continue;
					this.forget(record);
					for (const copy of record.copies) {
						this.editEvent(event, copy.card, null);
						this.erase(copy.card, copy.owner);
					}
				}
				for (const card of original) {
					const record = this.fakeRecord(card);
					if (!record) continue;
					if (!record.owner.getCards("e").includes(record.real) || this.realPending(event, record)) {
						// 批量操作即使先执行假牌方lose，也先销毁假牌；真牌仍按原目的地移动。
						this.editEvent(event, card, null);
						record.copies = record.copies.filter(c => c.card !== card);
						this.erase(card, event.player);
						continue;
					}
					this.forget(record);
					const real = record.real,
						receiver = event.player;
					// 原主人正常失去真装备，触发其onLose；内部事件不递归兑换。
					await record.owner.lose({ cards: [real], position: ui.special }).set("_xiexinmrfz_internal", true).set("forceDie", true);
					const replacement = get.autoViewAs(real, undefined, false);
					// 对应假装备原地换成真装备，不额外执行一次onEquip。
					for (const copy of record.copies) this.erase(copy.card, copy.owner);
					if (real.destroyed || get.position(real, true) !== "s") {
						this.editEvent(event, card, null);
						continue;
					}
					if (card.storage?.zhangzhongmrfz_owner) {
						real.storage ||= {};
						real.storage.zhangzhongmrfz_owner = card.storage.zhangzhongmrfz_owner;
					}
					receiver.addVirtualEquip(replacement, [real]);
					this.editEvent(event, card, real);
					// swapEquip的局部cards数组通过上面的原地改写保持同步。
				}
			},
			async mirror(owner, card) {
				if (this.fakeRecord(card) || !owner.getCards("e").includes(card)) return;
				const members = this.members(owner);
				if (members.length < 2) return;
				let record = this.realRecord(card);
				if (!record) {
					record = { real: card, owner, copies: [] };
					this.state().records.push(record);
				}
				for (const other of members) {
					if (other === owner || record.copies.some(c => c.owner === other)) continue;
					if (!owner.getCards("e").includes(card) || !this.state().records.includes(record)) break;
					const fake = game.createCard(card.name, card.suit, card.number, card.nature);
					if (card.subtypes) fake.subtypes = card.subtypes.slice();
					if (card.storage) fake.storage = get.copy(card.storage);
					// 先登记再装备，装备触发链中真牌离区可立即找到并销毁假牌。
					record.copies.push({ card: fake, owner: other });
					await other.equip(fake).set("_xiexinmrfz_mirror", true);
					if (!this.state().records.includes(record) || !owner.getCards("e").includes(card) || !other.getCards("e").includes(fake)) {
						record.copies = record.copies.filter(c => c.card !== fake);
						this.erase(fake, other);
					}
				}
			},
			async reconcile(members) {
				if (members.length < 2) return;
				const state = this.state();
				state.busy++;
				try {
					// 建立或合并关系时先去掉旧假牌，真实装备仍留在原主人处。
					for (const record of state.records.slice()) {
						if (!members.includes(record.owner)) continue;
						this.forget(record);
						for (const copy of record.copies) this.erase(copy.card, copy.owner);
					}
					const ordered = this.ordered(members),
						chooser = ordered[0];
					const pending = ordered.flatMap(owner => owner.getCards("e").map(card => ({ owner, card })));
					const kept:any[] = [],
						slots = card => get.subtypes(card).map(s => (get.is.mountCombined() && ["equip3", "equip4"].includes(s) ? "equip3_4" : s));
					const fits = list => {
						const counts = {};
						for (const item of list) for (const slot of slots(item.card)) counts[slot] = (counts[slot] || 0) + 1;
						return Object.keys(counts).every(slot => counts[slot] <= Math.max(1, ...members.map(p => p.countEquipableSlot(slot))));
					};
					// 冲突由从当前回合逆时针最先轮到的成员决定；兼容扩展栏/多栏装备。
					while (pending.length) {
						const competing = pending.filter(a => pending.some(b => a !== b && !fits(kept.concat(a, b))));
						let chosen = pending[0];
						if (competing.length) {
							const result = await chooser.chooseButton({ createDialog: ["偕星：选择保留的装备", competing.map(i => i.card)], selectButton: 1, forced: true })
								.set("ai", button => get.equipValue(button.link, chooser))
								.forResult();
							chosen = pending.find(i => i.card === result.links?.[0]) || competing[0];
						}
						kept.push(chosen);
						pending.splice(pending.indexOf(chosen), 1);
						for (let i = pending.length - 1; i >= 0; i--) {
							if (!fits(kept.concat(pending[i]))) {
								const loser = pending.splice(i, 1)[0];
								await loser.owner.loseToDiscardpile({ cards: [loser.card] });
							}
						}
					}
					for (const item of kept) await this.mirror(item.owner, item.card);
				} finally {
					state.busy--;
				}
			},
			scheduleUnlink(player) {
				const state = this.state();
				if (!state.links.some(l => l.owner === player)) return;
				const next = game.createEvent("xiexinmrfz_unlink");
				next.player = player;
				next.forceDie = true;
				next.setContent(async (event, trigger, player) => {
					await lib.skill.xiexinmrfz.tools.unlink(player, false);
				});
			},
			async unlink(player, dead) {
				const state = this.state(),
					affected = this.members(player);
				state.links = state.links.filter(l => {
					if (l.owner !== player && (!dead || l.target !== player)) return true;
					delete l.owner.storage.xiexinmrfz;
					l.owner.syncStorage("xiexinmrfz");
					l.owner.unmarkSkill("xiexinmrfz");
					return false;
				});
				for (const record of state.records.slice()) {
					if (!affected.includes(record.owner) && !record.copies.some(c => affected.includes(c.owner))) continue;
					this.forget(record);
					for (const copy of record.copies) this.erase(copy.card, copy.owner);
				}
				const done = new Set();
				for (const member of affected) {
					if (!member.isIn() || (member === player && dead) || done.has(member)) continue;
					const group = this.members(member).filter(p => !(dead && p === player));
					group.forEach(p => done.add(p));
					await this.reconcile(group);
				}
			},
		},
	},
	xiexinmrfz_global: {
		silent:true,
		charlotte: true,
		trigger: { global: ["loseBefore", "equipAfter", "damageEnd", "dieBegin"] },
		forced: true,
		popup: false,
		forceDie: true,
		// 真牌优先于普通失牌联动，避免下游先取得/装备假牌。
		priority: 100000,
		firstDo: true,
		filter(event, player, name) {
			const tools = lib.skill.xiexinmrfz.tools,
				state = tools.state();
			// 全局技能只由一个在场角色执行，避免每个角色重复结算。
			if (player !== game.players.find(p => p.isIn())) return false;
			if (name === "loseBefore") return !event._xiexinmrfz_internal && (event.cards || []).some(c => tools.realRecord(c) || tools.fakeRecord(c));
			if (name === "equipAfter") return !state.busy && tools.members(event.player).length > 1;
			if (name === "dieBegin") return state.links.some(l => l.owner === event.player || l.target === event.player);
			return state.links.some(l => l.owner === event.player || l.target === event.player);
		},
		async content(event, trigger, player) {
			const tools = lib.skill.xiexinmrfz.tools;
			if (event.triggername === "loseBefore") await tools.beforeLose(trigger);
			else if (event.triggername === "equipAfter") {
				for (const card of trigger.player.getCards("e").slice()) await tools.mirror(trigger.player, card);
			} else if (event.triggername === "dieBegin") await tools.unlink(trigger.player, true);
			else {
				const actor = trigger.player;
				const others: Set<Player> = new Set();
				for (const link of tools.state().links) {
					if (link.owner === actor) others.add(link.target);
					if (link.target === actor) others.add(link.owner);
				}
				for (const other of others) {
					if (!actor.isIn() || !other.isIn()) continue;
					const result = await actor
						.chooseBool({
							//"偕星：是否令" + get.translation(other) + "摸两张牌？"
							prompt: "偕星：是否令" + get.translation(other) + "摸两张牌？",
						})
						.set("choice", get.attitude(actor, other) > 0)
						.forResult();
					if (result.bool && other.isIn()) {
						actor.logSkill("xiexinmrfz", other);
						await other.draw(2);
					}
				}
			}
		},
	},
});

translate({
	char_291_aglina: "安洁莉娜",
	aglina_fengjianmrfz: "封缄",
	aglina_fengjianmrfz_info: "出牌阶段限一次，你可以选择一张牌和一名其他角色，该角色选择一项:<br>1.获得此牌。然后其将X张手牌置于武将牌上直到其回合开始;<br>2.弃置此牌，然后令你摸X张牌。<br>（X = 其区域内与此牌类型一致牌的数量）",
	zhangzhongmrfz: "掌重",
	zhangzhongmrfz_info: "结束阶段，你可以使用一名角色武将牌上的Y张牌或令一名角色将Y张牌置于其武将牌上(此技能失效时或你死亡时将因此技能置于武将牌上的牌置入弃牌堆)。（Y=中央区牌的类型数）",
	xiexinmrfz: "偕星",
	xiexinmrfz_info: `游戏开始时，你可以选择一名其他角色，称为“伴星”。你与“伴星”${get.poptip("sjzx_xiexinShare")}。当[你/“伴星”]受到伤害后，[你/“伴星”]可以令另一者摸两张牌。`,
});

characterIntro("char_291_aglina", "安洁莉娜，本名安心院安洁莉娜。于叙拉古从事情报递送、货物运输等公开活动，推测身份：信使。</br>现作为实习术师干员，为罗德岛提供后勤保障、战场辅助与战术协同等服务。");

characterTitle("char_291_aglina", "罗德岛的安洁莉娜");
