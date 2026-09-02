import { get, lib, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("zheyamrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "wumrfz",
  hp: 3,
  skills: ["mingzhongmrfz", "zhiyanmrfz", "hanshengmrfz"]
});
skill({
  "mingzhongmrfz": {
    audio: ["任命队长", "行动出发"],
    derivation: ["shijingmrfz"],
    round: 1,
    trigger: {
      global: "useCard2"
    },
    filter(event, player) {
      return event.targets && event.targets.includes(player) && event.player !== player;
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseBool().set("prompt", get.prompt("mingzhongmrfz")).set("prompt2", `是否将此牌的类型（${get.translation(get.type2(trigger.card))}）标记为“警”获得'示警'直到本轮结束？`).set("ai", () => {
        let player2 = get.player();
        let event2 = get.event();
        return get.type2(event2.card, player2) === "equip";
      }).forResult();
    },
    async content(event, trigger, player) {
      player.addTempSkill("shijingmrfz", { global: "roundStart" });
      if (player.storage.shijingmrfz) player.storage.shijingmrfz = [];
      player.storage.shijingmrfz.add(get.type2(trigger.card));
    }
  },
  "shijingmrfz": {
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    mark: true,
    marktext: "警",
    intro: {
      name: "警",
      content(stroage) {
        if (!Array.isArray(stroage)) return `没有“警”`;
        return `·成为${get.translation(stroage)}牌的目标后摸一张牌<br>·<span class="text" style="font-family: yuanli;color:red">钟声来过，钟声记得。</span>`;
      }
    },
    audio: ["行动开始"],
    onremove: true,
    trigger: {
      target: "useCardToTargeted"
    },
    filter(event, player) {
      let types = player.getStorage("shijingmrfz");
      return types.includes(get.type2(event.card));
    },
    forced: true,
    async content(event, trigger, player) {
      await player.draw();
      const { targets } = await player.chooseTarget().set("prompt", "你令至多一名没有“示警”的角色获得“示警”直到本轮结束").set("selectTarget", [0, 1]).set("filterTarget", (card, player2, target) => {
        return !target.hasSkill("shijingmrfz");
      }).set("ai", (target) => get.attitude2(target) > 0).forResult();
      if (Array.isArray(targets) && targets.length > 0) {
        let target = targets[0];
        target.addTempSkill("shijingmrfz", { global: "roundStart" });
        if (target.storage.shijingmrfz) target.storage.shijingmrfz = [];
        target.storage.shijingmrfz.addArray(player.storage.shijingmrfz);
      }
    }
  },
  "zhiyanmrfz": {
    audio: ["选中干员1", "选中干员2"],
    trigger: {
      player: "useCardAfter",
      global: "phaseChange"
    },
    forced: true,
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    mark: true,
    onremove: true,
    intro: {
      content(storage) {
        if (!Array.isArray(storage) || storage.length < 1) return `没有需要额外结算的牌`;
        return storage.map((info) => `·对${get.translation(info[0])}使用${get.translation(info[1])}`).join("<br>");
      }
    },
    filter(event, player) {
      return event.name === "useCard" && event.targets && event.targets.length > 0 && event.card && ["basic", "trick"].includes(get.type(event.card)) || event.name !== "useCard" && Array.isArray(player.storage.zhiyanmrfz) && player.storage.zhiyanmrfz.length > 0;
    },
    async content(event, trigger, player) {
      if (trigger.name === "useCard") {
        if (!Array.isArray(player.storage.zhiyanmrfz)) player.storage.zhiyanmrfz = [];
        player.storage.zhiyanmrfz.push([trigger.targets, trigger.card]);
      } else {
        let infos = (player.storage.zhiyanmrfz || []).slice();
        for (let info of infos) {
          let [targets, card] = info;
          targets.forEach((target) => {
            if (!player.canUse(card, target, true, false)) info[0].remove(target);
          });
          await player.useCard(card, targets, false);
        }
        player.storage.zhiyanmrfz = [];
      }
    },
    group: ["zhiyanmrfz_respond"],
    subSkill: {
      respond: {
        audio: "zhiyanmrfz",
        forced: true,
        trigger: {
          player: "chooseToRespondBegin"
        },
        async content(event, trigger, player) {
          const { bool } = await player.chooseToDiscard().set("prompt", `你需要弃置一张牌，否则无法打出牌`).set("ai", (card) => {
            let trigger2 = get.event().triggerx;
            let player2 = get.player();
            let respond = get.canRespond(trigger2.respondTo[1], player2);
            let respondNum = player2.countCards("h", (card2) => !respond.includes(get.name(card2)));
            if (respondNum < 1) return -114514;
            if (respond.includes(get.name(card))) return 4 - get.value(card);
            if (player2.hp < 2) return 10 - get.value(card);
            return 6 - get.value(card);
          }).set("triggerx", trigger).forResult();
          if (bool !== true) {
            trigger.result = {
              bool: false,
              confirm: "cancel"
            };
            trigger.cancel(void 0, void 0, true);
          }
        }
      }
    }
  },
  "hanshengmrfz": {
    audio: ["作战中1", "作战中2"],
    enable: ["chooseToUse", "chooseToRespond"],
    /**@param {Player} player  */
    getSkillCount(player) {
      return player.getAllHistory("useSkill", (evt) => {
        return evt.skill === "hanshengmrfz";
      }).length;
    },
    filter(event, player) {
      return game.hasPlayer((char) => char.countCards("he") >= this.getSkillCount(player) + 1 && char !== player) && event.filterCard({ name: "tao" }, player, event);
    },
    filterTarget(card, player, target) {
      return target !== player && target.countCards("he") >= lib.skill.hanshengmrfz.getSkillCount(player);
    },
    hiddenCard(player, name) {
      if (!game.hasPlayer((char) => char.countCards("he") >= lib.skill.hanshengmrfz.getSkillCount(player) && char !== player)) return false;
      return name === "tao";
    },
    async content(event, trigger, player) {
      const num = lib.skill.hanshengmrfz.getSkillCount(player);
      const {
        targets: [target]
      } = event;
      const { cards } = await target.chooseCard().set("prompt", `你可以交给${get.translation(player)}${get.cnNumber(num)}张牌，然后其视为使用一张【桃】`).set("filterCard", () => true).set("selectCard", num).set("ai", (card) => {
        let event2 = get.event;
        if (event2.att < 0) return -114514;
        return event2.name === "dying" ? 10 - get.value(card) : 6 - get.value(card);
      }).set("att", get.attitude(target, player)).forResult();
      if (cards && cards.length > 0) {
        await target.give(cards, player, true);
        player.chooseUseTarget({
          card: get.autoViewAs({ name: "tao" })
        }).set("forced", true);
      } else {
        player.disableSkill("hanshengmrfz", ["hanshengmrfz"]);
        player.when({ global: "phaseEnd" }).then(async (event2, trigger2, player2) => {
          player2.enableSkill("hanshengmrfz");
        });
      }
    },
    ai: {
      order: 1,
      result: {
        target(player, target) {
          if (get.attitude(player, target) < 0) return;
          return target.countCards("he");
        }
      }
    }
  }
});
translate({
  "zheyamrfz": "折桠",
  "mingzhongmrfz": "鸣钟",
  "mingzhongmrfz_info": "每轮限一次,当其他角色使用牌选择你为目标后,你可以将此牌的类型标记为“警”并获得'示警'直到本轮结束。",
  "shijingmrfz": "示警",
  "shijingmrfz_info": "锁定技，当你成为“警”牌的目标后,你摸一张牌，然后令至多一名没有“示警”的角色获得“示警”直到本轮结束。",
  "zhiyanmrfz": "滞言",
  "zhiyanmrfz_info": "锁定技，你使用的基本或普通锦囊牌于本阶段结束后额外结算一次;当你需要打出牌时，你需要弃置一张牌，否则无法打出牌。",
  "hanshengmrfz": "寒生",
  "hanshengmrfz_info": "当你需要使用【桃】时，你可以令一名其他角色选择交给你X张牌，若其交给你牌，你视为使用一张【桃】，反之此技能本回合失效。（X=本局游戏此技能发动的次数 + 1）"
});
characterTitle("zheyamrfz", "<font color = #103b58ff>苔原吹哨人</font>");
characterIntro("zheyamrfz", "折桠，常用名别乔克，曾为乌萨斯远北中心矿区工人，现于罗德岛接受治疗，同时根据本人意愿，接受标准强度的战斗训练，作为罗德岛的外勤干员参与感染者救助工作。");
