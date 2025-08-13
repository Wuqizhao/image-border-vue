<template>
	<el-card class="text-config-card" shadow="hover">
		<template #header>
			<div class="card-header">
				<el-icon><Edit /></el-icon>
				<span>{{ props.title }}</span>
			</div>
		</template>
		<el-form label-width="60px">
			<el-form-item label="显示">
				<el-switch v-model="props.config.visible"></el-switch>
			</el-form-item>
			<el-form-item label="文字">
				<el-input
					v-model="props.config.text"
					placeholder="请输入文字，留空自动读取~"
					clearable></el-input>
			</el-form-item>
			<el-form-item label="颜色">
				<el-color-picker
					v-model="props.config.fill"
					show-alpha
					:predefine="preDefineColors"></el-color-picker>
			</el-form-item>
			<el-form-item label="大小">
				<el-slider
					v-model="props.config.fontSize"
					:min="10"
					:max="500"
					show-input></el-slider>
			</el-form-item>
			<el-form-item label="字重">
				<el-select v-model="props.config.fontWeight" placeholder="请选择字重">
					<el-option label="thin" value="thin"></el-option>
					<el-option label="extra-light" value="extra-light"></el-option>
					<el-option label="light" value="light"></el-option>
					<el-option label="正常-400" value="normal"></el-option>
					<el-option label="medium" value="medium"></el-option>
					<el-option label="semi-bold" value="semi-bold"></el-option>
					<el-option label="bold" value="bold"></el-option>
					<el-option label="extra-bold" value="extra-bold"></el-option>
					<el-option label="black" value="black"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="样式">
				<el-radio-group v-model="props.config.textDecoration">
					<el-radio label="无" value="none"></el-radio>
					<el-radio label="删除线" value="delete"></el-radio>
					<el-radio label="下划线" value="under"></el-radio>
					<el-radio label="删除+下划线" value="under-delete"></el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="斜体">
				<el-switch v-model="props.config.italic"></el-switch>
			</el-form-item>
			<el-form-item label="大写">
				<el-radio-group v-model="props.config.textCase">
					<el-radio label="保持原始" value="none"></el-radio>
					<el-radio label="首字母大写" value="title"></el-radio>
					<el-radio label="全部大写" value="upper"></el-radio>
					<el-radio label="全部小写" value="lower"></el-radio>
				</el-radio-group>
			</el-form-item>
			<!-- 行间距 lineHeight -->
			<el-form-item label="行间距">
				<el-slider
					v-model="props.config.lineHeight"
					:min="0.1"
					:max="10"
					show-input></el-slider>
			</el-form-item>
			<el-form-item label="字间距">
				<el-slider
					v-model="props.config.letterSpacing"
					:min="0"
					:step="0.01"
					:max="1"
					show-input></el-slider>
			</el-form-item>
			<el-form-item label="可拖动">
				<el-switch v-model="props.config.draggable"></el-switch>
			</el-form-item>
			<el-form-item label="可编辑">
				<el-switch v-model="props.config.editable"></el-switch>
			</el-form-item>
			<el-form-item label="字体">
				<el-select v-model="props.config.fontFamily" placeholder="请选择字体">
					<el-option
						v-for="item in getSupportedFonts()"
						:label="item"
						:value="item.split('.')[0]"></el-option>
				</el-select>
			</el-form-item>
			<slot></slot>
		</el-form>
	</el-card>
</template>

<script setup>
import { getSupportedFonts, preDefineColors } from "../assets/tools";
import { Edit } from "@element-plus/icons-vue";
const props = defineProps({
	config: {
		typeof: Object,
		default: () => ({
			text: "Leafer",
			fill: "#FF0000",
			fontSize: 100,
			fontFamily: "arial",
		}),
	},
	title: {
		typeof: String,
		default: "配置",
	},
});
</script>

<style lang="less" scoped>
.text-config-card {
	margin: 20px 0px;
	border-radius: 8px;
	transition: all 0.3s ease;

	&:hover {
		box-shadow: 3px 5px 8px 0 rgba(0, 0, 0, 0.2);
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
</style>
