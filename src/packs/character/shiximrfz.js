import { get, game, lib, ui, _status } from "noname";
import { character, characterTitle, characterIntro, translate, skill, card, cardSkill, cardTranslate } from "../hooks.js";
import { whichWayUtil } from "../../utill.js";
import { whichWayTips } from "../../tips/index.js";
const NAME = "shiximrfz";
const TOWER = "tower_shiximrfz";
const save = window.whichWaySave.tmpSave;
character(NAME, {
  sex: "female",
  group: "leimrfz",
  hp: 3,
  pack: "epicSJZX",
  skills: ["feishengmrfz", "zhixingmrfz"]
});
characterTitle(NAME, whichWayUtil.colorize("#b不一样的梦想#"));
characterIntro(NAME, "时隙,通讯技术工程师，其研究成果已应用于雷姆必拓远程通讯系统。现加入罗德岛工程部，为罗德岛基地远程通讯提供技术支持。");
const TOWER_POPTIP = get.poptip(`${TOWER}_skill`);
translate({
  [NAME]: "时隙",
  feishengmrfz: "飞声",
  feishengmrfz_info: `使命技，出牌阶段开始时，你可以将一张手牌作为${TOWER_POPTIP}置入你或与装备${TOWER_POPTIP}的角色距离为1的角色的装备区。<br>成功：回合结束时，场上存在${TOWER_POPTIP}：摸X张牌。（X=场上拥有${TOWER_POPTIP}角色的数量，X至多为你的体力上限）`
});
skill({
  feishengmrfz: {
    derivation: [`${TOWER}_skill`],
    audio: ["部署1", "部署2"],
    dutySkill: true,
    trigger: {
      player: "phaseUseBegin"
    },
    filter(event, player, name, target) {
      return player.countCards("h") > 0 && getUsableTower(player).length > 0;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseCardTarget({
        prompt: get.prompt("feishengmrfz"),
        prompt2: `你可以将一张手牌作为${TOWER_POPTIP}置入你或与装备${TOWER_POPTIP}的角色距离为1的角色的装备区`,
        position: "h",
        filterCard: () => true,
        filterTarget(card2, player2, target) {
          return getUsableTower(player2).includes(target) && target.canEquip(TOWER);
        },
        ai1(card2) {
          return 8 - get.value(card2);
        },
        ai2(target) {
          return get.attitude2(target);
        }
      }).forResult();
      event.result = {
        ...result,
        cost_data: {
          cards: result.cards,
          targets: result.targets
        }
      };
    },
    async content(event, trigger, player) {
      const { cards, targets } = event.cost_data;
      const target = targets[0];
      const card2 = new lib.element.VCard({ name: TOWER, cards, suit: "spade" });
      await target.equip(card2);
    },
    group: ["feishengmrfz_achieve"],
    subSkill: {
      achieve: {
        audio: "feishengmrfz",
        forced: true,
        trigger: {
          player: "phaseEnd"
        },
        filter(event, player, name, target) {
          return game.countPlayer((char) => char.countCards("e", (card2) => get.name(card2) === TOWER) > 0) > 0;
        },
        async content(event, trigger, player) {
          const num = Math.min(
            player.maxHp,
            game.countPlayer((char) => char.countCards("e", (card2) => get.name(card2) === TOWER) > 0)
          );
          await player.draw(num);
          game.log(player, "成功完成使命");
          player.awakenSkill("feishengmrfz");
        }
      }
    }
  }
});
card(TOWER, {
  audio: false,
  image: `ext:WhichWay/image/card/tower_shiximrfz.jpg`,
  type: "equip",
  subtype: "equip5",
  skills: [`${TOWER}_skill`, `${TOWER}_skill7`],
  // 离开装备区时执行 onLose（丢弃置于其上的牌 + 销毁音效）
  clearLose: true,
  async onLose(event, trigger, player) {
    if (player.playerid !== void 0 && save[TOWER] && Array.isArray(save[TOWER][player.playerid])) {
      const arr = save[TOWER][player.playerid];
      if (arr.length) {
        const list = arr.slice();
        arr.length = 0;
        list.forEach((c) => c.removeGaintag(TOWER));
        await game.cardsDiscard(list);
        player.$throw(list, 1e3);
        player.popup(TOWER);
        game.log(player, "的【通讯塔】被销毁，置于其上的牌被弃置", list);
      }
      delete save[TOWER][player.playerid];
      player.unmarkSkill(`${TOWER}_skill`);
      syncTowerCards();
    }
    if (save[TOWER] && Object.keys(save[TOWER]).length === 0) {
      disposeTowerObserver();
    }
  },
  destroy: true,
  ai: {
    basic: {
      equipValue: 7
    }
  }
});
let towerObserver = null;
let towerSyncTimer = null;
const towerProxiedArrays = /* @__PURE__ */ new WeakSet();
function ensureTowerObserver() {
  if (towerObserver?.alive) return;
  save[TOWER] ??= {};
  const raw = save[TOWER];
  const arrayHandler = {
    set(target, prop, value) {
      Reflect.set(target, prop, value);
      scheduleTowerSync();
      return true;
    },
    deleteProperty(target, prop) {
      const r = Reflect.deleteProperty(target, prop);
      scheduleTowerSync();
      return r;
    }
  };
  const outerHandler = {
    set(target, prop, value) {
      if (Array.isArray(value) && !towerProxiedArrays.has(value)) {
        towerProxiedArrays.add(value);
        Reflect.set(target, prop, new Proxy(value, arrayHandler));
      } else {
        Reflect.set(target, prop, value);
      }
      scheduleTowerSync();
      return true;
    },
    deleteProperty(target, prop) {
      const r = Reflect.deleteProperty(target, prop);
      scheduleTowerSync();
      return r;
    }
  };
  for (const id in raw) {
    const arr = raw[id];
    if (Array.isArray(arr) && !towerProxiedArrays.has(arr)) {
      towerProxiedArrays.add(arr);
      raw[id] = new Proxy(arr, arrayHandler);
    }
  }
  save[TOWER] = new Proxy(raw, outerHandler);
  towerObserver = { raw, alive: true };
}
function disposeTowerObserver() {
  if (towerSyncTimer !== null) {
    clearTimeout(towerSyncTimer);
    towerSyncTimer = null;
  }
  if (towerObserver?.alive) {
    save[TOWER] = towerObserver.raw;
    towerObserver.alive = false;
    towerObserver = null;
  }
}
function scheduleTowerSync() {
  if (towerSyncTimer !== null) return;
  towerSyncTimer = window.setTimeout(() => {
    towerSyncTimer = null;
    syncTowerCards();
  }, 30);
}
function getStoredCards() {
  const list = [];
  if (!save[TOWER]) return list;
  for (const id in save[TOWER]) {
    list.addArray(save[TOWER][id]);
  }
  return list;
}
function removeStoredCard(real) {
  if (!save[TOWER]) return;
  for (const id in save[TOWER]) {
    const arr = save[TOWER][id];
    if (arr.includes(real)) {
      arr.remove(real);
      return;
    }
  }
}
function isStoredCard(card2) {
  return getStoredCards().includes(card2);
}
function findStoredCardByCopy(copy) {
  const cardid = copy._cardid;
  if (!cardid || !save[TOWER]) return void 0;
  for (const id in save[TOWER]) {
    const arr = save[TOWER][id];
    const found = arr.find((c) => c.cardid === cardid);
    if (found) return found;
  }
  return void 0;
}
function cardHasTowerTag(card2, evt) {
  if (card2.hasGaintag(TOWER)) return true;
  return evt?.gaintag_map?.[card2.cardid || ""]?.includes(TOWER);
}
function syncTowerCards() {
  if (!game || !game.players) return;
  for (const p of game.players.slice().concat(game.dead)) {
    p.getCards("hs", (c) => c.hasGaintag(TOWER)).forEach((c) => c.delete());
  }
  const CardsInfo = [];
  for (const id in save[TOWER]) {
    const target = game.findPlayer((c) => c.playerid === id);
    if (!target) continue;
    CardsInfo.push([target, save[TOWER][id]]);
  }
  for (const [owner] of CardsInfo) {
    const fakeCards = CardsInfo.flatMap(
      ([storer, links]) => links.map((c) => {
        const cardx = ui.create.card();
        cardx.init(get.cardInfo(c));
        cardx._cardid = c.cardid;
        whichWayTips.addPrompt(cardx, `属于${get.translation(storer)}`, `${TOWER}_${storer.playerid}`);
        return cardx;
      })
    );
    if (fakeCards.length) owner.directgains(fakeCards, null, TOWER);
  }
}
cardSkill({
  [`${TOWER}_skill`]: {
    audio: false,
    trigger: {
      player: "loseAfter",
      global: "loseAsyncAfter"
    },
    mark: true,
    intro: {
      content(storage, player, skill2) {
        let num = save?.[TOWER]?.[player.playerid || ""]?.length || 0;
        return `·${get.translation(player)}的【通讯塔】中有${num}张牌<br><p><i>几根替换用的天线。虽然很纤细，虽然很易折，但你知道这种小小的东西能够连接人与人，连接整片大地。</i></p>`;
      }
    },
    filter(event, player) {
      const evt3 = event.getParent(3);
      const discardEvt = event.getParent("phaseDiscard");
      console.log(event, discardEvt);
      if (evt3 == null || discardEvt == null) {
        return false;
      }
      if (discardEvt.player === player) return false;
      if (event.type != "discard") return false;
      let evt = event.getl(player);
      if (!evt || !evt.cards2) return false;
      for (let i = 0; i < evt.cards2.length; i++) {
        if (get.position(evt.cards2[i]) == "d") return true;
      }
      return false;
    },
    init(player, skill2) {
      save[TOWER] ??= {};
      save[TOWER][player.playerid] ??= [];
      player.markSkill(`${TOWER}_skill`);
      ensureTowerObserver();
      syncTowerCards();
    },
    forced: true,
    async content(event, trigger, player) {
      save[TOWER] ??= {};
      const playerSave = save[TOWER][player.playerid] ||= [];
      const cards2 = trigger.getl(player).cards2 || [];
      const cards = cards2.filter((card2) => get.position(card2, true) == "d" && !playerSave.includes(card2));
      if (!cards.length) return;
      _status.discarded?.removeArray?.(cards);
      await game.cardsGotoSpecial(cards, false);
      cards.forEach((c) => c.addGaintag(TOWER));
      playerSave.push(...cards);
    },
    onremove(player, skill2) {
      if (save[TOWER] && player.playerid !== void 0) {
        const stored = save[TOWER][player.playerid];
        if (!stored?.length) {
          delete save[TOWER][player.playerid];
        }
      }
      if (save[TOWER] && Object.keys(save[TOWER]).length === 0) {
        disposeTowerObserver();
      }
    }
  }
});
cardSkill({
  [`${TOWER}_skill7`]: {
    audio: false,
    charlotte: true,
    trigger: { player: "loseEnd" },
    firstDo: true,
    forced: true,
    silent: true,
    delay: false,
    filter(event, player) {
      if (!event.ss || !event.ss.length) return false;
      const stored = getStoredCards();
      if (!stored.length) return false;
      return event.ss.some((card2) => cardHasTowerTag(card2, event) || stored.includes(card2));
    },
    async content(event, trigger, player) {
      const evt = trigger.getl(player);
      const lost = (trigger.ss || []).filter((card2) => cardHasTowerTag(card2, evt) || isStoredCard(card2));
      for (const lostCard of lost) {
        whichWayTips.removePrompt(lostCard);
        const targetId = lostCard._cardid || lostCard.cardid;
        for (const p of game.players.concat(game.dead)) {
          p.getCards("hs", (c) => c.hasGaintag(TOWER) && (c._cardid === targetId || c.cardid === targetId)).forEach((c) => c.delete());
        }
        const real = isStoredCard(lostCard) ? lostCard : findStoredCardByCopy(lostCard);
        if (real) {
          removeStoredCard(real);
          if (get.position(real, true) == "s") {
            real.delete();
          }
        }
      }
      syncTowerCards();
    }
  }
});
cardTranslate({
  [TOWER]: "通讯塔",
  [`${TOWER}_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
  [`${TOWER}_skill`]: "通讯塔",
  [`${TOWER}_skill_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。",
  [`${TOWER}_skill7`]: "通讯塔",
  [`${TOWER}_skill7_info`]: "锁定技，当你不在弃牌阶段因弃置的牌进入弃牌堆后，你将弃置的牌置于此牌之上，所有装备区有【通讯塔】的角色可将此牌当做手牌使用；当此牌离开你的装备区时，弃置置于此牌上的所有牌并销毁此牌。"
});
function getUsableTower(player) {
  const results = /* @__PURE__ */ new Set();
  if (player.countCards("e", (card2) => get.name(card2) === TOWER) < 1) {
    results.add(player);
  }
  for (let target of game.players.slice()) {
    if (!target.countCards("e", (card2) => get.name(card2) === TOWER)) continue;
    game.filterPlayer((char) => get.distance(char, target) <= 1).forEach((c) => results.add(c));
  }
  return Array.from(results);
}
