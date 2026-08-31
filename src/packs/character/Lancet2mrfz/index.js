import { get } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("Lancet2mrfz", {
  hp: 4,
  group: "luomrfz",
  sex: "female",
  skills: ["linyuanmrfz"]
});
skill({
  "linyuanmrfz": {
    audio: ["行动开始", "作战中2", "作战中3", "作战中4"],
    trigger: { global: "roundStart" },
    filter(event, player) {
      return ["wugu", "taoyuan", "yiyi"].some((name) => player.hasUseTarget(name));
    },
    async cost(event, trigger, player) {
      let names = ["wugu", "taoyuan", "yiyi"];
      let result = {};
      for (let name of names) {
        let resultx = await player.chooseTarget().set("prompt", get.prompt("linyuanmrfz")).set("prompt2", `请选择${get.translation(name)}的目标`).set("filterTarget", (card, player2, target) => {
          return player2.canUse(get.event().namex, target);
        }).set("selectTarget", [1, Infinity]).set("namex", name).forResult();
        if (resultx.bool === true) result[name] = resultx;
      }
      if (Object.keys(result).length > 0) {
        event.result = {
          bool: true,
          cost_data: result
        };
      }
    },
    async content(event, trigger, player) {
      for (let name in event.cost_data) {
        let info = event.cost_data[name];
        await player.chooseUseTarget({ name }, info.targets).set("forced", true).set("filterTarget", () => true);
      }
    },
    group: "linyuanmrfz_yiyi",
    subSkill: {
      yiyi: {
        charlotte: true,
        silent: true,
        trigger: { player: "chooseTargetBegin" },
        filter(event, player) {
          return event.getParent(2)?.name === "linyuanmrfz";
        },
        async content(event, trigger, player) {
          trigger.result = {
            bool: true,
            confirm: "ok",
            //@ts-ignore
            targets: trigger.getParent().targets
          };
          trigger.cancel();
        }
      }
    }
  }
});
translate({
  "Lancet2mrfz": "Lancet-2",
  "linyuanmrfz": "临援",
  "linyuanmrfz_info": "每轮开始时，你可以视为使用指定任意目标的【五谷丰登】、【桃园结义】和【以逸待劳】。"
});
characterTitle("Lancet2mrfz", "<font color = #b7229c66>一喷起效</font>");
characterIntro("Lancet2mrfz", "Lancet-2是可露希尔客制化后的雷神存在者™S Typer 62六轮作业平台，圆形的外观让人觉得很可爱所以成为了某种意义上的吉祥物。虽然她说话有时候很消极，但是大家都很喜欢她。<br>Lancet-2在经过可露希尔的改造后，得以满足更多罗德岛内的医疗需求，其器械设备也更注重于消毒和应对源石污染");
//# sourceMappingURL=index.js.map
