<template>
    <el-form label-width="50px">
        <el-form-item label="显示">
            <el-switch v-model="config.watermark.model.show"></el-switch>
        </el-form-item>
        <div v-if="config.watermark.model.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取" v-model="config.watermark.model.text" clearable>
                    <template #append>
                        <el-button @click="config.watermark.model.text = injectData?.modelText">读取</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha v-model="config.watermark.model.color"
                    :disabled="!config.watermark.model.show" />
                <el-button v-if="config.watermark.params.enable" style="margin-left: 10px;" size="small"
                    @click="config.watermark.params.color = config.watermark.model.color">同步参数颜色</el-button>
                <el-button v-if="config.watermark.time.enable" size="small"
                    @click="config.watermark.time.color = config.watermark.model.color">同步时间颜色</el-button>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="config.watermark.model.size" :min="12" :max="500"
                    :disabled="!config.watermark.model.show"></el-slider>
            </el-form-item>
            <el-form-item label="加粗">
                <el-switch v-model="config.watermark.model.bold"></el-switch>
                <label for="">
                    <span style="margin:0 10px 0px 20px;">斜体</span>
                    <el-switch v-model="config.watermark.model.italic"></el-switch>
                </label>
                <label for="">
                    <span style="margin:0 10px 0px 20px;">替换Z为ℤ</span>
                    <el-switch v-model="config.watermark.model.replaceZ"></el-switch>
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
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>