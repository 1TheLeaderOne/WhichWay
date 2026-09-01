import { game, _status, get, ui, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("xunlanmrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "gemrfz",
  hp: 4,
  skills: ["tanxunmrfz", "dongximrfz"]
});
skill({
  "tanxunmrfz": {
    audio: 2,
    forced: true,
    trigger: { player: "phaseBegin" },
    filter(event, player) {
      return !event.audioed;
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
    },
    ai: {
      viewHandcard: true,
      skillTagFilter(player, tag, arg) {
        if (player === arg || !player.inRange(arg) || _status.currentPhase !== player) return false;
      }
    }
  },
  "dongximrfz": {
    audio: 2,
    enable: "phaseUse",
    filter(event, player) {
      return player.countCards("h", (card) => player.canRecast(card)) > 0 && game.hasPlayer(
        (current) => current != player && player.inRange(current) && !current.hasSkill("dongximrfz_ban") && current.countCards("h", (card) => current.canRecast(card)) > 0
      );
    },
    filterTarget(card, player, target) {
      return target != player && player.inRange(target) && !target.hasSkill("dongximrfz_ban") && target.countCards("h", (cardx) => target.canRecast(cardx)) > 0;
    },
    filterCard(card) {
      return get.player().canRecast(card);
    },
    selectCard: [1, 2],
    check(card) {
      return 1;
    },
    discard: false,
    lose: false,
    async content(event, trigger, player) {
      const target = event.targets[0];
      target.addTempSkill("dongximrfz_ban", { global: "phaseUseEnd" });
      let cards1;
      if (_status.auto || !player.isUnderControl(true)) {
        let cards = [];
        for (let i of target.getCards("h")) {
          if (get.attitude(player, target) > 0) {
            for (let j of player.getCards("h")) {
              if (get.suit(i) !== get.suit(j)) continue;
              cards.push(j);
            }
          } else {
            for (let j of player.getCards("h")) {
              if (get.suit(i) === get.suit(j)) continue;
              cards.push(j);
            }
          }
        }
        if (cards.length > 2) cards = cards.slice(0, 2);
        cards1 = cards.length > 0 ? cards : player.getCards("h").randomGet();
      } else {
        cards1 = event.cards;
      }
      const { cards: cards2 } = await target.chooseCard([1, 2], true).set("filterCard", (card) => {
        return get.event().playerx.canRecast(card);
      }).set("prompt", `【洞悉】:你可以重铸至多两张牌`).set("prompt2", get.prompt2("dongximrfz")).set("ai", (card) => {
        let target2 = get.event().target, player2 = get.event().playerx;
        if (target2.countCards("h") > 2 && ui.selected.cards.length > 0 && get.attitude(player2, target2) < 0) return -1;
        return 8 - get.value(card, player2);
      }).set("playerx", target).set("target", player).forResult();
      if (!cards2) return;
      let bool = true;
      outerLoop: for (let i = 0; i < cards1.length; i++) {
        for (let j = 0; j < cards2.length; j++) {
          if (get.suit(cards1[i]) === get.suit(cards2[j])) {
            bool = false;
            break outerLoop;
          }
        }
      }
      player.recast(cards1);
      target.recast(cards2);
      let num = cards2.length;
      if (bool) {
        if (num < 1) return;
        if (target.countGainableCards(player, "h"))
          await player.gainPlayerCard("h", target, num, true).set("target", target).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
        await target.damage(num, player);
      } else {
        player.disableSkill("dongximrfz", ["dongximrfz"]);
        player.addTempSkill("dongximrfz_restore", { player: "phaseUseEnd" });
        game.log(player, "的技能", "#g" + get.translation("dongximrfz"), "失效了");
      }
    },
    subSkill: {
      ban: {
        charlotte: true
      },
      restore: {
        charlotte: true,
        forced: true,
        popup: false,
        onremove: function(player) {
          player.enableSkill("dongximrfz");
          game.log(player, "恢复了技能");
        }
      }
    },
    ai: {
      order: 2,
      result: {
        player: 1,
        target: -1
      }
    }
  }
});
translate({
  "xunlanmrfz": "寻澜",
  "tanxunmrfz": "探寻",
  "tanxunmrfz_info": "锁定技，你的回合内，你攻击距离内的其他角色的手牌始终对你可见。",
  "dongximrfz": "洞悉",
  "dongximrfz_info": "出牌阶段每名角色限一次，你可以与一名攻击距离内的其他角色各重铸一至两张牌，若重铸的牌均没有花色相同的牌，你对其造成X点伤害并获得其X张手牌，反之，此技能失效直到本阶段结束。（X=其重铸的牌数）"
});
characterTitle("xunlanmrfz", "<font color='#00008b'>幽灵探险者</font>");
characterIntro("xunlanmrfz", "黑钢先遣小组队员蒂拉，代号寻澜。工作能力极强，现由本人申请，以合作干员的身份于罗德岛就职，拓展黑钢与罗德岛合作的前期情报搜集工作。");
//# sourceMappingURL=xunlanmrfz.js.map
