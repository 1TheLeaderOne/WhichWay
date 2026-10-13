import { whichWayUtil } from "../utill.js";

export class WhichWaySave {
	/**
	 * 驶舰之向所有干员
	 * @type {Array<string>}
	 */
	allCharacters = [];

	/**
	 * 驶舰之向所有技能
	 * @type {Array<string>}
	 */
	allSkills = [];

	/**
	 * 干员/技能集合索引。
	 *
	 * 上面两个数组的**顺序是被依赖的**（明日方舟译名反查按注册顺序取首个命中者），
	 * 因此数组本身保持原样；这里额外维护一份 Set 专供成员判断：
	 * 原先全扩展有二十多处 `allCharacters.includes(...)` / `allSkills.includes(...)`，
	 * 在几百个干员、上千个技能的规模下每次都是 O(n) 线性扫描（部分还落在
	 * 每个干员 × 每个技能的循环里），改集合后为 O(1)。
	 *
	 * 为免"调用方必须走 addCharacter 写入"这种脆弱约定，判断前会先用数组长度做
	 * 一次极廉价的校验，长度对不上就重建索引——因此外部直接 push 也不会出错。
	 * @type {Set<string>}
	 */
	#characterIndex = new Set();

	/** 上次建索引时的 allCharacters.length，用于低成本检测数组是否被外部改动 */
	#characterIndexLength = -1;

	/** @type {Set<string>} */
	#skillIndex = new Set();

	#skillIndexLength = -1;

	/**
	 * 是否是驶舰之向干员
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasChar(name) {
		if (this.#characterIndexLength !== this.allCharacters.length) {
			this.#characterIndex = new Set(this.allCharacters);
			this.#characterIndexLength = this.allCharacters.length;
		}
		return this.#characterIndex.has(name);
	}

	/**
	 * 是否是驶舰之向技能
	 * @param {string} name
	 * @returns {boolean}
	 */
	hasSkill(name) {
		if (this.#skillIndexLength !== this.allSkills.length) {
			this.#skillIndex = new Set(this.allSkills);
			this.#skillIndexLength = this.allSkills.length;
		}
		return this.#skillIndex.has(name);
	}

	autoEnableDevTip = false;
	
	updatingSkinData = false;

	get allPlayers(){
		//@ts-ignore
		return game.players.concat(game.dead);
	}

	/**
	 * @type {Record<string, any>}
	 */
	weinaData = {}

	/**
	 * 驶舰之向音频配置
	 */
	audioConfig = {
		_default: "CN_MANDARIN",
		get default() {
			return whichWayUtil.config("audioConfig")?._default || this._default;
		},
		set default(value) {
			this._default = value;
			whichWayUtil.saveConfig("audioConfig", whichWaySave.audioConfig);
		},

		custom: whichWayUtil.config("audioConfig")?.custom || {},

		onlineVoicesTitle: {},
	};

	/**
	 * 驶舰之向皮肤配置
	 */
	skinConfig = whichWayUtil.config("skinConfig") || {};

	/**
	 * 动态皮肤其他效果(即出框等效果)
	 */
	dycOtherEffect = false;

	/**
	 * 动态皮肤存储
	 */
	dycSave = {
		/**
		 * 动皮资产
		 * @type {Record<string, any>}
		 */
		assets:{},

		/**
		 * 动皮动态适应的数据
		 */
		startFit : {
			dycLoaded:false,
			decadeUIFit:false,
			/**
			 * @type {any}
			 */
			parent,
			container:undefined,
		}
	}

	/**
	 * 模组设置
	 */
	get modulesSet(){
		return whichWayUtil.config("modulesSet") || {};
	};

	/**
	 * 驶舰之向自定义函数的全局存储
	 * 这些函数一般是用在技能的
	 */
	customFucSave = {
		skill:{
			/**
			 * eventStack是否被代理,用于吉占的处理
			 */
			eventStackIsProxy:false,

			/**
			 * 吉占时隐藏卡牌的角色
			 * @type {Array<string>}
			 */
			hiddenCardInJiZhan:[]
		}
	}

	/**
	 * 临时储存(其实就是垃圾桶,技能临时的数据啥的全往这里塞)
	 * @type { Record<string, any> }
	 */
	tmpSave = {}
}

/**
 * 驶舰之向全局存储
 */
export const whichWaySave = new WhichWaySave();

//始终暴露
window.whichWaySave = whichWaySave;
