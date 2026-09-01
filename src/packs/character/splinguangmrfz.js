import { get, ui, game, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("splinguangmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "kamrfz",
  hp: 4,
  skills: ["zhuguangmrfz", "kuanmrfz", "shuoguangmrfz"]
});
skill({
  "zhuguangmrfz": {
    derivation: "zhuguangmrfz_rewrite",
    audio: 2,
    audioname: ["linguangmrfz"],
    trigger: { player: "phaseZhunbeiAfter" },
    filter: function(event, player) {
      return !player.storage.zhuguangmrfz_change;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget("选择一名其他角色，视为对其使用【决斗】", function(card, player2, target2) {
        return target2 != player2;
      }).set("ai", function(target2) {
        return -get.attitude(_status.event.player, target2);
      }).forResult();
      player.addSkill("zhuguangmrfz2");
      if (result.bool && result.targets) {
        var target = result.targets[0];
        await player.useCard({ name: "juedou" }, true, target);
      }
      if (player.hasSkill("zhuguangmrfz2")) player.removeSkill("zhuguangmrfz2");
    },
    group: "zhuguangmrfz_change"
  },
  "zhuguangmrfz_change": {
    audio: "zhuguangmrfz",
    trigger: { player: "phaseZhunbeiBegin" },
    filter: function(event, player) {
      return player.storage.zhuguangmrfz_change;
    },
    async content(event, trigger, player) {
      const result = await player.chooseTarget("选择一名其他角色，视为对其使用【决斗】，且此决斗不可响应", function(card, player2, target2) {
        return target2 != player2;
      }).set("ai", function(target2) {
        return -get.attitude(_status.event.player, target2);
      }).forResult();
      player.addSkill(["zhuguangmrfz2", "zhuguangmrfz3"]);
      if (result.bool && result.targets) {
        var target = result.targets[0];
        await player.useCard({ name: "juedou", zhuguangmrfz: true }, true, target);
      }
      if (player.hasSkill("zhuguangmrfz2")) player.removeSkill("zhuguangmrfz2");
      if (player.hasSkill("zhuguangmrfz3")) player.removeSkill("zhuguangmrfz3");
    }
  },
  "kuanmrfz": {
    audio: 2,
    trigger: { global: "gameDrawAfter" },
    forced: true,
    async content(event, trigger, player) {
      player.disableEquip("equip1");
      player.disableEquip("equip2");
      player.disableEquip("equip3");
      player.disableEquip("equip4");
      player.disableEquip("equip5");
      player.disableJudge();
      player.draw(3);
    },
    group: ["kuanmrfz2", "kuanmrfz5"],
    mod: {
      ignoredHandcard: function(card, player) {
        if (get.type(card) == "equip") return true;
      },
      cardDiscardable: function(card, player, name) {
        if (name == "phaseDiscard" && get.type(card) == "equip") return false;
      }
    }
  },
  "kuanmrfz2": {
    audio: 2,
    trigger: { player: "phaseJudgeBefore" },
    forced: true,
    filter: function(event, player) {
      return !player.storage.kuanmrfz;
    },
    async content(event, trigger, player) {
      const result = await player.judge(function(card) {
        if (get.suit(card) == "heart") return -2;
        return 1;
      }).forResult();
      if (result.suit !== "heart") {
        player.skip("phaseUse");
        game.log(player, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result.suit, ",", player, "跳过出牌阶段");
      } else {
        game.log(player, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result.suit, ",判定失败");
      }
      const result_bingliang = await player.judge(function(card) {
        if (get.suit(card) == "club") return -2;
        return 1;
      }).forResult();
      if (result_bingliang.suit !== "club") {
        player.skip("phaseDraw");
        game.log(player, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result_bingliang.suit, ",", player, "跳过摸牌阶段");
      } else {
        game.log(player, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result_bingliang.suit, ",判定失败");
      }
    }
  },
  "kuanmrfz5": {
    audio: "kuanmrfz",
    enable: ["chooseToRespond", "chooseToUse"],
    filter: function(event, player) {
      if (event.type == "wuxie" || player.countCards("h", function(card) {
        return get.type(card) == "equip";
      }) == 0)
        return false;
      for (var name of ["sha", "shan", "jiu"]) {
        if (event.filterCard({ name, isCard: true }, player, event)) return true;
      }
      return false;
    },
    chooseButton: {
      dialog: function(event, player) {
        var vcards = [];
        for (var name of ["sha", "shan", "jiu"]) {
          var card = { name, isCard: true };
          if (event.filterCard(card, player, event)) vcards.push(["基本", "", name]);
        }
        var dialog = ui.create.dialog("苦暗", [vcards, "vcard"], "hidden");
        dialog.direct = true;
        return dialog;
      },
      backup: function(links, player) {
        return {
          filterCard: function(card) {
            return get.type(card) == "equip";
          },
          selectCard: 1,
          viewAs: {
            name: links[0][2],
            isCard: false
          },
          popname: true,
          async precontent(event, trigger, player2) {
            player2.logSkill("kuanmrfz");
          }
        };
      },
      prompt: function(links, player) {
        return "【苦暗】：使用一张【" + get.translation(links[0][2]) + "】";
      }
    },
    ai: {
      order: 3,
      respondSha: true,
      respondShan: true
    }
  },
  "shuoguangmrfz": {
    audio: 2,
    trigger: { player: "phaseDiscardBefore" },
    forced: true,
    filter: function(event, player) {
      return !player.storage.shuoguangmrfz;
    },
    async content(event, trigger, player) {
      trigger.cancel();
      player.storage.shuoguangmrfz = true;
    }
  }
});
translate({
  "splinguangmrfz": "耀骑士临光",
  "splinguangmrfz_prefix": "耀骑士",
  "zhuguangmrfz": "逐光",
  "zhuguangmrfz_info": "准备阶段，你可以选择一名角色，视为对其使用【决斗】，当你因此牌对其他角色造成伤害时，你可以防止此伤害，然后选择一项：①删除【苦暗】描述中蓝色的文字；②修改【逐光】的描述；③摸一张牌。",
  "zhuguangmrfz_change": "逐光",
  "zhuguangmrfz_rewrite": "逐光·修改",
  "zhuguangmrfz_rewrite_info": "准备阶段，你可以选择一名角色，视为对其使用【决斗】且此牌不可被其他角色响应，当你因此牌对其他角色造成伤害时，你可以选择一项：①删除【苦暗】描述中蓝色的文字；②摸两张牌。",
  "kuanmrfz": "苦暗",
  "kuanmrfz_info": "锁定技，游戏开始时，你废除所有装备栏和判定区并摸3张牌<span class=thundertext>；判定阶段，你依次进行【乐不思蜀】和【兵粮寸断】的判定</span>。你可以将装备牌当【杀】、【闪】或【酒】使用或打出，你的装备牌不计入手牌上限。",
  "kuanmrfz2": "苦暗",
  "kuanmrfz5": "苦暗",
  "shuoguangmrfz": "烁光",
  "shuoguangmrfz_info": "锁定技，你跳过你的第一个弃牌阶段。"
});
characterTitle("splinguangmrfz", "<font color=#00868B>长夜临光</font>");
characterIntro("splinguangmrfz", "耀骑士临光，卡西米尔耀骑士。在掩护己方队员、机动作战、歼灭战与开阔地带作战中体现出极高的战斗技巧和个人军事素养。</br>在重返卡西米尔并夺得第二十四届骑士特别锦标赛决斗赛冠军之后，留在卡西米尔处理后续事务。作为合作干员为罗德岛驻卡瓦莱利亚基办事处提供战术支援，必要时也会去往其他地区协助本舰展开各项行动。");
//# sourceMappingURL=splinguangmrfz.js.map
