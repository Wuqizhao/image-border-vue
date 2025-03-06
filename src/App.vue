<template>
    <div id="canvasBox">
        <canvas id="imgCanvas"></canvas>
    </div>

    <div>
        <h2>配置</h2>
        <div class="btns">
            <el-button @click="selectFile" type="primary" plain>选择文件</el-button>
            <el-button @click="config.draw(curFile as File, img, config)" :disabled="!curFile"
                type="success">绘制</el-button>
            <el-button @click="print">打印配置</el-button>
            <el-button type="success" plain @click="download(img.export.name)">下载图片</el-button>
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
            <el-tab-pane :label="`水印`" name="sixth">
                <div class="config-title">
                    <h3>样式</h3>
                </div>
                <el-form label-width="80px">
                    <el-form-item label="选择样式">
                        <el-select v-model="curWatermarkIndex" style="max-width: 200px;" placeholder="请选择水印样式">
                            <el-option v-for="(item, index) in watermarks" :key="index" :label="item.name"
                                :value="index"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="config-title">
                    <h3>型号</h3>
                    <el-switch v-model="config.watermark.model.show" :active-value="true"
                        :inactive-value="false"></el-switch>
                </div>
                <el-form label-width="80px" v-if="config.watermark.model.show">
                    <el-form-item label="文本">
                        <el-input placeholder="暂不支持修改" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.model.color"
                            :disabled="!config.watermark.model.show" />
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-input-number v-model="config.watermark.model.size" :min="12" :max="1000"
                            :disabled="!config.watermark.model.show"></el-input-number>
                    </el-form-item>
                </el-form>
                <div class="config-title">
                    <h3>参数</h3>
                    <el-switch v-model="config.watermark.params.show" :active-value="true"
                        :inactive-value="false"></el-switch>
                </div>
                <el-form label-width="80px" v-if="config.watermark.params.show">
                    <el-form-item label="文本">
                        <el-input placeholder="暂不支持修改" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.params.color" />
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-input-number v-model="config.watermark.params.size" :min="12" :max="1000"></el-input-number>
                    </el-form-item>
                    <el-form-item label="字母大写">
                        <el-switch disabled :active-value="true" :inactive-value="false"></el-switch>
                    </el-form-item>
                </el-form>
                <div class="config-title">
                    <h3>时间</h3>
                    <el-switch v-model="config.watermark.time.show" :active-value="true"
                        :inactive-value="false"></el-switch>
                </div>
                <el-form label-width="80px" v-if="config.watermark.time.show">
                    <el-form-item label="文本">
                        <el-input placeholder="暂不支持修改" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.time.color" />
                    </el-form-item>
                    <el-form-item label="字号">
                        <el-input-number v-model="config.watermark.time.size" :min="12" :max="1000"></el-input-number>
                    </el-form-item>
                </el-form>
                <div class="config-title">
                    <h3>背景</h3>
                </div>
                <el-form label-width="80px">
                    <el-form-item label="颜色">
                        <el-color-picker v-model="config.watermark.bgColor"></el-color-picker>
                    </el-form-item>
                    <el-form-item label="模糊">
                        <el-switch v-model="config.radius.enable" disabled></el-switch>
                    </el-form-item>
                    <el-form-item label="模糊量">
                        <el-input-number v-model="config.radius.size" :min="0" :max="1000" disabled></el-input-number>
                    </el-form-item>
                </el-form>
                <div class="config-title">
                    <h3>圆角</h3>
                    <el-switch v-model="config.radius.enable"></el-switch>
                </div>
                <el-form label-width="80px" v-if="config.radius.enable">
                    <el-form-item label="半径">
                        <el-input-number v-model="config.radius.size" :min="0" :max="1000"
                            :disabled="!config.radius.enable"></el-input-number>
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
                </el-form>
            </el-tab-pane>
        </el-tabs>

        <el-button type="danger" plain @click="resetWatermark">重置样式</el-button>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { print, download, deepClone } from './assets/tools'
import defaultWaterMark from './configs/default'
import { ElNotification } from 'element-plus'
import type { Config } from './types'

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
const config = ref<Config>(defaultWaterMark);

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
    },
    {
        index: 3,
        name: '样式3',
        config: 'watermark3'
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

        config.value.draw(file, img, config.value);
    }
}

const resetWatermark = () => {
    importConfig(curWatermarkIndex.value);
    ElNotification.success({
        title: '成功',
        message: '重置成功'
    })
}

// 监听
watch(curWatermarkIndex, (val) => {
    importConfig(val)
}, {
    immediate: true
})

function importConfig(val: number): void {
    // 获取对应的水印
    const watermark = watermarks.filter(item => item.index == val)
    console.log(val, watermark[0].config);

    // 导入
    let configPromise = null;
    switch (watermark[0].config) {
        case 'watermark1':
            configPromise = import('./configs/watermark1');
            break;
        case 'watermark2':
            configPromise = import('./configs/watermark2');
            break;
        case 'watermark3':
            configPromise = import('./configs/watermark3');
            break;
        default: configPromise = import('./configs/default');
            break;
    }
    configPromise.then(res => {
        config.value = deepClone(<Config>res.default);
        console.log('config', config);

        if (curFile.value === null) {
            ElNotification.error({
                title: '绘制失败',
                message: '请先选择图片'
            })
            return;
        }
        config.value.draw(curFile.value, img, config.value);
        ElNotification.success({
            title: '绘制成功',
            message: '请点击下载保存图片'
        })
    }).catch(err => {
        ElNotification.error({
            title: '导入水印配置错误',
            message: err.message
        })
    })
}
</script>

<style lang='less' scoped>
#canvasBox {
    width: 100%;
    height: 600px;
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    justify-content: space-around;

    #imgCanvas {
        border: 1px solid gainsboro;
    }

    .btns {
        display: flex;
        align-items: center;
        padding: 10px;
        gap: 10px;
    }
}

.config-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
}
</style>