<template>
	<div class="container">
		<h3
			style="
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px;
			"
			v-if="config.name">
			<el-divider content-position="left">{{ config.name }}</el-divider>
			<el-button type="danger" :text="true" plain>删除</el-button>
		</h3>
		<el-form :label-width="labelWidth">
			<el-form-item label="显示">
				<el-switch v-model="config.show" style="margin-right: 20px"></el-switch>
				<el-checkbox
					v-if="showMore"
					label="可拖动"
					v-model="config.draggable"></el-checkbox>
			</el-form-item>

			<el-form-item label="文本内容">
				<el-input
					v-model="config.text"
					placeholder="输入文本内容"
					clearable></el-input>
			</el-form-item>

			<el-form-item label="字体">
				<el-select
					v-model="config.fontFamily"
					:style="{ fontFamily: config.fontFamily }">
					<el-option v-for="item in fontList" :key="item" :value="item">
						<span :style="{ fontFamily: item }">{{ item }}</span>
					</el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="字体大小">
				<el-slider
					show-input
					v-model="config.fontSize"
					:min="12"
					:max="maxSize">
				</el-slider>
			</el-form-item>

			<el-form-item label="字体颜色">
				<el-color-picker v-model="config.fill" show-alpha></el-color-picker>
			</el-form-item>

			<el-form-item label="字体样式">
				<el-checkbox v-model="config.bold" style="margin-right: 20px"
					>加粗</el-checkbox
				>
				<el-checkbox v-model="config.italic">斜体</el-checkbox>
			</el-form-item>

			<el-form-item label="对齐方式">
				<el-radio-group v-model="config.textAlign">
					<el-radio-button value="left">左对齐</el-radio-button>
					<el-radio-button value="center">居中</el-radio-button>
					<el-radio-button value="right">右对齐</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="垂直对齐">
				<el-radio-group v-model="config.verticalAlign">
					<el-radio-button value="top">顶部</el-radio-button>
					<el-radio-button value="middle">居中</el-radio-button>
					<el-radio-button value="bottom">底部</el-radio-button>
				</el-radio-group>
			</el-form-item>

			<el-form-item label="X位置">
				<el-slider
					show-input
					v-model="config.x"
					:min="-5000"
					:max="5000"></el-slider>
			</el-form-item>

			<el-form-item label="Y位置">
				<el-slider
					show-input
					v-model="config.y"
					:min="-5000"
					:max="5000"></el-slider>
				<el-button type="default" plain>重置位置</el-button>
			</el-form-item>

			<el-form-item label="旋转角度">
				<el-slider
					show-input
					v-model="config.rotation"
					:min="0"
					:max="360"></el-slider>
			</el-form-item>

			<el-form-item label="透明度">
				<el-slider
					show-input
					v-model="config.opacity"
					:min="0"
					:max="1"
					:step="0.01"></el-slider>
			</el-form-item>

			<slot></slot>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import type { IText } from "leafer-ui";
import { getSupportedFonts } from "../assets/tools";
import { onMounted, ref } from "vue";
import { useStore } from "../stores/index";

const { config, showMore, maxSize, labelWidth } = defineProps({
	config: { type: Object, required: true, default: () => ({}) },
	showMore: { type: Boolean, default: true },
	maxSize: { type: Number, default: 100 },
	labelWidth: { type: Number, default: 80 },
});

// defineEmits(["remove"]);
const fontList = getSupportedFonts();
</script>

<style lang="less" scoped>
.container {
	padding: 10px;
	border: 1.5px solid gainsboro;
	border-radius: 5px;
	margin-top: 10px;
	animation: container 0.5s;

	&:hover {
		border-color: var(--el-color-primary);
	}

	@keyframes container {
		from {
			transform: translateX(50px);
			opacity: 0.6;
		}
	}
}
</style>
