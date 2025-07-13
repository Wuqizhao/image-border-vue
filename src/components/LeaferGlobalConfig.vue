<template>
	<h3>全局配置</h3>
	<el-form label-width="80px">
		<el-form-item label="背景颜色">
			<el-color-picker
				v-model="store.config.fill"
				show-alpha
				:predefine="preDefineColors"></el-color-picker>
		</el-form-item>
		<h4>内边距</h4>
		<el-form-item label="上边距">
			<el-slider
				v-model="store.config.global.paddings.top"
				:max="500"
				:step="1"
				show-input></el-slider>
		</el-form-item>
		<el-form-item label="下边距">
			<el-slider
				v-model="store.config.global.paddings.bottom"
				:max="500"
				:step="1"
				show-input></el-slider>
		</el-form-item>
		<el-form-item label="左边距">
			<el-slider
				v-model="store.config.global.paddings.left"
				:max="500"
				:step="1"
				show-input></el-slider>
		</el-form-item>
		<el-form-item label="右边距">
			<el-slider
				v-model="store.config.global.paddings.right"
				:max="500"
				:step="1"
				show-input></el-slider>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { preDefineColors } from "../assets/tools";
import { useStore } from "../stores";
const store = useStore();
</script>

<style lang="less" scoped></style>
