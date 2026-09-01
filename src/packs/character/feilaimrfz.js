import { _status, get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("feilaimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "samrfz",
  hp: 5,
  skills: ["qianxiumrfz", "mingzhoumrfz"]
});
skill({
  "qianxiumrfz": {
    audio: 2,
    intro: {
      content(event, player) {
        return `少女祈祷中...`;
      }
    },
    trigger: { player: "phaseDrawBegin1" },
    filter: function(event, player) {
      return !event.numFixed;
    },
    prompt(event, player) {
      return get.prompt("qianxiumrfz");
    },
    prompt2(event, player) {
      return `你可以放弃摸牌，并展示牌堆顶${player.maxHp}张牌`;
    },
    async content(event, trigger, player) {
      trigger.changeToZero();
      let shows = game.cardsGotoOrdering(get.cards(player.maxHp)).cards;
      await player.showCards(shows, get.translation(player) + "发动了【虔修】");
      if (shows.filter((i) => get.tag(i, "damage") > 0).length < 1) {
        player.gain(shows);
        if (player.countMark("qianxiumrfz") < 5) player.addMark("qianxiumrfz", 1, false);
        return;
      }
      const { links } = await player.chooseButton(["【虔修】:你可以使用一张带有伤害类标签的牌", shows]).set("filterButton", (button) => {
        let player2 = get.player();
        return get.tag(button.link, "damage") > 0 && player2.hasUseTarget(button.link);
      }).set("ai", (button) => {
        let player2 = get.player();
        if (player2.countMark("qianxiumrfz") < 3) return false;
        return get.value(button.link);
      }).forResult();
      if (links) {
        let nums = player.countMark("qianxiumrfz");
        links[0].storage.qianxiumrfz = nums;
        player.removeMark("qianxiumrfz", 1145141919810);
        player.chooseUseTarget(links[0]);
      } else {
        player.gain(shows);
        if (player.countMark("qianxiumrfz") < 5) player.addMark("qianxiumrfz", 1, false);
      }
    },
    group: ["qianxiumrfz_add"],
    subSkill: {
      add: {
        audio: "qianxiumrfz",
        charlotte: true,
        silent: true,
        trigger: { source: "damageBegin3" },
        filter(event, player) {
          return event.card && event.card.storage && typeof event.card.storage.qianxiumrfz === "number" && event.card.storage.qianxiumrfz > 0;
        },
        async content(event, trigger, player) {
          trigger.num += trigger.card.storage.qianxiumrfz;
        }
      }
    }
  },
  "mingzhoumrfz": {
    audio: 2,
    forced: true,
    trigger: {
      player: "gainAfter"
    },
    filter(event, player) {
      return event.cards.length > 0 && _status.currentPhase !== player;
    },
    async content(event, trigger, player) {
      player.chooseToDiscard(true, `he`, `请弃置${trigger.cards.length}张牌`, trigger.cards.length).set("ai", (card) => -get.value(card));
    },
    ai: {
      threaten: 0.9,
      nogain: 1,
      skillTagFilter: function(player) {
        return player != _status.currentPhase;
      }
    }
  }
});
translate({
  "feilaimrfz": "菲莱",
  "qianxiumrfz": "虔修",
  "qianxiumrfz_info": "摸牌阶段开始时，你可以放弃摸牌，改为展示牌堆顶X张牌，然后你可以选择使用其中一张带有伤害类标签的牌，此牌造成的伤害+Y并重置Y，否则你获得展示的牌并令Y+1。（X=你的体力上限，Y至多为5）",
  "mingzhoumrfz": "冥咒",
  "mingzhoumrfz_info": "锁定技，当你于回合外获得牌后，你弃置等量的牌。"
});
characterTitle("feilaimrfz", "<font color='#b8860b'>灵河守卫</font>");
characterIntro("feilaimrfz", "菲莱，来自萨尔贡的神庙守卫，信仰“生命之河”。如今以虔修者的身份在各地游历。<br>在修习之旅中结识了驻萨尔贡办事处的干员，并与办事处建立长期合作关系，为罗德岛的安保、救灾工作提供援助，兼任外勤重装干员。");
//# sourceMappingURL=feilaimrfz.js.map
