<template>
    <LabelsConfig :config="config.watermark.time" :show-more="false" :max-size="250"
        v-if="config.watermark.time.enable">
        <el-form-item label="格式">
            <el-input placeholder="默认YYYY-MM-DD HH:mm:ss" v-model="config.watermark.time.format"></el-input>
            <p class="tips">YYYY-年 MM-月 DD-日 HH-时 mm-分 ss-秒</p>
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