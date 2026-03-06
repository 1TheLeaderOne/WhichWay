/**
 * AlphaVideoPlayer 配置选项接口
 */
export interface AlphaVideoPlayerOptions {
  /**
   * 容器选择器字符串或 HTMLElement 元素
   * @example '#player-container' 或 document.getElementById('player')
   */
  container: string | HTMLElement;

  /**
   * 视频源地址 (必须是带 Alpha 通道的 WebM 格式)
   * @example 'video.webm'
   */
  src: string;

  /**
   * 是否自动播放
   * @default false
   * @note 自动播放需要浏览器策略允许，通常需要 muted: true
   */
  autoplay?: boolean;

  /**
   * 是否循环播放
   * @default true
   */
  loop?: boolean;

  /**
   * 是否静音
   * @default true
   * @note 大多数浏览器要求静音才能自动播放
   */
  muted?: boolean;

  /**
   * 是否启用内联播放 (iOS Safari 必需)
   * @default true
   */
  playsinline?: boolean;

  /**
   * 播放器宽度 (支持像素、百分比等 CSS 单位)
   * @default '100%'
   */
  width?: string;

  /**
   * 播放器高度 (支持像素、百分比等 CSS 单位)
   * @default 'auto'
   */
  height?: string;

  /**
   * 视频封面图地址
   * @default ''
   */
  poster?: string;

  /**
   * 预加载策略
   * @default 'auto'
   */
  preload?: 'none' | 'metadata' | 'auto';

  /**
   * 是否保持视频原始宽高比
   * @default true
   */
  preserveAspectRatio?: boolean;

  /**
   * 视频就绪回调
   * @param player - AlphaVideoPlayer 实例
   */
  onReady?: (player: AlphaVideoPlayer) => void;

  /**
   * 视频开始播放回调
   * @param player - AlphaVideoPlayer 实例
   */
  onPlay?: (player: AlphaVideoPlayer) => void;

  /**
   * 视频暂停回调
   * @param player - AlphaVideoPlayer 实例
   */
  onPause?: (player: AlphaVideoPlayer) => void;

  /**
   * 视频播放结束回调
   * @param player - AlphaVideoPlayer 实例
   */
  onEnd?: (player: AlphaVideoPlayer) => void;

  /**
   * 视频加载或播放错误回调
   * @param error - 错误对象
   */
  onError?: (error: Error) => void;

  /**
   * 每帧渲染回调 (用于进度同步等)
   * @param data - 帧数据对象
   */
  onFrame?: (data: FrameData) => void;
}

/**
 * 帧数据接口 (用于 onFrame 回调)
 */
export interface FrameData {
  /** 当前播放时间 (秒) */
  currentTime: number;
  /** 视频总时长 (秒) */
  duration: number;
  /** 播放进度 (0-1) */
  progress: number;
}

/**
 * 播放器状态接口 (只读)
 */
export interface PlayerState {
  /** 是否正在播放 */
  isPlaying: boolean;
  /** 是否已就绪 */
  isReady: boolean;
  /** 当前播放时间 (秒) */
  currentTime: number;
  /** 视频总时长 (秒) */
  duration: number;
  /** 播放进度 (0-1) */
  progress: number;
  /** 是否静音 */
  muted: boolean;
  /** 当前音量 (0-1) */
  volume: number;
}

export type AlphaVideoPlayer = InstanceType<
  typeof import('./main').AlphaVideoPlayer
>;