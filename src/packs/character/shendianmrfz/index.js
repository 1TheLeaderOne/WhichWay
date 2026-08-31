import { get, lib, game, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("shendianmrfz", {
  sex: "female",
  group: "yimrfz",
  hp: 3,
  skills: ["fumumrfz", "rouguangmrfz", "mizongmrfz"]
});
skill({
  "fumumrfz": {
    audio: 2,
    trigger: {
      player: "useCard",
      target: "useCardToTargeted"
    },
    filter(event, player2) {
      if (event.name !== "useCard" && event.player == player2) return false;
      return get.isView(event.card);
    },
    forced: true,
    content() {
      if (trigger.name == "useCard") {
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player;
          })
        );
      } else {
        trigger.getParent().excluded.add(player);
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter: function(player2, tag, arg) {
        return get.isView(arg.card);
      },
      effect: {
        // @ts-ignore
        // @ts-ignore
        target: function(card, player2, target, current) {
          if (!card.isCard) return "zeroplayertarget";
        }
      }
    }
  },
  "rouguangmrfz": {
    init(player2, skill2) {
      player2.storage[skill2] = {
        x: 0,
        type: []
      };
    },
    onremove: true,
    mark: true,
    intro: {
      // @ts-ignore
      // @ts-ignore
      content(event, player2) {
        let storage = player2.storage.rouguangmrfz;
        return `·额定摸牌数和手牌上限+${storage["x"]}<br>·本轮已使用的类型:${get.translation(storage["type"])}`;
      }
    },
    audio: 2,
    trigger: {
      global: "roundStart",
      player: "useCardAfter"
    },
    silent: true,
    forced: true,
    filter(event, player2) {
      let storage = player2.storage.rouguangmrfz;
      if (event.name === "useCard") return !storage["type"].includes(get.type2(event.card));
      else return true;
    },
    // @ts-ignore
    // @ts-ignore
    async content(event, trigger2, player2) {
      if (trigger2.name === "useCard") {
        player2.storage.rouguangmrfz["type"].push(get.type2(trigger2.card));
      } else {
        let storage = player2.storage.rouguangmrfz;
        if (game.roundNumber > 1 && storage["x"] < 3 && storage["type"].length === 3) {
          player2.storage.rouguangmrfz["x"]++;
          player2.logSkill("rouguangmrfz");
        }
        player2.storage.rouguangmrfz["type"] = [];
      }
    },
    group: "rouguangmrfz_eff",
    subSkill: {
      eff: {
        mod: {
          maxHandcard: function(player2, num) {
            return num += player2.storage.rouguangmrfz["x"];
          }
        },
        audio: "rouguangmrfz",
        forced: true,
        trigger: { player: "phaseDrawBegin2" },
        filter(event, player2) {
          return !event.numFixed && player2.storage.rouguangmrfz["x"] > 0;
        },
        // @ts-ignore
        // @ts-ignore
        async content(event, trigger2, player2) {
          trigger2.num += player2.storage.rouguangmrfz["x"];
        }
      }
    }
  },
  "mizongmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    // @ts-ignore
    // @ts-ignore
    filter(event, player2) {
      return true;
    },
    // @ts-ignore
    // @ts-ignore
    async content(event, trigger2, player2) {
      let targets = game.players.slice().filter((i2) => player2.inRange(i2) || player2 == i2);
      let names = targets.map((i2) => i2.name);
      let { moved } = await player2.chooseToMove(`【迷踪】:请为${get.cnNumber(targets.length, true)}名角色分配效果`).set("list", [[`你攻击范围内的角色`, [names, "character"]], [`直到该角色的出牌阶段<font color = red>开始时</font>，所有当前时机<font color = red>可以使用</font>的牌随机视为当前时机<font color = red>不可使用</font>的牌`], [`直到该角色的出牌阶段<font color = red>结束时</font>，所有当前时机<font color = red>不可以使用</font>的牌随机视为当前时机<font color = red>可使用</font>的牌`]]).set("processAI", (list) => {
        let moved2 = [[], [], []], player3 = get.player(), targets2 = list[0][1][0].map(
          (i2) => (
            // @ts-ignore
            _status.event.chars.find((t) => t.name === i2)
          )
        );
        let func = function(to) {
          let previous;
          while (true) {
            previous = previous || to.getPrevious();
            if (previous === player3 && get.attitude(player3, previous) > 2) return true;
            else if (previous !== player3 && get.attitude(player3, previous) > 2) {
              previous.getPrevious();
              continue;
            }
            return false;
          }
        };
        for (var target of targets2) {
          if (target === player3) moved2[2].push(target);
          else if (get.attitude(target, player3) < 2) moved2[1].push(target);
          else if (func(target)) moved2[2].push(target);
        }
        return moved2;
      }).set("chars", targets).forResult();
      if (!moved) return;
      let findPlayer = function(name, targets2) {
        if (typeof name === "string") return targets2.find((t) => t.name === name);
        return name;
      };
      moved = [moved[0], moved[1].map((i2) => findPlayer(i2, targets)), moved[2].map((i2) => findPlayer(i2, targets))];
      for (var i of moved[1]) {
        i.addTempSkill("mizongmrfz_eff", { player: "phaseUseBegin" });
        i.storage.mizongmrfz_eff = true;
      }
      for (var i of moved[2]) {
        i.addTempSkill("mizongmrfz_eff", { player: "phaseUseEnd" });
        i.storage.mizongmrfz_eff = false;
      }
    },
    subSkill: {
      eff: {
        init(player2) {
          if (!player2.storage.mizongmrfz_cardData) {
            player2.storage.mizongmrfz_cardData = {};
          }
          lib.skill.mizongmrfz_eff.inpile = lib.inpile.filter((i) => get.type(i) != "equip");
        },
        group: "mizongmrfz_cardData",
        charlotte: true,
        silent: true,
        onremove(player2) {
          delete player2.storage.mizongmrfz_cardData;
          delete player2.storage.mizongmrfz_eff;
        },
        inpile: [],
        mod: {
          // @ts-ignore
          // @ts-ignore
          cardname(card, player2, name) {
            const storage = player2.storage.mizongmrfz_eff;
            const event = get.event();
            if (event.name === "_wuxie") {
              if (card.name !== "wuxie" && storage === false) return "wuxie";
              if (card.name === "wuxie" && storage === true) {
                return lib.skill.mizongmrfz_eff.inpile.filter((i) => i.name !== "wuxie").randomGet();
              }
            }
            if (!["chooseToUse", "chooseToRespond"].includes(event.name)) return;
            const canUse = [];
            const notUse = [];
            lib.skill.mizongmrfz_eff.inpile.forEach((i) => {
              const autoViewCard = get.autoViewAs({ name: i }, "unsure");
              if (event.filterCard(autoViewCard, player2, event)) {
                canUse.push(i);
              } else {
                notUse.push(i);
              }
            });
            const cardClone = game.createCard(card.name, card.suit, card.number, card.natrue);
            Object.assign(cardClone, {
              _cardid: card.cardid,
              storage: card.storage,
              gaintag: card.gaintag
            });
            const cardData = player2.storage.mizongmrfz_cardData[card.cardid];
            if ((!cardData || event.filterCard({ name: cardData }, player2, event)) && storage === true && event.filterCard(cardClone, player2, event)) {
              player2.storage.mizongmrfz_cardData[card.cardid] = notUse.randomGet();
            }
            if ((!cardData || !event.filterCard({ name: cardData }, player2, event)) && storage === false && !event.filterCard(cardClone, player2, event)) {
              player2.storage.mizongmrfz_cardData[card.cardid] = canUse.randomGet();
            }
            return player2.storage.mizongmrfz_cardData[card.cardid];
          }
        }
      },
      cardData: {
        charlotte: true,
        silent: true,
        trigger: {
          global: ["loseAfter", "gainAfter", "loseAsyncAfter", "_wuxieAfter"]
        },
        content() {
          player.storage.mizongmrfz_cardData = {};
        }
      }
    },
    ai: {
      order: 13,
      result: {
        player: 1
      }
    }
  }
});
translate({
  "shendianmrfz": "深靛",
  "fumumrfz": "缚目",
  "fumumrfz_info": "锁定技，你使用的转化牌不可被响应；当你成为其他角色使用的转化牌或虚拟牌的目标时，取消之。",
  "rouguangmrfz": "柔光",
  "rouguangmrfz_info": "锁定技，你的手牌上限和额定摸牌数+X（至多为3）；每轮开始时，若你于上一轮使用过三种类型的牌，X+1。",
  "mizongmrfz": "迷踪",
  "mizongmrfz_info": "出牌阶段限一次，你可以令你攻击范围内的任意角色或你获得其中一个效果：<br>1.直到该角色的出牌阶段开始时，所有当前时机可以使用的牌随机视为当前时机不可使用的牌（装备牌除外）；<br>2.直到该角色的出牌阶段结束时，所有当前时机不可以使用的牌随机视为当前时机可使用的牌（装备牌除外）。"
});
characterTitle("shendianmrfz", "<font color=#00E68A>灯塔守卫者</font>");
characterIntro("shendianmrfz", "深靛，来自伊比利亚的流浪术师。曾经是一座海滨灯塔的见习看守人。在游历期间，与正执行外勤任务的蓝毒和格劳克斯相识。后经蓝毒介绍，入职罗德岛。");
//# sourceMappingURL=index.js.map
