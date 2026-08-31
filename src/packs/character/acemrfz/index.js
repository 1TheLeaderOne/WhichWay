import { get, lib, game, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("acemrfz", {
  sex: "male",
  group: "luomrfz",
  hp: 4,
  maxHp: 6,
  skills: ["newsizhanmrfz", "ehoumrfz"]
});
skill({
  "clanzhongliu_keluxiermrfz": {
    //仅用作配音
    audio: 2
  },
  "sizhanmrfz": {
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
    filter: function(event, player2) {
      return !player2.storage.sizhanmrfz;
    },
    async content(event, trigger2, player2) {
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
  "sizhanmrfz2": {
    trigger: { player: "phaseEnd" },
    forced: true,
    direct: true,
    content: async function(event, trigger2, player2) {
      for (var i = 0; i < game.dead.length && game.dead[i].name != "acemrfz"; i++) ;
      var dead = game.dead[i];
      dead.revive(dead.maxHp);
      event.dead = dead;
      player2.removeSkill("sizhanmrfz2");
      dead.insertPhase();
      dead.addSkill("sizhanmrfz3");
      dead.chat("快走，我来断后！");
    }
  },
  "sizhanmrfz3": {
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
  "guanyongmrfz": {
    shaRelated: true,
    audio: 2,
    trigger: { player: "useCardToPlayered" },
    filter: function(event, player2) {
      if (event.getParent().name != "useCard" || player2 != _status.currentPhase) return false;
      return event.card.name == "sha" && event.target.countDiscardableCards(player2, "he") > 0;
    },
    preHidden: true,
    check: function(event, player2) {
      return get.attitude(player2, event.target) <= 0;
    },
    logTarget: "target",
    async content(event, trigger2, player2) {
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
  "guanyongmrfz2": {
    mod: {
      cardUsable: function(card, player2, num) {
        if (card.name == "sha") return num + player2.countMark("guanyongmrfz2");
      }
    },
    onremove: true
  },
  "shouwangmrfz2": {
    mark: true,
    intro: {
      content: "文明的消亡"
    },
    trigger: { player: "drawAfter" },
    // @ts-ignore
    filter: function(event, player2) {
      return event.getParent().name != "shouwangmrfz_draw";
    },
    // @ts-ignore
    prompt: function(event, player2) {
      var target = game.findPlayer(function(current) {
        return current.hasSkill("shouwangmrfz");
      });
      return "是否令" + get.translation(target) + "摸一张牌？";
    },
    // @ts-ignore
    check: function(event, player2) {
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
  "juhuomrfz": {
    trigger: { player: "useCardAfter" },
    filter: function(event, player2) {
      if (player2.hasSkill("juhuomrfz_ban")) return false;
      return event.card && get.tag(event.card, "damage") > 0 && game.hasPlayer2((current) => {
        return current.hasHistory("damage", (evt) => {
          return event.card == evt.card;
        });
      });
    },
    prompt2: function(event, player2) {
      var num = player2.getHistory("sourceDamage", function(evt) {
        return evt.card == event.card;
      }).length;
      var num2 = event.card.number;
      return "【聚火】:是否增加" + num + "点体力上限（此牌点数<span class=firetext>" + (player2.hp < num2 ? "大于" : "不大于") + "</span>你的体力值）";
    },
    async content(event, trigger2, player2) {
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
  "xuehengmrfz": {
    mode: ["identity"],
    forced: true,
    skillAnimation: true,
    animationColor: "thunder",
    unique: true,
    juexingji: true,
    derivation: ["shihunmrfz", "hantianmrfz"],
    trigger: { player: "phaseBegin" },
    // @ts-ignore
    filter: function(event, player2) {
      return player2.maxHp > game.countPlayer();
    },
    async content(event, trigger2, player2) {
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
  "shihunmrfz": {
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
        filter: function(event, player2) {
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
        filter: function(event, player2) {
          return event.num > 1;
        },
        content: function() {
          trigger.num = 1;
        }
      }
    }
  },
  "hantianmrfz": {
    marktext: "志城",
    intro: {
      name: "志城",
      content: "众志成城"
    },
    trigger: { player: "phaseZhunbeiBegin" },
    // @ts-ignore
    filter: function(event, player2) {
      return !game.hasPlayer((current) => {
        return current.hasMark("hantianmrfz");
      });
    },
    forced: true,
    async content(event, trigger2, player2) {
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
        filter: function(event, player2) {
          if (player2.hasSkill("hantianmrfz_ban") || event.card.name != "sha" || !event.targets.length) return false;
          if (event.getParent(2).name == "hantianmrfz_sha") return false;
          if (!event.player.hasMark("hantianmrfz")) return false;
          var list = game.filterPlayer((current) => {
            return current.hasMark("hantianmrfz");
          }), targets = event.targets;
          for (var i of list) {
            for (var j of targets) {
              if (i == event.player || !i.isIn()) continue;
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
        async content(event, trigger2, player2) {
          let result;
          event.sources = game.filterPlayer((current) => {
            return current.hasMark("hantianmrfz") && current !== trigger2.player;
          }).sortBySeat();
          event.targets = trigger2.targets;
          while (event.sources.length > 0) {
            const current = event.sources.shift();
            const targets = [];
            event.draw = current;
            for (const target of event.targets) {
              if (!target.isIn()) continue;
              if (!current.canUse("sha", target, false)) continue;
              targets.push(target);
            }
            if (current.isIn() && (_status.connectMode || current.hasSha())) {
              result = await current.chooseToUse(
                function(card, player3, event2) {
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
              await event.draw.draw();
            }
          }
        }
      }
    }
  },
  "bianyimrfz": {
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
    async content(event, trigger2, player2) {
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
      const { links } = event.isMine() == false ? { links: autoChoose(list, findWord) } : await player2.chooseButton(buttonList).set("forced", true).set("selectButton", [2, Infinity]).set("filterButton", function(button) {
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
  "chenkemrfz": {
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
    async content(event, trigger2, player2) {
      let skill2 = lib.skill.chenkemrfz.getNegative(player2);
      await player2.addSkill(skill2);
      player2.storage.chenkemrfz.add(skill2);
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
        [skill2]
      );
    }
  },
  "newsizhanmrfz": {
    audio: 2,
    trigger: {
      player: "loseAfter",
      global: ["equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter"]
    },
    filter(event, player2) {
      if (player2.countCards("h")) return false;
      const evt = event.getl(player2);
      return evt && evt.player == player2 && evt.hs && evt.hs.length > 0;
    },
    forced: true,
    // @ts-ignore
    async content(event, trigger2, player2) {
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
  "ehoumrfz": {
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
    filter(event, player2) {
      if (!event.source || !event.source.isIn()) return false;
      return (event.player === player2 || get.distance(player2, event.player) <= 1) && player2.canUse("juedou", event.source);
    },
    // @ts-ignore
    prompt(event, player2) {
      return `【扼后】:是否视为对${get.translation(event.source)}使用一张【决斗】？`;
    },
    check(event, player2) {
      let target = event.source;
      if (get.attitude2(event.player) < 0) return false;
      return get.effect(target, { name: "juedou" }, player2, player2) > 0 && player2.countCards("h") * 2 > target.countCards("h");
    },
    // @ts-ignore
    async content(event, trigger2, player2) {
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
        filter(event, player2) {
          return event.card && event.card.storage && event.card.storage.jumpDying;
        },
        // @ts-ignore
        async content(event, trigger2, player2) {
          player2.die();
        }
      },
      clear: {
        silent: true,
        charlotte: true,
        trigger: { player: "useCardEnd" },
        // @ts-ignore
        filter(event, player2) {
          return event.card && event.card.storage && event.card.storage.jumpDying;
        },
        // @ts-ignore
        async content(event, trigger2, player2) {
          delete player2.storage.ehoumrfz;
        }
      }
    }
  }
});
translate({
  "acemrfz": "Ace",
  "sizhanmrfz": "死战",
  "sizhanmrfz_info": "限定技，锁定技，当你死亡时，你于主公回合结束时复活且插入一个回合且此回合你获得如下效果：①你的伤害基数改为2；②摸牌阶段，你额外摸X张牌；③你的基本牌均视为【杀】且使用杀无距离限制;④回合结束，你立刻死亡。（X=当前轮次数，X至多为5）",
  "guanyongmrfz": "冠勇",
  "guanyongmrfz_info": "出牌阶段，当你使用的【杀】指定目标时，你弃置其一张牌，若此牌为基本牌，则此【杀】不可被【闪】响应，否则，你摸两张牌，然后本回合使用杀的次数+1（若不处于因【死战】而获得的回合，则至多+2）。",
  "shouwangmrfz2": "保存",
  "juhuomrfz": "聚火",
  "juhuomrfz_info": "每回合限一次，当你使用带有伤害类标签的牌结算完毕后，若此牌造成过伤害，你可以增加X点体力上限，然后若此牌的点数大于你的体力值，你将手牌补至体力上限，反之你将体力上限调整至与该牌点数相同并将体力值回复至体力上限。（X=此牌造成的伤害数）",
  "xuehengmrfz": "血恨",
  "xuehengmrfz_info": "觉醒技，回合开始时，若你体力上限不少于存活角色数，你失去【聚火】且：若你的手牌数大于你的体力值且没有与你胜利条件一致的角色死亡，获得【熯天】，反之你将身份牌变为内奸（如果你是主公则改为将其余角色的身份牌均变为反贼），获得【失魂】。然后你将体力值调整至体力上限",
  "shihunmrfz": "失魂",
  "shihunmrfz_info": "锁定技，准备阶段，你对所有角色造成两点火属性伤害；当你受到大于1点的伤害时，你将伤害值调整至1点；你使用牌无次数限制；结束阶段，你摸X张牌。（X=已死亡的角色数）",
  "hantianmrfz": "熯天",
  "hantianmrfz_info": "①锁定技，准备阶段，若场上没有角色有‘志城’标记，你令与你胜利条件相同的其他角色和你获得‘志城’标记，然后所有拥有‘志城’标记的角色将体力上限和体力值调整至所有有‘志城’标记的角色中的体力上限的最大值。②当拥有‘志城’标记的角色使用的【杀】结算完毕后，其他有‘志城’标记的角色可以对此杀的目标使用一张【杀】并摸一张牌。",
  "bianyimrfz": "编译",
  "bianyimrfz_info": "每轮开始时或你造成伤害后，你可以随机抽取100个技能名，从这100个技能名随机抽取50个汉字，然后你在30秒内从这些汉字中选择两个汉字，使其组成一个技能名，若此技能名存在于技能库中，你获得此技能。",
  "chenkemrfz": "沉疴",
  "chenkemrfz_info": "锁定技，每轮开始时，你随机获得一个技能名是贬义的技能；此技能和因此技能获得的技能不参与技能数的计算。",
  "newsizhanmrfz": "死战",
  "newsizhanmrfz_info": "锁定技，当失去最后一张手牌后，你失去一点体力或失去一点体力上限，然后将手牌补至5。",
  "ehoumrfz": "扼后",
  "ehoumrfz_info": "当你或与你距离不大于1的角色受到伤害后，你可以对伤害来源视为使用一张【决斗】，且你的手牌均视为【杀】直到此牌结算完毕，若有角色因此牌而进入濒死状态，其跳过之。"
});
characterTitle("acemrfz", "<font color='red'>巴别塔之盾</font>");
characterIntro("acemrfz", "罗德岛精英干员Ace，参与切尔诺伯格行动，因掩护博士救援小队撤退而阵亡。</br></br><span class=firetext>罗德岛会铭记您的贡献。</span>");
//# sourceMappingURL=index.js.map
