import { whichWayFile as e } from "./file-CXhVBbUa.js";
import { onSetDev as o } from "./hooks-BscfO9lD.js";
import { ui as d } from "noname";
class t {
  config;
  viedo;
  constructor(i) {
    this.config = {
      container: i.container || d.create.div(".whichWay-auto-video-player", document.body),
      src: i.src,
      autoplay: i.autoplay || !0,
      loop: i.loop || !1,
      muted: i.muted || !1,
      fit: i.fit || "cover",
      autoremove: i.autoremove || !0,
      width: i.width || "100%",
      height: i.height || "100%",
      onEnded: i.onEnded || (() => Promise.resolve())
    }, this.init();
  }
  init() {
    this.viedo = document.createElement("video"), this.viedo.src = e.compilePath(`video:${e.removeExt(this.config.src)}.webm`), this.viedo.autoplay = this.config.autoplay, this.viedo.loop = this.config.loop, this.viedo.muted = this.config.muted, this.viedo.style.objectFit = this.config.fit, this.viedo.style.width = this.config.width, this.viedo.style.height = this.config.height, this.config.container.appendChild(this.viedo), this.viedo.addEventListener("ended", async () => {
      await this.config.onEnded(), this.config.autoremove && (this.config.container.removeChild(this.viedo), this.config.container.classList.contains("whichWay-auto-video-player") && this.config.container.remove());
    });
  }
}
o({
  name: "WhichWayVideoPlayer_dev",
  fn() {
    typeof window < "u" && (window.VideoPlayer = t);
  }
});
window.whichWay.register("VideoPlayer", t);
export {
  t as VideoPlayer
};
