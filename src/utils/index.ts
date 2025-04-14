import { ElMessage, ElNotification } from "element-plus";
import type { ImagesConfigItem, ImgExt, LabelConfigItem, Logo } from "../types";

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
export function compressImage(file: File | string) {
	if (typeof file === "string") {
		return file;
	}
	return URL.createObjectURL(file);
}

/**
 * 获取品牌图片
 * @param logo 品牌logo路径或URL
 * @returns 返回处理后的图片URL
 * @description 如果logo是http开头的URL则直接返回,否则从本地assets目录获取并压缩处理
 */
export async function getBrandImageThumbnail(logo: string) {
	if (logo.startsWith("http")) return logo;
	const { pathname } = new URL(`../assets/logos/${logo}.png`, import.meta.url);
	return compressImage(pathname);
}

/**
 * 获取 Logo 图片的源地址
 * @param config 配置对象，包含 logo 相关配置
 * @returns 返回 Promise<string> 类型的 logo 图片地址
 * @description 根据配置获取 logo 图片地址,支持以下三种方式:
 * 1. 直接使用 url 属性指定的地址
 * 2. 使用 name 属性指定的 http(s) 链接
 * 3. 从本地 assets/logos 目录下按 name 属性加载图片
 */
export async function getLogoSrc(logo: Logo | ImagesConfigItem) {
	if (logo.url) {
		return logo.url;
	} else if (logo.name.startsWith("http")) {
		return logo.name;
	} else {
		return (await import(`../assets/logos/${logo.name}.png`)).default;
	}
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
	y: number
) {
	const img = new Image();
	img.src = await getLogoSrc(logoConfig);
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
	let isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent
		);
	return isMobile;
}

export function drawCustomLabelsAndImages(
	ctx: CanvasRenderingContext2D,
	labels: LabelConfigItem[],
	images: ImagesConfigItem[]
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
			drawLogo(image, ctx, image.horizontalOffset, image.verticalOffset);
			ctx.restore();
		}
	}
}
