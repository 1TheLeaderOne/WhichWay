import { _status, get, lib, ui, game } from "noname";
import { character, skill, translate, characterIntro } from "../../hooks.js";
character("xingxiongmrfz", {
  sex: "female",
  group: "longmrfz",
  hp: 4,
  maxHp: 5,
  skills: ["xinboremrfz", "xinyizhongmrfz"]
});
skill({
  "xinboremrfz": {
    audio: "banruomrfz",
    mark: false,
    markimage: "extension/WhichWay/image/skill/xinboremrfz.png",
    intro: {
      content: function(player) {
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
        filter: function(event, player) {
          if (event.targets?.length > 1 || get.type(event.card) == "equip") return false;
          return event.target.hasMark("xinboremrfz") && player.getHandcardLimit() > 0;
        },
        prompt: function(event, player) {
          return "【般若】：是否令" + get.translation(event.card) + "的目标由" + get.translation(event.target) + "改为你？";
        },
        check: function(event, player) {
          var att = get.attitude(event.target, player);
          if ((event.card.name == "wuzhong" || event.card.name == "dongzhuxianji" || event.card.name == "zenbing") && att < 0)
            return true;
          return att > 0 && get.tag(event.card, "damage");
        },
        async content(event, trigger, player) {
          const target = trigger.target;
          trigger.targets.remove(target);
          trigger.getParent().triggeredTargets1.remove(target);
          trigger.untrigger();
          game.delayx();
          trigger.targets.push(player);
          trigger.player.line(player, "fire");
          game.log(trigger.card, "的目标被改为", player);
          player.addMark("xinboremrfz_losehdlimit", 1, false);
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
        filter: function(event, player) {
          return event.name != "phase" || game.phaseNumber == 0;
        },
        async content(event, trigger, player) {
          const result = await player.chooseTarget(true, "【般若】：请选择一名其他角色，令其获得‘般若’标记", function(card, player2, target) {
            return target != player2;
          }).set("ai", (target) => get.attitude(player, target) > 0).forResult();
          if (result.targets) {
            const target = result.targets[0];
            target.addMark("xinboremrfz");
            player.logSkill("xinboremrfz", target);
            player.disableEquip("equip2");
            target.disableEquip("equip2");
            player.addSkill("xinboremrfz_handlit");
            target.addSkill("xinboremrfz_handlit");
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
        hiddenCard: function(player, name) {
          if (player.hasSkill("xinboremrfz_usedwuxie") && player.hasSkill("xinboremrfz_usedsha") && player.hasSkill("xinboremrfz_usedshan"))
            return false;
          if (name == "wuxie" && player.hasSkill("xinboremrfz_usedwuxie")) return false;
          if (name == "sha" && player.hasSkill("xinboremrfz_usedsha")) return false;
          if (name == "shan" && player.hasSkill("xinboremrfz_usedshan")) return false;
          return (name == "wuxie" || name == "sha" || name == "shan") && (player.getHandcardLimit() > 0 || player.countDisabledSlot() < 5);
        },
        filter: function(event, player) {
          if (player.hasSkill("xinboremrfz_usedwuxie") && player.hasSkill("xinboremrfz_usedsha") && player.hasSkill("xinboremrfz_usedshan"))
            return false;
          return player.getHandcardLimit() > 0 || player.countDisabledSlot() < 5;
        },
        chooseButton: {
          dialog: function(event, player) {
            var vcards = [];
            for (var name of ["sha", "shan", "wuxie"]) {
              const card = { name };
              if (name == "wuxie" && player.hasSkill("xinboremrfz_usedwuxie")) continue;
              if (name == "shan" && player.hasSkill("xinboremrfz_usedshan")) continue;
              if (name == "sha" && player.hasSkill("xinboremrfz_usedsha")) continue;
              if (event.filterCard(card, player, event)) {
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
          filter: function(button, player) {
            return _status.event.getParent().filterCard({ name: button.link[2] }, player, _status.event.getParent());
          },
          backup: function(links, player) {
            return {
              filterCard: () => false,
              selectCard: -1,
              viewAs: {
                name: links[0][2],
                nature: links[0][3],
                isCard: true
              },
              popname: true,
              async precontent(event, trigger, player2) {
                const card = event.result?.card?.name;
                if (card == "sha") {
                  event.getParent().addCount = false;
                  player2.addSkill("xinboremrfz_usedsha");
                }
                if (card == "shan") player2.addSkill("xinboremrfz_usedshan");
                if (card == "wuxie") player2.addSkill("xinboremrfz_usedwuxie");
                player2.logSkill("xinboremrfz");
                const list = [];
                if (player2.getHandcardLimit() > 0) list.push("手牌上限-1");
                if (player2.countDisabledSlot() < 5) list.push("废除一个装备栏");
                if (list.length > 1) {
                  const result = await player2.chooseControl(list).set("prompt", "【般若】：请选择一项").set("ai", function() {
                    return 0;
                  }).forResult();
                  if (result.index == 0) player2.addMark("xinboremrfz_losehdlimit", 1, false);
                  else
                    player2.chooseToDisable().ai = function(event2, player3, list2) {
                      if (list2.includes("equip5")) return "equip5";
                      return list2.randomGet();
                    };
                } else {
                  if (player2.getHandcardLimit() == 0)
                    player2.chooseToDisable().ai = function(event2, player3, list2) {
                      if (list2.includes("equip5")) return "equip5";
                      return list2.randomGet();
                    };
                  else player2.addMark("xinboremrfz_losehdlimit", 1, false);
                }
              }
            };
          },
          prompt: function(links, player) {
            return "【般若】：视为使用一张【" + get.translation(links[0][2]) + "】";
          }
        },
        ai: {
          order: function(item, player) {
            var player = _status.event.player;
            var event = _status.event;
            if (event.filterCard({ name: "sha" }, player, event)) {
              return 4;
            }
          },
          respondSha: true,
          respondShan: true,
          skillTagFilter: function(player, tag, arg) {
            if (player.hasSkill("xinboremrfz_usedwuxie") && player.hasSkill("xinboremrfz_usedsha") && player.hasSkill("xinboremrfz_usedshan"))
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
          maxHandcard: function(player, num) {
            return num - player.countMark("xinboremrfz_losehdlimit");
          }
        }
      },
      usedshan: {
        silent: true,
        charlotte: true,
        trigger: { global: "phaseZhunbeiBegin" },
        async content(event, trigger, player) {
          player.removeSkill("xinboremrfz_usedshan");
        }
      },
      usedwuxie: {
        silent: true,
        charlotte: true,
        trigger: { global: "phaseZhunbeiBegin" },
        async content(event, trigger, player) {
          player.removeSkill("xinboremrfz_usedwuxie");
        }
      },
      usedsha: {
        silent: true,
        charlotte: true,
        trigger: { global: "phaseZhunbeiBegin" },
        async content(event, trigger, player) {
          player.removeSkill("xinboremrfz_usedsha");
        }
      },
      handlit: {
        silent: true,
        charlotte: true,
        mod: {
          maxHandcard: function(player, num) {
            return num + 1;
          }
        }
      }
    }
  },
  "xinyizhongmrfz": {
    audio: "yizhongmrfz",
    forced: true,
    trigger: { player: "phaseZhunbeiBegin" },
    filter: function(event, player) {
      return player.hp >= player.getHandcardLimit();
    },
    async content(event, trigger, player) {
      const num = 5 - player.countDisabledSlot() - 1;
      player.addMark("xinyizhongmrfz", num, false);
    },
    mod: {
      maxHandcard: function(player, num) {
        return num + player.countMark("xinyizhongmrfz");
      }
    },
    group: "xinyizhongmrfz_lose",
    subSkill: {
      lose: {
        audio: "yizhongmrfz",
        direct: true,
        charlotte: true,
        trigger: { player: "damageEnd" },
        filter: function(event, player) {
          return event.source != void 0 && event.num > 0 && event.source.hasMark("xinboremrfz");
        },
        async content(event, trigger, player) {
          player.removeSkill("xinboremrfz");
          player.removeSkill("xinyizhongmrfz_lose");
        }
      }
    }
  }
});
translate({
  "xingxiongmrfz": "星熊",
  "xinboremrfz": "般若",
  "xinboremrfz_info": "①锁定技，游戏开始时，你选择一名其他角色，其获得“般若”标记，然后你与其废除各自的防具栏并且手牌上限+1。</br>②当有“般若”标记的角色成为非装备牌的唯一目标时，你可以令你的手牌上限-1，然后你成为此牌的目标。</br>③每回合每项限一次，你可以令你的手牌上限-1或废除一个装备栏，视为使用一张：1.【无懈可击】；2.【闪】；3.【杀】（不计入使用次数）。",
  "xinyizhongmrfz": "义重",
  "xinyizhongmrfz_info": "①锁定技，准备阶段，若你的手牌上限不小于你的当前体力值，你的手牌上限+X。（X=你没有被废除的装备栏数-1）</br>②锁定技，当你受到来自于有“般若”标记的角色的伤害后，你失去【般若】。"
});
characterIntro("xingxiongmrfz", "星熊，龙门近卫局特别任务组精英干员。</br>存在数项指控记录。</br>经龙门总督魏彦吾交涉，龙门近卫局依星熊的优异能力与良好表现，破格将其吸纳进近卫局特别督察组。在处理高危险性犯罪事件、要员保护、灾害紧急救援等领域表现出较高专业性。</br>现作为重装干员协助罗德岛行动，并为现场提供战术执行与指挥支援。</br>现作为特别人员协助罗德岛行动，并为现场提供战术指挥支援。");
//# sourceMappingURL=index.js.map
