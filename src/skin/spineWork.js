import { spineWhichWay as spine } from "../../lib/spine-player.js";
import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../utill.js";
import { whichWayToast } from "../toast/index.ts";
import { onSetDev } from "../hooks/index.js";
import { whichWayFile } from "../file.js";

// ============ unpackPremultipliedAlpha 支持 ============
// 与千幻聆音同方案：为需要「预乘 alpha 上传」的动皮纹理，在 texImage2D 上传前临时打开
// gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL（上传后复位）。适合美术导出为 straight-alpha 但按
// premultiplied 混合（premultipliedAlpha=true）渲染的 Spine 素材，可消除半透明黑边/发暗。
const WW_UNPACK_MARK = "__whichWayUnpackPremultiply";

/** 幂等 patch spine.webgl.GLTexture.update：按 image 标记决定是否预乘上传 */
function patchSpineGLTextureUnpackOnce() {
	const glt = spine?.webgl?.GLTexture;
	if (!glt || !glt.prototype || glt.prototype.update.__whichWayUnpackPatched) return;
	const orig = glt.prototype.update;
	glt.prototype.update = function (useMipMaps) {
		const gl = this.context && this.context.gl;
		let opened = false;
		const img = this._image;
		if (gl && gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null && img && img[WW_UNPACK_MARK]) {
			gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
			opened = true;
		}
		try {
			return orig.call(this, useMipMaps);
		} finally {
			if (opened && gl && gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL != null) {
				gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
			}
		}
	};
	glt.prototype.update.__whichWayUnpackPatched = true;
}
patchSpineGLTextureUnpackOnce();

/**
 * 为该 SpinePlayer 的 AssetManager 包一层 textureLoader：资源图片加载前打上「预乘上传」标记。
 * SpinePlayer 构造（render()）已发起异步加载，图片 onload 一定晚于本函数的同步执行，故安全。
 */
function wrapSpinePlayerUnpack(player) {
	if (!player || !player.assetManager) return;
	const unpack = !!player.config?.unpackPremultipliedAlpha;
	const am = player.assetManager;
	const orig = am.textureLoader;
	if (typeof orig !== "function") return;
	if (orig.__whichWayUnpackWrapped) return;
	am.textureLoader = function (image) {
		try {
			if (image) {
				if (unpack) image[WW_UNPACK_MARK] = true;
				else delete image[WW_UNPACK_MARK];
			}
		} catch (e) {
			/* ImageBitmap / 不可扩展对象等 */
		}
		return orig(image);
	};
	am.textureLoader.__whichWayUnpackWrapped = true;
}

/**
 * 解析动皮容器的**宿主元素**（容器最终要挂进去、并与之等大的那个元素）。
 *
 * 之所以不直接用 `target`：
 * - `loadDyc` 的 target 可能是 Player 对象（`node.avatar` 才是头像）；
 * - 也可能是 `div.player` 这类元素（调用方直接传了玩家节点，而头像在它内部）；
 * 实测出现过容器落在 `div.player`（120x180）里头像只有 114x174 的情况，
 * 容器于是永远比头像大一圈。
 *
 * @param {any} target loadDyc / updateDyc 收到的目标（Player 或元素）
 * @param {HTMLElement} container 动皮容器
 * @returns {HTMLElement|null} 宿主元素
 */
function resolveHost(target, container) {
	if (!target) return container?.parentElement ?? null;
	const avatar = target.node?.avatar ?? target.querySelector?.(".avatar");
	if (avatar) return avatar;
	if (target.nodeType === 1) return target;
	return container?.parentElement ?? null;
}

const dycSave = window.whichWaySave.dycSave;

class SpineWorker {
	backgroundPath = `${lib.assetURL}extension/WhichWay/dynamicSkin/background/`;

	spineCache = new Map();

	eventListenersMap = new WeakMap();

	get banSkin() {
		if (lib.config.banSkinSJZX === void 0) lib.config.banSkinSJZX = {};
		return lib.config.banSkinSJZX;
	}

	/**
	 * 切换动皮开启与关闭
	 * @param {String | Player} name 玩家名
	 * @param {String} skinName 皮肤名
	 */
	toggleDycSkin(name, skinName) {
		//@ts-ignore
		if (get.itemtype(name) === "player") name = name.name;
		if (typeof name !== "string") throw new Error("参数name必须是 String 或 Player！");
		if (typeof skinName !== "string") throw new Error("参数skinName必须是 String！");

		if (spineWorker.banSkin?.[name]?.[skinName]) spineWorker.banSkin[name][skinName] = false;
		else {
			if (!spineWorker.banSkin[name]) spineWorker.banSkin[name] = {};
			spineWorker.banSkin[name][skinName] = true;
		}

		game.saveConfig("banSkinSJZX", spineWorker.banSkin);

		return spineWorker.banSkin;
	}

