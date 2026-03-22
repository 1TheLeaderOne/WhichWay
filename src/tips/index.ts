import { onArenaReady, onSetDev } from "../hooks/index.js";
import { lib, game, ui, get, ai, _status } from "noname";

type delPromptFitler = boolean | ((event: GameEvent, trigger: delTrigger, player: Player) => boolean);

type autoDelPrompt = {
	card: Record<string, delPromptFitler>;
	player: Record<string, delPromptFitler>;
};
type delTrigger =
	| "addGroup"
	| "addNature"
	| "checkBegin"
	| "checkCard"
	| "checkTarget"
	| "checkButton"
	| "checkEnd"
	| "uncheckBegin"
	| "uncheckCard"
	| "uncheckTarget"
	| "uncheckButton"
	| "uncheckEnd"
	| "checkOverflow"
	| "checkTipBottom"
	| "checkDamage1"
	| "checkDamage2"
	| "checkDamage3"
	| "checkDamage4"
	| "checkDie"
	| "checkUpdate"
	| "checkSkillAnimate"
	| "addSkillCheck"
	| "removeSkillCheck"
	| "refreshSkin";

class WhichWayTips {
	registerHook(name: delTrigger, fn?: (triggerName: delTrigger, ...args: [GameEvent, Card, Player, any]) => any) {
		if (!fn) fn = this._hookTriggerDefaultFunc;
		if (this.triggerHooks[name]) {
			console.warn(`[WhichWayTips] hook ${name} already registered`);
			return;
		}
		this.triggerHooks[name] = fn;
		//@ts-ignore
		if (lib.hooks[name]) lib.hooks[name].push((...args) => fn(name, ...args));
		else throw new Error(`[WhichWayTips] hook ${name} not found`);
	}

	private _hookTriggerDefaultFunc(triggerName: delTrigger, ...args: [GameEvent, Card, Player]) {
		const [event] = args;
		if (!event) return;
		const pendingDelete:Record<"player" | "card", Array<string>> = {
			player:[],
			card:[]
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
			pendingDelete.player.forEach(id=>{
				delete prompts.player[id];
			})
		}
		if(pendingDelete.card.length){
			pendingDelete.card.forEach(id=>{
				delete prompts.card[id];
			})
		}
	}

	getID(el: Card | Player): string {
		//@ts-ignore
		return get.itemtype(el) === "player" ? el.playerid : el.cardid;
	}

	registerDel(el: Card | Player, del: delTrigger, id: string, filter?: delPromptFitler) {
		const isPlayer = this.isPlayer(el);
		this.autoDelPrompt ??= { player: {}, card: {} };
		this.autoDelPrompt[isPlayer ? "player" : "card"][id] = filter || true;
		if (!this.triggerHooks[del]) this.registerHook(del);
	}

	isPlayer: (el: Card | Player) => boolean = el => get.itemtype(el) === "player";

	addPrompt(el: Card | Player, str: string, id?: string, del?: delTrigger): Card | Player {
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

	removePrompt(el: Card | Player, id?: string): Card | Player {
		const isPlayer = this.isPlayer(el);
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

	autoDelPrompt: autoDelPrompt = {
		player: {},
		card: {},
	};

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
