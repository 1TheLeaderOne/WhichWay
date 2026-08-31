import { get, _status, ui, lib, game } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("sikadimrfz", {
  sex: "female",
  group: "liemrfz",
  hp: 4,
  skills: ["jingliemrfz", "shulangmrfz", "tongmaimrfz"],
  clans: ["深海猎人"]
});
skill({
  "jingliemrfz": {
    audio: 2,
    trigger: {
      player: "phaseZhunbeiBegin"
    },
    filter(event, player) {
      return game.hasPlayer((current) => {
        return current != player && current.countCards("h") > 0;
      });
    },
    async cost(event, trigger, player) {
      const { result } = await player.chooseTarget().set("prompt", get.prompt("shulangmrfz")).set(
        "prompt2",
        `你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
      ).set("filterTarget", (card, player2, target) => player2 != target && target.countCards("h") > 0).set("ai", (target) => {
        var player2 = get.event().player;
        var att = get.attitude(player2, target), num = 0;
        if (att >= 0) num += 2;
        else num += 5 + target.getDamagedHp();
        return num += target.countCards("h") / 2;
      });
      event.result = result;
    },
    async content(event, trigger, player) {
      let target = event.targets[0];
      if (target.countCards("h") == 1) player.viewHandcards(target);
      const { links } = await player.choosePlayerCard(target, true, "visible").set("prompt", "【鲸猎】:请选择一张牌").set("position", "h").set("ai", (button) => {
        var player2 = get.event().player, num = get.value(button);
        if (player2.hasUseTarget(button, false)) num += 10;
        if (get.tag(button, "damage")) num += 2;
        if (get.type2(button) == "equip") num -= 10;
        return num;
      }).forResult();
      if (!links) return;
      let choiceList = [
        `失去一点体力，令${get.translation(player)}获得${get.translation(links[0])}`,
        `令${get.translation(player)}视为使用${get.translation(links[0])}，若此牌不能被${get.translation(player)}使用，则改为摸一张牌，然后本回合结束阶段时${get.translation(player)}发动一次【鲸猎】`,
        `对${get.translation(player)}使用一张【杀】，若此杀造成伤害，${get.translation(player)}翻面，反之执行其他两项`
      ], list = ["选项一", "选项二"];
      if (target.hasSha() && target.canUse({ name: "sha" }, player, false)) list.push("选项三");
      else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（没有或无法使用【杀】）</span>";
      const { index } = await target.chooseControl(list).set("choiceList", choiceList).set("ai", () => {
        var player2 = get.event().player, target2 = _status.event.targetx, list2 = _status.event.list, card = _status.event.cardx;
        if (get.attitude(player2, target2) > 0) return 1;
        else {
          if (!target2.hasUseTarget(card, false)) return 1;
          if (list2.length > 2 && target2.mayHaveShan(
            player2,
            "use",
            target2.getCards("h", (i2) => {
              return i2.hasGaintag("sha_notshan");
            })
          ) && Math.random() > 0.5) {
            for (var i of player2.getCards("h", "sha")) {
              if (get.effect(target2, i, player2, player2) > 0) return 2;
            }
          }
          if (player2.hp == 1) return 1;
          return 0;
        }
      }).set("targetx", player).set("list", list).set("cardx", links[0]).forResult();
      if (typeof index !== "number") return;
      var next = game.createEvent("jingliemrfz_after");
      next.player = player;
      next.target_jingliemrfz = target;
      next.card_jingliemrfz = links[0];
      next.setContent(lib.skill.jingliemrfz["index_" + index]);
    },
    async index_0(event, trigger, player) {
      let target = event.target_jingliemrfz, card = event.card_jingliemrfz;
      await player.gain(card, "gain2");
      target.loseHp();
    },
    async index_1(event, trigger, player) {
      event.target_jingliemrfz;
      let card = event.card_jingliemrfz;
      if (player.hasUseTarget(card, false))
        player.chooseUseTarget(
          {
            name: card.name,
            suit: card.suit,
            number: card.number
          },
          false
        );
      else player.draw();
      player.when("phaseJieshuBegin").then(async (event2, trigger2, player2) => {
        if (player2.hasSkill("jingliemrfz_ban") || !game.hasPlayer((current) => lib.skill.jingliemrfz.filter(event2, player2))) return;
        player2.addTempSkill("jingliemrfz_ban", "phaseJieshuEnd");
        const result = await player2.chooseTarget().set("prompt", get.prompt("jingliemrfz")).set(
          "prompt2",
          `你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
        ).set("filterTarget", (card2, player3, target3) => player3 != target3 && target3.countCards("h") > 0).set("ai", (target3) => {
          var player3 = get.event().player;
          var att = get.attitude(player3, target3), num = 0;
          if (att >= 0) num += 2;
          else num += 5 + target3.getDamagedHp();
          return num += target3.countCards("h") / 2;
        }).forResult();
        if (result.targets) {
          var target2 = result.targets[0];
          player2.logSkill("jingliemrfz", target2);
          var next = game.createEvent("jingliemrfz_phaseJieshu");
          next.player = player2;
          next.targets = result.targets;
          next.setContent(lib.skill.jingliemrfz.content);
        }
      });
    },
    async index_2(event, trigger, player) {
      let target = event.target_jingliemrfz, card = event.card_jingliemrfz;
      await target.chooseToUse(
        function(card2, player2, event2) {
          if (get.name(card2) != "sha") return false;
          return true;
        },
        "【鲸猎】:对" + get.translation(player) + "使用一张杀"
      ).set("forced", true).set("targetRequired", true).set("complexSelect", true).set("filterTarget", function(card2, player2, target2) {
        if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
        return player2.canUse({ name: "sha" }, target2, false);
      }).set("sourcex", player);
      if (target.hasHistory("useCard", (evt) => {
        return evt.getParent(2) == event && target.hasHistory("sourceDamage", (evtx) => evt.card == evtx.card);
      }))
        player.turnOver();
      else {
        for (var i = 0; i < 2; i++) {
          var next = game.createEvent("jingliemrfz_noDamage");
          next.player = player;
          next.target_jingliemrfz = target;
          next.card_jingliemrfz = card;
          next.setContent(lib.skill.jingliemrfz["index_" + i]);
        }
      }
    },
    subSkill: {
      ban: {
        charlotte: true
      }
    }
  },
  "shulangmrfz": {
    audio: "zhangenmrfz",
    trigger: {
      target: "useCardToTargeted"
    },
    filter(event, player) {
      return event.card && event.card.name == "sha" && player.hasSha() && lib.filter.targetEnabled({ name: "sha" }, player, event.player);
    },
    check(event, player) {
      for (var i of player.getCards("hes", "sha")) {
        if (get.effect(event.player, i, player, player) > 0 && get.attitude(player, event.player) < 0) {
          return true;
        }
      }
      return false;
    },
    prompt2(event, player) {
      return "你可以对" + get.translation(event.player) + "使用一张杀";
    },
    async content(event, trigger, player) {
      const { result } = await player.chooseToUse(function(card, player2, event2) {
        if (get.name(card) != "sha") return false;
        return true;
      }, "请使用一张【杀】").set("forced", true).set("targetRequired", true).set("complexSelect", true).set("shulangmrfz_card", true).set("filterTarget", function(card, player2, target) {
        if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
        return player2.canUse({ name: "sha" }, target, false);
      }).set("sourcex", trigger.player);
      if (player.hasHistory("useCard", (evt) => {
        return evt && evt.card && evt.name == "useCard" && player.hasHistory("sourceDamage", (evtx) => {
          return evt.card == evtx.card;
        });
      })) {
        trigger.getParent().excluded.addArray(trigger.targets);
        if (trigger.player.countGainableCards(player, "he"))
          player.gainPlayerCard("he", trigger.player, true).set("target", trigger.player).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
      }
    },
    group: "shulangmrfz_need",
    subSkill: {
      need: {
        trigger: { player: "useCardToPlayered" },
        filter(event, player) {
          return event.getParent(3).name == "shulangmrfz" && event.card && event.card.name == "sha";
        },
        silent: true,
        async content(event, trigger, player) {
          const id = trigger.target.playerid;
          const map = trigger.getParent()?.customArgs;
          if (!id || !map) return;
          if (!map[id]) map[id] = {};
          if (typeof map[id].shanRequired == "number") {
            map[id].shanRequired++;
          } else {
            map[id].shanRequired = 2;
          }
        }
      }
    }
  }
});
translate({
  "sikadimrfz": "斯卡蒂",
  "jingliemrfz": "鲸猎",
  "jingliemrfz_info": "准备阶段，你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，若你不能使用此牌，则改为摸一张牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。",
  "shulangmrfz": "倏浪",
  "shulangmrfz_info": "①当你成为【杀】的目标时，你可以对使用者使用一张【杀】（不计入使用次数且需要两张【闪】才可抵消），若此【杀】造成伤害，你取消此杀的所有目标并且获得其一张牌。"
});
characterIntro("sikadimrfz", "斯卡蒂，赏金猎人，现为罗德岛所雇佣。在过去完成的赏金任务中，于对抗大型生物，破坏硬目标，攻坚战，歼灭战等多类行动中展现出强劲实力，推测与其过往战斗经验相关。成为赏金猎人之前的履历缺失。现于罗德岛某攻坚小队供职，同时身兼单兵任务预备执行干员一职。......");
//# sourceMappingURL=index.js.map
