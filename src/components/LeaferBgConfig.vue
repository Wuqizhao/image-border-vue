<template>
	<div class="config-container">
		<el-card class="config-card" shadow="hover">
			<template #header>
				<div class="card-header">
					<el-icon>
						<Setting />
					</el-icon>
					<span>主图配置</span>
				</div>
			</template>
			<el-form label-width="60px">
				<h3>图片边距</h3>
				<el-form-item label="上边距">
					<el-slider
						:max="5000"
						v-model="store.config.img.margin.top"
						show-input></el-slider>
				</el-form-item>
				<el-form-item label="下边距">
					<el-slider
						:max="5000"
						v-model="store.config.img.margin.bottom"
						show-input></el-slider>
				</el-form-item>
				<el-form-item label="左边距">
					<el-slider
						:max="5000"
						v-model="store.config.img.margin.left"
						show-input></el-slider>
				</el-form-item>
				<el-form-item label="右边距">
					<el-slider
						:max="5000"
						v-model="store.config.img.margin.right"
						show-input></el-slider>
				</el-form-item>
				<h3>圆角</h3>
				<el-form-item label="左上">
					<el-slider
						:max="500"
						v-model="store.config.img.cornerRadius[0]"
						show-input></el-slider>
				</el-form-item>
				<el-form-item label="右上">
					<el-slider
						:max="500"
						v-model="store.config.img.cornerRadius[1]"
						show-input></el-slider>
				</el-form-item>
				<el-form-item label="右下">
					<el-slider
						:max="500"
						v-model="store.config.img.cornerRadius[2]"
						show-input></el-slider>
				</el-form-item>
				<el-form-item label="左下">
					<el-slider
						:max="500"
						v-model="store.config.img.cornerRadius[3]"
						show-input></el-slider>
				</el-form-item>

				<h3>阴影</h3>
				<el-form-item label="X偏移量" label-width="70px">
					<el-slider
						show-input
						:min="-200"
						:max="200"
						v-model="store.config.img.shadow.x"></el-slider>
				</el-form-item>
				<el-form-item label="Y偏移量" label-width="70px">
					<el-slider
						show-input
						:min="-200"
						:max="200"
						v-model="store.config.img.shadow.y"></el-slider>
				</el-form-item>
				<el-form-item label="模糊半径" label-width="70px">
					<el-slider
						show-input
						:max="1000"
						v-model="store.config.img.shadow.blur"></el-slider>
				</el-form-item>
				<el-form-item label="阴影颜色" label-width="70px">
					<el-color-picker
						:predefine="preDefineColors"
						show-alpha
						v-model="store.config.img.shadow.color"></el-color-picker>
				</el-form-item>
			</el-form>
		</el-card>
	</div>
</template>

<script setup>
import { preDefineColors } from "../assets/tools";
import { useStore } from "../stores";
import {
	InfoFilled,
	CameraFilled,
	UploadFilled,
	Setting,
	RefreshRight,
} from "@element-plus/icons-vue";
import { convertExposureTime } from "../utils";
const store = useStore();
</script>

<style lang="less" scoped>
.config-container {
	display: flex;
	flex-direction: column;
	gap: 20px;
	padding: 10px;

	.card-header {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: bold;

		.el-icon {
			font-size: 1.2em;
			color: var(--el-color-primary);
		}
	}

	.info-card,
	.exif-card,
	.export-card {
		transition: all 0.3s ease;
		border-radius: 8px;

		&:hover {
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			transform: translateY(-2px);
		}
	}

	.el-form-item {
		margin-bottom: 16px;

		&:last-child {
			margin-bottom: 0;
		}
	}

	.exif-grid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 12px;
		padding: 10px;
	}

	.exif-item {
		display: flex;
		align-items: center;
		gap: 8px;
	}

	.exif-label {
		font-size: 13px;
		color: var(--el-text-color-secondary);
		min-width: 60px;
	}

	.exif-value {
		flex: 1;
		white-space: nowrap;
		// overflow: hidden;
		text-overflow: ellipsis;
		font-size: 13px;
		color: var(--el-text-color-regular);
		font-weight: 500;

		> span {
			padding-right: 20px;
		}
	}

	.exif-divider {
		height: 1px;
		background-color: var(--el-border-color-light);
		grid-column: 1 / -1;
	}

	.el-text {
		font-size: 14px;
	}

	.el-tag {
		margin-right: 8px;
	}

	@media (max-width: 768px) {
		.exif-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	@media (max-width: 480px) {
		.exif-grid {
			grid-template-columns: 1fr;
		}
	}
}

@media (max-width: 768px) {
	.config-container {
		padding: 5px;

		.el-col {
			margin-bottom: 10px;
		}
	}
}
</style>
