<template>
    <el-form v-if="store.config.border?.enable" label-width="80px">
        <el-form-item label="显示">
            <el-switch v-model="store.config.border.show"></el-switch>
        </el-form-item>
        <el-form-item label="宽度">
            <el-slider show-input v-model="store.config.border.width" :min="0" :max="1000"></el-slider>
        </el-form-item>
        <el-form-item label="颜色">
            <el-color-picker v-model="store.config.border.color" :predefine="preDefineColors" show-alpha></el-color-picker>
        </el-form-item>
    </el-form>
    <el-result v-else title="当前配置不支持此项设置！" icon="error"></el-result>
</template>

<script setup>
import { useStore } from '../stores/index'
const store = useStore();
import { preDefineColors } from '../assets/tools';
</script>

<style lang='less' scoped></style>