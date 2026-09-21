import { lib, game, ui, get, ai, _status } from "noname";
import { createApp, type App } from "vue";
import CharacterCard from "./CharacterCard.vue";
import { whichWayUtil } from "../utill.js";
import { whichWaySkin } from "../skin/index.ts";
import { onConfig, onContent, onSetDev } from "../hooks/index.js";
import { whichWayAPIOverride } from "../override/index.js";

/** 武将卡样式开关：关闭 / 仅驶舰之向角色 / 所有角色 */
export type CharacterCardStyleMode = "off" | "whichWay" | "all";

/** 样式开关的配置项名（运行时键为 `lib.config.extension_WhichWay_<它>`） */
const STYLE_CONFIG_NAME = "enableWhichWayCharacterCardStyle";

/**
 * 驶舰之向武将卡。
 *
 * 界面（立绘、技能 / 皮肤 / 模组 / 简介 / 背景面板）已整体迁到 Vue：
 * `./CharacterCard.vue`（外壳）+ `./panels/*.vue`（四个原有面板 + 新增的背景面板），
 * 样式随组件（scoped），原先的 `click.ts`（造 DOM 与点击逻辑）与 `css/characterCard.css` 已删除。
 *
 * 本类只负责三件事：
 * 1. 劫持 `ui.click.charactercard`（按样式开关决定是否接管）；
 * 2. 注册样式开关配置项；
 * 3. 创建 / 关闭武将卡（挂载与卸载 Vue 应用）。
 */
class WhichWayCharacterCard {
	/** 当前武将卡的 Vue 应用与挂载容器（同一时刻只会存在一张卡） */
	#app: App | null = null;
	#container: HTMLElement | null = null;

	constructor() {
		//劫持ui.click.charactercard
		onContent({
			name: "whichWayCharacterCardStyleOverride_add",
			fn() {
				//避免被千幻劫持，直接覆盖一波
				Object.defineProperty(ui.click, "charactercard", {
					value: ui.click.charactercard,
					writable: true,
					configurable: true,
					enumerable: true,
				});
				whichWayAPIOverride.appendHook("ui.click.charactercard", {
					before: function (name, sourcenode, noedit, resume, avatar, audioName) {
						if (whichWayCharacterCard.shouldUseStyle(name)) {
							whichWayCharacterCard.create(name);
							return false;
						}
					},
				});
			},
		});

		onConfig({
			name: "whichWayCharacterCardStyleConfig_add",
			priority: 770,
			obj: {
				name: STYLE_CONFIG_NAME,
				options: {
					name: "启用驶舰之向武将卡样式",
					intro: "选择哪些武将使用驶舰之向的武将卡样式（关闭 / 仅驶舰之向角色 / 所有角色）",
					init: "whichWay",
					item: {
						off: "关闭",
						whichWay: "扩展角色",
						all: "所有角色",
					},
				},
			},
		});
	}

	/**
	 * 当前样式模式。
	 *
	 * 兼容旧版本的布尔配置：旧版本这个选项是开关（`true` / `false`），
	 * 老存档里存的就是布尔值 —— `true` 视为「所有角色」（旧版开启后对所有武将生效）、`false` 视为「关闭」。
	 */
	getStyleMode(): CharacterCardStyleMode {
		const value = whichWayUtil.config(STYLE_CONFIG_NAME);
		if (value === true) return "all";
		if (value === false) return "off";
		if (value === "off" || value === "whichWay" || value === "all") return value;
		//从未配置过（或值异常）时按默认值处理
		return "whichWay";
	}

	/** 该武将是否应使用驶舰之向武将卡样式 */
	shouldUseStyle(name: string): boolean {
		const mode = this.getStyleMode();
		if (mode === "off") return false;
		if (mode === "all") return true;
		return window.whichWaySave.hasChar(name);
	}

	/**
	 * 打开某位武将的武将卡。
	 *
	 * 额外参数（`sourcenode` / `noedit` / `resume` / `avatar` / `audioName`）是引擎 `ui.click.charactercard`
	 * 的原始入参，本实现用不到，保留形参只是为了让劫持处的调用签名保持兼容。
	 */
	async create(name: string, sourcenode?: any, noedit?: any, resume?: any, avatar?: any, audioName?: any) {
		//避免重复打开
		if (this.#app) this.close();
		const container = document.createElement("div");
		//挂载容器必须铺满全屏并成为定位上下文：武将卡根元素（`.container-CC-SJZX`）是 absolute + 100%×100%，
		//内部大量元素用百分比高度（立绘 `.charImageWrapper` 90% 等）。容器若只是个不定位的普通 div，
		//卡片内部的高度百分比会塌成 0 —— 立绘区没高度，动皮的骨骼缩放又是按挂载元素 clientWidth/clientHeight
		//算的（`spineWork.js` 的 setSkeletonPosition），于是动皮被缩放到不可见、面板也被压成一小块。
		Object.assign(container.style, {
			//用 fixed 而不是 absolute：fixed 的包含块一定是视口，不受 body/html 高度定义的影响，
			//这样 100%×100% 必定等于整屏（absolute 一旦碰上高度为 auto 的定位祖先就会塌成 0）
			position: "fixed",
			left: "0",
			top: "0",
			width: "100%",
			height: "100%",
			zIndex: "20",
		});
		document.body.appendChild(container);
		const app = createApp(CharacterCard, {
			name,
			onClose: () => this.close(),
		});
		app.mount(container);
		this.#app = app;
		this.#container = container;
	}

	/** 关闭武将卡：卸载 Vue 应用、移除容器，并让场上玩家头像与动皮同步 */
	close() {
		this.#app?.unmount();
		this.#app = null;
		this.#container?.remove();
		this.#container = null;
		whichWaySkin.refreshSkin();
		game.resume2();
	}
}

export const whichWayCharacterCard = new WhichWayCharacterCard();

onSetDev({
	name: "whichwayCharacterCard_dev",
	fn: () => {
		//@ts-ignore
		window.whichWayCharacterCard = whichWayCharacterCard;
	},
});

window.whichWay.register("characterCard", whichWayCharacterCard);
