import { get, _status, game, ui, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("mowangmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "luomrfz",
  hp: 3,
  skills: ["duanzhangmrfz", "chenaimrfz", "canxiangmrfz"]
});
skill({
  "duanzhangmrfz": {
    intro: {
      mark: function(dialog, storage, player) {
        var players = player.storage.duanzhangmrfz.slice().filter((target) => target != player);
        if (players && players.length > 0) {
          dialog.addAuto("这一次我不会离开了...");
          players = players.map((i) => i.name);
          dialog.addSmall([players, "character"]);
        } else return "没有【断章】角色";
      }
    },
    audio: 2,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    onremove: true,
    filter: function(event, player) {
      return game.hasPlayer((current) => current != player) && (event.name != "phase" || game.phaseNumber == 0);
    },
    async content(event, trigger2, player) {
      const { targets } = await player.chooseTarget(true).set("prompt", `【断章】:请选择【断章】目标`).set("filterTarget", lib.filter.notMe).set("ai", (target2) => {
        var att = get.attitude(_status.event.player, target2);
        if (att > 0) return att + 1;
        if (att == 0) return Math.random();
        return att;
      }).forResult();
      if (!targets) return;
      var target = targets[0];
      if (!player.storage.duanzhangmrfz) player.storage.duanzhangmrfz = [];
      if (!target.storage.duanzhangmrfz) target.storage.duanzhangmrfz = [];
      player.storage.duanzhangmrfz.addArray([target, player]);
      target.storage.duanzhangmrfz.addArray([target, player]);
      player.markSkill("duanzhangmrfz");
      player.line(target);
      for (var i of player.storage.duanzhangmrfz) {
        if (i != player) i.addSkill("canxiangmrfz_nodelay");
        i.addSkill("duanzhangmrfz_eff1");
      }
    },
    group: ["duanzhangmrfz_clear"],
    subSkill: {
      clear: {
        silent: true,
        charlotte: true,
        trigger: { global: "dieAfter" },
        forceDie: true,
        filter(event, player) {
          return event.player.hasSkill("duanzhangmrfz_eff1");
        },
        content() {
          for (var i of game.players) {
            if (!i.storage.duanzhangmrfz) continue;
            if (i.storage.duanzhangmrfz.includes(trigger.player)) i.storage.duanzhangmrfz.remove(trigger.player);
          }
        }
      },
      eff1: {
        silent: true,
        charlotte: true,
        trigger: {
          global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "duanzhangmrfzAfter"]
        },
        filter(event, player) {
          return (player.storage.duanzhangmrfz && player.storage.duanzhangmrfz.length > 1) ^ Number(player.hasSkill("duanzhangmrfz_group"));
        },
        async content(event, trigger2, player) {
          if (player.storage.duanzhangmrfz && player.storage.duanzhangmrfz.length > 1) {
            var cards = [], target = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            if (!target) return;
            for (var i of target.storage.duanzhangmrfz) {
              if (i.countCards("h") == 0) continue;
              if (i == player) continue;
              for (var j of i.getCards("h")) cards.push(j);
            }
            var cardsx = cards.map((card) => {
              var cardx = ui.create.card();
              cardx.init(get.cardInfo(card));
              cardx._cardid = card.cardid;
              return cardx;
            });
            if (cardsx.length < 1) return;
            player.directgains(cardsx, null, "duanzhangmrfz");
            player.addSkill("duanzhangmrfz_group");
          } else player.removeSkill("duanzhangmrfz_group");
        }
      },
      group: {
        charlotte: true,
        group: ["duanzhangmrfz_eff_use", "duanzhangmrfz_eff_lose"],
        trigger: {
          global: ["addJudgeAfter", "gainAfter", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
        },
        forced: true,
        silent: true,
        filter: function(event, player) {
          if (event.name == "gain") return event.cards.length;
          var cards = event.getd();
          return cards.length;
        },
        onremove: function(player) {
          var cards2 = player.getCards("s", (card) => {
            return card.hasGaintag("duanzhangmrfz");
          });
          if (player.isOnline2()) {
            player.send(
              function(cards, player2) {
                cards.forEach((i) => i.delete());
                if (player2 == game.me) ui.updatehl();
              },
              cards2,
              player
            );
          }
          cards2.forEach((i) => i.delete());
          if (player == game.me) ui.updatehl();
        },
        async content(event, trigger2, player) {
          var cards = [];
          var idList = player.getCards("s", (card) => card.hasGaintag("duanzhangmrfz")).map((i2) => i2._cardid);
          var target = game.findPlayer((current) => {
            return player.storage.duanzhangmrfz.includes(current);
          });
          for (var i of target.storage.duanzhangmrfz) {
            if (i.countCards("h") == 0) continue;
            if (i == player) continue;
            for (var j of i.getCards("h")) {
              if (idList.includes(j.cardid)) continue;
              cards.push(j);
            }
          }
          var cards2 = cards.map((card) => {
            var cardx = ui.create.card();
            cardx.init(get.cardInfo(card));
            cardx._cardid = card.cardid;
            return cardx;
          });
          player.directgains(cards2, null, "duanzhangmrfz");
        }
      },
      eff_use: {
        trigger: {
          player: ["useCardBefore", "respondBefore"]
        },
        charlotte: true,
        forced: true,
        popup: false,
        firstDo: true,
        filter: function(event, player) {
          var cards = player.getCards("s", (card) => card.hasGaintag("duanzhangmrfz") && card._cardid);
          return event.cards && event.cards.some((card) => {
            return cards.includes(card);
          });
        },
        async content(event, trigger2, player) {
          var idList = player.getCards("s", (card2) => card2.hasGaintag("duanzhangmrfz")).map((i2) => i2._cardid);
          var cards = [];
          var target = game.findPlayer((current) => {
            return player.storage.duanzhangmrfz.includes(current);
          });
          for (var i of target.storage.duanzhangmrfz) {
            if (i.countCards("h") == 0) continue;
            if (i == player) continue;
            for (var j of i.getCards("h")) {
              if (!idList.includes(j.cardid)) continue;
              cards.push(j);
            }
          }
          var cards2 = [];
          for (var card of trigger2.cards) {
            var cardx = cards.find((cardx2) => cardx2.cardid == card._cardid);
            if (cardx) cards2.push(cardx);
          }
          var cards3 = trigger2.cards.slice();
          trigger2.cards = cards2;
          trigger2.card.cards = cards2;
          if (player.isOnline2()) {
            player.send(
              function(cards4, player2) {
                cards4.forEach((i2) => i2.delete());
                if (player2 == game.me) ui.updatehl();
              },
              cards3,
              player
            );
          }
          cards3.forEach((i2) => i2.delete());
          if (player == game.me) ui.updatehl();
        }
      },
      eff_lose: {
        trigger: {
          global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "cardsGotoOrderingBegin"]
        },
        charlotte: true,
        forced: true,
        popup: false,
        firstDo: true,
        filter: function(event, player) {
          var idList = player.getCards("s", (card) => card.hasGaintag("duanzhangmrfz")).map((i) => i._cardid);
          return event.cards && event.cards.some((card) => {
            return idList.includes(card.cardid);
          });
        },
        async content(event, trigger2, player) {
          var cards2;
          var idList = [];
          var target = game.findPlayer((current) => {
            return player.storage.duanzhangmrfz.includes(current);
          });
          for (var i of target.storage.duanzhangmrfz) {
            if (i.countCards("h") == 0) continue;
            if (i == player) continue;
            for (var j of i.getCards("h")) {
              idList.add(j.cardid);
            }
          }
          cards2 = player.getCards("s", (card) => {
            return card.hasGaintag("duanzhangmrfz") && !idList.includes(card._cardid);
          });
          if (player.isOnline2()) {
            player.send(
              function(cards, player2) {
                cards.forEach((i2) => i2.delete());
                if (player2 == game.me) ui.updatehl();
              },
              cards2,
              player
            );
          }
          cards2.forEach((i2) => i2.delete());
          if (player == game.me) ui.updatehl();
        }
      }
    }
  },
  "chenaimrfz": {
    audio: 2,
    trigger: {
      player: ["useCardAfter", "respondAfter"]
    },
    direct: true,
    filter: function(event, player) {
      if (_status.currentPhase != player) return false;
      if (player.getHistory("custom", function(evt) {
        return evt.chenaimrfz_type == get.type2(event.card);
      }).length > 0)
        return false;
      return event.cards.filterInD().length > 0;
    },
    async content(event, trigger2, player) {
      const { targets } = await player.chooseTarget(
        get.prompt("chenaimrfz"),
        "将" + get.translation(trigger2.cards) + "交给一名其他角色",
        function(card, player2, target) {
          return target != player2;
        }
      ).set("ai", function(target) {
        if (target.hasJudge("lebu")) return 0;
        let att = get.attitude(_status.event.player, target), name = _status.event.cards[0].name;
        if (att < 3) return 0;
        if (_status.event.player.storage.duanzhangmrfz && _status.event.player.storage.duanzhangmrfz.includes(target) && att > 0)
          att += 10;
        if (target.hasSkillTag("nogain")) att /= 10;
        if (name === "sha" && target.hasSha()) att /= 5;
        if (name === "wuxie" && target.needsToDiscard(_status.event.cards)) att /= 5;
        return att / (1 + get.distance(player, target, "absolute"));
      }).set("cards", trigger2.cards).forResult();
      if (!targets) return;
      player.logSkill("chenaimrfz", targets[0]);
      targets[0].gain(trigger2.cards.filterInD(), "gain2");
      player.getHistory("custom").push({ chenaimrfz_type: get.type2(trigger2.card) });
      if (player.storage.duanzhangmrfz && player.storage.duanzhangmrfz.includes(targets[0])) targets[0].draw();
    }
  },
  "canxiangmrfz": {
    mod: {
      targetEnabled: function(card, player, target) {
        if (get.type(card) == "delay") {
          return false;
        }
      }
    },
    audio: 2,
    forced: true,
    trigger: { global: "damageBegin4" },
    filter(event, player) {
      var storage = player.storage.duanzhangmrfz;
      if (event.player != player && (!storage || !storage.includes(event.player))) return false;
      return event.hasNature();
    },
    async content(event, trigger2, player) {
      trigger2.cancel();
    },
    group: "canxiangmrfz_die",
    subSkill: {
      die: {
        silent: true,
        charlotte: true,
        trigger: { player: "dieAfter" },
        firstDo: true,
        forceDie: true,
        async content(event, trigger2, player) {
          var storage = player.storage.duanzhangmrfz;
          for (var i of storage) {
            if (!i.storage.duanzhangmrfz) continue;
            if (i.storage.duanzhangmrfz.length <= 2) i.removeSkill("canxiangmrfz_nodelay");
            else i.storage.duanzhangmrfz.remove(player);
          }
        }
      },
      nodelay: {
        mark: true,
        intro: {
          content: "属性伤害无效；无法成为延时锦囊牌的目标"
        },
        mod: {
          targetEnabled: function(card, player, target) {
            if (get.type(card) == "delay") {
              return false;
            }
          }
        },
        ai: {
          nofire: true,
          nothunder: true,
          effect: {
            target(card, player, target, current) {
              if (get.tag(card, "natureDamage")) {
                return "zeroplayertarget";
              }
              if (get.type(card) == "trick" && get.tag(card, "damage")) {
                return "zeroplayertarget";
              }
            }
          }
        }
      }
    },
    ai: {
      nofire: true,
      nothunder: true,
      effect: {
        target(card, player, target, current) {
          if (get.tag(card, "natureDamage")) {
            return "zeroplayertarget";
          }
          if (get.type(card) == "trick" && get.tag(card, "damage")) {
            return "zeroplayertarget";
          }
        }
      }
    }
  }
});
translate({
  "mowangmrfz": "魔王",
  "duanzhangmrfz": "断章",
  "duanzhangmrfz_info": "锁定技，游戏开始时，你选择一名其他角色，[ 你/其 ]可以如手牌般使用[ 其/你 ]的手牌。",
  "chenaimrfz": "尘埃",
  "chenaimrfz_info": "每回合每种类型的牌限一次，当你使用或打出的一张普通锦囊或基本牌结算完毕后，你可以将此牌交给一名其他角色，若该角色是你【断章】选择的角色，其摸一张牌。",
  "canxiangmrfz": "残响",
  "canxiangmrfz_info": "锁定技，你和【断章】选择的角色获得如下效果：<br>1.属性伤害对你无效；<br>2.你不能成为延时锦囊牌的目标。"
});
characterTitle("mowangmrfz", "<font color=#00868B>文明的存续</font>");
characterIntro("mowangmrfz", "特蕾西娅，卡兹戴尔移动城市的建立者，卡兹戴尔军事委员会创始人之一，巴别塔组织的创立者，曾是卡兹戴尔的最高领袖。执政期间，她致力于推进医疗、教育、城市基础建设等事业，多次带领萨卡兹击退了外敌的入侵，并且在外交工作中颇有建树。后于卡兹戴尔与维多利亚的战争中身亡。<br>该人事档案留存在罗德岛人事部封存的资料库中。");
