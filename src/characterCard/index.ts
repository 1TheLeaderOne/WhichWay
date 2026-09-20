import { lib, game, ui, get, ai, _status } from "noname";
import { whichWayFile } from "../file.js";
import { whichWayCharacterCardClick as click } from "./click.ts";
import { whichWayUtil } from "../utill.js";
import { whichWaySkin } from "../skin/index.ts";
import { getDesigner, getCamp } from "./../packs/base/index.js";
import { getGroupData } from "./../packs/base/groups.js";
import { whichWayAudio } from "../audio/index.ts";
import { whichWayToast } from "../toast/index.ts";
import Sortable from "./../../lib/Sortable/Sortable.js";
import { onConfig, onContent, onSetDev } from "../hooks/index.js";
import { whichWayArknight } from "../arknight/index.ts";
import { whichWayAPIOverride } from "../override/index.js";
import { spineWorker } from "../skin/spineWork.js";
import { whichWayCharacterModules } from "../modules/index.js";

class WhichWayCharacterCard {
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
						if (whichWayUtil.config("enableWhichWayCharacterCardStyle")) {
							whichWayCharacterCard.create(name, sourcenode, noedit, resume, avatar, audioName);
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
				name: "enableWhichWayCharacterCardStyle",
				options: {
					name: "启用驶舰之向武将卡样式",
					intro: "开启后启用驶舰之向武将卡样式",
					init: true,
				},
			},
		});
	}

	async create(name: string, sourcenode: any, noedit: any, resume: any, avatar: any, audioName: any) {
		const container = this.createBackground();
		container.dataset.charName = name;

		const topMenu = await this.createTopMenu(container, name);

		const audioSkinName = await this.createAudioSkinName(container, name);

		const charName = await this.createCharName(container, name);

		const charImage = await this.createCharImageWrapper(container, name);

		const charCamp = await this.createCampLogo(container, name);

		const displayArena = await this.createDisplayArena(container, name);

		click.skill();
	}

	/**
	 * 角色卡牌初始化
	 */
	async init() {}

	/**
	 * 获取默认皮肤
	 */
	getDefaultSkin(sex: "male" | "female"): string {
		return `${whichWayFile.extDir}image/character/default_${sex}.png`;
	}

	getUrl(url: string, folder?: string | "background", ext: string = "png") {
		if (!url.endsWith(`.${ext}`) && typeof ext === "string" && ext.length > 0) url += `.${ext}`;
		if (folder) return whichWayFile.compilePath(`ui:${folder}/${url}`);
		return whichWayFile.compilePath(`ui:${url}`);
	}

	/**
	 * 创建势力logo
	 * @param { HTMLElement } container
	 * @param { string } name
	 */
	async createCampLogo(container: HTMLElement, name: string) {
		const campWrapper = ui.create.div(".camplogo-wrapper", container);
		const imgDef = ui.create.div(".img-def", campWrapper);

		//图标来源按优先级：
		//1. 角色自己的明日方舟阵营（`whichWay.arknight.camp`，可自定义）—— 直接取 `arknight/<camp>.png`。
		//   这里**不再**拿它去 shcema 的映射表做白名单校验：像埃癸斯的 `persona`（联动、不在映射表里但图标确实存在）
		//   会被误判成"非明日方舟"，于是跑到 noname 文件夹去取图。
		//2. groupData 里该势力配置的图标（`logo` 缺省就是它的真实势力名，如 sui / rhodes）；
		//   角色的 `group` 可能被「统一势力」改成 `sjzx_group`，所以再用真实势力兜底查一次。
		const camp = getCamp(name);
		const char = get.character(name);
		//角色的自定义阵营（如埃癸斯的 `persona`）也参与查表：groupData 里为某个阵营单开一条时，
		//只有把阵营一起传进去才能命中（角色的 group 未必等于该条目的键）
		const arknightsCamp = char?.whichWay?.arknight?.camp;
		const groupInfo = getGroupData(char?.group, whichWayUtil.getCharExtConfig(name)?.reallyGroup, arknightsCamp);
		const arknightLogo = arknightsCamp || groupInfo?.logo || groupInfo?.reallyGroup;
		//是否反色（`css/characterCard.css` 的 `.arknightCamp` = `filter: invert(1)`）：
		//groupData 里配了 `filter` 就按它来，没配才走原流程 —— 明日方舟图标反色、其它不反色
		const useFilter = groupInfo?.filter ?? !!arknightLogo;
		if (arknightLogo) {
			if (useFilter) imgDef.classList.add("arknightCamp");
			imgDef.style.backgroundImage = `url(${whichWayFile.extDir}/image/camplogo/arknight/${arknightLogo}.png)`;
			return campWrapper;
		}

		//剩下的都不是明日方舟阵营（引擎势力等）：`getCamp` 此时返回的是角色的 group，取 noname/name_*.png；
		//连这个都没有就显示势力文字。
		if (camp) {
			if (useFilter) imgDef.classList.add("arknightCamp");
			imgDef.style.backgroundImage = `url(${whichWayFile.extDir}/image/camplogo/noname/name_${camp}.png)`;
		} else if (lib.translate[char?.group]) {
			const groupText = ui.create.div(".group-text", imgDef);
			groupText.innerHTML = lib.translate[char.group];
		}

		return campWrapper;
	}

	createBackground() {
		const bg = ui.create.div(".container-CC-SJZX", document.body);
		bg.style.backgroundImage = "url(" + this.getUrl("default", "background") + ")";

		return bg;
	}

	async createTopMenu(container: HTMLElement, name: string) {
		const wrapper = ui.create.div(".topMenu-wrapper", container);
		const btnBack = ui.create.div(".btn-back", wrapper);
		btnBack.addEventListener("click", () => {
			document.body.removeChild(container);
			whichWaySkin.refreshSkin();
			game.resume2();
		});
		const btnBackImageBox = ui.create.div(".imageBox", btnBack);
		const imageBack = new Image();
		imageBack.src = this.getUrl("back");
		btnBackImageBox.appendChild(imageBack);

		await this.createTopMenuButton(
			wrapper,
			"QUIT",
			"简介",
			"resume",
			e => {
				click.quit();
			},
			"quit"
		);

		this.createTopMenuButton(
			wrapper,
			"SKILL",
			"技能",
			"skill",
			e => {
				click.skill();
			},
			"skill"
		);

		this.createTopMenuButton(
			wrapper,
			"SKIN",
			"皮肤",
			"skin",
			async e => {
				await click.skin();
			},
			"skin"
		);

		if (whichWayCharacterModules.getCharModules(name, false))
			this.createTopMenuButton(
				wrapper,
				"MODE",
				"模组",
				"mode",
				async e => {
					await click.mode();
				},
				"mode"
			);

		return wrapper;
	}

	async createTopMenuButton(container: HTMLElement, en: string, cn: string, image: string, onclick: (e: Event) => void, btnName?: string) {
		const skinWrapper = ui.create.div(".btn-background", container);
		const outfitEnSJZX = ui.create.div(".btn-enSJZX", skinWrapper);
		outfitEnSJZX.innerHTML = en;
		const outfitCnSJZX = ui.create.div(".btn-cnSJZX", skinWrapper);
		outfitCnSJZX.innerHTML = cn;
		const btnImageWrapper = ui.create.div(".btnImage-wrapper", skinWrapper);
		const btnImage = new Image();
		btnImage.classList.add(".btn-image");
		btnImage.src = this.getUrl(image);
		btnImageWrapper.appendChild(btnImage);
		if (typeof onclick === "function") skinWrapper.addEventListener("click", onclick);
		if (btnName) skinWrapper.dataset.btnName = btnName;

		return skinWrapper;
	}

	async createAudioSkinName(container, name) {
		const wrapper = ui.create.div(".skinnameAudio-wrapper", container);

		const skinnameWrapper = ui.create.div(".skinnameWrapper", wrapper);
		const titleWrapper = ui.create.div(".titleWrapper", skinnameWrapper);
		const titleImageWrapper = ui.create.div(".imageWrapper", titleWrapper);
		const titleImage = new Image();
		titleImage.src = this.getUrl("painter");
		titleImageWrapper.appendChild(titleImage);
		const titleTextWrapper = ui.create.div(".textWrapper", titleWrapper);
		titleTextWrapper.innerHTML = whichWaySkin.getCurentSkin(name);

		const designerWrapper = ui.create.div(".designerWrapper", wrapper);
		const designerTitleWrapper = ui.create.div(".titleWrapper", designerWrapper);
		const designerTitleImageWrapper = ui.create.div(".imageWrapper", designerTitleWrapper);
		const designerTitleImage = new Image();
		designerTitleImage.classList.add("imageLimit");
		designerTitleImage.src = this.getUrl("designer");
		designerTitleImageWrapper.appendChild(designerTitleImage);
		const designerTextWrapper = ui.create.div(".textWrapper", designerTitleWrapper);
		designerTextWrapper.innerHTML = getDesigner(name).join("、");

		const audioWrapper = ui.create.div(".audioWrapper", wrapper);
		const audioTitleWrapper = ui.create.div(".audioTitleWrapper", audioWrapper);
		const audioImageWrapper = ui.create.div(".imageWrapper", audioTitleWrapper);
		const audioImage = new Image();
		audioImage.src = this.getUrl("cv");
		audioImageWrapper.appendChild(audioImage);
		const audioTextWrapper = ui.create.div(".textWrapper", audioTitleWrapper);
		audioTextWrapper.innerHTML = whichWayAudio.getCharacterLang(name, true);
		const audioCollapseWrapper = ui.create.div(".collapseWrapper", audioTitleWrapper);
		audioCollapseWrapper.dataset.collapse = "false";
		const audioCollapseImage = new Image();
		audioCollapseImage.src = this.getUrl("plus");
		audioCollapseImage.style.height = "50%";
		audioCollapseWrapper.appendChild(audioCollapseImage);
		// @ts-ignore
		audioCollapseWrapper.addEventListener("click", async e => {
			//不是本扩展的武将无法更改配音
			if (!window.whichWaySave.hasChar(name)) {
				whichWayToast.showToast("[驶舰之向] 请勿修改非驶舰之向的武将配音！");
				return;
			}

			if (audioCollapseWrapper.dataset.collapse === "false") {
				audioCollapseWrapper.dataset.collapse = "true";
				audioCollapseImage.dataset.originalHeight = audioWrapper.style.height;
				audioWrapper.style.height = `${(1 + whichWayAudio.getCharacterAvailableLang(name).length) * 50}px`;
				audioCollapseImage.src = this.getUrl("sub");
			} else {
				audioCollapseWrapper.dataset.collapse = "false";
				// @ts-ignore
				audioWrapper.style.height = audioCollapseImage.dataset.originalHeight;
				audioCollapseImage.src = this.getUrl("plus");
			}
		});

		const audioContent = ui.create.div(".content", audioWrapper);
		let charSetAudio = whichWayAudio.getCharacterLang(name);
		for (let language of whichWayAudio.getCharacterAvailableLang(name)) {
			const selectWrapper = ui.create.div(".selectWrapper", audioContent);
			selectWrapper.dataset.choiceSJZX = language;
			if (language === charSetAudio) {
				const choice = ui.create.div(".choice", selectWrapper);
				const choiceContentTextWrapper = ui.create.div(".choice-contentTextWrapper", selectWrapper);
				const selectText = ui.create.div(".selectTextSJZX", choiceContentTextWrapper);
				selectText.innerHTML = whichWayArknight.getVoiceLangTranslation(language)!;
			} else {
				const nochoice = ui.create.div(".nochoice", selectWrapper);
				const nochoiceContentTextWrapper = ui.create.div(".nochoice-contentTextWrapper", selectWrapper);
				const selectText = ui.create.div(".selectTextSJZX", nochoiceContentTextWrapper);
				selectText.innerHTML = whichWayArknight.getVoiceLangTranslation(language)!;
			}

			selectWrapper.addEventListener("click", async event => {
				//@ts-ignore
				let target: HTMLElement = event.currentTarget;
				let curLaunguage = target.dataset.choiceSJZX;
				if (target.dataset.choiceSJZX !== whichWayAudio.getCharacterLang(name)) {
					const choice = document.querySelector(".selectWrapper .choice")!;
					const choiceContent = document.querySelector(".selectWrapper .choice-contentTextWrapper")!;
					whichWayUtil.toggleClass([choice, target.querySelector(".selectWrapper .nochoice")!], "choice", "nochoice");
					whichWayUtil.toggleClass([choiceContent, target.querySelector(".selectWrapper .nochoice-contentTextWrapper")!], "choice-contentTextWrapper", "nochoice-contentTextWrapper");
					await whichWayAudio.setCustomAudio(name, curLaunguage!).then(async () => {
						audioTextWrapper.innerHTML = whichWayAudio.getCharacterLang(name, true);
					});
				}
			});
		}

		return wrapper;
	}

	async createCharName(container, name) {
		const wrapper = ui.create.div(".charName-wrapper", container);
		const charNameTitleWrapper = ui.create.div(".charNameTitleWrapper", wrapper);
		const charNameTitle = ui.create.div(".charNameTitle", charNameTitleWrapper);
		charNameTitle.innerHTML = lib.characterTitle[name] ? lib.characterTitle[name] : "";

		const charNameTextWrapper = ui.create.div(".charNameTextWrapper", wrapper);
		const charNameText = ui.create.div(".charNameText", charNameTextWrapper);
		charNameText.innerHTML = get.translation(name);

		const hpWrapper = ui.create.div(".hpWrapper", wrapper);
		let charInfo = get.character(name);
		let { maxHp, hp, hujia } = charInfo;

		if (maxHp + hujia > 6) {
			const hpNumWrapper = ui.create.div(".hpNumWrapper", hpWrapper);
			const actualHpSJZX = ui.create.div(".actualHpSJZX", hpNumWrapper);
			const hpNumText = ui.create.div(".hpNumText", hpNumWrapper);
			hpNumText.innerHTML = `${hp}/${maxHp}`;

			if (hujia > 0) {
				const hpNumWrapper2 = ui.create.div(".hpNumWrapper", hpWrapper);
				const shield = ui.create.div(".shieldSJZX", hpNumWrapper2);
				const hpNumText2 = ui.create.div(".hpNumText", hpNumWrapper2);
				hpNumText2.innerHTML = `${hujia}`;
			}
		} else {
			for (let i = 0; i < maxHp; i++) {
				let num = i + 1;
				if (num <= hp) {
					ui.create.div(".actualHpSJZX", hpWrapper);
				} else {
					ui.create.div(".emptyHpSJZX", hpWrapper);
				}
			}
			for (let i = 0; i < hujia; i++) {
				ui.create.div(".shieldSJZX", hpWrapper);
			}
		}

		return wrapper;
	}

	async createCharImageWrapper(container, name) {
		const charImageWrapper = ui.create.div(".charImageWrapper", container);
		let url = whichWaySkin.getCurrentSkinPath(name);
		const charImage = ui.create.div(".charImage", charImageWrapper);
		charImage.style.backgroundImage = url.startsWith("url") ? url : "url(" + url + ")";

		await spineWorker.updateDyc(name, charImage);

		//添加关闭动皮的按钮
		await this.createToggleSkin(name);

		return charImageWrapper;
	}

	/**
	 * 创建关闭动皮的按钮
	 * @param {String} name
	 * @param {HTMLElement} [container]
	 * @returns {Promise<HTMLElement>}
	 */
	async createToggleSkin(name, container = document.querySelector(".charImageWrapper")!) {
		const skin = whichWaySkin.getCurentSkin(name);
		const bottomUI = container.querySelector(".charSkinBottomUIWrapper");

		//TODO: 动皮
		if (!spineWorker.getSkinData(name, skin)) {
			if (bottomUI) {
				//@ts-ignore
				bottomUI.style.display = "none";
				updateButton();
			}
			return bottomUI;
		}

		if (bottomUI) {
			//@ts-ignore
			bottomUI.style.display = "";
			updateButton();
			return bottomUI;
		}

		const charSkinBottomUIWrapper = ui.create.div(".charSkinBottomUIWrapper", container);
		const buttonWrapper = ui.create.div(".buttonWrapper", charSkinBottomUIWrapper);
		const buttonText = ui.create.div(".buttonText", buttonWrapper);

		buttonWrapper.addEventListener("click", async e => {
			await click.toggleSkin(e);
		});

		updateButton();

		return charSkinBottomUIWrapper;

		function updateButton() {
			let wrapper = document.querySelector(".charSkinBottomUIWrapper .buttonWrapper");
			let text = document.querySelector(".charSkinBottomUIWrapper .buttonText");
			if (!wrapper || !text) return;
			if (spineWorker.isEnabledSkin(name, skin)) wrapper.classList.add("buttonWrapper-enableSkinBG");
			else wrapper.classList.remove("buttonWrapper-enableSkinBG");
			text.innerHTML = spineWorker.isEnabledSkin(name, skin) ? "关闭动皮" : "开启动皮";
		}
	}

	async createDisplayArena(container, name) {
		const displayArenaSJZX = ui.create.div(".displayArenaSJZX", container);
		new Sortable(displayArenaSJZX, {
			draggable: ".skillWrapper",
			animation: 150,
			handle: ".dragHandle",
		});
		return displayArenaSJZX;
	}

	async updateSkinImage(name, path, playerName) {
		const charImage = document.querySelector(".charImageWrapper .charImage");
		const skinName = document.querySelector(".skinnameWrapper .titleWrapper .textWrapper");
		if (charImage) {
			// @ts-ignore
			charImage.style.backgroundImage = "url(" + path + ")";
			await spineWorker.updateDyc(playerName, charImage);
		}
		if (skinName) skinName.innerHTML = name;

		await this.createToggleSkin(playerName);
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
