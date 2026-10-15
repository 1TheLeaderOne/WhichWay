import { createVNode, render } from "vue";
import { whichWayArknight } from "../arknight/index.ts";
import { whichWayFile } from "../file.js";
import { onContent } from "../hooks/index.js";
import { whichWayAPIOverride } from "../override/index.js";
import PortraitLayers from "./PortraitLayers.vue";
import { getPosByUrl, resolvePortraitKey, type PortraitPos } from "./portraitPos.ts";

/**
 * 立绘的透明图层处理
 *
 * 引擎的 `setBackground(name, "character")` 贴的是 `url(立绘),url(本体保底图)` **两层**背景
 * （`init/polyfill.ts` 里 `setBackgroundImage([src, lib.characterDefaultPicturePath + sex])`），
 * 明日方舟立绘带透明区域时，透出来的就是本体那张默认武将图。
 *
 * 这里劫持三处绘制入口，把明日方舟干员的立绘改画进 `PortraitLayers.vue` 的两层子元素里
 * （外层默认背板 + 裁溢出，内层只贴立绘）；其余角色一律走引擎原流程，节点上连子元素都不会多。
 * - `lib.element.player.$init` / `$reinit`：主将 `node.avatar`、副将 `node.avatar2`
 * - `ui.create.buttonPresets.character`：对话框里的武将卡按钮（选将、观战、`characterx` 也走它）
 */

/** 节点 → 挂在它上面的两层背景 */
type Layers = {
	/** 承载 Vue 渲染结果的宿主元素（渲染会清空容器，所以不能直接拿引擎节点当容器） */
	host: HTMLDivElement;
	/** 当前立绘的 `background-image`，拖拽重绘时要用同一张图 */
	url: string;
	setImage(url: string, pos?: PortraitPos): void;
	dispose(): void;
};

const layersMap = new WeakMap<HTMLDivElement, Layers>();

/** 已装重定向的节点 */
const redirectedNodes = new WeakSet<HTMLDivElement>();

/**
 * 只有明日方舟干员才套两层背景。
 *
 * `isArknght` 查的是 `vaildArkId`（明日方舟全量干员uid，来自 character_table + patchChars），
 * 而不是「本扩展已实现」的 `exsitArk`：干员id 已与方舟 uid 统一，立绘也按 uid 落盘，
 * 因此判据只需要「这是个方舟干员」。本体武将与其它扩展的角色没有透明图层问题，一律走引擎原流程。
 */
const isArkOperator = (name: any): name is string => typeof name === "string" && whichWayArknight.isArknght(name);

const layersOf = (node: HTMLDivElement) => {
	const layers = layersMap.get(node);
	//节点被清空/换掉后引用会失效，只认还挂在这个节点上的那一份
	return layers && layers.host.parentNode === node ? layers : undefined;
};

/**
 * 这个节点的立绘是不是由本扩展的两层背景绘制的。
 *
 * 皮肤拖拽用它当「能不能拖」的判据：只有套上两层背景的节点（即明日方舟干员）才有位置设定可言，
 * 走引擎原流程的节点（本体武将、其它扩展角色）身上没有我们的子元素，拖了也没东西可动。
 */
export function hasPortraitLayers(node?: HTMLElement | null): node is HTMLDivElement {
	return node != null && layersOf(node) !== undefined;
}

/**
 * 取节点当前立绘对应的「干员id + 皮肤名」，供拖拽写回配置。
 * 解析不出干员（理论上不该发生：能拖的节点必然画的是方舟立绘）时返回 undefined。
 */
export function getPortraitKey(node: HTMLDivElement) {
	const layers = layersOf(node);
	if (!layers?.url) return;
	return resolvePortraitKey(layers.url);
}

/**
 * 用给定设定重绘节点立绘 —— 拖拽期间的实时预览走这里。
 *
 * 只重绘子元素，**不动节点上的影子副本**：影子副本要是也跟着 `transform`，就得把位移写进
 * `node.style.transform`，而 `.avatar` 的 transform 会连带动到同节点上的 `.name`/`.hp` 等兄弟层。
 * 影子副本本来就一直是「未缩放的原始比例」（它连既有的 `scale(1.5)` 都没应用），保持一致即可。
 */
export function repaintPortrait(node: HTMLDivElement, pos: PortraitPos) {
	const layers = layersOf(node);
	if (!layers) return;
	layers.setImage(layers.url, pos);
}

