import { lib, game, ui, get, ai, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.ts";

character("ceshimrfz", { pack: "specialSJZX", sex: "female", group: "wei", hp: 10, skills: ["aglina_fengjianmrfz_test","zhangzhongmrfz_test","xiexinmrfz_test"], isAiForbidden: true });

skill({
	aglina_fengjianmrfz_test: {
        enable: "phaseUse",
        usable: 1,
        position: "he",
        filterCard: true,
        discard: false,
        lose: false,
        delay: false,
        filterTarget(card, player, target) { return target !== player; },
        async content(event, trigger, player) {
            const target = event.target, card = event.cards[0];
            if (!target.isIn() || !player.getCards("he").includes(card)) return;
            const type = get.type2(card, player);
            const result = await target.chooseControl({ controls: ["获得此牌", "弃置此牌"] })
                .set("prompt", "封缄：选择一项（X在牌移动完成后计算）")
                .set("prompt2", "获得此牌，然后将X张手牌置于武将牌上；或弃置此牌，然后令技能发动者摸X张牌。")
                .set("ai", () => get.attitude(target, player) > 0 ? 1 : 0).forResult();
            if (result.index === 0) {
                await target.gain({ cards: [card], source: player, animate: "give" });
                if (!target.isIn()) return;
                const x = target.countCards("hej", c => get.type2(c, target) === type);
                const hs = target.getCards("h"), num = Math.min(x, hs.length);
                if (!num) return;
                const chosen = hs.length <= num ? hs : (await target.chooseCard({
                    position: "h",
                    selectCard: num,
                    forced: true,
                    prompt: "封缄：将" + num + "张手牌置于武将牌上，回合开始时收回",
                })
                    .set("ai", c => 7 - get.value(c)).forResult()).cards;
                if (!chosen?.length || !target.isIn()) return;
                // 标记由目标持有，不依赖封缄拥有者存活或继续拥有技能。
                target.addSkill("aglina_fengjianmrfz_test_sealed");
                const next = target.addToExpansion({ cards: chosen, source: target, animate: "giveAuto" });
                next.gaintag.add("aglina_fengjianmrfz_test_sealed");
                await next;
            } else {
                // 选择的是发动者的牌，由发动者弃置；不是让目标弃自己的一张牌。
                await player.discard({ cards: [card] });
                const x = target.countCards("hej", c => get.type2(c, target) === type);
                if (x && player.isIn()) await player.draw(x);
            }
        },
        ai: {
            order: 7,
            check(card) { return 7 - get.value(card); },
            result: { target: -1, player: 1 },
        },
    },
    aglina_fengjianmrfz_test_sealed: {
        charlotte: true,
        marktext: "缄",
        intro: { content: "expansion", markcount: "expansion" },
        trigger: { player: ["phaseBeginStart", "dieBegin"] },
        forced: true,
        popup: false,
        forceDie: true,
        async content(event, trigger, player) {
            const cards = player.getExpansions("aglina_fengjianmrfz_test_sealed");
            if (cards.length) {
                if (trigger.name === "die") await player.loseToDiscardpile({ cards });
                else await player.gain({ cards, animate: "gain2" });
            }
            player.removeSkill("aglina_fengjianmrfz_test_sealed");
        },
        onremove(player) {
            const cards = player.getExpansions("aglina_fengjianmrfz_test_sealed");
            if (cards.length) player.loseToDiscardpile({ cards });
        },
    },
    zhangzhongmrfz_test: {
        trigger: { player: "phaseJieshuBegin" },
        ondisable: true,
        marktext: "重",
        intro: { content: "expansion", markcount: "expansion" },
        direct: true,
        group: "zhangzhongmrfz_test_death",
        tools: {
            count() {
                const cards = new Set();
                for (const evt of game.getGlobalHistory("cardMove")) {
                    if (evt.name === "cardsDiscard" || evt.name === "lose" && evt.position === ui.discardPile) {
                        for (const card of evt.cards || []) {
                            if (get.position(card, true) === "d") cards.add(card);
                        }
                    }
                }
                return new Set(Array.from(cards, c => get.type2(c, false)).filter(Boolean)).size;
            },
            usable(player, card) {
                if (!lib.filter.cardEnabled(card, player)) return false;
                return !!get.info(card)?.notarget || player.hasUseTarget(card, false, false);
            },
            cleanup(owner) {
                // 与权计相同的移动接口，扩大至全场（包含死亡角色）。
                for (const current of game.players.concat(game.dead || [])) {
                    const cards = current.getExpansions("zhangzhongmrfz_test")
                        .filter(c => c.storage?.zhangzhongmrfz_test_owner === owner.playerid);
                    if (cards.length) current.loseToDiscardpile({ cards }).set("forceDie", true);
                }
            },
        },
        filter() { return lib.skill.zhangzhongmrfz_test.tools.count() > 0; },
        async content(event, trigger, player) {
            const tools = lib.skill.zhangzhongmrfz_test.tools, y = tools.count();
            if (!y) return;
            const use = game.hasPlayer(t => t.getCards("x").some(c => tools.usable(player, c)));
            const store = game.hasPlayer(t => t.countCards("he") > 0);
            const controls = [];
            if (use) controls.push("使用武将牌上的牌");
            if (store) controls.push("令一名角色置牌");
            if (!controls.length) return;
            controls.push("cancel2");
            const choice = await player.chooseControl({ controls })
                .set("prompt", "掌重：Y＝" + y)
                .set("ai", () => use ? "使用武将牌上的牌" : "令一名角色置牌").forResult();
            if (choice.control === "cancel2") return;
            const using = choice.control === "使用武将牌上的牌";
            const result = await player.chooseTarget({
                forced: true,
                prompt: using ? "掌重：选择一名角色，依次使用其武将牌上的牌" : "掌重：令一名角色将" + y + "张手牌或装备牌置于武将牌上",
            })
                .set("filterTarget", (card, actor, target) => using
                    ? target.getCards("x").some(c => lib.skill.zhangzhongmrfz_test.tools.usable(actor, c))
                    : target.countCards("he") > 0)
                .set("ai", target => using ? Math.max(...target.getCards("x").map(c => player.getUseValue(c, false, false)), 0) : -get.attitude(player, target))
                .forResult();
            const target = result.targets?.[0];
            if (!target?.isIn()) return;
            player.logSkill("zhangzhongmrfz_test", target);
            if (using) {
                // 每次重新检查全部x区，既允许挑选顺序，也不预先搬走其他技能的牌。
                // 一张实体牌最多尝试一次，避免使用失败或返回x区导致循环。
                const attempted = new Set();
                for (let i = 0; i < y && player.isIn() && target.isIn(); i++) {
                    const cards = target.getCards("x").filter(c => !attempted.has(c) && tools.usable(player, c));
                    if (!cards.length) break;
                    const chosen = cards.length === 1 ? cards[0] : (await player.chooseButton({
                        createDialog: ["掌重：选择第" + (i + 1) + "张要使用的牌（至多" + y + "张）", cards],
                        selectButton: 1,
                        forced: true,
                    })
                        .set("ai", button => player.getUseValue(button.link, false, false)).forResult()).links?.[0];
                    if (!chosen) break;
                    attempted.add(chosen);
                    if (!target.getCards("x").includes(chosen) || !tools.usable(player, chosen)) { i--; continue; }
                    const used = await player.chooseUseTarget({ cards: [chosen], forced: true, nodistance: true, addCount: false }).forResult();
                    if (!used.bool) i--;
                }
            } else {
                const cards = target.getCards("he"), num = Math.min(y, cards.length);
                if (!num) return;
                const chosen = cards.length <= num ? cards : (await target.chooseCard({
                    position: "he",
                    selectCard: num,
                    forced: true,
                    prompt: "掌重：将" + num + "张牌置于武将牌上",
                })
                    .set("ai", c => 7 - get.value(c)).forResult()).cards;
                if (!chosen?.length || !target.isIn()) return;
                for (const card of chosen) {
                    card.storage ||= {};
                    card.storage.zhangzhongmrfz_test_owner = player.playerid;
                }
                target.addSkill("zhangzhongmrfz_test_stored");
                const next = target.addToExpansion({ cards: chosen, source: target, animate: "giveAuto" });
                next.gaintag.add("zhangzhongmrfz_test");
                await next;
            }
        },
        onremove(player) { lib.skill.zhangzhongmrfz_test.tools.cleanup(player); },
        subSkill: {
            death: {
                trigger: { player: "dieBegin" },
                forced: true, popup: false, forceDie: true,
                content(event, trigger, player) { lib.skill.zhangzhongmrfz_test.tools.cleanup(player); },
            },
        },
    },
    zhangzhongmrfz_test_stored: {
        charlotte: true,
        trigger: { player: "dieBegin" },
        forced: true, popup: false, forceDie: true,
        async content(event, trigger, player) {
            const cards = player.getExpansions("zhangzhongmrfz_test");
            if (cards.length) await player.loseToDiscardpile({ cards }).set("forceDie", true);
        },
    },
    xiexinmrfz_test: {
        trigger: { global: "phaseBefore", player: "enterGame" },
        ondisable: true,
        direct: true,
        filter(event, player) {
            return (event.name !== "phase" || game.phaseNumber === 0) && !player.storage.xiexinmrfz_test;
        },
        async content(event, trigger, player) {
            const result = await player.chooseTarget({
                prompt: "偕星：选择一名其他角色作为伴星",
                filterTarget: (card, actor, target) => actor !== target,
            })
                .set("ai", target => get.attitude(player, target)).forResult();
            if (!result.bool) return;
            const target = result.targets[0], tools = lib.skill.xiexinmrfz_test.tools;
            player.logSkill("xiexinmrfz_test", target);
            player.storage.xiexinmrfz_test = target;
            player.syncStorage("xiexinmrfz_test");
            player.markSkill("xiexinmrfz_test");
            tools.state().links.push({ owner: player, target });
            game.addGlobalSkill("xiexinmrfz_test_global");
            await tools.reconcile(tools.members(player));
        },
        marktext: "星",
        intro: { content: "伴星：$" },
        onremove(player) { lib.skill.xiexinmrfz_test.tools.scheduleUnlink(player); },
        tools: {
            state() { return game._xiexinmrfz_test ||= { links: [], records: [], busy: 0 }; },
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
                const result = [], start = _status.currentPhase || _status.event?.player || game.players[0];
                let current = start;
                do {
                    if (players.includes(current)) result.push(current);
                    current = current?.previous;
                } while (current && current !== start && result.length < players.length);
                return result.concat(players.filter(p => !result.includes(p)));
            },
            fakeRecord(card) { return this.state().records.find(r => r.copies.some(c => c.card === card)); },
            realRecord(card) { return this.state().records.find(r => r.real === card); },
            forget(record) {
                const records = this.state().records, index = records.indexOf(record);
                if (index >= 0) records.splice(index, 1);
            },
            erase(card, owner) {
                // 只销毁假牌；不可将真牌的 _destroy/destroyed 改成销毁标记。
                const vcard = card[card.cardSymbol];
                if (vcard && owner.vcardsMap?.equips.includes(vcard)) owner.removeVirtualEquip(vcard);
                game.broadcastAll((card, owner) => {
                    card.delete();
                    card.destroyed = true;
                    owner.update();
                }, card, owner);
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
                    if (evt.result) { edit(evt.result.cards); edit(evt.result.links); }
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
                if (event._xiexinmrfz_test_internal) return;
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
                    const real = record.real, receiver = event.player;
                    // 原主人正常失去真装备，触发其onLose；内部事件不递归兑换。
                    await record.owner.lose({ cards: [real], position: ui.special }).set("_xiexinmrfz_test_internal", true).set("forceDie", true);
                    const replacement = get.autoViewAs(real, undefined, false);
                    // 对应假装备原地换成真装备，不额外执行一次onEquip。
                    for (const copy of record.copies) this.erase(copy.card, copy.owner);
                    if (real.destroyed || get.position(real, true) !== "s") {
                        this.editEvent(event, card, null);
                        continue;
                    }
                    if (card.storage?.zhangzhongmrfz_test_owner) {
                        real.storage ||= {};
                        real.storage.zhangzhongmrfz_test_owner = card.storage.zhangzhongmrfz_test_owner;
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
                    await other.equip(fake).set("_xiexinmrfz_test_mirror", true);
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
                    const ordered = this.ordered(members), chooser = ordered[0];
                    const pending = ordered.flatMap(owner => owner.getCards("e").map(card => ({ owner, card })));
                    const kept = [], slots = card => get.subtypes(card).map(s => get.is.mountCombined() && ["equip3", "equip4"].includes(s) ? "equip3_4" : s);
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
                                .set("ai", button => get.equipValue(button.link, chooser)).forResult();
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
                } finally { state.busy--; }
            },
            scheduleUnlink(player) {
                const state = this.state();
                if (!state.links.some(l => l.owner === player)) return;
                const next = game.createEvent("xiexinmrfz_test_unlink");
                next.player = player;
                next.forceDie = true;
                next.setContent(async (event, trigger, player) => {
                    await lib.skill.xiexinmrfz_test.tools.unlink(player, false);
                });
            },
            async unlink(player, dead) {
                const state = this.state(), affected = this.members(player);
                state.links = state.links.filter(l => {
                    if (l.owner !== player && (!dead || l.target !== player)) return true;
                    delete l.owner.storage.xiexinmrfz_test;
                    l.owner.syncStorage("xiexinmrfz_test");
                    l.owner.unmarkSkill("xiexinmrfz_test");
                    return false;
                });
                for (const record of state.records.slice()) {
                    if (!affected.includes(record.owner) && !record.copies.some(c => affected.includes(c.owner))) continue;
                    this.forget(record);
                    for (const copy of record.copies) this.erase(copy.card, copy.owner);
                }
                const done = new Set();
                for (const member of affected) {
                    if (!member.isIn() || member === player && dead || done.has(member)) continue;
                    const group = this.members(member).filter(p => !(dead && p === player));
                    group.forEach(p => done.add(p));
                    await this.reconcile(group);
                }
            },
        },
    },
    xiexinmrfz_test_global: {
        charlotte: true,
        trigger: { global: ["loseBefore", "equipAfter", "damageEnd", "dieBegin"] },
        forced: true,
        popup: false,
        forceDie: true,
        // 真牌优先于普通失牌联动，避免下游先取得/装备假牌。
        priority: 100000,
        firstDo: true,
        filter(event, player, name) {
            const tools = lib.skill.xiexinmrfz_test.tools, state = tools.state();
            // 全局技能只由一个在场角色执行，避免每个角色重复结算。
            if (player !== game.players.find(p => p.isIn())) return false;
            if (name === "loseBefore") return !event._xiexinmrfz_test_internal && (event.cards || []).some(c => tools.realRecord(c) || tools.fakeRecord(c));
            if (name === "equipAfter") return !state.busy && tools.members(event.player).length > 1;
            if (name === "dieBegin") return state.links.some(l => l.owner === event.player || l.target === event.player);
            return state.links.some(l => l.owner === event.player || l.target === event.player);
        },
        async content(event, trigger, player) {
            const tools = lib.skill.xiexinmrfz_test.tools;
            if (event.triggername === "loseBefore") await tools.beforeLose(trigger);
            else if (event.triggername === "equipAfter") {
                for (const card of trigger.player.getCards("e").slice()) await tools.mirror(trigger.player, card);
            } else if (event.triggername === "dieBegin") await tools.unlink(trigger.player, true);
            else {
                const actor = trigger.player;
                const others = new Set();
                for (const link of tools.state().links) {
                    if (link.owner === actor) others.add(link.target);
                    if (link.target === actor) others.add(link.owner);
                }
                for (const other of others) {
                    if (!actor.isIn() || !other.isIn()) continue;
                    const result = await actor.chooseBool({ prompt: "偕星：是否令" + get.translation(other) + "摸两张牌？" })
                        .set("choice", get.attitude(actor, other) > 0).forResult();
                    if (result.bool && other.isIn()) {
                        actor.logSkill("xiexinmrfz_test", other);
                        await other.draw(2);
                    }
                }
            }
        },
    },
});

