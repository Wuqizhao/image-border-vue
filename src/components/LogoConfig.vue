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
                <el-select filterable placeholder="选择logo" :disabled="!!config.logo?.url" style="width: 200px;"
                    v-model="config.logo.name">
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
            <el-form-item label="输入地址">
                <el-input v-model="config.logo.url" placeholder="输入logo地址（http(s)://...）" clearable></el-input>
            </el-form-item>
            <el-form-item label="宽度">
                <el-input-number v-model="config.logo.width" :min="0" :max="5000" :step="10"></el-input-number>
            </el-form-item>
            <el-form-item>
                <el-button size="small" @click="config.logo.width -= 100">- 100</el-button>
                <el-button style="margin-left: 10px;" size="small" @click="config.logo.width += 100">+
                    100</el-button>
                <el-button size="small" style="margin-left: 10px;"
                    @click="config.logo.height = config.logo.width">同步到高度</el-button>
            </el-form-item>
            <el-form-item label="高度">
                <el-input-number v-model="config.logo.height" :min="0" :max="5000" :step="10">
                </el-input-number>
            </el-form-item>
            <el-form-item label="圆形logo">
                <el-switch v-model="config.logo.circle"></el-switch>
            </el-form-item>
            <el-form-item label="垂直偏移" v-if="config.logo.verticalOffset !== undefined">
                <el-input-number v-model="config.logo.verticalOffset" :min="-10" :max="10" :step="0.01">
                </el-input-number>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { cameraBrands } from '../assets/tools';
import { computedAsync } from '@vueuse/core';
import { compressImage } from '../utils';

const config = defineProps({
    logo: {
        type: Object,
        required: true,
        default: () => (
            {
                show: Boolean,
                auto: Boolean,
                url: String,
                name: String,
                width: Number,
                height: Number,
                circle: Boolean,
                verticalOffset: Number,
            }
        )
    },
});


const enhancedCameraBrands = computedAsync(async () => {
    return await Promise.all(cameraBrands.map(async brand => {
        return {
            ...brand,
            thumbnail: await getBrandImageThumbnail(brand.logo)
        }
    }))
})

async function getBrandImageThumbnail(logo: string) {
    if (logo.startsWith('http')) return logo;
    const { pathname } = new URL(`../assets/logos/${logo}.png`, import.meta.url)
    return compressImage(pathname)
}

</script>

<style lang='less' scoped></style>