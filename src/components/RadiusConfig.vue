<template>
    <div v-if="config.radius.enable">
        <h3 style="margin-left: 10px;">圆角</h3>
        <el-form label-width="80px">
            <el-form-item label="显示">
                <el-switch v-model="config.radius.show"></el-switch>
            </el-form-item>
            <el-form-item label="位置" style="display: none;">
                <el-checkbox-group v-model="config.radius.position">
                    <el-checkbox label="top" value="lt">左上</el-checkbox>
                    <el-checkbox label="right" value="rt">右上</el-checkbox>
                    <el-checkbox label="bottom" value="lb">左下</el-checkbox>
                    <el-checkbox label="left" value="rb">右下</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="半径">
                <el-input-number v-model="config.radius.size" :min="0" :max="2000" :step="10"
                    :disabled="!config.radius.show"></el-input-number>
            </el-form-item>
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
            }
        }
    }
})
</script>

<style lang='less' scoped></style>