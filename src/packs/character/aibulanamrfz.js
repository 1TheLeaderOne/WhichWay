import { lib, game, get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("aibulanamrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 4,
  skills: ["yizhamrfz", "kumianmrfz"]
});
skill({
  "yizhamrfz": {
    init() {
      lib.translate["yizhamrfz_tip1"] = "拼点";
      lib.translate["yizhamrfz_tip2"] = "议事";
    },
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((char) => char !== player && char.countCards("h") > 0 && player.canCompare(char)) && player.countCards("h") > 0;
    },
    filterTarget(card, player, target) {
      return target !== player && target.countCards("h") > 0 && player.canCompare(target);
    },
    selectTarget: [1, 2],
    multitarget: true,
    multiline: true,
    async content(event, trigger, player) {
      let { targets } = event;
      function aiChoose(char) {
        let cards = char.getCards("h");
        if (cards.length < 2) return cards;
        let sortNumber = cards.sort((a, b) => {
          return get.number(b, char) - get.number(a, char);
        });
        let sortValue = cards.sort((a, b) => {
          return get.value(b, char) - get.value(a, char);
        });
        let max = sortNumber[0];
        let min = sortNumber[sortNumber.length - 1];
        if (player.countCards("h", { color: "red" }) < 1) {
          return [max, sortValue[sortValue.length - 1]];
        } else if (player.countCards("h", { color: "black" }) < 1) {
          return [min, sortValue[sortValue.length - 1]];
        } else {
          if (Math.random() > 0.5) {
            let black = cards.filter((card) => get.color(card) === "black" && card !== max);
            return [max, black.length > 0 ? black.randomGet() : cards.filter((card) => card !== max).randomGet()];
          } else {
            let red = cards.filter((card) => get.color(card) === "red" && card !== min);
            return [min, red.length > 0 ? red.randomGet() : cards.filter((card) => card !== min).randomGet()];
          }
        }
      }
      let cardMaps = [];
      for (let target of [...targets, player]) {
        let cardsCompare;
        const result = await target.chooseCard(true).set("prompt", "【刈诈】：请选择一张手牌进行拼点").set("type", "compare").set("ai", (card) => {
          get.player();
          let result3 = get.event().aiChooseResult;
          return result3[0] === card;
        }).set("aiChooseResult", aiChoose(target)).forResult();
        if (!result || !result.cards) return;
        if (result.skill) {
          cardsCompare = lib.skill[result.skill].onCompare(target)[0];
        } else cardsCompare = result.cards[0];
        const { cards } = await target.chooseCard(true).set("type", "debate").set("source", player).set("prompt", "【刈诈】：请选择一张手牌进行议事").set("filterCard", (card, player2, event2) => {
          let banCard = get.event().banCard;
          return card !== banCard;
        }).set("complexCard", true).set("ai", (card) => {
          get.player();
          let result3 = get.event().aiChooseResult;
          return result3[0] === card;
        }).set("aiChooseResult", aiChoose(target)).set("banCard", cardsCompare).forResult();
        if (!cards) return;
        const cardsDebate = cards[0];
        cardMaps.push([target, [cardsCompare, cardsDebate]]);
      }
      let compareMaps = {};
      let debateMaps = [];
      for (let arr of cardMaps) {
        compareMaps[arr[0].playerid] = arr[1][0];
        if (arr[1] && arr[1][1]) debateMaps.push([arr[0], arr[1][1]]);
      }
      let targetCompare = targets.filter((target) => Object.keys(compareMaps).includes(target.playerid));
      let targetDebate = targets.filter((target) => debateMaps.map((arr) => arr[0]).includes(target));
      let result1 = await player.chooseToCompare(targetCompare).set("fixedResult", compareMaps).forResult();
      let result2 = await player.chooseToDebate([...targetDebate, player]).set("fixedResult", debateMaps).forResult();
      [...targetDebate, player].forEach((target) => target.removeGaintag("yizhamrfz_tip2"));
      let compareResult = {
        win: [],
        lose: []
      };
      for (let i = 0; i < result1.num1.length; i++) {
        if (result1.num1[i] > result1.num2[i]) {
          compareResult.lose.add(targetCompare[i]);
          compareResult.win.add(player);
        } else {
          compareResult.lose.add(player);
          compareResult.win.add(targetCompare[i]);
        }
      }
      if (result2.opinion === "black") {
        for (let char of compareResult.lose) {
          if (!compareResult.win.includes(char)) await char.damage(player);
        }
      } else if (result2.opinion === "red") {
        for (let char of compareResult.win) {
          if (char.countDiscardableCards(player, "he"))
            await player.discardPlayerCard(char, true, 2, "he").set("ai", lib.card.guohe.ai.button);
        }
      } else {
        const { targets: targetsx } = await player.chooseTarget().set("prompt", "【刈诈】：你可以对任意名角色造成一点伤害").set("selectTarget", [1, Infinity]).set("ai", (target) => {
          let player2 = get.player();
          return get.damageEffect(target, player2, player2) > 0;
        }).forResult();
        if (targetsx) {
          for (let char of targetsx) {
            char.damage(player);
            player.line(char);
          }
        }
        player.draw(2);
      }
    },
    ai: {
      order: 10,
      result: {
        player: 1,
        target: -1
      }
    }
  },
  "kumianmrfz": {
    audio: 2,
    trigger: { player: "phaseJieshuEnd" },
    getNum(player) {
      let num = 0;
      let cards = [];
      num += player.getStat("damage") || 0;
      for (let char of game.players) {
        char.getHistory("lose", (evt) => {
          if (evt.type === "discard" && evt.cards) {
            let discards = get.discarded();
            let result = evt.cards.filter((card) => discards.includes(card));
            if (result.length > 0) cards.push(...result);
          }
        });
      }
      if (cards.length > 0) num += new Set(cards.map((i) => get.type2(i))).size;
      return num;
    },
    filter(event, player) {
      let num = lib.skill.kumianmrfz.getNum(player);
      return num > 0;
    },
    init(player) {
      game.broadcastAll(function() {
        let skills = ["new_rejianxiong", "shanzhuan", "olzaowang"];
        skills.forEach((skill2) => {
          let info = get.info(skill2);
          if (!info.audioname2) info.audioname2 = {};
          info.audioname2[player.name] = "kumianmrfz";
        });
      });
    },
    derivation: ["new_rejianxiong", "shanzhuan", "olzaowang"],
    forced: true,
    async content(event, trigger, player) {
      let num = lib.skill.kumianmrfz.getNum(player);
      if (num > 0) {
        player.draw();
      }
      if (num > 1) player.addTempSkill("new_rejianxiong", { player: "phaseJieshuBegin" });
      if (num > 2) player.addTempSkill("shanzhuan", { player: "phaseJieshuBegin" });
      if (num > 3) player.addTempSkill("olzaowang", { player: "phaseJieshuBegin" });
    }
  }
});
translate({
  "aibulanamrfz": "爱布拉娜",
  "yizhamrfz": "刈诈",
  "yizhamrfz_info": "出牌阶段限一次，你可以与至多两名角色议事（你也参与）并同时拼点，若议事结果为：<br>1.黑：你对所有拼点一次没赢的角色造成一点伤害；<br>2.红：你弃置所有赢的角色的各两张牌；<br>3.无结果：你可以对任意名角色造成一点伤害并摸两张牌。",
  "kumianmrfz": "枯冕",
  "kumianmrfz_info": "锁定技，结束阶段结束时，你执行至N项：<br>1.摸一张牌<br>2.获得【奸雄】；<br>3.获得【擅专】；<br>4.获得【造王】。<br>(你以此法获得的技能于你的下个结束阶段开始时失去之)<br>(N=本回合因弃置而进入弃牌堆牌的类别的数量与你造成的伤害数之和)"
});
characterTitle("aibulanamrfz", "<font color='#8b008b'>何以丕平</font>");
characterIntro("aibulanamrfz", "死芒，本名爱布拉娜·都柏林，前“深池”领袖，该组织现已不复存在。在谨慎权衡之后，罗德岛有条件地同意与其建立一定程度的合作关系。经医疗部、人事部和博士共同确认，死芒的所有档案移入高权限资料库。");
