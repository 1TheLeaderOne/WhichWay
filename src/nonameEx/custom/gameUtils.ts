export const gameUtils = {
    /**
     * 创建一个标准的Result对象
     */
	createResult(init: Partial<Result> = {}): Result {
		const base: Result = {
			cards: [],
			targets: [],
			buttons: [],
			links: [],
			control: "",
			index: -1,
			confirm: "",
			skill: "",
			card: null as unknown as Card,
			cost_data: null,
            bool:false,
		};
		return Object.assign(base, init);
	},
};
