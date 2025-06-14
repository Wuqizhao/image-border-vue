<template>
    <div class="container">
        <h3 style="display: flex;justify-content: space-between;align-items: center;padding:10px;"
            v-if="props.config.name">
            <el-divider content-position="left">{{ props.config.name }}</el-divider>
            <el-button type="danger" :text="true" plain @click="emits('remove', props.config.name)">删除</el-button>
        </h3>
        <el-form :label-width="labelWidth">
            <el-form-item label="显示">
                <el-switch v-model="props.config.show" style="margin-right: 20px;"></el-switch>
                <el-checkbox v-if="showMore" label="可拖动" v-model="props.config.draggable"></el-checkbox>
            </el-form-item>
            <el-form-item label="颜色">
                <el-color-picker v-model="props.config.color" :predefine="preDefineColors" show-alpha></el-color-picker>
            </el-form-item>
            <el-form-item label="文本">
                <el-input v-model="props.config.text" placeholder="自定义文本，留空不显示~" clearable></el-input>
                <HorizontalScroll style="margin-top: 5px;">
                    <el-button size="small" @click="props.config.text = injectImg?.modelText">型号</el-button>
                    <el-button size="small" @click="props.config.text = injectImg?.paramsText">参数</el-button>
                    <el-button size="small" @click="props.config.text = injectImg?.timeText">时间</el-button>
                    <el-button size="small" @click="props.config.text = injectImg?.lensText">镜头</el-button>
                    <el-button size="small" @click="props.config.text = `ISO ${injectImg?.exif.ISO}`">ISO</el-button>
                    <el-button size="small" @click="props.config.text = `F/${injectImg?.exif?.FNumber}`">光圈</el-button>
                    <el-button size="small"
                        @click="props.config.text = convertExposureTime(injectImg?.exif?.ExposureTime)">快门速度</el-button>
                    <el-button size="small" @click="props.config.text = injectImg?.locationText">位置</el-button>
                    <el-button size="small" @click="props.config.text = '中国 · 广东'">位置：中国·广东</el-button>
                    <el-button size="small" @click="props.config.text = injectImg?.exif?.Copyright || '--'">版权</el-button>
                </HorizontalScroll>
            </el-form-item>
            <el-form-item label="字体">
                <el-select v-model="props.config.font" :style="{ fontFamily: props.config.font }">
                    <el-option v-for="item in fontList" :key="item" :value="item" :style="{ fontFamily: item }">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="props.config.size" :min="12" :max="maxSize">
                </el-slider>
            </el-form-item>
            <el-form-item label="样式">
                <label>
                    <span style="margin: 0px 10px 0px 20px;">加粗</span>
                    <el-switch v-model="props.config.bold"></el-switch>
                </label>
                <label for="">
                    <span style="margin: 0px 10px 0px 20px;">斜体</span>
                    <el-switch v-model="props.config.italic"></el-switch>
                </label>
                <label for="">
                    <span style="margin: 0px 10px 0px 20px;">大写</span>
                    <el-switch v-model="props.config.letterUpperCase"></el-switch>
                </label>
            </el-form-item>
            <el-form-item label="文字描边" label-width="80px">
                <el-switch show-input v-model="props.config.stroke"></el-switch>
            </el-form-item>
            <el-form-item label="描边宽度" label-width="80px" v-show="props.config.stroke">
                <el-slider show-input v-model="props.config.lineWidth" :min="1" :max="100"></el-slider>
            </el-form-item>
            <el-form-item label="水平偏移" label-width="80px">
                <el-slider show-input v-model="props.config.x" :min="-5000" :max="5000"></el-slider>
            </el-form-item>
            <el-form-item label="垂直偏移" label-width="80px">
                <el-slider show-input v-model="props.config.y" :min="-5000" :max="5000"></el-slider>
                <el-button type="default" plain @click="resetPosition">重置位置</el-button>
            </el-form-item>
            <div v-if="showMore">
                <el-form-item label="对齐方式" label-width="80px">
                    <el-radio-group v-model="props.config.align">
                        <el-radio value="left">左对齐</el-radio>
                        <el-radio value="center">居中</el-radio>
                        <el-radio value="right">右对齐</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="垂直对齐" label-width="80px">
                    <el-radio-group v-model="props.config.verticalAlign">
                        <el-radio value="top">顶部对齐</el-radio>
                        <el-radio value="center">居中</el-radio>
                        <el-radio value="bottom">底部对齐</el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <slot></slot>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { preDefineColors, getSupportedFonts } from '../assets/tools';
import { inject } from 'vue';
import type { Img } from '../types';
import { convertExposureTime } from '../utils';
import HorizontalScroll from './HorizontalScroll.vue';
import { ElMessage } from 'element-plus';

const injectImg = inject<Img>('img');

const props = defineProps({
    config: {
        type: Object,
        required: true,
        default: () => ({
            name: String,
            show: Boolean,
            text: String,
            align: String,
            verticalAlign: String,
            color: String,
            size: Number,
            italic: Boolean,
            bold: Boolean,
            x: Number,
            y: Number,
            draggable: Boolean,
            letterUpperCase: Boolean,
            stroke: Boolean,
            lineWidth: Number
        })
    },
    showMore: { type: Boolean, default: true },
    maxSize: { type: Number, default: 1000 },
    showReplaceZ: { type: Boolean, default: false },
    labelWidth: { type: Number, default: 50 }
})

const fontList = getSupportedFonts()

const emits = defineEmits(['remove'])

const backup = JSON.parse(JSON.stringify(props.config));

function resetPosition() {
    props.config.x = backup.x;
    props.config.y = backup.y;

    ElMessage.success('已重置位置');
}
</script>

<style lang='less' scoped>
.container {
    padding: 10px;
    border: 1.5px solid gainsboro;
    border-radius: 5px;
    margin-top: 10px;
    animation: container 0.5s ease-in-out;

    &:hover {
        border-color: var(--el-color-primary);
    }

    @keyframes container {
        from {
            transform: translateX(50px);
            opacity: 0.5;
        }
    }
}
</style>