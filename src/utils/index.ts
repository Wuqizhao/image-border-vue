import { ElMessage, ElNotification } from "element-plus";
import type {
	AuxiliaryLines,
	BlendMode,
	BlendModeItem,
	Config,
	ImagesConfigItem,
	Img,
	LabelConfigItem,
	Logo,
	Point,
} from "../types";
import { cameraBrands } from "../assets/tools";

/**
 * 将曝光时间转换为分数字符串格式
 * @param exposureTime 曝光时间(秒)
 * @returns 格式化后的曝光时间字符串。如果小于1秒则返回分数形式(如"1/60"),否则直接返回数字字符串
 */
export function convertExposureTime(exposureTime: number) {
	if (exposureTime < 1) {
		return `1/${Math.round(1 / exposureTime)}`;
	} else {
		return `${exposureTime}`;
	}
}

/**
 * 将画布内容下载为图片文件
 * @param name - 下载文件的名称(不包含扩展名)
 * @param quality - 图片质量，范围0-1，默认为0.97
 * @param ext - 图片格式扩展名，默认为"jpeg"
 * @throws {Error} 当画布元素不存在时抛出错误
 * @returns Promise<void>t download('my-image', 0.8, 'png')
 * ```
 */
export async function download(canvas: null | HTMLCanvasElement, config: Img) {
	const {
		name = config.fileName,
		quality = 0.97,
		ext = "jpeg",
	} = config.export;
	if (!canvas) throw new Error("canvas不存在");
	const mimeType = `image/${ext.toLowerCase()}`;

	try {
		// 使用 toBlob 异步生成图片数据
		await new Promise<void>((resolve, reject) => {
			canvas.toBlob(
				(blob) => {
					if (!blob) {
						reject(new Error("无法生成图片 Blob"));
						return;
					}

					// 创建临时链接并触发下载
					const a = document.createElement("a");
					const url = URL.createObjectURL(blob);
					a.href = url;
					a.download = `${name}.${ext}`;
					a.click();
					URL.revokeObjectURL(url); // 释放内存
					resolve();
				},
				mimeType,
				quality
			);
		});
	} catch (error) {
		ElMessage.error("图片导出失败:" + error);
	}
}

/**
 * 深度克隆一个值，支持函数、对象、数组和基本类型
 * @template T 要克隆的值的类型
 * @param {T} value 需要被克隆的值
 * @returns {T} 返回克隆后的新值 cloned = deepClone(obj); // { a: 1, b: { c: 2 } }
 * ```
 */
