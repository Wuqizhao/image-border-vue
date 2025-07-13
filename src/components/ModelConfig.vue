<template>
    <div v-if="config.watermark.model.enable">
        <LeaferTextConfig :config="config.watermark.model">
            <el-form-item label="替换Z为ℤ" label-width="85px">
                <el-switch v-model="config.watermark.model.replaceZ"></el-switch>
            </el-form-item>
        </LeaferTextConfig>
    </div>
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import LeaferTextConfig from './LeaferTextConfig.vue';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>