import { get, game, lib, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("hainimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "a_groupmrfz",
  hp: 3,
  skills: ["jingchaomrfz", "cehuimrfz"]
});
skill({
  "jingchaomrfz": {
    audio: 2,
    trigger: { player: "damageEnd" },
    filter(event, player) {
      return player.countCards("he") > 1;
    },
    check(event, player) {
      if (player.getDamagedHp() < 1) return false;
      return 3 - player.getDamagedHp() + player.getCards("he", (card) => get.value(card) < 7).length;
    },
    async cost(event, trigger, player) {
      const { result } = await player.chooseToDiscard(2, "he").set("prompt2", `你可以弃置两张牌并回复${trigger.num}点体力，若你弃置的牌类别不同，你将手牌补至5张`).set("ai", (card) => {
        var player2 = get.event().player, selected = ui.selected.cards, num = get.value(card);
        for (var i of selected) {
          if (get.type2(i) == get.type2(card)) ;
        }
        return 7 - num + player2.getDamagedHp();
      });
      event.result = result;
    },
    async content(event, trigger, player) {
      let cards = event.cards;
      player.recover(trigger.num);
      if (cards.length != 2) return;
      if (get.type2(cards[0]) != get.type2(cards[1])) {
        player.drawTo(5);
        player.tempBanSkill("jingchaomrfz", "phaseEnd", false);
        game.log(this, "的技能", `#g【静潮】`, `本回合失效了`);
      }
    },
    ai: {
      maixie_hp: true,
      threaten: 0.8
    }
  },
  "cehuimrfz": {
    init(player, skill2) {
      player.storage[skill2] = 0;
    },
    audio: 2,
    mark: true,
    intro: {
      content: "本回合开始时手牌数为：#"
    },
    trigger: {
      global: "phaseJieshuBegin"
    },
    getDiscardCards(event) {
      let cards = [];
      for (var i of game.players.slice().concat(game.dead)) {
        var history = i.getHistory("lose", function(evt) {
          return evt && evt.type == "discard";
        });
        if (history.length == 0) continue;
        for (var k of history) {
          if (k.cards.length == 0) continue;
          for (var j of k.cards) {
            if (get.position(j) != "d") continue;
            cards.push(j);
          }
        }
      }
      return cards;
    },
    filter(event, player) {
      var cards = lib.skill.cehuimrfz.getDiscardCards(event);
      if (!game.hasPlayer((current) => current != player && player.canCompare(current, true, false))) return false;
      return player.countCards("h") != player.storage.cehuimrfz && cards.length > 0;
    },
    async cost(event, trigger, player) {
      var cards = lib.skill.cehuimrfz.getDiscardCards(trigger);
      const result = await player.chooseCardButton(cards).set("prompt2", `你可以选择一张牌并与一名其他角色进行拼点，若你赢，你使用牌堆顶3张牌`).set("ai", (link) => get.number(link)).forResult();
      result.cost_data = result.links;
      event.result = result;
    },
    async content(event, trigger, player) {
      let card = event.cost_data[0];
      const { targets } = await player.chooseTarget(true).set("prompt", `【测绘】:请选择一名其他角色进行拼点`).set("filterTarget", (card2, player2, target) => target != player2 && player2.canCompare(target, true, false)).set("ai", (target) => {
        var player2 = get.event().player;
        return get.attitude(player2, target) < 0;
      }).forResult();
      if (!targets) return;
      var tmpfuc = async function() {
        let next2 = player.chooseToCompare(targets[0]);
        if (!next2.fixedResult) next2.fixedResult = {};
        next2.fixedResult[player.playerid] = card;
        return await next2.forResult();
      };
      var next = await tmpfuc();
      if (next.bool) {
        var cards = game.cardsGotoOrdering(get.cards(3)).cards;
        player.showCards(cards, `${get.translation(player)}展示了牌堆顶三张牌`);
        let canUse = cards.filter((i) => player.hasUseTarget(i, false));
        if (canUse.length == 0) return;
        while (canUse.length > 0) {
          const { links } = canUse.length == 1 ? { links: canUse } : await player.chooseCardButton(canUse, true).set("prompt", `【测绘】:请选择你要使用的牌`).set("ai", (link) => get.number(link)).forResult();
          if (!links) continue;
          await player.chooseUseTarget(links[0]).set("nodistance", true).set("prompt", `请选择${get.translation(links[0])}的目标`);
          canUse.remove(links[0]);
        }
      }
    },
    group: ["cehuimrfz_record"],
    subSkill: {
      record: {
        silent: true,
        charlotte: true,
        trigger: {
          global: "phaseBegin"
        },
        async content(event, trigger, player) {
          if (typeof player.storage.cehuimrfz !== "number") player.storage.cehuimrfz = 0;
          player.storage.cehuimrfz = player.countCards("h");
        }
      }
    }
  }
});
translate({
  "hainimrfz": "海霓",
  "jingchaomrfz": "静潮",
  "jingchaomrfz_info": "当你受到伤害后，你可以弃置两张不同颜色的牌，并回复等量体力，若弃置的牌类别均不同，你将手牌补至5张且此技能本回合失效。",
  "cehuimrfz": "测绘",
  "cehuimrfz_info": "一名角色的结束阶段，若你的手牌数与本回合开始时你的手牌数不一样，你可以用本回合因弃置而进入弃牌堆的牌与一名其他角色拼点，若你赢，你展示牌堆顶3张牌并使用之。"
});
characterTitle("hainimrfz", "<font color=#00868B>山静水流开画景</font>");
characterIntro("hainimrfz", "海霓，本名卢契拉，阿戈尔人，隶属技术院设施管理所，于穹顶系统担任穹顶管理员与洋流测绘员。阿戈尔与陆地建立联系后，卢契拉出于个人兴趣，以个人名义与罗德岛达成合作，不定期前来进行文化交流。<br>现以“海霓”为代号，登记为罗德岛合作干员。");
//# sourceMappingURL=hainimrfz.js.map
