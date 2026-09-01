import { get, game, _status, lib } from "noname";
import { character, skill, translate, characterIntro } from "../hooks.js";
character("senranmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "samrfz",
  hp: 3,
  maxHp: 5,
  skills: ["juezhanmrfz", "shanxiemrfz", "tieyimrfz"]
});
skill({
  "juezhanmrfz": {
    mod: {
      selectTarget: function(card, player, range) {
        if (lib.skill.juezhanmrfz.isJuezhan(card) && card.name != "jiedao") range[1] = 1;
      }
    },
    isJuezhan: function(card) {
      var info = lib.card[card.name];
      if (!info || info.type != "trick" && info.type != "delay") return false;
      if (info.notarget) return false;
      if (info.selectTarget != void 0) {
        if (Array.isArray(info.selectTarget)) {
          if (info.selectTarget[0] < 0) return !info.toself;
          return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
        } else {
          if (info.selectTarget < 0) return !info.toself;
          return info.selectTarget != 1;
        }
      }
      return false;
    },
    marktext: "单挑",
    intro: {
      name: "单挑",
      content: "和森蚺决一死战吧！"
    },
    audio: 2,
    forced: true,
    trigger: { target: "useCardToTargeted" },
    filter: function(event, player) {
      return event.card.name == "sha" && !event.player.hasMark("juezhanmrfz");
    },
    async content(event, trigger, player) {
      trigger.player.addMark("juezhanmrfz");
      trigger.player.addSkill("juezhanmrfz_ta");
    },
    group: "juezhanmrfz_pl",
    subSkill: {
      ta: {
        mod: {
          playerEnabled: function(card, player, target) {
            if (!target.hasSkill("juezhanmrfz") && target != player) {
              return false;
            }
          },
          inRangeOf: function(from, to) {
            if (from.hasSkill("juezhanmrfz")) return true;
          }
        },
        charlotte: true,
        forced: true,
        silent: true,
        trigger: {
          global: ["phaseEnd", "die"]
        },
        filter: function(event, player) {
          return event.player.hasSkill("juezhanmrfz");
        },
        async content(event, trigger, player) {
          player.removeMark("juezhanmrfz");
          player.removeSkill("juezhanmrfz_ta");
        }
      },
      pl: {
        mod: {
          playerEnabled: function(card, player, target) {
            if (!target.hasMark("juezhanmrfz") && target != player && game.hasPlayer(function(current) {
              return current.countMark("juezhanmrfz") > 0;
            })) {
              return false;
            }
          },
          inRangeOf: function(from, to) {
            if (from.hasMark("juezhanmrfz")) return true;
          }
        }
      }
    }
  },
  "shanxiemrfz": {
    audio: 2,
    trigger: { global: "loseAfter" },
    filter: function(event, player) {
      if (player.countMark("shanxiemrfz") > player.countCards("h")) return false;
      if (event.type != "discard" || event.getlx === false) return false;
      var cards = event.cards.slice(0);
      var evt = event.getl(player);
      if (evt && evt.cards) cards.removeArray(evt.cards);
      for (var i = 0; i < cards.length; i++) {
        if (cards[i].original != "j" && get.type(cards[i], event.player) == "equip" && get.position(cards[i], true) == "d") {
          return true;
        }
      }
      return false;
    },
    direct: true,
    async content(event, trigger, player) {
      let result;
      while (true) {
        let skipStep1 = false;
        if (player.countCards("h") >= player.countMark("shanxiemrfz") && player.countMark("shanxiemrfz") > 0) {
          result = await player.chooseToDiscard(
            get.prompt("shanxiemrfz"),
            "你可以弃置" + get.cnNumber(player.countMark("shanxiemrfz")) + "张牌获得此装备牌",
            false,
            player.countMark("shanxiemrfz")
          ).set("ai", (card) => {
            return 6 - get.value(card);
          }).forResult();
        } else if (player.countMark("shanxiemrfz") === 0) {
          skipStep1 = true;
        }
        if (!skipStep1) {
          if (trigger.delay === false) {
            await game.delay();
          }
          if (!result?.cards) {
            break;
          }
        }
        const equipCards = [];
        const cards2 = trigger.cards.slice(0);
        const evt = trigger.getl(player);
        if (evt?.cards) {
          cards2.removeArray(evt.cards);
        }
        for (const card of cards2) {
          if (card.original !== "j" && get.type(card, trigger.player) === "equip" && get.position(card, true) === "d") {
            equipCards.push(card);
          }
        }
        event.num = equipCards.length;
        if (equipCards.length > 0) {
          result = await player.chooseButton(["擅械：请选择获得一张牌", equipCards], 1).set("ai", (button) => {
            return get.value(button.link, _status.event.player, "raw");
          }).forResult();
        }
        if (result?.bool) {
          event.num--;
          player.logSkill("shanxiemrfz");
          await player.gain(result.links, "gain2", "log");
          player.addMark("shanxiemrfz", 1);
          if (event.num > 0) {
            continue;
          }
        }
        break;
      }
    },
    group: ["shanxiemrfz_sha", "shanxiemrfz_usesha", "shanxiemrfz_remove"],
    subSkill: {
      sha: {
        audio: "shanxiemrfz",
        enable: ["chooseToRespond", "chooseToUse"],
        filterCard: function(card, player) {
          return get.type(card) == "equip";
        },
        position: "hes",
        viewAs: { name: "sha" },
        prompt: "将一张装备牌当杀使用或打出",
        check: function(card) {
          var val = get.value(card);
          if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
          return 10 - val;
        },
        ai: {
          skillTagFilter: function(player, tag, arg) {
            if (!get.type(arg.card) == "equip") return false;
          },
          respondSha: true
        }
      },
      usesha: {
        trigger: { source: "damageBegin3" },
        filter: function(event, player) {
          return event.card && event.card.name == "sha" && event.player.hasMark("juezhanmrfz") && //@ts-ignore
          get.type(event.cards[0], "equip") == "equip";
        },
        forced: true,
        async content(event, trigger, player) {
          trigger.num++;
          player.logSkill("shanxiemrfz");
        }
      },
      remove: {
        silent: true,
        charlotte: true,
        forced: true,
        trigger: { global: "roundStart" },
        async content(event, trigger, player) {
          player.removeMark("shanxiemrfz", player.countMark("shanxiemrfz"));
        }
      }
    },
    ai: {
      threaten: 2
    }
  },
  "tieyimrfz": {
    audio: 2,
    enable: "phaseUse",
    mark: true,
    limited: true,
    selectCard: [0, 3],
    filterCard: true,
    position: "h",
    prompt: "弃置至多三张手牌，摸两倍于你弃置牌的牌",
    delay: 0,
    check: function(card) {
      return 6 - get.value(card) && get.name(card) != "sha" && get.type(card) != "equip";
    },
    init: function(player) {
      player.storage.tieyimrfz = false;
    },
    filter: function(event, player) {
      return !player.storage.tieyimrfz;
    },
    async content(event, trigger, player) {
      const { cards } = event;
      let result;
      player.awakenSkill(event.name);
      player.node.avatar.setBackgroundImage("extension/WhichWay/image/skill/senrantieyumrfz.jpg");
      player.node.name.innerHTML = get.translation("senrantieyumrfz");
      await player.draw(cards.length * 2);
      await player.recover(2);
      await player.turnOver();
      player.storage.tieyimrfz = true;
      let skipStep2 = false;
      if (game.hasPlayer((current) => {
        return current !== player && !current.hasMark("juezhanmrfz");
      })) {
        result = await player.chooseTarget(true, (card, player2, target) => {
          return target !== player2 && !target.hasMark("juezhanmrfz");
        }).set("ai", (target) => {
          return -get.attitude(player, target);
        }).forResult();
      } else {
        skipStep2 = true;
      }
      if (!skipStep2 && result && result.targets) {
        const target = result.targets[0];
        target.addSkill("juezhanmrfz_ta");
        target.addMark("juezhanmrfz");
      }
      player.addTempSkill("tieyimrfz_use");
      player.addTempSkill("tieyimrfz_discard");
      player.addSkill("tieyimrfz_back");
    },
    intro: {
      content: "limited"
    },
    subSkill: {
      back: {
        charlotte: true,
        silent: true,
        trigger: { player: ["dying", "phaseEnd"] },
        async content(event, trigger, player) {
          player.node.avatar.setBackgroundImage("extension/WhichWay/image/senranmrfz.jpg");
          player.node.name.innerHTML = get.translation("senranmrfz");
          player.removeSkill("tieyimrfz_back");
        }
      },
      discard: {
        forced: true,
        trigger: { player: "phaseEnd" },
        filter: function(event, player) {
          return player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          player.chooseToDiscard(true, player.countCards("h"));
        }
      },
      use: {
        charlotte: true,
        mod: {
          cardUsableTarget: function(card, player, target) {
            if (target.hasMark("juezhanmrfz")) return true;
          }
        }
      }
    },
    ai: {
      order: 13,
      threaten: 3,
      expose: 0.9,
      result: {
        target: function(player, target) {
          var hs1 = player.countCards("h", function(card) {
            return card.name == "sha";
          });
          var hs2 = player.countCards("he", function(card) {
            return get.type(card) == "equip";
          });
          if (hs1 + 2 * hs2 > 4) return -1;
          return 0;
        }
      }
    }
  }
});
translate({
  "senranmrfz": "森蚺",
  "juezhanmrfz": "决战",
  "juezhanmrfz_info": "锁定技，你的多目标锦囊(【借刀杀人】除外)只能指定一个目标；当你成为其他角色的【杀】的目标时，其获得“单挑”标记直到你的回合结束；[若场上有“单挑”，你/拥有“单挑”的角色]使用牌仅能指定自己或[拥有“单挑”的角色/你]为目标，你与有“单挑”的角色互相视为在其攻击范围内。",
  "shanxiemrfz": "擅械",
  "shanxiemrfz_info": "①当其他角色弃置的装备牌进入弃牌堆时，你可以弃置X张牌，然后获得此牌。(X=本轮此技能发动的次数)②你可以将装备牌视为【杀】使用或打出，当你使用以此法转化的【杀】对有“单挑”的角色造成伤害时，此【杀】伤害+1。",
  "tieyimrfz": "铁意",
  "tieyimrfz_info": "限定技，出牌阶段，你可以弃置至多三张牌并翻面，摸两倍于你弃置的牌的牌，回复两点体力，你可以令一名没有‘单挑’标记的其他角色获得‘单挑’标记，然后本回合你对有‘单挑’标记的角色使用牌无次数限制，且你于回合结束弃置所有牌。",
  "tieyimrfz_append": '<span style="font-family: yuanli">快看，是我方的一名铁驭，我们有救了！</span>'
});
characterIntro("senranmrfz", "森蚺，嘉维尔的故乡——阿卡胡拉中某部族的族长，经过干员测试后加入罗德岛，同时接受治疗。</br>拥有不输于嘉维尔的身体素质，目前和她的伙伴“暴躁铁皮”共同活跃在战场上。");
//# sourceMappingURL=senranmrfz.js.map
