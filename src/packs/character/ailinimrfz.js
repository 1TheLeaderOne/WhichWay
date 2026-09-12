import { get, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("ailinimrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "yimrfz",
  hp: 3,
  skills: ["zhidengmrfz", "shenpanmrfz", "liechaomrfz"]
});
skill({
  "zhidengmrfz": {
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    audio: 2,
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget(
        {
          prompt: "是否发动【执灯】",
          prompt2: `准备阶段，你可以令至多${player.hp}名体力值不大于你的角色摸一张牌，然后你摸一张牌。`,
          filterTarget(card, player2, target) {
            return target.hp <= player2.hp;
          },
          selectTarget() {
            return [0, get.player().hp];
          },
          ai(target) {
            let att = get.attitude2(target);
            if (get.player() === target) att += 3;
            return att;
          }
        }
      ).forResult();
    },
    async content(event, trigger, player) {
      const { targets } = event;
      game.asyncDraw(targets);
      if (!player.storage._sjzxAch_denghuoweimingmrfz) player.storage._sjzxAch_denghuoweimingmrfz = 0;
      if (targets.length >= 2) player.storage._sjzxAch_denghuoweimingmrfz++;
    }
  },
  "shenpanmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget: function(card, player, target) {
      return player.canCompare(target);
    },
    filter: function(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      const { target } = event;
      const result = await player.chooseToCompare(target).forResult();
      if (result.bool) {
        target.addTempSkill("shenpanmrfz2");
        player.addTempSkill("shenpanmrfz3");
        player.storage.shenpanmrfz3 = target;
      }
    },
    ai: {
      order: 10,
      result: {
        player: function(player) {
          if (player.countCards("h", "sha") > 0) return 0.6;
          let num = player.countCards("h");
          if (num > player.hp) return 0;
          if (num == 1) return -2;
          if (num == 2) return -1;
          return -0.7;
        },
        target: function(player, target) {
          let num = target.countCards("h");
          if (num == 1) return -1;
          if (num == 2) return -0.7;
          return -0.5;
        }
      },
      threaten: 1.3
    }
  },
  "shenpanmrfz2": {
    charlotte: true,
    mark: true,
    intro: {
      content: "伊比利亚审判庭裁决你为异端"
    }
  },
  "shenpanmrfz3": {
    mod: {
      globalFrom: function(from, to) {
        if (to == from.storage.shenpanmrfz3) {
          return -Infinity;
        }
      }
    },
    trigger: {
      player: "useCardToPlayered"
    },
    forced: true,
    charlotte: true,
    filter: function(event, player) {
      return event.target.hasSkill("shenpanmrfz2") && event.target.countCards("he") > 0;
    },
    check: function(event, player) {
      return get.attitude(player, event.player) < 0;
    },
    async content(event, trigger, player) {
      const result = await trigger.target.chooseToDiscard({
        position: "he",
        forced: true,
        prompt: "【审判】:请弃置一张牌"
      }).forResult();
      if (result.cards && result.cards.length > 0) player.gain({ cards: result.cards, animate: "gain2" });
    }
  },
  "liechaomrfz": {
    audio: 2,
    trigger: {
      source: "damageBegin3"
    },
    filter: function(event) {
      if (event.parent === void 0 || event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
      if (event.card) {
        if (event.player.countCards("he") == 0) return true;
      }
      return false;
    },
    async content(event, trigger, player) {
      trigger.num++;
    },
    ai: {
      effect: {
        player: function(card, player, target, current) {
          if (card.name == "sha" && target.countCards("h") == 0 && !target.hasSkillTag("filterDamage", null, {
            player,
            card
          }))
            return [1, 0, 1, -3];
        }
      }
    }
  }
});
translate({
  "ailinimrfz": "艾丽妮",
  "zhidengmrfz": "执灯",
  "zhidengmrfz_info": "准备阶段，你可以令至多X名体力值不大于你的角色摸一张牌，然后你摸一张牌。（X=你的体力值）",
  "zhidengmrfz2": "执灯",
  "zhidengmrfz2_info": "",
  "shenpanmrfz": "审判",
  "shenpanmrfz_info": "出牌阶段限一次，你可以与一名其他角色拼点，若你赢，则①本回合当其成为你使用的牌的目标时，其需弃置一张牌，然后当此牌进入弃牌堆时，你获得之；②本回合你与其的距离视为1。",
  "shenpanmrfz2": "审判",
  "shenpanmrfz2_info": "",
  "shenpanmrfz3": "审判",
  "shenpanmrfz3_info": "",
  "liechaomrfz": "裂潮",
  "liechaomrfz_info": "当你造成伤害时，若其没有牌，则你可以令此伤害+1。"
});
characterIntro("ailinimrfz", "艾丽妮，前伊比利亚审判官，大审判官达里奥的学生。对伊比利亚历史、律法、人文地理等知识十分了解。在“愚人号”事件后，辞去审判官职务，经凯尔希亲自推荐，现以审判庭信使的身份与罗德岛签订合作协议，为应对来自海洋的威胁而做准备。");
