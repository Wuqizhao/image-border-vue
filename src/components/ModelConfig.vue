<template>
    <div v-if="config.watermark.model.enable">
        <LabelsConfig :config="config.watermark.model" :show-more="false">
            <el-form-item label="替换Z为ℤ" label-width="85px">
                    <el-switch v-model="config.watermark.model.replaceZ"></el-switch>
            </el-form-item>
        </LabelsConfig>
    </div>
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import LabelsConfig from './LabelsConfig.vue';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>