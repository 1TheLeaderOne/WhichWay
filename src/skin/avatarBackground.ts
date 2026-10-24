import { createVNode, render } from "vue";
import { whichWayArknight } from "../arknight/index.ts";
import { whichWayFile } from "../file.js";
import { onContent } from "../hooks/index.js";
import { whichWayAPIOverride } from "../override/index.js";
import { whichWaySkin } from "./index.ts";
import PortraitLayers from "./PortraitLayers.vue";
import { spineWorker } from "./spineWork.js";
import { getCover, getPosByUrl, resolvePortraitKey, type PortraitCover, type PortraitPos } from "./portraitPos.ts";

/**
 * 立绘的透明图层处理
 *
 * 引擎的 `setBackground(name, "character")` 贴的是 `url(立绘),url(本体保底图)` **两层**背景
 * （`init/polyfill.ts` 里 `setBackgroundImage([src, lib.characterDefaultPicturePath + sex])`），
 * 明日方舟立绘带透明区域时，透出来的就是本体那张默认武将图。
 *
 * 这里劫持绘制入口，把明日方舟干员的立绘改画进 `PortraitLayers.vue` 的两层子元素里
 * （外层默认背板 + 裁溢出，内层是一张装着**完整原图**的画布）；其余角色一律走引擎原流程，节点上连子元素都不会多。
 * - 原型级 `HTMLDivElement.prototype.setBackground` / `qhly_origin_setBackground`：覆盖**任何**白名单节点，
 *   包括千幻聆音自己 `ui.create.div()` 出来的卡片容器（见 `installPrototypeRedirect`）
 * - `lib.element.player.$init` / `$reinit`：主将 `node.avatar`、副将 `node.avatar2`
 * - `ui.create.buttonPresets.character`：对话框里的武将卡按钮（选将、观战、`characterx` 也走它）
 *
 * ⚠️ 与 `skin/index.ts` 是循环依赖（skin → 本文件 → skin）。这里用到 `whichWaySkin` 的地方全在
 * 函数体内（绘制、重绘钩子），那时两个模块都已求值完毕，不会踩到 TDZ。
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

/** 已装「外部内联样式」观察者的节点（十周年UI 出框图会直接写 style，见 `watchExternalBackground`） */
const externalWatchers = new WeakMap<HTMLDivElement, MutationObserver>();

/**
 * 正在由**本扩展**写内联样式的节点。
 *
 * 本扩展会把「两层背景当前那张图」再写一份到 `node.style.backgroundImage` 当影子副本
 * （供战报浅克隆、`smoothAvatar`、`ui.fakeme` 读取）。这份写入同样会触发 `watchExternalBackground`
 * 的 `MutationObserver`，如果不加标记就会被误当成「外部改图」，把同一张图反复回灌。
 */
const selfWritingNodes = new WeakSet<HTMLDivElement>();

/** 已装重定向的节点 */
const redirectedNodes = new WeakSet<HTMLDivElement>();

/**
 * 只有明日方舟干员才套两层背景。
 *
 * `isArknght` 查的是 `vaildArkId`（明日方舟全量干员uid，来自 character_table + patchChars），
 * 而不是「本扩展已实现」的 `exsitArk`：干员id 已与方舟 uid 统一，立绘也按 uid 落盘，
 * 因此判据只需要「这是个方舟干员」。本体武将与其它扩展的角色没有透明图层问题，一律走引擎原流程。
 *
 * 导出给「皮肤位置调整」开发面板复用：那里要按**同一个判据**过滤候选干员，
 * 否则列出来的非方舟角色画不进两层 DOM、也就无从拖拽调位。
 */
export const isArkOperator = (name: any): name is string => typeof name === "string" && whichWayArknight.isArknght(name);

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
 * 只重绘子元素，**不动节点上的影子副本**：影子副本要是也跟着偏移，就得把位移写进
 * `node.style.transform`，而 `.avatar` 的 transform 会连带动到同节点上的 `.name`/`.hp` 等兄弟层。
 * 影子副本本来就一直是「未调位的原样」（它连内层那套位置设定都没应用），保持一致即可。
 */
export function repaintPortrait(node: HTMLDivElement, pos: PortraitPos) {
	const layers = layersOf(node);
	if (!layers) return;
	layers.setImage(layers.url, pos);
}

/**
 * 这个节点当前立绘的画布覆盖倍数（画布尺寸 ÷ 框尺寸），供拖拽把偏移夹到「原图边缘」。
 *
 * 比例是从 DOM 现读的：`<img>` 的 `naturalWidth/Height` 是解码出来的原图尺寸，框尺寸取承载层
 * （`inset:0` 的绝对定位 div，等于宿主节点）的 `clientWidth/Height`。读不到（图还没加载完、
 * 节点还没进文档）时返回 undefined，调用方按「不夹」处理即可 —— 绘制侧自己还会再过一次 `clampOffset`，
 * 所以最坏情况只是 HUD 多显示一点，不会露出背板。
 * @param scale 要算的那个倍率（拖拽传正在写入的实时值，而不是 pos.json 里的旧值）
 */
