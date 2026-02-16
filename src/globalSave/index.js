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
