<template>
    <LabelsConfig v-if="config.watermark.params.enable" :config="config.watermark.params" :show-more="false" :label-width="70">
        <el-form-item label="等效焦距">
            <el-switch v-model="config.watermark.params.useEquivalentFocalLength"></el-switch>
            <p class="tips">等效全画幅焦段，是否支持看图片Exif信息</p>
        </el-form-item>
        <el-form-item label="样式" v-if="config.watermark.params.styles?.length">
            <el-select v-model="config.watermark.params.styleIndex" placeholder="请选择样式">
                <el-option v-for="(item, index) in config.watermark.params.styles" :key="item" :label="item"
                    :value="index"></el-option>
            </el-select>
        </el-form-item>
    </LabelsConfig>

    <!-- <el-form label-width="70px" v-if="config.watermark.params.enable">
        <el-form-item label="显示">
            <el-switch v-model="config.watermark.params.show"></el-switch>
        </el-form-item>
        <div v-show="config.watermark.params.show">
            <el-form-item label="文本">
                <el-input placeholder="留空则自动读取" v-model="config.watermark.params.text" clearable>
                    <template #append>
                        <el-button size="small" @click="config.watermark.params.text = img?.paramsText">读取</el-button>
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
        <span style="margin:0 10px 0px 30px;">加粗</span>
        <el-switch v-model="config.watermark.params.bold"></el-switch>
    </label>
</el-form-item>
<el-form-item label="等效焦距">
    <el-switch v-model="config.watermark.params.useEquivalentFocalLength"></el-switch>
    <p class="tips">等效全画幅焦段，是否支持看图片Exif信息</p>
</el-form-item>
<el-form-item label="样式" v-if="config.watermark.params.styles?.length">
    <el-select v-model="config.watermark.params.styleIndex" placeholder="请选择样式">
        <el-option v-for="(item,index) in config.watermark.params.styles" :key="item" :label="item"
            :value="index"></el-option>
    </el-select>
</el-form-item>
</div>
</el-form> -->
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
// import { preDefineColors } from '../assets/tools';
// import { inject } from 'vue';
// import type { Img } from '../types';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import LabelsConfig from './LabelsConfig.vue';

// const img = inject<Img>('img');

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>