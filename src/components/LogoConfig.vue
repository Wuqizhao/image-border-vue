<template>
    <ImageConfig :show-more="false" v-model:config="config.logo" v-if="config.logo.enable" />
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import ImageConfig from './ImageConfig.vue';

const { config } = storeToRefs(useStore());
</script>