export function getPortraitCover(node: HTMLDivElement, scale: number): PortraitCover | undefined {
	const layers = layersOf(node);
	if (!layers) return;
	const img = layers.host.querySelector("img");
	if (!img) return;
	const width = layers.host.clientWidth;
	const height = layers.host.clientHeight;
	if (!(width > 0) || !(height > 0)) return;
	const frameAspect = width / height;
	//图还没解码完就按「框 × scale」算，与绘制侧的兜底同一条，两边结果一致
	if (!(img.naturalWidth > 0) || !(img.naturalHeight > 0)) return { x: scale, y: scale };
	return getCover(img.naturalWidth / img.naturalHeight, frameAspect, scale);
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
/**
 * 借一个**离屏且不入库**的 div 让给定实现算出一份 `background-image`。
 *
 * ⚠️ 这个 scratch div 是裸 `document.createElement("div")`，既没有 `.avatar` 之类类名、也没进文档，
 * 因此原型 gate 的 `isPortraitNode()` 恒为假 ⇒ 它天然不会触发双层绘制，拿到的就是原样结果。
 * 这一点对两条调用路径都成立：`paintPortrait` 里算引擎的 `src`、以及同步千幻贴图时算 `url(...)`。
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
 * 立绘 / 皮肤路径 → 可直接用的 `url("…")`（规则见 `whichWayFile.toCssUrl`）
 */
const toBackgroundUrl = (src: string) => `url("${whichWayFile.toCssUrl(src)}")`;

/**
 * 清掉节点自身的内联立绘，**同时**让 `watchExternalBackground` 放行这次写入。
 *
 * 为什么不能像以前那样写一份「影子副本」到内联样式：背板 `ui:background/default.png`
 * 是 1024×576、四角 RGBA 为 (65,65,65,196) / (42,42,42,223)，全图 0.5% 的像素 alpha < 255
 * —— 子元素那层在边缘**是半透明的**，节点自身再留一份立绘就会从边上透出来；
 * 而副本是「未调位的原样」、内层是 cover 放大后的画面（实测 453%×366%），两张构图不同，
 * 叠起来就是同时开千幻/十周年时看到的那种重影。
 *
 * 代价：`game.logv` 的战报卡头像是 `player.node.avatar.cloneNode()`（浅克隆，只带内联样式）、
 * `smoothAvatar` 的淡出层抄 `getComputedStyle`、`ui.fakeme` 抄内联 `background-image` ——
 * 这几处读不到子元素会变空白。它们是既有取舍里较轻的一边：重影是全局可见的 bug，而这几处
 * 只是个别面板的头像。将来要补，应该给那几处单独画（**不要**退回给节点写内联副本）。
 */
function clearInlineBackground(node: HTMLDivElement) {
	if (!node.style.backgroundImage) return;
	selfWritingNodes.add(node);
	node.style.backgroundImage = "";
	queueMicrotask(() => selfWritingNodes.delete(node));
}

/**
 * 建（或取回）节点里的两层背景
 */
function ensureLayers(node: HTMLDivElement): Layers {
	const existing = layersOf(node);
	if (existing) return existing;

	//影子副本（见 paintPortrait）的贴合方式与引擎给立绘用的一致：cover + 水平居中。
	//注意它不带内层那张画布的位置与倍率（默认 1.5 倍 + pos.json 的调位），所以只是「大致重合」：
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
	//十周年UI 的出框图会绕过 setBackground/setBackgroundImage 直接写内联样式，
	//挂上观察者才能把它同步进来（否则「子元素画立绘 + 内联写出框图」两层叠加）
	watchExternalBackground(node);
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
 * 副本是**未调位的原样**：画布的放大与偏移只加在内层子元素上，加到节点自身就会连带动到
 * `.name`/`.hp` 等兄弟层。所以内层一旦偏移，透出来的副本就不完全重合 ——
 * 这是既有取舍（改动之前副本也从来不带内层那个默认缩放），换来的是上面三处不空白。
 *
 * @param forceClassic 调用方明确要「经典形象」（引擎的 `setBackground(name, type, "noskin")`）：
 *   此时**必须**画立绘，不能画当前皮肤。
 */
function paintPortrait(node: HTMLDivElement, name: string, forceClassic = false) {
	const layers = ensureLayers(node);
	const url = resolvePortraitUrl(node, name, forceClassic);
	//setBackground 的 db: 分支是异步的（polyfill.ts:211-213），此刻读不到值；驶舰之向干员的立绘
	//一律走 lib.config.skin，到不了那个分支
	if (!url) return;
	layers.setImage(url);
	//**不写影子副本**：背板 `ui:background/default.png` 四边 alpha 只有 196~223（中心才 255），
	//子元素那层在边缘是半透明的 ⇒ 节点自身再留一份「未调位的原样」立绘就会从边上透出来，
	//与内层 cover 放大后的画面（实测 453%×366%）叠成重影。
	//
	//取舍：`game.logv` 的战报卡头像是 `cloneNode()` 浅克隆、`smoothAvatar`/`ui.fakeme` 抄内联样式，
	//这几处读不到子元素会变空白。但「场上/选将/武将卡三重影」是必须解决的问题，而这三处
	//只是个别面板的头像 —— 需要时再单独给它们补一层（不要退回写内联副本）。
	clearInlineBackground(node);
}

/**
 * 该干员当前生效的立绘/皮肤路径。
 *
 * 优先用本扩展的皮肤配置（`whichWaySkin.skinPathOf`）：
 * - 本扩展干员：没选皮肤时是立绘，选了就是皮肤目录里的真实文件；
 * - 其它武将：**只有玩家真的选过**才给出路径，否则返回 undefined 交回引擎。
 *
 * 为什么不能直接用引擎算出来的那条：引擎只会拼 `lib.config.skin[name][1]`，而这一份可能
 * - 是千幻按 `image/skin/{id}/{皮肤名}.jpg` 硬拼出来的、并不存在的路径（皮肤目录迁移之后尤其明显）；
 * - 或者压根没有（玩家选过皮肤，但合并前的那一帧）。
 * 本扩展的路径来自目录扫描，是真实存在的文件，所以两边都有时以本扩展为准。
 *
 * ⚠️ 但有**两类节点必须画立绘、不能画当前皮肤**：
 *
 * 1. `ext === "noskin"`：引擎约定的「忽略皮肤配置，画角色原图」标记（`init/polyfill.ts:145-149、205`）。
 *    引擎「更改皮肤」里的「经典形象」按钮、音频试听按钮都靠它要原图。
 * 2. **千幻的皮肤预览格**（带 `qh-not-replace`）：那里的「经典形象」是用
 *    `setBackground(name, "character")` 画的，**不带 `noskin`**
 *    （`qhly_newView.js:884`、`qhly_shoushaSkinCards.js:261`、`qhly_xiaochuangkouCommon.js:299`、
 *    `qhly-open-small.js:752` …）。它们本来能画对，是因为引擎会落到 `char.img` ——
 *    而干员的 `char.img` 就是立绘。
 *
 *    这些格子里**有皮肤的格子走的是 `setBackgroundImage(qhly_getSkinFile(…))`**
 *    （见 `qhly_newView.js:882` 的 `if (skinId)`），根本不会进到这里；所以凡是
 *    「带 `qh-not-replace` 的节点 + `setBackground(name, "character")`」就一定是经典形象那一格。
 *
 *    注意：这不是把 `qh-not-replace` 还原成「一票否决」——`isPortraitNode()` 仍然忽略它，
 *    双层绘制照旧接管、剪影照旧去掉；**只是换用「立绘」这条解析口径**。
 *    也不能靠「借引擎算一遍」来得到立绘：引擎的 `setBackground` 会优先读
 *    `lib.config.skin[name][1]`（`polyfill.ts:205-206`），而我们恰恰会把干员的选择写进那里，
 *    于是绕一圈又拿回当前皮肤 —— 这正是本 bug 的成因。所以这里直接取立绘路径。
 */
function resolvePortraitUrl(node: HTMLDivElement, name: string, forceClassic = false) {
	if (forceClassic || node.classList.contains("qh-not-replace")) {
		return toBackgroundUrl(whichWayFile.getCharacterPortraitPath(name));
	}
	const path = whichWaySkin.skinPathOf(name);
	if (path) return toBackgroundUrl(path);
	return firstLayer(resolveBackgroundImage(scratch => HTMLDivElement.prototype.setBackground.call(scratch, name, "character")));
}

/**
 * 给节点装重定向 —— 现在由**原型级** gate 统一接管（见 `installPrototypeRedirect`），
 * 本函数只保留为调用方兼容入口（`mountPortrait` 与三个绘制钩子仍在调它）。
 *
 * 为什么不再给节点装自有属性：那套写法只覆盖得到本扩展亲手拿到的节点（玩家头像、武将卡按钮），
 * 覆盖不到千幻聆音运行时 `ui.create.div()` 出来的卡片容器；两套判据并存时还会互相打架
 * （自有属性绕过 `isPortraitNode` 白名单，把 `.qh-not-replace` 的节点也抢过来）。
 * 统一走原型 gate 之后，「哪些节点归我们画」只说一遍。
 *
 * 注：原型 gate 是**按节点类名**判定的，`.avatar` / `.button.character` 都在白名单里，
 * 所以原先靠自有属性覆盖的那些节点照旧生效。
 */
function installRedirect(node?: HTMLDivElement) {
	if (!node) return;
	redirectedNodes.add(node);
	installPrototypeRedirect();
}

/**
 * 「承载武将立绘」的节点类名白名单。
 *
 * 为什么要白名单而不是无条件接管：原型级 `setBackground` 会被**所有** div 调用，
 * 无条件接管会把千幻/十周年UI 的边框、按钮、面板背景等一并画进两层 DOM（它们不需要透明底、
 * 也不该有 `pos.json` 的位置设定），副作用面太大。这里只认「真的画着一张武将立绘」的容器。
 *
 * 名单来源：
 * - 引擎：`.avatar` / `.avatar2`（旧布局）、`.primary-avatar` / `.deputy-avatar`（十周年UI 的
 *   `player-element.js` 用这两个类建玩家头像）、`.button.character`（`get.nodeintro` 的皮肤按钮）；
 * - 千幻聆音：`extension/content.js` 里 `ui.create.div('.xxx-avatar…')` 造出来的卡片容器
 *   （`.qh-avatar`、`.qh-shousha-big-avatar`、`.qh-image-standard/-lutou`、
 *   `.qh-page-skinavatarpicture/-lutou`）。
 * 新增主题若用了别的类名，往这里补一项即可。
 */
const PORTRAIT_NODE_CLASSES = [
	"avatar",
	"avatar2",
	"primary-avatar",
	"deputy-avatar",
	"qh-avatar",
	"qh-shousha-big-avatar",
	"qh-image-standard",
	"qh-image-lutou",
	"qh-page-skinavatarpicture",
	"qh-page-skinavatarpicture-lutou",
];

/**
 * 这个节点是否属于「武将立绘容器」。
 *
 * ⚠️ `.qh-not-replace` **不再一票否决**。千幻加这个类时（`content.js:10930` 等的
 * `skinView.avatar`、`17247` 的 `skin1/2/3`）本意是「千幻自己的 setBackground 包装层别接手」，
 * 而不是「驶舰之向也别丢剪影」；而这些皮肤预览格恰恰是最需要丢剪影的地方
 * （它们既有 `setBackground(name, "character")`、也有 `setBackgroundImage(单层图)` 两条绘制路径）。
 * `.qh-must-replace` 仍然表示「必须由我接管」的强意愿，保留短路。
 */
function isPortraitNode(node: HTMLElement): boolean {
	const classes = node?.classList;
	if (!classes) return false;
	if (classes.contains("qh-must-replace")) return true;
	//`.button` 单用太宽（普通按钮也是），必须是「武将卡按钮」这一种
	if (classes.contains("button") && classes.contains("character")) return true;
	return PORTRAIT_NODE_CLASSES.some(name => classes.contains(name));
}

/** 原型级重定向是否已安装（幂等） */
let prototypeRedirectInstalled = false;

/** 防止「我们的 gate ↔ 千幻的 qhly_origin_setBackground」互相调用形成死循环 */
let setBackgroundDepth = 0;

/**
 * 安装原型级重定向：让**千幻自己创建的卡片节点**也能套上两层背景。
 *
 * 为什么必须是原型级：千幻的卡片容器是它运行时 `ui.create.div()` 出来的，本扩展拿不到创建时机，
 * 逐个装自有属性（`installRedirect` 的做法）覆盖不到它们。
 *
 * 为什么还要接管 `qhly_origin_setBackground`：千幻把引擎原版 `setBackground` 存进了这个自有属性
 * （`content.js:8018`），并在很多路径里**直接调它**来「按原样画」。只在 `prototype.setBackground`
 * 上装 gate 的话，这些路径会整个绕过我们 —— 这正是「千幻卡片里照样透出
 * `image/character/default_silhouette_female.jpg`」的直接原因。
 *
 * 加载顺序两种都要成立：
 * - 千幻先加载 ⇒ `qhly_origin_setBackground` 是引擎原版，我们把它换成同一个 gate；
 * - 千幻后加载 ⇒ 它会把我们的 gate 存成 `qhly_origin_setBackground`，其调用照样进 gate。
 */
/**
 * 千幻「选将界面显示原皮」此刻是否生效 **并且** 这个节点正好是它要管的选将按钮。
 *
 * 为什么要在本扩展的拦截层里让路：千幻自己的 `setBackground` 补丁
 * （`Qhly_NewView/qhly_newViewRefresh.js:179-185`）确实对 `.button.character` 做了
 * 「`qhly_chooseButtonOrigin` 开启 ⇒ 直接走原皮」的短路，但我们的 gate 安装在
 * `HTMLDivElement.prototype.setBackground` / `setBackgroundImage` 上、**比它更外层**——
 * 不放行的话，干员在选将界面会被我们画成「当前皮肤」，那个设置看起来完全不生效。
 *
 * 判据必须与千幻逐字对齐，否则会出现「设置开着但某些格子仍是皮肤」的半生效状态。
 * 不要求 `isArkOperator`：本体武将、其它扩展角色也可能挂在同一个选将按钮上。
 */
function yieldToQhlyOriginButton(node: HTMLElement): boolean {
	const config = (lib.config ?? {}) as any;
	//⚠️ 必须用 **truthy** 判断，与千幻逐字一致（`qhly_newViewRefresh.js:179` 也是 `if(lib.config.qhly_chooseButtonOrigin)`）：
	//`game.saveConfig` 存下来的可能是布尔 `true`，也可能是字符串 `"true"`（不同版本的配置项写法不同），
	//用 `=== true` 会在后者上静默失效，表现就是「设置开着但选将界面照样显示皮肤」。
	if (!config.qhly_chooseButtonOrigin) return false;
	//千幻没启用时它根本不会跑，这个设置也就没有意义
	const list = config.extensions;
	if (!Array.isArray(list) || !list.includes("千幻聆音")) return false;
	if (config["extension_千幻聆音_enable"] === false) return false;
	//与千幻 `:179-184` 完全同构：同时带 `character` / `button` 两个类
	return node.classList.contains("character") && node.classList.contains("button");
}

function installPrototypeRedirect() {
	if (prototypeRedirectInstalled) return;
	prototypeRedirectInstalled = true;

	const proto = HTMLDivElement.prototype as any;
	/** 真正的引擎原版（千幻若已加载，原版被它存进了 `qhly_origin_setBackground`） */
	const engineSetBackground = proto.qhly_origin_setBackground || proto.setBackground;
	const previousSetBackground = proto.setBackground;

	/**
	 * 白名单命中就画两层背景，否则原样交给上一级实现。
	 * 用 `setBackgroundDepth` 兜底：万一千幻的包装层又回调 `qhly_origin_setBackground`，
	 * 重入时一律走引擎原版，不参与 gate，避免无限递归。
	 */
	function gateSetBackground(this: HTMLDivElement, name: any, type: any, ext: any, subfolder: any) {
		//`"noskin"` 是引擎约定的「忽略皮肤配置、画角色原图」标记（`init/polyfill.ts:145-149`）：
		//千幻的「经典形象」预览格、引擎「更改皮肤」里的经典按钮都靠它要原图。
		//不认它的话，这些位置会被画成「当前选中的皮肤」—— 即「设了皮肤后经典形象显示成该皮肤」。
		const forceClassic = ext === "noskin";
		if (setBackgroundDepth === 0 && type === "character" && isArkOperator(name) && isPortraitNode(this)) {
			//「选将界面显示原皮」：**仍然由我们画**，只是把图换成立绘（`forceClassic`）。
			//
			// ⚠️ 不能像以前那样 `return engineSetBackground(...)` 把节点交回去：
			// 引擎的 `setBackground` 最后一步是 `setBackgroundImage([立绘, 保底图])`，
			// 交回去就等于把 `url(立绘), url(default_silhouette_*.jpg)` 两层写回节点 ——
			// 灰色剪影重新出现，同时本扩展的背板也没了（表现为「背景不见了 + 剪影回来了」）。
			// 我们的两层结构本来就能画立绘，直接复用它即可。
			const showOrigin = forceClassic || yieldToQhlyOriginButton(this);
			setBackgroundDepth++;
			try {
				paintPortrait(this, name, showOrigin);
			} catch (error) {
				console.error("[whichWaySkin] 双层立绘绘制失败，回落到引擎原流程", error);
				return engineSetBackground.call(this, name, type, ext, subfolder);
			} finally {
				setBackgroundDepth--;
			}
			return this;
		}
		//不归我们管的节点（或重入）：先撤掉可能残留的两层背景，否则会盖住引擎画的图
		if (setBackgroundDepth === 0) layersOf(this)?.dispose();
		setBackgroundDepth++;
		try {
			return previousSetBackground.call(this, name, type, ext, subfolder);
		} finally {
			setBackgroundDepth--;
		}
	}

	proto.setBackground = gateSetBackground;
	//千幻的「按原样画」入口也接到同一个 gate 上；非白名单节点直接走引擎原版，不经过千幻的包装层
	proto.qhly_origin_setBackground = function (this: HTMLDivElement, name: any, type: any, ext: any, subfolder: any) {
		if (type === "character" && isArkOperator(name) && isPortraitNode(this)) {
			//「选将界面显示原皮」/ `noskin`：由我们画立绘（两层结构照旧，只换图）。
			//同样**不能**交回 `engineSetBackground` —— 那会写回 `[立绘, default_silhouette_*]` 两层。
			const showOrigin = ext === "noskin" || yieldToQhlyOriginButton(this);
			try {
				paintPortrait(this, name, showOrigin);
				return this;
			} catch (error) {
				console.error("[whichWaySkin] 双层立绘绘制失败，回落到引擎原流程", error);
			}
		}
		return engineSetBackground.call(this, name, type, ext, subfolder);
	};
}

/**
 * 这张图是不是「某位**官方**方舟干员的立绘/皮肤」——`setBackgroundImage` 要不要接管的判据。
 *
 * 为什么要这道判据（而不是「白名单节点就接管」）：`setBackgroundImage` 的调用方远多于
 * `setBackground`，绝大多数只想贴一张单层装饰图 —— 游戏背景、千幻的装饰底板、边框、角标…
 * 它们同样可能挂在白名单节点上（或压根不在），一律接管会把两层 DOM 铺到不该铺的地方。
 *
 * 判据复用 `resolvePortraitKey`（它内部只认 `whichWayArknight.isArknght()`，即
 * `character_table` + `patchChars` 里的官方 uid），因此：
 * - 官方干员的立绘/皮肤目录路径 ⇒ true；
 * - **本扩展自造 id**（`acemrfz`、`plot_keluxiermrfz`…）⇒ false：它们没有官方立绘，
 *   也就没有「透明区透出保底图」的问题，本来就不需要两层绘制；
 * - 本体武将 `image/skin/…`、千幻自带皮肤包 `sanguoskin/…`、各种装饰图 ⇒ false。
 *
 * 数组入参直接判 false：那是引擎 `setBackground(name, "character")` 内部拼好的
 * `[立绘, 保底图]`，应该交给 `setBackground` 那条 gate 处理，这里再接管会重复绘制。
 */
function isOperatorImage(img: unknown): boolean {
	if (Array.isArray(img)) return false;
	if (typeof img !== "string" || img.length === 0) return false;
	return resolvePortraitKey(img) !== undefined;
}

/**
 * 把千幻「直接贴图」与十周年UI「出框图」的路径同步到两层背景上。
 *
 * 两个来源都会**绕过 `setBackground`**、直接写节点背景：
 * - 千幻：`skinView2.qhly_origin_setBackgroundImage(file)` / `currentSkinView.setBackgroundImage(...)`
 *   （`content.js:16685`、`14545` 等），只写单层图；
 * - 十周年UI：`outcropAvatar.js` 在 `setBackground` 之后用 `setTimeout(() => c(name, node))` 把
 *   **出框图**直接写进 `node.style.backgroundImage`，同样不经过这里。
 *
 * 我们的两层背景是**子元素**、会盖在节点自身背景之上，所以不跟着同步就会一直显示旧图
 * （表现为「换了皮肤没反应」或「出框图不生效」）。
 *
 * 接管条件是「白名单节点 + 图确实是官方干员的立绘/皮肤」（见 `isOperatorImage`），
 * 因此装饰图、背景图一律原样透传，不扩大接管面。
 */
function installPrototypeBackgroundImageRedirect() {
	const proto = HTMLDivElement.prototype as any;
	if (proto.__whichWayBackgroundImageGated) return;
	proto.__whichWayBackgroundImageGated = true;

	const previous = proto.setBackgroundImage;
	proto.setBackgroundImage = function (this: HTMLDivElement, img: any) {
		//⚠️ 重入保护（顺序必须在最前面）：`gateSetBackground` 在 `setBackgroundDepth++` 期间
		//会调 `paintPortrait`，而引擎 `setBackground` 内部还会再调一次
		//`setBackgroundImage([立绘, 保底图])` —— 那一次必须**原样透传**。
		//不拦的话它会命中下面的数组分支/让路分支，`dispose()` 掉刚建好的两层子元素，
		//结果就是「开了显示原皮后图片直接没了」（节点上既没有 host 也没有 background-image）。
		//但透传也不能原样给数组：那样 `default_silhouette` 又会被写回节点、从我们的透明处透出来。
		//所以只取第一层（立绘/皮肤）——两层结构已经由 `paintPortrait` 负责画了。
		if (setBackgroundDepth > 0) {
			//两层结构已经由 `paintPortrait` 画好了：这一次**什么都不写**。
			//写数组会带回 `default_silhouette`，写单层又会和子元素叠成重影 —— 直接吞掉最干净。
			//（`paintPortrait` 末尾会 `clearInlineBackground`，节点内联保持为空。）
			if (layersOf(this)) return this;
			//没有两层结构（说明这次不是我们画的）：退回原实现，别改变引擎语义
			return previous.call(this, img);
		}
		//⚠️ 数组入参必须单独处理：引擎 `setBackground` 最后一步是
		//`setBackgroundImage([立绘, lib.characterDefaultPicturePath + sex])`，
		//而 `isOperatorImage` 对数组恒返回 false（见它的注释），下面那个 `if` 会把它**整体透传**给原实现，
		//于是 `url(立绘), url(default_silhouette_*.jpg)` 两层被原样写回节点 ——
		//第二层那张**灰色剪影**就会从我们这层的透明/半透明处透出来，看起来就是「立绘上盖了一块灰色遮罩」。
		//
		//只处理「白名单节点 + 第一层确实是本扩展能认的干员立绘/皮肤」这种明确情形，
		//其余数组（`db:`、`mode:`、本体武将的 `[img, 保底图]` 等）一律原样交回，不改变引擎语义。
		if (Array.isArray(img)) {
			const first = img.find((item: unknown) => typeof item === "string" && item.length > 0);
			if (typeof first === "string" && isPortraitNode(this) && isOperatorImage(first)) {
				const url = firstLayer(resolveBackgroundImage(scratch => previous.call(scratch, img)));
				if (!url) return previous.call(this, img);
				(layersOf(this) ?? ensureLayers(this)).setImage(url);
				clearInlineBackground(this);
				return this;
			}
			return previous.call(this, img);
		}
		if (!isPortraitNode(this) || !isOperatorImage(img)) {
			return previous.call(this, img);
		}
		//「选将界面显示原皮」的取舍只在 `gateSetBackground` / `qhly_origin_setBackground` 那两处决定
		//（它们直接调 `paintPortrait(..., showOrigin)`）；这里收到的是**已经算好的一张图**，
		//照单贴进两层即可。以前这里也让路 + `dispose()`，结果是引擎随后写回
		//`[立绘, 保底图]` 又被 MutationObserver 清空 ⇒ 「开了显示原皮后图片直接没了」。
		try {
			//先让原实现算一遍（它负责拼 lib.assetURL、处理数组、URL.canParse 等），再取出第一层
			const url = firstLayer(resolveBackgroundImage(scratch => previous.call(scratch, img)));
			if (!url) return previous.call(this, img);
			const layers = layersOf(this) ?? ensureLayers(this);
			layers.setImage(url);
			//同 `paintPortrait`：背板边缘是半透明的，节点自身再留一份内联立绘就会叠出重影
			clearInlineBackground(this);
			return this;
		} catch (error) {
			console.error("[whichWaySkin] 同步皮肤图失败，回落到引擎原流程", error);
			return previous.call(this, img);
		}
	};
}

/**
 * 让「外部直接写内联样式」的图也能落到两层背景上（十周年UI 出框图优先，方案 A）。
 *
 * 十周年UI 的 `outcropAvatar.js` 是这么做的（`setupOutcropAvatar()` 里）：
 * ```js
 * const y = HTMLDivElement.prototype.setBackground;      // 保存"当时"的实现
 * HTMLDivElement.prototype.setBackground = function (name, type) {
 *     const result = y.call(this, name, type);
 *     if (type === "character") setTimeout(() => c(name, this), 0);  // c 内部：
 *     //   node.style.backgroundImage = `url("…出框图…")`   ← 绕过 setBackgroundImage
 *     return result;
 * };
 * ```
 * 也就是说它**只写内联样式**，我们在 `setBackground` / `setBackgroundImage` 上装的门都拦不到，
 * 结果是「子元素还画着立绘、内联样式已经换成出框图」⇒ 两层叠加，正是要消除的「影子」。
 *
 * 处理办法（尊重出框图，不夺它的优先级）：
 * - 用 `MutationObserver` 盯 `style` 变化。观察到内联 `background-image` 已经**不等于**我们
 *   两层背景当前那张图时，把这张图同步进两层背景；
 * - 同步时把节点内联样式清掉（置空）—— 图已经画进子元素了，内联那份留着就是叠影；
 * - 只对「已经套了两层背景」的节点生效（`layersOf` 存在），所以装饰节点、普通节点不受影响。
 *
 * 为什么用 `MutationObserver` 而不是改写 `style` 的 setter：`backgroundImage` 是 CSSStyleDeclaration
 * 的属性，逐个包 setter 既覆盖不全（`cssText`、`setProperty`、`style.background` 都会绕过），
 * 也会和其它扩展（十周年UI 自己、千幻）的劫持互相踩。观察属性变化是唯一稳妥的入口。
 */
function watchExternalBackground(node: HTMLDivElement) {
	if (externalWatchers.has(node)) return;
	const layers = layersOf(node);
	if (!layers) return;

	const observer = new MutationObserver(() => {
		const current = layersOf(node);
		if (!current) return;
		//这一轮内联样式是我们自己写的影子副本（paintPortrait / setBackgroundImage 同步），
		//不是外部改动 —— 直接忽略，否则会把「我们画的图」又当成外部图回灌一遍。
		if (selfWritingNodes.has(node)) return;
		const inline = node.style.backgroundImage;
		if (!inline || inline === "none") return;
		const external = firstLayer(inline);
		//和我们画的是同一张（含仅引号/序列化差异）：
		//⚠️ 这里**也必须清掉节点内联**，不能直接 return。
		//引擎的 `setBackgroundImage([立绘, lib.characterDefaultPicturePath + sex])` 写的是
		//`url(立绘), url(default_silhouette_*.jpg)` —— `firstLayer` 取到的是立绘、正好等于
		//`current.url`，早返回就会把**第二层那张灰色剪影**永久留在节点上；
		//它会从我们这层的透明/半透明处透出来，观感就是「立绘上盖了一块灰色遮罩」。
		//（`default_silhouette` 正是本扩展存在的理由，绝不能让它在别处漏回来。）
		if (!external || external === current.url) {
			clearInlineBackground(node);
			return;
		}
		//外部改成了别的图（十周年UI 出框图、千幻预览图…）：以它为准，同步进两层背景
		selfWritingNodes.add(node);
		try {
			current.setImage(external);
			//清掉内联那份，否则会和子元素叠成两层
			node.style.backgroundImage = "";
		} finally {
			//MutationObserver 是异步批送的：等这一批回调走完再解除标记
			queueMicrotask(() => selfWritingNodes.delete(node));
		}
	});

	observer.observe(node, { attributes: true, attributeFilter: ["style"] });
	externalWatchers.set(node, observer);
}

/**
 * 立绘重绘钩子：凡是本扩展画上去的立绘，都先确认一下动皮层是不是与当前皮肤一致。
 *
 * 为什么放在绘制入口而不是换肤函数里：换肤、同步存档、开局这几个时机的顺序并不固定
 * （皮肤面板可能在选将界面、可能在局内，存档同步又发生在引擎 init 末尾），
 * 而「画一次」是它们唯一的公共动作 —— 挂在这里，任何一次重绘都会把动皮状态带正。
 */
function ensureDynamicSkin(node: HTMLDivElement | undefined, name: string) {
	if (!node || typeof name !== "string" || !layersOf(node)) return;
	try {
		spineWorker.updateDyc(name, node);
	} catch (error) {
		console.error("[whichWaySkin] 更新动皮失败", error);
	}
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
	//同 `paintPortrait`：背板边缘半透明，节点自身再留一份内联立绘就会与子元素叠成重影
	clearInlineBackground(node);
	return true;
}

onContent({
	name: "whichWaySkinAvatarBackground",
	fn: () => {
		//必须在最前面：引擎与千幻的绘制发生在对局里，晚一步装不上原型就覆盖不到千幻自己建的卡片节点。
		//两者都幂等，重复调用无副作用。
		installPrototypeRedirect();
		installPrototypeBackgroundImageRedirect();

		whichWayAPIOverride.appendHook("lib.element.player.$init", {
			before(this: any) {
				//头像节点从建好到销毁都不会被换掉，这里装一次即可覆盖后续所有绘制路径
				installRedirect(this.node.avatar);
				installRedirect(this.node.avatar2);
			},
			after(this: any, result: any, character: string, character2?: string) {
				//主将的静态立绘由 $init 自己那次 setBackground 画好了（重定向拦下来了）；这里补的是动皮：
				//两条绘制入口（引擎的 $init / 本扩展的 updateDyc）谁先谁后并不固定，
				//等整局初始化走完再确认一次，才不会出现「开局显示立绘、动皮没挂上」
				ensureDynamicSkin(this.node?.avatar, character);
				if (character2) ensureDynamicSkin(this.node?.avatar2, character2);
				return result;
			},
		});

		whichWayAPIOverride.appendHook("lib.element.player.$reinit", {
			before(this: any) {
				//$init 已经装过，这里是幂等的兜底：万一头像节点被别的代码换掉，重定向还在
				installRedirect(this.node.avatar);
				installRedirect(this.node.avatar2);
			},
			after(this: any, result: any, character: string, character2?: string) {
				ensureDynamicSkin(this.node?.avatar, character);
				if (character2) ensureDynamicSkin(this.node?.avatar2, character2);
				return result;
			},
		});

		whichWayAPIOverride.appendHook("ui.create.buttonPresets.character", {
			after(result: any) {
				//按钮节点是在预设内部建的，before 拿不到，只能画完再补：用 link 而不是入参 item，
				//因为 characterx 会在内部把 item 换成 lib.characterReplace 里的随机一个
				const name = result?.link;
				if (!isArkOperator(name)) return;
				//⚠️ 这条路径**不经过** `setBackground` / `setBackgroundImage` 的 gate，它是直接调
				//`paintPortrait` 的，所以「显示原皮」的判断要在这里再做一次 —— 但**仍然由我们画**，
				//只是把图换成立绘（`showOrigin`）。不能 `dispose()` 后交给引擎：
				//那样会写回 `[立绘, default_silhouette_*]`，剪影重现且背板消失。
				installRedirect(result);
				paintPortrait(result, name, yieldToQhlyOriginButton(result));
			},
		});
	},
});
