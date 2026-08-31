import { get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("spdegoumrfz", {
  sex: "female",
  group: "qimrfz",
  hp: 4,
  skills: ["laoyingmrfz", "yushimrfz"]
});
skill({
  "yushimrfz": {
    audio: 2,
    forced: true,
    trigger: { player: "phaseDrawBegin2" },
    async content(event, trigger, player) {
      var num = 8 - game.roundNumber;
      trigger.num = Math.max(3, num);
    }
  },
  "laoyingmrfz": {
    audio: 2,
    usable: 1,
    trigger: { source: "damageEnd" },
    filter: function(event, player) {
      return event.card && event.getParent("phaseUse") && //@ts-ignore
      event.getParent("phaseUse").player == player && get.itemtype(event.cards) == "cards" && get.position(event.cards[0], true) == "o";
    },
    async content(event, trigger, player) {
      player.gain(trigger.cards, "gain2");
      var cardu = { name: trigger.card.name, isCard: true };
      if (get.type(cardu) == "basic") player.addTempSkill("laoyingmrfz_basic");
      else player.addTempSkill("laoyingmrfz_trick");
    },
    subSkill: {
      basic: {
        charlotte: true,
        mod: {
          cardUsable: function(card, player, num) {
            if (card.name == "sha") return num + 1;
          }
        }
      },
      trick: {
        audio: "laoyingmrfz",
        trigger: { player: "useCard" },
        filter: function(event, player) {
          return get.type2(event.card) == "trick";
        },
        forced: true,
        charlotte: true,
        async content(event, trigger, player) {
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player;
            })
          );
          player.removeSkill("laoyingmrfz_trick");
        },
        ai: {
          directHit_ai: true,
          skillTagFilter: function(player, tag, arg) {
            return get.type2(arg.card) == "trick";
          }
        }
      }
    }
  }
});
translate({
  "spdegoumrfz": "缄默德克萨斯",
  "spdegoumrfz_prefix": "缄默",
  "yushimrfz": "雨势",
  "yushimrfz_info": "锁定技，摸牌阶段，你改为摸8-X张牌。（X=当前游戏轮数，X至多为6）",
  "laoyingmrfz": "烙印",
  "laoyingmrfz_info": "出牌阶段限一次，当你使用的牌造成伤害后，你可以获得此牌，若此牌是基本牌，本回合你使用【杀】的次数+1，反之，本回合你使用的下一张普通锦囊牌不可响应。"
});
characterTitle("spdegoumrfz", "<font color=rgb(255,25,22)>破斩桎梏</font>");
characterIntro("spdegoumrfz", "缄默德克萨斯，企鹅物流员工，最后的德克萨斯家族成员，单兵作战能力出类拔萃。罗德岛的老朋友。当德克萨斯带着后来成为伺夜与斥罪的两人踏入罗德岛时，许多人都是震惊的。毕竟，从着装上就能判断，不必说伺夜与斥罪，光是她的身上，就散发着浓厚的叙拉古气息。她回叙拉古了。对她有所了解的干员，对于这个结论都有些惊疑不定，毕竟，关于德克萨斯的一个共识是——她和叙拉古有关，但没有人知道她的过去是怎样的。所幸，紧跟其后的企鹅物流众人打消了这种疑虑。毕竟，有关德克萨斯的另一个共识是——只要和企鹅物流在一起，她就始终是那个德克萨斯。当然，等到众人得知，德克萨斯在叙拉古经历了什么，并且又为罗德岛带来了怎样的两位人物后，一个新的共识诞生了——德克萨斯真可怕。");
//# sourceMappingURL=index.js.map
