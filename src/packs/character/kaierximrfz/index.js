import { game, get, _status, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("kaierximrfz", {
  sex: "female",
  group: "luomrfz",
  hp: 3,
  skills: ["yuanlvemrfz", "chonggoumrfz", "yuanshimrfz", "m3mrfz"],
  isZhugong: true
});
skill({
  "yuanlvemrfz": {
    audio: 2,
    trigger: { player: "drawBegin" },
    forced: true,
    filter: function(event, player) {
      return event.getParent(1) && event.getParent(1).name != "yuanlvemrfz";
    },
    async content(event, trigger, player) {
      let num = 0;
      if (!player.storage.yuanshimrfz || player.storage.yuanshimrfz_gain) {
        num = trigger.num;
      } else {
        num = trigger.num + 1;
      }
      if (trigger.parent && trigger.parent.name !== "phaseDraw") {
        player.chooseToGuanxing(num);
        player.draw(num);
      } else {
        player.chooseToGuanxing(num + 1);
        player.draw(num + 1);
      }
      trigger.cancel();
    }
  },
  "chonggoumrfz": {
    intro: {
      content: "已修改【重构】。"
    },
    onremove: true,
    audio: 2,
    trigger: { player: "phaseDrawBegin2" },
    filter: function(event, player) {
      if (player.getDamagedHp() == 0 && !player.storage.chonggoumrfz) return false;
      return player.countCards("h") >= player.hp;
    },
    async content(event, trigger, player) {
      player.chooseToDiscard("h", player.countCards("h"), true);
      if (!player.storage.chonggoumrfz) {
        player.draw(player.countCards("h") - player.getDamagedHp());
      } else {
        player.draw(player.countCards("h"));
      }
      player.recover();
    }
  },
  "yuanshimrfz": {
    intro: {
      content: "令【远略】中的X+1。"
    },
    onremove: true,
    trigger: {
      global: "phaseBefore",
      player: "enterGame"
    },
    forced: true,
    audio: 3,
    direct: true,
    filter: function(event, player) {
      return (event.name != "phase" || game.phaseNumber == 0) && player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      var hs = player.getCards("h");
      if (hs.length) player.addGaintag(hs, "yuanshimrfz");
    },
    group: ["yuanshimrfz_basic", "yuanshimrfz_equip", "yuanshimrfz_trick", "yuanshimrfz_gain"],
    subSkill: {
      basic: {
        audio: "yuanshimrfz",
        trigger: {
          player: "useCard"
        },
        prompt: "是否令此牌不可响应",
        check: function(event, player) {
          if (event.card.name == "sha") return true;
          return false;
        },
        filter: function(event, player) {
          if (get.type(event.card) !== "basic") return false;
          return player.hasHistory("lose", function(evt) {
            if (event != evt.getParent()) return false;
            for (var i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player;
            })
          );
        },
        ai: {
          directHit_ai: true
        }
      },
      equip: {
        audio: "yuanshimrfz",
        trigger: { player: "useCard" },
        prompt: "是否摸一张牌",
        filter: function(event, player) {
          if (get.type(event.card) !== "equip" && get.type(event.card) !== "delay") return false;
          return player.hasHistory("lose", function(evt) {
            if (event != evt.getParent()) return false;
            for (var i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
          player.draw();
        }
      },
      trick: {
        audio: "yuanshimrfz",
        trigger: { player: "useCard" },
        prompt: function(event, player) {
          return "是否令" + get.translation(event.card) + "的目标+1/-1";
        },
        filter: function(event, player) {
          if (get.type(event.card) !== "trick") return false;
          return player.hasHistory("lose", function(evt) {
            if (event != evt.getParent()) return false;
            for (var i in evt.gaintag_map) {
              if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
            }
            return false;
          });
        },
        async content(event, trigger, player) {
          if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
          var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
          const result = await player.chooseTarget(get.prompt("yuanshimrfz"), function(card, player2, target) {
            var playerx = get.player();
            if (_status.event.targets.includes(target)) return true;
            return lib.filter.targetEnabled2(_status.event.card, playerx, target) && lib.filter.targetInRange(_status.event.card, playerx, target);
          }).set("prompt2", prompt2).set("ai", function(target) {
            var trigger2 = _status.event.getTrigger();
            var player2 = _status.event.player;
            return get.effect(target, trigger2.card, player2, player2) * (_status.event.targets.includes(target) ? -1 : 1);
          }).set("targets", trigger.targets).set("card", trigger.card).forResult();
          if (result.targets) {
            player.line(result.targets);
            if (trigger.targets.includes(result.targets[0])) trigger.targets.removeArray(result.targets);
            else trigger.targets.addArray(result.targets);
          }
        }
      },
      gain: {
        audio: "yuanshimrfz",
        trigger: { player: "loseAfter" },
        forced: true,
        filter: function(event, player) {
          if (player.storage.yuanshimrfz || player.storage.chonggoumrfz) return false;
          return !player.hasCard(function(card) {
            return card.hasGaintag("yuanshimrfz");
          }, "h");
        },
        async content(event, trigger, player) {
          if (!player.storage.yuanshimrfz_gain) {
            player.storage.yuanshimrfz = true;
            player.markSkill("yuanshimrfz");
          } else {
            player.storage.chonggoumrfz = true;
            player.markSkill("chonggoumrfz");
          }
        }
      }
    }
  },
  "m3mrfz": {
    audio: 2,
    trigger: {
      player: "dying"
    },
    zhuSkill: true,
    skillAnimation: true,
    animationColor: "red",
    mark: true,
    unique: true,
    limited: true,
    filter: function(event, player) {
      if (player.hp > 0) return false;
      return !player.storage.m3mrfz;
    },
    init: (player, skill2) => player.storage[skill2] = false,
    check: function(event, player) {
      var num = player.countCards("h", function(card) {
        return card.name == "tao" || card.name == "jiu";
      });
      return player.hp + num <= 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill("m3mrfz");
      player.removeSkill("chonggoumrfz");
      player.discard(player.getCards("hej"));
      player.recoverTo(2);
      player.storage.m3mrfz = true;
      player.loseMaxHp();
      player.turnOver(false);
      player.link(false);
      let targets = game.players.slice().remove(player);
      for (let target of targets) {
        const result = await target.chooseToDiscard(`【m3】:你可以弃置一张牌并令${get.translation(player)}摸一张牌`).set("ai", (card) => {
          const player2 = get.player();
          const targetx = get.event().targetx;
          if (get.attitude(player2, targetx) < 0) return -1;
          return 114514 - get.value(card);
        }).set("targetx", player).forResult();
        if (result.cards) {
          target.line(player);
          await player.draw();
        }
      }
    }
  }
});
translate({
  "kaierximrfz": "凯尔希",
  "yuanlvemrfz": "远略",
  "yuanlvemrfz_info": "锁定技，当你不因【远略】从牌堆获得牌时，你改为卜算X，然后摸X张牌，若此时是摸牌阶段，则令X+1。（X=此次摸牌数）",
  "chonggoumrfz": "重构",
  "chonggoumrfz_info": "摸牌阶段开始时，若你的手牌数不小于你的体力值<span class=thundertext>且已受伤</span>，你可以弃置所有手牌，回复一点体力，然后摸X张牌。（X=弃置牌的数量<span class=thundertext>-已损失体力值</span>）",
  "yuanshimrfz": "渊识",
  "yuanshimrfz_info": "①当你使用你的初始手牌时，若该牌是：基本牌：你可以令此牌不可响应；普通锦囊牌：你可令此牌目标+1/-1；延时锦囊牌或装备牌：你可以摸一张牌。②锁定技，当你失去了你的所有初始手牌时，若你没有发动过【渊识①】，则你令【远略】中的X+1，否则，你删除【重构】描述中的蓝色部分。",
  "m3mrfz": "M3",
  "m3mrfz_info": "主公技，限定技，当你进入濒死状态时，你可以弃置区域内所有牌并复原武将牌、失去【重构】、减少一点体力上限，将体力恢复至2点，然后其他所有角色选择是否弃置一张牌并令你摸一张牌。"
});
characterTitle("kaierximrfz", "<font color=rgb(255,45,62)>旧日残影</font>");
characterIntro("kaierximrfz", "凯尔希，罗德岛高层管理人员之一，罗德岛医疗项目领头人。在冶金工业、社会学、源石技艺、考古学、历史系谱学、经济学、植物学、地质学等领域皆拥有渊博学识。于罗德岛部分行动中作为医务人员提供医学理论协助与应急医疗器械，同时也作为罗德岛战略指挥系统的重要组成人员活跃在各项目中。");
//# sourceMappingURL=index.js.map
