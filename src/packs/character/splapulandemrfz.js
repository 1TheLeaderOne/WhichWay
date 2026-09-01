import { get, lib, game } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("splapulandemrfz", {
  pack: "legendSJZX",
  sex: "female",
  group: "xumrfz",
  hp: 3,
  skills: ["shilangmrfz", "toulangmrfz", "kuanglangmrfz"]
});
skill({
  "shilangmrfz": {
    audio: 2,
    forced: true,
    trigger: { player: "phaseEnd" },
    filter: function(event, player2) {
      return player2.storage.phaseHistory;
    },
    async content(event, trigger, player2) {
      const phaseHistory = player2.storage.phaseHistory;
      if (lib.phaseName.isSubset(Object.keys(phaseHistory))) player2.draw();
      else player2.loseHp();
    }
  },
  "toulangmrfz": {
    audio: 2,
    trigger: {
      global: ["damageEnd", "useSkill", "logSkillBegin", "useCard", "respond"]
    },
    init(player2, skill2) {
      game.broadcastAll(() => {
        lib.translate["visible_toulangmrfz"] = "明置";
      });
      player2.storage[skill2] = {
        damage: false,
        useSkill: false
      };
    },
    onremove: true,
    forced: true,
    filter(event, player2) {
      if (event.name == "damage") {
        return !player2.storage.toulangmrfz[event.name] && event.player && event.player.isIn() && event.player.countCards("h", (card) => !get.is.shownCard(card)) > 0;
      } else {
        if (["global", "equip"].includes(event.type)) return false;
        let skill2 = get.sourceSkillFor(event);
        if (!skill2 || skill2 === "toulangmrfz") return false;
        let info = get.info(skill2);
        while (true) {
          if (!info || info.charlotte || info.equipSkill) return false;
          if (info && !info.sourceSkill) break;
          skill2 = info.sourceSkill;
          info = get.info(skill2);
        }
        return !player2.storage.toulangmrfz["useSkill"] && event.player && event.player.isIn() && event.player.countCards("h", (card) => !get.is.shownCard(card)) > 0;
      }
    },
    async content(event, trigger, player2) {
      let target = trigger.player;
      player2.storage.toulangmrfz[trigger.name === "damage" ? trigger.name : "useSkill"] = true;
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
  "kuanglangmrfz": {
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
    onChooseToUse(event) {
      let player2 = get.player();
      event.kuanglangmrfz_list = get.inpileVCardList((info) => {
        const name = info[2];
        return get.type(name) === "basic" || get.type(name) === "trick" && get.isSingle(name);
      }).filter((card) => event.filterCard({ name: card[2], nature: card[3] }, player2, event));
    },
    filter(event, player2) {
      return game.hasPlayer((current) => {
        return current.countCards("ej") > 0 || current.countCards("h", (card) => get.is.shownCard(card)) > 0;
      }) && event.kuanglangmrfz_list.length > 0;
    },
    filterTarget(card, player2, target) {
      return target.countCards("ej") > 0 || target.countCards("h", (card2) => get.is.shownCard(card2)) > 0;
    },
    prompt(event, player2) {
      return `你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊`;
    },
    async content(event, trigger, player2) {
      const target = event.targets[0];
      if (!target.countGainableCards(
        player2,
        "hej",
        (card) => get.is.shownCard(card) || get.position(card) === "e" || get.position(card) === "j"
      ))
        return;
      const { links: links2 } = await player2.choosePlayerCard("hej", target, true).set("filterButton", (button) => {
        return get.position(button.link) === "e" || get.position(button.link) === "j" || get.is.shownCard(button.link);
      }).set("target", target).set("complexSelect", false).set("ai", lib.card.shunshou.ai.button).forResult();
      const list = event.getParent(2)?.kuanglangmrfz_list;
      const { links } = await player2.chooseButton(["狂狼", [list, "vcard"]], true).set("ai", (button) => {
        return get.event().player.getUseValue({
          name: button.link[2],
          nature: button.link[3]
        });
      }).forResult();
      const evt = event.getParent(2);
      if (!links || !evt) return;
      let name = links[0][2], nature = links[0][3];
      game.broadcastAll(
        function(result, name2, nature2) {
          lib.skill.kuanglangmrfz_backup.viewAs = {
            name: name2,
            nature: nature2,
            cards: result
          };
          lib.skill.kuanglangmrfz_backup.prompt = "选择" + get.translation(name2) + "（" + get.translation(result) + "）的目标";
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
  }
});
translate({
  "splapulandemrfz": "荒芜拉普兰德",
  "splapulandemrfz_prefix": "荒芜",
  "shilangmrfz": "时狼",
  "shilangmrfz_info": "锁定技，回合结束时，若你没有阶段被跳过，你摸一张牌，反之你流失一点体力。",
  "toulangmrfz": "头狼",
  "toulangmrfz_info": "锁定技，每轮第一个[受到伤害/发动技能]的角色须明置一到两张手牌。",
  "kuanglangmrfz": "狂狼",
  "kuanglangmrfz_info": "你可以将场上或明置的牌当作一张基本牌或单一目标的普通锦囊使用。"
});
characterTitle("splapulandemrfz", "<font color='#8b008b'>恣意英杰</font>");
characterIntro("splapulandemrfz", "拉普兰德，无业，叙拉古萨卢佐家族现任家主阿尔贝托的独女，目前已从家族脱离。拉普兰德擅长单兵作战，经常在战术攻坚与肃清作战中为罗德岛提供协助。");
//# sourceMappingURL=splapulandemrfz.js.map
