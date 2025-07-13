<template>
	<div>
		<h2>文件列表</h2>
		<el-button
			v-for="item in store.fileList"
			:type="store.curFile.name == item.name ? 'primary' : ''"
			plain>
			{{ item.name }}
		</el-button>
	</div>
	<el-card class="info-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<el-icon><InfoFilled /></el-icon>
				<span>基础信息</span>
			</div>
		</template>
		<el-form label-width="100px" label-position="left" v-if="store.curFile">
			<el-form-item label="文件名">
				<el-tag type="info">{{ store.img.fileName }}</el-tag>
			</el-form-item>
			<el-form-item label="分辨率">
				<el-tag>{{ store.img.width }} × {{ store.img.height }}</el-tag>
			</el-form-item>
			<el-form-item label="大小">
				<el-tag>{{ (store.img.size / 1024 / 1024).toFixed(2) }} MB</el-tag>
			</el-form-item>
			<el-form-item label="格式">
				<el-tag type="success">{{ store.img.type }}</el-tag>
			</el-form-item>
			<el-form-item label="时间">
				<el-tag type="warning">{{
					Date(store.img.time).toLocaleString()
				}}</el-tag>
			</el-form-item>
		</el-form>
		<el-empty description="配置不可用，请先添加图片" v-else></el-empty>
	</el-card>
	<el-card class="exif-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<el-icon><CameraFilled /></el-icon>
				<span>EXIF信息</span>
			</div>
		</template>
		<div class="exif-grid" v-if="store.curFile">
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
		<el-empty description="配置不可用，请先添加图片" v-else></el-empty>
	</el-card>
</template>

<script setup>
import { useStore } from "../stores";
import { convertExposureTime, selectFile } from "../utils";
import { CameraFilled, InfoFilled } from "@element-plus/icons-vue";
const store = useStore();
</script>

<style lang="less" scoped>
.info-card {
	margin: 20px 10px;
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
}

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
