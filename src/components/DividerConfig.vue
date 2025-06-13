<template>
    <el-form label-width="70" v-if="config.divider.enable">
        <el-form-item label="显示">
            <el-switch v-model="config.divider.show"></el-switch>
        </el-form-item>
        <div v-show="config.divider.show">
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha
                    v-model="config.divider.color"></el-color-picker>
                <el-tag style="margin-left: 10px;border-width: 3px;" size="large" type="info" effect="plain"
                    :style="{ borderColor: config.divider.color, color: config.divider.color }">{{ config.divider.color
                    }}</el-tag>
            </el-form-item>
            <el-form-item label="分隔符" v-if="config.divider.separator !== undefined">
                <el-input v-model="config.divider.separator" placeholder="分隔符为空时，默认为绘制竖线" clearable></el-input>
            </el-form-item>
            <el-form-item label="间隔缩放">
                <el-slider show-input v-model="config.divider.margin" :min="0" :max="10" :step="0.01"></el-slider>
            </el-form-item>
            <div v-show="!config.divider.separator">
            <el-form-item label="宽度">
                <el-slider show-input v-model="config.divider.width" :min="1" :max="100"
                    :disabled="!!config.divider.separator?.length"></el-slider>
            </el-form-item>
            <el-form-item label="长度缩放">
                <el-slider show-input v-model="config.divider.scale" :min="0" :max="20" :step="0.01"
                    :disabled="!!config.divider.separator?.length"></el-slider>
            </el-form-item>
            </div>
        </div>
    </el-form>
    <el-result icon="error" title="当前模板不支持该配置~" v-else></el-result>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());
</script>

<style lang='less' scoped></style>