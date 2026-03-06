class AlphaVideoPlayer {
  // ==================== 公共属性 ====================
  /** 当前播放器配置 */
  config;
  /** 是否正在播放 */
  isPlaying = false;
  /** 视频是否已加载就绪 */
  isReady = false;
  // ==================== 私有属性 ====================
  /** 视频元素 */
  video = null;
  /** Canvas 元素 */
  canvas = null;
  /** Canvas 2D 上下文 */
  ctx = null;
  /** requestAnimationFrame ID */
  animationId = null;
  /** 容器元素 */
  container = null;
  // ==================== 构造函数 ====================
  /**
   * 创建 AlphaVideoPlayer 实例
   * @param options - 播放器配置选项
   * @throws {Error} 容器未找到或浏览器不支持时抛出错误
   */
  constructor(options) {
    this.config = {
      container: options.container,
      src: options.src,
      autoplay: options.autoplay ?? false,
      loop: options.loop ?? true,
      muted: options.muted ?? true,
      playsinline: options.playsinline ?? true,
      width: options.width ?? "100%",
      height: options.height ?? "auto",
      poster: options.poster ?? "",
      preload: options.preload ?? "auto",
      preserveAspectRatio: options.preserveAspectRatio ?? true,
      onReady: options.onReady,
      onPlay: options.onPlay,
      onPause: options.onPause,
      onEnd: options.onEnd,
      onError: options.onError,
      onFrame: options.onFrame
    };
    this.init();
  }
  // ==================== 公共方法 ====================
  /**
   * 获取播放器当前状态
   * @returns 只读的状态对象
   */
  getState() {
    return {
      isPlaying: this.isPlaying,
      isReady: this.isReady,
      currentTime: this.getCurrentTime(),
      duration: this.getDuration(),
      progress: this.getProgress(),
      muted: this.video?.muted ?? true,
      volume: this.video?.volume ?? 1
    };
  }
  /**
   * 播放视频
   * @returns Promise<void> 播放成功时 resolve，失败时 reject
   * 
   * @example
   * ```typescript
   * player.play().catch(err => console.error('播放失败:', err));
   * ```
   */
  async play() {
    if (!this.video) {
      throw new Error("Video element not initialized");
    }
    try {
      await this.video.play();
      this.isPlaying = true;
    } catch (error) {
      console.error("播放失败:", error);
      this._handleError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }
  /**
   * 暂停视频
   */
  pause() {
    if (!this.video) return;
    this.video.pause();
    this.isPlaying = false;
  }
  /**
   * 切换播放/暂停状态
   * @returns Promise<void>
   */
  async toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }
  /**
   * 跳转到指定时间点
   * @param time - 目标时间 (秒)
   * @throws {Error} 时间超出范围时抛出警告
   */
  seek(time) {
    if (!this.video) return;
    const clampedTime = Math.max(0, Math.min(time, this.video.duration || 0));
    this.video.currentTime = clampedTime;
  }
  /**
   * 设置音量
   * @param volume - 音量值 (0.0 - 1.0)
   * @throws {RangeError} 音量超出范围时抛出错误
   */
  setVolume(volume) {
    if (!this.video) return;
    if (volume < 0 || volume > 1) {
      throw new RangeError("Volume must be between 0 and 1");
    }
    this.video.volume = volume;
    this.video.muted = volume === 0;
  }
  /**
   * 切换静音状态
   * @returns 新的静音状态
   */
  toggleMuted() {
    if (!this.video) return true;
    this.video.muted = !this.video.muted;
    return this.video.muted;
  }
  /**
   * 获取当前播放时间 (秒)
   * @returns 当前时间，未初始化时返回 0
   */
  getCurrentTime() {
    return this.video?.currentTime ?? 0;
  }
  /**
   * 获取视频总时长 (秒)
   * @returns 总时长，未初始化时返回 0
   */
  getDuration() {
    return this.video?.duration ?? 0;
  }
  /**
   * 获取播放进度
   * @returns 进度值 (0.0 - 1.0)，未初始化时返回 0
   */
  getProgress() {
    if (!this.video || !this.video.duration) return 0;
    return this.video.currentTime / this.video.duration;
  }
  /**
   * 销毁播放器实例，释放资源
   * @description 停止播放、移除 DOM 元素、取消动画帧
   */
  destroy() {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    if (this.video) {
      this.video.pause();
      this.video.src = "";
      this.video.load();
      this.video.remove();
      this.video = null;
    }
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
    }
    this.container = null;
    this.isPlaying = false;
    this.isReady = false;
  }
  /**
   * 重新加载当前视频
   * @description 先销毁再重新初始化
   */
  reload() {
    this.destroy();
    this.init();
  }
  /**
   * 更换视频源并重新加载
   * @param src - 新的视频地址
   */
  setSrc(src) {
    if (!this.video) return;
    this.config.src = src;
    this.video.src = src;
    this.video.load();
    this.isReady = false;
  }
  /**
   * 截取当前帧为 Base64 PNG 图片
   * @returns PNG 图片的 data URL，Canvas 未初始化时返回 null
   * 
   * @example
   * ```typescript
   * const dataUrl = player.captureFrame();
   * if (dataUrl) {
   *   const img = new Image();
   *   img.src = dataUrl;
   *   document.body.appendChild(img);
   * }
   * ```
   */
  captureFrame() {
    if (!this.canvas) return null;
    return this.canvas.toDataURL("image/png");
  }
  /**
   * 截取当前帧为 Blob 对象 (异步)
   * @param callback - 接收 Blob 的回调函数
   * @param type - 输出格式，默认 'image/png'
   * @param quality - JPEG/WebP 质量 (0-1)，PNG 时忽略
   */
  captureFrameBlob(callback, type = "image/png", quality) {
    if (!this.canvas) {
      callback(null);
      return;
    }
    this.canvas.toBlob(callback, type, quality);
  }
  // ==================== 私有方法 ====================
  /**
   * 初始化播放器
   * @private
   */
  init() {
    try {
      this.container = this._getElement(this.config.container);
      if (!this.container) {
        throw new Error(`容器元素未找到: ${this.config.container}`);
      }
      if (!this._checkSupport()) {
        throw new Error("浏览器不支持 WebM + VP9 + Alpha 通道");
      }
      this._createDOM();
      this._bindEvents();
      this._loadVideo();
    } catch (error) {
      console.error("AlphaVideoPlayer 初始化失败:", error);
      this._handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }
  /**
   * 检查浏览器是否支持 WebM + VP9 + Alpha
   * @private
   * @returns 支持返回 true，否则 false
   */
  _checkSupport() {
    const video = document.createElement("video");
    return video.canPlayType('video/webm; codecs="vp9"') !== "";
  }
  /**
   * 获取 DOM 元素 (支持选择器字符串或元素)
   * @private
   * @param selector - CSS 选择器或 HTMLElement
   * @returns 找到的元素或 null
   */
  _getElement(selector) {
    if (selector instanceof HTMLElement) {
      return selector;
    }
    return document.querySelector(selector);
  }
  /**
   * 创建并插入 DOM 元素
   * @private
   */
  _createDOM() {
    if (!this.container) return;
    this.container.style.position = "relative";
    this.container.style.overflow = "hidden";
    this.canvas = document.createElement("canvas");
    this.canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: ${this.config.width};
      height: ${this.config.height};
      z-index: 1;
      pointer-events: none; /* 让点击事件穿透到容器 */
    `;
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.video = document.createElement("video");
    this.video.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      opacity: 0;
      z-index: 0;
      pointer-events: none;
    `;
    this.video.src = this.config.src;
    this.video.loop = this.config.loop;
    this.video.muted = this.config.muted;
    this.video.playsInline = this.config.playsinline;
    this.video.preload = this.config.preload;
    if (this.config.poster) {
      this.video.poster = this.config.poster;
    }
    this.container.appendChild(this.video);
  }
  /**
   * 绑定视频事件监听器
   * @private
   */
  _bindEvents() {
    if (!this.video) return;
    this.video.addEventListener("loadedmetadata", () => {
      this._onLoadedMetadata();
    });
    this.video.addEventListener("loadeddata", () => {
      this._onLoadedData();
    });
    this.video.addEventListener("play", () => {
      this.isPlaying = true;
      this._render();
      this.config.onPlay?.(this);
    });
    this.video.addEventListener("pause", () => {
      this.isPlaying = false;
      this.config.onPause?.(this);
    });
    this.video.addEventListener("ended", () => {
      this.isPlaying = false;
      this.config.onEnd?.(this);
    });
    this.video.addEventListener("error", (e) => {
      const videoError = e.target;
      const error = new Error(
        `视频加载失败: ${videoError.error?.message || "Unknown error"}`
      );
      this._handleError(error);
    });
    if (this.config.preserveAspectRatio) {
      window.addEventListener("resize", () => {
        if (this.isReady) {
          this._preserveAspectRatio();
        }
      });
    }
  }
  /**
   * 视频元数据加载完成回调
   * @private
   */
  _onLoadedMetadata() {
    if (!this.canvas || !this.video) return;
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;
    if (this.config.preserveAspectRatio) {
      this._preserveAspectRatio();
    }
  }
  /**
   * 视频数据加载完成回调
   * @private
   */
  _onLoadedData() {
    this.isReady = true;
    this.config.onReady?.(this);
    if (this.config.autoplay) {
      this.play().catch(() => {
        console.warn("自动播放被阻止，等待用户交互");
      });
    }
  }
  /**
   * 根据容器尺寸调整 Canvas 显示尺寸 (保持视频宽高比)
   * @private
   */
  _preserveAspectRatio() {
    if (!this.container || !this.canvas || !this.video) return;
    const containerRect = this.container.getBoundingClientRect();
    const videoRatio = this.video.videoWidth / this.video.videoHeight;
    const containerRatio = containerRect.width / containerRect.height;
    if (videoRatio > containerRatio) {
      this.canvas.style.width = "100%";
      this.canvas.style.height = "auto";
    } else {
      this.canvas.style.width = "auto";
      this.canvas.style.height = "100%";
    }
  }
  /**
   * 加载视频资源
   * @private
   */
  _loadVideo() {
    this.video?.load();
  }
  /**
   * 渲染循环 - 将视频帧绘制到 Canvas
   * @private
   */
  _render = () => {
    if (!this.isPlaying || !this.video || !this.ctx || !this.canvas) return;
    if (this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );
      if (this.config.onFrame && this.video.duration) {
        const frameData = {
          currentTime: this.video.currentTime,
          duration: this.video.duration,
          progress: this.video.currentTime / this.video.duration
        };
        this.config.onFrame(frameData);
      }
    }
    this.animationId = requestAnimationFrame(this._render);
  };
  /**
   * 统一错误处理
   * @private
   * @param error - 错误对象
   */
  _handleError(error) {
    console.error("AlphaVideoPlayer 错误:", error);
    this.config.onError?.(error);
  }
}
export {
  AlphaVideoPlayer
};
//# sourceMappingURL=main.js.map
