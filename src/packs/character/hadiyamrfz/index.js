import { get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("hadiyamrfz", {
  sex: "female",
  group: "samrfz",
  hp: 4,
  skills: ["juetumrfz"]
});
skill({
  "juetumrfz": {
    init(player, skill2) {
      player.storage[skill2] = {
        draw: 3,
        record: []
      };
    },
    intro: {
      content(storage) {
        if (!storage) return `无信息`;
        return `·获胜过的点数：${storage.record.length > 0 ? storage.record.join("、") : "无"}`;
      }
    },
    mark: true,
    audio: ["作战中1", "作战中2"],
    enable: "phaseUse",
    usable: 1,
    filterTarget(card, target, player) {
      return player.canCompare(target, true);
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      await player.draw(player.storage.juetumrfz.draw);
      const result = await player.chooseToCompare().set("target", target).forResult();
      const { num1, winner } = result;
      if (winner === player && !player.storage.juetumrfz.record.includes(num1)) {
        player.storage.juetumrfz.record.add(num1);
        player.storage.juetumrfz.draw++;
        player.popup("数字+1");
      } else if (winner !== player) {
        if (player.storage.juetumrfz.draw > 1) player.storage.juetumrfz.draw--;
        player.popup("数字-1");
      }
      if (winner !== player) player.damage(target);
      if (winner !== target) target.damage(player);
    },
    ai: {
      order: 5,
      result: {
        target(player, target) {
          let att = get.attitude2(target);
          if (att > 0) return;
          return -1;
        }
      }
    }
  }
});
translate({
  "hadiyamrfz": "哈蒂娅",
  "juetumrfz": "攫土",
  "juetumrfz_info": "出牌阶段限一次，你可以摸#r3#张牌，并与一名其他角色进行拼点，没有赢的角色受到一点伤害，若你首次以该点数拼点获胜，本技能红色数字+1，反之若你没赢，本技能红色数字-1（红色数字至少为1）。"
});
characterTitle("hadiyamrfz", "<font color = #be9b1c66>再造剑角</font>");
characterIntro("hadiyamrfz", "哈蒂娅，萨尔贡裔哥伦比亚人，沙漠传奇战士部族剑角的后代。为学习战斗技巧于萨尔贡主动加入罗德岛，现作为罗德岛驻萨尔贡办事处干员，接受战斗训练的同时参与各类外勤任务。");
//# sourceMappingURL=index.js.map
