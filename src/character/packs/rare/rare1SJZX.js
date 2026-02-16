import { get, lib, game, ui, _status } from "noname";
import { whichWayMath } from "../../../math/index.js";
window.whichWaySave.tmpSave;
const rare1SJZX = {
  character: {
    shuangyemrfz: ["female", "luomrfz", 4, ["canyinmrfz", "bingrenmrfz"], []],
    yueyuemrfz: ["female", "bomrfz", 4, ["xiyumrfz"], []],
    lutuomrfz: ["female", "bomrfz", 4, ["zhengyimrfz", "daosimrfz"], []],
    shendianmrfz: ["female", "yimrfz", 3, ["fumumrfz", "rouguangmrfz", "mizongmrfz"], []],
    yunjimrfz: ["female", "gemrfz", 3, ["lingkongmrfz", "mijianmrfz"], []],
    chengfengmrfz: ["male", "yanmrfz", 3, ["xiadaomrfz", "qunxiamrfz"], []],
    dongshimrfz: {
      sex: "female",
      group: "wumrfz",
      hp: 3,
      skills: ["gelimrfz"]
    },
    xielvmrfz: {
      sex: "female",
      group: "laimrfz",
      hp: 3,
      skills: ["lvmaimrfz", "tiaoxiemrfz"]
    }
  },
  skill: {
    //协律
    lvmaimrfz: {
      audio: ["作战中1", "作战中2"],
      zhuanhuanji(player2, skill) {
        if (player2.storage[skill] < 3) player2.storage[skill]++;
        else player2.storage[skill] = 0;
      },
      init(player2, skill) {
        player2.storage.lvmaimrfz = 0;
        player2.addTip("lvmaimrfz_tip", `律脉 ${get.translation(lib.skill.lvmaimrfz.transfer(player2))}`);
      },
      trigger: {
        player: ["useCardAfter", "respondAfter"]
      },
      filter(event2, player2) {
        return player2.countCards("he") > 0;
      },
      mark: true,
      intro: {
        content(storage, player2) {
          return `当你使用或打出一张牌后，你可以重铸至多一张牌，然后若你的手牌中最多的花色为${get.translation(lib.skill.lvmaimrfz.transfer(player2))}，你摸一张牌。`;
        }
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseCard().set("prompt", get.prompt("lvmaimrfz")).set("prompt2", `你可以重铸一张牌,然后若你手牌中最多的花色为${get.translation(lib.skill.lvmaimrfz.transfer(player2))},你摸一张牌`).set("filterCard", (card) => {
          return get.player().canRecast(card);
        }).set("ai", function(card) {
          return 8 - get.value(card);
        }).set("position", "he").forResult();
      },
      async content(event2, trigger2, player2) {
        await player2.recast(event2.cards);
        let suit = lib.skill.lvmaimrfz.transfer(player2);
        let suitcount = lib.suit.map((s) => player2.countCards("h", { suit: s }));
        let max = Math.max(...suitcount);
        if (player2.countCards("h", { suit }) === max) {
          await player2.draw();
          player2.changeZhuanhuanji("lvmaimrfz");
          player2.addTip("lvmaimrfz_tip", `律脉 ${get.translation(lib.skill.lvmaimrfz.transfer(player2))}`);
        }
      },
      transfer(player2) {
        switch (player2.storage.lvmaimrfz) {
          case 0:
            return "spade";
          case 1:
            return "club";
          case 2:
            return "heart";
          case 3:
            return "diamond";
          default:
            return "";
        }
      }
    },
    tiaoxiemrfz: {
      audio: ["作战中3", "作战中4"],
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      onremove: true,
      mark: true,
      intro: {
        content(storage, player2) {
          return `已使用的花色：${get.translation(storage)}`;
        }
      },
      enable: "chooseToUse",
      filter(event2, player2) {
        return player2.getCards("h", (card) => {
          if (!["basic", "trick"].includes(get.type(card))) return false;
          let suit = get.suit(card);
          return player2.countCards("h", (card2) => get.suit(card2) !== suit) > 0 && event2.filterCard(card, player2, event2);
        }).length > 0;
      },
      filterCard(card) {
        let player2 = get.player(), event2 = get.event();
        let suit = get.suit(card);
        if (event2.skillDialog instanceof HTMLElement) {
          event2.skillDialog.remove();
          event2.skillDialog = ui.create.dialog(`###【调协】###${lib.skill.tiaoxiemrfz.prompt()}`);
        }
        if (ui.selected.cards.length < 1) {
          if (Object.keys(event2.getParent("phaseUse")).length > 0 && event2.getParent("phaseUse").player === player2 && !player2.hasUseTarget(card)) return false;
          else if (!event2._backup.filterCard(card, player2)) return false;
          return player2.countCards("h", (card2) => get.suit(card2) !== suit) > 0 && ["basic", "trick"].includes(get.type(card)) && !player2.getStorage("tiaoxiemrfz").includes(suit);
        }
        return suit !== get.suit(ui.selected.cards[0]);
      },
      selectCard: 2,
      check(card) {
        let player2 = get.player();
        if (ui.selected.cards.length < 1) return player2.getUseValue(card);
        return player2.getUseValue(card) - player2.getUseValue(ui.selected.cards[0]);
      },
      prompt() {
        let player2 = get.player();
        return ui.selected.cards.length < 1 ? `【调协】:请选择你要被当作使用的牌<br>(当前已使用的花色：${get.translation(player2.getStorage("tiaoxiemrfz"))})` : `你可以将一张手牌当【${get.translation(ui.selected.cards[0].name)}】使用`;
      },
      complexCard: true,
      discard: false,
      lose: false,
      delay: 0,
      async content(event2, trigger2, player2) {
        player2.storage.tiaoxiemrfz.push(get.suit(event2.cards[0]));
        let name = get.name(event2.cards[0]);
        if (Object.keys(event2.getParent("phaseUse")).length > 0 && event2.getParent("phaseUse").player === player2) await player2.chooseUseTarget({ name }, [event2.cards[1]]).set("forced", true);
        else {
          if (name === "wuxie") event2._trigger = event2.getParent(2)._trigger;
          const result2 = await player2.useCard({ name }, [event2.cards[1]]).set("forced", true).forResult();
          event2.getParent(2)._result = result2;
        }
      },
      group: ["tiaoxiemrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.storage.tiaoxiemrfz = [];
          }
        }
      },
      ai: {
        order: 10,
        result: {
          player: 1
        }
      }
    },
    //冬时
    gelimrfz: {
      audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
      forced: true,
      trigger: {
        player: "useCardAfter"
      },
      filter(event2, player2) {
        let discarded = Array.from(ui.discardPile.childNodes).map((i) => get.number(i)).filter((i) => ![null, "unsure", void 0].includes(i));
        if (discarded.length < 1) return false;
        let mean = whichWayMath.mean(discarded);
        let sd = whichWayMath.std(discarded);
        return get.number(event2.card) > mean + sd || get.number(event2.card) < mean - sd;
      },
      mark: true,
      intro: {
        content() {
          let discarded = Array.from(ui.discardPile.childNodes).map((i) => get.number(i)).filter((i) => ![null, "unsure", void 0].includes(i));
          if (discarded.length < 1) return `弃牌堆中没有牌!`;
          let mean = whichWayMath.mean(discarded);
          let sd = whichWayMath.std(discarded);
          let str = [];
          for (let i = 1; i < 4; i++) {
            str.push(`正负${i}个标准差:(${mean - i * sd} , ${mean + i * sd})`);
          }
          return str.join("<br>");
        }
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        let discarded = Array.from(ui.discardPile.childNodes).map((i) => get.number(i)).filter((i) => ![null, "unsure", void 0].includes(i));
        let mean = whichWayMath.mean(discarded);
        let sd = whichWayMath.std(discarded);
        let num = get.number(trigger2.card);
        let draw = 0;
        for (let i = 1; i < 4; i++) {
          if (num > mean + i * sd || num < mean - i * sd) {
            draw = i;
          }
        }
        if (draw > 0) player2.draw(draw);
      }
    },
    //霜叶
    canyinmrfz: {
      mark: true,
      intro: {
        // @ts-ignore
        content: function(event2, player2) {
          var storage = player2.storage.canyinmrfz;
          if (!storage || !player2.isPhaseUsing()) return "无";
          return "本阶段不能使用或打出" + get.translation(storage) + "牌";
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "phaseUseBegin" },
      content: function() {
        "step 0";
        var cs = 1;
        if (player.hp < 2 && player.countCards("h", "tao") > 0) cs = 2;
        else if (
          // @ts-ignore
          player.hasSha() && // @ts-ignore
          player.countCards("h", function(card) {
            return get.type(card) == "equip";
          }) < 3 && // @ts-ignore
          player.canUseCardAtt("sha", false, true)
        )
          cs = 2;
        else if (
          // @ts-ignore
          player.countCards("h", function(card) {
            return get.type2(card) == "trick" && card.name != "wuxie";
          }) > 2
        )
          cs = 0;
        player.chooseControl().set("choiceList", ["基本：使用牌无距离限制且不可响应", "锦囊：摸两张牌", "装备：本阶段使用的第一张带有伤害类标签的牌伤害值或回复值+1"]).set("prompt", "【蚕吟】:请选择你不能使用的类型").set("ai", function() {
          return _status.event.cs;
        }).set("cs", cs);
        if (result.control) {
          var list = ["basic", "trick", "equip"];
          for (var i = 0; i < list.length; i++) {
            if (result.index == i) {
              if (result.index != 1) player.addTempSkill("canyinmrfz_" + list[i], "phaseUseEnd");
              else player.draw(2);
              player.addTempSkill("canyinmrfz_ban", "phaseUseEnd");
              player.storage.canyinmrfz = list[i];
              break;
            }
          }
        }
      },
      group: "canyinmrfz_rec",
      subSkill: {
        rec: {
          audio: "canyinmrfz",
          forced: true,
          trigger: { source: "dieAfter" },
          filter: function(event2, player2) {
            return event2.player != player2;
          },
          content: function() {
            player.recoverTo(player.maxHp);
          }
        },
        used: {
          charlotte: true
        },
        ban: {
          mod: {
            cardEnabled: function(card, player2) {
              if (get.type2(card) == player2.storage.canyinmrfz) return false;
            }
          }
        },
        basic: {
          mod: {
            // @ts-ignore
            // @ts-ignore
            targetInRange(card, player2, target2, now) {
              if (["trick", "delay", "basic"].includes(get.type(card))) return true;
            }
          },
          audio: "canyinmrfz",
          forced: true,
          trigger: {
            player: "useCard"
          },
          filter: function(event2, player2) {
            return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name)) && game.hasPlayer(function(current) {
              return current != player2;
            });
          },
          content: function() {
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player;
              })
            );
          },
          ai: {
            directHit_ai: true
          }
        },
        equip: {
          trigger: {
            player: "useCard"
          },
          usable: 1,
          forced: true,
          // @ts-ignore
          // @ts-ignore
          filter: function(event2, player2) {
            return get.tag(event2.card, "damage") > 0 || get.tag(event2.card, "recover") > 0;
          },
          content: function() {
            if (!trigger.baseDamage) trigger.baseDamage = 1;
            trigger.baseDamage += 1;
            game.log(trigger.card, "的伤害值/回复值", "#y+1");
          }
        }
      }
    },
    bingrenmrfz: {
      audio: 2,
      trigger: {
        player: "useCardToTargeted",
        target: "useCardToTargeted"
      },
      filter: function(event2, player2) {
        if (event2.card.name != "sha" || event2.getParent(2).name == "bingrenmrfz") return false;
        return player2 == event2.target || event2.getParent().triggeredTargets3.length == 1;
      },
      check: function(event2, player2) {
        var target2 = player2 == event2.player ? event2.target : event2.player;
        return get.attitude(target2, player2) < 0 && (player2.countCards("h", (card) => {
          return card.name == "tao" || card.name == "jiu";
        }) > 0 || player2.hp > 1);
      },
      prompt2: function(event2, player2) {
        var target2 = player2 == event2.player ? event2.target : event2.player;
        return "【冰刃】:你可以<span class=firetext>流失一点体力</span>并视为对" + get.translation(target2) + "使用一张冰【杀】";
      },
      content: function() {
        "step 0";
        player.loseHp();
        if (player.isAlive()) {
          var target2 = player == trigger.player ? trigger.target : trigger.player;
          player.addTempSkill("bingrenmrfz_dam", "bingrenmrfzAfter");
          player.useCard({ name: "sha", nature: "ice", isCard: true, bingrenmrfz: true }, target2).set("addCount", false);
        } else event.finish();
      },
      subSkill: {
        dam: {
          charlotte: true,
          silent: true,
          trigger: {
            source: "damageEnd"
          },
          // @ts-ignore
          // @ts-ignore
          filter: function(event2, player2) {
            if (!event2.card) return false;
            return event2.card.bingrenmrfz == true;
          },
          content: function() {
            "step 0";
            if (trigger.player.countCards("he") < 2) {
              player.removeSkill("bingrenmrfz_dam");
              trigger.player.turnOver();
              event.finish();
            } else {
              trigger.player.chooseToDiscard("【冰刃】:请弃置两张牌，或选择取消翻面", 2, "he").set("ai", function(card) {
                var player2 = _status.event.player;
                if (player2.isTurnedOver()) return -1;
                return 8 - get.value(card);
              });
            }
            if (result.bool == false) {
              trigger.player.turnOver();
            }
            player.removeSkill("bingrenmrfz_dam");
          }
        }
      }
    },
    //跃跃
    xiyumrfz: {
      onremove: true,
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      // @ts-ignore
      // @ts-ignore
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      filterCard: true,
      // @ts-ignore
      // @ts-ignore
      filterTarget: function(card, player2, target2) {
        return target2 != player2;
      },
      check: (card) => {
        var ban = ["shan", "tao", "jiu"];
        for (var i of ban) {
          if (card.name == i) return false;
        }
        return 8 - get.value(card);
      },
      discard: false,
      lose: false,
      delay: false,
      content: function() {
        "step 0";
        for (var i of cards) {
          i.storage.xiyumrfz_give = true;
        }
        player.give(cards, target);
        if (player.canUse("sha", target, false)) {
          player.storage.xiyumrfz = target;
          target.addTempSkill("xiyumrfz_suit", { global: "phaseUseEnd" });
          player.addTempSkill("xiyumrfz_gain", "phaseUseEnd");
          player.useCard({ name: "sha", storage: { xiyumrfz: true } }, target).set("addCount", false);
        }
      },
      subSkill: {
        gain: {
          charlotte: true,
          forced: true,
          trigger: { player: "useCardAfter" },
          // @ts-ignore
          // @ts-ignore
          filter: function(event2, player2) {
            return event2.card && event2.card.storage.xiyumrfz == true;
          },
          content: function() {
            "step 0";
            var target2 = player.storage.xiyumrfz, cards2 = target2.getCards("he"), suit = target2.getCards("he", (card) => {
              return card.storage.xiyumrfz_give;
            });
            event.cards = [];
            var storage = target2.storage.xiyumrfz_suit;
            for (var i of suit) {
              if (!storage.includes(i.suit)) storage.add(i.suit);
            }
            for (var i of cards2) {
              if (storage.includes(i.suit)) event.cards.push(i);
            }
            if (event.cards.length) player.gain(event.cards, "gain2");
            player.removeSkill("xiyumrfz_gain");
            player.removeSkill("xiyumrfz_suit");
          }
        },
        suit: {
          audio: false,
          charlotte: true,
          silent: true,
          lastDo: true,
          onremove: (player2) => {
            delete player2.storage.xiyumrfz_suit;
          },
          init: (player2) => {
            player2.storage.xiyumrfz_suit = [];
          },
          trigger: { player: ["useCard", "respond"] },
          filter: function(event2, player2) {
            if (event2.card.suit == void 0) return false;
            return lib.suit.includes(event2.card.suit) && (!player2.storage.xiyumrfz_suit || !player2.storage.xiyumrfz_suit.includes(event2.card.suit));
          },
          content: function() {
            if (!player.storage.xiyumrfz_suit) player.storage.xiyumrfz_suit = [];
            player.storage.xiyumrfz_suit.add(trigger.card.suit);
          }
        }
      },
      ai: {
        order: 10,
        result: {
          player: 1
        }
      }
    },
    // 露托
    zhengyimrfz: {
      mod: {
        // @ts-ignore
        // @ts-ignore
        ignoredHandcard: function(card, player2) {
          if (card.hasGaintag("zhengyimrfz")) {
            return true;
          }
        },
        // @ts-ignore
        // @ts-ignore
        cardDiscardable: function(card, player2, name) {
          if (name == "phaseDiscard" && card.hasGaintag("zhengyimrfz")) return false;
        },
        targetInRange: function(card) {
          if (card.hasGaintag && card.hasGaintag("zhengyimrfz")) return true;
        }
        //QQQ
      },
      audio: 2,
      trigger: {
        global: "die"
      },
      // @ts-ignore
      // @ts-ignore
      filter(event2, player2) {
        return event2.player.countCards("hej") > 0;
      },
      frequent: true,
      // @ts-ignore
      // @ts-ignore
      prompt2(event2, player2) {
        return `是否获得${get.translation(event2.player)}区域内的${event2.player.countCards("hej")}张牌？`;
      },
      async content(event2, trigger2, player2) {
        event2.togain = trigger2.player.getCards("hej");
        player2.gain(event2.togain, trigger2.player, "giveAuto", "bySelf").gaintag.add("zhengyimrfz");
      },
      group: "zhengyimrfz_draw",
      subSkill: {
        draw: {
          audio: "zhengyimrfz",
          forced: true,
          trigger: { player: "useCardAfter" },
          filter(event2, player2) {
            return player2.hasHistory("lose", function(evt) {
              if (event2 != evt.getParent()) return false;
              for (var i in evt.gaintag_map) {
                if (
                  // @ts-ignore
                  evt.gaintag_map[i].includes("zhengyimrfz")
                )
                  return true;
              }
              return false;
            });
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            let tagCards = player2.getCards("h").filter((i) => i.hasGaintag("zhengyimrfz"));
            player2.drawTo(player2.maxHp + tagCards.length);
          }
        }
      }
    },
    daosimrfz: {
      audio: 2,
      enable: ["chooseToUse", "chooseToRespond"],
      filter(event2, player2) {
        return ui.discardPile.lastChild && // @ts-ignore
        get.type(ui.discardPile.lastChild) != "equip" && // @ts-ignore
        event2.filterCard({ name: ui.discardPile.lastChild.name }, player2, event2);
      },
      filterCard: true,
      check(card) {
        return get.value(ui.discardPile.lastChild) - get.value(card);
      },
      viewAs() {
        return {
          // @ts-ignore
          name: ui.discardPile.lastChild.name,
          // @ts-ignore
          nature: ui.discardPile.lastChild.nature
        };
      },
      prompt() {
        return `你可以将一张手牌当做${get.translation(ui.discardPile.lastChild)}使用或打出`;
      },
      ai: {
        order: 8,
        result: {
          player: 1
        }
      }
    },
    // 深靛
    fumumrfz: {
      audio: 2,
      trigger: {
        player: "useCard",
        target: "useCardToTargeted"
      },
      filter(event2, player2) {
        if (event2.name !== "useCard" && event2.player == player2) return false;
        return get.isView(event2.card);
      },
      forced: true,
      content() {
        if (trigger.name == "useCard") {
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player;
            })
          );
        } else {
          trigger.getParent().excluded.add(player);
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          return get.isView(arg.card);
        },
        effect: {
          // @ts-ignore
          // @ts-ignore
          target: function(card, player2, target2, current) {
            if (!card.isCard) return "zeroplayertarget";
          }
        }
      }
    },
    rouguangmrfz: {
      init(player2, skill) {
        player2.storage[skill] = {
          x: 0,
          type: []
        };
      },
      onremove: true,
      mark: true,
      intro: {
        // @ts-ignore
        // @ts-ignore
        content(event2, player2) {
          let storage = player2.storage.rouguangmrfz;
          return `·额定摸牌数和手牌上限+${storage["x"]}<br>·本轮已使用的类型:${get.translation(storage["type"])}`;
        }
      },
      audio: 2,
      trigger: {
        global: "roundStart",
        player: "useCardAfter"
      },
      silent: true,
      forced: true,
      filter(event2, player2) {
        let storage = player2.storage.rouguangmrfz;
        if (event2.name === "useCard") return !storage["type"].includes(get.type2(event2.card));
        else return true;
      },
      // @ts-ignore
      // @ts-ignore
      async content(event2, trigger2, player2) {
        if (trigger2.name === "useCard") {
          player2.storage.rouguangmrfz["type"].push(get.type2(trigger2.card));
        } else {
          let storage = player2.storage.rouguangmrfz;
          if (game.roundNumber > 1 && storage["x"] < 3 && storage["type"].length === 3) {
            player2.storage.rouguangmrfz["x"]++;
            player2.logSkill("rouguangmrfz");
          }
          player2.storage.rouguangmrfz["type"] = [];
        }
      },
      group: "rouguangmrfz_eff",
      subSkill: {
        eff: {
          mod: {
            maxHandcard: function(player2, num) {
              return num += player2.storage.rouguangmrfz["x"];
            }
          },
          audio: "rouguangmrfz",
          forced: true,
          trigger: { player: "phaseDrawBegin2" },
          filter(event2, player2) {
            return !event2.numFixed && player2.storage.rouguangmrfz["x"] > 0;
          },
          // @ts-ignore
          // @ts-ignore
          async content(event2, trigger2, player2) {
            trigger2.num += player2.storage.rouguangmrfz["x"];
          }
        }
      }
    },
    mizongmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      // @ts-ignore
      // @ts-ignore
      filter(event2, player2) {
        return true;
      },
      // @ts-ignore
      // @ts-ignore
      async content(event2, trigger2, player2) {
        let targets = game.players.slice().filter((i2) => player2.inRange(i2) || player2 == i2);
        let names = targets.map((i2) => i2.name);
        let { moved } = await player2.chooseToMove(`【迷踪】:请为${get.cnNumber(targets.length, true)}名角色分配效果`).set("list", [[`你攻击范围内的角色`, [names, "character"]], [`直到该角色的出牌阶段<font color = red>开始时</font>，所有当前时机<font color = red>可以使用</font>的牌随机视为当前时机<font color = red>不可使用</font>的牌`], [`直到该角色的出牌阶段<font color = red>结束时</font>，所有当前时机<font color = red>不可以使用</font>的牌随机视为当前时机<font color = red>可使用</font>的牌`]]).set("processAI", (list) => {
          let moved2 = [[], [], []], player3 = get.player(), targets2 = list[0][1][0].map(
            (i2) => (
              // @ts-ignore
              _status.event.chars.find((t) => t.name === i2)
            )
          );
          let func = function(to) {
            let previous;
            while (true) {
              previous = previous || to.getPrevious();
              if (previous === player3 && get.attitude(player3, previous) > 2) return true;
              else if (previous !== player3 && get.attitude(player3, previous) > 2) {
                previous.getPrevious();
                continue;
              }
              return false;
            }
          };
          for (var target2 of targets2) {
            if (target2 === player3) moved2[2].push(target2);
            else if (get.attitude(target2, player3) < 2) moved2[1].push(target2);
            else if (func(target2)) moved2[2].push(target2);
          }
          return moved2;
        }).set("chars", targets).forResult();
        if (!moved) return;
        let findPlayer = function(name, targets2) {
          if (typeof name === "string") return targets2.find((t) => t.name === name);
          return name;
        };
        moved = [moved[0], moved[1].map((i2) => findPlayer(i2, targets)), moved[2].map((i2) => findPlayer(i2, targets))];
        for (var i of moved[1]) {
          i.addTempSkill("mizongmrfz_eff", { player: "phaseUseBegin" });
          i.storage.mizongmrfz_eff = true;
        }
        for (var i of moved[2]) {
          i.addTempSkill("mizongmrfz_eff", { player: "phaseUseEnd" });
          i.storage.mizongmrfz_eff = false;
        }
      },
      subSkill: {
        eff: {
          init(player2) {
            if (!player2.storage.mizongmrfz_cardData) {
              player2.storage.mizongmrfz_cardData = {};
            }
            lib.skill.mizongmrfz_eff.inpile = lib.inpile.filter((i) => get.type(i) != "equip");
          },
          group: "mizongmrfz_cardData",
          charlotte: true,
          silent: true,
          onremove(player2) {
            delete player2.storage.mizongmrfz_cardData;
            delete player2.storage.mizongmrfz_eff;
          },
          inpile: [],
          mod: {
            // @ts-ignore
            // @ts-ignore
            cardname(card, player2, name) {
              const storage = player2.storage.mizongmrfz_eff;
              const event2 = get.event();
              if (event2.name === "_wuxie") {
                if (card.name !== "wuxie" && storage === false) return "wuxie";
                if (card.name === "wuxie" && storage === true) {
                  return lib.skill.mizongmrfz_eff.inpile.filter((i) => i.name !== "wuxie").randomGet();
                }
              }
              if (!["chooseToUse", "chooseToRespond"].includes(event2.name)) return;
              const canUse = [];
              const notUse = [];
              lib.skill.mizongmrfz_eff.inpile.forEach((i) => {
                const autoViewCard = get.autoViewAs({ name: i }, "unsure");
                if (event2.filterCard(autoViewCard, player2, event2)) {
                  canUse.push(i);
                } else {
                  notUse.push(i);
                }
              });
              const cardClone = game.createCard(card.name, card.suit, card.number, card.natrue);
              Object.assign(cardClone, {
                _cardid: card.cardid,
                storage: card.storage,
                gaintag: card.gaintag
              });
              const cardData = player2.storage.mizongmrfz_cardData[card.cardid];
              if ((!cardData || event2.filterCard({ name: cardData }, player2, event2)) && storage === true && event2.filterCard(cardClone, player2, event2)) {
                player2.storage.mizongmrfz_cardData[card.cardid] = notUse.randomGet();
              }
              if ((!cardData || !event2.filterCard({ name: cardData }, player2, event2)) && storage === false && !event2.filterCard(cardClone, player2, event2)) {
                player2.storage.mizongmrfz_cardData[card.cardid] = canUse.randomGet();
              }
              return player2.storage.mizongmrfz_cardData[card.cardid];
            }
          }
        },
        cardData: {
          charlotte: true,
          silent: true,
          trigger: {
            global: ["loseAfter", "gainAfter", "loseAsyncAfter", "_wuxieAfter"]
          },
          content() {
            player.storage.mizongmrfz_cardData = {};
          }
        }
      },
      ai: {
        order: 13,
        result: {
          player: 1
        }
      }
    },
    // 云迹
    lingkongmrfz: {
      audio: 2,
      trigger: {
        player: "phaseChange"
      },
      // @ts-ignore
      // @ts-ignore
      filter(event2, player2) {
        const count = player2.getHistory("useSkill", (evt) => evt.skill === "lingkongmrfz").length;
        return player2.countCards("hs", (card) => player2.hasUseTarget(card)) >= count + 1;
      },
      // @ts-ignore
      // @ts-ignore
      check(event2, player2) {
        return event2.phaseList[event2.num] !== "phaseDraw";
      },
      async cost(event2, trigger2, player2) {
        let count = player2.getHistory("useSkill", (evt) => evt.skill === "lingkongmrfz").length;
        while (count + 1 > 0) {
          const result2 = await player2.chooseToUse().set("prompt", `【翎空】:请选择的你要使用的牌`).set("prompt2", `还需使用${count + 1}张牌即可将本阶段(${get.translation(trigger2.phaseList[trigger2.num])})改为出牌阶段`).forResult();
          if (result2.card) count--;
          else break;
        }
        event2.result = {};
        if (count + 1 > 0) event2.result.bool = false;
        else event2.result.bool = true;
      },
      // @ts-ignore
      // @ts-ignore
      async content(event2, trigger2, player2) {
        game.log(player2, `的`, trigger2.phaseList[trigger2.num], `被改为了`, "#y出牌阶段");
        trigger2.phaseList[trigger2.num] = "phaseUse|lingkongmrfz";
      },
      ai: {
        threaten: 1.5
      }
    },
    mijianmrfz: {
      audio: 2,
      trigger: {
        player: ["phaseUseBegin", "damageEnd"]
      },
      filter(event2, player2) {
        if (event2.name === "damage") return player2.getDamagedHp() > 0;
        return player2.countCards("he") > 0;
      },
      async cost(event2, trigger2, player2) {
        let count = player2.getHistory("useSkill", (evt) => evt.skill === "mijianmrfz").length;
        if (trigger2.name === "damage") {
          event2.result = await player2.chooseBool().set("prompt", get.prompt("mijianmrfz")).set("prompt2", `你可以摸${count + 1}张牌`).set("ai", () => true).forResult();
        } else {
          event2.result = await player2.chooseCard("he").set("prompt", get.prompt("mijianmrfz")).set("prompt2", `你可以制衡${count + 1}`).set("selectCard", () => {
            return [1, get.event().count + 1];
          }).set("ai", (card) => {
            return 8 - get.value(card);
          }).set("count", count).forResult();
        }
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name === "damage") {
          player2.draw(player2.getHistory("useSkill", (evt) => evt.skill === "mijianmrfz").length + 1);
        } else {
          let num = 1;
          for (let card of player2.getCards("h")) {
            if (!event2.cards.includes(card)) {
              num--;
              break;
            }
          }
          await player2.discard(event2.cards);
          await player2.draw(event2.cards.length + num);
        }
      },
      ai: {
        maixie: true,
        maixie_hp: true,
        effect: {
          target(card, player2, target2) {
            if (get.tag(card, "damage")) {
              if (player2.hasSkillTag("jueqing", false, target2)) return [1, -2];
              if (!target2.hasFriend()) return;
              let num = 1;
              if (get.attitude(player2, target2) > 0) {
                if (player2.needsToDiscard()) num = 0.7;
                else num = 0.5;
              }
              if (target2.hp >= 4) return [1, num * 2];
              if (target2.hp == 3) return [1, num * 1.5];
              if (target2.hp == 2) return [1, num * 0.5];
            }
          }
        }
      }
    },
    // 骋风
    xiadaomrfz: {
      audio: 2,
      trigger: {
        global: ["gainAfter", "loseAsyncAfter"]
      },
      init() {
        lib.translate["xiadaomrfz_tag"] = "待分配";
        lib.translate["xiadaomrfz_tag_allocated"] = "已分配";
      },
      filter(event2, player2) {
        if (event2.getParent(2).name === "xiadaomrfz") return false;
        return event2.player !== player2 && event2.cards && event2.cards.filter((i) => get.position(i) === "h").length > 1;
      },
      async cost(event2, trigger2, player2) {
        trigger2.player.addTempSkill("xiadaomrfz_damage", { global: "xiadaoAfter" });
        const { result: result2 } = await player2.chooseToUse(
          function(card, player3, event3) {
            if (get.name(card) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          `【侠盗】:是否对${get.translation(trigger2.player)}使用一张【杀】，若造成伤害，你获得其本次获得的（${get.cnNumber(trigger2.cards.filter((i) => get.position(i) === "h").length)}张）牌？`
        ).set("complexSelect", true).set("filterTarget", function(card, player3, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger2.player);
        event2.result = result2;
      },
      // @ts-ignore
      // @ts-ignore
      async content(event2, trigger2, player2) {
        if (!player2.storage.xiadaomrfz_damage) return false;
        delete player2.storage.xiadaomrfz_damage;
        let cards2 = trigger2.cards.filter((i) => get.position(i) === "h");
        if (cards2.length < 1) return;
        let cardsx = cards2.map((card) => {
          var cardx = ui.create.card();
          cardx.init(get.cardInfo(card));
          cardx._cardid = card.cardid;
          return cardx;
        });
        await player2.directgains(cardsx, null, "xiadaomrfz_tag");
        let list = [];
        while (player2.countCards("s", (card) => card.hasGaintag("xiadaomrfz_tag")) > 0) {
          const { result: result2 } = await player2.chooseCardTarget({
            forced: true,
            prompt: `分配获得的牌`,
            filterCard(card) {
              return card.hasGaintag("xiadaomrfz_tag");
            },
            selectCard: [1, Infinity],
            selectTarget: [1, Infinity],
            position: "s",
            // @ts-ignore
            // @ts-ignore
            ai1: (card) => {
              if (ui.selected.cards.length === 0) return 1;
              return 0;
            },
            ai2: (target2) => {
              const att = get.attitude(_status.event.player, target2);
              if (get.value(ui.selected.cards[0], target2) < 0) {
                return -att;
              } else if (att > 0) {
                return att / (1 + target2.countCards("h"));
              } else {
                return att / 100;
              }
            }
          });
          list.add([result2.targets[0], result2.cards]);
          result2.cards.forEach((i) => {
            i.removeGaintag("xiadaomrfz_tag");
            i.addGaintag("xiadaomrfz_tag_allocated");
          });
        }
        let deleteCards = player2.getCards("s", (card) => card.hasGaintag("xiadaomrfz_tag_allocated"));
        if (player2.isOnline2()) {
          player2.send(
            function(cards3, player3) {
              cards3.forEach((i) => i.delete());
              if (player3 == game.me) ui.updatehl();
            },
            deleteCards,
            player2
          );
        }
        deleteCards.forEach((i) => i.delete());
        if (player2 == game.me) ui.updatehl();
        list = list.map((arr) => {
          let cards3 = arr[1];
          let gain = [];
          let j = trigger2.player.getCards("h");
          for (let card of j) {
            if (cards3.some((cardx) => cardx._cardid == card.cardid)) gain.push(card);
          }
          return [arr[0], gain];
        });
        game.loseAsync({
          gain_list: list,
          giver: player2,
          animate: "draw"
        }).setContent("gaincardMultiple");
      },
      subSkill: {
        damage: {
          charlotte: true,
          silent: true,
          trigger: { player: "damageEnd" },
          // @ts-ignore
          // @ts-ignore
          filter(event2, player2) {
            return event2.getParent(4).name === "xiadaomrfz_cost" && event2.source && event2.card && event2.card.name === "sha";
          },
          // @ts-ignore
          // @ts-ignore
          async content(event2, trigger2, player2) {
            trigger2.source.storage.xiadaomrfz_damage = true;
          }
        }
      },
      ai: {
        // @ts-ignore
        // @ts-ignore
        threaten(player2, target2) {
          return target2.hasSkill("qunxiamrfz") ? 5 : 2;
        }
      }
    },
    qunxiamrfz: {
      audio: 2,
      getUntapped(player2) {
        let result2 = [];
        player2.getRoundHistory("useCard", (evt) => {
          if (evt.player === player2) {
            result2.add(get.suit(evt.card));
          }
        });
        return result2;
      },
      // @ts-ignore
      // @ts-ignore
      init(player2, skill) {
        player2.storage.qunxiamrfz = [];
        let trans = "";
        for (let i of player2.storage.qunxiamrfz) {
          trans += get.translation(i);
        }
        player2.addTip("qunxiamrfz", `群侠 ${player2.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
      },
      trigger: {
        player: "useCard"
      },
      filter(event2, player2) {
        return event2.card && !player2.storage.qunxiamrfz.includes(get.suit(event2.card));
      },
      check(event2) {
        return ["basic", "trick"].includes(get.type(event2.card)) && ["tao", "shan", "jiu", "wugu"].includes(event2.card.name);
      },
      prompt(event2) {
        return `【群侠】:是否令${get.translation(event2.card)}不可被其他角色响应？`;
      },
      // @ts-ignore
      // @ts-ignore
      async content(event2, trigger2, player2) {
        trigger2.directHit.addArray(
          game.filterPlayer(function(current) {
            return current !== player2;
          })
        );
        player2.storage.qunxiamrfz.add(get.suit(trigger2.card));
        let trans = "";
        for (let i of player2.storage.qunxiamrfz) {
          trans += get.translation(i);
        }
        player2.addTip("qunxiamrfz", `群侠 ${player2.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
      },
      group: ["qunxiamrfz_clear", "qunxiamrfz_sha"],
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            player2.storage.qunxiamrfz = [];
            let trans = "";
            for (let i of player2.storage.qunxiamrfz) {
              trans += get.translation(i);
            }
            player2.addTip("qunxiamrfz", `群侠 ${player2.storage.qunxiamrfz.length > 0 ? trans : "无记录"}`);
          }
        },
        sha: {
          audio: "qunxiamrfz",
          enable: ["chooseToUse"],
          filterCard(card, player2) {
            return !lib.skill.qunxiamrfz.getUntapped(player2).includes(get.suit(card));
          },
          position: "hes",
          viewAs: {
            name: "sha"
          },
          viewAsFilter(player2) {
            return player2.countCards("hes", (card) => !lib.skill.qunxiamrfz.getUntapped(player2).includes(get.suit(card))) > 0;
          },
          prompt: "将一张本轮未使用的花色的牌当杀使用",
          check(card) {
            const val = get.value(card);
            return 5 - val;
          }
        }
      },
      ai: {
        directHit_ai: true,
        // @ts-ignore
        skillTagFilter(player2, tag, arg) {
          return arg && arg.card && !player2.storage.qunxiamrfz.includes(get.suit(arg.card));
        }
      }
    }
  }
};
export {
  rare1SJZX as default
};
//# sourceMappingURL=rare1SJZX.js.map
