import type {
	CameraBrands,
	Config,
	Img,
	TextAlign,
	TextVerticalAlign,
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
	{ name: "佳能(圆)", logo: "canon-circle", make: ["Canon"] },
	{ name: "佳能", logo: "canon" },
	{ name: "佳能(白)", logo: "canon-white" },
	{ name: "佳能-2", logo: "canon-2" },
	{ name: "尼康", logo: "nikon", make: ["NIKON CORPORATION"] },
	{ name: "尼康-Z系列(黑)", logo: "nikon-z" },
	{ name: "尼康-Z系列(白)", logo: "nikon-z-white" },
	{ name: "尼康-文字(黑)", logo: "nikon-2" },
	{ name: "尼康-文字(白)", logo: "nikon-2-white" },
	{ name: "索尼(黑)", logo: "sony", make: ["SONY"] },
	{ name: "索尼(白)", logo: "sony-white" },
	{ name: "索尼-Alpha(白)", logo: "sony-alpha-white" },
	{ name: "索尼-Alpha(黑)", logo: "sony-alpha-black" },
	{ name: "索尼-Alpha2(黑)", logo: "sony-alpha-2-black" },
	{ name: "索尼-Alpha2(白)", logo: "sony-alpha-2-white" },
	{ name: "富士", logo: "fuji", make: ["FUJIFILM"] },
	{ name: "富士(白)", logo: "fuji-white" },
	{ name: "松下", logo: "panasonic" },
	{ name: "Lumix", logo: "lumix" },
	{ name: "Lumix(白)", logo: "lumix-white" },
	{ name: "小米", logo: "xiaomi", make: ["Xiaomi"] },
	{ name: "小米-2", logo: "xiaomi-2" },
	{ name: "小米汽车", logo: "xiaomi-car" },
	{ name: "小米澎湃", logo: "hyperos" },
	{ name: "红米(彩色)", logo: "redmi" },
	{ name: "红米(黑)", logo: "redmi-black" },
	{ name: "红米(白)", logo: "redmi-white" },
	{ name: "华为", logo: "huawei" },
	{ name: "XMAGE-2", logo: "xmage-2" },
	{ name: "XMAGE", logo: "xmage" },
	{ name: "华为(黑)", logo: "huawei-black" },
	{ name: "华为(白)", logo: "huawei-white" },
	{ name: "荣耀", logo: "honor" },
	{ name: "苹果(黑)", logo: "apple", make: ["Apple"] },
	{ name: "苹果(灰)", logo: "apple-gray" },
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
	{ name: "哈苏-2(黑)", logo: "hasselblad-2" },
	{ name: "哈苏-2(白)", logo: "hasselblad-2-white" },
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
	{ name: "中国国家地理(黑)", logo: "cng" },
	{ name: "中国国家地理(白)", logo: "cng-white" },
	{ name: "视觉中国(黑)", logo: "vcg" },
	{ name: "视觉中国(白)", logo: "vcg-white" },
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
	{ name: "和平精英", logo: "hpjy" },
	{ name: "原神", logo: "yuanshen" },
	{ name: "原神-2", logo: "yuanshen-2" },
	{ name: "原神-2(白)", logo: "yuanshen-2-white" },
	{ name: "瑞幸", logo: "luckin" },
	{ name: "星巴克", logo: "starbucks" },
	{ name: "KFC", logo: "kfc" },
	{ name: "KFC-2", logo: "kfc-2" },
	{ name: "麦当劳", logo: "mcd" },
	{ name: "头像1", logo: "avatar1" },
	{ name: "头像2", logo: "avatar2" },
	{ name: "头像3", logo: "avatar3" },
	{ name: "头像4", logo: "avatar4" },
];

