<template>
    <el-form label-width="50px" v-if="config.location?.enable">
        <el-form-item label="显示">
            <el-switch v-model="config.location.show"></el-switch>
        </el-form-item>
        <el-form-item label="文本">
            <el-input v-model="config.location.text" placeholder="自定义位置文本，留空自动读取~" clearable>
                <template #append>
                    <el-button @click="config.location.text = (img?.locationText || '')">读取</el-button>
                </template>
            </el-input>
        </el-form-item>
        <el-form-item label="大小">
            <el-slider show-input v-model="config.location.size" :min="12" :max="250"></el-slider>
        </el-form-item>
        <el-form-item label="加粗">
            <el-switch v-model="config.location.bold"></el-switch>
            <label for="">
                <span style="margin:0 5px 0px 25px;">斜体</span>
                <el-switch v-model="config.location.italic"></el-switch>
            </label>
            <label for="">
                <span style="margin:0 5px 0px 25px;">文本颜色</span>
                <el-color-picker v-model="config.location.color" :predefine="preDefineColors"></el-color-picker>
            </label>
        </el-form-item>
    </el-form>
    <div v-else>配置不可用</div>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { inject } from 'vue';
import type { Img } from '../types';

const { config } = storeToRefs(useStore());
const img = inject<Img>('img');
</script>

<style lang='less' scoped></style>