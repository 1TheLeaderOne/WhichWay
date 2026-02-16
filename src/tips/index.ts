import { onArenaReady, onSetDev } from "../hooks/index.js";
import { lib, game, ui, get, ai, _status } from "noname";

type autoDelPrompt = Record<string, Record<delTrigger, Array<string>>>;
type delTrigger = "addGroup" | "addNature" | "checkBegin" | "checkCard" | "checkTarget" | "checkButton" | "checkEnd" | "uncheckBegin" | "uncheckCard" | "uncheckTarget" | "uncheckButton" | "uncheckEnd" | "checkOverflow" | "checkTipBottom" | "checkDamage1" | "checkDamage2" | "checkDamage3" | "checkDamage4" | "checkDie" | "checkUpdate" | "checkSkillAnimate" | "addSkillCheck" | "removeSkillCheck" | "refreshSkin";

class WhichWayTips {
	registerHook(name: delTrigger, fn?: (...args: any) => any) {
		if (!fn) fn = this._hookTriggerDefaultFunc;
		if (this.triggerHooks[name]) {
			console.warn(`[WhichWayTips] hook ${name} already registered`);
			return;
		}
		this.triggerHooks[name] = fn;
		if (lib.hooks[name]) lib.hooks[name].push((...args) => fn(name, ...args));
		else throw new Error(`[WhichWayTips] hook ${name} not found`);
	}

	private _hookTriggerDefaultFunc(triggerName: delTrigger, ...args: [GameEvent, Card, Player]) {
		const [event] = args;
		if (!event) return;
		const { player, name } = event;
		if (player) {
			//自动删除player的prompt
			const id = whichWayTips.getID(player);
			if (whichWayTips.autoDelPrompt[id]) {
				if (whichWayTips.autoDelPrompt[id][triggerName]) whichWayTips.autoDelPrompt[id][triggerName].forEach(i => whichWayTips.removePrompt(player, i));
			}

			//自动删除card的prompt
			for (const card of player.getCards("h")) {
				const id = whichWayTips.getID(card);
				if (!whichWayTips.autoDelPrompt[id]) continue;
				if (whichWayTips.autoDelPrompt[id][triggerName]) whichWayTips.autoDelPrompt[id][triggerName].forEach(i => whichWayTips.removePrompt(card, i));
			}
		}
	}

	getID(el: Card | Player): string {
		//@ts-ignore
		return get.itemtype(el) === "player" ? el.playerid : el.cardid;
	}

	registerDel(el: Card | Player, del: delTrigger, id: string) {
		const elID = this.getID(el);
		//@ts-ignore
		this.autoDelPrompt[elID] ??= {};
		this.autoDelPrompt[elID][del] ??= [];
		this.autoDelPrompt[elID][del].push(id);

		if (!this.triggerHooks[del]) this.registerHook(del);
	}

	addPrompt(el: Card | Player, str: string, id?: string, del?: delTrigger): Card | Player {
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

	removePrompt(el: Card | Player, id?: string): Card | Player {
		const isPlayer = get.itemtype(el) === "player";
		const prompts = this[isPlayer ? "promptsPlayer" : "promptsCard"];
		const elID = this.getID(el);
		prompts[elID] ??= {};

		let targets = el.querySelectorAll(".promptSJZX");
		if (!targets) return el;
		else if (typeof id !== "string")
			targets.forEach(i => {
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

	promptsCard: Record<string, Record<string, HTMLElement>> = {};

	promptsPlayer: Record<string, Record<string, HTMLElement>> = {};

	autoDelPrompt: autoDelPrompt = {};

	//@ts-ignore
	triggerHooks: Record<delTrigger, Function> = {};
}

export const whichWayTips = new WhichWayTips();

onSetDev({
	name: "WhichWayTips_dev",
	fn() {
		//@ts-ignore
		window.whichWayTips = whichWayTips;
	},
});

window.whichWay.register("tips", whichWayTips);
