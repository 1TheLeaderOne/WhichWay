import { lib, game, ui, get, ai, _status } from "noname";

const designer = {
	林登万: ["char_4102_threye", "char_4121_zuole", "char_4064_mlynar", "char_332_archet","char_4009_irene", "char_4055_bgsnow", "char_180_amgoat", "char_172_svrash", "char_206_gnosis", "char_4042_lumen", "char_4065_judge", "char_311_mudrok", "char_377_gdglow", "char_113_cqbw", "char_263_skadi", "char_1028_texas2", "char_003_kalts", "char_264_f12yin", "char_474_glady", "char_010_chen", "char_136_hsguma", "char_426_billro", "char_250_phatom", "char_213_mostma", "char_2013_cerber", "char_300_phenxi", "char_293_thorns", "char_188_helage", "char_400_weedy", "char_416_zumama", "char_456_ash", "char_472_pasngr", "char_2014_nian", "char_2023_ling", "char_222_bpipe", "char_479_sleach", "char_322_lmlee", "char_225_haak", "char_340_shwaz", "char_2024_chyue", "char_291_aglina", "char_4039_horn", "char_2015_dusk", "char_420_flamtl", "char_103_angel", "char_430_fartth", "char_391_rosmon", "char_1013_chen2", "char_437_mizuki", "char_1023_ghost2", "char_4082_qiubai", "char_4072_ironmn", "char_112_siege", "char_427_vigil", "char_1026_gvial2", "char_350_surtr", "char_4080_lin", "char_1029_yato2", "char_4087_ines", "char_4046_ebnhlz", "char_134_ifrit", "char_147_shining", "char_248_mgllan", "char_485_pallas", "char_423_blemsh"],
	圣晴天空: ["char_4009_irene", "char_4055_bgsnow", "char_180_amgoat", "char_172_svrash", "char_206_gnosis", "char_4042_lumen", "char_4065_judge", "char_311_mudrok", "char_377_gdglow", "char_113_cqbw", "char_263_skadi", "char_1028_texas2", "char_003_kalts", "char_264_f12yin", "char_474_glady", "char_010_chen", "char_136_hsguma", "char_426_billro", "char_250_phatom", "char_213_mostma", "char_2013_cerber", "char_300_phenxi", "char_293_thorns", "char_188_helage", "char_400_weedy", "char_416_zumama", "char_456_ash", "char_472_pasngr", "char_2014_nian", "char_2023_ling", "char_222_bpipe", "char_479_sleach", "char_322_lmlee", "char_225_haak", "char_340_shwaz", "char_2024_chyue", "char_291_aglina", "char_4039_horn", "char_2015_dusk", "char_420_flamtl", "char_103_angel", "char_430_fartth", "char_391_rosmon", "char_1013_chen2", "char_437_mizuki", "char_1023_ghost2", "char_4082_qiubai", "char_4072_ironmn", "char_112_siege", "char_427_vigil", "char_1026_gvial2", "char_350_surtr", "char_4080_lin", "char_1029_yato2", "char_4087_ines", "char_4046_ebnhlz", "char_134_ifrit", "char_147_shining", "char_248_mgllan", "char_485_pallas", "char_423_blemsh"],
	今天整点什么: ["char_4102_threye", "char_4121_zuole", "char_332_archet"],
	落尘星河: ["qiaojiakelifumrfz", "char_4064_mlynar"],
};

let pending = {};

for (let key in designer) {
	let chars = designer[key];
	if (Array.isArray(chars)) {
		chars.forEach(char => {
			pending[char] ??= [];
			pending[char].add(key);
		});
	} else {
		pending[chars] ??= [];
		pending[chars].add(key);
	}
}

export const charDes = {
	...pending,
};
