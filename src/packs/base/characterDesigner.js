import { lib, game, ui, get, ai, _status } from "noname";

const designer = {
	林登万: ["linshimrfz", "zuolemrfz", "maennamrfz", "kongxianmrfz","ailinimrfz", "hongxuemrfz", "xiaoyangmrfz", "yinhuimrfz", "lingzhimrfz", "liumingmrfz", "chizuimrfz", "niyanmrfz", "chengshanmrfz", "wmrfz", "sikadimrfz", "spdegoumrfz", "kaierximrfz", "shanmrfz", "geleidiyamrfz", "chenmrfz", "xingxiongmrfz", "kanielianmrfz", "kuiyingmrfz", "mositimamrfz", "keebomrfz", "feiyameitamrfz", "jicimrfz", "helagemrfz", "wendimrfz", "senranmrfz", "ashmrfz", "kamimrfz", "nianmrfz", "lingmrfz", "fengdimrfz", "qinliumrfz", "laolimrfz", "amrfz", "heimrfz", "chongyuemrfz", "anjielinamrfz", "haojiaomrfz", "xigymrfz", "yanweimrfz", "nengtianshimrfz", "yuanyamrfz", "midiexiangmrfz", "spzzxpmrfz", "shuiyuemrfz", "spyoulingshamrfz", "qiubaimrfz", "baitiemrfz", "weinamrfz", "siyemrfz", "spjiaweiermrfz", "semrfz", "linmrfz", "spyedaomrfz", "yineisimrfz", "heijianmrfz", "yifulitemrfz", "shanlingmrfz", "maizhelunmrfz", "palasimrfz", "xiaguangmrfz"],
	圣晴天空: ["ailinimrfz", "hongxuemrfz", "xiaoyangmrfz", "yinhuimrfz", "lingzhimrfz", "liumingmrfz", "chizuimrfz", "niyanmrfz", "chengshanmrfz", "wmrfz", "sikadimrfz", "spdegoumrfz", "kaierximrfz", "shanmrfz", "geleidiyamrfz", "chenmrfz", "xingxiongmrfz", "kanielianmrfz", "kuiyingmrfz", "mositimamrfz", "keebomrfz", "feiyameitamrfz", "jicimrfz", "helagemrfz", "wendimrfz", "senranmrfz", "ashmrfz", "kamimrfz", "nianmrfz", "lingmrfz", "fengdimrfz", "qinliumrfz", "laolimrfz", "amrfz", "heimrfz", "chongyuemrfz", "anjielinamrfz", "haojiaomrfz", "xigymrfz", "yanweimrfz", "nengtianshimrfz", "yuanyamrfz", "midiexiangmrfz", "spzzxpmrfz", "shuiyuemrfz", "spyoulingshamrfz", "qiubaimrfz", "baitiemrfz", "weinamrfz", "siyemrfz", "spjiaweiermrfz", "semrfz", "linmrfz", "spyedaomrfz", "yineisimrfz", "heijianmrfz", "yifulitemrfz", "shanlingmrfz", "maizhelunmrfz", "palasimrfz", "xiaguangmrfz"],
	今天整点什么: ["linshimrfz", "zuolemrfz", "kongxianmrfz"],
	落尘星河: ["qiaojiakelifumrfz", "maennamrfz"],
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
