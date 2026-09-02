import { get, game, lib, ui } from "noname";
import { character, skill, translate, characterTitle, characterIntro } from "../hooks.js";
character("qierchakemrfz", {
  pack: "epicSJZX",
  sex: "male",
  group: "othermrfz",
  hp: 3,
  skills: ["tangongmrfz", "ruiganmrfz"]
});
skill({
  "tangongmrfz": {
    audio: 2,
    trigger: { player: ["drawBegin", "damageBegin3"] },
    init(player, skill2) {
      player.storage[skill2] = [];
    },
    filter(event, player) {
      return event.num > 0 && !player.storage.tangongmrfz.includes(event.name);
    },
    createDialog(id2, showCards) {
      var dialog = ui.create.dialog("hidden");
      (dialog.textPrompt = dialog.add("探宫")).style.textAlign = "center";
      dialog.cards = [];
      dialog.rawButtons = [];
      dialog.videoId = id2;
      var cards = [];
      for (var y = 0; y < 3; y++) {
        for (var x = 0; x < 3; x++) {
          var card = ui.create.card(null, null, true);
          card.pos = y * 3 + x;
          card.pos_x = x;
          card.pos_y = y;
          cards.push(card);
          dialog.rawButtons.push(card);
        }
        dialog.add(cards);
        cards = [];
      }
      for (var i of dialog.buttons) {
        i.pos_x = i.link.pos_x;
        i.pos_y = i.link.pos_y;
        i.link = i.link.pos;
      }
      showCards = showCards ? showCards : game.cardsGotoOrdering(get.cards(9)).cards;
      showCards.map((i2) => i2.tangongmrfz = true);
      dialog.addAuto("待选择的牌");
      dialog.showCards = showCards;
      dialog.add(showCards);
      dialog.open();
    },
    addCard(card, id2, pos) {
      var dialog = get.idDialog(id2);
      if (!dialog) return;
      for (var i = 0; i < dialog.buttons.length; i++) {
        var button = dialog.buttons[i];
        if (button.link == pos) {
          var card2 = ui.create.button(card, "card");
          card2.pos = button.link;
          card2.pos_x = button.pos_x;
          card2.pos_y = button.pos_y;
          card2.classList.add("noclick");
          button.parentNode.insertBefore(card2, button);
          dialog.cards.push(card2);
          button.remove();
          dialog.buttons.splice(i, 1);
        } else if (get.itemtype(button.link) == "card") {
          if (button.link == card) {
            button.remove();
            dialog.showCards.remove(card);
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
      function isValid(matrix2, row, col, value) {
        for (let i = 0; i < col; i++) {
          if (matrix2[row][i] === value) {
            return false;
          }
        }
        for (let i = 0; i < row; i++) {
          if (matrix2[i][col] === value) {
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
        for (let i = 0; i < suits2.length; i++) {
          let suit = suits2[i];
          if (isValid(matrix2, row, col, suit)) {
            matrix2[row][col] = suit;
            let remainingSuits = suits2.slice(0, i).concat(suits2.slice(i + 1));
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
    async content(event, trigger, player) {
      if (!player.storage.tangongmrfz) player.storage.tangongmrfz = [];
      player.storage.tangongmrfz.add(trigger.name);
      let autoMode = false;
      const { bool } = await player.chooseBool(`是否让系统帮你组方阵？`).set("ai", () => true).forResult();
      if (bool) autoMode = true;
      let next = game.createEvent("cardsGotoOrdering");
      next.cards = [];
      next.setContent("cardsGotoOrdering");
      event.videoId = lib.status.videoId++;
      event.forceDie = true;
      event.cards = [];
      event.positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      let showCards = game.cardsGotoOrdering(get.cards(12)).cards;
      game.broadcastAll(
        function(id2, showCards2) {
          lib.skill.tangongmrfz.createDialog(id2, showCards2);
        },
        event.videoId,
        showCards.slice()
      );
      let autoSelected = lib.skill.tangongmrfz.getValidMatrix(showCards.slice().map((i) => get.suit(i)));
      let cards = [];
      while (showCards.length > 0) {
        let str = "请将一张牌放置到方阵中";
        if (player == game.me || player.isUnderControl()) {
          lib.skill.tangongmrfz.changePrompt(str, event.videoId);
        } else if (player.isOnline()) {
          player.send(
            function(str2, id2) {
              lib.skill.tangongmrfz.changePrompt(str2, event.videoId);
            },
            str,
            id
          );
        }
        let links;
        if ((player.isUnderControl() || game.me == player) && !autoMode) {
          const result1 = await player.chooseButton().set("filterOk", (button) => {
            const selected = ui.selected.buttons.slice().map((i) => get.itemtype(i.link) || typeof i.link);
            return selected.includes("card") && selected.includes("number");
          }).set("dialog", event.videoId).set("filterButton", function(button) {
            return true;
          }).set("selectButton", 2).set("autoSelected", autoSelected).set("showCards", showCards).set("cards", cards.slice()).forResult();
          links = result1.links;
        } else {
          if (!autoSelected) {
            player.popup("探索失败");
            game.broadcastAll("closeDialog", event.videoId);
            return;
          }
          let posx = cards.slice(0).map((i) => i[1]);
          links = [];
          let selectedList = [...autoSelected[0], ...autoSelected[1], ...autoSelected[2]];
          for (let i = 0; i < 9; i++) {
            if (posx.includes(i)) continue;
            let getValidSuit = showCards.filter((j) => get.suit(j) == selectedList[i])[0];
            links.push(getValidSuit, i);
            break;
          }
        }
        if (!links) {
          player.popup("探索失败");
          game.broadcastAll("closeDialog", event.videoId);
          return;
        }
        let pos = links.filter((i) => typeof i == "number")[0], tranCard = links.filter((i) => get.itemtype(i) == "card")[0];
        game.broadcastAll(
          function(card, id2, pos2, player2) {
            lib.skill.tangongmrfz.addCard(card, id2, pos2);
            lib.skill.tangongmrfz.changePrompt(get.translation(player2) + "放置了" + get.translation(card), id2);
          },
          tranCard,
          event.videoId,
          pos,
          player
        );
        let { promise, resolve } = Promise.withResolvers();
        setTimeout(() => {
          resolve(true);
        }, 1e3);
        await promise;
        cards.push([tranCard, pos]);
        showCards.remove(tranCard);
        if (cards.length > 8) {
          game.broadcastAll("closeDialog", event.videoId);
          break;
        }
      }
      const suits = cards.map((i) => [get.suit(i[0]), i[1]]);
      const matrix = Array.from({ length: 3 }, () => Array(3));
      suits.forEach(([suit, index]) => matrix[Math.floor(index / 3)][index % 3] = suit);
      const hasDuplicates = matrix.some((row, i) => new Set(row).size < 3 || new Set(matrix.map((r) => r[i])).size < 3);
      if (!hasDuplicates) {
        const isDraw = trigger.name === "draw" ? true : false;
        const { control } = await player.chooseControl(`减半`, `翻倍`).set("prompt", `令${trigger.name === "draw" ? "摸牌数" : "伤害值"}(${trigger.num})翻倍或减半`).set("ai", () => {
          return get.event().isDraw ? "翻倍" : "减半";
        }).set("isDraw", isDraw).forResult();
        trigger.num = control === `翻倍` ? trigger.num * 2 : Math.floor(trigger.num / 2);
      }
    },
    group: "tangongmrfz_clear",
    subSkill: {
      clear: {
        charlotte: true,
        silent: true,
        lastDo: true,
        trigger: { global: "phaseEnd" },
        filter(event, player) {
          return player.storage.tangongmrfz;
        },
        async content(event, trigger, player) {
          player.storage.tangongmrfz = [];
        }
      }
    },
    ai: {
      threaten: 1.5
    }
  },
  "ruiganmrfz": {
    audio: 2,
    trigger: {
      global: "useCard1"
    },
    forced: true,
    filter(event, player) {
      return get.cardNameLength(event.card) == player.countCards("h") && event.targets.includes(player) && event.player != player;
    },
    async content(event, trigger, player) {
    },
    mod: {
      targetEnabled(card, player, target) {
        if (get.cardNameLength(card) == target.countCards("h") && player != target) return false;
      }
    }
  }
});
translate({
  "qierchakemrfz": "奇尔查克",
  "tangongmrfz": "探宫",
  "tangongmrfz_info": "每回合每项限一次，当你摸牌时，或你受到伤害时，你可以展示牌堆顶12张牌并把这些牌放置成一个三行三列的方阵，若该方阵的每行每列上的牌的花色均不相同，你令该时机的数值翻倍或减半（向下取整）。",
  "ruiganmrfz": "锐感",
  "ruiganmrfz_info": "锁定技，你不能成为其他角色使用的牌名字数等同于你的手牌数的牌的目标。"
});
characterTitle("qierchakemrfz", "<font color='#b8860b'>资深陷阱专家</font>");
characterIntro("qierchakemrfz", "齐尔查克在莱欧斯小队中负责以敏锐的五感探寻各类陷阱，保障小队的生命安全。现来罗德岛寻找返回原本所在地的方法，并在罗德岛作战任务中提供地形探查、陷阱感知等帮助。");