	/**
	 * 判断指定角色和皮肤的动态皮肤是否启用
	 * @param {String | Player} name 玩家名
	 * @param {String} skinName 皮肤名
	 * @returns {boolean}
	 */
	isEnabledSkin(name, skinName) {
		//@ts-ignore
		if (get.itemtype(name) === "player") name = name.name;
		//@ts-ignore
		return !this.banSkin?.[name]?.[skinName];
	}

	/**
	 * 获取指定角色和皮肤的动态皮肤数据
	 * @param {string} charName - 角色名称
	 * @param {string} skinName - 皮肤名称
	 * @param {boolean} [noGetAll=false] - 当charName或skinName未定义时，是否返回所有资产数据
	 * @returns {Object|undefined} 找到的皮肤数据对象，未找到时返回undefined
	 */
	getSkinData(charName, skinName, noGetAll) {
		let assets = dycSave.assets;
		if (charName === void 0 || skinName === void 0) return noGetAll ? assets : undefined;
		for (let name in assets) {
			if (charName !== name) continue;
			for (let assetsSkinName in assets[name]) {
				if (assetsSkinName !== skinName) continue;
				return assets[name][assetsSkinName];
			}
		}
		if (whichWayUtil.isDeveloperMode()) console.warn(`【驶舰之向】:未找到角色 ${charName} 的皮肤 ${skinName} !`);
		return undefined;
	}

	getUrl(name, skinName, file, fileExtension) {
		const fileExtensionMap = {
			j: "json",
			a: "atlas",
			s: "skel",
		};
		if (fileExtension.length === 1 && fileExtensionMap[fileExtension]) fileExtension = fileExtensionMap[fileExtension];
		return `${lib.assetURL}extension/WhichWay/dynamicSkin/illust/${name}/${skinName}/${file}.${fileExtension}`;
	}

	dispose(player) {
		if (player.disposed) return;
		player.disposed = true;

		//移除缓存中的记录
		let cache = this.spineCache;
		let dycSave = cache.get(player.config.dynamicName);
		if (Object.keys(dycSave).length === 1) cache.delete(player.config.dynamicName);
		else {
			for (let name in dycSave) {
				let info = dycSave[name];
				if (info.from === player.container) {
					delete dycSave[name];
				}
			}
		}

		window.removeEventListener("resize", player.drawFrame);

		const container = player.parent;

		player.stopRendering();

		if (player.cancelId) {
			clearTimeout(player.cancelId);
		}

		if (player.animationState) {
			player.animationState.clearTracks();
			player.animationState.clearListeners();

			let entry = player.animationState.getCurrent(0);
			if (entry) {
				player.animationState.disposeNext(entry);
				player.animationState.setEmptyAnimation(0, 0);
			}

			player.animationState = null;
		}

		if (player.skeleton) player.skeleton = null;

		if (player.skeletonData) player.skeletonData = null;

		if (player.sceneRenderer) {
			player.sceneRenderer.dispose();
			player.sceneRenderer = null;
		}

		if (player.assetManager) player.assetManager.dispose();

		if (player.context && player.context.gl) {
			const gl = player.context.gl;
			gl.getExtension("WEBGL_lose_context")?.loseContext();
			player.context = null;
		}

		//断开尺寸监听（容器被移除后不必再贴合）
		container?.__whichWayResizeObserver?.disconnect?.();

		if (container) container.remove();
	}

