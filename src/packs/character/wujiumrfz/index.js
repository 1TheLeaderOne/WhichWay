import { character, translate, characterIntro, characterTitle, skill } from "../../hooks.js";
import { get, ui, game } from "noname";
character("wujiumrfz", {
  hp: 3,
  skills: ["jiedoumrfz", "nijimrfz"],
  pack: "epicSJZX",
  group: "wumrfz",
  sex: "female"
});
translate({
  wujiumrfz: "乌啾",
  // tatumrfz:"他途",
  // "tatumrfz_info":`连招技（非基本牌+【杀】+【${whichWayUtil.colorize("#r杀#")}】），当你使用的下一张牌结算完毕后，你将本技能描述中的红色部分替换为此牌的牌名;当你使用牌后，你可以中断此技能的连招以视为使用后项（无距离次数限制）。`,
  jiedoumrfz: "街斗",
  jiedoumrfz_info: "出牌阶段限一次，你可以弃置至少一张牌，对等量角色造成一点伤害并获得其一张手牌，然后这些角色可以弃置等量张牌对你造成一点伤害。",
  nijimrfz: "匿迹",
  nijimrfz_info: "当你于每轮第一次受到一名角色的伤害后，你可以摸三张牌，然后本回合当其对你造成伤害时，取消之。"
});
characterIntro("wujiumrfz", "乌啾，曾作为地下组织“无缚者同盟”成员在乌萨斯圣骏堡活动，后经干员凛冬介绍加入罗德岛驻圣骏堡办事处，参与情报搜集及急救工作。按照其监护人烈夏要求，乌啾定期前往罗德岛总部接受矿石病治疗及通识教育。");
characterTitle("wujiumrfz", "<font color = #236ccc66>我最好的朋友</font>");
skill({
  // tatumrfz:{
  //     audio:["任命队长","选中干员2"],
  //     comboSkill:true,
  //     trigger:{
  //         player:"useCard"
  //     },
  //     init(player,skill){
  //         player.storage[skill] = ["nobasic","sha","sha"];
  //     },
  //     onremove:true,
  //     filter(event,player){
  //         const evt2 = getLastUsed(player,event,2);
  //         const evt1 = getLastUsed(player,event);
  //         return (evt2 && evt2.card && get.type(evt2.card)!=="basic") && (evt1 && evt1.card && get.name(evt1.card) === "sha" && !evt1.tatumrfz_break) && (get.name(event.card) === player.storage?.["tatumrfz"][2] && !event.tatumrfz_break);
  //     },
  //     async content(event,trigger,player){
  //         trigger.tatumrfz_break = true;
  //         player.when({player:"useCardAfter"})
  //             .filter((event,player)=>{
  //                 return event.card !== trigger.card;
  //             })
  //             .step(async (event,trigger,player)=>{
  //                 if(!Array.isArray(player.storage["tatumrfz"])){
  //                     lib.skill.tatumrfz.init!(player,"tatumrfz");
  //                 }
  //                 player.storage["tatumrfz"][2] = get.name(trigger.card);
  //             })
  //     },
  //     group:"tatumrfz_break",
  //     subSkill:{
  //         break:{
  //             audio:"tatumrfz",
  //             firstDo:true,
  //             trigger:{player:"useCard"},
  //             filter(event,player){
  //                 //禁止插结
  //                 if(event.card.storage["tatumrfz_notrigger"] === true) return false;
  //                 //进度不能为第三张，因为没有后一项
  //                 const evt2 = getLastUsed(player,event,2);
  //                 const evt1 = getLastUsed(player,event);
  //                 return !((evt2 && evt2.card && get.type(evt2.card)!=="basic") && (evt1 && evt1.card && get.name(evt1.card) === "sha" && !evt1.tatumrfz_break) && (get.name(event.card) === player.storage?.["tatumrfz"][2] && !event.tatumrfz_break));
  //             },
  //             async cost(event,trigger,player){
  //                 //定位当前连招进度
  //                 const evt2 = getLastUsed(player,trigger,2);
  //                 const evt1 = getLastUsed(player,trigger);
  //                 let index;
  //                 //进度为第二张
  //                 if((evt1 && evt1.card && get.type(evt1.card)!=="basic") && (get.name(trigger.card) === player.storage?.["tatumrfz"][1] && !trigger.tatumrfz_break)){
  //                     index = 2;
  //                 }
  //                 //进度为第一张
  //                 else {
  //                     index = 1;
  //                 }
  //                 //判断是否能使用此牌
  //                 if(!player.hasUseTarget(player.storage["tatumrfz"][index],false,false)){
  //                     return;
  //                 }
  //                 event.result = await player.chooseBool({
  //                     prompt:`【他途】:是否中断连招以视为使用一张【${get.translation(player.storage["tatumrfz"][index])}】？`,
  //                     ai(event, player) {
  //                         return true;
  //                     },
  //                 }).forResult();
  //             },
  //             async content(event,trigger,player){
  //                 const evt2 = getLastUsed(player,trigger,2);
  //                 const evt1 = getLastUsed(player,trigger);
  //                 let index;
  //                 //进度为第二张
  //                 if((evt1 && evt1.card) && (get.name(trigger.card) === player.storage?.["tatumrfz"][1] && !trigger.tatumrfz_break)){
  //                     index = 2;
  //                 }
  //                 //进度为第一张
  //                 else {
  //                     index = 1;
  //                 }
  //                 trigger.tatumrfz_break = true;
  //                 const card = get.autoViewAs({name:player.storage["tatumrfz"][index],storage:{tatumrfz_notrigger:true}})
  //                 player.chooseUseTarget({
  //                     card:card,
  //                     forced:true,
  //                     addCount:false,
  //                     nodistance:true,
  //                 });
  //             },
  //         },
  //     },
  // },
  jiedoumrfz: {
    audio: ["作战中1", "作战中2", "作战中3", "作战中4"],
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
      return game.hasPlayer((char) => char !== player && char.isIn()) && player.countCards("he") > 0;
    },
    filterTarget: true,
    selectTarget: () => {
      return ui.selected.cards.length;
    },
    complexCard: true,
    complexSelect: true,
    multitarget: true,
    multiline: true,
    filterCard: true,
    selectCard: [1, Infinity],
    check(card) {
      const player = get.player();
      if (ui.selected.cards.length >= game.countPlayer((char) => get.damageEffect(char, player, player) > 0)) return -1;
      return 8 - get.value(card);
    },
    async content(event, trigger, player) {
      const { cards, targets } = event;
      for (let target of targets) {
        await target.damage({ source: player, num: 1 });
        if (target.countGainableCards(player, "h") > 0) {
          await player.gainPlayerCard({
            target,
            forced: true,
            position: "h"
          });
        }
        const result = await target.chooseToDiscard({
          prompt: `【街斗】:你可以弃置${cards.length}张牌对${get.translation(player)}造成一点伤害`,
          selectCard: cards.length,
          ai(card) {
            const player2 = get.player(), target2 = get.event().targetx;
            if (get.damageEffect(target2, player2, player2) <= 0) return -1;
            return 6 - get.value(card);
          }
        }).set("targetx", player).forResult();
        if (result.bool) {
          player.damage({ source: target });
        }
      }
    },
    ai: {
      order: 13,
      result: {
        target(player, target) {
          return -1;
        }
      }
    }
  },
  nijimrfz: {
    audio: ["任命队长", "选中干员2"],
    trigger: {
      player: "damageEnd"
    },
    frequent: true,
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    onremove: true,
    mark: true,
    intro: {
      content(storage, player) {
        const source = player.getRoundHistory("damage", (evt) => evt.player === player && !!evt.source).map((evt) => evt.source);
        return `·本轮对你造成过伤害的角色：${source.length > 0 ? source.map((s) => get.translation(s)).join("、") : "无"}` + (storage.length < 1 ? "" : `<br>·本回合无法对你造成伤害的角色：${storage.map((s) => get.translation(s)).join("、")}`);
      }
    },
    filter(event, player, name, target) {
      return !getTriggered(player).includes(event.source);
    },
    async content(event, trigger, player) {
      player.draw(3);
      player.storage.nijimrfz ??= [];
      player.storage.nijimrfz.add(trigger.source);
    },
    group: "nijimrfz_effect",
    subSkill: {
      effect: {
        charlotte: true,
        silent: true,
        trigger: {
          player: "damageBegin",
          global: "phaseEnd"
        },
        filter(event, player) {
          return event.name === "phase" || player.getStorage("nijimrfz").includes(event.source);
        },
        async content(event, trigger, player) {
          if (trigger.name === "phase") {
            player.storage["nijimrfz"] = [];
          } else {
            player.logSkill("nijimrfz");
            trigger.cancel();
          }
        }
      }
    },
    ai: {
      maixue: true,
      effect: {
        target(card, player, target) {
          if (player.getStorage("nijimrfz").includes(target) && get.tag(card, "damage") > 0) {
            return "zeroplayertarget";
          }
        }
      }
    }
  }
});
function getTriggered(player) {
  const source = player.getRoundHistory("damage", (evt) => evt.player === player && !!evt.source).map((evt) => evt.source);
  const countMap = /* @__PURE__ */ new Map();
  for (const s of source) {
    countMap.set(s, (countMap.get(s) || 0) + 1);
  }
  return [...new Set(source)].filter((s) => (countMap.get(s) ?? 0) > 1);
}
//# sourceMappingURL=index.js.map
