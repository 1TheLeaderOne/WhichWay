import { get, _status, lib, ui } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("wenmimrfz", {
  pack: "epicSJZX",
  sex: "female",
  group: "leimrfz",
  hp: 3,
  skills: ["baiweimrfz", "nuanxiangmrfz"]
});
skill({
  "baiweimrfz": {
    mark: true,
    intro: {
      content: function(event, player) {
        var storage = player.storage.baiweimrfz, text;
        if (Object.keys(player.storage.baiweimrfz).length < 1) return "没有记录的牌";
        for (var key in storage) {
          text = (text === void 0 ? "" : text) + get.translation(key) + ":" + storage[key] + "</br>";
        }
        return text;
      }
    },
    audio: 4,
    init: function(player) {
      player.storage.baiweimrfz = {};
    },
    enable: ["chooseToUse", "chooseToRespond"],
    filter: function(event, player) {
      if (player.countCards("h") < 1 || Object.keys(player.storage.baiweimrfz).length < 1) return false;
      for (var i of lib.inpile) {
        var type = get.type(i);
        if ((type == "basic" || type == "trick") && event.filterCard({ name: i }, player, event) && player.storage.baiweimrfz[i])
          return true;
      }
      return false;
    },
    chooseButton: {
      dialog: function(event, player) {
        var number = {};
        for (var i = 1; i <= lib.inpile.length; i++) {
          number[i] = [];
        }
        for (var i = 1; i <= lib.inpile.length; i++) {
          for (var j = 0; j < lib.inpile.length; j++) {
            var name = lib.inpile[j];
            if (get.type(name) == "delay" || get.type(name) == "equip") continue;
            if (!event.filterCard({ name }, player, event)) continue;
            if (!player.storage.baiweimrfz[name]) continue;
            if (get.cardNameLength(name) == i) {
              if (name == "sha") {
                if (event.filterCard({ name }, player, event)) number[i].push(["基本", "", "sha"]);
                for (var k of ["fire", "thunder", "ice", "stab"]) {
                  if (event.filterCard({ name, nature: k }, player, event)) number[i].push(["基本", "", "sha", k]);
                }
              } else if (get.type(name) == "trick" && event.filterCard({ name }, player, event))
                number[i].push(["锦囊", "", name]);
              else if (get.type(name) == "basic" && event.filterCard({ name }, player, event))
                number[i].push(["基本", "", name]);
            }
          }
        }
        var dialog = ui.create.dialog;
        dialog = ["百味：请选择一张牌"];
        for (var i = 1; i < Object.keys(number).length; i++) {
          if (!number[i].length) continue;
          dialog.push('<div class="text center">' + get.cnNumber(i) + "字</div>");
          dialog.push([number[i], "vcard"]);
        }
        return dialog;
      },
      backup: function(links, player) {
        return {
          filterCard: function(card) {
            var selected = ui.selected.cards, num = get.cardNameLength(links[0][2]);
            if (selected.length) {
              var num2 = 0;
              for (var i = 0; i < selected.length; i++) {
                num2 += get.cardNameLength(selected[i]);
              }
              num -= num2;
              return get.cardNameLength(card) <= num;
            } else return get.cardNameLength(card) <= num;
          },
          selectCard: function() {
            var num = Infinity, selected = ui.selected.cards, num2 = get.cardNameLength(links[0][2]);
            if (selected.length) {
              var num3 = 0;
              for (var i = 0; i < selected.length; i++) {
                num3 += get.cardNameLength(selected[i]);
              }
              if (num = Infinity) num = 1;
              if (num3 != num2) num = num + selected.length;
            }
            return num;
          },
          audio: "baiweimrfz",
          popname: true,
          check: function(card) {
            return 8 - get.value(card);
          },
          position: "h",
          viewAs: { name: links[0][2], nature: links[0][3] },
          async precontent(event, trigger, player2) {
            const name = lib.skill.baiweimrfz_backup.viewAs.name;
            player2.storage.baiweimrfz[name]--;
            if (player2.storage.baiweimrfz[name] == 0) delete player2.storage.baiweimrfz[name];
          }
        };
      },
      prompt: function(links, player) {
        return "将任意张字数之和为" + get.cnNumber(links[0][2]) + "的牌为当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
      }
    },
    hiddenCard: function(player, name) {
      if (!lib.inpile.includes(name)) return false;
      var type = get.type(name);
      return (type == "basic" || type == "trick") && player.storage.baiweimrfz[name] && player.countCards("h") > 0;
    },
    ai: {
      fireAttack: true,
      respondShan: true,
      respondSha: true,
      skillTagFilter: function(player) {
        if (!player.countCards("h") || player.hasSkill("baiweimrfz_ban")) return false;
      },
      order: 1,
      result: {
        player: function(player) {
          if (_status.event.dying) return get.attitude(player, _status.event.dying);
          return 1;
        }
      }
    },
    group: "baiweimrfz_use",
    subSkill: {
      ban: {
        charlotte: true
      },
      use: {
        silent: true,
        trigger: { global: "useCard" },
        filter: function(event, player) {
          if (!event.card || !event.card.isCard || player.hasSkill("baiweimrfz_ban")) return false;
          return get.type(event.card) == "trick" || get.type(event.card) == "basic";
        },
        async content(event, trigger, player) {
          var name = trigger.card.name;
          if (!player.storage.baiweimrfz) player.storage.baiweimrfz = {};
          if (player.storage.baiweimrfz[name]) {
            player.storage.baiweimrfz[name]++;
          } else {
            player.storage.baiweimrfz[name] = 1;
          }
          if (trigger.player != player && _status.currentPhase != player) player.addTempSkill("baiweimrfz_ban", { global: "phaseEnd" });
        }
      }
    }
  },
  "nuanxiangmrfz": {
    audio: 2,
    trigger: { player: "useCardAfter" },
    filter: function(event, player) {
      if (player.hasSkill("nuanxiangmrfz_ban")) return false;
      return event.card && event.card.cards && !event.card.isCard;
    },
    prompt: function(event, player) {
      return "【暖香】:是否令至多" + get.cnNumber(event.card.cards.length) + "名角色摸一张牌？";
    },
    async content(event, trigger, player) {
      const num = trigger.card.cards.length;
      player.addTempSkill("nuanxiangmrfz_ban", { global: "phaseEnd" });
      const result = await player.chooseTarget(true, [1, num], "【暖香】:请选择至多" + get.cnNumber(num) + "名角色").set("ai", (target) => get.attitude(player, target) > 0).forResult();
      if (result.targets) {
        player.logSkill("nuanxiangmrfz");
        for (var i of result.targets) {
          player.line(i);
          i.draw();
        }
      }
    },
    ai: {
      expose: 0.1
    },
    subSkill: {
      ban: {
        charlotte: true
      }
    }
  }
});
translate({
  "wenmimrfz": "温米",
  "baiweimrfz": "百味",
  "baiweimrfz_info": "①锁定技，当一名角色使用或打出一张普通锦囊或基本牌时，你记录之（可重复记录），若该角色不为你且于你的回合外，此技能本回合失效。②你可以将任意张手牌当作你【百味①】记录过的相同字数的基本或普通锦囊牌使用或打出，然后你将此牌从【百味①】的记录中移除。",
  "nuanxiangmrfz": "暖香",
  "nuanxiangmrfz_info": "每回合限一次，当你使用或打出的一张转化牌结算完毕后，你可以令至多X名角色摸一张牌。（X=该牌对应的实体牌数）"
});
characterIntro("wenmimrfz", "温米，出生于雷姆必拓的一座矿业小镇，虽年纪尚小，却在烹饪、机械修理等技术领域展露出了出色的天分。经干员暴行推荐，在监护人阿兰娜的陪同下来到罗德岛接受治疗，同时在舰上学习源石技艺基础课程。");
//# sourceMappingURL=wenmimrfz.js.map
