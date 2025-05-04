<template>
    <el-form label-width="80px">
        <h3 style="margin-bottom: 1rem;">图片</h3>
        <el-form-item label="上边距">
            <el-slider v-model="config.paddings.top" :min="0" :max="2000" :step="10" show-input></el-slider>
            <div style="width: 100%;">
                <el-button size="small"
                    @click="config.paddings.left = config.paddings.right = config.paddings.top">同步左右</el-button>
                <el-button size="small"
                    @click="config.paddings.bottom = config.paddings.left = config.paddings.right = config.paddings.top">全部同步</el-button>
            </div>
        </el-form-item>
        <el-form-item label="左边距">
            <el-slider v-model="config.paddings.left" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="右边距">
            <el-slider v-model="config.paddings.right" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="下边距">
            <el-slider v-model="config.paddings.bottom" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>

        <h3 style="margin-bottom: 1rem;">水印</h3>
        <el-form-item label="基础高度">
            <el-slider :show-input="!isMobile()" :min="0" :max="0.5" :step="0.01"
                v-model="config.watermark.height"></el-slider>
            <p class="tips">水印在左右：相对于图片宽度的倍数；水印在上下：相对于图片高度的倍数。影响底部水印绘制范围的大小。</p>
        </el-form-item>

        <!-- <h3 style="margin-bottom: 1rem;">水印边距</h3> -->
        <el-form-item label="左右边距">
            <el-slider v-model="config.watermark.paddings.lr" :min="0" :max="5000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="上下边距">
            <el-slider v-model="config.watermark.paddings.tb" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <!-- <h3 style="margin-bottom: 1rem;">水印移动</h3> -->
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