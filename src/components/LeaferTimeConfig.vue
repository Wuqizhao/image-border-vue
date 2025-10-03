<template>
    <LeaferITextConfig :config="store.config.watermark.time" title="时间配置">
        <el-form-item label="格式">
            <el-input v-model="store.config.watermark.time.format"></el-input>
        </el-form-item>
    </LeaferITextConfig>
</template>

<script setup>
import LeaferITextConfig from './LeaferITextConfig.vue';
import { useStore } from '../stores';
const store = useStore();

</script>

<style lang='less' scoped></style>