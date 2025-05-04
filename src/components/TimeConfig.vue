<template>
    <el-form label-width="50px">
        <el-form-item label="显示">
            <el-switch v-model="config.watermark.time.show" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input placeholder="留空则自动读取~" v-model="config.watermark.time.text" clearable>
                <template #append>
                    <el-button @click="config.watermark.time.text = img?.timeText">读取</el-button>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker :predefine="preDefineColors" show-alpha v-model="config.watermark.time.color" />
        </el-form-item>
        <el-form-item label="大小">
            <el-slider v-model="config.watermark.time.size" :min="12" :max="250"></el-slider>
        </el-form-item>
        <el-form-item label="格式">
            <el-input placeholder="默认YYYY-MM-DD HH:mm:ss" v-model="config.watermark.time.format"></el-input>
            <p class="tips">YYYY-年 MM-月 DD-日 HH-时 mm-分 ss-秒</p>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { inject } from 'vue';
import type { Img } from '../types';

const { config } = storeToRefs(useStore());

const img = inject<Img>('img')
</script>

<style lang='less' scoped></style>