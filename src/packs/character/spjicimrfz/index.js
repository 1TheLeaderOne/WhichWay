import { get, game, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("spjicimrfz", {
  sex: "male",
  group: "yimrfz",
  hp: 3,
  skills: ["xinxiangmrfz", "haijiangmrfz", "fanyangmrfz"]
});
skill({
  "xinxiangmrfz": {
    mod: {
      maxHandcard: function(player, num) {
        return lib.skill.xinxiangmrfz.getLim(player);
      }
    },
    audio: 2,
    mark: true,
    init(player, skill2) {
      player.addMark(skill2, 5, false);
    },
    onremove(player, skill2) {
      delete player.storage.xinxiangmrfz;
      delete player.storage.xinxiangmrfz_tmp;
    },
    getLim(player) {
      return player.countMark("xinxiangmrfz") + player.countMark("xinxiangmrfz_tmp");
    },
    intro: {
      content(event, player) {
        return `当前手牌区上限:${lib.skill.xinxiangmrfz.getLim(player)}<br>临时上限:${player.countMark("xinxiangmrfz_tmp")}`;
      }
    },
    trigger: {
      global: "phaseEnd"
    },
    forced: true,
    filter(event, player) {
      return player.countCards("h") < lib.skill.xinxiangmrfz.getLim(player);
    },
    async content(event, trigger, player) {
      player.drawTo(lib.skill.xinxiangmrfz.getLim(player));
    },
    group: ["xinxiangmrfz_lim", "xinxiangmrfz_start"],
    subSkill: {
      tmp: {
        onremove(player, skill2) {
          delete player.storage.xinxiangmrfz_tmp;
          if (player.countCards("h") > player.countMark("xinxiangmrfz")) {
            player.chooseToDiscard(true, "【心相】：请弃置超出上限的手牌").set("selectCard", () => {
              let player2 = get.player();
              return player2.countCards("h") - player2.countMark("xinxiangmrfz");
            });
          }
        },
        charlotte: true
      },
      start: {
        audio: false,
        charlotte: true,
        silent: true,
        trigger: {
          global: "gameDrawBegin"
        },
        filter(event, player) {
          return lib.skill.xinxiangmrfz.getLim(player) < event.num;
        },
        async content(event, trigger, player) {
          var me = player;
          var numx = trigger.num;
          trigger.num = typeof numx == "function" ? function(player2) {
            if (player2 == me) {
              return lib.skill.xinxiangmrfz.getLim(player2);
            }
            return numx(player2);
          } : function(player2) {
            if (player2 == me) {
              return lib.skill.xinxiangmrfz.getLim(player2);
            }
            return numx;
          };
        }
      },
      lim: {
        audio: false,
        charlotte: true,
        silent: true,
        trigger: {
          player: ["drawBegin", "gainBegin"]
        },
        filter(event, player) {
          const cards = event.name === "draw" ? event.result : event.cards;
          const nums = lib.skill.xinxiangmrfz.getLim(player);
          return player.countCards("h") + cards.length > nums;
        },
        async content(event, trigger, player) {
          const cards = trigger.name === "draw" ? trigger.result : trigger.cards;
          const nums = lib.skill.xinxiangmrfz.getLim(player);
          if (player.countCards("h") >= nums) {
            trigger.cancel();
          } else {
            const { links: gaincards } = await player.chooseButton(["心相:请选择你要获得的牌", cards], true).set("ai", (button) => get.value(button.link)).set("selectButton", () => {
              let player2 = get.player();
              return lib.skill.xinxiangmrfz.getLim(player2) - player2.countCards("h");
            }).forResult();
            trigger.cancel();
            if (!gaincards) return;
            player.gain(gaincards, event.name === "draw" ? "draw2" : "gain2");
          }
        }
      }
    },
    ai: {
      nogain: true,
      skillTagFilter: function(player) {
        console.log(arguments);
        return player.countCards("h") >= lib.skill.xinxiangmrfz.getLim(player);
      }
    }
  },
  "haijiangmrfz": {
    audio: 2,
    trigger: {
      player: "phaseJieshuBegin"
    },
    filter(event, player) {
      return player.countCards("h") > 0 && game.hasPlayer((current) => player.canCompare(current) && current != player && player.inRange(current));
    },
    check(event, player) {
      return game.hasPlayer((current) => {
        return get.attitude2(current) < 0 && player.canCompare(current) && current != player && player.inRange(current);
      });
    },
    async content(event, trigger, player) {
      const { targets } = await player.chooseTarget({
        forced: true,
        selectTarget: [1, Infinity]
      }).set("filterTarget", (card, player2, target) => {
        return player2.canCompare(target) && player2 != target && player2.inRange(target);
      }).set("ai", (target) => get.attitude2(target) < 0).forResult();
      if (targets && targets.length) {
        const result = await player.chooseToCompare(targets).forResult();
        if (!result.targets) {
          return;
        }
        for (let i = 0; i < result.targets.length; i++) {
          const target = targets[i];
          const playerNum = result.num1[i];
          const targetNum = result.num2[i];
          if (![playerNum, targetNum].every((i2) => typeof i2 === "number")) continue;
          if (playerNum > targetNum) {
            await target.damage();
            player.addMark("xinxiangmrfz_tmp", 1, false);
            player.addTempSkill("xinxiangmrfz_tmp", { player: "phaseJieshuBegin" });
          } else {
            await player.chooseToDiscard().set("forced", true);
          }
        }
      }
    }
  },
  "fanyangmrfz": {
    audio: 2,
    intro: {
      content: "你计算与其他角色的距离-#<br>其他角色计算与你的距离+#"
    },
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return player.countCards("he") > 0 && event.num > 0;
    },
    getIndex(event, player, triggername) {
      return event.num;
    },
    async cost(event, trigger, player) {
      const { bool } = await player.chooseToDiscard("he").set("prompt", get.prompt("fanyangmrfz")).set("prompt2", `你可以弃置一张手牌，然后直到你的回合结束时，[你/其他角色]计算与[其他角色/你]的距离[-1/+1]`).set("ai", (card) => get.value(card) < 8).forResult();
      event.result = {
        bool
      };
    },
    async content(event, trigger, player) {
      player.addMark("fanyangmrfz", 1, false);
      player.addTempSkill("fanyangmrfz_eff", { player: "phaseEnd" });
    },
    subSkill: {
      eff: {
        charlotte: true,
        onremove(player) {
          delete player.storage.fanyangmrfz;
          player.unmarkSkill("fanyangmrfz");
        },
        mod: {
          globalFrom(from, to, distance) {
            return distance - from.countMark("fanyangmrfz");
          },
          globalTo(from, to, distance) {
            return distance + to.countMark("fanyangmrfz");
          }
        }
      }
    }
  }
});
translate({
  "spjicimrfz": "引星棘刺",
  "spjicimrfz_prefix": "引星",
  "xinxiangmrfz": "心相",
  "xinxiangmrfz_info": "锁定技。<br>①你的手牌区上限数初始为5，你的手牌上限为你的手牌区上限，你的手牌数至多为你手牌区上限。<br>②任意回合结束时，你将手牌补至手牌区上限数。",
  "haijiangmrfz": "海疆",
  "haijiangmrfz_info": "结束阶段，你可以与攻击范围内的任意名角色同时拼点，若你赢，你对其造成一点伤害，且直到你的下个结束阶段，你手牌区上限+1，反之，你弃置一张手牌。",
  "fanyangmrfz": "帆扬",
  "fanyangmrfz_info": "当你受到一点伤害后，你可以弃置一张牌，然后直到你的回合结束时，[你/其他角色]计算与[其他角色/你]的距离[-1/+1]。"
});
characterTitle("spjicimrfz", "<font color='#00008b'>帆扬海疆</font>");
characterIntro("spjicimrfz", "棘刺，前罗德岛前线作战干员，如今以独立探险船兼科考船兼捕鳞船兼货运船兼海盗船——宝宝摇篮号船长的身份，与罗德岛保持合作关系。罗德岛定期为宝宝摇篮号提供医疗与物资支持，棘刺则为罗德岛提供诸多与海洋相关的便利，以及接触伊比利亚土地上许多不受审判庭管辖的偏远聚落的渠道。");
//# sourceMappingURL=index.js.map
