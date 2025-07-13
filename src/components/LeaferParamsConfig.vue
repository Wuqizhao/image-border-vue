<template>
	<LeaferITextConfig :config="store.config.watermark.params" title="参数设置" />
</template>

<script setup>
import LeaferITextConfig from "./LeaferITextConfig.vue";
import { useStore } from "../stores";
const store = useStore();
</script>

<style lang="less" scoped></style>
