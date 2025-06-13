<template>
    <LabelsConfig v-if="config.location?.enable" :config="config.location" :show-more="false" :max-size="250">
    </LabelsConfig>
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import LabelsConfig from './LabelsConfig.vue';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>