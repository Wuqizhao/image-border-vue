<template>
    <el-form label-width="50px" v-if="config.watermark.lens.enable">
        <el-form-item label="显示">
            <el-switch v-model="config.watermark.lens.show"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input v-model="config.watermark.lens.text" placeholder="自定义文本，留空自动读取~" clearable>
                <template #append>
                    <el-button @click="config.watermark.lens.text = (img?.lensText as string)">读取</el-button>
                </template></el-input>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="config.watermark.lens.color" :predefine="preDefineColors"></el-color-picker>
        </el-form-item>
        <el-form-item label="大小">
            <el-slider show-input v-model="config.watermark.lens.size" :min="12" :max="250">
            </el-slider>
        </el-form-item>
        <el-form-item label="斜体">
            <el-switch v-model="config.watermark.lens.italic"></el-switch>
            <label for="">
                <span style="margin:0 10px 0px 30px;">加粗</span>
                <el-switch v-model="config.watermark.lens.bold"></el-switch>
            </label>
        </el-form-item>
    </el-form>
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { inject } from 'vue';
import type { Img } from '../types';

const { config } = storeToRefs(useStore());
const img = inject<Img>('img');
</script>

<style lang='less' scoped></style>