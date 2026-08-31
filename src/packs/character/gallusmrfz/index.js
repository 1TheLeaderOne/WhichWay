import { character, characterTitle, characterIntro, translate, skill } from "../../hooks.js";
import { get, game } from "noname";
const CHARNAME = "gallusmrfz";
character(CHARNAME, {
  group: "luomrfz",
  sex: "female",
  skills: ["jibaomrfz"],
  hp: 4,
  pack: "mediocreSJZX"
});
characterTitle(CHARNAME, "<font color = #2463d0>电流相生</font>");
characterIntro(CHARNAME, "自称“GALLUS²”的特异存在，其主体为金属与玻璃构成的小屋，由爪状的金属足支撑，小屋背侧及足后侧缀有少量生物质羽毛。发现于泽尔格勒的石棺核心，经确认为石棺产出的特殊生命形态，携带着万余年前的完整记忆，其中大部分与凯尔希有关。从泽尔格勒撤离后跟随凯尔希回到罗德岛，作为历史顾问、生物学顾问，以及外勤干员协助工作。");
translate({
  gallusmrfz: "GALLUS²",
  jibaomrfz: "鸡煲",
  jibaomrfz_info: `锁定技，当你的牌因使用而进入弃牌堆后，你将此牌置入“${get.poptip("sjzx_orbArea")}”。
    <br><b>基本牌</b><br>
    <font color = red>激发：造成一点伤害</font><br>
    <font color = #e40fcf>被动：造成一点伤害</font><br>

    <b>锦囊牌</b><br>
    <font color = red>激发：获得两点护甲</font><br>
    <font color = #e40fcf>被动：获得一点护甲</font><br>

    <b>装备牌</b><br><font color = red>激发：摸四张牌</font><br>
    <font color = #e40fcf>被动：摸两张牌</font>`
});
skill({
  jibaomrfz: {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
    trigger: {
      global: "cardsDiscardAfter"
    },
    forced: true,
    filter(event, player, name, target) {
      return game.getGlobalHistory("cardMove", (evt) => {
        if (evt.name !== "cardsDiscard") {
          return false;
        }
        const evtx = evt.getParent();
        if (evtx.name !== "orderingDiscard") {
          return false;
        }
        const evt2 = evtx.relatedEvent || evtx.getParent();
        if (evt2.name != "useCard" || evt2?.player !== player) {
          return false;
        }
        return evt.getd?.()?.length > 0;
      }).includes(event);
    },
    mark: true,
    markimage: "extension/WhichWay/image/skill/orb.webp",
    intro: {
      name: "充能球区",
      mark(dialog, storage, player) {
        if (storage.length < 1) {
          dialog.addText("无");
          return;
        }
        dialog.addText("充能球区");
        dialog.addAuto(storage);
      }
    },
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    onremove(player, skill2) {
      const cards = player.storage[skill2];
      if (cards && cards.length) {
        player.loseToDiscardpile({ cards });
      }
    },
    async content(event, trigger, player) {
      const cards = trigger.cards;
      player.storage.jibaomrfz.addArray(cards);
      const orbs = player.storage.jibaomrfz;
      if (orbs.length > 3) {
        const cards2 = orbs.slice(0, orbs.length - 3);
        for (let card of cards2) {
          player.storage.jibaomrfz.remove(card);
          await player.loseToDiscardpile({ cards: [card] });
          await orb(card, player, "jifa");
        }
      }
    },
    group: "jibaomrfz_round",
    subSkill: {
      round: {
        audio: "jibaomrfz",
        forced: true,
        trigger: {
          global: "roundStart"
        },
        filter(event, player, name, target) {
          return player.storage.jibaomrfz.length > 0;
        },
        async content(event, trigger, player) {
          for (let card of player.storage.jibaomrfz) {
            await orb(card, player, "beidong");
          }
        }
      }
    }
  }
});
async function orb(card, player, type) {
  if (!["trick", "basic", "equip"].includes(get.type(card))) return;
  if (get.type(card) === "basic") {
    const result = await player.chooseTarget({
      prompt: `【充能球】:你可以对一名角色造成${type === "jifa" ? 1 : 1}点伤害`,
      ai(target) {
        return get.attitude2(target) < 0 ? 1 : -1;
      }
    }).forResult();
    if (result?.targets) {
      result.targets[0].damage({
        num: type === "jifa" ? 1 : 1,
        source: player
      });
    }
  } else if (get.type(card) === "equip") {
    player.draw({
      num: type === "jifa" ? 4 : 2
    });
  } else {
    player.changeHujia(type === "jifa" ? 2 : 1, "gain", 5);
  }
}
//# sourceMappingURL=index.js.map
