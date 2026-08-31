import { get, lib, game } from "noname";
import { whichWayTips } from "../../../tips/index.js";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("sptiaoxiangshimrfz", {
  sex: "female",
  group: "samrfz",
  hp: 3,
  skills: ["youchenmrfz", "biaodaomrfz"],
  designer: ["涵涵"]
});
skill({
  "youchenmrfz": {
    audio: ["作战中1", "作战中2"],
    trigger: { global: "roundStart" },
    filter(event, player) {
      return player.countCards("he") >= 2 && game.hasPlayer((c) => c !== player && c.countCards("he") >= 2);
    },
    onremove: true,
    mark: true,
    intro: {
      mark: function(dialog, storage, player) {
        if (!storage) return `·没有使用过【诱嗔】`;
        dialog.addText(`·首次【诱嗔】的角色：${get.translation(storage)}`);
        dialog.addSmall([[storage].slice().map((i) => i.name), "character"]);
      }
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseTarget().set("prompt", get.prompt("youchenmrfz")).set("prompt2", get.skillInfoTranslation("youchenmrfz")).set("filterTarget", (card, player2, target) => {
        return player2 !== target && target.countCards("he") >= 2;
      }).set(
        "ai",
        /** @param {Player} target  */
        (target) => {
          const player2 = get.player();
          if (player2.countCards("he", (card) => get.value(card) < 8) < 2) return -1;
          if (get.attitude(player2, target) > 0) return -1;
          return 1145141919810 - target.countCards("he");
        }
      ).forResult();
    },
    async content(event, trigger, player) {
      const {
        targets: [target]
      } = event;
      if (!target) return;
      for (let char of [target, player].sort(lib.sort.seat)) {
        await char.chooseToDiscard("he", true, `【诱嗔】:请弃置两张牌`, 2).set("ai", (card) => -get.value(card));
      }
      if (!player.isMaxHandcard(false)) await player.draw(2);
      if (!player.storage.youchenmrfz) {
        player.storage.youchenmrfz = target;
        target.addSkill("biaodaomrfz_distance");
      }
      const playerx = player;
      target.when({ player: "useCardAfter", global: "roundStart" }).step(async (event2, trigger2, player2) => {
        if (trigger2.name === "useCard") {
          if (!trigger2.targets) discard();
          if (!trigger2.targets.includes(playerx)) discard();
        }
        function discard() {
          player2.chooseToDiscard("he", true, `【诱嗔】:请弃置一张牌`);
        }
      });
    },
    ai: {
      expose: 0.1
    }
  },
  "biaodaomrfz": {
    forced: true,
    audio: ["作战中3", "作战中4"],
    derivation: ["clananran"],
    init(player, skill2) {
      game.broadcastAll((player2) => {
        let info = get.info("clananran");
        if (!info.audioname2) info.audioname2 = {};
        info.audioname2[player2.name] = "biaodaomrfz";
      }, player);
      player.storage[skill2] = 0;
    },
    group: ["clananran", "biaodaomrfz_clearTips"],
    trigger: {
      player: "loseAfter"
    },
    filter(event, player) {
      const target = player.storage.youchenmrfz;
      return target && target.isAlive() && player.countCards("h") - target.countCards("h") < 0;
    },
    async content(event, trigger, player) {
      player.refreshSkill("clananran");
      const target = player.storage.youchenmrfz;
      if (!target) return;
      let index;
      if (player.storage.biaodaomrfz > 2) index = 0;
      else {
        const result = await target.chooseControl("获得护甲", "增加距离").set("prompt", `【镳道】:请选择一项`).set("displayIndex", false).set("choiceList", [`获得护甲:你与${get.translation(player)}各获得一点护甲值`, `增加距离:你与${get.translation(player)}计算与对方的距离+1（当前+${player.storage.biaodaomrfz}）`]).set("ai", () => {
          const player2 = get.player();
          const target2 = get.event().targetx;
          if (get.attitude(player2, target2) > 0 || player2.hp <= 2) return 0;
          return 1;
        }).set("targetx", target).forResult();
        if (typeof result.index === "number") index = result.index;
        else index = 0;
      }
      switch (index) {
        case 0: {
          [player, target].sort(lib.sort.seat).forEach((char) => char.changeHujia(1));
          break;
        }
        case 1: {
          player.storage.biaodaomrfz += 1;
          whichWayTips.addPrompt(player, `与${get.translation(target)}的距离+${player.storage.biaodaomrfz}`, "biaodaomrfz_distance");
          whichWayTips.addPrompt(target, `与${get.translation(player)}的距离+${player.storage.biaodaomrfz}`, "biaodaomrfz_distance");
          break;
        }
      }
    },
    mod: {
      globalFrom(from, to, num) {
        const target = from?.storage?.youchenmrfz;
        if (target && to === target && typeof from.storage.biaodaomrfz === "number") {
          return num + from.storage.biaodaomrfz;
        }
      }
    },
    subSkill: {
      clearTips: {
        trigger: {
          global: "dieAfter"
        },
        silent: true,
        charlotte: true,
        forceDie: true,
        filter(event, player) {
          return [player, player.storage.youchenmrfz].includes(event.player);
        },
        async content(event, trigger, player) {
          whichWayTips.removePrompt(player, "biaodaomrfz_distance");
          if (player.storage.youchenmrfz) whichWayTips.removePrompt(player.storage.youchenmrfz, "biaodaomrfz_distance");
          delete player.storage.youchenmrfz;
        }
      },
      distance: {
        charlotte: true,
        forced: true,
        mod: {
          globalFrom(from, to, num) {
            const target = to?.storage?.youchenmrfz;
            if (target && from === target && typeof to.storage.biaodaomrfz === "number") {
              return num + to.storage.biaodaomrfz;
            }
          }
        }
      }
    }
  }
});
translate({
  "sptiaoxiangshimrfz": "撷英调香师",
  "sptiaoxiangshimrfz_prefix": "撷英",
  "youchenmrfz": "诱嗔",
  "youchenmrfz_info": "每轮开始时，你可以选择一名其他角色，你与其各弃置两张牌，且若其本轮使用的下一张牌没有指定你为目标，则其弃置一张牌，然后若你的手牌数不为全场最多，你摸两张牌。",
  "biaodaomrfz": "镳道",
  "biaodaomrfz_info": "锁定技。<br>①你视为拥有【岸然】;<br>②当你失去一张牌后，若你的手牌数小于首次成为【诱嗔】的角色，你重置【岸然】，且其须令你与其获得一点护甲或互相计算与对方的距离+1（至多为3）。"
});
characterTitle("sptiaoxiangshimrfz", "<font color = green>百里香</font>");
characterIntro("sptiaoxiangshimrfz", "调香师莱娜，在与博士和罗德岛医疗部沟通后，将疗养庭院暂时交予干员波登可负责，并主动申请外派至米诺斯地区，担任新建立的雅赛努斯办事处的负责人，为当地建立感染者医疗体系。");
//# sourceMappingURL=index.js.map
