import { get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("tianhuomrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 3,
  skills: ["zhuihuomrfz", "yihuomrfz"]
});
skill({
  "zhuihuomrfz": {
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    audio: 2,
    enable: "phaseUse",
    filter: function(event, player) {
      return player.countCards("hs", (card) => {
        return get.name(card) == "sha" && get.nature(card) == "fire" || get.name(card) == "huogong";
      }) > 0;
    },
    filterCard: function(card) {
      return get.name(card) == "sha" && get.nature(card) == "fire" || get.name(card) == "huogong";
    },
    filterTarget: function(card, player, target) {
      return target != player && !player.storage.zhuihuomrfz.includes(target);
    },
    discard: false,
    lose: false,
    delay: false,
    async content(event, trigger, player) {
      const { target, cards } = event;
      player.storage.zhuihuomrfz.add(target);
      target.addJudge({ name: "sjzx_zhuihuomrfz" }, cards);
    },
    ai: {
      order: 5,
      result: {
        player: 1,
        target: function(player, target) {
          if (get.attitude(player, target) < 0 && target.getCards("j", function(card) {
            return get.name(card) == "sjzx_zhuihuomrfz";
          }).length < target.hp) {
            if (target.countCards("he") < 2 && target.hp < 2) return -3;
            if (target.countCards("he") < 2) return -2;
          }
          return -1;
        }
      }
    },
    group: ["zhuihuomrfz_clear"],
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        trigger: { player: "phaseUseEnd" },
        async content(event, trigger, player) {
          player.storage.zhuihuomrfz = [];
        }
      }
    }
  },
  "yihuomrfz": {
    mod: {
      cardname: function(card, player) {
        if (card.storage && card.storage.yihuomrfz == true) return "sha";
      },
      cardnature: function(card, player) {
        if (card.storage && card.storage.yihuomrfz == true) return "fire";
      }
    },
    audio: 2,
    trigger: {
      global: "damageEnd"
    },
    usable: 2,
    filter: function(event, player) {
      return event.nature == "fire";
    },
    forced: true,
    async content(event, trigger, player) {
      player.draw(2);
    },
    ai: {
      effect: {
        target: function(card, player, target, current) {
          if (get.tag(card, "respondSha") && current < 0) return 0.6;
        }
      },
      respondSha: true
    },
    group: ["yihuomrfz_gain", "yihuomrfz_cancel"],
    subSkill: {
      cancel: {
        direct: true,
        trigger: { player: "damageBegin4" },
        filter: function(event, player) {
          return event.nature == "fire";
        },
        async content(event, trigger, player) {
          trigger.cancel();
          player.draw(3);
          player.logSkill("yihuomrfz");
        },
        ai: {
          effect: {
            target: function(card, player, target) {
              if (get.tag(card, "fireDamage")) return [0, 1];
            }
          }
        }
      },
      gain: {
        direct: true,
        trigger: { player: "gainAfter" },
        filter: function(event, player) {
          if (!event.cards || event.cards.length < 2) return false;
          return event.cards.some((element) => player.getCards("h").includes(element));
        },
        async content(event, trigger, player) {
          const result = await player.chooseCard(true, "【溢火】:请选择一张牌，令此牌视为火【杀】", function(card) {
            return trigger.cards.includes(card);
          }).set("ai", function(card) {
            return -get.value(card);
          }).forResult();
          if (result.cards) {
            result.cards[0].storage.yihuomrfz = true;
          }
          var color, bool = true;
          for (var i of trigger.cards) {
            if (typeof color !== "string") color = get.color(i, player);
            if (get.color(i, player) != color) {
              bool = false;
              break;
            }
          }
          if (bool == true) player.draw();
          player.logSkill("yihuomrfz");
        }
      }
    }
  }
});
translate({
  "tianhuomrfz": "天火",
  "zhuihuomrfz": "坠火",
  "zhuihuomrfz_info": "出牌阶段每名角色限一次，你可以将【火攻】或火【杀】置于一名其他角色的判定区，其判定阶段开始时须选择弃置两张牌或受到一点火焰伤害，然后将因此置于判定区的牌置入弃牌堆。",
  "yihuomrfz": "溢火",
  "yihuomrfz_info": "锁定技。</br>①每回合限两次，当其他角色受到火焰伤害后，你摸两张牌。</br>②当你于一次获得了至少两张牌后，你选择其中一张牌，你将此牌视为火【杀】，若这些牌颜色全部相同，你摸一张牌。</br>③当你受到火焰伤害时，你摸三张牌并防止此次伤害。"
});
characterIntro("tianhuomrfz", "天火，隶属民间源石技艺研究会“狐尾”的核心团体“王者之杖”。拥有地质学与源石地质学双学位，维多利亚高等职业术师，在源石技艺及理论研究方面皆有杰出造诣。</br>现任王者之杖驻罗德岛首席术师，与罗德岛签署合作协议，并为罗德岛的源石理论研究，歼灭战作战等多项任务提供协助。");
