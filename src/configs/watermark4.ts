import type { Config, DrawFun } from "../types";

const doDraw: DrawFun = async (img, config, context) => {
	console.log("绘制样式4");

	const {
		watermark,
		paddings: imgPaddings,
		divider: dividerConfig,
		logo: logoConfig,
	} = config;
	const {
		model: modelConfig,
		params: paramsConfig,
		paddings: watermarkPaddings,
	} = watermark;
	const { ctx, canvas, rect1, rect2 } = context;

	// 绘制型号
	if (modelConfig.show) {
		const modelConfig = config.watermark.model;
		if (modelConfig.show) {
			ctx.save(); // 保存当前绘图状态
			ctx.font = `${modelConfig.italic ? "Italic" : ""} ${
				modelConfig.bold ? "bold" : ""
			} ${modelConfig.size}px Arial`;
			ctx.fillStyle = modelConfig.color;
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";
			const _y = rect1.y + (rect2.y - rect1.y) / 2;
			// 截取厂商
			const company = img.modelText.split(" ")[0];
			// 计算厂商的宽度
			const companyWidth = ctx.measureText(company).width;

			ctx.fillText(company, imgPaddings.left + watermarkPaddings.lr, _y);

			ctx.font = `${modelConfig.size}px Arial`;
			const modelText = modelConfig.replaceZ
				? img.modelText.replace(/z|Z/, "ℤ")
				: img.modelText;
			ctx.fillText(
				modelText.replace(company, ""),
				imgPaddings.left + watermarkPaddings.lr + companyWidth,
				_y
			);
			ctx.restore(); // 恢复之前的绘图状态
		}
	}
	// 在水印范围内垂直居中
	const _y = (rect2.y + rect1.y) / 2;

	// 绘制参数
	if (paramsConfig.show) {
		ctx.textAlign = "right";
		ctx.textBaseline = "middle";
		ctx.fillStyle = paramsConfig.color;
		ctx.font = `bold ${paramsConfig.size}px Arial`;

		const paramsText = paramsConfig.letterUpperCase
			? img.paramsText.toUpperCase()
			: img.paramsText;
		ctx.fillText(
			paramsText,
			canvas.width - imgPaddings.right - watermarkPaddings.lr,
			_y
		);
	}
	const space = 0.6 * logoConfig.width; // 间隔
	// 绘制竖线
	const paramsWidth = ctx.measureText(img.paramsText).width;
	// 计算横坐标
	const _x =
		canvas.width -
		imgPaddings.right -
		watermarkPaddings.lr -
		paramsWidth -
		space;

	// 计算横坐标
	const logoX = _x - space - logoConfig.width;
	// 计算纵坐标
	const logoY = _y - logoConfig.height / 2;

	// 绘制LOGO
	if (logoConfig.show) {
		const logoImg = new Image();
		logoImg.src = (
			await import(`../assets/logos/${logoConfig.name}.png`)
		).default;
		logoImg.onload = () => {
			ctx.drawImage(logoImg, logoX, logoY, logoConfig.width, logoConfig.height);
		};
	}
	if (dividerConfig.show) {
		// 竖线长度和logo一致
		ctx.strokeStyle = dividerConfig.color;
		ctx.lineWidth = dividerConfig.width;
		ctx.beginPath();
		ctx.moveTo(_x, logoY);
		ctx.lineTo(_x, logoY + config.logo.height);
		ctx.stroke();
	}
};

