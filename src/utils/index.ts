// 转换曝光时间的函数
export function convertExposureTime(exposureTime: number) {
	if (exposureTime < 1) {
		return `1/${Math.round(1 / exposureTime)}`;
	} else {
		return `${exposureTime}`;
	}
}

export function download(name: string, quality: number = 1) {
	const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
	if (!canvas) throw new Error("canvas不存在");
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/jpeg", quality);
	a.download = name;
	a.click();
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

export function compressImage(
	image: string | File,
	quality = 0.5
): Promise<string> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = "Anonymous"; // 处理跨域问题

		// 处理不同类型的输入（URL 或 File）
		if (typeof image === "string") {
			img.src = image; // 直接使用 URL
		} else if (image instanceof File) {
			const reader = new FileReader();
			reader.readAsDataURL(image);
			reader.onload = () => {
				if (typeof reader.result === "string") {
					img.src = reader.result; // 读取文件并转换为 Data URL
				} else {
					reject(new Error("文件读取失败"));
				}
			};
			reader.onerror = () => reject(new Error("文件读取失败"));
		} else {
			return reject(new Error("无效的图片输入"));
		}

		img.onload = function () {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			if (!ctx) return reject(new Error("无法获取 Canvas 上下文"));

			// 计算新尺寸（最大宽高 500px）
			const scale = Math.min(500 / img.width, 500 / img.height, 1);
			canvas.width = img.width * scale;
			canvas.height = img.height * scale;

			ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

			// 压缩图片并转换为 Blob
			canvas.toBlob(
				(blob) => {
					if (blob) {
						resolve(URL.createObjectURL(blob)); // 返回 Object URL
					} else {
						reject(new Error("Blob 生成失败"));
					}
				},
				"image/png",
				quality
			);
		};

		img.onerror = () => reject(new Error("图片加载失败"));
	});
}