	loadDyc(charName, skinName, target, config) {
		let data = dycSave.assets;
		let dynamicName = `${charName}_${skinName}`;

		if (this.banSkin?.[charName]?.[skinName] === true) return;

		dycSave.startFit = {
			dycLoaded: false,
			decadeUIFit: false,
			parent: target,
			container: undefined,
		};
		let startFit = new Proxy(dycSave.startFit, {
			set(target, key, newValue, receiver) {
				target[key] = newValue;
				if (target.dycLoaded && target.decadeUIFit) {
					if (whichWayUtil.isDeveloperMode()) console.log("【驶舰之向】:已调整动态皮肤：", target.container);
					//这里拿到的 startFit.parent 是 updateDyc 的 target（可能是 Player），
					//统一交给 resolveHost 解析成真正的宿主元素
					fit(target.container, resolveHost(target.parent, target.container));
					//@ts-ignore
					delete dycSave.startFit;
				}
				return true;
			},
		});
		if (data[charName] && data[charName][skinName]) {
			let options = data[charName][skinName];
			let urlSkel, urlAtlas;
			let bgUrl = this.backgroundPath + options.background.split("/").pop();
			const container = ui.create.div(".sjzxDycWrapper", target);
			container.id = "sjzxDycWrapper-animation";
			container.hide();

			//@ts-ignore
			dycSave.startFit.container = container;

			const bg = ui.create.div(".bg", container);
			bg.style.backgroundImage = `url(${bgUrl})`;
			if (options.name) {
				if (options.json) urlSkel = this.getUrl(charName, skinName, options.name.split("/").pop(), "j");
				else urlSkel = this.getUrl(charName, skinName, options.name.split("/").pop(), "s");
				urlAtlas = this.getUrl(charName, skinName, options.name.split("/").pop(), "a");
			}

			if (!config)
				config = {
					dynamicName: dynamicName,
					skelUrl: urlSkel,
					//@ts-ignore
					jsonUrl: urlSkel.endsWith(".json") ? urlSkel : undefined,
					atlasUrl: urlAtlas,
					showControls: false,
					animations: Array.isArray(options.action) ? options.action : [options.action],
					weighting: Array.isArray(options.weighting) ? options.weighting : [options.weighting],
					alpha: true,
					backgroundColor: "#00000000",
					debug: {
						bones: false,
						regions: false,
						meshes: false,
						boundingBoxes: false,
						paths: false,
						skins: false,
						attachments: false,
						hulls: false,
					},
				showLoading: false,
				premultipliedAlpha: options.alpha || false,
				unpackPremultipliedAlpha: !!options.unpackPremultipliedAlpha,
				preserveDrawingBuffer: true,
					viewport: {
						x: 0,
						y: 0,
						width: target.clientWidth,
						height: target.clientHeight,
						padLeft: 0,
						padRight: 0,
						padTop: 0,
						padBottom: 0,
					},
					originalOptions: options,
					container: target,
					error: function (reason) {
						console.error(reason);
					},
					success: function (player) {
						spineWorker.setSkeletonPosition(player, player.config.originalOptions);
						spineWorker.playRandomAnimation(player.skeleton, player.animationState, player.config.weighting);
						startFit.dycLoaded = true;
						container.show();
					},
				};

			//@ts-ignore
			const player = new spine.SpinePlayer(container, config);
			wrapSpinePlayerUnpack(player);

			//供 fit() 重算骨骼位置
			container.__whichWaySpinePlayer = player;

			let cache = spineWorker.spineCache;
			if (!cache.get(dynamicName)) cache.set(dynamicName, {});
			let dycSkin = cache.get(dynamicName);
			if (get.itemtype(target) === "player") {
				if (!dycSkin[target.playerid]) dycSkin[target.playerid] = {};
				dycSkin[target.playerid]["default"] = player;
				dycSkin[target.playerid]["from"] = target;
				target.dycSJZX = player;
			} else {
				let className = target.className;
				if (!dycSkin[className]) dycSkin[className] = {};
				dycSkin[className]["default"] = player;
				dycSkin[className]["from"] = target;
			}

			const added = `removeAdded_${dynamicName}`;
			if (target.dataset[added] !== "true") {
				target.dataset[added] = "true";
				target.onRemoved(() => {
					let isPlayer = get.itemtype(target) === "player";
					let dycSkins = dycSkin[isPlayer ? target.playerid : target.className];
					for (let key in dycSkins) {
						if (get.is.object(dycSkins[key])) {
							spineWorker.dispose(dycSkins[key]);
						}
					}
					delete dycSkin[isPlayer ? target.playerid : target.className];
				});
			}

			if (get.itemtype(target) === "player") {
				target.node.avatar.appendChild(container);
				target.node.avatar.style.overflow = "hidden";
				setTimeout(() => {
					startFit.decadeUIFit = true;
				}, 1000);
			}

			//宿主解析 → 搬进宿主 → 贴合，并在之后布局/缩放变动时补贴合。
			//
			//这里刻意不再依赖 `get.itemtype(target) === "player"` 这类判定：
			//`ui.create.div(cls, target)` 对 Player / 元素的落点并不确定，实测出现过容器落在
			//div.player（120x180）里、而头像只有 114x174 的情况 —— 容器于是永远大一圈。
			//统一由 resolveHost() 解析出 avatar 并把容器搬进去，保证「包含块」「量到的尺寸」
			//「实际摆放位置」三者是同一个元素。
			const host = resolveHost(target, container);
			if (host && container.parentElement !== host) host.appendChild(container);
			container.__whichWayFitTarget = target;
			container.__whichWayFitHost = host;
			if (host) {
				fit(container, host);
				//布局 / 界面缩放常在这之后才稳定（UI 扩展也会在这段时间改尺寸），补几次贴合
				[600, 1500].forEach(ms => {
					setTimeout(() => {
						const current = container.__whichWayFitHost;
						if (container.isConnected && current?.isConnected) fit(container, current);
					}, ms);
				});
				if (typeof ResizeObserver !== "undefined") {
					const observer = new ResizeObserver(() => {
						const current = container.__whichWayFitHost;
						if (current?.isConnected) fit(container, current);
					});
					observer.observe(host);
					container.__whichWayResizeObserver = observer;
				}
			}
			return player;
		} else console.error(`no skin data ${charName} ${skinName}`);

		/**
		 * 让动皮容器贴合父元素：渲染尺寸与父元素**完全一致**（放大 time 倍再用 zoom 缩回，保证画质）。
		 *
		 * 原先这里把容器尺寸按 "2:3" 比例调整、并只把父元素尺寸当**下限**，
		 * 于是 114×174 的 avatar 会得到 120×180 的容器而溢出父元素边界。
		 *
		 * 父元素尺寸变化时由 ResizeObserver 再次调用，所以对同一尺寸做了幂等处理。
		 *
		 * @param {HTMLElement} container 动皮容器（.sjzxDycWrapper）
		 * @param {HTMLElement} parent 父元素（avatar / 立绘等）
		 * @param {HTMLElement} host 宿主元素（avatar / 立绘等）
		 */
		function fit(container, host) {
			if (!container?.isConnected || !host?.isConnected) return;

			const width = host.clientWidth;
			const height = host.clientHeight;
			if (!width || !height) return;

			const sizeKey = `${width}x${height}`;
			if (container.dataset.dycFitSize !== sizeKey) {
				container.dataset.dycFitSize = sizeKey;

				//容器是 absolute：宿主若是 static，它会以更外层的定位元素为包含块，
				//left:0 与百分比都会算到那个盒子上。顺手把宿主变成包含块（已是定位元素就跳过）。
				if (getComputedStyle(host).position === "static") host.style.position = "relative";

				//容器尺寸 = 宿主尺寸，一一对应（宿主自己的圆角 / overflow 照旧生效）
				const oldTransition = container.style.transition;
				container.style.transition = "none";
				container.style.width = `${width}px`;
				container.style.height = `${height}px`;
				container.style.zoom = "";
				container.style.left = "0";
				container.style.top = "0";
				void container.offsetWidth;
				container.style.transition = oldTransition;

				//画布：CSS 尺寸铺满容器；**渲染缓冲**交给 enableSupersampling 处理。
				//不能在这里直接写 canvas.width —— 库的渲染循环每帧都会调用
				//`SceneRenderer.resize(ResizeMode.Expand)` 把它重置成 CSS 尺寸，
				//所以"只写一次缓冲"会被下一帧覆盖（这正是之前超采样不生效的原因）。
				const spinePlayer = container.__whichWaySpinePlayer;
				const canvas = spinePlayer?.canvas;
				if (canvas?.style) {
					canvas.style.width = "100%";
					canvas.style.height = "100%";
				}
				if (spinePlayer) {
					//按当前容器尺寸更新超采样系数，并立刻应用一次（不等下一帧）
					spineWorker.enableSupersampling(spinePlayer);
				}
				//尺寸变了：骨骼按新的容器尺寸重新摆位（骨骼坐标与画布缓冲无关）
				if (spinePlayer?.skeleton) spineWorker.setSkeletonPosition(spinePlayer, spinePlayer.config.originalOptions);
			}

			//回读校验：容器实际渲染尺寸必须等于宿主尺寸，不一致就下一帧重试（最多 3 次）。
			//这样无论夹在中间的是布局未稳定、UI 扩展改尺寸还是挂错宿主，最终状态都必然对齐。
			const rect = container.getBoundingClientRect();
			const aligned = Math.abs(rect.width - width) < 1 && Math.abs(rect.height - height) < 1;
			if (whichWayUtil.isDeveloperMode()) {
				const canvas = container.__whichWaySpinePlayer?.canvas;
				console.log(
					`[whichWayDyc] fit host=${host.className || host.tagName} ${width}x${height}` +
						` -> container ${Math.round(rect.width)}x${Math.round(rect.height)}` +
						(canvas ? `, buffer ${canvas.width}x${canvas.height}` : "") +
						(aligned ? "" : " (retry)")
				);
			}
			if (!aligned) {
				const tries = (container.__whichWayFitTries || 0) + 1;
				container.__whichWayFitTries = tries;
				if (tries <= 3) {
					requestAnimationFrame(() => {
						const current = container.__whichWayFitHost;
						if (container.isConnected && current?.isConnected) fit(container, current);
					});
				}
			} else {
				container.__whichWayFitTries = 0;
			}
		}
	}

