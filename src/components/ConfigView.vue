<template>
	<el-tabs :tab-position="isMobile() ? 'top' : 'right'">
		<el-tab-pane label="信息">
			<LeaferEXIF />
		</el-tab-pane>
		<el-tab-pane label="画布">
			<LeaferGlobalConfig />
		</el-tab-pane>
		<el-tab-pane label="主图">
			<LeaferBgConfig />
		</el-tab-pane>
		<el-tab-pane label="型号" v-if="config.watermark.model.enable">
			<LeaferModelConfig />
		</el-tab-pane>
		<el-tab-pane label="参数" v-if="config.watermark.params.enable">
			<LeaferParamsConfig />
		</el-tab-pane>
		<el-tab-pane label="时间" v-if="config.watermark.time.enable">
			<LeaferTimeConfig />
		</el-tab-pane>
		<el-tab-pane label="镜头" v-if="config.watermark.lens.enable">
			<LeaferLensConfig />
		</el-tab-pane>
		<el-tab-pane label="Logo" v-if="config.watermark.logo.enable">
			<LeaferLogoConfig />
		</el-tab-pane>
		<el-tab-pane label="导出">
			<LeaferExportConfig />
		</el-tab-pane>
	</el-tabs>
</template>

<script setup>
import ImageInfo from "./ImageInfo.vue";
import { useStore } from "../stores";
import LeaferBgConfig from "./LeaferBgConfig.vue";
import { isMobile, selectFile } from "../utils";
import LeaferGlobalConfig from "./LeaferGlobalConfig.vue";
import LeaferModelConfig from "./LeaferModelConfig.vue";
import LeaferParamsConfig from "./LeaferParamsConfig.vue";
import { computed, inject } from "vue";
import { ElMessage } from "element-plus";
import LeaferTimeConfig from "./LeaferTimeConfig.vue";
import LeaferLensConfig from "./LeaferLensConfig.vue";
import LeaferEXIF from "./LeaferEXIF.vue";
import LeaferExportConfig from "./LeaferExportConfig.vue";
import LeaferLogoConfig from "./LeaferLogoConfig.vue";
import { storeToRefs } from "pinia";
const store = useStore();

const { config } = storeToRefs(store);

function clearFileList() {
	store.fileList = [];
	store.curFile = null;
}
</script>

<style lang="less" scoped>
.el-tab-pane {
	overflow: scroll;
	// border: 5px solid salmon;
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
