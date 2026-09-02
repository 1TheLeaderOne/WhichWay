import { get, ui, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("wendimrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "luomrfz",
  hp: 4,
  skills: ["jiangpaomrfz", "newdanpaomrfz"]
});
skill({
  "newdanpaomrfz": {
    audio: "danpaomrfz",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he") > 0 && game.hasPlayer((current) => current != player && current.countCards("hej") > 0);
    },
    filterCard: true,
    selectCard: [1, Infinity],
    filterTarget(card, player, target) {
      if (ui.selected.targets.length === 0) return target.countCards("hje") > 0 && target !== player;
      return get.distance(ui.selected.targets[0], target) <= ui.selected.cards.length;
    },
    targetprompt: ["被移牌", "收到牌"],
    selectTarget: 2,
    position: "he",
    multitarget: true,
    multiline: true,
    check(card) {
      let player = get.player();
      if (game.hasPlayer((current) => current != player && get.attitude2(current) > 0 && current.countCards("j") > 0) && ui.selected.cards.length > 0)
        return false;
      let getTarget = get.result("newdanpaomrfz").target;
      let targets = [];
      game.players.forEach((char) => {
        if (char !== player && char.countCards("hej") > 0) {
          targets.push([char, getTarget(player, char)]);
        }
      });
      let target = [void 0, -114514];
      targets.forEach((char) => {
        if (char[1] > target[1]) target = [char[0], char[1]];
      });
      target = target[0];
      if (ui.selected.cards.length >= Math.max(target.countCards("h"), target.countCards("e"))) return false;
      return get.value(card, player) < 6;
    },
    async content(event, trigger, player) {
      const { targets } = event;
      const { links } = await player.choosePlayerCard("hej", targets[0], true, [1, event.cards.length]).set("prompt", "请选择你要移动的牌<br>（必须选择同一区域的牌）").set("filterOk", () => {
        return new Set(ui.selected.buttons.map((i) => get.position(i.link))).size === 1;
      }).set("ai", (button) => {
        let target = get.event().targets[0];
        let cards = get.event().cards;
        if (get.attitude2(target) > 0 && target.countCards("j") > 0) return target.getCards("j").includes(button.link);
        let h = target.getCards("h");
        let e = target.getCards("e");
        let sort = [h, e, cards].sort((a, b) => {
          return b.length - a.length;
        });
        sort.forEach((arr, index) => {
          if (cards.some((i) => arr.includes(i))) delete sort[index];
        });
        sort = sort.filter((arr) => arr.length > 0);
        return sort[0].includes(button.link) ? get.value(button.link, get.player()) + 10 : 0;
      }).set("targets", targets).set("cards", event.cards).forResult();
      if (!links) return;
      switch (get.position(links[0])) {
        case "h":
          targets[1].gain(links);
          targets[0].$give(links.length, targets[1]);
          break;
        case "e":
          for (let card of links) {
            if (targets[1].canEquip(card)) {
              targets[1].equip(card);
              targets[0].$give(card, targets[1]);
            } else {
              targets[0].discard(card);
            }
          }
          break;
        case "j":
          for (let card of links) {
            if (!card.cards?.length) targets[0].removeVirtualJudge(card);
            targets[1].addJudge(card, card?.cards);
          }
          break;
      }
    },
    ai: {
      order: 8,
      threaten: 1.5,
      result: {
        target(player, target) {
          let att = get.attitude(player, target);
          if (ui.selected.targets.length === 0) {
            if (target.countCards("j") > 0 && att > 0) return 100;
            return att - target.countCards("hej");
          } else {
            let last = ui.selected.targets[0];
            if (last.countCards("j") > 0 && att > 0) return -1;
            return att > 0 ? 1 : 0;
          }
        }
      }
    }
  },
  "jiangpaomrfz": {
    audio: "shuipaomrfz",
    frequent: true,
    trigger: { player: "phaseDrawBegin2" },
    filter(event, player) {
      return !event.numFixed;
    },
    async content(event, trigger, player) {
      trigger.num += ["h", "e", "j"].filter((pos) => player.countCards(pos) > 0).length;
    },
    ai: {
      threaten: 1.5
    }
  }
});
translate({
  "wendimrfz": "温蒂",
  "newdanpaomrfz": "氮炮",
  "newdanpaomrfz_info": "出牌阶段限一次，你可以弃置X张牌并选择一名其他角色，然后你选择将其一个区域中的X张牌移至与其距离不大于X的一名角色的对应区域内。",
  "jiangpaomrfz": "匠炮",
  "jiangpaomrfz_info": "摸牌阶段，你可以额外摸等同于你有牌的区域数张牌。"
});
characterIntro("wendimrfz", "温蒂，生物工程学专家，伊比利亚科研世家出身，罗德岛成立之初就加入的研究者。</br>经过本人长期调整与测试，最终完成了为自己量身定做的武器。并根据自身意愿成为干员，在战场上为同僚提供远程支援。");
