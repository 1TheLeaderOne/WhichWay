import { get, game, _status, lib, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("lingmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "suimrfz",
  hp: 3,
  skills: ["shixingmrfz", "zuimengmrfz", "haojiumrfz"]
});
skill({
  "shixingmrfz": {
    intro: {
      content: "expansion",
      markcount: "expansion"
    },
    onremove: function(player, skill2) {
      var cards = player.getExpansions(skill2);
      if (cards.length) player.loseToDiscardpile(cards);
    },
    mark: true,
    audio: 6,
    trigger: { player: "phaseZhunbeiBegin" },
    filter: function(event, player) {
      return player.countCards("he") > 0;
    },
    check: function(event, player) {
      if (player.getExpansions("shixingmrfz").filter(function(magic) {
        return get.type2(magic) == "equip";
      }).length && player.hasCard(function(card) {
        return get.type(card) == "equip";
      }))
        return true;
      if (player.countCards("h") < 3 && player.getExpansions("shixingmrfz").length) return false;
      return true;
    },
    async content(event, trigger, player) {
      const expansions = player.getExpansions("shixingmrfz");
      let prompt = (player2) => {
        const exps = player2.getExpansions("shixingmrfz");
        if (exps.length === 0) return "【诗形】:请选择至多两张至于你的武将牌上";
        else if (exps.length === 1) {
          return `【诗形】:请选择将一张${get.translation(exps[0])}牌至于你的武将牌上，或弃置因此技能而置于武将牌上的所有牌，并重新选择两张牌置于武将牌上`;
        } else {
          return `【诗形】：弃置因此技能而置于武将牌上的所有牌（当前武将牌上的牌的类型：${get.translation(exps[0])}），然后选择两张牌置于武将牌上`;
        }
      };
      const { cards } = await player.chooseCard("h").set("prompt", prompt(player)).set("filterCard", (card) => {
        get.player();
        const cards2 = ui.selected.cards;
        if (cards2.length > 0) return get.type2(card) === get.type2(cards2[0]);
        return true;
      }).set("selectCard", [1, 2]).set("ai", (card) => {
        const player2 = get.player(), exps = player2.getExpansions("shixingmrfz");
        let val = 0;
        if (exps.some((card2) => get.type2(card2) === "equip")) {
          if (get.type2(card) === "equip") return -1;
          val -= 8 * Math.random();
        }
        if (get.value(card) < 8) val += 2;
        if (player2.hp < 2 && exps.some((card2) => get.type2(card2) === "trick")) val += 2;
        if (get.type2(card) === "trick") {
          if (player2.skipList.includes("phaseUse")) {
            val -= 10;
          } else val += 4;
        }
        return val;
      }).set("forced", true).set("complexCard", true).set("complexSelect", true).forResult();
      if (!cards) return;
      if (expansions.length < 1) {
        player.addToExpansion(cards, player, "giveAuto").gaintag.add("shixingmrfz");
      } else {
        if (expansions.length === 1 && cards.length === 1 && get.type2(cards[0]) === get.type2(expansions[0])) {
          player.addToExpansion(cards, player, "giveAuto").gaintag.add("shixingmrfz");
        } else {
          await player.discard(expansions);
          player.addToExpansion(cards, player, "giveAuto").gaintag.add("shixingmrfz");
        }
      }
    },
    group: ["shixingmrfz_basic", "shixingmrfz_trick", "shixingmrfz_equip", "shixingmrfz_lose"],
    subSkill: {
      //失去标记
      lose: {
        audio: "shixingmrfz",
        charlotte: true,
        forced: true,
        trigger: {
          player: "loseAfter"
        },
        filter(event, player) {
          const tags = event.gaintag_map;
          return tags && event.cards.some((card) => {
            const id = card.cardid || "";
            return Object.keys(tags).includes(id) && tags[id].includes("shixingmrfz");
          });
        },
        async content(event, trigger, player) {
          const tags = trigger.gaintag_map;
          if (!tags) return;
          const cards = trigger.cards.filter((card) => {
            const id = card.cardid || "";
            return Object.keys(tags).includes(id) && tags[id].includes("shixingmrfz");
          });
          if (!cards) return;
          const type = get.type(cards[0]);
          switch (type) {
            case "basic": {
              const card = get.cardPile((card2) => {
                return get.type2(card2) === "basic";
              });
              if (card) {
                player.gain(card, "gain2");
              } else {
                player.chat("牌堆中没有基本牌！");
              }
              break;
            }
            case "trick": {
              player.recover();
              player.draw();
              break;
            }
            case "equip": {
              if (game.hasPlayer((char) => char !== player && char.countCards("he") > 0)) {
                const { targets } = await player.chooseTarget().set("prompt", "是否发动【诗形】？").set("prompt2", "你可以弃置一名其他角色一张牌").set("filterTarget", (card, player2, target) => {
                  return target !== player2 && target.countCards("he") > 0;
                }).set("ai", (target) => get.attitude2(target) < 0).forResult();
                if (!targets) break;
                player.discardPlayerCard(targets[0], true, "he").set("prompt", "【诗形】:请选择你要弃置的牌");
              }
            }
          }
        }
      },
      //清平
      basic: {
        audio: "shixingmrfz",
        trigger: { player: "damageBegin" },
        filter: function(event, player) {
          return player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "basic";
          }).length;
        },
        async content(event, trigger, player) {
          const cards = player.getExpansions("shixingmrfz");
          let result;
          if (cards.length) {
            result = await player.chooseButton([`选择移去一张"清平"`, cards], true).forResult();
          } else {
            return;
          }
          if (result.bool) {
            await player.loseToDiscardpile(result.links);
          }
          trigger.num--;
          player.popup("清平");
          game.log(player, "移去了一张'清平'");
        }
      },
      //弦惊
      equip: {
        audio: "shixingmrfz",
        forced: true,
        trigger: { player: "phaseDrawBegin2" },
        filter: function(event, player) {
          return player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "equip";
          }).length > 1;
        },
        async content(event, trigger, player) {
          trigger.num += 2;
          player.popup("弦惊");
        },
        mod: {
          maxHandcard: function(player, num) {
            if (player.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "equip";
            }).length)
              return num + 2;
          },
          cardUsable: function(card, player, num) {
            if (card.name == "sha" && player.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "equip";
            }).length > 1)
              return num + 2;
          }
        }
      },
      //逍遥
      trick: {
        audio: "shixingmrfz",
        enable: "phaseUse",
        filter: function(event, player) {
          return player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "trick";
          }).length > 0 && event.filterCard({ name: "sha" }, player, event);
        },
        chooseButton: {
          dialog: function(event, player) {
            return ui.create.dialog("逍遥", player.getExpansions("shixingmrfz"), "hidden");
          },
          backup: function(links, player) {
            return {
              filterCard: function() {
                return false;
              },
              selectCard: -1,
              filterTarget: function(card, player2, target) {
                return target != player2 && player2.inRange(target);
              },
              card: links[0],
              content: lib.skill.shixingmrfz_trick.contentx,
              ai: {
                order: 8,
                respondSha: true,
                result: {
                  target: -1
                }
              }
            };
          },
          prompt: function() {
            return "请选择【杀】的目标";
          }
        },
        async contentx(event, trigger, player) {
          const { target } = event;
          const card = lib.skill.shixingmrfz_trick_backup.card;
          player.addTempSkill("shixingmrfz_damage", "shaEnd");
          player.addTempSkill("shixingmrfz_sha", "useCardAfter");
          await player.useCard({ name: "sha", isCard: true }, true, target);
          game.log(player, "视为对", target, "使用【杀】");
          player.logSkill("shixingmrfz");
          if (!player.storage.shixingmrfz_damage) {
            await player.loseToDiscardpile(card);
          } else {
            await player.gain(card, "gain2");
            player.storage.shixingmrfz_damage = false;
          }
        },
        ai: {
          respondSha: true,
          order: 4,
          skillTagFilter: function(player, tag, arg) {
            if (player.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "trick";
            }).length < 1)
              return false;
            if (arg != "use") return false;
          },
          result: {
            player: 1
          }
        }
      },
      damage: {
        direct: true,
        trigger: { player: "shaMiss" },
        silent: true,
        charlotte: true,
        async content(event, trigger, player) {
          player.storage.shixingmrfz_damage = true;
        }
      },
      sha: {
        direct: true,
        silent: true,
        trigger: { player: "useCard" },
        filter: function(event, player) {
          return event.card.name == "sha";
        },
        async content(event, trigger, player) {
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            player.getStat().card.sha--;
          }
        }
      }
    },
    ai: {
      threaten: function(player) {
        if (player.getExpansions("shixingmrfz").filter(function(magic) {
          return get.type2(magic) == "basic";
        }).length > 0)
          return 0.8;
        return 1.2;
      }
    }
  },
  "zuimengmrfz": {
    audio: 2,
    enable: "phaseUse",
    unique: true,
    mark: true,
    limited: true,
    skillAnimation: true,
    animationStr: "醉梦",
    animationColor: "fire",
    init: function(player) {
      player.storage.zuimengmrfz = false;
    },
    filter: function(event, player) {
      return !player.storage.zuimengmrfz && player.countCards("h", "jiu") > 0;
    },
    async content(event, trigger, player) {
      let result;
      player.awakenSkill(event.name);
      player.storage.zuimengmrfz = true;
      await player.chooseToUse(
        true,
        (card, player2, event2) => {
          return get.name(card) === "jiu";
        },
        "使用一张【酒】"
      );
      event.num = 0;
      while (event.num < game.players.length) {
        event.num++;
        result = await player.chooseTarget(
          true,
          "【醉梦" + event.num + "/" + game.players.length + "】：选择一名角色，获得其区域内一张牌",
          (card, player2, target) => {
            return target.countMark("zuimengmrfz_remove") < 2;
          }
        ).set("ai", (target) => {
          const aiPlayer = _status.event.player;
          const att = get.attitude(aiPlayer, target);
          if (att < 0) {
            return -Math.sqrt(-att);
          } else {
            return Math.sqrt(att);
          }
        }).forResult();
        if (result.targets) {
          const target = result.targets[0];
          if (!target.hasSkill("zuimengmrfz_remove")) {
            target.addTempSkill("zuimengmrfz_remove");
          }
          await player.gainPlayerCard("hej", target, true);
          target.addMark("zuimengmrfz_remove", 1);
          continue;
        } else {
          break;
        }
      }
      if (player.countCards("h") < game.players.length) {
        await player.drawTo(game.players.length);
      }
      if (event.getParent("phaseUse")) event.getParent("phaseUse").skipped = true;
      player.addTempSkill("zuimengmrfz_skip");
    },
    subSkill: {
      remove: {
        silent: true,
        direct: true,
        charlotte: true,
        trigger: { global: "phaseEnd" },
        async content(event, trigger, player) {
          player.removeMark("zuimengmrfz_remove", player.countMark("zuimengmrfz_remove"));
        }
      },
      skip: {
        direct: true,
        charlotte: true,
        silent: true,
        trigger: { player: "phaseDiscardBefore" },
        async content(event, trigger, player) {
          trigger.cancel();
        }
      }
    },
    ai: {
      order: 6,
      threaten: 0.6,
      expose: 0.6,
      result: {
        player: 1
      }
    }
  },
  "haojiumrfz": {
    audio: 2,
    trigger: { player: "useCard" },
    forced: true,
    filter: function(event, player) {
      return event.card.name == "jiu" && player.getDamagedHp() > 0;
    },
    async content(event, trigger, player) {
      player.recover();
    },
    mod: {
      cardUsable: function(card, player, num) {
        if (card.name == "jiu") return Infinity;
      }
    }
  }
});
translate({
  "lingmrfz": "令",
  "shixingmrfz": "诗形",
  "shixingmrfz_info": '①准备阶段，你可以选择放置至多两张相同类别且与武将牌上已有的牌类别相同的牌于你的武将牌上，或弃置武将牌上因此技能放置的所有牌，然后选择至多两张相同类别的牌置于武将牌上，根据牌的类型称为:基本牌："清平";锦囊牌:"逍遥"；装备牌:"弦惊"，并获得不同的效果：</br><span class=firetext>清平</span>：当你受到伤害时，你可以移去一张‘清平’并令此伤害-1；</br><span class=thundertext>逍遥</span>：出牌阶段，你可以选择一个‘逍遥’并选择一名其他角色，然后视为对其使用一张不计入次数限制的【杀】，然后若此【杀】没有造成伤害，你获得你选择的‘逍遥’，反之，你弃置之；</br><span class=greentext>弦惊</span>：1个‘弦惊’:手牌上限+2；2个‘弦惊’:使用【杀】的次数和摸牌阶段摸牌数+2。</br>（‘清平’、‘弦惊’和‘逍遥’标记数量均最多为2）</br>②锁定技，当你移去最后一张[‘清平’/‘逍遥’/‘弦惊’]时，你[从牌堆中获得一张基本牌/回复一点体力，摸一张牌/弃置一名其他角色的一张牌]。',
  "zuimengmrfz": "醉梦",
  "zuimengmrfz_info": "限定技，出牌阶段，你可以使用一张【酒】并获得场上至多X张牌（最多从同一名角色处获得两张牌），然后将手牌补至X张，结束出牌阶段和跳过弃牌阶段。（X=场上存活人数）",
  "haojiumrfz": "好酒",
  "haojiumrfz_info": "锁定技，当你使用【酒】时，你回复一点体力；你使用【酒】无次数限制。"
});
characterTitle("lingmrfz", "<font color=#BFEFFF>千年一梦</font>");
characterIntro("lingmrfz", "令，寓居尚蜀的诗人，与炎国司岁台等政府部门均有联系，在尚蜀事件中接触罗德岛，现通过审核，以访客身份驻留本舰。");
