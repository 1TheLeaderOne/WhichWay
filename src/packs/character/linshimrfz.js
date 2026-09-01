import { _status, get, lib, game } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("linshimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "samimrfz",
  hp: 3,
  skills: ["jiangtumrfz", "jieshimrfz"]
});
skill({
  "jiangtumrfz": {
    audio: 2,
    direct: true,
    trigger: { player: ["gainPlayerCardBegin", "discardPlayerCardBegin", "choosePlayerCardBegin"] },
    filter(event, player) {
      return _status.currentPhase == event.target;
    },
    async content(event, trigger, player) {
      player.logSkill("jiangtumrfz", _status.currentPhase);
      trigger.visible = true;
    },
    ai: {
      threaten: 1.1,
      viewHandcard: true,
      skillTagFilter(player, tag, arg) {
        if (tag === "viewHandcard" && arg !== _status.currentPhase) return false;
      }
    }
  },
  "jieshimrfz": {
    mod: {
      aiOrder: function(player, card, num) {
        var list = player.storage.jieshimrfz;
        if (typeof card == "object" && player.isPhaseUsing() && list && list.length > 0) {
          if (get.type2(card) == list[0]) return num + 10;
        }
      }
    },
    audio: 3,
    trigger: { global: "phaseUseBegin" },
    filter(event, player) {
      return player.countCards("he") > 0;
    },
    direct: true,
    async content(event, trigger, player) {
      const { cards } = await player.chooseToDiscard("he").set(
        "prompt",
        `【揭示】:你可以弃置一张牌，然后猜测${trigger.player == player ? "你" : get.translation(trigger.player)}本阶段前三张牌分别使用的类型（对${trigger.player == player ? "你" : get.translation(trigger.player)}不可见）。`
      ).set("ai", function(card) {
        return 8 - get.value(card);
      }).forResult();
      if (!cards) return;
      player.logSkill("jieshimrfz");
      var list = [
        ["待选择的牌的类型", [["basic", "basic", "basic", "trick", "trick", "trick", "equip", "equip", "equip"], "vcard"]],
        ["请调整顺序<br>从左到右:第一、二、三张牌", []]
      ];
      const { moved } = await player.chooseToMove(`【揭示】:请猜测${trigger.player == player ? "你" : get.translation(trigger.player)}本阶段前三张牌分别使用的类型`).set("list", list).set("filterMove", function(from, to, moved2) {
        return to == 1 && moved2[1].length < 3 || to == 0 || typeof to !== "number";
      }).set("processAI", () => {
        var moved2 = [[114514], []], cards2 = _status.currentPhase.getCards("h"), order = [
          [0, 0],
          [0, 0],
          [0, 0]
        ];
        for (var i of cards2) {
          for (var j = 0; j < order.length; j++) {
            if (get.order(i) > order[j][1]) {
              order[j] = [i, get.order(i)];
              break;
            }
          }
        }
        for (var i of order) {
          moved2[1].push(["ByTheLeaderOne", "作者：林登万", get.type2(i[0])]);
        }
        return moved2;
      }).forResult();
      if (!moved) return;
      const listx = moved[1].map((i) => i[2]);
      trigger.player.addTempSkill("jieshimrfz_eff", { player: "phaseUseEnd" });
      trigger.player.storage.jieshimrfz = listx;
      trigger.player.storage.jieshimrfz_eff = player;
      _status.tmpTotal_jieshimrfz = 0;
    },
    subSkill: {
      eff: {
        onremove(player) {
          delete player.storage.jieshimrfz;
          delete player.storage.jieshimrfz_eff;
          delete _status.tmpTotal_jieshimrfz;
        },
        direct: true,
        charlotte: true,
        mark: true,
        intro: {
          content(event, player) {
            var storage = player.storage.jieshimrfz;
            if (storage === "error") return `未知错误`;
            if (game.me === player && game.me.hasSkill("jieshimrfz") && storage.length > 0) return get.translation(storage);
            if (storage.length == 0) return "全部已猜测完毕";
            return `剩余${storage.length}张`;
          }
        },
        trigger: { player: "useCardAfter" },
        filter(event, player) {
          if (!player.storage.jieshimrfz_eff.isIn()) return false;
          return player.storage.jieshimrfz && player.storage.jieshimrfz.length > 0;
        },
        async content(event, trigger, player) {
          if (!_status.tmpTotal_jieshimrfz) _status.tmpTotal_jieshimrfz = 0;
          var target = player.storage.jieshimrfz_eff;
          if (get.type2(trigger.card) == player.storage.jieshimrfz[0]) {
            _status.tmpTotal_jieshimrfz++;
            if (_status.tmpTotal_jieshimrfz == 3 && target != player) player.chat("被看穿了吗？");
            else if (_status.tmpTotal_jieshimrfz == 3) player.chat("我猜的真准！");
            target.logSkill("jieshimrfz", player);
            target.popup("猜测正确");
            target.draw(_status.tmpTotal_jieshimrfz);
            if (_status.tmpTotal_jieshimrfz > 1) {
              var num = Math.min(_status.tmpTotal_jieshimrfz - 1, 1);
              const { bool } = await target.chooseBool(`【揭示】:是否对${get.translation(player)}造成${get.cnNumber(num)}点伤害？`).set("ai", () => get.damageEffect(target, player) > 0).forResult();
              if (bool) player.damage(num, target);
            }
          } else {
            if (target == player)
              player.chat(
                "<img style='width:100px;height:100px' src=" + lib.assetURL + "extension/WhichWay/image/skill/jieshiError.png></img>"
              );
            target.popup("猜测错误");
          }
          player.storage.jieshimrfz.shift();
        }
      }
    }
  }
});
translate({
  "linshimrfz": "凛视",
  "jiangtumrfz": "将途",
  "jiangtumrfz_info": "锁定技，当前回合角色的手牌对你可见。",
  "jieshimrfz": "揭示",
  "jieshimrfz_info": "一名角色的出牌阶段开始时，你可以弃置一张牌，然后猜测其本阶段前三张牌分别使用的类型（对其不可见），当其本阶段使用的第一、二和三张牌结算完毕后，若你猜测正确，你摸X张牌，然后你可以对其造成X-1（至多为1）点伤害。（X=你此次猜对的次数）"
});
characterIntro("linshimrfz", "干员设计：今天整点什么，林登万<br>干员凛视，隐居于萨米北部冬牙群山的独眼巨人族群的一员，据称该族群拥有能预见未来的源石技艺。<br>为了其预见的某种未来，正在积极主动地向各方寻求合作，现与罗德岛达成协议，为罗德岛在萨米及其北方冰原上的相关事务提供帮助。");
//# sourceMappingURL=linshimrfz.js.map
