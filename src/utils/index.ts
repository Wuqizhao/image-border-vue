import { ElMessage } from "element-plus";
import type { Config, ImgExt } from "../types";

// 转换曝光时间的函数
export function convertExposureTime(exposureTime: number) {
	if (exposureTime < 1) {
		return `1/${Math.round(1 / exposureTime)}`;
	} else {
		return `${exposureTime}`;
	}
}

export async function download(
	name: string,
	quality: number = 1,
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

// 深拷贝对象，包含函数
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

export function compressImage(file: File | string) {
	if (typeof file === "string") {
		return file;
	}
	return URL.createObjectURL(file);
}

export async function getLogoSrc(config: Config) {
	const { logo: logoConfig } = config;
	if (logoConfig.url) {
		return logoConfig.url;
	} else if (logoConfig.name.startsWith("http")) {
		return logoConfig.name;
	} else {
		return (await import(`../assets/logos/${logoConfig.name}.png`)).default;
	}
}
