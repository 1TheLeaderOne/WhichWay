import { whichWayUtil } from "../../utill.js";
import { character, characterTitle, characterIntro, translate, skill } from "../hooks.js";
import { get, game, lib } from "noname";
const NAME = "taojinniangmrfz";
character(NAME, {
  sex: "female",
  group: "luomrfz",
  pack: "rareSJZX",
  skills: ["yuyimrfz", "yaojinmrfz"],
  hp: 3,
  designer: ["禾"]
});
characterTitle(NAME, "<font color = blue>大将军？</font>");
characterIntro(NAME, "桃金娘，杜林族出身的少女，根据本人强烈要求，记录此前履历为：大将军。<br>外表与性格有孩子气的成分，但在战场上表现出颇强的感染力和相当的指挥水准，能够在提振其他干员士气的同时，为他们提供一定的治疗，十分可靠。");
translate({
  taojinniangmrfz: "桃金娘",
  yuyimrfz: "愈翼",
  yuyimrfz_info: "每回合开始时，你可以将手牌中当前未移出的一种类别的所有牌移出，然后你抉择：<br>1.于X+1个回合结束后获得之;<br>2.于X回合间将本次移出牌当【桃】使用。<br>（X = 本次失去牌数）",
  yaojinmrfz: "躍金",
  yaojinmrfz_info: "当你一次性失去至少两张牌后，你可以执行至第X项：<br>1.令至多X名角色摸一张牌;<br>2.手牌上限+1直到你受到伤害;<br>3.摸一张牌直到你因此获得了基本牌，然后将手牌调整至手牌上限。<br>（X = 本次失去牌数）"
});
skill({
  yuyimrfz: {
    audio: ["部署2", "行动出发"],
    trigger: {
      player: "phaseBeginStart"
    },
    filter(event, player, name, target) {
      return player.countCards("h") > 0;
    },
    async cost(event, trigger, player) {
      const types = Array.from(new Set(player.getCards().map((i) => get.type2(i))));
      const result = await player.chooseControl({
        controls: types.add("cancel2"),
        prompt: "【愈翼】：你可以将手牌中当前未移出的一种类别的所有牌移出，然后你抉择：<br>1.于X+1个回合结束后获得之;<br>2.于X回合间将本次移出牌当【桃】使用。<br>（X = 本次失去牌数）",
        ai(event2, player2) {
          const types2 = get.event().TYPES;
          const val = {};
          for (let type2 of types2) {
            if (Array.isArray(val[type2])) {
              val[type2] = [];
            }
          }
          for (let card of player2.getCards("h")) {
            if (val[get.type2(card)]) {
              val[get.type2(card)].push(card);
            }
          }
          if (!player2.hasSkill("yaojinmrfz")) {
            if (player2.getExpansions("yuyimrfz").length > 0) return "cancel2";
            let type2 = "cancel2";
            let minVal2 = 0;
            for (let key in val) {
              const cur = accumulateCardVal(val[key]);
              if (cur <= minVal2) {
                minVal2 = cur;
                type2 = key;
              }
            }
            return type2;
          }
          let maxNum = null;
          for (let key in val) {
            const cur = val[key].length;
            if (cur >= (maxNum || 0) && cur <= 3) {
              maxNum = cur;
            }
          }
          if (maxNum === null) {
            return types2.randomGet();
          }
          let candidates = [];
          for (let key in val) {
            if (val[key].length === maxNum) {
              candidates.push(key);
            }
          }
          let type = "cancel2";
          let minVal = 0;
          for (let key of candidates) {
            const cur = accumulateCardVal(val[key]);
            if (cur <= minVal) {
              minVal = cur;
              type = key;
            }
          }
          return type;
        }
      }).set("TYPES", types).forResult();
      event.result = {
        ...result,
        cost_data: result
      };
    },
    async content(event, trigger, player) {
      const type = event.cost_data.control;
      if (!type) return;
      const cards = player.getCards("h", (card) => get.type2(card) === type);
      const result = await player.addToExpansion({
        cards,
        gaintag: ["yuyimrfz"],
        source: player
      });
      console.log(result);
      if (!result.cards) return;
      const { control } = await player.chooseControl({
        controls: ["选项一", "选项二"],
        choiceList: [`于${result.cards.length + 1}个回合结束后获得之`, `于${result.cards.length}回合间将本次移出牌当【桃】使用`],
        ai(event2, player2) {
          if (!player2.hasSkill("yaojinmrfz")) return "选项二";
          return ["选项一", "选项二"].randomGet();
        }
      }).forResult();
      if (!control) return;
      const transfer = {
        选项一: "gain",
        选项二: "tao"
      };
      const id = whichWayUtil.getRandomNumber(8);
      player.storage.yuyimrfz[transfer[control]][id] = {
        turn: result.cards.length + (transfer[control] === "gain" ? 1 : 0),
        accumulate: 0,
        cards: result.cards
      };
    },
    init(player, skill2) {
      player.storage[skill2] = {
        gain: {},
        tao: {}
      };
    },
    onremove(player, type) {
      const cards = player.getExpansions("yuyimrfz");
      if (cards.length > 0) {
        player.loseToDiscardpile({ cards });
      }
    },
    intro: {
      mark(dialog, storage, player) {
        const { gain, tao } = storage;
        for (let key in gain) {
          const data = gain[key];
          dialog.addText("");
          dialog.addText(`于${data.turn - data.accumulate}回合后获得之`);
          dialog.addAuto(data.cards);
        }
        for (let key in tao) {
          const data = tao[key];
          dialog.addText("");
          dialog.addText(`在${data.turn - data.accumulate}回合内可当【桃】使用`);
          dialog.addAuto(data.cards);
        }
      }
    },
    mark: true,
    group: ["yuyimrfz_eff", "yuyimrfz_tao"],
    subSkill: {
      tao: {
        charlotte: true,
        auido: false,
        silent: true,
        enable: "chooseToUse",
        hiddenCard(player, name) {
          return name === "tao" && Object.keys(player.storage?.yuyimrfz?.tao || {}).length > 0;
        },
        filter(event, player) {
          if (event.yuyimrfz_tao) {
            return false;
          }
          return event.filterCard(get.autoViewAs({ name: "tao" }, "unsure"), player, event) && Object.keys(player.storage?.yuyimrfz?.tao || {}).length > 0;
        },
        delay: false,
        async content(event, trigger, player) {
          const evt = event.getParent(2);
          evt.set("yuyimrfz_tao", true);
          const taos = player.storage?.yuyimrfz?.tao;
          const group = Object.keys(taos).length;
          let cards = [];
          if (group < 2) {
            for (let key in taos) {
              const data = taos[key];
              cards = data.cards;
              delete taos[key];
            }
          } else {
            let control = [];
            for (let i = 0; i < group; i++) {
              control.push([Object.keys(taos)[i], `第${get.cnNumber(i + 1, true)}组`]);
            }
            const dialogAuto = ["【愈翼】:将一组牌当作【桃】使用", [control, "tdnodes"]];
            let i_tmp = 0;
            for (let key in taos) {
              const data = taos[key];
              dialogAuto.addArray([`第${get.cnNumber(i_tmp + 1, true)}组`, data.cards]);
              i_tmp += 1;
            }
            const result = await player.chooseButton().set("createDialog", dialogAuto).forResult();
            if (!result || !result.links) return;
            cards = taos[result.links[0]].cards;
            delete taos[result.links[0]];
          }
          console.log(cards);
          game.broadcastAll((result) => {
            lib.skill.yuyimrfz_backup.viewAs = { name: "tao", cards: result, isCard: true };
          }, cards);
          evt.set("_backupevent", "yuyimrfz_backup");
          evt.set("openskilldialog", "请选择【桃】的目标");
          evt.backup("yuyimrfz_backup");
          evt.goto(0);
        }
      },
      eff: {
        charlotte: true,
        audio: false,
        silent: true,
        trigger: {
          global: "phaseAfter"
        },
        async content(event, trigger, player) {
          for (let type in player.storage.yuyimrfz) {
            const sub = player.storage.yuyimrfz[type];
            for (let key in sub) {
              const data = sub[key];
              data.accumulate += 1;
              if (data.accumulate >= data.turn) {
                if (type === "gain") {
                  await player.gain({
                    cards: data.cards,
                    gaintag: []
                  });
                } else {
                  await player.loseToDiscardpile({ cards: data.cards });
                }
                player.logSkill("yuyimrfz");
                delete player.storage.yuyimrfz[type][key];
              }
            }
          }
        }
      },
      backup: {
        async precontent(event, trigger, player) {
          let name = event.result.card.name, cards = event.result.card.cards.slice(0);
          event.result.cards = cards;
          let rcard = cards[0], card;
          if (rcard.name == name) {
            card = get.autoViewAs(rcard);
          } else {
            card = get.autoViewAs({ name, isCard: true });
          }
          event.result.card = card;
          event.result._apply_args = { addSkillCount: false };
        },
        filterCard: () => false,
        selectCard: -1,
        log: false
      }
    }
  },
  yaojinmrfz: {
    audio: ["作战中3", "作战中2"],
    trigger: {
      player: "loseAfter"
    },
    filter(event, player, name, target) {
      return event.cards.length >= 2;
    },
    prompt2(event, player) {
      const num = event.cards.length;
      return `当你一次性失去至少两张牌后，你可以执行至第${Math.min(num, 3)}项：<br>1.令至多${num}名角色摸一张牌;<br>2.手牌上限+1直到你受到伤害;<br>3.摸一张牌直到你因此获得了基本牌，然后将手牌调整至手牌上限。<br>（X = 本次失去牌数）`;
    },
    async content(event, trigger, player) {
      if (trigger.cards.length >= 1) {
        const result = await player.chooseTarget({
          forced: true,
          prompt: `令至多${trigger.cards.length}名角色摸一张牌`,
          ai(target) {
            return get.attitude2(target) > 0 ? 1145141919810 - target.countCards("h") : -1;
          },
          selectTarget: [0, trigger.cards.length],
          filterTarget: () => true
        }).forResult();
        if (result.targets) {
          await game.asyncDraw(result.targets, 1);
        }
      }
      if (trigger.cards.length >= 2) {
        player.addMark("yaojinmrfz", 1, false);
      }
      if (trigger.cards.length >= 3) {
        while (true) {
          const result = await player.draw().forResult();
          if (!result.cards) break;
          if (result.cards.some((i) => get.type2(i) === "basic")) {
            if (player.countCards("h") > player.getHandcardLimit()) {
              player.chooseToDiscard({
                forced: true,
                prompt: `【躍金】:将手牌调整至${player.getHandcardLimit()}`,
                selectCard: player.countCards("h") - player.getHandcardLimit(),
                ai(card) {
                  return -get.value(card);
                }
              });
            } else if (player.countCards("h") < player.getHandcardLimit()) {
              player.drawTo(player.getHandcardLimit());
            }
            break;
          }
        }
      }
    },
    group: "yaojinmrfz_remove",
    subSkill: {
      remove: {
        charlotte: true,
        silent: true,
        trigger: {
          player: "damageEnd"
        },
        async content(event, trigger, player) {
          player.removeMark("yaojinmrfz", 1145141919810, false);
          player.unmarkSkill("yaojinmrfz");
        }
      }
    },
    onremove: true,
    intro: {
      content: "手牌上限+#"
    },
    mod: {
      maxHandcard(player, num) {
        return num += player.countMark("yaojinmrfz");
      }
    }
  }
});
function accumulateCardVal(arr) {
  const numbers = arr.slice().map((i) => get.value(i));
  let num = 0;
  for (let v of numbers) {
    num += v;
  }
  return num;
}
