import type { Exifr, Tags } from "exifr";
import type {
	IColor,
	ILine,
	IRect,
	IText,
	ITextAlign,
	ITextDecoration,
} from "leafer-ui";

declare interface BaseConfig {
	fill?: string;
	global: {
		paddings: {
			top: number;
			right: number;
			bottom: number;
			left: number;
		};
	};
	img: {
		margin: {
			top: number;
			bottom: number;
			left: number;
			right: number;
		};
		cornerRadius: [number, number, number, number];
		shadow?: {
			x: number;
			y: number;
			blur: number;
			color: string;
		};
	};
	watermark: {
		height: number;
		fill: string;
		paddings: {
			top: number;
			bottom: number;
			left: number;
			right: number;
		};
		model: Model;
		params: Params;
		time: Time;
		lens: Lens;
		logo?: Logo;
		// location: IText;
		// divider: ILine;
	};
}

declare interface Model extends Partial<IText> {
	/**
	 * 是否支持显示型号
	 */
	enable: boolean;
	/**
	 * 型号文字是否替换Z为ℤ
	 */
	replaceZ: boolean;
}
declare interface Params extends Partial<IText> {
	/**
	 * 是否支持
	 */
	enable: boolean;
	/**
	 * 是否使用等效焦距
	 */
	useEquivalentFocalLength?: boolean;
	/**
	 * 样式索引
	 */
	styleIndex?: number;
	/**
	 * 样式名称列表
	 */
	styles?: Array<string>;
}
declare interface Time extends Partial<IText> {
	/**
	 * 是否支持时间
	 */
	enable: boolean;
	/**
	 * 时间格式(YYYY-MM-DD HH:mm:ss)
	 */
	format?: string;
}
declare interface Lens extends Partial<IText> {
	/**
	 * 是否支持镜头信息
	 */
	enable: boolean;
}
declare interface Radius {
	/**
	 * 是否支持圆角
	 */
	enable: boolean;
	/**
	 * 是否显示圆角
	 */
	show: boolean;
	/**
	 * 圆角大小
	 */
	size: number;
	// 是否统一半径
	uniform: boolean;
	lt: number;
	rt: number;
	lb: number;
	rb: number;
}
export declare type BackgroundType = "color" | "blur" | "gradient";
declare interface Blur {
	/**
	 * 背景类型（0-纯色 1-模糊 2-渐变）
	 */
	type: BackgroundType;
	/**
	 * 是否支持模糊
	 */
	// enable: boolean;
	/**
	 * 模糊大小
	 */
	size: number;
	gradient?: {
		angle: number;
		colors: string[];
	};
}

export type TextAlign = "left" | "center" | "right";
export declare interface Logo extends Partial<IRect> {
	/**
	 * 是否支持logo
	 */
	enable: boolean;
	/**
	 * 是否自动匹配logo
	 */
	auto: boolean;
	/**
	 * logo名称
	 */
	name: string;
	/**
	 * 自定义的logo地址（可选），此选项可能导致无法导出图片
	 */
	url?: string;
}
declare interface Location extends LabelConfigItem {
	/**
	 * 是否支持位置功能
	 */
	enable: boolean;
}
declare interface Divider {
	/**
	 * 是否支持分割线
	 */
	enable: boolean;
	/**
	 * 是否显示分割线
	 */
	show: boolean;
	/**
	 * 分割线颜色
	 */
	color: string;
	/**
	 * 分割线宽度
	 */
	width: number;
	/**
	 * 缩放倍数
	 */
	scale: number;
	/**
	 * 间隔
	 */
	margin: number;
	/**
	 * 分隔符
	 */
	separator?: string;
}
declare interface Shadow {
	/**
	 * 是否显示阴影
	 */
	show: boolean;
	/**
	 * 阴影颜色
	 */
	color: string;
	/**
	 * 阴影大小
	 */
	size: number;
	/**
	 * 阴影水平偏移
	 */
	x: number;
	/**
	 * 阴影垂直偏移
	 */
	y: number;
}

