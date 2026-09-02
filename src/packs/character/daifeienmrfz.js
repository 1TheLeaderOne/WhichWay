import { get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("daifeienmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 3,
  skills: ["zhuofengmrfz", "qianggongmrfz"]
});
skill({
  "zhuofengmrfz": {
    audio: 2,
    usable: 1,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h") > 0;
    },
    async content(event, trigger, player) {
      let list = [];
      if (player.getCards("h", { color: "red" }).length) list.push("red");
      if (player.getCards("h", { color: "black" }).length) list.push("black");
      list.push("cancel2");
      const { control } = await player.chooseControl(list).set("prompt", `是否发动【濯锋】？`).set("prompt2", `你可以重铸手牌中一种颜色的所有牌，若你重铸了不少于2张牌，你摸一张牌，然后你视为本回合没有使用过【杀】。`).set("ai", () => {
        let player2 = get.player(), list2 = get.event().list;
        let value = get.value(player2.getCards("h", { color: "red" })) - get.value(player2.getCards("h", { color: "black" }));
        if (list2.length > 2) {
          if (value > 0) return "red";
          return "black";
        } else {
          if (get.value(player2.getCards("h")) < 20) return list2[0];
          return "cancel2";
        }
      }).set("list", list).forResult();
      if (control === "cancel2") {
        delete player.getStat("skill")["zhuofengmrfz"];
        return;
      }
      let cards = player.getCards("h").filter((i) => get.color(i) == control && player.canRecast(i));
      if (!cards) return;
      player.recast(cards);
      if (cards.length >= 2) player.draw();
      if (player.getStat("card")["sha"]) {
        delete player.getStat("card")["sha"];
      }
    },
    ai: {
      order: 3,
      result: {
        player: 1
      }
    }
  },
  "qianggongmrfz": {
    mod: {
      targetInRange(card, player, target, now) {
        let mark = player.getStat("card")["sha"];
        if (card.name == "sha" && (!mark || mark == 0)) return true;
      }
    },
    audio: 2,
    trigger: {
      player: "useCard",
      source: "damageEnd"
    },
    filter(event, player) {
      let mark = player.getStat("card")["sha"], storage = player.storage.qianggongmrfz;
      if (event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
      if (mark && mark > 1) return false;
      return event.card && event.card.name == "sha" && (!storage || event.card == storage);
    },
    forced: true,
    async content(event, trigger, player) {
      if (!player.storage.qianggongmrfz) {
        player.storage.qianggongmrfz = trigger.card;
        player.when({
          global: "phaseBegin",
          player: "useCardAfter"
        }).filter((event2, player2) => {
          let storage = player2.storage.qianggongmrfz;
          if (event2.name == "phase") return true;
          return event2.card && storage && event2.card == storage;
        }).then(async (event2, trigger2, player2) => {
          delete player2.storage.qianggongmrfz;
        });
      }
      if (trigger.name == "useCard") {
        if (typeof trigger.baseDamage != "number") trigger.baseDamage = 1;
        trigger.baseDamage++;
      } else {
        delete player.storage.qianggongmrfz;
        let skills = player.getStockSkills(true, true);
        const { control } = await player.chooseControl(skills).set("prompt", "【抢攻】:请选择你要重置的技能").set("ai", () => {
          let list = get.event().list, suffixs2 = ["used", "round", "block", "blocker"], skills2 = [];
          if (list.includes("zhuofengmrfz")) return "zhuofengmrfz";
          for (let skill3 of list) {
            let info2 = get.info(skill3);
            for (let key of suffixs2) {
              if (info2[key]) skills2.push(skill3);
            }
          }
          if (skills2.length == 0) skills2.push(list[0]);
          return skills2.randomGet();
        }).set("list", skills).forResult();
        if (!control) return;
        let skillx = [control];
        game.expandSkills(skillx);
        var resetSkills = [];
        var suffixs = ["used", "round", "block", "blocker"];
        for (var skill2 of skillx) {
          var info = get.info(skill2);
          if (typeof info.usable == "number") {
            if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill2] && player.storage.counttrigger[skill2] >= 1) {
              delete player.storage.counttrigger[skill2];
              resetSkills.add(skill2);
            }
            if (typeof get.skillCount(skill2) == "number" && get.skillCount(skill2) >= 1) {
              delete player.getStat("skill")[skill2];
              resetSkills.add(skill2);
            }
          }
          if (info.round && player.storage[skill2 + "_roundcount"]) {
            delete player.storage[skill2 + "_roundcount"];
            resetSkills.add(skill2);
          }
          if (player.storage[`temp_ban_${skill2}`]) {
            delete player.storage[`temp_ban_${skill2}`];
          }
          if (player.awakenedSkills.includes(skill2)) {
            player.restoreSkill(skill2);
            resetSkills.add(skill2);
          }
          for (var suffix of suffixs) {
            if (player.hasSkill(skill2 + "_" + suffix)) {
              player.removeSkill(skill2 + "_" + suffix);
              resetSkills.add(skill2);
            }
          }
        }
        if (resetSkills.length) {
          var str = "";
          for (var i of resetSkills) {
            str += "【" + get.translation(i) + "】、";
          }
          game.log(player, "重置了技能", "#g" + str.slice(0, -1));
        }
      }
    }
  }
});
translate({
  "daifeienmrfz": "戴菲恩",
  "zhuofengmrfz": "濯锋",
  "zhuofengmrfz_info": "出牌阶段限一次，你可以重铸手牌中一种颜色的所有牌，然后：<br>1.你视为本阶段你没有使用过【杀】；<br>2.若你重铸了至少两张牌，你摸一张牌。",
  "qianggongmrfz": "抢攻",
  "qianggongmrfz_info": "锁定技，你每阶段使用的第一张【杀】获得如下效果：<br>1.无距离限制；<br>2.伤害基数+1；<br>3.造成伤害后重置你武将牌上的一个技能。"
});
characterTitle("daifeienmrfz", "<font color=#FFF68F>濯洗剑锋</font>");
characterIntro("daifeienmrfz", "戴菲恩，曾作为情报人员在诺伯特区活动多年，后以典范军成员的身份参与了伦蒂尼姆周边的一系列战役。在维多利亚事件结束后，同罗德岛达成了一系列战略合作条款，为罗德岛驻维多利亚办事处提供协助。");
