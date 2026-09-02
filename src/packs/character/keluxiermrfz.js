import { whichWayFile } from "../../file.js";
import { whichWayUtil } from "../../utill.js";
import { character, characterTitle, characterIntro, translate, skill } from "../hooks.js";
import { get, ui, lib, game } from "noname";
character("keluxiermrfz", {
  hp: 3,
  maxHp: 3,
  skills: ["jiongtumrfz", "zhanbeimrfz"],
  pack: "legendSJZX",
  group: "bamrfz",
  sex: "female"
});
characterTitle("keluxiermrfz", "<font color = #2263b766>总工程师</font>");
characterIntro("keluxiermrfz", "可露希尔，罗德岛总工程师，采购部负责人，兼管其他多个部门的事务。<br>我就在采购部等着各位，想了解我，还用得着看我的档案吗？<br>——可露希尔");
const stratagemSupport = {
  supports: {
    resupply: {
      audio: "support",
      name: "重新补给",
      intro: "令一名角色摸两张牌并回复一点体力。",
      code: "♣♣♠♦",
      async content(event, player) {
        const { targets } = await player.chooseTarget({
          forced: true,
          prompt: "【重新补给】：令一名角色摸两张牌并回复一点体力。",
          ai(target2) {
            let num = 0;
            if (get.attitude2(target2) < 0) return -1;
            switch (target2.hp) {
              case 0:
                num += 3;
                break;
              case 1:
                num += 2;
                break;
              case 2:
                num += 1;
                break;
            }
            const hdcount = target2.countCards("h");
            if (hdcount <= 1) {
              num += 3;
            } else if (hdcount <= 2) {
              num += 2;
            } else {
              num += 1;
            }
            return num;
          }
        }).forResult();
        const target = targets?.[0];
        if (target) {
          target.draw(2);
          target.recover();
        }
      }
    },
    eagleStrafingRun: {
      audio: "eagle",
      name: "“骏鹰”扫射",
      intro: "对攻击范围内的一名其他角色造成1点伤害。",
      code: "♠♦♦",
      filter(event, player) {
        return game.filterPlayer((char) => char !== player && player.inRange(char)).length > 0;
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【“骏鹰”扫射】：对攻击范围内的一名其他角色造成1点伤害。",
          filterTarget(card, player2, target) {
            return player2.inRange(target) && target !== player2;
          },
          forced: true,
          ai(target) {
            if (get.attitude(target) > 0) return -1;
            return 1145141919810 - target.hp;
          }
        }).forResult();
        if (result.targets?.[0]) {
          result.targets[0].damage({ num: 1, source: player });
        }
      }
    },
    eagleSmoke: {
      audio: "eagle",
      name: "“骏鹰”烟雾攻击",
      intro: "令一名其他角色下一张使用的牌无效。",
      code: "♠♦♠♣",
      filter(event, player) {
        return game.hasPlayer((char) => char !== player);
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【“骏鹰”烟雾攻击】：令一名其他角色下一张使用的牌无效。",
          forced: true,
          ai(target2) {
            return get.attitude2(target2) < 0 ? 1 : -1;
          }
        }).forResult();
        const target = result.targets?.[0];
        if (target) {
          target.addTempSkill("eagleSmokemrfz", { player: "useCardAfter" });
        }
      }
    },
    eagleAirstrike: {
      audio: "eagle",
      name: "“骏鹰”空袭",
      intro: "对攻击范围内的一名其他角色造成2点伤害。",
      code: "♠♦♣♦",
      filter(event, player) {
        return game.filterPlayer((char) => char !== player && player.inRange(char)).length > 0;
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【“骏鹰”空袭】：对攻击范围内的一名其他角色造成2点伤害。",
          filterTarget(card, player2, target) {
            return player2.inRange(target) && target !== player2;
          },
          forced: true,
          ai(target) {
            if (get.attitude(target) > 0) return -1;
            return 1145141919810 - target.hp;
          }
        }).forResult();
        if (result.targets?.[0]) {
          result.targets[0].damage({ num: 2, source: player });
        }
      }
    },
    eagle500kg: {
      audio: "eagle",
      name: "“骏鹰”500kg",
      intro: "对攻击范围内的一名其他角色造成3点伤害。",
      code: "♠♦♣♣♣",
      filter(event, player) {
        return game.filterPlayer((char) => char !== player && player.inRange(char)).length > 0;
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【“骏鹰”500kg】：对攻击范围内的一名其他角色造成3点伤害。",
          filterTarget(card, player2, target) {
            return player2.inRange(target) && target !== player2;
          },
          forced: true,
          ai(target) {
            if (get.attitude(target) > 0) return -1;
            return 1145141919810 - target.hp;
          }
        }).forResult();
        if (result.targets?.[0]) {
          result.targets[0].damage({ num: 3, source: player });
        }
      }
    },
    airburstStrike: {
      audio: "strike",
      name: "城防炮空爆攻击",
      intro: "视为对至多两名其他角色使用一张【万箭齐发】。",
      code: "♦♦♦",
      filter(event, player) {
        return game.hasPlayer((char) => char !== player && player.canUse("wanjian", char));
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【城防炮空爆攻击】：视为对至多两名其他角色使用一张【万箭齐发】。",
          filterTarget(card, player2, target) {
            return player2.canUse("wanjian", target) && target !== player2;
          },
          selectTarget: [1, 2],
          ai(target) {
            return get.attitude2(target) < 0 ? 1 : -1;
          }
        }).forResult();
        if (result.targets?.length) {
          player.chooseUseTarget({
            filterTarget(card, player2, target) {
              return get.event().targets.includes(target);
            },
            selectTarget() {
              return get.event().targets.length;
            },
            forced: true,
            card: new lib.element.VCard({ name: "wanjian" })
          }).set("targets", result.targets);
        }
      }
    },
    precisionStrike: {
      audio: "strike",
      name: "城防炮精准攻击",
      intro: "视为对一名其他角色使用两张【万箭齐发】。",
      code: "♦♦♠",
      filter(event, player) {
        return game.hasPlayer((char) => char !== player && player.canUse("wanjian", char));
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【城防炮精准攻击】：视为对一名其他角色使用两张【万箭齐发】。",
          filterTarget(card, player2, target) {
            return player2.canUse("wanjian", target) && target !== player2;
          }
        }).forResult();
        if (result.targets?.length) {
          for (let i of [0, 1]) {
            player.chooseUseTarget({
              filterTarget(card, player2, target) {
                return get.event().targets.includes(target);
              },
              forced: true,
              card: new lib.element.VCard({ name: "wanjian" })
            }).set("targets", result.targets);
          }
        }
      }
    },
    gasStrike: {
      audio: "strike",
      name: "城防炮毒气攻击",
      intro: "令一名其他角色弃置两张手牌。",
      code: "♦♦♣♠",
      filter(event, player) {
        return game.hasPlayer((char) => char !== player && char.countCards("he") >= 2);
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【城防炮毒气攻击】：令一名其他角色弃置两张手牌。",
          filterTarget(card, player2, target) {
            return target !== player2 && target.countCards("he") >= 2;
          },
          ai(target) {
            return get.attitude2(target) < 0 ? 1 : -1;
          }
        }).forResult();
        if (result.targets?.[0]) {
          result.targets[0].chooseToDiscard({
            forced: true,
            prompt: "【城防炮毒气攻击】：请弃置两张手牌",
            position: "h",
            selectCard: 2,
            ai(card) {
              return -get.value(card);
            }
          }).set("num", 2);
        }
      }
    },
    napalmBarrage: {
      audio: "barrage",
      name: "城防炮凝固汽油弹火力网",
      intro: "视为对至多三名其他角色使用一张【万箭齐发】",
      code: "♥♥♣♦♥♠",
      filter(event, player) {
        return game.hasPlayer((char) => char !== player && player.canUse("wanjian", char));
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【城防炮凝固汽油弹火力网】：视为对至多三名其他角色使用一张【万箭齐发】",
          filterTarget(card, player2, target) {
            return target !== player2 && player2.canUse("wanjian", target);
          },
          selectTarget: [1, 3],
          forced: true,
          ai(target) {
            return get.attitude2(target) < 0 ? 1 : -1;
          }
        }).forResult();
        if (result.targets?.length) {
          player.chooseUseTarget({
            forced: true,
            card: new lib.element.VCard({ name: "wanjian" }),
            filterTarget(card, player2, target) {
              const targets = get.event().targets;
              return target !== player2 && player2.canUse("wanjian", target) && targets.includes(target);
            },
            selectTarget() {
              return get.event().targets.length;
            }
          }).set("targets", result.targets);
        }
      }
    },
    HEBarrage: {
      audio: "barrage",
      name: "380mm城防炮高爆火力网",
      intro: "视为对任意名其他角色使用五张【万箭齐发】。",
      code: "♥♣♠♠♦♣♣",
      filter(event, player) {
        return game.hasPlayer((char) => char !== player && player.canUse("wanjian", char));
      },
      async content(event, player) {
        const result = await player.chooseTarget({
          prompt: "【380mm城防炮高爆火力网】：视为对任意名其他角色使用五张【万箭齐发】。",
          filterTarget(card, player2, target) {
            return target !== player2 && player2.canUse("wanjian", target);
          },
          forced: true,
          selectTarget: [1, Infinity],
          ai(target) {
            return get.attitude2(target) < 0 ? 1 : -1;
          }
        }).forResult();
        if (result.targets?.[0]) {
          const target = result.targets[0];
          await player.chooseUseTarget({
            forced: true,
            card: new lib.element.VCard({ name: "wanjian" }),
            filterTarget(card, player2, target2) {
              const targetx = get.event().targetx;
              return target2 !== player2 && player2.canUse("wanjian", target2) && targetx === target2;
            }
          }).set("targetx", target);
        }
      }
    }
  },
  codeFilter(code, cards) {
    const colors = this.compileCode(code);
    if (colors.length !== cards.length) return false;
    for (let i = 0; i < colors.length; i++) {
      if (get.suit(cards[i]) !== colors[i]) return false;
    }
    return true;
  },
  compileCode(code) {
    const shceme = {
      "♦": "diamond",
      "♥": "heart",
      "♠": "spade",
      "♣": "club"
    };
    const colors = [];
    for (let suit of code) {
      colors.push(shceme[suit]);
    }
    return colors;
  },
  getCodes(cards) {
    const codes = [];
    for (const name in this.supports) {
      const support = this.supports[name];
      if (this.codeFilter(support.code, cards)) {
        codes.push(...this.compileCode(support.code));
      }
    }
    return codes;
  },
  findMatchingCards(cards) {
    const suitGroups = {};
    for (const card of cards) {
      const suit = get.suit(card);
      if (!suitGroups[suit]) suitGroups[suit] = [];
      suitGroups[suit].push(card);
    }
    const results = [];
    for (const name in this.supports) {
      let backtrack = function(index, current) {
        if (found) return;
        if (index === requiredSuits.length) {
          results.push({
            cards: [...current],
            name: support.name,
            intro: support.intro
          });
          found = true;
          return;
        }
        const targetSuit = requiredSuits[index];
        const candidates = suitGroups[targetSuit];
        for (const card of candidates) {
          if (!used.has(card)) {
            used.add(card);
            current.push(card);
            backtrack(index + 1, current);
            current.pop();
            used.delete(card);
          }
        }
      };
      const support = this.supports[name];
      const requiredSuits = this.compileCode(support.code);
      const needed = {};
      for (const suit of requiredSuits) {
        needed[suit] = (needed[suit] || 0) + 1;
      }
      let sufficient = true;
      for (const suit in needed) {
        if (!suitGroups[suit] || suitGroups[suit].length < needed[suit]) {
          sufficient = false;
          break;
        }
      }
      if (!sufficient) continue;
      const used = /* @__PURE__ */ new Set();
      let found = false;
      backtrack(0, []);
    }
    return results;
  },
  async playAudio(name) {
    let path = `audio:stratagem/`;
    const { files } = await whichWayFile.getFileTree(path);
    let vaildFiles = files.filter((f) => f.name.startsWith(name));
    if (vaildFiles.length === 0) return;
    const file = vaildFiles.randomGet();
    whichWayUtil.playSound(file.path);
  }
};
if (whichWayUtil.isDeveloperMode()) {
  window.stratagemSupport = stratagemSupport;
}
translate({
  keluxiermrfz: "可露希尔",
  jiongtumrfz: "迥途",
  jiongtumrfz_info: "锁定技，你的摸牌阶段改为将手牌补至X+2张牌。(X = 弃牌堆的个位数)",
  zhanbeimrfz: "战备",
  zhanbeimrfz_info: `每轮开始时，或你的出牌阶段开始时，你可以弃置区域内的任意张牌并摸等量章牌，然后根据你弃置的牌的花色执行对应的“${get.poptip("sjzx_stratagemSupport")}”。`
});
skill({
  jiongtumrfz: {
    audio: 2,
    forced: true,
    trigger: {
      player: "phaseDrawBefore"
    },
    async content(event, trigger, player) {
      const str = String(ui.discardPile.childNodes.length);
      const num = Number(str[str.length - 1]);
      player.drawTo(num + 2);
      trigger.cancel();
    },
    group: "jiongtumrfz_tips",
    subSkill: {
      tips: {
        trigger: {
          player: "roundStart"
        },
        onremove(player, type) {
          player.storage.jiongtumrfz_observer?.disconnect();
          player.storage.jiongtumrfz_observer = null;
        },
        silent: true,
        charlotte: true,
        async content(event, trigger, player) {
          function update() {
            const str = String(ui.discardPile.childNodes.length);
            player.addTip("jiongtumrfz_tips", `迥途:补至${Number(str[str.length - 1]) + 2}张`);
          }
          update();
          if (!player.storage.jiongtumrfz_observer) {
            const observer = new MutationObserver(() => update());
            observer.observe(ui.discardPile, { childList: true });
            player.storage.jiongtumrfz_observer = observer;
          }
        }
      }
    }
  },
  zhanbeimrfz: {
    audio: 2,
    trigger: {
      global: "roundStart",
      player: "phaseUseBegin"
    },
    filter(event, player, name, target) {
      return player.countCards("hej") > 0;
    },
    async cost(event, trigger, player) {
      const codes = stratagemSupport.findMatchingCards(player.getCards("hej"));
      const code = codes[Math.floor(Math.random() * codes.length)] || [];
      let tips = "";
      for (let info of codes) {
        tips += `${info.name}(${info.cards.slice(0).map((c) => get.translation(get.suit(c))).join("")})：${info.intro}<br>`;
      }
      if (tips.length <= 0) {
        tips += "没有匹配的牌";
      }
      event.result = await player.choosePlayerCard({
        target: player,
        position: "hej",
        selectButton: [1, Infinity],
        prompt: get.prompt("zhanbeimrfz"),
        prompt2: `你可以弃置区域内的任意张牌并摸等量章牌，然后根据你弃置的牌的花色执行对应的“${get.poptip("sjzx_stratagemSupport")}<br>${tips}`,
        ai(button) {
          const code2 = get.event().code;
          const card = button.link;
          if (get.suit(card) === get.suit(code2.cards[ui.selected.buttons.length])) return 1145141919810 - get.value(card);
          return 6 - get.value(card);
        }
      }).set("code", code).forResult();
    },
    async content(event, trigger, player) {
      const cards = event.cards;
      await player.discard({
        cards
      });
      await player.draw({ num: cards.length });
      for (let name in stratagemSupport.supports) {
        const support = stratagemSupport.supports[name];
        if (stratagemSupport.codeFilter(support.code, cards) && (support.filter === void 0 || support.filter(event, player))) {
          stratagemSupport.playAudio(support.audio);
          await support.content(trigger, player);
          break;
        }
      }
    }
  },
  eagleSmokemrfz: {
    mark: true,
    marktext: "烟",
    intro: {
      name: "“骏鹰”烟雾攻击",
      content: "你的下一张使用的牌无效。"
    },
    charlotte: true,
    silent: true,
    trigger: { player: "useCardBegin" },
    async content(event, trigger, player) {
      trigger.cancel();
    }
  }
});