const config: Config = {
	paddings: {
		top: 0, // 图片上边距
		right: 0,
		left: 0,
		bottom: 0,
	},
	watermark: {
		model: {
			show: true,
			color: "#000000",
			size: 150,
			replaceZ: true,
			italic: false,
			bold: true,
		},
		params: {
			show: true,
			color: "#000000",
			size: 120,
			useEquivalentFocalLength: true,
			letterUpperCase: false,
		},
		time: {
			enable: false,
			show: false,
			color: "#000000",
			size: 140,
			format: "yyyy-MM-dd HH:mm",
		},
		paddings: {
			lr: 100,
			tb: 150,
		},
		bgColor: "#FFF",
	},
	radius: {
		enable: false,
		show: false,
		size: 100,
	},
	blur: {
		enable: false,
		size: 100,
	},
	logo: {
		enable: true,
		auto: false,
		show: true,
		width: 200,
		height: 200,
		name: "leica",
	},
	divider: {
		enable: true,
		show: true,
		color: "rgb(208, 208, 208)",
		width: 20,
	},
	shadow: {
		show: false,
		color: "#808080",
		x: 0,
		y: 0,
		size: 2,
	},
	draw: doDraw,
	// draw(file: File, img: Img, config: Config) {
	// 	if (!file) return;
	// 	img.fileName = file.name;
	// 	img.export.name = "WM_" + file.name;
	// 	img.size = (file.size / 1024 / 1024).toFixed(2) + "MB";
	// 	img.type = file.type;
	// 	img.time = formatDate(new Date(file.lastModified));

	// 	const reader = new FileReader();
	// 	reader.readAsDataURL(file);
	// 	reader.onload = (e) => {
	// 		const _img = new Image();
	// 		if (e.target === null) throw new Error("图片不存在...");
	// 		_img.src = <string>e.target.result;
	// 		_img.onload = async () => {
	// 			// 更新宽高
	// 			img.width = _img.width;
	// 			img.height = _img.height;

	// 			// 使用exifr库读取exifs信息
	// 			const exif = await Exifr.parse(file);
	// 			img.exif = exif;

	// 			// 获取比例
	// 			const boxScale = img.width / img.height;
	// 			// 调整canvasBox容器的比例
	// 			const canvasBox = document.getElementById(
	// 				"canvasBox"
	// 			) as HTMLDivElement;
	// 			const canvas = document.getElementById(
	// 				"imgCanvas"
	// 			) as HTMLCanvasElement;
	// 			const ctx = canvas.getContext("2d");
	// 			if (ctx) {
	// 				// 计算canvas缩放比例
	// 				const maxSize = Math.max(img.width, img.height);
	// 				const isWidthMax = maxSize == img.width;
	// 				const scale =
	// 					(isWidthMax ? img.width : img.height) / (isWidthMax ? 900 : 600);

	// 				// 修改画布大小
	// 				canvas.width =
	// 					img.width / scale + config.paddings.left + config.paddings.right;
	// 				canvas.height =
	// 					img.height / scale + config.paddings.top + config.paddings.bottom;
	// 				canvas.height +=
	// 					0.1 * canvas.height + 2 * config.watermark.paddings.tb;

	// 				// 打印底部水印的坐标范围
	// 				const rect1 = {
	// 					x: 0 + config.paddings.left,
	// 					y:
	// 						img.height / scale +
	// 						config.paddings.top +
	// 						config.paddings.bottom +
	// 						config.watermark.paddings.tb,
	// 				};
	// 				const rect2 = {
	// 					x: canvas.width - config.paddings.right,
	// 					y: canvas.height - config.watermark.paddings.tb,
	// 				};

	// 				if (config.blur && config.blur.enable) {
	// 					console.log("背景模糊", config);
	// 					ctx.save();
	// 					ctx.filter = `blur(${config.blur.size}px)`;
	// 					ctx.drawImage(_img, 0, 0, canvas.width, canvas.height);
	// 					console.log("背景模糊", config.blur.size);
	// 					ctx.restore();
	// 				} else if (config.watermark.bgColor) {
	// 					ctx.fillStyle = config.watermark.bgColor;
	// 					console.log("自定义背景颜色");
	// 					ctx.fillRect(0, 0, canvas.width, canvas.height);
	// 				} else {
	// 					ctx.fillStyle = "#FFFFFF";
	// 					console.log("默认背景颜色");
	// 					ctx.fillRect(0, 0, canvas.width, canvas.height);
	// 				}

	// 				canvasBox.style.height = `${900 / boxScale}px`;

	// 				// 绘制圆角图片
	// 				if (config.radius.enable) {
	// 					ctx.save();
	// 					console.log("绘制圆角图片");
	// 					const radius = config.radius.size;
	// 					ctx.beginPath();
	// 					ctx.moveTo(config.paddings.left + radius, config.paddings.top);
	// 					ctx.lineTo(
	// 						canvas.width - config.paddings.right - radius,
	// 						config.paddings.top
	// 					);
	// 					ctx.quadraticCurveTo(
	// 						canvas.width - config.paddings.right,
	// 						config.paddings.top,
	// 						canvas.width - config.paddings.right,
	// 						config.paddings.top + radius
	// 					);
	// 					ctx.lineTo(
	// 						canvas.width - config.paddings.right,
	// 						img.height / scale + config.paddings.top - radius
	// 					);
	// 					ctx.quadraticCurveTo(
	// 						canvas.width - config.paddings.right,
	// 						img.height / scale + config.paddings.top,
	// 						canvas.width - config.paddings.right - radius,
	// 						img.height / scale + config.paddings.top
	// 					);
	// 					ctx.lineTo(
	// 						config.paddings.left + radius,
	// 						img.height / scale + config.paddings.top
	// 					);
	// 					ctx.quadraticCurveTo(
	// 						config.paddings.left,
	// 						img.height / scale + config.paddings.top,
	// 						config.paddings.left,
	// 						img.height / scale + config.paddings.top - radius
	// 					);
	// 					ctx.lineTo(config.paddings.left, config.paddings.top + radius);
	// 					ctx.quadraticCurveTo(
	// 						config.paddings.left,
	// 						config.paddings.top,
	// 						config.paddings.left + radius,
	// 						config.paddings.top
	// 					);
	// 					ctx.closePath();
	// 					ctx.clip();
	// 				}
	// 				// 绘制图片
	// 				ctx.drawImage(
	// 					_img,
	// 					0 + config.paddings.left,
	// 					0 + config.paddings.top,
	// 					img.width / scale,
	// 					img.height / scale
	// 				);
	// 				ctx.restore();

	// 				// 绘制型号
	// 				const modelConfig = config.watermark.model;
	// 				if (modelConfig.show) {
	// 					ctx.save(); // 保存当前绘图状态
	// 					ctx.font = `bold ${modelConfig.size}px Arial`;
	// 					ctx.fillStyle = modelConfig.color;
	// 					ctx.textAlign = "left";
	// 					ctx.textBaseline = "middle";
	// 					const _y = rect1.y + (rect2.y - rect1.y) / 2;
	// 					// 截取厂商
	// 					const company = exif?.Model?.split(" ")[0];
	// 					// 计算厂商的宽度
	// 					const companyWidth = ctx.measureText(company).width;

	// 					ctx.fillText(
	// 						company,
	// 						config.paddings.left + config.watermark.paddings.lr,
	// 						_y
	// 					);

	// 					ctx.font = `${modelConfig.size}px Arial`;
	// 					ctx.fillText(
	// 						exif.Model.replace(company, ""),
	// 						config.paddings.left +
	// 							config.watermark.paddings.lr +
	// 							companyWidth,
	// 						_y
	// 					);
	// 					ctx.restore(); // 恢复之前的绘图状态
	// 				}

	// 				// 绘制曝光三要素和焦段参数
	// 				const paramsConfig = config.watermark.params;
	// 				if (paramsConfig.show) {
	// 					const params = `${exif?.FocalLengthIn35mmFormat}mm  f/${
	// 						exif?.FNumber
	// 					}  ${convertExposureTime(exif?.ExposureTime)}s  ISO${exif?.ISO}`;
	// 					ctx.textAlign = "right";
	// 					ctx.textBaseline = "middle";
	// 					ctx.fillStyle = paramsConfig.color;
	// 					ctx.font = `bold ${paramsConfig.size}px Arial`;

	// 					// 在水印范围内垂直居中
	// 					const _y = (rect2.y + rect1.y) / 2;
	// 					console.log("水印范围内垂直居中", _y);
	// 					ctx.fillText(
	// 						params,
	// 						canvas.width -
	// 							config.paddings.right -
	// 							config.watermark.paddings.lr,
	// 						_y
	// 					);

	// 					const space = 20; // 间隔

	// 					// 绘制竖线
	// 					const paramsWidth = ctx.measureText(params).width;
	// 					// 计算横坐标
	// 					const _x =
	// 						canvas.width -
	// 						config.paddings.right -
	// 						config.watermark.paddings.lr -
	// 						paramsWidth -
	// 						space;

	// 					// 绘制LOGO
	// 					if (config.logo.show) {
	// 						const leicaLogo = new Image();
	// 						leicaLogo.src = (
	// 							await import(`../assets/${config.logo.name}.png`)
	// 						).default;
	// 						leicaLogo.onload = () => {
	// 							// 计算横坐标
	// 							const logoX = _x - space - config.logo.width;
	// 							// 计算纵坐标
	// 							const logoY = _y - config.logo.height / 2;
	// 							ctx.drawImage(
	// 								leicaLogo,
	// 								logoX,
	// 								logoY,
	// 								config.logo.width,
	// 								config.logo.height
	// 							);

	// 							// 竖线长度和logo一致
	// 							ctx.strokeStyle = config.divider.color;
	// 							ctx.lineWidth = config.divider.width;
	// 							ctx.beginPath();
	// 							ctx.moveTo(_x, logoY);
	// 							ctx.lineTo(_x, logoY + config.logo.height);
	// 							ctx.stroke();
	// 						};
	// 					}
	// 				}
	// 			}
	// 		};
	// 	};
	// },
};

export default config;
