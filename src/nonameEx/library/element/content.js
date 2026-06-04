import { game, _status, ui, get, ai } from "noname";
const ContentExt = {
  chooseCardHand: [
    /**@type {ContentFuncByAll} */
    async function(event, trigger, player) {
      if (event.directresult) {
        event.result = {
          buttons: [],
          cards: event.directresult.slice(0),
          targets: [],
          confirm: "ok",
          bool: true,
          links: []
        };
      } else if (event.autochoose()) {
        event.result = {
          bool: true,
          autochoose: true,
          cards: player.getCards(event.position),
          confirm: "ok",
          buttons: [],
          targets: [],
          links: []
        };
      } else {
        if (event.cards) {
          player.directgain(event.cards);
          const copy = event.filterCard;
          event.filterCard = function(card, player2, target) {
            return event.cards.includes(card) && copy.apply(this, arguments);
          };
        }
        if (event.isMine()) {
          game.check();
          game.pause();
          if (event.hsskill && !event.forced && _status.prehidden_skills.includes(event.hsskill)) {
            ui.click.cancel();
            return;
          }
          ui.create.cardChooseAll();
          if (event.prompt != false) {
            var str;
            if (typeof event.prompt == "string") {
              str = event.prompt;
            } else {
              str = "请选择";
              var range = get.select(event.selectCard);
              if (range[0] == range[1]) {
                str += get.cnNumber(range[0]);
              } else if (range[1] == Infinity) {
                str += "至少" + get.cnNumber(range[0]);
              } else {
                str += get.cnNumber(range[0]) + "至" + get.cnNumber(range[1]);
              }
              str += "张";
              if (event.position == "h" || event.position == void 0) {
                str += "手";
              }
              if (event.position == "e") {
                str += "装备";
              }
              str += "牌";
            }
            event.dialog = ui.create.dialog(str);
            if (event.prompt2) {
              event.dialog.addText(event.prompt2, event.prompt2.length <= 20);
            }
            if (Array.isArray(event.promptx)) {
              for (var i = 0; i < event.promptx.length; i++) {
                event.dialog.add(event.promptx[i]);
              }
            }
            if (Array.isArray(event.selectCard)) {
              event.promptbar = event.dialog.add("0/" + get.numStr(event.selectCard[1], "card"));
              event.custom.add.card = function() {
                _status.event.promptbar.innerHTML = ui.selected.cards.length + "/" + get.numStr(_status.event.selectCard[1], "card");
              };
            }
          }
        } else if (event.isOnline()) event.send();
        else event.result = "ai";
      }
    },
    async function(event, trigger, player) {
      if (event.result == "ai") {
        game.check();
        if ((ai.basic.chooseCard(event.ai) || event.forced) && (!event.filterOk || event.filterOk())) {
          ui.click.ok();
        } else if (event.skill) {
          var skill = event.skill;
          ui.click.cancel();
          event._aiexclude.add(skill);
          event.redo();
          game.resume();
        } else {
          ui.click.cancel();
        }
      }
    },
    /**@type {ContentFuncByAll} */
    async function(event, trigger, player) {
      event.resume();
      event.cards.forEach((card) => card.delete());
      if (event.cardChooseAll) {
        event.cardChooseAll.close();
      }
      if (event.glow_result && event.result.cards && !event.directresult) {
        for (var i = 0; i < event.result.cards.length; i++) {
          event.result.cards[i].classList.add("glow");
        }
      }
      if (event.dialog) {
        event.dialog.close();
      }
    }
  ]
};
export {
  ContentExt
};
//# sourceMappingURL=content.js.map
