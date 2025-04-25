<template>
    <el-form label-width="70px">
        <el-form-item label="显示">
            <el-switch v-model="config.watermark.params.show"></el-switch>
        </el-form-item>
        <div v-show="config.watermark.params.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取" v-model="config.watermark.params.text" clearable>
                    <template #append>
                        <el-button size="small" @click="config.watermark.params.text = props.text">读取</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha v-model="config.watermark.params.color" />
                <el-button v-if="config.divider.enable" style="margin-left: 10px;" size="small"
                    @click="config.divider.color = config.watermark.params.color">同步分割线颜色</el-button>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="config.watermark.params.size" :min="12" :max="300"></el-slider>
            </el-form-item>
            <el-form-item label="字母大写">
                <el-switch v-model="config.watermark.params.letterUpperCase"></el-switch>
                <label for="">
                    <span style="margin:0 10px 0px 30px;">斜体</span>
                    <el-switch v-model="config.watermark.params.italic"></el-switch>
                </label>
            </el-form-item>
            <el-form-item label="等效焦距">
                <el-switch v-model="config.watermark.params.useEquivalentFocalLength"></el-switch>
                <p class="tips">等效全画幅焦段，是否支持看图片Exif信息</p>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());

const props = defineProps({
    text: String
});
</script>

<style lang='less' scoped></style>