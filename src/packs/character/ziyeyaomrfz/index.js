import { game, ui, get, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("ziyeyaomrfz", {
  sex: "female",
  group: "dongmrfz",
  hp: 3,
  skills: ["youlinmrfz", "miaomengmrfz", "fuyingmrfz"]
});
skill({
  "youlinmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable(skill2, player) {
      return player.hasSkill("youlinmrfz_addCount") ? 2 : 1;
    },
    filterCard: true,
    selectCard: [0, 3],
    filterTarget: true,
    selectTarget: [1, 3],
    discard: false,
    lose: false,
    delay: 0,
    multitarget: true,
    multiline: true,
    check(card) {
      if (ui.selected.cards.length < 1) return true;
      let num = 0;
      for (let i of ["type2", "number", "suit"]) {
        if (!isInclude(i)) {
          num++;
        }
      }
      return num;
      function isInclude(method) {
        return ui.selected.cards.map((cardx) => get[method](cardx)).includes(get[method](card));
      }
    },
    async content(event, trigger, player) {
      let { cards, targets } = event, pileCards = [], showCards = [];
      let duplicateRemove = (arr, method) => Array.from(new Set(arr.map((card) => get[method](card))));
      if (cards.length < 3) pileCards.push(...get.cards(3 - cards.length));
      showCards = [...cards, ...pileCards];
      let execute = [];
      if (duplicateRemove(showCards, "number").length === 3) execute.push("number");
      if (duplicateRemove(showCards, "suit").length === 3) execute.push("suit");
      if (duplicateRemove(showCards, "type2").length === 3) execute.push("type");
      let num = execute.length;
      let tips = {
        number: "<font color='red'>点数均不同</font>",
        suit: "<font color='yellow'>花色均不同</font>",
        type: "<font color='green'>类型均不同</font>"
      };
      let str = [];
      for (let i of execute) {
        str.push(tips[i]);
      }
      await player.showCards(showCards, `${get.translation(player)}【游鳞】展示的牌<br>${str.join("<br>")}`);
      game.delay(2);
      if (num > 0) {
        for (let name of execute) {
          switch (name) {
            case "number":
              targets.forEach((t) => t.changeHujia());
              break;
            case "suit":
              targets.forEach((t) => t.draw(num));
              break;
            case "type":
              player.addTempSkill("youlinmrfz_addCount", { player: ["phaseUseEnd", "phaseEnd"] });
              break;
          }
        }
      }
      if (num - cards.length > 0) targets.forEach((t) => t.addMark("fuyingmrfz", num - cards.length));
    },
    ai: {
      order: 13,
      result: {
        player: 1,
        target: 1
      }
    },
    subSkill: {
      addCount: {
        charlotte: true,
        silent: true
      }
    }
  },
  "miaomengmrfz": {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    prompt(event, player) {
      let num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
      return `【渺梦】:你可以观看牌堆顶${num}张牌，并可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中，然后你获得等同与你插入的牌的数量的个“沫”标记。`;
    },
    async content(event, trigger, player) {
      const num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
      let suits = [...lib.suit], types = ["basic", "trick", "equip"];
      let outCards = [];
      let pileCards = get.cards(num);
      for (let type of types) {
        let name = lib.inpile.filter((n) => get.type2(n) === type).randomGet();
        let suit = suits.randomGet();
        suits.remove(suit);
        outCards.push(game.createCard(name, suit, [1, 3, 5, 8, 12].randomGet()));
      }
      let { moved } = await player.chooseToMove().set("list", [
        ["牌堆顶", pileCards],
        ["游戏外的牌", outCards]
      ]).set("prompt", `你可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中`).set("filterMove", (from, to, moved2) => {
        let pile = get.event().pileCards;
        let fakeMoved = [moved2[0].slice(), moved2[1].slice()];
        if (typeof to !== "number") {
          let fromPos = findElementPosition(fakeMoved, from.link);
          let toPos = findElementPosition(fakeMoved, to.link);
          if (fromPos && toPos) {
            [fakeMoved[fromPos.arrayIndex][fromPos.elementIndex], fakeMoved[toPos.arrayIndex][toPos.elementIndex]] = [
              fakeMoved[toPos.arrayIndex][toPos.elementIndex],
              fakeMoved[fromPos.arrayIndex][fromPos.elementIndex]
            ];
          }
        } else {
          if (fakeMoved[0].includes(from.link)) fakeMoved[0].remove(from.link);
          if (fakeMoved[1].includes(from.link)) fakeMoved[1].remove(from.link);
          fakeMoved[to].push(from.link);
        }
        let adjusted = fakeMoved[0].filter((card) => pile.includes(card));
        return JSON.stringify(pile) === JSON.stringify(adjusted);
        function findElementPosition(arrays, element) {
          for (let i = 0; i < arrays.length; i++) {
            let index = arrays[i].indexOf(element);
            if (index !== -1) {
              return { arrayIndex: i, elementIndex: index };
            }
          }
          return null;
        }
      }).set("filterOk", () => {
        let outs = get.event().outCards;
        let buttons = Array.from(get.event().buttonss[0].children).concat(Array.from(get.event().buttonss[1].children));
        buttons.forEach((button) => {
          let link = button.link;
          if (!outs.includes(link)) {
            let tag = button.querySelector(".info");
            if (tag) tag.innerHTML = "不可改变顺序";
          }
        });
        return true;
      }).set("processAI", (list) => {
        get.event().player;
        let pile = [...list[0][1]];
        let outs = [...list[1][1]];
        for (let card of outs) {
          let insertIndex = pile.findIndex((cardx) => get.value(cardx) < get.value(card));
          if (insertIndex === -1) {
            pile.push(card);
          } else {
            pile.insert(insertIndex, card, false);
          }
        }
        let moved2 = [pile, outs];
        return moved2;
      }).set("outCards", outCards).set("pileCards", pileCards).forResult();
      if (!moved) return;
      let top = moved[0];
      let count = top.length - pileCards.length;
      player.addMark("fuyingmrfz", count);
      top.reverse();
      for (let i = 0; i < top.length; i++) {
        ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
      }
      game.log(player, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
      game.updateRoundNumber();
      game.delayx();
    }
  },
  "fuyingmrfz": {
    forced: true,
    audio: 2,
    mark: true,
    marktext: "沫",
    intro: {
      name: "沫",
      content: '有#个“沫”标记<br><span style="color:rgb(138,43,226);font-family:yuanli">人生五十年，如梦亦如幻。</span>'
    },
    trigger: {
      global: "dying"
    },
    filter(event, player) {
      return event.player.isAlive() && event.player.hasMark("fuyingmrfz");
    },
    async content(event, trigger, player) {
      player.$fullscreenpop("泡泡破裂了...", "thunder");
      for (let target of game.players.sortBySeat(trigger.player).filter((c) => c.hasMark("fuyingmrfz"))) {
        const { bool } = target.countMark("fuyingmrfz") > target.countCards("he") ? { bool: false } : await target.chooseToDiscard("he").set("filterCard", (card) => {
          let cards = ui.selected.cards;
          if (cards.length > 1) {
            return cards.every((cardx) => get.suit(card) !== get.suit(cardx));
          }
          return true;
        }).set("ai", (card) => {
          return Math.abs(get.value(card, player) - 1e4);
        }).set("complexCard", true).set("selectCard", target.countMark("fuyingmrfz")).set(
          "prompt",
          `请弃置${target.countMark("fuyingmrfz")}张花色不同的牌或失去${target.countMark("fuyingmrfz")}点体力`
        ).forResult();
        if (bool === false) target.loseHp(target.countMark("fuyingmrfz"));
        target.removeMark("fuyingmrfz", target.countMark("fuyingmrfz"));
      }
    },
    ai: {
      neg: true
    }
  }
});
translate({
  "ziyeyaomrfz": "紫野遥",
  "youlinmrfz": "游鳞",
  "youlinmrfz_info": "出牌阶段限一次，你可以展示M张手牌并展示N张牌堆顶的牌（M+N=3），选择至多三名角色，然后根据你展示的牌这些角色执行对应的选项并获得X-M个“沫”标记：<br>1.点数均不同：获得一点护甲;<br>2.花色均不同：摸X张牌;<br>3.类型均不同：本技能本阶段改成“出牌阶段限两次”。（X=执行的选项数）",
  "miaomengmrfz": "缈梦",
  "miaomengmrfz_info": "准备阶段，你可以观看牌堆顶Y张牌，并可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中，然后你获得等同与你插入的牌的数量的个“沫”标记。(Y=场上“沫”标记的数量,Y∈[1,5])",
  "fuyingmrfz": "浮影",
  "fuyingmrfz_info": "锁定技，当有角色进入濒死状态时，若其有“沫”标记，则所有有沫标记的角色须弃置Z张花色不同的牌或失去Z点体力，然后其移除所有的“沫”标记。（Z=该角色“沫”标记的数量）"
});
characterTitle("ziyeyaomrfz", "<font color = red>浮生若梦</font>");
characterIntro("ziyeyaomrfz", "紫野遥，在东国南院有相当名气的艺人。艺名羽生萌萌香。受干员星熊推荐，与罗德岛签订合约，负责罗德岛与东国的交流工作。鉴于本人的要求，也会参与一部分外勤任务。");
//# sourceMappingURL=index.js.map
