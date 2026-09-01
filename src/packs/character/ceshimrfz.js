import { character, skill, translate } from "../hooks.js";
character("ceshimrfz", {
  pack: "specialSJZX",
  sex: "female",
  group: "wei",
  hp: 10,
  skills: ["ceshiSkillmrfz"],
  isAiForbidden: true
});
skill({
  "ceshiSkillmrfz": {
    audio: false,
    trigger: { player: "drawBegin" },
    async content(event, trigger, player) {
      trigger.num *= 2;
      trigger.gaintag.push("example_tag");
    }
  }
});
translate({
  "ceshimrfz": "测试",
  "ceshiSkillmrfz": "测试",
  "ceshiSkillmrfz_info": "测试喵"
});
//# sourceMappingURL=ceshimrfz.js.map
