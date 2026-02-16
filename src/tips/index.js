import { onSetDev } from "../hooks/index.js";
import { lib, get, ui } from "noname";
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
    const { player, name } = event;
    if (player) {
      const id = whichWayTips.getID(player);
      if (whichWayTips.autoDelPrompt[id]) {
        if (whichWayTips.autoDelPrompt[id][triggerName]) whichWayTips.autoDelPrompt[id][triggerName].forEach((i) => whichWayTips.removePrompt(player, i));
      }
      for (const card of player.getCards("h")) {
        const id2 = whichWayTips.getID(card);
        if (!whichWayTips.autoDelPrompt[id2]) continue;
        if (whichWayTips.autoDelPrompt[id2][triggerName]) whichWayTips.autoDelPrompt[id2][triggerName].forEach((i) => whichWayTips.removePrompt(card, i));
      }
    }
  }
  getID(el) {
    return get.itemtype(el) === "player" ? el.playerid : el.cardid;
  }
  registerDel(el, del, id) {
    const elID = this.getID(el);
    this.autoDelPrompt[elID] ??= {};
    this.autoDelPrompt[elID][del] ??= [];
    this.autoDelPrompt[elID][del].push(id);
    if (!this.triggerHooks[del]) this.registerHook(del);
  }
  addPrompt(el, str, id, del) {
    const isPlayer = get.itemtype(el) === "player";
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
    const isPlayer = get.itemtype(el) === "player";
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
  autoDelPrompt = {};
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
//# sourceMappingURL=index.js.map
