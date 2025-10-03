<template>
	<el-card class="global-config-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<el-icon><Setting /></el-icon>
				<span>全局配置</span>
			</div>
		</template>

		<el-form label-width="60px">
			<el-form-item label="水印高度" label-width="70px">
				<el-slider
					v-model="store.config.watermark.height"
					:max="1"
					:step="0.01"></el-slider>
			</el-form-item>
			<el-form-item label="背景颜色" label-width="70px">
				<el-color-picker
					v-model="store.config.fill"
					show-alpha
					:predefine="preDefineColors"></el-color-picker>
			</el-form-item>
			<el-form-item label="水印背景" label-width="70px">
				<el-color-picker
					v-model="store.config.watermark.fill"
					show-alpha
					:predefine="preDefineColors"></el-color-picker>
			</el-form-item>
			<el-form-item label="水印内边距" label-width="84px">
				
			</el-form-item>
			<el-divider></el-divider>
			
			<h4>画布内边距</h4>
			<el-form-item label="上边距">
				<el-slider
					v-model="store.config.global.paddings.top"
					:max="100"
					:step="0.01"
					show-input></el-slider>
			</el-form-item>
			<el-form-item label="下边距">
				<el-slider
					v-model="store.config.global.paddings.bottom"
					:max="100"
					:step="0.01"
					show-input></el-slider>
			</el-form-item>
			<el-form-item label="左边距">
				<el-slider
					v-model="store.config.global.paddings.left"
					:max="100"
					:step="0.01"
					show-input></el-slider>
			</el-form-item>
			<el-form-item label="右边距">
				<el-slider
					v-model="store.config.global.paddings.right"
					:max="100"
					:step="0.01"
					show-input></el-slider>
			</el-form-item>
			<el-button size="small" @click="syncPaddings">从上边距同步</el-button>
		</el-form>
	</el-card>
</template>

<script setup>
import { preDefineColors } from "../assets/tools";
import { useStore } from "../stores";
import { Setting } from "@element-plus/icons-vue";
const store = useStore();


function syncPaddings() {
	store.config.global.paddings.right = store.config.global.paddings.top;
	store.config.global.paddings.bottom = store.config.global.paddings.top;
	store.config.global.paddings.left = store.config.global.paddings.top;
}
</script>

<style lang="less" scoped>
.global-config-card {
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
		padding: 10px 15px;
	}

	h4 {
		margin: 15px 0 10px;
		color: var(--el-text-color-primary);
		font-size: 16px;
	}

	.el-form-item {
		margin-bottom: 18px;
	}
}
</style>
