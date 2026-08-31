import { _status, get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("qiubaimrfz", {
  sex: "female",
  group: "yanmrfz",
  hp: 4,
  skills: ["ruximrfz", "wenxuemrfz"]
});
skill({
  "ruximrfz": {
    audio: 4,
    trigger: { player: "useCardToPlayered" },
    filter: function(event, player) {
      if (event.target == player) return false;
      if (event.getParent()?.triggeredTargets3?.length > 1) return false;
      return event.card.name == "sha";
    },
    check: function(event, player) {
      return get.attitude(player, event.target) < 2;
    },
    subfrequent: ["link"],
    async content(event, trigger, player) {
      let result;
      const next = player.judge((card) => {
        const suit = get.suit(card);
        if (suit === "spade") return -2;
        if (suit === "club") return -4;
        return 0;
      });
      next.judge2 = (result2) => {
        return result2.bool === false;
      };
      result = await next.forResult();
      for (const target of trigger.targets) {
        if (result.color === "black") {
          target.link(true);
        }
        if (result.suit === "club") {
          player.addTempSkill("ruximrfz2", "phaseEnd");
          player.addMark("ruximrfz2", 1, false);
        }
      }
    },
    group: "ruximrfz_link",
    subSkill: {
      link: {
        trigger: { player: "useCardToPlayer" },
        filter: function(event, player) {
          if (event.target == player) return false;
          if (event.targets.length > 1) return false;
          return event.target.isLinked() || event.target.countCards("j") > 0;
        },
        frequent: true,
        async content(event, trigger, player) {
          const target = trigger.targets[0];
          let result;
          if (target.countCards("hej") === 0) {
            await player.draw();
            return;
          }
          result = await player.chooseBool(
            get.prompt("ruximrfz"),
            "【入隙】:是否摸一张牌</br>选择取消则为弃置" + get.translation(target) + "的区域内一张牌"
          ).set("ai", () => {
            const aiPlayer = _status.event.player;
            const att = get.attitude(aiPlayer, target);
            const num = Math.random();
            if (att > 2 && target.countCards("j") > 0) return false;
            return num > 0.5;
          }).forResult();
          if (result.bool) {
            await player.draw();
          } else {
            await player.discardPlayerCard(target, "hej", true);
            player.line(target);
          }
        }
      }
    }
  },
  "wenxuemrfz": {
    audio: 4,
    trigger: { player: "useCard2" },
    filter: function(event, player) {
      if (event.card.name != "sha") return false;
      return game.hasPlayer((current) => {
        return !event.targets.includes(current) && !!player.canUse(event.card, current) && player.inRange(current) && (current.isLinked() || current.countCards("j") > 0);
      });
    },
    direct: true,
    async content(event, trigger, player) {
      const result = await player.chooseTarget(
        [1, 2],
        get.prompt("wenxuemrfz"),
        "为" + get.translation(trigger.card) + "增加至多两个目标",
        function(card, player2, target) {
          return !_status.event.sourcex.includes(target) && player2.inRange(target) && player2.canUse(_status.event.card, target) && (target.isLinked() || target.countCards("j") > 0);
        }
      ).set("sourcex", trigger.targets).set("ai", function(target) {
        var player2 = _status.event.player;
        return get.effect(target, _status.event.card, player2, player2);
      }).set("card", trigger.card).setHiddenSkill(event.name).forResult();
      if (result.targets) {
        for (var i = 0; i < result.targets.length; i++) {
          player.logSkill("wenxuemrfz", result.targets[i]);
          trigger.targets.push(result.targets[i]);
        }
      }
    },
    group: ["wenxuemrfz_sha", "wenxuemrfz_count", "wenxuemrfz_clear"],
    subSkill: {
      sha: {
        direct: true,
        trigger: { player: "useCardAfter" },
        filter: function(event, player) {
          if (event.card.name != "sha") return false;
          if (!game.hasPlayer((current) => {
            return current != player && player.inRange(current) && !!player.canUse("sha", current);
          }))
            return false;
          var history = player.getHistory("useCard", function(evt) {
            return evt.card.name == "sha" && evt.cards && evt.cards.length == 1;
          });
          return history.length % 2 == 0 && event.cards && event.cards.length == 1;
        },
        async content(event, trigger, player) {
          let result;
          const history = player.getHistory("useCard", (evt) => {
            return evt.card.name === "sha" && evt.cards && evt.cards.length === 1;
          });
          event.num = history.length / 2;
          result = await player.chooseBool(get.prompt("wenxuemrfz"), "可以使用" + event.num + "张【杀】").forResult();
          if (result.bool) {
            while (event.num > 0) {
              await player.chooseUseTarget(
                {
                  name: "sha",
                  isCard: true
                },
                "请选择【杀】的目标 (还可使用" + event.num + "张【杀】)",
                false
              );
              event.num--;
              player.logSkill("wenxuemrfz");
            }
          }
        }
      },
      count: {
        silent: true,
        charlotte: true,
        trigger: { player: "useCard" },
        filter: function(event, player) {
          if (player == _status.currentPhase) return false;
          return event.card.name == "sha";
        },
        async content(event, trigger, player) {
          player.addMark("wenxuemrfz_count", 1, false);
        }
      },
      clear: {
        silent: true,
        charlotte: true,
        trigger: { player: "phaseEnd" },
        async content(event, trigger, player) {
          player.removeMark("wenxuemrfz_count", player.countMark("wenxuemrfz_count"), false);
        }
      }
    }
  }
});
translate({
  "qiubaimrfz": "仇白",
  "ruximrfz": "入隙",
  "ruximrfz_info": "当你使用的【杀】指定其他角色为目标后，你可以进行一次判定，若判定结果为黑色，则你横置该角色，若结果为♣，你本回合使用【杀】的次数+1；当你对横置的角色或判定区有牌的角色使用牌且此牌目标不大于1时，你可以弃置其区域内一张牌或者摸一张牌。",
  "wenxuemrfz": "问雪",
  "wenxuemrfz_info": "当你使用【杀】选择目标后，你可以令至多2名被横置的角色或判定区内有牌的角色（目标必须合法）成为此【杀】的目标；同一回合，每当你对其他角色累计使用2的X倍张的非虚拟【杀】时，你可以视为使用X张【杀】（不计入次数限制）。"
});
characterTitle("qiubaimrfz", "<font color=#1885f2>春江逢雪</font>");
characterIntro("qiubaimrfz", "仇白，剑客，出生于炎国姜齐城附近的水寨，后因家庭变故离开故乡，常年行走于炎国各地，并无固定居所与工作。</br>经调查，仇白曾在不同事件中与多位干员有过接触，后接受罗德岛的合作邀请，为罗德岛在炎国境内的各项事务提供支持。");
//# sourceMappingURL=index.js.map
