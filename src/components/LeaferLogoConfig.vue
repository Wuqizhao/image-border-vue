<template>
	<h1>logo</h1>
	<LeaferRectConfig :config="store.config.watermark.logo" />
</template>

<script setup>
import LeaferRectConfig from "./LeaferRectConfig.vue";
import { useStore } from "../stores";
const store = useStore();
</script>

<style lang="less" scoped></style>
