import { game, get, _status, lib, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("kelisitengmrfz", {
  sex: "female",
  group: "lymrfz",
  hp: 4,
  skills: ["xingtumrfz", "poqiongmrfz"]
});
skill({
  "xingtumrfz": {
    mark: true,
    intro: {
      // @ts-ignore
      content: function(event, player2) {
        var show = {
          handlit: [],
          draw: [],
          sha: [],
          recover: []
        };
        for (var i = 0; i < game.players.length; i++) {
          var player2 = game.players[i];
          if (!player2.storage.xingtumrfz) continue;
          if (player2.storage.xingtumrfz.includes("手牌上限+1")) {
            show.handlit.push(player2);
          }
          if (player2.storage.xingtumrfz.includes("额定摸牌数+1")) {
            show.draw.push(player2);
          }
          if (player2.storage.xingtumrfz.includes("使用【杀】的次数+1")) {
            show.sha.push(player2);
          }
          if (player2.storage.xingtumrfz.includes("将手牌和体力值补至体力上限")) {
            show.recover.push(player2);
          }
        }
        return "【星途】已选择选项的角色</br>手牌上限:" + get.translation(show.handlit) + "</br>额定摸牌:" + get.translation(show.draw) + "</br>使用【杀】:" + get.translation(show.sha) + "</br>补牌和体力:" + get.translation(show.recover);
      }
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    // @ts-ignore
    filter: function(event, player2) {
      return player2.countCards("he") > 0;
    },
    selectTarget: [0, 2],
    // @ts-ignore
    filterTarget: function(card, player2, target) {
      return target != player2 && target.countCards("he") > 0;
    },
    multitarget: true,
    multiline: true,
    // @ts-ignore
    async content(event, trigger2, player2) {
      var cardx;
      const targets = event.targets.add(player2);
      const cards2 = [];
      for (var i of targets) {
        const result = await i.chooseCard("【星途】:你可以重铸一张牌", "he", lib.filter.cardRecastable).set("ai", function(card) {
          return 8 - get.value(card);
        }).forResult();
        if (result.cards) {
          if (i != player2) {
            cards2.push(result.cards[0]);
          } else {
            cardx = result.cards[0];
          }
          i.recast(result.cards);
        }
      }
      if (targets.length > 1 && cards2.filter((q) => get.color(q) == get.color(cardx)).length >= cards2.length / 2) {
        for (var targety of targets) {
          var list = [], compare = ["手牌上限+1", "额定摸牌数+1", "使用【杀】的次数+1", "将手牌和体力值补至体力上限"];
          if (!targety.storage.xingtumrfz) targety.storage.xingtumrfz = [];
          for (var i of compare) {
            if (!targety.storage.xingtumrfz.includes(i)) {
              list.push(i);
            }
          }
          if (list.length) {
            const result1 = await targety.chooseControl(list).set("prompt", "【星途】:请选择一项").set("ai", () => {
              if (list.includes("将手牌和体力值补至体力上限") && targety.getDamagedHp() * 2 + targety.getHandcardLimit() - targety.countCards("h") >= 5) {
                return "将手牌和体力值补至体力上限";
              }
              if (list.includes("额定摸牌数+1")) return "额定摸牌数+1";
              return ["手牌上限+1", "使用【杀】的次数+1"].randomGet();
            }).forResult();
            if (result1.control) {
              targety.storage.xingtumrfz.add(result1.control);
              game.log(targety, "选择了", result1.control);
              if (result1.control == "手牌上限+1") targety.addSkill("xingtumrfz_handlit");
              if (result1.control == "使用【杀】的次数+1") targety.addSkill("xingtumrfz_sha");
              if (result1.control == "额定摸牌数+1") targety.addSkill("xingtumrfz_draw");
              if (result1.control == "将手牌和体力值补至体力上限") {
                targety.drawTo(targety.maxHp);
                targety.recoverTo(targety.maxHp);
              }
            }
          }
        }
      }
    },
    subSkill: {
      handlit: {
        charlotte: true,
        mod: {
          // @ts-ignore
          maxHandcard: function(player2, num) {
            return num + 1;
          }
        }
      },
      draw: {
        charlotte: true,
        forced: true,
        lastDo: true,
        trigger: { player: "phaseDrawBegin2" },
        content: function() {
          trigger.num++;
        }
      },
      sha: {
        charlotte: true,
        mod: {
          // @ts-ignore
          cardUsable: function(card, player2, num) {
            if (card.name == "sha") return num + 1;
          }
        }
      }
    },
    ai: {
      order: 13,
      expose: 0.1,
      result: {
        player: 1,
        target: 1
      }
    }
  },
  "poqiongmrfz": {
    audio: 2,
    derivation: ["xingyoumrfz", "jiexiangmrfz"],
    enable: "phaseUse",
    limited: true,
    skillAnimation: "epic",
    animationColor: "thunder",
    mark: true,
    intro: {
      content: "limited"
    },
    init: (player2, skill2) => player2.storage[skill2] = false,
    // @ts-ignore
    filter: function(event, player2) {
      return player2.storage.poqiongmrfz == false;
    },
    async content(event, trigger2, player2) {
      let result;
      event.lose = 0;
      event.num = 0;
      event.showed = [];
      event.pd = [];
      player2.storage.poqiongmrfz = true;
      while (event.num < 6) {
        result = await player2.chooseCard("he", (card) => {
          return !event.showed.includes(card);
        }).forResult();
        if (result.cards && result.cards.length) {
          const cards1 = game.cardsGotoOrdering(get.cards(1)).cards;
          const cards2 = result.cards[0];
          player2.showCards(cards2, get.translation(player2) + "展示的牌</br>点数为:" + cards2.number);
          player2.showCards(cards1, "牌堆顶的牌</br>点数为:" + cards1[0].number);
          event.showed.push(cards2);
          event.pd.push(cards1[0]);
          if (cards1?.[0].number > cards2.number) {
            player2.loseMaxHp();
            event.lose++;
            player2.popup("失败：" + event.lose);
          }
          game.cardsDiscard(cards1);
        } else {
          const cards1 = game.cardsGotoOrdering(get.cards(1)).cards;
          player2.showCards(cards1, "牌堆顶的牌</br>点数为:" + cards1[0].number);
          game.cardsDiscard(cards1);
          player2.loseMaxHp();
          event.lose++;
        }
        event.num++;
      }
      if (event.lose < 3) {
        let num = Math.random();
        if (get.isLuckyStar(player2)) num = 0.1;
        if (num < 0.2 && lib.config.FTLmrfz !== true) {
          ui.backgroundMusic.src = lib.assetURL + "extension/WhichWay/audio/BGM/fasterthanlight.mp3";
        }
        player2.removeSkill("xingtumrfz");
        player2.addSkill("xingyoumrfz");
        player2.addSkill("jiexiangmrfz");
        player2.gainMaxHp(3);
        player2.recoverTo(player2.maxHp);
        await player2.gain(event.pd, "gain2");
      } else {
        player2.popup("失败");
      }
    },
    ai: {
      order: 12,
      result: {
        // @ts-ignore
        player: function(player2, target, card) {
          var cards2 = player2.getCards("he"), num = 0;
          for (var i = 0; i < cards2.length; i++) {
            num += cards2[i].number;
          }
          if (player2.storage.xingtumrfz == void 0) return -1;
          if (player2.storage.xingtumrfz.length < 3) return -1;
          return num - 42;
        }
      }
    }
  },
  "xingyoumrfz": {
    intro: {
      content: "[其他角色/你]计算与[你/其他角色]的距离+#"
    },
    audio: 2,
    enable: "phaseUse",
    // @ts-ignore
    filter: function(event, player2) {
      return player2.countCards("he", function(card) {
        for (var i = 0; i < player2.storage.xingyoumrfz.length; i++) {
          var storage = player2.storage.xingyoumrfz[i];
          if (get.suit(card) == storage) return false;
        }
        return true;
      }) > 0;
    },
    selectCard: 1,
    filterCard: function(card) {
      var player2 = _status.event.player;
      for (var i = 0; i < player2.storage.xingyoumrfz.length; i++) {
        var storage = player2.storage.xingyoumrfz[i];
        if (get.suit(card) == storage) return false;
      }
      return true;
    },
    check: function(card) {
      return 8 - get.value(card);
    },
    init: (player2, skill2) => player2.storage[skill2] = [],
    content: function() {
      player.recast(cards[0]);
      player.storage.xingyoumrfz.add(cards[0].suit);
    },
    group: ["xingyoumrfz_del", "xingyoumrfz_dis"],
    subSkill: {
      del: {
        charlotte: true,
        forced: true,
        silent: true,
        lastDo: true,
        trigger: { player: "phaseEnd" },
        async content(event, trigger2, player2) {
          player2.storage.xingyoumrfz = [];
        }
      },
      dis: {
        charlotte: true,
        forced: true,
        trigger: { global: "roundStart" },
        async content(event, trigger2, player2) {
          player2.addMark("xingyoumrfz_dis", 1, false);
          if (game.countPlayer(function(current) {
            return current != player2 && player2.inRange(current);
          }) == 0) {
            player2.loseMaxHp();
          }
        },
        mod: {
          // @ts-ignore
          globalTo: function(from, to, distance) {
            return distance += to.countMark("xingyoumrfz_dis");
          },
          // @ts-ignore
          globalFrom: function(from, to, distance) {
            return distance += from.countMark("xingyoumrfz_dis");
          }
        }
      }
    },
    ai: {
      order: 6
    }
  },
  "jiexiangmrfz": {
    audio: 2,
    forced: true,
    trigger: { player: "die" },
    forceDie: true,
    async content(event, trigger2, player2) {
      let result;
      const targets = game.filterPlayer().remove(player2);
      event.targets = targets;
      await player2.draw(Math.max(event.targets.length + 1, player2.recastCount()));
      while (event.targets.length) {
        const num = player2.countCards("he") - event.targets.length;
        result = await player2.chooseCard("【揭相】:请选择至少一张牌将其分配给" + get.translation(event.targets[0]), [1, num + 1], "he").set("forced", true).forResult();
        if (result.cards && result.cards.length) {
          const target = event.targets[0];
          await target.gain(result.cards, "gain2");
        }
        event.targets.shift();
      }
      for (const current of game.players) {
        if (current !== player2) {
          current.gainMaxHp();
          current.recover();
        }
      }
      if (game.hasPlayer((current) => {
        return current !== player2 && current.name === "baocunzhemrfz";
      })) {
        const audio = new Audio("extension/WhichWay/audio/CN/caidankelisitengmrfz.mp3");
        audio.play();
      }
    }
  }
});
translate({
  "kelisitengmrfz": "克丽斯腾",
  "xingtumrfz": "星途",
  "xingtumrfz_info": "出牌阶段限一次，你可以与至多两名其他角色各重铸一张牌，然后若有至少一半（向上取整）的角色与你重铸的牌颜色相同且你至少选择了一名其他角色，则你们各选择一项（所有角色整局游戏中每项只能选择一次）：1.手牌上限+1；2.摸牌阶段摸牌数+1；3.使用【杀】的次数+1；4.将体力和手牌补至体力上限。",
  "poqiongmrfz": "破穹",
  "poqiongmrfz_info": "限定技，出牌阶段，你可以展示自己未以此法展示过的牌和弃置并展示牌堆顶的一张牌，若你展示的牌的点数更小，则你失去一点体力上限，你循环6次这个流程，若你展示的牌的点数大的次数多于牌堆展示牌的次数，你获得所有以此法展示的牌、增加3点体力上限、失去【星途】、获得【揭相】和【星游】。",
  "poqiongmrfz_append": '<span style="font-family: yuanli">"如若此后百年千年，来人漫步于繁星身侧，人们便要称颂她的名。"</span>',
  "xingyoumrfz": "星游",
  "xingyoumrfz_info": "①锁定技，每轮开始时，[其他角色/你]计算与[你/其他角色]的距离+1，若你不在任何一个其他角色的攻击范围内，你失去一点体力上限。②出牌阶段每种花色的牌限一次，你可以重铸一张牌。",
  "jiexiangmrfz": "揭相",
  "jiexiangmrfz_info": "锁定技，当你死亡后，你摸X张牌并将你的牌依次分配给其他角色（每名角色至少分配一张牌），然后全场体力上限+1并回复一点体力。（X=你本局游戏因重铸获得的牌，X至少为存活角色数）"
});
characterTitle("kelisitengmrfz", "<font color=#DC143C>先驱者</font>");
characterIntro("kelisitengmrfz", "摘自PRTS的梗概</br>克里斯滕·莱特，莱茵生命总辖构件科主任兼联合创始人，特里蒙理工大学高能物理博士，出身于著名的莱特家族。塞雷娅称呼其为“总辖”。</br>与塞雷娅是大学同学，又是最要好的朋友，心有灵犀，互相认为对方是唯一理解自己的人。两人一拍即合，一同创建了莱茵生命。但在炎魔事件后，克丽斯腾被塞雷娅指出其行为越过了她的底线，导致塞雷娅与克丽斯腾决裂，离开莱茵生命。</br>359号基地事件期间，斐尔迪南企图架空克丽斯腾的权力，但在塞雷娅与克丽斯腾的磋商下，斐尔迪南的图谋最终失败。");
//# sourceMappingURL=index.js.map
