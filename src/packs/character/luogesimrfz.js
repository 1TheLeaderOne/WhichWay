import { get, lib, _status, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("luogesimrfz", {
  pack: "legendSJZX",
  sex: "male",
  group: "luomrfz",
  hp: 3,
  skills: ["baidumrfz", "yuhuimrfz"]
});
skill({
  "baidumrfz": {
    audio: 2,
    trigger: {
      global: "damageEnd"
    },
    usable: 1,
    filter(event, player) {
      if (!event.card) return false;
      var num = get.cardNameLength(event.card);
      if (typeof num !== "number" || num < 1) return false;
      return player.countCards("he") > 0 && event.player.isIn();
    },
    // direct: true,
    async cost(event, trigger, player) {
      let sourceCards = trigger.cards || void 0;
      const { result } = await player.chooseToDiscard("he").set("prompt", get.prompt("baidumrfz")).set(
        "prompt2",
        `你可以弃置一张牌，${sourceCards === void 0 ? "(" + get.translation(trigger.card) + "无对应的实体牌)" : "你获得" + get.translation(trigger.card) + "(" + get.translation(sourceCards) + "),"}然后${get.translation(trigger.player)}摸你弃置的牌与对其造成伤害的牌的字数之差的绝对值张牌。`
      ).set("ai", function(card) {
        var player2 = _status.event.player, target = _status.event.targetx, cardx = trigger.card, att = get.attitude(player2, target);
        if (att > 0) {
          return Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card)) - Math.floor(get.value(card) / 10);
        } else {
          if (Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card)) > cardx.cards.length) return 0;
          return get.value(cardx.cards) - get.value(card);
        }
      }).set("targetx", trigger.player).set("cardx", trigger.card);
      event.result = result;
    },
    async content(event, trigger, player) {
      let sourceCards = trigger.cards || void 0;
      let cards = event.cards;
      var gaincard = [];
      for (var i of sourceCards) {
        if (get.position(i, true) == "o") gaincard.push(i);
      }
      if (gaincard.length > 0) player.gain(gaincard, "gain2");
      var num = Math.abs(get.cardNameLength(trigger.card) - get.cardNameLength(cards[0]));
      if (num > 0) trigger.player.draw(num);
      player.line(trigger.player);
    }
  },
  "yuhuimrfz": {
    init(player, skill2) {
      player.storage[skill2] = {
        del: false,
        names: []
      };
    },
    mark: true,
    intro: {
      mark(dialog, content, player) {
        var names = player.storage.yuhuimrfz["names"];
        dialog.addText(`本回合【语汇】使用过的牌:<br>${get.translation(names)}`);
      }
    },
    audio: 2,
    enable: "chooseToUse",
    hiddenCard: function(player, name) {
      return player.countCards("hes") > 0 && !player.storage.yuhuimrfz["names"].includes(name);
    },
    filter: function(event, player) {
      if (player.countCards("hes") < 1) return false;
      for (var name of lib.inpile) {
        if (player.storage.yuhuimrfz["names"].includes(name)) continue;
        if (event.filterCard({ name, isCard: true }, player, event)) return true;
      }
      return false;
    },
    chooseButton: {
      dialog: function(event, player) {
        var list = [];
        for (var name of lib.inpile) {
          if (player.storage.yuhuimrfz.names.includes(name)) {
            continue;
          }
          if (event.filterCard({ name }, player, event)) {
            if (name == "sha") {
              list.push(["基本", "", "sha"]);
              for (var j of lib.inpile_nature) {
                list.push(["基本", "", "sha", j]);
              }
            } else if (get.type(name) == "trick") {
              list.push(["锦囊", "", name]);
            } else if (get.type(name) == "basic") {
              list.push(["基本", "", name]);
            }
          }
        }
        return ui.create.dialog("语汇", [list, "vcard"]);
      },
      filter: function(button, player) {
        var cards = player.getCards("hes"), name = button.link[2], cardsx = [];
        for (var i of cards) {
          if (get.cardNameLength(i) >= get.cardNameLength(name)) cardsx.push(name);
        }
        return _status.event.getParent().filterCard({ name }, player, _status.event.getParent()) && cardsx.includes(name);
      },
      check: function(button) {
        var player = _status.event.player;
        if (player.countCards("hs", button.link[2]) > 0) return 0;
        if (button.link[2] == "wugu") return;
        var effect = player.getUseValue(button.link[2]);
        if (effect > 0) return effect;
        return 0;
      },
      backup: function(links, player) {
        return {
          filterCard(card) {
            var needNumber = get.cardNameLength(links[0][2]);
            return get.cardNameLength(card) >= needNumber;
          },
          audio: "yuhuimrfz",
          selectCard: 1,
          popname: true,
          check: function(card) {
            return 6 - get.value(card);
          },
          position: "hes",
          viewAs: { name: links[0][2], nature: links[0][3] },
          async precontent(event, trigger, player2) {
            if (!player2.storage.yuhuimrfz)
              player2.storage.yuhuimrfz = {
                del: false,
                names: []
              };
            player2.storage.yuhuimrfz["names"].add(lib.skill.yuhuimrfz_backup.viewAs.name);
            if (player2.storage.yuhuimrfz["del"] != true) {
              player2.storage.yuhuimrfz["del"] = true;
              player2.when({ global: "phaseEnd" }).then(async (event2, trigger2, player3) => {
                player3.storage.yuhuimrfz = {
                  del: false,
                  names: []
                };
              });
            }
          }
        };
      },
      prompt: function(links, player) {
        return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    ai: {
      save: true,
      respondSha: true,
      respondShan: true,
      skillTagFilter: function(player, tag, arg) {
        if (!player.countCards("hes")) return false;
        if (tag == "respondSha" || tag == "respondShan") {
          if (arg == "respond") return false;
          return !player.storage.yuhuimrfz["names"].includes(tag == "respondSha" ? "sha" : "shan");
        }
        return true;
      },
      order: 4,
      result: {
        player: 1
      },
      threaten: 2.8
    }
  }
});
translate({
  "luogesimrfz": "逻格斯",
  "baidumrfz": "摆渡",
  "baidumrfz_info": "每回合限一次，当一名角色受到牌伤害后，你可以弃置一张牌，令你获得对其造成伤害的牌，然后其摸X张牌。（X=你弃置的牌与对其造成伤害的牌的字数之差的绝对值）",
  "yuhuimrfz": "语汇",
  "yuhuimrfz_info": "每回合每种牌名限一次，你可以将一张牌当作牌名字数不大于此牌的任意基本牌或普通锦囊牌使用。"
});
characterTitle("luogesimrfz", "<font color=#00868B>女妖之主</font>");
characterIntro("luogesimrfz", "逻各斯，罗德岛精英术师干员，咒术大师，女妖河谷年轻的“女主人”。曾作为巴别塔核心成员参与卡兹戴尔内战，并于罗德岛建立之初成为首批精英干员之一。逻各斯着手制定了干员源石技艺适应性测试的标准及流程。这套评估系统展现了巨大的价值，令罗德岛得以准确地评估每一位干员的施术潜能。<br>现根据罗德岛决议，逻各斯继续担任外勤小队指挥，参与术师干员的测试与选拔，负责敏感情报的破译及加密工作。");
//# sourceMappingURL=luogesimrfz.js.map
