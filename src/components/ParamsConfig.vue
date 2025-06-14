<template>
    <LabelsConfig v-if="config.watermark.params.enable" :config="config.watermark.params" :show-more="false"
        :label-width="70">
        <el-form-item label="等效焦距">
            <el-switch v-model="config.watermark.params.useEquivalentFocalLength"></el-switch>
            <p class="tips">等效全画幅焦段，是否支持看图片Exif信息</p>
        </el-form-item>
        <el-form-item label="样式" v-if="config.watermark.params.styles?.length">
            <el-select v-model="config.watermark.params.styleIndex" placeholder="请选择样式">
                <el-option v-for="(item, index) in config.watermark.params.styles" :key="item" :label="item"
                    :value="index"></el-option>
            </el-select>
        </el-form-item>
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