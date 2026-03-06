import { onSetDev } from "../hooks";
import { AlphaVideoPlayer } from "./main";

export { AlphaVideoPlayer } from "./main";
export type { AlphaVideoPlayerOptions, FrameData, PlayerState } from "./types";

onSetDev({
	name: "AlphaVideoPlayer_dev",
	fn() {
		if (typeof window !== "undefined") {
			(window as any).AlphaVideoPlayer = AlphaVideoPlayer;
		}
	},
});

window.whichWay.register("AlphaVideoPlayer", AlphaVideoPlayer);