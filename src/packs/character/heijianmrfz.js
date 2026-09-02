import { lib, _status, get, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("heijianmrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "laimrfz",
  hp: 3,
  skills: ["newhuangxiangmrfz", "newjiyinmrfz"]
});
skill({
  "newhuangxiangmrfz": {
    audio: "huangxiangmrfz",
    trigger: {
      player: "phaseDrawAfter"
    },
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async cost(event, trigger, player) {
      const { result } = await player.chooseCard([1, 2], "【荒响】:你可以选择两张手牌将其标记为‘残影’").set("ai", (card) => {
        var num = get.value(card);
        if (get.name(card) == "shan" || get.name(card) == "wuxie") num += 10;
        if (get.type2(card) == "equip") num -= 2;
        return num;
      });
      event.result = result;
    },
    async content(event, trigger, player) {
      var cards = event.cards;
      await player.removeGaintag("newhuangxiangmrfzx");
      for (var i of cards) i.addGaintag("newhuangxiangmrfzx");
    },
    group: "newhuangxiangmrfz_lose",
    subSkill: {
      lose: {
        audio: "huangxiangmrfz",
        trigger: {
          player: "loseAfter",
          global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
        },
        filter(event, player) {
          if (_status.currentPhase == player) return false;
          var evt = event.getl(player);
          if (!evt || !evt.hs || !evt.hs.length) return false;
          if (event.name == "lose") {
            for (var i in event.gaintag_map) {
              if (event.gaintag_map[i].includes("newhuangxiangmrfzx")) return true;
            }
            return false;
          }
          return player.hasHistory("lose", function(evt2) {
            if (event != evt2.getParent()) return false;
            for (var i2 in evt2.gaintag_map) {
              if (evt2.gaintag_map[i2].includes("newhuangxiangmrfzx")) return true;
            }
            return false;
          });
        },
        async cost(event, trigger, player) {
          var list = ["选项一", "选项二", "cancel2"], choicelist = ["令一名你攻击范围内的角色选择弃置一张黑桃牌或受到一点伤害", "你摸一张牌且将此牌标记为‘残影’"];
          if (!game.hasPlayer((current) => current != player && player.inRange(current))) {
            list.remove("选项一");
            choicelist[0] = '<span style="opacity:0.5; ">' + choicelist[0] + "(没有满足条件的角色)</span>";
          }
          const { control } = await player.chooseControl(list).set("choiceList", choicelist).set("prompt", "【荒响】:你可以选择一项").set("ai", () => {
            var player2 = _status.event.player;
            if (!game.hasPlayer((current) => current != player2 && player2.inRange(current) && get.attitude(player2, current) < 0))
              return 1;
            return [0, 1];
          }).forResult();
          var result = {};
          result.bool = true;
          result.cost_data = control;
          if (control == "cancel2") result.bool = false;
          event.result = result;
        },
        async content(event, trigger, player) {
          var control = event.cost_data;
          if (control == "选项一") {
            const { targets } = await player.chooseTarget().set("forced", true).set("prompt", "【荒响】:请选择一名攻击范围内的角色").set("filterTarget", (card, player2, target) => {
              return player2 != target && player2.inRange(target);
            }).forResult();
            if (!targets) return;
            const { bool } = await targets[0].chooseToDiscard("【荒响】:请弃置一张黑桃牌，否则受到一点伤害", "he").set("ai", (card) => {
              var player2 = _status.event.player;
              if (player2.hp < 2 && player2.countCards("hes", (card2) => {
                return get.name(card2) == "tao" || get.name(card2) == "jiu";
              }))
                return 12 - get.value(card);
              return 7 - get.value(card);
            }).set("filterCard", (card) => get.suit(card) == "spade").forResult();
            if (bool) return;
            targets[0].damage();
          } else {
            const result = await player.draw().forResult();
            result.cards[0].addGaintag("newhuangxiangmrfzx");
          }
        }
      }
    }
  },
  "newjiyinmrfz": {
    audio: "jiyinmrfz",
    forced: true,
    trigger: {
      player: "useCard2"
    },
    getMeetCondition(event, player, target) {
      let num = 0;
      if (target.isMaxHandcard()) num++;
      if (target.isMaxHp()) num++;
      if (target.isMaxEquip()) num++;
      return num;
    },
    filter(event, player) {
      if (event.card.name != "sha") return false;
      for (var target of event.targets) {
        let num = lib.skill.newjiyinmrfz.getMeetCondition(event, player, target);
        if (typeof num === "number") return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      let targets = trigger.targets;
      for (var target of targets) {
        let num = lib.skill.newjiyinmrfz.getMeetCondition(event, player, target);
        if (typeof num !== "number") continue;
        player.line(target);
        if (!target.storage.newjiyinmrfz_tmp) target.storage.newjiyinmrfz_tmp = [];
        target.storage.newjiyinmrfz_tmp.push(trigger.card);
        target.when({
          player: "damageBegin3",
          global: "useCardAfter"
        }).filter((event2, player2) => {
          if (event2.name == "useCard" && player2.storage.newjiyinmrfz_tmp.filter((card) => card == event2.card).length > 0) return true;
          if (!player2.storage.newjiyinmrfz_tmp) return false;
          return event2.card && event2.card.name == "sha" && player2.storage.newjiyinmrfz_tmp.filter((card) => card == event2.card).length > 0;
        }).then(async (event2, trigger2, player2) => {
          if (trigger2.name == "damage") {
            trigger2.num += num;
          }
          player2.storage.newjiyinmrfz_tmp.remove(trigger2.card);
        });
      }
    },
    group: "newjiyinmrfz_sha",
    subSkill: {
      sha: {
        trigger: {
          player: "useCardToPlayered"
        },
        silent: true,
        filter: function(event, player) {
          if (event.card.name != "sha" || event.getParent().directHit.includes(event.target)) return false;
          return lib.skill.newjiyinmrfz.getMeetCondition(event, player, event.target) > 0;
        },
        logTarget: "target",
        async content(event, trigger, player) {
          var id = trigger.target.playerid;
          var map = trigger.getParent()?.customArgs;
          if (!map || !id) return;
          if (!map[id]) map[id] = {};
          if (typeof map[id].shanRequired == "number") {
            map[id].shanRequired++;
          } else {
            map[id].shanRequired = 1 + lib.skill.newjiyinmrfz.getMeetCondition(event, player, trigger.target);
          }
        }
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        let num = lib.skill.newjiyinmrfz.getMeetCondition(_status.event, player, arg.target);
        if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > num) return false;
      }
    }
  }
});
translate({
  "heijianmrfz": "黑键",
  "newhuangxiangmrfz": "荒响",
  "newhuangxiangmrfz_info": "摸牌阶段结束时，你可以令你所有的牌失去‘残影’标记并选择至多两张手牌将其标记为‘残影’。你的回合外，当你失去‘残影’后，你可以选择一项：<br>①令你攻击范围的一名角色选择弃置一张黑桃牌或受到一点伤害；<br>②摸一张牌并将此牌标记为‘残影’。",
  "newjiyinmrfz": "寂音",
  "newjiyinmrfz_info": "锁定技，当你使用【杀】指定目标后，其每满足下列一项，其抵消此【杀】所需要的【闪】的数量+1，此【杀】对其造成的伤害+1：<br>①手牌数为全场最多；<br>②体力值为全场最多；<br>③装备区为全场最多。"
});
characterIntro("heijianmrfz", "黑键，莱塔尼亚平民，于维谢海姆事件中感染矿石病，经干员芙蓉介绍来罗德岛治疗，在源石技艺方面展现出不凡天赋。经考核后，作为外勤干员加入罗德岛。");
