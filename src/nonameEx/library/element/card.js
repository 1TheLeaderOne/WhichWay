import { lib, game, ui, get, ai, _status } from "noname";

export class CardExt extends lib.element.Card {
	removePromptSJZX(id){
		let targets = this.querySelectorAll(".promptSJZX");
		if(!targets) return this;
		else if(typeof id !== "string") targets.forEach(i=>i.remove());
		else{
			for(let target of targets){
				//@ts-ignore
				if(target.dataset.promptID === id) target.remove();
			}
		}
		return this;
	}

	addPromptSJZX(str,id){
		let wrapper = this.querySelector(".promptSJZX-Wrapper") || ui.create.div(".promptSJZX-Wrapper",this);

		let prompts = Array.from(wrapper.querySelectorAll(".promptSJZX"));

		for(let prompt of prompts){
			//@ts-ignore
			if(prompt.dataset.promptID === id){
				prompt.innerHTML = str;
				return this;
			}
		}

		let info = ui.create.div(".promptSJZX",wrapper);
        info.classList.add("promptCardSJZX");
        info.innerHTML = str;
		info.dataset.promptID = id || str;
		return this;
	}

	isConnect() {
		//@ts-ignore
		game.broadcastAll(() => {
			_status.sxrmConnectCards ??= [];
		});
		return _status.sxrmConnectCards.includes(this);
	}

	addConnect() {
        if(this.isConnect()) return this;
		//@ts-ignore
		game.broadcastAll(connect => {
			connect.addGaintag("visible_sxrm_connect_tag");
			_status.sxrmConnectCards.add(connect);
			//@ts-ignore
		}, this);
        //@ts-ignore
		const owner = get.owner(this);
			if (owner?.isIn()) {
				owner.markSkill("_sxrm_connect");
			}
		this.refreshMark();
		return this;
	}

	removeConnect() {
		_status.sxrmConnectCards ??= [];
		_status.sxrmConnectCards.remove(this);
		//@ts-ignore
		game.broadcast(connectCards => {
			_status.sxrmConnectCards = connectCards;
			//@ts-ignore
		}, _status.sxrmConnectCards);
		//@ts-ignore
		game.broadcastAll(card => {
			card.removeGaintag("visible_sxrm_connect_tag");
			//@ts-ignore
		}, this);
		this.refreshMark();
		return this;
	}

	refreshMark() {
		//@ts-ignore
		game.filterPlayer(current => {
            //@ts-ignore
			if (current.getCards("h",card=>card.isConnect()).length) {
				current.markSkill("_sxrm_connect");
			} else {
				current.unmarkSkill("_sxrm_connect");
			}
		});
	}
}