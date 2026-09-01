import { get, game, lib, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spsongzangrenmrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "lamrfz",
  hp: 3,
  skills: ["chongdanmrfz", "tianxuanmrfz", "shengcaimrfz"]
});
skill({
  "chongdanmrfz": {
    audio: 2,
    frequent: true,
    subfrequent: ["chongdanmrfz_player"],
    trigger: {
      source: "damageSource"
    },
    filter: function(event, player) {
      if (player.countCards("h") == 0 && player.getDamagedHp() == 0) return false;
      return !player.storage.chongdanmrfz;
    },
    async content(event, trigger, player) {
      player.storage.chongdanmrfz = true;
      if (player.getDamagedHp() == 0) player.draw(player.hp);
      else {
        const result = await player.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？").set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力").set("ai", function() {
          var player2 = _status.event.player;
          var hp = player2.hp;
          if (player2.countCards("h") == 0) return 0;
          if (hp < 2) return 1;
          if (player2.countCards("j") > 0) return 1;
          if (player2.isPhaseUsing() && player2.countCards("h", function(card) {
            return card.name == "tao";
          }) >= player2.getDamagedHp())
            return 1;
          return 0;
        }).forResult();
        if (result.bool) {
          player.draw(player.hp);
        } else {
          player.recover(player.countCards("h"));
        }
      }
    },
    mod: {
      cardEnabled: function(card, player) {
        if (player.countMark("chongdanmrfz_lim") >= 2 * player.maxHp) return false;
      },
      cardUsable: function(card, player) {
        if (player.countMark("chongdanmrfz_lim") >= 2 * player.maxHp) return false;
      },
      cardSavable: function(card, player) {
        if (player.countMark("chongdanmrfz_lim") >= 2 * player.maxHp) return false;
      }
    },
    ai: {
      presha: true,
      pretao: true
    },
    group: ["chongdanmrfz_clear", "chongdanmrfz_player", "chongdanmrfz_lim"],
    subSkill: {
      lim: {
        mark: true,
        intro: {
          content: "已使用：#张牌"
        },
        silent: true,
        charlotte: true,
        firstDo: true,
        trigger: {
          player: "useCard"
        },
        filter: function(event, player) {
          return player.countMark("chongdanmrfz_lim") < 2 * player.maxHp;
        },
        async content(event, trigger, player) {
          player.addMark("chongdanmrfz_lim", 1, false);
        }
      },
      clear: {
        silent: true,
        charlotte: true,
        trigger: { global: "roundStart" },
        async content(event, trigger, player) {
          if (player.storage.chongdanmrfz_player) player.storage.chongdanmrfz_player = false;
          if (player.storage.chongdanmrfz) player.storage.chongdanmrfz = false;
          if (player.countMark("chongdanmrfz_lim") > 0)
            player.removeMark("chongdanmrfz_lim", player.countMark("chongdanmrfz_lim"), false);
        }
      },
      player: {
        audio: "chongdanmrfz",
        trigger: {
          player: "damageEnd"
        },
        filter: function(event, player) {
          if (player.countCards("h") == 0 && player.getDamagedHp() == 0) return false;
          return !player.storage.chongdanmrfz_player;
        },
        async content(event, trigger, player) {
          player.storage.chongdanmrfz_player = true;
          if (player.getDamagedHp() == 0) player.draw(player.hp);
          else {
            const result = await player.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？").set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力").set("ai", function() {
              var player2 = _status.event.player;
              var hp = player2.hp;
              if (player2.countCards("h") == 0) return 0;
              if (hp < 3) return 1;
              if (player2.countCards("j") > 0) return 1;
              if (player2.isPhaseUsing() && player2.countCards("h", function(card) {
                return card.name == "tao";
              }) >= player2.getDamagedHp())
                return 1;
              return 0;
            }).forResult();
            if (result.bool) {
              player.draw(player.hp);
            } else {
              player.recover(player.countCards("h"));
            }
          }
        }
      }
    }
  },
  "tianxuanmrfz": {
    audio: 2,
    mark: true,
    intro: {
      content: function(event, player) {
        return "已有的花色：" + get.translation(player.storage.tianxuanmrfz);
      }
    },
    trigger: {
      player: "useCard1"
    },
    filter: function(event, player) {
      return get.tag(event.card, "damage") > 0 && player.isPhaseUsing();
    },
    init: function(player) {
      player.storage.tianxuanmrfz = ["heart"];
    },
    prompt: function(event, player) {
      var list = player.storage.tianxuanmrfz;
      return "【天选】：是否进行判定，若为" + get.translation(list) + ",则" + get.translation(event.card) + "结算两次";
    },
    async content(event, trigger, player) {
      let list = player.storage.tianxuanmrfz;
      const { bool } = await player.judge(function(card) {
        for (var i = 0; i < list.length; i++) {
          var suit = get.suit(card);
          if (suit == list[i]) return -4;
        }
        return 0;
      }).set("judge2", (result) => result.bool == false ? true : false).forResult();
      if (bool == false) {
        trigger.effectCount++;
        player.storage.tianxuanmrfz = [];
        return;
      } else {
        let suit = player.storage.tianxuanmrfz;
        list = [];
        for (let i of lib.suit) {
          if (suit.includes(i)) continue;
          list.push(i);
        }
        const result = await player.chooseControl(list).set("prompt", "【天选】：请选择为[]内增加一个花色").set("ai", function() {
          if (list.includes("diamond")) return "diamond";
          return list.randomGet();
        }).forResult();
        if (result.control) {
          player.storage.tianxuanmrfz.add(result.control);
          player.storage.tianxuanmrfz.sort();
        }
      }
    }
  },
  "shengcaimrfz": {
    audio: 2,
    trigger: { player: "useCard2" },
    filter: function(event, player) {
      if (!get.tag(event.card, "damage") || !player.isPhaseUsing()) return false;
      return player.getHistory("useCard", function(evt) {
        return get.tag(evt.card, "damage") > 0;
      }).length > 1;
    },
    prompt: function(event, player) {
      return "【圣裁】：是否令" + get.translation(event.card) + "伤害基数+1？";
    },
    async content(event, trigger, player) {
      if (!trigger.baseDamage) trigger.baseDamage = 1;
      trigger.baseDamage++;
    },
    group: "shengcaimrfz_damage",
    subSkill: {
      damage: {
        direct: true,
        trigger: { player: "phaseEnd" },
        filter: function(event, player) {
          return game.countPlayer((current) => {
            return current != player && current.getHistory("damage").length > 0;
          }) > 0;
        },
        async content(event, trigger, player) {
          const next = player.chooseTarget(
            [1, Infinity],
            "【圣裁】：你可以对本回合造成过伤害的其他角色造成一点伤害",
            function(card, player2, target) {
              return target != player2 && target.getHistory("damage").length > 0;
            }
          );
          next.ai = function(target) {
            return get.attitude(player, target) < 0;
          };
          const result = await next.forResult();
          if (result.targets) {
            player.logSkill("shengcaimrfz");
            for (let i of result.targets) {
              i.damage("player");
              player.line(i);
            }
          }
        }
      }
    }
  }
});
translate({
  "spsongzangrenmrfz": "圣约送葬人",
  "spsongzangrenmrfz_prefix": "圣约",
  "chongdanmrfz": "铳弹",
  "chongdanmrfz_info": "锁定技，每轮你至多能使用2X张牌；每轮每项限一次你第一次[造成/受到]伤害后，你摸等同于你体力值张牌或回复等同你手牌数点体力。（X=你的体力上限）",
  "tianxuanmrfz": "天选",
  "tianxuanmrfz_info": "出牌阶段，每当你使用一张带有伤害类标签的牌时，你可以进行一次判定，若为[红桃]，此牌结算两次，然后你删除[]中的描述，反之你在[]内增加一种花色。",
  "shengcaimrfz": "圣裁",
  "shengcaimrfz_info": "①出牌阶段限一次，当你使用一张带有伤害类标签的牌选择目标后，若你本回合使用过带有伤害类标签的牌，你可以令该牌的造成的伤害+1。</br>②回合结束时，你可以对本回合受到过伤害的角色造成一点伤害。"
});
characterTitle("spsongzangrenmrfz", "<font color=#f1ca13>圣徒</font>");
characterIntro("spsongzangrenmrfz", "送葬人，拉特兰公证所法定专业执行者，适用于拉特兰一至十三项公民权益，由现任拉特兰教宗伊万杰利斯塔十一世亲自授予“圣徒”封号。</br>拉特兰并未限制这位特殊的“圣徒”与我们的接触，公证所与罗德岛的合作关系正日趋紧密。干员送葬人现仍旧依合约为罗德岛提供服务，执行拉特兰公民权益相关任务。");
//# sourceMappingURL=spsongzangrenmrfz.js.map
