import { get, ui, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("senximrfz", {
  sex: "male",
  group: "othermrfz",
  hp: 4,
  skills: ["micaimrfz", "beicaimrfz", "pengcaimrfz"]
});
skill({
  "micaimrfz": {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter"]
    },
    usable: 1,
    filter(event, player) {
      if (event.type != "discard" || event.position != ui.discardPile || event.player == player) return false;
      let cards = event.getd();
      if (!cards.filter((card) => get.position(card, true) == "d").length) return false;
      return true;
    },
    async cost(event, trigger, player) {
      let cards = trigger.getd().filter((i) => get.position(i, true) == "d");
      event.result = await player.chooseCardButton("【觅材】:你可以获得一张牌", cards).set("ai", (button) => get.value(button)).forResult();
      event.result.cost_data = event.result;
    },
    async content(event, trigger, player) {
      player.gain(event.cost_data.links, "gain2");
    }
  },
  "beicaimrfz": {
    audio: 2,
    trigger: { player: "phaseZhunbeiBegin" },
    init(player, skill2) {
      player.storage[skill2] = {};
    },
    onremove: true,
    filter(event, player) {
      return player.countCards("h", (card) => get.cardNameLength(card) > 1) > 0;
    },
    lessNameLength(card) {
      const list = [];
      const original = get.cardNameLength(card);
      for (let name of lib.inpile) {
        if (get.cardNameLength(name) >= original) continue;
        list.push([get.translation(get.type(name)), "", name]);
        if (name == "sha") {
          for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
        }
      }
      return list;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseCard("h").set("prompt2", "你可以将一张手牌视为任意小于此牌字数的一张牌。").set("prompt", "是否发动【备材】？").set("filterCard", (card) => get.cardNameLength(card) > 1).set("ai", (card) => {
        const player2 = get.player();
        if (get.cardNameLength(card) < 2) return -1;
        const less = lib.skill.beicaimrfz.lessNameLength(card).map((i) => i[2]);
        if (!Array.isArray(less.filter((i) => player2.getUseValue(i) > player2.getUseValue(card)))) return -1;
        let OptimalSolution = less.filter((i) => player2.getUseValue(i) > player2.getUseValue(card)) || null;
        if (OptimalSolution === null || OptimalSolution.length < 1) return -1;
        OptimalSolution = OptimalSolution.reduce((a, b) => player2.getUseValue(a) >= player2.getUseValue(b) ? a : b) || null;
        return OptimalSolution ? player2.getUseValue(OptimalSolution) - player2.getUseValue(card) : -1;
      }).forResult();
    },
    async content(event, trigger, player) {
      const list = lib.skill.beicaimrfz.lessNameLength(event.cards[0]);
      const { links } = await player.chooseButton([`备材<br>把${get.translation(event.cards)}视为：`, [list, "vcard"]], true).set("ai", (button) => {
        const player2 = get.player(), card = {
          name: button.link[2],
          nature: button.link[3]
        };
        return player2.getUseValue(card, null, true);
      }).forResult();
      if (!links) return;
      player.addGaintag(event.cards, "beicaimrfzx");
      if (!player.storage.beicaimrfz) player.storage.beicaimrfz = {};
      player.storage.beicaimrfz[event.cards[0].cardid] = { name: links[0][2], nature: links[0][3] };
    },
    mod: {
      cardname(card, player, name) {
        const storage = player.storage.beicaimrfz;
        if (card.hasGaintag("beicaimrfzx") && Object.keys(storage).includes(card.cardid) && storage[card.cardid]["name"])
          return storage[card.cardid]["name"];
      },
      cardnature(card, player) {
        const storage = player.storage.beicaimrfz;
        if (card.hasGaintag("beicaimrfzx") && Object.keys(storage).includes(card.cardid) && storage[card.cardid]["nature"])
          return storage[card.cardid]["nature"];
      }
    },
    group: "beicaimrfz_clear",
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        trigger: { player: "loseAfter" },
        filter(event, player) {
          return Object.keys(player.storage.beicaimrfz).length > 0;
        },
        async content(event, trigger, player) {
          const hs = player.getCards("he").map((card) => card.cardid);
          for (let id in player.storage.beicaimrfz) {
            if (!hs.includes(id)) delete player.storage.beicaimrfz[id];
          }
        }
      }
    }
  },
  "pengcaimrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard(card) {
      const player = get.player();
      return !ui.selected.cards.some((cardx) => get.type2(cardx, player) == get.type2(card, player));
    },
    selectCard: 2,
    filterTarget(card, player, target) {
      return player.canUse("wugu", target);
    },
    selectTarget: [1, 4],
    check(card) {
      return 8 - get.value(card);
    },
    complexCard: true,
    discard: false,
    lose: false,
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      player.storage.pengcaimrfz = event.targets.slice();
      await player.useCard({ name: "wugu", pengcaimrfz: true }, event.targets, event.cards, false, "pengcaimrfz");
      const store = player.storage.pengcaimrfz;
      if (!Array.isArray(store)) return;
      let type = [];
      for (let i = 0; i < store.length; i++) {
        let target = store[i][0], cards = store[i][1];
        if (!event.targets.includes(target) || !cards) continue;
        type.push(...cards.map((i2) => get.type2(i2)));
      }
      let SetType = new Set(type.slice());
      if (SetType.size !== type.length) return;
      await player.useCard({ name: "wugu", pengcaimrfz: true }, event.targets, event.cards, false, "pengcaimrfz");
      delete player.storage.pengcaimrfz;
    },
    group: ["pengcaimrfz_wugu"],
    global: "pengcaimrfz_eff",
    subSkill: {
      eff: {
        silent: true,
        charlotte: true,
        trigger: { player: "yingbian" },
        filter(event, player) {
          return event.card.isCard && event.player.hasHistory(
            "lose",
            (evt) => evt.getParent() == event && Object.values(evt.gaintag_map).some((value) => value.includes("pengcaimrfzx"))
          );
        },
        async content(event, trigger, player) {
          if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
          trigger.temporaryYingbian.add("force");
          trigger.temporaryYingbian.addArray(get.yingbianEffects());
        }
      },
      wugu: {
        silent: true,
        charlotte: true,
        lastDo: true,
        trigger: { global: "gainAfter" },
        filter(event, player) {
          const evt = event.getParent();
          return evt && evt.card && evt.card.pengcaimrfz && player.storage.pengcaimrfz && player.storage.pengcaimrfz.some((i) => Array.isArray(i) ? i[0] == event.player : i == event.player);
        },
        async content(event, trigger, player) {
          const cards = trigger.cards.filter((i) => get.itemtype(i) == "card");
          player.storage.pengcaimrfz[player.storage.pengcaimrfz.indexOf(trigger.player)] = [trigger.player, cards];
          trigger.player.addGaintag(cards, "pengcaimrfzx");
        }
      }
    },
    ai: {
      order: 13,
      threaten: 1.8,
      result: {
        target: 1,
        player: 1
      }
    }
  }
});
translate({
  "senximrfz": "森西",
  "micaimrfz": "觅材",
  "micaimrfz_info": "每回合限一次，当其他角色的牌因弃置而进入弃牌堆后，你可以获得其中一张牌。",
  "beicaimrfz": "备材",
  "beicaimrfz_info": "准备阶段，你可以将一张手牌视为任意小于此牌字数的一张牌。",
  "pengcaimrfz": "烹材",
  "pengcaimrfz_info": "出牌阶段限一次，你可以将两张不同类型的牌当作指定至多4名角色的【五谷丰登】使用，若所有角色因此获得的牌类型均不同，则视为对相同角色使用一张【五谷丰登】。因此技能而获得的牌均获得所有的应变效果且可无条件发动。"
});
characterTitle("senximrfz", "<font color='#d2691e'>资深魔物料理人</font>");
characterIntro("senximrfz", "森西是莱欧斯小队的成员之一，具有丰富的野外生存经验，对饮食有固执的坚持，在小队中担任厨师。<br>森西以为小队提供健康伙食为己任，随身携带的锅具和菜刀是用珍贵材料精制的厨具。");
//# sourceMappingURL=index.js.map
