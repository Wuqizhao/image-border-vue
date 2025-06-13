<template>
    <LabelsConfig v-if="config.watermark.lens.enable" :config="config.watermark.lens" :show-more="false"
        :max-size="250">
    </LabelsConfig>
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import LabelsConfig from './LabelsConfig.vue';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>