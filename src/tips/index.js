import { onSetDev } from "../hooks/index.js";
import { lib, game, get, ui } from "noname";
class WhichWayTips {
  registerHook(name, fn) {
    if (!fn) fn = this._hookTriggerDefaultFunc;
    if (this.triggerHooks[name]) {
      console.warn(`[WhichWayTips] hook ${name} already registered`);
      return;
    }
    this.triggerHooks[name] = fn;
    if (lib.hooks[name]) lib.hooks[name].push((...args) => fn(name, ...args));
    else throw new Error(`[WhichWayTips] hook ${name} not found`);
  }
  _hookTriggerDefaultFunc(triggerName, ...args) {
    const [event] = args;
    if (!event) return;
    const pendingDelete = {
      player: [],
      card: []
    };
    const prompts = whichWayTips.autoDelPrompt;
    if (Object.keys(prompts.card).length === 0 && Object.keys(prompts.player).length === 0) return;
    for (const char of game.players.concat(game.dead)) {
      for (const id in prompts.player) {
        const playerPrompt = prompts.player[id];
        if (typeof playerPrompt === "function") {
          if (playerPrompt(event, triggerName, char)) {
            whichWayTips.removePrompt(char, id);
            pendingDelete.player.add(id);
          }
        } else if (playerPrompt === true) {
          whichWayTips.removePrompt(char, id);
          pendingDelete.player.add(id);
        }
      }
      for (const card of char.getCards("h")) {
        for (const id in prompts.card) {
          const cardPrompt = prompts.card[id];
          if (typeof cardPrompt === "function") {
            if (cardPrompt(event, triggerName, char)) {
              whichWayTips.removePrompt(card, id);
              pendingDelete.card.add(id);
            }
          } else if (cardPrompt === true) {
            whichWayTips.removePrompt(card, id);
            pendingDelete.card.add(id);
          }
        }
      }
    }
    if (pendingDelete.player.length) {
      pendingDelete.player.forEach((id) => {
        delete prompts.player[id];
      });
    }
    if (pendingDelete.card.length) {
      pendingDelete.card.forEach((id) => {
        delete prompts.card[id];
      });
    }
  }
  getID(el) {
    return get.itemtype(el) === "player" ? el.playerid : el.cardid;
  }
  registerDel(el, del, id, filter) {
    const isPlayer = this.isPlayer(el);
    this.autoDelPrompt ??= { player: {}, card: {} };
    this.autoDelPrompt[isPlayer ? "player" : "card"][id] = filter || true;
    if (!this.triggerHooks[del]) this.registerHook(del);
  }
  isPlayer = (el) => get.itemtype(el) === "player";
  addPrompt(el, str, id, del) {
    const isPlayer = this.isPlayer(el);
    const prompts = this[isPlayer ? "promptsPlayer" : "promptsCard"];
    const elID = this.getID(el);
    prompts[elID] ??= {};
    let wrapper = el.querySelector(".promptSJZX-Wrapper") || ui.create.div(".promptSJZX-Wrapper", el);
    if (id && prompts[elID]?.[id]) {
      prompts[elID][id].innerHTML = str;
      if (del) this.registerDel(el, del, id);
      return el;
    }
    let info = ui.create.div(".promptSJZX", wrapper);
    info.classList.add(isPlayer ? "promptCharacterSJZX" : "promptCardSJZX");
    info.innerHTML = str;
    prompts[elID][id || str] = info;
    if (del) this.registerDel(el, del, id || str);
    return el;
  }
  removePrompt(el, id) {
    const isPlayer = this.isPlayer(el);
    const prompts = this[isPlayer ? "promptsPlayer" : "promptsCard"];
    const elID = this.getID(el);
    prompts[elID] ??= {};
    let targets = el.querySelectorAll(".promptSJZX");
    if (!targets) return el;
    else if (typeof id !== "string")
      targets.forEach((i) => {
        for (let key in prompts) {
          if (prompts[elID][key] === i) {
            delete prompts[elID][key];
          }
        }
        i.remove();
      });
    else {
      if (prompts[elID][id]) {
        prompts[elID][id].remove();
        delete prompts[elID][id];
      }
    }
    if (!Object.keys(prompts[elID]).length) delete prompts[elID];
    return el;
  }
  promptsCard = {};
  promptsPlayer = {};
  autoDelPrompt = {
    player: {},
    card: {}
  };
  //@ts-ignore
  triggerHooks = {};
}
const whichWayTips = new WhichWayTips();
onSetDev({
  name: "WhichWayTips_dev",
  fn() {
    window.whichWayTips = whichWayTips;
  }
});
window.whichWay.register("tips", whichWayTips);
export {
  whichWayTips
};