export function deepClone<T>(value: T): T {
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

/**
 * 处理图片URL
 * @param file - 图片文件对象或图片URL字符串
 * @returns 如果输入为字符串则直接返回,否则返回文件的对象URL
 */
export function getImageSrc(file: File | string) {
	if (typeof file === "string") {
		if (file.startsWith("blob")) {
			return file;
		}

		if (file.startsWith("http")) {
			return "/img?url=" + file;
		}

		return "./logos/" + file + ".png";
	}

	return URL.createObjectURL(file);
}

/**
 * 在画布上绘制Logo图片
 * @param config - 配置对象，包含Logo的相关设置
 * @param ctx - Canvas 2D渲染上下文
 * @param x - Logo绘制的x坐标
 * @param y - Logo绘制的y坐标
 *
 * @description
 * - 支持绘制圆形或矩形Logo
 * - 当config.logo.circle为true时绘制圆形Logo
 * - 加载失败时会显示错误通知
 *
 * @throws 当Logo图片加载失败时，会通过ElNotification显示错误信息
 */
export async function drawLogo(
	logoConfig: Logo | ImagesConfigItem,
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	opacity: number = 1,
	rotate: number = 0,
	blendMode: BlendMode = "normal"
) {
	const img = new Image();
	img.src = getImageSrc(logoConfig.url || logoConfig.name);
	img.onload = () => {
		ctx.save();
		if (logoConfig.circle) {
			// 绘制圆形LOGO
			ctx.beginPath();
			ctx.arc(
				x + logoConfig.width / 2,
				y + logoConfig.height / 2,
				logoConfig.width / 2,
				0,
				Math.PI * 2
			);
			ctx.clip();
		}
		ctx.globalAlpha = opacity;

		// 旋转角度
		ctx.translate(x + logoConfig.width / 2, y + logoConfig.height / 2);
		ctx.rotate((rotate * Math.PI) / 180);
		ctx.translate(-(x + logoConfig.width / 2), -(y + logoConfig.height / 2));

		// 混合模式
		ctx.globalCompositeOperation =
			blendMode as CanvasRenderingContext2D["globalCompositeOperation"];

		ctx.drawImage(img, x, y, logoConfig.width, logoConfig.height);
		ctx.restore();
		URL.revokeObjectURL(img.src);
	};
	img.onerror = (err) => {
		console.error("Logo加载失败:", err);
		ElNotification.error({
			title: "Logo加载失败",
			message: err.toString(),
		});
	};
}

/**
 * 在画布上绘制一条直线
 * @param ctx - Canvas 2D 渲染上下文
 * @param x1 - 起点x坐标
 * @param y1 - 起点y坐标
 * @param x2 - 终点x坐标
 * @param y2 - 终点y坐标
 * @param config - 线条配置对象，包含颜色(color)和粗细(size)属性
 */
export function drawLine(
	ctx: CanvasRenderingContext2D,
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	config: Record<string, any>
) {
	if (!ctx) return;
	ctx.save();

	ctx.strokeStyle = config.color;
	ctx.lineWidth = config.size;

	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);
	ctx.stroke();

	ctx.restore();
}

/**
 * 检测当前设备是否为移动设备
 * 通过检查用户代理字符串判断是否为移动设备
 * @returns {boolean} 如果是移动设备返回 true,否则返回 false
 */
export function isMobile() {
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	return isMobile;
}

export function drawCustomLabelsAndImages(
	ctx: CanvasRenderingContext2D,
	labels: LabelConfigItem[] | undefined,
	images: ImagesConfigItem[] | undefined
) {
	// 渲染自定义文本
	if (labels) {
		for (const label of labels) {
			if (!label.show) continue;

			ctx.save();
			ctx.textAlign = label.align;
			ctx.textBaseline = label.verticalAlign;
			const font = label.font.replace(/\.ttf|\.TTF|\.otf|\.OTF/, "");
			ctx.font = `${label.bold ? "bold" : ""} ${label.italic ? "italic" : ""} ${
				label.size
			}px ${font}`;

			// 描边效果
			if (label.stroke) {
				ctx.lineWidth = label.strokeWidth;
				ctx.strokeStyle = label.color;
				ctx.strokeText(label.text, label.x, label.y);
			} else {
				ctx.fillStyle = label.color;
				ctx.fillText(label.text, label.x, label.y);
			}

			if (label?.draggable) {
				// 绘制边框
				ctx.lineWidth = 3;
				ctx.strokeStyle = "red";
				ctx.strokeRect(
					label.x,
					label.y,
					ctx.measureText(label.text).width,
					label.size
				);
			}

			ctx.restore();
		}
	}

	// 绘制自定义图片
	if (images) {
		for (const image of images) {
			if (!image.show) continue;
			ctx.save();
			drawLogo(
				image,
				ctx,
				image.horizontalOffset,
				image.verticalOffset,
				image.alpha,
				image.rotate,
				image.blendMode
			);
			ctx.restore();
		}
	}
}

export function replaceZ(text: string) {
	return text.replace(/z|Z/g, "ℤ");
}

export function drawRadiusRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
	stroke: boolean = false
) {
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.lineTo(x + width - radius, y);
	ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
	ctx.lineTo(x + width, y + height - radius);
	ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
	ctx.lineTo(x + radius, y + height);
	ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
	ctx.lineTo(x, y + radius);
	ctx.quadraticCurveTo(x, y, x + radius, y);
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
}

