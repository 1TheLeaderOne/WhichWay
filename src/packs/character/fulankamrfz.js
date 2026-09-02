import { get, ui, lib, game, _status } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("fulankamrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "gemrfz",
  hp: 3,
  skills: ["jifengmrfz", "xiqiaomrfz"]
});
skill({
  "amy_qingyanmrfz": {
    audio: 2,
    trigger: { player: "phaseUseEnd" },
    intro: {
      content: function(event, player) {
        var str = "";
        var list = [
          player.hasSkill("amy_qingyanmrfz_damage"),
          player.hasSkill("amy_qingyanmrfz_time"),
          player.hasSkill("amy_qingyanmrfz_direct")
        ];
        var text = [
          "·你每回合使用的第一张【杀】的伤害基数+1</br>",
          "·你使用【杀】的次数+1</br>",
          "·你使用的【杀】需要两张【闪】才可抵消</br>"
        ];
        for (var i = 0; i < list.length; i++) {
          if (list[i]) str = str + text[i];
        }
        return str;
      }
    },
    filter: function(event, player) {
      return !player.storage.amy_qingyanmrfz_time || !player.storage.amy_qingyanmrfz_damage || !player.storage.amy_qingyanmrfz_direct;
    },
    check: function(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && get.attitude(current, player) > 2;
      });
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseTarget("【青焱】：请选择一名其他角色", true, (card, player2, target) => {
        return target !== player2;
      }).set("ai", (target) => {
        const aiPlayer = _status.event.player;
        const att = get.attitude(aiPlayer, target);
        return att > 2;
      }).forResult();
      if (result.targets) {
        const target = result.targets[0];
        event.target = target;
        const list = [];
        if (!player.storage.amy_qingyanmrfz_time) list.push("你使用【杀】的次数 +1");
        if (!player.storage.amy_qingyanmrfz_damage) list.push("你每回合使用的第一张【杀】的伤害基数 +1");
        if (!player.storage.amy_qingyanmrfz_direct) list.push("你使用的【杀】需要两张【闪】才可抵消");
        if (list.length === 1) {
          if (!player.storage.amy_qingyanmrfz_time) {
            player.storage.amy_qingyanmrfz_time = true;
            target.addSkill("amy_qingyanmrfz_time");
          }
          if (!player.storage.amy_qingyanmrfz_damage) {
            player.storage.amy_qingyanmrfz_damage = true;
            target.addSkill("amy_qingyanmrfz_damage", false);
            target.addMark("amy_qingyanmrfz");
          }
          if (!player.storage.amy_qingyanmrfz_direct) {
            player.storage.amy_qingyanmrfz_direct = true;
            target.addSkill("amy_qingyanmrfz_direct", false);
            target.addMark("amy_qingyanmrfz");
          }
          return;
        } else {
          result = await player.chooseControl(list).set("prompt", "请选择删除一句话并令" + get.translation(target) + "获得该效果").set("ai", () => {
            return [0, 1, 2].randomGet();
          }).forResult();
          if (result.control === "你使用【杀】的次数 +1") {
            event.target.addMark("amy_qingyanmrfz", 1, false);
            player.storage.amy_qingyanmrfz_time = true;
            event.target.addSkill("amy_qingyanmrfz_time");
          }
          if (result.control === "你每回合使用的第一张【杀】的伤害基数 +1") {
            event.target.addMark("amy_qingyanmrfz", 1, false);
            player.storage.amy_qingyanmrfz_damage = true;
            event.target.addSkill("amy_qingyanmrfz_damage");
          }
          if (result.control === "你使用的【杀】需要两张【闪】才可抵消") {
            event.target.addMark("amy_qingyanmrfz", 1, false);
            player.storage.amy_qingyanmrfz_direct = true;
            event.target.addSkill("amy_qingyanmrfz_direct");
          }
        }
      } else {
        return;
      }
    },
    ai: {
      expose: 0.1,
      threaten: 1.1
    },
    group: ["amy_qingyanmrfz_damage", "amy_qingyanmrfz_time", "amy_qingyanmrfz_direct"],
    subSkill: {
      direct: {
        audio: "amy_qingyanmrfz",
        trigger: {
          player: "useCardToPlayered"
        },
        forced: true,
        filter: function(event, player) {
          if (player.storage.amy_qingyanmrfz_direct == true && player.hasSkill("amy_qingyanmrfz_mark")) return false;
          return event.card.name == "sha" && !event.getParent().directHit.includes(event.target) && get.distance(player, event.target) <= 1;
        },
        logTarget: "target",
        async content(event, trigger, player) {
          const id = trigger.target.playerid;
          const map = trigger.getParent()?.customArgs;
          if (!map || !id) return;
          if (!map[id]) map[id] = {};
          if (typeof map[id].shanRequired == "number") {
            map[id].shanRequired++;
          } else {
            map[id].shanRequired = 2;
          }
        },
        ai: {
          directHit_ai: true,
          skillTagFilter: function(player, tag, arg) {
            if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1)
              return false;
          }
        },
        group: "amy_qingyanmrfz_remove2"
      },
      remove2: {
        silent: true,
        charlotte: true,
        trigger: { player: "phaseEnd" },
        filter: function(event, player) {
          return !player.hasSkill("amy_qingyanmrfz");
        },
        async content(event, trigger, player) {
          player.removeSkill("amy_qingyanmrfz_direct");
          player.removeMark("amy_qingyanmrfz", 1, false);
          game.countPlayer(function(current) {
            if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_direct = false;
            return false;
          });
        }
      },
      time: {
        silent: true,
        charlotte: true,
        trigger: { player: "phaseEnd" },
        filter: function(event, player) {
          return !player.hasSkill("amy_qingyanmrfz");
        },
        async content(event, trigger, player) {
          player.removeMark("amy_qingyanmrfz", 1, false);
          player.removeSkill("amy_qingyanmrfz_time");
          game.countPlayer(function(current) {
            if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_time = false;
            return false;
          });
        },
        mod: {
          cardUsable: function(card, player, num) {
            if (card.name == "sha" && (!player.storage.amy_qingyanmrfz || player.hasMark("amy_qingyanmrfz"))) return num + 1;
          }
        }
      },
      damage: {
        audio: "amy_qingyanmrfz",
        forced: true,
        charlotte: true,
        trigger: { player: "useCard" },
        filter: function(event, player) {
          if (player.storage.amy_qingyanmrfz_damage && player.hasSkill("amy_qingyanmrfz_mark")) return false;
          if (player.hasSkill("amy_qingyanmrfz_mark")) return false;
          return event.card && event.card.name == "sha";
        },
        async content(event, trigger, player) {
          if (!trigger.baseDamage) trigger.baseDamage = 1;
          trigger.baseDamage++;
          player.addTempSkill("amy_qingyanmrfz_mark", "phaseEnd");
        },
        ai: {
          damageBonus: true
        },
        group: "amy_qingyanmrfz_remove1"
      },
      remove1: {
        silent: true,
        charlotte: true,
        trigger: { player: "phaseEnd" },
        filter: function(event, player) {
          return !player.hasSkill("amy_qingyanmrfz");
        },
        async content(event, trigger, player) {
          player.removeSkill("amy_qingyanmrfz_damage");
          player.removeMark("amy_qingyanmrfz", 1, false);
          game.countPlayer(function(current) {
            if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_damage = false;
            return false;
          });
        }
      },
      mark: {
        silent: true,
        charlotte: true
      }
    }
  },
  "yingxiaomrfz": {
    audio: 4,
    intro: {
      content: function(event, player) {
        if (player.storage.yingxiaomrfz) return "已发动";
        if (!player.storage.yingxiaomrfz) {
          if (player.countMark("yingxiaomrfz_mark") < 5)
            return "未发动（不满足发动条件）</br>已累计使用" + player.countMark("yingxiaomrfz_mark") + "张【杀】";
          else return "未发动（已满足发动条件）";
        }
      }
    },
    mark: true,
    limited: true,
    animationStr: "影宵",
    animationColor: "gold",
    trigger: { player: "phaseZhunbeiBegin" },
    check: function(event, player) {
      return game.hasPlayer(function(current) {
        return current != player && get.attitude(current, player) < 0 && player.inRange(current);
      });
    },
    init: function(player) {
      player.storage.yingxiaomrfz = false;
    },
    filter: function(event, player) {
      return !player.storage.yingxiaomrfz && player.countMark("yingxiaomrfz_mark") >= 5;
    },
    async content(event, trigger, player) {
      player.storage.yingxiaomrfz = true;
      player.awakenSkill(event.name);
      event.num = 0;
      while (event.num < 3) {
        if (event.num === 2) {
          player.addTempSkill("yingxiaomrfz_damage", "useCardAfter");
          player.addTempSkill("yingxiaomrfz_wushi", "useCardAfter");
          player.addTempSkill("yingxiaomrfz_total", "useCardAfter");
          await player.chooseUseTarget(
            {
              name: "sha",
              isCard: true
            },
            "请选择【杀】的目标",
            false
          );
        } else {
          player.addTempSkill("yingxiaomrfz_total", "useCardAfter");
          await player.chooseUseTarget(
            {
              name: "sha",
              nature: event.num === 0 ? "thunder" : "fire",
              isCard: true
            },
            "请选择" + (event.num === 0 ? "雷【杀】" : "火【杀】") + "的目标 (下一张使用的牌为：" + (event.num === 0 ? "火【杀】" : "伤害基数为翻倍且无视防具的【杀】") + ")",
            false
          );
          player.logSkill("yingxiaomrfz");
        }
        event.num++;
      }
      await player.draw(player.countMark("yingxiaomrfz_total"));
      player.addSkill("yingxiaomrfz_handlit");
      player.addSkill("yingxiaomrfz_round2");
    },
    group: "yingxiaomrfz_time",
    subSkill: {
      mark: {
        charlotte: true
      },
      time: {
        silent: true,
        charlotte: true,
        trigger: { player: "useCard" },
        filter: function(event, player) {
          return event.card && event.card.name == "sha" && player.countMark("yingxiaomrfz_mark") < 5;
        },
        async content(event, trigger, player) {
          player.addMark("yingxiaomrfz_mark", 1, false);
        }
      },
      damage: {
        forced: true,
        charlotte: true,
        trigger: { player: "useCard2" },
        filter: function(event, player) {
          return event.card && event.card.name == "sha";
        },
        async content(event, trigger, player) {
          if (!trigger.baseDamage) trigger.baseDamage = 1;
          trigger.baseDamage += 2;
        },
        ai: {
          damageBonus: true
        }
      },
      wushi: {
        trigger: {
          player: "useCardToPlayered"
        },
        filter: function(event) {
          return event.card.name == "sha";
        },
        silent: true,
        logTarget: "target",
        async content(event, trigger, player) {
          trigger.target.addTempSkill("qinggang2");
          trigger.target.storage.qinggang2.add(trigger.card);
          trigger.target.markSkill("qinggang2");
        },
        ai: {
          unequip_ai: true,
          skillTagFilter: function(player, tag, arg) {
            if (arg && arg.name == "sha") return true;
            return false;
          }
        }
      },
      total: {
        silent: true,
        charlotte: true,
        trigger: { source: "damageEnd" },
        filter: function(event, player) {
          return event.card.name == "sha";
        },
        async content(event, trigger, player) {
          player.addMark("yingxiaomrfz_total", trigger.num, false);
        }
      },
      handlit: {
        silent: true,
        charlotte: true,
        mod: {
          maxHandcard: function(player, num) {
            return num + player.countMark("yingxiaomrfz_total");
          }
        }
      },
      round1: {
        silent: true,
        charlotte: true,
        trigger: {
          global: "roundStart"
        },
        async content(event, trigger, player) {
          player.addMark("yingxiaomrfz_round1", 1, false);
          if (player.countMark("yingxiaomrfz_round1") > 2) {
            player.removeSkill("yingxiaomrfz_round2");
            player.removeMark("yingxiaomrfz_round1", player.countMark("yingxiaomrfz_round1"), false);
          }
        }
      },
      round2: {
        audio: "yingxiaomrfz",
        trigger: { source: "damageBefore" },
        forced: true,
        charlotte: true,
        mark: true,
        intro: {
          content: function(event, player) {
            return "你造成的伤害均视为体力流失</br>效果剩余时间：" + (2 - player.countMark("yingxiaomrfz_round1")) + "轮";
          }
        },
        check: function() {
          return false;
        },
        async content(event, trigger, player) {
          trigger.cancel();
          trigger.player.loseHp(trigger.num);
        },
        ai: {
          jueqing: true
        },
        group: "yingxiaomrfz_round1"
      }
    }
  },
  "jifengmrfz": {
    audio: 2,
    trigger: {
      player: "useCard2"
    },
    filter: function(event, player) {
      if (event.targets && event.targets.length > 1) return false;
      return event.cards && event.card.name == "sha";
    },
    check: function(event, player) {
      return get.attitude(player, event.targets[0]) < 0;
    },
    prompt: function(event, player) {
      var target = event.targets[0], list = [];
      if (!target.hasEmptySlot(2)) list.push("无视防具");
      if (target.countCards("h") > 0) list.push("此【杀】需要两张闪才可抵消");
      if (target.hujia > 0) list.push("无视护甲");
      return "【极锋】:是否对" + get.translation(target) + "发动‘极锋’？（" + list + "）";
    },
    async content(event, trigger, player) {
      var target = trigger.targets[0], num = 0;
      if (!target.hasEmptySlot(2)) {
        num++;
        target.addTempSkill("qinggang2");
        target.storage.qinggang2.add(trigger.card);
        target.markSkill("qinggang2");
      }
      if (target.countCards("h") > 0) {
        num++;
        player.addTempSkill("jifengmrfz_sha");
        player.storage.jifengmrfz = {
          card: trigger.card
        };
      }
      if (target.hujia > 0) {
        target.addTempSkill("jifengmrfz_ighujia");
        target.storage.jifengmrfz_ighujia.add(trigger.card);
        target.markSkill("jifengmrfz_ighujia");
        num++;
      }
      if (!player.hasSkill("jifengmrfz_used")) {
        player.addTempSkill("jifengmrfz_used", "phaseEnd");
        player.draw(3 - num);
      }
    },
    subSkill: {
      sha: {
        trigger: {
          player: "useCardToPlayered"
        },
        forced: true,
        silent: true,
        filter: function(event, player) {
          var info = player.storage.jifengmrfz;
          if (!event.card || event.card != info.card) return false;
          return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
        },
        logTarget: "target",
        async content(event, trigger, player) {
          const id = trigger.target.playerid;
          const map = trigger.getParent()?.customArgs;
          if (!map || !id) return;
          if (!map[id]) map[id] = {};
          if (typeof map[id].shanRequired == "number") {
            map[id].shanRequired++;
          } else {
            map[id].shanRequired = 2;
          }
          delete player.storage.jifengmrfz;
          player.removeSkill("jifengmrfz_sha");
        },
        ai: {
          directHit_ai: true,
          skillTagFilter: function(player, tag, arg) {
            if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player, arg.target) > 1)
              return false;
          }
        }
      },
      used: {
        charlotte: true
      },
      ighujia: {
        ai: {
          nohujia: true
        },
        init: function(player, skill2) {
          if (!player.storage[skill2]) player.storage[skill2] = [];
        },
        onremove: true,
        trigger: {
          player: ["damage", "damageCancelled", "damageZero"],
          source: ["damage", "damageCancelled", "damageZero"],
          target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
          global: ["useCardEnd"]
        },
        charlotte: true,
        firstDo: true,
        filter: function(event, player) {
          return player.storage.jifengmrfz_ighujia && event.card && player.storage.jifengmrfz_ighujia.includes(event.card) && (event.name != "damage" || event.notLink());
        },
        silent: true,
        forced: true,
        popup: false,
        priority: 12,
        async content(event, trigger, player) {
          player.storage.jifengmrfz_ighujia.remove(trigger.card);
          if (!player.storage.jifengmrfz_ighujia.length) player.removeSkill("jifengmrfz_ighujia");
        },
        marktext: "✘",
        intro: {
          name: "✘",
          content: "当前护甲已失效"
        }
      }
    },
    ai: {
      threaten: 1.2
    }
  },
  "xiqiaomrfz": {
    audio: 2,
    trigger: {
      player: ["chooseToRespondBegin", "chooseToUseBegin"]
    },
    filter: function(event, player) {
      if (player.hasSkill("xiqiaomrfz_used")) return false;
      if (event.responded) return false;
      if (!event.filterCard || !event.filterCard({ name: "shan" }, player, event)) return false;
      if (event.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player, event)) return false;
      return true;
    },
    check: () => true,
    async content(event, trigger, player) {
      player.addTempSkill("xiqiaomrfz_used", "phaseEnd");
      const next = player.chooseToDiscard("he", true);
      next.set("prompt", "【细巧】:你可以弃置一张牌，然后摸一张牌并展示之，若类型不同，视为使用或打出一张【闪】");
      const result = await next.forResult();
      if (!result.cards) return;
      let cardl = result.cards[0];
      const { cards } = await player.draw("visible").forResult();
      if (!cards) return;
      let card = cards[0];
      if (get.type2(card) != get.type2(cardl)) {
        trigger.untrigger();
        trigger.set("responded", true);
        trigger.result = { bool: true, card: { name: "shan", isCard: true } };
      }
    },
    subSkill: {
      used: {
        charlotte: true
      }
    },
    ai: {
      respondShan: true,
      threaten: 0.8
    }
  },
  "zhimingmrfz": {
    mark: true,
    intro: {
      content: function(event, player) {
        var storage = player.storage.yxliumingmrfz_count;
        if (player.awakenedSkills && player.awakenedSkills.includes("dingyuanmrfz")) {
          return "置于过武将牌上的牌（装备牌和延时锦囊除外）:" + get.translation(storage["card"]);
        }
        return "已置于过武将牌上" + storage["count"] + "张牌</br>置于过武将牌上的牌（装备牌和延时锦囊除外）:" + get.translation(storage["card"]);
      }
    },
    audio: 2,
    enable: ["chooseToUse", "chooseToRespond"],
    hiddenCard: function(player, name) {
      var cards = player.storage.yxliumingmrfz_count["card"];
      if (player.countCards("he") < 1 || !cards || player.hasSkill("zhimingmrfz_ban")) return false;
      for (var i of cards) {
        if (name == i) return true;
      }
      return false;
    },
    filter: function(event, player) {
      var cards = player.storage.yxliumingmrfz_count["card"];
      if (player.countCards("he") < 1 || !cards || player.hasSkill("zhimingmrfz_ban")) return false;
      for (var i of cards) {
        if (event.filterCard({ name: i, isCard: true }, player, event)) return true;
      }
      return false;
    },
    chooseButton: {
      dialog: function(event, player) {
        var vcards = [];
        var list = player.storage.yxliumingmrfz_count["card"];
        for (var name of list) {
          var card = { name, isCard: true };
          var type = get.type(name);
          if (event.filterCard(card, player, event)) vcards.push([type, "", name]);
        }
        var dialog = ui.create.dialog("祗铭", [vcards, "vcard"], "hidden");
        dialog.direct = true;
        return dialog;
      },
      backup: function(links, player) {
        return {
          filterCard: () => true,
          selectCard: 1,
          viewAs: {
            name: links[0][2]
          },
          position: "he",
          async precontent(event, trigger, player2) {
            player2.logSkill("zhimingmrfz");
            player2.addTempSkill("zhimingmrfz_ban", { global: "phaseEnd" });
          }
        };
      },
      prompt: function(links, player) {
        return "【祗铭】：将一张牌当作【" + get.translation(links[0][2]) + "】使用或打出";
      }
    },
    ai: {
      order: 1,
      result: {
        player: 1
      }
    },
    subSkill: {
      ban: {
        charlotte: true
      }
    }
  },
  "tongganmrfz": {
    audio: 2,
    trigger: {
      global: "drawAfter"
    },
    usable: 3,
    forced: true,
    filter: function(event, player) {
      return event.player !== player;
    },
    async content(event, trigger, player) {
      player.draw();
    },
    group: "tonggan_discardmrfz",
    ai: {
      threaten: 2
    }
  },
  "tonggan_discardmrfz": {
    audio: 2,
    trigger: {
      global: "loseAfter"
    },
    usable: 3,
    filter: function(event, player) {
      if (event.type != "discard") return false;
      return event.player !== player;
    },
    forced: true,
    async content(event, trigger, player) {
      player.chooseToDiscard("he", true, 1);
    }
  },
  "shuangzimrfz": {
    audio: 2
  }
});
translate({
  "fulankamrfz": "芙兰卡",
  "amy_qingyanmrfz": "青焱",
  "amy_qingyanmrfz_info": "①锁定技，[你使用【杀】的次数+1]，{你每回合使用的第一张【杀】的伤害基数+1}，(你使用的【杀】需要两张【闪】才可抵消)。</br>②出牌阶段结束时，你可以删除【青焱①】中[]、{}或()的内容直到本轮结束，然后令一名其他角色获得你删除的内容的效果直到其回合结束。",
  "yingxiaomrfz": "影霄",
  "yingxiaomrfz_info": "限定技，准备阶段，若你已经使用了至少5张【杀】，你可以依次使用1张雷【杀】、1张火【杀】和1张伤害基数+2且无视防具的【杀】（目标必须合法），结算完成后，你摸X张牌、手牌上限+X且接下来两轮内，你造成的伤害均为体力流失。（X=你因此技能使用的【杀】造成的伤害数）",
  "jifengmrfz": "极锋",
  "jifengmrfz_info": "当你使用【杀】选择唯一目标后，你可以执行所有符合条件的选项：1.若其防具栏不为空，你无视其防具；2.若其有护甲值，你无视此护甲；3.若其有手牌，此【杀】须要两张【闪】才可抵消，然后若你本回没有使用过此技能，你摸X张牌。（X=未执行的选项数）",
  "xiqiaomrfz": "细巧",
  "xiqiaomrfz_info": "每回合限一次，当你需要使用或打出【闪】时，你可以弃置一张牌，然后摸一张牌并展示之，若与你弃置的牌类别不同，视为你使用或打出了一张【闪】。",
  "zhimingmrfz": "祗铭",
  "zhimingmrfz_info": "每回合限一次，你可以将一张牌当作与本局游戏中你获得过的‘铭’的同名牌（装备牌和延时锦囊牌除外）使用或打出。",
  "tongganmrfz": "同感",
  "tongganmrfz_info": "锁定技，每回合每项限三次：①当其他角色从牌堆摸牌后，你摸一张牌；②当其他角色有牌进入弃牌堆后，你弃置一张牌。",
  "tonggan_discardmrfz": "同感",
  "shuangzimrfz": "双子",
  "shuangzimrfz_info": "①锁定技，你使用的牌在进入弃牌堆或造成伤害时之前视为无对应实体牌、无点数和无花色的牌；当你的手牌数少于你的体力上限时，你获得等同于你体力上限与手牌数之差的【影】；当你造成伤害后，若对应的实体牌为【影】，则令其回复等同于此次伤害数的体力，然后其展示所有手牌且不可响应下一张指定其为目标的【杀】。<br>②每回合限一次，你可以将一张【影】当作任意基本牌和普通锦囊牌使用，你以此法使用的【杀】不计入次数限制。"
});
characterIntro("fulankamrfz", "芙兰卡，黑钢国际生化防护相应人员安全保障专员，在行动护卫、战术突击、战术协同方面拥有丰富经验与强悍战力。</br>现于罗德岛接受矿石病治疗，并作为黑钢行动干员为罗德岛提供专业安保服务。");
