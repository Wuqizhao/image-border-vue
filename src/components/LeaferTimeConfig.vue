<template>
    <LeaferITextConfig :config="store.config.watermark.time" title="时间配置" />
</template>

<script setup>
import LeaferITextConfig from './LeaferITextConfig.vue';
import { useStore } from '../stores';
const store = useStore();

</script>

<style lang='less' scoped></style>