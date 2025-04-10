import type {
	CameraBrands,
	Config,
	Img,
	WatermarkListBaseItem,
	WatermarkListItem,
} from "../types";
import { useStore } from "../stores";

export const print = (config: Config, img: Img) => {
	console.log("当前配置：", config);
	console.log("当前图片信息：", img);
};

// 定义相机品牌
export const cameraBrands: CameraBrands[] = [
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
	{ name: "富士", logo: "fuji", make: ["FUJIFILM"] },
	{ name: "松下", logo: "panasonic" },
	{ name: "Lumix", logo: "lumix" },
	{ name: "Lumix(白)", logo: "lumix-white" },
	{ name: "小米", logo: "xiaomi", make: ["Xiaomi"] },
	{ name: "小米-2", logo: "xiaomi-2" },
	{ name: "小米汽车", logo: "xiaomi-car" },
	{ name: "华为", logo: "huawei" },
	{ name: "华为(黑)", logo: "huawei-black" },
	{ name: "华为(白)", logo: "huawei-white" },
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
	{ name: "IQOO", logo: "iqoo" },
	{ name: "IQOO-2", logo: "iqoo-2" },
	{ name: "真我", logo: "realme" },
	{ name: "真我-2", logo: "realme-2" },
	{ name: "努比亚", logo: "nubia" },
	{ name: "适马", logo: "sigma" },
	{ name: "徕卡", logo: "leica", make: ["LEICA CAMERA AG"] },
	{ name: "哈苏(黑)", logo: "hasselblad" },
	{ name: "哈苏(白)", logo: "hasselblad-white" },
	{ name: "大疆", logo: "dji", make: ["DJI"] },
	{ name: "大疆(白)", logo: "dji-white" },
	{ name: "蔡司", logo: "zeiss" },
	{ name: "奥林巴斯", logo: "olympus" },
	{ name: "诺基亚(新)", logo: "nokia" },
	{ name: "诺基亚", logo: "nokia-2" },
	{ name: "酷派", logo: "coolpad" },
	{ name: "酷派-2", logo: "coolpad-2" },
	{ name: "联想", logo: "lenvo" },
	{ name: "柯达", logo: "kodak" },
	{ name: "柯达-透明", logo: "kodak-2" },
	{ name: "央视新闻", logo: "ysxw" },
	{ name: "Photoshop", logo: "ps" },
	{ name: "Lightroom", logo: "lightroom" },
	{ name: "像素蛋糕", logo: "xsdg" },
	{ name: "像素蛋糕-2", logo: "xsdg-2" },
	{ name: "Google", logo: "google" },
	{ name: "Google-2", logo: "google-2" },
	{ name: "Samsung", logo: "samsung" },
	{ name: "Samsung-2", logo: "samsung-2" },
	{ name: "Microsoft", logo: "microsoft" },
	{ name: "Microsoft-2", logo: "microsoft-2" },
	{ name: "Windows11", logo: "windows11" },
	{ name: "WindowsXp", logo: "windows-xp" },
	{ name: "CCTV", logo: "cctv" },
	{ name: "BBC", logo: "bbc" },
	{ name: "抖音", logo: "douyin" },
	{ name: "QQ", logo: "qq" },
	{ name: "QQ空间", logo: "qzone" },
	{ name: "Java", logo: "java" },
	{ name: "Javascript", logo: "javascript" },
	{ name: "nodejs", logo: "nodejs" },
	{ name: "PHP", logo: "php" },
	{ name: "耐克", logo: "nike" },
	{ name: "南极人", logo: "njr" },
	{ name: "拼多多", logo: "pdd" },
	{ name: "菠萝", logo: "boluo" },
	{ name: "头像1", logo: "avatar1" },
	{ name: "头像2", logo: "avatar2" },
	{ name: "头像3", logo: "avatar3" },
	{ name: "头像4", logo: "avatar4" },
];

export const watermarkList: WatermarkListBaseItem[] = [
	{
		name: "小米徕卡",
		config: "小米徕卡",
	},
	{
		name: "小米徕卡2",
		config: "小米徕卡2",
	},
	{
		name: "默认样式",
		config: "默认样式",
	},
	{
		name: "纯图标",
		config: "纯图标",
	},
	{
		name: "经典模式",
		config: "经典模式",
	},
	{
		name: "经典模糊",
		config: "经典模糊",
	},
	{
		name: "印象毛玻璃",
		config: "印象毛玻璃",
	},
	{
		name: "时间+型号",
		config: "时间+型号",
	},
];

export function getWatermarkList(): WatermarkListItem[] {
	const list: WatermarkListItem[] = watermarkList.map((item, index) => {
		return { ...item, index: index };
	});

	// 获取本地的配置
	const store = useStore();
	const localNames: WatermarkListItem[] = store.localWatermarks.map(
		(item, index) => {
			let watermark_item: WatermarkListItem = {
				index: list.length + index,
				is_local: true,
				name: item.name,
				config: JSON.stringify(item.config),
				config_name: item?.config_name,
			};
			return watermark_item;
		}
	);

	// 根据index属性升序
	return [...localNames, ...list].sort((a, b) => a.index - b.index);

	// return list;
}

// 获取本地浏览器支持的字体
export const getSupportedFonts = (): string[] => {
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

export const preDefineColors = [
	"#FFF",
	"#808080",
	"#CCC",
	"#DCDCDC",
	"#000",
	"#F00",
	"#00FF00",
	"#0000FF",
];