	/**
	 * 播放完当前动画后，随机播放另一个动画
	 * @param {*} skeleton - Spine 骨骼实例
	 * @param {*} animationState - AnimationState 实例
	 * @param {number[]} weighting - 权重
	 * @param {boolean} [loop=false] - 是否循环播放
	 */
	playRandomAnimation(skeleton, animationState, weighting, loop = false) {
		animationState.addListener({
			complete: () => {
				play(skeleton, animationState, weighting, loop);
			},
		});

		play(skeleton, animationState, weighting, loop);

		/**
		 * 随机播放一个动画
		 * @param {*} skeleton
		 * @param {*} animationState
		 * @param {number[]} weighting - 权重
		 * @param {boolean} [loop=false]
		 */
		function play(skeleton, animationState, weighting, loop = false) {
			const animations = skeleton.data.animations.map(anim => anim.name);

			if (!weighting || weighting.length !== animations.length) {
				weighting = animations.map(() => 1);
			}

			//加权随机
			let ratio = whichWayUtil.scaleToIntegerRatio(weighting);
			let population = [];
			for (let i = 0; i < animations.length; i++) {
				let animWeight = ratio[i];
				let animation = animations[i];
				population.push(...new Array(animWeight).fill(animation));
			}

			const selectedAnim = population.randomGet();

			if (animations.length === 1) {
				animationState.setAnimation(0, selectedAnim, true);
			} else {
				animationState.setAnimation(0, selectedAnim, loop);
			}
		}
	}

