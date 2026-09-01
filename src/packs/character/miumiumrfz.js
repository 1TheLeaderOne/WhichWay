import { get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("miumiumrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "lymrfz",
  hp: 3,
  skills: ["yuanliumrfz", "shuilingmrfz", "xinjingshuimrfz"]
});
skill({
  "yuanliumrfz": {
    audio: "kaiyuanmrfz",
    trigger: {
      player: "enterGame",
      global: "phaseBefore"
    },
    direct: true,
    locked: false,
    markimage: "extension/WhichWay/image/skill/miumiuliuxingmrfz.png",
    intro: {
      name: "流形",
      content: "#/3"
    },
    filter: function(event, player) {
      return event.name != "phase" || game.phaseNumber == 0;
    },
    async content(event, trigger, player) {
      let result;
      result = await player.chooseControl().set("choiceList", ["令一名角色摸两张牌", "获得一个‘流形’"]).set("ai", () => {
        return [0, 1].randomGet();
      }).forResult();
      if (result.index === 0) {
        result = await player.chooseTarget(true, "【源流】：令一名角色摸两张牌").set("ai", (target) => {
          return get.attitude(player, target) > 2;
        }).forResult();
        if (result.targets) {
          const target = result.targets[0];
          await target.draw(2);
          player.logSkill("kaiyuanmrfz");
        }
      } else {
        player.logSkill("kaiyuanmrfz");
        player.addMark("yuanliumrfz");
        return;
      }
    },
    mod: {
      maxHandcard: function(player, num) {
        return num + player.countMark("yuanliumrfz");
      }
    },
    group: "yuanliumrfz_get",
    subSkill: {
      get: {
        direct: true,
        trigger: {
          player: "phaseUseEnd"
        },
        filter: function(event, player) {
          return player.getHistory("useCard", function(evt) {
            return evt.getParent("phaseUse") == event;
          }).length > 0 && player.countMark("yuanliumrfz") < 3;
        },
        async content(event, trigger, player) {
          const list = [], mark = player.countMark("yuanliumrfz");
          player.getHistory("useCard", function(evt) {
            if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
            return false;
          });
          if (mark + list.length > 3) player.addMark("yuanliumrfz", 3 - mark);
          else player.addMark("yuanliumrfz", list.length);
          player.logSkill("yuanliumrfz");
        }
      }
    }
  },
  "xinjingshuimrfz": {
    audio: "jingshuimrfz",
    trigger: {
      player: "useCardToPlayered"
    },
    usable: 1,
    filter: function(event, player) {
      const evt = event.getParent("phaseUse"), type = get.type(event.card);
      if (type != "basic" && type != "trick") return false;
      if (!evt || evt.player != player) return false;
      if (!player.hasMark("yuanliumrfz")) return false;
      return event.targets && event.targets.length == 1;
    },
    prompt: function(event, player) {
      return "是否移除所有‘源流’并令【" + get.translation(event.card.name) + "】额外结算" + player.countMark("yuanliumrfz") + "次？";
    },
    check: function(event, player) {
      return !get.tag(event.card, "norepeat");
    },
    async content(event, trigger, player) {
      var num = player.countMark("yuanliumrfz");
      trigger.getParent().effectCount += num;
      player.removeMark("yuanliumrfz", 1145141919810, false);
    }
  },
  "shuilingmrfz": {
    audio: "liuxingmrfz",
    forced: true,
    trigger: { player: "damageBegin3" },
    filter: function(event, player) {
      if (player.hasSkill("shuilingmrfz_ban")) return false;
      return !event.nature && player.countCards("h") >= player.hp;
    },
    async content(event, trigger, player) {
      trigger.num--;
      player.addTempSkill("shuilingmrfz_ban", "phaseEnd");
    },
    subSkill: {
      ban: {
        charlotte: true,
        mark: true,
        intro: {
          content: "本回合已发动过【水灵】"
        }
      }
    }
  }
});
translate({
  "miumiumrfz": "缪尔赛思",
  "yuanliumrfz": "源流",
  "yuanliumrfz_info": "①锁定技，游戏开始时，你选择一项：1.令一名角色摸2张牌；2.获得一个“流形”。②锁定技，出牌阶段结束时，你获得X个“流形”（至多为3）。（X=出牌阶段你使用牌的类型）③锁定技，你的手牌上限+X。（X=你的“流形”数）",
  "xinjingshuimrfz": "净水",
  "xinjingshuimrfz_info": "当你于出牌阶段第一次使用非延时锦囊牌或基本牌指定唯一目标后，你可以令此牌额外结算X次，然后你移除你所有的“流形”。（X=你拥有的“流形”数）",
  "shuilingmrfz": "水灵",
  "shuilingmrfz_info": "锁定技，每回合限一次，若你的手牌不大于你的体力值，你受到的非属性伤害-1。"
});
characterTitle("miumiumrfz", "<font color=#6575f1>孑然水灵</font>");
characterIntro("miumiumrfz", "缪尔赛思，莱茵生命生态科主任，哥伦比亚生命科学与环境科学领域专家，在特里蒙事件中与罗德岛取得联系，后与罗德岛签订长期合作条款，与生物工程研究室开展多项联合科研项目，并作为先锋干员参与相关作战任务。");
//# sourceMappingURL=miumiumrfz.js.map
