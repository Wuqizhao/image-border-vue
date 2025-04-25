<template>
    <el-form label-width="70px">
        <el-form-item label="显示">
            <el-switch v-model="config.watermark.time.show" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
        <div v-show="config.watermark.time.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取~" v-model="config.watermark.time.text" clearable>
                    <template #append>
                        <el-button @click="config.watermark.time.text = props.text">读取</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha v-model="config.watermark.time.color" />
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="config.watermark.time.size" :min="12" :max="250"></el-slider>
            </el-form-item>
            <el-form-item label="时间格式">
                <el-input placeholder="默认YYYY-MM-DD HH:mm:ss" v-model="config.watermark.time.format"></el-input>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());

const props = defineProps({
    text: String
});
</script>

<style lang='less' scoped></style>