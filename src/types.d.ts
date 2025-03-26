import type { de } from "element-plus/es/locales.mjs";
import type { Exifr, Tags } from "exifr";

declare interface Config {
	font: string;
	paddings: {
		top: number;
		right: number;
		left: number;
		bottom: number;
	};
	watermark: {
		position?: "bottom" | "top" | "left" | "right"; // 水印位置
		height: number; // 基础高度
		model: {
			enable: boolean;
			show: boolean;
			color: string;
			size: number;
			replaceZ: boolean;
			italic: boolean; // 斜体
			bold: boolean; // 加粗
		};
		params: {
			enable: boolean;
			show: boolean;
			color: string;
			size: number;
			// 使用等效焦距
			useEquivalentFocalLength: boolean;
			// 字母大写
			letterUpperCase: boolean;
			// 斜体
			italic: boolean;
		};
		time: {
			enable: boolean;
			show: boolean;
			color: string;
			size: number;
			format: string;
		};
		paddings: {
			lr: number;
			tb: number;
		};
		bgColor: string;
	};
	radius: {
		enable: boolean;
		show: boolean;
		size: number;
	};
	blur: {
		enable: boolean;
		size: number;
	};
	logo: {
		enable: boolean;
		auto: boolean;
		show: boolean;
		name: string;
		width: number;
		height: number;
		// 垂直偏移
		verticalOffset: number;
		// 是否圆形图片
		circle: boolean;
		// 自定义url
		url?: string;
	};
	divider: {
		enable: boolean; // 是否支持
		show: boolean;
		color: string;
		width: number;
		scale: number; // 缩放倍数
		margin: number; // 间隔
	};
	shadow: {
		show: boolean;
		color: string;
		size: number;
		x: number;
		y: number;
	};
	draw: DrawFun;
	beforeDraw?: (canvas: HTMLCanvasElement) => void;
	afterDraw?: () => void;
}

declare type DrawFun = (img: Img, config: Config, context: Context) => void;
declare interface Context {
	ctx: CanvasRenderingContext2D;
	canvas: HTMLCanvasElement;
	rect1: {
		x: number;
		y: number;
	};
	rect2: {
		x: number;
		y: number;
	};
	exposureTime?: string;
	focalLength?: string;
}

declare interface Img {
	width: number;
	height: number;
	fileName: string;
	size: string;
	type: string;
	time: string;
	export: {
		name: string;
		quality: number;
		ext: ImgExt;
	};
	exif: any;
	modelText: string;
	paramsText: string;
	timeText: string;
}

declare type CameraBrands = {
	name: string;
	logo: string;
	make?: string[]; // 自动匹配logo时使用的厂商名称
};

declare type ImgExt = "jpeg" | "png";

export { Config, Img, DrawFun, CameraBrands,ImgExt };
