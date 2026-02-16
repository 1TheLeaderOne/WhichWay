import { spineWhitherHelm as spine } from "../../lib/spine-player.js";
import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayUtil } from "../utill.js";
import { whichWayToast } from "../toast/index.ts";
import { onSetDev } from "../hooks/index.js";
import { whichWayFile } from "../file.js";

const dycSave = window.whichWaySave.dycSave;

class SpineWorker {
	backgroundPath = `${lib.assetURL}extension/WhichWay/dynamicSkin/background/`;

	spineCache = new Map();

	eventListenersMap = new WeakMap();

	get banSkin() {
		if(lib.config.banSkinSJZX === void 0) lib.config.banSkinSJZX = {}
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
					fit(target.container, target.parent);
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
			return player;
		} else console.error(`no skin data ${charName} ${skinName}`);

		function fit(target, player, time = 4) {
			const transferNum = str => parseFloat(str.match(/-?\d*\.?\d+/)?.[0] || "0");
			const oldTransition = target.style.transition;
			target.style.transition = "none";

			let style = getComputedStyle(target);
			let width = transferNum(style.width);
			let height = transferNum(style.height);
			let left = transferNum(style.left);

			let playerStyle = getComputedStyle(player);
			let playerWidth = transferNum(playerStyle.width);
			let playerHeight = transferNum(playerStyle.height);

			if (width > 360) {
				target.style.transition = oldTransition;
				return;
			}

			[width, height] = whichWayUtil.adjustToRatio(width, height, "2:3", [playerWidth, playerHeight]);

			target.style.width = `${width * time}px`;
			target.style.height = `${height * time}px`;
			target.style.zoom = `${1 / time}`;
			if (typeof left === "number") target.style.left = `${left * time}px`;
			// target.style.left = `-50%`;
			void target.offsetWidth;
			target.style.transition = oldTransition;

			dycSave.dycZoom = `${1 / time}`;
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

	setSkeletonPosition(player, options, noFix) {
		const parent = player.dom.parentNode;
		//@ts-ignore
		const offset = new spine.Vector2();
		//@ts-ignore
		const size = new spine.Vector2();
		player.skeleton.getBounds(offset, size, []);

		let index = [parent.clientWidth / 120, parent.clientHeight / 180];

		if (noFix) index = [1, 1];

		player.skeleton.scaleX = options.scale * index[0];
		player.skeleton.scaleY = options.scale * index[1];
		player.skeleton.x = parent.clientWidth * options.x[1] + options.x[0];
		player.skeleton.y = parent.clientHeight * options.y[1] + options.y[0];
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
			dycSkin[playerid][action] = new spine.SpinePlayer(container, {
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
			let skeleton = dycSave?.skeletonPostion;
			if (skeleton?.x) context.push(`x:[0,${skeleton.x.toFixed(2)}],`);
			if (skeleton?.y) context.push(`y:[0,${skeleton.y.toFixed(2)}],`);
			if (skeleton?.scale) context.push(`scale:${skeleton.scale.toFixed(2)},`);
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

		const onMouseDown = e => {
			isDragging = true;
			lastX = e.clientX;
			lastY = e.clientY;
		};

		const onMouseMove = e => {
			if (!isDragging) return;

			const dx = e.clientX - lastX;
			const dy = e.clientY - lastY;

			skeleton.x += dx;
			skeleton.y += dy;

			lastX = e.clientX;
			lastY = e.clientY;

			const now = Date.now();

			const viewportWidth = parent.clientWidth;
			const viewportHeight = parent.clientHeight;
			console.log(viewportWidth, viewportHeight);

			const percentX = skeleton.x / viewportWidth;
			const percentY = skeleton.y / viewportHeight;

			if (now - lastLogTime > logInterval) {
				const str = `骨骼位置: x=${skeleton.x.toFixed(2)} (${percentX.toFixed(2)}), y=${skeleton.y.toFixed(2)} (${percentY.toFixed(2)})`;
				whichWayToast.showToast(str, true, "topLeft", "dragging_xAndy");
				lastLogTime = now;

				let zoom = dycSave.dycZoom || 1;
				if (!dycSave.skeletonPostion) dycSave.skeletonPostion = {};
				dycSave.skeletonPostion.x = percentX / zoom;
				dycSave.skeletonPostion.y = percentY / zoom;
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

			whichWayToast.showToast(`当前骨骼缩放: scale=${newScale.toFixed(2)}`, true, "topLeft", "dragging_scale");

			if (!dycSave.skeletonPostion) dycSave.skeletonPostion = {};
			dycSave.skeletonPostion.scale = newScale;
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
	fn(){
		//@ts-ignore
		window.spineWorker = spineWorker;
	}
})

window.whichWay.register("spineWorker", spineWorker);