const aglinaMrfzTranslate = {
    aglina_fengjianmrfz: "封缄",
    aglina_fengjianmrfz_info: "出牌阶段限一次，你可以选择一张手牌或装备牌和一名其他角色，该角色选择一项：1.获得此牌，然后将X张手牌置于武将牌上，直到其回合开始时收回；2.令你弃置此牌，然后令你摸X张牌。（X为获得或弃置完成后，其手牌、装备区、判定区内与此牌类型相同的牌数；手牌不足则全置。）",
    aglina_fengjianmrfz_sealed: "封缄",
    zhangzhongmrfz: "掌重",
    zhangzhongmrfz_info: "结束阶段，你可以依次使用一名角色武将牌上的Y张牌（不足则使用所有能使用的牌，无距离和次数限制），或令一名角色将Y张手牌或装备牌置于其武将牌上（不足则全置）。此技能失去或你死亡时，将因此技能置于全场武将牌上的牌置入弃牌堆；存牌角色死亡时也弃置其因此技能存放的牌。（Y为本回合进入弃牌堆且仍在弃牌堆中的牌的类型数，延时锦囊归入锦囊。）",
    zhangzhongmrfz_stored: "掌重",
    xiexinmrfz: "偕星",
    xiexinmrfz_info: "游戏开始时，你可以选择一名其他角色，称为“伴星”。你与伴星共享装备区。一方受到伤害后，其可以令另一方摸两张牌。共享装备只有一张真牌，另一方持有效果相同的假牌；真牌离开装备区时立即销毁对应假牌，假牌单独离区时改为真牌离区。一方死亡或偕星失去时解除共享并销毁假牌。",
};

const t = {}

for(let key in aglinaMrfzTranslate){
	t[`${key}_test`] = aglinaMrfzTranslate[key];
}

translate({
	ceshimrfz: "测试",
	...t
});