/**
 * 在指定的Canvas上绘制辅助线。
 *
 * @param canvas - 用于绘制辅助线的HTMLCanvasElement对象。
 * @param auxiliaryLines - 包含辅助线配置的对象，决定哪些辅助线需要绘制。
 * @param rect1 - 水印范围左上角点。
 * @param rect2 - 水印范围右下角点。。
 */
export function drawAuxiliaryLines(
	canvas: HTMLCanvasElement,
	auxiliaryLines: AuxiliaryLines,
	rect1: Point,
	rect2: Point
) {
	const ctx = canvas.getContext("2d")!;
	if (!ctx) return;

	if (auxiliaryLines.horizontalCenter) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(0, canvas.height / 2);
		ctx.lineTo(canvas.width, canvas.height / 2);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#FF0000";
		ctx.stroke();

		ctx.restore();
	}
	if (auxiliaryLines.verticalCenter) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(canvas.width / 2, 0);
		ctx.lineTo(canvas.width / 2, canvas.height);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#FF0000";
		ctx.stroke();
		ctx.restore();
	}
	if (auxiliaryLines.watermarkRange) {
		ctx.save();
		ctx.lineWidth = 10;
		ctx.strokeStyle = "#00FF00";
		ctx.strokeRect(rect1.x, rect1.y, rect2.x - rect1.x, rect2.y - rect1.y);
		ctx.restore();
	}
	if (auxiliaryLines.watermarkHorizontalCenter) {
		ctx.save();
		ctx.beginPath();
		ctx.moveTo(rect1.x, rect1.y + (rect2.y - rect1.y) / 2);
		ctx.lineTo(rect2.x, rect1.y + (rect2.y - rect1.y) / 2);
		ctx.lineWidth = 5;
		ctx.strokeStyle = "#FF0000";
		ctx.stroke();
		ctx.restore();
	}
}

/**
 * 根据相机品牌名称获取对应的Logo名称。
 *
 * @param {string} [make=""] - 相机品牌名称，默认为空字符串。函数会根据该名称在预定义的品牌列表中查找对应的Logo名称。
 * @returns {string} - 返回匹配的Logo名称。如果未找到匹配的品牌，则返回默认的"leica"。
 */
export function getLogoName(make: string = ""): string {
	let name = "leica";
	cameraBrands.forEach((brand) => {
		if (
			brand.make &&
			brand.make?.map((item) => item.toUpperCase()).includes(make.toUpperCase())
		) {
			name = brand.logo;
		}
	});
	return name;
}

/**
 * 计算画布尺寸和水印位置
 * @param config - 配置对象,包含图片内边距和水印配置
 * @param canvas - HTML Canvas 元素
 * @param img - 图片对象,包含宽高信息
 * @returns 返回水印的起始点和终点坐标
 * - rect1: 水印起始点坐标 {x, y}
 * - rect2: 水印终点坐标 {x, y}
 */
export function caculateCanvasSize(config: Config, img: Img) {
	const rect1 = { x: 0, y: 0 };
	const rect2 = { x: 0, y: 0 };
	const { paddings: imgPaddings, watermark } = config;
	const {
		position,
		height: watermarkHeight,
		paddings: watermarkPaddings,
	} = watermark;

	let canvasWidth = img.width + imgPaddings.left + imgPaddings.right;
	let canvasHeight = img.height + imgPaddings.top + imgPaddings.bottom;

	if (position === "left" || position === "right") {
		canvasWidth += watermarkHeight * canvasWidth + 2 * watermarkPaddings.lr;
		rect1.y = imgPaddings.top;
		rect2.y = canvasHeight - imgPaddings.bottom;

		if (position === "left") {
			rect1.x = 0;
			rect2.x = watermarkHeight * canvasWidth + 2 * watermarkPaddings.lr;
		} else {
			rect1.x = imgPaddings.left + img.width;
			rect2.x = canvasWidth;
		}
	} else if (position === "inner") {
		// 画布大小不需要修改
		rect1.x = watermarkPaddings.lr + imgPaddings.left;
		rect1.y = watermarkPaddings.tb;
		rect2.x = canvasWidth - watermarkPaddings.lr - imgPaddings.right;
		rect2.y = canvasHeight - watermarkPaddings.tb - imgPaddings.bottom;
	} else {
		canvasHeight += watermarkHeight * canvasHeight + 2 * watermarkPaddings.tb;
		rect1.x = imgPaddings.left;
		rect2.x = canvasWidth - imgPaddings.right;

		if (position === "top") {
			rect1.y = watermarkPaddings.tb;
			rect2.y = 2 * watermarkPaddings.tb + watermarkHeight * canvasHeight;
		} else {
			rect1.y =
				imgPaddings.top +
				img.height +
				imgPaddings.bottom +
				watermarkPaddings.tb;
			rect2.y = canvasHeight - watermarkPaddings.tb;
		}
	}

	return { rect1, rect2, canvasWidth, canvasHeight };
}

