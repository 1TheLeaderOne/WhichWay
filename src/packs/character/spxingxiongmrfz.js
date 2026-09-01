import { game, lib, get, _status, ui } from "noname";
import { skillCustomFunc } from "../../nonameEx/custom/skill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spxingxiongmrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "yanmrfz",
  hp: 3,
  maxHp: 4,
  skills: ["wozhimrfz", "guishimrfz", "zhanyemrfz"]
});
skill({
  "wozhimrfz": {
    audio: 2,
    trigger: {
      player: ["changeHp"]
    },
    forced: true,
    locked: true,
    mod: {
      maxHandcardBase(player, num) {
        return player.storage.zhanyemrfz ? player.maxHp : num;
      }
    },
    init(player) {
      player._hp = player.hp;
      player._maxHp = player.maxHp;
      let isUpdateHp = false;
      let isUpdateMaxHp = false;
      skillCustomFunc.defineAccessor(
        player,
        ["hp", "maxHp"],
        //@ts-ignore
        [() => player._hp, () => player._maxHp],
        [
          (value) => {
            player._hp = value;
            if (!isUpdateHp) {
              isUpdateHp = true;
              lib.skill.wozhimrfz.updateHp(player);
              isUpdateHp = false;
            }
          },
          (value) => {
            player._maxHp = value;
            if (!isUpdateMaxHp) {
              isUpdateMaxHp = true;
              lib.skill.wozhimrfz.updateHp(player);
              isUpdateMaxHp = false;
            }
          }
        ]
      );
    },
    intro: {
      content(storage, player) {
        let str = [];
        if (player.storage.zhanyemrfz) str.push("我执已修改");
        if (typeof storage !== "number" || storage === 0) str.push("体力值目前十分健康！");
        else str.push(`额外体力：${player.maxHp - storage}/${player.maxHp}`);
        return str.map((s) => "·" + s).join("<br>");
      }
    },
    onremove(player, skill2) {
      if (player.hp <= 0 && player.countMark("wozhimrfz") > 0) {
        player.die({});
        delete player.storage[skill2];
      }
      lib.skill.wozhimrfz.updateHp(player);
    },
    updateHp(player) {
      let num = player.countMark("wozhimrfz");
      const hp = player.querySelector(".hp");
      let clone = player.querySelector(".hpClone") || tmpSave.spxingxiong_clone;
      const cloneMaxhp = clone?.children?.length;
      if (cloneMaxhp !== player.maxHp && clone) {
        clone.remove();
        delete tmpSave.spxingxiong_clone;
        lib.skill.wozhimrfz.updateHp(player);
        return;
      }
      if (player.hp <= 0) {
        if (!clone) {
          const parent = hp.parentNode;
          const hpClone = ui.create.div(".hp hpClone", parent);
          hpClone.style.zIndex = "114514";
          hpClone.dataset.condition = "low";
          for (let i = 0; i < player.maxHp; i++) {
            ui.create.div(hpClone);
          }
          clone = hpClone;
          tmpSave.spxingxiong_clone = clone;
        }
        hp.style.display = "none";
        let hps = Array.from(clone.childNodes);
        if (!hps) return;
        for (let i = 0; i < hps.length; i++) {
          if (i < num) hps[i].classList.remove("lost");
          else hps[i].classList.add("lost");
        }
      } else {
        hp.style.display = "";
        if (clone !== void 0) {
          clone.remove();
          delete tmpSave.spxingxiong_clone;
        }
        player.update();
      }
    },
    filter(event, player) {
      return player.hp <= 0 && event.num < 0;
    },
    async content(event, trigger, player) {
      const evt = trigger;
      const num = -evt.num - Math.max(player.hp - evt.num, 1) + 1;
      if (num > 0) player.addMark("wozhimrfz", num);
      if (player.countMark("wozhimrfz") < player.maxHp) {
        let evt2 = evt.getParent();
        let max = 3;
        while (max--) {
          if (evt2.name === "damage" || evt2.name === "loseHp") {
            evt2.nodying = true;
            break;
          }
        }
      }
      lib.skill.wozhimrfz.updateHp(player);
    },
    group: ["wozhimrfz_recover", "wozhimrfz_change"],
    subSkill: {
      change: {
        audio: "wozhimrfz",
        trigger: {
          player: "phaseAfter"
        },
        forced: true,
        filter(event, player) {
          return player.hp < 1 && player.storage.zhanyemrfz;
        },
        async content(event, trigger, player) {
          player.recover();
        }
      },
      recover: {
        trigger: {
          player: "recoverAfter"
        },
        filter(event, player) {
          return player.countMark("wozhimrfz") > 0 && event.num > 0;
        },
        forced: true,
        popup: false,
        async content(event, trigger, player) {
          await player.removeMark("wozhimrfz", trigger.num);
          if (player.countMark("wozhimrfz") < player.maxHp) {
            if (player.isDying()) {
              const histories = [event];
              let evt = event;
              while (true) {
                evt = event.getParent("dying");
                if (!evt || evt.name !== "dying" || histories.includes(evt)) {
                  break;
                }
                histories.push(evt);
                if (evt.player === player) {
                  evt.nodying = true;
                }
              }
            }
          }
          lib.skill.wozhimrfz.updateHp(player);
        }
      }
    },
    ai: {
      mingzhi: true,
      effect: {
        target(card, player, target) {
          if (get.tag(card, "damage") || get.tag(card, "losehp")) {
            let num = target.countMark("wozhimrfz") || target.getHp();
            return (num + 1) / 3;
          }
        }
      }
    }
  },
  "guishimrfz": {
    audio: 2,
    locked(skill2, player) {
      if (!player || !player.storage.zhanyemrfz) {
        return true;
      }
      return false;
    },
    trigger: {
      player: "phaseUseBegin"
    },
    async cost(event, trigger, player) {
      if (!player.storage.zhanyemrfz) {
        event.result = {
          bool: true
        };
        return;
      }
      event.result = await player.chooseTarget().set("prompt", get.prompt("guishimrfz")).set(
        "prompt2",
        `你可以失去一点体力，然后令一名角色摸${get.cnNumber(Math.min(player.getDamagedHp(), 5))}张牌，若该角色不为你，你可以在结束阶段再次发动【鬼势】`
      ).set("ai", (target) => {
        let player2 = get.player();
        let num = Math.max(player2.hp, 0);
        if (player2.hasSkill("wozhimrfz")) {
          num += player2.maxHp - player2.countMark("wozhimrfz");
        }
        return get.attitude2(target) > 0 && num >= 2;
      }).set("animate", false).forResult();
    },
    async content(event, trigger, player) {
      if (!player.storage.zhanyemrfz) {
        await player.loseHp();
        player.draw(player.getDamagedHp());
      } else {
        let target = event.targets[0];
        await player.loseHp();
        target.draw(Math.min(5, player.getDamagedHp()));
        if (player !== target) {
          player.line(target);
          player.when({
            player: ["phaseJieshuBegin", "phaseEnd"]
          }).step(async (event2, trigger2, player2) => {
            if (trigger2.name === "phase") return;
            const { targets } = await player2.chooseTarget().set("prompt", get.prompt("guishimrfz")).set("prompt2", `你可以失去一点体力，然后令一名角色摸${get.cnNumber(Math.min(4, player2.getDamagedHp()))}张牌`).set("ai", (target2) => {
              let player3 = get.player();
              let num = Math.max(player3.hp, 0);
              if (player3.hasSkill("wozhimrfz")) {
                num += player3.maxHp - player3.countMark("wozhimrfz");
              }
              return get.attitude2(target2) > 0 && num >= 2;
            }).set("animate", false).forResult();
            if (!targets) return;
            await player2.loseHp();
            targets[0].draw(Math.min(4, player2.getDamagedHp()));
            player2.line(targets[0]);
          });
        }
      }
    }
  },
  "zhanyemrfz": {
    audio: 4,
    derivation: ["wozhimrfz_rewrite", "guishimrfz_rewrite"],
    dutySkill: true,
    group: ["zhanyemrfz_revenge", "zhanyemrfz_achieve", "zhanyemrfz_fail"],
    subSkill: {
      revenge: {
        audio: true,
        logAudio() {
          let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
          path = path.replace(path.slice(-2), "");
          return [1, 2].map((i) => path + `/zhanyemrfz${i}.mp3`);
        },
        trigger: {
          global: "phaseBefore",
          player: "enterGame"
        },
        onremove: true,
        mod: {
          targetInRange(card, player, target) {
            if (player.getStorage("zhanyemrfz_revenge").includes(target)) {
              return true;
            }
          },
          cardUsableTarget(card, player, target) {
            if (player.getStorage("zhanyemrfz_revenge").includes(target)) {
              return true;
            }
          }
        },
        intro: {
          mark(dialog, content, player) {
            let targets = player.storage.zhanyemrfz_revenge;
            if (targets) {
              targets.forEach((target) => {
                dialog.addSmall([target]);
                dialog.addText(`<font color="red">向${get.translation(target)}复仇！</font>`);
              });
            } else {
              dialog.addText("无“业”角色");
            }
          }
        },
        locked: true,
        filter(event, player) {
          return game.hasPlayer((current) => current !== player) && (event.name !== "phase" || game.phaseNumber === 0);
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseTarget().set("filterTarget", lib.filter.notMe).set("prompt", "游戏开始时，你令一名其他角色获得“业”标记，你对有“业”标记的角色使用牌无次数和距离限制。").set("forced", true).set("ai", function(target) {
            let att = get.attitude(_status.event.player, target);
            if (att > 0) {
              return -att - 1;
            }
            if (att === 0) {
              return Math.random();
            }
            return -att;
          }).set("animate", false).forResult();
        },
        async content(event, trigger, player) {
          let targets = event.targets;
          if (!player.storage.zhanyemrfz_revenge) player.storage.zhanyemrfz_revenge = [];
          player.storage.zhanyemrfz_revenge.add(...targets);
          player.line(targets);
          player.markSkill("zhanyemrfz_revenge");
        }
      },
      fail: {
        audio: true,
        logAudio() {
          let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
          path = path.replace(path.slice(-2), "");
          return path + `/zhanyemrfz3.mp3`;
        },
        forced: true,
        trigger: {
          global: "dieAfter"
        },
        async content(event, trigger, player) {
          game.log(player, "使命失败");
          player.awakenSkill("zhanyemrfz");
          player.unmarkSkill("zhanyemrfz_revenge");
          let copy = game.players.filter((c) => c !== player);
          for (let i = 0; i < 5; i++) {
            let targets = game.filterPlayer((c) => isMinHp(c, copy) && c !== player);
            await player.chooseUseTarget({
              card: get.autoViewAs({ name: "sha" })
            }).set("filterTarget", (card, player2, target) => {
              return targets.includes(target);
            }).set("forced", true).set("nodistance", true).set("addCount", false);
          }
          player.loseMaxHp({ num: 2 });
          function isMinHp(player2, players, only, raw) {
            return players.every((value) => {
              if (value.isOut() || value == player2) {
                return true;
              }
              return value.getHp(raw) >= player2.getHp(raw);
            });
          }
        }
      },
      achieve: {
        audio: true,
        logAudio() {
          let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
          path = path.replace(path.slice(-2), "");
          return path + `/zhanyemrfz4.mp3`;
        },
        forced: true,
        skillAnimation: true,
        animationColor: "metal",
        trigger: {
          source: "damageEnd"
        },
        filter(event, player) {
          return player.getStorage("zhanyemrfz_revenge").includes(event.player) && event.player.isAlive() && event.player.hp === 1;
        },
        async content(event, trigger, player) {
          game.log(player, "成功完成使命");
          player.awakenSkill("zhanyemrfz");
          player.unmarkSkill("zhanyemrfz_revenge");
          player.storage.zhanyemrfz = true;
        }
      }
    }
  }
});
translate({
  "spxingxiongmrfz": "斩业星熊",
  "spxingxiongmrfz_prefix": "斩业",
  "wozhimrfz": "我执",
  "wozhimrfz_info": "锁定技。<br>①当你扣减体力时，若你的体力值小于1，你获得一个“执”标记，当你“执”的数量小于你的体力上限时，你不进行濒死结算。<br>②当你回复体力时，若你有“执”，你移去等量的“执”。",
  "wozhimrfz_rewrite": "我执·修改",
  "wozhimrfz_rewrite_info": "锁定技。<br>①当你扣减体力时，若你的体力值小于1，你获得一个“执”标记，当你“执”的数量小于你的体力上限时，你不进行濒死结算。<br>②当你回复体力时，若你有“执”，你移去等量的“执”。<br>③你的手牌上限始终为你的体力上限。<br>④你的回合结束后，若你的体力值小于1，你回复一点体力。",
  "guishimrfz": "鬼势",
  "guishimrfz_info": "锁定技，出牌阶段开始时，你失去一点体力，然后摸X张牌。（X=你已损失的体力值）",
  "guishimrfz_rewrite": "鬼势·修改",
  "guishimrfz_rewrite_info": "出牌阶段开始时，你可以失去一点体力，然后令一名角色摸X张牌，若该角色不为你，你可以在结束阶段再次发动【鬼势】。（X=你已损失的体力值，X至多为5）",
  "zhanyemrfz": "斩业",
  "zhanyemrfz_info": "使命技，锁定技。<br>①游戏开始时，你令一名其他角色获得“业”标记。<br>②你对有“业”标记的角色使用牌无次数和距离限制。<br>成功：当你对有“业”标记的角色造成伤害后，若其体力值为1，你修改“我执”和“鬼势”;<br>失败：当有角色死亡时，你执行5次“视为对除你之外体力值最小的角色使用一张【杀】”，然后你失去两点体力上限。"
});
characterTitle("spxingxiongmrfz", "<font color = #a52a2a>斩金执义</font>");
characterIntro("spxingxiongmrfz", "星熊，现任龙门近卫局特别督察组组长。仍作为重装干员协助罗德岛行动，主要职能维持不变。<br>顺带一提，在星熊向博士讲述了她早年在东国度过的时光，并默许博士将其中一部分转述给我们之后，我们调整了她基础档案中战斗经验的时间。");
//# sourceMappingURL=spxingxiongmrfz.js.map
