import { get, game, lib } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("helagemrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "wumrfz",
  hp: 4,
  skills: ["yingkuimrfz", "cangfengmrfz", "yuexiangmrfz"]
});
skill({
  "yingkuimrfz": {
    mod: {
      cardname: function(card, player) {
        if (card.name == "tao") return "sha";
      },
      maxHandcard: function(player, num) {
        return num += 2;
      }
    },
    audio: 2,
    forced: true,
    firstDo: true,
    trigger: { player: "useCard" },
    filter: function(event, player) {
      if (get.name(event.card) != "sha") return false;
      return event.card && event.card.cards && event.card.cards.length == 1 && event.card.cards[0].name == "tao";
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(
        game.filterPlayer(function(current) {
          return current != player;
        })
      );
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        var cards = arg.card.cards;
        if (get.name(arg.card) != "sha" || !cards || cards.length != 1) return false;
        if (cards[0].name != "tao") return false;
        return true;
      }
    }
  },
  "cangfengmrfz": {
    audio: 2,
    direct: true,
    trigger: { source: "damageEnd" },
    intro: {
      content: "#/2"
    },
    onremove: true,
    async content(event, trigger, player) {
      let result;
      var mark = player.countMark("cangfengmrfz");
      await player.addMark("cangfengmrfz", trigger.num, false);
      if (mark / 2 >= 1 && player.getDamagedHp() > 0) {
        result = await player.chooseControl("摸牌", "回血").set("prompt", "摸一张牌或回一点血").forResult();
      } else if (mark / 2 < 1) return;
      if (result && result.control == "回血") player.recover();
      else player.draw();
      player.logSkill("cangfengmrfz");
      await player.removeMark("cangfengmrfz", 2);
      if (mark / 2 >= 1) await lib.skill.cangfengmrfz.content(event, trigger, player);
    }
  },
  "yuexiangmrfz": {
    intro: {
      content: function(event, player) {
        if (player.getDamagedHp() >= 3) {
          return "<span class=firetext>满月</span> <span class=thundertext>弦月 新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1</br>·出牌阶段使用的第一张【杀】结算两次</br>·出牌阶段你使用的第一张【杀】目标+1；攻击距离+2";
        }
        if (player.getDamagedHp() == 2) {
          return "满月 <span class=firetext>弦月</span> <span class=thundertext>新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1</br>·出牌阶段使用的第一张【杀】结算两次";
        }
        if (player.getDamagedHp() == 1) {
          return "满月 弦月 <span class=firetext>新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1";
        }
        return "满月 弦月 新月";
      }
    },
    audio: 3,
    trigger: { player: ["phaseBefore", "changeHp"] },
    direct: true,
    popup: false,
    mark: true,
    init: function(player) {
      if (game.online) return;
      player.removeAdditionalSkill("yuexiangmrfz");
      var list = [];
      if (player.getDamagedHp() >= 3) {
        list.push("yuexiangmrfz_man");
      }
      if (player.getDamagedHp() >= 2) {
        list.push("yuexiangmrfz_xian");
      }
      if (player.getDamagedHp() >= 1) {
        list.push("yuexiangmrfz_xin");
      }
      if (list.length) {
        player.addAdditionalSkill("yuexiangmrfz", list);
      }
    },
    async content(event, trigger, player) {
      player.removeAdditionalSkill("yuexiangmrfz");
      var list = [];
      if (player.getDamagedHp() >= 3) {
        list.push("yuexiangmrfz_man");
      }
      if (player.getDamagedHp() >= 2) {
        list.push("yuexiangmrfz_xian");
      }
      if (player.getDamagedHp() >= 1) {
        if (trigger.num != void 0 && trigger.num < 0 && player.getDamagedHp() - trigger.num > 1) player.logSkill("yingkuimrfza");
        list.push("yuexiangmrfz_xin");
      }
      if (list.length) {
        player.addAdditionalSkill("yuexiangmrfz", list);
      }
    },
    ai: {
      maixie: true,
      effect: {
        target: function(card, player, target) {
          if (get.tag(card, "damage")) {
            if (!target.hasFriend()) return;
            if (target.hp >= 4) return [0, 1];
          }
          if (get.tag(card, "recover") && player.hp >= player.maxHp - 2) return [0, 0];
        }
      }
    },
    group: "yuexiangmrfz_clear",
    subSkill: {
      clear: {
        silent: true,
        direct: true,
        charlotte: true,
        trigger: { player: "phaseUseEnd" },
        async content(event, trigger, player) {
          player.storage.yuexiangmrfz_man = false;
          if (player.hasMark("yuexiangmrfz_xin")) {
            player.removeMark("yuexiangmrfz_xin", player.countMark("yuexiangmrfz_xin"));
            player.unmarkSkill("yuexiangmrfz_xin");
          }
        }
      },
      man: {
        direct: true,
        charlotte: true,
        firstDo: true,
        trigger: { player: "shaAfter" },
        filter: function(event, player) {
          return !player.storage.yuexiangmrfz_man;
        },
        async content(event, trigger, player) {
          player.storage.yuexiangmrfz_man = true;
        },
        mod: {
          selectTarget: function(card, player, range) {
            if (card.name == "sha" && range[1] != -1 && !player.storage.yuexiangmrfz_man) range[1]++;
          },
          attackRange: function(player, num) {
            return num += 2;
          }
        }
      },
      xian: {
        trigger: { player: "useCardToTargeted" },
        charlotte: true,
        forced: true,
        popup: false,
        lastDo: true,
        usable: 1,
        filter: function(event, player) {
          return event.card.name == "sha" && event.parent && event.targets.length == event.parent.triggeredTargets4.length;
        },
        async content(event, trigger, player) {
          if (!trigger.parent) return;
          trigger.parent.targets = trigger.parent.targets.concat(trigger.targets);
          trigger.parent.triggeredTargets4 = trigger.parent.triggeredTargets4.concat(trigger.targets);
          player.logSkill("yuexiangmrfz");
        }
      },
      xin: {
        group: "yuexiangmrfz_xin2",
        mod: {
          cardUsable: function(card, player, num) {
            if (card.name == "sha") return num += Math.floor(player.countMark("yuexiangmrfz_xin") / 2) + 1;
          }
        },
        intro: {
          content: function(event, player) {
            return "本回合使用【杀】的次数+" + (Math.floor(player.countMark("yuexiangmrfz_xin") / 2) + 1);
          }
        },
        direct: true,
        trigger: { player: "shaAfter" },
        async content(event, trigger, player) {
          player.addMark("yuexiangmrfz_xin");
          if (player.countMark("yuexiangmrfz_xin") % 2 == 0) player.logSkill("yuexiangmrfz");
        }
      },
      xin2: {
        direct: true,
        trigger: { source: "damageBegin3" },
        usable: 1,
        filter: function(event) {
          return event.card && event.card.name == "sha";
        },
        async content(event, trigger, player) {
          trigger.num++;
        }
      }
    }
  }
});
translate({
  "helagemrfz": "赫拉格",
  "yingkuimrfz": "盈亏",
  "yingkuimrfz_info": "锁定技，你的手牌上限+2；你的【桃】均视为【杀】，你以此法转换的【杀】不可响应。",
  "cangfengmrfz": "藏锋",
  "cangfengmrfz_info": "锁定技，每当你累计造成2点伤害时，你选择回复一点体力或摸一张牌。",
  "yuexiangmrfz": "月相",
  "yuexiangmrfz_info": "锁定技，根据你已损失的体力值，获得以下效果：①大于等于1：你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1；②大于等于2：出牌阶段使用的第一张【杀】结算两次；③大于等于3：出牌阶段你使用的第一张【杀】目标+1；攻击距离+2。"
});
characterIntro("helagemrfz", "赫拉格，曾隶属于乌萨斯帝国近卫军，切尔诺伯格感染者地下诊所“阿撒兹勒”的现任管理者，其他相关履历缺失。拥有成熟的军事理论体系知识，战斗技巧几乎能满足绝大部分类型作战的需求。现正依合作协议长驻罗德岛，为罗德岛提供战术指挥支援。");
