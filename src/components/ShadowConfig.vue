<template>
    <el-form label-width="70" style="animation: k1 0.5s ease-in-out forwards;">
        <h3 style="margin-bottom: 1rem;">阴影</h3>
        <el-form-item label="显示">
            <el-switch v-model="config.shadow.show"></el-switch>
        </el-form-item>
        <div v-show="config.shadow.show">
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha
                    v-model="config.shadow.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="config.shadow.size" :min="1" :max="300"></el-slider>
            </el-form-item>
            <el-form-item label="水平偏移">
                <el-slider show-input v-model="config.shadow.x" :min="-100" :max="100"></el-slider>
            </el-form-item>
            <el-form-item label="垂直偏移">
                <el-slider show-input v-model="config.shadow.y" :min="-100" :max="100"></el-slider>
            </el-form-item>
            <el-form-item label="">
                <el-button size="small" @click="resetSize">重置大小</el-button>
                <el-button size="small" @click="resetOffset">重置偏移量</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());

const defaultConfig = JSON.parse(JSON.stringify(config.value.shadow));

function resetSize() {
    config.value.shadow.size = defaultConfig.size;
}
function resetOffset() {
    config.value.shadow.x = defaultConfig.x;
    config.value.shadow.y = defaultConfig.y;
}
</script>

<style lang='less' scoped></style>