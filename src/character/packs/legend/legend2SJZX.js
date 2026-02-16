import { lib, ui, get, game, _status } from "noname";
import { skillCustomFunc } from "../../../nonameEx/custom/skill.js";
import { whichWayTips } from "../../../tips/index.js";
const tmpSave = window.whichWaySave.tmpSave;
const legend2SJZX = {
  character: {
    yindelaiximrfz: ["female", "samrfz", 4, ["pingyimrfz", "beinuomrfz"], []],
    aibulanamrfz: ["female", "weimrfz", 4, ["yizhamrfz", "kumianmrfz"], []],
    mon3trmrfz: ["female", "luomrfz", 4, ["shulimrfz", "ronghuimrfz"], []],
    spnengtianshimrfz: ["female", "lamrfz", 3, ["youhuomrfz", "letianmrfz"], []],
    leimiuanmrfz: ["female", "lamrfz", 3, ["feiyimrfz", "mingzhengmrfz", "zhuijimrfz"], []],
    xinyangjiaobanjimrfz: ["male", "lamrfz", 4, ["daoweimrfz", "chongzhoumrfz", "shiyimrfz"], []],
    jiushenmrfz: ["male", "weimrfz", "1/3", ["xinyunmrfz", "zongyinmrfz", "zhanwangmrfz"], []],
    spjingzhemrfz: ["female", "yanmrfz", 4, ["xiuyuanmrfz", "zhengningmrfz"], []],
    dianhumrfz: ["female", "luomrfz", 4, ["gandianmrfz"], []],
    ziyeyaomrfz: {
      sex: "female",
      group: "dongmrfz",
      hp: 3,
      skills: ["youlinmrfz", "miaomengmrfz", "fuyingmrfz"]
    },
    spxingxiongmrfz: {
      sex: "female",
      group: "yanmrfz",
      hp: 3,
      maxHp: 4,
      skills: ["wozhimrfz", "guishimrfz", "zhanyemrfz"]
    },
    cuoemrfz: {
      sex: "female",
      group: "dongmrfz",
      hp: 4,
      skills: ["huanyoumrfz", "wenxinmrfz"]
    },
    fengchuanxiangzimrfz: {
      sex: "female",
      group: "othermrfz",
      hp: 3,
      skills: ["songyuemrfz", "yuxiangmrfz", "wuweimrfz"],
      clans: ["AveMujica"]
    },
    yeyingmrfz: {
      sex: "female",
      hp: 3,
      group: "shimrfz",
      skills: ["guqiumrfz", "newpolongmrfz"]
    },
    tifengmrfz: {
      sex: "female",
      hp: 4,
      group: "samrfz",
      skills: ["lieqiongmrfz", "tifengmrfz_lieshimrfz"]
    }
  },
  skill: {
    //新提丰
    lieqiongmrfz: {
      audio: "ruiyamrfz",
      derivation: ["wangong", "xinliegong"],
      trigger: {
        player: "useCard"
      },
      forced: true,
      firstDo: true,
      filter(event2, player2) {
        return event2.card && get.name(event2.card) === "sha" && event2.card.cards && event2.card.cards.some((card) => ["red", "black"].includes(get.color(card) || ""));
      },
      async content(event2, trigger2, player2) {
        let color = ["red", "black"];
        trigger2.card.cards.forEach((card) => {
          let colorx = get.color(card) || "";
          if (color.includes(colorx)) {
            color.remove(colorx);
            switch (colorx) {
              case "red":
                player2.addSkill("wangong2");
                break;
              case "black":
                player2.when({
                  player: "useCardAfter",
                  global: "roundStart"
                }).filter((event3, player3) => {
                  if (event3.name === "phase") return true;
                  return event3.card.cardid === trigger2.card.cardid;
                }).step(async (event3, trigger3, player3) => {
                  if (trigger3.name === "phase") return;
                  player3.removeSkill("lieqiongmrfz_enchanting_liegong");
                });
                player2.storage.lieqiongmrfz_enchanting_liegong = trigger2.card.cardid;
                player2.addSkill("lieqiongmrfz_enchanting_liegong");
                break;
            }
          }
        });
      },
      subSkill: {
        enchanting_liegong: {
          silent: true,
          charlotte: true,
          trigger: {
            player: "useCardToTargeted"
          },
          onremove: true,
          filter(event2, player2) {
            return event2.card.cardid === player2.storage.lieqiongmrfz_enchanting_liegong;
          },
          async content(event2, trigger2, player2) {
            lib.skill.xinliegong.content(event2, trigger2, player2);
          }
        }
      }
    },
    tifengmrfz_lieshimrfz: {
      audio: "shouliemrfz",
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return player2.countCards("h") > 0 && player2.hasUseTarget({ name: "sha", nature: "stab" }, false, false);
      },
      filterTarget(card, player2, target) {
        const judge = () => player2.canUse({ name: "sha", nature: "stab" }, target, false, false) && target !== player2;
        if (judge()) whichWayTips.addPrompt(target, `摸${get.distance(player2, target)}张牌`, "tifengmrfz_lieshimrfz", "uncheckBegin");
        else whichWayTips.addPrompt(target, `不是合法目标`, "tifengmrfz_lieshimrfz", "uncheckBegin");
        return !!judge();
      },
      selectCard: () => {
        let player2 = get.player();
        return Math.max(1, Math.floor(player2.countCards("h") / 2));
      },
      filterCard: () => true,
      prompt: "你可以将一半的手牌（向下取整，至少为1）当作一张无距离和次数限制的刺【杀】对一名其他角色使用，然后你摸X张牌。（X=目标角色与你的距离）",
      discard: false,
      lose: false,
      delay: false,
      check(card) {
        let num = 8 - get.value(card);
        if (!ui.selected.cards.map((i) => get.color(i)).includes(get.color(card))) num += 2;
        return num;
      },
      async content(event2, trigger2, player2) {
        const { cards, targets } = event2;
        await player2.chooseUseTarget({ name: "sha", nature: "stab" }, cards).set("forced", true).set("filterTarget", (card, player3, target2) => target2 === get.event().targetx).set("targetx", event2.target).set("nodistance", true).set("addCount", false).forResult();
        if (!cards || !targets) return;
        let target = targets[0];
        if (get.distance(player2, target) > 0) player2.draw(get.distance(player2, target));
      },
      ai: {
        order: 3,
        result: {
          player: function(player2, target) {
            if (get.attitude2(target) > 0) return -1;
            return get.distance(player2, target) + Math.min(2, target.getDamagedHp());
          }
        }
      }
    },
    //新夜莺
    guqiumrfz: {
      mod: {
        cardnumber(card, player2, num) {
          if (card.hasGaintag("guqiumrfz_number")) return num += 3;
        }
      },
      derivation: ["shanzhuan"],
      audio: "qiulongmrfz",
      trigger: {
        global: "roundStart"
      },
      init() {
        lib.translate["guqiumrfz_number"] = `点数+3`;
      },
      forced: true,
      filter(event2, player2) {
        return game.hasPlayer((char) => char !== player2 && char.inRange(player2));
      },
      async content(event2, trigger2, player2) {
        for (let char of game.players) {
          if (char === player2 || !char.inRange(player2)) continue;
          let next = game.createEvent("guqiumrfz_shanzhuan");
          next.player = char;
          next._trigger = {
            player: player2
          };
          await next.setContent(lib.skill.shanzhuan.content);
        }
        player2.drawTo(5).set("gaintag", ["guqiumrfz_number"]);
      },
      group: "guqiumrfz_compare",
      subSkill: {
        compare: {
          silent: true,
          charlotte: true,
          trigger: {
            player: "compare",
            target: "compare"
          },
          filter(event2, player2) {
            if (event2.iwhile && event2.player === player2) {
              return false;
            }
            return (
              //@ts-ignore
              player2.getHistory("lose", (evt) => {
                let cardid = event2[event2.player === player2 ? "card1" : "card2"].cardid;
                if (evt.gaintag_map && Object.keys(evt.gaintag_map).includes(cardid) && evt.gaintag_map[cardid].includes("guqiumrfz_number")) return true;
              }).length > 0
            );
          },
          async content(event2, trigger2, player2) {
            game.log(player2, `的拼点牌点数+3`);
            trigger2[trigger2.player === player2 ? "num1" : "num2"] += 3;
          }
        }
      },
      ai: {
        combo: "newpolongmrfz"
      }
    },
    newpolongmrfz: {
      mod: {
        cardUsable: function(card, player2, num) {
          if (typeof num === "number" && card?.cards?.some((cardx) => cardx.hasGaintag("newpolongmrfz"))) return Infinity;
        },
        targetInRange: function(card, player2, target, now) {
          if (card?.cards?.some((cardx) => cardx.hasGaintag("newpolongmrfz"))) return true;
        }
      },
      audio: "polongmrfz",
      trigger: { player: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return game.countPlayer((char) => char.countCards("h") > 0) > 1;
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("newpolongmrfz")).set("prompt2", `你可以令一名角色A与角色B(角色B不能为你)拼点，若角色A赢，你将判定区的牌翻面，然后摸2X张牌，且你因此获得的牌本回合无距离次数限制。（X=你因此翻面的牌数）`).set("targetprompt", ["角色A", "角色B"]).set("filterTarget", (card, player3, target) => {
          if (target.countCards("h") < 1) return false;
          let targets = ui.selected.targets;
          return targets.length < 1 || targets[0].canCompare(target) && target !== player3;
        }).set("ai", (target) => {
          let targets = ui.selected.targets;
          let player3 = get.player();
          if (player3.countCards("j", (card) => get.type(card) === "delay") < 1) {
            return get.attitude2(target) < 0;
          } else if (targets.length < 1) {
            if (player3.countCards("h", (card) => get.number(card) > 7) > 0) return target === player3 ? 114514 : -1;
            return get.attitude2(target) < 0 || get.attitude2(target) > 0 && target.countCards("h") > 3;
          } else {
            return get.attitude2(target) < 0;
          }
        }).set("complexTarget", true).set("selectTarget", 2).forResult();
      },
      async content(event2, trigger2, player2) {
        const [targetA, targetB] = event2.targets;
        const result2 = await targetA.chooseToCompare(targetB).forResult();
        if (result2.winner === targetA) {
          const cards = player2.getCards("j").filter((card) => get.type(card) === "delay");
          game.cardsGotoOrdering(cards);
          const links = cards.map((card) => {
            return card.viewAs ? card.cards : get.autoViewAs(card);
          }).flat();
          console.log(links);
          links.forEach((card) => {
            if (get.type(card, null, false) !== "delay") {
              card.fix();
              player2.addJudge({ name: "xumou_jsrg" }, [card]);
            } else {
              player2.addJudge({ name: "xumou_jsrg" }, card.cards);
            }
          });
          player2.draw(links.length * 2).set("gaintag", ["newpolongmrfz"]);
        }
      },
      group: "newpolongmrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeGaintag("newpolongmrfz", player2.getCards("h"));
          }
        }
      }
    },
    //丰川祥子
    songyuemrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      frequent: true,
      async content(event2, trigger2, player2) {
        for (let t of [1, 2, 3]) {
          const { color } = await player2.judge().forResult();
          if (player2.countCards("h") < 1) continue;
          const { cards } = await player2.chooseCard("h", true).set("prompt", `你可以重铸一张手牌，若重铸的牌与判定牌颜色(${get.translation(color)})一致，你摸${lib.skill.wuweimrfz.getNum(player2, event2.name)}张牌。`).set("ai", (card2) => {
            let { player: player3, color: color2, num } = get.event();
            return (get.color(card2) === color2 ? 8 : 6) - get.value(card2);
          }).set("color", color).set("num", lib.skill.wuweimrfz.getNum(player2, event2.name)).forResult();
          if (!cards) return;
          let card = cards[0];
          player2.recast(card);
          if (!card || lib.skill.wuweimrfz.getNum(player2, event2.name) < 1) continue;
          if (get.color(card) === color) player2.draw(lib.skill.wuweimrfz.getNum(player2, event2.name));
        }
      }
    },
    yuxiangmrfz: {
      audio: 2,
      trigger: {
        global: "phaseEnd"
      },
      filter(event2, player2) {
        let centralArea = get.discarded();
        return centralArea.filter((card) => {
          return game.getGlobalHistory("changeHp", (evt) => {
            let evtx = evt.getParent();
            if (evtx.name === "damage" && evtx.num > 0) return evtx.cards?.includes(card);
          }).length > 0;
        }).length > 0;
      },
      async cost(event2, trigger2, player2) {
        let centralArea = get.discarded().filter((card) => {
          return game.getGlobalHistory("changeHp", (evt) => {
            let evtx = evt.getParent();
            if (evtx.name === "damage" && evtx.num > 0) return evtx.cards?.includes(card);
          }).length > 0;
        });
        const result2 = await player2.chooseButton().set("createDialog", [get.prompt(event2.skill) + `选择你要${get.poptip("sjzx_byRecast")}使用的牌`, centralArea]).set("ai", (button) => {
          let player3 = get.player();
          return player3.getUseValue(button);
        }).set("filterButton", (button) => {
          let player3 = get.player();
          return player3.hasUseTarget(button);
        }).forResult();
        event2.result = {
          ...result2,
          cost_data: {
            cards: result2?.links
          }
        };
      },
      async content(event2, trigger2, player2) {
        let [card] = event2.cost_data.cards;
        player2.recast(card);
        player2.chooseUseTarget(card, true);
      }
    },
    wuweimrfz: {
      audioname: ["ruoyemumrfz", "youtiansiruomaimrfz", "sanjiaochuhuamrfz", "bafanhailingmrfz"],
      audio: 2,
      init(player2, skill) {
        player2.storage[skill] = {};
        game.broadcastAll((skills) => {
          skills.forEach((skill2) => {
            let info = get.skillInfoTranslation(skill2);
            lib.dynamicTranslate[skill2] = function(player3) {
              if (!player3.storage.wuweimrfz || lib.skill.wuweimrfz.getNum(player3, skill2) < 1) return info;
              return info + `（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`;
            };
          });
          lib.dynamicTranslate["wuweimrfz"] = function(player3) {
            let info = get.skillInfoTranslation("wuweimrfz");
            if (!player3.storage.wuweimrfz) return info;
            for (let skill2 of skills) {
              if (lib.skill.wuweimrfz.getNum(player3, skill2) > 0) return info.replace(`（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）`, "");
            }
            return info;
          };
        }, lib.skill.wuweimrfz.validSkills);
      },
      clanSkill: true,
      getNum(receiver, skill) {
        for (let player2 of game.players) {
          let storage = player2.storage.wuweimrfz;
          if (!storage) continue;
          for (let id in storage) {
            let info = storage[id];
            if (info.receiver.playerid !== receiver.playerid) continue;
            if (info.skill === skill) {
              let num = 0;
              if (receiver.getRoundHistory("lose", (evt) => evt.getParent(2).name === "recast").length > 0) num++;
              if (receiver.getRoundHistory("useCard").length > 0) num++;
              if (receiver.getRoundHistory("respond").length > 0) num++;
              if (receiver.getRoundHistory("lose", (evt) => evt.type === "discard").length > 0) num++;
              return num;
            }
          }
        }
        return 0;
      },
      trigger: {
        player: "recastAfter"
      },
      validSkills: ["songyuemrfz", "yuxiangmrfz", "lingwomrfz", "pojianmrfz", "leigumrfz", "jiaoyingmrfz", "weimianmrfz", "weiquanmrfz", "chendiemrfz", "umiri_chenxianmrfz"],
      filter(event2, player2) {
        return Object.keys(player2.storage.wuweimrfz).length < 1;
      },
      async cost(event2, trigger2, player2) {
        const { targets } = await player2.chooseTarget().set("prompt2", `你可以将本技能句号之后的描述移至同族武将的武将牌上任意一个技能直到本轮结束`).set("prompt", `【毋畏】:请选择一名${get.poptip("sjzx_AveMujica")}角色`).set("filterTarget", (card, player3, target2) => {
          let flag = false;
          let skills2 = target2.getOriginalSkills().filter((skill) => lib.skill.wuweimrfz.validSkills.includes(skill));
          for (let skill of skills2) {
            if (lib.skill.wuweimrfz.getNum(target2, skill) < 1) {
              flag = true;
              break;
            }
          }
          return flag && target2.getClans(true).includes("AveMujica");
        }).set("ai", (target2) => get.attitude2(target2) > 0).forResult();
        if (!targets) return;
        let target = targets[0];
        if (!target) {
          event2.result = {
            bool: false
          };
          return;
        }
        let skills = target.getOriginalSkills().filter((skill) => lib.skill.wuweimrfz.validSkills.includes(skill));
        if (skills.length < 1) {
          event2.result = {
            bool: false
          };
          return;
        }
        const result2 = await player2.chooseControl(skills.concat("cancel2")).set("prompt", `为一个技能添加下列描述直到本轮结束：“（X=你本轮触发过的${get.poptip("sjzx_cardUseType")}数）”`).set("ai", () => {
          return get.event().skills.randomGet();
        }).set("skills", skills).forResult();
        event2.result = {
          ...result2,
          cost_data: result2
        };
      },
      async content(event2, trigger2, player2) {
        let skill = event2.cost_data.control;
        if (!player2.storage.wuweimrfz) player2.storage.wuweimrfz = {};
        if (player2.playerid) {
          player2.storage.wuweimrfz[player2.playerid] = {
            skill,
            receiver: player2
          };
          player2.when({ global: "roundStart" }).then(() => {
            if (player2.playerid) delete player2.storage.wuweimrfz[player2.playerid];
          });
        }
      }
    },
    //新嵯峨
    //默认技能组
    huanyoumrfz: {
      audio: "chuemrfz",
      forced: true,
      trigger: {
        player: "gainAfter"
      },
      filter(event2, player2) {
        return !player2.isPhaseUsing() && event2.cards.length > 0 && event2.getParent().name !== "huanyoumrfz";
      },
      async content(event2, trigger2, player2) {
        player2.gain(lib.card.ying.getYing(trigger2.cards.length), "gain2");
      },
      group: ["huanyoumrfz_hideHandCards"],
      subSkill: {
        hideHandCards: {
          audio: "huanyoumrfz",
          forced: true,
          trigger: { player: "phaseUseBegin" },
          async content(event2, trigger2, player2) {
            let handcard = player2.node.handcards1.parentElement;
            player2.node.washTip = ui.create.div(handcard, ".washTip");
            player2.node.washTip.innerHTML = "洗牌中...";
            let hs = [];
            let origin = player2.getCards("h");
            for (let i = 0; i < player2.getCards("h").length; i++) {
              let r = origin.randomGet();
              hs.push(r);
              origin.remove(r);
            }
            game.broadcastAll(
              function(hs2, player3) {
                hs2.forEach((i) => i.goto(ui.special));
                player3.directgain(hs2, false);
              },
              hs,
              //@ts-ignore
              player2
            );
            player2.addTempSkill("huanyoumrfz_hideHandCards_eff", { player: "phaseEnd" });
          }
        },
        hideHandCards_eff: {
          mod: {
            cardname(card, player2, name) {
              if (card.storage.huanyoumrfz) {
                return "cuoe_huanyoumrfzCard";
              }
            }
          },
          charlotte: true,
          silent: true,
          init(player2) {
            if (!player2.node.handcards1.cardMod) {
              player2.node.handcards1.cardMod = {};
            }
            if (!player2.node.handcards2.cardMod) {
              player2.node.handcards2.cardMod = {};
            }
            var cardMod = function(card) {
              return ["幻有", "手牌对你不可见"];
            };
            player2.node.handcards1.cardMod.huanyoumrfz = cardMod;
            player2.node.handcards2.cardMod.huanyoumrfz = cardMod;
            player2.node.handcards1.classList.add("huanyoumrfz");
            player2.node.handcards2.classList.add("huanyoumrfz");
            player2.getCards("h").forEach((i) => {
              i.storage.huanyoumrfz = true;
              i.dataset.skilltag = "huanyoumrfz";
            });
            setTimeout(() => {
              player2.node.washTip.remove();
              delete player2.node.washTip;
            }, 1e3);
          },
          onremove(player2) {
            player2.node.handcards1.classList.remove("huanyoumrfz");
            player2.node.handcards2.classList.remove("huanyoumrfz");
            delete player2.node.handcards1.cardMod.huanyoumrfz;
            delete player2.node.handcards2.cardMod.huanyoumrfz;
            player2.getCards("h").forEach((i) => {
              if (i.storage.huanyoumrfz) {
                delete i.storage.huanyoumrfz;
                delete i.dataset.skilltag;
              }
            });
          },
          trigger: {
            player: "useCardAfter"
          },
          filter(event2, player2) {
            return event2.card.storage?.huanyoumrfz && event2.cards.length === 1 && !event2.card.failToUse && !event2.getParent().noTriggerHuanyoumrfz;
          },
          async content(event2, trigger2, player2) {
            trigger2.cards.forEach((card) => {
              if (card.storage.huanyoumrfz) player2.draw();
            });
          }
        }
      },
      ai: {
        neg: true
      }
    },
    wenxinmrfz: {
      audio: 3,
      derivation: "zhishuimrfz",
      group: ["wenxinmrfz_achieve", "wenxinmrfz_turnOver", "wenxinmrfz_fail"],
      subSkill: {
        achieve: {
          audio: true,
          logAudio() {
            return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 1);
          },
          forced: true,
          skillAnimation: true,
          animationColor: "metal",
          lastDo: true,
          trigger: {
            player: "phaseEnd"
          },
          filter(event2, player2) {
            let useList = player2.getHistory("useCard", (evt) => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz).map((evt) => {
              return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
            });
            let count = 0;
            for (let name of useList) {
              if (name === "ying") {
                count = 0;
                continue;
              }
              count++;
              if (count >= 3) return true;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            game.log(player2, "成功完成使命");
            player2.awakenSkill("wenxinmrfz");
            player2.addSkills(["zhishuimrfz"]);
            player2.loseMaxHp();
          }
        },
        turnOver: {
          audio: true,
          logAudio() {
            return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 3);
          },
          trigger: {
            player: "useCardAfter"
          },
          lastDo: true,
          filter(event2, player2) {
            return player2.countCards("h", (card) => card.storage.huanyoumrfz) > 0 && event2.card.storage?.huanyoumrfz && event2.cards.length === 1 && !event2.getParent().noTriggerHuanyoumrfz;
          },
          async cost(event2, trigger2, player2) {
            event2.result = await player2.chooseCard("h").set("prompt", get.prompt("wenxinmrfz")).set("prompt2", `你可以令一张背面朝上的手牌正面朝上`).set("filterCard", (card) => card.storage.huanyoumrfz).set("ai", () => Math.random()).forResult();
          },
          async content(event2, trigger2, player2) {
            let card = event2.cards[0];
            delete card.storage.huanyoumrfz;
            delete card.dataset.skilltag;
          }
        },
        fail: {
          audio: true,
          logAudio() {
            return skillCustomFunc.getSkillAudioPath("wenxinmrfz", 2);
          },
          forced: true,
          trigger: {
            player: "phaseEnd"
          },
          firstDo: true,
          filter(event2, player2) {
            let useList = player2.getHistory("useCard", (evt) => evt.card.name === "cuoe_huanyoumrfzCard" || !evt.card.storage.huanyoumrfz).map((evt) => {
              return evt.card.name === "cuoe_huanyoumrfzCard" ? get.name(evt.card.cards[0]) : evt.card.name;
            });
            return (useList.length === 0 || useList[0] === "ying" && new Set(useList).size === 1) && !player2.getHistory("skipped").includes("phaseUse");
          },
          async content(event2, trigger2, player2) {
            game.log(player2, "使命失败");
            player2.awakenSkill("wenxinmrfz");
            player2.addSkill(["wenxinmrfz_fail_buff"]);
            player2.markSkill("wenxinmrfz_fail_buff");
          }
        },
        fail_buff: {
          charlotte: true,
          silent: true,
          trigger: {
            player: "phaseDrawBegin"
          },
          intro: {
            content: "·每个摸牌阶段开始时获得一张【影】<br>·如真似幻，扑朔迷离。"
          },
          async content(event2, trigger2, player2) {
            player2.gain(lib.card.ying.getYing(1), "gain2");
          }
        }
      }
    },
    zhishuimrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "useCardBegin"
      },
      filter(event2, player2) {
        return event2.card.storage?.huanyoumrfz && !event2.card.storage?.zhishuimrfz && event2.card.cards.length === 1 && !player2.hasUseTarget(event2.card.cards[0].name);
      },
      async content(event2, trigger2, player2) {
        await player2.useCard(
          {
            name: "dongzhuxianji",
            suit: trigger2.card.suit,
            number: trigger2.card.number,
            nature: trigger2.card.nature,
            storage: {
              ...trigger2.card.storage,
              zhishuimrfz: true
            },
            isCard: true
          },
          trigger2.cards,
          player2
        );
        trigger2.cancel();
      }
    },
    //模组：何处寻驼？
    qianxianmrfz: {
      audio: "chuemrfz",
      trigger: {
        player: "useCardToPlayered",
        target: "useCardToTargeted"
      },
      forced: true,
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      filter(event2, player2) {
        if (!["trick", "basic"].includes(get.type(event2.card))) return false;
        return player2 === event2.target || event2.getParent().triggeredTargets3.length === 1;
      },
      mark: true,
      intro: {
        content(storage) {
          return `记录的牌名：${get.translation(storage)}`;
        }
      },
      onremove: true,
      async content(event2, trigger2, player2) {
        if (player2.storage.qianxianmrfz.includes(trigger2.card.name)) {
          player2.storage.qianxianmrfz.remove(trigger2.card.name);
          player2.draw();
        } else {
          player2.storage.qianxianmrfz.push(trigger2.card.name);
          trigger2.getParent()?.excluded.add(...trigger2.targets);
          trigger2.player.draw(2);
        }
      },
      ai: {
        threaten: 2
      }
    },
    ziwumrfz: {
      audio: "wenxinmrfz",
      derivation: "dunkongmrfz",
      forced: true,
      juexingji: true,
      skillAnimation: true,
      animationColor: "thunder",
      unique: true,
      trigger: { player: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return player2.storage.qianxianmrfz?.length >= 5;
      },
      async content(event2, trigger2, player2) {
        player2.awakenSkill(event2.name);
        player2.recoverTo(3);
        await player2.draw(player2.storage.qianxianmrfz.length);
        player2.storage.qianxianmrfz = [];
        player2.addSkill("dunkongmrfz");
      },
      ai: {
        combo: "qianxianmrfz"
      }
    },
    dunkongmrfz: {
      audio: "zhishuimrfz",
      enable: "phaseUse",
      usable: 1,
      onremove(player2, skill) {
        player2.enableSkill(skill);
      },
      intro: {
        content(_, player2) {
          let num = Math.min(5, player2.storage.qianxianmrfz.length);
          return `·使用【杀】的次数+${num}<br>·手牌上限+${num}<br>·计算与其他角色的距离-${num}`;
        }
      },
      async content(event2, trigger2, player2) {
        let numx = Math.min(5, player2.storage.qianxianmrfz.length);
        player2.draw(numx);
        player2.disableSkill("dunkongmrfz", "qianxianmrfz");
        player2.markSkill("dunkongmrfz");
        player2.when("phaseEnd").then(() => {
          player2.enableSkill("dunkongmrfz");
          player2.unmarkSkill("dunkongmrfz");
          if (player2.storage.qianxianmrfz?.length > 0) {
            player2.storage.qianxianmrfz.remove(player2.storage.qianxianmrfz.randomGet());
          }
        }).assign({
          mod: {
            maxHandcard(player3, num) {
              return num + numx;
            },
            cardUsable(card, player3, num) {
              if (card.name === "sha") return num + numx;
            },
            globalFrom(from, to, distance) {
              return distance - numx;
            }
          }
        });
      },
      ai: {
        order: 13,
        result: {
          player(player2) {
            return player2.storage.qianxianmrfz.length > 1;
          }
        }
      }
    },
    //斩业星熊
    /** @type { Skill } */
    wozhimrfz: {
      audio: 2,
      trigger: {
        player: ["changeHp"]
      },
      forced: true,
      locked: true,
      mod: {
        maxHandcardBase(player2, num) {
          return player2.storage.zhanyemrfz ? player2.maxHp : num;
        }
      },
      init(player2) {
        player2._hp = player2.hp;
        player2._maxHp = player2.maxHp;
        let isUpdateHp = false;
        let isUpdateMaxHp = false;
        skillCustomFunc.defineAccessor(
          player2,
          ["hp", "maxHp"],
          //@ts-ignore
          [() => player2._hp, () => player2._maxHp],
          [
            (value) => {
              player2._hp = value;
              if (!isUpdateHp) {
                isUpdateHp = true;
                lib.skill.wozhimrfz.updateHp(player2);
                isUpdateHp = false;
              }
            },
            (value) => {
              player2._maxHp = value;
              if (!isUpdateMaxHp) {
                isUpdateMaxHp = true;
                lib.skill.wozhimrfz.updateHp(player2);
                isUpdateMaxHp = false;
              }
            }
          ]
        );
      },
      intro: {
        content(storage, player2) {
          let str = [];
          if (player2.storage.zhanyemrfz) str.push("我执已修改");
          if (typeof storage !== "number" || storage === 0) str.push("体力值目前十分健康！");
          else str.push(`额外体力：${player2.maxHp - storage}/${player2.maxHp}`);
          return str.map((s) => "·" + s).join("<br>");
        }
      },
      onremove(player2, skill) {
        if (player2.hp <= 0 && player2.countMark("wozhimrfz") > 0) {
          player2.die({});
          delete player2.storage[skill];
        }
        lib.skill.wozhimrfz.updateHp(player2);
      },
      updateHp(player2) {
        let num = player2.countMark("wozhimrfz");
        const hp = player2.querySelector(".hp");
        let clone = player2.querySelector(".hpClone") || tmpSave.spxingxiong_clone;
        const cloneMaxhp = clone?.children?.length;
        if (cloneMaxhp !== player2.maxHp && clone) {
          clone.remove();
          delete tmpSave.spxingxiong_clone;
          lib.skill.wozhimrfz.updateHp(player2);
          return;
        }
        if (player2.hp <= 0) {
          if (!clone) {
            const parent = hp.parentNode;
            const hpClone = ui.create.div(".hp hpClone", parent);
            hpClone.style.zIndex = "114514";
            hpClone.dataset.condition = "low";
            for (let i = 0; i < player2.maxHp; i++) {
              ui.create.div(hpClone);
            }
            clone = hpClone;
            tmpSave.spxingxiong_clone = clone;
          }
          hp.style.display = "none";
          let hps = Array.from(clone.childNodes);
          if (!hps) return;
          for (let i = 0; i < hps.length; i++) {
            if (i < num) hps[i].classList.remove("lost");
            else hps[i].classList.add("lost");
          }
        } else {
          hp.style.display = "";
          if (clone !== void 0) {
            clone.remove();
            delete tmpSave.spxingxiong_clone;
          }
          player2.update();
        }
      },
      filter(event2, player2) {
        return player2.hp <= 0 && event2.num < 0;
      },
      async content(event2, trigger2, player2) {
        const evt = trigger2;
        const num = -evt.num - Math.max(player2.hp - evt.num, 1) + 1;
        if (num > 0) player2.addMark("wozhimrfz", num);
        if (player2.countMark("wozhimrfz") < player2.maxHp) {
          let evt2 = evt.getParent();
          let max = 3;
          while (max--) {
            if (evt2.name === "damage" || evt2.name === "loseHp") {
              evt2.nodying = true;
              break;
            }
          }
        }
        lib.skill.wozhimrfz.updateHp(player2);
      },
      group: ["wozhimrfz_recover", "wozhimrfz_change"],
      subSkill: {
        change: {
          audio: "wozhimrfz",
          trigger: {
            player: "phaseAfter"
          },
          forced: true,
          filter(event2, player2) {
            return player2.hp < 1 && player2.storage.zhanyemrfz;
          },
          async content(event2, trigger2, player2) {
            player2.recover();
          }
        },
        recover: {
          trigger: {
            player: "recoverAfter"
          },
          filter(event2, player2) {
            return player2.countMark("wozhimrfz") > 0 && event2.num > 0;
          },
          forced: true,
          popup: false,
          async content(event2, trigger2, player2) {
            await player2.removeMark("wozhimrfz", trigger2.num);
            if (player2.countMark("wozhimrfz") < player2.maxHp) {
              if (player2.isDying()) {
                const histories = [event2];
                let evt = event2;
                while (true) {
                  evt = event2.getParent("dying");
                  if (!evt || evt.name !== "dying" || histories.includes(evt)) {
                    break;
                  }
                  histories.push(evt);
                  if (evt.player === player2) {
                    evt.nodying = true;
                  }
                }
              }
            }
            lib.skill.wozhimrfz.updateHp(player2);
          }
        }
      },
      ai: {
        mingzhi: true,
        effect: {
          target(card, player2, target) {
            if (get.tag(card, "damage") || get.tag(card, "losehp")) {
              let num = target.countMark("wozhimrfz") || target.getHp();
              return (num + 1) / 3;
            }
          }
        }
      }
    },
    guishimrfz: {
      audio: 2,
      locked(skill, player2) {
        if (!player2 || !player2.storage.zhanyemrfz) {
          return true;
        }
        return false;
      },
      trigger: {
        player: "phaseUseBegin"
      },
      async cost(event2, trigger2, player2) {
        if (!player2.storage.zhanyemrfz) {
          event2.result = {
            bool: true
          };
          return;
        }
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("guishimrfz")).set("prompt2", `你可以失去一点体力，然后令一名角色摸${get.cnNumber(Math.min(player2.getDamagedHp(), 5))}张牌，若该角色不为你，你可以在结束阶段再次发动【鬼势】`).set("ai", (target) => {
          let player3 = get.player();
          let num = Math.max(player3.hp, 0);
          if (player3.hasSkill("wozhimrfz")) {
            num += player3.maxHp - player3.countMark("wozhimrfz");
          }
          return get.attitude2(target) > 0 && num >= 2;
        }).set("animate", false).forResult();
      },
      async content(event2, trigger2, player2) {
        if (!player2.storage.zhanyemrfz) {
          await player2.loseHp();
          player2.draw(player2.getDamagedHp());
        } else {
          let target = event2.targets[0];
          await player2.loseHp();
          target.draw(Math.min(5, player2.getDamagedHp()));
          if (player2 !== target) {
            player2.line(target);
            player2.when({
              player: ["phaseJieshuBegin", "phaseEnd"]
            }).step(async (event3, trigger3, player3) => {
              if (trigger3.name === "phase") return;
              const { targets } = await player3.chooseTarget().set("prompt", get.prompt("guishimrfz")).set("prompt2", `你可以失去一点体力，然后令一名角色摸${get.cnNumber(Math.min(4, player3.getDamagedHp()))}张牌`).set("ai", (target2) => {
                let player4 = get.player();
                let num = Math.max(player4.hp, 0);
                if (player4.hasSkill("wozhimrfz")) {
                  num += player4.maxHp - player4.countMark("wozhimrfz");
                }
                return get.attitude2(target2) > 0 && num >= 2;
              }).set("animate", false).forResult();
              if (!targets) return;
              await player3.loseHp();
              targets[0].draw(Math.min(4, player3.getDamagedHp()));
              player3.line(targets[0]);
            });
          }
        }
      }
    },
    zhanyemrfz: {
      audio: 4,
      derivation: ["wozhimrfz_rewrite", "guishimrfz_rewrite"],
      dutySkill: true,
      group: ["zhanyemrfz_revenge", "zhanyemrfz_achieve", "zhanyemrfz_fail"],
      subSkill: {
        revenge: {
          audio: true,
          logAudio() {
            let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
            path = path.replace(path.slice(-2), "");
            return [1, 2].map((i) => path + `/zhanyemrfz${i}.mp3`);
          },
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          onremove: true,
          mod: {
            targetInRange(card, player2, target) {
              if (player2.getStorage("zhanyemrfz_revenge").includes(target)) {
                return true;
              }
            },
            cardUsableTarget(card, player2, target) {
              if (player2.getStorage("zhanyemrfz_revenge").includes(target)) {
                return true;
              }
            }
          },
          intro: {
            mark(dialog, content, player2) {
              let targets = player2.storage.zhanyemrfz_revenge;
              if (targets) {
                targets.forEach((target) => {
                  dialog.addSmall([target]);
                  dialog.addText(`<font color="red">向${get.translation(target)}复仇！</font>`);
                });
              } else {
                dialog.addText("无“业”角色");
              }
            }
          },
          locked: true,
          filter(event2, player2) {
            return game.hasPlayer((current) => current !== player2) && (event2.name !== "phase" || game.phaseNumber === 0);
          },
          async cost(event2, trigger2, player2) {
            event2.result = await player2.chooseTarget().set("filterTarget", lib.filter.notMe).set("prompt", "游戏开始时，你令一名其他角色获得“业”标记，你对有“业”标记的角色使用牌无次数和距离限制。").set("forced", true).set("ai", function(target) {
              let att = get.attitude(_status.event.player, target);
              if (att > 0) {
                return -att - 1;
              }
              if (att === 0) {
                return Math.random();
              }
              return -att;
            }).set("animate", false).forResult();
          },
          async content(event2, trigger2, player2) {
            let targets = event2.targets;
            if (!player2.storage.zhanyemrfz_revenge) player2.storage.zhanyemrfz_revenge = [];
            player2.storage.zhanyemrfz_revenge.add(...targets);
            player2.line(targets);
            player2.markSkill("zhanyemrfz_revenge");
          }
        },
        fail: {
          audio: true,
          logAudio() {
            let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
            path = path.replace(path.slice(-2), "");
            return path + `/zhanyemrfz3.mp3`;
          },
          forced: true,
          trigger: {
            global: "dieAfter"
          },
          async content(event2, trigger2, player2) {
            game.log(player2, "使命失败");
            player2.awakenSkill("zhanyemrfz");
            player2.unmarkSkill("zhanyemrfz_revenge");
            let copy = game.players.filter((c) => c !== player2);
            for (let i = 0; i < 5; i++) {
              let targets = game.filterPlayer((c) => isMinHp(c, copy) && c !== player2);
              await player2.chooseUseTarget({ name: "sha", isCard: true }).set("filterTarget", (card, player3, target) => {
                return targets.includes(target);
              }).set("forced", true).set("nodistance", true).set("addCount", false);
            }
            player2.loseMaxHp(2);
            function isMinHp(player3, players, only, raw) {
              return players.every((value) => {
                if (value.isOut() || value == player3) {
                  return true;
                }
                return value.getHp(raw) >= player3.getHp(raw);
              });
            }
          }
        },
        achieve: {
          audio: true,
          logAudio() {
            let path = lib.skill.zhanyemrfz.logAudio ? lib.skill.zhanyemrfz.logAudio() : lib.skill.zhanyemrfz.audio;
            path = path.replace(path.slice(-2), "");
            return path + `/zhanyemrfz4.mp3`;
          },
          forced: true,
          skillAnimation: true,
          animationColor: "metal",
          trigger: {
            source: "damageEnd"
          },
          filter(event2, player2) {
            return player2.getStorage("zhanyemrfz_revenge").includes(event2.player) && event2.player.isAlive() && event2.player.hp === 1;
          },
          async content(event2, trigger2, player2) {
            game.log(player2, "成功完成使命");
            player2.awakenSkill("zhanyemrfz");
            player2.unmarkSkill("zhanyemrfz_revenge");
            player2.storage.zhanyemrfz = true;
          }
        }
      }
    },
    //遥 羽生萌萌香 紫野遥
    youlinmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable(skill, player2) {
        return player2.hasSkill("youlinmrfz_addCount") ? 2 : 1;
      },
      filterCard: true,
      selectCard: [0, 3],
      filterTarget: true,
      selectTarget: [1, 3],
      discard: false,
      lose: false,
      delay: 0,
      multitarget: true,
      multiline: true,
      check(card) {
        if (ui.selected.cards.length < 1) return true;
        let num = 0;
        for (let i of ["type2", "number", "suit"]) {
          if (!isInclude(i)) {
            num++;
          }
        }
        return num;
        function isInclude(method) {
          return ui.selected.cards.map((cardx) => get[method](cardx)).includes(get[method](card));
        }
      },
      async content(event2, trigger2, player2) {
        let { cards, targets } = event2, pileCards = [], showCards = [];
        let duplicateRemove = (arr, method) => Array.from(new Set(arr.map((card) => get[method](card))));
        if (cards.length < 3) pileCards.push(...get.cards(3 - cards.length));
        showCards = [...cards, ...pileCards];
        let execute = [];
        if (duplicateRemove(showCards, "number").length === 3) execute.push("number");
        if (duplicateRemove(showCards, "suit").length === 3) execute.push("suit");
        if (duplicateRemove(showCards, "type2").length === 3) execute.push("type");
        let num = execute.length;
        let tips = {
          number: "<font color='red'>点数均不同</font>",
          suit: "<font color='yellow'>花色均不同</font>",
          type: "<font color='green'>类型均不同</font>"
        };
        let str = [];
        for (let i of execute) {
          str.push(tips[i]);
        }
        await player2.showCards(showCards, `${get.translation(player2)}【游鳞】展示的牌<br>${str.join("<br>")}`);
        game.delay(2);
        if (num > 0) {
          for (let name of execute) {
            switch (name) {
              case "number":
                targets.forEach((t) => t.changeHujia());
                break;
              case "suit":
                targets.forEach((t) => t.draw(num));
                break;
              case "type":
                player2.addTempSkill("youlinmrfz_addCount", { player: ["phaseUseEnd", "phaseEnd"] });
                break;
            }
          }
        }
        if (num - cards.length > 0) targets.forEach((t) => t.addMark("fuyingmrfz", num - cards.length));
      },
      ai: {
        order: 13,
        result: {
          player: 1,
          target: 1
        }
      },
      subSkill: {
        addCount: {
          charlotte: true,
          silent: true
        }
      }
    },
    miaomengmrfz: {
      audio: 2,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      prompt(event2, player2) {
        let num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
        return `【渺梦】:你可以观看牌堆顶${num}张牌，并可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中，然后你获得等同与你插入的牌的数量的个“沫”标记。`;
      },
      async content(event2, trigger2, player2) {
        const num = Math.min(5, Math.max(game.countMark("fuyingmrfz"), 1));
        let suits = [...lib.suit], types = ["basic", "trick", "equip"];
        let outCards = [];
        let pileCards = get.cards(num);
        for (let type of types) {
          let name = lib.inpile.filter((n) => get.type2(n) === type).randomGet();
          let suit = suits.randomGet();
          suits.remove(suit);
          outCards.push(game.createCard(name, suit, [1, 3, 5, 8, 12].randomGet()));
        }
        let { moved } = await player2.chooseToMove().set("list", [
          ["牌堆顶", pileCards],
          ["游戏外的牌", outCards]
        ]).set("prompt", `你可以将游戏外随机的三张不同花色、类型的牌（进入弃牌堆后销毁之）插入到这些牌之中`).set("filterMove", (from, to, moved2) => {
          let pile = get.event().pileCards;
          let fakeMoved = [moved2[0].slice(), moved2[1].slice()];
          if (typeof to !== "number") {
            let fromPos = findElementPosition(fakeMoved, from.link);
            let toPos = findElementPosition(fakeMoved, to.link);
            if (fromPos && toPos) {
              [fakeMoved[fromPos.arrayIndex][fromPos.elementIndex], fakeMoved[toPos.arrayIndex][toPos.elementIndex]] = [fakeMoved[toPos.arrayIndex][toPos.elementIndex], fakeMoved[fromPos.arrayIndex][fromPos.elementIndex]];
            }
          } else {
            if (fakeMoved[0].includes(from.link)) fakeMoved[0].remove(from.link);
            if (fakeMoved[1].includes(from.link)) fakeMoved[1].remove(from.link);
            fakeMoved[to].push(from.link);
          }
          let adjusted = fakeMoved[0].filter((card) => pile.includes(card));
          return JSON.stringify(pile) === JSON.stringify(adjusted);
          function findElementPosition(arrays, element) {
            for (let i = 0; i < arrays.length; i++) {
              let index = arrays[i].indexOf(element);
              if (index !== -1) {
                return { arrayIndex: i, elementIndex: index };
              }
            }
            return null;
          }
        }).set("filterOk", () => {
          let outs = get.event().outCards;
          let buttons = Array.from(get.event().buttonss[0].children).concat(Array.from(get.event().buttonss[1].children));
          buttons.forEach((button) => {
            let link = button.link;
            if (!outs.includes(link)) {
              let tag = button.querySelector(".info");
              if (tag) tag.innerHTML = "不可改变顺序";
            }
          });
          return true;
        }).set("processAI", (list) => {
          get.event().player;
          let pile = [...list[0][1]];
          let outs = [...list[1][1]];
          for (let card of outs) {
            let insertIndex = pile.findIndex((cardx) => get.value(cardx) < get.value(card));
            if (insertIndex === -1) {
              pile.push(card);
            } else {
              pile.insert(insertIndex, card, false);
            }
          }
          let moved2 = [pile, outs];
          return moved2;
        }).set("outCards", outCards).set("pileCards", pileCards).forResult();
        if (!moved) return;
        let top = moved[0];
        let count = top.length - pileCards.length;
        player2.addMark("fuyingmrfz", count);
        top.reverse();
        for (let i = 0; i < top.length; i++) {
          ui.cardPile.insertBefore(top[i], ui.cardPile.firstChild);
        }
        game.log(player2, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
        game.updateRoundNumber();
        game.delayx();
      }
    },
    fuyingmrfz: {
      forced: true,
      audio: 2,
      mark: true,
      marktext: "沫",
      intro: {
        name: "沫",
        content: '有#个“沫”标记<br><span style="color:rgb(138,43,226);font-family:yuanli">人生五十年，如梦亦如幻。</span>'
      },
      trigger: {
        global: "dying"
      },
      filter(event2, player2) {
        return event2.player.isAlive() && event2.player.hasMark("fuyingmrfz");
      },
      async content(event2, trigger2, player2) {
        player2.$fullscreenpop("泡泡破裂了...", "thunder");
        for (let target of game.players.sortBySeat(trigger2.player).filter((c) => c.hasMark("fuyingmrfz"))) {
          const { bool } = target.countMark("fuyingmrfz") > target.countCards("he") ? { bool: false } : await target.chooseToDiscard("he").set("filterCard", (card) => {
            let cards = ui.selected.cards;
            if (cards.length > 1) {
              return cards.every((cardx) => get.suit(card) !== get.suit(cardx));
            }
            return true;
          }).set("ai", (card) => {
            return Math.abs(get.value(card, player2) - 1e4);
          }).set("complexCard", true).set("selectCard", target.countMark("fuyingmrfz")).set("prompt", `请弃置${target.countMark("fuyingmrfz")}张花色不同的牌或失去${target.countMark("fuyingmrfz")}点体力`).forResult();
          if (bool === false) target.loseHp(target.countMark("fuyingmrfz"));
          target.removeMark("fuyingmrfz", target.countMark("fuyingmrfz"));
        }
      },
      ai: {
        neg: true
      }
    },
    // 电弧
    gandianmrfz: {
      audio: 2,
      forced: true,
      trigger: {
        global: "roundStart"
      },
      init(player2) {
        game.broadcastAll(() => {
          lib.translate["gandianmrfz_zhou"] = "小轴";
          lib.translate["gandianmrfz_shu"] = "小树";
          _status.gandianmrfz_ig = [];
        });
      },
      mark: true,
      onremove(player2) {
        delete _status.gandianmrfz_ig;
        delete player2.storage.gandianmrfz;
        for (let char of game.players) {
          char.removeGaintag("gandianmrfz_zhou");
          char.removeGaintag("gandianmrfz_shu");
        }
      },
      intro: {
        content(storage) {
          let shu = Object.keys(lib.color).remove(storage);
          return `·小树:${get.translation(shu)}<br>·小轴:${get.translation(storage)}<br>·不受影响的角色:${get.translation(_status.gandianmrfz_ig)}`;
        }
      },
      global: ["gandianmrfz_effect", "gandianmrfz_effect2"],
      async content(event2, trigger2, player2) {
        for (let char of game.players) {
          char.removeGaintag("gandianmrfz_zhou");
          char.removeGaintag("gandianmrfz_shu");
        }
        const { control } = await player2.chooseControl("red", "black").set("prompt", "【感电】：请选择令一种颜色的牌称之为“小轴”，其余颜色的牌则称之为“小树”").set("ai", () => {
          return "red";
        }).forResult();
        if (control) player2.storage.gandianmrfz = control;
        game.broadcastAll((color) => {
          _status.gandianmrfzColor = color;
          _status.gandianmrfz_ig = [];
        }, player2.storage.gandianmrfz);
        for (let char of game.players) {
          char.addGaintag(char.getCards("h", { color: player2.storage.gandianmrfz }), "gandianmrfz_zhou");
          char.addGaintag(
            char.getCards("h", (card) => get.color(card) !== player2.storage.gandianmrfz),
            "gandianmrfz_shu"
          );
        }
        const result2 = await player2.chooseCardTarget({
          prompt: `【感电】:弃置N张牌并令N-1名角色不受【感电①】的影响且本轮第一个出牌阶段开始时摸X张牌（X=其手牌中“小树”的数量和“小轴”的数量中的最小值）`,
          filterTarget(card, player3, target) {
            return ui.selected.targets.length - 1 < ui.selected.cards.length;
          },
          selectTarget: [0, Infinity],
          filterCard: true,
          selectCard: [0, Infinity],
          complexCard: true,
          complexTarget: true,
          ai1(card) {
            let player3 = get.player();
            let num = game.countPlayer((char) => get.attitude2(char > 0));
            if (ui.selected.cards.length >= num) return false;
            return 6 - get.value(card, player3);
          },
          ai2(target) {
            let player3 = get.player();
            if (target === player3) return 114514;
            return get.attitude2(target) > 2;
          }
        }).forResult();
        let { targets, cards } = result2;
        game.broadcastAll((arr) => {
          _status.gandianmrfz_ig.push(...arr);
        }, targets);
        targets.forEach((target) => {
          target.when({
            player: "phaseUseBegin",
            global: "phaseBefore"
          }).then(() => {
            if (trigger2.name === "phaseUse") {
              let shu = player2.countCards("h", (card) => card.hasGaintag("gandianmrfz_shu"));
              let zhou = player2.countCards("h", (card) => card.hasGaintag("gandianmrfz_zhou"));
              let num = Math.min(shu, zhou, 5);
              if (num > 0) {
                player2.draw(num);
                player2.logSkill("gandianmrfz");
              }
            }
          });
        });
        player2.discard(cards);
      },
      ai: {
        viewHandcard: true,
        skillTagFilter(player2, tag, arg) {
          if (player2 == arg) {
            return false;
          }
        }
      },
      subSkill: {
        effect: {
          mod: {
            cardRespondable(card, player2) {
              let ig = _status.gandianmrfz_ig || [];
              let evt = _status.event.parent;
              let color = _status.gandianmrfzColor;
              let isZhou = get.color(evt.card) === color;
              if (isZhou && get.color(card) !== color || ig.includes(player2)) return true;
              return false;
            }
          },
          charlotte: true,
          silent: true,
          trigger: { player: "gainAfter" },
          async content(event2, trigger2, player2) {
            let color = player2.storage.gandianmrfz;
            for (let card of trigger2.cards) {
              if (get.color(card) === color) card.addGaintag("gandianmrfz_zhou");
              else card.addGaintag("gandianmrfz_shu");
            }
          }
        },
        effect2: {
          charlotte: true,
          silent: true,
          trigger: {
            player: "useCardToPlayered"
          },
          filter(event2, player2) {
            let ig = _status.gandianmrfz_ig || [];
            return !ig.includes(event2.target);
          },
          async content(event2, trigger2, player2) {
            const target = trigger2.target;
            target.addTempSkill("gandianmrfz_block");
            target.markAuto("gandianmrfz_block", [trigger2.card]);
          }
        },
        block: {
          mod: {
            cardEnabled(card, player2) {
              if (!player2.storage.gandianmrfz_block) {
                return;
              }
              const storage = player2.getStorage("gandianmrfz_block");
              let evt = get.event();
              if (evt.name != "chooseToUse") {
                evt = evt.getParent("chooseToUse");
              }
              if (!evt || !evt.respondTo || !storage.some((i) => i.cardid == evt.respondTo[1].cardid)) {
                return;
              }
              const color = get.color(card);
              let zhouColor = _status.gandianmrfzColor;
              return get.color(evt.respondTo[1]) === zhouColor && color !== zhouColor;
            }
          },
          onremove(player2) {
            delete player2.storage.gandianmrfz_block;
          },
          charlotte: true,
          trigger: {
            player: ["damageBefore", "damageCancelled", "damageZero"],
            target: ["shaMiss", "useCardToExcluded", "useCardToEnd"],
            global: ["useCardEnd"]
          },
          filter(event2, player2) {
            const evt = event2.getParent("useCard", true, true);
            if (evt && evt.effectedCount < evt.effectCount) {
              return false;
            }
            if (!event2.card || !player2.storage.gandianmrfz_block) {
              return false;
            }
            return player2.getStorage("gandianmrfz_block").includes(event2.card);
          },
          forced: true,
          popup: false,
          firstDo: true,
          async content(event2, trigger2, player2) {
            player2.unmarkAuto(event2.name, [trigger2.card]);
            if (!player2.getStorage(event2.name).length) {
              player2.removeSkill(event2.name);
            }
          }
        }
      }
    },
    //司霆惊蛰 小姨
    xiuyuanmrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "useCardToPlayered",
        target: "useCardToTargeted"
      },
      init() {
        game.broadcastAll(() => {
          lib.translate["visible_xiuyuanmrfz"] = "明置";
        });
      },
      filter(event2, player2) {
        if (!get.tag(event2.card, "damage") || player2.countCards("h", "ying") > player2.maxHp) {
          return false;
        }
        return player2 === event2.target || event2.getParent().triggeredTargets3.length === 1;
      },
      async content(event2, trigger2, player2) {
        await player2.gain(lib.card.ying.getYing(1), "gain2");
        let needShown = player2.getCards("h", (card) => get.name(card) === "ying" && !get.is.shownCard(card));
        if (needShown.length > 0) player2.addShownCards(needShown, "visible_xiuyuanmrfz");
      },
      mod: {
        ignoredHandcard: function(card, player2) {
          if (card.hasGaintag("visible_xiuyuanmrfz")) return true;
        },
        cardDiscardable: function(card, player2, name) {
          if (name === "phaseDiscard" && card.hasGaintag("visible_xiuyuanmrfz")) return false;
        },
        globalTo(from, to, distance) {
          let num = to.countCards("h", "ying");
          return distance + num;
        }
      }
    },
    zhengningmrfz: {
      audio: 2,
      trigger: { player: "phaseJieshuBegin" },
      filter(event2, player2) {
        return player2.countCards("h", "ying") > 0 || game.countPlayer((char) => char.isLinked()) > 0;
      },
      async cost(event2, trigger2, player2) {
        let result2 = {
          num: 0,
          discards: [],
          links: []
        };
        if (player2.countCards("h", "ying") > 0) {
          const { cards } = await player2.chooseCard("h").set("prompt", get.prompt("zhengningmrfz")).set("prompt2", "<font color = red>选择“确定”即不弃置【影】</font><br>你可以弃置任意张【影】、横置至多等量角色并摸等量张牌，然后你展示所有手牌并令一名横置且本回合未以此法选择过的角色进行判定，若你手牌中有与判定牌花色相同的牌，你可以弃置之并对其造成一点雷属性伤害，若其受到伤害，你可以重复此流程。").set("filterCard", (card) => get.name(card) === "ying").set("selectCard", [0, Infinity]).set("ai", (card) => {
            let player3 = get.player();
            let num = game.countPlayer((char) => !char.isLinked() && get.effect(char, { name: "tiesuo" }, player3, player3) > -1);
            return ui.selected.cards.length < num ? 1 : -1;
          }).forResult();
          if (cards?.length) {
            result2.num = cards.length;
            result2.discards = cards;
          } else return;
        }
        if (result2.num > 0) {
          const { targets } = await player2.chooseTarget().set("prompt", get.prompt("zhengningmrfz")).set("prompt2", `<font color = red>选择“确定”即不横置角色</font><br>你可以至多横置${get.cnNumber(result2.num)}名角色`).set("filterTarget", (card, player3, target) => !target.isLinked()).set("selectTarget", [0, result2.num]).set("ai", (target) => {
            let player3 = get.player();
            return get.effect(target, { name: "tiesuo" }, player3, player3) > -1;
          }).forResult();
          if (targets && targets.length) result2.links = targets;
        }
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("zhengningmrfz")).set("prompt2", `令一名被横置的角色进行判定，然后你可能对其造成一点雷属性伤害`).set("filterTarget", (card, player3, target) => {
          let links = get.event().links;
          for (let char of links) {
            char.showPrompt("即将被横置", void 0, true);
          }
          return target.isLinked() || links.includes(target);
        }).set("ai", (target) => {
          let player3 = get.player();
          return get.damageEffect(target, player3, player3, "thunder") > 0;
        }).set("links", result2.links).forResult();
        event2.result.cost_data = result2;
      },
      async content(event2, trigger2, player2) {
        const target = event2.targets[0];
        const { discards, links, num } = event2.cost_data;
        if (num > 0) {
          await player2.discard(discards);
          await player2.draw(num);
          for (let i of links) await i.link(true);
        }
        if (!target.isLinked()) return;
        const { suit } = await target.judge().forResult();
        if (player2.countCards("h", { suit }) < 1) return;
        const { bool } = await player2.chooseToDiscard().set("prompt", `【震佞】:你可以弃置一张${get.translation(suit)}的牌并对${get.translation(target)}造成一点雷属性伤害`).set("ai", (card) => 8 - get.value(card)).set("filterCard", (card) => get.suit(card) === suit).forResult();
        if (bool === true) {
          await target.damage("thunder", player2).set("zhengningmrfz", true);
          if (player2.hasHistory("sourceDamage", (evt) => {
            return evt.zhengningmrfz = true;
          })) {
            let next = game.createEvent("zhengningmrfz");
            next.player = player2;
            next.event = event2;
            next.setContent(async (event3, trigger3, player3) => {
              event3.result = {};
              await lib.skill.zhengningmrfz.cost(event3, trigger3, player3);
              if (event3.result.bool) {
                event3.targets = event3.result.targets;
                event3.cost_data = event3.result.cost_data;
                player3.logSkill("zhengningmrfz");
                await lib.skill.zhengningmrfz.content(event3, trigger3, player3);
              }
            });
          }
        }
      }
    },
    //黍
    kenyemrfz: {
      init: (player2) => {
        player2.storage.kenyemrfz = [];
      },
      marktext: "黍",
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards = player2.getExpansions(skill);
        if (cards.length) player2.loseToDiscardpile(cards);
      },
      audio: 2,
      trigger: { global: "useCard" },
      filter: function(event2, player2) {
        var bool = false, type = get.type2(event2.card);
        for (var i of ["basic", "trick", "equip"]) {
          if (type === i && event2.player.getHistory("useCard", (evt) => {
            return get.type2(evt.card) === i;
          }).indexOf(event2) === 0) {
            bool = true;
            break;
          }
        }
        if (event2.cards.length < 1) return false;
        return event2.cards.filterInD().length > 0 && bool;
      },
      prompt: function(event2, player2) {
        return `【垦野】:是否将${get.translation(event2.cards)}置于${get.translation(event2.player)}的武将牌上?`;
      },
      prompt2: function() {
        return get.skillInfoTranslation("kenyemrfz").replace(/<\/br>[\s\S]*/, "");
      },
      check: function(event2, player2) {
        if (get.attitude2(event2.player) < 0) return false;
        return !get.tag(event2.card, "damage");
      },
      async content(event2, trigger2, player2) {
        var target = trigger2.player;
        if (!player2.storage.kenyemrfz) player2.storage.kenyemrfz = [];
        if (!player2.storage.kenyemrfz.includes(target)) player2.storage.kenyemrfz.add(target);
        target.when({
          global: ["damageBegin", "phaseEnd"]
        }).filter((event3, player3) => {
          if (event3.name === "phase") return true;
          return event3.cards && event3.cards.some((card) => cardsx.includes(card));
        }).then(() => {
          if (trigger2.name === "phase") return;
          trigger2.num = 0;
        });
        let cardsx = trigger2.cards;
        target.when({
          global: ["cardsDiscardAfter", "phaseEnd"]
        }).filter((event3, player3) => {
          if (event3.name === "phase") return true;
          let bool = event3.cards && event3.cards.some((card) => cardsx.includes(card)) && !event3.kenyemrfz_checked;
          if (bool) event3.kenyemrfz_checked = true;
          return bool;
        }).then(() => {
          if (trigger2.name === "phase") return;
          player2.addToExpansion(trigger2.cards, player2, "give").gaintag.add("kenyemrfz");
        }).vars({
          cardsx
        });
      },
      global: "kenyemrfz_use",
      subSkill: {
        use: {
          trigger: { player: "phaseEnd" },
          charlotte: true,
          direct: true,
          filter: function(event2, player2) {
            if (player2.getExpansions("kenyemrfz").length < 1) return false;
            return player2.canUse("wuzhong", player2) || player2.canUse("tao", player2);
          },
          content: function() {
            "step 0";
            if (player.getExpansions("kenyemrfz").length > 0) {
              var list = [];
              if (player.canUseToAnyone("tao")) list.add("tao");
              if (player.canUseToAnyone("wuzhong")) list.add("wuzhong");
              if (list.length == 1) {
                player.useCard({ name: list[0] }, [player.getExpansions("kenyemrfz")[0]], player);
                player.logSkill("kenyemrfz");
              } else {
                event.list = list;
                event.goto(2);
              }
            } else event.finish();
            if (player.getExpansions("kenyemrfz").length > 0) {
              event.goto(0);
            } else event.finish();
            if (player.getExpansions("kenyemrfz").length > 0) {
              player.chooseBool("【垦野】:选择‘确定’使用【桃】，选择‘取消’使用【无中生有】").set("ai", function() {
                var player2 = _status.event.player;
                if (player2.hp < 3) return 0;
                return [0, 1].randomGet();
              });
            } else event.finish();
            if (result.bool) {
              player.useCard({ name: "tao" }, [player.getExpansions("kenyemrfz")[0]], player);
            } else player.useCard({ name: "wuzhong" }, [player.getExpansions("kenyemrfz")[0]], player);
            player.logSkill("kenyemrfz");
            event.goto(0);
          }
        }
      }
    },
    heyingmrfz: {
      audio: 2,
      trigger: { global: "gainAfter" },
      filter: function(event2, player2) {
        var evt = event2.getParent("phaseDraw");
        if (evt && evt.player == event2.player) return false;
        if (!event2.cards || event2.cards.length < 2) return false;
        if (event2.getParent(1).name != "draw") return false;
        return event2.player.canUseToAnyone("wugu");
      },
      usable: 1,
      direct: true,
      content: function() {
        "step 0";
        var target = trigger.player, cards = trigger.cards, type = [];
        for (var i of cards) {
          if (type.includes(get.type2(i))) continue;
          type.add(get.type2(i));
        }
        event.type = type;
        if (target == player) {
          player.chooseTarget(`【禾盈】:你可以将${get.translation(trigger.cards)}当做至多指定${get.cnNumber(type.length)}角色且结算${get.cnNumber(type.length)}次的【五谷丰登】使用`).set("selectTarget", [1, type.length]).set("filterTarget", function(card, player2, target2) {
            return player2.canUse("wugu", target2);
          }).set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, "")).set("ai", function(target2) {
            var player2 = _status.event.player, cards2 = _status.event.cards, num = _status.event.num;
            if (cards2.length >= num * 2) return false;
            if (get.value(cards2) > 8) return false;
            return get.effect(target2, get.autoViewAs({ name: "wugu" }, cards2), player2, player2);
          }).set("cards", trigger.cards).set("num", event.type.length);
        } else event.goto(2);
        if (result.targets) {
          trigger.player.when("useCard").filter((event2, player2) => {
            return event2.card && get.name(event2.card) == "wugu" && event2.card.storage.heyingmrfz == true;
          }).then(() => {
            trigger.effectCount = type.length;
          }).vars({ type: event.type });
          trigger.player.useCard({ name: "wugu", storage: { heyingmrfz: true } }, trigger.cards, result.targets);
          player.logSkill("heyingmrfz", result.targets);
          event.finish();
        } else {
          player.storage.counttrigger.heyingmrfz--;
          event.finish();
        }
        player.chooseBool(`【禾盈】:是否令${get.translation(trigger.player)}选择是否将此次摸的牌当做五谷丰登使用？`).set("ai", function() {
          var player2 = _status.event.player, target2 = _status.event.target;
          return get.attitude(target2, player2) > 0;
        }).set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, "")).set("target", trigger.player);
        if (result.bool) {
          trigger.player.chooseTarget(`【禾盈】:你可以将${get.translation(trigger.cards)}当做至多指定${get.cnNumber(event.type.length)}角色且结算${get.cnNumber(event.type.length)}次的【五谷丰登】使用`).set("selectTarget", [1, event.type.length]).set("filterTarget", function(card, player2, target2) {
            return player2.canUse("wugu", target2);
          }).set("prompt2", get.skillInfoTranslation("heyingmrfz").replace(/<\/br>[\s\S]*/, "")).set("ai", function(target2) {
            var player2 = _status.event.playerx, cards2 = _status.event.cards, num = _status.event.num;
            if (cards2.length >= num * 2) return false;
            if (get.value(cards2) > 8) return false;
            return get.effect(target2, get.autoViewAs({ name: "wugu" }, cards2), player2, player2);
          }).set("cards", trigger.cards).set("playerx", trigger.player).set("num", event.type.length);
        } else {
          player.storage.counttrigger.heyingmrfz--;
          event.finish();
        }
        if (result.targets) {
          trigger.player.when("useCard").filter((event2, player2) => {
            return event2.card && get.name(event2.card) == "wugu" && event2.card.storage.heyingmrfz == true;
          }).then(() => {
            trigger.effectCount = type.length;
          }).vars({ type: event.type });
          trigger.player.useCard(
            { name: "wugu", storage: { heyingmrfz: true } },
            //@ts-ignore
            trigger.cards,
            result.targets
          );
          trigger.player.logSkill("heyingmrfz", result.targets);
        } else player.storage.counttrigger.heyingmrfz--;
      }
    },
    rancuimrfz: {
      derivation: "liangtianmrfz",
      audio: 2,
      trigger: {
        player: "die"
      },
      direct: true,
      skillAnimation: true,
      animationColor: "wood",
      forceDie: true,
      content: async function(event2, trigger2, player2) {
        var list = player2.storage.kenyemrfz;
        for (var i of game.players) {
          if (i == player2 || !list.includes(i)) continue;
          i.addSkill("liangtianmrfz");
          i.line("liangtianmrfz");
        }
        player2.logSkill("liangtianmrfz");
      }
    },
    liangtianmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "drawAfter" },
      filter: function(event2, player2) {
        if (player2.hasSkill("liangtianmrfz_ban")) return false;
        return event2.getParent(2).name != "liangtianmrfz";
      },
      content: async function(event2, trigger2, player2) {
        var list = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"], phase;
        for (var i of list) {
          var evt = trigger2.getParent(i).name;
          if (evt == i) {
            phase = i;
            break;
          }
        }
        var phase = phase + "After";
        player2.draw();
        player2.addTempSkill("liangtianmrfz_ban", { global: phase });
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //新煌
    newyanxunmrfz: {
      audio: "yanxunmrfz",
      intro: {
        content: "本回合手牌上限+#"
      },
      trigger: {
        player: lib.phaseName.map((c) => `${c}Skipped`)
      },
      forced: true,
      async content(event2, trigger2, player2) {
        player2.addMark("newyanxunmrfz", 1, false);
        player2.draw();
        if (!player2.storage.newyanxunmrfz_addTempSkill) {
          game.broadcastAll((player3) => {
            player3.storage.newyanxunmrfz_addTempSkill = true;
          }, player2);
          player2.when({ player: "phaseEnd" }).then(() => {
            player2.removeMark("newyanxunmrfz", player2.countMark("newyanxunmrfz"), false);
            game.broadcastAll((player3) => {
              delete player3.storage.newyanxunmrfz_addTempSkill;
            }, player2);
          }).assign({
            mod: {
              maxHandcard(player3, num) {
                return num += player3.countMark("newyanxunmrfz");
              }
            }
          });
        }
      }
    },
    newfeixuemrfz: {
      audio: "feixuemrfz",
      trigger: {
        player: "useCard2"
      },
      mark: true,
      intro: {
        content(_, player2) {
          return _status.currentPhase === player2 ? `被跳过的阶段：${get.translation(player2.skipList)}` : "不是你的回合";
        }
      },
      filter(event2, player2) {
        let next = lib.skill.newfeixuemrfz.getNextPhase(event2, player2);
        return get.tag(event2.card, "damage") && event2.targets && next && _status.currentPhase === player2;
      },
      getNextPhase(event2, player2) {
        let name;
        if (lib.phaseName.indexOf(event2.name) === -1) {
          let evt = event2;
          while (true) {
            if (lib.phaseName.includes(evt.name)) {
              name = evt.name;
              break;
            }
            evt = evt.parent;
          }
        } else {
          name = event2.name;
        }
        let i = lib.phaseName.indexOf(name) + 1;
        while (true) {
          if (i > lib.phaseName.length) return;
          let phase = lib.phaseName[i];
          if (player2.skipList.includes(phase)) {
            i++;
            continue;
          }
          return phase;
        }
      },
      prompt2(event2, player2) {
        let next = lib.skill.newfeixuemrfz.getNextPhase(event2, player2);
        return `你可以跳过本回合下个没有被跳过的阶段(${get.translation(next)})，然后此牌的目标角色(${get.translation(event2.targets)})需要打出一张【闪】才能响应此牌。`;
      },
      check(event2, player2) {
        let next = lib.skill.newfeixuemrfz.getNextPhase(event2, player2);
        if (["phaseUse", "phaseDraw"].includes(next)) return false;
        let val = 0;
        event2.targets.forEach((target) => {
          val += get.effect(target, event2.card, player2, player2);
        });
        return val > 0;
      },
      async content(event2, trigger2, player2) {
        player2.skip(lib.skill.newfeixuemrfz.getNextPhase(event2, player2));
        player2.draw();
        for (let target of trigger2.targets) {
          const { bool } = await target.chooseToRespond().set("prompt", `请打出一张【闪】，否则${get.translation(trigger2.card)}不可响应`).set("filterCard", function(card, player3) {
            if (get.name(card) !== "shan") return false;
            return lib.filter.cardRespondable(card, player3);
          }).set("ai", (card) => {
            _status.event.getParent(4);
            let player3 = get.event().targetx;
            get.event().targetxx;
            let cardx = get.event().cardx;
            if (player3.hasSkillTag("freeShan")) return 1;
            if (
              //@ts-ignore
              player3.countCards("hs", (c) => {
                return get.canRespond(cardx, player3).includes(c.name);
              }) < cardx.name === "sha" ? 2 : 1
            )
              return -1;
          }).set("targetx", target).set("targetxx", player2).set("cardx", trigger2.card).forResult();
          if (bool === false) trigger2.directHit.add(target);
        }
      }
    },
    //新铃兰
    newhualaomrfz: {
      audio: "hualaomrfz",
      trigger: {
        source: "damageBegin"
      },
      marktext: "脆弱",
      intro: {
        name: "脆弱",
        content: "下次受到的伤害翻倍#次"
      },
      filter(event2, player2) {
        return event2.player !== player2;
      },
      prompt2(event2, player2) {
        return `是否令${get.translation(event2.player)}下次受到的伤害翻倍？`;
      },
      check(event2, player2) {
        if (get.attitude(player2, event2.player) > 0) return false;
        if (event2.num + event2.player.countMark("newhualaomrfz") - event2.player.hp >= 0) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        var target = trigger2.player;
        target.addMark("newhualaomrfz", 1, false);
        target.addTempSkill("newhualaomrfz_eff", { player: "damageEnd" });
        trigger2.num = 0;
      },
      subSkill: {
        eff: {
          charlotte: true,
          silent: true,
          trigger: { player: "damageBegin4" },
          filter(event2, player2) {
            return event2.num > 0 && player2.countMark("newhualaomrfz") > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.num *= 2 ** player2.countMark("newhualaomrfz");
            player2.removeAllmark("newhualaomrfz");
          }
        }
      }
    },
    newhemingmrfz: {
      audio: "huhuomrfz",
      trigger: {
        source: "damageZero"
      },
      usable: 1,
      async cost(event2, trigger2, player2) {
        let num = Math.floor(game.players.filter((char) => char !== player2 && char.inRangeOf(player2)).length / 2);
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("newhemingmrfz")).set("prompt2", `你可以令至多两名角色摸${get.cnNumber(num)}张牌`).set("ai", (target) => get.attitude2(target) > 0).set("selectTarget", [1, 2]).forResult();
      },
      async content(event2, trigger2, player2) {
        let num = Math.floor(game.players.filter((char) => char !== player2 && char.inRangeOf(player2)).length / 2);
        game.asyncDraw(event2.targets, num);
      }
    },
    //酒神
    xinyunmrfz: {
      audio: 2,
      trigger: { global: "dying" },
      usable: 1,
      filter(event2, player2) {
        return !event2.player.storage.xinyunmrfz_ban;
      },
      prompt(event2, player2) {
        return `【欣殒】:是否令${event2.player === player2 ? "你" : get.translation(event2.player)}摸4张牌并使用其中能使用的牌？`;
      },
      check(event2, player2) {
        return get.attitude(player2, event2.player) > 2;
      },
      async content(event2, trigger2, player2) {
        let target = trigger2.player;
        const result2 = await target.draw(4).forResult();
        if (!result2) return;
        game.broadcastAll(
          (target2, cards) => {
            target2.storage.xinyunmrfz = true;
            target2.storage.xinyunmrfz_ban = true;
            target2.storage.xinyunmrfz_cards = cards;
          },
          //@ts-ignore
          target,
          result2
        );
        target.when({
          source: "damageEnd",
          player: "dyingAfter"
        }).filter((event3, player3) => {
          if (event3.name !== "damage") return true;
          return player3.hasHistory("sourceDamage", (evt) => {
            if (evt.player && evt.player === player3) return false;
            return evt.cards && evt.cards.some((card) => result2.includes(card));
          });
        }).then(() => {
          game.broadcastAll((player3) => {
            delete player3.storage.xinyunmrfz;
            delete player3.storage.xinyunmrfz_ban;
          }, player2);
        });
        while (true) {
          let cards = target.getCards("h", (card) => {
            if (!result2.includes(card)) return false;
            return target.hasUseTarget(card);
          });
          if (cards.length < 1) break;
          await target.chooseToUse().set("filterCard", function(card, player3, event3) {
            let cards2 = player3.storage.xinyunmrfz_cards;
            if (!cards2.includes(card)) return false;
            return lib.filter.filterCard.apply(this, arguments);
          }).set("prompt", `请使用一张牌`).set("forced", true).set("addCount", false);
        }
        if (target.storage.xinyunmrfz) {
          await target.loseHp();
        } else player2.recoverTo(1);
        game.broadcastAll((target2) => {
          delete target2.storage.xinyunmrfz_ban;
          delete target2.storage.xinyunmrfz_cards;
        }, target);
      },
      ai: {
        threaten: 2,
        maixie: true,
        maixie_hp: true,
        skillTagFilter(player2, tag, arg) {
          return !!(player2.getStat("skill").xinyunmrfz && player2.getStat("skill").xinyunmrfz > 0);
        },
        effect: {
          target: function(card, player2, target) {
            if (player2.hp < 2 && get.tag(card, "damage")) return [1, 0.55];
          }
        }
      }
    },
    zongyinmrfz: {
      audio: 2,
      enable: "chooseToUse",
      mark: true,
      intro: {
        content(storage) {
          return `本轮已使用的花色:${get.translation(storage)}`;
        }
      },
      init: (player2, skill) => player2.storage[skill] = [],
      position: "hes",
      viewAs: {
        name: "jiu"
      },
      viewAsFilter(player2) {
        return player2.countCards("he", (card) => !player2.storage.zongyinmrfz.includes(get.suit(card))) > 0;
      },
      filterCard(card, player2, target) {
        return !player2.storage.zongyinmrfz.includes(get.suit(card));
      },
      onuse(result2, player2) {
        let card = result2.card;
        game.broadcastAll(
          function(card2, player3) {
            player3.storage.zongyinmrfz.add(get.suit(card2));
          },
          //@ts-ignore
          card,
          player2
        );
      },
      check(card) {
        if (_status.event.type === "dying") return 1 / Math.max(0.1, get.value(card));
        return 4 - get.value(card);
      },
      group: "zongyinmrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          trigger: {
            global: "roundStart"
          },
          silent: true,
          content: async function(event2, trigger2, player2) {
            player2.storage.zongyinmrfz = [];
          }
        }
      },
      ai: {
        threaten: 1.5,
        basic: {
          useful: (card, i) => {
            if (_status.event.player.hp > 1) {
              if (i === 0) return 4;
              return 1;
            }
            if (i === 0) return 7.3;
            return 3;
          },
          value: (card, player2, i) => {
            if (player2.hp > 1) {
              if (i === 0) return 5;
              return 1;
            }
            if (i === 0) return 7.3;
            return 3;
          }
        },
        order(item, player2) {
          if (_status.event.dying) return 9;
          let sha = get.order({ name: "sha" });
          if (sha <= 0) return 0;
          let usable = player2.getCardUsable("sha");
          if (usable < 2 && player2.hasCard((i) => {
            return get.name(i, player2) == "zhuge";
          }, "hs"))
            usable = Infinity;
          let shas = Math.min(usable, player2.mayHaveSha(player2, "use", item, "count"));
          if (shas != 1 || lib.config.mode === "stone" && !player2.isMin() && player2.getActCount() + 1 >= player2.actcount) return 0;
          return sha + 0.2;
        },
        result: {
          target: (player2, target, card) => {
            if (target && target.isDying()) return 2;
            if (!target || target._jiu_temp || !target.isPhaseUsing()) return 0;
            let effs = { order: 0 }, temp;
            target.getCards("hs", (i) => {
              if (get.name(i) !== "sha" || ui.selected.cards.includes(i)) return false;
              temp = get.order(i, target);
              if (temp < effs.order) return false;
              if (temp > effs.order) effs = { order: temp };
              effs[i.cardid] = {
                card: i,
                target: null,
                eff: 0
              };
            });
            delete effs.order;
            for (let i in effs) {
              if (!lib.filter.filterCard(effs[i].card, target)) continue;
              game.filterPlayer((current) => {
                if (get.attitude(target, current) >= 0 || //@ts-ignore
                !target.canUse(effs[i].card, current, null, true) || current.hasSkillTag("filterDamage", null, {
                  player: target,
                  card: effs[i].card,
                  jiu: true
                }))
                  return false;
                temp = get.effect(current, effs[i].card, target, player2);
                if (temp <= effs[i].eff) return false;
                effs[i].target = current;
                effs[i].eff = temp;
                return false;
              });
              if (!effs[i].target) continue;
              if (target.hasSkillTag(
                "directHit_ai",
                true,
                {
                  target: effs[i].target,
                  card: i
                },
                true
              ) || //(Math.min(target.getCardUsable("sha"), target.mayHaveSha(player, "use", item, "count")) === 1 && (
              target.needsToDiscard() > Math.max(0, 3 - target.hp) || !effs[i].target.mayHaveShan(
                player2,
                "use",
                effs[i].target.getCards((i2) => {
                  return i2.hasGaintag("sha_notshan");
                })
              )) {
                delete target._jiu_temp;
                return 1;
              }
            }
            delete target._jiu_temp;
            return 0;
          }
        },
        tag: {
          save: 1,
          recover: 0.1
        }
      }
    },
    zhanwangmrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter(event2, player2) {
        return !event2.targets.includes(player2) && !["delay", "equip"].includes(get.type(event2.card));
      },
      forced: true,
      intro: {
        content: "本回合手牌上限+#"
      },
      async content(event2, trigger2, player2) {
        trigger2.targets.push(player2);
      },
      group: "zhanwangmrfz_handLimit",
      subSkill: {
        handLimit: {
          audio: false,
          silent: true,
          trigger: {
            target: "useCardToTargeted"
          },
          filter(event2, player2) {
            return event2.card && get.tag(event2.card, "damage") && event2.targets.includes(player2);
          },
          async content(event2, trigger2, player2) {
            player2.addMark("zhanwangmrfz", 1, false);
            if (player2.getSkills().some((skill) => {
              let info = get.info(skill);
              return info.zhanwangmrfz;
            }))
              return;
            player2.when({ global: "phaseEnd" }).then(() => {
              player2.unmarkSkill("zhanwangmrfz");
              player2.removeMark("zhanwangmrfz", player2.countMark("zhanwangmrfz"), false);
            }).assign({
              zhanwangmrfz: true,
              mod: {
                maxHandcard(player3, num) {
                  return num + player3.getStorage("zhanwangmrfz");
                }
              }
            });
          }
        }
      }
    },
    //信仰搅拌机
    daoweimrfz: {
      audio: 2,
      trigger: { player: "phaseDrawEnd" },
      forced: true,
      filter(event2, player2) {
        let cards = [];
        let histories = player2.getHistory("gain", (evt) => {
          let evtx = evt.getParent(2);
          return evtx.name === "phaseDraw" || evtx.triggername && evtx.triggername.includes("phaseDraw");
        });
        for (let history of histories) {
          if (history.cards) cards.push(...history.cards);
        }
        return cards.length > 0;
      },
      async content(event2, trigger2, player2) {
        let cards = [];
        let histories = player2.getHistory("gain", (evt) => {
          let evtx = evt.getParent(2);
          return evtx.name === "phaseDraw" || evtx.triggername && evtx.triggername.includes("phaseDraw");
        });
        for (let history of histories) {
          if (history.cards) cards.push(...history.cards);
        }
        await player2.discard(cards);
        player2.draw(cards.length * 2);
        player2.storage.daoweimrfz_ban = Array.from(new Set(cards.map((card) => card.name)));
        player2.addTempSkill("daoweimrfz_ban", { player: "phaseEnd" });
      },
      subSkill: {
        ban: {
          charlotte: true,
          onremove: true,
          mark: true,
          intro: {
            content(_, player2) {
              return `·无法使用或打出${get.translation(player2.storage.daoweimrfz_ban)}`;
            }
          },
          mod: {
            cardEnabled2(card, player2) {
              if (player2.storage.daoweimrfz_ban.includes(card.name)) return false;
            }
          }
        }
      }
    },
    chongzhoumrfz: {
      audio: 2,
      enable: ["chooseToUse", "chooseToRespond"],
      usable: 1,
      intro: {
        name: "铳胄",
        content: "本回合手牌上限+2"
      },
      filter(event2, player2) {
        if (event2.type == "wuxie") return false;
        for (var name of ["sha", "shan"]) {
          if (event2.filterCard({ name, isCard: true }, player2, event2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog(event2, player2) {
          var vcards = [];
          for (var name of ["sha", "shan"]) {
            var card = { name, isCard: true };
            if (event2.filterCard(card, player2, event2)) {
              if (name === "sha") {
                for (var j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
              }
              vcards.push(["基本", "", name]);
            }
          }
          var dialog = ui.create.dialog("铳胄", [vcards, "vcard"], "hidden");
          dialog.direct = true;
          return dialog;
        },
        backup(links, player2) {
          return {
            audio: "chongzhoumrfz",
            filterCard: () => true,
            selectCard: 1,
            viewAs: {
              name: links[0][2],
              nature: links[0][3],
              isCard: true
            },
            popname: true,
            async precontent(event2, trigger2, player3) {
              let target = _status.currentPhase;
              if (target.getSkills().filter((skill) => {
                let info = get.info(skill);
                return info.sourceSkill && info.sourceSkill === "chongzhoumrfz";
              }).length < 1) {
                target.markSkill("chongzhoumrfz");
                target.when({ player: "phaseEnd" }).then(() => {
                  player3.unmarkSkill("chongzhoumrfz");
                }).assign({
                  mod: {
                    maxHandcard: function(player4, num) {
                      return num += 2;
                    }
                  }
                });
              }
            }
          };
        },
        prompt(links, player2) {
          return "铳胄：视为使用一张" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】";
        }
      },
      ai: {
        order(item, player2) {
          var player2 = _status.event.player;
          var event2 = _status.event;
          if (event2.filterCard({ name: "sha" }, player2, event2)) {
            if (!player2.hasShan() && //@ts-ignore
            !game.hasPlayer(function(current) {
              return player2.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player2, player2) > 0;
            })) {
              return 0;
            }
            return 2.95;
          } else {
            var player2 = _status.event.player;
            if (player2.hasSkill("qingzhong_give")) return 2.95;
            return 3.15;
          }
        },
        respondSha: true,
        respondShan: true,
        skillTagFilter(player2, tag, arg) {
          if (arg === "respond") return false;
        },
        result: {
          player: 1
        }
      }
    },
    shiyimrfz: {
      audio: 2,
      derivation: ["xiangle"],
      init(player2, skill) {
        player2.storage[skill] = false;
        let info = get.info("xiangle");
        if (!info.audioname2) info.audioname2 = {};
        info.audioname2["xinyangjiaobanjimrfz"] = "xiangle_xinyangjiaobanjimrfz";
      },
      trigger: {
        player: ["dying", "loseAfter"],
        global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
      },
      skillAnimation: true,
      animationColor: "wood",
      juexingji: true,
      unique: true,
      filter: function(event2, player2) {
        if (event2.name === "dying") return !player2.storage.shiyimrfz;
        else {
          if (player2.countCards("h")) return false;
          const evt = event2.getl(player2);
          return evt && evt.player == player2 && evt.hs && evt.hs.length > 0 && !player2.storage.shiyimrfz;
        }
      },
      forced: true,
      content: async function(event2, trigger2, player2) {
        player2.loseMaxHp();
        player2.recover();
        player2.addSkill("xiangle");
        player2.removeSkill("daoweimrfz");
        game.log(player2, "获得了技能", "#g【享乐】");
        player2.awakenSkill(event2.name);
        player2.storage[event2.name] = true;
        let num = 5 - player2.getAllHistory("useSkill", (evt) => evt.skill === "daoweimrfz").length;
        num = Math.max(num, 1);
        player2.draw(num);
        player2.storage.shiyimrfz_eff = num;
        player2.addSkill("shiyimrfz_eff");
      },
      subSkill: {
        eff: {
          charlotte: true,
          silent: true,
          onremove: true,
          mark: true,
          intro: {
            content(_, player2) {
              let num = player2.storage.shiyimrfz_eff;
              return `·手牌上限+${num}<br>·额定摸牌数+${num}`;
            }
          },
          trigger: { player: "phaseDrawBegin2" },
          filter(event2, player2) {
            return !event2.numFixed;
          },
          async content(event2, trigger2, player2) {
            trigger2.num += player2.storage.shiyimrfz_eff;
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num + player2.storage.shiyimrfz_eff;
            }
          }
        }
      }
    },
    xiangle_xinyangjiaobanjimrfz: { audio: 2 },
    //蕾缪安
    feiyimrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      intro: {
        content(_, player2) {
          let index;
          player2.getSkills().forEach((skill) => {
            let info = get.info(skill);
            if (typeof info.feiyimrfz === "number") {
              index = info.feiyimrfz;
            }
          });
          return `·回合内你的攻击距离${index === 0 ? "+1" : "-1"}<br>·其他角色计算与你的距离${index === 0 ? "-1" : "+1"}`;
        }
      },
      async cost(event2, trigger2, player2) {
        const { index } = await player2.chooseControl("选项一", "选项二", "cancel2").set("prompt", get.prompt("feiyimrfz")).set("prompt2", `1`).set("choiceList", ["你可以令你本回合的攻击距离+1，然后直到下个准备阶段开始时，其他角色计算与你的距离-1。", "你可以令你本回合的攻击距离-1，然后直到下个准备阶段开始时，其他角色计算与你的距离+1。"]).set("ai", () => 1).forResult();
        if (typeof index === "number")
          event2.result = {
            bool: true,
            cost_data: {
              index
            }
          };
        else event2.result = { bool: false };
      },
      async content(event2, trigger2, player2) {
        const { index } = event2.cost_data;
        player2.markSkill("feiyimrfz");
        player2.when({ player: "phaseBegin" }).then(() => {
          player2.unmarkSkill("feiyimrfz");
        }).assign({
          mod: {
            globalTo(from, to, distance) {
              return distance + (index === 0 ? -1 : 1);
            },
            attackRange: function(player3, num) {
              return num += index === 0 ? 1 : -1;
            }
          },
          feiyimrfz: index
        });
      },
      ai: {
        threaten: 0.8,
        combo: "mingzhengmrfz"
      }
    },
    mingzhengmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return event2.filterCard ? player2.countCards("h", (card) => event2.filterCard(card, player2, event2)) > 0 : player2.countCards("h") > 0;
      },
      filterCard: (card, player2, event2) => {
        return !lib.filter.filterCard(card, player2, event2);
      },
      selectCard: () => {
        let player2 = get.player();
        let num = player2.getCards("h", (card) => lib.filter.filterCard(card, player2)).length;
        num = Math.max(num, 1);
        return [0, num];
      },
      discard: false,
      lose: false,
      intro: {
        content: "·使用牌无距离限制<br>·使用的牌无视防具"
      },
      check(card) {
        let player2 = get.player();
        return get.value(card, player2) < 6;
      },
      async content(event2, trigger2, player2) {
        await player2.recast(event2.cards);
        let canUseCount = player2.getCards("h", (card) => lib.filter.filterCard(card, player2)).length;
        let cantUseCount = player2.getCards("h", (card) => !lib.filter.filterCard(card, player2)).length;
        if (canUseCount > cantUseCount) {
          player2.draw(2);
          player2.markSkill("mingzhengmrfz");
          player2.addTempSkill("mingzhengmrfz_ig", { player: "phaseEnd" });
          player2.when({ player: "phaseEnd" }).then(() => {
            player2.unmarkSkill("mingzhengmrfz");
          }).assign({
            mod: {
              targetInRange: function() {
                return true;
              }
            }
          });
        }
      },
      subSkill: {
        ig: {
          trigger: {
            player: "useCardToPlayered"
          },
          silent: true,
          charlotte: true,
          logTarget: "target",
          async content(event2, trigger2, player2) {
            trigger2.target.addTempSkill("qinggang2");
            trigger2.target.storage.qinggang2.add(trigger2.card);
            trigger2.target.markSkill("qinggang2");
          },
          ai: {
            unequip_ai: true,
            skillTagFilter(player2, tag, arg) {
              if (arg && arg.name == "sha") return true;
              return false;
            }
          }
        }
      },
      ai: {
        order: 13,
        result: {
          player: 1
        }
      }
    },
    zhuijimrfz: {
      audio: 3,
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        return game.countPlayer((c) => c.countCards("h") && c !== player2 && !player2.inRange(c)) > 0;
      },
      prompt2(event2, player2) {
        let targets = game.filterPlayer((c) => c.countCards("h") && c !== player2 && !player2.inRange(c));
        return `你可以展示你攻击范围外所有角色（${get.translation(targets)}）的一张牌，所有因此展示了伤害类牌的角色本阶段成为你使用牌的目标时，你可以对其造成一点伤害或摸一张牌（每项每名角色每阶段限一次）。`;
      },
      intro: {
        content(_, player2) {
          return `成为通缉的目标`;
        }
      },
      async content(event2, trigger2, player2) {
        let targets = game.filterPlayer((c) => c.countCards("h") && c !== player2 && !player2.inRange(c));
        let obj = {
          cards: [],
          targets: []
        };
        for (let target of targets) {
          const { cards } = await player2.choosePlayerCard("h", true, target).set("ai", () => get.rand(0, 1)).set("prompt", `展示${target}一张手牌`).forResult();
          if (!cards) return;
          let card = cards[0];
          if (card) {
            obj.cards.push(card);
            obj.targets.push(target);
            if (get.suit(card) !== "spade") {
              target.storage.zhuijimrfz = [];
              target.markSkill("zhuijimrfz");
            }
          }
        }
        if (obj.cards.length > 0) {
          event2.videoId = lib.status.videoId++;
          game.log(player2, "展示了", obj.targets, "的", obj.cards);
          game.broadcastAll(
            function(info, id, player3) {
              let { targets: targets2, cards } = info;
              var dialog = ui.create.dialog(`因${get.translation(player3)}的【追缉】而展示的牌`, cards);
              dialog.videoId = id;
              var getName = function(target) {
                if (target._tempTranslate) return target._tempTranslate;
                var name = target.name;
                if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
                return get.translation(name);
              };
              for (var i = 0; i < targets2.length; i++) {
                dialog.buttons[i].querySelector(".info").innerHTML = getName(targets2[i]);
              }
              setTimeout(() => {
                dialog.show();
              }, 1);
            },
            //@ts-ignore
            obj,
            //@ts-ignore
            event2.videoId,
            player2
          );
          game.delay(3);
          setTimeout(() => {
            game.broadcastAll("closeDialog", event2.videoId);
          }, 3e3);
        }
      },
      group: ["zhuijimrfz_clear", "zhuijimrfz_eff"],
      subSkill: {
        eff: {
          mod: {
            cardUsableTarget(card, player2, target) {
              if (Array.isArray(target.storage.zhuijimrfz)) return true;
            }
          },
          audio: "zhuijimrfz",
          charlotte: true,
          trigger: { player: "useCardToTargeted" },
          filter(event2, player2) {
            let storage = event2.target.storage.zhuijimrfz;
            return storage && storage.length < 2;
          },
          async cost(event2, trigger2, player2) {
            let storage = trigger2.target.storage.zhuijimrfz;
            let list = ["摸一张牌", `对${get.translation(trigger2.target)}造成一点伤害`];
            if (storage.includes("damage") || storage.includes("draw")) {
              let str = storage.includes("draw") ? `是否对${get.translation(trigger2.target)}造成一点伤害？` : `是否摸一张牌？`;
              let aiBool = true;
              if (storage.includes("draw") && get.damageEffect(trigger2.target, player2, player2) < 0) aiBool = false;
              const { bool } = await player2.chooseBool().set("prompt", str).set("ai", () => aiBool).forResult();
              event2.result = {
                bool,
                cost_data: {
                  index: storage.includes("draw") ? 1 : 0
                }
              };
            } else {
              const { index } = await player2.chooseControl("选项一", "选项二", "cancel2").set("choiceList", list).set("ai", () => {
                let player3 = get.player();
                let target = get.event().target;
                return get.damageEffect(target, player3, player3) > 0 ? 1 : 0;
              }).set("target", trigger2.target).forResult();
              if (typeof index === "number") {
                event2.result = {
                  bool: true,
                  cost_data: {
                    index
                  }
                };
              } else event2.result = { bool: false };
            }
          },
          async content(event2, trigger2, player2) {
            const { index } = event2.cost_data;
            if (index === 0) {
              player2.draw();
            } else {
              trigger2.target.damage(player2);
              player2.line(trigger2.target);
            }
            trigger2.target.storage.zhuijimrfz.push(index === 0 ? "draw" : "damage");
          }
        },
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseUseEnd" },
          content() {
            for (let char of game.players) {
              if (Array.isArray(char.storage.zhuijimrfz)) {
                char.unmarkSkill("zhuijimrfz");
                delete char.storage.zhuijimrfz;
              }
            }
          }
        }
      }
    },
    // 新约能天使
    youhuomrfz: {
      audio: 2,
      trigger: { player: "useCard" },
      filter(event2, player2) {
        return event2.card.name === "sha" && player2.countCards("h", (card) => player2.canRecast(card)) > 0;
      },
      intro: {
        content(_, player2) {
          let addCount = player2.getSkills().filter((skill) => {
            let info = get.info(skill);
            return info.youhuomrfz;
          }).length;
          return `·本回合可额外使用${addCount}张【杀】<br>·本回合剩余可使用【杀】的数量：${player2.getCardUsable("sha")}`;
        }
      },
      async cost(event2, trigger2, player2) {
        let num = player2.getHistory("useSkill", (evt) => evt.skill === "youhuomrfz").length + 1;
        event2.result = await player2.chooseCard().set("filterCard", (card, player3) => player3.canRecast(card)).set("prompt", get.prompt("youhuomrfz")).set("prompt2", `你可以重铸一张手牌，若此牌为伤害类牌，此牌(${get.translation(trigger2.card)})额外结算${num}次，且若此牌造成伤害，你本回合使用【杀】的次数+1`).set("ai", (card) => {
          let num2 = 6 - get.value(card);
          if (get.tag(card, "damage")) num2 += 2;
          return num2;
        }).forResult();
      },
      async content(event2, trigger2, player2) {
        let num = player2.getHistory("useSkill", (evt) => evt.skill === "youhuomrfz").length;
        await player2.recast(event2.cards);
        if (get.tag(event2.cards[0], "damage") > 0) {
          trigger2.effectCount += num;
          player2.when({
            source: "damageEnd",
            global: lib.phaseName.map((i) => i + "End")
          }).filter((event3) => {
            return event3.name !== "damage" || event3.card === trigger2.card;
          }).then(() => {
            if (trigger2.name === "damage") {
              player2.markSkill("youhuomrfz");
              player2.when({ player: "phaseEnd" }).then(() => {
                player2.unmarkSkill("youhuomrfz");
              }).assign({
                mod: {
                  cardUsable(card, player3, num2) {
                    if (card.name == "sha") return num2 + 1;
                  }
                },
                youhuomrfz: true
              });
            }
          });
        }
      }
    },
    letianmrfz: {
      audio: 2,
      init() {
        lib.translate["letianmrfz_tips"] = "旧约";
      },
      forced: true,
      trigger: { global: "phaseEnd" },
      filter(event2, player2) {
        return player2.countCards("h", (card) => card.hasGaintag("letianmrfz_tips")) < 1;
      },
      async content(event2, trigger2, player2) {
        player2.drawTo(4);
        player2.removeGaintag("letianmrfz_tips");
      },
      group: ["letianmrfz_begin"],
      subSkill: {
        begin: {
          charlotte: true,
          silent: true,
          priority: 114514,
          trigger: {
            global: "phaseBegin"
          },
          async content(event2, trigger2, player2) {
            for (let card of player2.getCards("h")) {
              card.addGaintag("letianmrfz_tips");
            }
          }
        }
      }
    },
    //隐德莱希
    pingyimrfz: {
      audio: 2,
      trigger: { global: "phaseEnd" },
      getCharacter() {
        let result2 = {
          sourceDamage: [],
          damage: [],
          all: []
        };
        for (let char of game.players) {
          char.getHistory("sourceDamage", (evt) => {
            if (evt.player) result2.damage.add(evt.player);
            if (evt.source) result2.sourceDamage.add(evt.source);
          });
        }
        result2.all = result2.sourceDamage.concat(result2.damage);
        return result2;
      },
      filter(event2, player2) {
        let { sourceDamage, damage } = lib.skill.pingyimrfz.getCharacter();
        return (sourceDamage.length > 0 || damage.length > 0) && event2.player !== player2;
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("pingyimrfz")).set("prompt2", get.prompt2("pingyimrfz").replace(/###([^#]+)###/g, "")).set("filterTarget", (card, player3, target) => {
          let { sourceDamage, damage, all } = get.event().info;
          for (let char of game.players) {
            let prompt = [];
            if (sourceDamage.includes(char)) prompt.push("使用【杀】");
            if (damage.includes(char)) prompt.push("使用【桃】");
            if (prompt.length > 0) whichWayTips.addPrompt(char, prompt.length > 1 ? prompt.map((text) => `<span class = "promptTextSJZX">${text}</span>`).join("<br>") : prompt[0], "pingyimrfz", "uncheckBegin");
          }
          return all.includes(target);
        }).set("info", lib.skill.pingyimrfz.getCharacter()).forResult();
      },
      async content(event2, trigger2, player2) {
        let { sourceDamage, damage, all } = lib.skill.pingyimrfz.getCharacter();
        let target = event2.targets[0];
        let name = [];
        if (sourceDamage.includes(target)) name.add("sha");
        if (damage.includes(target)) name.add("tao");
        let prompt = `对${get.translation(target)}使用一张`;
        if (name.length === 1) prompt = prompt + `【${get.translation(name[0])}】`;
        else prompt = prompt + `【${get.translation(name[0])}】或【${get.translation(name[1])}】`;
        await player2.chooseToUse(target).set("prompt", prompt).set("filterCard", (card, player3, event3) => {
          return get.event().namex.includes(get.name(card));
        }).set("namex", name);
        if (player2.storage.pingyimrfz_check) {
          delete player2.storage.pingyimrfz_check;
          let next = game.createEvent("pingyimrfz_repeat");
          next.player = player2;
          next.setContent(async function(event3, trigger3, player3) {
            await lib.skill.pingyimrfz.cost(event3, trigger3, player3);
            if (event3.result.bool !== true) return;
            event3.targets = event3.result.targets;
            await lib.skill.pingyimrfz.content(event3, trigger3, player3);
          });
        }
      },
      group: ["pingyimrfz_check"],
      subSkill: {
        check: {
          silent: true,
          audio: false,
          charlotte: true,
          trigger: {
            global: "changeHp"
          },
          filter(event2, player2) {
            return event2.getParent(5).name === "pingyimrfz" || event2.getParent(5).name === "pingyimrfz_repeat";
          },
          async content(event2, trigger2, player2) {
            player2.storage.pingyimrfz_check = true;
          }
        }
      }
    },
    beinuomrfz: {
      audio: 2,
      usable: 3,
      /*
       * false为最后获得，true为最先获得
       */
      getCard(bool, debug) {
        let player2 = get.player();
        let cards = player2.getCards("h")?.filter((card) => card.storage && typeof card.storage.beinuomrfz === "number");
        if (!cards) return;
        return debug ? cards.sort((a, b) => {
          let num1 = a.storage.beinuomrfz;
          let num2 = b.storage.beinuomrfz;
          return num1 - num2;
        }) : cards.sort((a, b) => {
          let num1 = a.storage.beinuomrfz;
          let num2 = b.storage.beinuomrfz;
          return num1 - num2;
        })[bool ? 0 : cards.length - 1];
      },
      init() {
        lib.translate["beinuomrfz_last"] = "最后获得";
        lib.translate["beinuomrfz_earliest"] = "最先获得";
      },
      enable: "chooseToUse",
      filterCard(card, player2) {
        return card === lib.skill.beinuomrfz.getCard(false);
      },
      filter(event2, player2) {
        let name = lib.skill.beinuomrfz.getCard(true)?.name;
        if (!name) return false;
        let card = get.autoViewAs({ name }, [lib.skill.beinuomrfz.getCard(false)]);
        return event2.filterCard(card, player2, event2);
      },
      viewAs(cards, player2) {
        let name = lib.skill.beinuomrfz.getCard(true).name;
        return { name };
      },
      prompt() {
        return `你可以将最后获得的牌(${get.translation(lib.skill.beinuomrfz.getCard(false).name)})当作最先获得的牌(${get.translation(lib.skill.beinuomrfz.getCard(true).name)})使用`;
      },
      async precontent(event2, trigger2, player2) {
        let last = lib.skill.beinuomrfz.getCard(false);
        let earliest = lib.skill.beinuomrfz.getCard(true);
        let cards = event2.result.cards;
        if (get.type2(last) !== get.type2(earliest)) {
          player2.when({ player: "useCardAfter" }).filter((event3, player3) => {
            return event3.cards && event3.cards[0] === cards[0];
          }).then(() => {
            player2.draw(2);
          }).then(() => {
            player2.chooseCard("你可以将一张手牌视为你最先获得的牌").set("filterCard", (card) => {
              return card !== lib.skill.beinuomrfz.getCard(true);
            }).set("ai", (card) => {
              let earliest2 = lib.skill.beinuomrfz.getCard(true);
              let player3 = get.player();
              if (["sha", "tao"].includes(earliest2.name)) return -1;
              if (["sha", "tao"].includes(card.name)) return 10 + player3.hp < 3 ? get.value(card) : 0;
              return get.value(earliest2) >= get.value(card) ? -1 : get.value(card);
            });
          }).then(() => {
            let result2 = event2._result;
            if (result2.cards) {
              result2.cards[0].storage.beinuomrfz = lib.skill.beinuomrfz.getCard(true).storage.beinuomrfz - 1;
            }
          }).then(() => {
            lib.skill.beinuomrfz.subSkill.tip.content(event2, trigger2, player2);
          });
        }
      },
      group: ["beinuomrfz_tag", "beinuomrfz_tip"],
      subSkill: {
        tag: {
          silent: true,
          audio: false,
          charlotte: true,
          trigger: {
            player: "gainAfter",
            global: "gameDrawAfter"
          },
          async content(event2, trigger2, player2) {
            if (!player2.storage.beinuomrfz_tag) player2.storage.beinuomrfz_tag = 0;
            let cards = trigger2.name === "gain" ? trigger2.cards : player2.getCards("h");
            for (let card of cards) {
              card.storage.beinuomrfz = player2.storage.beinuomrfz_tag;
              player2.storage.beinuomrfz_tag++;
            }
          }
        },
        tip: {
          silent: true,
          audio: false,
          charlotte: true,
          trigger: {
            player: ["gainAfter", "loseAfter"],
            global: "gameDrawAfter"
          },
          lastDo: true,
          async content(event2, trigger2, player2) {
            for (let card of player2.getCards("h").filter((card2) => card2.storage && typeof card2.storage.beinuomrfz === "number")) {
              card.removeGaintag("beinuomrfz_last");
              card.removeGaintag("beinuomrfz_earliest");
              if (card === lib.skill.beinuomrfz.getCard(false)) card.addGaintag("beinuomrfz_last");
              if (card === lib.skill.beinuomrfz.getCard(true)) card.addGaintag("beinuomrfz_earliest");
            }
          }
        }
      },
      ai: {
        order: 10,
        result: {
          player: 1
        }
      }
    },
    // 爱布拉娜 香蕉姐 死芒
    yizhamrfz: {
      init() {
        lib.translate["yizhamrfz_tip1"] = "拼点";
        lib.translate["yizhamrfz_tip2"] = "议事";
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return game.hasPlayer((char) => char !== player2 && char.countCards("h") > 0 && player2.canCompare(char)) && player2.countCards("h") > 0;
      },
      filterTarget(card, player2, target) {
        return target !== player2 && target.countCards("h") > 0 && player2.canCompare(target);
      },
      selectTarget: [1, 2],
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        let { targets } = event2;
        function aiChoose(char) {
          let cards = char.getCards("h");
          if (cards.length < 2) return cards;
          let sortNumber = cards.sort((a, b) => {
            return get.number(b, char) - get.number(a, char);
          });
          let sortValue = cards.sort((a, b) => {
            return get.value(b, char) - get.value(a, char);
          });
          let max = sortNumber[0];
          let min = sortNumber[sortNumber.length - 1];
          if (player2.countCards("h", { color: "red" }) < 1) {
            return [max, sortValue[sortValue.length - 1]];
          } else if (player2.countCards("h", { color: "black" }) < 1) {
            return [min, sortValue[sortValue.length - 1]];
          } else {
            if (Math.random() > 0.5) {
              let black = cards.filter((card) => get.color(card) === "black" && card !== max);
              return [max, black.length > 0 ? black.randomGet() : cards.filter((card) => card !== max).randomGet()];
            } else {
              let red = cards.filter((card) => get.color(card) === "red" && card !== min);
              return [min, red.length > 0 ? red.randomGet() : cards.filter((card) => card !== min).randomGet()];
            }
          }
        }
        let cardMaps = [];
        for (let target of [...targets, player2]) {
          let cardsCompare;
          const result3 = await target.chooseCard(true).set("prompt", "【刈诈】：请选择一张手牌进行拼点").set("type", "compare").set("ai", (card) => {
            get.player();
            let result4 = get.event().aiChooseResult;
            return result4[0] === card;
          }).set("aiChooseResult", aiChoose(target)).forResult();
          if (!result3 || !result3.cards) return;
          if (result3.skill) {
            cardsCompare = lib.skill[result3.skill].onCompare(target)[0];
          } else cardsCompare = result3.cards[0];
          const { cards } = await target.chooseCard(true).set("type", "debate").set("source", player2).set("prompt", "【刈诈】：请选择一张手牌进行议事").set("filterCard", (card, player3, event3) => {
            let banCard = get.event().banCard;
            return card !== banCard;
          }).set("complexCard", true).set("ai", (card) => {
            get.player();
            let result4 = get.event().aiChooseResult;
            return result4[0] === card;
          }).set("aiChooseResult", aiChoose(target)).set("banCard", cardsCompare).forResult();
          if (!cards) return;
          const cardsDebate = cards[0];
          cardMaps.push([target, [cardsCompare, cardsDebate]]);
        }
        let compareMaps = {};
        let debateMaps = [];
        for (let arr of cardMaps) {
          compareMaps[arr[0].playerid] = arr[1][0];
          if (arr[1] && arr[1][1]) debateMaps.push([arr[0], arr[1][1]]);
        }
        let targetCompare = targets.filter((target) => Object.keys(compareMaps).includes(target.playerid));
        let targetDebate = targets.filter((target) => debateMaps.map((arr) => arr[0]).includes(target));
        let result1 = await player2.chooseToCompare(targetCompare).set("fixedResult", compareMaps).forResult();
        let result2 = await player2.chooseToDebate([...targetDebate, player2]).set("fixedResult", debateMaps).forResult();
        [...targetDebate, player2].forEach((target) => target.removeGaintag("yizhamrfz_tip2"));
        let compareResult = {
          win: [],
          lose: []
        };
        for (let i = 0; i < result1.num1.length; i++) {
          if (result1.num1[i] > result1.num2[i]) {
            compareResult.lose.add(targetCompare[i]);
            compareResult.win.add(player2);
          } else {
            compareResult.lose.add(player2);
            compareResult.win.add(targetCompare[i]);
          }
        }
        if (result2.opinion === "black") {
          for (let char of compareResult.lose) {
            if (!compareResult.win.includes(char)) await char.damage(player2);
          }
        } else if (result2.opinion === "red") {
          for (let char of compareResult.win) {
            if (char.countDiscardableCards(player2, "he")) await player2.discardPlayerCard(char, true, 2, "he").set("ai", lib.card.guohe.ai.button);
          }
        } else {
          const { targets: targetsx } = await player2.chooseTarget().set("prompt", "【刈诈】：你可以对任意名角色造成一点伤害").set("selectTarget", [1, Infinity]).set("ai", (target) => {
            let player3 = get.player();
            return get.damageEffect(target, player3, player3) > 0;
          }).forResult();
          if (targetsx) {
            for (let char of targetsx) {
              char.damage(player2);
              player2.line(char);
            }
          }
          player2.draw(2);
        }
      },
      ai: {
        order: 10,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    kumianmrfz: {
      audio: 2,
      trigger: { player: "phaseJieshuEnd" },
      getNum(player2) {
        let num = 0;
        let cards = [];
        num += player2.getStat("damage") || 0;
        for (let char of game.players) {
          char.getHistory("lose", (evt) => {
            if (evt.type === "discard" && evt.cards) {
              let discards = get.discarded();
              let result2 = evt.cards.filter((card) => discards.includes(card));
              if (result2.length > 0) cards.push(...result2);
            }
          });
        }
        if (cards.length > 0) num += new Set(cards.map((i) => get.type2(i))).size;
        return num;
      },
      filter(event2, player2) {
        let num = lib.skill.kumianmrfz.getNum(player2);
        return num > 0;
      },
      init(player2) {
        game.broadcastAll(function() {
          let skills = ["new_rejianxiong", "shanzhuan", "olzaowang"];
          skills.forEach((skill) => {
            let info = get.info(skill);
            if (!info.audioname2) info.audioname2 = {};
            info.audioname2[player2.name] = "kumianmrfz";
          });
        });
      },
      derivation: ["new_rejianxiong", "shanzhuan", "olzaowang"],
      forced: true,
      async content(event2, trigger2, player2) {
        let num = lib.skill.kumianmrfz.getNum(player2);
        if (num > 0) {
          player2.draw();
        }
        if (num > 1) player2.addTempSkill("new_rejianxiong", { player: "phaseJieshuBegin" });
        if (num > 2) player2.addTempSkill("shanzhuan", { player: "phaseJieshuBegin" });
        if (num > 3) player2.addTempSkill("olzaowang", { player: "phaseJieshuBegin" });
      }
    },
    // mon3tr m3
    // 想你了，牢猫
    shulimrfz: {
      audio: false,
      forced: true,
      silent: true,
      mod: {
        cardUsable(card, player2, num) {
          if (player2.countCards("h") >= game.roundNumber * 2 && ["equip", "delay"].includes(get.type(card))) return false;
          if (player2.countCards("h") >= game.roundNumber && get.type(card) === "basic" && typeof num === "number") return num += 1;
        }
      }
    },
    ronghuimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      async content(event2, trigger2, player2) {
        const discardPlie = Array.from(ui.discardPile.childNodes);
        const cards = player2.getCards("h");
        await player2.lose(cards);
        await player2.gain(discardPlie, "gain2");
        player2.addTempSkill("ronghuimrfz_lose", { player: "phaseUseEnd" });
        player2.when({ player: "phaseUseEnd" }).then(() => {
        }).assign({
          mod: {
            cardUsable(card, player3, num) {
              if (typeof num === "number") return num;
              return 1;
            }
          }
        });
        player2.when({ player: "phaseDiscardBegin" }).step(async (event3, trigger3, player3) => {
          const discardPlie2 = Array.from(ui.discardPile.childNodes);
          const cards2 = player3.getCards("h");
          await player3.lose(cards2);
          await player3.gain(discardPlie2, "gain2");
          player3.logSkill("ronghuimrfz");
        });
      },
      subSkill: {
        lose: {
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: {
            player: "loseAfter",
            global: "loseAsyncAfter"
          },
          filter(event2, player2) {
            if (event2.type !== "use") return false;
            let evt = event2.getl(player2);
            return evt.cards2 && evt.cards2.some((card) => get.position(card) === "d" && !["equip", "delay"].includes(get.type(card)));
          },
          async content(event2, trigger2, player2) {
            let cards2 = trigger2.getl(player2).cards2;
            cards2 = cards2.filter((card) => get.position(card) === "d" && !["equip", "delay"].includes(get.type(card)));
            for (let card of cards2) {
              card.fix();
              ui.cardPile.appendChild(card);
            }
            game.log(player2, `将`, `#y${get.translation(cards2)}`, `张牌置于了牌堆底`);
          }
        }
      },
      ai: {
        threaten: 1.8,
        order: 3.4,
        result: {
          player(player2) {
            let transferValue = function(cards2) {
              return cards2.map((card) => player2.getUseValue(card)).reduce((acc, curr) => acc + curr, 0);
            };
            let filterCards = function(cards2) {
              return cards2.filter((card) => player2.getCardUsable2(card) > 0 && (get.type(card) === "basic" || get.type(card) !== "basic" && player2.countUsed(card) < 1));
            };
            let cards = filterCards(player2.getCards("h"));
            let discardPlie = filterCards(Array.from(ui.discardPile.childNodes));
            return transferValue(cards) > transferValue(discardPlie) ? -1 : 1;
          }
        }
      }
    }
  }
};
export {
  legend2SJZX as default
};
//# sourceMappingURL=legend2SJZX.js.map