declare interface Filter {
	/**
	 * 饱和度(0-200%，默认100)
	 */
	saturation: number;
	/**
	 * 亮度(0-200%，默认100)
	 */
	brightness: number;
	/**
	 * 对比度(0-200%，默认100)
	 */
	contrast: number;
	/**
	 * 灰度(0-100%，默认0)
	 */
	grayscale: number;
	/**
	 * 反色(0-100%，默认0)
	 */
	invert: number;
}
declare interface Border {
	/**
	 * 是否支持
	 */
	enable: boolean;
	/**
	 * 是否显示
	 */
	show: boolean;
	/**
	 * 宽度
	 */
	width: number;
	/**
	 * 颜色
	 */
	color: string;
}

declare interface Margin {
	show: boolean;
	top: number;
	right: number;
	bottom: number;
	left: number;
}

// export declare type TextAlign = "left" | "center" | "right";
export declare type TextVerticalAlign = "top" | "middle" | "bottom";

declare interface BaseLabelConfig {
	show: boolean;
	color: string;
	size: number;
	italic: boolean;
	bold: boolean;
	text?: string;
}
export declare interface LabelConfigItem extends BaseLabelConfig {
	name?: string;
	x?: number;
	y?: number;
	align?: ITextAlign;
	verticalAlign?: TextVerticalAlign;
	font?: string;
	stroke?: boolean;
	strokeWidth?: number;
	draggable?: boolean;
	/**
	 * 是否大写
	 */
	letterUpperCase?: boolean;
	/**
	 * 显示范围
	 */
	showRect?: boolean;
	// 文字背景
	bg?: string;
	// 背景圆角
	corner?: number;
	bgStroke?: string;
	textDecoration?: ITextDecoration;
}
export declare interface ImagesConfigItem {
	title: string;
	show: boolean;
	circle: boolean;
	url: string;
	width: number;
	height: number;
	name: string;
	verticalOffset: number;
	horizontalOffset: number;
	alpha: number;
	rotate: number;
	blendMode: BlendMode;
}

/**
 * 混合模式
 */
export declare type BlendMode =
	| "normal"
	| "multiply"
	| "screen"
	| "overlay"
	| "darken"
	| "lighten"
	| "color-dodge"
	| "color-burn"
	| "hard-light"
	| "soft-light"
	| "difference"
	| "exclusion"
	| "hue"
	| "saturation"
	| "color"
	| "luminosity";
export declare type BlendModeItem = {
	/**
	 * 混合模式
	 */
	mode: BlendMode;
	desc: string;
};

// declare interface BaseConfig {
// 	/**
// 	 * 水印名称，和文件名一致
// 	 */
// 	readonly name: string;
// 	/**
// 	 * 全局字体，移动端不一定支持某些字体
// 	 */
// 	font: string;
// 	/**
// 	 * 图片外边距，会影响整个图片的高度
// 	 */
// 	paddings: {
// 		/**
// 		 * 图片上边距
// 		 */
// 		top: number;
// 		/**
// 		 * 图片右边距
// 		 */
// 		right: number;
// 		/**
// 		 * 图片下边距
// 		 */
// 		left: number;
// 		/**
// 		 * 图片下边距
// 		 */
// 		bottom: number;
// 	};
// 	watermark: {
// 		/**
// 		 * 水印所在的位置,用于调整水印高（宽）度
// 		 */
// 		position?: "bottom" | "top" | "left" | "right" | "inner";
// 		/**
// 		 * 水印的基础高度，水印在上下对应高度的倍数，水印在左右对应宽度的倍数
// 		 */
// 		height: number;
// 		model: Model;
// 		params: Params;
// 		time: Time;
// 		lens: Lens;
// 		marign: {
// 			top: number;
// 			right: number;
// 			bottom: number;
// 			left: number;
// 		};
// 		/**
// 		 * 整体背景颜色（包含水印绘制部分和图片的边距空位的颜色）
// 		 */
// 		bgColor: string;
// 		/**
// 		 * 水印范围的颜色（仅仅在水印范围内生效）
// 		 */
// 		bg?: string;
// 		offsetX?: number;
// 		offsetY?: number;
// 	};
// 	radius: Radius;
// 	blur: Blur;
// 	logo: Logo;
// 	divider: Divider;
// 	shadow: Shadow;
// 	location?: Location;
// 	filter: Filter;
// 	border?: Border;
// 	margin?: Margin;
// 	labels?: Array<IText>;
// 	images?: Array<ImagesConfigItem>;
// }

