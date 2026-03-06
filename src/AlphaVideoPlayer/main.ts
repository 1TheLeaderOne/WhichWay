import {
  AlphaVideoPlayerOptions,
  FrameData,
  PlayerState,
} from './types';

/**
 * AlphaVideoPlayer - 带透明通道的 WebM 视频播放器
 * 
 * @description
 * 通过 Canvas 渲染带 Alpha 通道的 WebM 视频，实现透明背景播放效果。
 * 支持自动播放、循环、事件回调、帧截取等功能。
 * 
 * @example
 * ```typescript
 * const player = new AlphaVideoPlayer({
 *   container: '#player-container',
 *   src: 'video.webm',
 *   autoplay: true,
 *   loop: true,
 *   muted: true,
 *   onReady: (p) => console.log('就绪'),
 * });
 * 
 * player.play();
 * ```
 * 
 * @remarks
 * - 视频必须使用 WebM + VP9 编码，并包含 Alpha 通道
 * - 自动播放需要 `muted: true` 以符合浏览器策略
 * - iOS 设备需要 `playsinline: true` 才能内联播放
 * 
 */
export class AlphaVideoPlayer {
  // ==================== 公共属性 ====================

  /** 当前播放器配置 */
  public readonly config: Required<AlphaVideoPlayerOptions>;

  /** 是否正在播放 */
  public isPlaying = false;

  /** 视频是否已加载就绪 */
  public isReady = false;

  // ==================== 私有属性 ====================

  /** 视频元素 */
  private video: HTMLVideoElement | null = null;

  /** Canvas 元素 */
  private canvas: HTMLCanvasElement | null = null;

  /** Canvas 2D 上下文 */
  private ctx: CanvasRenderingContext2D | null = null;

  /** requestAnimationFrame ID */
  private animationId: number | null = null;

  /** 容器元素 */
  private container: HTMLElement | null = null;

  // ==================== 构造函数 ====================

  /**
   * 创建 AlphaVideoPlayer 实例
   * @param options - 播放器配置选项
   * @throws {Error} 容器未找到或浏览器不支持时抛出错误
   */
  constructor(options: AlphaVideoPlayerOptions) {
    // 合并默认配置
    this.config = {
      container: options.container,
      src: options.src,
      autoplay: options.autoplay ?? false,
      loop: options.loop ?? true,
      muted: options.muted ?? true,
      playsinline: options.playsinline ?? true,
      width: options.width ?? '100%',
      height: options.height ?? 'auto',
      poster: options.poster ?? '',
      preload: options.preload ?? 'auto',
      preserveAspectRatio: options.preserveAspectRatio ?? true,
      onReady: options.onReady,
      onPlay: options.onPlay,
      onPause: options.onPause,
      onEnd: options.onEnd,
      onError: options.onError,
      onFrame: options.onFrame,
    };

    // 初始化播放器
    this.init();
  }

  // ==================== 公共方法 ====================

