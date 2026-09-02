import { character, skill, translate, characterIntro } from "../hooks.js";
character("feiyameitamrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "lamrfz",
  hp: 4,
  skills: ["shunanmrfz"]
});
skill({
  "shunanmrfz": {
    audio: 2,
    forced: true,
    trigger: { player: "phaseEnd" },
    filter: function(event, player) {
      return player.hp > 1 && !player.hasSkill("lvwaimrfz_ban");
    },
    async content(event, trigger, player) {
      player.loseHp();
    },
    group: ["shunanmrfz_damage"],
    subSkill: {
      damage: {
        trigger: {
          source: "damageBegin3",
          player: "phaseDrawBegin2"
        },
        direct: true,
        filter: function(event, player) {
          return player.countCards("h") >= player.hp;
        },
        async content(event, trigger, player) {
          if (player.getDamagedHp() <= player.maxHp / 2) trigger.num += 2;
          else trigger.num++;
          player.logSkill("shunanmrfza");
        }
      }
    },
    ai: {
      threaten: 1.2
    }
  }
});
translate({
  "feiyameitamrfz": "菲亚梅塔",
  "shunanmrfz": "述难",
  "shunanmrfz_info": "①锁定技，你的手牌数不小于你的体力值时，你造成的伤害+<span class=thundertext>1</span>且摸牌阶段额外摸<span class=thundertext>1</span>张牌，若你已损失的体力值不大于你体力上限的一半，有颜色的数字翻倍。②结束阶段，若你的体力值大于1，你失去一点体力。"
});
characterIntro("feiyameitamrfz", "菲亚梅塔，拉特兰公证所高级特派员，职务名经本人强烈要求，不予记录。现依据罗德岛与拉特兰教廷的合作协议，从罗德岛获得补给，并提供相关服务。</br>天启惩罚者？每个月还会更新？让我把这些玩意输进终端归档不如直接杀了我。");
