<template>
    <el-form label-width="70px">
        <h3 style="margin-bottom: 1rem;">背景模糊</h3>
        <el-form-item label="模糊">
            <el-switch v-model="config.blur.enable"></el-switch>
        </el-form-item>
        <el-form-item label="半径" v-if="config.blur.enable">
            <el-slider show-input v-model="config.blur.size" :min="0" :max="2000" :step="100"></el-slider>
        </el-form-item>
        <el-form-item label="颜色" v-if="!config.blur.enable">
            <el-color-picker :predefine="preDefineColors" show-alpha v-model="config.bg.bgColor"></el-color-picker>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
const config = defineProps({
    blur: {
        type: Object,
        required: true,
        default: () => {
            return {
                size: Number,
            }
        }
    },
    bg: {
        type: Object,
        required: true,
        default: () => ({
            bgColor: '#ffffff'
        })
    }
})
</script>

<style lang='less' scoped></style>