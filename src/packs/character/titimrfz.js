import { get, game, lib, _status } from "noname";
import { whichWayTips } from "../../tips/index.js";
import { whichWayUtil } from "../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("titimrfz", {
  pack: "legendSJZX",
  sex: "female",
  hp: 3,
  skills: ["xiushimrfz", "canshimrfz", "titimrfz_mingshimrfz"],
  group: "samrfz",
  designer: "涵涵"
});
skill({
  "xiushimrfz": {
    audio: ["作战中1", "作战中2"],
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return player.countCards("he") > 0 && game.hasPlayer((c) => c !== player && c.countCards("he") > 0);
    },
    filterTarget(card, player, target) {
      return target.countCards("he") > 0 && target !== player;
    },
    filterCard(card, player) {
      if (get.type(card) === "trick") {
        whichWayTips.addPrompt(card, `可摸牌`, "xiushimrfz_tip", "uncheckBegin");
      }
      return true;
    },
    position: "he",
    check(card) {
      if (get.type(card) !== "trick") return -1;
      return 114514 - get.value(card);
    },
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const {
        targets: [target],
        cards: [card]
      } = event;
      const {
        //@ts-ignore
        cards: [card2]
      } = await target.chooseCard("he").set("forced", true).set("position", "he").set("prompt", whichWayUtil.colorize(`【修使】:请选择你要交给${get.translation(player)}的牌，若为#r装备牌#，你与其各摸一张牌`)).set("ai", (card3) => {
        let player2 = get.player(), target2 = get.event().targetx;
        if (get.attitude(player2, target2) < 0) return -get.value(card3);
        if (get.type(card3) === "equip") return 10 - get.value(card3);
        if (get.tag(card3, "damage") > 0) return 8 - get.value(card3);
        return -get.value(card3);
      }).set("targetx", player).forResult();
      if (!card2) return;
      await player.swapHandcards(target, [card], [card2]);
      const count = [];
      if (get.type(card2) === "equip") count.push("林登万");
      if (get.type(card) === "trick") count.push("林登万");
      for (const i of count) {
        game.asyncDraw([target, player], 1);
      }
    },
    ai: {
      order: 13,
      result: {
        target(player, target) {
          let res = 0;
          if (get.attitude(player, target) < 0) return;
          if (player.countCards("h", { type: "trick" }) > 0) res += 2;
          if (target.countCards("e") > 0) res += 2;
          return res;
        }
      }
    }
  },
  "canshimrfz": {
    audio: ["部署1", "部署2"],
    forced: true,
    global: "canshimrfz_eff",
    mod: {
      maxHandcard(player, num) {
        return num += game.countPlayer((char) => char.group === player.group) || 0;
      }
    },
    subSkill: {
      eff: {
        charlotte: true,
        silent: true,
        mod: {
          playerEnabled(card, player, target, result) {
            if (_status.currentPhase !== player) return result;
            const targets = game.filterPlayer((c) => c.hasSkill("canshimrfz") && c !== player) || [];
            if (targets.some((char) => player.inRange(char)) && get.tag(card, "damage") > 0) {
              for (let targetx of targets) {
                if (!player.inRange(targetx)) continue;
                let num = game.countPlayer((c) => c.group === targetx.group);
                if (player.getHistory("useCard")?.length + 1 === num) {
                  return target === targetx;
                }
              }
            }
            return result;
          }
        }
      }
    }
  },
  "titimrfz_mingshimrfz": {
    audio: ["作战中3", "作战中4"],
    init(player, skill2) {
      player.storage[skill2] = false;
    },
    onremove: true,
    mark: true,
    zhuanhuanji: true,
    marktext: "☯",
    intro: {
      content(storage, player, skill2) {
        return whichWayUtil.colorize(`转换技，${storage ? "#s阳：出牌阶段限一次#;#y阴：当你受到伤害后#" : "#r阳：出牌阶段限一次#;#s阴：当你受到伤害后#"}。你可以展示手牌，并使用其中一张普通锦囊牌，你因此使用的普通锦囊牌额外结算Y次。（Y=你手牌中普通锦囊牌的数量）`);
      }
    },
    trigger: {
      player: "damageEnd"
    },
    filter(event, player) {
      return player.storage.titimrfz_mingshimrfz === true && player.countCards("h") > 0;
    },
    check() {
      const player = get.player();
      return player.countCards("h", (card) => get.type(card) === "trick" && player.hasUseTarget(card) && game.hasPlayer((c) => get.effect(c, card, player, player) > 0));
    },
    async content(event, trigger, player) {
      player.changeZhuanhuanji("titimrfz_mingshimrfz");
      const extra = player.countCards("h", (card) => get.type(card) === "trick");
      const cards = player.getCards("h");
      player.showCards(player.getCards("h"), `${get.translation(player)}【明史】展示的牌`);
      if (extra < 1) return;
      player.when({ player: "useCard" }).filter((event2) => {
        return event2.getParent().titimrfz_mingshimrfz_useCard === true;
      }).step(async (event2, trigger2, player2) => {
        trigger2.effectCount += extra;
        game.log(player2, "因", "#g【明史】", "令", `#y${get.translation(trigger2.card)}`, "额外结算", extra, "次");
      });
      await player.chooseToUse().set("titimrfz_mingshimrfz_useCard", true).set("filterCard", (card) => {
        if (cards.includes(card)) {
          whichWayTips.addPrompt(card, "【明史】展示", "titimrfz_mingshimrfz_tip", "uncheckEnd");
        }
        return get.type(card) === "trick" && cards.includes(card);
      }).set("forced", true).set("prompt", whichWayUtil.colorize(`【明史】:请选择你要使用的普通锦囊牌<br>#r此牌额外结算${extra}次#`)).set("ai", (card) => get.value(card));
    },
    group: ["titimrfz_mingshimrfz_phaseUse"],
    subSkill: {
      phaseUse: {
        audio: "titimrfz_mingshimrfz",
        enable: "phaseUse",
        usable: 1,
        filter(event, player) {
          return player.storage.titimrfz_mingshimrfz === false && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          await lib.skill.titimrfz_mingshimrfz.content(event, trigger, player);
        },
        ai: {
          order: 10,
          result: {
            player(player) {
              const cards = player.getCards("h", (card) => get.type(card) === "trick" && player.hasUseTarget(card));
              return cards.some((card) => game.hasPlayer((c) => get.effect(c, card, player, player) > 0)) ? 1 : 0;
            }
          }
        }
      }
    }
  }
});
translate({
  "titimrfz": "缇缇",
  "titimrfz_mingshimrfz": "明史",
  "titimrfz_mingshimrfz_info": "转换技，#r阳：出牌阶段限一次#;#y阴：当你受到伤害后#。你可以展示手牌，并使用其中一张普通锦囊牌，你因此使用的普通锦囊牌额外结算Y次。（Y=你手牌中普通锦囊牌的数量）",
  "xiushimrfz": "修使",
  "xiushimrfz_info": "出牌阶段限一次，你可以与一名其他角色交换一张牌，每满足一项你与其各摸一张牌：<br>1.其因此获得了装备牌;<br>2.你因此获得了锦囊牌。",
  "canshimrfz": "残势",
  "canshimrfz_info": "锁定技。<br>①你的手牌上限+X;<br>②其他角色的回合内，若你在其他角色的攻击范围内，其使用的第X张伤害类牌只能指定你为目标。<br>（X = 与你势力相同的角色数）"
});
characterTitle("titimrfz", "<font color = #a52a2a>拂扫除垢</font>");
characterIntro("titimrfz", "法尔贾万达巴德博物馆现任馆长梅捷缇克缇，只有朋友才可以称她“缇缇”。现以外勤干员的身份与罗德岛展开合作。她也希望能尽自己的全力，修复萨尔贡与米诺斯的关系。");
