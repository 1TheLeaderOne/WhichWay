import { get, game, _status, lib } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("spxiaoyangmrfz", {
  sex: "female",
  group: "laimrfz",
  hp: 3,
  skills: ["lvmengmrfz", "rechenmrfz"]
});
skill({
  "lvmengmrfz": {
    init: function(player) {
      player.storage.lvmengmrfz = {
        beifeng: [],
        zhongzi: [],
        pimao: []
      };
    },
    mark: true,
    intro: {
      content: function(event, player) {
        var storage = player.storage.lvmengmrfz;
        var str = "北风：" + (storage["beifeng"].length > 0 ? get.translation(storage["beifeng"]) : "无") + "</br>种子：" + (storage["zhongzi"].length > 0 ? get.translation(storage["zhongzi"]) : "无") + "</br>皮毛：" + (storage["pimao"].length > 0 ? get.translation(storage["pimao"]) : "无");
        return str;
      }
    },
    audio: 4,
    forced: true,
    trigger: { global: "roundStart" },
    async content(event, trigger, player) {
      if (!player.storage.lvmengmrfz)
        player.storage.lvmengmrfz = {
          beifeng: [],
          zhongzi: [],
          pimao: []
        };
      const list = [
        ["未分配牌的类型（对话框较长，请下滑操作）", [["basic", "trick", "equip"], "vcard"]],
        ["北风（从牌堆中获得一张你手牌中没有的花色）", []],
        ["种子（此牌结算完毕后你可以将其交给一名其他角色）", []],
        ["皮毛（不可被其他角色响应）", []]
      ];
      const next = player.chooseToMove("【旅梦】：请分配牌的类型", true);
      next.set("list", list);
      next.set("filterMove", function(from, to, moved) {
        if (typeof to == "number") {
          if (to == 0) return true;
        }
        return true;
      });
      next.set("processAI", function() {
        var player2 = _status.event.player;
        var moved = [[], [], [], []];
        var hasFriend = function(player3) {
          return game.hasPlayer((current) => {
            return get.attitude(player3, current) > 2 && current != player3;
          });
        };
        if (!hasFriend(player2)) {
          moved[1].addArray(["equip"]);
          if (Math.random() < 0.5) moved[1].addArray(["trick"]);
          else moved[3].addArray(["trick"]);
          moved[3].addArray(["basic"]);
        } else {
          moved[1].addArray(["equip"]);
          if (Math.random() < 0.5) {
            moved[2].addArray(["trick"]);
            moved[3].addArray(["basic"]);
          } else {
            moved[2].addArray(["trick", "basic"]);
          }
        }
        return moved;
      });
      const result = await next.forResult();
      if (result.bool) {
        game.broadcastAll(
          function(moved, player2) {
            var transform = function(input) {
              return input.map((item) => {
                if (item.length === 0) {
                  return item;
                } else if (typeof item[0] === "string") {
                  return item;
                } else {
                  return item.map((subItem) => subItem[2]);
                }
              });
            };
            var moved = moved.slice(1);
            moved = transform(moved);
            player2.storage.lvmengmrfz = {
              beifeng: [],
              zhongzi: [],
              pimao: []
            };
            var keys = Object.keys(player2.storage.lvmengmrfz);
            for (var i = 0; i < moved.length; i++) {
              for (var j = 0; j < moved[i].length; j++) {
                player2.storage.lvmengmrfz[keys[i]].add(moved[i][j]);
              }
            }
          },
          result.moved,
          player
        );
      }
    },
    group: ["lvmengmrfz_beifeng", "lvmengmrfz_zhongzi", "lvmengmrfz_pimao", "lvmengmrfz_tag"],
    subSkill: {
      // 标签
      tag: {
        silent: true,
        charlotte: true,
        trigger: { player: ["gainEnd", "lvmengmrfzAfter"] },
        filter(event, player) {
          return player.storage.lvmengmrfz;
        },
        async content(event, trigger, player) {
          const storage = player.storage.lvmengmrfz, cards = trigger.name == "gain" ? trigger.cards : player.getCards("h");
          if (trigger.name == "lvmengmrfz") {
            for (var i of ["beifeng_lvmengmrfz", "zhongzi_lvmengmrfz", "pimao_lvmengmrfz"]) {
              player.removeGaintag(i);
            }
          }
          for (let key in storage) {
            for (let i2 of cards) {
              if (storage[key].includes(get.type2(i2))) i2.addGaintag(key + "_lvmengmrfz");
            }
          }
        }
      },
      //北风
      beifeng: {
        direct: true,
        usable: 4,
        trigger: { player: "useCardAfter" },
        filter: function(event, player) {
          var type = player.storage.lvmengmrfz["beifeng"], tmp_bool = false;
          if (!type || !event.card) return false;
          for (var i = 0; i < type.length; i++) {
            if (get.type(event.card, "trick") == type[i]) {
              tmp_bool = true;
              break;
            }
          }
          let cards = player.getCards("h"), list = [];
          for (let i2 of cards) {
            list.add(get.suit(i2, player));
          }
          return list.length < 4 && tmp_bool;
        },
        async content(event, trigger, player) {
          var cards = player.getCards("h"), list = [];
          for (var i of cards) {
            list.add(get.suit(i, player));
          }
          var result = lib.suit.filter((item) => !list.includes(item));
          var card = get.cardPile2((card2) => {
            for (var i2 = 0; i2 < result.length; i2++) {
              return get.suit(card2) == result[i2];
            }
          });
          if (card) player.gain(card, "gain2");
          if (!trigger.audioed) {
            trigger.audioed = true;
            player.logSkill("lvmengmrfz");
          }
        }
      },
      //种子
      zhongzi: {
        direct: true,
        trigger: { player: "useCardAfter" },
        filter: function(event, player) {
          var type = player.storage.lvmengmrfz["zhongzi"], tmp_bool = false;
          if (!type || !event.card) return false;
          for (var i = 0; i < type.length; i++) {
            if (get.type(event.card, "trick") == type[i]) {
              tmp_bool = true;
              break;
            }
          }
          return event.cards.filterInD().length > 0 && tmp_bool;
        },
        async content(event, trigger, player) {
          const result = await player.chooseTarget("【旅梦】:将" + get.translation(trigger.cards) + "交给一名其他角色", function(card, player2, target) {
            return target != player2;
          }).set("ai", function(target) {
            if (target.hasJudge("lebu")) return 0;
            var att = get.attitude(_status.event.player, target);
            if (att < 3) return 0;
            if (target.hasSkillTag("nogain")) att /= 10;
            if (target.hasSha() && _status.event.sha) {
              att /= 5;
            }
            if (event.wuxie && target.needsToDiscard(1)) {
              att /= 5;
            }
            return att / (1 + get.distance(player, target, "absolute"));
          }).set("sha", trigger.cards[0].name == "sha").set("wuxie", trigger.cards[0].name == "wuxie").forResult();
          if (result.targets) {
            player.line(result.targets[0]);
            if (!trigger.audioed) {
              trigger.audioed = true;
              player.logSkill("lvmengmrfz");
            }
            result.targets[0].gain(trigger.cards.filterInD(), "gain2");
          }
        }
      },
      //皮毛
      pimao: {
        direct: true,
        trigger: { player: "useCard" },
        filter: function(event, player) {
          var type = player.storage.lvmengmrfz["pimao"], tmp_bool = false;
          if (!type || !event.card) return false;
          for (var i = 0; i < type.length; i++) {
            if (get.type(event.card, "trick") == type[i]) {
              tmp_bool = true;
              break;
            }
          }
          return tmp_bool;
        },
        async content(event, trigger, player) {
          if (!trigger.audioed) {
            trigger.audioed = true;
            player.logSkill("lvmengmrfz");
          }
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player;
            })
          );
        }
      }
    },
    ai: {
      threaten: 1.6
    }
  },
  "rechenmrfz": {
    mark: true,
    intro: {
      content: function(event, player) {
        var evt = player.getLastUsed();
        if (!player.isPhaseUsing()) return "不是你的出牌阶段";
        if (!evt || !evt.card) return "本回合你未使用过牌";
        return "上一张你使用的牌的花色是：" + get.translation(get.suit(evt.card));
      }
    },
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    firstDo: true,
    filter: function(event, player) {
      var evt = player.getLastUsed(1);
      if (event.getParent("phaseUse").player != player) return false;
      return evt && evt.card && get.suit(event.card) == get.suit(evt.card) && !event.audioed;
    },
    async content(event, trigger, player) {
      trigger.audioed = true;
    },
    mod: {
      aiOrder: function(player, card, num) {
        if (typeof card == "object" && player.isPhaseUsing()) {
          var evt = player.getLastUsed();
          if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) {
            return num + 10;
          }
        }
      },
      cardUsable: function(card, player) {
        var evt = player.getLastUsed();
        if (evt && evt.card && get.suit(card) == get.suit(evt.card)) return Infinity;
      },
      targetInRange: function(card, player, target, now) {
        var evt = player.getLastUsed();
        if (evt && evt.card && get.suit(card) == get.suit(evt.card)) return true;
      }
    },
    group: ["rechenmrfz_syn"],
    subSkill: {
      syn: {
        silent: true,
        charlotte: true,
        direct: true,
        trigger: { player: "useCardEnd" },
        filter: function(event, player) {
          return event.getParent("phaseUse").player === player;
        },
        async content(event, trigger, player) {
          player.addTip("rechenmrfz_tip", `热忱 ${get.translation(get.suit(trigger.card))}`, "phaseUseEnd");
        }
      }
    }
  }
});
translate({
  "spxiaoyangmrfz": "纯烬艾雅法拉",
  "spxiaoyangmrfz_prefix": "纯烬",
  "lvmengmrfz": "旅梦",
  "lvmengmrfz_info": "锁定技，每轮开始时，你可以将基本牌、锦囊牌和装备牌分配给对应的标签；你使用对应标签的牌获得对应标签的效果。</br>北风：每回合限四次，从牌堆中获得一张你手牌中没有的花色</br>种子：此牌结算完毕后你可以将其交给一名其他角色</br>皮毛：不可被其他角色响应",
  "rechenmrfz": "热忱",
  "rechenmrfz_info": "锁定技，出牌阶段，当你使用的牌和你本回合上一张使用的牌的花色相同，则此牌无次数且无距离限制。"
});
characterTitle("spxiaoyangmrfz", "<font color=#DC143C>登山者</font>");
characterIntro("spxiaoyangmrfz", "艾雅法拉，火山学家，天灾信使。近年参与拍摄多部火山纪录片，并参与撰写出版火山相关书籍。现于罗德岛继续接受治疗，并视需求参与包括天灾研究在内的多项活动。");
//# sourceMappingURL=index.js.map
