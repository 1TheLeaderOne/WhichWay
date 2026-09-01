import { get } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("yaxinmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "xiemrfz",
  hp: 4,
  skills: ["lingdingmrfz", "yabengmrfz"]
});
skill({
  "lingdingmrfz": {
    init: (player, skill2) => {
      player.storage[skill2] = [0, 1];
    },
    mark: true,
    intro: {
      markcount: "",
      content: (event, player, storage) => {
        return `${player.storage[storage][0]}/${player.storage[storage][1]}`;
      }
    },
    audio: 2,
    direct: true,
    trigger: {
      player: ["respond", "useCard"]
    },
    async content(event, trigger, player) {
      player.storage.lingdingmrfz[0]++;
      let usenum = player.storage.lingdingmrfz[0], num = player.storage.lingdingmrfz[1];
      if (usenum < num) return;
      const { bool } = await player.chooseBool(`【凌顶】:你可以摸${num}张牌`).set("frequentSkill", "lingdingmrfz").set(
        "prompt2",
        get.prompt2("lingdingmrfz").substring(get.prompt2("lingdingmrfz").indexOf("###", get.prompt2("lingdingmrfz").indexOf("###") + 3) + 3)
      ).forResult();
      if (!bool) return;
      player.storage.lingdingmrfz[0] = 0;
      if (player.storage.lingdingmrfz[1] < player.maxHp) player.storage.lingdingmrfz[1]++;
      player.draw(num);
      player.logSkill("lingdingmrfz");
    }
  },
  "yabengmrfz": {
    audio: 2,
    trigger: { player: "dying" },
    forced: true,
    async content(event, trigger, player) {
      player.draw(Math.min(2, player.storage.lingdingmrfz[0]));
      player.storage.lingdingmrfz = [0, 0];
    }
  }
});
translate({
  "yaxinmrfz": "崖心",
  "lingdingmrfz": "凌顶",
  "lingdingmrfz_info": "当你使用或打出牌时，你记录之，然后若你记录的牌数不小于 [ 1 ]，你可以摸 [ 1 ] 张牌，然后你令 [ ] 中的数字+1（不能超过你的体力上限）并清除此技能你记录的牌",
  "yabengmrfz": "崖崩",
  "yabengmrfz_info": "锁定技，当你进入濒死状态时，你重置【凌顶】并摸X张牌。（X=【凌顶】记录的牌的数量，X至多为2）"
});
characterIntro("yaxinmrfz", "崖心，谢拉格出身，现罗德岛干员。攀岩与登山方面的专家，能熟练使用各种攀爬工具。现于罗德岛接受矿石病治疗。");
//# sourceMappingURL=yaxinmrfz.js.map
