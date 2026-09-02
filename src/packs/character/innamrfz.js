import { get, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("innamrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "othermrfz",
  hp: 3,
  skills: ["guiyingmrfz", "sheguomrfz"]
});
skill({
  "guiyingmrfz": {
    audio: ["晋升后交谈1", "行动出发"],
    trigger: {
      player: ["chooseToUseAfter", "chooseToRespondAfter"],
      global: "_wuxieAfter"
    },
    filter(event, player) {
      if (event.name === "chooseToUse" && event.type === "wuxie") {
        return false;
      }
      if (event.name === "_wuxie") {
        if (event.wuxieresult && event.wuxieresult === player) {
          return false;
        }
        if (event._info_map.player === player) {
          return false;
        }
        return true;
      }
      return event.respondTo && event.respondTo[0] !== player && !event.result.bool;
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger, player) {
      let triggerCard = trigger.name === "_wuxie" ? trigger._info_map.card : trigger.respondTo[1];
      let canRespond = get.canRespond(triggerCard, player);
      if (trigger.name === "_wuxie") canRespond.add("wuxie");
      canRespond = canRespond.filter(
        (name) => !player.getCards("h").map((i) => get.name(i)).includes(name)
      );
      if (canRespond.length < 1) player.draw().log = false;
      else {
        let cards = canRespond.map(function(card) {
          return get.cardPile(card);
        });
        if (cards.length < 1) player.draw().log = false;
        else {
          const result = await player.chooseCardButton("【诡影】:请选择你要获得的牌<br>选择‘取消’则模一张牌", cards).set("ai", (card) => get.value(card) > 8).forResult();
          if (result.bool === false) {
            player.draw().log = false;
          } else {
            player.gain(result.links[0]).log = false;
          }
        }
      }
      game.log(player, "从牌堆中获得了一张牌");
    }
  },
  "sheguomrfz": {
    audio: ["交谈2", "交谈1"],
    trigger: {
      player: "damageEnd"
    },
    filter(event, player) {
      if (!event.card) return false;
      let canRespond = get.canRespond(event.card, player).concat(get.canRespond(get.type2(event.card)));
      return player.countCards("h", (card) => canRespond.includes(get.name(card) || "")) > 0;
    },
    async cost(event, trigger, player) {
      const result = await player.chooseControl("cancel2").set("choiceList", [`视为对${trigger.source && trigger.source.isIn() ? get.translation(trigger.source) : "上天（不存在伤害来源）"}使用一张【杀】`, "回复一点体力、摸两张牌且此技能本回合失效"]).set("ai", () => {
        let { source, player: player2 } = get.event();
        if (!source || !source.isIn() || player2.hp < 2) return 1;
        return 0;
      }).set("source", trigger.source).forResult();
      event.result = {
        ...result,
        cost_data: {
          index: result.index
        }
      };
    },
    async content(event, trigger, player) {
      const index = event.cost_data.index;
      if (index === 0 && trigger.source && trigger.source.isIn() && player.canUse("sha", trigger.source, false, false)) {
        player.chooseUseTarget({ name: "sha" }).set("filterTarget", (card, player2, target) => target === get.event().source).set("forced", true).set("nodistance", true).set("addCount", false).set("source", trigger.source);
      } else if (index === 1) {
        player.draw(2);
        player.recover();
        player.disableSkill("sheguomrfz_disable", ["sheguomrfz"]);
        player.when({ global: "phaseEnd" }).then(() => {
          player.enableSkill("sheguomrfz_disable");
        });
      }
    }
  }
});
translate({
  "innamrfz": "双月",
  "guiyingmrfz": "诡影",
  "guiyingmrfz_info": "锁定技，当你放弃响应其他角色使用的一张牌后，你执行一项：<br>1.摸一张牌;<br>2.从牌堆中背面朝上获得一张你手牌中没有的可以响应此牌的牌。",
  "sheguomrfz": "设彀",
  "sheguomrfz_info": "当你受到伤害后，你可以展示一张可以响应对你造成伤害的牌的牌，然后你选择一项:<br>1.视为对伤害来源使用一张【杀】;<br>2.本回合此技能失效、摸两张牌并回复一点体力。"
});
characterTitle("innamrfz", "<font color = #db7093>情报专家</font>");
characterIntro("innamrfz", "双月是彩虹小队成员之一，自信、坚决，极富探索精神。<br>除了随身携带的武器之外，双月擅长使用被称为“双子分身复制器”的装置。该装置能制造与双月<br>外形上完全一致的全息投影，既能搜集情报，也能欺骗敌人。");
