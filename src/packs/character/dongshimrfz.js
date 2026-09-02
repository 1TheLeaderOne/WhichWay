import { ui, get } from "noname";
import { whichWayMath } from "../../math/index.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("dongshimrfz", {
  pack: "rareSJZX",
  sex: "female",
  group: "wumrfz",
  hp: 3,
  skills: ["gelimrfz"]
});
skill({
  "gelimrfz": {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
    forced: true,
    trigger: {
      player: "useCardAfter"
    },
    filter(event, player) {
      let discarded = Array.from(ui.discardPile.childNodes).map((i) => get.number(i)).filter((i) => ![null, "unsure", void 0].includes(i));
      if (discarded.length < 1) return false;
      let mean = whichWayMath.mean(discarded);
      let sd = whichWayMath.std(discarded);
      return get.number(event.card) > mean + sd || get.number(event.card) < mean - sd;
    },
    mark: true,
    intro: {
      content() {
        let discarded = Array.from(ui.discardPile.childNodes).map((i) => get.number(i)).filter((i) => ![null, "unsure", void 0].includes(i));
        if (discarded.length < 1) return `弃牌堆中没有牌!`;
        let mean = whichWayMath.mean(discarded);
        let sd = whichWayMath.std(discarded);
        let str = [];
        for (let i = 1; i < 4; i++) {
          str.push(`正负${i}个标准差:(${mean - i * sd} , ${mean + i * sd})`);
        }
        return str.join("<br>");
      }
    },
    // @ts-ignore
    async content(event, trigger, player) {
      let discarded = Array.from(ui.discardPile.childNodes).map((i) => get.number(i)).filter((i) => ![null, "unsure", void 0].includes(i));
      let mean = whichWayMath.mean(discarded);
      let sd = whichWayMath.std(discarded);
      let num = get.number(trigger.card);
      let draw = 0;
      for (let i = 1; i < 4; i++) {
        if (num > mean + i * sd || num < mean - i * sd) {
          draw = i;
        }
      }
      if (draw > 0) player.draw(draw);
    }
  }
});
translate({
  "dongshimrfz": "冬时",
  "gelimrfz": "格理",
  "gelimrfz_info": "锁定技，当你使用一张牌后，若X∉(M-N∂,M+N∂)，你摸N张牌。（X为此牌点数，N=1/2/3，M和∂为以弃牌堆中牌对应的点数为样本的平均值和标准差）"
});
characterTitle("dongshimrfz", "<font color = red>循理归因</font>");
characterIntro("dongshimrfz", "冬时，本名科谢尼娅·马尔科芙娜·涅留朵娃，原乌萨斯远北中心矿区研究所研究员，现入职罗德岛，继续其在乌萨斯从事的部分研究。");
