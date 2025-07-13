<template></template>

<!-- <template>
    <h3 style="margin-bottom: 10px;">自定义文本</h3>

    <div style="padding: 10px 0px;">
        <el-button @click="addCustomLabel">添加</el-button>
        <el-button @click="clear" type="danger" plain v-if="config.labels && config.labels.length > 0">清空</el-button>
    </div>

    <el-collapse accordion v-if="config.labels && config.labels.length > 0">
        <el-collapse-item v-for="label in config.labels" :key="label.name" :title="label.name">
            <LabelsConfig :config="label" @remove="removeCustomLabel" />
        </el-collapse-item>
    </el-collapse>
</template>

<script setup lang="ts">
import LabelsConfig from './LabelsConfig.vue';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { defaultLabelConfig } from '../assets/tools';
import { ElMessage } from 'element-plus';

const { config } = storeToRefs(useStore());

function addCustomLabel() {
    config.value.labels = config.value?.labels || [];
    defaultLabelConfig.name = `文本(${new Date().getTime()})`;
    config.value.labels.unshift(JSON.parse(JSON.stringify(defaultLabelConfig)));
}
function removeCustomLabel(name: string) {
    config.value?.labels?.splice(config.value?.labels?.findIndex(item => item.name === name), 1);
}
function clear() {
    config.value.labels = [];
    ElMessage.success('已清空~');
}
</script>

<style lang='less' scoped></style> -->