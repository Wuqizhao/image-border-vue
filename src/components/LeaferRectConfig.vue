<template>
	<el-form label-width="80px">
		<el-form-item label="显示">
			<el-switch v-model="props.config.visible"></el-switch>
		</el-form-item>
		<el-form-item label="自动匹配">
			<el-switch v-model="props.config.auto" disabled></el-switch>
		</el-form-item>
		<el-form-item label="名称">
			<el-select v-model="props.config.name" placeholder="请输入名称" clearable>
				<el-option
					v-for="item in cameraBrands"
					:label="item.name"
					:value="item.logo"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="宽度">
			<el-slider
				show-input
				v-model="props.config.width"
				:max="1000"></el-slider>
		</el-form-item>
		<el-form-item label="长度">
			<el-slider
				show-input
				v-model="props.config.height"
				:max="1000"></el-slider>
		</el-form-item>
		<el-form-item label="拖动">
			<el-switch v-model="props.config.draggable"></el-switch>
		</el-form-item>
		<h3>圆角</h3>
		<el-form-item label="左上角">
			<el-slider
				show-input
				v-model="props.config.cornerRadius[0]"
				:max="500"></el-slider>
		</el-form-item>
		<el-form-item label="右上角">
			<el-slider
				show-input
				v-model="props.config.cornerRadius[1]"
				:max="500"></el-slider>
		</el-form-item>
		<el-form-item label="右下角">
			<el-slider
				show-input
				v-model="props.config.cornerRadius[2]"
				:max="500"></el-slider>
		</el-form-item>
		<el-form-item label="左下角">
			<el-slider
				show-input
				v-model="props.config.cornerRadius[3]"
				:max="500"></el-slider>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { cameraBrands } from "../assets/tools";

const props = defineProps({
	config: {
		visible: { type: Boolean, default: false },
		auto: { type: Boolean, default: true },
		width: { type: Number, default: 200 },
		height: { type: Number, default: 200 },
		draggable: { type: Boolean, default: true },
		cornerRadius: { type: Array, default: () => [0, 0, 0, 0] },
	},
});
</script>

<style lang="less" scoped>
.el-form {
	margin: 20px 0px;
}
</style>
