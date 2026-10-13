import { createApp } from "vue";
import Author from "./author.vue";
import { whichWayVersion } from "../version";
import { onArenaReady } from "../hooks";
import { ui } from "noname";

await import("./style.css");

export const mainPackage = () => {
	const pack: Record<string, any> = {
		character: {
			character: {},
			translate: {},
		},
		card: {
			card: {},
			translate: {},
			list: [],
		},
		skill: {
			skill: {},
			translate: {},
		},
		diskURL: "",
		forumURL: "",
	};

	pack.author = getAuthor();

	pack.version = whichWayVersion.ext;

	return pack;
};

let replaced = false;

function getAuthor(): string {
	const layout = document.createElement("div");

	createApp(Author).mount(layout);

	//有些更改需要等到ui.menuContainer被创建
	onArenaReady({
		name: "whichWayPackage_AuthorCreate_change",
		fn: () => {
			watch(
				"whichway-author-layout",
				el => {
					if (replaced) return;
					replaced = true;

					const target = el.parentElement!.parentElement!;
					target.appendChild(el);
					target.querySelector("span")?.remove();

					//添加监听器
					const github = el.querySelector(".github-container");
					if (github) {
						github.addEventListener("click", () => {
							navigator.clipboard.writeText("https://github.com/1TheLeaderOne/WhichWay");
							alert("已复制到剪贴板,请使用浏览器访问,访问可能需要科学上网");
						});
					} else {
						console.warn("找不到.github-container元素");
					}
				},
				ui.menuContainer as HTMLElement
			);
		},
	});

	return `<div class = "whichway-author-layout">${layout.innerHTML}</div>`;
}

function watch(className: string, callback: (el: HTMLElement) => any, targetNode = document.body): MutationObserver {
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => {
			mutation.addedNodes.forEach(node => {
				if (node.nodeType === 1) {
					if ((node as HTMLElement).classList.contains(className)) {
						callback(node as HTMLElement);
					}
					(node as HTMLElement).querySelectorAll(`.${className}`).forEach(el => {
						callback(el as HTMLElement);
					});
				}
			});
		});
	});

	observer.observe(targetNode, {
		childList: true,
		subtree: true,
	});

	return observer;
}
