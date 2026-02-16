import { lib, get, game, _status } from "noname";
const weinaData = {
  HMS: {
    HMS_Anson: "安森",
    HMS_Rodney: "罗德尼",
    HMS_Nelson: "纳尔逊",
    HMS_Hood: "胡德",
    HMS_Repulse: "声望",
    HMS_Renown: "反击",
    HMS_Furious: "暴怒",
    HMS_Aurora: "曙光",
    HMS_York: "约克",
    HMS_Kent: "肯特",
    HMS_London: "伦敦",
    HMS_Zulu: "祖鲁",
    HMS_Tartar: "鞑靼",
    HMS_Javelin: "标枪",
    HMS_Kelly: "凯利",
    HMS_Legion: "军团",
    HMS_Matchless: "无比",
    HMS_Belfast: "贝法",
    HMS_Formidable: "可畏",
    HMS_Illustrious: "光辉",
    HMS_Valiant: "勇士",
    HMS_Fiji: "斐济",
    HMS_Jupiter: "木星",
    HMS_Glory: "光荣",
    HMS_Falcon: "猎鹰",
    HMS_Phoebe: "菲比",
    HMS_Dido: "狄多",
    HMS_Archer: "弓手"
  },
  trigger: {
    name: lib.hookmap,
    translation: {
      addJudgeAfter: "添加判定牌后",
      addToExpansionAfter: "将牌移除游戏后",
      changeHp: "体力值改变",
      chooseToRespondBegin: "选择牌去响应后",
      damage: "受到伤害",
      damageAfter: "受到伤害后",
      damageBegin: "受到伤害时",
      die: "死亡",
      dieBegin: "死亡时",
      discardAfter: "弃牌后",
      dying: "进入濒死状态",
      equipAfter: "使用装备后",
      gainAfter: "获得牌后",
      gainMaxHpBegin: "获得体力上限时",
      judgeEnd: "判定后",
      logSkill: "触发技能",
      loseAfter: "失去牌后",
      loseMaxHpBegin: "失去体力上限时",
      phaseAfter: "回合结束时",
      phaseBegin: "回合开始时",
      respondBegin: "响应牌时",
      respondEnd: "响应牌后",
      showCharacter: "武将登场",
      useCard: "使用牌时"
    },
    get() {
      const suffixes = ["Begin", "After", "End"];
      const newTranslation = { ...this.translation };
      for (let phase of lib.phaseName) this.translation[phase] = get.translation(phase);
      for (let key in this.translation) {
        if (!suffixes.some((suffix) => key.endsWith(suffix))) {
          if (!newTranslation.hasOwnProperty(key + "Begin")) {
            newTranslation[key + "Begin"] = this.translation[key] + "时";
            delete newTranslation[key];
          }
          if (!newTranslation.hasOwnProperty(key + "After")) {
            newTranslation[key + "After"] = this.translation[key] + "后";
            delete newTranslation[key];
          }
        }
      }
      let names = Object.keys({ ...this.name });
      for (let name of names) {
        if (!name in this.translation) names.remove(name);
      }
      return {
        triggers: names,
        translation: newTranslation
      };
    }
  },
  filter: {
    damage_no: {
      intro: "本回合没有造成伤害",
      filter: function(event2, player2) {
        return !player2.getHistory("sourceDamage").length;
      }
    },
    damage_yes: {
      intro: "本回合造成过伤害",
      filter: function(event2, player2) {
        return player2.getHistory("sourceDamage").length;
      }
    },
    draw_yes: {
      intro: "本回合摸过牌",
      filter: function(event2, player2) {
        return player2.getHistory("gain", function(evt) {
          return evt.getParent().name == "draw";
        }).length > 1;
      }
    },
    draw_no: {
      intro: "本回合没有摸过牌",
      filter: function(event2, player2) {
        return player2.getHistory("gain", function(evt) {
          return evt.getParent().name == "draw";
        }).length < 1;
      }
    },
    loseCard_yes: {
      intro: "本回合失去过牌",
      filter: function(event2, player2) {
        return player2.getHistory("lose").length;
      }
    },
    loseCard_no: {
      intro: "本回合没有失去过牌",
      filter: function(event2, player2) {
        return !player2.getHistory("lose").length;
      }
    },
    useCard_yes: {
      intro: "本回合使用过牌",
      filter: function(event2, player2) {
        return player2.getHistory("useCard").length > 0;
      }
    },
    useCard_no: {
      intro: "本回合没有使用过牌",
      filter: function(event2, player2) {
        return player2.getHistory("useCard").length <= 0;
      }
    },
    countCard_bigger: {
      intro: "手牌数大于X",
      filter: function(event2, player2, name) {
        return player2.countCards("h") > _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countCard_lower: {
      intro: "手牌数小于X",
      filter: function(event2, player2, name) {
        return player2.countCards("h") < _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countHp_bigger: {
      intro: "体力值大于X",
      filter: function(event2, player2, name) {
        return player2.hp > _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countHp_lower: {
      intro: "体力值小于X",
      filter: function(event2, player2, name) {
        return player2.hp < _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countloseCard_bigger: {
      intro: "本回合失去过不少于X牌",
      filter: function(event2, player2, name) {
        return player2.getHistory("lose").length > _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countloseCard_lower: {
      intro: "本回合失去过至多X张牌",
      filter: function(event2, player2, name) {
        return !player2.getHistory("lose").length < _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countUseCard_bigger: {
      intro: "本回合使用过至少X+1张牌名不同的牌",
      filter: function(event2, player2, name) {
        return Object.keys(player2.getStat().card).length > _status.weinaData[name].random.num.num(event2, player2);
      }
    },
    countUseCard_lower: {
      intro: "本回合使用过至多X+1张牌名不同的牌",
      filter: function(event2, player2, name) {
        return Object.keys(player2.getStat().card).length < _status.weinaData[name].random.num.num(event2, player2);
      }
    }
  },
  content: {
    get() {
      return {
        ...this.card,
        ...this.target.solo
      };
    },
    card: {
      views: {
        intro: "视为使用一张【$name】",
        content() {
          if (!player.hasUseTarget(event.weinaData.name)) return;
          player.chooseUseTarget({ name: event.weinaData.name, isCard: true });
        }
      },
      choose: {
        intro: "使用一张【$name】",
        content() {
          if (!player.hasUseTarget(event.weinaData.name)) return;
          player.chooseToUse(`你可以使用一张${get.translation(event.weinaData.name)}`, (card) => get.name(card) == event.weinaData.name);
        }
      }
    },
    target: {
      solo: {
        draw: {
          intro: "摸一张牌",
          content() {
            player.draw();
          }
        },
        draw_x: {
          intro: "摸X张牌",
          content() {
            player.draw(event.weinaData.num);
          }
        },
        recover: {
          intro: "回复一点体力",
          content() {
            player.recover();
          }
        },
        reset: {
          intro: "复原武将牌",
          content() {
            player.turnOver(false);
            player.link(false);
          }
        },
        gain: {
          intro: "获得一名其他角色的一张牌",
          content() {
            "step 0";
            player.chooseTarget("请选择一名其他角色", function(card, player2, target) {
              return target != player2;
            }).set("ai", (target) => get.attitude2(player) < 0);
            if (result.targets) player.gainPlayerCard("hej", result.targets[0], true).set("target", result.targets[0]).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
          }
        },
        jump: {
          intro: "跳过$phase阶段",
          content() {
            player.skip(event.weinaData.phase);
          }
        }
      }
    }
  },
  x: {
    group: {
      intro: "场上势力数",
      num() {
        return game.countGroup();
      }
    },
    damage: {
      intro: "本回合造成伤害数",
      num(event2, player2) {
        let num = player2.getStat().damage;
        return typeof num === "number" ? num : 0;
      }
    },
    type: {
      intro: "手牌中牌的类型数",
      num(event2, player2) {
        return new Set(player2.getCards("h").map((i) => get.type2(i))).size;
      }
    },
    maxHp: {
      intro: "你的体力上限",
      num(event2, player2) {
        return player2.maxHp;
      }
    }
  },
  getName() {
    let names = lib.inpile.filter((name) => get.type(name) !== "delay" && get.type(name) !== "equip");
    return names.randomGet();
  },
  getPhase() {
    return lib.phaseName.randomGet();
  },
  getInfo(obj, parentKey = "", result2 = {}, random) {
    if (!obj) obj = this;
    for (let key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null && !Array.isArray(obj[key])) {
        this.getInfo(obj[key], key, result2, random);
      }
      if (key === "intro") {
        let infoValue = obj[key];
        infoValue = infoValue.replace(/\$name/g, get.translation(random.name)).replace(/\$phase/g, get.translation(random.phase)).replace(/X/g, `X(${random.num?.intro || "default"})`);
        result2[parentKey] = infoValue;
      }
    }
    return result2;
  },
  findKey(obj, targetKey) {
    const result2 = [];
    switch (obj) {
      case "triggers":
        obj = this.trigger.get().translation;
        break;
      case "filter":
        obj = this.filter;
        break;
      case "content":
        obj = this.content.get();
        break;
    }
    function recursiveSearch(currentObj) {
      for (const key in currentObj) {
        if (currentObj.hasOwnProperty(key)) {
          if (key === targetKey) {
            result2.push({ [key]: currentObj[key] });
          }
          if (typeof currentObj[key] === "object" && currentObj[key] !== null) {
            recursiveSearch(currentObj[key]);
          }
        }
      }
    }
    recursiveSearch(obj);
    return result2;
  }
};
export {
  weinaData
};
//# sourceMappingURL=weina.js.map