	/**
	 * 取动皮容器的目标尺寸（= 父元素的真实尺寸，也是动皮配置里 x/y/scale 的基准空间）。
	 *
	 * 优先用 `fit()` 记录下来的尺寸 —— 容器的 `clientWidth` 在画布超采样等场景下不一定可信；
	 * 还没有记录时（容器刚创建、尚未 fit）退回 `clientWidth` / 设计基准 120x180。
	 *
	 * @param {HTMLElement} container 动皮容器
	 * @returns {[number, number]} 宽高
	 */
	getDycFitSize(container) {
		const [width, height] = (container?.dataset?.dycFitSize || "").split("x").map(Number);
		if (width > 0 && height > 0) return [width, height];
		return [container?.clientWidth || 120, container?.clientHeight || 180];
	}

	/**
	 * 给动皮开启超采样（画布缓冲放大），像素更多、观感不变。
	 *
	 * 两个关键点（都由 lib/spine-player.js 的行为决定）：
	 * 1. `SceneRenderer.resize()` 每次都会 `canvas.width = canvas.clientWidth` 重置缓冲，
	 *    而渲染循环**每帧**都会调用 `resize(ResizeMode.Expand)` ⇒ 缓冲必须在 resize 里放大，
	 *    在外面写一次会被下一帧覆盖；
	 * 2. `SpinePlayer.draw()` 用 `zoom = 视口宽 / scale(视口, 缓冲)` 设相机，缓冲放大 k 倍
	 *    会让 zoom 变成 1/k（画面被放大裁切）⇒ 在 `begin()`（相机 update 之前）把 zoom 乘回 k，
	 *    画面几何就与不放大时**完全一致**，区别只有缓冲像素更多 ⇒ 更清晰。
	 *
	 * @param {any} player SpinePlayer
	 */
	enableSupersampling(player) {
		const renderer = player?.sceneRenderer;
		if (!renderer) return;

		if (renderer.__whichWaySupersampled) {
			renderer.resize(spine.webgl?.ResizeMode?.Expand ?? 1);
			return;
		}
		renderer.__whichWaySupersampled = true;

		const rawResize = renderer.resize;
		const rawBegin = renderer.begin;

		renderer.resize = function (mode) {
			rawResize.call(this, mode);

			const canvas = this.canvas;
			const cssWidth = canvas.clientWidth;
			const cssHeight = canvas.clientHeight;
			//未布局（display:none / 尚未挂上 DOM）时保持库的设置，等下一帧再说
			if (!cssWidth || !cssHeight) return;

			//density：至少跟得上屏幕像素密度；小容器保证短边 >= 360 缓冲像素；最多 4 倍
			const density = Math.min(4, Math.max(window.devicePixelRatio || 1, 360 / Math.min(cssWidth, cssHeight)));
			player.__whichWayDensity = density;
			const bufferWidth = Math.round(cssWidth * density);
			const bufferHeight = Math.round(cssHeight * density);
			if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
				canvas.width = bufferWidth;
				canvas.height = bufferHeight;
			}
			//rawResize 会把 viewport 设成 CSS 尺寸，这里每帧都要改回缓冲尺寸
			this.context.gl.viewport(0, 0, canvas.width, canvas.height);
		};

		renderer.begin = function () {
			const camera = this.camera;
			//库的 zoom 与缓冲尺寸成反比，乘回 density 即可还原原本的画面几何
			if (camera) camera.zoom *= player.__whichWayDensity || 1;
			rawBegin.call(this);
		};

