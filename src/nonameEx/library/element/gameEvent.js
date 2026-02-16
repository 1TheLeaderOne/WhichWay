import { lib, game, ui, get, ai, _status } from "noname";

export class GameEventExt extends lib.element.GameEvent {
	getChildren(filter, step = 20) {
		let event = this;
		if (step <= 0) return {};

		let actualFilter = filter;
		if ( filter === undefined ){
			console.warn("getChildren: filter is not a function or string !");
			return {};
		}
		else if (typeof filter === 'string') {
			const targetName = filter;
			actualFilter = (e) => e.name === targetName;
		}

		if (actualFilter(event)) {
			return event;
		}
		for (const child of this.childEvents || []) {
			//@ts-ignore
			const result = child.getChildren(filter, step - 1);
			if (result && Object.keys(result).length>0) {
				return result;
			}
		}

		return {};
	}
}
