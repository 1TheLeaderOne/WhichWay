import { whichWayUtil } from "../../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.ts";
import { lib, game, ui, get, ai, _status } from "noname";
character("jiaxintamrfz", {
  hp: 3,
  group: "leimrfz",
  pack: "epicSJZX",
  skills: ["feilvmrfz", "zhixingmrfz"],
  sex: "female"
});
characterTitle("jiaxintamrfz", whichWayUtil.colorize("#r旷野执旗#"));
characterIntro(
  "jiaxintamrfz",
  "嘉辛塔，雷姆必拓出身的罗德岛先锋干员，担任执旗手。乐观开朗的她总是鼓励着身边的同伴。她的病情在近几年得到了良好的控制，但情况仍旧不容乐观。"
);
translate({
  jiaxintamrfz: "嘉辛塔",
  feilvmrfz: "飞旅",
  feilvmrfz_info: "使命技，回合结束时，你可以将一张牌当做本回合第一张使用的牌使用，若你未因此使用过此牌，你摸一张牌。成功：本局游戏使用过18张牌：摸一张牌。",
  zhixingmrfz: "咫行",
  zhixingmrfz_info: "锁定技。①当你不因【咫行】而摸牌后，你令所有拥有【咫行】的角色制衡1；②当你使命技成功后，你重置该技能。"
});
skill({
  feilvmrfz: {
    audio: 2,
    dutySkill: true,
    trigger: { player: "phaseJieshuBegin" },
    filter(event, player2) {
      return player2.getHistory("useCard").length > 0 && player2.countCards("hs") > 0;
    },
    async cost(event, trigger, player2) {
      event.result = await player2.chooseBool(get.prompt("feilvmrfz"), "将一张牌当做本回合第一张使用的牌使用").set("ai", () => {
        const player3 = get.player();
        const history = player3.getHistory("useCard");
        if (!history.length) return 0;
        const card = { name: history[0].card.name, nature: history[0].card.nature };
        return player3.hasUseTarget(card, true, true) ? 1 : 0;
      }).forResult();
    },
    async content(event, trigger, player2) {
      const history = player2.getHistory("useCard");
      if (!history.length) return;
      const firstCard = history[0].card;
      if (!firstCard) return;
      const card = { name: firstCard.name, nature: firstCard.nature };
      if (!player2.hasUseTarget(card, true, true)) return;
      const name = "feilvmrfz_backup";
      game.broadcastAll(
        (name2, card2) => {
          lib.skill[name2].viewAs = card2;
        },
        name,
        card
      );
      const next = player2.chooseToUse();
      next.logSkill = event.name;
      next.set("openskilldialog", `飞旅：将一张牌当${get.translation(card)}使用`);
      next.set("norestore", true);
      next.set("_backupevent", name);
      next.set("custom", {
        add: {},
        replace: { window() {
        } }
      });
      next.backup(name);
      const result = await next.forResult();
      if (!result?.bool) return;
      player2.storage.feilvmrfz_used ??= [];
      if (!player2.storage.feilvmrfz_used.includes(card.name)) {
        player2.storage.feilvmrfz_used.push(card.name);
        await player2.draw();
      }
    },
    group: ["feilvmrfz_count", "feilvmrfz_usedClear"],
    subSkill: {
      backup: {
        filterCard(card) {
          return get.itemtype(card) == "card";
        },
        selectCard: 1,
        position: "hs",
        popname: true,
        log: false
      },
      // 统计本局游戏累计使用牌数，达到18张触发使命成功
      count: {
        charlotte: true,
        silent: true,
        trigger: { player: "useCardAfter" },
        async content(event, trigger, player2) {
          player2.storage.feilvmrfz_count = (player2.storage.feilvmrfz_count || 0) + 1;
          if (player2.storage.feilvmrfz_count < 18 || player2.storage.feilvmrfz_done) return;
          player2.storage.feilvmrfz_done = true;
          game.log(player2, "成功完成使命");
          player2.awakenSkill("feilvmrfz");
          await player2.draw();
          await event.trigger("zhixingmrfz_reset");
        }
      },
      // 每回合结束时清理【飞旅】本回合使用过的牌名记录
      usedClear: {
        charlotte: true,
        silent: true,
        trigger: { player: "phaseJieshuAfter" },
        content() {
          delete player.storage.feilvmrfz_used;
        }
      }
    }
  },
  //——————————咫行——————————//
  // ① 当你不因【咫行】而摸牌后，你令所有拥有【咫行】的角色制衡1（弃置1张牌，然后摸1张牌）
  // ② 当你使命技成功后，你重置该技能（恢复【飞旅】为可用状态）
  zhixingmrfz: {
    audio: 2,
    locked: true,
    group: ["zhixingmrfz_draw", "zhixingmrfz_reset"],
    subSkill: {
      draw: {
        forced: true,
        trigger: { player: "drawAfter" },
        filter(event, player2) {
          return !event._zhixingmrfz;
        },
        async content(event, trigger, player2) {
          const targets = game.filterPlayer((p) => p.hasSkill("zhixingmrfz") && p.countCards("he") > 0);
          for (const target of targets) {
            const result = await target.chooseToDiscard("he", 1, true).set("prompt", "【咫行】：制衡1（弃置一张牌，然后摸一张牌）").set("ai", (card) => 6 - get.value(card)).forResult();
            if (result.bool) {
              await target.draw(1).set("_zhixingmrfz", true);
            }
          }
        }
      },
      reset: {
        forced: true,
        trigger: { global: "zhixingmrfz_reset" },
        async content(event, trigger, player2) {
          if (player2.awakenedSkills.includes("feilvmrfz")) {
            player2.restoreSkill("feilvmrfz");
            game.log(player2, "重置了技能", "#g【飞旅】");
          }
        }
      }
    }
  }
});
//# sourceMappingURL=index.js.map
