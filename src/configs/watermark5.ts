import { formatDate, convertExposureTime } from "../assets/tools";
import Exifr from "exifr";
import type { Config, Img } from "../types";

const config = {
	paddings: {
		top: 25, // 图片上边距
		right: 25,
		left: 25,
		bottom: 0,
	},
	watermark: {
		model: {
			show: true,
			color: "#000000",
			size: 24,
		},
		params: {
			show: true,
			color: "#000000",
			size: 18,
		},
		time: {
			show: false,
			color: "#000000",
			size: 14,
		},
		paddings: {
			lr: 0,
			tb: 50,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: false,
		size: 10,
	},
	blur: {
		enable: false,
		size: 10,
	},
	draw(file: File, img: Img, config: Config) {
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
						0.2 * canvas.height + 2 * config.watermark.paddings.tb;

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

					if (config.blur && config.blur.enable) {
						console.log("背景模糊", config);
						ctx.save();
						ctx.filter = `blur(${config.blur.size}px)`;
						ctx.drawImage(_img, 0, 0, canvas.width, canvas.height);
						console.log("背景模糊", config.blur.size);
						ctx.restore();
					} else if (config.watermark.bgColor) {
						ctx.fillStyle = config.watermark.bgColor;
						console.log("自定义背景颜色");
						ctx.fillRect(0, 0, canvas.width, canvas.height);
					} else {
						ctx.fillStyle = "#FFFFFF";
						console.log("默认背景颜色");
						ctx.fillRect(0, 0, canvas.width, canvas.height);
					}

					canvasBox.style.height = `${900 / boxScale}px`;

					// 绘制圆角图片
					if (config.radius.enable) {
						ctx.save();
						console.log("绘制圆角图片");
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
                        ctx.textBaseline = "top";
                        
                        // // 绘制水印范围
                        // ctx.strokeStyle = 'red';
						// ctx.strokeRect(
						// 	rect1.x,
						// 	rect1.y,
						// 	rect2.x - rect1.x,
						// 	rect2.y - rect1.y
						// );
						// // 绘制中心水平线
						// ctx.beginPath();
						// ctx.moveTo(0, rect1.y + (rect2.y - rect1.y) / 2);
						// ctx.lineTo(canvas.width, rect1.y + (rect2.y - rect1.y) / 2);
						// ctx.stroke();

						const _y = rect1.y;
						// 截取厂商
						const company = exif?.Model?.split(" ")[0];
						// 计算厂商的宽度
						const companyWidth = ctx.measureText(company).width;
						// 计算型号宽度
						ctx.font = `${modelConfig.size}px Arial`;
						const modelWidth = ctx.measureText(
							exif.Model.replace(company, "")
						).width;
						// 竖线
						const line = "  |  ";
						// 计算竖线宽度
						const lineWidth = ctx.measureText(line).width;
						// logo
						const logoSize = {
							width: 24,
							height: 24,
						};

						// 总宽度
						const totalWidth =
							companyWidth + modelWidth + lineWidth + logoSize.width;

						// 绘制制造商
						ctx.font = `bold ${modelConfig.size}px Arial`;
						ctx.fillText(company, canvas.width / 2 - totalWidth / 2, _y);
						ctx.font = `${modelConfig.size}px Arial`;
						// 绘制型号
						ctx.fillText(exif.Model.replace(company, ""), canvas.width / 2, _y);

						// 绘制LOGO
						const leicaLogo = new Image();
						leicaLogo.src = (await import("../assets/leica.png")).default;
						leicaLogo.onload = () => {
							// 计算横坐标
							const logoX = canvas.width / 2 + totalWidth / 2 - logoSize.width;
							// 计算纵坐标
							const logoY = _y;
							ctx.drawImage(
								leicaLogo,
								logoX,
								logoY,
								logoSize.width,
								logoSize.height
							);
						};
						ctx.restore(); // 恢复之前的绘图状态
					}

					// 绘制曝光三要素和焦段参数
					const paramsConfig = config.watermark.params;
					if (paramsConfig.show) {
						ctx.font = `${paramsConfig.size}px Arial`;

						const space = 50; // 参数间隔
						// 计算单个矩形宽度
						const rectWidth = (canvas.width / 2 - 3 * space) / 4;
						// 计算y坐标
						const _y = rect1.y + (rect2.y - rect1.y) / 2;

						const paramsArr = [
							exif?.FocalLengthIn35mmFormat,
							convertExposureTime(exif?.ExposureTime),
							exif?.FNumber,
							exif?.ISO,
						];
						const paramsLabel = ["mm", "F", "S", "ISO"];
						for (let i = 0; i < 4; i++) {
							ctx.strokeStyle = "#909090";
							ctx.lineWidth = 1;
							// 矩形内边距
							const rectPadding = 10;
							// 绘制矩形
							ctx.strokeRect(
								canvas.width / 4 + i * (rectWidth + space),
								_y - rectPadding / 2 - paramsConfig.size / 2,
								rectWidth,
								paramsConfig.size + rectPadding
							);
							// 计算当前矩形的中心点坐标
							const centerX =
								canvas.width / 4 + i * (rectWidth + space) + rectWidth / 2;
							ctx.textAlign = "center";
							ctx.textBaseline = "middle";
							ctx.fillStyle = paramsConfig.color;
							ctx.fillText(paramsArr[i], centerX, _y);
							ctx.fillStyle = "gray";
							ctx.textBaseline = "bottom";
							ctx.fillText(paramsLabel[i], centerX, rect2.y);
						}

						// 绘制垂直中心分割线
						// ctx.beginPath();
						// ctx.moveTo(canvas.width / 2, 0);
						// ctx.lineTo(canvas.width / 2, canvas.height);
						// ctx.stroke();
					}
				}
			};
		};
	},
};

export default config;
