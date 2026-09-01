import { lib, get, _status, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("bafanhailingmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "othermrfz",
  hp: 3,
  skills: ["chendiemrfz", "umiri_chenxianmrfz", "wuweimrfz"],
  clans: ["AveMujica"]
});
skill({
  "chendiemrfz": {
    audio: 2,
    trigger: { player: "useCardBegin" },
    filter(event, player) {
      let num = lib.skill.wuweimrfz.getNum(player, "chendiemrfz");
      if (event.noTrigger_chendiemrfz) return false;
      return player.getHistory("useCard").length < num + 2 && player.isPhaseUsing();
    },
    forced: true,
    mark: true,
    intro: {
      content(_, player) {
        if (!player.isPhaseUsing()) return `不是你的出牌阶段`;
        return `已使用的牌数/上限：${player.getHistory("useCard").length}/${lib.skill.wuweimrfz.getNum(player, "chendiemrfz") + 2}`;
      }
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let cards = trigger.cards;
      await player.recast(trigger.cards, () => {
      });
      let cardsTags = cards.map((card) => card.gaintag).flat();
      if (cardsTags) {
        cardsTags.forEach((tag) => player.addGaintag(player.getCards("h"), tag));
      }
    }
  },
  "umiri_chenxianmrfz": {
    audio: 2,
    forced: true,
    trigger: {
      player: "gainAfter"
    },
    // @ts-ignore
    init(player) {
      game.broadcastAll(() => {
        lib.translate["umiri_chenxianmrfz_yingbian"] = "无视条件";
        Array.from(lib.yingbian.effect.keys()).forEach((tag) => lib.translate[`yingbian_${tag}`] = lib.translate[`yingbian_${tag}_tag`]);
      });
    },
    // @ts-ignore
    filter(event, player) {
      return player === _status.currentPhase;
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let effTag = Array.from(lib.yingbian.effect.keys()).map((tag) => `yingbian_${tag}`);
      trigger.cards.forEach((card) => {
        card.addGaintag("umiri_chenxianmrfz_yingbian");
        if (!get.is.yingbian(card)) {
          let num = lib.skill.wuweimrfz.getNum(player, "umiri_chenxianmrfz") + 1;
          for (let i = 0; i < num; i++) {
            card.addGaintag(effTag.randomGet());
          }
        }
      });
    },
    group: "umiri_chenxianmrfz_yingbian",
    subSkill: {
      yingbian: {
        trigger: {
          player: "yingbian"
        },
        forced: true,
        //@ts-ignore
        filter: (event, player) => event.card.isCard && player.hasHistory("lose", (evt) => evt.getParent() == event && Object.values(evt.gaintag_map).some((value) => value.includes("umiri_chenxianmrfz_yingbian"))),
        // @ts-ignore
        async content(event, trigger, player) {
          let tags;
          player.getHistory("lose", (evt) => {
            if (evt.getParent() !== trigger) return;
            const maps = evt.gaintag_map;
            for (let key in maps) {
              if (maps[key].join(" ").includes("yingbian_")) tags = maps[key];
            }
          });
          if (!Array.isArray(trigger.temporaryYingbian)) {
            trigger.temporaryYingbian = [];
          }
          trigger.temporaryYingbian.add("force");
          for (let tag of tags) {
            if (tag.startsWith("yingbian_")) {
              trigger.temporaryYingbian.add(tag.slice(9));
            }
          }
        }
      }
    }
  }
});
translate({
  "bafanhailingmrfz": "八幡海铃",
  "chendiemrfz": "沉叠",
  "chendiemrfz_info": '锁定技，出牌阶段，你使用的前X+2张牌改为以${get.poptip("sjzx_byRecast")}来使用，且你的手牌继承此牌的应变效果。',
  "umiri_chenxianmrfz": "陈弦",
  "umiri_chenxianmrfz_info": "锁定技，你于回合内获得的牌的应变效果可无视条件直接生效，若这些牌没有应变效果，你令这些牌随机获得X+1个应变效果。"
});
characterTitle("bafanhailingmrfz", "<font color = #db7093>毋畏恐惧</font>");
characterIntro("bafanhailingmrfz", "Ave Mujica的贝斯手八幡海铃。不管是演奏中还是作战中，她总是能展现出极高的专业度。");
//# sourceMappingURL=bafanhailingmrfz.js.map
