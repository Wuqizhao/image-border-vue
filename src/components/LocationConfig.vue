<template>
    <el-form label-width="80px">
        <el-form-item label="显示">
            <el-switch v-model="loc.show"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input v-model="loc.text" placeholder="自定义位置文本，留空自动读取~" clearable>
                <template #append>
                    <el-button @click="loc.text = text">读取</el-button>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="大小">
            <el-slider show-input v-model="loc.size" :min="12" :max="250"></el-slider>
        </el-form-item>
        <el-form-item label="加粗">
            <el-switch v-model="loc.bold"></el-switch>
        </el-form-item>
        <el-form-item label="斜体">
            <el-switch v-model="loc.italic"></el-switch>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="loc.color" :predefine="preDefineColors"></el-color-picker>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
const { loc } = defineProps({
    loc: {
        type: Object,
        required: true,
        default: () => ({
            show: Boolean,
            text: String,
            color: String,
            size: Number,
            italic: Boolean,
            bold: Boolean,
        })
    },
    text: String,

})
</script>

<style lang='less' scoped></style>