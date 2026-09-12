import { get, _status, lib, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("acemrfz", { pack: "plotSJZX", sex: "male", group: "luomrfz", hp: 4, maxHp: 6, skills: ["newsizhanmrfz", "ehoumrfz"] });
skill({
  sizhanmrfz: {
    audio: 2,
    trigger: { player: "die" },
    forced: true,
    forceDie: true,
    unique: true,
    mark: true,
    limited: true,
    skillAnimation: true,
    animationStr: "死战",
    animationColor: "fire",
    init: function(player2) {
      player2.storage.sizhanmrfz = false;
    },
    filter: function(event, player2) {
      return !player2.storage.sizhanmrfz;
    },
    async content(event, trigger2, player2) {
      player2.storage.sizhanmrfz = true;
      player2.awakenSkill("sizhanmrfz");
      const targets = game.filterPlayer(function(current) {
        return current != player2 && current.isZhu;
      });
      if (targets.length < 1) {
        player2.chat("？！场上没有主公！？");
        return;
      }
      if (targets.length === 1) {
        targets[0].addSkill("sizhanmrfz2");
        targets[0].storage.sizhanmrfz2 = player2;
      } else {
        const result = await player2.chooseTarget({
          filterTarget(card, player3, target) {
            return targets.includes(target);
          },
          ai(target) {
            return Math.random();
          },
          forced: true,
          prompt: "【死战】:选择一名角色，于其回合结束后你额外进行一个回合"
        }).forResult();
        if (result.targets) {
          result.targets[0].addSkill("sizhanmrfz2");
          result.targets[0].storage.sizhanmrfz2 = player2;
        }
      }
    }
  },
  sizhanmrfz2: {
    trigger: { player: "phaseEnd" },
    forced: true,
    direct: true,
    charlotte: true,
    onremove: true,
    content: async function(event, trigger2, player2) {
      const target = player2.storage.sizhanmrfz2;
      for (let char of game.dead) {
        if (char !== target) continue;
        char.revive(char.maxHp);
        char.removeSkill("sizhanmrfz2");
        char.insertPhase();
        char.addSkill("sizhanmrfz3");
        char.chat("快走，我来断后！");
      }
    }
  },
  sizhanmrfz3: {
    trigger: { player: "phaseEnd" },
    forced: true,
    content: function() {
      player.die()._triggered = null;
    },
    group: ["sizhanmrfz3_draw", "sizhanmrfz3_damage", "sizhanmrfz3_sha"],
    subSkill: {
      draw: {
        trigger: { player: "phaseDrawBegin2" },
        forced: true,
        content: function() {
          trigger.num += Math.min(game.roundNumber, 5);
        }
      },
      damage: {
        trigger: { source: "damageBegin" },
        forced: true,
        content: function() {
          trigger.num++;
        }
      },
      sha: {
        mod: {
          // @ts-ignore
          targetInRange: function(card, player2, target, now) {
            if (card.name == "sha") return true;
          },
          // @ts-ignore
          cardname: function(card, player2) {
            if (["basic"].includes(lib.card[card.name].type)) return "sha";
          }
        }
      }
    }
  },
  guanyongmrfz: {
    shaRelated: true,
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter: function(event, player2) {
      if (event.getParent().name != "useCard" || player2 != _status.currentPhase) return false;
      return event.card.name == "sha" && event.target.countDiscardableCards(player2, "he") > 0;
    },
    preHidden: true,
    check: function(event, player2) {
      return get.attitude(player2, event.target) <= 0;
    },
    logTarget: "target",
    async content(event, trigger2, player2) {
      const result = await player2.discardPlayerCard({
        target: trigger2.target,
        prompt: get.prompt("guanyongmrfz", trigger2.target),
        forced: true
      }).set("att", get.attitude(player2, trigger2.target) <= 0).forResult();
      if (result.bool && result.links && result.links.length) {
        if (get.type(result.links[0], null, result.links[0].original == "h" ? player2 : false) == "basic") {
          trigger2.getParent().directHit.add(trigger2.target);
        } else {
          player2.draw(2);
          player2.addTempSkill("guanyongmrfz2");
          if (player2.countMark("guanyongmrfz2") < 2 || player2.storage.sizhanmrfz) {
            player2.addMark("guanyongmrfz2", 1, false);
          }
        }
      }
    },
    ai: {
      unequip_ai: true,
      directHit_ai: true,
      // @ts-ignore
      skillTagFilter: function(player2, tag, arg) {
        if (tag == "directHit_ai")
          return arg.card.name == "sha" && arg.target.countCards("e", function(card) {
            return get.value(card) > 1;
          }) > 0;
        if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
        return false;
      }
    }
  },
  guanyongmrfz2: {
    mod: {
      cardUsable: function(card, player2, num) {
        if (card.name == "sha") return num + player2.countMark("guanyongmrfz2");
      }
    },
    onremove: true
  }
});
translate({
  acemrfz: "Ace",
  sizhanmrfz: "死战",
  sizhanmrfz_info: "限定技，锁定技，当你死亡时，你于主公回合结束时复活且插入一个回合且此回合你获得如下效果：①你的伤害基数改为2；②摸牌阶段，你额外摸X张牌；③你的基本牌均视为【杀】且使用杀无距离限制;④回合结束，你立刻死亡。（X=当前轮次数，X至多为5）",
  guanyongmrfz: "冠勇",
  guanyongmrfz_info: "出牌阶段，当你使用的【杀】指定目标时，你弃置其一张牌，若此牌为基本牌，则此【杀】不可被【闪】响应，否则，你摸两张牌，然后本回合使用杀的次数+1（若不处于因【死战】而获得的回合，则至多+2）。"
});
characterTitle("acemrfz", "<font color='red'>巴别塔之盾</font>");
characterIntro("acemrfz", "罗德岛精英干员Ace，参与切尔诺伯格行动，因掩护博士救援小队撤退而阵亡。</br></br><span class=firetext>罗德岛会铭记您的贡献。</span>");
