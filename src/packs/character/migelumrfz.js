import { character, characterTitle, characterIntro, translate, skill } from "../hooks.js";
import { get, _status, game } from "noname";
const NAME = "migelumrfz";
character(NAME, {
  sex: "female",
  group: "luomrfz",
  skills: ["beagle_jiandunmrfz", "hengxinmrfz"],
  pack: "normalSJZX",
  hp: 3
});
characterTitle(NAME, "<font color = #1188d2>坚盾继任者</font>");
characterIntro(NAME, "<font color = red>米格鲁</font>，行动预备组A1前卫队员。与芬以及克洛丝一起来到罗德岛。虽然有不成熟的一面，但也逐渐展现出了专业和不认输的一面以及极强的天赋，慢慢成为了被更多人认可的可靠干员。");
translate({
  [NAME]: "米格鲁",
  beagle_jiandunmrfz: "坚盾",
  beagle_jiandunmrfz_info: "任意角色的准备阶段，你可以弃置X+1张手牌并令当前回合角色获得一点护甲，然后你与其摸X张牌。（X = 你的护甲数）",
  hengxinmrfz: "恒心",
  hengxinmrfz_info: "锁定技，其他角色的回合开始时，你记录你的手牌，并于本回合结束后将手牌调整至与记录相同。"
});
skill({
  beagle_jiandunmrfz: {
    audio: ["作战中1", "作战中2", "选中干员1"],
    trigger: {
      global: "phaseZhunbeiBegin"
    },
    filter(event, player, name, target) {
      return player.countCards("h") > player.hujia + 1 && _status.currentPhase && _status.currentPhase.isIn();
    },
    async cost(event, trigger, player) {
      const result = await player.chooseToDiscard({
        prompt: get.prompt("beagle_jiandunmrfz"),
        prompt2: `你可以弃置${player.hujia + 1}张手牌并令${get.translation(_status.currentPhase)}获得一点护甲，然后你与其摸${player.hujia}张牌。`,
        selectCard: player.hujia + 1,
        ai(card) {
          const player2 = get.player();
          const records = player2.storage?.hengxinmrfz || [];
          if (get.attitude(player2, _status.currentPhase) < 0) return -1;
          return 8 - get.value(card) + (records.includes(card) ? 1.5 : 0);
        }
      }).forResult();
      event.result = result;
    },
    async content(event, trigger, player) {
      await _status.currentPhase.changeHujia(1, "gain", 5);
      if (player.hujia > 0) {
        game.asyncDraw([_status.currentPhase, player], player.hujia);
      }
    }
  },
  hengxinmrfz: {
    audio: ["完成高难行动", "编入队伍"],
    trigger: {
      global: "phaseBeginStart"
    },
    filter(event, player, name, target) {
      return _status.currentPhase !== player;
    },
    intro: {
      mark(dialog, storage, player) {
        if (!Array.isArray(storage)) {
          dialog.addText("无记录", true);
          return;
        }
        dialog.addText("本回合记录的牌");
        dialog.addAuto(storage);
      }
    },
    onremove: true,
    forced: true,
    silent: true,
    async content(event, trigger, player) {
      player.storage.hengxinmrfz = player.getCards("h").slice();
      player.markSkill("hengxinmrfz");
    },
    group: "hengxinmrfz_gain",
    subSkill: {
      gain: {
        audio: "hengxinmrfz",
        charlotte: true,
        forced: true,
        trigger: {
          global: "phaseEnd"
        },
        filter(event, player, name, target) {
          return _status.currentPhase !== player && Array.isArray(player.storage.hengxinmrfz);
        },
        async content(event, trigger, player) {
          const records = player.storage.hengxinmrfz;
          const discards = player.getCards("h", (card) => {
            return records.filter((CARD) => CARD.cardid === card.cardid).length <= 0;
          });
          records.removeArray(player.getCards("h", (card) => discards.includes(card)));
          await player.loseToDiscardpile({ cards: discards });
          if (records.length < 1) return;
          const candidate = [];
          for (let record of records) {
            const card = get.cardPile((cardx) => record === cardx, "field");
            if (card) candidate.push(card);
          }
          if (candidate.length > 0) {
            player.gain({
              cards: candidate,
              animate: "gain2"
            });
          }
        }
      }
    }
  }
});