/** 节点当前立绘的 `background-image`（拖拽要按它反解配置键） */
export function getPortraitUrl(node: HTMLDivElement) {
	return layersOf(node)?.url;
}

/**
 * 离屏跑一遍引擎的绘制，取回它算出的 `background-image`。
 *
 * 贴图路径的解析（皮肤配置、`ext:` / `mode:` / `img:` 前缀、国战 `gz_` 前缀、扩展名兜底）全在
 * `setBackground` 里，重写一遍必然走偏，所以借一个不入库的 div 让它自己算。
 */
function resolveBackgroundImage(paint: (scratch: HTMLDivElement) => void) {
	const scratch = document.createElement("div");
	paint(scratch);
	return scratch.style.backgroundImage;
}

/** 引擎贴的是 `url(立绘),url(保底图)`，只留第一层 */
function firstLayer(backgroundImage: string) {
	const matched = /^url\((?:"[^"]*"|'[^']*'|[^)]*)\)/.exec(backgroundImage);
	return matched ? matched[0] : backgroundImage;
}

/**
 * 建（或取回）节点里的两层背景
 */
function ensureLayers(node: HTMLDivElement): Layers {
	const existing = layersOf(node);
	if (existing) return existing;

	//影子副本（见 paintPortrait）的贴合方式与引擎给立绘用的一致：cover + 水平居中。
	//注意它不带内层的 `transform`（默认 1.5 倍缩放 + pos.json 的调位），所以只是「大致重合」：
	//副本服务的是读不到子元素的三处（战报浅克隆、smoothAvatar 淡出层、fakeme），
	//那几处只要有个正确的立绘在就行，没人拿它们和场上像素比对。
	node.style.backgroundSize = "cover";
	node.style.backgroundPositionX = "center";

	const host = document.createElement("div");
	//`border-radius: inherit` + `overflow: hidden`：主题给 `.avatar`/`.button` 写了 8px 圆角（圆角大小设置能改成 4/0/16px），
	//这一层是实心方块，不给它同样的圆角就会把宿主的圆角盖成直角；`inherit` 取的是宿主节点的计算值，
	//所以换主题、改设置都不用在样式表里跟着改数（`border-radius` 不会自动继承，必须显式写）。
	host.style.cssText = "position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;overflow:hidden;";

	const layers: Layers = {
		host,
		url: "",
		setImage(url, pos) {
			layers.url = url;
			//位置设定按 url 反解（皮肤目录形态与「经典形象」两种路径都能还原成同一条配置）
			const portraitPos = pos ?? getPosByUrl(url);
			render(createVNode(PortraitLayers, { image: url, offsetX: portraitPos.x, offsetY: portraitPos.y, scale: portraitPos.scale }), host);
		},
		dispose() {
			render(null, host);
			host.remove();
			layersMap.delete(node);
		},
	};
	layers.setImage("");

	//插在最前面：smoothAvatar 的 .fullsize 过渡层、阵亡卡的 .avatarbg 灰度层、武将卡的
	//.name/.hp/.identity 都是兄弟节点，按树序画在我们上面才是原来的观感；动皮容器自带 z-index 2
	node.prepend(host);

	layersMap.set(node, layers);
	return layers;
}

/**
 * 把立绘画进两层背景，同时在节点自身留一份**只贴立绘**的影子副本。
 *
 * 影子副本是给「读不到子元素的地方」准备的：`game.logv` 的战报卡头像是
 * `player.node.avatar.cloneNode()`（**浅克隆**，只带属性与内联样式），`smoothAvatar` 的淡出层抄的是
 * `getComputedStyle(.avatar).background`，`ui.fakeme` 抄的是 `.avatar` 的内联 background-image ——
 * 立绘只画在子元素上的话，这三处全是空白。
 *
 * 副本是**未调位的原样**：`transform`（默认 1.5 倍缩放 + pos.json 的位置设定）只加在内层子元素上，
 * 加到节点自身就会连带动到 `.name`/`.hp` 等兄弟层。所以内层一旦偏移，透出来的副本就不完全重合 ——
 * 这是既有取舍（改动之前副本也从来不带内层那个默认缩放），换来的是上面三处不空白。
 */
function paintPortrait(node: HTMLDivElement, name: string) {
	const layers = ensureLayers(node);
	const url = firstLayer(resolveBackgroundImage(scratch => HTMLDivElement.prototype.setBackground.call(scratch, name, "character")));
	//setBackground 的 db: 分支是异步的（polyfill.ts:211-213），此刻读不到值；驶舰之向干员的立绘
	//一律走 lib.config.skin，到不了那个分支
	if (!url) return;
	layers.setImage(url);
	node.style.backgroundImage = url;
}

/**
 * 给节点装重定向：此后任何画到这个节点上的立绘都改画进两层背景。
 *
 * 除了被劫持的三个入口，`changeSkin`(player.js:3761,3800,3822)、`$reinit12/21`(3963-3978)、
 * `setAvatar`(4523-4528)、武将卡按钮的 `node.refresh`、本扩展的 `refreshSkin()`，以及干员技能里直接改
 * 头像的 `setBackgroundImage`（如 char_416_zumama）都会再画一次 —— 不重定向就会被两层背景盖住，
 * 表现为「换了皮肤没反应」。
 *
 * 「是不是方舟干员」的判断放在重定向里、按每次调用时的角色名做，所以装一次就够：
 * 从普通角色换成干员、再换回来都各走各的路。
 */
function installRedirect(node?: HTMLDivElement) {
	if (!node || redirectedNodes.has(node)) return;
	redirectedNodes.add(node);

	node.setBackground = function (name, type, ext, subfolder) {
		if (type === "character" && isArkOperator(name)) {
			paintPortrait(this, name);
			return this;
		}
		//换回普通角色：撤掉两层背景，否则引擎画在节点自身的图会被子元素盖住
		layersOf(this)?.dispose();
		return HTMLDivElement.prototype.setBackground.call(this, name, type, ext, subfolder);
	};

	node.setBackgroundImage = function (img) {
		const layers = layersOf(this);
		if (!layers) return HTMLDivElement.prototype.setBackgroundImage.call(this, img);
		const url = resolveBackgroundImage(scratch => HTMLDivElement.prototype.setBackgroundImage.call(scratch, img));
		layers.setImage(url);
		//影子副本跟着走，理由见 paintPortrait
		this.style.backgroundImage = url;
		return this;
	};
}

/**
 * 给节点套上两层背景并把立绘/皮肤画上去 —— 供「添加干员图片」这类主动调用使用。
 *
 * 为什么要有它：本模块的绘制入口都是**被动劫持**（引擎 `setBackground` 时改道），
 * 而主动往一个节点上贴干员图的地方（皮肤投稿、预览）没有「角色名 → 立绘路径」这条线，
 * 只有现成的图片路径。走这里就和本模块劫持出来的立绘**完全同一套结构**（同一组件、同一位置设定、
 * 同一影子副本），不会出现「同一张图在两处观感不一致」。
 *
 * 不校验是不是方舟干员：调用方既然主动指定了图，就该由它决定贴谁。
 * @param node 承载立绘的节点（必须是 div，`setBackground` 的兜底路径挂在 `HTMLDivElement` 上）。
 *             两层背景是 `position:absolute; inset:0`，所以节点要有尺寸且是定位元素（引擎的 `.avatar` 本来就是）
 * @param image 图片路径或已有的 `url(...)` 串
 * @param pos 位置设定；留空则按图片路径反解 `pos.json`
 * @returns 是否装上（非 div 直接返回 false，免得调用方拿到一个没有背景的节点）
 */
export function mountPortrait(node: HTMLElement | null | undefined, image: string, pos?: PortraitPos): boolean {
	if (!(node instanceof HTMLDivElement) || !image) return false;
	installRedirect(node);
	const url = image.startsWith("url(") ? image : `url("${whichWayFile.compilePath(image)}")`;
	ensureLayers(node).setImage(url, pos);
	//影子副本：战报浅克隆、smoothAvatar、ui.fakeme 读的都是节点自身的背景
	node.style.backgroundImage = url;
	return true;
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

		whichWayAPIOverride.appendHook("ui.create.buttonPresets.character", {
			after(result: any) {
				//按钮节点是在预设内部建的，before 拿不到，只能画完再补：用 link 而不是入参 item，
				//因为 characterx 会在内部把 item 换成 lib.characterReplace 里的随机一个
				const name = result?.link;
				if (!isArkOperator(name)) return;
				installRedirect(result);
				paintPortrait(result, name);
			},
		});
	},
});
