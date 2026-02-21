import { get, lib, game, _status, ui } from "noname";
import "../../../nonameEx/custom/skill.js";
import "../../../tips/index.js";
import "../../../utill.js";
const legend4SJZX = {
  character: {
    maizhelunmrfz: ["female", "lymrfz", 3, ["kanchamrfz", "longtengmrfz"], []],
    palasimrfz: ["female", "mimrfz", 4, ["yingzhumrfz", "yingdanmrfz", "yingfenmrfz"], []],
    xiaguangmrfz: ["female", "kamrfz", 4, ["rencimrfz", "huiguangmrfz", "jiandunmrfz"], []],
    zaolumrfz: ["female", "wumrfz", 4, ["zhongxiemrfz", "rusuimrfz"], []],
    spshihuaiyamrfz: ["female", "longmrfz", 3, ["mianzaimrfz", "zhijinmrfz"], []],
    spsongzangrenmrfz: ["male", "lamrfz", 3, ["chongdanmrfz", "tianxuanmrfz", "shengcaimrfz"], []],
    spjiexikamrfz: ["female", "gemrfz", 4, ["yijiemrfz", "fuhuangmrfz"], []],
    weiweiannamrfz: ["female", "laimrfz", 4, ["zhanjumrfz", "zhuhuomrfz", "yunjiaomrfz"], []],
    spxiaoyangmrfz: ["female", "laimrfz", 3, ["lvmengmrfz", "rechenmrfz"], []],
    suxinmrfz: ["female", "lamrfz", 3, ["qinmingmrfz", "kongwomrfz"], []],
    hedeleimrfz: ["male", "luomrfz", "4/6", ["zhengrongmrfz", "siyanmrfz"], []],
    zhisongmrfz: ["male", "laimrfz", 4, ["kuxiumrfz", "lirenmrfz"], []],
    jianmrfz: ["female", "xiemrfz", 4, ["weiyamrfz", "zhiwumrfz"], []],
    laiyimrfz: ["female", "leimrfz", 3, ["shaobanmrfz", "tankuangmrfz"], []],
    shumrfz: ["female", "suimrfz", 3, ["kenyemrfz", "heyingmrfz", "rancuimrfz"], []],
    zuolemrfz: ["male", "yanmrfz", "4/5", ["qikumrfz", "bingzhumrfz"], []],
    elamrfz: ["female", "othermrfz", 3, ["leimingmrfz", "zuzhimrfz"], []],
    asikalunmrfz: ["female", "luomrfz", 3, ["dunyingmrfz", "niximrfz"], []],
    luogesimrfz: ["male", "luomrfz", 3, ["baidumrfz", "yuhuimrfz"], []],
    weishidaiermrfz: ["female", "bamrfz", 3, ["yuximrfz", "haolimrfz", "shezumrfz"], []],
    mowangmrfz: ["female", "luomrfz", 3, ["duanzhangmrfz", "chenaimrfz", "canxiangmrfz"], []],
    wuerbianmrfz: ["male", "a_groupmrfz", 4, ["guqianmrfz", "piweimrfz", "tongmaimrfz"], ["clan:深海猎人"]],
    nifumrfz: ["female", "luomrfz", 3, ["xunxinmrfz", "chixinmrfz", "kuixinmrfz"], []],
    narentuyamrfz: ["female", "samrfz", "4/6", ["eyanmrfz", "shafeimrfz"], []],
    peipeimrfz: ["female", "samrfz", 3, ["boqingmrfz", "kuisuimrfz", "lianwenmrfz"], []]
  },
  skill: {
    //麦哲伦
    kanchamrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      filterCard: true,
      intro: {
        content: "已发动#次【勘查】"
      },
      check: function(card) {
        var player2 = _status.event.player;
        if (player2.hasCard(function(card2) {
          return get.type(card2) == "equip";
        }))
          return get.type(card) == "equip";
        if (player2.hasCard(function(card2) {
          return get.type(card2) == "trick";
        }))
          return get.type(card) == "trick";
        return 6 - get.value(card);
      },
      content: function() {
        "step 0";
        event.cards2 = cards2[0];
        player.chooseControl("顶部", "底部").set("prompt", get.prompt("kanchamrfz")).set("prompt2", "【勘查】:请选择展示牌堆顶还是牌堆底" + (player.countMark("kanchamrfz") + 3) + "张牌").set("ai", function() {
          return [0, 1].randomGet();
        });
        var num = player.countMark("kanchamrfz") + 3;
        if (result.index == 0) {
          var cards2 = game.cardsGotoOrdering(get.cards(num)).cards;
          event.cards = cards2;
        } else if (result.index == 1) event.cards = get.bottomCards(num);
        else event.finish();
        var list = [];
        player.showCards(event.cards, get.translation(player) + "发动了【勘查】");
        for (var i2 = 0; i2 < event.cards.length; i2++) {
          if (get.type(event.cards2, "trick") != get.type(event.cards[i2], "trick")) list.push(event.cards[i2]);
        }
        if (list.length) player.gain(list, "gain2");
        if (player.countMark("kanchamrfz") < 3) player.addMark("kanchamrfz", false);
      },
      ai: {
        order: 13,
        threaten: 1.1,
        result: {
          player: 1
        }
      }
    },
    longtengmrfz: {
      markimage: "extension/WhichWay/image/skill/mrfz_LTF.png",
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 8,
      trigger: {
        player: "loseAfter",
        global: "loseAsyncAfter"
      },
      filter: function(event2, player2) {
        if (player2.isPhase("phaseDiscard", false)) return false;
        if (event2.type != "discard" || event2.getlx === false) return;
        var evt = event2.getl(player2);
        for (var i2 = 0; i2 < evt.cards2.length; i2++) {
          if (get.position(evt.cards2[i2], evt.hs.includes(evt.cards2[i2]) ? evt.player : false) == "d") {
            return true;
          }
        }
        return false;
      },
      direct: true,
      content: function() {
        "step 0";
        var cards2 = [];
        var evt = trigger.getl(player);
        for (var i2 = 0; i2 < evt.cards2.length; i2++) {
          if (get.position(evt.cards2[i2]) == "d") {
            cards2.push(evt.cards2[i2]);
          }
        }
        if (!cards2.length) {
          event.finish();
        } else {
          if (cards2.length > 1)
            player.chooseButton(["【龙腾】:请选择一张牌", cards2]).set("ai", (button) => {
              var player2 = _status.event.player;
              if (game.hasPlayer(function(current) {
                return get.attitude(player2, current) > 2;
              }))
                return get.type(button.link) == "equip" || get.type(button.link, "trick") == "trick";
              return get.type(button.link) == "basic";
            });
          else {
            event.cards = cards2;
            event.goto(2);
          }
        }
        if (result.links && result.links.length) {
          event.cards = result.links;
        }
        player.chooseTarget(
          "【龙腾】:请选择一名角色，并将" + get.translation(event.cards) + "(" + get.translation(get.type(event.cards[0], "trick")) + "牌)置于该角色武将牌上",
          function(card, player2, target3) {
            return target3.getExpansions("longtengmrfz").length == 0;
          }
        ).ai = function(target3) {
          var player2 = _status.event.player;
          var type = get.type2(event.cards[0]);
          if (type == "basic") return -get.attitude(player2, target3);
          else return get.attitude(player2, target3) > 2;
        };
        if (result.bool) {
          var target2 = result.targets[0];
          get.type2(event.cards[0]);
          target2.addToExpansion(event.cards, target2, "give").gaintag.add("longtengmrfz");
          target2.addSkill("longtengmrfz_changeI");
          player.logSkill("longtengmrfz", target2);
        }
      },
      group: "longtengmrfz_clear",
      global: ["longtengmrfz_basic_1", "longtengmrfz_basic_2", "longtengmrfz_trick", "longtengmrfz_equip"],
      subSkill: {
        changeI: {
          silent: true,
          charlotte: true,
          trigger: { player: "longtengmrfzAfter" },
          content: function() {
            player.removeSkill("longtengmrfz_changeI");
            if (player.isTypeExpansions("longtengmrfz", "basic")) player.changeMarkImage("longtengmrfz", "mrfz_LTF");
            if (player.isTypeExpansions("longtengmrfz", "trick")) player.changeMarkImage("longtengmrfz", "mrfz_LTL");
            if (player.isTypeExpansions("longtengmrfz", "equip")) player.changeMarkImage("longtengmrfz", "mrfz_LTA");
          }
        },
        basic_1: {
          charlotte: true,
          forced: true,
          trigger: { player: "phaseDrawBegin" },
          filter: function(event2, player2) {
            return player2.isTypeExpansions("longtengmrfz", "basic");
          },
          content: function() {
            trigger.num--;
            player.logSkill("longtengmrfz");
          }
        },
        basic_2: {
          charlotte: true,
          forced: true,
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.isTypeExpansions("longtengmrfz", "basic");
          },
          content: function() {
            player.draw();
            player.logSkill("longtengmrfz");
          }
        },
        trick: {
          direct: true,
          trigger: { player: "useCard2" },
          filter: function(event2, player2) {
            if (get.type(event2.card, "trick") != "trick") return false;
            if (player2.hasSkill("longtengmrfz_trick2")) return false;
            if (player2.isTypeExpansions("longtengmrfz", "trick") == false) return false;
            var info = get.info(event2.card);
            if (info.allowMultiple == false) return false;
            if (event2.targets && !info.multitarget) {
              if (game.hasPlayer(function(current) {
                return lib.filter.targetEnabled2(event2.card, player2, current) && !event2.targets.includes(current);
              })) {
                return true;
              }
            }
            return false;
          },
          content: function() {
            "step 0";
            player.chooseTarget(
              "【龙腾】:你可以为此牌(" + get.translation(trigger.card) + ")额外指定一个目标",
              function(card, player2, target2) {
                var player2 = _status.event.player;
                if (_status.event.targets.includes(target2)) return false;
                if (player2.canUse(trigger.card, target2, true) == false) return false;
                return lib.filter.targetEnabled2(_status.event.card, player2, target2);
              }
            ).set("ai", function(target2) {
              var trigger2 = _status.event.getTrigger();
              var player2 = _status.event.player;
              return get.effect(target2, trigger2.card, player2, player2);
            }).set("targets", trigger.targets).set("card", trigger.card);
            if (result.bool) {
              if (!event.isMine() && !event.isOnline()) game.delayx();
              event.targets = result.targets;
            } else {
              event.finish();
            }
            player.logSkill("longtengmrfz", event.targets);
            trigger.targets.addArray(event.targets);
            if (get.tag(trigger.card, "damage")) {
              player.chooseBool("【龙腾】:是否令此牌伤害+1？");
            } else event.finish();
            trigger.baseDamage++;
            player.addTempSkill("longtengmrfz_trick2");
          }
        },
        trick2: {
          charlotte: true
        },
        equip: {
          trigger: { player: "useCard2" },
          firstDo: true,
          filter: function(event2, player2) {
            if (get.type(event2.card) != "basic") return false;
            if (player2.isTypeExpansions("longtengmrfz", "equip") == false) return false;
            return true;
          },
          content: function() {
            "step 0";
            var list = ["不计入次数限制"];
            if (game.hasPlayer(function(current) {
              return !trigger.targets.includes(current) && player.canUse(trigger.card, current, false);
            }))
              list.add("增加目标");
            if (trigger.card.name == "sha") list.add("伤害基数+1");
            player.chooseControl(list).set("prompt", "【龙腾】:请选择一项").set("ai", function() {
              var player2 = _status.event.player, num = [];
              for (var i3 = 0; i3 < list.length; i3++) {
                num.add(i3);
              }
              if (get.name(_status.event.TriCard) == "sha" && player2.getCardUsable("sha") == 0 && player2.countCards("h", "sha") > 0)
                return 0;
              if (get.name(_status.event.TriCard) == "sha" && (player2.countCards("h", "sha") == 0 || player2.getCardUsable("sha") > 0))
                return list.length - 1;
              if (get.name(_status.event.TriCard) == "jiu") return 0;
              return num.randomGet();
            }).set("TriCard", trigger.card);
            game.log(player, "选择了", result.control);
            player.popup(result.control);
            player.logSkill("longtengmrfz");
            if (result.control == "不计入次数限制") {
              if (trigger.addCount !== false && (trigger.card.name == "sha" || trigger.card.name == "jiu")) {
                trigger.addCount = false;
                if (trigger.card.name == "sha") trigger.player.getStat().card.sha--;
                else trigger.player.getStat().card.jiu--;
              }
              event.finish();
            } else if (result.control == "增加目标") {
              player.chooseTarget(
                [1, 2],
                "【龙腾】:你可以为此牌(" + get.translation(trigger.card) + ")额外指定两个目标",
                function(card, player2, target2) {
                  var player2 = _status.event.player;
                  if (_status.event.targets.includes(target2)) return false;
                  if (player2.canUse(trigger.card, target2, true) == false) return false;
                  return lib.filter.targetEnabled2(_status.event.card, player2, target2);
                }
              ).set("ai", function(target2) {
                var trigger2 = _status.event.getTrigger();
                var player2 = _status.event.player;
                return get.effect(target2, trigger2.card, player2, player2);
              }).set("targets", trigger.targets).set("card", trigger.card);
            } else if (result.control == "伤害基数+1") {
              if (!trigger.baseDamage) trigger.baseDamage = 1;
              trigger.baseDamage += 1;
              event.finish();
            } else event.finish();
            if (result.bool) {
              for (var i2 = 0; i2 < result.targets.length; i2++) {
                trigger.targets.push(result.targets[i2]);
                player.line(result.targets[i2]);
              }
            }
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: ["phaseZhunbeiBegin", "dieBegin"] },
          content: function() {
            game.countPlayer(function(current) {
              var cards2 = current.getExpansions("longtengmrfz");
              if (current.getExpansions("longtengmrfz").length) current.loseToDiscardpile(cards2);
            });
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    //嵯峨
    quanshanmrfz: {
      audio: 2,
      trigger: { global: "phaseEnd" },
      filter: function(event2, player2) {
        return event2.player.countCards("h") == 0 && event2.player != player2;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.player) + "将手牌补至3张并令其获得一些负面效果？";
      },
      check: function(event2, player2) {
        if (event2.player.hp < 2 && get.attitude(player2, event2.player) > 0) return true;
        if (get.attitude(player2, event2.player) > 2 && event2.player.maxHp > 2) return Math.random() > 0.6;
        if (event2.player.hp < 2) return false;
        return get.attitude(player2, event2.player) < 2;
      },
      content: function() {
        var target2 = trigger.player;
        target2.drawTo(Math.min(3, target2.maxHp));
        target2.addSkill("quanshanmrfz_eff");
      },
      group: ["quanshanmrfz_clear", "quanshanmrfz_clear2"],
      subSkill: {
        clear2: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            return event2.player.hasSkill("quanshanmrfz_eff");
          },
          content: function() {
            var target2 = trigger.player;
            target2.removeMark("quanshanmrfz_eff", target2.countMark("quanshanmrfz_eff"));
            target2.removeSkill("quanshanmrfz_eff");
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "dieBegin" },
          filter: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current.hasMark("quanshanmrfz") || current.hasSkill("quanshanmrfz_eff");
            });
          },
          content: function() {
            game.countPlayer(function(current) {
              current.removeMark("quanshanmrfz_eff", current.countMark("quanshanmrfz_eff"));
              current.removeSkill("quanshanmrfz_eff");
            });
          }
        },
        eff: {
          marktext: "恶",
          intro: {
            name: "恶",
            content: "·当你造成伤害时，你获得一个‘恶’</br>·你共有#个‘恶’"
          },
          mark: true,
          trigger: { source: "damageEnd" },
          content: function() {
            "step 0";
            player.logSkill("quanshanmrfz");
            player.addMark("quanshanmrfz_eff");
            if (player.getHandcardLimit() <= 0) {
              event.getParent("phaseUse").skipped = true;
            }
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num - player2.countMark("quanshanmrfz_eff");
            }
          }
        }
      }
    },
    chuemrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer(function(current) {
          return current != player2 && current.countCards("h") > 0 && player2.inRange(current);
        });
      },
      filterTarget: function(card, player2, target2) {
        return player2.inRange(target2) && target2 != player2 && target2.countCards("h") > 0;
      },
      check: function() {
        return -1;
      },
      selectTarget: [1, 2],
      multitarget: true,
      multiline: true,
      content: function() {
        "step 0";
        event.num = 0;
        var target2 = targets[event.num];
        var hs = target2.getCards("h");
        var colred = false;
        for (var i2 = 0; i2 < hs.length; i2++) {
          if (get.color(hs[i2]) == "red") {
            colred = true;
            break;
          }
        }
        player.viewHandcards(target2);
        game.log(player, "观看了", target2, "的手牌");
        if (colred) {
          var list = [];
          for (var i2 = 0; i2 < hs.length; i2++) {
            if (list.length == 2) break;
            if (get.suit(hs[i2]) == "club" && !list.includes("梅花")) list.add("梅花");
            if (get.suit(hs[i2]) == "spade" && !list.includes("黑桃")) list.add("黑桃");
          }
          list.add("cancel2");
          if (list.length > 1)
            player.chooseControl(list).set("prompt", "【除恶】:请选择一个花色，然后其(" + get.translation(target2) + ")弃置该花色的所有牌").set("ai", function() {
              _status.event.player;
              var hs2 = target2.getCards(), num = 0;
              for (var i3 = 0; i3 < hs2.length; i3++) {
                if (get.suit(hs2[i3]) == "club") num++;
                if (get.suit(hs2[i3]) == "spade") num--;
              }
              if (list.length == 1) return 0;
              if (num > 0) return 0;
              return 1;
            });
        } else if (!colred) {
          player.chooseBool("【除恶】:是否弃置其(" + get.translation(target2) + ")所有手牌？");
          event.goto(3);
        } else event.finish();
        var target2 = targets[event.num];
        if (result.control != "cancel2") {
          var hs = target2.getCards();
          var dis = [];
          for (var i2 = 0; i2 < hs.length; i2++) {
            if (get.suit(hs[i2]) == (result.control == "黑桃" ? "spade" : "club")) dis.push(hs[i2]);
          }
          target2.discard(dis);
          player.draw(dis.length);
        }
        if (event.num < targets.length - 1) {
          event.num++;
          event.goto(1);
        } else event.finish();
        var target2 = targets[event.num];
        if (result.bool) {
          var dis = target2.getCards();
          target2.discard(dis);
          if (target2.hasMark("quanshanmrfz_eff")) {
            target2.damage(target2.countMark("quanshanmrfz_eff"));
            target2.removeMark("quanshanmrfz_eff", target2.countMark("quanshanmrfz_eff"));
          } else event.goto(5);
        }
        if (event.num < targets.length - 1) {
          event.num++;
          event.goto(1);
        } else event.finish();
        var target2 = targets[event.num];
        if (!target2.hasSkill("quanshanmrfz_eff")) {
          target2.drawTo(Math.min(3, target2.maxHp));
          target2.addSkill("quanshanmrfz_eff");
          player.popup("劝善");
          player.logSkill("quanshanmrfz", target2);
        }
        event.goto(4);
      },
      ai: {
        order: 13,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    //新银灰
    xuebianmrfz: {
      intro: {
        content: "已造成#点伤害"
      },
      onremove: true,
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return player2.countCards("h") > 0 && game.hasPlayer(function(current) {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      filterTarget: function(card, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      selectTarget: [1, 2],
      check: function() {
        return -1;
      },
      multitarget: true,
      multiline: true,
      content: function() {
        "step 0";
        event.cards1 = [];
        event.cards2 = [];
        event.cards3 = [];
        for (i2 of targets) i2.addTempSkill("xuebianmrfz2", { player: "phaseEnd" });
        targets.push(player);
        targets.sortBySeat();
        var next = player.chooseCardOL(targets, "请选择要展示的牌", true, [1, 3]).set("ai", function(card) {
          return -get.value(card);
        }).set("source", player);
        next.aiCard = function(target2) {
          var hs = target2.getCards("h");
          return { bool: true, cards: [hs.randomGet()] };
        };
        next._args.remove("glow_result");
        var cards2 = [];
        var num = 0;
        event.videoId = lib.status.videoId++;
        for (var i2 = 0; i2 < targets.length; i2++) {
          for (var j = 0; j < result[i2].cards.length; j++) {
            cards2.push(result[i2].cards[j]);
          }
        }
        event.cards = cards2;
        game.log(player, "展示了", targets, "的", cards2);
        game.broadcastAll(
          function(targets2, cards3, id, player2) {
            var dialog = ui.create.dialog(get.translation(player2) + "发动了【雪变】", cards3);
            dialog.videoId = id;
            var getName = function(target2) {
              if (target2._tempTranslate) return target2._tempTranslate;
              var name = target2.name;
              if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
              return get.translation(name);
            };
            for (var i3 = 0; i3 < targets2.length; i3++) {
              if (i3 == 0) event.cards1 = result[i3].cards;
              if (i3 == 1) event.cards2 = result[i3].cards;
              if (i3 == 2) event.cards3 = result[i3].cards;
              for (var j2 = 0; j2 < result[i3].cards.length; j2++) {
                if (i3 == 0) dialog.buttons[j2].querySelector(".info").innerHTML = getName(targets2[i3]);
                else if (i3 == 1)
                  dialog.buttons[j2 + result[i3 - 1].cards.length].querySelector(".info").innerHTML = getName(targets2[i3]);
                else
                  dialog.buttons[j2 + result[i3 - 2].cards.length + result[i3 - 1].cards.length].querySelector(".info").innerHTML = getName(targets2[i3]);
                if (get.color(result[i3].cards[j2]) == "red") num++;
                else num--;
              }
            }
          },
          targets,
          cards2,
          event.videoId,
          player
        );
        game.delay(4);
        if (num > 0) {
          player.chooseTarget("【雪变】：你可以对其中一名角色造成一点伤害并令其弃置其展示的牌", function(card, player2, target2) {
            return target2 != player2 && target2.hasSkill("xuebianmrfz2");
          }).set("ai", function(target2) {
            var player2 = _status.event.player;
            return get.attitude(player2, target2) < 0;
          });
          event.targets = result;
        } else {
          for (var i2 = 0; i2 < targets.length; i2++) {
            targets[i2].discard(result[i2].cards);
          }
        }
        var list = [event.cards1, event.cards2, event.cards3];
        game.broadcastAll("closeDialog", event.videoId);
        if (result.bool) {
          result.targets[0].damage();
          for (var i2 = 0; i2 < event.targets.length; i2++) {
            if (event.targets[i2] == result.targets[0]) var cards2 = list[i2];
          }
          result.targets[0].discard(cards2);
        }
      },
      group: "xuebianmrfz_dam",
      subSkill: {
        dam: {
          silent: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.getParent().name == "xuebianmrfz";
          },
          content: function() {
            player.addMark("xuebianmrfz", trigger.num, false);
          }
        }
      },
      ai: {
        order: 12,
        expose: 0.1,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    xuebianmrfz2: {
      charlotte: true
    },
    tonghemrfz: {
      audio: 2,
      derivation: ["xinyingshimrfz", "new_xinbangmrfz"],
      skillAnimation: true,
      animationColor: "thunder",
      unique: true,
      juexingji: true,
      trigger: { player: "phaseZhunbeiBegin" },
      forced: true,
      filter: function(event2, player2) {
        return player2.countMark("xuebianmrfz") >= 2 || game.roundNumber > 2;
      },
      content: function() {
        player.addMark("xinyingshimrfz", player.countMark("xuebianmrfz"), false);
        player.removeSkill("xuebianmrfz");
        player.addSkill("xinyingshimrfz");
        player.addSkill("new_xinbangmrfz");
        player.loseMaxHp();
        player.recoverTo(player.maxHp);
        player.awakenSkill("tonghemrfz");
      }
    },
    xinyingshimrfz: {
      audio: "yingshimrfz",
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => lib.skill.xinyingshimrfz.filterTarget(null, player2, current));
      },
      filterTarget: function(card, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      content: function() {
        var num = player.countMark("xinyingshimrfz") + 1;
        var max = target.countCards("h");
        if (max > num) return player.discardPlayerCard(num, target, "h", true, "visible");
        if (num >= max) return player.discardPlayerCard(max, target, "h", true, "visible");
        game.log(player, "观看了", target, "的手牌");
      },
      ai: {
        order: 13,
        expose: 0.1,
        threaten: 1.1,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    xinbangmrfz: {
      audio: 2,
      trigger: {
        player: "phaseDrawBegin2"
      },
      direct: true,
      filter: function(event2, player2) {
        return event2.num > 0 && !event2.numFixed;
      },
      content: function() {
        "step 0";
        player.storage.xinbangmrfz = [];
        var num = get.copy(trigger.num);
        player.chooseTarget(
          get.prompt("xinbangmrfz"),
          "选择至多" + get.translation(num) + "名其他角色，其选择让你定向摸牌，然后你少摸等量的牌",
          [1, num],
          function(card2, player2, target3) {
            return player2 != target3;
          },
          function(target3) {
            var att2 = get.attitude(_status.event.player, target3);
            return att2 > 0;
          }
        );
        if (result.bool) {
          event.targets = result.targets;
          event.num = 0;
          trigger.num -= result.targets.length;
        } else {
          event.finish();
        }
        var target2 = event.targets[event.num];
        var att = get.attitude(target2, player);
        target2.addTempSkill("xinbangmrfz2", {
          player: "phaseUseEnd"
        });
        target2.chooseControl("basic", "trick", "equip").set("prompt", "【兴邦】：请让" + get.translation(player) + "摸一张指定类型牌，当此牌造成伤害时，你与其各摸一张牌").set("ai", function(player2) {
          if (att > 0) return [1, 2].randomGet();
          return 0;
        });
        var card = get.cardPile2(function(card2) {
          return get.type(card2, "trick") == result.control;
        });
        if (card) {
          player.gain(card, "gain2").gaintag = ["xinbangmrfz"];
        } else player.chat("牌堆中没有" + get.translation(result.control) + "牌了！");
        var cards2 = player.getCards("h", function(card2) {
          return card2.hasGaintag("xinbangmrfz");
        });
        for (i of cards2) {
          i.storage.xinbangmrfz = true;
        }
        if (event.num < event.targets.length - 1) {
          event.num++;
          event.goto(2);
        }
        if (trigger.num <= 0) game.delay();
      },
      group: ["xinbangmrfz_draw", "xinbangmrfz_lose"],
      subSkill: {
        draw: {
          audio: "xinbangmrfz",
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            if (!event2.cards || event2.cards.length > 1) return false;
            return event2.card.storage && event2.card.storage.xinbangmrfz == true;
          },
          forced: true,
          content: function() {
            "step 0";
            player.chooseTarget("【兴邦】:请选择一名其他角色，然后你与其各摸一张牌", true, function(card, player2, target2) {
              return target2 != player2 && target2.hasSkill("xinbangmrfz2");
            }).set("ai", function(target2) {
              var player2 = _status.event.player;
              return get.attitude(player2, target2) > 0;
            });
            if (result.bool) {
              result.targets[0].draw();
              player.draw();
            }
          }
        },
        lose: {
          silent: true,
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.countCards("h", function(card) {
              return card.hasGaintag("xinbangmrfz");
            }) > 0;
          },
          content: function() {
            player.removeGaintag("xinbangmrfz");
          }
        }
      }
    },
    xinbangmrfz2: {
      charlotte: true,
      silent: true,
      onremove: true
    },
    new_xinbangmrfz: {
      audio: "xinbangmrfz",
      frequent: true,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        var list = player2.getStorage("xinbangmrfz2");
        if (!list.includes(get.type2(event2.card, player2))) return true;
        return false;
      },
      content: function() {
        "step 0";
        if (!player.storage.xinbangmrfz2) {
          player.addTempSkill("xinbangmrfz2");
          player.storage.xinbangmrfz2 = [];
        }
        player.storage.xinbangmrfz2.add(get.type2(trigger.card, player));
        player.draw();
        if (Array.isArray(result) && result.length > 0) {
          var card = result[0], cards2 = player.getCards("h"), list = [];
          for (var i2 of cards2) {
            if (i2 == result[0]) continue;
            list.add(get.suit(i2, player));
          }
          if (!list.includes(get.suit(card, player))) player.draw();
        }
      }
    },
    //帕拉斯
    yingzhumrfz: {
      audio: 2,
      trigger: { player: "phaseBegin" },
      direct: true,
      filter: function(event2, player2) {
        return !player2.storage.yingzhumrfz;
      },
      content: function() {
        "step 0";
        var next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束", "cancel2").set("prompt", get.prompt("yingzhumrfz"));
        next.set("prompt2", "你可以令自己在任意阶段结束后额外执行一个该阶段");
        next.set("ai", function() {
          var player2 = _status.event.player;
          if (player2.countCards("h", "sha") > player2.getCardUsable("sha") && game.hasPlayer(function(current) {
            return current != player2 && player2.inRange(current) && get.attitude(player2, current) < 0;
          }))
            return 3;
          return 2;
        });
        if (result.control != "cancel2") {
          var list = [
            "yingzhumrfz_Zhunbei",
            "yingzhumrfz_judge",
            "yingzhumrfz_draw",
            "yingzhumrfz_use",
            "yingzhumrfz_discard",
            "yingzhumrfz_jieshu"
          ];
          player.addTempSkill(list[result.index]);
          player.logSkill("yingzhumrfz");
        }
      },
      group: "yingzhumrfz_phase",
      subSkill: {
        phase: {
          direct: true,
          trigger: { global: "roundStart" },
          content: function() {
            "step 0";
            player.storage.yingzhumrfz = false;
            player.chooseTarget(
              get.prompt("yingzhumrfz"),
              "你可以选择一名其他角色，令其于任一阶段结束后额外执行一次此阶段",
              function(card, player2, target2) {
                return target2 != player2;
              }
            ).set("ai", function(target2) {
              var player2 = _status.event.player;
              var att = get.attitude(player2, target2);
              return att > 0;
            });
            if (result.bool) {
              get.attitude(player, result.targets[0]);
              var next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束");
              next.set("prompt", "【英祝】:请选择一个阶段," + get.translation(result.targets[0]) + "于此阶段结束后额外执行一次此阶段");
              next.set("ai", function() {
                result.targets[0];
                return 2;
              });
              player.storage.yingzhumrfz = true;
              event.target = result.targets[0];
            } else event.finish();
            var list = [
              "yingzhumrfz_Zhunbei",
              "yingzhumrfz_judge",
              "yingzhumrfz_draw",
              "yingzhumrfz_use",
              "yingzhumrfz_discard",
              "yingzhumrfz_jieshu"
            ];
            event.target.addSkill(list[result.index]);
            player.logSkill("yingzhumrfz", event.target);
          },
          ai: {
            expose: 0.1
          }
        },
        Zhunbei: {
          direct: true,
          trigger: { player: "phaseZhunbeiAfter" },
          mark: true,
          intro: {
            content: "于准备阶段结束后额外执行一个准备阶段"
          },
          content: function() {
            event.next.remove(player.phaseZhunbei());
            trigger.next.push(player.phaseZhunbei());
            player.removeSkill("yingzhumrfz_Zhunbei");
          }
        },
        judge: {
          direct: true,
          mark: true,
          intro: {
            content: "于判定阶段结束后额外执行一个判定阶段"
          },
          trigger: { player: "phaseJudgeAfter" },
          content: function() {
            event.next.remove(player.phaseJudge());
            trigger.next.push(player.phaseJudge());
            player.removeSkill("yingzhumrfz_judge");
          }
        },
        draw: {
          direct: true,
          mark: true,
          intro: {
            content: "于摸牌阶段结束后额外执行一个摸牌阶段"
          },
          trigger: { player: "phaseDrawAfter" },
          content: function() {
            event.next.remove(player.phaseDraw());
            trigger.next.push(player.phaseDraw());
            player.removeSkill("yingzhumrfz_draw");
          }
        },
        use: {
          direct: true,
          mark: true,
          intro: {
            content: "于出牌阶段结束后额外执行一个出牌阶段"
          },
          trigger: { player: "phaseUseAfter" },
          content: function() {
            event.next.remove(player.phaseUse());
            trigger.next.push(player.phaseUse());
            player.removeSkill("yingzhumrfz_use");
          }
        },
        discard: {
          direct: true,
          mark: true,
          intro: {
            content: "于弃牌阶段结束后额外执行一个弃牌阶段"
          },
          trigger: { player: "phaseDiscardAfter" },
          content: function() {
            event.next.remove(player.phaseDiscard());
            trigger.next.push(player.phaseDiscard());
            player.removeSkill("yingzhumrfz_discard");
          }
        },
        jieshu: {
          direct: true,
          mark: true,
          intro: {
            content: "于结束阶段结束后额外执行一个结束阶段"
          },
          trigger: { player: "phaseJieshuAfter" },
          content: function() {
            event.next.remove(player.phaseJieshu());
            trigger.next.push(player.phaseJieshu());
            player.removeSkill("yingzhumrfz_jieshu");
          }
        }
      }
    },
    yingdanmrfz: {
      audio: 2,
      silent: true,
      trigger: {
        global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]
      },
      content: function() {
        trigger.player.addMark("yingdanmrfz", false);
      },
      group: "yingdanmrfz_draw",
      subSkill: {
        draw: {
          direct: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            "step 0";
            var target2 = trigger.player;
            if (target2.countMark("yingdanmrfz") > 6) {
              var next = player.chooseBool(
                "【英诞】:是否令" + (target2 == player ? "自己" : get.translation(target2)) + "摸" + (target2.countMark("yingdanmrfz") - 6) + "张牌？"
              );
              next.set("ai", function() {
                var player2 = _status.event.player;
                var target3 = trigger.player;
                return get.attitude(player2, target3) > 0;
              });
            }
            var target2 = trigger.player;
            if (result.bool) {
              target2.draw(target2.countMark("yingdanmrfz") - 6);
              player.logSkill("yingdanmrfz", target2);
            }
            target2.removeMark("yingdanmrfz", target2.countMark("yingdanmrfz"), false);
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    yingfenmrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        if (player2.storage.yingfenmrfz) return false;
        return event2.card.name == "tao";
      },
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget(get.prompt("yingfenmrfz"), "你可以令一名其他角色恢复一点体力", function(card, player2, target2) {
          return target2 != player2;
        }).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.attitude(player2, target2) > 0;
        });
        if (result.bool) {
          player.storage.yingfenmrfz = true;
          result.targets[0].recover();
          player.logSkill("yingfenmrfz", result.targets[0]);
        }
      },
      group: "yingfenmrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          firstDo: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.yingfenmrfz;
          },
          content: function() {
            player.storage.yingfenmrfz = false;
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    //瑕光
    rencimrfz: {
      audio: 2,
      trigger: {
        global: "phaseEnd"
      },
      filter: function(event2, player2) {
        if (event2.player == player2 || event2.player.getHistory("skipped").length == 0) return false;
        return lib.filter.targetEnabled({ name: "sha" }, player2, event2.player) && (player2.hasSha() || _status.connectMode && player2.countCards("h") > 0);
      },
      direct: true,
      content: function() {
        player.addTempSkill("rencimrfz_dam", "useCardAfter");
        player.chooseToUse(
          function(card, player2, event2) {
            if (get.name(card) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【仁慈】:是否对" + get.translation(trigger.player) + "使用一张杀？"
        ).set("logSkill", "rencimrfz").set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger.player);
      },
      subSkill: {
        dam: {
          silent: true,
          trigger: {
            source: "damageBegin",
            player: "shaMiss"
          },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          content: function() {
            if (trigger.name == "damage") trigger.num++;
            player.removeSkill("rencimrfz_dam");
          }
        }
      }
    },
    huiguangmrfz: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      filter: function(event2, player2) {
        return player2.hasMark("huiguangmrfz") && player2.countMark("huiguangmrfz") <= 6;
      },
      direct: true,
      content: function() {
        "step 0";
        var num = player.countMark("huiguangmrfz") - 1;
        var list = ["准备", "判定", "摸牌", "出牌", "弃牌", "结束"];
        player.chooseTarget("【辉光】:你可以令一名其他角色跳过下个" + list[num] + "阶段", function(card, player2, target3) {
          return target3 != player2 && !target3.hasSkill("huiguangmrfz_skip");
        }).set("ai", function(target3) {
          var player2 = _status.event.player;
          var att = get.attitude(target3, player2), num2 = player2.countMark("huiguangmrfz");
          if (num2 == 2 || num2 == 5) return att > 0;
          return att < 0;
        });
        if (result.bool) {
          var target2 = result.targets[0], num = player.countMark("huiguangmrfz") - 1;
          target2.addSkill("huiguangmrfz_skip");
          target2.addMark("huiguangmrfz_skip", num + 1, false);
          player.logSkill("huiguangmrfz", target2);
        }
        player.removeMark("huiguangmrfz", player.countMark("huiguangmrfz"), false);
      },
      ai: {
        expose: 0.1
      },
      group: ["huiguangmrfz_mark"],
      subSkill: {
        skip: {
          markimage: "extension/WhichWay/image/skill/sleepmrfz.png",
          intro: {
            name: "睡眠",
            content: function(event2, player2) {
              var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
              var num = player2.countMark("huiguangmrfz_skip") - 1;
              return "跳过下个" + get.tranPhase(phase[num]);
            }
          },
          silent: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
            var num = player.countMark("huiguangmrfz_skip") - 1;
            player.skip(phase[num]);
            game.log(player, "跳过了", get.tranPhase(phase[num]));
            player.removeMark("huiguangmrfz_skip", player.countMark("huiguangmrfz_skip"), false);
            player.removeSkill("huiguangmrfz_skip");
          }
        },
        mark: {
          silent: true,
          trigger: {
            player: "useCardAfter"
          },
          filter: function(event2, player2) {
            return _status.currentPhase == player2;
          },
          content: function() {
            player.addMark("huiguangmrfz", false);
          }
        }
      }
    },
    jiandunmrfz: {
      audio: 2,
      enable: ["chooseToRespond", "chooseToUse"],
      hiddenCard: function(player2, name) {
        if (get.type(name) != "basic") return false;
        return player2.hasCard(function(card) {
          return get.type2(card) == "trick";
        }, "hs");
      },
      filter: function(event2, player2) {
        if (!player2.hasCard(function(card) {
          return get.type2(card) == "trick";
        }, "hs"))
          return false;
        for (var name of lib.inpile) {
          if (get.type(name) != "basic") continue;
          if (event2.filterCard({ name }, player2, event2)) return true;
          if (name == "sha") {
            for (var nature of lib.inpile_nature) {
              if (event2.filterCard({ name: "sha", nature }, player2, event2)) return true;
            }
          }
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var list = [];
          for (var name of lib.inpile) {
            if (get.type(name) != "basic") continue;
            if (event2.filterCard({ name }, player2, event2)) {
              list.push(["基本", "", name]);
            }
            if (name == "sha") {
              for (var nature of lib.inpile_nature) {
                if (event2.filterCard({ name, nature }, player2, event2)) list.push(["基本", "", "sha", nature]);
              }
            }
          }
          return ui.create.dialog("剑盾", [list, "vcard"], "hidden");
        },
        check: function(button) {
          var player2 = _status.event.player;
          var card = {
            name: button.link[2],
            nature: button.link[3]
          };
          if (_status.event.getParent().type != "phase" || game.hasPlayer(function(current) {
            return player2.canUse(card, current) && get.effect(current, card, player2, player2) > 0;
          })) {
            switch (button.link[2]) {
              case "tao":
              case "shan":
                return 5;
              case "jiu": {
                if (player2.countCards("hs", {
                  type: "trick"
                }) > 2)
                  return 3;
              }
              case "sha":
                if (button.link[3] == "fire") return 2.95;
                else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
                else return 2.9;
            }
          }
          return 0;
        },
        backup: function(links, player2) {
          return {
            audio: "jiandunmrfz",
            filterCard: function(card, player3, target2) {
              return get.type2(card) == "trick";
            },
            complexCard: true,
            selectCard: 1,
            check: function(card, player3, target2) {
              return 6 - get.value(card);
            },
            viewAs: { name: links[0][2], nature: links[0][3] },
            position: "hes",
            popname: true
          };
        },
        prompt: function(links, player2) {
          return "你可以将一张锦囊牌当任意基本牌使用或打出";
        }
      },
      ai: {
        order: 3.1,
        skillTagFilter: function(player2, tag, arg) {
          if (tag == "fireAttack") return true;
          if (!player2.hasCard(function(card) {
            return get.type2(card) == "trick";
          }, "hes")) {
            return false;
          }
        },
        result: {
          player: 1
        },
        respondSha: true,
        respondShan: true,
        fireAttack: true
      }
    },
    //新星熊
    xinboremrfz: {
      audio: "banruomrfz",
      mark: false,
      markimage: "extension/WhichWay/image/skill/xinboremrfz.png",
      intro: {
        content: function(player2) {
          var playerhas = game.findPlayer(function(current) {
            return current.hasSkill("xinboremrfz");
          });
          return get.translation(playerhas) + "正在保护你";
        }
      },
      group: ["xinboremrfz_choose", "xinboremrfz_card", "xinboremrfz_betarget"],
      subSkill: {
        betarget: {
          audio: "banruomrfz",
          trigger: {
            global: "useCardToPlayer"
          },
          filter: function(event2, player2) {
            if (event2.targets > 1 || get.type(event2.card) == "equip") return false;
            return event2.target.hasMark("xinboremrfz") && player2.getHandcardLimit() > 0;
          },
          prompt: function(event2, player2) {
            return "【般若】：是否令" + get.translation(event2.card) + "的目标由" + get.translation(event2.target) + "改为你？";
          },
          check: function(event2, player2) {
            var att = get.attitude(event2.target, player2);
            if ((event2.card.name == "wuzhong" || event2.card.name == "dongzhuxianji" || event2.card.name == "zenbing") && att < 0)
              return true;
            return att > 0 && get.tag(event2.card, "damage");
          },
          content: function() {
            "step 0";
            var target2 = trigger.target;
            trigger.targets.remove(target2);
            trigger.getParent().triggeredTargets1.remove(target2);
            trigger.untrigger();
            game.delayx();
            trigger.targets.push(player);
            trigger.player.line(player, "fire");
            game.log(trigger.card, "的目标被改为", player);
            player.addMark("xinboremrfz_losehdlimit", false);
          },
          ai: {
            expose: 0.1
          }
        },
        choose: {
          direct: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          filter: function(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          content: function() {
            "step 0";
            player.chooseTarget(true, "【般若】：请选择一名其他角色，令其获得‘般若’标记", function(card, player2, target3) {
              return target3 != player2;
            }).ai = function(target3) {
              return get.attitude(player, target3);
            };
            if (result.bool) {
              var target2 = result.targets[0];
              target2.addMark("xinboremrfz");
              player.logSkill("xinboremrfz", target2);
              player.disableEquip("equip2");
              target2.disableEquip("equip2");
              player.addSkill("xinboremrfz_handlit");
              target2.addSkill("xinboremrfz_handlit");
            }
            player.addSkill("xinboremrfz_losehdlimit");
            player.removeSkill("xinboremrfz_choose");
          },
          ai: {
            expose: 0.1
          }
        },
        card: {
          audio: "xinboremrfz",
          enable: "chooseToUse",
          hiddenCard: function(player2, name) {
            if (player2.hasSkill("xinboremrfz_usedwuxie") && player2.hasSkill("xinboremrfz_usedsha") && player2.hasSkill("xinboremrfz_usedshan"))
              return false;
            if (name == "wuxie" && player2.hasSkill("xinboremrfz_usedwuxie")) return false;
            if (name == "sha" && player2.hasSkill("xinboremrfz_usedsha")) return false;
            if (name == "shan" && player2.hasSkill("xinboremrfz_usedshan")) return false;
            return (name == "wuxie" || name == "sha" || name == "shan") && (player2.getHandcardLimit() > 0 || player2.countDisabledSlot() < 5);
          },
          filter: function(event2, player2) {
            if (player2.hasSkill("xinboremrfz_usedwuxie") && player2.hasSkill("xinboremrfz_usedsha") && player2.hasSkill("xinboremrfz_usedshan"))
              return false;
            return player2.getHandcardLimit() > 0 || player2.countDisabledSlot() < 5;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var vcards = [];
              for (var name of ["sha", "shan", "wuxie"]) {
                const card = { name };
                if (name == "wuxie" && player2.hasSkill("xinboremrfz_usedwuxie")) continue;
                if (name == "shan" && player2.hasSkill("xinboremrfz_usedshan")) continue;
                if (name == "sha" && player2.hasSkill("xinboremrfz_usedsha")) continue;
                if (event2.filterCard(card, player2, event2)) {
                  if (name == "sha") {
                    vcards.push(["基本", "", "sha"]);
                    for (var j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
                  } else if (get.type(name) == "trick") {
                    vcards.push(["锦囊", "", name]);
                  } else if (get.type(name) == "basic") {
                    vcards.push(["基本", "", name]);
                  }
                }
              }
              var dialog = ui.create.dialog("般若", [vcards, "vcard"], "hidden");
              dialog.direct = true;
              return dialog;
            },
            filter: function(button, player2) {
              return _status.event.getParent().filterCard({ name: button.link[2] }, player2, _status.event.getParent());
            },
            backup: function(links, player2) {
              return {
                filterCard: () => false,
                selectCard: -1,
                viewAs: {
                  name: links[0][2],
                  nature: links[0][3],
                  isCard: true
                },
                popname: true,
                precontent: function() {
                  "step 0";
                  var card = event.result.card.name;
                  if (card == "sha") {
                    event.getParent().addCount = false;
                    player2.addSkill("xinboremrfz_usedsha");
                  }
                  if (card == "shan") player2.addSkill("xinboremrfz_usedshan");
                  if (card == "wuxie") player2.addSkill("xinboremrfz_usedwuxie");
                  player2.logSkill("xinboremrfz");
                  var list = [];
                  if (player2.getHandcardLimit() > 0) list.push("手牌上限-1");
                  if (player2.countDisabledSlot() < 5) list.push("废除一个装备栏");
                  if (list.length > 1)
                    player2.chooseControl(list).set("prompt", "【般若】：请选择一项").set("ai", function() {
                      return 0;
                    });
                  else {
                    if (player2.getHandcardLimit() == 0)
                      player2.chooseToDisable().ai = function(event2, player3, list2) {
                        if (list2.includes("equip5")) return "equip5";
                        return list2.randomGet();
                      };
                    else player2.addMark("xinboremrfz_losehdlimit", false);
                  }
                  if (result.index == 0) player2.addMark("xinboremrfz_losehdlimit", false);
                  else
                    player2.chooseToDisable().ai = function(event2, player3, list2) {
                      if (list2.includes("equip5")) return "equip5";
                      return list2.randomGet();
                    };
                }
              };
            },
            prompt: function(links, player2) {
              return "【般若】：视为使用一张【" + get.translation(links[0][2]) + "】";
            }
          },
          ai: {
            order: function(item, player2) {
              var player2 = _status.event.player;
              var event2 = _status.event;
              if (event2.filterCard({ name: "sha" }, player2, event2)) {
                return 4;
              }
            },
            respondSha: true,
            respondShan: true,
            skillTagFilter: function(player2, tag, arg) {
              if (player2.hasSkill("xinboremrfz_usedwuxie") && player2.hasSkill("xinboremrfz_usedsha") && player2.hasSkill("xinboremrfz_usedshan"))
                return false;
              if (arg != "use") return false;
            },
            result: {
              player: 1
            }
          }
        },
        losehdlimit: {
          silent: true,
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num - player2.countMark("xinboremrfz_losehdlimit");
            }
          }
        },
        usedshan: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseZhunbeiBegin" },
          content: function() {
            player.removeSkill("xinboremrfz_usedshan");
          }
        },
        usedwuxie: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseZhunbeiBegin" },
          content: function() {
            player.removeSkill("xinboremrfz_usedwuxie");
          }
        },
        usedsha: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseZhunbeiBegin" },
          content: function() {
            player.removeSkill("xinboremrfz_usedsha");
          }
        },
        handlit: {
          silent: true,
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num + 1;
            }
          }
        }
      }
    },
    xinyizhongmrfz: {
      audio: "yizhongmrfz",
      forced: true,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.hp >= player2.getHandcardLimit();
      },
      content: function() {
        var num = 5 - player.countDisabledSlot() - 1;
        player.addMark("xinyizhongmrfz", num, false);
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + player2.countMark("xinyizhongmrfz");
        }
      },
      group: "xinyizhongmrfz_lose",
      subSkill: {
        lose: {
          audio: "yizhongmrfz",
          direct: true,
          charlotte: true,
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0 && event2.num > 0 && event2.source.hasMark("xinboremrfz");
          },
          content: function() {
            player.removeSkill("xinboremrfz");
            player.removeSkill("xinyizhongmrfz_lose");
          }
        }
      }
    },
    //新缪尔赛思
    yuanliumrfz: {
      audio: "kaiyuanmrfz",
      trigger: {
        player: "enterGame",
        global: "phaseBefore"
      },
      direct: true,
      locked: false,
      markimage: "extension/WhichWay/image/skill/miumiuliuxingmrfz.png",
      intro: {
        name: "流形",
        content: "#/3"
      },
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      content: function() {
        "step 0";
        player.chooseControl().set("choiceList", ["令一名角色摸两张牌", "获得一个‘流形’"]).set("ai", function() {
          return [0, 1].randomGet();
        });
        if (result.index == 0) {
          player.chooseTarget(true, "【源流】：令一名角色摸两张牌").ai = function(target3) {
            return get.attitude(player, target3) > 2;
          };
        } else {
          player.logSkill("kaiyuanmrfz");
          player.addMark("yuanliumrfz");
          event.finish();
        }
        if (result.bool) {
          var target2 = result.targets[0];
          target2.draw(2);
          player.logSkill("kaiyuanmrfz");
        }
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + player2.countMark("yuanliumrfz");
        }
      },
      group: "yuanliumrfz_get",
      subSkill: {
        get: {
          direct: true,
          trigger: {
            player: "phaseUseEnd"
          },
          filter: function(event2, player2) {
            return player2.getHistory("useCard", function(evt) {
              return evt.getParent("phaseUse") == event2;
            }).length > 0 && player2.countMark("yuanliumrfz") < 3;
          },
          content: function() {
            var list = [], mark = player.countMark("yuanliumrfz");
            player.getHistory("useCard", function(evt) {
              if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
            });
            if (mark + list.length > 3) player.addMark("yuanliumrfz", 3 - mark);
            else player.addMark("yuanliumrfz", list.length);
            player.logSkill("yuanliumrfz");
          }
        }
      }
    },
    xinjingshuimrfz: {
      audio: "jingshuimrfz",
      trigger: {
        player: "useCardToPlayered"
      },
      usable: 1,
      filter: function(event2, player2) {
        var evt = event2.getParent("phaseUse"), type = get.type(event2.card);
        if (type != "basic" && type != "trick") return false;
        if (!evt || evt.player != player2) return false;
        if (!player2.hasMark("yuanliumrfz")) return false;
        return event2.targets && event2.targets.length == 1;
      },
      prompt: function(event2, player2) {
        return "是否移除所有‘源流’并令【" + get.translation(event2.card.name) + "】额外结算" + player2.countMark("yuanliumrfz") + "次？";
      },
      check: function(event2, player2) {
        return !get.tag(event2.card, "norepeat");
      },
      content: function() {
        var num = player.countMark("yuanliumrfz");
        trigger.getParent().effectCount += num;
        player.removeAllmark("yuanliumrfz");
      }
    },
    shuilingmrfz: {
      audio: "liuxingmrfz",
      forced: true,
      trigger: { player: "damageBegin3" },
      filter: function(event2, player2) {
        if (player2.hasSkill("shuilingmrfz_ban")) return false;
        return !event2.nature && player2.countCards("h") >= player2.hp;
      },
      content: function() {
        trigger.num--;
        player.addTempSkill("shuilingmrfz_ban", "phaseEnd");
      },
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          intro: {
            content: "本回合已发动过【水灵】"
          }
        }
      }
    },
    //新归溟幽灵鲨
    xinyongwomrfz: {
      audio: "yongwomrfz",
      zhuanhuanji: true,
      locked: false,
      mark: true,
      marktext: "☯",
      intro: {
        content: function(storage, player2, skill) {
          if (player2.storage.xinyongwomrfz) return "阳：当你进入濒死状态时，你可以回复至一点体力";
          return "阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害";
        }
      },
      init: function(player2) {
        player2.storage.xinyongwomrfz = true;
      },
      trigger: { player: "dying" },
      filter: function(event2, player2) {
        return player2.storage.xinyongwomrfz;
      },
      prompt: "【拥我】：是否将体力回复至1点",
      content: function() {
        player.recoverTo(1);
        player.changeZhuanhuanji("xinyongwomrfz");
      },
      group: "xinyongwomrfz_ying",
      subSkill: {
        //阴
        ying: {
          audio: "xinyongwomrfz",
          trigger: { player: "turnOverAfter" },
          filter: function(event2, player2) {
            return event2.player.isTurnedOver() && !player2.storage.xinyongwomrfz;
          },
          prompt: "【拥我】：你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。",
          check: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current != player2 && get.attitude(player2, current) < 0;
            });
          },
          content: function() {
            "step 0";
            var choice = 0, max = 0;
            for (var i2 = 0; i2 < game.players.length; i2++) {
              var target2 = game.players[i2], tmp1 = 0;
              if (target2 == player) continue;
              if (!player.inRange(target2)) continue;
              if (get.attitude(player, target2) > 0) continue;
              if (target2.countCards("e") > 0) tmp1++;
              if (target2.countCards("h") > 0) tmp1++;
              if (target2.countCards("j") > 0) tmp1--;
              if (tmp1 > max) max = tmp1;
            }
            if (game.hasPlayer(function(current) {
              return current != player && get.attitude(player, current) < 0 && current.hp <= 1;
            }) || max < 2)
              choice = 1;
            player.draw(2);
            player.chooseControl().set("choiceList", ["弃置你攻击范围内一名其他角色区域内各一张牌", "对你攻击范围内的一名其他角色造成一点伤害"]).set("ai", function() {
              return choice;
            });
            event.choice = choice;
            event.index = result.index;
            if (game.hasPlayer(function(current) {
              return current != player && player.inRange(current);
            })) {
              player.chooseTarget("【拥我】:请选择一名其他角色", true, function(rd, player2, target3) {
                return target3 != player2 && player2.inRange(target3);
              }).set("ai", function(target3) {
                var player2 = _status.event.player, att = get.attitude(player2, target3);
                if (event.choice == 0) {
                  if (target3.countCards("e") > 0) return att < 0 && target3.countCards("e") > 0;
                  else return att < 0;
                } else return get.damageEffect(target3, player2, player2) > 0;
              });
            } else event.finish();
            if (result.bool) {
              var target2 = result.targets[0];
              if (event.index == 0) {
                var num = 0;
                if (target2.countCards("h")) num++;
                if (target2.countCards("e")) num++;
                if (target2.countCards("j")) num++;
                if (num) {
                  player.discardPlayerCard(target2, num, "hej", true).set("filterButton", function(button) {
                    for (var i3 = 0; i3 < ui.selected.buttons.length; i3++) {
                      if (get.position(button.link) == get.position(ui.selected.buttons[i3].link)) return false;
                    }
                    return true;
                  });
                }
              } else target2.damage("player");
              player.logSkill("yongwomrfz", target2);
              player.changeZhuanhuanji("xinyongwomrfz");
            }
          }
        }
      }
    },
    douzhengmrfz: {
      audio: 2,
      trigger: { global: "phaseEnd" },
      prompt: function(event2, player2) {
        return "【斗争】：是否失去所有体力并视为对" + get.translation(event2.player) + "使用一张【杀】？";
      },
      filter: function(event2, player2) {
        return event2.player != player2;
      },
      check: function(event2, player2) {
        if (get.attitude(player2, event2.player) > 0) return false;
        return player2.countCards("h", function(card) {
          return card.name == "tao" || card.name == "jiu";
        }) > 0 || player2.storage.xinyongwomrfz == true;
      },
      content: function() {
        player.loseHp(player.hp);
        player.useCard({ name: "sha", isCard: true }, false, trigger.player);
        player.turnOver();
      },
      ai: {
        expose: 0.1
      }
    },
    shensuimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "loseHpEnd" },
      filter: function(event2, player2) {
        return event2.num > 1 && player2.hujia < 1;
      },
      content: function() {
        player.changeHujia(trigger.num);
      },
      group: "shensuimrfz_change",
      subSkill: {
        change: {
          direct: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return !player2.storage.xinyongwomrfz;
          },
          content: function() {
            player.changeZhuanhuanji("xinyongwomrfz");
          }
        }
      }
    },
    //早露
    zhongxiemrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "useCardToPlayered"
      },
      filter: function(event2, player2) {
        if (event2.card.name != "sha" || typeof get.number(event2.card) != "number") return false;
        return event2.target.countCards("h") <= get.number(event2.card);
      },
      content: function() {
        trigger.getParent().directHit.add(trigger.target);
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          if (tag == "directHit_ai") {
            if (arg.card.name == "sha" && typeof get.number(arg.card) == "number")
              return arg.card.name == "sha" && arg.target.countCards("h") <= get.number(arg.card);
          }
          return false;
        }
      },
      mod: {
        attackRange: function(player2, num) {
          return num += 2;
        }
      },
      group: ["zhongxiemrfz_damage", "zhongxiemrfz_wushi"],
      subSkill: {
        damage: {
          audio: "zhongxiemrfz",
          forced: true,
          trigger: { source: "damageBegin" },
          filter: function(event2, player2) {
            return event2.player.hujia > 0;
          },
          content: function() {
            trigger.num += trigger.player.hujia;
          }
        },
        wushi: {
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2) {
            return event2.card.name == "sha";
          },
          direct: true,
          logTarget: "target",
          content: function() {
            trigger.target.addTempSkill("qinggang2");
            trigger.target.storage.qinggang2.add(trigger.card);
            trigger.target.markSkill("qinggang2");
          },
          ai: {
            unequip_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              if (arg && arg.name == "sha") return true;
              return false;
            }
          }
        }
      }
    },
    rusuimrfz: {
      audio: 2,
      trigger: { source: "damageBegin2" },
      filter: function(event2, player2) {
        var num = 0, target2 = event2.player;
        if (!event2.card) return false;
        if (target2.countCards("h") >= target2.hp) num++;
        if (target2.countCards("e") > 0) num++;
        if (target2.getDamagedHp() <= target2.hp) num++;
        return event2.player != player2 && event2.card.name == "sha" && num != 0;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      prompt: function(event2, player2) {
        var num = 0, target2 = event2.player;
        if (target2.countCards("h") >= target2.hp) num++;
        if (target2.countCards("e") > 0) num++;
        if (target2.getDamagedHp() <= target2.hp) num++;
        if (num < 3) return "【入髓】：是否令" + get.translation(target2) + "弃置" + num + "张牌";
        else return "【入髓】：是否令" + get.translation(target2) + "弃置" + num + "张牌并令此杀伤害+1";
      },
      prompt2: false,
      content: function() {
        var num = 0, target2 = trigger.player;
        if (target2.countCards("h") >= target2.hp) num++;
        if (target2.countCards("e") > 0) num++;
        if (target2.getDamagedHp() <= target2.hp) num++;
        target2.chooseToDiscard("he", true, "【入髓】：请弃置" + num + "张牌", num);
        if (num == 3) trigger.num++;
      }
    },
    //琳琅诗怀雅
    zhijinmrfz: {
      mod: {
        aiOrder: function(player2, card, num) {
          if (typeof card == "object" && player2.isPhaseUsing()) {
            var evt = lib.skill.zhijinmrfz.getLastUsed(player2);
            if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) {
              return num + 10;
            }
          }
        }
      },
      marktext: "钱",
      intro: {
        name: "钱",
        content: "共有#个钱"
      },
      audio: 4,
      trigger: { player: "useCard" },
      forced: true,
      getLastUsed: function(player2, event2) {
        var history = player2.getAllHistory("useCard");
        var index;
        if (event2) index = history.indexOf(event2) - 1;
        else index = history.length - 1;
        if (index >= 0) return history[index];
        return false;
      },
      filter: function(event2, player2) {
        var evt = lib.skill.dcjianying.getLastUsed(player2, event2);
        if (!evt || !evt.card) return false;
        return lib.suit.includes(get.suit(evt.card)) && get.suit(evt.card) == get.suit(event2.card);
      },
      content: function() {
        player.addMark("zhijinmrfz");
      },
      group: ["zhijinmrfz_round", "zhijinmrfz_use"],
      subSkill: {
        use: {
          audio: "zhijinmrfz",
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function(event2, player2) {
            var list = [], mark = player2.countMark("zhijinmrfz");
            if (mark >= 1) list.push("sha");
            if (mark >= 2) list.push("juedou");
            if (mark >= 3) list.push("wuzhong");
            if (mark >= 4) list.push("tao");
            if (mark >= 5) list.push("wanjian");
            if (!player2.isPhaseUsing() || player2.countMark("zhijinmrfz") == 0 || list.length == 0) return false;
            for (var name of list) {
              if (event2.filterCard({ name, isCard: false }, player2, event2)) return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var vcards = [], list = [], mark = player2.countMark("zhijinmrfz");
              if (mark >= 1) list.push("sha");
              if (mark >= 2) list.push("juedou");
              if (mark >= 3) list.push("wuzhong");
              if (mark >= 4) list.push("tao");
              if (mark >= 5) list.push("wanjian");
              for (var name of list) {
                const card = { name };
                if (event2.filterCard(card, player2, event2)) {
                  if (name == "sha") {
                    for (var j of lib.inpile_nature) {
                      if (j != "fire") continue;
                      vcards.push(["基本", "", "sha", j]);
                    }
                  } else if (get.type(name) == "trick") {
                    vcards.push(["锦囊", "", name]);
                  } else if (get.type(name) == "basic") {
                    vcards.push(["基本", "", name]);
                  }
                }
              }
              var dialog = ui.create.dialog("掷金", [vcards, "vcard"], "hidden");
              dialog.direct = true;
              return dialog;
            },
            check: function(button) {
              var player2 = _status.event.player;
              var lose = 1, players = game.filterPlayer(), choose = button.link[2];
              var mark = player2.countMark("zhijinmrfz");
              if (mark >= 5) {
                if (player2.hp < 3) return choose == "tao" ? 2 : -1;
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                  if (att < 0) lose++;
                  if (att > 0 && players[i2].hp > 2) lose = lose - 0.5;
                  if (att > 0 && players[i2].hp < 2) lose--;
                  if (att > 2 && players[i2] == 1) lose -= 3;
                }
                if (lose > 0) return choose == "wanjian" ? 1 : -1;
                if (player2.countCards("h", function(card) {
                  return card.name = "sha";
                }) >= player2.getCardUsable("sha") || player2.getCardUsable("sha") == 0)
                  return choose == "wuzhong" ? 1 : -1;
                return choose == "sha" ? 1 : -1;
              }
              if (mark >= 4) {
                if (player2.hp < 3) return choose == "tao" ? 1 : -1;
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                }
                if (player2.countCards("h", function(card) {
                  return card.name = "sha";
                }) >= player2.getCardUsable("sha") || player2.getCardUsable("sha") == 0)
                  return choose == "wuzhong" ? 1 : -1;
                return choose == "sha" ? 1 : -1;
              }
              if (mark >= 3) {
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                }
                if (player2.countCards("h", function(card) {
                  return card.name = "sha";
                }) >= player2.getCardUsable("sha") || player2.getCardUsable("sha") == 0)
                  return choose == "wuzhong" ? 1 : -1;
                return choose == "sha" ? 1 : -1;
              }
              if (mark >= 2) {
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                }
                return choose == "sha" ? 1 : -1;
              }
              return choose == "sha" ? 1 : -1;
            },
            backup: function(links, player2) {
              return {
                filterCard: () => true,
                selectCard: 1,
                viewAs: {
                  name: links[0][2],
                  nature: links[0][3],
                  isCard: false
                },
                position: "he",
                popname: true,
                precontent: function() {
                  var card = event.result.card.name, mark = player2.countMark("zhijinmrfz");
                  if (card == "sha") {
                    if (mark == 1) player2.draw();
                    player2.removeMark("zhijinmrfz");
                  }
                  if (card == "juedou") {
                    if (mark == 2) player2.draw();
                    player2.removeMark("zhijinmrfz", 2);
                  }
                  if (card == "wuzhong") {
                    if (mark == 3) player2.draw();
                    player2.removeMark("zhijinmrfz", 3);
                  }
                  if (card == "tao") {
                    if (mark == 4) player2.draw();
                    player2.removeMark("zhijinmrfz", 4);
                  }
                  if (card == "wanjian") {
                    if (mark == 5) player2.draw();
                    player2.removeMark("zhijinmrfz", 5);
                  }
                }
              };
            },
            prompt: function(links, player2) {
              return "【掷金】：视为使用一张" + (links[0][3] == void 0 ? "" : "火") + "【" + get.translation(links[0][2]) + "】";
            }
          },
          ai: {
            respondSha: true,
            fireAttack: true,
            order: function(item, player2) {
              var player2 = _status.event.player;
              var event2 = _status.event;
              var mark = player2.countMark("zhijinmrfz");
              if (event2.filterCard({ name: "tao" }, player2, event2) && mark >= 4) {
                return 10;
              }
              if (event2.filterCard({ name: "wuzhong" }, player2, event2) && mark >= 3) {
                return 13;
              }
              if (event2.filterCard({ name: "juedou" }, player2, event2) && mark >= 2) {
                return 4.95;
              }
              if (event2.filterCard({ name: "sha" }, player2, event2) && mark >= 1) {
                return 2.95;
              }
            },
            skillTagFilter: function(player2, tag, arg) {
              return player2.countMark("zhijinmrfz") > 0;
            },
            result: {
              player: 1
            }
          }
        },
        round: {
          audio: "zhijinmrfz",
          trigger: { global: "roundStart" },
          forced: true,
          charlotte: true,
          content: function() {
            player.addMark("zhijinmrfz");
          }
        }
      }
    },
    mianzaimrfz: {
      markimage: "extension/WhichWay/image/skill/mianzaimrfz_money.png",
      intro: {
        content: "累计点数：#"
      },
      audio: 2,
      trigger: {
        player: "dying"
      },
      forced: true,
      content: function() {
        var cards2 = game.cardsGotoOrdering(get.cards(6)).cards, num = 0;
        for (var i2 = 0; i2 < cards2.length; i2++) {
          num = num + cards2[i2].number;
        }
        player.showCards(cards2, get.translation(player) + "发动了【免灾】</br>点数之和为：" + num);
        if (num <= player.countMark("mianzaimrfz")) {
          player.recoverTo(3);
          player.drawTo(3);
          player.removeMark("mianzaimrfz", player.countMark("mianzaimrfz"), false);
        }
      },
      group: ["mianzaimrfz_number"],
      subSkill: {
        number: {
          silent: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.cards && event2.cards.length == 1;
          },
          content: function() {
            var num = trigger.card.number;
            player.addMark("mianzaimrfz", num, false);
          }
        }
      }
    },
    //圣约送葬人
    chongdanmrfz: {
      audio: 2,
      frequent: true,
      subfrequent: ["chongdanmrfz_player"],
      trigger: {
        source: "damageSource"
      },
      filter: function(event2, player2) {
        if (player2.countCards("h") == 0 && player2.getDamagedHp() == 0) return false;
        return !player2.storage.chongdanmrfz;
      },
      content: function() {
        "step 0";
        player.storage.chongdanmrfz = true;
        if (player.getDamagedHp() == 0) player.draw(player.hp);
        else {
          player.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？").set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力").set("ai", function() {
            var player2 = _status.event.player;
            var hp = player2.hp;
            if (player2.countCards("h") == 0) return 0;
            if (hp < 2) return 1;
            if (player2.countCards("j") > 0) return 1;
            if (player2.isPhaseUsing() && player2.countCards("h", function(card) {
              return card.name == "tao";
            }) >= player2.getDamagedHp())
              return 1;
            return 0;
          });
        }
        if (result.bool) {
          player.draw(player.hp);
        } else {
          player.recover(player.countCards("h"));
        }
      },
      mod: {
        cardEnabled: function(card, player2) {
          if (player2.countMark("chongdanmrfz_lim") >= 2 * player2.maxHp) return false;
        },
        cardUsable: function(card, player2) {
          if (player2.countMark("chongdanmrfz_lim") >= 2 * player2.maxHp) return false;
        },
        cardSavable: function(card, player2) {
          if (player2.countMark("chongdanmrfz_lim") >= 2 * player2.maxHp) return false;
        }
      },
      ai: {
        presha: true,
        pretao: true
      },
      group: ["chongdanmrfz_clear", "chongdanmrfz_player", "chongdanmrfz_lim"],
      subSkill: {
        lim: {
          mark: true,
          intro: {
            content: "已使用：#张牌"
          },
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: {
            player: "useCard"
          },
          filter: function(event2, player2) {
            return player2.countMark("chongdanmrfz_lim") < 2 * player2.maxHp;
          },
          content: function() {
            player.addMark("chongdanmrfz_lim", false);
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            if (player.storage.chongdanmrfz_player) player.storage.chongdanmrfz_player = false;
            if (player.storage.chongdanmrfz) player.storage.chongdanmrfz = false;
            if (player.countMark("chongdanmrfz_lim") > 0)
              player.removeMark("chongdanmrfz_lim", player.countMark("chongdanmrfz_lim"), false);
          }
        },
        player: {
          audio: "chongdanmrfz",
          trigger: {
            player: "damageEnd"
          },
          filter: function(event2, player2) {
            if (player2.countCards("h") == 0 && player2.getDamagedHp() == 0) return false;
            return !player2.storage.chongdanmrfz_player;
          },
          content: function() {
            "step 0";
            player.storage.chongdanmrfz_player = true;
            if (player.getDamagedHp() == 0) player.draw(player.hp);
            else {
              player.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？").set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力").set("ai", function() {
                var player2 = _status.event.player;
                var hp = player2.hp;
                if (player2.countCards("h") == 0) return 0;
                if (hp < 3) return 1;
                if (player2.countCards("j") > 0) return 1;
                if (player2.isPhaseUsing() && player2.countCards("h", function(card) {
                  return card.name == "tao";
                }) >= player2.getDamagedHp())
                  return 1;
                return 0;
              });
            }
            if (result.bool) {
              player.draw(player.hp);
            } else {
              player.recover(player.countCards("h"));
            }
          }
        }
      }
    },
    tianxuanmrfz: {
      audio: 2,
      mark: true,
      intro: {
        content: function(event2, player2) {
          return "已有的花色：" + get.translation(player2.storage.tianxuanmrfz);
        }
      },
      trigger: {
        player: "useCard1"
      },
      filter: function(event2, player2) {
        return get.tag(event2.card, "damage") > 0 && player2.isPhaseUsing();
      },
      init: function(player2) {
        player2.storage.tianxuanmrfz = ["heart"];
      },
      prompt: function(event2, player2) {
        var list = player2.storage.tianxuanmrfz;
        return "【天选】：是否进行判定，若为" + get.translation(list) + ",则" + get.translation(event2.card) + "结算两次";
      },
      content: function() {
        "step 0";
        var list = player.storage.tianxuanmrfz;
        player.judge(function(card) {
          for (var i2 = 0; i2 < list.length; i2++) {
            var suit2 = get.suit(card);
            if (suit2 == list[i2]) return -4;
          }
          return 0;
        }).judge2 = function(result2) {
          return result2.bool == false ? true : false;
        };
        if (result.bool == false) {
          trigger.effectCount++;
          player.storage.tianxuanmrfz = [];
          event.finish();
        } else {
          var suit = player.storage.tianxuanmrfz, list = [];
          for (i of lib.suit) {
            if (suit.includes(i)) continue;
            list.push(i);
          }
          player.chooseControl(list).set("prompt", "【天选】：请选择为[]内增加一个花色").set("ai", function() {
            if (list.includes("diamond")) return "diamond";
            return list.randomGet();
          });
        }
        if (result.control) {
          player.storage.tianxuanmrfz.add(result.control);
          player.storage.tianxuanmrfz.sort();
        }
      }
    },
    shengcaimrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (!get.tag(event2.card, "damage") || !player2.isPhaseUsing()) return false;
        return player2.getHistory("useCard", function(evt) {
          return get.tag(evt.card, "damage") > 0;
        }).length > 1;
      },
      prompt: function(event2, player2) {
        return "【圣裁】：是否令" + get.translation(event2.card) + "伤害基数+1？";
      },
      content: function() {
        if (!trigger.baseDamage) trigger.baseDamage = 1;
        trigger.baseDamage++;
      },
      group: "shengcaimrfz_damage",
      subSkill: {
        damage: {
          direct: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return game.countPlayer((current) => {
              return current != player2 && current.getHistory("damage").length > 0;
            }) > 0;
          },
          content: function() {
            "step 0";
            var next = player.chooseTarget(
              [1, Infinity],
              "【圣裁】：你可以对本回合造成过伤害的其他角色造成一点伤害",
              function(card, player2, target2) {
                return target2 != player2 && target2.getHistory("damage").length > 0;
              }
            );
            next.ai = function(target2) {
              return get.attitude(player, target2) < 0;
            };
            if (result.targets) {
              player.logSkill("shengcaimrfz");
              for (i of result.targets) {
                i.damage("player");
                player.line(i);
              }
            }
          }
        }
      }
    },
    //涤火杰西卡
    yijiemrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        if (player2.countCards("he") == 0) return false;
        return game.countPlayer(function(current) {
          return current != player2 && current.countCards("h") > 0;
        }) > 0;
      },
      filterTarget: function(card, player2, target2) {
        return target2 != player2;
      },
      targetprompt: ["被出杀(A)", "出杀(B)", "出杀(B)"],
      selectTarget: [2, 3],
      multitarget: true,
      line: false,
      content: function() {
        "step 0";
        event.num = 0;
        targets.push(player);
        var frsTargets = targets[0], secTargets = targets.slice(1);
        for (var i2 of secTargets) i2.line(frsTargets);
        var frsTargets = targets[0], secTargets = targets.slice(1);
        if (event.num < secTargets.length) {
          secTargets[event.num].storage.yijiemrfz = frsTargets;
          secTargets[event.num].addTempSkill("yijiemrfz_gain", "shaMiss");
          secTargets[event.num].chooseToUse(
            function(card, player2, event2) {
              if (get.name(card) != "sha") return false;
              return lib.filter.filterCard.apply(this, arguments);
            },
            "【义劫】：是否对" + get.translation(frsTargets) + "使用一张杀？"
          ).set("complexSelect", true).set("filterTarget", function(card, player2, target2) {
            if (target2 != _status.event.frsTargets && !ui.selected.targets.includes(_status.event.frsTargets)) return false;
            return lib.filter.targetEnabled.apply(this, arguments);
          }).set("addCount", false).set("frsTargets", frsTargets);
          event.num++;
          event.redo();
        }
      },
      ai: {
        order: 4.1,
        expose: 0.1,
        result: {
          player: 1,
          target: function(player2, target2) {
            if (ui.selected.targets.length == 0) {
              return -3;
            } else return 1;
          }
        }
      },
      //group:'tuohuangmrfz',
      subSkill: {
        gain: {
          direct: true,
          charlotte: true,
          trigger: {
            source: "damageEnd"
          },
          onremove: function(player2) {
            delete player2.storage.yijiemrfz;
          },
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha" && event2.player == player2.storage.yijiemrfz;
          },
          content: function() {
            if (trigger.player.countCards("he") > 0) player.gainPlayerCard(trigger.player, true, "he");
            else trigger.player.damage("player");
            player.removeSkill("yijiemrfz_gain");
            delete player.storage.yijiemrfz;
          }
        }
      }
    },
    fuhuangmrfz: {
      audio: 2,
      derivation: ["tuohuangmrfz", "weihumrfz"],
      skillAnimation: true,
      animationColor: "fire",
      unique: true,
      juexingji: true,
      forced: true,
      trigger: {
        player: "gainAfter",
        global: "loseAsyncAfter"
      },
      filter: function(event2, player2) {
        return player2.countMark("fuhuangmrfz_mark") >= 2;
      },
      content: function() {
        player.removeMark("fuhuangmrfz_mark", player.countMark("fuhuangmrfz_mark"), false);
        player.awakenSkill("fuhuangmrfz");
        player.removeSkill("yijiemrfz");
        player.addSkill("tuohuangmrfz");
        player.addSkill("weihumrfz");
        player.draw(2);
        player.changeHujia(1);
        player.loseMaxHp(1);
      },
      group: "fuhuangmrfz_mark",
      subSkill: {
        mark: {
          intro: {
            content: "已获得#张牌"
          },
          silent: true,
          firstDo: true,
          trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter"
          },
          filter: function(event2, player2) {
            if (player2.countMark("fuhuangmrfz_mark") >= 2) return false;
            return event2.getg(player2).length && event2.getParent("phaseDraw").player != player2;
          },
          content: function() {
            player.addMark("fuhuangmrfz_mark", false, trigger.num);
          }
        }
      }
    },
    tuohuangmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer(function(current) {
          return current.countCards("he") > 0;
        });
      },
      multitarget: true,
      multiline: true,
      filterTarget: function(card, player2, target2) {
        return target2.countCards("h") > 0;
      },
      selectTarget: [1, 3],
      content: function() {
        "step 0";
        var num = 4 - targets.length;
        var cards2 = game.cardsGotoOrdering(get.cards(num)).cards;
        event.cards = cards2;
        player.showCards(event.cards, get.translation(player) + "发动了【拓荒】");
        event.num = 0;
        if (event.num < targets.length) {
          var suit = [];
          for (var i2 of event.cards) {
            if (!suit.includes(get.suit(i2)) && lib.suit.includes(get.suit(i2))) suit.push(get.suit(i2));
          }
          targets[event.num].chooseToDiscard(
            "h",
            "【拓荒】：你可以弃置" + get.translation(suit) + "花色的手牌并摸等量+1张牌",
            [1, Infinity],
            function(card) {
              var suitcard = get.suit(card);
              if (suit.includes("diamond") && suitcard == "diamond") return true;
              if (suit.includes("heart") && suitcard == "heart") return true;
              if (suit.includes("spade") && suitcard == "spade") return true;
              if (suit.includes("club") && suitcard == "club") return true;
            }
          ).set("ai", function(card) {
            return 8 - get.value(card);
          });
        } else event.finish();
        if (result.cards) {
          targets[event.num].draw(1 + result.cards.length);
        }
        event.num++;
        event.goto(1);
      },
      ai: {
        expose: 0.1,
        threaten: 1.35,
        order: 1,
        result: {
          player: 1,
          target: 1
        }
      }
    },
    weihumrfz: {
      mod: {
        maxHandcard: function(player2, num) {
          if (player2.hujia > 0) return num + 1;
        }
      },
      audio: 2,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        return player2.hujia < 1;
      },
      forced: true,
      content: function() {
        player.changeHujia();
      },
      group: "weihumrfz_give",
      subSkill: {
        give: {
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.hujia > 0;
          },
          direct: true,
          content: function() {
            "step 0";
            player.chooseTarget(
              [1, player.hujia + 1],
              "【卫护】：你可以失去至少一点护甲，然后令等量+1名没有护甲的其他角色获得一点护甲",
              function(card, player2, target2) {
                return target2 != player2 && target2.hujia < 1;
              }
            ).ai = function(target2) {
              return get.attitude(player, target2) > 2;
            };
            if (result.targets) {
              player.logSkill("weihumrfz");
              player.changeHujia(Math.min(-1, -result.targets.length + 1));
              for (i of result.targets) {
                i.changeHujia();
                player.line(i);
              }
            }
          }
        }
      }
    },
    //提丰 小台风
    ruiyamrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          return "上一个成为一唯一目标的【杀】的角色：" + (player2.storage.ruiyamrfz ? get.translation(player2.storage.ruiyamrfz) : "无");
        }
      },
      audio: 2,
      trigger: {
        player: "useCard2"
      },
      filter: function(event2, player2) {
        return event2.cards && event2.card.name == "sha" && event2.targets && event2.targets.length == 1 && event2.targets[0] == player2.storage.ruiyamrfz;
      },
      //QQQ
      prompt: "【锐牙】:是否令此杀伤害+1？",
      check: function(event2, player2) {
        return get.attitude(player2, event2.targets[0]) < 2;
      },
      //QQQ
      content: function() {
        var target2 = trigger.targets[0];
        target2.addTempSkill("ruiyamrfz_dam");
        target2.storage.ruiyamrfz_dam = {
          card: trigger.card
        };
      },
      group: "ruiyamrfz_mark",
      subSkill: {
        mark: {
          charlotte: true,
          silent: true,
          direct: true,
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2, player2) {
            if (!event2.targets || event2.targets > 1) return false;
            return event2.card && event2.card.name == "sha";
          },
          content: function() {
            player.storage.ruiyamrfz = trigger.target;
          }
        },
        dam: {
          onremove: function(player2) {
            delete player2.storage.ruiyamrfz_dam;
          },
          trigger: {
            player: "damageBegin3"
          },
          filter: function(event2, player2) {
            var info = player2.storage.ruiyamrfz_dam;
            return event2.card && event2.card == info.card;
          },
          silent: true,
          popup: false,
          forced: true,
          content: function() {
            trigger.num++;
          }
        }
      }
    },
    shouliemrfz: {
      marktext: "矢",
      intro: {
        name: "矢",
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 4,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.getExpansions("shouliemrfz").length >= 3) return false;
        return player2.countCards("he", function(card) {
          return get.tag(card, "damage") > 0;
        }) > 0;
      },
      filterCard: function(card) {
        return get.tag(card, "damage");
      },
      selectCard: function() {
        var player2 = _status.event.player;
        return [1, 3 - player2.getExpansions("shouliemrfz").length];
      },
      check: function(card) {
        return 10 - get.value(card) || card.name == "sha";
      },
      prompt: "【狩猎】：将任意张带有伤害标签的牌置于你的武将牌上，称之为‘矢’",
      discard: false,
      lose: false,
      content: function() {
        player.addToExpansion(cards, player, "giveAuto").gaintag.add("shouliemrfz");
      },
      group: ["shouliemrfz_use", "shouliemrfz_shasha"],
      ai: {
        order: 13,
        threaten: function() {
          var player2 = _status.event.player;
          return 1.4 + player2.getExpansions("shouliemrfz").length * 0.2;
        },
        result: {
          player: 1
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        },
        use: {
          audio: "shouliemrfz",
          enable: ["chooseToRespond", "chooseToUse"],
          filter: function(event2, player2) {
            if (player2.getExpansions("shouliemrfz").length < 1 || player2.hasSkill("shouliemrfz_ban")) return false;
            return event2.filterCard({ name: "sha" }, player2, event2);
          },
          chooseButton: {
            dialog: function(event2, player2) {
              return ui.create.dialog("狩猎", player2.getExpansions("shouliemrfz"), "hidden");
            },
            backup: function(links, player2) {
              return {
                viewAs: {
                  name: "sha",
                  nature: "stab"
                },
                cards: links,
                selectCard: -1,
                position: "x",
                filterCard: (card) => lib.skill["shouliemrfz_use_backup"].cards.includes(card),
                popname: true,
                precontent: function() {
                  player2.addTempSkill("shouliemrfz_ban", "phaseEnd");
                }
              };
            },
            prompt: function(links, player2) {
              return "【狩猎】：将" + get.translation(links.name) + "当做一张刺【杀】使用或打出";
            }
          },
          ai: {
            order: 2.95,
            respondSha: true,
            result: {
              player: 1
            },
            skillTagFilter: function(player2, tag, arg) {
              if (player2.getExpansions("shouliemrfz").length < 1) return false;
            }
          }
        },
        shasha: {
          markimage: "extension/WhichWay/image/skill/taifengmrfz.png",
          intro: {
            content: function(event2, player2) {
              return "你成为了" + get.translation(
                game.findPlayer(function(current) {
                  return current != player2 && current.hasSkill("shouliemrfz");
                })
              ) + "的猎物";
            }
          },
          audio: "shouliemrfz",
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            if (player2.getHistory("skipped").includes("phaseUse") || player2.getHistory("skipped").includes("phaseDiscard")) return false;
            return true;
          },
          check: function(event2, player2) {
            if (player2.countCards("j", function(card) {
              return get.name(card) == "lebu";
            }) > 0 && player2.countCards("h") + 2 > player2.getHandcardLimit())
              return true;
            return player2.getExpansions("shouliemrfz").length + player2.countCards("h", function(card) {
              return get.name(card) == "sha";
            }) > 2;
          },
          prompt: "【狩猎】：是否跳过出牌阶段和弃牌阶段，然后选择一名其他角色，直到你的下个回合开始时，每个其他角色的结束阶段，你都可以对其使用一张【杀】？",
          content: function() {
            "step 0";
            player.skip("phaseUse");
            player.skip("phaseDiscard");
            player.addSkill("shouliemrfz_usesha");
            player.chooseTarget(
              "【狩猎】：请选择一名其他角色",
              function(card, player2, target3) {
                return target3 != player2;
              },
              true
            ).ai = function(target3) {
              return get.attitude(_status.event.player, target3) < 0;
            };
            if (result.targets) {
              var target2 = result.targets[0];
              player.storage.shouliemrfz_shasha = target2;
              target2.addMark("shouliemrfz_shasha", false);
              player.line(target2);
            }
          },
          ai: {
            expose: 0.1
          }
        },
        rem: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            game.countPlayer(function(current) {
              if (current.hasMark("shouliemrfz_shasha")) current.removeAllmark("shouliemrfz_shasha", false);
            });
            player.removeSkill("shouliemrfz_usesha");
            delete player.storage.shouliemrfz_shasha;
          }
        },
        usesha: {
          trigger: {
            global: "phaseJieshuBegin"
          },
          direct: true,
          filter: function(event2, player2) {
            if (event2.player == player2) return false;
            return event2.player.isIn() && lib.filter.targetEnabled({ name: "sha" }, player2, event2.player) && (player2.hasSha() || _status.connectMode || player2.getExpansions("shouliemrfz").length > 0);
          },
          content: function() {
            var target2 = game.findPlayer(function(current) {
              return current != player && player.storage.shouliemrfz_shasha == current;
            });
            player.chooseToUse(
              function(card, player2, event2) {
                if (get.name(card) != "sha") return false;
                return lib.filter.filterCard.apply(this, arguments);
              },
              "【狩猎】：是否对" + get.translation(target2) + "使用一张【杀】？"
            ).set("logSkill", "shouliemrfz").set("complexSelect", true).set("filterTarget", function(card, player2, target3) {
              if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
              return lib.filter.targetEnabled.apply(this, arguments);
            }).set("sourcex", target2);
          },
          group: "shouliemrfz_rem"
        }
      }
    },
    //vvan薇薇安娜
    zhanjumrfz: {
      audio: 2,
      trigger: {
        global: "dying"
      },
      filter: function(event2, player2) {
        if (!game.checkMod({ name: "tao", isCard: true }, player2, event2.player, "unchanged", "cardSavable", player2)) return false;
        return player2.countCards("h") > 0 && event2.player.hp <= 0;
      },
      check: function(event2, player2) {
        if (get.attitude(player2, event2.player) < 0) return false;
        return player2.countCards("h", function(card) {
          return card.name == "tao";
        }) + event2.player.hp < 0;
      },
      prompt: function(event2, player2) {
        return "【盏菊】:你可以将所有手牌当作【桃】对" + get.translation(event2.player) + "使用";
      },
      content: function() {
        var cards2 = player.getCards("h");
        trigger.player.storage.zhanjumrfz = true;
        player.useCard({ name: "tao" }, cards2, trigger.player);
      },
      group: "zhanjumrfz_recast",
      subSkill: {
        recast: {
          silent: true,
          lastDo: true,
          trigger: { global: "dyingAfter" },
          filter: function(event2, player2) {
            return event2.player.storage.zhanjumrfz;
          },
          content: function() {
            "step 0";
            delete trigger.player.storage.zhanjumrfz;
            if (player.countCards("hej") == 0) event.finish();
            else {
              player.chooseCard("【盏菊】:你可以重铸一张你区域内的牌", "hej");
            }
            if (result.cards) {
              player.recast(result.cards);
              player.logSkill("zhanjumrfz");
            }
          }
        }
      }
    },
    zhuhuomrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterCard: function(card, player2) {
        return player2.canRecast(card);
      },
      selectCard: 1,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      position: "he",
      discard: false,
      lose: false,
      check: function(card) {
        return 8 - get.value(card);
      },
      content: function() {
        player.recast(cards);
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
          content: function() {
            player.addSkill("zhuhuomrfz");
            player.removeSkill("zhuhuomrfz_reget");
          }
        },
        draw: {
          direct: true,
          trigger: { player: "loseAfter" },
          filter: function(event2, player2) {
            if (!event2.cards) return false;
            return event2.getParent(2).name == "recast";
          },
          content: function() {
            "step 0";
            if (trigger.cards.length > 1) {
              var num = 0;
              for (i of trigger.cards) {
                num += get.cardNameLength(i);
              }
            } else var num = get.cardNameLength(trigger.cards[0]);
            event.num = num;
            var next = player.chooseControl("发牌", "摸牌", "cancel2");
            next.set("prompt", "是否发动【烛火】？");
            next.set("ai", function() {
              var player2 = _status.event.player;
              var count = game.countPlayer(function(current) {
                return current != player2 && get.attitude(current, player2) > 2;
              });
              if (num == 1) return 0;
              if (count - num < 0) return 1;
              return 0;
            });
            if (result.control == "cancel2") event.finish();
            else {
              if (result.index == 1) {
                player.draw(Math.min(event.num, 5));
                player.logSkill("zhuhuo2mrfz");
                player.addSkill("zhuhuomrfz_reget");
                player.removeSkill("zhuhuomrfz");
              } else {
                var num = event.num;
                var next = player.chooseTarget(true, "【烛火】:你可以选择至多" + num + "名角色，令其各摸一张牌", [1, num]);
                next.ai = function(target2) {
                  return get.attitude(target2, player) > 2;
                };
              }
            }
            if (result.targets) {
              var targets2 = result.targets;
              for (i of targets2) {
                i.draw();
                player.line(i);
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
    zhuhuo2mrfz: {
      audio: 2
    },
    yunjiaomrfz: {
      mod: {
        aiOrder: function(player2, card, num) {
          if (typeof card == "object" && !get.tag(card, "norepeat")) {
            var history = player2.getAllHistory("useCard");
            if (history.length > 0) {
              var cardx = history[history.length - 1].card;
              if (get.is.yayun(get.translation(cardx.name), get.translation(card.name))) return num + 20;
            }
          }
        }
      },
      mark: true,
      intro: {
        content: function(event2, player2) {
          var history = player2.getAllHistory("useCard");
          var evt = history[history.length - 1];
          if (!evt) return "没有使用过牌";
          return "你上一张使用的牌是：" + get.translation(evt.card.name) + "(" + get.pinyin(get.translation(evt.card.name)) + ")";
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCard" },
      filter: function(event2, player2) {
        var history = player2.getAllHistory("useCard"), index = history.indexOf(event2);
        if (index < 1) return false;
        var evt = history[index - 1];
        return get.is.yayun(get.translation(event2.card.name), get.translation(evt.card.name)) && player2.isPhaseUsing();
      },
      content: function() {
        var skills = player.getStockSkills(true, true);
        game.expandSkills(skills);
        var resetSkills = [];
        var suffixs = ["used", "round", "block", "blocker"];
        for (var skill of skills) {
          var info = get.info(skill);
          if (typeof info.usable == "number") {
            if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
              delete player.storage.counttrigger[skill];
              resetSkills.add(skill);
            }
            if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
              delete player.getStat("skill")[skill];
              resetSkills.add(skill);
            }
          }
          if (info.round && player.storage[skill + "_roundcount"]) {
            delete player.storage[skill + "_roundcount"];
            resetSkills.add(skill);
          }
          if (player.awakenedSkills.includes(skill)) {
            player.restoreSkill(skill);
            resetSkills.add(skill);
          }
          for (var suffix of suffixs) {
            if (player.hasSkill(skill + "_" + suffix)) {
              player.removeSkill(skill + "_" + suffix);
              resetSkills.add(skill);
            }
          }
        }
        if (resetSkills.length) {
          var str = "";
          for (var i2 of resetSkills) {
            str += "【" + get.translation(i2) + "】、";
          }
          game.log(player, "重置了技能", "#g" + str.slice(0, -1));
        }
      }
    },
    //纯爱 纯烬艾雅法拉 奶羊 我老婆涅😋
    lvmengmrfz: {
      init: function(player2) {
        player2.storage.lvmengmrfz = {
          beifeng: [],
          zhongzi: [],
          pimao: []
        };
      },
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.lvmengmrfz;
          var str = "北风：" + (storage["beifeng"].length > 0 ? get.translation(storage["beifeng"]) : "无") + "</br>种子：" + (storage["zhongzi"].length > 0 ? get.translation(storage["zhongzi"]) : "无") + "</br>皮毛：" + (storage["pimao"].length > 0 ? get.translation(storage["pimao"]) : "无");
          return str;
        }
      },
      audio: 4,
      forced: true,
      trigger: { global: "roundStart" },
      content: function() {
        "step 0";
        if (!player.storage.lvmengmrfz)
          player.storage.lvmengmrfz = {
            beifeng: [],
            zhongzi: [],
            pimao: []
          };
        var list = [
          ["未分配牌的类型（对话框较长，请下滑操作）", [["basic", "trick", "equip"], "vcard"]],
          ["北风（从牌堆中获得一张你手牌中没有的花色）", []],
          ["种子（此牌结算完毕后你可以将其交给一名其他角色）", []],
          ["皮毛（不可被其他角色响应）", []]
        ];
        var next = player.chooseToMove("【旅梦】：请分配牌的类型", true);
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
              for (var i2 = 0; i2 < moved.length; i2++) {
                for (var j = 0; j < moved[i2].length; j++) {
                  player2.storage.lvmengmrfz[keys[i2]].add(moved[i2][j]);
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
          filter(event2, player2) {
            return player2.storage.lvmengmrfz;
          },
          content() {
            var storage = player.storage.lvmengmrfz, cards2 = trigger.name == "gain" ? trigger.cards : player.getCards("h");
            if (trigger.name == "lvmengmrfz") {
              for (var i2 of ["beifeng_lvmengmrfz", "zhongzi_lvmengmrfz", "pimao_lvmengmrfz"]) {
                player.removeGaintag(i2);
              }
            }
            for (var key in storage) {
              for (var i2 of cards2) {
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
          filter: function(event2, player2) {
            var type = player2.storage.lvmengmrfz["beifeng"], tmp_bool = false;
            if (!type || !event2.card) return false;
            for (var i2 = 0; i2 < type.length; i2++) {
              if (get.type(event2.card, "trick") == type[i2]) {
                tmp_bool = true;
                break;
              }
            }
            var cards2 = player2.getCards("h"), list = [];
            for (var i2 of cards2) {
              list.add(get.suit(i2, player2));
            }
            return list.length < 4 && tmp_bool;
          },
          content: function() {
            var cards2 = player.getCards("h"), list = [];
            for (var i2 of cards2) {
              list.add(get.suit(i2, player));
            }
            var result2 = lib.suit.filter((item) => !list.includes(item));
            var card = get.cardPile2((card2) => {
              for (var i3 = 0; i3 < result2.length; i3++) {
                return get.suit(card2) == result2[i3];
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
          filter: function(event2, player2) {
            var type = player2.storage.lvmengmrfz["zhongzi"], tmp_bool = false;
            if (!type || !event2.card) return false;
            for (var i2 = 0; i2 < type.length; i2++) {
              if (get.type(event2.card, "trick") == type[i2]) {
                tmp_bool = true;
                break;
              }
            }
            return event2.cards.filterInD().length > 0 && tmp_bool;
          },
          content: function() {
            "step 0";
            player.chooseTarget("【旅梦】:将" + get.translation(trigger.cards) + "交给一名其他角色", function(card, player2, target2) {
              return target2 != player2;
            }).set("ai", function(target2) {
              if (target2.hasJudge("lebu")) return 0;
              var att = get.attitude(_status.event.player, target2);
              if (att < 3) return 0;
              if (target2.hasSkillTag("nogain")) att /= 10;
              if (target2.hasSha() && _status.event.sha) {
                att /= 5;
              }
              if (event.wuxie && target2.needsToDiscard(1)) {
                att /= 5;
              }
              return att / (1 + get.distance(player, target2, "absolute"));
            }).set("sha", trigger.cards[0].name == "sha").set("wuxie", trigger.cards[0].name == "wuxie");
            if (result.bool) {
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
          filter: function(event2, player2) {
            var type = player2.storage.lvmengmrfz["pimao"], tmp_bool = false;
            if (!type || !event2.card) return false;
            for (var i2 = 0; i2 < type.length; i2++) {
              if (get.type(event2.card, "trick") == type[i2]) {
                tmp_bool = true;
                break;
              }
            }
            return tmp_bool;
          },
          content: function() {
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
    rechenmrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          var evt = player2.getLastUsed();
          if (!player2.isPhaseUsing()) return "不是你的出牌阶段";
          if (!evt || !evt.card) return "本回合你未使用过牌";
          return "上一张你使用的牌的花色是：" + get.translation(get.suit(evt.card));
        }
      },
      audio: 2,
      trigger: { player: "useCard" },
      forced: true,
      firstDo: true,
      filter: function(event2, player2) {
        var evt = player2.getLastUsed(1);
        if (event2.getParent("phaseUse").player != player2) return false;
        return evt && evt.card && get.suit(event2.card) == get.suit(evt.card) && !event2.audioed;
      },
      content: function() {
        trigger.audioed = true;
      },
      mod: {
        aiOrder: function(player2, card, num) {
          if (typeof card == "object" && player2.isPhaseUsing()) {
            var evt = player2.getLastUsed();
            if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card)) {
              return num + 10;
            }
          }
        },
        cardUsable: function(card, player2) {
          var evt = player2.getLastUsed();
          if (evt && evt.card && get.suit(card) == get.suit(evt.card)) return Infinity;
        },
        targetInRange: function(card, player2, target2, now) {
          var evt = player2.getLastUsed();
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
          filter: function(event2, player2) {
            return event2.getParent("phaseUse").player === player2;
          },
          async content(event2, trigger2, player2) {
            player2.addTip("rechenmrfz_tip", `热忱 ${get.translation(get.suit(trigger2.card))}`, "phaseUseEnd");
          }
        }
      }
    },
    //塑心 阿尔图罗 2226
    qinmingmrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      filterTarget: function(card, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      selectTarget: 1,
      content: function() {
        "step 0";
        var tmp_cards = target.getCards("h");
        var cards2 = [];
        for (i of tmp_cards) {
          if (target.canRecast(i)) cards2.push(i);
        }
        target.recast(cards2);
        var cards2 = target.getCards("h");
        target.showCards(cards2, "【琴鸣】:" + get.translation(target) + "的手牌");
        var cards2 = target.getCards("h");
        var canCards = [];
        for (i of cards2) {
          if (target.canUseToAnyone(i)) canCards.push(i);
        }
        event.cards = canCards;
        if (event.cards.length > 0) {
          if (target.hasCard(event.cards[0].name, "h")) target.chooseUseTarget(true, event.cards[0], false);
          event.goto(2);
        }
      },
      ai: {
        order: 8,
        expose: 0.1,
        result: {
          target: function(player2, target2) {
            var lowAtt = game.hasPlayer((current) => {
              return current != player2 && current.inRange(target2) && get.attitude(player2, current) < 0;
            }) && get.attitude(player2, target2) < 0;
            var hightAtt = game.hasPlayer((current) => {
              return current != player2 && current.inRange(target2) && get.attitude(player2, current) < 0;
            }) && get.attitude(player2, target2) > 0;
            if (lowAtt) return -1;
            if (hightAtt) return 1;
            return 0;
          }
        }
      }
    },
    kongwomrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "drawBegin" },
      filter: function(event2, player2) {
        return event2.num > 0;
      },
      content: function() {
        var num = trigger.num;
        trigger.cancel();
        var cards2 = [], banCards = [];
        var loseCards = player.getHistory("lose", (evt) => {
          return evt.player == player;
        });
        for (var i2 of loseCards) {
          if (!i2.cards) continue;
          banCards.push(i2.cards);
        }
        while (cards2.length < num) {
          var card = get.discardPile((card2) => {
            return !cards2.includes(card2) && !banCards.includes(card2);
          });
          if (card) cards2.push(card);
          else break;
        }
        player.gain(cards2, "gain2");
      },
      group: ["kongwomrfz_get", "kongwomrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { player: "phaseUseEnd" },
          content: function() {
            if (player.storage.kongwomrfz_get) delete player.storage.kongwomrfz_get;
          }
        },
        get: {
          audio: "kongwomrfz",
          direct: true,
          trigger: { global: "loseAfter" },
          filter: function(event2, player2) {
            if (event2.player == player2 || !player2.isPhaseUsing()) return false;
            if (event2.getParent().name != "useCard") return false;
            var cards2 = event2.cards2.slice(0);
            for (var i2 = 0; i2 < cards2.length; i2++) {
              var type = get.type2(cards2[i2]);
              if (get.position(cards2[i2], true) == "o" && type != "equip") {
                return true;
              }
            }
            return true;
          },
          content: function() {
            "step 0";
            if (trigger.delay == false) game.delay();
            if (!player.storage.kongwomrfz_get) player.storage.kongwomrfz_get = [];
            var cards2 = [];
            for (var i2 = 0; i2 < trigger.cards2.length; i2++) {
              var card = trigger.cards2[i2];
              var type = get.type2(card);
              var name = player.storage.kongwomrfz_get, name2 = card.name;
              if (get.position(card, true) == "o" && type != "equip" && !name.includes(name2)) {
                cards2.push(card);
              }
            }
            if (cards2.length)
              player.chooseButton(true, ["【空我】:请选择你要获得的牌", cards2], [1, Infinity]).set("ai", (button) => {
                return cards2;
              });
            else event.finish();
            if (result.links) {
              var cards2 = result.links;
              for (i2 of cards2) {
                var name = get.name(i2);
                if (!player.storage.kongwomrfz_get.includes(name)) player.storage.kongwomrfz_get.add(name);
              }
              player.gain(cards2, "gain2");
              player.logSkill("kongwomrfz");
            }
          }
        }
      }
    },
    //赫德雷
    zhengrongmrfz: {
      init: function(player2) {
        player2.storage.zhengrongmrfz = {
          discard: false,
          losedraw: false,
          maxhp: false
        };
      },
      audio: 2,
      trigger: {
        global: "damageEnd"
      },
      filter: function(event2, player2) {
        var list = [], storage = player2.storage.zhengrongmrfz;
        if (player2.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
        if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
        if (storage["maxhp"] == false) list.push("失去体力上限");
        if (list.length == 0) return false;
        if (event2.player === void 0) return false;
        if (!event2.player.isAlive()) return false;
        return event2.player == player2 || get.distance(player2, event2.player) <= 1;
      },
      prompt: function(event2, player2) {
        if (event2.player == player2) return "【征戎】：是否选择一项并回复一点体力？";
        return "【征戎】:是否选择一项并令" + get.translation(event2.player) + "回复一点体力？";
      },
      check: function(event2, player2) {
        if (get.attitude(event2.player, player2) < 0) return false;
        return true;
      },
      content: function() {
        "step 0";
        var list = [], storage = player.storage.zhengrongmrfz;
        if (player.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
        if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
        if (storage["maxhp"] == false) list.push("失去体力上限");
        player.chooseControl(list).set("ai", function() {
          return 0;
        }).set("prompt", "【征戎】:请选择一项");
        if (result.control) {
          var control = result.control;
          game.log(control);
          if (control == "弃牌") {
            player.chooseToDiscard("he", true, "【征戎】:请弃置一张牌");
            player.storage.zhengrongmrfz["discard"] = true;
          }
          if (control == "摸牌阶段摸牌数-1") {
            player.addMark("zhengrongmrfz_losedraw", false);
            player.addTempSkill("zhengrongmrfz_losedraw", {
              player: "phaseDrawAfter"
            });
            player.storage.zhengrongmrfz["losedraw"] = true;
          }
          if (control == "失去体力上限") {
            player.loseMaxHp();
            player.storage.zhengrongmrfz["maxhp"] = true;
          }
          trigger.player.recover();
        }
      },
      group: ["zhengrongmrfz_rec", "zhengrongmrfz_draw"],
      subSkill: {
        draw: {
          audio: 2,
          firstDo: true,
          trigger: { player: "phaseBegin" },
          filter: function(event2, player2) {
            var allGone = Object.values(player2.storage.zhengrongmrfz).every(function(value) {
              return value === true;
            });
            if (player2.storage.zhengrongmrfz === void 0) return false;
            return allGone;
          },
          content: function() {
            player.drawTo(player.maxHp);
          }
        },
        rec: {
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            player.storage.zhengrongmrfz = {
              discard: false,
              losedraw: false,
              maxhp: false
            };
          }
        },
        losedraw: {
          silent: true,
          charlotte: true,
          lastDo: true,
          intro: {
            content: "下个摸牌阶段摸牌数-#"
          },
          onremove: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return event2.num > 0;
          },
          content: function() {
            trigger.num -= player.countMark("zhengrongmrfz_losedraw");
          }
        }
      },
      ai: {
        expose: 0.1,
        threaten: 0.8
      }
    },
    siyanmrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (event2.targets.length > 1) return false;
        if (event2.targets[0] == player2) return false;
        if (!event2.card || event2.card.name != "sha") return false;
        var history = event2.targets[0].getHistory("damage");
        for (var i2 = 0; i2 < history.length; i2++) {
          if (!history[i2].source) continue;
          if (history[i2].source == player2) return true;
        }
        var seatNum = event2.targets[0].getSeatNum();
        if (seatNum in player2.storage.siyanmrfz_tol && player2.storage.siyanmrfz_tol[seatNum] === true) return true;
      },
      check: function(event2, player2) {
        if (get.attitude(event2.targets[0], player2) > 0) return false;
        return player2.hp > 1;
      },
      prompt: function(event2, player2) {
        return "【死烟】:是否失去一点体力并令" + get.translation(event2.targets[0]) + "选择一项？";
      },
      content: function() {
        "step 0";
        player.addTempSkill("siyanmrfz_rec", {
          player: "damageAfter"
        });
        player.storage.siyanmrfz_rec = {
          card: trigger.card
        };
        var target2 = trigger.targets[0], list = ["无法响应" + get.translation(player) + "使用的【杀】"];
        if (target2.countCards("h") > 1) list.push("弃置两张手牌");
        target2.loseHp();
        player.loseHp();
        if (list.length < 2 && target2.isAlive()) {
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current == target2;
            })
          );
          game.log(target2, "选择了无法响应", player, "使用的【杀】");
          event.finish();
        } else if (target2.isAlive()) {
          target2.chooseControl().set("choiceList", list).set("prompt", "【死烟】:请选择一项").set("ai", function() {
            var player2 = _status.event.player;
            if (player2.countCards("h") < 3) return 0;
            if (!player2.hasShan()) return 0;
            if (player2.hp == 1 && player2.countCards("h", (card) => {
              return get.name(card) == "tao" || get.name(card) == "jiu";
            }) > 0 && player2.countCards("h") < 3)
              return 0;
            return 1;
          });
        } else event.finish();
        if (result.control) {
          var target2 = trigger.targets[0];
          if (result.index == 1) {
            game.log(get.translation(target2), "选择了弃置两张手牌");
            target2.chooseToDiscard("h", true, 2);
          } else {
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current == target2;
              })
            );
            game.log(target2, "选择了无法响应", player, "使用的【杀】");
          }
        }
      },
      group: ["siyanmrfz_tol", "siyanmrfz_clear"],
      subSkill: {
        rec: {
          onremove: function(player2) {
            delete player2.storage.siyanmrfz_rec;
          },
          trigger: {
            source: "damageEnd"
          },
          filter: function(event2, player2) {
            var info = player2.storage.siyanmrfz_rec;
            return event2.card && event2.card == info.card;
          },
          silent: true,
          popup: false,
          forced: true,
          charlotte: true,
          firstDo: true,
          content: function() {
            if (get.suit(trigger.card) == "diamond") player.recover();
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { global: "phaseBegin" },
          filter: function(event2, player2) {
            return event2.player != player2;
          },
          content: function() {
            var seatNum = trigger.player.getSeatNum();
            player.storage.siyanmrfz_tol[seatNum] = false;
          }
        },
        tol: {
          init: function(player2) {
            player2.storage.siyanmrfz_tol = {};
            for (var i2 = 0; i2 < game.players.length; i2++) {
              if (game.players[i2] == player2) continue;
              player2.storage.siyanmrfz_tol[i2 + 1] = false;
            }
          },
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0 && player2.isAlive();
          },
          content: function() {
            var seatNum = trigger.source.getSeatNum();
            if (seatNum in player.storage.siyanmrfz_tol && player.storage.siyanmrfz_tol[seatNum] === false) {
              player.storage.siyanmrfz_tol[seatNum] = true;
            }
          }
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          var seatNum = arg.target.getSeatNum(arg.target);
          if (!seatNum in player2.storage.siyanmrfz_tol || player2.storage.siyanmrfz_tol[seatNum] === false) return false;
          if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) return false;
        }
      }
    },
    //止颂
    kuxiumrfz: {
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num += player2.getCards("j").length;
        }
      },
      audio: 2,
      enable: "phaseUse",
      filter: function(event2, player2) {
        var cards2 = [];
        if (player2.countCards("he") < 1) return false;
        for (var i2 of lib.inpile) {
          if (get.type(i2) == "delay") cards2.push(i2);
        }
        for (var name of cards2) {
          if (player2.canAddJudge({ name })) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var cards2 = [];
          for (var i2 of lib.inpile) {
            if (get.type(i2) == "delay") cards2.push(i2);
          }
          var vcards = [];
          for (var name of cards2) {
            if (player2.canAddJudge({ name })) vcards.push(["延时锦囊", "", name]);
          }
          var dialog = ui.create.dialog("苦修", [vcards, "vcard"], "hidden");
          return dialog;
        },
        check: function(button) {
          var name = button.link[2];
          switch (name) {
            case "lebu":
              return 1;
            case "bingliang":
              return 2;
            case "shandian":
              return 3;
            default:
              return 1.5;
          }
        },
        backup: function(links, player2) {
          return {
            audio: "kuxiumrfz",
            filterCard: function(card, player3, event2) {
              return player3.canAddJudge({
                name: links[0][2],
                cards: [card]
              });
            },
            selectTarget: -1,
            filterTarget: function(card, player3, target2) {
              return player3 == target2;
            },
            check(card) {
              return 8 - get.value(card);
            },
            viewAs: {
              name: links[0][2]
            },
            position: "he",
            popname: true,
            onuse: function(links2, player3) {
              if (!links2.cards) return;
              var next = game.createEvent("kuxiumrfz_draw", false, _status.event.getParent());
              next.cards = links2.cards;
              next.player = player3;
              next.setContent(function() {
                let num = player3.getCards("j").length;
                if (num > 0) player3.draw(num);
              });
            },
            ai: {
              result: {
                player: 1
              }
            }
          };
        },
        prompt: function(links, player2) {
          return "【苦修】：请选择一张牌将其当做一张【" + get.translation(links[0][2]) + "】对自己使用";
        }
      },
      ai: {
        order: 8,
        result: {
          player: 1
        }
      }
    },
    lirenmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.countCards("j") > 0;
      },
      check: function(event2, player2) {
        var cards2 = player2.getCards("j");
        if (cards2.length == 1 && cards2[0] == "shandian") return false;
        return player2.hp > 1;
      },
      content: function() {
        var num = player.getCards("j").length;
        player.discardPlayerCard(player, num, "j", true);
        player.loseHp();
      }
    },
    //锏
    /** @type { Skill } */
    weiyamrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      onremove: true,
      mod: {
        targetInRange(card, player2, target2) {
          if (player2.getStorage("weiyamrfz").includes(target2)) return true;
        }
      },
      audio: 2,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        return event2.player != player2 && !event2.player.hasSkill("weiyamrfz_ban") && event2.player.isAlive();
      },
      prompt: function(event2, player2) {
        return "【威压】:是否令" + get.translation(event2.player) + "下个出牌阶段不能使用带有伤害类标签的牌？";
      },
      check: function(event2, player2) {
        return get.attitude(event2.player, player2) < 0;
      },
      content: async function(event2, trigger2, player2) {
        trigger2.player.addTempSkill("weiyamrfz_ban", {
          player: "phaseUseEnd"
        });
        player2.storage.weiyamrfz ??= [];
        player2.storage.weiyamrfz.add(trigger2.player);
      },
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          marktext: "战栗",
          intro: {
            content: "出牌阶段不能使用带有伤害类标签的牌"
          },
          mod: {
            cardEnabled: function(card, player2) {
              if (get.tag(card, "damage") > 0 && player2.isPhaseUsing()) return false;
            }
          }
        }
      },
      ai: {
        expose: 0.2,
        threaten: 1.1,
        unequip: true,
        skillTagFilter(player2, tag, arg) {
          return player2.getStorage("weiyamrfz").includes(arg.target);
        }
      }
    },
    /** @type { Skill } */
    zhiwumrfz: {
      mod: {
        cardname: function(card, player2) {
          if (card.cardnameCheck) return card.name;
          card.cardnameCheck = true;
          let result2;
          if (get.type(card) == "trick") result2 = "sha";
          else result2 = card.name;
          delete card.cardnameCheck;
          return result2;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (event2.targets.length == 0) return false;
        return event2.card.name == "sha" && get.color(event2.card) != void 0;
      },
      content: async function(event2, trigger2, player2) {
        var targets2 = trigger2.targets;
        for (var i2 = 0; i2 < targets2.length; i2++) {
          if (targets2[i2].hasSkill("zhiwumrfz_ban")) continue;
          targets2[i2].addTempSkill("zhiwumrfz_ban");
          targets2[i2].storage.zhiwumrfz_ban = {
            player: player2,
            color: get.color(trigger2.card)
          };
          player2.line(targets2[i2]);
        }
      },
      group: ["zhiwumrfz_count", "zhiwumrfz_draw"],
      subSkill: {
        draw: {
          forced: true,
          audio: "zhiwumrfz",
          trigger: { source: "damageEnd" },
          filter(event2, player2) {
            return player2.getRoundHistory("sourceDamage", (evt) => evt.player === event2.player).length === 1;
          },
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        },
        count: {
          direct: true,
          trigger: { player: "useCard1" },
          filter: function(event2, player2) {
            if (!player2.isPhaseUsing()) return false;
            if (!event2.card || event2.card.name != "sha") return false;
            if (event2.addCount === false) return false;
            return event2.card.cards.length > 1 || event2.card.cards.length == 1 && event2.cards[0].name != event2.card.name;
          },
          content: async function(event2, trigger2, player2) {
            trigger2.addCount = false;
            if (player2.stat[player2.stat.length - 1].card.sha > 0) {
              player2.stat[player2.stat.length - 1].card.sha--;
            }
          }
        },
        ban: {
          onremove: true,
          mod: {
            cardEnabled: function(card, player2) {
              if (get.color(card) == player2.storage.zhiwumrfz_ban["color"]) return false;
            }
          },
          silent: true,
          charlotte: true,
          trigger: { global: "useCardAfter" },
          filter: function(event2, player2) {
            return event2.card.name == "sha" && event2.player == player2.storage.zhiwumrfz_ban["player"];
          },
          content: function() {
            delete player.storage.zhiwumrfz_ban;
            player.removeSkill("zhiwumrfz_ban");
          }
        }
      }
    },
    //莱伊
    shaobanmrfz: {
      mod: {
        inRange: function(from, to) {
          if (to.hasCard((card) => {
            return card.name == "shadishoumrfz";
          }, "e"))
            return true;
        }
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      derivation: ["shadishoumrfz"],
      filter: function(event2, player2) {
        return player2.countCards("he") > 0 && !game.hasPlayer((current) => {
          return current.hasCard((card) => {
            return card.name == "shadishoumrfz";
          }, "e");
        }) && game.hasPlayer((current) => {
          return current != player2 && !current.isDisabled(2);
        });
      },
      filterCard: true,
      filterTarget: function(card, player2, target2) {
        return target2 != player2 && !target2.isDisabled(2);
      },
      check: function(card) {
        return 6 - get.value(card);
      },
      content: function() {
        var card = game.createCard("shadishoumrfz", "heart", 13);
        target.$gain2(card);
        game.delayx();
        target.equip(card);
      },
      ai: {
        order: 5,
        result: {
          target: -1
        }
      },
      group: "shaobanmrfz_dam",
      subSkill: {
        ban: {
          charlotte: true
        },
        dam: {
          direct: true,
          trigger: { source: "damageBegin" },
          filter: function(event2, player2) {
            if (player2.hasSkill("shaobanmrfz_ban")) return false;
            return event2.player != player2 && event2.player.hasCard((card) => {
              return card.name == "shadishoumrfz";
            }, "e");
          },
          content: function() {
            trigger.num++;
            player.logSkill("shaobanmrfz", trigger.player);
            player.addTempSkill("shaobanmrfz_ban", {
              global: "phaseEnd"
            });
          }
        }
      }
    },
    tankuangmrfz: {
      mark: true,
      intro: {
        content: "剩余#次"
      },
      onremove: true,
      audio: 2,
      trigger: { player: "useCardAfter" },
      getCountInRanger(player2) {
        var num = 0, players = game.filterPlayer();
        for (var i2 = 0; i2 < players.length; i2++) {
          if (player2.inRange(players[i2])) {
            num++;
          }
        }
        return num;
      },
      filter: function(event2, player2) {
        return player2.countMark("tankuangmrfz") > 0;
      },
      check: function(event2, player2) {
        if (player2.hp < 2) return Math.random() > 0.4;
        return true;
      },
      content: function() {
        var card = game.cardsGotoOrdering(get.cards(1)).cards[0], num = 0;
        player.showCards(card, get.translation(player) + "展示了牌堆顶一张牌");
        if (get.color(card) == get.color(trigger.card)) num++;
        if (get.type(card, "trick") == get.type(trigger.card, "trick")) num++;
        if (get.number(card) >= get.number(trigger.card)) num++;
        if (num > 0) {
          player.draw(num);
          if (num == 3) player.recoverTo(player.maxHp);
        } else {
          player.loseHp();
          player.removeSkill("tankuangmrfz");
          player.addTempSkill("tankuangmrfz_re3", {
            global: "phaseBegin"
          });
        }
        player.removeMark("tankuangmrfz", false);
      },
      group: ["tankuangmrfz_re", "tankuangmrfz_re2"],
      subSkill: {
        re: {
          charlotte: true,
          silent: true,
          trigger: { global: "phaseBegin" },
          content: function() {
            var num = Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player));
            player.removeMark("tankuangmrfz", player.countMark("tankuangmrfz"), false);
            player.addMark("tankuangmrfz", num, false);
          }
        },
        re2: {
          init: function(player2) {
            player2.storage.tankuangmrfz_re2 = lib.skill.tankuangmrfz.getCountInRanger(player2);
          },
          charlotte: true,
          silent: true,
          trigger: {
            player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
          },
          filter: function(event2, player2) {
            return player2.storage.tankuangmrfz_re2 - Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player2)) != 0;
          },
          content: function() {
            if (!player.storage.tankuangmrfz_re2) player.storage.tankuangmrfz_re2 = 0;
            var now = Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player));
            var last = player.storage.tankuangmrfz_re2;
            var num = now - last;
            if (num > 0) {
              player.addMark("tankuangmrfz", num, false);
            } else player.removeMark("tankuangmrfz", Math.abs(num), false);
            player.storage.tankuangmrfz_re2 = now;
          }
        },
        re3: {
          charlotte: true,
          silent: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            player.addSkill("tankuangmrfz");
          }
        }
      }
    },
    //新斥罪
    newzhidianmrfz: {
      getSkillsList: function(event2, player2) {
        var list = [];
        var listm = [];
        var listv = [];
        if (player2.name1 != void 0) listm = lib.character[player2.name1][3];
        else listm = lib.character[player2.name][3];
        if (player2.name2 != void 0) listv = lib.character[player2.name2][3];
        listm = listm.concat(listv);
        var func = function(skill) {
          var info = get.info(skill);
          if (!info || info.charlotte) return false;
          return true;
        };
        for (var i2 = 0; i2 < listm.length; i2++) {
          if (func(listm[i2])) list.add(listm[i2]);
        }
        if (player2.disabledSkills) {
          for (var key in player2.disabledSkills) {
            list.remove(key);
          }
        }
        return list;
      },
      init: (player2, skill) => {
        player2.storage[skill] = [];
      },
      audio: "zhidianmrfz",
      enable: "phaseUse",
      usable: 114514,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      filterTarget: function(card, player2, target2) {
        return target2 != player2 && !player2.storage.newzhidianmrfz.includes(target2);
      },
      check: function(card) {
        return 7 - get.value(card);
      },
      position: "he",
      filterCard: true,
      delay: false,
      lose: false,
      discard: false,
      async content(event2, trigger2, player2) {
        let card = event2.cards, target2 = event2.target;
        player2.give(card, target2);
        let list = [], list2 = [];
        if (target2.countCards("he") > 1) {
          list.add(`弃置三张牌，${get.translation(player2)}获得其中一张牌`);
          list2.add("选项一");
        } else list.add(`<span style="opacity:0.5">弃置三张牌，${get.translation(player2)}获得其中一张牌（不可选:牌数少于2）</span>`);
        list.add(`受到一点伤害且令${get.translation(player2)}选择让你一个技能失效`);
        list2.add("选项二");
        if (!target2.isLinked()) {
          list.add(`横置武将牌，${get.translation(player2)}本回合不能再对你使用此技能`);
          list2.add("选项三");
        } else
          list.add(`<span style="opacity:0.5">横置武将牌，${get.translation(player2)}本回合不能再对你使用此技能（不可选:已被横置）</span>`);
        var { control } = await target2.chooseControl(list2).set("choiceList", list).set("ai", function() {
          var player3 = _status.event.target, list3 = _status.event.list, hs = player3.getCards("he", (card2) => {
            return get.value(card2) < 8;
          });
          if (player3.hp < 2) list3.remove("选项二");
          if (player3.countCards("he") < 4 || hs.length < 3) list3.remove("选项一");
          if (list3.length == 0) list3.push("选项二");
          return list3[0];
        }).set("target", event2.target).set("list", list2).forResult();
        if (!control) return;
        switch (control) {
          case "选项一":
            const { cards: cards2 } = await target2.chooseToDiscard(true, "he", 3, "请弃置三张牌").forResult();
            if (!cards2) return;
            for (var i2 of cards2) {
              if (get.position(i2) != "d") cards2.remove(i2);
            }
            if (cards2.length == 0) return;
            const { links } = cards2.length == 1 ? { links: cards2 } : await player2.chooseCardButton(cards2, "【执典】:请选择获得一张牌", true, 1).forResult();
            player2.gain(links[0], "gain2");
            break;
          case "选项二":
            let skillList = lib.skill.newzhidianmrfz.getSkillsList(event2, target2);
            if (skillList.length > 0) {
              var { control } = await player2.chooseControl(skillList).set("prompt", `选择${get.translation(target2)}武将牌上的一个技能并令其失效`).forResult();
              target2.disableSkill("newzhidianmrfz_disable", control);
              target2.addTempSkill("newzhidianmrfz_disable", {
                player: "phaseAfter"
              });
              game.log(player2, "选择了", target2, "的技能", "#g【" + get.translation(control) + "】");
            }
            target2.damage();
            break;
          case "选项三":
            target2.link(true);
            if (!player2.storage.newzhidianmrfz) player2.storage.newzhidianmrfz = [];
            player2.storage.newzhidianmrfz.add(target2);
            break;
        }
      },
      group: ["newzhidianmrfz_count", "newzhidianmrfz_clear"],
      ai: {
        threaten: 1.2,
        order: 8,
        result: {
          target: function(player2, target2) {
            var att = get.attitude(player2, target2);
            if (att < 0) {
              return -(1 + target2.countCards("he") * 0.1);
            }
          }
        }
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseAfter" },
          content: function() {
            player.storage.newzhidianmrfz = [];
          }
        },
        count: {
          silent: true,
          charlotte: true,
          trigger: {
            global: "phaseBefore",
            player: ["changeHp", "enterGame"]
          },
          filter(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          content: function() {
            lib.skill.newzhidianmrfz.usable = player.hp;
          }
        },
        disable: {
          onremove(player2, skill) {
            player2.enableSkill(skill);
          },
          locked: true,
          mark: true,
          charlotte: true,
          intro: {
            content(storage, player2, skill) {
              var list = [];
              for (var i2 in player2.disabledSkills) {
                if (player2.disabledSkills[i2].includes(skill)) list.push(i2);
              }
              if (list.length) {
                var str = "失效技能：";
                for (var i2 = 0; i2 < list.length; i2++) {
                  if (lib.translate[list[i2] + "_info"]) str += get.translation(list[i2]) + "、";
                }
                return str.slice(0, str.length - 1);
              }
            }
          }
        }
      }
    },
    newpijimrfz: {
      audio: "pijimrfz",
      trigger: {
        player: "useCard"
      },
      forced: true,
      locked: false,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.isLinked();
        });
      },
      content: function() {
        trigger.directHit.addArray(
          game.filterPlayer((current) => {
            return current != player && current.isLinked();
          })
        );
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          return arg.target.isLinked();
        }
      },
      group: "newpijimrfz_damage",
      subSkill: {
        damage: {
          audio: false,
          direct: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.player.isLinked() && event2.getParent().name != "newpijimrfz_damage";
          },
          content: function() {
            player.logSkill("newpijimrfz");
            for (var i2 of game.players) {
              if (player == i2 || !i2.isLinked()) continue;
              player.line(i2);
              i2.damage();
            }
          }
        }
      }
    },
    //新塞雷娅
    newgaihuamrfz: {
      audio: "gaihuamrfz",
      enable: ["chooseToUse", "chooseToRespond"],
      hiddenCard: function(player2, name) {
        if (lib.inpile.includes(name) && !player2.hasSkill("newgaihuamrfz_ban") && get.type(name) == "basic") return true;
      },
      filter: function(event2, player2) {
        if (event2.responded || event2.newgaihuamrfz || player2.hasSkill("newgaihuamrfz_ban")) return false;
        for (var i2 of lib.inpile) {
          if (get.type(i2) == "basic" && event2.filterCard({ name: i2 }, player2, event2)) return true;
        }
        return false;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        var evt = event2.getParent(2);
        player2.storage.newgaihuamrfz_clear;
        evt.set("newgaihuamrfz", true);
        let list = ["牌堆顶三张牌"], list2 = ["选项一"], hd = [];
        if (ui.discardPile.childNodes.length > 2) {
          list.add("弃牌堆顶三张牌");
          list2.add("选项二");
        } else list.add('<span style="opacity:0.5">弃牌堆顶三张牌(不可选:弃牌堆牌数小于3）</span>');
        for (var i2 of game.players) {
          if (get.distance(player2, i2) > 1) continue;
          if (i2.countCards("h") < 1) continue;
          if (i2 == player2) continue;
          hd = hd.concat(i2.getCards("h"));
        }
        if (hd.length > 0) {
          list.add("与你距离不大于1的其他角色的手牌");
          list2.add("选项三");
        } else list.add('<span style="opacity:0.5">与你距离不大于1的其他角色的手牌(不可选:你距离不大于1的其他角色没有手牌）</span>');
        const { control } = await player2.chooseControl(list2, "cancel2").set("choiceList", list).set("ai", function() {
          var list3 = _status.event.list, player3 = _status.event.player, hd2 = _status.event.hd;
          if (game.countPlayer((current) => {
            return player3 != current && get.distance(player3, current) <= 1 && get.distance(player3, current) < 0;
          }) < 1 || hd2.length < 3)
            list3.remove("选项三");
          if (list3.length == 0) return "cancel2";
          return list3.randomGet();
        }).set("list", list2).set("hd", hd).forResult();
        if (!control || control == "cancel2") {
          evt.goto(0);
          return;
        }
        var cards2 = [];
        switch (control) {
          case "选项一":
            cards2 = get.cards(3, true);
            break;
          case "选项二":
            var num = 3;
            while (num--) {
              if (ui.discardPile.hasChildNodes() == false) {
                break;
              }
              var cardx = ui.discardPile.removeChild(ui.discardPile.firstChild);
              cardx.original = "d";
              cards2.push(cardx);
            }
            for (let i3 = cards2.length - 1; i3 >= 0; i3--) {
              ui.discardPile.insertBefore(cards2[i3], ui.discardPile.firstChild);
            }
            break;
          case "选项三":
            cards2 = hd;
            break;
        }
        const { links } = await player2.chooseButton(["【钙化】:选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards2]).set("filterButton", function(button) {
          _status.event.player;
          _status.event;
          return _status.event.cards.includes(button.link);
        }).set(
          "cards",
          cards2.filter(function(card2) {
            if (get.type(card2) != "basic") return false;
            return evt.filterCard(card2, evt.player, evt);
          })
        ).set("ai", function(button) {
          var evt2 = _status.event.getParent(3);
          if (evt2 && evt2.ai) {
            var tmp = _status.event;
            _status.event = evt2;
            var result2 = (evt2.ai || event2.ai1)(button.link, _status.event.player, evt2);
            _status.event = tmp;
            return result2;
          }
          return 1;
        }).forResult();
        if (!links) {
          evt.goto(0);
          return;
        }
        var card = links[0], name = links[0].name;
        if (_status.currentPhase == player2)
          player2.addTempSkill("newgaihuamrfz_ban", {
            global: "phaseBeginStart"
          });
        if (evt.name == "chooseToUse") {
          game.broadcastAll(
            function(result2, name2) {
              lib.skill.newgaihuamrfz_backup.viewAs = {
                name: name2,
                cards: [result2],
                isCard: true
              };
            },
            card,
            name
          );
          var evt = event2.getParent(2);
          evt.set("_backupevent", "newgaihuamrfz_backup");
          evt.set("openskilldialog", "请选择" + get.translation(card) + "的目标");
          evt.backup("newgaihuamrfz_backup");
          player2.logSkill("gaihuamrfz");
        } else {
          delete evt.result.skill;
          delete evt.result.used;
          evt.result.card = get.autoViewAs(card);
          evt.result.cards = [card];
          player2.logSkill("gaihuamrfz");
          evt.redo();
          return;
        }
        evt.goto(0);
      },
      ai: {
        effect: {
          target: function(card, player2, target2, effect) {
            if (get.tag(card, "respondShan")) return 0.7;
            if (get.tag(card, "respondSha")) return 0.7;
          }
        },
        order: 11,
        respondShan: true,
        respondSha: true,
        result: {
          player: function(player2) {
            if (_status.event.dying) return get.attitude(player2, _status.event.dying);
            return 1;
          }
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    newgaihuamrfz_backup: {
      sourceSkill: "newgaihuamrfz",
      precontent: function() {
        delete event.result.skill;
        var name = event.result.card.name, cards2 = event.result.card.cards.slice(0);
        event.result.cards = cards2;
        var rcard = cards2[0], card;
        if (rcard.name == name) card = get.autoViewAs(rcard);
        else card = get.autoViewAs({ name, isCard: true });
        event.result.card = card;
      },
      filterCard: function() {
        return false;
      },
      selectCard: -1
    },
    panshimrfz: {
      mod: {
        targetEnabled: function(card, player2, target2) {
          for (var i2 of game.players) {
            if (i2.getHistory("useCard").length > 0) return;
          }
          return false;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCard" },
      filter: function(event2, player2) {
        if (player2.getHistory("useCard").length > 1) return false;
        return event2.card && (get.type2(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name));
      },
      content: function() {
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player;
          })
        );
      }
    },
    //新玛恩纳
    lianmangmrfz: {
      audio: 2,
      trigger: {
        target: "useCardToTargeted"
      },
      filter: function(event2, player2) {
        return player2.countCards("h") > 0 && event2.card && event2.player != player2 && !player2.hasSkill("zhanmangmrfz_ban");
      },
      banHs: function(event2, trigger2, player2) {
        player2.addTempSkill("lianmangmrfz_ban");
        _status.tmpCard = trigger2.card;
        player2.when({
          global: "useCardAfter",
          player: "dying"
        }).filter((event3, player3) => {
          return event3.card == _status.tmpCard || event3.name == "dying";
        }).then(() => {
          player2.removeSkill("lianmangmrfz_ban");
          delete _status.tmpCard;
        });
      },
      forced: true,
      async content(event2, trigger2, player2) {
        let num = get.cardNameLength(trigger2.card);
        const { cards: cards2 } = await player2.chooseCard(`【敛芒】:请重铸至多${get.cnNumber(num)}张牌`, [0, num], true).set("ai", function(card) {
          if (get.tag(card, "damage")) return 10 - get.value(card);
          return 6 - get.value(card);
        }).set("filterCard", (card) => player2.canRecast(card)).forResult();
        if (!cards2 || cards2.length == 0) {
          lib.skill.lianmangmrfz.banHs(event2, trigger2, player2);
          return;
        }
        let hs = player2.getCards("h");
        await player2.recast(cards2, void 0, void 0);
        if (cards2.filter((i2) => get.tag(i2, "damage")).length > 0) player2.draw();
        if (hs.isSubset(cards2)) trigger2.player.damage();
        lib.skill.lianmangmrfz.banHs(event2, trigger2, player2);
      },
      group: ["lianmangmrfz_cancel"],
      subSkill: {
        ban: {
          charlotte: true,
          mod: {
            cardEnabled2: function(card, player2) {
              if (get.position(card) == "h") return false;
            }
          }
        },
        cancel: {
          forced: true,
          audio: "lianmangmrfz",
          trigger: { source: "damageBefore" },
          filter: function(event2, player2) {
            return !player2.hasSkill("zhanmangmrfz_ban");
          },
          async content(event2, trigger2, player2) {
            let num = trigger2.num;
            trigger2.cancel();
            let list = ["选项一"];
            let chooseList = [`摸${get.cnNumber(num)}张牌`, `回复${get.cnNumber(num)}点体力`];
            if (player2.getDamagedHp() > 0) {
              list.push("选项二");
            } else chooseList[1] = '<span style="opacity:0.5">' + chooseList[2] + "（不可选：已损失体力值为零）</span>";
            const { control } = list.length == 1 ? player2.draw(num) : await player2.chooseControl(list).set("choiceList", chooseList).set("prompt", "【敛芒】:请选择一项").set("ai", function() {
              var list2 = _status.event.list;
              if (list2.includes("选项二")) return "选项二";
              return "选项一";
            }).set("list", list).forResult();
            if (!control) return;
            switch (control) {
              case "选项一":
                player2.draw(num);
                break;
              case "选项二":
                player2.recover(num);
                break;
            }
          }
        }
      },
      ai: {
        threaten: 0.8,
        effect: {
          target: function(card, player2, target2) {
            if (get.tag(card, "damage")) return [0, -999999];
          }
        }
      }
    },
    zhanmangmrfz: {
      audio: 2,
      trigger: { player: "phaseUseBegin" },
      filter: function(event2, player2) {
        return player2.countCards("h") > player2.getHandcardLimit();
      },
      prompt: function(event2, player2) {
        var num = Math.min(player2.maxHp, player2.countCards("h") - player2.getHandcardLimit());
        return `【展芒】:你可以摸${get.cnNumber(num)}张牌、本回合使用【杀】的次数+${num}，且本回合【敛芒】失效`;
      },
      content() {
        var num = Math.min(player.maxHp, player.countCards("h") - player.getHandcardLimit());
        player.draw(num);
        player.addMark("zhanmangmrfz_add", num, false);
        player.addTempSkill("zhanmangmrfz_add", {
          player: "phaseEnd"
        });
        player.addTempSkill("zhanmangmrfz_ban", {
          player: "phaseEnd"
        });
      },
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          intro: {
            content(event2, player2) {
              return `·【敛芒】失效<br>·本回合使用【杀】的次数+${player2.countMark("zhanmangmrfz_add")}`;
            }
          }
        },
        add: {
          charlotte: true,
          onremove: true,
          mod: {
            cardUsable: function(card, player2, num) {
              var count = player2.countMark("zhanmangmrfz_add");
              if (card.name == "sha") return num + count;
            }
          }
        }
      },
      ai: {
        threaten: function() {
          var player2 = _status.event.player, num = player2.countCards("h") - player2.getHandcardLimit();
          return 1 + Math.max(0.2, num * 0.2);
        }
      }
    },
    xingyimrfz: {
      audio: 2,
      trigger: { global: "phaseJieshuBegin" },
      getDamagedTarget: function(event2, player2) {
        let list = [];
        for (var i2 of game.players) {
          if (player2 == i2) continue;
          let history = i2.getHistory("damage");
          for (var j = 0; j < history.length; j++) {
            let damaged = history[j].player;
            list.push(damaged);
          }
        }
        return list;
      },
      filter: function(event2, player2) {
        var list = lib.skill.xingyimrfz.getDamagedTarget(event2, player2);
        return list.length > 0 && _status.currentPhase != player2;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let list = lib.skill.xingyimrfz.getDamagedTarget(event2, player2);
        const { targets: targets2 } = await player2.chooseTarget("【行义】:你可以受到一点伤害并令一名本回合受到过伤害的其他角色回复一点体力").set("filterTarget", function(card, player3, target2) {
          var list2 = _status.event.list;
          return list2.includes(target2);
        }).set("ai", function(target2) {
          var player3 = _status.event.player;
          if (player3.hp < 2 && player3.countCards("h", "tao") + player3.countCards("h", "jiu") < 1) return 0;
          return get.attitude(target2, player3) > 0;
        }).set("list", list).forResult();
        if (!targets2) return;
        targets2[0].recover();
        player2.damage("nosource");
        player2.logSkill("xingyimrfz", targets2[0]);
      }
    },
    //左乐
    qikumrfz: {
      audio: 2,
      trigger: { player: "gainBegin" },
      filter: function(event2, player2) {
        return player2.countCards("h") == 0 && event2.getParent(2).name != "qikumrfz";
      },
      forced: true,
      content() {
        var num = player.maxHp - trigger.cards.length;
        player.draw(num);
      }
    },
    /** @type { Skill } */
    bingzhumrfz: {
      marktext: "司",
      intro: {
        name: "司",
        markcount: "expansion",
        content: "expansion"
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        var suit = [];
        for (var i2 of player2.getCards("h")) {
          if (suit.includes(get.suit(i2))) continue;
          suit.push(get.suit(i2));
        }
        if (suit.length == 0) return;
        const { control } = await player2.chooseControl(suit, "cancel2").set("prompt", "【秉烛】:请选择一种花色").set("ai", function() {
          var suit2 = _status.event.suit;
          return suit2.randomGet();
        }).set("suit", suit).forResult();
        if (!control || control == "cancel2") {
          if (control == "cancel2") {
            player2.setSkillCount("bingzhumrfz", -1);
          }
          return;
        }
        var hs = player2.getCards("h", (card) => {
          return get.suit(card) == control;
        });
        if (hs.length == 0) return;
        let list = [];
        while (hs.length) {
          const { cards: cards2 } = await player2.chooseCard(true, `【秉烛】:请分配第${get.cnNumber(list.length + 1)}组手牌`).set("selectCard", function() {
            var player3 = _status.event.player;
            var num = game.countPlayer((current) => current != player3) - (list.length + 1) > 0 ? 1 : hs.length;
            return [num, Infinity];
          }).set("ai", function(card) {
            if (!ui.selected.cards) return 1;
            if (game.countPlayer((current) => {
              return current != player2 && get.attitude(current, player2) < 0;
            }) < 2)
              return 1;
            for (var i3 of ui.selected.cards) {
              if (get.suit(i3) == get.suit(card)) return [-1, -1, 1, 1].randomGet();
              return 1;
            }
          }).set("filterCard", (card) => {
            var hs2 = _status.event.hs;
            return hs2.includes(card);
          }).set("hs", hs).forResult();
          if (!cards2) continue;
          list.push([cards2]);
          hs.removeArray(cards2);
        }
        let count = list.length, list2 = [];
        while (count) {
          const { targets: targets2 } = await player2.chooseTarget(true, `【秉烛】:请将${get.translation(list[list2.length])}置于一名其他角色的武将牌上`).set("ai", function(target2) {
            var player3 = _status.event.player;
            return get.attitude(player3, target2) < 0;
          }).set("filterTarget", lib.filter.notMe).forResult();
          count--;
          if (!targets2) continue;
          list2.push(targets2[0]);
        }
        for (var i2 = 0; i2 < list2.length; i2++) {
          list2[i2].addToExpansion(list[i2][0], list2[i2], "giveAuto").gaintag.add("bingzhumrfz");
        }
      },
      group: ["bingzhumrfz_clear", "bingzhumrfz_eff"],
      subSkill: {
        eff: {
          direct: true,
          trigger: { global: "useCardToTargeted" },
          filter: function(event2, player2) {
            var cards2 = event2.player.getExpansions("bingzhumrfz");
            if (!cards2.length || !event2.card) return false;
            if (get.type2(event2.card) != "trick" && get.type(event2.card) != "basic") return false;
            for (var i2 of cards2) {
              if (get.name(i2) == get.name(event2.card) || get.suit(i2) == get.suit(event2.card)) return true;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            var cards2 = trigger2.player.getExpansions("bingzhumrfz").filter((i2) => get.name(i2) == get.name(trigger2.card) || get.suit(i2) == get.suit(trigger2.card));
            const {
              result: { bool, links }
            } = await player2.chooseCardButton("【秉烛】:你可以弃置其一张‘司’并令此牌对一名目标角色无效", cards2).set("ai", () => {
              var player3 = _status.event.player, event3 = _status.event.getTrigger(), friend = game.filterPlayer((current) => current == player3 || get.attitude(current, player3) > 0);
              for (var i2 of event3.targets) {
                if (friend.includes(i2)) return 1;
              }
              return 0;
            });
            if (!bool) return;
            const { targets: targets2 } = await player2.chooseTarget("【秉烛】:请选择一名目标角色，然后此牌对该角色无效", true).set("ai", function(target2) {
              var player3 = _status.event.player;
              return get.attitude(target2, player3) > 0;
            }).set("filterTarget", (card, player3, target2) => {
              var targets3 = _status.event.targets;
              return targets3.includes(target2);
            }).set("targets", trigger2.targets).forResult();
            if (!targets2) return;
            trigger2.getParent().excluded.add(targets2[0]);
            trigger2.player.loseToDiscardpile(links);
            player2.draw();
            player2.logSkill("bingzhumrfz", targets2[0]);
          }
        },
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "dieAfter" },
          content() {
            for (var i2 of game.players) {
              var cards2 = i2.getExpansions("bingzhumrfz");
              if (cards2.length) i2.loseToDiscardpile(cards2);
            }
          }
        }
      }
    },
    //新山
    zhefumrfz: {
      audio: "zhuangtimrfz",
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        return player2.countCards("h", (card) => get.tag(card, "damage")) > 0;
      },
      prompt(event2, player2) {
        return `【蛰伏】:是否将手牌中所有带有伤害类标签的牌置入弃牌堆或牌堆顶并摸等量的牌？`;
      },
      async content(event2, trigger2, player2) {
        let cards2 = player2.getCards("h", (card) => get.tag(card, "damage"));
        if (!cards2.length) return;
        const { moved } = await player2.chooseToMove().set("list", [["牌堆底", cards2], ["弃牌堆"]]).set("processAI", (list) => {
          var player3 = _status.event.player, cards3 = list[0][1], canUse = cards3.filter((i4) => player3.canUseToAnyone(i4)), bottom2 = [], disPile2 = [];
          var red = 0, black = 0;
          for (var i3 of canUse) {
            var color = get.color(i3);
            if (!color) continue;
            else if (color == "red") red += get.value(i3);
            else black += get.value(i3);
          }
          if (red > black) bottom2 = canUse.slice().filter((i4) => get.color(i4) == "red");
          else bottom2 = canUse.slice().filter((i4) => get.color(i4) == "black");
          bottom2.sort(function(a, b) {
            return get.value(b, player3) - get.value(a, player3);
          });
          disPile2 = cards3.slice().filter((i4) => !bottom2.includes(i4));
          return [bottom2, disPile2];
        }).forResult();
        if (!moved) return;
        var bottom = moved[0], disPile = moved[1];
        console.log(moved);
        if (disPile.length) player2.loseToDiscardpile(disPile);
        if (bottom.length) {
          game.log(player2, "将", get.cnNumber(bottom.length), "置入了牌堆底");
          for (var i2 of bottom) ui.cardPile.appendChild(i2);
          player2.$throw(bottom.length, 1e3);
        }
        await player2.draw(cards2.length);
      }
    },
    yubianmrfz: {
      audio: "julimrfz",
      trigger: { player: "phaseJieshuBegin" },
      prompt(event2, player2) {
        return `【狱变】:你可以使用牌堆顶的牌（目标必须合法），若你因此使用的牌颜色均相同，你重复这个流程`;
      },
      check(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && player2.canUse("sha", current) && get.attitude(player2, current) < 0;
        });
      },
      async content(event2, trigger2, player2) {
        let cardx = [], color;
        while (true) {
          var card = get.bottomCards()[0];
          player2.$throw(card, null);
          if (!player2.hasUseTarget(card)) return;
          const result2 = await player2.chooseUseTarget(card, `【狱变】:请选择${get.translation(card)}的目标`);
          if (!result2) return;
          var cards2 = result2.cards;
          for (var i2 of cards2) cardx.push(i2);
          color = get.color(cards2[0]);
          for (var i2 of cardx) {
            if (get.color(i2) != color) {
              return;
            }
            color = get.color(i2);
          }
        }
      }
    },
    //新空弦
    sanyimrfz: {
      audio: "lieshimrfz",
      trigger: { player: "useCard2" },
      filter(event2, player2) {
        if (!event2.card) return false;
        if (get.name(event2.card) != "sha" || get.number(event2.card) == null) return false;
        return event2.targets && event2.targets.length == 1;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget().set("forced", true).set("filterTarget", (card, player3, target2) => {
          if (target2 == player3 || _status.event.targets.includes(target2) || !player3.canUse(_status.event.cardx, target2, false))
            return false;
          var selected = ui.selected.targets, base = _status.event.targetx.hp;
          var total = Object.values(selected).reduce((accumulator, currentValue) => {
            if (currentValue.hasOwnProperty("hp")) {
              return accumulator + currentValue.hp;
            }
            return accumulator;
          }, 0);
          return target2.hp + total + base <= _status.event.cardx.number;
        }).set("prompt", `【散逸】:你可以额外指定任意名体力值之和不超过${trigger2.card.number - trigger2.targets[0].hp}的角色`).set("selectTarget", [0, Infinity]).set("complexTarget", true).set("ai", (target2) => {
          return get.effect(target2, _status.event.cardx, _status.event.player, _status.event.player) > 0;
        }).set("targets", trigger2.targets).set("targetx", trigger2.targets[0]).set("cardx", trigger2.card).forResult();
        if (!targets2) return false;
        for (var i2 of targets2) {
          trigger2.targets.push(i2);
          player2.line(i2);
        }
        player2.logSkill("sanyimrfz");
      }
    },
    baofengmrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        return event2.card && get.name(event2.card) == "sha" && get.color(event2.card) != "none";
      },
      forced: true,
      async content(event2, trigger2, player2) {
        const { bool } = await player2.chooseUseTarget(
          {
            name: "sha",
            suit: "none",
            number: trigger2.card.number,
            nature: trigger2.card.nature
          },
          false,
          false
        ).set("prompt", `【追矢】:你可以视为使用一张无色且点数为${trigger2.card.number}的${get.translation(trigger2.card.nature)}【杀】`).forResult();
        if (!bool) return;
      }
    },
    //ela 艾拉
    zuzhimrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        return event2.card && get.color(event2.card) != "none" && event2.player && event2.player.isIn() && (!event2.player.storage.zuzhimrfz || !event2.player.storage.zuzhimrfz.includes(get.color(event2.card)));
      },
      prompt(event2, player2) {
        return `【阻滞】:是否令${event2.player == player2 ? "你" : get.translation(event2.player)}本回合无法使用或打出${get.translation(get.color(event2.card))}的牌？`;
      },
      check(event2, player2) {
        return get.attitude(event2.player, player2) < 0;
      },
      content() {
        var target2 = trigger.player;
        if (!target2.storage.zuzhimrfz_ban) target2.storage.zuzhimrfz_ban = [];
        target2.storage.zuzhimrfz_ban.add(get.color(trigger.card));
        target2.addTempSkill("zuzhimrfz_ban", {
          global: "phaseEnd"
        });
      },
      subSkill: {
        ban: {
          charlotte: true,
          onremove: true,
          mark: true,
          intro: {
            content(event2, player2) {
              return `本回合不能使用或打出${get.translation(player2.storage.zuzhimrfz_ban)}的牌`;
            }
          },
          mod: {
            cardEnabled: function(card, player2) {
              if (player2.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
            },
            cardRespondable: function(card, player2) {
              if (player2.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
            },
            cardSavable: function(card, player2) {
              if (player2.getStorage("zuzhimrfz_ban").includes(get.color(card))) return false;
            }
          }
        }
      }
    },
    leimingmrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      onremove: true,
      mark: true,
      intro: {
        content(event2, player2) {
          if (game.me == player2) {
            return `记录的内容：${get.translation(player2.storage.leimingmrfz)}`;
          } else return `有${player2.storage.leimingmrfz.length}个记录的内容`;
        }
      },
      audio: 2,
      trigger: { global: "roundStart" },
      direct: true,
      async content(event2, trigger2, player2) {
        player2.storage.leimingmrfz = [];
        var list1 = [], list2 = [], list3 = [], list4 = [];
        for (var i2 = 0; i2 < lib.inpile.length; i2++) {
          var type = get.type(lib.inpile[i2]);
          if (type == "basic") {
            list1.push(["基本", "", lib.inpile[i2]]);
          } else if (type == "trick") {
            list2.push(["锦囊", "", lib.inpile[i2]]);
          } else if (type == "delay") {
            list3.push(["锦囊", "", lib.inpile[i2]]);
          } else if (type == "equip") {
            list3.push(["装备", "", lib.inpile[i2]]);
          }
        }
        const { links } = await player2.chooseButton([get.prompt("leimingmrfz"), [list1.concat(list2).concat(list3).concat(list4), "vcard"]]).set("filterButton", function(button) {
          var player3 = _status.event.player;
          if (player3.storage.leimingmrfz.includes(button.link[2])) return false;
          return true;
        }).set("ai", function(button) {
          var rand = _status.event.rand;
          switch (button.link[2]) {
            case "sha":
              return 5 + rand[1];
            case "tao":
              return 4 + rand[2];
            case "lebu":
              return 3 + rand[3];
            case "shan":
              return 4.5 + rand[4];
            case "wuzhong":
              return 4 + rand[5];
            case "shunshou":
              return 3 + rand[6];
            case "nanman":
              return 2 + rand[7];
            case "wanjian":
              return 2 + rand[8];
            default:
              return rand[0];
          }
        }).set("rand", [
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random()
        ]).forResult();
        if (!links) return;
        player2.logSkill("leimingmrfz");
        player2.storage.leimingmrfz.add(links[0][2]);
        var { control } = await player2.chooseControl(lib.suit).set("prompt", "【雷鸣】:请选择一种花色").set("ai", () => lib.suit.randomGet()).forResult();
        if (!control) return;
        player2.storage.leimingmrfz.add(control);
        var { control } = await player2.chooseControl("basic", "trick", "equip").set("prompt", "【雷鸣】:请选择一种类型").set("ai", () => ["basic", "basic", "basic", "trick", "trick", "equip"].randomGet()).forResult();
        if (!control) return;
        player2.storage.leimingmrfz.add(control);
      },
      group: "leimingmrfz_eff",
      subSkill: {
        eff: {
          audio: "leimingmrfz",
          trigger: { global: "useCard" },
          onremove: true,
          filter(event2, player2) {
            var storage = player2.storage.leimingmrfz, card = event2.card;
            if (player2.storage.leimingmrfz_eff) return false;
            if (!storage || storage.length == 0) return false;
            if (player2 == event2.player) return false;
            return storage.includes(get.suit(card, event2.player)) || storage.includes(get.name(card, event2.player)) || storage.includes(get.type2(card, event2.player));
          },
          prompt(event2, player2) {
            return `【雷鸣】:是否视为对${get.translation(event2.player)}使用一张任意颜色的雷【杀】？`;
          },
          check(event2, player2) {
            if (get.attitude(event2.player, player2) > 0) return false;
            return get.effect(event2.player, { name: "sha", nature: "thunder" }, player2, player2) > 0;
          },
          async content(event2, trigger2, player2) {
            player2.storage.leimingmrfz_eff = true;
            player2.when({
              player: "leimingmrfz_effAfter"
            }).then(() => {
              delete player2.storage.leimingmrfz_eff;
            });
            var target2 = trigger2.player;
            if (player2.canUse({ name: "sha", nature: "thunder" }, target2, false)) {
              var { control } = await player2.chooseControl("red", "black").set("prompt", `【雷鸣】:请选择使用雷【杀】的颜色`).set("ai", function() {
                var player3 = _status.event.player, target3 = _status.event.target;
                var red = get.effect(
                  target3,
                  {
                    name: "sha",
                    nature: "thunder",
                    color: "red"
                  },
                  player3,
                  player3
                ), black = get.effect(
                  target3,
                  {
                    name: "sha",
                    nature: "thunder",
                    color: "black"
                  },
                  player3,
                  player3
                );
                if (red > black) return 0;
                return 1;
              }).set("target", target2).forResult();
              if (!control) return;
              if (player2.canUse(
                {
                  name: "sha",
                  nature: "thunder",
                  color: control
                },
                target2,
                false
              )) {
                player2.useCard(
                  {
                    name: "sha",
                    nature: "thunder",
                    color: control
                  },
                  target2,
                  true
                );
              }
            }
            var list = [], storage = player2.storage.leimingmrfz, card = trigger2.card;
            if (storage.includes(get.name(card, target2))) list.push(get.name(card, target2));
            if (storage.includes(get.suit(card, target2))) list.push(get.suit(card, target2));
            if (storage.includes(get.type2(card, target2))) list.push(get.type2(card, target2));
            var { control } = list.length == 1 ? { control: list[0] } : await player2.chooseControl(list).set("prompt", `【雷鸣】:请选择清除一个记录`).set("list", list).set("ai", function() {
              var list2 = _status.event.list;
              return list2.randomGet();
            }).forResult();
            if (!control) return;
            player2.storage.leimingmrfz.remove(control);
          }
        }
      }
    },
    //阿斯卡纶
    dunyingmrfz: {
      mod: {
        globalTo(from, to, distance) {
          var cards2 = to.getCards("s", function(card) {
            return card.hasGaintag("dunyingmrfz");
          });
          if (cards2.length) return distance + 1;
        }
      },
      marktext: "影",
      intro: {
        mark: function(dialog, storage, player2) {
          var cards2 = player2.getCards("s", function(card) {
            return card.hasGaintag("dunyingmrfz");
          });
          if (game.me == player2) dialog.addAuto(cards2);
          else return `共有${cards2.length}张牌`;
        }
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getCards("s", function(card) {
          return card.hasGaintag("dunyingmrfz");
        });
        if (cards2.length) {
          player2.lose(cards2, ui.discardPile);
          player2.$throw(cards2, 1e3);
          game.log(cards2, "进入了弃牌堆");
        }
      },
      audio: 2,
      trigger: {
        player: "phaseJieshuBegin"
      },
      filter: function(event2, player2) {
        var cards2 = player2.getCards("s", function(card) {
          return card.hasGaintag("dunyingmrfz");
        });
        if (player2.countCards("h", (card) => {
          return !card.hasGaintag("dunyingmrfz");
        }) < 1)
          return false;
        return cards2.length < player2.maxHp;
      },
      async content(event2, trigger2, player2) {
        var num = player2.getCards("s", function(card) {
          return card.hasGaintag("dunyingmrfz");
        }).length;
        const { cards: cards2 } = player2.countCards("h", (card) => {
          return !card.hasGaintag("dunyingmrfz");
        }) + num <= player2.maxHp ? { cards: player2.getCards("h") } : await player2.chooseCard("h", get.prompt("dunyingmrfz"), "将所有手牌置于武将牌上，称之为“影”", true).set("selectCard", () => {
          var player3 = _status.event.player;
          var num2 = player3.getCards("s", function(card) {
            return card.hasGaintag("dunyingmrfz");
          }).length;
          return player3.maxHp - num2;
        }).set("filterCard", (card) => {
          return !card.hasGaintag("dunyingmrfz");
        }).set("ai", function(card) {
          var player3 = _status.event.player;
          if (player3.hasUseTarget(card) && !player3.hasValueTarget(card)) return 0;
          if (["sha", "shan", "wuxie", "caochuan"].includes(card.name)) return 2 + Math.random();
          return 1 + Math.random();
        }).forResult();
        if (!cards2) return;
        game.log(player2, "将", cards2.length, "张牌置于在武将牌上");
        player2.loseToSpecial(cards2, "dunyingmrfz");
        player2.markSkill("dunyingmrfz");
      },
      group: ["dunyingmrfz_gain"],
      subSkill: {
        gain: {
          audio: "dunyingmrfz",
          trigger: { player: "useCard" },
          usable: 1,
          filter(event2, player2) {
            var cards2 = player2.getCards("s", function(card) {
              return card.hasGaintag("dunyingmrfz");
            });
            if (!event2.cards.length) return cards2.length < player2.maxHp;
            var position = event2.card.cards.map((i2) => i2.original);
            return position.every((item) => item != "h") && cards2.length < player2.maxHp;
          },
          prompt: "【遁影】:你可以将牌堆顶的一张牌置于你的武将牌上，称之为“影”",
          content() {
            var cards2 = get.cards();
            game.log(player, "将一张牌置于在武将牌上");
            player.loseToSpecial(cards2, "dunyingmrfz");
            player.markSkill("dunyingmrfz");
          }
        }
      }
    },
    niximrfz: {
      audio: 2,
      trigger: { global: "phaseJieshuBegin" },
      filter(event2, player2) {
        return event2.player.isIn() && event2.player != player2 && player2.canUse("sha", event2.player, false);
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseToUse(
          function(card, player3, event3) {
            if (get.name(card) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【匿袭】是否对" + get.translation(trigger2.player) + "使用一张杀？"
        ).set("logSkill", "niximrfz").set("complexSelect", true).set("filterTarget", function(card, player3, target3) {
          if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger2.player).forResult();
        if (!cards2) return;
        var isDamaged = player2.hasHistory("useCard", (evt) => {
          return evt.getParent(2) == event2 && evt.card && evt.card.cardid && player2.hasHistory("sourceDamage", (evtx) => {
            return evtx.card && evt.card.cardid == evtx.card.cardid;
          });
        });
        if (!isDamaged && player2.isIn() && trigger2.player.isIn()) {
          var target2 = trigger2.player, targetx = trigger2.player, list = [];
          if (target2.getNext() == player2) return;
          const { bool } = await player2.chooseBool(`【匿袭】:是否将座位移到${get.translation(trigger2.player)}下家？`).forResult();
          if (!bool) return;
          while (targetx.getNext() != player2) {
            targetx = targetx.getNext();
            list.push(targetx);
          }
          if (list.length == 0) return;
          list.reverse();
          for (var i2 of list) {
            await game.broadcastAll(
              function(target1, target22) {
                game.swapSeat(target1, target22);
              },
              i2,
              player2
            );
          }
        }
      }
    },
    // logos 逻格斯 李狗剩
    baidumrfz: {
      audio: 2,
      trigger: {
        global: "damageEnd"
      },
      usable: 1,
      filter(event2, player2) {
        if (!event2.card) return false;
        var num = get.cardNameLength(event2.card);
        if (typeof num !== "number" || num < 1) return false;
        return player2.countCards("he") > 0 && event2.player.isIn();
      },
      // direct: true,
      async cost(event2, trigger2, player2) {
        let sourceCards = trigger2.cards || void 0;
        const { result: result2 } = await player2.chooseToDiscard("he").set("prompt", get.prompt("baidumrfz")).set(
          "prompt2",
          `你可以弃置一张牌，${sourceCards === void 0 ? "(" + get.translation(trigger2.card) + "无对应的实体牌)" : "你获得" + get.translation(trigger2.card) + "(" + get.translation(sourceCards) + "),"}然后${get.translation(trigger2.player)}摸你弃置的牌与对其造成伤害的牌的字数之差的绝对值张牌。`
        ).set("ai", function(card) {
          var player3 = _status.event.player, target2 = _status.event.targetx, cardx = trigger2.card, att = get.attitude(player3, target2);
          if (att > 0) {
            return Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card)) - Math.floor(get.value(card) / 10);
          } else {
            if (Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card)) > cardx.cards.length) return 0;
            return get.value(cardx.cards) - get.value(card);
          }
        }).set("targetx", trigger2.player).set("cardx", trigger2.card);
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let sourceCards = trigger2.cards || void 0;
        let cards2 = event2.cards;
        var gaincard = [];
        for (var i2 of sourceCards) {
          if (get.position(i2, true) == "o") gaincard.push(i2);
        }
        if (gaincard.length > 0) player2.gain(gaincard, "gain2");
        var num = Math.abs(get.cardNameLength(trigger2.card) - get.cardNameLength(cards2[0]));
        if (num > 0) trigger2.player.draw(num);
        player2.line(trigger2.player);
      }
    },
    yuhuimrfz: {
      init(player2, skill) {
        player2.storage[skill] = {
          del: false,
          names: []
        };
      },
      mark: true,
      intro: {
        mark(dialog, content, player2) {
          var names = player2.storage.yuhuimrfz["names"];
          dialog.addText(`本回合【语汇】使用过的牌:<br>${get.translation(names)}`);
        }
      },
      audio: 2,
      enable: "chooseToUse",
      hiddenCard: function(player2, name) {
        return player2.countCards("hes") > 0 && !player2.storage.yuhuimrfz["names"].includes(name);
      },
      filter: function(event2, player2) {
        if (player2.countCards("hes") < 1) return false;
        for (var name of lib.inpile) {
          if (player2.storage.yuhuimrfz["names"].includes(name)) continue;
          if (event2.filterCard({ name, isCard: true }, player2, event2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var list = [];
          for (var name of lib.inpile) {
            if (player2.storage.yuhuimrfz.names.includes(name)) {
              continue;
            }
            if (event2.filterCard({ name }, player2, event2)) {
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
        filter: function(button, player2) {
          var cards2 = player2.getCards("hes"), name = button.link[2], cardsx = [];
          for (var i2 of cards2) {
            if (get.cardNameLength(i2) >= get.cardNameLength(name)) cardsx.push(name);
          }
          return _status.event.getParent().filterCard({ name }, player2, _status.event.getParent()) && cardsx.includes(name);
        },
        check: function(button) {
          var player2 = _status.event.player;
          if (player2.countCards("hs", button.link[2]) > 0) return 0;
          if (button.link[2] == "wugu") return;
          var effect = player2.getUseValue(button.link[2]);
          if (effect > 0) return effect;
          return 0;
        },
        backup: function(links, player2) {
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
            precontent() {
              if (!player2.storage.yuhuimrfz)
                player2.storage.yuhuimrfz = {
                  del: false,
                  names: []
                };
              player2.storage.yuhuimrfz["names"].add(lib.skill.yuhuimrfz_backup.viewAs.name);
              if (player2.storage.yuhuimrfz["del"] != true) {
                player2.storage.yuhuimrfz["del"] = true;
                player2.when({ global: "phaseEnd" }).then(() => {
                  player2.storage.yuhuimrfz = {
                    del: false,
                    names: []
                  };
                });
              }
            }
          };
        },
        prompt: function(links, player2) {
          return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
        }
      },
      ai: {
        save: true,
        respondSha: true,
        respondShan: true,
        skillTagFilter: function(player2, tag, arg) {
          if (!player2.countCards("hes")) return false;
          if (tag == "respondSha" || tag == "respondShan") {
            if (arg == "respond") return false;
            return !player2.storage.yuhuimrfz["names"].includes(tag == "respondSha" ? "sha" : "shan");
          }
          return true;
        },
        order: 4,
        result: {
          player: 1
        },
        threaten: 2.8
      }
    },
    // 维什戴尔 异格w 益达
    yuximrfz: {
      mod: {
        globalTo(from, to, distance) {
          var cards2 = to.getCards("s", function(card) {
            return card.hasGaintag("yuximrfzx");
          });
          if (cards2.length) return distance + 2;
        }
      },
      marktext: "死魂灵",
      intro: {
        mark: function(dialog, storage, player2) {
          var cards2 = player2.getCards("s", function(card) {
            return card.hasGaintag("yuximrfzx");
          });
          if (cards2 && cards2.length > 0) dialog.addAuto("其他角色计算与你的距离+2");
          else return `没有‘死魂灵’`;
          if (game.me == player2) dialog.addAuto(cards2);
          else dialog.addAuto(`共有${cards2.length}张牌`);
        }
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getCards("s", function(card) {
          return card.hasGaintag("yuximrfzx");
        });
        if (cards2.length) {
          game.cardsGotoSpecial(cards2);
          player2.$throw(cards2, 1e3);
          game.log(cards2, "被销毁");
        }
      },
      audio: 2,
      forced: true,
      trigger: { global: "roundStart" },
      async content(event2, trigger2, player2) {
        lib.skill.yuximrfz.onremove(player2, "yuximrfz");
        var cards2 = [], nature = ["fire", "thunder"];
        for (var i2 = 0; i2 < player2.maxHp; i2++) {
          var name = lib.inpile.filter((name2) => {
            return get.type(name2) == "trick" || get.type(name2) == "basic";
          }).randomGet();
          cards2.push(
            game.createCard(
              name,
              lib.suit.randomGet(),
              Math.floor(Math.random() * 13) + 1,
              name == "sha" ? nature.randomGet() : void 0
            )
          );
        }
        cards2.map((card) => {
          card.storage.yuximrfzx = true;
        });
        game.log(player2, "将", cards2.length, "张牌置于在武将牌上");
        player2.loseToSpecial(cards2, "yuximrfzx");
        player2.markSkill("yuximrfz");
      },
      group: ["yuximrfz_destroy"],
      subSkill: {
        destroy: {
          trigger: {
            player: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
          },
          direct: true,
          charlotte: true,
          filter: function(event2, player2) {
            var evt = event2.getl(player2);
            if (!evt || !evt.cards) return false;
            for (var i2 of evt.cards) {
              if (i2.storage.yuximrfzx == true) return true;
            }
            return false;
          },
          content: function() {
            var cards2 = [];
            var evt = trigger.getl(player);
            if (evt && evt.cards) {
              for (var i2 of evt.cards) {
                if (i2.storage.yuximrfzx == true) cards2.push(i2);
              }
            }
            game.cardsGotoSpecial(cards2);
            game.log(cards2, "被销毁了");
            if (Math.random() > 0.5) player.logSkill("yuximrfz");
          }
        }
      }
    },
    haolimrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      compare(card1, card2) {
        if (get.suit(card1) == get.suit(card2)) return true;
        if (get.number(card1) == get.number(card2)) return true;
        if (get.name(card1) == get.name(card2)) return true;
        return false;
      },
      direct: true,
      filter(event2, player2) {
        var cards2 = player2.getCards("s", function(card) {
          return card.hasGaintag("yuximrfzx");
        });
        if (cards2.length < 1) return false;
        if (!player2.isPhaseUsing()) return false;
        if (event2.card.storage.yuximrfzx == true) return false;
        if (get.type(event2.card) == "equip" || get.type(event2.card) == "delay") return false;
        for (var i2 of cards2) {
          if (lib.skill.haolimrfz.compare(i2, event2.card)) return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseCard("s").set("filterCard", (card) => lib.skill.haolimrfz.compare(card, trigger2.card)).set("prompt", `【好礼】:你可以弃置一张‘死魂灵’，视为使用一张${get.translation(get.name(trigger2.card))}`).set("ai", (card) => get.value(trigger2.card) - get.value(card)).forResult();
        if (!cards2) return;
        player2.discard(cards2);
        player2.chooseUseTarget({ name: get.name(trigger2.card), isCard: true }, true, false);
      }
    },
    shezumrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        var cards2 = player2.getCards("s", function(card) {
          return card.hasGaintag("yuximrfzx");
        });
        return event2.getParent().name != "shezumrfz" && event2.player.isIn() && cards2 && cards2.length > 0 && game.hasPlayer((current) => {
          return current != player2 && current != event2.player && get.distance(event2.player, current) <= 3;
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const {
          result: { cards: cards2, targets: targets2 }
        } = await player2.chooseCardTarget({
          prompt: `【射祖】:你可以弃置一张‘死魂灵’并对一名距离${get.translation(trigger2.player)}不大于3的角色（不能是你或${get.translation(trigger2.player)}）造成一点火焰伤害`,
          filterCard(card) {
            return card.hasGaintag("yuximrfzx");
          },
          position: "s",
          filterTarget(card, player3, target2) {
            var damaged = _status.event.targetx;
            return target2 != player3 && target2 != damaged && get.distance(damaged, target2) <= 3;
          },
          ai1: (card) => 8 - get.value(card),
          ai2: (target2) => get.damageEffect(target2, player2, player2, "fire") > 0
        }).set("targetx", trigger2.player);
        if (!cards2 || !targets2) return;
        player2.logSkill("shezumrfz", targets2[0]);
        player2.discard(cards2);
        targets2[0].damage(player2, "fire");
      }
    },
    // 魔王 小特同学 特蕾西娅
    duanzhangmrfz: {
      intro: {
        mark: function(dialog, storage, player2) {
          var players = player2.storage.duanzhangmrfz.slice().filter((target2) => target2 != player2);
          if (players && players.length > 0) {
            dialog.addAuto("这一次我不会离开了...");
            players = players.map((i2) => i2.name);
            dialog.addSmall([players, "character"]);
          } else return "没有【断章】角色";
        }
      },
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      onremove: true,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => current != player2) && (event2.name != "phase" || game.phaseNumber == 0);
      },
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget(true).set("prompt", `【断章】:请选择【断章】目标`).set("filterTarget", lib.filter.notMe).set("ai", (target3) => {
          var att = get.attitude(_status.event.player, target3);
          if (att > 0) return att + 1;
          if (att == 0) return Math.random();
          return att;
        }).forResult();
        if (!targets2) return;
        var target2 = targets2[0];
        if (!player2.storage.duanzhangmrfz) player2.storage.duanzhangmrfz = [];
        if (!target2.storage.duanzhangmrfz) target2.storage.duanzhangmrfz = [];
        player2.storage.duanzhangmrfz.addArray([target2, player2]);
        target2.storage.duanzhangmrfz.addArray([target2, player2]);
        player2.markSkill("duanzhangmrfz");
        player2.line(target2);
        for (var i2 of player2.storage.duanzhangmrfz) {
          if (i2 != player2) i2.addSkill("canxiangmrfz_nodelay");
          i2.addSkill("duanzhangmrfz_eff1");
        }
      },
      group: ["duanzhangmrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "dieAfter" },
          forceDie: true,
          filter(event2, player2) {
            return event2.player.hasSkill("duanzhangmrfz_eff1");
          },
          content() {
            for (var i2 of game.players) {
              if (!i2.storage.duanzhangmrfz) continue;
              if (i2.storage.duanzhangmrfz.includes(trigger.player)) i2.storage.duanzhangmrfz.remove(trigger.player);
            }
          }
        },
        eff1: {
          silent: true,
          charlotte: true,
          trigger: {
            global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "duanzhangmrfzAfter"]
          },
          filter(event2, player2) {
            return (player2.storage.duanzhangmrfz && player2.storage.duanzhangmrfz.length > 1) ^ player2.hasSkill("duanzhangmrfz_group");
          },
          async content(event2, trigger2, player2) {
            if (player2.storage.duanzhangmrfz && player2.storage.duanzhangmrfz.length > 1) {
              var cards2 = [], target2 = game.findPlayer((current) => {
                return player2.storage.duanzhangmrfz.includes(current);
              });
              for (var i2 of target2.storage.duanzhangmrfz) {
                if (i2.countCards("h") == 0) continue;
                if (i2 == player2) continue;
                for (var j of i2.getCards("h")) cards2.push(j);
              }
              var cardsx = cards2.map((card) => {
                var cardx = ui.create.card();
                cardx.init(get.cardInfo(card));
                cardx._cardid = card.cardid;
                return cardx;
              });
              if (cardsx.length < 1) return;
              player2.directgains(cardsx, null, "duanzhangmrfz");
              player2.addSkill("duanzhangmrfz_group");
            } else player2.removeSkill("duanzhangmrfz_group");
          }
        },
        group: {
          charlotte: true,
          group: ["duanzhangmrfz_eff_use", "duanzhangmrfz_eff_lose"],
          trigger: {
            global: ["addJudgeAfter", "gainAfter", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
          },
          forced: true,
          silent: true,
          filter: function(event2, player2) {
            if (event2.name == "gain") return event2.cards.length;
            var cards2 = event2.getd();
            return cards2.length;
          },
          onremove: function(player2) {
            var cards2 = player2.getCards("s", (card) => {
              return card.hasGaintag("duanzhangmrfz");
            });
            if (player2.isOnline2()) {
              player2.send(
                function(cards3, player3) {
                  cards3.forEach((i2) => i2.delete());
                  if (player3 == game.me) ui.updatehl();
                },
                cards2,
                player2
              );
            }
            cards2.forEach((i2) => i2.delete());
            if (player2 == game.me) ui.updatehl();
          },
          content: function() {
            var cards2 = [];
            var idList = player.getCards("s", (card) => card.hasGaintag("duanzhangmrfz")).map((i3) => i3._cardid);
            var target2 = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            for (var i2 of target2.storage.duanzhangmrfz) {
              if (i2.countCards("h") == 0) continue;
              if (i2 == player) continue;
              for (var j of i2.getCards("h")) {
                if (idList.includes(j.cardid)) continue;
                cards2.push(j);
              }
            }
            var cards22 = cards2.map((card) => {
              var cardx = ui.create.card();
              cardx.init(get.cardInfo(card));
              cardx._cardid = card.cardid;
              return cardx;
            });
            player.directgains(cards22, null, "duanzhangmrfz");
          }
        },
        eff_use: {
          trigger: {
            player: ["useCardBefore", "respondBefore"]
          },
          charlotte: true,
          forced: true,
          popup: false,
          firstDo: true,
          filter: function(event2, player2) {
            var cards2 = player2.getCards("s", (card) => card.hasGaintag("duanzhangmrfz") && card._cardid);
            return event2.cards && event2.cards.some((card) => {
              return cards2.includes(card);
            });
          },
          content: function() {
            var idList = player.getCards("s", (card2) => card2.hasGaintag("duanzhangmrfz")).map((i3) => i3._cardid);
            var cards2 = [];
            var target2 = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            for (var i2 of target2.storage.duanzhangmrfz) {
              if (i2.countCards("h") == 0) continue;
              if (i2 == player) continue;
              for (var j of i2.getCards("h")) {
                if (!idList.includes(j.cardid)) continue;
                cards2.push(j);
              }
            }
            var cards22 = [];
            for (var card of trigger.cards) {
              var cardx = cards2.find((cardx2) => cardx2.cardid == card._cardid);
              if (cardx) cards22.push(cardx);
            }
            var cards3 = trigger.cards.slice();
            trigger.cards = cards22;
            trigger.card.cards = cards22;
            if (player.isOnline2()) {
              player.send(
                function(cards4, player2) {
                  cards4.forEach((i3) => i3.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards3,
                player
              );
            }
            cards3.forEach((i3) => i3.delete());
            if (player == game.me) ui.updatehl();
          }
        },
        eff_lose: {
          trigger: {
            global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "cardsGotoOrderingBegin"]
          },
          charlotte: true,
          forced: true,
          popup: false,
          firstDo: true,
          filter: function(event2, player2) {
            var idList = player2.getCards("s", (card) => card.hasGaintag("duanzhangmrfz")).map((i2) => i2._cardid);
            return event2.cards && event2.cards.some((card) => {
              return idList.includes(card.cardid);
            });
          },
          content: function() {
            var cards2;
            var idList = [];
            var target2 = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            for (var i2 of target2.storage.duanzhangmrfz) {
              if (i2.countCards("h") == 0) continue;
              if (i2 == player) continue;
              for (var j of i2.getCards("h")) {
                idList.add(j.cardid);
              }
            }
            cards2 = player.getCards("s", (card) => {
              return card.hasGaintag("duanzhangmrfz") && !idList.includes(card._cardid);
            });
            if (player.isOnline2()) {
              player.send(
                function(cards3, player2) {
                  cards3.forEach((i3) => i3.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards2,
                player
              );
            }
            cards2.forEach((i3) => i3.delete());
            if (player == game.me) ui.updatehl();
          }
        }
      }
    },
    chenaimrfz: {
      audio: 2,
      trigger: {
        player: ["useCardAfter", "respondAfter"]
      },
      direct: true,
      filter: function(event2, player2) {
        if (_status.currentPhase != player2) return false;
        if (player2.getHistory("custom", function(evt) {
          return evt.chenaimrfz_type == get.type2(event2.card);
        }).length > 0)
          return false;
        return event2.cards.filterInD().length > 0;
      },
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget(
          get.prompt("chenaimrfz"),
          "将" + get.translation(trigger2.cards) + "交给一名其他角色",
          function(card, player3, target2) {
            return target2 != player3;
          }
        ).set("ai", function(target2) {
          if (target2.hasJudge("lebu")) return 0;
          let att = get.attitude(_status.event.player, target2), name = _status.event.cards[0].name;
          if (att < 3) return 0;
          if (_status.event.player.storage.duanzhangmrfz && _status.event.player.storage.duanzhangmrfz.includes(target2) && att > 0)
            att += 10;
          if (target2.hasSkillTag("nogain")) att /= 10;
          if (name === "sha" && target2.hasSha()) att /= 5;
          if (name === "wuxie" && target2.needsToDiscard(_status.event.cards)) att /= 5;
          return att / (1 + get.distance(player2, target2, "absolute"));
        }).set("cards", trigger2.cards).forResult();
        if (!targets2) return;
        player2.logSkill("chenaimrfz", targets2[0]);
        targets2[0].gain(trigger2.cards.filterInD(), "gain2");
        player2.getHistory("custom").push({ chenaimrfz_type: get.type2(trigger2.card) });
        if (player2.storage.duanzhangmrfz && player2.storage.duanzhangmrfz.includes(targets2[0])) targets2[0].draw();
      }
    },
    /** @type { Skill } */
    canxiangmrfz: {
      mod: {
        targetEnabled: function(card, player2, target2) {
          if (get.type(card) == "delay") {
            return false;
          }
        }
      },
      audio: 2,
      forced: true,
      trigger: { global: "damageBegin4" },
      filter(event2, player2) {
        var storage = player2.storage.duanzhangmrfz;
        if (event2.player != player2 && (!storage || !storage.includes(event2.player))) return false;
        return event2.hasNature();
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      },
      group: "canxiangmrfz_die",
      subSkill: {
        die: {
          silent: true,
          charlotte: true,
          trigger: { player: "dieAfter" },
          firstDo: true,
          forceDie: true,
          content() {
            var storage = player.storage.duanzhangmrfz;
            for (var i2 of storage) {
              if (!i2.storage.duanzhangmrfz) continue;
              if (i2.storage.duanzhangmrfz.length <= 2) i2.removeSkill("canxiangmrfz_nodelay");
              else i2.storage.duanzhangmrfz.remove(player);
            }
          }
        },
        nodelay: {
          mark: true,
          intro: {
            content: "属性伤害无效；无法成为延时锦囊牌的目标"
          },
          mod: {
            targetEnabled: function(card, player2, target2) {
              if (get.type(card) == "delay") {
                return false;
              }
            }
          },
          ai: {
            nofire: true,
            nothunder: true,
            effect: {
              target(card, player2, target2, current) {
                if (get.tag(card, "natureDamage")) {
                  return "zeroplayertarget";
                }
                if (get.type(card) == "trick" && get.tag(card, "damage")) {
                  return "zeroplayertarget";
                }
              }
            }
          }
        }
      },
      ai: {
        nofire: true,
        nothunder: true,
        effect: {
          target(card, player2, target2, current) {
            if (get.tag(card, "natureDamage")) {
              return "zeroplayertarget";
            }
            if (get.type(card) == "trick" && get.tag(card, "damage")) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    // 新多萝西
    newgongzhenmrfz: {
      mod: {
        aiOrder: function(player2, card, num) {
          if (typeof card == "object" && player2.isPhaseUsing()) {
            var history = player2.getAllHistory("useCard");
            if (history.length < 1) return num;
            var cardx = history[history.length - 1].card;
            if (cardx && get.type2(cardx) == get.type2(card)) {
              return num + 10;
            }
          }
        }
      },
      audio: "gongzhenmrfz",
      trigger: { player: ["useCardEnd", "respondEnd"] },
      forced: true,
      filter(event2, player2) {
        return player2.getAllHistory(event2.name).length > 1;
      },
      async content(event2, trigger2, player2) {
        var history = player2.getAllHistory(trigger2.name);
        var cardx = history[history.length - 2].card;
        if (!cardx) return;
        if (get.type2(cardx) == get.type2(trigger2.card)) {
          var cards2 = get.cards(2);
          game.cardsGotoOrdering(cards2);
          const { links } = await player2.chooseCardButton(`【共振】:请选择获得一张牌`, true, cards2).set("ai", (button) => {
            return get.value(button);
          }).forResult();
          if (!links) return;
          player2.gain(links, "gain2");
        } else
          player2.chooseToDiscard(true, `【共振】:请弃置区域内的一张牌`, "hej").set("ai", (card) => {
            if (get.position(card) == "j") return 10;
            return -get.value(card);
          });
      }
    },
    newmengxiangmrfz: {
      getLastDiscard(event2, player2) {
        var history = player2.getAllHistory("lose", (evt) => evt.type && evt.type == "discard");
        if (history.length < 1) return false;
        var cards2 = history[history.length - 1].cards;
        if (!cards2) return false;
        return cards2[cards2.length - 1];
      },
      mod: {
        cardUsable: function(card, player2) {
          var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player2);
          if (cardx && get.type2(cardx) == get.type2(card)) return Infinity;
        },
        targetInRange: function(card, player2) {
          var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player2);
          if (cardx && get.type2(cardx) == get.type2(card)) return true;
        }
      },
      audio: "mengxiangmrfz",
      forced: true,
      trigger: { player: "useCardBefore" },
      filter(event2, player2) {
        var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player2);
        if (!cardx) return false;
        return !event2.audioed && get.type2(cardx) == get.type2(event2.card);
      },
      content() {
        trigger.audioed = true;
      }
    },
    // 新黑键
    newhuangxiangmrfz: {
      audio: "huangxiangmrfz",
      trigger: {
        player: "phaseDrawAfter"
      },
      filter(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseCard([1, 2], "【荒响】:你可以选择两张手牌将其标记为‘残影’").set("ai", (card) => {
          var num = get.value(card);
          if (get.name(card) == "shan" || get.name(card) == "wuxie") num += 10;
          if (get.type2(card) == "equip") num -= 2;
          return num;
        });
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        var cards2 = event2.cards;
        await player2.removeGaintag("newhuangxiangmrfzx");
        for (var i2 of cards2) i2.addGaintag("newhuangxiangmrfzx");
      },
      group: "newhuangxiangmrfz_lose",
      subSkill: {
        lose: {
          audio: "huangxiangmrfz",
          trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
          },
          filter(event2, player2) {
            if (_status.currentPhase == player2) return false;
            var evt = event2.getl(player2);
            if (!evt || !evt.hs || !evt.hs.length) return false;
            if (event2.name == "lose") {
              for (var i2 in event2.gaintag_map) {
                if (event2.gaintag_map[i2].includes("newhuangxiangmrfzx")) return true;
              }
              return false;
            }
            return player2.hasHistory("lose", function(evt2) {
              if (event2 != evt2.getParent()) return false;
              for (var i3 in evt2.gaintag_map) {
                if (evt2.gaintag_map[i3].includes("newhuangxiangmrfzx")) return true;
              }
              return false;
            });
          },
          async cost(event2, trigger2, player2) {
            var list = ["选项一", "选项二", "cancel2"], choicelist = ["令一名你攻击范围内的角色选择弃置一张黑桃牌或受到一点伤害", "你摸一张牌且将此牌标记为‘残影’"];
            if (!game.hasPlayer((current) => current != player2 && player2.inRange(current))) {
              list.remove("选项一");
              choicelist[0] = '<span style="opacity:0.5; ">' + choicelist[0] + "(没有满足条件的角色)</span>";
            }
            const { control } = await player2.chooseControl(list).set("choiceList", choicelist).set("prompt", "【荒响】:你可以选择一项").set("ai", () => {
              var player3 = _status.event.player;
              if (!game.hasPlayer((current) => current != player3 && player3.inRange(current) && get.attitude(player3, current) < 0))
                return 1;
              return [0, 1];
            }).forResult();
            var result2 = {};
            result2.bool = true;
            result2.cost_data = control;
            if (control == "cancel2") result2.bool = false;
            event2.result = result2;
          },
          async content(event2, trigger2, player2) {
            var control = event2.cost_data;
            if (control == "选项一") {
              const { targets: targets2 } = await player2.chooseTarget().set("forced", true).set("prompt", "【荒响】:请选择一名攻击范围内的角色").set("filterTarget", (card, player3, target2) => {
                return player3 != target2 && player3.inRange(target2);
              }).forResult();
              const { bool } = await targets2[0].chooseToDiscard("【荒响】:请弃置一张黑桃牌，否则受到一点伤害", "he").set("ai", (card) => {
                var player3 = _status.event.player;
                if (player3.hp < 2 && player3.countCards("hes", (card2) => {
                  return get.name(card2) == "tao" || get.name(card2) == "jiu";
                }))
                  return 12 - get.value(card);
                return 7 - get.value(card);
              }).set("filterCard", (card) => get.suit(card) == "spade").forResult();
              if (bool) return;
              targets2[0].damage();
            } else {
              const { result: result2 } = await player2.draw();
              result2[0].addGaintag("newhuangxiangmrfzx");
            }
          }
        }
      }
    },
    newjiyinmrfz: {
      audio: "jiyinmrfz",
      forced: true,
      trigger: {
        player: "useCard2"
      },
      getMeetCondition(event2, player2, target2) {
        let num = 0;
        if (target2.isMaxHandcard()) num++;
        if (target2.isMaxHp()) num++;
        if (target2.isMaxEquip()) num++;
        return num;
      },
      filter(event2, player2) {
        if (event2.card.name != "sha") return false;
        for (var target2 of event2.targets) {
          let num = lib.skill.newjiyinmrfz.getMeetCondition(event2, player2, target2);
          if (typeof num === "number") return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        let targets2 = trigger2.targets;
        for (var target2 of targets2) {
          let num = lib.skill.newjiyinmrfz.getMeetCondition(event2, player2, target2);
          if (typeof num !== "number") continue;
          player2.line(target2);
          if (!target2.storage.newjiyinmrfz_tmp) target2.storage.newjiyinmrfz_tmp = [];
          target2.storage.newjiyinmrfz_tmp.push(trigger2.card);
          target2.when({
            player: "damageBegin3",
            global: "useCardAfter"
          }).filter((event3, player3) => {
            if (event3.name == "useCard" && player3.storage.newjiyinmrfz_tmp.filter((card) => card == event3.card).length > 0) return true;
            if (!player3.storage.newjiyinmrfz_tmp) return false;
            return event3.card && event3.card.name == "sha" && player3.storage.newjiyinmrfz_tmp.filter((card) => card == event3.card).length > 0;
          }).then(() => {
            if (trigger2.name == "damage") {
              trigger2.num += number;
            }
            player2.storage.newjiyinmrfz_tmp.remove(trigger2.card);
          }).vars({ number: num });
        }
      },
      group: "newjiyinmrfz_sha",
      subSkill: {
        sha: {
          trigger: {
            player: "useCardToPlayered"
          },
          silent: true,
          filter: function(event2, player2) {
            if (event2.card.name != "sha" || event2.getParent().directHit.includes(event2.target)) return false;
            return lib.skill.newjiyinmrfz.getMeetCondition(event2, player2, event2.target) > 0;
          },
          logTarget: "target",
          content: function() {
            var id = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
              map[id].shanRequired++;
            } else {
              map[id].shanRequired = 1 + lib.skill.newjiyinmrfz.getMeetCondition(event, player, trigger.target);
            }
          }
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter(player2, tag, arg) {
          let num = lib.skill.newjiyinmrfz.getMeetCondition(_status.event, player2, arg.target);
          if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > num) return false;
        }
      }
    },
    // 乌尔比安
    piweimrfz: {
      audio: 2,
      trigger: {
        player: "turnOverAfter"
      },
      filter(event2, player2) {
        return player2.countCards("h") > 0 && player2.hasUseTarget("chuqibuyi");
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseControl("club", "spade", "diamond", "heart", "cancel2").set(
          "prompt",
          "你可以将一种颜色的所有手牌当做任意花色且伤害基数为2的【出其不意】使用，若此牌造成伤害，受到伤害的角色依次弃置装备区和手牌区的一张牌。"
        ).set("ai", () => {
          var player3 = get.event().player;
          if (!game.hasPlayer((current) => {
            return current != player3 && player3.canUse("chuqibuyi", current) && get.attitude(current, player3) < 0;
          }))
            return "cancel2";
          return lib.suit.randomGet();
        });
        event2.result = {};
        if (result2.control === "cancel2") event2.result.bool = false;
        else event2.result.bool = true;
        event2.result.cost_data = result2;
      },
      async content(event2, trigger2, player2) {
        let suit = event2.cost_data.control;
        let color = new Set(player2.getCards("h").map((i2) => get.color(i2)));
        const { control } = color.size === 1 ? { control: player2.getCards("h") } : await player2.chooseControl("red", "black").set("prompt", "请选择一种颜色").set("ai", () => {
          var player3 = get.event().player, red = 0, black = 0;
          for (var i2 of player3.getCards("h", {
            color: "red"
          })) {
            red += get.value(i2);
          }
          for (var i2 of player3.getCards("h", {
            color: "black"
          })) {
            black += get.value(i2);
          }
          return red > black ? "black" : "red";
        }).forResult();
        player2.chooseUseTarget(
          {
            name: "chuqibuyi",
            suit,
            piweimrfz_chuqi: true
          },
          typeof control === "string" ? player2.getCards("h", { color: control }) : control
        );
      },
      group: ["piweimrfz_damage", "piweimrfz_discard"],
      subSkill: {
        discard: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { source: "damageEnd" },
          filter(event2, player2) {
            return event2.player && event2.player.isIn() && event2.card && event2.card.piweimrfz_chuqi == true;
          },
          async content(event2, trigger2, player2) {
            let target2 = trigger2.player;
            target2.chooseToDiscard(true).set("position", "he").set("prompt", `【辟纬】:请选择弃置手牌区和装备区的各一张牌`).set("ai", (card) => {
              get.event().player;
              return 7 - get.value(card);
            }).set("filterCard", (card) => {
              get.event().player;
              var cards2 = ui.selected.cards;
              if (cards2.length == 0) return true;
              for (var i2 of cards2) {
                if (get.position(i2) == get.position(card)) return false;
              }
              return true;
            }).set("selectCard", () => {
              var player3 = get.event().player, pos = [];
              for (var i2 of player3.getCards("he")) {
                if (get.position(i2) == "h") pos.add("h");
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
          filter(event2, player2) {
            return event2.card && event2.card.piweimrfz_chuqi == true;
          },
          content() {
            trigger.baseDamage = 2;
          }
        }
      },
      ai: {
        threaten: 1.2
      }
    },
    guqianmrfz: {
      audio: 2,
      trigger: {
        global: ["loseAfter", "loseAsyncAfter"]
      },
      usable: 1,
      filter(event2, player2) {
        if (event2.type != "discard" || event2.position != ui.discardPile || event2.player == player2) return false;
        var cards2 = event2.getd();
        if (!cards2.filter((card) => get.position(card, true) == "d").length) return false;
        return true;
      },
      prompt2(event2, player2) {
        return `你可以摸一张牌，然后若你手牌中没有相同花色的牌，你重置此技能，反之，你将武将牌翻面。`;
      },
      async content(event2, trigger2, player2) {
        await player2.draw();
        let suitCards = player2.getCards("h").map((card) => get.suit(card));
        let suitList = new Set(suitCards);
        if (suitCards.length != suitList.size) {
          player2.turnOver();
          return;
        }
        delete player2.getStat("skill")["guqianmrfz"];
        if (player2.storage.counttrigger && player2.storage.counttrigger["guqianmrfz"]) delete player2.storage.counttrigger["guqianmrfz"];
        game.log(player2, "重置了技能", `#g【孤潜】`);
      }
    },
    tongmaimrfz: {
      audio: 2,
      audioname: ["wuerbianmrfz", "spyoulingshamrfz", "sikadimrfz", "geleidiyamrfz", "anzhelamrfz"],
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        if (Array.isArray(player2.storage.tongmaimrfz) && player2.storage.tongmaimrfz.length > 1) return false;
        return _status.currentPhase != player2 && game.hasPlayer((current) => {
          return current.hasClan("深海猎人");
        });
      },
      async cost(event2, trigger2, player2) {
        let prompt2 = `你可以令一名深海猎人的角色回复一点体力或复原武将牌`, storage = player2.storage.tongmaimrfz;
        if (storage.includes(0)) prompt2 = prompt2.replace("回复一点体力或", "");
        if (storage.includes(1)) prompt2 = prompt2.replace("或复原武将牌", "");
        const { result: result2 } = await player2.chooseTarget().set("prompt", get.prompt("tongmaimrfz")).set("prompt2", prompt2).set("filterTarget", (card, player3, target2) => {
          var storage2 = _status.event.storage;
          if (!target2.hasClan("深海猎人") && target2 != player3) return false;
          if (storage2.includes(1)) return target2.getDamagedHp() > 0;
          return true;
        }).set("ai", (target2) => {
          var player3 = get.event().player;
          return get.attitude(target2, player3) > 0 && (target2.getDamagedHp() > 0 || target2.isTurnedOver() || target2.isLinked());
        }).set("storage", storage);
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.targets[0];
        if (!Array.isArray(player2.storage.tongmaimrfz)) player2.storage.tongmaimrfz = [];
        if (player2.storage.tongmaimrfz.includes(0)) {
          target2.link(false);
          target2.turnOver(false);
          player2.storage.tongmaimrfz.add(1);
          return;
        }
        if (player2.storage.tongmaimrfz.includes(1)) {
          target2.recover();
          player2.storage.tongmaimrfz.add(0);
          return;
        }
        if (target2.getDamagedHp() == 0) {
          target2.link(false);
          target2.turnOver(false);
          player2.storage.tongmaimrfz.add(1);
          return;
        }
        const { index } = await player2.chooseControl().set("choiceList", [`令${get.translation(target2)}回复一点体力`, `令${get.translation(target2)}复原武将牌`]).set("prompt", "请选择一项").set("ai", () => {
          var target3 = _status.event.targetx;
          get.event().player;
          if (target3.isTurnedOver()) return 1;
          return 0;
        }).set("targetx", target2).forResult();
        if (index === 0) target2.recover();
        if (index === 1) {
          target2.link(false);
          target2.turnOver(false);
        }
        player2.storage.tongmaimrfz.add(index);
      },
      group: "tongmaimrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          lastDo: true,
          trigger: { global: "roundStart" },
          content() {
            player.storage.tongmaimrfz = [];
          }
        }
      }
    },
    // 新 斯卡蒂
    jingliemrfz: {
      audio: 2,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseTarget().set("prompt", get.prompt("shulangmrfz")).set(
          "prompt2",
          `你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
        ).set("filterTarget", (card, player3, target2) => player3 != target2 && target2.countCards("h") > 0).set("ai", (target2) => {
          var player3 = get.event().player;
          var att = get.attitude(player3, target2), num = 0;
          if (att >= 0) num += 2;
          else num += 5 + target2.getDamagedHp();
          return num += target2.countCards("h") / 2;
        });
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.targets[0];
        if (target2.countCards("h") == 1) player2.viewHandcards(target2);
        const { links } = await player2.choosePlayerCard(target2, true, "visible").set("prompt", "【鲸猎】:请选择一张牌").set("position", "h").set("ai", (button) => {
          var player3 = get.event().player, num = get.value(button);
          if (player3.hasUseTarget(button, false)) num += 10;
          if (get.tag(button, "damage")) num += 2;
          if (get.type2(button) == "equip") num -= 10;
          return num;
        }).forResult();
        if (!links) return;
        let choiceList = [
          `失去一点体力，令${get.translation(player2)}获得${get.translation(links[0])}`,
          `令${get.translation(player2)}视为使用${get.translation(links[0])}，若此牌不能被${get.translation(player2)}使用，则改为摸一张牌，然后本回合结束阶段时${get.translation(player2)}发动一次【鲸猎】`,
          `对${get.translation(player2)}使用一张【杀】，若此杀造成伤害，${get.translation(player2)}翻面，反之执行其他两项`
        ], list = ["选项一", "选项二"];
        if (target2.hasSha() && target2.canUse({ name: "sha" }, player2, false)) list.push("选项三");
        else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（没有或无法使用【杀】）</span>";
        const { index } = await target2.chooseControl(list).set("choiceList", choiceList).set("ai", () => {
          var player3 = get.event().player, target3 = _status.event.targetx, list2 = _status.event.list, card = _status.event.cardx;
          if (get.attitude(player3, target3) > 0) return 1;
          else {
            if (!target3.hasUseTarget(card, false)) return 1;
            if (list2.length > 2 && target3.mayHaveShan(
              player3,
              "use",
              target3.getCards("h", (i3) => {
                return i3.hasGaintag("sha_notshan");
              })
            ) && Math.random() > 0.5) {
              for (var i2 of player3.getCards("h", "sha")) {
                if (get.effect(target3, i2, player3, player3) > 0) return 2;
              }
            }
            if (player3.hp == 1) return 1;
            return 0;
          }
        }).set("targetx", player2).set("list", list).set("cardx", links[0]).forResult();
        if (typeof index !== "number") return;
        var next = game.createEvent("jingliemrfz_after");
        next.player = player2;
        next.target_jingliemrfz = target2;
        next.card_jingliemrfz = links[0];
        next.setContent(lib.skill.jingliemrfz["index_" + index]);
      },
      async index_0(event2, trigger2, player2) {
        let target2 = event2.target_jingliemrfz, card = event2.card_jingliemrfz;
        await player2.gain(card, "gain2");
        target2.loseHp();
      },
      async index_1(event2, trigger2, player2) {
        event2.target_jingliemrfz;
        let card = event2.card_jingliemrfz;
        if (player2.hasUseTarget(card, false))
          player2.chooseUseTarget(
            {
              name: card.name,
              suit: card.suit,
              number: card.number
            },
            false
          );
        else player2.draw();
        player2.when("phaseJieshuBegin").then(() => {
          if (player2.hasSkill("jingliemrfz_ban") || !game.hasPlayer((current) => lib.skill.jingliemrfz.filter(event2, player2))) return;
          player2.addTempSkill("jingliemrfz_ban", "phaseJieshuEnd");
          player2.chooseTarget().set("prompt", get.prompt("jingliemrfz")).set(
            "prompt2",
            `你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
          ).set("filterTarget", (card2, player3, target2) => player3 != target2 && target2.countCards("h") > 0).set("ai", (target2) => {
            var player3 = get.event().player;
            var att = get.attitude(player3, target2), num = 0;
            if (att >= 0) num += 2;
            else num += 5 + target2.getDamagedHp();
            return num += target2.countCards("h") / 2;
          });
        }).then(() => {
          if (result.bool) {
            var target2 = result.targets[0];
            player2.logSkill("jingliemrfz", target2);
            var next = game.createEvent("jingliemrfz_phaseJieshu");
            next.player = player2;
            next.targets = result.targets;
            next.setContent(lib.skill.jingliemrfz.content);
          }
        });
      },
      async index_2(event2, trigger2, player2) {
        let target2 = event2.target_jingliemrfz, card = event2.card_jingliemrfz;
        await target2.chooseToUse(
          function(card2, player3, event3) {
            if (get.name(card2) != "sha") return false;
            return true;
          },
          "【鲸猎】:对" + get.translation(player2) + "使用一张杀"
        ).set("forced", true).set("targetRequired", true).set("complexSelect", true).set("filterTarget", function(card2, player3, target3) {
          if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return player3.canUse({ name: "sha" }, target3, false);
        }).set("sourcex", player2);
        if (target2.hasHistory("useCard", (evt) => {
          return evt.getParent(2) == event2 && target2.hasHistory("sourceDamage", (evtx) => evt.card == evtx.card);
        }))
          player2.turnOver();
        else {
          for (var i2 = 0; i2 < 2; i2++) {
            var next = game.createEvent("jingliemrfz_noDamage");
            next.player = player2;
            next.target_jingliemrfz = target2;
            next.card_jingliemrfz = card;
            next.setContent(lib.skill.jingliemrfz["index_" + i2]);
          }
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    shulangmrfz: {
      audio: "zhangenmrfz",
      trigger: {
        target: "useCardToTargeted"
      },
      filter(event2, player2) {
        return event2.card && event2.card.name == "sha" && player2.hasSha() && lib.filter.targetEnabled({ name: "sha" }, player2, event2.player);
      },
      check(event2, player2) {
        for (var i2 of player2.getCards("hes", "sha")) {
          if (get.effect(event2.player, i2, player2, player2) > 0 && get.attitude(player2, event2.player) < 0) {
            return true;
          }
        }
        return false;
      },
      prompt2(event2, player2) {
        return "你可以对" + get.translation(event2.player) + "使用一张杀";
      },
      async content(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseToUse(function(card, player3, event3) {
          if (get.name(card) != "sha") return false;
          return true;
        }, "请使用一张【杀】").set("forced", true).set("targetRequired", true).set("complexSelect", true).set("shulangmrfz_card", true).set("filterTarget", function(card, player3, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return player3.canUse({ name: "sha" }, target2, false);
        }).set("sourcex", trigger2.player);
        if (player2.hasHistory("useCard", (evt) => {
          return evt && evt.card && evt.name == "useCard" && player2.hasHistory("sourceDamage", (evtx) => {
            return evt.card == evtx.card;
          });
        })) {
          trigger2.getParent().excluded.addArray(trigger2.targets);
          if (trigger2.player.countGainableCards(player2, "he"))
            player2.gainPlayerCard("he", trigger2.player, true).set("target", trigger2.player).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
        }
      },
      group: "shulangmrfz_need",
      subSkill: {
        need: {
          trigger: { player: "useCardToPlayered" },
          filter(event2, player2) {
            return event2.getParent(3).name == "shulangmrfz" && event2.card && event2.card.name == "sha";
          },
          silent: true,
          async content(event2, trigger2, player2) {
            const id = trigger2.target.playerid;
            const map = trigger2.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
              map[id].shanRequired++;
            } else {
              map[id].shanRequired = 2;
            }
          }
        }
      }
    },
    // 新 歌蕾蒂娅
    quliemrfz: {
      intro: {
        markcount: "expansion",
        mark: function(dialog, storage, player2) {
          var cards2 = player2.getExpansions("quliemrfz");
          if (player2.isUnderControl(true)) dialog.addAuto(cards2);
          else return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      },
      onremove(player2) {
        game.countPlayer((current) => {
          var cards2 = current.getExpansions("quliemrfz");
          if (cards2) current.loseToDiscardpile(cards2);
        });
      },
      audio: "ronghangmrfz",
      trigger: { player: "useCard" },
      filter(event2, player2) {
        return get.tag(event2.card, "damage") && game.hasPlayer((current) => {
          return current != player2 && !current.hasMark("quliemrfz_eff");
        });
      },
      check(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && !current.hasMark("quliemrfz_eff") && get.attitude(player2, current) < 0;
        });
      },
      prompt2: "当你使用带有伤害类标签的牌时，你可以令其他角色若在此牌结算完成前使用或打出牌后，其须将一半（向上取整）的牌置于武将牌上",
      async content(event2, trigger2, player2) {
        game.countPlayer((current) => {
          if (current == player2) return;
          current.addMark("quliemrfz_eff", 1, false);
        });
        if (!player2.storage.newxunxiangmrfz) player2.storage.newxunxiangmrfz = [];
        player2.storage.newxunxiangmrfz.add(trigger2.card);
        player2.when("useCardAfter").filter((event3, player3) => {
          return player3.storage.newxunxiangmrfz.includes(event3.card);
        }).then(() => {
          game.countPlayer((current) => {
            current.removeMark("quliemrfz_eff", 1, false);
          });
          player2.storage.newxunxiangmrfz.remove(trigger2.card);
        }).assign({ lastDo: true });
      },
      group: ["quliemrfz_eff", "quliemrfz_die"],
      subSkill: {
        die: {
          charlotte: true,
          silent: true,
          trigger: { global: "dieAfter" },
          forceDie: true,
          filter(event2, player2) {
            return event2.player.getExpansions("quliemrfz").length;
          },
          content() {
            trigger.player.loseToDiscardpile(trigger.player.getExpansions("quliemrfz"));
          }
        },
        eff: {
          charlotte: true,
          silent: true,
          firstDo: true,
          trigger: {
            global: ["useCardAfter", "respondAfter", "phaseZhunbeiBegin"]
          },
          filter(event2, player2) {
            if (event2.name == "phaseZhunbei") {
              return event2.player.getExpansions("quliemrfz").length > 0;
            } else return event2.player.countCards("h") > 0 && event2.player != player2 && event2.player.hasMark("quliemrfz_eff");
          },
          async content(event2, trigger2, player2) {
            if (trigger2.name == "phaseZhunbei") {
              var current = trigger2.player;
              var cards2 = current.getExpansions("quliemrfz");
              const { links } = new Set(cards2.map((i2) => get.type2(i2, current))).size == 1 ? { links: [] } : await current.chooseCardButton(cards2).set("prompt", `请选择至少两张不同类型的牌`).set("selectButton", [2, Infinity]).set("filterButton", (button) => {
                var player3 = get.event().player, cards3 = ui.selected.buttons;
                return !cards3.some((cardx) => get.type2(cardx, player3) == get.type2(button, player3));
              }).set("ai", (button) => {
                return get.value(button.link, _status.event.player);
              }).forResult();
              if (links.length > 0) {
                current.gain(links, "draw");
                game.log(current, "收回了" + get.cnNumber(links.length) + "因【驱猎】而置于武将牌上的张牌");
              }
              if (cards2.length != links.length) current.discard(cards2.removeArray(links));
              current.unmarkSkill("quliemrfz");
            } else {
              let current2 = trigger2.player;
              var num = Math.ceil(current2.countCards("h") / 2);
              const { cards: cards3 } = await current2.chooseCard(true).set("prompt", `请选择${get.cnNumber(num, false)}张牌`).set("selectCard", num).set("ai", (card) => {
                get.event().player;
                return 6 - get.value(card);
              }).forResult();
              current2.addToExpansion(cards3, "giveAuto", current2).gaintag.add("quliemrfz");
              current2.markSkill("quliemrfz");
            }
          }
        }
      }
    },
    newxunxiangmrfz: {
      audio: "xunxiangmrfz",
      trigger: {
        global: "phaseJieshuBegin"
      },
      filter(event2, player2) {
        var cards2 = lib.skill.zheqimrfz_eff2.getDiscard(event2);
        return cards2.length > 0 && player2.canCompare(event2.player);
      },
      prompt2(event2, player2) {
        return `你可以与${get.translation(event2.player)}进行拼点，若你赢，你获得其本回合因弃置而进入弃牌堆的不同类型的牌各一张，并将拼点牌当雷【杀】对其使用`;
      },
      check(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      async content(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseToCompare(trigger2.player);
        if (result2.bool) {
          var discards = lib.skill.zheqimrfz_eff2.getDiscard(trigger2);
          const { links } = new Set(discards.map((i2) => get.type(i2))).size <= 1 ? { links: discards } : await player2.chooseCardButton(discards).set("prompt", `请选择不同类型的牌`).set("selectButton", [0, Infinity]).set("filterButton", (button) => {
            var player3 = get.event().player, cards3 = ui.selected.buttons;
            return !cards3.some((cardx) => get.type(cardx, player3) == get.type(button, player3));
          }).set("ai", (button) => {
            return get.value(button.link, _status.event.player);
          }).forResult();
          if (links) player2.gain(links, "gain2");
          var cards2 = [result2.player, result2.target];
          cards2 = cards2.filter((i2) => get.position(i2) == "d");
          if (cards2.length > 0 && player2.canUse(
            {
              name: "sha",
              cards: cards2,
              nature: "thunder"
            },
            trigger2.player,
            false
          )) {
            player2.useCard({ name: "sha", nature: "thunder" }, cards2, trigger2.player);
          }
        }
      }
    },
    xueshuomrfz: {
      audio: 2,
      trigger: {
        source: "damageBegin3"
      },
      filter(event2, player2) {
        return player2.countCards("h") >= event2.player.countCards("h");
      },
      prompt2(event2, player2) {
        return `你可以令${get.translation(event2.player)}额外受到1点伤害`;
      },
      check(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      content() {
        trigger.num++;
      }
    },
    // 妮芙
    xunxinmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return !current.hasCard((card) => get.is.shownCard(card), "h") && current.countCards("h") > 0;
        });
      },
      filterTarget(card, player2, target2) {
        return !target2.hasCard((card2) => get.is.shownCard(card2), "h") && target2.countCards("h") > 0;
      },
      prompt: "【巡心】:请选择一名没有明置牌的角色",
      async content(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        const { cards: cards2 } = await player2.choosePlayerCard("h", target2).set("prompt", `请选择明置${get.translation(target2)}一张手牌`).set("visible", true).set("filterButton", (button) => {
          return !get.is.shownCard(button);
        }).set("ai", (button) => {
          let target3 = get.event().target, player3 = get.player();
          let value = get.value(button);
          if (get.attitude(player3, target3) < 0) {
            let value2 = get.value(button);
            return target3.hasUseTarget(button) ? value2 - 10 : value2;
          }
          return value;
        }).set("target", target2).forResult();
        if (!cards2) return;
        await target2.addShownCards(cards2, "visible_xunxinmrfz");
        let showncards = [];
        for (let char of game.players) {
          let shown = char.getCards("h", (card) => get.is.shownCard(card));
          if (shown) showncards.push(...shown);
        }
        let setShown = new Set(showncards.map((i2) => get.type2(i2)));
        let hasTarget = game.hasPlayer((current) => {
          return !current.hasCard((card) => get.is.shownCard(card), "h") && current.countCards("h") > 0;
        });
        if (setShown.size === showncards.map((i2) => get.type2(i2)).length && hasTarget) {
          const { targets: targets2 } = await player2.chooseTarget().set("prompt", `【巡心】:请选择一名没有明置牌的角色`).set("ai", (target3) => {
            let player3 = get.player();
            return get.attitude(player3, target3) < 0;
          }).set("filterTarget", function(card, player3, target3) {
            return !target3.hasCard((card2) => get.is.shownCard(card2), "h") && target3.countCards("h") > 0;
          }).forResult();
          if (!targets2) return;
          player2.logSkill("xunxinmrfz", targets2[0]);
          var next = game.createEvent("xunxinmrfz_cycle");
          next.player = player2;
          next.target = targets2[0];
          next.targets = targets2;
          next.setContent(lib.skill.xunxinmrfz.content);
        }
      }
    },
    chixinmrfz: {
      audio: 2,
      global: "chixinmrfz_eff",
      subSkill: {
        eff: {
          forced: true,
          silent: true,
          charlotte: true,
          mod: {
            aiOrder(player2, card, num) {
              if (!player2.hasCard((card2) => get.is.shownCard(card2), "h")) return;
              if (!get.is.shownCard(card)) {
                let shown = player2.getCards("h", (card2) => get.is.shownCard(card2));
                if (shown.length > 1) return num - 10;
                return num + get.value({ name: card.name }) - get.value(shown[0]);
              }
              if (get.name(card) == "sha" && player2.getCardUsable("sha") < 2) return num + 10;
              if (get.name(card) == "tao" && player2.getDamagedHp() == 1) return num + 10;
              if (get.name(card) == "jiu" && player2.getCardUsable("jiu") < 2 && player2.isPhaseUsing()) return num + 10;
              if (get.name(card) == "wuxie") return num + 10;
            },
            cardname(card, player2, name) {
              let shown = player2.getCards("h", (card2) => get.is.shownCard(card2));
              if (shown && shown.length == 1 && lib.card[shown[0].name].type != "equip") {
                return shown[0].name;
              } else if (shown && (shown.length > 1 || shown.length == 1 && lib.card[shown[0].name].type == "equip")) {
                return "wuxie";
              }
            }
          }
        }
      }
    },
    kuixinmrfz: {
      audio: 2,
      trigger: {
        source: "damageEnd"
      },
      filter(event2, player2) {
        return event2.player != player2 && event2.player.isIn() && event2.player.countCards("h") > 0;
      },
      prompt2(event2, player2) {
        let tran = get.translation(event2.player);
        return `是否令${tran}所有的[明置/暗置]牌[暗置/明置]，然后${tran}弃置两张暗置的牌？`;
      },
      check(event2, player2) {
        return get.attitude(event2.player, player2) < 0;
      },
      async content(event2, trigger2, player2) {
        const target2 = trigger2.player;
        for (let card of target2.getCards("h")) {
          if (get.is.shownCard(card)) target2.hideShownCards(card);
          else target2.addShownCards(card, "visible_xunxinmrfz");
        }
        let { promise, resolve } = Promise.withResolvers();
        setTimeout(() => {
          resolve();
        }, 10);
        await promise;
        if (target2.countCards("h", (card) => !get.is.shownCard(card)) > 0) {
          target2.chooseToDiscard(true, 2).set("prompt", `【溃心】:请弃置两张暗置的牌`).set("filterCard", (card) => !get.is.shownCard(card)).set("ai", (card) => get.value({ name: card.name }));
        }
      }
    },
    // 娜仁图亚
    /** @type { Skill } */
    eyanmrfz: {
      audio: 2,
      trigger: { player: "useCardEnd" },
      filter(event2, player2) {
        let card = event2.card;
        return event2.cards.someInD() && get.tag(card, "damage") && game.hasPlayer((current) => player2 != current && current.inRangeOf(player2));
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("eyanmrfz")).set("prompt2", "你可以将此牌交给攻击范围内的一名其他角色").set("filterTarget", (card, player3, target2) => player3.inRange(target2) && player3 != target2).set("ai", (target2) => {
          const player3 = get.player();
          let subtraction = player3.maxHp - target2.maxHp;
          let num = get.attitude(player3, target2) > 0 ? 0 : -2;
          if (get.attitude(player3, target2) < 0 && subtraction - 1 >= target2.countCards("h")) return 114514;
          return num - get.value(get.event().cardx) * 0.5 + Math.min(subtraction, target2.countCards("h")) * 2;
        }).set("cardx", trigger2.card).forResult();
      },
      async content(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        await player2.give(trigger2.cards.filterInD(), target2);
        let num = player2.maxHp - target2.maxHp;
        if (num < 1) return;
        const { cards: cards2 } = num >= target2.countCards("h", (card) => !get.is.shownCard(card)) ? { cards: target2.getCards("h", (card) => !get.is.shownCard(card)) } : await target2.chooseCard().set("prompt", `【恶魇】:请展示${num}张手牌`).set("forced", true).set("ai", (card) => -get.value(card)).set("filterCard", (card) => !get.is.shownCard(card)).set("selectCard", num).forResult();
        if (!cards2) return;
        target2.addShownCards(cards2, "visible_eyanmrfz");
      }
    },
    shafeimrfz: {
      audio: 2,
      trigger: { global: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return player2 != event2.player && event2.player.countCards("h", (card) => get.is.shownCard(card)) > 0;
      },
      prompt2(event2, player2) {
        const cards2 = event2.player.getCards("h", (card) => get.is.shownCard(card));
        return `你可以获得${get.translation(event2.player)}的${cards2.length}张牌(${get.translation(cards2)})`;
      },
      async content(event2, trigger2, player2) {
        const cards2 = trigger2.player.getCards("h", (card) => get.is.shownCard(card));
        player2.gain(cards2, "gain2");
      }
    },
    // 佩佩
    boqingmrfz: {
      audio: 2,
      trigger: {
        player: "drawBegin",
        global: "judgeBegin"
      },
      async content(event2, trigger2, player2) {
        let cards2 = get.cards(4);
        let originalHandCards = player2.getCards("h");
        const { moved } = await player2.chooseToMove("【博青】:你可以交换牌堆顶和你的手牌并任意顺序放回牌堆顶或牌堆底").set("list", [["牌堆顶", cards2], ["牌堆底"], ["你的手牌", player2.getCards("h")]]).set("processAI", (list) => {
          let moved2 = [[], [], []];
          let top2 = list[0][1];
          let originalHandCards2 = get.event().originalHandCards.slice();
          _status.currentPhase;
          get.event().evt;
          let player3 = get.player();
          let all = [...top2, ...list[2][1]];
          all.sort(function(a, b) {
            return get.value(b, player3) - get.value(a, player3);
          });
          for (let i3 = 0; i3 < originalHandCards2.length; i3++) {
            moved2[2].push(all.shift());
          }
          while (all) {
            if (get.value(all[0], player3) <= 5) break;
            moved2[1].push(all.shift());
          }
          moved2[0].addArray(all);
          return moved2;
        }).set("filterOk", (moved2) => {
          let originalHandCards2 = get.event().originalHandCards;
          return moved2[2].length == originalHandCards2.length;
        }).set("evt", event2).set("originalHandCards", originalHandCards).forResult();
        if (!moved) return;
        const puts = player2.getCards("h", (i3) => moved[0].includes(i3) || moved[1].includes(i3));
        const gains = cards2.filter((i3) => moved[2].includes(i3));
        if (puts.length && gains.length) {
          player2.$throw(puts.length, 1e3);
          await player2.gain(gains, "giveAuto");
        }
        const top = moved[0];
        const bottom = moved[1];
        top.reverse();
        for (var i2 = 0; i2 < top.length; i2++) {
          ui.cardPile.insertBefore(top[i2], ui.cardPile.firstChild);
        }
        for (i2 = 0; i2 < bottom.length; i2++) {
          ui.cardPile.appendChild(bottom[i2]);
        }
        game.addCardKnower(top, player2);
        game.addCardKnower(bottom, player2);
        player2.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
        game.log(player2, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
        game.updateRoundNumber();
      }
    },
    kuisuimrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      getLastAction(player2) {
        const cards2 = [];
        const history = game.getAllGlobalHistory();
        if (history.length < 2) return [];
        const last = history[history.length - 2];
        if (last["cardMove"].length < 1) return [];
        for (let evt of last["cardMove"]) {
          if (!evt.cards) continue;
          for (let card of evt.cards) {
            if (get.position(card, true) == "d" && get.type(card) != "equip" && player2.hasUseTarget(card, false)) cards2.push(card);
          }
        }
        return cards2;
      },
      filter(event2, player2) {
        const cards2 = lib.skill.kuisuimrfz.getLastAction(player2);
        return player2.countCards("he") > 0 && cards2.length > 0;
      },
      filterCard: true,
      position: "he",
      check(card) {
        return 6 - get.value(card);
      },
      discard: false,
      lose: false,
      async content(event2, trigger2, player2) {
        event2.cards[0];
        let names = [...new Set(lib.skill.kuisuimrfz.getLastAction(player2).map((i3) => i3.name))];
        let list = [];
        for (var i2 = 0; i2 < names.length; i2++) {
          var name = names[i2];
          if (get.type(name) == "basic") list.push(["基本", "", name]);
          else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
        }
        const { links } = await player2.chooseButton(["窥岁", [list, "vcard"]]).set("ai", (button) => {
          let player3 = get.player(), card = {
            name: button.link[2]
          };
          return player3.getUseValue(card, null, true);
        }).forResult();
        if (!links) return;
        player2.chooseUseTarget({ name: links[0][2], isCard: true }, event2.cards);
      },
      ai: {
        order: 5,
        result: {
          player: 1
        }
      }
    },
    lianwenmrfz: {
      audio: 2,
      trigger: { player: "damageBegin4" },
      usable: 1,
      filter(event2, player2) {
        return event2.num > 0;
      },
      check(event2, player2) {
        if (!event2.source) return true;
        return get.attitude(event2.source, player2) < 0 || player2.hp == 1 || event2.card && get.type2(event2.card) == "trick";
      },
      prompt2(event2, player2) {
        return `你可以进行一次判定，若为红，此伤害-1${event2.source ? `且${get.translation(event2.source)}手牌上限-1直到其回合结束` : ""}`;
      },
      async content(event2, trigger2, player2) {
        const next = player2.judge(function(card) {
          const color2 = get.color(card);
          if (color2 == "red") return 4;
          return 0;
        });
        next.judge2 = function(result2) {
          return result2.bool == false;
        };
        const { color } = await next.forResult();
        if (color == "red") {
          trigger2.num--;
          trigger2.source.addTempSkill("lianwenmrfz_eff", { player: "phaseEnd" });
          trigger2.source.addMark("lianwenmrfz_eff", 1, false);
        }
      },
      subSkill: {
        eff: {
          charlotte: true,
          onremove: true,
          intro: {
            content(event2, player2) {
              return `·手牌上限-${player2.countMark("lianwenmrfz_eff")}`;
            }
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num -= player2.countMark("lianwenmrfz_eff");
            }
          }
        }
      }
    }
  }
};
export {
  legend4SJZX as default
};
//# sourceMappingURL=legend4SJZX.js.map
