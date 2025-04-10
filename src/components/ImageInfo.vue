<template>
    <el-form label-width="80px" size="small">
        <h3 style="padding-bottom: 10px;">基础信息</h3>
        <el-form-item label="文件名">
            <el-input v-model="img.fileName" disabled></el-input>
        </el-form-item>
        <el-form-item label="文件大小">
            <el-input v-model="img.size" disabled></el-input>
        </el-form-item>
        <el-form-item label="分辨率">
            <el-input :value="(img.exif?.ExifImageWidth || 0) + ' × ' + (img.exif?.ExifImageHeight || 0)"
                disabled></el-input>
        </el-form-item>
        <el-form-item label="文件类型">
            <el-input v-model="img.type" disabled>
            </el-input>
        </el-form-item>
        <el-form-item label="修改时间">
            <el-input v-model="img.time" disabled></el-input>
        </el-form-item>
        <el-form-item label="曝光补偿">
            <el-input v-model="img.exif.ExposureCompensation" disabled></el-input>
        </el-form-item>
        <el-form-item label="白平衡">
            <el-input v-model="img.exif.WhiteBalance" disabled></el-input>
        </el-form-item>
        <el-form-item label="版权" v-show="img.exif.Copyright">
            <el-input v-model="img.exif.Copyright" disabled></el-input>
        </el-form-item>
    </el-form>
</template>

<script setup lang="ts">
const { img } = defineProps({
    img: {
        type: Object,
        required: true,
    }
})
</script>

<style lang='less' scoped></style>