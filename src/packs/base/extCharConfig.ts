class WhichWayCharConfig {
	/**
	 * 是否为支援器械
	 * @type { boolean }
	 */
	supportingEquipment: boolean = false;

	/**
	 * 设计者
	 * @type { Array<string> }
	 */
	designer: Array<string> = [];

	/**
	 * 真正的势力
	 */
	reallyGroup: string = "";

	/**
	 * 角色id(驶舰之向)
	 */
	charId: string = "";

	/**
	 * 明日方舟数据
	 */
	arknight = {
		/**
		 * 角色id(明日方舟)
		 */
		charId: "",
		/**明日方舟阵营 */
		camp : "",
		/**明日方舟可用配音语言 */
		avaiableLangs: [],
        tags:[]
	};
}

export const initCharConfig = (char: WhichWayCharacter | WhichWayCharacterPending):WhichWayCharacter => {
	//@ts-ignore
	if (!char.whichWay) char.whichWay = new WhichWayCharConfig();
    //@ts-ignore
    return char;
};
