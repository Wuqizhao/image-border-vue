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
		};
		time: {
			show: boolean;
			color: string;
			size: number;
		};
		paddings: {
			lr: number;
			tb: number;
		};
		bgColor: string;
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
	exif: object;
}

export { Config, Img };
