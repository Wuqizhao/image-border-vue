<template>
    <el-form label-width="50px">
        <el-form-item label="显示">
            <el-switch v-model="props.config.show"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input v-model="props.config.text" placeholder="自定义文本，留空自动读取~" clearable>
                <template #append>
                    <el-button @click="props.config.text = props.text">读取</el-button>
                </template></el-input>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="props.config.color" :predefine="preDefineColors"></el-color-picker>
        </el-form-item>
        <el-form-item label="大小">
            <el-slider show-input v-model="props.config.size" :min="12" :max="250">
            </el-slider>
        </el-form-item>
        <el-form-item label="斜体">
            <el-switch v-model="props.config.italic"></el-switch>
            <label for="">
                <span style="margin:0 10px 0px 30px;">加粗</span>
                <el-switch v-model="props.config.bold"></el-switch>
            </label>
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
    },
    text: String
})
</script>

<style lang='less' scoped></style>