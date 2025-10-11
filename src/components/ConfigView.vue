<template>
	<el-tabs :tab-position="isMobile() ? 'top' : 'right'">
		<el-tab-pane
			v-for="tab in tabs"
			:key="tab.label"
			:label="tab.label"
			:disabled="!tab.enable">
			<component :is="tab.component" v-if="tab.enable"></component>
			<el-empty description="不支持的配置" v-else></el-empty>
		</el-tab-pane>
	</el-tabs>
</template>

<script setup>
import { ref, computed, inject } from "vue";
import { ElMessage } from "element-plus";
import { useStore } from "../stores";
import { storeToRefs } from "pinia";
import { isMobile, selectFile } from "../utils";
import LeaferBgConfig from "./LeaferBgConfig.vue";

import ImageInfo from "./ImageInfo.vue";
import LeaferGlobalConfig from "./LeaferGlobalConfig.vue";
import LeaferModelConfig from "./LeaferModelConfig.vue";
import LeaferParamsConfig from "./LeaferParamsConfig.vue";
import LeaferTimeConfig from "./LeaferTimeConfig.vue";
import LeaferLensConfig from "./LeaferLensConfig.vue";
import LeaferEXIF from "./LeaferEXIF.vue";
import LeaferExportConfig from "./LeaferExportConfig.vue";
import LeaferLogoConfig from "./LeaferLogoConfig.vue";
const store = useStore();

const tabs = computed(() => [
	{
		label: "信息",
		component: LeaferEXIF,
		enable: true,
	},
	{
		label: "画布",
		component: LeaferGlobalConfig,
		enable: store?.config?.global,
	},
	{ label: "主图", component: LeaferBgConfig, enable: !!store.curFile },
	{
		label: "型号",
		component: LeaferModelConfig,
		enable: store?.config?.watermark?.model?.enable,
	},
	{
		label: "参数",
		component: LeaferParamsConfig,
		enable: store?.config?.watermark?.params?.enable,
	},
	{
		label: "时间",
		component: LeaferTimeConfig,
		enable: store?.config?.watermark?.time?.enable,
	},
	{
		label: "镜头",
		component: LeaferLensConfig,
		enable: store?.config?.watermark?.lens?.enable,
	},
	{
		label: "Logo",
		component: LeaferLogoConfig,
		enable: store?.config?.watermark?.logo?.enable,
	},
	{ label: "导出", component: LeaferExportConfig, enable: false },
]);
</script>

<style lang="less" scoped>
.el-tab-pane {
	overflow: scroll;
	max-height: 100%;

	// 隐藏滚动条
	&::-webkit-scrollbar {
		display: none;
	}
}

@media screen and (max-width: 768px) {
	.el-tabs {
		overflow: scroll;
	}
}
</style>
