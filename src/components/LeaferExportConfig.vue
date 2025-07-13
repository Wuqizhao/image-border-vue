<template>
	<el-card class="export-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<el-icon><UploadFilled /></el-icon>
				<span>导出设置</span>
			</div>
		</template>
		<el-form label-width="100px" label-position="left">
			<el-form-item label="名称">
				<el-input v-model="store.img.export.name" readonly></el-input>
			</el-form-item>
			<el-form-item label="格式">
				<el-radio-group v-model="store.img.export.ext">
					<el-radio-button label="png">PNG</el-radio-button>
					<el-radio-button label="jpeg">JPEG</el-radio-button>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="质量" v-if="store.img.export.ext === 'jpeg'">
				<el-slider
					v-model="store.img.export.quality"
					:min="0.1"
					:max="1"
					:step="0.01"
					show-input>
				</el-slider>
			</el-form-item>
		</el-form>
	</el-card>
</template>

<script setup>
import { useStore } from "../stores";
import { UploadFilled } from '@element-plus/icons-vue';
const store = useStore();
</script>

<style lang="less" scoped>
.export-card {
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

	.el-form {
		padding: 15px;

		.el-form-item {
			margin-bottom: 18px;
		}
	}

	.el-input {
		width: 100%;
	}

	.el-radio-group {
		width: 100%;
	}

	.el-slider {
		width: 100%;
	}
}
</style>