import { lib, get, ui } from "noname";
import { whichWayTips } from "../../tips/index.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spxingyuanmrfz", {
  pack: "legendSJZX",
  sex: "female",
  hp: 4,
  skills: ["yulimrfz", "sulimrfz"],
  group: "gemrfz"
});
skill({
  "yulimrfz": {
    audio: ["观看作战记录", "非3星结束行动"],
    derivation: ["yulimrfz_rewirte"],
    init(player, skill2) {
      player.storage[skill2] = false;
    },
    onremove: true,
    trigger: {
      player: "gainAfter"
    },
    locked(skill2, player) {
      return !player || !player.storage.yulimrfz;
    },
    filter(event, player) {
      if (Object.keys(event.getParent("yulimrfz")).length > 0) return false;
      let types = ["basic", "trick", "equip"];
      return player.storage.yulimrfz ? new Set(event.cards.map((i) => get.type2(i)).filter((i) => types.includes(i))).size !== types.length : !event.cards.map((i) => get.type2(i)).includes("basic");
    },
    async cost(event, trigger, player) {
      if (player.storage.yulimrfz) {
        let types = ["basic", "trick", "equip"].filter((type) => !trigger.cards.map((i) => get.type2(i)).includes(type));
        const result = await player.chooseControl(...types, "cancel2").set("prompt", `【迂理】:请选择你要从牌堆中获得的牌的类型`).set("ai", () => {
          let { types: types2, player: player2 } = get.event();
          if (player2.getDamagedHp() > 1 && types2.includes("basic")) return "basic";
          if (player2.countEquipableSlot() > 0 && types2.includes("equip")) return "equip";
          return types2.includes("trick") ? "trick" : types2.randomGet();
        }).set("types", types).forResult();
        event.result = {
          ...result,
          cost_data: result
        };
      } else {
        event.result = {
          bool: true,
          cost_data: {
            control: "basic"
          }
        };
      }
    },
    async content(event, trigger, player) {
      let { control } = event.cost_data;
      let card = get.cardPile((card2) => get.type2(card2) === control, "cardPile");
      if (card) player.gain(card, "gain2");
      else player.chat(`牌堆中没有${get.translation(control)}牌了！`);
    },
    ai: {
      threaten: 1.1
    }
  },
  "sulimrfz": {
    audio: ["作战中1", "作战中4"],
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    position: "he",
    filterCard(card) {
      let player = get.player();
      get.event();
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
      }
    },
    getMaxType(player) {
      const handTypes = player.getCards("h").map((card) => get.type2(card));
      const counts = { basic: 0, trick: 0, equip: 0 };
      for (const type of handTypes) {
        if (type in counts) counts[type]++;
      }
      const values = Object.values(counts);
      const maxCount = Math.max(...values);
      const maxCountOccurrences = values.filter((v) => v === maxCount).length;
      return maxCountOccurrences === 1 ? Object.keys(counts).find((type) => counts[type] === maxCount) : void 0;
    },
    discard: false,
    lose: false,
    delay: 0,
    check(card) {
      let player = get.player(), cards = ui.selected.cards, maxType = lib.skill.sulimrfz.getMaxType(player);
      if (get.type(card) === maxType) return -1;
      if (cards.length > 0 && get.position(card) === "e") return -1;
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const cards = event.cards;
      const loseAllCard = player.countCards("h") - cards.length === 0;
      player.storage.sulimrfz.addArray(cards.map((i) => get.type2(i)));
      await player.discard(cards);
      const maxType = lib.skill.sulimrfz.getMaxType(player);
      if (player.countCards("h") === 0 && !player.storage.yulimrfz && loseAllCard) {
        player.storage.yulimrfz = true;
        player.loseMaxHp();
        player.$skill(get.translation("sulimrfz"), true, "wood");
      }
      let num = 3 - new Set(player.getCards("h").map((card) => get.type2(card))).size;
      if ((!maxType || !cards.map((i) => get.type2(i)).includes(maxType)) && num > 0) {
        await player.draw(num);
      }
    },
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    onremove(player, skill2) {
      delete player.storage[skill2];
      if (!player.hasSkill("yulimrfz") && player.storage.yulimrfz === true) delete player.storage.yulimrfz;
    },
    group: "sulimrfz_clear",
    subSkill: {
      clear: {
        silent: true,
        charlotte: true,
        trigger: {
          player: "phaseUseEnd"
        },
        async content(event, trigger, player) {
          lib.skill.sulimrfz.init(player, "sulimrfz");
        }
      }
    },
    ai: {
      order: 4,
      result: {
        player: 1
      }
    }
  }
});
translate({
  "spxingyuanmrfz": "溯光星源",
  "spxingyuanmrfz_prefix": "溯光",
  "yulimrfz": "迂理",
  "yulimrfz_info": "锁定技，当你获得牌后，若这些牌中没有基本牌，你从牌堆中获得一张基本牌。",
  "yulimrfz_rewirte": "迂理·修改",
  "yulimrfz_rewirte_info": "当你不因【迂理】而获得牌后，你可以选择从牌堆中获得一张这些牌中没有的类型的牌。",
  "sulimrfz": "溯理",
  "sulimrfz_info": "出牌阶段，你可以弃置至多两张本阶段未以此法弃置过的类型的牌,#r并执行下列选项:<br>1.#若弃置的牌类型均不为你手牌中唯一最多的类型,你摸X张牌#r;<br>2.若你因此失去了所有的手牌，你修改“迂理”、减少一点体力上限并删除本技能所有红色的描述#。（X=你手牌中没有的类型的数量）"
});
characterTitle("spxingyuanmrfz", "<font color = green>溯光求源</font>");
characterIntro("spxingyuanmrfz", "莱茵生命能量科研究员，埃琳娜·乌比卡博士，如今作为谢拉格观测站的能量组组长活跃在研究一线。谢拉格天灾事件的主要调查者之一。");
//# sourceMappingURL=spxingyuanmrfz.js.map