export const watermarkList: WatermarkListBaseItem[] = [
	{
		name: "小米徕卡",
		config: "小米徕卡",
		url: "https://img.lsfd.asia/file/AgACAgUAAyEGAASWuELpAAMEZ_5rRw5CVPpsGb88YlmJczm3178AAn3DMRs4AAH4V7vXffdQ9OpZAQADAgADdwADNgQ.jpeg",
	},
	{
		name: "XMAGE",
		config: "XMAGE",
		url: "https://img.lsfd.asia/file/AgACAgUAAyEGAASWuELpAAMOaAMgQ-9qLslbLbeaPWsrN8vc0S8AAgnGMRuH_RlUBHf9LifJp8oBAAMCAAN3AAM2BA.jpeg",
	},
	{
		name: "小米徕卡2",
		config: "小米徕卡2",
		url: "https://img.lsfd.asia/file/AgACAgUAAyEGAASWuELpAAMFZ_5sF_T-Bl3s1eS_0L_y4iPZEqIAAoDDMRs4AAH4VzQEPoriSRGGAQADAgADdwADNgQ.jpeg",
	},
	{
		name: "蔡司水印",
		config: "蔡司水印",
		url: "https://img.lsfd.asia/file/AgACAgUAAyEGAASWuELpAAMGZ_5sKIzBgYwoCj_7vnyIREeKaAwAAoHDMRs4AAH4V9VqnRTq_IDHAQADAgADdwADNgQ.jpeg",
	},
	{
		name: "默认样式",
		config: "默认样式",
		url: "https://img.lsfd.asia/file/BQACAgUAAyEGAASWuELpAAMHZ_5sN9t_sDqdgYjPgJnh9Yk5k2sAAnsWAAI4AAH4V5_DjmQifqsdNgQ.jpeg",
	},
	{
		name: "纯图标",
		config: "纯图标",
		url: "https://img.lsfd.asia/file/AgACAgUAAyEGAASWuELpAAMIZ_5sQzG9ZlG49Or4jht-2Fb-4xwAAoLDMRs4AAH4V_-Idc9UfSNSAQADAgADdwADNgQ.jpeg",
	},
	{
		name: "经典模式",
		config: "经典模式",
		url: "https://img.lsfd.asia/file/BQACAgUAAyEGAASWuELpAAMJZ_5sUyE_ShlkB7EWFyVhz3ptAAGfAAJ8FgACOAAB-FcmokZYpDK4yTYE.jpeg",
	},
	{
		name: "经典模糊",
		config: "经典模糊",
		url: "https://img.lsfd.asia/file/BQACAgUAAyEGAASWuELpAAMKZ_5sYa6xUVcMdWXFMOqRseFUCo4AAn0WAAI4AAH4V_NxgUJcVsFaNgQ.jpeg",
	},
	{
		name: "印象毛玻璃",
		config: "印象毛玻璃",
		url: "https://img.lsfd.asia/file/BQACAgUAAyEGAASWuELpAAMLZ_5sdfggwZHkmAZVXkqsLs4DzAUAAn4WAAI4AAH4V7HKDo2kzJPONgQ.jpeg",
	},
	{
		name: "时间+型号",
		config: "时间+型号",
		url: "https://img.lsfd.asia/file/AgACAgUAAyEGAASWuELpAAMMZ_5sg0Lc_hvP3K8OVzMuerQKaR4AAoPDMRs4AAH4V0c1EWPvf2iBAQADAgADdwADNgQ.jpeg",
	},
];

/**
 * 获取水印列表，包含预设水印和本地自定义水印
 *
 * @returns {WatermarkListItem[]} 返回合并后的水印列表，按index属性升序排列
 *
 * @description
 * - 将预设水印列表添加index属性
 * - 获取本地存储的自定义水印并转换格式
 * - 合并预设和本地水印列表并按index排序
 */
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
}

/**
 * 获取支持的字体列表
 * @returns 返回包含所有支持字体名称的字符串数组
 * @description 返回一个包含中英文字体的数组,包括Arial、宋体等常用字体
 */
export const getSupportedFonts = (): string[] => {
	return [
		"Arial",
		"Long Cang",
		"Zhi Mang Xing",
		"Liu Jian Mao Cao",
		"Ma Shan Zheng",
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

export const defaultLabelConfig = {
	name: `自定义文本(${new Date().getTime()})`,
	show: true,
	align: "left" as TextAlign,
	verticalAlign: "middle" as TextVerticalAlign,
	color: "#F00",
	size: 160,
	italic: false,
	bold: false,
	text: "请输入文本",
	x: 100,
	y: 100,
	font: "微软雅黑",
};

export const defaultImageConfig = {
	title: `自定义图片(${new Date().getTime()})`,
	show: true,
	url: "",
	horizontalOffset: 100,
	verticalOffset: 100,
	width: 300,
	height: 300,
	circle: false,
	name: "nikon",
};
