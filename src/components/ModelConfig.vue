<template>
    <el-form label-width="50px">
        <el-form-item label="显示">
            <el-switch v-model="props.config.show"></el-switch>
        </el-form-item>
        <div v-if="props.config.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取" v-model="props.config.text" clearable>
                    <template #append>
                        <el-button @click="useExifModelText">读取</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha v-model="props.config.color"
                    :disabled="!props.config.show" />
                <el-button v-if="props.paramsConfig.enable" style="margin-left: 10px;" size="small"
                    @click="props.paramsConfig.color = props.config.color">同步参数颜色</el-button>
                <el-button v-if="props.timeConfig.enable" size="small"
                    @click="props.timeConfig.color = props.config.color">同步时间颜色</el-button>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="props.config.size" :min="12" :max="500"
                    :disabled="!props.config.show"></el-slider>
            </el-form-item>
            <el-form-item label="加粗">
                <el-switch v-model="props.config.bold"></el-switch>
                <label for="">
                    <span style="margin:0 10px 0px 20px;">斜体</span>
                    <el-switch v-model="props.config.italic"></el-switch>
                </label>
                <label for="">
                    <span style="margin:0 10px 0px 20px;">替换Z为ℤ</span>
                    <el-switch v-model="props.config.replaceZ"></el-switch>
                </label>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { inject } from 'vue';
import type { Img } from '../types';
const injectData = inject<Img>('img');

const props = defineProps({
    config: {
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
                replaceZ: Boolean,
            }
        )
    },
    paramsConfig: {
        type: Object,
        required: true,
        default: () => ({
            enable: Boolean,
            color: String
        })
    },
    timeConfig: {
        type: Object,
        required: true,
        default: () => ({
            enable: Boolean,
            color: String
        })
    }
});


function useExifModelText() {
    props.config.text = injectData?.modelText;
}
</script>

<style lang='less' scoped></style>