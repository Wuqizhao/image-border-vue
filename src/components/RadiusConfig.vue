<template>
    <div v-if="config.radius.enable">
        <h3>圆角</h3>
        <el-form label-width="70px" style="margin-top: 1rem;">
            <el-form-item label="显示">
                <el-switch v-model="config.radius.show"></el-switch>
            </el-form-item>

            <div v-show="config.radius.show">
                <el-form-item label="统一半径">
                    <el-switch v-model="config.radius.uniform"></el-switch>
                </el-form-item>
                <el-form-item label="半径" v-if="config.radius.uniform">
                    <el-slider show-input v-model="config.radius.size" :min="0" :max="2000" :step="10"></el-slider>
                </el-form-item>
                <div v-show="!config.radius.uniform">
                    <el-form-item label="左上">
                        <el-slider show-input v-model="config.radius.lt" :min="0" :max="2000" :step="10"></el-slider>
                    </el-form-item>
                    <el-form-item label="右上">
                        <el-slider show-input v-model="config.radius.rt" :min="0" :max="2000" :step="10"></el-slider>
                    </el-form-item>
                    <el-form-item label="左下">
                        <el-slider show-input v-model="config.radius.lb" :min="0" :max="2000" :step="10"></el-slider>
                    </el-form-item>
                    <el-form-item label="右下">
                        <el-slider show-input v-model="config.radius.rb" :min="0" :max="2000" :step="10"></el-slider>
                    </el-form-item>
                </div>
            </div>
        </el-form>
    </div>
</template>

<script setup lang="ts">
const config = defineProps({
    radius: {
        type: Object,
        required: true,
        default: () => {
            return {
                show: Boolean,
                position: Array,
                size: Number,
                lt: Number,
                rt: Number,
                lb: Number,
                rb: Number,
                uniform: Boolean
            }
        }
    }
})
</script>