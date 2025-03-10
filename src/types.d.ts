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
	};
	shadow: {
		show: boolean;
		color: string;
		size: number;
		x: number;
		y: number;
	};

	draw: (file: File, img: Img, config: Config) => void;
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
	exif: Object;
}

export { Config, Img };
