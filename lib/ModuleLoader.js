/**
 * 跨平台模块加载器
 */
class ModuleLoader {
    constructor(options = {}) {
        this.manifestPath = options.manifestPath || '/modules.manifest.json';
        this.baseURL = options.baseURL || '';
        this.manifest = null;
        this.loadedModules = new Map();
        this.loadingPromises = new Map();
        this.environment = this.detectEnvironment();
        this.cacheBust = options.cacheBust || false; // 开发环境禁用缓存
        this.timeout = options.timeout || 30000; // 加载超时（毫秒）
    }

    /**
     * 检测运行环境
     */
    detectEnvironment() {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            return 'browser';
        }
        if (typeof process !== 'undefined' && process.versions?.node) {
            return 'node';
        }
        if (typeof Deno !== 'undefined') {
            return 'deno';
        }
        if (typeof Bun !== 'undefined') {
            return 'bun';
        }
        return 'unknown';
    }

    /**
     * 获取完整的 URL
     */
    getFullURL(path) {
        if (this.environment === 'browser') {
            // 浏览器环境：相对于当前页面
            return new URL(path, window.location.origin + this.baseURL).href;
        } else {
            // 服务端环境：直接使用路径
            return path.startsWith('/') ? path : `/${path}`;
        }
    }

    /**
     * 加载清单文件
     */
    async loadManifest() {
        if (this.manifest) {
            return this.manifest;
        }

        // 检查是否正在加载
        if (this.loadingPromises.has('__manifest__')) {
            return this.loadingPromises.get('__manifest__');
        }

        const promise = (async () => {
            try {
                let manifestText;
                const manifestURL = this.getFullURL(this.manifestPath);

                if (this.environment === 'browser') {
                    // 浏览器环境：使用 fetch
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

                    const response = await fetch(manifestURL, { 
                        signal: controller.signal,
                        cache: this.cacheBust ? 'no-cache' : 'default'
                    });

                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    manifestText = await response.text();
                } 
                else if (this.environment === 'node' || this.environment === 'bun') {
                    // Node.js / Bun 环境
                    const fs = await import('fs/promises');
                    const path = await import('path');
                    
                    // 解析为绝对路径
                    const manifestFile = path.isAbsolute(manifestURL) 
                        ? manifestURL 
                        : path.join(process.cwd(), manifestURL.replace(/^\//, ''));
                    
                    manifestText = await fs.readFile(manifestFile, 'utf-8');
                } 
                else if (this.environment === 'deno') {
                    // Deno 环境
                    manifestText = await Deno.readTextFile(manifestURL);
                } 
                else {
                    throw new Error(`不支持的环境: ${this.environment}`);
                }

                this.manifest = JSON.parse(manifestText);
                return this.manifest;

            } catch (error) {
                console.error('❌ 无法加载模块清单:', error);
                throw new Error(`加载清单失败 (${this.manifestPath}): ${error.message}`);
            } finally {
                this.loadingPromises.delete('__manifest__');
            }
        })();

        this.loadingPromises.set('__manifest__', promise);
        return promise;
    }

    /**
     * 动态导入模块
     */
    async importModule(modulePath) {
        const importPath = this.getFullURL(modulePath);
        
        try {
            // 所有现代环境都支持动态 import
            return await import(importPath);
        } catch (error) {
            console.error(`❌ 导入模块失败: ${importPath}`, error);
            throw error;
        }
    }

    /**
     * 重新加载清单（开发环境用）
     */
    async reloadManifest() {
        this.manifest = null;
        return this.loadManifest();
    }

    /**
     * 加载单个模块
     * @param {string} moduleName - 模块名称
     * @param {boolean} forceReload - 是否强制重新加载
     */
    async load(moduleName, forceReload = false) {
        // 检查缓存
        if (!forceReload && this.loadedModules.has(moduleName)) {
            return this.loadedModules.get(moduleName);
        }

        // 检查是否正在加载
        const cacheKey = forceReload ? `${moduleName}_reload` : moduleName;
        if (this.loadingPromises.has(cacheKey)) {
            return this.loadingPromises.get(cacheKey);
        }

        const promise = (async () => {
            try {
                await this.loadManifest();

                const modulePath = this.manifest.modules[moduleName];
                if (!modulePath) {
                    throw new Error(`模块 "${moduleName}" 不存在于清单中`);
                }

                // 加载模块
                const module = await this.importModule(modulePath);
                
                if (!forceReload) {
                    this.loadedModules.set(moduleName, module);
                }

                return module;

            } catch (error) {
                console.error(`❌ 加载模块 "${moduleName}" 失败:`, error);
                throw error;
            } finally {
                this.loadingPromises.delete(cacheKey);
            }
        })();

        this.loadingPromises.set(cacheKey, promise);
        return promise;
    }

    /**
     * 批量加载多个模块
     * @param {string[]} moduleNames - 模块名称数组
     * @param {object} options - 选项
     */
    async loadMany(moduleNames, options = {}) {
        const {
            parallel = true,      // 是否并行加载
            throwError = false    // 是否在出错时抛出异常
        } = options;

        const results = {
            success: {},
            failed: {},
            total: moduleNames.length
        };

        if (parallel) {
            // 并行加载
            const promises = moduleNames.map(name => 
                this.load(name).then(
                    module => ({ name, module, success: true }),
                    error => ({ name, error, success: false })
                )
            );

            const outcomes = await Promise.all(promises);

            outcomes.forEach(({ name, module, error, success }) => {
                if (success) {
                    results.success[name] = module;
                } else {
                    results.failed[name] = error;
                    if (throwError) throw error;
                }
            });
        } else {
            // 串行加载
            for (const name of moduleNames) {
                try {
                    const module = await this.load(name);
                    results.success[name] = module;
                } catch (error) {
                    results.failed[name] = error;
                    if (throwError) throw error;
                }
            }
        }

        return results;
    }

    /**
     * 加载所有模块
     */
    async loadAll() {
        await this.loadManifest();
        const allNames = Object.keys(this.manifest.modules);
        return this.loadMany(allNames);
    }

    /**
     * 按前缀加载模块
     * @param {string} prefix - 模块名称前缀
     */
    async loadByPrefix(prefix) {
        await this.loadManifest();
        const matching = Object.keys(this.manifest.modules).filter(key => 
            key.startsWith(prefix)
        );
        return this.loadMany(matching);
    }

    /**
     * 按模式加载模块（支持通配符）
     * @param {string} pattern - 模式（如 'character/*'）
     */
    async loadByPattern(pattern) {
        await this.loadManifest();
        
        // 将模式转换为正则
        const regex = new RegExp(
            '^' + pattern
                .replace(/\*/g, '[^/]*')
                .replace(/\?/g, '[^/]')
                .replace(/\[/g, '\\[')
                .replace(/\]/g, '\\]') +
            '$'
        );

        const matching = Object.keys(this.manifest.modules).filter(key => 
            regex.test(key)
        );

        return this.loadMany(matching);
    }

    /**
     * 获取已加载的模块
     */
    get(moduleName) {
        return this.loadedModules.get(moduleName);
    }

    /**
     * 检查模块是否已加载
     */
    has(moduleName) {
        return this.loadedModules.has(moduleName);
    }

    /**
     * 卸载模块（从缓存中移除）
     */
    unload(moduleName) {
        return this.loadedModules.delete(moduleName);
    }

    /**
     * 卸载所有模块
     */
    unloadAll() {
        this.loadedModules.clear();
    }

    /**
     * 获取清单信息
     */
    async getManifestInfo() {
        const manifest = await this.loadManifest();
        return {
            timestamp: manifest.timestamp,
            version: manifest.version,
            count: manifest.count,
            moduleNames: Object.keys(manifest.modules)
        };
    }

    /**
     * 获取模块路径
     */
    async getModulePath(moduleName) {
        await this.loadManifest();
        return this.manifest.modules[moduleName];
    }

    /**
     * 检查模块是否存在
     */
    async exists(moduleName) {
        await this.loadManifest();
        return Boolean(this.manifest.modules[moduleName]);
    }
}

export default ModuleLoader;