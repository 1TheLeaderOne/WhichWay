/**
 * 驶舰之向加载阶段加载器
 *
 * 把 whichWayInit 从「二十余个 await import 串行排队」改为「声明式阶段 + 拓扑波次并发」：
 * 每个阶段声明自己依赖的阶段（deps），加载器并发启动所有依赖已就绪的阶段。
 * 阶段之间没有依赖关系的模块请求因此能同时发出，不必一个接一个等网络/文件往返。
 *
 * 为什么不是无脑 Promise.all 全拉起来：
 * 每个阶段对应的模块在被 import 时就会执行顶层副作用（注册生命周期钩子、
 * window.whichWay.register、扫 css 目录等），必须保证依赖顺序。deps 就是把
 * 这条隐含顺序显式化——它对阅读者可见，也方便以后新增阶段时不再靠"摆放位置"维持正确性。
 *
 * 顺序无关的性质来自扩展的既有约定：干员/卡牌模块顶层只把内容缓冲进 packHooks，
 * 统一由 onBeforeInit 落库，因此武将包相关阶段可以放心与其它阶段并发。
 */

/**
 * @typedef {Object} Stage
 * @property {string} name - 阶段名（耗时埋点与控制台输出的标签）
 * @property {string[]} [deps] - 依赖的阶段名；全部完成后本阶段才会开始
 * @property {boolean} [optional] - 为 true 时本阶段失败只记录日志，不阻断其它阶段
 * @property {() => any | Promise<any>} load - 阶段执行体（通常是 () => import(...)）
 */

/**
 * @typedef {[string, number]} StageTiming - [阶段名, 耗时(ms)]
 */

/**
 * 按依赖关系并发执行各阶段
 *
 * @param {Stage[]} stages - 阶段描述（数组顺序仅决定耗时明细的展示顺序）
 * @returns {Promise<StageTiming[]>} 各阶段耗时明细
 */
export async function runStages(stages) {
	/** @type {Map<string, Stage>} */
	const byName = new Map();
	for (const stage of stages) {
		if (byName.has(stage.name)) throw new Error(`[stageLoader] 阶段名重复: ${stage.name}`);
		byName.set(stage.name, stage);
	}

	/** @type {Map<string, Promise<void>>} 阶段名 → 已启动的 Promise（保证每个阶段只执行一次） */
	const started = new Map();
	/** @type {Map<string, number>} 阶段名 → 耗时(ms) */
	const durations = new Map();

	/**
	 * 启动（或复用）一个阶段。deps 会被递归拉起，因此不存在"忘了启动某个被依赖阶段"的情况。
	 * @param {Stage} stage
	 * @returns {Promise<void>}
	 */
	const start = stage => {
		const running = started.get(stage.name);
		if (running) return running;

		const promise = (async () => {
			//先并发拉起全部依赖并等待它们完成，形成拓扑波次
			if (stage.deps?.length) {
				await Promise.all(
					stage.deps.map(dep => {
						const target = byName.get(dep);
						if (!target) throw new Error(`[stageLoader] 阶段 "${stage.name}" 依赖了不存在的阶段 "${dep}"`);
						return start(target);
					})
				);
			}

			const begin = performance.now();
			try {
				await stage.load();
			} catch (error) {
				console.error(`[WhichWay] 阶段 "${stage.name}" 加载失败`, error);
				if (!stage.optional) throw error;
			} finally {
				durations.set(stage.name, performance.now() - begin);
			}
		})();

		started.set(stage.name, promise);
		return promise;
	};

	await Promise.all(stages.map(start));

	//按声明顺序输出，保证多次加载的耗时明细顺序一致（完成顺序是并发的，不确定）
	return stages.map(stage => [stage.name, durations.get(stage.name) ?? 0]);
}
