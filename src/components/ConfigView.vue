<template>
	<div>
		<el-button @click="selectFile" type="primary">添加文件</el-button>
		<el-button @click="clearFileList" type="danger" plain>清空文件</el-button>
		<el-button @click="store.exportLeafer" type="success">导出</el-button>
	</div>
	<h1>配置</h1>

	<div style="overflow: auto">
		<LeaferEXIF />
		<LeaferLensConfig />
		<LeaferBgConfig />
		<LeaferTimeConfig />
		<LeaferParamsConfig />
		<LeaferModelConfig />
		<LeaferGlobalConfig />
		<!-- <p>文件名：{{ store.curFile?.name }}</p>
		<p>img:{{ store.img }}</p>
		<p>curFile:{{ store.curFile }}</p>
		<p>config:{{ store.config }}</p>
		<p>fileList:{{ store.fileList }}</p> -->
	</div>
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
const store = useStore();

function clearFileList() {
	store.fileList = [];
	store.curFile = null;
}

const leafer = inject("leafer");
</script>

<style lang="less" scoped></style>
