import { get, _status, game, ui, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("wuerbianmrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "a_groupmrfz",
  hp: 4,
  skills: ["guqianmrfz", "piweimrfz", "tongmaimrfz"],
  clans: ["深海猎人"]
});
skill({
  "piweimrfz": {
    audio: 2,
    trigger: {
      player: "turnOverAfter"
    },
    filter(event, player) {
      return player.countCards("h") > 0 && player.hasUseTarget("chuqibuyi");
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl("club", "spade", "diamond", "heart", "cancel2").set(
        "prompt",
        "你可以将一种颜色的所有手牌当做任意花色且伤害基数为2的【出其不意】使用，若此牌造成伤害，受到伤害的角色依次弃置装备区和手牌区的一张牌。"
      ).set("ai", () => {
        var player2 = get.event().player;
        if (!game.hasPlayer((current) => {
          return current != player2 && !!player2.canUse("chuqibuyi", current) && get.attitude(current, player2) < 0;
        }))
          return "cancel2";
        return lib.suit.randomGet();
      }).forResult();
      event.result = {};
      if (result.control === "cancel2") event.result.bool = false;
      else event.result.bool = true;
      event.result.cost_data = result;
    },
    async content(event, trigger, player) {
      let suit = event.cost_data.control;
      let color = new Set(player.getCards("h").map((i) => get.color(i)));
      const { control } = color.size === 1 ? { control: player.getCards("h") } : await player.chooseControl("red", "black").set("prompt", "请选择一种颜色").set("ai", () => {
        var player2 = get.event().player, red = 0, black = 0;
        for (var i of player2.getCards("h", {
          color: "red"
        })) {
          red += get.value(i);
        }
        for (var i of player2.getCards("h", {
          color: "black"
        })) {
          black += get.value(i);
        }
        return red > black ? "black" : "red";
      }).forResult();
      player.chooseUseTarget(
        {
          name: "chuqibuyi",
          suit,
          piweimrfz_chuqi: true
        },
        typeof control === "string" ? player.getCards("h", { color: control }) : control
      );
    },
    group: ["piweimrfz_damage", "piweimrfz_discard"],
    subSkill: {
      discard: {
        silent: true,
        charlotte: true,
        firstDo: true,
        trigger: { source: "damageEnd" },
        filter(event, player) {
          return event.player && event.player.isIn() && event.card && event.card.piweimrfz_chuqi == true;
        },
        async content(event, trigger, player) {
          let target = trigger.player;
          target.chooseToDiscard(true).set("position", "he").set("prompt", `【辟纬】:请选择弃置手牌区和装备区的各一张牌`).set("ai", (card) => {
            get.event().player;
            return 7 - get.value(card);
          }).set("filterCard", (card) => {
            get.event().player;
            var cards = ui.selected.cards;
            if (cards.length == 0) return true;
            for (var i of cards) {
              if (get.position(i) == get.position(card)) return false;
            }
            return true;
          }).set("selectCard", () => {
            var player2 = get.event().player, pos = [];
            for (var i of player2.getCards("he")) {
              if (get.position(i) == "h") pos.add("h");
              else pos.add("e");
            }
            return [pos.length, pos.length];
          });
        }
      },
      damage: {
        silent: true,
        charlotte: true,
        firstDo: true,
        trigger: { player: "useCard" },
        filter(event, player) {
          return event.card && event.card.piweimrfz_chuqi == true;
        },
        async content(event, trigger, player) {
          trigger.baseDamage = 2;
        }
      }
    },
    ai: {
      threaten: 1.2
    }
  },
  "guqianmrfz": {
    audio: 2,
    trigger: {
      global: ["loseAfter", "loseAsyncAfter"]
    },
    usable: 1,
    filter(event, player) {
      if (event.type != "discard" || event.position != ui.discardPile || event.player == player) return false;
      var cards = event.getd();
      if (!cards.filter((card) => get.position(card, true) == "d").length) return false;
      return true;
    },
    prompt2(event, player) {
      return `你可以摸一张牌，然后若你手牌中没有相同花色的牌，你重置此技能，反之，你将武将牌翻面。`;
    },
    async content(event, trigger, player) {
      await player.draw();
      let suitCards = player.getCards("h").map((card) => get.suit(card));
      let suitList = new Set(suitCards);
      if (suitCards.length != suitList.size) {
        player.turnOver();
        return;
      }
      delete player.getStat("skill")["guqianmrfz"];
      if (player.storage.counttrigger && player.storage.counttrigger["guqianmrfz"]) delete player.storage.counttrigger["guqianmrfz"];
      game.log(player, "重置了技能", `#g【孤潜】`);
    }
  },
  "tongmaimrfz": {
    audio: 2,
    audioname: ["wuerbianmrfz", "spyoulingshamrfz", "sikadimrfz", "geleidiyamrfz", "anzhelamrfz"],
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    trigger: { source: "damageEnd" },
    filter(event, player) {
      if (Array.isArray(player.storage.tongmaimrfz) && player.storage.tongmaimrfz.length > 1) return false;
      return _status.currentPhase != player && game.hasPlayer((current) => {
        return current.hasClan("深海猎人");
      });
    },
    async cost(event, trigger, player) {
      let prompt2 = `你可以令一名深海猎人的角色回复一点体力或复原武将牌`, storage = player.storage.tongmaimrfz;
      if (storage.includes(0)) prompt2 = prompt2.replace("回复一点体力或", "");
      if (storage.includes(1)) prompt2 = prompt2.replace("或复原武将牌", "");
      const { result } = await player.chooseTarget().set("prompt", get.prompt("tongmaimrfz")).set("prompt2", prompt2).set("filterTarget", (card, player2, target) => {
        var storage2 = _status.event.storage;
        if (!target.hasClan("深海猎人") && target != player2) return false;
        if (storage2.includes(1)) return target.getDamagedHp() > 0;
        return true;
      }).set("ai", (target) => {
        var player2 = get.event().player;
        return get.attitude(target, player2) > 0 && (target.getDamagedHp() > 0 || target.isTurnedOver() || target.isLinked());
      }).set("storage", storage);
      event.result = result;
    },
    async content(event, trigger, player) {
      let target = event.targets[0];
      if (!Array.isArray(player.storage.tongmaimrfz)) player.storage.tongmaimrfz = [];
      if (player.storage.tongmaimrfz.includes(0)) {
        target.link(false);
        target.turnOver(false);
        player.storage.tongmaimrfz.add(1);
        return;
      }
      if (player.storage.tongmaimrfz.includes(1)) {
        target.recover();
        player.storage.tongmaimrfz.add(0);
        return;
      }
      if (target.getDamagedHp() == 0) {
        target.link(false);
        target.turnOver(false);
        player.storage.tongmaimrfz.add(1);
        return;
      }
      const { index } = await player.chooseControl().set("choiceList", [`令${get.translation(target)}回复一点体力`, `令${get.translation(target)}复原武将牌`]).set("prompt", "请选择一项").set("ai", () => {
        var target2 = _status.event.targetx;
        get.event().player;
        if (target2.isTurnedOver()) return 1;
        return 0;
      }).set("targetx", target).forResult();
      if (index === 0) target.recover();
      if (index === 1) {
        target.link(false);
        target.turnOver(false);
      }
      player.storage.tongmaimrfz.add(index);
    },
    group: "tongmaimrfz_clear",
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        lastDo: true,
        trigger: { global: "roundStart" },
        async content(event, trigger, player) {
          player.storage.tongmaimrfz = [];
        }
      }
    }
  }
});
translate({
  "wuerbianmrfz": "乌尔比安",
  "piweimrfz": "辟纬",
  "piweimrfz_info": "每回合限一次，当你武将牌翻面时，你可以将一种颜色的所有手牌当做任意花色且伤害基数为2的【出其不意】使用，若此牌造成伤害，受到伤害的角色依次弃置装备区和手牌区的一张牌。",
  "guqianmrfz": "孤潜",
  "guqianmrfz_info": "每回合限一次，当其他角色有牌因弃置而进入弃牌堆后，你可以摸一张牌，然后若你手牌中没有相同花色的牌，你重置此技能，反之，你将武将牌翻面。",
  "tongmaimrfz": "同脉",
  "tongmaimrfz_info": "宗族技，每轮每项限一次，当你于回合外造成伤害后，你可以令一名深海猎人角色回复一点体力或复原武将牌。"
});
characterTitle("wuerbianmrfz", "<font color=#00868B>阴影中的求路人</font>");
characterIntro("wuerbianmrfz", "乌尔比安，阿戈尔人，阿戈尔前技术院执政官，科研项目深海猎人计划负责人，阿戈尔军事团体“深海猎人”作战指挥官之一。登陆时间地点俱不明。在罗德岛处理海洋相关事务时提供支持。<br>经本人与相关人员确认，乌尔比安的所有档案移入高权限资料库。");
//# sourceMappingURL=wuerbianmrfz.js.map
