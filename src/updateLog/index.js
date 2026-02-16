import { createApp } from "vue";
import { whichWayFile } from "../file.js";
import { onContent, onSetDev } from "../hooks/index.js";
import { upDataContentCurrent } from "./updateContentCurrent.js";
import UpdateNotice from "./updateNotice.vue";
import { whichWayVersion } from "../version.js";

class WhichWayUpdateLog {
    async init(){
        this.updateLog = await whichWayFile.readFile("src:updateLog/updateContent.txt");

        onContent({
            name: "WhichWayUpdateLog_showUpdateNotice",
            fn: () => {
                if(whichWayVersion.extVersionChanged){
                    this.showUpdateNotice();
                }
            }
        })
    }

	currentLog = upDataContentCurrent;

    /**
     * @type {string}
     */
	updateLog;

	/**
	 * 创建更新提示的 DOM 对象
	 * @param {Object} [info] - 更新信息数据
	 * @param {Function} [onClose] - 关闭回调函数
	 * @returns {HTMLElement} 渲染好的 DOM 元素
	 */
	createUpdateNotice(info = this.currentLog,onClose = () => {}) {
		const container = document.createElement("div");
		container.className = "update-notice-wrapper";

		const app = createApp(UpdateNotice, {
			info,
			onClose: () => {
                if(typeof onClose === "function") onClose();
				app.unmount();
				if (container.parentNode) {
					container.parentNode.removeChild(container);
				}
			},
		});

		app.mount(container);

        //@ts-ignore
		return container.firstElementChild;
	}

	/**
	 * 快速显示更新提示（自动添加到 body）
	 * @param {Object} [info] - 更新信息数据
	 * @param {Function} [onClose] - 关闭回调
	 * @returns {Object} { dom, close } - DOM 元素和关闭方法
	 */
	showUpdateNotice(info = this.currentLog, onClose = () => {}) {
		const dom = this.createUpdateNotice(info, close);

		const overlay = document.createElement("div");
        overlay.classList.add("whichWayUpdateNoticeOverlay");
		overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.3s;
        `;

		overlay.appendChild(dom);
		document.body.appendChild(overlay);

        function close(overlay = document.querySelector(".whichWayUpdateNoticeOverlay")){
            if(!overlay){
                throw new Error("未找到更新提示的遮罩层");
            }
            //@ts-ignore
            overlay.style.opacity = "0";
			setTimeout(() => {
                //@ts-ignore
				if (overlay.parentNode) {
                    //@ts-ignore
					document.body.removeChild(overlay);
				}
				onClose();
			}, 300);
        }

		overlay.addEventListener("click", e => {
			if (e.target === overlay) {
				close();
			}
		});

		return { dom, close, overlay };
	}
}

export const whichWayUpdateLog = new WhichWayUpdateLog();

await whichWayUpdateLog.init();

onSetDev({
	name: "WhichWayUpdateLog_setDev",
	fn: () => {
		//@ts-ignore
		window.whichWayUpdateLog = whichWayUpdateLog;
	},
});

window.whichWay.register("updateLog", whichWayUpdateLog);
