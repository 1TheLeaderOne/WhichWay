import { whichWayFile } from "../file";
import { onSetDev } from "../hooks";
import { ui } from "noname";

declare type VideoPlayerOption = {
	container?: HTMLElement;
	/** 只支持webm格式,不需要后缀,并且默认在video下 */
	src: string;
	/** 自动播放,默认为true */
	autoplay?: boolean;
	loop?: boolean;
	muted?: boolean;
	fit?: "contain" | "cover";
	width?: string;
	height?: string;
	autoremove?: boolean;
	onEnded?: () => Promise<void>;	
}

export class VideoPlayer {
	private config: Required<VideoPlayerOption>;

	private viedo: HTMLVideoElement;

	constructor(options:VideoPlayerOption){
		this.config = {
			container: options.container || ui.create.div(".whichWay-auto-video-player",document.body),
			src: options.src,
			autoplay: options.autoplay || true,
			loop: options.loop || false,
			muted: options.muted || false,
			fit: options.fit || "cover",
			autoremove: options.autoremove || true,
			width: options.width || "100%",
			height: options.height || "100%",
			onEnded: options.onEnded || (() => Promise.resolve())
		}

		this.init();
	}

	private init(){
		this.viedo = document.createElement("video");
		this.viedo.src = whichWayFile.compilePath(`video:${whichWayFile.removeExt(this.config.src)}.webm`);
		this.viedo.autoplay = this.config.autoplay;
		this.viedo.loop = this.config.loop;
		this.viedo.muted = this.config.muted;

		this.viedo.style.objectFit = this.config.fit;
		this.viedo.style.width = this.config.width;
		this.viedo.style.height = this.config.height;

		this.config.container.appendChild(this.viedo);

		this.viedo.addEventListener("ended", async () => {
			await this.config.onEnded();

			if (this.config.autoremove) {
				this.config.container.removeChild(this.viedo);
				if(this.config.container.classList.contains("whichWay-auto-video-player")){
					this.config.container.remove();
				}
			}
		});
	}
}

onSetDev({
	name: "WhichWayVideoPlayer_dev",
	fn() {
		if (typeof window !== "undefined") {
			(window as any).VideoPlayer = VideoPlayer;
		}
	},
});

window.whichWay.register("VideoPlayer", VideoPlayer);