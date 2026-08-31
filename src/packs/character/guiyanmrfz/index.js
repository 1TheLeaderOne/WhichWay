import { get, lib, _status, game, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("guiyanmrfz", {
  sex: "female",
  group: "yimrfz",
  hp: 3,
  skills: ["qiyimrfz", "guiyaomrfz", "xiadumrfz"]
});
skill({
  "qiyimrfz": {
    audio: 2,
    enable: ["phaseUse", "chooseToUse"],
    usable: 1,
    hiddenCard: function(player, name) {
      let event = get.event();
      event.getParent("phaseUse");
      if (player.countCards("he") < 1 || _status.currentPhase == player) return false;
      if (name != "tao") return false;
      return true;
    },
    filter(event, player) {
      let evt = event.getParent("phaseUse");
      if (player.countCards("he") < 1) return false;
      if (evt && evt.player == player) return true;
      else {
        return event.filterCard({ name: "tao", isCard: true }, player, event) && _status.currentPhase != player;
      }
    },
    filterTarget(card, player, target) {
      return target.getDamagedHp() > 0;
    },
    filterCard: true,
    selectTarget() {
      return [1, Infinity];
    },
    selectCard() {
      return [1, Infinity];
    },
    filterOk() {
      let player = get.player();
      if (_status.auto || !player.isUnderControl(true)) return true;
      return ui.selected.cards.length === ui.selected.targets.length;
    },
    position: "he",
    discard: false,
    lose: false,
    multitarget: true,
    multiline: true,
    check(card) {
      return lib.skill.qiyimrfz.getResult(get.player()) === false ? false : true;
    },
    getResult(player) {
      let cards = player.getCards("h");
      if (!player.hasSkill("guiyaomrfz")) {
        let choiceCards = cards.filter((card) => 6 - get.value(card));
        let choiceTargets = player.getFriends().filter((i) => i.getDamagedHp() > 0);
        if (choiceCards.length !== choiceTargets.length) {
          if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets);
          else choiceTargets = choiceTargets.slice(0, choiceCards);
        }
        if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
        return {
          targets: choiceTargets,
          cards: choiceCards
        };
      } else {
        if (game.countPlayer((current) => get.attitude2(current) > 2 && current.getDamagedHp() > 0) > 1) {
          let choiceCards = cards.filter((card) => 8 - get.value(card) && get.color(card) === "red");
          let choiceTargets = player.getFriends().filter((i) => i.getDamagedHp() > 0).sort((i, j) => j.hp - i.hp);
          if (choiceCards.length !== choiceTargets.length) {
            if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets.length);
            else choiceTargets = choiceTargets.slice(0, choiceCards.length);
          }
          if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
          return {
            targets: choiceTargets,
            cards: choiceCards
          };
        } else {
          let choiceCards = cards.filter((card) => 6 - get.value(card));
          let choiceTargets = player.getEnemies().filter((i) => i.getDamagedHp() > 0);
          choiceCards = choiceCards.sort((i, j) => get.value(i) - get.value(j));
          if (choiceCards.length !== choiceTargets.length) {
            if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets.length);
            else choiceTargets = choiceTargets.slice(0, choiceCards.length);
          }
          if (choiceCards.every((i) => get.color(i) === "red")) {
            let lowValueRed = choiceCards[0];
            let lowValueOther = cards.filter((card) => 6 - get.value(card) && get.color(card) !== "red").sort((i, j) => get.value(i) - get.value(j));
            if (lowValueOther.length === 0) return false;
            choiceCards = [lowValueRed, lowValueOther[0]];
          }
          if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
          return {
            targets: choiceTargets,
            cards: choiceCards
          };
        }
      }
    },
    async content(event, trigger, player) {
      if (!player.isUnderControl(true) || _status.auto) {
        let result = lib.skill.qiyimrfz.getResult(player);
        player.useCard({ name: "tao" }, result.targets, result.cards);
      } else {
        let targets = event.targets;
        let cards = event.cards;
        player.useCard({ name: "tao" }, targets, cards);
      }
    },
    ai: {
      order: 8,
      result: {
        player: 1,
        target(player, target) {
          if (!player.hasSkill("guiyaomrfz")) return 1;
          let result = lib.skill.qiyimrfz.getResult(player);
          if (result === false) return 0;
          let att = get.attitude2(lib.skill.qiyimrfz.getResult(player).targets[0]);
          return att > 2 ? 1 : -1;
        }
      }
    }
  },
  "guiyaomrfz": {
    audio: 2,
    trigger: {
      global: "recoverBegin"
    },
    filter(event, player) {
      return event.cards && event.cards.length > 0 && event.source && event.source === player;
    },
    forced: true,
    async content(event, trigger, player) {
      const cards = trigger.cards;
      let target = trigger.player;
      target.addTempSkill("guiyaomrfz_eff", { player: "phaseEnd" });
      if (cards.every((card) => get.color(card) === "red")) {
        if (!target.storage.guiyaomrfz_eff) target.storage.guiyaomrfz_eff = 0;
        target.storage.guiyaomrfz_eff++;
      } else {
        if (!target.storage.guiyaomrfz_eff) target.storage.guiyaomrfz_eff = 0;
        target.storage.guiyaomrfz_eff--;
        target.loseHp(2);
      }
    },
    subSkill: {
      eff: {
        silent: true,
        charlotte: true,
        mark: true,
        intro: {
          content(event, player) {
            let num = player.storage.guiyaomrfz_eff;
            if (num === 0) return `无效果`;
            return `额定摸牌数、手牌上限、使用牌的次数和攻击范围${num > 0 ? "+" : ""}${num}`;
          }
        },
        onremove(player) {
          delete player.storage.guiyaomrfz_eff;
        },
        trigger: {
          player: "phaseDrawBegin2"
        },
        filter(event, player) {
          return !event.numFixed && player.storage.guiyaomrfz_eff != 0;
        },
        async content(event, trigger, player) {
          trigger.num += player.storage.guiyaomrfz_eff;
        },
        mod: {
          maxHandcard: function(player, num) {
            return num += player.storage.guiyaomrfz_eff;
          },
          cardUsable(card, player, num) {
            return num += player.storage.guiyaomrfz_eff;
          },
          attackRange: function(player, num) {
            return num += player.storage.guiyaomrfz_eff;
          }
        }
      }
    }
  },
  "xiadumrfz": {
    audio: 2,
    forced: true,
    trigger: {
      global: "roundStart"
    },
    firstDo: true,
    async content(event, trigger, player) {
      let cards = player.getCards("h", (card) => card.hasGaintag("xiadumrfz"));
      if (cards) await player.discard(cards);
      await player.changeHujia(-1);
      const result = await player.draw(2).forResult();
      if (!result.cards) return;
      player.addGaintag(result.cards, "xiadumrfz");
      player.changeHujia(1);
    }
  }
});
translate({
  "guiyanmrfz": "瑰盐",
  "qiyimrfz": "奇医",
  "qiyimrfz_info": "每回合限一次，出牌阶段，或于回合外你需要使用【桃】时，你可以将任意张牌当作【桃】对等量角色使用。",
  "guiyaomrfz": "诡药",
  "guiyaomrfz_info": "锁定技，当一名角色因你使用的实体牌而回复体力时，若此牌颜色[为红/不为红]，其下一回合额定摸牌数、手牌上限、使用牌的次数和攻击范围[+1/-1，且其流失两点体力]。",
  "xiadumrfz": "黠度",
  "xiadumrfz_info": "锁定技，每轮开始时，你失去一点护甲并弃置因此获得的牌，然后你摸两张牌并获得一点护甲。"
});
characterTitle("guiyanmrfz", "<font color='#b8860b'>狡黠医生</font>");
characterIntro("guiyanmrfz", "瑰盐，伊比利亚地区的流浪草药医生，人脉资源丰富，涵盖当地各阶层人士，现为罗德岛提供伊比利亚相关情报及工作开展前期的调研支持。");
//# sourceMappingURL=index.js.map
