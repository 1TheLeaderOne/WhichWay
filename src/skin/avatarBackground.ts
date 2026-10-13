import { whichWayFile } from "../file.js";
import { onContent } from "../hooks/index.js";
import { whichWayAPIOverride } from "../override/index.js";

/**
 * 头像立绘的透明图层处理
 *
 * 引擎的 `setBackground(name, "character")` 贴的是 `url(立绘),url(本体保底图)` **两层**背景
 * （`init/polyfill.ts` 里 `setBackgroundImage([src, lib.characterDefaultPicturePath + sex])`），
 * 明日方舟立绘带透明区域时，透出来的就是本体那张默认武将图。
 *
 * 这里劫持 `lib.element.player.$init` / `$reinit`：驶舰之向角色的立绘改画进 `.avatar` 里的两层子 div ——
 * 外层铺扩展自己的默认背景并裁掉溢出，内层只贴立绘（贴完把保底图层削掉）。
 * 其余角色一律走引擎原流程，`.avatar` 上连子节点都不会多。
 */

/** 外层：默认背景 + 裁掉溢出 */
const WRAPPER_CLASS = "sjzxAvtBgWrapper";

/** 内层：只贴立绘 */
const IMAGE_CLASS = "sjzxAvtBgImage";

/** 节点 → 两层结构 */
const layersMap = new WeakMap<HTMLDivElement, { outer: HTMLDivElement; inner: HTMLDivElement }>();

/** 已装重定向的头像节点 */
const redirectedNodes = new WeakSet<HTMLDivElement>();

const defaultBackground = () => `url("${whichWayFile.compilePath("ui:background/default.png")}")`;

const isWhichWayChar = (name: any): name is string => typeof name === "string" && window.whichWaySave.hasChar(name);

const layersOf = (node: HTMLDivElement) => {
	const layers = layersMap.get(node);
	//节点被引擎换掉/清空后引用会失效，只认还挂在这个节点上的那一份
	return layers && layers.outer.parentNode === node ? layers : undefined;
};

/** 引擎贴的是 `url(立绘),url(保底图)`，只留第一层 */
function firstLayer(backgroundImage: string) {
	const matched = /^url\((?:"[^"]*"|'[^']*'|[^)]*)\)/.exec(backgroundImage);
	return matched ? matched[0] : backgroundImage;
}

/**
 * 建（或取回）头像节点里的两层结构
 */
function ensureLayers(node: HTMLDivElement) {
	const existing = layersOf(node);
	if (existing) return existing;

	//影子副本要和内层像素重合，所以节点自身的定位/缩放跟引擎给立绘用的一致（polyfill.ts 的 cover + 水平居中）
	node.style.backgroundSize = "cover";
	node.style.backgroundPositionX = "center";

	const outer = document.createElement("div");
	outer.className = WRAPPER_CLASS;
	outer.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;overflow:hidden;pointer-events:none;";
	outer.style.backgroundImage = defaultBackground();
	outer.style.backgroundSize = "cover";
	outer.style.backgroundPosition = "center";

	const inner = document.createElement("div");
	inner.className = IMAGE_CLASS;
	inner.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;";
	inner.style.backgroundSize = "cover";
	inner.style.backgroundPositionX = "center";
	outer.appendChild(inner);

	//插在最前面：引擎 smoothAvatar 的 .fullsize 过渡层、阵亡卡的 .avatarbg 灰度层都是后加进来的兄弟节点，
	//按树序画在我们上面才是原来的观感；动皮容器自带 z-index 2，本来就在上层，不受影响
	node.prepend(outer);

	const layers = { outer, inner };
	layersMap.set(node, layers);
	return layers;
}

/**
 * 把立绘画进内层，同时在头像节点自身留一份**只贴立绘**的影子副本。
 *
 * 影子副本是给「读不到子节点的地方」准备的：`game.logv` 的战报卡头像是
 * `player.node.avatar.cloneNode()`（**浅克隆**，只带属性与内联样式），`smoothAvatar` 的淡出层抄的是
 * `getComputedStyle(.avatar).background`，`ui.fakeme` 抄的是 `.avatar` 的内联 background-image ——
 * 立绘只画在子 div 上的话，这三处全是空白。
 *
 * 它不会在头像上露馅：立绘不透明的地方被内层（同图、同尺寸、同定位）完全盖住，立绘透明的地方节点自己
 * 也是透明的，所以外层那张半透明的 default.png 透出来的仍然只有底下的卡面。
 */
function paintPortrait(node: HTMLDivElement, name: string) {
	const { inner } = ensureLayers(node);
	//走原型而不是 inner.setBackground：inner 没装重定向，但取原型能保证别的扩展对原型的补丁仍然生效
	HTMLDivElement.prototype.setBackground.call(inner, name, "character");
	//db: 图走的是异步分支，此刻内联样式还没写；不动影子副本，免得把上一张好图冲掉
	const url = firstLayer(inner.style.backgroundImage);
	if (!url) return;
	inner.style.backgroundImage = url;
	node.style.backgroundImage = url;
}

/** 撤掉两层结构，交回引擎原流程（画在头像自身） */
function clearLayers(node: HTMLDivElement) {
	layersOf(node)?.outer.remove();
	layersMap.delete(node);
}

/**
 * 给头像节点装重定向：此后任何画到这个节点上的立绘都改画进内层。
 *
 * 除了 `$init` / `$reinit`，引擎皮肤菜单的 avatarSetter、`player.setAvatar`、`changeSkin`、`$reinit12`、
 * 本扩展的 `refreshSkin()`，以及干员技能里直接改头像的 `setBackgroundImage`（如 char_416_zumama）
 * 都会再画一次 —— 不重定向就会被我们加的子 div 盖住，表现为「换了皮肤没反应」。
 *
 * 判断「是不是驶舰之向角色」放在重定向里、按每次调用时的角色名做，所以装一次就够：
 * 从普通角色换成干员、再换回来都各走各的路。
 */
function installRedirect(node?: HTMLDivElement) {
	if (!node || redirectedNodes.has(node)) return;
	redirectedNodes.add(node);

	node.setBackground = function (name, type, ext, subfolder) {
		if (type === "character" && isWhichWayChar(name)) {
			paintPortrait(this, name);
			return this;
		}
		//换回普通角色：撤掉两层结构，否则引擎画在头像自身的图会被子 div 盖住
		if (layersMap.has(this)) clearLayers(this);
		return HTMLDivElement.prototype.setBackground.call(this, name, type, ext, subfolder);
	};

	node.setBackgroundImage = function (img) {
		const layers = layersOf(this);
		if (!layers) return HTMLDivElement.prototype.setBackgroundImage.call(this, img);
		layers.inner.setBackgroundImage(img);
		//影子副本跟着走，理由见 paintPortrait
		this.style.backgroundImage = layers.inner.style.backgroundImage;
		return this;
	};
}

onContent({
	name: "whichWaySkinAvatarBackground",
	fn: () => {
		whichWayAPIOverride.appendHook("lib.element.player.$init", {
			before(this: any) {
				//头像节点从建好到销毁都不会被换掉，这里装一次即可覆盖后续所有绘制路径
				installRedirect(this.node.avatar);
				installRedirect(this.node.avatar2);
			},
		});

		whichWayAPIOverride.appendHook("lib.element.player.$reinit", {
			before(this: any) {
				//$init 已经装过，这里是幂等的兜底：万一头像节点被别的代码换掉，重定向还在
				installRedirect(this.node.avatar);
				installRedirect(this.node.avatar2);
			},
		});
	},
});
