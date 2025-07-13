<template>
	<el-card class="exif-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<el-icon><CameraFilled /></el-icon>
				<span>EXIF信息</span>
			</div>
		</template>
		<div class="exif-grid">
			<div class="exif-item">
				<span class="exif-label">参数</span>
				<span class="exif-value">
					<span
						>{{
							convertExposureTime(store.img.exif.ExposureTime) || "--"
						}}s</span
					>
					<span>f/{{ store.img.exif.FNumber.toFixed(1) || "--" }}</span>
					<span>
						{{ store.img.exif.FocalLength || "--" }}mm
						<span v-if="store.img.exif.FocalLengthIn35mmFormat">
							(等效{{ store.img.exif.FocalLengthIn35mmFormat }}mm)
						</span>
					</span>
					<span>ISO {{ store.img.exif.ISO || "--" }}</span>
				</span>
			</div>

			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">镜头</span>
				<span class="exif-value">{{ store.img.exif.LensModel || "--" }}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">制造商</span>
				<span class="exif-value">{{ store.img.exif.Make || "--" }}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">型号</span>
				<span class="exif-value">{{ store.img.exif.Model || "--" }}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">版权</span>
				<span class="exif-value">{{ store.img.exif.Copyright || "--" }}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">作者</span>
				<span class="exif-value">{{ store.img.exif.Artist || "--" }}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">曝光</span>
				<span class="exif-value">{{
					store.img.exif.ExposureMode || "--"
				}}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">白平衡</span>
				<span class="exif-value">{{
					store.img.exif.WhiteBalance || "--"
				}}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">闪光</span>
				<span class="exif-value">{{ store.img.exif.Flash || "--" }}</span>
			</div>
			<div class="exif-divider"></div>
			<div class="exif-item">
				<span class="exif-label">曝光模式</span>
				<span class="exif-value">{{
					store.img.exif.ExposureProgram || "--"
				}}</span>
			</div>
		</div>
	</el-card>
</template>

<script setup>
import { useStore } from "../stores";
import { convertExposureTime } from "../utils";
import { CameraFilled } from "@element-plus/icons-vue";
const store = useStore();
</script>

<style lang="less" scoped>
.exif-card {
	margin: 10px;
	border-radius: 8px;
	transition: all 0.3s ease;

	&:hover {
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		transform: translateY(-2px);
	}

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

	.exif-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 3px;
		padding: 5px;
	}

	.exif-item {
		display: flex;
		align-items: center;
		gap: 12px;
	}

	.exif-label {
		font-size: 14px;
		color: "#000";
		min-width: 100px;
		font-weight: bold;
	}

	.exif-value {
		flex: 1;
		font-size: 14px;
		color: gray;
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		min-width: 300px;
	}

	.exif-divider {
		height: 1px;
		background-color: var(--el-border-color-light);
		grid-column: 1 / -1;
		margin: 8px 0;
	}
}
</style>
