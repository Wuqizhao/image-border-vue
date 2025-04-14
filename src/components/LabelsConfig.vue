<template>
    <h3>{{ props.config.name }}</h3>
    <el-form label-width="80px">
        <el-form-item label="显示">
            <el-switch v-model="props.config.show"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input v-model="props.config.text" placeholder="自定义文本，留空不显示~">
                <template #append>
                    <el-button disabled>读取</el-button>
                </template></el-input>
        </el-form-item>
        <el-form-item label="对齐方式">
            <el-radio-group v-model="props.config.align">
                <el-radio label="left" value="left">左对齐</el-radio>
                <el-radio label="center" value="center">居中</el-radio>
                <el-radio label="right" value="right">右对齐</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="垂直对齐">
            <el-radio-group v-model="props.config.verticalAlign">
                <el-radio label="top" value="left">顶部对齐</el-radio>
                <el-radio label="center" value="center">居中</el-radio>
                <el-radio label="bottom" value="right">底部对齐</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="props.config.color" :predefine="preDefineColors"></el-color-picker>
        </el-form-item>
        <el-form-item label="大小">
            <el-slider show-input v-model="props.config.size" :min="12" :max="250">
            </el-slider>
        </el-form-item>
        <el-form-item label="字体">
            <el-select v-model="props.config.font" :style="{ fontFamily: props.config.font }">
                <el-option v-for="item in fontList" :key="item" :value="item" :style="{ fontFamily: item }">
                </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="斜体">
            <el-switch v-model="props.config.italic"></el-switch>
        </el-form-item>
        <el-form-item label="加粗">
            <el-switch v-model="props.config.bold"></el-switch>
        </el-form-item>
        <el-form-item label="水平移动">
            <el-slider show-input v-model="props.config.x" :min="-5000" :max="5000"></el-slider>
        </el-form-item>
        <el-form-item label="垂直移动">
            <el-slider show-input v-model="props.config.y" :min="-5000" :max="5000"></el-slider>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors, getSupportedFonts } from '../assets/tools';
const props = defineProps({
    config: {
        type: Object,
        required: true,
        default: () => ({
            name: String,
            show: Boolean,
            text: String,
            align: String,
            verticalAlign: String,
            color: String,
            size: Number,
            italic: Boolean,
            bold: Boolean,
            x: Number,
            y: Number,
        })
    },
})

const fontList = getSupportedFonts()
</script>

<style lang='less' scoped></style>