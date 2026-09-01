import { game, _status, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("teleixisimrfz", {
  pack: "plotSJZX",
  sex: "male",
  group: "junmrfz",
  hp: 4,
  skills: ["yuanfumrfz", "fenzhoumrfz"]
});
skill({
  "yuanfumrfz": {
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    audio: 2,
    trigger: {
      player: "phaseDrawEnd"
    },
    forced: true,
    // @ts-ignore
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      const { cards } = await player.chooseCard(true).set("prompt", "【怨府】:请展示一张手牌").set("ai", (card) => {
        var storage = player.storage.yuanfumrfz;
        if (storage.length > 1) return Math.random();
        if (storage.includes(get.color(card))) return -9999;
        return get.color(card) == "red" ? 10 : 0 - get.value(card);
      }).set("storage", player.storage.yuanfumrfz).forResult();
      if (!cards) return;
      player.showCards(cards, `${get.translation(player)}因【怨府】而展示的牌`);
      for (var i of game.players) {
        if (i == player) continue;
        i.addTempSkill("yuanfumrfz_eff", { global: "phaseAfter" });
        if (!i.storage.yuanfumrfz_eff) i.storage.yuanfumrfz_eff = [];
        i.storage.yuanfumrfz_eff.add(get.color(cards[0]));
      }
      player.storage.yuanfumrfz.add(get.color(cards[0]));
      player.addTempSkill("yuanfumrfz_clear", { global: "phaseBegin" });
    },
    subSkill: {
      clear: {
        silent: true,
        charlotte: true,
        lastDo: true,
        trigger: { player: "phaseEnd" },
        async content(event, trigger, player) {
          player.logSkill("yuanfumrfz");
          player.storage.yuanfumrfz = [];
          player.loseHp();
          var num = player.getStat("damage");
          if (num && num > 0) player.draw(Math.min(5, num));
        }
      },
      eff: {
        mark: true,
        intro: {
          // @ts-ignore
          content(event, player) {
            return `无法使用或打出手牌中${get.translation(player.storage.yuanfumrfz_eff)}的牌`;
          }
        },
        mod: {
          cardEnabled: function(card, player) {
            var colors = player.storage.yuanfumrfz_eff;
            if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player.isDying()) return false;
          },
          cardSavable: function(card, player) {
            var colors = player.storage.yuanfumrfz_eff;
            if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player.isDying()) return false;
          },
          cardEnabled2(card, player) {
            var colors = player.storage.yuanfumrfz_eff;
            if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player.isDying()) return false;
          }
        },
        silent: true,
        charlotte: true,
        lastDo: true,
        trigger: { player: "phaseEnd" },
        async content(event, trigger, player) {
          delete player.storage.yuanfumrfz;
        },
        ai: {
          effect: {
            // @ts-ignore
            target(card, player, target) {
              var colors = target.storage.yuanfumrfz_eff;
              if (get.tag(card, "damage") && colors && colors.includes(get.color(card))) return [0, -999999];
            }
          }
        }
      }
    }
  },
  "fenzhoumrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    // @ts-ignore
    filter(event, player) {
      return player.hasEnabledSlot(1) || player.hasEnabledSlot(2) || player.hasEnabledSlot(5) || player.hasEnabledSlot("horse");
    },
    // @ts-ignore
    async content(event, trigger, player) {
      var { control } = await player.chooseToDisable(true).set("ai", function(event2, player2, list2) {
        if (list2.includes("equip5")) return "equip5";
        else if (list2.includes("equip2")) return "equip2";
        else if (list2.includes("horse")) return "horse";
        return "equip1";
      }).forResult();
      if (!control) return;
      let targets = game.players.slice().remove(player);
      var getChooseList = function(event2, player2, target2) {
        let list2 = [];
        let chooseList2 = [
          `弃置一张牌，本回合你下次受到的伤害+1`,
          `交给${get.translation(player2)}一张牌，本回合${get.translation(player2)}使用【杀】的次数+1`,
          `令${get.translation(player2)}摸一张牌，本回合${get.translation(player2)}下次造成的伤害+1`
        ];
        if (target2.countCards("h") > 0) {
          list2.push("选项一");
          list2.push("选项二");
        } else {
          chooseList2[0] = '<span style="opacity:0.5; ">' + chooseList2[0] + "（你没有牌）</span>";
          chooseList2[1] = '<span style="opacity:0.5; ">' + chooseList2[1] + "（你没有牌）</span>";
        }
        list2.push("选项三");
        return {
          list: list2,
          chooseList: chooseList2
        };
      };
      while (targets.length > 0) {
        var target = targets[0];
        if (!target.isIn()) {
          targets.shift();
          continue;
        }
        if (!player.isIn()) {
          break;
        }
        var list = getChooseList(event, player, target).list, chooseList = getChooseList(event, player, target).chooseList;
        var { control } = await target.chooseControl(list).set("choiceList", chooseList).set("prompt", "请选择一项").set("ai", () => {
          var list2 = _status.event.list, player2 = _status.event.player, target2 = _status.event.target;
          if (get.attitude(player2, target2) > 0) {
            if (list2.includes("选项二")) return ["选项二", "选项三"].randomGet();
            return "选项三";
          } else {
            if (list2.includes("选项二") && player2.getCards("h").filter((card) => get.value(card) < 6)) return "选项二";
            if (list2.includes("选项一")) return "选项一";
          }
          return list2.randomGet();
        }).set("list", list).set("target", player).forResult();
        if (!control) {
          targets.shift();
          continue;
        }
        switch (control) {
          case "选项一":
            target.chooseToDiscard(true, "【焚舟】:请弃置一张手牌", "h");
            target.addMark("fenzhoumrfz_eff1", 1, false);
            target.addTempSkill("fenzhoumrfz_eff1", { player: ["damageEnd", "phaseEnd"] });
            break;
          case "选项二":
            var { cards } = await target.chooseCard("h", `【焚舟】:请交给${get.translation(player)}一张手牌`, true).set("ai", (card) => {
              var player2 = _status.event.player, target2 = _status.event.target;
              var num = get.value(card), att = get.attitude(player2, target2);
              if (get.tag(card, "damage")) num += (att > 0 ? 1 : -1) * get.value(card);
              return (att > 0 ? 1 : -1) * get.value(card);
            }).set("target", player).forResult();
            if (cards) {
              target.give(cards, player);
            }
            player.addMark("fenzhoumrfz_eff2", 1, false);
            player.addTempSkill("fenzhoumrfz_eff2", { player: "phaseEnd" });
            break;
          case "选项三":
            player.draw();
            player.addMark("fenzhoumrfz_eff3", 1, false);
            player.addTempSkill("fenzhoumrfz_eff3", {
              player: "phaseEnd",
              source: "damageEnd"
            });
            break;
        }
        targets.shift();
      }
    },
    subSkill: {
      eff1: {
        mark: true,
        intro: {
          content: "本回合下次受到的伤害+#"
        },
        onremove: true,
        charlotte: true,
        forced: true,
        trigger: { player: "damageBegin2" },
        // @ts-ignore
        filter(event, player) {
          return player.countMark("fenzhoumrfz_eff1") > 0;
        },
        async content(event, trigger, player) {
          trigger.num += player.countMark("fenzhoumrfz_eff1");
        }
      },
      eff2: {
        mark: true,
        intro: {
          content: "本回合使用【杀】的次数+#"
        },
        onremove: true,
        charlotte: true,
        mod: {
          cardUsable(card, player, num) {
            if (card.name == "sha") return num + player.countMark("fenzhoumrfz_eff2");
          }
        }
      },
      eff3: {
        mark: true,
        intro: {
          content: "本回合下次造成的伤害+#"
        },
        onremove: true,
        charlotte: true,
        forced: true,
        trigger: { source: "damageBegin2" },
        // @ts-ignore
        filter(event, player) {
          return player.countMark("fenzhoumrfz_eff3") > 0;
        },
        async content(event, trigger, player) {
          trigger.num += player.countMark("fenzhoumrfz_eff3");
        }
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1
      }
    }
  }
});
translate({
  "teleixisimrfz": "特雷西斯",
  "yuanfumrfz": "怨府",
  "yuanfumrfz_info": '锁定技，摸牌阶段结束时，你展示一张手牌，然后其他角色不能在非濒死状态下使用或打出与你展示的牌相同的手牌且你于本回合结束时失去一点体力并摸X张牌。（X = 你本回合造成的伤害，X至多为5）<br><span style="font-family: yuanli">"皇太子副主，望其所爱，硕帝之宠臣，而子违之，所谓三怨成府者也。"</span>',
  "fenzhoumrfz": "焚舟",
  "fenzhoumrfz_info": '出牌阶段限一次，你可以废除你的一个装备栏，然后所有其他角色选择一项：1.弃置一张牌，本回合其下次受到的伤害+1；2.交给你一张牌，本回合你使用【杀】的次数+1；3.令你摸一张牌，本回合你下次造成的伤害+1。<br><span style="font-family: yuanli">"秦伯伐晋，济河焚舟。"</span>'
});
characterTitle("teleixisimrfz", "<font color=#00868B>执剑斩棘</font>");
characterIntro("teleixisimrfz", "特雷西斯，特蕾西娅的兄长，卡兹戴尔的摄政王，萨卡兹的利刃，一位坚韧的英雄，一个孤独的梦想。道路被他的利刃劈开，代价是他的未来。");
//# sourceMappingURL=teleixisimrfz.js.map
