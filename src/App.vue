<template>
    <div id="canvasBox">
        <canvas id="imgCanvas"></canvas>
    </div>

    <el-button @click="selectFile" type="primary">选择文件</el-button>
    <el-button @click="draw">绘制</el-button>

    <div>
        <h1>配置</h1>
        <el-tabs v-model="activeName">
            <el-tab-pane label="基本信息" name="first">
                <el-form label-width="80px">
                    <el-form-item label="">
                        <el-button type="primary" disabled>下载</el-button>
                    </el-form-item>
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
                        <el-input-number v-model="config.watermark.paddings.tb" :min="0" :max="1000"></el-input-number>
                    </el-form-item>

                    <el-form-item label="操作">
                        <el-button type="danger" plain disabled>重置</el-button>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
            <el-tab-pane label="水印" name="sixth">
                <el-form label-width="80px">
                    <el-form-item label="选择样式">
                        <el-select v-model="curWatermarkIndex" disabled>
                            <el-option v-for="(item, index) in watermarks" :key="index" :label="item.name"
                                :value="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import Exifr from 'exifr'


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
    }
})
const config = reactive({
    paddings: {
        top: 10, // 图片上边距
        right: 10,
        left: 10,
        bottom: 0
    },
    watermark: {
        model: {
            show: true,
            color: '#000000',
            size: 20
        },
        params: {
            show: true,
            color: '#808080',
            size: 16
        },
        time: {
            show: true,
            color: '#808080',
            size: 12
        },
        paddings: {
            lr: 0,
            tb: 0
        }
    }
})
const watermarks = reactive([{
    name: '默认样式'
}, {
    name: '样式1'
}, {
    name: '样式2'
}])
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
        // 更新文件名
        img.fileName = file.name
        img.export.name = 'WM_' + file.name
        img.size = (file.size / 1024 / 1024).toFixed(2)+"MB"
        img.type = file.type
        img.time = formatDate(new Date(file.lastModified))

        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
            const _img = new Image()
            if (e.target === null) throw new Error('图片不存在...');
            _img.src = <string>e.target.result
            _img.onload = async () => {
                // 更新宽高
                img.width = _img.width
                img.height = _img.height

                // 使用exifr库读取exifs信息
                const exif = await Exifr.parse(file)
                // console.log('exif:', exif);

                // 获取比例
                const boxScale = img.width / img.height
                // 调整canvasBox容器的比例
                const canvasBox = document.getElementById('canvasBox') as HTMLDivElement
                const canvas = document.getElementById('imgCanvas') as HTMLCanvasElement
                const ctx = canvas.getContext('2d')
                if (ctx) {
                    // 计算canvas缩放比例
                    const maxSize = Math.max(img.width, img.height);
                    const isWidthMax = maxSize == img.width;
                    const scale = (isWidthMax ? img.width : img.height) / (isWidthMax ? 900 : 600);

                    // 修改画布大小
                    canvas.width = img.width / scale + config.paddings.left + config.paddings.right
                    canvas.height = img.height / scale + config.paddings.top + config.paddings.bottom
                    canvas.height += 0.1 * canvas.height

                    // 容器适配最终大小
                    // if (isWidthMax) {
                    //     canvasBox.style.width = `${900 / boxScale}px`
                    //     canvasBox.style.height = `600px`
                    // }
                    // else {
                    //     canvasBox.style.width = `${900 / boxScale}px`
                    //     canvasBox.style.height = '600px'
                    // }
                    canvasBox.style.width = `900px`
                    canvasBox.style.height = `${900 / boxScale}px`
                    // 设置背景颜色
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    // 绘制图片
                    ctx.drawImage(_img, 0 + config.paddings.left, 0 + config.paddings.top, img.width / scale, img.height / scale)

                    // 绘制型号
                    const modelConfig = config.watermark.model;
                    if (modelConfig.show) {
                        ctx.save(); // 保存当前绘图状态
                        ctx.font = `bold ${modelConfig.size}px Arial`;
                        ctx.fillStyle = modelConfig.color;
                        ctx.textAlign = 'left';
                        ctx.fillText(exif?.Model, config.paddings.left, canvas.height - (0.1 / 2) * canvas.height);
                        ctx.restore(); // 恢复之前的绘图状态
                    }

                    // 绘制曝光三要素和焦段参数
                    const paramsConfig = config.watermark.params;
                    if (paramsConfig.show) {
                        ctx.fillStyle = paramsConfig.color;
                        ctx.font = `${paramsConfig.size}px Arial`;
                        const params = `${convertExposureTime(exif?.ExposureTime)}s f/${exif?.FNumber} ISO ${exif?.ISO} ${exif?.FocalLength}mm`;
                        ctx.fillText(params, config.paddings.left, canvas.height - (0.1 / 2) * canvas.height + 20);
                    }


                    // 绘制拍摄时间
                    const timeConfig = config.watermark.time;
                    if (timeConfig.show) {
                        const shotTime = formatDate(new Date(exif?.DateTimeOriginal));
                        ctx.textAlign = 'right';
                        ctx.fillStyle = timeConfig.color;
                        ctx.font = `${timeConfig.size}px Arial`;
                        ctx.fillText(shotTime, canvas.width - config.paddings.right, canvas.height - (0.1 / 2) * canvas.height);
                    }
                }
            }
        }
    }
}


// 转换曝光时间的函数
const convertExposureTime = (exposureTime: number) => {
    if (exposureTime < 1) {
        return `1/${Math.round((1 / exposureTime) * 10) / 10}`;
    } else {
        return `${exposureTime}`;
    }
}

// 把Date转换成"YYYY-MM-DD HH:mm:ss"格式
const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

const draw = () => {
    const canvas = document.getElementById('imgCanvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    if (ctx) {

    }
}
</script>

<style lang='less' scoped>
#canvasBox {
    width: 900px;
    height: 600px;
    overflow: auto;
    border: 3px solid gainsboro;
    box-sizing: border-box;

    #imgCanvas {
        border: 1px solid orange;
    }
}
</style>