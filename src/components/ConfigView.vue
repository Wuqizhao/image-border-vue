<template>
	<div>
		<el-button @click="selectFile" type="primary">添加文件</el-button>
		<el-button @click="clearFileList" type="danger" plain>清空文件</el-button>
		<el-button @click="store.exportImg" type="success" plain>导出</el-button>
		<el-button type="warning" plain @click="store.resetStyle"
			>重置样式</el-button
		>
	</div>

	<el-tabs tab-position="right">
		<el-tab-pane label="信息">
			<LeaferEXIF />
		</el-tab-pane>
		<el-tab-pane label="画布">
			<LeaferGlobalConfig />
		</el-tab-pane>
		<el-tab-pane label="主图">
			<LeaferBgConfig />
		</el-tab-pane>
		<el-tab-pane label="型号">
			<LeaferModelConfig />
		</el-tab-pane>
		<el-tab-pane label="参数">
			<LeaferParamsConfig />
		</el-tab-pane>
		<el-tab-pane label="时间">
			<LeaferTimeConfig />
		</el-tab-pane>
		<el-tab-pane label="镜头">
			<LeaferLensConfig />
		</el-tab-pane>
		<el-tab-pane label="Logo">
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
import { selectFile } from "../utils";
import LeaferGlobalConfig from "./LeaferGlobalConfig.vue";
import LeaferModelConfig from "./LeaferModelConfig.vue";
import LeaferParamsConfig from "./LeaferParamsConfig.vue";
import { inject } from "vue";
import { ElMessage } from "element-plus";
import LeaferTimeConfig from "./LeaferTimeConfig.vue";
import LeaferLensConfig from "./LeaferLensConfig.vue";
import LeaferEXIF from "./LeaferEXIF.vue";
import LeaferExportConfig from "./LeaferExportConfig.vue";
import LeaferLogoConfig from "./LeaferLogoConfig.vue";
const store = useStore();

function clearFileList() {
	store.fileList = [];
	store.curFile = null;
}
</script>

<style lang="less" scoped>
.el-tab-pane {
	overflow: scroll;
	// border: 10px solid salmon;
	max-height: 100%;

	// 隐藏滚动条
	&::-webkit-scrollbar {
		display: none;
	}
}
</style>
