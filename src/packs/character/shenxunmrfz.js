import { _status, get, lib, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("shenxunmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "a_groupmrfz",
  hp: 5,
  skills: ["yuchaomrfz", "yanhuimrfz"]
});
skill({
  "yuchaomrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((current) => current != player && player.canCompare(current, true, false)) && player.countCards("hej") > 0;
    },
    filterTarget(card, player, target) {
      return player.canCompare(target, true, false) && target != player;
    },
    selectTarget: [1, 2],
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      let targets = event.targets;
      const { links } = await player.choosePlayerCard(player, "hej", true).set("prompt", `【御潮】:请选择你的拼点牌`).set("ai", function(button) {
        var card = button.link;
        get.event().player;
        var num = 0;
        if (get.position(card) == "j") num += 3 + get.value(card) / 2;
        if (get.position(card) == "e") num -= 2;
        return get.number(card) + num - get.value(card) / 2;
      }).forResult();
      if (!links) return;
      let next = player.chooseToCompare(targets);
      if (!next.fixedResult) next.fixedResult = {};
      next.fixedResult[player.playerid] = links[0];
      next.callback = lib.skill.yuchaomrfz.callback;
    },
    async callback(event, trigger, player) {
      if (event.num1 < event.num2) player.link(true);
      else if (event.num1 > event.num2) {
        event.target.link(true);
        player.addTempSkill("yuchaomrfz_eff", "phaseEnd");
      } else {
        event.target.link(true);
        player.link(true);
      }
    },
    subSkill: {
      eff: {
        charlotte: true,
        mod: {
          cardUsableTarget(card, player, target) {
            if (target.isLinked()) return true;
          }
        }
      }
    },
    ai: {
      order: 8,
      result: {
        target: -1,
        player: 1
      }
    }
  },
  "yanhuimrfz": {
    audio: 2,
    derivation: ["binglinchengxia"],
    trigger: { player: "phaseUseBegin" },
    forced: true,
    filter(event, player) {
      var card = get.autoViewAs({ name: "binglinchengxia" }, [_status.pileTop]);
      return player.canAddJudge(card);
    },
    async content(event, trigger, player) {
      await player.addJudge({ name: "binglinchengxia" }, [_status.pileTop]);
      player.draw(player.hp);
      player.loseHp();
    }
  }
});
translate({
  "shenxunmrfz": "深巡",
  "yuchaomrfz": "御潮",
  "yuchaomrfz_info": "出牌阶段限一次，你可以选择区域内的一张牌，用此牌与至多两名角色同时拼点，每次拼点中没赢的角色横置武将牌，若在此次拼点中若你赢过，本回合你对被横置的角色使用牌无次数限制。",
  "yanhuimrfz": "延辉",
  "yanhuimrfz_info": "锁定技，出牌阶段开始时，你将牌堆顶的一张牌当作【兵临城下】置入你的判定区，然后你摸X张牌并流失一点体力。（X = 你当前的体力值，X至多为5）"
});
characterTitle("shenxunmrfz", "<font color=#DC143C>执者失之</font>");
characterIntro("shenxunmrfz", "深巡，原名西昆妲，前深海猎人计划研究员，现服役于阿戈尔军团系统，担任海巡队指挥官。在阿戈尔向陆上诸国发出合作邀请后，西昆妲以阿戈尔对陆接洽代表的身份与罗德岛达成合作协议，以罗德岛为媒介与陆上诸国建立交流关系。<br>现以“深巡”为代号，登记为罗德岛合作干员。");
