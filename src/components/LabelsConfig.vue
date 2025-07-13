<template>
	<div class="container">
		<h3
			style="
				display: flex;
				justify-content: space-between;
				align-items: center;
				padding: 10px;
			"
			v-if="props.config.name">
			<el-divider content-position="left">{{ props.config.name }}</el-divider>
			<el-button
				type="danger"
				:text="true"
				plain
				@click="emits('remove', props.config.name)"
				>删除</el-button
			>
		</h3>
		<el-form :label-width="labelWidth">
			<el-form-item label="显示">
				<el-switch
					v-model="props.config.show"
					style="margin-right: 20px"></el-switch>
				<el-checkbox
					v-if="showMore"
					label="可拖动"
					v-model="props.config.draggable"></el-checkbox>
				<el-checkbox
					label="显示范围"
					v-model="props.config.showRect"></el-checkbox>
			</el-form-item>
			<el-form-item label="颜色">
				<el-color-picker
					v-model="props.config.color"
					:predefine="preDefineColors"
					show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="文本">
				<el-input
					v-model="props.config.text"
					placeholder="自定义文本，留空不显示~"
					clearable></el-input>
				<HorizontalScroll style="margin-top: 5px">
					<el-button
						size="small"
						@click="props.config.text = injectImg?.modelText"
						>型号</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = injectImg?.paramsText"
						>参数</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = injectImg?.timeText"
						>时间</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = injectImg?.lensText"
						>镜头</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = `ISO ${injectImg?.exif.ISO}`"
						>ISO</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = `F/${injectImg?.exif?.FNumber}`"
						>光圈</el-button
					>
					<el-button
						size="small"
						@click="
							props.config.text = convertExposureTime(
								injectImg?.exif?.ExposureTime
							)
						"
						>快门速度</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = injectImg?.locationText"
						>位置</el-button
					>
					<el-button size="small" @click="props.config.text = '中国 · 广东'"
						>位置：中国·广东</el-button
					>
					<el-button
						size="small"
						@click="props.config.text = injectImg?.exif?.Copyright || '--'"
						>版权</el-button
					>
				</HorizontalScroll>
			</el-form-item>
			<el-form-item label="字体">
				<el-select
					v-model="props.config.font"
					:style="{
						fontFamily: props.config?.font?.replace(
							/\.(?:ttf|otf|woff|woff2|eot)/i,
							''
						),
					}">
					<el-option v-for="item in fontList" :key="item" :value="item">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="大小">
				<el-slider
					show-input
					v-model="props.config.size"
					:min="12"
					:max="maxSize">
				</el-slider>
			</el-form-item>
			<el-form-item label="样式">
				<label>
					<span style="margin: 0px 10px 0px 20px">加粗</span>
					<el-switch v-model="props.config.bold"></el-switch>
				</label>
				<label for="">
					<span style="margin: 0px 10px 0px 20px">斜体</span>
					<el-switch v-model="props.config.italic"></el-switch>
				</label>
				<label for="">
					<span style="margin: 0px 10px 0px 20px">大写</span>
					<el-switch v-model="props.config.letterUpperCase"></el-switch>
				</label>
			</el-form-item>
			<el-form-item label="样式2">
				<el-radio-group v-model="props.config.textDecoration">
					<el-radio label="下划线" value="under"></el-radio>
					<el-radio label="删除线" value="delete"></el-radio>
					<el-radio label="下划线+删除线" value="under-delete"></el-radio>
					<el-radio label="无" value="none"></el-radio>
				</el-radio-group>
			</el-form-item>
            <p>{{ props.config.textDecoration }}</p>
			<el-form-item label="文字描边" label-width="80px">
				<el-switch show-input v-model="props.config.stroke"></el-switch>
			</el-form-item>
			<el-form-item
				label="描边宽度"
				label-width="80px"
				v-show="props.config.stroke">
				<el-slider
					show-input
					v-model="props.config.lineWidth"
					:min="1"
					:max="100"></el-slider>
			</el-form-item>
			<el-form-item label="水平偏移" label-width="80px">
				<el-slider
					show-input
					v-model="props.config.x"
					:min="-5000"
					:max="5000"></el-slider>
			</el-form-item>
			<el-form-item label="垂直偏移" label-width="80px">
				<el-slider
					show-input
					v-model="props.config.y"
					:min="-5000"
					:max="5000"></el-slider>
				<el-button type="default" plain @click="resetPosition"
					>重置位置</el-button
				>
			</el-form-item>
			<el-form-item label="对齐方式" label-width="80px">
				<el-radio-group v-model="props.config.align">
					<el-radio value="left" border>左对齐</el-radio>
					<el-radio value="center" border>居中</el-radio>
					<el-radio value="right" border>右对齐</el-radio>
					<el-radio value="justify" border>两端对齐</el-radio>
					<el-radio value="both" border>强制两端对齐</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="垂直对齐" label-width="80px">
				<el-radio-group v-model="props.config.verticalAlign">
					<el-radio value="top" border>顶部对齐</el-radio>
					<el-radio value="middle" border>居中</el-radio>
					<el-radio value="bottom" border>底部对齐</el-radio>
				</el-radio-group>
			</el-form-item>
			<el-form-item label="背景颜色" label-width="80px">
				<el-color-picker v-model="props.config.bg" show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="背景描边颜色" label-width="108px">
				<el-color-picker
					v-model="props.config.bgStroke"
					show-alpha></el-color-picker>
			</el-form-item>
			<el-form-item label="背景圆角" label-width="80px">
				<el-slider v-model="props.config.corner"></el-slider>
			</el-form-item>
			<slot></slot>
		</el-form>
	</div>
</template>

<script setup lang="ts">
import { preDefineColors, getSupportedFonts } from "../assets/tools";
import { inject, onMounted } from "vue";
import type { Img } from "../types";
import { convertExposureTime } from "../utils";
import HorizontalScroll from "./HorizontalScroll.vue";
import { ElMessage } from "element-plus";

const injectImg = inject<Img>("img");

const props = defineProps({
	config: {
		type: Object,
		required: true,
		default: () => ({
			name: { type: String, default: "" },
			show: { type: Boolean, default: true },
			text: { type: String, default: "" },
			align: {
				type: String,
				default: "left",
			},
			verticalAlign: { type: String, default: "middle" },
			color: { type: String, default: "#000" },
			size: { type: Number, default: 16 },
			italic: { type: Boolean, default: false },
			bold: { type: Boolean, default: false },
			x: { type: Number, default: 0 },
			y: { type: Number, default: 0 },
			draggable: { type: Boolean, default: false },
			letterUpperCase: { type: Boolean, default: false },
			stroke: { type: Boolean, default: false },
			lineWidth: { type: Number, default: 5 },
			showRect: { type: Boolean, required: true, default: true },
			bg: { type: String, default: "#ffffff00" },
			corner: { type: Number, default: 0 },
			bgStroke: { type: Number, default: 0 },
			textDecoration: { type: String, default: "none" },
		}),
	},
	showMore: { type: Boolean, default: true },
	maxSize: { type: Number, default: 1000 },
	labelWidth: { type: Number, default: 50 },
});

const fontList = getSupportedFonts();

const emits = defineEmits(["remove"]);

const backup = JSON.parse(JSON.stringify(props.config));

function resetPosition() {
	props.config.x = backup.x;
	props.config.y = backup.y;

	ElMessage.success("已重置位置");
}

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
