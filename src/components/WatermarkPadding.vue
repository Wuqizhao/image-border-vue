<template>
    <el-form label-position="top" style="padding: 10px 15px;">
        <el-form-item label="水印高度">
            <el-slider :show-input="!isMobile()" :min="0" :max="0.5" :step="0.01"
                v-model="config.watermark.height"></el-slider>
            <p class="tips">水印在左右：相对于图片宽度的倍数；水印在上下：相对于图片高度的倍数。影响底部水印绘制范围的大小。</p>
        </el-form-item>
        <el-form-item label="上下边距">
            <el-slider v-model="config.watermark.paddings.tb" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="左右边距">
            <el-slider v-model="config.watermark.paddings.lr" :min="0" :max="5000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="水平偏移">
            <el-slider v-model="config.watermark.offsetX" :min="-10000" :max="10000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="垂直偏移">
            <el-slider v-model="config.watermark.offsetY" :min="-10000" :max="10000" :step="10" show-input></el-slider>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { isMobile } from '../utils';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>