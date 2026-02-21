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
    maizhelunmrfz: ["female", "lymrfz", 3, ["kanchamrfz", "longtengmrfz"], []],
    palasimrfz: ["female", "mimrfz", 4, ["yingzhumrfz", "yingdanmrfz", "yingfenmrfz"], []],
    xiaguangmrfz: ["female", "kamrfz", 4, ["rencimrfz", "huiguangmrfz", "jiandunmrfz"], []],
    zaolumrfz: ["female", "wumrfz", 4, ["zhongxiemrfz", "rusuimrfz"], []],
    spshihuaiyamrfz: ["female", "longmrfz", 3, ["mianzaimrfz", "zhijinmrfz"], []],
    spsongzangrenmrfz: ["male", "lamrfz", 3, ["chongdanmrfz", "tianxuanmrfz", "shengcaimrfz"], []],
    spjiexikamrfz: ["female", "gemrfz", 4, ["yijiemrfz", "fuhuangmrfz"], []],
    weiweiannamrfz: ["female", "laimrfz", 4, ["zhanjumrfz", "zhuhuomrfz", "yunjiaomrfz"], []],
    spxiaoyangmrfz: ["female", "laimrfz", 3, ["lvmengmrfz", "rechenmrfz"], []],
    suxinmrfz: ["female", "lamrfz", 3, ["qinmingmrfz", "kongwomrfz"], []],
    hedeleimrfz: ["male", "luomrfz", "4/6", ["zhengrongmrfz", "siyanmrfz"], []],
    zhisongmrfz: ["male", "laimrfz", 4, ["kuxiumrfz", "lirenmrfz"], []],
    jianmrfz: ["female", "xiemrfz", 4, ["weiyamrfz", "zhiwumrfz"], []],
    laiyimrfz: ["female", "leimrfz", 3, ["shaobanmrfz", "tankuangmrfz"], []],
    shumrfz: ["female", "suimrfz", 3, ["kenyemrfz", "heyingmrfz", "rancuimrfz"], []],
    zuolemrfz: ["male", "yanmrfz", "4/5", ["qikumrfz", "bingzhumrfz"], []],
    elamrfz: ["female", "othermrfz", 3, ["leimingmrfz", "zuzhimrfz"], []],
    asikalunmrfz: ["female", "luomrfz", 3, ["dunyingmrfz", "niximrfz"], []],
    luogesimrfz: ["male", "luomrfz", 3, ["baidumrfz", "yuhuimrfz"], []],
    weishidaiermrfz: ["female", "bamrfz", 3, ["yuximrfz", "haolimrfz", "shezumrfz"], []],
    mowangmrfz: ["female", "luomrfz", 3, ["duanzhangmrfz", "chenaimrfz", "canxiangmrfz"], []],
    wuerbianmrfz: ["male", "a_groupmrfz", 4, ["guqianmrfz", "piweimrfz", "tongmaimrfz"], ["clan:深海猎人"]],
    nifumrfz: ["female", "luomrfz", 3, ["xunxinmrfz", "chixinmrfz", "kuixinmrfz"], []],
    narentuyamrfz: ["female", "samrfz", "4/6", ["eyanmrfz", "shafeimrfz"], []],
    peipeimrfz: ["female", "samrfz", 3, ["boqingmrfz", "kuisuimrfz", "lianwenmrfz"], []],
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
        event2.result = await player2.chooseTarget(get.prompt2("zhidengmrfz"), [0, player2.hp], function(card2, player3, target2) {
          return target2.hp <= player3.hp;
        }).set("ai", (target2) => get.attitude2(target2) > 0).forResult();
      },
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = event2;
        game.asyncDraw(targets2);
        if (!player2.storage._sjzxAch_denghuoweimingmrfz) player2.storage._sjzxAch_denghuoweimingmrfz = 0;
        if (targets2.length >= 2) player2.storage._sjzxAch_denghuoweimingmrfz++;
      }
    },
    shenpanmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card2, player2, target2) {
        return player2.canCompare(target2);
      },
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target: target2 } = event2;
        const result2 = await player2.chooseToCompare(target2).forResult();
        if (result2.bool) {
          target2.addTempSkill("shenpanmrfz2");
          player2.addTempSkill("shenpanmrfz3");
          player2.storage.shenpanmrfz3 = target2;
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
          target: function(player2, target2) {
            var num = target2.countCards("h");
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
          player: function(card2, player2, target2, current) {
            if (card2.name == "sha" && target2.countCards("h") == 0 && !target2.hasSkillTag("filterDamage", null, {
              player: player2,
              card: card2
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
        return player2.countCards("he") > 0 && !player2.isDisabled(1) && !player2.hasCard(function(card2) {
          return card2.name == "dazijimrfz";
        }, "e");
      },
      filterCard: true,
      check: function(card2) {
        return 6 - get.value(card2);
      },
      async content(event2, trigger2, player2) {
        const card2 = game.createCard("dazijimrfz", "heart", 2);
        player2.$gain2(card2);
        game.delayx();
        player2.equip(card2);
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
        const card2 = game.createCard("dazijimrfz", "heart", 2);
        player2.$gain2(card2);
        game.delayx();
        player2.equip(card2);
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
        for (var i2 = 0; i2 < event2.targets.length; i2++) {
          var target2 = event2.targets[i2];
          if (target2.hasSkill("sujimrfz2")) return true;
        }
      },
      async content(event2, trigger2, player2) {
        for (var i2 = 0; i2 < trigger2.targets.length; i2++) {
          var target2 = trigger2.targets[i2];
          if (target2.hasSkill("sujimrfz2")) {
            target2.addTempSkill("qinggang2");
            target2.storage.qinggang2.add(trigger2.card);
            target2.markSkill("qinggang2");
            target2.addTempSkill("sujimrfz_damage_add");
            target2.storage.sujimrfz_damage = {
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
        "step 0";
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
          target: function(card2, player2, target2) {
            if (player2.hasSkillTag("jueqing", false, target2)) return [1, -1];
            if (get.tag(card2, "damage")) return [1, 0.55];
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
        cardUsable: function(card2, player2, num) {
          var n = player2.countMark("cuofengmrfz_mark1") + player2.countMark("cuofengmrfz_mark2");
          if (card2.name == "sha") return num - 1 + n;
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
          filterTarget: function(card2, player3, target2) {
            var group = game.me.group;
            return player3 != target2 && target2.group !== group;
          },
          ai1: function(card2) {
            return 10 - get.value(card2);
          },
          ai2: function(target2) {
            if (get.attitude(player2, target2) <= 0) return get.attitude(player2, target2);
            return get.attitude(player2, target2) > 0;
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
      check: function(card2) {
        return 6 - get.value(card2);
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        const { target: target2 } = event2;
        var num = player2.countMark("moucunmrfz");
        if (num < 1) {
          player2.viewHandcards(target2);
        } else {
          var max = target2.countCards("h");
          if (max > num) return player2.gainPlayerCard(num, target2, "h", true, "visible");
          if (num >= max) return player2.gainPlayerCard(max, target2, "h", true, "visible");
        }
        game.log(player2, "观看了", target2, "的手牌");
      },
      ai: {
        order: 6,
        result: {
          player: 0.5,
          target: function(player2, target2) {
            if (target2.hasSkillTag("noh")) return 0;
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
        for (var i2 of event2.cards) {
          if (!list.includes(get.suit(i2, player2))) return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        if (!player2.storage.siyongmrfz2) player2.storage.siyongmrfz2 = [];
        for (var i2 of trigger2.cards) player2.storage.siyongmrfz2.add(get.suit(i2, player2));
        player2.storage.siyongmrfz2.sort();
        player2.addTempSkill("siyongmrfz2");
        player2.markSkill("siyongmrfz2");
        if (game.hasPlayer(function(current) {
          return current != player2 && current.countCards("he") > 0;
        })) {
          const result2 = await player2.chooseTarget("请选择一名其他角色获得其一张牌", true, function(card2, player3, target3) {
            return target3 != player3 && target3.countCards("he") > 0;
          }).set("ai", function(target3) {
            var att = get.attitude(player2, target3);
            if (att >= 0) return 0;
            if (target3.countCards("he", function(card2) {
              return get.value(card2) > 5;
            }))
              return -att;
            return Math.random();
          }).forResult();
          if (result2.targets) {
            var target2 = result2.targets[0];
            player2.gainPlayerCard(1, target2, "he", true);
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
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num + player2.countMark("weiguangmrfz_mark");
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
      content: function() {
        "step 0";
        player.drawTo(Math.min(5, player.getHandcardLimit()));
        player.removeMark("weiguangmrfz_mark", 1);
        player.logSkill("new_weiguangmrfz");
      }
    },
    weiguangmrfz2: {
      enable: "phaseUse",
      usable: 1,
      filterTarget: true,
      prompt: "选择一名角色令其获得一个“火光”标记并对自己造成一点伤害，若该角色是你，你流失一点体力",
      content: function() {
        if (target == player) {
          player.loseHp();
        }
        player.damage();
        target.addMark("weiguangmrfz_mark");
        player.logSkill("new_weiguangmrfz");
      },
      ai: {
        order: 9,
        result: {
          target: function(player2, target2) {
            if (target2.countCards("h") > 2) return 5;
            if (player2 == target2 && player2.getDamagedHp() == 0) return 5;
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
      content: function() {
        "step 0";
        var list = lib.inpile;
        var list2 = [];
        for (var i2 = 0; i2 < list.length; i2++) {
          var name = list[i2];
          if (name == "shan" || name == "wuxie") continue;
          var type = get.type(name);
          if (name == "sha") {
            list2.push(["基本", "", "sha"]);
            list2.push(["基本", "", "sha", "fire"]);
            list2.push(["基本", "", "sha", "thunder"]);
          } else if (type == "basic") {
            list2.push(["基本", "", list[i2]]);
          } else if (type == "trick") {
            list2.push(["锦囊", "", list[i2]]);
          }
        }
        if (!list.length) event.finish();
        else
          player.chooseButton([get.prompt("zhidianmrfz"), [list, "vcard"]]).set("ai", function(button) {
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
          });
        if (result.bool) {
          var name = result.links[0][2];
          player.logSkill("zhidianmrfz");
          player.storage.zhidianmrfz = name;
          player.markSkill("zhidianmrfz");
          game.log(player, "声明了", "#g" + get.translation(name));
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
      content: function() {
        var target2 = trigger.player;
        if (target2 == player) {
          player.chooseToDiscard("he", true, 1);
          player.logSkill("zhidianmrfz");
        } else {
          if (target2.countCards("he") == 0) event._result = { index: 1 };
          else {
            var str = get.translation(player);
            target2.chooseControl().set("choiceList", ["交给" + str + "一张牌", "失去一点体力"]);
          }
        }
        if (target2 !== player) {
          player.logSkill("zhidianmrfz");
          if (result.index == 0) {
            target2.chooseCard("he", true);
          } else {
            target2.loseHp();
          }
        }
        if (target2 !== player) {
          if (result.bool) {
            target2.give(result.cards, player, true);
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
      content: function() {
        var num = player.maxHp - player.hp;
        if (num < 2) trigger.source.damage();
        if (num > 1) trigger.source.damage(2);
      },
      ai: {
        maixie_defend: true,
        effect: {
          target: function(card2, player2, target2) {
            if (player2.hasSkillTag("jueqing", false, target2)) return [1, -1];
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
      content: function() {
        player.changeHujia();
        player.addTempSkill("wotumrfz_ban", {
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
      content: function() {
        "step 0";
        var list = [];
        for (var i2 = 0; i2 < lib.inpile.length; i2++) {
          var name = lib.inpile[i2];
          if (name == "sha") {
            list.push(["基本", "", "sha"]);
            for (var j of lib.inpile_nature) list.push(["基本", "", "sha", j]);
          } else if (get.type(name) == "basic") list.push(["基本", "", name]);
          else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
        }
        player.chooseButton(["塑土", [list, "vcard"]], true).set("ai", function(button) {
          var player2 = _status.event.getParent().player, card2 = {
            name: button.link[2],
            nature: button.link[3]
          };
          if (game.hasPlayer(function(current) {
            return current != player2 && get.attitude(player2, current) < 0 && current.countCards("he") > 0 && get.distance(player2, current) < 2;
          }))
            return "shunshou";
          if (game.hasPlayer(function(current) {
            return current != player2 && get.attitude(player2, current) < 0 && current.countCards("he") == 0 && player2.inRange(current);
          }))
            return "sha";
          return player2.getUseValue(card2, null, true) * _status.event.att;
        }).set("att", get.attitude(event.target, player) > 0 ? 1 : -1);
        if (result.bool) {
          var name = result.links[0][2];
          player.chooseUseTarget({ name, isCard: true }, true);
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
      content: function() {
        "step 0";
        player.changeZhuanhuanji("dianshanmrfz");
        if (player.storage.dianshanmrfz == true) {
          player.chooseTarget(get.prompt("dianshanmrfz"), "对一名其他角色造成一点雷属性伤害", true, function(card2, player2, target2) {
            return target2 != player2;
          }).ai = function(target2) {
            return -get.attitude(player, target2);
          };
        } else {
          player.chooseTarget(get.prompt("dianshanmrfz"), "弃置一名其他角色一张牌", true, function(card2, player2, target2) {
            return target2 != player2;
          }).ai = function(target2) {
            return -get.attitude(player, target2);
          };
        }
        if (result.bool) {
          if (player.storage.dianshanmrfz == true) {
            result.targets[0].damage("thunder");
          } else {
            player.discardPlayerCard(result.targets[0], 1, "he", true);
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
          for (var i2 = 0; i2 < event2.cards2.length; i2++) {
            return true;
          }
        }
        return false;
      },
      forced: true,
      content: function() {
        if (player.isLinked()) player.link(false);
        else player.link();
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
          content: function() {
            player.draw();
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
      content: function() {
        "step 0";
        var num = trigger.cards.length;
        player.chooseTarget(
          get.prompt("fukemrfz"),
          "获得至多" + get.translation(num) + "名角色的各一张牌，然后弃置等量的牌",
          [1, num],
          function(card2, player2, target2) {
            return target2.countCards("he") > 0 && player2 != target2;
          },
          function(target2) {
            var att = get.attitude(_status.event.player, target2);
            if (target2.hasSkill("tuntian")) return att / 10;
            return 1 - att;
          }
        );
        if (result.bool) {
          var num2 = result.targets.length;
          result.targets.sortBySeat();
          player.logSkill("fukemrfz", result.targets);
          player.chooseToDiscard(num2, true, "he");
          player.gainMultiple(result.targets, "he");
        } else {
          event.finish();
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
      content: function() {
        player.removeMark("zhumengmrfz3", player.countMark("zhumengmrfz3"));
        player.unmarkSkill("zhumengmrfz2");
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
      content: function() {
        "step 0";
        player.judge();
        player.markSkill("zhumengmrfz2");
        if (get.type(result.card) !== "delay") {
          player.storage.zhumengmrfz2 = get.type(result.card);
        } else {
          player.storage.zhumengmrfz2 = "trick";
        }
        player.addMark("zhumengmrfz3", result.number);
        player.logSkill("zhumengmrfz");
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
      content: function() {
        player.removeMark("zhumengmrfz3");
        player.draw();
        player.logSkill("zhumengmrfz");
      },
      group: ["zhumengmrfz2", "zhumengmrfz"]
    },
    //浊心斯卡蒂
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
      content: function() {
        "step 0";
        var characterlist = [];
        for (var i2 = 0; i2 < game.players.length; i2++) {
          var players = game.players[i2];
          if (players == player) continue;
          characterlist.push(players.name);
        }
        if (!lib.config.isNoLimted_mrfz) {
          characterlist.remove("amiyamrfz");
          characterlist.remove("baocunzhemrfz");
        }
        var skills = [];
        for (var i2 of characterlist) {
          skills.addArray(lib.character[i2][3]);
        }
        if (!characterlist.length || !skills.length) {
          event.finish();
          return;
        }
        if (player.isUnderControl()) {
          game.swapPlayerAuto(player);
        }
        var switchToAuto = function() {
          _status.imchoosing = false;
          event._result = {
            bool: true,
            skills: skills.randomGets(2)
          };
          if (event.dialog) event.dialog.close();
          if (event.control) event.control.close();
        };
        var chooseButton = function(list, skills2) {
          var event2 = _status.event;
          if (!event2._result) event2._result = {};
          event2._result.skills = [];
          var rSkill = event2._result.skills;
          var dialog = ui.create.dialog("请获得两个技能", [list, "character"], "hidden");
          event2.dialog = dialog;
          var table = document.createElement("div");
          table.classList.add("add-setting");
          table.style.margin = "0";
          table.style.width = "100%";
          table.style.position = "relative";
          for (var i3 = 0; i3 < skills2.length; i3++) {
            var td = ui.create.div(".shadowed.reduce_radius.pointerdiv.tdnode");
            td.link = skills2[i3];
            table.appendChild(td);
            td.innerHTML = "<span>" + get.translation(skills2[i3]) + "</span>";
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
          event2.switchToAuto = function() {
            event2.dialog.close();
            event2.control.close();
            game.resume();
            _status.imchoosing = false;
          };
          event2.control = ui.create.control("ok", function(link) {
            event2.dialog.close();
            event2.control.close();
            game.resume();
            _status.imchoosing = false;
          });
          for (var i3 = 0; i3 < event2.dialog.buttons.length; i3++) {
            event2.dialog.buttons[i3].classList.add("selectable");
          }
          game.pause();
          game.countChoose();
        };
        if (event.isMine()) {
          chooseButton(characterlist, skills);
        } else if (event.isOnline()) {
          event.player.send(chooseButton, characterlist, skills);
          event.player.wait();
          game.pause();
        } else {
          switchToAuto();
        }
        var map = event.result || result;
        if (map && map.skills && map.skills.length) {
          for (var i2 of map.skills) player.addSkillLog(i2);
        }
        game.broadcastAll(function(list) {
          game.expandSkills(list);
          for (var i3 of list) {
            var info = lib.skill[i3];
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
      content: function() {
        "step 0";
        player.draw("visible");
        var card2 = result[0];
        if (get.type(card2) == "equip") {
          player.addTempSkill("geyaomrfz_e");
        }
        if (get.type(card2) == "trick" || get.type(card2) == "delay") {
          player.addTempSkill("geyaomrfz_t");
        }
        if (get.type(card2) == "basic") {
          player.addTempSkill("geyaomrfz_b");
        }
        game.log(player, "展示了一张", get.type(card2), "牌");
      }
    },
    geyaomrfz_e: {
      mod: {
        targetInRange: function(card2, player2, target2, now) {
          if (card2.name == "sha") return true;
        },
        selectTarget: function(card2, player2, range) {
          if (card2.name == "sha" && range[1] != -1) range[1] = Infinity;
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
      content: function() {
        player.logSkill("geyaomrfz");
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player;
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
      content: function() {
        var color = get.color(trigger.card);
        player.gainPlayerCard(trigger.target, "h", "visible").set("color", color).set("filterButton", function(button) {
          var evt = _status.event;
          return get.color(button.link, evt.target) != evt.color;
        });
        player.logSkill("geyaomrfz", trigger.target);
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
        return player2.getCardUsable("sha") == 0 && player2.countCards("h", function(card2) {
          return card2.name == "sha";
        }) > 0;
      },
      content: function() {
        player.chooseToDiscard("h", 1, true);
        trigger.addCount = false;
        if (player.stat[player.stat.length - 1].card.sha > 0) {
          player.stat[player.stat.length - 1].card.sha--;
        }
      }
    },
    //缄默德克萨斯
    yushimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseDrawBegin2" },
      content: function() {
        var num = 8 - game.roundNumber;
        trigger.num = Math.max(3, num);
      }
    },
    laoyingmrfz: {
      audio: 2,
      usable: 1,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        return event2.card && event2.getParent("phaseUse") && event2.getParent("phaseUse").player == player2 && get.itemtype(event2.cards) == "cards" && get.position(event2.cards[0], true) == "o";
      },
      content: function() {
        player.gain(trigger.cards, "gain2");
        var cardu = { name: trigger.card.name, isCard: true };
        if (get.type(cardu) == "basic") player.addTempSkill("laoyingmrfz_basic");
        else player.addTempSkill("laoyingmrfz_trick");
      },
      subSkill: {
        basic: {
          charlotte: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + 1;
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
          content: function() {
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player;
              })
            );
            player.removeSkill("laoyingmrfz_trick");
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
      content: function() {
        "step 0";
        var list = ["蓝色", "红色", "绿色"];
        player.chooseControl(list, "cancel2").set("prompt", get.prompt("xunlumrfz")).set(
          "prompt2",
          "令〖寻路〗中的一个数字+1</br>数字：<span class=thundertext>" + player.storage.xunlumrfz_draw + "</span> <span class=firetext>" + player.storage.xunlumrfz_sha + "</span> <span class=greentext>" + player.storage.xunlumrfz_h + "</span>"
        ).set("ai", function() {
          if (player.storage.xunlumrfz_draw < 4) return 0;
          if (player.storage.xunlumrfz_draw == 4 && player.xunlumrfz_sha < 4) return 1;
          if (player.storage.xunlumrfz_h < 4) return 2;
          return 3;
        });
        if (result.control != "cancel2") {
          if (result.control == "蓝色") {
            if (player.storage.xunlumrfz_draw < 4) {
              player.storage.xunlumrfz_draw++;
            }
          }
          if (result.control == "红色") {
            if (player.storage.xunlumrfz_sha < 4) {
              player.storage.xunlumrfz_sha++;
            }
          }
          if (result.control == "绿色") {
            if (player.storage.xunlumrfz_h < 4) {
              player.storage.xunlumrfz_h++;
            }
          }
          if (result.control == "修改【寻路】") {
            if (!player.storage.xunlumrfz2) {
              player.storage.xunlumrfz2 = true;
            }
          }
          player.markSkill("xunlumrfz");
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
      content: function() {
        var num = game.RDNbet(player.storage.xunlumrfz_draw, 6);
        trigger.num = Math.min(num, 6);
        player.logSkill("xunlumrfz");
        player.chat("可出" + player.storage.xunlumrfz_sha2 + "张杀</br>手牌上限为：" + player.storage.xunlumrfz_h2);
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
      content: function() {
        player.addTempSkill("xunlumrfz_sha2", {
          player: "phaseZhunbeiBegin"
        });
        player.storage.xunlumrfz_sha2 = game.RDNbet(player.storage.xunlumrfz_sha, 5);
        player.logSkill("xunlumrfz");
      }
    },
    xunlumrfz_sha2: {
      init: function(player2) {
        player2.storage.xunlumrfz_sha2 = 0;
        player2.syncStorage("xunlumrfz_sha2");
      },
      onremove: true,
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return Math.min(player2.storage.xunlumrfz_sha2, 5);
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
      content: function() {
        player.addTempSkill("xunlumrfz_h2", {
          player: "phaseZhunbeiBegin"
        });
        player.storage.xunlumrfz_h2 = game.RDNbet(player.storage.xunlumrfz_h, 8);
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
      content: function() {
        "step 0";
        player.chooseTarget("选择一名其他角色，视为对其使用【决斗】", function(card2, player2, target3) {
          return target3 != player2;
        }).set("ai", function(target3) {
          return -get.attitude(_status.event.player, target3);
        });
        player.addSkill("zhuguangmrfz2");
        if (result.bool) {
          var target2 = result.targets[0];
          player.useCard({ name: "juedou" }, true, target2);
        }
        if (player.hasSkill("zhuguangmrfz2")) player.removeSkill("zhuguangmrfz2");
      },
      group: "zhuguangmrfz_change"
    },
    zhuguangmrfz2: {
      audio: false,
      silent: true,
      trigger: { source: "damageBegin2" },
      filter: function(event2, player2, card2) {
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
      content: function() {
        "step 0";
        if (!player.storage.zhuguangmrfz_change) trigger.cancel();
        var list = [];
        if (!player.storage.kuanmrfz && player.hasSkill("kuanmrfz")) list.add("修改【苦暗】");
        if (!player.storage.zhuguangmrfz_change) list.add("修改【逐光】");
        if (!player.storage.zhuguangmrfz_change) list.add("摸一张牌");
        if (player.storage.zhuguangmrfz_change) list.add("摸两张牌");
        if (list.length == 1) {
          player.draw(player.storage.zhuguangmrfz_change ? 2 : 1);
          player.logSkill("zhuguangmrfz");
          event.finish();
        } else {
          list.add("cancel2");
          player.chooseControl(list).set("prompt", get.prompt("zhuguangmrfz")).set("prompt2", "选择一项").set("ai", function() {
            if (!player.storage.zhuguangmrfz_change) return 1;
            if (!player.storage.kuanmrfz && player.hasSkill("kuanmrfz")) return 0;
            return [0, 1].randomGet();
          });
        }
        player.logSkill("zhuguangmrfz");
        if (result.control != "cancel2") {
          if (result.control == "修改【苦暗】") {
            player.storage.kuanmrfz = true;
          }
          if (result.control == "修改【逐光】") {
            player.storage.zhuguangmrfz_change = true;
          }
          if (result.control == "摸一张牌") {
            player.draw();
          }
          if (result.control == "摸两张牌") {
            player.draw(2);
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
      content: function() {
        "step 0";
        player.logSkill("zhuguangmrfz");
        player.chooseTarget("选择一名其他角色，视为对其使用【决斗】，且此决斗不可响应", function(card2, player2, target3) {
          return target3 != player2;
        }).set("ai", function(target3) {
          return -get.attitude(_status.event.player, target3);
        });
        player.addSkill(["zhuguangmrfz2", "zhuguangmrfz3"]);
        if (result.bool) {
          var target2 = result.targets[0];
          player.useCard({ name: "juedou", zhuguangmrfz: true }, true, target2);
        }
        if (player.hasSkill("zhuguangmrfz2")) player.removeSkill("zhuguangmrfz2");
        if (player.hasSkill("zhuguangmrfz3")) player.removeSkill("zhuguangmrfz3");
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
      content: function() {
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player;
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
      content: function() {
        player.disableEquip("equip1");
        player.disableEquip("equip2");
        player.disableEquip("equip3");
        player.disableEquip("equip4");
        player.disableEquip("equip5");
        player.disableJudge();
        player.draw(3);
      },
      group: ["kuanmrfz2", "kuanmrfz5"],
      mod: {
        ignoredHandcard: function(card2, player2) {
          if (get.type(card2) == "equip") return true;
        },
        cardDiscardable: function(card2, player2, name) {
          if (name == "phaseDiscard" && get.type(card2) == "equip") return false;
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
      content: function() {
        "step 0";
        player.logSkill("kuanmrfz");
        player.judge(function(card2) {
          if (get.suit(card2) == "heart") return -2;
          return 1;
        });
        if (result.suit !== "heart") {
          player.skip("phaseUse");
          game.log(player, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result.suit, ",", player, "跳过出牌阶段");
        } else {
          game.log(player, "的<span class=thundertext>【乐不思蜀】</span>判定结果为", result.suit, ",判定失败");
        }
        player.judge(function(card2) {
          if (get.suit(card2) == "club") return -2;
          return 1;
        });
        if (result.suit !== "club") {
          player.skip("phaseDraw");
          game.log(player, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result.suit, ",", player, "跳过摸牌阶段");
        } else {
          game.log(player, "的<span class=thundertext>【兵粮寸断】</span>判定结果为", result.suit, ",判定失败");
        }
      }
    },
    kuanmrfz5: {
      audio: "kuanmrfz",
      enable: ["chooseToRespond", "chooseToUse"],
      filter: function(event2, player2) {
        if (event2.type == "wuxie" || player2.countCards("h", function(card2) {
          return get.type(card2) == "equip";
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
            var card2 = { name, isCard: true };
            if (event2.filterCard(card2, player2, event2)) vcards.push(["基本", "", name]);
          }
          var dialog = ui.create.dialog("苦暗", [vcards, "vcard"], "hidden");
          dialog.direct = true;
          return dialog;
        },
        backup: function(links, player2) {
          return {
            filterCard: function(card2) {
              return get.type(card2) == "equip";
            },
            selectCard: 1,
            viewAs: {
              name: links[0][2],
              isCard: false
            },
            popname: true,
            precontent: function() {
              player2.logSkill("kuanmrfz");
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
      content: function() {
        trigger.cancel();
        player.storage.shuoguangmrfz = true;
      }
    },
    //凯尔希
    yuanlvemrfz: {
      audio: 2,
      trigger: { player: "drawBegin" },
      forced: true,
      filter: function(event2, player2) {
        return event2.getParent(1).name != "yuanlvemrfz";
      },
      content: function() {
        "step 0";
        let num = 0;
        if (!player.storage.yuanshimrfz || player.storage.yuanshimrfz_gain) {
          num = trigger.num;
        } else {
          num = trigger.num + 1;
        }
        if (trigger.parent.name !== "phaseDraw") {
          player.chooseToGuanxing(num);
          player.draw(num);
        } else {
          player.chooseToGuanxing(num + 1);
          player.draw(num + 1);
        }
        trigger.cancel();
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
      content: function() {
        player.chooseToDiscard("h", player.countCards("h"), true);
        if (!player.storage.chonggoumrfz) {
          player.draw(player.countCards("h") - player.getDamagedHp());
        } else {
          player.draw(player.countCards("h"));
        }
        player.recover();
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
      content: function() {
        var hs = player.getCards("h");
        if (hs.length) player.addGaintag(hs, "yuanshimrfz");
      },
      group: ["yuanshimrfz_basic", "yuanshimrfz_equip", "yuanshimrfz_trick", "yuanshimrfz_gain"],
      subSkill: {
        basic: {
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
              for (var i2 in evt.gaintag_map) {
                if (evt.gaintag_map[i2].includes("yuanshimrfz")) return true;
              }
              return false;
            });
          },
          content: function() {
            if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
            player.logSkill("yuanshimrfz");
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player;
              })
            );
          },
          ai: {
            directHit_ai: true
          }
        },
        equip: {
          trigger: { player: "useCard" },
          prompt: "是否摸一张牌",
          filter: function(event2, player2) {
            if (get.type(event2.card) !== "equip" && get.type(event2.card) !== "delay") return false;
            return player2.hasHistory("lose", function(evt) {
              if (event2 != evt.getParent()) return false;
              for (var i2 in evt.gaintag_map) {
                if (evt.gaintag_map[i2].includes("yuanshimrfz")) return true;
              }
              return false;
            });
          },
          content: function() {
            if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
            player.logSkill("yuanshimrfz");
            player.draw();
          }
        },
        trick: {
          trigger: { player: "useCard" },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.card) + "的目标+1/-1";
          },
          filter: function(event2, player2) {
            if (get.type(event2.card) !== "trick") return false;
            return player2.hasHistory("lose", function(evt) {
              if (event2 != evt.getParent()) return false;
              for (var i2 in evt.gaintag_map) {
                if (evt.gaintag_map[i2].includes("yuanshimrfz")) return true;
              }
              return false;
            });
          },
          content: function() {
            "step 0";
            if (!player.storage.yuanshimrfz_gain) player.storage.yuanshimrfz_gain = true;
            var prompt2 = "为" + get.translation(trigger.card) + "增加或减少一个目标";
            player.chooseTarget(get.prompt("yuanshimrfz"), function(card2, player2, target2) {
              var player2 = _status.event.player;
              if (_status.event.targets.includes(target2)) return true;
              return lib.filter.targetEnabled2(_status.event.card, player2, target2) && lib.filter.targetInRange(_status.event.card, player2, target2);
            }).set("prompt2", prompt2).set("ai", function(target2) {
              var trigger2 = _status.event.getTrigger();
              var player2 = _status.event.player;
              return get.effect(target2, trigger2.card, player2, player2) * (_status.event.targets.includes(target2) ? -1 : 1);
            }).set("targets", trigger.targets).set("card", trigger.card);
            if (result.bool) {
              if (!event.isMine() && !event.isOnline()) game.delayx();
              event.targets = result.targets;
            } else {
              event.finish();
            }
            if (event.targets) {
              player.logSkill("yuanshimrfz", event.targets);
              if (trigger.targets.includes(event.targets[0])) trigger.targets.removeArray(event.targets);
              else trigger.targets.addArray(event.targets);
            }
          }
        },
        gain: {
          trigger: { player: "loseAfter" },
          forced: true,
          filter: function(event2, player2) {
            if (player2.storage.yuanshimrfz || player2.storage.chonggoumrfz) return false;
            return !player2.hasCard(function(card2) {
              return card2.hasGaintag("yuanshimrfz");
            }, "h");
          },
          content: function() {
            player.logSkill("yuanshimrfz");
            if (!player.storage.yuanshimrfz_gain) {
              player.storage.yuanshimrfz = true;
              player.markSkill("yuanshimrfz");
            } else {
              player.storage.chonggoumrfz = true;
              player.markSkill("chonggoumrfz");
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
        var num = player2.countCards("h", function(card2) {
          return card2.name == "tao" || card2.name == "jiu";
        });
        return player2.hp + num <= 0;
      },
      content: function() {
        "step 0";
        player.awakenSkill("m3mrfz");
        player.removeSkill("chonggoumrfz");
        player.discard(player.getCards("hej"));
        player.recoverTo(2);
        player.storage.m3mrfz = true;
        player.loseMaxHp();
        player.turnOver(false);
        player.link(false);
        var targets2 = game.filterPlayer();
        event.targets = targets2.remove(player);
        event.discard = [];
        event.num = 0;
        if (event.targets.length) {
          var current = event.targets.shift();
          if (current.countCards("he") > 0) {
            current.chooseBool("是否弃置一张牌令" + get.translation(player) + "摸一张牌").set("ai", function() {
              return get.attitude(_status.event.player, _status.event.target) > 2;
            }).set("target", player);
            event.current = current;
          } else {
            event.redo();
          }
        } else {
          event.goto(4);
        }
        if (result.bool) {
          event.discard.push(event.current);
          event.current.line(player, "green");
          game.log(event.current, "令", player, "摸一张牌");
          player.draw();
        }
        if (event.targets.length) {
          event.goto(2);
        }
        if (event.discard.length) {
          var next = game.createEvent("m3mrfz_next");
          event.next.remove(next);
          trigger.after.push(next);
          next.targets = event.discard;
          next.setContent(function() {
            for (var i2 = 0; i2 < targets2.length; i2++) {
              if (targets2[i2].countCards("h") > 0) {
                targets2[i2].chooseToDiscard("h", true);
              }
            }
          });
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
      content: function() {
        "step 0";
        player.addMark("zhuangtimrfz", trigger.num);
        var damage = player.countMark("zhuangtimrfz");
        if (damage > 1) {
          player.gainMaxHp(Math.floor(damage / 2));
          player.removeMark("zhuangtimrfz", Math.floor(damage / 2) * 2);
          player.logSkill("zhuangtimrfz");
        }
      },
      group: ["zhuangtimrfz_use", "zhuangtimrfz_draw"],
      subSkill: {
        use: {
          audio: 2,
          usable: 1,
          enable: "phaseUse",
          filter: function(event2, player2) {
            for (var i2 of lib.inpile) {
              if (get.type(i2) == "trick" && event2.filterCard({ name: i2, isCard: true }, player2, event2)) return true;
              if (get.type(i2) == "basic" && event2.filterCard({ name: i2, isCard: true }, player2, event2)) return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var list = [];
              for (var i2 of lib.inpile) {
                if (get.type(i2) == "trick" && event2.filterCard({ name: i2, isCard: true }, player2, event2)) list.push(["锦囊", "", i2]);
                if (get.type(i2) == "basic" && event2.filterCard({ name: i2, isCard: true }, player2, event2)) list.push(["基本", "", i2]);
              }
              return ui.create.dialog("壮体", [list, "vcard"]);
            },
            check: function(button) {
              return _status.event.player.getUseValue({
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
                precontent: function() {
                  player2.logSkill("zhuangtimrfz");
                  player2.loseMaxHp();
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
          content: function() {
            var num = player.getDamagedHp();
            player.loseMaxHp(num);
            player.draw(Math.ceil(num / 2));
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
      content: function() {
        "step 0";
        trigger.num++;
        var card2 = trigger.player.countCards("he");
        if (player.maxHp >= card2) {
          player.chooseControl("确定", "cancel2").set("prompt", "是否失去两点体力上限，令此伤害+1").set("ai", function(event2, player2) {
            if (get.attitude(player2, event2.player) < 0 && player2.maxHp >= 3) return 0;
            return 1;
          });
        }
        if (result.control !== "cancel2") {
          trigger.num++;
          player.loseMaxHp(2);
          player.logSkill("zhuangtimrfz", trigger.player);
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
      filterTarget: function(card2, player2, target2) {
        return target2.countCards("h") > 0;
      },
      selectTarget: -1,
      multitarget: true,
      multiline: true,
      content: function() {
        "step 0";
        var num = [3, 1, 2].randomGet();
        if (num == 1) player.storage.xunxiangmrfz = "basic";
        if (num == 2) player.storage.xunxiangmrfz = "trick";
        if (num == 3) player.storage.xunxiangmrfz = "equip";
        game.log("<span class=thundertext>【寻相】</span>随机的类型为<span class=firetext>", player.storage.xunxiangmrfz, "牌</span>");
        player.popup(get.translation(player.storage.xunxiangmrfz) + "牌");
        targets.sortBySeat();
        var next = player.chooseCardOL(targets, "请选择要展示的牌", true).set("ai", function(card2) {
          return -get.value(card2);
        }).set("source", player);
        next.aiCard = function(target3) {
          var hs = target3.getCards("h");
          return { bool: true, cards: [hs.randomGet()] };
        };
        next._args.remove("glow_result");
        var cards2 = [];
        var num = 0;
        event.videoId = lib.status.videoId++;
        for (var i2 = 0; i2 < targets.length; i2++) {
          cards2.push(result[i2].cards[0]);
        }
        event.cards = cards2;
        game.log(player, "展示了", targets, "的", cards2);
        game.broadcastAll(
          function(targets2, cards3, id, player2) {
            var dialog = ui.create.dialog(
              get.translation(player2) + "发动了【寻相】</br><span class=firetext>【寻相】随机声明的类型为" + get.translation(player2.storage.xunxiangmrfz) + "牌</span>",
              cards3
            );
            dialog.videoId = id;
            var getName = function(target3) {
              if (target3._tempTranslate) return target3._tempTranslate;
              var name = target3.name;
              if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
              return get.translation(name);
            };
            for (var i3 = 0; i3 < targets2.length; i3++) {
              dialog.buttons[i3].querySelector(".info").innerHTML = getName(targets2[i3]);
              if (get.type(result[i3].cards[0]) == player2.storage.xunxiangmrfz) num++;
              if (get.type(result[i3].cards[0]) == "delay" && player2.storage.xunxiangmrfz == "trick") num++;
            }
          },
          targets,
          cards2,
          event.videoId,
          player
        );
        game.delay(4);
        if (num == 0) {
          player.chooseTarget("选择一名其他角色，你与其各流失一点体力", true, function(card2, player2, target3) {
            return target3 != player2;
          }).ai = function(target3) {
            return get.attitude(player, target3) < 2;
          };
          player.loseHp();
        } else {
          player.addTempSkill("xunxiangmrfz2", "phaseUseEnd");
          player.draw(num);
        }
        game.broadcastAll("closeDialog", event.videoId);
        if (result.bool) {
          var target2 = result.targets[0];
          target2.loseHp();
        }
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
      content: function() {
        var lastcard = lib.skill.ronghangmrfz.getLastUsed(player, trigger);
        if (get.cardNameLength(lastcard.card) < get.cardNameLength(trigger.card)) {
          trigger.baseDamage++;
          player.popup("伤害基数+1");
        } else {
          var name = get.name(trigger.card);
          if (name == "sha") {
            trigger.addCount = false;
            if (player.stat[player.stat.length - 1].card.sha > 0) {
              player.stat[player.stat.length - 1].card.sha--;
            }
          } else if (name == "jiu") {
            trigger.addCount = false;
            if (player.stat[player.stat.length - 1].card.jiu > 0) {
              player.stat[player.stat.length - 1].card.jiu--;
            }
          }
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current != player;
            })
          );
          player.popup("强中且无限制");
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
    //废弃技能，暂时无用
    caiganmrfz: {
      trigger: {
        player: "gainAfter"
      },
      firstDo: true,
      direct: true,
      filter: function(event2, player2) {
        return event2.getParent(2).name != "caiganmrfz";
      },
      audio: 2,
      content: function() {
        "step 0";
        player.chooseToDiscard("h", [1, Infinity], get.prompt("caiganmrfz"), function(card2) {
          return card2.hasGaintag("caiganmrfz");
        });
        if (result.bool) {
          var cards2 = result.cards;
          player.draw(cards2.length);
          if (!player.storage.caiganmrfz_times) {
            player.storage.caiganmrfz_times = true;
            player.draw();
          }
        }
      },
      ai: {
        threaten: 1.6,
        expose: 0.2
      },
      group: ["caiganmrfz_mark", "caiganmrfz_remove", "caiganmrfz_times"],
      subSkill: {
        mark: {
          trigger: {
            player: "gainBegin"
          },
          silent: true,
          content: function() {
            trigger.gaintag.add("caiganmrfz");
          }
        },
        remove: {
          trigger: {
            player: "gainAfter"
          },
          silent: true,
          forced: true,
          charlotte: true,
          content: function() {
            player.removeGaintag("caiganmrfz");
          }
        },
        times: {
          trigger: {
            global: "phaseEnd"
          },
          silent: true,
          filter: function(event2, player2) {
            return player2.storage.caiganmrfz_times;
          },
          content: function() {
            player.storage.caiganmrfz_times = false;
          }
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
      content: function() {
        "step 0";
        player.draw();
        player.markAuto("jingsimrfz", [trigger.card.name]);
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
      content: function() {
        trigger.cancel();
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
          content: function() {
            player.storage.banruomrfz = false;
          }
        },
        draw: {
          forced: true,
          popup: false,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return player2.storage.banruomrfz;
          },
          content: function() {
            trigger.num--;
          }
        },
        round: {
          forced: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return game.roundNumber > player2.maxHp && player2.storage.banruomrfz;
          },
          content: function() {
            player.storage.banruomrfz = false;
            player.logSkill("banruomrfz");
          }
        },
        atk: {
          forced: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return !player2.storage.banruomrfz;
          },
          content: function() {
            player.removeSkill("banruomrfz_atk");
            player.addSkill("banruomrfz2");
            player.logSkill("banruomrfz");
          }
        }
      },
      ai: {
        effect: {
          target: function(card2, player2, target2, current) {
            if (!player2.storage.banruomrfz) return;
            if (get.tag(card2, "damage")) return "zerotarget";
            if (get.type(card2) == "trick" && get.tag(card2, "damage")) {
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
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num += 1;
        }
      },
      group: ["banruomrfz2_damage", "banruomrfz2_lose"],
      subSkill: {
        damage: {
          forced: true,
          usable: 1,
          trigger: { source: "damageBegin" },
          content: function() {
            trigger.num++;
            player.logSkill("banruomrfz");
          }
        },
        lose: {
          forced: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            player.removeSkill("banruomrfz2");
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
      content: function() {
        player.chooseToDiscard(true, "he");
        trigger.cancel();
        player.damage(trigger.num, trigger.source || "nosource", "nocard");
      },
      group: "yizhongmrfz2"
    },
    yizhongmrfz2: {
      trigger: { player: "damageEnd" },
      firstDo: true,
      filter: function(event2, player2) {
        return event2.getParent().name == "yizhongmrfz";
      },
      prompt: "是否摸两张牌",
      content: function() {
        player.draw(2);
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
      content: function() {
        trigger.num--;
        player.addMark("shazhenmrfz_damage", false);
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
          content: function() {
            player.storage.shazhenmrfz = true;
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
          content: function() {
            player.storage.shazhenmrfz = false;
            player.removeMark("shazhenmrfz_damage", player.countMark("shazhenmrfz_damage"));
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
      content: function() {
        trigger.player.addMark("shacanmrfz");
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
          content: function() {
            var target2 = trigger.source;
            var num = target2.countMark("shacanmrfz2");
            target2.addMark("shacanmrfz2", trigger.cards.length, false);
            if (num > 1) {
              target2.removeMark("shacanmrfz", Math.floor(num / 2));
              target2.removeMark("shacanmrfz2", Math.floor(num / 2) * 2);
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
          content: function() {
            var target2 = trigger.player;
            var list = [];
            if (player.getDamagedHp() > 0) list.add("回血");
            if (target2.countCards("he") > 0) list.add("交牌");
            target2.chooseControl(list).set("prompt", "选择一项").set("ai", function(player2) {
              return 0;
            });
            if (result.control == "cancel2") event.finish();
            if (result.control == "回血") {
              player.recover();
              target2.removeMark("shacanmrfz");
              player.logSkill("shacanmrfz");
              event.finish();
            }
            if (result.control == "交牌") {
              if (target2.countCards("he") > 1)
                target2.chooseCard(2, "展示两张牌", true, "he").set("ai", function(card2) {
                  return get.value(card2);
                });
              else target2.chooseCard(1, "展示两张手牌", true, "he");
            }
            if (result.bool && result.cards && result.cards.length) {
              if (result.cards.length == 1) {
                event._result = {
                  bool: true,
                  links: result.cards.slice(0)
                };
              } else
                player.chooseButton(["选择获得其中的一张牌", result.cards], true).ai = function(button) {
                  return get.value(button.link);
                };
            }
            if (result.links) {
              player.gain(result.links, target2, "give");
              player.logSkill("shacanmrfz");
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
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.countMark("shacanmrfz") < 1;
      },
      content: function() {
        target.addMark("shacanmrfz");
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
        return event2.cards.filterInD("od").length > 0;
      },
      logTarget: "player",
      content: function() {
        var cards2 = trigger.cards.filterInD("od");
        player.gain(cards2, "log", "gain2");
        player.addMark("danweimrfz");
      },
      group: ["danweimrfz_use"],
      subSkill: {
        use: {
          trigger: { player: ["respond", "useCard"] },
          usable: 2,
          filter: function(event2, player2) {
            if (!event2.respondTo) return false;
            return event2.cards.filterInD("od").length > 0;
          },
          logTarget: "player",
          content: function() {
            var cards2 = [];
            if (get.itemtype(trigger.respondTo[1]) == "card") cards2.push(trigger.respondTo[1]);
            else if (trigger.respondTo[1].cards) cards2.addArray(trigger.respondTo[1].cards);
            cards2 = cards2.filterInD("od");
            player.gain(cards2, "gain2", "log");
            player.logSkill("danweimrfz");
            player.addMark("danweimrfz");
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
      content: function() {
        "step 0";
        if (player.countCards("h") == 0) event._result = { index: 1 };
        if (player.countMark("danweimrfz") == 0) event._result = { index: 0 };
        if (player.countMark("danweimrfz") > 0 && player.countCards("h") > 0)
          player.chooseControl().set("choiceList", [
            "弃置一张手牌",
            //0
            "失去一个‘胆’"
            //1
          ]).set("ai", function(card2) {
            var player2 = _status.event.player;
            if (player2.hasCard(function(card3) {
              return get.value(card3) < 7;
            }, "h"))
              return 0;
            return 1;
          });
        if (result.index == 0) {
          player.chooseToDiscard(true, "h", "弃置一张手牌");
        } else {
          player.removeMark("danweimrfz");
        }
        if (!target.hasSkill("hechimrfz2")) target.addSkill("hechimrfz2");
        target.addMark("hechimrfz2");
        target.draw(2);
        if (target != player) player.draw();
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
      content: function() {
        "step 0";
        player.removeMark("hechimrfz2", player.countMark("hechimrfz2"));
        player.removeSkill("hechimrfz2");
        if (Math.random() < 0.1) player.logSkill("chencaidanmrfz");
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
      content: function() {
        "step 0";
        player.removeMark("danweimrfz", 5);
        event.num = 0;
        event.num++;
        player.chooseUseTarget(
          {
            name: "sha",
            nature: "thunder",
            isCard: true
          },
          "请选择雷【杀】的目标（雷【杀】：" + event.num + "/2；普通【杀】:0/1）",
          false,
          "nodistance"
        );
        if (result.bool && event.num < 2) event.goto(1);
        else
          player.chooseUseTarget(
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
      content: function() {
        "step 0";
        var target2 = trigger.target;
        trigger.card;
        target2.chooseBool("【警司】：是否请求将此" + get.translation(trigger.card) + "的目标改为" + get.translation(player) + "?").set("ai", function() {
          var player2 = _status.event.player, target3 = _status.event.getTrigger().player;
          return get.attitude(player2, target3) > 2;
        });
        if (result.bool) {
          player.chooseBool(
            "【警司】：是否接受" + get.translation(trigger.player) + "的请求，令" + get.translation(trigger.card) + "的目标改为你？"
          ).set("ai", function() {
            var player2 = _status.event.player, target3 = _status.event.getTrigger().player;
            var nametmp = _status.event.name;
            if (nametmp == "sha" && player2.countCards("h", function(card2) {
              return card2.name == "shan";
            }) < 1)
              return false;
            if (nametmp == "juedou" && player2.countCards("h", function(card2) {
              return card2.name == "sha";
            }) < 2)
              return false;
            if (player2.hp < 3) return false;
            return get.attitude(player2, target3) > 2;
          }).set("name", trigger.card.name);
        } else event.finish();
        if (result.bool) {
          player.draw();
          player.addMark("danweimrfz");
          player.addTempSkill("newjingsimrfz_ban", "phaseEnd");
          var target2 = trigger.target;
          trigger.targets.remove(target2);
          trigger.getParent().triggeredTargets1.remove(target2);
          trigger.untrigger();
          game.delayx();
        } else event.finish();
        trigger.targets.push(player);
        trigger.player.line(player, "fire");
        game.log(trigger.card, "的目标被改为", player);
        player.logSkill("newjingsimrfz");
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
      content: function() {
        trigger.cancel();
        player.logSkill("luanhuomrfz");
      },
      ai: {
        nofire: true,
        effect: {
          target: function(card2, player2, target2, current) {
            if (get.tag(card2, "fireDamage")) return "zerotarget";
          }
        }
      },
      group: ["luanhuomrfz_fire", "luanhuomrfz_times", "luanhuomrfz_clear", "luanhuomrfz_damage"],
      subSkill: {
        fire: {
          trigger: { source: "damageBegin" },
          forced: true,
          charlotte: true,
          filter: function(event2, player2) {
            return event2.nature != "fire";
          },
          content: function() {
            trigger.cancel();
            trigger.player.damage(trigger.num, player, "fire");
            player.logSkill("luanhuomrfz");
          }
        },
        times: {
          forced: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            player.addMark("luanhuomrfz");
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
          content: function() {
            player.removeMark("luanhuomrfz", player.countMark("luanhuomrfz"));
          }
        },
        damage: {
          trigger: { player: "phaseZhunbeiBegin" },
          content: function() {
            var num = player.countMark("luanhuomrfz");
            var str1 = "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害";
            var str2 = "对一名其他角色造成" + get.cnNumber(num, true) + "点伤害";
            if (num == 1) {
              player.chooseTarget(get.prompt2("luanhuomrfz"), function(card2, player2, target2) {
                return player2 != target2;
              }).set("ai", function(target2) {
                var player2 = _status.event.player;
                return get.damageEffect(target2, player2, player2);
              });
            } else {
              player.chooseControl(str1, str2).set("ai", function(event2, player2) {
                if (num > 2) return 0;
                return 1;
              });
            }
            if (result.bool && num == 1) {
              result.targets[0].damage();
              event.finish();
              player.logSkill("luanhuomrfz");
            }
            if (result.control == str1 && num > 1) {
              player.storage.luanhuomrfz_damage = true;
              player.chooseTarget(
                [1, num],
                "对至多" + get.cnNumber(num, true) + "名其他角色造成一点伤害",
                function(card2, player2, target2) {
                  return player2 != target2;
                }
              ).set("ai", function(target2) {
                var player2 = _status.event.player;
                return get.damageEffect(target2, player2, player2);
              });
            } else if (result.control == str2 && num > 1) {
              player.storage.luanhuomrfz_damage = false;
              player.chooseTarget("对一名其他角色造成" + get.cnNumber(num, true) + "点伤害", function(card2, player2, target2) {
                return player2 != target2;
              }).set("ai", function(target2) {
                var player2 = _status.event.player;
                return get.damageEffect(target2, player2, player2);
              });
            }
            if (result.bool && !player.storage.luanhuomrfz_damage) {
              result.targets[0].damage(num);
              player.logSkill("luanhuomrfz");
            } else if (result.bool && player.storage.luanhuomrfz_damage) {
              player.logSkill("luanhuomrfz");
              for (var i2 = 0; i2 < result.targets.length; i2++) result.targets[i2].damage(player);
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
      content: function() {
        "step 0";
        var list = [];
        player.getHistory("useCard", function(evt) {
          if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
        });
        if (list.length >= 3) {
          player.chooseBool("【勤研】：是否于本回合结束后额外执行一个回合？");
        } else event.finish();
        if (result.bool) {
          player.insertPhase();
          player.addMark("qingyanmrfz", false);
          player.logSkill("qingyanmrfz");
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
          content: function() {
            player.removeMark("qingyanmrfz", player.countMark("qingyanmrfz"));
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
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
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
      content: function() {
        "step 0";
        var cards2 = player.getExpansions("xuyingmrfz").filter(function(magic) {
          return get.type2(magic) != get.type2(trigger.card);
        });
        if (cards2.length) player.chooseButton(["你可以选择移去一张与你使用的牌类型不同的“虚影”，令此牌结算两次", cards2]);
        else event.finish();
        if (result.bool) {
          player.logSkill("xuyingmrfz");
          player.loseToDiscardpile(result.links);
          player.addTempSkill("xuyingmrfz_buff", "phaseUseAfter");
          trigger.xuyingmrfz_buff = player;
        }
      },
      group: ["xuyingmrfz_discard", "xuyingmrfz_judge"],
      subSkill: {
        discard: {
          audio: 2,
          trigger: { global: "loseAfter" },
          filter: function(event2, player2) {
            if (event2.type != "discard" || event2.getlx === false) return false;
            if (player2.getExpansions("xuyingmrfz").length >= 3) return false;
            var cards2 = event2.cards.slice(0);
            event2.getl(player2);
            for (var i2 = 0; i2 < cards2.length; i2++) {
              if (cards2[i2].original != "j" && get.suit(cards2[i2], event2.player) == "spade" && get.position(cards2[i2], true) == "d") {
                return true;
              }
            }
            return false;
          },
          direct: true,
          content: function() {
            "step 0";
            if (trigger.delay == false) game.delay();
            var cards2 = [], cards22 = trigger.cards.slice(0);
            trigger.getl(player);
            var num = player.getExpansions("xuyingmrfz").length;
            for (var i2 = 0; i2 < cards22.length; i2++) {
              if (cards22[i2].original != "j" && get.suit(cards22[i2], trigger.player) == "spade" && get.position(cards22[i2], true) == "d") {
                cards2.push(cards22[i2]);
              }
            }
            if (cards2.length && num + cards2.length <= 3) {
              player.chooseButton(["虚影：选择置于武将牌上的牌", cards2], [1, cards2.length]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              });
            } else if (cards2.length) {
              player.chooseButton(["虚影：选择置于武将牌上的牌", cards2], [1, 3 - num]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              });
            }
            if (result.bool && result.links.length) {
              player.logSkill("xuyingmrfz");
              player.addToExpansion(result.links, player, "giveAuto").gaintag.add("xuyingmrfz");
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
          content: function() {
            "step 0";
            var card2 = trigger.cards.length;
            var num = player.getExpansions("xuyingmrfz").length;
            if (card2 + num <= 3)
              player.chooseButton(["虚影：选择置于武将牌上的牌", trigger.cards], [1, card2]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              });
            else
              player.chooseButton(["虚影：选择置于武将牌上的牌", trigger.cards], [1, 3 - num]).set("ai", function(button) {
                return get.value(button.link, _status.event.player, "raw");
              });
            if (result.bool && result.links.length) {
              player.logSkill("xuyingmrfz");
              player.addToExpansion(result.links, player, "giveAuto").gaintag.add("xuyingmrfz");
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
            return event2.parent.xuyingmrfz_buff == player2 && event2.targets.length == event2.parent.triggeredTargets4.length;
          },
          content: function() {
            trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
            trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
            player.removeSkill("xuyingmrfz_buff");
          },
          onremove: true
        }
      }
    },
    xuegemrfz: {
      audio: 2,
      trigger: { player: "damageEnd" },
      filter: function(event2, player2) {
        return game.hasPlayer(function(target2) {
          return target2 != player2 && player2.inRange(target2);
        });
      },
      check: function(event2, player2) {
        return game.hasPlayer(function(target2) {
          return target2 != player2 && get.attitude(player2, target2) < 2 && player2.inRange(target2);
        });
      },
      content: function() {
        "step 0";
        player.chooseTarget("请选择【血歌】的目标", "对一名你的攻击范围内其他角色造成一点伤害", true, function(card2, player2, target2) {
          return target2 != player2 && player2.inRange(target2);
        }).ai = function(target2) {
          return -get.attitude(player, target2);
        };
        if (result.bool) {
          player.line(result.targets);
          result.targets[0].damage();
          if (result.targets[0].hp > player.hp || player.getExpansions("xuyingmrfz").length >= 3) event.finish();
        }
        if (player.countCards("he") && player.getExpansions("xuyingmrfz").length < 3) {
          player.chooseCard("你可以将一张牌置于武将牌上作为“虚影”", "he");
        } else {
          event.finish();
        }
        if (result.cards && result.cards.length) {
          player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("xuyingmrfz");
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
      content: function() {
        player.draw();
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
        return lib.skill.huanshimrfz.getNum() > 0 && game.hasPlayer(function(target2) {
          return target2 != player2 && !player2.hasSkill("huanshimrfz_buff1");
        });
      },
      content: function() {
        var num = lib.skill.huanshimrfz.getNum();
        player.chooseTarget(
          get.prompt("huanshimrfz"),
          "你可以选择至多" + get.cnNumber(num) + "名角色令其下个回合内：①其使用的第一张【杀】指定目标时，取消之，然后其获得这张【杀】。",
          [1, num],
          function(card2, player2, target2) {
            return target2 != player2 && !player2.hasSkill("huanshimrfz_buff1");
          }
        ).ai = function(target2) {
          return -get.attitude(player, target2);
        };
        if (result.bool) {
          for (var i2 of result.targets) {
            i2.addSkill(["huanshimrfz_buff1", "huanshimrfz_buff2"]);
            player.line(i2);
          }
          player.logSkill("huanshimrfz");
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
          content: function() {
            var cards2 = [];
            for (var i2 = 0; i2 < trigger.cards.length; i2++) {
              if (get.position(trigger.cards[i2], true) == "o") {
                cards2.push(trigger.cards[i2]);
              }
            }
            player.gain(cards2, "gain2");
            trigger.getParent().excluded.addArray(trigger.targets);
            player.addTempSkill("huanshimrfz_tmp", "phaseEnd");
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
          content: function() {
            player.removeSkill("huanshimrfz_buff1");
            player.removeSkill("huanshimrfz_buff2");
          }
        }
      }
    },
    shishimrfz: {
      audio: 2,
      trigger: { player: "drawBegin" },
      filter: function(event2, player2) {
        return event2.getParent("phaseDraw") && event2.getParent("phaseDraw").player == player2 || event2.getParent("phaseUse") && event2.getParent("phaseUse").player == player2;
      },
      content: function() {
        trigger.num += player.countMark("shishimrfz") + 1;
        player.addMark("shishimrfz", false);
      },
      group: "shishimrfz_discard",
      subSkill: {
        discard: {
          direct: true,
          trigger: { player: "phaseDiscardBefore" },
          filter: function(event2, player2) {
            return player2.hasMark("shishimrfz");
          },
          content: function() {
            var num = player.countMark("shishimrfz");
            player.chooseToDiscard(get.prompt("shishimrfz"), "弃置" + get.cnNumber(num) + "张牌", "he", true, num);
            player.removeMark("shishimrfz", num, false);
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
      content: function() {
        player.removeMark("jiemimrfz", player.countMark("jiemimrfz"));
      },
      group: ["jiemimrfz_cw", "jiemimrfz_zd"],
      subSkill: {
        cw: {
          forced: true,
          trigger: { target: "useCardToTargeted" },
          filter: function(event2, player2) {
            return player2 != _status.currentPhase;
          },
          content: function() {
            "step 0";
            player.addMark("jiemimrfz");
            if (player.countMark("jiemimrfz") % 2 == 1) player.draw(player.countMark("jiemimrfz"));
            else
              player.chooseToDiscard(
                "弃置" + get.cnNumber(player.countMark("jiemimrfz")) + "张手牌",
                player.countMark("jiemimrfz"),
                true,
                "h"
              );
            player.logSkill("jiemimrfz");
          }
        },
        zd: {
          forced: true,
          trigger: { player: "useCardToTargeted" },
          filter: function(event2, player2) {
            if (player2 != _status.currentPhase) return false;
            return event2.target != player2 && event2.targets.length == 1;
          },
          content: function() {
            "step 0";
            player.addMark("jiemimrfz");
            if (player.countMark("jiemimrfz") % 2 == 1)
              player.chooseToDiscard(
                "弃置" + get.cnNumber(player.countMark("jiemimrfz")) + "张手牌",
                player.countMark("jiemimrfz"),
                true,
                "h"
              );
            else player.draw(player.countMark("jiemimrfz"));
            player.logSkill("jiemimrfz");
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
        for (var i2 = 0; i2 < evt.cards2.length; i2++) {
          num += evt.cards2[i2].number;
        }
        return num > player2.hp * 2 && !player2.hasSkill("shihuangmrfz2");
      },
      content: function() {
        var num = 0;
        for (var i2 = 0; i2 < trigger.cards.length; i2++) {
          num += trigger.cards[i2].number;
        }
        player.addSkill("shihuangmrfz2");
        player.gain(trigger.cards, "gain2", "log");
      }
    },
    shihuangmrfz2: {
      direct: true,
      silent: true,
      charlotte: true,
      trigger: { global: "phaseEnd" },
      content: function() {
        player.removeSkill("shihuangmrfz2");
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
      content: function() {
        trigger.player.damage();
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
          for (var i2 = 0; i2 < game.players.length; i2++) {
            if (game.players[i2].isOut() || game.players[i2] == player2) continue;
            if (game.players[i2].storage.nanjiaomrfz && game.players[i2].storage.nanjiaomrfz != 0) {
              var target2 = game.players[i2];
              break;
            }
          }
          return "你的手牌上限" + (player2.storage.nanjiaomrfz > 0 ? "+" : "") + Math.floor(player2.storage.nanjiaomrfz / 2) + "</br>" + get.translation(target2) + "的手牌上限" + (target2.storage.nanjiaomrfz > 0 ? "+" : " ") + Math.floor(target2.storage.nanjiaomrfz / 2);
        }
      },
      audio: 2,
      trigger: { global: "roundStart" },
      forced: true,
      content: function() {
        game.countPlayer(function(current) {
          if (current.storage.nanjiaomrfz) {
            current.storage.nanjiaomrfz = 0;
            if (current != player) current.removeSkill("nanjiaomrfz_eff");
          }
        });
        if (!player.isMaxHandCardLimit(true)) {
          for (var i2 = 0; i2 < game.players.length; i2++) {
            if (game.players[i2].isOut() || game.players[i2] == player) continue;
            if (game.players[i2].isMaxHandCardLimit()) {
              player.storage.nanjiaomrfz = game.players[i2].getHandcardLimit();
              game.players[i2].storage.nanjiaomrfz = -(game.players[i2].getHandcardLimit() - 1);
              game.players[i2].addSkill("nanjiaomrfz_eff");
              break;
            }
          }
        } else {
          for (var i2 = 0; i2 < game.players.length; i2++) {
            if (game.players[i2].isOut() || game.players[i2] == player) continue;
            if (game.players[i2].isMinHandCardLimit()) {
              game.players[i2].storage.nanjiaomrfz = player.getHandcardLimit();
              player.storage.nanjiaomrfz = -(player.getHandcardLimit() - 1);
              game.players[i2].addSkill("nanjiaomrfz_eff");
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
      content: function() {
        player.loseHp();
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
          content: function() {
            if (player.getDamagedHp() <= player.maxHp / 2) trigger.num += 2;
            else trigger.num++;
            player.logSkill("shunanmrfza");
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
      content: function() {
        "step 0";
        player.awakenSkill(event.name);
        player.addSkill(["lvwaimrfz_damage", "lvwaimrfz_ban", "lvwaimrfz_clear", "lvwaimrfz_sha"]);
        player.chooseUseTarget({ name: "sha", isCard: true }, true, "nodistance");
        player.storage.lvwaimrfz = true;
      },
      subSkill: {
        damage: {
          direct: true,
          forced: true,
          trigger: { source: "damageEnd" },
          content: function() {
            player.draw(trigger.num);
            player.recover(trigger.num);
            player.removeSkill("lvwaimrfz_damage");
          }
        },
        ban: {
          direct: true,
          forced: true,
          silent: true,
          trigger: { global: "phaseBegin" },
          content: function() {
            player.removeSkill("lvwaimrfz_ban");
          }
        },
        clear: {
          direct: true,
          silent: true,
          trigger: { player: "shaAfter" },
          content: function() {
            player.removeSkill("lvwaimrfz_clear");
            if (player.hasSkill("lvwaimrfz_damage")) player.removeSkill("lvwaimrfz_damage");
          }
        },
        sha: {
          direct: true,
          silent: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, card2) {
            return event2.card.name == "sha";
          },
          content: function() {
            trigger.directHit.addArray(game.players);
            player.removeSkill("lvwaimrfz_sha");
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
      content: function() {
        player.removeMark("chaoshengmrfz", player.countMark("chaoshengmrfz"));
        if (player.countMark("jianshumrfz") < 15) {
          player.chooseDrawRecover(2, true, function(event2, player2) {
            if (player2.hp == 1 && player2.isDamaged()) return "recover_hp";
            return "draw_card";
          });
        } else {
          player.draw(2);
          player.recover();
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
          content: function() {
            player.addMark("chaoshengmrfz2", 3, false);
            player.removeSkill("chaoshengmrfz_limite");
          }
        },
        gain: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          firstDo: true,
          content: function() {
            if (!player.getStat("damage")) player.addMark("chaoshengmrfz");
            else player.removeMark("chaoshengmrfz", player.countMark("chaoshengmrfz"));
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
      content: function() {
        "step 0";
        player.addMark("jianshumrfz");
        var num = player.countMark("jianshumrfz");
        if (num % 5 == 0) {
          player.logSkill("jianshumrfz");
          if (num == 5 || num == 15) player.removeMark("chaoshengmrfz2");
          if (num == 10) player.addSkill("jianshumrfz_usesha");
          player.addMark("jianshumrfz_time");
          if (num == 5) player.addMark("jianshumrfz_draw");
          player.addMark("jianshumrfz_range");
        }
      },
      group: ["jianshumrfz_time", "jianshumrfz_range", "jianshumrfz_draw"],
      subSkill: {
        time: {
          charlotte: true,
          onremove: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + player2.countMark("jianshumrfz_time");
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
          content: function() {
            trigger.num++;
            player.logSkill("jianshumrfz");
          }
        },
        usesha: {
          direct: true,
          trigger: { player: "phaseUseBegin" },
          content: function() {
            "step 0";
            player.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function(card2, player2, target3) {
              return target3 != player2 && player2.inRange(target3);
            }).ai = function(target3) {
              return -get.attitude(player, target3);
            };
            if (result.bool) {
              var target2 = result.targets[0];
              player.useCard({ name: "sha" }, true, false, target2);
              player.logSkill("jianshumrfz");
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
      content: function() {
        "step 0";
        player.line2(
          game.filterPlayer(function(current) {
            if (current.hasMark("qiulongmrfz")) {
              current.removeMark("qiulongmrfz");
              return true;
            }
          }).concat(result.targets),
          "green"
        );
        player.chooseTarget("你可以选择一名角色，令其获得‘笼’标记", function(card2, player2, target2) {
          return target2 != player2;
        }).ai = function(target2) {
          return get.attitude(player, target2);
        };
        if (result.bool) {
          result.targets[0].addMark("qiulongmrfz");
          player.logSkill("qiulongmrfz");
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
          content: function() {
            player.removeMark("qiulongmrfz");
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
          content: function() {
            var num = trigger.num;
            trigger.player.recover(num);
            player.damage(num, "nosource");
            player.addMark("qiulongmrfz_huan", num * 2);
            player.logSkill("qiulongmrfz");
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
      content: function() {
        trigger.cancel();
      },
      group: "bihumrfz_damage",
      subSkill: {
        damage: {
          forced: true,
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0;
          },
          content: function() {
            player.addMark("qiulongmrfz_huan", trigger.num);
            player.logSkill("bihumrfz");
          }
        }
      },
      ai: {
        nofire: true,
        nothunder: true,
        effect: {
          target: function(card2, player2, target2, current) {
            if (get.tag(card2, "natureDamage")) return "zerotarget";
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
      content: function() {
        for (var i2 of targets) i2.addSkill("polongmrfz");
        player.storage.shengyumrfz = true;
        player.recover(2);
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
          content: function() {
            "step 0";
            player.addMark("shengyumrfz_cd", false);
            if (player.countMark("shengyumrfz_cd") >= 4) {
              player.storage.shengyumrfz = false;
              player.removeMark("shengyumrfz_cd", player.countMark("shengyumrfz_cd"));
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
      content: function() {
        "step 0";
        var list = [];
        if (player.countMark("polongmrfz_mark1") < 3) list.add("摸牌");
        if (player.countMark("polongmrfz_mark2") < 2) list.add("回血");
        if (player.getDamagedHp() != 0) {
          player.chooseControl(list, "cancel2").set("prompt", get.prompt("polongmrfz")).set("prompt2", "回复一点体力或摸一张牌").ai = function(event2, player2) {
            if (player2.hp == 1 && player2.isDamaged()) return "回血";
            return "摸牌";
          };
        } else {
          event.finish();
          player.draw();
          player.logSkill("polongmrfz");
          player.addMark("polongmrfz_mark1", false);
          game.countPlayer(function(current) {
            current.removeMark("qiulongmrfz_huan");
          });
        }
        if (result.control != "cancel2") {
          game.countPlayer(function(current) {
            current.removeMark("qiulongmrfz_huan");
          });
          player.logSkill("polongmrfz");
          if (result.control == "摸牌") {
            player.draw();
            player.addMark("polongmrfz_mark1", false);
          }
          if (result.control == "回血") {
            player.recover();
            player.addMark("polongmrfz_mark2", false);
          }
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
          content: function() {
            trigger.num--;
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
          content: function() {
            player.removeMark("polongmrfz_mark1", player.countMark("polongmrfz_mark1"));
            player.removeMark("polongmrfz_mark2", player.countMark("polongmrfz_mark2"));
          }
        },
        round: {
          direct: true,
          charlotte: true,
          firstDo: true,
          silent: true,
          trigger: { global: "roundStart" },
          content: function() {
            "step 0";
            player.addMark("polongmrfz_round", false);
            if (player.countMark("polongmrfz_round") > 3) player.removeSkill("polongmrfz");
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
        cardname: function(card2, player2) {
          if (card2.name == "tao") return "sha";
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
      content: function() {
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player;
          })
        );
      },
      ai: {
        directHit_ai: true,
        skillTagFilter(player2, tag, arg) {
          var cards2 = arg.card.cards;
          if (get.name(arg.card) != "sha" || !cards2 || cards2.length != 1) return false;
          if (cards2[0].name != "tao") return false;
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
      content: function() {
        var mark = player.countMark("cangfengmrfz");
        player.addMark("cangfengmrfz", trigger.num, false);
        if (mark / 2 >= 1 && player.getDamagedHp() > 0) {
          player.chooseControl("摸牌", "回血").set("prompt", "摸一张牌或回一点血");
        } else if (mark / 2 < 1) event.finish();
        if (result.control == "回血") player.recover();
        else player.draw();
        player.logSkill("cangfengmrfz");
        player.removeMark("cangfengmrfz", 2);
        if (mark / 2 >= 1) event.goto(1);
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
      content: function() {
        player.removeAdditionalSkill("yuexiangmrfz");
        var list = [];
        if (player.getDamagedHp() >= 3) {
          list.push("yuexiangmrfz_man");
        }
        if (player.getDamagedHp() >= 2) {
          list.push("yuexiangmrfz_xian");
        }
        if (player.getDamagedHp() >= 1) {
          if (trigger.num != void 0 && trigger.num < 0 && player.getDamagedHp() - trigger.num > 1) player.logSkill("yingkuimrfza");
          list.push("yuexiangmrfz_xin");
        }
        if (list.length) {
          player.addAdditionalSkill("yuexiangmrfz", list);
        }
      },
      ai: {
        maixie: true,
        effect: {
          target: function(card2, player2, target2) {
            if (get.tag(card2, "damage")) {
              if (!target2.hasFriend()) return;
              if (target2.hp >= 4) return [0, 1];
            }
            if (get.tag(card2, "recover") && player2.hp >= player2.maxHp - 2) return [0, 0];
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
          content: function() {
            player.storage.yuexiangmrfz_man = false;
            if (player.hasMark("yuexiangmrfz_xin")) {
              player.removeMark("yuexiangmrfz_xin", player.countMark("yuexiangmrfz_xin"));
              player.unmarkSkill("yuexiangmrfz_xin");
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
          content: function() {
            player.storage.yuexiangmrfz_man = true;
          },
          mod: {
            selectTarget: function(card2, player2, range) {
              if (card2.name == "sha" && range[1] != -1 && !player2.storage.yuexiangmrfz_man) range[1]++;
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
            return event2.card.name == "sha" && event2.targets.length == event2.parent.triggeredTargets4.length;
          },
          content: function() {
            trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
            trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
            player.logSkill("yuexiangmrfz");
          }
        },
        xin: {
          group: "yuexiangmrfz_xin2",
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num += Math.floor(player2.countMark("yuexiangmrfz_xin") / 2) + 1;
            }
          },
          intro: {
            content: function(event2, player2) {
              return "本回合使用【杀】的次数+" + (Math.floor(player2.countMark("yuexiangmrfz_xin") / 2) + 1);
            }
          },
          direct: true,
          trigger: { player: "shaAfter" },
          content: function() {
            player.addMark("yuexiangmrfz_xin");
            if (player.countMark("yuexiangmrfz_xin") % 2 == 0) player.logSkill("yuexiangmrfz");
          }
        },
        xin2: {
          direct: true,
          trigger: { source: "damageBegin3" },
          usable: 1,
          filter: function(event2) {
            return event2.card && event2.card.name == "sha";
          },
          content: function() {
            trigger.num++;
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
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      selectTarget: 1,
      filter: function(event2, player2) {
        return player2.countMark("danpaomrfz") > 0 && player2.countCards("he") > 0;
      },
      content: function() {
        "step 0";
        if (player.countCards("h") > 0) player.chooseToDiscard("h", true, player.countCards("h"));
        else player.chooseToDiscard("he", true, player.countCards("he"));
        target.damage();
        if (player.hasMark("shuipaomrfz")) {
          player.removeMark("shuipaomrfz");
          target.addSkill("danpaomrfz_plus");
        } else target.addSkill("danpaomrfz_nor");
        player.removeMark("danpaomrfz");
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
          content: function() {
            player.removeSkill("danpaomrfz_plus");
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
          content: function() {
            player.removeSkill("danpaomrfz_nor");
          }
        },
        damage: {
          forced: true,
          trigger: { global: "useCard" },
          filter: function(event2, player2) {
            return event2.player.hasSkill("danpaomrfz_nor") || event2.player.hasSkill("danpaomrfz_plus");
          },
          content: function() {
            var target2 = trigger.player;
            if (target2.hasSkill("danpaomrfz_nor")) {
              target2.addMark("danpaomrfz_nor");
            } else {
              player.logSkill("danpaomrfz", target2);
              target2.damage("player");
              event.finish();
            }
            if (target2.countMark("danpaomrfz_nor") >= 2) {
              player.logSkill("danpaomrfz", target2);
              target2.damage("player");
              target2.removeMark("danpaomrfz_nor", 2);
            } else event.finish();
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
            for (var i2 = 0; i2 < cardh.length; i2++) {
              if (get.value(cardh[i2]) > 8) return 0.5;
            }
          },
          target: function(player2, target2) {
            return get.damageEffect(target2, player2);
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
        return player2.getEquip(1) && !player2.hasMark("shuipaomrfz") && event2.getParent().name != "danpaomrfz";
      },
      content: function() {
        player.addMark("shuipaomrfz");
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
            return !event2.player.hasMark("shuipaomrfz_j") && event2.player != player2 && event2.getParent().name != "danpaomrfz";
          },
          content: function() {
            if (player.hasMark("shuipaomrfz")) trigger.player.addSkill("shuipaomrfz_j2");
            else trigger.player.addSkill("shuipaomrfz_j3");
            trigger.player.addMark("shuipaomrfz_j");
          }
        },
        j2: {
          charlotte: true,
          forced: true,
          silent: true,
          firstDo: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.removeMark("shuipaomrfz_j");
            player.removeSkill("shuipaomrfz_j2");
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
          content: function() {
            player.removeMark("shuipaomrfz_j");
            player.removeSkill("shuipaomrfz_j3");
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
        canBeDiscarded: function(card2) {
          if (get.position(card2) == "e") return false;
        }
      },
      global: "jiepimrfz2"
    },
    jiepimrfz2: {
      mod: {
        canBeDiscarded: function(card2) {
          if (get.position(card2) == "e" && _status.currentPhase.isAlive() && _status.currentPhase.hasSkill("jiepimrfz")) return false;
        }
      }
    },
    //森蚺
    juezhanmrfz: {
      mod: {
        selectTarget: function(card2, player2, range) {
          if (lib.skill.juezhanmrfz.isJuezhan(card2) && card2.name != "jiedao") range[1] = 1;
        }
      },
      isJuezhan: function(card2) {
        var info = lib.card[card2.name];
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
      content: function() {
        trigger.player.addMark("juezhanmrfz");
        trigger.player.addSkill("juezhanmrfz_ta");
      },
      group: "juezhanmrfz_pl",
      subSkill: {
        ta: {
          mod: {
            playerEnabled: function(card2, player2, target2) {
              if (!target2.hasSkill("juezhanmrfz") && target2 != player2) {
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
          content: function() {
            player.removeMark("juezhanmrfz");
            player.removeSkill("juezhanmrfz_ta");
          }
        },
        pl: {
          mod: {
            playerEnabled: function(card2, player2, target2) {
              if (!target2.hasMark("juezhanmrfz") && target2 != player2 && game.hasPlayer(function(current) {
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
        var cards2 = event2.cards.slice(0);
        var evt = event2.getl(player2);
        if (evt && evt.cards) cards2.removeArray(evt.cards);
        for (var i2 = 0; i2 < cards2.length; i2++) {
          if (cards2[i2].original != "j" && get.type(cards2[i2], event2.player) == "equip" && get.position(cards2[i2], true) == "d") {
            return true;
          }
        }
        return false;
      },
      direct: true,
      content: function() {
        "step 0";
        if (player.countCards("h") >= player.countMark("shanxiemrfz") && player.countMark("shanxiemrfz") > 0) {
          player.chooseToDiscard(
            get.prompt("shanxiemrfz"),
            "你可以弃置" + get.cnNumber(player.countMark("shanxiemrfz")) + "张牌获得此装备牌",
            false,
            player.countMark("shanxiemrfz")
          ).set("ai", function(card2) {
            return 6 - get.value(card2);
          });
        } else if (player.countMark("shanxiemrfz") == 0) event.goto(2);
        if (trigger.delay == false) game.delay();
        if (!result.cards) event.finish();
        var cards2 = [], cards22 = trigger.cards.slice(0), evt = trigger.getl(player);
        if (evt && evt.cards) cards22.removeArray(evt.cards);
        for (var i2 = 0; i2 < cards22.length; i2++) {
          if (cards22[i2].original != "j" && get.type(cards22[i2], trigger.player) == "equip" && get.position(cards22[i2], true) == "d") {
            cards2.push(cards22[i2]);
          }
        }
        event.num = cards2.length;
        if (cards2.length) {
          player.chooseButton(["擅械：请选择获得一张牌", cards2], 1).set("ai", function(button) {
            return get.value(button.link, _status.event.player, "raw");
          });
        }
        if (result.bool) {
          event.num--;
          player.logSkill("shanxiemrfz");
          player.gain(result.links, "gain2", "log");
          player.addMark("shanxiemrfz", false);
          if (event.num > 0) event.goto(0);
        }
      },
      group: ["shanxiemrfz_sha", "shanxiemrfz_usesha", "shanxiemrfz_remove"],
      subSkill: {
        sha: {
          audio: "shanxiemrfz",
          enable: ["chooseToRespond", "chooseToUse"],
          filterCard: function(card2, player2) {
            return get.type(card2) == "equip";
          },
          position: "hes",
          viewAs: { name: "sha" },
          prompt: "将一张装备牌当杀使用或打出",
          check: function(card2) {
            var val = get.value(card2);
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
            return event2.card && event2.card.name == "sha" && event2.player.hasMark("juezhanmrfz") && get.type(event2.cards[0], "equip") == "equip";
          },
          forced: true,
          content: function() {
            trigger.num++;
            player.logSkill("shanxiemrfz");
          }
        },
        remove: {
          silent: true,
          charlotte: true,
          forced: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.removeMark("shanxiemrfz", player.countMark("shanxiemrfz"));
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
      check: function(card2) {
        return 6 - get.value(card2) && get.name(card2) != "sha" && get.type(card2) != "equip";
      },
      init: function(player2) {
        player2.storage.tieyimrfz = false;
      },
      filter: function(event2, player2) {
        return !player2.storage.tieyimrfz;
      },
      content: function() {
        "step 0";
        player.awakenSkill(event.name);
        player.node.avatar.setBackgroundImage("extension/WhichWay/image/skill/senrantieyumrfz.jpg");
        player.node.name.innerHTML = get.translation("senrantieyumrfz");
        player.draw(cards.length * 2);
        player.recover(2);
        player.turnOver();
        player.storage.tieyimrfz = true;
        if (game.hasPlayer((current) => {
          return current != player && !current.hasMark("juezhanmrfz");
        }))
          player.chooseTarget(true, function(card2, player2, target3) {
            return target3 != player2 && !target3.hasMark("juezhanmrfz");
          }).ai = function(target3) {
            return -get.attitude(player, target3);
          };
        else event.goto(3);
        if (result.bool) {
          var target2 = result.targets[0];
          target2.addSkill("juezhanmrfz_ta");
          target2.addMark("juezhanmrfz");
        }
        player.addTempSkill("tieyimrfz_use");
        player.addTempSkill("tieyimrfz_discard");
        player.addSkill("tieyimrfz_back");
      },
      intro: {
        content: "limited"
      },
      subSkill: {
        back: {
          charlotte: true,
          silent: true,
          trigger: { player: ["dying", "phaseEnd"] },
          content: function() {
            player.node.avatar.setBackgroundImage("extension/WhichWay/image/senranmrfz.jpg");
            player.node.name.innerHTML = get.translation("senranmrfz");
            player.removeSkill("tieyimrfz_back");
          }
        },
        discard: {
          forced: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.countCards("h") > 0;
          },
          content: function() {
            player.chooseToDiscard(true, player.countCards("h"));
          }
        },
        use: {
          charlotte: true,
          mod: {
            cardUsableTarget: function(card2, player2, target2) {
              if (target2.hasMark("juezhanmrfz")) return true;
            }
          }
        }
      },
      ai: {
        order: 13,
        threaten: 3,
        expose: 0.9,
        result: {
          target: function(player2, target2) {
            var hs1 = player2.countCards("h", function(card2) {
              return card2.name == "sha";
            });
            var hs2 = player2.countCards("he", function(card2) {
              return get.type(card2) == "equip";
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
      content: function() {
        trigger.cancel();
        var next = trigger.player.phaseUse();
        event.next.remove(next);
        trigger.getParent("phase").next.push(next);
        player.addMark("wusumrfz");
      },
      group: "wusumrfz_draw",
      subSkill: {
        draw: {
          forced: true,
          trigger: { player: "phaseUseBegin" },
          content: function() {
            player.draw();
          }
        }
      },
      ai: {
        effect: {
          target: function(card2, player2, target2, current) {
            if (get.type(card2) == "delay") return "zeroplayertarget";
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
      content: function() {
        trigger.cancel();
      }
    },
    baigeimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "phaseUseEnd" },
      filter: function(event2, player2) {
        return player2.countMark("wusumrfz") >= 5;
      },
      content: function() {
        if (player.countMark("wusumrfz") >= 5) {
          var num = player.countCards("h") - player.getHandcardLimit();
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
            player.logSkill("baigeimrfz");
            player.chooseToDiscard("h", num, true, "弃置" + get.cnNumber(num) + "张手牌");
          }
          player.removeMark("wusumrfz", 5);
          player.chat(chattext);
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
      filterTarget: function(card2, player2, target2) {
        return target2.countCards("he") > 0 && target2 != player2;
      },
      content: function() {
        "step 0";
        player.chooseCard("he", true);
        event.cardp = result.cards[0];
        if (target.countCards("e") > 0) target.chooseCard("e", true);
        else target.chooseCard("h", true);
        if (!result.bool) event.finish();
        else {
          event.cardt = result.cards[0];
        }
        player.swapHandcards(target, [event.cardp], [event.cardt]);
        var numt = target.countCards("h");
        var nump = player.countCards("h");
        if (numt == nump) event.finish();
        if (numt > nump) player.draw();
        else if (nump > numt) target.draw();
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
          content: function() {
            if (game.hasPlayer(function(current) {
              return current.hasMark("shazumrfz");
            })) {
              game.hasPlayer(function(current) {
                return current.removeMark("shazumrfz");
              });
              trigger.source.addMark("shazumrfz");
            } else trigger.source.addMark("shazumrfz");
          }
        }
      },
      ai: {
        threaten: 1.1,
        order: 8,
        result: {
          player: function(player2, target2) {
            if (get.attitude(player2, target2) > 0) return 1.5;
            return 0.5;
          },
          target: function(player2, target2) {
            if (get.attitude(player2, target2) < 2 && target2.countCards("e") > 0 && target2.countCards("h") > player2.countCards("h"))
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
      content: function() {
        "step 0";
        player.chooseTarget(
          true,
          "选择一名与" + get.translation(trigger.player) + "距离为1的角色并对其造成" + (trigger.num - 1) + "点伤害",
          function(card2, player2, target3) {
            var damaged = trigger.player;
            return get.distance(damaged, target3) <= 1 && target3 != damaged && target3 != player2;
          }
        ).ai = function(target3) {
          return -get.attitude(player, target3);
        };
        trigger.num - 1;
        if (result.bool) {
          var target2 = result.targets[0];
          target2.damage("player", trigger.num - 1);
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
          content: function() {
            trigger.num++;
            player.storage.dianlianmrfz = true;
            player.addSkill("dianlianmrfz_remove");
          }
        },
        remove: {
          charlotte: true,
          direct: true,
          silent: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.storage.dianlianmrfz = false;
            player.removeSkill("dianlianmrfz_remove");
          }
        }
      }
    },
    leibaomrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      selectTarget: 1,
      filterTarget: function(card2, player2, target2) {
        if (target2 == player2) return false;
        return !game.hasPlayer(function(current) {
          return current != player2 && current.hp > target2.hp;
        }) || target2.hasMark("shazumrfz");
      },
      filter: function(event2, player2) {
        return player2.getCards("he", function(card2) {
          return get.type(card2) == "equip";
        }).length >= 2 || player2.countCards("h", "shandian");
      },
      content: function() {
        "step 0";
        player.chooseToDiscard("he", true, function(card2, player2) {
          if (player2.getCards("he", function(card3) {
            return get.type(card3) == "equip";
          }).length >= 2)
            return get.type(card2) == "equip" || card2.name == "shandian";
          return card2.name == "shandian";
        }).set("prompt", "请弃置一张【闪电】，或依次弃置两张装备牌。");
        if (result.cards[0].name != "shandian") {
          player.chooseToDiscard("he", true, function(card2, player2) {
            return get.type(card2) == "equip";
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
      content: function() {
        "step 0";
        player.chooseToDiscard("he", get.prompt("zhujimrfz"), "【铸极】:你可以重铸一张牌").set("ai", function(card2) {
          return 6 - get.value(card2);
        });
        if (result.cards) player.draw();
        if (result.cards && get.type(result.cards[0]) == "equip") {
          player.draw();
          player.logSkill("zhujimrfz");
        } else if (result.cards) {
          player.logSkill("zhujimrfz");
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
      content: function() {
        "step 0";
        if (!trigger.source.hasSkill("fengyin")) {
          trigger.source.addTempSkill("fengyin");
        }
        trigger.source.chooseToDiscard(
          "he",
          true,
          "【铜印】:请选择弃置一张非基本或" + get.translation(Math.min(player.getDamagedHp() + 1, 1)) + "张基本牌"
        );
        if (player.getDamagedHp() < 2) event.finish();
        if (result.cards && get.type(result.cards[0]) == "basic") {
          trigger.source.chooseToDiscard(
            true,
            "【铜印】:请选择弃置" + get.translation(player.getDamagedHp() - 1) + "张基本牌",
            [1, player.getDamagedHp() - 1],
            function(card2) {
              return get.type(card2) == "basic";
            }
          ).set("ai", function(card2) {
            return 6 - get.value(card2);
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
      content: function() {
        if (trigger.player.getDamagedHp() > 0) trigger.player.recover();
        else trigger.player.changeHujia();
        trigger.player.addSkill(["tieyumrfz_sha", "tieyumrfz_damage", "tieyumrfz_clear"]);
        trigger.player.addMark("tieyumrfz");
        player.addMark("tieyumrfz_clear2", false);
      },
      group: "tieyumrfz_clear2",
      subSkill: {
        sha: {
          charlotte: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + player2.countMark("tieyumrfz");
            }
          }
        },
        damage: {
          direct: true,
          trigger: { player: "damageBegin3" },
          filter: function(event2, player2) {
            return event2.num > 1 && player2.countMark("tieyumrfz_damage") < player2.countMark("tieyumrfz");
          },
          content: function() {
            trigger.num = 1;
            player.logSkill("tieyumrfz");
            player.addMark("tieyumrfz_damage");
          }
        },
        clear: {
          silent: true,
          direct: true,
          charlotte: true,
          firstDo: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.removeSkill("tieyumrfz_damage");
            player.removeSkill("tieyumrfz_sha");
            player.removeSkill("tieyumrfz_clear");
            player.removeMark("tieyumrfz", player.countMark("tieyumrfz"));
            player.removeMark("tieyumrfz_damage", player.countMark("tieyumrfz_damage"));
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
          content: function() {
            player.removeMark("tieyumrfz_clear2", player.countMark("tieyumrfz_clear2"));
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
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
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
        }).length && player2.hasCard(function(card2) {
          return get.type(card2) == "equip";
        }).length)
          return true;
        if (player2.countCards("h") < 3 && player2.getExpansions("shixingmrfz").length) return false;
        return true;
      },
      content: function() {
        "step 0";
        if (player.getExpansions("shixingmrfz").length <= 1 && player.getExpansions("shixingmrfz").length)
          player.chooseControl("弃置", "增加").set("prompt", "选择弃置所有置于武将牌上的牌或往武将牌上放置牌").set("ai", function(event2, player2) {
            var num = Math.random();
            if (player2.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "equip";
            }).length && player2.countCards("h") < 4)
              return 1;
            if (num <= 0.6) return 0;
            return 1;
          });
        else if (player.getExpansions("shixingmrfz").length == 0) event.goto(4);
        if (result.control == "弃置" || player.getExpansions("shixingmrfz").length > 1) {
          event.num = 0;
          if (player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "basic";
          }).length)
            player.gain(
              get.cardPile(function(card2) {
                return get.type(card2) == "basic";
              }),
              "gain2"
            );
          if (player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "equip";
          }).length) {
            event.num++;
            player.chooseTarget("【诗型】:弃置一名其他角色的一张牌", false, function(card2, target2, player2) {
              return target2 != player2;
            }).ai = function(target2) {
              return -get.attitude(_status.event.player, target2);
            };
          }
          if (player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == "trick";
          }).length) {
            player.draw();
            player.recover();
          }
        }
        if (result.control == "增加") event.goto(4);
        if (result.bool && event.num == 1) {
          player.discardPlayerCard(result.targets[0], "he", true);
        }
        player.loseToDiscardpile(player.getExpansions("shixingmrfz"));
        if (!player.getExpansions("shixingmrfz").length || player.hasCard(function(card2) {
          return player.getExpansions("shixingmrfz").filter(function(magic) {
            return get.type2(magic) == get.type2(card2);
          }).length;
        }, "he"))
          player.chooseCard("he", "依次将最多两张牌至于武将牌上", function(card2, player2) {
            if (player2.getExpansions("shixingmrfz").length)
              return player2.getExpansions("shixingmrfz").filter(function(magic) {
                return get.type2(magic) == get.type2(card2);
              }).length;
            return true;
          });
        else event.finish();
        if (result.cards && result.cards.length) {
          player.addToExpansion(result.cards, player, "giveAuto").gaintag.add("shixingmrfz");
        }
        if (result.cards && player.getExpansions("shixingmrfz").length < 1) event.goto(4);
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
          content: function() {
            var cards2 = player.getExpansions("shixingmrfz");
            if (cards2.length) player.chooseButton(["选择移去一张“清平”", cards2], true);
            else event.finish();
            if (result.bool) player.loseToDiscardpile(result.links);
            trigger.num--;
            player.popup("清平");
            game.log(player, "移去了一张‘清平’");
            event.card = get.cardPile(function(card2) {
              return get.type(card2) == "basic";
            });
            if (player.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "basic";
            }).length < 1)
              player.gain(event.card, "gain2");
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
          content: function() {
            trigger.num += 2;
            player.popup("弦惊");
          },
          mod: {
            maxHandcard: function(player2, num) {
              if (player2.getExpansions("shixingmrfz").filter(function(magic) {
                return get.type2(magic) == "equip";
              }).length)
                return num + 2;
            },
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha" && player2.getExpansions("shixingmrfz").filter(function(magic) {
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
                filterTarget: function(card2, player3, target2) {
                  return target2 != player3 && player3.inRange(target2);
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
          contentx: function() {
            var card2 = lib.skill.shixingmrfz_trick_backup.card;
            player.addTempSkill("shixingmrfz_damage", "shaEnd");
            player.addTempSkill("shixingmrfz_sha", "useCardAfter");
            player.useCard({ name: "sha", isCard: true }, true, target);
            game.log(player, "视为对", target, "使用【杀】");
            player.logSkill("shixingmrfz");
            if (!player.storage.shixingmrfz_damage) {
              player.loseToDiscardpile(card2);
            } else {
              player.gain(card2, "gain2");
              player.storage.shixingmrfz_damage = false;
            }
            if (player.getExpansions("shixingmrfz").filter(function(magic) {
              return get.type2(magic) == "trick";
            }).length < 1) {
              player.recover();
              player.draw();
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
          content: function() {
            player.storage.shixingmrfz_damage = true;
          }
        },
        sha: {
          direct: true,
          silent: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          content: function() {
            if (trigger.addCount !== false) {
              trigger.addCount = false;
              player.getStat().card.sha--;
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
      content: function() {
        "step 0";
        player.awakenSkill(event.name);
        player.storage.zuimengmrfz = true;
        player.chooseToUse(
          true,
          function(card2, player2, event2) {
            return get.name(card2) == "jiu";
          },
          "使用一张【酒】"
        );
        event.num = 0;
        if (event.num < game.countPlayer()) {
          event.num++;
          player.chooseTarget(
            true,
            "【醉梦" + event.num + "/" + game.countPlayer() + "】：选择一名角色，获得其区域内一张牌",
            function(card2, player2, target3) {
              return target3.countMark("zuimengmrfz_remove") < 2;
            }
          ).set("ai", function(target3) {
            var player2 = _status.event.player;
            var att = get.attitude(player2, target3);
            if (att < 0) {
              att = -Math.sqrt(-att);
            } else {
              att = Math.sqrt(att);
            }
            return att * lib.card.shunshou.ai.result.target(player2, target3);
          });
        } else {
          if (player.countCards("h") < game.countPlayer()) player.drawTo(game.countPlayer());
          event.finish();
          event.getParent("phaseUse").skipped = true;
          player.addTempSkill("zuimengmrfz_skip");
        }
        if (result.bool) {
          var target2 = result.targets[0];
          if (!target2.hasSkill("zuimengmrfz_remove")) target2.addTempSkill("zuimengmrfz_remove");
          player.gainPlayerCard("hej", target2, true);
          target2.addMark("zuimengmrfz_remove", false);
          event.goto(1);
        }
      },
      subSkill: {
        remove: {
          silent: true,
          direct: true,
          charlotte: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            player.removeMark("zuimengmrfz_remove", player.countMark("zuimengmrfz_remove"));
          }
        },
        skip: {
          direct: true,
          charlotte: true,
          silent: true,
          trigger: { player: "phaseDiscardBefore" },
          content: function() {
            trigger.cancel();
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
      content: function() {
        player.recover();
      },
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "jiu") return Infinity;
        }
      }
    },
    //风笛
    juntongmrfz: {
      audio: 4,
      forced: true,
      trigger: { global: "roundStart" },
      content: function() {
        player.draw(3);
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
          content: function() {
            trigger.cancel();
          }
        },
        sha: {
          audio: "juntongmrfz",
          trigger: { player: "useCard2" },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          content: function() {
            "step 0";
            player.judge(function(card2) {
              var suit = get.suit(card2);
              if (suit == "heart" || suit == "diamond" || suit == "spade") return -4;
              return 0;
            }).judge2 = function(result2) {
              return result2.bool == false ? true : false;
            };
            if (result.suit == "diamond") {
              if (trigger.addCount !== false) {
                trigger.addCount = false;
                player.getStat().card.sha--;
              }
              event.finish();
            }
            if (result.suit == "heart") {
              if (game.hasPlayer(function(current) {
                return !trigger.targets.includes(current) && player.canUse(trigger.card, current);
              }))
                player.chooseTarget(
                  get.prompt("juntongmrfz"),
                  "为" + get.translation(trigger.card) + "增加一个目标",
                  function(card2, player2, target2) {
                    return !_status.event.sourcex.includes(target2) && player2.canUse(_status.event.card, target2);
                  }
                ).set("sourcex", trigger.targets).set("ai", function(target2) {
                  var player2 = _status.event.player;
                  return get.effect(target2, _status.event.card, player2, player2);
                }).set("card", trigger.card);
              else event.finish();
            }
            if (result.suit == "spade") {
              player.draw();
              event.finish();
            }
            if (result.suit == "club") event.finish();
            if (result.targets) {
              trigger.targets.push(result.targets[0]);
              player.logSkill("juntongmrfz", result.targets[0]);
            }
          }
        }
      },
      ai: {
        effect: {
          target: function(card2, player2, target2, current) {
            if (get.type(card2) == "delay") return "zeroplayertarget";
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
      content: function() {
        "step 0";
        player.storage.pochengmrfz = true;
        event.num = 2;
        event.num--;
        trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
        trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
        if (event.num > 0) event.goto(1);
        event.getParent("phaseUse").skipped = true;
        player.addTempSkill("pochengmrfz_one");
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
          content: function() {
            player.addMark("pochengmrfz_clear", false);
            if (player.countMark("pochengmrfz_clear") >= 3) {
              player.storage.pochengmrfz = false;
              player.removeMark("pochengmrfz_clear", player.countMark("pochengmrfz_clear"));
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
          content: function() {
            var isSkillandRemove = function(str, who) {
              if (who.hasSkill(str)) who.removeSkill(str);
            };
            isSkillandRemove("junqimrfz_zhiyu", player);
            isSkillandRemove("junqimrfz_zhiyuan", player);
            isSkillandRemove("junqimrfz_jingong", player);
            isSkillandRemove("butuimrfz", player);
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
          content: function() {
            "step 0";
            player.chooseToDiscard("he", true, [1, 3], "请弃置至多三张牌").set("ai", function(card2) {
              return 6 - get.value(card2);
            });
            if (result.cards)
              player.chooseTarget(true, [1, result.cards.length], "请选择至多" + result.cards.length + "名角色").set("ai", function(target2) {
                return get.attitude(_status.event.player, target2);
              });
            if (result.bool) {
              var min = player.countCards("h"), min_player = player;
              player.logSkill("junqimrfz");
              for (i2 = 0; i2 < result.targets.length; i2++) result.targets[i2].recover();
              for (var i2 of result.targets) {
                if (i2 == player) continue;
                var num = i2.countCards("h");
                if (num < min) {
                  min = num;
                  min_player = i2;
                } else if (num == min) min_player = false;
              }
              if (min_player) min_player.draw();
              else game.delayx();
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
          content: function() {
            player.chooseToDiscard("he", true, "弃置一张牌");
            trigger.num++;
            player.logSkill("junqimrfz", trigger.player);
          },
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + 1;
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
          content: function() {
            "step 0";
            player.draw();
            player.logSkill("junqimrfz", trigger.player);
            if (trigger.player != player) {
              player.chooseCard(true, "he", "交给" + get.translation(trigger.player) + "一张牌").set("ai", function(card2) {
                if (get.position(card2) == "e") return -1;
                if (card2.name == "shan" || card2.name == "tao" || card2.name == "jiu") return 1;
                return 0;
              });
            } else {
              event.finish();
            }
            player.give(result.cards, trigger.player, "give");
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
          content: function() {
            trigger.num++;
          }
        },
        get: {
          audio: "junqimrfz",
          forced: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          content: function() {
            var str1 = "【支援之旗】:与其距离不大于1的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1";
            var str2 = "【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至4张";
            var str3 = "【进攻之旗】:当与你距离不大于2的角色受到伤害后，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1";
            player.chooseControl("支援之旗", "治愈之旗", "进攻之旗").set("choiceList", [str1, str2, str3]).set("ai", function(event2, player2) {
              return [0, 2].randomGet();
            });
            var list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
            for (i = 0; i < 3; i++) {
              if (result.index == i) player.addSkill(list[i]);
            }
            player.removeSkill("junqimrfz_get");
          }
        },
        reget: {
          forced: true,
          trigger: { player: "phaseZhunbeiBegin" },
          content: function() {
            var list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
            player.logSkill("junqimrfz");
            if (game.hasPlayer(function(current) {
              return current.hasSkill("junqimrfz_zhiyuan") || current.hasSkill("junqimrfz_jingong") || current.hasSkill("junqimrfz_zhiyu");
            })) {
              game.countPlayer(function(current) {
                for (i = 0; i < 3; i++) {
                  if (current.hasSkill(list[i]) && current != player) {
                    current.removeSkill(list[i]);
                    player.addSkill(list[i]);
                  }
                }
              });
            }
            player.chooseControl("确定", "cancel2").set("prompt", get.prompt("junqimrfz")).set("prompt2", "是否更换‘军旗’类型");
            if (result.control == "cancel2") event.finish();
            else {
              for (i = 0; i < 3; i++) {
                if (player.hasSkill(list[i])) player.removeSkill(list[i]);
              }
            }
            var str1 = "【支援之旗】:与其距离不大于1的角色受到伤害时，其可摸一张牌，然后交给受伤角色一张牌；摸牌阶段摸牌数+1";
            var str2 = "【治愈之旗】:出牌阶段开始时，其可弃置至多三张牌，然后其选择等量角色，然后其回复一点体力并令其中手牌数最少的角色摸至4张";
            var str3 = "【进攻之旗】:当与你距离不大于2的角色受到伤害后，你可以弃置一张牌，令此伤害+1；使用【杀】的次数+1";
            player.chooseControl("支援之旗", "治愈之旗", "进攻之旗").set("choiceList", [str1, str2, str3]).set("ai", function(event2, player2) {
              var num = Math.random();
              if (player2.hp <= 1) return 1;
              if (num > 0.6) return 2;
              if (num < 0.3) return 0;
              else return [0, 1, 2].randomGet();
            });
            for (i = 0; i < 3; i++) {
              if (result.index == i) player.addSkill(list[i]);
            }
          }
        }
      }
    },
    zhiqimrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      selectTarget: 1,
      filter: function(event2, player2) {
        return player2.hasSkill("junqimrfz_zhiyuan") || player2.hasSkill("junqimrfz_jingong") || player2.hasSkill("junqimrfz_zhiyu");
      },
      content: function() {
        var list = ["junqimrfz_zhiyuan", "junqimrfz_zhiyu", "junqimrfz_jingong"];
        for (i = 0; i < 3; i++) {
          if (player.hasSkill(list[i])) {
            target.addSkill(list[i]);
            player.removeSkill(list[i]);
          }
        }
      },
      group: "junqimrfz_rem",
      ai: {
        order: 1,
        expose: 0.8,
        threaten: 1.1,
        result: {
          target: function(player2, target2) {
            if (get.attitude(player2, target2) < 0) return 0;
            if (get.attitude(player2, target2) > 0) return 1;
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
      content: function() {
        "step 0";
        var list = ["摸一张牌"];
        if (trigger.player.countCards("he") > 0) list.add("弃两张牌并跳过判定阶段");
        trigger.player.chooseControl(list, "cancel2").set("prompt2", get.prompt("butuimrfz")).set("prompt", "请选择一项").set("ai", function() {
          var player2 = _status.event.playerx;
          if (player2.countCards("j") > 0 && player2.countCards("he") > 0) return 1;
          else return 0;
        }).set("playerx", trigger.player);
        if (result.control != "cancel2") {
          if (result.control == "摸一张牌") {
            trigger.player.draw();
            trigger.player.logSkill("butuimrfz");
          } else if (trigger.player.countCards("he") > 0) {
            trigger.player.chooseToDiscard("he", true, "弃置两张牌", 2);
            trigger.player.addTempSkill("butuimrfz_skip", {
              global: "phaseEnd"
            });
            player.logSkill("butuimrfz", trigger.player);
          }
        }
      },
      subSkill: {
        skip: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseJudgeBefore" },
          content: function() {
            trigger.cancel();
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
      content: function() {
        trigger.cancel();
        trigger.player.damage("nosource", trigger.num);
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
          content: function() {
            "step 0";
            player.chooseToDiscard("he", false, 2, "你可以弃置两张牌将此伤害转移给" + get.translation(trigger.source));
            if (result.cards) {
              trigger.cancel();
              trigger.source.damage(trigger.num, trigger.nature);
              player.logSkill("linhuamrfz", trigger.source);
            }
          }
        },
        skip: {
          direct: true,
          trigger: { player: "phaseJudgeBegin" },
          filter: function(event2, player2) {
            return player2.countCards("h") >= 2 && player2.countCards("j");
          },
          content: function() {
            "step 0";
            player.chooseToDiscard("h", false, 2, "你可以弃置两张牌并移动一张你判定区内的一张牌").set("ai", function(card3) {
              return 6 - get.value(card3);
            });
            if (result.cards) {
              var card2 = player.getCards("j");
              player.chooseButton(["将你判定区的一张牌移动至一名角色的判定区", card2]);
            } else event.finish();
            if (result.cards) {
              event.card = result.links[0];
              player.chooseTarget(true, "选择" + get.translation(event.card) + "的移动目标", function(card3, player2, target3) {
                return target3 != player2 && target3.canAddJudge(event.card);
              });
            } else event.finish();
            if (result.bool) {
              var target2 = result.targets[0];
              player.$give(event.card, target2);
              game.delayx();
              player.logSkill("linhuamrfz");
              var name = card2.viewAs || card2.name;
              if (event.card.name != name) {
                target2.addJudge(name, event.card);
              } else {
                target2.addJudge(card2);
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
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && !target2.hasSkill("mingshimrfz2");
      },
      selectTarget: 1,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      content: function() {
        "step 0";
        player.chooseCard("he", "请选择一张牌交给" + get.translation(target), true).set("ai", function(card2) {
          return 6 - get.value(card2);
        });
        player.addTempSkill("mingshimrfz2");
        if (result.cards) {
          player.give(result.cards, target);
          target.addTempSkill("mingshimrfz2");
          player.line(target);
        }
        player.viewHandcards(target);
        game.log(player, "观看了", target, "的手牌");
        if (target.countCards("h") > 3) {
          player.discardPlayerCard(target, "h", [1, 3]).set("forceAuto", true);
          target.addSkill("mingshimrfz_draw1");
          event.finish();
        } else {
          player.chooseControl("令其摸一张", "令其摸两张").set("prompt", "【明事】:请选择一项").set("prompt2", "你可以令其摸[2/1]张牌,然后于下一个准备阶段弃置[1/2]张牌").set("ai", function() {
            var att = get.attitude(target, player);
            if (att > 0) return 1;
            return 0;
          });
        }
        if (result.index == 0) {
          target.draw();
          target.addSkill("mingshimrfz_dis2");
        } else {
          target.draw(2);
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
          content: function() {
            player.draw();
          }
        },
        draw1: {
          direct: true,
          charlotte: true,
          trigger: { player: "phaseJieshuBegin" },
          content: function() {
            player.draw();
            player.removeSkill("mingshimrfz_draw1");
          }
        },
        dis1: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return player2.countCards("he") > 0;
          },
          content: function() {
            player.chooseToDiscard("he", true, "【明事】:弃置一张牌");
            player.removeSkill("mingshimrfz_dis1");
          }
        },
        dis2: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            return player2.countCards("he") > 0;
          },
          content: function() {
            player.chooseToDiscard("he", true, 2, "【明事】:弃置两张牌");
            player.removeSkill("mingshimrfz_dis2");
          }
        }
      },
      ai: {
        order: 1,
        expose: 0.2,
        threaten: 1.2,
        result: {
          target: function(player2, target2) {
            var att = get.attitude(player2, target2);
            if (att > 0 && target2.countCards("h") < 3) return 1;
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
      content: function() {
        "step 0";
        trigger.player.judge(function(card2) {
          var color = get.color(card2);
          if (color == "black") return 4;
          return -4;
        });
        trigger.player.removeMark("jixiongxmrfz");
        if (result.color == "black") {
          trigger.player.chooseToDiscard("he", true, "【吉凶】:请弃置一张牌");
          trigger.player.loseHp();
        }
        if (trigger.player.hasMark("jixiongxmrfz")) event.goto(0);
        else event.finish();
        if (result.cards) player.gain(result.cards, "gain2");
        if (trigger.player.hasMark("jixiongxmrfz")) event.goto(0);
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
      content: function() {
        "step 0";
        player.chooseControl("确定", "取消").set("prompt", "是否发动【吉凶】？").set("ai", function() {
          var att = get.attitude(trigger.source, player);
          if (att > 0) return 1;
          return 0;
        });
        if (result.control == "确定") {
          trigger.player.addMark("jixiongxmrfz");
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
      content: function() {
        player.loseHp();
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
          content: function() {
            "step 0";
            player.storage.guaijiemrfz = true;
            player.addSkill("guaijiemrfz_remove");
            player.chooseTarget(true, "弃置一名角色区域内的一张牌", function(card2, player2, target3) {
              return target3.countCards("hej") > 0;
            }).set("ai", function(target3) {
              var player2 = _status.event.player;
              var att = get.attitude(player2, target3);
              if (att < 0) {
                att = -Math.sqrt(-att);
              } else {
                att = Math.sqrt(att);
              }
              return att * lib.card.guohe.ai.result.target(player2, target3);
            });
            if (result.bool) {
              var target2 = result.targets[0];
              player.discardPlayerCard(target2, "hej", true);
            }
          }
        },
        remove: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.storage.guaijiemrfz = false;
            player.removeSkill("guaijiemrfz_remove");
          }
        }
      }
    },
    qizhenmrfz: {
      audio: 2,
      enable: "phaseUse",
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      selectTarget: 1,
      usable: 1,
      content: function() {
        "step 0";
        if (target.countCards("he") == 0) {
          event.goto(2);
          target.damage();
        } else {
          var str1 = "令" + get.translation(target) + "弃置两张牌";
          var str2 = "对" + get.translation(target) + "造成一点伤害";
          player.chooseControl(str1, str2).set("prompt", "【奇针】:请选择一项").set("ai", function(target2) {
            if (target2.hp > 2 && target2.countCards("he") < 4) return 1;
            return 0;
          });
        }
        if (result.index == 0) target.chooseToDiscard("he", true, 2, "【奇针】:请弃置两张牌");
        else target.damage();
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
          content: function() {
            trigger.baseDamage++;
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
      content: function() {
        var target2 = trigger.player;
        var num = Math.random();
        if (num < 0.1) {
          target2.addTempSkill("guaiyaomrfz_skip", {
            player: "phaseEnd"
          });
          player.popup("怪药·跳过");
          game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·跳过】</span>");
        }
        if (num >= 0.1 && num < 0.325) {
          player.getDamagedHp() > 0 ? player.recover(2) : player.changeHujia();
          player.popup("怪药·回复");
          game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·回复】</span>");
        }
        if (num >= 0.325 && num < 0.55) {
          target2.chooseToDiscard("he", true, "【怪药】:请弃置一张牌");
          player.popup("怪药·弃牌");
          game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·弃牌】</span>");
        }
        if (num >= 0.55 && num < 0.775) {
          target2.addTempSkill("guaiyaomrfz_decrease", {
            player: "phaseDrawAfter"
          });
          player.popup("怪药·摸牌减少");
          game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·摸牌减少】</span>");
        }
        if (num >= 0.775) {
          player.draw();
          player.popup("怪药·摸牌");
          game.log(player, "的【怪药】结果为<span class=thundertext>【怪药·摸牌】</span>");
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
          content: function() {
            trigger.cancel();
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
          content: function() {
            trigger.num--;
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
        return (get.distance(player2, event2.player) <= player2.hasSkill("junumrfz_effect") ? 3 : 1) && event2.card && event2.card.name == "sha";
      },
      //QQQ
      content: function() {
        if (get.distance(player, trigger.player) <= player.hasSkill("junumrfz_effect") ? 3 : 1) trigger.num++;
        if (trigger.player.getEquip(2)) trigger.num++;
      },
      group: "heishimrfz_wushi",
      mod: {
        playerEnabled: function(card2, player2, target2) {
          if (!player2.hasSkill("junumrfz_effect") && get.distance(player2, target2) > 2 && card2.name == "sha") return false;
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
          content: function() {
            if (player.hasSkill("heishimrfz")) player.logSkill("heishimrfz");
            trigger.target.addTempSkill("heishimrfz_wushi2");
            trigger.target.storage.heishimrfz_wushi2.add(trigger.card);
            trigger.target.markSkill("heishimrfz_wushi2");
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
          content: function() {
            player.storage.heishimrfz_wushi2.remove(trigger.card);
            if (!player.storage.heishimrfz_wushi2.length) player.removeSkill("heishimrfz_wushi2");
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
      content: function() {
        player.useCard({ name: "sha", isCard: true }, true, trigger.player);
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
      content: function() {
        player.storage.junumrfz = true;
        player.addTempSkill("junumrfz_effect");
        player.awakenSkill(event.name);
      },
      subSkill: {
        effect: {
          mod: {
            targetInRange: function(card2, player2, target2, now) {
              if (card2.name == "sha") return true;
            },
            selectTarget: function(card2, player2, range) {
              if (card2.name == "sha" && range[1] != -1) range[1]++;
            },
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + 1;
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
        return !player2.getEquip(1) && game.hasPlayer(function(target2) {
          return target2 != player2 && player2.inRange(target2);
        });
      },
      content: function() {
        "step 0";
        player.chooseCard("h", "你可以使用一张【杀】").set("ai", function(card2) {
          if (game.hasPlayer(function(current) {
            return current != player && player.inRange(current) && get.attitude(player, current) < 0;
          }))
            return 6 - get.value(card2);
          return 0;
        });
        if (result.cards) {
          player.chooseUseTarget({ name: "sha" }, result.cards, true, false);
          player.logSkill("wubenmrfz");
        }
      },
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha" && !player2.getEquip(1)) return num + 1;
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
      content: function() {
        "step 0";
        player.addMark("wowumrfz", false);
        if (player.countMark("wowumrfz") >= 3 && !player.hasMark("shubianmrfz")) {
          player.chooseTarget(false, get.prompt("wowumrfz"), "你可以对一名其他角色使用一张【杀】", function(card2, player2, target2) {
            return player2.countMark("wowumrfz_time") >= 5 ? target2 != player2 : target2 != player2 && player2.inRange(target2);
          }).ai = function(target2) {
            return -get.attitude(player, target2);
          };
          player.removeMark("wowumrfz", 3, false);
          if (player.countMark("wowumrfz_time") < 5) player.addMark("wowumrfz_time", false);
        } else if (player.countMark("wowumrfz") >= 3) {
          if (player.countMark("wowumrfz_time") < 5) player.addMark("wowumrfz_time", false);
          player.removeMark("wowumrfz", 3, false);
        } else event.finish();
        if (result.bool && result.targets) {
          player.useCard({ name: "sha", isCard: true }, true, false, result.targets);
          player.logSkill("wowumrfz", result.targets);
          if (player.countMark("wowumrfz_time") >= 5) player.draw();
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
          content: function() {
            player.draw();
            player.logSkill("wowumrfz");
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
            cardEnabled2(card2, player2) {
              if (get.position(card2) === "h" && get.tag(card2, "damage")) {
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
        return game.hasPlayer(function(target2) {
          return target2 != player2 && player2.inRange(target2) && target2.countMark("fanzhongmrfz") < 3;
        });
      },
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget(
          get.prompt("fanzhongmrfz"),
          "你可以选择攻击范围内的一名其他角色，令其获得‘反重’标记",
          function(card2, player2, target2) {
            return target2 != player2 && player2.inRange(target2) && target2.countMark("fanzhongmrfz") < 3;
          }
        ).ai = function(target2) {
          return -get.attitude(player, target2);
        };
        if (result.bool && result.targets) {
          result.targets[0].addMark("fanzhongmrfz");
          player.logSkill("fanzhongmrfz", result.targets[0]);
        }
      },
      subSkill: {
        gain: {
          direct: true,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            return player2.hasMark("fanzhongmrfz") && player2.getExpansions("fanzhongmrfz2").length > 0;
          },
          content: function() {
            "step 0";
            var cards2 = player.getExpansions("fanzhongmrfz2");
            if (cards2.length) player.chooseButton(["获得一张牌", cards2], true);
            else event.finish();
            if (result.bool) player.gain(result.links, "gain2");
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
          content: function() {
            var cards2 = player.getExpansions("fanzhongmrfz2");
            if (cards2) player.gain(cards2, "gain2");
            player.removeAllmark("fanzhongmrfz");
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
          content: function() {
            var cards2 = player.getExpansions("fanzhongmrfz2");
            player.removeAllmark("fanzhongmrfz");
            if (cards2) player.loseToDiscardpile(cards2);
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
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      charlotte: true,
      direct: true,
      trigger: { player: "gainEnd" },
      filter: function(event2, player2) {
        if (event2.player.getExpansions("fanzhongmrfz2").length >= 6) return false;
        return player2.hasMark("fanzhongmrfz") && event2.getParent().name != "fanzhongmrfz_gain" && event2.getParent().name != "fanzhongmrfz_gain2";
      },
      content: function() {
        player.addToExpansion(trigger.cards, player, "give").gaintag.add("fanzhongmrfz2");
        player.logSkill("fanzhongmrfz");
      }
    },
    xinshimrfz: {
      mod: {
        ignoredHandcard: function(card2, player2) {
          if (card2.hasGaintag("xinshimrfz")) {
            return true;
          }
        },
        cardDiscardable: function(card2, player2, name) {
          if (name == "phaseDiscard" && card2.hasGaintag("xinshimrfz")) {
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
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && !target2.tempSkills.xinshimrfz2 && !target2.hasMark("xinshimrfz");
      },
      filterCard: function(card2, player2) {
        return !player2.storage.xinshimrfz || !player2.storage.xinshimrfz.includes(get.type(card2, "trick"));
      },
      check: function(card2) {
        return 10 - get.value(card2);
      },
      delay: 0,
      prompt: "你可以将一张本回合你未以此法交出过的类型的牌交给本回合你未以此法选择过的角色",
      content: function() {
        "step 0";
        if (!player.storage.xinshimrfz) player.storage.xinshimrfz = [];
        player.storage.xinshimrfz.push(get.type(cards[0], "trick"));
        player.give(cards, target);
        target.addTempSkill("xinshimrfz2");
        var mark = player.storage.xinshimrfz.length;
        if (mark == 1) {
          player.draw();
          event.finish();
        }
        if (mark == 2) event.goto(3);
        if (mark == 3) {
          event.goto(5);
        }
        if (target.countCards("h") > 0) target.chooseCard("h", true);
        else event.finish();
        if (result.cards) {
          target.give(result.cards, player);
          target.draw();
        }
        event.finish();
        if (player.storage.xinshimrfz.length == 3) {
          player.chooseTarget(true, "【信使】:请选择一名其他角色，令其获得‘反重’标记", function(card2, player2, target2) {
            return target2 != player2 && !target2.hasMark("xinshimrfz");
          }).ai = function(target2) {
            return -get.attitude(player, target2);
          };
          player.logSkill("xinshimrfz");
        } else event.finish();
        if (result.bool && result.targets) {
          result.targets[0].addMark("fanzhongmrfz");
        }
      },
      ai: {
        order: 9,
        expose: 0.2,
        threaten: 1.2,
        result: {
          target: function(player2, target2) {
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
          content: function() {
            player.storage.xinshimrfz = [];
            player.removeGaintag("xinshimrfz");
          }
        },
        give: {
          direct: true,
          trigger: { player: "gainEnd" },
          filter: function(event2, player2) {
            return event2.source;
          },
          logTarget: "source",
          content: function() {
            "step 0";
            if (trigger.cards.length) player.addMark("xinshimrfz_give", trigger.cards.length, false);
            if (player.countMark("xinshimrfz_give") >= 2) {
              player.chooseControl("basic", "trick", "equip", "cancel2").set("prompt", "选择获得一种类型的牌").set("ai", function() {
                var player2 = _status.event.player;
                if (player2.hp <= 3 && !player2.countCards("h", {
                  name: ["shan", "tao"]
                }))
                  return "basic";
                if (player2.countCards("he", {
                  type: "equip"
                }) < 2)
                  return "equip";
                return "trick";
              });
              player.removeMark("xinshimrfz_give", 2, false);
            } else event.finish();
            if (result.control != "cancel2") {
              var card2 = get.cardPile2(function(card3) {
                return get.type(card3, "trick") == result.control;
              });
              if (card2) player.gain(card2, "gain2", "log").gaintag.add("xinshimrfz");
              player.logSkill("xinshimrfz");
            }
            if (player.countMark("xinshimrfz_give") >= 2) event.goto(1);
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
        return game.countPlayer() <= 4 && game.hasPlayer(function(current) {
          return get.attitude(player2, current) < 0 && get.distance(player2, current) == 1;
        }) || !game.hasPlayer(function(current) {
          return get.attitude(player2, current) >= 0 && current != player2;
        });
      },
      filter: function(event2, player2) {
        return !player2.storage.dunpaomrfz;
      },
      content: function() {
        player.storage.dunpaomrfz = true;
      },
      mod: {
        maxHandcard: function(player2, num) {
          if (player2.storage.dunpaomrfz) return num + 2;
        },
        playerEnabled: function(card2, player2, target2) {
          if (!player2.storage.dunpaomrfz && get.distance(player2, target2) <= 1 && target2 != player2) return false;
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
          content: function() {
            var target2 = trigger.player;
            target2.judge(function(card2) {
              var color = get.color(card2);
              if (color == "black") return -4;
              return 0;
            }).judge2 = function(result2) {
              return result2.bool == false ? true : false;
            };
            if (result.color == "black") trigger.num++;
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
        return player2.countMark("charge") < 4 && player2.hasCard(function(card2) {
          return get.tag(card2, "damage");
        });
      },
      filterCard: function(card2) {
        return get.tag(card2, "damage");
      },
      position: "he",
      check: function(card2) {
        if (card2.name == "sha") return 1;
        if (card2.name == "nanman" || card2.name == "wanjian") return -1;
        return 10 - get.value(card2);
      },
      content: function() {
        player.addMark("charge");
        player.draw();
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
          precontent: function() {
            player.removeMark("charge");
          },
          ai: {
            order: function() {
              var player2 = _status.event.player;
              if (!game.hasPlayer(function(current) {
                return player2.canUse("sha", current) && current.hp == 1 && get.effect(current, { name: "sha" }, player2, player2) > 0;
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
          content: function() {
            "step 0";
            player.chooseControl("确定", "取消").set("prompt", get.prompt("biaohaomrfz")).set("prompt2", "你可以消耗4点蓄力值，视为使用三张【杀】和一张【万箭齐发】，然后失去3点体力。");
            if (result.control == "取消") event.finish();
            else {
              player.logSkill("biaohaomrfz");
              player.removeMark("charge", 4);
              event.num = 0;
            }
            event.num++;
            player.chooseUseTarget(
              {
                name: event.num < 4 ? "sha" : "wanjian",
                isCard: true
              },
              "请选择【杀】的目标(【杀】:" + (event.num < 4 ? event.num : 3) + "/3;【万箭齐发】:0/1)",
              false
            );
            player.logSkill("biaohaomrfz");
            if (event.num < 4) event.redo();
            player.loseHp(3);
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
      content: function() {
        player.storage.xuezhanmrfz = true;
        player.chooseToDiscard("hej", true, player.countCards("hej"));
        trigger.cancel();
        game.log(player, "复活");
        if (player.getDamagedHp()) player.recover(player.maxHp);
        if (player.maxHp >= 2) player.loseMaxHp(player.maxHp - 2);
        else player.gainMaxHp(2 - player.maxHp);
        player.draw(4);
        player.link(false);
        player.turnOver(false);
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
      content: function() {
        player.addMark("fengjianmrfz");
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
          content: function() {
            var cards2 = trigger.card;
            player.removeMark("fengjianmrfz");
            if (cards2.name == "tao" && player.getDamagedHp() > 0 || cards2.name != "shan") {
              player.chooseUseTarget(cards2, false, get.prompt2("fengjianmrfz"), "你可以使用一张" + get.translation(cards2));
              player.logSkill("fengjianmrfz");
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
        for (var i2 = 0; i2 < game.players.length; i2++) {
          if (game.players[i2].hasMark("hongsongmrfz")) num += game.players[i2].countMark("hongsongmrfz");
        }
        if (!event2.respondTo) return false;
        return num < 3;
      },
      content: function() {
        player.addMark("hongsongmrfz");
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
          content: function() {
            "step 0";
            trigger.player.chooseControl("确定", "取消").set("prompt", get.prompt("hongsongmrfz")).set("prompt2", "你可以进行判定，若不为♥，其视为使用或打出一张【闪】并获得判定牌");
            if (result.control == "确定") {
              trigger.player.judge(function(card2) {
                return get.suit(card2) == "heart" ? -0.5 : 1.5;
              }).set("callback", lib.skill.hongsongmrfz_shan.callback).judge2 = function(result2) {
                return result2.bool;
              };
            } else event.finish();
            if (result.judge > 0) {
              trigger.untrigger();
              trigger.set("responded", true);
              trigger.result = {
                bool: true,
                card: { name: "shan", isCard: true }
              };
              if (trigger.player != player) trigger.player.removeMark("hongsongmrfz");
            }
          },
          callback: function() {
            if (get.suit(card) != "heart") player.gain(card, "gain2");
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
          content: function() {
            "step 0";
            player.chooseTarget(
              get.prompt("hongsongmrfz"),
              "你可以将任意个‘红松’标记交给任意名其他角色",
              function(card2, player2, target3) {
                return target3 != player2;
              }
            ).ai = function(target3) {
              return get.attitude(player, target3) > 0;
            };
            if (result.bool && result.targets) {
              var target2 = result.targets[0];
              target2.addMark("hongsongmrfz");
              player.removeMark("hongsongmrfz");
              player.logSkill("hongsongmrfz", target2);
              if (player.hasMark("hongsongmrfz")) event.goto(0);
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
      content: function() {
        player.markAuto("huijuanmrfz", [trigger.card.name]);
        if (get.type(trigger.card) == "trick") player.addSkill("huijuanmrfz_trick");
        if (get.type(trigger.card) == "delay") player.addSkill("huijuanmrfz_delay");
        if (get.type(trigger.card) == "basic") player.addSkill("huijuanmrfz_basic");
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
          content: function() {
            player.removeSkill("huijuanmrfz_basic");
          }
        },
        trick: {
          silent: true,
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.removeSkill("huijuanmrfz_trick");
          }
        },
        delay: {
          silent: true,
          direct: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.removeSkill("huijuanmrfz_delay");
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
          content: function() {
            for (var i2 = 0; i2 < 2; i2++) player.unmarkAuto("huijuanmrfz", [player.getStorage("huijuanmrfz")[0]]);
          }
        },
        use: {
          hiddenCard: function(player2, name) {
            if (name == "wuxie") return player2.getStorage("huijianmrfz").includes(name);
          },
          enable: ["chooseToRespond", "chooseToUse"],
          filter: function(event2, player2) {
            if (player2.getStorage("huijuanmrfz").length == 0 || player2.countCards("h") == 0) return false;
            for (var i2 = 0; i2 < player2.getStorage("huijuanmrfz").length; i2++) {
              if (event2.filterCard(
                {
                  name: player2.getStorage("huijuanmrfz")[i2]
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
              for (var i2 of lib.inpile) {
                if (event2.filterCard({ name: i2 }, player2, event2) && storage.includes(i2))
                  list.push([get.type(i2) == "basic" ? "基本" : "锦囊", "", i2]);
              }
              return ui.create.dialog("绘卷", [list, "vcard"], "hidden");
            },
            filter: function(button, player2) {
              return lib.filter.cardEnabled(
                {
                  name: button.link[2]
                },
                player2,
                _status.event.getParent()
              );
            },
            check: function(button) {
              var player2 = _status.event.player;
              var card2 = {
                name: button.link[2]
              };
              if (player2.getUseValue(card2) > 0) return get.order(card2);
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
                check: function(card2) {
                  return 6 - get.value(card2);
                },
                precontent: function() {
                  var cards2 = event.result.card;
                  if (cards2.name == "sha" || cards2.name == "jiu") event.getParent().addCount = false;
                  player2.unmarkAuto("huijuanmrfz", [cards2.name]);
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
      content: function() {
        var cardt = get.cardPile2(function(card2) {
          return get.type(card2, "trick") == get.type(trigger.card);
        });
        var cardf = get.cardPile2(trigger.card.name);
        if (player.storage.dianjingmrfz == true) {
          if (cardt) player.gain(cardt, "gain2", "log");
          else player.chat("牌堆中没有", cardt, "牌");
        } else {
          if (cardf) player.gain(cardf, "gain2", "log");
          else player.chat("牌堆中没有【" + get.translation(trigger.card.name) + "】");
        }
        player.changeZhuanhuanji("dianjingmrfz");
      }
    },
    cangjuanmrfz: {
      mod: {
        ignoredHandcard: function(card2, player2) {
          if (card2.hasGaintag("cangjuanmrfz")) {
            return true;
          }
        },
        cardDiscardable: function(card2, player2, name) {
          if (name == "phaseDiscard" && card2.hasGaintag("cangjuanmrfz")) return false;
        }
      },
      audio: 2,
      trigger: { player: "gainBegin" },
      filter: function(event2, player2) {
        return player2.countMark("cangjuanmrfz") < 3;
      },
      forced: true,
      content: function() {
        player.addMark("cangjuanmrfz", false);
        trigger.gaintag.add("cangjuanmrfz");
      },
      group: "cangjuanmrfz_remove",
      subSkill: {
        remove: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.removeMark("cangjuanmrfz", 3);
            player.removeGaintag("cangjuanmrfz");
          }
        }
      }
    },
    //能天使
    lianshemrfz: {
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return player2.maxHp;
        }
      },
      audio: 2,
      trigger: { player: "useCard" },
      forced: true,
      firstDo: true,
      filter: function(event2, player2) {
        return !event2.audioed && event2.card.name == "sha" && event2.getParent().type == "phase";
      },
      content: function() {
        trigger.audioed = true;
      }
    },
    guozaimrfz: {
      audio: 4,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.getCardUsable("sha") > 0;
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      content: function() {
        "step 0";
        var cards2 = game.cardsGotoOrdering(get.cards(player.maxHp + 1)).cards;
        event.cards = cards2;
        event.cards2 = [];
        event.cards3 = [];
        event.num = 0;
        if (!player.canUse("sha", target, false)) event.finish();
        for (var i2 = 0; i2 < event.cards.length; i2++) {
          if (event.cards[i2].name == "sha") {
            event.cards2.push(event.cards[i2]);
            event.num++;
          } else event.cards3.push(event.cards[i2]);
        }
        game.cardsGotoOrdering(event.cards);
        player.showCards(event.cards, get.translation(player) + "发动了【过载】");
        if (event.cards2.length == 0 || !target.isAlive()) event.goto(2);
        var cards2 = event.cards2[event.num - 1];
        player.showCards(cards2, get.translation(player) + "发动了【过载】");
        event.num--;
        player.logSkill("guozaimrfz", target);
        if (target.isAlive())
          player.chooseUseTarget(cards2, true, "nodistance").set("filterTarget", function(card2, player2, target2) {
            var evt = _status.event;
            if (_status.event.name == "chooseTarget") evt = evt.getParent();
            if (target2 != player2 && target2 != evt.guozaimrfz_target) return false;
            return lib.filter.targetEnabledx(card2, player2, target2);
          }).set("guozaimrfz_target", target);
        if (event.num > 0 && target.isAlive() && player.getCardUsable("sha") > 0) event.redo();
        if (event.cards3.length > 0)
          player.chooseButton(["过载:你可以获得一张牌", event.cards3]).set("ai", function(button) {
            return get.value(button.link, _status.event.player);
          });
        if (result.links) player.gain(result.links, "gain2");
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
      content: function() {
        var target2 = trigger.targets[0], source = trigger.player;
        if (target2 == player)
          player.chooseControl("确定", "cancel2").set("prompt", get.prompt("yuanmengmrfz")).set("prompt2", "你可以对" + get.translation(source) + "使用【杀】").set("ai", function(player2, target3) {
            var player2 = _status.event.player, target3 = _status.event.getTrigger().player;
            _status.event.getTrigger().source;
            if (get.attitude(player2, target3) > 2) return 1;
            return 0;
          });
        else event.goto(2);
        if (result.index == 0) {
          if (player.hasSha()) {
            player.chooseToUse(true, function(card2, player2, event2) {
              if (get.name(card2) != "sha") return false;
              return lib.filter.cardEnabled.apply(this, arguments);
            }).set("complexSelect", true).set("filterTarget", function(card2, player2, target3) {
              if (target3 != _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
              return lib.filter.targetEnabled.apply(this, arguments);
            }).set("targetx", source);
            player.logSkill("yuanmengmrfz", source);
            player.draw();
          }
          event.finish();
        } else event.finish();
        var next = player.chooseControl(get.translation(target2), get.translation(source), "cancel2").set("prompt", get.prompt("yuanmengmrfz")).set("prompt2", "你可以对其中一名角色使用【杀】");
        next.set("ai", function() {
          var player2 = _status.event.player, target3 = _status.event.getTrigger().player, source2 = _status.event.getTrigger().source;
          if (get.attitude(player2, target3) < 2) return 1;
          if (get.attitude(player2, source2) < 2) return 0;
          return 2;
        });
        if (result.index != 2) {
          var resulty = result.index == 1 ? target2 : source, resultx = result.index == 0 ? target2 : source;
          if (player.hasSha()) {
            player.chooseToUse(true, function(card2, player2, event2) {
              if (get.name(card2) != "sha") return false;
              return lib.filter.cardEnabled.apply(this, arguments);
            }).set("complexSelect", true).set("filterTarget", function(card2, player2, target3) {
              if (target3 != _status.event.targetx && !ui.selected.targets.includes(_status.event.targetx)) return false;
              return lib.filter.targetEnabled.apply(this, arguments);
            }).set("targetx", result.index == 0 ? target2 : source);
            player.draw();
            resulty.draw();
            player.logSkill("yuanmengmrfz", resultx);
          } else event.finish();
        } else event.finish();
      },
      //subSkill:{
      //discard:{
      //direct:true,
      //charlotte:true,
      //trigger:{player:'shaMiss'},
      //content:function(){
      //	'step 0'
      //	if(player.countCards('h')>0) trigger.targets[0].chooseCard('h',true,'【援盟】:请交给'+get.translation(player)+'一张手牌');
      //	else event.finish();
      //	'step 1'
      //	if(result.cards){
      //		player.logSkill('yuanmengmrfz',trigger.targets[0]);
      //		trigger.targets[0].give(result.cards,player);
      //	}
      //},
      //},
      //},
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
      content: function() {
        "step 0";
        var history = trigger.player.getHistory("useCard");
        if (trigger.player != player)
          for (var i2 = 0; i2 < history.length; i2++) {
            if (!history[i2].targets) continue;
            for (var j = 0; j < history[i2].targets.length; j++) {
              if (history[i2].targets[j] == player) {
                player.removeMark("ningshenmrfz", player.countMark("ningshenmrfz"));
                event.finish();
              }
            }
          }
        player.addMark("ningshenmrfz");
        if (player.countMark("ningshenmrfz") >= 2) {
          player.chooseControl("摸牌", "获得杀").set("prompt", get.prompt("ningshenmrfz")).set("prompt2", "请选择一项").set("ai", function(event2, player2) {
            if (player2.hp <= 2 || player2.hasCard(function(card2) {
              return card2.name == "sha";
            }))
              return 0;
            return 1;
          });
          player.removeMark("ningshenmrfz", player.countMark("ningshenmrfz"));
          player.popup("ningshenmrfz");
          player.logSkill("ningshenmrfz");
        } else event.finish();
        var cards2 = get.cardPile2("sha");
        if (result.index == 0) player.draw();
        else if (cards2) player.gain(cards2, "gain2", "log");
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
          content: function() {
            trigger.baseDamage += player.storage.ningshenmrfz_mark;
            player.storage.ningshenmrfz_mark = 0;
            player.logSkill("ningshenmrfz");
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
          content: function() {
            if (!player.storage.ningshenmrfz_damage) {
              player.logSkill("ningshenmrfz");
              player.storage.ningshenmrfz_mark++;
            } else player.storage.ningshenmrfz_damage = false;
          }
        },
        remove: {
          silent: true,
          charlotte: true,
          popup: false,
          trigger: { player: "damageEnd" },
          content: function() {
            if (!player.storage.ningshenmrfz_damage) player.storage.ningshenmrfz_damage = true;
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
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 4,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.getExpansions("nianshoumrfz").length >= 2) return false;
        return player2.hasCard(function(card2) {
          return get.subtype(card2) == "equip1";
        });
      },
      filterCard: function(card2) {
        return get.subtype(card2) == "equip1";
      },
      position: "he",
      discard: false,
      content: function() {
        player.addToExpansion(cards, player, "give").gaintag.add("nianshoumrfz");
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
          content: function() {
            var card2 = get.cardPile2(function(card3) {
              return get.subtype(card3) == "equip1";
            });
            player.logSkill("nianshoumrfz");
            event.num = 0;
            player.disableEquip("equip1");
            event.num++;
            if (card2) player.gain(card2, "gain2", "log");
            else player.chat("牌堆中没有武器牌了");
            if (event.num < 2) event.redo();
          }
        },
        usesha: {
          direct: true,
          trigger: { player: "useCardToPlayered" },
          filter: function(event2, player2) {
            var targetx2 = event2.targets, num = 0;
            if (event2.card.name != "sha" || player2.getExpansions("nianshoumrfz").length == 0) return false;
            if (event2.getParent().triggeredTargets3.length > 1) return false;
            for (var i2 = 0; i2 < targetx2.length; i2++) {
              if (targetx2[i2].getExpansions("nianshoumrfz").length < 2) num++;
            }
            return num > 0;
          },
          content: function() {
            "step 0";
            player.chooseBool(
              "是否将一个‘巨剑’置于" + (trigger.targets.length == 1 ? get.translation(trigger.targets[0]) : "其中一个目标") + "的武将牌上"
            ).set("ai", function() {
              return trigger.targets.some((q) => get.attitude(player, q) < 2);
            });
            if (result.bool && trigger.targets.length == 1) {
              player.logSkill("nianshoumrfz");
              var cards2 = player.getExpansions("nianshoumrfz");
              if (cards2.length) player.chooseButton(["选择一个‘巨剑’", cards2], true);
              else event.finish();
            } else event.goto(4);
            if (result.links && result.bool && trigger.targets.length == 1) {
              player.gain(result.links, "gain2").gaintag.add("nianshoumrfz2");
            }
            if (result.cards && trigger.targets.length == 1) {
              var cards3 = player.getCards("h", function(card2) {
                return card2.hasGaintag("nianshoumrfz2");
              });
              trigger.targets[0].addToExpansion(cards3, trigger.targets[0], "give").gaintag.add("nianshoumrfz");
            }
            event.finish();
            if (result.links && result.bool && trigger.targets.length > 1) {
              player.chooseTarget(true, function(card2, player2, target2) {
                return _status.event.targets.includes(target2);
              }).set("targets", trigger.targets).set("ai", function(target2) {
                return get.attitude(_status.event.player, target2) < 2;
              });
            } else event.finish();
            if (result.bool && result.targets) {
              event.target = result.targets[0];
              var cards2 = player.getExpansions("nianshoumrfz");
              if (cards2.length) player.chooseButton(["选择一个‘巨剑’", cards2], true);
              else event.finish();
            } else event.finish();
            if (result.links && result.bool) {
              player.gain(result.links, "gain2").gaintag.add("nianshoumrfz2");
            }
            if (result.cards) {
              var cards3 = player.getCards("h", function(card2) {
                return card2.hasGaintag("nianshoumrfz2");
              });
              event.target.addToExpansion(cards3, event.target, "give").gaintag.add("nianshoumrfz");
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
          content: function() {
            for (var i2 = 0; i2 < player.getExpansions("nianshoumrfz").length; i2++) {
              var names = player.getExpansions("nianshoumrfz")[i2].name + "_skill";
              if (lib.skill[names]) {
                player.addSkill(names);
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
          content: function() {
            if (Array.isArray(trigger.cards))
              for (var i2 of trigger.cards) {
                var names = i2.name + "_skill";
                if (lib.skill[names] && player.hasSkill(names)) {
                  player.removeSkill(names);
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
          content: function() {
            var target2 = trigger.player;
            trigger.num -= target2.getExpansions("nianshoumrfz").length;
            player.logSkill("nianshoumrfz", target2);
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
          content: function() {
            trigger.num -= trigger.source.getExpansions("nianshoumrfz").length;
            player.logSkill("nianshoumrfz", trigger.source);
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
          content: function() {
            var list = ["e", "h"];
            for (var i2 = 0; i2 < game.players.length; i2++) {
              if (game.players[i2].getExpansions("nianshoumrfz").length > 0 && game.players[i2] != player) {
                for (var j = 0; j < 2; j++) {
                  if (game.players[i2].countCards(list[j]) > 0) {
                    player.gain(game.players[i2].getCards(list[j]).randomGet(), "give");
                    game.log(
                      player,
                      "获得了",
                      game.players[i2],
                      "的" + get.translation(game.players[i2].getCards(list[j]).randomGet())
                    );
                  }
                }
                player.gain(game.players[i2].getExpansions("nianshoumrfz"), "give", "log");
                player.logSkill("nianshoumrfz", game.players[i2]);
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
        if (event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2") return false;
        if (event2.card && event2.card.name != "sha") return false;
        if (game.countPlayer() <= 2) return false;
        return event2.getParent().name != "chongjimrfz" && event2.num > 0;
      },
      content: function() {
        "step 0";
        var targets2 = trigger.player;
        player.chooseTarget(
          get.prompt("chongjimrfz"),
          "你可以对" + get.translation(targets2) + "的上家或下家造成一点伤害",
          function(card2, player2, target2) {
            return (target2 == targets2.getNext() || target2 == targets2.getPrevious()) && target2 != player2;
          }
        ).ai = function(target2) {
          return -get.attitude(player, target2);
        };
        if (result.bool && result.targets) {
          result.targets[0].damage();
          if (trigger.num > 0)
            result.targets[0].chooseToDiscard("h", true, get.prompt("chongjimrfz"), "请选择弃置" + trigger.num + "张手牌", trigger.num);
          player.logSkill("chongjimrfz", result.targets[0]);
        }
      }
    },
    //水陈 假日威龙陈
    yuyunmrfz: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      direct: true,
      content: function() {
        var num = player.getCardUsable("sha");
        var history = player.getHistory("useCard");
        for (var i2 = 0; i2 < history.length; i2++) {
          if (history[i2].card.name == "sha") {
            player.removeMark("yuyunmrfz", player.countMark("yuyunmrfz"));
            event.finish();
          }
        }
        player.chooseBool("是否发动【余韵】？");
        if (result.bool) {
          player.draw(Math.min(num, 3));
          player.logSkill("yuyunmrfz");
        } else event.finish();
        player.removeMark("yuyunmrfz", player.countMark("yuyunmrfz"));
        player.addMark("yuyunmrfz", Math.min(num, 2));
      },
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num += player2.countMark("yuyunmrfz");
        }
      }
    },
    shuiqiangmrfz: {
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.getParent().triggeredTargets3.length > 1) return false;
        if (event2.card.name != "sha") return false;
        return game.hasPlayer(function(current) {
          return !event2.targets.includes(current) && player2.canUse(event2.card, current) && player2.inRange(current);
        });
      },
      direct: true,
      content: function() {
        player.chooseTarget(
          [1, Infinity],
          get.prompt("shuiqiangmrfz"),
          "为" + get.translation(trigger.card) + "增加任意个目标",
          function(card2, player2, target2) {
            return !_status.event.sourcex.includes(target2) && player2.inRange(target2) && player2.canUse(_status.event.card, target2);
          }
        ).set("sourcex", trigger.targets).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.effect(target2, _status.event.card, player2, player2);
        }).set("card", trigger.card).setHiddenSkill(event.name);
        if (result.bool) {
          if (!event.isMine() && !event.isOnline()) game.delayx();
          for (var i2 = 0; i2 < result.targets.length; i2++) {
            trigger.targets.push(result.targets[i2]);
            player.line(result.targets[i2]);
          }
          player.logSkill("shuiqiangmrfz");
        } else {
          event.finish();
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
      content: function() {
        "step 0";
        player.judge(function(card2) {
          var suit = get.suit(card2);
          if (suit == "spade") return -4;
          return 0;
        }).judge2 = function(result2) {
          return result2.bool == false ? true : false;
        };
        if (result.suit == "spade") {
          var list = [];
          for (var i2 = 0; i2 < trigger.cards.length; i2++) {
            if (get.position(trigger.cards[i2], true) == "o") {
              list.push(trigger.cards[i2]);
            }
          }
          if (trigger.addCount !== false) {
            trigger.addCount = false;
            trigger.player.getStat().card.sha--;
          }
          player.gain(list, "gain2");
        }
      }
    },
    //水月
    liqunmrfz: {
      audio: 2,
      trigger: { target: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (event2.player == player2) return false;
        return event2.card.length < 2 || get.distance(player2, event2.target) < 2;
      },
      usable: 1,
      check: function(event2, player2) {
        if (event2.card.name == "wugu" || event2.card.name == "tao") return false;
        if (get.attitude(player2, event2.target) > 2 && event2.card.name == "sha") return false;
        return true;
      },
      content: function() {
        trigger.getParent().excluded.add(player);
      }
    },
    chuangshangmrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        if (event2.getParent().name == "chuangshangmrfz") return false;
        if (event2.player == player2) return false;
        return event2.player.isMinHp() || game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current) && current.maxHp / 2 >= current.hp;
        });
      },
      content: function() {
        var target2 = trigger.player;
        var str1 = "摸两张牌", str2 = "对" + get.translation(target2) + "造成一点伤害";
        if (target2.isMinHp() && game.hasPlayer(function(current) {
          return current != player && player.inRange(current) && current.maxHp / 2 >= current.hp;
        })) {
          player.chooseControl(str1, str2).set("prompt", get.prompt("chuangshangmrfz")).set("prompt2", "请选择一项").set("ai", function(player2) {
            if (player2.hp < 2 && player2.countCards("h") < 3) return 0;
            return 1;
          });
        } else {
          player.draw();
          event.finish();
        }
        if (result.index == 0) {
          player.draw(2);
        } else target2.damage();
      }
    },
    jinghuamrfz: {
      audio: 2,
      trigger: { player: "useCardToPlayered" },
      usable: 1,
      filter: function(event2, player2) {
        if (event2.getParent().triggeredTargets3.length > 1) return false;
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
      content: function() {
        "step 0";
        player.chooseTarget(
          true,
          [1, 2],
          get.prompt("jinghuamrfz"),
          "为" + get.translation(trigger.card) + "增加至多两个目标",
          function(card2, player2, target2) {
            return !_status.event.sourcex.includes(target2) && player2.canUse(_status.event.card, target2, false);
          }
        ).set("sourcex", trigger.targets).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.effect(target2, _status.event.card, player2, player2);
        }).set("card", trigger.card).setHiddenSkill(event.name);
        if (result.bool) {
          player.addTempSkill("jinghuamrfz2", {
            player: "useCardAfter"
          });
          for (var i2 = 0; i2 < result.targets.length; i2++) {
            trigger.targets.push(result.targets[i2]);
            player.line(result.targets[i2]);
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
      content: function() {
        player.loseHp();
      }
    },
    //仇白
    ruximrfz: {
      audio: 4,
      trigger: { player: "useCardToPlayered" },
      filter: function(event2, player2) {
        if (event2.target == player2) return false;
        if (event2.getParent().triggeredTargets3.length > 1) return false;
        return event2.card.name == "sha";
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.target) < 2;
      },
      subfrequent: ["link"],
      content: function() {
        "step 0";
        player.judge(function(card2) {
          var suit = get.suit(card2);
          if (suit == "spade") return -2;
          if (suit == "club") return -4;
          return 0;
        }).judge2 = function(result2) {
          return result2.bool == false ? true : false;
        };
        for (var i2 = 0; i2 < trigger.targets.length; i2++) {
          var target2 = trigger.targets[i2];
          if (result.color == "black") {
            target2.link(true);
          }
          if (result.suit == "club") {
            player.addTempSkill("ruximrfz2", "phaseEnd");
            player.addMark("ruximrfz2", false);
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
          content: function() {
            "step 0";
            if (trigger.targets[0].countCards("hej") == 0) {
              event.finish();
              player.draw();
            }
            player.chooseBool(
              get.prompt("ruximrfz"),
              "【入隙】:是否摸一张牌</br>选择取消则为弃置" + get.translation(trigger.targets[0]) + "的区域内一张牌"
            ).set("ai", function() {
              var target2 = trigger.targets[0];
              let player2 = get.player();
              var att = get.attitude(player2, target2);
              var num = Math.random();
              if (att > 2 && target2.countCards("j") > 0) return false;
              return num > 0.5 ? true : false;
            });
            if (result.bool) {
              player.draw();
            } else {
              player.discardPlayerCard(trigger.targets[0], "hej", true);
              player.line(trigger.targets[0]);
            }
          }
        }
      }
    },
    ruximrfz2: {
      charlotte: true,
      onremove: true,
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num + player2.countMark("ruximrfz2");
        }
      }
    },
    wenxuemrfz: {
      audio: 4,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (event2.card.name != "sha") return false;
        return game.hasPlayer(function(current) {
          return !event2.targets.includes(current) && player2.canUse(event2.card, current) && player2.inRange(current) && (current.isLinked() || current.countCards("j") > 0);
        });
      },
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget(
          [1, 2],
          get.prompt("wenxuemrfz"),
          "为" + get.translation(trigger.card) + "增加至多两个目标",
          function(card2, player2, target2) {
            return !_status.event.sourcex.includes(target2) && player2.inRange(target2) && player2.canUse(_status.event.card, target2) && (target2.isLinked() || target2.countCards("j") > 0);
          }
        ).set("sourcex", trigger.targets).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.effect(target2, _status.event.card, player2, player2);
        }).set("card", trigger.card).setHiddenSkill(event.name);
        if (result.bool) {
          for (var i2 = 0; i2 < result.targets.length; i2++) {
            player.logSkill("wenxuemrfz", result.targets[i2]);
            trigger.targets.push(result.targets[i2]);
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
            if (!game.hasPlayer(function(current) {
              return current != player2 && player2.inRange(current) && player2.canUse("sha", current);
            }))
              return false;
            var history = player2.getHistory("useCard", function(evt) {
              return evt.card.name == "sha" && evt.cards && evt.cards.length == 1;
            });
            return history.length % 2 == 0 && event2.cards && event2.cards.length == 1;
          },
          content: function() {
            "step 0";
            var history = player.getHistory("useCard", function(evt) {
              return evt.card.name == "sha" && evt.cards && evt.cards.length == 1;
            });
            event.num = history.length / 2;
            player.chooseBool(get.prompt("wenxuemrfz"), "可以使用" + event.num + "张【杀】");
            if (result.bool) {
              player.chooseUseTarget(
                {
                  name: "sha",
                  isCard: true
                },
                "请选择【杀】的目标(还可使用" + event.num + "张【杀】)",
                false
              );
              event.num--;
              player.logSkill("wenxuemrfz");
              if (event.num > 0) event.redo();
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
          content: function() {
            player.addMark("wenxuemrfz_count", false);
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.removeMark("wenxuemrfz_count", player.countMark("wenxuemrfz_count"), false);
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
      content: function() {
        player.storage.yongwomrfz2 = true;
        player.turnOver();
        if (player.hp <= 0) player.recover(1 - player.hp);
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
          content: function() {
            var target2 = trigger.player;
            target2.chooseToDiscard("he", true, "【拥我】:请弃置一张牌");
            target2.addMark("yongwomrfz2", false);
            if (target2.countMark("yongwomrfz2") >= 2) {
              target2.removeMark("yongwomrfz2", 2, false);
              target2.damage();
              player.logSkill("yongwomrfz", target2);
            } else event.finish();
            player.chooseBool("【拥我】:是否翻面").set("ai", function() {
              var player2 = _status.event.player;
              if (player2.hp < 2 && !player2.storage.yongwomrfz2) return true;
              if (get.attitude(player2, player2.getNext()) > 2 || get.attitude(player2, player2.getPrevious()) > 2) return true;
              return false;
            });
            if (result.bool) {
              player.turnOver();
              player.logSkill("yongwomrfz");
            }
          }
        },
        change1: {
          direct: true,
          trigger: { player: "turnOverAfter" },
          filter: function(event2, player2) {
            return !player2.isTurnedOver();
          },
          content: function() {
            player.draw(2);
            player.logSkill("yongwomrfz");
          }
        },
        change2: {
          direct: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            if (player2.isTurnedOver() || !event2.player.isAlive()) return false;
            return player2.getStat("damage") > 0 || player2.getHistory("damage").length > 0;
          },
          content: function() {
            "step 0";
            player.chooseBool("【拥我】:是否翻面").set("ai", function() {
              var num = 0.2, player2 = _status.event.player;
              if (player2.countCards("h") > 2) ;
              if (player2.hp > 1) ;
              if (get.attitude(player2, player2.getNext()) < 2 || get.attitude(player2, player2.getPrevious()) < 2) ;
              if (player2.isTurnedOver()) ;
              return Math.random() + num > 0.6;
            });
            if (result.bool) {
              player.turnOver();
              player.logSkill("yongwomrfz");
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
      content: function() {
        player.storage.yongwomrfz2 = false;
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
      content: function() {
        "step 0";
        var next = player.chooseControl().set("choiceList", [
          "白铁多功能平台-攻击型：当你造成至少两点伤害时，你可以令此伤害+1。",
          "白铁多功能平台-支援型：锁定技，弃牌阶段开始时，你摸一张牌并额外执行一个出牌阶段。",
          "铁钳号原型机：出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。"
        ]).set("ai", function() {
          return [0, 1, 2].randomGet();
        });
        next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
        var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
        for (var i2 = 0; i2 < 3; i2++) {
          if (result.index == i2) {
            event.card = game.createCard(list[i2], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
            player.gain(event.card, "gain2");
            event.card2 = list[i2];
          }
        }
        if (player.getCards("h").includes(card) && get.name(card, player) == event.card2) player.chooseUseTarget(card, "nopopup", true);
      },
      group: ["jigongmrfz_gcard", "jigongmrfz_zb", "jigongmrfz_discard"],
      subSkill: {
        gcard: {
          direct: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i2 = 0; i2 < 3; i2++) {
              if (player2.countCards("e", list[i2])) return true;
            }
          },
          firstDo: true,
          content: function() {
            "step 0";
            player.chooseTarget("你可以将【支援装备】移动至一名其他角色的装备区", function(card2, player2, target2) {
              return target2 != player2 && !target2.getEquip(5) && !target2.isDisabled(5);
            }).ai = function(target2) {
              return get.attitude(player, target2);
            };
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            if (result.bool) {
              for (var i2 = 0; i2 < 3; i2++) {
                if (player.countCards("e", list[i2])) {
                  event.card = player.getCards("e", function(card2) {
                    return card2.name == list[i2];
                  });
                  player.lose(event.card, ui.ordering, "visible");
                  player.line(result.targets[0]);
                  event.target = result.targets[0];
                }
              }
            } else event.finish();
            event.target.equip(event.card[0]);
            player.logSkill("jigongmrfz", event.target);
          }
        },
        zb: {
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i2 = 0; i2 < 3; i2++) {
              if (player2.countCards("e", list[i2])) return false;
            }
            return true;
          },
          content: function() {
            "step 0";
            var next = player.chooseControl().set("choiceList", [
              "白铁多功能平台-攻击型：当你造成至少两点伤害时，你可以令此伤害+1。",
              "白铁多功能平台-支援型：锁定技，弃牌阶段开始时，你额外执行一个出牌阶段和摸牌阶段。",
              "铁钳号原型机：出牌阶段你可以弃置X张带有伤害类标签的牌，然后选择一名你攻击范围内的其他角色，对其造成一点伤害（X=此技能本回合使用数+1）。"
            ]).set("ai", function() {
              return [0, 1, 2].randomGet();
            });
            next.set("prompt", get.prompt("jigongmrfz")).set("prompt2", "请选择一项");
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i2 = 0; i2 < 3; i2++) {
              if (result.index == i2) {
                event.card = game.createCard(list[i2], ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
                player.gain(event.card, "gain2");
                event.card2 = list[i2];
              }
            }
            if (player.getCards("h").includes(card) && get.name(card, player) == event.card2)
              player.chooseUseTarget(card, "nopopup", true);
            player.logSkill("jigongmrfz");
          }
        },
        discard: {
          direct: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i2 = 0; i2 < 3; i2++) {
              if (event2.player.countCards("e", list[i2])) return true;
            }
          },
          content: function() {
            "step 0";
            var list = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
            for (var i2 = 0; i2 < 3; i2++) {
              if (trigger.player.countCards("e", list[i2])) {
                event.card = trigger.player.getCards("e", function(card2) {
                  return card2.name == list[i2];
                });
                trigger.player.discard(event.card);
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
        for (var i2 = 0; i2 < cs.length; i2++) {
          if (cs[i2].name.indexOf("baitiemrfzcard") == 0 && get.position(cs[i2], true) == "d") return true;
        }
        return false;
      },
      forceDie: true,
      content: function() {
        "step 0";
        if (!_status.jigongmrfz) _status.jigongmrfz = {};
        var list = [];
        var list2 = ["baitiemrfzcard1", "baitiemrfzcard2", "baitiemrfzcard3"];
        var cs = trigger.cards;
        for (var i2 = 0; i2 < cs.length; i2++) {
          if (cs[i2].name.indexOf("baitiemrfzcard") == 0 && get.position(cs[i2], true) == "d") {
            _status.jigongmrfz[cs[i2].name] = false;
            list.push(cs[i2]);
          }
          for (var j = 0; j < 3; j++) {
            if (cs[i2].name == list2[j]) event.card = list2[j];
          }
        }
        game.log(list, "已被移出游戏");
        game.cardsGotoSpecial(list);
        event.card = game.createCard(list[0].name, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
        player.popup("jigongmrfz");
        player.chooseBool(get.prompt("jigongmrfz"));
        if (result.bool) {
          player.logSkill("jiefeimrfz");
          player.judge(function(card2) {
            var color = get.color(card2);
            if (color == "red") return -4;
            return 0;
          }).judge2 = function(result2) {
            return result2.bool == false ? true : false;
          };
        } else event.finish();
        if (result.color == "red") {
          player.draw();
          player.chooseTarget("你可以令一名角色装备【支援装备】", function(card2, player2, target3) {
            return !target3.getEquip(5) && !target3.isDisabled(5);
          }).ai = function(target3) {
            return get.attitude(player, target3);
          };
        } else event.finish();
        if (result.bool) {
          var cards2 = game.createCard(event.card, ["heart", "spade"].randomGet(), [1, 2, 6, 8].randomGet());
          var target2 = result.targets[0];
          target2.gain(cards2, "gain2");
          target2.equip(cards2);
          player.logSkill("jiefeimrfz");
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
          const { cards: cards2 } = await player2.chooseToDiscard("he", (card2) => get.type(card2) == "equip").set(
            "prompt",
            `【跃锤】:你可以弃置一张装备牌令‘跃锤’中[]内的数字+1（当前：${player2.countMark("yuechuimrfz") > 0 ? player2.countMark("yuechuimrfz") : 1}）`
          ).set("ai", (card2) => {
            return get.value(card2) < 8;
          }).forResult();
          if (cards2) player2.addMark("yuechuimrfz", 1, false);
        }
        let targets2 = trigger2.targets, targetx2 = game.players.slice().filter((i2) => {
          for (var j of targets2) {
            if (get.distance(j, i2) == 1 && !targets2.includes(i2)) return true;
          }
          return false;
        });
        if (targetx2) {
          const { targets: targetscs } = await player2.chooseTarget().set("prompt", `【跃锤】:你可以对${get.translation(targetx2)}其中一名角色造成一点伤害`).set("filterTarget", (card2, player3, target2) => {
            return _status.event.targets.includes(target2);
          }).set("ai", (target2) => {
            return get.damageEffect(target2, get.event().player, get.event().player) > 0;
          }).set("targets", targetx2).forResult();
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
      content: function() {
        player.draw();
        player.line(trigger.player);
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
      content: function() {
        player.addMark("langqunmrfz", 2);
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
          content: function() {
            player.addMark("langqunmrfz");
            player.addTempSkill("langqunmrfz2");
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
          content: function() {
            trigger.targets.remove(player);
            trigger.getParent().triggeredTargets2.remove(player);
            trigger.untrigger();
            player.removeMark("langqunmrfz");
          }
        },
        discard: {
          audio: "langqunmrfz",
          forced: true,
          trigger: { player: "phaseDiscardEnd" },
          content: function() {
            var cards2 = [];
            game.getGlobalHistory("cardMove", function(evt) {
              if (evt.name == "cardsDiscard") {
                if (evt.getParent("phaseDiscard") == trigger) {
                  var moves = evt.cards.filterInD("d");
                  cards2.addArray(moves);
                }
              }
              if (evt.name == "lose") {
                if (evt.type != "discard" || evt.position != ui.discardPile || evt.getParent("phaseDiscard") != trigger) return;
                var moves = evt.cards.filterInD("d");
                cards2.addArray(moves);
              }
            });
            player.draw(Math.floor(cards2.length / 2) + 1);
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
      content: function() {
        trigger.player.addMark("qunxingmrfz");
        player.line(trigger.player);
      },
      mod: {
        targetInRange: function(card2, player2, target2) {
          if (target2.hasMark("qunxingmrfz")) {
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
          content: function() {
            var target2 = trigger.player;
            player.draw(target2.countMark("qunxingmrfz"));
            target2.removeAllmark("qunxingmrfz");
          }
        },
        dirhit: {
          audio: "qunxingmrfz",
          forced: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name)) && game.hasPlayer(function(current) {
              return current != player2 && current.hasMark("qunxingmrfz");
            });
          },
          content: function() {
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player && current.hasMark("qunxingmrfz");
              })
            );
            player.line(
              game.filterPlayer(function(current) {
                return current != player && current.hasMark("qunxingmrfz");
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
      content: function() {
        trigger.num++;
        player.addSkill("yixuemrfz2");
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
      content: function() {
        player.removeSkill("yixuemrfz2");
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
      content: function() {
        "step 0";
        var cards2 = trigger.target.getCards("hej"), list = [], num = 0;
        for (var i2 of cards2) {
          list.add(get.suit(i2, player));
        }
        for (var i2 of lib.suit) {
          if (list.includes(i2)) num++;
        }
        player.choosePlayerCard(
          trigger.target,
          "he",
          [1, Math.min(trigger.target.countCards("he"), num)],
          get.prompt("juximrfz", trigger.target) + "(可选" + num + "张牌)"
        ).set("forceAuto", true);
        if (result.bool && result.links.length) {
          var target2 = trigger.target;
          player.logSkill("juximrfz", target2);
          player.addToExpansion(result.cards, "giveAuto", player).gaintag.add("juximrfz2");
          player.addSkill("juximrfz2");
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
          var cards2 = player2.getExpansions("juximrfz2");
          if (player2.isUnderControl(true)) dialog.addAuto(cards2);
          else return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      },
      trigger: { player: "useCardAfter" },
      forced: true,
      filter: function(event2, player2) {
        if (event2.card.name != "sha") return false;
        return player2.getExpansions("juximrfz2").length > 0;
      },
      content: function() {
        var history = player.getHistory("sourceDamage", function(evt) {
          return evt.card == trigger.card;
        }).length;
        var cards2 = player.getExpansions("juximrfz2");
        if (history > 0)
          player.chooseButton(["你可以至多获得两张牌", cards2], [0, Math.min(2, cards2.length)], true).set("ai", function(button) {
            return get.value(button.link, _status.event.player);
          });
        else
          trigger.targets[0].chooseButton(["你可以至多获得两张牌", cards2], [0, Math.min(2, cards2.length)], true).set("ai", function(button) {
            return get.value(button.link, _status.event.player);
          });
        if (result.bool) {
          if (history > 0) player.gain(result.links, "gain2");
          else trigger.targets[0].gain(result.links, "gain2");
        }
        player.loseToDiscardpile(cards2);
        player.removeSkill("juximrfz2");
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
      content: function() {
        player.storage.conghunmrfz_lose = true;
        player.storage.conghunmrfza = game.roundNumber;
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
          content: function() {
            trigger.num--;
            player.addMark("conghunmrfz");
          }
        },
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.conghunmrfz_lose && player2.storage.conghunmrfza <= game.roundNumber - 1;
          },
          content: function() {
            player.storage.conghunmrfz_lose = false;
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
          content: function() {
            player.loseHp();
            player.removeMark("conghunmrfz");
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
      content: function() {
        player.storage.yujinmrfz = true;
        var next = [
          player.phaseZhunbei(),
          player.phaseJudge(),
          player.phaseDraw(),
          player.phaseUse(),
          player.phaseDiscard(),
          player.phaseJieshu()
        ];
        for (var i2 = 0; i2 < next.length; i2++) {
          event.next.remove(next[i2]);
          trigger.next.push(next[i2]);
        }
        player.awakenSkill(event.name);
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
          content: function() {
            player.storage.yujinmrfz = false;
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
        if (player2.countCards("j") > 0 && !player2.hasCard(function(card2) {
          return card2.name == "wuxie";
        }, "h"))
          return false;
        return player2.hasCard(function(card2) {
          return card2.name == "sha";
        }, "h");
      },
      content: function() {
        "step 0";
        player.chooseToDiscard("he", "【黄昏】:你可以至多弃置两张牌，然后增加等量的体力上限", [0, 2]).set("ai", function(card2) {
          return 6 - get.value(card2);
        });
        if (result.bool) {
          player.gainMaxHp(result.cards.length);
        }
        player.addTempSkill("huanghunmrfz_lose");
        player.addTempSkill("huanghunmrfz_dam");
        player.turnOver();
      },
      subSkill: {
        lose: {
          direct: true,
          charlotte: true,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            return get.tag(event2.card, "damage");
          },
          content: function() {
            player.loseMaxHp();
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
          content: function() {
            trigger.num++;
          },
          mod: {
            selectTarget: function(card2, player2, range) {
              if (card2.name == "sha" && range[1] != -1) range[1] += 2;
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
      content: function() {
        player.draw(2);
      },
      mod: {
        cardnature: function(card2, player2) {
          if (card2.nature != "thunder" && card2.name == "sha") return "fire";
          if (card2.nature == "thunder" && card2.name == "sha") return false;
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
      content: function() {
        player.logSkill("fanyuanmrfz");
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
          content: function() {
            player.removeMark("fanyuanmrfz", false);
          },
          mod: {
            targetEnabled: function(card2, player2, target2) {
              if (get.type(card2) == "delay" && target2.hasMark("fanyuanmrfz")) return false;
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
      content: function() {
        var target2 = trigger.player;
        player.addMark("new_weiguangmrfz", false);
        if (!target2.hasMark("fanyuanmrfz")) target2.addMark("fanyuanmrfz", false);
        var num = 3;
        if (target2.isLinked()) {
          target2.link(false);
          num--;
        }
        if (target2.isTurnedOver()) {
          target2.turnOver(false);
          num--;
        }
        if (trigger.name == "addJudge" || target2.countCards("j") > 0) {
          if (trigger.name == "addJudge") {
            trigger.cancel();
            var owner = get.owner(trigger.card);
            if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
            else game.cardsDiscard(trigger.card);
            game.log(trigger.card, "进入了弃牌堆");
          }
          target2.chooseToDiscard(true, "j", target2.countCards("j"));
          num--;
        }
        target2.draw(num);
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
          content: function() {
            player.removeMark("new_weiguangmrfz", player.countMark("new_weiguangmrfz"), false);
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
      content: function() {
        trigger.targets[0].recover();
        trigger.targets[0].draw();
        player.addMark("yingjimrfz", false);
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
          content: function() {
            player.removeMark("yingjimrfz", false);
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
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && !target2.hasMark("yinbimrfz") && !target2.hasMark("zhenzamrfz");
      },
      content: function() {
        player.storage.yinbimrfz = true;
        if (!player.hasSkill("liuliemrfz_rem")) player.addSkill("liuliemrfz_rem");
        for (var i2 = 0; i2 < targets.length; i2++) {
          if (!targets[i2].hasMark("yinbimrfz")) targets[i2].addMark("yinbimrfz");
          if (!targets[i2].hasSkill("yinbimrfz_rem")) targets[i2].addSkill("yinbimrfz_rem");
          if (targets[i2].hujia < 1) targets[i2].changeHujia();
        }
      },
      subSkill: {
        rem: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            if (player.hasMark("yinbimrfz")) {
              player.removeMark("yinbimrfz");
              player.changeHujia(-1);
            }
            player.removeSkill("yinbimrfz_rem");
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
        if (game.hasPlayer(function(current) {
          return current != player2 && get.attitude(player2, current) > 2;
        }))
          return Math.random() > 0.85;
        return true;
      },
      content: function() {
        player.storage.liuliemrfz = true;
        player.addSkill("liuliemrfz_rem");
      },
      subSkill: {
        rem: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.storage.liuliemrfz = false;
            player.storage.yinbimrfz = false;
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
      content: function() {
        var playerx = trigger.player;
        if (playerx.hasMark("zhenzamrfz")) playerx.removeMark("zhenzamrfz");
        else playerx.removeMark("yinbimrfz");
        playerx.chooseTarget(
          get.prompt("zhenzamrfz"),
          "你可以随机获得攻击范围内一名其他角色的" + (player.storage.liuliemrfz ? "两张牌" : "一张牌") + "并对其造成一点伤害",
          function(card2, target3, player2) {
            return target3 != player2 && player2.inRangeOf(target3);
          }
        ).ai = function(target3) {
          var trigger2 = _status.event.getTrigger();
          _status.event.player;
          return -get.attitude(trigger2.player, target3);
        };
        if (result.bool) {
          var target2 = result.targets[0], cardg = [];
          for (var i2 = 0; i2 < (player.storage.liuliemrfz ? 2 : 1); i2++) {
            var cardt = target2.getCards("he").randomGet();
            if (!cardg.includes(cardt)) cardg.push(cardt);
            else if (target2.countCards("he") > 1) i2--;
          }
          playerx.gain(cardg, target2, "giveAuto", "bySelf");
          target2.damage(playerx || "nosource", "nocard");
          playerx.logSkill("zhenzamrfz", target2);
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
          content: function() {
            player.addMark("zhenzamrfz");
            if (player.hujia < 1) player.changeHujia();
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
          content: function() {
            player.addMark("zhenzamrfz");
            player.addMark("zhenzamrfz_time1", false);
            if (player.hujia < 1) player.changeHujia();
          }
        },
        gt2: {
          audio: "zhenzamrfz",
          trigger: { global: "dying" },
          filter: function(event2, player2) {
            if (player2.countMark("zhenzamrfz_time2") > 1) return false;
            if (player2.hasMark("zhenzamrfz") || player2.hasMark("yinbimrfz")) return false;
            return event2.player != player2 && event2.parent.name == "damage" && event2.parent.source && event2.parent.source == player2;
          },
          content: function() {
            player.addMark("zhenzamrfz");
            player.addMark("zhenzamrfz_time2", false);
            if (player.hujia < 1) player.changeHujia();
          }
        },
        time1: {
          charlotte: true,
          silent: true,
          trigger: { global: "roundStart" },
          firstDo: true,
          content: function() {
            player.removeMark("zhenzamrfz_time1", player.countMark("zhenzamrfz_time1"), false);
            player.removeMark("zhenzamrfz_time2", player.countMark("zhenzamrfz_time2"), false);
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
      content: function() {
        var cards2 = player.getCards("h"), list = [];
        for (var i2 of cards2) {
          list.add(get.suit(i2, player));
        }
        if (!list.includes(get.suit(trigger.card, player))) player.draw();
        else if (player.countCards("h") > 0) player.chooseToDiscard("h", true, "【共振】:请弃置一张手牌");
      }
    },
    mengxiangmrfz: {
      audio: 2,
      trigger: { player: "drawAfter" },
      filter: function(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        return event2.getParent().name == "gongzhenmrfz";
      },
      direct: true,
      content: function() {
        "step 0";
        player.addMark("mengxiangmrfz", false);
        if (player.countMark("mengxiangmrfz") % 2 == 0 && player.hasMark("mengxiangmrfz")) {
          player.addTempSkill("mengxiangmrfz_eff", {
            player: "phaseEnd"
          });
          player.removeMark("mengxiangmrfz", 2, false);
          if (player.countMark("mengxiangmrfz") > 0) event.redo();
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
          content: function() {
            player.removeMark("mengxiangmrfz", player.countMark("mengxiangmrfz"), false);
          }
        },
        eff: {
          audio: "mengxiangmrfz",
          trigger: { player: ["useCard1", "respond"] },
          forced: true,
          charlotte: true,
          content: function() {
            player.removeSkill("mengxiangmrfz_eff");
          },
          mod: {
            cardUsable: function(card2) {
              return Infinity;
            },
            targetInRange: function(card2) {
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
        for (var card2 of event2.cards) {
          if (get.position(card2, true) == "d") return true;
        }
        return false;
      },
      content: function() {
        "step 0";
        if (trigger.cards.length) {
          player.chooseTarget(get.prompt("paizhangmrfz"), "你可以将此牌交给一名其他角色", function(card2, target2, player2) {
            return target2 != player2 && !target2.hasSkill("paizhangmrfz2");
          }).ai = function(target2) {
            return -get.attitude(player, target2);
          };
        }
        if (result.bool) {
          result.targets[0].gain(trigger.cards, "gain2").gaintag = ["paizhangmrfz"];
          result.targets[0].addTempSkill("paizhangmrfz2");
          player.logSkill("paizhangmrfz");
        }
        for (i of trigger.cards) {
          i.storage.paizhangmrfz = true;
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
            for (var i2 = 0; i2 < event2.cards.length; i2++) {
              if (event2.cards[i2].storage && event2.cards[i2].storage.paizhangmrfz) return true;
            }
            return false;
          },
          content: function() {
            var cards2 = trigger.cards[0];
            if (trigger.cards.length > 1 || cards2.number == void 0) {
              trigger.player.damage();
              player.logSkill("paizhangmrfz", trigger.player);
            } else if (cards2.number > 8) {
              trigger.player.damage();
              player.logSkill("paizhangmrfz", trigger.player);
            } else {
              trigger.player.chooseToDiscard(
                "he",
                Math.floor(cards2.number / 3),
                "【排障】:请弃置" + Math.floor(cards2.number / 3) + "张牌",
                true
              );
              player.logSkill("paizhangmrfz", trigger.player);
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
            for (var i2 = 0; i2 < event2.cards.length; i2++) {
              if (event2.cards[i2].storage && event2.cards[i2].storage.paizhangmrfz) return true;
            }
            return false;
          },
          content: function() {
            "step 0";
            if (trigger.name == "addJudge") {
              trigger.cancel();
              var owner = get.owner(trigger.card);
              if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
              else game.cardsDiscard(trigger.card);
              game.log(trigger.card, "进入了弃牌堆");
            } else trigger.getParent().targets.remove(player);
            var trgnext = trigger.player.getNext(), trgprvs = trigger.player.getPrevious();
            if (trgnext != player && trgnext.hasCard(function(card2) {
              return card2.storage && card2.storage.paizhangmrfz;
            }, "h")) {
              var cards2 = trgnext.getCards("h", function(card2) {
                return card2.storage && card2.storage.paizhangmrfz;
              });
              player.logSkill("paizhangmrfz", trgnext);
              trgnext.damage();
              game.cardsDiscard(cards2);
              game.log(cards2, "进入了弃牌堆");
            }
            if (trgprvs != player && trgprvs.hasCard(function(card2) {
              return card2.storage && card2.storage.paizhangmrfz;
            }, "h")) {
              var cards2 = trgprvs.getCards("h", function(card2) {
                return card2.storage && card2.storage.paizhangmrfz;
              });
              player.logSkill("paizhangmrfz", trgprvs);
              trgprvs.damage();
              game.cardsDiscard(cards2);
              game.log(cards2, "进入了弃牌堆");
            }
          }
        },
        tag3: {
          direct: true,
          charlotte: true,
          trigger: { global: "useCardToPlayered" },
          filter: function(event2, player2) {
            if (event2.player == player2) return false;
            if (!event2.player.hasCard(function(card2) {
              return card2.storage && card2.storage.paizhangmrfz;
            }, "h"))
              return false;
            for (var i2 = 0; i2 < event2.cards.length; i2++) {
              if (event2.cards[i2].storage && event2.cards[i2].storage.paizhangmrfz) return false;
            }
            for (var i2 = 0; i2 < event2.targets.length; i2++) {
              if (event2.targets[i2] == player2) return true;
            }
          },
          content: function() {
            "step 0";
            var cards2 = trigger.player.getCards("h", function(card2) {
              return card2.storage && card2.storage.paizhangmrfz;
            });
            event.cards = cards2;
            game.cardsDiscard(cards2);
            game.log(cards2, "进入了弃牌堆");
            player.logSkill("paizhangmrfz", trigger.player);
            if (trigger.name == "addJudge") {
              trigger.cancel();
              var owner = get.owner(trigger.card);
              if (owner && owner.getCards("hej").includes(trigger.card)) owner.lose(trigger.card, ui.discardPile);
              else game.cardsDiscard(trigger.card);
              game.log(trigger.card, "进入了弃牌堆");
            } else trigger.getParent().targets.remove(player);
            if (event.cards.length > 1 || event.cards.number == void 0) {
              trigger.player.damage();
              player.logSkill("paizhangmrfz", trigger.player);
            } else if (event.cards.number > 8) {
              trigger.player.damage();
              player.logSkill("paizhangmrfz", trigger.player);
            } else {
              trigger.player.chooseToDiscard(
                "he",
                Math.floor(cards2.number / 3),
                "【排障】:请弃置" + Math.floor(cards2.number / 3) + "张牌",
                true
              );
              player.logSkill("paizhangmrfz", trigger.player);
            }
            var trgnext = trigger.player.getNext(), trgprvs = trigger.player.getPrevious();
            if (trgnext.hasCard(function(card2) {
              return card2.storage && card2.storage.paizhangmrfz;
            }, "h")) {
              var cards2 = trgnext.getCards("h", function(card2) {
                return card2.storage && card2.storage.paizhangmrfz;
              });
              player.logSkill("paizhangmrfz", trgnext);
              trgnext.damage();
              game.cardsDiscard(cards2);
              game.log(cards2, "进入了弃牌堆");
            }
            if (trgprvs.hasCard(function(card2) {
              return card2.storage && card2.storage.paizhangmrfz;
            }, "h")) {
              var cards2 = trgprvs.getCards("h", function(card2) {
                return card2.storage && card2.storage.paizhangmrfz;
              });
              player.logSkill("paizhangmrfz", trgprvs);
              trgprvs.damage();
              game.cardsDiscard(cards2);
              game.log(cards2, "进入了弃牌堆");
            }
          }
        },
        tag4: {
          charlotte: true,
          mod: {
            cardDiscardable: function(card2, player2) {
              if (card2.storage && card2.storage.paizhangmrfz) return false;
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
      content: function() {
        player.draw(3);
      },
      group: ["tiexianmrfz_draw", "tiexianmrfz_k"],
      subSkill: {
        ban: {
          charlotte: true
        },
        k: {
          mod: {
            cardnumber(card2) {
              if (card2.hasGaintag("tiexianmrfz")) return 13;
            }
          },
          charlotte: true,
          direct: true,
          trigger: { player: "gainAfter" },
          filter(event2, player2) {
            return !player2.hujia && !player2.hasSkill("tiexianmrfz_ban");
          },
          content() {
            player.addTempSkill("tiexianmrfz_ban", {
              global: "roundStart"
            });
            for (var i2 of trigger.cards) {
              i2.addGaintag("tiexianmrfz");
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
          content: function() {
            trigger.num++;
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
      content: function() {
        "step 0";
        player.chooseToDiscard(
          "he",
          get.prompt("lieshimrfz"),
          "你可以弃置一张牌并选择一名与" + get.translation(trigger.targets[0]) + "距离为1的其他角色视为使用一张【杀】"
        ).set(
          "goon",
          game.hasPlayer(function(current) {
            var target2 = trigger.targets[0];
            return get.distance(target2, current) == 1 && get.attitude(player, current) < 2;
          })
        ).set("ai", function(card2) {
          if (_status.event.goon) return 6 - get.value(card2);
          return 0;
        });
        if (result.cards) {
          player.chooseTarget(
            true,
            "请选择一名与" + get.translation(trigger.targets[0]) + "距离为1的一名其他角色",
            function(card2, player2, target2) {
              var evt = _status.event.getTrigger();
              return target2 != player2 && target2 != evt.targets[0] && get.distance(evt.targets[0], target2) <= 1 && lib.filter.targetEnabled2(evt.card, player2, target2);
            }
          ).ai = function(target2) {
            return -get.attitude(player, target2);
          };
        } else event.finish();
        if (result.bool) {
          player.useCard({ name: "sha", isCard: true }, result.targets[0]);
          player.logSkill("lieshimrfz");
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
      content: function() {
        trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
        trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
        if (!player.hasSkill("guirenmrfz2")) player.addTempSkill("guirenmrfz2");
        if (!player.hasSkill("guirenmrfz_lose")) player.addTempSkill("guirenmrfz_lose");
        player.storage.guirenmrfz2++;
      },
      subSkill: {
        lose: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseUseEnd" },
          content: function() {
            player.removeSkill("guirenmrfz");
            player.addSkill("guiqiangmrfz");
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
      content: function() {
        player.storage.guirenmrfz2 = 0;
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
      content: function() {
        "step 0";
        player.drawTo(Math.min(player.maxHp, 4));
        player.chooseToDiscard(get.prompt("guiqiangmrfz"), "你可以弃置一张牌并失去此技能，然后获得【鬼人】", "he").set("ai", function(card2) {
          return 6 - get.value(card2);
        });
        if (result.cards) {
          player.removeSkill("guiqiangmrfz");
          player.addSkill("guirenmrfz");
        }
      }
    },
    luanwumrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      derivation: ["guiqiangmrfz", "guirenmrfz"],
      check: function(event2, player2) {
        if (player2.countCards("h", function(card2) {
          return get.type2(card2) == "trick" || get.tag(card2, "damage");
        }) > 2)
          return false;
        if (player2.getHandcardLimit() > 2) return false;
        return game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current) && get.attitude(player2.current) < 0;
        });
      },
      filter: function(event2, player2) {
        if (!game.hasPlayer(function(current) {
          return current != player2 && player2.inRange(current);
        }))
          return false;
        return player2.hasSkill("guirenmrfz");
      },
      content: function() {
        "step 0";
        player.chooseTarget(true, "【乱舞】:请选择一名其他角色，视为对其使用一张结算三次的【杀】", function(card2, player2, target2) {
          return target2 != player2 && player2.inRange(target2);
        }).ai = function(target2) {
          return -get.attitude(player, target2);
        };
        if (result.bool) {
          result.targets[0];
          player.addTempSkill("luanwumrfza", {
            player: "shaAfter"
          });
          player.useCard({ name: "sha", isCard: true }, result.targets[0]);
        }
        player.skip("phaseUse");
        player.skip("phaseDraw");
        player.skip("phaseJudge");
        if (!player.hasSkill("luanwumrfz_dam")) player.addSkill("luanwumrfz_dam");
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
          content: function() {
            trigger.num++;
            player.removeSkill("luanwumrfz_dam");
          }
        },
        add: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseUseBegin" },
          content: function() {
            player.addSkill("guirenmrfz");
            player.removeSkill("luanwumrfz_add");
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
      content: function() {
        "step 0";
        event.num = 2;
        event.num--;
        player.logSkill("luanwumrfza");
        trigger.getParent().targets = trigger.getParent().targets.concat(trigger.targets);
        trigger.getParent().triggeredTargets4 = trigger.getParent().triggeredTargets4.concat(trigger.targets);
        if (event.num > 0) event.redo();
        player.removeSkill("luanwumrfza");
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
      content: function() {
        game.countPlayer(function(current) {
          if (current != player) current.storage.yingzhimrfz_draw = false;
          if (current != player) current.storage.yingzhimrfz_mhand = false;
          if (current != player) current.storage.yingzhimrfz_sha = false;
          if (current != player) current.storage.yingzhimrfz_dying = false;
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
          content: function() {
            if (player.countMark("yingzhimrfz_draw") < 2) player.addMark("yingzhimrfz_draw", false);
            trigger.targets[0].storage.yingzhimrfz_draw = true;
            trigger.targets[0].addSkill("yingzhimrfz_drdebuff");
            trigger.targets[0].addMark("yingzhimrfz_drdebuff", false);
            trigger.targets[0].addSkill("yingzhimrfz_mark");
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
          content: function() {
            trigger.num += player.countMark("yingzhimrfz_draw");
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
          content: function() {
            trigger.num -= player.countMark("yingzhimrfz_drdebuff");
            player.removeMark("yingzhimrfz_drdebuff", player.countMark("yingzhimrfz_drdebuff"), false);
            player.removeSkill("yingzhimrfz_drdebuff");
            if (!player.hasMark("yingzhimrfz_mhddebuff") && !player.hasMark("yingzhimrfz_shadebuff") && !player.hasSkill("yingzhimrfz_dydebuff"))
              player.removeSkill("yingzhimrfz_mark");
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
          content: function() {
            if (player.countMark("yingzhimrfz_mhand") < 3) player.addMark("yingzhimrfz_mhand", false);
            trigger.player.addMark("yingzhimrfz_mhddebuff", false);
            trigger.player.storage.yingzhimrfz_mhand = true;
            trigger.player.addSkill("yingzhimrfz_mhddebuff");
            trigger.player.addSkill("yingzhimrfz_mark");
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
          content: function() {
            player.removeMark("yingzhimrfz_mhddebuff", player.countMark("yingzhimrfz_mhddebuff"), false);
            player.removeSkill("yingzhimrfz_mhddebuff");
            if (!player.hasMark("yingzhimrfz_drdebuff") && !player.hasMark("yingzhimrfz_shadebuff") && !player.hasSkill("yingzhimrfz_dydebuff"))
              player.removeSkill("yingzhimrfz_mark");
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
            return event2.player != player2 && event2.parent.name == "damage" && event2.parent.source && event2.parent.source == player2;
          },
          check: function(event2, player2) {
            return get.attitude(player2, event2.player) < 2;
          },
          prompt: function(event2, player2) {
            return "是否令" + get.translation(event2.player) + "下次造成的伤害-1且你下次造成的伤害+1？";
          },
          content: function() {
            if (!player.hasMark("yingzhimrfz_dying")) player.addMark("yingzhimrfz_dying", false);
            if (!trigger.player.hasSkill("yingzhimrfz_dydebuff")) {
              trigger.player.addSkill("yingzhimrfz_dydebuff", false);
              trigger.player.addSkill("yingzhimrfz_mark");
              trigger.player.storage.yingzhimrfz_dying = true;
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
          content: function() {
            trigger.num++;
            player.removeMark("yingzhimrfz_dying", false);
          }
        },
        dydebuff: {
          audio: "yingzhimrfz",
          forced: true,
          charlotte: true,
          trigger: { source: "damageBegin" },
          content: function() {
            trigger.num--;
            player.removeSkill("yingzhimrfz_dydebuff");
            if (!player.hasMark("yingzhimrfz_drdebuff") && !player.hasMark("yingzhimrfz_mhddebuff") && !player.hasMark("yingzhimrfz_shadebuff"))
              player.removeSkill("yingzhimrfz_mark");
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
          content: function() {
            var target2 = trigger.respondTo[0];
            target2.addMark("yingzhimrfz_shadebuff", false);
            target2.addSkill("yingzhimrfz_shadebuff");
            target2.addSkill("yingzhimrfz_mark");
            target2.storage.yingzhimrfz_sha = true;
            player.addMark("yingzhimrfz_sha", false);
            player.addSkill("yingzhimrfz_sharem");
          },
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + player2.countMark("yingzhimrfz_sha");
            }
          }
        },
        sharem: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseUseEnd" },
          content: function() {
            player.removeMark("yingzhimrfz_sha", player.countMark("yingzhimrfz_sha"), false);
            player.removeSkill("yingzhimrfz_sharem");
          }
        },
        shadebuff: {
          charlotte: true,
          silent: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("yingzhimrfz_shadebuff");
          },
          content: function() {
            player.removeMark("yingzhimrfz_shadebuff", player.countMark("yingzhimrfz_shadebuff"), false);
            player.removeSkill("yingzhimrfz_shadebuff");
            if (!player.hasMark("yingzhimrfz_drdebuff") && !player.hasMark("yingzhimrfz_mhddebuff") && !player.hasSkill("yingzhimrfz_dydebuff"))
              player.removeSkill("yingzhimrfz_mark");
          },
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num - player2.countMark("yingzhimrfz_shadebuff");
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
        return event2.parent.name == "damage" && event2.parent.source;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.parent.source) < 2;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.parent.source) + "获得‘影哨’标记？";
      },
      content: function() {
        trigger.parent.source.addSkill("yingshaomrfz_ban");
      },
      group: "yingshaomrfz_dying",
      subSkill: {
        ban2: {
          charlotte: true,
          mod: {
            cardEnabled: function(card2) {
              if (card2.name == "sha") return false;
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
          content: function() {
            player.addTempSkill("yingshaomrfz_ban2", {
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
          content: function() {
            game.countPlayer(function(current) {
              if (current.hasSkill("yingshaomrfz_ban")) {
                current.removeSkill("yingshaomrfz_ban");
                if (current.hasSkill("yingshaomrfz_ban2")) current.removeSkill("yingshaomrfz_ban2");
                current.damage(player);
              }
            });
            player.recover(2 - player.hp);
            player.removeSkill("yingshaomrfz");
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
      content: function() {
        "step 0";
        player.chooseTarget("【开源】:请选择一名角色令其摸两张牌且本局游戏使用【杀】的次数+1，若该角色是你，你摸一张牌", true).ai = function(target3) {
          return get.attitude(player, target3) > 0;
        };
        if (result.bool) {
          var target2 = result.targets[0];
          target2.draw(2);
          target2.addSkill("kaiyuanmrfz_buff");
          if (target2 == player) {
            player.draw();
            player.logSkill("kaiyuanmrfz");
          } else player.logSkill("kaiyuanmrfz", target2);
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
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + 1;
            }
          }
        }
      }
    },
    jingshuimrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          return "·你的攻击范围:" + player2.getAttackRange() + "</br>·你使用【杀】的次数:" + player2.getCardUsable("sha") + "</br>·你的手牌上限:" + player2.getHandcardLimit();
        }
      },
      audio: 3,
      trigger: { global: "roundStart" },
      direct: true,
      content: function() {
        "step 0";
        var str = "【净水】:你可选择一名其他角色，你将你的手牌数、手牌上限、攻击范围和使用【杀】的次数调整至与其一致";
        player.chooseTarget(get.prompt("jingshuimrfz"), str, function(card2, player2, target3) {
          return target3 != player2;
        }).ai = function(target3) {
          return target3.isMaxHandcard();
        };
        if (result.bool) {
          var target2 = result.targets[0];
          var numsha = target2.getCardUsable("sha");
          var numatt = target2.getAttackRange();
          var numhand = target2.getHandcardLimit();
          player.logSkill("jingshuimrfz", target2);
          if (player.countCards("h") <= target2.countCards("h")) player.drawTo(target2.countCards("h"));
          player.removeMark("jingshuimrfz_sha", player.countMark("jingshuimrfz_sha"), false);
          player.addMark("jingshuimrfz_sha", numsha, false);
          player.removeMark("jingshuimrfz_att", player.countMark("jingshuimrfz_att"), false);
          player.addMark("jingshuimrfz_att", numatt, false);
          player.removeMark("jingshuimrfz_maxhand", player.countMark("jingshuimrfz_maxhand"), false);
          player.addMark("jingshuimrfz_maxhand", numhand, false);
        }
      },
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha" && player2.hasMark("jingshuimrfz_sha")) return player2.countMark("jingshuimrfz_sha");
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
      content: function() {
        trigger.cancel();
      }
    },
    //黑键
    yiyinmrfz: {
      audio: 2,
      chargeSkill: true,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.countMark("charge") > 2) return false;
        return player2.hasCard(function(card2) {
          return get.tag(card2, "damage");
        }, "h");
      },
      filterCard: function(card2) {
        return get.tag(card2, "damage");
      },
      selectCard: function() {
        var player2 = _status.event.player;
        return [1, 3 - player2.countMark("charge")];
      },
      check: function(card2) {
        var player2 = _status.event.player;
        if (player2.countCards(function(card3) {
          return card3.name == "sha";
        }) > player2.getCardUsable("sha") + 1)
          return true;
        return card2.name != "sha";
      },
      content: function() {
        player.addMark("charge", cards.length);
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
          content: function() {
            if (!trigger.baseDamage) trigger.baseDamage = 1;
            trigger.baseDamage++;
            player.removeMark("charge");
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
          content: function() {
            player.addMark("charge");
          }
        }
      }
    },
    huangxiangmrfz: {
      audio: 2,
      trigger: { player: "phaseDiscardEnd" },
      filter: function(event2, player2) {
        if (player2.hasCard(function(card2) {
          return card2.hasGaintag("huangxiangmrfzx");
        }, "h"))
          return false;
        return player2.countMark("charge") > 0 && player2.countCards("h") > 0;
      },
      direct: true,
      content: function() {
        "step 0";
        player.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h").set("ai", function(card2) {
          if (card2.name == "shan" && card2.name == "wuxie") return 6;
          if (card2.name == "sha" && card2.name == "tao" && card2.name == "jiu") return 5;
          return 6 - get.value(card2);
        });
        if (result.bool) {
          player.logSkill("huangxiangmrfz");
          player.addGaintag(result.cards, "huangxiangmrfzx");
          player.removeMark("charge");
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
              return player2.hasCard(function(card2) {
                return card2.hasGaintag("huangxiangmrfzx");
              }, "h");
            if (event2.name == "lose") {
              for (var i2 in event2.gaintag_map) {
                if (event2.gaintag_map[i2].includes("huangxiangmrfzx")) return true;
              }
              return false;
            }
            return false;
          },
          content: function() {
            "step 0";
            var history = game.getAllGlobalHistory("useCard");
            for (var i2 = history.length - 1; i2 > 0; i2--) {
              if (!history[i2].targets) continue;
              if (history[i2].targets.includes(player) && history[i2].player != player) {
                event.targets = history[i2].player;
                break;
              }
            }
            player.chooseControl(
              event.targets ? ["摸牌", "对" + get.translation(event.targets) + "造成一点伤害", "cancel2"] : ["摸牌", "cancel2"]
            ).set("ai", function() {
              var player2 = _status.event.player;
              if (event.targets) {
                if (get.damageEffect(event.targets, player2, player2) > 0) return 1;
                return 0;
              } else return 0;
            }).set("prompt", "【荒响】:请选择一项");
            if (result.control != "cancel2") {
              player.logSkill("huangxiangmrfz");
              if (result.control == "摸牌") {
                player.draw();
                if (player.countMark("charge") < 3) player.addMark("charge");
              } else event.targets.damage();
            } else event.finish();
            if (!player.hasCard(function(card2) {
              return card2.hasGaintag("huangxiangmrfzx");
            }, "h") && player.countMark("charge") > 0) {
              player.chooseCard(get.prompt("huangxiangmrfz"), "你可以消耗一点蓄力值并标记一张手牌", "h").set("ai", function(card2) {
                if (card2.name == "shan" && card2.name == "wuxie") return 6;
                if (card2.name == "sha" && card2.name == "tao" && card2.name == "jiu") return 5;
                return 6 - get.value(card2);
              });
            }
            if (result.bool) {
              player.logSkill("huangxiangmrfz");
              player.addGaintag(result.cards, "huangxiangmrfzx");
              player.removeMark("charge");
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
        return player2.hasCard(function(card2) {
          return card2.name == "sha";
        }, "h") > 0;
      },
      content: function() {
        var list = ["jiyinmrfz_eff1", "jiyinmrfz_lose", "jiyinmrfz_eff4", "jiyinmrfz_eff2", "jiyinmrfz_eff3"];
        player.storage.jiyinmrfz = true;
        for (i of list) player.addTempSkill(i);
      },
      subSkill: {
        lose: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.storage.jiyinmrfz = false;
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
          content: function() {
            "step 0";
            var target2 = trigger.targets[0], buff = 0;
            if (!game.hasPlayer(function(current) {
              return current != target2 && current.countCards("h") > target2.countCards("h");
            }))
              buff++;
            if (!game.hasPlayer(function(current) {
              return current != target2 && current.hp > target2.hp;
            }))
              buff++;
            if (!game.hasPlayer(function(current) {
              return current != target2 && current.countCards("e") > target2.countCards("e");
            }))
              buff++;
            if (buff == 3) {
              player.storage.jiyinmrfz_eff1 = true;
              player.addTempSkill("jiyinmrfz_eff1_buff2", "shaAfter");
            }
            player.addTempSkill("jiyinmrfz_eff1_buff", "shaAfter");
          },
          mod: {
            playerEnabled: function(card2, player2, target2) {
              if ((target2.isMaxHp() || target2.isMaxHandcard() || target2.isMaxEquip()) && card2.name == "sha") return true;
              else if (card2.name == "sha") return false;
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
          content: function() {
            var target2 = trigger.player;
            if (player.storage.jiyinmrfz_eff1) {
              trigger.num = target2.hp;
            } else trigger.num = Math.max(Math.min(target2.hp - 1, player.countMark("charge")), 1);
            player.removeSkill("jiyinmrfz_eff1_buff");
          }
        },
        eff1_buff2: {
          silent: true,
          charlotte: true,
          trigger: { player: "shaEnd" },
          content: function() {
            player.storage.jiyinmrfz_eff1 = false;
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
          content: function() {
            var targets2 = trigger.target;
            var id = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
              map[id].shanRequired += targets2.hp - 1;
            } else {
              map[id].shanRequired = targets2.hp;
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
              for (var i2 = 0; i2 < game.players.length; i2++) {
                if (game.players[i2].isMaxHp() && game.players[i2].isMaxHandcard() && game.players[i2].isMaxEquip())
                  list.add(get.translation(game.players[i2]));
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
          content: function() {
            player.removeMark("charge", trigger.num);
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
        playerEnabled: function(card2, player2, target2) {
          var gone = [];
          for (var i2 = 0; i2 < game.players.length; i2++) {
            var players = game.players[i2];
            if (players.isAction()) gone.add(players);
          }
          if (target2 != player2 && _status.currentPhase == player2) {
            if (!gone.includes(target2) && player2.storage.yanmomrfz == true) return false;
            if (gone.includes(target2) && player2.storage.yanmomrfz == false) return false;
          }
        }
      },
      trigger: { player: "phaseBegin" },
      direct: true,
      content: function() {
        "step 0";
        var num = 0, gone = [], wlgo = [];
        for (var i2 = 0; i2 < game.players.length; i2++) {
          var players = game.players[i2];
          if (players.isAction()) gone.add(players);
          else wlgo.add(players);
        }
        player.chooseControl().set("choiceList", [
          "只能指定本轮<font color=#f61e46>已进行</font>回合的其他角色<br>(" + get.translation(gone) + ")",
          "只能指定本轮<font color=#f61e46>未进行</font>回合的其他角色<br>(" + get.translation(wlgo) + ")"
        ]).set("ai", function() {
          if (num > game.players.length - num) return 0;
          return 1;
        });
        if (result.index == 0) {
          player.storage.yanmomrfz = true;
        } else player.storage.yanmomrfz = false;
        player.logSkill("yanmomrfz");
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
          content: function() {
            player.storage.yanmomrfz_eff = true;
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            game.countPlayer(function(current) {
              current.storage.yanmomrfz_eff = false;
            });
          }
        },
        add: {
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            if (get.type(event2.card) == "delay") return false;
            if (get.type(event2.card) == "equip") return false;
            return game.hasPlayer(function(current) {
              return !event2.targets.includes(current) && player2.canUse(event2.card, current) && current != player2;
            });
          },
          check: function(event2, player2) {
            var num = 0;
            for (var i2 = 0; i2 < game.players.length; i2++) {
              if (game.players[i2] == player2 || event2.targets.includes(game.players[i2])) continue;
              if (!player2.inRange(game.players[i2])) continue;
              if (player2.canUse(event2.card, game.players[i2])) {
                num = num + get.attitude(player2, game.players[i2]);
              }
            }
            return num > -1;
          },
          prompt: function(event2, player2) {
            var list = [];
            for (var i2 = 0; i2 < game.players.length; i2++) {
              if (game.players[i2] == player2 || event2.targets.includes(game.players[i2])) continue;
              if (!player2.inRange(game.players[i2])) continue;
              if (player2.canUse(event2.card, game.players[i2])) list.add(get.translation(game.players[i2]));
            }
            return "是否增加" + list + "为" + get.translation(event2.card) + "的目标？";
          },
          content: function() {
            "step 0";
            var targets2 = [];
            for (var i2 = 0; i2 < game.players.length; i2++) {
              if (game.players[i2] == player || trigger.targets.includes(game.players[i2])) continue;
              if (!player.inRange(game.players[i2])) continue;
              if (player.canUse(trigger.card, game.players[i2])) {
                targets2.push(game.players[i2]);
                player.line(game.players[i2]);
              }
            }
            if (targets2.length > 0) {
              if (!event.isMine() && !event.isOnline()) game.delayx();
              event.targets = targets2;
            } else {
              event.finish();
            }
            player.logSkill("yanmomrfz");
            game.log(event.targets, "成为了", trigger.card, "的目标");
            trigger.targets.addArray(event.targets);
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
      content: function() {
        trigger.player.addMark("yanbaomrfz", false);
        trigger.player.storage.yanbaomrfz2 = true;
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          firstDo: true,
          content: function() {
            player.removeMark("yanbaomrfz", false);
            player.storage.yanbaomrfz2 = false;
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
          content: function() {
            trigger.num++;
            player.removeMark("yanbaomrfz", false);
            player.logSkill("yanbaomrfz");
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
      content: function() {
        player.addTempSkill("huishenmrfz_eff", "useCardAfter");
      },
      subSkill: {
        eff: {
          silent: true,
          trigger: { player: "useCardToPlayered" },
          filter: function(event2, player2) {
            return event2.target != player2;
          },
          content: function() {
            "step 0";
            trigger.target.chooseToDiscard("弃置一张手牌，或令" + get.translation(player) + "摸一张牌").set("ai", function(card2) {
              var trigger2 = _status.event.getTrigger();
              return -get.attitude(trigger2.target, trigger2.player) - get.value(card2);
            });
            if (result.bool == false) player.draw();
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
      content: function() {
        "step 0";
        game.countPlayer(function(current) {
          if (current.hasSkill("renbenmrfz2")) current.removeSkill("renbenmrfz2");
          if (current.hasSkill("renbenmrfz3")) current.removeSkill("renbenmrfz3");
        });
        var list = lib.inpile;
        var list2 = [];
        for (var i2 = 0; i2 < list.length; i2++) {
          var name = list[i2];
          var type = get.type(name);
          if (name == "sha") {
            list2.push(["基本", "", "sha"]);
          } else if (type == "basic") {
            list2.push(["基本", "", list[i2]]);
          } else if (type == "trick") {
            list2.push(["锦囊", "", list[i2]]);
          }
        }
        if (!list.length) event.finish();
        else {
          event.cards = list2;
          event.cards2 = [];
          event.num = 0;
        }
        if (event.num < game.players.length)
          game.players[event.num].chooseButton(true, ["【人本】:请声明一张牌</br>科学理应注视每一个人", [event.cards, "vcard"]]).set("ai", function(button) {
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
          });
        else event.goto(3);
        if (result.bool) {
          event.cards2.add2(result.links[0][2]);
          game.log(game.players[event.num], "声明了", result.links[0][2]);
          if (event.num < game.players.length) {
            event.num++;
            event.goto(1);
          }
        }
        var maxCard = game.mostStr(event.cards2);
        if (maxCard.length == 1) {
          game.log("本轮游戏不能使用、打出或弃置", maxCard);
          player.popup(maxCard);
          player.storage.renbenmrfz = maxCard;
          for (var i2 = 0; i2 < game.players.length; i2++) {
            if (game.players[i2].storage.renbenmrfz != maxCard) game.players[i2].storage.renbenmrfz = maxCard;
          }
          event.goto(6);
        } else event.cards3 = maxCard;
        player.chooseButton([true, "【人本】:请选择一张牌</br>科学理应注视每一个人", [event.cards3, "vcard"]]);
        if (result.bool) {
          game.log("本轮游戏不能使用、打出或弃置", result.links[0][2]);
          player.popup(result.links[0][2]);
          player.storage.renbenmrfz = result.links[0][2];
          for (var i2 = 0; i2 < game.players.length; i2++) {
            if (game.players[i2].storage.renbenmrfz != result.links[0][2]) game.players[i2].storage.renbenmrfz = result.links[0][2];
          }
        }
        event.num2 = 0;
        if (event.num2 < game.players.length) {
          if (game.players[event.num2] != player)
            game.players[event.num2].chooseControl("是", "否").set("prompt", "【人本】:是否遵守协议？(不能使用或打出" + get.translation(player.storage.renbenmrfz) + ")").set("ai", function() {
              var player2 = _status.event.player;
              if (!player2.getEquip(1)) return 0;
              if (game.hasPlayer(function(current) {
                return get.distance(player2, current) <= 1 && player2 != current && get.attitude(player2, current) < 0;
              }) || player2.storage.renbenmrfz == "sha" && Math.random() > 0.4)
                return 1;
              return 0;
            });
          else {
            event.num2++;
            event.redo();
          }
        } else event.finish();
        if (result.index == 0) {
          game.players[event.num2].addSkill("renbenmrfz2");
        } else if (result.index == 1) {
          game.players[event.num2].addSkill("renbenmrfz3");
        }
        if (event.num2 < game.players.length) {
          event.num2++;
          event.goto(7);
        }
      },
      global: "renbenmrfz_use",
      subSkill: {
        use: {
          mod: {
            cardDiscardable: function(card2, player2) {
              if (get.name(card2) == player2.storage.renbenmrfz && (player2.hasSkill("renbenmrfz2") || player2.hasSkill("renbenmrfz")))
                return false;
            },
            cardEnabled2: function(card2, player2) {
              if (get.name(card2) == player2.storage.renbenmrfz && (player2.hasSkill("renbenmrfz2") || player2.hasSkill("renbenmrfz")))
                return false;
            },
            ignoredHandcard: function(card2, player2) {
              if (get.name(card2) == player2.storage.renbenmrfz && player2.hasSkill("renbenmrfz")) {
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
      filterCard: function(card2, player2) {
        return card2.name == player2.storage.renbenmrfz;
      },
      discard: false,
      lose: false,
      filter: function(event2, player2) {
        return player2.hasCard(function(card2) {
          return card2.name == player2.storage.renbenmrfz;
        }, "h");
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.hasSkill("renbenmrfz");
      },
      content: function() {
        player.draw();
        player.give(cards, target);
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
          content: function() {
            player.removeSkill("renbenmrfz2");
          }
        }
      },
      ai: {
        order: 13,
        result: {
          player: function(player2, target2) {
            if (get.attitude(player2, target2) > 0) return 1;
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
          return "不接受《特里蒙科学伦理宣言》</br>当前攻击距离为" + player2.getAttackRange();
        }
      },
      mod: {
        attackRange: function(player2, num) {
          var atk = 0;
          for (var i2 = 0; i2 < game.players.length; i2++) {
            if (game.players[i2] == player2) continue;
            if (game.players[i2].hasSkill("renbenmrfz2")) atk++;
          }
          return num - Math.max(2, atk);
        }
      }
    },
    dizhumrfz: {
      audio: 2,
      trigger: { player: "phaseUseBegin" },
      direct: true,
      content: function() {
        "step 0";
        game.countPlayer(function(current) {
          current.removeSkill("dizhumrfzx");
        });
        player.chooseTarget("【砥柱】:你可以选择至多两名角色，令其获得‘夜灯’标记", [0, 2]).set("ai", function(target2) {
          return get.attitude(_status.event.player, target2) > 2;
        });
        if (result.bool) {
          var targets2 = result.targets;
          player.logSkill("dizhumrfz");
          for (i of targets2) {
            i.addSkill("dizhumrfzx");
            i.storage.dizhumrfz = true;
            player.line(i);
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
      content: function() {
        if (trigger.num < player.hp) trigger.num--;
        else trigger.num = 0;
        player.removeMark("dizhumrfz");
        player.removeSkill("dizhumrfzx");
        player.logSkill("dizhumrfz");
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
      content: function() {
        trigger.player.draw();
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
      content: function() {
        "step 0";
        if (trigger.card) {
          var cards2 = trigger.card;
          player.chooseToDiscard(
            "he",
            get.prompt("gaihuamrfz"),
            "是否弃置一张非" + get.translation(get.type(cards2)) + "牌令此伤害+1",
            function(card2) {
              return get.type(card2) != get.type(cards2);
            }
          ).set("goon", get.attitude(player, trigger.player) < 0).set("ai", function(card2) {
            if (!_status.event.goon) return 0;
            return 7 - get.value(card2);
          });
        } else {
          player.chooseToDiscard(get.prompt("gaihuamrfz"), "是否弃置一张牌令此伤害+1").set("goon", get.attitude(player, trigger.player) < 0).set("ai", function(card2) {
            if (!_status.event.goon) return 0;
            return 7 - get.value(card2);
          });
        }
        if (result.bool) {
          trigger.num++;
          player.logSkill("gaihuamrfz", trigger.player);
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
      content: function() {
        "step 0";
        var go = false;
        if (game.hasPlayer(function(current) {
          return get.distance(player, current) <= 1 && get.attitude(player, current) > 2 && current.getDamagedHp() > 2;
        })) {
          go = true;
        } else if (!game.hasPlayer(function(current) {
          return get.distance(player, current) <= 1 && get.attitude(player, current) > 0 && current.getDamagedHp() > 0 && current != player;
        }) && player.getDamagedHp() > 0) {
          go = true;
        }
        player.addTempSkill("yaopeimrfz2", "phaseUseAfter");
        player.chooseTarget(
          "【药配】:选择一名与你距离不大于1的角色令其回血，或选择‘取消’令攻击范围内的所有角色回复一点体力",
          function(card2, target2, player2) {
            return get.distance(player2, target2) <= 1 && target2.getDamagedHp() > 0;
          }
        ).set("go", go).set("ai", function(target2) {
          var player2 = _status.event.player;
          if (go) return get.attitude(player2, target2) > 2;
          return 0;
        });
        if (result.bool) {
          var targets2 = result.targets[0];
          targets2.recover();
          if (targets2.getDamagedHp() >= 3) targets2.recover();
        } else {
          for (var i2 = 0; i2 < game.players.length; i2++) {
            var targets2 = game.players;
            if (player.inRange(targets2[i2]) || targets2[i2] == player) targets2[i2].recover();
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
            for (var i2 = 0; i2 < game.players.length; i2++) {
              var targetx2 = game.players;
              if (!player2.inRange(targetx2[i2])) continue;
              if (get.attitude(player2, targetx2[i2]) > 0 && targetx2[i2].getDamagedHp() > 0) num++;
              if (get.attitude(player2, targetx2[i2]) <= 0 && targetx2[i2].getDamagedHp() > 0) num--;
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
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num - 1;
        }
      }
    },
    //焰影苇草
    minghuomrfz: {
      audio: 4,
      trigger: { player: "phaseZhunbeiBegin" },
      direct: true,
      content: function() {
        "step 0";
        if (player.hasSkill("minghuomrfz_buff1")) player.removeSkill("minghuomrfz_buff1");
        if (player.hasSkill("minghuomrfz_buff2")) player.removeSkill("minghuomrfz_buff2");
        player.chooseControl().set("choiceList", [
          "每回合你使用的第一张单一目标的普通锦囊或【杀】可以额外指定一个目标",
          "当有‘灼痕’标记的角色进入濒死状态时，你可以令其上家或下家获得一个‘灼痕’标记",
          '<span style="text-decoration:line-through">真的会有人选这个选项吗？</span>不发动此技能'
        ]).set("ai", function() {
          if (game.countPlayer(function(current) {
            var curnext = current.getNext(), curpre = current.getPrevious();
            return current != player && current.hasMark("zhuohenmrfz") && current.hp < 2 && (get.attitude(player, curnext) || get.attitude(player, curpre));
          }) > 0)
            return 1;
          return 0;
        });
        if (result.index != 2) {
          if (result.index == 0) player.addSkill("minghuomrfz_buff1");
          else player.addSkill("minghuomrfz_buff2");
          player.logSkill("minghuomrfz");
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
              return !event2.targets.includes(current) && player2.canUse(event2.card, current);
            });
          },
          direct: true,
          content: function() {
            "step 0";
            player.chooseTarget(
              get.prompt("minghuomrfz"),
              "为" + get.translation(trigger.card) + "增加一个目标",
              function(card2, player2, target2) {
                return !_status.event.sourcex.includes(target2) && player2.canUse(_status.event.card, target2);
              }
            ).set("sourcex", trigger.targets).set("ai", function(target2) {
              var player2 = _status.event.player;
              return get.effect(target2, _status.event.card, player2, player2);
            }).set("card", trigger.card);
            if (result.bool) {
              if (!event.isMine() && !event.isOnline()) game.delayx();
              event.target = result.targets[0];
              player.addTempSkill("minghuomrfz_mark", "phaseEnd");
            } else {
              event.finish();
            }
            player.logSkill("minghuomrfz", event.target);
            trigger.targets.push(event.target);
          }
        },
        buff2: {
          trigger: { global: "dying" },
          direct: true,
          filter: function(event2, player2) {
            if (event2.player.getNext().hasMark("zhuohenmrfz") && event2.player.getPrevious().hasMark("zhuohenmrfz")) return false;
            return game.players.length > 2 && event2.player.hasMark("zhuohenmrfz");
          },
          content: function() {
            "step 0";
            var target2 = trigger.player;
            player.chooseTarget(
              get.prompt("minghuomrfz"),
              "你可以令" + get.translation(target2) + "的上家或下家（不能是你）获得一个‘灼痕’标记",
              function(card2, player2, target3) {
                return !target3.hasMark("zhuohenmrfz") && target3 != player2 && (target3 == _status.event.TriPlayer.getNext() || target3 == _status.event.TriPlayer.getPrevious());
              }
            ).set("TriPlayer", trigger.player).set("ai", function(player2, target3) {
              if (get.attitude(player2, targetx.getNext()) > 2 && get.attitude(player2, targetx.getNext()) > 2) return 0;
              return get.attitude(player2, target3) < 2;
            }).set("targetx", trigger.player);
            if (result.bool) {
              var target2 = result.targets[0];
              target2.addMark("zhuohenmrfz");
              player.logSkill("zhuohenmrfz", target2);
              if (target2.countCards("h") > 0) target2.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
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
      content: function() {
        "step 0";
        player.chooseTarget(
          true,
          get.prompt("yingyaomrfz"),
          "你可以选择一名在你攻击范围内的角色，令其回复一点体力，若其为你，你摸一张牌",
          function(card2, player2, target3) {
            return player2.inRange(target3) && target3.getDamagedHp() > 0 || target3 == player2;
          }
        ).set("ai", function(target3) {
          return get.attitude(_status.event.player, target3) > 2;
        });
        if (result.bool) {
          var target2 = result.targets[0];
          target2.recover();
          player.addMark("yingyaomrfz", false);
          if (target2 == player) player.draw();
        }
      },
      group: "yingyaomrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          firstDo: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            player.removeMark("yingyaomrfz", player.countMark("yingyaomrfz"), false);
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
      content: function() {
        var target2 = trigger.target;
        target2.addMark("zhuohenmrfz");
        target2.addSkill("zhuohenmrfz_clear");
        target2.addTempSkill("zhuohenmrfz2");
        if (target2.countCards("h") > 0) target2.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
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
          content: function() {
            player.draw();
          }
        },
        clear: {
          silent: true,
          firstDo: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.removeMark("zhuohenmrfz");
            player.removeSkill("zhuohenmrfz_clear");
          }
        },
        debuff: {
          charlotte: true,
          direct: true,
          trigger: { global: "damageBegin" },
          filter: function(event2, player2) {
            return event2.player != player2 && event2.player.hasMark("zhuohenmrfz") && event2.player.countCards("h") > 0;
          },
          content: function() {
            trigger.player.chooseToDiscard("h", true, "【灼痕】:请选择弃置一张手牌");
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
        for (var i2 = 0; i2 < event2.targets.length; i2++) {
          if (event2.targets[i2].hasMark("kuangyumrfz")) {
            return true;
          }
        }
        return false;
      },
      content: function() {
        for (var i2 = 0; i2 < trigger.targets.length; i2++) {
          if (trigger.targets[i2].hasMark("kuangyumrfz")) {
            trigger.targets[i2].addTempSkill("fengyin");
            trigger.targets[i2].addSkill("chuangzhongmrfz_eff");
          }
        }
      },
      subSkill: {
        eff: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseDiscardEnd" },
          content: function() {
            player.removeSkill("chuangzhongmrfz_eff");
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
      content: function() {
        var target2 = trigger.target;
        target2.addMark("kuangyumrfz");
        target2.addSkill("kuangyumrfz_clear");
        target2.addTempSkill("kuangyumrfz2");
        target2.addSkill("kuangyumrfz_skip");
        if (player.inRange(target2)) player.addTempSkill("kuangyumrfz_damage", "useCardAfter");
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
          content: function() {
            player.storage.kuangyumrfz = false;
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.removeMark("kuangyumrfz");
            player.removeSkill("kuangyumrfz_clear");
          }
        },
        skip: {
          audio: "kuangyumrfz",
          forced: true,
          charlotte: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            var phase = ["phaseBegin", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"].randomGet2(2);
            for (var i2 = 0; i2 < phase.length; i2++) {
              player.skip(phase[i2]);
            }
            game.log(player, "因【狂语】将会跳过", get.tranPhase(phase[0]), "和", get.tranPhase(phase[1]));
            player.removeSkill("kuangyumrfz_skip");
          }
        },
        damage: {
          audio: "kuangyumrfz",
          trigger: { source: "damageBegin" },
          forced: true,
          filter: function(event2, player2) {
            return event2.player.hasMark("kuangyumrfz");
          },
          content: function() {
            trigger.num++;
            player.storage.kuangyumrfz = true;
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
        if (player2.countCards("h", function(card2) {
          return get.tag(card2, "damage") || get.type(card2) == "trick" && !get.tag(card2, "damage") || get.type(card2) == "delay";
        }) > 1)
          return false;
        return true;
      },
      content: function() {
        if (!player.hasMark("jihumrfz")) player.addMark("jihumrfz", false);
        player.addTempSkill("zishou2");
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
          content: function() {
            player.removeMark("jihumrfz", false);
          }
        },
        buff: {
          trigger: { target: "useCardToTargeted" },
          usable: 1,
          filter: function(event2, player2) {
            if (get.type(event2.card) == "delay" || get.type(event2.card) == "equip") return false;
            if (!player2.hasMark("jihumrfz")) return false;
            return event2.player != player2 && (player2.canUse(event2.card, event2.player, false) || game.hasPlayer(function(current) {
              return current != player2 && get.distance(player2, current) <= 1 && player2.canUse(event2.card, current, "nodistance");
            }));
          },
          direct: true,
          content: function() {
            "step 0";
            player.chooseTarget(function(card2, player2, target2) {
              return player2.canUse(trigger.card, target2, false) && target2 != player2 && (get.distance(player2, target2) <= 1 || target2 == _status.event.TriPlayer);
            }).set("TriPlayer", trigger.player).set("prompt", get.prompt("jihumrfz")).set("prompt2", "【棘护】:你可以使用一张【" + get.translation(trigger.card.name) + "】").ai = function(target2) {
              return -get.attitude(player, target2);
            };
            if (result.bool) {
              player.useCard({ name: trigger.card.name, isCard: true }, result.targets[0], false);
              player.logSkill("jihumrfz");
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
      content: function() {
        "step 0";
        player.addMark("re_jianshumrfz", false);
        var num = player.countMark("re_jianshumrfz");
        if (num % 10 == 0) {
          player.logSkill("jianshumrfz");
          if (num == 10) {
            player.addSkill("re_jianshumrfz_usesha");
            player.addMark("re_jianshumrfz_time", false);
            player.addMark("re_jianshumrfz_draw", false);
            player.addMark("re_jianshumrfz_range", false);
          }
          if (num == 20) {
            player.addMark("re_jianshumrfz_time", false);
            player.addMark("re_jianshumrfz_range", false);
            player.removeSkill("jihumrfz");
            player.addSkill("re_chaoshengmrfz");
          }
        }
      },
      group: ["re_jianshumrfz_time", "re_jianshumrfz_range", "re_jianshumrfz_draw"],
      subSkill: {
        time: {
          charlotte: true,
          onremove: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              if (card2.name == "sha") return num + player2.countMark("re_jianshumrfz_time");
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
          content: function() {
            trigger.num++;
            player.logSkill("jianshumrfz");
          }
        },
        usesha: {
          direct: true,
          trigger: { player: "phaseUseBegin" },
          content: function() {
            "step 0";
            player.chooseTarget("选择一名其他角色视为对其使用一张【杀】", function(card2, player2, target3) {
              return target3 != player2 && player2.inRange(target3);
            }).ai = function(target3) {
              return -get.attitude(player, target3);
            };
            if (result.bool) {
              var target2 = result.targets[0];
              player.useCard({ name: "sha" }, true, false, target2);
              player.logSkill("jianshumrfz");
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
      content: function() {
        player.draw(2);
        player.recover();
      }
    },
    //煌
    yanxunmrfz: {
      audio: 4,
      trigger: { player: "damageBegin" },
      forced: true,
      filter: function(event2, player2) {
        return event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2";
      },
      content: function() {
        trigger.num--;
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
          content: function() {
            trigger.num -= 2;
          }
        },
        kaishi: {
          direct: true,
          trigger: { global: "roundStart" },
          popup: false,
          content: function() {
            "step 0";
            if (player.isLinked()) {
              player.link();
              player.logSkill("yanxunmrfz");
            }
            if (player.isTurnedOver()) {
              player.chooseBool().set("prompt", get.prompt("yanxunmrfz")).set("prompt2", "【严训】:是否翻面并跳过下个出牌阶段？").set("ai", function() {
                var player2 = _status.event.player;
                return player2.countCards("h") < player2.getHandcardLimit() * 2;
              });
            }
            if (result.bool) {
              player.turnOver();
              player.addSkill("yanxunmrfz_skipped");
              player.logSkill("yanxunmrfz");
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
          content: function() {
            player.skip("phaseUse");
            game.log(player, "的出牌阶段将被跳过");
            player.removeSkill("yanxunmrfz_skipped");
          }
        },
        draw: {
          audio: "yanxunmrfz",
          trigger: { player: "phaseUseBegin" },
          filter: function(event2, player2) {
            return player2.getHistory("skipped").includes("phaseDraw");
          },
          frequent: true,
          prompt: "【严训】:是否摸一张牌?",
          content: function() {
            player.draw();
          }
        },
        use: {
          audio: "yanxunmrfz",
          trigger: { player: "phaseDiscardBefore" },
          filter: function(event2, player2) {
            var cardh = player2.getCards("h"), canuse = false;
            for (var i2 = 0; i2 < cardh.length; i2++) {
              if (player2.canUseToAnyone(cardh[i2])) {
                canuse = true;
                break;
              }
            }
            return player2.getHistory("skipped").includes("phaseUse") && canuse == true;
          },
          prompt: "【严训】:是否使用至多两张手牌?",
          content: function() {
            "step 0";
            event.num = 0;
            var cardh = player.getCards("h"), list = [], cards2 = [];
            event.num++;
            for (var i2 = 0; i2 < cardh.length; i2++) {
              cards2.push(cardh[i2].name);
            }
            for (var name of lib.inpile) {
              if (!cards2.includes(name)) continue;
              var card2 = { name, isCard: true };
              if (!player.canUseToAnyone(card2)) continue;
              if (get.type(card2) == "basic") {
                list.push(["基本", "", name]);
              } else if (get.type(card2) == "trick" || get.type(card2) == "delay") {
                list.push(["锦囊", "", name]);
              } else if (get.type(card2) == "equip") {
                list.push(["装备", "", name]);
              }
            }
            if (list.length) player.chooseButton(["【严训】:请选择你要使用的手牌(" + event.num + "/2)", [list, "vcard"]], "hidden");
            else event.finish();
            if (result.bool) {
              var name = result.links[0][2];
              player.chooseToUse(
                function(card3, player2, event2) {
                  return get.name(card3) == name;
                },
                "【严训】:你可以使用一张" + get.translation(name)
              );
              if (event.num < 2) event.goto(1);
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
      content: function() {
        player.storage.chuchanmrfz = true;
        player.recoverTo(2);
        player.addSkill("chuchanmrfz_buff1");
        player.addSkill("chuchanmrfz_buff2");
        player.awakenSkill(event.name);
      },
      subSkill: {
        buff1: {
          audio: "chuchanmrfz",
          trigger: { player: "damageEnd" },
          firstDo: true,
          forced: true,
          charlotte: true,
          content: function() {
            player.recover();
          },
          ai: {
            effect: {
              target: function(card2, player2, target2, current) {
                if (get.tag(card2, "damage")) return "zerotarget";
                if (get.type(card2) == "trick" && get.tag(card2, "damage")) {
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
          content: function() {
            player.removeSkill(["chuchanmrfz_buff1", "chuchanmrfz_buff2"]);
          }
        }
      }
    },
    feixuemrfz: {
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num + player2.storage.feixuemrfz;
        }
      },
      init: function(player2) {
        player2.storage.feixuemrfz = 0;
      },
      onremove: true,
      audio: 4,
      trigger: { player: ["loseHpEnd", "damageEnd"] },
      content: function() {
        "step 0";
        event.num = trigger.num;
        event.num--;
        var card2 = get.cardPile2(function(card3) {
          return get.name(card3) == "sha" && card3.nature == "fire";
        });
        if (card2) player.gain(card2, "gain2", "log");
        else {
          player.draw();
        }
        if (trigger.source && trigger.source.countCards("e") > 0) {
          player.storage.feixuemrfz += 1;
          player.discardPlayerCard(trigger.source, "e", false).set("forceAuto", true).boolline = true;
        }
        if (event.num > 0) event.goto(1);
      },
      group: "feixuemrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          content: function() {
            player.storage.feixuemrfz = 0;
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
      content: function() {
        var target2 = trigger.player;
        target2.addMark("hualaomrfz", trigger.num + 1, false);
        target2.addSkill("hualaomrfz_eff");
        trigger.num = 0;
      },
      subSkill: {
        eff: {
          trigger: { player: "damageBegin2" },
          filter: function(event2, player2) {
            return player2.hasMark("hualaomrfz");
          },
          charlotte: true,
          direct: true,
          content: function() {
            trigger.num += player.countMark("hualaomrfz");
            player.removeMark("hualaomrfz", player.countMark("hualaomrfz"), false);
            player.logSkill("hualaomrfz");
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
      content: function() {
        trigger.player.addMark("huhuomrfz", false);
        trigger.player.addSkill("huhuomrfz2");
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return player2.hasMark("huhuomrfz");
          },
          content: function() {
            player.removeMark("huhuomrfz", player.countMark("huhuomrfz"), false);
            trigger.player.removeSkill("huhuomrfz2");
          }
        }
      }
    },
    huhuomrfz2: {
      direct: true,
      charlotte: true,
      trigger: { player: "phaseDrawBegin2" },
      content: function() {
        trigger.num -= player.countMark("huhuomrfz");
      },
      group: ["huhuomrfz2_draw", "huhuomrfz_clear"],
      subSkill: {
        draw: {
          charlotte: true,
          direct: true,
          trigger: { player: "phaseUseEnd" },
          content: function() {
            player.draw(player.countMark("huhuomrfz"));
          }
        }
      }
    },
    wuyuemrfz: {
      mod: {
        targetInRange: function(card2, player2, target2, now) {
          if (card2.name == "sha" && get.color(card2) == "black") return true;
        },
        selectTarget: function(card2, player2, range) {
          if (card2.name == "sha" && range[1] != -1 && get.color(card2) == "red") range[1]++;
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
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 6,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return player2.countCards("h") > 0 && game.hasPlayer(function(current) {
          return !current.hasSkill("lichangmrfz2");
        });
      },
      filterTarget: function(card2, player2, target2) {
        return !target2.hasSkill("lichangmrfz2");
      },
      filterCard: true,
      lose: false,
      discard: false,
      delay: 0,
      check: function(card2) {
        var player2 = _status.event.player;
        if (player2.countCards("h", function(card3) {
          return get.type(card3) == "equip";
        }) > 0)
          return get.type(card2) == "equip";
        return 6 - get.value(card2);
      },
      prompt: `请选择一张牌`,
      position: "he",
      content: function() {
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
          content: function() {
            player.addMark("charge");
          }
        },
        dam: {
          audio: "lichangmrfz",
          forced: true,
          trigger: { global: "damageEnd" },
          filter: function(event2, player2) {
            return event2.hujia && event2.player.getExpansions("lichangmrfz").length > 0;
          },
          content: function() {
            var cards2 = trigger.player.getExpansions("lichangmrfz");
            trigger.player.gain(cards2, "gain2");
          }
        },
        da: {
          trigger: { global: "phaseBegin" },
          filter: function(event2, player2) {
            return player2.countMark("charge") >= 3;
          },
          direct: true,
          content: function() {
            "step 0";
            player.chooseTarget(
              get.prompt("lichangmrfz"),
              "【力场】:你可以选择三名角色，令其各从牌堆或弃牌堆中获得一张装备牌",
              [1, 3]
            ).ai = function(target2) {
              return get.attitude(player, target2) > 0;
            };
            if (result.bool) {
              player.removeMark("charge", player.countMark("charge"));
              player.logSkill("lichangmrfz");
              event.targets = result.targets;
              event.num = 0;
              event.num2 = result.targets.length;
            } else event.finish();
            var card2 = get.cardPile(function(card3) {
              return get.type(card3) == "equip";
            });
            event.card = card2;
            var list = game.filterPlayer(function(target2) {
              return target2 != player && target2.hasSkill("lichangmrfz");
            });
            var str = "【力场】:你可以将此牌交给" + get.translation(list);
            if (list.length > 1) str += "其中一人";
            str += ",或取消自己装备此牌";
            event.targets[event.num].gain(card2, "gain");
            event.targets[event.num].chooseTarget(str, function(card3, player2, target2) {
              return target2 != event.targets[event.num] && target2.hasSkill("lichangmrfz");
            }).ai = function(target2) {
              var player2 = event.targets[event.num];
              if (get.attitude(player2, target2) <= 0) return 0;
              return get.attitude(player2, target2) >= 0;
            };
            if (result.bool) {
              if (event.targets[event.num].hasCard(function(card3) {
                return card3 == event.card;
              }, "h"))
                event.targets[event.num].give(event.card, player);
              event.targets[event.num].recover();
            } else if (event.targets[event.num].hasCard(function(card3) {
              return card3 == event.card;
            }, "h"))
              event.targets[event.num].chooseUseTarget(event.card, true);
            if (event.num < event.num2 - 1) {
              event.num++;
              event.goto(2);
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
        if (player2.countCards("he", function(card2) {
          return get.color(card2) == "black";
        }) == 0)
          return false;
        return player2.isPhase("phaseJudge", false) || player2.isPhase("phaseZhunbei", false);
      },
      filterCard: function(card2) {
        return get.color(card2) == "black";
      },
      viewAsFilter: function(player2) {
        if (!player2.isPhase("phaseJudge", false) && !player2.isPhase("phaseZhunbei", false)) return false;
        return player2.countCards("he", { color: "black" }) > 0;
      },
      viewAs: { name: "wuxie" },
      position: "he",
      prompt: "将一张黑色牌当无懈可击使用",
      check: function(card2) {
        var tri = _status.event.getTrigger();
        if (tri && tri.card && tri.card.name == "chiling") return -1;
        return 8 - get.value(card2);
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
    //麦哲伦
    kanchamrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      filterCard: true,
      intro: {
        content: "已发动#次【勘查】"
      },
      check: function(card2) {
        var player2 = _status.event.player;
        if (player2.hasCard(function(card3) {
          return get.type(card3) == "equip";
        }))
          return get.type(card2) == "equip";
        if (player2.hasCard(function(card3) {
          return get.type(card3) == "trick";
        }))
          return get.type(card2) == "trick";
        return 6 - get.value(card2);
      },
      content: function() {
        "step 0";
        event.cards2 = cards2[0];
        player.chooseControl("顶部", "底部").set("prompt", get.prompt("kanchamrfz")).set("prompt2", "【勘查】:请选择展示牌堆顶还是牌堆底" + (player.countMark("kanchamrfz") + 3) + "张牌").set("ai", function() {
          return [0, 1].randomGet();
        });
        var num = player.countMark("kanchamrfz") + 3;
        if (result.index == 0) {
          var cards2 = game.cardsGotoOrdering(get.cards(num)).cards;
          event.cards = cards2;
        } else if (result.index == 1) event.cards = get.bottomCards(num);
        else event.finish();
        var list = [];
        player.showCards(event.cards, get.translation(player) + "发动了【勘查】");
        for (var i2 = 0; i2 < event.cards.length; i2++) {
          if (get.type(event.cards2, "trick") != get.type(event.cards[i2], "trick")) list.push(event.cards[i2]);
        }
        if (list.length) player.gain(list, "gain2");
        if (player.countMark("kanchamrfz") < 3) player.addMark("kanchamrfz", false);
      },
      ai: {
        order: 13,
        threaten: 1.1,
        result: {
          player: 1
        }
      }
    },
    longtengmrfz: {
      markimage: "extension/WhichWay/image/skill/mrfz_LTF.png",
      intro: {
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 8,
      trigger: {
        player: "loseAfter",
        global: "loseAsyncAfter"
      },
      filter: function(event2, player2) {
        if (player2.isPhase("phaseDiscard", false)) return false;
        if (event2.type != "discard" || event2.getlx === false) return;
        var evt = event2.getl(player2);
        for (var i2 = 0; i2 < evt.cards2.length; i2++) {
          if (get.position(evt.cards2[i2], evt.hs.includes(evt.cards2[i2]) ? evt.player : false) == "d") {
            return true;
          }
        }
        return false;
      },
      direct: true,
      content: function() {
        "step 0";
        var cards2 = [];
        var evt = trigger.getl(player);
        for (var i2 = 0; i2 < evt.cards2.length; i2++) {
          if (get.position(evt.cards2[i2]) == "d") {
            cards2.push(evt.cards2[i2]);
          }
        }
        if (!cards2.length) {
          event.finish();
        } else {
          if (cards2.length > 1)
            player.chooseButton(["【龙腾】:请选择一张牌", cards2]).set("ai", (button) => {
              var player2 = _status.event.player;
              if (game.hasPlayer(function(current) {
                return get.attitude(player2, current) > 2;
              }))
                return get.type(button.link) == "equip" || get.type(button.link, "trick") == "trick";
              return get.type(button.link) == "basic";
            });
          else {
            event.cards = cards2;
            event.goto(2);
          }
        }
        if (result.links && result.links.length) {
          event.cards = result.links;
        }
        player.chooseTarget(
          "【龙腾】:请选择一名角色，并将" + get.translation(event.cards) + "(" + get.translation(get.type(event.cards[0], "trick")) + "牌)置于该角色武将牌上",
          function(card2, player2, target3) {
            return target3.getExpansions("longtengmrfz").length == 0;
          }
        ).ai = function(target3) {
          var player2 = _status.event.player;
          var type = get.type2(event.cards[0]);
          if (type == "basic") return -get.attitude(player2, target3);
          else return get.attitude(player2, target3) > 2;
        };
        if (result.bool) {
          var target2 = result.targets[0];
          get.type2(event.cards[0]);
          target2.addToExpansion(event.cards, target2, "give").gaintag.add("longtengmrfz");
          target2.addSkill("longtengmrfz_changeI");
          player.logSkill("longtengmrfz", target2);
        }
      },
      group: "longtengmrfz_clear",
      global: ["longtengmrfz_basic_1", "longtengmrfz_basic_2", "longtengmrfz_trick", "longtengmrfz_equip"],
      subSkill: {
        changeI: {
          silent: true,
          charlotte: true,
          trigger: { player: "longtengmrfzAfter" },
          content: function() {
            player.removeSkill("longtengmrfz_changeI");
            if (player.isTypeExpansions("longtengmrfz", "basic")) player.changeMarkImage("longtengmrfz", "mrfz_LTF");
            if (player.isTypeExpansions("longtengmrfz", "trick")) player.changeMarkImage("longtengmrfz", "mrfz_LTL");
            if (player.isTypeExpansions("longtengmrfz", "equip")) player.changeMarkImage("longtengmrfz", "mrfz_LTA");
          }
        },
        basic_1: {
          charlotte: true,
          forced: true,
          trigger: { player: "phaseDrawBegin" },
          filter: function(event2, player2) {
            return player2.isTypeExpansions("longtengmrfz", "basic");
          },
          content: function() {
            trigger.num--;
            player.logSkill("longtengmrfz");
          }
        },
        basic_2: {
          charlotte: true,
          forced: true,
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.isTypeExpansions("longtengmrfz", "basic");
          },
          content: function() {
            player.draw();
            player.logSkill("longtengmrfz");
          }
        },
        trick: {
          direct: true,
          trigger: { player: "useCard2" },
          filter: function(event2, player2) {
            if (get.type(event2.card, "trick") != "trick") return false;
            if (player2.hasSkill("longtengmrfz_trick2")) return false;
            if (player2.isTypeExpansions("longtengmrfz", "trick") == false) return false;
            var info = get.info(event2.card);
            if (info.allowMultiple == false) return false;
            if (event2.targets && !info.multitarget) {
              if (game.hasPlayer(function(current) {
                return lib.filter.targetEnabled2(event2.card, player2, current) && !event2.targets.includes(current);
              })) {
                return true;
              }
            }
            return false;
          },
          content: function() {
            "step 0";
            player.chooseTarget(
              "【龙腾】:你可以为此牌(" + get.translation(trigger.card) + ")额外指定一个目标",
              function(card2, player2, target2) {
                var player2 = _status.event.player;
                if (_status.event.targets.includes(target2)) return false;
                if (player2.canUse(trigger.card, target2, true) == false) return false;
                return lib.filter.targetEnabled2(_status.event.card, player2, target2);
              }
            ).set("ai", function(target2) {
              var trigger2 = _status.event.getTrigger();
              var player2 = _status.event.player;
              return get.effect(target2, trigger2.card, player2, player2);
            }).set("targets", trigger.targets).set("card", trigger.card);
            if (result.bool) {
              if (!event.isMine() && !event.isOnline()) game.delayx();
              event.targets = result.targets;
            } else {
              event.finish();
            }
            player.logSkill("longtengmrfz", event.targets);
            trigger.targets.addArray(event.targets);
            if (get.tag(trigger.card, "damage")) {
              player.chooseBool("【龙腾】:是否令此牌伤害+1？");
            } else event.finish();
            trigger.baseDamage++;
            player.addTempSkill("longtengmrfz_trick2");
          }
        },
        trick2: {
          charlotte: true
        },
        equip: {
          trigger: { player: "useCard2" },
          firstDo: true,
          filter: function(event2, player2) {
            if (get.type(event2.card) != "basic") return false;
            if (player2.isTypeExpansions("longtengmrfz", "equip") == false) return false;
            return true;
          },
          content: function() {
            "step 0";
            var list = ["不计入次数限制"];
            if (game.hasPlayer(function(current) {
              return !trigger.targets.includes(current) && player.canUse(trigger.card, current, false);
            }))
              list.add("增加目标");
            if (trigger.card.name == "sha") list.add("伤害基数+1");
            player.chooseControl(list).set("prompt", "【龙腾】:请选择一项").set("ai", function() {
              var player2 = _status.event.player, num = [];
              for (var i3 = 0; i3 < list.length; i3++) {
                num.add(i3);
              }
              if (get.name(_status.event.TriCard) == "sha" && player2.getCardUsable("sha") == 0 && player2.countCards("h", "sha") > 0)
                return 0;
              if (get.name(_status.event.TriCard) == "sha" && (player2.countCards("h", "sha") == 0 || player2.getCardUsable("sha") > 0))
                return list.length - 1;
              if (get.name(_status.event.TriCard) == "jiu") return 0;
              return num.randomGet();
            }).set("TriCard", trigger.card);
            game.log(player, "选择了", result.control);
            player.popup(result.control);
            player.logSkill("longtengmrfz");
            if (result.control == "不计入次数限制") {
              if (trigger.addCount !== false && (trigger.card.name == "sha" || trigger.card.name == "jiu")) {
                trigger.addCount = false;
                if (trigger.card.name == "sha") trigger.player.getStat().card.sha--;
                else trigger.player.getStat().card.jiu--;
              }
              event.finish();
            } else if (result.control == "增加目标") {
              player.chooseTarget(
                [1, 2],
                "【龙腾】:你可以为此牌(" + get.translation(trigger.card) + ")额外指定两个目标",
                function(card2, player2, target2) {
                  var player2 = _status.event.player;
                  if (_status.event.targets.includes(target2)) return false;
                  if (player2.canUse(trigger.card, target2, true) == false) return false;
                  return lib.filter.targetEnabled2(_status.event.card, player2, target2);
                }
              ).set("ai", function(target2) {
                var trigger2 = _status.event.getTrigger();
                var player2 = _status.event.player;
                return get.effect(target2, trigger2.card, player2, player2);
              }).set("targets", trigger.targets).set("card", trigger.card);
            } else if (result.control == "伤害基数+1") {
              if (!trigger.baseDamage) trigger.baseDamage = 1;
              trigger.baseDamage += 1;
              event.finish();
            } else event.finish();
            if (result.bool) {
              for (var i2 = 0; i2 < result.targets.length; i2++) {
                trigger.targets.push(result.targets[i2]);
                player.line(result.targets[i2]);
              }
            }
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: ["phaseZhunbeiBegin", "dieBegin"] },
          content: function() {
            game.countPlayer(function(current) {
              var cards2 = current.getExpansions("longtengmrfz");
              if (current.getExpansions("longtengmrfz").length) current.loseToDiscardpile(cards2);
            });
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    //嵯峨
    quanshanmrfz: {
      audio: 2,
      trigger: { global: "phaseEnd" },
      filter: function(event2, player2) {
        return event2.player.countCards("h") == 0 && event2.player != player2;
      },
      prompt: function(event2, player2) {
        return "是否令" + get.translation(event2.player) + "将手牌补至3张并令其获得一些负面效果？";
      },
      check: function(event2, player2) {
        if (event2.player.hp < 2 && get.attitude(player2, event2.player) > 0) return true;
        if (get.attitude(player2, event2.player) > 2 && event2.player.maxHp > 2) return Math.random() > 0.6;
        if (event2.player.hp < 2) return false;
        return get.attitude(player2, event2.player) < 2;
      },
      content: function() {
        var target2 = trigger.player;
        target2.drawTo(Math.min(3, target2.maxHp));
        target2.addSkill("quanshanmrfz_eff");
      },
      group: ["quanshanmrfz_clear", "quanshanmrfz_clear2"],
      subSkill: {
        clear2: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseEnd" },
          filter: function(event2, player2) {
            return event2.player.hasSkill("quanshanmrfz_eff");
          },
          content: function() {
            var target2 = trigger.player;
            target2.removeMark("quanshanmrfz_eff", target2.countMark("quanshanmrfz_eff"));
            target2.removeSkill("quanshanmrfz_eff");
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "dieBegin" },
          filter: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current.hasMark("quanshanmrfz") || current.hasSkill("quanshanmrfz_eff");
            });
          },
          content: function() {
            game.countPlayer(function(current) {
              current.removeMark("quanshanmrfz_eff", current.countMark("quanshanmrfz_eff"));
              current.removeSkill("quanshanmrfz_eff");
            });
          }
        },
        eff: {
          marktext: "恶",
          intro: {
            name: "恶",
            content: "·当你造成伤害时，你获得一个‘恶’</br>·你共有#个‘恶’"
          },
          mark: true,
          trigger: { source: "damageEnd" },
          content: function() {
            "step 0";
            player.logSkill("quanshanmrfz");
            player.addMark("quanshanmrfz_eff");
            if (player.getHandcardLimit() <= 0) {
              event.getParent("phaseUse").skipped = true;
            }
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num - player2.countMark("quanshanmrfz_eff");
            }
          }
        }
      }
    },
    chuemrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer(function(current) {
          return current != player2 && current.countCards("h") > 0 && player2.inRange(current);
        });
      },
      filterTarget: function(card2, player2, target2) {
        return player2.inRange(target2) && target2 != player2 && target2.countCards("h") > 0;
      },
      check: function() {
        return -1;
      },
      selectTarget: [1, 2],
      multitarget: true,
      multiline: true,
      content: function() {
        "step 0";
        event.num = 0;
        var target2 = targets[event.num];
        var hs = target2.getCards("h");
        var colred = false;
        for (var i2 = 0; i2 < hs.length; i2++) {
          if (get.color(hs[i2]) == "red") {
            colred = true;
            break;
          }
        }
        player.viewHandcards(target2);
        game.log(player, "观看了", target2, "的手牌");
        if (colred) {
          var list = [];
          for (var i2 = 0; i2 < hs.length; i2++) {
            if (list.length == 2) break;
            if (get.suit(hs[i2]) == "club" && !list.includes("梅花")) list.add("梅花");
            if (get.suit(hs[i2]) == "spade" && !list.includes("黑桃")) list.add("黑桃");
          }
          list.add("cancel2");
          if (list.length > 1)
            player.chooseControl(list).set("prompt", "【除恶】:请选择一个花色，然后其(" + get.translation(target2) + ")弃置该花色的所有牌").set("ai", function() {
              _status.event.player;
              var hs2 = target2.getCards(), num = 0;
              for (var i3 = 0; i3 < hs2.length; i3++) {
                if (get.suit(hs2[i3]) == "club") num++;
                if (get.suit(hs2[i3]) == "spade") num--;
              }
              if (list.length == 1) return 0;
              if (num > 0) return 0;
              return 1;
            });
        } else if (!colred) {
          player.chooseBool("【除恶】:是否弃置其(" + get.translation(target2) + ")所有手牌？");
          event.goto(3);
        } else event.finish();
        var target2 = targets[event.num];
        if (result.control != "cancel2") {
          var hs = target2.getCards();
          var dis = [];
          for (var i2 = 0; i2 < hs.length; i2++) {
            if (get.suit(hs[i2]) == (result.control == "黑桃" ? "spade" : "club")) dis.push(hs[i2]);
          }
          target2.discard(dis);
          player.draw(dis.length);
        }
        if (event.num < targets.length - 1) {
          event.num++;
          event.goto(1);
        } else event.finish();
        var target2 = targets[event.num];
        if (result.bool) {
          var dis = target2.getCards();
          target2.discard(dis);
          if (target2.hasMark("quanshanmrfz_eff")) {
            target2.damage(target2.countMark("quanshanmrfz_eff"));
            target2.removeMark("quanshanmrfz_eff", target2.countMark("quanshanmrfz_eff"));
          } else event.goto(5);
        }
        if (event.num < targets.length - 1) {
          event.num++;
          event.goto(1);
        } else event.finish();
        var target2 = targets[event.num];
        if (!target2.hasSkill("quanshanmrfz_eff")) {
          target2.drawTo(Math.min(3, target2.maxHp));
          target2.addSkill("quanshanmrfz_eff");
          player.popup("劝善");
          player.logSkill("quanshanmrfz", target2);
        }
        event.goto(4);
      },
      ai: {
        order: 13,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    //新银灰
    xuebianmrfz: {
      intro: {
        content: "已造成#点伤害"
      },
      onremove: true,
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return player2.countCards("h") > 0 && game.hasPlayer(function(current) {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      selectTarget: [1, 2],
      check: function() {
        return -1;
      },
      multitarget: true,
      multiline: true,
      content: function() {
        "step 0";
        event.cards1 = [];
        event.cards2 = [];
        event.cards3 = [];
        for (i2 of targets) i2.addTempSkill("xuebianmrfz2", { player: "phaseEnd" });
        targets.push(player);
        targets.sortBySeat();
        var next = player.chooseCardOL(targets, "请选择要展示的牌", true, [1, 3]).set("ai", function(card2) {
          return -get.value(card2);
        }).set("source", player);
        next.aiCard = function(target2) {
          var hs = target2.getCards("h");
          return { bool: true, cards: [hs.randomGet()] };
        };
        next._args.remove("glow_result");
        var cards2 = [];
        var num = 0;
        event.videoId = lib.status.videoId++;
        for (var i2 = 0; i2 < targets.length; i2++) {
          for (var j = 0; j < result[i2].cards.length; j++) {
            cards2.push(result[i2].cards[j]);
          }
        }
        event.cards = cards2;
        game.log(player, "展示了", targets, "的", cards2);
        game.broadcastAll(
          function(targets2, cards3, id, player2) {
            var dialog = ui.create.dialog(get.translation(player2) + "发动了【雪变】", cards3);
            dialog.videoId = id;
            var getName = function(target2) {
              if (target2._tempTranslate) return target2._tempTranslate;
              var name = target2.name;
              if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
              return get.translation(name);
            };
            for (var i3 = 0; i3 < targets2.length; i3++) {
              if (i3 == 0) event.cards1 = result[i3].cards;
              if (i3 == 1) event.cards2 = result[i3].cards;
              if (i3 == 2) event.cards3 = result[i3].cards;
              for (var j2 = 0; j2 < result[i3].cards.length; j2++) {
                if (i3 == 0) dialog.buttons[j2].querySelector(".info").innerHTML = getName(targets2[i3]);
                else if (i3 == 1)
                  dialog.buttons[j2 + result[i3 - 1].cards.length].querySelector(".info").innerHTML = getName(targets2[i3]);
                else
                  dialog.buttons[j2 + result[i3 - 2].cards.length + result[i3 - 1].cards.length].querySelector(".info").innerHTML = getName(targets2[i3]);
                if (get.color(result[i3].cards[j2]) == "red") num++;
                else num--;
              }
            }
          },
          targets,
          cards2,
          event.videoId,
          player
        );
        game.delay(4);
        if (num > 0) {
          player.chooseTarget("【雪变】：你可以对其中一名角色造成一点伤害并令其弃置其展示的牌", function(card2, player2, target2) {
            return target2 != player2 && target2.hasSkill("xuebianmrfz2");
          }).set("ai", function(target2) {
            var player2 = _status.event.player;
            return get.attitude(player2, target2) < 0;
          });
          event.targets = result;
        } else {
          for (var i2 = 0; i2 < targets.length; i2++) {
            targets[i2].discard(result[i2].cards);
          }
        }
        var list = [event.cards1, event.cards2, event.cards3];
        game.broadcastAll("closeDialog", event.videoId);
        if (result.bool) {
          result.targets[0].damage();
          for (var i2 = 0; i2 < event.targets.length; i2++) {
            if (event.targets[i2] == result.targets[0]) var cards2 = list[i2];
          }
          result.targets[0].discard(cards2);
        }
      },
      group: "xuebianmrfz_dam",
      subSkill: {
        dam: {
          silent: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.getParent().name == "xuebianmrfz";
          },
          content: function() {
            player.addMark("xuebianmrfz", trigger.num, false);
          }
        }
      },
      ai: {
        order: 12,
        expose: 0.1,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    xuebianmrfz2: {
      charlotte: true
    },
    tonghemrfz: {
      audio: 2,
      derivation: ["xinyingshimrfz", "new_xinbangmrfz"],
      skillAnimation: true,
      animationColor: "thunder",
      unique: true,
      juexingji: true,
      trigger: { player: "phaseZhunbeiBegin" },
      forced: true,
      filter: function(event2, player2) {
        return player2.countMark("xuebianmrfz") >= 2 || game.roundNumber > 2;
      },
      content: function() {
        player.addMark("xinyingshimrfz", player.countMark("xuebianmrfz"), false);
        player.removeSkill("xuebianmrfz");
        player.addSkill("xinyingshimrfz");
        player.addSkill("new_xinbangmrfz");
        player.loseMaxHp();
        player.recoverTo(player.maxHp);
        player.awakenSkill("tonghemrfz");
      }
    },
    xinyingshimrfz: {
      audio: "yingshimrfz",
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => lib.skill.xinyingshimrfz.filterTarget(null, player2, current));
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      content: function() {
        var num = player.countMark("xinyingshimrfz") + 1;
        var max = target.countCards("h");
        if (max > num) return player.discardPlayerCard(num, target, "h", true, "visible");
        if (num >= max) return player.discardPlayerCard(max, target, "h", true, "visible");
        game.log(player, "观看了", target, "的手牌");
      },
      ai: {
        order: 13,
        expose: 0.1,
        threaten: 1.1,
        result: {
          player: 1,
          target: -1
        }
      }
    },
    xinbangmrfz: {
      audio: 2,
      trigger: {
        player: "phaseDrawBegin2"
      },
      direct: true,
      filter: function(event2, player2) {
        return event2.num > 0 && !event2.numFixed;
      },
      content: function() {
        "step 0";
        player.storage.xinbangmrfz = [];
        var num = get.copy(trigger.num);
        player.chooseTarget(
          get.prompt("xinbangmrfz"),
          "选择至多" + get.translation(num) + "名其他角色，其选择让你定向摸牌，然后你少摸等量的牌",
          [1, num],
          function(card3, player2, target3) {
            return player2 != target3;
          },
          function(target3) {
            var att2 = get.attitude(_status.event.player, target3);
            return att2 > 0;
          }
        );
        if (result.bool) {
          event.targets = result.targets;
          event.num = 0;
          trigger.num -= result.targets.length;
        } else {
          event.finish();
        }
        var target2 = event.targets[event.num];
        var att = get.attitude(target2, player);
        target2.addTempSkill("xinbangmrfz2", {
          player: "phaseUseEnd"
        });
        target2.chooseControl("basic", "trick", "equip").set("prompt", "【兴邦】：请让" + get.translation(player) + "摸一张指定类型牌，当此牌造成伤害时，你与其各摸一张牌").set("ai", function(player2) {
          if (att > 0) return [1, 2].randomGet();
          return 0;
        });
        var card2 = get.cardPile2(function(card3) {
          return get.type(card3, "trick") == result.control;
        });
        if (card2) {
          player.gain(card2, "gain2").gaintag = ["xinbangmrfz"];
        } else player.chat("牌堆中没有" + get.translation(result.control) + "牌了！");
        var cards2 = player.getCards("h", function(card3) {
          return card3.hasGaintag("xinbangmrfz");
        });
        for (i of cards2) {
          i.storage.xinbangmrfz = true;
        }
        if (event.num < event.targets.length - 1) {
          event.num++;
          event.goto(2);
        }
        if (trigger.num <= 0) game.delay();
      },
      group: ["xinbangmrfz_draw", "xinbangmrfz_lose"],
      subSkill: {
        draw: {
          audio: "xinbangmrfz",
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            if (!event2.cards || event2.cards.length > 1) return false;
            return event2.card.storage && event2.card.storage.xinbangmrfz == true;
          },
          forced: true,
          content: function() {
            "step 0";
            player.chooseTarget("【兴邦】:请选择一名其他角色，然后你与其各摸一张牌", true, function(card2, player2, target2) {
              return target2 != player2 && target2.hasSkill("xinbangmrfz2");
            }).set("ai", function(target2) {
              var player2 = _status.event.player;
              return get.attitude(player2, target2) > 0;
            });
            if (result.bool) {
              result.targets[0].draw();
              player.draw();
            }
          }
        },
        lose: {
          silent: true,
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.countCards("h", function(card2) {
              return card2.hasGaintag("xinbangmrfz");
            }) > 0;
          },
          content: function() {
            player.removeGaintag("xinbangmrfz");
          }
        }
      }
    },
    xinbangmrfz2: {
      charlotte: true,
      silent: true,
      onremove: true
    },
    new_xinbangmrfz: {
      audio: "xinbangmrfz",
      frequent: true,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        if (!player2.isPhaseUsing()) return false;
        var list = player2.getStorage("xinbangmrfz2");
        if (!list.includes(get.type2(event2.card, player2))) return true;
        return false;
      },
      content: function() {
        "step 0";
        if (!player.storage.xinbangmrfz2) {
          player.addTempSkill("xinbangmrfz2");
          player.storage.xinbangmrfz2 = [];
        }
        player.storage.xinbangmrfz2.add(get.type2(trigger.card, player));
        player.draw();
        if (Array.isArray(result) && result.length > 0) {
          var card2 = result[0], cards2 = player.getCards("h"), list = [];
          for (var i2 of cards2) {
            if (i2 == result[0]) continue;
            list.add(get.suit(i2, player));
          }
          if (!list.includes(get.suit(card2, player))) player.draw();
        }
      }
    },
    //帕拉斯
    yingzhumrfz: {
      audio: 2,
      trigger: { player: "phaseBegin" },
      direct: true,
      filter: function(event2, player2) {
        return !player2.storage.yingzhumrfz;
      },
      content: function() {
        "step 0";
        var next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束", "cancel2").set("prompt", get.prompt("yingzhumrfz"));
        next.set("prompt2", "你可以令自己在任意阶段结束后额外执行一个该阶段");
        next.set("ai", function() {
          var player2 = _status.event.player;
          if (player2.countCards("h", "sha") > player2.getCardUsable("sha") && game.hasPlayer(function(current) {
            return current != player2 && player2.inRange(current) && get.attitude(player2, current) < 0;
          }))
            return 3;
          return 2;
        });
        if (result.control != "cancel2") {
          var list = [
            "yingzhumrfz_Zhunbei",
            "yingzhumrfz_judge",
            "yingzhumrfz_draw",
            "yingzhumrfz_use",
            "yingzhumrfz_discard",
            "yingzhumrfz_jieshu"
          ];
          player.addTempSkill(list[result.index]);
          player.logSkill("yingzhumrfz");
        }
      },
      group: "yingzhumrfz_phase",
      subSkill: {
        phase: {
          direct: true,
          trigger: { global: "roundStart" },
          content: function() {
            "step 0";
            player.storage.yingzhumrfz = false;
            player.chooseTarget(
              get.prompt("yingzhumrfz"),
              "你可以选择一名其他角色，令其于任一阶段结束后额外执行一次此阶段",
              function(card2, player2, target2) {
                return target2 != player2;
              }
            ).set("ai", function(target2) {
              var player2 = _status.event.player;
              var att = get.attitude(player2, target2);
              return att > 0;
            });
            if (result.bool) {
              get.attitude(player, result.targets[0]);
              var next = player.chooseControl("准备", "判定", "摸牌", "出牌", "弃牌", "结束");
              next.set("prompt", "【英祝】:请选择一个阶段," + get.translation(result.targets[0]) + "于此阶段结束后额外执行一次此阶段");
              next.set("ai", function() {
                result.targets[0];
                return 2;
              });
              player.storage.yingzhumrfz = true;
              event.target = result.targets[0];
            } else event.finish();
            var list = [
              "yingzhumrfz_Zhunbei",
              "yingzhumrfz_judge",
              "yingzhumrfz_draw",
              "yingzhumrfz_use",
              "yingzhumrfz_discard",
              "yingzhumrfz_jieshu"
            ];
            event.target.addSkill(list[result.index]);
            player.logSkill("yingzhumrfz", event.target);
          },
          ai: {
            expose: 0.1
          }
        },
        Zhunbei: {
          direct: true,
          trigger: { player: "phaseZhunbeiAfter" },
          mark: true,
          intro: {
            content: "于准备阶段结束后额外执行一个准备阶段"
          },
          content: function() {
            event.next.remove(player.phaseZhunbei());
            trigger.next.push(player.phaseZhunbei());
            player.removeSkill("yingzhumrfz_Zhunbei");
          }
        },
        judge: {
          direct: true,
          mark: true,
          intro: {
            content: "于判定阶段结束后额外执行一个判定阶段"
          },
          trigger: { player: "phaseJudgeAfter" },
          content: function() {
            event.next.remove(player.phaseJudge());
            trigger.next.push(player.phaseJudge());
            player.removeSkill("yingzhumrfz_judge");
          }
        },
        draw: {
          direct: true,
          mark: true,
          intro: {
            content: "于摸牌阶段结束后额外执行一个摸牌阶段"
          },
          trigger: { player: "phaseDrawAfter" },
          content: function() {
            event.next.remove(player.phaseDraw());
            trigger.next.push(player.phaseDraw());
            player.removeSkill("yingzhumrfz_draw");
          }
        },
        use: {
          direct: true,
          mark: true,
          intro: {
            content: "于出牌阶段结束后额外执行一个出牌阶段"
          },
          trigger: { player: "phaseUseAfter" },
          content: function() {
            event.next.remove(player.phaseUse());
            trigger.next.push(player.phaseUse());
            player.removeSkill("yingzhumrfz_use");
          }
        },
        discard: {
          direct: true,
          mark: true,
          intro: {
            content: "于弃牌阶段结束后额外执行一个弃牌阶段"
          },
          trigger: { player: "phaseDiscardAfter" },
          content: function() {
            event.next.remove(player.phaseDiscard());
            trigger.next.push(player.phaseDiscard());
            player.removeSkill("yingzhumrfz_discard");
          }
        },
        jieshu: {
          direct: true,
          mark: true,
          intro: {
            content: "于结束阶段结束后额外执行一个结束阶段"
          },
          trigger: { player: "phaseJieshuAfter" },
          content: function() {
            event.next.remove(player.phaseJieshu());
            trigger.next.push(player.phaseJieshu());
            player.removeSkill("yingzhumrfz_jieshu");
          }
        }
      }
    },
    yingdanmrfz: {
      audio: 2,
      silent: true,
      trigger: {
        global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseDrawAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]
      },
      content: function() {
        trigger.player.addMark("yingdanmrfz", false);
      },
      group: "yingdanmrfz_draw",
      subSkill: {
        draw: {
          direct: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            "step 0";
            var target2 = trigger.player;
            if (target2.countMark("yingdanmrfz") > 6) {
              var next = player.chooseBool(
                "【英诞】:是否令" + (target2 == player ? "自己" : get.translation(target2)) + "摸" + (target2.countMark("yingdanmrfz") - 6) + "张牌？"
              );
              next.set("ai", function() {
                var player2 = _status.event.player;
                var target3 = trigger.player;
                return get.attitude(player2, target3) > 0;
              });
            }
            var target2 = trigger.player;
            if (result.bool) {
              target2.draw(target2.countMark("yingdanmrfz") - 6);
              player.logSkill("yingdanmrfz", target2);
            }
            target2.removeMark("yingdanmrfz", target2.countMark("yingdanmrfz"), false);
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    yingfenmrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      filter: function(event2, player2) {
        if (player2.storage.yingfenmrfz) return false;
        return event2.card.name == "tao";
      },
      direct: true,
      content: function() {
        "step 0";
        player.chooseTarget(get.prompt("yingfenmrfz"), "你可以令一名其他角色恢复一点体力", function(card2, player2, target2) {
          return target2 != player2;
        }).set("ai", function(target2) {
          var player2 = _status.event.player;
          return get.attitude(player2, target2) > 0;
        });
        if (result.bool) {
          player.storage.yingfenmrfz = true;
          result.targets[0].recover();
          player.logSkill("yingfenmrfz", result.targets[0]);
        }
      },
      group: "yingfenmrfz_clear",
      subSkill: {
        clear: {
          silent: true,
          firstDo: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return player2.storage.yingfenmrfz;
          },
          content: function() {
            player.storage.yingfenmrfz = false;
          }
        }
      },
      ai: {
        expose: 0.1
      }
    },
    //瑕光
    rencimrfz: {
      audio: 2,
      trigger: {
        global: "phaseEnd"
      },
      filter: function(event2, player2) {
        if (event2.player == player2 || event2.player.getHistory("skipped").length == 0) return false;
        return lib.filter.targetEnabled({ name: "sha" }, player2, event2.player) && (player2.hasSha() || _status.connectMode && player2.countCards("h") > 0);
      },
      direct: true,
      content: function() {
        player.addTempSkill("rencimrfz_dam", "useCardAfter");
        player.chooseToUse(
          function(card2, player2, event2) {
            if (get.name(card2) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【仁慈】:是否对" + get.translation(trigger.player) + "使用一张杀？"
        ).set("logSkill", "rencimrfz").set("complexSelect", true).set("filterTarget", function(card2, player2, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger.player);
      },
      subSkill: {
        dam: {
          silent: true,
          trigger: {
            source: "damageBegin",
            player: "shaMiss"
          },
          filter: function(event2, player2) {
            return event2.card.name == "sha";
          },
          content: function() {
            if (trigger.name == "damage") trigger.num++;
            player.removeSkill("rencimrfz_dam");
          }
        }
      }
    },
    huiguangmrfz: {
      audio: 2,
      trigger: { player: "phaseEnd" },
      filter: function(event2, player2) {
        return player2.hasMark("huiguangmrfz") && player2.countMark("huiguangmrfz") <= 6;
      },
      direct: true,
      content: function() {
        "step 0";
        var num = player.countMark("huiguangmrfz") - 1;
        var list = ["准备", "判定", "摸牌", "出牌", "弃牌", "结束"];
        player.chooseTarget("【辉光】:你可以令一名其他角色跳过下个" + list[num] + "阶段", function(card2, player2, target3) {
          return target3 != player2 && !target3.hasSkill("huiguangmrfz_skip");
        }).set("ai", function(target3) {
          var player2 = _status.event.player;
          var att = get.attitude(target3, player2), num2 = player2.countMark("huiguangmrfz");
          if (num2 == 2 || num2 == 5) return att > 0;
          return att < 0;
        });
        if (result.bool) {
          var target2 = result.targets[0], num = player.countMark("huiguangmrfz") - 1;
          target2.addSkill("huiguangmrfz_skip");
          target2.addMark("huiguangmrfz_skip", num + 1, false);
          player.logSkill("huiguangmrfz", target2);
        }
        player.removeMark("huiguangmrfz", player.countMark("huiguangmrfz"), false);
      },
      ai: {
        expose: 0.1
      },
      group: ["huiguangmrfz_mark"],
      subSkill: {
        skip: {
          markimage: "extension/WhichWay/image/skill/sleepmrfz.png",
          intro: {
            name: "睡眠",
            content: function(event2, player2) {
              var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
              var num = player2.countMark("huiguangmrfz_skip") - 1;
              return "跳过下个" + get.tranPhase(phase[num]);
            }
          },
          silent: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            var phase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
            var num = player.countMark("huiguangmrfz_skip") - 1;
            player.skip(phase[num]);
            game.log(player, "跳过了", get.tranPhase(phase[num]));
            player.removeMark("huiguangmrfz_skip", player.countMark("huiguangmrfz_skip"), false);
            player.removeSkill("huiguangmrfz_skip");
          }
        },
        mark: {
          silent: true,
          trigger: {
            player: "useCardAfter"
          },
          filter: function(event2, player2) {
            return _status.currentPhase == player2;
          },
          content: function() {
            player.addMark("huiguangmrfz", false);
          }
        }
      }
    },
    jiandunmrfz: {
      audio: 2,
      enable: ["chooseToRespond", "chooseToUse"],
      hiddenCard: function(player2, name) {
        if (get.type(name) != "basic") return false;
        return player2.hasCard(function(card2) {
          return get.type2(card2) == "trick";
        }, "hs");
      },
      filter: function(event2, player2) {
        if (!player2.hasCard(function(card2) {
          return get.type2(card2) == "trick";
        }, "hs"))
          return false;
        for (var name of lib.inpile) {
          if (get.type(name) != "basic") continue;
          if (event2.filterCard({ name }, player2, event2)) return true;
          if (name == "sha") {
            for (var nature of lib.inpile_nature) {
              if (event2.filterCard({ name: "sha", nature }, player2, event2)) return true;
            }
          }
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var list = [];
          for (var name of lib.inpile) {
            if (get.type(name) != "basic") continue;
            if (event2.filterCard({ name }, player2, event2)) {
              list.push(["基本", "", name]);
            }
            if (name == "sha") {
              for (var nature of lib.inpile_nature) {
                if (event2.filterCard({ name, nature }, player2, event2)) list.push(["基本", "", "sha", nature]);
              }
            }
          }
          return ui.create.dialog("剑盾", [list, "vcard"], "hidden");
        },
        check: function(button) {
          var player2 = _status.event.player;
          var card2 = {
            name: button.link[2],
            nature: button.link[3]
          };
          if (_status.event.getParent().type != "phase" || game.hasPlayer(function(current) {
            return player2.canUse(card2, current) && get.effect(current, card2, player2, player2) > 0;
          })) {
            switch (button.link[2]) {
              case "tao":
              case "shan":
                return 5;
              case "jiu": {
                if (player2.countCards("hs", {
                  type: "trick"
                }) > 2)
                  return 3;
              }
              case "sha":
                if (button.link[3] == "fire") return 2.95;
                else if (button.link[3] == "thunder" || button.link[3] == "ice") return 2.92;
                else return 2.9;
            }
          }
          return 0;
        },
        backup: function(links, player2) {
          return {
            audio: "jiandunmrfz",
            filterCard: function(card2, player3, target2) {
              return get.type2(card2) == "trick";
            },
            complexCard: true,
            selectCard: 1,
            check: function(card2, player3, target2) {
              return 6 - get.value(card2);
            },
            viewAs: { name: links[0][2], nature: links[0][3] },
            position: "hes",
            popname: true
          };
        },
        prompt: function(links, player2) {
          return "你可以将一张锦囊牌当任意基本牌使用或打出";
        }
      },
      ai: {
        order: 3.1,
        skillTagFilter: function(player2, tag, arg) {
          if (tag == "fireAttack") return true;
          if (!player2.hasCard(function(card2) {
            return get.type2(card2) == "trick";
          }, "hes")) {
            return false;
          }
        },
        result: {
          player: 1
        },
        respondSha: true,
        respondShan: true,
        fireAttack: true
      }
    },
    //新星熊
    xinboremrfz: {
      audio: "banruomrfz",
      mark: false,
      markimage: "extension/WhichWay/image/skill/xinboremrfz.png",
      intro: {
        content: function(player2) {
          var playerhas = game.findPlayer(function(current) {
            return current.hasSkill("xinboremrfz");
          });
          return get.translation(playerhas) + "正在保护你";
        }
      },
      group: ["xinboremrfz_choose", "xinboremrfz_card", "xinboremrfz_betarget"],
      subSkill: {
        betarget: {
          audio: "banruomrfz",
          trigger: {
            global: "useCardToPlayer"
          },
          filter: function(event2, player2) {
            if (event2.targets > 1 || get.type(event2.card) == "equip") return false;
            return event2.target.hasMark("xinboremrfz") && player2.getHandcardLimit() > 0;
          },
          prompt: function(event2, player2) {
            return "【般若】：是否令" + get.translation(event2.card) + "的目标由" + get.translation(event2.target) + "改为你？";
          },
          check: function(event2, player2) {
            var att = get.attitude(event2.target, player2);
            if ((event2.card.name == "wuzhong" || event2.card.name == "dongzhuxianji" || event2.card.name == "zenbing") && att < 0)
              return true;
            return att > 0 && get.tag(event2.card, "damage");
          },
          content: function() {
            "step 0";
            var target2 = trigger.target;
            trigger.targets.remove(target2);
            trigger.getParent().triggeredTargets1.remove(target2);
            trigger.untrigger();
            game.delayx();
            trigger.targets.push(player);
            trigger.player.line(player, "fire");
            game.log(trigger.card, "的目标被改为", player);
            player.addMark("xinboremrfz_losehdlimit", false);
          },
          ai: {
            expose: 0.1
          }
        },
        choose: {
          direct: true,
          trigger: {
            global: "phaseBefore",
            player: "enterGame"
          },
          filter: function(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          content: function() {
            "step 0";
            player.chooseTarget(true, "【般若】：请选择一名其他角色，令其获得‘般若’标记", function(card2, player2, target3) {
              return target3 != player2;
            }).ai = function(target3) {
              return get.attitude(player, target3);
            };
            if (result.bool) {
              var target2 = result.targets[0];
              target2.addMark("xinboremrfz");
              player.logSkill("xinboremrfz", target2);
              player.disableEquip("equip2");
              target2.disableEquip("equip2");
              player.addSkill("xinboremrfz_handlit");
              target2.addSkill("xinboremrfz_handlit");
            }
            player.addSkill("xinboremrfz_losehdlimit");
            player.removeSkill("xinboremrfz_choose");
          },
          ai: {
            expose: 0.1
          }
        },
        card: {
          audio: "xinboremrfz",
          enable: "chooseToUse",
          hiddenCard: function(player2, name) {
            if (player2.hasSkill("xinboremrfz_usedwuxie") && player2.hasSkill("xinboremrfz_usedsha") && player2.hasSkill("xinboremrfz_usedshan"))
              return false;
            if (name == "wuxie" && player2.hasSkill("xinboremrfz_usedwuxie")) return false;
            if (name == "sha" && player2.hasSkill("xinboremrfz_usedsha")) return false;
            if (name == "shan" && player2.hasSkill("xinboremrfz_usedshan")) return false;
            return (name == "wuxie" || name == "sha" || name == "shan") && (player2.getHandcardLimit() > 0 || player2.countDisabledSlot() < 5);
          },
          filter: function(event2, player2) {
            if (player2.hasSkill("xinboremrfz_usedwuxie") && player2.hasSkill("xinboremrfz_usedsha") && player2.hasSkill("xinboremrfz_usedshan"))
              return false;
            return player2.getHandcardLimit() > 0 || player2.countDisabledSlot() < 5;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var vcards = [];
              for (var name of ["sha", "shan", "wuxie"]) {
                const card2 = { name };
                if (name == "wuxie" && player2.hasSkill("xinboremrfz_usedwuxie")) continue;
                if (name == "shan" && player2.hasSkill("xinboremrfz_usedshan")) continue;
                if (name == "sha" && player2.hasSkill("xinboremrfz_usedsha")) continue;
                if (event2.filterCard(card2, player2, event2)) {
                  if (name == "sha") {
                    vcards.push(["基本", "", "sha"]);
                    for (var j of lib.inpile_nature) vcards.push(["基本", "", "sha", j]);
                  } else if (get.type(name) == "trick") {
                    vcards.push(["锦囊", "", name]);
                  } else if (get.type(name) == "basic") {
                    vcards.push(["基本", "", name]);
                  }
                }
              }
              var dialog = ui.create.dialog("般若", [vcards, "vcard"], "hidden");
              dialog.direct = true;
              return dialog;
            },
            filter: function(button, player2) {
              return _status.event.getParent().filterCard({ name: button.link[2] }, player2, _status.event.getParent());
            },
            backup: function(links, player2) {
              return {
                filterCard: () => false,
                selectCard: -1,
                viewAs: {
                  name: links[0][2],
                  nature: links[0][3],
                  isCard: true
                },
                popname: true,
                precontent: function() {
                  "step 0";
                  var card2 = event.result.card.name;
                  if (card2 == "sha") {
                    event.getParent().addCount = false;
                    player2.addSkill("xinboremrfz_usedsha");
                  }
                  if (card2 == "shan") player2.addSkill("xinboremrfz_usedshan");
                  if (card2 == "wuxie") player2.addSkill("xinboremrfz_usedwuxie");
                  player2.logSkill("xinboremrfz");
                  var list = [];
                  if (player2.getHandcardLimit() > 0) list.push("手牌上限-1");
                  if (player2.countDisabledSlot() < 5) list.push("废除一个装备栏");
                  if (list.length > 1)
                    player2.chooseControl(list).set("prompt", "【般若】：请选择一项").set("ai", function() {
                      return 0;
                    });
                  else {
                    if (player2.getHandcardLimit() == 0)
                      player2.chooseToDisable().ai = function(event2, player3, list2) {
                        if (list2.includes("equip5")) return "equip5";
                        return list2.randomGet();
                      };
                    else player2.addMark("xinboremrfz_losehdlimit", false);
                  }
                  if (result.index == 0) player2.addMark("xinboremrfz_losehdlimit", false);
                  else
                    player2.chooseToDisable().ai = function(event2, player3, list2) {
                      if (list2.includes("equip5")) return "equip5";
                      return list2.randomGet();
                    };
                }
              };
            },
            prompt: function(links, player2) {
              return "【般若】：视为使用一张【" + get.translation(links[0][2]) + "】";
            }
          },
          ai: {
            order: function(item, player2) {
              var player2 = _status.event.player;
              var event2 = _status.event;
              if (event2.filterCard({ name: "sha" }, player2, event2)) {
                return 4;
              }
            },
            respondSha: true,
            respondShan: true,
            skillTagFilter: function(player2, tag, arg) {
              if (player2.hasSkill("xinboremrfz_usedwuxie") && player2.hasSkill("xinboremrfz_usedsha") && player2.hasSkill("xinboremrfz_usedshan"))
                return false;
              if (arg != "use") return false;
            },
            result: {
              player: 1
            }
          }
        },
        losehdlimit: {
          silent: true,
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num - player2.countMark("xinboremrfz_losehdlimit");
            }
          }
        },
        usedshan: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseZhunbeiBegin" },
          content: function() {
            player.removeSkill("xinboremrfz_usedshan");
          }
        },
        usedwuxie: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseZhunbeiBegin" },
          content: function() {
            player.removeSkill("xinboremrfz_usedwuxie");
          }
        },
        usedsha: {
          silent: true,
          charlotte: true,
          trigger: { global: "phaseZhunbeiBegin" },
          content: function() {
            player.removeSkill("xinboremrfz_usedsha");
          }
        },
        handlit: {
          silent: true,
          charlotte: true,
          mod: {
            maxHandcard: function(player2, num) {
              return num + 1;
            }
          }
        }
      }
    },
    xinyizhongmrfz: {
      audio: "yizhongmrfz",
      forced: true,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.hp >= player2.getHandcardLimit();
      },
      content: function() {
        var num = 5 - player.countDisabledSlot() - 1;
        player.addMark("xinyizhongmrfz", num, false);
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + player2.countMark("xinyizhongmrfz");
        }
      },
      group: "xinyizhongmrfz_lose",
      subSkill: {
        lose: {
          audio: "yizhongmrfz",
          direct: true,
          charlotte: true,
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0 && event2.num > 0 && event2.source.hasMark("xinboremrfz");
          },
          content: function() {
            player.removeSkill("xinboremrfz");
            player.removeSkill("xinyizhongmrfz_lose");
          }
        }
      }
    },
    //新缪尔赛思
    yuanliumrfz: {
      audio: "kaiyuanmrfz",
      trigger: {
        player: "enterGame",
        global: "phaseBefore"
      },
      direct: true,
      locked: false,
      markimage: "extension/WhichWay/image/skill/miumiuliuxingmrfz.png",
      intro: {
        name: "流形",
        content: "#/3"
      },
      filter: function(event2, player2) {
        return event2.name != "phase" || game.phaseNumber == 0;
      },
      content: function() {
        "step 0";
        player.chooseControl().set("choiceList", ["令一名角色摸两张牌", "获得一个‘流形’"]).set("ai", function() {
          return [0, 1].randomGet();
        });
        if (result.index == 0) {
          player.chooseTarget(true, "【源流】：令一名角色摸两张牌").ai = function(target3) {
            return get.attitude(player, target3) > 2;
          };
        } else {
          player.logSkill("kaiyuanmrfz");
          player.addMark("yuanliumrfz");
          event.finish();
        }
        if (result.bool) {
          var target2 = result.targets[0];
          target2.draw(2);
          player.logSkill("kaiyuanmrfz");
        }
      },
      mod: {
        maxHandcard: function(player2, num) {
          return num + player2.countMark("yuanliumrfz");
        }
      },
      group: "yuanliumrfz_get",
      subSkill: {
        get: {
          direct: true,
          trigger: {
            player: "phaseUseEnd"
          },
          filter: function(event2, player2) {
            return player2.getHistory("useCard", function(evt) {
              return evt.getParent("phaseUse") == event2;
            }).length > 0 && player2.countMark("yuanliumrfz") < 3;
          },
          content: function() {
            var list = [], mark = player.countMark("yuanliumrfz");
            player.getHistory("useCard", function(evt) {
              if (evt.getParent("phaseUse") == trigger) list.add(get.type2(evt.card));
            });
            if (mark + list.length > 3) player.addMark("yuanliumrfz", 3 - mark);
            else player.addMark("yuanliumrfz", list.length);
            player.logSkill("yuanliumrfz");
          }
        }
      }
    },
    xinjingshuimrfz: {
      audio: "jingshuimrfz",
      trigger: {
        player: "useCardToPlayered"
      },
      usable: 1,
      filter: function(event2, player2) {
        var evt = event2.getParent("phaseUse"), type = get.type(event2.card);
        if (type != "basic" && type != "trick") return false;
        if (!evt || evt.player != player2) return false;
        if (!player2.hasMark("yuanliumrfz")) return false;
        return event2.targets && event2.targets.length == 1;
      },
      prompt: function(event2, player2) {
        return "是否移除所有‘源流’并令【" + get.translation(event2.card.name) + "】额外结算" + player2.countMark("yuanliumrfz") + "次？";
      },
      check: function(event2, player2) {
        return !get.tag(event2.card, "norepeat");
      },
      content: function() {
        var num = player.countMark("yuanliumrfz");
        trigger.getParent().effectCount += num;
        player.removeAllmark("yuanliumrfz");
      }
    },
    shuilingmrfz: {
      audio: "liuxingmrfz",
      forced: true,
      trigger: { player: "damageBegin3" },
      filter: function(event2, player2) {
        if (player2.hasSkill("shuilingmrfz_ban")) return false;
        return !event2.nature && player2.countCards("h") >= player2.hp;
      },
      content: function() {
        trigger.num--;
        player.addTempSkill("shuilingmrfz_ban", "phaseEnd");
      },
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          intro: {
            content: "本回合已发动过【水灵】"
          }
        }
      }
    },
    //新归溟幽灵鲨
    xinyongwomrfz: {
      audio: "yongwomrfz",
      zhuanhuanji: true,
      locked: false,
      mark: true,
      marktext: "☯",
      intro: {
        content: function(storage, player2, skill) {
          if (player2.storage.xinyongwomrfz) return "阳：当你进入濒死状态时，你可以回复至一点体力";
          return "阴：当你武将牌从正面朝上至背面朝上时，你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害";
        }
      },
      init: function(player2) {
        player2.storage.xinyongwomrfz = true;
      },
      trigger: { player: "dying" },
      filter: function(event2, player2) {
        return player2.storage.xinyongwomrfz;
      },
      prompt: "【拥我】：是否将体力回复至1点",
      content: function() {
        player.recoverTo(1);
        player.changeZhuanhuanji("xinyongwomrfz");
      },
      group: "xinyongwomrfz_ying",
      subSkill: {
        //阴
        ying: {
          audio: "xinyongwomrfz",
          trigger: { player: "turnOverAfter" },
          filter: function(event2, player2) {
            return event2.player.isTurnedOver() && !player2.storage.xinyongwomrfz;
          },
          prompt: "【拥我】：你可以摸两张牌，然后选择一项：1.弃置你攻击范围内一名其他角色区域内各一张牌；2.对你攻击范围内的一名其他角色造成一点伤害。",
          check: function(event2, player2) {
            return game.hasPlayer(function(current) {
              return current != player2 && get.attitude(player2, current) < 0;
            });
          },
          content: function() {
            "step 0";
            var choice = 0, max = 0;
            for (var i2 = 0; i2 < game.players.length; i2++) {
              var target2 = game.players[i2], tmp1 = 0;
              if (target2 == player) continue;
              if (!player.inRange(target2)) continue;
              if (get.attitude(player, target2) > 0) continue;
              if (target2.countCards("e") > 0) tmp1++;
              if (target2.countCards("h") > 0) tmp1++;
              if (target2.countCards("j") > 0) tmp1--;
              if (tmp1 > max) max = tmp1;
            }
            if (game.hasPlayer(function(current) {
              return current != player && get.attitude(player, current) < 0 && current.hp <= 1;
            }) || max < 2)
              choice = 1;
            player.draw(2);
            player.chooseControl().set("choiceList", ["弃置你攻击范围内一名其他角色区域内各一张牌", "对你攻击范围内的一名其他角色造成一点伤害"]).set("ai", function() {
              return choice;
            });
            event.choice = choice;
            event.index = result.index;
            if (game.hasPlayer(function(current) {
              return current != player && player.inRange(current);
            })) {
              player.chooseTarget("【拥我】:请选择一名其他角色", true, function(rd, player2, target3) {
                return target3 != player2 && player2.inRange(target3);
              }).set("ai", function(target3) {
                var player2 = _status.event.player, att = get.attitude(player2, target3);
                if (event.choice == 0) {
                  if (target3.countCards("e") > 0) return att < 0 && target3.countCards("e") > 0;
                  else return att < 0;
                } else return get.damageEffect(target3, player2, player2) > 0;
              });
            } else event.finish();
            if (result.bool) {
              var target2 = result.targets[0];
              if (event.index == 0) {
                var num = 0;
                if (target2.countCards("h")) num++;
                if (target2.countCards("e")) num++;
                if (target2.countCards("j")) num++;
                if (num) {
                  player.discardPlayerCard(target2, num, "hej", true).set("filterButton", function(button) {
                    for (var i3 = 0; i3 < ui.selected.buttons.length; i3++) {
                      if (get.position(button.link) == get.position(ui.selected.buttons[i3].link)) return false;
                    }
                    return true;
                  });
                }
              } else target2.damage("player");
              player.logSkill("yongwomrfz", target2);
              player.changeZhuanhuanji("xinyongwomrfz");
            }
          }
        }
      }
    },
    douzhengmrfz: {
      audio: 2,
      trigger: { global: "phaseEnd" },
      prompt: function(event2, player2) {
        return "【斗争】：是否失去所有体力并视为对" + get.translation(event2.player) + "使用一张【杀】？";
      },
      filter: function(event2, player2) {
        return event2.player != player2;
      },
      check: function(event2, player2) {
        if (get.attitude(player2, event2.player) > 0) return false;
        return player2.countCards("h", function(card2) {
          return card2.name == "tao" || card2.name == "jiu";
        }) > 0 || player2.storage.xinyongwomrfz == true;
      },
      content: function() {
        player.loseHp(player.hp);
        player.useCard({ name: "sha", isCard: true }, false, trigger.player);
        player.turnOver();
      },
      ai: {
        expose: 0.1
      }
    },
    shensuimrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "loseHpEnd" },
      filter: function(event2, player2) {
        return event2.num > 1 && player2.hujia < 1;
      },
      content: function() {
        player.changeHujia(trigger.num);
      },
      group: "shensuimrfz_change",
      subSkill: {
        change: {
          direct: true,
          trigger: { global: "roundStart" },
          filter: function(event2, player2) {
            return !player2.storage.xinyongwomrfz;
          },
          content: function() {
            player.changeZhuanhuanji("xinyongwomrfz");
          }
        }
      }
    },
    //早露
    zhongxiemrfz: {
      audio: 2,
      forced: true,
      trigger: {
        player: "useCardToPlayered"
      },
      filter: function(event2, player2) {
        if (event2.card.name != "sha" || typeof get.number(event2.card) != "number") return false;
        return event2.target.countCards("h") <= get.number(event2.card);
      },
      content: function() {
        trigger.getParent().directHit.add(trigger.target);
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          if (tag == "directHit_ai") {
            if (arg.card.name == "sha" && typeof get.number(arg.card) == "number")
              return arg.card.name == "sha" && arg.target.countCards("h") <= get.number(arg.card);
          }
          return false;
        }
      },
      mod: {
        attackRange: function(player2, num) {
          return num += 2;
        }
      },
      group: ["zhongxiemrfz_damage", "zhongxiemrfz_wushi"],
      subSkill: {
        damage: {
          audio: "zhongxiemrfz",
          forced: true,
          trigger: { source: "damageBegin" },
          filter: function(event2, player2) {
            return event2.player.hujia > 0;
          },
          content: function() {
            trigger.num += trigger.player.hujia;
          }
        },
        wushi: {
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2) {
            return event2.card.name == "sha";
          },
          direct: true,
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
        }
      }
    },
    rusuimrfz: {
      audio: 2,
      trigger: { source: "damageBegin2" },
      filter: function(event2, player2) {
        var num = 0, target2 = event2.player;
        if (!event2.card) return false;
        if (target2.countCards("h") >= target2.hp) num++;
        if (target2.countCards("e") > 0) num++;
        if (target2.getDamagedHp() <= target2.hp) num++;
        return event2.player != player2 && event2.card.name == "sha" && num != 0;
      },
      check: function(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      prompt: function(event2, player2) {
        var num = 0, target2 = event2.player;
        if (target2.countCards("h") >= target2.hp) num++;
        if (target2.countCards("e") > 0) num++;
        if (target2.getDamagedHp() <= target2.hp) num++;
        if (num < 3) return "【入髓】：是否令" + get.translation(target2) + "弃置" + num + "张牌";
        else return "【入髓】：是否令" + get.translation(target2) + "弃置" + num + "张牌并令此杀伤害+1";
      },
      prompt2: false,
      content: function() {
        var num = 0, target2 = trigger.player;
        if (target2.countCards("h") >= target2.hp) num++;
        if (target2.countCards("e") > 0) num++;
        if (target2.getDamagedHp() <= target2.hp) num++;
        target2.chooseToDiscard("he", true, "【入髓】：请弃置" + num + "张牌", num);
        if (num == 3) trigger.num++;
      }
    },
    //琳琅诗怀雅
    zhijinmrfz: {
      mod: {
        aiOrder: function(player2, card2, num) {
          if (typeof card2 == "object" && player2.isPhaseUsing()) {
            var evt = lib.skill.zhijinmrfz.getLastUsed(player2);
            if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card2)) {
              return num + 10;
            }
          }
        }
      },
      marktext: "钱",
      intro: {
        name: "钱",
        content: "共有#个钱"
      },
      audio: 4,
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
        var evt = lib.skill.dcjianying.getLastUsed(player2, event2);
        if (!evt || !evt.card) return false;
        return lib.suit.includes(get.suit(evt.card)) && get.suit(evt.card) == get.suit(event2.card);
      },
      content: function() {
        player.addMark("zhijinmrfz");
      },
      group: ["zhijinmrfz_round", "zhijinmrfz_use"],
      subSkill: {
        use: {
          audio: "zhijinmrfz",
          enable: ["chooseToUse", "chooseToRespond"],
          filter: function(event2, player2) {
            var list = [], mark = player2.countMark("zhijinmrfz");
            if (mark >= 1) list.push("sha");
            if (mark >= 2) list.push("juedou");
            if (mark >= 3) list.push("wuzhong");
            if (mark >= 4) list.push("tao");
            if (mark >= 5) list.push("wanjian");
            if (!player2.isPhaseUsing() || player2.countMark("zhijinmrfz") == 0 || list.length == 0) return false;
            for (var name of list) {
              if (event2.filterCard({ name, isCard: false }, player2, event2)) return true;
            }
            return false;
          },
          chooseButton: {
            dialog: function(event2, player2) {
              var vcards = [], list = [], mark = player2.countMark("zhijinmrfz");
              if (mark >= 1) list.push("sha");
              if (mark >= 2) list.push("juedou");
              if (mark >= 3) list.push("wuzhong");
              if (mark >= 4) list.push("tao");
              if (mark >= 5) list.push("wanjian");
              for (var name of list) {
                const card2 = { name };
                if (event2.filterCard(card2, player2, event2)) {
                  if (name == "sha") {
                    for (var j of lib.inpile_nature) {
                      if (j != "fire") continue;
                      vcards.push(["基本", "", "sha", j]);
                    }
                  } else if (get.type(name) == "trick") {
                    vcards.push(["锦囊", "", name]);
                  } else if (get.type(name) == "basic") {
                    vcards.push(["基本", "", name]);
                  }
                }
              }
              var dialog = ui.create.dialog("掷金", [vcards, "vcard"], "hidden");
              dialog.direct = true;
              return dialog;
            },
            check: function(button) {
              var player2 = _status.event.player;
              var lose = 1, players = game.filterPlayer(), choose = button.link[2];
              var mark = player2.countMark("zhijinmrfz");
              if (mark >= 5) {
                if (player2.hp < 3) return choose == "tao" ? 2 : -1;
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                  if (att < 0) lose++;
                  if (att > 0 && players[i2].hp > 2) lose = lose - 0.5;
                  if (att > 0 && players[i2].hp < 2) lose--;
                  if (att > 2 && players[i2] == 1) lose -= 3;
                }
                if (lose > 0) return choose == "wanjian" ? 1 : -1;
                if (player2.countCards("h", function(card2) {
                  return card2.name = "sha";
                }) >= player2.getCardUsable("sha") || player2.getCardUsable("sha") == 0)
                  return choose == "wuzhong" ? 1 : -1;
                return choose == "sha" ? 1 : -1;
              }
              if (mark >= 4) {
                if (player2.hp < 3) return choose == "tao" ? 1 : -1;
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                }
                if (player2.countCards("h", function(card2) {
                  return card2.name = "sha";
                }) >= player2.getCardUsable("sha") || player2.getCardUsable("sha") == 0)
                  return choose == "wuzhong" ? 1 : -1;
                return choose == "sha" ? 1 : -1;
              }
              if (mark >= 3) {
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                }
                if (player2.countCards("h", function(card2) {
                  return card2.name = "sha";
                }) >= player2.getCardUsable("sha") || player2.getCardUsable("sha") == 0)
                  return choose == "wuzhong" ? 1 : -1;
                return choose == "sha" ? 1 : -1;
              }
              if (mark >= 2) {
                for (var i2 = 0; i2 < players.length; i2++) {
                  var att = get.attitude(player2, players[i2]);
                  if (players[i2].hp == 1 && get.damageEffect(players[i2], player2, player2) > 0 && !players[i2].hasSha()) {
                    return button.link[2] == "juedou" ? 2 : -1;
                  }
                }
                return choose == "sha" ? 1 : -1;
              }
              return choose == "sha" ? 1 : -1;
            },
            backup: function(links, player2) {
              return {
                filterCard: () => true,
                selectCard: 1,
                viewAs: {
                  name: links[0][2],
                  nature: links[0][3],
                  isCard: false
                },
                position: "he",
                popname: true,
                precontent: function() {
                  var card2 = event.result.card.name, mark = player2.countMark("zhijinmrfz");
                  if (card2 == "sha") {
                    if (mark == 1) player2.draw();
                    player2.removeMark("zhijinmrfz");
                  }
                  if (card2 == "juedou") {
                    if (mark == 2) player2.draw();
                    player2.removeMark("zhijinmrfz", 2);
                  }
                  if (card2 == "wuzhong") {
                    if (mark == 3) player2.draw();
                    player2.removeMark("zhijinmrfz", 3);
                  }
                  if (card2 == "tao") {
                    if (mark == 4) player2.draw();
                    player2.removeMark("zhijinmrfz", 4);
                  }
                  if (card2 == "wanjian") {
                    if (mark == 5) player2.draw();
                    player2.removeMark("zhijinmrfz", 5);
                  }
                }
              };
            },
            prompt: function(links, player2) {
              return "【掷金】：视为使用一张" + (links[0][3] == void 0 ? "" : "火") + "【" + get.translation(links[0][2]) + "】";
            }
          },
          ai: {
            respondSha: true,
            fireAttack: true,
            order: function(item, player2) {
              var player2 = _status.event.player;
              var event2 = _status.event;
              var mark = player2.countMark("zhijinmrfz");
              if (event2.filterCard({ name: "tao" }, player2, event2) && mark >= 4) {
                return 10;
              }
              if (event2.filterCard({ name: "wuzhong" }, player2, event2) && mark >= 3) {
                return 13;
              }
              if (event2.filterCard({ name: "juedou" }, player2, event2) && mark >= 2) {
                return 4.95;
              }
              if (event2.filterCard({ name: "sha" }, player2, event2) && mark >= 1) {
                return 2.95;
              }
            },
            skillTagFilter: function(player2, tag, arg) {
              return player2.countMark("zhijinmrfz") > 0;
            },
            result: {
              player: 1
            }
          }
        },
        round: {
          audio: "zhijinmrfz",
          trigger: { global: "roundStart" },
          forced: true,
          charlotte: true,
          content: function() {
            player.addMark("zhijinmrfz");
          }
        }
      }
    },
    mianzaimrfz: {
      markimage: "extension/WhichWay/image/skill/mianzaimrfz_money.png",
      intro: {
        content: "累计点数：#"
      },
      audio: 2,
      trigger: {
        player: "dying"
      },
      forced: true,
      content: function() {
        var cards2 = game.cardsGotoOrdering(get.cards(6)).cards, num = 0;
        for (var i2 = 0; i2 < cards2.length; i2++) {
          num = num + cards2[i2].number;
        }
        player.showCards(cards2, get.translation(player) + "发动了【免灾】</br>点数之和为：" + num);
        if (num <= player.countMark("mianzaimrfz")) {
          player.recoverTo(3);
          player.drawTo(3);
          player.removeMark("mianzaimrfz", player.countMark("mianzaimrfz"), false);
        }
      },
      group: ["mianzaimrfz_number"],
      subSkill: {
        number: {
          silent: true,
          charlotte: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            return event2.cards && event2.cards.length == 1;
          },
          content: function() {
            var num = trigger.card.number;
            player.addMark("mianzaimrfz", num, false);
          }
        }
      }
    },
    //圣约送葬人
    chongdanmrfz: {
      audio: 2,
      frequent: true,
      subfrequent: ["chongdanmrfz_player"],
      trigger: {
        source: "damageSource"
      },
      filter: function(event2, player2) {
        if (player2.countCards("h") == 0 && player2.getDamagedHp() == 0) return false;
        return !player2.storage.chongdanmrfz;
      },
      content: function() {
        "step 0";
        player.storage.chongdanmrfz = true;
        if (player.getDamagedHp() == 0) player.draw(player.hp);
        else {
          player.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？").set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力").set("ai", function() {
            var player2 = _status.event.player;
            var hp = player2.hp;
            if (player2.countCards("h") == 0) return 0;
            if (hp < 2) return 1;
            if (player2.countCards("j") > 0) return 1;
            if (player2.isPhaseUsing() && player2.countCards("h", function(card2) {
              return card2.name == "tao";
            }) >= player2.getDamagedHp())
              return 1;
            return 0;
          });
        }
        if (result.bool) {
          player.draw(player.hp);
        } else {
          player.recover(player.countCards("h"));
        }
      },
      mod: {
        cardEnabled: function(card2, player2) {
          if (player2.countMark("chongdanmrfz_lim") >= 2 * player2.maxHp) return false;
        },
        cardUsable: function(card2, player2) {
          if (player2.countMark("chongdanmrfz_lim") >= 2 * player2.maxHp) return false;
        },
        cardSavable: function(card2, player2) {
          if (player2.countMark("chongdanmrfz_lim") >= 2 * player2.maxHp) return false;
        }
      },
      ai: {
        presha: true,
        pretao: true
      },
      group: ["chongdanmrfz_clear", "chongdanmrfz_player", "chongdanmrfz_lim"],
      subSkill: {
        lim: {
          mark: true,
          intro: {
            content: "已使用：#张牌"
          },
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: {
            player: "useCard"
          },
          filter: function(event2, player2) {
            return player2.countMark("chongdanmrfz_lim") < 2 * player2.maxHp;
          },
          content: function() {
            player.addMark("chongdanmrfz_lim", false);
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "roundStart" },
          content: function() {
            if (player.storage.chongdanmrfz_player) player.storage.chongdanmrfz_player = false;
            if (player.storage.chongdanmrfz) player.storage.chongdanmrfz = false;
            if (player.countMark("chongdanmrfz_lim") > 0)
              player.removeMark("chongdanmrfz_lim", player.countMark("chongdanmrfz_lim"), false);
          }
        },
        player: {
          audio: "chongdanmrfz",
          trigger: {
            player: "damageEnd"
          },
          filter: function(event2, player2) {
            if (player2.countCards("h") == 0 && player2.getDamagedHp() == 0) return false;
            return !player2.storage.chongdanmrfz_player;
          },
          content: function() {
            "step 0";
            player.storage.chongdanmrfz_player = true;
            if (player.getDamagedHp() == 0) player.draw(player.hp);
            else {
              player.chooseBool("【铳弹】：是否摸" + player.hp + "张牌？").set("prompt2", "选择取消则为回复" + player.countCards("h") + "点体力").set("ai", function() {
                var player2 = _status.event.player;
                var hp = player2.hp;
                if (player2.countCards("h") == 0) return 0;
                if (hp < 3) return 1;
                if (player2.countCards("j") > 0) return 1;
                if (player2.isPhaseUsing() && player2.countCards("h", function(card2) {
                  return card2.name == "tao";
                }) >= player2.getDamagedHp())
                  return 1;
                return 0;
              });
            }
            if (result.bool) {
              player.draw(player.hp);
            } else {
              player.recover(player.countCards("h"));
            }
          }
        }
      }
    },
    tianxuanmrfz: {
      audio: 2,
      mark: true,
      intro: {
        content: function(event2, player2) {
          return "已有的花色：" + get.translation(player2.storage.tianxuanmrfz);
        }
      },
      trigger: {
        player: "useCard1"
      },
      filter: function(event2, player2) {
        return get.tag(event2.card, "damage") > 0 && player2.isPhaseUsing();
      },
      init: function(player2) {
        player2.storage.tianxuanmrfz = ["heart"];
      },
      prompt: function(event2, player2) {
        var list = player2.storage.tianxuanmrfz;
        return "【天选】：是否进行判定，若为" + get.translation(list) + ",则" + get.translation(event2.card) + "结算两次";
      },
      content: function() {
        "step 0";
        var list = player.storage.tianxuanmrfz;
        player.judge(function(card2) {
          for (var i2 = 0; i2 < list.length; i2++) {
            var suit2 = get.suit(card2);
            if (suit2 == list[i2]) return -4;
          }
          return 0;
        }).judge2 = function(result2) {
          return result2.bool == false ? true : false;
        };
        if (result.bool == false) {
          trigger.effectCount++;
          player.storage.tianxuanmrfz = [];
          event.finish();
        } else {
          var suit = player.storage.tianxuanmrfz, list = [];
          for (i of lib.suit) {
            if (suit.includes(i)) continue;
            list.push(i);
          }
          player.chooseControl(list).set("prompt", "【天选】：请选择为[]内增加一个花色").set("ai", function() {
            if (list.includes("diamond")) return "diamond";
            return list.randomGet();
          });
        }
        if (result.control) {
          player.storage.tianxuanmrfz.add(result.control);
          player.storage.tianxuanmrfz.sort();
        }
      }
    },
    shengcaimrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (!get.tag(event2.card, "damage") || !player2.isPhaseUsing()) return false;
        return player2.getHistory("useCard", function(evt) {
          return get.tag(evt.card, "damage") > 0;
        }).length > 1;
      },
      prompt: function(event2, player2) {
        return "【圣裁】：是否令" + get.translation(event2.card) + "伤害基数+1？";
      },
      content: function() {
        if (!trigger.baseDamage) trigger.baseDamage = 1;
        trigger.baseDamage++;
      },
      group: "shengcaimrfz_damage",
      subSkill: {
        damage: {
          direct: true,
          trigger: { player: "phaseEnd" },
          filter: function(event2, player2) {
            return game.countPlayer((current) => {
              return current != player2 && current.getHistory("damage").length > 0;
            }) > 0;
          },
          content: function() {
            "step 0";
            var next = player.chooseTarget(
              [1, Infinity],
              "【圣裁】：你可以对本回合造成过伤害的其他角色造成一点伤害",
              function(card2, player2, target2) {
                return target2 != player2 && target2.getHistory("damage").length > 0;
              }
            );
            next.ai = function(target2) {
              return get.attitude(player, target2) < 0;
            };
            if (result.targets) {
              player.logSkill("shengcaimrfz");
              for (i of result.targets) {
                i.damage("player");
                player.line(i);
              }
            }
          }
        }
      }
    },
    //涤火杰西卡
    yijiemrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        if (player2.countCards("he") == 0) return false;
        return game.countPlayer(function(current) {
          return current != player2 && current.countCards("h") > 0;
        }) > 0;
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2;
      },
      targetprompt: ["被出杀(A)", "出杀(B)", "出杀(B)"],
      selectTarget: [2, 3],
      multitarget: true,
      line: false,
      content: function() {
        "step 0";
        event.num = 0;
        targets.push(player);
        var frsTargets = targets[0], secTargets = targets.slice(1);
        for (var i2 of secTargets) i2.line(frsTargets);
        var frsTargets = targets[0], secTargets = targets.slice(1);
        if (event.num < secTargets.length) {
          secTargets[event.num].storage.yijiemrfz = frsTargets;
          secTargets[event.num].addTempSkill("yijiemrfz_gain", "shaMiss");
          secTargets[event.num].chooseToUse(
            function(card2, player2, event2) {
              if (get.name(card2) != "sha") return false;
              return lib.filter.filterCard.apply(this, arguments);
            },
            "【义劫】：是否对" + get.translation(frsTargets) + "使用一张杀？"
          ).set("complexSelect", true).set("filterTarget", function(card2, player2, target2) {
            if (target2 != _status.event.frsTargets && !ui.selected.targets.includes(_status.event.frsTargets)) return false;
            return lib.filter.targetEnabled.apply(this, arguments);
          }).set("addCount", false).set("frsTargets", frsTargets);
          event.num++;
          event.redo();
        }
      },
      ai: {
        order: 4.1,
        expose: 0.1,
        result: {
          player: 1,
          target: function(player2, target2) {
            if (ui.selected.targets.length == 0) {
              return -3;
            } else return 1;
          }
        }
      },
      //group:'tuohuangmrfz',
      subSkill: {
        gain: {
          direct: true,
          charlotte: true,
          trigger: {
            source: "damageEnd"
          },
          onremove: function(player2) {
            delete player2.storage.yijiemrfz;
          },
          filter: function(event2, player2) {
            return event2.card && event2.card.name == "sha" && event2.player == player2.storage.yijiemrfz;
          },
          content: function() {
            if (trigger.player.countCards("he") > 0) player.gainPlayerCard(trigger.player, true, "he");
            else trigger.player.damage("player");
            player.removeSkill("yijiemrfz_gain");
            delete player.storage.yijiemrfz;
          }
        }
      }
    },
    fuhuangmrfz: {
      audio: 2,
      derivation: ["tuohuangmrfz", "weihumrfz"],
      skillAnimation: true,
      animationColor: "fire",
      unique: true,
      juexingji: true,
      forced: true,
      trigger: {
        player: "gainAfter",
        global: "loseAsyncAfter"
      },
      filter: function(event2, player2) {
        return player2.countMark("fuhuangmrfz_mark") >= 2;
      },
      content: function() {
        player.removeMark("fuhuangmrfz_mark", player.countMark("fuhuangmrfz_mark"), false);
        player.awakenSkill("fuhuangmrfz");
        player.removeSkill("yijiemrfz");
        player.addSkill("tuohuangmrfz");
        player.addSkill("weihumrfz");
        player.draw(2);
        player.changeHujia(1);
        player.loseMaxHp(1);
      },
      group: "fuhuangmrfz_mark",
      subSkill: {
        mark: {
          intro: {
            content: "已获得#张牌"
          },
          silent: true,
          firstDo: true,
          trigger: {
            player: "gainAfter",
            global: "loseAsyncAfter"
          },
          filter: function(event2, player2) {
            if (player2.countMark("fuhuangmrfz_mark") >= 2) return false;
            return event2.getg(player2).length && event2.getParent("phaseDraw").player != player2;
          },
          content: function() {
            player.addMark("fuhuangmrfz_mark", false, trigger.num);
          }
        }
      }
    },
    tuohuangmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return game.hasPlayer(function(current) {
          return current.countCards("he") > 0;
        });
      },
      multitarget: true,
      multiline: true,
      filterTarget: function(card2, player2, target2) {
        return target2.countCards("h") > 0;
      },
      selectTarget: [1, 3],
      content: function() {
        "step 0";
        var num = 4 - targets.length;
        var cards2 = game.cardsGotoOrdering(get.cards(num)).cards;
        event.cards = cards2;
        player.showCards(event.cards, get.translation(player) + "发动了【拓荒】");
        event.num = 0;
        if (event.num < targets.length) {
          var suit = [];
          for (var i2 of event.cards) {
            if (!suit.includes(get.suit(i2)) && lib.suit.includes(get.suit(i2))) suit.push(get.suit(i2));
          }
          targets[event.num].chooseToDiscard(
            "h",
            "【拓荒】：你可以弃置" + get.translation(suit) + "花色的手牌并摸等量+1张牌",
            [1, Infinity],
            function(card2) {
              var suitcard = get.suit(card2);
              if (suit.includes("diamond") && suitcard == "diamond") return true;
              if (suit.includes("heart") && suitcard == "heart") return true;
              if (suit.includes("spade") && suitcard == "spade") return true;
              if (suit.includes("club") && suitcard == "club") return true;
            }
          ).set("ai", function(card2) {
            return 8 - get.value(card2);
          });
        } else event.finish();
        if (result.cards) {
          targets[event.num].draw(1 + result.cards.length);
        }
        event.num++;
        event.goto(1);
      },
      ai: {
        expose: 0.1,
        threaten: 1.35,
        order: 1,
        result: {
          player: 1,
          target: 1
        }
      }
    },
    weihumrfz: {
      mod: {
        maxHandcard: function(player2, num) {
          if (player2.hujia > 0) return num + 1;
        }
      },
      audio: 2,
      trigger: { global: "roundStart" },
      filter: function(event2, player2) {
        return player2.hujia < 1;
      },
      forced: true,
      content: function() {
        player.changeHujia();
      },
      group: "weihumrfz_give",
      subSkill: {
        give: {
          trigger: { player: "phaseUseEnd" },
          filter: function(event2, player2) {
            return player2.hujia > 0;
          },
          direct: true,
          content: function() {
            "step 0";
            player.chooseTarget(
              [1, player.hujia + 1],
              "【卫护】：你可以失去至少一点护甲，然后令等量+1名没有护甲的其他角色获得一点护甲",
              function(card2, player2, target2) {
                return target2 != player2 && target2.hujia < 1;
              }
            ).ai = function(target2) {
              return get.attitude(player, target2) > 2;
            };
            if (result.targets) {
              player.logSkill("weihumrfz");
              player.changeHujia(Math.min(-1, -result.targets.length + 1));
              for (i of result.targets) {
                i.changeHujia();
                player.line(i);
              }
            }
          }
        }
      }
    },
    //提丰 小台风
    ruiyamrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          return "上一个成为一唯一目标的【杀】的角色：" + (player2.storage.ruiyamrfz ? get.translation(player2.storage.ruiyamrfz) : "无");
        }
      },
      audio: 2,
      trigger: {
        player: "useCard2"
      },
      filter: function(event2, player2) {
        return event2.cards && event2.card.name == "sha" && event2.targets && event2.targets.length == 1 && event2.targets[0] == player2.storage.ruiyamrfz;
      },
      //QQQ
      prompt: "【锐牙】:是否令此杀伤害+1？",
      check: function(event2, player2) {
        return get.attitude(player2, event2.targets[0]) < 2;
      },
      //QQQ
      content: function() {
        var target2 = trigger.targets[0];
        target2.addTempSkill("ruiyamrfz_dam");
        target2.storage.ruiyamrfz_dam = {
          card: trigger.card
        };
      },
      group: "ruiyamrfz_mark",
      subSkill: {
        mark: {
          charlotte: true,
          silent: true,
          direct: true,
          trigger: {
            player: "useCardToPlayered"
          },
          filter: function(event2, player2) {
            if (!event2.targets || event2.targets > 1) return false;
            return event2.card && event2.card.name == "sha";
          },
          content: function() {
            player.storage.ruiyamrfz = trigger.target;
          }
        },
        dam: {
          onremove: function(player2) {
            delete player2.storage.ruiyamrfz_dam;
          },
          trigger: {
            player: "damageBegin3"
          },
          filter: function(event2, player2) {
            var info = player2.storage.ruiyamrfz_dam;
            return event2.card && event2.card == info.card;
          },
          silent: true,
          popup: false,
          forced: true,
          content: function() {
            trigger.num++;
          }
        }
      }
    },
    shouliemrfz: {
      marktext: "矢",
      intro: {
        name: "矢",
        content: "expansion",
        markcount: "expansion"
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getExpansions(skill);
        if (cards2.length) player2.loseToDiscardpile(cards2);
      },
      audio: 4,
      enable: "phaseUse",
      filter: function(event2, player2) {
        if (player2.getExpansions("shouliemrfz").length >= 3) return false;
        return player2.countCards("he", function(card2) {
          return get.tag(card2, "damage") > 0;
        }) > 0;
      },
      filterCard: function(card2) {
        return get.tag(card2, "damage");
      },
      selectCard: function() {
        var player2 = _status.event.player;
        return [1, 3 - player2.getExpansions("shouliemrfz").length];
      },
      check: function(card2) {
        return 10 - get.value(card2) || card2.name == "sha";
      },
      prompt: "【狩猎】：将任意张带有伤害标签的牌置于你的武将牌上，称之为‘矢’",
      discard: false,
      lose: false,
      content: function() {
        player.addToExpansion(cards, player, "giveAuto").gaintag.add("shouliemrfz");
      },
      group: ["shouliemrfz_use", "shouliemrfz_shasha"],
      ai: {
        order: 13,
        threaten: function() {
          var player2 = _status.event.player;
          return 1.4 + player2.getExpansions("shouliemrfz").length * 0.2;
        },
        result: {
          player: 1
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        },
        use: {
          audio: "shouliemrfz",
          enable: ["chooseToRespond", "chooseToUse"],
          filter: function(event2, player2) {
            if (player2.getExpansions("shouliemrfz").length < 1 || player2.hasSkill("shouliemrfz_ban")) return false;
            return event2.filterCard({ name: "sha" }, player2, event2);
          },
          chooseButton: {
            dialog: function(event2, player2) {
              return ui.create.dialog("狩猎", player2.getExpansions("shouliemrfz"), "hidden");
            },
            backup: function(links, player2) {
              return {
                viewAs: {
                  name: "sha",
                  nature: "stab"
                },
                cards: links,
                selectCard: -1,
                position: "x",
                filterCard: (card2) => lib.skill["shouliemrfz_use_backup"].cards.includes(card2),
                popname: true,
                precontent: function() {
                  player2.addTempSkill("shouliemrfz_ban", "phaseEnd");
                }
              };
            },
            prompt: function(links, player2) {
              return "【狩猎】：将" + get.translation(links.name) + "当做一张刺【杀】使用或打出";
            }
          },
          ai: {
            order: 2.95,
            respondSha: true,
            result: {
              player: 1
            },
            skillTagFilter: function(player2, tag, arg) {
              if (player2.getExpansions("shouliemrfz").length < 1) return false;
            }
          }
        },
        shasha: {
          markimage: "extension/WhichWay/image/skill/taifengmrfz.png",
          intro: {
            content: function(event2, player2) {
              return "你成为了" + get.translation(
                game.findPlayer(function(current) {
                  return current != player2 && current.hasSkill("shouliemrfz");
                })
              ) + "的猎物";
            }
          },
          audio: "shouliemrfz",
          trigger: { player: "phaseZhunbeiBegin" },
          filter: function(event2, player2) {
            if (player2.getHistory("skipped").includes("phaseUse") || player2.getHistory("skipped").includes("phaseDiscard")) return false;
            return true;
          },
          check: function(event2, player2) {
            if (player2.countCards("j", function(card2) {
              return get.name(card2) == "lebu";
            }) > 0 && player2.countCards("h") + 2 > player2.getHandcardLimit())
              return true;
            return player2.getExpansions("shouliemrfz").length + player2.countCards("h", function(card2) {
              return get.name(card2) == "sha";
            }) > 2;
          },
          prompt: "【狩猎】：是否跳过出牌阶段和弃牌阶段，然后选择一名其他角色，直到你的下个回合开始时，每个其他角色的结束阶段，你都可以对其使用一张【杀】？",
          content: function() {
            "step 0";
            player.skip("phaseUse");
            player.skip("phaseDiscard");
            player.addSkill("shouliemrfz_usesha");
            player.chooseTarget(
              "【狩猎】：请选择一名其他角色",
              function(card2, player2, target3) {
                return target3 != player2;
              },
              true
            ).ai = function(target3) {
              return get.attitude(_status.event.player, target3) < 0;
            };
            if (result.targets) {
              var target2 = result.targets[0];
              player.storage.shouliemrfz_shasha = target2;
              target2.addMark("shouliemrfz_shasha", false);
              player.line(target2);
            }
          },
          ai: {
            expose: 0.1
          }
        },
        rem: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            game.countPlayer(function(current) {
              if (current.hasMark("shouliemrfz_shasha")) current.removeAllmark("shouliemrfz_shasha", false);
            });
            player.removeSkill("shouliemrfz_usesha");
            delete player.storage.shouliemrfz_shasha;
          }
        },
        usesha: {
          trigger: {
            global: "phaseJieshuBegin"
          },
          direct: true,
          filter: function(event2, player2) {
            if (event2.player == player2) return false;
            return event2.player.isIn() && lib.filter.targetEnabled({ name: "sha" }, player2, event2.player) && (player2.hasSha() || _status.connectMode || player2.getExpansions("shouliemrfz").length > 0);
          },
          content: function() {
            var target2 = game.findPlayer(function(current) {
              return current != player && player.storage.shouliemrfz_shasha == current;
            });
            player.chooseToUse(
              function(card2, player2, event2) {
                if (get.name(card2) != "sha") return false;
                return lib.filter.filterCard.apply(this, arguments);
              },
              "【狩猎】：是否对" + get.translation(target2) + "使用一张【杀】？"
            ).set("logSkill", "shouliemrfz").set("complexSelect", true).set("filterTarget", function(card2, player2, target3) {
              if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
              return lib.filter.targetEnabled.apply(this, arguments);
            }).set("sourcex", target2);
          },
          group: "shouliemrfz_rem"
        }
      }
    },
    //vvan薇薇安娜
    zhanjumrfz: {
      audio: 2,
      trigger: {
        global: "dying"
      },
      filter: function(event2, player2) {
        if (!game.checkMod({ name: "tao", isCard: true }, player2, event2.player, "unchanged", "cardSavable", player2)) return false;
        return player2.countCards("h") > 0 && event2.player.hp <= 0;
      },
      check: function(event2, player2) {
        if (get.attitude(player2, event2.player) < 0) return false;
        return player2.countCards("h", function(card2) {
          return card2.name == "tao";
        }) + event2.player.hp < 0;
      },
      prompt: function(event2, player2) {
        return "【盏菊】:你可以将所有手牌当作【桃】对" + get.translation(event2.player) + "使用";
      },
      content: function() {
        var cards2 = player.getCards("h");
        trigger.player.storage.zhanjumrfz = true;
        player.useCard({ name: "tao" }, cards2, trigger.player);
      },
      group: "zhanjumrfz_recast",
      subSkill: {
        recast: {
          silent: true,
          lastDo: true,
          trigger: { global: "dyingAfter" },
          filter: function(event2, player2) {
            return event2.player.storage.zhanjumrfz;
          },
          content: function() {
            "step 0";
            delete trigger.player.storage.zhanjumrfz;
            if (player.countCards("hej") == 0) event.finish();
            else {
              player.chooseCard("【盏菊】:你可以重铸一张你区域内的牌", "hej");
            }
            if (result.cards) {
              player.recast(result.cards);
              player.logSkill("zhanjumrfz");
            }
          }
        }
      }
    },
    zhuhuomrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filterCard: function(card2, player2) {
        return player2.canRecast(card2);
      },
      selectCard: 1,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      position: "he",
      discard: false,
      lose: false,
      check: function(card2) {
        return 8 - get.value(card2);
      },
      content: function() {
        player.recast(cards);
      },
      group: "zhuhuomrfz_draw",
      ai: {
        order: 13,
        result: {
          player: 1
        }
      },
      subSkill: {
        reget: {
          silent: true,
          popup: false,
          lastDo: true,
          trigger: {
            global: ["phaseZhunbeiAfter", "phaseJudgeAfter", "phaseUseAfter", "phaseDiscardAfter", "phaseJieshuAfter"]
          },
          content: function() {
            player.addSkill("zhuhuomrfz");
            player.removeSkill("zhuhuomrfz_reget");
          }
        },
        draw: {
          direct: true,
          trigger: { player: "loseAfter" },
          filter: function(event2, player2) {
            if (!event2.cards) return false;
            return event2.getParent(2).name == "recast";
          },
          content: function() {
            "step 0";
            if (trigger.cards.length > 1) {
              var num = 0;
              for (i of trigger.cards) {
                num += get.cardNameLength(i);
              }
            } else var num = get.cardNameLength(trigger.cards[0]);
            event.num = num;
            var next = player.chooseControl("发牌", "摸牌", "cancel2");
            next.set("prompt", "是否发动【烛火】？");
            next.set("ai", function() {
              var player2 = _status.event.player;
              var count = game.countPlayer(function(current) {
                return current != player2 && get.attitude(current, player2) > 2;
              });
              if (num == 1) return 0;
              if (count - num < 0) return 1;
              return 0;
            });
            if (result.control == "cancel2") event.finish();
            else {
              if (result.index == 1) {
                player.draw(Math.min(event.num, 5));
                player.logSkill("zhuhuo2mrfz");
                player.addSkill("zhuhuomrfz_reget");
                player.removeSkill("zhuhuomrfz");
              } else {
                var num = event.num;
                var next = player.chooseTarget(true, "【烛火】:你可以选择至多" + num + "名角色，令其各摸一张牌", [1, num]);
                next.ai = function(target2) {
                  return get.attitude(target2, player) > 2;
                };
              }
            }
            if (result.targets) {
              var targets2 = result.targets;
              for (i of targets2) {
                i.draw();
                player.line(i);
              }
              player.logSkill("zhuhuo2mrfz");
            }
          },
          ai: {
            expose: 0.1
          }
        }
      }
    },
    zhuhuo2mrfz: {
      audio: 2
    },
    yunjiaomrfz: {
      mod: {
        aiOrder: function(player2, card2, num) {
          if (typeof card2 == "object" && !get.tag(card2, "norepeat")) {
            var history = player2.getAllHistory("useCard");
            if (history.length > 0) {
              var cardx = history[history.length - 1].card;
              if (get.is.yayun(get.translation(cardx.name), get.translation(card2.name))) return num + 20;
            }
          }
        }
      },
      mark: true,
      intro: {
        content: function(event2, player2) {
          var history = player2.getAllHistory("useCard");
          var evt = history[history.length - 1];
          if (!evt) return "没有使用过牌";
          return "你上一张使用的牌是：" + get.translation(evt.card.name) + "(" + get.pinyin(get.translation(evt.card.name)) + ")";
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCard" },
      filter: function(event2, player2) {
        var history = player2.getAllHistory("useCard"), index = history.indexOf(event2);
        if (index < 1) return false;
        var evt = history[index - 1];
        return get.is.yayun(get.translation(event2.card.name), get.translation(evt.card.name)) && player2.isPhaseUsing();
      },
      content: function() {
        var skills = player.getStockSkills(true, true);
        game.expandSkills(skills);
        var resetSkills = [];
        var suffixs = ["used", "round", "block", "blocker"];
        for (var skill of skills) {
          var info = get.info(skill);
          if (typeof info.usable == "number") {
            if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
              delete player.storage.counttrigger[skill];
              resetSkills.add(skill);
            }
            if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
              delete player.getStat("skill")[skill];
              resetSkills.add(skill);
            }
          }
          if (info.round && player.storage[skill + "_roundcount"]) {
            delete player.storage[skill + "_roundcount"];
            resetSkills.add(skill);
          }
          if (player.awakenedSkills.includes(skill)) {
            player.restoreSkill(skill);
            resetSkills.add(skill);
          }
          for (var suffix of suffixs) {
            if (player.hasSkill(skill + "_" + suffix)) {
              player.removeSkill(skill + "_" + suffix);
              resetSkills.add(skill);
            }
          }
        }
        if (resetSkills.length) {
          var str = "";
          for (var i2 of resetSkills) {
            str += "【" + get.translation(i2) + "】、";
          }
          game.log(player, "重置了技能", "#g" + str.slice(0, -1));
        }
      }
    },
    //纯爱 纯烬艾雅法拉 奶羊 我老婆涅😋
    lvmengmrfz: {
      init: function(player2) {
        player2.storage.lvmengmrfz = {
          beifeng: [],
          zhongzi: [],
          pimao: []
        };
      },
      mark: true,
      intro: {
        content: function(event2, player2) {
          var storage = player2.storage.lvmengmrfz;
          var str = "北风：" + (storage["beifeng"].length > 0 ? get.translation(storage["beifeng"]) : "无") + "</br>种子：" + (storage["zhongzi"].length > 0 ? get.translation(storage["zhongzi"]) : "无") + "</br>皮毛：" + (storage["pimao"].length > 0 ? get.translation(storage["pimao"]) : "无");
          return str;
        }
      },
      audio: 4,
      forced: true,
      trigger: { global: "roundStart" },
      content: function() {
        "step 0";
        if (!player.storage.lvmengmrfz)
          player.storage.lvmengmrfz = {
            beifeng: [],
            zhongzi: [],
            pimao: []
          };
        var list = [
          ["未分配牌的类型（对话框较长，请下滑操作）", [["basic", "trick", "equip"], "vcard"]],
          ["北风（从牌堆中获得一张你手牌中没有的花色）", []],
          ["种子（此牌结算完毕后你可以将其交给一名其他角色）", []],
          ["皮毛（不可被其他角色响应）", []]
        ];
        var next = player.chooseToMove("【旅梦】：请分配牌的类型", true);
        next.set("list", list);
        next.set("filterMove", function(from, to, moved) {
          if (typeof to == "number") {
            if (to == 0) return true;
          }
          return true;
        });
        next.set("processAI", function() {
          var player2 = _status.event.player;
          var moved = [[], [], [], []];
          var hasFriend = function(player3) {
            return game.hasPlayer((current) => {
              return get.attitude(player3, current) > 2 && current != player3;
            });
          };
          if (!hasFriend(player2)) {
            moved[1].addArray(["equip"]);
            if (Math.random() < 0.5) moved[1].addArray(["trick"]);
            else moved[3].addArray(["trick"]);
            moved[3].addArray(["basic"]);
          } else {
            moved[1].addArray(["equip"]);
            if (Math.random() < 0.5) {
              moved[2].addArray(["trick"]);
              moved[3].addArray(["basic"]);
            } else {
              moved[2].addArray(["trick", "basic"]);
            }
          }
          return moved;
        });
        if (result.bool) {
          game.broadcastAll(
            function(moved, player2) {
              var transform = function(input) {
                return input.map((item) => {
                  if (item.length === 0) {
                    return item;
                  } else if (typeof item[0] === "string") {
                    return item;
                  } else {
                    return item.map((subItem) => subItem[2]);
                  }
                });
              };
              var moved = moved.slice(1);
              moved = transform(moved);
              player2.storage.lvmengmrfz = {
                beifeng: [],
                zhongzi: [],
                pimao: []
              };
              var keys = Object.keys(player2.storage.lvmengmrfz);
              for (var i2 = 0; i2 < moved.length; i2++) {
                for (var j = 0; j < moved[i2].length; j++) {
                  player2.storage.lvmengmrfz[keys[i2]].add(moved[i2][j]);
                }
              }
            },
            result.moved,
            player
          );
        }
      },
      group: ["lvmengmrfz_beifeng", "lvmengmrfz_zhongzi", "lvmengmrfz_pimao", "lvmengmrfz_tag"],
      subSkill: {
        // 标签
        tag: {
          silent: true,
          charlotte: true,
          trigger: { player: ["gainEnd", "lvmengmrfzAfter"] },
          filter(event2, player2) {
            return player2.storage.lvmengmrfz;
          },
          content() {
            var storage = player.storage.lvmengmrfz, cards2 = trigger.name == "gain" ? trigger.cards : player.getCards("h");
            if (trigger.name == "lvmengmrfz") {
              for (var i2 of ["beifeng_lvmengmrfz", "zhongzi_lvmengmrfz", "pimao_lvmengmrfz"]) {
                player.removeGaintag(i2);
              }
            }
            for (var key in storage) {
              for (var i2 of cards2) {
                if (storage[key].includes(get.type2(i2))) i2.addGaintag(key + "_lvmengmrfz");
              }
            }
          }
        },
        //北风
        beifeng: {
          direct: true,
          usable: 4,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            var type = player2.storage.lvmengmrfz["beifeng"], tmp_bool = false;
            if (!type || !event2.card) return false;
            for (var i2 = 0; i2 < type.length; i2++) {
              if (get.type(event2.card, "trick") == type[i2]) {
                tmp_bool = true;
                break;
              }
            }
            var cards2 = player2.getCards("h"), list = [];
            for (var i2 of cards2) {
              list.add(get.suit(i2, player2));
            }
            return list.length < 4 && tmp_bool;
          },
          content: function() {
            var cards2 = player.getCards("h"), list = [];
            for (var i2 of cards2) {
              list.add(get.suit(i2, player));
            }
            var result2 = lib.suit.filter((item) => !list.includes(item));
            var card2 = get.cardPile2((card3) => {
              for (var i3 = 0; i3 < result2.length; i3++) {
                return get.suit(card3) == result2[i3];
              }
            });
            if (card2) player.gain(card2, "gain2");
            if (!trigger.audioed) {
              trigger.audioed = true;
              player.logSkill("lvmengmrfz");
            }
          }
        },
        //种子
        zhongzi: {
          direct: true,
          trigger: { player: "useCardAfter" },
          filter: function(event2, player2) {
            var type = player2.storage.lvmengmrfz["zhongzi"], tmp_bool = false;
            if (!type || !event2.card) return false;
            for (var i2 = 0; i2 < type.length; i2++) {
              if (get.type(event2.card, "trick") == type[i2]) {
                tmp_bool = true;
                break;
              }
            }
            return event2.cards.filterInD().length > 0 && tmp_bool;
          },
          content: function() {
            "step 0";
            player.chooseTarget("【旅梦】:将" + get.translation(trigger.cards) + "交给一名其他角色", function(card2, player2, target2) {
              return target2 != player2;
            }).set("ai", function(target2) {
              if (target2.hasJudge("lebu")) return 0;
              var att = get.attitude(_status.event.player, target2);
              if (att < 3) return 0;
              if (target2.hasSkillTag("nogain")) att /= 10;
              if (target2.hasSha() && _status.event.sha) {
                att /= 5;
              }
              if (event.wuxie && target2.needsToDiscard(1)) {
                att /= 5;
              }
              return att / (1 + get.distance(player, target2, "absolute"));
            }).set("sha", trigger.cards[0].name == "sha").set("wuxie", trigger.cards[0].name == "wuxie");
            if (result.bool) {
              player.line(result.targets[0]);
              if (!trigger.audioed) {
                trigger.audioed = true;
                player.logSkill("lvmengmrfz");
              }
              result.targets[0].gain(trigger.cards.filterInD(), "gain2");
            }
          }
        },
        //皮毛
        pimao: {
          direct: true,
          trigger: { player: "useCard" },
          filter: function(event2, player2) {
            var type = player2.storage.lvmengmrfz["pimao"], tmp_bool = false;
            if (!type || !event2.card) return false;
            for (var i2 = 0; i2 < type.length; i2++) {
              if (get.type(event2.card, "trick") == type[i2]) {
                tmp_bool = true;
                break;
              }
            }
            return tmp_bool;
          },
          content: function() {
            if (!trigger.audioed) {
              trigger.audioed = true;
              player.logSkill("lvmengmrfz");
            }
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current != player;
              })
            );
          }
        }
      },
      ai: {
        threaten: 1.6
      }
    },
    rechenmrfz: {
      mark: true,
      intro: {
        content: function(event2, player2) {
          var evt = player2.getLastUsed();
          if (!player2.isPhaseUsing()) return "不是你的出牌阶段";
          if (!evt || !evt.card) return "本回合你未使用过牌";
          return "上一张你使用的牌的花色是：" + get.translation(get.suit(evt.card));
        }
      },
      audio: 2,
      trigger: { player: "useCard" },
      forced: true,
      firstDo: true,
      filter: function(event2, player2) {
        var evt = player2.getLastUsed(1);
        if (event2.getParent("phaseUse").player != player2) return false;
        return evt && evt.card && get.suit(event2.card) == get.suit(evt.card) && !event2.audioed;
      },
      content: function() {
        trigger.audioed = true;
      },
      mod: {
        aiOrder: function(player2, card2, num) {
          if (typeof card2 == "object" && player2.isPhaseUsing()) {
            var evt = player2.getLastUsed();
            if (evt && evt.card && get.suit(evt.card) && get.suit(evt.card) == get.suit(card2)) {
              return num + 10;
            }
          }
        },
        cardUsable: function(card2, player2) {
          var evt = player2.getLastUsed();
          if (evt && evt.card && get.suit(card2) == get.suit(evt.card)) return Infinity;
        },
        targetInRange: function(card2, player2, target2, now) {
          var evt = player2.getLastUsed();
          if (evt && evt.card && get.suit(card2) == get.suit(evt.card)) return true;
        }
      },
      group: ["rechenmrfz_syn"],
      subSkill: {
        syn: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { player: "useCardEnd" },
          filter: function(event2, player2) {
            return event2.getParent("phaseUse").player === player2;
          },
          async content(event2, trigger2, player2) {
            player2.addTip("rechenmrfz_tip", `热忱 ${get.translation(get.suit(trigger2.card))}`, "phaseUseEnd");
          }
        }
      }
    },
    //塑心 阿尔图罗 2226
    qinmingmrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      filter: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && target2.countCards("h") > 0;
      },
      selectTarget: 1,
      content: function() {
        "step 0";
        var tmp_cards = target.getCards("h");
        var cards2 = [];
        for (i of tmp_cards) {
          if (target.canRecast(i)) cards2.push(i);
        }
        target.recast(cards2);
        var cards2 = target.getCards("h");
        target.showCards(cards2, "【琴鸣】:" + get.translation(target) + "的手牌");
        var cards2 = target.getCards("h");
        var canCards = [];
        for (i of cards2) {
          if (target.canUseToAnyone(i)) canCards.push(i);
        }
        event.cards = canCards;
        if (event.cards.length > 0) {
          if (target.hasCard(event.cards[0].name, "h")) target.chooseUseTarget(true, event.cards[0], false);
          event.goto(2);
        }
      },
      ai: {
        order: 8,
        expose: 0.1,
        result: {
          target: function(player2, target2) {
            var lowAtt = game.hasPlayer((current) => {
              return current != player2 && current.inRange(target2) && get.attitude(player2, current) < 0;
            }) && get.attitude(player2, target2) < 0;
            var hightAtt = game.hasPlayer((current) => {
              return current != player2 && current.inRange(target2) && get.attitude(player2, current) < 0;
            }) && get.attitude(player2, target2) > 0;
            if (lowAtt) return -1;
            if (hightAtt) return 1;
            return 0;
          }
        }
      }
    },
    kongwomrfz: {
      audio: 2,
      forced: true,
      trigger: { player: "drawBegin" },
      filter: function(event2, player2) {
        return event2.num > 0;
      },
      content: function() {
        var num = trigger.num;
        trigger.cancel();
        var cards2 = [], banCards = [];
        var loseCards = player.getHistory("lose", (evt) => {
          return evt.player == player;
        });
        for (var i2 of loseCards) {
          if (!i2.cards) continue;
          banCards.push(i2.cards);
        }
        while (cards2.length < num) {
          var card2 = get.discardPile((card3) => {
            return !cards2.includes(card3) && !banCards.includes(card3);
          });
          if (card2) cards2.push(card2);
          else break;
        }
        player.gain(cards2, "gain2");
      },
      group: ["kongwomrfz_get", "kongwomrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          direct: true,
          trigger: { player: "phaseUseEnd" },
          content: function() {
            if (player.storage.kongwomrfz_get) delete player.storage.kongwomrfz_get;
          }
        },
        get: {
          audio: "kongwomrfz",
          direct: true,
          trigger: { global: "loseAfter" },
          filter: function(event2, player2) {
            if (event2.player == player2 || !player2.isPhaseUsing()) return false;
            if (event2.getParent().name != "useCard") return false;
            var cards2 = event2.cards2.slice(0);
            for (var i2 = 0; i2 < cards2.length; i2++) {
              var type = get.type2(cards2[i2]);
              if (get.position(cards2[i2], true) == "o" && type != "equip") {
                return true;
              }
            }
            return true;
          },
          content: function() {
            "step 0";
            if (trigger.delay == false) game.delay();
            if (!player.storage.kongwomrfz_get) player.storage.kongwomrfz_get = [];
            var cards2 = [];
            for (var i2 = 0; i2 < trigger.cards2.length; i2++) {
              var card2 = trigger.cards2[i2];
              var type = get.type2(card2);
              var name = player.storage.kongwomrfz_get, name2 = card2.name;
              if (get.position(card2, true) == "o" && type != "equip" && !name.includes(name2)) {
                cards2.push(card2);
              }
            }
            if (cards2.length)
              player.chooseButton(true, ["【空我】:请选择你要获得的牌", cards2], [1, Infinity]).set("ai", (button) => {
                return cards2;
              });
            else event.finish();
            if (result.links) {
              var cards2 = result.links;
              for (i2 of cards2) {
                var name = get.name(i2);
                if (!player.storage.kongwomrfz_get.includes(name)) player.storage.kongwomrfz_get.add(name);
              }
              player.gain(cards2, "gain2");
              player.logSkill("kongwomrfz");
            }
          }
        }
      }
    },
    //赫德雷
    zhengrongmrfz: {
      init: function(player2) {
        player2.storage.zhengrongmrfz = {
          discard: false,
          losedraw: false,
          maxhp: false
        };
      },
      audio: 2,
      trigger: {
        global: "damageEnd"
      },
      filter: function(event2, player2) {
        var list = [], storage = player2.storage.zhengrongmrfz;
        if (player2.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
        if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
        if (storage["maxhp"] == false) list.push("失去体力上限");
        if (list.length == 0) return false;
        if (event2.player === void 0) return false;
        if (!event2.player.isAlive()) return false;
        return event2.player == player2 || get.distance(player2, event2.player) <= 1;
      },
      prompt: function(event2, player2) {
        if (event2.player == player2) return "【征戎】：是否选择一项并回复一点体力？";
        return "【征戎】:是否选择一项并令" + get.translation(event2.player) + "回复一点体力？";
      },
      check: function(event2, player2) {
        if (get.attitude(event2.player, player2) < 0) return false;
        return true;
      },
      content: function() {
        "step 0";
        var list = [], storage = player.storage.zhengrongmrfz;
        if (player.countCards("h") > 0 && storage["discard"] == false) list.push("弃牌");
        if (storage["losedraw"] == false) list.push("摸牌阶段摸牌数-1");
        if (storage["maxhp"] == false) list.push("失去体力上限");
        player.chooseControl(list).set("ai", function() {
          return 0;
        }).set("prompt", "【征戎】:请选择一项");
        if (result.control) {
          var control = result.control;
          game.log(control);
          if (control == "弃牌") {
            player.chooseToDiscard("he", true, "【征戎】:请弃置一张牌");
            player.storage.zhengrongmrfz["discard"] = true;
          }
          if (control == "摸牌阶段摸牌数-1") {
            player.addMark("zhengrongmrfz_losedraw", false);
            player.addTempSkill("zhengrongmrfz_losedraw", {
              player: "phaseDrawAfter"
            });
            player.storage.zhengrongmrfz["losedraw"] = true;
          }
          if (control == "失去体力上限") {
            player.loseMaxHp();
            player.storage.zhengrongmrfz["maxhp"] = true;
          }
          trigger.player.recover();
        }
      },
      group: ["zhengrongmrfz_rec", "zhengrongmrfz_draw"],
      subSkill: {
        draw: {
          audio: 2,
          firstDo: true,
          trigger: { player: "phaseBegin" },
          filter: function(event2, player2) {
            var allGone = Object.values(player2.storage.zhengrongmrfz).every(function(value) {
              return value === true;
            });
            if (player2.storage.zhengrongmrfz === void 0) return false;
            return allGone;
          },
          content: function() {
            player.drawTo(player.maxHp);
          }
        },
        rec: {
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { player: "phaseBegin" },
          content: function() {
            player.storage.zhengrongmrfz = {
              discard: false,
              losedraw: false,
              maxhp: false
            };
          }
        },
        losedraw: {
          silent: true,
          charlotte: true,
          lastDo: true,
          intro: {
            content: "下个摸牌阶段摸牌数-#"
          },
          onremove: true,
          trigger: { player: "phaseDrawBegin2" },
          filter: function(event2, player2) {
            return event2.num > 0;
          },
          content: function() {
            trigger.num -= player.countMark("zhengrongmrfz_losedraw");
          }
        }
      },
      ai: {
        expose: 0.1,
        threaten: 0.8
      }
    },
    siyanmrfz: {
      audio: 2,
      trigger: { player: "useCard2" },
      filter: function(event2, player2) {
        if (event2.targets.length > 1) return false;
        if (event2.targets[0] == player2) return false;
        if (!event2.card || event2.card.name != "sha") return false;
        var history = event2.targets[0].getHistory("damage");
        for (var i2 = 0; i2 < history.length; i2++) {
          if (!history[i2].source) continue;
          if (history[i2].source == player2) return true;
        }
        var seatNum = event2.targets[0].getSeatNum();
        if (seatNum in player2.storage.siyanmrfz_tol && player2.storage.siyanmrfz_tol[seatNum] === true) return true;
      },
      check: function(event2, player2) {
        if (get.attitude(event2.targets[0], player2) > 0) return false;
        return player2.hp > 1;
      },
      prompt: function(event2, player2) {
        return "【死烟】:是否失去一点体力并令" + get.translation(event2.targets[0]) + "选择一项？";
      },
      content: function() {
        "step 0";
        player.addTempSkill("siyanmrfz_rec", {
          player: "damageAfter"
        });
        player.storage.siyanmrfz_rec = {
          card: trigger.card
        };
        var target2 = trigger.targets[0], list = ["无法响应" + get.translation(player) + "使用的【杀】"];
        if (target2.countCards("h") > 1) list.push("弃置两张手牌");
        target2.loseHp();
        player.loseHp();
        if (list.length < 2 && target2.isAlive()) {
          trigger.directHit.addArray(
            game.filterPlayer(function(current) {
              return current == target2;
            })
          );
          game.log(target2, "选择了无法响应", player, "使用的【杀】");
          event.finish();
        } else if (target2.isAlive()) {
          target2.chooseControl().set("choiceList", list).set("prompt", "【死烟】:请选择一项").set("ai", function() {
            var player2 = _status.event.player;
            if (player2.countCards("h") < 3) return 0;
            if (!player2.hasShan()) return 0;
            if (player2.hp == 1 && player2.countCards("h", (card2) => {
              return get.name(card2) == "tao" || get.name(card2) == "jiu";
            }) > 0 && player2.countCards("h") < 3)
              return 0;
            return 1;
          });
        } else event.finish();
        if (result.control) {
          var target2 = trigger.targets[0];
          if (result.index == 1) {
            game.log(get.translation(target2), "选择了弃置两张手牌");
            target2.chooseToDiscard("h", true, 2);
          } else {
            trigger.directHit.addArray(
              game.filterPlayer(function(current) {
                return current == target2;
              })
            );
            game.log(target2, "选择了无法响应", player, "使用的【杀】");
          }
        }
      },
      group: ["siyanmrfz_tol", "siyanmrfz_clear"],
      subSkill: {
        rec: {
          onremove: function(player2) {
            delete player2.storage.siyanmrfz_rec;
          },
          trigger: {
            source: "damageEnd"
          },
          filter: function(event2, player2) {
            var info = player2.storage.siyanmrfz_rec;
            return event2.card && event2.card == info.card;
          },
          silent: true,
          popup: false,
          forced: true,
          charlotte: true,
          firstDo: true,
          content: function() {
            if (get.suit(trigger.card) == "diamond") player.recover();
          }
        },
        clear: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { global: "phaseBegin" },
          filter: function(event2, player2) {
            return event2.player != player2;
          },
          content: function() {
            var seatNum = trigger.player.getSeatNum();
            player.storage.siyanmrfz_tol[seatNum] = false;
          }
        },
        tol: {
          init: function(player2) {
            player2.storage.siyanmrfz_tol = {};
            for (var i2 = 0; i2 < game.players.length; i2++) {
              if (game.players[i2] == player2) continue;
              player2.storage.siyanmrfz_tol[i2 + 1] = false;
            }
          },
          silent: true,
          charlotte: true,
          lastDo: true,
          trigger: { player: "damageEnd" },
          filter: function(event2, player2) {
            return event2.source != void 0 && player2.isAlive();
          },
          content: function() {
            var seatNum = trigger.source.getSeatNum();
            if (seatNum in player.storage.siyanmrfz_tol && player.storage.siyanmrfz_tol[seatNum] === false) {
              player.storage.siyanmrfz_tol[seatNum] = true;
            }
          }
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          var seatNum = arg.target.getSeatNum(arg.target);
          if (!seatNum in player2.storage.siyanmrfz_tol || player2.storage.siyanmrfz_tol[seatNum] === false) return false;
          if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > 1) return false;
        }
      }
    },
    //止颂
    kuxiumrfz: {
      mod: {
        cardUsable: function(card2, player2, num) {
          if (card2.name == "sha") return num += player2.getCards("j").length;
        }
      },
      audio: 2,
      enable: "phaseUse",
      filter: function(event2, player2) {
        var cards2 = [];
        if (player2.countCards("he") < 1) return false;
        for (var i2 of lib.inpile) {
          if (get.type(i2) == "delay") cards2.push(i2);
        }
        for (var name of cards2) {
          if (player2.canAddJudge({ name })) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var cards2 = [];
          for (var i2 of lib.inpile) {
            if (get.type(i2) == "delay") cards2.push(i2);
          }
          var vcards = [];
          for (var name of cards2) {
            if (player2.canAddJudge({ name })) vcards.push(["延时锦囊", "", name]);
          }
          var dialog = ui.create.dialog("苦修", [vcards, "vcard"], "hidden");
          return dialog;
        },
        check: function(button) {
          var name = button.link[2];
          switch (name) {
            case "lebu":
              return 1;
            case "bingliang":
              return 2;
            case "shandian":
              return 3;
            default:
              return 1.5;
          }
        },
        backup: function(links, player2) {
          return {
            audio: "kuxiumrfz",
            filterCard: function(card2, player3, event2) {
              return player3.canAddJudge({
                name: links[0][2],
                cards: [card2]
              });
            },
            selectTarget: -1,
            filterTarget: function(card2, player3, target2) {
              return player3 == target2;
            },
            check(card2) {
              return 8 - get.value(card2);
            },
            viewAs: {
              name: links[0][2]
            },
            position: "he",
            popname: true,
            onuse: function(links2, player3) {
              if (!links2.cards) return;
              var next = game.createEvent("kuxiumrfz_draw", false, _status.event.getParent());
              next.cards = links2.cards;
              next.player = player3;
              next.setContent(function() {
                let num = player3.getCards("j").length;
                if (num > 0) player3.draw(num);
              });
            },
            ai: {
              result: {
                player: 1
              }
            }
          };
        },
        prompt: function(links, player2) {
          return "【苦修】：请选择一张牌将其当做一张【" + get.translation(links[0][2]) + "】对自己使用";
        }
      },
      ai: {
        order: 8,
        result: {
          player: 1
        }
      }
    },
    lirenmrfz: {
      audio: 2,
      trigger: { player: "phaseZhunbeiBegin" },
      filter: function(event2, player2) {
        return player2.countCards("j") > 0;
      },
      check: function(event2, player2) {
        var cards2 = player2.getCards("j");
        if (cards2.length == 1 && cards2[0] == "shandian") return false;
        return player2.hp > 1;
      },
      content: function() {
        var num = player.getCards("j").length;
        player.discardPlayerCard(player, num, "j", true);
        player.loseHp();
      }
    },
    //锏
    /** @type { Skill } */
    weiyamrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      onremove: true,
      mod: {
        targetInRange(card2, player2, target2) {
          if (player2.getStorage("weiyamrfz").includes(target2)) return true;
        }
      },
      audio: 2,
      trigger: { source: "damageEnd" },
      filter: function(event2, player2) {
        return event2.player != player2 && !event2.player.hasSkill("weiyamrfz_ban") && event2.player.isAlive();
      },
      prompt: function(event2, player2) {
        return "【威压】:是否令" + get.translation(event2.player) + "下个出牌阶段不能使用带有伤害类标签的牌？";
      },
      check: function(event2, player2) {
        return get.attitude(event2.player, player2) < 0;
      },
      content: async function(event2, trigger2, player2) {
        trigger2.player.addTempSkill("weiyamrfz_ban", {
          player: "phaseUseEnd"
        });
        player2.storage.weiyamrfz ??= [];
        player2.storage.weiyamrfz.add(trigger2.player);
      },
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          marktext: "战栗",
          intro: {
            content: "出牌阶段不能使用带有伤害类标签的牌"
          },
          mod: {
            cardEnabled: function(card2, player2) {
              if (get.tag(card2, "damage") > 0 && player2.isPhaseUsing()) return false;
            }
          }
        }
      },
      ai: {
        expose: 0.2,
        threaten: 1.1,
        unequip: true,
        skillTagFilter(player2, tag, arg) {
          return player2.getStorage("weiyamrfz").includes(arg.target);
        }
      }
    },
    /** @type { Skill } */
    zhiwumrfz: {
      mod: {
        cardname: function(card2, player2) {
          if (card2.cardnameCheck) return card2.name;
          card2.cardnameCheck = true;
          let result2;
          if (get.type(card2) == "trick") result2 = "sha";
          else result2 = card2.name;
          delete card2.cardnameCheck;
          return result2;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCardToTargeted" },
      filter: function(event2, player2) {
        if (event2.targets.length == 0) return false;
        return event2.card.name == "sha" && get.color(event2.card) != void 0;
      },
      content: async function(event2, trigger2, player2) {
        var targets2 = trigger2.targets;
        for (var i2 = 0; i2 < targets2.length; i2++) {
          if (targets2[i2].hasSkill("zhiwumrfz_ban")) continue;
          targets2[i2].addTempSkill("zhiwumrfz_ban");
          targets2[i2].storage.zhiwumrfz_ban = {
            player: player2,
            color: get.color(trigger2.card)
          };
          player2.line(targets2[i2]);
        }
      },
      group: ["zhiwumrfz_count", "zhiwumrfz_draw"],
      subSkill: {
        draw: {
          forced: true,
          audio: "zhiwumrfz",
          trigger: { source: "damageEnd" },
          filter(event2, player2) {
            return player2.getRoundHistory("sourceDamage", (evt) => evt.player === event2.player).length === 1;
          },
          async content(event2, trigger2, player2) {
            player2.draw();
          }
        },
        count: {
          direct: true,
          trigger: { player: "useCard1" },
          filter: function(event2, player2) {
            if (!player2.isPhaseUsing()) return false;
            if (!event2.card || event2.card.name != "sha") return false;
            if (event2.addCount === false) return false;
            return event2.card.cards.length > 1 || event2.card.cards.length == 1 && event2.cards[0].name != event2.card.name;
          },
          content: async function(event2, trigger2, player2) {
            trigger2.addCount = false;
            if (player2.stat[player2.stat.length - 1].card.sha > 0) {
              player2.stat[player2.stat.length - 1].card.sha--;
            }
          }
        },
        ban: {
          onremove: true,
          mod: {
            cardEnabled: function(card2, player2) {
              if (get.color(card2) == player2.storage.zhiwumrfz_ban["color"]) return false;
            }
          },
          silent: true,
          charlotte: true,
          trigger: { global: "useCardAfter" },
          filter: function(event2, player2) {
            return event2.card.name == "sha" && event2.player == player2.storage.zhiwumrfz_ban["player"];
          },
          content: function() {
            delete player.storage.zhiwumrfz_ban;
            player.removeSkill("zhiwumrfz_ban");
          }
        }
      }
    },
    //莱伊
    shaobanmrfz: {
      mod: {
        inRange: function(from, to) {
          if (to.hasCard((card2) => {
            return card2.name == "shadishoumrfz";
          }, "e"))
            return true;
        }
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      derivation: ["shadishoumrfz"],
      filter: function(event2, player2) {
        return player2.countCards("he") > 0 && !game.hasPlayer((current) => {
          return current.hasCard((card2) => {
            return card2.name == "shadishoumrfz";
          }, "e");
        }) && game.hasPlayer((current) => {
          return current != player2 && !current.isDisabled(2);
        });
      },
      filterCard: true,
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && !target2.isDisabled(2);
      },
      check: function(card2) {
        return 6 - get.value(card2);
      },
      content: function() {
        var card2 = game.createCard("shadishoumrfz", "heart", 13);
        target.$gain2(card2);
        game.delayx();
        target.equip(card2);
      },
      ai: {
        order: 5,
        result: {
          target: -1
        }
      },
      group: "shaobanmrfz_dam",
      subSkill: {
        ban: {
          charlotte: true
        },
        dam: {
          direct: true,
          trigger: { source: "damageBegin" },
          filter: function(event2, player2) {
            if (player2.hasSkill("shaobanmrfz_ban")) return false;
            return event2.player != player2 && event2.player.hasCard((card2) => {
              return card2.name == "shadishoumrfz";
            }, "e");
          },
          content: function() {
            trigger.num++;
            player.logSkill("shaobanmrfz", trigger.player);
            player.addTempSkill("shaobanmrfz_ban", {
              global: "phaseEnd"
            });
          }
        }
      }
    },
    tankuangmrfz: {
      mark: true,
      intro: {
        content: "剩余#次"
      },
      onremove: true,
      audio: 2,
      trigger: { player: "useCardAfter" },
      getCountInRanger(player2) {
        var num = 0, players = game.filterPlayer();
        for (var i2 = 0; i2 < players.length; i2++) {
          if (player2.inRange(players[i2])) {
            num++;
          }
        }
        return num;
      },
      filter: function(event2, player2) {
        return player2.countMark("tankuangmrfz") > 0;
      },
      check: function(event2, player2) {
        if (player2.hp < 2) return Math.random() > 0.4;
        return true;
      },
      content: function() {
        var card2 = game.cardsGotoOrdering(get.cards(1)).cards[0], num = 0;
        player.showCards(card2, get.translation(player) + "展示了牌堆顶一张牌");
        if (get.color(card2) == get.color(trigger.card)) num++;
        if (get.type(card2, "trick") == get.type(trigger.card, "trick")) num++;
        if (get.number(card2) >= get.number(trigger.card)) num++;
        if (num > 0) {
          player.draw(num);
          if (num == 3) player.recoverTo(player.maxHp);
        } else {
          player.loseHp();
          player.removeSkill("tankuangmrfz");
          player.addTempSkill("tankuangmrfz_re3", {
            global: "phaseBegin"
          });
        }
        player.removeMark("tankuangmrfz", false);
      },
      group: ["tankuangmrfz_re", "tankuangmrfz_re2"],
      subSkill: {
        re: {
          charlotte: true,
          silent: true,
          trigger: { global: "phaseBegin" },
          content: function() {
            var num = Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player));
            player.removeMark("tankuangmrfz", player.countMark("tankuangmrfz"), false);
            player.addMark("tankuangmrfz", num, false);
          }
        },
        re2: {
          init: function(player2) {
            player2.storage.tankuangmrfz_re2 = lib.skill.tankuangmrfz.getCountInRanger(player2);
          },
          charlotte: true,
          silent: true,
          trigger: {
            player: ["loseAfter", "changeHp", "gainMaxHpAfter", "loseMaxHpAfter"],
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
          },
          filter: function(event2, player2) {
            return player2.storage.tankuangmrfz_re2 - Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player2)) != 0;
          },
          content: function() {
            if (!player.storage.tankuangmrfz_re2) player.storage.tankuangmrfz_re2 = 0;
            var now = Math.max(2, lib.skill.tankuangmrfz.getCountInRanger(player));
            var last = player.storage.tankuangmrfz_re2;
            var num = now - last;
            if (num > 0) {
              player.addMark("tankuangmrfz", num, false);
            } else player.removeMark("tankuangmrfz", Math.abs(num), false);
            player.storage.tankuangmrfz_re2 = now;
          }
        },
        re3: {
          charlotte: true,
          silent: true,
          trigger: { global: "phaseEnd" },
          content: function() {
            player.addSkill("tankuangmrfz");
          }
        }
      }
    },
    //新斥罪
    newzhidianmrfz: {
      getSkillsList: function(event2, player2) {
        var list = [];
        var listm = [];
        var listv = [];
        if (player2.name1 != void 0) listm = lib.character[player2.name1][3];
        else listm = lib.character[player2.name][3];
        if (player2.name2 != void 0) listv = lib.character[player2.name2][3];
        listm = listm.concat(listv);
        var func = function(skill) {
          var info = get.info(skill);
          if (!info || info.charlotte) return false;
          return true;
        };
        for (var i2 = 0; i2 < listm.length; i2++) {
          if (func(listm[i2])) list.add(listm[i2]);
        }
        if (player2.disabledSkills) {
          for (var key in player2.disabledSkills) {
            list.remove(key);
          }
        }
        return list;
      },
      init: (player2, skill) => {
        player2.storage[skill] = [];
      },
      audio: "zhidianmrfz",
      enable: "phaseUse",
      usable: 114514,
      filter: function(event2, player2) {
        return player2.countCards("he") > 0;
      },
      filterTarget: function(card2, player2, target2) {
        return target2 != player2 && !player2.storage.newzhidianmrfz.includes(target2);
      },
      check: function(card2) {
        return 7 - get.value(card2);
      },
      position: "he",
      filterCard: true,
      delay: false,
      lose: false,
      discard: false,
      async content(event2, trigger2, player2) {
        let card2 = event2.cards, target2 = event2.target;
        player2.give(card2, target2);
        let list = [], list2 = [];
        if (target2.countCards("he") > 1) {
          list.add(`弃置三张牌，${get.translation(player2)}获得其中一张牌`);
          list2.add("选项一");
        } else list.add(`<span style="opacity:0.5">弃置三张牌，${get.translation(player2)}获得其中一张牌（不可选:牌数少于2）</span>`);
        list.add(`受到一点伤害且令${get.translation(player2)}选择让你一个技能失效`);
        list2.add("选项二");
        if (!target2.isLinked()) {
          list.add(`横置武将牌，${get.translation(player2)}本回合不能再对你使用此技能`);
          list2.add("选项三");
        } else
          list.add(`<span style="opacity:0.5">横置武将牌，${get.translation(player2)}本回合不能再对你使用此技能（不可选:已被横置）</span>`);
        var { control } = await target2.chooseControl(list2).set("choiceList", list).set("ai", function() {
          var player3 = _status.event.target, list3 = _status.event.list, hs = player3.getCards("he", (card3) => {
            return get.value(card3) < 8;
          });
          if (player3.hp < 2) list3.remove("选项二");
          if (player3.countCards("he") < 4 || hs.length < 3) list3.remove("选项一");
          if (list3.length == 0) list3.push("选项二");
          return list3[0];
        }).set("target", event2.target).set("list", list2).forResult();
        if (!control) return;
        switch (control) {
          case "选项一":
            const { cards: cards2 } = await target2.chooseToDiscard(true, "he", 3, "请弃置三张牌").forResult();
            if (!cards2) return;
            for (var i2 of cards2) {
              if (get.position(i2) != "d") cards2.remove(i2);
            }
            if (cards2.length == 0) return;
            const { links } = cards2.length == 1 ? { links: cards2 } : await player2.chooseCardButton(cards2, "【执典】:请选择获得一张牌", true, 1).forResult();
            player2.gain(links[0], "gain2");
            break;
          case "选项二":
            let skillList = lib.skill.newzhidianmrfz.getSkillsList(event2, target2);
            if (skillList.length > 0) {
              var { control } = await player2.chooseControl(skillList).set("prompt", `选择${get.translation(target2)}武将牌上的一个技能并令其失效`).forResult();
              target2.disableSkill("newzhidianmrfz_disable", control);
              target2.addTempSkill("newzhidianmrfz_disable", {
                player: "phaseAfter"
              });
              game.log(player2, "选择了", target2, "的技能", "#g【" + get.translation(control) + "】");
            }
            target2.damage();
            break;
          case "选项三":
            target2.link(true);
            if (!player2.storage.newzhidianmrfz) player2.storage.newzhidianmrfz = [];
            player2.storage.newzhidianmrfz.add(target2);
            break;
        }
      },
      group: ["newzhidianmrfz_count", "newzhidianmrfz_clear"],
      ai: {
        threaten: 1.2,
        order: 8,
        result: {
          target: function(player2, target2) {
            var att = get.attitude(player2, target2);
            if (att < 0) {
              return -(1 + target2.countCards("he") * 0.1);
            }
          }
        }
      },
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { player: "phaseAfter" },
          content: function() {
            player.storage.newzhidianmrfz = [];
          }
        },
        count: {
          silent: true,
          charlotte: true,
          trigger: {
            global: "phaseBefore",
            player: ["changeHp", "enterGame"]
          },
          filter(event2, player2) {
            return event2.name != "phase" || game.phaseNumber == 0;
          },
          content: function() {
            lib.skill.newzhidianmrfz.usable = player.hp;
          }
        },
        disable: {
          onremove(player2, skill) {
            player2.enableSkill(skill);
          },
          locked: true,
          mark: true,
          charlotte: true,
          intro: {
            content(storage, player2, skill) {
              var list = [];
              for (var i2 in player2.disabledSkills) {
                if (player2.disabledSkills[i2].includes(skill)) list.push(i2);
              }
              if (list.length) {
                var str = "失效技能：";
                for (var i2 = 0; i2 < list.length; i2++) {
                  if (lib.translate[list[i2] + "_info"]) str += get.translation(list[i2]) + "、";
                }
                return str.slice(0, str.length - 1);
              }
            }
          }
        }
      }
    },
    newpijimrfz: {
      audio: "pijimrfz",
      trigger: {
        player: "useCard"
      },
      forced: true,
      locked: false,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.isLinked();
        });
      },
      content: function() {
        trigger.directHit.addArray(
          game.filterPlayer((current) => {
            return current != player && current.isLinked();
          })
        );
      },
      ai: {
        directHit_ai: true,
        skillTagFilter: function(player2, tag, arg) {
          return arg.target.isLinked();
        }
      },
      group: "newpijimrfz_damage",
      subSkill: {
        damage: {
          audio: false,
          direct: true,
          trigger: { source: "damageEnd" },
          filter: function(event2, player2) {
            return event2.player.isLinked() && event2.getParent().name != "newpijimrfz_damage";
          },
          content: function() {
            player.logSkill("newpijimrfz");
            for (var i2 of game.players) {
              if (player == i2 || !i2.isLinked()) continue;
              player.line(i2);
              i2.damage();
            }
          }
        }
      }
    },
    //新塞雷娅
    newgaihuamrfz: {
      audio: "gaihuamrfz",
      enable: ["chooseToUse", "chooseToRespond"],
      hiddenCard: function(player2, name) {
        if (lib.inpile.includes(name) && !player2.hasSkill("newgaihuamrfz_ban") && get.type(name) == "basic") return true;
      },
      filter: function(event2, player2) {
        if (event2.responded || event2.newgaihuamrfz || player2.hasSkill("newgaihuamrfz_ban")) return false;
        for (var i2 of lib.inpile) {
          if (get.type(i2) == "basic" && event2.filterCard({ name: i2 }, player2, event2)) return true;
        }
        return false;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        var evt = event2.getParent(2);
        player2.storage.newgaihuamrfz_clear;
        evt.set("newgaihuamrfz", true);
        let list = ["牌堆顶三张牌"], list2 = ["选项一"], hd = [];
        if (ui.discardPile.childNodes.length > 2) {
          list.add("弃牌堆顶三张牌");
          list2.add("选项二");
        } else list.add('<span style="opacity:0.5">弃牌堆顶三张牌(不可选:弃牌堆牌数小于3）</span>');
        for (var i2 of game.players) {
          if (get.distance(player2, i2) > 1) continue;
          if (i2.countCards("h") < 1) continue;
          if (i2 == player2) continue;
          hd = hd.concat(i2.getCards("h"));
        }
        if (hd.length > 0) {
          list.add("与你距离不大于1的其他角色的手牌");
          list2.add("选项三");
        } else list.add('<span style="opacity:0.5">与你距离不大于1的其他角色的手牌(不可选:你距离不大于1的其他角色没有手牌）</span>');
        const { control } = await player2.chooseControl(list2, "cancel2").set("choiceList", list).set("ai", function() {
          var list3 = _status.event.list, player3 = _status.event.player, hd2 = _status.event.hd;
          if (game.countPlayer((current) => {
            return player3 != current && get.distance(player3, current) <= 1 && get.distance(player3, current) < 0;
          }) < 1 || hd2.length < 3)
            list3.remove("选项三");
          if (list3.length == 0) return "cancel2";
          return list3.randomGet();
        }).set("list", list2).set("hd", hd).forResult();
        if (!control || control == "cancel2") {
          evt.goto(0);
          return;
        }
        var cards2 = [];
        switch (control) {
          case "选项一":
            cards2 = get.cards(3, true);
            break;
          case "选项二":
            var num = 3;
            while (num--) {
              if (ui.discardPile.hasChildNodes() == false) {
                break;
              }
              var cardx = ui.discardPile.removeChild(ui.discardPile.firstChild);
              cardx.original = "d";
              cards2.push(cardx);
            }
            for (let i3 = cards2.length - 1; i3 >= 0; i3--) {
              ui.discardPile.insertBefore(cards2[i3], ui.discardPile.firstChild);
            }
            break;
          case "选项三":
            cards2 = hd;
            break;
        }
        const { links } = await player2.chooseButton(["【钙化】:选择要" + (evt.name == "chooseToUse" ? "使用" : "打出") + "的牌", cards2]).set("filterButton", function(button) {
          _status.event.player;
          _status.event;
          return _status.event.cards.includes(button.link);
        }).set(
          "cards",
          cards2.filter(function(card3) {
            if (get.type(card3) != "basic") return false;
            return evt.filterCard(card3, evt.player, evt);
          })
        ).set("ai", function(button) {
          var evt2 = _status.event.getParent(3);
          if (evt2 && evt2.ai) {
            var tmp = _status.event;
            _status.event = evt2;
            var result2 = (evt2.ai || event2.ai1)(button.link, _status.event.player, evt2);
            _status.event = tmp;
            return result2;
          }
          return 1;
        }).forResult();
        if (!links) {
          evt.goto(0);
          return;
        }
        var card2 = links[0], name = links[0].name;
        if (_status.currentPhase == player2)
          player2.addTempSkill("newgaihuamrfz_ban", {
            global: "phaseBeginStart"
          });
        if (evt.name == "chooseToUse") {
          game.broadcastAll(
            function(result2, name2) {
              lib.skill.newgaihuamrfz_backup.viewAs = {
                name: name2,
                cards: [result2],
                isCard: true
              };
            },
            card2,
            name
          );
          var evt = event2.getParent(2);
          evt.set("_backupevent", "newgaihuamrfz_backup");
          evt.set("openskilldialog", "请选择" + get.translation(card2) + "的目标");
          evt.backup("newgaihuamrfz_backup");
          player2.logSkill("gaihuamrfz");
        } else {
          delete evt.result.skill;
          delete evt.result.used;
          evt.result.card = get.autoViewAs(card2);
          evt.result.cards = [card2];
          player2.logSkill("gaihuamrfz");
          evt.redo();
          return;
        }
        evt.goto(0);
      },
      ai: {
        effect: {
          target: function(card2, player2, target2, effect) {
            if (get.tag(card2, "respondShan")) return 0.7;
            if (get.tag(card2, "respondSha")) return 0.7;
          }
        },
        order: 11,
        respondShan: true,
        respondSha: true,
        result: {
          player: function(player2) {
            if (_status.event.dying) return get.attitude(player2, _status.event.dying);
            return 1;
          }
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    newgaihuamrfz_backup: {
      sourceSkill: "newgaihuamrfz",
      precontent: function() {
        delete event.result.skill;
        var name = event.result.card.name, cards2 = event.result.card.cards.slice(0);
        event.result.cards = cards2;
        var rcard = cards2[0], card2;
        if (rcard.name == name) card2 = get.autoViewAs(rcard);
        else card2 = get.autoViewAs({ name, isCard: true });
        event.result.card = card2;
      },
      filterCard: function() {
        return false;
      },
      selectCard: -1
    },
    panshimrfz: {
      mod: {
        targetEnabled: function(card2, player2, target2) {
          for (var i2 of game.players) {
            if (i2.getHistory("useCard").length > 0) return;
          }
          return false;
        }
      },
      audio: 2,
      forced: true,
      trigger: { player: "useCard" },
      filter: function(event2, player2) {
        if (player2.getHistory("useCard").length > 1) return false;
        return event2.card && (get.type2(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name));
      },
      content: function() {
        trigger.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player;
          })
        );
      }
    },
    //新玛恩纳
    lianmangmrfz: {
      audio: 2,
      trigger: {
        target: "useCardToTargeted"
      },
      filter: function(event2, player2) {
        return player2.countCards("h") > 0 && event2.card && event2.player != player2 && !player2.hasSkill("zhanmangmrfz_ban");
      },
      banHs: function(event2, trigger2, player2) {
        player2.addTempSkill("lianmangmrfz_ban");
        _status.tmpCard = trigger2.card;
        player2.when({
          global: "useCardAfter",
          player: "dying"
        }).filter((event3, player3) => {
          return event3.card == _status.tmpCard || event3.name == "dying";
        }).then(() => {
          player2.removeSkill("lianmangmrfz_ban");
          delete _status.tmpCard;
        });
      },
      forced: true,
      async content(event2, trigger2, player2) {
        let num = get.cardNameLength(trigger2.card);
        const { cards: cards2 } = await player2.chooseCard(`【敛芒】:请重铸至多${get.cnNumber(num)}张牌`, [0, num], true).set("ai", function(card2) {
          if (get.tag(card2, "damage")) return 10 - get.value(card2);
          return 6 - get.value(card2);
        }).set("filterCard", (card2) => player2.canRecast(card2)).forResult();
        if (!cards2 || cards2.length == 0) {
          lib.skill.lianmangmrfz.banHs(event2, trigger2, player2);
          return;
        }
        let hs = player2.getCards("h");
        await player2.recast(cards2, void 0, void 0);
        if (cards2.filter((i2) => get.tag(i2, "damage")).length > 0) player2.draw();
        if (hs.isSubset(cards2)) trigger2.player.damage();
        lib.skill.lianmangmrfz.banHs(event2, trigger2, player2);
      },
      group: ["lianmangmrfz_cancel"],
      subSkill: {
        ban: {
          charlotte: true,
          mod: {
            cardEnabled2: function(card2, player2) {
              if (get.position(card2) == "h") return false;
            }
          }
        },
        cancel: {
          forced: true,
          audio: "lianmangmrfz",
          trigger: { source: "damageBefore" },
          filter: function(event2, player2) {
            return !player2.hasSkill("zhanmangmrfz_ban");
          },
          async content(event2, trigger2, player2) {
            let num = trigger2.num;
            trigger2.cancel();
            let list = ["选项一"];
            let chooseList = [`摸${get.cnNumber(num)}张牌`, `回复${get.cnNumber(num)}点体力`];
            if (player2.getDamagedHp() > 0) {
              list.push("选项二");
            } else chooseList[1] = '<span style="opacity:0.5">' + chooseList[2] + "（不可选：已损失体力值为零）</span>";
            const { control } = list.length == 1 ? player2.draw(num) : await player2.chooseControl(list).set("choiceList", chooseList).set("prompt", "【敛芒】:请选择一项").set("ai", function() {
              var list2 = _status.event.list;
              if (list2.includes("选项二")) return "选项二";
              return "选项一";
            }).set("list", list).forResult();
            if (!control) return;
            switch (control) {
              case "选项一":
                player2.draw(num);
                break;
              case "选项二":
                player2.recover(num);
                break;
            }
          }
        }
      },
      ai: {
        threaten: 0.8,
        effect: {
          target: function(card2, player2, target2) {
            if (get.tag(card2, "damage")) return [0, -999999];
          }
        }
      }
    },
    zhanmangmrfz: {
      audio: 2,
      trigger: { player: "phaseUseBegin" },
      filter: function(event2, player2) {
        return player2.countCards("h") > player2.getHandcardLimit();
      },
      prompt: function(event2, player2) {
        var num = Math.min(player2.maxHp, player2.countCards("h") - player2.getHandcardLimit());
        return `【展芒】:你可以摸${get.cnNumber(num)}张牌、本回合使用【杀】的次数+${num}，且本回合【敛芒】失效`;
      },
      content() {
        var num = Math.min(player.maxHp, player.countCards("h") - player.getHandcardLimit());
        player.draw(num);
        player.addMark("zhanmangmrfz_add", num, false);
        player.addTempSkill("zhanmangmrfz_add", {
          player: "phaseEnd"
        });
        player.addTempSkill("zhanmangmrfz_ban", {
          player: "phaseEnd"
        });
      },
      subSkill: {
        ban: {
          charlotte: true,
          mark: true,
          intro: {
            content(event2, player2) {
              return `·【敛芒】失效<br>·本回合使用【杀】的次数+${player2.countMark("zhanmangmrfz_add")}`;
            }
          }
        },
        add: {
          charlotte: true,
          onremove: true,
          mod: {
            cardUsable: function(card2, player2, num) {
              var count = player2.countMark("zhanmangmrfz_add");
              if (card2.name == "sha") return num + count;
            }
          }
        }
      },
      ai: {
        threaten: function() {
          var player2 = _status.event.player, num = player2.countCards("h") - player2.getHandcardLimit();
          return 1 + Math.max(0.2, num * 0.2);
        }
      }
    },
    xingyimrfz: {
      audio: 2,
      trigger: { global: "phaseJieshuBegin" },
      getDamagedTarget: function(event2, player2) {
        let list = [];
        for (var i2 of game.players) {
          if (player2 == i2) continue;
          let history = i2.getHistory("damage");
          for (var j = 0; j < history.length; j++) {
            let damaged = history[j].player;
            list.push(damaged);
          }
        }
        return list;
      },
      filter: function(event2, player2) {
        var list = lib.skill.xingyimrfz.getDamagedTarget(event2, player2);
        return list.length > 0 && _status.currentPhase != player2;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        let list = lib.skill.xingyimrfz.getDamagedTarget(event2, player2);
        const { targets: targets2 } = await player2.chooseTarget("【行义】:你可以受到一点伤害并令一名本回合受到过伤害的其他角色回复一点体力").set("filterTarget", function(card2, player3, target2) {
          var list2 = _status.event.list;
          return list2.includes(target2);
        }).set("ai", function(target2) {
          var player3 = _status.event.player;
          if (player3.hp < 2 && player3.countCards("h", "tao") + player3.countCards("h", "jiu") < 1) return 0;
          return get.attitude(target2, player3) > 0;
        }).set("list", list).forResult();
        if (!targets2) return;
        targets2[0].recover();
        player2.damage("nosource");
        player2.logSkill("xingyimrfz", targets2[0]);
      }
    },
    //左乐
    qikumrfz: {
      audio: 2,
      trigger: { player: "gainBegin" },
      filter: function(event2, player2) {
        return player2.countCards("h") == 0 && event2.getParent(2).name != "qikumrfz";
      },
      forced: true,
      content() {
        var num = player.maxHp - trigger.cards.length;
        player.draw(num);
      }
    },
    /** @type { Skill } */
    bingzhumrfz: {
      marktext: "司",
      intro: {
        name: "司",
        markcount: "expansion",
        content: "expansion"
      },
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter: function(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async content(event2, trigger2, player2) {
        var suit = [];
        for (var i2 of player2.getCards("h")) {
          if (suit.includes(get.suit(i2))) continue;
          suit.push(get.suit(i2));
        }
        if (suit.length == 0) return;
        const { control } = await player2.chooseControl(suit, "cancel2").set("prompt", "【秉烛】:请选择一种花色").set("ai", function() {
          var suit2 = _status.event.suit;
          return suit2.randomGet();
        }).set("suit", suit).forResult();
        if (!control || control == "cancel2") {
          if (control == "cancel2") {
            player2.setSkillCount("bingzhumrfz", -1);
          }
          return;
        }
        var hs = player2.getCards("h", (card2) => {
          return get.suit(card2) == control;
        });
        if (hs.length == 0) return;
        let list = [];
        while (hs.length) {
          const { cards: cards2 } = await player2.chooseCard(true, `【秉烛】:请分配第${get.cnNumber(list.length + 1)}组手牌`).set("selectCard", function() {
            var player3 = _status.event.player;
            var num = game.countPlayer((current) => current != player3) - (list.length + 1) > 0 ? 1 : hs.length;
            return [num, Infinity];
          }).set("ai", function(card2) {
            if (!ui.selected.cards) return 1;
            if (game.countPlayer((current) => {
              return current != player2 && get.attitude(current, player2) < 0;
            }) < 2)
              return 1;
            for (var i3 of ui.selected.cards) {
              if (get.suit(i3) == get.suit(card2)) return [-1, -1, 1, 1].randomGet();
              return 1;
            }
          }).set("filterCard", (card2) => {
            var hs2 = _status.event.hs;
            return hs2.includes(card2);
          }).set("hs", hs).forResult();
          if (!cards2) continue;
          list.push([cards2]);
          hs.removeArray(cards2);
        }
        let count = list.length, list2 = [];
        while (count) {
          const { targets: targets2 } = await player2.chooseTarget(true, `【秉烛】:请将${get.translation(list[list2.length])}置于一名其他角色的武将牌上`).set("ai", function(target2) {
            var player3 = _status.event.player;
            return get.attitude(player3, target2) < 0;
          }).set("filterTarget", lib.filter.notMe).forResult();
          count--;
          if (!targets2) continue;
          list2.push(targets2[0]);
        }
        for (var i2 = 0; i2 < list2.length; i2++) {
          list2[i2].addToExpansion(list[i2][0], list2[i2], "giveAuto").gaintag.add("bingzhumrfz");
        }
      },
      group: ["bingzhumrfz_clear", "bingzhumrfz_eff"],
      subSkill: {
        eff: {
          direct: true,
          trigger: { global: "useCardToTargeted" },
          filter: function(event2, player2) {
            var cards2 = event2.player.getExpansions("bingzhumrfz");
            if (!cards2.length || !event2.card) return false;
            if (get.type2(event2.card) != "trick" && get.type(event2.card) != "basic") return false;
            for (var i2 of cards2) {
              if (get.name(i2) == get.name(event2.card) || get.suit(i2) == get.suit(event2.card)) return true;
            }
            return false;
          },
          async content(event2, trigger2, player2) {
            var cards2 = trigger2.player.getExpansions("bingzhumrfz").filter((i2) => get.name(i2) == get.name(trigger2.card) || get.suit(i2) == get.suit(trigger2.card));
            const {
              result: { bool, links }
            } = await player2.chooseCardButton("【秉烛】:你可以弃置其一张‘司’并令此牌对一名目标角色无效", cards2).set("ai", () => {
              var player3 = _status.event.player, event3 = _status.event.getTrigger(), friend = game.filterPlayer((current) => current == player3 || get.attitude(current, player3) > 0);
              for (var i2 of event3.targets) {
                if (friend.includes(i2)) return 1;
              }
              return 0;
            });
            if (!bool) return;
            const { targets: targets2 } = await player2.chooseTarget("【秉烛】:请选择一名目标角色，然后此牌对该角色无效", true).set("ai", function(target2) {
              var player3 = _status.event.player;
              return get.attitude(target2, player3) > 0;
            }).set("filterTarget", (card2, player3, target2) => {
              var targets3 = _status.event.targets;
              return targets3.includes(target2);
            }).set("targets", trigger2.targets).forResult();
            if (!targets2) return;
            trigger2.getParent().excluded.add(targets2[0]);
            trigger2.player.loseToDiscardpile(links);
            player2.draw();
            player2.logSkill("bingzhumrfz", targets2[0]);
          }
        },
        clear: {
          charlotte: true,
          silent: true,
          trigger: { player: "dieAfter" },
          content() {
            for (var i2 of game.players) {
              var cards2 = i2.getExpansions("bingzhumrfz");
              if (cards2.length) i2.loseToDiscardpile(cards2);
            }
          }
        }
      }
    },
    //新山
    zhefumrfz: {
      audio: "zhuangtimrfz",
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        return player2.countCards("h", (card2) => get.tag(card2, "damage")) > 0;
      },
      prompt(event2, player2) {
        return `【蛰伏】:是否将手牌中所有带有伤害类标签的牌置入弃牌堆或牌堆顶并摸等量的牌？`;
      },
      async content(event2, trigger2, player2) {
        let cards2 = player2.getCards("h", (card2) => get.tag(card2, "damage"));
        if (!cards2.length) return;
        const { moved } = await player2.chooseToMove().set("list", [["牌堆底", cards2], ["弃牌堆"]]).set("processAI", (list) => {
          var player3 = _status.event.player, cards3 = list[0][1], canUse = cards3.filter((i4) => player3.canUseToAnyone(i4)), bottom2 = [], disPile2 = [];
          var red = 0, black = 0;
          for (var i3 of canUse) {
            var color = get.color(i3);
            if (!color) continue;
            else if (color == "red") red += get.value(i3);
            else black += get.value(i3);
          }
          if (red > black) bottom2 = canUse.slice().filter((i4) => get.color(i4) == "red");
          else bottom2 = canUse.slice().filter((i4) => get.color(i4) == "black");
          bottom2.sort(function(a, b) {
            return get.value(b, player3) - get.value(a, player3);
          });
          disPile2 = cards3.slice().filter((i4) => !bottom2.includes(i4));
          return [bottom2, disPile2];
        }).forResult();
        if (!moved) return;
        var bottom = moved[0], disPile = moved[1];
        console.log(moved);
        if (disPile.length) player2.loseToDiscardpile(disPile);
        if (bottom.length) {
          game.log(player2, "将", get.cnNumber(bottom.length), "置入了牌堆底");
          for (var i2 of bottom) ui.cardPile.appendChild(i2);
          player2.$throw(bottom.length, 1e3);
        }
        await player2.draw(cards2.length);
      }
    },
    yubianmrfz: {
      audio: "julimrfz",
      trigger: { player: "phaseJieshuBegin" },
      prompt(event2, player2) {
        return `【狱变】:你可以使用牌堆顶的牌（目标必须合法），若你因此使用的牌颜色均相同，你重复这个流程`;
      },
      check(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && player2.canUse("sha", current) && get.attitude(player2, current) < 0;
        });
      },
      async content(event2, trigger2, player2) {
        let cardx = [], color;
        while (true) {
          var card2 = get.bottomCards()[0];
          player2.$throw(card2, null);
          if (!player2.hasUseTarget(card2)) return;
          const result2 = await player2.chooseUseTarget(card2, `【狱变】:请选择${get.translation(card2)}的目标`);
          if (!result2) return;
          var cards2 = result2.cards;
          for (var i2 of cards2) cardx.push(i2);
          color = get.color(cards2[0]);
          for (var i2 of cardx) {
            if (get.color(i2) != color) {
              return;
            }
            color = get.color(i2);
          }
        }
      }
    },
    //新空弦
    sanyimrfz: {
      audio: "lieshimrfz",
      trigger: { player: "useCard2" },
      filter(event2, player2) {
        if (!event2.card) return false;
        if (get.name(event2.card) != "sha" || get.number(event2.card) == null) return false;
        return event2.targets && event2.targets.length == 1;
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget().set("forced", true).set("filterTarget", (card2, player3, target2) => {
          if (target2 == player3 || _status.event.targets.includes(target2) || !player3.canUse(_status.event.cardx, target2, false))
            return false;
          var selected = ui.selected.targets, base = _status.event.targetx.hp;
          var total = Object.values(selected).reduce((accumulator, currentValue) => {
            if (currentValue.hasOwnProperty("hp")) {
              return accumulator + currentValue.hp;
            }
            return accumulator;
          }, 0);
          return target2.hp + total + base <= _status.event.cardx.number;
        }).set("prompt", `【散逸】:你可以额外指定任意名体力值之和不超过${trigger2.card.number - trigger2.targets[0].hp}的角色`).set("selectTarget", [0, Infinity]).set("complexTarget", true).set("ai", (target2) => {
          return get.effect(target2, _status.event.cardx, _status.event.player, _status.event.player) > 0;
        }).set("targets", trigger2.targets).set("targetx", trigger2.targets[0]).set("cardx", trigger2.card).forResult();
        if (!targets2) return false;
        for (var i2 of targets2) {
          trigger2.targets.push(i2);
          player2.line(i2);
        }
        player2.logSkill("sanyimrfz");
      }
    },
    baofengmrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        return event2.card && get.name(event2.card) == "sha" && get.color(event2.card) != "none";
      },
      forced: true,
      async content(event2, trigger2, player2) {
        const { bool } = await player2.chooseUseTarget(
          {
            name: "sha",
            suit: "none",
            number: trigger2.card.number,
            nature: trigger2.card.nature
          },
          false,
          false
        ).set("prompt", `【追矢】:你可以视为使用一张无色且点数为${trigger2.card.number}的${get.translation(trigger2.card.nature)}【杀】`).forResult();
        if (!bool) return;
      }
    },
    //ela 艾拉
    zuzhimrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        return event2.card && get.color(event2.card) != "none" && event2.player && event2.player.isIn() && (!event2.player.storage.zuzhimrfz || !event2.player.storage.zuzhimrfz.includes(get.color(event2.card)));
      },
      prompt(event2, player2) {
        return `【阻滞】:是否令${event2.player == player2 ? "你" : get.translation(event2.player)}本回合无法使用或打出${get.translation(get.color(event2.card))}的牌？`;
      },
      check(event2, player2) {
        return get.attitude(event2.player, player2) < 0;
      },
      content() {
        var target2 = trigger.player;
        if (!target2.storage.zuzhimrfz_ban) target2.storage.zuzhimrfz_ban = [];
        target2.storage.zuzhimrfz_ban.add(get.color(trigger.card));
        target2.addTempSkill("zuzhimrfz_ban", {
          global: "phaseEnd"
        });
      },
      subSkill: {
        ban: {
          charlotte: true,
          onremove: true,
          mark: true,
          intro: {
            content(event2, player2) {
              return `本回合不能使用或打出${get.translation(player2.storage.zuzhimrfz_ban)}的牌`;
            }
          },
          mod: {
            cardEnabled: function(card2, player2) {
              if (player2.getStorage("zuzhimrfz_ban").includes(get.color(card2))) return false;
            },
            cardRespondable: function(card2, player2) {
              if (player2.getStorage("zuzhimrfz_ban").includes(get.color(card2))) return false;
            },
            cardSavable: function(card2, player2) {
              if (player2.getStorage("zuzhimrfz_ban").includes(get.color(card2))) return false;
            }
          }
        }
      }
    },
    leimingmrfz: {
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      onremove: true,
      mark: true,
      intro: {
        content(event2, player2) {
          if (game.me == player2) {
            return `记录的内容：${get.translation(player2.storage.leimingmrfz)}`;
          } else return `有${player2.storage.leimingmrfz.length}个记录的内容`;
        }
      },
      audio: 2,
      trigger: { global: "roundStart" },
      direct: true,
      async content(event2, trigger2, player2) {
        player2.storage.leimingmrfz = [];
        var list1 = [], list2 = [], list3 = [], list4 = [];
        for (var i2 = 0; i2 < lib.inpile.length; i2++) {
          var type = get.type(lib.inpile[i2]);
          if (type == "basic") {
            list1.push(["基本", "", lib.inpile[i2]]);
          } else if (type == "trick") {
            list2.push(["锦囊", "", lib.inpile[i2]]);
          } else if (type == "delay") {
            list3.push(["锦囊", "", lib.inpile[i2]]);
          } else if (type == "equip") {
            list3.push(["装备", "", lib.inpile[i2]]);
          }
        }
        const { links } = await player2.chooseButton([get.prompt("leimingmrfz"), [list1.concat(list2).concat(list3).concat(list4), "vcard"]]).set("filterButton", function(button) {
          var player3 = _status.event.player;
          if (player3.storage.leimingmrfz.includes(button.link[2])) return false;
          return true;
        }).set("ai", function(button) {
          var rand = _status.event.rand;
          switch (button.link[2]) {
            case "sha":
              return 5 + rand[1];
            case "tao":
              return 4 + rand[2];
            case "lebu":
              return 3 + rand[3];
            case "shan":
              return 4.5 + rand[4];
            case "wuzhong":
              return 4 + rand[5];
            case "shunshou":
              return 3 + rand[6];
            case "nanman":
              return 2 + rand[7];
            case "wanjian":
              return 2 + rand[8];
            default:
              return rand[0];
          }
        }).set("rand", [
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random(),
          Math.random()
        ]).forResult();
        if (!links) return;
        player2.logSkill("leimingmrfz");
        player2.storage.leimingmrfz.add(links[0][2]);
        var { control } = await player2.chooseControl(lib.suit).set("prompt", "【雷鸣】:请选择一种花色").set("ai", () => lib.suit.randomGet()).forResult();
        if (!control) return;
        player2.storage.leimingmrfz.add(control);
        var { control } = await player2.chooseControl("basic", "trick", "equip").set("prompt", "【雷鸣】:请选择一种类型").set("ai", () => ["basic", "basic", "basic", "trick", "trick", "equip"].randomGet()).forResult();
        if (!control) return;
        player2.storage.leimingmrfz.add(control);
      },
      group: "leimingmrfz_eff",
      subSkill: {
        eff: {
          audio: "leimingmrfz",
          trigger: { global: "useCard" },
          onremove: true,
          filter(event2, player2) {
            var storage = player2.storage.leimingmrfz, card2 = event2.card;
            if (player2.storage.leimingmrfz_eff) return false;
            if (!storage || storage.length == 0) return false;
            if (player2 == event2.player) return false;
            return storage.includes(get.suit(card2, event2.player)) || storage.includes(get.name(card2, event2.player)) || storage.includes(get.type2(card2, event2.player));
          },
          prompt(event2, player2) {
            return `【雷鸣】:是否视为对${get.translation(event2.player)}使用一张任意颜色的雷【杀】？`;
          },
          check(event2, player2) {
            if (get.attitude(event2.player, player2) > 0) return false;
            return get.effect(event2.player, { name: "sha", nature: "thunder" }, player2, player2) > 0;
          },
          async content(event2, trigger2, player2) {
            player2.storage.leimingmrfz_eff = true;
            player2.when({
              player: "leimingmrfz_effAfter"
            }).then(() => {
              delete player2.storage.leimingmrfz_eff;
            });
            var target2 = trigger2.player;
            if (player2.canUse({ name: "sha", nature: "thunder" }, target2, false)) {
              var { control } = await player2.chooseControl("red", "black").set("prompt", `【雷鸣】:请选择使用雷【杀】的颜色`).set("ai", function() {
                var player3 = _status.event.player, target3 = _status.event.target;
                var red = get.effect(
                  target3,
                  {
                    name: "sha",
                    nature: "thunder",
                    color: "red"
                  },
                  player3,
                  player3
                ), black = get.effect(
                  target3,
                  {
                    name: "sha",
                    nature: "thunder",
                    color: "black"
                  },
                  player3,
                  player3
                );
                if (red > black) return 0;
                return 1;
              }).set("target", target2).forResult();
              if (!control) return;
              if (player2.canUse(
                {
                  name: "sha",
                  nature: "thunder",
                  color: control
                },
                target2,
                false
              )) {
                player2.useCard(
                  {
                    name: "sha",
                    nature: "thunder",
                    color: control
                  },
                  target2,
                  true
                );
              }
            }
            var list = [], storage = player2.storage.leimingmrfz, card2 = trigger2.card;
            if (storage.includes(get.name(card2, target2))) list.push(get.name(card2, target2));
            if (storage.includes(get.suit(card2, target2))) list.push(get.suit(card2, target2));
            if (storage.includes(get.type2(card2, target2))) list.push(get.type2(card2, target2));
            var { control } = list.length == 1 ? { control: list[0] } : await player2.chooseControl(list).set("prompt", `【雷鸣】:请选择清除一个记录`).set("list", list).set("ai", function() {
              var list2 = _status.event.list;
              return list2.randomGet();
            }).forResult();
            if (!control) return;
            player2.storage.leimingmrfz.remove(control);
          }
        }
      }
    },
    //阿斯卡纶
    dunyingmrfz: {
      mod: {
        globalTo(from, to, distance) {
          var cards2 = to.getCards("s", function(card2) {
            return card2.hasGaintag("dunyingmrfz");
          });
          if (cards2.length) return distance + 1;
        }
      },
      marktext: "影",
      intro: {
        mark: function(dialog, storage, player2) {
          var cards2 = player2.getCards("s", function(card2) {
            return card2.hasGaintag("dunyingmrfz");
          });
          if (game.me == player2) dialog.addAuto(cards2);
          else return `共有${cards2.length}张牌`;
        }
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("dunyingmrfz");
        });
        if (cards2.length) {
          player2.lose(cards2, ui.discardPile);
          player2.$throw(cards2, 1e3);
          game.log(cards2, "进入了弃牌堆");
        }
      },
      audio: 2,
      trigger: {
        player: "phaseJieshuBegin"
      },
      filter: function(event2, player2) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("dunyingmrfz");
        });
        if (player2.countCards("h", (card2) => {
          return !card2.hasGaintag("dunyingmrfz");
        }) < 1)
          return false;
        return cards2.length < player2.maxHp;
      },
      async content(event2, trigger2, player2) {
        var num = player2.getCards("s", function(card2) {
          return card2.hasGaintag("dunyingmrfz");
        }).length;
        const { cards: cards2 } = player2.countCards("h", (card2) => {
          return !card2.hasGaintag("dunyingmrfz");
        }) + num <= player2.maxHp ? { cards: player2.getCards("h") } : await player2.chooseCard("h", get.prompt("dunyingmrfz"), "将所有手牌置于武将牌上，称之为“影”", true).set("selectCard", () => {
          var player3 = _status.event.player;
          var num2 = player3.getCards("s", function(card2) {
            return card2.hasGaintag("dunyingmrfz");
          }).length;
          return player3.maxHp - num2;
        }).set("filterCard", (card2) => {
          return !card2.hasGaintag("dunyingmrfz");
        }).set("ai", function(card2) {
          var player3 = _status.event.player;
          if (player3.hasUseTarget(card2) && !player3.hasValueTarget(card2)) return 0;
          if (["sha", "shan", "wuxie", "caochuan"].includes(card2.name)) return 2 + Math.random();
          return 1 + Math.random();
        }).forResult();
        if (!cards2) return;
        game.log(player2, "将", cards2.length, "张牌置于在武将牌上");
        player2.loseToSpecial(cards2, "dunyingmrfz");
        player2.markSkill("dunyingmrfz");
      },
      group: ["dunyingmrfz_gain"],
      subSkill: {
        gain: {
          audio: "dunyingmrfz",
          trigger: { player: "useCard" },
          usable: 1,
          filter(event2, player2) {
            var cards2 = player2.getCards("s", function(card2) {
              return card2.hasGaintag("dunyingmrfz");
            });
            if (!event2.cards.length) return cards2.length < player2.maxHp;
            var position = event2.card.cards.map((i2) => i2.original);
            return position.every((item) => item != "h") && cards2.length < player2.maxHp;
          },
          prompt: "【遁影】:你可以将牌堆顶的一张牌置于你的武将牌上，称之为“影”",
          content() {
            var cards2 = get.cards();
            game.log(player, "将一张牌置于在武将牌上");
            player.loseToSpecial(cards2, "dunyingmrfz");
            player.markSkill("dunyingmrfz");
          }
        }
      }
    },
    niximrfz: {
      audio: 2,
      trigger: { global: "phaseJieshuBegin" },
      filter(event2, player2) {
        return event2.player.isIn() && event2.player != player2 && player2.canUse("sha", event2.player, false);
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseToUse(
          function(card2, player3, event3) {
            if (get.name(card2) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【匿袭】是否对" + get.translation(trigger2.player) + "使用一张杀？"
        ).set("logSkill", "niximrfz").set("complexSelect", true).set("filterTarget", function(card2, player3, target3) {
          if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return lib.filter.targetEnabled.apply(this, arguments);
        }).set("sourcex", trigger2.player).forResult();
        if (!cards2) return;
        var isDamaged = player2.hasHistory("useCard", (evt) => {
          return evt.getParent(2) == event2 && evt.card && evt.card.cardid && player2.hasHistory("sourceDamage", (evtx) => {
            return evtx.card && evt.card.cardid == evtx.card.cardid;
          });
        });
        if (!isDamaged && player2.isIn() && trigger2.player.isIn()) {
          var target2 = trigger2.player, targetx2 = trigger2.player, list = [];
          if (target2.getNext() == player2) return;
          const { bool } = await player2.chooseBool(`【匿袭】:是否将座位移到${get.translation(trigger2.player)}下家？`).forResult();
          if (!bool) return;
          while (targetx2.getNext() != player2) {
            targetx2 = targetx2.getNext();
            list.push(targetx2);
          }
          if (list.length == 0) return;
          list.reverse();
          for (var i2 of list) {
            await game.broadcastAll(
              function(target1, target22) {
                game.swapSeat(target1, target22);
              },
              i2,
              player2
            );
          }
        }
      }
    },
    // logos 逻格斯 李狗剩
    baidumrfz: {
      audio: 2,
      trigger: {
        global: "damageEnd"
      },
      usable: 1,
      filter(event2, player2) {
        if (!event2.card) return false;
        var num = get.cardNameLength(event2.card);
        if (typeof num !== "number" || num < 1) return false;
        return player2.countCards("he") > 0 && event2.player.isIn();
      },
      // direct: true,
      async cost(event2, trigger2, player2) {
        let sourceCards = trigger2.cards || void 0;
        const { result: result2 } = await player2.chooseToDiscard("he").set("prompt", get.prompt("baidumrfz")).set(
          "prompt2",
          `你可以弃置一张牌，${sourceCards === void 0 ? "(" + get.translation(trigger2.card) + "无对应的实体牌)" : "你获得" + get.translation(trigger2.card) + "(" + get.translation(sourceCards) + "),"}然后${get.translation(trigger2.player)}摸你弃置的牌与对其造成伤害的牌的字数之差的绝对值张牌。`
        ).set("ai", function(card2) {
          var player3 = _status.event.player, target2 = _status.event.targetx, cardx = trigger2.card, att = get.attitude(player3, target2);
          if (att > 0) {
            return Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card2)) - Math.floor(get.value(card2) / 10);
          } else {
            if (Math.abs(get.cardNameLength(cardx) - get.cardNameLength(card2)) > cardx.cards.length) return 0;
            return get.value(cardx.cards) - get.value(card2);
          }
        }).set("targetx", trigger2.player).set("cardx", trigger2.card);
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let sourceCards = trigger2.cards || void 0;
        let cards2 = event2.cards;
        var gaincard = [];
        for (var i2 of sourceCards) {
          if (get.position(i2, true) == "o") gaincard.push(i2);
        }
        if (gaincard.length > 0) player2.gain(gaincard, "gain2");
        var num = Math.abs(get.cardNameLength(trigger2.card) - get.cardNameLength(cards2[0]));
        if (num > 0) trigger2.player.draw(num);
        player2.line(trigger2.player);
      }
    },
    yuhuimrfz: {
      init(player2, skill) {
        player2.storage[skill] = {
          del: false,
          names: []
        };
      },
      mark: true,
      intro: {
        mark(dialog, content, player2) {
          var names = player2.storage.yuhuimrfz["names"];
          dialog.addText(`本回合【语汇】使用过的牌:<br>${get.translation(names)}`);
        }
      },
      audio: 2,
      enable: "chooseToUse",
      hiddenCard: function(player2, name) {
        return player2.countCards("hes") > 0 && !player2.storage.yuhuimrfz["names"].includes(name);
      },
      filter: function(event2, player2) {
        if (player2.countCards("hes") < 1) return false;
        for (var name of lib.inpile) {
          if (player2.storage.yuhuimrfz["names"].includes(name)) continue;
          if (event2.filterCard({ name, isCard: true }, player2, event2)) return true;
        }
        return false;
      },
      chooseButton: {
        dialog: function(event2, player2) {
          var list = [];
          for (var name of lib.inpile) {
            if (player2.storage.yuhuimrfz.names.includes(name)) {
              continue;
            }
            if (event2.filterCard({ name }, player2, event2)) {
              if (name == "sha") {
                list.push(["基本", "", "sha"]);
                for (var j of lib.inpile_nature) {
                  list.push(["基本", "", "sha", j]);
                }
              } else if (get.type(name) == "trick") {
                list.push(["锦囊", "", name]);
              } else if (get.type(name) == "basic") {
                list.push(["基本", "", name]);
              }
            }
          }
          return ui.create.dialog("语汇", [list, "vcard"]);
        },
        filter: function(button, player2) {
          var cards2 = player2.getCards("hes"), name = button.link[2], cardsx = [];
          for (var i2 of cards2) {
            if (get.cardNameLength(i2) >= get.cardNameLength(name)) cardsx.push(name);
          }
          return _status.event.getParent().filterCard({ name }, player2, _status.event.getParent()) && cardsx.includes(name);
        },
        check: function(button) {
          var player2 = _status.event.player;
          if (player2.countCards("hs", button.link[2]) > 0) return 0;
          if (button.link[2] == "wugu") return;
          var effect = player2.getUseValue(button.link[2]);
          if (effect > 0) return effect;
          return 0;
        },
        backup: function(links, player2) {
          return {
            filterCard(card2) {
              var needNumber = get.cardNameLength(links[0][2]);
              return get.cardNameLength(card2) >= needNumber;
            },
            audio: "yuhuimrfz",
            selectCard: 1,
            popname: true,
            check: function(card2) {
              return 6 - get.value(card2);
            },
            position: "hes",
            viewAs: { name: links[0][2], nature: links[0][3] },
            precontent() {
              if (!player2.storage.yuhuimrfz)
                player2.storage.yuhuimrfz = {
                  del: false,
                  names: []
                };
              player2.storage.yuhuimrfz["names"].add(lib.skill.yuhuimrfz_backup.viewAs.name);
              if (player2.storage.yuhuimrfz["del"] != true) {
                player2.storage.yuhuimrfz["del"] = true;
                player2.when({ global: "phaseEnd" }).then(() => {
                  player2.storage.yuhuimrfz = {
                    del: false,
                    names: []
                  };
                });
              }
            }
          };
        },
        prompt: function(links, player2) {
          return "将一张牌当做" + (get.translation(links[0][3]) || "") + get.translation(links[0][2]) + "使用";
        }
      },
      ai: {
        save: true,
        respondSha: true,
        respondShan: true,
        skillTagFilter: function(player2, tag, arg) {
          if (!player2.countCards("hes")) return false;
          if (tag == "respondSha" || tag == "respondShan") {
            if (arg == "respond") return false;
            return !player2.storage.yuhuimrfz["names"].includes(tag == "respondSha" ? "sha" : "shan");
          }
          return true;
        },
        order: 4,
        result: {
          player: 1
        },
        threaten: 2.8
      }
    },
    // 维什戴尔 异格w 益达
    yuximrfz: {
      mod: {
        globalTo(from, to, distance) {
          var cards2 = to.getCards("s", function(card2) {
            return card2.hasGaintag("yuximrfzx");
          });
          if (cards2.length) return distance + 2;
        }
      },
      marktext: "死魂灵",
      intro: {
        mark: function(dialog, storage, player2) {
          var cards2 = player2.getCards("s", function(card2) {
            return card2.hasGaintag("yuximrfzx");
          });
          if (cards2 && cards2.length > 0) dialog.addAuto("其他角色计算与你的距离+2");
          else return `没有‘死魂灵’`;
          if (game.me == player2) dialog.addAuto(cards2);
          else dialog.addAuto(`共有${cards2.length}张牌`);
        }
      },
      onremove: function(player2, skill) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("yuximrfzx");
        });
        if (cards2.length) {
          game.cardsGotoSpecial(cards2);
          player2.$throw(cards2, 1e3);
          game.log(cards2, "被销毁");
        }
      },
      audio: 2,
      forced: true,
      trigger: { global: "roundStart" },
      async content(event2, trigger2, player2) {
        lib.skill.yuximrfz.onremove(player2, "yuximrfz");
        var cards2 = [], nature = ["fire", "thunder"];
        for (var i2 = 0; i2 < player2.maxHp; i2++) {
          var name = lib.inpile.filter((name2) => {
            return get.type(name2) == "trick" || get.type(name2) == "basic";
          }).randomGet();
          cards2.push(
            game.createCard(
              name,
              lib.suit.randomGet(),
              Math.floor(Math.random() * 13) + 1,
              name == "sha" ? nature.randomGet() : void 0
            )
          );
        }
        cards2.map((card2) => {
          card2.storage.yuximrfzx = true;
        });
        game.log(player2, "将", cards2.length, "张牌置于在武将牌上");
        player2.loseToSpecial(cards2, "yuximrfzx");
        player2.markSkill("yuximrfz");
      },
      group: ["yuximrfz_destroy"],
      subSkill: {
        destroy: {
          trigger: {
            player: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd"]
          },
          direct: true,
          charlotte: true,
          filter: function(event2, player2) {
            var evt = event2.getl(player2);
            if (!evt || !evt.cards) return false;
            for (var i2 of evt.cards) {
              if (i2.storage.yuximrfzx == true) return true;
            }
            return false;
          },
          content: function() {
            var cards2 = [];
            var evt = trigger.getl(player);
            if (evt && evt.cards) {
              for (var i2 of evt.cards) {
                if (i2.storage.yuximrfzx == true) cards2.push(i2);
              }
            }
            game.cardsGotoSpecial(cards2);
            game.log(cards2, "被销毁了");
            if (Math.random() > 0.5) player.logSkill("yuximrfz");
          }
        }
      }
    },
    haolimrfz: {
      audio: 2,
      trigger: { player: "useCardAfter" },
      compare(card1, card2) {
        if (get.suit(card1) == get.suit(card2)) return true;
        if (get.number(card1) == get.number(card2)) return true;
        if (get.name(card1) == get.name(card2)) return true;
        return false;
      },
      direct: true,
      filter(event2, player2) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("yuximrfzx");
        });
        if (cards2.length < 1) return false;
        if (!player2.isPhaseUsing()) return false;
        if (event2.card.storage.yuximrfzx == true) return false;
        if (get.type(event2.card) == "equip" || get.type(event2.card) == "delay") return false;
        for (var i2 of cards2) {
          if (lib.skill.haolimrfz.compare(i2, event2.card)) return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        const { cards: cards2 } = await player2.chooseCard("s").set("filterCard", (card2) => lib.skill.haolimrfz.compare(card2, trigger2.card)).set("prompt", `【好礼】:你可以弃置一张‘死魂灵’，视为使用一张${get.translation(get.name(trigger2.card))}`).set("ai", (card2) => get.value(trigger2.card) - get.value(card2)).forResult();
        if (!cards2) return;
        player2.discard(cards2);
        player2.chooseUseTarget({ name: get.name(trigger2.card), isCard: true }, true, false);
      }
    },
    shezumrfz: {
      audio: 2,
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        var cards2 = player2.getCards("s", function(card2) {
          return card2.hasGaintag("yuximrfzx");
        });
        return event2.getParent().name != "shezumrfz" && event2.player.isIn() && cards2 && cards2.length > 0 && game.hasPlayer((current) => {
          return current != player2 && current != event2.player && get.distance(event2.player, current) <= 3;
        });
      },
      direct: true,
      async content(event2, trigger2, player2) {
        const {
          result: { cards: cards2, targets: targets2 }
        } = await player2.chooseCardTarget({
          prompt: `【射祖】:你可以弃置一张‘死魂灵’并对一名距离${get.translation(trigger2.player)}不大于3的角色（不能是你或${get.translation(trigger2.player)}）造成一点火焰伤害`,
          filterCard(card2) {
            return card2.hasGaintag("yuximrfzx");
          },
          position: "s",
          filterTarget(card2, player3, target2) {
            var damaged = _status.event.targetx;
            return target2 != player3 && target2 != damaged && get.distance(damaged, target2) <= 3;
          },
          ai1: (card2) => 8 - get.value(card2),
          ai2: (target2) => get.damageEffect(target2, player2, player2, "fire") > 0
        }).set("targetx", trigger2.player);
        if (!cards2 || !targets2) return;
        player2.logSkill("shezumrfz", targets2[0]);
        player2.discard(cards2);
        targets2[0].damage(player2, "fire");
      }
    },
    // 魔王 小特同学 特蕾西娅
    duanzhangmrfz: {
      intro: {
        mark: function(dialog, storage, player2) {
          var players = player2.storage.duanzhangmrfz.slice().filter((target2) => target2 != player2);
          if (players && players.length > 0) {
            dialog.addAuto("这一次我不会离开了...");
            players = players.map((i2) => i2.name);
            dialog.addSmall([players, "character"]);
          } else return "没有【断章】角色";
        }
      },
      audio: 2,
      trigger: {
        global: "phaseBefore",
        player: "enterGame"
      },
      forced: true,
      onremove: true,
      filter: function(event2, player2) {
        return game.hasPlayer((current) => current != player2) && (event2.name != "phase" || game.phaseNumber == 0);
      },
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget(true).set("prompt", `【断章】:请选择【断章】目标`).set("filterTarget", lib.filter.notMe).set("ai", (target3) => {
          var att = get.attitude(_status.event.player, target3);
          if (att > 0) return att + 1;
          if (att == 0) return Math.random();
          return att;
        }).forResult();
        if (!targets2) return;
        var target2 = targets2[0];
        if (!player2.storage.duanzhangmrfz) player2.storage.duanzhangmrfz = [];
        if (!target2.storage.duanzhangmrfz) target2.storage.duanzhangmrfz = [];
        player2.storage.duanzhangmrfz.addArray([target2, player2]);
        target2.storage.duanzhangmrfz.addArray([target2, player2]);
        player2.markSkill("duanzhangmrfz");
        player2.line(target2);
        for (var i2 of player2.storage.duanzhangmrfz) {
          if (i2 != player2) i2.addSkill("canxiangmrfz_nodelay");
          i2.addSkill("duanzhangmrfz_eff1");
        }
      },
      group: ["duanzhangmrfz_clear"],
      subSkill: {
        clear: {
          silent: true,
          charlotte: true,
          trigger: { global: "dieAfter" },
          forceDie: true,
          filter(event2, player2) {
            return event2.player.hasSkill("duanzhangmrfz_eff1");
          },
          content() {
            for (var i2 of game.players) {
              if (!i2.storage.duanzhangmrfz) continue;
              if (i2.storage.duanzhangmrfz.includes(trigger.player)) i2.storage.duanzhangmrfz.remove(trigger.player);
            }
          }
        },
        eff1: {
          silent: true,
          charlotte: true,
          trigger: {
            global: ["loseEnd", "equipEnd", "addJudgeEnd", "gainEnd", "loseAsyncEnd", "addToExpansionEnd", "duanzhangmrfzAfter"]
          },
          filter(event2, player2) {
            return (player2.storage.duanzhangmrfz && player2.storage.duanzhangmrfz.length > 1) ^ player2.hasSkill("duanzhangmrfz_group");
          },
          async content(event2, trigger2, player2) {
            if (player2.storage.duanzhangmrfz && player2.storage.duanzhangmrfz.length > 1) {
              var cards2 = [], target2 = game.findPlayer((current) => {
                return player2.storage.duanzhangmrfz.includes(current);
              });
              for (var i2 of target2.storage.duanzhangmrfz) {
                if (i2.countCards("h") == 0) continue;
                if (i2 == player2) continue;
                for (var j of i2.getCards("h")) cards2.push(j);
              }
              var cardsx = cards2.map((card2) => {
                var cardx = ui.create.card();
                cardx.init(get.cardInfo(card2));
                cardx._cardid = card2.cardid;
                return cardx;
              });
              if (cardsx.length < 1) return;
              player2.directgains(cardsx, null, "duanzhangmrfz");
              player2.addSkill("duanzhangmrfz_group");
            } else player2.removeSkill("duanzhangmrfz_group");
          }
        },
        group: {
          charlotte: true,
          group: ["duanzhangmrfz_eff_use", "duanzhangmrfz_eff_lose"],
          trigger: {
            global: ["addJudgeAfter", "gainAfter", "loseAfter", "loseAsyncAfter", "cardsDiscardAfter", "equipAfter"]
          },
          forced: true,
          silent: true,
          filter: function(event2, player2) {
            if (event2.name == "gain") return event2.cards.length;
            var cards2 = event2.getd();
            return cards2.length;
          },
          onremove: function(player2) {
            var cards2 = player2.getCards("s", (card2) => {
              return card2.hasGaintag("duanzhangmrfz");
            });
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
          content: function() {
            var cards2 = [];
            var idList = player.getCards("s", (card2) => card2.hasGaintag("duanzhangmrfz")).map((i3) => i3._cardid);
            var target2 = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            for (var i2 of target2.storage.duanzhangmrfz) {
              if (i2.countCards("h") == 0) continue;
              if (i2 == player) continue;
              for (var j of i2.getCards("h")) {
                if (idList.includes(j.cardid)) continue;
                cards2.push(j);
              }
            }
            var cards22 = cards2.map((card2) => {
              var cardx = ui.create.card();
              cardx.init(get.cardInfo(card2));
              cardx._cardid = card2.cardid;
              return cardx;
            });
            player.directgains(cards22, null, "duanzhangmrfz");
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
            var cards2 = player2.getCards("s", (card2) => card2.hasGaintag("duanzhangmrfz") && card2._cardid);
            return event2.cards && event2.cards.some((card2) => {
              return cards2.includes(card2);
            });
          },
          content: function() {
            var idList = player.getCards("s", (card3) => card3.hasGaintag("duanzhangmrfz")).map((i3) => i3._cardid);
            var cards2 = [];
            var target2 = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            for (var i2 of target2.storage.duanzhangmrfz) {
              if (i2.countCards("h") == 0) continue;
              if (i2 == player) continue;
              for (var j of i2.getCards("h")) {
                if (!idList.includes(j.cardid)) continue;
                cards2.push(j);
              }
            }
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
                  cards4.forEach((i3) => i3.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards3,
                player
              );
            }
            cards3.forEach((i3) => i3.delete());
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
            var idList = player2.getCards("s", (card2) => card2.hasGaintag("duanzhangmrfz")).map((i2) => i2._cardid);
            return event2.cards && event2.cards.some((card2) => {
              return idList.includes(card2.cardid);
            });
          },
          content: function() {
            var cards2;
            var idList = [];
            var target2 = game.findPlayer((current) => {
              return player.storage.duanzhangmrfz.includes(current);
            });
            for (var i2 of target2.storage.duanzhangmrfz) {
              if (i2.countCards("h") == 0) continue;
              if (i2 == player) continue;
              for (var j of i2.getCards("h")) {
                idList.add(j.cardid);
              }
            }
            cards2 = player.getCards("s", (card2) => {
              return card2.hasGaintag("duanzhangmrfz") && !idList.includes(card2._cardid);
            });
            if (player.isOnline2()) {
              player.send(
                function(cards3, player2) {
                  cards3.forEach((i3) => i3.delete());
                  if (player2 == game.me) ui.updatehl();
                },
                cards2,
                player
              );
            }
            cards2.forEach((i3) => i3.delete());
            if (player == game.me) ui.updatehl();
          }
        }
      }
    },
    chenaimrfz: {
      audio: 2,
      trigger: {
        player: ["useCardAfter", "respondAfter"]
      },
      direct: true,
      filter: function(event2, player2) {
        if (_status.currentPhase != player2) return false;
        if (player2.getHistory("custom", function(evt) {
          return evt.chenaimrfz_type == get.type2(event2.card);
        }).length > 0)
          return false;
        return event2.cards.filterInD().length > 0;
      },
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = await player2.chooseTarget(
          get.prompt("chenaimrfz"),
          "将" + get.translation(trigger2.cards) + "交给一名其他角色",
          function(card2, player3, target2) {
            return target2 != player3;
          }
        ).set("ai", function(target2) {
          if (target2.hasJudge("lebu")) return 0;
          let att = get.attitude(_status.event.player, target2), name = _status.event.cards[0].name;
          if (att < 3) return 0;
          if (_status.event.player.storage.duanzhangmrfz && _status.event.player.storage.duanzhangmrfz.includes(target2) && att > 0)
            att += 10;
          if (target2.hasSkillTag("nogain")) att /= 10;
          if (name === "sha" && target2.hasSha()) att /= 5;
          if (name === "wuxie" && target2.needsToDiscard(_status.event.cards)) att /= 5;
          return att / (1 + get.distance(player2, target2, "absolute"));
        }).set("cards", trigger2.cards).forResult();
        if (!targets2) return;
        player2.logSkill("chenaimrfz", targets2[0]);
        targets2[0].gain(trigger2.cards.filterInD(), "gain2");
        player2.getHistory("custom").push({ chenaimrfz_type: get.type2(trigger2.card) });
        if (player2.storage.duanzhangmrfz && player2.storage.duanzhangmrfz.includes(targets2[0])) targets2[0].draw();
      }
    },
    /** @type { Skill } */
    canxiangmrfz: {
      mod: {
        targetEnabled: function(card2, player2, target2) {
          if (get.type(card2) == "delay") {
            return false;
          }
        }
      },
      audio: 2,
      forced: true,
      trigger: { global: "damageBegin4" },
      filter(event2, player2) {
        var storage = player2.storage.duanzhangmrfz;
        if (event2.player != player2 && (!storage || !storage.includes(event2.player))) return false;
        return event2.hasNature();
      },
      async content(event2, trigger2, player2) {
        trigger2.cancel();
      },
      group: "canxiangmrfz_die",
      subSkill: {
        die: {
          silent: true,
          charlotte: true,
          trigger: { player: "dieAfter" },
          firstDo: true,
          forceDie: true,
          content() {
            var storage = player.storage.duanzhangmrfz;
            for (var i2 of storage) {
              if (!i2.storage.duanzhangmrfz) continue;
              if (i2.storage.duanzhangmrfz.length <= 2) i2.removeSkill("canxiangmrfz_nodelay");
              else i2.storage.duanzhangmrfz.remove(player);
            }
          }
        },
        nodelay: {
          mark: true,
          intro: {
            content: "属性伤害无效；无法成为延时锦囊牌的目标"
          },
          mod: {
            targetEnabled: function(card2, player2, target2) {
              if (get.type(card2) == "delay") {
                return false;
              }
            }
          },
          ai: {
            nofire: true,
            nothunder: true,
            effect: {
              target(card2, player2, target2, current) {
                if (get.tag(card2, "natureDamage")) {
                  return "zeroplayertarget";
                }
                if (get.type(card2) == "trick" && get.tag(card2, "damage")) {
                  return "zeroplayertarget";
                }
              }
            }
          }
        }
      },
      ai: {
        nofire: true,
        nothunder: true,
        effect: {
          target(card2, player2, target2, current) {
            if (get.tag(card2, "natureDamage")) {
              return "zeroplayertarget";
            }
            if (get.type(card2) == "trick" && get.tag(card2, "damage")) {
              return "zeroplayertarget";
            }
          }
        }
      }
    },
    // 新多萝西
    newgongzhenmrfz: {
      mod: {
        aiOrder: function(player2, card2, num) {
          if (typeof card2 == "object" && player2.isPhaseUsing()) {
            var history = player2.getAllHistory("useCard");
            if (history.length < 1) return num;
            var cardx = history[history.length - 1].card;
            if (cardx && get.type2(cardx) == get.type2(card2)) {
              return num + 10;
            }
          }
        }
      },
      audio: "gongzhenmrfz",
      trigger: { player: ["useCardEnd", "respondEnd"] },
      forced: true,
      filter(event2, player2) {
        return player2.getAllHistory(event2.name).length > 1;
      },
      async content(event2, trigger2, player2) {
        var history = player2.getAllHistory(trigger2.name);
        var cardx = history[history.length - 2].card;
        if (!cardx) return;
        if (get.type2(cardx) == get.type2(trigger2.card)) {
          var cards2 = get.cards(2);
          game.cardsGotoOrdering(cards2);
          const { links } = await player2.chooseCardButton(`【共振】:请选择获得一张牌`, true, cards2).set("ai", (button) => {
            return get.value(button);
          }).forResult();
          if (!links) return;
          player2.gain(links, "gain2");
        } else
          player2.chooseToDiscard(true, `【共振】:请弃置区域内的一张牌`, "hej").set("ai", (card2) => {
            if (get.position(card2) == "j") return 10;
            return -get.value(card2);
          });
      }
    },
    newmengxiangmrfz: {
      getLastDiscard(event2, player2) {
        var history = player2.getAllHistory("lose", (evt) => evt.type && evt.type == "discard");
        if (history.length < 1) return false;
        var cards2 = history[history.length - 1].cards;
        if (!cards2) return false;
        return cards2[cards2.length - 1];
      },
      mod: {
        cardUsable: function(card2, player2) {
          var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player2);
          if (cardx && get.type2(cardx) == get.type2(card2)) return Infinity;
        },
        targetInRange: function(card2, player2) {
          var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player2);
          if (cardx && get.type2(cardx) == get.type2(card2)) return true;
        }
      },
      audio: "mengxiangmrfz",
      forced: true,
      trigger: { player: "useCardBefore" },
      filter(event2, player2) {
        var cardx = lib.skill.newmengxiangmrfz.getLastDiscard(_status.event, player2);
        if (!cardx) return false;
        return !event2.audioed && get.type2(cardx) == get.type2(event2.card);
      },
      content() {
        trigger.audioed = true;
      }
    },
    // 新黑键
    newhuangxiangmrfz: {
      audio: "huangxiangmrfz",
      trigger: {
        player: "phaseDrawAfter"
      },
      filter(event2, player2) {
        return player2.countCards("h") > 0;
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseCard([1, 2], "【荒响】:你可以选择两张手牌将其标记为‘残影’").set("ai", (card2) => {
          var num = get.value(card2);
          if (get.name(card2) == "shan" || get.name(card2) == "wuxie") num += 10;
          if (get.type2(card2) == "equip") num -= 2;
          return num;
        });
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        var cards2 = event2.cards;
        await player2.removeGaintag("newhuangxiangmrfzx");
        for (var i2 of cards2) i2.addGaintag("newhuangxiangmrfzx");
      },
      group: "newhuangxiangmrfz_lose",
      subSkill: {
        lose: {
          audio: "huangxiangmrfz",
          trigger: {
            player: "loseAfter",
            global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
          },
          filter(event2, player2) {
            if (_status.currentPhase == player2) return false;
            var evt = event2.getl(player2);
            if (!evt || !evt.hs || !evt.hs.length) return false;
            if (event2.name == "lose") {
              for (var i2 in event2.gaintag_map) {
                if (event2.gaintag_map[i2].includes("newhuangxiangmrfzx")) return true;
              }
              return false;
            }
            return player2.hasHistory("lose", function(evt2) {
              if (event2 != evt2.getParent()) return false;
              for (var i3 in evt2.gaintag_map) {
                if (evt2.gaintag_map[i3].includes("newhuangxiangmrfzx")) return true;
              }
              return false;
            });
          },
          async cost(event2, trigger2, player2) {
            var list = ["选项一", "选项二", "cancel2"], choicelist = ["令一名你攻击范围内的角色选择弃置一张黑桃牌或受到一点伤害", "你摸一张牌且将此牌标记为‘残影’"];
            if (!game.hasPlayer((current) => current != player2 && player2.inRange(current))) {
              list.remove("选项一");
              choicelist[0] = '<span style="opacity:0.5; ">' + choicelist[0] + "(没有满足条件的角色)</span>";
            }
            const { control } = await player2.chooseControl(list).set("choiceList", choicelist).set("prompt", "【荒响】:你可以选择一项").set("ai", () => {
              var player3 = _status.event.player;
              if (!game.hasPlayer((current) => current != player3 && player3.inRange(current) && get.attitude(player3, current) < 0))
                return 1;
              return [0, 1];
            }).forResult();
            var result2 = {};
            result2.bool = true;
            result2.cost_data = control;
            if (control == "cancel2") result2.bool = false;
            event2.result = result2;
          },
          async content(event2, trigger2, player2) {
            var control = event2.cost_data;
            if (control == "选项一") {
              const { targets: targets2 } = await player2.chooseTarget().set("forced", true).set("prompt", "【荒响】:请选择一名攻击范围内的角色").set("filterTarget", (card2, player3, target2) => {
                return player3 != target2 && player3.inRange(target2);
              }).forResult();
              const { bool } = await targets2[0].chooseToDiscard("【荒响】:请弃置一张黑桃牌，否则受到一点伤害", "he").set("ai", (card2) => {
                var player3 = _status.event.player;
                if (player3.hp < 2 && player3.countCards("hes", (card3) => {
                  return get.name(card3) == "tao" || get.name(card3) == "jiu";
                }))
                  return 12 - get.value(card2);
                return 7 - get.value(card2);
              }).set("filterCard", (card2) => get.suit(card2) == "spade").forResult();
              if (bool) return;
              targets2[0].damage();
            } else {
              const { result: result2 } = await player2.draw();
              result2[0].addGaintag("newhuangxiangmrfzx");
            }
          }
        }
      }
    },
    newjiyinmrfz: {
      audio: "jiyinmrfz",
      forced: true,
      trigger: {
        player: "useCard2"
      },
      getMeetCondition(event2, player2, target2) {
        let num = 0;
        if (target2.isMaxHandcard()) num++;
        if (target2.isMaxHp()) num++;
        if (target2.isMaxEquip()) num++;
        return num;
      },
      filter(event2, player2) {
        if (event2.card.name != "sha") return false;
        for (var target2 of event2.targets) {
          let num = lib.skill.newjiyinmrfz.getMeetCondition(event2, player2, target2);
          if (typeof num === "number") return true;
        }
        return false;
      },
      async content(event2, trigger2, player2) {
        let targets2 = trigger2.targets;
        for (var target2 of targets2) {
          let num = lib.skill.newjiyinmrfz.getMeetCondition(event2, player2, target2);
          if (typeof num !== "number") continue;
          player2.line(target2);
          if (!target2.storage.newjiyinmrfz_tmp) target2.storage.newjiyinmrfz_tmp = [];
          target2.storage.newjiyinmrfz_tmp.push(trigger2.card);
          target2.when({
            player: "damageBegin3",
            global: "useCardAfter"
          }).filter((event3, player3) => {
            if (event3.name == "useCard" && player3.storage.newjiyinmrfz_tmp.filter((card2) => card2 == event3.card).length > 0) return true;
            if (!player3.storage.newjiyinmrfz_tmp) return false;
            return event3.card && event3.card.name == "sha" && player3.storage.newjiyinmrfz_tmp.filter((card2) => card2 == event3.card).length > 0;
          }).then(() => {
            if (trigger2.name == "damage") {
              trigger2.num += number;
            }
            player2.storage.newjiyinmrfz_tmp.remove(trigger2.card);
          }).vars({ number: num });
        }
      },
      group: "newjiyinmrfz_sha",
      subSkill: {
        sha: {
          trigger: {
            player: "useCardToPlayered"
          },
          silent: true,
          filter: function(event2, player2) {
            if (event2.card.name != "sha" || event2.getParent().directHit.includes(event2.target)) return false;
            return lib.skill.newjiyinmrfz.getMeetCondition(event2, player2, event2.target) > 0;
          },
          logTarget: "target",
          content: function() {
            var id = trigger.target.playerid;
            var map = trigger.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
              map[id].shanRequired++;
            } else {
              map[id].shanRequired = 1 + lib.skill.newjiyinmrfz.getMeetCondition(event, player, trigger.target);
            }
          }
        }
      },
      ai: {
        directHit_ai: true,
        skillTagFilter(player2, tag, arg) {
          let num = lib.skill.newjiyinmrfz.getMeetCondition(_status.event, player2, arg.target);
          if (arg.card.name != "sha" || arg.target.countCards("h", "shan") > num) return false;
        }
      }
    },
    // 乌尔比安
    piweimrfz: {
      audio: 2,
      trigger: {
        player: "turnOverAfter"
      },
      filter(event2, player2) {
        return player2.countCards("h") > 0 && player2.hasUseTarget("chuqibuyi");
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseControl("club", "spade", "diamond", "heart", "cancel2").set(
          "prompt",
          "你可以将一种颜色的所有手牌当做任意花色且伤害基数为2的【出其不意】使用，若此牌造成伤害，受到伤害的角色依次弃置装备区和手牌区的一张牌。"
        ).set("ai", () => {
          var player3 = get.event().player;
          if (!game.hasPlayer((current) => {
            return current != player3 && player3.canUse("chuqibuyi", current) && get.attitude(current, player3) < 0;
          }))
            return "cancel2";
          return lib.suit.randomGet();
        });
        event2.result = {};
        if (result2.control === "cancel2") event2.result.bool = false;
        else event2.result.bool = true;
        event2.result.cost_data = result2;
      },
      async content(event2, trigger2, player2) {
        let suit = event2.cost_data.control;
        let color = new Set(player2.getCards("h").map((i2) => get.color(i2)));
        const { control } = color.size === 1 ? { control: player2.getCards("h") } : await player2.chooseControl("red", "black").set("prompt", "请选择一种颜色").set("ai", () => {
          var player3 = get.event().player, red = 0, black = 0;
          for (var i2 of player3.getCards("h", {
            color: "red"
          })) {
            red += get.value(i2);
          }
          for (var i2 of player3.getCards("h", {
            color: "black"
          })) {
            black += get.value(i2);
          }
          return red > black ? "black" : "red";
        }).forResult();
        player2.chooseUseTarget(
          {
            name: "chuqibuyi",
            suit,
            piweimrfz_chuqi: true
          },
          typeof control === "string" ? player2.getCards("h", { color: control }) : control
        );
      },
      group: ["piweimrfz_damage", "piweimrfz_discard"],
      subSkill: {
        discard: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { source: "damageEnd" },
          filter(event2, player2) {
            return event2.player && event2.player.isIn() && event2.card && event2.card.piweimrfz_chuqi == true;
          },
          async content(event2, trigger2, player2) {
            let target2 = trigger2.player;
            target2.chooseToDiscard(true).set("position", "he").set("prompt", `【辟纬】:请选择弃置手牌区和装备区的各一张牌`).set("ai", (card2) => {
              get.event().player;
              return 7 - get.value(card2);
            }).set("filterCard", (card2) => {
              get.event().player;
              var cards2 = ui.selected.cards;
              if (cards2.length == 0) return true;
              for (var i2 of cards2) {
                if (get.position(i2) == get.position(card2)) return false;
              }
              return true;
            }).set("selectCard", () => {
              var player3 = get.event().player, pos = [];
              for (var i2 of player3.getCards("he")) {
                if (get.position(i2) == "h") pos.add("h");
                else pos.add("e");
              }
              return [pos.length, pos.length];
            });
          }
        },
        damage: {
          silent: true,
          charlotte: true,
          firstDo: true,
          trigger: { player: "useCard" },
          filter(event2, player2) {
            return event2.card && event2.card.piweimrfz_chuqi == true;
          },
          content() {
            trigger.baseDamage = 2;
          }
        }
      },
      ai: {
        threaten: 1.2
      }
    },
    guqianmrfz: {
      audio: 2,
      trigger: {
        global: ["loseAfter", "loseAsyncAfter"]
      },
      usable: 1,
      filter(event2, player2) {
        if (event2.type != "discard" || event2.position != ui.discardPile || event2.player == player2) return false;
        var cards2 = event2.getd();
        if (!cards2.filter((card2) => get.position(card2, true) == "d").length) return false;
        return true;
      },
      prompt2(event2, player2) {
        return `你可以摸一张牌，然后若你手牌中没有相同花色的牌，你重置此技能，反之，你将武将牌翻面。`;
      },
      async content(event2, trigger2, player2) {
        await player2.draw();
        let suitCards = player2.getCards("h").map((card2) => get.suit(card2));
        let suitList = new Set(suitCards);
        if (suitCards.length != suitList.size) {
          player2.turnOver();
          return;
        }
        delete player2.getStat("skill")["guqianmrfz"];
        if (player2.storage.counttrigger && player2.storage.counttrigger["guqianmrfz"]) delete player2.storage.counttrigger["guqianmrfz"];
        game.log(player2, "重置了技能", `#g【孤潜】`);
      }
    },
    tongmaimrfz: {
      audio: 2,
      audioname: ["wuerbianmrfz", "spyoulingshamrfz", "sikadimrfz", "geleidiyamrfz", "anzhelamrfz"],
      init(player2, skill) {
        player2.storage[skill] = [];
      },
      trigger: { source: "damageEnd" },
      filter(event2, player2) {
        if (Array.isArray(player2.storage.tongmaimrfz) && player2.storage.tongmaimrfz.length > 1) return false;
        return _status.currentPhase != player2 && game.hasPlayer((current) => {
          return current.hasClan("深海猎人");
        });
      },
      async cost(event2, trigger2, player2) {
        let prompt2 = `你可以令一名深海猎人的角色回复一点体力或复原武将牌`, storage = player2.storage.tongmaimrfz;
        if (storage.includes(0)) prompt2 = prompt2.replace("回复一点体力或", "");
        if (storage.includes(1)) prompt2 = prompt2.replace("或复原武将牌", "");
        const { result: result2 } = await player2.chooseTarget().set("prompt", get.prompt("tongmaimrfz")).set("prompt2", prompt2).set("filterTarget", (card2, player3, target2) => {
          var storage2 = _status.event.storage;
          if (!target2.hasClan("深海猎人") && target2 != player3) return false;
          if (storage2.includes(1)) return target2.getDamagedHp() > 0;
          return true;
        }).set("ai", (target2) => {
          var player3 = get.event().player;
          return get.attitude(target2, player3) > 0 && (target2.getDamagedHp() > 0 || target2.isTurnedOver() || target2.isLinked());
        }).set("storage", storage);
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.targets[0];
        if (!Array.isArray(player2.storage.tongmaimrfz)) player2.storage.tongmaimrfz = [];
        if (player2.storage.tongmaimrfz.includes(0)) {
          target2.link(false);
          target2.turnOver(false);
          player2.storage.tongmaimrfz.add(1);
          return;
        }
        if (player2.storage.tongmaimrfz.includes(1)) {
          target2.recover();
          player2.storage.tongmaimrfz.add(0);
          return;
        }
        if (target2.getDamagedHp() == 0) {
          target2.link(false);
          target2.turnOver(false);
          player2.storage.tongmaimrfz.add(1);
          return;
        }
        const { index } = await player2.chooseControl().set("choiceList", [`令${get.translation(target2)}回复一点体力`, `令${get.translation(target2)}复原武将牌`]).set("prompt", "请选择一项").set("ai", () => {
          var target3 = _status.event.targetx;
          get.event().player;
          if (target3.isTurnedOver()) return 1;
          return 0;
        }).set("targetx", target2).forResult();
        if (index === 0) target2.recover();
        if (index === 1) {
          target2.link(false);
          target2.turnOver(false);
        }
        player2.storage.tongmaimrfz.add(index);
      },
      group: "tongmaimrfz_clear",
      subSkill: {
        clear: {
          charlotte: true,
          silent: true,
          lastDo: true,
          trigger: { global: "roundStart" },
          content() {
            player.storage.tongmaimrfz = [];
          }
        }
      }
    },
    // 新 斯卡蒂
    jingliemrfz: {
      audio: 2,
      trigger: {
        player: "phaseZhunbeiBegin"
      },
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && current.countCards("h") > 0;
        });
      },
      async cost(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseTarget().set("prompt", get.prompt("shulangmrfz")).set(
          "prompt2",
          `你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
        ).set("filterTarget", (card2, player3, target2) => player3 != target2 && target2.countCards("h") > 0).set("ai", (target2) => {
          var player3 = get.event().player;
          var att = get.attitude(player3, target2), num = 0;
          if (att >= 0) num += 2;
          else num += 5 + target2.getDamagedHp();
          return num += target2.countCards("h") / 2;
        });
        event2.result = result2;
      },
      async content(event2, trigger2, player2) {
        let target2 = event2.targets[0];
        if (target2.countCards("h") == 1) player2.viewHandcards(target2);
        const { links } = await player2.choosePlayerCard(target2, true, "visible").set("prompt", "【鲸猎】:请选择一张牌").set("position", "h").set("ai", (button) => {
          var player3 = get.event().player, num = get.value(button);
          if (player3.hasUseTarget(button, false)) num += 10;
          if (get.tag(button, "damage")) num += 2;
          if (get.type2(button) == "equip") num -= 10;
          return num;
        }).forResult();
        if (!links) return;
        let choiceList = [
          `失去一点体力，令${get.translation(player2)}获得${get.translation(links[0])}`,
          `令${get.translation(player2)}视为使用${get.translation(links[0])}，若此牌不能被${get.translation(player2)}使用，则改为摸一张牌，然后本回合结束阶段时${get.translation(player2)}发动一次【鲸猎】`,
          `对${get.translation(player2)}使用一张【杀】，若此杀造成伤害，${get.translation(player2)}翻面，反之执行其他两项`
        ], list = ["选项一", "选项二"];
        if (target2.hasSha() && target2.canUse({ name: "sha" }, player2, false)) list.push("选项三");
        else choiceList[2] = '<span style="opacity:0.5">' + choiceList[2] + "（没有或无法使用【杀】）</span>";
        const { index } = await target2.chooseControl(list).set("choiceList", choiceList).set("ai", () => {
          var player3 = get.event().player, target3 = _status.event.targetx, list2 = _status.event.list, card2 = _status.event.cardx;
          if (get.attitude(player3, target3) > 0) return 1;
          else {
            if (!target3.hasUseTarget(card2, false)) return 1;
            if (list2.length > 2 && target3.mayHaveShan(
              player3,
              "use",
              target3.getCards("h", (i3) => {
                return i3.hasGaintag("sha_notshan");
              })
            ) && Math.random() > 0.5) {
              for (var i2 of player3.getCards("h", "sha")) {
                if (get.effect(target3, i2, player3, player3) > 0) return 2;
              }
            }
            if (player3.hp == 1) return 1;
            return 0;
          }
        }).set("targetx", player2).set("list", list).set("cardx", links[0]).forResult();
        if (typeof index !== "number") return;
        var next = game.createEvent("jingliemrfz_after");
        next.player = player2;
        next.target_jingliemrfz = target2;
        next.card_jingliemrfz = links[0];
        next.setContent(lib.skill.jingliemrfz["index_" + index]);
      },
      async index_0(event2, trigger2, player2) {
        let target2 = event2.target_jingliemrfz, card2 = event2.card_jingliemrfz;
        await player2.gain(card2, "gain2");
        target2.loseHp();
      },
      async index_1(event2, trigger2, player2) {
        event2.target_jingliemrfz;
        let card2 = event2.card_jingliemrfz;
        if (player2.hasUseTarget(card2, false))
          player2.chooseUseTarget(
            {
              name: card2.name,
              suit: card2.suit,
              number: card2.number
            },
            false
          );
        else player2.draw();
        player2.when("phaseJieshuBegin").then(() => {
          if (player2.hasSkill("jingliemrfz_ban") || !game.hasPlayer((current) => lib.skill.jingliemrfz.filter(event2, player2))) return;
          player2.addTempSkill("jingliemrfz_ban", "phaseJieshuEnd");
          player2.chooseTarget().set("prompt", get.prompt("jingliemrfz")).set(
            "prompt2",
            `你可以观看一名其他角色的手牌并选择其中一张牌，然后该角色选择一项：<br>①失去一点体力，令你获得此牌。<br>②令你视为使用此牌，然后本回合结束阶段你发动一次【鲸猎】。<br>③对你使用一张【杀】，若此杀造成伤害，你翻面，反之执行其他两项。`
          ).set("filterTarget", (card3, player3, target2) => player3 != target2 && target2.countCards("h") > 0).set("ai", (target2) => {
            var player3 = get.event().player;
            var att = get.attitude(player3, target2), num = 0;
            if (att >= 0) num += 2;
            else num += 5 + target2.getDamagedHp();
            return num += target2.countCards("h") / 2;
          });
        }).then(() => {
          if (result.bool) {
            var target2 = result.targets[0];
            player2.logSkill("jingliemrfz", target2);
            var next = game.createEvent("jingliemrfz_phaseJieshu");
            next.player = player2;
            next.targets = result.targets;
            next.setContent(lib.skill.jingliemrfz.content);
          }
        });
      },
      async index_2(event2, trigger2, player2) {
        let target2 = event2.target_jingliemrfz, card2 = event2.card_jingliemrfz;
        await target2.chooseToUse(
          function(card3, player3, event3) {
            if (get.name(card3) != "sha") return false;
            return true;
          },
          "【鲸猎】:对" + get.translation(player2) + "使用一张杀"
        ).set("forced", true).set("targetRequired", true).set("complexSelect", true).set("filterTarget", function(card3, player3, target3) {
          if (target3 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return player3.canUse({ name: "sha" }, target3, false);
        }).set("sourcex", player2);
        if (target2.hasHistory("useCard", (evt) => {
          return evt.getParent(2) == event2 && target2.hasHistory("sourceDamage", (evtx) => evt.card == evtx.card);
        }))
          player2.turnOver();
        else {
          for (var i2 = 0; i2 < 2; i2++) {
            var next = game.createEvent("jingliemrfz_noDamage");
            next.player = player2;
            next.target_jingliemrfz = target2;
            next.card_jingliemrfz = card2;
            next.setContent(lib.skill.jingliemrfz["index_" + i2]);
          }
        }
      },
      subSkill: {
        ban: {
          charlotte: true
        }
      }
    },
    shulangmrfz: {
      audio: "zhangenmrfz",
      trigger: {
        target: "useCardToTargeted"
      },
      filter(event2, player2) {
        return event2.card && event2.card.name == "sha" && player2.hasSha() && lib.filter.targetEnabled({ name: "sha" }, player2, event2.player);
      },
      check(event2, player2) {
        for (var i2 of player2.getCards("hes", "sha")) {
          if (get.effect(event2.player, i2, player2, player2) > 0 && get.attitude(player2, event2.player) < 0) {
            return true;
          }
        }
        return false;
      },
      prompt2(event2, player2) {
        return "你可以对" + get.translation(event2.player) + "使用一张杀";
      },
      async content(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseToUse(function(card2, player3, event3) {
          if (get.name(card2) != "sha") return false;
          return true;
        }, "请使用一张【杀】").set("forced", true).set("targetRequired", true).set("complexSelect", true).set("shulangmrfz_card", true).set("filterTarget", function(card2, player3, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
          return player3.canUse({ name: "sha" }, target2, false);
        }).set("sourcex", trigger2.player);
        if (player2.hasHistory("useCard", (evt) => {
          return evt && evt.card && evt.name == "useCard" && player2.hasHistory("sourceDamage", (evtx) => {
            return evt.card == evtx.card;
          });
        })) {
          trigger2.getParent().excluded.addArray(trigger2.targets);
          if (trigger2.player.countGainableCards(player2, "he"))
            player2.gainPlayerCard("he", trigger2.player, true).set("target", trigger2.player).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button);
        }
      },
      group: "shulangmrfz_need",
      subSkill: {
        need: {
          trigger: { player: "useCardToPlayered" },
          filter(event2, player2) {
            return event2.getParent(3).name == "shulangmrfz" && event2.card && event2.card.name == "sha";
          },
          silent: true,
          async content(event2, trigger2, player2) {
            const id = trigger2.target.playerid;
            const map = trigger2.getParent().customArgs;
            if (!map[id]) map[id] = {};
            if (typeof map[id].shanRequired == "number") {
              map[id].shanRequired++;
            } else {
              map[id].shanRequired = 2;
            }
          }
        }
      }
    },
    // 新 歌蕾蒂娅
    quliemrfz: {
      intro: {
        markcount: "expansion",
        mark: function(dialog, storage, player2) {
          var cards2 = player2.getExpansions("quliemrfz");
          if (player2.isUnderControl(true)) dialog.addAuto(cards2);
          else return "共有" + get.cnNumber(cards2.length) + "张牌";
        }
      },
      onremove(player2) {
        game.countPlayer((current) => {
          var cards2 = current.getExpansions("quliemrfz");
          if (cards2) current.loseToDiscardpile(cards2);
        });
      },
      audio: "ronghangmrfz",
      trigger: { player: "useCard" },
      filter(event2, player2) {
        return get.tag(event2.card, "damage") && game.hasPlayer((current) => {
          return current != player2 && !current.hasMark("quliemrfz_eff");
        });
      },
      check(event2, player2) {
        return game.hasPlayer((current) => {
          return current != player2 && !current.hasMark("quliemrfz_eff") && get.attitude(player2, current) < 0;
        });
      },
      prompt2: "当你使用带有伤害类标签的牌时，你可以令其他角色若在此牌结算完成前使用或打出牌后，其须将一半（向上取整）的牌置于武将牌上",
      async content(event2, trigger2, player2) {
        game.countPlayer((current) => {
          if (current == player2) return;
          current.addMark("quliemrfz_eff", 1, false);
        });
        if (!player2.storage.newxunxiangmrfz) player2.storage.newxunxiangmrfz = [];
        player2.storage.newxunxiangmrfz.add(trigger2.card);
        player2.when("useCardAfter").filter((event3, player3) => {
          return player3.storage.newxunxiangmrfz.includes(event3.card);
        }).then(() => {
          game.countPlayer((current) => {
            current.removeMark("quliemrfz_eff", 1, false);
          });
          player2.storage.newxunxiangmrfz.remove(trigger2.card);
        }).assign({ lastDo: true });
      },
      group: ["quliemrfz_eff", "quliemrfz_die"],
      subSkill: {
        die: {
          charlotte: true,
          silent: true,
          trigger: { global: "dieAfter" },
          forceDie: true,
          filter(event2, player2) {
            return event2.player.getExpansions("quliemrfz").length;
          },
          content() {
            trigger.player.loseToDiscardpile(trigger.player.getExpansions("quliemrfz"));
          }
        },
        eff: {
          charlotte: true,
          silent: true,
          firstDo: true,
          trigger: {
            global: ["useCardAfter", "respondAfter", "phaseZhunbeiBegin"]
          },
          filter(event2, player2) {
            if (event2.name == "phaseZhunbei") {
              return event2.player.getExpansions("quliemrfz").length > 0;
            } else return event2.player.countCards("h") > 0 && event2.player != player2 && event2.player.hasMark("quliemrfz_eff");
          },
          async content(event2, trigger2, player2) {
            if (trigger2.name == "phaseZhunbei") {
              var current = trigger2.player;
              var cards2 = current.getExpansions("quliemrfz");
              const { links } = new Set(cards2.map((i2) => get.type2(i2, current))).size == 1 ? { links: [] } : await current.chooseCardButton(cards2).set("prompt", `请选择至少两张不同类型的牌`).set("selectButton", [2, Infinity]).set("filterButton", (button) => {
                var player3 = get.event().player, cards3 = ui.selected.buttons;
                return !cards3.some((cardx) => get.type2(cardx, player3) == get.type2(button, player3));
              }).set("ai", (button) => {
                return get.value(button.link, _status.event.player);
              }).forResult();
              if (links.length > 0) {
                current.gain(links, "draw");
                game.log(current, "收回了" + get.cnNumber(links.length) + "因【驱猎】而置于武将牌上的张牌");
              }
              if (cards2.length != links.length) current.discard(cards2.removeArray(links));
              current.unmarkSkill("quliemrfz");
            } else {
              let current2 = trigger2.player;
              var num = Math.ceil(current2.countCards("h") / 2);
              const { cards: cards3 } = await current2.chooseCard(true).set("prompt", `请选择${get.cnNumber(num, false)}张牌`).set("selectCard", num).set("ai", (card2) => {
                get.event().player;
                return 6 - get.value(card2);
              }).forResult();
              current2.addToExpansion(cards3, "giveAuto", current2).gaintag.add("quliemrfz");
              current2.markSkill("quliemrfz");
            }
          }
        }
      }
    },
    newxunxiangmrfz: {
      audio: "xunxiangmrfz",
      trigger: {
        global: "phaseJieshuBegin"
      },
      filter(event2, player2) {
        var cards2 = lib.skill.zheqimrfz_eff2.getDiscard(event2);
        return cards2.length > 0 && player2.canCompare(event2.player);
      },
      prompt2(event2, player2) {
        return `你可以与${get.translation(event2.player)}进行拼点，若你赢，你获得其本回合因弃置而进入弃牌堆的不同类型的牌各一张，并将拼点牌当雷【杀】对其使用`;
      },
      check(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      async content(event2, trigger2, player2) {
        const { result: result2 } = await player2.chooseToCompare(trigger2.player);
        if (result2.bool) {
          var discards = lib.skill.zheqimrfz_eff2.getDiscard(trigger2);
          const { links } = new Set(discards.map((i2) => get.type(i2))).size <= 1 ? { links: discards } : await player2.chooseCardButton(discards).set("prompt", `请选择不同类型的牌`).set("selectButton", [0, Infinity]).set("filterButton", (button) => {
            var player3 = get.event().player, cards3 = ui.selected.buttons;
            return !cards3.some((cardx) => get.type(cardx, player3) == get.type(button, player3));
          }).set("ai", (button) => {
            return get.value(button.link, _status.event.player);
          }).forResult();
          if (links) player2.gain(links, "gain2");
          var cards2 = [result2.player, result2.target];
          cards2 = cards2.filter((i2) => get.position(i2) == "d");
          if (cards2.length > 0 && player2.canUse(
            {
              name: "sha",
              cards: cards2,
              nature: "thunder"
            },
            trigger2.player,
            false
          )) {
            player2.useCard({ name: "sha", nature: "thunder" }, cards2, trigger2.player);
          }
        }
      }
    },
    xueshuomrfz: {
      audio: 2,
      trigger: {
        source: "damageBegin3"
      },
      filter(event2, player2) {
        return player2.countCards("h") >= event2.player.countCards("h");
      },
      prompt2(event2, player2) {
        return `你可以令${get.translation(event2.player)}额外受到1点伤害`;
      },
      check(event2, player2) {
        return get.attitude(player2, event2.player) < 0;
      },
      content() {
        trigger.num++;
      }
    },
    // 妮芙
    xunxinmrfz: {
      audio: 2,
      enable: "phaseUse",
      usable: 1,
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return !current.hasCard((card2) => get.is.shownCard(card2), "h") && current.countCards("h") > 0;
        });
      },
      filterTarget(card2, player2, target2) {
        return !target2.hasCard((card3) => get.is.shownCard(card3), "h") && target2.countCards("h") > 0;
      },
      prompt: "【巡心】:请选择一名没有明置牌的角色",
      async content(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        const { cards: cards2 } = await player2.choosePlayerCard("h", target2).set("prompt", `请选择明置${get.translation(target2)}一张手牌`).set("visible", true).set("filterButton", (button) => {
          return !get.is.shownCard(button);
        }).set("ai", (button) => {
          let target3 = get.event().target, player3 = get.player();
          let value = get.value(button);
          if (get.attitude(player3, target3) < 0) {
            let value2 = get.value(button);
            return target3.hasUseTarget(button) ? value2 - 10 : value2;
          }
          return value;
        }).set("target", target2).forResult();
        if (!cards2) return;
        await target2.addShownCards(cards2, "visible_xunxinmrfz");
        let showncards = [];
        for (let char of game.players) {
          let shown = char.getCards("h", (card2) => get.is.shownCard(card2));
          if (shown) showncards.push(...shown);
        }
        let setShown = new Set(showncards.map((i2) => get.type2(i2)));
        let hasTarget = game.hasPlayer((current) => {
          return !current.hasCard((card2) => get.is.shownCard(card2), "h") && current.countCards("h") > 0;
        });
        if (setShown.size === showncards.map((i2) => get.type2(i2)).length && hasTarget) {
          const { targets: targets2 } = await player2.chooseTarget().set("prompt", `【巡心】:请选择一名没有明置牌的角色`).set("ai", (target3) => {
            let player3 = get.player();
            return get.attitude(player3, target3) < 0;
          }).set("filterTarget", function(card2, player3, target3) {
            return !target3.hasCard((card3) => get.is.shownCard(card3), "h") && target3.countCards("h") > 0;
          }).forResult();
          if (!targets2) return;
          player2.logSkill("xunxinmrfz", targets2[0]);
          var next = game.createEvent("xunxinmrfz_cycle");
          next.player = player2;
          next.target = targets2[0];
          next.targets = targets2;
          next.setContent(lib.skill.xunxinmrfz.content);
        }
      }
    },
    chixinmrfz: {
      audio: 2,
      global: "chixinmrfz_eff",
      subSkill: {
        eff: {
          forced: true,
          silent: true,
          charlotte: true,
          mod: {
            aiOrder(player2, card2, num) {
              if (!player2.hasCard((card3) => get.is.shownCard(card3), "h")) return;
              if (!get.is.shownCard(card2)) {
                let shown = player2.getCards("h", (card3) => get.is.shownCard(card3));
                if (shown.length > 1) return num - 10;
                return num + get.value({ name: card2.name }) - get.value(shown[0]);
              }
              if (get.name(card2) == "sha" && player2.getCardUsable("sha") < 2) return num + 10;
              if (get.name(card2) == "tao" && player2.getDamagedHp() == 1) return num + 10;
              if (get.name(card2) == "jiu" && player2.getCardUsable("jiu") < 2 && player2.isPhaseUsing()) return num + 10;
              if (get.name(card2) == "wuxie") return num + 10;
            },
            cardname(card2, player2, name) {
              let shown = player2.getCards("h", (card3) => get.is.shownCard(card3));
              if (shown && shown.length == 1 && lib.card[shown[0].name].type != "equip") {
                return shown[0].name;
              } else if (shown && (shown.length > 1 || shown.length == 1 && lib.card[shown[0].name].type == "equip")) {
                return "wuxie";
              }
            }
          }
        }
      }
    },
    kuixinmrfz: {
      audio: 2,
      trigger: {
        source: "damageEnd"
      },
      filter(event2, player2) {
        return event2.player != player2 && event2.player.isIn() && event2.player.countCards("h") > 0;
      },
      prompt2(event2, player2) {
        let tran = get.translation(event2.player);
        return `是否令${tran}所有的[明置/暗置]牌[暗置/明置]，然后${tran}弃置两张暗置的牌？`;
      },
      check(event2, player2) {
        return get.attitude(event2.player, player2) < 0;
      },
      async content(event2, trigger2, player2) {
        const target2 = trigger2.player;
        for (let card2 of target2.getCards("h")) {
          if (get.is.shownCard(card2)) target2.hideShownCards(card2);
          else target2.addShownCards(card2, "visible_xunxinmrfz");
        }
        let { promise, resolve } = Promise.withResolvers();
        setTimeout(() => {
          resolve();
        }, 10);
        await promise;
        if (target2.countCards("h", (card2) => !get.is.shownCard(card2)) > 0) {
          target2.chooseToDiscard(true, 2).set("prompt", `【溃心】:请弃置两张暗置的牌`).set("filterCard", (card2) => !get.is.shownCard(card2)).set("ai", (card2) => get.value({ name: card2.name }));
        }
      }
    },
    // 娜仁图亚
    /** @type { Skill } */
    eyanmrfz: {
      audio: 2,
      trigger: { player: "useCardEnd" },
      filter(event2, player2) {
        let card2 = event2.card;
        return event2.cards.someInD() && get.tag(card2, "damage") && game.hasPlayer((current) => player2 != current && current.inRangeOf(player2));
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseTarget().set("prompt", get.prompt("eyanmrfz")).set("prompt2", "你可以将此牌交给攻击范围内的一名其他角色").set("filterTarget", (card2, player3, target2) => player3.inRange(target2) && player3 != target2).set("ai", (target2) => {
          const player3 = get.player();
          let subtraction = player3.maxHp - target2.maxHp;
          let num = get.attitude(player3, target2) > 0 ? 0 : -2;
          if (get.attitude(player3, target2) < 0 && subtraction - 1 >= target2.countCards("h")) return 114514;
          return num - get.value(get.event().cardx) * 0.5 + Math.min(subtraction, target2.countCards("h")) * 2;
        }).set("cardx", trigger2.card).forResult();
      },
      async content(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        await player2.give(trigger2.cards.filterInD(), target2);
        let num = player2.maxHp - target2.maxHp;
        if (num < 1) return;
        const { cards: cards2 } = num >= target2.countCards("h", (card2) => !get.is.shownCard(card2)) ? { cards: target2.getCards("h", (card2) => !get.is.shownCard(card2)) } : await target2.chooseCard().set("prompt", `【恶魇】:请展示${num}张手牌`).set("forced", true).set("ai", (card2) => -get.value(card2)).set("filterCard", (card2) => !get.is.shownCard(card2)).set("selectCard", num).forResult();
        if (!cards2) return;
        target2.addShownCards(cards2, "visible_eyanmrfz");
      }
    },
    shafeimrfz: {
      audio: 2,
      trigger: { global: "phaseZhunbeiBegin" },
      filter(event2, player2) {
        return player2 != event2.player && event2.player.countCards("h", (card2) => get.is.shownCard(card2)) > 0;
      },
      prompt2(event2, player2) {
        const cards2 = event2.player.getCards("h", (card2) => get.is.shownCard(card2));
        return `你可以获得${get.translation(event2.player)}的${cards2.length}张牌(${get.translation(cards2)})`;
      },
      async content(event2, trigger2, player2) {
        const cards2 = trigger2.player.getCards("h", (card2) => get.is.shownCard(card2));
        player2.gain(cards2, "gain2");
      }
    },
    // 佩佩
    boqingmrfz: {
      audio: 2,
      trigger: {
        player: "drawBegin",
        global: "judgeBegin"
      },
      async content(event2, trigger2, player2) {
        let cards2 = get.cards(4);
        let originalHandCards = player2.getCards("h");
        const { moved } = await player2.chooseToMove("【博青】:你可以交换牌堆顶和你的手牌并任意顺序放回牌堆顶或牌堆底").set("list", [["牌堆顶", cards2], ["牌堆底"], ["你的手牌", player2.getCards("h")]]).set("processAI", (list) => {
          let moved2 = [[], [], []];
          let top2 = list[0][1];
          let originalHandCards2 = get.event().originalHandCards.slice();
          _status.currentPhase;
          get.event().evt;
          let player3 = get.player();
          let all = [...top2, ...list[2][1]];
          all.sort(function(a, b) {
            return get.value(b, player3) - get.value(a, player3);
          });
          for (let i3 = 0; i3 < originalHandCards2.length; i3++) {
            moved2[2].push(all.shift());
          }
          while (all) {
            if (get.value(all[0], player3) <= 5) break;
            moved2[1].push(all.shift());
          }
          moved2[0].addArray(all);
          return moved2;
        }).set("filterOk", (moved2) => {
          let originalHandCards2 = get.event().originalHandCards;
          return moved2[2].length == originalHandCards2.length;
        }).set("evt", event2).set("originalHandCards", originalHandCards).forResult();
        if (!moved) return;
        const puts = player2.getCards("h", (i3) => moved[0].includes(i3) || moved[1].includes(i3));
        const gains = cards2.filter((i3) => moved[2].includes(i3));
        if (puts.length && gains.length) {
          player2.$throw(puts.length, 1e3);
          await player2.gain(gains, "giveAuto");
        }
        const top = moved[0];
        const bottom = moved[1];
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
      }
    },
    kuisuimrfz: {
      audio: 2,
      usable: 1,
      enable: "phaseUse",
      getLastAction(player2) {
        const cards2 = [];
        const history = game.getAllGlobalHistory();
        if (history.length < 2) return [];
        const last = history[history.length - 2];
        if (last["cardMove"].length < 1) return [];
        for (let evt of last["cardMove"]) {
          if (!evt.cards) continue;
          for (let card2 of evt.cards) {
            if (get.position(card2, true) == "d" && get.type(card2) != "equip" && player2.hasUseTarget(card2, false)) cards2.push(card2);
          }
        }
        return cards2;
      },
      filter(event2, player2) {
        const cards2 = lib.skill.kuisuimrfz.getLastAction(player2);
        return player2.countCards("he") > 0 && cards2.length > 0;
      },
      filterCard: true,
      position: "he",
      check(card2) {
        return 6 - get.value(card2);
      },
      discard: false,
      lose: false,
      async content(event2, trigger2, player2) {
        event2.cards[0];
        let names = [...new Set(lib.skill.kuisuimrfz.getLastAction(player2).map((i3) => i3.name))];
        let list = [];
        for (var i2 = 0; i2 < names.length; i2++) {
          var name = names[i2];
          if (get.type(name) == "basic") list.push(["基本", "", name]);
          else if (get.type(name) == "trick") list.push(["锦囊", "", name]);
        }
        const { links } = await player2.chooseButton(["窥岁", [list, "vcard"]]).set("ai", (button) => {
          let player3 = get.player(), card2 = {
            name: button.link[2]
          };
          return player3.getUseValue(card2, null, true);
        }).forResult();
        if (!links) return;
        player2.chooseUseTarget({ name: links[0][2], isCard: true }, event2.cards);
      },
      ai: {
        order: 5,
        result: {
          player: 1
        }
      }
    },
    lianwenmrfz: {
      audio: 2,
      trigger: { player: "damageBegin4" },
      usable: 1,
      filter(event2, player2) {
        return event2.num > 0;
      },
      check(event2, player2) {
        if (!event2.source) return true;
        return get.attitude(event2.source, player2) < 0 || player2.hp == 1 || event2.card && get.type2(event2.card) == "trick";
      },
      prompt2(event2, player2) {
        return `你可以进行一次判定，若为红，此伤害-1${event2.source ? `且${get.translation(event2.source)}手牌上限-1直到其回合结束` : ""}`;
      },
      async content(event2, trigger2, player2) {
        const next = player2.judge(function(card2) {
          const color2 = get.color(card2);
          if (color2 == "red") return 4;
          return 0;
        });
        next.judge2 = function(result2) {
          return result2.bool == false;
        };
        const { color } = await next.forResult();
        if (color == "red") {
          trigger2.num--;
          trigger2.source.addTempSkill("lianwenmrfz_eff", { player: "phaseEnd" });
          trigger2.source.addMark("lianwenmrfz_eff", 1, false);
        }
      },
      subSkill: {
        eff: {
          charlotte: true,
          onremove: true,
          intro: {
            content(event2, player2) {
              return `·手牌上限-${player2.countMark("lianwenmrfz_eff")}`;
            }
          },
          mod: {
            maxHandcard: function(player2, num) {
              return num -= player2.countMark("lianwenmrfz_eff");
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
        cardEnabled(card2, player2) {
          if (get.type(card2) == "trick" && player2.getCardUsable("sha") < 1) return false;
        },
        cardUsable: function(card2, player2, num) {
          if (card2.name != "sha") return;
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
        trigger2.getParent().effectCount += num;
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
              (card2) => lib.inpile.some((name) => {
                if (get.name(card2) != "sha") return false;
                if (get.type(name) != "trick") return false;
                if (event2.filterCard({ name, isCard: true, cards: [card2] }, player2, event2)) return true;
                return false;
              }, "hes")
            ) > 0;
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
              var card2 = { name: button.link[2], nature: button.link[3] };
              if (player2.countCards("hes", (cardx) => cardx.name == card2.name)) return 0;
              return _status.event.getParent().type == "phase" ? player2.getUseValue(card2) : 1;
            },
            backup: function(links, player2) {
              return {
                audio: "cainvmrfz",
                filterCard(card2) {
                  return card2.name == "sha";
                },
                popname: true,
                check: function(card2) {
                  return 7 - get.value(card2);
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
          num: index === 0 ? Math.min(player2.getCardUsable("sha"), player2.maxHp) : 1
        };
        player2.markSkill("cangshumrfz");
      },
      subSkill: {
        sha: {
          charlotte: true,
          mod: {
            cardUsable(card2, player2, num) {
              if (card2.name == "sha") return num + 1;
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
        return game.hasPlayer(function(target2) {
          if (event2.targets.includes(target2)) return false;
          if (!player2.canUse(event2.card, target2)) return false;
          return true;
        });
      },
      async cost(event2, trigger2, player2) {
        if (event2.result) event2.result = {};
        event2.result = await player2.chooseTarget(get.prompt2("xinkuangyumrfz"), [1, Infinity], function(card2, player3, target2) {
          var cardx = _status.event.cardx;
          if (!player3.canUse(cardx, target2)) return false;
          var targets2 = _status.event.targets.slice(0).concat(ui.selected.targets);
          if (targets2.includes(target2)) return false;
          return true;
        }).set("promptbar", "none").set("cardx", trigger2.card).set("targets", trigger2.targets).set("ai", function(target2) {
          var player3 = _status.event.player;
          return get.effect(target2, _status.event.cardx, player3, player3);
        }).forResult();
      },
      async content(event2, trigger2, player2) {
        const targets2 = event2.targets;
        if (!player2.storage.xinkuangyumrfz_trigger) player2.storage.xinkuangyumrfz_trigger = [];
        player2.storage.xinkuangyumrfz_trigger.add(trigger2.card);
        trigger2.targets.addArray(targets2);
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
                return player3.countCards("hs", (card2) => get.tag(card2, "damage") > 0 || get.type(card2) == "trick") > 1 ? 0 : nums2;
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
            cardUsable(card2, player2, num) {
              if (card2.name == "sha") return num + player2.countMark("xinchuanzhongmrfz_sha");
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
        return Object.keys(window.whichWaySave.weinaData.HMS).filter((i2) => !player2.hasSkill(i2)).length > 0;
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
        for (let i2 of Object.keys(tmp)) {
          let values = tmp[i2];
          const { index } = await player2.chooseControl().set("choiceList", [...values.map((i3) => info[i3])]).forResult();
          let key = values[index];
          result2[i2] = {
            trans: info[key],
            effect: data.findKey(i2, key),
            key
          };
        }
        let skillname = Object.keys(data.HMS).filter((i2) => !player2.hasSkill(i2)).randomGet();
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
      getSkillsTrigger(target2) {
        let skills = target2.getSkills(null, false, false).filter((skill) => {
          get.info(skill);
          if (get.skillInfoTranslation(skill, target2).length == 0) return false;
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
                trigger2[key].map((i2) => {
                  for (let suffix of suffixes) {
                    i2 = i2.replace(suffix, "");
                  }
                })
              );
          }
        }
        return triggers;
      },
      filter: function(event2, player2) {
        return event2.card && (get.type(event2.card) == "trick" || get.type(event2.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event2.card.name)) && game.hasPlayer(function(current) {
          return current != player2 && lib.skill.futumrfz.getSkillsTrigger(current).some((i2) => lib.skill.futumrfz.getSkillsTrigger(player2).includes(i2));
        });
      },
      async content(event2, trigger2, player2) {
        trigger2.directHit.addArray(
          game.filterPlayer(function(current) {
            return current != player2 && lib.skill.futumrfz.getSkillsTrigger(current).some((i2) => lib.skill.futumrfz.getSkillsTrigger(player2).includes(i2));
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
          let target2 = get.event().target;
          let skillList2 = get.event().skillList;
          if (get.attitude2(target2) < 0) return "cancel2";
          if (target2.hp - event3.num < 1)
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
          return !player2.storage.toulangmrfz[event2.name] && event2.player && event2.player.isIn() && event2.player.countCards("h", (card2) => !get.is.shownCard(card2)) > 0;
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
          return !player2.storage.toulangmrfz["useSkill"] && event2.player && event2.player.isIn() && event2.player.countCards("h", (card2) => !get.is.shownCard(card2)) > 0;
        }
      },
      async content(event2, trigger2, player2) {
        let target2 = trigger2.player;
        player2.storage.toulangmrfz[trigger2.name === "damage" ? trigger2.name : "useSkill"] = true;
        const { cards: cards2 } = await target2.chooseCard(true, "h", (card2) => !get.is.shownCard(card2), [1, 2]).set("prompt", `【头狼】:请明置1-2张手牌`).set("ai", (card2) => {
          return -get.value(card2);
        }).forResult();
        if (!cards2) return;
        target2.addShownCards(cards2, "visible_toulangmrfz");
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
        }).map((i2) => i2[2]).includes(name) && game.hasPlayer((current) => {
          return current.countCards("ej") > 0 || current.countCards("h", (card2) => get.is.shownCard(card2)) > 0;
        });
      },
      onChooseToUse(event2) {
        let player2 = get.player();
        event2.kuanglangmrfz_list = get.inpileVCardList((info) => {
          const name = info[2];
          return get.type(name) === "basic" || get.type(name) === "trick" && get.isSingle(name);
        }).filter((card2) => event2.filterCard({ name: card2[2], nature: card2[3] }, player2, event2));
      },
      filter(event2, player2) {
        return game.hasPlayer((current) => {
          return current.countCards("ej") > 0 || current.countCards("h", (card2) => get.is.shownCard(card2)) > 0;
        }) && event2.kuanglangmrfz_list.length > 0;
      },
      filterTarget(card2, player2, target2) {
        return target2.countCards("ej") > 0 || target2.countCards("h", (card3) => get.is.shownCard(card3)) > 0;
      },
      prompt(event2, player2) {
        return `你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊`;
      },
      async content(event2, trigger2, player2) {
        const target2 = event2.targets[0];
        if (!target2.countGainableCards(
          player2,
          "hej",
          (card2) => get.is.shownCard(card2) || get.position(card2) === "e" || get.position(card2) === "j"
        ))
          return;
        const { links: links2 } = await player2.choosePlayerCard("hej", target2, true).set("filterButton", (button) => {
          return get.position(button.link) === "e" || get.position(button.link) === "j" || get.is.shownCard(button.link);
        }).set("target", target2).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button).forResult();
        const list = event2.getParent(2).kuanglangmrfz_list;
        const { links } = await player2.chooseButton(["狂狼", [list, "vcard"]], true).set("ai", (button) => {
          return get.event().player.getUseValue({
            name: button.link[2],
            nature: button.link[3]
          });
        }).forResult();
        const evt = event2.getParent(2);
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
          player(player2, target2) {
            let val = 1, att = get.attitude(player2, target2);
            if (player2.countCards("j") > 0 && target2 === player2) return 114514;
            if (att > 0 && target2.countCards("j") > 0) val += 5;
            if (att <= 0 && target2.countCards("j") > 0 && target2.countCards("e") < 1 && target2.countCards("h", (card2) => get.is.shownCard(card2)) < 1)
              val -= 5;
            if (att > 0) val -= 0.5;
            if (att <= 0) val += 1;
            if (target2 === player2) val -= 0.9;
            return val;
          }
        }
      }
    },
    kuanglangmrfz_backup: {
      sourceSkill: "kuanglangmrfz",
      precontent() {
        "step 0";
        delete event.result.skill;
        var cards2 = event.result.card.cards;
        event.result.cards = cards2;
        var owner = get.owner(cards2[0]);
        event.target = owner;
        owner.$give(cards2[0], player, false);
        player.popup(event.result.card.name, "metal");
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
        ignoredHandcard: function(card2, player2) {
          if (card2.hasGaintag("yinhumrfz") && get.name(card2) === "sha") {
            return true;
          }
        },
        cardDiscardable: function(card2, player2, name) {
          if (name == "phaseDiscard" && card2.hasGaintag("yinhumrfz") && get.name(card2) === "sha") return false;
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
              const { result: result2 } = await player2.draw(num);
              for (let card2 of result2) {
                if (get.name(card2) === "sha") card2.addGaintag("yinhumrfz");
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
        return game.hasPlayer((current) => player2.canUse("juedou", current) && player2.inRange(current));
      },
      filterTarget(card2, target2, player2) {
        return target2 != player2 && !!player2.canUse("juedou", target2) && player2.inRange(target2);
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
          content: function() {
            trigger.nowuxie = true;
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
            let num = [...evt.targetCards, ...evt.playerCards].length;
            trigger2.num += num;
          }
        }
      },
      ai: {
        order: 6,
        result: {
          target(player2, target2) {
            if (get.attitude2(target2) > 0) return 0;
            return target2.countCards("h", "sha") > player2.countCards("h", "sha") ? 0 : -1;
          }
        }
      }
    },
    // 弑君者
    fengyanmrfz: {
      onremove(player2) {
        for (let i2 of game.players) {
          i2.removeSkill("xingxingmrfz");
        }
        game.broadcastAll(function() {
        });
      },
      audio: 2,
      derivation: ["xingxingmrfz"],
      trigger: { player: "phaseUseBegin" },
      filter(event2, player2) {
        return player2.countCards("he", (card2) => get.type(card2) != "basic") > 0;
      },
      async cost(event2, trigger2, player2) {
        event2.result = await player2.chooseCardTarget({
          prompt: "是否发动【烽烟】？",
          prompt2: "你可以弃置一张非基本牌并选择至多三名角色，令其获得【行刑】",
          filterCard(card2) {
            return get.type(card2) != "basic";
          },
          filterTarget: true,
          selectTarget: [1, 3],
          position: "he",
          ai1(card2) {
            return 8 - get.value(card2);
          },
          ai2(target2) {
            let player3 = get.player();
            return get.attitude(player3, target2) > 0;
          }
        }).forResult();
        event2.result.cost_data = {
          cards: event2.result.cards,
          targets: event2.result.targets
        };
      },
      async content(event2, trigger2, player2) {
        const { cards: cards2, targets: targets2 } = event2.cost_data;
        await player2.discard(cards2);
        for (let target2 of targets2) {
          target2.addSkill("xingxingmrfz");
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
            for (let i2 of game.players) {
              i2.removeSkill("xingxingmrfz");
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
          function(card2, player3, event3) {
            if (get.name(card2) != "sha") return false;
            return lib.filter.filterCard.apply(this, arguments);
          },
          "【行刑】:是否对" + get.translation(trigger2.player) + "使用一张杀？"
        ).set("logSkill", "xingxingmrfz").set("complexSelect", true).set("filterTarget", function(card2, player3, target2) {
          if (target2 != _status.event.sourcex && !ui.selected.targets.includes(_status.event.sourcex)) return false;
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
            const { color } = await player2.judge(function(card2) {
              var color2 = get.color(card2);
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
        targetEnabled(card2, player2, target2) {
          if (!player2.getEquip(1) && get.tag(card2, "damage") && get.type(card2) === "trick") return false;
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
            const { cards: cards2 } = await trigger2.player.chooseCard("he", true).set("prompt", `请交给${get.translation(player2)}一张牌`).set("ai", (card2) => -get.value(card2)).forResult();
            if (!cards2) return;
            player2.gain(cards2);
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
          const cards2 = player2.storage.newjuntongmrfz;
          return !cards2.includes(get.name(event2.card)) && (get.type(event2.card) === "basic" || get.isSingle(event2.card) && get.type(event2.card) === "trick");
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
        targetInRange: function(card2, player2, target2, now) {
          if (!player2.storage.newjuntongmrfz.includes(get.name(card2)) && (get.type(card2) === "basic" || get.isSingle(card2) && get.type(card2) === "trick"))
            return true;
        },
        selectTarget: function(card2, player2, range) {
          if (!player2.storage.newjuntongmrfz.includes(get.name(card2)) && range[1] != -1 && (get.type(card2) === "basic" || get.isSingle(card2) && get.type(card2) === "trick"))
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
            return player2.canUse(trigger2.card, current) && !trigger2.targets.includes(current);
          }))
            list.remove("额外目标");
          let prompt = "【破城】:你可以令此杀额外结算一次或额外指定一个目标";
          if (!list.includes("额外目标")) ;
          const { control } = await player2.chooseControl(list).set("prompt", prompt).set("ai", () => {
            let list2 = get.event().list, card2 = get.event().card, targets2 = get.event().targets, player3 = get.player();
            if (!list2.includes("额外目标") || !game.hasPlayer((current) => get.attitude2(current) < 0 && !targets2.includes(current) && player3.canUse(card2, current)))
              return "额外结算";
            if (targets2.some((i2) => i2.hp < 2)) return "额外结算";
            return Math.random() > 0.5 ? "额外结算" : "额外目标";
          }).set("list", list).set("targets", trigger2.targets).set("card", trigger2.card).forResult();
          if (control === "cancel2") return event2.result.bool = false;
          else if (control === "额外结算")
            event2.result = {
              bool: true,
              cost_data: control
            };
          else {
            const { targets: targets2 } = await player2.chooseTarget(true).set("prompt", `请额外选择一个目标`).set("filterTarget", (card2, player3, target2) => {
              let targets3 = get.event().targets, cardx = get.event().cardx;
              return player3 != target2 && player3.canUse(cardx, target2) && !targets3.includes(target2);
            }).set("ai", (target2) => get.attitude2(target2) < 0).set("targets", trigger2.targets).set("cardx", trigger2.card).forResult();
            event2.result = {
              bool: true,
              cost_data: targets2
            };
          }
        } else {
          const { control } = await player2.chooseControl("cancel2").set("prompt", `请选择一个选项`).set("choiceList", ["发动一次【军统①】", "重置【军统②】"]).set("ai", () => {
            let player3 = get.player();
            return player3.storage.newjuntongmrfz.length > 4 ? "选项二" : "选项一";
          }).forResult();
          event2.result = {
            bool: true,
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
        player2.addMark(skill, 5, null);
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
            const cards2 = event2.name === "draw" ? event2.result : event2.cards;
            const nums = lib.skill.xinxiangmrfz.getLim(player2);
            return player2.countCards("h") + cards2.length > nums;
          },
          async content(event2, trigger2, player2) {
            const cards2 = trigger2.name === "draw" ? trigger2.result : trigger2.cards;
            const nums = lib.skill.xinxiangmrfz.getLim(player2);
            if (player2.countCards("h") >= nums) {
              trigger2.cancel();
            } else {
              const { links: gaincards } = await player2.chooseButton(["心相:请选择你要获得的牌", cards2], true).set("ai", (button) => get.value(button.link)).set("selectButton", () => {
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
        const { targets: targets2 } = await player2.chooseTarget(true, [1, Infinity]).set("filterTarget", (card2, player3, target2) => {
          return player3.canCompare(target2) && player3 != target2 && player3.inRange(target2);
        }).set("ai", (target2) => get.attitude2(target2) < 0).forResult();
        if (targets2.length) {
          player2.chooseToCompare(targets2).callback = function() {
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
        const { bool } = await player2.chooseToDiscard("he").set("prompt", get.prompt("fanyangmrfz")).set("prompt2", `你可以弃置一张手牌，然后直到你的回合结束时，[你/其他角色]计算与[其他角色/你]的距离[-1/+1]`).set("ai", (card2) => get.value(card2) < 8).forResult();
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
          lib.card.wugu.content = function() {
            "step 0";
            for (var i2 = 0; i2 < ui.dialogs.length; i2++) {
              if (ui.dialogs[i2].videoId == event.preResult) {
                event.dialog = ui.dialogs[i2];
                break;
              }
            }
            if (!event.dialog || event.dialog.buttons.length == 0) {
              event.finish();
              return;
            }
            if (event.dialog.buttons.length > 1) {
              let num = 1;
              if (card.storage && typeof card.storage.extraChooseNum === "number") {
                num += card.storage.extraChooseNum;
              }
              var next = target.chooseButton(true);
              next.set("ai", (button2) => {
                let player3 = _status.event.player, card2 = button2.link, val = get.value(card2, player3);
                if (get.tag(card2, "recover")) {
                  val += game.countPlayer((target2) => {
                    return target2.hp < 2 && get.attitude(player3, target2) > 0 && lib.filter.cardSavable(card2, player3, target2);
                  });
                  if (player3.hp <= 2 && game.checkMod(card2, player3, "unchanged", "cardEnabled2", player3)) val *= 2;
                }
                return val;
              });
              next.set("selectButton", num);
              next.set("dialog", event.preResult);
              next.set("closeDialog", false);
              next.set("dialogdisplay", true);
            } else {
              event.directButton = event.dialog.buttons;
            }
            var dialog = event.dialog;
            var cards2 = [];
            if (event.directButton) {
              cards2 = event.directButton.map((i3) => i3.link);
            } else {
              for (var i2 of dialog.buttons) {
                if (result.links.includes(i2.link)) {
                  cards2.push(i2.link);
                }
              }
              if (!cards2) cards2 = event.dialog.buttons.map((i3) => i3.link);
            }
            var button, buttons = [];
            for (var i2 = 0; i2 < dialog.buttons.length; i2++) {
              if (cards2.includes(dialog.buttons[i2].link)) {
                button = dialog.buttons[i2];
                button.querySelector(".info").innerHTML = (function(target2) {
                  if (target2._tempTranslate) return target2._tempTranslate;
                  var name = target2.name;
                  if (lib.translate[name + "_ab"]) return lib.translate[name + "_ab"];
                  return get.translation(name);
                })(target);
                buttons.push(button);
              }
            }
            dialog.buttons.remove(...buttons);
            var capt = get.translation(target) + "选择了" + get.translation(buttons.map((i3) => i3.link));
            if (cards2) {
              target.gain(cards2, "visible");
              target.$gain2(cards2);
              game.broadcast(
                function(cards3, id, name, capt2) {
                  var dialog2 = get.idDialog(id);
                  if (dialog2) {
                    dialog2.content.firstChild.innerHTML = capt2;
                    for (var i3 = 0; i3 < dialog2.buttons.length; i3++) {
                      if (cards3.includes(dialog2.buttons[i3].link)) {
                        dialog2.buttons[i3].querySelector(".info").innerHTML = name;
                        dialog2.buttons.splice(i3--, 1);
                      }
                    }
                  }
                },
                cards2,
                dialog.videoId,
                (function(target2) {
                  if (target2._tempTranslate) return target2._tempTranslate;
                  var name = target2.name;
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
              buttons.map((i3) => i3.link)
            );
            game.delay();
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
          var cards2 = player2.getCards("j");
          var cardsx = cards2.map((card2) => {
            var cardx = ui.create.card();
            cardx.init(get.cardInfo(card2));
            cardx._cardid = card2.cardid;
            return cardx;
          });
          await player2.directgains(cardsx, null, "zhonglemrfz_tag");
          const { result: result2 } = await player2.chooseCardTarget({
            prompt: "是否要发动【众乐】？",
            prompt2: "你可以将你判定区内任意牌当作至多指定相同目标数的【五谷丰登】使用",
            filterCard(card2) {
              return card2.hasGaintag("zhonglemrfz_tag");
            },
            selectCard: [1, Infinity],
            selectTarget: [1, Infinity],
            filterTarget(card2, player3, target2) {
              return player3.canUse("wugu", target2);
            },
            filterOk() {
              return ui.selected.targets.length === ui.selected.cards.length;
            },
            position: "s"
          });
          var cards22 = player2.getCards("s", (card2) => card2.hasGaintag("zhonglemrfz_tag"));
          if (player2.isOnline2()) {
            player2.send(
              function(cards3, player3) {
                cards3.forEach((i2) => i2.delete());
                if (player3 == game.me) ui.updatehl();
              },
              cards22,
              player2
            );
          }
          cards22.forEach((i2) => i2.delete());
          if (player2 == game.me) ui.updatehl();
          event2.result = result2;
        } else {
          let cards3 = player2.getCards("j");
          let targets2 = game.filterPlayer((target2) => get.attitude(player2, target2) > 0);
          cards3.sort((a, b) => {
            return player2.getUseValue(a) - player2.getUseValue(b);
          });
          if (targets2.length > cards3.length) {
            targets2 = targets2.splice(0, cards3.length);
          }
          let result2 = {
            targets: targets2,
            cards: cards3.slice(0, targets2.length),
            bool: true
          };
          event2.result = result2;
        }
      },
      async content(event2, trigger2, player2) {
        let { targets: targets2, cards: cards2 } = event2;
        if (player2.isUnderControl(true) && !_status.auto)
          cards2 = cards2.map((card2) => {
            let j = player2.getCards("j");
            return j.find((i2) => i2.cardid === card2._cardid);
          });
        console.log(cards2);
        await player2.useCard(
          {
            name: "wugu",
            storage: {
              extraCardsNum: targets2.length,
              extraChooseNum: 1
            }
          },
          targets2,
          cards2,
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
        return !player2.getCards("j").map((i2) => get.suit(i2)).includes(get.suit(event2.card));
      },
      async content(event2, trigger2, player2) {
        await player2.draw();
        const { cards: cards2 } = await player2.chooseCard(true, "【起灶】:请蓄谋一次").set("ai", (card2) => {
          const player3 = get.player();
          if (player3.hasValueTarget(card2)) return player3.getUseValue(card2);
          return 0;
        }).set("tipText", true).forResult();
        player2.addJudge({ name: "xumou_jsrg" }, cards2);
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
          if (event2.parent.name == "_lianhuan" || event2.parent.name == "_lianhuan2") return false;
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
        return event2.card && get.tag(event2.card, "fireDamage") && event2.targets.some((target2) => target2.isIn() && !target2.isLinked());
      },
      async content(event2, trigger2, player2) {
        trigger2.targets.forEach((target2) => {
          if (target2.isIn() && !target2.isLinked()) target2.link();
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
        selectTarget(card2, player2, range) {
          if (card2.storage && card2.storage.liaoyuanmrfz && range[1] != -1) range[1] += Math.max(1, player2.getDamagedHp());
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
            return event2.cards && evt.name === "huogong" && evt.card && evt.card.storage && evt.card.storage.liaoyuanmrfz;
          },
          async content(event2, trigger2, player2) {
            if (trigger2.name === "useCard") {
              delete player2.storage.liaoyuanmrfz[trigger2.card.storage.randomId];
            } else {
              let cards2 = trigger2.cards;
              let evt = trigger2.getParent();
              let id = evt.card.cardid;
              if (!Array.isArray(player2.storage.liaoyuanmrfz[id])) player2.storage.liaoyuanmrfz[id] = [];
              player2.storage.liaoyuanmrfz[id].push(...cards2);
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
            let showCards = (player2.storage.liaoyuanmrfz[event2.card.id] || []).filter((card2) => get.position(card2) === "h");
            return damaged.length > 0 && showCards.length > 0;
          },
          async content(event2, trigger2, player2) {
            let showCards = player2.storage.liaoyuanmrfz[trigger2.card.id].filter((card2) => get.position(card2) === "h");
            await player2.gain(showCards, "gain2");
            if (player2.isUnderControl(true) && !_status.auto) {
              const {
                result: { targets: targets2, cards: cards2 }
              } = await player2.chooseCardTarget({
                showCards,
                prompt: "【燎原】:你可以将其中任意张牌当作指定等量目标的【火·万箭齐发】使用",
                prompt2: "请选择目标和牌",
                filterCard(card2) {
                  return get.event().showCards.includes(card2);
                },
                selectCard: [1, Infinity],
                filterTarget(card2, player3, target2) {
                  return player3.canUse("wanjian", target2);
                },
                selectTarget: [1, Infinity],
                filterOk() {
                  return ui.selected.targets.length === ui.selected.cards.length;
                }
              });
              if (!(targets2 && cards2)) return;
              player2.useCard(
                {
                  name: "wanjian",
                  nature: "fire"
                },
                targets2,
                cards2,
                true
              );
            } else {
              let cards2 = showCards, targets2 = game.filterPlayer((i2) => get.attitude(player2, i2) < 0);
              cards2.forEach((card2) => {
                if (get.value(card2) >= 8) cards2.remove(card2);
              });
              if (targets2.length > cards2.length) {
                targets2 = targets2.slice(0, cards2.length);
              }
              if (!(targets2 && cards2)) return;
              player2.useCard(
                {
                  name: "wanjian",
                  nature: "fire"
                },
                targets2,
                cards2.slice(0, targets2.length),
                true
              );
            }
          }
        }
      },
      ai: {
        order: 9.5,
        result: {
          player(player2, target2) {
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
      filterTarget(card2, player2, target2) {
        if (ui.selected.targets.length === 0) return target2.countCards("hje") > 0 && target2 !== player2;
        return get.distance(ui.selected.targets[0], target2) <= ui.selected.cards.length;
      },
      targetprompt: ["被移牌", "收到牌"],
      selectTarget: 2,
      position: "he",
      multitarget: true,
      multiline: true,
      check(card2) {
        let player2 = get.player();
        if (game.hasPlayer((current) => current != player2 && get.attitude2(current) > 0 && current.countCards("j") > 0) && ui.selected.cards.length > 0)
          return false;
        let getTarget = get.result("newdanpaomrfz").target;
        let targets2 = [];
        game.players.forEach((char) => {
          if (char !== player2 && char.countCards("hej") > 0) {
            targets2.push([char, getTarget(player2, char)]);
          }
        });
        let target2 = [void 0, -114514];
        targets2.forEach((char) => {
          if (char[1] > target2[1]) target2 = [char[0], char[1]];
        });
        target2 = target2[0];
        if (ui.selected.cards.length >= Math.max(target2.countCards("h"), target2.countCards("e"))) return false;
        return get.value(card2, player2) < 6;
      },
      async content(event2, trigger2, player2) {
        const { targets: targets2 } = event2;
        const { links } = await player2.choosePlayerCard("hej", targets2[0], true, [1, event2.cards.length]).set("prompt", "请选择你要移动的牌<br>（必须选择同一区域的牌）").set("filterOk", () => {
          return new Set(ui.selected.buttons.map((i2) => get.position(i2.link))).size === 1;
        }).set("ai", (button) => {
          let target2 = get.event().targets[0];
          let cards2 = get.event().cards;
          if (get.attitude2(target2) > 0 && target2.countCards("j") > 0) return target2.getCards("j").includes(button.link);
          let h = target2.getCards("h");
          let e = target2.getCards("e");
          let sort = [h, e, cards2].sort((a, b) => {
            return b.length - a.length;
          });
          sort.forEach((arr, index) => {
            if (cards2.some((i2) => arr.includes(i2))) delete sort[index];
          });
          sort = sort.filter((arr) => arr.length > 0);
          return sort[0].includes(button.link) ? get.value(button.link, get.player()) + 10 : 0;
        }).set("targets", targets2).set("cards", event2.cards).forResult();
        if (!links) return;
        switch (get.position(links[0])) {
          case "h":
            targets2[1].gain(links);
            targets2[0].$give(links.length, targets2[1]);
            break;
          case "e":
            for (let card2 of links) {
              if (targets2[1].canEquip(card2)) {
                targets2[1].equip(card2);
                targets2[0].$give(card2, targets2[1]);
              } else {
                targets2[0].discard(card2);
              }
            }
            break;
          case "j":
            for (let card2 of links) {
              if (!card2.cards?.length) targets2[0].removeVirtualJudge(card2);
              targets2[1].addJudge(card2, card2?.cards);
            }
            break;
        }
      },
      ai: {
        order: 8,
        threaten: 1.5,
        result: {
          target(player2, target2) {
            let att = get.attitude(player2, target2);
            if (ui.selected.targets.length === 0) {
              if (target2.countCards("j") > 0 && att > 0) return 100;
              return att - target2.countCards("hej");
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
