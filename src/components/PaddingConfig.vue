<template>
    <el-form label-width="60px">
        <h3 style="margin-bottom: 1rem;">图片边距</h3>
        <el-form-item label="上边距">
            <el-slider v-model="config.paddings.top" :min="0" :max="2000" :step="10" show-input></el-slider>
            <div style="width: 100%;">
                <el-button size="small"
                    @click="config.paddings.left = config.paddings.right = config.paddings.top">同步左右</el-button>
                <el-button size="small"
                    @click="config.paddings.bottom = config.paddings.left = config.paddings.right = config.paddings.top">全部同步</el-button>
            </div>
        </el-form-item>
        <el-form-item label="左边距">
            <el-slider v-model="config.paddings.left" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="右边距">
            <el-slider v-model="config.paddings.right" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="下边距">
            <el-slider v-model="config.paddings.bottom" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
        <h3 style="margin-bottom: 1rem;">水印边距</h3>
        <el-form-item label="左右">
            <el-slider v-model="config.watermark.paddings.lr" :min="0" :max="5000" :step="10" show-input></el-slider>
        </el-form-item>
        <el-form-item label="上下">
            <el-slider v-model="config.watermark.paddings.tb" :min="0" :max="2000" :step="10" show-input></el-slider>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
const config = defineProps({
    paddings: {
        type: Object,
        required: true,
        default: () => ({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
        })
    },
    watermark: {
        type: Object,
        required: true,
        default: () => ({
            paddings: {
                lr: 0,
                tb: 0
            }
        })
    }
})
</script>

<style lang='less' scoped></style>