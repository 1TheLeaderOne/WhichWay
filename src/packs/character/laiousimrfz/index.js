import { _status, get, lib, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../../hooks.js";
character("laiousimrfz", {
  sex: "male",
  group: "othermrfz",
  hp: 4,
  skills: ["shijianmrfz", "shimomrfz"]
});
skill({
  "shijianmrfz": {
    audio: 2,
    derivation: ["jianzhumrfz"],
    trigger: { player: "phaseZhunbeiBegin" },
    filter(event, player) {
      return player.countCards("he") > 0 && !player.isDisabled(1) && !player.hasCard((card) => card.name == "jianzhumrfz", "e");
    },
    async cost(event, trigger, player) {
      event.result = await player.chooseToDiscard(`【拾剑】:你可以弃置一张牌，将【剑助】置入你的武器栏`, "he").set("ai", (card) => {
        return 6 - get.value(card);
      }).forResult();
    },
    async content(event, trigger, player) {
      const card = game.createCard("jianzhumrfz", "spade", 12);
      player.$gain2(card);
      player.equip(card);
    },
    ai: {
      threaten: 0.8
    }
  },
  "shimomrfz": {
    audio: 2,
    init(player, skill2) {
      player.storage[skill2] = {};
      const translates = {
        2: '富甲<font color="red">目标+</font>',
        3: '空巢<font color="red">摸牌</font>',
        4: '残躯<font color="red">伤害+</font>'
      };
      for (let i = 2; i <= 4; i++) {
        lib.translate[skill2 + "_" + i] = translates[i];
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
        get(target, prop) {
          let value;
          if (typeof prop !== "symbol") {
            value = Number(prop);
          } else {
            return target["baka"];
          }
          if (!isNaN(value)) {
            if (value < 1) return target["baka"];
            if (value > 4) return target["master"];
            return target[value];
          }
          return target["baka"];
        }
      }
    ),
    intro: {
      name: "莱欧斯的魔物宝典",
      content: function(event, player) {
        const storage = player.storage.shimomrfz;
        let intro = [];
        if (storage === void 0) return "没有记录的魔物";
        const sorted = Object.entries(storage).sort((a, b) => b[1] - a[1]).map(([key, value]) => ({ key, value }));
        for (let obj of sorted) {
          intro.push(`【${get.translation(obj["key"])}】是${lib.skill.shimomrfz.proficiency[obj["value"]]}（${obj["value"]}）`);
        }
        return `莱欧斯对‘魔物’:<br>` + intro.join("<br>");
      }
    },
    trigger: { player: "gainAfter" },
    direct: true,
    async content(event, trigger, player) {
      if (_status.poison_laiousiSJZX != true) {
        player.logSkill("shimomrfz");
        _status.poison_laiousiSJZX = true;
        setTimeout(() => delete _status.poison_laiousiSJZX, 3e3);
      }
      const cards = trigger.cards, storage = player.storage.shimomrfz;
      for (let card of cards) {
        let name = get.name(card);
        storage.hasOwnProperty(name) ? player.storage.shimomrfz[name]++ : player.storage.shimomrfz[name] = 1;
        if (storage.hasOwnProperty(name)) {
          let num = storage[name];
          if (num < 2) continue;
          if (num > 4) num = 4;
          for (let i = 2; i <= num; i++) player.addGaintag(card, `shimomrfz_${i}`);
        }
      }
    },
    group: "shimomrfz_yingbian",
    subSkill: {
      yingbian: {
        audio: "shimomrfz",
        silent: true,
        trigger: { player: "yingbian" },
        filter(event, player) {
          return event.card.isCard && player.hasHistory("lose", (evt) => {
            return evt.getParent() == event && Object.values(evt.gaintag_map).some((value) => value.join(" ").includes("shimomrfz_"));
          });
        },
        async content(event, trigger, player) {
          let tags;
          player.getHistory("lose", (evt) => {
            if (evt.getParent() != trigger) return;
            const maps = evt.gaintag_map;
            for (let key in maps) {
              if (maps[key].join(" ").includes("shimomrfz_")) tags = maps[key];
            }
          });
          const index = Math.max(...tags.filter((i) => /^shimomrfz_\d+$/.test(i)).map((i) => Number(i.replace(/\D+/g, ""))));
          if (!Array.isArray(trigger.temporaryYingbian)) trigger.temporaryYingbian = [];
          trigger.temporaryYingbian.add("force");
          if (index >= 2 && player.satisfyYingbian("fujia", trigger)) {
            trigger.temporaryYingbian.add("add");
          }
          if (index >= 3 && player.satisfyYingbian("kongchao", trigger)) {
            trigger.temporaryYingbian.add("draw");
          }
          if (index >= 4 && player.satisfyYingbian("canqu", trigger)) {
            trigger.temporaryYingbian.add("damage");
          }
        }
      }
    }
  }
});
translate({
  "laiousimrfz": "莱欧斯",
  "shijianmrfz": "拾剑",
  "shijianmrfz_info": "准备阶段，若你的武器栏没有【剑助】，你可以弃置一张牌并将【剑助】置入你的武器栏。",
  "shimomrfz": "识魔",
  "shimomrfz_info": "锁定技，当你获得过至少[2/3/4]次同名牌时，你令此牌获得“[富甲→目标+1/空巢→摸一张牌/残躯→伤害+1]”。"
});
characterTitle("laiousimrfz", '<font color="#8b008b">迷宫魔物专家</font>');
characterIntro("laiousimrfz", "莱欧斯，莱欧斯小队的队长，拥有丰富的“迷宫”（注：我们也不知道所谓“迷宫”到底是什么）探索经验。虽然充满谜团，但是莱欧斯的贡献毋庸置疑。在执行野外任务时，他总能为罗德岛提供不少作战帮助。");
//# sourceMappingURL=index.js.map
