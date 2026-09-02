import { get, game, ui, lib } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("yeyingmrfz", {
  pack: "legendSJZX",
  sex: "female",
  hp: 3,
  group: "shimrfz",
  skills: ["guqiumrfz", "newpolongmrfz"]
});
skill({
  "guqiumrfz": {
    mod: {
      cardnumber(card, player, num) {
        if (card.hasGaintag("guqiumrfz_number")) return num += 3;
      }
    },
    derivation: ["shanzhuan"],
    audio: "qiulongmrfz",
    trigger: {
      global: "roundStart"
    },
    init() {
      lib.translate["guqiumrfz_number"] = `点数+3`;
    },
    forced: true,
    filter(event, player) {
      return game.hasPlayer((char) => char !== player && char.inRange(player));
    },
    async content(event, trigger, player) {
      for (let char of game.players) {
        if (char === player || !char.inRange(player)) continue;
        let next = game.createEvent("guqiumrfz_shanzhuan");
        next.player = char;
        next._trigger = {
          player
        };
        await next.setContent(lib.skill.shanzhuan.content);
      }
      player.drawTo(5).set("gaintag", ["guqiumrfz_number"]);
    },
    group: "guqiumrfz_compare",
    subSkill: {
      compare: {
        silent: true,
        charlotte: true,
        trigger: {
          player: "compare",
          target: "compare"
        },
        filter(event, player) {
          if (event.iwhile && event.player === player) {
            return false;
          }
          return (
            //@ts-ignore
            player.getHistory("lose", (evt) => {
              let cardid = event[event.player === player ? "card1" : "card2"].cardid;
              if (evt.gaintag_map && Object.keys(evt.gaintag_map).includes(cardid) && evt.gaintag_map[cardid].includes("guqiumrfz_number"))
                return true;
            }).length > 0
          );
        },
        async content(event, trigger, player) {
          game.log(player, `的拼点牌点数+3`);
          trigger[trigger.player === player ? "num1" : "num2"] += 3;
        }
      }
    },
    ai: {
      combo: "newpolongmrfz"
    }
  },
  "newpolongmrfz": {
    mod: {
      cardUsable: function(card, player, num) {
        if (typeof num === "number" && card?.cards?.some((cardx) => cardx.hasGaintag("newpolongmrfz"))) return Infinity;
      },
      targetInRange: function(card, player, target, now) {
        if (card?.cards?.some((cardx) => cardx.hasGaintag("newpolongmrfz"))) return true;
      }
    },
    audio: "polongmrfz",
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return game.countPlayer((char) => char.countCards("h") > 0) > 1;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget().set("prompt", get.prompt("newpolongmrfz")).set(
        "prompt2",
        `你可以令一名角色A与角色B(角色B不能为你)拼点，若角色A赢，你将判定区的牌翻面，然后摸2X张牌，且你因此获得的牌本回合无距离次数限制。（X=你因此翻面的牌数）`
      ).set("targetprompt", ["角色A", "角色B"]).set("filterTarget", (card, player2, target) => {
        if (target.countCards("h") < 1) return false;
        let targets = ui.selected.targets;
        return targets.length < 1 || targets[0].canCompare(target) && target !== player2;
      }).set("ai", (target) => {
        let targets = ui.selected.targets;
        let player2 = get.player();
        if (player2.countCards("j", (card) => get.type(card) === "delay") < 1) {
          return get.attitude2(target) < 0;
        } else if (targets.length < 1) {
          if (player2.countCards("h", (card) => get.number(card) > 7) > 0) return target === player2 ? 114514 : -1;
          return get.attitude2(target) < 0 || get.attitude2(target) > 0 && target.countCards("h") > 3;
        } else {
          return get.attitude2(target) < 0;
        }
      }).set("complexTarget", true).set("selectTarget", 2).forResult();
    },
    async content(event, trigger, player) {
      const [targetA, targetB] = event.targets;
      const result = await targetA.chooseToCompare(targetB).forResult();
      if (result.winner === targetA) {
        const cards = player.getCards("j").filter((card) => get.type(card) === "delay");
        game.cardsGotoOrdering(cards);
        const links = cards.map((card) => {
          return card.viewAs ? card.cards : get.autoViewAs(card);
        }).flat();
        console.log(links);
        links.forEach((card) => {
          if (get.type(card, null, false) !== "delay") {
            card.fix();
            player.addJudge({ name: "xumou_jsrg" }, [card]);
          } else {
            player.addJudge({ name: "xumou_jsrg" }, card.cards);
          }
        });
        player.draw(links.length * 2).set("gaintag", ["newpolongmrfz"]);
      }
    },
    group: "newpolongmrfz_clear",
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        trigger: { player: "phaseEnd" },
        async content(event, trigger, player) {
          player.removeGaintag("newpolongmrfz", player.getCards("h"));
        }
      }
    }
  }
});
translate({
  "yeyingmrfz": "夜莺",
  "guqiumrfz": "锢囚",
  "guqiumrfz_info": "锁定技，每轮开始时，攻击范围内有你的其他角色视为对你使用“擅专”，然后你将手牌补至5，且你因此获得的牌点数+3。",
  "newpolongmrfz": "破笼",
  "newpolongmrfz_info": "准备阶段，你可以令一名角色A与角色B(角色B不能为你)拼点，若角色A赢，你将判定区的牌翻面，然后摸2X张牌，且你因此获得的牌本回合无距离次数限制。（X=你因此翻面的牌数）"
});
characterIntro("yeyingmrfz", "夜莺，萨卡兹人，感染者援助团体“使徒”的一员，其它履历缺失。于源石技艺、战场急救、临床医学等领域具备高超天赋。</br>现于罗德岛接受治疗，同时为罗德岛提供战场医疗救护、源石技艺援护等服务。");
