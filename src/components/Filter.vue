<template>
    <el-form label-width="60px" style="padding-right: 20px;animation: k1 0.5s ease-in-out forwards;">
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
        <el-form-item>
            <el-button type="default" size="small" plain @click="reset">重置滤镜</el-button>
        </el-form-item>
    </el-form>
</template>

<script setup>
import { useStore } from '../stores/index'
const store = useStore();

const filter = store.config.filter;
const backup = JSON.parse(JSON.stringify(filter));

function reset() {
    Object.assign(store.config.filter, backup);
}
</script>

<style lang='less' scoped></style>