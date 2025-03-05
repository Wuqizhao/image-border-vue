import { formatDate, convertExposureTime } from "../assets/tools";
import Exifr from "exifr";
import type { Img } from "../types";

const config = {
	paddings: {
		top: 10, // 图片上边距
		right: 10,
		left: 10,
		bottom: 0,
	},
	watermark: {
		model: {
			show: true,
			color: "#000000",
			size: 20,
		},
		params: {
			show: true,
			color: "#808080",
			size: 14,
		},
		time: {
			show: true,
			color: "#808080",
			size: 14,
		},
		paddings: {
			lr: 0,
			tb: 15,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: true,
		size: 10,
	},
	draw(file: File, img: Img) {
		if (!file) return;
		img.fileName = file.name;
		img.export.name = "WM_" + file.name;
		img.size = (file.size / 1024 / 1024).toFixed(2) + "MB";
		img.type = file.type;
		img.time = formatDate(new Date(file.lastModified));

		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = (e) => {
			const _img = new Image();
			if (e.target === null) throw new Error("图片不存在...");
			_img.src = <string>e.target.result;
			_img.onload = async () => {
				// 更新宽高
				img.width = _img.width;
				img.height = _img.height;

				// 使用exifr库读取exifs信息
				const exif = await Exifr.parse(file);
				img.exif = exif;

				// 获取比例
				const boxScale = img.width / img.height;
				// 调整canvasBox容器的比例
				const canvasBox = document.getElementById(
					"canvasBox"
				) as HTMLDivElement;
				const canvas = document.getElementById(
					"imgCanvas"
				) as HTMLCanvasElement;
				const ctx = canvas.getContext("2d");
				if (ctx) {
					// 计算canvas缩放比例
					const maxSize = Math.max(img.width, img.height);
					const isWidthMax = maxSize == img.width;
					const scale =
						(isWidthMax ? img.width : img.height) / (isWidthMax ? 900 : 600);

					// 修改画布大小
					canvas.width =
						img.width / scale + config.paddings.left + config.paddings.right;
					canvas.height =
						img.height / scale + config.paddings.top + config.paddings.bottom;
					canvas.height +=
						0.1 * canvas.height + 2 * config.watermark.paddings.tb;

					// 打印底部水印的坐标范围
					const rect1 = {
						x: 0 + config.paddings.left,
						y:
							img.height / scale +
							config.paddings.top +
							config.paddings.bottom +
							config.watermark.paddings.tb,
					};
					const rect2 = {
						x: canvas.width - config.paddings.right,
						y: canvas.height - config.watermark.paddings.tb,
					};
					// 绘制背景色
					if (config.watermark.bgColor) {
						ctx.fillStyle = config.watermark.bgColor;
					} else {
						ctx.fillStyle = "#FFFFFF";
					}
					ctx.fillRect(0, 0, canvas.width, canvas.height);

					canvasBox.style.height = `${900 / boxScale}px`;

					// 绘制圆角图片
					if (config.radius.enable) {
						ctx.save();
						console.log('绘制圆角图片');
						const radius = config.radius.size;
						ctx.beginPath();
						ctx.moveTo(config.paddings.left + radius, config.paddings.top);
						ctx.lineTo(
							canvas.width - config.paddings.right - radius,
							config.paddings.top
						);
						ctx.quadraticCurveTo(
							canvas.width - config.paddings.right,
							config.paddings.top,
							canvas.width - config.paddings.right,
							config.paddings.top + radius
						);
						ctx.lineTo(
							canvas.width - config.paddings.right,
							img.height / scale + config.paddings.top - radius
						);
						ctx.quadraticCurveTo(
							canvas.width - config.paddings.right,
							img.height / scale + config.paddings.top,
							canvas.width - config.paddings.right - radius,
							img.height / scale + config.paddings.top
						);
						ctx.lineTo(
							config.paddings.left + radius,
							img.height / scale + config.paddings.top
						);
						ctx.quadraticCurveTo(
							config.paddings.left,
							img.height / scale + config.paddings.top,
							config.paddings.left,
							img.height / scale + config.paddings.top - radius
						);
						ctx.lineTo(config.paddings.left, config.paddings.top + radius);
						ctx.quadraticCurveTo(
							config.paddings.left,
							config.paddings.top,
							config.paddings.left + radius,
							config.paddings.top
						);
						ctx.closePath();
						ctx.clip();
					}
					// 绘制图片
					ctx.drawImage(
						_img,
						0 + config.paddings.left,
						0 + config.paddings.top,
						img.width / scale,
						img.height / scale
					);
					ctx.restore();

					// 绘制型号
					const modelConfig = config.watermark.model;
					if (modelConfig.show) {
						ctx.save(); // 保存当前绘图状态
						ctx.font = `bold ${modelConfig.size}px Arial`;
						ctx.fillStyle = modelConfig.color;
						ctx.textAlign = "left";
						ctx.textBaseline = "middle";
						// 高度在1/3处
						const _y = rect1.y + (rect2.y - rect1.y) / 3;
						// 截取厂商
						const company = exif?.Model?.split(" ")[0];
						// 计算厂商的宽度
						const companyWidth = ctx.measureText(company).width;

						ctx.fillText(
							company,
							config.paddings.left + config.watermark.paddings.lr,
							_y
						);

						ctx.font = `${modelConfig.size}px Arial`;
						ctx.fillText(
							exif.Model.replace(company, ""),
							config.paddings.left +
								config.watermark.paddings.lr +
								companyWidth,
							_y
						);
						ctx.restore(); // 恢复之前的绘图状态
					}

					// 绘制曝光三要素和焦段参数
					const paramsConfig = config.watermark.params;
					if (paramsConfig.show) {
						ctx.fillStyle = paramsConfig.color;
						ctx.font = `${paramsConfig.size}px Arial`;
						ctx.textBaseline = "middle";
						const params = `${convertExposureTime(exif?.ExposureTime)}s  f/${
							exif?.FNumber
						}  ISO ${exif?.ISO}  ${exif?.FocalLength}mm`;
						// 高度在2/3处
						const _y = rect1.y + (2 * (rect2.y - rect1.y)) / 3;
						ctx.fillText(
							params,
							config.paddings.left + config.watermark.paddings.lr,
							_y
						);
					}

					// 绘制拍摄时间
					const timeConfig = config.watermark.time;
					if (timeConfig.show) {
						const shotTime = formatDate(new Date(exif?.DateTimeOriginal));
						ctx.textAlign = "right";
						ctx.textBaseline = "middle";
						ctx.fillStyle = timeConfig.color;
						ctx.font = `${timeConfig.size}px Arial`;

						// 在水印范围内垂直居中
						const _y = (rect2.y + rect1.y) / 2;
						console.log("水印范围内垂直居中", _y);
						ctx.fillText(
							shotTime,
							canvas.width -
								config.paddings.right -
								config.watermark.paddings.lr,
							_y
						);
					}
				}
			};
		};
	},
};

export default config;
