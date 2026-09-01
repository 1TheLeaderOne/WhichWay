import { game, lib, get, ui } from "noname";
import { skillCustomFunc } from "../../nonameEx/custom/skill.js";
import { whichWayUtil } from "../../utill.js";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("spchuxuemrfz", {
  pack: "legendSJZX",
  sex: "female",
  hp: 3,
  skills: ["fulingmrfz", "shengweimrfz"],
  group: "xiemrfz"
});
const tmpSave = window.whichWaySave.tmpSave;
skill({
  "shengweimrfz": {
    mod: {
      aiOrder(player, card, num) {
        if (get.type(card) !== "basic" && card?.cards?.some((i) => i.hasGaintag("shengweimrfz_pile"))) return num + 1;
      },
      aiValue(player, card, num) {
        if (get.type(card) !== "basic" && card?.cards?.some((i) => i.hasGaintag("shengweimrfz_pile"))) return num - 10;
      },
      cardUsable(card, player) {
        if (get.type(card) !== "basic" && card?.cards?.some((i) => i.hasGaintag("shengweimrfz_pile"))) return false;
      },
      cardEnabled(card, player) {
        if (get.type(card) !== "basic" && card?.cards?.some((i) => i.hasGaintag("shengweimrfz_pile"))) return false;
      },
      cardEnabled2(card, player) {
        if (get.type(card) !== "basic" && card?.cards?.some((i) => i.hasGaintag("shengweimrfz_pile"))) return false;
      },
      cardSavable(card, player) {
        if (get.type(card) !== "basic" && card?.cards?.some((i) => i.hasGaintag("shengweimrfz_pile"))) return false;
      }
    },
    init(player, skill2) {
      lib.translate["shengweimrfz_pile"] = "牌堆顶";
      lib.skill.shengweimrfz.observerPile(player);
      tmpSave.fulingmrfz_acted_callback = function(player2, args) {
        if (args.p !== "length" && args.p !== void 0) return;
        player2.getCards("s", (card) => card.hasGaintag("shengweimrfz_pile")).forEach((i) => i.delete());
        tmpSave[player2.playerid]["observer_shengweimrfz"].disconnect();
        tmpSave[player2.playerid]["observer_shengweimrfz"].takeRecords();
        tmpSave[player2.playerid]["observer_shengweimrfz"] = null;
        lib.skill.shengweimrfz.observerPile(player2);
      };
    },
    observerPile(player) {
      getCopyCard(player);
      let recordCount;
      const observer = new MutationObserver(() => {
        if (player.isDead()) {
          lib.skill.shengweimrfz.onremove(player, "shengweimrfz");
          return;
        }
        let currentCount = ui.cardPile.childNodes.length;
        if (currentCount !== recordCount) {
          recordCount = currentCount;
          let pileCards = player.getCards("s", (card) => card.hasGaintag("shengweimrfz_pile"));
          let tops = get.cards((player.storage?.fulingmrfz?.acted?.length || 0) + 1, true);
          if (tops.every((card) => pileCards.map((i) => i._cardid).includes(card.cardid))) return;
          pileCards.forEach((card) => card.delete());
          getCopyCard(player);
        }
      });
      observer.observe(ui.cardPile, {
        childList: true,
        subtree: false
      });
      tmpSave[player.playerid] ??= {};
      tmpSave[player.playerid]["observer_shengweimrfz"] = observer;
      function getCopyCard(player2) {
        let num = (player2.storage?.fulingmrfz?.acted?.length || 0) + 1;
        let cards = get.cards(num, true);
        let copy_cards = cards.map((card) => {
          let copy_card = ui.create.card();
          copy_card.init(get.cardInfo(card));
          copy_card._cardid = card.cardid;
          copy_card._destroy = true;
          return copy_card;
        });
        for (let i = 0; i < copy_cards.length; i++) {
          let card = copy_cards[i];
          card.addPromptSJZX(`第${i + 1}张`);
          skillCustomFunc.invisableJiZhan(card, player2);
        }
        player2.directgains(copy_cards, null, "shengweimrfz_pile");
      }
    },
    onremove(player, skill2) {
      delete tmpSave.fulingmrfz_acted_callback;
      player.getCards("s", (card) => card.hasGaintag("shengweimrfz_pile")).forEach((i) => i.delete());
      if (player.playerid === void 0) return;
      tmpSave[player.playerid]["observer_shengweimrfz"].disconnect();
      tmpSave[player.playerid]["observer_shengweimrfz"].takeRecords();
      tmpSave[player.playerid]["observer_shengweimrfz"] = null;
    },
    audio: ["作战中1", "作战中2"],
    trigger: {
      global: ["useSkill", "logSkillBegin"]
    },
    forced: true,
    filter(event, player) {
      let skill2 = event.skill;
      if (!skill2 || skill2 === "shengweimrfz" || event.sourceSkill === "shengweimrfz") {
        return false;
      }
      let info = get.info(skill2);
      if (!info || info.equipSkill) {
        return false;
      }
      return skill2.startsWith("fulingmrfz_");
    },
    async content(event, trigger, player) {
    },
    group: ["shengweimrfz_replace"],
    subSkill: {
      replace: {
        audio: "shengweimrfz",
        charlotte: true,
        trigger: {
          player: ["useCardBefore", "respondBefore"]
        },
        filter(event, player) {
          let cards = player.getCards("s", (card) => card.hasGaintag("shengweimrfz_pile") && card._cardid);
          return event.cards && event.cards.some((card) => {
            return cards.includes(card);
          });
        },
        forced: true,
        async content(event, trigger, player) {
          let num = (player.storage?.fulingmrfz?.acted?.length || 0) + 1;
          let cardsid = get.cards(num, true).map((i) => i.cardid);
          trigger.cards = trigger.cards.map((card) => {
            if (!cardsid.includes(card._cardid)) return card;
            return get.cards(num, true).find((cardx) => cardx.cardid === card._cardid);
          });
          trigger.card.cards = trigger.card.cards.map((card) => {
            if (!cardsid.includes(card._cardid)) return card;
            return get.cards(num, true).find((cardx) => cardx.cardid === card._cardid);
          });
        }
      }
    }
  },
  "fulingmrfz": {
    audio: ["作战中4", "作战中3", "行动出发", "行动开始", "观看作战记录"],
    derivation: ["fangzhu", "rexingxue", "yanru"],
    trigger: {
      global: "roundStart"
    },
    lastDo: true,
    init(player, skill2) {
      let handler = {
        set(t, p, v, r) {
          if (typeof tmpSave.fulingmrfz_acted_callback === "function") tmpSave.fulingmrfz_acted_callback(player, { t, p, v, r });
          return Reflect.set(t, p, v, r);
        }
      };
      player.storage[skill2] = {
        target: 0,
        // purge education cohesion
        acted: new Proxy([], handler)
      };
      if (typeof tmpSave.fulingmrfz_acted_callback === "function") tmpSave.fulingmrfz_acted_callback(player, {});
      if (!lib.skill.rexingxue.audioname2) lib.skill.rexingxue.audioname2 = {};
      if (!lib.skill.rexingxue.audioname2[player.name]) lib.skill.rexingxue.audioname2[player.name] = "fulingmrfz";
    },
    mark: true,
    intro: {
      content(storage, player) {
        if (!storage || !player) return `没有标记！`;
        let cnplayer = get.translation(player), acted = storage.acted;
        if (storage.target < 1) return `·看来${cnplayer}不打算采取任何行动`;
        let str = [`·${cnplayer}需要推动#r${storage.target}#项改革，否则其会失去#r1#点体力！`, "———已行之事———"];
        if (acted.includes("purge")) str.push(`已放逐蔓珠院保守派`);
        if (acted.includes("education")) str.push(`已推动基础教育`);
        if (acted.includes("cohesion")) str.push(`已加强宗教凝聚力`);
        return str.map((i) => whichWayUtil.colorize(i)).join("<br>");
      }
    },
    onremove: true,
    async cost(event, trigger, player) {
      lib.skill.fulingmrfz.init(player, "fulingmrfz");
      const result = await player.chooseControl({
        controls: ["一", "二", "三", "cancel2"]
      }).set("prompt", get.prompt("fulingmrfz")).set("prompt2", `你可以摸至多三张牌，然后你的回合结束时，若你执行选项的数量少于你摸的牌数，你失去X点体力。(X=你摸的牌数 - 你执行的项数)`).set("ai", () => {
        let player2 = get.player();
        return player2.hp > 2 ? "三" : ["一", "二", "三"].randomGet();
      }).forResult();
      if (result?.control !== "cancel2") {
        event.result = {
          ...result,
          cost_data: {
            index: result.index
          }
        };
      }
    },
    async content(event, trigger, player) {
      let { index } = event.cost_data;
      player.draw(index + 1);
      player.storage.fulingmrfz.target = index + 1;
    },
    group: ["fulingmrfz_purge", "fulingmrfz_education", "fulingmrfz_cohesion", "fulingmrfz_loseHp"],
    subSkill: {
      loseHp: {
        audio: "fulingmrfz",
        forced: true,
        trigger: {
          global: "roundEnd"
        },
        lastDo: true,
        filter(event, player) {
          let storage = player.getStorage("fulingmrfz");
          return storage.target > storage.acted.length;
        },
        async content(event, trigger, player) {
          player.loseHp();
        }
      },
      purge: {
        audio: "fulingmrfz",
        forced: true,
        trigger: {
          source: "damageSource"
        },
        filter(event, player) {
          let storage = player.getStorage("fulingmrfz");
          return !storage.acted.includes("purge") && storage.target > storage.acted.length && event.player !== player;
        },
        async content(event, trigger, player) {
          let cost = game.createEvent("cost_fangzhu_fulingmrfz");
          cost.player = player;
          cost.skill = "fangzhu";
          cost.setContent(lib.skill.fangzhu.cost);
          await cost;
          if (cost.result && cost.result.bool === true && cost.result.targets) {
            game.log(player, "对", cost.result.targets[0], "发动了", "#y【放逐】");
            let content = game.createEvent("fangzhu_fangzhu_fulingmrfz");
            content.player = player;
            content.targets = cost.result.targets;
            content.setContent(lib.skill.fangzhu.content);
          }
          player.storage.fulingmrfz.acted.add("purge");
        }
      },
      education: {
        audio: "fulingmrfz",
        forced: true,
        trigger: {
          player: "useCardAfter"
        },
        filter(event, player) {
          let storage = player.getStorage("fulingmrfz");
          return !storage.acted.includes("education") && storage.target > storage.acted.length && get.type(event.card) === "equip";
        },
        async content(event, trigger, player) {
          player.storage.fulingmrfz.acted.add("education");
          game.log(player, "发动了", "#y【兴学】");
          await lib.skill.rexingxue.cost(event, trigger, player);
          if (!event.result || !event.result.targets) return;
          event.targets = event.result.targets;
          await lib.skill.rexingxue.content(event, trigger, player);
        }
      },
      cohesion: {
        audio: "fulingmrfz",
        forced: true,
        trigger: {
          global: "roundEnd"
        },
        filter(event, player) {
          let storage = player.getStorage("fulingmrfz");
          return !storage.acted.includes("cohesion") && storage.target > storage.acted.length && player.getRoundHistory("lose", (evt) => evt.type === "discard").length < 1 && player.countCards("h") > 0;
        },
        async content(event, trigger, player) {
          game.log(player, "发动了", "#y【宴如】");
          let info = lib.skill.yanru;
          let cards;
          if (player.countCards("h") % 2 === 0) {
            const result = await player.chooseCard().set("prompt", info.prompt()).set("filterCard", info.filterCard).set("selectCard", info.selectCard).set("complexCard", true).set("forced", true).set("ai", info.check).forResult();
            cards = result.cards;
          }
          let content = game.createEvent("yanru_fulingmrfz");
          content.player = player;
          content.cards = cards;
          content.setContent(info.content);
          player.storage.fulingmrfz.acted.add("cohesion");
        }
      }
    }
  }
});
translate({
  "spchuxuemrfz": "圣聆初雪",
  "spchuxuemrfz_prefix": "圣聆",
  "shengweimrfz": "圣威",
  "shengweimrfz_info": "锁定技，牌堆顶的Y张牌对你可见，你可以如手牌般使用或打出牌堆顶Y张牌中的基本牌。(Y=你本轮“覆岭”执行过的项数 + 1)",
  "fulingmrfz": "覆岭",
  "fulingmrfz_info": "每轮开始时，你可以摸至多三张牌，且本轮至多执行下列等量项，若本轮结束时，执行下列选项的数量少于你摸的牌数，你失去一点体力：<br>1.你本轮首次对其他角色造成伤害后：发动一次【放逐】;<br>2.你本轮首次使用装备牌后：发动一次【兴学】;<br>3.你本轮没有因弃置而失去过牌：发动一次【晏如】。"
});
characterTitle("spchuxuemrfz", "<font color = blue>雪镜归心</font>");
characterIntro("spchuxuemrfz", "初雪，谢拉格出身，喀兰圣女，全谢拉格的宗教领袖。在谢拉格的发展与变革历程中扮演着重要的角色，如今正着手建设谢拉格境内的基础教育系统。据部分信息报告，其在谢拉格境内曾成功驱散过一场即将降临的天灾。");
//# sourceMappingURL=spchuxuemrfz.js.map
