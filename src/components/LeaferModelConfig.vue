<template>
	<LeaferITextConfig :config="store.config.watermark.model" title="型号设置">
		<el-form-item label="替换z">
			<el-switch v-model="store.config.watermark.model.replaceZ"></el-switch>
		</el-form-item>
	</LeaferITextConfig>
</template>

<script setup>
import { preDefineColors } from "../assets/tools";
import { useStore } from "../stores";
import LeaferITextConfig from "./LeaferITextConfig.vue";
const store = useStore();
</script>

<style lang="less" scoped></style>
