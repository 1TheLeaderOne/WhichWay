import { get, game, lib, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("midiexiangmrfz", {
  sex: "female",
  group: "luomrfz",
  hp: 3,
  skills: ["zhangyimrfz", "chongjimrfz", "nianshoumrfz"]
});
skill({
  "nianshoumrfz": {
    markimage: "extension/WhichWay/image/skill/mdxnianshoumrfz.png",
    intro: {
      name: "巨剑",
      content: "expansion",
      markcount: "expansion"
    },
    onremove: function(player, skill2) {
      var cards = player.getExpansions(skill2);
      if (cards.length) player.loseToDiscardpile(cards);
    },
    audio: 4,
    enable: "phaseUse",
    filter: function(event, player) {
      if (player.getExpansions("nianshoumrfz").length >= 2) return false;
      return player.hasCard(function(card) {
        return get.subtype(card) == "equip1";
      });
    },
    filterCard: function(card) {
      return get.subtype(card) == "equip1";
    },
    position: "he",
    discard: false,
    async content(event, trigger, player) {
      const { cards } = event;
      player.addToExpansion(cards, player, "give").gaintag.add("nianshoumrfz");
    },
    group: [
      "nianshoumrfz_disable",
      "nianshoumrfz_usesha",
      "nianshoumrfz_eff1",
      "nianshoumrfz_eff2",
      "nianshoumrfz_eff3",
      "nianshoumrfz_eff4",
      "nianshoumrfz_eff5"
    ],
    subSkill: {
      disable: {
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        forced: true,
        charlotte: true,
        filter: function(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
          player.logSkill("nianshoumrfz");
          event.num = 0;
          player.disableEquip("equip1");
          while (event.num < 2) {
            event.num++;
            const card = get.cardPile2((c) => {
              return get.subtype(c) === "equip1";
            });
            if (card) {
              await player.gain(card, "gain2", "log");
            } else {
              player.chat("牌堆中没有武器牌了");
            }
          }
        }
      },
      usesha: {
        audio: "nianshoumrfz",
        trigger: { player: "useCardToPlayered" },
        filter: function(event, player) {
          let targetx = event.targets, num = 0;
          if (targetx.length < 1 || event.card.name != "sha" || player.getExpansions("nianshoumrfz").length == 0) return false;
          if (!event.parent || event.parent.triggeredTargets3.length > 1) return false;
          for (var i = 0; i < targetx.length; i++) {
            if (targetx[i].getExpansions("nianshoumrfz").length < 2) num++;
          }
          return num > 0;
        },
        async cost(event, trigger, player) {
          if (trigger.targets.length === 1) {
            const { bool } = await player.chooseBool(
              "是否将一个'巨剑'置于" + (trigger.targets.length === 1 ? get.translation(trigger.targets[0]) : "其中一个目标") + "的武将牌上"
            ).set("ai", () => {
              return trigger.targets.some((q) => get.attitude(player, q) < 2);
            }).forResult();
            event.result = {
              bool,
              cost_data: {
                target: trigger.targets[0]
              }
            };
          } else {
            const result = await player.chooseTarget(true, (card, player2, target) => {
              return _status.event.targets.includes(target);
            }).set("targets", trigger.targets).set("ai", (target) => {
              return get.attitude(_status.event.player, target) < 2;
            }).forResult();
            event.result = {
              ...result,
              cost_data: {
                target: result?.targets?.[0]
              }
            };
          }
        },
        async content(event, trigger, player) {
          const target = event.cost_data.target;
          const { links } = await player.chooseButton(["选择一个'巨剑'", player.getExpansions("nianshoumrfz")], true).forResult();
          if ((links?.length || 0) < 1) return;
          target.addToExpansion(links, "give").gaintag.add("nianshoumrfz");
        }
      },
      eff1: {
        trigger: {
          player: ["loseAfter", "addToExpansionAfter", "cardsGotoSpecialAfter", "loseAsyncAfter"]
        },
        filter: function(event, player, name) {
          if (event.name == "lose" || event.name == "loseAsync") return event.getlx !== false && event.toStorage == true;
          if (event.name == "cardGotoSpecial") return !event.notrigger;
          return true;
        },
        direct: true,
        charlotte: true,
        async content(event, trigger, player) {
          for (var i = 0; i < player.getExpansions("nianshoumrfz").length; i++) {
            var names = player.getExpansions("nianshoumrfz")[i].name + "_skill";
            if (lib.skill[names]) {
              player.addSkill(names);
            }
          }
        }
      },
      eff2: {
        audio: false,
        trigger: {
          player: "loseAfter"
        },
        filter: function(event, player) {
          const tags = event.gaintag_map;
          if (!tags) return false;
          return event.type === "loseToExpansion" && event.cards.some((card) => {
            const id = card.cardid || "";
            return Object.keys(tags).includes(id) && tags[id].includes("nianshoumrfz");
          });
        },
        lastDo: true,
        direct: true,
        charlotte: true,
        async content(event, trigger, player) {
          const tags = trigger.gaintag_map;
          if (!tags) return;
          const cards = trigger.cards.filter((card) => {
            const id = card.cardid || "";
            return Object.keys(tags).includes(id) && tags[id].includes("nianshoumrfz");
          });
          for (const card of cards) {
            const name = card.name + "_skill";
            if (lib.skill[name] && player.hasSkill(name)) {
              player.removeSkill(name);
            }
          }
        }
      },
      eff3: {
        direct: true,
        charlotte: true,
        trigger: { global: "phaseDrawBegin2" },
        filter: function(event, player) {
          return event.player.getExpansions("nianshoumrfz").length > 0 && event.player != player;
        },
        async content(event, trigger, player) {
          var target = trigger.player;
          trigger.num -= target.getExpansions("nianshoumrfz").length;
          player.logSkill("nianshoumrfz", target);
        }
      },
      eff4: {
        direct: true,
        charlotte: true,
        trigger: { player: "damageBegin3" },
        usable: 1,
        filter: function(event, player) {
          if (event.source == void 0) return false;
          return event.source.getExpansions("nianshoumrfz").length > 0;
        },
        async content(event, trigger, player) {
          trigger.num -= trigger.source.getExpansions("nianshoumrfz").length;
          player.logSkill("nianshoumrfz", trigger.source);
        }
      },
      eff5: {
        direct: true,
        charlotte: true,
        trigger: { player: "phaseZhunbeiBegin" },
        filter: function(event, player) {
          return game.hasPlayer(function(current) {
            return current.getExpansions("nianshoumrfz").length > 0 && current != player;
          });
        },
        async content(event, trigger, player) {
          var list = ["e", "h"];
          for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].getExpansions("nianshoumrfz").length > 0 && game.players[i] != player) {
              for (var j = 0; j < 2; j++) {
                if (game.players[i].countCards(list[j]) > 0) {
                  player.gain(game.players[i].getCards(list[j]).randomGet(), "give");
                  game.log(
                    player,
                    "获得了",
                    game.players[i],
                    "的" + get.translation(game.players[i].getCards(list[j]).randomGet())
                  );
                }
              }
              player.gain(game.players[i].getExpansions("nianshoumrfz"), "give", "log");
              player.logSkill("nianshoumrfz", game.players[i]);
            }
          }
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
  "zhangyimrfz": {
    charlotte: true,
    mod: {
      attackRange: function(player, num) {
        if (player.getExpansions("nianshoumrfz").length) return num + player.getExpansions("nianshoumrfz").length;
      }
    }
  },
  "chongjimrfz": {
    audio: 2,
    trigger: { source: "damageEnd" },
    direct: true,
    filter: function(event, player) {
      if (!event.parent || event.parent.name == "_lianhuan" || event.parent.name == "_lianhuan2") return false;
      if (event.card && event.card.name != "sha") return false;
      if (game.players.length <= 2) return false;
      return event.parent && event.parent.name != "chongjimrfz" && event.num > 0;
    },
    async content(event, trigger, player) {
      const targets = trigger.player;
      const result = await player.chooseTarget(
        get.prompt("chongjimrfz"),
        "你可以对" + get.translation(targets) + "的上家或下家造成一点伤害",
        function(card, player2, target) {
          return (target == targets.getNext() || target == targets.getPrevious()) && target != player2;
        }
      ).set("ai", (target) => -get.attitude(player, target)).forResult();
      if (result.bool && result.targets) {
        result.targets[0].damage();
        if (trigger.num > 0)
          result.targets[0].chooseToDiscard("h", true, get.prompt("chongjimrfz"), "请选择弃置" + trigger.num + "张手牌", trigger.num);
        player.logSkill("chongjimrfz", result.targets[0]);
      }
    }
  }
});
translate({
  "midiexiangmrfz": "迷迭香",
  "nianshoumrfz": "念手",
  "nianshoumrfz_info": "①出牌阶段，你可以将一张武器牌置于你的武将牌上，称为‘巨剑’（上限为2），你视为装备了‘巨剑’。②当你使用【杀】指定目标后，若目标武将牌上的‘巨剑’小于等于1，你可以选择获得一张‘巨剑’并将其置于目标的武将牌上，使其摸牌阶段摸牌数和本回合第一次对你造成的伤害-X（X=其‘巨剑’标记数）。③锁定技，你的准备阶段，你随机获得所有有‘巨剑’标记角色的装备区和手牌的各一张牌，然后你获得其武将牌上的所有‘巨剑’牌；游戏开始时，你从牌堆中获得两张武器牌并废除你的武器栏。",
  "nianshoumrfz2": "念手",
  "zhangyimrfz": "胀意",
  "zhangyimrfz_info": "锁定技，若你有‘巨剑’标记，你的攻击范围+X。（X=你的‘巨剑’标记的数量）",
  "chongjimrfz": "冲击",
  "chongjimrfz_info": "当你使用的【杀】造成伤害后，你可以对与受伤角色座次相邻的其他角色造成一点伤害，然后其弃置X张手牌。（X=本次你造成的伤害数）"
});
characterTitle("midiexiangmrfz", "<font color=#f91c01>勿忘我</font>");
characterIntro("midiexiangmrfz", "迷迭香，罗德岛精英干员，熟练掌握极稀有的源石技艺，于对抗大型生物，破坏硬目标，设施紧急制动与中断小规模冲突等任务中表现出色，并于攻坚战、阵地战与歼灭战中体现出极强的战场掌控力与显著的战术价值。现由凯尔希指派，作为歼灭战的核心发起人之一发挥作用。</br><span class=firetext>迷迭香的所有其他档案皆移入高权限资料库。</span>");
//# sourceMappingURL=index.js.map
