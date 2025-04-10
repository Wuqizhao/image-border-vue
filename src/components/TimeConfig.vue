<template>
    <el-form label-width="80px">
        <el-form-item label="显示">
            <el-switch v-model="props.time.show" :active-value="true" :inactive-value="false"></el-switch>
        </el-form-item>
        <div v-show="props.time.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取~" v-model="props.time.text" clearable></el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha v-model="props.time.color" />
            </el-form-item>
            <el-form-item label="大小">
                <el-input-number v-model="props.time.size" :min="12" :max="1000"></el-input-number>
            </el-form-item>
            <el-form-item label="时间格式">
                <el-input placeholder="默认YYYY-MM-DD HH:mm:ss" v-model="props.time.format"></el-input>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';

const props = defineProps({
    time: {
        type: Object,
        required: true,
        default: () => (
            {
                show: Boolean,
                text: String,
                color: String,
                size: Number,
                format: String
            }
        )
    },
});
</script>

<style lang='less' scoped></style>