export declare type AfterDrawFun = (ctx: CanvasRenderingContext2D) => void;
export declare interface Config extends BaseConfig {
	/**
	 * 绘制函数，从配置到最终图片的具体实现。
	 */
	// draw?: DrawFun;
	/**
	 * 调用draw函数之前调用的函数，执行一些操作
	 */
	// beforeDraw?: (canvas: HTMLCanvasElement) => void;
	/**
	 * 调用draw函数之后执行的操作
	 */
	// afterDraw?: AfterDrawFun;
	caculate: CaculateFun;
}

export declare type CaculateFun = (x: number, y: number) => DrawConfig;
export declare type DrawConfig = {
	rect1: {
		x: number;
		y: number;
	};
	rect2: {
		x: number;
		y: number;
	};
	width: number;
	height: number;
	imgX: number;
	imgY: number;
	modelText?: string;
	paramsText?: string;
	timeText?: string;
	lensText?: string;
	locationText?: string;
	domList?: Array<Partial<Model | Params | Time | Lens>>;
	imgList?: Array<Partial<IRect>>;
};
export declare type DrawFun = (
	img: Img,
	config: Config,
	context: Context
) => void;
declare interface Context {
	/**
	 * 画布上下文
	 */
	ctx: CanvasRenderingContext2D;
	/**
	 * 画布对象
	 */
	canvas: HTMLCanvasElement;
	/**
	 * 水印范围的左上角坐标
	 */
	rect1: {
		x: number;
		y: number;
	};
	/**
	 * 水印范围的右下角坐标
	 */
	rect2: {
		x: number;
		y: number;
	};
	/**
	 * 格式化后的曝光时间
	 */
	exposureTime?: string;
	/**
	 * 格式化后的焦距
	 */
	focalLength?: string;
}

export declare interface Img {
	/**
	 * 当前图片的宽度
	 */
	width: number;
	/**
	 * 当前图片的高度
	 */
	height: number;
	/**
	 * 图片的文件名
	 */
	fileName: string;
	/**
	 * 图片大小(B)
	 */
	size: string;
	/**
	 * 图片类型(MIME)
	 */
	type: string;
	/**
	 * 图片的拍摄时间
	 */
	time: string;
	/**
	 * 导出设置
	 */
	export: {
		/**
		 * 导出文件名
		 */
		name: string;
		/**
		 * 导出质量(0-1，推荐0.97，兼顾画质和文件大小)
		 */
		quality: number;
		/**
		 * 导出文件的扩展名
		 */
		ext: ImgExt;
	};
	/**
	 * EXIF信息
	 */
	exif: any;
	/**
	 * 自定义的型号文本
	 */
	modelText: string;
	/**
	 * 自定义的参数文本
	 */
	paramsText: string;
	/**
	 * 自定义的时间文本
	 */
	timeText: string;
	/**
	 * 镜头文本
	 */
	lensText: string;
	/**
	 * 经纬度
	 */
	locationText: string;
}

export declare type CameraBrands = {
	/**
	 * 显示的名称
	 */
	name: string;
	/**
	 * 对应的文件名
	 */
	logo: string;
	/**
	 * 自动匹配logo时使用的厂商名称
	 */
	make?: string[];
	/**
	 * logo对应的图床地址
	 */
	url: string;
};

export declare type ImgExt = "jpeg" | "png";

// 保存在pinia的单个水印配置
export declare type LocalWaterMarkItem = {
	name: string;
	/**
	 * 从哪个内置配置文件修改来的，要调用对应的draw函数
	 */
	config_name: string;
	config: BaseConfig;
	/**
	 * 是否是本地保存的自定义配置
	 */
	is_local?: boolean;
};

export declare type WatermarkListBaseItem = {
	name: string;
	config: string;
	url?: string;
};
export declare type WatermarkListItem = WatermarkListBaseItem & {
	index: number;
	is_local?: boolean;
	/**
	 * 从哪个内置配置文件修改来的，要调用对应的draw函数
	 */
	config_name?: string;
};

export declare type AuxiliaryLines = {
	/**
	 * 是否显示水平中心线
	 */
	horizontalCenter: boolean;
	/**
	 * 是否显示水印范围
	 */
	watermarkRange: boolean;
	/**
	 * 是否显示垂直中心线
	 */
	verticalCenter: boolean;
	/**
	 * 是否显示水印水平中心线
	 */
	watermarkHorizontalCenter: boolean;
};

export declare type Point = {
	/**
	 * 点x坐标
	 */
	x: number;
	/**
	 * 点y坐标
	 */
	y: number;
};
