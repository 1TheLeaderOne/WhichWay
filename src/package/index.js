import { createApp } from "vue";
import Author from "./author.vue.js";
import { whichWayVersion } from "../version.js";
import { onArenaReady } from "../hooks/index.js";
import { ui } from "noname";
await Promise.resolve({     });
const mainPackage = () => {
  const pack = {
    character: {
      character: {},
      translate: {}
    },
    card: {
      card: {},
      translate: {},
      list: []
    },
    skill: {
      skill: {},
      translate: {}
    },
    diskURL: "",
    forumURL: ""
  };
  pack.author = getAuthor();
  pack.version = whichWayVersion.ext;
  return pack;
};
let replaced = false;
function getAuthor() {
  const layout = document.createElement("div");
  createApp(Author).mount(layout);
  onArenaReady({
    name: "whichWayPackage_AuthorCreate_change",
    fn: () => {
      watch(
        "whichway-author-layout",
        (el) => {
          if (replaced) return;
          replaced = true;
          const target = el.parentElement.parentElement;
          target.appendChild(el);
          target.querySelector("span")?.remove();
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
        ui.menuContainer
      );
    }
  });
  return `<div class = "whichway-author-layout">${layout.innerHTML}</div>`;
}
function watch(className, callback, targetNode = document.body) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.classList.contains(className)) {
            callback(node);
          }
          node.querySelectorAll(`.${className}`).forEach((el) => {
            callback(el);
          });
        }
      });
    });
  });
  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
  return observer;
}
export {
  mainPackage
};
//# sourceMappingURL=index.js.map
