<template>
    <el-form label-width="70" v-if="config.margin">
        <el-form-item label="显示">
            <el-switch v-model="config.margin.show"></el-switch>
        </el-form-item>
        <el-form-item label="上边距">
            <el-slider show-input v-model="config.margin.top" :max="3000"></el-slider>
        </el-form-item>
        <el-form-item label="下边距">
            <el-slider show-input v-model="config.margin.bottom" :max="3000"></el-slider>
        </el-form-item>
        <el-form-item label="右边距">
            <el-slider show-input v-model="config.margin.right" :max="3000"></el-slider>
        </el-form-item>
        <el-form-item label="左边距">
            <el-slider show-input v-model="config.margin.left" :max="3000"></el-slider>
        </el-form-item>
    </el-form>
    <el-result icon="error" v-else description="当前模板不支持该配置~"></el-result>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>