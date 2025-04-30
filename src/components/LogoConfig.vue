<template>
    <el-form label-width="80">
        <el-form-item label="显示">
            <el-switch v-model="config.logo.show"></el-switch>
        </el-form-item>
        <div v-show="config.logo.show">
            <el-form-item label="自动匹配">
                <el-switch v-model="config.logo.auto"></el-switch>
                <p class="tips">支持列表：尼康、佳能、索尼、大疆、富士、徕卡、苹果、一加、vivo、小米~</p>
            </el-form-item>
            <el-form-item label="手动选择" v-if="!config.logo.auto">
                <el-select :filterable="!isMobile()" placeholder="选择logo" :disabled="!!config.logo?.url"
                    style="width: 200px;" v-model="config.logo.name">
                    <el-option v-for="item in enhancedCameraBrands" :label="item.name" :key="item.name"
                        :value="item.logo">
                        <div style="display: flex;align-items: center;gap: 10px;">
                            <img :width="24" :height="24" :src="item.thumbnail"
                                :style="{ background: item.logo.indexOf('white') >= 0 ? 'rgba(0,0,0,0.08)' : '' }" />
                            <span>{{ item.name }}</span>
                        </div>
                    </el-option>
                </el-select>
                <p class="tips" v-if="config.logo.url">您已输入logo地址，选择被禁用</p>
            </el-form-item>
            <el-form-item label="宽度">
                <el-slider show-input v-model="config.logo.width" :min="0" :max="5000" :step="10"></el-slider>
            </el-form-item>
            <el-form-item>
                <el-button size="small" @click="config.logo.width -= 100">- 100</el-button>
                <el-button style="margin-left: 10px;" size="small" @click="config.logo.width += 100">+
                    100</el-button>
                <el-button size="small" style="margin-left: 10px;"
                    @click="config.logo.height = config.logo.width">同步到高度</el-button>
            </el-form-item>
            <el-form-item label="高度">
                <el-slider show-input v-model="config.logo.height" :min="0" :max="5000" :step="10">
                </el-slider>
            </el-form-item>
            <el-form-item label="圆形logo">
                <el-switch v-model="config.logo.circle"></el-switch>
            </el-form-item>
            <el-form-item label="垂直偏移" v-if="config.logo.verticalOffset !== undefined">
                <el-slider show-input v-model="config.logo.verticalOffset" :min="-20" :max="20" :step="0.01" @dblclick="config.logo.verticalOffset = defaultVerticalOffset">
                </el-slider>
                <p class="tips">默认：{{ defaultVerticalOffset }}
                    <el-button size="small" @click="config.logo.verticalOffset = defaultVerticalOffset"
                        style="margin-left: 10px;">恢复默认</el-button>
                </p>
            </el-form-item>
            <el-form-item label="输入地址">
                <el-input v-model="config.logo.url" placeholder="输入logo地址（http(s)://...）" clearable>
                    <template #append>
                        <el-button size="small" @click="selectLocalImage">选择本地</el-button>
                    </template>
                </el-input>
                <p class="tips">⚠ 使用自定义的LOGO链接可能导致无法保存图片！建议下载后本地选择。</p>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { cameraBrands } from '../assets/tools';
import { computedAsync } from '@vueuse/core';
import { getImageSrc, isMobile } from '../utils';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';

const { config } = storeToRefs(useStore());

const defaultVerticalOffset = config.value.logo.verticalOffset || 0;

const enhancedCameraBrands = computedAsync(async () => {
    return await Promise.all(cameraBrands.map(async brand => {
        return {
            ...brand,
            thumbnail: getImageSrc(brand.logo)
        }
    }))
})

function selectLocalImage() {
    // 选择文件
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            config.value.logo.url = getImageSrc(file);
        }
    }
    input.click();
}
</script>