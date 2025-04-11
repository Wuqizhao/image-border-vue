<template>
    <el-form label-width="80px">
        <el-form-item label="显示">
            <el-switch v-model="props.params.show"></el-switch>
        </el-form-item>
        <div v-show="props.params.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取" v-model="props.params.text" clearable></el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha v-model="props.params.color" />
                <el-button v-if="props.divider.enable" style="margin-left: 10px;" size="small"
                    @click="props.divider.color = props.params.color">同步分割线颜色</el-button>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="props.params.size" :min="12" :max="300"></el-slider>
            </el-form-item>
            <el-form-item label="字母大写">
                <el-switch v-model="props.params.letterUpperCase"></el-switch>
            </el-form-item>
            <el-form-item label="等效焦距">
                <el-switch v-model="props.params.useEquivalentFocalLength"></el-switch>
                <p class="tips">等效全画幅焦段，是否支持看图片Exif信息</p>
            </el-form-item>
            <el-form-item label="斜体文字">
                <el-switch v-model="props.params.italic"></el-switch>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';

const props = defineProps({
    params: {
        type: Object,
        required: true,
        default: () => (
            {
                show: Boolean,
                text: String,
                color: String,
                size: Number,
                italic: Boolean,
                bold: Boolean,
                useEquivalentFocalLength: Boolean,
                letterUpperCase: Boolean,
            }
        )
    },
    divider: {
        type: Object,
        required: true,
        default: () => ({
            enable: Boolean,
            color: String,
        })
    },
});
</script>

<style lang='less' scoped></style>