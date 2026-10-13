import { onSetDev } from "../hooks";

type Listener = (value: any, key: string) => void | Promise<void>;

class DataManager {
	private _data: Record<string, any> = {};
	private _listeners: Map<string, Set<Listener>> = new Map();

	public get(key: string): any {
		return this._data[key];
	}

	public set(key: string, value: any): void {
		this._data[key] = value;
		this._emit(key, value);
	}

	public remove(key: string | string[]): void {
        if(!Array.isArray(key)) key = [key];
        (key as string[]).forEach(i=>delete this._data[i]);
	}

	public on(key: string, callback: Listener): void {
		if (!this._listeners.has(key)) {
			this._listeners.set(key, new Set());
		}
		this._listeners.get(key)!.add(callback);
	}

	public off(key: string, callback: Listener): void {
		this._listeners.get(key)?.delete(callback);
	}

	public offAll(key: string): void {
		this._listeners.delete(key);
	}

	private async _emit(key: string, value: any): Promise<void> {
		const listeners = this._listeners.get(key);
		if (listeners) {
			for (const listener of listeners) {
				await listener(value, key);
			}
		}
	}
}

export const dataManager = new DataManager();

window.whichWay.register("dataManager", dataManager);

onSetDev({
	name: "whichWayDataManager_dev",
	fn: () => {
		(window as any).whichWayDataManager = dataManager;
	},
});
