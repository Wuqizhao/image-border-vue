<template>
	<LeaferITextConfig :config="store.config.watermark.lens" title="镜头配置" />
</template>

<script setup>
import { useStore } from "../stores";
import LeaferITextConfig from "./LeaferITextConfig.vue";
const store = useStore();
</script>

<style lang="less" scoped></style>
