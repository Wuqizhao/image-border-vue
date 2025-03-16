import type { CameraBrands, Config, Img } from "../types";
const print = (config: Config, img: Img) => {
	console.log("当前配置：", config);
	console.log("当前图片信息：", img);
};

// 定义相机品牌
const cameraBrands: CameraBrands[] = [
	{ name: "佳能", logo: "canon", make: ["Canon"] },
	{ name: "佳能(白)", logo: "canon-white" },
	{ name: "尼康", logo: "nikon", make: ["NIKON CORPORATION"] },
	{ name: "尼康-文字(黑)", logo: "nikon-2" },
	{ name: "尼康-文字(白)", logo: "nikon-2-white" },
	{ name: "索尼(黑)", logo: "sony", make: ["SONY"] },
	{ name: "索尼(白)", logo: "sony-white" },
	{ name: "索尼-Alpha(白)", logo: "sony-alpha-white" },
	{ name: "索尼-Alpha(黑)", logo: "sony-alpha-black" },
	{ name: "索尼-Alpha2(黑)", logo: "sony-alpha-2-black" },
	{ name: "索尼-Alpha2(白)", logo: "sony-alpha-2-white" },
	{ name: "富士", logo: "fuji" },
	{ name: "松下", logo: "panasonic" },
	{ name: "小米", logo: "xiaomi", make: ["Xiaomi"] },
	{ name: "小米汽车", logo: "xiaomi-car" },
	{ name: "华为", logo: "huawei" },
	{ name: "荣耀", logo: "honor" },
	{ name: "苹果(黑)", logo: "apple", make: ["Apple"] },
	{ name: "苹果(白)", logo: "apple-white" },
	{ name: "OPPO", logo: "oppo" },
	{ name: "一加", logo: "oneplus", make: ["OnePlus"] },
	{ name: "一加(黑)", logo: "oneplus-black" },
	{ name: "一加(白)", logo: "oneplus-white" },
	{ name: "一加(红)", logo: "oneplus-red" },
	{ name: "vivo", logo: "vivo", make: ["vivo"] },
	{ name: "vivo-文字(黑)", logo: "vivo-2" },
	{ name: "vivo-文字(白)", logo: "vivo-2-white" },
	{ name: "适马", logo: "sigma" },
	{ name: "徕卡", logo: "leica" },
	{ name: "哈苏(黑)", logo: "hasselblad" },
	{ name: "哈苏(白)", logo: "hasselblad-white" },
	{ name: "大疆", logo: "dji", make: ["DJI"] },
	{ name: "大疆(白)", logo: "dji-white" },
	{ name: "蔡司", logo: "zeiss" },
	{ name: "奥林巴斯", logo: "olympus" },
	{ name: "诺基亚(新)", logo: "nokia" },
	{ name: "诺基亚", logo: "nokia-2" },
	{ name: "柯达", logo: "kodak" },
	{ name: "柯达-透明", logo: "kodak-2" },
	{ name: "耐克", logo: "nike" },
	{ name: "南极人", logo: "njr" },
	{ name: "拼多多", logo: "pdd" },
	{ name: "央视新闻", logo: "ysxw" },
	{ name: "Photoshop", logo: "ps" },
	{ name: "Lightroom", logo: "lightroom" },
	{ name: "CCTV", logo: "cctv" },
	{ name: "BBC", logo: "bbc" },
	{ name: "菠萝", logo: "boluo" },
	{ name: "QQ", logo: "qq" },
	{ name: "QQ空间", logo: "qzone" },
	{ name: "Java", logo: "java" },
	{ name: "Javascript", logo: "javascript" },
	{ name: "PHP", logo: "php" },
];

const watermarkList = [
	{
		index: 0,
		name: "默认样式",
		config: "default",
	},
	{
		index: 1,
		name: "小米徕卡",
		config: "watermark4",
	},
	{
		index: 2,
		name: "单图标-哈苏（白）",
		config: "watermark6",
	},
	{
		index: 3,
		name: "图标+参数+时间垂直居中",
		config: "watermark7",
	},
	// {
	//     index: 2,
	//     name: '型号+参数居中',
	//     config: 'watermark2'
	// },
	// {
	//     index: 3,
	//     name: '型号+时间',
	//     config: 'watermark3'
	// },
	// {
	//     index: 4,
	//     name: '型号+参数+Logo',
	//     config: 'watermark5'
	// }
];

// 获取本地浏览器支持的字体
const getSupportedFonts = (): string[] => {
	return [
		"Arial",
		"黑体",
		"微软雅黑",
		"宋体",
		"楷体",
		"隶书",
		"华文行楷",
		"Courier New",
		"Times New Roman",
	];
};

const preDefineColors = ["#FFF", "#000", "#F00", "#00FF00", "#0000FF"];

export {
	print,
	cameraBrands,
	watermarkList,
	getSupportedFonts,
	preDefineColors,
};
