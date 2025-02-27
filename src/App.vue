<template>
    <div id="canvasBox">
        <canvas id="imgCanvas"></canvas>
    </div>

    <div>
        <h1>配置</h1>
        <div class="btns">
            <el-button @click="selectFile" type="primary">选择文件</el-button>
            <el-button @click="config.draw(curFile as File, img)">绘制</el-button>
            <el-button type="success" @click="download(img.export.name)">下载</el-button>
            <el-button @click="print">打印配置</el-button>
        </div>
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <el-form label-width="80px">
                    <el-form-item label="文件名">
                        <el-input v-model="img.fileName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="文件大小">
                        <el-input v-model="img.size" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="文件类型">
                        <el-input v-model="img.type" disabled>
                        </el-input>
                    </el-form-item>
                    <el-form-item label="修改时间">
                        <el-input v-model="img.time" disabled></el-input>
                    </el-form-item>
                    <h3>导出配置</h3>
                    <el-form-item label="文件名">
                        <el-input v-model="img.export.name"></el-input>
                    </el-form-item>
                    <el-form-item label="导出质量">
                        <el-slider v-model="img.export.quality" :min="0.01" :max="1" :step="0.01" show-tooltip
                            show-input disabled></el-slider>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="型号" name="second">
                <el-form label-width="80px">
                    <el-form-item label="显示">
                        <el-switch v-model="config.watermark.model.show" :active-value="true"
                            :inactive-value="false"></el-switch>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.model.color" />
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-input-number v-model="config.watermark.model.size" :min="12" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="操作">
                        <el-button type="danger" plain disabled>重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="参数" name="third">
                <el-form label-width="80px">
                    <el-form-item label="显示">
                        <el-switch v-model="config.watermark.params.show" :active-value="true"
                            :inactive-value="false"></el-switch>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.params.color" />
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-input-number v-model="config.watermark.params.size" :min="12" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="操作">
                        <el-button type="danger" plain disabled>重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="时间" name="fourth">
                <el-form label-width="80px">
                    <el-form-item label="显示">
                        <el-switch v-model="config.watermark.time.show" :active-value="true"
                            :inactive-value="false"></el-switch>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.time.color" />
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-input-number v-model="config.watermark.time.size" :min="12" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="操作">
                        <el-button type="danger" plain disabled>重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="边距" name="firth">
                <el-form label-width="80px">
                    <h3>图片边距</h3>
                    <el-form-item label="上边距">
                        <el-input-number v-model="config.paddings.top" :min="0" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="下边距">
                        <el-input-number v-model="config.paddings.bottom" :min="0" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="右边距">
                        <el-input-number v-model="config.paddings.right" :min="0" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="左边距">
                        <el-input-number v-model="config.paddings.left" :min="0" :max="1000"></el-input-number>
                    </el-form-item>
                    <h3>水印边距</h3>
                    <el-form-item label="左右边距">
                        <el-input-number v-model="config.watermark.paddings.lr" :min="0" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="上下边距">
                        <el-input-number v-model="config.watermark.paddings.tb" :min="0" :max="1000"
                            disabled></el-input-number>
                    </el-form-item>

                    <el-form-item label="操作">
                        <el-button type="danger" plain disabled>重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane :label="`水印${curWatermarkIndex}`" name="sixth">
                <el-form label-width="80px">
                    <el-form-item label="选择样式">
                        <el-select v-model="curWatermarkIndex">
                            <el-option v-for="(item, index) in watermarks" :key="index" :label="item.name"
                                :value="index"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item lable="背景颜色">
                        <el-color-picker v-model="config.watermark.bgColor"></el-color-picker>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
// import Exifr from 'exifr'
import { print, download } from './assets/tools'
import defaultWaterMark from './configs/default'
import { ElNotification } from 'element-plus'

const img = reactive({
    width: 0,
    height: 0,
    fileName: '',
    size: '',
    type: '',
    time: '',
    export: {
        name: '',
        quality: 1,
    },
    exif: {}
})
const curFile = ref<File | null>(null)
let config = reactive(defaultWaterMark);


const watermarks = reactive([
    {
        index: 0,
        name: '默认样式',
        config: 'default'
    },
    {
        index: 1,
        name: '样式1',
        config: 'watermark1'
    },
    {
        index: 2,
        name: '样式2',
        config: 'watermark2'
    }
])
const curWatermarkIndex = ref<number>(0)
const activeName = ref<string>('first')


const selectFile = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.click()
    input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target === null || !target.files) throw new Error('图片不存在...');
        const file = target.files[0];
        curFile.value = file;

        config.draw(file, img);
    }
}

// 监听
watch(curWatermarkIndex, (val) => {
    // 获取对应的水印
    const watermark = watermarks.filter(item => item.index == val)
    console.log(val, watermark[0].config);

    // 导入
    import('./configs/' + watermark[0].config).then(res => {
        config = reactive(res.default);
        console.log('config', config);

        if (curFile.value === null) {
            ElNotification.error({
                title: '错误',
                message: '请先选择图片'
            })
            return;
        }
        config.draw(curFile.value, img);
    }).catch(err => {
        ElNotification.error({
            title: '导入水印配置错误',
            message: err.message
        })
    })
})
</script>

<style lang='less' scoped>
#canvasBox {
    width: 900px;
    height: 600px;
    overflow: auto;
    border: 3px solid gainsboro;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    // align-items: center;

    #imgCanvas {
        border: 1px solid orange;
    }

    .btns {
        display: flex;
        align-items: center;
        padding: 10px;
        gap: 10px;
    }
}
</style>