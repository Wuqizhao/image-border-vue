import type { Exifr, Tags } from "exifr";

declare interface Config {
	paddings: {
		top: number;
		right: number;
		left: number;
		bottom: number;
	};
	watermark: {
		model: {
			show: boolean;
			color: string;
			size: number;
			replaceZ: boolean;
			italic: boolean; // 斜体
			bold: boolean; // 加粗
		};
		params: {
			show: boolean;
			color: string;
			size: number;
			// 使用等效焦距
			useEquivalentFocalLength: boolean;
			// 字母大写
			letterUpperCase: boolean;
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
	};
	divider: {
		enable: boolean; // 是否支持
		show: boolean;
		color: string;
		width: number;
		scale: number;// 缩放倍数
	};
	shadow: {
		show: boolean;
		color: string;
		size: number;
		x: number;
		y: number;
	};
	draw: DrawFun;
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
	};
	exif: any;
	modelText: string;
	paramsText: string;
	timeText: string;
}

export { Config, Img, DrawFun };
