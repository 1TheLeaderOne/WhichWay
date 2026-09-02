import { get, _status, lib } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("shixiemrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "samrfz",
  hp: 3,
  skills: ["qianzongmrfz", "xiedumrfz", "lijimrfz"],
  hasHiddenSkill: true
});
skill({
  "qianzongmrfz": {
    audio: 2,
    trigger: {
      player: "showCharacterAfter"
    },
    direct: true,
    hiddenSkill: true,
    filter: function(event, player) {
      return event.toShow.includes("shixiemrfz");
    },
    async content(event, trigger, player) {
      if (player == _status.currentPhase) {
        let list = ["摸一张牌"];
        if (player.getDamagedHp() > 0) list.push("回复体力");
        list.push("cancel2");
        const { control } = await player.chooseControl(list).set("prompt", "【潜踪】:你可以回复一点体力或摸一张牌").set("ai", function() {
          var player2 = _status.event.player;
          if (player2.hp < 3) return "回复体力";
          return "摸一张牌";
        }).forResult();
        if (!control || control == "cancel2") return;
        switch (control) {
          case "摸一张牌":
            player.draw();
            break;
          case "回复体力":
            player.recover();
        }
        player.logSkill("qianzongmrfz");
      } else {
        const { targets } = await player.chooseTarget().set("prompt", "【潜踪】:你可以对一名其他角色造成一点伤害").set("filterTarget", lib.filter.notMe).set("ai", function(target) {
          var player2 = _status.event.player;
          return get.attitude(target, player2) < 0;
        }).forResult();
        if (!targets) return;
        player.logSkill("qianzongmrfz", targets[0]);
        targets[0].damage();
      }
    },
    group: "qianzongmrfz_rehidden",
    subSkill: {
      rehidden: {
        direct: true,
        trigger: { player: "phaseEnd" },
        filter: function(event, player) {
          return player.getHistory("lose", function(evt) {
            return evt.type == "discard";
          }).length == 0 && !player.isUnseen();
        },
        async content(trigger, event, player) {
          const { bool } = await player.chooseBool().set("prompt", "【潜踪】:是否进入隐匿状态？").forResult();
          if (bool != true) return;
          player.reUnseen();
        }
      }
    }
  },
  "xiedumrfz": {
    mod: {
      cardname(card, player) {
        if (card.name == "du") return "sha";
      }
    },
    audio: 2,
    trigger: { source: "damageSource" },
    filter: function(event, player) {
      return event.player.isIn() && event.player.countCards("he") > 0 && (player != _status.currentPhase || event.card && event.card.name == "sha");
    },
    async content(trigger, event, player) {
      var target = event.player;
      const { cards } = await player.choosePlayerCard(target, "he", true, 1, "【蝎毒】:请选择一张牌").set("ai", (button) => {
        return get.value(button.link);
      }).forResult();
      if (!cards) return;
      for (var i of cards) {
        if (get.position(i) == "e") {
          target.discard(i);
          continue;
        }
        i.init([i.suit, i.number, "du"]);
      }
    }
  },
  "lijimrfz": {
    audio: 2,
    trigger: {
      player: "useCardToPlayered"
    },
    mark: true,
    intro: {
      markcount: function(storage, player) {
        let list = [];
        player.getHistory("useCard", function(evt) {
          list.add(get.suit(evt.card));
        });
        return `${list.length}`;
      },
      content: function(event, player, skill2) {
        let list = [];
        player.getHistory("useCard", function(evt) {
          list.add(get.suit(evt.card));
        });
        return `你使用的【杀】需要${list.length}张【闪】才可抵消<br>已经使用的花色：${get.translation(list)}`;
      }
    },
    forced: true,
    filter(event, player) {
      return event.card.name == "sha" && !event.getParent().directHit.includes(event.target);
    },
    logTarget: "target",
    async content(event, trigger, player) {
      let list = [];
      await player.getHistory("useCard", function(evt) {
        list.add(get.suit(evt.card));
      });
      const needNum = list.length;
      const id = trigger.target.playerid;
      const map = trigger.getParent()?.customArgs;
      if (!id || !map) return;
      if (!map[id]) map[id] = {};
      if (typeof map[id].shanRequired == "number") {
        map[id].shanRequired = needNum;
      } else {
        map[id].shanRequired = needNum;
      }
    },
    ai: {
      directHit_ai: true,
      skillTagFilter(player, tag, arg) {
        let list = [];
        player.getHistory("useCard", function(evt) {
          list.add(get.suit(evt.card));
        });
        if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > list.length) return false;
      }
    }
  }
});
translate({
  "shixiemrfz": "狮蝎",
  "qianzongmrfz": "潜踪",
  "qianzongmrfz_info": "①隐匿技，当你登场后，若当前回合角色不为你，你可以对当前回合角色造成一点伤害，反之，你摸一张牌或回复一点体力。<br>②你的回合结束时，若你本回合没有因弃置而失去牌，你可以进入隐匿状态。",
  "xiedumrfz": "蝎毒",
  "xiedumrfz_info": "①锁定技，你的【毒】视为【杀】。<br>②当你[使用的【杀】/于回合外]对一名其他角色造成伤害后，你可以选择其一张牌（若为装备区的牌则改为弃置之），然后其将此牌转化为【毒】。",
  "lijimrfz": "力积",
  "lijimrfz_info": "锁定技，你使用的【杀】需要X张【闪】才可抵消。（X=本回合你使用的牌的花色数）"
});
characterIntro("shixiemrfz", "狮蝎，履历大部分缺失，已知其入职前曾从事指定对象清除工作，推测身份：杀手。在潜伏、侵扰、突袭敌军阵线等行动中均表现出过硬的战斗技巧。<br>现作为特种干员，为罗德岛提供特别行动服务。");
