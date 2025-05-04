<template>
    <h3 style="margin-bottom: 10px;">自定义图片</h3>

    <div style="padding: 10px 0px;">
        <el-button @click="addCustomImage">添加</el-button><el-button @click="clear" type="danger" plain
            v-if="config.images && config.images.length > 0">清空</el-button>
    </div>
    <el-collapse accordion v-if="config.images && config.images.length > 0">
        <el-collapse-item v-for="image in config.images" :key="image.name" :title="image.title">
            <ImageConfig :config="image" @remove="removeCustomImage" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { defaultImageConfig } from '../assets/tools';
import ImageConfig from './ImageConfig.vue';
import { ElMessage } from 'element-plus';

const { config } = storeToRefs(useStore());

function addCustomImage() {
    config.value.images = config.value?.images || [];
    defaultImageConfig.title = `图片(${new Date().getTime()})`;
    config.value.images.unshift(JSON.parse(JSON.stringify(defaultImageConfig)));
}
function removeCustomImage(name: string) {
    config.value?.images?.splice(config.value?.images?.findIndex(item => item.name === name), 1);
}
function clear() {
    config.value.images = [];
    ElMessage.success('已清空~');
}
</script>

<style lang='less' scoped></style>