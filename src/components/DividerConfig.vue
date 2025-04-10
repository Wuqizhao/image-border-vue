<template>
    <el-form label-width="80">
        <el-form-item label="显示">
            <el-switch v-model="props.divider.show"></el-switch>
        </el-form-item>
        <div v-show="props.divider.show">
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha
                    v-model="props.divider.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="宽度">
                <el-input-number v-model="props.divider.width" :min="1" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="长度缩放">
                <el-input-number v-model="props.divider.scale" :min="0" :max="50" :step="0.01"></el-input-number>
            </el-form-item>
            <el-form-item label="间隔缩放">
                <el-input-number v-model="props.divider.margin" :min="0" :max="50" :step="0.01"></el-input-number>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';

const props = defineProps({
    divider: {
        type: Object,
        required: true,
        default: () => (
            {
                show: Boolean,
                width: Number,
                scale: Number,
                margin: Number,
                color: String,
            }
        )
    },
});
</script>

<style lang='less' scoped></style>