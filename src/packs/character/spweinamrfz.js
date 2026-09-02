import { game, get, lib, _status } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spweinamrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "weimrfz",
  hp: 4,
  skills: ["zhongyuanmrfz", "futumrfz", "wangximrfz"]
});
skill({
  "zhongyuanmrfz": {
    audio: 2,
    trigger: { global: "roundStart" },
    filter(event, player) {
      return Object.keys(window.whichWaySave.weinaData.HMS).filter((i) => !player.hasSkill(i)).length > 0;
    },
    frequent: true,
    async content(event, trigger, player) {
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
      let result = {};
      for (let i of Object.keys(tmp)) {
        let values = tmp[i];
        const { index } = await player.chooseControl().set("choiceList", [...values.map((i2) => info[i2])]).forResult();
        let key = values[index];
        result[i] = {
          trans: info[key],
          effect: data.findKey(i, key),
          key
        };
      }
      let skillname = Object.keys(data.HMS).filter((i) => !player.hasSkill(i)).randomGet();
      lib.translate[skillname] = data.HMS[skillname];
      lib.translate[skillname + "_info"] = "每回合限一次，" + result.triggers.trans + ",若" + result.filter.trans + ",你可以" + result.content.trans;
      if (!_status.weinaData) _status.weinaData = {};
      _status.weinaData[skillname] = {
        result,
        data,
        random,
        tmp
      };
      lib.skill[skillname] = {
        onremove(player2, skill2) {
          delete _status.weinaData[skill2];
        },
        usable: 1,
        trigger: { player: Object.keys(result.triggers.effect[0])[0] },
        weinaName: skillname,
        filter(event2, player2) {
          let name = this.weinaName;
          let filter = _status.weinaData[name].data.findKey(
            _status.weinaData[name].result.filter,
            Object.keys(_status.weinaData[name].tmp)[1]
          )[0].filter;
          return filter(event2, player2, name);
        },
        async content(event2, trigger2, player2) {
          let name = event2.name;
          let contents = _status.weinaData[name].data.findKey(
            _status.weinaData[name].result.content,
            _status.weinaData[name].result.content.key
          )[0][_status.weinaData[name].result.content.key].content;
          var next = game.createEvent("weinaNext");
          next.player = player2;
          next.name = name;
          next.weinaData = {
            num: _status.weinaData[name].random.num.num(event2, player2),
            name: _status.weinaData[name].random.name,
            phase: _status.weinaData[name].random.phase
          };
          next.setContent(contents);
        },
        ai: {
          threaten: 0.8
        }
      };
      player.addSkill(skillname);
    }
  },
  "futumrfz": {
    audio: 2,
    forced: true,
    trigger: {
      player: "useCard"
    },
    getSkillsTrigger(target) {
      let skills = target.getSkills(null, false, false).filter((skill2) => {
        get.info(skill2);
        if (get.skillInfoTranslation(skill2, target).length == 0) return false;
        return true;
      });
      let triggers = [];
      let suffixes = ["Begin", "End", "After", "Start", "Before"];
      for (let skill2 of skills) {
        let trigger = get.info(skill2).trigger;
        for (let key in trigger) {
          if (!Array.isArray(trigger[key])) {
            for (let suffix of suffixes) {
              if (trigger[key].includes(suffix)) triggers.add(trigger[key].replace(suffix, ""));
            }
          } else
            triggers.addArray(
              trigger[key].map((i) => {
                for (let suffix of suffixes) {
                  i = i.replace(suffix, "");
                }
              })
            );
        }
      }
      return triggers;
    },
    filter: function(event, player) {
      return event.card && (get.type(event.card) == "trick" || get.type(event.card) == "basic" && !["shan", "tao", "jiu", "du"].includes(event.card.name)) && game.hasPlayer(function(current) {
        return current != player && lib.skill.futumrfz.getSkillsTrigger(current).some((i) => lib.skill.futumrfz.getSkillsTrigger(player).includes(i));
      });
    },
    async content(event, trigger, player) {
      trigger.directHit.addArray(
        game.filterPlayer(function(current) {
          return current != player && lib.skill.futumrfz.getSkillsTrigger(current).some((i) => lib.skill.futumrfz.getSkillsTrigger(player).includes(i));
        })
      );
    }
  },
  "wangximrfz": {
    audio: 2,
    trigger: { global: "damageBegin3" },
    filter(event, player) {
      return event.player === player || get.distance(player, event.player) < 2;
    },
    async cost(event, trigger, player) {
      let skillList = player.getSkills(null, false, false).filter((skill2) => {
        let info = get.info(skill2);
        if (get.skillInfoTranslation(skill2, player).length === 0 || !info || info.charlotte) return false;
        return true;
      });
      event.result = await player.chooseControl(skillList, "cancel2").set(
        "prompt",
        `你可以失去一个技能令此伤害对${trigger.player === player ? "你" : get.translation(trigger.player)}无效并令其摸两张牌`
      ).set("ai", () => {
        let event2 = get.event();
        get.player();
        let target = get.event().target;
        let skillList2 = get.event().skillList;
        if (get.attitude2(target) < 0) return "cancel2";
        if (target.hp - event2.num < 1)
          return skillList2.sort((a, b) => {
            return get.skillthreaten(b) - get.skillthreaten(a);
          })[0];
        return skillList2.filter((skill2) => get.skillthreaten(skill2) < 1).sort((a, b) => {
          return get.skillthreaten(b) - get.skillthreaten(a);
        })[0] || "cancel2";
      }).set("target", trigger.player).set("skillList", skillList).forResult();
      event.result.cost_data = event.result.control;
    },
    async content(event, trigger, player) {
      let skill2 = event.cost_data;
      game.log(player, "失去了", `#g【${get.translation(skill2)}】`);
      player.removeSkill(skill2);
      trigger.player.draw(2);
      trigger.cancel();
    },
    ai: {
      threaten: 1.1
    }
  }
});
translate({
  "spweinamrfz": "维娜·维多利亚",
  "zhongyuanmrfz": "众愿",
  "zhongyuanmrfz_info": "每轮开始时，你可以从随机的三个时机、条件和效果中各选择一个组合成一个技能并获得之。",
  "futumrfz": "赴土",
  "futumrfz_info": "锁定技，其他角色拥有与你时机相同的技能时，其无法响应你使用的牌。",
  "wangximrfz": "王息",
  "wangximrfz_info": "当你或与你距离为1的角色受到伤害时，你可以失去一个技能，令受伤角色摸两张牌并令此伤害无效。"
});
characterTitle("spweinamrfz", "<font color=#C0C0C0>再缔荣光</font>");
characterIntro("spweinamrfz", "维娜·维多利亚,最初以格拉斯哥帮头领身份登记为罗德岛干员的推进之王，于伦蒂尼姆战争期间又以典范军领袖身份与罗德岛协同行动，现在则以伦蒂尼姆议会议长身份，和罗德岛保持合作关系。罗德岛为伦蒂尼姆的医疗建设提供了支持，维娜·维多利亚也承诺未来将在更多领域与罗德岛展开合作。");
