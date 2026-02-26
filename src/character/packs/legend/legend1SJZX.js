import { get, ui, game, _status, lib } from "noname";
const legend1SJZX = {
  character: {
    ailinimrfz: ["female", "yimrfz", 3, ["zhidengmrfz", "shenpanmrfz", "liechaomrfz"], []],
    hongxuemrfz: ["female", "luomrfz", 4, ["ruibimrfz", "sujimrfz"], []],
    xiaoyangmrfz: ["female", "laimrfz", 3, ["qingyanmrfz", "luanhuomrfz"], []],
    yinhuimrfz: ["male", "xiemrfz", 4, ["xuebianmrfz", "tonghemrfz"], []],
    lingzhimrfz: ["male", "xiemrfz", 4, ["siyongmrfz"], []],
    liumingmrfz: ["male", "yimrfz", 4, ["fanyuanmrfz", "yingjimrfz", "new_weiguangmrfz"], []],
    chizuimrfz: ["female", "xumrfz", 4, ["newzhidianmrfz", "newpijimrfz"], []],
    niyanmrfz: ["female", "luomrfz", 4, ["sutumrfz", "wotumrfz"], []],
    chengshanmrfz: ["female", "luomrfz", 3, ["dianshanmrfz", "shidemrfz"], []],
    wmrfz: ["female", "bamrfz", 3, ["fukemrfz", "zhumengmrfz3"], []],
    sikadimrfz: ["female", "liemrfz", 4, ["jingliemrfz", "shulangmrfz", "tongmaimrfz"], ["clan:深海猎人"]],
    spdegoumrfz: ["female", "qimrfz", 4, ["laoyingmrfz", "yushimrfz"], []],
    maennamrfz: ["male", "kamrfz", 4, ["lianmangmrfz", "zhanmangmrfz", "xingyimrfz"], []],
    splinguangmrfz: ["female", "kamrfz", 4, ["zhuguangmrfz", "kuanmrfz", "shuoguangmrfz"], []],
    kaierximrfz: ["female", "luomrfz", 3, ["yuanlvemrfz", "chonggoumrfz", "yuanshimrfz", "m3mrfz"], ["zhu"]],
    shanmrfz: ["male", "gemrfz", 4, ["zhefumrfz", "yubianmrfz"], []],
    geleidiyamrfz: ["female", "liemrfz", "3/4", ["quliemrfz", "newxunxiangmrfz", "xueshuomrfz", "tongmaimrfz"], ["clan:深海猎人"]],
    chenmrfz: ["female", "longmrfz", 4, ["danweimrfz", "hechimrfz", "jueyingmrfz", "newjingsimrfz"], ["zhu"]],
    xingxiongmrfz: ["female", "longmrfz", "4/5", ["xinboremrfz", "xinyizhongmrfz"], []],
    kanielianmrfz: ["female", "laimrfz", 3, ["shazhenmrfz", "shacanmrfz", "shahuanmrfz"], []],
    kuiyingmrfz: ["male", "weimrfz", 3, ["xuyingmrfz", "xuegemrfz", "huanxiangmrfz"], []],
    mositimamrfz: ["female", "lamrfz", 3, ["shishimrfz", "huanshimrfz"], []],
    keebomrfz: ["female", "luomrfz", 3, ["jiemimrfz", "shihuangmrfz", "baokemrfz"], []],
    feiyameitamrfz: ["female", "lamrfz", 4, ["shunanmrfz"], []],
    jicimrfz: ["male", "yimrfz", 4, ["jihumrfz", "re_jianshumrfz"], []],
    helagemrfz: ["male", "wumrfz", 4, ["yingkuimrfz", "cangfengmrfz", "yuexiangmrfz"], []],
    wendimrfz: ["female", "luomrfz", 4, ["jiangpaomrfz", "newdanpaomrfz"], []],
    senranmrfz: ["female", "samrfz", "3/5", ["juezhanmrfz", "shanxiemrfz", "tieyimrfz"], []],
    ashmrfz: ["female", "othermrfz", "3/3/1", ["baigeimrfz", "wusumrfz", "wutoumrfz"], []],
    kamimrfz: ["male", "samrfz", 3, ["dianlianmrfz", "shazumrfz", "leibaomrfz"], []],
    nianmrfz: ["female", "suimrfz", 4, ["zhujimrfz", "tongyinmrfz", "tieyumrfz"], []],
    lingmrfz: ["female", "suimrfz", 3, ["shixingmrfz", "zuimengmrfz", "haojiumrfz"], []],
    fengdimrfz: ["female", "weimrfz", 4, ["newjuntongmrfz", "newpochengmrfz"], []],
    qinliumrfz: ["female", "weimrfz", 3, ["junqimrfz", "butuimrfz", "zhiqimrfz"], []],
    laolimrfz: ["male", "limrfz", 3, ["linhuamrfz", "mingshimrfz", "jixiongmrfz"], []],
    amrfz: ["male", "limrfz", "3/4/1", ["guaijiemrfz", "guaiyaomrfz", "qizhenmrfz"], []],
    heimrfz: ["female", "ximrfz", 4, ["heishimrfz", "ruitongmrfz", "junumrfz"], []],
    chongyuemrfz: ["male", "suimrfz", 3, ["shubianmrfz", "wubenmrfz", "wowumrfz"], []],
    anjielinamrfz: ["female", "xumrfz", 3, ["xinshimrfz", "fanzhongmrfz"], []],
    haojiaomrfz: ["female", "weimrfz", 4, ["xuezhanmrfz", "dunpaomrfz", "biaohaomrfz"], []],
    xigymrfz: ["female", "suimrfz", 3, ["huijuanmrfz", "dianjingmrfz", "cangjuanmrfz"], []],
    yanweimrfz: ["female", "hongmrfz", 4, ["fengjianmrfz", "hongsongmrfz"], []],
    nengtianshimrfz: ["female", "qimrfz", "3/3/1", ["lianshemrfz", "guozaimrfz"], []],
    yuanyamrfz: ["female", "hongmrfz", 4, ["bingximrfz", "ningshenmrfz", "yuanmengmrfz"], []],
    midiexiangmrfz: ["female", "luomrfz", 3, ["zhangyimrfz", "chongjimrfz", "nianshoumrfz"], []],
    spzzxpmrfz: ["female", "luomrfz", 3, ["yuyunmrfz", "shuiqiangmrfz", "jianfengmrfz"], []],
    shuiyuemrfz: ["male", "dongmrfz", 3, ["liqunmrfz", "chuangshangmrfz", "jinghuamrfz"], []],
    spyoulingshamrfz: ["female", "liemrfz", 3, ["xinyongwomrfz", "douzhengmrfz", "shensuimrfz", "tongmaimrfz"], ["clan:深海猎人"]],
    qiubaimrfz: ["female", "yanmrfz", 4, ["ruximrfz", "wenxuemrfz"], []],
    baitiemrfz: ["male", "weimrfz", 4, ["jigongmrfz", "jiefeimrfz"], []],
    weinamrfz: ["female", "weimrfz", 4, ["fensuimrfz", "yuechuimrfz"], []],
    siyemrfz: ["male", "xumrfz", 1, ["qunxingmrfz", "langqunmrfz"], []],
    spjiaweiermrfz: ["female", "luomrfz", 4, ["yixuemrfz", "juximrfz", "conghunmrfz"], []],
    semrfz: ["female", "luomrfz", 4, ["mojianmrfz", "huanghunmrfz", "yujinmrfz"], []],
    linmrfz: ["female", "yanmrfz", 3, ["zhenzamrfz", "liuliemrfz", "yinbimrfz"], []],
    duoluoximrfz: ["female", "lymrfz", 3, ["newgongzhenmrfz", "newmengxiangmrfz"], []],
    kongxianmrfz: ["female", "lamrfz", "3/3/1", ["sanyimrfz", "baofengmrfz", "tiexianmrfz"], []],
    spyedaomrfz: ["female", "othermrfz", "3/4", ["luanwumrfz"], []],
    yineisimrfz: ["female", "luomrfz", 3, ["yingzhimrfz", "yingshaomrfz"], []],
    miumiumrfz: ["female", "lymrfz", 3, ["yuanliumrfz", "shuilingmrfz", "xinjingshuimrfz"], []],
    heijianmrfz: ["male", "laimrfz", 3, ["newhuangxiangmrfz", "newjiyinmrfz"], []],
    yifulitemrfz: ["female", "lymrfz", 3, ["yanmomrfz", "yanbaomrfz", "huishenmrfz"], []],
    sphemomrfz: ["female", "lymrfz", 3, ["renbenmrfz", "dizhumrfz"], []],
    saileiyamrfz: ["female", "lymrfz", "3/4", ["panshimrfz", "newgaihuamrfz"], []],
    huangmrfz: ["female", "luomrfz", 4, ["newyanxunmrfz", "newfeixuemrfz"], []],
    linglanmrfz: ["female", "xumrfz", 3, ["newhualaomrfz", "newhemingmrfz", "wuyuemrfz"], []],
    shanlingmrfz: ["female", "shimrfz", 4, ["yubimrfz", "jiushumrfz", "lichangmrfz"], []],
    maluxiermrfz: ["female", "othermrfz", 3, ["kumomrfz", "cainvmrfz", "cangshumrfz"], []],
    spweinamrfz: ["female", "weimrfz", 4, ["zhongyuanmrfz", "futumrfz", "wangximrfz"], []],
    splapulandemrfz: ["female", "xumrfz", 3, ["shilangmrfz", "toulangmrfz", "kuanglangmrfz"], []],
    rendongmrfz: ["female", "xumrfz", 4, ["yinhumrfz", "zhuixiongmrfz"], []],
    shijunzhemrfz: ["female", "xumrfz", 4, ["fengyanmrfz", "weimingmrfz"], []],
    spjicimrfz: ["male", "yimrfz", 3, ["xinxiangmrfz", "haijiangmrfz", "fanyangmrfz"], []],
    yumrfz: ["male", "suimrfz", 4, ["qizaomrfz", "zhonglemrfz"], []],
    zhuhuangmrfz: ["female", "yanmrfz", "4/5", ["chongrangmrfz", "zhuoyanmrfz", "liaoyuanmrfz"], []]
  },
  skill: {
    //艾丽妮
    zhidengmrfz: {
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      audio: 2,
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseTarget(get.prompt2("zhidengmrfz"), [0, player2.hp], function(card, player3, target) {
          return target.hp <= player3.hp;
        }).set("ai", (target) => get.attitude2(target) > 0).forResult();
      },
      async content(event2, trigger2, player2) {
        const { targets } = event2;
        game.asyncDraw(targets);
        if (!player2.storage._sjzxAch_denghuoweimingmrfz) player2.storage._sjzxAch_denghuoweimingmrfz = 0;
        if (targets.length >= 2) player2.storage._sjzxAch_denghuoweimingmrfz++;
      }
    },
    shenpanmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card, player2, target) {
        return player2.canCompare(target);
      },
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        const result2 = await player2.chooseToCompare(target).forResult();
        if (result2.bool) {
          target.addTempSkill("shenpanmrfz2");
          player2.addTempSkill("shenpanmrfz3");
          player2.storage.shenpanmrfz3 = target;
        }
      },
      ai: {
        order: 10,
        result: {
          player: function(player2) {
            if (player2.countCards("h", "sha") > 0) return 0.6;
            var num = player2.countCards("h");
            if (num > player2.hp) return 0;
            if (num == 1) return -2;
            if (num == 2) return -1;
            return -0.7;
          },
          target: function(player2, target) {
            var num = target.countCards("h");
            if (num == 1) return -1;
            if (num == 2) return -0.7;
            return -0.5;
          }
        },
        threaten: 1.3
      }
    },
    shenpanmrfz2: {
      charlotte: true,
      mark: true,
      intro: {
        content: "伊比利亚审判庭裁决你为异端"
      }
    },
    shenpanmrfz3: {
      mod: {
        globalFrom: function(from, to) {
          if (to == from.storage.shenpanmrfz3) {
            return -Infinity;
          }
        }
      },
      trigger: {
        player: "useCardToPlayered"
      },
      forced: true,
      charlotte: true,
      filter: function(event2, player2) {
        return event2.target.hasSkill("shenpanmrfz2") && event2.target.countCards("he") > 0;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      async content(event2, trigger2, player2) {
        const result2 = await trigger2.target.chooseToDiscard("he", true, 1).forResult();
        if (result2.cards && result2.cards.length > 0) player2.gain(result2.cards, "gain2");
      }
    },
    liechaomrfz: {
      audio: 2,
      trigger: {
        source: "damageBegin3"
      },
      filter: function(event2) {
        if (event2.parent === void 0 || event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2") return false;
        if (event2.card) {
          if (event2.player.countCards("he") == 0) return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        trigger2.num++;
      },
      ai: {
        effect: {
          player: function(card, player2, target, current) {
            if (card.name == "sha" && target.countCards("h") == 0 && !target.hasSkillTag("filterDamage", null, {
              player: player2,
              card
            }))
              return [1, 0, 1, -3];
          }
        }
      }
    },
    //鸿雪
    ruibimrfz: {
      audio: 3,
      enable: "phaseUse",
      derivation: ["dazijimrfzskill"],
      usable: 1,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0 && !player2.isDisabled(1) && !player2.hasCard(function(card) {
          return card.name == "dazijimrfz";
        }, "e");
      },
      filterCard: true,
      check: function(card) {
        return 6 - get.value(card);
      },
      async content(event2, trigger2, player2) {
        const card = game.createCard("dazijimrfz", "heart", 2);
        player2.$gain2(card);
        game.delayx();
        player2.equip(card);
      },
      group: "ruibimrfz2",
      ai: {
        order: 12,
        result: {
          player: 1
        }
      }
    },
    ruibimrfz2: {
      audio: "ruibimrfz",
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      filter: function(event2, player2) {
        return !player2.isDisabled(1) && (event2.name != "phase" || game.phaseNumber == 0);
      },
      async content(event2, trigger2, player2) {
        const card = game.createCard("dazijimrfz", "heart", 2);
        player2.$gain2(card);
        game.delayx();
        player2.equip(card);
        player2.removeSkill("ruibimrfz2");
      }
    },
    sujimrfz: {
      audio: 2,
      trigger: {
        source: "damageSource"
      },
      forced: true,
      filter: function(event2, player2) {
        if (event2.player == player2) return false;
        if (event2.card.name != "sha" || !player2.isPhaseUsing()) return false;
        return event2.player.isAlive();
      },
      async content(event2, trigger2, player2) {
        trigger2.player.addSkill("sujimrfz2");
      },
      group: ["sujimrfz_damage"]
    },
    sujimrfz2: {
      charlotte: true,
      mark: true,
      intro: {
        content: "鸿雪记住了你的弱点"
      }
    },
    sujimrfz_damage: {
      direct: true,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (!event2.card || event2.card.name != "sha" || player2.hasSkill("sujimrfz_damage_ban")) return false;
        for (var i = 0; i < event2.targets.length; i++) {
          var target = event2.targets[i];
          if (target.hasSkill("sujimrfz2")) return true;
        }
      },
      async content(event2, trigger2, player2) {
        for (var i = 0; i < trigger2.targets.length; i++) {
          var target = trigger2.targets[i];
          if (target.hasSkill("sujimrfz2")) {
            target.addTempSkill("qinggang2");
            target.storage.qinggang2.add(trigger2.card);
            target.markSkill("qinggang2");
            target.addTempSkill("sujimrfz_damage_add");
            target.storage.sujimrfz_damage = {
              card: trigger2.card
            };
          }
        }
        player2.addTempSkill("sujimrfz_damage_ban", "phaseEnd");
      },
      subSkill: {
        add: {
          onremove: function(player2) {
            delete player2.storage.sujimrfz_damage;
          },
          trigger: {
            player: "damageBegin3"
          },
          filter: function(event2, player2) {
            var info = player2.storage.sujimrfz_damage;
            return event2.card && event2.card == info.card;
          },
          silent: true,
          popup: false,
          forced: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.logSkill("sujimrfz");
          }
        },
        ban: {
          charlotte: true
        }
      }
    },
    //艾雅法拉
    cuofengmrfz: {
      group: ["cuofengmrfz_mark1", "cuofengmrfz_mark2"],
      audio: 2,
      preHidden: true,
      trigger: {
        player: "damageEnd"
      },
      filter: function(event2, player2) {
        var num = player2.countMark("cuofengmrfz_mark1") + player2.countMark("cuofengmrfz_mark2");
        if (num >= player2.maxHp - 1) return false;
        return player2.countCards("he") > 0;
      },
      async content(event2, trigger2, player2) {
        var list = ["摸牌阶段", "结束阶段"];
        const result2 = await player2.chooseControl(list).forResult();
        if (result2.control == "摸牌阶段") {
          player2.addMark("cuofengmrfz_mark1", 1, false);
        } else {
          player2.addMark("cuofengmrfz_mark2", 1, false);
        }
        player2.chooseToDiscard("he", true, 1);
      },
      ai: {
        maixie: true,
        maixie_hp: true,
        effect: {
          target: function(card, player2, target) {
            if (player2.hasSkillTag("jueqing", false, target)) return [1, -1];
            if (get.tag(card, "damage")) return [1, 0.55];
          }
        }
      }
    },
    cuofengmrfz_mark1: {
      intro: {
        content: "摸牌阶段额外摸#张牌"
      },
      trigger: {
        player: "phaseDrawBegin2"
      },
      filter: function(event2, player2) {
        return player2.countMark("cuofengmrfz_mark1") > 0;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        var num = player2.countMark("cuofengmrfz_mark1");
        trigger2.num += num;
      }
    },
    cuofengmrfz_mark2: {
      intro: {
        content: "结束阶段摸#张牌"
      },
      trigger: {
        player: "phaseJieshuBegin"
      },
      filter: function(event2, player2) {
        return player2.countMark("cuofengmrfz_mark2") > 0;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        var num = player2.countMark("cuofengmrfz_mark2");
        player2.draw(num);
      }
    },
    chengzhimrfz: {
      skillAnimation: true,
      animationColor: "wood",
      audio: 2,
      juexingji: true,
      unique: true,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter: function(event2, player2) {
        var num = player2.countMark("cuofengmrfz_mark1") + player2.countMark("cuofengmrfz_mark2");
        if (num != player2.maxHp - 1) return false;
        return !player2.storage.chengzhimrfz;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        player2.loseMaxHp();
        player2.addSkill("zhuzhimrfz");
        game.log(player2, "获得了技能", "#g【逐志】");
        player2.awakenSkill(event2.name);
        player2.storage[event2.name] = true;
      }
    },
    zhuzhimrfz: {
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      audio: 2,
      filter: function(event2, player2) {
        if (player2.hp == 1 && player2.countCards("he") <= 0) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        if (player2.hp > 1) {
          await player2.damage("fire");
        } else {
          await player2.chooseToDiscard("he", true, 1);
        }
        var num1 = player2.countMark("cuofengmrfz_mark1") + player2.countMark("cuofengmrfz_mark2");
        var num2 = Math.floor(num1 / 2);
        player2.addTempSkill("zhuzhimrfz_mark", {
          player: "phaseAfter"
        });
        player2.draw(num2);
      },
      ai: {
        basic: {
          order: 1
        },
        result: {
          player: function(player2) {
            if (player2.hp < 2) return -1;
            return 1;
          }
        }
      }
    },
    zhuzhimrfz_mark: {
      mark: true,
      intro: {
        content: "黑暗追着她，她追着光。"
      },
      init: function(player2, skill) {
        if (!player2.storage[skill]) player2.storage[skill] = 0;
      },
      onremove: true,
      mod: {
        maxHandcard: function(player2, num) {
          var n = player2.countMark("cuofengmrfz_mark1") + player2.countMark("cuofengmrfz_mark2");
          return num + n;
        },
        cardUsable: function(card, player2, num) {
          var n = player2.countMark("cuofengmrfz_mark1") + player2.countMark("cuofengmrfz_mark2");
          if (card.name == "sha") return num - 1 + n;
        }
      }
    },
    //银灰
    moucunmrfz: {
      trigger: {
        global: "roundStart"
      },
      intro: {
        content: "【鹰视】中的X为#。"
      },
      audio: 2,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      async content(event2, trigger2, player2) {
        player2.removeMark("moucunmrfz2", player2.countMark("moucunmrfz2"));
        const result2 = await player2.chooseCardTarget({
          prompt: "请交给一名其他角色一至两张牌",
          filterCard: true,
          filterTarget: function(card, player3, target) {
            var group = game.me.group;
            return player3 != target && target.group !== group;
          },
          ai1: function(card) {
            return 10 - get.value(card);
          },
          ai2: function(target) {
            if (get.attitude(player2, target) <= 0) return get.attitude(player2, target);
            return get.attitude(player2, target) > 0;
          },
          selectCard: [1, 2],
          position: "he"
        }).forResult();
        if (result2.bool && result2.targets) {
          result2.targets[0].gain(result2.cards, player2, "giveAuto");
          result2.targets[0].addSkill("moucunmrfz3");
        }
      },
      group: "moucunmrfz2"
    },
    yingshimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => lib.skill.yingshimrfz.filterTarget(null, player2, current));
      },
      check: function(card) {
        return 6 - get.value(card);
      },
      filterTarget: function(card, player2, target) {
        return target != player2 && target.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        var num = player2.countMark("moucunmrfz");
        if (num < 1) {
          player2.viewHandcards(target);
        } else {
          var max = target.countCards("h");
          if (max > num) return player2.gainPlayerCard(num, target, "h", true, "visible");
          if (num >= max) return player2.gainPlayerCard(max, target, "h", true, "visible");
        }
        game.log(player2, "观看了", target, "的手牌");
      },
      ai: {
        order: 6,
        result: {
          player: 0.5,
          target: function(player2, target) {
            if (target.hasSkillTag("noh")) return 0;
            return -1;
          }
        }
      }
    },
    moucunmrfz2: {
      trigger: {
        global: "phaseUseEnd"
      },
      forced: true,
      filter: function(event2, player2) {
        if (!event2.player.hasSkill("moucunmrfz3")) return false;
        return event2.player.getHistory("useCard", function(evt) {
          return evt.getParent("phaseUse") == event2;
        }).length > 0;
      },
      async content(event2, trigger2, player2) {
        var list = [];
        player2.logSkill("moucunmrfz");
        trigger2.player.getHistory("useCard", function(evt) {
          if (evt.getParent("phaseUse") == trigger2) list.add(get.type2(evt.card));
        });
        player2.draw(list.length);
        if (list.length > 2) {
          player2.addMark("moucunmrfz", 1, false);
        } else {
          event2.finish();
        }
      }
    },
    moucunmrfz3: {
      charlotte: true,
      mark: true,
      intro: {
        content: "银灰前来求学"
      }
    },
    //灵知
    siyongmrfz: {
      audio: 2,
      trigger: {
        player: "loseEnd"
      },
      filter: function(event2, player2) {
        if (event2.getParent()?.name != "useCard" || player2 != _status.currentPhase) return false;
        var list = player2.getStorage("siyongmrfz2");
        for (var i of event2.cards) {
          if (!list.includes(get.suit(i, player2))) return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        if (!player2.storage.siyongmrfz2) player2.storage.siyongmrfz2 = [];
        for (var i of trigger2.cards) player2.storage.siyongmrfz2.add(get.suit(i, player2));
        player2.storage.siyongmrfz2.sort();
        player2.addTempSkill("siyongmrfz2");
        player2.markSkill("siyongmrfz2");
        if (game.hasPlayer(function(current) {
          return current != player2 && current.countCards("he") > 0;
        })) {
          const result2 = await player2.chooseTarget("请选择一名其他角色获得其一张牌", true, function(card, player3, target2) {
            return target2 != player3 && target2.countCards("he") > 0;
          }).set("ai", function(target2) {
            var att = get.attitude(player2, target2);
            if (att >= 0) return 0;
            if (target2.countCards("he", function(card) {
              return get.value(card) > 5;
            }))
              return -att;
            return Math.random();
          }).forResult();
          if (result2.targets) {
            var target = result2.targets[0];
            player2.gainPlayerCard(1, target, "he", true);
          }
        } else {
          player2.draw();
        }
      },
      forced: true
    },
    siyongmrfz2: {
      onremove: true,
      intro: {
        content: "当前已使用花色：$"
      }
    },
    //旧流明
    yijianmrfz: {
      trigger: {
        player: "damageBegin"
      },
      audio: 2,
      forced: true,
      usable: 1,
      async content(event2, trigger2, player2) {
        trigger2.num--;
      }
    },
    weiguangmrfz: {
      audio: "new_weiguangmrfz",
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      forced: true,
      global: ["weiguangmrfz_mark", "weiguangmrfz_losemark"],
      filter: function(event2, player2) {
        return !player2.hasMark("weiguangmrfz_mark");
      },
      async content(event2, trigger2, player2) {
        player2.addMark("weiguangmrfz_mark", 1);
      },
      group: "weiguangmrfz2"
    },
    weiguangmrfz_mark: {
      marktext: "火光",
      intro: {
        name: "火光",
        content: "流明希望人们能有余力擦去脸上的灰尘"
      },
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num + player2.countMark("weiguangmrfz_mark");
        },
        maxHandcard: function(player2, num) {
          return num + player2.countMark("weiguangmrfz_mark");
        }
      },
      trigger: {
        player: "phaseDrawBegin2"
      },
      forced: true,
      filter: function(event2, player2) {
        return player2.hasMark("weiguangmrfz_mark");
      },
      async content(event2, trigger2, player2) {
        trigger2.num += player2.countMark("weiguangmrfz_mark");
      }
    },
    weiguangmrfz_losemark: {
      trigger: {
        player: "phaseJieshuBegin"
      },
      forced: true,
      charlotte: true,
      filter: function(event2, player2) {
        return player2.hasMark("weiguangmrfz_mark");
      },
      async content(event2, trigger2, player2) {
        player2.drawTo(Math.min(5, player2.getHandcardLimit()));
        player2.removeMark("weiguangmrfz_mark", 1);
        player2.logSkill("new_weiguangmrfz");
      }
    },
    weiguangmrfz2: {
      enable: "phaseUse",
      usable: 1,
      filterTarget: true,
      prompt: "选择一名角色令其获得一个“火光”标记并对自己造成一点伤害，若该角色是你，你流失一点体力",
      async content(event2, trigger2, player2) {
        const { target } = event2;
        if (target == player2) {
          player2.loseHp();
        }
        player2.damage();
        target.addMark("weiguangmrfz_mark");
        player2.logSkill("new_weiguangmrfz");
      },
      ai: {
        order: 9,
        result: {
          target: function(player2, target) {
            if (target.countCards("h") > 2) return 5;
            if (player2 == target && player2.getDamagedHp() == 0) return 5;
            return 2;
          }
        },
        threaten: 2
      }
    },
    //斥罪
    zhidianmrfz: {
      audio: 2,
      trigger: {
        global: "roundStart"
      },
      direct: true,
      async content(event2, trigger2, player2) {
        var list = lib.inpile;
        var list2 = [];
        let result2;
        for (var i = 0; i < list.length; i++) {
          var name = list[i];
          if (name == "shan" || name == "wuxie") continue;
          var type = get.type(name);
          if (name == "sha") {
            list2.push(["基本", "", "sha"]);
            list2.push(["基本", "", "sha", "fire"]);
            list2.push(["基本", "", "sha", "thunder"]);
          } else if (type == "basic") {
            list2.push(["基本", "", list[i]]);
          } else if (type == "trick") {
            list2.push(["锦囊", "", list[i]]);
          }
        }
        if (!list.length) return;
        else
          result2 = await player2.chooseButton([get.prompt("zhidianmrfz"), [list, "vcard"]]).set("ai", function(button) {
            switch (button.link[2]) {
              case "wuxie":
                return 0.6 + Math.random();
              case "wuzhong":
              case "dongzhuxianji":
                return 0.5 + Math.random();
              case "guohe":
              case "zhujinqiyuan":
                return 0.4 + Math.random();
              case "sha":
                return 1 + Math.random();
              default:
                return Math.random();
            }
          }).forResult();
        if (result2.bool === true && result2.links) {
          var name = result2.links[0][2];
          player2.logSkill("zhidianmrfz");
          player2.storage.zhidianmrfz = name;
          player2.markSkill("zhidianmrfz");
          game.log(player2, "声明了", "#g" + get.translation(name));
        }
      },
      intro: {
        content: "已声明【$】"
      },
      group: ["zhidianmrfz_use"]
    },
    zhidianmrfz_use: {
      trigger: {
        global: "useCard1"
      },
      silent: true,
      forced: true,
      charlotte: true,
      popup: false,
      firstDo: true,
      filter: function(event2, player2) {
        return event2.card.name == player2.storage.zhidianmrfz;
      },
      async content(event2, trigger2, player2) {
        var target = trigger2.player;
        if (target == player2) {
          player2.chooseToDiscard("he", true, 1);
          player2.logSkill("zhidianmrfz");
        } else {
          if (target.countCards("he") == 0) event2._result = { index: 1 };
          else {
            var str = get.translation(player2);
            const { index } = await target.chooseControl().set("choiceList", ["交给" + str + "一张牌", "失去一点体力"]).forResult();
            if (target !== player2) {
              player2.logSkill("zhidianmrfz");
              if (index === 0) {
                const { cards } = await target.chooseCard("he", true);
                if (cards) target.give(cards, player2, true);
              } else {
                target.loseHp();
              }
            }
          }
        }
      }
    },
    pijimrfz: {
      audio: 2,
      trigger: {
        player: "damageEnd"
      },
      filter: function(event2, player2) {
        if (event2.source == player2) return false;
        return event2.source != void 0;
      },
      forced: true,
      logTarget: "source",
      async content(event2, trigger2, player2) {
        var num = player2.maxHp - player2.hp;
        if (num < 2) trigger2.source.damage();
        if (num > 1) trigger2.source.damage(2);
      },
      ai: {
        maixie_defend: true,
        effect: {
          target: function(card, player2, target) {
            if (player2.hasSkillTag("jueqing", false, target)) return [1, -1];
            return 0.8;
          }
        }
      }
    },
    //泥岩
    wotumrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (!event2.cards) return false;
        return event2.cards.length == 0 && !player2.hasSkill("wotumrfz_ban");
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        player2.changeHujia();
        player2.addTempSkill("wotumrfz_ban", {
          global: "roundStart"
        });
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    sutumrfz: {
      audio: 2,
      trigger: {
        player: "useCardAfter"
      },
      filter: function(event2, player2) {
        if (!event2.card.isCard) return false;
        if (player2.countCards("h") !== player2.hp) return false;
        return event2.cards && event2.cards.length == 1;
      },
      async content(event2, trigger2, player2) {
        var list = [];
        for (var i = 0; i < lib.inpile.length; i++) {
          var name = lib.inpile[i];
          if (name == "sha") {
            list.push(["基本", "", "sha"]);
            for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
          } else if (get.type(name) == "basic") list.push(["基本", "", name]);
          else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
        }
        const result2 = await player2.chooseButton(["塑土", [list, "vcard"]], true).set("ai", function(button) {
          var player3 = _status.event.getParent().player, card = {
            name: button.link[2],
            nature: button.link[3]
          };
          if (game.hasPlayer(function(current) {
            return current != player3 && get.attitude(player3, current) < 0 && current.countCards("he") > 0 && get.distance(player3, current) < 2;
          }))
            return "shunshou";
          if (game.hasPlayer(function(current) {
            return current != player3 && get.attitude(player3, current) < 0 && current.countCards("he") == 0 && player3.inRange(current);
          }))
            return "sha";
          return player3.getUseValue(card, null, true) * _status.event.att;
        }).set("att", get.attitude(event2.target, player2) > 0 ? 1 : -1).forResult();
        if (result2.links) {
          var name = result2.links[0][2];
          player2.chooseUseTarget({ name, isCard: true }, true);
        }
      }
    },
    //澄闪
    dianyongmrfz: { audio: 2 },
    fuxiemrfz: { audio: 2 },
    dianshanmrfz: {
      mark: true,
      locked: true,
      zhuanhuanji: true,
      marktext: "☯",
      intro: {
        content: function(storage, player2, skill) {
          if (player2.storage.dianshanmrfz !== true)
            return "锁定技，当你成为其他角色使用的黑色牌的目标时,你对一名其他角色造成一点雷属性伤害";
          return "锁定技，当你成为其他角色使用的黑色牌的目标时,你弃置一名其他角色一张牌。";
        }
      },
      audio: "dianyongmrfz",
      trigger: {
        target: "useCardToTargeted"
      },
      forced: true,
      filter: function(event2, player2) {
        if (game.hasPlayer(function(current) {
          return current != player2 && !current.countCards("he");
        }) && player2.storage.dianshanmrfz !== true)
          return false;
        return player2 != event2.player && get.color(event2.card) == "black";
      },
      async content(event2, trigger2, player2) {
        let result2;
        player2.changeZhuanhuanji("dianshanmrfz");
        if (player2.storage.dianshanmrfz == true) {
          result2 = await player2.chooseTarget(get.prompt("dianshanmrfz"), "对一名其他角色造成一点雷属性伤害", true, function(card, player3, target) {
            return target != player3;
          }).set("ai", (target) => -get.attitude(player2, target)).forResult();
        } else {
          result2 = await player2.chooseTarget(get.prompt("dianshanmrfz"), "弃置一名其他角色一张牌", true, function(card, player3, target) {
            return target != player3;
          }).set("ai", (target) => -get.attitude(player2, target)).forResult();
        }
        if (result2.bool && result2.targets) {
          if (player2.storage.dianshanmrfz == true) {
            result2.targets[0].damage("thunder");
          } else {
            player2.discardPlayerCard(result2.targets[0], 1, "he", true);
          }
        }
      }
    },
    shidemrfz: {
      audio: "fuxiemrfz",
      direct: true,
      trigger: {
        player: ["useCard", "respond", "loseAfter"]
      },
      filter: function(event2, player2) {
        if (event2.name != "lose") return true;
        if (event2.type != "discard") return false;
        if (event2.cards2) {
          for (var i = 0; i < event2.cards2.length; i++) {
            return true;
          }
        }
        return false;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        if (player2.isLinked()) player2.link(false);
        else player2.link();
      },
      group: "shidemrfz_draw",
      subSkill: {
        draw: {
          audio: "shidemrfz",
          forced: true,
          trigger: { player: "linkAfter" },
          filter: function(event2, player2) {
            return !player2.isLinked();
          },
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        }
      }
    },
    //w
    fukemrfz: {
      trigger: {
        player: "gainAfter"
      },
      filter: function(event2, player2) {
        if (!game.hasPlayer(function(current) {
          return current != player2 && current.countCards("he") > 0;
        }))
          return false;
        return event2.getParent(3).name != "fukemrfz";
      },
      audio: 2,
      direct: true,
      async content(event2, trigger2, player2) {
        var num = trigger2.cards.length;
        const result2 = await player2.chooseTarget(
          get.prompt("fukemrfz"),
          "获得至多" + get.translation(num) + "名角色的各一张牌，然后弃置等量的牌",
          [1, num],
          function(card, player3, target) {
            return target.countCards("he") > 0 && player3 != target;
          },
          function(target) {
            var att = get.attitude(_status.event.player, target);
            if (target.hasSkill("tuntian")) return att / 10;
            return 1 - att;
          }
        ).forResult();
        if (result2.bool && result2.targets) {
          var num2 = result2.targets.length;
          result2.targets.sortBySeat();
          player2.logSkill("fukemrfz", result2.targets);
          player2.chooseToDiscard(num2, true, "he");
          player2.gainMultiple(result2.targets, "he");
        }
      },
      ai: {
        threaten: 1.6,
        expose: 0.2
      }
    },
    zhumengmrfz: {
      audio: 2,
      direct: true,
      trigger: {
        global: "roundStart"
      },
      firstDo: true,
      forced: true,
      async content(event2, trigger2, player2) {
        player2.removeMark("zhumengmrfz3", player2.countMark("zhumengmrfz3"));
        player2.unmarkSkill("zhumengmrfz2");
      }
    },
    zhumengmrfz2: {
      trigger: {
        global: "roundStart"
      },
      intro: {
        content: function(storage) {
          return get.translation(storage) + "牌";
        }
      },
      audio: 2,
      async content(event2, trigger2, player2) {
        const result2 = await player2.judge().forResult();
        if (!result2.card) return;
        const card = result2.card;
        player2.markSkill("zhumengmrfz2");
        if (get.type(card) !== "delay") {
          player2.storage.zhumengmrfz2 = get.type(card);
        } else {
          player2.storage.zhumengmrfz2 = "trick";
        }
        player2.addMark("zhumengmrfz3", get.number(card));
        player2.logSkill("zhumengmrfz");
      }
    },
    zhumengmrfz3: {
      marktext: "梦",
      intro: {
        name: "梦",
        content: "萨卡兹的命运应该掌握在自己手中"
      },
      audio: "zhumengmrfz",
      trigger: {
        player: ["useCard", "respond"]
      },
      filter: function(event2, player2) {
        if (player2.storage.zhumengmrfz2 == "trick" && get.type(event2.card) == "delay") return true;
        return get.type(event2.card) == player2.storage.zhumengmrfz2 && player2.countMark("zhumengmrfz3") > 0;
      },
      frequent: true,
      prompt: "是否摸一张牌",
      async content(event2, trigger2, player2) {
        player2.removeMark("zhumengmrfz3");
        player2.draw();
      },
      group: ["zhumengmrfz2", "zhumengmrfz"]
    },
    //浊心斯卡蒂
    /**
     * @description
     */
    qianximrfz: {
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      derivation: ["qianximrfz_ban"],
      forced: true,
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      async content(event2, trigger2, player2) {
        var characterlist = [];
        for (var i = 0; i < game.players.length; i++) {
          var players = game.players[i];
          if (players == player2) continue;
          characterlist.push(players.name);
        }
        if (!lib.config.isNoLimted_mrfz) {
          characterlist.remove("amiyamrfz");
          characterlist.remove("baocunzhemrfz");
        }
        var skills = [];
        for (var i of characterlist) {
          skills.addArray(lib.character[i][3]);
        }
        if (!characterlist.length || !skills.length) {
          event2.finish();
          return;
        }
        if (player2.isUnderControl()) {
          game.swapPlayerAuto(player2);
        }
        var switchToAuto = function() {
          _status.imchoosing = false;
          event2._result = {
            bool: true,
            skills: skills.randomGets(2)
          };
          if (event2.dialog) event2.dialog.close();
          if (event2.control) event2.control.close();
        };
        var chooseButton = function(list, skills2) {
          var event3 = _status.event;
          if (!event3._result) event3._result = {};
          event3._result.skills = [];
          var rSkill = event3._result.skills;
          var dialog = ui.create.dialog("请获得两个技能", [list, "character"], "hidden");
          event3.dialog = dialog;
          var table = document.createElement("div");
          table.classList.add("add-setting");
          table.style.margin = "0";
          table.style.width = "100%";
          table.style.position = "relative";
          for (var i2 = 0; i2 < skills2.length; i2++) {
            var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.link = skills2[i2];
            table.appendChild(td);
            td.innerHTML = "<span>" + get.translation(skills2[i2]) + "</span>";
            td.addEventListener(lib.config.touchscreen ? "touchend" : "click", function() {
              if (_status.dragged) return;
              if (_status.justdragged) return;
              _status.tempNoButton = true;
              setTimeout(function() {
                _status.tempNoButton = false;
              }, 500);
              var link = this.link;
              if (!this.classList.contains("bluebg")) {
                if (rSkill.length >= 2) return;
                rSkill.add(link);
                this.classList.add("bluebg");
              } else {
                this.classList.remove("bluebg");
                rSkill.remove(link);
              }
            });
          }
          dialog.content.appendChild(table);
          dialog.add("　　");
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
          for (var i2 = 0; i2 < event3.dialog.buttons.length; i2++) {
            event3.dialog.buttons[i2].classList.add("selectable");
          }
          game.pause();
          game.countChoose();
        };
        if (event2.isMine()) {
          chooseButton(characterlist, skills);
        } else if (event2.isOnline()) {
          event2.player.send(chooseButton, characterlist, skills);
          event2.player.wait();
          game.pause();
        } else {
          switchToAuto();
        }
        var map = event2.result || result;
        if (map && map.skills && map.skills.length) {
          for (var i of map.skills) player2.addSkillLog(i);
        }
        game.broadcastAll(function(list) {
          game.expandSkills(list);
          for (var i2 of list) {
            var info = lib.skill[i2];
            if (!info) continue;
            if (!info.audioname2) info.audioname2 = {};
            info.audioname2.old_yuanshu = "weidi";
          }
        }, map.skills);
      }
    },
    //斯卡蒂
    geyaomrfz: {
      audio: 2,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.draw("visible").forResult();
        if (!result2.cards) return;
        var card = result2.cards[0];
        if (get.type(card) == "equip") {
          player2.addTempSkill("geyaomrfz_e");
        }
        if (get.type(card) == "trick" || get.type(card) == "delay") {
          player2.addTempSkill("geyaomrfz_t");
        }
        if (get.type(card) == "basic") {
          player2.addTempSkill("geyaomrfz_b");
        }
        game.log(player2, "展示了一张", get.type(card), "牌");
      }
    },
    geyaomrfz_e: {
      mod: {
        targetInRange: function(card, player2, target, now) {
          if (card.name == "sha") return true;
        },
        selectTarget: function(card, player2, range) {
          if (card.name == "sha" && range[1] != -1) range[1] = Infinity;
        }
      },
      charlotte: true
    },
    geyaomrfz_t: {
      trigger: {
        player: "useCard"
      },
      forced: true,
      charlotte: true,
      filter: function(event2, player2) {
        return event2.card.name == "sha";
      },
      async content(event2, trigger2, player2) {
        trigger2.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player2;
          })
        );
      },
      ai: {
        directHit_ai: true
      }
    },
    geyaomrfz_b: {
      trigger: {
        player: "useCardToPlayered"
      },
      frequent: true,
      filter: function(event2, player2) {
        return event2.card.name == "sha" && event2.target.countCards("h") > 0;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) < 0;
      },
      async content(event2, trigger2, player2) {
        var color = get.color(trigger2.card);
        player2.gainPlayerCard(trigger2.target, "h", "visible").set("color", color).set("filterButton", function(button) {
          var evt = _status.event;
          return get.color(button.link, evt.target) != evt.color;
        });
        player2.logSkill("geyaomrfz", trigger2.target);
      }
    },
    zhangenmrfz: {
      audio: 2,
      trigger: {
        player: "useCardAfter"
      },
      filter: function(event2, player2) {
        if (player2.countCards("h") == 0) return false;
        return event2.card.name == "sha" && player2.getHistory("sourceDamage").length > 0;
      },
      check: function(event2, player2) {
        return player2.getCardUsable("sha") == 0 && player2.countCards("h", function(card) {
          return card.name == "sha";
        }) > 0;
      },
      async content(event2, trigger2, player2) {
        player2.chooseToDiscard("h", 1, true);
        trigger2.addCount = false;
        if (player2.stat[player2.stat.length - 1].card.sha > 0) {
          player2.stat[player2.stat.length - 1].card.sha--;
        }
      }
    },
    //缄默德克萨斯
    yushimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseDrawBegin2" },
      async content(event2, trigger2, player2) {
        var num = 8 - game.roundNumber;
        trigger2.num = Math.max(3, num);
      }
    },
    laoyingmrfz: {
      audio: 2,
      usable: 1,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        return event2.card && event2.getParent("phaseUse") && //@ts-ignore
        event2.getParent("phaseUse").player == player2 && get.itemtype(event2.cards) == "cards" && get.position(event2.cards[0], true) == "o";
      },
      async content(event2, trigger2, player2) {
        player2.gain(trigger2.cards, "gain2");
        var cardu = { name: trigger2.card.name, isCard: true };
        if (get.type(cardu) == "basic") player2.addTempSkill("laoyingmrfz_basic");
        else player2.addTempSkill("laoyingmrfz_trick");
      },
      subSkill: {
        basic: {
          charlotte: true,
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + 1;
            }
          }
        },
        trick: {
          audio: "laoyingmrfz",
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return get.type2(event2.card) == "trick";
          },
          forced: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            trigger2.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player2;
              })
            );
            player2.removeSkill("laoyingmrfz_trick");
          },
          ai: {
            directHit_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              return get.type2(arg.card) == "trick";
            }
          }
        }
      }
    },
    //玛恩纳
    xunlumrfz: {
      audio: 2,
      group: ["xunlumrfz_draw", "xunlumrfz_sha", "xunlumrfz_h"],
      intro: {
        content: function(storage, player2, skill) {
          return "数字：<span class=thundertext>" + player2.storage.xunlumrfz_draw + "</span> <span class=firetext>" + player2.storage.xunlumrfz_sha + "</span> <span class=greentext>" + player2.storage.xunlumrfz_h + "</span></br>本回合杀的数量：" + player2.storage.xunlumrfz_sha2 + "</br>本回合手牌上限：" + player2.storage.xunlumrfz_h2 + (player2.storage.xunlumrfz2 ? "</br>已修改【寻路】" : "");
        }
      },
      mark: true,
      onremove: true,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        if (player2.storage.xunlumrfz_draw + player2.storage.xunlumrfz_sha + player2.storage.xunlumrfz_h < 12) return true;
        return false;
      },
      async content(event2, trigger2, player2) {
        var list = ["蓝色", "红色", "绿色"];
        const result2 = await player2.chooseControl(list, "cancel2").set("prompt", get.prompt("xunlumrfz")).set(
          "prompt2",
          "令〖寻路〗中的一个数字+1</br>数字：<span class=thundertext>" + player2.storage.xunlumrfz_draw + "</span> <span class=firetext>" + player2.storage.xunlumrfz_sha + "</span> <span class=greentext>" + player2.storage.xunlumrfz_h + "</span>"
        ).set("ai", function() {
          if (player2.storage.xunlumrfz_draw < 4) return 0;
          if (player2.storage.xunlumrfz_draw == 4 && player2.storage.xunlumrfz_sha < 4) return 1;
          if (player2.storage.xunlumrfz_h < 4) return 2;
          return 3;
        }).forResult();
        if (result2.control != "cancel2") {
          if (result2.control == "蓝色") {
            if (player2.storage.xunlumrfz_draw < 4) {
              player2.storage.xunlumrfz_draw++;
            }
          }
          if (result2.control == "红色") {
            if (player2.storage.xunlumrfz_sha < 4) {
              player2.storage.xunlumrfz_sha++;
            }
          }
          if (result2.control == "绿色") {
            if (player2.storage.xunlumrfz_h < 4) {
              player2.storage.xunlumrfz_h++;
            }
          }
          if (result2.control == "修改【寻路】") {
            if (!player2.storage.xunlumrfz2) {
              player2.storage.xunlumrfz2 = true;
            }
          }
          player2.markSkill("xunlumrfz");
        }
      }
    },
    //m-n
    //Math.random()*(n-m)+m;
    xunlumrfz_draw: {
      init: function(player2) {
        player2.storage.xunlumrfz_draw = 1;
        player2.syncStorage("xunlumrfz_draw");
      },
      onremove: true,
      audio: 2,
      trigger: { player: "phaseDrawBegin2" },
      forced: true,
      async content(event2, trigger2, player2) {
        var num = game.RDNbet(player2.storage.xunlumrfz_draw, 6);
        trigger2.num = Math.min(num, 6);
        player2.logSkill("xunlumrfz");
        player2.chat("可出" + player2.storage.xunlumrfz_sha2 + "张杀</br>手牌上限为：" + player2.storage.xunlumrfz_h2);
      }
    },
    xunlumrfz_sha: {
      init: function(player2) {
        player2.storage.xunlumrfz_sha = 0;
        player2.syncStorage("xunlumrfz_sha");
      },
      onremove: true,
      trigger: { player: "phaseZhunbeiBegin" },
      forced: true,
      charlotte: true,
      firstDo: true,
      async content(event2, trigger2, player2) {
        player2.addTempSkill("xunlumrfz_sha2", {
          player: "phaseZhunbeiBegin"
        });
        player2.storage.xunlumrfz_sha2 = game.RDNbet(player2.storage.xunlumrfz_sha, 5);
        player2.logSkill("xunlumrfz");
      }
    },
    xunlumrfz_sha2: {
      init: function(player2) {
        player2.storage.xunlumrfz_sha2 = 0;
        player2.syncStorage("xunlumrfz_sha2");
      },
      onremove: true,
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return Math.min(player2.storage.xunlumrfz_sha2, 5);
        }
      }
    },
    xunlumrfz_h: {
      init: function(player2) {
        player2.storage.xunlumrfz_h = 3;
        player2.syncStorage("xunlumrfz_h");
      },
      onremove: true,
      trigger: { player: "phaseZhunbeiBegin" },
      forced: true,
      charlotte: true,
      async content(event2, trigger2, player2) {
        player2.addTempSkill("xunlumrfz_h2", {
          player: "phaseZhunbeiBegin"
        });
        player2.storage.xunlumrfz_h2 = game.RDNbet(player2.storage.xunlumrfz_h, 8);
      }
    },
    xunlumrfz_h2: {
      init: function(player2) {
        player2.storage.xunlumrfz_h2 = 0;
        player2.syncStorage("xunlumrfz_h2");
      },
      onremove: true,
      mod: {
        maxHandcard: function(player2, num) {
          return player2.storage.xunlumrfz_h2;
        }
      }
    },
    xunlumrfz2: {
      charlotte: true
    },
    //耀骑士临光
    zhuguangmrfz: {
      derivation: "zhuguangmrfz_rewrite",
      audio: 2,
      audioname: ["linguangmrfz"],
      trigger: { player: "phaseZhunbeiAfter" },
      filter: function(event2, player2) {
        return !player2.storage.zhuguangmrfz_change;
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget("选择一名其他角色，视为对其使用【决斗】", function(card, player3, target2) {
          return target2 != player3;
        }).set("ai", function(target2) {
          return -get.attitude(_status.event.player, target2);
        }).forResult();
        player2.addSkill("zhuguangmrfz2");
        if (result2.bool && result2.targets) {
          var target = result2.targets[0];
          await player2.useCard({ name: "juedou" }, true, target);
        }
        if (player2.hasSkill("zhuguangmrfz2")) player2.removeSkill("zhuguangmrfz2");
      },
      group: "zhuguangmrfz_change"
    },
    zhuguangmrfz2: {
      audio: false,
      silent: true,
      trigger: { source: "damageBegin2" },
      filter: function(event2, player2, card) {
        return event2.card.name == "juedou";
      },
      prompt: function(event2, player2) {
        if (!player2.storage.zhuguangmrfz_change) return "是否防止此伤害并选择一项";
        return "是否发动【逐光】";
      },
      frequent: function(event2, player2) {
        if (!player2.storage.zhuguangmrfz_change) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        if (!player2.storage.zhuguangmrfz_change) trigger2.cancel();
        var list = [];
        if (!player2.storage.kuanmrfz && player2.hasSkill("kuanmrfz")) list.add("修改【苦暗】");
        if (!player2.storage.zhuguangmrfz_change) list.add("修改【逐光】");
        if (!player2.storage.zhuguangmrfz_change) list.add("摸一张牌");
        if (player2.storage.zhuguangmrfz_change) list.add("摸两张牌");
        if (list.length == 1) {
          player2.draw(player2.storage.zhuguangmrfz_change ? 2 : 1);
          player2.logSkill("zhuguangmrfz");
          return;
        } else {
          list.add("cancel2");
          const result2 = await player2.chooseControl(list).set("prompt", get.prompt("zhuguangmrfz")).set("prompt2", "选择一项").set("ai", function() {
            if (!player2.storage.zhuguangmrfz_change) return 1;
            if (!player2.storage.kuanmrfz && player2.hasSkill("kuanmrfz")) return 0;
            return [0, 1].randomGet();
          }).forResult();
          if (result2.control != "cancel2") {
            player2.logSkill("zhuguangmrfz");
            if (result2.control == "修改【苦暗】") {
              player2.storage.kuanmrfz = true;
            }
            if (result2.control == "修改【逐光】") {
              player2.storage.zhuguangmrfz_change = true;
            }
            if (result2.control == "摸一张牌") {
              player2.draw();
            }
            if (result2.control == "摸两张牌") {
              player2.draw(2);
            }
          }
        }
      }
    },
    zhuguangmrfz_change: {
      audio: "zhuguangmrfz",
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.storage.zhuguangmrfz_change;
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget("选择一名其他角色，视为对其使用【决斗】，且此决斗不可响应", function(card, player3, target2) {
          return target2 != player3;
        }).set("ai", function(target2) {
          return -get.attitude(_status.event.player, target2);
        }).forResult();
        player2.addSkill(["zhuguangmrfz2", "zhuguangmrfz3"]);
        if (result2.bool && result2.targets) {
          var target = result2.targets[0];
          await player2.useCard({ name: "juedou", zhuguangmrfz: true }, true, target);
        }
        if (player2.hasSkill("zhuguangmrfz2")) player2.removeSkill("zhuguangmrfz2");
        if (player2.hasSkill("zhuguangmrfz3")) player2.removeSkill("zhuguangmrfz3");
      }
    },
    zhuguangmrfz3: {
      trigger: {
        player: "useCard"
      },
      forced: true,
      charlotte: true,
      silent: true,
      filter: function(event2, player2) {
        return event2.card.name == "juedou" && event2.card.zhuguangmrfz == true;
      },
      async content(event2, trigger2, player2) {
        trigger2.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player2;
          })
        );
      },
      ai: {
        directHit_ai: true
      }
    },
    kuanmrfz: {
      audio: 2,
      trigger: { global: "gameDrawAfter" },
      forced: true,
      async content(event2, trigger2, player2) {
        player2.disableEquip("equip1");
        player2.disableEquip("equip2");
        player2.disableEquip("equip3");
        player2.disableEquip("equip4");
        player2.disableEquip("equip5");
        player2.disableJudge();
        player2.draw(3);
      },
      group: ["kuanmrfz2", "kuanmrfz5"],
      mod: {
        ignoredHandcard: function(card, player2) {
          if (get.type(card) == "equip") return true;
        },
        cardDiscardable: function(card, player2, name) {
          if (name == "phaseDiscard" && get.type(card) == "equip") return false;
        }
      }
    },
    kuanmrfz2: {
      audio: 2,
      trigger: { player: "phaseJudgeBefore" },
      forced: true,
      filter: function(event2, player2) {
        return !player2.storage.kuanmrfz;
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.judge(function(card) {
          if (get.suit(card) == "heart") return -2;
          return 1;
        }).forResult();
        if (result2.suit !== "heart") {
          player2.skip("phaseUse");
          game.log(player2, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result2.suit, ",", player2, "跳过出牌阶段");
        } else {
          game.log(player2, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result2.suit, ",判定失败");
        }
        const result_bingliang = await player2.judge(function(card) {
          if (get.suit(card) == "club") return -2;
          return 1;
        }).forResult();
        if (result_bingliang.suit !== "club") {
          player2.skip("phaseDraw");
          game.log(player2, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result_bingliang.suit, ",", player2, "跳过摸牌阶段");
        } else {
          game.log(player2, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result_bingliang.suit, ",判定失败");
        }
      }
    },
    kuanmrfz5: {
      audio: "kuanmrfz",
      enable: ["chooseToRespond", "chooseToUse"],
      filter: function(event2, player2) {
        if (event2.type == "wuxie" || player2.countCards("h", function(card) {
          return get.type(card) == "equip";
        }) == 0)
          return false;
        for (var name of ["sha", "shan", "jiu"]) {
          if (event2.filterCard({ name, isCard: true }, player2, event2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var vcards = [];
          for (var name of ["sha", "shan", "jiu"]) {
            var card = { name, isCard: true };
            if (event2.filterCard(card, player2, event2)) vcards.push(["基本", "", name]);
          }
          var dialog = ui.create.dialog("苦暗", [vcards, "vcard"], "hidden");
          dialog.direct = true;
          return dialog;
        },
        backup: function(links, player2) {
          return {
            filterCard: function(card) {
              return get.type(card) == "equip";
            },
            selectCard: 1,
            viewAs: {
              name: links[0][2],
              isCard: false
            },
            popname: true,
            async precontent(event2, trigger2, player3) {
              player3.logSkill("kuanmrfz");
            }
          };
        },
        prompt: function(links, player2) {
          return "【苦暗】：使用一张【" + get.translation(links[0][2]) + "】";
        }
      },
      ai: {
        order: 3,
        respondSha: true,
        respondShan: true
      }
    },
    shuoguangmrfz: {
      audio: 2,
      trigger: { player: "phaseDiscardBefore" },
      forced: true,
      filter: function(event2, player2) {
        return !player2.storage.shuoguangmrfz;
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
        player2.storage.shuoguangmrfz = true;
      }
    },
    //凯尔希
    yuanlvemrfz: {
      audio: 2,
      trigger: { player: "drawBegin" },
      forced: true,
      filter: function(event2, player2) {
        return event2.getParent(1) && event2.getParent(1).name != "yuanlvemrfz";
      },
      async content(event2, trigger2, player2) {
        let num = 0;
        if (!player2.storage.yuanshimrfz || player2.storage.yuanshimrfz_gain) {
          num = trigger2.num;
        } else {
          num = trigger2.num + 1;
        }
        if (trigger2.parent && trigger2.parent.name !== "phaseDraw") {
          player2.chooseToGuanxing(num);
          player2.draw(num);
        } else {
          player2.chooseToGuanxing(num + 1);
          player2.draw(num + 1);
        }
        trigger2.cancel();
      }
    },
    chonggoumrfz: {
      intro: {
        content: "已修改【重构】。"
      },
      onremove: true,
      audio: 2,
      trigger: { player: "phaseDrawBegin2" },
      filter: function(event2, player2) {
        if (player2.getDamagedHp() == 0 && !player2.storage.chonggoumrfz) return false;
        return player2.countCards("h") >= player2.hp;
      },
      async content(event2, trigger2, player2) {
        player2.chooseToDiscard("h", player2.countCards("h"), true);
        if (!player2.storage.chonggoumrfz) {
          player2.draw(player2.countCards("h") - player2.getDamagedHp());
        } else {
          player2.draw(player2.countCards("h"));
        }
        player2.recover();
      }
    },
    yuanshimrfz: {
      intro: {
        content: "令【远略】中的X+1。"
      },
      onremove: true,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      audio: 3,
      direct: true,
      filter: function(event2, player2) {
        return (event2.name != "phase" || game.phaseNumber == 0) && player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        var hs = player2.getCards("h");
        if (hs.length) player2.addGaintag(hs, "yuanshimrfz");
      },
      group: ["yuanshimrfz_basic", "yuanshimrfz_equip", "yuanshimrfz_trick", "yuanshimrfz_gain"],
      subSkill: {
        basic: {
          audio: "yuanshimrfz",
          trigger: {
            player: "useCard"
          },
          prompt: "是否令此牌不可响应",
          check: function(event2, player2) {
            if (event2.card.name == "sha") return true;
            return false;
          },
          filter: function(event2, player2) {
            if (get.type(event2.card) !== "basic") return false;
            return player2.hasHistory("lose", function(evt) {
              if (event2 != evt.getParent()) return false;
              for (var i in evt.gaintag_map) {
                if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
              }
              return false;
            });
          },
          async content(event2, trigger2, player2) {
            if (!player2.storage.yuanshimrfz_gain) player2.storage.yuanshimrfz_gain = true;
            trigger2.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player2;
              })
            );
          },
          ai: {
            directHit_ai: true
          }
        },
        equip: {
          audio: "yuanshimrfz",
          trigger: { player: "useCard" },
          prompt: "是否摸一张牌",
          filter: function(event2, player2) {
            if (get.type(event2.card) !== "equip" && get.type(event2.card) !== "delay") return false;
            return player2.hasHistory("lose", function(evt) {
              if (event2 != evt.getParent()) return false;
              for (var i in evt.gaintag_map) {
                if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
              }
              return false;
            });
          },
          async content(event2, trigger2, player2) {
            if (!player2.storage.yuanshimrfz_gain) player2.storage.yuanshimrfz_gain = true;
            player2.draw();
          }
        },
        trick: {
          audio: "yuanshimrfz",
          trigger: { player: "useCard" },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.card) + "的目标+1/-1";
          },
          filter: function(event2, player2) {
            if (get.type(event2.card) !== "trick") return false;
            return player2.hasHistory("lose", function(evt) {
              if (event2 != evt.getParent()) return false;
              for (var i in evt.gaintag_map) {
                if (evt.gaintag_map[i].includes("yuanshimrfz")) return true;
              }
              return false;
            });
          },
          async content(event2, trigger2, player2) {
            if (!player2.storage.yuanshimrfz_gain) player2.storage.yuanshimrfz_gain = true;
            var prompt2 = "为" + get.translation(trigger2.card) + "增加或减少一个目标";
            const result2 = await player2.chooseTarget(get.prompt("yuanshimrfz"), function(card, player3, target) {
              var playerx = get.player();
              if (_status.event.targets.includes(target)) return true;
              return lib.filter.targetEnabled2(_status.event.card, playerx, target) && lib.filter.targetInRange(_status.event.card, playerx, target);
            }).set("prompt2", prompt2).set("ai", function(target) {
              var trigger3 = _status.event.getTrigger();
              var player3 = _status.event.player;
              return get.effect(target, trigger3.card, player3, player3) * (_status.event.targets.includes(target) ? -1 : 1);
            }).set("targets", trigger2.targets).set("card", trigger2.card).forResult();
            if (result2.targets) {
              player2.line(result2.targets);
              if (trigger2.targets.includes(event2.targets[0])) trigger2.targets.removeArray(event2.targets);
              else trigger2.targets.addArray(event2.targets);
            }
          }
        },
        gain: {
          audio: "yuanshimrfz",
          trigger: { player: "loseAfter" },
          forced: true,
          filter: function(event2, player2) {
            if (player2.storage.yuanshimrfz || player2.storage.chonggoumrfz) return false;
            return !player2.hasCard(function(card) {
              return card.hasGaintag("yuanshimrfz");
            }, "h");
          },
          async content(event2, trigger2, player2) {
            if (!player2.storage.yuanshimrfz_gain) {
              player2.storage.yuanshimrfz = true;
              player2.markSkill("yuanshimrfz");
            } else {
              player2.storage.chonggoumrfz = true;
              player2.markSkill("chonggoumrfz");
            }
          }
        }
      }
    },
    m3mrfz: {
      audio: 2,
      trigger: {
        player: "dying"
      },
      zhuSkill: true,
      skillAnimation: true,
      animationColor: "red",
      mark: true,
      unique: true,
      limited: true,
      filter: function(event2, player2) {
        if (player2.hp > 0) return false;
        return !player2.storage.m3mrfz;
      },
      init: (player2, skill) => player2.storage[skill] = false,
      check: function(event2, player2) {
        var num = player2.countCards("h", function(card) {
          return card.name == "tao" || card.name == "jiu";
        });
        return player2.hp + num <= 0;
      },
      async content(event2, trigger2, player2) {
        player2.awakenSkill("m3mrfz");
        player2.removeSkill("chonggoumrfz");
        player2.discard(player2.getCards("hej"));
        player2.recoverTo(2);
        player2.storage.m3mrfz = true;
        player2.loseMaxHp();
        player2.turnOver(false);
        player2.link(false);
        let targets = game.players.slice().remove(player2);
        for (let target of targets) {
          const result2 = await target.chooseToDiscard(`【m3】:你可以弃置一张牌并令${get.translation(player2)}摸一张牌`).set("ai", (card) => {
            const player3 = get.player();
            const targetx = get.event().targetx;
            if (get.attitude(player3, targetx) < 0) return -1;
            return 114514 - get.value(card);
          }).set("targetx", player2).forResult();
          if (result2.cards) {
            target.line(player2);
            await player2.draw();
          }
        }
      }
    },
    //山
    zhuangtimrfz: {
      intro: {
        content: "已造成#点伤害"
      },
      audio: 2,
      forced: true,
      direct: true,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        return player2.maxHp < 15;
      },
      async content(event2, trigger2, player2) {
        await player2.addMark("zhuangtimrfz", trigger2.num);
        var damage = player2.countMark("zhuangtimrfz");
        if (damage > 1) {
          player2.gainMaxHp(Math.floor(damage / 2));
          player2.removeMark("zhuangtimrfz", Math.floor(damage / 2) * 2);
        }
      },
      group: ["zhuangtimrfz_use", "zhuangtimrfz_draw"],
      subSkill: {
        use: {
          audio: "zhuangtimrfz",
          usable: 1,
          enable: "phaseUse",
          filter: function(event2, player2) {
            for (var i of lib.inpile) {
              if (get.type(i) == "trick" && event2.filterCard({ name: i, isCard: true }, player2, event2)) return true;
              if (get.type(i) == "basic" && event2.filterCard({ name: i, isCard: true }, player2, event2)) return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var list = [];
              for (var i of lib.inpile) {
                if (get.type(i) == "trick" && event2.filterCard({ name: i, isCard: true }, player2, event2)) list.push(["锦囊", "", i]);
                if (get.type(i) == "basic" && event2.filterCard({ name: i, isCard: true }, player2, event2)) list.push(["基本", "", i]);
              }
              return ui.create.dialog("壮体", [list, "vcard"]);
            },
            check: function(button) {
              return _status.event.player.getUseValue({
                //@ts-ignore
                name: button.link[2],
                isCard: true
              });
            },
            backup: function(links, player2) {
              return {
                viewAs: {
                  name: links[0][2],
                  isCard: true
                },
                filterCard: () => false,
                selectCard: -1,
                popname: true,
                async precontent(event2, trigger2, player3) {
                  player3.logSkill("zhuangtimrfz");
                  player3.loseMaxHp();
                }
              };
            },
            prompt: function(links, player2) {
              return "请选择" + get.translation(links[0][2]) + "的目标";
            }
          },
          ai: { order: 1, result: { player: 1 } }
        },
        draw: {
          audio: "zhuangtimrfz",
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return false;
          },
          check: function(event2, player2) {
            return player2.hp < 3;
          },
          promt: function(event2, player2) {
            return "是否失去" + player2.getDamagedHp() + "点体力上限，摸" + Math.ceil(player2.getDamagedHp() / 2) + "张牌。";
          },
          async content(event2, trigger2, player2) {
            var num = player2.getDamagedHp();
            player2.loseMaxHp(num);
            player2.draw(Math.ceil(num / 2));
          }
        }
      }
    },
    julimrfz: {
      audio: 2,
      trigger: { source: "damageBegin" },
      filter: function(event2, player2) {
        return player2.getDamagedHp() >= event2.player.hp;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      async content(event2, trigger2, player2) {
        trigger2.num++;
        var card = trigger2.player.countCards("he");
        if (player2.maxHp >= card) {
          const result2 = await player2.chooseControl("确定", "cancel2").set("prompt", "是否失去两点体力上限，令此伤害+1").set("ai", function(event3, player3) {
            if (get.attitude(player3, event3.player) < 0 && player3.maxHp >= 3) return 0;
            return 1;
          }).forResult();
          if (result2.control !== "cancel2") {
            trigger2.num++;
            player2.loseMaxHp(2);
          }
        }
      }
    },
    //歌蕾蒂亚
    xunxiangmrfz: {
      audio: 2,
      usable: 2,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.hasSkill("xunxiangmrfz2")) return false;
        return game.hasPlayer((current) => current.countCards("h") > 0);
      },
      filterTarget: function(card, player2, target) {
        return target.countCards("h") > 0;
      },
      selectTarget: -1,
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        const { targets } = event2;
        var num = [3, 1, 2].randomGet();
        if (num == 1) player2.storage.xunxiangmrfz = "basic";
        if (num == 2) player2.storage.xunxiangmrfz = "trick";
        if (num == 3) player2.storage.xunxiangmrfz = "equip";
        game.log("<span class=thundertext>【寻相】</span>随机的类型为<span class=firetext>", player2.storage.xunxiangmrfz, "牌</span>");
        player2.popup(get.translation(player2.storage.xunxiangmrfz) + "牌");
        targets.sortBySeat();
        var next = player2.chooseCardOL(targets, "请选择要展示的牌", true).set("ai", function(card) {
          return -get.value(card);
        }).set("source", player2);
        next.aiCard = function(target2) {
          var hs = target2.getCards("h");
          return { bool: true, cards: [hs.randomGet()] };
        };
        next._args.remove("glow_result");
        await next;
        var cards = [];
        var num = 0;
        const result2 = next.forResult();
        event2.videoId = lib.status.videoId++;
        for (var i = 0; i < targets.length; i++) {
          cards.push(result2[i].cards[0]);
        }
        event2.cards = cards;
        game.log(player2, "展示了", targets, "的", cards);
        game.broadcastAll(
          function(targets2, cards2, id, player3) {
            var dialog = ui.create.dialog(
              get.translation(player3) + "发动了【寻相】</br><span class=firetext>【寻相】随机声明的类型为" + get.translation(player3.storage.xunxiangmrfz) + "牌</span>",
              cards2
            );
            dialog.videoId = id;
            var getName = function(target2) {
              if (target2._tempTranslate) return target2._tempTranslate;
              var name = target2.name;
              if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
              return get.translation(name);
            };
            for (var i2 = 0; i2 < targets2.length; i2++) {
              dialog.buttons[i2].querySelector(".info").innerHTML = getName(targets2[i2]);
              if (get.type(result2[i2].cards[0]) == player3.storage.xunxiangmrfz) num++;
              if (get.type(result2[i2].cards[0]) == "delay" && player3.storage.xunxiangmrfz == "trick") num++;
            }
          },
          targets,
          cards,
          event2.videoId,
          player2
        );
        game.delay(4);
        if (num == 0) {
          const result3 = await player2.chooseTarget("选择一名其他角色，你与其各流失一点体力", true, function(card, player3, target2) {
            return target2 != player3;
          }).set("ai", (target2) => get.attitude(player2, target2) < 2).forResult();
          if (result3.targets) {
            player2.loseHp();
            var target = result3.targets[0];
            target.loseHp();
          }
        } else {
          player2.addTempSkill("xunxiangmrfz2", "phaseUseEnd");
          player2.draw(num);
        }
        game.broadcastAll("closeDialog", event2.videoId);
      },
      ai: {
        order: 12,
        result: {
          player: 5
        }
      }
    },
    xunxiangmrfz2: {
      //检测用技能，无实际意义。
    },
    ronghangmrfz: {
      audio: 2,
      trigger: { player: "useCard" },
      forced: true,
      getLastUsed: function(player2, event2) {
        var history = player2.getAllHistory("useCard");
        var index;
        if (event2) index = history.indexOf(event2) - 1;
        else index = history.length - 1;
        if (index >= 0) return history[index];
        return false;
      },
      filter: function(event2, player2) {
        var evtcard = event2.card;
        var evt = lib.skill.ronghangmrfz.getLastUsed(player2, event2);
        if (!evt.card || !evt) return false;
        return get.tag(evtcard, "damage") > 0;
      },
      async content(event2, trigger2, player2) {
        var lastcard = lib.skill.ronghangmrfz.getLastUsed(player2, trigger2);
        if (get.cardNameLength(lastcard.card) < get.cardNameLength(trigger2.card)) {
          trigger2.baseDamage++;
          player2.popup("伤害基数+1");
        } else {
          var name = get.name(trigger2.card);
          if (name == "sha") {
            trigger2.addCount = false;
            if (player2.stat[player2.stat.length - 1].card.sha > 0) {
              player2.stat[player2.stat.length - 1].card.sha--;
            }
          } else if (name == "jiu") {
            trigger2.addCount = false;
            if (player2.stat[player2.stat.length - 1].card.jiu > 0) {
              player2.stat[player2.stat.length - 1].card.jiu--;
            }
          }
          trigger2.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player2;
            })
          );
          player2.popup("强中且无限制");
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          var evtcard = lib.skill.ronghangmrfz.getLastUsed(player2, event);
          return get.cardNameLength(evtcard) >= get.cardNameLength(arg.card);
        }
      }
    },
    jingsimrfz: {
      onremove: true,
      intro: { content: "已使用的牌：$" },
      trigger: { player: "useCard" },
      audio: 2,
      frequent: true,
      filter: function(event2, player2) {
        return !player2.getStorage("jingsimrfz").includes(event2.card.name);
      },
      async content(event2, trigger2, player2) {
        player2.draw();
        player2.markAuto("jingsimrfz", [trigger2.card.name]);
      }
    },
    //旧星熊
    banruomrfz: {
      audio: 4,
      onremove: true,
      init: function(player2) {
        player2.storage.banruomrfz = true;
        player2.syncStorage("banruomrfz");
      },
      intro: {
        content: function(storage, player2, skill) {
          if (player2.storage.banruomrfz) return "星熊的巨盾将会保护她和她想保护的人";
          return "盾牌破损，但她并未后退";
        }
      },
      mark: true,
      trigger: { player: "damageBegin3" },
      filter: function(event2, player2) {
        return player2.storage.banruomrfz;
      },
      prompt: "是否取消此次伤害",
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      },
      mod: {
        maxHandcardBase: function(player2, num) {
          if (player2.storage.banruomrfz) return player2.maxHp;
        }
      },
      group: ["banruomrfz_lose", "banruomrfz_draw", "banruomrfz_round", "banruomrfz_atk"],
      subSkill: {
        lose: {
          forced: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return player2.storage.banruomrfz;
          },
          firstDo: true,
          async content(event2, trigger2, player2) {
            player2.storage.banruomrfz = false;
          }
        },
        draw: {
          forced: true,
          popup: false,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return player2.storage.banruomrfz;
          },
          async content(event2, trigger2, player2) {
            trigger2.num--;
          }
        },
        round: {
          forced: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return game.roundNumber > player2.maxHp && player2.storage.banruomrfz;
          },
          async content(event2, trigger2, player2) {
            player2.storage.banruomrfz = false;
            player2.logSkill("banruomrfz");
          }
        },
        atk: {
          forced: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return !player2.storage.banruomrfz;
          },
          async content(event2, trigger2, player2) {
            player2.removeSkill("banruomrfz_atk");
            player2.addSkill("banruomrfz2");
            player2.logSkill("banruomrfz");
          }
        }
      },
      ai: {
        effect: {
          target: function(card, player2, target, current) {
            if (!player2.storage.banruomrfz) return;
            if (get.tag(card, "damage")) return "zerotarget";
            if (get.type(card) == "trick" && get.tag(card, "damage")) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    banruomrfz2: {
      mark: true,
      onremove: true,
      intro: {
        content: "星熊放下了她的盾"
      },
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num += 1;
        }
      },
      group: ["banruomrfz2_damage", "banruomrfz2_lose"],
      subSkill: {
        damage: {
          forced: true,
          usable: 1,
          trigger: { source: "damageBegin" },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.logSkill("banruomrfz");
          }
        },
        lose: {
          forced: true,
          trigger: { global: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("banruomrfz2");
          }
        }
      }
    },
    yizhongmrfz: {
      audio: 2,
      trigger: { global: "damageBegin3" },
      filter: function(event2, player2) {
        return get.distance(player2, event2.player) <= 1 && event2.player != player2 && player2.countCards("he") > 0;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) > 0;
      },
      prompt: function(event2, player2) {
        return "是否弃置一张牌并为" + get.translation(event2.player) + "承担伤害";
      },
      async content(event2, trigger2, player2) {
        player2.chooseToDiscard(true, "he");
        trigger2.cancel();
        player2.damage(trigger2.num, trigger2.source || "nosource", "nocard");
      },
      group: "yizhongmrfz2"
    },
    yizhongmrfz2: {
      trigger: { player: "damageEnd" },
      firstDo: true,
      filter: function(event2, player2) {
        return event2.parent && event2.parent.name == "yizhongmrfz";
      },
      prompt: "是否摸两张牌",
      async content(event2, trigger2, player2) {
        player2.draw(2);
      }
    },
    //卡涅利安
    shazhenmrfz: {
      audio: 2,
      forced: true,
      mark: true,
      init: function(player2) {
        player2.storage.shazhenmrfz = false;
        player2.syncStorage("shazhenmrfz");
      },
      intro: {
        content: function(storage, player2, skill) {
          if (!player2.storage.shazhenmrfz || game.roundNumber == 1)
            return "沙暴环绕着卡涅利安</br>【沙阵】剩余次数：" + (2 - player2.countMark("shazhenmrfz_damage"));
          return "沙暴散去";
        }
      },
      onremove: true,
      trigger: { player: "damageBegin3" },
      filter: function(event2, player2) {
        return (game.roundNumber == 1 || !player2.storage.shazhenmrfz) && player2.countMark("shazhenmrfz_damage") < 2;
      },
      async content(event2, trigger2, player2) {
        trigger2.num--;
        player2.addMark("shazhenmrfz_damage", 1);
      },
      mod: {
        maxHandcardBase: function(player2, num) {
          if (!player2.storage.shazhenmrfz) return num += 2;
        }
      },
      group: ["shazhenmrfz_damage", "shazhenmrfz_clear"],
      subSkill: {
        damage: {
          forced: true,
          silent: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return !event2.player.hasMark("shacanmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.storage.shazhenmrfz = true;
          }
        },
        clear: {
          forced: true,
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.shazhenmrfz || player2.countMark("shazhenmrfz_damage") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.storage.shazhenmrfz = false;
            player2.removeMark("shazhenmrfz_damage", player2.countMark("shazhenmrfz_damage"));
          }
        }
      }
    },
    shacanmrfz: {
      marktext: "噬",
      intro: {
        name: "噬",
        content: function(storage, player2, skill) {
          return "<span class=firetext>食噬之印</span></br>还需交给卡涅利安" + (2 - player2.countMark("shacanmrfz2")) + "张牌即可消除一个‘噬’标记";
        }
      },
      onremove: true,
      trigger: { source: "damageEnd" },
      audio: 2,
      filter: function(event2, player2) {
        return event2.player.isAlive() && event2.player.countMark("shacanmrfz") < 2;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.player) + "获得一个‘噬’标记";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) <= 0;
      },
      async content(event2, trigger2, player2) {
        trigger2.player.addMark("shacanmrfz");
      },
      group: ["shacanmrfz_remove", "shacanmrfz_gain"],
      subSkill: {
        remove: {
          forced: true,
          charlotte: true,
          silent: true,
          trigger: { player: "gainEnd" },
          filter: function(event2, player2) {
            return event2.source && event2.source.isAlive() && event2.source != player2 && event2.source.hasMark("shacanmrfz");
          },
          logTarget: "source",
          async content(event2, trigger2, player2) {
            var target = trigger2.source;
            var num = target.countMark("shacanmrfz2");
            target.addMark("shacanmrfz2", trigger2.cards.length, false);
            if (num > 1) {
              target.removeMark("shacanmrfz", Math.floor(num / 2));
              target.removeMark("shacanmrfz2", Math.floor(num / 2) * 2);
            }
          }
        },
        gain: {
          trigger: { global: "phaseUseBegin" },
          filter: function(event2, player2) {
            return event2.player.hasMark("shacanmrfz") && (player2.getDamagedHp() > 0 || event2.player.countCards("he") > 0);
          },
          direct: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            var target = trigger2.player;
            var list = [];
            if (player2.getDamagedHp() > 0) list.add("回血");
            if (target.countCards("he") > 0) list.add("交牌");
            const result2 = await target.chooseControl(list).set("prompt", "选择一项").set("ai", function(player3) {
              return 0;
            }).forResult();
            if (result2.control == "cancel2") event2.finish();
            if (result2.control == "回血") {
              player2.recover();
              target.removeMark("shacanmrfz");
              player2.logSkill("shacanmrfz");
              event2.finish();
            }
            if (result2.control == "交牌") {
              const resultx = await target.chooseCard(target.countCards("he") > 1 ? 2 : 1, "展示两张牌", true, "he").set("ai", function(card) {
                return get.value(card);
              }).forResult();
              if (resultx.bool && resultx.cards && resultx.cards.length) {
                if (resultx.cards.length == 1) {
                  player2.gain(resultx.cards, target, "give");
                  player2.logSkill("shacanmrfz");
                  return;
                } else {
                  await player2.chooseButton(["选择获得其中的一张牌", result2.cards], true).set("ai", (button) => get.value(button.link)).forResult();
                  player2.gain(result2.links, target, "give");
                  player2.logSkill("shacanmrfz");
                }
              }
            }
          }
        }
      }
    },
    shacanmrfz2: {
      //检测用技能，无实际意义
    },
    shahuanmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card, player2, target) {
        return target != player2 && target.countMark("shacanmrfz") < 1;
      },
      async content(event2, trigger2, player2) {
        event2.target.addMark("shacanmrfz");
      },
      ai: {
        order: 10,
        expose: 0.4,
        result: {
          target: -1
        },
        threaten: 2
      }
    },
    //陈
    danweimrfz: {
      onremove: true,
      intro: {
        content: "已有#个胆"
      },
      audio: 2,
      usable: 2,
      trigger: { global: ["respond", "useCard"] },
      filter: function(event2, player2) {
        if (!event2.respondTo) return false;
        if (player2 != event2.respondTo[0]) return false;
        return event2.cards.filterInD("o").filterInD("d").length > 0;
      },
      logTarget: "player",
      async content(event2, trigger2, player2) {
        var cards = trigger2.cards.filterInD("o").filterInD("d");
        player2.gain(cards, "log", "gain2");
        player2.addMark("danweimrfz");
      },
      group: ["danweimrfz_use"],
      subSkill: {
        use: {
          audio: "danweimrfz",
          trigger: { player: ["respond", "useCard"] },
          usable: 2,
          filter: function(event2, player2) {
            if (!event2.respondTo) return false;
            return event2.cards.filterInD("o").filterInD("d").length > 0;
          },
          logTarget: "player",
          async content(event2, trigger2, player2) {
            var cards = [];
            if (get.itemtype(trigger2.respondTo[1]) == "card") cards.push(trigger2.respondTo[1]);
            else if (trigger2.respondTo[1].cards) cards.addArray(trigger2.respondTo[1].cards);
            cards = cards.filterInD("o").filterInD("d");
            player2.gain(cards, "gain2", "log");
            player2.addMark("danweimrfz");
          }
        }
      }
    },
    hechimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      selectTarget: 1,
      filterTarget: true,
      filter: function(event2, player2) {
        return player2.countMark("danweimrfz") > 0 || player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        let result2;
        if (player2.countCards("h") == 0) result2 = { index: 1 };
        if (player2.countMark("danweimrfz") == 0) result2 = { index: 0 };
        if (player2.countMark("danweimrfz") > 0 && player2.countCards("h") > 0)
          result2 = await player2.chooseControl().set("choiceList", [
            "弃置一张手牌",
            //0
            "失去一个‘胆’"
            //1
          ]).set("ai", function(card) {
            var player3 = _status.event.player;
            if (player3.hasCard(function(card2) {
              return get.value(card2) < 7;
            }, "h"))
              return 0;
            return 1;
          }).forResult();
        if (result2 && result2.index == 0) {
          await player2.chooseToDiscard(true, "h", "弃置一张手牌");
        } else {
          player2.removeMark("danweimrfz");
        }
        if (!target.hasSkill("hechimrfz2")) target.addSkill("hechimrfz2");
        target.addMark("hechimrfz2");
        target.draw(2);
        if (target != player2) player2.draw();
      },
      ai: {
        order: 13
      }
    },
    hechimrfz2: {
      onremove: true,
      mark: true,
      marktext: "斥",
      intro: {
        name: "呵斥",
        content: "受到了陈的*龙门粗口*，手牌上限-#"
      },
      trigger: { player: "phaseDiscardEnd" },
      forced: true,
      charlotte: true,
      silent: true,
      async content(event2, trigger2, player2) {
        player2.removeMark("hechimrfz2", player2.countMark("hechimrfz2"));
        player2.removeSkill("hechimrfz2");
        if (Math.random() < 0.1) player2.logSkill("chencaidanmrfz");
      },
      mod: {
        maxHandcardBase: function(player2, num) {
          return num -= player2.countMark("hechimrfz2");
        }
      }
    },
    jueyingmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.countMark("danweimrfz") >= 5;
      },
      async content(event2, trigger2, player2) {
        player2.removeMark("danweimrfz", 5);
        let num = 0;
        while (num < 2) {
          await player2.chooseUseTarget(
            {
              name: "sha",
              nature: "thunder",
              isCard: true
            },
            "请选择雷【杀】的目标（雷【杀】：" + num + "/2；普通【杀】:0/1）",
            false,
            "nodistance"
          );
          num++;
        }
        player2.chooseUseTarget(
          {
            name: "sha",
            isCard: true
          },
          "请选择【杀】的目标（雷【杀】：2/2；普通【杀】:1/1）",
          false,
          "nodistance"
        );
      }
    },
    chencaidanmrfz: {
      //彩蛋
      audio: 3
    },
    newjingsimrfz: {
      audio: 2,
      zhuSkill: true,
      trigger: { global: "useCardToTarget" },
      filter: function(event2, player2) {
        if (player2.hasSkill("newjingsimrfz_ban")) return false;
        if (event2.targets.length > 1) return false;
        if (event2.player == player2 || event2.target == player2 || event2.source == player2 || player2 == _status.currentPhase) return false;
        return event2.card.name == "sha" || event2.card.name == "juedou";
      },
      direct: true,
      async content(event2, trigger2, player2) {
        var target = trigger2.target;
        trigger2.card;
        const result2 = await target.chooseBool("【警司】：是否请求将此" + get.translation(trigger2.card) + "的目标改为" + get.translation(player2) + "?").set("ai", function() {
          var player3 = _status.event.player, target2 = _status.event.getTrigger().player;
          return get.attitude(player3, target2) > 2;
        }).forResult();
        if (result2.bool) {
          const { bool } = await player2.chooseBool(
            "【警司】：是否接受" + get.translation(trigger2.player) + "的请求，令" + get.translation(trigger2.card) + "的目标改为你？"
          ).set("ai", function() {
            var player3 = _status.event.player, target2 = _status.event.getTrigger().player;
            var nametmp = _status.event.name;
            if (nametmp == "sha" && player3.countCards("h", function(card) {
              return card.name == "shan";
            }) < 1)
              return false;
            if (nametmp == "juedou" && player3.countCards("h", function(card) {
              return card.name == "sha";
            }) < 2)
              return false;
            if (player3.hp < 3) return false;
            return get.attitude(player3, target2) > 2;
          }).set("name", trigger2.card.name).forResult();
          if (bool === true) {
            player2.draw();
            player2.addMark("danweimrfz");
            player2.addTempSkill("newjingsimrfz_ban", "phaseEnd");
            var target = trigger2.target;
            trigger2.targets.remove(target);
            trigger2.getParent().triggeredTargets1.remove(target);
            trigger2.untrigger();
            game.delayx();
            trigger2.targets.push(player2);
            trigger2.player.line(player2, "fire");
            game.log(trigger2.card, "的目标被改为", player2);
            player2.logSkill("newjingsimrfz");
          }
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    //新艾雅法拉
    luanhuomrfz: {
      onremove: true,
      marktext: "火",
      intro: {
        name: "乱火",
        content: "本轮已执行回合数：#"
      },
      audio: 2,
      trigger: { player: "damageBegin2" },
      filter: function(event2, player2) {
        return event2.nature == "fire";
      },
      forced: true,
      direct: true,
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      },
      ai: {
        nofire: true,
        effect: {
          target: function(card, player2, target, current) {
            if (get.tag(card, "fireDamage")) return "zerotarget";
          }
        }
      },
      group: ["luanhuomrfz_fire", "luanhuomrfz_times", "luanhuomrfz_clear", "luanhuomrfz_damage"],
      subSkill: {
        fire: {
          audio: "luanhuomrfz",
          trigger: { source: "damageBegin" },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.nature != "fire";
          },
          async content(event2, trigger2, player2) {
            trigger2.cancel();
            trigger2.player.damage(trigger2.num, player2, "fire");
          }
        },
        times: {
          forced: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseBegin" },
          async content(event2, trigger2, player2) {
            player2.addMark("luanhuomrfz");
          }
        },
        clear: {
          forced: true,
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.countMark("luanhuomrfz") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("luanhuomrfz", player2.countMark("luanhuomrfz"));
          }
        },
        damage: {
          audio: "luanhuomrfz",
          trigger: { player: "phaseZhunbeiBegin" },
          async content(event2, trigger2, player2) {
            var num = player2.countMark("luanhuomrfz");
            var str1 = "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害";
            var str2 = "对一名其他角色造成" + get.cnNumber(num, true) + "点伤害";
            if (num == 1) {
              const { targets } = await player2.chooseTarget(get.prompt2("luanhuomrfz"), function(card, player3, target) {
                return player3 != target;
              }).set("ai", function(target) {
                var player3 = _status.event.player;
                return get.damageEffect(target, player3, player3);
              }).forResult();
              if (targets) targets[0].damage();
            } else {
              const { control } = await player2.chooseControl(str1, str2).set("ai", function(event3, player3) {
                if (num > 2) return 0;
                return 1;
              }).forResult();
              if (control === str1 && num > 1) {
                player2.storage.luanhuomrfz_damage = true;
                let { targets } = await player2.chooseTarget(
                  [1, num],
                  "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害",
                  function(card, player3, target) {
                    return player3 != target;
                  }
                ).set("ai", function(target) {
                  var player3 = _status.event.player;
                  return get.damageEffect(target, player3, player3);
                }).forResult();
                if (!targets) return;
                for (var i = 0; i < targets.length; i++) targets[i].damage(player2);
              } else if (control === str2 && num > 1) {
                player2.storage.luanhuomrfz_damage = false;
                let { targets } = await player2.chooseTarget("对一名其他角色造成" + get.cnNumber(num, true) + "点伤害", function(card, player3, target) {
                  return player3 != target;
                }).set("ai", function(target) {
                  var player3 = _status.event.player;
                  return get.damageEffect(target, player3, player3);
                }).forResult();
                if (!targets) return;
                targets[0].damage(num);
              }
            }
          }
        }
      }
    },
    qingyanmrfz: {
      audio: 2,
      trigger: { player: "phaseUseEnd" },
      filter: function(event2, player2) {
        if (player2.hasMark("qingyanmrfz")) return false;
        return player2.getHistory("useCard", function(evt) {
          return evt.getParent("phaseUse") == event2;
        }).length > 0;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        var list = [];
        player2.getHistory("useCard", function(evt) {
          if (evt.getParent("phaseUse") == trigger2) list.add(get.type2(evt.card));
        });
        if (list.length >= 3) {
          const result2 = await player2.chooseBool("【勤研】：是否于本回合结束后额外执行一个回合？").forResult();
          if (!result2.bool) return;
          player2.insertPhase();
          player2.addMark("qingyanmrfz", 1);
          player2.logSkill("qingyanmrfz");
        }
      },
      group: "qingyanmrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.hasMark("qingyanmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("qingyanmrfz", player2.countMark("qingyanmrfz"));
          }
        }
      }
    },
    //傀影
    xuyingmrfz: {
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards = player2.getExpansions(skill);
        if (cards.length) player2.loseToDiscardpile(cards);
      },
      audio: 2,
      trigger: { player: "useCard" },
      direct: true,
      notemp: true,
      filter: function(event2, player2) {
        if (event2.xuyingmrfz_buff || !event2.targets.length || player2.hasSkill("xuyingmrfz_buff")) return false;
        var type = get.type(event2.card, false);
        if (type != "basic" && type != "trick" && player2.getExpansions("xuyingmrfz").length > 0) return false;
        return player2.getExpansions("xuyingmrfz").filter(function(magic) {
          return get.type2(magic) != get.type2(event2.card);
        }).length;
      },
      async content(event2, trigger2, player2) {
        var cards = player2.getExpansions("xuyingmrfz").filter(function(magic) {
          return get.type2(magic) != get.type2(trigger2.card);
        });
        if (!cards.length) return;
        const { links } = await player2.chooseButton(["你可以选择移去一张与你使用的牌类型不同的“虚影”，令此牌结算两次", cards]).forResult();
        if (links) {
          player2.logSkill("xuyingmrfz");
          player2.loseToDiscardpile(links);
          player2.addTempSkill("xuyingmrfz_buff", "phaseUseAfter");
          trigger2.xuyingmrfz_buff = player2;
        }
      },
      group: ["xuyingmrfz_discard", "xuyingmrfz_judge"],
      subSkill: {
        discard: {
          audio: "xuyingmrfz",
          trigger: { global: "loseAfter" },
          filter: function(event2, player2) {
            if (event2.type != "discard" || event2.getlx === false) return false;
            if (player2.getExpansions("xuyingmrfz").length >= 3) return false;
            var cards = event2.cards.slice(0);
            event2.getl(player2);
            for (var i = 0; i < cards.length; i++) {
              if (cards[i].original != "j" && get.suit(cards[i], event2.player) == "spade" && get.position(cards[i], true) == "d") {
                return true;
              }
            }
            return false;
          },
          direct: true,
          async content(event2, trigger2, player2) {
            if (trigger2.delay == false) game.delay();
            var cards = [], cards2 = trigger2.cards.slice(0);
            trigger2.getl(player2);
            var num = player2.getExpansions("xuyingmrfz").length;
            for (var i = 0; i < cards2.length; i++) {
              if (cards2[i].original != "j" && get.suit(cards2[i], trigger2.player) == "spade" && get.position(cards2[i], true) == "d") {
                cards.push(cards2[i]);
              }
            }
            let result2;
            if (cards.length && num + cards.length <= 3) {
              result2 = await player2.chooseButton(["虚影：选择置于武将牌上的牌", cards], [1, cards.length]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              }).forResult();
            } else if (cards.length) {
              result2 = await player2.chooseButton(["虚影：选择置于武将牌上的牌", cards], [1, 3 - num]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              }).forResult();
            }
            if (result2 && result2.bool && result2.links && result2.links.length) {
              player2.logSkill("xuyingmrfz");
              player2.addToExpansion(result2.links, player2, "giveAuto").gaintag.add("xuyingmrfz");
            }
          }
        },
        judge: {
          audio: 2,
          trigger: { global: "cardsDiscardAfter" },
          direct: true,
          filter: function(event2, player2) {
            var evt = event2.getParent().relatedEvent;
            if (!evt || evt.name != "judge") return;
            if (player2.getExpansions("xuyingmrfz").length >= 3) return false;
            if (get.position(event2.cards[0], true) != "d") return false;
            return get.suit(event2.cards[0]) == "spade";
          },
          async content(event2, trigger2, player2) {
            var card = trigger2.cards.length;
            var num = player2.getExpansions("xuyingmrfz").length;
            let result2;
            if (card + num <= 3)
              result2 = await player2.chooseButton(["虚影：选择置于武将牌上的牌", trigger2.cards], [1, card]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              }).forResult();
            else
              result2 = await player2.chooseButton(["虚影：选择置于武将牌上的牌", trigger2.cards], [1, 3 - num]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              }).forResult();
            if (result2 && result2.links && result2.bool && result2.links.length) {
              player2.logSkill("xuyingmrfz");
              player2.addToExpansion(result2.links, player2, "giveAuto").gaintag.add("xuyingmrfz");
            }
          }
        },
        buff: {
          trigger: { global: "useCardToTargeted" },
          forced: true,
          charlotte: true,
          popup: false,
          lastDo: true,
          filter: function(event2, player2) {
            return event2.parent && event2.parent.xuyingmrfz_buff == player2 && event2.targets.length == event2.parent.triggeredTargets4.length;
          },
          async content(event2, trigger2, player2) {
            if (!trigger2.parent) return;
            trigger2.parent.targets = trigger2.parent.targets.concat(trigger2.targets);
            trigger2.parent.triggeredTargets4 = trigger2.parent.triggeredTargets4.concat(trigger2.targets);
            player2.removeSkill("xuyingmrfz_buff");
          },
          onremove: true
        }
      }
    },
    xuegemrfz: {
      audio: 2,
      trigger: { player: "damageEnd" },
      filter: function(event2, player2) {
        return game.hasPlayer(function(target) {
          return target != player2 && player2.inRange(target);
        });
      },
      check: function(event2, player2) {
        return game.hasPlayer(function(target) {
          return target != player2 && get.attitude(player2, target) < 2 && player2.inRange(target);
        });
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget("请选择【血歌】的目标", "对一名你的攻击范围内其他角色造成一点伤害", true, function(card, player3, target) {
          return target != player3 && player3.inRange(target);
        }).set("ai", (target) => -get.attitude(player2, target)).forResult();
        if (result2.targets) {
          player2.line(result2.targets);
          result2.targets[0].damage();
          if (result2.targets[0].hp > player2.hp || player2.getExpansions("xuyingmrfz").length >= 3) event2.finish();
        }
        if (player2.countCards("he") && player2.getExpansions("xuyingmrfz").length >= 3) return;
        const { cards } = await player2.chooseCard("你可以将一张牌置于武将牌上作为“虚影”", "he").set("ai", (card) => 6 - get.value(card)).forResult();
        if (cards && cards.length) {
          player2.addToExpansion(cards, player2, "giveAuto").gaintag.add("xuyingmrfz");
        }
      }
    },
    huanxiangmrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        return event2.card && (event2.card.name == "shan" || event2.card.name == "wuxie");
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        player2.draw();
      }
    },
    //莫斯提马
    huanshimrfz: {
      audio: 2,
      direct: true,
      trigger: { player: "phaseEnd" },
      getNum: function() {
        var num = 0;
        game.getGlobalHistory("cardMove", function(evt) {
          if (evt.name == "lose" && evt.type == "discard") num += evt.cards2.length;
        });
        return num;
      },
      filter: function(event2, player2) {
        return lib.skill.huanshimrfz.getNum() > 0 && game.hasPlayer(function(target) {
          return target != player2 && !player2.hasSkill("huanshimrfz_buff1");
        });
      },
      async content(event2, trigger2, player2) {
        var num = lib.skill.huanshimrfz.getNum();
        const result2 = await player2.chooseTarget(
          get.prompt("huanshimrfz"),
          "你可以选择至多" + get.cnNumber(num) + "名角色令其下个回合内：①其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。",
          [1, num],
          function(card, player3, target) {
            return target != player3 && !player3.hasSkill("huanshimrfz_buff1");
          }
        ).set("ai", (target) => -get.attitude(player2, target)).forResult();
        if (result2.targets) {
          for (var i of result2.targets) {
            i.addSkill(["huanshimrfz_buff1", "huanshimrfz_buff2"]);
            player2.line(i);
          }
          player2.logSkill("huanshimrfz");
        }
      },
      subSkill: {
        tmp: {
          silent: true,
          charlotte: true
        },
        buff1: {
          direct: true,
          charlotte: true,
          trigger: { player: "useCardToPlayered" },
          filter: function(event2, player2) {
            if (player2.hasSkill("huanshimrfz_tmp")) return false;
            return event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            var cards = [];
            for (var i = 0; i < trigger2.cards.length; i++) {
              if (get.position(trigger2.cards[i], true) == "o") {
                cards.push(trigger2.cards[i]);
              }
            }
            player2.gain(cards, "gain2");
            trigger2.getParent().excluded.addArray(trigger2.targets);
            player2.addTempSkill("huanshimrfz_tmp", "phaseEnd");
          }
        },
        buff2: {
          onremove: true,
          mark: true,
          marktext: "缓",
          intro: {
            name: "主观缓时",
            content: "行动受到限制"
          },
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasSkill("huanshimrfz_buff1") || player2.hasSkill("huanshimrfz_buff2");
          },
          async content(event2, trigger2, player2) {
            player2.removeSkill("huanshimrfz_buff1");
            player2.removeSkill("huanshimrfz_buff2");
          }
        }
      }
    },
    shishimrfz: {
      audio: 2,
      trigger: { player: "drawBegin" },
      filter: function(event2, player2) {
        return (
          //@ts-ignore
          event2.getParent("phaseDraw") && event2.getParent("phaseDraw").player == player2 || //@ts-ignore
          event2.getParent("phaseUse") && event2.getParent("phaseUse").player == player2
        );
      },
      async content(event2, trigger2, player2) {
        trigger2.num += player2.countMark("shishimrfz") + 1;
        player2.addMark("shishimrfz", 1);
      },
      group: "shishimrfz_discard",
      subSkill: {
        discard: {
          direct: true,
          trigger: { player: "phaseDiscardBefore" },
          filter: function(event2, player2) {
            return player2.hasMark("shishimrfz");
          },
          async content(event2, trigger2, player2) {
            var num = player2.countMark("shishimrfz");
            player2.chooseToDiscard(get.prompt("shishimrfz"), "弃置" + get.cnNumber(num) + "张牌", "he", true, num);
            player2.removeMark("shishimrfz", num, false);
          }
        }
      }
    },
    jiemimrfz: {
      intro: {
        content: function(event2, player2) {
          var num = player2.countMark("jiemimrfz") + 1;
          if (player2 != _status.currentPhase && player2.countMark("jiemimrfz") % 2 == 1) return "弃置" + get.cnNumber(num) + "张牌";
          if (player2 != _status.currentPhase && player2.countMark("jiemimrfz") % 2 != 1) return "摸" + get.cnNumber(num) + "张牌";
          if (player2 == _status.currentPhase && player2.countMark("jiemimrfz") % 2 == 1) return "摸" + get.cnNumber(num) + "张牌";
          if (player2 == _status.currentPhase && player2.countMark("jiemimrfz") % 2 != 1) return "弃置" + get.cnNumber(num) + "张牌";
        }
      },
      mark: true,
      charlotte: true,
      onremove: true,
      audio: 2,
      direct: true,
      trigger: { global: "phaseEnd" },
      filter: function(event2, player2) {
        return player2.hasMark("jiemimrfz");
      },
      async content(event2, trigger2, player2) {
        player2.removeMark("jiemimrfz", player2.countMark("jiemimrfz"));
      },
      group: ["jiemimrfz_cw", "jiemimrfz_zd"],
      subSkill: {
        cw: {
          forced: true,
          trigger: { target: "useCardToTargeted" },
          filter: function(event2, player2) {
            return player2 != _status.currentPhase;
          },
          async content(event2, trigger2, player2) {
            await player2.addMark("jiemimrfz");
            if (player2.countMark("jiemimrfz") % 2 == 1) player2.draw(player2.countMark("jiemimrfz"));
            else
              player2.chooseToDiscard(
                "弃置" + get.cnNumber(player2.countMark("jiemimrfz")) + "张手牌",
                player2.countMark("jiemimrfz"),
                true,
                "h"
              );
            player2.logSkill("jiemimrfz");
          }
        },
        zd: {
          forced: true,
          trigger: { player: "useCardToTargeted" },
          filter: function(event2, player2) {
            if (player2 != _status.currentPhase) return false;
            return event2.target != player2 && event2.targets.length == 1;
          },
          async content(event2, trigger2, player2) {
            await player2.addMark("jiemimrfz");
            if (player2.countMark("jiemimrfz") % 2 == 1)
              player2.chooseToDiscard(
                "弃置" + get.cnNumber(player2.countMark("jiemimrfz")) + "张手牌",
                player2.countMark("jiemimrfz"),
                true,
                "h"
              );
            else player2.draw(player2.countMark("jiemimrfz"));
            player2.logSkill("jiemimrfz");
          }
        }
      }
    },
    shihuangmrfz: {
      audio: 2,
      usable: 2,
      trigger: { player: "loseAfter" },
      filter: function(event2, player2) {
        if (event2.type != "discard" || event2.getlx === false) return false;
        if (event2.name.indexOf("lose") != 0) return event2.name != "phase" || game.phaseNumber == 0;
        var evt = event2.getl(player2);
        var num = 0;
        for (var i = 0; i < evt.cards2.length; i++) {
          num += evt.cards2[i].number;
        }
        return num > player2.hp * 2 && !player2.hasSkill("shihuangmrfz2");
      },
      async content(event2, trigger2, player2) {
        var num = 0;
        for (var i = 0; i < trigger2.cards.length; i++) {
          num += trigger2.cards[i].number;
        }
        player2.addSkill("shihuangmrfz2");
        player2.gain(trigger2.cards, "gain2", "log");
      }
    },
    shihuangmrfz2: {
      direct: true,
      silent: true,
      charlotte: true,
      trigger: { global: "phaseEnd" },
      async content(event2, trigger2, player2) {
        player2.removeSkill("shihuangmrfz2");
      }
    },
    baokemrfz: {
      audio: 2,
      usable: 1,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        if (event2.getParent("phaseUse") && event2.getParent("phaseUse").player != player2) return false;
        if (event2.player == player2) return false;
        if (!event2.player.isAlive()) return false;
        if (event2.nature) return true;
        return event2.player.getEquip(2);
      },
      async content(event2, trigger2, player2) {
        trigger2.player.damage();
      }
    },
    //菲亚梅塔
    nanjiaomrfz: {
      init: function(player2) {
        player2.storage.nanjiaomrfz = 0;
      },
      onremove: true,
      mark: true,
      intro: {
        content: function(event2, player2) {
          let target;
          for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].isOut() || game.players[i] == player2) continue;
            if (game.players[i].storage.nanjiaomrfz && game.players[i].storage.nanjiaomrfz != 0) {
              target = game.players[i];
              break;
            }
          }
          if (!target) return "这是一个占位符";
          return "你的手牌上限" + (player2.storage.nanjiaomrfz > 0 ? "+" : "") + Math.floor(player2.storage.nanjiaomrfz / 2) + "</br>" + get.translation(target) + "的手牌上限" + (target.storage.nanjiaomrfz > 0 ? "+" : " ") + Math.floor(target.storage.nanjiaomrfz / 2);
        }
      },
      audio: 2,
      trigger: { global: "roundStart" },
      forced: true,
      async content(event2, trigger2, player2) {
        game.countPlayer(function(current) {
          if (current.storage.nanjiaomrfz) {
            current.storage.nanjiaomrfz = 0;
            if (current != player2) current.removeSkill("nanjiaomrfz_eff");
          }
        });
        if (!player2.isMaxHandCardLimit(true)) {
          for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].isOut() || game.players[i] == player2) continue;
            if (game.players[i].isMaxHandCardLimit()) {
              player2.storage.nanjiaomrfz = game.players[i].getHandcardLimit();
              game.players[i].storage.nanjiaomrfz = -(game.players[i].getHandcardLimit() - 1);
              game.players[i].addSkill("nanjiaomrfz_eff");
              break;
            }
          }
        } else {
          for (var i = 0; i < game.players.length; i++) {
            if (game.players[i].isOut() || game.players[i] == player2) continue;
            if (game.players[i].isMinHandCardLimit()) {
              game.players[i].storage.nanjiaomrfz = player2.getHandcardLimit();
              player2.storage.nanjiaomrfz = -(player2.getHandcardLimit() - 1);
              game.players[i].addSkill("nanjiaomrfz_eff");
              break;
            }
          }
        }
      },
      group: ["nanjiaomrfz_eff"],
      subSkill: {
        eff: {
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num + Math.floor(player2.storage.nanjiaomrfz / 2);
            }
          }
        }
      }
    },
    shunanmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseEnd" },
      filter: function(event2, player2) {
        return player2.hp > 1 && !player2.hasSkill("lvwaimrfz_ban");
      },
      async content(event2, trigger2, player2) {
        player2.loseHp();
      },
      group: ["shunanmrfz_damage"],
      subSkill: {
        damage: {
          trigger: {
            source: "damageBegin3",
            player: "phaseDrawBegin2"
          },
          direct: true,
          filter: function(event2, player2) {
            return player2.countCards("h") >= player2.hp;
          },
          async content(event2, trigger2, player2) {
            if (player2.getDamagedHp() <= player2.maxHp / 2) trigger2.num += 2;
            else trigger2.num++;
            player2.logSkill("shunanmrfza");
          }
        }
      },
      ai: {
        threaten: 1.2
      }
    },
    shunanmrfza: {
      audio: 2
    },
    lvwaimrfz: {
      audio: 2,
      enable: "phaseUse",
      unique: true,
      mark: true,
      limited: true,
      skillAnimation: true,
      animationStr: "律外",
      animationColor: "fire",
      init: function(player2) {
        player2.storage.lvwaimrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.lvwaimrfz;
      },
      async content(event2, trigger2, player2) {
        player2.awakenSkill(event2.name);
        player2.addSkill(["lvwaimrfz_damage", "lvwaimrfz_ban", "lvwaimrfz_clear", "lvwaimrfz_sha"]);
        player2.chooseUseTarget({ name: "sha", isCard: true }, true, "nodistance");
        player2.storage.lvwaimrfz = true;
      },
      subSkill: {
        damage: {
          direct: true,
          forced: true,
          trigger: { source: "damageEnd" },
          async content(event2, trigger2, player2) {
            player2.draw(trigger2.num);
            player2.recover(trigger2.num);
            player2.removeSkill("lvwaimrfz_damage");
          }
        },
        ban: {
          direct: true,
          forced: true,
          silent: true,
          trigger: { global: "phaseBegin" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("lvwaimrfz_ban");
          }
        },
        clear: {
          direct: true,
          silent: true,
          trigger: { player: "shaAfter" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("lvwaimrfz_clear");
            if (player2.hasSkill("lvwaimrfz_damage")) player2.removeSkill("lvwaimrfz_damage");
          }
        },
        sha: {
          direct: true,
          silent: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, card) {
            return event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            trigger2.directHit.addArray(game.players);
            player2.removeSkill("lvwaimrfz_sha");
          }
        }
      }
    },
    //棘刺
    chaoshengmrfz: {
      intro: {
        content: function(event2, player2) {
          return player2.countMark("chaoshengmrfz") + "/" + player2.countMark("chaoshengmrfz2");
        }
      },
      mark: true,
      audio: 2,
      trigger: { player: "phaseEnd" },
      frequent: true,
      filter: function(event2, player2) {
        return player2.countMark("chaoshengmrfz") >= player2.countMark("chaoshengmrfz2");
      },
      async content(event2, trigger2, player2) {
        player2.removeMark("chaoshengmrfz", player2.countMark("chaoshengmrfz"));
        if (player2.countMark("jianshumrfz") < 15) {
          player2.chooseDrawRecover(2, true, function(event3, player3) {
            if (player3.hp == 1 && player3.isDamaged()) return "recover_hp";
            return "draw_card";
          });
        } else {
          player2.draw(2);
          player2.recover();
        }
      },
      group: ["chaoshengmrfz_limite", "chaoshengmrfz_gain"],
      subSkill: {
        limite: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          async content(event2, trigger2, player2) {
            player2.addMark("chaoshengmrfz2", 3, false);
            player2.removeSkill("chaoshengmrfz_limite");
          }
        },
        gain: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          firstDo: true,
          async content(event2, trigger2, player2) {
            if (!player2.getStat("damage")) player2.addMark("chaoshengmrfz");
            else player2.removeMark("chaoshengmrfz", player2.countMark("chaoshengmrfz"));
          }
        }
      }
    },
    jianshumrfz: {
      intro: {
        content: function(event2, player2) {
          var num = player2.countMark("jianshumrfz");
          if (num == 15) return "【潮声】已修改</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
          if (num < 15 && num > 9) return "已累计指定" + num + "次</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
          if (num < 10 && num > 4) return "已累计指定" + num + "次</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
          return "已累计指定" + num + "次";
        }
      },
      audio: 3,
      direct: true,
      trigger: { player: "useCardToTargeted" },
      filter: function(event2, player2) {
        return player2.countMark("jianshumrfz") < 15;
      },
      async content(event2, trigger2, player2) {
        await player2.addMark("jianshumrfz");
        var num = player2.countMark("jianshumrfz");
        if (num % 5 == 0) {
          player2.logSkill("jianshumrfz");
          if (num == 5 || num == 15) player2.removeMark("chaoshengmrfz2");
          if (num == 10) player2.addSkill("jianshumrfz_usesha");
          if (num == 5 || num === 10) player2.addMark("jianshumrfz_time");
          if (num == 5) player2.addMark("jianshumrfz_draw");
          if (num == 5 || num === 10) player2.addMark("jianshumrfz_range");
        }
      },
      group: ["jianshumrfz_time", "jianshumrfz_range", "jianshumrfz_draw"],
      subSkill: {
        time: {
          charlotte: true,
          onremove: true,
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("jianshumrfz_time");
            }
          }
        },
        range: {
          charlotte: true,
          onremove: true,
          mod: {
            attackRange: function(player2, num) {
              return num + player2.countMark("jianshumrfz_range");
            }
          }
        },
        draw: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return player2.hasMark("jianshumrfz_draw");
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.logSkill("jianshumrfz");
          }
        },
        usesha: {
          direct: true,
          trigger: { player: "phaseUseBegin" },
          async content(event2, trigger2, player2) {
            const result2 = await player2.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function(card, player3, target2) {
              return target2 != player3 && player3.inRange(target2);
            }).set("ai", (target2) => -get.attitude(player2, target2)).forResult();
            if (result2.targets) {
              var target = result2.targets[0];
              player2.useCard({ name: "sha" }, true, false, target);
              player2.logSkill("jianshumrfz");
            }
          }
        }
      }
    },
    //夜莺
    qiulongmrfz: {
      intro: {
        name: "笼",
        content: "你获得了白恶魔的庇护"
      },
      audio: 2,
      direct: true,
      trigger: { global: "roundStart" },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget("你可以选择一名角色，令其获得‘笼’标记", function(card, player3, target) {
          return target != player3;
        }).set("ai", (target) => get.attitude(player2, target)).forResult();
        if (result2.targets) {
          result2.targets[0].addMark("qiulongmrfz");
          player2.logSkill("qiulongmrfz");
        }
      },
      group: ["qiulongmrfz_damage", "qiulongmrfz_huan"],
      subSkill: {
        remove: {
          direct: true,
          charlotte: true,
          firstDo: true,
          silent: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.hasMark("qiulongmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("qiulongmrfz");
          }
        },
        damage: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { global: "damageEnd" },
          filter: function(event2, player2) {
            return event2.player.hasMark("qiulongmrfz");
          },
          async content(event2, trigger2, player2) {
            var num = trigger2.num;
            trigger2.player.recover(num);
            player2.damage(num, "nosource");
            player2.addMark("qiulongmrfz_huan", num * 2);
            player2.logSkill("qiulongmrfz");
          }
        },
        huan: {
          marktext: "幻影",
          intro: {
            name: "幻",
            content: "幻影"
          }
        }
      }
    },
    bihumrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "damageBegin3" },
      filter: function(event2, player2) {
        return event2.nature;
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      },
      group: "bihumrfz_damage",
      subSkill: {
        damage: {
          forced: true,
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0;
          },
          async content(event2, trigger2, player2) {
            player2.addMark("qiulongmrfz_huan", trigger2.num);
            player2.logSkill("bihumrfz");
          }
        }
      },
      ai: {
        nofire: true,
        nothunder: true,
        effect: {
          target: function(card, player2, target, current) {
            if (get.tag(card, "natureDamage")) return "zerotarget";
          }
        }
      }
    },
    shengyumrfz: {
      audio: 2,
      enable: "phaseUse",
      forced: true,
      mark: true,
      init: function(player2) {
        player2.storage.shengyumrfz = false;
      },
      derivation: ["polongmrfz"],
      filter: function(event2, player2) {
        return !player2.storage.shengyumrfz;
      },
      intro: {
        content: function(event2, player2) {
          if (!player2.storage.shengyumrfz) return "圣域已准备就绪";
          return "圣域充能中:" + player2.countMark("shengyumrfz_cd") + "/4";
        }
      },
      filterTarget: true,
      selectTarget: [1, 3],
      multitarget: true,
      multiline: true,
      async content(event2, trigger2, player2) {
        const { targets } = event2;
        for (var i of targets) i.addSkill("polongmrfz");
        player2.storage.shengyumrfz = true;
        player2.recover(2);
      },
      group: "shengyumrfz_cd",
      ai: {
        order: 10,
        threaten: 2,
        expose: 0.8,
        result: {
          player: 10,
          target: 10
        }
      },
      subSkill: {
        cd: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.shengyumrfz == true;
          },
          async content(event2, trigger2, player2) {
            await player2.addMark("shengyumrfz_cd", 1);
            if (player2.countMark("shengyumrfz_cd") >= 4) {
              player2.storage.shengyumrfz = false;
              player2.removeMark("shengyumrfz_cd", player2.countMark("shengyumrfz_cd"));
            }
          }
        }
      }
    },
    polongmrfz: {
      intro: {
        name: "破笼",
        content: function(event2, player2) {
          if (player2.countMark("polongmrfz_round") >= 3)
            return "圣域持续时间:" + player2.countMark("polongmrfz_round") + "/3</br><span class=firetext>最后一轮</span>";
          return "圣域持续时间:" + player2.countMark("polongmrfz_round") + "/3";
        }
      },
      mark: true,
      audio: 2,
      enable: "phaseUse",
      usable: 5,
      filter: function(event2, player2) {
        if (player2.getDamagedHp() == 0 && player2.countMark("polongmrfz_mark1") >= 3) return false;
        return game.hasPlayer(function(current) {
          return current.countMark("qiulongmrfz_huan") > 0;
        });
      },
      async content(event2, trigger2, player2) {
        var list = [];
        if (player2.countMark("polongmrfz_mark1") < 3) list.add("摸牌");
        if (player2.countMark("polongmrfz_mark2") < 2) list.add("回血");
        if (player2.getDamagedHp() != 0) {
          const result2 = await player2.chooseControl(list, "cancel2").set("prompt", get.prompt("polongmrfz")).set("prompt2", "回复一点体力或摸一张牌").set("ai", () => {
            let player3 = get.player();
            if (player3.hp == 1 && player3.isDamaged()) return "回血";
            return "摸牌";
          }).forResult();
          if (result2.control != "cancel2") {
            game.countPlayer((current) => {
              current.removeMark("qiulongmrfz_huan");
              return true;
            });
            player2.logSkill("polongmrfz");
            if (result2.control == "摸牌") {
              player2.draw();
              player2.addMark("polongmrfz_mark1", 1);
            }
            if (result2.control == "回血") {
              player2.recover();
              player2.addMark("polongmrfz_mark2", 1);
            }
          }
        } else {
          player2.draw();
          player2.logSkill("polongmrfz");
          player2.addMark("polongmrfz_mark1", 1);
          game.countPlayer(function(current) {
            current.removeMark("qiulongmrfz_huan");
          });
        }
      },
      group: ["polongmrfz_damage", "polongmrfz_remove", "polongmrfz_round"],
      subSkill: {
        damage: {
          trigger: { player: "damageBegin3" },
          filter: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current.countMark("qiulongmrfz_huan") > 0;
            });
          },
          check: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current.countMark("qiulongmrfz_huan") > 3;
            }) || player2.hp <= 2;
          },
          async content(event2, trigger2, player2) {
            trigger2.num--;
            game.countPlayer(function(current) {
              current.removeMark("qiulongmrfz_huan");
            });
          }
        },
        remove: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("polongmrfz_mark1") || player2.hasMark("polongmrfz_mark2");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("polongmrfz_mark1", player2.countMark("polongmrfz_mark1"));
            player2.removeMark("polongmrfz_mark2", player2.countMark("polongmrfz_mark2"));
          }
        },
        round: {
          direct: true,
          charlotte: true,
          firstDo: true,
          silent: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            await player2.addMark("polongmrfz_round", 1);
            if (player2.countMark("polongmrfz_round") > 3) player2.removeSkill("polongmrfz");
          }
        },
        mark1: {},
        mark2: {}
      },
      ai: {
        order: 12,
        threaten: 2,
        result: {
          player: 10
        }
      }
    },
    //赫拉格
    yingkuimrfz: {
      mod: {
        cardname: function(card, player2) {
          if (card.name == "tao") return "sha";
        },
        maxHandcard: function(player2, num) {
          return num += 2;
        }
      },
      audio: 2,
      forced: true,
      firstDo: true,
      trigger: { player: "useCard" },
      filter: function(event2, player2) {
        if (get.name(event2.card) != "sha") return false;
        return event2.card && event2.card.cards && event2.card.cards.length == 1 && event2.card.cards[0].name == "tao";
      },
      async content(event2, trigger2, player2) {
        trigger2.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player2;
          })
        );
      },
      ai: {
        directHit_ai: true,
        skillTagFilter(player2, tag, arg) {
          var cards = arg.card.cards;
          if (get.name(arg.card) != "sha" || !cards || cards.length != 1) return false;
          if (cards[0].name != "tao") return false;
          return true;
        }
      }
    },
    yingkuimrfza: {
      audio: 2
    },
    cangfengmrfz: {
      audio: 2,
      direct: true,
      trigger: { source: "damageEnd" },
      intro: {
        content: "#/2"
      },
      onremove: true,
      async content(event2, trigger2, player2) {
        let result2;
        var mark = player2.countMark("cangfengmrfz");
        await player2.addMark("cangfengmrfz", trigger2.num, false);
        if (mark / 2 >= 1 && player2.getDamagedHp() > 0) {
          result2 = await player2.chooseControl("摸牌", "回血").set("prompt", "摸一张牌或回一点血").forResult();
        } else if (mark / 2 < 1) return;
        if (result2 && result2.control == "回血") player2.recover();
        else player2.draw();
        player2.logSkill("cangfengmrfz");
        await player2.removeMark("cangfengmrfz", 2);
        if (mark / 2 >= 1) await lib.skill.cangfengmrfz.content(event2, trigger2, player2);
      }
    },
    yuexiangmrfz: {
      intro: {
        content: function(event2, player2) {
          if (player2.getDamagedHp() >= 3) {
            return "<span class=firetext>满月</span> <span class=thundertext>弦月 新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1</br>·出牌阶段使用的第一张【杀】结算两次</br>·出牌阶段你使用的第一张【杀】目标+1；攻击距离+2";
          }
          if (player2.getDamagedHp() == 2) {
            return "满月 <span class=firetext>弦月</span> <span class=thundertext>新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1</br>·出牌阶段使用的第一张【杀】结算两次";
          }
          if (player2.getDamagedHp() == 1) {
            return "满月 弦月 <span class=firetext>新月</span></br>·你使用【杀】的次数+X（X=本阶段你使用杀的次数/2+1，向下取整）；出牌阶段限一次，你第一次使用【杀】造成的伤害+1";
          }
          return "满月 弦月 新月";
        }
      },
      audio: 3,
      trigger: { player: ["phaseBefore", "changeHp"] },
      direct: true,
      popup: false,
      mark: true,
      init: function(player2) {
        if (game.online) return;
        player2.removeAdditionalSkill("yuexiangmrfz");
        var list = [];
        if (player2.getDamagedHp() >= 3) {
          list.push("yuexiangmrfz_man");
        }
        if (player2.getDamagedHp() >= 2) {
          list.push("yuexiangmrfz_xian");
        }
        if (player2.getDamagedHp() >= 1) {
          list.push("yuexiangmrfz_xin");
        }
        if (list.length) {
          player2.addAdditionalSkill("yuexiangmrfz", list);
        }
      },
      async content(event2, trigger2, player2) {
        player2.removeAdditionalSkill("yuexiangmrfz");
        var list = [];
        if (player2.getDamagedHp() >= 3) {
          list.push("yuexiangmrfz_man");
        }
        if (player2.getDamagedHp() >= 2) {
          list.push("yuexiangmrfz_xian");
        }
        if (player2.getDamagedHp() >= 1) {
          if (trigger2.num != void 0 && trigger2.num < 0 && player2.getDamagedHp() - trigger2.num > 1) player2.logSkill("yingkuimrfza");
          list.push("yuexiangmrfz_xin");
        }
        if (list.length) {
          player2.addAdditionalSkill("yuexiangmrfz", list);
        }
      },
      ai: {
        maixie: true,
        effect: {
          target: function(card, player2, target) {
            if (get.tag(card, "damage")) {
              if (!target.hasFriend()) return;
              if (target.hp >= 4) return [0, 1];
            }
            if (get.tag(card, "recover") && player2.hp >= player2.maxHp - 2) return [0, 0];
          }
        }
      },
      group: "yuexiangmrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { player: "phaseUseEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.yuexiangmrfz_man = false;
            if (player2.hasMark("yuexiangmrfz_xin")) {
              player2.removeMark("yuexiangmrfz_xin", player2.countMark("yuexiangmrfz_xin"));
              player2.unmarkSkill("yuexiangmrfz_xin");
            }
          }
        },
        man: {
          direct: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: "shaAfter" },
          filter: function(event2, player2) {
            return !player2.storage.yuexiangmrfz_man;
          },
          async content(event2, trigger2, player2) {
            player2.storage.yuexiangmrfz_man = true;
          },
          mod: {
            selectTarget: function(card, player2, range) {
              if (card.name == "sha" && range[1] != -1 && !player2.storage.yuexiangmrfz_man) range[1]++;
            },
            attackRange: function(player2, num) {
              return num += 2;
            }
          }
        },
        xian: {
          trigger: { player: "useCardToTargeted" },
          charlotte: true,
          forced: true,
          popup: false,
          lastDo: true,
          usable: 1,
          filter: function(event2, player2) {
            return event2.card.name == "sha" && event2.parent && event2.targets.length == event2.parent.triggeredTargets4.length;
          },
          async content(event2, trigger2, player2) {
            if (!trigger2.parent) return;
            trigger2.parent.targets = trigger2.parent.targets.concat(trigger2.targets);
            trigger2.parent.triggeredTargets4 = trigger2.parent.triggeredTargets4.concat(trigger2.targets);
            player2.logSkill("yuexiangmrfz");
          }
        },
        xin: {
          group: "yuexiangmrfz_xin2",
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num += Math.floor(player2.countMark("yuexiangmrfz_xin") / 2) + 1;
            }
          },
          intro: {
            content: function(event2, player2) {
              return "本回合使用【杀】的次数+" + (Math.floor(player2.countMark("yuexiangmrfz_xin") / 2) + 1);
            }
          },
          direct: true,
          trigger: { player: "shaAfter" },
          async content(event2, trigger2, player2) {
            player2.addMark("yuexiangmrfz_xin");
            if (player2.countMark("yuexiangmrfz_xin") % 2 == 0) player2.logSkill("yuexiangmrfz");
          }
        },
        xin2: {
          direct: true,
          trigger: { source: "damageBegin3" },
          usable: 1,
          filter: function(event2) {
            return event2.card && event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
          }
        }
      }
    },
    //温蒂
    danpaomrfz: {
      intro: {
        content: "【氮炮】剩余次数：#"
      },
      onremove: true,
      init: function(player2) {
        player2.addMark("danpaomrfz", 2);
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card, player2, target) {
        return target != player2;
      },
      selectTarget: 1,
      filter: function(event2, player2) {
        return player2.countMark("danpaomrfz") > 0 && player2.countCards("he") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        if (player2.countCards("h") > 0) await player2.chooseToDiscard("h", true, player2.countCards("h"));
        else await player2.chooseToDiscard("he", true, player2.countCards("he"));
        target.damage();
        if (player2.hasMark("shuipaomrfz")) {
          player2.removeMark("shuipaomrfz");
          target.addSkill("danpaomrfz_plus");
        } else target.addSkill("danpaomrfz_nor");
        player2.removeMark("danpaomrfz");
      },
      group: "danpaomrfz_damage",
      subSkill: {
        plus: {
          intro: {
            content: "计算与其他角色距离+4；每使用一张牌受到一点伤害"
          },
          mark: true,
          mod: {
            globalFrom: function(from, to, distance) {
              return distance + 4;
            }
          },
          silent: true,
          forced: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("danpaomrfz_plus");
          }
        },
        nor: {
          intro: {
            content: "计算与其他角色距离+2；每使用两张牌受到一点伤害"
          },
          mark: true,
          mod: {
            globalFrom: function(from, to, distance) {
              return distance + 2;
            }
          },
          silent: true,
          forced: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("danpaomrfz_nor");
          }
        },
        damage: {
          forced: true,
          trigger: { global: "useCard" },
          filter: function(event2, player2) {
            return event2.player.hasSkill("danpaomrfz_nor") || event2.player.hasSkill("danpaomrfz_plus");
          },
          async content(event2, trigger2, player2) {
            var target = trigger2.player;
            if (target.hasSkill("danpaomrfz_nor")) {
              await target.addMark("danpaomrfz_nor");
            } else {
              player2.logSkill("danpaomrfz", target);
              await target.damage("player");
              return;
            }
            if (target.countMark("danpaomrfz_nor") >= 2) {
              player2.logSkill("danpaomrfz", target);
              target.damage("player");
              target.removeMark("danpaomrfz_nor", 2);
            }
          }
        }
      },
      ai: {
        order: 1,
        result: {
          player: function(event2, player2) {
            var cardh = player2.getCards("h"), carde = player2.getCards("e");
            if (cardh.length == 0 && carde.length && carde.length < 2) return 1;
            if (cardh.length > 3) return -1;
            for (var i = 0; i < cardh.length; i++) {
              if (get.value(cardh[i]) > 8) return 0.5;
            }
          },
          target: function(player2, target) {
            return get.damageEffect(target, player2);
          }
        }
      }
    },
    shuipaomrfz: {
      marktext: "蓄水",
      intro: {
        name: "蓄水",
        content: "蓄水炮蓄水完毕</br>·【氮炮】中蓝色数字翻倍，红色数字-1</br>·【水炮①】中‘+1’改为‘+2’"
      },
      onremove: true,
      init: function(player2) {
        player2.storage.shuipaomrfz = true;
      },
      audio: 2,
      forced: true,
      trigger: { source: "damageBegin3" },
      filter: function(event2, player2) {
        return player2.getEquip(1) && !player2.hasMark("shuipaomrfz") && event2.parent && event2.parent.name != "danpaomrfz";
      },
      async content(event2, trigger2, player2) {
        player2.addMark("shuipaomrfz");
      },
      group: "shuipaomrfz_j",
      subSkill: {
        j: {
          intro: {
            content: function(event2, player2) {
              if (player2.hasSkill("shuipaomrfz_j2")) return "计算与其他角色的距离+2";
              return "计算与其他角色的距离+1";
            }
          },
          forced: true,
          charlotte: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return !event2.player.hasMark("shuipaomrfz_j") && event2.player != player2 && event2.parent && event2.parent.name != "danpaomrfz";
          },
          async content(event2, trigger2, player2) {
            if (player2.hasMark("shuipaomrfz")) trigger2.player.addSkill("shuipaomrfz_j2");
            else trigger2.player.addSkill("shuipaomrfz_j3");
            trigger2.player.addMark("shuipaomrfz_j");
          }
        },
        j2: {
          charlotte: true,
          forced: true,
          silent: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("shuipaomrfz_j");
            player2.removeSkill("shuipaomrfz_j2");
          },
          mod: {
            globalFrom: function(from, to, distance) {
              return distance + 1;
            }
          }
        },
        j3: {
          charlotte: true,
          forced: true,
          silent: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("shuipaomrfz_j");
            player2.removeSkill("shuipaomrfz_j3");
          },
          mod: {
            globalFrom: function(from, to, distance) {
              return distance + 2;
            }
          }
        }
      }
    },
    jiepimrfz: {
      mod: {
        canBeDiscarded: function(card) {
          if (get.position(card) == "e") return false;
        }
      },
      global: "jiepimrfz2"
    },
    jiepimrfz2: {
      mod: {
        canBeDiscarded: function(card) {
          if (get.position(card) == "e" && _status.currentPhase && _status.currentPhase.isAlive() && _status.currentPhase.hasSkill("jiepimrfz"))
            return false;
        }
      }
    },
    //森蚺
    juezhanmrfz: {
      mod: {
        selectTarget: function(card, player2, range) {
          if (lib.skill.juezhanmrfz.isJuezhan(card) && card.name != "jiedao") range[1] = 1;
        }
      },
      isJuezhan: function(card) {
        var info = lib.card[card.name];
        if (!info || info.type != "trick" && info.type != "delay") return false;
        if (info.notarget) return false;
        if (info.selectTarget != void 0) {
          if (Array.isArray(info.selectTarget)) {
            if (info.selectTarget[0] < 0) return !info.toself;
            return info.selectTarget[0] != 1 || info.selectTarget[1] != 1;
          } else {
            if (info.selectTarget < 0) return !info.toself;
            return info.selectTarget != 1;
          }
        }
        return false;
      },
      marktext: "单挑",
      intro: {
        name: "单挑",
        content: "和森蚺决一死战吧！"
      },
      audio: 2,
      forced: true,
      trigger: { target: "useCardToTargeted" },
      filter: function(event2, player2) {
        return event2.card.name == "sha" && !event2.player.hasMark("juezhanmrfz");
      },
      async content(event2, trigger2, player2) {
        trigger2.player.addMark("juezhanmrfz");
        trigger2.player.addSkill("juezhanmrfz_ta");
      },
      group: "juezhanmrfz_pl",
      subSkill: {
        ta: {
          mod: {
            playerEnabled: function(card, player2, target) {
              if (!target.hasSkill("juezhanmrfz") && target != player2) {
                return false;
              }
            },
            inRangeOf: function(from, to) {
              if (from.hasSkill("juezhanmrfz")) return true;
            }
          },
          charlotte: true,
          forced: true,
          silent: true,
          trigger: {
            global: ["phaseEnd", "die"]
          },
          filter: function(event2, player2) {
            return event2.player.hasSkill("juezhanmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("juezhanmrfz");
            player2.removeSkill("juezhanmrfz_ta");
          }
        },
        pl: {
          mod: {
            playerEnabled: function(card, player2, target) {
              if (!target.hasMark("juezhanmrfz") && target != player2 && game.hasPlayer(function(current) {
                return current.countMark("juezhanmrfz") > 0;
              })) {
                return false;
              }
            },
            inRangeOf: function(from, to) {
              if (from.hasMark("juezhanmrfz")) return true;
            }
          }
        }
      }
    },
    shanxiemrfz: {
      audio: 2,
      trigger: { global: "loseAfter" },
      filter: function(event2, player2) {
        if (player2.countMark("shanxiemrfz") > player2.countCards("h")) return false;
        if (event2.type != "discard" || event2.getlx === false) return false;
        var cards = event2.cards.slice(0);
        var evt = event2.getl(player2);
        if (evt && evt.cards) cards.removeArray(evt.cards);
        for (var i = 0; i < cards.length; i++) {
          if (cards[i].original != "j" && get.type(cards[i], event2.player) == "equip" && get.position(cards[i], true) == "d") {
            return true;
          }
        }
        return false;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        while (true) {
          let skipStep1 = false;
          if (player2.countCards("h") >= player2.countMark("shanxiemrfz") && player2.countMark("shanxiemrfz") > 0) {
            result2 = await player2.chooseToDiscard(
              get.prompt("shanxiemrfz"),
              "你可以弃置" + get.cnNumber(player2.countMark("shanxiemrfz")) + "张牌获得此装备牌",
              false,
              player2.countMark("shanxiemrfz")
            ).set("ai", (card) => {
              return 6 - get.value(card);
            }).forResult();
          } else if (player2.countMark("shanxiemrfz") === 0) {
            skipStep1 = true;
          }
          if (!skipStep1) {
            if (trigger2.delay === false) {
              await game.delay();
            }
            if (!result2?.cards) {
              break;
            }
          }
          const equipCards = [];
          const cards2 = trigger2.cards.slice(0);
          const evt = trigger2.getl(player2);
          if (evt?.cards) {
            cards2.removeArray(evt.cards);
          }
          for (const card of cards2) {
            if (card.original !== "j" && get.type(card, trigger2.player) === "equip" && get.position(card, true) === "d") {
              equipCards.push(card);
            }
          }
          event2.num = equipCards.length;
          if (equipCards.length > 0) {
            result2 = await player2.chooseButton(["擅械：请选择获得一张牌", equipCards], 1).set("ai", (button) => {
              return get.value(button.link, _status.event.player, "raw");
            }).forResult();
          }
          if (result2?.bool) {
            event2.num--;
            player2.logSkill("shanxiemrfz");
            await player2.gain(result2.links, "gain2", "log");
            player2.addMark("shanxiemrfz", 1);
            if (event2.num > 0) {
              continue;
            }
          }
          break;
        }
      },
      group: ["shanxiemrfz_sha", "shanxiemrfz_usesha", "shanxiemrfz_remove"],
      subSkill: {
        sha: {
          audio: "shanxiemrfz",
          enable: ["chooseToRespond", "chooseToUse"],
          filterCard: function(card, player2) {
            return get.type(card) == "equip";
          },
          position: "hes",
          viewAs: { name: "sha" },
          prompt: "将一张装备牌当杀使用或打出",
          check: function(card) {
            var val = get.value(card);
            if (_status.event.name == "chooseToRespond") return 1 / Math.max(0.1, val);
            return 10 - val;
          },
          ai: {
            skillTagFilter: function(player2, tag, arg) {
              if (!get.type(arg.card) == "equip") return false;
            },
            respondSha: true
          }
        },
        usesha: {
          trigger: { source: "damageBegin3" },
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha" && event2.player.hasMark("juezhanmrfz") && //@ts-ignore
            get.type(event2.cards[0], "equip") == "equip";
          },
          forced: true,
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.logSkill("shanxiemrfz");
          }
        },
        remove: {
          silent: true,
          charlotte: true,
          forced: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeMark("shanxiemrfz", player2.countMark("shanxiemrfz"));
          }
        }
      },
      ai: {
        threaten: 2
      }
    },
    tieyimrfz: {
      audio: 2,
      enable: "phaseUse",
      mark: true,
      limited: true,
      selectCard: [0, 3],
      filterCard: true,
      position: "h",
      prompt: "弃置至多三张手牌，摸两倍于你弃置牌的牌",
      delay: 0,
      check: function(card) {
        return 6 - get.value(card) && get.name(card) != "sha" && get.type(card) != "equip";
      },
      init: function(player2) {
        player2.storage.tieyimrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.tieyimrfz;
      },
      async content(event2, trigger2, player2) {
        const { cards } = event2;
        let result2;
        player2.awakenSkill(event2.name);
        player2.node.avatar.setBackgroundImage("extension/WhichWay/image/skill/senrantieyumrfz.jpg");
        player2.node.name.innerHTML = get.translation("senrantieyumrfz");
        await player2.draw(cards.length * 2);
        await player2.recover(2);
        await player2.turnOver();
        player2.storage.tieyimrfz = true;
        let skipStep2 = false;
        if (game.hasPlayer((current) => {
          return current !== player2 && !current.hasMark("juezhanmrfz");
        })) {
          result2 = await player2.chooseTarget(true, (card, player3, target) => {
            return target !== player3 && !target.hasMark("juezhanmrfz");
          }).set("ai", (target) => {
            return -get.attitude(player2, target);
          }).forResult();
        } else {
          skipStep2 = true;
        }
        if (!skipStep2 && result2 && result2.targets) {
          const target = result2.targets[0];
          target.addSkill("juezhanmrfz_ta");
          target.addMark("juezhanmrfz");
        }
        player2.addTempSkill("tieyimrfz_use");
        player2.addTempSkill("tieyimrfz_discard");
        player2.addSkill("tieyimrfz_back");
      },
      intro: {
        content: "limited"
      },
      subSkill: {
        back: {
          charlotte: true,
          silent: true,
          trigger: { player: ["dying", "phaseEnd"] },
          async content(event2, trigger2, player2) {
            player2.node.avatar.setBackgroundImage("extension/WhichWay/image/senranmrfz.jpg");
            player2.node.name.innerHTML = get.translation("senranmrfz");
            player2.removeSkill("tieyimrfz_back");
          }
        },
        discard: {
          forced: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.countCards("h") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.chooseToDiscard(true, player2.countCards("h"));
          }
        },
        use: {
          charlotte: true,
          mod: {
            cardUsableTarget: function(card, player2, target) {
              if (target.hasMark("juezhanmrfz")) return true;
            }
          }
        }
      },
      ai: {
        order: 13,
        threaten: 3,
        expose: 0.9,
        result: {
          target: function(player2, target) {
            var hs1 = player2.countCards("h", function(card) {
              return card.name == "sha";
            });
            var hs2 = player2.countCards("he", function(card) {
              return get.type(card) == "equip";
            });
            if (hs1 + 2 * hs2 > 4) return -1;
            return 0;
          }
        }
      }
    },
    //ASH灰烬
    wusumrfz: {
      intro: {
        content: function(event2, player2) {
          if (player2.countMark("wusumrfz") == 0) return "Ash已化身监控室大爷";
          return "FBI突击中</br>距离ASH白给还剩" + (5 - player2.countMark("wusumrfz")) + "个阶段";
        }
      },
      mark: true,
      audio: 2,
      trigger: {
        player: ["phaseZhunbeiBefore", "phaseJudgeBefore", "phaseDrawBefore", "phaseDiscardBefore", "phaseJieshuBefore"]
      },
      forced: true,
      filter: function(event2, player2) {
        return event2.getParent("phase");
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
        var next = trigger2.player.phaseUse();
        event2.next.remove(next);
        trigger2.getParent("phase").next.push(next);
        player2.addMark("wusumrfz");
      },
      group: "wusumrfz_draw",
      subSkill: {
        draw: {
          forced: true,
          trigger: { player: "phaseUseBegin" },
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        }
      },
      ai: {
        effect: {
          target: function(card, player2, target, current) {
            if (get.type(card) == "delay") return "zeroplayertarget";
          }
        }
      }
    },
    wutoumrfz: {
      audio: 2,
      forced: true,
      usable: 1,
      trigger: { player: "damageBegin3" },
      filter: function(event2, player2) {
        return event2.num === player2.hp;
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      }
    },
    baigeimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseUseEnd" },
      filter: function(event2, player2) {
        return player2.countMark("wusumrfz") >= 5;
      },
      async content(event2, trigger2, player2) {
        if (player2.countMark("wusumrfz") >= 5) {
          var num = player2.countCards("h") - player2.getHandcardLimit();
          var chattext = [
            "窗下怎么会有个夹子？",
            "为什么会有人放站位edd！",
            "（Ash听到的敌方干员的声音）call a pizza！",
            '（狼人手枪的枪声）女鬼:"talk"',
            "(剃刀花的声音)",
            "(两个蛊声，三条枪线)",
            "(发射祖母榴弹->rush->火山盾炸裂的声音)",
            "“友军已将你击杀”"
          ].randomGet();
          if (num > 0) {
            player2.logSkill("baigeimrfz");
            player2.chooseToDiscard("h", num, true, "弃置" + get.cnNumber(num) + "张手牌");
          }
          player2.removeMark("wusumrfz", 5);
          player2.chat(chattext);
        }
      }
    },
    //异客
    shazumrfz: {
      marktext: "仇敌",
      intro: {
        name: "仇敌",
        content: "沙卒盯上你了"
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      filterTarget: function(card, player2, target) {
        return target.countCards("he") > 0 && target != player2;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        let result2;
        result2 = await player2.chooseCard("he", true).forResult();
        if (!result2.cards) return;
        const cardp = result2.cards[0];
        let next;
        if (target.countCards("e") > 0) {
          next = target.chooseCard("e", true);
        } else {
          next = target.chooseCard("h", true);
        }
        result2 = await next.forResult();
        if (!result2.bool) {
          return;
        } else {
          if (!result2.cards) return;
          const cardt = result2.cards[0];
          player2.swapHandcards(target, [cardp], [cardt]);
          const numt = target.countCards("h");
          const nump = player2.countCards("h");
          if (numt === nump) {
            return;
          }
          if (numt > nump) {
            await player2.draw();
          } else if (nump > numt) {
            await target.draw();
          }
        }
      },
      group: "shazumrfz_damage",
      subSkill: {
        damage: {
          audio: "shazumrfz",
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0 && !event2.source.hasMark("shazumrfz") && event2.source != player2;
          },
          logTarget: "source",
          async content(event2, trigger2, player2) {
            if (game.hasPlayer(function(current) {
              return current.hasMark("shazumrfz");
            })) {
              game.hasPlayer(function(current) {
                return current.removeMark("shazumrfz");
              });
              trigger2.source.addMark("shazumrfz");
            } else trigger2.source.addMark("shazumrfz");
          }
        }
      },
      ai: {
        threaten: 1.1,
        order: 8,
        result: {
          player: function(player2, target) {
            if (get.attitude(player2, target) > 0) return 1.5;
            return 0.5;
          },
          target: function(player2, target) {
            if (get.attitude(player2, target) < 2 && target.countCards("e") > 0 && target.countCards("h") > player2.countCards("h"))
              return -1;
            return 0.5;
          }
        }
      }
    },
    dianlianmrfz: {
      audio: 2,
      trigger: { source: "damageSource" },
      filter: function(event2, player2) {
        if (event2.num <= 1) return false;
        return event2.player != player2 && event2.player.isAlive() && game.hasPlayer(function(current) {
          return current != event2.player && get.distance(event2.player, current) <= 1 && current != player2;
        });
      },
      check: function(event2, player2) {
        if (game.hasPlayer(function(current) {
          return current != player2 && get.attitude(player2, current) < 0 && current != event2.player;
        }))
          return true;
        return false;
      },
      async content(event2, trigger2, player2) {
        let result2;
        result2 = await player2.chooseTarget(
          true,
          "选择一名与" + get.translation(trigger2.player) + "距离为 1 的角色并对其造成" + (trigger2.num - 1) + "点伤害",
          (card, player3, target) => {
            const damaged = trigger2.player;
            return get.distance(damaged, target) <= 1 && target !== damaged && target !== player3;
          }
        ).set("ai", (target) => {
          return -get.attitude(player2, target);
        }).forResult();
        const num = trigger2.num - 1;
        if (result2.targets) {
          const target = result2.targets[0];
          await target.damage("player", num);
        }
      },
      group: "dianlianmrfz_damage",
      subSkill: {
        damage: {
          audio: "dianlianmrfz",
          trigger: { source: "damageBegin3" },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) < 0;
          },
          filter: function(event2, player2) {
            return event2.nature == "thunder" && !player2.storage.dianlianmrfz;
          },
          prompt: "是否令此伤害+1",
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.storage.dianlianmrfz = true;
            player2.addSkill("dianlianmrfz_remove");
          }
        },
        remove: {
          charlotte: true,
          direct: true,
          silent: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.storage.dianlianmrfz = false;
            player2.removeSkill("dianlianmrfz_remove");
          }
        }
      }
    },
    leibaomrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      selectTarget: 1,
      filterTarget: function(card, player2, target) {
        if (target == player2) return false;
        return !game.hasPlayer(function(current) {
          return current != player2 && current.hp > target.hp;
        }) || target.hasMark("shazumrfz");
      },
      filter: function(event2, player2) {
        return player2.getCards("he", function(card) {
          return get.type(card) == "equip";
        }).length >= 2 || player2.countCards("h", "shandian");
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        const result2 = await player2.chooseToDiscard("he", true, function(card, player3) {
          if (player3.getCards("he", function(card2) {
            return get.type(card2) == "equip";
          }).length >= 2)
            return get.type(card) == "equip" || card.name == "shandian";
          return card.name == "shandian";
        }).set("prompt", "请弃置一张【闪电】，或依次弃置两张装备牌。").forResult();
        if (result2.cards && result2.cards[0].name != "shandian") {
          await player2.chooseToDiscard("he", true, function(card, player3) {
            return get.type(card) == "equip";
          }).set("prompt", "请弃置一张装备牌。");
          target.damage("player", 2);
        } else target.damage("player", 2, "thunder");
      },
      ai: {
        threaten: 1.2,
        order: 13,
        result: {
          target: -1
        }
      }
    },
    //年
    zhujimrfz: {
      audio: 2,
      trigger: {
        player: ["phaseDrawAfter", "phaseJieshuAfter"]
      },
      direct: true,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      async content(event2, trigger2, player2) {
        let result2;
        result2 = await player2.chooseToDiscard("he", get.prompt("zhujimrfz"), "【铸极】:你可以重铸一张牌").set("ai", function(card) {
          return 6 - get.value(card);
        }).forResult();
        if (result2.cards) player2.draw();
        if (result2.cards && get.type(result2.cards[0]) == "equip") {
          player2.draw();
          player2.logSkill("zhujimrfz");
        } else if (result2.cards) {
          player2.logSkill("zhujimrfz");
        }
      }
    },
    tongyinmrfz: {
      audio: 2,
      trigger: { player: "damageEnd" },
      filter: function(event2, player2) {
        return event2.source != void 0 && event2.source != player2;
      },
      usable: 1,
      logTarget: "source",
      check: function(event2, player2) {
        return get.attitude(player2, event2.source) < 2;
      },
      async content(event2, trigger2, player2) {
        let result2;
        if (!trigger2.source.hasSkill("fengyin")) {
          trigger2.source.addTempSkill("fengyin");
        }
        result2 = await trigger2.source.chooseToDiscard(
          "he",
          true,
          "【铜印】:请选择弃置一张非基本或" + get.translation(Math.min(player2.getDamagedHp() + 1, 1)) + "张基本牌"
        ).forResult();
        if (player2.getDamagedHp() < 2) event2.finish();
        if (result2 && result2.cards && get.type(result2.cards[0]) == "basic") {
          trigger2.source.chooseToDiscard(
            true,
            "【铜印】:请选择弃置" + get.translation(player2.getDamagedHp() - 1) + "张基本牌",
            [1, player2.getDamagedHp() - 1],
            function(card) {
              return get.type(card) == "basic";
            }
          ).set("ai", function(card) {
            return 6 - get.value(card);
          });
        }
      },
      ai: {
        threaten: 0.5,
        expose: 0.4
      }
    },
    tieyumrfz: {
      intro: {
        content: "使用【杀】的次数+#；可令大于一的伤害改为一#次"
      },
      audio: 2,
      trigger: { global: "useCard" },
      filter: function(event2, player2) {
        return player2.countMark("tieyumrfz_clear2") < 2 && get.type(event2.card) == "equip";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) > 2;
      },
      async content(event2, trigger2, player2) {
        if (trigger2.player.getDamagedHp() > 0) trigger2.player.recover();
        else trigger2.player.changeHujia();
        trigger2.player.addSkill(["tieyumrfz_sha", "tieyumrfz_damage", "tieyumrfz_clear"]);
        trigger2.player.addMark("tieyumrfz");
        player2.addMark("tieyumrfz_clear2", 1);
      },
      group: "tieyumrfz_clear2",
      subSkill: {
        sha: {
          charlotte: true,
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("tieyumrfz");
            }
          }
        },
        damage: {
          direct: true,
          trigger: { player: "damageBegin3" },
          filter: function(event2, player2) {
            return event2.num > 1 && player2.countMark("tieyumrfz_damage") < player2.countMark("tieyumrfz");
          },
          async content(event2, trigger2, player2) {
            trigger2.num = 1;
            player2.logSkill("tieyumrfz");
            player2.addMark("tieyumrfz_damage");
          }
        },
        clear: {
          silent: true,
          direct: true,
          charlotte: true,
          firstDo: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("tieyumrfz_damage");
            player2.removeSkill("tieyumrfz_sha");
            player2.removeSkill("tieyumrfz_clear");
            player2.removeMark("tieyumrfz", player2.countMark("tieyumrfz"));
            player2.removeMark("tieyumrfz_damage", player2.countMark("tieyumrfz_damage"));
          }
        },
        clear2: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.hasMark("tieyumrfz_clear2");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("tieyumrfz_clear2", player2.countMark("tieyumrfz_clear2"));
          }
        }
      },
      ai: {
        threaten: 1.2,
        expose: 0.8
      }
    },
    //令
    shixingmrfz: {
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards = player2.getExpansions(skill);
        if (cards.length) player2.loseToDiscardpile(cards);
      },
      mark: true,
      audio: 6,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      check: function(event2, player2) {
        if (player2.getExpansions("shixingmrfz").filter(function(magic) {
          return get.type2(magic) == "equip";
        }).length && player2.hasCard(function(card) {
          return get.type(card) == "equip";
        }))
          return true;
        if (player2.countCards("h") < 3 && player2.getExpansions("shixingmrfz").length) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        let result2;
        let skipToStep4 = false;
        if (player2.getExpansions("shixingmrfz").length <= 1 && player2.getExpansions("shixingmrfz").length) {
          result2 = await player2.chooseControl("弃置", "增加").set("prompt", "选择弃置所有置于武将牌上的牌或往武将牌上放置牌").set("ai", (event3, player3) => {
            const num = Math.random();
            if (player3.getExpansions("shixingmrfz").filter((magic) => {
              return get.type2(magic) === "equip";
            }).length && player3.countCards("h") < 4)
              return 1;
            if (num <= 0.6) return 0;
            return 1;
          }).forResult();
        } else if (player2.getExpansions("shixingmrfz").length === 0) {
          skipToStep4 = true;
        }
        if (!skipToStep4) {
          if (result2?.control === "弃置" || player2.getExpansions("shixingmrfz").length > 1) {
            event2.num = 0;
            if (player2.getExpansions("shixingmrfz").filter((magic) => {
              return get.type2(magic) === "basic";
            }).length) {
              await player2.gain(
                get.cardPile((card) => {
                  return get.type(card) === "basic";
                }),
                "gain2"
              );
            }
            if (player2.getExpansions("shixingmrfz").filter((magic) => {
              return get.type2(magic) === "equip";
            }).length) {
              event2.num++;
              result2 = await player2.chooseTarget("【诗型】:弃置一名其他角色的一张牌", false, (card, target, player3) => {
                return target !== player3;
              }).set("ai", (target) => {
                return -get.attitude(_status.event.player, target);
              }).forResult();
            }
            if (player2.getExpansions("shixingmrfz").filter((magic) => {
              return get.type2(magic) === "trick";
            }).length) {
              await player2.draw();
              await player2.recover();
            }
          }
          if (result2?.control === "增加") {
            skipToStep4 = true;
          }
        }
        if (!skipToStep4 && result2 && result2.targets && event2.num === 1) {
          await player2.discardPlayerCard(result2.targets[0], "he", true);
        }
        if (!skipToStep4) {
          player2.loseToDiscardpile(player2.getExpansions("shixingmrfz"));
        }
        while (!skipToStep4) {
          let hasValidCard = false;
          if (!player2.getExpansions("shixingmrfz").length) {
            hasValidCard = true;
          } else {
            hasValidCard = player2.hasCard((card) => {
              return player2.getExpansions("shixingmrfz").filter((magic) => {
                return get.type2(magic) === get.type2(card);
              }).length;
            }, "he");
          }
          if (hasValidCard) {
            result2 = await player2.chooseCard("he", "依次将最多两张牌至于武将牌上", (card, player3) => {
              if (player3.getExpansions("shixingmrfz").length) {
                return player3.getExpansions("shixingmrfz").filter((magic) => {
                  return get.type2(magic) === get.type2(card);
                }).length;
              }
              return true;
            }).forResult();
          } else {
            break;
          }
          if (result2?.cards?.length) {
            const next = player2.addToExpansion(result2.cards, player2, "giveAuto");
            next.gaintag.add("shixingmrfz");
            await next;
          }
          if (result2?.cards && player2.getExpansions("shixingmrfz").length < 1) {
            continue;
          }
          break;
        }
      },
      group: ["shixingmrfz_basic", "shixingmrfz_trick", "shixingmrfz_equip"],
      subSkill: {
        //清平
        basic: {
          audio: "shixingmrfz",
          trigger: { player: "damageBegin" },
          filter: function(event2, player2) {
            return player2.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "basic";
            }).length;
          },
          async content(event2, trigger2, player2) {
            const cards = player2.getExpansions("shixingmrfz");
            let result2;
            if (cards.length) {
              result2 = await player2.chooseButton([`选择移去一张"清平"`, cards], true).forResult();
            } else {
              return;
            }
            if (result2.bool) {
              await player2.loseToDiscardpile(result2.links);
            }
            trigger2.num--;
            player2.popup("清平");
            game.log(player2, "移去了一张'清平'");
            const card = get.cardPile((card2) => {
              return get.type(card2) === "basic";
            });
            if (player2.getExpansions("shixingmrfz").filter((magic) => {
              return get.type2(magic) === "basic";
            }).length < 1) {
              await player2.gain(card, "gain2");
            }
          }
        },
        //弦惊
        equip: {
          audio: "shixingmrfz",
          forced: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return player2.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "equip";
            }).length > 1;
          },
          async content(event2, trigger2, player2) {
            trigger2.num += 2;
            player2.popup("弦惊");
          },
          mod: {
            maxHandcard: function(player2, num) {
              if (player2.getExpansions("shixingmrfz").filter(function(magic) {
                return get.type2(magic) == "equip";
              }).length)
                return num + 2;
            },
            cardUsable: function(card, player2, num) {
              if (card.name == "sha" && player2.getExpansions("shixingmrfz").filter(function(magic) {
                return get.type2(magic) == "equip";
              }).length > 1)
                return num + 2;
            }
          }
        },
        //逍遥
        trick: {
          audio: "shixingmrfz",
          enable: "phaseUse",
          filter: function(event2, player2) {
            return player2.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "trick";
            }).length > 0 && event2.filterCard({ name: "sha" }, player2, event2);
          },
          chooseButton: {
            dialog: function(event2, player2) {
              return ui.create.dialog("逍遥", player2.getExpansions("shixingmrfz"), "hidden");
            },
            backup: function(links, player2) {
              return {
                filterCard: function() {
                  return false;
                },
                selectCard: -1,
                filterTarget: function(card, player3, target) {
                  return target != player3 && player3.inRange(target);
                },
                card: links[0],
                content: lib.skill.shixingmrfz_trick.contentx,
                ai: {
                  order: 8,
                  respondSha: true,
                  result: {
                    target: -1
                  }
                }
              };
            },
            prompt: function() {
              return "请选择【杀】的目标";
            }
          },
          async contentx(event2, trigger2, player2) {
            const { target } = event2;
            const card = lib.skill.shixingmrfz_trick_backup.card;
            player2.addTempSkill("shixingmrfz_damage", "shaEnd");
            player2.addTempSkill("shixingmrfz_sha", "useCardAfter");
            await player2.useCard({ name: "sha", isCard: true }, true, target);
            game.log(player2, "视为对", target, "使用【杀】");
            player2.logSkill("shixingmrfz");
            if (!player2.storage.shixingmrfz_damage) {
              await player2.loseToDiscardpile(card);
            } else {
              await player2.gain(card, "gain2");
              player2.storage.shixingmrfz_damage = false;
            }
            if (player2.getExpansions("shixingmrfz").filter((magic) => {
              return get.type2(magic) === "trick";
            }).length < 1) {
              await player2.recover();
              await player2.draw();
            }
          },
          ai: {
            respondSha: true,
            order: 4,
            skillTagFilter: function(player2, tag, arg) {
              if (player2.getExpansions("shixingmrfz").filter(function(magic) {
                return get.type2(magic) == "trick";
              }).length < 1)
                return false;
              if (arg != "use") return false;
            },
            result: {
              player: 1
            }
          }
        },
        damage: {
          direct: true,
          trigger: { player: "shaMiss" },
          silent: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            player2.storage.shixingmrfz_damage = true;
          }
        },
        sha: {
          direct: true,
          silent: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            if (trigger2.addCount !== false) {
              trigger2.addCount = false;
              player2.getStat().card.sha--;
            }
          }
        }
      },
      ai: {
        threaten: function(player2) {
          if (player2.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "basic";
          }).length > 0)
            return 0.8;
          return 1.2;
        }
      }
    },
    zuimengmrfz: {
      audio: 2,
      enable: "phaseUse",
      unique: true,
      mark: true,
      limited: true,
      skillAnimation: true,
      animationStr: "醉梦",
      animationColor: "fire",
      init: function(player2) {
        player2.storage.zuimengmrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.zuimengmrfz && player2.countCards("h", "jiu") > 0;
      },
      async content(event2, trigger2, player2) {
        let result2;
        player2.awakenSkill(event2.name);
        player2.storage.zuimengmrfz = true;
        await player2.chooseToUse(
          true,
          (card, player3, event3) => {
            return get.name(card) === "jiu";
          },
          "使用一张【酒】"
        );
        event2.num = 0;
        while (event2.num < game.players.length) {
          event2.num++;
          result2 = await player2.chooseTarget(
            true,
            "【醉梦" + event2.num + "/" + game.players.length + "】：选择一名角色，获得其区域内一张牌",
            (card, player3, target) => {
              return target.countMark("zuimengmrfz_remove") < 2;
            }
          ).set("ai", (target) => {
            const aiPlayer = _status.event.player;
            const att = get.attitude(aiPlayer, target);
            if (att < 0) {
              return -Math.sqrt(-att);
            } else {
              return Math.sqrt(att);
            }
          }).forResult();
          if (result2.targets) {
            const target = result2.targets[0];
            if (!target.hasSkill("zuimengmrfz_remove")) {
              target.addTempSkill("zuimengmrfz_remove");
            }
            await player2.gainPlayerCard("hej", target, true);
            target.addMark("zuimengmrfz_remove", 1);
            continue;
          } else {
            break;
          }
        }
        if (player2.countCards("h") < game.players.length) {
          await player2.drawTo(game.players.length);
        }
        if (event2.getParent("phaseUse")) event2.getParent("phaseUse").skipped = true;
        player2.addTempSkill("zuimengmrfz_skip");
      },
      subSkill: {
        remove: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { global: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("zuimengmrfz_remove", player2.countMark("zuimengmrfz_remove"));
          }
        },
        skip: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseDiscardBefore" },
          async content(event2, trigger2, player2) {
            trigger2.cancel();
          }
        }
      },
      ai: {
        order: 6,
        threaten: 0.6,
        expose: 0.6,
        result: {
          player: 1
        }
      }
    },
    haojiumrfz: {
      audio: 2,
      trigger: { player: "useCard" },
      forced: true,
      filter: function(event2, player2) {
        return event2.card.name == "jiu" && player2.getDamagedHp() > 0;
      },
      async content(event2, trigger2, player2) {
        player2.recover();
      },
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "jiu") return Infinity;
        }
      }
    },
    //风笛
    juntongmrfz: {
      audio: 4,
      forced: true,
      trigger: { global: "roundStart" },
      async content(event2, trigger2, player2) {
        player2.draw(3);
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num - 1;
        }
      },
      group: ["juntongmrfz_ban", "juntongmrfz_sha"],
      subSkill: {
        ban: {
          charlotte: true,
          direct: true,
          trigger: {
            player: ["phaseJudgeBefore", "phaseDrawBefore"]
          },
          async content(event2, trigger2, player2) {
            trigger2.cancel();
          }
        },
        sha: {
          audio: "juntongmrfz",
          trigger: { player: "useCard2" },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.judge((card) => {
              const suit = get.suit(card);
              if (suit === "heart" || suit === "diamond" || suit === "spade") return -4;
              return 0;
            }).set("judge2", (result3) => {
              return result3.bool === false;
            }).forResult();
            if (result2.suit === "diamond") {
              if (trigger2.addCount !== false) {
                trigger2.addCount = false;
                player2.getStat().card.sha--;
              }
              return;
            }
            if (result2.suit === "heart") {
              if (game.hasPlayer((current) => {
                return !trigger2.targets.includes(current) && !!player2.canUse(trigger2.card, current);
              })) {
                result2 = await player2.chooseTarget(
                  get.prompt("juntongmrfz"),
                  "为" + get.translation(trigger2.card) + "增加一个目标",
                  (card, player3, target) => {
                    return !_status.event.sourcex.includes(target) && player3.canUse(_status.event.card, target);
                  }
                ).set("sourcex", trigger2.targets).set("ai", (target) => {
                  const aiPlayer = _status.event.player;
                  return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
                }).set("card", trigger2.card).forResult();
                if (result2.targets) {
                  trigger2.targets.push(result2.targets[0]);
                  player2.logSkill("juntongmrfz", result2.targets[0]);
                }
              }
              return;
            }
            if (result2.suit === "spade") {
              await player2.draw();
              return;
            }
            return;
          }
        }
      },
      ai: {
        effect: {
          target: function(card, player2, target, current) {
            if (get.type(card) == "delay") return "zeroplayertarget";
          }
        }
      }
    },
    pochengmrfz: {
      audio: 2,
      trigger: { player: "useCardToTargeted" },
      onremove: true,
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) < 0;
      },
      init: function(player2) {
        player2.storage.pochengmrfz = false;
      },
      filter: function(event2, player2) {
        return event2.card.name == "sha" && game.roundNumber != 1 && !player2.storage.pochengmrfz;
      },
      async content(event2, trigger2, player2) {
        player2.storage.pochengmrfz = true;
        event2.num = 2;
        while (event2.num > 0) {
          event2.num--;
          trigger2.getParent().targets = trigger2.getParent().targets.concat(trigger2.targets);
          trigger2.getParent().triggeredTargets4 = trigger2.getParent().triggeredTargets4.concat(trigger2.targets);
        }
        event2.getParent("phaseUse").skipped = true;
        player2.addTempSkill("pochengmrfz_one");
      },
      group: "pochengmrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          direct: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.pochengmrfz;
          },
          async content(event2, trigger2, player2) {
            player2.addMark("pochengmrfz_clear", 1);
            if (player2.countMark("pochengmrfz_clear") >= 3) {
              player2.storage.pochengmrfz = false;
              player2.removeMark("pochengmrfz_clear", player2.countMark("pochengmrfz_clear"));
            }
          }
        },
        one: {
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num + 1;
            }
          }
        }
      }
    },
    //琴柳
    junqimrfz: {
      audio: 4,
      group: ["junqimrfz_reget", "junqimrfz_get"],
      subSkill: {
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "die" },
          filter: function(event2, player2) {
            return event2.player.hasSkill("junqimrfz");
          },
          async content(event2, trigger2, player2) {
            var isSkillandRemove = function(str, who) {
              if (who.hasSkill(str)) who.removeSkill(str);
            };
            isSkillandRemove("junqimrfz_zhiyu", player2);
            isSkillandRemove("junqimrfz_zhiyuan", player2);
            isSkillandRemove("junqimrfz_jingong", player2);
            isSkillandRemove("butuimrfz", player2);
          }
        },
        zhiyu: {
          mark: true,
          marktext: "军旗",
          intro: {
            name: "军旗（治愈之旗）",
            content: "出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸一张牌"
          },
          trigger: { player: "phaseUseBegin" },
          filter: function(event2, player2) {
            return player2.countCards("h") > 0;
          },
          prompt: "是否发动【军旗(治愈之旗)】",
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseToDiscard("he", true, [1, 3], "请弃置至多三张牌").set("ai", (card) => {
              return 6 - get.value(card);
            }).forResult();
            if (result2.cards) {
              result2 = await player2.chooseTarget(true, [1, result2.cards.length], "请选择至多" + result2.cards.length + "名角色").set("ai", (target) => {
                return get.attitude(_status.event.player, target);
              }).forResult();
            }
            if (result2.bool && result2.targets) {
              let min = player2.countCards("h");
              let min_player = player2;
              player2.logSkill("junqimrfz");
              for (const target of result2.targets) {
                await target.recover();
              }
              for (const target of result2.targets) {
                if (target === player2) continue;
                const num = target.countCards("h");
                if (num < min) {
                  min = num;
                  min_player = target;
                } else if (num === min) {
                  min_player = void 0;
                }
              }
              if (min_player) {
                await min_player.draw();
              } else {
                await game.delayx();
              }
            }
          },
          group: "junqimrfz_rem",
          ai: {
            expose: 0.6
          }
        },
        jingong: {
          mark: true,
          marktext: "军旗",
          intro: {
            name: "军旗（进攻之旗）",
            content: "当与你距离不大于2的其他角色受到伤害时，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1"
          },
          trigger: { global: "damageBegin3" },
          filter: function(event2, player2) {
            return get.distance(player2, event2.player) <= 2 && event2.player.isIn() && event2.player != player2 && player2.countCards("he") > 0;
          },
          prompt: function(event2, player2) {
            return "【军旗(进攻之旗)】:是否弃置一张牌，令此伤害对" + get.translation(event2.player) + "+1？";
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) < 0;
          },
          async content(event2, trigger2, player2) {
            player2.chooseToDiscard("he", true, "弃置一张牌");
            trigger2.num++;
            player2.logSkill("junqimrfz", trigger2.player);
          },
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + 1;
            }
          },
          group: "junqimrfz_rem",
          ai: {
            expose: 0.8
          }
        },
        zhiyuan: {
          mark: true,
          marktext: "军旗",
          intro: {
            name: "军旗（支援之旗）",
            content: "与其距离不大于1的角色受到伤害后，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1"
          },
          trigger: { global: "damageEnd" },
          filter: function(event2, player2) {
            return get.distance(player2, event2.player) <= 1 && event2.player.isIn();
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) > 0;
          },
          prompt: function(event2, player2) {
            if (event2.player == player2) return "【军旗(支援之旗)】:你是否摸一张牌？";
            return "【军旗(支援之旗)】:是否摸一张牌并交给" + get.translation(event2.player) + "一张牌？";
          },
          async content(event2, trigger2, player2) {
            let result2;
            player2.draw();
            player2.logSkill("junqimrfz", trigger2.player);
            if (trigger2.player != player2) {
              result2 = await player2.chooseCard(true, "he", "交给" + get.translation(trigger2.player) + "一张牌").set("ai", function(card) {
                if (get.position(card) == "e") return -1;
                if (card.name == "shan" || card.name == "tao" || card.name == "jiu") return 1;
                return 0;
              }).forResult();
            } else {
              return;
            }
            if (result2 && result2.cards) player2.give(result2.cards, trigger2.player, "give");
          },
          group: ["junqimrfz_draw", "junqimrfz_rem"],
          ai: {
            expose: 0.4
          }
        },
        draw: {
          audio: "junqimrfz",
          forced: true,
          trigger: { player: "phaseDrawBegin2" },
          async content(event2, trigger2, player2) {
            trigger2.num++;
          }
        },
        get: {
          audio: "junqimrfz",
          forced: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          async content(event2, trigger2, player2) {
            const str1 = "【支援之旗】:与其距离不大于 1 的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数 +1";
            const str2 = "【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至 4 张";
            const str3 = "【进攻之旗】:当与你距离不大于 2 的角色受到伤害后，你可以弃置一张牌，令此伤害 +1；使用【杀】的次数 +1";
            let result2;
            result2 = await player2.chooseControl("支援之旗", "治愈之旗", "进攻之旗").set("choiceList", [str1, str2, str3]).set("ai", (event3, player3) => {
              return [0, 2].randomGet();
            }).forResult();
            const list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
            for (let i = 0; i < list.length; i++) {
              if (result2.index === i) {
                player2.addSkill(list[i]);
              }
            }
            player2.removeSkill("junqimrfz_get");
          }
        },
        reget: {
          forced: true,
          trigger: { player: "phaseZhunbeiBegin" },
          async content(event2, trigger2, player2) {
            const list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
            let result2;
            player2.logSkill("junqimrfz");
            if (game.hasPlayer((current) => {
              return current.hasSkill("junqimrfz_zhiyuan") || current.hasSkill("junqimrfz_jingong") || current.hasSkill("junqimrfz_zhiyu");
            })) {
              game.countPlayer((current) => {
                for (let i = 0; i < list.length; i++) {
                  if (current.hasSkill(list[i]) && current !== player2) {
                    current.removeSkill(list[i]);
                    player2.addSkill(list[i]);
                  }
                }
                return true;
              });
            }
            result2 = await player2.chooseControl("确定", "cancel2").set("prompt", get.prompt("junqimrfz")).set("prompt2", "是否更换‘军旗’类型").forResult();
            if (result2.control === "cancel2") {
              return;
            } else {
              for (let i = 0; i < list.length; i++) {
                if (player2.hasSkill(list[i])) {
                  player2.removeSkill(list[i]);
                }
              }
            }
            const str1 = "【支援之旗】:与其距离不大于 1 的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数 +1";
            const str2 = "【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至 4 张";
            const str3 = "【进攻之旗】:当与你距离不大于 2 的角色受到伤害后，你可以弃置一张牌，令此伤害 +1；使用【杀】的次数 +1";
            result2 = await player2.chooseControl("支援之旗", "治愈之旗", "进攻之旗").set("choiceList", [str1, str2, str3]).set("ai", (event3, player3) => {
              const num = Math.random();
              if (player3.hp <= 1) return 1;
              if (num > 0.6) return 2;
              if (num < 0.3) return 0;
              else return [0, 1, 2].randomGet();
            }).forResult();
            for (let i = 0; i < list.length; i++) {
              if (result2.index === i) {
                player2.addSkill(list[i]);
              }
            }
          }
        }
      }
    },
    zhiqimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card, player2, target) {
        return target != player2;
      },
      selectTarget: 1,
      filter: function(event2, player2) {
        return player2.hasSkill("junqimrfz_zhiyuan") || player2.hasSkill("junqimrfz_jingong") || player2.hasSkill("junqimrfz_zhiyu");
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        const list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
        for (const skill of list) {
          if (player2.hasSkill(skill)) {
            target.addSkill(skill);
            player2.removeSkill(skill);
          }
        }
      },
      group: "junqimrfz_rem",
      ai: {
        order: 1,
        expose: 0.8,
        threaten: 1.1,
        result: {
          target: function(player2, target) {
            if (get.attitude(player2, target) < 0) return 0;
            if (get.attitude(player2, target) > 0) return 1;
          }
        }
      }
    },
    butuimrfz: {
      audio: 2,
      direct: true,
      trigger: { global: "phaseBegin" },
      filter: function(event2, player2) {
        return event2.player.hasSkill("junqimrfz_zhiyuan") || event2.player.hasSkill("junqimrfz_jingong") || event2.player.hasSkill("junqimrfz_zhiyu");
      },
      async content(event2, trigger2, player2) {
        const list = ["摸一张牌"];
        let result2;
        if (trigger2.player.countCards("he") > 0) {
          list.add("弃两张牌并跳过判定阶段");
        }
        result2 = await trigger2.player.chooseControl(list, "cancel2").set("prompt2", get.prompt("butuimrfz")).set("prompt", "请选择一项").set("ai", () => {
          const aiPlayer = _status.event.playerx;
          if (aiPlayer.countCards("j") > 0 && aiPlayer.countCards("he") > 0) return 1;
          else return 0;
        }).set("playerx", trigger2.player).forResult();
        if (result2.control !== "cancel2") {
          if (result2.control === "摸一张牌") {
            await trigger2.player.draw();
            trigger2.player.logSkill("butuimrfz");
          } else if (trigger2.player.countCards("he") > 0) {
            await trigger2.player.chooseToDiscard("he", true, "弃置两张牌", 2);
            trigger2.player.addTempSkill("butuimrfz_skip", {
              global: "phaseEnd"
            });
            player2.logSkill("butuimrfz", trigger2.player);
          }
        }
      },
      subSkill: {
        skip: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseJudgeBefore" },
          async content(event2, trigger2, player2) {
            trigger2.cancel();
          }
        }
      }
    },
    //老鲤
    linhuamrfz: {
      audio: 4,
      forced: true,
      trigger: { source: "damageBegin3" },
      filter: function(event2, player2) {
        return event2.source != void 0;
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
        trigger2.player.damage("nosource", trigger2.num);
      },
      group: ["linhuamrfz_anti", "linhuamrfz_skip"],
      subSkill: {
        anti: {
          direct: true,
          trigger: { player: "damageBegin3" },
          filter: function(event2, player2) {
            if (!event2.nature) return false;
            return player2.countCards("he") >= 2 && event2.source != void 0;
          },
          logTarget: "source",
          async content(event2, trigger2, player2) {
            const result2 = await player2.chooseToDiscard("he", false, 2, "你可以弃置两张牌将此伤害转移给" + get.translation(trigger2.source)).forResult();
            if (result2.cards) {
              trigger2.cancel();
              trigger2.source.damage(trigger2.num, trigger2.nature);
              player2.logSkill("linhuamrfz", trigger2.source);
            }
          }
        },
        skip: {
          direct: true,
          trigger: { player: "phaseJudgeBegin" },
          filter: function(event2, player2) {
            return player2.countCards("h") >= 2 && player2.countCards("j");
          },
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseToDiscard("h", false, 2, "你可以弃置两张牌并移动一张你判定区内的一张牌").set("ai", (card) => {
              return 6 - get.value(card);
            }).forResult();
            if (result2.cards && result2.cards.length) {
              const cards = player2.getCards("j");
              result2 = await player2.chooseButton(["将你判定区的一张牌移动至一名角色的判定区", cards]).forResult();
            } else {
              return;
            }
            if (result2.links && result2.links.length) {
              event2.card = result2.links[0];
              result2 = await player2.chooseTarget(true, "选择" + get.translation(event2.card) + "的移动目标", (card, player3, target) => {
                return target !== player3 && target.canAddJudge(event2.card);
              }).forResult();
            } else {
              return;
            }
            if (result2.targets) {
              const target = result2.targets[0];
              player2.$give(event2.card, target);
              await game.delayx();
              player2.logSkill("linhuamrfz");
              const name = event2.card.viewAs || event2.card.name;
              if (event2.card.name !== name) {
                target.addJudge(name, event2.card);
              } else {
                target.addJudge(event2.card);
              }
            }
          }
        }
      }
    },
    mingshimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 2,
      filterTarget: function(card, player2, target) {
        return target != player2 && !target.hasSkill("mingshimrfz2");
      },
      selectTarget: 1,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        let result2;
        result2 = await player2.chooseCard("he", "请选择一张牌交给" + get.translation(target), true).set("ai", (card) => {
          return 6 - get.value(card);
        }).forResult();
        player2.addTempSkill("mingshimrfz2");
        if (result2.cards && result2.cards.length) {
          await player2.give(result2.cards, target);
          target.addTempSkill("mingshimrfz2");
          player2.line(target);
        }
        player2.viewHandcards(target);
        game.log(player2, "观看了", target, "的手牌");
        if (target.countCards("h") > 3) {
          await player2.discardPlayerCard(target, "h", [1, 3]).set("forceAuto", true);
          target.addSkill("mingshimrfz_draw1");
          return;
        } else {
          result2 = await player2.chooseControl("令其摸一张", "令其摸两张").set("prompt", "【明事】:请选择一项").set("prompt2", "你可以令其摸[2/1]张牌，然后于下一个准备阶段弃置[1/2]张牌").set("ai", () => {
            const att = get.attitude(target, player2);
            if (att > 0) return 1;
            return 0;
          }).forResult();
        }
        if (result2.index === 0) {
          await target.draw();
          target.addSkill("mingshimrfz_dis2");
        } else {
          await target.draw(2);
          target.addSkill("mingshimrfz_dis1");
        }
      },
      group: "mingshimrfz_ed",
      subSkill: {
        ed: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseJieshuBegin" },
          filter: function(event2, player2) {
            return player2.hasSkill("mingshimrfz2");
          },
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        },
        draw1: {
          direct: true,
          charlotte: true,
          trigger: { player: "phaseJieshuBegin" },
          async content(event2, trigger2, player2) {
            player2.draw();
            player2.removeSkill("mingshimrfz_draw1");
          }
        },
        dis1: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return player2.countCards("he") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.chooseToDiscard("he", true, "【明事】:弃置一张牌");
            player2.removeSkill("mingshimrfz_dis1");
          }
        },
        dis2: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return player2.countCards("he") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.chooseToDiscard("he", true, 2, "【明事】:弃置两张牌");
            player2.removeSkill("mingshimrfz_dis2");
          }
        }
      },
      ai: {
        order: 1,
        expose: 0.2,
        threaten: 1.2,
        result: {
          target: function(player2, target) {
            var att = get.attitude(player2, target);
            if (att > 0 && target.countCards("h") < 3) return 1;
            if (att < 0) return -1;
          }
        }
      }
    },
    mingshimrfz2: {},
    jixiongmrfz: {
      group: "jixiongmrfz2",
      audio: 2,
      forced: true,
      trigger: { global: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return event2.player.hasMark("jixiongxmrfz");
      },
      async content(event2, trigger2, player2) {
        let result2;
        while (true) {
          result2 = await trigger2.player.judge((card) => {
            const color = get.color(card);
            if (color === "black") return 4;
            return -4;
          }).forResult();
          trigger2.player.removeMark("jixiongxmrfz");
          if (result2.color === "black") {
            result2 = await trigger2.player.chooseToDiscard("he", true, "【吉凶】:请弃置一张牌").forResult();
            await trigger2.player.loseHp();
          } else {
            if (result2.cards && result2.cards.length) {
              await player2.gain(result2.cards, "gain2");
            }
          }
          if (!trigger2.player.hasMark("jixiongxmrfz")) break;
        }
      },
      ai: {
        expose: 0.9
      }
    },
    jixiongmrfz2: {
      trigger: { global: "gainEnd" },
      filter: function(event2, player2) {
        return event2.source && event2.source.hasSkill("jixiongmrfz");
      },
      logTarget: "source",
      direct: true,
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseControl("确定", "取消").set("prompt", "是否发动【吉凶】？").set("ai", function() {
          var att = get.attitude(trigger2.source, player2);
          if (att > 0) return 1;
          return 0;
        }).forResult();
        if (result2.control == "确定") {
          trigger2.player.addMark("jixiongxmrfz");
        }
      }
    },
    jixiongxmrfz: {
      charlotte: true,
      intro: {
        content: "准备阶段，你进行一次判定，若判定结果为黑色，则你须弃置一张牌并流失一点体力，然后弃置‘符纸’标记"
      }
    },
    //阿
    guaijiemrfz: {
      audio: 2,
      forced: true,
      firstDo: true,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        return !player2.storage.guaijiemrfz;
      },
      async content(event2, trigger2, player2) {
        player2.loseHp();
      },
      group: "guaijiemrfz_damage",
      subSkill: {
        damage: {
          audio: "guaijiemrfz",
          forced: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return !player2.storage.guaijiemrfz;
          },
          async content(event2, trigger2, player2) {
            player2.storage.guaijiemrfz = true;
            player2.addSkill("guaijiemrfz_remove");
            const result2 = await player2.chooseTarget(true, "弃置一名角色区域内的一张牌", function(card, player3, target2) {
              return target2.countCards("hej") > 0;
            }).set("ai", function(target2) {
              var player3 = _status.event.player;
              var att = get.attitude(player3, target2);
              if (att < 0) {
                att = -Math.sqrt(-att);
              } else {
                att = Math.sqrt(att);
              }
              return att * lib.card.guohe.ai.result.target(player3, target2);
            }).forResult();
            if (result2.targets) {
              var target = result2.targets[0];
              player2.discardPlayerCard(target, "hej", true);
            }
          }
        },
        remove: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.storage.guaijiemrfz = false;
            player2.removeSkill("guaijiemrfz_remove");
          }
        }
      }
    },
    qizhenmrfz: {
      audio: 2,
      enable: "phaseUse",
      filterTarget: function(card, player2, target) {
        return target != player2;
      },
      selectTarget: 1,
      usable: 1,
      async content(event2, trigger2, player2) {
        const { target } = event2;
        let result2;
        let skipStep1 = false;
        if (target.countCards("he") === 0) {
          await target.damage();
          skipStep1 = true;
        } else {
          const str1 = "令" + get.translation(target) + "弃置两张牌";
          const str2 = "对" + get.translation(target) + "造成一点伤害";
          result2 = await player2.chooseControl(str1, str2).set("prompt", "【奇针】:请选择一项").set("ai", () => {
            if (target.hp > 2 && target.countCards("he") < 4) return 1;
            return 0;
          }).forResult();
        }
        if (!skipStep1) {
          if (result2 && result2.index === 0) {
            await target.chooseToDiscard("he", true, 2, "【奇针】:请弃置两张牌");
          } else {
            await target.damage();
          }
        }
        target.addTempSkill("qizhenmrfz_effect", {
          player: "phaseEnd"
        });
        target.changeHujia();
      },
      subSkill: {
        effect: {
          audio: "qizhenmrfz",
          trigger: { player: "useCard" },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.card.name == "sha" || event2.card.name == "juedou";
          },
          async content(event2, trigger2, player2) {
            trigger2.baseDamage++;
          }
        }
      }
    },
    guaiyaomrfz: {
      audio: 4,
      forced: true,
      trigger: { source: "damageBegin3" },
      filter: function(event2, player2) {
        return event2.player != player2;
      },
      async content(event2, trigger2, player2) {
        var target = trigger2.player;
        var num = Math.random();
        if (num < 0.1) {
          target.addTempSkill("guaiyaomrfz_skip", {
            player: "phaseEnd"
          });
          player2.popup("怪药·跳过");
          game.log(player2, "的【怪药】结果为<span class=thundertext>【怪药·跳过】</span>");
        }
        if (num >= 0.1 && num < 0.325) {
          player2.getDamagedHp() > 0 ? player2.recover(2) : player2.changeHujia();
          player2.popup("怪药·回复");
          game.log(player2, "的【怪药】结果为<span class=thundertext>【怪药·回复】</span>");
        }
        if (num >= 0.325 && num < 0.55) {
          target.chooseToDiscard("he", true, "【怪药】:请弃置一张牌");
          player2.popup("怪药·弃牌");
          game.log(player2, "的【怪药】结果为<span class=thundertext>【怪药·弃牌】</span>");
        }
        if (num >= 0.55 && num < 0.775) {
          target.addTempSkill("guaiyaomrfz_decrease", {
            player: "phaseDrawAfter"
          });
          player2.popup("怪药·摸牌减少");
          game.log(player2, "的【怪药】结果为<span class=thundertext>【怪药·摸牌减少】</span>");
        }
        if (num >= 0.775) {
          player2.draw();
          player2.popup("怪药·摸牌");
          game.log(player2, "的【怪药】结果为<span class=thundertext>【怪药·摸牌】</span>");
        }
      },
      subSkill: {
        skip: {
          mark: true,
          intro: {
            content: "跳过下个出牌和弃牌阶段"
          },
          audio: "guaiyaomrfz",
          forced: true,
          charlotte: true,
          trigger: {
            player: ["phaseUseBegin", "phaseDiscardBefore"]
          },
          async content(event2, trigger2, player2) {
            trigger2.cancel();
          }
        },
        decrease: {
          mark: true,
          intro: {
            content: "下个摸牌阶段摸牌数-1"
          },
          audio: "guaiyaomrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "phaseDrawBegin2" },
          async content(event2, trigger2, player2) {
            trigger2.num--;
          }
        }
      }
    },
    //黑
    heishimrfz: {
      audio: 2,
      forced: true,
      trigger: { source: "damageBegin3" },
      filter: function(event2, player2) {
        return (get.distance(player2, event2.player) <= (player2.hasSkill("junumrfz_effect") ? 3 : 1) || event2.player.getEquip(2)) && event2.card && event2.card.name == "sha";
      },
      async content(event2, trigger2, player2) {
        if (get.distance(player2, trigger2.player) <= (player2.hasSkill("junumrfz_effect") ? 3 : 1)) trigger2.num++;
        if (trigger2.player.getEquip(2)) trigger2.num++;
      },
      group: "heishimrfz_wushi",
      mod: {
        playerEnabled: function(card, player2, target) {
          if (!player2.hasSkill("junumrfz_effect") && get.distance(player2, target) > 2 && card.name == "sha") return false;
        }
      },
      subSkill: {
        wushi: {
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2) {
            return event2.card.name == "sha";
          },
          forced: true,
          logTarget: "target",
          async content(event2, trigger2, player2) {
            if (player2.hasSkill("heishimrfz")) player2.logSkill("heishimrfz");
            trigger2.target.addTempSkill("heishimrfz_wushi2");
            trigger2.target.storage.heishimrfz_wushi2.add(trigger2.card);
            trigger2.target.markSkill("heishimrfz_wushi2");
          },
          ai: {
            unequip_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              if (arg && arg.name == "sha") return true;
              return false;
            }
          }
        },
        wushi2: {
          firstDo: true,
          ai: { unequip2: true },
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
          filter: function(event2, player2) {
            return player2.storage.heishimrfz_wushi2 && event2.card && player2.storage.heishimrfz_wushi2.includes(event2.card) && (event2.name != "damage" || event2.notLink());
          },
          silent: true,
          forced: true,
          popup: false,
          priority: 12,
          async content(event2, trigger2, player2) {
            player2.storage.heishimrfz_wushi2.remove(trigger2.card);
            if (!player2.storage.heishimrfz_wushi2.length) player2.removeSkill("heishimrfz_wushi2");
          },
          marktext: "※",
          intro: { content: "当前防具技能已失效" }
        }
      },
      ai: {
        threaten: 1.2
      }
    },
    ruitongmrfz: {
      audio: 2,
      trigger: { global: "useCardAfter" },
      filter: function(event2, player2) {
        if (!player2.hasSkill("junumrfz_effect") && get.distance(player2, event2.player) > 2 && player2.hasSkill("heishimrfz")) return false;
        return event2.player && event2.player.isAlive() && event2.player != player2 && get.subtype(event2.card) == "equip2" && player2.inRange(event2.player);
      },
      prompt: function(event2, player2) {
        return "是否对" + get.translation(event2.player) + "视为使用一张【杀】";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      async content(event2, trigger2, player2) {
        player2.useCard({ name: "sha", isCard: true }, true, trigger2.player);
      },
      ai: {
        expose: 0.9,
        threaten: 0.8
      }
    },
    junumrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      unique: true,
      mark: true,
      limited: true,
      skillAnimation: true,
      animationStr: "巨弩",
      animationColor: "orange",
      check: function(event2, player2) {
        if (!game.hasPlayer(function(current) {
          return current != player2 && get.attitude(current, player2) < 0;
        }))
          return false;
        return player2.countCards("h", "sha") >= 2;
      },
      init: function(player2) {
        player2.storage.junumrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.junumrfz;
      },
      async content(event2, trigger2, player2) {
        player2.storage.junumrfz = true;
        player2.addTempSkill("junumrfz_effect");
        player2.awakenSkill(event2.name);
      },
      subSkill: {
        effect: {
          mod: {
            targetInRange: function(card, player2, target, now) {
              if (card.name == "sha") return true;
            },
            selectTarget: function(card, player2, range) {
              if (card.name == "sha" && range[1] != -1) range[1]++;
            },
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + 1;
            }
          },
          charlotte: true
        }
      },
      ai: {
        threaten: 1.1
      }
    },
    //重岳
    wubenmrfz: {
      audio: 2,
      trigger: { player: "phaseUseBegin" },
      firstDo: true,
      direct: true,
      filter: function(event2, player2) {
        if (player2.countCards("h") == 0) return false;
        return !player2.getEquip(1) && game.hasPlayer(function(target) {
          return target != player2 && player2.inRange(target);
        });
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseCard("h", "你可以使用一张【杀】").set("ai", function(card) {
          if (game.hasPlayer(function(current) {
            return current != player2 && player2.inRange(current) && get.attitude(player2, current) < 0;
          }))
            return 6 - get.value(card);
          return 0;
        }).forResult();
        if (result2.cards) {
          player2.chooseUseTarget({ name: "sha" }, result2.cards, true, false);
          player2.logSkill("wubenmrfz");
        }
      },
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha" && !player2.getEquip(1)) return num + 1;
        },
        maxHandcard: function(player2, num) {
          return num += Math.floor((5 - player2.countCards("e")) / 2);
        }
      }
    },
    wowumrfz: {
      intro: {
        content: function(event2, player2) {
          if (player2.countMark("wowumrfz_time") >= 5)
            return "<span class=firetext>【气收秋毫平】</span></br>已使用" + player2.countMark("wowumrfz") + "张牌";
          return "<span class=firetext>【劲发江潮落】</span></br>已使用" + player2.countMark("wowumrfz") + "张牌</br>已发动" + player2.countMark("wowumrfz_time") + "次【我无】";
        }
      },
      onremove: true,
      derivation: "wowumrfz_rewrite",
      audio: 4,
      trigger: { player: "useCardAfter" },
      direct: true,
      filter: function(event2, player2) {
        if ((player2 != _status.currentPhase || !player2.isPhaseUsing()) && player2.countMark("wowumrfz_time") < 5) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        let result2;
        player2.addMark("wowumrfz", 1, false);
        if (player2.countMark("wowumrfz") >= 3 && !player2.hasMark("shubianmrfz")) {
          result2 = await player2.chooseTarget(false, get.prompt("wowumrfz"), "你可以对一名其他角色使用一张【杀】", (card, player3, target) => {
            return player3.countMark("wowumrfz_time") >= 5 ? target !== player3 : target !== player3 && player3.inRange(target);
          }).set("ai", (target) => {
            return -get.attitude(player2, target);
          }).forResult();
          player2.removeMark("wowumrfz", 3, false);
          if (player2.countMark("wowumrfz_time") < 5) {
            player2.addMark("wowumrfz_time", 1, false);
          }
        } else if (player2.countMark("wowumrfz") >= 3) {
          if (player2.countMark("wowumrfz_time") < 5) {
            player2.addMark("wowumrfz_time", 1, false);
          }
          player2.removeMark("wowumrfz", 3, false);
        } else {
          return;
        }
        if (result2?.bool && result2?.targets) {
          await player2.useCard({ name: "sha", isCard: true }, true, false, result2.targets);
          player2.logSkill("wowumrfz", result2.targets);
          if (player2.countMark("wowumrfz_time") >= 5) {
            await player2.draw();
          }
        }
      },
      group: "wowumrfz_draw",
      subSkill: {
        draw: {
          direct: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            var evt = event2.getParent(3);
            if (!event2.card) return false;
            var sha = event2.card.name == "sha";
            return player2.countMark("wowumrfz_time") < 5 && evt && evt.name == "wowumrfz" && evt.player == player2 && sha;
          },
          async content(event2, trigger2, player2) {
            player2.draw();
            player2.logSkill("wowumrfz");
          }
        }
      },
      ai: {
        threaten: 1.3,
        expose: 0.2
      }
    },
    shubianmrfz: {
      audio: 4,
      trigger: { player: "damageEnd" },
      filter: function(event2, player2) {
        return event2.source != player2 && event2.source.isAlive() && event2.source != void 0;
      },
      check(event2, player2) {
        return get.attitude(player2, event2.source) < 0;
      },
      async content(event2, trigger2, player2) {
        let source = trigger2.source;
        source.addTempSkill("shubianmrfz_eff", { global: "phaseAfter" });
        source.markSkill("shubianmrfz_eff");
        if (source.countDiscardableCards(player2, "e")) {
          player2.discardPlayerCard("e", source).set("target", source).set("complexSelect", true).set("ai", lib.card.guohe.ai.button).set("prompt", `你可以弃置${get.translation(source)}装备区的一张牌`);
        }
      },
      subSkill: {
        eff: {
          charlotte: true,
          silent: true,
          mark: true,
          intro: {
            content: "·手牌上限+2<br>·无法使用手牌中的伤害类牌"
          },
          onremove(player2) {
            player2.unmarkSkill("shubianmrfz_eff");
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num += 2;
            },
            cardEnabled2(card, player2) {
              if (get.position(card) === "h" && get.tag(card, "damage")) {
                return false;
              }
            }
          }
        }
      },
      ai: {
        threaten: 0.8
      }
    },
    //安洁莉娜
    fanzhongmrfz: {
      intro: {
        content: "重力紊乱"
      },
      audio: 4,
      global: ["fanzhongmrfz2", "fanzhongmrfz_gain", "fanzhongmrfz_gain2", "fanzhongmrfz_lose"],
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return game.hasPlayer(function(target) {
          return target != player2 && player2.inRange(target) && target.countMark("fanzhongmrfz") < 3;
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget(
          get.prompt("fanzhongmrfz"),
          "你可以选择攻击范围内的一名其他角色，令其获得‘反重’标记",
          function(card, player3, target) {
            return target != player3 && player3.inRange(target) && target.countMark("fanzhongmrfz") < 3;
          }
        ).set("ai", (target) => -get.attitude2(target)).forResult();
        if (result2.bool && result2.targets) {
          result2.targets[0].addMark("fanzhongmrfz");
          player2.logSkill("fanzhongmrfz", result2.targets[0]);
        }
      },
      subSkill: {
        gain: {
          direct: true,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            return player2.hasMark("fanzhongmrfz") && player2.getExpansions("fanzhongmrfz2").length > 0;
          },
          async content(event2, trigger2, player2) {
            let result2;
            const cards = player2.getExpansions("fanzhongmrfz2");
            if (cards.length) result2 = await player2.chooseButton(["获得一张牌", cards], true).forResult();
            else return;
            if (result2 && result2.links) player2.gain(result2.links, "gain2");
          }
        },
        gain2: {
          direct: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: "phaseDiscardBefore" },
          filter: function(event2, player2) {
            return player2.hasMark("fanzhongmrfz");
          },
          async content(event2, trigger2, player2) {
            const cards = player2.getExpansions("fanzhongmrfz2");
            if (cards) player2.gain(cards, "gain2");
            player2.removeMark("fanzhongmrfz", player2.countMark("fanzhongmrfz"), false);
          }
        },
        lose: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { player: "die" },
          filter: function(event2, player2) {
            return player2.hasMark("fanzhongmrfz");
          },
          async content(event2, trigger2, player2) {
            const cards = player2.getExpansions("fanzhongmrfz2");
            player2.removeMark("fanzhongmrfz", player2.countMark("fanzhongmrfz"), false);
            if (cards) player2.loseToDiscardpile(cards);
          }
        }
      },
      ai: {
        expose: 0.6,
        threaten: 1.2
      }
    },
    fanzhongmrfz2: {
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards = player2.getExpansions(skill);
        if (cards.length) player2.loseToDiscardpile(cards);
      },
      charlotte: true,
      direct: true,
      trigger: { player: "gainEnd" },
      filter: function(event2, player2) {
        if (event2.player.getExpansions("fanzhongmrfz2").length >= 6) return false;
        return player2.hasMark("fanzhongmrfz") && event2.parent && event2.parent.name != "fanzhongmrfz_gain" && event2.parent.name != "fanzhongmrfz_gain2";
      },
      async content(event2, trigger2, player2) {
        player2.addToExpansion(trigger2.cards, player2, "give").gaintag.add("fanzhongmrfz2");
        player2.logSkill("fanzhongmrfz");
      }
    },
    xinshimrfz: {
      mod: {
        ignoredHandcard: function(card, player2) {
          if (card.hasGaintag("xinshimrfz")) {
            return true;
          }
        },
        cardDiscardable: function(card, player2, name) {
          if (name == "phaseDiscard" && card.hasGaintag("xinshimrfz")) {
            return false;
          }
        }
      },
      audio: 4,
      enable: "phaseUse",
      discard: false,
      lose: false,
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      filterTarget: function(card, player2, target) {
        return target != player2 && !target.tempSkills.xinshimrfz2 && !target.hasMark("xinshimrfz");
      },
      filterCard: function(card, player2) {
        return !player2.storage.xinshimrfz || !player2.storage.xinshimrfz.includes(get.type(card, "trick"));
      },
      check: function(card) {
        return 10 - get.value(card);
      },
      delay: 0,
      prompt: "你可以将一张本回合你未以此法交出过的类型的牌交给本回合你未以此法选择过的角色",
      async content(event2, trigger2, player2) {
        const { cards, target } = event2;
        let result2;
        if (!player2.storage.xinshimrfz) player2.storage.xinshimrfz = [];
        player2.storage.xinshimrfz.push(get.type(cards[0], "trick"));
        await player2.give(cards, target);
        target.addTempSkill("xinshimrfz2");
        const mark = player2.storage.xinshimrfz.length;
        if (mark === 1) {
          await player2.draw();
          return;
        }
        if (mark !== 3) {
          if (target.countCards("h") > 0) {
            result2 = await target.chooseCard("h", true).forResult();
          } else {
            return;
          }
          if (result2?.cards?.length) {
            await target.give(result2.cards, player2);
            await target.draw();
          }
          return;
        }
        if (player2.storage.xinshimrfz.length === 3) {
          result2 = await player2.chooseTarget(true, "【信使】:请选择一名其他角色，令其获得‘反重’标记", (card, player3, target2) => {
            return target2 !== player3 && !target2.hasMark("xinshimrfz");
          }).set("ai", (target2) => {
            return -get.attitude(player2, target2);
          }).forResult();
          player2.logSkill("xinshimrfz");
        } else {
          return;
        }
        if (result2?.bool && result2?.targets?.length) {
          result2.targets[0].addMark("fanzhongmrfz");
        }
      },
      ai: {
        order: 9,
        expose: 0.2,
        threaten: 1.2,
        result: {
          target: function(player2, target) {
            if (player2.countCards("h") > 2) return 1;
          }
        }
      },
      group: ["xinshimrfz_clear", "xinshimrfz_give"],
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          direct: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.xinshimrfz = [];
            player2.removeGaintag("xinshimrfz");
          }
        },
        give: {
          direct: true,
          trigger: { player: "gainEnd" },
          filter: function(event2, player2) {
            return event2.source;
          },
          logTarget: "source",
          async content(event2, trigger2, player2) {
            let result2;
            if (trigger2.cards.length) {
              player2.addMark("xinshimrfz_give", trigger2.cards.length, false);
            }
            while (player2.countMark("xinshimrfz_give") >= 2) {
              result2 = await player2.chooseControl("basic", "trick", "equip", "cancel2").set("prompt", "选择获得一种类型的牌").set("ai", () => {
                const aiPlayer = _status.event.player;
                if (aiPlayer.hp <= 3 && !aiPlayer.countCards("h", {
                  name: ["shan", "tao"]
                }))
                  return "basic";
                if (aiPlayer.countCards("he", {
                  type: "equip"
                }) < 2)
                  return "equip";
                return "trick";
              }).forResult();
              player2.removeMark("xinshimrfz_give", 2, false);
              if (result2.control !== "cancel2") {
                const card = get.cardPile2((c) => {
                  return get.type(c, "trick") === result2.control;
                });
                if (card) {
                  const next = player2.gain(card, "gain2", "log");
                  next.gaintag.add("xinshimrfz");
                  await next;
                }
                player2.logSkill("xinshimrfz");
              }
            }
          }
        }
      }
    },
    xinshimrfz2: {},
    //号角
    dunpaomrfz: {
      derivation: "dunpaomrfz_rewrite",
      audio: 2,
      trigger: { player: "phaseBegin" },
      check: function(event2, player2) {
        return (
          //@ts-ignore
          game.countPlayer() <= 4 && game.hasPlayer(function(current) {
            return get.attitude(player2, current) < 0 && get.distance(player2, current) == 1;
          }) || !game.hasPlayer(function(current) {
            return get.attitude(player2, current) >= 0 && current != player2;
          })
        );
      },
      filter: function(event2, player2) {
        return !player2.storage.dunpaomrfz;
      },
      async content(event2, trigger2, player2) {
        player2.storage.dunpaomrfz = true;
      },
      mod: {
        maxHandcard: function(player2, num) {
          if (player2.storage.dunpaomrfz) return num + 2;
        },
        playerEnabled: function(card, player2, target) {
          if (!player2.storage.dunpaomrfz && get.distance(player2, target) <= 1 && target != player2) return false;
        },
        attackRange: function(player2, num) {
          if (!player2.storage.dunpaomrfz) return num + 5;
        }
      },
      group: "dunpaomrfz_add",
      subSkill: {
        add: {
          audio: "biaohaomrfz",
          forced: true,
          trigger: { source: "damageBegin3" },
          filter: function(event2, player2) {
            if (player2.storage.dunpaomrfz) return false;
            return event2.card && event2.card.name == "sha" && event2.player != player2 && get.distance(player2, event2.player) > 1;
          },
          async content(event2, trigger2, player2) {
            const target = trigger2.player;
            const result2 = await target.judge(function(card) {
              var color = get.color(card);
              if (color == "black") return -4;
              return 0;
            }).set("judge2", (result3) => result3.bool == false ? true : false).forResult();
            if (result2.color == "black") trigger2.num++;
          }
        }
      }
    },
    biaohaomrfz: {
      audio: 6,
      chargeSkill: true,
      enable: "phaseUse",
      usable: 2,
      filter: function(event2, player2) {
        return player2.countMark("charge") < 4 && player2.hasCard(function(card) {
          return get.tag(card, "damage");
        });
      },
      filterCard: function(card) {
        return get.tag(card, "damage");
      },
      position: "he",
      check: function(card) {
        if (card.name == "sha") return 1;
        if (card.name == "nanman" || card.name == "wanjian") return -1;
        return 10 - get.value(card);
      },
      async content(event2, trigger2, player2) {
        player2.addMark("charge");
        player2.draw();
      },
      group: ["biaohaomrfz_usesha", "biaohaomrfz_allin"],
      subSkill: {
        usesha: {
          audio: "biaohaomrfz",
          enable: "chooseToUse",
          viewAs: { name: "sha", isCard: true },
          filterCard: function() {
            return false;
          },
          viewAsFilter: function(player2) {
            if (player2.countMark("charge") <= 0) return false;
          },
          selectCard: -1,
          prompt: "视为使用一张杀",
          async precontent(event2, trigger2, player2) {
            player2.removeMark("charge");
          },
          ai: {
            order: function() {
              var player2 = _status.event.player;
              if (!game.hasPlayer((current) => {
                return !!player2.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player2, player2) > 0;
              })) {
                return 0;
              }
              return 2.95;
            },
            skillTagFilter: function(player2, tag, arg) {
              if (arg != "use") return false;
            },
            respondSha: true
          }
        },
        allin: {
          enable: "phaseUse",
          filter: function(event2, player2) {
            return player2.countMark("charge") >= 4;
          },
          delay: 0,
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseControl("确定", "取消").set("prompt", get.prompt("biaohaomrfz")).set("prompt2", "你可以消耗 4 点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去 3 点体力。").forResult();
            if (result2.control === "取消") {
              return;
            } else {
              player2.logSkill("biaohaomrfz");
              player2.removeMark("charge", 4);
            }
            let num = 0;
            while (num < 4) {
              num++;
              await player2.chooseUseTarget(
                {
                  name: num < 4 ? "sha" : "wanjian",
                  isCard: true
                },
                "请选择【杀】的目标 (【杀】:" + (num < 4 ? num : 3) + "/3;【万箭齐发】:0/1)",
                false
              );
              player2.logSkill("biaohaomrfz");
            }
            await player2.loseHp(3);
          },
          ai: {
            order: 3,
            result: {
              player: 1
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
    xuezhanmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "dieBegin" },
      filter: function(event2, player2) {
        return !player2.storage.xuezhanmrfz;
      },
      async content(event2, trigger2, player2) {
        player2.storage.xuezhanmrfz = true;
        await player2.chooseToDiscard("hej", true, player2.countCards("hej"));
        trigger2.cancel();
        game.log(player2, "复活");
        if (player2.getDamagedHp()) player2.recover(player2.maxHp);
        if (player2.maxHp >= 2) player2.loseMaxHp(player2.maxHp - 2);
        else player2.gainMaxHp(2 - player2.maxHp);
        player2.draw(4);
        player2.link(false);
        player2.turnOver(false);
      }
    },
    //焰尾
    fengjianmrfz: {
      intro: {
        content: "当你使用下一张非的【闪】基本牌后，你可以视为使用一张相同的基本牌。"
      },
      audio: 2,
      trigger: { player: ["respond", "useCardAfter"] },
      forced: true,
      firstDo: true,
      filter: function(event2, player2) {
        if (!event2.respondTo) return false;
        return !player2.hasMark("fengjianmrfz");
      },
      async content(event2, trigger2, player2) {
        player2.addMark("fengjianmrfz");
      },
      group: "fengjianmrfz_use",
      subSkill: {
        use: {
          trigger: { player: "useCardAfter" },
          forced: true,
          firstDo: true,
          filter: function(event2, player2) {
            if (event2.card.name == "shan") return false;
            return player2.hasMark("fengjianmrfz") && get.type(event2.card) == "basic";
          },
          async content(event2, trigger2, player2) {
            var cards = trigger2.card;
            player2.removeMark("fengjianmrfz");
            if (cards.name == "tao" && player2.getDamagedHp() > 0 || cards.name != "shan") {
              player2.chooseUseTarget(cards, false, get.prompt2("fengjianmrfz"), "你可以使用一张" + get.translation(cards));
              player2.logSkill("fengjianmrfz");
            }
          }
        }
      }
    },
    hongsongmrfz: {
      intro: {
        content: "你有#个‘红松’标记</br>·有‘红松’标记的角色需要使用或打出闪时可以进行判定，若不为♥，视为使用一张【闪】并获得此判定牌，然后移除一个‘红松’标记。"
      },
      onremove: true,
      audio: 2,
      trigger: { player: ["respond", "useCardAfter"] },
      forced: true,
      filter: function(event2, player2) {
        var num = 0;
        for (var i = 0; i < game.players.length; i++) {
          if (game.players[i].hasMark("hongsongmrfz")) num += game.players[i].countMark("hongsongmrfz");
        }
        if (!event2.respondTo) return false;
        return num < 3;
      },
      async content(event2, trigger2, player2) {
        player2.addMark("hongsongmrfz");
      },
      group: ["hongsongmrfz_shan", "hongsongmrfz_give"],
      subSkill: {
        shan: {
          audio: "hongsongmrfz",
          trigger: {
            global: ["chooseToRespondBegin", "chooseToUseBegin"]
          },
          filter: function(event2, player2) {
            if (event2.responded) return false;
            if (!event2.filterCard || !event2.filterCard({ name: "shan" }, player2, event2)) return false;
            if (event2.name == "chooseToRespond" && !lib.filter.cardRespondable({ name: "shan" }, player2, event2)) return false;
            if (event2.player != player2 && !event2.player.hasMark("hongsongmrfz")) return false;
            return true;
          },
          forced: true,
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await trigger2.player.chooseControl("确定", "取消").set("prompt", get.prompt("hongsongmrfz")).set("prompt2", "你可以进行判定，若不为♥，其视为使用或打出一张【闪】并获得判定牌").forResult();
            if (result2.control === "确定") {
              const next = trigger2.player.judge((card) => {
                return get.suit(card) === "heart" ? -0.5 : 1.5;
              }).set("callback", lib.skill.hongsongmrfz_shan.callback);
              next.judge2 = (result3) => {
                return result3.bool;
              };
              result2 = await next.forResult();
            } else {
              return;
            }
            if (result2.judge > 0) {
              trigger2.untrigger();
              trigger2.set("responded", true);
              trigger2.result = {
                bool: true,
                card: { name: "shan", isCard: true }
              };
              if (trigger2.player !== player2) {
                trigger2.player.removeMark("hongsongmrfz");
              }
            }
          },
          async callback(event2, trigger2, player2) {
            if (get.suit(event2.card) != "heart") player2.gain(event2.card, "gain2");
          },
          ai: {
            respondShan: true
          }
        },
        give: {
          direct: true,
          trigger: { player: "phaseBegin" },
          filter: function(event2, player2) {
            return player2.hasMark("hongsongmrfz");
          },
          async content(event2, trigger2, player2) {
            let result2;
            while (player2.hasMark("hongsongmrfz")) {
              result2 = await player2.chooseTarget(get.prompt("hongsongmrfz"), "你可以将任意个'红松'标记交给任意名其他角色", (card, player3, target) => {
                return target !== player3;
              }).set("ai", (target) => {
                return get.attitude(player2, target) > 0;
              }).forResult();
              if (result2.bool && result2.targets && result2.targets.length) {
                const target = result2.targets[0];
                target.addMark("hongsongmrfz");
                player2.removeMark("hongsongmrfz");
                player2.logSkill("hongsongmrfz", target);
              } else {
                break;
              }
            }
          }
        }
      },
      ai: {
        threaten: 0.5
      }
    },
    //夕
    huijuanmrfz: {
      intro: { content: "记录的牌名:$" },
      onremove: true,
      audio: 2,
      forced: true,
      trigger: { global: "useCard" },
      filter: function(event2, player2) {
        if (get.type(event2.card) == "equip") return false;
        if (get.type(event2.card) == "trick" && player2.hasSkill("huijuanmrfz_trick")) return false;
        if (get.type(event2.card) == "basic" && player2.hasSkill("huijuanmrfz_basic")) return false;
        if (get.type(event2.card) == "delay" && player2.hasSkill("huijuanmrfz_delay")) return false;
        return !player2.getStorage("huijuanmrfz").includes(event2.card.name);
      },
      async content(event2, trigger2, player2) {
        player2.markAuto("huijuanmrfz", [trigger2.card.name]);
        if (get.type(trigger2.card) == "trick") player2.addSkill("huijuanmrfz_trick");
        if (get.type(trigger2.card) == "delay") player2.addSkill("huijuanmrfz_delay");
        if (get.type(trigger2.card) == "basic") player2.addSkill("huijuanmrfz_basic");
      },
      group: ["huijuanmrfz_use", "huijuanmrfz_clear"],
      subSkill: {
        //检测技能
        basic: {
          silent: true,
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("huijuanmrfz_basic");
          }
        },
        trick: {
          silent: true,
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("huijuanmrfz_trick");
          }
        },
        delay: {
          silent: true,
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("huijuanmrfz_delay");
          }
        },
        //非检测技能
        clear: {
          silent: true,
          direct: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.getStorage("huijuanmrfz").length;
          },
          async content(event2, trigger2, player2) {
            for (var i = 0; i < 2; i++) player2.unmarkAuto("huijuanmrfz", [player2.getStorage("huijuanmrfz")[0]]);
          }
        },
        use: {
          hiddenCard: function(player2, name) {
            if (name == "wuxie") return player2.getStorage("huijianmrfz").includes(name);
          },
          enable: ["chooseToRespond", "chooseToUse"],
          filter: function(event2, player2) {
            if (player2.getStorage("huijuanmrfz").length == 0 || player2.countCards("h") == 0) return false;
            for (var i = 0; i < player2.getStorage("huijuanmrfz").length; i++) {
              if (event2.filterCard(
                {
                  name: player2.getStorage("huijuanmrfz")[i]
                },
                player2,
                event2
              ))
                return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var list = [];
              var storage = player2.getStorage("huijuanmrfz");
              for (var i of lib.inpile) {
                if (event2.filterCard({ name: i }, player2, event2) && storage.includes(i))
                  list.push([get.type(i) == "basic" ? "基本" : "锦囊", "", i]);
              }
              return ui.create.dialog("绘卷", [list, "vcard"], "hidden");
            },
            filter: function(button, player2) {
              return lib.filter.cardEnabled(
                {
                  //@ts-ignore
                  name: button.link[2]
                },
                player2,
                _status.event.getParent()
              );
            },
            check: function(button) {
              var player2 = _status.event.player;
              var card = {
                //@ts-ignore
                name: button.link[2]
              };
              if (player2.getUseValue(card) > 0) return get.order(card);
              return -1;
            },
            backup: function(links, player2) {
              return {
                audio: "huijuanmrfz",
                popname: true,
                filterCard: true,
                position: "hs",
                viewAs: {
                  name: links[0][2]
                },
                check: function(card) {
                  return 6 - get.value(card);
                },
                async precontent(event2, trigger2, player3) {
                  const cards = event2.result.card;
                  if (!cards || !event2.parent) return;
                  if (cards.name == "sha" || cards.name == "jiu") event2.parent.addCount = false;
                  player3.unmarkAuto("huijuanmrfz", [cards.name]);
                }
              };
            },
            prompt: function(links, player2) {
              return "将一张手牌当做【" + get.translation(links[0][2]) + "】使用";
            }
          },
          ai: {
            order: 13,
            result: {
              player: 1
            }
          }
        }
      },
      ai: {
        threaten: 1.3
      }
    },
    dianjingmrfz: {
      mark: true,
      locked: false,
      zhuanhuanji: true,
      marktext: "☯",
      intro: {
        content: function(event2, player2) {
          return !player2.storage.dianjingmrfz ? "当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的牌名相同的牌。" : "当你使用转化牌时，你可以从牌堆中获得与你使用的转化牌的类型相同的牌。";
        }
      },
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        return !event2.card.isCard;
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        var cardt = get.cardPile2(function(card) {
          return get.type(card, "trick") == get.type(trigger2.card);
        });
        var cardf = get.cardPile2(trigger2.card.name);
        if (player2.storage.dianjingmrfz == true) {
          if (cardt) player2.gain(cardt, "gain2", "log");
          else player2.chat("牌堆中没有", cardt, "牌");
        } else {
          if (cardf) player2.gain(cardf, "gain2", "log");
          else player2.chat("牌堆中没有【" + get.translation(trigger2.card.name) + "】");
        }
        player2.changeZhuanhuanji("dianjingmrfz");
      }
    },
    cangjuanmrfz: {
      mod: {
        ignoredHandcard: function(card, player2) {
          if (card.hasGaintag("cangjuanmrfz")) {
            return true;
          }
        },
        cardDiscardable: function(card, player2, name) {
          if (name == "phaseDiscard" && card.hasGaintag("cangjuanmrfz")) return false;
        }
      },
      audio: 2,
      trigger: { player: "gainBegin" },
      filter: function(event2, player2) {
        return player2.countMark("cangjuanmrfz") < 3;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        player2.addMark("cangjuanmrfz", 1, false);
        trigger2.gaintag.add("cangjuanmrfz");
      },
      group: "cangjuanmrfz_remove",
      subSkill: {
        remove: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeMark("cangjuanmrfz", 3);
            player2.removeGaintag("cangjuanmrfz");
          }
        }
      }
    },
    //能天使
    lianshemrfz: {
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return player2.maxHp;
        }
      },
      audio: 2,
      trigger: { player: "useCard" },
      forced: true,
      firstDo: true,
      filter: function(event2, player2) {
        return !event2.audioed && event2.card.name == "sha" && event2.parent && event2.parent.type == "phase";
      },
      async content(event2, trigger2, player2) {
        trigger2.audioed = true;
      }
    },
    guozaimrfz: {
      audio: 4,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.getCardUsable("sha") > 0;
      },
      filterTarget: function(card, player2, target) {
        return target != player2;
      },
      async content(event2, trigger2, player2) {
        const { target } = event2;
        let result2;
        const cards = game.cardsGotoOrdering(get.cards(player2.maxHp + 1)).cards;
        event2.cards = cards;
        event2.cards2 = [];
        event2.cards3 = [];
        event2.num = 0;
        if (!player2.canUse("sha", target, false)) {
          return;
        }
        for (const card of event2.cards) {
          if (card.name === "sha") {
            event2.cards2.push(card);
            event2.num++;
          } else {
            event2.cards3.push(card);
          }
        }
        game.cardsGotoOrdering(event2.cards);
        player2.showCards(event2.cards, get.translation(player2) + "发动了【过载】");
        if (event2.cards2.length > 0 && target.isAlive()) {
          while (event2.num > 0 && target.isAlive() && player2.getCardUsable("sha") > 0) {
            const card = event2.cards2[event2.num - 1];
            player2.showCards(card, get.translation(player2) + "发动了【过载】");
            event2.num--;
            player2.logSkill("guozaimrfz", target);
            if (target.isAlive()) {
              await player2.chooseUseTarget(card, true, "nodistance").set("filterTarget", (card2, player3, target2) => {
                let evt = _status.event;
                if (_status.event.name === "chooseTarget") evt = evt.getParent();
                if (target2 !== player3 && target2 !== evt.guozaimrfz_target) return false;
                return lib.filter.targetEnabledx(card2, player3, target2);
              }).set("guozaimrfz_target", target);
            }
          }
        }
        if (event2.cards3.length > 0) {
          result2 = await player2.chooseButton(["过载：你可以获得一张牌", event2.cards3]).set("ai", (button) => {
            return get.value(button.link, _status.event.player);
          }).forResult();
        }
        if (result2?.links?.length) {
          await player2.gain(result2.links, "gain2");
        }
      },
      ai: {
        order: 10,
        threaten: 1.1,
        expose: 0.6,
        result: {
          target: -1
        }
      }
    },
    //远牙
    yuanmengmrfz: {
      audio: 4,
      trigger: { global: "useCard" },
      filter: function(event2, player2) {
        if (player2.inRange(event2.player)) return false;
        if (!player2.hasSha()) return false;
        return event2.card.name == "sha" && event2.player != player2;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const target = trigger2.targets[0];
        const source = trigger2.player;
        let result2;
        let skipToStep2 = false;
        if (target === player2) {
          result2 = await player2.chooseControl("确定", "cancel2").set("prompt", get.prompt("yuanmengmrfz")).set("prompt2", "你可以对" + get.translation(source) + "使用【杀】").set("ai", () => {
            const aiPlayer = _status.event.player;
            const aiTarget = _status.event.getTrigger().player;
            _status.event.getTrigger().source;
            if (get.attitude(aiPlayer, aiTarget) > 2) return 1;
            return 0;
          }).forResult();
        } else {
          skipToStep2 = true;
        }
        if (!skipToStep2) {
          if (result2 && result2.index === 0) {
            if (player2.hasSha()) {
              await player2.chooseToUse(true, function(card, player3, event3) {
                if (get.name(card) !== "sha") return false;
                return lib.filter.cardEnabled.apply(this, arguments);
              }).set("complexSelect", true).set("filterTarget", function(card, player3, target2) {
                if (target2 !== _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
                return lib.filter.targetEnabled.apply(this, arguments);
              }).set("targetx", source);
              player2.logSkill("yuanmengmrfz", source);
              await player2.draw();
            }
          }
          return;
        }
        result2 = await player2.chooseControl(get.translation(target), get.translation(source), "cancel2").set("prompt", get.prompt("yuanmengmrfz")).set("prompt2", "你可以对其中一名角色使用【杀】").set("ai", () => {
          const aiPlayer = _status.event.player;
          const aiTarget = _status.event.getTrigger().player;
          const aiSource = _status.event.getTrigger().source;
          if (get.attitude(aiPlayer, aiTarget) < 2) return 1;
          if (get.attitude(aiPlayer, aiSource) < 2) return 0;
          return 2;
        }).forResult();
        if (result2.index !== 2) {
          const resulty = result2.index === 1 ? target : source;
          const resultx = result2.index === 0 ? target : source;
          if (player2.hasSha()) {
            await player2.chooseToUse(true, function(card, player3, event3) {
              if (get.name(card) !== "sha") return false;
              return lib.filter.cardEnabled.apply(this, arguments);
            }).set("complexSelect", true).set("filterTarget", function(card, player3, target2) {
              if (target2 !== _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
              return lib.filter.targetEnabled.apply(this, arguments);
            }).set("targetx", result2.index === 0 ? target : source);
            await player2.draw();
            await resulty.draw();
            player2.logSkill("yuanmengmrfz", resultx);
          } else {
            return;
          }
        }
      },
      ai: {
        expose: 0.5,
        threaten: 1.2
      }
    },
    ningshenmrfz: {
      intro: {
        content: function(event2, player2) {
          return (player2.storage.ningshenmrfz_damage ? "·本轮已受到过伤害</br>" : "") + (player2.countMark("ningshenmrfz") == 0 ? "·已连续0个回合没有成为其他角色使用牌的目标。" : "·已连续" + player2.countMark("ningshenmrfz") + "个回合没有成为其他角色使用牌的目标。") + (player2.storage.ningshenmrfz_mark != 0 ? "</br>·下一张带有伤害类标签的牌伤害基数+" + player2.storage.ningshenmrfz_mark : "");
        }
      },
      mark: true,
      audio: 2,
      direct: true,
      trigger: { global: "phaseEnd" },
      filter: function(event2, player2) {
        if (!event2.player.isAlive()) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        let result2;
        const history = trigger2.player.getHistory("useCard");
        if (trigger2.player !== player2) {
          for (let i = 0; i < history.length; i++) {
            if (!history[i].targets) continue;
            for (let j = 0; j < history[i].targets.length; j++) {
              if (history[i].targets[j] === player2) {
                player2.removeMark("ningshenmrfz", player2.countMark("ningshenmrfz"));
                return;
              }
            }
          }
        }
        player2.addMark("ningshenmrfz");
        if (player2.countMark("ningshenmrfz") >= 2) {
          result2 = await player2.chooseControl("摸牌", "获得杀").set("prompt", get.prompt("ningshenmrfz")).set("prompt2", "请选择一项").set("ai", (event3, player3) => {
            if (player3.hp <= 2 || player3.hasCard((card) => {
              return card.name === "sha";
            }))
              return 0;
            return 1;
          }).forResult();
          player2.removeMark("ningshenmrfz", player2.countMark("ningshenmrfz"));
          player2.popup("ningshenmrfz");
          player2.logSkill("ningshenmrfz");
        } else {
          return;
        }
        const cards = get.cardPile2("sha");
        if (result2.index === 0) {
          await player2.draw();
        } else if (cards) {
          await player2.gain(cards, "gain2", "log");
        }
      },
      group: ["ningshenmrfz_mark", "ningshenmrfz_damage", "ningshenmrfz_remove"],
      subSkill: {
        mark: {
          trigger: { player: "useCard1" },
          forced: true,
          firstDo: true,
          charlotte: true,
          filter: function(event2, player2) {
            return get.tag(event2.card, "damage") && player2.storage.ningshenmrfz_mark > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.baseDamage += player2.storage.ningshenmrfz_mark;
            player2.storage.ningshenmrfz_mark = 0;
            player2.logSkill("ningshenmrfz");
          },
          init: function(player2) {
            player2.storage.ningshenmrfz_mark = 0;
          },
          onremove: function(player2) {
            delete player2.storage.ningshenmrfz_mark;
          },
          ai: {
            damageBonus: true
          }
        },
        damage: {
          silent: true,
          charlotte: true,
          popup: false,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            if (!player2.storage.ningshenmrfz_damage) {
              player2.logSkill("ningshenmrfz");
              player2.storage.ningshenmrfz_mark++;
            } else player2.storage.ningshenmrfz_damage = false;
          }
        },
        remove: {
          silent: true,
          charlotte: true,
          popup: false,
          trigger: { player: "damageEnd" },
          async content(event2, trigger2, player2) {
            if (!player2.storage.ningshenmrfz_damage) player2.storage.ningshenmrfz_damage = true;
          }
        }
      },
      ai: {
        threaten: 1.1
      }
    },
    bingximrfz: {
      mod: {
        attackRangeBase: function(player2, num) {
          if (player2 != _status.currentPhase && player2.hp <= player2.countCards("h")) return num = 0;
          return num;
        }
      }
    },
    //迷迭香
    nianshoumrfz: {
      markimage: "extension/WhichWay/image/skill/mdxnianshoumrfz.png",
      intro: {
        name: "巨剑",
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards = player2.getExpansions(skill);
        if (cards.length) player2.loseToDiscardpile(cards);
      },
      audio: 4,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.getExpansions("nianshoumrfz").length >= 2) return false;
        return player2.hasCard(function(card) {
          return get.subtype(card) == "equip1";
        });
      },
      filterCard: function(card) {
        return get.subtype(card) == "equip1";
      },
      position: "he",
      discard: false,
      async content(event2, trigger2, player2) {
        const { cards } = event2;
        player2.addToExpansion(cards, player2, "give").gaintag.add("nianshoumrfz");
      },
      group: [
        "nianshoumrfz_disable",
        "nianshoumrfz_usesha",
        "nianshoumrfz_eff1",
        "nianshoumrfz_eff2",
        "nianshoumrfz_eff3",
        "nianshoumrfz_eff4",
        "nianshoumrfz_eff5"
      ],
      subSkill: {
        disable: {
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          async content(event2, trigger2, player2) {
            const card = get.cardPile2((c) => {
              return get.subtype(c) === "equip1";
            });
            player2.logSkill("nianshoumrfz");
            event2.num = 0;
            player2.disableEquip("equip1");
            while (event2.num < 2) {
              event2.num++;
              if (card) {
                await player2.gain(card, "gain2", "log");
              } else {
                player2.chat("牌堆中没有武器牌了");
              }
            }
          }
        },
        usesha: {
          direct: true,
          trigger: { player: "useCardToPlayered" },
          filter: function(event2, player2) {
            var targetx = event2.targets, num = 0;
            if (event2.card.name != "sha" || player2.getExpansions("nianshoumrfz").length == 0) return false;
            if (!event2.parent || event2.parent.triggeredTargets3.length > 1) return false;
            for (var i = 0; i < targetx.length; i++) {
              if (targetx[i].getExpansions("nianshoumrfz").length < 2) num++;
            }
            return num > 0;
          },
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseBool(
              "是否将一个'巨剑'置于" + (trigger2.targets.length === 1 ? get.translation(trigger2.targets[0]) : "其中一个目标") + "的武将牌上"
            ).set("ai", () => {
              return trigger2.targets.some((q) => get.attitude(player2, q) < 2);
            }).forResult();
            if (result2.bool && trigger2.targets.length === 1) {
              player2.logSkill("nianshoumrfz");
              const cards = player2.getExpansions("nianshoumrfz");
              if (cards.length) {
                result2 = await player2.chooseButton(["选择一个'巨剑'", cards], true).forResult();
              } else {
                return;
              }
            }
            if (result2.bool && trigger2.targets.length === 1) {
              if (result2.links && result2.links.length) {
                const next = player2.gain(result2.links, "gain2");
                next.gaintag.add("nianshoumrfz2");
                await next;
              }
              if (result2.cards && result2.cards.length) {
                const cards3 = player2.getCards("h", (card) => {
                  return card.hasGaintag("nianshoumrfz2");
                });
                trigger2.targets[0].addToExpansion(cards3, trigger2.targets[0], "give").gaintag.add("nianshoumrfz");
              }
              return;
            }
            if (result2.bool && trigger2.targets.length > 1) {
              result2 = await player2.chooseTarget(true, (card, player3, target) => {
                return _status.event.targets.includes(target);
              }).set("targets", trigger2.targets).set("ai", (target) => {
                return get.attitude(_status.event.player, target) < 2;
              }).forResult();
            } else {
              return;
            }
            if (result2.bool && result2.targets && result2.targets.length) {
              event2.target = result2.targets[0];
              const cards = player2.getExpansions("nianshoumrfz");
              if (cards.length) {
                result2 = await player2.chooseButton(["选择一个'巨剑'", cards], true).forResult();
              } else {
                return;
              }
            } else {
              return;
            }
            if (result2.links && result2.links.length) {
              const next = player2.gain(result2.links, "gain2");
              next.gaintag.add("nianshoumrfz2");
              await next;
            }
            if (result2.cards && result2.cards.length) {
              const cards3 = player2.getCards("h", (card) => {
                return card.hasGaintag("nianshoumrfz2");
              });
              event2.target.addToExpansion(cards3, event2.target, "give").gaintag.add("nianshoumrfz");
            }
          }
        },
        eff1: {
          trigger: {
            player: ["loseAfter", "addToExpansionAfter", "cardsGotoSpecialAfter", "loseAsyncAfter"]
          },
          filter: function(event2, player2, name) {
            if (event2.name == "lose" || event2.name == "loseAsync") return event2.getlx !== false && event2.toStorage == true;
            if (event2.name == "cardGotoSpecial") return !event2.notrigger;
            return true;
          },
          direct: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            for (var i = 0; i < player2.getExpansions("nianshoumrfz").length; i++) {
              var names = player2.getExpansions("nianshoumrfz")[i].name + "_skill";
              if (lib.skill[names]) {
                player2.addSkill(names);
              }
            }
          }
        },
        eff2: {
          trigger: {
            player: "gainAfter"
          },
          filter: function(event2, player2) {
            return event2.fromStorage == true || game.hasPlayer2(function(current) {
              var evt = event2.getl(current);
              return evt && evt.xs && evt.xs.length > 0;
            });
          },
          direct: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            if (Array.isArray(trigger2.cards))
              for (var i of trigger2.cards) {
                var names = i.name + "_skill";
                if (lib.skill[names] && player2.hasSkill(names)) {
                  player2.removeSkill(names);
                }
              }
          }
        },
        eff3: {
          direct: true,
          charlotte: true,
          trigger: { global: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return event2.player.getExpansions("nianshoumrfz").length > 0 && event2.player != player2;
          },
          async content(event2, trigger2, player2) {
            var target = trigger2.player;
            trigger2.num -= target.getExpansions("nianshoumrfz").length;
            player2.logSkill("nianshoumrfz", target);
          }
        },
        eff4: {
          direct: true,
          charlotte: true,
          trigger: { player: "damageBegin3" },
          usable: 1,
          filter: function(event2, player2) {
            if (event2.source == void 0) return false;
            return event2.source.getExpansions("nianshoumrfz").length > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.num -= trigger2.source.getExpansions("nianshoumrfz").length;
            player2.logSkill("nianshoumrfz", trigger2.source);
          }
        },
        eff5: {
          direct: true,
          charlotte: true,
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current.getExpansions("nianshoumrfz").length > 0 && current != player2;
            });
          },
          async content(event2, trigger2, player2) {
            var list = ["e", "h"];
            for (var i = 0; i < game.players.length; i++) {
              if (game.players[i].getExpansions("nianshoumrfz").length > 0 && game.players[i] != player2) {
                for (var j = 0; j < 2; j++) {
                  if (game.players[i].countCards(list[j]) > 0) {
                    player2.gain(game.players[i].getCards(list[j]).randomGet(), "give");
                    game.log(
                      player2,
                      "获得了",
                      game.players[i],
                      "的" + get.translation(game.players[i].getCards(list[j]).randomGet())
                    );
                  }
                }
                player2.gain(game.players[i].getExpansions("nianshoumrfz"), "give", "log");
                player2.logSkill("nianshoumrfz", game.players[i]);
              }
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
    zhangyimrfz: {
      charlotte: true,
      mod: {
        attackRange: function(player2, num) {
          if (player2.getExpansions("nianshoumrfz").length) return num + player2.getExpansions("nianshoumrfz").length;
        }
      }
    },
    chongjimrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      direct: true,
      filter: function(event2, player2) {
        if (!event2.parent || event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2") return false;
        if (event2.card && event2.card.name != "sha") return false;
        if (game.players.length <= 2) return false;
        return event2.parent && event2.parent.name != "chongjimrfz" && event2.num > 0;
      },
      async content(event2, trigger2, player2) {
        const targets = trigger2.player;
        const result2 = await player2.chooseTarget(
          get.prompt("chongjimrfz"),
          "你可以对" + get.translation(targets) + "的上家或下家造成一点伤害",
          function(card, player3, target) {
            return (target == targets.getNext() || target == targets.getPrevious()) && target != player3;
          }
        ).set("ai", (target) => -get.attitude(player2, target)).forResult();
        if (result2.bool && result2.targets) {
          result2.targets[0].damage();
          if (trigger2.num > 0)
            result2.targets[0].chooseToDiscard("h", true, get.prompt("chongjimrfz"), "请选择弃置" + trigger2.num + "张手牌", trigger2.num);
          player2.logSkill("chongjimrfz", result2.targets[0]);
        }
      }
    },
    //水陈 假日威龙陈
    yuyunmrfz: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        const num = player2.getCardUsable("sha");
        const history = player2.getHistory("useCard");
        for (let i = 0; i < history.length; i++) {
          if (history[i].card?.name === "sha") {
            player2.removeMark("yuyunmrfz", player2.countMark("yuyunmrfz"));
            return;
          }
        }
        result2 = await player2.chooseBool("是否发动【余韵】？").forResult();
        if (result2.bool) {
          await player2.draw(Math.min(num, 3));
          player2.logSkill("yuyunmrfz");
        } else {
          return;
        }
        player2.removeMark("yuyunmrfz", player2.countMark("yuyunmrfz"));
        player2.addMark("yuyunmrfz", Math.min(num, 2));
      },
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num += player2.countMark("yuyunmrfz");
        }
      }
    },
    shuiqiangmrfz: {
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.getParent()?.triggeredTargets3.length > 1) return false;
        if (event2.card.name != "sha") return false;
        return game.hasPlayer((current) => {
          return !event2.targets.includes(current) && !!player2.canUse(event2.card, current) && player2.inRange(current);
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        result2 = await player2.chooseTarget(
          [1, Infinity],
          get.prompt("shuiqiangmrfz"),
          "为" + get.translation(trigger2.card) + "增加任意个目标",
          (card, player3, target) => {
            return !_status.event.sourcex.includes(target) && player3.inRange(target) && player3.canUse(_status.event.card, target);
          }
        ).set("sourcex", trigger2.targets).set("ai", (target) => {
          const aiPlayer = _status.event.player;
          return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
        }).set("card", trigger2.card).setHiddenSkill(event2.name).forResult();
        if (result2.targets) {
          if (!event2.isMine() && !event2.isOnline()) {
            await game.delayx();
          }
          for (const target of result2.targets) {
            trigger2.targets.push(target);
            player2.line(target);
          }
          player2.logSkill("shuiqiangmrfz");
        } else {
          return;
        }
      }
    },
    jianfengmrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        return event2.card.name == "sha";
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        let result2;
        const next = player2.judge((card) => {
          const suit = get.suit(card);
          if (suit === "spade") return -4;
          return 0;
        });
        next.judge2 = (result3) => {
          return result3.bool === false;
        };
        result2 = await next.forResult();
        if (result2.suit === "spade") {
          const list = [];
          for (const card of trigger2.cards) {
            if (get.position(card, true) === "o") {
              list.push(card);
            }
          }
          if (trigger2.addCount !== false) {
            trigger2.addCount = false;
            trigger2.player.getStat().card.sha--;
          }
          await player2.gain(list, "gain2");
        }
      }
    },
    //水月
    liqunmrfz: {
      audio: 2,
      trigger: { target: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (event2.player == player2) return false;
        return event2.cards.length < 2 || get.distance(player2, event2.target) < 2;
      },
      usable: 1,
      check: function(event2, player2) {
        if (event2.card.name == "wugu" || event2.card.name == "tao") return false;
        if (get.attitude(player2, event2.target) > 2 && event2.card.name == "sha") return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        if (trigger2.parent) trigger2.parent.excluded.add(player2);
      }
    },
    chuangshangmrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        if (event2.getParent()?.name == "chuangshangmrfz") return false;
        if (event2.player == player2) return false;
        return event2.player.isMinHp() || game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current) && current.maxHp / 2 >= current.hp;
        });
      },
      async content(event2, trigger2, player2) {
        const target = trigger2.player;
        let result2;
        const str1 = "摸两张牌";
        const str2 = "对" + get.translation(target) + "造成一点伤害";
        if (target.isMinHp() && game.hasPlayer((current) => {
          return current !== player2 && player2.inRange(current) && current.maxHp / 2 >= current.hp;
        })) {
          result2 = await player2.chooseControl(str1, str2).set("prompt", get.prompt("chuangshangmrfz")).set("prompt2", "请选择一项").set("ai", () => {
            const aiPlayer = _status.event.player;
            if (aiPlayer.hp < 2 && aiPlayer.countCards("h") < 3) return 0;
            return 1;
          }).forResult();
        } else {
          await player2.draw();
          return;
        }
        if (result2.index === 0) {
          await player2.draw(2);
        } else {
          await target.damage();
        }
      }
    },
    jinghuamrfz: {
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      usable: 1,
      filter: function(event2, player2) {
        if (event2.getParent()?.triggeredTargets3?.length > 1) return false;
        if (event2.card.name != "sha") return false;
        return game.hasPlayer(function(current) {
          return current != player2 && current != event2.target;
        });
      },
      check: function(event2, player2) {
        if (player2.hp < 3) return false;
        if (!game.hasPlayer(function(current) {
          return current != event2.target && current != player2 && current != event2.player && get.attitude(player2, current) < 2;
        }))
          return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        let result2;
        result2 = await player2.chooseTarget(
          true,
          [1, 2],
          get.prompt("jinghuamrfz"),
          "为" + get.translation(trigger2.card) + "增加至多两个目标",
          (card, player3, target) => {
            return !_status.event.sourcex.includes(target) && player3.canUse(_status.event.card, target, false);
          }
        ).set("sourcex", trigger2.targets).set("ai", (target) => {
          const aiPlayer = _status.event.player;
          return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
        }).set("card", trigger2.card).setHiddenSkill(event2.name).forResult();
        if (result2.targets) {
          player2.addTempSkill("jinghuamrfz2", {
            player: "useCardAfter"
          });
          for (const target of result2.targets) {
            trigger2.targets.push(target);
            player2.line(target);
          }
        }
      }
    },
    jinghuamrfz2: {
      charlotte: true,
      direct: true,
      trigger: { player: "useCardEnd" },
      filter: function(event2, player2) {
        if (event2.card.name != "sha") return false;
        return player2.getHistory("sourceDamage", function(evt) {
          return evt.card == event2.card;
        }).length <= 2;
      },
      async content(event2, trigger2, player2) {
        player2.loseHp();
      }
    },
    //仇白
    ruximrfz: {
      audio: 4,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.target == player2) return false;
        if (event2.getParent()?.triggeredTargets3?.length > 1) return false;
        return event2.card.name == "sha";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) < 2;
      },
      subfrequent: ["link"],
      async content(event2, trigger2, player2) {
        let result2;
        const next = player2.judge((card) => {
          const suit = get.suit(card);
          if (suit === "spade") return -2;
          if (suit === "club") return -4;
          return 0;
        });
        next.judge2 = (result3) => {
          return result3.bool === false;
        };
        result2 = await next.forResult();
        for (const target of trigger2.targets) {
          if (result2.color === "black") {
            target.link(true);
          }
          if (result2.suit === "club") {
            player2.addTempSkill("ruximrfz2", "phaseEnd");
            player2.addMark("ruximrfz2", 1, false);
          }
        }
      },
      group: "ruximrfz_link",
      subSkill: {
        link: {
          trigger: { player: "useCardToPlayer" },
          filter: function(event2, player2) {
            if (event2.target == player2) return false;
            if (event2.targets.length > 1) return false;
            return event2.target.isLinked() || event2.target.countCards("j") > 0;
          },
          frequent: true,
          async content(event2, trigger2, player2) {
            const target = trigger2.targets[0];
            let result2;
            if (target.countCards("hej") === 0) {
              await player2.draw();
              return;
            }
            result2 = await player2.chooseBool(
              get.prompt("ruximrfz"),
              "【入隙】:是否摸一张牌</br>选择取消则为弃置" + get.translation(target) + "的区域内一张牌"
            ).set("ai", () => {
              const aiPlayer = _status.event.player;
              const att = get.attitude(aiPlayer, target);
              const num = Math.random();
              if (att > 2 && target.countCards("j") > 0) return false;
              return num > 0.5;
            }).forResult();
            if (result2.bool) {
              await player2.draw();
            } else {
              await player2.discardPlayerCard(target, "hej", true);
              player2.line(target);
            }
          }
        }
      }
    },
    ruximrfz2: {
      charlotte: true,
      onremove: true,
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num + player2.countMark("ruximrfz2");
        }
      }
    },
    wenxuemrfz: {
      audio: 4,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (event2.card.name != "sha") return false;
        return game.hasPlayer((current) => {
          return !event2.targets.includes(current) && !!player2.canUse(event2.card, current) && player2.inRange(current) && (current.isLinked() || current.countCards("j") > 0);
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget(
          [1, 2],
          get.prompt("wenxuemrfz"),
          "为" + get.translation(trigger2.card) + "增加至多两个目标",
          function(card, player3, target) {
            return !_status.event.sourcex.includes(target) && player3.inRange(target) && player3.canUse(_status.event.card, target) && (target.isLinked() || target.countCards("j") > 0);
          }
        ).set("sourcex", trigger2.targets).set("ai", function(target) {
          var player3 = _status.event.player;
          return get.effect(target, _status.event.card, player3, player3);
        }).set("card", trigger2.card).setHiddenSkill(event2.name).forResult();
        if (result2.targets) {
          for (var i = 0; i < result2.targets.length; i++) {
            player2.logSkill("wenxuemrfz", result2.targets[i]);
            trigger2.targets.push(result2.targets[i]);
          }
        }
      },
      group: ["wenxuemrfz_sha", "wenxuemrfz_count", "wenxuemrfz_clear"],
      subSkill: {
        sha: {
          direct: true,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            if (event2.card.name != "sha") return false;
            if (!game.hasPlayer((current) => {
              return current != player2 && player2.inRange(current) && !!player2.canUse("sha", current);
            }))
              return false;
            var history = player2.getHistory("useCard", function(evt) {
              return evt.card.name == "sha" && evt.cards && evt.cards.length == 1;
            });
            return history.length % 2 == 0 && event2.cards && event2.cards.length == 1;
          },
          async content(event2, trigger2, player2) {
            let result2;
            const history = player2.getHistory("useCard", (evt) => {
              return evt.card.name === "sha" && evt.cards && evt.cards.length === 1;
            });
            event2.num = history.length / 2;
            result2 = await player2.chooseBool(get.prompt("wenxuemrfz"), "可以使用" + event2.num + "张【杀】").forResult();
            if (result2.bool) {
              while (event2.num > 0) {
                await player2.chooseUseTarget(
                  {
                    name: "sha",
                    isCard: true
                  },
                  "请选择【杀】的目标 (还可使用" + event2.num + "张【杀】)",
                  false
                );
                event2.num--;
                player2.logSkill("wenxuemrfz");
              }
            }
          }
        },
        count: {
          silent: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            if (player2 == _status.currentPhase) return false;
            return event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            player2.addMark("wenxuemrfz_count", 1, false);
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("wenxuemrfz_count", player2.countMark("wenxuemrfz_count"), false);
          }
        }
      }
    },
    //归溟幽灵鲨
    yongwomrfz: {
      audio: 2,
      trigger: { player: "dying" },
      forced: true,
      mark: true,
      intro: {
        content: function(event2, player2) {
          if (player2.isTurnedOver()) return "复活不可用";
          if (!player2.storage.yongwomrfz2 && !player2.isTurnedOver()) return "复活未使用";
          return "复活已使用";
        }
      },
      filter: function(event2, player2) {
        if (player2.storage.yongwomrfz2) return false;
        return !player2.isTurnedOver();
      },
      async content(event2, trigger2, player2) {
        player2.storage.yongwomrfz2 = true;
        player2.turnOver();
        if (player2.hp <= 0) player2.recover(1 - player2.hp);
      },
      mod: {
        globalTo: function(source, player2, distance) {
          if (player2.isTurnedOver()) return distance + 1;
        }
      },
      group: ["yongwomrfz_discard", "yongwomrfz_change1", "yongwomrfz_change2", "yongwomrfz2"],
      subSkill: {
        discard: {
          trigger: { global: "useCardAfter" },
          filter: function(event2, player2) {
            if (!player2.isTurnedOver()) return false;
            if (event2.player == player2) return false;
            if (event2.player.countCards("he") == 0) return false;
            return event2.player == player2.getNext() || event2.player == player2.getPrevious();
          },
          direct: true,
          async content(event2, trigger2, player2) {
            const target = trigger2.player;
            let result2;
            await target.chooseToDiscard("he", true, "【拥我】:请弃置一张牌");
            target.addMark("yongwomrfz2", 1, false);
            if (target.countMark("yongwomrfz2") >= 2) {
              target.removeMark("yongwomrfz2", 2, false);
              await target.damage();
              player2.logSkill("yongwomrfz", target);
            } else {
              return;
            }
            result2 = await player2.chooseBool("【拥我】:是否翻面").set("ai", () => {
              const aiPlayer = _status.event.player;
              if (aiPlayer.hp < 2 && !aiPlayer.storage.yongwomrfz2) return true;
              if (get.attitude(aiPlayer, aiPlayer.getNext()) > 2 || get.attitude(aiPlayer, aiPlayer.getPrevious()) > 2) return true;
              return false;
            }).forResult();
            if (result2.bool) {
              await player2.turnOver();
              player2.logSkill("yongwomrfz");
            }
          }
        },
        change1: {
          direct: true,
          trigger: { player: "turnOverAfter" },
          filter: function(event2, player2) {
            return !player2.isTurnedOver();
          },
          async content(event2, trigger2, player2) {
            player2.draw(2);
            player2.logSkill("yongwomrfz");
          }
        },
        change2: {
          direct: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            if (player2.isTurnedOver() || !event2.player.isAlive()) return false;
            return (player2.getStat("damage") || 0) > 0 || player2.getHistory("damage").length > 0;
          },
          async content(event2, trigger2, player2) {
            const result2 = await player2.chooseBool("【拥我】:是否翻面").set("ai", function() {
              var num = 0.2, player3 = _status.event.player;
              if (player3.countCards("h") > 2) ;
              if (player3.hp > 1) ;
              if (get.attitude(player3, player3.getNext()) < 2 || get.attitude(player3, player3.getPrevious()) < 2) ;
              if (player3.isTurnedOver()) ;
              return Math.random() + num > 0.6;
            }).forResult();
            if (result2.bool) {
              player2.turnOver();
              player2.logSkill("yongwomrfz");
            }
          }
        }
      }
    },
    yongwomrfz2: {
      silent: true,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        return player2.storage.yongwomrfz2;
      },
      async content(event2, trigger2, player2) {
        player2.storage.yongwomrfz2 = false;
      }
    },
    //白铁
    jigongmrfz: {
      derivation: ["jigongmrfz_card"],
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      async content(event2, trigger2, player2) {
        let result2;
        const next = player2.chooseControl().set("choiceList", [
          "白铁多功能平台 - 攻击型：当你造成至少两点伤害时，你可以令此伤害 +1。",
          "白铁多功能平台 - 支援型：锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。",
          "铁钳号原型机：出牌阶段你可以弃置 X 张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数 +1）。"
        ]).set("ai", () => {
          return [0, 1, 2].randomGet();
        });
        next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
        result2 = await next.forResult();
        const list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
        for (let i = 0; i < list.length; i++) {
          if (result2.index === i) {
            event2.card = game.createCard(list[i], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
            await player2.gain(event2.card, "gain2");
            event2.card2 = list[i];
          }
        }
        const card = event2.card;
        if (player2.getCards("h").includes(card) && get.name(card, player2) === event2.card2) {
          await player2.chooseUseTarget(card, "nopopup", true);
        }
      },
      group: ["jigongmrfz_gcard", "jigongmrfz_zb", "jigongmrfz_discard"],
      subSkill: {
        gcard: {
          direct: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i = 0; i < 3; i++) {
              if (player2.countCards("e", list[i])) return true;
            }
          },
          firstDo: true,
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseTarget("你可以将【支援装备】移动至一名其他角色的装备区", (card, player3, target) => {
              return target !== player3 && !target.getEquip(5) && !target.isDisabled(5);
            }).set("ai", (target) => {
              return get.attitude(player2, target);
            }).forResult();
            const list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            if (result2.targets) {
              for (let i = 0; i < list.length; i++) {
                if (player2.countCards("e", list[i])) {
                  event2.card = player2.getCards("e", (card) => {
                    return card.name === list[i];
                  });
                  await player2.lose(event2.card, ui.ordering, "visible");
                  player2.line(result2.targets[0]);
                  event2.target = result2.targets[0];
                }
              }
            } else {
              return;
            }
            event2.target.equip(event2.card[0]);
            player2.logSkill("jigongmrfz", event2.target);
          }
        },
        zb: {
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i = 0; i < 3; i++) {
              if (player2.countCards("e", list[i])) return false;
            }
            return true;
          },
          async content(event2, trigger2, player2) {
            let result2;
            const next = player2.chooseControl().set("choiceList", [
              "白铁多功能平台 - 攻击型：当你造成至少两点伤害时，你可以令此伤害 +1。",
              "白铁多功能平台 - 支援型：锁定技，弃牌阶段开始时，你额外执行一个出牌阶段和摸牌阶段。",
              "铁钳号原型机：出牌阶段你可以弃置 X 张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数 +1）。"
            ]).set("ai", () => {
              return [0, 1, 2].randomGet();
            });
            next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
            result2 = await next.forResult();
            const list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (let i = 0; i < list.length; i++) {
              if (result2.index === i) {
                event2.card = game.createCard(list[i], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
                await player2.gain(event2.card, "gain2");
                event2.card2 = list[i];
              }
            }
            const card = event2.card;
            if (player2.getCards("h").includes(card) && get.name(card, player2) === event2.card2) {
              await player2.chooseUseTarget(card, "nopopup", true);
            }
            player2.logSkill("jigongmrfz");
          }
        },
        discard: {
          direct: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i = 0; i < 3; i++) {
              if (event2.player.countCards("e", list[i])) return true;
            }
          },
          async content(event2, trigger2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i = 0; i < 3; i++) {
              if (trigger2.player.countCards("e", list[i])) {
                let card = trigger2.player.getCards("e", function(card2) {
                  return card2.name == list[i];
                });
                trigger2.player.discard(card);
              }
            }
          }
        }
      }
    },
    jiefeimrfz: {
      audio: 2,
      trigger: { global: ["loseEnd", "cardsDiscardEnd"] },
      direct: true,
      popup: false,
      filter: function(event2, player2) {
        var cs = event2.cards;
        for (var i = 0; i < cs.length; i++) {
          if (cs[i].name.indexOf("baitiemrfzcard") == 0 && get.position(cs[i], true) == "d") return true;
        }
        return false;
      },
      forceDie: true,
      async content(event2, trigger2, player2) {
        let result2;
        if (!_status.jigongmrfz) _status.jigongmrfz = {};
        const list = [];
        const list2 = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
        const cs = trigger2.cards;
        for (let i = 0; i < cs.length; i++) {
          if (cs[i].name.indexOf("baitiemrfzcard") === 0 && get.position(cs[i], true) === "d") {
            _status.jigongmrfz[cs[i].name] = false;
            list.push(cs[i]);
          }
          for (let j = 0; j < list2.length; j++) {
            if (cs[i].name === list2[j]) event2.card = list2[j];
          }
        }
        game.log(list, "已被移出游戏");
        game.cardsGotoSpecial(list);
        event2.card = game.createCard(list[0].name, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
        player2.popup("jigongmrfz");
        result2 = await player2.chooseBool(get.prompt("jigongmrfz")).forResult();
        if (result2.bool) {
          player2.logSkill("jiefeimrfz");
          const next = player2.judge((card) => {
            const color = get.color(card);
            if (color === "red") return -4;
            return 0;
          });
          next.judge2 = (result3) => {
            return result3.bool === false;
          };
          result2 = await next.forResult();
        } else {
          return;
        }
        if (result2.color === "red") {
          await player2.draw();
          result2 = await player2.chooseTarget("你可以令一名角色装备【支援装备】", (card, player3, target) => {
            return !target.getEquip(5) && !target.isDisabled(5);
          }).set("ai", (target) => {
            return get.attitude(player2, target);
          }).forResult();
        } else {
          return;
        }
        if (result2.targets) {
          const cards = game.createCard(event2.card, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
          const target = result2.targets[0];
          await target.gain(cards, "gain2");
          target.equip(cards);
          player2.logSkill("jiefeimrfz");
        }
      }
    },
    //推进之王 维纳
    yuechuimrfz: {
      init(player2, skill) {
        player2.addMark(skill, 1, false);
      },
      audio: 2,
      trigger: {
        player: "useCardAfter"
      },
      filter(event2, player2) {
        return event2.card && event2.card.name == "sha";
      },
      frequent: true,
      prompt2(event2, player2) {
        let num = player2.countMark("yuechuimrfz") > 0 ? player2.countMark("yuechuimrfz") : 1;
        return `是否摸${num}张牌？`;
      },
      async content(event2, trigger2, player2) {
        await player2.draw(player2.countMark("yuechuimrfz") > 0 ? player2.countMark("yuechuimrfz") : 1);
        if (player2.countMark("yuechuimrfz") < 3 && player2.countCards("he", { type: "equip" }) > 0) {
          const { cards } = await player2.chooseToDiscard("he", (card) => get.type(card) == "equip").set(
            "prompt",
            `【跃锤】:你可以弃置一张装备牌令‘跃锤’中[]内的数字+1（当前：${player2.countMark("yuechuimrfz") > 0 ? player2.countMark("yuechuimrfz") : 1}）`
          ).set("ai", (card) => {
            return get.value(card) < 8;
          }).forResult();
          if (cards) player2.addMark("yuechuimrfz", 1, false);
        }
        let targets = trigger2.targets, targetx = game.players.slice().filter((i) => {
          for (var j of targets) {
            if (get.distance(j, i) == 1 && !targets.includes(i)) return true;
          }
          return false;
        });
        if (targetx) {
          const { targets: targetscs } = await player2.chooseTarget().set("prompt", `【跃锤】:你可以对${get.translation(targetx)}其中一名角色造成一点伤害`).set("filterTarget", (card, player3, target) => {
            return _status.event.targets.includes(target);
          }).set("ai", (target) => {
            return get.damageEffect(target, get.event().player, get.event().player) > 0;
          }).set("targets", targetx).forResult();
          if (targetscs) {
            targetscs[0].damage(player2);
          }
        }
      }
    },
    fensuimrfz: {
      audio: 2,
      trigger: { global: "dying" },
      forced: true,
      filter: function(event2, player2) {
        return event2.player != player2 && get.distance(player2, event2.player) <= 1;
      },
      async content(event2, trigger2, player2) {
        player2.draw();
        player2.line(trigger2.player);
      }
    },
    //伺夜
    langqunmrfz: {
      mark: true,
      marktext: "狼群",
      intro: {
        name: "狼群",
        content: "有#个狼"
      },
      audio: 4,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      async content(event2, trigger2, player2) {
        player2.addMark("langqunmrfz", 2);
      },
      mod: {
        maxHandcard: function(player2, num) {
          if (player2.hasMark("langqunmrfz")) return num + 1;
        }
      },
      group: ["langqunmrfz_gainb", "langqunmrfz_damage", "langqunmrfz_discard"],
      subSkill: {
        gainb: {
          audio: "langqunmrfz",
          trigger: {
            player: "loseAfter",
            global: "loseAsyncAfter"
          },
          frequent: true,
          filter: function(event2, player2) {
            if (event2.getlx === false) return false;
            if (player2.countMark("langqunmrfz") > 2) return false;
            return !player2.hasSkill("langqunmrfz2");
          },
          async content(event2, trigger2, player2) {
            player2.addMark("langqunmrfz");
            player2.addTempSkill("langqunmrfz2");
          }
        },
        damage: {
          audio: "langqunmrfz",
          trigger: { target: "useCardToTargeted" },
          filter: function(event2, player2) {
            return player2.countMark("langqunmrfz") > 0 && get.tag(event2.card, "damage");
          },
          prompt: function(event2, player2) {
            return "你可以移去一个‘狼群’标记并令此牌(" + get.translation(event2.card) + ")取消你为目标(剩余‘狼群’数:" + player2.countMark("langqunmrfz") + ")";
          },
          async content(event2, trigger2, player2) {
            trigger2.targets.remove(player2);
            if (trigger2.parent) trigger2.parent.triggeredTargets2.remove(player2);
            trigger2.untrigger();
            player2.removeMark("langqunmrfz");
          }
        },
        discard: {
          audio: "langqunmrfz",
          forced: true,
          trigger: { player: "phaseDiscardEnd" },
          async content(event2, trigger2, player2) {
            var cards = [];
            game.getGlobalHistory("cardMove", (evt) => {
              if (evt.name == "cardsDiscard") {
                if (evt.getParent("phaseDiscard") == trigger2) {
                  var moves = evt.cards.filterInD("d");
                  cards.addArray(moves);
                }
              }
              if (evt.name == "lose") {
                if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger2) return false;
                var moves = evt.cards.filterInD("d");
                cards.addArray(moves);
              }
              return false;
            });
            player2.draw(Math.floor(cards.length / 2) + 1);
          }
        }
      }
    },
    langqunmrfz2: {},
    qunxingmrfz: {
      marktext: "群仇",
      intro: {
        name: "群仇",
        content: "你被狼群盯上了"
      },
      audio: 4,
      trigger: { target: "useCardToTarget" },
      filter: function(event2, player2) {
        return event2.player != player2 && event2.player.countMark("qunxingmrfz") < 6;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.player) + "获得一个‘群仇’标记";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 2;
      },
      async content(event2, trigger2, player2) {
        trigger2.player.addMark("qunxingmrfz");
        player2.line(trigger2.player);
      },
      mod: {
        targetInRange: function(card, player2, target) {
          if (target.hasMark("qunxingmrfz")) {
            return true;
          }
        }
      },
      group: ["qunxingmrfz_damage", "qunxingmrfz_dirhit"],
      subSkill: {
        damage: {
          audio: "qunxingmrfz",
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.player.hasMark("qunxingmrfz");
          },
          forced: true,
          async content(event2, trigger2, player2) {
            var target = trigger2.player;
            player2.draw(target.countMark("qunxingmrfz"));
            target.removeMark("qunxingmrfz", player2.countMark("qunxingmrfz"));
          }
        },
        dirhit: {
          audio: "qunxingmrfz",
          forced: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.card && //@ts-ignore
            (get.type(event2.card) == "trick" || //@ts-ignore
            get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name)) && game.hasPlayer(function(current) {
              return current != player2 && current.hasMark("qunxingmrfz");
            });
          },
          async content(event2, trigger2, player2) {
            trigger2.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player2 && current.hasMark("qunxingmrfz");
              })
            );
            player2.line(
              game.filterPlayer(function(current) {
                return current != player2 && current.hasMark("qunxingmrfz");
              })
            );
          },
          ai: {
            directHit_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              return arg.target.hasMark("qunxingmrfz");
            }
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    //百炼嘉维尔
    yixuemrfz: {
      audio: 2,
      trigger: { player: "recoverBegin" },
      forced: true,
      filter: function(event2, player2) {
        return !player2.hasSkill("yixuemrfz2");
      },
      async content(event2, trigger2, player2) {
        trigger2.num++;
        player2.addSkill("yixuemrfz2");
      }
    },
    yixuemrfz2: {
      silent: true,
      firstDo: true,
      charlotte: true,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        return player2.hasSkill("yixuemrfz2");
      },
      async content(event2, trigger2, player2) {
        player2.removeSkill("yixuemrfz2");
      }
    },
    juximrfz: {
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.targets.length > 1) return false;
        return event2.card.name == "sha" && event2.target.countCards("he") > 0;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        const cards = trigger2.target.getCards("hej");
        const list = [];
        let num = 0;
        for (const card of cards) {
          list.add(get.suit(card, player2));
        }
        for (const suit of lib.suit) {
          if (list.includes(suit)) num++;
        }
        result2 = await player2.choosePlayerCard(
          trigger2.target,
          "he",
          [1, Math.min(trigger2.target.countCards("he"), num)],
          get.prompt("juximrfz", trigger2.target) + "(可选" + num + "张牌)"
        ).set("forceAuto", true).forResult();
        if (result2.links && result2.links.length) {
          const target = trigger2.target;
          player2.logSkill("juximrfz", target);
          const next = player2.addToExpansion(result2.cards, "giveAuto", player2);
          next.gaintag.add("juximrfz2");
          await next;
          player2.addSkill("juximrfz2");
        }
      },
      ai: {
        unequip_ai: true,
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          if (get.attitude(player2, arg.target) > 0) return false;
          if (tag == "directHit_ai") return arg.target.countCards("h") < 2;
          if (arg && arg.name == "sha" && arg.target.getEquip(2)) return true;
          return false;
        }
      }
    },
    juximrfz2: {
      intro: {
        markcount: "expansion",
        mark: function(dialog, storage, player2) {
          var cards = player2.getExpansions("juximrfz2");
          if (player2.isUnderControl(true)) dialog.addAuto(cards);
          else return "共有" + get.cnNumber(cards.length) + "张牌";
        }
      },
      trigger: { player: "useCardAfter" },
      forced: true,
      filter: function(event2, player2) {
        if (event2.card.name != "sha") return false;
        return player2.getExpansions("juximrfz2").length > 0;
      },
      async content(event2, trigger2, player2) {
        const history = player2.getHistory("sourceDamage", function(evt) {
          return evt.card == trigger2.card;
        }).length;
        const cards = player2.getExpansions("juximrfz2");
        let result2;
        if (history > 0) {
          result2 = await player2.chooseButton(["你可以至多获得两张牌", cards], [0, Math.min(2, cards.length)], true).set("ai", function(button) {
            return get.value(button.link, _status.event.player);
          }).forResult();
        } else {
          result2 = await trigger2.targets[0].chooseButton(["你可以至多获得两张牌", cards], [0, Math.min(2, cards.length)], true).set("ai", function(button) {
            return get.value(button.link, _status.event.player);
          }).forResult();
        }
        if (result2.bool) {
          if (history > 0) await player2.gain(result2.links, "gain2");
          else await trigger2.targets[0].gain(result2.links, "gain2");
        }
        player2.loseToDiscardpile(cards);
        player2.removeSkill("juximrfz2");
      }
    },
    conghunmrfz: {
      marktext: "坚韧",
      intro: {
        name: "坚韧",
        content: function(event2, player2) {
          if (player2.storage.conghunmrfz_lose) return "已有" + player2.countMark("conghunmrfz") + "个坚韧标记</br>本轮已发动过【丛魂①】";
          return "已有" + player2.countMark("conghunmrfz") + "个坚韧标记</br>本轮未发动过【丛魂①】";
        }
      },
      mark: true,
      init: function(player2) {
        player2.storage.conghunmrfza = -10;
      },
      firstDo: true,
      audio: 2,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        return !player2.hasMark("conghunmrfz") && player2.storage.conghunmrfza <= game.roundNumber - 2;
      },
      check: function(event2, player2) {
        return player2.hp < 3 || player2.countCards("he") < 4 || player2.countCards("h") == 0;
      },
      async content(event2, trigger2, player2) {
        player2.storage.conghunmrfz_lose = true;
        player2.storage.conghunmrfza = game.roundNumber;
      },
      group: ["conghunmrfz_dam", "conghunmrfz_rem", "conghunmrfz_lose"],
      subSkill: {
        dam: {
          audio: "conghunmrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "damageBegin3" },
          filter: function(event2, player2) {
            return player2.storage.conghunmrfz_lose;
          },
          async content(event2, trigger2, player2) {
            trigger2.num--;
            player2.addMark("conghunmrfz");
          }
        },
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.conghunmrfz_lose && player2.storage.conghunmrfza <= game.roundNumber - 1;
          },
          async content(event2, trigger2, player2) {
            player2.storage.conghunmrfz_lose = false;
          }
        },
        lose: {
          audio: "conghunmrfza",
          trigger: { global: "phaseBegin" },
          filter: function(event2, player2) {
            return player2.hasMark("conghunmrfz") && player2.storage.conghunmrfza <= game.roundNumber - 1;
          },
          forced: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            player2.loseHp();
            player2.removeMark("conghunmrfz");
          }
        }
      }
    },
    conghunmrfza: { audio: 2 },
    //史尔特尔
    yujinmrfz: {
      audio: 2,
      trigger: { player: "dying" },
      unique: true,
      mark: true,
      limited: true,
      skillAnimation: true,
      animationStr: "余烬",
      animationColor: "fire",
      init: function(player2) {
        player2.storage.yujinmrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.yujinmrfz;
      },
      async content(event2, trigger2, player2) {
        player2.storage.yujinmrfz = true;
        let next = [
          player2.phaseZhunbei(),
          player2.phaseJudge(),
          player2.phaseDraw(),
          player2.phaseUse(),
          player2.phaseDiscard(),
          player2.phaseJieshu()
        ];
        for (var i = 0; i < next.length; i++) {
          event2.next.remove(next[i]);
          trigger2.next.push(next[i]);
        }
        player2.awakenSkill(event2.name);
      },
      group: "yujinmrfz_rec",
      subSkill: {
        rec: {
          audio: "huanghunmrfza",
          trigger: { player: "turnOverAfter" },
          filter: function(event2, player2) {
            return player2.storage.yujinmrfz == true && !player2.isTurnedOver();
          },
          forced: true,
          async content(event2, trigger2, player2) {
            player2.storage.yujinmrfz = false;
          }
        }
      }
    },
    huanghunmrfza: { audio: 2 },
    huanghunmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      check: function(event2, player2) {
        if (player2.countCards("he") < 3) return false;
        if (player2.countCards("j") > 0 && !player2.hasCard(function(card) {
          return card.name == "wuxie";
        }, "h"))
          return false;
        return player2.hasCard(function(card) {
          return card.name == "sha";
        }, "h");
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseToDiscard("he", "【黄昏】:你可以至多弃置两张牌，然后增加等量的体力上限", [0, 2]).set("ai", function(card) {
          return 6 - get.value(card);
        }).forResult();
        if (result2.cards) {
          await player2.gainMaxHp(result2.cards.length);
        }
        player2.addTempSkill("huanghunmrfz_lose");
        player2.addTempSkill("huanghunmrfz_dam");
        player2.turnOver();
      },
      subSkill: {
        lose: {
          direct: true,
          charlotte: true,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            return get.tag(event2.card, "damage");
          },
          async content(event2, trigger2, player2) {
            player2.loseMaxHp();
          }
        },
        dam: {
          audio: "huanghunmrfz",
          trigger: { source: "damageBegin" },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
          },
          mod: {
            selectTarget: function(card, player2, range) {
              if (card.name == "sha" && range[1] != -1) range[1] += 2;
            },
            attackRange: function(player2, num) {
              return num += 2;
            }
          }
        }
      }
    },
    mojianmrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      usable: 2,
      filter: function(event2, player2) {
        return event2.nature == "fire" && player2.isPhaseUsing();
      },
      async content(event2, trigger2, player2) {
        player2.draw(2);
      },
      mod: {
        cardnature: function(card, player2) {
          if (card.nature != "thunder" && card.name == "sha") return "fire";
          if (card.nature == "thunder" && card.name == "sha") return false;
        }
      }
    },
    //新流明
    fanyuanmrfz: {
      intro: {
        name: "凡人之愿",
        content: "“直到灯火明亮”"
      },
      audio: 2,
      trigger: { global: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (get.type(event2.card) != "delay") return false;
        return game.hasPlayer(function(current) {
          return current.hasMark("fanyuanmrfz");
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        player2.logSkill("fanyuanmrfz");
      },
      global: "fanyuanmrfz_eff",
      subSkill: {
        eff: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          firstDo: true,
          filter: function(event2, player2) {
            return player2.hasMark("fanyuanmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("fanyuanmrfz", 1, false);
          },
          mod: {
            targetEnabled: function(card, player2, target) {
              if (get.type(card) == "delay" && target.hasMark("fanyuanmrfz")) return false;
            }
          }
        }
      }
    },
    new_weiguangmrfz: {
      mark: true,
      intro: {
        name: "灯火不灭",
        content: function(event2, player2) {
          return "剩余次数:" + (5 - player2.countMark("new_weiguangmrfz"));
        }
      },
      audio: 4,
      trigger: {
        global: ["turnOverAfter", "linkAfter", "addJudgeBefore"]
      },
      filter: function(event2, player2) {
        if (player2.countMark("new_weiguangmrfz") > 4) return false;
        if (event2.name == "link") return event2.player.isLinked();
        if (event2.name == "turnOver") return event2.player.isTurnedOver();
        return event2.name == "addJudge";
      },
      prompt: function(event2, player2) {
        return "是否对" + get.translation(event2.player) + "发动【微光】(" + (5 - player2.countMark("new_weiguangmrfz")) + "/5)？";
      },
      check: function(event2, player2) {
        var att = get.attitude(player2, event2.player);
        if (event2.player.hasSkill("xinfu_limu") && att > 2 && event2.name == "addJudge" && event2.player.isPhaseUsing()) return false;
        if (event2.player.hasSkill("xinfu_limu") && att < 0 && event2.name == "addJudge" && event2.player.isPhaseUsing()) return true;
        return att > 2;
      },
      async content(event2, trigger2, player2) {
        const target = trigger2.player;
        player2.addMark("new_weiguangmrfz", 1, false);
        if (!target.hasMark("fanyuanmrfz")) {
          target.addMark("fanyuanmrfz", 1, false);
        }
        let num = 3;
        if (target.isLinked()) {
          target.link(false);
          num--;
        }
        if (target.isTurnedOver()) {
          target.turnOver(false);
          num--;
        }
        if (trigger2.name === "addJudge" || target.countCards("j") > 0) {
          if (trigger2.name === "addJudge") {
            trigger2.cancel();
            const owner = get.owner(trigger2.card);
            if (owner && owner.getCards("hej").includes(trigger2.card)) {
              await owner.lose(trigger2.card, ui.discardPile);
            } else {
              game.cardsDiscard(trigger2.card);
            }
            game.log(trigger2.card, "进入了弃牌堆");
          }
          await target.chooseToDiscard(true, "j", target.countCards("j"));
          num--;
        }
        await target.draw(num);
      },
      group: "new_weiguangmrfz_rem",
      subSkill: {
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.countMark("new_weiguangmrfz") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("new_weiguangmrfz", player2.countMark("new_weiguangmrfz"), false);
          }
        }
      }
    },
    yingjimrfz: {
      audio: 2,
      trigger: { global: "useCardToTarget" },
      filter: function(event2, player2) {
        if (event2.target == player2) return false;
        if (event2.targets.length > 1) return false;
        return get.type(event2.card) == "delay" && !player2.hasMark("yingjimrfz");
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.target) + "回复一点体力并摸一张牌";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) > 2;
      },
      async content(event2, trigger2, player2) {
        trigger2.targets[0].recover();
        trigger2.targets[0].draw();
        player2.addMark("yingjimrfz", 1, false);
      },
      group: "yingjimrfz_rem",
      subSkill: {
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          firstDo: true,
          filter: function(event2, player2) {
            return player2.hasMark("yingjimrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("yingjimrfz", 1, false);
          }
        }
      }
    },
    //林
    yinbimrfz: {
      marktext: "壁",
      intro: {
        name: "壁",
        content: "·琉璃壁保护着你</br>·此琉璃壁来源【荫蔽】"
      },
      audio: 2,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return !player2.storage.liuliemrfz && !player2.storage.yinbimrfz;
      },
      selectTarget: [1, 2],
      filterTarget: function(card, player2, target) {
        return target != player2 && !target.hasMark("yinbimrfz") && !target.hasMark("zhenzamrfz");
      },
      async content(event2, trigger2, player2) {
        const { targets } = event2;
        player2.storage.yinbimrfz = true;
        if (!player2.hasSkill("liuliemrfz_rem")) player2.addSkill("liuliemrfz_rem");
        for (var i = 0; i < targets.length; i++) {
          if (!targets[i].hasMark("yinbimrfz")) targets[i].addMark("yinbimrfz");
          if (!targets[i].hasSkill("yinbimrfz_rem")) targets[i].addSkill("yinbimrfz_rem");
          if (targets[i].hujia < 1) targets[i].changeHujia();
        }
      },
      subSkill: {
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            if (player2.hasMark("yinbimrfz")) {
              player2.removeMark("yinbimrfz");
              player2.changeHujia(-1);
            }
            player2.removeSkill("yinbimrfz_rem");
          }
        }
      },
      ai: {
        order: 10,
        expose: 0.3,
        result: {
          player: 1,
          target: 1
        }
      }
    },
    liuliemrfz: {
      audio: 2,
      trigger: { player: "phaseUseBegin" },
      check: function(event2, player2) {
        if (game.hasPlayer((current) => {
          return current != player2 && get.attitude(player2, current) > 2;
        }))
          return Math.random() > 0.85;
        return true;
      },
      async content(event2, trigger2, player2) {
        player2.storage.liuliemrfz = true;
        player2.addSkill("liuliemrfz_rem");
      },
      subSkill: {
        rem: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.storage.liuliemrfz = false;
            player2.storage.yinbimrfz = false;
          }
        }
      }
    },
    zhenzamrfz: {
      marktext: "壁",
      intro: {
        name: "壁",
        content: function(event2, player2) {
          if (player2.storage.liuliemrfz) return "·琉璃壁保护着你</br>·【缜匝②】已修改</br>·【荫蔽】已失效";
          return "·琉璃壁保护着你";
        }
      },
      audio: 6,
      derivation: ["zhenzamrfz_rewrite"],
      trigger: { global: "damageEnd" },
      direct: true,
      filter: function(event2, player2) {
        if (!event2.player.hasMark("zhenzamrfz") && !event2.player.hasMark("yinbimrfz")) return false;
        return event2.hujia && !event2.player.hujia && event2.player.isIn() && game.hasPlayer(function(current) {
          return current != event2.player && event2.player.inRangeOf(current);
        });
      },
      async content(event2, trigger2, player2) {
        const playerx = trigger2.player;
        let result2;
        if (playerx.hasMark("zhenzamrfz")) {
          playerx.removeMark("zhenzamrfz");
        } else {
          playerx.removeMark("yinbimrfz");
        }
        result2 = await playerx.chooseTarget(
          get.prompt("zhenzamrfz"),
          "你可以随机获得攻击范围内一名其他角色的" + (player2.storage.liuliemrfz ? "两张牌" : "一张牌") + "并对其造成一点伤害",
          (card, player3, target) => {
            return target !== player3 && player3.inRangeOf(target);
          }
        ).set("ai", (target) => {
          const aiTrigger = _status.event.getTrigger();
          _status.event.player;
          return -get.attitude(aiTrigger.player, target);
        }).forResult();
        if (result2.targets) {
          const target = result2.targets[0];
          const cardg = [];
          const numCards = player2.storage.liuliemrfz ? 2 : 1;
          for (let i = 0; i < numCards; i++) {
            const cardt = target.getCards("he").randomGet();
            if (!cardg.includes(cardt)) {
              cardg.push(cardt);
            } else if (target.countCards("he") > 1) {
              i--;
            }
          }
          await playerx.gain(cardg, target, "giveAuto", "bySelf");
          await target.damage(playerx || "nosource", "nocard");
          playerx.logSkill("zhenzamrfz", target);
        }
      },
      group: ["zhenzamrfz_sta", "zhenzamrfz_gt", "zhenzamrfz_gt2", "zhenzamrfz_time1"],
      subSkill: {
        sta: {
          audio: "zhenzamrfz",
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          forced: true,
          locked: false,
          filter: function(event2, player2) {
            return (event2.name != "phase" || game.phaseNumber == 0) && player2.countCards("h") > 0;
          },
          async content(event2, trigger2, player2) {
            player2.addMark("zhenzamrfz");
            if (player2.hujia < 1) player2.changeHujia();
          }
        },
        gt: {
          audio: "zhenzamrfz",
          forced: true,
          trigger: { global: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            if (player2.countMark("zhenzamrfz_time1") > 1) return false;
            return !player2.hasMark("zhenzamrfz") && !player2.hasMark("yinbimrfz");
          },
          async content(event2, trigger2, player2) {
            player2.addMark("zhenzamrfz");
            player2.addMark("zhenzamrfz_time1", 1, false);
            if (player2.hujia < 1) player2.changeHujia();
          }
        },
        gt2: {
          audio: "zhenzamrfz",
          trigger: { global: "dying" },
          filter: function(event2, player2) {
            if (player2.countMark("zhenzamrfz_time2") > 1) return false;
            if (player2.hasMark("zhenzamrfz") || player2.hasMark("yinbimrfz")) return false;
            return event2.player != player2 && event2.parent && event2.parent.name == "damage" && event2.parent.source && event2.parent.source == player2;
          },
          async content(event2, trigger2, player2) {
            player2.addMark("zhenzamrfz");
            player2.addMark("zhenzamrfz_time2", 1, false);
            if (player2.hujia < 1) player2.changeHujia();
          }
        },
        time1: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          firstDo: true,
          async content(event2, trigger2, player2) {
            player2.removeMark("zhenzamrfz_time1", player2.countMark("zhenzamrfz_time1"), false);
            player2.removeMark("zhenzamrfz_time2", player2.countMark("zhenzamrfz_time2"), false);
          }
        },
        time2: {}
      },
      ai: {
        threaten: 0.8
      }
    },
    //多萝西
    gongzhenmrfz: {
      audio: 4,
      forced: true,
      trigger: { player: ["useCardAfter", "respond"] },
      filter: function(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        if (!event2.card.isCard) return false;
        return event2.cards && event2.cards.length == 1;
      },
      async content(event2, trigger2, player2) {
        var cards = player2.getCards("h"), list = [];
        for (var i of cards) {
          list.add(get.suit(i, player2));
        }
        if (!list.includes(get.suit(trigger2.card, player2))) player2.draw();
        else if (player2.countCards("h") > 0) player2.chooseToDiscard("h", true, "【共振】:请弃置一张手牌");
      }
    },
    mengxiangmrfz: {
      audio: 2,
      trigger: { player: "drawAfter" },
      filter: function(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        return event2.parent && event2.parent.name == "gongzhenmrfz";
      },
      direct: true,
      async content(event2, trigger2, player2) {
        await player2.addMark("mengxiangmrfz", 1, false);
        if (player2.countMark("mengxiangmrfz") % 2 == 0 && player2.hasMark("mengxiangmrfz")) {
          player2.addTempSkill("mengxiangmrfz_eff", {
            player: "phaseEnd"
          });
          player2.removeMark("mengxiangmrfz", 2, false);
          if (player2.countMark("mengxiangmrfz") > 0) event2.redo();
        }
      },
      group: "mengxiangmrfz_rem",
      subSkill: {
        rem: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("mengxiangmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("mengxiangmrfz", player2.countMark("mengxiangmrfz"), false);
          }
        },
        eff: {
          audio: "mengxiangmrfz",
          trigger: { player: ["useCard1", "respond"] },
          forced: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            player2.removeSkill("mengxiangmrfz_eff");
          },
          mod: {
            cardUsable: function(card) {
              return Infinity;
            },
            targetInRange: function(card) {
              return true;
            }
          },
          mark: true,
          intro: {
            content: "下一张使用或打出的牌无次数和距离限制"
          }
        }
      }
    },
    paizhangmrfz: {
      global: "paizhangmrfz_tag4",
      audio: 4,
      trigger: { player: "loseAfter" },
      filter: function(event2, player2) {
        if (event2.type != "discard" || event2.getlx === false || event2.getParent(3).name != "gongzhenmrfz") return false;
        for (var card of event2.cards) {
          if (get.position(card, true) == "d") return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        let result2;
        if (trigger2.cards.length) {
          result2 = await player2.chooseTarget(get.prompt("paizhangmrfz"), "你可以将此牌交给一名其他角色", (card, player3, target) => {
            return target !== player3 && !target.hasSkill("paizhangmrfz2");
          }).set("ai", (target) => {
            return -get.attitude(player2, target);
          }).forResult();
        }
        if (result2 && result2.targets) {
          const target = result2.targets[0];
          const next = target.gain(trigger2.cards, "gain2");
          next.gaintag = ["paizhangmrfz"];
          await next;
          target.addTempSkill("paizhangmrfz2");
          player2.logSkill("paizhangmrfz");
        }
        for (const card of trigger2.cards) {
          card.storage.paizhangmrfz = true;
        }
      },
      group: ["paizhangmrfz_tag1", "paizhangmrfz_tag2", "paizhangmrfz_tag3"],
      subSkill: {
        tag1: {
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: {
            global: "useCard"
          },
          filter: function(event2, player2) {
            for (var i = 0; i < event2.cards.length; i++) {
              if (event2.cards[i].storage && event2.cards[i].storage.paizhangmrfz) return true;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            const cards = trigger2.cards[0];
            if (trigger2.cards.length > 1 || cards.number === void 0) {
              await trigger2.player.damage();
              player2.logSkill("paizhangmrfz", trigger2.player);
            } else if (cards.number > 8) {
              await trigger2.player.damage();
              player2.logSkill("paizhangmrfz", trigger2.player);
            } else {
              await trigger2.player.chooseToDiscard(
                "he",
                Math.floor(cards.number / 3),
                "【排障】:请弃置" + Math.floor(cards.number / 3) + "张牌",
                true
              );
              player2.logSkill("paizhangmrfz", trigger2.player);
            }
          }
        },
        tag2: {
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: {
            target: "useCardToTarget",
            player: "addJudgeBefore"
          },
          filter: function(event2, player2) {
            for (var i = 0; i < event2.cards.length; i++) {
              if (event2.cards[i].storage && event2.cards[i].storage.paizhangmrfz) return true;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            if (trigger2.name === "addJudge") {
              trigger2.cancel();
              const owner = get.owner(trigger2.card);
              if (owner && owner.getCards("hej").includes(trigger2.card)) {
                await owner.lose(trigger2.card, ui.discardPile);
              } else {
                game.cardsDiscard(trigger2.card);
              }
              game.log(trigger2.card, "进入了弃牌堆");
            } else {
              trigger2.getParent().targets.remove(player2);
            }
            const trgnext = trigger2.player.getNext();
            const trgprvs = trigger2.player.getPrevious();
            if (trgnext && trgnext !== player2 && trgnext.hasCard((card) => {
              return card.storage && card.storage.paizhangmrfz;
            }, "h")) {
              const cards = trgnext.getCards("h", (card) => {
                return card.storage && card.storage.paizhangmrfz;
              });
              player2.logSkill("paizhangmrfz", trgnext);
              await trgnext.damage();
              game.cardsDiscard(cards);
              game.log(cards, "进入了弃牌堆");
            }
            if (trgprvs && trgprvs !== player2 && trgprvs.hasCard((card) => {
              return card.storage && card.storage.paizhangmrfz;
            }, "h")) {
              const cards = trgprvs.getCards("h", (card) => {
                return card.storage && card.storage.paizhangmrfz;
              });
              player2.logSkill("paizhangmrfz", trgprvs);
              await trgprvs.damage();
              game.cardsDiscard(cards);
              game.log(cards, "进入了弃牌堆");
            }
          }
        },
        tag3: {
          direct: true,
          charlotte: true,
          trigger: { global: "useCardToPlayered" },
          filter: function(event2, player2) {
            if (event2.player == player2) return false;
            if (!event2.player.hasCard(function(card) {
              return card.storage && card.storage.paizhangmrfz;
            }, "h"))
              return false;
            for (var i = 0; i < event2.cards.length; i++) {
              if (event2.cards[i].storage && event2.cards[i].storage.paizhangmrfz) return false;
            }
            for (var i = 0; i < event2.targets.length; i++) {
              if (event2.targets[i] == player2) return true;
            }
          },
          async content(event2, trigger2, player2) {
            const cards = trigger2.player.getCards("h", (card) => {
              return card.storage && card.storage.paizhangmrfz;
            });
            event2.cards = cards;
            game.cardsDiscard(cards);
            game.log(cards, "进入了弃牌堆");
            player2.logSkill("paizhangmrfz", trigger2.player);
            if (trigger2.name === "addJudge") {
              trigger2.cancel();
              const owner = get.owner(trigger2.card);
              if (owner && owner.getCards("hej").includes(trigger2.card)) {
                await owner.lose(trigger2.card, ui.discardPile);
              } else {
                game.cardsDiscard(trigger2.card);
              }
              game.log(trigger2.card, "进入了弃牌堆");
            } else {
              trigger2.getParent().targets.remove(player2);
            }
            const number = Number(event2.cards.map((card) => get.number(card)).reduce((a, b) => Number(a || 0) + Number(b || 0), 0)) || 0;
            if (event2.cards.length > 1 || number === 0) {
              await trigger2.player.damage();
              player2.logSkill("paizhangmrfz", trigger2.player);
            } else if (number > 8) {
              await trigger2.player.damage();
              player2.logSkill("paizhangmrfz", trigger2.player);
            } else {
              await trigger2.player.chooseToDiscard(
                "he",
                Math.floor(number / 3),
                "【排障】:请弃置" + Math.floor(number / 3) + "张牌",
                true
              );
              player2.logSkill("paizhangmrfz", trigger2.player);
            }
            const trgnext = trigger2.player.getNext();
            const trgprvs = trigger2.player.getPrevious();
            if (trgnext && trgnext.hasCard((card) => {
              return card.storage && card.storage.paizhangmrfz;
            }, "h")) {
              const cards2 = trgnext.getCards("h", (card) => {
                return card.storage && card.storage.paizhangmrfz;
              });
              player2.logSkill("paizhangmrfz", trgnext);
              await trgnext.damage();
              game.cardsDiscard(cards2);
              game.log(cards2, "进入了弃牌堆");
            }
            if (trgprvs && trgprvs.hasCard((card) => {
              return card.storage && card.storage.paizhangmrfz;
            }, "h")) {
              const cards2 = trgprvs.getCards("h", (card) => {
                return card.storage && card.storage.paizhangmrfz;
              });
              player2.logSkill("paizhangmrfz", trgprvs);
              await trgprvs.damage();
              game.cardsDiscard(cards2);
              game.log(cards2, "进入了弃牌堆");
            }
          }
        },
        tag4: {
          charlotte: true,
          mod: {
            cardDiscardable: function(card, player2) {
              if (card.storage && card.storage.paizhangmrfz) return false;
            }
          }
        }
      }
    },
    paizhangmrfz2: { charlotte: true },
    //空弦
    tiexianmrfz: {
      mod: {
        maxHandcard: function(player2, num) {
          if (!player2.hujia) return num + 1;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "damageEnd" },
      filter: function(event2, player2) {
        return event2.hujia;
      },
      async content(event2, trigger2, player2) {
        player2.draw(3);
      },
      group: ["tiexianmrfz_draw", "tiexianmrfz_k"],
      subSkill: {
        ban: {
          charlotte: true
        },
        k: {
          mod: {
            cardnumber(card) {
              if (card.hasGaintag("tiexianmrfz")) return 13;
            }
          },
          charlotte: true,
          direct: true,
          trigger: { player: "gainAfter" },
          filter(event2, player2) {
            return !player2.hujia && !player2.hasSkill("tiexianmrfz_ban");
          },
          async content(event2, trigger2, player2) {
            player2.addTempSkill("tiexianmrfz_ban", {
              global: "roundStart"
            });
            for (var i of trigger2.cards) {
              i.addGaintag("tiexianmrfz");
            }
          }
        },
        draw: {
          audio: "tiexianmrfz",
          forced: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return !player2.hujia;
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
          }
        }
      }
    },
    lieshimrfz: {
      audio: 2,
      usable: 3,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.card.name != "sha" || !event2.targets || event2.targets.length > 1) return false;
        return player2.countCards("he") > 0 && game.hasPlayer(function(current) {
          return current != player2 && get.distance(event2.targets[0], current) <= 1 && !event2.targets.includes(current);
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        const target = trigger2.targets[0];
        result2 = await player2.chooseToDiscard(
          "he",
          get.prompt("lieshimrfz"),
          "你可以弃置一张牌并选择一名与" + get.translation(target) + "距离为 1 的其他角色视为使用一张【杀】"
        ).set(
          "goon",
          game.hasPlayer((current) => {
            return get.distance(target, current) === 1 && get.attitude(player2, current) < 2;
          })
        ).set("ai", (card) => {
          if (_status.event.goon) return 6 - get.value(card);
          return 0;
        }).forResult();
        if (result2.cards && result2.cards.length) {
          result2 = await player2.chooseTarget(true, "请选择一名与" + get.translation(target) + "距离为 1 的一名其他角色", (card, player3, target2) => {
            const evt = _status.event.getTrigger();
            return target2 !== player3 && target2 !== evt.targets[0] && get.distance(evt.targets[0], target2) <= 1 && lib.filter.targetEnabled2(evt.card, player3, target2);
          }).set("ai", (target2) => {
            return -get.attitude(player2, target2);
          }).forResult();
        } else {
          return;
        }
        if (result2.bool && result2.targets && result2.targets.length) {
          await player2.useCard({ name: "sha", isCard: true }, result2.targets[0]);
          player2.logSkill("lieshimrfz");
        }
      }
    },
    //麒麟夜刀
    guirenmrfz: {
      audio: 2,
      trigger: { player: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        if (player2.getHandcardLimit() == 0) return false;
        return event2.card.name == "sha";
      },
      prompt: function(event2, player2) {
        return "你可以令此【杀】额外结算一次，然后本回合的手牌上限-1。(当前手牌上限:" + player2.getHandcardLimit() + ")";
      },
      async content(event2, trigger2, player2) {
        trigger2.getParent().targets = trigger2.getParent().targets.concat(trigger2.targets);
        trigger2.getParent().triggeredTargets4 = trigger2.getParent().triggeredTargets4.concat(trigger2.targets);
        if (!player2.hasSkill("guirenmrfz2")) player2.addTempSkill("guirenmrfz2");
        if (!player2.hasSkill("guirenmrfz_lose")) player2.addTempSkill("guirenmrfz_lose");
        player2.storage.guirenmrfz2++;
      },
      subSkill: {
        lose: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseUseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("guirenmrfz");
            player2.addSkill("guiqiangmrfz");
          }
        }
      }
    },
    guirenmrfz2: {
      silent: true,
      charlotte: true,
      firstDo: true,
      trigger: { player: "phaseAfter" },
      init: function(player2) {
        player2.storage.guirenmrfz2 = 0;
      },
      async content(event2, trigger2, player2) {
        player2.storage.guirenmrfz2 = 0;
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num - player2.storage.guirenmrfz2;
        }
      }
    },
    guiqiangmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      frequent: true,
      async content(event2, trigger2, player2) {
        player2.drawTo(Math.min(player2.maxHp, 4));
        const result2 = await player2.chooseToDiscard(get.prompt("guiqiangmrfz"), "你可以弃置一张牌并失去此技能，然后获得【鬼人】", "he").set("ai", function(card) {
          return 6 - get.value(card);
        }).forResult();
        if (result2.cards) {
          player2.removeSkill("guiqiangmrfz");
          player2.addSkill("guirenmrfz");
        }
      }
    },
    luanwumrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      derivation: ["guiqiangmrfz", "guirenmrfz"],
      check: function(event2, player2) {
        if (player2.countCards("h", function(card) {
          return get.type2(card) == "trick" || get.tag(card, "damage");
        }) > 2)
          return false;
        if (player2.getHandcardLimit() > 2) return false;
        return game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current) && get.attitude(player2, current) < 0;
        });
      },
      filter: function(event2, player2) {
        if (!game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current);
        }))
          return false;
        return player2.hasSkill("guirenmrfz");
      },
      async content(event2, trigger2, player2) {
        let result2;
        result2 = await player2.chooseTarget(true, "【乱舞】:请选择一名其他角色，视为对其使用一张结算三次的【杀】", (card, player3, target) => {
          return target !== player3 && player3.inRange(target);
        }).set("ai", (target) => {
          return -get.attitude(player2, target);
        }).forResult();
        if (result2.targets) {
          const target = result2.targets[0];
          player2.addTempSkill("luanwumrfza", {
            player: "shaAfter"
          });
          await player2.useCard({ name: "sha", isCard: true }, target);
        }
        player2.skip("phaseUse");
        player2.skip("phaseDraw");
        player2.skip("phaseJudge");
        if (!player2.hasSkill("luanwumrfz_dam")) {
          player2.addSkill("luanwumrfz_dam");
        }
      },
      group: "luanwumrfz_add",
      subSkill: {
        dam: {
          mark: true,
          intro: {
            content: "受到的伤害+1"
          },
          direct: true,
          charlotte: true,
          trigger: { player: "damageBegin" },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.removeSkill("luanwumrfz_dam");
          }
        },
        add: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseUseBegin" },
          async content(event2, trigger2, player2) {
            player2.addSkill("guirenmrfz");
            player2.removeSkill("luanwumrfz_add");
          }
        }
      }
    },
    luanwumrfza: {
      audio: 2,
      direct: true,
      trigger: { player: "useCardToTargeted" },
      filter: function(event2, player2) {
        return event2.card.name == "sha";
      },
      async content(event2, trigger2, player2) {
        event2.num = 2;
        while (event2.num > 0) {
          event2.num--;
          player2.logSkill("luanwumrfza");
          trigger2.getParent().targets = trigger2.getParent().targets.concat(trigger2.targets);
          trigger2.getParent().triggeredTargets4 = trigger2.getParent().triggeredTargets4.concat(trigger2.targets);
        }
        player2.removeSkill("luanwumrfza");
      }
    },
    //土豆雷（划掉） 伊内丝
    yingzhimrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          var str = "·摸牌阶段摸牌数+" + player2.countMark("yingzhimrfz_draw") + "</br>·手牌上限+" + player2.countMark("yingzhimrfz_mhand");
          str = str + "</br>·使用【杀】的次数+" + player2.countMark("yingzhimrfz_sha");
          if (!player2.hasMark("yingzhimrfz_dying")) return str;
          return str + "</br>·下次造成的伤害+1";
        }
      },
      audio: 6,
      silent: true,
      firstDo: true,
      trigger: { global: "roundStart" },
      async content(event2, trigger2, player2) {
        game.countPlayer((current) => {
          if (current != player2) current.storage.yingzhimrfz_draw = false;
          if (current != player2) current.storage.yingzhimrfz_mhand = false;
          if (current != player2) current.storage.yingzhimrfz_sha = false;
          if (current != player2) current.storage.yingzhimrfz_dying = false;
          return true;
        });
      },
      group: ["yingzhimrfz_draw", "yingzhimrfz_drbuff", "yingzhimrfz_mhand", "yingzhimrfz_sha", "yingzhimrfz_dying", "yingzhimrfz_dybuff"],
      subSkill: {
        //标记
        mark: {
          mark: true,
          charlotte: true,
          intro: {
            content: function(event2, player2) {
              var str = "·摸牌阶段摸牌数-" + player2.countMark("yingzhimrfz_drdebuff") + "</br>·手牌上限-" + player2.countMark("yingzhimrfz_mhddebuff");
              str = str + "</br>·使用【杀】的次数-" + player2.countMark("yingzhimrfz_shadebuff");
              if (!player2.hasSkill("yingzhimrfz_dydebuff")) return str;
              return str + "</br>·下次造成的伤害-1";
            }
          }
        },
        //非延时锦囊牌 摸牌阶段摸牌数
        draw: {
          audio: "yingzhimrfz",
          trigger: { player: "useCardToTargeted" },
          filter: function(event2, player2) {
            if (event2.targets.length > 1) return false;
            if (event2.target.storage.yingzhimrfz_draw) return false;
            return get.type(event2.card) == "trick" && event2.target != player2;
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.target) < 2;
          },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.target) + "下个摸牌阶段摸牌数-1且你摸牌阶段摸牌数+1？";
          },
          async content(event2, trigger2, player2) {
            if (player2.countMark("yingzhimrfz_draw") < 2) player2.addMark("yingzhimrfz_draw", 1, false);
            trigger2.targets[0].storage.yingzhimrfz_draw = true;
            trigger2.targets[0].addSkill("yingzhimrfz_drdebuff");
            trigger2.targets[0].addMark("yingzhimrfz_drdebuff", 1, false);
            trigger2.targets[0].addSkill("yingzhimrfz_mark");
          }
        },
        drbuff: {
          audio: "yingzhimrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "phaseDrawBegin" },
          filter: function(event2, player2) {
            return player2.hasMark("yingzhimrfz_draw");
          },
          async content(event2, trigger2, player2) {
            trigger2.num += player2.countMark("yingzhimrfz_draw");
          }
        },
        drdebuff: {
          audio: "yingzhimrfz",
          trigger: { player: "phaseDrawBegin" },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return player2.hasMark("yingzhimrfz_drdebuff");
          },
          async content(event2, trigger2, player2) {
            trigger2.num -= player2.countMark("yingzhimrfz_drdebuff");
            player2.removeMark("yingzhimrfz_drdebuff", player2.countMark("yingzhimrfz_drdebuff"), false);
            player2.removeSkill("yingzhimrfz_drdebuff");
            if (!player2.hasMark("yingzhimrfz_mhddebuff") && !player2.hasMark("yingzhimrfz_shadebuff") && !player2.hasSkill("yingzhimrfz_dydebuff"))
              player2.removeSkill("yingzhimrfz_mark");
          }
        },
        //其他角色响应你的牌 手牌上限
        mhand: {
          audio: "yingzhimrfz",
          trigger: { global: ["respond", "useCard"] },
          filter: function(event2, player2) {
            if (!event2.respondTo) return false;
            if (event2.player == player2) return false;
            if (player2 != event2.respondTo[0]) return false;
            return !event2.player.storage.yingzhimrfz_mhand;
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) < 2;
          },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.player) + "的下个回合手牌上限-1且你的手牌上限+1？";
          },
          async content(event2, trigger2, player2) {
            if (player2.countMark("yingzhimrfz_mhand") < 3) player2.addMark("yingzhimrfz_mhand", 1, false);
            trigger2.player.addMark("yingzhimrfz_mhddebuff", 1, false);
            trigger2.player.storage.yingzhimrfz_mhand = true;
            trigger2.player.addSkill("yingzhimrfz_mhddebuff");
            trigger2.player.addSkill("yingzhimrfz_mark");
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num + player2.countMark("yingzhimrfz_mhand");
            }
          }
        },
        mhddebuff: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("yingzhimrfz_mhddebuff");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("yingzhimrfz_mhddebuff", player2.countMark("yingzhimrfz_mhddebuff"), false);
            player2.removeSkill("yingzhimrfz_mhddebuff");
            if (!player2.hasMark("yingzhimrfz_drdebuff") && !player2.hasMark("yingzhimrfz_shadebuff") && !player2.hasSkill("yingzhimrfz_dydebuff"))
              player2.removeSkill("yingzhimrfz_mark");
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num - player2.countMark("yingzhimrfz_mhddebuff");
            }
          }
        },
        //进入濒死 伤害+1
        dying: {
          audio: "yingzhimrfz",
          trigger: { global: "dying" },
          filter: function(event2, player2) {
            if (event2.player.storage.yingzhimrfz_dying) return false;
            if (event2.player.hasSkill("yingzhimrfz_dydebuff") && player2.hasMark("yingzhimrfz_dying")) return false;
            return event2.player != player2 && event2.parent && event2.parent.name == "damage" && event2.parent.source && event2.parent.source == player2;
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) < 2;
          },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.player) + "下次造成的伤害-1且你下次造成的伤害+1？";
          },
          async content(event2, trigger2, player2) {
            if (!player2.hasMark("yingzhimrfz_dying")) player2.addMark("yingzhimrfz_dying", 1, false);
            if (!trigger2.player.hasSkill("yingzhimrfz_dydebuff")) {
              trigger2.player.addSkill("yingzhimrfz_dydebuff", false);
              trigger2.player.addSkill("yingzhimrfz_mark");
              trigger2.player.storage.yingzhimrfz_dying = true;
            }
          }
        },
        dybuff: {
          audio: "yingzhimrfz",
          forced: true,
          charlotte: true,
          trigger: { source: "damageBegin" },
          filter: function(event2, player2) {
            return player2.hasMark("yingzhimrfz_dying");
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.removeMark("yingzhimrfz_dying", 1, false);
          }
        },
        dydebuff: {
          audio: "yingzhimrfz",
          forced: true,
          charlotte: true,
          trigger: { source: "damageBegin" },
          async content(event2, trigger2, player2) {
            trigger2.num--;
            player2.removeSkill("yingzhimrfz_dydebuff");
            if (!player2.hasMark("yingzhimrfz_drdebuff") && !player2.hasMark("yingzhimrfz_mhddebuff") && !player2.hasMark("yingzhimrfz_shadebuff"))
              player2.removeSkill("yingzhimrfz_mark");
          }
        },
        //你响应其他角色牌 使用杀的次数
        sha: {
          audio: "yingzhimrfz",
          trigger: { player: ["useCard", "respond"] },
          filter: function(event2, player2) {
            if (!Array.isArray(event2.respondTo)) return false;
            if (player2 == event2.respondTo[0]) return false;
            return !event2.player.storage.sha;
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.respondTo[0]) < 2;
          },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.respondTo[0]) + "的下个回合使用【杀】的次数-1且你使用【杀】的次数+1？";
          },
          async content(event2, trigger2, player2) {
            const target = trigger2.respondTo[0];
            target.addMark("yingzhimrfz_shadebuff", 1, false);
            target.addSkill("yingzhimrfz_shadebuff");
            target.addSkill("yingzhimrfz_mark");
            target.storage.yingzhimrfz_sha = true;
            player2.addMark("yingzhimrfz_sha", 1, false);
            player2.addSkill("yingzhimrfz_sharem");
          },
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("yingzhimrfz_sha");
            }
          }
        },
        sharem: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseUseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("yingzhimrfz_sha", player2.countMark("yingzhimrfz_sha"), false);
            player2.removeSkill("yingzhimrfz_sharem");
          }
        },
        shadebuff: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("yingzhimrfz_shadebuff");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("yingzhimrfz_shadebuff", player2.countMark("yingzhimrfz_shadebuff"), false);
            player2.removeSkill("yingzhimrfz_shadebuff");
            if (!player2.hasMark("yingzhimrfz_drdebuff") && !player2.hasMark("yingzhimrfz_mhddebuff") && !player2.hasSkill("yingzhimrfz_dydebuff"))
              player2.removeSkill("yingzhimrfz_mark");
          },
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num - player2.countMark("yingzhimrfz_shadebuff");
            }
          }
        }
      },
      ai: {
        threaten: 1.1,
        expose: 0.1
      }
    },
    yingshaomrfz: {
      audio: 2,
      trigger: { player: "dyingAfter" },
      filter: function(event2, player2) {
        return event2.parent && event2.parent.name == "damage" && event2.parent.source;
      },
      check: function(event2, player2) {
        return (get.attitude(player2, event2.parent?.source) || 0) < 2;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2?.parent?.source) + "获得‘影哨’标记？";
      },
      async content(event2, trigger2, player2) {
        if (!trigger2.parent) return;
        trigger2.parent.source.addSkill("yingshaomrfz_ban");
      },
      group: "yingshaomrfz_dying",
      subSkill: {
        ban2: {
          charlotte: true,
          mod: {
            cardEnabled: function(card) {
              if (card.name == "sha") return false;
            }
          }
        },
        ban: {
          mark: true,
          intro: {
            content: function(event2, player2) {
              if (player2.hasSkill("yingshaomrfz_ban2")) return "·手牌上限-1</br>·本出牌阶段不能使用【杀】";
              return "·手牌上限-1</br>·使用【杀】的次数至多为1";
            }
          },
          charlotte: true,
          forced: true,
          popup: false,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            if (!player2.isPhaseUsing()) return false;
            return event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            player2.addTempSkill("yingshaomrfz_ban2", {
              player: "phaseUseEnd"
            });
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num - 1;
            }
          }
        },
        dying: {
          audio: "yingshaomrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "dying" },
          filter: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current.hasSkill("yingshaomrfz_ban");
            });
          },
          async content(event2, trigger2, player2) {
            game.countPlayer((current) => {
              if (current.hasSkill("yingshaomrfz_ban")) {
                current.removeSkill("yingshaomrfz_ban");
                if (current.hasSkill("yingshaomrfz_ban2")) current.removeSkill("yingshaomrfz_ban2");
                current.damage(player2);
              }
              return false;
            });
            player2.recover(2 - player2.hp);
            player2.removeSkill("yingshaomrfz");
          }
        }
      },
      ai: {
        expose: 0.2
      }
    },
    //缪尔赛思
    kaiyuanmrfz: {
      audio: 2,
      trigger: {
        global: "roundStart"
      },
      firstDo: true,
      filter: function(event2, player2) {
        return game.roundNumber == 1;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        result2 = await player2.chooseTarget("【开源】:请选择一名角色令其摸两张牌且本局游戏使用【杀】的次数 +1，若该角色是你，你摸一张牌", true).set("ai", (target) => {
          return get.attitude(player2, target) > 0;
        }).forResult();
        if (result2.targets) {
          const target = result2.targets[0];
          await target.draw(2);
          target.addSkill("kaiyuanmrfz_buff");
          if (target === player2) {
            await player2.draw();
            player2.logSkill("kaiyuanmrfz");
          } else {
            player2.logSkill("kaiyuanmrfz", target);
          }
        }
      },
      subSkill: {
        buff: {
          mark: true,
          intro: {
            content: "使用【杀】的次数+1"
          },
          charlotte: true,
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + 1;
            }
          }
        }
      }
    },
    jingshuimrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          return "·你的攻击范围:" + player2.getAttackRange(false) + "</br>·你使用【杀】的次数:" + player2.getCardUsable("sha") + "</br>·你的手牌上限:" + player2.getHandcardLimit();
        }
      },
      audio: 3,
      trigger: { global: "roundStart" },
      direct: true,
      async content(event2, trigger2, player2) {
        const str = "【净水】:你可选择一名其他角色，你将你的手牌数、手牌上限、攻击范围和使用【杀】的次数调整至与其一致";
        const result2 = await player2.chooseTarget(get.prompt("jingshuimrfz"), str, function(card, player3, target) {
          return target != player3;
        }).set("ai", (target) => target.isMaxHandcard()).forResult();
        if (result2.targets) {
          const target = result2.targets[0];
          var numsha = target.getCardUsable("sha");
          var numatt = target.getAttackRange(false);
          var numhand = target.getHandcardLimit();
          player2.logSkill("jingshuimrfz", target);
          if (player2.countCards("h") <= target.countCards("h")) player2.drawTo(target.countCards("h"));
          player2.removeMark("jingshuimrfz_sha", player2.countMark("jingshuimrfz_sha"), false);
          player2.addMark("jingshuimrfz_sha", numsha, false);
          player2.removeMark("jingshuimrfz_att", player2.countMark("jingshuimrfz_att"), false);
          player2.addMark("jingshuimrfz_att", numatt, false);
          player2.removeMark("jingshuimrfz_maxhand", player2.countMark("jingshuimrfz_maxhand"), false);
          player2.addMark("jingshuimrfz_maxhand", numhand, false);
        }
      },
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha" && player2.hasMark("jingshuimrfz_sha")) return player2.countMark("jingshuimrfz_sha");
        },
        attackRangeBase: function(player2, num) {
          if (player2.hasMark("jingshuimrfz_att")) return player2.countMark("jingshuimrfz_att");
        },
        maxHandcard: function(player2, num) {
          if (player2.hasMark("jingshuimrfz_maxhand")) return player2.countMark("jingshuimrfz_maxhand");
        }
      },
      subSkill: {
        sha: {
          charlotte: true
        },
        att: {
          charlotte: true
        },
        maxhand: {
          charlotte: true
        }
      }
    },
    liuxingmrfz: {
      audio: 2,
      trigger: {
        player: "damageBegin"
      },
      usable: 1,
      forced: true,
      filter: function(event2, player2) {
        return player2.countCards("h") >= player2.hp && event2.nature != "thunder";
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      }
    },
    //黑键
    yiyinmrfz: {
      audio: 2,
      chargeSkill: true,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.countMark("charge") > 2) return false;
        return player2.hasCard(function(card) {
          return get.tag(card, "damage");
        }, "h");
      },
      filterCard: function(card) {
        return get.tag(card, "damage");
      },
      selectCard: function() {
        var player2 = _status.event.player;
        return [1, 3 - player2.countMark("charge")];
      },
      check: function(card) {
        var player2 = _status.event.player;
        if (player2.countCards("h", (card2) => card2.name === "sha") > player2.getCardUsable("sha") + 1) return true;
        return card.name != "sha";
      },
      async content(event2, trigger2, player2) {
        const { cards } = event2;
        player2.addMark("charge", cards.length);
      },
      ai: {
        threaten: function(event2, player2) {
          return 0.85 + player2.countMark("charge") * 0.1;
        },
        order: 13,
        result: {
          player: 1
        }
      },
      group: ["yiyinmrfz_sha", "yiyinmrfz_get"],
      subSkill: {
        sha: {
          audio: "yiyinmrfz",
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            if (player2.countMark("charge") == 0) return false;
            return event2.card && event2.card.name == "sha" && !player2.storage.jiyinmrfz;
          },
          prompt: "你可以消耗一点蓄力值令此【杀】的伤害基数+1",
          async content(event2, trigger2, player2) {
            if (!trigger2.baseDamage) trigger2.baseDamage = 1;
            trigger2.baseDamage++;
            player2.removeMark("charge");
          }
        },
        get: {
          silent: true,
          charlotte: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          filter: function(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          async content(event2, trigger2, player2) {
            player2.addMark("charge");
          }
        }
      }
    },
    huangxiangmrfz: {
      audio: 2,
      trigger: { player: "phaseDiscardEnd" },
      filter: function(event2, player2) {
        if (player2.hasCard(function(card) {
          return card.hasGaintag("huangxiangmrfzx");
        }, "h"))
          return false;
        return player2.countMark("charge") > 0 && player2.countCards("h") > 0;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h").set("ai", function(card) {
          if (card.name == "shan" && card.name == "wuxie") return 6;
          if (card.name == "sha" && card.name == "tao" && card.name == "jiu") return 5;
          return 6 - get.value(card);
        }).forResult();
        if (result2.cards) {
          player2.logSkill("huangxiangmrfz");
          player2.addGaintag(result2.cards, "huangxiangmrfzx");
          player2.removeMark("charge");
        }
      },
      group: "huangxiangmrfz_lose",
      subSkill: {
        lose: {
          trigger: {
            player: ["loseAfter", "damageEnd"]
          },
          filter: function(event2, player2) {
            if (event2.name == "damage")
              return player2.hasCard(function(card) {
                return card.hasGaintag("huangxiangmrfzx");
              }, "h");
            if (event2.name == "lose") {
              for (var i in event2.gaintag_map) {
                if (event2.gaintag_map[i].includes("huangxiangmrfzx")) return true;
              }
              return false;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            let result2;
            const history = game.getAllGlobalHistory("useCard");
            for (let i = history.length - 1; i > 0; i--) {
              if (!history[i].targets) continue;
              if (history[i].targets.includes(player2) && history[i].player !== player2) {
                event2.targets = history[i].player;
                break;
              }
            }
            result2 = await player2.chooseControl(
              event2.targets ? ["摸牌", "对" + get.translation(event2.targets) + "造成一点伤害", "cancel2"] : ["摸牌", "cancel2"]
            ).set("ai", () => {
              const aiPlayer = _status.event.player;
              if (event2.targets) {
                if (get.damageEffect(event2.targets, aiPlayer, aiPlayer) > 0) return 1;
                return 0;
              } else {
                return 0;
              }
            }).set("prompt", "【荒响】:请选择一项").forResult();
            if (result2.control !== "cancel2") {
              player2.logSkill("huangxiangmrfz");
              if (result2.control === "摸牌") {
                await player2.draw();
                if (player2.countMark("charge") < 3) {
                  player2.addMark("charge");
                }
              } else {
                await event2.targets.damage();
              }
            } else {
              return;
            }
            if (!player2.hasCard((card) => {
              return card.hasGaintag("huangxiangmrfzx");
            }, "h") && player2.countMark("charge") > 0) {
              result2 = await player2.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h").set("ai", (card) => {
                if (card.name === "shan" || card.name === "wuxie") return 6;
                if (card.name === "sha" || card.name === "tao" || card.name === "jiu") return 5;
                return 6 - get.value(card);
              }).forResult();
            }
            if (result2?.cards) {
              player2.logSkill("huangxiangmrfz");
              player2.addGaintag(result2.cards, "huangxiangmrfzx");
              player2.removeMark("charge");
            }
          }
        }
      }
    },
    jiyinmrfz: {
      audio: 3,
      trigger: { player: "phaseUseBegin" },
      filter: function(event2, player2) {
        return player2.countMark("charge") > 0;
      },
      check: function(event2, player2) {
        return get.player().hasCard(function(card) {
          return card.name == "sha";
        }, "h");
      },
      async content(event2, trigger2, player2) {
        var list = ["jiyinmrfz_eff1", "jiyinmrfz_lose", "jiyinmrfz_eff4", "jiyinmrfz_eff2", "jiyinmrfz_eff3"];
        player2.storage.jiyinmrfz = true;
        for (const i of list) player2.addTempSkill(i);
      },
      subSkill: {
        lose: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.jiyinmrfz = false;
          }
        },
        //伤害基数 目标
        eff1: {
          silent: true,
          charlotte: true,
          trigger: { player: "useCardToPlayered" },
          filter: function(event2, player2) {
            if (!event2.card) return false;
            return event2.card.name == "sha" && event2.targets.length == 1;
          },
          async content(event2, trigger2, player2) {
            const target = trigger2.targets[0];
            let buff = 0;
            if (!game.hasPlayer((current) => {
              return current !== target && current.countCards("h") > target.countCards("h");
            })) {
              buff++;
            }
            if (!game.hasPlayer((current) => {
              return current !== target && current.hp > target.hp;
            })) {
              buff++;
            }
            if (!game.hasPlayer((current) => {
              return current !== target && current.countCards("e") > target.countCards("e");
            })) {
              buff++;
            }
            if (buff === 3) {
              player2.storage.jiyinmrfz_eff1 = true;
              player2.addTempSkill("jiyinmrfz_eff1_buff2", "shaAfter");
            }
            player2.addTempSkill("jiyinmrfz_eff1_buff", "shaAfter");
          },
          mod: {
            playerEnabled: function(card, player2, target) {
              if ((target.isMaxHp() || target.isMaxHandcard() || target.isMaxEquip()) && card.name == "sha") return true;
              else if (card.name == "sha") return false;
            }
          }
        },
        eff1_buff: {
          audio: "huangxiangmrfz",
          trigger: { source: "damageBegin3" },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            const target = trigger2.player;
            if (player2.storage.jiyinmrfz_eff1) {
              trigger2.num = target.hp;
            } else trigger2.num = Math.max(Math.min(target.hp - 1, player2.countMark("charge")), 1);
            player2.removeSkill("jiyinmrfz_eff1_buff");
          }
        },
        eff1_buff2: {
          silent: true,
          charlotte: true,
          trigger: { player: "shaEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.jiyinmrfz_eff1 = false;
          }
        },
        //闪的次数
        eff2: {
          trigger: { player: "useCardToPlayered" },
          forced: true,
          charlotte: true,
          firstDo: true,
          filter: function(event2, player2) {
            return event2.card.name == "sha" && !event2.getParent().directHit.includes(event2.target);
          },
          logTarget: "target",
          async content(event2, trigger2, player2) {
            let targets = trigger2.target;
            let id = trigger2.target.playerid;
            let map = trigger2?.parent?.customArgs;
            if (!id || !map) return;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
              map[id].shanRequired += targets.hp - 1;
            } else {
              map[id].shanRequired = targets.hp;
            }
          },
          ai: {
            directHit_ai: true,
            skillTagFilter: function(player2, tag, arg) {
              if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > player2.countMark("charge")) return false;
            }
          }
        },
        //提示
        eff3: {
          charlotte: true,
          mark: true,
          intro: {
            content: function(event2, player2) {
              var list = [];
              for (var i = 0; i < game.players.length; i++) {
                if (game.players[i].isMaxHp() && game.players[i].isMaxHandcard() && game.players[i].isMaxEquip())
                  list.add(get.translation(game.players[i]));
              }
              return "手牌最多或之一且体力值最多或之一且装备数最多或之一的角色有:</br>" + (list.length ? list : "没有满足条件的角色！");
            }
          }
        },
        //消耗蓄力值
        eff4: {
          forced: true,
          charlotte: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("charge", trigger2.num);
          }
        }
      }
    },
    //伊芙利特 小火龙
    yanmomrfz: {
      audio: 4,
      mod: {
        attackRange: function(player2, num) {
          return num + 2;
        },
        playerEnabled: function(card, player2, target) {
          var gone = [];
          for (var i = 0; i < game.players.length; i++) {
            var players = game.players[i];
            if (players.isAction()) gone.add(players);
          }
          if (target != player2 && _status.currentPhase == player2) {
            if (!gone.includes(target) && player2.storage.yanmomrfz == true) return false;
            if (gone.includes(target) && player2.storage.yanmomrfz == false) return false;
          }
        }
      },
      trigger: { player: "phaseBegin" },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        let num = 0;
        const gone = [];
        const wlgo = [];
        for (const players of game.players) {
          if (players.isAction()) {
            gone.add(players);
          } else {
            wlgo.add(players);
          }
        }
        result2 = await player2.chooseControl().set("choiceList", [
          "只能指定本轮<font color=#f61e46>已进行</font>回合的其他角色<br>(" + get.translation(gone) + ")",
          "只能指定本轮<font color=#f61e46>未进行</font>回合的其他角色<br>(" + get.translation(wlgo) + ")"
        ]).set("ai", () => {
          if (num > game.players.length - num) return 0;
          return 1;
        }).forResult();
        if (result2.index === 0) {
          player2.storage.yanmomrfz = true;
        } else {
          player2.storage.yanmomrfz = false;
        }
        player2.logSkill("yanmomrfz");
      },
      group: ["yanmomrfz_add"],
      subSkill: {
        gone: {
          charlotte: true
        },
        eff: {
          init: function(player2) {
            player2.storage.yanmomrfz_eff = false;
          },
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: "phaseBegin" },
          async content(event2, trigger2, player2) {
            player2.storage.yanmomrfz_eff = true;
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            game.players.forEach((i) => i.storage.yanmomrfz_eff = false);
          }
        },
        add: {
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            if (get.type(event2.card) == "delay") return false;
            if (get.type(event2.card) == "equip") return false;
            return game.hasPlayer(function(current) {
              return !event2.targets.includes(current) && !!player2.canUse(event2.card, current) && current != player2;
            });
          },
          check: function(event2, player2) {
            var num = 0;
            for (var i = 0; i < game.players.length; i++) {
              if (game.players[i] == player2 || event2.targets.includes(game.players[i])) continue;
              if (!player2.inRange(game.players[i])) continue;
              if (player2.canUse(event2.card, game.players[i])) {
                num = num + get.attitude(player2, game.players[i]);
              }
            }
            return num > -1;
          },
          prompt: function(event2, player2) {
            var list = [];
            for (var i = 0; i < game.players.length; i++) {
              if (game.players[i] == player2 || event2.targets.includes(game.players[i])) continue;
              if (!player2.inRange(game.players[i])) continue;
              if (player2.canUse(event2.card, game.players[i])) list.add(get.translation(game.players[i]));
            }
            return "是否增加" + list + "为" + get.translation(event2.card) + "的目标？";
          },
          async content(event2, trigger2, player2) {
            const targets = [];
            for (const current of game.players) {
              if (current === player2 || trigger2.targets.includes(current)) continue;
              if (!player2.inRange(current)) continue;
              if (player2.canUse(trigger2.card, current)) {
                targets.push(current);
                player2.line(current);
              }
            }
            if (targets.length > 0) {
              if (!event2.isMine() && !event2.isOnline()) {
                await game.delayx();
              }
              event2.targets = targets;
            } else {
              return;
            }
            player2.logSkill("yanmomrfz");
            game.log(event2.targets, "成为了", trigger2.card, "的目标");
            trigger2.targets.addArray(event2.targets);
          }
        }
      }
    },
    yanbaomrfz: {
      intro: {
        content: '<span style="text-decoration:line-through">防御力-100</span></br>本轮下次因【杀】受到的伤害+1'
      },
      audio: 2,
      trigger: { source: "damageEnd" },
      global: ["yanbaomrfz_eff", "yanbaomrfz_clear"],
      filter: function(event2, player2) {
        if (!event2.player.isAlive()) return false;
        return !event2.player.hasMark("yanbaomrfz") && event2.player != player2 && !event2.player.storage.yanbaomrfz2;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 2;
      },
      async content(event2, trigger2, player2) {
        trigger2.player.addMark("yanbaomrfz", 1, false);
        trigger2.player.storage.yanbaomrfz2 = true;
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          firstDo: true,
          async content(event2, trigger2, player2) {
            player2.removeMark("yanbaomrfz", 1, false);
            player2.storage.yanbaomrfz2 = false;
          }
        },
        eff: {
          silent: true,
          charlotte: true,
          trigger: { player: "damageBegin" },
          filter: function(event2, player2) {
            if (!player2.hasMark("yanbaomrfz")) return false;
            return event2.card && event2.card.name == "sha";
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.removeMark("yanbaomrfz", 1, false);
            player2.logSkill("yanbaomrfz");
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    yanbaomrfz2: {
      charlotte: true
    },
    huishenmrfz: {
      audio: 2,
      usable: 1,
      trigger: { player: "useCardToPlayer" },
      filter: function(event2, player2) {
        return event2.target != player2;
      },
      async content(event2, trigger2, player2) {
        player2.addTempSkill("huishenmrfz_eff", "useCardAfter");
      },
      subSkill: {
        eff: {
          silent: true,
          trigger: { player: "useCardToPlayered" },
          filter: function(event2, player2) {
            return event2.target != player2;
          },
          async content(event2, trigger2, player2) {
            const result2 = await trigger2.target.chooseToDiscard("弃置一张手牌，或令" + get.translation(player2) + "摸一张牌").set("ai", function(card) {
              var trigger3 = _status.event.getTrigger();
              return -get.attitude(trigger3.target, trigger3.player) - get.value(card);
            }).forResult();
            if (result2.bool == false) player2.draw();
          }
        }
      }
    },
    //淬羽赫默
    renbenmrfz: {
      mark: true,
      intro: {
        name: "《特里蒙科学伦理宣言》",
        content: "本轮游戏不能使用、打出或弃置【$】"
      },
      audio: 2,
      forced: true,
      trigger: { global: "roundStart" },
      //priority:-100,
      async content(event2, trigger2, player2) {
        let result2;
        for (const char of game.players) {
          if (char.hasSkill("renbenmrfz2")) char.removeSkill("renbenmrfz2");
          if (char.hasSkill("renbenmrfz3")) char.removeSkill("renbenmrfz3");
        }
        const list = lib.inpile;
        const list2 = [];
        for (const name of list) {
          const type = get.type(name);
          if (name === "sha") {
            list2.push(["基本", "", "sha"]);
          } else if (type === "basic") {
            list2.push(["基本", "", name]);
          } else if (type === "trick") {
            list2.push(["锦囊", "", name]);
          }
        }
        if (!list.length) {
          return;
        } else {
          event2.cards = list2;
          event2.cards2 = [];
          event2.num = 0;
        }
        while (event2.num < game.players.length) {
          result2 = await game.players[event2.num].chooseButton(true, ["【人本】:请声明一张牌</br>科学理应注视每一个人", [event2.cards, "vcard"]]).set("ai", (button) => {
            switch (button.link[2]) {
              case "wuxie":
                return 0.5 + Math.random();
              case "wuzhong":
              case "dongzhuxianji":
                return 0.3 + Math.random();
              case "guohe":
              case "zhujinqiyuan":
                return 0.3 + Math.random();
              case "sha":
                return 0.3 + Math.random();
              case "tao":
                return 0.4 + Math.random();
              case "shan":
                return 0.3 + Math.random();
              default:
                return Math.random();
            }
          }).forResult();
          if (result2.links) {
            event2.cards2.add2(result2.links[0][2]);
            game.log(game.players[event2.num], "声明了", result2.links[0][2]);
          }
          event2.num++;
        }
        const maxCard = game.mostStr(event2.cards2);
        if (maxCard.length === 1) {
          game.log("本轮游戏不能使用、打出或弃置", maxCard);
          player2.popup(maxCard);
          player2.storage.renbenmrfz = maxCard;
          for (const p of game.players) {
            if (p.storage.renbenmrfz !== maxCard) p.storage.renbenmrfz = maxCard;
          }
        } else {
          event2.cards3 = maxCard;
          result2 = await player2.chooseButton([true, "【人本】:请选择一张牌</br>科学理应注视每一个人", [event2.cards3, "vcard"]]).forResult();
          if (result2.links) {
            game.log("本轮游戏不能使用、打出或弃置", result2.links[0][2]);
            player2.popup(result2.links[0][2]);
            player2.storage.renbenmrfz = result2.links[0][2];
            for (const p of game.players) {
              if (p.storage.renbenmrfz !== result2.links[0][2]) p.storage.renbenmrfz = result2.links[0][2];
            }
          }
        }
        event2.num2 = 0;
        while (event2.num2 < game.players.length) {
          const currentPlayer = game.players[event2.num2];
          if (currentPlayer !== player2) {
            result2 = await currentPlayer.chooseControl("是", "否").set("prompt", "【人本】:是否遵守协议？(不能使用或打出" + get.translation(player2.storage.renbenmrfz) + ")").set("ai", () => {
              const aiPlayer = _status.event.player;
              if (!aiPlayer.getEquip(1)) return 0;
              if (game.hasPlayer((current) => {
                return get.distance(aiPlayer, current) <= 1 && aiPlayer !== current && get.attitude(aiPlayer, current) < 0;
              }) || aiPlayer.storage.renbenmrfz === "sha" && Math.random() > 0.4)
                return 1;
              return 0;
            }).forResult();
            if (result2.index === 0) {
              currentPlayer.addSkill("renbenmrfz2");
            } else if (result2.index === 1) {
              currentPlayer.addSkill("renbenmrfz3");
            }
          }
          event2.num2++;
        }
      },
      global: "renbenmrfz_use",
      subSkill: {
        use: {
          mod: {
            cardDiscardable: function(card, player2) {
              if (get.name(card) == player2.storage.renbenmrfz && (player2.hasSkill("renbenmrfz2") || player2.hasSkill("renbenmrfz")))
                return false;
            },
            cardEnabled2: function(card, player2) {
              if (get.name(card) == player2.storage.renbenmrfz && (player2.hasSkill("renbenmrfz2") || player2.hasSkill("renbenmrfz")))
                return false;
            },
            ignoredHandcard: function(card, player2) {
              if (get.name(card) == player2.storage.renbenmrfz && player2.hasSkill("renbenmrfz")) {
                return true;
              }
            }
          }
        }
      }
    },
    renbenmrfz2: {
      mark: true,
      intro: {
        content: "接受《特里蒙科学伦理宣言》"
      },
      audio: "renbenmrfz",
      enable: "phaseUse",
      filterCard: function(card, player2) {
        return card.name == player2.storage.renbenmrfz;
      },
      discard: false,
      lose: false,
      filter: function(event2, player2) {
        return player2.hasCard(function(card) {
          return card.name == player2.storage.renbenmrfz;
        }, "h");
      },
      filterTarget: function(card, player2, target) {
        return target != player2 && target.hasSkill("renbenmrfz");
      },
      async content(event2, trigger2, player2) {
        await player2.draw();
        player2.give(event2.cards, event2.target);
      },
      group: "renbenmrfz2_lose",
      subSkill: {
        lose: {
          charlotte: true,
          silent: true,
          firstDo: true,
          priority: 50,
          trigger: { global: "die" },
          filter: function(event2, player2) {
            return event2.player.hasSkill("renbenmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeSkill("renbenmrfz2");
          }
        }
      },
      ai: {
        order: 13,
        result: {
          player: function(player2, target) {
            if (get.attitude(player2, target) > 0) return 1;
            return -1;
          }
        }
      }
    },
    renbenmrfz3: {
      mark: true,
      markimage: "extension/WhichWay/image/skill/rejecthmmrfz.png",
      intro: {
        content: function(event2, player2) {
          return "不接受《特里蒙科学伦理宣言》</br>当前攻击距离为" + player2.getAttackRange(false);
        }
      },
      mod: {
        attackRange: function(player2, num) {
          var atk = 0;
          for (var i = 0; i < game.players.length; i++) {
            if (game.players[i] == player2) continue;
            if (game.players[i].hasSkill("renbenmrfz2")) atk++;
          }
          return num - Math.max(2, atk);
        }
      }
    },
    dizhumrfz: {
      audio: 2,
      trigger: { player: "phaseUseBegin" },
      direct: true,
      async content(event2, trigger2, player2) {
        game.players.forEach((char) => char.removeSkill("dizhumrfzx"));
        const result2 = await player2.chooseTarget("【砥柱】:你可以选择至多两名角色，令其获得‘夜灯’标记", [0, 2]).set("ai", function(target) {
          return get.attitude(_status.event.player, target) > 2;
        }).forResult();
        if (result2.targets) {
          var targets = result2.targets;
          player2.logSkill("dizhumrfz");
          for (const i of targets) {
            i.addSkill("dizhumrfzx");
            i.storage.dizhumrfz = true;
            player2.line(i);
          }
        }
      }
    },
    dizhumrfzx: {
      mark: true,
      markimage: "extension/WhichWay/image/skill/yedengmrfz.png",
      intro: {
        content: function(event2, player2) {
          return "受到的伤害-1，若为致命伤害，则防止之";
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "damageBegin3" },
      async content(event2, trigger2, player2) {
        if (trigger2.num < player2.hp) trigger2.num--;
        else trigger2.num = 0;
        player2.removeMark("dizhumrfz");
        player2.removeSkill("dizhumrfzx");
        player2.logSkill("dizhumrfz");
      }
    },
    //塞雷娅
    fuyuanmrfz: {
      audio: 2,
      trigger: { global: "recoverEnd" },
      forced: true,
      filter: function(event2, player2) {
        return event2.source == player2 && event2.player != player2;
      },
      async content(event2, trigger2, player2) {
        trigger2.player.draw();
      }
    },
    gaihuamrfz: {
      audio: 2,
      trigger: { global: "damageBegin" },
      filter: function(event2, player2) {
        if (event2.player == player2) return false;
        return event2.nature && player2.inRange(event2.player);
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let result2;
        if (trigger2.card) {
          const cards = trigger2.card;
          result2 = await player2.chooseToDiscard(
            "he",
            get.prompt("gaihuamrfz"),
            //@ts-ignore
            "是否弃置一张非" + get.translation(get.type(cards)) + "牌令此伤害 +1",
            (card) => {
              return get.type(card) !== get.type(cards);
            }
          ).set("goon", get.attitude(player2, trigger2.player) < 0).set("ai", (card) => {
            if (!_status.event.goon) return 0;
            return 7 - get.value(card);
          }).forResult();
        } else {
          result2 = await player2.chooseToDiscard(get.prompt("gaihuamrfz"), "是否弃置一张牌令此伤害 +1").set("goon", get.attitude(player2, trigger2.player) < 0).set("ai", (card) => {
            if (!_status.event.goon) return 0;
            return 7 - get.value(card);
          }).forResult();
        }
        if (result2.bool) {
          trigger2.num++;
          player2.logSkill("gaihuamrfz", trigger2.player);
        }
      }
    },
    yaopeimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.getCardUsable("sha") > 0 && player2.countCards("he") > 0;
      },
      filterCard: true,
      position: "he",
      prompt: "请弃置一张牌",
      async content(event2, trigger2, player2) {
        let result2;
        let go = false;
        if (game.hasPlayer((current) => {
          return get.distance(player2, current) <= 1 && get.attitude(player2, current) > 2 && current.getDamagedHp() > 2;
        })) {
          go = true;
        } else if (!game.hasPlayer((current) => {
          return get.distance(player2, current) <= 1 && get.attitude(player2, current) > 0 && current.getDamagedHp() > 0 && current !== player2;
        }) && player2.getDamagedHp() > 0) {
          go = true;
        }
        player2.addTempSkill("yaopeimrfz2", "phaseUseAfter");
        result2 = await player2.chooseTarget(
          "【药配】:选择一名与你距离不大于 1 的角色令其回血，或选择'取消'令攻击范围内的所有角色回复一点体力",
          (card, target, player3) => {
            return get.distance(player3, target) <= 1 && target.getDamagedHp() > 0;
          }
        ).set("go", go).set("ai", (target) => {
          const aiPlayer = _status.event.player;
          if (go) return get.attitude(aiPlayer, target) > 2;
          return 0;
        }).forResult();
        if (result2.targets) {
          const targets = result2.targets[0];
          await targets.recover();
          if (targets.getDamagedHp() >= 3) {
            await targets.recover();
          }
        } else {
          for (let i = 0; i < game.players.length; i++) {
            if (player2.inRange(game.players[i]) || game.players[i] === player2) {
              await game.players[i].recover();
            }
          }
        }
      },
      ai: {
        expose: 0.1,
        threaten: 1.5,
        order: 13,
        result: {
          player: function(player2) {
            var num = 0, player2 = _status.event.player;
            for (var i = 0; i < game.players.length; i++) {
              var targetx = game.players;
              if (!player2.inRange(targetx[i])) continue;
              if (get.attitude(player2, targetx[i]) > 0 && targetx[i].getDamagedHp() > 0) num++;
              if (get.attitude(player2, targetx[i]) <= 0 && targetx[i].getDamagedHp() > 0) num--;
              if (player2.getDamagedHp() > 0) {
                num = 1;
                break;
              }
            }
            if (num > 0) return 1;
            return -1;
          }
        }
      }
    },
    yaopeimrfz2: {
      charlotte: true,
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num - 1;
        }
      }
    },
    //焰影苇草
    minghuomrfz: {
      audio: 4,
      trigger: { player: "phaseZhunbeiBegin" },
      direct: true,
      async content(event2, trigger2, player2) {
        if (player2.hasSkill("minghuomrfz_buff1")) player2.removeSkill("minghuomrfz_buff1");
        if (player2.hasSkill("minghuomrfz_buff2")) player2.removeSkill("minghuomrfz_buff2");
        const result2 = await player2.chooseControl().set("choiceList", [
          "每回合你使用的第一张单一目标的普通锦囊或【杀】可以额外指定一个目标",
          "当有‘灼痕’标记的角色进入濒死状态时，你可以令其上家或下家获得一个‘灼痕’标记",
          '<span style="text-decoration:line-through">真的会有人选这个选项吗？</span>不发动此技能'
        ]).set("ai", function() {
          if (game.countPlayer(function(current) {
            var curnext = current.getNext(), curpre = current.getPrevious();
            return current != player2 && current.hasMark("zhuohenmrfz") && current.hp < 2 && (get.attitude(player2, curnext) || get.attitude(player2, curpre));
          }) > 0)
            return 1;
          return 0;
        }).forResult();
        if (result2.index !== 2) {
          if (result2.index == 0) player2.addSkill("minghuomrfz_buff1");
          else player2.addSkill("minghuomrfz_buff2");
          player2.logSkill("minghuomrfz");
        }
      },
      subSkill: {
        buff1: {
          trigger: { player: "useCard2" },
          filter: function(event2, player2) {
            if (player2.hasSkill("minghuomrfz_mark")) return false;
            if (event2.targets.length > 1) return false;
            if (get.type(event2.card) != "trick" && event2.card.name != "sha") return false;
            return game.hasPlayer(function(current) {
              return !event2.targets.includes(current) && !!player2.canUse(event2.card, current);
            });
          },
          direct: true,
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseTarget(
              get.prompt("minghuomrfz"),
              "为" + get.translation(trigger2.card) + "增加一个目标",
              (card, player3, target) => {
                return !_status.event.sourcex.includes(target) && player3.canUse(_status.event.card, target);
              }
            ).set("sourcex", trigger2.targets).set("ai", (target) => {
              const aiPlayer = _status.event.player;
              return get.effect(target, _status.event.card, aiPlayer, aiPlayer);
            }).set("card", trigger2.card).forResult();
            if (result2.targets) {
              if (!event2.isMine() && !event2.isOnline()) {
                await game.delayx();
              }
              event2.target = result2.targets[0];
              player2.addTempSkill("minghuomrfz_mark", "phaseEnd");
            } else {
              return;
            }
            player2.logSkill("minghuomrfz", event2.target);
            trigger2.targets.push(event2.target);
          }
        },
        buff2: {
          trigger: { global: "dying" },
          direct: true,
          filter: function(event2, player2) {
            if (event2.player.getNext()?.hasMark("zhuohenmrfz") && event2.player.getPrevious()?.hasMark("zhuohenmrfz")) return false;
            return game.players.length > 2 && event2.player.hasMark("zhuohenmrfz");
          },
          async content(event2, trigger2, player2) {
            const target = trigger2.player;
            const result2 = await player2.chooseTarget(
              get.prompt("minghuomrfz"),
              "你可以令" + get.translation(target) + "的上家或下家（不能是你）获得一个‘灼痕’标记",
              function(card, player3, target2) {
                return !target2.hasMark("zhuohenmrfz") && target2 != player3 && (target2 == _status.event.TriPlayer.getNext() || target2 == _status.event.TriPlayer.getPrevious());
              }
            ).set("TriPlayer", trigger2.player).set("ai", function(player3, target2) {
              const targetx = get.event().targetx;
              if (get.attitude(player3, targetx.getNext()) > 2 && get.attitude(player3, targetx.getNext()) > 2) return 0;
              return get.attitude(player3, target2) < 2;
            }).set("targetx", trigger2.player).forResult();
            if (result2.targets) {
              const targetx = result2.targets[0];
              targetx.addMark("zhuohenmrfz");
              player2.logSkill("zhuohenmrfz", targetx);
              if (targetx.countCards("h") > 0) targetx.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
            }
          }
        },
        mark: {
          charlotte: true
        }
      }
    },
    yingyaomrfz: {
      intro: {
        content: function(event2, player2) {
          return "剩余使用次数:" + (game.totalmark("zhuohenmrfz") - player2.countMark("yingyaomrfz"));
        }
      },
      audio: 2,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        if (game.totalmark("zhuohenmrfz") <= player2.countMark("yingyaomrfz")) return false;
        return event2.player != player2 && game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current);
        });
      },
      async content(event2, trigger2, player2) {
        const result2 = await player2.chooseTarget(
          true,
          get.prompt("yingyaomrfz"),
          "你可以选择一名在你攻击范围内的角色，令其回复一点体力，若其为你，你摸一张牌",
          function(card, player3, target2) {
            return player3.inRange(target2) && target2.getDamagedHp() > 0 || target2 == player3;
          }
        ).set("ai", function(target2) {
          return get.attitude(_status.event.player, target2) > 2;
        }).forResult();
        if (result2.targets) {
          var target = result2.targets[0];
          target.recover();
          player2.addMark("yingyaomrfz", 1, false);
          if (target == player2) player2.draw();
        }
      },
      group: "yingyaomrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeMark("yingyaomrfz", player2.countMark("yingyaomrfz"), false);
          }
        }
      }
    },
    zhuohenmrfz: {
      intro: {
        content: "·被德拉克的火焰灼伤</br>·手牌上限-1</br>·受到伤害时需弃置一张手牌"
      },
      global: "zhuohenmrfz_debuff2",
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        return event2.target != player2 && !event2.target.hasMark("zhuohenmrfz") && !event2.target.hasSkill("zhuohenmrfz2");
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) < 0;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.target) + "获得一个‘灼痕’标记？";
      },
      async content(event2, trigger2, player2) {
        const target = trigger2.target;
        target.addMark("zhuohenmrfz");
        target.addSkill("zhuohenmrfz_clear");
        target.addTempSkill("zhuohenmrfz2");
        if (target.countCards("h") > 0) target.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + game.totalmark("zhuohenmrfz");
        }
      },
      group: ["zhuohenmrfz_debuff", "zhuohenmrfz_draw"],
      subSkill: {
        draw: {
          audio: "zhuohenmrfz",
          forced: true,
          trigger: { global: "phaseBegin" },
          filter: function(event2, player2) {
            return event2.player.hasMark("zhuohenmrfz") && !player2.isMaxHandcard(true);
          },
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        },
        clear: {
          silent: true,
          firstDo: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("zhuohenmrfz");
            player2.removeSkill("zhuohenmrfz_clear");
          }
        },
        debuff: {
          charlotte: true,
          direct: true,
          trigger: { global: "damageBegin" },
          filter: function(event2, player2) {
            return event2.player != player2 && event2.player.hasMark("zhuohenmrfz") && event2.player.countCards("h") > 0;
          },
          async content(event2, trigger2, player2) {
            trigger2.player.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
          }
        },
        debuff2: {
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              if (player2.hasMark("zhuohenmrfz")) return num - 1;
            }
          }
        }
      }
    },
    zhuohenmrfz2: {
      charlotte: true
    },
    //霍尔海雅
    chuangzhongmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        for (var i = 0; i < event2.targets.length; i++) {
          if (event2.targets[i].hasMark("kuangyumrfz")) {
            return true;
          }
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        for (var i = 0; i < trigger2.targets.length; i++) {
          if (trigger2.targets[i].hasMark("kuangyumrfz")) {
            trigger2.targets[i].addTempSkill("fengyin");
            trigger2.targets[i].addSkill("chuangzhongmrfz_eff");
          }
        }
      },
      subSkill: {
        eff: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseDiscardEnd" },
          async content(event2, trigger2, player2) {
            player2.removeSkill("chuangzhongmrfz_eff");
          },
          mod: {
            maxHandcard: function(player2, num) {
              if (player2.hasMark("kuangyumrfz")) return num - player2.hp;
            }
          }
        }
      }
    },
    kuangyumrfz: {
      intro: {
        name: "风起",
        content: function(event2, player2) {
          if (player2.hasSkill("chuangzhongmrfz_eff")) return "·回合开始时，随机跳过两个阶段</br>·手牌上限-" + player2.hp;
          return "·回合开始时，随机跳过两个阶段";
        }
      },
      audio: 4,
      derivation: ["kuangyumrfz_rewirte"],
      trigger: { player: "useCardToPlayered" },
      firstDo: true,
      filter: function(event2, player2) {
        var nost = get.type(event2.card) != "trick" && get.type(event2.card) != "delay";
        var hast = get.type(event2.card) != "trick" && event2.card.name != "sha";
        if (!event2.targets || event2.targets.length > 1) return false;
        if (event2.cards && (player2.storage.kuangyumrfz ? nost : hast)) return false;
        return event2.target != player2 && !event2.target.hasMark("kuangyumrfz");
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.target) + "获得一个‘风起’标记？";
      },
      async content(event2, trigger2, player2) {
        const target = trigger2.target;
        target.addMark("kuangyumrfz");
        target.addSkill("kuangyumrfz_clear");
        target.addTempSkill("kuangyumrfz2");
        target.addSkill("kuangyumrfz_skip");
        if (player2.inRange(target)) player2.addTempSkill("kuangyumrfz_damage", "useCardAfter");
      },
      group: "kuangyumrfz_clear2",
      subSkill: {
        clear2: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.kuangyumrfz;
          },
          async content(event2, trigger2, player2) {
            player2.storage.kuangyumrfz = false;
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.removeMark("kuangyumrfz");
            player2.removeSkill("kuangyumrfz_clear");
          }
        },
        skip: {
          audio: "kuangyumrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "phaseBegin" },
          async content(event2, trigger2, player2) {
            var phase = ["phaseBegin", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"].randomGets(2);
            for (var i = 0; i < phase.length; i++) {
              player2.skip(phase[i]);
            }
            game.log(player2, "因【狂语】将会跳过", get.tranPhase(phase[0]), "和", get.tranPhase(phase[1]));
            player2.removeSkill("kuangyumrfz_skip");
          }
        },
        damage: {
          audio: "kuangyumrfz",
          trigger: { source: "damageBegin" },
          forced: true,
          filter: function(event2, player2) {
            return event2.player.hasMark("kuangyumrfz");
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.storage.kuangyumrfz = true;
          }
        }
      }
    },
    kuangyumrfz2: {
      charlotte: true
    },
    //新棘刺
    jihumrfz: {
      audio: 2,
      intro: {
        content: "荆棘护身"
      },
      trigger: { player: "phaseZhunbeiBegin" },
      check: function(event2, player2) {
        if (player2.countCards("h", function(card) {
          return get.tag(card, "damage") || get.type(card) == "trick" && !get.tag(card, "damage") || get.type(card) == "delay";
        }) > 1)
          return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        if (!player2.hasMark("jihumrfz")) player2.addMark("jihumrfz", 1, false);
        player2.addTempSkill("zishou2");
      },
      group: ["jihumrfz_clear", "jihumrfz_buff"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseBegin" },
          filter: function(event2, player2) {
            return player2.hasMark("jihumrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("jihumrfz", 1, false);
          }
        },
        buff: {
          trigger: { target: "useCardToTargeted" },
          usable: 1,
          filter: function(event2, player2) {
            if (get.type(event2.card) == "delay" || get.type(event2.card) == "equip") return false;
            if (!player2.hasMark("jihumrfz")) return false;
            return event2.player != player2 && (player2.canUse(event2.card, event2.player, false) || game.hasPlayer(function(current) {
              return (
                //@ts-ignore
                current != player2 && get.distance(player2, current) <= 1 && !!player2.canUse(event2.card, current, true)
              );
            }));
          },
          direct: true,
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseTarget((card, player3, target) => {
              return player3.canUse(trigger2.card, target, false) && target !== player3 && (get.distance(player3, target) <= 1 || target === _status.event.TriPlayer);
            }).set("TriPlayer", trigger2.player).set("prompt", get.prompt("jihumrfz")).set("prompt2", "【棘护】:你可以使用一张【" + get.translation(trigger2.card.name) + "】").set("ai", (target) => {
              return -get.attitude(player2, target);
            }).forResult();
            if (result2.targets) {
              await player2.useCard({ name: trigger2.card.name, isCard: true }, result2.targets[0], false);
              player2.logSkill("jihumrfz");
            }
          }
        }
      }
    },
    re_jianshumrfz: {
      audio: "jianshumrfz",
      derivation: ["re_chaoshengmrfz"],
      intro: {
        content: function(event2, player2) {
          var num = player2.countMark("re_jianshumrfz");
          if (num == 20) return "出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数+1;攻击距离和【杀】的使用次数各+2";
          else if (num >= 10)
            return "已累计指定" + num + "次</br>出牌阶段开始时可以使用一张【杀】</br>摸牌阶段摸牌数、攻击距离和【杀】的使用次数各+1";
          return "已累计指定" + num + "次";
        }
      },
      direct: true,
      trigger: { player: "useCardToTargeted" },
      filter: function(event2, player2) {
        return player2.countMark("re_jianshumrfz") < 20;
      },
      async content(event2, trigger2, player2) {
        await player2.addMark("re_jianshumrfz", 1, false);
        const num = player2.countMark("re_jianshumrfz");
        if (num % 10 == 0) {
          player2.logSkill("jianshumrfz");
          if (num == 10) {
            player2.addSkill("re_jianshumrfz_usesha");
            player2.addMark("re_jianshumrfz_time", 1, false);
            player2.addMark("re_jianshumrfz_draw", 1, false);
            player2.addMark("re_jianshumrfz_range", 1, false);
          }
          if (num == 20) {
            player2.addMark("re_jianshumrfz_time", 1, false);
            player2.addMark("re_jianshumrfz_range", 1, false);
            player2.removeSkill("jihumrfz");
            player2.addSkill("re_chaoshengmrfz");
          }
        }
      },
      group: ["re_jianshumrfz_time", "re_jianshumrfz_range", "re_jianshumrfz_draw"],
      subSkill: {
        time: {
          charlotte: true,
          onremove: true,
          mod: {
            cardUsable: function(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("re_jianshumrfz_time");
            }
          }
        },
        range: {
          charlotte: true,
          onremove: true,
          mod: {
            attackRange: function(player2, num) {
              return num + player2.countMark("re_jianshumrfz_range");
            }
          }
        },
        draw: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return player2.hasMark("re_jianshumrfz_draw");
          },
          async content(event2, trigger2, player2) {
            trigger2.num++;
            player2.logSkill("jianshumrfz");
          }
        },
        usesha: {
          direct: true,
          trigger: { player: "phaseUseBegin" },
          async content(event2, trigger2, player2) {
            const result2 = await player2.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function(card, player3, target) {
              return target != player3 && player3.inRange(target);
            }).set("ai", (target) => -get.attitude(player2, target)).forResult();
            if (result2.targets) {
              const target = result2.targets[0];
              player2.useCard({ name: "sha" }, true, false, target);
              player2.logSkill("jianshumrfz");
            }
          }
        }
      }
    },
    re_chaoshengmrfz: {
      audio: "chaoshengmrfz",
      trigger: { player: "phaseEnd" },
      filter: function(event2, player2) {
        return !player2.getStat("damage");
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        player2.draw(2);
        player2.recover();
      }
    },
    //煌
    yanxunmrfz: {
      audio: 4,
      trigger: { player: "damageBegin" },
      forced: true,
      filter: function(event2, player2) {
        return event2.parent && (event2.parent.name === "_lianhuan" || event2.parent.name === "_lianhuan2");
      },
      async content(event2, trigger2, player2) {
        trigger2.num--;
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + 2;
        }
      },
      group: ["yanxunmrfz_kaishi", "yanxunmrfz_draw", "yanxunmrfz_use", "yanxunmrfz_judge"],
      subSkill: {
        judge: {
          audio: "yanxunmrfz",
          trigger: { player: "damageBegin" },
          forced: true,
          filter: function(event2, player2) {
            return event2.getParent("phaseJudge") && event2.getParent("phaseJudge").player == player2;
          },
          async content(event2, trigger2, player2) {
            trigger2.num -= 2;
          }
        },
        kaishi: {
          direct: true,
          trigger: { global: "roundStart" },
          popup: false,
          async content(event2, trigger2, player2) {
            if (player2.isLinked()) {
              player2.link();
              player2.logSkill("yanxunmrfz");
            }
            if (player2.isTurnedOver()) {
              const result2 = await player2.chooseBool().set("prompt", get.prompt("yanxunmrfz")).set("prompt2", "【严训】:是否翻面并跳过下个出牌阶段？").set("ai", function() {
                var player3 = _status.event.player;
                return player3.countCards("h") < player3.getHandcardLimit() * 2;
              }).forResult();
              if (result2.bool) {
                player2.turnOver();
                player2.addSkill("yanxunmrfz_skipped");
                player2.logSkill("yanxunmrfz");
              }
            }
          }
        },
        skipped: {
          direct: true,
          mark: true,
          intro: {
            content: "跳过下个出牌阶段"
          },
          trigger: { player: "phaseBegin" },
          async content(event2, trigger2, player2) {
            player2.skip("phaseUse");
            game.log(player2, "的出牌阶段将被跳过");
            player2.removeSkill("yanxunmrfz_skipped");
          }
        },
        draw: {
          audio: "yanxunmrfz",
          trigger: { player: "phaseUseBegin" },
          filter: function(event2, player2) {
            return player2.getHistory("skipped").map((i) => i.name).includes("phaseDraw");
          },
          frequent: true,
          prompt: "【严训】:是否摸一张牌?",
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        },
        use: {
          audio: "yanxunmrfz",
          trigger: { player: "phaseDiscardBefore" },
          filter: function(event2, player2) {
            var cardh = player2.getCards("h"), canuse = false;
            for (var i = 0; i < cardh.length; i++) {
              if (player2.hasUseTarget(cardh[i])) {
                canuse = true;
                break;
              }
            }
            return player2.getHistory("skipped").map((i2) => i2.name).includes("phaseUse") && canuse == true;
          },
          prompt: "【严训】:是否使用至多两张手牌?",
          async content(event2, trigger2, player2) {
            let result2;
            event2.num = 0;
            while (event2.num < 2) {
              event2.num++;
              const cardh = player2.getCards("h");
              const cards = [];
              for (const card of cardh) {
                cards.push(card.name);
              }
              const list = [];
              for (const name of lib.inpile) {
                if (!cards.includes(name)) continue;
                const card = { name, isCard: true };
                if (!player2.hasUseTarget(card)) continue;
                const type = get.type(card);
                if (type === "basic") {
                  list.push(["基本", "", name]);
                } else if (type === "trick" || type === "delay") {
                  list.push(["锦囊", "", name]);
                } else if (type === "equip") {
                  list.push(["装备", "", name]);
                }
              }
              if (list.length) {
                result2 = await player2.chooseButton(["【严训】:请选择你要使用的手牌 (" + event2.num + "/2)", [list, "vcard"]], "hidden").forResult();
              } else {
                return;
              }
              if (result2.links) {
                const name = result2.links[0][2];
                await player2.chooseToUse(
                  (card, player3, event3) => {
                    return get.name(card) === name;
                  },
                  "【严训】:你可以使用一张" + get.translation(name)
                );
              } else {
                return;
              }
            }
          }
        }
      }
    },
    chuchanmrfz: {
      intro: {
        content: function(event2, player2) {
          if (!player2.storage.chuchanmrfz) return "未发动";
          if (player2.storage.chuchanmrfz && player2.hasSkill("chuchanmrfz_buff1")) return "本轮受到伤害后回复一点体力";
          return "已发动";
        }
      },
      audio: 2,
      trigger: { player: "changeHp" },
      forced: true,
      unique: true,
      mark: true,
      limited: true,
      skillAnimation: true,
      animationStr: "除颤",
      animationColor: "fire",
      init: function(player2) {
        player2.storage.chuchanmrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.chuchanmrfz && player2.hp < 2;
      },
      async content(event2, trigger2, player2) {
        player2.storage.chuchanmrfz = true;
        player2.recoverTo(2);
        player2.addSkill("chuchanmrfz_buff1");
        player2.addSkill("chuchanmrfz_buff2");
        player2.awakenSkill(event2.name);
      },
      subSkill: {
        buff1: {
          audio: "chuchanmrfz",
          trigger: { player: "damageEnd" },
          firstDo: true,
          forced: true,
          charlotte: true,
          async content(event2, trigger2, player2) {
            player2.recover();
          },
          ai: {
            effect: {
              target: function(card, player2, target, current) {
                if (get.tag(card, "damage")) return "zerotarget";
                if (get.type(card) == "trick" && get.tag(card, "damage")) {
                  return "zeroplayertarget";
                }
              }
            }
          }
        },
        buff2: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          async content(event2, trigger2, player2) {
            player2.removeSkill(["chuchanmrfz_buff1", "chuchanmrfz_buff2"]);
          }
        }
      }
    },
    feixuemrfz: {
      mod: {
        cardUsable: function(card, player2, num) {
          if (card.name == "sha") return num + player2.storage.feixuemrfz;
        }
      },
      init: function(player2) {
        player2.storage.feixuemrfz = 0;
      },
      onremove: true,
      audio: 4,
      trigger: { player: ["loseHpEnd", "damageEnd"] },
      async content(event2, trigger2, player2) {
        event2.num = trigger2.num;
        while (event2.num > 0) {
          event2.num--;
          const card = get.cardPile2((c) => {
            return get.name(c) === "sha" && c.nature === "fire";
          });
          if (card) {
            await player2.gain(card, "gain2", "log");
          } else {
            await player2.draw();
          }
          if (trigger2.source && trigger2.source.countCards("e") > 0) {
            player2.storage.feixuemrfz += 1;
            const next = player2.discardPlayerCard(trigger2.source, "e", false).set("forceAuto", true);
            next.boolline = true;
            await next;
          }
        }
      },
      group: "feixuemrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          async content(event2, trigger2, player2) {
            player2.storage.feixuemrfz = 0;
          }
        }
      },
      ai: {
        expose: 0.1,
        threaten: 0.8
      }
    },
    //铃兰
    hualaomrfz: {
      marktext: "脆弱",
      intro: {
        name: "脆弱",
        content: "下次受到的伤害+#"
      },
      audio: 2,
      trigger: { source: "damageBegin" },
      filter: function(event2, player2) {
        return event2.player != player2;
      },
      check: function(event2, player2) {
        if (get.attitude(player2, event2.player) > 0) return false;
        if (event2.num + event2.player.countMark("hualaomrfz") - event2.player.hp >= 0) return false;
        return true;
      },
      async content(event2, trigger2, player2) {
        const target = trigger2.player;
        target.addMark("hualaomrfz", trigger2.num + 1, false);
        target.addSkill("hualaomrfz_eff");
        trigger2.num = 0;
      },
      subSkill: {
        eff: {
          trigger: { player: "damageBegin2" },
          filter: function(event2, player2) {
            return player2.hasMark("hualaomrfz");
          },
          charlotte: true,
          direct: true,
          async content(event2, trigger2, player2) {
            trigger2.num += player2.countMark("hualaomrfz");
            player2.removeMark("hualaomrfz", player2.countMark("hualaomrfz"), false);
            player2.logSkill("hualaomrfz");
          }
        }
      },
      ai: {
        expose: 0.1,
        threaten: 1.2
      }
    },
    huhuomrfz: {
      intro: {
        content: "摸牌阶段摸牌数-#,出牌阶段结束时摸#张牌"
      },
      audio: 2,
      trigger: { source: "damageZero" },
      async content(event2, trigger2, player2) {
        trigger2.player.addMark("huhuomrfz", 1, false);
        trigger2.player.addSkill("huhuomrfz2");
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("huhuomrfz");
          },
          async content(event2, trigger2, player2) {
            player2.removeMark("huhuomrfz", player2.countMark("huhuomrfz"), false);
            trigger2.player.removeSkill("huhuomrfz2");
          }
        }
      }
    },
    huhuomrfz2: {
      direct: true,
      charlotte: true,
      trigger: { player: "phaseDrawBegin2" },
      async content(event2, trigger2, player2) {
        trigger2.num -= player2.countMark("huhuomrfz");
      },
      group: ["huhuomrfz2_draw", "huhuomrfz_clear"],
      subSkill: {
        draw: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseUseEnd" },
          async content(event2, trigger2, player2) {
            player2.draw(player2.countMark("huhuomrfz"));
          }
        }
      }
    },
    wuyuemrfz: {
      mod: {
        targetInRange: function(card, player2, target, now) {
          if (card.name == "sha" && get.color(card) == "black") return true;
        },
        selectTarget: function(card, player2, range) {
          if (card.name == "sha" && range[1] != -1 && get.color(card) == "red") range[1]++;
        }
      }
    },
    //闪灵
    lichangmrfz: {
      marktext: "屏障",
      markimage: "extension/WhichWay/image/skill/slmrfzimage.png",
      intro: {
        name: "屏障",
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards = player2.getExpansions(skill);
        if (cards.length) player2.loseToDiscardpile(cards);
      },
      audio: 6,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return player2.countCards("h") > 0 && game.hasPlayer(function(current) {
          return !current.hasSkill("lichangmrfz2");
        });
      },
      filterTarget: function(card, player2, target) {
        return !target.hasSkill("lichangmrfz2");
      },
      filterCard: true,
      lose: false,
      discard: false,
      delay: 0,
      check: function(card) {
        var player2 = _status.event.player;
        if (player2.countCards("h", function(card2) {
          return get.type(card2) == "equip";
        }) > 0)
          return get.type(card) == "equip";
        return 6 - get.value(card);
      },
      prompt: `请选择一张牌`,
      position: "he",
      async content(event2, trigger2, player2) {
        const { target, cards } = event2;
        target.addTempSkill("lichangmrfz2");
        target.addToExpansion(cards, target, "giveAuto").gaintag.add("lichangmrfz");
        if (get.type(cards[0]) == "equip" && target.hujia < 5) target.changeHujia();
        if (target.hujia < 5) target.changeHujia();
      },
      group: ["lichangmrfz_rem", "lichangmrfz_dam", "lichangmrfz_da"],
      subSkill: {
        rem: {
          audio: "lichangmrfz",
          chargeSkill: true,
          forced: true,
          trigger: { global: "gainAfter" },
          filter: function(event2, player2) {
            if (event2.getParent(1).name != "lichangmrfz_dam") return false;
            return event2.fromStorage == true || game.hasPlayer2(function(current) {
              var evt = event2.getl(current);
              return evt && evt.xs && evt.xs.length > 0;
            });
          },
          async content(event2, trigger2, player2) {
            player2.addMark("charge");
          }
        },
        dam: {
          audio: "lichangmrfz",
          forced: true,
          trigger: { global: "damageEnd" },
          filter: function(event2, player2) {
            return event2.hujia && event2.player.getExpansions("lichangmrfz").length > 0;
          },
          async content(event2, trigger2, player2) {
            var cards = trigger2.player.getExpansions("lichangmrfz");
            trigger2.player.gain(cards, "gain2");
          }
        },
        da: {
          trigger: { global: "phaseBegin" },
          filter: function(event2, player2) {
            return player2.countMark("charge") >= 3;
          },
          direct: true,
          async content(event2, trigger2, player2) {
            let result2;
            result2 = await player2.chooseTarget(get.prompt("lichangmrfz"), "【力场】:你可以选择三名角色，令其各从牌堆或弃牌堆中获得一张装备牌", [1, 3]).set("ai", (target) => {
              return get.attitude(player2, target) > 0;
            }).forResult();
            if (result2.targets) {
              player2.removeMark("charge", player2.countMark("charge"));
              player2.logSkill("lichangmrfz");
              event2.targets = result2.targets;
              event2.num = 0;
              event2.num2 = result2.targets.length;
            } else {
              return;
            }
            while (event2.num < event2.num2) {
              const card = get.cardPile((c) => {
                return get.type(c) === "equip";
              });
              event2.card = card;
              const list = game.filterPlayer((target) => {
                return target !== player2 && target.hasSkill("lichangmrfz");
              });
              let str = "【力场】:你可以将此牌交给" + get.translation(list);
              if (list.length > 1) str += "其中一人";
              str += ",或取消自己装备此牌";
              const currentTarget = event2.targets[event2.num];
              await currentTarget.gain(card, "gain");
              result2 = await currentTarget.chooseTarget(str, (card2, player3, target) => {
                return target !== currentTarget && target.hasSkill("lichangmrfz");
              }).set("ai", (target) => {
                if (get.attitude(currentTarget, target) <= 0) return 0;
                return get.attitude(currentTarget, target) >= 0;
              }).forResult();
              const hasCard = currentTarget.hasCard((c) => {
                return c === event2.card;
              }, "h");
              if (result2.bool) {
                if (hasCard) {
                  await currentTarget.give(event2.card, player2);
                }
                await currentTarget.recover();
              } else if (hasCard) {
                await currentTarget.chooseUseTarget(event2.card, true);
              }
              event2.num++;
            }
          }
        }
      },
      ai: {
        threaten: 1.2,
        order: function() {
          var player2 = _status.event.player;
          if (player2.hp <= 2) return 13;
          return 1;
        },
        result: {
          player: 1,
          target: 1
        }
      }
    },
    lichangmrfz2: {
      charlotte: true
    },
    jiushumrfz: {
      audio: 2,
      enable: "chooseToUse",
      filter: function(event2, player2) {
        if (player2.countCards("he", function(card) {
          return get.color(card) == "black";
        }) == 0)
          return false;
        return player2.isPhase("phaseJudge", false) || player2.isPhase("phaseZhunbei", false);
      },
      filterCard: function(card) {
        return get.color(card) == "black";
      },
      viewAsFilter: function(player2) {
        if (!player2.isPhase("phaseJudge", false) && !player2.isPhase("phaseZhunbei", false)) return false;
        return player2.countCards("he", { color: "black" }) > 0;
      },
      viewAs: { name: "wuxie" },
      position: "he",
      prompt: "将一张黑色牌当无懈可击使用",
      check: function(card) {
        var tri = _status.event.getTrigger();
        if (tri && tri.card && tri.card.name == "chiling") return -1;
        return 8 - get.value(card);
      }
    },
    yubimrfz: {
      global: "yubimrfz_eff",
      subSkill: {
        eff: {
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num + Math.min(player2.hujia, 5);
            }
          }
        }
      }
    },
    //玛露希尔
    kumomrfz: {
      audio: 2,
      trigger: {
        player: "useCardAfter"
      },
      filter(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        return event2.card && get.type(event2.card) == "trick";
      },
      forced: true,
      async content(event2, trigger2, player2) {
        if (!player2.getStat("card").sha) player2.getStat("card").sha = 0;
        player2.getStat("card").sha++;
      },
      mod: {
        cardEnabled(card, player2) {
          if (get.type(card) == "trick" && player2.getCardUsable("sha") < 1) return false;
        },
        cardUsable: function(card, player2, num) {
          if (card.name != "sha") return;
          if (!_status.kumomrfz_tmp) {
            _status.kumomrfz_tmp = true;
            const count = player2.getCardUsable("sha");
            _status.kumomrfz_tmp = false;
            if (player2.isPhaseUsing() && count >= player2.maxHp) {
              return player2.maxHp;
            }
          }
          return;
        }
      },
      ai: {
        combo: "cainvmrfz",
        threaten: 0.8
      }
    },
    cainvmrfz: {
      audio: 2,
      trigger: {
        player: "useCardToPlayered"
      },
      filter(event2, player2) {
        if (event2.getParent().triggeredTargets3.length > 1) return false;
        return event2.card && get.type(event2.card) == "trick" && player2.getCardUsable("sha") > 0;
      },
      prompt(event2, player2) {
        return `【才女】:是否令${get.translation(event2.card)}额外结算${Math.min(player2.maxHp, player2.getCardUsable("sha"))}次？`;
      },
      async content(event2, trigger2, player2) {
        const num = Math.min(player2.getCardUsable("sha"), player2.maxHp);
        if (trigger2.parent) trigger2.parent.effectCount += num;
      },
      group: "cainvmrfz_trick",
      subSkill: {
        trick: {
          hiddenCard: function(player2, name) {
            if (player2.getStat("skill").cainvmrfz_trick && player2.getStat("skill").cainvmrfz_trick >= player2.maxHp) return false;
            return player2.countCards("hes", "sha") < 1 && !lib.inpile.includes(name) && get.type(name) != "trick";
          },
          audio: "cainvmrfz",
          enable: "chooseToUse",
          filter: function(event2, player2) {
            if (player2.getStat("skill").cainvmrfz_trick && player2.getStat("skill").cainvmrfz_trick >= player2.maxHp) return false;
            return player2.hasCard(
              (card) => lib.inpile.some((name) => {
                if (get.name(card) != "sha") return false;
                if (get.type(name) != "trick") return false;
                if (event2.filterCard({ name, isCard: true, cards: [card] }, player2, event2)) return true;
                return false;
              }, "hes")
            );
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var list = [];
              for (var name of lib.inpile) {
                if (get.type(name) == "trick") {
                  list.push([get.translation(get.type(name)), "", name]);
                }
              }
              return ui.create.dialog("才女", [list, "vcard"]);
            },
            filter: function(button, player2) {
              return _status.event.getParent().filterCard({ name: button.link[2] }, player2, _status.event.getParent());
            },
            check: function(button) {
              var player2 = _status.event.player;
              var card = { name: button.link[2], nature: button.link[3] };
              if (player2.countCards("hes", (cardx) => cardx.name == card.name)) return 0;
              return _status.event.getParent().type == "phase" ? player2.getUseValue(card) : 1;
            },
            backup: function(links, player2) {
              return {
                audio: "cainvmrfz",
                filterCard(card) {
                  return card.name == "sha";
                },
                popname: true,
                check: function(card) {
                  return 7 - get.value(card);
                },
                position: "hes",
                viewAs: { name: links[0][2], nature: links[0][3] }
              };
            },
            prompt: function(links, player2) {
              return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
            }
          },
          ai: {
            order: 13,
            threaten: 1.8,
            result: {
              player: 1
            }
          }
        }
      }
    },
    cangshumrfz: {
      audio: 2,
      trigger: { player: ["phaseUseEnd", "phaseUseBegin"] },
      intro: {
        content(event2, player2) {
          const storage = player2.storage.cangshumrfz;
          if (storage.index == 0) return `下个出牌阶段开始时摸${storage.num}张牌`;
          return `下个出牌阶段阶段使用【杀】的次数+1`;
        }
      },
      filter(event2, player2) {
        return get.is.object(player2.storage.cangshumrfz) || player2.getCardUsable("sha") > 0;
      },
      async cost(event2, trigger2, player2) {
        if (event2.triggername == "phaseUseBegin") {
          if (!event2.result) event2.result = {};
          event2.result.bool = get.is.object(player2.storage.cangshumrfz);
          return;
        } else if (player2.getCardUsable("sha") < 1) {
          if (!event2.result) event2.result = {};
          event2.result.bool = false;
          return;
        }
        event2.result = await player2.chooseControl("选项一", "选项二", "cancel2").set("choiceList", [`摸${Math.min(player2.getCardUsable("sha"), player2.maxHp)}张牌`, `使用【杀】的次数+1`]).set("ai", () => {
          const player3 = get.player();
          const num = player3.getCardUsable("sha");
          return num > 1 ? 0 : 1;
        }).forResult();
        event2.result.cost_data = event2.result.index;
      },
      async content(event2, trigger2, player2) {
        if (event2.triggername == "phaseUseBegin") {
          const result2 = player2.storage.cangshumrfz;
          if (result2["index"] == 0) {
            player2.draw(result2["num"]);
          } else player2.addTempSkill("cangshumrfz_sha", { player: "phaseUseEnd" });
          delete player2.storage.cangshumrfz;
          player2.unmarkSkill("cangshumrfz");
          return;
        }
        const index = event2.cost_data;
        player2.storage.cangshumrfz = {
          index,
          //@ts-ignore
          num: index === 0 ? Math.min(player2.getCardUsable("sha"), player2.maxHp) : 1
        };
        player2.markSkill("cangshumrfz");
      },
      subSkill: {
        sha: {
          charlotte: true,
          mod: {
            cardUsable(card, player2, num) {
              if (card.name == "sha") return num + 1;
            }
          }
        }
      }
    },
    // 新霍尔海雅
    xinkuangyumrfz: {
      audio: "kuangyumrfz",
      trigger: {
        player: "useCard2"
      },
      filter(event2, player2) {
        if (get.type(event2.card) == "delay" || get.type(event2.card) == "equip") return false;
        return game.hasPlayer(function(target) {
          if (event2.targets.includes(target)) return false;
          if (!player2.canUse(event2.card, target)) return false;
          return true;
        });
      },
      async cost(event2, trigger2, player2) {
        if (event2.result) event2.result = {};
        event2.result = await player2.chooseTarget(get.prompt2("xinkuangyumrfz"), [1, Infinity], function(card, player3, target) {
          var cardx = _status.event.cardx;
          if (!player3.canUse(cardx, target)) return false;
          var targets = _status.event.targets.slice(0).concat(ui.selected.targets);
          if (targets.includes(target)) return false;
          return true;
        }).set("promptbar", "none").set("cardx", trigger2.card).set("targets", trigger2.targets).set("ai", function(target) {
          var player3 = _status.event.player;
          return get.effect(target, _status.event.cardx, player3, player3);
        }).forResult();
      },
      async content(event2, trigger2, player2) {
        const targets = event2.targets;
        if (!player2.storage.xinkuangyumrfz_trigger) player2.storage.xinkuangyumrfz_trigger = [];
        player2.storage.xinkuangyumrfz_trigger.add(trigger2.card);
        trigger2.targets.addArray(targets);
        player2.addTempSkill("xinkuangyumrfz_trigger");
      },
      subSkill: {
        trigger: {
          trigger: {
            player: ["shaMiss", "eventNeutralized"]
          },
          charlotte: true,
          silent: true,
          filter(event2, player2) {
            return player2.storage.xinkuangyumrfz_trigger && player2.storage.xinkuangyumrfz_trigger.includes(event2.card);
          },
          content() {
            trigger.getParent().excluded.addArray(trigger.getParent().targets);
          },
          group: "xinkuangyumrfz_remove"
        },
        remove: {
          trigger: {
            player: ["useCardAfter", "useCardCancelled"]
          },
          silent: true,
          charlotte: true,
          filter: function(event2, player2) {
            return player2.storage.xinkuangyumrfz_trigger && player2.storage.xinkuangyumrfz_trigger.includes(event2.card);
          },
          content: function() {
            player.storage.xinkuangyumrfz_trigger.remove(trigger.card);
          }
        }
      }
    },
    xinchuanzhongmrfz: {
      audio: "chuangzhongmrfz",
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter(event2, player2) {
        return player2.storage.xinchuanzhongmrfz_mark && player2.storage.xinchuanzhongmrfz_mark.length > 0;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        let nums = player2.storage.xinchuanzhongmrfz_mark.length;
        const indexs = [];
        while (nums > 0) {
          let list = Array.from({ length: nums + 1 }, (_, index) => index);
          let prompt = `请为%%%选择一个自然数`;
          if (indexs.length == 0) prompt = prompt.replace("%%%", "X(摸牌数)");
          else if (indexs.length == 1) prompt = prompt.replace("%%%", "Y(额外使用杀)");
          else if (indexs.length == 2) prompt = prompt.replace("%%%", "Z(计算与其他角色的距离)");
          const { result: result2 } = await player2.chooseControl(list).set("prompt", prompt).set("ai", () => {
            let player3 = get.player(), nums2 = get.event().nums, indexs2 = get.event().indexs;
            switch (indexs2.length) {
              case 0:
                return player3.countCards("hs", (card) => get.tag(card, "damage") > 0 || get.type(card) == "trick") > 1 ? 0 : nums2;
              case 1:
                return player3.countCards("e", "sha") > 1 ? 1 : 0;
              case 2:
                return game.hasPlayer((current) => get.attitude2(current) < 0) ? 0 : nums2;
              default:
                return nums2;
            }
          }).set("nums", nums).set("indexs", indexs);
          nums -= result2.index;
          indexs.push(result2.index);
        }
        if (indexs[0] && indexs[0] > 0) player2.draw(indexs[0]);
        if (indexs[1] && indexs[1] > 0) player2.addMark("xinchuanzhongmrfz_sha", indexs[1], false);
        if (indexs[2] && indexs[2] > 0) player2.addMark("xinchuanzhongmrfz_distance", indexs[2], false);
        player2.addTempSkill("xinchuanzhongmrfz_sha", { player: "phaseEnd" });
        player2.addTempSkill("xinchuanzhongmrfz_distance", { player: "phaseEnd" });
      },
      group: "xinchuanzhongmrfz_mark",
      subSkill: {
        distance: {
          onremove: true,
          mod: {
            globalFrom(from, to, distance) {
              return distance - from.countMark("xinchuanzhongmrfz_distance");
            }
          }
        },
        sha: {
          onremove: true,
          mod: {
            cardUsable(card, player2, num) {
              if (card.name == "sha") return num + player2.countMark("xinchuanzhongmrfz_sha");
            }
          }
        },
        mark: {
          charlotte: true,
          silent: true,
          trigger: {
            player: "phaseEnd"
          },
          async content(event2, trigger2, player2) {
            player2.storage.xinchuanzhongmrfz_mark = [];
            player2.getHistory("useCard", function(evt) {
              player2.storage.xinchuanzhongmrfz_mark.add(get.type2(evt.card));
            });
          }
        }
      }
    },
    //异格推王 维娜维多利亚
    zhongyuanmrfz: {
      audio: 2,
      trigger: { global: "roundStart" },
      filter(event2, player2) {
        return Object.keys(window.whichWaySave.weinaData.HMS).filter((i) => !player2.hasSkill(i)).length > 0;
      },
      frequent: true,
      async content(event2, trigger2, player2) {
        const data = window.whichWaySave.weinaData;
        let tmp = {
          triggers: Object.keys(data.trigger.get().translation).randomGets(3),
          filter: Object.keys(data.filter).randomGets(3),
          content: Object.keys(data.content.get()).randomGets(3)
        };
        let random = {
          num: data.x[Object.keys(data.x).randomGet()],
          phase: data.getPhase(),
          name: data.getName()
        };
        let info = { ...data.getInfo(data, null, {}, random), ...data.trigger.get().translation };
        let result2 = {};
        for (let i of Object.keys(tmp)) {
          let values = tmp[i];
          const { index } = await player2.chooseControl().set("choiceList", [...values.map((i2) => info[i2])]).forResult();
          let key = values[index];
          result2[i] = {
            trans: info[key],
            effect: data.findKey(i, key),
            key
          };
        }
        let skillname = Object.keys(data.HMS).filter((i) => !player2.hasSkill(i)).randomGet();
        lib.translate[skillname] = data.HMS[skillname];
        lib.translate[skillname + "_info"] = "每回合限一次，" + result2.triggers.trans + ",若" + result2.filter.trans + ",你可以" + result2.content.trans;
        if (!_status.weinaData) _status.weinaData = {};
        _status.weinaData[skillname] = {
          result: result2,
          data,
          random,
          tmp
        };
        lib.skill[skillname] = {
          onremove(player3, skill) {
            delete _status.weinaData[skill];
          },
          usable: 1,
          trigger: { player: Object.keys(result2.triggers.effect[0])[0] },
          weinaName: skillname,
          filter(event3, player3) {
            let name = this.weinaName;
            let filter = _status.weinaData[name].data.findKey(
              _status.weinaData[name].result.filter,
              Object.keys(_status.weinaData[name].tmp)[1]
            )[0].filter;
            return filter(event3, player3, name);
          },
          async content(event3, trigger3, player3) {
            let name = event3.name;
            let contents = _status.weinaData[name].data.findKey(
              _status.weinaData[name].result.content,
              _status.weinaData[name].result.content.key
            )[0][_status.weinaData[name].result.content.key].content;
            var next = game.createEvent("weinaNext");
            next.player = player3;
            next.name = name;
            next.weinaData = {
              num: _status.weinaData[name].random.num.num(event3, player3),
              name: _status.weinaData[name].random.name,
              phase: _status.weinaData[name].random.phase
            };
            next.setContent(contents);
          },
          ai: {
            threaten: 0.8
          }
        };
        player2.addSkill(skillname);
      }
    },
    futumrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "useCard"
      },
      getSkillsTrigger(target) {
        let skills = target.getSkills(null, false, false).filter((skill) => {
          get.info(skill);
          if (get.skillInfoTranslation(skill, target).length == 0) return false;
          return true;
        });
        let triggers = [];
        let suffixes = ["Begin", "End", "After", "Start", "Before"];
        for (let skill of skills) {
          let trigger2 = get.info(skill).trigger;
          for (let key in trigger2) {
            if (!Array.isArray(trigger2[key])) {
              for (let suffix of suffixes) {
                if (trigger2[key].includes(suffix)) triggers.add(trigger2[key].replace(suffix, ""));
              }
            } else
              triggers.addArray(
                trigger2[key].map((i) => {
                  for (let suffix of suffixes) {
                    i = i.replace(suffix, "");
                  }
                })
              );
          }
        }
        return triggers;
      },
      filter: function(event2, player2) {
        return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name)) && game.hasPlayer(function(current) {
          return current != player2 && lib.skill.futumrfz.getSkillsTrigger(current).some((i) => lib.skill.futumrfz.getSkillsTrigger(player2).includes(i));
        });
      },
      async content(event2, trigger2, player2) {
        trigger2.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player2 && lib.skill.futumrfz.getSkillsTrigger(current).some((i) => lib.skill.futumrfz.getSkillsTrigger(player2).includes(i));
          })
        );
      }
    },
    wangximrfz: {
      audio: 2,
      trigger: { global: "damageBegin3" },
      filter(event2, player2) {
        return event2.player === player2 || get.distance(player2, event2.player) < 2;
      },
      async cost(event2, trigger2, player2) {
        let skillList = player2.getSkills(null, false, false).filter((skill) => {
          let info = get.info(skill);
          if (get.skillInfoTranslation(skill, player2).length === 0 || !info || info.charlotte) return false;
          return true;
        });
        event2.result = await player2.chooseControl(skillList, "cancel2").set(
          "prompt",
          `你可以失去一个技能令此伤害对${trigger2.player === player2 ? "你" : get.translation(trigger2.player)}无效并令其摸两张牌`
        ).set("ai", () => {
          let event3 = get.event();
          get.player();
          let target = get.event().target;
          let skillList2 = get.event().skillList;
          if (get.attitude2(target) < 0) return "cancel2";
          if (target.hp - event3.num < 1)
            return skillList2.sort((a, b) => {
              return get.skillthreaten(b) - get.skillthreaten(a);
            })[0];
          return skillList2.filter((skill) => get.skillthreaten(skill) < 1).sort((a, b) => {
            return get.skillthreaten(b) - get.skillthreaten(a);
          })[0] || "cancel2";
        }).set("target", trigger2.player).set("skillList", skillList).forResult();
        event2.result.cost_data = event2.result.control;
      },
      async content(event2, trigger2, player2) {
        let skill = event2.cost_data;
        game.log(player2, "失去了", `#g【${get.translation(skill)}】`);
        player2.removeSkill(skill);
        trigger2.player.draw(2);
        trigger2.cancel();
      },
      ai: {
        threaten: 1.1
      }
    },
    // 荒芜拉普兰德
    shilangmrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseEnd" },
      filter: function(event2, player2) {
        return player2.storage.phaseHistory;
      },
      async content(event2, trigger2, player2) {
        const phaseHistory = player2.storage.phaseHistory;
        if (lib.phaseName.isSubset(Object.keys(phaseHistory))) player2.draw();
        else player2.loseHp();
      }
    },
    toulangmrfz: {
      audio: 2,
      trigger: {
        global: ["damageEnd", "useSkill", "logSkillBegin", "useCard", "respond"]
      },
      init(player2, skill) {
        game.broadcastAll(() => {
          lib.translate["visible_toulangmrfz"] = "明置";
        });
        player2.storage[skill] = {
          damage: false,
          useSkill: false
        };
      },
      onremove: true,
      forced: true,
      filter(event2, player2) {
        if (event2.name == "damage") {
          return !player2.storage.toulangmrfz[event2.name] && event2.player && event2.player.isIn() && event2.player.countCards("h", (card) => !get.is.shownCard(card)) > 0;
        } else {
          if (["global", "equip"].includes(event2.type)) return false;
          let skill = get.sourceSkillFor(event2);
          if (!skill || skill === "toulangmrfz") return false;
          let info = get.info(skill);
          while (true) {
            if (!info || info.charlotte || info.equipSkill) return false;
            if (info && !info.sourceSkill) break;
            skill = info.sourceSkill;
            info = get.info(skill);
          }
          return !player2.storage.toulangmrfz["useSkill"] && event2.player && event2.player.isIn() && event2.player.countCards("h", (card) => !get.is.shownCard(card)) > 0;
        }
      },
      async content(event2, trigger2, player2) {
        let target = trigger2.player;
        player2.storage.toulangmrfz[trigger2.name === "damage" ? trigger2.name : "useSkill"] = true;
        const { cards } = await target.chooseCard(true, "h", (card) => !get.is.shownCard(card), [1, 2]).set("prompt", `【头狼】:请明置1-2张手牌`).set("ai", (card) => {
          return -get.value(card);
        }).forResult();
        if (!cards) return;
        target.addShownCards(cards, "visible_toulangmrfz");
      },
      group: "toulangmrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          lastDo: true,
          trigger: { global: "roundStart" },
          content() {
            player.storage["toulangmrfz"] = {
              damage: false,
              useSkill: false
            };
          }
        }
      }
    },
    /** @type { Skill } */
    kuanglangmrfz: {
      audio: 2,
      enable: "chooseToUse",
      hiddenCard(player2, name) {
        return get.inpileVCardList((info) => {
          const name2 = info[2];
          return get.type(name2) === "basic" || get.type(name2) === "trick" && get.isSingle(name2);
        }).map((i) => i[2]).includes(name) && game.hasPlayer((current) => {
          return current.countCards("ej") > 0 || current.countCards("h", (card) => get.is.shownCard(card)) > 0;
        });
      },
      onChooseToUse(event2) {
        let player2 = get.player();
        event2.kuanglangmrfz_list = get.inpileVCardList((info) => {
          const name = info[2];
          return get.type(name) === "basic" || get.type(name) === "trick" && get.isSingle(name);
        }).filter((card) => event2.filterCard({ name: card[2], nature: card[3] }, player2, event2));
      },
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current.countCards("ej") > 0 || current.countCards("h", (card) => get.is.shownCard(card)) > 0;
        }) && event2.kuanglangmrfz_list.length > 0;
      },
      filterTarget(card, player2, target) {
        return target.countCards("ej") > 0 || target.countCards("h", (card2) => get.is.shownCard(card2)) > 0;
      },
      prompt(event2, player2) {
        return `你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊`;
      },
      async content(event2, trigger2, player2) {
        const target = event2.targets[0];
        if (!target.countGainableCards(
          player2,
          "hej",
          (card) => get.is.shownCard(card) || get.position(card) === "e" || get.position(card) === "j"
        ))
          return;
        const { links: links2 } = await player2.choosePlayerCard("hej", target, true).set("filterButton", (button) => {
          return get.position(button.link) === "e" || get.position(button.link) === "j" || get.is.shownCard(button.link);
        }).set("target", target).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button).forResult();
        const list = event2.getParent(2)?.kuanglangmrfz_list;
        const { links } = await player2.chooseButton(["狂狼", [list, "vcard"]], true).set("ai", (button) => {
          return get.event().player.getUseValue({
            name: button.link[2],
            nature: button.link[3]
          });
        }).forResult();
        const evt = event2.getParent(2);
        if (!links || !evt) return;
        let name = links[0][2], nature = links[0][3];
        game.broadcastAll(
          function(result2, name2, nature2) {
            lib.skill.kuanglangmrfz_backup.viewAs = {
              name: name2,
              nature: nature2,
              cards: result2
            };
            lib.skill.kuanglangmrfz_backup.prompt = "选择" + get.translation(name2) + "（" + get.translation(result2) + "）的目标";
          },
          links2,
          name,
          nature
        );
        evt.set("_backupevent", "kuanglangmrfz_backup");
        evt.backup("kuanglangmrfz_backup");
        evt.set("openskilldialog", "选择" + get.translation(name) + "（" + get.translation(links2) + "）的目标");
        evt.set("norestore", true);
        evt.set("custom", {
          add: {},
          replace: { window() {
          } }
        });
        evt.goto(0);
      },
      ai: {
        threaten: 2,
        order: 6,
        result: {
          player(player2, target) {
            let val = 1, att = get.attitude(player2, target);
            if (player2.countCards("j") > 0 && target === player2) return 114514;
            if (att > 0 && target.countCards("j") > 0) val += 5;
            if (att <= 0 && target.countCards("j") > 0 && target.countCards("e") < 1 && target.countCards("h", (card) => get.is.shownCard(card)) < 1)
              val -= 5;
            if (att > 0) val -= 0.5;
            if (att <= 0) val += 1;
            if (target === player2) val -= 0.9;
            return val;
          }
        }
      }
    },
    kuanglangmrfz_backup: {
      sourceSkill: "kuanglangmrfz",
      async precontent(event2, trigger2, player2) {
        delete event2.result.skill;
        var cards = event2.result.card.cards;
        event2.result.cards = cards;
        var owner = get.owner(cards[0]);
        event2.target = owner;
        owner.$give(cards[0], player2, false);
        player2.popup(event2.result.card.name, "metal");
        game.delayx();
      },
      filterCard() {
        return false;
      },
      prompt: "114514",
      selectCard: -1
    },
    // 忍冬
    yinhumrfz: {
      mod: {
        ignoredHandcard: function(card, player2) {
          if (card.hasGaintag("yinhumrfz") && get.name(card) === "sha") {
            return true;
          }
        },
        cardDiscardable: function(card, player2, name) {
          if (name == "phaseDiscard" && card.hasGaintag("yinhumrfz") && get.name(card) === "sha") return false;
        }
      },
      audio: 2,
      direct: true,
      forced: true,
      intro: {
        content: "连续#个回合没有造成伤害"
      },
      trigger: {
        player: ["phaseZhunbeiBegin", "phaseEnd"]
      },
      filter(event2, player2) {
        return event2.name === "phase" ? true : player2.countMark("yinhumrfz") + 1 > 0;
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name === "phase") {
          if (player2.getHistory("sourceDamage").length < 1) player2.addMark("yinhumrfz", 1, false);
          else player2.removeMark("yinhumrfz", player2.countMark("yinhumrfz"), false);
        } else {
          player2.logSkill("yinhumrfz");
          let num = player2.countMark("yinhumrfz") + 1;
          switch (num) {
            case 3:
              player2.addTempSkill("yinhumrfz_addcount", { player: "phaseZhunbeiBegin" });
            case 2:
              player2.addTempSkill("reweimu", { player: "phaseZhunbeiBegin" });
            case 1:
              const result2 = await player2.draw(num).forResult();
              if (result2.cards) {
                for (let card of result2.cards) {
                  if (get.name(card) === "sha") card.addGaintag("yinhumrfz");
                }
              }
              break;
          }
        }
      },
      subSkill: {
        addcount: {
          charlotte: true
        }
      }
    },
    zhuixiongmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 2,
      filter(event2, player2) {
        let count = Object.keys(player2.getStat("skill")).includes("zhuixiongmrfz") ? player2.getStat("skill").zhuixiongmrfz : 0;
        if (count > 0 && !player2.hasSkill("yinhumrfz_addcount")) return false;
        return game.hasPlayer((current) => !!player2.canUse("juedou", current) && player2.inRange(current));
      },
      filterTarget(card, target, player2) {
        return target != player2 && !!player2.canUse("juedou", target) && player2.inRange(target);
      },
      async content(event2, trigger2, player2) {
        player2.useCard({ name: "juedou", zhuixiongmrfz: true }, true, event2.targets[0]);
      },
      group: ["zhuixiongmrfz_nowuxie", "zhuixiongmrfz_damage"],
      subSkill: {
        nowuxie: {
          audio: false,
          trigger: {
            player: "useCard"
          },
          silent: true,
          charlotte: true,
          filter: function(event2) {
            return event2.card && event2.card.zhuixiongmrfz;
          },
          async content(event2, trigger2, player2) {
            trigger2.nowuxie = true;
          }
        },
        damage: {
          audio: false,
          silent: true,
          charlotte: true,
          trigger: { global: "damageBegin3" },
          filter(event2, player2) {
            let evt = event2.getParent();
            return event2.card && event2.card.zhuixiongmrfz && evt && [...evt.targetCards, ...evt.playerCards].length > 0;
          },
          async content(event2, trigger2, player2) {
            let evt = trigger2.getParent();
            if (!evt) return;
            let num = [...evt.targetCards, ...evt.playerCards].length;
            trigger2.num += num;
          }
        }
      },
      ai: {
        order: 6,
        result: {
          target(player2, target) {
            if (get.attitude2(target) > 0) return 0;
            return target.countCards("h", "sha") > player2.countCards("h", "sha") ? 0 : -1;
          }
        }
      }
    },
    // 弑君者
    fengyanmrfz: {
      onremove(player2) {
        for (let i of game.players) {
          i.removeSkill("xingxingmrfz");
        }
        game.broadcastAll(function() {
        });
      },
      audio: 2,
      derivation: ["xingxingmrfz"],
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        return player2.countCards("he", (card) => get.type(card) != "basic") > 0;
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseCardTarget({
          prompt: "是否发动【烽烟】？",
          prompt2: "你可以弃置一张非基本牌并选择至多三名角色，令其获得【行刑】",
          filterCard(card) {
            return get.type(card) != "basic";
          },
          filterTarget: true,
          selectTarget: [1, 3],
          position: "he",
          ai1(card) {
            return 8 - get.value(card);
          },
          ai2(target) {
            let player3 = get.player();
            return get.attitude(player3, target) > 0;
          }
        }).forResult();
        event2.result.cost_data = {
          cards: event2.result.cards,
          targets: event2.result.targets
        };
      },
      async content(event2, trigger2, player2) {
        const { cards, targets } = event2.cost_data;
        await player2.discard(cards);
        for (let target of targets) {
          target.addSkill("xingxingmrfz");
        }
        player2.addTempSkill("fengyanmrfz_expire", { player: "phaseUseBegin" });
        game.broadcastAll(function() {
          ui.background.setBackgroundImage("extension/WhichWay/image/skill/fengyanmrfz.jpg");
        });
      },
      subSkill: {
        expire: {
          charlotte: true,
          onremove(player2) {
            for (let i of game.players) {
              i.removeSkill("xingxingmrfz");
            }
            game.broadcastAll(function() {
            });
          }
        }
      }
    },
    xingxingmrfz: {
      global: "xingxingmrfz_effect",
      audio: 2,
      direct: true,
      trigger: { global: "phaseEnd" },
      filter(event2, player2) {
        return event2.player && event2.player.isIn() && !event2.player.hasSkill("xingxingmrfz");
      },
      async content(event2, trigger2, player2) {
        player2.chooseToUse(
          function(card, player3, event3) {
            if (get.name(card) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【行刑】:是否对" + get.translation(trigger2.player) + "使用一张杀？"
        ).set("logSkill", "xingxingmrfz").set("complexSelect", true).set("filterTarget", function(card, player3, target) {
          if (target != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger2.player);
      },
      subSkill: {
        effect: {
          audio: false,
          forced: true,
          trigger: { player: "damageBegin3" },
          filter(event2, player2) {
            return !event2.source || !event2.source.hasSkill("xingxingmrfz");
          },
          async content(event2, trigger2, player2) {
            player2.logSkill("xingxingmrfz");
            const { color } = await player2.judge(function(card) {
              var color2 = get.color(card);
              if (color2 == "black") return -4;
              return 0;
            }).forResult();
            if (color !== "black") trigger2.cancel();
          }
        }
      }
    },
    weimingmrfz: {
      mod: {
        targetEnabled(card, player2, target) {
          if (!player2.getEquip(1) && get.tag(card, "damage") && get.type(card) === "trick") return false;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCard" },
      filter(event2, player2) {
        return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name)) && game.hasPlayer(function(current) {
          return current != player2 && !current.getEquip(2);
        });
      },
      content() {
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player && !current.getEquip(2);
          })
        );
      },
      group: ["weimingmrfz_get"],
      subSkill: {
        get: {
          audio: "weimingmrfz",
          forced: true,
          trigger: { source: "damageEnd" },
          filter(event2, player2) {
            return event2.player && event2.player.isIn() && event2.player.countCards("he") > 0 && !event2.player.getEquip(3) && !event2.player.getEquip(4);
          },
          async content(event2, trigger2, player2) {
            const { cards } = await trigger2.player.chooseCard("he", true).set("prompt", `请交给${get.translation(player2)}一张牌`).set("ai", (card) => -get.value(card)).forResult();
            if (!cards) return;
            player2.gain(cards);
          }
        }
      }
    },
    // 新风笛
    newjuntongmrfz: {
      audio: "juntongmrfz",
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      trigger: {
        player: ["phaseDrawBegin", "useCard"],
        global: "roundStart"
      },
      filter(event2, player2) {
        if (event2.name === "useCard") {
          const cards = player2.storage.newjuntongmrfz;
          return !cards.includes(get.name(event2.card)) && (get.type(event2.card) === "basic" || get.isSingle(event2.card) && get.type(event2.card) === "trick");
        } else return true;
      },
      forced: true,
      async content(event2, trigger2, player2) {
        if (trigger2.name === "useCard") {
          player2.storage.newjuntongmrfz.push(get.name(trigger2.card));
        } else if (trigger2.name === "phaseDraw") trigger2.cancel();
        else player2.draw(3);
      },
      mod: {
        targetInRange: function(card, player2, target, now) {
          if (!player2.storage.newjuntongmrfz.includes(get.name(card)) && (get.type(card) === "basic" || get.isSingle(card) && get.type(card) === "trick"))
            return true;
        },
        selectTarget: function(card, player2, range) {
          if (!player2.storage.newjuntongmrfz.includes(get.name(card)) && range[1] != -1 && (get.type(card) === "basic" || get.isSingle(card) && get.type(card) === "trick"))
            range[1]++;
        }
      }
    },
    newpochengmrfz: {
      audio: "pochengmrfz",
      trigger: {
        player: "useCard2",
        source: "dieAfter"
      },
      filter(event2, player2) {
        if (event2.name === "useCard") return get.name(event2.card) === "sha";
        else return true;
      },
      async cost(event2, trigger2, player2) {
        event2.result = {};
        if (trigger2.name === "useCard") {
          let list = ["额外目标", "额外结算", "cancel2"];
          if (!game.hasPlayer((current) => {
            return !!player2.canUse(trigger2.card, current) && !trigger2.targets.includes(current);
          }))
            list.remove("额外目标");
          let prompt = "【破城】:你可以令此杀额外结算一次或额外指定一个目标";
          if (!list.includes("额外目标")) ;
          const { control } = await player2.chooseControl(list).set("prompt", prompt).set("ai", () => {
            let list2 = get.event().list, card = get.event().card, targets = get.event().targets, player3 = get.player();
            if (!list2.includes("额外目标") || !game.hasPlayer((current) => get.attitude2(current) < 0 && !targets.includes(current) && !!player3.canUse(card, current)))
              return "额外结算";
            if (targets.some((i) => i.hp < 2)) return "额外结算";
            return Math.random() > 0.5 ? "额外结算" : "额外目标";
          }).set("list", list).set("targets", trigger2.targets).set("card", trigger2.card).forResult();
          if (control === "cancel2") return event2.result.bool = false;
          else if (control === "额外结算")
            event2.result = {
              bool: true,
              //@ts-ignore
              cost_data: control
            };
          else {
            const { targets } = await player2.chooseTarget(true).set("prompt", `请额外选择一个目标`).set("filterTarget", (card, player3, target) => {
              let targets2 = get.event().targets, cardx = get.event().cardx;
              return player3 != target && player3.canUse(cardx, target) && !targets2.includes(target);
            }).set("ai", (target) => get.attitude2(target) < 0).set("targets", trigger2.targets).set("cardx", trigger2.card).forResult();
            event2.result = {
              bool: true,
              cost_data: targets
            };
          }
        } else {
          const { control } = await player2.chooseControl("cancel2").set("prompt", `请选择一个选项`).set("choiceList", ["发动一次【军统①】", "重置【军统②】"]).set("ai", () => {
            let player3 = get.player();
            return player3.storage.newjuntongmrfz.length > 4 ? "选项二" : "选项一";
          }).forResult();
          event2.result = {
            bool: true,
            //@ts-ignore
            cost_data: control
          };
        }
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name === "useCard") {
          console.log(event2.cost_data);
          if (event2.cost_data === "额外结算") trigger2.effectCount++;
          else trigger2.targets.push(event2.cost_data[0]);
        } else {
          let control = event2.cost_data;
          if (control === "选项一") {
            let next = game.createEvent("roundStart", false, { next: [] });
            await game.createTrigger("roundStart", "newjuntongmrfz", player2, next);
          } else player2.storage.newjuntongmrfz = [];
        }
      }
    },
    // 引星棘刺
    xinxiangmrfz: {
      mod: {
        maxHandcard: function(player2, num) {
          return lib.skill.xinxiangmrfz.getLim(player2);
        }
      },
      audio: 2,
      mark: true,
      init(player2, skill) {
        player2.addMark(skill, 5, false);
      },
      onremove(player2, skill) {
        delete player2.storage.xinxiangmrfz;
        delete player2.storage.xinxiangmrfz_tmp;
      },
      getLim(player2) {
        return player2.countMark("xinxiangmrfz") + player2.countMark("xinxiangmrfz_tmp");
      },
      intro: {
        content(event2, player2) {
          return `当前手牌区上限:${lib.skill.xinxiangmrfz.getLim(player2)}<br>临时上限:${player2.countMark("xinxiangmrfz_tmp")}`;
        }
      },
      trigger: {
        global: "phaseEnd"
      },
      forced: true,
      filter(event2, player2) {
        return player2.countCards("h") < lib.skill.xinxiangmrfz.getLim(player2);
      },
      async content(event2, trigger2, player2) {
        player2.drawTo(lib.skill.xinxiangmrfz.getLim(player2));
      },
      group: ["xinxiangmrfz_lim", "xinxiangmrfz_start"],
      subSkill: {
        tmp: {
          onremove(player2, skill) {
            delete player2.storage.xinxiangmrfz_tmp;
            if (player2.countCards("h") > player2.countMark("xinxiangmrfz")) {
              player2.chooseToDiscard(true, "【心相】：请弃置超出上限的手牌").set("selectCard", () => {
                let player3 = get.player();
                return player3.countCards("h") - player3.countMark("xinxiangmrfz");
              });
            }
          },
          charlotte: true
        },
        start: {
          audio: false,
          charlotte: true,
          silent: true,
          trigger: {
            global: "gameDrawBegin"
          },
          filter(event2, player2) {
            return lib.skill.xinxiangmrfz.getLim(player2) < event2.num;
          },
          async content(event2, trigger2, player2) {
            var me = player2;
            var numx = trigger2.num;
            trigger2.num = typeof numx == "function" ? function(player3) {
              if (player3 == me) {
                return lib.skill.xinxiangmrfz.getLim(player3);
              }
              return numx(player3);
            } : function(player3) {
              if (player3 == me) {
                return lib.skill.xinxiangmrfz.getLim(player3);
              }
              return numx;
            };
          }
        },
        lim: {
          audio: false,
          charlotte: true,
          silent: true,
          trigger: {
            player: ["drawBegin", "gainBegin"]
          },
          filter(event2, player2) {
            const cards = event2.name === "draw" ? event2.result : event2.cards;
            const nums = lib.skill.xinxiangmrfz.getLim(player2);
            return player2.countCards("h") + cards.length > nums;
          },
          async content(event2, trigger2, player2) {
            const cards = trigger2.name === "draw" ? trigger2.result : trigger2.cards;
            const nums = lib.skill.xinxiangmrfz.getLim(player2);
            if (player2.countCards("h") >= nums) {
              trigger2.cancel();
            } else {
              const { links: gaincards } = await player2.chooseButton(["心相:请选择你要获得的牌", cards], true).set("ai", (button) => get.value(button.link)).set("selectButton", () => {
                let player3 = get.player();
                return lib.skill.xinxiangmrfz.getLim(player3) - player3.countCards("h");
              }).forResult();
              trigger2.cancel();
              if (!gaincards) return;
              player2.gain(gaincards, event2.name === "draw" ? "draw2" : "gain2");
            }
          }
        }
      },
      ai: {
        nogain: true,
        skillTagFilter: function(player2) {
          console.log(arguments);
          return player2.countCards("h") >= lib.skill.xinxiangmrfz.getLim(player2);
        }
      }
    },
    haijiangmrfz: {
      audio: 2,
      trigger: {
        player: "phaseJieshuBegin"
      },
      filter(event2, player2) {
        return player2.countCards("h") > 0 && game.hasPlayer((current) => player2.canCompare(current) && current != player2 && player2.inRange(current));
      },
      check(event2, player2) {
        return game.hasPlayer((current) => {
          return get.attitude2(current) < 0 && player2.canCompare(current) && current != player2 && player2.inRange(current);
        });
      },
      async content(event2, trigger2, player2) {
        const { targets } = await player2.chooseTarget(true, [1, Infinity]).set("filterTarget", (card, player3, target) => {
          return player3.canCompare(target) && player3 != target && player3.inRange(target);
        }).set("ai", (target) => get.attitude2(target) < 0).forResult();
        if (targets && targets.length) {
          player2.chooseToCompare(targets).callback = function() {
            if (event2.winner != player2) {
              player2.chooseToDiscard(true);
            } else {
              event2.target.damage();
              player2.addMark("xinxiangmrfz_tmp", 1, false);
              player2.addTempSkill("xinxiangmrfz_tmp", { player: "phaseJieshuBegin" });
            }
          };
        }
      }
    },
    fanyangmrfz: {
      audio: 2,
      intro: {
        content: "你计算与其他角色的距离-#<br>其他角色计算与你的距离+#"
      },
      trigger: { player: "damageEnd" },
      filter(event2, player2) {
        return player2.countCards("he") > 0 && event2.num > 0;
      },
      getIndex(event2, player2, triggername) {
        return event2.num;
      },
      async cost(event2, trigger2, player2) {
        const { bool } = await player2.chooseToDiscard("he").set("prompt", get.prompt("fanyangmrfz")).set("prompt2", `你可以弃置一张手牌，然后直到你的回合结束时，[你/其他角色]计算与[其他角色/你]的距离[-1/+1]`).set("ai", (card) => get.value(card) < 8).forResult();
        event2.result = {
          bool
        };
      },
      async content(event2, trigger2, player2) {
        player2.addMark("fanyangmrfz", 1, false);
        player2.addTempSkill("fanyangmrfz_eff", { player: "phaseEnd" });
      },
      subSkill: {
        eff: {
          charlotte: true,
          onremove(player2) {
            delete player2.storage.fanyangmrfz;
            player2.unmarkSkill("fanyangmrfz");
          },
          mod: {
            globalFrom(from, to, distance) {
              return distance - from.countMark("fanyangmrfz");
            },
            globalTo(from, to, distance) {
              return distance + to.countMark("fanyangmrfz");
            }
          }
        }
      }
    },
    // 余
    zhonglemrfz: {
      init(player2) {
        game.broadcastAll(() => {
          lib.translate["zhonglemrfz_tag"] = "判定区";
          lib.card.wugu.content = async function(event2, trigger2, player3) {
            let result2;
            const target = event2.target;
            const card = event2.card;
            for (let i = 0; i < ui.dialogs.length; i++) {
              if (ui.dialogs[i].videoId === event2.preResult) {
                event2.dialog = ui.dialogs[i];
                break;
              }
            }
            if (!event2.dialog || event2.dialog.buttons.length === 0) {
              return;
            }
            if (event2.dialog.buttons.length > 1) {
              let num = 1;
              if (card.storage && typeof card.storage.extraChooseNum === "number") {
                num += card.storage.extraChooseNum;
              }
              const next = target.chooseButton(true);
              next.set("ai", (button2) => {
                const aiPlayer = _status.event.player;
                const btnCard = button2.link;
                let val = get.value(btnCard, aiPlayer);
                if (get.tag(btnCard, "recover")) {
                  val += game.countPlayer((t) => {
                    return t.hp < 2 && get.attitude(aiPlayer, t) > 0 && lib.filter.cardSavable(btnCard, aiPlayer, t);
                  });
                  if (aiPlayer.hp <= 2 && game.checkMod(btnCard, aiPlayer, "unchanged", "cardEnabled2", aiPlayer)) val *= 2;
                }
                return val;
              });
              next.set("selectButton", num);
              next.set("dialog", event2.preResult);
              next.set("closeDialog", false);
              next.set("dialogdisplay", true);
              result2 = await next.forResult();
            } else {
              event2.directButton = event2.dialog.buttons;
            }
            const dialog = event2.dialog;
            let cards = [];
            if (event2.directButton) {
              cards = event2.directButton.map((i) => i.link);
            } else {
              for (const i of dialog.buttons) {
                if (result2.links.includes(i.link)) {
                  cards.push(i.link);
                }
              }
              if (!cards.length) cards = event2.dialog.buttons.map((i) => i.link);
            }
            let button;
            const buttons = [];
            for (let i = 0; i < dialog.buttons.length; i++) {
              if (cards.includes(dialog.buttons[i].link)) {
                button = dialog.buttons[i];
                button.querySelector(".info").innerHTML = ((t) => {
                  if (t._tempTranslate) return t._tempTranslate;
                  const name = t.name;
                  if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
                  return get.translation(name);
                })(target);
                buttons.push(button);
              }
            }
            dialog.buttons.remove(...buttons);
            const capt = get.translation(target) + "选择了" + get.translation(buttons.map((i) => i.link));
            if (cards && cards.length > 0) {
              await target.gain(cards, "visible");
              target.$gain2(cards);
              game.broadcast(
                function(cards2, id, name, capt2) {
                  var dialog2 = get.idDialog(id);
                  if (dialog2) {
                    dialog2.content.firstChild.innerHTML = capt2;
                    for (var i = 0; i < dialog2.buttons.length; i++) {
                      if (cards2.includes(dialog2.buttons[i].link)) {
                        dialog2.buttons[i].querySelector(".info").innerHTML = name;
                        dialog2.buttons.splice(i--, 1);
                      }
                    }
                  }
                },
                cards,
                dialog.videoId,
                ((t) => {
                  if (t._tempTranslate) return t._tempTranslate;
                  const name = t.name;
                  if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
                  return get.translation(name);
                })(target),
                capt
              );
            }
            dialog.content.firstChild.innerHTML = capt;
            game.addVideo("dialogCapt", null, [dialog.videoId, dialog.content.firstChild.innerHTML]);
            game.log(
              target,
              "选择了",
              buttons.map((i) => i.link)
            );
            await game.delay();
          };
        });
      },
      audio: 2,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter(event2, player2) {
        return player2.countCards("j") > 0 && player2.hasUseTarget({ name: "wugu" });
      },
      async cost(event2, trigger2, player2) {
        if (player2.isUnderControl(true) && !_status.auto) {
          var cards = player2.getCards("j");
          var cardsx = cards.map((card) => {
            var cardx = ui.create.card();
            cardx.init(get.cardInfo(card));
            cardx._cardid = card.cardid;
            return cardx;
          });
          await player2.directgains(cardsx, null, "zhonglemrfz_tag");
          const { result: result2 } = await player2.chooseCardTarget({
            prompt: "是否要发动【众乐】？",
            prompt2: "你可以将你判定区内任意牌当作至多指定相同目标数的【五谷丰登】使用",
            filterCard(card) {
              return card.hasGaintag("zhonglemrfz_tag");
            },
            selectCard: [1, Infinity],
            selectTarget: [1, Infinity],
            filterTarget(card, player3, target) {
              return player3.canUse("wugu", target);
            },
            filterOk() {
              return ui.selected.targets.length === ui.selected.cards.length;
            },
            position: "s"
          });
          var cards2 = player2.getCards("s", (card) => card.hasGaintag("zhonglemrfz_tag"));
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
          event2.result = result2;
        } else {
          let cards3 = player2.getCards("j");
          let targets = game.filterPlayer((target) => get.attitude(player2, target) > 0);
          cards3.sort((a, b) => {
            return player2.getUseValue(a) - player2.getUseValue(b);
          });
          if (targets.length > cards3.length) {
            targets = targets.splice(0, cards3.length);
          }
          let result2 = {
            targets,
            cards: cards3.slice(0, targets.length),
            bool: true
          };
          event2.result = result2;
        }
      },
      async content(event2, trigger2, player2) {
        let { targets, cards } = event2;
        if (player2.isUnderControl(true) && !_status.auto)
          cards = cards.map((card) => {
            let j = player2.getCards("j");
            return j.find((i) => i.cardid === card._cardid);
          });
        console.log(cards);
        await player2.useCard(
          {
            name: "wugu",
            storage: {
              extraCardsNum: targets.length,
              extraChooseNum: 1
            }
          },
          targets,
          cards,
          false
        );
      }
    },
    qizaomrfz: {
      audio: 2,
      trigger: {
        player: "useCardAfter"
      },
      filter(event2, player2) {
        return !player2.getCards("j").map((i) => get.suit(i)).includes(get.suit(event2.card));
      },
      async content(event2, trigger2, player2) {
        await player2.draw();
        const { cards } = await player2.chooseCard(true, "【起灶】:请蓄谋一次").set("ai", (card) => {
          const player3 = get.player();
          if (player3.hasValueTarget(card)) return player3.getUseValue(card);
          return 0;
        }).set("tipText", true).forResult();
        player2.addJudge({ name: "xumou_jsrg" }, cards);
      }
    },
    // 烛煌 顾烛煌
    chongrangmrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "phaseBegin",
        source: "damageEnd"
      },
      filter(event2, player2) {
        if (event2.name == "damage") {
          if (event2.parent && (event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2")) return false;
          return event2.hasNature("fire");
        }
        return player2.hujia > 0;
      },
      async content(event2, trigger2, player2) {
        if (trigger2.name == "damage") {
          player2.changeHujia(1);
        } else {
          await player2.recover(Math.min(player2.hujia, 2));
          player2.changeHujia(-player2.hujia);
        }
      }
    },
    zhuoyanmrfz: {
      init(player2) {
        lib.skill["_lianhuan4"].content = function() {
          if (!trigger.getParent().noCharReset) player2.link();
          if (trigger.getParent().notLink()) trigger.getParent().lianhuanable = true;
        };
      },
      audio: 2,
      trigger: {
        player: "useCardToPlayer"
      },
      forced: true,
      filter(event2, player2) {
        if (!event2.isFirstTarget) return false;
        return event2.card && get.tag(event2.card, "fireDamage") && event2.targets.some((target) => target.isIn() && !target.isLinked());
      },
      async content(event2, trigger2, player2) {
        trigger2.targets.forEach((target) => {
          if (target.isIn() && !target.isLinked()) target.link();
        });
      },
      group: ["zhuoyanmrfz_nolink"],
      subSkill: {
        nolink: {
          audio: false,
          forced: true,
          silent: true,
          trigger: {
            source: "damageBegin"
          },
          lastDo: true,
          filter: function(event2, player2) {
            return event2.card && event2.player.isIn();
          },
          async content(event2, trigger2, player2) {
            trigger2.noCharReset = true;
          }
        }
      }
    },
    liaoyuanmrfz: {
      mod: {
        selectTarget(card, player2, range) {
          if (card.storage && card.storage.liaoyuanmrfz && range[1] != -1) range[1] += Math.max(1, player2.getDamagedHp());
        }
      },
      init(player2, skill) {
        player2.storage[skill] = {};
      },
      onremove: true,
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      prompt(event2) {
        let player2 = get.player();
        return `流失一点体力并视为使用目标数+${Math.max(1, player2.getDamagedHp())}的【火攻】`;
      },
      viewAs: {
        name: "huogong",
        //@ts-ignore
        storage: {
          liaoyuanmrfz: true
        }
      },
      selectCard: -1,
      filterCard: () => false,
      async precontent(event2, trigger2, player2) {
        player2.loseHp();
      },
      group: ["liaoyuanmrfz_after", "liaoyuanmrfz_recorder", "liaoyuanmrfz_fire"],
      subSkill: {
        recorder: {
          charlotte: true,
          silent: true,
          trigger: {
            global: "showCardsEnd",
            player: "useCardAfter"
          },
          filter(event2, player2) {
            if (event2.name === "useCard") return event2.card && event2.card.storage.liaoyuanmrfz;
            let evt = event2.getParent();
            return event2.cards && evt && evt.name === "huogong" && evt.card && evt.card.storage && evt.card.storage.liaoyuanmrfz;
          },
          async content(event2, trigger2, player2) {
            if (trigger2.name === "useCard") {
              delete player2.storage.liaoyuanmrfz[trigger2.card.storage.randomId];
            } else {
              let cards = trigger2.cards;
              let evt = trigger2.getParent();
              let id = evt.card.cardid;
              if (!Array.isArray(player2.storage.liaoyuanmrfz[id])) player2.storage.liaoyuanmrfz[id] = [];
              player2.storage.liaoyuanmrfz[id].push(...cards);
            }
          }
        },
        fire: {
          audio: false,
          charlotte: true,
          silent: true,
          trigger: { global: "damageBegin" },
          firstDo: true,
          filter(event2, player2) {
            return event2.card && event2.card.name === "wanjian" && event2.card.nature === "fire";
          },
          async content(event2, trigger2, player2) {
            trigger2.nature = "fire";
          }
        },
        after: {
          charlotte: true,
          audio: false,
          forced: true,
          trigger: { player: "useCardAfter" },
          firstDo: true,
          filter(event2, player2) {
            if (!event2.card || !event2.card.storage || !event2.card.storage.liaoyuanmrfz) return false;
            let damaged = player2.getHistory("sourceDamage", (evt) => evt.card.storage && evt.card.id === event2.card.id);
            let showCards = (player2.storage.liaoyuanmrfz[event2.card.id] || []).filter((card) => get.position(card) === "h");
            return damaged.length > 0 && showCards.length > 0;
          },
          async content(event2, trigger2, player2) {
            let showCards = player2.storage.liaoyuanmrfz[trigger2.card.id].filter((card) => get.position(card) === "h");
            await player2.gain(showCards, "gain2");
            if (player2.isUnderControl(true) && !_status.auto) {
              const {
                result: { targets, cards }
              } = await player2.chooseCardTarget({
                showCards,
                prompt: "【燎原】:你可以将其中任意张牌当作指定等量目标的【火·万箭齐发】使用",
                prompt2: "请选择目标和牌",
                filterCard(card) {
                  return get.event().showCards.includes(card);
                },
                selectCard: [1, Infinity],
                filterTarget(card, player3, target) {
                  return player3.canUse("wanjian", target);
                },
                selectTarget: [1, Infinity],
                filterOk() {
                  return ui.selected.targets.length === ui.selected.cards.length;
                }
              });
              if (!(targets && cards)) return;
              player2.useCard(
                {
                  name: "wanjian",
                  nature: "fire"
                },
                targets,
                cards,
                true
              );
            } else {
              let cards = showCards, targets = game.filterPlayer((i) => get.attitude(player2, i) < 0);
              cards.forEach((card) => {
                if (get.value(card) >= 8) cards.remove(card);
              });
              if (targets.length > cards.length) {
                targets = targets.slice(0, cards.length);
              }
              if (!(targets && cards)) return;
              player2.useCard(
                {
                  name: "wanjian",
                  nature: "fire"
                },
                targets,
                cards.slice(0, targets.length),
                true
              );
            }
          }
        }
      },
      ai: {
        order: 9.5,
        result: {
          player(player2, target) {
            if (player2.hp < 3 || player2.countCards("h") < 1) return -1;
            if (player2.getUseValue({ name: "huogong" }) <= 0) return -1;
            return 1 + player2.countCards("h") * 0.1;
          }
        }
      }
    },
    // 新温蒂
    newdanpaomrfz: {
      audio: "danpaomrfz",
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return player2.countCards("he") > 0 && game.hasPlayer((current) => current != player2 && current.countCards("hej") > 0);
      },
      filterCard: true,
      selectCard: [1, Infinity],
      filterTarget(card, player2, target) {
        if (ui.selected.targets.length === 0) return target.countCards("hje") > 0 && target !== player2;
        return get.distance(ui.selected.targets[0], target) <= ui.selected.cards.length;
      },
      targetprompt: ["被移牌", "收到牌"],
      selectTarget: 2,
      position: "he",
      multitarget: true,
      multiline: true,
      check(card) {
        let player2 = get.player();
        if (game.hasPlayer((current) => current != player2 && get.attitude2(current) > 0 && current.countCards("j") > 0) && ui.selected.cards.length > 0)
          return false;
        let getTarget = get.result("newdanpaomrfz").target;
        let targets = [];
        game.players.forEach((char) => {
          if (char !== player2 && char.countCards("hej") > 0) {
            targets.push([char, getTarget(player2, char)]);
          }
        });
        let target = [void 0, -114514];
        targets.forEach((char) => {
          if (char[1] > target[1]) target = [char[0], char[1]];
        });
        target = target[0];
        if (ui.selected.cards.length >= Math.max(target.countCards("h"), target.countCards("e"))) return false;
        return get.value(card, player2) < 6;
      },
      async content(event2, trigger2, player2) {
        const { targets } = event2;
        const { links } = await player2.choosePlayerCard("hej", targets[0], true, [1, event2.cards.length]).set("prompt", "请选择你要移动的牌<br>（必须选择同一区域的牌）").set("filterOk", () => {
          return new Set(ui.selected.buttons.map((i) => get.position(i.link))).size === 1;
        }).set("ai", (button) => {
          let target = get.event().targets[0];
          let cards = get.event().cards;
          if (get.attitude2(target) > 0 && target.countCards("j") > 0) return target.getCards("j").includes(button.link);
          let h = target.getCards("h");
          let e = target.getCards("e");
          let sort = [h, e, cards].sort((a, b) => {
            return b.length - a.length;
          });
          sort.forEach((arr, index) => {
            if (cards.some((i) => arr.includes(i))) delete sort[index];
          });
          sort = sort.filter((arr) => arr.length > 0);
          return sort[0].includes(button.link) ? get.value(button.link, get.player()) + 10 : 0;
        }).set("targets", targets).set("cards", event2.cards).forResult();
        if (!links) return;
        switch (get.position(links[0])) {
          case "h":
            targets[1].gain(links);
            targets[0].$give(links.length, targets[1]);
            break;
          case "e":
            for (let card of links) {
              if (targets[1].canEquip(card)) {
                targets[1].equip(card);
                targets[0].$give(card, targets[1]);
              } else {
                targets[0].discard(card);
              }
            }
            break;
          case "j":
            for (let card of links) {
              if (!card.cards?.length) targets[0].removeVirtualJudge(card);
              targets[1].addJudge(card, card?.cards);
            }
            break;
        }
      },
      ai: {
        order: 8,
        threaten: 1.5,
        result: {
          target(player2, target) {
            let att = get.attitude(player2, target);
            if (ui.selected.targets.length === 0) {
              if (target.countCards("j") > 0 && att > 0) return 100;
              return att - target.countCards("hej");
            } else {
              let last = ui.selected.targets[0];
              if (last.countCards("j") > 0 && att > 0) return -1;
              return att > 0 ? 1 : 0;
            }
          }
        }
      }
    },
    jiangpaomrfz: {
      audio: "shuipaomrfz",
      frequent: true,
      trigger: { player: "phaseDrawBegin2" },
      filter(event2, player2) {
        return !event2.numFixed;
      },
      async content(event2, trigger2, player2) {
        trigger2.num += ["h", "e", "j"].filter((pos) => player2.countCards(pos) > 0).length;
      },
      ai: {
        threaten: 1.5
      }
    }
  }
};
export {
  legend1SJZX as default
};
//# sourceMappingURL=legend1SJZX.js.map