  /**
   * 获取播放器当前状态
   * @returns 只读的状态对象
   */
  public getState(): Readonly<PlayerState> {
    return {
      isPlaying: this.isPlaying,
      isReady: this.isReady,
      currentTime: this.getCurrentTime(),
      duration: this.getDuration(),
      progress: this.getProgress(),
      muted: this.video?.muted ?? true,
      volume: this.video?.volume ?? 1,
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
  public async play(): Promise<void> {
    if (!this.video) {
      throw new Error('Video element not initialized');
    }

    try {
      await this.video.play();
      this.isPlaying = true;
    } catch (error) {
      console.error('播放失败:', error);
      this._handleError(error instanceof Error ? error : new Error(String(error)));
      throw error;
    }
  }

  /**
   * 暂停视频
   */
  public pause(): void {
    if (!this.video) return;
    this.video.pause();
    this.isPlaying = false;
  }

  /**
   * 切换播放/暂停状态
   * @returns Promise<void>
   */
  public async toggle(): Promise<void> {
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
  public seek(time: number): void {
    if (!this.video) return;

    const clampedTime = Math.max(0, Math.min(time, this.video.duration || 0));
    this.video.currentTime = clampedTime;
  }

  /**
   * 设置音量
   * @param volume - 音量值 (0.0 - 1.0)
   * @throws {RangeError} 音量超出范围时抛出错误
   */
  public setVolume(volume: number): void {
    if (!this.video) return;

    if (volume < 0 || volume > 1) {
      throw new RangeError('Volume must be between 0 and 1');
    }

    this.video.volume = volume;
    this.video.muted = volume === 0;
  }

  /**
   * 切换静音状态
   * @returns 新的静音状态
   */
  public toggleMuted(): boolean {
    if (!this.video) return true;
    this.video.muted = !this.video.muted;
    return this.video.muted;
  }

  /**
   * 获取当前播放时间 (秒)
   * @returns 当前时间，未初始化时返回 0
   */
  public getCurrentTime(): number {
    return this.video?.currentTime ?? 0;
  }

  /**
   * 获取视频总时长 (秒)
   * @returns 总时长，未初始化时返回 0
   */
  public getDuration(): number {
    return this.video?.duration ?? 0;
  }

  /**
   * 获取播放进度
   * @returns 进度值 (0.0 - 1.0)，未初始化时返回 0
   */
  public getProgress(): number {
    if (!this.video || !this.video.duration) return 0;
    return this.video.currentTime / this.video.duration;
  }

  /**
   * 销毁播放器实例，释放资源
   * @description 停止播放、移除 DOM 元素、取消动画帧
   */
  public destroy(): void {
    // 停止渲染循环
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }

    // 清理视频元素
    if (this.video) {
      this.video.pause();
      this.video.src = '';
      this.video.load();
      this.video.remove();
      this.video = null;
    }

    // 清理 Canvas 元素
    if (this.canvas) {
      this.canvas.remove();
      this.canvas = null;
      this.ctx = null;
    }

    // 重置状态
    this.container = null;
    this.isPlaying = false;
    this.isReady = false;
  }

  /**
   * 重新加载当前视频
   * @description 先销毁再重新初始化
   */
  public reload(): void {
    this.destroy();
    this.init();
  }

  /**
   * 更换视频源并重新加载
   * @param src - 新的视频地址
   */
  public setSrc(src: string): void {
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
  public captureFrame(): string | null {
    if (!this.canvas) return null;
    return this.canvas.toDataURL('image/png');
  }

  /**
   * 截取当前帧为 Blob 对象 (异步)
   * @param callback - 接收 Blob 的回调函数
   * @param type - 输出格式，默认 'image/png'
   * @param quality - JPEG/WebP 质量 (0-1)，PNG 时忽略
   */
  public captureFrameBlob(
    callback: (blob: Blob | null) => void,
    type: string = 'image/png',
    quality?: number
  ): void {
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
  private init(): void {
    try {
      // 1. 获取容器元素
      this.container = this._getElement(this.config.container);
      if (!this.container) {
        throw new Error(`容器元素未找到: ${this.config.container}`);
      }

      // 2. 检查浏览器兼容性
      if (!this._checkSupport()) {
        throw new Error('浏览器不支持 WebM + VP9 + Alpha 通道');
      }

      // 3. 创建 DOM 结构
      this._createDOM();

      // 4. 绑定事件监听器
      this._bindEvents();

      // 5. 加载视频资源
      this._loadVideo();
    } catch (error) {
      console.error('AlphaVideoPlayer 初始化失败:', error);
      this._handleError(error instanceof Error ? error : new Error(String(error)));
    }
  }

  /**
   * 检查浏览器是否支持 WebM + VP9 + Alpha
   * @private
   * @returns 支持返回 true，否则 false
   */
  private _checkSupport(): boolean {
    const video = document.createElement('video');
    // 检查 WebM + VP9 编码支持
    return video.canPlayType('video/webm; codecs="vp9"') !== '';
  }

  /**
   * 获取 DOM 元素 (支持选择器字符串或元素)
   * @private
   * @param selector - CSS 选择器或 HTMLElement
   * @returns 找到的元素或 null
   */
  private _getElement(selector: string | HTMLElement): HTMLElement | null {
    if (selector instanceof HTMLElement) {
      return selector;
    }
    return document.querySelector<HTMLElement>(selector);
  }

  /**
   * 创建并插入 DOM 元素
   * @private
   */
  private _createDOM(): void {
    if (!this.container) return;

    // 设置容器样式
    this.container.style.position = 'relative';
    this.container.style.overflow = 'hidden';

    // 创建 Canvas (用于渲染透明视频)
    this.canvas = document.createElement('canvas');
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
    this.ctx = this.canvas.getContext('2d');

    // 创建隐藏的 Video 元素 (作为源)
    this.video = document.createElement('video');
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
    
    // 设置视频属性
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
  private _bindEvents(): void {
    if (!this.video) return;

    // 元数据加载完成
    this.video.addEventListener('loadedmetadata', () => {
      this._onLoadedMetadata();
    });

    // 首帧数据加载完成
    this.video.addEventListener('loadeddata', () => {
      this._onLoadedData();
    });

    // 播放状态变化
    this.video.addEventListener('play', () => {
      this.isPlaying = true;
      this._render();
      this.config.onPlay?.(this);
    });

    this.video.addEventListener('pause', () => {
      this.isPlaying = false;
      this.config.onPause?.(this);
    });

    // 播放结束
    this.video.addEventListener('ended', () => {
      this.isPlaying = false;
      this.config.onEnd?.(this);
    });

    // 错误处理
    this.video.addEventListener('error', (e: Event) => {
      const videoError = e.target as HTMLVideoElement;
      const error = new Error(
        `视频加载失败: ${videoError.error?.message || 'Unknown error'}`
      );
      this._handleError(error);
    });

    // 窗口大小变化时重新计算宽高比
    if (this.config.preserveAspectRatio) {
      window.addEventListener('resize', () => {
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
  private _onLoadedMetadata(): void {
    if (!this.canvas || !this.video) return;

    // 设置 Canvas 分辨率为视频原始尺寸
    this.canvas.width = this.video.videoWidth;
    this.canvas.height = this.video.videoHeight;

    // 保持宽高比适配容器
    if (this.config.preserveAspectRatio) {
      this._preserveAspectRatio();
    }
  }

  /**
   * 视频数据加载完成回调
   * @private
   */
  private _onLoadedData(): void {
    this.isReady = true;
    this.config.onReady?.(this);

    // 如果配置了自动播放，则开始播放
    if (this.config.autoplay) {
      this.play().catch(() => {
        // 自动播放被浏览器阻止，等待用户交互
        console.warn('自动播放被阻止，等待用户交互');
      });
    }
  }

  /**
   * 根据容器尺寸调整 Canvas 显示尺寸 (保持视频宽高比)
   * @private
   */
  private _preserveAspectRatio(): void {
    if (!this.container || !this.canvas || !this.video) return;

    const containerRect = this.container.getBoundingClientRect();
    const videoRatio = this.video.videoWidth / this.video.videoHeight;
    const containerRatio = containerRect.width / containerRect.height;

    if (videoRatio > containerRatio) {
      // 视频更宽，以宽度为基准
      this.canvas.style.width = '100%';
      this.canvas.style.height = 'auto';
    } else {
      // 视频更高，以高度为基准
      this.canvas.style.width = 'auto';
      this.canvas.style.height = '100%';
    }
  }

  /**
   * 加载视频资源
   * @private
   */
  private _loadVideo(): void {
    this.video?.load();
  }

  /**
   * 渲染循环 - 将视频帧绘制到 Canvas
   * @private
   */
  private _render = (): void => {
    if (!this.isPlaying || !this.video || !this.ctx || !this.canvas) return;

    // 确保视频有可用帧
    if (this.video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      // 清空画布
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // 绘制视频帧 (保留 Alpha 通道)
      this.ctx.drawImage(
        this.video,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      // 触发帧回调
      if (this.config.onFrame && this.video.duration) {
        const frameData: FrameData = {
          currentTime: this.video.currentTime,
          duration: this.video.duration,
          progress: this.video.currentTime / this.video.duration,
        };
        this.config.onFrame(frameData);
      }
    }

    // 请求下一帧
    this.animationId = requestAnimationFrame(this._render);
  };

  /**
   * 统一错误处理
   * @private
   * @param error - 错误对象
   */
  private _handleError(error: Error): void {
    console.error('AlphaVideoPlayer 错误:', error);
    this.config.onError?.(error);
  }
}