/**
 * 将 EXIF 中的 GPS 坐标信息拼接成经纬度
 * @param exif - 包含 GPS 信息的 EXIF 数据对象
 * @param split - 纬度和经度之间的分隔符,默认为空格
 * @returns 格式化的位置文本,格式为: "纬度°分'秒''N/S 经度°分'秒''E/W"。如果转换失败则返回空字符串
 */
export function getLocationText(exif: any, split: string = " ") {
	try {
		return `${exif?.GPSLatitude[0]}°${
			exif?.GPSLatitude[1]
		}'${(exif?.GPSLatitude[2]).toFixed(0)}''${exif?.GPSLatitudeRef}${split}${
			exif?.GPSLongitude[0]
		}°${exif?.GPSLongitude[1]}'${(exif?.GPSLongitude[2]).toFixed(0)}''${
			exif?.GPSLongitudeRef
		}`;
	} catch (error) {
		return "";
	}
}

// 绘制可控制圆角的矩形
export function drawRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	_radius: number | number[],
	stroke: boolean = false
) {
	let lt = 0,
		rt = 0,
		rb = 0,
		lb = 0,
		radius = 0;
	if (typeof _radius === "number") {
		radius = lt = rt = rb = lb = _radius;
	} else {
		lt = _radius[0];
		rt = _radius[1];
		rb = _radius[2];
		lb = _radius[3];
	}
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	if (lt) {
		ctx.lineTo(x + width - lt, y);
		ctx.arcTo(x + width, y, x + width, y + lt, lt);
	} else {
		ctx.lineTo(x + width, y);
	}
	if (rt) {
		ctx.lineTo(x + width, y + height - rt);
		ctx.arcTo(x + width, y + height, x + width - rt, y + height, rt);
	} else {
		ctx.lineTo(x + width, y + height);
	}
	if (rb) {
		ctx.lineTo(x + rb, y + height);
		ctx.arcTo(x, y + height, x, y + height - rb, rb);
	} else {
		ctx.lineTo(x, y + height);
	}
	if (lb) {
		ctx.lineTo(x, y + lb);
		ctx.arcTo(x, y, x + lb, y, lb);
	} else {
		ctx.lineTo(x, y);
	}
	ctx.closePath();
	if (stroke) {
		ctx.stroke();
	}
}

export const blendMode: BlendModeItem[] = [
	{ mode: "normal", desc: "正常" },
	{ mode: "multiply", desc: "正片叠底" },
	{ mode: "screen", desc: "滤色" },
	{ mode: "overlay", desc: "叠加" },
	{ mode: "darken", desc: "变暗" },
	{ mode: "lighten", desc: "变亮" },
	{ mode: "color-dodge", desc: "颜色减淡" },
	{ mode: "color-burn", desc: "颜色加深" },
	{ mode: "hard-light", desc: "强光" },
	{ mode: "soft-light", desc: "柔光" },
	{ mode: "difference", desc: "差值" },
	{ mode: "exclusion", desc: "排除" },
	{ mode: "hue", desc: "色相" },
	{ mode: "saturation", desc: "饱和度" },
	{ mode: "color", desc: "颜色" },
	{ mode: "luminosity", desc: "亮度" },
];
