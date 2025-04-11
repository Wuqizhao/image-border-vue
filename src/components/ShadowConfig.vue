<template>
    <el-form label-width="80">
        <h3 style="margin-left: 10px;">阴影</h3>
        <el-form-item label="显示">
            <el-switch v-model="config.shadow.show"></el-switch>
        </el-form-item>
        <div v-show="config.shadow.show">
            <el-form-item label="颜色">
                <el-color-picker :predefine="preDefineColors" show-alpha
                    v-model="config.shadow.color"></el-color-picker>
            </el-form-item>
            <el-form-item label="大小">
                <el-slider show-input v-model="config.shadow.size" :min="1" :max="500"></el-slider>
            </el-form-item>
            <el-form-item label="水平偏移">
                <el-slider show-input v-model="config.shadow.x" :min="-1000" :max="1000"></el-slider>
            </el-form-item>
            <el-form-item label="垂直偏移">
                <el-slider show-input v-model="config.shadow.y" :min="-1000" :max="1000"></el-slider>
            </el-form-item>
            <el-form-item label="重置">
                <el-button size="small" @click="resetSize">重置大小</el-button>
                <el-button size="small" @click="resetOffset">重置偏移量</el-button>
            </el-form-item>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { preDefineColors } from '../assets/tools';
const config = defineProps({
    shadow: {
        type: Object,
        required: true,
        default: () => {
            return {
                show: Boolean,
                color: String,
                size: Number,
                x: Number,
                y: Number,
            }
        }
    }
})

const defaultConfig = JSON.parse(JSON.stringify(config.shadow));

function resetSize() {
    config.shadow.size = defaultConfig.size;
}
function resetOffset() {
    config.shadow.x = defaultConfig.x;
    config.shadow.y = defaultConfig.y;
}
</script>

<style lang='less' scoped></style>