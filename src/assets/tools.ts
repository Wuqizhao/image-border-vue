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

// 把Date转换成"YYYY-MM-DD HH:mm:ss"格式
const formatDate = (date: Date) => {
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, "0");
	const day = String(date.getDate()).padStart(2, "0");
	const hours = String(date.getHours()).padStart(2, "0");
	const minutes = String(date.getMinutes()).padStart(2, "0");
	const seconds = String(date.getSeconds()).padStart(2, "0");
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const download = (name: string) => {
	const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
	if (!canvas) throw new Error("canvas不存在");
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/jpeg", 1);
	a.download = name;
	a.click();
};

export { print, convertExposureTime, formatDate, download };
