import { get, game, ui, lib } from "noname";
import { character, characterIntro, characterTitle, translate, skill, card, cardTranslate, cardSkill } from "../hooks.js";
import { whichWayFile } from "../../file.js";
const NAME = "jixieshimrfz";
const CARDNAME = "SP_jixieshimrfz";
const STRUCT_TAG = CARDNAME;
character(NAME, {
  hp: 4,
  group: "luomrfz",
  sex: "male",
  pack: "legendSJZX",
  skills: ["xiefangmrfz", "juleimrfz"],
  designer: ["Flandre"]
});
characterIntro(NAME, "机械师，罗德岛精英干员，主导罗德岛的武器装备、工程设施及实验器材的研发、制造及维护工作，为罗德岛各部门干员提供必要的硬件支持。");
characterTitle(NAME, "<font color = #316dd5>机械之心</font>");
const sp_poptip = get.poptip(CARDNAME);
translate({
  [NAME]: "机械师",
  xiefangmrfz: "协防",
  xiefangmrfz_info: `锁定技，准备阶段，若你的装备区内没有${sp_poptip}，你将${sp_poptip}置入你的装备区，你可将置于${sp_poptip}下的牌如手牌般使用。`,
  juleimrfz: "聚类",
  juleimrfz_info: "当你使用的牌结算完成后，若该类型的牌是你手牌中最多的类型，你可以对一名角色造成一点伤害，反之你摸一张牌。"
});
skill({
  xiefangmrfz: {
    audio: ["部署1", "部署2"],
    forced: true,
    trigger: { player: "phaseZhunbeiBegin" },
    derivation: [CARDNAME],
    filter(event, player) {
      return !player.hasCard((card2) => get.name(card2) === CARDNAME, "e");
    },
    async content(event, trigger, player) {
      const card2 = get.cardPile(CARDNAME, "field") || game.createCard(CARDNAME, "heart", 1);
      await player.equip(card2);
    },
    group: ["xiefangmrfz_sync"],
    subSkill: {
      //同步对所有拥有“协防”的角色生效（global 触发）：无论谁（含不拥有协防的角色、已死亡角色）
      //使用/打出/弃置了“结构性原理”下的牌，存储记录都会被拥有协防的角色同步维护
      sync: {
        audio: false,
        charlotte: true,
        forced: true,
        silent: true,
        popup: false,
        trigger: { global: "loseEnd" },
        filter(event, player) {
          if (!event.ss || !event.ss.length) return false;
          return event.ss.some((card2) => (event.gaintag_map?.[card2.cardid] || []).includes(STRUCT_TAG));
        },
        async content(event, trigger, player) {
          const lost = trigger.ss.filter((card2) => (trigger.gaintag_map?.[card2.cardid] || []).includes(STRUCT_TAG));
          if (!lost.length) return;
          for (const current of game.players.concat(game.dead ?? [])) {
            for (const vcard of current.getVCards("e")) {
              if (vcard.name === CARDNAME && Array.isArray(vcard.storage?.saveCards)) {
                vcard.storage.saveCards.removeArray(lost);
                const structCards = vcard.cards;
                if (!structCards) continue;
                for (let structCard of structCards) {
                  if (Array.isArray(structCard.storage.saveCards)) {
                    structCard.storage.saveCards.removeArray(lost);
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  juleimrfz: {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
    trigger: {
      player: "useCardAfter"
    },
    async cost(event, trigger, player) {
      const type = get.type(trigger.card, "trick");
      const cards = player.getCards("h");
      if (type === getMaxType(cards)) {
        event.result = await player.chooseTarget({
          prompt: get.prompt("juleimrfz"),
          prompt2: "你可以对一名角色造成一点伤害",
          ai(target) {
            const player2 = get.player();
            return get.damageEffect(target, player2, player2);
          }
        }).forResult();
      } else {
        event.result = await player.chooseBool({
          prompt: "【聚类】:是否摸一张牌？",
          ai(event2, player2) {
            return true;
          }
        }).forResult();
      }
    },
    async content(event, trigger, player) {
      const target = event.targets && event.targets[0];
      if (target) {
        await target.damage({
          source: player
        });
      } else {
        await player.draw();
      }
    }
  }
});
function getMaxType(cards, player) {
  const types = cards.map((i) => get.type2(i));
  const map = {};
  for (let type of types) {
    if (!map[type]) {
      map[type] = 1;
    } else {
      map[type] += 1;
    }
  }
  let max = 0;
  let maxType;
  for (let type in map) {
    const num = map[type];
    if (num > max) {
      max = num;
      maxType = type;
    }
  }
  return maxType;
}
card(CARDNAME, {
  image: whichWayFile.compilePath(`img:card/${CARDNAME}.jpg`),
  type: "equip",
  subtype: "equip5",
  forceDie: true,
  async onEquip(event, trigger, player) {
    const { card: card2 } = event;
    if (!card2) return;
    const physical = event.cards?.length === 1 ? event.cards[0] : card2.cards?.[0];
    if (physical) {
      physical.storage ??= {};
      if (!physical.storage.saveCards) {
        physical.storage.saveCards = [];
      }
    }
    player.markSkill(`${CARDNAME}_skill`);
  },
  onLose: async function(event, trigger, player) {
    const { card: card2 } = event;
    if (!card2) return;
    if (!player.countVCards("e", (i) => i.name === CARDNAME)) {
      player.unmarkSkill(`${CARDNAME}_skill`);
    } else {
      player.markSkill(`${CARDNAME}_skill`);
    }
    const physical = event.cards?.length === 1 ? event.cards[0] : card2.cards?.[0] ?? card2;
    const loseEvent = event.getParent();
    let exempt = false;
    let cur = loseEvent;
    while (cur && cur.name) {
      if (cur.name === "swapEquip") {
        exempt = true;
        break;
      }
      cur = cur.getParent();
    }
    if (!exempt && loseEvent.type === "equip" && !loseEvent.swapEquip) {
      const equipEvent = loseEvent.getParent();
      if (equipEvent && equipEvent.name === "equip" && equipEvent.player && equipEvent.player !== player) {
        exempt = true;
      }
    }
    if (exempt) {
      return;
    }
    const storage = physical.storage?.saveCards ?? card2.storage?.saveCards;
    if (storage && storage.length) {
      const byOwner = /* @__PURE__ */ new Map();
      for (const save of storage) {
        if (get.position(save, true) != "s") continue;
        const owner = get.owner(save);
        if (!owner) continue;
        if (!byOwner.has(owner)) byOwner.set(owner, []);
        byOwner.get(owner).push(save);
      }
      for (const [owner, saves] of byOwner) {
        await owner.lose(saves, ui.discardPile);
        game.log(card2, "掉落了", saves);
        saves.forEach((i) => i.removeGaintag(STRUCT_TAG));
      }
      storage.length = 0;
    }
    physical.destroyed = true;
    physical.selfDestroy(event);
  },
  equipDelay: false,
  loseDelay: false,
  skills: [`${CARDNAME}_skill`],
  ai: {
    basic: {
      equipValue(card2, player) {
        if (player.hasSkill("xiefangmrfz")) return 10;
        return -1;
      }
    },
    result: {
      target: (player, target, card2) => get.equipResult(player, target, card2.name)
    }
  },
  enable: true,
  selectTarget: -1,
  filterTarget: (card2, player, target) => player == target && target.canEquip(card2, true),
  modTarget: true,
  allowMultiple: false,
  content: async function(event, trigger, player) {
    const { cards, target } = event;
    if (cards.length && get.position(cards[0], true) == "o") target.equip(cards[0]);
  },
  toself: true
});
cardTranslate({
  [CARDNAME]: "结构性原理",
  [`${CARDNAME}_info`]: `①出牌阶段限X次，若你拥有技能${get.poptip("xiefangmrfz")}，你可以将一张手牌置于此牌下，然后你可以将此牌置于一名其他角色的装备区内并对其造成一点伤害。（X=本回合使用非基本牌的数量）<br>②锁定技，当此牌不因交换装备或移动至其他装备区而离开你的装备区后，销毁之。`,
  [`${CARDNAME}_skill`]: "结构性原理",
  [`${CARDNAME}_skill_info`]: `①出牌阶段限X次，若你拥有技能${get.poptip("xiefangmrfz")}，你可以将一张手牌置于此牌下，然后你可以将此牌置于一名其他角色的装备区内并对其造成一点伤害。（X=本回合使用非基本牌的数量）<br>②锁定技，当此牌不因交换装备或移动至其他装备区而离开你的装备区后，销毁之。`
});
cardSkill({
  [`${CARDNAME}_skill`]: {
    audio: false,
    enable: "phaseUse",
    //X=本回合使用非基本牌的数量
    usable(card2, player) {
      return player.getHistory("useCard", (evt) => get.type(evt.card, "trick") != "basic").length;
    },
    filter(event, player) {
      return player.hasSkill("xiefangmrfz") && player.getEquip(CARDNAME) && player.countCards("h") > 0;
    },
    filterCard: true,
    position: "h",
    check(card2) {
      return 4 - get.value(card2);
    },
    lose: false,
    discard: false,
    async content(event, trigger, player) {
      const equipCard = player.getEquip(CARDNAME);
      if (!equipCard) return;
      const cards = (event.cards ?? []).slice();
      if (cards.length) {
        const storage = equipCard.storage.saveCards ?? (equipCard.storage.saveCards = []);
        storage.addArray(cards);
        await player.lose({ cards, position: ui.special });
        player.directgains(cards, null, STRUCT_TAG);
        game.log(player, "将", cards, "置于", equipCard, "下");
      }
      const result = await player.chooseTarget({
        prompt: `是否将【${get.translation(CARDNAME)}】置于一名其他角色的装备区内并对其造成1点伤害？`,
        ai(target2) {
          const player2 = get.player();
          return get.damageEffect(target2, player2, player2);
        },
        filterTarget(card2, player2, target2) {
          return target2 != player2 && target2.canEquip(equipCard);
        }
      }).forResult();
      const target = result?.targets?.[0];
      if (!target) return;
      player.line(target);
      await target.equip(equipCard);
      if (target.isIn()) {
        await target.damage({
          source: player
        });
      }
    },
    intro: {
      content(storage, player, skill2) {
        const num = lib.skill[`${CARDNAME}_skill`].usable(null, player);
        const structs = player.getVCards("e", (card2) => card2.name === CARDNAME);
        const cards = [];
        for (const struct of structs) {
          if (struct.storage.saveCards) {
            const structCards = struct.cards;
            if (!structCards) continue;
            for (let structCard of structCards) {
              if (structCard.storage.saveCards) {
                cards.addArray(structCard.storage.saveCards);
              }
            }
          }
        }
        const str = `共有${get.cnNumber(cards.length)}张牌`;
        return `·可使用${num}次<br>·${str}`;
      }
    },
    ai: {
      order: 9,
      result: {
        player: 1
      }
    },
    mod: {
      cardEnabled2(card2, player) {
        if (!ui.selected.cards.length) {
          return;
        }
        const cards = player.getVCards("e", (card3) => card3.name === CARDNAME);
        for (const struct of cards) {
          if (!struct || !struct.storage.saveCards || !struct.storage.saveCards.length) {
            return;
          }
          for (const i of ui.selected.cards) {
            if (struct.cards?.includes(i) && struct.storage.saveCards.includes(card2)) {
              return false;
            }
            if (struct.storage.saveCards.includes(i) && card2 === struct) {
              return false;
            }
          }
        }
      }
    }
  }
});
