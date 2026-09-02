import { whichWayUtil } from "../../utill.js";
import { character, characterTitle, translate, dynamicTranslate, skill } from "../hooks.js";
import { game, lib, get } from "noname";
character("jiemrfz", {
  hp: 4,
  sex: "female",
  group: "suimrfz",
  pack: "plotSJZX",
  skills: ["lanshimrfz", "lushimrfz"]
});
characterTitle("jiemrfz", "<font color = #eb156766>刚正凌俗</font>");
translate({
  jiemrfz: "颉",
  lanshimrfz: "览史",
  lanshimrfz_info: "回合[开始/结束]时,你可以视为使用一张你上个回合使用有对应实体牌的[最后一张/第一张]牌。",
  // cuanshimrfz: "篡史",
  // cuanshimrfz_info:
  // 	"锁定技，每轮结束时，你执行一个只有出牌阶段的回合，在此回合内：<br>1.你将手牌移出游戏直到回合结束;2.你可以让一名角色使用本轮使用过的牌;3.任意角色使用牌后，你令你的手牌上限-1或失去3点体力。",
  lushimrfz: "录史",
  lushimrfz_info: "锁定技，转换技，每有十二张牌被使用时，你<br>➀手牌上限+1<br>➁攻击距离+1<br>➂额定摸牌数+1<br>➃失去一点体力。",
  "#lanshimrfz1": "这一册册史书构成了人们对过往的认知，但这寥寥几笔，又远不足以让人们看清历史的全貌。",
  "#lanshimrfz2": "错误代代流传，就会在人心中根深蒂固。",
  // "#cuanshimrfz1": "治狱或许可以,治史却不然。",
  // "#cuanshimrfz2": "尚书大人有才学为万民谋福祉，而我不过是替那些无法发声的人们，保住一些可被看到的文字罢了。",
  "#lushimrfz1": "执笔者再怎么追求公正，历史总还是会因叙述者的立场扭曲形状。",
  "#lushimrfz2": "“秉笔直书”，说起来简单，却是十分深奥艰难的学问。",
  "#jiemrfz:die": "我本以为，随着年岁的增长，我愈发能够掌握这一份力量。可不知为什么，最近这些年来，自己仿佛变得越来越不像自己了"
});
dynamicTranslate("lushimrfz", (player) => {
  const maps = {
    0: "➀手牌上限+1",
    1: "➁攻击距离+1",
    2: "➂额定摸牌数+1",
    3: "➃失去一点体力"
  };
  const index = player.getStorage("lushimrfz")?.index || 0;
  const match = maps[index];
  let str = `锁定技，转换技，每有十二张牌被使用时，你<br>➀手牌上限+1<br>➁攻击距离+1<br>➂额定摸牌数+1<br>➃失去一点体力。`;
  for (let i = 0; i < 4; i++) {
    if (i === index) str = str.replace(match, whichWayUtil.colorize(`#r${match}#`));
    else str = str.replace(maps[i], whichWayUtil.colorize(`#s${maps[i]}#`));
  }
  return str;
});
skill({
  lanshimrfz: {
    audio: 2,
    trigger: {
      player: "phaseAfter"
    },
    filter(event, player, name, target) {
      const history = getLastHistory(player);
      return history !== null && history.length > 0 && history[0].card && player.hasUseTarget(history[0].card, false, false);
    },
    prompt2(event, player) {
      const { name, nature, suit, number } = getLastHistory(player)[0].card;
      const card = new lib.element.VCard(suit, number, name, nature, player);
      return `你可以视为使用${get.translation(card)}`;
    },
    async content(event, trigger, player) {
      const { name, nature, suit, number } = getLastHistory(player)[0].card;
      const card = new lib.element.VCard(suit, number, name, nature, player);
      player.chooseUseTarget().set("card", card).set("forced", true).set("addCount", false);
    },
    group: "lanshimrfz_phaseBefore",
    subSkill: {
      phaseBefore: {
        audio: "lanshimrfz",
        trigger: {
          player: "phaseBefore"
        },
        filter(event, player) {
          const history = getLastHistory(player);
          return history !== null && history.length > 0 && history[history.length - 1].card && player.hasUseTarget(history[history.length - 1].card, false, false);
        },
        prompt2(event, player) {
          const history = getLastHistory(player);
          const { name, nature, suit, number } = getLastHistory(player)[history.length - 1].card;
          const card = new lib.element.VCard(suit, number, name, nature, player);
          return `你可以视为使用${get.translation(card)}`;
        },
        async content(event, trigger, player) {
          const history = getLastHistory(player);
          const { name, nature, suit, number } = getLastHistory(player)[history.length - 1].card;
          const card = new lib.element.VCard(suit, number, name, nature, player);
          player.chooseUseTarget().set("card", card).set("forced", true).set("addCount", false);
        }
      }
    }
  },
  // cuanshimrfz: {},
  lushimrfz: {
    mod: {
      maxHandcard(player, num) {
        return num += player.getStorage("lushimrfz")?.handcard || 0;
      },
      attackRange(player, num) {
        return num += player.getStorage("lushimrfz")?.range || 0;
      }
    },
    audio: 2,
    trigger: {
      global: "useCardAfter"
    },
    filter(event, player, name, target) {
      return game.getAllGlobalHistory("useCard").length % 12 === 0;
    },
    forced: true,
    mark: true,
    zhuanhuanji(player, skill2) {
      player.storage.lushimrfz.index ??= 0;
      const index = player.getStorage("lushimrfz").index;
      if (index < 2) player.storage.lushimrfz.index++;
      else player.storage.lushimrfz.index = 0;
    },
    init(player, skill2) {
      player.storage[skill2] = {
        draw: 0,
        range: 0,
        handcard: 0,
        index: 0
      };
    },
    onremove: true,
    intro: {
      content(storage) {
        return `·你的手牌上限+${storage.handcard}<br>·攻击距离+${storage.range}<br>·额定摸牌数+${storage.draw}`;
      }
    },
    async content(event, trigger, player) {
      const index = player.getStorage("lushimrfz")?.index || 0;
      switch (index) {
        case 0:
          player.storage.lushimrfz.handcard += 1;
          break;
        case 1:
          player.storage.lushimrfz.range += 1;
          break;
        case 2:
          player.storage.lushimrfz.draw += 1;
          break;
        case 3:
          player.loseHp();
          break;
      }
      player.changeZhuanhuanji("lushimrfz");
    },
    group: "lushimrfz_draw",
    subSkill: {
      draw: {
        audio: false,
        charlotte: true,
        silent: true,
        trigger: {
          player: "phaseDrawBegin2"
        },
        filter(event, player) {
          return !event.numFixed;
        },
        async content(event, trigger, player) {
          trigger.num += player.getStorage("lushimrfz")?.draw || 0;
        }
      }
    }
  }
});
function getLastHistory(player) {
  const history = player.getLastHistory("useCard");
  if (!Array.isArray(history)) return null;
  return history.filter((evt) => evt?.card?.cards.length > 0);
}
