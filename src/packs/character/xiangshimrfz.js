import { get, lib, _status, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("xiangshimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "gemrfz",
  hp: 3,
  skills: ["xuanshuimrfz", "pozemrfz"],
  designer: ["培嵩", "林登万"]
});
skill({
  "xuanshuimrfz": {
    audio: ["作战中1", "作战中2", "作战中3"],
    zhuanhuanji(player, skill2) {
      if (!player.storage.xuanshuimrfz) {
        lib.skill.xuanshuimrfz.init(player, skill2);
      }
      let storage = player.storage.xuanshuimrfz;
      if (storage.index >= 3) storage.index = 0;
      else storage.index += 1;
      lib.skill.xuanshuimrfz.updateSuit(player);
    },
    /**@param {Player} player  */
    updateSuit(player) {
      game.broadcastAll((player2) => {
        lib.translate[`xuanshuimrfz_bg`] = get.translation(lib.skill.xuanshuimrfz.suitList[player2.storage.xuanshuimrfz.index || 0]);
        const ui2 = player2.marks?.xuanshuimrfz?.querySelector(".background.skillmark");
        if (ui2) {
          ui2.innerHTML = lib.translate[`xuanshuimrfz_bg`];
        }
      }, player);
    },
    /**@param {Player} player  */
    getUsedSuit(player) {
      const used = [];
      const histroies = player.getHistory("useSkill", (evt) => evt.skill === "xuanshuimrfz");
      for (const history of histroies) {
        const event = history.event;
        const evt = event.getParent(2);
        if (Object.keys(evt).length > 0 && evt !== null && evt.card) {
          if (lib.skill.xuanshuimrfz.suitList.includes(get.suit(evt.card))) used.add(get.suit(evt.card));
        }
      }
      return used;
    },
    forced: true,
    init(player, skill2) {
      player.storage[skill2] = {
        index: 0,
        get used() {
          return lib.skill.xuanshuimrfz.getUsedSuit(player);
        }
      };
      lib.skill.xuanshuimrfz.updateSuit(player);
    },
    suitList: ["spade", "club", "heart", "diamond"],
    mark: true,
    intro: {
      content(storage, player) {
        return `·当前花色:${get.translation(lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0])}<br>·已使用花色:${get.translation(player.storage.xuanshuimrfz.used)}`;
      }
    },
    onremove: true,
    trigger: {
      player: "useCard1"
    },
    prompt(event) {
      const num = lib.skill.xuanshuimrfz.suitList.indexOf(get.suit(event.card)) || 0;
      return `【旋说】:是否摸${num + 1}张牌`;
    },
    filter(event, player) {
      return _status.currentPhase === player;
    },
    async content(event, trigger, player) {
      let used = player.storage.xuanshuimrfz.used;
      if (used.length >= 4) {
        player.disableSkill("xuanshuimrfz", ["xuanshuimrfz"]);
        player.when({ global: "phaseEnd" }).step(async (event2, trigger2, player2) => {
          player2.enableSkill("xuanshuimrfz");
        });
      }
      if (get.is.zhuanhuanji("xuanshuimrfz", player)) {
        const num = player.storage.xuanshuimrfz.index + 1 || 1;
        player.changeZhuanhuanji("xuanshuimrfz");
        player.draw(num);
      } else {
        const num = lib.skill.xuanshuimrfz.suitList.indexOf(get.suit(trigger.card));
        if (num !== -1) player.draw(num + 1);
        lib.skill.xuanshuimrfz.updateSuit(player);
      }
    },
    mod: {
      cardEnabled(card, player) {
        const suit = lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0];
        if (get.suit(card) !== suit && lib.skill.xuanshuimrfz.forced === true && _status.currentPhase === player) {
          return false;
        }
      },
      cardSavable(card, player) {
        const suit = lib.skill.xuanshuimrfz.suitList[player.storage.xuanshuimrfz.index || 0];
        if (get.suit(card) !== suit && lib.skill.xuanshuimrfz.forced === true && _status.currentPhase === player) {
          return false;
        }
      }
    }
  },
  "pozemrfz": {
    audio: ["部署2", "进驻设施"],
    limited: true,
    enable: "phaseUse",
    usable: 1,
    onremove: true,
    filter(event, player) {
      const skills = player.getOriginalSkills().filter((skill2) => {
        const info = get.info(skill2);
        return Object.keys(info).some((key) => ["forced", "zhuanhuanji", "juexingji", "limited"].includes(key));
      });
      return player.storage.pozemrfz !== true && skills.length > 0;
    },
    async content(event, trigger, player) {
      player.awakenSkill("pozemrfz");
      const skills = player.getOriginalSkills().filter((skill2) => {
        const info = get.info(skill2);
        return Object.keys(info).some((key) => ["forced", "locked", "zhuanhuanji", "juexingji", "limited", "dutySkill"].includes(key));
      });
      const { index } = await player.chooseControl(skills.map((skill2) => get.translation(skill2))).set(
        "choiceList",
        skills.map((skill2) => `${get.translation(skill2)}:${get.skillInfoTranslation(skill2)}`)
      ).set("displayIndex", false).set("prompt", `请选择你要删除标签的技能`).set("ai", () => {
        const { skills: skills2, player: player2 } = get.event();
        if (!skills2.includes("xuanshuimrfz")) return "pozemrfz";
        if (player2.countCards("he", "zhuge") > 0 || player2.countCards("h", (card) => get.type(card) === "equip" || get.type(card) === "trick") > 2) return "xuanshuimrfz";
        if (player2.hp <= 1) return "xuanshuimrfz";
        return "pozemrfz";
      }).set("skills", skills).forResult();
      if (typeof index === "number") {
        let num = 0;
        const skill2 = skills[index];
        let info = get.info(skill2);
        tmpSave[`${player.playerid}_pozemrfz`] = { name: skill2, info: { ...info } };
        const tags = ["forced", "locked", "zhuanhuanji", "juexingji", "limited", "dutySkill"];
        tags.forEach((tag) => {
          if (info[tag]) {
            num++;
            if (tag === "limited") player.restoreSkill(skill2);
            delete info[tag];
          }
        });
        if (num > 0) player.draw(num);
        player.when({ player: "phaseEnd", global: "phaseEnd" }).step(async (event2, trigger2, player2) => {
          const save = tmpSave[`${player2.playerid}_pozemrfz`];
          if (save && Object.keys(save).length > 0) {
            lib.skill[save.name] = save.info;
          }
        });
      }
    }
  }
});
translate({
  "xiangshimrfz": "响石",
  "xuanshuimrfz": "旋说",
  "xuanshuimrfz_info": "锁定技,转换技,你的回合内,你只能使用①♠②♣③♥④♦的手牌，且当你使用手牌时，你摸等同于当前项数的牌，若你本回合执行过【旋说】的所有选项，则本回合【旋说】失效。",
  "pozemrfz": "破则",
  "pozemrfz_info": "限定技，出牌阶段限一次，你可以删除你武将牌上其中一个技能的所有标签直到本回合结束，然后你摸X张牌。（X=你此次删除的标签数）"
});
characterTitle("xiangshimrfz", "<font color = #a52a2a>特殊渠道顾问</font>");
characterIntro("xiangshimrfz", "费尔南·伯恩，哥伦比亚人，经营着一家以“哪儿都能去”闻名的独立旅行社。除了已故的荣誉社员马丁·伯恩，费尔南便是该社的唯一成员。<br>接受治疗的同时，费尔南也与罗德岛达成了合作，以“响石”为代号，在各类外勤任务中行使向导职责。");
