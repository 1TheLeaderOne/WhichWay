import { lib, get, game, _status, ui } from "noname";
const epic1 = {
  character: {
    fulankamrfz: ["female", "gemrfz", 3, ["jifengmrfz", "xiqiaomrfz"], []],
    xingjimrfz: ["female", "gemrfz", 4, ["tianyimrfz", "huijianmrfz", "bingmingmrfz"], []],
    xingyuanmrfz: ["female", "lymrfz", 4, ["daoliumrfz", "gewumrfz"], []],
    zhanchemrfz: ["male", "othermrfz", "4/4/2", ["jiqiangmrfz", "qingxiemrfz"], []],
    shanjimrfz: ["male", "othermrfz", 4, ["shandunmrfz", "xuanmumrfz", "chuandunmrfz"], []],
    shuanghuamrfz: ["female", "othermrfz", 3, ["tadianmrfz", "xinjimrfz"], []],
    bohuimrfz: ["female", "samimrfz", 4, ["shehunmrfz", "yirenmrfz"], []],
    baimianxiaomrfz: ["female", "lymrfz", 3, ["jinaomrfz", "wutaimrfz"], []],
    cimeimrfz: ["female", "weimrfz", 3, ["huabumrfz", "shixinmrfz"], []],
    hongmrfz: ["female", "luomrfz", 4, ["qunlangmrfz", "cigumrfz", "qingchumrfz"], ["hiddenSkill"]],
    dekesasimrfz: ["female", "qimrfz", 4, ["sudimrfz", "jianyumrfz"], []],
    baijinmrfz: ["female", "kamrfz", 3, ["xujimrfz", "shiyumrfz"], []],
    yintuoluomrfz: ["female", "weimrfz", 4, ["suijiamrfz", "huquanmrfz"], []],
    wenmimrfz: ["female", "leimrfz", 3, ["baiweimrfz", "nuanxiangmrfz"], []],
    meiermrfz: ["female", "lymrfz", 3, ["shuitamrfz"], []],
    lindongmrfz: ["female", "wumrfz", 4, ["xianlingmrfz", "dongjiangmrfz"], []],
    yunxingmrfz: ["female", "luomrfz", 4, ["yxliumingmrfz", "dingyuanmrfz"], []],
    yumaobimrfz: ["female", "bomrfz", 4, ["tiaojiumrfz", "rujingmrfz"], []],
    ailisimrfz: ["female", "weimrfz", 3, ["rumianmrfz", "alsmengxiangmrfz"], []],
    tianhuomrfz: ["female", "weimrfz", 3, ["zhuihuomrfz", "yihuomrfz"], []],
    linguangmrfz: ["female", "shimrfz", "3/4/3", ["anranmrfz", "huchimrfz", "chongyaomrfz"], []],
    haimomrfz: ["female", "yimrfz", 4, ["xunchaomrfz", "paoyingmrfz"], []],
    xiaomanmrfz: ["female", "yanmrfz", 4, ["mushoumrfz"], []],
    wanqingmrfz: ["male", "yanmrfz", 4, ["guantianmrfz", "yingfengmrfz"], []],
    gelaokesimrfz: ["female", "yimrfz", 4, ["cichongmrfz", "ganraomrfz"], []],
    haidimrfz: ["female", "weimrfz", 3, ["anxinmrfz", "gongchoumrfz", "yinshimrfz"], []],
    yaxinmrfz: ["female", "xiemrfz", 4, ["lingdingmrfz", "yabengmrfz"], []],
    chuxuemrfz: ["female", "xiemrfz", 3, ["shengnvmrfz", "shenshemrfz"], []],
    shixiemrfz: ["female", "samrfz", 3, ["qianzongmrfz", "xiedumrfz", "lijimrfz"], ["hiddenSkill"]],
    hongsunmrfz: ["female", "samrfz", 4, ["chihenmrfz", "haomingmrfz"], []],
    xiyinmrfz: ["female", "samrfz", 3, ["sheyingmrfz", "chaozaimrfz"], []],
    yemomrfz: ["female", "weimrfz", 3, ["biaolimrfz", "ymkongwomrfz"], []],
    jingzhemrfz: ["female", "yanmrfz", 3, ["chunleimrfz", "zheqimrfz"], []],
    longshelanmrfz: ["male", "bomrfz", 4, ["tiaojiumrfz", "pianfengmrfz"], []],
    spamiyamrfz: ["female", "luomrfz", 4, ["chenxianmrfz", "benyemrfz", "newjueyingmrfz"], []],
    amiyamrfz: ["female", "luomrfz", 3, ["newtongganmrfz", "shijiemrfz", "qinghemrfz"], ["zhu"]],
    docmrfz: ["male", "othermrfz", 4, ["yizhemrfz", "zhulimrfz"], []],
    // innamrfz: ['female', 'othermrfz', 4, ['shuangzimrfz'], []],
    linshimrfz: ["female", "samimrfz", 3, ["jiangtumrfz", "jieshimrfz"], []],
    medical_amiyamrfz: ["female", "luomrfz", 3, ["tongqingmrfz", "cibeimrfz"], []],
    spfenmrfz: ["female", "luomrfz", 4, ["xiaozhimrfz", "zhishoumrfz"], []],
    hainimrfz: ["female", "a_groupmrfz", 3, ["jingchaomrfz", "cehuimrfz"], []],
    shenxunmrfz: ["female", "a_groupmrfz", 5, ["yuchaomrfz", "yanhuimrfz"], []],
    mingjiaomrfz: ["female", "luomrfz", 3, ["suozemrfz", "youyimrfz"], []],
    daifeienmrfz: ["female", "weimrfz", 3, ["zhuofengmrfz", "qianggongmrfz"], []],
    xirenmrfz: ["male", "gemrfz", 4, ["suximrfz", "sanzhongmrfz"], []],
    suocaomrfz: ["female", "samrfz", 3, ["lanjuanmrfz", "xinglumrfz"], []],
    laiousimrfz: ["male", "othermrfz", 4, ["shijianmrfz", "shimomrfz"], []],
    senximrfz: ["male", "othermrfz", 4, ["micaimrfz", "beicaimrfz", "pengcaimrfz"], []],
    qierchakemrfz: ["male", "othermrfz", 3, ["tangongmrfz", "ruiganmrfz"], []],
    kaiselinmrfz: ["female", "weimrfz", 3, ["ksl_zhuzhimrfz", "duantiemrfz"], []],
    bobumrfz: ["male", "gemrfz", 4, ["qingtingmrfz", "qingtanmrfz"], []],
    feilaimrfz: ["female", "samrfz", 5, ["qianxiumrfz", "mingzhoumrfz"], []],
    caidumrfz: ["male", "xumrfz", 4, ["caiyimrfz", "mingjiangmrfz"], []],
    tekenuomrfz: ["female", "bomrfz", 4, ["suoumrfz"], []],
    guiyanmrfz: ["female", "yimrfz", 3, ["qiyimrfz", "guiyaomrfz", "xiadumrfz"], []],
    xingzhumrfz: ["female", "yanmrfz", 3, ["xingzhumrfz", "zhizhumrfz"], []],
    xunlanmrfz: ["female", "gemrfz", 4, ["tanxunmrfz", "dongximrfz"], []],
    nuoweiermrfz: ["male", "weimrfz", 3, ["butingmrfz", "buximrfz"], []],
    spfurongmrfz: ["female", "luomrfz", 3, ["dichenmrfz", "zhuoxinmrfz"], []],
    anzhelamrfz: ["female", "liemrfz", 3, ["jianmomrfz", "zhishemrfz", "ruijuemrfz", "tongmaimrfz"], ["clan:深海猎人"]]
    //————测试————//
    //ceshisjzx:['female','shen',5,['diymengxian','diyfujing','diyhesheng'],[]],
  },
  skill: {
    // 安哲拉
    zhishemrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return player2.countCards("he") > 0 && game.hasPlayer((current) => current.countCards("h") > 0 && current !== player2);
      },
      filterTarget(card2, player2, target2) {
        return target2 !== player2 && target2.countCards("h") > 0;
      },
      filterCard: true,
      async content(event2, trigger2, player2) {
        const { targets: targets2, cards: cards2 } = event2;
        let target2 = targets2[0];
        const { cards: card2 } = await player2.discardPlayerCard("h", target2, true).set("target", target2).set("complexSelect", false).set("ai", lib.card.guohe.ai.button).forResult();
        if (card2) player2.draw(new Set([].concat(cards2, card2).map((i2) => get.type2(i2, player2))).size);
        else player2.draw();
        if (target2.countCards("h") === 0 && card2) player2.getStat("skill").zhishemrfz = 0;
      }
    },
    jianmomrfz: {
      audio: 2,
      mod: {
        targetEnabled(card2) {
          if (get.type(card2) == "trick" || get.type(card2) == "delay") return false;
        }
      },
      forced: true,
      firstDo: true,
      filter(event2, player2) {
        if (event2.player == player2) return false;
        if (get.color(event2.card) != "black" || get.type(event2.card) != "trick") return false;
        var info = lib.card[event2.card.name];
        return info && info.selectTarget && info.selectTarget == -1 && !info.toself;
      },
      content() {
      }
    },
    ruijuemrfz: {
      audio: 2,
      trigger: {
        player: ["loseAfter", "gainAfter"]
      },
      filter(event2, player2) {
        if (player2.countCards("he") < 1) return false;
        if (event2.name === "lose") return event2.type === "discard" && event2.getl(player2).cards2.length > 0;
        else {
          const evt = event2.getParent("phaseDraw");
          if (evt?.player == player2) return false;
          return event2.getg(player2).length > 0 && player2.getCards("h").some((card2) => player2.hasUseTarget(card2, false));
        }
      },
      async cost(event2, trigger2, player2) {
        if (trigger2.name === "lose") {
          event2.result = await player2.chooseCard("he", [1, player2.countCards("he")]).set("prompt", `【锐觉】:你可以重铸任意张牌`).set("ai", (card2) => get.value(card2, player2) < 7).set("filterCard", (card2, player3) => player3.canRecast(card2)).forResult();
        } else {
          event2.result = await player2.chooseBool().set("prompt", `【锐觉】:你可以使用一张牌（无距离限制且不计入次数限制）`).set("ai", () => {
            let player3 = get.player();
            return player3.getCards("h").some((card2) => {
              return player3.hasUseTarget(card2, false) && game.hasPlayer((char) => get.effect(char, card2, player3, player3) > 0);
            });
          }).forResult();
        }
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name === "lose") {
          player2.recast(event2.cards);
        } else {
          player2.chooseToUse().set("prompt", `【锐觉】:请使用一张手牌`).set("addCount", false).set("nodistance", true);
        }
      },
      mod: {
        targetInRange(card2, player2, target2, now) {
          let event2 = get.event();
          if (event2.nodistance) return true;
        }
      }
    },
    //剑兔 近卫阿米娅
    amy_qingyanmrfz: {
      audio: 2,
      trigger: { player: "phaseUseEnd" },
      intro: {
        content: function(event2, player2) {
          var str = "";
          var list = [player2.hasSkill("amy_qingyanmrfz_damage"), player2.hasSkill("amy_qingyanmrfz_time"), player2.hasSkill("amy_qingyanmrfz_direct")];
          var text = ["·你每回合使用的第一张【杀】的伤害基数+1</br>", "·你使用【杀】的次数+1</br>", "·你使用的【杀】需要两张【闪】才可抵消</br>"];
          for (var i2 = 0; i2 < list.length; i2++) {
            if (list[i2]) str = str + text[i2];
          }
          return str;
        }
      },
      filter: function(event2, player2) {
        return !player2.storage.amy_qingyanmrfz_time || !player2.storage.amy_qingyanmrfz_damage || !player2.storage.amy_qingyanmrfz_direct;
      },
      check: function(event2, player2) {
        return game.hasPlayer(function(current) {
          return current != player2 && get.attitude(current, player2) > 2;
        });
      },
      content: function() {
        "step 0";
        player.chooseTarget("【青焱】：请选择一名其他角色", true, function(card2, player2, target3) {
          return target3 != player2;
        }).set("ai", function(target3) {
          _status.event.player;
          var att = get.attitude(_status.event.player, target3);
          return att > 2;
        });
        if (result.bool) {
          var target2 = result.targets[0], list = [];
          event.target = target2;
          if (!player.storage.amy_qingyanmrfz_time) list.push("你使用【杀】的次数+1");
          if (!player.storage.amy_qingyanmrfz_damage) list.push("你每回合使用的第一张【杀】的伤害基数+1");
          if (!player.storage.amy_qingyanmrfz_direct) list.push("你使用的【杀】需要两张【闪】才可抵消");
          if (list.length == 1) {
            if (!player.storage.amy_qingyanmrfz_time) {
              player.storage.amy_qingyanmrfz_time = true;
              target2.addSkill("amy_qingyanmrfz_time");
            }
            if (!player.storage.amy_qingyanmrfz_damage) {
              player.storage.amy_qingyanmrfz_damage = true;
              target2.addSkill("amy_qingyanmrfz_damage", false);
              target2.addMark("amy_qingyanmrfz");
            }
            if (!player.storage.amy_qingyanmrfz_direct) {
              player.storage.amy_qingyanmrfz_direct = true;
              target2.addSkill("amy_qingyanmrfz_direct", false);
              target2.addMark("amy_qingyanmrfz");
            }
            event.finish();
          } else {
            player.chooseControl(list).set("prompt", "请选择删除一句话并令" + get.translation(target2) + "获得该效果").set("ai", function() {
              return [0, 1, 2].randomGet();
            });
          }
        } else event.finish();
        if (result.control == "你使用【杀】的次数+1") {
          event.target.addMark("amy_qingyanmrfz", false);
          player.storage.amy_qingyanmrfz_time = true;
          event.target.addSkill("amy_qingyanmrfz_time");
        }
        if (result.control == "你每回合使用的第一张【杀】的伤害基数+1") {
          event.target.addMark("amy_qingyanmrfz", false);
          player.storage.amy_qingyanmrfz_damage = true;
          event.target.addSkill("amy_qingyanmrfz_damage");
        }
        if (result.control == "你使用的【杀】需要两张【闪】才可抵消") {
          event.target.addMark("amy_qingyanmrfz", false);
          player.storage.amy_qingyanmrfz_direct = true;
          event.target.addSkill("amy_qingyanmrfz_direct");
        }
      },
      ai: {
        expose: 0.1,
        threaten: 1.1
      },
      group: ["amy_qingyanmrfz_damage", "amy_qingyanmrfz_time", "amy_qingyanmrfz_direct"],
      subSkill: {
        direct: {
          audio: "amy_qingyanmrfz",
          trigger: {
            player: "useCardToPlayered"
          },
          forced: true,
          filter: function(event2, player2) {
            if (player2.storage.amy_qingyanmrfz_direct == true && player2.hasSkill("amy_qingyanmrfz_mark")) return false;
            return event2.card.name == "sha" && !event2.getParent().directHit.includes(event2.target) && get.distance(player2, event2.target) <= 1;
          },
          logTarget: "target",
          content: function() {
            var id2 = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id2]) map[id2] = {};
            if (typeof map[id2].shanRequired == "number") {
              map[id2].shanRequired++;
            } else {
              map[id2].shanRequired = 2;
            }
          },
          ai: {
            directHit_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player2, arg.target) > 1) return false;
            }
          },
          group: "amy_qingyanmrfz_remove2"
        },
        remove2: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return !player2.hasSkill("amy_qingyanmrfz");
          },
          content: function() {
            player.removeSkill("amy_qingyanmrfz_direct");
            player.removeMark("amy_qingyanmrfz", false);
            game.countPlayer(function(current) {
              if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_direct = false;
            });
          }
        },
        time: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return !player2.hasSkill("amy_qingyanmrfz");
          },
          content: function() {
            player.removeMark("amy_qingyanmrfz", false);
            player.removeSkill("amy_qingyanmrfz_time");
            game.countPlayer(function(current) {
              if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_time = false;
            });
          },
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha" && (!player2.storage.amy_qingyanmrfz || player2.hasMark("amy_qingyanmrfz"))) return num + 1;
            }
          }
        },
        damage: {
          audio: "amy_qingyanmrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            if (player2.storage.amy_qingyanmrfz_damage && player2.hasSkill("amy_qingyanmrfz_mark")) return false;
            if (player2.hasSkill("amy_qingyanmrfz_mark")) return false;
            return event2.card && event2.card.name == "sha";
          },
          content: function() {
            if (!trigger.baseDamage) trigger.baseDamage = 1;
            trigger.baseDamage++;
            player.addTempSkill("amy_qingyanmrfz_mark", "phaseEnd");
          },
          ai: {
            damageBonus: true
          },
          group: "amy_qingyanmrfz_remove1"
        },
        remove1: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return !player2.hasSkill("amy_qingyanmrfz");
          },
          content: function() {
            player.removeSkill("amy_qingyanmrfz_damage");
            player.removeMark("amy_qingyanmrfz", false);
            game.countPlayer(function(current) {
              if (current.hasSkill("amy_qingyanmrfz")) current.storage.amy_qingyanmrfz_damage = false;
            });
          }
        },
        mark: {
          silent: true,
          charlotte: true
        }
      }
    },
    yingxiaomrfz: {
      audio: 4,
      intro: {
        content: function(event2, player2) {
          if (player2.storage.yingxiaomrfz) return "已发动";
          if (!player2.storage.yingxiaomrfz) {
            if (player2.countMark("yingxiaomrfz_mark") < 5) return "未发动（不满足发动条件）</br>已累计使用" + player2.countMark("yingxiaomrfz_mark") + "张【杀】";
            else return "未发动（已满足发动条件）";
          }
        }
      },
      mark: true,
      limited: true,
      animationStr: "影宵",
      animationColor: "gold",
      trigger: { player: "phaseZhunbeiBegin" },
      check: function(event2, player2) {
        return game.hasPlayer(function(current) {
          return current != player2 && get.attitude(current, player2) < 0 && player2.inRange(current);
        });
      },
      init: function(player2) {
        player2.storage.yingxiaomrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.yingxiaomrfz && player2.countMark("yingxiaomrfz_mark") >= 5;
      },
      content: function() {
        "step 0";
        player.storage.yingxiaomrfz = true;
        player.awakenSkill(event.name);
        event.num = 0;
        if (event.num < 3) {
          if (event.num == 2) {
            player.addTempSkill("yingxiaomrfz_damage", "useCardAfter");
            player.addTempSkill("yingxiaomrfz_wushi", "useCardAfter");
            player.addTempSkill("yingxiaomrfz_total", "useCardAfter");
            player.chooseUseTarget(
              {
                name: "sha",
                isCard: true
              },
              "请选择【杀】的目标",
              false
            );
          } else {
            player.addTempSkill("yingxiaomrfz_total", "useCardAfter");
            player.chooseUseTarget(
              {
                name: "sha",
                nature: event.num == 0 ? "thunder" : "fire",
                isCard: true
              },
              "请选择" + (event.num == 0 ? "雷【杀】" : "火【杀】") + "的目标(下一张使用的牌为：" + (event.num == 0 ? "火【杀】" : "伤害基数为翻倍且无视防具的【杀】") + ")",
              false
            );
            player.logSkill("yingxiaomrfz");
          }
          event.num++;
          if (event.num < 3) event.redo();
        }
        player.draw(player.countMark("yingxiaomrfz_total"));
        player.addSkill("yingxiaomrfz_handlit");
        player.addSkill("yingxiaomrfz_round2");
      },
      group: "yingxiaomrfz_time",
      subSkill: {
        mark: {
          charlotte: true
        },
        time: {
          silent: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha" && player2.countMark("yingxiaomrfz_mark") < 5;
          },
          content: function() {
            player.addMark("yingxiaomrfz_mark", false);
          }
        },
        damage: {
          forced: true,
          charlotte: true,
          trigger: { player: "useCard2" },
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha";
          },
          content: function() {
            if (!trigger.baseDamage) trigger.baseDamage = 1;
            trigger.baseDamage += 2;
          },
          ai: {
            damageBonus: true
          }
        },
        wushi: {
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2) {
            return event2.card.name == "sha";
          },
          silent: true,
          logTarget: "target",
          content: function() {
            trigger.target.addTempSkill("qinggang2");
            trigger.target.storage.qinggang2.add(trigger.card);
            trigger.target.markSkill("qinggang2");
          },
          ai: {
            unequip_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              if (arg && arg.name == "sha") return true;
              return false;
            }
          }
        },
        total: {
          silent: true,
          charlotte: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          content: function() {
            player.addMark("yingxiaomrfz_total", trigger.num, false);
          }
        },
        handlit: {
          silent: true,
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num + player2.countMark("yingxiaomrfz_total");
            }
          }
        },
        round1: {
          silent: true,
          charlotte: true,
          trigger: {
            global: "roundStart"
          },
          content: function() {
            player.addMark("yingxiaomrfz_round1", false);
            if (player.countMark("yingxiaomrfz_round1") > 2) {
              player.removeSkill("yingxiaomrfz_round2");
              player.removeMark("yingxiaomrfz_round1", player.countMark("yingxiaomrfz_round1"), false);
            }
          }
        },
        round2: {
          audio: "yingxiaomrfz",
          trigger: { source: "damageBefore" },
          forced: true,
          charlotte: true,
          mark: true,
          intro: {
            content: function(event2, player2) {
              return "你造成的伤害均视为体力流失</br>效果剩余时间：" + (2 - player2.countMark("yingxiaomrfz_round1")) + "轮";
            }
          },
          check: function() {
            return false;
          },
          content: function() {
            trigger.cancel();
            trigger.player.loseHp(trigger.num);
          },
          ai: {
            jueqing: true
          },
          group: "yingxiaomrfz_round1"
        }
      }
    },
    //芙兰卡
    jifengmrfz: {
      audio: 2,
      trigger: {
        player: "useCard2"
      },
      filter: function(event2, player2) {
        if (event2.targets && event2.targets.length > 1) return false;
        return event2.cards && event2.card.name == "sha";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.targets[0]) < 0;
      },
      prompt: function(event2, player2) {
        var target2 = event2.targets[0], list = [];
        if (!target2.hasEmptySlot(2)) list.push("无视防具");
        if (target2.countCards("h") > 0) list.push("此【杀】需要两张闪才可抵消");
        if (target2.hujia > 0) list.push("无视护甲");
        return "【极锋】:是否对" + get.translation(target2) + "发动‘极锋’？（" + list + "）";
      },
      content: function() {
        var target2 = trigger.targets[0], num = 0;
        if (!target2.hasEmptySlot(2)) {
          num++;
          target2.addTempSkill("qinggang2");
          target2.storage.qinggang2.add(trigger.card);
          target2.markSkill("qinggang2");
        }
        if (target2.countCards("h") > 0) {
          num++;
          player.addTempSkill("jifengmrfz_sha");
          player.storage.jifengmrfz = {
            card: trigger.card
          };
        }
        if (target2.hujia > 0) {
          target2.addTempSkill("jifengmrfz_ighujia");
          target2.storage.jifengmrfz_ighujia.add(trigger.card);
          target2.markSkill("jifengmrfz_ighujia");
          num++;
        }
        if (!player.hasSkill("jifengmrfz_used")) {
          player.addTempSkill("jifengmrfz_used", "phaseEnd");
          player.draw(3 - num);
        }
      },
      subSkill: {
        sha: {
          trigger: {
            player: "useCardToPlayered"
          },
          forced: true,
          silent: true,
          filter: function(event2, player2) {
            var info = player2.storage.jifengmrfz;
            if (!event2.card || event2.card != info.card) return false;
            return event2.card.name == "sha" && !event2.getParent().directHit.includes(event2.target);
          },
          logTarget: "target",
          content: function() {
            var id2 = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id2]) map[id2] = {};
            if (typeof map[id2].shanRequired == "number") {
              map[id2].shanRequired++;
            } else {
              map[id2].shanRequired = 2;
            }
            delete player.storage.jifengmrfz;
            player.removeSkill("jifengmrfz_sha");
          },
          ai: {
            directHit_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1 || get.distance(player2, arg.target) > 1) return false;
            }
          }
        },
        used: {
          charlotte: true
        },
        ighujia: {
          ai: {
            nohujia: true
          },
          init: function(player2, skill) {
            if (!player2.storage[skill]) player2.storage[skill] = [];
          },
          onremove: true,
          trigger: {
            player: ["damage", "damageCancelled", "damageZero"],
            source: ["damage", "damageCancelled", "damageZero"],
            target: ["shaMiss", "useCardToExcluded", "useCardToEnd", "eventNeutralized"],
            global: ["useCardEnd"]
          },
          charlotte: true,
          firstDo: true,
          filter: function(event2, player2) {
            return player2.storage.jifengmrfz_ighujia && event2.card && player2.storage.jifengmrfz_ighujia.includes(event2.card) && (event2.name != "damage" || event2.notLink());
          },
          silent: true,
          forced: true,
          popup: false,
          priority: 12,
          content: function() {
            player.storage.jifengmrfz_ighujia.remove(trigger.card);
            if (!player.storage.jifengmrfz_ighujia.length) player.removeSkill("jifengmrfz_ighujia");
          },
          marktext: "✘",
          intro: {
            name: "✘",
            content: "当前护甲已失效"
          }
        }
      },
      ai: {
        threaten: 1.2
      }
    },
    xiqiaomrfz: {
      audio: 2,
      trigger: {
        player: ["chooseToRespondBegin", "chooseToUseBegin"]
      },
      filter: function(event2, player2) {
        if (player2.hasSkill("xiqiaomrfz_used")) return false;
        if (event2.responded) return false;
        if (!event2.filterCard || !event2.filterCard({ name: "shan" }, player2, event2)) return false;
        if (event2.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player2, event2)) return false;
        return true;
      },
      check: () => 1,
      content: function() {
        "step 0";
        player.addTempSkill("xiqiaomrfz_used", "phaseEnd");
        var next = player.chooseToDiscard("he", true);
        next.set("prompt", "【细巧】:你可以弃置一张牌，然后摸一张牌并展示之，若类型不同，视为使用或打出一张【闪】");
        if (result.cards) {
          event.card = result.cards[0];
          player.draw("visible");
        } else event.finish();
        var card2 = result[0];
        var cardl = event.card;
        if (get.type2(card2) != get.type2(cardl)) {
          trigger.untrigger();
          trigger.set("responded", true);
          trigger.result = { bool: true, card: { name: "shan", isCard: true } };
        }
      },
      subSkill: {
        used: {
          charlotte: true
        }
      },
      ai: {
        respondShan: true,
        threaten: 0.8
      }
    },
    //D32 星极
    tianyimrfz: {
      audio: 2,
      mark: true,
      locked: false,
      zhuanhuanji: true,
      marktext: "☯",
      init: function(player2, skill) {
        player2.storage[skill] = true;
      },
      intro: {
        content: function(storage, player2, skill) {
          if (player2.storage.tianyimrfz == true) return "观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底";
          return "进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）";
        }
      },
      trigger: { global: "phaseJudgeBegin" },
      prompt: function(event2, player2) {
        if (player2.storage.tianyimrfz == true)
          var str = "观看牌堆顶两张牌，并将其置于牌堆顶或牌堆底";
        else var str = "进行一次判定，并获得判定牌，本回合此牌视为【闪】，若判定结果为♣，你本局游戏使用【杀】的次数+1（至多+3）";
        return "【天仪】:你可以" + str;
      },
      callback: function() {
        if (event.judgeResult.suit == "club") {
          if (player.countMark("tianyimrfz_shacount") < 3) player.addMark("tianyimrfz_shacount", false);
        }
        player.gain(card, "gain2").gaintag.add("tianyimrfz");
        player.addTempSkill("tianyimrfz_remove", "phaseEnd");
      },
      content: function() {
        if (player.storage.tianyimrfz) player.chooseToGuanxing(2);
        else
          player.judge(function(card2) {
            if (get.suit(card2) == "club") return 0;
            return -4;
          }).set("callback", lib.skill.tianyimrfz.callback);
        player.changeZhuanhuanji("tianyimrfz");
      },
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num + player2.countMark("tianyimrfz_shacount");
        }
      },
      subSkill: {
        shacount: {
          charlotte: true,
          intro: {
            content: "使用【杀】的次数+#"
          }
        },
        remove: {
          onremove: function(player2) {
            player2.removeGaintag("tianyimrfz");
          },
          charlotte: true,
          mod: {
            cardname: function(card2, player2, name) {
              if (card2.hasGaintag("tianyimrfz")) return "shan";
            }
          }
        }
      }
    },
    huijianmrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (!event2.targets || event2.targets.length > 1) return false;
        if (!player2.canUseToAnyone(event2.card, true, false)) return false;
        if (!player2.isPhaseUsing()) return false;
        if (player2.getCardUsable("sha") < 1) return false;
        return get.type(event2.card) == "trick" || get.type(event2.card) == "basic";
      },
      usable: 1,
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget([1, player.getCardUsable("sha")], get.prompt("huijianmrfz"), "为" + get.translation(trigger.card) + "增加至多" + player.getCardUsable("sha") + "个目标", function(card2, player2, target2) {
          return !_status.event.sourcex.includes(target2) && player2.canUse(_status.event.card, target2);
        }).set("sourcex", trigger.targets).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.effect(target2, _status.event.card, player2, player2);
        }).set("card", trigger.card).setHiddenSkill(event.name);
        if (result.bool) {
          if (!event.isMine() && !event.isOnline()) game.delayx();
          for (var i2 = 0; i2 < result.targets.length; i2++) {
            trigger.targets.push(result.targets[i2]);
            player.line(result.targets[i2]);
          }
          player.logSkill("huijianmrfz");
          player.addMark("huijianmrfz_minus", result.targets.length, false);
          player.addTempSkill("huijianmrfz_minus", "phaseUseAfter");
        } else {
          player.storage.counttrigger.huijianmrfz--;
        }
      },
      subSkill: {
        minus: {
          onremove: function(player2) {
            player2.removeMark("huijuanmrfz_minus", player2.countMark("huijuanmrfz_minus"), false);
          },
          charlotte: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num - player2.countMark("huijianmrfz_minus");
            }
          }
        }
      }
    },
    bingmingmrfz: {
      audio: 2,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        if (!game.findPlayer(function(current) {
          current.name == "xingyuanmrfz";
        }))
          return false;
        return game.roundNumber == 2;
      },
      forced: true,
      content: function() {
        var target2 = game.findPlayer(function(current) {
          current.name == "xingyuanmrfz";
        });
        var num1 = player.countCards("h") - target2.countCards("h");
        var num2 = player.getHandcardLimit() - target2.getHandcardLimit();
        if (num1 > 0) {
          player.chooseToDiscard(true, "【病鸣】:请将手牌调整至" + num1, num1);
        } else if (num1 < 0) player.drawTo(-num1);
        if (num2 != 0) {
          player.addMark("bingmingmrfz", false, Math.abs(num2));
        }
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + player2.countMark("bingmingmrfz");
        }
      }
    },
    //星源
    daoliumrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 2,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      check: function(card2) {
        return 6 - get.value(card2);
      },
      filterCard: true,
      selectCard: 1,
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      selectTarget: 1,
      lose: false,
      discard: false,
      content: function() {
        "step 0";
        event.targetx = target;
        event.target = [];
        event.discard = [];
        event.discard.push(target);
        event.target.push(target.getNext());
        event.target.push(target.getPrevious());
        if (event.target.includes(player)) event.target.remove(player);
        player.give(cards, target);
        if (event.target.length && event.targetx.countCards("he") > 0) {
          event.targetx.chooseCard(true, "【导流】:请交给" + get.translation(event.target[0]) + "一张牌", "he");
        } else event.goto(3);
        if (result.cards) {
          var card2 = result.cards[0];
          event.targetx.give(card2, event.target[0]);
          event.discard.push(event.target[0]);
        }
        event.target.remove(event.target[0]);
        event.goto(1);
        if (event.discard.length) {
          if (event.discard[0].countCards("he") > 0) event.discard[0].chooseToDiscard(true, "he", "【导流】:请弃置一张牌");
          event.discard.remove(event.discard[0]);
          event.redo();
        }
      },
      ai: {
        order: 4,
        expose: 0.1,
        result: {
          target: function(player2, target2) {
            var pre = target2.getPrevious(), net = target2.getNext();
            if (game.countPlayer() == 2) return 0;
            if (get.attitude(pre, player2) > 2 && get.attitude(net, player2) > 2) return 0;
            return -1;
          }
        }
      }
    },
    gewumrfz: {
      audio: 2,
      trigger: {
        global: "gainEnd"
      },
      filter: function(event2, player2) {
        return event2.source && event2.source.isIn() && event2.source == player2 && event2.cards.length >= 1;
      },
      direct: true,
      logTarget: "source",
      content: function() {
        if (player.countMark("gewumrfz") < 5) {
          player.addMark("gewumrfz", false);
          player.logSkill("gewumrfz");
        }
        for (var i2 = 0; i2 < trigger.cards.length; i2++) {
          if (!player.getStorage("gewumrfz_mark").includes(trigger.cards[i2].name)) {
            player.markAuto("gewumrfz_mark", [trigger.cards[i2].name]);
            if (player.storage.gewumrfz_mark.length % 2 == 0) {
              player.draw();
              player.logSkill("gewumrfz");
            }
            if (player.storage.gewumrfz_mark.length % 4 == 0) {
              player.addMark("gewumrfz_draw", false);
              player.logSkill("gewumrfz");
            }
          }
        }
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + player2.countMark("gewumrfz");
        }
      },
      group: ["gewumrfz_mark", "gewumrfz_draw"],
      subSkill: {
        mark: {
          intro: {
            content: function(event2, player2) {
              return "记录的牌名：" + get.translation(player2.storage.gewumrfz_mark) + "</br>" + (player2.countMark("gewumrfz_draw") > 0 ? "额定摸牌数+" + player2.countMark("gewumrfz_draw") : "");
            }
          },
          onremove: true,
          charlotte: true
        },
        draw: {
          audio: "gewumrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return player2.countMark("gewumrfz_draw") > 0;
          },
          content: function() {
            trigger.num += player.countMark("gewumrfz_draw");
          }
        }
      }
    },
    //战车
    jiqiangmrfz: {
      audio: 2,
      derivation: ["DP27mrfz"],
      trigger: { global: "roundStart" },
      forced: true,
      filter: function(event2, player2) {
        return !player2.isDisabled(1) && (event2.name != "phase" || game.phaseNumber == 0);
      },
      content: function() {
        var card2 = game.createCard("DP27mrfz", "diamond", 13);
        player.$gain2(card2);
        game.delayx();
        player.equip(card2);
      },
      group: "jiqiangmrfz_get",
      subSkill: {
        get: {
          audio: "jiqiangmrfz",
          forced: true,
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return !player2.isDisabled(1) && player2.getCards("e", function(card2) {
              return get.name(card2) == "DP27mrfz";
            }).length == 0;
          },
          content: function() {
            var card2 = game.createCard("DP27mrfz", "diamond", 13);
            player.$gain2(card2);
            game.delayx();
            player.equip(card2);
          }
        }
      }
    },
    qingxiemrfz: {
      audio: 2,
      trigger: { player: "phaseDrawEnd" },
      firstDo: true,
      filter: function(event2, player2) {
        if (player2.skipList.includes("phaseUse")) return false;
        return game.countPlayer(function(current) {
          return player2.inRangeOf(current) && current != player2;
        }) > 0;
      },
      check: function(event2, player2) {
        if (get.value(player2.getCards("h")) >= 10) return false;
        if (game.countPlayer(function(current) {
          return player2.inRangeOf(current) && current != player2 && get.attitude(player2, current) < 0;
        }) < 1)
          return false;
        return true;
      },
      content: function() {
        "step 0";
        var next = player.chooseTarget("【倾泻】:请选择一名攻击范围内的其他角色", true, function(card2, target2, player2) {
          return target2 != player2 && player2.inRangeOf(target2);
        });
        next.ai = function(target2) {
          return get.effect(target2, { name: "sha" }, _status.event.player);
        };
        event.num = 0;
        event.skip = 0;
        if (result.targets) {
          event.target = result.targets[0];
        } else event.finish();
        if (!event.target.isAlive()) {
          event.goto(4);
        } else
          player.judge(function(card2) {
            var color = get.color(card2);
            if (color == "red") return 4;
            return -4;
          });
        if (result.color == "red") {
          player.useCard({ name: "sha", isCard: true }, false, event.target);
          event.skip++;
        }
        event.num++;
        if (event.num < 3) event.goto(2);
        if (event.skip > 1) {
          player.skip("phaseUse");
        }
      }
    },
    //闪盾 闪击
    shandunmrfz: {
      mod: {
        globalFrom: function(from, to, distance) {
          if (from.isAction()) return distance - 1;
          return distance + 1;
        },
        globalTo: function(from, to, distance) {
          if (!to.isAction()) return distance + 1;
          return distance - 1;
        }
      }
    },
    xuanmumrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (player2.storage.xuanmumrfz_roundcount >= 4) return false;
        if (!event2.targets || event2.targets.length > 1) return false;
        if (get.distance(player2, event2.targets[0]) > 1) return false;
        if (event2.targets[0].countCards("h") < 1) return false;
        var type = get.type(event2.card);
        return event2.targets[0] != player2 && (type == "basic" || type == "trick");
      },
      check: function(event2, player2) {
        return get.attitude(event2.targets[0], player2) < 0;
      },
      content: function() {
        "step 0";
        if (!player.storage.xuanmumrfz_roundcount) player.storage.xuanmumrfz_roundcount = 0;
        player.storage.xuanmumrfz_roundcount++;
        player.choosePlayerCard(trigger.targets[0], true, "h");
        if (result.cards) {
          var card2 = result.cards[0];
          event.card = result.cards[0];
          player.showCards(card2, get.translation(player) + "对" + get.translation(trigger.target) + "发动了【炫目】");
        }
        if (!canRespond(trigger.card, event.card)) {
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player && current == trigger.targets[0];
            })
          );
          if (trigger.targets[0].countGainableCards(player, "h")) {
            player.gainPlayerCard("h", trigger.targets[0], true);
          }
          if (Math.random() < 0.25) trigger.targets[0].chat("有闪盾！");
        }
        function canRespond(card1, card22) {
          if (typeof card1 === void 0 || typeof card22 === void 0) return false;
          var info1 = get.name(card1), info2 = get.name(card22);
          var tmp_bool = false;
          if ((info1 == "sha" || info1 == "wanjian") && info2 == "shan") tmp_bool = true;
          if ((info1 == "juedou" || info1 == "nanman") && info2 == "sha") tmp_bool = true;
          if (get.type(card1) == "trick" && info2 == "wuxie") tmp_bool = true;
          var str = (tmp_bool == true ? "" : "不") + "能响应";
          info1 = "<font color=rgb(255,255,122)>【" + get.translation(info1) + "】</font>";
          info2 = "<font color=rgb(255,255,122)>【" + get.translation(info2) + "】</font>";
          game.log(info2, str, info1);
          return tmp_bool;
        }
      },
      group: "xuanmumrfz_roundcount",
      subSkill: {
        roundcount: {
          mark: true,
          init: (player2) => {
            player2.storage.xuanmumrfz_roundcount = 0;
            player2.markSkill("xuanmumrfz_roundcount");
          },
          onremove: true,
          intro: {
            content: function(event2, player2) {
              return player2.storage.xuanmumrfz_roundcount + "/4";
            },
            markcount: function(event2, player2) {
              if (!player2.storage.xuanmumrfz_roundcount) return 4;
              return 4 - player2.storage.xuanmumrfz_roundcount;
            }
          },
          trigger: {
            global: "roundStart"
          },
          forced: true,
          popup: false,
          silent: true,
          content: () => {
            player.storage.xuanmumrfz_roundcount = 0;
          }
        }
      }
    },
    chuandunmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "damageEnd" },
      content: function() {
        "step 0";
        player.draw("visible");
        if (result) {
          var card2 = result[0];
          if ((card2.suit == "heart" || card2.suit == "spade") && card2.number == 6) {
            player.loseHp(player.hp);
          }
        }
      }
    },
    //霜华 夹子妹
    tadianmrfz: {
      markimage: "extension/WhichWay/image/orther/shuanghuajiazimrfz.png",
      intro: {
        markcount: "expansion",
        mark: function(dialog, content, player2) {
          var content = player2.getExpansions("tadianmrfz");
          if (content && content.length) {
            if (player2 == game.me || player2.isUnderControl()) {
              dialog.addAuto(content);
            } else {
              return "共有" + get.cnNumber(content.length) + "张踏垫";
            }
          }
        },
        content: function(content, player2) {
          var content = player2.getExpansions("tadianmrfz");
          if (content && content.length) {
            if (player2 == game.me || player2.isUnderControl()) {
              return get.translation(content);
            }
            return "共有" + get.cnNumber(content.length) + "张踏垫";
          }
        }
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 2,
      trigger: { global: "roundStart" },
      forced: true,
      content: function() {
        "step 0";
        if (player.getExpansions("tadianmrfz").length > 0) {
          player.gain(player.getExpansions("tadianmrfz"), "gain2");
        }
        player.draw(3);
        player.chooseCard(true, 3, "【踏垫】:请选择将三张手牌置于你武将牌上").set("ai", function(card2) {
          return 8 - get.value(card2);
        });
        if (result.cards) {
          player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("tadianmrfz");
        }
      },
      group: "tadianmrfz_tri",
      subSkill: {
        rec: {
          trigger: { player: "dyingAfter" },
          silent: true,
          charlotte: true,
          content: function() {
            player.recover();
            player.removeSkill("tadianmrfz_rec");
          }
        },
        tri: {
          audio: "tadianmrfz",
          trigger: {
            target: "useCardToTargeted"
          },
          filter: function(event2, player2) {
            if (!event2.card || player2.getExpansions("tadianmrfz").length < 1) return false;
            return player2.getExpansions("tadianmrfz").filter(function(magic) {
              return magic.name == event2.card.name;
            }).length > 0;
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) < 0;
          },
          prompt: function(event2, player2) {
            return "【踏垫】:是否弃置一张‘踏垫’，令" + get.translation(event2.player) + "流失所有体力？";
          },
          content: function() {
            "step 0";
            var cards2 = player.getExpansions("tadianmrfz").filter(function(magic) {
              return get.name(magic) == get.name(trigger.card);
            });
            if (cards2.length) player.chooseButton(["你可以选择移去一张与其使用的牌的牌名相同的“踏垫”，令其流失所有体力", cards2]);
            else event.finish();
            if (result.bool) {
              player.loseToDiscardpile(result.links);
              player.draw(3);
              trigger.player.loseHp(trigger.player.hp);
              trigger.player.addSkill("tadianmrfz_rec");
            }
          }
        }
      }
    },
    xinjimrfz: {
      audio: 2,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      direct: true,
      filter: function(event2, player2) {
        return player2.getExpansions("tadianmrfz").length > 0 && player2.countCards("h") > 0;
      },
      content: function() {
        "step 0";
        var cards2 = player.getExpansions("tadianmrfz");
        if (!cards2.length || !player.countCards("h")) {
          event.finish();
          return;
        }
        var next = player.chooseToMove("【踏垫】：是否交换“踏垫”和手牌？");
        next.set("list", [
          [get.translation(player) + "（你）的‘踏垫’", cards2],
          ["手牌区", player.getCards("h")]
        ]);
        next.set("filterMove", function(from, to) {
          return typeof to != "number";
        });
        next.set("processAI", function(list) {
          var player2 = _status.event.player, cards3 = list[0][1].concat(list[1][1]).sort(function(a, b) {
            return get.value(a) - get.value(b);
          }), cards22 = cards3.splice(0, player2.getExpansions("tadianmrfz").length);
          return [cards22, cards3];
        });
        if (result.bool) {
          var pushs = result.moved[0], gains = result.moved[1];
          pushs.removeArray(player.getExpansions("tadianmrfz"));
          gains.removeArray(player.getCards("h"));
          if (!pushs.length || pushs.length != gains.length) return;
          player.logSkill("tadianmrfz");
          player.addToExpansion(pushs, player, "giveAuto").gaintag.add("tadianmrfz");
          game.log(player, "交换了手牌区与‘踏垫’的牌");
          player.gain(gains, "draw");
        }
      }
    },
    //柏喙
    yirenmrfz: {
      audio: 4,
      chargeGet: 1,
      chargeSkill: true,
      forced: true,
      onremove: true,
      trigger: {
        player: "phaseJieshuBegin"
      },
      filter: function(event2, player2) {
        var num = 0;
        var history = player2.getHistory("useCard");
        for (var i2 = 0; i2 < history.length; i2++) {
          if (history[i2].card.name == "sha" && history[i2].isPhaseUsing()) {
            num++;
          }
        }
        if (player2.countMark("charge") + player2.getCardUsable("sha") - num >= 15) return false;
        return player2.getCardUsable("sha") - num > 0;
      },
      content: function() {
        var num = 0;
        var history = player.getHistory("useCard");
        for (var i2 = 0; i2 < history.length; i2++) {
          if (history[i2].card.name == "sha" && history[i2].isPhaseUsing()) {
            num++;
          }
        }
        num = player.getCardUsable("sha") - num;
        num = Math.min(num, 15 - player.countMark("charge"));
        player.addMark("charge", num);
      },
      group: "yirenmrfz_use",
      subSkill: {
        lim: {
          silent: true,
          charlotte: true,
          onremove: true,
          intro: {
            content: "下回合使用【杀】的次数-#"
          },
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num - player2.countMark("yirenmrfz_lim");
            }
          }
        },
        use: {
          init: (player2, skill) => player2.storage[skill] = 1,
          audio: "yirenmrfz",
          enable: "phaseUse",
          filter: function(event2, player2) {
            if (player2.countMark("charge") < player2.storage.yirenmrfz_use) return false;
            if (player2.countCards("h") < 2) return false;
            return game.hasPlayer(function(current) {
              return current != player2 && player2.canUse("sha", current);
            });
          },
          selectCard: 2,
          position: "h",
          filterCard: true,
          selectTarget: [1, 2],
          filterTarget: function(card2, player2, target2) {
            return player2.canUse("sha", target2) === true && target2 != player2;
          },
          multitarget: true,
          multiline: true,
          check: function(card2) {
            return 8 - get.value(card2);
          },
          prompt: "【异刃】：请弃置两张手牌并选择至多两名角色",
          content: function() {
            for (i of targets) {
              if (player.canUse("sha", i)) player.useCard({ name: "sha", isCard: true }, i, false);
              i.addTempSkill("yirenmrfz_lim", { player: "phaseEnd" });
              i.addMark("yirenmrfz_lim", false);
            }
            player.removeMark("charge", player.storage.yirenmrfz_use);
            player.storage.yirenmrfz_use++;
          },
          ai: {
            order: function(item, player2) {
              if (player2.hasSkillTag("presha", true, null, true)) return 10;
              if (game.hasNature(item, "linked")) {
                if (game.hasPlayer(function(current) {
                  return current != player2 && current.isLinked() && player2.canUse(item, current, null, true) && get.effect(current, item, player2, player2) > 0 && lib.card.sha.ai.canLink(player2, current, item);
                }) && game.countPlayer(function(current) {
                  return current.isLinked() && get.damageEffect(current, player2, player2, get.nature(item)) > 0;
                }) > 1)
                  return 3.1;
                return 3;
              }
              return 3.05;
            },
            result: {
              target: function(player2, target2) {
                var enemyIR = game.filterPlayer(function(current) {
                  return current != player2 && get.attitude(player2, current) < 0 && player2.canUse("sha", current);
                });
                if (enemyIR.length < 1) return 0;
                else if (enemyIR.length == 1) {
                  if (target2.hp <= 2) return -4;
                }
                return -1;
              }
            }
          }
        }
      }
    },
    shehunmrfz: {
      trigger: {
        source: "damageEnd"
      },
      intro: {
        content: "使用【杀】的次数+#"
      },
      onremove: true,
      forced: true,
      popup: false,
      filter: function(event2, player2) {
        return player2.countMark("shehunmrfz") < 5;
      },
      content: function() {
        var mark = player.countMark("shehunmrfz");
        var num = trigger.num;
        if (mark + num > 5) var add = 5 - mark;
        else var add = num;
        player.addMark("shehunmrfz", add, false);
      },
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num + player2.countMark("shehunmrfz");
        }
      }
    },
    //白面鸮
    jinaomrfz: {
      audio: 2,
      mark: true,
      marktext: "机脑",
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.jinaomrfz;
          if (storage == true) return "递增";
          if (storage == false) return "递减";
          return "无限制";
        }
      },
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        var history = player2.getHistory("useCard");
        if (history.indexOf(event2) != 1) return false;
        return history[0].card.number != void 0 && history[1].card.number != void 0;
      },
      direct: true,
      content: function() {
        var history = player.getHistory("useCard");
        if (history[0].card.number < history[1].card.number) {
          player.storage.jinaomrfz = true;
          player.marks.jinaomrfz.innerText = "递增";
        } else {
          player.storage.jinaomrfz = false;
          player.marks.jinaomrfz.innerText = "递减";
        }
        player.storage.jinaomrfz_lim = history[1].card.number;
        player.addTempSkill("jinaomrfz_lim", "phaseEnd");
      },
      group: ["jinaomrfz_draw"],
      subSkill: {
        handlit: {
          onremove: true,
          charlotte: true,
          intro: {
            content: "手牌上限+#"
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num + player2.countMark("jinaomrfz_handlit");
            }
          }
        },
        draw: {
          trigger: { player: "useCardAfter" },
          lastDo: true,
          forced: true,
          audio: "jinaomrfz",
          filter: function(event2, player2) {
            var history = player2.getHistory("useCard");
            if (history.length < 2) return false;
            if (!history[history.length - 2].card.color || get.color(event2.card) == "none") return false;
            return history[history.length - 2].card.color == get.color(event2.card);
          },
          content: function() {
            var color = get.color(trigger.card);
            if (color == "red") player.draw(2);
            else {
              player.addTempSkill("jinaomrfz_handlit", "phaseEnd");
              player.addMark("jinaomrfz_handlit", false);
            }
          }
        },
        lim: {
          onremove: function(player2) {
            player2.marks.jinaomrfz.text.innerText = "机脑";
            delete player2.storage.jinaomrfz;
            delete player2.storage.jinaomrfz_lim;
          },
          direct: true,
          charlotte: true,
          trigger: { player: "useCardAfter" },
          firstDo: true,
          filter: function(event2, player2) {
            if (!event2.card.number) return false;
            return true;
          },
          content: function() {
            player.storage.jinaomrfz_lim = trigger.card.number;
            var cards2 = player.getCards("h");
            var max, min;
            for (var i2 = 0; i2 < cards2.length; i2++) {
              var num = cards2[i2].number;
              if (i2 == 0) {
                max = num;
                min = num;
                continue;
              }
              if (num > max) max = num;
              if (min > num) min = num;
            }
            if (trigger.card.number >= max) {
              player.storage.jinaomrfz = false;
              player.marks.jinaomrfz.text.innerText = "递减";
              player.draw();
              player.logSkill("jinaomrfz");
            }
            if (trigger.card.number <= min) {
              player.storage.jinaomrfz = true;
              player.marks.jinaomrfz.text.innerText = "递增";
              player.draw();
              player.logSkill("jinaomrfz");
            }
          },
          mod: {
            cardEnabled2: function(card2, player2) {
              if (player2.storage.jinaomrfz == true) {
                if (card2.number && card2.number <= player2.storage.jinaomrfz_lim) return false;
              } else {
                if (card2.number && card2.number >= player2.storage.jinaomrfz_lim) return false;
              }
            }
          }
        }
      }
    },
    wutaimrfz: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      direct: true,
      filter: function(event2, player2) {
        var cards2 = player2.getCards("h");
        if (cards2.length < 2) return false;
        for (var i2 = 0; i2 < cards2.length; i2++) {
          if (i2 == 0) {
            var tmp_cards = cards2[i2];
            continue;
          }
          if (get.type2(tmp_cards) != get.type2(cards2[i2])) return true;
          if (get.color(tmp_cards) != get.color(cards2[i2])) return true;
          tmp_cards = cards2[i2];
        }
        return false;
      },
      content: function() {
        "step 0";
        player.chooseToDiscard(2, "h", false, "【五肽】：你可以弃置两张类型或颜色不相同的手牌并选择一名角色，直到你的下个回合开始，其每回合第一次受到的伤害-1", function(card2) {
          if (ui.selected.cards.length == 0) return true;
          if (ui.selected.cards.length) {
            return get.type2(card2, player) != get.type2(ui.selected.cards[0], player) || get.color(card2, player) != get.color(ui.selected.cards[0], player);
          }
          return false;
        }).set("complexCard", true).set("ai", function(card2) {
          return 10 - get.value(card2);
        });
        if (result.bool) {
          player.chooseTarget("【五肽】：请选择一名角色", true, function(card2, player2, target2) {
            return !target2.hasSkill("wutaimrfz_eff");
          }).ai = function(target2) {
            var att = get.attitude(player, target2);
            if (target2.hp < 3) att /= 1.5;
            return att;
          };
        } else event.finish();
        if (result.targets) {
          player.logSkill("wutaimrfz_eff", result.targets[0]);
          player.addTempSkill("wutaimrfz_eff", { player: "phaseBegin" });
          player.storage.wutaimrfz_eff = result.targets[0];
        }
      },
      subSkill: {
        mark: {
          charlotte: true
        },
        eff: {
          onremove: true,
          audio: "wutaimrfz",
          mark: true,
          intro: {
            content: function(event2, player2) {
              var char = get.translation(player2.storage.wutaimrfz_eff);
              if (player2.hasSkill("wutaimrfz_mark")) return "本回合" + char + "已触发过此效果";
              return char + "受到的伤害-1";
            }
          },
          trigger: {
            global: "damageBegin"
          },
          forced: true,
          charlotte: true,
          logTarget: "player",
          filter: function(event2, player2) {
            if (player2.hasSkill("wutaimrfz_mark")) return false;
            return event2.player == player2.storage.wutaimrfz_eff;
          },
          content: function() {
            player.addTempSkill("wutaimrfz_mark", "phaseEnd");
            trigger.num--;
          }
        }
      }
    },
    //刺玫
    huabumrfz: {
      audio: 2,
      global: "huabumrfz_eff",
      subSkill: {
        eff: {
          enable: "phaseUse",
          usable: 1,
          filter: function(event2, player2) {
            return !player2.hasSkill("huabumrfz") && game.hasPlayer((current) => {
              return current.hasSkill("huabumrfz");
            });
          },
          content: function() {
            "step 0";
            var targets2 = game.filterPlayer((current) => {
              return current.hasSkill("huabumrfz");
            });
            if (targets2.length == 1) {
              player.logSkill("huabumrfz", targets2);
              event.targets = targets2[0];
              event.goto(2);
            } else if (targets2.length > 1) {
              player.chooseTarget(true, "选择【花卜】的目标", function(card3, player2, target2) {
                return _status.event.list.includes(target2);
              }).set("list", targets2).set("ai", function(target2) {
                var player2 = _status.event.player;
                return get.attitude(player2, target2);
              });
            } else event.finish();
            if (result.targets) {
              player.logSkill("huabumrfz", event.targets);
              event.targets = result.targets[0];
            } else event.finish();
            if (event.targets) {
              event.targets.draw();
            } else event.finish();
            if (result) {
              var card2 = result[0];
              var cards2 = player.getCards("h");
              var bool = false;
              for (i of cards2) {
                if (get.type2(i) == get.type2(card2)) {
                  bool = true;
                  break;
                }
              }
              event.is = bool;
              event.targets.chooseControl("有", "没有").set("prompt", "【花卜】:" + get.translation(player) + "手牌中是否有与" + get.translation(card2) + "(" + get.translation(get.type2(card2)) + ")类型相同的牌？").set("ai", function() {
                var player2 = _status.event.player, is = _status.event.is, target2 = _status.event.target;
                is = is === true ? "有" : "没有";
                if (get.attitude(player2, target2) > 0 && target2.hasSkill("shixinmrfz")) return is;
                else if (target2.hasSkill("shixinmrfz")) return !is;
                return ["有", "没有"].randomGet();
              }).set("is", event.is).set("target", event.targets);
            } else event.finish();
            if (result.control) {
              var bool = result.control == "有" ? true : false;
              if (event.is == bool) {
                player.draw();
                event.targets.draw();
              } else {
                event.targets.chooseToDiscard(true, "【花卜】:请选择弃置一张牌");
              }
            }
          },
          ai: {
            order: 13,
            threaten: 1.5,
            result: {
              player: function(player2, target2) {
                var target2 = game.findPlayer(function(current) {
                  return current.hasSkill("huabumrfz");
                });
                if (target2) {
                  return get.attitude(player2, target2);
                }
              }
            }
          }
        }
      }
    },
    shixinmrfz: {
      audio: 2,
      trigger: { player: "gainAfter" },
      filter: function(event2, player2) {
        if (!_status.currentPhase) return false;
        if (player2.hasSkill("shixinmrfz_ban")) return false;
        if (_status.currentPhase.countCards("h") == 0) return false;
        return _status.currentPhase != player2;
      },
      prompt: "【识心】:是否观看当前回合角色的手牌？",
      content: function() {
        player.viewHandcards(_status.currentPhase);
        player.addTempSkill("shixinmrfz_ban", "phaseEnd");
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //红
    qunlangmrfz: {
      audio: 2,
      trigger: {
        player: "showCharacterAfter"
      },
      hiddenSkill: true,
      filter: function(event2, player2) {
        if (!event2.toShow || !event2.toShow.includes("hongmrfz")) return false;
        return game.hasPlayer((current) => {
          return current != player2 && player2.inRangeOf(current);
        });
      },
      check: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && player2.inRangeOf(current) && get.attitude(current, player2) < 0;
        });
      },
      prompt: "【群狼】:你可以对你攻击范围内的一名其他角色造成一点伤害",
      content: function() {
        "step 0";
        player.chooseTarget(true, "【群狼】:请选择一名其他角色并对其造成一点伤害", function(card2, player2, target3) {
          return target3 != player2 && player2.inRangeOf(target3);
        }).set("ai", function(target3) {
          var player2 = _status.event.player;
          return get.damageEffect(target3, player2, player2);
        });
        if (result.bool) {
          var target2 = result.targets[0];
          target2.damage("player");
        }
      }
    },
    cigumrfz: {
      mod: {
        cardnature: function(card2, player2) {
          if (!card2.nature && card2.name == "sha") return "stab";
        }
      },
      audio: 2,
      trigger: {
        global: ["respond", "useCard"]
      },
      frequent: true,
      filter: function(event2, player2) {
        if (!event2.respondTo) return false;
        if (event2.player == player2) return false;
        if (player2 != event2.respondTo[0]) return false;
        else return event2.cards.filterInD("od").length > 0;
      },
      prompt: function(event2, player2) {
        var cards2 = event2.cards.filterInD("od");
        return "【刺骨】:是否获得" + get.translation(cards2) + "?";
      },
      content: function() {
        var cards2 = trigger.cards.filterInD("od");
        player.gain(cards2, "log", "gain2");
      }
    },
    qingchumrfz: {
      group: ["qingchumrfz_sha", "qingchumrfz_shan"],
      audio: 2,
      trigger: { player: ["useCard", "respond"] },
      filter: function(event2, player2) {
        var target2 = _status.currentPhase;
        if (!target2 || target2.countCards("he") == 0) return false;
        return event2.card && event2.card.name == "sha" && target2 != player2;
      },
      check: function(event2, player2) {
        var target2 = _status.currentPhase;
        return get.attitude(target2, player2) < 0;
      },
      prompt: function(event2, player2) {
        var target2 = _status.currentPhase;
        return "【清处】:是否弃置当前回合角色（" + get.translation(target2) + "）一张牌？";
      },
      content: function() {
        "step 0";
        var target2 = _status.currentPhase;
        if (!target2 || target2.countCards("he") == 0) event.finish();
        else player.discardPlayerCard(target2, "he", true);
        if (result.cards) {
          if (get.suit(result.cards[0]) == get.suit(trigger.card)) {
            event.goto(0);
          }
        }
      },
      subSkill: {
        shan: {
          audio: "qingchumrfz",
          enable: ["chooseToRespond", "chooseToUse"],
          filter: function(event2, player2) {
            return _status.currentPhase != player2;
          },
          filterCard: {
            name: "sha"
          },
          viewAs: {
            name: "shan"
          },
          prompt: "将一张杀当闪使用或打出",
          check: function() {
            return 1;
          },
          position: "hs",
          viewAsFilter: function(player2) {
            if (!player2.countCards("hs", "sha")) return false;
          },
          ai: {
            respondShan: true,
            skillTagFilter: function(player2) {
              if (!player2.countCards("hs", "sha") || _status.currentPhase != player2) return false;
            },
            effect: {
              target: function(card2, player2, target2, current) {
                if (get.tag(card2, "respondShan") && current < 0) return 0.6;
              }
            },
            order: 4,
            useful: -1,
            value: -1,
            basic: {
              useful: [7, 5.1, 2],
              value: [7, 5.1, 2]
            },
            result: {
              player: 1
            }
          }
        },
        sha: {
          audio: "qingchumrfz",
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function(event2, player2) {
            return _status.currentPhase != player2;
          },
          filterCard: {
            name: "shan"
          },
          viewAs: {
            name: "sha"
          },
          viewAsFilter: function(player2) {
            if (!player2.countCards("hs", "shan")) return false;
          },
          position: "hs",
          prompt: "将一张闪当杀使用或打出",
          check: function() {
            return 1;
          },
          ai: {
            effect: {
              target: function(card2, player2, target2, current) {
                if (get.tag(card2, "respondSha") && current < 0) return 0.6;
              }
            },
            respondSha: true,
            skillTagFilter: function(player2) {
              if (!player2.countCards("hs", "shan") || _status.currentPhase != player2) return false;
            },
            order: function() {
              return get.order({ name: "sha" }) + 0.1;
            },
            useful: -1,
            value: -1,
            yingbian: function(card2, player2, targets2, viewer) {
              if (get.attitude(viewer, player2) <= 0) return 0;
              var base = 0, hit = false;
              if (get.cardtag(card2, "yingbian_hit")) {
                hit = true;
                if (targets2.filter(function(target2) {
                  return target2.hasShan() && get.attitude(viewer, target2) < 0 && get.damageEffect(target2, player2, viewer, get.nature(card2)) > 0;
                }))
                  base += 5;
              }
              if (get.cardtag(card2, "yingbian_all")) {
                if (game.hasPlayer(function(current) {
                  return !targets2.includes(current) && lib.filter.targetEnabled2(card2, player2, current) && get.effect(current, card2, player2, player2) > 0;
                }))
                  base += 5;
              }
              if (get.cardtag(card2, "yingbian_damage")) {
                if (targets2.filter(function(target2) {
                  return get.attitude(player2, target2) < 0 && (hit || !target2.mayHaveShan() || player2.hasSkillTag(
                    "directHit_ai",
                    true,
                    {
                      target: target2,
                      card: card2
                    },
                    true
                  )) && !target2.hasSkillTag("filterDamage", null, {
                    player: player2,
                    card: card2,
                    jiu: true
                  });
                }))
                  base += 5;
              }
              return base;
            },
            canLink: function(player2, target2, card2) {
              if (!target2.isLinked() && !player2.hasSkill("wutiesuolian_skill")) return false;
              if (target2.mayHaveShan() && !player2.hasSkillTag(
                "directHit_ai",
                true,
                {
                  target: target2,
                  card: card2
                },
                true
              ))
                return false;
              if (player2.hasSkill("jueqing") || player2.hasSkill("gangzhi") || target2.hasSkill("gangzhi")) return false;
              return true;
            },
            basic: {
              useful: [5, 3, 1],
              value: [5, 3, 1]
            },
            result: {
              target: function(player2, target2, card2, isLink) {
                var eff = (function() {
                  if (!isLink && player2.hasSkill("jiu")) {
                    if (!target2.hasSkillTag("filterDamage", null, {
                      player: player2,
                      card: card2,
                      jiu: true
                    })) {
                      if (get.attitude(player2, target2) > 0) {
                        return -7;
                      } else {
                        return -4;
                      }
                    }
                    return -0.5;
                  }
                  return -1.5;
                })();
                if (!isLink && target2.mayHaveShan() && !player2.hasSkillTag(
                  "directHit_ai",
                  true,
                  {
                    target: target2,
                    card: card2
                  },
                  true
                ))
                  return eff / 1.2;
                return eff;
              }
            },
            tag: {
              respond: 1,
              respondShan: 1,
              damage: function(card2) {
                if (game.hasNature(card2, "poison")) return false;
                return 1;
              },
              natureDamage: function(card2) {
                if (game.hasNature(card2)) return 1;
                return 0;
              },
              fireDamage: function(card2, nature) {
                if (game.hasNature(card2, "fire")) return 1;
                return 0;
              },
              thunderDamage: function(card2, nature) {
                if (game.hasNature(card2, "thunder")) return 1;
                return 0;
              },
              poisonDamage: function(card2, nature) {
                if (game.hasNature(card2, "poison")) return 1;
                return 0;
              }
            }
          }
        }
      }
    },
    //德克萨斯
    jianyumrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      content: function() {
        "step 0";
        var cards2 = get.cards(4);
        game.cardsGotoOrdering(cards2);
        player.showCards(cards2, "剑雨");
        var suit = [];
        for (var i2 = 0; i2 < cards2.length; i2++) {
          var suitcard = get.suit(cards2[i2]);
          if (suit.includes(suitcard)) continue;
          suit.add(suitcard);
        }
        var num = suit.length;
        if (player.countCards("he") >= suit.length)
          player.chooseCard("he", true, "【剑雨】:将至少" + num + "张牌当作【万箭齐发】对你选择牌的等量名其他角色使用", [num, Infinity]).set("ai", function(card2) {
            return get.value(card2) <= 6;
          });
        else event.finish();
        if (result.cards) {
          var cards2 = result.cards;
          player.addTempSkill("jianyumrfz_dam", "jianyumrfzAfter");
          player.chooseUseTarget({ name: "wanjian" }, cards2, true, false).set("selectTarget", function(card2, player2, target2) {
            var num2 = cards2.length;
            return [1, num2];
          }).viewAs = true;
        }
      },
      subSkill: {
        dam: {
          silent: true,
          charlotte: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.player.isAlive() && event2.cards && event2.card.name == "wanjian" && !event2.player.hasSkill("jianyumrfz_debuff");
          },
          content: function() {
            trigger.player.addTempSkill("jianyumrfz_debuff", { player: "phaseEnd" });
          }
        },
        debuff: {
          mark: true,
          intro: {
            content: "使用【杀】的次数-1"
          },
          charlotte: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num - 1;
            }
          }
        }
      },
      ai: {
        order: 2.95,
        result: {
          player: 1
        }
      }
    },
    sudimrfz: {
      audio: 2,
      trigger: { global: "roundStart" },
      frequent: true,
      content: function() {
        "step 0";
        event.count = 1;
        event.count--;
        event.cards = game.cardsGotoOrdering(get.cards(2)).cards;
        if (_status.connectMode)
          game.broadcastAll(function() {
            _status.noclearcountdown = true;
          });
        event.given_map = {};
        if (event.cards.length > 1) {
          player.chooseCardButton("【速递】:请选择要分配的牌", true, event.cards, [1, event.cards.length]).set("ai", function(button) {
            if (ui.selected.buttons.length == 0) return 1;
            return 0;
          });
        } else if (event.cards.length == 1) {
          event._result = { links: event.cards.slice(0), bool: true };
        } else {
          event.finish();
        }
        if (result.bool) {
          event.cards.removeArray(result.links);
          event.togive = result.links.slice(0);
          player.chooseTarget("选择一名角色获得" + get.translation(result.links), true).set("ai", function(target2) {
            var att = get.attitude(_status.event.player, target2);
            if (_status.event.enemy) {
              return -att;
            } else if (att > 0) {
              return att / (1 + target2.countCards("h"));
            } else {
              return att / 100;
            }
          }).set("enemy", get.value(event.togive[0], player, "raw") < 0);
        }
        if (result.targets.length) {
          var id2 = result.targets[0].playerid, map = event.given_map;
          if (!map[id2]) map[id2] = [];
          map[id2].addArray(event.togive);
        }
        if (cards.length > 0) event.goto(2);
        if (_status.connectMode) {
          game.broadcastAll(function() {
            delete _status.noclearcountdown;
            game.stopCountChoose();
          });
        }
        var list = [];
        for (var i2 in event.given_map) {
          var source = (_status.connectMode ? lib.playerOL : game.playerMap)[i2];
          player.line(source, "green");
          list.push([source, event.given_map[i2]]);
        }
        game.loseAsync({
          gain_list: list,
          giver: player,
          animate: "draw"
        }).setContent("gaincardMultiple");
        if (event.count > 0 && player.hasSkill(event.name) && !get.is.blocked(event.name, player)) {
          player.chooseBool(get.prompt2(event.name)).set("frequentSkill", event.name);
        } else event.finish();
        if (result.bool) {
          player.logSkill(event.name);
          event.goto(1);
        }
      },
      ai: {
        expose: 0.1,
        threaten: 1.1
      }
    },
    //白金
    xujimrfz: {
      init: function(player2) {
        player2.storage.xujimrfz = {
          damage: 0,
          maxhand: 0
        };
      },
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.xujimrfz;
          var str;
          if (storage["damage"] > 0) str = "下次使用【杀】的伤害基数+" + storage["damage"] + "</br>";
          if (storage["maxhand"] > 0) str = str + "手牌上限+" + storage["maxhand"];
          if (!str) return "没有效果";
          return str;
        }
      },
      audio: 3,
      trigger: { player: "phaseDiscardBegin" },
      frequent: true,
      filter: function(event2, player2) {
        return player2.getHistory("useCard", function(evt) {
          if (!get.tag(evt.card, "damage")) return false;
          if (evt.targets && evt.targets.length && evt.isPhaseUsing()) {
            var targets2 = evt.targets.slice(0);
            while (targets2.includes(player2)) targets2.remove(player2);
            return targets2.length > 0;
          }
          return false;
        }).length === 0;
      },
      content: function() {
        "step 0";
        player.storage.xujimrfz["damage"] += 1;
        player.storage.xujimrfz["maxhand"] += 5;
        if (player.canUseToAnyone("sha", false) && player.hasSha()) player.chooseControl("摸牌", "出杀").set("prompt", "【蓄击】:请选择一项");
        else {
          var num = 2 + player.storage.shiyumrfz_buff;
          player.draw(num || 2);
          event.finish();
        }
        if (result.index == 0) {
          var num = 2 + player.storage.shiyumrfz_buff;
          player.draw(num || 2);
        } else {
          player.addTempSkill("xujimrfz_sha", "xujimrfzAfter");
          player.chooseToUse(
            true,
            function(card2, player2, event2) {
              if (get.name(card2) != "sha") return false;
              return lib.filter.filterCard.apply(this, arguments);
            },
            "【蓄击】：请你使用一张【杀】"
          ).set("logSkill", "xujimrfz").set("complexSelect", true);
        }
      },
      group: ["xujimrfz_clear", "xujimrfz_dam"],
      subSkill: {
        sha: {
          silent: true,
          charlotte: true,
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2, player2) {
            return event2.card.name == "sha" && !event2.getParent().directHit.includes(event2.target);
          },
          logTarget: "target",
          content: function() {
            var storage = player.storage.shiyumrfz_buff;
            if (!storage) storage = 0;
            var id2 = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id2]) map[id2] = {};
            if (typeof map[id2].shanRequired == "number") {
              map[id2].shanRequired++;
            } else {
              map[id2].shanRequired = 2 + storage;
            }
            player.removeSkill("xujimrfz_sha");
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.storage.xujimrfz["maxhand"] = 0;
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num + (player2.storage.xujimrfz["maxhand"] || 0);
            }
          }
        },
        dam: {
          charlotte: true,
          direct: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            if (player2.storage.xujimrfz["damage"] < 1) return false;
            return event2.card && event2.card.name == "sha";
          },
          content: function() {
            var storage = player.storage.xujimrfz["damage"];
            player.logSkill("xujimrfz");
            if (!trigger.baseDamage) trigger.baseDamage = 1;
            trigger.baseDamage += storage;
            player.storage.xujimrfz["damage"] = 0;
          }
        }
      }
    },
    shiyumrfz: {
      audio: 2,
      skillAnimation: true,
      animationColor: "wood",
      juexingji: true,
      forced: true,
      unique: true,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        return event2.num >= 2;
      },
      content: function() {
        player.storage.shiyumrfz = true;
        player.awakenSkill("shiyumrfz");
        player.addSkill("shiyumrfz_buff");
        if (!player.storage.shiyumrfz_buff) player.storage.shiyumrfz_buff = 0;
        player.storage.shiyumrfz_buff += 1;
      },
      subSkill: {
        buff: {
          charlotte: true,
          mod: {
            attackRange: function(player2, num) {
              return num += 1;
            }
          },
          ai: {
            viewHandcard: true,
            skillTagFilter(player2, tag, arg) {
              if (player2 === arg || !player2.inRange(arg)) return false;
            }
          }
        }
      }
    },
    //因陀罗
    suijiamrfz: {
      init: function(player2) {
        player2.storage.suijiamrfz = {
          del: false,
          damage: 0
        };
      },
      onremove: true,
      audio: 2,
      trigger: { source: "damageBegin" },
      filter: function(event2, player2) {
        var isdel = player2.storage.suijiamrfz["del"];
        return isdel == false && event2.player.hujia > 0 || isdel == true;
      },
      forced: true,
      content: function() {
        trigger.num += 1 + player.storage.suijiamrfz["damage"] || 1;
      },
      group: "suijiamrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.storage.suijiamrfz = {
              del: false,
              damage: 0
            };
          }
        }
      }
    },
    huquanmrfz: {
      audio: 2,
      enable: ["chooseToRespond", "chooseToUse"],
      hiddenCard: function(player2, name) {
        if (player2.countCards("h") < 1 || player2.hasSkill("huquanmrfz_ban")) return false;
        if (name != "shan" && name != "wuxie") return false;
        return true;
      },
      filter: function(event2, player2) {
        if (player2.hasSkill("huquanmrfz_ban") || player2.countCards("h") < 1) return false;
        for (var name of ["wuxie", "shan"]) {
          if (event2.filterCard({ name, isCard: true }, player2, event2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var vcards = [];
          for (var name of ["wuxie", "shan"]) {
            var card2 = { name, isCard: true };
            if (event2.filterCard && event2.filterCard(card2, player2, event2)) {
              if (name == "shan") vcards.push(["基本", "", name]);
              if (name == "wuxie") vcards.push(["锦囊", "", name]);
            }
          }
          var dialog = ui.create.dialog("虎拳", [vcards, "vcard"], "hidden");
          dialog.direct = true;
          return dialog;
        },
        backup: function(links, player2) {
          return {
            filterCard: (card2) => {
              return card2.number > 5;
            },
            selectCard: 1,
            viewAs: {
              name: links[0][2]
            },
            popname: true,
            precontent: function() {
              "step 0";
              var list = ["【碎甲】中{ }内的数字+1直到你下个回合结束"];
              if (!player2.storage.suijiamrfz)
                player2.storage.suijiamrfz = {
                  del: false,
                  damage: 0
                };
              if (player2.storage.suijiamrfz["del"] == false) list.push("删除【碎甲】中[ ]内的描述直到你下个回合结束");
              if (list.length > 1)
                player2.chooseControl().set("choiceList", list).set("ai", function() {
                  return 1;
                }).set("prompt", "【虎拳】:请选择一项");
              else {
                player2.storage.suijiamrfz["damage"] = 1;
                player2.logSkill("huquanmrfz");
                player2.addTempSkill("huquanmrfz_ban", { global: "phaseEnd" });
                event.finish();
              }
              if (result.index == 0) {
                player2.storage.suijiamrfz["damage"] = 1;
              } else player2.storage.suijiamrfz["del"] = true;
              player2.logSkill("huquanmrfz");
              player2.addTempSkill("huquanmrfz_ban", { global: "phaseEnd" });
            }
          };
        },
        prompt: function(links, player2) {
          return "【虎拳】：视为使用一张【" + get.translation(links[0][2]) + "】";
        }
      },
      ai: {
        respondShan: true,
        order: 10,
        skillTagFilter: function(player2, tag, arg) {
          return player2.countCards("h", function(card2) {
            return card2.number > 5;
          }) > 0 && !player2.hasSkill("huquanmrfz_ban");
        },
        result: { player: 1 }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //温米
    baiweimrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.baiweimrfz, text;
          if (Object.keys(player2.storage.baiweimrfz).length < 1) return "没有记录的牌";
          for (var key in storage) {
            text = (text === void 0 ? "" : text) + get.translation(key) + ":" + storage[key] + "</br>";
          }
          return text;
        }
      },
      audio: 4,
      init: function(player2) {
        player2.storage.baiweimrfz = {};
      },
      enable: ["chooseToUse", "chooseToRespond"],
      filter: function(event2, player2) {
        if (player2.countCards("h") < 1 || Object.keys(player2.storage.baiweimrfz).length < 1) return false;
        for (var i2 of lib.inpile) {
          var type = get.type(i2);
          if ((type == "basic" || type == "trick") && event2.filterCard({ name: i2 }, player2, event2) && player2.storage.baiweimrfz.hasOwnProperty(i2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var number = {};
          for (var i2 = 1; i2 <= get.cardNameLength(lib.inpile, true).length; i2++) {
            number[i2] = [];
          }
          for (var i2 = 1; i2 <= get.cardNameLength(lib.inpile, true).length; i2++) {
            for (var j = 0; j < lib.inpile.length; j++) {
              var name = lib.inpile[j];
              if (get.type(name) == "delay" || get.type(name) == "equip") continue;
              if (!event2.filterCard({ name }, player2, event2)) continue;
              if (!player2.storage.baiweimrfz.hasOwnProperty(name)) continue;
              if (get.cardNameLength(name) == i2) {
                if (name == "sha") {
                  if (event2.filterCard({ name }, player2, event2)) number[i2].push(["基本", "", "sha"]);
                  for (var k of ["fire", "thunder", "ice", "stab"]) {
                    if (event2.filterCard({ name, nature: k }, player2, event2)) number[i2].push(["基本", "", "sha", k]);
                  }
                } else if (get.type(name) == "trick" && event2.filterCard({ name }, player2, event2)) number[i2].push(["锦囊", "", name]);
                else if (get.type(name) == "basic" && event2.filterCard({ name }, player2, event2)) number[i2].push(["基本", "", name]);
              }
            }
          }
          var dialog = ui.create.dialog;
          dialog = ["百味：请选择一张牌"];
          for (var i2 = 1; i2 < Object.keys(number).length; i2++) {
            if (!number[i2].length) continue;
            dialog.push('<div class="text center">' + get.cnNumber(i2) + "字</div>");
            dialog.push([number[i2], "vcard"]);
          }
          return dialog;
        },
        backup: function(links, player2) {
          return {
            filterCard: function(card2) {
              var selected = ui.selected.cards, num = get.cardNameLength(links[0][2]);
              if (selected.length) {
                var num2 = 0;
                for (var i2 = 0; i2 < selected.length; i2++) {
                  num2 += get.cardNameLength(selected[i2]);
                }
                num -= num2;
                return get.cardNameLength(card2) <= num;
              } else return get.cardNameLength(card2) <= num;
            },
            selectCard: function() {
              var num = Infinity, selected = ui.selected.cards, num2 = get.cardNameLength(links[0][2]);
              if (selected.length) {
                var num3 = 0;
                for (var i2 = 0; i2 < selected.length; i2++) {
                  num3 += get.cardNameLength(selected[i2]);
                }
                if (num = Infinity) num = 1;
                if (num3 != num2) num = num + selected.length;
              }
              return num;
            },
            audio: "baiweimrfz",
            popname: true,
            check: function(card2) {
              return 8 - get.value(card2);
            },
            position: "h",
            viewAs: { name: links[0][2], nature: links[0][3] },
            precontent: function() {
              var name = lib.skill.baiweimrfz_backup.viewAs.name;
              player2.storage.baiweimrfz[name]--;
              if (player2.storage.baiweimrfz[name] == 0) delete player2.storage.baiweimrfz[name];
            }
          };
        },
        prompt: function(links, player2) {
          return "将任意张字数之和为" + get.cnNumber(links[0][2]) + "的牌为当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
        }
      },
      hiddenCard: function(player2, name) {
        if (!lib.inpile.includes(name)) return false;
        var type = get.type(name);
        return (type == "basic" || type == "trick") && player2.storage.baiweimrfz.hasOwnProperty(name) && player2.countCards("h") > 0;
      },
      ai: {
        fireAttack: true,
        respondShan: true,
        respondSha: true,
        skillTagFilter: function(player2) {
          if (!player2.countCards("h") || player2.hasSkill("baiweimrfz_ban")) return false;
        },
        order: 1,
        result: {
          player: function(player2) {
            if (_status.event.dying) return get.attitude(player2, _status.event.dying);
            return 1;
          }
        }
      },
      group: "baiweimrfz_use",
      subSkill: {
        ban: {
          charlotte: true
        },
        use: {
          silent: true,
          trigger: { global: "useCard" },
          filter: function(event2, player2) {
            if (!event2.card || !event2.card.isCard || player2.hasSkill("baiweimrfz_ban")) return false;
            return get.type(event2.card) == "trick" || get.type(event2.card) == "basic";
          },
          content: function() {
            var name = trigger.card.name;
            if (!player.storage.baiweimrfz) player.storage.baiweimrfz = {};
            if (player.storage.baiweimrfz.hasOwnProperty(name)) {
              player.storage.baiweimrfz[name]++;
            } else {
              player.storage.baiweimrfz[name] = 1;
            }
            if (trigger.player != player && _status.currentPhase != player) player.addTempSkill("baiweimrfz_ban", { global: "phaseEnd" });
          }
        }
      }
    },
    nuanxiangmrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        if (player2.hasSkill("nuanxiangmrfz_ban")) return false;
        return event2.card && event2.card.cards && !event2.card.isCard;
      },
      prompt: function(event2, player2) {
        return "【暖香】:是否令至多" + get.cnNumber(event2.card.cards.length) + "名角色摸一张牌？";
      },
      content: function() {
        "step 0";
        var num = trigger.card.cards.length;
        player.addTempSkill("nuanxiangmrfz_ban", { global: "phaseEnd" });
        player.chooseTarget(true, [1, num], "【暖香】:请选择至多" + get.cnNumber(num) + "名角色").ai = function(target2) {
          return get.attitude(player, target2) > 0;
        };
        if (result.targets) {
          player.logSkill("nuanxiangmrfz");
          for (var i2 of result.targets) {
            player.line(i2);
            i2.draw();
          }
        }
      },
      ai: {
        expose: 0.1
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //梅尔
    shuitamrfz: {
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      mod: {
        ignoredHandcard: function(card2, player2) {
          if (card2.hasGaintag("shuitamrfzx")) {
            return true;
          }
        },
        cardDiscardable: function(card2, player2, name) {
          if (name == "phaseDiscard" && card2.hasGaintag("shuitamrfzx")) return false;
        }
      },
      audio: 2,
      derivation: ["baopomrfz", "mihuomrfz"],
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      locked: false,
      filter: function(event2, player2) {
        return (event2.name != "phase" || game.phaseNumber == 0) && player2.countCards("h") > 0;
      },
      content: function() {
        "step 0";
        player.chooseCard(true, "【水獭】:请选择至多三张牌并标记为‘咪啵’", [1, 3]).set("ai", function(card2) {
          return get.type(card2) != "equip" && get.type(card2) != "delay";
        });
        if (result.cards) {
          player.addGaintag(result.cards, "shuitamrfzx");
          for (i of result.cards) {
            i.storage.shuitamrfzx = true;
          }
        }
        player.chooseControl("爆破", "迷惑").set("prompt", "【水獭】:请选择获得一个技能").set("ai", function() {
          return [0, 1].randomGet();
        });
        if (result.index == 0) {
          player.addSkill("baopomrfz");
        } else if (result.index == 1) {
          player.addSkill("mihuomrfz");
        }
      },
      group: ["shuitamrfz_reget", "shuitamrfz_end"],
      subSkill: {
        end: {
          direct: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.getExpansions("shuitamrfz").length > 0;
          },
          content: function() {
            "step 0";
            var cards2 = player.getExpansions("shuitamrfz");
            if (cards2.length == 1) {
              for (i of cards2) {
                i.storage.shuitamrfzx = true;
              }
              player.gain(cards2, "gain2").gaintag = ["shuitamrfzx"];
              game.log(player, "收回了" + get.translation(cards2));
              player.logSkill("shuitamrfz");
              event.finish();
            } else {
              player.chooseButton(["【水獭】:请选择获得其中一张牌", cards2]).ai = function(button) {
                return get.value(button.link);
              };
            }
            if (result.links) {
              for (i of result.links) {
                i.storage.shuitamrfzx = true;
              }
              player.gain(result.links, "gain2").gaintag = ["shuitamrfzx"];
              game.log(player, "收回了" + get.translation(result.links));
              player.logSkill("shuitamrfz");
            }
          }
        },
        reget: {
          direct: true,
          trigger: {
            player: "loseAfter"
          },
          filter: function(event2, player2) {
            var evt = event2.getl(player2);
            if (!evt || !evt.hs || !evt.hs.length) return false;
            if (event2.name == "lose") {
              for (var i2 in event2.gaintag_map) {
                if (event2.gaintag_map[i2].includes("shuitamrfzx")) return true;
              }
              return false;
            }
            return player2.hasHistory("lose", function(evt2) {
              if (event2 != evt2.getParent()) return false;
              for (var i3 in evt2.gaintag_map) {
                if (evt2.gaintag_map[i3].includes("shuitamrfzx")) return true;
              }
              return false;
            });
          },
          content: function() {
            "step 0";
            if (trigger.delay == false) game.delay();
            var cards2 = [];
            for (var i2 = 0; i2 < trigger.cards2.length; i2++) {
              var card2 = trigger.cards2[i2];
              if (card2.storage.shuitamrfzx) {
                cards2.push(card2);
                clearTimeout(card2.timeout);
                card2.classList.remove("removing");
              }
            }
            if (cards2.length > 0) {
              player.logSkill("shuitamrfz");
              player.addToExpansion(cards2, player, "giveAuto").gaintag.add("shuitamrfz");
            }
          }
        }
      }
    },
    baopomrfz: {
      init: function(player2) {
        player2.storage.baopomrfz = false;
      },
      audio: 2,
      limited: true,
      charlotte: true,
      skillAnimation: true,
      animationColor: "gray",
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return !player2.storage.baopomrfz && player2.countCards("h", function(card2) {
          return card2.storage.shuitamrfzx;
        }) > 0;
      },
      check: function(event2, player2) {
        if (player2.hasUnknown()) return false;
        return true;
      },
      content: function() {
        "step 0";
        player.awakenSkill(event.name);
        player.storage.baopomrfz = true;
        player.removeGaintag("shuitamrfzx");
        for (var i2 of player.getCards("h")) {
          delete i2.storage.shuitamrfzx;
        }
        player.addTempSkill("baopomrfz_tmp", { player: "baopomrfzAfter" });
        player.chooseTarget(true, "【爆破】:请选择至多三名其他角色", [1, 3], function(card3, player2, target2) {
          return target2 != player2;
        }).ai = function(target2) {
          return get.damageEffect(target2, player) && !target2.hasSkillTag("nofire");
        };
        if (result.targets) {
          event.targets = result.targets;
          event.cards = [];
        } else event.finish();
        if (event.targets.length) {
          event.targets[0].judge(function(card3) {
            if (get.color(card3) == "red") return -4;
            return 0;
          }).judge2 = function(result2) {
            return result2.bool == false ? true : false;
          };
        } else event.goto(4);
        if (result.bool == false) {
          event.targets[0].damage(2, "fire");
          player.logSkill("baopomrfz", event.targets[0]);
        }
        event.cards.push(result.card);
        event.targets.shift();
        if (event.targets.length > 0) event.goto(2);
        if (event.cards) {
          var cards2 = [];
          for (var i2 = 0; i2 < event.cards.length; i2++) {
            var card2 = event.cards[i2];
            if (get.position(card2, true) == "d") cards2.push(card2);
          }
          for (var i2 of cards2) {
            i2.storage.shuitamrfzx = true;
          }
          player.gain(cards2, "gain2").gaintag.add("shuitamrfzx");
        }
      },
      subSkill: {
        tmp: {
          charlotte: true
        }
      }
    },
    mihuomrfz: {
      audio: 2,
      trigger: { player: "damageBegin" },
      filter: function(event2, player2) {
        if (event2.source == void 0) return false;
        return player2.countCards("h") > 0;
      },
      prompt: function(event2, player2) {
        return "【迷惑】:你可以令" + get.translation(event2.source) + "展示你的一张手牌，若为‘咪啵’则此伤害-1";
      },
      check: function(event2, player2) {
        for (var i2 of player2.getCards("h")) {
          if (i2.storage.shuitamrfzx) return true;
        }
        return false;
      },
      content: function() {
        "step 0";
        trigger.source.choosePlayerCard(player, "h", true);
        player.showCards(result.cards, get.translation(trigger.source) + "展示了" + get.translation(player) + "一张牌</br>此牌" + (result.cards[0].storage.shuitamrfzx ? "<font color=#FF0000>有</font>" : "<font color=#00FF1A>无</font>") + "‘咪啵’标记");
        if (result.cards[0].storage.shuitamrfzx) {
          player.discard(result.cards[0]);
          trigger.num--;
        }
      }
    },
    //凛冬
    dongjiangmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      check: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && get.attitude(current, player2) > 0;
        });
      },
      content: function() {
        "step 0";
        player.chooseCard("【冬将】:请选择你要分配的牌", true, [1, Infinity]);
        event.cards = result.cards;
        player.chooseTarget("【冬将】:请选择你要分配的角色（" + get.translation(event.cards) + "）", true, function(card2, player2, target2) {
          return target2 != player2;
        }).ai = function(target2) {
          return get.attitude(target2, player) > 0;
        };
        player.give(event.cards, result.targets[0]);
        if (player.countCards("h") > 0) event.goto(0);
        if (player.canUseToAnyone("sha")) {
          player.addTempSkill("dongjiangmrfz_dam", "useCardAfter");
          player.chooseUseTarget(
            {
              name: "sha",
              isCard: true
            },
            "请选择【杀】的目标"
          ).set("forced", true).set("addCount", false);
        } else event.finish();
      },
      subSkill: {
        dam: {
          direct: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.card.name == "sha" && event2.card.cards.length == 0;
          },
          content: function() {
            player.drawTo(3);
            player.removeSkill("dongjiangmrfz_dam");
            player.logSkill("dongjiangmrfz");
          }
        }
      }
    },
    xianlingmrfz: {
      audio: 2,
      trigger: { global: "roundStart" },
      content: function() {
        "step 0";
        var cards2 = player.getCards("h");
        if (player.countCards("h") < 1) event.goto(1);
        for (var i2 of cards2) {
          if (player.canUseToAnyone(i2, false)) {
            event.goto(2);
            break;
          }
        }
        player.draw();
        event.goto(0);
        player.chooseToUse("【先领】:请使用一张牌", true).set("complexSelect", true).set("filterTarget", function(card2, player2, target2) {
          return player2.canUse(card2, target2, false);
        }).set("addCount", false).set("forced", true);
        if (game.roundNumber != 1) {
          player.chooseTarget("【先领】:你可以令一名其他角色执行一次相同的流程", function(card2, player2, target2) {
            return target2 != player2;
          }).ai = function(target2) {
            return get.attitude(target2, player) > 0;
          };
        } else event.finish();
        if (result.targets) {
          event.target = result.targets[0];
        } else event.finish();
        var cards2 = event.target.getCards("h");
        if (event.target.countCards("h") < 1) event.goto(6);
        for (var i2 of cards2) {
          if (event.target.canUseToAnyone(i2, false)) {
            event.goto(7);
            break;
          }
        }
        event.target.draw();
        event.goto(5);
        event.target.chooseToUse("【先领】:请使用一张牌").set("complexSelect", true).set("filterTarget", function(card2, player2, target2) {
          return event.target.canUse(card2, target2, false);
        }).set("addCount", false).set("forced", true);
      }
    },
    //陨星
    dingyuanmrfz: {
      derivation: "zhimingmrfz",
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.yxliumingmrfz_count;
          if (player2.awakenedSkills && player2.awakenedSkills.includes("dingyuanmrfz")) {
            return "置于过武将牌上的牌:" + get.translation(storage["card"]);
          }
          return "已置于过武将牌上" + storage["count"] + "张牌</br>置于过武将牌上的牌（装备牌和延时锦囊除外）:" + get.translation(storage["card"]);
        }
      },
      onremove: true,
      audio: 2,
      forced: true,
      skillAnimation: true,
      animationColor: "thunder",
      unique: true,
      juexingji: true,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter: function(event2, player2) {
        return player2.storage.yxliumingmrfz_count["count"] >= 3;
      },
      content: function() {
        player.awakenSkill("dingyuanmrfz");
        player.loseMaxHp();
        player.addSkill("zhimingmrfz");
      }
    },
    yxliumingmrfz: {
      audio: 2,
      forced: true,
      trigger: {
        global: "phaseBegin"
      },
      marktext: "铭",
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      filter: function(event2, player2) {
        return player2.getExpansions("yxliumingmrfz").length < 1;
      },
      content: function() {
        var cards2 = game.cardsGotoOrdering(get.cards(1)).cards[0];
        player.addToExpansion(cards2, player, "giveAuto").gaintag.add("yxliumingmrfz");
      },
      group: ["yxliumingmrfz_target", "yxliumingmrfz_use", "yxliumingmrfz_count"],
      subSkill: {
        count: {
          init: function(player2) {
            player2.storage.yxliumingmrfz_count = {
              count: 0,
              card: []
            };
          },
          onremove: function(player2) {
            delete player2.storage.yxliumingmrfz_count;
          },
          silent: true,
          charlotte: true,
          trigger: {
            player: "addToExpansionAfter"
          },
          filter: function(event2, player2) {
            return event2.getParent().name == "yxliumingmrfz";
          },
          content: function() {
            if (!player.storage.yxliumingmrfz_count)
              player.storage.yxliumingmrfz_count = {
                count: 0,
                card: []
              };
            if (!player.awakenedSkills || !player.awakenedSkills.includes("dingyuanmrfz")) player.storage.yxliumingmrfz_count["count"]++;
            if (trigger.cards) {
              for (var i2 of trigger.cards) {
                if (get.type(i2) == "equip" || get.type(i2) == "delay") continue;
                if (player.storage.yxliumingmrfz_count["card"].includes(i2.name)) continue;
                player.storage.yxliumingmrfz_count["card"].add(i2.name);
              }
            }
          }
        },
        ban: {
          charlotte: true
        },
        use: {
          enable: "chooseToUse",
          hiddenCard: function(player2, name) {
            if (player2.getExpansions("yxliumingmrfz").length < 1) return false;
            return name == player2.getExpansions("yxliumingmrfz")[0].name;
          },
          filter: function(event2, player2) {
            if (player2.getExpansions("yxliumingmrfz").length < 1) return false;
            return event2.filterCard({ name: player2.getExpansions("yxliumingmrfz")[0].name, isCard: true }, player2, event2);
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var vcards = [];
              var card2 = player2.getExpansions("yxliumingmrfz")[0].name;
              var type = get.translation(get.type2(card2));
              if (event2.filterCard({ name: card2, isCard: true }, player2, event2)) vcards.push([type, "", card2]);
              var dialog = ui.create.dialog("流铭", [vcards, "vcard"], "hidden");
              dialog.direct = true;
              return dialog;
            },
            backup: function(links, player2) {
              return {
                filterCard: (card2) => {
                  var player3 = _status.event.player;
                  return !!player3.getExpansions("yxliumingmrfz")[0];
                },
                selectCard: -1,
                position: "x",
                viewAs: {
                  name: links[0][2],
                  nature: links[0][3]
                },
                precontent: function() {
                  player2.logSkill("yxliumingmrfz");
                }
              };
            },
            prompt: function(links, player2) {
              return "【流铭】：使用一张" + (links[0][3] ? get.translation(links[0][3]) : "") + "【" + get.translation(links[0][2]) + "】";
            }
          },
          ai: {
            order: function() {
              var player2 = _status.event.player;
              var card2 = player2.getExpansions("yxliumingmrfz")[0];
              return get.order(card2) + 0.1;
            },
            result: {
              player: 1
            }
          }
        },
        target: {
          trigger: {
            target: "useCardToPlayered"
          },
          filter: function(event2, player2) {
            if (event2.player == player2) return false;
            if (player2.getExpansions("yxliumingmrfz").length == 0 || !event2.card) return false;
            var suit = get.suit(event2.card);
            return !!player2.getExpansions("yxliumingmrfz").filter(function(magic) {
              return get.suit(magic) == suit || magic.number != event2.card.number;
            }).length;
          },
          forced: true,
          content: function() {
            "step 0";
            var card2 = player.getExpansions("yxliumingmrfz")[0];
            var num1 = card2.number, num2 = trigger.card.number;
            if (num1 != num2) {
              var type = get.type2(card2);
              var eff = get.effect(player, trigger.card, trigger.player, trigger.player);
              trigger.player.chooseToDiscard("【流铭】:请弃置一张" + get.translation(get.type(card2)) + "牌，否则此牌对" + get.translation(player) + "无效").set("filterCard", function(card3) {
                return get.type2(card3) == _status.event.type;
              }).set("ai", function(card3) {
                if (_status.event.eff > 0) {
                  return 10 - get.value(card3);
                }
                return 0;
              }).set("eff", eff).set("type", type);
              if (result.bool == false) {
                trigger.targets.remove(player);
                trigger.getParent().triggeredTargets2.remove(player);
                trigger.untrigger();
                player.removeSkill("yxliumingmrfz_target");
                player.addTempSkill("yxliumingmrfz_reget", { global: "phaseBegin" });
                player.addTempSkill("yxliumingmrfz_ban", { global: "phaseEnd" });
              }
            }
            var card2 = player.getExpansions("yxliumingmrfz")[0];
            if (get.suit(card2) == get.suit(trigger.card)) {
              player.gain(card2, "gain2");
            }
            player.logSkill("yxliumingmrfz");
          }
        },
        reget: {
          silent: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            player.addSkill("yxliumingmrfz_target");
          }
        }
      }
    },
    zhimingmrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.yxliumingmrfz_count;
          if (player2.awakenedSkills && player2.awakenedSkills.includes("dingyuanmrfz")) {
            return "置于过武将牌上的牌（装备牌和延时锦囊除外）:" + get.translation(storage["card"]);
          }
          return "已置于过武将牌上" + storage["count"] + "张牌</br>置于过武将牌上的牌（装备牌和延时锦囊除外）:" + get.translation(storage["card"]);
        }
      },
      audio: 2,
      enable: ["chooseToUse", "chooseToRespond"],
      hiddenCard: function(player2, name) {
        var cards2 = player2.storage.yxliumingmrfz_count["card"];
        if (player2.countCards("he") < 1 || !cards2 || player2.hasSkill("zhimingmrfz_ban")) return false;
        for (var i2 of cards2) {
          if (name == i2) return true;
        }
        return false;
      },
      filter: function(event2, player2) {
        var cards2 = player2.storage.yxliumingmrfz_count["card"];
        if (player2.countCards("he") < 1 || !cards2 || player2.hasSkill("zhimingmrfz_ban")) return false;
        for (var i2 of cards2) {
          if (event2.filterCard({ name: i2, isCard: true }, player2, event2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var vcards = [];
          var list = player2.storage.yxliumingmrfz_count["card"];
          for (var name of list) {
            var card2 = { name, isCard: true };
            var type = get.type(name);
            if (event2.filterCard(card2, player2, event2)) vcards.push([type, "", name]);
          }
          var dialog = ui.create.dialog("祗铭", [vcards, "vcard"], "hidden");
          dialog.direct = true;
          return dialog;
        },
        backup: function(links, player2) {
          return {
            filterCard: () => true,
            selectCard: 1,
            viewAs: {
              name: links[0][2]
            },
            position: "he",
            precontent: function() {
              player2.logSkill("zhimingmrfz");
              player2.addTempSkill("zhimingmrfz_ban", { global: "phaseEnd" });
            }
          };
        },
        prompt: function(links, player2) {
          return "【祗铭】：将一张牌当作【" + get.translation(links[0][2]) + "】使用或打出";
        }
      },
      ai: {
        order: 1,
        result: {
          player: 1
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //羽毛笔
    tiaojiumrfz: {
      audio: 2,
      audioname: ["longshelanmrfz"],
      derivation: ["jiu"],
      enable: "chooseToUse",
      filterCard: function(card2, player2) {
        if (ui.selected.cards.length) {
          return get.color(card2) != get.color(ui.selected.cards[0]);
        }
        return true;
      },
      complexCard: true,
      selectCard: 2,
      viewAs: {
        name: "jiu"
      },
      position: "hs",
      viewAsFilter: function(player2) {
        var hs = player2.getCards("hs");
        if (hs.length < 2) return false;
        var bool = false, map = {};
        for (var card2 of hs) {
          var color = get.color(card2);
          if (!map[color]) map[color] = true;
          else {
            bool = true;
            break;
          }
        }
        if (!bool) return false;
        return true;
      },
      prompt: "【调酒】:将两张不同颜色的手牌当酒使用",
      check: function(card2) {
        return 10 - get.value(card2);
      },
      ai: {
        threaten: 1.5,
        order: () => {
          let player2 = _status.event.player;
          if (_status.event.dying) return 9;
          let cards2 = player2.getCards("h", (card2) => {
            return get.type(card2) != "equip" && get.type(card2) != "delay";
          });
          if (cards2.length > 0) return 13;
          return 0;
        },
        result: {
          target: 1
        },
        tag: {
          save: 1,
          recover: 0.1
        }
      }
    },
    rujingmrfz: {
      audio: 2,
      direct: true,
      lastDo: true,
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.rujingmrfz;
          storage["number"].sort(function(a, b) {
            return a - b;
          });
          var str1 = "", str2 = "";
          if (storage["number"].length) str1 = str1 + storage["number"];
          else str1 = "无";
          if (storage["suit"].length) str2 = str2 + get.translation(storage["suit"]);
          else str2 = "无";
          return "记录的数字:" + str1 + "</br>记录的花色:" + str2;
        }
      },
      init: (player2) => {
        player2.storage.rujingmrfz = {
          suit: [],
          number: [],
          ban: [],
          card: []
        };
      },
      onremove: (player2) => {
        delete player2.storage.rujingmrfz;
      },
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        return event2.card && (event2.card.number || event2.card.suit);
      },
      content: function() {
        if (!player.storage.rujingmrfz)
          player.storage.rujingmrfz = {
            suit: [],
            number: [],
            ban: [],
            card: []
          };
        var card2 = trigger.card, storage = player.storage.rujingmrfz;
        if (!storage["card"].includes(trigger.card)) {
          if (card2.number && !storage["number"].includes(card2.number)) {
            player.storage.rujingmrfz["number"].add(card2.number);
          }
          if (card2.suit && !storage["suit"].includes(card2.suit) && card2.suit != "none") {
            player.storage.rujingmrfz["suit"].add(card2.suit);
          }
        } else player.storage.rujingmrfz["card"].remove(trigger.card);
      },
      group: ["rujingmrfz_addcount", "rujingmrfz_clear"],
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          lastDo: true,
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.storage.rujingmrfz;
          },
          content: function() {
            player.storage.rujingmrfz["ban"] = [];
          }
        },
        addcount: {
          audio: "rujingmrfz",
          trigger: { player: "useCard" },
          direct: true,
          filter: function(event2, player2) {
            var storage = player2.storage.rujingmrfz;
            if (!event2.card || !(event2.card.number && event2.card.suit)) return false;
            var cardNumber = event2.card.number;
            var cardSuit = event2.card.suit;
            if (!storage["number"].includes(cardNumber) && !storage["suit"].includes(cardSuit)) return false;
            if (get.type(event2.card) == "equip" || get.type(event2.card) == "delay") return false;
            if (["shan", "wuxie"].includes(event2.card.name)) return false;
            return storage["number"].includes(cardNumber) && !storage["ban"].includes("number") || storage["suit"].includes(cardSuit) && !storage["ban"].includes("suit");
          },
          content: function() {
            "step 0";
            var storage = player.storage.rujingmrfz, number = trigger.card.number, suit = trigger.card.suit;
            var list = [];
            if (storage["number"].includes(number) && !storage["ban"].includes("number")) list.add("number");
            if (storage["suit"].includes(suit) && !storage["ban"].includes("suit")) list.add("suit");
            event.list = list;
            if (list.length == 1) {
              var goon = true;
              if (trigger.card.name == "du") goon = false;
              if (trigger.card.name == "jiedao") goon = false;
              if (trigger.card.name == "tao" && player.getDamagedHp() == 1) goon = false;
              if (list.includes("suit")) {
                player.chooseBool("【入境】:是否令此牌额外结算一次？（同花色）").set("ai", function() {
                  return _status.event.goon;
                }).set("goon", goon);
              } else {
                player.chooseBool("【入境】:是否令此牌额外结算一次？（同点数）").set("ai", function() {
                  return _status.event.goon;
                }).set("goon", goon);
              }
            } else {
              player.chooseControl("点数", "花色", "全部", "cancel2").set("prompt", "【入境】:请选择一项").set("prompt2", "选择‘点数’或者‘花色’为额外结算一次，选择‘全部’为额外结算两次，选择‘取消’为不发动此技能").set("ai", function() {
                var player2 = _status.event.player, card2 = _status.event.card;
                if (card2.name == "du" || card2.name == "jiedao") return "cancel2";
                if (card2.name == "tao") {
                  var hp = player2.getDamagedHp();
                  switch (hp) {
                    case 0:
                      return "cancel2";
                    case 1:
                      return ["点数", "花色"].randomGet();
                    default:
                      return "全部";
                  }
                }
                return "全部";
              }).set("card", trigger.card);
            }
            var storage = player.storage.rujingmrfz, number = trigger.card.number, suit = trigger.card.suit;
            if (result.bool) {
              player.storage.rujingmrfz["card"].add(trigger.card);
              if (event.list.includes("suit")) {
                trigger.effectCount++;
                player.storage.rujingmrfz["ban"].add("suit");
                player.storage.rujingmrfz["suit"].remove(suit);
              } else {
                trigger.effectCount++;
                player.storage.rujingmrfz["ban"].add("number");
                player.storage.rujingmrfz["number"].remove(number);
              }
            } else if (result.control != "cancel2" && result.bool != false) {
              player.storage.rujingmrfz["card"].add(trigger.card);
              if (result.control == "点数") {
                trigger.effectCount++;
                player.storage.rujingmrfz["ban"].add("number");
                player.storage.rujingmrfz["number"].remove(number);
              } else if (result.control == "花色") {
                trigger.effectCount++;
                player.storage.rujingmrfz["ban"].add("suit");
                player.storage.rujingmrfz["suit"].remove(suit);
              } else {
                trigger.effectCount += 2;
                player.storage.rujingmrfz["ban"].add("suit");
                player.storage.rujingmrfz["suit"].remove(suit);
                player.storage.rujingmrfz["ban"].add("number");
                player.storage.rujingmrfz["number"].remove(number);
              }
            }
          }
        }
      }
    },
    //爱丽丝
    alsmengxiangmrfz: {
      audio: 2,
      frequent: true,
      trigger: { global: "phaseUseBegin" },
      filter: function(event2, player2) {
        return event2.player.storage.phaseHistory && event2.player.storage.phaseHistory.hasOwnProperty("phaseUse");
      },
      //QQQ,
      prompt: function(event2, player2) {
        return "是否对" + get.translation(event2.player) + "发动【梦乡】？";
      },
      content: function() {
        "step 0";
        event.list = [];
        for (var name of lib.inpile) {
          if (get.type(name) == "delay" || get.type(name) == "equip") continue;
          if (get.tag({ name }, "damage")) continue;
          event.list.push([get.type(name), "", name]);
        }
        var dialog = ["为" + get.translation(trigger.player) + "选择至多三个牌名"];
        if (event.list.length) {
          dialog.push([event.list, "vcard"]);
        }
        if (!event.list.length) event.finish();
        else {
          player.chooseButton(dialog, [1, 3]).set("ai", function(button) {
            let name2 = button.link[2], list = _status.event.list.map((i2) => i2[2]), player2 = _status.event.player, trigger2 = _status.event.getTrigger(), target3 = trigger2.player, getv = (name3, player3) => {
              let v = trigger2.getTempCache("alsmengxiangmrfz", player3.id + name3);
              if (typeof v === "number") return v;
              v = player3.getUseValue({ name: name3 });
              trigger2.putTempCache("alsmengxiangmrfz", player3.id + name3, v);
              return v;
            };
            if (get.attitude(player2, target3) < 0) {
              if (!list.includes(name2)) return 0;
              let val = 0;
              if (target3.getDamagedHp() == 0 && name2 == "tao") val += 25;
              else if (name2 === "wuxie") val += 20;
              else if (name2 === "shan") val += 15;
              else if (name2 === "jiu") val += 6;
              return -getv(name2, target3) + val;
            } else {
              if (!list.includes(name2)) return 0;
              let val = getv(name2, target3), base = 5;
              val = Math.min(15, val - base);
              if (name2 === "wuzhong" || name2 === "dongzhuxianji") val += 20;
              else if (name2 === "tao" && player2.getDamagedHp() > 0) val += 15;
              else if (name2 === "shunshou") val += 6;
              return val;
            }
          }).set("list", event.list);
        }
        if (result.bool) {
          var names = result.links.map((i2) => i2[2]), target2 = trigger.player;
          if (!target2.storage.alsmengxiangmrfz_eff) target2.storage.alsmengxiangmrfz_eff = [];
          target2.storage.alsmengxiangmrfz_eff = target2.storage.alsmengxiangmrfz_eff.concat(names);
          game.log(player, "为", target2, "选择了", "#y" + get.translation(names));
          target2.addTempSkill("alsmengxiangmrfz_eff", { player: "phaseUseAfter" });
          target2.markSkill("alsmengxiangmrfz_eff");
          player.logSkill("alsmengxiangmrfz", trigger.player);
        }
      },
      subSkill: {
        eff: {
          audio: false,
          onremove: true,
          intro: {
            mark: function(dialog, storage, player2) {
              if (!storage || !storage.length) return "当前无可用牌";
              dialog.add([[storage[0]], "vcard"]);
              if (storage.length > 1) dialog.addSmall([storage.slice(1), "vcard"]);
            },
            content: "$"
          },
          mod: {
            hiddenCard: function(player2, name) {
              var storage = player2.getStorage("alsmengxiangmrfz_eff");
              if (storage.length) return name == storage[0];
            },
            cardname: function(card2, player2) {
              if (_status.event.name != "chooseToUse" || _status.event.skill) return;
              var storage = player2.getStorage("alsmengxiangmrfz_eff");
              if (storage.length) return storage[0];
            },
            cardnature: function(card2, player2) {
              if (_status.event.name != "chooseToUse" || _status.event.skill) return;
              var storage = player2.getStorage("alsmengxiangmrfz_eff");
              if (storage.length) return false;
            }
          },
          trigger: {
            player: ["useCard", "respond"]
          },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.cards.length > 0 && player2.getStorage("alsmengxiangmrfz_eff").length > 0;
          },
          content: function() {
            player.unmarkAuto("alsmengxiangmrfz_eff", [player.getStorage("alsmengxiangmrfz_eff")[0]]);
          }
        }
      },
      ai: {
        threaten: 1.5
      }
    },
    rumianmrfz: {
      markimage: "extension/WhichWay/image/orther/rumianmrfz.png",
      intro: {
        content: "下个结束阶段开始额外执行#个出牌阶段"
      },
      audio: 2,
      trigger: {
        player: ["phaseDiscardAfter", "damageEnd"]
      },
      content: function() {
        "step 0";
        player.chooseTarget(true, "【入眠】:请选择一名角色，令其于下个结束阶段开始时额外执行一个出牌阶段").ai = function(target3) {
          if (get.attitude(player, target3) > 4) {
            return get.threaten(target3) / Math.sqrt(target3.hp + 1) / Math.sqrt(target3.countCards("h") + 1);
          }
          return get.attitude(player, target3) > 0;
        };
        if (result.targets) {
          var target2 = result.targets[0];
          target2.addMark("rumianmrfz", false);
          target2.when({ player: "phaseJieshuBegin" }).then(() => {
            var next = trigger.player.phaseUse();
            event.next.remove(next);
            trigger.getParent("phase").next.push(next);
            player.removeMark("rumianmrfz", false);
            game.log(player, "执行了一个额外的出牌阶段");
          });
          player.line(target2);
        }
      },
      ai: {
        //expose: 0.1,
        threaten: 0.7,
        maixie: true,
        maixie_hp: true
      }
    },
    //天火
    zhuihuomrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      audio: 2,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return player2.countCards("hs", (card2) => {
          return get.name(card2) == "sha" && get.nature(card2) == "fire" || get.name(card2) == "huogong";
        }) > 0;
      },
      filterCard: function(card2) {
        return get.name(card2) == "sha" && get.nature(card2) == "fire" || get.name(card2) == "huogong";
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && !player2.storage.zhuihuomrfz.includes(target2);
      },
      discard: false,
      lose: false,
      delay: false,
      content: function() {
        player.storage.zhuihuomrfz.add(target);
        target.addJudge({ name: "sjzx_zhuihuomrfz" }, cards);
      },
      ai: {
        order: 5,
        result: {
          player: 1,
          target: function(player2, target2) {
            if (get.attitude(player2, target2) < 0 && target2.getCards("j", function(card2) {
              return get.name(card2) == "sjzx_zhuihuomrfz";
            }).length < target2.hp) {
              if (target2.countCards("he") < 2 && target2.hp < 2) return -3;
              if (target2.countCards("he") < 2) return -2;
            }
            return -1;
          }
        }
      },
      group: ["zhuihuomrfz_clear"],
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseUseEnd" },
          content() {
            player.storage.zhuihuomrfz = [];
          }
        }
      }
    },
    yihuomrfz: {
      mod: {
        cardname: function(card2, player2) {
          if (card2.storage && card2.storage.yihuomrfz == true) return "sha";
        },
        cardnature: function(card2, player2) {
          if (card2.storage && card2.storage.yihuomrfz == true) return "fire";
        }
      },
      audio: 2,
      trigger: {
        global: "damageEnd"
      },
      usable: 2,
      filter: function(event2, player2) {
        return event2.nature == "fire";
      },
      forced: true,
      content: function() {
        player.draw(2);
      },
      ai: {
        effect: {
          target: function(card2, player2, target2, current) {
            if (get.tag(card2, "respondSha") && current < 0) return 0.6;
          }
        },
        respondSha: true
      },
      group: ["yihuomrfz_gain", "yihuomrfz_cancel"],
      subSkill: {
        cancel: {
          direct: true,
          trigger: { player: "damageBegin4" },
          filter: function(event2, player2) {
            return event2.nature == "fire";
          },
          content: function() {
            trigger.cancel();
            player.draw(3);
            player.logSkill("yihuomrfz");
          },
          ai: {
            effect: {
              target: function(card2, player2, target2) {
                if (get.tag(card2, "fireDamage")) return [0, 1];
              }
            }
          }
        },
        gain: {
          direct: true,
          trigger: { player: "gainAfter" },
          filter: function(event2, player2) {
            if (!event2.cards || event2.cards.length < 2) return false;
            return event2.cards.some((element) => player2.getCards("h").includes(element));
          },
          content: function() {
            "step 0";
            player.chooseCard(true, "【溢火】:请选择一张牌，令此牌视为火【杀】", function(card2) {
              return trigger.cards.includes(card2);
            }).set("ai", function(card2) {
              return -get.value(card2);
            });
            if (result.cards) {
              result.cards[0].storage.yihuomrfz = true;
            }
            var color, bool = true;
            for (var i2 of trigger.cards) {
              if (typeof color !== "string") color = get.color(i2, player);
              if (get.color(i2, player) != color) {
                bool = false;
                break;
              }
            }
            if (bool == true) player.draw();
            player.logSkill("yihuomrfz");
          }
        }
      }
    },
    //临光
    anranmrfz: {
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      content: function() {
        var cards2 = player.getCards("h");
        player.discard(cards2);
      },
      group: ["anranmrfz_draw"],
      subSkill: {
        draw: {
          audio: "anranmrfz",
          trigger: { player: "phaseBegin" },
          init: (player2) => {
            player2.storage.anranmrfz_draw = false;
          },
          filter: function(event2, player2) {
            return !player2.storage.anranmrfz_draw;
          },
          forced: true,
          content: function() {
            var num = player.hujia + player.hp;
            player.storage.anranmrfz_draw = true;
            player.draw(2 * num);
            player.changeHujia(-player.hujia);
            player.recover();
            player.when("phaseDiscardBefore").then(() => {
              trigger.cancel();
              player.logSkill("anranmrfz");
            });
          }
        }
      }
    },
    huchimrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      filterCard: true,
      position: "he",
      check: function(card2) {
        return 6 - get.value(card2);
      },
      lose: false,
      discard: false,
      delay: false,
      content: function() {
        "step 0";
        player.give(cards, target, "give");
        for (var i2 of cards) {
          i2.storage.huchimrfz = true;
        }
        var view = get.autoViewAs({ name: "sha" }, cards);
        target.chooseTarget("【互持】:请选择使用【杀】的目标", function(card3, player2, target2) {
          var view2 = _status.event.view;
          var playerx = _status.event.playerx;
          return target2 != playerx && playerx.canUse(view2, target2);
        }).set("view", view).set("playerx", target).ai = function(target2) {
          var view2 = _status.event.view;
          var player2 = _status.event.playerx;
          return get.effect(target2, view2, player2, player2);
        };
        if (result.targets) {
          var card2 = get.autoViewAs({ name: "sha" }, cards);
          if (target.hasCard((card3) => {
            return card3 == cards[0];
          }, "h"))
            target.useCard(result.targets[0], card2, cards);
        }
      },
      ai: {
        order: 4,
        result: {
          target: function(player2, target2) {
            if (get.attitude(player2, target2) > 2) {
              if (game.hasPlayer((current) => {
                return target2.canUse("sha", current) && get.attitude(player2, target2);
              }))
                return 2;
            }
            return 1;
          }
        }
      },
      group: ["huchimrfz_recover", "huchimrfz_gain"],
      subSkill: {
        recover: {
          trigger: {
            player: "recoverEnd",
            global: "recoverEnd"
          },
          usable: 1,
          filter: function(event2, player2) {
            if (!event2.source.isIn() || !event2.player.isIn() || event2.source === void 0 || !event2.player) return false;
            if (event2.source == player2 && event2.player == player2) return false;
            if (event2.source != player2 && event2.player != player2) return false;
            return true;
          },
          direct: true,
          content: function() {
            "step 0";
            trigger.player.chooseCardTarget({
              prompt: "【互持】:你可以将一张牌交给回复来源",
              filterCard: true,
              position: "he",
              filterTarget: function(card2, player2, target2) {
                var source = _status.event.source;
                return target2 != player2 && target2 == source;
              },
              ai1: function(card2) {
                return 8 - get.value(card2);
              },
              ai2: function(target2) {
                var playerx = _status.event.playerx;
                return get.attitude(playerx, target2) > 0;
              }
            }).set("source", trigger.source).set("playerx", trigger.player);
            if (result.bool) {
              trigger.player.give(result.cards, result.targets[0]);
              trigger.player.draw();
              trigger.source.draw();
              trigger.player.logSkill("huchimrfz", trigger.source);
            } else player.storage.counttrigger.huchimrfz_recover--;
          }
        },
        gain: {
          direct: true,
          trigger: {
            player: "gainEnd",
            global: "gainEnd"
          },
          filter: function(event2, player2) {
            if (event2.source == void 0 || event2.player == void 0) return false;
            if (!event2.source.isIn() || !event2.player.isIn()) return false;
            if (event2.source == player2 && event2.player == player2) return false;
            if (event2.source != player2 && event2.player != player2) return false;
            return true;
          },
          usable: 1,
          content: function() {
            "step 0";
            trigger.player.chooseCardTarget({
              prompt: "【互持】:你可以将一张牌交给给予来源",
              filterCard: true,
              position: "he",
              filterTarget: function(card2, player2, target2) {
                var source = _status.event.source;
                return target2 != player2 && target2 == source;
              },
              ai1: function(card2) {
                if (card2.storage.huchimrfz) return 0;
                return 8 - get.value(card2);
              },
              ai2: function(target2) {
                var playerx = _status.event.playerx;
                return get.attitude(playerx, target2) > 0;
              }
            }).set("source", trigger.source).set("playerx", trigger.player);
            if (result.bool) {
              trigger.player.give(result.cards, result.targets[0]);
              trigger.player.draw();
              trigger.source.draw();
              trigger.player.logSkill("huchimrfz", trigger.source);
            } else player.storage.counttrigger.huchimrfz_gain--;
          }
        }
      }
    },
    chongyaomrfz: {
      audio: 2,
      mark: true,
      intro: {
        content: function(event2, player2) {
          return `${player2.storage.chongyaomrfz_mark["count"]}/5`;
        }
      },
      derivation: ["zhuguangmrfz"],
      init: (player2) => {
        player2.storage.chongyaomrfz = false;
      },
      trigger: {
        player: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
        global: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"]
      },
      filter: function(event2, player2) {
        return player2.storage.chongyaomrfz_mark["count"] >= 5 && !player2.storage.chongyaomrfz;
      },
      juexingji: true,
      skillAnimation: true,
      animationColor: "wood",
      unique: true,
      forced: true,
      content: () => {
        player.loseMaxHp();
        player.addSkill("zhuguangmrfz");
        player.awakenSkill("chongyaomrfz");
        game.log(player, "获得了技能", "#g【逐光】");
        player.storage.chongyaomrfz = true;
        delete player.storage.chongyaomrfz_mark;
        player.unmarkAuto(player.storage.chongyaomrfz);
        player.removeSkill("chongyaomrfz_mark");
      },
      group: ["chongyaomrfz_mark", "chongyaomrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          firstDo: true,
          charlotte: true,
          trigger: {
            global: "phaseBegin"
          },
          content: function() {
            player.storage.chongyaomrfz_mark["skill"] = [];
          }
        },
        mark: {
          init: (player2) => {
            player2.storage.chongyaomrfz_mark = {
              count: 0,
              skill: []
            };
          },
          onremove: (player2) => {
            delete player2.storage.chongyaomrfz_mark;
          },
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: {
            player: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"],
            global: ["huchimrfzAfter", "huchimrfz_gainAfter", "huchimrfz_recoverAfter"]
          },
          content: function() {
            if (!player.storage.chongyaomrfz_mark) player.storage.chongyaomrfz_mark = 0;
            for (var i2 of ["huchimrfz", "huchimrfz_gain", "huchimrfz_recover"]) {
              if (!player.storage.counttrigger.hasOwnProperty(trigger.name) && i2 != "huchimrfz") continue;
              if (player.storage.chongyaomrfz_mark["skill"].includes(trigger.name)) continue;
              if (i2 == "huchimrfz" && trigger.name == "huchimrfz") {
                player.storage.chongyaomrfz_mark["count"]++;
                player.storage.chongyaomrfz_mark["skill"].add(trigger.name);
                break;
              }
              if (player.storage.counttrigger[trigger.name] > 0) {
                player.storage.chongyaomrfz_mark["count"]++;
                player.storage.chongyaomrfz_mark["skill"].add(trigger.name);
                break;
              }
            }
          }
        }
      }
    },
    //海沫
    xunchaomrfz: {
      intro: {
        content: "下次造成的伤害+#"
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        if (player2.countCards("h") < 1) return false;
        return game.hasPlayer((current) => {
          return current != player2 && (current.hp > player2.hp || current.countCards("h") > player2.countCards("h") || current.countCards("e") > player2.countCards("e"));
        });
      },
      complexCard: true,
      filterCard: function(card2, player2) {
        var selected = ui.selected.cards;
        if (!selected.length) return true;
        for (var i2 = 0; i2 < selected.length; i2++) {
          if (get.type2(card2) == get.type2(selected[i2])) return false;
        }
        return true;
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && (target2.hp > player2.hp || target2.countCards("h") > player2.countCards("h") || target2.countCards("e") > player2.countCards("e"));
      },
      selectCard: [1, Infinity],
      check: function(card2) {
        return 10 - get.value(card2);
      },
      discard: false,
      lose: false,
      delay: false,
      content: function() {
        "step 0";
        player.give(cards, target);
        var num = cards.length;
        if (num >= 1) {
          player.recover();
        }
        if (num >= 2) {
          player.adjustHandCardTo(target.countCards("h"));
        }
        if (num >= 3) {
          player.addMark("xunchaomrfz", 1, false);
          player.when({ source: "damageBegin3" }).then(() => {
            player.removeMark("xunchaomrfz", 1, false);
            trigger.num++;
          });
        }
      },
      ai: {
        expose: 0.1,
        order: 3,
        result: {
          target: function(player2, target2) {
            if (get.attitude(target2, player2) > 0) {
              return 1 + target2.countCards("h") * 0.1;
            }
          }
        }
      }
    },
    paoyingmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.countCards("h") > player2.hp && player2.getDamagedHp() > 0;
      },
      content: function() {
        "step 0";
        player.adjustHandCardTo(player.hp);
        if (result.cards) {
          player.recover(Math.min(result.cards.length, 2));
        }
      }
    },
    //小满
    mushoumrfz: {
      audio: 2,
      trigger: { global: "phaseEnd" },
      direct: true,
      getCanUseCard: function(event2, player2) {
        var history = event2.player.getHistory("lose", function(evt) {
          return evt && evt.type == "discard";
        }), cards2 = [];
        if (history.length == 0) return cards2;
        for (var i2 = 0; i2 < history.length; i2++) {
          var cardsList = history[i2].cards;
          for (var j = 0; j < cardsList.length; j++) {
            if (!player2.canUseToAnyone(cardsList[j])) continue;
            if (get.position(cardsList[j], true) != "d") continue;
            cards2.push(cardsList[j]);
          }
        }
        return cards2;
      },
      filter: function(event2, player2) {
        var cards2 = lib.skill.mushoumrfz.getCanUseCard(event2, player2);
        return cards2.length > 0 && event2.player != player2;
      },
      async content(event2, trigger2, player2) {
        let cards2 = lib.skill.mushoumrfz.getCanUseCard(trigger2, player2);
        while (true) {
          const {
            result: { bool, links }
          } = await player2.chooseButton(["【牧兽】：是否使用这些牌？", cards2]).set("filterButton", (button) => {
            return _status.event.player.canUseToAnyone(button.link);
          }).set("ai", (button) => {
            return _status.event.player.getUseValue(button.link);
          });
          if (!bool) return;
          cards2.remove(links[0]);
          player2.$gain2(links[0], false);
          player2.chooseUseTarget(links[0], true);
          player2.logSkill("mushoumrfz");
          cards2 = cards2.filter((card2) => {
            return get.position(card2, true) == "d" && player2.canUseToAnyone(card2);
          });
          if (cards2.length == 0) return;
        }
      }
    },
    //万顷
    guantianmrfz: {
      audio: 2,
      forced: true,
      trigger: { global: "drawBegin" },
      filter: function(event2, player2) {
        return _status.currentPhase == player2 && event2.getParent(1).name != "guantianmrfz";
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
        trigger2.player.chooseToGuanxing(trigger2.num);
        trigger2.player.draw(trigger2.num);
      }
    },
    yingfengmrfz: {
      audio: 2,
      trigger: { player: "phaseBeginStart" },
      frequent: true,
      async content(event2, trigger2, player2) {
        var list = Array.from({ length: lib.phaseName.length }, (_, index2) => (index2 + 1).toString());
        const { index } = await player2.chooseControl(list).set("prompt", "【万顷】:请选择你要跳过的阶段数").set("ai", function() {
          var player3 = _status.event.player;
          var friend = game.filterPlayer((current) => {
            return get.attitude(current, player3) > 0;
          });
          var list2 = _status.event.list;
          if (friend.length > 3 && player3.getSkillsList().length > 1) return list2.length - 1;
          if (player3.countCards("h") <= player3.getHandcardLimit() && friend.length > 2) return 3;
          return 1;
        }).set("list", list).forResult();
        if (!index) return;
        let phase = [], num = index + 1;
        for (var i2 = 0; i2 < num; i2++) {
          player2.skip(lib.phaseName[i2]);
          phase.push(lib.phaseName[i2]);
        }
        game.log(player2, "跳过了", `#y${get.tranPhase(phase)}`);
        player2.when("phaseEnd").then(() => {
          player2.chooseTarget(true, `【应风】:请选择至多${get.cnNumber(index)}名角色，令其摸${get.cnNumber(Math.floor(index / 2))}张牌`, [1, index]).ai = function(target2) {
            return get.attitude(player2, target2) > 0;
          };
        }).then(() => {
          if (result.targets) {
            game.asyncDraw(result.targets, Math.floor(index / 2));
          } else event2.finish();
        }).then(() => {
          var list2 = player2.getSkillsList();
          if (index > 4 && list2.length > 0) {
            if (list2.length == 1) {
              player2.removeSkill(list2[0]);
              event2.finish();
            } else
              player2.chooseControl(list2).set("prompt", "【应风】:请选择失去一个技能").set("ai", function() {
                var list3 = _status.event.list;
                if (list3.includes("yingfengmrfz") && list3.length > 1) list3.remove("yingfengmrfz");
                return list3.randomGet();
              }).set("list", list2);
          }
        }).then(() => {
          if (result.control) {
            player2.removeSkill(result.control);
            game.log(player2, `失去了技能<span class="yellowtext">【${get.translation(result.control)}】</span>`);
          }
        }).vars({ index: num });
      },
      ai: {
        effect: {
          target: function(card2, player2, target2, current) {
            if (get.type(card2) == "delay") return "zeroplayertarget";
          }
        }
      }
    },
    //格劳克斯
    cichongmrfz: {
      audio: 2,
      init: (player2, skill) => {
        player2.storage.cichongmrfz = [];
      },
      intro: {
        content: (event2, player2, storage) => {
          return `已经弃置过的类型：${get.translation(player2.storage[storage])}`;
        }
      },
      enable: "phaseUse",
      filter: function(event2, player2) {
        var hs = player2.countCards("he", function(card2) {
          return !player2.storage.cichongmrfz.includes(get.type2(card2));
        }), bool = false;
        for (var i2 of game.players) {
          if (player2.canUse("sha", i2) || i2 != player2) continue;
          bool = true;
          break;
        }
        return hs > 0 && bool;
      },
      filterCard: function(card2) {
        var storage = _status.event.player.storage.cichongmrfz;
        return !storage.includes(get.type2(card2));
      },
      filterTarget: lib.filter.notMe,
      position: "he",
      async content(event2, trigger2, player2) {
        player2.markSkill("cichongmrfz");
        const target2 = event2.targets[0], card2 = event2.cards[0];
        player2.storage.cichongmrfz.add(get.type2(card2));
        const { bool } = await target2.chooseToDiscard().set("prompt", `【磁冲】:请弃置一张【闪】或防具牌，否则受到来自${get.translation(player2)}的一点伤害`).set("filterCard", (card3) => get.name(card3, target2) == "shan" || get.subtype(card3) == "equip2").set("ai", (card3) => get.value(card3) < 8).forResult();
        if (bool) return;
        target2.damage();
      },
      ai: {
        order: 4,
        result: {
          target: function(player2, target2) {
            if (get.attitude(player2, target2) < 0) {
              return -(1 + target2.countCards("h") * 0.1 + target2.hp * 0.5);
            }
          }
        }
      },
      group: ["cichongmrfz_add", "cichongmrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.unmarkSkill("cichongmrfz");
            player.storage.cichongmrfz = [];
          }
        },
        add: {
          forced: true,
          firstDo: true,
          trigger: { source: "damageBegin3" },
          filter: function(event2, player2) {
            return !player2.canUse("sha", event2.player) && event2.player.isIn();
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
          }
        }
      }
    },
    ganraomrfz: {
      audio: 2,
      init: (player2, skill) => {
        player2.storage[skill] = [];
      },
      trigger: { source: "damageBegin3" },
      filter: function(event2, player2) {
        var storage = player2.storage.ganraomrfz;
        return !storage.includes(event2.player) && event2.player.isIn();
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      async content(event2, trigger2, player2) {
        let dialog = ["【干扰】:请选择一张牌"], list = [];
        for (var i2 = 0; i2 < lib.inpile.length; i2++) {
          var name = lib.inpile[i2];
          if (get.type(name) == "equip") list.push(["装备", "", name]);
          else if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
          else if (get.type(name) == "basic") list.push(["基本", "", name]);
        }
        dialog.push([list, "vcard"]);
        const { links } = await player2.chooseButton(1, true).set("createDialog", dialog).set("ai", (button) => {
          var target2 = _status.event.target;
          if (target2.hp < 2) return ["tao", "jiu"].randomGet();
          return ["shan", "wuxie", "tao"].randomGet();
        }).set("target", trigger2.player).forResult();
        if (!links) return;
        if (!trigger2.player.storage.ganraomrfz_ban) trigger2.player.storage.ganraomrfz_ban = [];
        trigger2.player.storage.ganraomrfz_ban.add(links[0][2]);
        trigger2.player.addTempSkill("ganraomrfz_ban", { global: "phaseEnd" });
        player2.storage.ganraomrfz.add(trigger2.player);
      },
      group: ["ganraomrfz_clear"],
      subSkill: {
        ban: {
          mod: {
            cardEnabled2: function(card2, player2) {
              if (player2.storage.ganraomrfz_ban.includes(get.name(card2, player2))) return false;
            }
          },
          charlotte: true,
          silent: true,
          onremove: (player2, skill) => {
            delete player2.storage[skill];
          },
          mark: true,
          intro: {
            content: (event2, player2, storage) => {
              return `不能使用或打出${get.translation(player2.storage[storage])}`;
            }
          }
        },
        clear: {
          charlotte: true,
          silent: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            player.storage.ganraomrfz = [];
          }
        }
      }
    },
    //海蒂
    anxinmrfz: {
      audio: 2,
      trigger: { global: "gainEnd" },
      filter: function(event2, player2) {
        if (event2.source === void 0 || !event2.source.isIn()) return false;
        if (event2.source != player2 || !event2.cards) return false;
        return event2.cards.length > 0;
      },
      async content(event2, trigger2, player2) {
        let num = trigger2.cards.length, dialog = ["【暗信】:请选择一张牌"], list = [];
        for (var i2 = 0; i2 < lib.inpile.length; i2++) {
          var name = lib.inpile[i2];
          if (get.type(name) == "delay" || get.type(name) == "equip") continue;
          if (name == "sha") {
            list.push(["基本", "", "sha"]);
            for (var j of lib.inpile_nature) {
              list.push(["基本", "", "sha", j]);
            }
          } else if (get.type2(name) == "trick") list.push(["锦囊", "", name]);
          else if (get.type(name) == "basic") list.push(["基本", "", name]);
        }
        dialog.push([list, "vcard"]);
        while (num--) {
          var { links } = await player2.chooseButton(1, true).set("createDialog", dialog).set("ai", (button) => {
            var card2 = {
              name: button.link[2],
              nature: button.link[3]
            };
            _status.event.player;
            var target2 = _status.event.target, att = _status.event.att, num2 = target2.getUseValue(card2, null, true);
            if (card2.name == "jiedao" && att < 0) num2 -= 10;
            if ((card2.name == "tao" || card2.name == "shan") && att < 0) num2 -= 5;
            return num2 * att;
          }).set("target", trigger2.player).set("att", get.attitude(trigger2.player, player2) > 0 ? 1 : -1).forResult();
          if (!links) continue;
          let viewCards = {
            name: links[0][2],
            nature: links[0][3]
          };
          var gaincards = trigger2.cards.filter((card2) => {
            return !card2.hasGaintag("anxinmrfz") && get.position(card2) == "h";
          }), tmpnum = gaincards.length;
          if (gaincards.length == 0) return;
          var { links } = gaincards.length == 1 ? { links: gaincards } : await player2.chooseCardButton(`【暗信】:请你选择视为${viewCards["nature"] === void 0 ? "" : get.translation(viewCards["nature"])}${get.translation(viewCards["name"])}的牌`, true, gaincards, [1, tmpnum]).set("ai", () => {
            if (ui.selected.buttons.length == 0) return 1;
            return 0;
          }).forResult();
          if (!links) continue;
          for (var i2 = 0; i2 < links.length; i2++) {
            links[i2].gaintag.add("anxinmrfz");
            links[i2].storage.anxinmrfz = viewCards;
          }
          var gaincards = trigger2.cards.filter((card2) => {
            return !card2.hasGaintag("anxinmrfz") && get.position(card2) == "h";
          });
          if (gaincards.length == 0) return;
        }
      },
      global: "anxinmrfz_views",
      group: ["anxinmrfz_use"],
      subSkill: {
        use: {
          charlotte: true,
          forced: true,
          trigger: { global: "useCardAfter" },
          filter: function(event2, player2) {
            return event2.player.hasHistory("lose", function(evt) {
              if (evt.getParent() != event2) return false;
              for (var i2 in evt.gaintag_map) {
                if (evt.gaintag_map[i2].includes("anxinmrfz")) return true;
              }
              return false;
            });
          },
          content: () => {
            player.draw();
            player.logSkill("anxinmrfz");
          }
        },
        views: {
          charlotte: true,
          mod: {
            aiOrder: function(player2, card2, num) {
              if (get.itemtype(card2) == "card" && card2.hasGaintag("anxinmrfz")) return num + 1;
            },
            cardname: function(card2, player2) {
              var viewsCard = card2.storage.anxinmrfz;
              if (get.itemtype(card2) == "card" && card2.hasGaintag("anxinmrfz")) return viewsCard.name;
            },
            cardnature(card2, player2) {
              var viewsCard = card2.storage.anxinmrfz;
              if (get.itemtype(card2) == "card" && card2.hasGaintag("anxinmrfz")) return viewsCard.nature;
            }
          }
        }
      }
    },
    gongchoumrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      selectTarget: -1,
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        let targets2 = event2.targets, list = [];
        while (true) {
          if (targets2[0].countCards("h") == 0) {
            targets2.shift();
            continue;
          }
          var { cards: cards2 } = await targets2[0].chooseCard(true).set("prompt", `【觥筹】:请选择一张牌交给${get.translation(player2)}`).set("ai", function(card2) {
            return get.value(card2) < 6;
          }).forResult();
          if (!cards2) {
            targets2.shift();
            continue;
          }
          targets2[0].give(cards2, player2);
          list.add(targets2[0]);
          targets2.shift();
          if (targets2.length == 0) break;
        }
        if (list.length == 0) return;
        while (true) {
          if (player2.countCards("he") == 0) return;
          var { cards: cards2 } = await player2.chooseCard(true, "he").set("prompt", `【觥筹】:请选择一张牌交给${get.translation(list[0])}`).set("ai", function(card2) {
            return get.value(card2) < 6;
          }).forResult();
          if (!cards2) {
            list.shift();
            continue;
          }
          player2.give(cards2, list[0]);
          list.shift();
          if (list.length == 0) break;
        }
      },
      ai: {
        order: 13,
        result: {
          player: 1
        }
      }
    },
    yinshimrfz: {
      mod: {
        targetEnabled: function(card2, player2, target2) {
          var num = 0, list = ["h", "j", "e"];
          for (var i2 = 0; i2 < list.length; i2++) {
            if (target2.countCards(list[i2]) == 0) continue;
            num++;
          }
          if (player2.getHistory("useCard").length < num && _status.currentPhase != target2) return false;
        }
      },
      audio: 2,
      trigger: {
        global: "useCard"
      },
      forced: true,
      filter: (event2, player2) => {
        var num = 0, list = ["h", "j", "e"];
        for (var i2 = 0; i2 < list.length; i2++) {
          if (player2.countCards(list[i2]) == 0) continue;
          num++;
        }
        return event2.player.getHistory("useCard").length < num && _status.currentPhase != player2 && (event2.card.name == "nanman" && player2 != event2.player || event2.card.name == "wanjian" && player2 != event2.player || event2.card.name == "taoyuan" && player2.hp < player2.maxHp || event2.card.name == "wugu");
      },
      content: () => {
      }
    },
    //崖心
    lingdingmrfz: {
      init: (player2, skill) => {
        player2.storage[skill] = [0, 1];
      },
      mark: true,
      intro: {
        markcount: "",
        content: (event2, player2, storage) => {
          return `${player2.storage[storage][0]}/${player2.storage[storage][1]}`;
        }
      },
      audio: 2,
      direct: true,
      trigger: {
        player: ["respond", "useCard"]
      },
      async content(event2, trigger2, player2) {
        player2.storage.lingdingmrfz[0]++;
        let usenum = player2.storage.lingdingmrfz[0], num = player2.storage.lingdingmrfz[1];
        if (usenum < num) return;
        const { bool } = await player2.chooseBool(`【凌顶】:你可以摸${num}张牌`).set("frequentSkill", "lingdingmrfz").set("prompt2", get.prompt2("lingdingmrfz").substring(get.prompt2("lingdingmrfz").indexOf("###", get.prompt2("lingdingmrfz").indexOf("###") + 3) + 3)).forResult();
        if (!bool) return;
        player2.storage.lingdingmrfz[0] = 0;
        if (player2.storage.lingdingmrfz[1] < player2.maxHp) player2.storage.lingdingmrfz[1]++;
        player2.draw(num);
        player2.logSkill("lingdingmrfz");
      }
    },
    yabengmrfz: {
      audio: 2,
      trigger: { player: "dying" },
      forced: true,
      content: () => {
        player.draw(Math.min(2, player.storage.lingdingmrfz[0]));
        player.storage.lingdingmrfz = [0, 0];
      }
    },
    //初雪
    shengnvmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.countPlayer((current) => {
          return current != player2;
        }) > 1;
      },
      selectTarget: 2,
      filterTarget: lib.filter.notMe,
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        let targets2 = event2.targets, targets22 = [], csn = [void 0, void 0];
        while (targets2.length > 0) {
          var target2 = targets2[0], list = [], csList = ["收回所有装备区的牌", "将一张手牌当【乐不思蜀】置于你的判定区", "不能响应下一张指定你为目标的基本牌或普通锦囊牌"];
          if (target2.countCards("e") > 0) {
            list.push("选项一");
          } else csList[0] = '<span style="opacity:0.5; ">' + csList[0] + "（不可选：装备区没有牌）</span>";
          for (var i2 of target2.getCards("h")) {
            if (!target2.canAddJudge({ name: "lebu", cards: [i2] })) continue;
            list.push("选项二");
            break;
          }
          if (!list.includes("选项二")) csList[1] = '<span style="opacity:0.5; ">' + csList[1] + "（不可选：无法对自己使用【乐不思蜀】）</span>";
          list.push("选项三");
          if (list.length == 0) continue;
          const { control } = await target2.chooseControl(list).set("choiceList", csList).set("ai", function() {
            var list2 = _status.event.list;
            if (list2.includes("选项二")) list2.remove("选项二");
            return list2.randomGet();
          }).set("target", target2).set("list", list).forResult();
          if (!control) continue;
          csn[targets2.length - 1] = control;
          targets22.add(target2);
          switch (control) {
            case "选项一":
              target2.gain(target2.getCards("e"), "gain2");
              break;
            case "选项二":
              const { cards: cards2 } = await target2.chooseCard(true).set("prompt", "【圣女】:请选择一张手牌当【乐不思蜀】置于你的判定区").set("filterCard", (card2) => {
                return target2.canAddJudge({ name: "lebu", cards: [card2] });
              }).set("ai", (card2) => {
                return 6 - get.value(card2);
              }).forResult();
              if (!cards2) break;
              target2.useCard({ name: "lebu" }, cards2, target2);
              break;
            case "选项三":
              target2.addMark("shengnvmrfz_direct", 1, false);
              break;
          }
          targets2.shift();
        }
        if (csn[0] != csn[1]) {
          for (var i2 of targets22) {
            if (!i2.countGainableCards(player2, "he")) continue;
            player2.gainPlayerCard("he", i2, true).set("ai", lib.card.shunshou.ai.button);
          }
        } else player2.draw(2);
      },
      ai: {
        order: 13,
        result: {
          target: -1
        }
      },
      global: "shengnvmrfz_direct",
      subSkill: {
        direct: {
          charlotte: true,
          direct: true,
          intro: {
            content: "不能响应下#张指定你为目标的基本牌或普通锦囊牌"
          },
          trigger: {
            target: "useCardToPlayered"
          },
          filter: function(event2, player2) {
            return player2.countMark("shengnvmrfz_direct") > 0 && (get.type(event2.card) == "basic" || get.type(event2.card) == "trick");
          },
          content: function() {
            player.logSkill("shengnvmrfz");
            player.removeMark("shengnvmrfz_direct", 1, false);
            trigger.directHit.add(player);
          }
        }
      }
    },
    shenshemrfz: {
      audio: 2,
      forced: true,
      trigger: { target: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (player2.countCards("h", (card2) => get.is.shownCard(card2)) < 1) return false;
        var max = 0, shown = player2.getCards("h", (card2) => get.is.shownCard(card2));
        for (var i2 of shown) {
          if (i2.number > max) max = i2.number;
        }
        var number = get.number(event2.card);
        if (number != null && number > max) return false;
        return event2.player.countCards("he") > 0 && event2.player != player2 && get.tag(event2.card, "damage") > 0;
      },
      async content(event2, trigger2, player2) {
        let list = [], source = trigger2.player, tranTmp = function(str) {
          var list2 = ["e", "h"];
          var cn = ["装备", "手牌"];
          for (var i2 = 0; i2 < list2.length; i2++) {
            if (str == list2[i2]) return cn[i2];
          }
        };
        if (source.countCards("h") > 0) list.push("h");
        if (source.countCards("e") > 0) list.push("e");
        let num = list.length;
        if (num == 0) return;
        source.chooseToDiscard(true).set("position", "he").set("prompt", `【神慑】:请弃置${list.length > 1 ? tranTmp(list[0]) + "和" + tranTmp(list[1]) : tranTmp(list[0])}区的一张牌`).set("selectCard", num).set("filterCard", (card2) => {
          if (ui.selected.cards.length == 0) return true;
          if (get.position(ui.selected.cards[0]) == "h") return get.position(card2) == "e";
          return get.position(card2) == "h";
        }).set("complexCard", true).set("ai", (card2) => {
          return 8 - get.value(card2);
        });
      },
      ai: {
        threaten: 0.6
      },
      group: "shenshemrfz_show",
      subSkill: {
        show: {
          audio: "shenshemrfz",
          forced: true,
          trigger: { player: "phaseJieshuBegin" },
          filter: function(event2, player2) {
            return player2.countCards("h", (card2) => !get.is.shownCard(card2)) > 0 && player2.countCards("h", (card2) => get.is.shownCard(card2)) == 0;
          },
          async content(trigger2, event2, player2) {
            let hs = player2.getCards("h", (card2) => !get.is.shownCard(card2));
            if (hs.length == 0) return;
            player2.addShownCards(hs, "visible_shenshemrfz");
          }
        }
      }
    },
    //狮蝎
    qianzongmrfz: {
      audio: 2,
      trigger: {
        player: "showCharacterAfter"
      },
      direct: true,
      hiddenSkill: true,
      filter: function(event2, player2) {
        return event2.toShow.includes("shixiemrfz");
      },
      async content(event2, trigger2, player2) {
        if (player2 == _status.currentPhase) {
          let list = ["摸一张牌"];
          if (player2.getDamagedHp() > 0) list.push("回复体力");
          list.push("cancel2");
          const { control } = await player2.chooseControl(list).set("prompt", "【潜踪】:你可以回复一点体力或摸一张牌").set("ai", function() {
            var player3 = _status.event.player;
            if (player3.hp < 3) return "回复体力";
            return "摸一张牌";
          }).forResult();
          if (!control || control == "cancel2") return;
          switch (control) {
            case "摸一张牌":
              player2.draw();
              break;
            case "回复体力":
              player2.recover();
          }
          player2.logSkill("qianzongmrfz");
        } else {
          const { targets: targets2 } = await player2.chooseTarget().set("prompt", "【潜踪】:你可以对一名其他角色造成一点伤害").set("filterTarget", lib.filter.notMe).set("ai", function(target2) {
            var player3 = _status.event.player;
            return get.attitude(target2, player3) < 0;
          }).forResult();
          if (!targets2) return;
          player2.logSkill("qianzongmrfz", targets2[0]);
          targets2[0].damage();
        }
      },
      group: "qianzongmrfz_rehidden",
      subSkill: {
        rehidden: {
          direct: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.getHistory("lose", function(evt) {
              return evt.type == "discard";
            }).length == 0 && !player2.isUnseen();
          },
          async content(trigger2, event2, player2) {
            const { bool } = await player2.chooseBool().set("prompt", "【潜踪】:是否进入隐匿状态？").forResult();
            if (bool != true) return;
            player2.reUnseen();
          }
        }
      }
    },
    xiedumrfz: {
      mod: {
        cardname(card2, player2) {
          if (card2.name == "du") return "sha";
        }
      },
      audio: 2,
      trigger: { source: "damageSource" },
      filter: function(event2, player2) {
        return event2.player.isIn() && event2.player.countCards("he") > 0 && (player2 != _status.currentPhase || event2.card && event2.card.name == "sha");
      },
      async content(trigger2, event2, player2) {
        var target2 = event2.player;
        const { cards: cards2 } = await player2.choosePlayerCard(target2, "he", true, 1, "【蝎毒】:请选择一张牌").set("ai", (button) => {
          return get.value(button.link);
        }).forResult();
        if (!cards2) return;
        for (var i2 of cards2) {
          if (get.position(i2) == "e") {
            target2.discard(i2);
            continue;
          }
          i2.init([i2.suit, i2.number, "du"]);
        }
      }
    },
    lijimrfz: {
      audio: 2,
      trigger: {
        player: "useCardToPlayered"
      },
      mark: true,
      intro: {
        markcount: function(storage, player2) {
          let list = [];
          player2.getHistory("useCard", function(evt) {
            list.add(get.suit(evt.card));
          });
          return `${list.length}`;
        },
        content: function(event2, player2, skill) {
          let list = [];
          player2.getHistory("useCard", function(evt) {
            list.add(get.suit(evt.card));
          });
          return `你使用的【杀】需要${list.length}张【闪】才可抵消<br>已经使用的花色：${get.translation(list)}`;
        }
      },
      forced: true,
      filter(event2, player2) {
        return event2.card.name == "sha" && !event2.getParent().directHit.includes(event2.target);
      },
      logTarget: "target",
      async content(event2, trigger2, player2) {
        let list = [];
        await player2.getHistory("useCard", function(evt) {
          list.add(get.suit(evt.card));
        });
        const needNum = list.length;
        const id2 = trigger2.target.playerid;
        const map = trigger2.getParent().customArgs;
        if (!map[id2]) map[id2] = {};
        if (typeof map[id2].shanRequired == "number") {
          map[id2].shanRequired = needNum;
        } else {
          map[id2].shanRequired = needNum;
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter(player2, tag, arg) {
          let list = [];
          player2.getHistory("useCard", function(evt) {
            list.add(get.suit(evt.card));
          });
          if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > list.length) return false;
        }
      }
    },
    //红隼
    chihenmrfz: {
      marktext: "护",
      intro: {
        name: "护",
        content: "你有#个‘护’标记"
      },
      audio: 2,
      trigger: { player: "phaseDiscardBegin" },
      forced: true,
      filter: function(event2, player2) {
        return !player2.hasEmptySlot(2);
      },
      async content(event2, trigger2, player2) {
        let num = player2.countCards("e");
        const { targets: targets2 } = await player2.chooseTarget(`【齿痕】:请选择至多${get.cnNumber(num)}角色，令这些角色获得一个‘护’`).set("selectTarget", function() {
          var num2 = _status.event.num;
          return [0, num2];
        }).set("ai", (target2) => {
          var player3 = _status.event.player;
          return get.attitude(target2, player3) > 0;
        }).set("num", num).forResult();
        if (!targets2) return;
        for (var i2 of targets2) {
          i2.addMark("chihenmrfz");
        }
      },
      global: "chihenmrfz_eff1",
      group: ["chihenmrfz_eff2"],
      subSkill: {
        eff1: {
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num += player2.countMark("chihenmrfz");
            }
          }
        },
        eff2: {
          audio: "chihenmrfz",
          forced: true,
          trigger: { global: "useCardToTargeted" },
          filter: function(event2, player2) {
            if (!get.tag(event2.card, "damage") || !event2.targets) return false;
            if (player2.hp < event2.player.hp) return false;
            return event2.target.hasMark("chihenmrfz");
          },
          async content(event2, trigger2, player2) {
            let target2 = trigger2.target, eff = get.effect(target2, trigger2.card, trigger2.player, trigger2.player);
            const { bool } = await trigger2.player.chooseToDiscard(`【齿痕】:你须弃置一张牌，否则此牌(${get.translation(trigger2.card)})对${get.translation(target2)}无效`).set("ai", function(card2) {
              if (_status.event.eff > 0) return 10 - get.value(card2);
              return 0;
            }).set("eff", eff).forResult();
            if (bool) {
              target2.removeMark("chihenmrfz");
              return;
            }
            trigger2.getParent().excluded.add(target2);
            target2.removeMark("chihenmrfz");
          }
        }
      }
    },
    haomingmrfz: {
      audio: 2,
      direct: true,
      trigger: { source: "damageSource" },
      usable: 1,
      async content(event2, trigger2, player2) {
        const { control } = await player2.chooseControl("basic", "trick", "equip", "cancel2").set("prompt", "【号鸣】:请选择你要获得的牌的类型").set("ai", function() {
          var player3 = _status.event.player;
          if (player3.hp < 3) return "basic";
          if (player3.countCards("e") >= 3) return ["equip", "trick", "trick", "trick", "basic"].randomGet();
          return ["basic", "trick", "trick", "equip", "equip"].randomGet();
        }).forResult();
        if (!control || control == "cancel2") {
          player2.storage.counttrigger.haomingmrfz--;
          return;
        }
        player2.logSkill("haomingmrfz");
        var card2 = get.cardPile2(function(card3) {
          return get.type(card3, "trick") == control;
        });
        if (card2) player2.gain(card2, "gain2", "log");
        else player2.chat(`牌堆中没有${get.translation(control)}牌了！`);
      },
      group: ["haomingmrfz_jd", "haomingmrfz_find"],
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          intro: {
            content: "使用牌不能指定有‘护’标记的牌的角色"
          },
          mod: {
            playerEnabled: function(card2, player2, target2) {
              if (target2.hasMark("chihenmrfz")) return false;
            }
          }
        },
        jd: {
          trigger: { player: "phaseJieshuBegin" },
          direct: true,
          filter: function(event2, player2) {
            return player2.canUseToAnyone("juedou");
          },
          async content(event2, trigger2, player2) {
            const { targets: targets2 } = await player2.chooseTarget("【号鸣】:你可以选择一名其他角色，视为对其使用一张【决斗】").set("filterTarget", (card2, player3, target2) => {
              return player3.canUse("juedou", target2);
            }).set("ai", (target2) => {
              var player3 = _status.event.player, eff = get.effect(target2, { name: "juedou", isCard: true }, player3, player3);
              if (eff < 0) return 0;
              return eff;
            }).forResult();
            if (!targets2) return;
            player2.when({ global: ["damageEnd", "phaseJieshuAfter"] }).filter((event3, player3) => {
              if (event3.name == "phaseJieshu") return true;
              return event3.card && event3.card.storage.haomingmrfz == true;
            }).then(() => {
              if (trigger2.name == "phaseJieshu") return;
              var target2 = trigger2.player, num = Math.ceil(target2.countCards("h") / 2);
              if (num > 0) target2.chooseToDiscard(true, num, `【号鸣】:请弃置${get.translation(num)}张手牌`);
              target2.addTempSkill("haomingmrfz_ban", { player: "phaseEnd" });
            });
            player2.useCard({ name: "juedou", isCard: true, storage: { haomingmrfz: true } }, targets2[0]).logSkill = "haomingmrfz";
          }
        },
        find: {
          audio: "haomingmrfz",
          enable: "phaseUse",
          usable: 1,
          filter: function(event2, player2) {
            return player2.countCards("h") > 0;
          },
          prompt: "【号鸣】:你可以弃置任意张手牌，然后从牌堆中获得一张与弃置的牌字数相同的牌",
          filterCard: true,
          selectCard: [1, Infinity],
          check(card2) {
            var player2 = _status.event.player;
            if (player2.hp < 3) {
              if (ui.selected.cards.length == 0) return 6 - get.value(card2);
              return 0;
            }
            if (!player2.hasEmptySlot(2)) {
              if (ui.selected.cards.length < 2) return 6 - get.value(card2);
              return 0;
            }
            if (ui.selected.cards.length < 3) return 6 - get.value(card2);
            return 0;
          },
          async content(event2, trigger2, player2) {
            let cards2 = event2.cards, num = cards2.length, list = [];
            for (var i2 of ui.cardPile.childNodes) {
              if (get.cardNameLength(i2) != num) continue;
              list.push(i2);
            }
            if (list.length == 0) {
              player2.chat(`牌堆中没有字数为${get.cnNumber(num)}的牌！`);
              return;
            }
            const { links } = list.length == 1 ? { links: list[0] } : await player2.chooseCardButton("【号鸣】:请选择你要获得的牌", true, list).set("ai", function(button) {
              var name = button.name, player3 = _status.event.player;
              if (player3.hp < 3 && name == "tao") return 10;
              return get.value(button);
            }).forResult();
            if (!links) return;
            var card2 = get.cardPile2(function(card3) {
              return card3 == links[0];
            });
            if (card2) player2.gain(card2, "gain2", "log");
            else player2.chat(`牌堆中没有${get.translation(links)}了！`);
          },
          ai: {
            order: 5,
            result: {
              player: 1
            }
          }
        }
      }
    },
    //稀音
    sheyingmrfz: {
      mod: {
        maxHandcard: function(player2, num) {
          var bool = false;
          for (var i2 of game.players) {
            for (var j of [1, 2, 3, 4, 5]) {
              if (i2.hasCard(`jingtouE${j}mrfz`, "e")) {
                bool = true;
                break;
              }
            }
          }
          if (bool) return num + 2;
        },
        globalTo(from, to, distance) {
          var bool = false;
          for (var i2 of game.players) {
            for (var j of [1, 2, 3, 4, 5]) {
              if (i2.hasCard(`jingtouE${j}mrfz`, "e")) {
                bool = true;
                break;
              }
            }
          }
          if (bool) return distance + 1;
        }
      },
      audio: 2,
      derivation: ["jingtoumrfz_show"],
      enable: "phaseUse",
      filter: function(event2, player2) {
        var num = 0;
        for (var i2 of game.players) {
          for (var j of [1, 2, 3, 4, 5]) {
            if (i2.hasCard(`jingtouE${j}mrfz`, "e")) num++;
          }
        }
        return player2.countCards("h") > 0 && num < 4;
      },
      usable: 2,
      position: "he",
      filterCard: true,
      filterTarget: lib.filter.notMe,
      check(card2) {
        return 6 - get.value(card2);
      },
      async content(event2, trigger2, player2) {
        let targets2 = event2.targets, list1 = [], list2 = [];
        for (var i2 of [1, 2, 3, 4, 5]) list1.push(`jingtouE${i2}mrfz`);
        for (var i2 of list1) {
          list2.push(["装备", "", i2]);
        }
        const { links } = await player2.chooseButton(["稀音", [list2, "vcard"]], true).set("ai", function(button) {
          var target2 = _status.event.target;
          _status.event.list;
          var card3 = { name: button.link[2] }, equip = [];
          for (var i3 of target2.getCards("e")) equip.push(get.name(i3));
          if (equip.includes(card3.name)) return 0;
          if (get.subtype(card3) == "equip2") return 5;
          if (get.subtype(card3) == "equip1") return 4;
          if (get.subtype(card3) == "equip5") return 3;
          if (get.subtype(card3) == "equip3" || get.subtype(card3) == "equip3") return 2;
          return 1;
        }).set("target", targets2[0]).set("list", list1).forResult();
        if (!links) return;
        var suit, list3 = ["heart", "club", "spade", "spade", "diamond"];
        for (var i2 = 0; i2 < list1.length; i2++) {
          if (links[0][2] == list1[i2]) suit = list3[i2];
        }
        var card2 = game.createCard(links[0][2], suit, 7);
        targets2[0].$gain2(card2);
        game.delayx();
        targets2[0].equip(card2);
      },
      ai: {
        order: 13,
        result: {
          target: -1
        }
      }
    },
    chaozaimrfz: {
      audio: 2,
      hasJingtou(player2) {
        return this.getJingtou(player2).length > 0 ? true : false;
      },
      getJingtou(player2) {
        let cards2 = [];
        let names = Array.from({ length: 5 }, (v, i2) => `jingtouE${i2 + 1}mrfz`);
        for (let card2 of player2.getCards("e")) {
          if (names.includes(get.name(card2))) cards2.push(card2);
        }
        return cards2;
      },
      trigger: { player: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return game.hasPlayer((current) => lib.skill.chaozaimrfz.hasJingtou(current));
      },
      prompt2(event2, player2) {
        let targets2 = game.filterPlayer((current) => lib.skill.chaozaimrfz.hasJingtou(current));
        let jingtous = [];
        for (let char of game.players) {
          if (targets2.includes(char)) jingtous.addArray(lib.skill.chaozaimrfz.getJingtou(char));
        }
        return `你可以弃置${get.translation(targets2)}区域中的镜头并摸${jingtous.length}张牌`;
      },
      async content(event2, trigger2, player2) {
        let targets2 = game.filterPlayer((current) => lib.skill.chaozaimrfz.hasJingtou(current));
        let jingtous = [];
        for (let char of game.players) {
          if (targets2.includes(char)) jingtous.addArray(lib.skill.chaozaimrfz.getJingtou(char));
        }
        game.cardsDiscard(jingtous);
        player2.draw(jingtous.length);
        for (let i2 of targets2) {
          i2.addSkill("chaozaimrfz_eff");
          i2.storage.chaozaimrfz = player2;
        }
      },
      subSkill: {
        eff: {
          mark: true,
          markimage: "extension/WhichWay/image/orther/xiyinchaozaimrfz.png",
          intro: {
            name: "超载",
            content(event2, player2) {
              let str = `
									·XXX<br>
									·其他角色对你使用牌无次数限制<br>
									·其他角色对你使用牌无距离限制
								`;
              let str2 = `受到的伤害+1`;
              if (player2.storage.chaozaimrfz_eff) return str.replace(/XXX/g, `<font color = gray>${str2}（已触发）</font>`);
              return str.replace(/XXX/g, str2);
            }
          },
          global: "chaozaimrfz_eff2",
          firstDo: true,
          direct: true,
          charlotte: true,
          trigger: {
            player: "damageBegin2",
            global: ["dieAfter", "phaseBegin"]
          },
          filter(event2, player2) {
            if (event2.name == "damage") return true;
            return player2.storage.chaozaimrfz == event2.player;
          },
          async content(event2, trigger2, player2) {
            if (trigger2.name == "die" || trigger2.name == "phase") {
              player2.removeSkill("chaozaimrfz_eff");
              delete player2.storage.chaozaimrfz;
              delete player2.storage.chaozaimrfz_eff;
            } else if (player2.storage.chaozaimrfz_eff != true) {
              trigger2.num++;
              player2.logSkill("chaozaimrfz");
              player2.storage.chaozaimrfz_eff = true;
              player2.when({ global: "phaseEnd" }).then(() => {
                delete player2.storage.chaozaimrfz_eff;
              });
            }
          }
        },
        eff2: {
          charlotte: true,
          mod: {
            targetInRange(card2, player2, target2) {
              if (target2.hasSkill("chaozaimrfz_eff")) {
                return true;
              }
            },
            cardUsableTarget(card2, player2, target2) {
              if (target2.hasSkill("chaozaimrfz_eff")) return true;
            }
          }
        }
      }
    },
    //夜魔
    biaolimrfz: {
      mod: {
        aiOrder(player2, card2, num) {
          if (get.itemtype(card2) == "card" && card2.storage && card2.storage.biaolimrfz == true) return num + 1;
        },
        cardname(card2, player2, name) {
          var storage = player2.storage.biaolimrfz == "red" ? "tao" : "sha";
          if (card2.storage && card2.storage.biaolimrfz == true) return storage;
        },
        targetInRange(card2, player2, target2) {
          if (card2.storage && card2.storage.biaolimrfz == true && get.name(card2) == "sha" && target2.hp >= player2.hp) return true;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "phaseUseBegin" },
      async content(event2, trigger2, player2) {
        const result2 = await player2.draw(3).forResult();
        let cards2 = result2;
        if (!cards2) return;
        var red = 0;
        for (var i2 of cards2) {
          if (get.color(i2) == "red") red++;
          i2.storage.biaolimrfz = true;
          i2.addGaintag("biaolimrfz");
        }
        if (red > 1) player2.storage.biaolimrfz = "red";
        else player2.storage.biaolimrfz = "black";
      },
      group: ["biaolimrfz_nocount", "biaolimrfz_set"],
      subSkill: {
        set: {
          charlotte: true,
          silent: true,
          unique: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          filter(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          content() {
            var enable = lib.card.tao.enable;
            lib.card.tao.enable = function(card2, player2) {
              if (player2.storage.biaolimrfz && player2.storage.biaolimrfz == "red" && player2.isPhaseUsing()) {
                if (card2.storage.biaolimrfz) return true;
                return player2.hp < player2.maxHp;
              }
              return enable(card2, player2);
            };
            var selectTarget = lib.card.tao.selectTarget;
            lib.card.tao.selectTarget = function() {
              var player2 = _status.event.player;
              if (player2.storage.biaolimrfz && player2.storage.biaolimrfz == "red" && player2.isPhaseUsing()) {
                return [1, 1];
              }
              return selectTarget;
            };
            var filterTarget = lib.card.tao.filterTarget;
            lib.card.tao.filterTarget = function(card2, player2, target2) {
              if (player2.storage.biaolimrfz && player2.storage.biaolimrfz == "red" && player2.isPhaseUsing()) {
                if (card2.storage.biaolimrfz) return target2.hp < target2.maxHp;
                return target2.hp < target2.maxHp && target2 == player2;
              }
              return filterTarget(card2, player2, target2);
            };
          }
        },
        nocount: {
          silent: true,
          trigger: { player: "useCard2" },
          filter(event2, player2) {
            if (!event2.card) return false;
            if (event2.card.storage.biaolimrfz != true || get.name(event2.card) != "sha") return false;
            for (var i2 of event2.targets) {
              if (player2.hp <= i2.hp) return true;
            }
            return false;
          },
          content() {
            if (trigger.addCount !== false) {
              trigger.addCount = false;
              trigger.player.getStat().card.sha--;
            }
          }
        }
      }
    },
    ymkongwomrfz: {
      audio: 2,
      direct: true,
      trigger: { player: "phaseDrawEnd" },
      filter(event2, player2) {
        return player2.countCards("he") > 0;
      },
      async content(event2, trigger2, player2) {
        const { bool } = await player2.chooseToDiscard().set("position", "he").set("prompt", "【控我】:你可以弃置一张牌，然后观看牌堆顶两张牌，并以任意顺序将其置于牌堆顶或牌堆底").set("ai", function(card2) {
          var player3 = _status.event.player;
          if (player3.skipList.includes("phaseUse")) return 0;
          if (card2.storage.biaolimrfz == true) return 10 - get.value(card2);
          return 6 - get.value(card2);
        }).forResult();
        if (!bool) return;
        player2.logSkill("ymkongwomrfz");
        var cards2 = get.cards(2);
        game.cardsGotoOrdering(cards2);
        const { moved } = await player2.chooseToMove().set("list", [["牌堆顶", cards2], ["牌堆底"]]).set("prompt", "点击将牌移动到牌堆顶或牌堆底").set("processAI", function(list) {
          var cards3 = list[0][1], player3 = _status.event.player;
          var top2 = [];
          var bottom2;
          cards3.sort(function(a, b) {
            var a_value = get.color(a, player3) == "red" ? 3 : 5, b_value = get.color(b, player3) == "red" ? 3 : 5, hp = player3.hp;
            if (hp < 3) {
              if (get.color(a, player3) == "red") ;
              if (get.color(b, player3) == "red") ;
            }
            return b_value - a_value;
          });
          while (cards3.length) {
            var value2 = 0;
            if (player3.hp < 3) {
              if (get.color(cards3[0], player3) == "red") value2++;
            } else if (get.color(cards3[0], player3) == "black") value2++;
            if (value2 <= 0) break;
            top2.unshift(cards3.shift());
          }
          bottom2 = cards3;
          return [top2, bottom2];
        }).forResult();
        if (!moved) return;
        var top = moved[0];
        var bottom = moved[1];
        top.reverse();
        for (var i2 = 0; i2 < top.length; i2++) {
          ui.cardPile.insertBefore(top[i2], ui.cardPile.firstChild);
        }
        for (i2 = 0; i2 < bottom.length; i2++) {
          ui.cardPile.appendChild(bottom[i2]);
        }
        game.addCardKnower(top, player2);
        game.addCardKnower(bottom, player2);
        player2.popup(get.cnNumber(top.length) + "上" + get.cnNumber(bottom.length) + "下");
        game.log(player2, "将" + get.cnNumber(top.length) + "张牌置于牌堆顶");
        game.updateRoundNumber();
        let { promise, resolve } = Promise.withResolvers();
        setTimeout(() => {
          resolve();
        }, 500);
        await promise;
      }
    },
    //惊蛰
    chunleimrfz: {
      audio: 2,
      trigger: { global: "phaseZhunbeiBegin" },
      direct: true,
      filter(event2, player2) {
        return player2.countCards("he", { color: "black" }) > 0;
      },
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseCard().set("prompt", `【春雷】:你可以弃置一张黑色的牌，对${get.translation(trigger2.player)}造成一点雷属性的伤害`).set("filterCard", (card2) => get.color(card2) == "black").set("position", "he").set("ai", (card2) => {
          var player3 = _status.event.player;
          if (get.damageEffect(_status.event.target, player3, player3, "thunder") > 0) return 6 - get.value(card2);
          return 0;
        }).set("target", trigger2.player).forResult();
        if (!cards2) return;
        player2.discard(cards2);
        trigger2.player.damage("thunder");
        player2.logSkill("chunleimrfz", trigger2.player);
      },
      ai: {
        expose: 0.1,
        threaten: 1.3
      }
    },
    zheqimrfz: {
      audio: 2,
      forced: true,
      trigger: { global: "damageEnd" },
      usable: 1,
      filter(event2, player2) {
        return event2.nature && event2.nature == "thunder";
      },
      async content(event2, trigger2, player2) {
        var target2 = _status.currentPhase;
        if (!target2) return;
        target2.addTempSkill("zheqimrfz_eff1");
        player2.addTempSkill("zheqimrfz_eff2", { global: "phaseBegin" });
      },
      subSkill: {
        eff1: {
          mark: true,
          intro: {
            content: "<i>正月启蛰，言发蛰也。万物出乎震，震为雷，故曰惊蛰。是蛰虫惊而出走矣。<br>————《大戴礼记·夏小正》</i>"
          },
          mod: {
            cardUsable(card2) {
              if (get.itemtype(card2) == "card") return Infinity;
            }
          },
          forced: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter(event2, player2) {
            return event2.card && get.type(event2.card) != "equip" && player2.countCards("h") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.chooseToDiscard(true, "【蛰起】:请选择弃置一张手牌").set("ai", (card2) => 6 - get.value(card2));
          }
        },
        eff2: {
          audio: "zheqimrfz",
          forced: true,
          charlotte: true,
          trigger: { global: "phaseEnd" },
          getDiscard: function(event2, player2) {
            var history = event2.player.getHistory("lose", function(evt) {
              return evt && evt.type == "discard";
            }), cards2 = [];
            if (history.length == 0) return cards2;
            for (var i2 = 0; i2 < history.length; i2++) {
              var cardsList = history[i2].cards;
              for (var j = 0; j < cardsList.length; j++) {
                if (get.position(cardsList[j], true) != "d") continue;
                cards2.push(cardsList[j]);
              }
            }
            return cards2;
          },
          filter(event2, player2) {
            var cards2 = lib.skill.zheqimrfz_eff2.getDiscard(event2, player2);
            return cards2.length > 0;
          },
          async content(event2, trigger2, player2) {
            let cards2 = lib.skill.zheqimrfz_eff2.getDiscard(trigger2, player2);
            const { links } = await player2.chooseButton(["【蛰起】:请选择你要获得的牌", cards2]).set("forced", true).set("filterButton", (button) => {
              var player3 = _status.event.player;
              return !ui.selected.buttons.some((i2) => get.type2(i2, player3) == get.type2(button, player3));
            }).set("selectButton", [1, Infinity]).set("ai", (button) => {
              return _status.event.player.getUseValue(button.link);
            }).forResult();
            if (!links) return;
            player2.gain(links, "gain2");
          }
        }
      },
      ai: {
        threaten: 1.3
      }
    },
    //龙舌兰
    pianfengmrfz: {
      audio: 2,
      trigger: { source: "damageSource" },
      filter(event2, player2) {
        return event2.player && event2.player.isIn() && event2.card.isCard && event2.cards.filterInD().length > 0 && event2.player.countCards("h") > 0;
      },
      prompt(event2, player2) {
        var num = event2.player.getHistory("damage", (evt) => {
          return evt.card && evt.card.name == event2.card.name;
        }).length + 1;
        return `【偏锋】:是否令${get.translation(event2.player)}回复一点体力并展示其${get.cnNumber(num)}张手牌`;
      },
      check(event2, player2) {
        var num = event2.player.getHistory("damage", (evt) => {
          return evt.card && evt.card.name == event2.card.name;
        }).length, att = get.attitude(event2.player.player);
        return att < 0 && event2.player.countCards("h") >= num;
      },
      async content(event2, trigger2, player2) {
        let num = trigger2.player.getHistory("damage", (evt) => {
          return evt.card && evt.card.name == trigger2.card.name;
        }).length + 1, target2 = trigger2.player;
        target2.recover();
        const { cards: cards2 } = await player2.choosePlayerCard().set("selectButton", num).set("forced", true).set("position", "h").set("target", target2).set("prompt", `【偏锋】:请选择展示${get.translation(target2)}的${get.cnNumber(num)}张牌`).forResult();
        if (!cards2) return;
        player2.showCards(cards2, `${get.translation(player2)}展示了${get.translation(target2)}的${get.cnNumber(num)}张牌`);
        game.delay();
        let bool = false;
        for (var i2 of cards2) {
          if (get.type2(i2) != get.type2(trigger2.card)) continue;
          bool = true;
        }
        if (!bool) {
          player2.draw(num);
          return;
        }
        target2.discard(cards2);
        target2.loseHp(num);
      },
      ai: {
        threaten: 1.5
      }
    },
    //阿米娅
    tongganmrfz: {
      audio: 2,
      trigger: {
        global: "drawAfter"
      },
      usable: 3,
      forced: true,
      filter: function(event2, player2) {
        return event2.player !== player2;
      },
      content: function() {
        player.draw();
      },
      group: "tonggan_discardmrfz",
      ai: {
        threaten: 2
      }
    },
    tonggan_discardmrfz: {
      audio: 2,
      trigger: {
        global: "loseAfter"
      },
      usable: 3,
      filter: function(event2, player2) {
        if (event2.type != "discard") return false;
        return event2.player !== player2;
      },
      forced: true,
      content: function() {
        player.chooseToDiscard("he", true, 1);
      }
    },
    qinghemrfz: {
      audio: 2,
      zhuSkill: true,
      trigger: {
        player: "loseAfter",
        global: "loseAsyncAfter"
      },
      filter: function(event2, player2) {
        if (player2 == _status.currentPhase) return false;
        return event2.type == "discard" && event2.getl(player2).cards2.length > 0 && !player2.hasSkill("qinghemrfz_ban");
      },
      direct: true,
      content: function() {
        "step 0";
        var target2 = _status.currentPhase;
        if (!target2) return;
        target2.chooseBool("【亲和】：是否让" + get.translation(player) + "其弃置的牌中的一张牌？").set("ai", () => {
          return get.attitude(_status.currentPhase, _status.event.targetx) > 0;
        }).set("targetx", player);
        if (result.bool) {
          var target2 = _status.currentPhase;
          player.addTempSkill("qinghemrfz_ban", "phaseEnd");
          if (trigger.cards.length == 1) {
            player.gain(trigger.cards, "gain2");
            event.finish();
          }
          if (trigger.cards.length > 1) {
            target2.chooseButton(["选择获得令其获得其中的一张牌", trigger.cards.slice(0)], true).ai = function(button) {
              return get.value(button.link);
            };
          }
        } else event.finish();
        if (result.links) {
          player.logSkill("qinghemrfz");
          player.gain(result.links, "gain2");
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //doc 医生
    yizhemrfz: {
      mod: {
        ignoredHandcard: function(card2, player2) {
          if (get.name(card2) == "tao") {
            return true;
          }
        },
        cardDiscardable: function(card2, player2, name) {
          if (name == "phaseDiscard" && get.name(card2) == "tao") return false;
        }
      },
      init() {
        var enable = lib.card.tao.enable;
        lib.card.tao.enable = function(card2, player2) {
          if (player2.hasSkill("yizhemrfz")) {
            return true;
          }
          return enable(card2, player2);
        };
        var selectTarget = lib.card.tao.selectTarget;
        lib.card.tao.selectTarget = function() {
          var player2 = _status.event.player;
          if (player2.hasSkill("yizhemrfz")) {
            return [1, 1];
          }
          return selectTarget;
        };
        var filterTarget = lib.card.tao.filterTarget;
        lib.card.tao.filterTarget = function(card2, player2, target2) {
          if (player2.hasSkill("yizhemrfz")) {
            return target2.hp < target2.maxHp && (player2.inRange(target2) || player2 == target2);
          }
          return filterTarget(card2, player2, target2);
        };
        lib.card.tao.content = function() {
          if (player.hasSkill("yizhemrfz")) {
            var num = target.getDamagedHp();
            target.recover(5);
            if (5 - num > 0) {
              target.addSkill("yizhemrfz_eff");
              target.storage.yizhemrfz_eff = 5 - num;
              target.changeHujia(5 - num);
            }
          } else target.recover();
        };
      },
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      filter(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      forced: true,
      content() {
        var cards2 = [];
        if (ui.cardPile.childNodes.length < 1) return;
        for (var i2 of ui.cardPile.childNodes) {
          if (cards2.length > 2) break;
          if (i2.name == "tao") cards2.push(i2);
        }
        if (cards2.length > 0) player.gain(cards2, "gain2");
        else player.chat("byd怎么开局牌堆中的桃就没了？");
      },
      subSkill: {
        eff: {
          mark: true,
          intro: {
            content(event2, player2) {
              return `你因【桃】而获得的护甲数:${player2.storage.yizhemrfz_eff}`;
            }
          },
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            if (!player2.hujia) return;
            if (player2.storage.yizhemrfz_eff && player2.storage.yizhemrfz_eff > 0) {
              player2.storage.yizhemrfz_eff--;
              player2.changeHujia(-1);
              player2.popup("失去护甲");
              game.log(player2, "失去了一点因【桃】而获得的护甲值");
            }
            if (player2.storage.yizhemrfz_eff && player2.storage.yizhemrfz_eff == 0) {
              player2.removeSkill("yizhemrfz_eff");
              delete player2.storage.yizhemrfz_eff;
              player2.unmarkSkill("yizhemrfz_eff");
            }
          },
          group: "yizhemrfz_lose"
        },
        lose: {
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.hujia;
          },
          charlotte: true,
          silent: true,
          async content(event2, trigger2, player2) {
            if (player2.storage.yizhemrfz_eff && player2.storage.yizhemrfz_eff > 0) {
              player2.storage.yizhemrfz_eff--;
            }
            if (player2.storage.yizhemrfz_eff && player2.storage.yizhemrfz_eff == 0) {
              player2.removeSkill("yizhemrfz_eff");
              delete player2.storage.yizhemrfz_eff;
              player2.unmarkSkill("yizhemrfz_eff");
            }
          }
        }
      }
    },
    zhulimrfz: {
      mod: {
        cardname(card2, player2, name) {
          if (card2.hasGaintag("zhulimrfz")) return "tao";
        }
      },
      audio: 2,
      trigger: { player: "phaseJieshuBegin" },
      forced: true,
      async content(event2, trigger2, player2) {
        if (player2.getStat("damage") != void 0) {
          if (player2.countCards("he") > 0) player2.chooseToDiscard("he", true, `【医者】:请选择弃置一张牌`);
        } else {
          const result2 = await player2.draw(2);
          if (!result2) return;
          var cards2 = result2.result;
          for (var i2 of cards2) {
            var num = get.number(i2);
            if (get.suit(i2) == "heart" && num >= 2 && num <= 9) {
              i2.addGaintag("zhulimrfz");
            }
          }
        }
      }
    },
    //inna 双月
    shuangzimrfz: {
      audio: 2,
      group: ["shuangzimrfz_eff1", "shuangzimrfz_eff2"],
      subSkill: {
        eff1: {
          direct: true,
          trigger: { player: "useCardBegin" },
          async content(event2, trigger2, player2) {
            let cardcopy = { ...trigger2.card }, evt = event2.getParent(3);
            var num = get.randomNumberSJZX();
            cardcopy["idSJZX"] = num;
            cardcopy["evtP"] = evt.orderingCards;
            console.log(evt.orderingCards);
            trigger2.card["idSJZX"] = num;
            if (!player2.storage.shuangzimrfz) player2.storage.shuangzimrfz = [];
            player2.storage.shuangzimrfz.push(cardcopy);
            trigger2.card.cards = [];
            delete trigger2.card.number;
            delete trigger2.card.suit;
            delete trigger2.card.color;
            evt.orderingCards = void 0;
            evt.cards = [];
          }
        },
        eff2: {
          direct: true,
          trigger: {
            source: ["damageBegin"],
            player: ["cardsDiscardAfter"]
          },
          filter(event2, player2) {
            if (event2.name == "damage") {
              var storage = player2.storage.shuangzimrfz;
              if (!event2.card) return false;
              for (var i2 of storage) {
                if (event2.card.idSJZX != i2.idSJZX) continue;
                return true;
              }
              return false;
            } else {
              var evt = event2.getParent();
              var storage = player2.storage.shuangzimrfz;
              if (evt.name != "orderingDiscard") return false;
              for (var i2 of storage) {
                for (var j in event2.cards) {
                  if (j.idSJZX != i2.idSJZX) continue;
                  return event2.cards.filterInD("d").length;
                }
              }
              return false;
            }
          },
          async content(event2, trigger2, player2) {
            let evt = event2.getParent(3), storage = player2.storage.shuangzimrfz;
            for (var i2 of storage) {
              if (i2.idSJZX == trigger2.card.idSJZX) {
                evt.cards = i2.cards;
                trigger2.card.cards = i2.cards;
                trigger2.card.number = i2.number;
                trigger2.card.suit = i2.suit;
                trigger2.card.color = i2.color;
                delete player2.storage.shuangzimrfz[i2];
              }
            }
            console.log(trigger2.card);
            console.log(evt);
          }
        }
      }
    },
    //凛视
    /** @type { Skill } */
    jiangtumrfz: {
      audio: 2,
      direct: true,
      trigger: { player: ["gainPlayerCardBegin", "discardPlayerCardBegin", "choosePlayerCardBegin"] },
      filter(event2, player2) {
        return _status.currentPhase == event2.target;
      },
      async content(event2, trigger2, player2) {
        player2.logSkill("jiangtumrfz", _status.currentPhase);
        trigger2.visible = true;
      },
      ai: {
        threaten: 1.1,
        viewHandcard: true,
        skillTagFilter(player2, tag, arg) {
          if (tag === "viewHandcard" && arg !== _status.currentPhase) return false;
        }
      }
    },
    /** @type { Skill } */
    jieshimrfz: {
      mod: {
        aiOrder: function(player2, card2, num) {
          var list = player2.storage.jieshimrfz;
          if (typeof card2 == "object" && player2.isPhaseUsing() && list && list.length > 0) {
            if (get.type2(card2) == list[0]) return num + 10;
          }
        }
      },
      audio: 3,
      trigger: { global: "phaseUseBegin" },
      filter(event2, player2) {
        return player2.countCards("he") > 0;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseToDiscard("he").set("prompt", `【揭示】:你可以弃置一张牌，然后猜测${trigger2.player == player2 ? "你" : get.translation(trigger2.player)}本阶段前三张牌分别使用的类型（对${trigger2.player == player2 ? "你" : get.translation(trigger2.player)}不可见）。`).set("ai", function(card2) {
          return 8 - get.value(card2);
        }).forResult();
        if (!cards2) return;
        player2.logSkill("jieshimrfz");
        var list = [
          ["待选择的牌的类型", [["basic", "basic", "basic", "trick", "trick", "trick", "equip", "equip", "equip"], "vcard"]],
          ["请调整顺序<br>从左到右:第一、二、三张牌", []]
        ];
        const { moved } = await player2.chooseToMove(`【揭示】:请猜测${trigger2.player == player2 ? "你" : get.translation(trigger2.player)}本阶段前三张牌分别使用的类型`).set("list", list).set("filterMove", function(from, to, moved2) {
          return to == 1 && moved2[1].length < 3 || to == 0 || typeof to !== "number";
        }).set("processAI", () => {
          var moved2 = [[114514], []], cards3 = _status.currentPhase.getCards("h"), order = [
            [0, 0],
            [0, 0],
            [0, 0]
          ];
          for (var i2 of cards3) {
            for (var j = 0; j < order.length; j++) {
              if (get.order(i2) > order[j][1]) {
                order[j] = [i2, get.order(i2)];
                break;
              }
            }
          }
          for (var i2 of order) {
            moved2[1].push(["ByTheLeaderOne", "作者：林登万", get.type2(i2[0])]);
          }
          return moved2;
        }).forResult();
        if (!moved) return;
        var list = moved[1].map((i2) => i2[2]);
        trigger2.player.addTempSkill("jieshimrfz_eff", { player: "phaseUseEnd" });
        trigger2.player.storage.jieshimrfz = list;
        trigger2.player.storage.jieshimrfz_eff = player2;
        _status.tmpTotal_jieshimrfz = 0;
      },
      subSkill: {
        eff: {
          onremove(player2) {
            delete player2.storage.jieshimrfz;
            delete player2.storage.jieshimrfz_eff;
            delete _status.tmpTotal_jieshimrfz;
          },
          direct: true,
          charlotte: true,
          mark: true,
          intro: {
            content(event2, player2) {
              var storage = player2.storage.jieshimrfz;
              if (storage === "error") return `未知错误`;
              if (game.me === player2 && game.me.hasSkill("jieshimrfz") && storage.length > 0) return get.translation(storage);
              if (storage.length == 0) return "全部已猜测完毕";
              return `剩余${storage.length}张`;
            }
          },
          trigger: { player: "useCardAfter" },
          filter(event2, player2) {
            if (!player2.storage.jieshimrfz_eff.isIn()) return false;
            return player2.storage.jieshimrfz && player2.storage.jieshimrfz.length > 0;
          },
          async content(event2, trigger2, player2) {
            if (!_status.tmpTotal_jieshimrfz) _status.tmpTotal_jieshimrfz = 0;
            var target2 = player2.storage.jieshimrfz_eff;
            if (get.type2(trigger2.card) == player2.storage.jieshimrfz[0]) {
              _status.tmpTotal_jieshimrfz++;
              if (_status.tmpTotal_jieshimrfz == 3 && target2 != player2) player2.chat("被看穿了吗？");
              else if (_status.tmpTotal_jieshimrfz == 3) player2.chat("我猜的真准！");
              target2.logSkill("jieshimrfz", player2);
              target2.popup("猜测正确");
              target2.draw(_status.tmpTotal_jieshimrfz);
              if (_status.tmpTotal_jieshimrfz > 1) {
                var num = Math.min(_status.tmpTotal_jieshimrfz - 1, 1);
                const { bool } = await target2.chooseBool(`【揭示】:是否对${get.translation(player2)}造成${get.cnNumber(num)}点伤害？`).set("ai", () => get.damageEffect(target2, player2) > 0).forResult();
                if (bool) player2.damage(num, target2);
              }
            } else {
              if (target2 == player2) player2.chat("<img style='width:100px;height:100px' src=" + lib.assetURL + "extension/WhichWay/image/skill/jieshiError.png></img>");
              target2.popup("猜测错误");
            }
            player2.storage.jieshimrfz.shift();
          }
        }
      }
    },
    //医疗阿米娅
    tongqingmrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("tongqingmrfzx");
        });
        if (cards2.length) {
          player2.lose(cards2, ui.discardPile);
          player2.$throw(cards2, 1e3);
          game.log(cards2, "进入了弃牌堆");
        }
      },
      marktext: "情绪",
      intro: {
        name: "情绪",
        mark(dialog, content, player2) {
          var cards2 = player2.getCards("s", function(card2) {
            return card2.hasGaintag("tongqingmrfzx");
          });
          if (!cards2 || cards2.length < 1) {
            dialog.addText(`没有‘情绪’`);
          } else {
            dialog.addText(`共有${cards2.length}张‘情绪’`);
            dialog.addSmall(cards2);
          }
        }
      },
      audio: 2,
      trigger: { global: "phaseJieshuBegin" },
      getDiscard: function(event2, player2) {
        let cards2 = [];
        for (var character of game.players) {
          var history = character.getHistory("lose", function(evt) {
            return evt && evt.type == "discard";
          });
          if (history.length == 0) continue;
          for (var i2 = 0; i2 < history.length; i2++) {
            var cardsList = history[i2].cards;
            for (var j = 0; j < cardsList.length; j++) {
              if (get.position(cardsList[j], true) != "d") continue;
              cards2.push(cardsList[j]);
            }
          }
        }
        return cards2;
      },
      filter(event2, player2) {
        let cardsList = lib.skill.tongqingmrfz.getDiscard(event2, player2);
        return cardsList && cardsList.length > 0;
      },
      prompt2(event2, player2) {
        let cardsList = lib.skill.tongqingmrfz.getDiscard(event2, player2), cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("tongqingmrfzx");
        });
        return `【恸请】:你可以将所有的‘情绪’（${cards2.length > 0 ? `共有${cards2.length}张‘情绪’` : "没有‘情绪’"}）置入弃牌堆，然后将${get.translation(cardsList)}置于你的武将牌上，称之为‘情绪’`;
      },
      check(event2, player2) {
        let cardsList = lib.skill.tongqingmrfz.getDiscard(event2, player2), cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("tongqingmrfzx");
        });
        if (cards2.length < 1) return true;
        return get.value(cardsList) - get.value(cards2) > 0;
      },
      async content(event2, trigger2, player2) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("tongqingmrfzx");
        });
        if (cards2 && cards2.length > 0) {
          await player2.loseToDiscardpile(cards2);
        }
        let cardsList = lib.skill.tongqingmrfz.getDiscard(trigger2, player2);
        game.log(player2, "将", cardsList.length, "张牌置于在武将牌上");
        player2.loseToSpecial(cardsList, "tongqingmrfzx");
        player2.markSkill("tongqingmrfz");
      }
    },
    cibeimrfz: {
      audio: 2,
      trigger: { player: "loseAfter" },
      filter(event2, player2) {
        var position = event2.cards.map((i2) => i2.original);
        return position.every((item) => item != "h");
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget().set("prompt", `【慈悲】:你可以令你攻击范围内的一名角色或你回复一点体力或摸一张牌`).set("filterTarget", (card2, player3, target3) => {
          return player3.inRange(target3) || target3 == player3;
        }).set("ai", (target3) => get.attitude(_status.event.player, target3) > 0).forResult();
        if (!targets2) return;
        let target2 = targets2[0];
        if (target2.getDamagedHp() < 1) {
          target2.draw();
          player2.logSkill("cibeimrfz", target2);
          return;
        }
        const { control } = await player2.chooseControl("回复体力", "摸一张牌").set("prompt", `【慈悲】:请选择一项`).set("ai", () => 0).forResult();
        if (!control) return;
        if (control == "回复体力") {
          target2.recover();
        } else target2.draw();
        player2.logSkill("cibeimrfz", target2);
      }
    },
    // 异格芬 历战锐枪芬
    xiaozhimrfz: {
      audio: 2,
      trigger: {
        player: "useCardToPlayered"
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) < 0;
      },
      filter: function(event2, player2) {
        return event2.card.name == "sha" && player2.canCompare(event2.target);
      },
      logTarget: "target",
      async content(event2, trigger2, player2) {
        var result2 = await player2.chooseToCompare(trigger2.target);
        if (!result2) return;
        result2 = result2.result;
        if (result2.winner != player2) player2.draw(2);
        if (result2.winner != trigger2.target) {
          var cards2 = [result2.player, result2.target];
          cards2 = cards2.filter((card3) => player2.hasUseTarget(card3) && !get.owner(card3));
          if (cards2.length) {
            var { links } = await player2.chooseButton(["是否使用其中的牌？", cards2]).set("ai", (button) => _status.event.player.getUseValue(button.link)).forResult();
            if (links) {
              var card2 = links[0];
              player2.$gain2(card2, false);
              game.delayx();
              player2.chooseUseTarget(true, card2, false);
            }
          }
          trigger2.getParent().directHit.add(trigger2.target);
        }
      }
    },
    zhishoumrfz: {
      audio: 2,
      enable: "chooseToUse",
      filterCard(card2) {
        return get.itemtype(card2) == "card" && card2.hasGaintag("zhishoumrfz");
      },
      subfrequent: ["addcount"],
      position: "h",
      viewAs(cards2, player2) {
        if (cards2.length) {
          if (_status.currentPhase == player2) return { name: "sha" };
          return { name: "shan" };
        }
        return null;
      },
      viewAsFilter(player2) {
        if (!player2.countCards("h", (card2) => card2.hasGaintag("zhishoumrfz"))) return false;
      },
      prompt(event2) {
        return `【执守】:将本轮出牌阶段内获得的牌当作${_status.currentPhase === event2.player ? "【闪】" : "【杀】"}使用`;
      },
      check(card2) {
        return 7 - get.value(card2);
      },
      onremove(player2) {
        player2.removeGaintag("zhishoumrfz");
      },
      ai: {
        order: 2,
        respondShan: true,
        respondSha: true,
        skillTagFilter(player2, tag, arg) {
          if (arg == "respond" || !player2.countCards("h", (card2) => _status.connectMode || card2.hasGaintag("zhishoumrfz"))) return false;
        },
        result: {
          player: 1
        }
      },
      group: ["zhishoumrfz_mark", "zhishoumrfz_addcount"],
      subSkill: {
        addcount: {
          audio: "zhishoumrfz",
          trigger: { player: "gainAfter" },
          lastDo: true,
          frequent: true,
          filter(event2, player2) {
            var evt = event2.getParent("phaseDraw");
            if (player2.hasSkill("zhishoumrfz_eff")) return false;
            if (evt && evt.player == player2) return false;
            return event2.getg(player2).length > 0;
          },
          prompt: "【执守】:是否令本轮使用【杀】的次数+1？",
          check() {
            return true;
          },
          content() {
            player.addTempSkill("zhishoumrfz_eff", { global: "roundStart" });
          }
        },
        eff: {
          mark: true,
          intro: {
            content: "使用【杀】的次数+1"
          },
          charlotte: true,
          mod: {
            cardUsable(card2, player2, num) {
              if (card2.name == "sha") return num + 1;
            }
          }
        },
        mark: {
          silent: true,
          charlotte: true,
          trigger: {
            global: "roundStart",
            player: "gainBegin"
          },
          filter(event2, player2) {
            if (event2.name == "gain") return player2.isPhaseUsing();
            else return game.roundNumber > 1;
          },
          content() {
            if (trigger.name == "gain") trigger.gaintag.add("zhishoumrfz");
            else player.removeGaintag("zhishoumrfz");
          }
        }
      }
    },
    // 海霓
    jingchaomrfz: {
      audio: 2,
      trigger: { player: "damageEnd" },
      filter(event2, player2) {
        return player2.countCards("he") > 1;
      },
      check(event2, player2) {
        if (player2.getDamagedHp() < 1) return false;
        return 3 - player2.getDamagedHp() + player2.getCards("he", (card2) => get.value(card2) < 7).length;
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseToDiscard(2, "he").set("prompt2", `你可以弃置两张牌并回复${trigger2.num}点体力，若你弃置的牌类别不同，你将手牌补至5张`).set("ai", (card2) => {
          var player3 = get.event().player, selected = ui.selected.cards, num = get.value(card2);
          for (var i2 of selected) {
            if (get.type2(i2) == get.type2(card2)) ;
          }
          return 7 - num + player3.getDamagedHp();
        });
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let cards2 = event2.cards;
        player2.recover(trigger2.num);
        if (cards2.length != 2) return;
        if (get.type2(cards2[0]) != get.type2(cards2[1])) {
          player2.drawTo(5);
          player2.tempBanSkill("jingchaomrfz", "phaseEnd", false);
          game.log(this, "的技能", `#g【静潮】`, `本回合失效了`);
        }
      },
      ai: {
        maixie_hp: true,
        threaten: 0.8
      }
    },
    cehuimrfz: {
      init(player2, skill) {
        player2.storage[skill] = 0;
      },
      audio: 2,
      mark: true,
      intro: {
        content: "本回合开始时手牌数为：#"
      },
      trigger: {
        global: "phaseJieshuBegin"
      },
      getDiscardCards(event2) {
        let cards2 = [];
        for (var i2 of game.players.slice().concat(game.dead)) {
          var history = i2.getHistory("lose", function(evt) {
            return evt && evt.type == "discard";
          });
          if (history.length == 0) continue;
          for (var k of history) {
            if (k.cards.length == 0) continue;
            for (var j of k.cards) {
              if (get.position(j) != "d") continue;
              cards2.push(j);
            }
          }
        }
        return cards2;
      },
      filter(event2, player2) {
        var cards2 = lib.skill.cehuimrfz.getDiscardCards(event2);
        if (!game.hasPlayer((current) => current != player2 && player2.canCompare(current, true, false))) return false;
        return player2.countCards("h") != player2.storage.cehuimrfz && cards2.length > 0;
      },
      async cost(event2, trigger2, player2) {
        var cards2 = lib.skill.cehuimrfz.getDiscardCards(trigger2);
        const { result: result2 } = await player2.chooseCardButton(cards2).set("prompt2", `你可以选择一张牌并与一名其他角色进行拼点，若你赢，你使用牌堆顶3张牌`).set("ai", (link) => get.number(link));
        result2.cost_data = result2.links;
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let card2 = event2.cost_data[0];
        var { targets: targets2 } = await player2.chooseTarget(true).set("prompt", `【测绘】:请选择一名其他角色进行拼点`).set("filterTarget", (card3, player3, target2) => target2 != player3 && player3.canCompare(target2, true, false)).set("ai", (target2) => {
          var player3 = get.event().player;
          return get.attitude(player3, target2) < 0;
        }).forResult();
        if (!targets2) return;
        var tmpfuc = async function() {
          let next2 = player2.chooseToCompare(targets2[0]);
          if (!next2.fixedResult) next2.fixedResult = {};
          next2.fixedResult[player2.playerid] = card2;
          return next2;
        };
        var next = await tmpfuc();
        if (next.result.bool) {
          var cards2 = game.cardsGotoOrdering(get.cards(3)).cards;
          player2.showCards(cards2, `${get.translation(player2)}展示了牌堆顶三张牌`);
          let canUse = cards2.filter((i2) => player2.hasUseTarget(i2, false));
          if (canUse.length == 0) return;
          while (canUse.length > 0) {
            const { links } = canUse.length == 1 ? { links: canUse } : await player2.chooseCardButton(canUse, true).set("prompt", `【测绘】:请选择你要使用的牌`).set("ai", (link) => get.number(link)).forResult();
            if (!links) continue;
            await player2.chooseUseTarget(links[0]).set("nodistance", true).set("prompt", `请选择${get.translation(links[0])}的目标`);
            canUse.remove(links[0]);
          }
        }
      },
      group: ["cehuimrfz_record"],
      subSkill: {
        record: {
          silent: true,
          charlotte: true,
          trigger: {
            global: "phaseBegin"
          },
          content() {
            if (typeof player.storage.cehuimrfz !== "number") player.storage.cehuimrfz = 0;
            player.storage.cehuimrfz = player.countCards("h");
          }
        }
      }
    },
    // 深巡
    yuchaomrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return game.hasPlayer((current) => current != player2 && player2.canCompare(current, true, false)) && player2.countCards("hej") > 0;
      },
      filterTarget(card2, player2, target2) {
        return player2.canCompare(target2, true, false) && target2 != player2;
      },
      selectTarget: [1, 2],
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        let targets2 = event2.targets;
        const { links } = await player2.choosePlayerCard(player2, "hej", true).set("prompt", `【御潮】:请选择你的拼点牌`).set("ai", function(button) {
          var card2 = button.link;
          get.event().player;
          var num = 0;
          if (get.position(card2) == "j") num += 3 + get.value(card2) / 2;
          if (get.position(card2) == "e") num -= 2;
          return get.number(card2) + num - get.value(card2) / 2;
        }).forResult();
        if (!links) return;
        let next = player2.chooseToCompare(targets2);
        if (!next.fixedResult) next.fixedResult = {};
        next.fixedResult[player2.playerid] = links[0];
        next.callback = lib.skill.yuchaomrfz.callback;
      },
      async callback(event2, trigger2, player2) {
        if (event2.num1 < event2.num2) player2.link(true);
        else if (event2.num1 > event2.num2) {
          event2.target.link(true);
          player2.addTempSkill("yuchaomrfz_eff", "phaseEnd");
        } else {
          event2.target.link(true);
          player2.link(true);
        }
      },
      subSkill: {
        eff: {
          charlotte: true,
          mod: {
            cardUsableTarget(card2, player2, target2) {
              if (target2.isLinked()) return true;
            }
          }
        }
      },
      ai: {
        order: 8,
        result: {
          target: -1,
          player: 1
        }
      }
    },
    yanhuimrfz: {
      audio: 2,
      derivation: ["binglinchengxia"],
      trigger: { player: "phaseUseBegin" },
      forced: true,
      filter(event2, player2) {
        var card2 = get.autoViewAs({ name: "binglinchengxia" }, [_status.pileTop]);
        return player2.canAddJudge(card2);
      },
      async content(event2, trigger2, player2) {
        await player2.addJudge({ name: "binglinchengxia" }, [_status.pileTop]);
        player2.draw(player2.hp);
        player2.loseHp();
      }
    },
    // 明椒
    suozemrfz: {
      mark: true,
      intro: {
        content(event2, player2) {
          return `记录的牌名：${player2.storage.suozemrfz.length > 0 ? get.translation(player2.storage.suozemrfz) : "无"}`;
        }
      },
      audio: 2,
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      trigger: {
        player: ["useCardEnd", "respondEnd"]
      },
      filter(event2, player2) {
        if (event2.cards.length < 1) return false;
        return !player2.storage.suozemrfz.includes(event2.card.name) && (get.type2(event2.card) == "basic" || get.type(event2.card) == "trick");
      },
      prompt2(event2, player2) {
        return `是否记录${get.translation(event2.card)}，然后观看牌堆顶${player2.maxHp}张牌，并用等量手牌交换其中至多${player2.storage.suozemrfz.length + 1}张牌？`;
      },
      async content(event2, trigger2, player2) {
        player2.storage.suozemrfz.add(trigger2.card.name);
        game.log(player2, `的`, `#g【索赜】`, `记录了`, trigger2.card.name);
        var cards2 = get.cards(player2.maxHp);
        let cardsc = cards2.slice(0);
        const { moved } = await player2.chooseToMove(`【索赜】:请选择你要交换的牌（至多交换${player2.storage.suozemrfz.length}张牌）`).set("filterMove", (from, to) => {
          return typeof to !== "number";
        }).set("list", [
          ["牌堆顶", cardsc],
          ["你的手牌", player2.getCards("h")]
        ]).set("filterOk", (moved2) => {
          let h = get.event().cardsh;
          return h.filter((i2) => moved2[0].includes(i2)).length <= get.event().num;
        }).set("processAI", (list) => {
          var player3 = get.event().player;
          let cards1 = list[0][1].slice(), cards22 = player3.getCards("h");
          if (cards22.length === 0) {
            return [cards1, []];
          }
          let maxC = Math.max(...cards1.map((i2) => get.value(i2)));
          let minH = Math.min(...cards22.map((i2) => get.value(i2)));
          let count = 0, num = get.event().num;
          while (minH < maxC && count < num) {
            count++;
            let maxCIndex = cards1.map((i2) => get.value(i2)).indexOf(maxC);
            let minHIndex = cards22.map((i2) => get.value(i2)).indexOf(minH);
            [cards1[maxCIndex], cards22[minHIndex]] = [cards22[minHIndex], cards1[maxCIndex]];
            maxC = Math.max(...cards1.map((i2) => get.value(i2)));
            minH = Math.min(...cards22.map((i2) => get.value(i2)));
          }
          return [cards1, cards22];
        }).set("num", player2.storage.suozemrfz.length).set("cardsh", player2.getCards("h")).forResult();
        const puts = player2.getCards("h", (i2) => moved[0].includes(i2));
        const gains = cardsc.filter((i2) => moved[1].includes(i2));
        if (puts.length && gains.length) {
          player2.$throw(puts.length, 1e3);
          await player2.lose(puts, ui.special);
          await player2.gain(gains, "giveAuto");
        }
        cardsc = moved[0].slice();
        if (cardsc.length) {
          await game.cardsGotoOrdering(cardsc);
          for (let i2 = cardsc.length - 1; i2 >= 0; i2--) {
            ui.cardPile.insertBefore(cardsc[i2], ui.cardPile.firstChild);
          }
          game.log(get.cnNumber(cardsc.length, true), "张牌被放回了牌堆顶");
          game.updateRoundNumber();
        }
      }
    },
    youyimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseJieshuBegin" },
      filter(event2, player2) {
        return player2.storage.suozemrfz.length > 0;
      },
      async content(event2, trigger2, player2) {
        var list = [];
        for (var i2 = 0; i2 < lib.inpile.length; i2++) {
          var name = lib.inpile[i2];
          if (!player2.storage.suozemrfz.includes(name)) continue;
          if (get.type(name) == "basic") list.push(["基本", "", name]);
          else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
        }
        let { links } = await player2.chooseButton([`游移:请移除${Math.ceil(list.length / 2)}张牌`, [list, "vcard"]], true).set("selectButton", Math.ceil(list.length / 2)).set("ai", (button) => {
          return _status.event.player.getUseValue(button.link, null, true);
        }).forResult();
        if (!links) return;
        player2.storage.suozemrfz.removeArray(links.map((i3) => i3[2]));
        let names = links.filter((i3) => player2.hasUseTarget(i3[2])).map((i3) => [get.translation(get.type(i3[2])), "", i3[2]]);
        if (names.length < 1) return;
        let { links2 } = names.length == 1 ? { links2: names } : await player2.chooseButton(["游移:请选择一张你要使用的牌", [names, "vcard"]], true).set("ai", (button) => {
          return _status.event.player.getUseValue({ name: button.link[2] }, null, true);
        }).forResult();
        player2.chooseUseTarget({ name: links2[0][2] }, true);
      }
    },
    // 戴菲恩
    zhuofengmrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      filter(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        let list = [];
        if (player2.getCards("h", { color: "red" }).length) list.push("red");
        if (player2.getCards("h", { color: "black" }).length) list.push("black");
        list.push("cancel2");
        const { control } = await player2.chooseControl(list).set("prompt", `是否发动【濯锋】？`).set("prompt2", `你可以重铸手牌中一种颜色的所有牌，若你重铸了不少于2张牌，你摸一张牌，然后你视为本回合没有使用过【杀】。`).set("ai", () => {
          let player3 = get.player(), list2 = get.event().list;
          let value2 = get.value(player3.getCards("h", { color: "red" })) - get.value(player3.getCards("h", { color: "black" }));
          if (list2.length > 2) {
            if (value2 > 0) return "red";
            return "black";
          } else {
            if (get.value(player3.getCards("h")) < 20) return list2[0];
            return "cancel2";
          }
        }).set("list", list).forResult();
        if (control === "cancel2") {
          delete player2.getStat("skill")["zhuofengmrfz"];
          return;
        }
        let cards2 = player2.getCards("h").filter((i2) => get.color(i2) == control && player2.canRecast(i2));
        if (!cards2) return;
        player2.recast(cards2);
        if (cards2.length >= 2) player2.draw();
        if (player2.getStat("card")["sha"]) {
          delete player2.getStat("card")["sha"];
        }
      },
      ai: {
        order: 3,
        result: {
          player: 1
        }
      }
    },
    qianggongmrfz: {
      mod: {
        targetInRange(card2, player2, target2, now) {
          let mark = player2.getStat("card")["sha"];
          if (card2.name == "sha" && (!mark || mark == 0)) return true;
        }
      },
      audio: 2,
      trigger: {
        player: "useCard",
        source: "damageEnd"
      },
      filter(event2, player2) {
        let mark = player2.getStat("card")["sha"], storage = player2.storage.qianggongmrfz;
        if (event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2") return false;
        if (mark && mark > 1) return false;
        return event2.card && event2.card.name == "sha" && (!storage || event2.card == storage);
      },
      forced: true,
      async content(event2, trigger2, player2) {
        if (!player2.storage.qianggongmrfz) {
          player2.storage.qianggongmrfz = trigger2.card;
          player2.when({
            global: "phaseBegin",
            player: "useCardAfter"
          }).filter((event3, player3) => {
            let storage = player3.storage.qianggongmrfz;
            if (event3.name == "phase") return true;
            return event3.card && storage && event3.card == storage;
          }).then(() => {
            delete player2.storage.qianggongmrfz;
          });
        }
        if (trigger2.name == "useCard") {
          if (typeof trigger2.baseDamage != "number") trigger2.baseDamage = 1;
          trigger2.baseDamage++;
        } else {
          delete player2.storage.qianggongmrfz;
          let skills = player2.getStockSkills(true, true);
          const { control } = await player2.chooseControl(skills).set("prompt", "【抢攻】:请选择你要重置的技能").set("ai", () => {
            let list = get.event().list, suffixs2 = ["used", "round", "block", "blocker"], skills2 = [];
            if (list.includes("zhuofengmrfz")) return "zhuofengmrfz";
            for (let skill2 of list) {
              let info2 = get.info(skill2);
              for (let key of suffixs2) {
                if (info2[key]) skills2.push(skill2);
              }
            }
            if (skills2.length == 0) skills2.push(list[0]);
            return skills2.randomGet();
          }).set("list", skills).forResult();
          if (!control) return;
          let skillx = [control];
          game.expandSkills(skillx);
          var resetSkills = [];
          var suffixs = ["used", "round", "block", "blocker"];
          for (var skill of skillx) {
            var info = get.info(skill);
            if (typeof info.usable == "number") {
              if (player2.hasSkill("counttrigger") && player2.storage.counttrigger[skill] && player2.storage.counttrigger[skill] >= 1) {
                delete player2.storage.counttrigger[skill];
                resetSkills.add(skill);
              }
              if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
                delete player2.getStat("skill")[skill];
                resetSkills.add(skill);
              }
            }
            if (info.round && player2.storage[skill + "_roundcount"]) {
              delete player2.storage[skill + "_roundcount"];
              resetSkills.add(skill);
            }
            if (player2.storage[`temp_ban_${skill}`]) {
              delete player2.storage[`temp_ban_${skill}`];
            }
            if (player2.awakenedSkills.includes(skill)) {
              player2.restoreSkill(skill);
              resetSkills.add(skill);
            }
            for (var suffix of suffixs) {
              if (player2.hasSkill(skill + "_" + suffix)) {
                player2.removeSkill(skill + "_" + suffix);
                resetSkills.add(skill);
              }
            }
          }
          if (resetSkills.length) {
            var str = "";
            for (var i2 of resetSkills) {
              str += "【" + get.translation(i2) + "】、";
            }
            game.log(player2, "重置了技能", "#g" + str.slice(0, -1));
          }
        }
      }
    },
    // 锡人
    suximrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter(event2, player2) {
        let cards2 = event2.card.cards.filter((i2) => player2.hasUseTarget(i2, false, false) && get.position(i2) == "d");
        return !event2.card.isCard && event2.card.cards.length > 0 && cards2.length > 0;
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        let cards2 = trigger2.card.cards.filter((i2) => player2.hasUseTarget(i2, false, false) && get.position(i2) == "d");
        while (cards2.length > 0) {
          const { links } = cards2.length == 1 ? { links: cards2 } : await player2.chooseCardButton("【宿锡】:请选择你要使用的牌", cards2).set("ai", (button) => get.player().getUseValue(button, null, true)).forResult();
          if (!links) return;
          await player2.chooseUseTarget(links[0]).set("nodistance", true).set("addCount", false);
          cards2.remove(links[0]);
        }
      }
    },
    sanzhongmrfz: {
      init(player2, skill) {
        player2.storage[skill] = {
          basic: false,
          trick: false,
          equip: false
        };
      },
      maps: {
        basic: "tao",
        trick: "shunshou",
        equip: "wuzhong"
      },
      onremove: true,
      audio: 2,
      enable: "chooseToUse",
      hiddenCard: function(player2, name) {
        const maps = lib.skill.sanzhongmrfz.maps;
        if (!Object.values(maps).includes(name)) return false;
        for (let key in maps) {
          if (name == maps[key] && player2.countCards("hes", { type: key }) > 0) return true;
        }
      },
      filter(event2, player2) {
        const types = Object.entries(player2.storage.sanzhongmrfz).filter(([key, value2]) => value2 === false).map(([key, value2]) => key);
        const maps = lib.skill.sanzhongmrfz.maps;
        if (types.length < 1) return false;
        for (let type of types) {
          if (player2.countCards("hes", { type }) < 1 || !event2.filterCard(get.autoViewAs({ name: maps[type] }, "unsure"), player2, event2)) continue;
          return true;
        }
      },
      chooseButton: {
        dialog: function(event2, player2) {
          const maps = lib.skill.sanzhongmrfz.maps;
          const swapped = {};
          Object.keys(maps).forEach((key) => {
            swapped[maps[key]] = key;
          });
          let list = [];
          for (let name of Object.values(maps)) {
            if (event2.filterCard && event2.filterCard({ name }, player2, event2)) {
              if (player2.storage.sanzhongmrfz[swapped[name]] != false) continue;
              if (player2.countCards("hes", { type: swapped[name] }) < 1) continue;
              if (get.type2(name) == "trick") {
                list.push(["锦囊", "", name]);
              } else if (get.type(name) == "basic") {
                list.push(["基本", "", name]);
              }
            }
          }
          return ui.create.dialog("三众", [list, "vcard"]);
        },
        check: function(button) {
          if (_status.event.getParent().type != "phase") return 1;
          var player2 = _status.event.player;
          return player2.getUseValue({
            name: button.link[2]
          });
        },
        backup: function(links, player2) {
          return {
            filterCard(card2) {
              get.player();
              const maps = lib.skill.sanzhongmrfz.maps;
              const swapped = {};
              Object.keys(maps).forEach((key) => {
                swapped[maps[key]] = key;
              });
              const name = lib.skill.sanzhongmrfz_backup.card;
              return get.type2(card2) == swapped[name];
            },
            audio: "sanzhongmrfz",
            popname: true,
            check: function(card2) {
              return 8 - get.value(card2);
            },
            position: "hse",
            viewAs: { name: links[0][2] },
            card: links[0][2],
            precontent: function() {
              const maps = lib.skill.sanzhongmrfz.maps;
              const swapped = {};
              Object.keys(maps).forEach((key) => {
                swapped[maps[key]] = key;
              });
              const name = lib.skill.sanzhongmrfz_backup.card;
              let type = swapped[name];
              player2.storage.sanzhongmrfz[type] = true;
            }
          };
        },
        prompt: function(links, player2) {
          const swapped = {};
          const maps = lib.skill.sanzhongmrfz.maps;
          const name = links[0][2];
          Object.keys(maps).forEach((key) => {
            swapped[maps[key]] = key;
          });
          return `将一张${get.translation(swapped[name])}牌当做${get.translation(name)}使用`;
        }
      },
      group: "sanzhongmrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          direct: true,
          trigger: { global: "phaseBegin" },
          content() {
            lib.skill.sanzhongmrfz.init(player, "sanzhongmrfz");
          }
        }
      },
      ai: {
        order: 1,
        result: {
          player: function(player2) {
            if (_status.event.dying) return get.attitude(player2, _status.event.dying);
            return 1;
          }
        }
      }
    },
    // 莎草
    lanjuanmrfz: {
      intro: {
        content(event2, player2) {
          let storage = player2.storage.lanjuanmrfz;
          let nameList = storage["name"].length > 0 ? storage["name"] : "无";
          let numberList = storage["number"].length > 0 ? storage["number"] : "无";
          let suitTranslation = storage["suit"].length > 0 ? get.translation(storage["suit"]) : "无";
          if (Array.isArray(nameList)) {
            nameList.sort((a, b) => a.length - b.length);
          }
          if (Array.isArray(numberList)) {
            numberList.sort((a, b) => a - b);
          }
          return `
    					    ·牌名: ${get.translation(nameList)}<br>
    					    ·点数: ${get.translation(numberList)}<br>
    					    ·花色: ${suitTranslation}
    					`;
        }
      },
      mark: true,
      init(player2, skill) {
        player2.storage[skill] = {
          name: [],
          suit: [],
          number: []
        };
      },
      onremove: true,
      audio: 2,
      trigger: {
        player: ["useCardAfter", "respondAfter", "phaseDrawBegin2"]
      },
      filterType(card2, player2, modify) {
        let storage = player2.storage.lanjuanmrfz;
        let result2 = {
          name: [],
          suit: [],
          number: []
        };
        const maps = {
          name: lib.inpile,
          suit: lib.suit,
          number: Array.from({ length: 13 }, (v, i2) => i2 + 1)
        };
        function checkAndAdd(type) {
          const value2 = get[type](card2);
          if (!storage[type].includes(value2)) {
            result2[type].push(value2);
            result2[type] = result2[type].filter((item) => new Set(maps[type]).has(item));
          }
        }
        checkAndAdd("name");
        checkAndAdd("suit");
        checkAndAdd("number");
        if (modify) {
          player2.storage.lanjuanmrfz = {
            name: [...result2.name, ...storage.name],
            suit: [...result2.suit, ...storage.suit],
            number: [...result2.number, ...storage.number]
          };
          return result2;
        }
        return result2.name.length > 0 || result2.suit.length > 0 || result2.number.length > 0;
      },
      filter(event2, player2) {
        if (event2.name == "phaseDraw") {
          let count = Object.values(player2.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
          return !event2.numFixed && Math.pow(count, 1 / 3) >= 1;
        } else return event2.card && lib.skill.lanjuanmrfz.filterType(event2.card, player2, false);
      },
      direct: true,
      async content(event2, trigger2, player2) {
        if (_status.poison_suocaoSJZX != true) {
          player2.logSkill("lanjuanmrfz");
          _status.poison_suocaoSJZX = true;
          setTimeout(() => delete _status.poison_suocaoSJZX, 3e3);
        }
        if (trigger2.name == "phaseDraw") {
          let count = Object.values(player2.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
          trigger2.num += Math.floor(Math.pow(count, 1 / 3));
        } else lib.skill.lanjuanmrfz.filterType(trigger2.card, player2, true);
      },
      mod: {
        maxHandcard: function(player2, num) {
          let count = Object.values(player2.storage.lanjuanmrfz).reduce((sum, arr) => sum + arr.length, 0);
          return num + Math.floor(Math.pow(count, 1 / 3));
        }
      }
    },
    xinglumrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      findCards(info) {
        const { name, suit, number } = info;
        const filter = function(card2) {
          return get.number(card2) == number && get.suit(card2) == suit && get.name(card2) == name;
        };
        let list = [];
        for (let i2 = 0; i2 < ui.cardPile.childNodes.length; i2++) {
          var j = i2;
          if (j >= ui.cardPile.childNodes.length) j -= ui.cardPile.childNodes.length;
          if (filter(ui.cardPile.childNodes[j])) {
            list.push(ui.cardPile.childNodes[j]);
          }
        }
        return list;
      },
      getResult(info) {
        const { name, suit, number } = info;
        let cardsList = [];
        for (let keyName of name) {
          for (let keySuit of suit) {
            for (let keyNum of number) {
              let find = lib.skill.xinglumrfz.findCards({ name: keyName, suit: keySuit, number: keyNum });
              if (find.length > 0) cardsList.push(find);
            }
          }
        }
        return cardsList;
      },
      filter(event2, player2) {
        let storage = player2.storage.lanjuanmrfz;
        return storage["name"].length > 0 && storage["suit"].length > 0 && storage["number"].length > 0;
      },
      async content(event2, trigger2, player2) {
        const storage = player2.storage.lanjuanmrfz;
        const { control } = await player2.chooseControl("自动选择", "手动选择").set("prompt", "【行路】:是否让系统自动为你提供方案？").set("ai", () => "自动选择").forResult();
        if (control === "自动选择") {
          let cards3 = lib.skill.xinglumrfz.getResult(storage);
          const maxIndex = cards3.map((i2) => player2.getUseValue(i2)).indexOf(Math.max(...cards3.map((i2) => player2.getUseValue(i2))));
          if (cards3.length < 1) {
            player2.popup("没有符合条件的组合");
            return;
          }
          let control2 = [];
          for (let i2 = 0; i2 < cards3.length; i2++) {
            control2.push([i2, `第${get.cnNumber(i2 + 1, true)}组`]);
          }
          let dialogAuto = [`【行路】:请选择一个组合<br>推荐选择第${get.cnNumber(maxIndex + 1, true)}组(${get.translation(cards3[maxIndex])})`, [control2, "tdnodes"]];
          for (let i2 = 0; i2 < cards3.length; i2++) {
            dialogAuto.addArray([`第${get.cnNumber(i2 + 1, true)}组`, cards3[i2]]);
          }
          const result2 = !event2.isMine() ? { links: [maxIndex] } : await player2.chooseButton().set("createDialog", dialogAuto).set("cards", cards3).forResult();
          if (!result2) return;
          player2.gain(cards3[result2.links[0]], "gain2", "log");
          return;
        }
        let dialog = ["【行路】:请选择牌名、花色和数字各一个"];
        dialog.addArray(["待选择的牌名", [storage.name.slice().map((i2) => [get.type2(i2), "", i2]), "vcard"]]);
        dialog.addArray(["待选择的花色", [storage.suit.slice().map((i2) => [i2, get.translation(i2)]), "tdnodes"]]);
        dialog.addArray([
          "待选择的数字",
          [
            storage.number.slice().sort((a, b) => a - b).map((i2) => [i2, i2]),
            "tdnodes"
          ]
        ]);
        const { links } = await player2.chooseButton().set("createDialog", dialog).set("filterButton", (button) => {
          let list = ui.selected.buttons;
          if (Array.isArray(button.link) && list.some((item) => Array.isArray(item.link))) return false;
          else if (typeof button.link === "number" && list.some((item) => typeof item.link === "number")) return false;
          else if (typeof button.link === "string" && list.some((item) => typeof item.link === "string")) return false;
          return true;
        }).set("selectButton", 3).forResult();
        if (!links) return;
        const info = {
          name: links.filter((i2) => Array.isArray(i2)).map((i2) => i2[2]),
          suit: links.filter((i2) => typeof i2 === "string"),
          number: links.filter((i2) => typeof i2 === "number")
        };
        let cards2 = lib.skill.xinglumrfz.findCards(info);
        if (cards2.length > 0) player2.gain(cards2, "gain2", "log");
        else {
          player2.popup("没有符合条件的组合");
        }
      },
      ai: {
        order: 1,
        result: {
          player: 1
        }
      }
    },
    // 莱欧斯
    shijianmrfz: {
      audio: 2,
      derivation: ["jianzhumrfz"],
      trigger: { player: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return player2.countCards("he") > 0 && !player2.isDisabled(1) && !player2.hasCard((card2) => card2.name == "jianzhumrfz", "e");
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseToDiscard(`【拾剑】:你可以弃置一张牌，将【剑助】置入你的武器栏`, "he").set("ai", (card2) => {
          return 6 - get.value(card2);
        }).forResult();
      },
      async content(event2, trigger2, player2) {
        const card2 = game.createCard("jianzhumrfz", "spade", 12);
        player2.$gain2(card2);
        player2.equip(card2);
      },
      ai: {
        threaten: 0.8
      }
    },
    shimomrfz: {
      audio: 2,
      init(player2, skill) {
        player2.storage[skill] = {};
        const translates = {
          2: '富甲<font color="red">目标+</font>',
          3: '空巢<font color="red">摸牌</font>',
          4: '残躯<font color="red">伤害+</font>'
        };
        for (let i2 = 2; i2 <= 4; i2++) {
          lib.translate[skill + "_" + i2] = translates[i2];
        }
      },
      onremove: true,
      mark: true,
      proficiency: new Proxy(
        {
          baka: '<font color = "#FFFFFF">一无所知</font>',
          master: '<font color = "#FF0000">融会贯通</font>',
          1: '<font color="#FFCCCC">已有耳闻</font>',
          2: '<font color="#FF9999">略知一二</font>',
          3: '<font color="#FF6666">初步掌握</font>',
          4: '<font color="#FF3333">烂熟于心</font>'
        },
        {
          get(target2, prop) {
            if (typeof prop !== "symbol") ;
            else {
              return target2["baka"];
            }
            if (!isNaN(value)) {
              if (value < 1) return target2["baka"];
              if (value > 4) return target2["master"];
              return target2[value];
            }
            return target2["baka"];
          }
        }
      ),
      intro: {
        name: "莱欧斯的魔物宝典",
        content: function(event2, player2) {
          const storage = player2.storage.shimomrfz;
          let intro = [];
          if (storage === void 0) return "没有记录的魔物";
          const sorted = Object.entries(storage).sort((a, b) => b[1] - a[1]).map(([key, value2]) => ({ key, value: value2 }));
          for (let obj of sorted) {
            intro.push(`【${get.translation(obj["key"])}】是${lib.skill.shimomrfz.proficiency[obj["value"]]}（${obj["value"]}）`);
          }
          return `莱欧斯对‘魔物’:<br>` + intro.join("<br>");
        }
      },
      trigger: { player: "gainAfter" },
      direct: true,
      async content(event2, trigger2, player2) {
        if (_status.poison_laiousiSJZX != true) {
          player2.logSkill("shimomrfz");
          _status.poison_laiousiSJZX = true;
          setTimeout(() => delete _status.poison_laiousiSJZX, 3e3);
        }
        const cards2 = trigger2.cards, storage = player2.storage.shimomrfz;
        for (let card2 of cards2) {
          let name = get.name(card2);
          storage.hasOwnProperty(name) ? player2.storage.shimomrfz[name]++ : player2.storage.shimomrfz[name] = 1;
          if (storage.hasOwnProperty(name)) {
            let num = storage[name];
            if (num < 2) continue;
            if (num > 4) num = 4;
            for (let i2 = 2; i2 <= num; i2++) player2.addGaintag(card2, `shimomrfz_${i2}`);
          }
        }
      },
      group: "shimomrfz_yingbian",
      subSkill: {
        yingbian: {
          audio: "shimomrfz",
          silent: true,
          trigger: { player: "yingbian" },
          filter(event2, player2) {
            return event2.card.isCard && player2.hasHistory("lose", (evt) => {
              return evt.getParent() == event2 && Object.values(evt.gaintag_map).some((value2) => value2.join(" ").includes("shimomrfz_"));
            });
          },
          async content(event2, trigger2, player2) {
            let tags;
            player2.getHistory("lose", (evt) => {
              if (evt.getParent() != trigger2) return;
              const maps = evt.gaintag_map;
              for (let key in maps) {
                if (maps[key].join(" ").includes("shimomrfz_")) tags = maps[key];
              }
            });
            const index = Math.max(...tags.filter((i2) => /^shimomrfz_\d+$/.test(i2)).map((i2) => Number(i2.replace(/\D+/g, ""))));
            if (!Array.isArray(trigger2.temporaryYingbian)) trigger2.temporaryYingbian = [];
            trigger2.temporaryYingbian.add("force");
            if (index >= 2 && player2.satisfyYingbian("fujia", trigger2)) {
              trigger2.temporaryYingbian.add("add");
            }
            if (index >= 3 && player2.satisfyYingbian("kongchao", trigger2)) {
              trigger2.temporaryYingbian.add("draw");
            }
            if (index >= 4 && player2.satisfyYingbian("canqu", trigger2)) {
              trigger2.temporaryYingbian.add("damage");
            }
          }
        }
      }
    },
    // 森西
    micaimrfz: {
      audio: 2,
      trigger: {
        global: ["loseAfter", "loseAsyncAfter"]
      },
      usable: 1,
      filter(event2, player2) {
        if (event2.type != "discard" || event2.position != ui.discardPile || event2.player == player2) return false;
        let cards2 = event2.getd();
        if (!cards2.filter((card2) => get.position(card2, true) == "d").length) return false;
        return true;
      },
      async cost(event2, trigger2, player2) {
        let cards2 = trigger2.getd().filter((i2) => get.position(i2, true) == "d");
        event2.result = await player2.chooseCardButton("【觅材】:你可以获得一张牌", cards2).set("ai", (button) => get.value(button)).forResult();
        event2.result.cost_data = event2.result;
      },
      async content(event2, trigger2, player2) {
        player2.gain(event2.cost_data.links, "gain2");
      }
    },
    beicaimrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      init(player2, skill) {
        player2.storage[skill] = {};
      },
      onremove: true,
      filter(event2, player2) {
        return player2.countCards("h", (card2) => get.cardNameLength(card2) > 1) > 0;
      },
      lessNameLength(card2) {
        const list = [];
        const original = get.cardNameLength(card2);
        for (let name of lib.inpile) {
          if (get.cardNameLength(name) >= original) continue;
          list.push([get.translation(get.type(name)), "", name]);
          if (name == "sha") {
            for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
          }
        }
        return list;
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseCard("h").set("prompt2", "你可以将一张手牌视为任意小于此牌字数的一张牌。").set("prompt", "是否发动【备材】？").set("filterCard", (card2) => get.cardNameLength(card2) > 1).set("ai", (card2) => {
          const player3 = get.player();
          if (get.cardNameLength(card2) < 2) return -1;
          const less = lib.skill.beicaimrfz.lessNameLength(card2).map((i2) => i2[2]);
          if (!Array.isArray(less.filter((i2) => player3.getUseValue(i2) > player3.getUseValue(card2)))) return -1;
          let OptimalSolution = less.filter((i2) => player3.getUseValue(i2) > player3.getUseValue(card2)) || null;
          if (OptimalSolution === null || OptimalSolution.length < 1) return -1;
          OptimalSolution = OptimalSolution.reduce((a, b) => player3.getUseValue(a) >= player3.getUseValue(b) ? a : b) || null;
          return OptimalSolution ? player3.getUseValue(OptimalSolution) - player3.getUseValue(card2) : -1;
        }).forResult();
      },
      async content(event2, trigger2, player2) {
        const list = lib.skill.beicaimrfz.lessNameLength(event2.cards[0]);
        const { links } = await player2.chooseButton([`备材<br>把${get.translation(event2.cards)}视为：`, [list, "vcard"]], true).set("ai", (button) => {
          const player3 = get.player(), card2 = {
            name: button.link[2],
            nature: button.link[3]
          };
          return player3.getUseValue(card2, null, true);
        }).forResult();
        if (!links) return;
        player2.addGaintag(event2.cards, "beicaimrfzx");
        if (!player2.storage.beicaimrfz) player2.storage.beicaimrfz = {};
        player2.storage.beicaimrfz[event2.cards[0].cardid] = { name: links[0][2], nature: links[0][3] };
      },
      mod: {
        cardname(card2, player2, name) {
          const storage = player2.storage.beicaimrfz;
          if (card2.hasGaintag("beicaimrfzx") && Object.keys(storage).includes(card2.cardid) && storage[card2.cardid]["name"]) return storage[card2.cardid]["name"];
        },
        cardnature(card2, player2) {
          const storage = player2.storage.beicaimrfz;
          if (card2.hasGaintag("beicaimrfzx") && Object.keys(storage).includes(card2.cardid) && storage[card2.cardid]["nature"]) return storage[card2.cardid]["nature"];
        }
      },
      group: "beicaimrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "loseAfter" },
          filter(event2, player2) {
            return Object.keys(player2.storage.beicaimrfz).length > 0;
          },
          async content(event2, trigger2, player2) {
            const hs = player2.getCards("he").map((card2) => card2.cardid);
            for (let id2 in player2.storage.beicaimrfz) {
              if (!hs.includes(id2)) delete player2.storage.beicaimrfz[id2];
            }
          }
        }
      }
    },
    pengcaimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterCard(card2) {
        const player2 = get.player();
        return !ui.selected.cards.some((cardx) => get.type2(cardx, player2) == get.type2(card2, player2));
      },
      selectCard: 2,
      filterTarget(card2, player2, target2) {
        return player2.canUse("wugu", target2);
      },
      selectTarget: [1, 4],
      check(card2) {
        return 8 - get.value(card2);
      },
      complexCard: true,
      discard: false,
      lose: false,
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        player2.storage.pengcaimrfz = event2.targets.slice();
        await player2.useCard({ name: "wugu", pengcaimrfz: true }, event2.targets, event2.cards, false, "pengcaimrfz");
        const store = player2.storage.pengcaimrfz;
        if (!Array.isArray(store)) return;
        let type = [];
        for (let i2 = 0; i2 < store.length; i2++) {
          let target2 = store[i2][0], cards2 = store[i2][1];
          if (!event2.targets.includes(target2) || !cards2) continue;
          type.push(...cards2.map((i3) => get.type2(i3)));
        }
        let SetType = new Set(type.slice());
        if (SetType.size !== type.length) return;
        await player2.useCard({ name: "wugu", pengcaimrfz: true }, event2.targets, event2.cards, false, "pengcaimrfz");
        delete player2.storage.pengcaimrfz;
      },
      group: ["pengcaimrfz_wugu"],
      global: "pengcaimrfz_eff",
      subSkill: {
        eff: {
          silent: true,
          charlotte: true,
          trigger: { player: "yingbian" },
          filter(event2, player2) {
            return event2.card.isCard && event2.player.hasHistory("lose", (evt) => evt.getParent() == event2 && Object.values(evt.gaintag_map).some((value2) => value2.includes("pengcaimrfzx")));
          },
          content: () => {
            if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
            trigger.temporaryYingbian.add("force");
            trigger.temporaryYingbian.addArray(get.yingbianEffects());
          }
        },
        wugu: {
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { global: "gainAfter" },
          filter(event2, player2) {
            const evt = event2.getParent();
            return evt && evt.card && evt.card.pengcaimrfz && player2.storage.pengcaimrfz && player2.storage.pengcaimrfz.some((i2) => Array.isArray(i2) ? i2[0] == event2.player : i2 == event2.player);
          },
          async content(event2, trigger2, player2) {
            const cards2 = trigger2.cards.filter((i2) => get.itemtype(i2) == "card");
            player2.storage.pengcaimrfz[player2.storage.pengcaimrfz.indexOf(trigger2.player)] = [trigger2.player, cards2];
            trigger2.player.addGaintag(cards2, "pengcaimrfzx");
          }
        }
      },
      ai: {
        order: 13,
        threaten: 1.8,
        result: {
          target: 1,
          player: 1
        }
      }
    },
    // 奇尔查克
    tangongmrfz: {
      audio: 2,
      trigger: { player: ["drawBegin", "damageBegin3"] },
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      filter(event2, player2) {
        return event2.num > 0 && !player2.storage.tangongmrfz.includes(event2.name);
      },
      createDialog(id2, showCards) {
        var dialog = ui.create.dialog("hidden");
        (dialog.textPrompt = dialog.add("探宫")).style.textAlign = "center";
        dialog.cards = [];
        dialog.rawButtons = [];
        dialog.videoId = id2;
        var cards2 = [];
        for (var y = 0; y < 3; y++) {
          for (var x = 0; x < 3; x++) {
            var card2 = ui.create.card(null, null, true);
            card2.pos = y * 3 + x;
            card2.pos_x = x;
            card2.pos_y = y;
            cards2.push(card2);
            dialog.rawButtons.push(card2);
          }
          dialog.add(cards2);
          cards2 = [];
        }
        for (var i2 of dialog.buttons) {
          i2.pos_x = i2.link.pos_x;
          i2.pos_y = i2.link.pos_y;
          i2.link = i2.link.pos;
        }
        showCards = showCards ? showCards : game.cardsGotoOrdering(get.cards(9)).cards;
        showCards.map((i3) => i3.tangongmrfz = true);
        dialog.addAuto("待选择的牌");
        dialog.showCards = showCards;
        dialog.add(showCards);
        dialog.open();
      },
      addCard(card2, id2, pos) {
        var dialog = get.idDialog(id2);
        if (!dialog) return;
        for (var i2 = 0; i2 < dialog.buttons.length; i2++) {
          var button = dialog.buttons[i2];
          if (button.link == pos) {
            var card22 = ui.create.button(card2, "card");
            card22.pos = button.link;
            card22.pos_x = button.pos_x;
            card22.pos_y = button.pos_y;
            card22.classList.add("noclick");
            button.parentNode.insertBefore(card22, button);
            dialog.cards.push(card22);
            button.remove();
            dialog.buttons.splice(i2, 1);
          } else if (get.itemtype(button.link) == "card") {
            if (button.link == card2) {
              button.remove();
              dialog.showCards.remove(card2);
              break;
            }
          }
        }
      },
      changePrompt(str, id2) {
        var dialog = get.idDialog(id2);
        if (!dialog) return;
        dialog.textPrompt.innerHTML = str;
      },
      getValidMatrix(suits) {
        function isValid(matrix2, row, col, value2) {
          for (let i2 = 0; i2 < col; i2++) {
            if (matrix2[row][i2] === value2) {
              return false;
            }
          }
          for (let i2 = 0; i2 < row; i2++) {
            if (matrix2[i2][col] === value2) {
              return false;
            }
          }
          return true;
        }
        function backtrack(matrix2, suits2, row, col) {
          if (row === 3) {
            return true;
          }
          let nextRow = col === 2 ? row + 1 : row;
          let nextCol = (col + 1) % 3;
          for (let i2 = 0; i2 < suits2.length; i2++) {
            let suit = suits2[i2];
            if (isValid(matrix2, row, col, suit)) {
              matrix2[row][col] = suit;
              let remainingSuits = suits2.slice(0, i2).concat(suits2.slice(i2 + 1));
              if (backtrack(matrix2, remainingSuits, nextRow, nextCol)) {
                return true;
              }
              matrix2[row][col] = null;
            }
          }
          return false;
        }
        let matrix = Array.from({ length: 3 }, () => Array(3).fill(null));
        if (backtrack(matrix, suits, 0, 0)) {
          return matrix;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        if (!player2.storage.tangongmrfz) player2.storage.tangongmrfz = [];
        player2.storage.tangongmrfz.add(trigger2.name);
        let autoMode = false;
        const { bool } = await player2.chooseBool(`是否让系统帮你组方阵？`).set("ai", () => true).forResult();
        if (bool) autoMode = true;
        let next = game.createEvent("cardsGotoOrdering");
        next.cards = [];
        next.setContent("cardsGotoOrdering");
        event2.videoId = lib.status.videoId++;
        event2.forceDie = true;
        event2.cards = [];
        event2.positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
        let showCards = game.cardsGotoOrdering(get.cards(12)).cards;
        game.broadcastAll(
          function(id2, showCards2) {
            lib.skill.tangongmrfz.createDialog(id2, showCards2);
          },
          event2.videoId,
          showCards.slice()
        );
        let autoSelected = lib.skill.tangongmrfz.getValidMatrix(showCards.slice().map((i2) => get.suit(i2)));
        let cards2 = [];
        while (showCards.length > 0) {
          let str = "请将一张牌放置到方阵中";
          if (player2 == game.me || player2.isUnderControl()) {
            lib.skill.tangongmrfz.changePrompt(str, event2.videoId);
          } else if (player2.isOnline()) {
            player2.send(
              function(str2, id2) {
                lib.skill.tangongmrfz.changePrompt(str2, event2.videoId);
              },
              str,
              id
            );
          }
          let links;
          if ((player2.isUnderControl() || game.me == player2) && !autoMode) {
            const result1 = await player2.chooseButton().set("filterOk", (button) => {
              const selected = ui.selected.buttons.slice().map((i2) => get.itemtype(i2.link) || typeof i2.link);
              return selected.includes("card") && selected.includes("number");
            }).set("dialog", event2.videoId).set("filterButton", function(button) {
              return true;
            }).set("selectButton", 2).set("autoSelected", autoSelected).set("showCards", showCards).set("cards", cards2.slice()).forResult();
            links = result1.links;
          } else {
            if (!autoSelected) {
              player2.popup("探索失败");
              game.broadcastAll("closeDialog", event2.videoId);
              return;
            }
            let posx = cards2.slice(0).map((i2) => i2[1]);
            links = [];
            let selectedList = [...autoSelected[0], ...autoSelected[1], ...autoSelected[2]];
            for (let i2 = 0; i2 < 9; i2++) {
              if (posx.includes(i2)) continue;
              let getValidSuit = showCards.filter((j) => get.suit(j) == selectedList[i2])[0];
              links.push(getValidSuit, i2);
              break;
            }
          }
          if (!links) {
            player2.popup("探索失败");
            game.broadcastAll("closeDialog", event2.videoId);
            return;
          }
          let pos = links.filter((i2) => typeof i2 == "number")[0], tranCard = links.filter((i2) => get.itemtype(i2) == "card")[0];
          game.broadcastAll(
            function(card2, id2, pos2, player3) {
              lib.skill.tangongmrfz.addCard(card2, id2, pos2);
              lib.skill.tangongmrfz.changePrompt(get.translation(player3) + "放置了" + get.translation(card2), id2);
            },
            tranCard,
            event2.videoId,
            pos,
            player2
          );
          let { promise, resolve } = Promise.withResolvers();
          setTimeout(() => {
            resolve();
          }, 1e3);
          await promise;
          cards2.push([tranCard, pos]);
          showCards.remove(tranCard);
          if (cards2.length > 8) {
            game.broadcastAll("closeDialog", event2.videoId);
            break;
          }
        }
        const suits = cards2.map((i2) => [get.suit(i2[0]), i2[1]]);
        const matrix = Array.from({ length: 3 }, () => Array(3));
        suits.forEach(([suit, index]) => matrix[Math.floor(index / 3)][index % 3] = suit);
        const hasDuplicates = matrix.some((row, i2) => new Set(row).size < 3 || new Set(matrix.map((r) => r[i2])).size < 3);
        if (!hasDuplicates) {
          const isDraw = trigger2.name === "draw" ? true : false;
          const { control } = await player2.chooseControl(`减半`, `翻倍`).set("prompt", `令${trigger2.name === "draw" ? "摸牌数" : "伤害值"}(${trigger2.num})翻倍或减半`).set("ai", () => {
            return get.event().isDraw ? "翻倍" : "减半";
          }).set("isDraw", isDraw).forResult();
          trigger2.num = control === `翻倍` ? trigger2.num * 2 : Math.floor(trigger2.num / 2);
        }
      },
      group: "tangongmrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          lastDo: true,
          trigger: { global: "phaseEnd" },
          filter(event2, player2) {
            return player2.storage.tangongmrfz;
          },
          content: function() {
            player.storage.tangongmrfz = [];
          }
        }
      },
      ai: {
        threaten: 1.5
      }
    },
    ruiganmrfz: {
      audio: 2,
      trigger: {
        global: "useCard1"
      },
      forced: true,
      filter(event2, player2) {
        return get.cardNameLength(event2.card) == player2.countCards("h") && event2.targets.includes(player2) && event2.player != player2;
      },
      async content(event2, trigger2, player2) {
      },
      mod: {
        targetEnabled(card2, player2, target2) {
          if (get.cardNameLength(card2) == target2.countCards("h") && player2 != target2) return false;
        }
      }
    },
    // 凯瑟琳
    ksl_zhuzhimrfz: {
      onremove(player2) {
        for (let t of game.players) {
          t.removeSkill("duantiemrfz");
        }
      },
      derivation: ["ksl_lulitongxinmrfz"],
      audio: 2,
      trigger: { global: "linkAfter" },
      silent: true,
      forced: true,
      filter(event2, player2) {
        return event2.player != player2;
      },
      async content(event2, trigger2, player2) {
        let target2 = trigger2.player;
        if (!target2.isLinked() && target2.hasSkill("duantiemrfz")) target2.removeSkill("duantiemrfz");
        else if (target2.isLinked() && !target2.hasSkill("duantiemrfz")) target2.addSkill("duantiemrfz");
      },
      group: ["ksl_zhuzhimrfz_add", "ksl_zhuzhimrfz_gain"],
      subSkill: {
        gain: {
          audio: "ksl_zhuzhimrfz",
          forced: true,
          trigger: {
            player: "phaseZhunbeiBegin"
          },
          async content(event2, trigger2, player2) {
            var card2 = get.cardPile(function(card3) {
              return get.name(card3) == "ksl_lulitongxinmrfz";
            });
            if (card2) player2.gain(card2, "gain2", "log");
            else player2.draw();
          }
        },
        add: {
          audio: "ksl_zhuzhimrfz",
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          forced: true,
          filter(event2, player2) {
            return (event2.name != "phase" || game.phaseNumber == 0) && !lib.inpile.includes("ksl_lulitongxinmrfz");
          },
          content() {
            var cards2 = [];
            for (var i2 = 0; i2 < 4; i2++) {
              cards2.push(game.createCard2("ksl_lulitongxinmrfz", lib.suit.randomGet(), [2, 4, 3, 10, 13].randomGet()));
            }
            game.broadcastAll(function() {
              lib.inpile.add("ksl_lulitongxinmrfz");
            });
            game.cardsGotoPile(cards2, () => {
              return ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length - 1)];
            });
          }
        }
      }
    },
    duantiemrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      position: "he",
      filter(event2, player2) {
        let list = [];
        for (let card2 of player2.getCards("he")) {
          list.add(get.type2(card2));
        }
        return list.length >= 2;
      },
      filterCard(card2, player2) {
        return !ui.selected.cards.some((cardx) => get.type2(cardx) == get.type2(card2));
      },
      complexCard: true,
      selectCard: 2,
      async content(event2, trigger2, player2) {
        player2.storage.duantiemrfz_buff = player2.name;
        let audio = new Audio("extension/WhichWay/audio/up.mp3");
        audio.play();
        await player2.reinitCharacter(player2.name, "paxinghaomrfz", false);
        player2.addSkill("duantiemrfz_buff");
      },
      subSkill: {
        buff: {
          onremove: true,
          charlotte: true,
          silent: true,
          mark: true,
          intro: {
            content(event2, player2) {
              return `当前机甲驾驶员:${get.translation(player2.storage.duantiemrfz_buff)}`;
            }
          },
          trigger: { player: "dying" },
          async content(event2, trigger2, player2) {
            let audio = new Audio("extension/WhichWay/audio/down.mp3");
            audio.play();
            await player2.reinitCharacter("paxinghaomrfz", player2.storage.duantiemrfz_buff, false);
            player2.recoverTo(2);
            player2.removeSkill("duantiemrfz_buff");
          }
        }
      },
      ai: {
        order: 6,
        result: {
          player(player2, target2) {
            if (player2.hp < 3) return 1;
            let threaten = -(get.skillthreaten("jushoumrfz") + get.skillthreaten("yinqingmrfz"));
            for (let skill of player2.getSkills(null, false, false)) {
              threaten += get.skillthreaten(skill);
            }
            return threaten;
          }
        }
      }
    },
    // 波卜
    qingtingmrfz: {
      audio: 2,
      trigger: { player: ["loseBegin", "loseAsyncBegin"] },
      filter(event2, player2) {
        let evt = event2.getParent();
        if (event2.name === "lose") {
          return event2.type === "gain" && event2.cards.length >= 1 && evt.player !== player2;
        } else if (event2.name === "loseAsync") {
          return evt.name === "swapHandcards" && event2.target != event2.player && event2.cards1.length >= 1;
        }
        return false;
      },
      async cost(event2, trigger2, player2) {
        let evt = trigger2.getParent();
        event2.result = await player2.chooseBool().set("ai", () => {
          let evt2 = get.event().evt;
          let event3 = get.event().evt2;
          return get.attitude2(event3.target || evt2.player) < 0;
        }).set("prompt", get.prompt("qingtingmrfz")).set("prompt2", `是否取消${get.translation(trigger2.target || evt.player)}获得你的牌${get.translation(trigger2.cards1 || trigger2.cards)}？`).set("evt", evt).set("evt2", trigger2).forResult();
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name === "lose") trigger2.cancel();
        else {
          let evt = trigger2.getParent();
          player2.directgain(evt.cards1);
          player2.$update();
          evt.cards1 = [];
        }
      }
    },
    qingtanmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget(card2, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.target;
        let tHs = target2.getCards("h"), pHs = player2.getCards("h");
        await player2.viewHandcards(target2);
        await target2.viewHandcards(player2);
        const { cards: cards1 } = pHs.length < 2 ? { cards: pHs } : await player2.chooseCard(true).set("ai", (card2) => {
          get.player();
          let target3 = get.event().target;
          return get.value(card2) * get.attitude2(target3);
        }).set("prompt", "请选择两张类型不同的牌").set("filterCard", (card2) => {
          return !ui.selected.cards.some((cardx) => get.type2(cardx, player2) == get.type2(card2, player2));
        }).set("selectCard", () => {
          let hs = get.event().hs;
          return new Set(hs.map((i2) => get.type2(i2))).size < 2 ? 1 : 2;
        }).set("complexCard", true).set("target", target2).set("hs", pHs).forResult();
        const { cards: cards2 } = tHs.length < 2 ? { cards: tHs } : await target2.chooseCard(true).set("prompt", "请选择两张类型不同的牌").set("ai", (card2) => {
          get.player();
          let target3 = get.event().target;
          return get.value(card2) * get.attitude2(target3);
        }).set("filterCard", (card2) => {
          return !ui.selected.cards.some((cardx) => get.type2(cardx, player2) == get.type2(card2, player2));
        }).set("selectCard", () => {
          let hs = get.event().hs;
          return new Set(hs.map((i2) => get.type2(i2))).size < 2 ? 1 : 2;
        }).set("complexCard", true).set("hs", tHs).set("target", player2).forResult();
        if (cards1 && cards2) {
          player2.swapHandcards(target2, cards1, cards2);
        }
      },
      async contentAfter(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        if (target2.countCards("h") === player2.countCards("h")) return;
        for (let char of [player2, target2]) {
          if (char.hasSkill("qingtanmrfz_hd")) {
            char.draw();
            continue;
          }
          const { bool } = await char.chooseBool().set("prompt", "是否摸一张牌？").set("prompt2", "选择‘取消’则为手牌上限+1").set("ai", () => {
            let player3 = get.player();
            return player3.countCards("h") < 2 ? true : false;
          }).forResult();
          if (bool === true) {
            char.draw();
          }
          if (bool === false) {
            char.addSkill("qingtanmrfz_hd");
          }
        }
      },
      subSkill: {
        hd: {
          charlotte: true,
          mark: true,
          intro: {
            content: "手牌上限+1"
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num + 1;
            }
          }
        }
      },
      ai: {
        order: 13,
        result: {
          target: -1
        }
      }
    },
    // 菲莱
    qianxiumrfz: {
      audio: 2,
      intro: {
        content(event2, player2) {
          return `少女祈祷中...`;
        }
      },
      trigger: { player: "phaseDrawBegin1" },
      filter: function(event2, player2) {
        return !event2.numFixed;
      },
      prompt(event2, player2) {
        return get.prompt("qianxiumrfz");
      },
      prompt2(event2, player2) {
        return `你可以放弃摸牌，并展示牌堆顶${player2.maxHp}张牌`;
      },
      async content(event2, trigger2, player2) {
        trigger2.changeToZero();
        let shows = game.cardsGotoOrdering(get.cards(player2.maxHp)).cards;
        await player2.showCards(shows, get.translation(player2) + "发动了【虔修】");
        if (shows.filter((i2) => get.tag(i2, "damage") > 0).length < 1) {
          player2.gain(shows);
          if (player2.countMark("qianxiumrfz") < 5) player2.addMark("qianxiumrfz", 1, false);
          return;
        }
        const { links } = await player2.chooseButton(["【虔修】:你可以使用一张带有伤害类标签的牌", shows]).set("filterButton", (button) => {
          let player3 = get.player();
          return get.tag(button.link, "damage") > 0 && player3.hasUseTarget(button.link);
        }).set("ai", (button) => {
          let player3 = get.player();
          if (player3.countMark("qianxiumrfz") < 3) return false;
          return get.value(button.link);
        }).forResult();
        if (links) {
          let nums = player2.countMark("qianxiumrfz");
          links[0].storage.qianxiumrfz = nums;
          player2.removeAllmark("qianxiumrfz");
          player2.chooseUseTarget(links[0]);
        } else {
          player2.gain(shows);
          if (player2.countMark("qianxiumrfz") < 5) player2.addMark("qianxiumrfz", 1, false);
        }
      },
      group: ["qianxiumrfz_add"],
      subSkill: {
        add: {
          audio: "qianxiumrfz",
          charlotte: true,
          silent: true,
          trigger: { source: "damageBegin3" },
          filter(event2, player2) {
            return event2.card && event2.card.storage && typeof event2.card.storage.qianxiumrfz === "number" && event2.card.storage.qianxiumrfz > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.num += trigger2.card.storage.qianxiumrfz;
          }
        }
      }
    },
    mingzhoumrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "gainAfter"
      },
      filter(event2, player2) {
        return event2.cards.length > 0 && _status.currentPhase !== player2;
      },
      async content(event2, trigger2, player2) {
        player2.chooseToDiscard(true, `he`, `请弃置${trigger2.cards.length}张牌`, trigger2.cards.length).set("ai", (card2) => -get.value(card2));
      },
      ai: {
        threaten: 0.9,
        nogain: 1,
        skillTagFilter: function(player2) {
          return player2 != _status.currentPhase;
        }
      }
    },
    // 裁度
    caiyimrfz: {
      audio: 2,
      trigger: { player: "equipBefore" },
      forced: true,
      filter(event2, player2) {
        return event2.card && get.type(event2.card) === "equip" && event2.getParent().name != "caiyimrfz";
      },
      async content(event2, trigger2, player2) {
        const subtype = ["equip1", "equip2", "equip3", "equip4", "equip5"];
        const { control } = await player2.chooseControl(subtype).set("prompt", `请选择将${get.translation(trigger2.card)}置入一个装备栏`).set("ai", () => {
          let player3 = get.player();
          let subtype2 = get.event().subtype.filter((i2) => player3.hasEmptySlot(i2));
          let card2 = get.event().card;
          if (subtype2.length > 0) {
            return subtype2.includes("equip2") && subtype2.length > 1 ? subtype2.remove("equip2").randomGet() : subtype2.randomGet();
          } else {
            let equips = player3.getCards("e").sort((a, b) => get.value(b) - get.value(a));
            for (let equip of equips) {
              if (get.value(card2) > get.value(equip)) return get.subtype(equip);
            }
            return ["equip1", "equip2", "equip3", "equip4", "equip5"].randomGet();
          }
        }).set("subtype", subtype).set("card", trigger2.card).forResult();
        if (!control) return;
        trigger2.card.subtypes = [control];
      }
    },
    mingjiangmrfz: {
      audio: 2,
      init(player2, skill) {
        let puyuanEquip = Object.keys(lib.card).filter((i2) => {
          return get.type(i2) === "equip" && lib.card?.[i2]?.skills && (lib.card[i2]?.derivation === "ol_puyuan" || lib.card[i2]?.derivation === "puyuan");
        });
        player2.storage[skill] = [...lib.inpile.filter((i2) => get.type(i2) === "equip"), ...puyuanEquip];
        _status.mingjiangmrfz = puyuanEquip;
      },
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current.hasEmptySlot(2);
        });
      },
      async content(event2, trigger2, player2) {
        let list = player2.storage.mingjiangmrfz;
        await player2.draw();
        if (player2.countCards("h") < 1) return;
        const { links } = await player2.chooseButton(["名匠", [list, "vcard"]], true).set("ai", (button) => {
          let card3 = {
            name: button.link[2],
            nature: button.link[3]
          };
          let num = get.value(card3);
          if (_status.mingjiangmrfz.includes(card3.name)) num += 5;
          if (player2.countCards("e", (card4) => get.subtype(card4) === "equip2") < 1) get.subtype(card3) === "equip2" ? num += 5 : num -= 2;
          return num;
        }).forResult();
        if (!links) return;
        const { result: result2 } = await player2.chooseCardTarget({
          prompt: `将一张手牌视为${get.translation(links[0][2])}置入一名角色的装备区`,
          filterCard: true,
          forced: true,
          filterTarget: function(card3, player3, target2) {
            return target2.hasEmptySlot(2);
          },
          ai1(card3) {
            return -get.value(card3);
          },
          ai2(target2) {
            get.player();
            let att = get.attitude2(target2);
            return att > 0 ? att + (5 - target2.countCards("e")) : -1;
          }
        });
        if (!result2) return;
        const { targets: targets2, cards: cards2 } = result2;
        let card2 = get.autoViewAs({ name: links[0][2] }, cards2);
        targets2[0].equip(card2);
      }
    },
    // 特克诺
    suoumrfz: {
      init(player2) {
        game.addGlobalSkill("autoswap");
      },
      onremove(player2) {
        for (let i2 of game.players) {
          if (i2.name === "muouwuzhemrfz") i2.die();
        }
      },
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        return event2.player && event2.player.isIn() && event2.player.name !== "muouwuzhemrfz" && event2.player.getNext().name != "muouwuzhemrfz";
      },
      prompt(event2, player2) {
        return `【塑偶】:是否在${get.translation(event2.player)}和${get.translation(event2.player.getNext())}之间放置一个‘木偶舞者’？`;
      },
      async content(event2, trigger2, player2) {
        trigger2.player.getNext();
        var fellow = game.addPlayer(trigger2.player.getSeatNum(), "muouwuzhemrfz").animate("start");
        fellow.getId();
        fellow.host = player2;
        if (player2.identity != "zhu" || get.mode() === "doudizhu") fellow.identity = player2.identity;
        else fellow.identity = "zhong";
        fellow.node.identity.dataset.color = fellow.identity;
        fellow.identityShown = true;
        fellow.init("muouwuzhemrfz");
        fellow.draw(3);
        fellow.update();
        fellow.addSkill("suoumrfz_dead");
        fellow.suoumrfz = player2;
        let skillList = trigger2.player.getOriginalSkills();
        let introSkill = skillList.map((i2) => get.translation(i2) + ":" + get.skillInfoTranslation(i2));
        const { index } = skillList.length === 1 ? { index: 0 } : await player2.chooseControl().set("choiceList", introSkill).forResult();
        fellow.addSkill(skillList[index] === "suoumrfz" ? "yingzi" : skillList[index]);
        for (let i2 = 0; i2 < game.players.length; i2++) {
          let current = game.players[i2];
          current.seatNum = i2 + 1;
          current.update();
        }
        await game.updateRoundNumber();
        for (let i2 of game.players) {
          if (i2 === player2 || i2.suoumrfz === true) {
            i2.draw();
          }
        }
      },
      group: ["suoumrfz_swap", "suoumrfz_die"],
      subSkill: {
        die: {
          charlotte: true,
          silent: true,
          trigger: { global: "dieBegin" },
          async content(event2, trigger2, player2) {
            if (trigger2.player === player2) lib.skill.suoumrfz.onremove(player2);
            else {
              let chars = game.players.slice();
              chars.remove(player2);
              chars.remove(trigger2.player);
              chars = chars.map((i2) => i2.name);
              if (chars.every((i2) => i2 === "muouwuzhemrfz") || chars.length === 0) {
                player2.when({ global: "dieAfter" }).then(() => {
                  game.over(true);
                });
              }
            }
          }
        },
        swap: {
          init(player2, skill) {
            player2.storage[skill] = player2;
          },
          onremove: true,
          firstDo: true,
          charlotte: true,
          silent: true,
          trigger: {
            global: ["playercontrol", "chooseToUseBegin", "chooseToRespondBegin", "chooseToDiscardBegin", "chooseToCompareBegin", "chooseButtonBegin", "chooseCardBegin", "chooseTargetBegin", "chooseCardTargetBegin", "chooseControlBegin", "chooseBoolBegin", "choosePlayerCardBegin", "discardPlayerCardBegin", "gainPlayerCardBegin", "chooseToMoveBegin", "chooseToPlayBeatmapBegin", "chooseToGiveBegin"]
          },
          filter(event2, player2) {
            return !event2.player.isUnderControl(true) && !_status.auto && (event2.player.suoumrfz || event2.player === player2.storage.suoumrfz_swap);
          },
          async content(event2, trigger2, player2) {
            game.swapPlayer(trigger2.player);
          }
        },
        dead: {
          charlotte: true,
          silent: true,
          trigger: { player: "dieBegin" },
          async content(event2, trigger2, player2) {
            if (game.me != player2.suoumrfz) await game.swapPlayer(player2.suoumrfz);
            game.removePlayer(player2);
            game.log(player2, `被移出游戏`);
          }
        }
      }
    },
    // 瑰盐
    qiyimrfz: {
      audio: 2,
      enable: ["phaseUse", "chooseToUse"],
      usable: 1,
      hiddenCard: function(player2, name) {
        let event2 = get.event();
        event2.getParent("phaseUse");
        if (player2.countCards("he") < 1 || _status.currentPhase == player2) return false;
        if (name != "tao") return false;
        return true;
      },
      filter(event2, player2) {
        let evt = event2.getParent("phaseUse");
        if (player2.countCards("he") < 1) return false;
        if (evt && evt.player == player2) return true;
        else {
          return event2.filterCard({ name: "tao", isCard: true }, player2, event2) && _status.currentPhase != player2;
        }
      },
      filterTarget(card2, player2, target2) {
        return target2.getDamagedHp() > 0;
      },
      filterCard: true,
      selectTarget() {
        return [1, Infinity];
      },
      selectCard() {
        return [1, Infinity];
      },
      filterOk() {
        let player2 = get.player();
        if (_status.auto || !player2.isUnderControl(true)) return true;
        return ui.selected.cards.length === ui.selected.targets.length;
      },
      position: "he",
      discard: false,
      lose: false,
      multitarget: true,
      multiline: true,
      check(card2) {
        return lib.skill.qiyimrfz.getResult(get.player()) === false ? false : true;
      },
      getResult(player2) {
        let cards2 = player2.getCards("h");
        if (!player2.hasSkill("guiyaomrfz")) {
          let choiceCards = cards2.filter((card2) => 6 - get.value(card2));
          let choiceTargets = player2.getFriends().filter((i2) => i2.getDamagedHp() > 0);
          if (choiceCards.length !== choiceTargets.length) {
            if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets);
            else choiceTargets = choiceTargets.slice(0, choiceCards);
          }
          if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
          return {
            targets: choiceTargets,
            cards: choiceCards
          };
        } else {
          if (game.countPlayer((current) => get.attitude2(current) > 2 && current.getDamagedHp() > 0) > 1) {
            let choiceCards = cards2.filter((card2) => 8 - get.value(card2) && get.color(card2) === "red");
            let choiceTargets = player2.getFriends().filter((i2) => i2.getDamagedHp() > 0).sort((i2, j) => j.hp - i2.hp);
            if (choiceCards.length !== choiceTargets.length) {
              if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets.length);
              else choiceTargets = choiceTargets.slice(0, choiceCards.length);
            }
            if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
            return {
              targets: choiceTargets,
              cards: choiceCards
            };
          } else {
            let choiceCards = cards2.filter((card2) => 6 - get.value(card2));
            let choiceTargets = player2.getEnemies().filter((i2) => i2.getDamagedHp() > 0);
            choiceCards = choiceCards.sort((i2, j) => get.value(i2) - get.value(j));
            if (choiceCards.length !== choiceTargets.length) {
              if (choiceCards.length > choiceTargets.length) choiceCards = choiceCards.slice(0, choiceTargets.length);
              else choiceTargets = choiceTargets.slice(0, choiceCards.length);
            }
            if (choiceCards.every((i2) => get.color(i2) === "red")) {
              let lowValueRed = choiceCards[0];
              let lowValueOther = cards2.filter((card2) => 6 - get.value(card2) && get.color(card2) !== "red").sort((i2, j) => get.value(i2) - get.value(j));
              if (lowValueOther.length === 0) return false;
              choiceCards = [lowValueRed, lowValueOther[0]];
            }
            if (choiceTargets.length < 1 || choiceCards.length < 1) return false;
            return {
              targets: choiceTargets,
              cards: choiceCards
            };
          }
        }
      },
      async content(event2, trigger2, player2) {
        if (!player2.isUnderControl(true) || _status.auto) {
          let result2 = lib.skill.qiyimrfz.getResult(player2);
          player2.useCard({ name: "tao" }, result2.targets, result2.cards);
        } else {
          let targets2 = event2.targets;
          let cards2 = event2.cards;
          player2.useCard({ name: "tao" }, targets2, cards2);
        }
      },
      ai: {
        order: 8,
        result: {
          player: 1,
          target(player2, target2) {
            if (!player2.hasSkill("guiyaomrfz")) return 1;
            let result2 = lib.skill.qiyimrfz.getResult(player2);
            if (result2 === false) return 0;
            let att = get.attitude2(lib.skill.qiyimrfz.getResult(player2).targets[0]);
            return att > 2 ? 1 : -1;
          }
        }
      }
    },
    guiyaomrfz: {
      audio: 2,
      trigger: {
        global: "recoverBegin"
      },
      filter(event2, player2) {
        return event2.cards && event2.cards.length > 0 && event2.source && event2.source === player2;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        const cards2 = trigger2.cards;
        let target2 = trigger2.player;
        target2.addTempSkill("guiyaomrfz_eff", { player: "phaseEnd" });
        if (cards2.every((card2) => get.color(card2) === "red")) {
          if (!target2.storage.guiyaomrfz_eff) target2.storage.guiyaomrfz_eff = 0;
          target2.storage.guiyaomrfz_eff++;
        } else {
          if (!target2.storage.guiyaomrfz_eff) target2.storage.guiyaomrfz_eff = 0;
          target2.storage.guiyaomrfz_eff--;
          target2.loseHp(2);
        }
      },
      subSkill: {
        eff: {
          silent: true,
          charlotte: true,
          mark: true,
          intro: {
            content(event2, player2) {
              let num = player2.storage.guiyaomrfz_eff;
              if (num === 0) return `无效果`;
              return `额定摸牌数、手牌上限、使用牌的次数和攻击范围${num > 0 ? "+" : ""}${num}`;
            }
          },
          onremove(player2) {
            delete player2.storage.guiyaomrfz_eff;
          },
          trigger: {
            player: "phaseDrawBegin2"
          },
          filter(event2, player2) {
            return !event2.numFixed && player2.storage.guiyaomrfz_eff != 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.num += player2.storage.guiyaomrfz_eff;
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num += player2.storage.guiyaomrfz_eff;
            },
            cardUsable(card2, player2, num) {
              return num += player2.storage.guiyaomrfz_eff;
            },
            attackRange: function(player2, num) {
              return num += player2.storage.guiyaomrfz_eff;
            }
          }
        }
      }
    },
    xiadumrfz: {
      audio: 2,
      forced: true,
      trigger: {
        global: "roundStart"
      },
      firstDo: true,
      async content(event2, trigger2, player2) {
        let cards2 = player2.getCards("h", (card2) => card2.hasGaintag("xiadumrfz"));
        if (cards2) await player2.discard(cards2);
        await player2.changeHujia(-1);
        const { result: result2 } = await player2.draw(2).forResult();
        player2.addGaintag(result2, "xiadumrfz");
        player2.changeHujia(1);
      }
    },
    // 行著
    xingzhumrfz: {
      marktext: "帙",
      intro: {
        name: "帙",
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 2,
      forced: true,
      trigger: {
        global: ["loseAfter", "loseAsyncAfter"]
      },
      filter: function(event2, player2) {
        if (event2.type != "discard") return false;
        for (let current of game.players) {
          if (current === player2) continue;
          let evt = event2.getl(current);
          if (!evt || !evt.cards2) continue;
          return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        let cards2 = [];
        var players = game.filterPlayer();
        for (var current of players) {
          if (current === player2) continue;
          var evt = trigger2.getl(current);
          if (!evt || !evt.cards2) continue;
          var cardsx = evt.cards2.filterInD("d");
          cards2.addArray(cardsx);
        }
        if (cards2.length) {
          player2.addToExpansion(cards2, player2, "giveAuto").gaintag.add("xingzhumrfz");
        }
      },
      group: ["xingzhumrfz_start", "xingzhumrfz_check", "xingzhumrfz_init"],
      subSkill: {
        check: {
          audio: false,
          charlotte: true,
          silent: true,
          trigger: {
            player: "addToExpansionEnd"
          },
          filter: function(event2, player2) {
            return event2.gaintag.includes("xingzhumrfz");
          },
          lastDo: true,
          async content(event2, trigger2, player2) {
            let cards2 = player2.getExpansions("xingzhumrfz");
            if (cards2.length >= 9) {
              const { links } = await player2.chooseCardButton(`【行著】:请弃置${Math.max(1, cards2.length - 9)}张‘帙’`, true, cards2).set("selectButton", () => {
                let cards22 = get.player().getExpansions("xingzhumrfz");
                return Math.max(1, cards22.length - 9);
              }).set("ai", (button) => {
                return -get.value(button.link);
              }).forResult();
              if (!links) return;
              player2.loseToDiscardpile(links);
            }
          }
        },
        start: {
          audio: "xingzhumrfz",
          forced: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          filter(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          async content(event2, trigger2, player2) {
            player2.addToExpansion(get.cards(3), "draw").gaintag.add("xingzhumrfz");
          }
        },
        init: {
          audio: "xingzhumrfz",
          trigger: {
            player: ["loseEnd", "dying", "phaseBefore", "phaseAfter", "dyingAfter", "die"],
            global: ["equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
          },
          filter: function(event2, player2) {
            return player2.getExpansions("xingzhumrfz").length > 0 ^ player2.hasSkill("xingzhumrfz_in");
          },
          forced: true,
          firstDo: true,
          silent: true,
          forceDie: true,
          async content(event2, trigger2, player2) {
            if (player2.getExpansions("xingzhumrfz").length) {
              var cards2 = player2.getExpansions("xingzhumrfz");
              var cardsx = cards2.map((card2) => {
                var cardx = ui.create.card();
                cardx.init(get.cardInfo(card2));
                cardx._cardid = card2.cardid;
                return cardx;
              });
              player2.directgains(cardsx, null, "xingzhumrfz_tag");
              player2.addSkill("xingzhumrfz_in");
            } else player2.removeSkill("xingzhumrfz_in");
          }
        },
        in: {
          charlotte: true,
          audio: false,
          trigger: {
            player: "addToExpansionEnd"
          },
          filter: function(event2, player2) {
            return event2.gaintag.includes("xingzhumrfz");
          },
          forced: true,
          locked: false,
          silent: true,
          content: function() {
            "step 0";
            var cards2 = player.getCards("s", (card2) => card2.hasGaintag("xingzhumrfz_tag"));
            if (player.isOnline2()) {
              player.send(
                function(cards4, player2) {
                  cards4.forEach((i2) => i2.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards2,
                player
              );
            }
            cards2.forEach((i2) => i2.delete());
            if (player == game.me) ui.updatehl();
            var cards3 = player.getExpansions("xingzhumrfz");
            var cardsx = cards3.map((card2) => {
              var cardx = ui.create.card();
              cardx.init(get.cardInfo(card2));
              cardx._cardid = card2.cardid;
              return cardx;
            });
            player.directgains(cardsx, null, "xingzhumrfz_tag");
          },
          onremove: function(player2) {
            var cards2 = player2.getCards("s", (card2) => card2.hasGaintag("xingzhumrfz_tag"));
            if (player2.isOnline2()) {
              player2.send(
                function(cards3, player3) {
                  cards3.forEach((i2) => i2.delete());
                  if (player3 == game.me) ui.updatehl();
                },
                cards2,
                player2
              );
            }
            cards2.forEach((i2) => i2.delete());
            if (player2 == game.me) ui.updatehl();
          },
          group: ["xingzhumrfz_use", "xingzhumrfz_sync"]
        },
        use: {
          charlotte: true,
          trigger: {
            player: ["useCardBefore", "respondBefore"]
          },
          filter: function(event2, player2) {
            var cards2 = player2.getCards("s", (card2) => card2.hasGaintag("xingzhumrfz_tag") && card2._cardid);
            return event2.cards && event2.cards.some((card2) => {
              return cards2.includes(card2);
            });
          },
          forced: true,
          popup: false,
          firstDo: true,
          content: function() {
            player.getCards("s", (card3) => card3.hasGaintag("xingzhumrfz_tag")).map((i2) => i2._cardid);
            var cards2 = player.getExpansions("xingzhumrfz");
            var cards22 = [];
            for (var card2 of trigger.cards) {
              var cardx = cards2.find((cardx2) => cardx2.cardid == card2._cardid);
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
                player
              );
            }
            cards3.forEach((i2) => i2.delete());
            if (player == game.me) ui.updatehl();
          }
        },
        sync: {
          charlotte: true,
          silent: true,
          audio: false,
          trigger: {
            player: ["loseToDiscardpileEnd"]
          },
          filter(event2, player2) {
            let cardsx = player2.getCards("s", (card2) => card2.hasGaintag("xingzhumrfz_tag"));
            let cards2 = player2.getExpansions("xingzhumrfz");
            return cardsx.length !== cards2.length;
          },
          async content(event2, trigger2, player2) {
            let cardsx = player2.getCards("s", (card2) => card2.hasGaintag("xingzhumrfz_tag"));
            let cards2 = player2.getExpansions("xingzhumrfz");
            cardsx.forEach((i2) => {
              if (!cards2.map((i3) => i3.cardid).includes(i2._cardid)) i2.delete();
            });
            ui.updatehl();
          }
        }
      }
    },
    zhizhumrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      mark: true,
      intro: {
        content(event2, player2) {
          let storage = player2.storage.zhizhumrfz;
          return `·本轮已使用的花色：${get.translation(storage)}`;
        }
      },
      firstDo: true,
      filter(event2, player2) {
        if (!player2.storage.zhizhumrfz_check || player2.storage.zhizhumrfz.includes(get.suit(event2.card)) || get.position(event2.card) !== "d") return false;
        for (let current of game.players) {
          if (current === player2) continue;
          for (let key in player2.storage.zhizhumrfz_check) {
            if (event2.card.cardid !== key) continue;
            let arrs = player2.storage.zhizhumrfz_check[key];
            for (let arr of arrs) {
              if (arr[0] === current && arr[1] != current.countCards("h")) return true;
            }
          }
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        player2.storage.zhizhumrfz.push(get.suit(trigger2.card));
        player2.addToExpansion(trigger2.cards, player2, "giveAuto").gaintag.add("xingzhumrfz");
      },
      group: ["zhizhumrfz_check", "zhizhumrfz_remove"],
      subSkill: {
        remove: {
          audio: false,
          charlotte: true,
          silent: true,
          trigger: {
            global: "roundStart",
            player: "useCardAfter"
          },
          lastDo: true,
          async content(event2, trigger2, player2) {
            if (trigger2.name === "useCard") {
              if (player2.storage.zhizhumrfz_check.hasOwnProperty(trigger2.card.cardid)) {
                delete player2.storage.zhizhumrfz_check[trigger2.card.cardid];
              }
            } else {
              player2.storage.zhizhumrfz = [];
            }
          }
        },
        check: {
          audio: false,
          charlotte: true,
          silent: true,
          trigger: {
            player: "useCard"
          },
          async content(event2, trigger2, player2) {
            if (!player2.storage.zhizhumrfz_check) player2.storage.zhizhumrfz_check = {};
            for (let current of game.players) {
              if (current === player2) continue;
              if (!player2.storage.zhizhumrfz_check[trigger2.card.cardid]) player2.storage.zhizhumrfz_check[trigger2.card.cardid] = [];
              player2.storage.zhizhumrfz_check[trigger2.card.cardid].push([current, current.countCards("h")]);
            }
          }
        }
      }
    },
    // 寻澜
    tanxunmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseBegin" },
      filter(event2, player2) {
        return !event2.audioed;
      },
      async content(event2, trigger2, player2) {
        trigger2.audioed = true;
      },
      ai: {
        viewHandcard: true,
        skillTagFilter(player2, tag, arg) {
          if (player2 === arg || !player2.inRange(arg) || _status.currentPhase !== player2) return false;
        }
      }
    },
    dongximrfz: {
      audio: 2,
      enable: "phaseUse",
      filter(event2, player2) {
        return player2.countCards("h", (card2) => player2.canRecast(card2)) > 0 && game.hasPlayer((current) => current != player2 && player2.inRange(current) && !current.hasSkill("dongximrfz_ban") && current.countCards("h", (card2) => current.canRecast(card2)) > 0);
      },
      filterTarget(card2, player2, target2) {
        return target2 != player2 && player2.inRange(target2) && !target2.hasSkill("dongximrfz_ban") && target2.countCards("h", (cardx) => target2.canRecast(cardx)) > 0;
      },
      filterCard(card2) {
        return get.player().canRecast(card2);
      },
      selectCard: [1, 2],
      check(card2) {
        return 1;
      },
      discard: false,
      lose: false,
      async content(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        target2.addTempSkill("dongximrfz_ban", { global: "phaseUseEnd" });
        let cards1;
        if (_status.auto || !player2.isUnderControl(true)) {
          let cards3 = [];
          for (let i2 of target2.getCards("h")) {
            if (get.attitude(player2, target2) > 0) {
              for (let j of player2.getCards("h")) {
                if (get.suit(i2) !== get.suit(j)) continue;
                cards3.push(j);
              }
            } else {
              for (let j of player2.getCards("h")) {
                if (get.suit(i2) === get.suit(j)) continue;
                cards3.push(j);
              }
            }
          }
          if (cards3.length > 2) cards3 = cards3.slice(0, 2);
          cards1 = cards3.length > 0 ? cards3 : player2.getCards("h").randomGet();
        } else {
          cards1 = event2.cards;
        }
        const { cards: cards2 } = await target2.chooseCard([1, 2], true).set("filterCard", (card2) => {
          return get.event().playerx.canRecast(card2);
        }).set("prompt", `【洞悉】:你可以重铸至多两张牌`).set("prompt2", get.prompt2("dongximrfz")).set("ai", (card2) => {
          let target3 = get.event().target, player3 = get.event().playerx;
          if (target3.countCards("h") > 2 && ui.selected.cards.length > 0 && get.attitude(player3, target3) < 0) return -1;
          return 8 - get.value(card2, player3);
        }).set("playerx", target2).set("target", player2).forResult();
        let bool = true;
        outerLoop: for (let i2 = 0; i2 < cards1.length; i2++) {
          for (let j = 0; j < cards2.length; j++) {
            if (get.suit(cards1[i2]) === get.suit(cards2[j])) {
              bool = false;
              break outerLoop;
            }
          }
        }
        player2.recast(cards1);
        target2.recast(cards2);
        let num = cards2.length;
        if (bool) {
          if (num < 1) return;
          if (target2.countGainableCards(player2, "h")) await player2.gainPlayerCard("h", target2, num, true).set("target", target2).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
          await target2.damage(num, player2);
        } else {
          player2.disableSkill("dongximrfz", ["dongximrfz"]);
          player2.addTempSkill("dongximrfz_restore", { player: "phaseUseEnd" });
          game.log(player2, "的技能", "#g" + get.translation("dongximrfz"), "失效了");
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        },
        restore: {
          charlotte: true,
          forced: true,
          popup: false,
          onremove: function(player2) {
            player2.enableSkill("dongximrfz");
            game.log(player2, "恢复了技能");
          }
        }
      },
      ai: {
        order: 2,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    // 诺威尔
    butingmrfz: {
      audio: 2,
      comboSkill: true,
      mod: {
        aiOrder(player2, card2, num) {
          if (typeof card2 == "object") {
            const evt = player2.getLastUsed(1);
            if (evt?.card && get.type2(evt.card) === get.type2(card2)) {
              return num + 10;
            }
          }
        }
      },
      trigger: {
        player: "useCardAfter"
      },
      filter(event2, player2) {
        let evt = player2.getLastUsed(1);
        return evt && get.type2(evt.card) === get.type2(event2.card);
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        player2.draw();
      },
      ai: {
        threaten: 1.5
      }
    },
    buximrfz: {
      audio: 2,
      trigger: {
        player: "dyingAfter"
      },
      filter(event2, player2) {
        return player2.hasUseTarget("tao");
      },
      async content(event2, trigger2, player2) {
        player2.chooseUseTarget({ name: "tao" }, true);
      }
    },
    // 濯尘芙蓉
    dichenmrfz: {
      init(player2, skill) {
        player2.storage[skill] = [
          (target2) => {
            target2.discard(target2.getCards("j"));
          },
          (target2) => {
            target2.draw(2);
          },
          (target2) => {
            target2.recover();
            target2.when({ player: "phaseEnd" }).then(() => {
              if (player2.countCards("h") < 5) player2.gain(lib.card.ying.getYing(5 - player2.countCards("h")), "gain2");
            }).assign({
              mark: true,
              intro: {
                name: "涤尘",
                content(_, player3) {
                  return `在你的回合结束获得${Math.max(5 - player3.countCards("h"), 0)}张【影】`;
                }
              },
              dichenmrfz: true
            }).translation("涤尘").finish();
            let skillList = target2.getSkills();
            skillList.forEach((skill2) => {
              let info = lib.skill[skill2];
              if (info.dichenmrfz) {
                target2.markSkill(skill2);
              }
            });
          },
          (target2) => {
            target2.link(false);
            target2.turnOver(false);
            const player3 = get.player();
            const storage = player3.storage.dichenmrfz;
            const index = storage.length - 1;
            if (index <= 0) return;
            const prevFunc = storage[index - 1];
            const currentFunc = storage[index];
            storage[index - 1] = (target3) => {
              prevFunc(target3);
              currentFunc(target3);
            };
            storage.splice(index, 1);
          }
        ];
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      onremove: true,
      filterTarget(card2, player2, target2) {
        let num = player2.getAttackRange() - get.distance(player2, target2) + 1;
        let prompt = num < player2.storage.dichenmrfz.length ? `执行至第${num}项` : `执行所有项`;
        if (player2.inRange(target2) || target2 === player2) target2.showPrompt(prompt);
        return player2.inRange(target2) || target2 === player2;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.targets[0];
        let storage = player2.storage.dichenmrfz;
        let num = Math.min(player2.getAttackRange() - get.distance(player2, target2) + 1, 4);
        if (storage[0] && num > 0) storage[0](target2);
        if (storage[1] && num > 1) storage[1](target2);
        if (storage[2] && num > 2) storage[2](target2);
        if (storage[3] && num > 3) storage[3](target2);
      },
      ai: {
        order: 7.49,
        result: {
          player: 1,
          target(player2, target2) {
            let storage = player2.storage.dichenmrfz;
            let x = Math.min(player2.getAttackRange() - get.distance(player2, target2) + 1, 4);
            let num = 1;
            if (get.attitude2(target2) < 0) return 0;
            if (x >= storage.length && storage.length > 2) num += 5;
            if (target2.hp < 2) num += 3;
            if (target2.countCards("h") < 3) num += 1;
            if (target2.isTurnedOver()) num += 5;
            if (target2.isLinked()) num += 0.5;
            if (target2.hasSkill("zhuoxinmrfz")) num += 0.5;
            return num;
          }
        }
      }
    },
    zhuoxinmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current !== player2 && get.distance(player2, current) < 2 && player2.canUse({ name: "tuixinzhifu" }, current);
        });
      },
      prompt(event2, player2, name) {
        game.players.forEach((char) => {
          if (get.distance(player2, char) < 2 && char !== player2 && player2.canUse({ name: "tuixinzhifu" }, char)) char.showPrompt("距离不大于2");
        });
        return get.prompt("zhuoxinmrfz");
      },
      async content(event2, trigger2, player2) {
        player2.chooseToUse().set("openskilldialog", "视为使用一张【推心置腹】").set("norestore", true).set("_backupevent", "zhuoxinmrfz_backup").set("custom", {
          add: {},
          replace: { window() {
          } }
        }).backup("zhuoxinmrfz_backup");
      },
      subSkill: {
        backup: {
          filterCard: () => false,
          filterTarget(card2, player2, target2) {
            return target2 !== player2 && get.distance(player2, target2) < 2 && player2.canUse({ name: "tuixinzhifu" }, target2);
          },
          selectTarget: -1,
          selectCard: -1,
          log: false,
          viewAs: {
            name: "tuixinzhifu",
            isCard: true
          }
        }
      }
    },
    // 新术士阿米娅
    newtongganmrfz: {
      audio: "tongganmrfz",
      trigger: {
        global: "phaseEnd"
      },
      findGainAndDiscardHistory() {
        let result2 = {
          gain: [],
          discard: []
        };
        game.players.forEach((char) => {
          char.getHistory("gain", (evt) => {
            if (evt.name === "gain") result2.gain.add(char);
          });
          char.getHistory("lose", (evt) => {
            if (evt.type === "discard") result2.discard.add(char);
          });
        });
        return result2;
      },
      filter(event2, player2) {
        let result2 = lib.skill.newtongganmrfz.findGainAndDiscardHistory();
        return (result2.gain.length > 0 || result2.discard.length > 0) && event2.player !== player2;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        let { gain, discard } = lib.skill.newtongganmrfz.findGainAndDiscardHistory();
        await player2.draw(gain.length);
        if (discard.length) player2.chooseToDiscard(discard.length, true, `【同感】:请弃置${discard.length}张牌`, "he");
      }
    },
    shijiemrfz: {
      mod: {
        canBeDiscarded(card2, target2, player2) {
          if (get.position(card2) === "h" && player2.countCards("h") <= 5) return false;
        }
      },
      audio: 2,
      trigger: {
        player: ["gainBegin", "loseBegin"]
      },
      forced: true,
      filter(event2, player2) {
        return event2.name === "gain" ? player2.countCards("h") >= 10 && event2.getParent().name === "draw" : player2.countCards("h") <= 5 && event2.type === "discard";
      },
      async content(event2, trigger2, player2) {
        if (event2.name === "gain") {
          let cards2 = trigger2.getParent().result;
          game.cardsDiscard(cards2);
          game.log(player2, "取消了此次摸牌");
        } else {
          game.log(player2, "取消了此次弃牌");
        }
        trigger2.cancel();
      }
    },
    // 新近卫阿米娅
    chenxianmrfz: {
      audio: 2,
      trigger: {
        player: "phaseDrawBegin2"
      },
      filter(event2, player2) {
        return game.countPlayer((current) => current.getDamagedHp() > 0) > 0 && !event2.numFixed;
      },
      prompt() {
        return `【沉弦】:是否多摸${game.countPlayer((current) => current.getDamagedHp() > 0)}张牌,然后其中每包含一张【万箭齐发】、【杀】或【酒】，你便弃置一张牌？`;
      },
      async content(event2, trigger2, player2) {
        let num = game.countPlayer((current) => current.getDamagedHp() > 0);
        trigger2.num += num;
        player2.when({ player: "phaseDrawAfter" }).then(() => {
          let cards2 = trigger2.cards;
          let num2 = cards2.filter((card2) => {
            return card2.name === "wanjian" || card2.name === "sha" || card2.name === "jiu";
          }).length;
          if (num2 > 0) player2.chooseToDiscard("he", true, `【沉弦】:请弃置${get.cnNumber(num2)}张牌`, num2);
        });
      },
      ai: {
        threaten: 2
      }
    },
    benyemrfz: {
      audio: "amy_qingyanmrfz",
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current !== player2 && current.countCards("h") > 0;
        });
      },
      filterTarget(card2, player2, target2) {
        return target2 !== player2 && target2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.targets[0];
        const { cards: cards2 } = await player2.choosePlayerCard(target2, "h").set("prompt", `【奔夜】:你可以使用其中一张【杀】或【顺手牵羊】`).set("visible", true).set("filterButton", (button) => {
          let link = button.link;
          return link.name === "sha" || link.name === "shunshou";
        }).set("ai", (button) => {
          let link = button.link;
          let player3 = get.player();
          let max = 0;
          game.players.forEach((char) => {
            if (player3.canUse(link, char)) {
              max = Math.max(max, get.effect(char, link, player3, player3));
            }
          });
          return max;
        }).forResult();
        if (!cards2) return;
        if (player2.hasUseTarget(cards2[0])) {
          await player2.$gain2(cards2[0], false);
          player2.chooseUseTarget(cards2[0]).set("addCount", false);
        }
      },
      ai: {
        order: 3,
        result: {
          player: 1,
          target(player2, target2) {
            let att = get.attitude(player2, target2);
            return att > 0 ? 0 : -1 * target2.countCards("h");
          }
        }
      }
    },
    newjueyingmrfz: {
      audio: "yingxiaomrfz",
      trigger: { global: "phaseEnd" },
      skillAnimation: true,
      animationColor: "red",
      mark: true,
      unique: true,
      limited: true,
      filter: function(event2, player2) {
        let color = new Set(
          get.discarded().filter((card2) => card2.name === "sha").map((card2) => get.color(card2))
        );
        if (color.size < 2) return false;
        return !player2.storage.newjueyingmrfz;
      },
      init: (player2, skill) => player2.storage[skill] = false,
      async content(event2, trigger2, player2) {
        player2.awakenSkill("newjueyingmrfz");
        player2.storage.newjueyingmrfz = true;
        let skills = player2.getSkills(null, false, null).filter((skill) => lib.translate[skill + "_info"]);
        let awakenedSkills = player2.awakenedSkills.filter((skill) => lib.translate[skill + "_info"]);
        skills.add(...awakenedSkills);
        let cards2 = [];
        let names = {};
        lib.inpile.forEach((i2) => {
          names[i2] = get.translation(i2);
        });
        let pattern = new RegExp(Object.values(names).join("|"), "g");
        skills.forEach((skill) => {
          let translate = lib.translate[skill + "_info"];
          let matches = translate.match(pattern);
          if (matches) {
            let arr = matches.map((match) => {
              return Object.keys(names).find((key) => names[key] === match);
            });
            if (arr.length > 0) {
              cards2.push(...arr);
            }
          }
        });
        while (cards2.length) {
          let card2 = { name: cards2.shift(), isCard: true };
          if (player2.hasUseTarget(card2)) {
            await player2.chooseUseTarget(card2).set("prompt2", `待使用：${get.translation(cards2)}`);
          }
        }
      }
    }
  }
};
export {
  epic1 as default
};
//# sourceMappingURL=epic1.js.map
