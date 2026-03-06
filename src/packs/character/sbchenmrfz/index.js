import { character, translate, skill } from "../../hooks.js";
import { get, game, ui, lib } from "noname";
character("sbchenmrfz", {
  hp: 4,
  maxHp: 4,
  skills: ["tiankuimrfz", "xiaoshimrfz"],
  pack: "legendSJZX",
  group: "yanmrfz",
  sex: "female"
});
translate({
  sbchenmrfz: "赤刃明霄陈",
  sbchenmrfz_prefix: "赤刃明霄",
  xiaoshimrfz: "霄式",
  xiaoshimrfz_info: "以下选项首尾相连，当你使用与一个选项同名的有对应实体牌的牌后，你可以视为使用与该选项相邻的一张牌（无次数和距离限制）。<br>①火【杀】②桃 ③雷【杀】④冰【杀】 ⑤杀 ⑥酒 ⑦闪。",
  tiankuimrfz: "天喟",
  tiankuimrfz_info: "限定技，任意角色的结束阶段，若你本回合至少使用过三种不同牌名的基本牌，你可以视为使用本回合你所有没有使用过的基本牌和普通锦囊牌。"
});
skill({
  xiaoshimrfz: {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
    trigger: { player: "useCardAfter" },
    filter(event, player, name, target) {
      return event.card && event.cards && event.cards.length > 0 && Array.isArray(getAdjacentCard(event.card));
    },
    async cost(event, trigger, player) {
      const adjoins = getAdjacentCard(trigger.card)?.filter((card2) => player.hasUseTarget(card2, true, false));
      if (adjoins.length < 2) {
        const result2 = await player.chooseBool(`【霄式】:是否视为使用一张${get.translation(adjoins[0])}(无距离次数限制)？`).set("ai", () => {
          const player2 = get.player();
          const card2 = get.event().adjoin;
          return player2.getUseValue(card2, true, false) > 0;
        }).set("adjoin", adjoins[0]).forResult();
        event.result = {
          ...result2,
          cost_data: {
            name: adjoins[0].name,
            nature: adjoins[0].nature
          }
        };
        return;
      }
      for (const card2 of adjoins) {
        const vcard = game.createCard(card2);
        vcard.storage.virtualCard_xiaoshimrfz = true;
        player.directgain([vcard]);
      }
      const result = await player.chooseCard().set("prompt", `【霄式】:你可以视为使用一张牌`).set("filterCard", (card2) => card2.storage.virtualCard_xiaoshimrfz === true).set("ai", (card2) => {
        const player2 = get.player();
        return player2.getUseValue(card2, true, false) > 0;
      }).forResult();
      if (!result.cards) return removeVirtualCards();
      const card = result.cards[0];
      event.result = {
        ...result,
        cost_data: {
          name: get.name(card),
          nature: get.nature(card)
        }
      };
      removeVirtualCards();
      function removeVirtualCards() {
        const cards = player.getCards("hejs", (card2) => card2.storage.virtualCard_xiaoshimrfz === true);
        cards.forEach((card2) => card2.delete());
        ui.updateh();
      }
    },
    async content(event, trigger, player) {
      const { name, nature } = event.cost_data;
      const { cards: [card] = [] } = await player.chooseUseTarget({ name, nature }).set("forced", true).set("addCount", false).set("nodistance", true).forResult();
      if (!card) return;
      if (typeof player.getStat("card")?.[name] === "number") {
        player.getStat("card")[name]--;
      }
    }
  },
  tiankuimrfz: {
    audio: ["部署2", "选中干员2"],
    limited: true,
    trigger: { global: "phaseJieshuAfter" },
    filter(event, player, name, target) {
      return getDifferent(player, true) > 2;
    },
    prompt2(event, player) {
      return `可使用的牌:${get.translation(getDifferent(player))}`;
    },
    async content(event, trigger, player) {
      player.awakenSkill(event.name);
      const cards = getDifferent(player);
      const showCards = [...cards];
      for (const card of cards) {
        await player.chooseUseTarget(card).set("addCount", false).set("nodistance", true).set("prompt", `【天喟】:你可以视为使用一张${get.translation(card)}(无距离次数限制)？`).set("prompt2", `待使用的牌:${get.translation(showCards)}`);
        showCards.remove(card);
        game.trySkillAudio("tiankuimrfz", player);
      }
    }
  }
});
function getDifferent(player, getNum = false) {
  const simples = [];
  const events = player.getHistory("useCard", (evt) => evt.card !== void 0);
  let num = 0;
  for (const name of lib.inpile) {
    if (!["trick", "basic"].includes(get.type(name))) continue;
    if (name === "sha") {
      ["fire", "thunder", "ice", void 0].forEach((nature) => simples.push({ name: "sha", nature }));
    }
    simples.push({ name, nature: void 0 });
  }
  for (const evt of events) {
    if (simples.some((simple) => simple.name === evt.card.name && simple.nature === evt.card.nature)) {
      simples.remove({ name: evt.card.name, nature: evt.card.nature });
      num++;
    }
  }
  return getNum ? num : simples.map((simple) => new lib.element.VCard("none", void 0, simple.name, simple.nature));
}
function getAdjacentCard(card) {
  const nameList = [["sha", "fire"], "tao", ["sha", "thunder"], ["sha", "ice"], "sha", "jiu", "shan"];
  const { name, nature } = card;
  let index;
  for (let i = 0; i < nameList.length; i++) {
    let names = nameList[i];
    if (Array.isArray(names) && names[0] === name && names[1] === nature) {
      index = i;
      break;
    } else if (names === name) {
      index = i;
      break;
    }
  }
  if (typeof index === "number") {
    const former = nameList[index > 1 ? index - 1 : nameList.length - 1];
    const latter = nameList[index < nameList.length - 1 ? index + 1 : 0];
    return [getCard(former), getCard(latter)];
  }
  return void 0;
  function getCard(str) {
    if (Array.isArray(str)) {
      return new lib.element.VCard("none", void 0, str[0], str[1]);
    }
    return new lib.element.VCard("none", void 0, str);
  }
}
//# sourceMappingURL=index.js.map
