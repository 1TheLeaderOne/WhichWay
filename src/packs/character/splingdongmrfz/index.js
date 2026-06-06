import { character, characterTitle, characterIntro, translate, skill } from "../../hooks.js";
import { game, get, ui } from "noname";
character("splingdongmrfz", {
  sex: "female",
  group: "wumrfz",
  skills: ["fuchaomrfz"],
  pack: "legendSJZX",
  hp: 5
});
characterTitle("splingdongmrfz", "<font color = red>万众巨潮</font>");
characterIntro("splingdongmrfz", "凛冬，乌萨斯学生自治团团长，加入罗德岛后长期担任作战小队队长，并在近期协助罗德岛于圣骏堡建立办事处，作出重要贡献。凛冬在长期训练和高频次战斗中精进自身实力，形成了独特且成熟的战斗风格，现作为近卫干员参与罗德岛在乌萨斯的行动。");
translate({
  splingdongmrfz: "怒潮凛冬",
  splingdongmrfz_prefix: "怒潮",
  fuchaomrfz: "负潮",
  "fuchaomrfz_info": "锁定技，摸牌阶段，你改为至多卜算X（X至多为8），然后你于结束阶段将2^X张牌当作【戮力同心】使用，若你的手牌不足，你依次执行下列项直到补足所需牌数：<br>1.横置你的武将牌，以所有横置角色的牌做补充;<br>2.以牌堆的牌做补充;<br>3.改为视为使用。<br>然后你须对Y名角色造成一点火焰伤害，且自己必须是目标之一（Y=执行的项数）。"
});
skill({
  fuchaomrfz: {
    audio: ["选中干员1", "作战中2", "行动出发", "行动开始"],
    trigger: { player: "phaseDrawBefore" },
    filter(event, player, name, target) {
      return !player.skipList.includes("phaseDraw");
    },
    onremove: true,
    forced: true,
    async content(event, trigger, player) {
      const { numbers } = await player.chooseNumbers({
        forced: true,
        list: [{
          prompt: "【负潮】:你至多卜算8",
          min: 1,
          max: 8
        }],
        processAI(event2) {
          return [8];
        }
      }).forResult();
      const num = numbers[0];
      player.storage.fuchaomrfz = num;
      await player.chooseToGuanxing(num);
      await player.draw(num);
      trigger.cancel();
      player.addTip("fuchaomrfz_tips", `负潮${Math.pow(2, player.getStorage("fuchaomrfz"))}`, true);
      player.when({ player: "phaseJieshuBegin", global: "phaseEnd" }).step(async (event2, trigger2, player2) => {
        if (trigger2.triggername === "phaseEnd") {
          return;
        }
        const pow = Math.pow(2, player2.storage.fuchaomrfz);
        let num2 = 0, count = 0, cards = [];
        player2.storage.fuchaomrfz = 0;
        player2.removeTip("fuchaomrfz_tips");
        if (player2.countCards("he") >= pow) {
          const result = await player2.chooseCard({
            position: "he",
            filterCard: true,
            selectCard() {
              return [pow, pow];
            },
            prompt: `【负潮】:请选择${pow}张牌当【戮力同心】使用`,
            forced: true
          }).forResult();
          if (!result.cards) return;
          await use(result.cards);
          return;
        } else {
          num2 += 1;
          cards.push(...player2.getCards("he"));
        }
        player2.link(true);
        for (let char of game.players) {
          if (char.isLinked()) {
            count += char.countCards("he");
          }
        }
        if (count >= pow) {
          for (let char of game.players) {
            if (char.isLinked() && char !== player2 && char.countCards("he") > 0) {
              const result = await player2.chooseCard({
                forced: true,
                position: "he",
                selectCard() {
                  const player3 = get.player();
                  const current = get.event().currentNum;
                  const target = get.event().targetNum;
                  return current + player3.getCards("he").length > target ? target - current : player3.getCards("he").length;
                },
                ai(card) {
                  return -get.value(card);
                },
                prompt: `【负潮】:请选择${count}张牌，${get.translation(player2)}将这些牌当作【戮力同心】使用`
              }).set("currentNum", pow).set("targetNum", cards.length).forResult();
              if (result.cards && result.cards.length > 0) {
                cards.push(...result.cards);
              }
            }
          }
          await use(cards);
          await allocate(num2);
          return;
        } else {
          num2 += 1;
          for (let char of game.players) {
            if (char !== player2 && char.isLinked()) {
              cards.push(...char.getCards("he"));
            }
          }
        }
        if (cards.length + ui.cardPile.childNodes.length >= pow) {
          const count2 = pow - cards.length;
          cards.push(...get.cards(count2));
          await use(cards);
          await allocate(num2);
        } else {
          num2 += 1;
        }
        await player2.chooseUseTarget({
          card: get.autoViewAs({ name: "lulitongxin" }),
          forced: true
        });
        await allocate(num2);
        async function use(cards2) {
          return await player2.chooseUseTarget({
            card: get.autoViewAs({ name: "lulitongxin" }),
            cards: cards2,
            forced: true
          });
        }
        async function allocate(num3) {
          if (num3 < 1) return;
          const result = await player2.chooseTarget({
            prompt: `【负潮】：分配至多${get.cnNumber(num3)}点火焰伤害，且自己必须是目标之一`,
            forced: true,
            filterTarget: () => true,
            selectTarget: num3,
            ai(target) {
              const player3 = get.player();
              if (target === player3) return 1145141919810;
              return get.damageEffect(target, player3, player3, "fire");
            }
          }).set("filterOk", () => {
            return ui.selected.targets.includes(get.player());
          }).forResult();
          if (result.targets) {
            result.targets.forEach((target) => {
              target.damage({
                source: player2,
                num: 1,
                nature: "fire"
              });
            });
          }
        }
      }).translation("负潮").assign({
        mark: true,
        intro: {
          content(storage, player2, skill2) {
            return `·结束阶段，你将${Math.pow(2, player2.getStorage("fuchaomrfz"))}当作【戮力同心】使用`;
          }
        }
      });
    }
  }
});
//# sourceMappingURL=index.js.map
