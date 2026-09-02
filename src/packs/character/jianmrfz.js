import { get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("jianmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "xiemrfz",
  hp: 4,
  skills: ["weiyamrfz", "zhiwumrfz"]
});
skill({
  "weiyamrfz": {
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    onremove: true,
    mod: {
      targetInRange(card, player, target) {
        if (player.getStorage("weiyamrfz").includes(target)) return true;
      }
    },
    audio: 2,
    trigger: { source: "damageEnd" },
    filter: function(event, player) {
      return event.player != player && !event.player.hasSkill("weiyamrfz_ban") && event.player.isAlive();
    },
    prompt: function(event, player) {
      return "【威压】:是否令" + get.translation(event.player) + "下个出牌阶段不能使用带有伤害类标签的牌？";
    },
    check: function(event, player) {
      return get.attitude(event.player, player) < 0;
    },
    content: async function(event, trigger, player) {
      trigger.player.addTempSkill("weiyamrfz_ban", {
        player: "phaseUseEnd"
      });
      player.storage.weiyamrfz ??= [];
      player.storage.weiyamrfz.add(trigger.player);
    },
    subSkill: {
      ban: {
        charlotte: true,
        mark: true,
        marktext: "战栗",
        intro: {
          content: "出牌阶段不能使用带有伤害类标签的牌"
        },
        mod: {
          cardEnabled: function(card, player) {
            if (get.tag(card, "damage") > 0 && player.isPhaseUsing()) return false;
          }
        }
      }
    },
    ai: {
      expose: 0.2,
      threaten: 1.1,
      unequip: true,
      skillTagFilter(player, tag, arg) {
        return player.getStorage("weiyamrfz").includes(arg.target);
      }
    }
  },
  "zhiwumrfz": {
    mod: {
      cardname: function(card, player) {
        if (card.cardnameCheck) return card.name;
        card.cardnameCheck = true;
        let result;
        if (get.type(card) == "trick") result = "sha";
        else result = card.name;
        delete card.cardnameCheck;
        return result;
      }
    },
    audio: 2,
    forced: true,
    trigger: { player: "useCardToTargeted" },
    filter: function(event, player) {
      if (event.targets.length == 0) return false;
      return event.card.name == "sha" && get.color(event.card) != void 0;
    },
    content: async function(event, trigger, player) {
      var targets = trigger.targets;
      for (var i = 0; i < targets.length; i++) {
        if (targets[i].hasSkill("zhiwumrfz_ban")) continue;
        targets[i].addTempSkill("zhiwumrfz_ban");
        targets[i].storage.zhiwumrfz_ban = {
          player,
          color: get.color(trigger.card)
        };
        player.line(targets[i]);
      }
    },
    group: ["zhiwumrfz_count", "zhiwumrfz_draw"],
    subSkill: {
      draw: {
        forced: true,
        audio: "zhiwumrfz",
        trigger: { source: "damageEnd" },
        filter(event, player) {
          return player.getRoundHistory("sourceDamage", (evt) => evt.player === event.player).length === 1;
        },
        async content(event, trigger, player) {
          player.draw();
        }
      },
      count: {
        direct: true,
        trigger: { player: "useCard1" },
        filter: function(event, player) {
          if (!player.isPhaseUsing()) return false;
          if (!event.card || event.card.name != "sha") return false;
          if (event.addCount === false) return false;
          return event.card.cards.length > 1 || event.card.cards.length == 1 && event.cards[0].name != event.card.name;
        },
        content: async function(event, trigger, player) {
          trigger.addCount = false;
          if (player.stat[player.stat.length - 1].card.sha > 0) {
            player.stat[player.stat.length - 1].card.sha--;
          }
        }
      },
      ban: {
        onremove: true,
        mod: {
          cardEnabled: function(card, player) {
            if (get.color(card) == player.storage.zhiwumrfz_ban["color"]) return false;
          }
        },
        silent: true,
        charlotte: true,
        trigger: { global: "useCardAfter" },
        filter: function(event, player) {
          return event.card.name == "sha" && event.player == player.storage.zhiwumrfz_ban["player"];
        },
        async content(event, trigger, player) {
          delete player.storage.zhiwumrfz_ban;
          player.removeSkill("zhiwumrfz_ban");
        }
      }
    }
  }
});
translate({
  "jianmrfz": "锏",
  "weiyamrfz": "威压",
  "weiyamrfz_info": "当你对其他角色造成伤害后，你可以令：<br>➀其下个出牌阶段不能使用或打出带有伤害类标签的牌;<br>➁本局游戏你使用的牌对其无距离限制且无视防具。",
  "zhiwumrfz": "至武",
  "zhiwumrfz_info": "锁定技，</br>①你使用有颜色的【杀】不能被与此【杀】相同颜色的牌响应。</br>②你于出牌阶段使用的转化杀不计入次数限制。</br>③你的普通锦囊牌视为【杀】。<br>④当你对一名角色于每轮首次造成伤害后，你摸一张牌。"
});
characterIntro("jianmrfz", "锏，前卡西米尔骑士竞赛三届冠军，喀兰贸易总裁恩希欧迪斯的贴身保镖。基于博士与恩希欧迪斯签订的合同，无限期作为干员加入罗德岛。</br>现作为近卫干员活跃于各种任务之中，以其强大无比的战斗力为其他干员开辟道路。</br></br>我收到一些反馈，说大部分任务有她在的话，和野营没什么区别。这确实不怪博士，她主动去的，而且看起来她还挺乐在其中的。呃，那我也没什么理由反对，不是吗？</br>——■■■");
