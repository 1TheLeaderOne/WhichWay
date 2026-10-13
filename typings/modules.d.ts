declare interface characterModuleEffect {
	changeSkill: string[];
	intro: Array<string | Function>;
	content?: (info: any, player?: Player) => void;
}

declare interface characterModulesConfig {
	name: string;
	intro: string | string[];
	effect: characterModuleEffect;
}

declare type characterModulesConfigs = Record<string, characterModulesConfig>;

/**
 * 供 UI 使用的单个模组：在原始 `characterModulesConfig` 基础上补齐 `url`/`id`。
 * `effect` 为可选：基础证章（default）没有模组效果，模组列表条目则携带它。
 */
declare interface characterModulesUIConfig {
	url: string;
	name: string;
	id: string;
	intro: Array<string | Function>;
	effect?: characterModuleEffect;
}

/** 以模组 ID 为键的模组集合（角色全部可用模组，含 `default`） */
declare type characterModulesUIConfigs = Record<string, characterModulesUIConfig>;