		renderer.resize(spine.webgl?.ResizeMode?.Expand ?? 1);
	}

	setSkeletonPosition(player, options, noFix) {
		const parent = player.dom.parentNode;
		const [width, height] = spineWorker.getDycFitSize(parent);

		//骨骼坐标活在**容器尺寸**空间里：超采样只增加画布缓冲像素，
		//相机 zoom 会按「缓冲 / 视口」同步修正（见 enableSupersampling），
		//所以这里不需要、也不能再乘缓冲比例。
		let index = [width / 120, height / 180];

		if (noFix) index = [1, 1];

		player.skeleton.scaleX = options.scale * index[0];
		player.skeleton.scaleY = options.scale * index[1];
		player.skeleton.x = width * options.x[1] + options.x[0];
		player.skeleton.y = height * options.y[1] + options.y[0];
	}

	playAction(player, action, duration = 3000) {
		let char = player.parent.parentNode;
		let dynamicName = player.config.dynamicName;
		let playerid = char.playerid;
		let cache = spineWorker.spineCache;

		if (cache.get(dynamicName)?.[dynamicName]?.[playerid]?.[action]?.timer) {
			clearTimeout(cache.get(dynamicName)[playerid][action].timer);
		}

		const actions = ["chuchang", "gongji", "teshu", "default"];
		if (!actions.includes(action)) console.warn(`${action}不是合法的动作！`);
		let actionConfig = player.config.originalOptions[action];
		if (!actionConfig) {
			console.warn(`${action}没有对应的动作配置！`);
			whichWayToast.showToast(`${action}没有对应的动作配置！`);
		}

		player.dom.style.display = "none";
		let data = player.config;
		/** @type { HTMLElement } */
		let wrapper = player.dom.parentNode;
		//@ts-ignore
		wrapper.style.zIndex = 100;
		if (!cache.get(dynamicName)) cache.set(dynamicName, {});
		const dycSkin = cache.get(dynamicName);
		if (!dycSkin[playerid]) dycSkin[playerid] = {};
		if (!dycSkin[playerid][action]) {
			let container = ui.create.div(".sjzxDycOutWrapper", wrapper);
			container.classList.add(`${action}`);
			const rect = container.getBoundingClientRect();
			container.style.display = "none";
			//@ts-ignore
			const actionPlayer = new spine.SpinePlayer(container, {
				skelUrl: data.skelUrl,
				jsonUrl: data.jsonUrl,
				atlasUrl: data.atlasUrl,
				showControls: false,
				animations: Array.isArray(actionConfig.action) ? actionConfig.action : [actionConfig.action],
				alpha: true,
				backgroundColor: "#00000000",
				debug: {
					bones: false,
					regions: false,
					meshes: false,
					boundingBoxes: false,
					paths: false,
					skins: false,
					attachments: false,
					hulls: false,
				},
				showLoading: false,
				premultipliedAlpha: actionConfig.alpha || false,
				unpackPremultipliedAlpha: !!(data.originalOptions && data.originalOptions.unpackPremultipliedAlpha),
				preserveDrawingBuffer: true,
				viewport: {
					x: 0,
					y: 0,
					width: rect.width,
					height: rect.height,
					padLeft: 0,
					padRight: 0,
					padTop: 0,
					padBottom: 0,
				},
				originalOptions: actionConfig,
				error: function (reason) {
					console.error("spine animation load error", reason);
				},
				success: function (player) {
					const transferNum = str => parseFloat(str.match(/-?\d*\.?\d+/)?.[0] || "0");

					let char = player.parent.parentNode.parentNode;
					let options = player.config.originalOptions;
					let docStyle = getComputedStyle(document.body);
					let style = getComputedStyle(char);

					player.skeleton.x = transferNum(docStyle.width) - transferNum(style.right) - transferNum(style.width) / 2;
					player.skeleton.y = transferNum(style.bottom);

					player.skeleton.scaleX = options.scale;
					player.skeleton.scaleY = options.scale;

					player.speed = actionConfig.speed || 1;

					player.dom.parentNode.style.display = "";
				},
			});
			wrapSpinePlayerUnpack(actionPlayer);
			//动作层（出场 / 攻击 / 特殊）同样开超采样：density 由渲染循环按实际 CSS 尺寸
			//自适应，大画布只会取 devicePixelRatio，不会无谓地把缓冲放大 4 倍
			spineWorker.enableSupersampling(actionPlayer);
			dycSkin[playerid][action] = actionPlayer;
		} else {
			dycSkin[playerid][action].parent.style.display = "";
		}

		if (duration) {
			dycSkin[playerid][action]["timer"] = setTimeout(() => {
				let container = dycSkin[playerid][action].parent;
				player.dom.style.display = "";
				container.style.display = "none";
				wrapper.style.zIndex = "";
			}, duration);
		}
	}

	async updateDyc(name, target, action = "default") {
		if (!spineWorker.needEnable()) return;

		let skin = window.whichWaySave.skinConfig[name] || "经典形象.1145141919810";
		let skinName = whichWayFile.removeExt(skin);
		let dynamicName = `${name}_${skinName}`;

		let cache = spineWorker.spineCache;

		//停止target中所有其他动皮的播放
		cache.forEach(obj => {
			for (let key in obj) {
				let info = obj[key];
				if (info.from !== target) continue;
				for (let action in info) {
					let player = info[action];
					if (player instanceof HTMLElement) continue;
					player.parent.style.display = "none";
				}
			}
		});

		if (this.banSkin?.[name]?.[skinName] === true) return;

		if (cache.has(dynamicName)) {
			if (get.itemtype(target) === "player" && cache.get(dynamicName)?.[target.playerid]?.[action]) {
				cache.get(dynamicName)[target.playerid][action].parent.style.display = "";
				return;
			} else if (cache.get(dynamicName)?.[target.className]?.[action]) {
				cache.get(dynamicName)[target.className][action].parent.style.display = "";
				return;
			}
		}

		if (skin) {
			if (spineWorker.getSkinData(name, skinName)) {
				spineWorker.loadDyc(name, skinName, target);
			}
		}
	}

	draggingDyc(player) {
		if (!spineWorker.needEnable()) return;

		if (!whichWayUtil.config("enableWhichWayDynamicSkin")) {
			whichWayToast.showToast("请先开启动态皮肤功能");
			return;
		}

		if (typeof player !== "object") {
			whichWayToast.showToast("不是合法的Spine对象");
			return;
		}

		whichWayToast.showToast("已开启动皮拖拽");

		//文本复制
		const copyBtn = document.createElement("button");
		copyBtn.id = "copySketeonPostionBtnSJZX";
		copyBtn.textContent = "复制信息";

		document.body.appendChild(copyBtn);

		copyBtn.addEventListener("click", () => {
			let context = [];
			const position = dycSave?.skeletonPostion;
			//x / y 与 setSkeletonPosition 的公式一致：x = 容器宽 * x[1] + x[0]
			if (position?.x) context.push(`x:[${position.x[0] ?? 0},${position.x[1].toFixed(2)}],`);
			if (position?.y) context.push(`y:[${position.y[0] ?? 0},${position.y[1].toFixed(2)}],`);
			if (position?.scale !== undefined) context.push(`scale:${position.scale.toFixed(2)},`);
			if (context.length > 0) {
				navigator.clipboard
					.writeText(context.join("\n"))
					.then(() => {
						whichWayToast.showToast("复制成功", 1500, "bottomRight", "skeletonPositionCopySJZX");
					})
					.catch(err => {
						console.error("复制失败: ", err);
					});
			} else whichWayToast.showToast("没有可复制的信息!", 1500);
		});

		//关闭拖拽
		const btn = document.createElement("button");
		btn.id = "toggleDragBtnSJZX";
		btn.textContent = "关闭拖拽";

		document.body.appendChild(btn);

		// 按钮点击事件
		btn.addEventListener("click", () => {
			btn.remove();
			copyBtn.remove();
			spineWorker.stopDraggingDyc(player);
		});

		/** @type {HTMLElement} **/
		const parent = player.parent;
		parent.style.pointerEvents = "all";

		const skeleton = player.skeleton;
		const domElement = player.dom;

		let isDragging = false;
		let lastX = 0,
			lastY = 0;

		const minScale = 0.001;
		const maxScale = 10;
		const scaleStep = 0.01;

		let lastLogTime = 0;
		const logInterval = 200;

		/**
		 * 屏幕位移 → 骨骼坐标：1 CSS 像素位移 = 1 骨骼单位。
		 * 相机视口宽 = 容器宽、`zoom` 已被超采样逻辑修正，所以两者是 1:1。
		 * 注意不能用 `canvas.width / rect.width`：那是「缓冲 / 显示」比例（= 超采样系数），
		 * 会把拖拽幅度放大 density 倍。
		 */
		const toSkeletonDelta = (dx, dy) => [dx, dy];

		/**
		 * 把当前骨骼状态换算成动皮配置里的参数，与 `setSkeletonPosition` 的公式严格互逆：
		 *   x = 宽 * x[1] + x[0]                ⇒ x[1] = skeleton.x / 宽，x[0] = 0
		 *   scaleX = scale * (宽 / 120)          ⇒ scale = skeleton.scaleX / (宽 / 120)
		 * 尺寸取与运行时同一个来源（getDycFitSize），所以拖出来的参数就是实际生效的参数
		 * （骨骼坐标就在容器尺寸空间里，与画布缓冲无关，不需要按缓冲比例换算）。
		 */
		const saveParams = () => {
			const [width, height] = spineWorker.getDycFitSize(parent);
			//骨骼一旦被污染成 NaN，就别把坏值写进配置（finite 兜底）
			const finite = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback);
			if (!dycSave.skeletonPostion) dycSave.skeletonPostion = {};
			const position = dycSave.skeletonPostion;
			position.x = [0, width ? finite(skeleton.x / width) : 0];
			position.y = [0, height ? finite(skeleton.y / height) : 0];
			position.scale = width ? finite(skeleton.scaleX / (width / 120), 1) : finite(skeleton.scaleX, 1);
			return position;
		};

		const onMouseDown = e => {
			isDragging = true;
			lastX = e.clientX;
			lastY = e.clientY;
		};

		const onMouseMove = e => {
			if (!isDragging) return;

			const [dx, dy] = toSkeletonDelta(e.clientX - lastX, e.clientY - lastY);
			skeleton.x += dx;
			skeleton.y += dy;

			lastX = e.clientX;
			lastY = e.clientY;

			const now = Date.now();
			if (now - lastLogTime > logInterval) {
				const position = saveParams();
				whichWayToast.showToast(
					`骨骼位置: x=[${position.x[0]},${position.x[1].toFixed(2)}], y=[${position.y[0]},${position.y[1].toFixed(2)}]`,
					true,
					"topLeft",
					"dragging_xAndy"
				);
				lastLogTime = now;
			}
		};

		const onMouseUp = () => {
			isDragging = false;
		};

		const onWheel = e => {
			e.preventDefault();

			const delta = e.deltaY;
			let newScale = skeleton.scaleX;

			if (delta < 0) {
				newScale += scaleStep;
			} else {
				newScale -= scaleStep;
			}

			newScale = Math.max(minScale, Math.min(maxScale, newScale));

			skeleton.scaleX = skeleton.scaleY = newScale;

			const position = saveParams();
			whichWayToast.showToast(`当前骨骼缩放: scale=${position.scale.toFixed(2)}`, true, "topLeft", "dragging_scale");
		};

		spineWorker.eventListenersMap.set(domElement, { onMouseDown, onMouseMove, onMouseUp, onWheel });

		domElement.addEventListener("mousedown", onMouseDown);
		document.addEventListener("mousemove", onMouseMove);
		document.addEventListener("mouseup", onMouseUp);
		domElement.addEventListener("wheel", onWheel, { passive: false }); // 注意：passive: false 才能调用 preventDefault
	}

	stopDraggingDyc(player) {
		let parent = player.parent;
		parent.style.pointerEvents = "none";

		const domElement = player.dom;

		const listeners = spineWorker.eventListenersMap.get(domElement);
		if (listeners) {
			const { onMouseDown, onMouseMove, onMouseUp, onWheel } = listeners;

			domElement.removeEventListener("mousedown", onMouseDown);
			document.removeEventListener("mousemove", onMouseMove);
			document.removeEventListener("mouseup", onMouseUp);
			domElement.removeEventListener("wheel", onWheel);
		}

		spineWorker.eventListenersMap.delete(domElement);

		let toasts = whichWayToast.toastRegistry;
		for (let key in toasts) {
			let info = toasts[key];
			if (typeof info === "function") continue;
			for (let obj of info) {
				let id = obj.id;
				if (id.startsWith("dragging_")) {
					whichWayToast.removeToastById(id);
				}
			}
		}
	}

	/**
	 * 判断是否需要启用驶舰之向的动皮
	 * @returns {Boolean}
	 */
	needEnable() {
		let mode = whichWayUtil.config("WhichWayDynamicSkinSwitch") || "sjzx";
		switch (mode) {
			case "sjzx":
				return whichWayUtil.config("enableWhichWayDynamicSkin") || whichWayUtil.config("enableWhichWayDynamicSkin") === undefined;
			case "piqie": {
				let lack = [];
				if (!lib.extensionPack["皮肤切换"]) lack.push("皮肤切换");
				if (!lib.extensionPack["千幻聆音"]) lack.push("千幻聆音");
				if (!lib.extensionPack["十周年UI"]) lack.push("十周年UI");
				return lack.length === 0;
			}
		}
		return false;
	}
}

export const spineWorker = new SpineWorker();

onSetDev({
	name: "whichWaySpineWorker_dev",
	fn() {
		//@ts-ignore
		window.spineWorker = spineWorker;
	},
});

window.whichWay.register("spineWorker", spineWorker);
