<template>
    <el-form label-width="60px" style="padding-right: 20px;">
        <el-form-item label="曝光">
            <el-slider v-model="store.config.filter.brightness" :min="0" :max="200"
                @dblclick="store.config.filter.brightness = 100"></el-slider>
        </el-form-item>
        <el-form-item label="对比度">
            <el-slider v-model="store.config.filter.contrast" :min="0" :max="200"
                @dblclick="store.config.filter.contrast = 100"></el-slider>
        </el-form-item>
        <el-form-item label="饱和度">
            <el-slider v-model="store.config.filter.saturation" :min="0" :max="200"
                @dblclick="store.config.filter.saturation = 100"></el-slider>
        </el-form-item>
        <el-form-item label="灰度">
            <el-slider v-model="store.config.filter.grayscale" :min="0" :max="100"
                @dblclick="store.config.filter.grayscale = 0"></el-slider>
        </el-form-item>
        <el-form-item label="反色">
            <el-slider v-model="store.config.filter.invert" :min="0" :max="100"
                @dblclick="store.config.filter.invert = 0"></el-slider>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { useStore } from '../stores/index'
const store = useStore();

const filter = store.config.filter;
</script>

<style lang='less' scoped></style>