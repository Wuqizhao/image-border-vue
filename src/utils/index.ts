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

export function compressImage(file: File | string) {
	if (typeof file === "string") {
		return file;
	}
	return URL.createObjectURL(file);
}
