import legacyCharIdsJson from "../../json/legacyCharIds.json";

/**
 * 旧干员id → 明日方舟uid 映射表
 *
 * 表体是纯数据，落在 `json/legacyCharIds.json`（构建时由 viteStaticCopy 原样带进产物的 `json/`，
 * 也方便脱离 TS 阅读、比对与外部工具复用）。这里用**静态 import** 而不是 `whichWayFile.readFile`：
 * `arkidMigration` 必须赶在任何阶段模块求值之前把存档改写完（见其文件注释），
 * 换成异步读文件等于把一次性迁移压在 `game.promises` 上——环境不支持或读失败就是静默丢配置。
 *
 * 由 `node scripts/rename-to-arkid.mjs --gen-migration` 从 scripts/arkid-rename-map.json 生成，
 * 请勿手工编辑 JSON。改名前的玩家存档（皮肤/配音/模组/冲突皮肤/战役进度）里的键仍是旧id，
 * 由 src/arknight/arkidMigration.ts 在启动时按此表一次性改写。
 *
 * 表里只有**实际改过名**的干员：仍保留原名的干员不在表内，迁移时自然跳过。
 * 例外是 `MANUAL_MIGRATIONS`（脚本 `--gen-map` 扫的是当前干员文件，旧id 已经不在文件名里的
 * 干员永远扫不出来，但玩家存档里的旧键仍在，所以必须手工补录）。
 */
export const legacyCharIds: Record<string, string> = legacyCharIdsJson;
