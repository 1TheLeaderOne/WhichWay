import { game, get, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("weiweiannamrfz", {
  sex: "female",
  group: "laimrfz",
  hp: 4,
  skills: ["zhanjumrfz", "zhuhuomrfz", "yunjiaomrfz"]
});
skill({
  "zhanjumrfz": {
    audio: 2,
    trigger: {
      global: "dying"
    },
    filter: function(event, player) {
      if (!game.checkMod({ name: "tao", isCard: true }, player, event.player, "unchanged", "cardSavable", player)) return false;
      return player.countCards("h") > 0 && event.player.hp <= 0;
    },
    check: function(event, player) {
      if (get.attitude(player, event.player) < 0) return false;
      return player.countCards("h", function(card) {
        return card.name == "tao";
      }) + event.player.hp < 0;
    },
    prompt: function(event, player) {
      return "【盏菊】:你可以将所有手牌当作【桃】对" + get.translation(event.player) + "使用";
    },
    async content(event, trigger, player) {
      const cards = player.getCards("h");
      trigger.player.storage.zhanjumrfz = true;
      player.useCard({ name: "tao" }, cards, trigger.player);
    },
    group: "zhanjumrfz_recast",
    subSkill: {
      recast: {
        silent: true,
        lastDo: true,
        trigger: { global: "dyingAfter" },
        filter: function(event, player) {
          return event.player.storage.zhanjumrfz;
        },
        async content(event, trigger, player) {
          delete trigger.player.storage.zhanjumrfz;
          if (player.countCards("hej") == 0) event.finish();
          else {
            const result = await player.chooseCard("【盏菊】:你可以重铸一张你区域内的牌", "hej").set("ai", (card) => 8 - get.value(card)).forResult();
            if (result.cards) {
              player.recast(result.cards);
              player.logSkill("zhanjumrfz");
            }
          }
        }
      }
    }
  },
  "zhuhuomrfz": {
    audio: 2,
    enable: "phaseUse",
    usable: 1,
    filterCard: function(card, player) {
      return player.canRecast(card);
    },
    selectCard: 1,
    filter: function(event, player) {
      return player.countCards("he") > 0;
    },
    position: "he",
    discard: false,
    lose: false,
    check: function(card) {
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      player.recast(event.cards);
    },
    group: "zhuhuomrfz_draw",
    ai: {
      order: 13,
      result: {
        player: 1
      }
    },
    subSkill: {
      reget: {
        silent: true,
        popup: false,
        lastDo: true,
        trigger: {
          global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]
        },
        async content(event, trigger, player) {
          player.addSkill("zhuhuomrfz");
          player.removeSkill("zhuhuomrfz_reget");
        }
      },
      draw: {
        direct: true,
        trigger: { player: "loseAfter" },
        filter: function(event, player) {
          if (!event.cards) return false;
          return event.getParent(2).name == "recast";
        },
        async content(event, trigger, player) {
          let result;
          let num;
          if (trigger.cards.length > 1) {
            num = 0;
            for (const card of trigger.cards) {
              num += get.cardNameLength(card);
            }
          } else {
            num = get.cardNameLength(trigger.cards[0]);
          }
          event.num = num;
          result = await player.chooseControl("发牌", "摸牌", "cancel2").set("prompt", "是否发动【烛火】？").set("ai", () => {
            const aiPlayer = _status.event.player;
            const count = game.countPlayer((current) => {
              return current !== aiPlayer && get.attitude(current, aiPlayer) > 2;
            });
            if (num === 1) return 0;
            if (count - num < 0) return 1;
            return 0;
          }).forResult();
          if (result.control === "cancel2") {
            return;
          } else {
            if (result.index === 1) {
              await player.draw(Math.min(event.num, 5));
              player.logSkill("zhuhuo2mrfz");
              player.addSkill("zhuhuomrfz_reget");
              player.removeSkill("zhuhuomrfz");
            } else {
              const selectNum = event.num;
              result = await player.chooseTarget(true, "【烛火】:你可以选择至多" + selectNum + "名角色，令其各摸一张牌", [1, selectNum]).set("ai", (target) => {
                return get.attitude(target, player) > 2;
              }).forResult();
            }
          }
          if (result.targets && result.targets.length) {
            const targets = result.targets;
            for (const target of targets) {
              await target.draw();
              player.line(target);
            }
            player.logSkill("zhuhuo2mrfz");
          }
        },
        ai: {
          expose: 0.1
        }
      }
    }
  },
  "yunjiaomrfz": {
    mod: {
      aiOrder: function(player, card, num) {
        if (typeof card == "object" && !get.tag(card, "norepeat")) {
          var history = player.getAllHistory("useCard");
          if (history.length > 0) {
            var cardx = history[history.length - 1].card;
            if (get.is.yayun(get.translation(cardx.name), get.translation(card.name))) return num + 20;
          }
        }
      }
    },
    mark: true,
    intro: {
      content: function(event, player) {
        var history = player.getAllHistory("useCard");
        var evt = history[history.length - 1];
        if (!evt) return "没有使用过牌";
        return "你上一张使用的牌是：" + get.translation(evt.card.name) + "(" + get.pinyin(get.translation(evt.card.name)) + ")";
      }
    },
    audio: 2,
    forced: true,
    trigger: { player: "useCard" },
    filter: function(event, player) {
      var history = player.getAllHistory("useCard"), index = history.indexOf(event);
      if (index < 1) return false;
      var evt = history[index - 1];
      return get.is.yayun(get.translation(event.card.name), get.translation(evt.card.name)) && player.isPhaseUsing();
    },
    async content(event, trigger, player) {
      var skills = player.getStockSkills(true, true);
      game.expandSkills(skills);
      var resetSkills = [];
      var suffixs = ["used", "round", "block", "blocker"];
      for (var skill2 of skills) {
        var info = get.info(skill2);
        if (typeof info.usable == "number") {
          if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill2] && player.storage.counttrigger[skill2] >= 1) {
            delete player.storage.counttrigger[skill2];
            resetSkills.add(skill2);
          }
          if (typeof get.skillCount(skill2) == "number" && get.skillCount(skill2) >= 1) {
            delete player.getStat("skill")[skill2];
            resetSkills.add(skill2);
          }
        }
        if (info.round && player.storage[skill2 + "_roundcount"]) {
          delete player.storage[skill2 + "_roundcount"];
          resetSkills.add(skill2);
        }
        if (player.awakenedSkills.includes(skill2)) {
          player.restoreSkill(skill2);
          resetSkills.add(skill2);
        }
        for (var suffix of suffixs) {
          if (player.hasSkill(skill2 + "_" + suffix)) {
            player.removeSkill(skill2 + "_" + suffix);
            resetSkills.add(skill2);
          }
        }
      }
      if (resetSkills.length) {
        var str = "";
        for (var i of resetSkills) {
          str += "【" + get.translation(i) + "】、";
        }
        game.log(player, "重置了技能", "#g" + str.slice(0, -1));
      }
    }
  }
});
translate({
  "weiweiannamrfz": "薇薇安娜",
  "zhanjumrfz": "盏菊",
  "zhanjumrfz_info": "当有角色处于濒死状态时，你可以将所有手牌当做【桃】对其使用，若其脱离濒死状态，你可以重铸你区域内的一张牌。",
  "zhuhuomrfz": "烛火",
  "zhuhuomrfz_info": "①出牌阶段限一次，你可以重铸一张牌。</br>②当你因重铸而失去牌后，你可以令至多X名角色摸一张牌，或令你摸X（至多为5）张牌并失去此技能直到本阶段结束。（X=此牌牌名的字数）",
  "yunjiaomrfz": "韵脚",
  "yunjiaomrfz_info": "锁定技，出牌阶段，当你使用牌时，若此牌的牌名与你本局游戏使用的上一张牌的牌名押韵，你重置武将牌上的技能。"
});
characterTitle("weiweiannamrfz", "<font color=#efd02a>金盏花</font>");
characterIntro("weiweiannamrfz", "薇薇安娜·德罗斯特，莱塔尼亚施彤领选帝侯霍赫贝格家族后裔，前卡西米尔人气竞技骑士。经耀骑士临光举荐，在罗德岛登记为合作干员。</br>擅长使用光影类源石技艺，配以华丽的剑术技巧，能在战场上灵活御敌。驻留本舰期间将为罗德岛提供战术与外勤任务支援。");
//# sourceMappingURL=index.js.map
