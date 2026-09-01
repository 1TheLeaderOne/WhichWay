import { get, lib, _status, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("wanqingmrfz", {
  pack: "epicSJZX",
  sex: "male",
  group: "yanmrfz",
  hp: 4,
  skills: ["guantianmrfz", "yingfengmrfz"]
});
skill({
  "guantianmrfz": {
    audio: 2,
    forced: true,
    trigger: { global: "drawBegin" },
    filter: function(event, player) {
      return _status.currentPhase == player && event.getParent(1).name != "guantianmrfz";
    },
    async content(event, trigger, player) {
      trigger.cancel();
      trigger.player.chooseToGuanxing(trigger.num);
      trigger.player.draw(trigger.num);
    }
  },
  "yingfengmrfz": {
    audio: 2,
    trigger: { player: "phaseBeginStart" },
    frequent: true,
    async content(event, trigger, player) {
      var list = Array.from({ length: lib.phaseName.length }, (_, index2) => (index2 + 1).toString());
      const { index } = await player.chooseControl(list).set("prompt", "【万顷】:请选择你要跳过的阶段数").set("ai", function() {
        var player2 = _status.event.player;
        var friend = game.filterPlayer((current) => {
          return get.attitude(current, player2) > 0;
        });
        var list2 = _status.event.list;
        if (friend.length > 3 && player2.getSkillsList().length > 1) return list2.length - 1;
        if (player2.countCards("h") <= player2.getHandcardLimit() && friend.length > 2) return 3;
        return 1;
      }).set("list", list).forResult();
      if (!index) return;
      let phase = [], num = index + 1;
      for (var i = 0; i < num; i++) {
        player.skip(lib.phaseName[i]);
        phase.push(lib.phaseName[i]);
      }
      game.log(player, "跳过了", `#y${get.tranPhase(phase)}`);
      player.when("phaseEnd").then(async (event2, trigger2, player2) => {
        const result = await player2.chooseTarget(true, `【应风】:请选择至多${get.cnNumber(index)}名角色，令其摸${get.cnNumber(Math.floor(index / 2))}张牌`, [
          1,
          index
        ]).set("ai", (target) => get.attitude(player2, target) > 0).forResult();
        if (result.targets) {
          await game.asyncDraw(result.targets, Math.floor(index / 2));
          const list2 = player2.getSkillsList();
          if (index > 4 && list2.length > 0) {
            if (list2.length == 1) {
              player2.removeSkill(list2[0]);
              event2.finish();
            } else {
              const { control } = await player2.chooseControl(list2).set("prompt", "【应风】:请选择失去一个技能").set("ai", function() {
                var list3 = _status.event.list;
                if (list3.includes("yingfengmrfz") && list3.length > 1) list3.remove("yingfengmrfz");
                return list3.randomGet();
              }).set("list", list2).forResult();
              if (control) {
                player2.removeSkill(control);
                game.log(player2, `失去了技能<span class="yellowtext">【${get.translation(control)}】</span>`);
              }
            }
          }
        }
      }).vars({ index: num });
    },
    ai: {
      effect: {
        target: function(card, player, target, current) {
          if (get.type(card) == "delay") return "zeroplayertarget";
        }
      }
    }
  }
});
translate({
  "wanqingmrfz": "万顷",
  "guantianmrfz": "观天",
  "guantianmrfz_info": "锁定技，你的回合内，当有角色不因此技能而从牌堆中获得牌时，改为卜算X。（X=此次摸牌数）",
  "yingfengmrfz": "应风",
  "yingfengmrfz_info": "回合开始时，你可以选择跳过本回合前任意个阶段，并于回合结束后令至多等量名角色摸等量/2（向下取整）张牌，若选择跳过的阶段大于4，你失去一个技能。"
});
characterTitle("wanqingmrfz", "<font color=#C0C0C0>牵风者</font>");
characterIntro("wanqingmrfz", "万顷，本名禾生，炎国天师府学徒，担任农业天师一职。在大荒城多项育种实验中取得了重要的成果。经黍介绍，来到罗德岛访学交流，兼任后勤干员。");
//# sourceMappingURL=wanqingmrfz.js.map
