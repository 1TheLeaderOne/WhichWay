import { get, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("bobumrfz", {
  sex: "male",
  group: "gemrfz",
  hp: 4,
  skills: ["qingtingmrfz", "qingtanmrfz"]
});
skill({
  "qingtingmrfz": {
    audio: 2,
    trigger: { player: ["loseBegin", "loseAsyncBegin"] },
    filter(event, player) {
      let evt = event.getParent();
      if (event.name === "lose") {
        return event.type === "gain" && event.cards.length >= 1 && evt.player !== player;
      } else if (event.name === "loseAsync") {
        return evt.name === "swapHandcards" && event.target != event.player && event.cards1.length >= 1;
      }
      return false;
    },
    async cost(event, trigger, player) {
      let evt = trigger.getParent();
      event.result = await player.chooseBool().set("ai", () => {
        let evt2 = get.event().evt;
        let event2 = get.event().evt2;
        return get.attitude2(event2.target || evt2.player) < 0;
      }).set("prompt", get.prompt("qingtingmrfz")).set(
        "prompt2",
        `是否取消${get.translation(trigger.target || evt.player)}获得你的牌${get.translation(trigger.cards1 || trigger.cards)}？`
      ).set("evt", evt).set("evt2", trigger).forResult();
    },
    async content(event, trigger, player) {
      if (trigger.name === "lose") trigger.cancel();
      else {
        let evt = trigger.getParent();
        player.directgain(evt.cards1);
        player.$update();
        evt.cards1 = [];
      }
    }
  },
  "qingtanmrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, player, target) {
      return target != player && target.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      let target = event.target;
      let tHs = target.getCards("h"), pHs = player.getCards("h");
      await player.viewHandcards(target);
      await target.viewHandcards(player);
      const { cards: cards1 } = pHs.length < 2 ? { cards: pHs } : await player.chooseCard(true).set("ai", (card) => {
        get.player();
        let target2 = get.event().target;
        return get.value(card) * get.attitude2(target2);
      }).set("prompt", "请选择两张类型不同的牌").set("filterCard", (card) => {
        return !ui.selected.cards.some((cardx) => get.type2(cardx, player) == get.type2(card, player));
      }).set("selectCard", () => {
        let hs = get.event().hs;
        return new Set(hs.map((i) => get.type2(i))).size < 2 ? 1 : 2;
      }).set("complexCard", true).set("target", target).set("hs", pHs).forResult();
      const { cards: cards2 } = tHs.length < 2 ? { cards: tHs } : await target.chooseCard(true).set("prompt", "请选择两张类型不同的牌").set("ai", (card) => {
        get.player();
        let target2 = get.event().target;
        return get.value(card) * get.attitude2(target2);
      }).set("filterCard", (card) => {
        return !ui.selected.cards.some((cardx) => get.type2(cardx, player) == get.type2(card, player));
      }).set("selectCard", () => {
        let hs = get.event().hs;
        return new Set(hs.map((i) => get.type2(i))).size < 2 ? 1 : 2;
      }).set("complexCard", true).set("hs", tHs).set("target", player).forResult();
      if (cards1 && cards2) {
        player.swapHandcards(target, cards1, cards2);
      }
    },
    async contentAfter(event, trigger, player) {
      const target = event.targets[0];
      if (target.countCards("h") === player.countCards("h")) return;
      for (let char of [player, target]) {
        if (char.hasSkill("qingtanmrfz_hd")) {
          char.draw();
          continue;
        }
        const { bool } = await char.chooseBool().set("prompt", "是否摸一张牌？").set("prompt2", "选择‘取消’则为手牌上限+1").set("ai", () => {
          let player2 = get.player();
          return player2.countCards("h") < 2 ? true : false;
        }).forResult();
        if (bool === true) {
          char.draw();
        }
        if (bool === false) {
          char.addSkill("qingtanmrfz_hd");
        }
      }
    },
    subSkill: {
      hd: {
        charlotte: true,
        mark: true,
        intro: {
          content: "手牌上限+1"
        },
        mod: {
          maxHandcard: function(player, num) {
            return num + 1;
          }
        }
      }
    },
    ai: {
      order: 13,
      result: {
        target: -1
      }
    }
  }
});
translate({
  "bobumrfz": "波卜",
  "qingtingmrfz": "倾听",
  "qingtingmrfz_info": "当其他角色获得你的牌时，你可以取消之。",
  "qingtanmrfz": "倾谈",
  "qingtanmrfz_info": "出牌阶段限一次，你可以选择一名其他角色，你与其互相观看手牌，并各选择两张类型不同的手牌，然后你与其各获得对方选择的牌，在此流程结束后， 若双方手牌不一致，你与其手牌上限+1（上限为1）或摸一张牌。"
});
characterTitle("bobumrfz", "<font color=#b8860b>倾听者</font>");
characterIntro("bobumrfz", "波卜,赤心医疗员工埃利西奥，作为组织代表前来罗德岛交流学习。<br>现以“波卜”为代号，以罗德岛合作干员身份参与外勤任务，主要参与沟通、谈判、事故救援与情感安抚等事务。");
//# sourceMappingURL=index.js.map
