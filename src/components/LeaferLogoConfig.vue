<template>
	<LeaferRectConfig :config="store.config.watermark.logo" title="LOGO配置" />
</template>

<script setup>
import LeaferRectConfig from "./LeaferRectConfig.vue";
import { useStore } from "../stores";
const store = useStore();
</script>

<style lang="less" scoped></style>
