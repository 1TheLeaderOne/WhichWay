import { game, ui, get, lib, _status } from "noname";
window.whichWaySave.tmpSave;
const plot1SJZX = {
  character: {
    acemrfz: ["male", "luomrfz", "4/6", ["newsizhanmrfz", "ehoumrfz"], []],
    baocunzhemrfz: ["male", "qianmrfz", 10, ["shouwangmrfz", "jingmomrfz", "xijimrfz"], []],
    yizumikemrfz: ["male", "haimrfz", 3, ["chanshimrfz"], []],
    kelisitengmrfz: ["female", "lymrfz", 4, ["xingtumrfz", "poqiongmrfz"], []],
    aiguozhemrfz: ["male", "zhmrfz", 4, ["xinjunxingmrfz", "youjimrfz"], []],
    doushitalulamrfz: ["female", "zhmrfz", 4, ["zhuoximrfz", "talula_shixinmrfz"], []],
    teleixiyamrfz: ["female", "bamrfz", 3, ["bojimrfz", "caijianmrfz"], []],
    teleixisimrfz: ["male", "junmrfz", 4, ["yuanfumrfz", "fenzhoumrfz"], []],
    qiaojiakelifumrfz: ["male", "gemrfz", 4, ["chongxiemrfz", "qj_chongjimrfz", "leitingmrfz"], []],
    puruisaisimrfz: ["female", "qianmrfz", 3, ["qianmianmrfz", "neihuamrfz"], []],
    shuangwangmrfz: ["female", "kaizidaiermrfz", 8, ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz", "gujimrfz", "jiangqingmrfz"], []],
    keluxiermrfz: ["female", "bamrfz", 4, ["fuzhimrfz", "kuorongmrfz"], []],
    minermrfz: {
      group: "wumrfz",
      sex: "male",
      skills: ["xunkaimrfz"],
      hp: 3
    },
    xierdamrfz: {
      group: "weimrfz",
      sex: "female",
      skills: ["shencimrfz", "lanshengmrfz"],
      hp: 3
    }
  },
  skill: {
    //希尔达
    shencimrfz: {
      audio: 2,
      trigger: { global: "phaseBegin" },
      forced: true,
      filter(event2, player2) {
        return player2.countCards("h", (card) => card.hasGaintag("shencimrfz")) < 1;
      },
      async content(event2, trigger2, player2) {
        let cards2 = [];
        for (let name2 of lib.inpile) {
          if (!["basic", "trick"].includes(get.type(name2))) continue;
          let list = lib.card.list.filter((arr) => arr[2] === name2).randomGet();
          cards2.push(game.createCard(name2, list[0], list[1], list[3]));
        }
        const result = await player2.chooseCardHand().set("ai", (card2) => get.player().getUseValue(card2)).set("cards", cards2).set("forced", true).set("complexSelect", true).set("prompt", `【神赐】:请选择你要获得的牌`).forResult();
        if (!result?.cards) return;
        const { name, suit, number, nature } = result.cards[0];
        let card = game.createCard(name, suit, number, nature);
        card._destroy = true;
        player2.gain(card, "gain2").set("gaintag", ["shencimrfz"]);
      },
      group: ["shencimrfz_onlose", "shencimrfz_dying"],
      subSkill: {
        dying: {
          audio: "shencimrfz",
          forced: true,
          trigger: { player: "dying" },
          filter(event2, player2) {
            return player2.countCards("h", (card) => card.hasGaintag("shencimrfz")) > 0;
          },
          async content(event2, trigger2, player2) {
            await player2.discard(player2.getCards("h", (card) => card.hasGaintag("shencimrfz")));
            player2.recoverTo(1);
          }
        },
        onlose: {
          audio: false,
          silent: true,
          charlotte: true,
          trigger: { player: "loseAfter" },
          filter(event2, player2) {
            for (let id in event2.gaintag_map) {
              let tags = event2.gaintag_map[id];
              if (event2.cards.some((card) => card.cardid === id) && tags.includes("shencimrfz")) return true;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            let destory = [];
            for (let id in trigger2.gaintag_map) {
              let tags = trigger2.gaintag_map[id];
              if (!tags.includes("shencimrfz")) continue;
              destory.addArray(trigger2.cards.filter((card) => card.cardid === id));
            }
            game.log(destory, `被销毁了`);
          }
        }
      }
    },
    lanshengmrfz: {
      audio: 2,
      trigger: {
        player: "damageEnd",
        source: "damageEnd"
      },
      filter(event2, player2) {
        return new Set(
          game.getAllGlobalHistory("everything", (evt) => evt.name === "gain" && evt.gaintag.includes("shencimrfz")).map((evt) => evt.cards.map((i) => get.suit(i))).flat()
        ).size > 0;
      },
      async cost(event2, trigger2, player2) {
        let suits = new Set(
          game.getAllGlobalHistory("everything", (evt) => evt.name === "gain" && evt.gaintag.includes("shencimrfz")).map((evt) => evt.cards.map((i) => get.suit(i))).flat()
        );
        event2.result = await player2.chooseCard().set("prompt", get.prompt("lanshengmrfz")).set("prompt2", `你可以重铸至多${suits.size}张牌，若包含了与获得过的“神赐”牌相同牌名的牌，你摸一张牌`).set("filterCard", (card) => {
          if (get.event().shenciCard.has(get.name(card))) {
            let info = ui.create.div(".promptSJZX", card);
            info.classList.add("promptCardSJZX");
            info.innerHTML = `可摸牌`;
          }
          return true;
        }).set("ai", (card) => {
          let names = get.event().shenciCard;
          return 6 - get.value(card) + (names.has(get.name(card)) && !ui.selected.cards.map((i) => get.name(i)).includes(get.name(card)) ? 5 : 0);
        }).set("selectCard", [1, suits.size]).set(
          "shenciCard",
          new Set(
            game.getAllGlobalHistory("everything", (evt) => evt.name === "gain" && evt.gaintag.includes("shencimrfz")).map((evt) => evt.cards.map((i) => get.name(i))).flat()
          )
        ).forResult();
        player2.getCards("hes", (card) => {
          if (card.querySelector(".promptSJZX")) {
            card.querySelector(".promptSJZX")?.remove();
          }
        });
      },
      async content(event2, trigger2, player2) {
        let names = new Set(
          game.getAllGlobalHistory("everything", (evt) => evt.name === "gain" && evt.gaintag.includes("shencimrfz")).map((evt) => evt.cards.map((i) => get.name(i))).flat()
        );
        let { cards: cards2 } = event2;
        player2.recast(cards2, void 0, (player3, cards3) => {
          if (cards3.map((i) => get.name(i)).some((i) => names.has(i))) {
            player3.draw(cards3.length + 1);
          } else player3.draw(cards3.length);
        });
      }
    },
    //矿工游击队
    xunkaimrfz: {
      audio: 2,
      forced: true,
      derivation: ["xinjuejing", "weijing"],
      trigger: {
        player: ["dying", "enterGame"],
        global: "phaseBefore"
      },
      filter(event2, player2) {
        return event2.name !== "phase" || game.phaseNumber === 0;
      },
      firstDo: true,
      async content(event2, trigger2, player2) {
        if (player2.maxHp > 1) {
          let gains = ["xinjuejing", "weijing"].map((i) => `${i}_${get.randomNumberSJZX()}`);
          game.broadcastAll((skills) => {
            skills.forEach((skill) => {
              let original = skill.split("_")[0];
              let info = get.info(original);
              lib.skill[skill] = {
                ...info,
                audio: original,
                xunkaimrfz: true,
                onremove: true
              };
              lib.translate[skill] = lib.translate[original];
              lib.translate[`${skill}_info`] = lib.translate[`${original}_info`];
              if (original === "weijing") {
                lib.dynamicTranslate[skill] = (player3, skill2) => {
                  return player3.storage[skill2] ? "每轮限一次，当你需要使用基本牌时，你可以视为使用之" : lib.translate.weijing_info;
                };
                lib.skill[skill] = {
                  ...lib.skill[skill],
                  filter(event3, player3) {
                    if (event3.type === "wuxie" || player3.hasSkill(`${skill}_used`)) {
                      return false;
                    }
                    let names = player3.storage[skill] ? lib.inpile.filter((i) => get.type(i) === "basic") : ["sha", "shan"];
                    for (var name of names) {
                      if (event3.filterCard({ name, isCard: true }, player3, event3)) {
                        return true;
                      }
                    }
                    return false;
                  },
                  hiddenCard(player3, name) {
                    let names = player3.storage[skill] ? lib.inpile.filter((i) => get.type(i) === "basic") : ["sha", "shan"];
                    return names.includes(name) && !player3.hasSkill(`${skill}_used`);
                  },
                  chooseButton: {
                    ...lib.skill[skill].chooseButton,
                    // @ts-ignore
                    backup: function(links, player3) {
                      return {
                        audio: "weijing",
                        viewAs: {
                          name: links[0][2]
                        },
                        filterCard: () => false,
                        selectCard: -1,
                        position: "hes",
                        popname: true,
                        check(card) {
                          return 6 / Math.max(1, get.value(card));
                        },
                        // @ts-ignore
                        async precontent(event3, trigger3, player4) {
                          player4.addTempSkill(`${skill}_used`, "roundEnd");
                        }
                      };
                    },
                    dialog(event3, player3) {
                      let names = player3.storage[skill] ? lib.inpile.filter((i) => get.type(i) === "basic") : ["sha", "shan"];
                      var vcards = [];
                      for (var name of names) {
                        var card = { name, isCard: true };
                        if (event3.filterCard(card, player3, event3)) {
                          vcards.push(["基本", "", name]);
                        }
                      }
                      var dialog = ui.create.dialog("卫境", [vcards, "vcard"], "hidden");
                      dialog.direct = true;
                      return dialog;
                    }
                  }
                };
              }
            });
          }, gains);
          await player2.addSkills(gains);
          await player2.loseMaxHp();
          player2.recoverTo(1);
        } else {
          let skills = player2.getSkills().filter((skill2) => {
            let info = get.info(skill2);
            return info && info.xunkaimrfz && skill2.startsWith("weijing");
          });
          if (skills.length < 1) return;
          let skill = skills.randomGet();
          player2.storage[skill] = true;
        }
      }
    },
    // 可露希尔
    jingxiangmrfz: {
      audio: 2,
      filter: function(event2, player2) {
        return false;
      },
      trigger: { player: "pointless" },
      //免得十周年ui技能溢出屏幕,这是一个无意义的时机
      viewAs: {
        name: "sha",
        isCard: true
      },
      limited: true,
      mark: false,
      filterCard: () => false,
      selectCard: -1,
      replaced: false,
      usedSJZX: false,
      async precontent(event2, trigger2, player2) {
        let name = event2.name.replace("pre_", "");
        player2.awakenSkill(name);
        lib.skill[name].usedSJZX = true;
      }
    },
    fuzhimrfz: {
      audio: 2,
      trigger: {
        target: "useCardToTargeted"
      },
      filter(event2, player2) {
        let skills = player2.getSkills().filter((skill) => {
          if (!skill.startsWith("jingxiangmrfz")) return false;
          let info = get.info(skill);
          return !info.replaced;
        });
        return skills.length > 0 && get.type(event2.card) !== "delay" && get.type(event2.card) !== "equip";
      },
      prompt(event2) {
        return `是否将一个“镜像”中的‘undefined’替换为‘${get.translation(event2.card.name)}’?`;
      },
      check(event2, player2) {
        let skills = player2.getSkills().filter((skill) => {
          if (!skill.startsWith("jingxiangmrfz")) return false;
          let info = get.info(skill);
          return info.replaced && !info.usedSJZX;
        });
        let calculate = {};
        skills.forEach((skill) => {
          let info = get.info(skill);
          let viewName = info.viewAs.name;
          if (!calculate[viewName]) calculate[viewName] = 0;
          calculate[viewName]++;
        });
        return calculate[event2.card.name] < (get.value(event2.card) >= 6 ? 4 : 3);
      },
      async content(event2, trigger2, player2) {
        let name = player2.getSkills().filter((skill) => {
          if (!skill.startsWith("jingxiangmrfz")) return false;
          let info2 = get.info(skill);
          return !info2.replaced;
        })[0];
        const info = get.info(name);
        info.enable = "chooseToUse";
        info.trigger = void 0;
        info.replaced = true;
        info.audio = "jingxiangmrfz";
        info.viewAs = {
          // @ts-ignore
          ...info.viewAs,
          name: trigger2.card.name,
          nature: trigger2.card.nature
        };
        info.filter = () => true;
        let cardname = (get.translation(trigger2.card.nature) ? get.translation(trigger2.card.nature) : "") + get.translation(trigger2.card.name);
        lib.translate[name] = lib.translate[name] + cardname.slice(0, 2);
        lib.translate[name + "_info"] = lib.translate[name + "_info"].replace("undefined", cardname);
      }
    },
    kuorongmrfz: {
      audio: 2,
      forced: true,
      derivation: ["jingxiangmrfz", "clanzhongliu"],
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      async content(event2, trigger2, player2) {
        for (let i = 0; i < 15; i++) {
          let name = "jingxiangmrfz" + i;
          let info = {
            ...lib.skill.jingxiangmrfz
          };
          lib.skill[name] = info;
          lib.translate[name] = lib.translate["jingxiangmrfz"];
          lib.translate[name + "_info"] = lib.translate["jingxiangmrfz_info"];
          player2.addSkill(name);
        }
        let random = Math.random();
        if (random >= 0.95 || lib.config.lucky_star) {
          player2.addSkill("clanzhongliu");
          let info = get.info("clanzhongliu");
          if (!info.audioname2) info.audioname2 = {};
          info.audioname2["keluxiermrfz"] = "clanzhongliu_keluxiermrfz";
          player2.addSkill("kuorongmrfz_reset");
        }
      },
      subSkill: {
        reset: {
          charlotte: true,
          silent: true,
          trigger: {
            player: "clanzhongliuAfter"
          },
          async content(event2, trigger2, player2) {
            let skills = player2.awakenedSkills.filter((skill) => {
              return skill.startsWith("jingxiangmrfz");
            });
            skills.forEach((skill) => {
              if (player2.awakenedSkills && player2.awakenedSkills.includes(skill)) {
                game.log(player2, "重置了技能", `#g【${get.translation(skill)}】`);
                player2.awakenedSkills.remove(skill);
              }
              if (player2.disabledSkills) {
                for (let key in player2.disabledSkills) {
                  if (key === skill) delete player2.disabledSkills[key];
                }
              }
              lib.skill[skill].usedSJZX = false;
            });
          }
        }
      }
    },
    clanzhongliu_keluxiermrfz: {
      //仅用作配音
      audio: 2
    },
    //Ace
    sizhanmrfz: {
      audio: 2,
      trigger: { player: "die" },
      forced: true,
      forceDie: true,
      unique: true,
      mark: true,
      limited: true,
      skillAnimation: true,
      animationStr: "死战",
      animationColor: "fire",
      init: function(player2) {
        player2.storage.sizhanmrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.sizhanmrfz;
      },
      async content(event2, trigger2, player2) {
        const targets = game.filterPlayer(function(current) {
          return current != player2 && current.isZhu;
        });
        if (targets.length > 0) {
          player2.awakenSkill("sizhanmrfz");
          targets.forEach((target) => {
            target.addSkill("sizhanmrfz2");
            player2.storage.sizhanmrfz = true;
          });
        }
      }
    },
    sizhanmrfz2: {
      trigger: { player: "phaseEnd" },
      forced: true,
      direct: true,
      content: function() {
        for (var i = 0; i < game.dead.length && game.dead[i].name != "acemrfz"; i++) ;
        var dead = game.dead[i];
        dead.revive(dead.maxHp);
        event.dead = dead;
        player.removeSkill("sizhanmrfz2");
        dead.insertPhase();
        dead.addSkill("sizhanmrfz3");
        dead.chat("快走，我来断后！");
      }
    },
    sizhanmrfz3: {
      trigger: { player: "phaseEnd" },
      forced: true,
      content: function() {
        player.die()._triggered = null;
      },
      group: ["sizhanmrfz3_draw", "sizhanmrfz3_damage", "sizhanmrfz3_sha"],
      subSkill: {
        draw: {
          trigger: { player: "phaseDrawBegin2" },
          forced: true,
          content: function() {
            trigger.num += Math.min(game.roundNumber, 5);
          }
        },
        damage: {
          trigger: { source: "damageBegin" },
          forced: true,
          content: function() {
            trigger.num++;
          }
        },
        sha: {
          mod: {
            // @ts-ignore
            targetInRange: function(card, player2, target, now) {
              if (card.name == "sha") return true;
            },
            // @ts-ignore
            cardname: function(card, player2) {
              if (["basic"].includes(lib.card[card.name].type)) return "sha";
            }
          }
        }
      }
    },
    guanyongmrfz: {
      shaRelated: true,
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.getParent().name != "useCard" || player2 != _status.currentPhase) return false;
        return event2.card.name == "sha" && event2.target.countDiscardableCards(player2, "he") > 0;
      },
      preHidden: true,
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) <= 0;
      },
      logTarget: "target",
      async content(event2, trigger2, player2) {
        const result = await player2.discardPlayerCard(trigger2.target, get.prompt("guanyongmrfz", trigger2.target), true).set("att", get.attitude(player2, trigger2.target) <= 0).forResult();
        if (result.bool && result.links && result.links.length) {
          if (get.type(result.links[0], null, result.links[0].original == "h" ? player2 : false) == "basic") {
            trigger2.getParent().directHit.add(trigger2.target);
          } else {
            player2.draw(2);
            player2.addTempSkill("guanyongmrfz2");
            if (player2.countMark("guanyongmrfz2") < 2 || player2.storage.sizhanmrfz) {
              player2.addMark("guanyongmrfz2", 1, false);
            }
          }
        }
      },
      ai: {
        unequip_ai: true,
        directHit_ai: true,
        // @ts-ignore
        skillTagFilter: function(player2, tag, arg) {
          if (tag == "directHit_ai")
            return arg.card.name == "sha" && arg.target.countCards("e", function(card) {
              return get.value(card) > 1;
            }) > 0;
          if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
          return false;
        }
      }
    },
    guanyongmrfz2: {
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num + player2.countMark("guanyongmrfz2");
        }
      },
      onremove: true
    },
    //克丽斯腾莱特 总辖
    xingtumrfz: {
      mark: true,
      intro: {
        // @ts-ignore
        content: function(event2, player2) {
          var show = {
            handlit: [],
            draw: [],
            sha: [],
            recover: []
          };
          for (var i = 0; i < game.players.length; i++) {
            var player2 = game.players[i];
            if (!player2.storage.xingtumrfz) continue;
            if (player2.storage.xingtumrfz.includes("手牌上限+1")) {
              show.handlit.push(player2);
            }
            if (player2.storage.xingtumrfz.includes("额定摸牌数+1")) {
              show.draw.push(player2);
            }
            if (player2.storage.xingtumrfz.includes("使用【杀】的次数+1")) {
              show.sha.push(player2);
            }
            if (player2.storage.xingtumrfz.includes("将手牌和体力值补至体力上限")) {
              show.recover.push(player2);
            }
          }
          return "【星途】已选择选项的角色</br>手牌上限:" + get.translation(show.handlit) + "</br>额定摸牌:" + get.translation(show.draw) + "</br>使用【杀】:" + get.translation(show.sha) + "</br>补牌和体力:" + get.translation(show.recover);
        }
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      // @ts-ignore
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      selectTarget: [0, 2],
      // @ts-ignore
      filterTarget: function(card, player2, target) {
        return target != player2 && target.countCards("he") > 0;
      },
      multitarget: true,
      multiline: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        var cardx;
        const targets = event2.targets.add(player2);
        const cards2 = [];
        for (var i of targets) {
          const result = await i.chooseCard("【星途】:你可以重铸一张牌", "he", lib.filter.cardRecastable).set("ai", function(card) {
            return 8 - get.value(card);
          }).forResult();
          if (result.cards) {
            if (i != player2) {
              cards2.push(result.cards[0]);
            } else {
              cardx = result.cards[0];
            }
            i.recast(result.cards);
          }
        }
        if (targets.length > 1 && cards2.filter((q) => get.color(q) == get.color(cardx)).length >= cards2.length / 2) {
          for (var targety of targets) {
            var list = [], compare = ["手牌上限+1", "额定摸牌数+1", "使用【杀】的次数+1", "将手牌和体力值补至体力上限"];
            if (!targety.storage.xingtumrfz) targety.storage.xingtumrfz = [];
            for (var i of compare) {
              if (!targety.storage.xingtumrfz.includes(i)) {
                list.push(i);
              }
            }
            if (list.length) {
              const result1 = await targety.chooseControl(list).set("prompt", "【星途】:请选择一项").set("ai", () => {
                if (list.includes("将手牌和体力值补至体力上限") && targety.getDamagedHp() * 2 + targety.getHandcardLimit() - targety.countCards("h") >= 5) {
                  return "将手牌和体力值补至体力上限";
                }
                if (list.includes("额定摸牌数+1")) return "额定摸牌数+1";
                return ["手牌上限+1", "使用【杀】的次数+1"].randomGet();
              }).forResult();
              if (result1.control) {
                targety.storage.xingtumrfz.add(result1.control);
                game.log(targety, "选择了", result1.control);
                if (result1.control == "手牌上限+1") targety.addSkill("xingtumrfz_handlit");
                if (result1.control == "使用【杀】的次数+1") targety.addSkill("xingtumrfz_sha");
                if (result1.control == "额定摸牌数+1") targety.addSkill("xingtumrfz_draw");
                if (result1.control == "将手牌和体力值补至体力上限") {
                  targety.drawTo(targety.maxHp);
                  targety.recoverTo(targety.maxHp);
                }
              }
            }
          }
        }
      },
      subSkill: {
        handlit: {
          charlotte: true,
          mod: {
            // @ts-ignore
            maxHandcard: function(player2, num) {
              return num + 1;
            }
          }
        },
        draw: {
          charlotte: true,
          forced: true,
          lastDo: true,
          trigger: { player: "phaseDrawBegin2" },
          content: function() {
            trigger.num++;
          }
        },
        sha: {
          charlotte: true,
          mod: {
            // @ts-ignore
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + 1;
            }
          }
        }
      },
      ai: {
        order: 13,
        expose: 0.1,
        result: {
          player: 1,
          target: 1
        }
      }
    },
    poqiongmrfz: {
      audio: 2,
      derivation: ["xingyoumrfz", "jiexiangmrfz"],
      enable: "phaseUse",
      limited: true,
      skillAnimation: "epic",
      animationColor: "thunder",
      mark: true,
      intro: {
        content: "limited"
      },
      init: (player2, skill) => player2.storage[skill] = false,
      // @ts-ignore
      filter: function(event2, player2) {
        return player2.storage.poqiongmrfz == false;
      },
      async content(event2, trigger2, player2) {
        let result;
        event2.lose = 0;
        event2.num = 0;
        event2.showed = [];
        event2.pd = [];
        player2.storage.poqiongmrfz = true;
        while (event2.num < 6) {
          result = await player2.chooseCard("he", (card) => {
            return !event2.showed.includes(card);
          }).forResult();
          if (result.cards && result.cards.length) {
            const cards1 = game.cardsGotoOrdering(get.cards(1)).cards;
            const cards2 = result.cards[0];
            player2.showCards(cards2, get.translation(player2) + "展示的牌</br>点数为:" + cards2.number);
            player2.showCards(cards1, "牌堆顶的牌</br>点数为:" + cards1[0].number);
            event2.showed.push(cards2);
            event2.pd.push(cards1[0]);
            if (cards1?.[0].number > cards2.number) {
              player2.loseMaxHp();
              event2.lose++;
              player2.popup("失败：" + event2.lose);
            }
            game.cardsDiscard(cards1);
          } else {
            const cards1 = game.cardsGotoOrdering(get.cards(1)).cards;
            player2.showCards(cards1, "牌堆顶的牌</br>点数为:" + cards1[0].number);
            game.cardsDiscard(cards1);
            player2.loseMaxHp();
            event2.lose++;
          }
          event2.num++;
        }
        if (event2.lose < 3) {
          let num = Math.random();
          if (get.isLuckyStar(player2)) num = 0.1;
          if (num < 0.2 && lib.config.FTLmrfz !== true) {
            ui.backgroundMusic.src = lib.assetURL + "extension/WhichWay/audio/BGM/fasterthanlight.mp3";
          }
          player2.removeSkill("xingtumrfz");
          player2.addSkill("xingyoumrfz");
          player2.addSkill("jiexiangmrfz");
          player2.gainMaxHp(3);
          player2.recoverTo(player2.maxHp);
          await player2.gain(event2.pd, "gain2");
        } else {
          player2.popup("失败");
        }
      },
      ai: {
        order: 12,
        result: {
          // @ts-ignore
          player: function(player2, target, card) {
            var cards2 = player2.getCards("he"), num = 0;
            for (var i = 0; i < cards2.length; i++) {
              num += cards2[i].number;
            }
            if (player2.storage.xingtumrfz == void 0) return -1;
            if (player2.storage.xingtumrfz.length < 3) return -1;
            return num - 42;
          }
        }
      }
    },
    xingyoumrfz: {
      intro: {
        content: "[其他角色/你]计算与[你/其他角色]的距离+#"
      },
      audio: 2,
      enable: "phaseUse",
      // @ts-ignore
      filter: function(event2, player2) {
        return player2.countCards("he", function(card) {
          for (var i = 0; i < player2.storage.xingyoumrfz.length; i++) {
            var storage = player2.storage.xingyoumrfz[i];
            if (get.suit(card) == storage) return false;
          }
          return true;
        }) > 0;
      },
      selectCard: 1,
      filterCard: function(card) {
        var player2 = _status.event.player;
        for (var i = 0; i < player2.storage.xingyoumrfz.length; i++) {
          var storage = player2.storage.xingyoumrfz[i];
          if (get.suit(card) == storage) return false;
        }
        return true;
      },
      check: function(card) {
        return 8 - get.value(card);
      },
      init: (player2, skill) => player2.storage[skill] = [],
      content: function() {
        player.recast(cards[0]);
        player.storage.xingyoumrfz.add(cards[0].suit);
      },
      group: ["xingyoumrfz_del", "xingyoumrfz_dis"],
      subSkill: {
        del: {
          charlotte: true,
          forced: true,
          silent: true,
          lastDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.xingyoumrfz = [];
          }
        },
        dis: {
          charlotte: true,
          forced: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.addMark("xingyoumrfz_dis", 1, false);
            if (game.countPlayer(function(current) {
              return current != player2 && player2.inRange(current);
            }) == 0) {
              player2.loseMaxHp();
            }
          },
          mod: {
            // @ts-ignore
            globalTo: function(from, to, distance) {
              return distance += to.countMark("xingyoumrfz_dis");
            },
            // @ts-ignore
            globalFrom: function(from, to, distance) {
              return distance += from.countMark("xingyoumrfz_dis");
            }
          }
        }
      },
      ai: {
        order: 6
      }
    },
    jiexiangmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "die" },
      forceDie: true,
      async content(event2, trigger2, player2) {
        let result;
        const targets = game.filterPlayer().remove(player2);
        event2.targets = targets;
        await player2.draw(Math.max(event2.targets.length + 1, player2.recastCount()));
        while (event2.targets.length) {
          const num = player2.countCards("he") - event2.targets.length;
          result = await player2.chooseCard("【揭相】:请选择至少一张牌将其分配给" + get.translation(event2.targets[0]), [1, num + 1], "he").set("forced", true).forResult();
          if (result.cards && result.cards.length) {
            const target = event2.targets[0];
            await target.gain(result.cards, "gain2");
          }
          event2.targets.shift();
        }
        for (const current of game.players) {
          if (current !== player2) {
            current.gainMaxHp();
            current.recover();
          }
        }
        if (game.hasPlayer((current) => {
          return current !== player2 && current.name === "baocunzhemrfz";
        })) {
          const audio = new Audio("extension/WhichWay/audio/CN/caidankelisitengmrfz.mp3");
          audio.play();
        }
      }
    },
    //保存者 弗里斯顿
    shouwangmrfz: {
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      unique: true,
      // @ts-ignore
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      async content(event2, trigger2, player2) {
        const result = await player2.chooseTarget(true, "【守望】:请选择一名其他角色", function(card, player3, target) {
          return target != player3;
        }).set("ai", (target) => get.attitude(player2, target) > 0).forResult();
        if (result.targets) {
          result.targets[0].addSkill("shouwangmrfz2");
        }
      },
      group: ["shouwangmrfz_die", "shouwangmrfz_recover", "shouwangmrfz_draw"],
      subSkill: {
        die: {
          direct: true,
          charlotte: true,
          trigger: { global: "dieBegin" },
          firstDo: true,
          filter: function(event2, player2) {
            return event2.player.hasSkill("shouwangmrfz2");
          },
          async content(event2, trigger2, player2) {
            player2.loseMaxHp(player2.maxHp);
            player2.logSkill("shouwangmrfz");
          }
        },
        recover: {
          direct: true,
          charlotte: true,
          trigger: { player: "dying" },
          async content(event2, trigger2, player2) {
            player2.recoverTo(1);
            player2.logSkill("shouwangmrfz");
          }
        },
        draw: {
          audio: 2,
          trigger: { player: "drawAfter" },
          // @ts-ignore
          filter: function(event2, player2) {
            return event2.getParent().name != "shouwangmrfz2";
          },
          // @ts-ignore
          check: function(event2, player2) {
            var target = game.findPlayer(function(current) {
              return current.hasSkill("shouwangmrfz2");
            });
            return get.attitude(player2, target) > 0;
          },
          // @ts-ignore
          prompt: function(event2, player2) {
            var target = game.findPlayer(function(current) {
              return current.hasSkill("shouwangmrfz2");
            });
            return "是否令" + get.translation(target) + "摸一张牌？";
          },
          async content(event2, trigger2, player2) {
            player2.logSkill("shouwangmrfz");
            game.countPlayer(function(current) {
              if (current.hasSkill("shouwangmrfz2")) current.draw();
            });
          }
        }
      },
      ai: {
        effect: {
          // @ts-ignore
          target(card, player2, target, current) {
            if (get.type(card) == "trick" || card.name == "sha") return "zeroplayertarget";
          }
        }
      }
    },
    shouwangmrfz2: {
      mark: true,
      intro: {
        content: "文明的消亡"
      },
      trigger: { player: "drawAfter" },
      // @ts-ignore
      filter: function(event2, player2) {
        return event2.getParent().name != "shouwangmrfz_draw";
      },
      // @ts-ignore
      prompt: function(event2, player2) {
        var target = game.findPlayer(function(current) {
          return current.hasSkill("shouwangmrfz");
        });
        return "是否令" + get.translation(target) + "摸一张牌？";
      },
      // @ts-ignore
      check: function(event2, player2) {
        var target = game.findPlayer(function(current) {
          return current.hasSkill("shouwangmrfz");
        });
        return get.attitude(player2, target) > 0;
      },
      content: function() {
        player.logSkill("shouwangmrfz");
        game.countPlayer(function(current) {
          if (current.hasSkill("shouwangmrfz")) current.draw();
        });
      }
    },
    xijimrfz: {
      audio: 2,
      trigger: { player: "dieBegin" },
      filter: function(event2, player2) {
        return player2.countCards("hej") > 0;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const result = await player2.chooseTarget("【希冀】:你可以将你区域内所有的牌交给一名其他角色", function(card, player3, target2) {
          return target2 != player3;
        }).set("ai", (target2) => get.attitude(player2, target2) > 2 && target2.hp > 0).forResult();
        if (result.targets) {
          var hej = player2.getCards("hej"), target = result.targets[0];
          player2.give(hej, target);
          player2.logSkill("xijimrfz", target);
          target.addSkill("xijimrfz_eff");
          target.addMark("xijimrfz_eff", hej.length, false);
        }
      },
      group: "xijimrfz_die",
      subSkill: {
        die: {
          audio: "xijimrfz",
          enable: "phaseUse",
          filter: function(event2, player2) {
            return player2.maxHp <= 5;
          },
          async content(event2, trigger2, player2) {
            const result = await player2.chooseBool("【希冀】:是否失去所有体力上限？").forResult();
            if (result.bool) {
              var num = Math.floor(player2.maxHp / 2);
              player2.draw(Math.min(3, num > 1 ? num : 1));
              player2.loseMaxHp(player2.maxHp);
            }
          }
        },
        eff: {
          charlotte: true,
          intro: {
            content: "攻击距离、使用【杀】的次数+#"
          },
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("xijimrfz_eff");
            },
            attackRange: function(player2, num) {
              return num + player2.countMark("xijimrfz_eff");
            }
          },
          trigger: { player: "phaseEnd" },
          silent: true,
          content: function() {
            player.removeMark("xijimrfz_eff", player.countMark("xijimrfz_eff"), false);
            player.removeSkill("xijimrfz_eff");
          }
        }
      }
    },
    jingmomrfz: {
      audio: 2,
      forced: true,
      trigger: { global: "roundStart" },
      content: function() {
        player.loseMaxHp();
      },
      mod: {
        // @ts-ignore
        maxHandcardBase: function(player2, num) {
          return 5;
        }
      }
    },
    //伊祖米克 水月
    chanshimrfz: {
      audio: false,
      trigger: {
        source: "damageEnd",
        global: "roundStart"
      },
      // @ts-ignore
      filter: function(event2, player2) {
        return !player2.hasSkill("chanshimrfz_ban");
      },
      async content(event2, trigger2, player2) {
        player2.addTempSkill("chanshimrfz_ban", "phaseEnd");
        let list;
        if (_status.characterlist) {
          list = [];
          for (let i = 0; i < _status.characterlist.length; i++) {
            const name = _status.characterlist[i];
            list.push(name);
          }
        } else if (_status.connectMode) {
          list = get.charactersOL();
        } else {
          list = get.gainableCharacters();
        }
        const players = game.players.concat(game.dead);
        for (let i = 0; i < players.length; i++) {
          list.remove(players[i].name);
          list.remove(players[i].name1);
          list.remove(players[i].name2);
        }
        list = list.randomGets(2);
        const skills = [];
        for (const char of list) {
          skills.addArray(lib.character[char][3]);
        }
        if (!list.length || !skills.length) {
          return;
        }
        if (player2.isUnderControl()) {
          game.swapPlayerAuto(player2);
        }
        const switchToAuto = function() {
          _status.imchoosing = false;
          event2._result = {
            bool: true,
            skills: skills.randomGets(1)
          };
          if (event2.dialog) event2.dialog.close();
          if (event2.control) event2.control.close();
        };
        const chooseButton = function(list2, skills2) {
          const event3 = _status.event;
          if (!event3._result) event3._result = {};
          event3._result.skills = [];
          const rSkill = event3._result.skills;
          const dialog = ui.create.dialog("请获得一个技能", [list2, "character"], "hidden");
          event3.dialog = dialog;
          const table = document.createElement("div");
          table.classList.add("add-setting");
          table.style.margin = "0";
          table.style.width = "100%";
          table.style.position = "relative";
          for (let i = 0; i < skills2.length; i++) {
            const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.link = skills2[i];
            table.appendChild(td);
            td.innerHTML = "<span>" + get.translation(skills2[i]) + "</span>";
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged) return;
              if (_status.justdragged) return;
              _status.tempNoButton = true;
              setTimeout(function() {
                _status.tempNoButton = false;
              }, 500);
              const link = this.link;
              if (!this.classList.contains("bluebg")) {
                if (rSkill.length >= 1) return;
                rSkill.add(link);
                this.classList.add("bluebg");
              } else {
                this.classList.remove("bluebg");
                rSkill.remove(link);
              }
            });
          }
          dialog.content.appendChild(table);
          dialog.add("  ");
          dialog.open();
          event3.switchToAuto = function() {
            event3.dialog.close();
            event3.control.close();
            game.resume();
            _status.imchoosing = false;
          };
          event3.control = ui.create.control("ok", function(link) {
            event3.dialog.close();
            event3.control.close();
            game.resume();
            _status.imchoosing = false;
          });
          for (let i = 0; i < event3.dialog.buttons.length; i++) {
            event3.dialog.buttons[i].classList.add("selectable");
          }
          game.pause();
          game.countChoose();
        };
        if (event2.isMine()) {
          chooseButton(list, skills);
        } else if (event2.isOnline()) {
          event2.player.send(chooseButton, list, skills);
          event2.player.wait();
          game.pause();
        } else {
          switchToAuto();
        }
        const map = event2.result || event2._result;
        if (map && map.skills && map.skills.length) {
          for (const skill of map.skills) {
            player2.addSkillLog(skill);
          }
        }
        game.broadcastAll(function(list2) {
          game.expandSkills(list2);
          for (const skill of list2) {
            const info = lib.skill[skill];
            if (!info) continue;
            if (!info.audioname2) info.audioname2 = {};
            info.audioname2.old_yuanshu = "weidi";
          }
        }, map.skills);
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //爱国者
    xinjunxingmrfz: {
      audio: 2,
      direct: true,
      locked: true,
      derivation: ["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"],
      trigger: {
        player: ["phaseChange", "drawAfter", "loseAfter"]
      },
      filter: function(event2, player2) {
        if (event2.name === "draw") return event2.num > 0;
        else if (event2.name === "lose") return event2.type == "discard";
        else if (event2.name === "phase")
          return !player2.storage.xinjunxingmrfz || !player2.storage.xinjunxingmrfz.isSubset(player2.getSkills(null, false, false));
        return false;
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        if (!Array.isArray(player2.storage.xinjunxingmrfz)) player2.storage.xinjunxingmrfz = [];
        if (trigger2.name === "draw") {
          player2.storage.xinjunxingmrfz = ["sptunjiang", "reqiaobian"];
        } else if (trigger2.name === "lose") {
          player2.storage.xinjunxingmrfz = ["xinlvli", "rezhanjue"];
        } else {
          await player2.removeSkill(["sptunjiang", "reqiaobian", "xinlvli", "rezhanjue"]);
          player2.addSkill(player2.storage.xinjunxingmrfz);
          player2.logSkill("xinjunxingmrfz");
        }
      }
    },
    youjimrfz: {
      //audio:2,
      onremove: true,
      forced: true,
      init: function(player2) {
        player2.storage.youjimrfz = [];
      },
      trigger: {
        player: "phaseBegin"
      },
      async content(event2, trigger2, player2) {
        if (player2.isUnderControl()) {
          game.swapPlayerAuto(player2);
        }
        const chooseButton = function(phases) {
          const event3 = _status.event;
          if (!event3._result) event3._result = {};
          event3._result.phases = [];
          event3._result.phases2 = [];
          const endphases = event3._result.phases;
          event3._result.phases2;
          const dialog = ui.create.dialog("【游击】:你可以掉换执行阶段的顺序</br>执行顺序为由左到右依次执行", "hidden");
          event3.dialog = dialog;
          const table = document.createElement("div");
          table.classList.add("add-setting");
          table.style.margin = "0";
          table.style.width = "100%";
          table.style.position = "relative";
          const tdList = [];
          const clickHandler = function() {
            if (_status.dragged) return;
            if (_status.justdragged) return;
            _status.tempNoButton = true;
            setTimeout(function() {
              _status.tempNoButton = false;
            }, 500);
            const link = this.link;
            if (!this.classList.contains("bluebg")) {
              if (endphases.length >= 2) return;
              endphases.push(link);
              this.classList.add("bluebg");
            } else {
              this.classList.remove("bluebg");
              endphases.splice(endphases.indexOf(link), 1);
            }
            for (let i = 0; i < tdList.length; i++) {
              if (tdList[i] !== this) {
                tdList[i].classList.remove("bluebg");
              }
            }
            if (endphases.length === 2) {
              const index1 = phases.indexOf(endphases[0]);
              const index2 = phases.indexOf(endphases[1]);
              if (index1 >= 0 && index2 >= 0 && index1 < tdList.length && index2 < tdList.length) {
                const tempNode = tdList[index1];
                const tempNode2 = tdList[index2];
                const tempLink = tempNode.link;
                phases.indexOf(tempNode.link);
                tempNode.link = tempNode2.link;
                tempNode.innerHTML = "<span>" + get.tranPhase(tempNode2.link) + "</span>";
                tempNode2.link = tempLink;
                tempNode2.innerHTML = "<span>" + get.tranPhase(tempLink) + "</span>";
                phases[index1] = tempNode.link;
                phases[index2] = tempNode2.link;
                tempNode.classList.remove("bluebg");
                tempNode2.classList.remove("bluebg");
                event3._result.phases2 = phases;
                event3._result.phases.length = 0;
              }
            }
          };
          for (let i = 0; i < phases.length; i++) {
            const td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.link = phases[i];
            table.appendChild(td);
            td.innerHTML = "<span>" + get.tranPhase(phases[i]) + "</span>";
            tdList.push(td);
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", clickHandler);
          }
          dialog.content.appendChild(table);
          dialog.add("  ");
          dialog.open();
          event3.switchToAuto = function() {
            event3.dialog.close();
            event3.control.close();
            game.resume();
            _status.imchoosing = false;
          };
          event3.control = ui.create.control("ok", function(link) {
            event3.dialog.close();
            event3.control.close();
            game.resume();
            _status.imchoosing = false;
          });
          for (let i = 0; i < event3.dialog.buttons.length; i++) {
            event3.dialog.buttons[i].classList.add("selectable");
          }
          game.pause();
        };
        const switchToAuto = function() {
          _status.imchoosing = false;
          event2._result = {
            bool: true,
            phases2: ["phaseUse", "phaseDraw", "phaseDiscard", "phaseZhunbei", "phaseJieshu", "phaseJudge"]
          };
          if (event2.dialog) event2.dialog.close();
          if (event2.control) event2.control.close();
        };
        if (event2.isMine()) {
          chooseButton(trigger2.phaseList);
        } else if (event2.isOnline()) {
          event2.player.send(chooseButton, trigger2.phaseList);
          event2.player.wait();
          game.pause();
        } else {
          switchToAuto();
        }
        const map = event2.result || event2._result;
        trigger2.phaseList = map.phases2.length ? map.phases2 : trigger2.phaseList;
        game.log(player2, "阶段执行顺序为", `#y${get.translation(trigger2.phaseList)}`);
      }
    },
    //斗士塔露拉
    juhuomrfz: {
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        if (player2.hasSkill("juhuomrfz_ban")) return false;
        return event2.card && get.tag(event2.card, "damage") > 0 && game.hasPlayer2((current) => {
          return current.hasHistory("damage", (evt) => {
            return event2.card == evt.card;
          });
        });
      },
      prompt2: function(event2, player2) {
        var num = player2.getHistory("sourceDamage", function(evt) {
          return evt.card == event2.card;
        }).length;
        var num2 = event2.card.number;
        return "【聚火】:是否增加" + num + "点体力上限（此牌点数<span class=firetext>" + (player2.hp < num2 ? "大于" : "不大于") + "</span>你的体力值）";
      },
      async content(event2, trigger2, player2) {
        var num = player2.getHistory("sourceDamage", function(evt) {
          return evt.card == trigger2.card;
        }).length;
        await player2.gainMaxHp(num);
        var num2 = trigger2.card.number;
        if (num2 > player2.hp) {
          player2.drawTo(player2.maxHp);
        } else {
          player2.loseMaxHp(player2.maxHp - num2);
          player2.recoverTo(player2.maxHp);
        }
        player2.addTempSkill("juhuomrfz_ban", { global: "phaseEnd" });
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    xuehengmrfz: {
      mode: ["identity"],
      forced: true,
      skillAnimation: true,
      animationColor: "thunder",
      unique: true,
      juexingji: true,
      derivation: ["shihunmrfz", "hantianmrfz"],
      trigger: { player: "phaseBegin" },
      // @ts-ignore
      filter: function(event2, player2) {
        return player2.maxHp > game.countPlayer();
      },
      async content(event2, trigger2, player2) {
        player2.awakenSkill("xuehengmrfz");
        await player2.removeSkill("juhuomrfz");
        var hasfriendDeath = function(player3, identity) {
          var bool = false;
          if (identity == "zhu") identity = "zhong";
          for (var i of game.players) {
            if (!game.dead.includes(i)) continue;
            if (identity == "zhu" && i.identity == "zhong") bool = true;
            if (identity == i.identity) bool = true;
          }
          return bool;
        };
        var dead = hasfriendDeath(player2, player2.identity);
        if (player2.countCards("h") > player2.hp && dead == false) {
          player2.addSkill("hantianmrfz");
        } else {
          player2.node.name.innerHTML = "塔露拉？";
          game.broadcastAll(function(player3, shown) {
            var identity = player3.identity;
            if (identity != "zhu") {
              player3.identity = "nei";
              if (player3 == game.me) {
                player3.setIdentity();
              }
            } else {
              for (var i of game.players) {
                if (player3 == i) continue;
                if (i.identity == "fan") continue;
                i.identity = "fan";
                i.setIdentity();
              }
            }
          }, player2);
          player2.addSkill("shihunmrfz");
        }
        player2.recoverTo(player2.maxHp);
      }
    },
    shihunmrfz: {
      mod: {
        // @ts-ignore
        cardUsable: function(card, player2, num) {
          return Infinity;
        }
      },
      forced: true,
      trigger: { player: "phaseZhunbeiBegin" },
      content: function() {
        for (var i of game.players) {
          player.line(i);
          i.damage(2, "fire");
        }
      },
      ai: {
        threaten: 3
      },
      group: ["shihunmrfz_onedamage", "shihunmrfz_draw"],
      subSkill: {
        draw: {
          forced: true,
          trigger: { player: "phaseJieshuBegin" },
          // @ts-ignore
          filter: function(event2, player2) {
            return game.dead.length > 0;
          },
          content: function() {
            player.draw(game.dead.length);
          },
          ai: {
            threaten: function() {
              return Math.max(game.dead.length, 1.5);
            }
          }
        },
        onedamage: {
          forced: true,
          trigger: { player: "damageBegin4" },
          // @ts-ignore
          filter: function(event2, player2) {
            return event2.num > 1;
          },
          content: function() {
            trigger.num = 1;
          }
        }
      }
    },
    hantianmrfz: {
      marktext: "志城",
      intro: {
        name: "志城",
        content: "众志成城"
      },
      trigger: { player: "phaseZhunbeiBegin" },
      // @ts-ignore
      filter: function(event2, player2) {
        return !game.hasPlayer((current) => {
          return current.hasMark("hantianmrfz");
        });
      },
      forced: true,
      async content(event2, trigger2, player2) {
        for (var i of game.players) {
          if (player2.identity == "nei" && i == player2) i.addMark("hantianmrfz");
          if (player2.identity == "zhu" && i.identity == "zhong" || player2.identity == "zhong" && i.identity == "zhu") {
            i.addMark("hantianmrfz");
          }
          if (player2.identity == i.identity) i.addMark("hantianmrfz");
        }
        var targets = game.filterPlayer((current) => {
          return current.hasMark("hantianmrfz");
        });
        var num = 0;
        for (let i2 = 0; i2 < targets.length; i2++) {
          var maxhp = targets[i2].maxHp;
          if (maxhp > num) num = maxhp;
        }
        for (var i of targets) {
          i.gainMaxHp(num - i.maxHp);
        }
        var targets = game.filterPlayer((current) => {
          return current.hasMark("hantianmrfz");
        });
        for (var i of targets) {
          i.recoverTo(player2.maxHp);
        }
      },
      group: ["hantianmrfz_sha"],
      subSkill: {
        ban: {
          charlotte: true
        },
        sha: {
          trigger: { global: "useCardAfter" },
          filter: function(event2, player2) {
            if (player2.hasSkill("hantianmrfz_ban") || event2.card.name != "sha" || !event2.targets.length) return false;
            if (event2.getParent(2).name == "hantianmrfz_sha") return false;
            if (!event2.player.hasMark("hantianmrfz")) return false;
            var list = game.filterPlayer((current) => {
              return current.hasMark("hantianmrfz");
            }), targets = event2.targets;
            for (var i of list) {
              for (var j of targets) {
                if (i == event2.player || !i.isIn()) continue;
                if (!i.canUse("sha", j, false)) continue;
                if (_status.connectMode && i.countCards("hs") > 0) return true;
                if (i.hasSha()) return true;
              }
            }
            return false;
          },
          forced: true,
          popup: false,
          charlotte: true,
          async content(event2, trigger2, player2) {
            let result;
            event2.sources = game.filterPlayer((current) => {
              return current.hasMark("hantianmrfz") && current !== trigger2.player;
            }).sortBySeat();
            event2.targets = trigger2.targets;
            while (event2.sources.length > 0) {
              const current = event2.sources.shift();
              const targets = [];
              event2.draw = current;
              for (const target of event2.targets) {
                if (!target.isIn()) continue;
                if (!current.canUse("sha", target, false)) continue;
                targets.push(target);
              }
              if (current.isIn() && (_status.connectMode || current.hasSha())) {
                result = await current.chooseToUse(
                  function(card, player3, event3) {
                    if (get.name(card) !== "sha") return false;
                    return lib.filter.filterCard.apply(this, arguments);
                  },
                  "【熯天】：是否对" + get.translation(targets) + "使用一张杀？"
                ).set("targetRequired", true).set("complexSelect", true).set("filterTarget", function(card, player3, target) {
                  if (!_status.event.sourcex.includes(target)) return false;
                  return lib.filter.targetEnabled.apply(this, arguments);
                }).set("sourcex", targets).set("logSkill", "hantianmrfz").set("addCount", false).forResult();
              }
              if (result?.bool) {
                await event2.draw.draw();
              }
            }
          }
        }
      }
    },
    //特蕾西娅
    bojimrfz: {
      init(player2, skill) {
        player2.storage[skill] = {
          color: null,
          players: []
        };
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      // @ts-ignore
      filter(event2, player2) {
        return player2.countCards("h") > 0;
      },
      // @ts-ignore
      filterTarget(card, player2, target) {
        return target.countCards("h") > 0;
      },
      selectTarget: -1,
      multitarget: true,
      multiline: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        var targets = event2.targets.slice(), cardsx = [];
        while (targets.length > 0) {
          var prompt = `【博济】:请展示一张手牌
                        ${player2 == targets[0] && player2.storage.bojimrfz.color != null ? "" : "<br>" + get.translation(player2) + "展示的牌的颜色为：" + get.translation(player2.storage.bojimrfz.color)}`;
          const { cards: cards2 } = await targets[0].chooseCard(true).set("prompt", prompt).set("ai", function(card) {
            var att = get.attitude(_status.event.player, _status.event.targetx), color = _status.event.color;
            if (_status.event.targetx == _status.event.player) return Math.random();
            else if (att > 0) {
              if (get.color(card) == color) return 10;
              else return 1;
            } else {
              if (get.color(card) == color) return 1;
              else return 10;
            }
          }).set("targetx", player2).set("color", player2.storage.bojimrfz.color).forResult();
          if (!cards2) return;
          cardsx.push(cards2[0]);
          if (targets[0] == player2) {
            player2.storage.bojimrfz.color = get.color(cards2[0]);
            player2.storage.bojimrfz.players.add(player2);
          } else if (get.color(cards2[0]) == player2.storage.bojimrfz.color) {
            player2.storage.bojimrfz.players.add(targets[0]);
            targets[0].popup("追随殿下");
          } else targets[0].popup("拒绝殿下");
          game.log(targets[0], "展示了", cards2);
          targets.shift();
        }
        event2.videoId = lib.status.videoId++;
        game.broadcastAll(
          // @ts-ignore
          function(targets2, cards2, id, player3) {
            var dialog = ui.create.dialog(
              get.translation(player3) + "发动了【博济】<br>" + get.translation(player3) + "展示牌的颜色为" + get.translation(player3.storage.bojimrfz.color),
              cards2
            );
            dialog.videoId = id;
            var getName = function(target) {
              if (target._tempTranslate) return target._tempTranslate;
              var name = target.name;
              if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
              return get.translation(name);
            };
            for (var i2 = 0; i2 < targets2.length; i2++) {
              var showstr = getName(targets2[i2]), color = get.color(cards2[i2]);
              switch (color) {
                case "red":
                  showstr = "<font color=#FF0000>" + showstr + "</font>";
                  break;
                case "black":
                  showstr = "<font color=#000000>" + showstr + "</font>";
                  break;
                default:
                  showstr = "<font color=#FFFAFA>" + showstr + "</font>";
                  break;
              }
              if (color == player3.storage.bojimrfz.color) showstr = showstr + "<font color=#00FF00>√</font>";
              else showstr = showstr + "×";
              dialog.buttons[i2].querySelector(".info").innerHTML = showstr;
            }
          },
          //@ts-ignore
          event2.targets,
          cardsx,
          //@ts-ignore
          event2.videoId,
          player2
        );
        for (var i of player2.storage.bojimrfz["players"]) {
          i.addSkill(["bojimrfz_mark", "bojimrfz_eff1"]);
          i.storage.bojimrfz_mark = player2;
        }
        player2.addTempSkill("bojimrfz_eff2", { player: "phaseUseBegin" });
        let { promise, resolve } = Promise.withResolvers();
        setTimeout(() => {
          game.broadcastAll("closeDialog", event2.videoId);
          resolve();
        }, 3e3);
        await promise;
      },
      ai: {
        order: 13,
        threaten: 2.3,
        result: {
          player: 1
        }
      },
      group: ["bojimrfz_clear"],
      subSkill: {
        mark: {
          mark: true,
          intro: {
            // @ts-ignore
            content(event2, player2) {
              var target = game.findPlayer((current) => {
                return current == player2.storage.bojimrfz_mark;
              });
              var storage = target.storage.bojimrfz.players.slice();
              storage.remove(target);
              if (storage.length == 0) return `<font color=#FFD700>${get.translation(target)}</font>孤身一人`;
              return `<font color=#FFD700>${get.translation(storage)}</font>追随着<font color=#FFD700>${get.translation(target)}</font>殿下`;
            }
          },
          onremove: true,
          charlotte: true,
          silent: true,
          firstDo: true,
          forceDie: true,
          trigger: {
            player: "die"
          },
          async content(event2, trigger2, player2) {
            var target = game.findPlayer((current) => {
              return current == player2.storage.bojimrfz_mark;
            });
            if (!target) return;
            target.storage.bojimrfz.players.remove(trigger2.player);
            player2.removeSkill("bojimrfz_mark");
          }
        },
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: ["phaseUseBegin", "die"] },
          forceDie: true,
          // @ts-ignore
          filter(event2, player2) {
            return player2.storage.bojimrfz["players"].length > 0;
          },
          async content(event2, trigger2, player2) {
            for (var i of player2.storage.bojimrfz["players"]) {
              i.removeSkill("bojimrfz_eff1");
              i.removeSkill("bojimrfz_group");
              i.removeSkill("bojimrfz_mark");
            }
            player2.storage.bojimrfz = {
              color: null,
              players: []
            };
          }
        },
        eff1: {
          silent: true,
          charlotte: true,
          trigger: {
            global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "bojimrfzAfter"]
          },
          // @ts-ignore
          filter(event2, player2) {
            return Boolean(player2.hasSkill("bojimrfz_mark") ^ player2.hasSkill("bojimrfz_group"));
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            if (player2.hasSkill("bojimrfz_mark")) {
              var cards2 = [], target = game.findPlayer((current) => {
                return current == player2.storage.bojimrfz_mark;
              });
              for (var i of target.storage.bojimrfz.players) {
                if (i.countCards("h") == 0) continue;
                if (i == player2) continue;
                for (var j of i.getCards("h")) cards2.push(j);
              }
              var cardsx = cards2.map((card) => {
                var cardx = ui.create.card();
                cardx.init(get.cardInfo(card));
                cardx._cardid = card.cardid;
                return cardx;
              });
              player2.directgains(cardsx, null, "bojimrfz");
              player2.addSkill("bojimrfz_group");
            } else player2.removeSkill("bojimrfz_group");
          }
        },
        group: {
          charlotte: true,
          group: ["bojimrfz_eff_use", "bojimrfz_eff_lose"],
          trigger: {
            global: ["addJudgeAfter", "gainAfter", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
          },
          forced: true,
          silent: true,
          // @ts-ignore
          filter: function(event2, player2) {
            if (event2.name == "gain") return event2.cards && event2.cards.length;
            var cards2 = event2.getd();
            return cards2.length;
          },
          onremove: function(player2) {
            var cards2 = player2.getCards("s", (card) => {
              return card.hasGaintag("bojimrfz");
            });
            if (player2.isOnline2()) {
              player2.send(
                function(cards3, player3) {
                  cards3.forEach((i) => i.delete());
                  if (player3 == game.me) ui.updatehl();
                },
                cards2,
                player2
              );
            }
            cards2.forEach((i) => i.delete());
            if (player2 == game.me) ui.updatehl();
          },
          content: function() {
            var cards2 = [];
            var idList = player.getCards("s", (card) => card.hasGaintag("bojimrfz")).map((i2) => i2._cardid);
            var target = game.findPlayer((current) => {
              return current == player.storage.bojimrfz_mark;
            });
            for (var i of target.storage.bojimrfz.players) {
              if (i.countCards("h") == 0) continue;
              if (i == player) continue;
              for (var j of i.getCards("h")) {
                if (idList.includes(j.cardid)) continue;
                cards2.push(j);
              }
            }
            var cards22 = cards2.map((card) => {
              var cardx = ui.create.card();
              cardx.init(get.cardInfo(card));
              cardx._cardid = card.cardid;
              return cardx;
            });
            player.directgains(cards22, null, "bojimrfz");
          }
        },
        eff_use: {
          trigger: {
            player: ["useCardBefore", "respondBefore"]
          },
          charlotte: true,
          forced: true,
          popup: false,
          firstDo: true,
          filter: function(event2, player2) {
            var cards2 = player2.getCards("s", (card) => card.hasGaintag("bojimrfz") && card._cardid);
            return event2.cards && event2.cards.some((card) => {
              return cards2.includes(card);
            });
          },
          content: function() {
            var idList = player.getCards("s", (card2) => card2.hasGaintag("bojimrfz")).map((i2) => i2._cardid);
            var cards2 = [];
            var target = game.findPlayer((current) => {
              return current == player.storage.bojimrfz_mark;
            });
            for (var i of target.storage.bojimrfz.players) {
              if (i.countCards("h") == 0) continue;
              if (i == player) continue;
              for (var j of i.getCards("h")) {
                if (!idList.includes(j.cardid)) continue;
                cards2.push(j);
              }
            }
            var cards22 = [];
            for (var card of trigger.cards) {
              var cardx = cards2.find((cardx2) => cardx2.cardid == card._cardid);
              if (cardx) cards22.push(cardx);
            }
            var cards3 = trigger.cards.slice();
            trigger.cards = cards22;
            trigger.card.cards = cards22;
            if (player.isOnline2()) {
              player.send(
                function(cards4, player2) {
                  cards4.forEach((i2) => i2.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards3,
                // @ts-ignore
                player
              );
            }
            cards3.forEach((i2) => i2.delete());
            if (player == game.me) ui.updatehl();
          }
        },
        eff_lose: {
          trigger: {
            global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "cardsGotoOrderingBegin"]
          },
          charlotte: true,
          forced: true,
          popup: false,
          firstDo: true,
          filter: function(event2, player2) {
            var idList = player2.getCards("s", (card) => card.hasGaintag("bojimrfz")).map((i) => i._cardid);
            return event2.cards && event2.cards.some((card) => {
              return idList.includes(card.cardid);
            });
          },
          content: function() {
            var cards2;
            var idList = [];
            var target = game.findPlayer((current) => {
              return current == player.storage.bojimrfz_mark;
            });
            for (var i of target.storage.bojimrfz.players) {
              if (i.countCards("h") == 0) continue;
              if (i == player) continue;
              for (var j of i.getCards("h")) {
                idList.add(j.cardid);
              }
            }
            cards2 = player.getCards("s", (card) => {
              return card.hasGaintag("bojimrfz") && !idList.includes(card._cardid);
            });
            if (player.isOnline2()) {
              player.send(
                function(cards3, player2) {
                  cards3.forEach((i2) => i2.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards2,
                // @ts-ignore
                player
              );
            }
            cards2.forEach((i2) => i2.delete());
            if (player == game.me) ui.updatehl();
          }
        },
        eff2: {
          audio: "bojimrfz",
          trigger: {
            player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter", "bojimrfzAfter"],
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
          },
          charlotte: true,
          forced: true,
          filter: function(event2, player2) {
            if (event2.getl && !event2.getl(player2)) return false;
            return player2.countCards("h") < player2.storage.bojimrfz.players.length;
          },
          content: function() {
            player.draw(player.storage.bojimrfz.players.length - player.countCards("h"));
          },
          ai: {
            noh: true,
            skillTagFilter: function(player2, tag) {
              if (tag == "noh" && player2.maxHp - player2.hp < player2.storage.bojimrfz.players.length) {
                return false;
              }
            }
          }
        }
      }
    },
    caijianmrfz: {
      audio: 2,
      forbid: ["boss"],
      trigger: {
        player: "die"
      },
      forced: true,
      forceDie: true,
      skillAnimation: true,
      animationColor: "gray",
      filter: function(event2) {
        return event2.source && event2.source.isIn();
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        var doc = trigger2.source;
        doc.clearSkills();
        doc.discard(doc.getCards("hej"));
        doc.link(false);
        doc.turnOver(false);
        doc.draw(3);
        var skillsList = [];
        for (var i of game.players) {
          if (i == player2) continue;
          if (!lib.character[i.name][3]) continue;
          for (var j of lib.character[i.name][3]) skillsList.push(j);
        }
        if (skillsList.length == 0) return;
        doc.addSkill(skillsList.randomGets(Math.min(2, skillsList.length)));
      },
      ai: {
        maixie_defend: true,
        // @ts-ignore
        threaten: function(player2, target) {
          if (target.hp == 1) return 0.5;
          return 1.5;
        },
        effect: {
          // @ts-ignore
          target: function(card, player2, target, current) {
            if (!target.hasFriend()) return;
            if (target.hp <= 1 && get.tag(card, "damage")) {
              if (player2.hasSkillTag("jueqing", false, target)) return 3;
              return [1, 0, 0, -3 * get.threaten(player2)];
            }
          }
        }
      }
    },
    // 桥夹克里夫
    chongxiemrfz: {
      marktext: "弹药",
      intro: {
        name: "弹药",
        content: "共有#枚弹药"
      },
      trigger: {
        player: "useCardToPlayered"
      },
      // @ts-ignore
      filter: function(event2, player2) {
        if (event2.getParent().triggeredTargets3.length > 1) return false;
        if (get.name(event2.card) == "sha") return true;
        return false;
      },
      direct: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        const { targets } = await player2.chooseTarget(get.prompt("chongxiemrfz"), "你可以弃置其中一名角色的手牌", function(card, player3, target2) {
          return (_status.event.targets.includes(target2) || target2 == player3) && target2.countDiscardableCards(player3, "h");
        }).set("ai", function(target2) {
          var player3 = _status.event.player;
          if (player3.countCards("h", (card) => {
            return get.value(card) < 6;
          }) && player3 == target2)
            return 114514;
          return 2 - get.attitude(_status.event.player, target2);
        }).set("targets", trigger2.targets).forResult();
        if (!targets) return;
        var target = targets[0];
        player2.logSkill("chongxiemrfz", target);
        const { links } = await player2.discardPlayerCard("h", target, true).set("target", target).set("complexSelect", false).set("ai", lib.card.guohe.ai.button).forResult();
        if (!links) return;
        if (player2 == target) player2.draw();
        if (get.color(links[0]) == "black") {
          if (trigger2.addCount !== false) {
            trigger2.addCount = false;
            trigger2.player.getStat().card.sha--;
          }
        } else if (get.color(links[0]) == "red") {
          player2.addMark("chongxiemrfz", 1, false);
        } else return;
      }
    },
    qj_chongjimrfz: {
      enable: "chooseToUse",
      filter: function(event2, player2) {
        if (player2.countMark("chongxiemrfz") < 1 || !player2.isPhaseUsing()) return false;
        return event2.filterCard({ name: "sha" }, player2, event2);
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        await player2.chooseUseTarget({ name: "sha", nature: "thunder", isCard: true }, true, "nodistance");
        player2.removeMark("chongxiemrfz", 1, false);
      },
      ai: {
        order: 2.95,
        respondSha: true,
        // @ts-ignore
        skillTagFilter: function(player2, tag, arg) {
          if (player2.countMark("chongxiemrfz") < 1 || !player2.isPhaseUsing()) return false;
        }
      }
    },
    leitingmrfz: {
      init: function(player2) {
        player2.storage.leitingmrfz = false;
      },
      limited: true,
      skillAnimation: true,
      animationColor: "gray",
      trigger: {
        player: "phaseUseBegin"
      },
      // @ts-ignore
      filter: function(event2, player2) {
        return player2.countMark("chongxiemrfz") > 5 && !player2.storage.leitingmrfz;
      },
      // @ts-ignore
      check: function(event2, player2) {
        if (player2.hasUnknown()) return false;
        return true;
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        player2.removeMark("chongxiemrfz", 6, false);
        const { targets } = await player2.chooseTarget(true, "【雷霆】:请选择一个其他角色，对其使用6张雷【杀】").set("filterTarget", (card, player3, target) => {
          return player3.canUse({ name: "sha", nature: "thunder", isCard: true }, target, false) && player3 != target;
        }).set("ai", (target) => {
          return get.attitude(_status.event.player, target) < 0;
        }).forResult();
        if (!targets) return;
        let num = 6;
        while (num > 0) {
          if (!targets[0].isIn()) break;
          if (player2.canUse({ name: "sha", nature: "thunder", isCard: true }, targets[0], false)) {
            await player2.useCard({ name: "sha", nature: "thunder", isCard: true }, targets[0]);
          }
          num--;
        }
        player2.storage.leitingmrfz = true;
        _status.SJZX_tmpleitingmrfz = targets[0];
        player2.when({
          player: "phaseEnd",
          global: "dieAfter"
        }).filter((event3, player3) => {
          var target = _status.SJZX_tmpleitingmrfz;
          if (event3.name == "phase") return true;
          else return event3.player == target;
        }).then(() => {
          var target = _status.SJZX_tmpleitingmrfz;
          if (trigger2.name == "die") {
            player2.storage.leitingmrfz = false;
            player2.logSkill("leitingmrfz", target);
          }
          delete _status.SJZX_tmpleitingmrfz;
        });
      }
    },
    // 特雷西斯
    yuanfumrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      audio: 2,
      trigger: {
        player: "phaseDrawEnd"
      },
      forced: true,
      // @ts-ignore
      filter(event2, player2) {
        return player2.countCards("h") > 0;
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseCard(true).set("prompt", "【怨府】:请展示一张手牌").set("ai", (card) => {
          var storage = player2.storage.yuanfumrfz;
          if (storage.length > 1) return Math.random();
          if (storage.includes(get.color(card))) return -9999;
          return get.color(card) == "red" ? 10 : 0 - get.value(card);
        }).set("storage", player2.storage.yuanfumrfz).forResult();
        if (!cards2) return;
        player2.showCards(cards2, `${get.translation(player2)}因【怨府】而展示的牌`);
        for (var i of game.players) {
          if (i == player2) continue;
          i.addTempSkill("yuanfumrfz_eff", { global: "phaseAfter" });
          if (!i.storage.yuanfumrfz_eff) i.storage.yuanfumrfz_eff = [];
          i.storage.yuanfumrfz_eff.add(get.color(cards2[0]));
        }
        player2.storage.yuanfumrfz.add(get.color(cards2[0]));
        player2.addTempSkill("yuanfumrfz_clear", { global: "phaseBegin" });
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.logSkill("yuanfumrfz");
            player2.storage.yuanfumrfz = [];
            player2.loseHp();
            var num = player2.getStat("damage");
            if (num && num > 0) player2.draw(Math.min(5, num));
          }
        },
        eff: {
          mark: true,
          intro: {
            // @ts-ignore
            content(event2, player2) {
              return `无法使用或打出手牌中${get.translation(player2.storage.yuanfumrfz_eff)}的牌`;
            }
          },
          mod: {
            cardEnabled: function(card, player2) {
              var colors = player2.storage.yuanfumrfz_eff;
              if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player2.isDying()) return false;
            },
            cardSavable: function(card, player2) {
              var colors = player2.storage.yuanfumrfz_eff;
              if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player2.isDying()) return false;
            },
            cardEnabled2(card, player2) {
              var colors = player2.storage.yuanfumrfz_eff;
              if (colors && colors.includes(get.color(card)) && get.position(card) == "h" && !player2.isDying()) return false;
            }
          },
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            delete player2.storage.yuanfumrfz;
          },
          ai: {
            effect: {
              // @ts-ignore
              target(card, player2, target) {
                var colors = target.storage.yuanfumrfz_eff;
                if (get.tag(card, "damage") && colors && colors.includes(get.color(card))) return [0, -999999];
              }
            }
          }
        }
      }
    },
    fenzhoumrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      // @ts-ignore
      filter(event2, player2) {
        return player2.hasEnabledSlot(1) || player2.hasEnabledSlot(2) || player2.hasEnabledSlot(5) || player2.hasEnabledSlot("horse");
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        var { control } = await player2.chooseToDisable(true).set("ai", function(event3, player3, list2) {
          if (list2.includes("equip5")) return "equip5";
          else if (list2.includes("equip2")) return "equip2";
          else if (list2.includes("horse")) return "horse";
          return "equip1";
        }).forResult();
        if (!control) return;
        let targets = game.players.slice().remove(player2);
        var getChooseList = function(event3, player3, target2) {
          let list2 = [];
          let chooseList2 = [
            `弃置一张牌，本回合你下次受到的伤害+1`,
            `交给${get.translation(player3)}一张牌，本回合${get.translation(player3)}使用【杀】的次数+1`,
            `令${get.translation(player3)}摸一张牌，本回合${get.translation(player3)}下次造成的伤害+1`
          ];
          if (target2.countCards("h") > 0) {
            list2.push("选项一");
            list2.push("选项二");
          } else {
            chooseList2[0] = '<span style="opacity:0.5; ">' + chooseList2[0] + "（你没有牌）</span>";
            chooseList2[1] = '<span style="opacity:0.5; ">' + chooseList2[1] + "（你没有牌）</span>";
          }
          list2.push("选项三");
          return {
            list: list2,
            chooseList: chooseList2
          };
        };
        while (targets.length > 0) {
          var target = targets[0];
          if (!target.isIn()) {
            targets.shift();
            continue;
          }
          if (!player2.isIn()) {
            break;
          }
          var list = getChooseList(event2, player2, target).list, chooseList = getChooseList(event2, player2, target).chooseList;
          var { control } = await target.chooseControl(list).set("choiceList", chooseList).set("prompt", "请选择一项").set("ai", () => {
            var list2 = _status.event.list, player3 = _status.event.player, target2 = _status.event.target;
            if (get.attitude(player3, target2) > 0) {
              if (list2.includes("选项二")) return ["选项二", "选项三"].randomGet();
              return "选项三";
            } else {
              if (list2.includes("选项二") && player3.getCards("h").filter((card) => get.value(card) < 6)) return "选项二";
              if (list2.includes("选项一")) return "选项一";
            }
            return list2.randomGet();
          }).set("list", list).set("target", player2).forResult();
          if (!control) {
            targets.shift();
            continue;
          }
          switch (control) {
            case "选项一":
              target.chooseToDiscard(true, "【焚舟】:请弃置一张手牌", "h");
              target.addMark("fenzhoumrfz_eff1", 1, false);
              target.addTempSkill("fenzhoumrfz_eff1", { player: ["damageEnd", "phaseEnd"] });
              break;
            case "选项二":
              var { cards: cards2 } = await target.chooseCard("h", `【焚舟】:请交给${get.translation(player2)}一张手牌`, true).set("ai", (card) => {
                var player3 = _status.event.player, target2 = _status.event.target;
                var num = get.value(card), att = get.attitude(player3, target2);
                if (get.tag(card, "damage")) num += (att > 0 ? 1 : -1) * get.value(card);
                return (att > 0 ? 1 : -1) * get.value(card);
              }).set("target", player2).forResult();
              if (cards2) {
                target.give(cards2, player2);
              }
              player2.addMark("fenzhoumrfz_eff2", 1, false);
              player2.addTempSkill("fenzhoumrfz_eff2", { player: "phaseEnd" });
              break;
            case "选项三":
              player2.draw();
              player2.addMark("fenzhoumrfz_eff3", 1, false);
              player2.addTempSkill("fenzhoumrfz_eff3", {
                player: "phaseEnd",
                source: "damageEnd"
              });
              break;
          }
          targets.shift();
        }
      },
      subSkill: {
        eff1: {
          mark: true,
          intro: {
            content: "本回合下次受到的伤害+#"
          },
          onremove: true,
          charlotte: true,
          forced: true,
          trigger: { player: "damageBegin2" },
          // @ts-ignore
          filter(event2, player2) {
            return player2.countMark("fenzhoumrfz_eff1") > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.num += player2.countMark("fenzhoumrfz_eff1");
          }
        },
        eff2: {
          mark: true,
          intro: {
            content: "本回合使用【杀】的次数+#"
          },
          onremove: true,
          charlotte: true,
          mod: {
            cardUsable(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("fenzhoumrfz_eff2");
            }
          }
        },
        eff3: {
          mark: true,
          intro: {
            content: "本回合下次造成的伤害+#"
          },
          onremove: true,
          charlotte: true,
          forced: true,
          trigger: { source: "damageBegin2" },
          // @ts-ignore
          filter(event2, player2) {
            return player2.countMark("fenzhoumrfz_eff3") > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.num += player2.countMark("fenzhoumrfz_eff3");
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
    // 普瑞赛斯
    // TODO 等剧情更新后在重新设计
    bianyimrfz: {
      audio: 4,
      trigger: {
        global: "roundStart",
        source: "damageEnd"
      },
      GetAllSkills(player2) {
        var list = {};
        var ownSkills = get.translation(player2.getSkills(true, false, false));
        for (var key in lib.character) {
          if (!lib.character[key][3]) continue;
          var skills = lib.character[key][3];
          for (var i of skills) {
            if (!lib.translate[i]) continue;
            if (ownSkills.includes(lib.translate[i])) continue;
            list[i] = lib.translate[i];
          }
        }
        return list;
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        function getRandomKeys(obj, num2) {
          var keys = Object.keys(obj);
          var selectedKeys = [];
          var i2;
          for (i2 = 0; i2 < num2; i2++) {
            var randomIndex = Math.floor(Math.random() * keys.length);
            selectedKeys.push(keys[randomIndex]);
            keys.splice(randomIndex, 1);
          }
          return selectedKeys;
        }
        function extractChineseCharacters(arr) {
          var chineseRegex = /[\u4e00-\u9fa5]/g;
          var chineseSet = /* @__PURE__ */ new Set();
          arr.forEach(function(str) {
            var chineseChars = str.match(chineseRegex);
            if (chineseChars) {
              chineseChars.forEach(function(char) {
                chineseSet.add(char);
              });
            }
          });
          return Array.from(chineseSet);
        }
        function getRandomElements(arr, num2) {
          var result = [];
          var len = arr.length;
          var indices = [];
          for (var i2 = 0; i2 < len; i2++) {
            indices.push(i2);
          }
          for (var j = 0; j < num2; j++) {
            var randomIndex = Math.floor(Math.random() * indices.length);
            var index = indices[randomIndex];
            result.push(arr[index]);
            indices.splice(randomIndex, 1);
          }
          return result;
        }
        function findWordCombinations(arrA, arrB) {
          var combinations = [];
          for (var i2 = 0; i2 < arrB.length - 1; i2++) {
            for (var j = i2 + 1; j < arrB.length; j++) {
              var word1 = arrB[i2] + arrB[j];
              var word2 = arrB[j] + arrB[i2];
              if (arrA.includes(word1)) {
                combinations.push(word1);
              }
              if (arrA.includes(word2)) {
                combinations.push(word2);
              }
            }
          }
          return combinations;
        }
        function findKeysByValue(obj, value) {
          var keys = [];
          for (var key2 in obj) {
            if (obj[key2] && obj[key2] === value) {
              keys.push(key2);
            }
          }
          if (keys.length == 0) return null;
          return keys;
        }
        function autoChoose(list2, findWord2) {
          var index = [];
          var list2 = list2.map((i3) => i3[1]);
          var findWord2 = findWord2.randomGet();
          for (var i2 of findWord2) {
            for (var j = 0; j < list2.length; j++) {
              if (i2 != list2[j]) continue;
              index.push(j);
            }
          }
          return index;
        }
        function getCannotCharacters(arr, skills) {
          var index = [];
          var list2 = arr.map((i2) => i2[1]);
          for (var name of skills) {
            for (var j of name) {
              for (var k = 0; k < list2.length; k++) {
                if (j != list2[k]) continue;
                index.push(k);
              }
            }
          }
          return index;
        }
        var allCNSkills = [], ENSkills = lib.skill.bianyimrfz.GetAllSkills(player2);
        for (var key in ENSkills) {
          allCNSkills.push(ENSkills[key]);
        }
        while (true) {
          var skillsList = getRandomKeys(lib.skill.bianyimrfz.GetAllSkills(player2), 100);
          var CNSkills = [];
          for (var i of skillsList) {
            CNSkills.add(get.translation(i));
          }
          var CNCharacters = extractChineseCharacters(CNSkills);
          var randomCN = getRandomElements(CNCharacters, Math.min(CNCharacters.length, 50));
          var findWord = findWordCombinations(allCNSkills, randomCN);
          var num = 15;
          if (findWord.length > num) break;
        }
        var list = [];
        for (var i = 0; i < randomCN.length; i++) {
          list[i] = [i, randomCN[i]];
        }
        if (list.length == 0) {
          player2.popup("纳尼？没有技能了？！");
          return;
        }
        var fun1 = (list2) => {
          var per = 75;
          var filterEnd = getRandomElements(list2, Math.floor(list2.length * per));
          return filterEnd;
        };
        game.broadcastAll(function(player3) {
          player3.forceCountChoose = { chooseButton: 30 };
        }, player2);
        var buttonList = [`编译:请选择至少两个汉字（推荐选两个汉字）`];
        var count = 0;
        for (var i = 0; i < Math.ceil(list.length / 10); i++) {
          buttonList.push([list.slice(count, count + 10 >= list.length ? list.length : count + 10), "tdnodes"]);
          count += 10;
        }
        buttonList.push(`存在有${findWord.length}个技能`);
        const { links } = event2.isMine() == false ? { links: autoChoose(list, findWord) } : await player2.chooseButton(buttonList).set("forced", true).set("selectButton", [2, Infinity]).set("filterButton", function(button) {
          var list2 = _status.event.cannot;
          if (list2.length == 0) return true;
          if (list2.includes(button.link)) return true;
          return false;
        }).set("ai", () => {
          _status.tmp_PRTS_endTime = true;
        }).set("cannot", fun1(getCannotCharacters(list, findWord))).forResult();
        game.broadcastAll(function(player3) {
          delete player3.forceCountChoose;
        }, player2);
        var fun2 = (player3, end = false) => {
          if (!end) player3.popup(`没有${CsSkill}`);
          else player3.popup(`时间耗尽`);
          game.log(`可组成的技能有:${findWord}`);
        };
        if (!links || _status.tmp_PRTS_endTime) {
          fun2(player2, true);
          delete _status.tmp_PRTS_endTime;
          return;
        }
        var CsSkill = "";
        for (var i of links) {
          CsSkill = CsSkill + list[i][1];
        }
        var findkey = findKeysByValue(ENSkills, CsSkill);
        if (findkey != null) {
          var introSkills = [];
          for (var i of findkey) {
            introSkills.push(get.skillInfoTranslation(i));
          }
          const { index } = findkey.length == 1 ? { index: 0 } : await player2.chooseControl().set("choiceList", introSkills).set("prompt", `请选择一个版本的【${get.translation(findkey[0])}】`).set("ai", () => get.rand(0, findkey.length - 1)).forResult();
          if (!index && index != 0) return;
          let info = get.info(findkey[index]);
          if (!info.audioname2) info.audioname2 = {};
          info.audioname2[player2.name] = "bianyimrfz";
          player2.addSkill(findkey[index]);
        } else {
          fun2(player2);
        }
      }
    },
    // 新 斗士塔露拉
    talula_shixinmrfz: {
      audio: 2,
      trigger: {
        source: "damageEnd"
      },
      filter(event2, player2) {
        return event2.player && event2.player.isIn() && !!event2.player.countGainableCards(player2, "hes");
      },
      async content(event2, trigger2, player2) {
        var pos = [];
        for (var i of trigger2.player.getCards("hes")) {
          pos.add(get.position(i));
        }
        var { cards: cards2 } = await player2.choosePlayerCard("hes", trigger2.player, true).set("prompt", `【拾薪】:请选择其各区域内的一张牌`).set("selectButton", pos.length).set("filterButton", (button) => {
          let cards3 = ui.selected.cards;
          let pos2 = cards3.slice().map((card) => get.position(card));
          return !pos2.includes(get.position(button));
        }).set("complexSelect", true).set("ai", lib.card.shunshou.ai.button).forResult();
        if (!cards2) return;
        if (_status.connectMode)
          game.broadcastAll(function() {
            _status.noclearcountdown = true;
          });
        event2.given_map = {};
        while (cards2.length > 0) {
          var { links } = cards2.length == 1 ? { links: cards2 } : await player2.chooseCardButton("【拾薪】:请选择要分配的牌", true, cards2, [1, cards2.length]).set("ai", () => {
            if (ui.selected.buttons.length == 0) return 1;
            return 0;
          }).forResult();
          if (!links) continue;
          event2.togive = links.slice();
          cards2.removeArray(links);
          const { targets } = await player2.chooseTarget("选择一名角色获得" + get.translation(event2.togive), true).set("ai", (target) => {
            const att = get.attitude(_status.event.player, target);
            if (_status.event.enemy) {
              return -att;
            } else if (att > 0) {
              return att / (1 + target.countCards("h"));
            } else {
              return att / 100;
            }
          }).set("enemy", get.value(event2.togive[0], player2, "raw") < 0).forResult();
          if (targets) {
            const id = targets[0].playerid, map = event2.given_map;
            if (!map[id]) map[id] = [];
            map[id].addArray(event2.togive);
          }
        }
        if (_status.connectMode) {
          game.broadcastAll(function() {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        const list = [];
        for (const i2 in event2.given_map) {
          const source = (_status.connectMode ? lib.playerOL : game.playerMap)[i2];
          player2.line(source, "green");
          if (player2 !== source && (get.mode() !== "identity" || player2.identity !== "nei")) player2.addExpose(0.2);
          list.push([source, event2.given_map[i2]]);
        }
        game.loseAsync({
          gain_list: list,
          giver: player2,
          animate: "draw"
        }).setContent("gaincardMultiple");
      }
    },
    zhuoximrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      audio: 2,
      trigger: {
        player: "useCard"
      },
      filter(event2, player2) {
        if (!event2.card) return false;
        return !player2.storage.zhuoximrfz.includes(get.type2(event2.card)) && game.hasPlayer((current) => {
          return get.distance(current, player2) == player2.hp && current != player2;
        });
      },
      // @ts-ignore
      async cost(event2, trigger2, player2) {
        const { result } = await player2.chooseTarget(`【灼息】:你可以对一名与你距离为${player2.hp}的角色造成一点火焰伤害`).set("filterTarget", (card, player3, target) => {
          return get.distance(target, player3) == player3.hp && target != player3;
        }).set("ai", (target) => {
          var player3 = get.event().player;
          return get.damageEffect(target, player3, player3, "fire") > 0;
        });
        if (!result) return;
        event2.result = result;
      },
      async content(event2, trigger2, player2) {
        let target = event2.targets[0];
        target.damage("fire");
        player2.line(target);
        if (!player2.storage.zhuoximrfz) player2.storage.zhuoximrfz = [];
        player2.storage.zhuoximrfz.add(get.type2(trigger2.card));
      },
      group: "zhuoximrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.zhuoximrfz = [];
          }
        }
      }
    },
    // 双王 特蕾西娅&&特雷西斯
    chenke1mrfz: {
      audio: "chenkemrfz"
    },
    chenke2mrfz: {
      audio: "chenkemrfz"
    },
    chenke3mrfz: {
      audio: "chenkemrfz"
    },
    chenkemrfz: {
      extraSkills: [
        "duwu",
        "neifa",
        "maihuo",
        "spyanhuo",
        "xinfu_sidao",
        "dclibang",
        "zengou",
        "drlt_siyong",
        "jiaozi",
        "rewangzun",
        "nzry_cunmu",
        "jiuchi",
        "benghuai",
        "zhaoluan",
        "wumo",
        "taoluan",
        "jishe",
        "huisheng",
        "shifei",
        "huaiyi",
        "oltuishi",
        "olxiaofan",
        "oljuanxia",
        "olgoude",
        "dcwujie"
      ],
      getNegative(player2) {
        let banSkills = ["nscesuan", "zhaohuo", "rekurou"];
        let skillTemps = [];
        let arrs = Object.keys(lib.skill);
        let hasSkills = Object.values(lib.character).map((i) => i[3]).flat();
        for (let key of arrs) {
          if (banSkills.includes(key)) continue;
          if (hasSkills.includes(key) && lib.translate[key] && !player2.hasSkill(key) && (lib.skill.chenkemrfz.extraSkills.includes(key) || get.skillRank(key) < 0))
            skillTemps.push(key);
        }
        return skillTemps.randomGet() || [];
      },
      init(player2) {
        player2.storage.chenkemrfz = ["chenke1mrfz", "chenke2mrfz", "chenke3mrfz", "gujimrfz", "jiangqingmrfz"];
      },
      audio: 2,
      forced: true,
      firstDo: true,
      trigger: { global: "roundStart" },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        let skill = lib.skill.chenkemrfz.getNegative(player2);
        await player2.addSkill(skill);
        player2.storage.chenkemrfz.add(skill);
        game.broadcastAll(
          // @ts-ignore
          function(list) {
            game.expandSkills(list);
            for (var i of list) {
              var info = lib.skill[i];
              if (!info) continue;
              if (!info.audioname2) info.audioname2 = {};
              info.audioname2.shuangwangmrfz = "chenkemrfz";
            }
          },
          [skill]
        );
      }
    },
    gujimrfz: {
      onremove(player2) {
        delete player2.storage.chenkemrfz;
      },
      audio: 2,
      derivation: ["bengjiemrfz"],
      trigger: { global: "roundStart" },
      // @ts-ignore
      filter(event2, player2) {
        return game.roundNumber > 4;
      },
      forced: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        let skills = player2.getOriginalSkills();
        skills.push(...["guguomrfz", "xingjunmrfz", "datongmrfz"]);
        for (let skill of skills) {
          await player2.removeSkill(skill);
        }
        player2.addSkill("bengjiemrfz");
        player2.sex = "male";
        game.log(player2, "将性别变为了", "#y男性");
        player2.node.avatar.setBackgroundImage("extension/whitherHelm/image/orther/shuangwang2mrfz.jpg");
      }
    },
    jiangqingmrfz: {
      audio: 2,
      derivation: ["guguomrfz", "xingjunmrfz", "datongmrfz"],
      init(player2) {
        player2.storage.jiangqingmrfz = {
          0: {
            intro: "弃置两种不同颜色的牌，获得“固国”",
            // @ts-ignore
            filter(event2, player3) {
              return ["red", "black"].every(
                (i) => player3.getCards("hes").map((j) => get.color(j)).includes(i)
              );
            },
            // @ts-ignore
            async content(event2, trigger2, player3) {
              const bool = await player3.chooseToDiscard(true, "弃置两种不同颜色的牌，获得“固国”", 2).set("ai", (card) => 8 - get.value(card)).set(
                "filterCard",
                (card, player4) => !ui.selected.cards.some((cardx) => get.color(cardx, player4) == get.color(card, player4))
              ).set("complexCard", true).forResult("bool");
              if (bool === true) {
                player3.addSkill("guguomrfz");
                delete player3.storage.jiangqingmrfz[0];
                let original = player3.getSkills(null, false, false).filter((i) => {
                  return player3.getOriginalSkills().includes(i);
                });
                player3.removeSkill(original[0]);
                return true;
              }
            }
          },
          1: {
            intro: "弃置三种不同类型的牌，获得“兴军”",
            // @ts-ignore
            filter(event2, player3) {
              return ["trick", "basic", "equip"].every(
                (i) => player3.getCards("hes").map((j) => get.type2(j)).includes(i)
              );
            },
            // @ts-ignore
            async content(event2, trigger2, player3) {
              const bool = await player3.chooseToDiscard(true, "弃置三种不同类型的牌，获得“兴军”", 3).set("ai", (card) => 8 - get.value(card)).set(
                "filterCard",
                (card, player4) => !ui.selected.cards.some((cardx) => get.type2(cardx, player4) == get.type2(card, player4))
              ).set("complexCard", true).forResult("bool");
              if (bool === true) {
                player3.addSkill("xingjunmrfz");
                delete player3.storage.jiangqingmrfz[1];
                let original = player3.getSkills(null, false, false).filter((i) => {
                  return player3.getOriginalSkills().includes(i);
                });
                player3.removeSkill(original[0]);
                return true;
              }
            }
          },
          2: {
            intro: "弃置四种不同花色的牌，获得“大同”",
            // @ts-ignore
            filter(event2, player3) {
              return lib.suit.every(
                (i) => player3.getCards("hes").map((j) => get.suit(j)).includes(i)
              );
            },
            // @ts-ignore
            async content(event2, trigger2, player3) {
              const bool = await player3.chooseToDiscard(true, "弃置四种不同花色的牌，获得“大同”", 4).set("ai", (card) => 8 - get.value(card)).set(
                "filterCard",
                (card, player4) => !ui.selected.cards.some((cardx) => get.suit(cardx, player4) == get.suit(card, player4))
              ).set("complexCard", true).forResult("bool");
              if (bool === true) {
                player3.addSkill("datongmrfz");
                delete player3.storage.jiangqingmrfz[2];
                let original = player3.getSkills(null, false, false).filter((i) => {
                  return player3.getOriginalSkills().includes(i);
                });
                player3.removeSkill(original[0]);
                return true;
              }
            }
          },
          3: {
            intro: "失去两点体力和体力上限、失去所有不因此技能而获得的技能。",
            // @ts-ignore
            filter(event2, player3) {
              return true;
            },
            // @ts-ignore
            async content(event2, trigger2, player3) {
              await player3.loseHp(3);
              await player3.loseMaxHp(3);
              let gainSkills = ["guguomrfz", "xingjunmrfz", "datongmrfz"];
              let skills = player3.getSkills(null, false, false).filter((i) => {
                const info = get.info(i);
                if (gainSkills.includes(i)) return false;
                return !info || !info.charlotte;
              });
              for (let skill of skills) {
                player3.removeSkill(skill);
              }
              player3.drawTo(player3.maxHp);
              return true;
            }
          }
        };
      },
      forced: true,
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        let info = player2.storage.jiangqingmrfz;
        let keys = Object.keys(info);
        return info[keys[0]].filter(event2, player2);
      },
      async content(event2, trigger2, player2) {
        let info = player2.storage.jiangqingmrfz;
        for (let i of [0, 1, 2, 3]) {
          if (!get.is.object(info[i])) continue;
          if (!info[i].filter(event2, player2)) return;
          const bool = await info[i].content(event2, trigger2, player2);
          if (bool !== true) break;
          player2.logSkill("jiangqingmrfz");
        }
      }
    },
    bengjiemrfz: {
      audio: 2,
      intro: {
        // @ts-ignore
        content(event2, player2) {
          let num = lib.skill.bengjiemrfz.getX(player2);
          return `当前X为:${num}`;
        }
      },
      getX(player2) {
        return Math.max(
          0,
          player2.getSkills(null, false, false).filter((i) => {
            const info = get.info(i);
            const banSkills = player2.storage.chenkemrfz || [];
            if (banSkills.includes(i)) return false;
            return !info || !info.charlotte;
          }).length - player2.countMark("bengjiemrfz")
        );
      },
      trigger: {
        player: ["phaseEnd", "damageBegin"]
      },
      forced: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        if (trigger2.name === "damage") {
          trigger2.num += game.roundNumber;
        } else {
          let num = lib.skill.bengjiemrfz.getX(player2);
          await player2.draw(num);
          player2.addMark("bengjiemrfz", Math.floor(num / 2), false);
        }
      }
    },
    guguomrfz: {
      mod: {
        // @ts-ignore
        globalFrom(from, to, distance) {
          return distance - lib.skill.bengjiemrfz.getX(from);
        }
      },
      audio: 1,
      trigger: { player: "phaseDrawBegin2" },
      // @ts-ignore
      filter(event2, player2) {
        return !event2.numFixed;
      },
      forced: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        trigger2.num += lib.skill.bengjiemrfz.getX(player2);
      }
    },
    xingjunmrfz: {
      audio: 1,
      trigger: { source: "damageEnd" },
      forced: true,
      // @ts-ignore
      filter(event2, player2) {
        return event2.card && event2.card.name === "sha";
      },
      async content(event2, trigger2, player2) {
        player2.draw();
      },
      mod: {
        cardUsable(card, player2, num) {
          if (card.name == "sha") return num + lib.skill.bengjiemrfz.getX(player2);
        }
      }
    },
    datongmrfz: {
      init(player2) {
        player2.link(true);
      },
      global: "datongmrfz_buff",
      audio: 1,
      trigger: {
        player: ["linkBefore", "enterGame"],
        global: "phaseBefore"
      },
      forced: true,
      filter(event2, player2) {
        if (event2.name == "link") return player2.isLinked();
        return (event2.name != "phase" || game.phaseNumber == 0) && !player2.isLinked();
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name != "link") player2.link(true);
        else trigger2.cancel();
      },
      group: "datongmrfz_revival",
      subSkill: {
        revival: {
          audio: "datongmrfz",
          forced: true,
          trigger: { source: "dieAfter" },
          // @ts-ignore
          filter(event2, player2) {
            return get.mode() == "identity";
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            let target = trigger2.player;
            await target.revive();
            target.recoverTo(2);
            target.drawTo(2);
            if (player2.identity != "zhu") target.identity = player2.identity;
            else target.identity = "zhong";
            target.node.identity.dataset.color = target.identity;
            target.identityShown = true;
            target.setIdentity(target.identity);
          }
        },
        buff: {
          mod: {
            maxHandcard(player2, num) {
              if (game.hasPlayer((current) => current.hasSkill("datongmrfz")) && player2.isLinked())
                return num + lib.skill.bengjiemrfz.getX(player2);
            }
          }
        }
      },
      ai: {
        effect: {
          target(card) {
            if (card.name == "tiesuo") return "zeroplayertarget";
          }
        }
      }
    },
    // 新ACE
    newsizhanmrfz: {
      audio: 2,
      trigger: {
        player: "loseAfter",
        global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
      },
      filter(event2, player2) {
        if (player2.countCards("h")) return false;
        const evt = event2.getl(player2);
        return evt && evt.player == player2 && evt.hs && evt.hs.length > 0;
      },
      forced: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        const { index } = await player2.chooseControl("流失体力", "失去体力上限").set("prompt", "【死战】:流失一点体力或失去体力上限").set("ai", () => {
          let player3 = get.player();
          if (player3.hp >= 4) return 0;
          if (player3.getDamagedHp() === 0) return 0;
          return 1;
        }).forResult();
        if (typeof index !== "number") return;
        if (index === 0) player2.loseHp();
        else player2.loseMaxHp();
        player2.drawTo(5);
      },
      ai: {
        threaten: 0.7,
        noh: true,
        skillTagFilter(player2, tag) {
          if (tag == "noh") {
            if (player2.countCards("h") != 1) return false;
          }
        },
        effect: {
          // @ts-ignore
          player_use(card, player2, target) {
            if (player2.countCards("h") === 1) return [1, 0.8];
          },
          // @ts-ignore
          target(card, player2, target) {
            if (get.tag(card, "loseCard") && target.countCards("h") === 1) return 0.5;
          }
        }
      }
    },
    ehoumrfz: {
      mod: {
        // @ts-ignore
        cardname(card, player2, name) {
          if (get.position(card) === "h" && player2.storage.ehoumrfz) return "sha";
        }
      },
      audio: 2,
      trigger: {
        player: "damageEnd",
        global: "damageEnd"
      },
      filter(event2, player2) {
        if (!event2.source || !event2.source.isIn()) return false;
        return (event2.player === player2 || get.distance(player2, event2.player) <= 1) && player2.canUse("juedou", event2.source);
      },
      // @ts-ignore
      prompt(event2, player2) {
        return `【扼后】:是否视为对${get.translation(event2.source)}使用一张【决斗】？`;
      },
      check(event2, player2) {
        let target = event2.source;
        if (get.attitude2(event2.player) < 0) return false;
        return get.effect(target, { name: "juedou" }, player2, player2) > 0 && player2.countCards("h") * 2 > target.countCards("h");
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        player2.storage.ehoumrfz = true;
        player2.useCard({ name: "juedou", isCard: true, storage: { jumpDying: true } }, trigger2.source, true);
      },
      group: ["ehoumrfz_clear", "ehoumrfz_jumpDying"],
      subSkill: {
        jumpDying: {
          silent: true,
          charlotte: true,
          trigger: { global: "dying" },
          // @ts-ignore
          filter(event2, player2) {
            return event2.card && event2.card.storage && event2.card.storage.jumpDying;
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            player2.die();
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "useCardEnd" },
          // @ts-ignore
          filter(event2, player2) {
            return event2.card && event2.card.storage && event2.card.storage.jumpDying;
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            delete player2.storage.ehoumrfz;
          }
        }
      }
    },
    // 新普瑞赛斯
    qianmianmrfz: {
      audio: 2,
      trigger: { player: ["chooseToUseBegin", "chooseToRespondBegin"] },
      getResAndUseCard(event2, player2) {
        let result = [];
        for (let name of lib.inpile) {
          if (event2.filterCard && event2.filterCard({ name, suit: "none", number: null }, player2, event2)) result.add(name);
        }
        return result;
      },
      // @ts-ignore
      hiddenCard(player2, name) {
        return player2.countCards("h") > 0;
      },
      filter(event2, player2) {
        return (event2.respondTo && event2.respondTo[0] !== player2 || event2.type === "wuxie") && player2.countCards("h") > 0 && lib.skill.qianmianmrfz.getResAndUseCard(event2, player2).length > 0;
      },
      forced: true,
      // @ts-ignore
      async content(event2, trigger2, player2) {
        let names = lib.skill.qianmianmrfz.getResAndUseCard(trigger2, player2);
        let cardx = trigger2.card;
        if (names.length === 1) {
          player2.when({ player: ["chooseToUseAfter", "chooseToRespondAfter"] }).step(() => {
          }).assign({
            mod: {
              // @ts-ignore
              cardname(card, player3, name) {
                if (card !== cardx) return names[0];
              }
            }
          });
        }
      }
    },
    neihuamrfz: {
      audio: 2,
      trigger: { player: ["useCardAfter", "respondAfter"] },
      // @ts-ignore
      init(player2, skill) {
        player2.storage.neihuamrfz = [];
        lib.translate["neihuamrfzx"] = "信息流";
      },
      filter(event2, player2) {
        let nameList = player2.getExpansions("neihuamrfz").map((card) => card.name);
        return !nameList.includes(event2.card.name) && !event2.cards.some((card) => card.neihuamrfz);
      },
      forced: true,
      mark: true,
      marktext: "信息流",
      intro: {
        name: "信息流",
        content: "expansion",
        markcount: "expansion"
      },
      onremove(player2, skill) {
        const cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      // @ts-ignore
      async content(event2, trigger2, player2) {
        let card = trigger2.card;
        let cardcopy = ui.create.card();
        let info = ["none", null, get.name(card), get.nature(card), void 0];
        cardcopy.init(info);
        cardcopy.neihuamrfz = true;
        player2.addToExpansion(cardcopy, player2, "give").gaintag.add("neihuamrfz");
      },
      group: ["neihuamrfz_snyc", "neihuamrfz_destroy", "neihuamrfz_snyc_lose"],
      subSkill: {
        destroy: {
          silent: true,
          charlotte: true,
          trigger: {
            global: ["loseEnd", "cardsDiscardEnd"]
          },
          // @ts-ignore
          filter(event2, player2) {
            if (event2.name == "lose" && event2.position != ui.discardPile) return false;
            for (let card of event2.cards) {
              if (card.neihuamrfz) return true;
            }
            return false;
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            let cards2 = [];
            for (let card of trigger2.cards) {
              if (card.neihuamrfz) cards2.push(card);
            }
            game.cardsGotoSpecial(cards2);
            game.log(cards2, "被移出了游戏");
          }
        },
        snyc: {
          silent: true,
          charlotte: true,
          trigger: {
            player: ["addToExpansionAfter"]
          },
          // @ts-ignore
          filter(event2, player2) {
            return event2.cards.some((card) => card.neihuamrfz);
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            let cards2 = trigger2.cards.filter((card) => card.neihuamrfz);
            let cardsx = cards2.map((card) => {
              let cardx = ui.create.card();
              cardx.init(get.cardInfo(card));
              cardx._cardid = card.cardid;
              cardx.neihuamrfz = true;
              return cardx;
            });
            player2.directgains(cardsx, null, "neihuamrfzx");
          }
        },
        snyc_lose: {
          silent: true,
          charlotte: true,
          trigger: {
            player: ["loseBegin"]
          },
          // @ts-ignore
          filter(event2, player2) {
            return event2.cards.filter((card) => card.neihuamrfz);
          },
          // @ts-ignore
          async content(event2, trigger2, player2) {
            let cards2 = trigger2.cards;
            let loseCards = player2.getExpansions("neihuamrfz").filter((card) => {
              return cards2.some((cardt) => cardt._cardid === card.cardid);
            });
            game.cardsGotoSpecial(loseCards, false);
          }
        }
      }
    }
  }
};
export {
  plot1SJZX as default
};
//# sourceMappingURL=plot1SJZX.js.map
