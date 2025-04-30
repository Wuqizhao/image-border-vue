<template>
    <div class="container">
        <h3 style="display: flex;justify-content: space-between;align-items: center;padding:10px;">
            <el-divider content-position="left">{{ props.config.title }}</el-divider>
            <el-button type="danger" :text="true" plain @click="emits('remove', props.config.title)">删除</el-button>
        </h3>
        <el-form label-width="80px">
            <el-form-item label="显示">
                <el-switch v-model="props.config.show"></el-switch>
            </el-form-item>
            <el-form-item label="宽度">
                <el-slider show-input v-model="props.config.width" :min="1" :max="5000"
                    @change="syncHeight"></el-slider>
            </el-form-item>
            <el-form-item label="高度">
                <el-slider show-input v-model="props.config.height" :min="1" :max="5000"></el-slider>
                <el-checkbox v-model="sync">高度和宽度同步</el-checkbox>
            </el-form-item>
            <el-form-item label="圆形裁切">
                <el-switch v-model="props.config.circle"></el-switch>
            </el-form-item>
            <el-form-item label="图片地址">
                <el-input v-model="props.config.url" placeholder="请输入图片地址" clearable>
                    <template #append>
                        <el-button type="primary" plain @click="selectLocalImage">本地选择</el-button>
                    </template>
                </el-input>

            </el-form-item>
            <el-form-item label="选择logo">
                <el-select v-model="props.config.name" :disabled="!!props.config.url.length">
                    <el-option v-for="item in enhancedCameraBrands" :key="item.name" :value="item.logo">
                        <div style="display: flex;align-items: center;gap: 10px;">
                            <img :width="24" :height="24" :src="item.thumbnail"
                                :style="{ background: item.logo.indexOf('white') >= 0 ? 'rgba(0,0,0,0.08)' : '' }" />
                            <span>{{ item.name }}</span>
                        </div>
                    </el-option>
                </el-select>
                <p class="tips" v-show="props.config.url">您已指定url地址，选择logo被禁用！</p>
            </el-form-item>
            <el-form-item label="水平偏移">
                <el-slider show-input v-model="props.config.horizontalOffset" :min="-1000" :max="10000"></el-slider>
            </el-form-item>
            <el-form-item label="垂直偏移">
                <el-slider show-input v-model="props.config.verticalOffset" :min="-1000" :max="5000"></el-slider>
            </el-form-item>
            <el-form-item label="不透明度">
                <el-slider show-input v-model="props.config.alpha" :min="0" :max="1" :step="0.01"
                    @dblclick="props.config.alpha = 1"></el-slider>
            </el-form-item>
            <el-form-item label="旋转角度">
                <el-slider show-input v-model="props.config.rotate" :min="-180" :max="180" :step="1"
                    @dblclick="props.config.rotate = 0"></el-slider>
            </el-form-item>
            <el-form-item label="混合模式">
                <el-select v-model="props.config.blendMode">
                    <el-option v-for="item in blendMode" :key="item.mode" :value="item.mode">
                        <b>{{ item.desc }}</b>
                        <span style="float: right;">{{ item.mode }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core';
import { cameraBrands } from '../assets/tools';
import { getImageSrc } from '../utils';
import { ref } from 'vue';
import { blendMode } from '../utils';

const props = defineProps({
    config: {
        type: Object,
        required: true,
        default: () => ({
            title: String,
            name: String,
            show: Boolean,
            circle: Boolean,
            url: String,
            width: Number,
            height: Number,
            verticalOffset: Number,
            horizontalOffset: Number
        })
    },
})

const sync = ref(true);

const emits = defineEmits(["remove"]);

const enhancedCameraBrands = computedAsync(async () => {
    return await Promise.all(cameraBrands.map(async brand => {
        return {
            ...brand,
            thumbnail: getImageSrc(brand.logo)
        }
    }))
})

function syncHeight() {
    if (sync.value) {
        props.config.height = props.config.width;
    }
}

function selectLocalImage() {
    // 选择文件
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            props.config.url = getImageSrc(file);
        }
    }
    input.click();
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
            transform: translateY(50px);
            opacity: 0.5;
        }
    }
}
</style>