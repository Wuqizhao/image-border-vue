<template>
    <el-form label-width="80px">
        <el-form-item label="显示">
            <el-switch v-model="props.config.show"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input v-model="props.config.text" placeholder="自定义文本，留空自动读取~"></el-input>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="props.config.color" :predefine="preDefineColors"></el-color-picker>
        </el-form-item>
        <el-form-item label="大小">
            <el-input-number v-model="props.config.size" :min="1" :max="100"></el-input-number>
        </el-form-item>
        <el-form-item label="斜体">
            <el-switch v-model="props.config.italic"></el-switch>
        </el-form-item>
        <el-form-item label="加粗">
            <el-switch v-model="props.config.bold"></el-switch>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
const props = defineProps({
    config: {
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
    }
})
</script>

<style lang='less' scoped></style>