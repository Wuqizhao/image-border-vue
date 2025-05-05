<template>
    <el-form label-width="70px">
        <!-- <h3 style="margin-bottom: 1rem;">背景</h3> -->
        <el-form-item label="类型">
            <el-radio-group v-model="config.blur.type">
                <el-radio label="纯色" value="color"></el-radio>
                <el-radio label="模糊背景" value="blur"></el-radio>
                <el-radio label="线性渐变" value="gradient"></el-radio>
            </el-radio-group>
        </el-form-item>

        <el-form-item label="颜色" v-if="config.blur.type === 'color'">
            <el-color-picker :predefine="preDefineColors" show-alpha
                v-model="config.watermark.bgColor"></el-color-picker>
        </el-form-item>
        <el-form-item label="模糊量" v-if="config.blur.type === 'blur'">
            <el-slider show-input v-model="config.blur.size" :min="0" :max="2000" :step="10"></el-slider>
        </el-form-item>


        <div v-if="config.blur.type === 'gradient'">
            <el-form-item label="角度" v-if="config.blur.gradient">
                <el-slider show-input v-model="config.blur.gradient.angle" :min="-180" :max="180" :step="1"
                    @dblclick="config.blur.gradient.angle = 0"></el-slider>
            </el-form-item>

            <el-form-item label="渐变色">
                <div>
                    <el-tag closable v-for="(color, index) in config.blur?.gradient?.colors" :key="color"
                        @close="removeColor(index)" :style="{ 'background-color': color }"
                        style="margin-right: 10px;color: #000;">
                        {{ color }}
                    </el-tag>

                    <div style="display: flex;align-items: center;gap: 5px;">
                        <label for="">
                            <span style="color: gray;">添加渐变色：</span>
                            <el-color-picker v-model="tempColor" :predefine="preDefineColors" size="small"
                                @change="addColors" show-alpha /></label>
                    </div>
                </div>
            </el-form-item>
        </div>

        <el-form-item label="水印背景">
            <el-color-picker v-model="config.watermark.bg" show-alpha></el-color-picker>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores';
import { ref } from 'vue';
import { ElMessage } from 'element-plus';

const { config } = storeToRefs(useStore());

const tempColor = ref('#000000');


const removeColor = (index: number) => {
    if (!config.value.blur?.gradient?.colors) {
        config.value.blur.gradient = { angle: 0, colors: [] };
    }
    const colors = config.value.blur.gradient?.colors;
    if (colors.length <= 2) {
        ElMessage.error('至少保留两个颜色!');
        return;
    }
    colors?.splice(index, 1);
    config.value.blur.gradient.colors = colors;
}

const addColors = () => {
    if (!config.value.blur?.gradient?.colors) {
        config.value.blur.gradient = { angle: 0, colors: [] };
    }

    if (!tempColor.value) {
        return;
    }

    config.value.blur.gradient.colors?.push(tempColor.value);
}
</script>

<style lang='less' scoped></style>