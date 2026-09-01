import { lib, game, get, ui } from "noname";
import { skillCustomFunc } from "../../nonameEx/custom/skill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("cuoemrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "dongmrfz",
  hp: 4,
  skills: ["huanyoumrfz", "wenxinmrfz"]
});
skill({
  "huanyoumrfz": {
    audio: "chuemrfz",
    forced: true,
    trigger: {
      player: "gainAfter"
    },
    filter(event, player) {
      return !player.isPhaseUsing() && event.cards.length > 0 && event.getParent().name !== "huanyoumrfz";
    },
    async content(event, trigger, player) {
      player.gain(lib.card.ying.getYing(trigger.cards.length), "gain2");
    },
    group: ["huanyoumrfz_hideHandCards"],
    subSkill: {
      hideHandCards: {
        audio: "huanyoumrfz",
        forced: true,
        trigger: { player: "phaseUseBegin" },
        async content(event, trigger, player) {
          let handcard = player.node.handcards1.parentElement;
          player.node.washTip = ui.create.div(handcard, ".washTip");
          player.node.washTip.innerHTML = "洗牌中...";
          let hs = [];
          let origin = player.getCards("h");
          for (let i = 0; i < player.getCards("h").length; i++) {
            let r = origin.randomGet();
            hs.push(r);
            origin.remove(r);
          }
          game.broadcastAll(
            function(hs2, player2) {
              hs2.forEach((i) => i.goto(ui.special));
              player2.directgain(hs2, false);
            },
            hs,
            //@ts-ignore
            player
          );
          player.addTempSkill("huanyoumrfz_hideHandCards_eff", { player: "phaseEnd" });
        }
      },
      hideHandCards_eff: {
        mod: {
          cardname(card, player, name) {
            if (card.storage.huanyoumrfz) {
              return "cuoe_huanyoumrfzCard";
            }
          }
        },
        charlotte: true,
        silent: true,
        init(player) {
          if (!player.node.handcards1.cardMod) {
            player.node.handcards1.cardMod = {};
          }
          if (!player.node.handcards2.cardMod) {
            player.node.handcards2.cardMod = {};
          }
          var cardMod = function(card) {
            return ["幻有", "手牌对你不可见"];
          };
          player.node.handcards1.cardMod.huanyoumrfz = cardMod;
          player.node.handcards2.cardMod.huanyoumrfz = cardMod;
          player.node.handcards1.classList.add("huanyoumrfz");
          player.node.handcards2.classList.add("huanyoumrfz");
          player.getCards("h").forEach((i) => {
            i.storage.huanyoumrfz = true;
            i.dataset.skilltag = "huanyoumrfz";
          });
          setTimeout(() => {
            player.node.washTip.remove();
            delete player.node.washTip;
          }, 1e3);
        },
        onremove(player) {
          player.node.handcards1.classList.remove("huanyoumrfz");
          player.node.handcards2.classList.remove("huanyoumrfz");
          delete player.node.handcards1.cardMod.huanyoumrfz;
          delete player.node.handcards2.cardMod.huanyoumrfz;
          player.getCards("h").forEach((i) => {
            if (i.storage.huanyoumrfz) {
              delete i.storage.huanyoumrfz;
              delete i.dataset.skilltag;
            }
          });
        },
        trigger: {
          player: "useCardAfter"
        },
        filter(event, player) {
          return event.card.storage?.huanyoumrfz && event.cards.length === 1 && !event.card.failToUse && !event.getParent().noTriggerHuanyoumrfz;
        },
        async content(event, trigger, player) {
          trigger.cards.forEach((card) => {
            if (card.storage.huanyoumrfz) player.draw();
          });
        }
      }
    },
    ai: {
      neg: true
    }
  },
  "wenxinmrfz": {
    audio: 3,
    derivation: "zhishuimrfz",
    group: ["wenxinmrfz_achieve", "wenxinmrfz_turnOver", "wenxinmrfz_fail"],
    subSkill: {
      achieve: {
        audio: true,
        logAudio() {
          return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 1);
        },
        forced: true,
        skillAnimation: true,
        animationColor: "metal",
        lastDo: true,
        trigger: {
          player: "phaseEnd"
        },
        filter(event, player) {
          let useList = player.getHistory("useCard", (evt) => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz).map((evt) => {
            return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
          });
          let count = 0;
          for (let name of useList) {
            if (name === "ying") {
              count = 0;
              continue;
            }
            count++;
            if (count >= 3) return true;
          }
          return false;
        },
        async content(event, trigger, player) {
          game.log(player, "成功完成使命");
          player.awakenSkill("wenxinmrfz");
          player.addSkills(["zhishuimrfz"]);
          player.loseMaxHp();
        }
      },
      turnOver: {
        audio: true,
        logAudio() {
          return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 3);
        },
        trigger: {
          player: "useCardAfter"
        },
        lastDo: true,
        filter(event, player) {
          return player.countCards("h", (card) => card.storage.huanyoumrfz) > 0 && event.card.storage?.huanyoumrfz && event.cards.length === 1 && !event.getParent().noTriggerHuanyoumrfz;
        },
        async cost(event, trigger, player) {
          event.result = await player.chooseCard("h").set("prompt", get.prompt("wenxinmrfz")).set("prompt2", `你可以令一张背面朝上的手牌正面朝上`).set("filterCard", (card) => card.storage.huanyoumrfz).set("ai", () => Math.random()).forResult();
        },
        async content(event, trigger, player) {
          let card = event.cards[0];
          delete card.storage.huanyoumrfz;
          delete card.dataset.skilltag;
        }
      },
      fail: {
        audio: true,
        logAudio() {
          return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 2);
        },
        forced: true,
        trigger: {
          player: "phaseEnd"
        },
        firstDo: true,
        filter(event, player) {
          let useList = player.getHistory("useCard", (evt) => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz).map((evt) => {
            return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
          });
          return (useList.length === 0 || useList[0] === "ying" && new Set(useList).size === 1) && !player.getHistory("skipped").includes("phaseUse");
        },
        async content(event, trigger, player) {
          game.log(player, "使命失败");
          player.awakenSkill("wenxinmrfz");
          player.addSkill(["wenxinmrfz_fail_buff"]);
          player.markSkill("wenxinmrfz_fail_buff");
        }
      },
      fail_buff: {
        charlotte: true,
        silent: true,
        trigger: {
          player: "phaseDrawBegin"
        },
        intro: {
          content: "·每个摸牌阶段开始时获得一张【影】<br>·如真似幻，扑朔迷离。"
        },
        async content(event, trigger, player) {
          player.gain(lib.card.ying.getYing(1), "gain2");
        }
      }
    }
  }
});
translate({
  "cuoemrfz": "嵯峨",
  "huanyoumrfz": "幻有",
  "huanyoumrfz_info": "锁定技，①当你不应此技能而于出牌阶段外获得牌后，你获得等量的【影】。②出牌阶段开始时，你洗切手牌并令手牌本回合背面朝上，每当你于出牌阶段使用一张背面朝上的手牌后，你摸一张牌。③你可以使用至多5次背面朝上的手牌且当你使用背面朝上的手牌时，若其有合法目标，你使用之，否则将其置入弃牌堆。",
  "wenxinmrfz": "问心",
  "wenxinmrfz_info": "使命技，当你使用一张背面朝上的手牌后，你可以令一张手牌正面朝上。<br>成功：结束阶段，若你本回合连续使用了至少三张非【影】的手牌，你减少一点体力上限并获得“止水”。<br>失败：结束阶段，若你本回合没有使用过非【影】的手牌且出牌阶段未被跳过，你每个摸牌阶段开始时获得一张【影】。"
});
characterTitle("cuoemrfz", "<font color = #a52a2a>空即有</font>");
characterIntro("cuoemrfz", "嵯峨，东国出身的云游僧人。部分经历不明。原本只是因迷路而误入罗德岛办事处，经询问本人也有求职意向，于是随后通过测试加入罗德岛。在此之前似乎已与罗德岛干员炎熔建立关系。</br>十分善用随身的薙刀，身手矫健，作为先锋干员活跃在前线。");
//# sourceMappingURL=cuoemrfz.js.map
