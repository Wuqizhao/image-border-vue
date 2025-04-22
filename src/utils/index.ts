import { ElMessage, ElNotification } from "element-plus";
import type {
	AuxiliaryLines,
	Config,
	ImagesConfigItem,
	Img,
	ImgExt,
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
export async function download(
	name: string,
	quality: number = 0.97,
	ext: ImgExt = "jpeg"
) {
	const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
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
		if (file.startsWith("http") || file.startsWith("blob")) {
			return file;
		}

		const { pathname } = new URL(
			`../assets/logos/${file}.png`,
			import.meta.url
		);
		return pathname;
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
	opacity: number = 1
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
		ctx.drawImage(img, x, y, logoConfig.width, logoConfig.height);
		ctx.restore();
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
			ctx.fillStyle = label.color;
			ctx.font = `${label.bold ? "bold" : ""} ${label.italic ? "italic" : ""} ${
				label.size
			}px ${label.font}`;

			ctx.fillText(label.text, label.x, label.y);
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
				image.alpha
			);
			ctx.restore();
		}
	}
}

export function replaceZ(text: string) {
	return text.replace(/Z/g, "ℤ");
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

export function caculateCanvasSize(
	config: Config,
	canvas: HTMLCanvasElement,
	img: Img
) {
	const rect1 = { x: 0, y: 0 };
	const rect2 = { x: 0, y: 0 };
	const { paddings: imgPaddings, watermark } = config;
	const {
		position,
		height: watermarkHeight,
		paddings: watermarkPaddings,
	} = watermark;

	if (position === "left" || position === "right") {
		canvas.width += watermarkHeight * canvas.width + 2 * watermarkPaddings.lr;
		rect1.y = imgPaddings.top;
		rect2.y = canvas.height - imgPaddings.bottom;

		if (position === "left") {
			rect1.x = 0;
			rect2.x = watermarkHeight * canvas.width + 2 * watermarkPaddings.lr;
		} else {
			rect1.x = imgPaddings.left + img.width;
			rect2.x = canvas.width;
		}
	} else if (position === "inner") {
		// 画布大小不需要修改
		rect1.x = watermarkPaddings.lr;
		rect1.y = watermarkPaddings.tb;
		rect2.x = canvas.width - watermarkPaddings.lr;
		rect2.y = canvas.height - watermarkPaddings.tb;
	} else {
		canvas.height += watermarkHeight * canvas.height + 2 * watermarkPaddings.tb;
		rect1.x = imgPaddings.left;
		rect2.x = canvas.width - imgPaddings.right;

		if (position === "top") {
			rect1.y = watermarkPaddings.tb;
			rect2.y = 2 * watermarkPaddings.tb + watermarkHeight * canvas.height;
		} else {
			rect1.y = imgPaddings.top + img.height + imgPaddings.bottom;
			rect2.y = canvas.height;
		}
	}

	return { rect1, rect2 };
}
