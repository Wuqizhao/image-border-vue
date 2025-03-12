import type { Config, Img } from "../types";
const print = (config: Config, img: Img) => {
	console.log("当前配置：", config);
	console.log("当前图片信息：", img);
};
// 转换曝光时间的函数
const convertExposureTime = (exposureTime: number) => {
	if (exposureTime < 1) {
		return `1/${Math.round((1 / exposureTime) * 10) / 10}`;
	} else {
		return `${exposureTime}`;
	}
};
function formatDate(
	date: Date,
	format: string = "yyyy-MM-dd HH:mm:ss"
): string {
	const o: { [key: string]: number } = {
		"M+": date.getMonth() + 1, // 月份
		"d+": date.getDate(), // 日
		"H+": date.getHours(), // 小时
		"m+": date.getMinutes(), // 分
		"s+": date.getSeconds(), // 秒
		"q+": Math.floor((date.getMonth() + 3) / 3), // 季度
		S: date.getMilliseconds(), // 毫秒
	};

	if (/(y+)/.test(format)) {
		format = format.replace(
			RegExp.$1,
			(date.getFullYear() + "").substr(4 - RegExp.$1.length)
		);
	}

	for (const k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			const match = RegExp.$1;
			const value = o[k];
			format = format.replace(
				match,
				match.length === 1
					? value.toString()
					: ("00" + value).substr(("" + value).length)
			);
		}
	}

	return format;
}

const download = (name: string) => {
	const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
	if (!canvas) throw new Error("canvas不存在");
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/jpeg", 1);
	a.download = name;
	a.click();
};

// 深拷贝对象，包含函数
function deepClone<T>(value: T): T {
	// 如果值为 null 或者不是对象或函数，则直接返回该值
	if (value === null || typeof value !== "object") {
		return value;
	}

	// 如果是数组
	if (Array.isArray(value)) {
		return value.map((item) => deepClone(item)) as T;
	}

	// 如果是函数
	if (typeof value === "function") {
		return value as T;
	}

	// 如果是普通对象
	const clone: Record<string, any> = {};
	for (const key in value) {
		if (Object.prototype.hasOwnProperty.call(value, key)) {
			clone[key] = deepClone(value[key]);
		}
	}
	return clone as T;
}

// 定义相机品牌
const cameraBrands = [
	{ name: "佳能", logo: "canon" },
	{ name: "尼康", logo: "nikon" },
	{ name: "索尼", logo: "sony" },
	{ name: "富士", logo: "fuji" },
	{ name: "松下", logo: "panasonic" },
	{ name: "小米", logo: "xiaomi" },
	{ name: "华为", logo: "huawei" },
	{ name: "苹果", logo: "apple" },
	{ name: "适马", logo: "sigma" },
	{ name: "徕卡", logo: "leica" },
	{ name: "哈苏", logo: "hasselblad" },
	{ name: "蔡司", logo: "zeiss" },
	{ name: "奥林巴斯", logo: "olympus" },
	{ name: "耐克", logo: "nike" },
	{ name: "南极人", logo: "njr" },
	{ name: "拼多多", logo: "pdd" },
	{ name: "央视新闻", logo: "ysxw" },
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
		name: "徕卡",
		config: "watermark4",
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

export {
	print,
	convertExposureTime,
	download,
	deepClone,
	cameraBrands,
	watermarkList,
	formatDate,
};
