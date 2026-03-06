import { onSetDev } from "../hooks/index.js";
import { AlphaVideoPlayer } from "./main.js";
onSetDev({
  name: "AlphaVideoPlayer_dev",
  fn() {
    if (typeof window !== "undefined") {
      window.AlphaVideoPlayer = AlphaVideoPlayer;
    }
  }
});
window.whichWay.register("AlphaVideoPlayer", AlphaVideoPlayer);
export {
  AlphaVideoPlayer
};
//# sourceMappingURL=index.js.map
