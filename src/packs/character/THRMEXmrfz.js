import { get, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("THRMEXmrfz", {
  pack: "mediocreSJZX",
  hp: 6,
  group: "luomrfz",
  sex: "male",
  skills: ["reqingmrfz", "nuanrenmrfz"]
});
skill({
  "reqingmrfz": {
    audio: ["观看作战记录", "编入队伍"],
    forced: true,
    trigger: {
      player: "phaseDrawBegin",
      source: "damageEnd"
    },
    filter(event, player) {
      return event.name === "damage" ? event.num > 0 && event.player !== player : true;
    },
    async content(event, trigger, player) {
      if (trigger.name === "damage") player.draw(trigger.num);
      else {
        player.recover(trigger.num);
        trigger.cancel();
      }
    },
    ai: {
      combo: "nuanrenmrfz",
      threaten: 0.8
    }
  },
  "nuanrenmrfz": {
    audio: ["行动出发", "作战中1", "作战中2", "作战中3", "作战中4"],
    trigger: { player: "phaseZhunbeiBegin" },
    async cost(event, trigger, player) {
      const half = (char) => Math.max(1, Math.floor(char.hp / 2));
      event.result = await player.chooseTarget().set("prompt", get.prompt("nuanrenmrfz")).set("prompt2", `你可以对自己造成${half(player)}点伤害并对一名其他角色造成相当于其体力值一半（向下取整）的伤害`).set("ai", (target) => {
        let player2 = get.player();
        if (get.attitude2(target) > 0) return -1;
        if (player2.hp < 3 && player2.countCards("hs", (card) => ["tao", "jiu"].includes(get.name(card) || ""))) return -1;
        return target.hp / 2;
      }).set("targetprompt2", [(target) => `${get.cnNumber(half(target))}点伤害`]).set("filterTarget", lib.filter.notMe).forResult();
    },
    async content(event, trigger, player) {
      const half = (char) => Math.max(1, Math.floor(char.hp / 2));
      event.targets[0].damage(half(event.targets[0]));
      player.damage(half(player));
    }
  }
});
translate({
  "THRMEXmrfz": "THRM-EX",
  "reqingmrfz": "热情",
  "reqingmrfz_info": "锁定技，你的摸牌阶段改为回复额定摸牌数的体力值；当你对其他角色造成伤害后，你摸等量张牌。",
  "nuanrenmrfz": "暖人",
  "nuanrenmrfz_info": "准备阶段，你可以对自己和一名其他角色造成相当于各自体力值一半（向下取整，至少为1）的伤害。"
});
characterTitle("THRMEXmrfz", "<font color = #b7229c66>炙热冲击！</font>");
characterIntro("THRMEXmrfz", "Thermal-EX（型号亦作THRM-EX）是梅尔与可露希尔共同客制化后的雷神挑衅者™熔岩猫魔鬼高性能版作业平台，其中梅尔主要负责他的武器与储能装置的制作和改进。有着非常特别的存在感，对人非常热情，这点很讨周围部分人的喜欢，也有很多人对此不能适应。不过，Thermal-EX仍然无所畏惧，今天也在这个冰冷的世界用光明的自己去温暖他人。<br><br>由于是新型号，独特的具有侵略性的外形让人感觉到有些畏惧，但是Thermal-EX却对此并不介意。无论是谁，在还没看清楚他模样的距离，就会听到Thermal-EX对他的热情问候。不过好像言语中有关“热”的字眼用得实在太多了......");
//# sourceMappingURL=THRMEXmrfz.js.map
