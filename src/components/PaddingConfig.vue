<template>
    <el-form label-width="60px">
        <h3 style="margin-bottom: 1rem;">图片边距</h3>
        <el-form-item label="同步">
            <el-radio-group v-model="syncType">
                <el-radio label="不同步" :value="0"></el-radio>
                <el-radio label="同步左右" :value="1"></el-radio>
                <el-radio label="同步全部" :value="2"></el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="上边距">
            <el-slider v-model="config.paddings.top" :min="0" :max="2000" :step="10" show-input
                @change="changePadding"></el-slider>
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
    </el-form>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { ref } from 'vue';

const { config } = storeToRefs(useStore());

const syncType = ref(0);

function changePadding() {
    if (syncType.value === 0) return;

    if (syncType.value === 1) {
        config.value.paddings.left = config.value.paddings.right = config.value.paddings.top;
    } else {
        config.value.paddings.bottom = config.value.paddings.left = config.value.paddings.right = config.value.paddings.top;
    }
}
</script>

<style lang='less' scoped></style>