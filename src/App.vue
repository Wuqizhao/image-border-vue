<template>
    <div class="box">
        <div id="canvasBox" @dragover.prevent @dragenter.prevent @drop="onDrop">
            <canvas id="imgCanvas" v-if="curFile"></canvas>
            <el-empty description="请先选择图片~" v-else @click="selectFile"></el-empty>
        </div>

        <div class="config-box">
            <div class="btns">
                <el-button @click="selectFile" type="primary" plain>选择图片</el-button>
                <el-button @click="clearFileList" type="danger" plain>清 空</el-button>
                <el-button @click="handleDraw" :disabled="!curFile" type="success">绘 制</el-button>
                <el-button type="success" plain @click="download(img.export.name)">保 存</el-button>
            </div>
            <div class="tabs-container">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="基本信息" name="info">

                        <div class="img-list" v-if="fileList.length">
                            <el-image v-for="(item, index) in enhancedFileList" :key="item.name" fit="cover"
                                :src="item.url" @click="changeCurFile(fileList[index])"
                                :data-index="index + 1"></el-image>
                        </div>
                        <h3>样式</h3>
                        <el-form label-width="80px">
                            <el-form-item label="选择样式">
                                <el-select v-model="curWatermarkIndex" style="max-width: 200px;" placeholder="请选择水印样式">
                                    <el-option v-for="(item, index) in watermarks" :key="index" :label="item.name"
                                        :value="index"></el-option>
                                </el-select>

                                <el-button type="danger" plain @click="resetWatermark"
                                    style="margin-left: 10px;">重置</el-button>
                            </el-form-item>
                            <el-form-item label="基础高度">
                                <el-input-number :min="0" :max="1" :step="0.01"
                                    v-model="config.watermark.height"></el-input-number>
                                <p class="tips">图片高度的倍数，影响底部水印绘制范围的大小。</p>
                            </el-form-item>
                            <el-form-item label="字体">
                                <el-select v-model="config.font" clearable>
                                    <el-option v-for="(item, index) in getSupportedFonts()" :key="index" :label="item"
                                        :value="item" :style="{ fontFamily: item }"></el-option>
                                </el-select>
                                <p class="tips">仅支持部分字体！</p>
                            </el-form-item>
                        </el-form>
                        <el-form label-width="80px" v-if="curFile">
                            <h3>文件</h3>
                            <el-form-item label="文件名">
                                <el-input v-model="img.fileName" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="文件大小">
                                <el-input v-model="img.size" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="分辨率">
                                <el-input
                                    :value="(img.exif?.ExifImageWidth || 0) + ' × ' + (img.exif?.ExifImageHeight || 0)"
                                    disabled></el-input>
                            </el-form-item>
                            <el-form-item label="文件类型">
                                <el-input v-model="img.type" disabled>
                                </el-input>
                            </el-form-item>
                            <el-form-item label="修改时间">
                                <el-input v-model="img.time" disabled></el-input>
                            </el-form-item>
                            <div>
                                <h3>开发</h3>
                                <el-form-item label="辅助线" v-if="isDev">
                                    <b style="margin-left: 20px;">垂直中心线：</b>
                                    <el-switch v-model="auxiliaryLines.verticalCenter"></el-switch>
                                    <b style="margin-left: 20px;">水印范围：</b>
                                    <el-switch v-model="auxiliaryLines.watermarkRange"></el-switch>
                                    <b style="margin-left: 20px;">水印水平中心线：</b>
                                    <el-switch v-model="auxiliaryLines.watermarkHorizontalCenter"></el-switch>
                                    <el-button @click="print(config, img)" style="margin-left: 10px;">打印配置</el-button>
                                </el-form-item>
                            </div>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="水印" name="watermark">
                        <el-collapse accordion>
                            <el-collapse-item v-if="config.watermark.model.enable">
                                <template #title>
                                    <h3>型号</h3>
                                </template>
                                <el-form label-width="80px">
                                    <el-form-item label="显示">
                                        <el-switch v-model="config.watermark.model.show"></el-switch>
                                    </el-form-item>
                                    <div v-show="config.watermark.model.show">
                                        <el-form-item label="文本">
                                            <el-input placeholder="留空则自动读取" v-model="img.modelText"
                                                clearable></el-input>
                                            <p class="tips">需要手动点击绘制生效</p>
                                        </el-form-item>
                                        <el-form-item label="颜色">
                                            <el-color-picker :predefine="preDefineColors" show-alpha
                                                v-model="config.watermark.model.color"
                                                :disabled="!config.watermark.model.show" />
                                            <el-button v-if="config.watermark.params.enable" style="margin-left: 10px;"
                                                size="small"
                                                @click="config.watermark.params.color = config.watermark.model.color">同步参数颜色</el-button>
                                            <el-button v-if="config.watermark.time.enable" size="small"
                                                @click="config.watermark.time.color = config.watermark.model.color">同步时间颜色</el-button>
                                        </el-form-item>
                                        <el-form-item label="大小">
                                            <el-input-number v-model="config.watermark.model.size" :min="12" :max="1000"
                                                :disabled="!config.watermark.model.show"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="加粗">
                                            <el-switch v-model="config.watermark.model.bold"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="斜体文字">
                                            <el-switch v-model="config.watermark.model.italic"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="替换Z为ℤ">
                                            <el-switch v-model="config.watermark.model.replaceZ"></el-switch>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.params.enable">
                                <template #title>
                                    <h3>参数</h3>
                                </template>
                                <el-form label-width="80px">
                                    <el-form-item label="显示">
                                        <el-switch v-model="config.watermark.params.show"></el-switch>
                                    </el-form-item>
                                    <div v-show="config.watermark.params.show">
                                        <el-form-item label="文本">
                                            <el-input placeholder="留空则自动读取" v-model="img.paramsText"
                                                clearable></el-input>
                                            <p class="tips">需要手动点击绘制生效</p>
                                        </el-form-item>
                                        <el-form-item label="颜色">
                                            <el-color-picker :predefine="preDefineColors" show-alpha
                                                v-model="config.watermark.params.color" />
                                            <el-button v-if="config.divider.enable" style="margin-left: 10px;"
                                                size="small"
                                                @click="config.divider.color = config.watermark.params.color">同步分割线颜色</el-button>
                                        </el-form-item>
                                        <el-form-item label="大小">
                                            <el-input-number v-model="config.watermark.params.size" :min="12"
                                                :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="字母大写">
                                            <el-switch v-model="config.watermark.params.letterUpperCase"
                                                :active-value="true" :inactive-value="false"></el-switch>
                                        </el-form-item>
                                        <el-form-item label="等效焦距">
                                            <el-switch v-model="config.watermark.params.useEquivalentFocalLength"
                                                :active-value="true" :inactive-value="false"></el-switch>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.time.enable">
                                <template #title>
                                    <h3>时间</h3>
                                </template>
                                <el-form label-width="80px">
                                    <el-form-item label="显示">
                                        <el-switch v-model="config.watermark.time.show" :active-value="true"
                                            :inactive-value="false"></el-switch>
                                    </el-form-item>
                                    <div v-show="config.watermark.time.show">
                                        <el-form-item label="文本">
                                            <el-input placeholder="留空则自动读取" disabled v-model="img.timeText"
                                                clearable></el-input>
                                            <p class="tips">需要手动点击绘制生效</p>
                                        </el-form-item>
                                        <el-form-item label="颜色">
                                            <el-color-picker :predefine="preDefineColors" show-alpha
                                                v-model="config.watermark.time.color" />
                                        </el-form-item>
                                        <el-form-item label="大小">
                                            <el-input-number v-model="config.watermark.time.size" :min="12"
                                                :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="时间格式">
                                            <el-input placeholder="默认YYYY-MM-DD HH:mm:ss"
                                                v-model="config.watermark.time.format"></el-input>
                                            <p class="tips">需要清空时间文本方可生效</p>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item v-if="config.divider.enable">
                                <template #title>
                                    <h3>分割线</h3>
                                </template>
                                <el-form label-width="80">
                                    <el-form-item label="显示">
                                        <el-switch v-model="config.divider.show"></el-switch>
                                    </el-form-item>
                                    <div v-show="config.divider.show">
                                        <el-form-item label="颜色">
                                            <el-color-picker :predefine="preDefineColors" show-alpha
                                                v-model="config.divider.color"></el-color-picker>
                                        </el-form-item>
                                        <el-form-item label="宽度">
                                            <el-input-number v-model="config.divider.width" :min="1"
                                                :max="1000"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="长度缩放">
                                            <el-input-number v-model="config.divider.scale" :min="0" :max="50"
                                                :step="0.01"></el-input-number>
                                        </el-form-item>
                                        <el-form-item label="间隔缩放">
                                            <el-input-number v-model="config.divider.margin" :min="0" :max="50"
                                                :step="0.01"></el-input-number>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item v-if="config.logo.enable">
                                <template #title>
                                    <h3>图标</h3>
                                </template>
                                <el-form label-width="80">
                                    <el-form-item label="显示">
                                        <el-switch v-model="config.logo.show"></el-switch>
                                    </el-form-item>
                                    <div v-show="config.logo.show">
                                        <el-form-item label="自动匹配">
                                            <el-switch v-model="config.logo.auto"></el-switch>
                                            <p class="tips">支持列表：尼康、佳能、苹果、一加、vivo、小米~</p>
                                        </el-form-item>
                                        <el-form-item label="手动选择" v-if="!config.logo.auto">
                                            <el-select placeholder="选择logo" style="width: 200px;"
                                                v-model="config.logo.name">
                                                <el-option v-for="item in cameraBrands" :label="item.name"
                                                    :key="item.name" :value="item.logo">
                                                    <div style="display: flex;align-items: center;gap: 6px;">
                                                        <img :width="18" :height="18"
                                                            :src="getBrandImageUrl(item.logo)" />
                                                        <span>{{ item.name }}</span>
                                                    </div>
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                        <el-form-item label="宽度">
                                            <el-input-number v-model="config.logo.width" :min="0" :max="5000"
                                                :step="10"></el-input-number>
                                        </el-form-item>
                                        <el-form-item>
                                            <el-button size="small" @click="config.logo.width -= 100">- 100</el-button>
                                            <el-button style="margin-left: 10px;" size="small"
                                                @click="config.logo.width += 100">+ 100</el-button>
                                            <el-button size="small" style="margin-left: 10px;"
                                                @click="config.logo.height = config.logo.width">同步到高度</el-button>
                                        </el-form-item>
                                        <el-form-item label="高度">
                                            <el-input-number v-model="config.logo.height" :min="0" :max="5000"
                                                :step="10">
                                            </el-input-number>
                                        </el-form-item>
                                        <el-form-item label="垂直偏移" v-if="config.logo.verticalOffset !== undefined">
                                            <el-input-number v-model="config.logo.verticalOffset" :min="-10" :max="10"
                                                :step="0.01">
                                            </el-input-number>
                                        </el-form-item>
                                    </div>
                                </el-form>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                    <el-tab-pane label="图片" name="picture">
                        <div v-if="config.radius.enable">
                            <h3 style="margin-left: 10px;">圆角</h3>
                            <el-form label-width="80px">
                                <el-form-item label="显示">
                                    <el-switch v-model="config.radius.show"></el-switch>
                                </el-form-item>
                                <el-form-item label="半径">
                                    <el-input-number v-model="config.radius.size" :min="0" :max="1000" :step="10"
                                        :disabled="!config.radius.show"></el-input-number>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="config-title">
                            <h3>背景</h3>
                        </div>
                        <el-form label-width="80px">
                            <el-form-item label="模糊">
                                <el-switch v-model="config.blur.enable"></el-switch>
                            </el-form-item>
                            <el-form-item label="模糊量" v-if="config.blur.enable">
                                <el-input-number v-model="config.blur.size" :min="0" :max="1000"
                                    :step="100"></el-input-number>
                            </el-form-item>
                            <el-form-item label="颜色" v-if="!config.blur.enable">
                                <el-color-picker :predefine="preDefineColors" show-alpha
                                    v-model="config.watermark.bgColor" :disabled="config.blur.enable"></el-color-picker>
                            </el-form-item>
                        </el-form>

                        <div class="config-title">
                            <h3>阴影</h3>
                            <el-switch v-model="config.shadow.show"></el-switch>
                        </div>
                        <el-form label-width="80" v-if="config.shadow.show">
                            <el-alert type="warning" description="效果不佳，此项功能完善中..." :closable="false"></el-alert>
                            <el-form-item label="颜色">
                                <el-color-picker :predefine="preDefineColors" show-alpha
                                    v-model="config.shadow.color"></el-color-picker>
                            </el-form-item>
                            <el-form-item label="大小">
                                <el-input-number v-model="config.shadow.size" :min="1" :max="500"></el-input-number>
                            </el-form-item>
                            <el-form-item label="水平偏移">
                                <el-input-number v-model="config.shadow.x" :min="-1000" :max="1000"></el-input-number>
                            </el-form-item>
                            <el-form-item label="垂直偏移">
                                <el-input-number v-model="config.shadow.y" :min="-1000" :max="1000"></el-input-number>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="边距" name="border">
                        <el-form label-width="80px">
                            <h3>图片边距</h3>
                            <el-form-item label="上边距">
                                <el-input-number v-model="config.paddings.top" :min="0" :max="1000"
                                    :step="10"></el-input-number>
                                <el-button style="margin-left: 10px;"
                                    @click="config.paddings.left = config.paddings.right = config.paddings.top">同步到左右</el-button>
                            </el-form-item>
                            <el-form-item label="左边距">
                                <el-input-number v-model="config.paddings.left" :min="0" :max="1000"
                                    :step="10"></el-input-number>
                            </el-form-item>
                            <el-form-item label="右边距">
                                <el-input-number v-model="config.paddings.right" :min="0" :max="1000"
                                    :step="10"></el-input-number>
                            </el-form-item>
                            <el-form-item label="下边距">
                                <el-input-number v-model="config.paddings.bottom" :min="0" :max="1000"
                                    :step="10"></el-input-number>
                            </el-form-item>
                            <h3>水印边距</h3>
                            <el-form-item label="左右边距">
                                <el-input-number v-model="config.watermark.paddings.lr" :min="0" :max="1000"
                                    :step="10"></el-input-number>
                            </el-form-item>
                            <el-form-item label="上下边距">
                                <el-input-number v-model="config.watermark.paddings.tb" :min="0" :max="1000"
                                    :step="10"></el-input-number>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="导出" name="export">
                        <h3>导出配置</h3>
                        <el-form label-width="80">
                            <el-form-item label="文件名">
                                <el-input v-model="img.export.name" :disabled="!curFile" placeholder="留空则由浏览器决定"
                                    clearable></el-input>
                            </el-form-item>
                            <el-form-item label="导出质量">
                                <el-slider v-model="img.export.quality" :min="0.01" :max="1" :step="0.01" show-tooltip
                                    show-input></el-slider>
                                <p class="tips">调整后需要手动点击绘制，文字大小需要重新调整~</p>
                            </el-form-item>
                            <el-form-item label="导出">
                                <el-button type="primary" plain @click="download(img.export.name)">导出当前图片</el-button>
                                <el-button type="success" plain disabled>批量导出</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <el-backtop :right="10" :bottom="100" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { print, download, deepClone, cameraBrands, convertExposureTime, watermarkList, getSupportedFonts, preDefineColors } from './assets/tools'
import defaultWaterMark from './configs/default'
import { ElMessage, ElNotification } from 'element-plus'
import type { Config, Img } from './types'
import { useDebounceFn, watchThrottled, formatDate } from '@vueuse/core'
import Exifr from "exifr";

const isDev = computed(() => import.meta.env.DEV)
// 辅助线配置
const auxiliaryLines = reactive({
    verticalCenter: false,
    watermarkHorizontalCenter: false,
    watermarkRange: false
})

const defaultImgValue = {
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
    exif: {},
    modelText: '',
    paramsText: '',
    timeText: ''
};
const img = reactive<Img>({ ...defaultImgValue })
const curFile = ref<File | null>(null)
const fileList = ref<File[]>([]);
const config = ref<Config>(defaultWaterMark);

const watermarks = reactive(watermarkList)
const curWatermarkIndex = ref<number>(0)
const activeName = ref<string>('info')

const onDrop = (event: DragEvent) => {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files) {
        const validImages: File[] = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.type.startsWith('image/')) {
                validImages.push(file);
            }
        }
        if (validImages.length > 0) {
            fileList.value = validImages;
            changeCurFile(validImages[0]);
        }
    }
};
const selectFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.click();

    input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target === null || !target.files) throw new Error('图片不存在...');
        fileList.value = Array.from(target.files);
        const file = target.files[0];
        changeCurFile(file);
    }
}

const clearFileList = () => {
    fileList.value = [];
    changeCurFile(null);
    ElMessage.success('已清空列表~')
}

const enhancedFileList = computed(() => {
    return fileList.value.map((file) => ({
        ...file,
        url: URL?.createObjectURL(file),

    }))
})

function resetText() {
    img.modelText = '';
    img.paramsText = '';
    img.timeText = '';
}

function changeCurFile(file: File | null) {
    if (!file) return;
    // 更新基本信息
    img.fileName = file.name;
    img.export.name = img.export.name || "WM_" + file.name;
    img.size = (file.size / 1024 / 1024).toFixed(2) + "MB";
    img.type = file.type;
    img.time = formatDate(new Date(file.lastModified), 'YYYY-MM-DD HH:mm:ss');
    curFile.value = file;
    resetText();
}

const resetWatermark = () => {
    importConfig(curWatermarkIndex.value);
    resetText();

    ElMessage.success({
        message: "已重置水印样式",
    });
}

// 监听
watch(curWatermarkIndex, (newIndex) => {
    resetText();
    importConfig(newIndex)
}, {
    immediate: true
})

watchThrottled([() => config, () => curFile, () => curWatermarkIndex, () => auxiliaryLines], ([_newConfig, _newCurFile]) => {
    handleDraw();
}, { throttle: 1000, deep: true })

function getBrandImageUrl(logo: string) {
    return new URL(`./assets/logos/${logo}.png`, import.meta.url).pathname
}

const handleDraw = useDebounceFn(() => {
    const file = curFile.value;
    if (!file) return;

    const { watermark, paddings: imgPaddings, blur: blurConfig, shadow: shadowConfig, radius: radiusConfig, logo: logoConfig } = config.value;
    const {
        params: paramsConfig,
        time: timeConfig,
        paddings: watermarkPaddings,
        bgColor
    } = watermark;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
        const _img = new Image();
        if (e.target === null) throw new Error("图片不存在...");
        _img.src = <string>e.target.result;

        _img.onload = async () => {
            // 更新宽高
            img.width = _img.width;
            img.height = _img.height;
            // 使用exifr库读取exifs信息
            const exif = await Exifr.parse(file);

            if (exif?.Make === undefined) {
                ElNotification({
                    title: '错误',
                    message: '未读取到Exif信息，请更换图片！(比如相机或者原相机拍摄的原图)',
                    type: 'error',
                });
                curFile.value = null;
                return;
            }

            img.exif = exif;
            console.log('品牌：', exif?.Make);
            img.modelText = img.modelText ? img.modelText : img.exif?.Model;
            // 曝光时间
            const exposureTime = convertExposureTime(exif?.ExposureTime);
            // 焦距
            const focalLength = (paramsConfig.useEquivalentFocalLength
                ? exif?.FocalLengthIn35mmFormat
                : exif?.FocalLength) || exif?.FocalLength;
            img.paramsText = img.paramsText
                ? img.paramsText
                : `${exposureTime}s  f/${exif?.FNumber
                }  ISO ${exif?.ISO}  ${focalLength}mm`;
            // 大写
            img.paramsText = paramsConfig.letterUpperCase
                ? img.paramsText.toUpperCase()
                : img.paramsText.toLocaleLowerCase();

            img.timeText = formatDate(
                new Date(img.exif?.DateTimeOriginal as number),
                timeConfig.format
            );

            const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                ElMessage.error({
                    message: "没有找到画布",
                });
                return;
            }

            const scale = img.export.quality;
            const realImgWidth = img.width * scale;
            const realImgHeight = img.height * scale;

            // 修改画布大小
            canvas.width =
                realImgWidth + imgPaddings.left + imgPaddings.right;
            canvas.height =
                realImgHeight + imgPaddings.top + imgPaddings.bottom;
            canvas.height += config.value.watermark.height * canvas.height + 2 * watermarkPaddings.tb;

            // 底部水印的坐标范围
            const rect1 = {
                x: imgPaddings.left,
                y: realImgHeight +
                    imgPaddings.top +
                    imgPaddings.bottom +
                    watermarkPaddings.tb,
            };
            const rect2 = {
                x: canvas.width - imgPaddings.right,
                y: canvas.height - watermarkPaddings.tb,
            };

            if (blurConfig.enable) {
                ctx.save();
                ctx.filter = `blur(${blurConfig.size}px)`;
                ctx.drawImage(_img, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            } else if (bgColor) {
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            // 获取比例
            // const boxScale = img.width / img.height;
            // const canvasBox = document.getElementById("canvasBox") as HTMLDivElement;
            // canvasBox.style.height = `${900 / boxScale}px`;


            // 绘制阴影
            if (shadowConfig.show) {
                ctx.save();
                // 绘制矩形阴影
                ctx.fillStyle = shadowConfig.color;
                // 模糊
                ctx.filter = `blur(${shadowConfig.size}px)`;

                ctx.fillRect(
                    imgPaddings.left + shadowConfig.x - shadowConfig.size,
                    imgPaddings.top + shadowConfig.y - shadowConfig.size,
                    realImgWidth + shadowConfig.size,
                    realImgHeight + shadowConfig.size
                );
                ctx.restore();
            }

            // 绘制圆角图片
            if (radiusConfig.show) {
                ctx.save();
                const radius = radiusConfig.size;
                ctx.beginPath();
                ctx.moveTo(imgPaddings.left + radius, imgPaddings.top);
                ctx.lineTo(
                    canvas.width - imgPaddings.right - radius,
                    imgPaddings.top
                );
                ctx.quadraticCurveTo(
                    canvas.width - imgPaddings.right,
                    imgPaddings.top,
                    canvas.width - imgPaddings.right,
                    imgPaddings.top + radius
                );
                ctx.lineTo(
                    canvas.width - imgPaddings.right,
                    realImgHeight + imgPaddings.top - radius
                );
                ctx.quadraticCurveTo(
                    canvas.width - imgPaddings.right,
                    realImgHeight + imgPaddings.top,
                    canvas.width - imgPaddings.right - radius,
                    realImgHeight + imgPaddings.top
                );
                ctx.lineTo(
                    imgPaddings.left + radius,
                    realImgHeight + imgPaddings.top
                );
                ctx.quadraticCurveTo(
                    imgPaddings.left,
                    realImgHeight + imgPaddings.top,
                    imgPaddings.left,
                    realImgHeight + imgPaddings.top - radius
                );
                ctx.lineTo(imgPaddings.left, imgPaddings.top + radius);
                ctx.quadraticCurveTo(
                    imgPaddings.left,
                    imgPaddings.top,
                    imgPaddings.left + radius,
                    imgPaddings.top
                );
                ctx.closePath();
                ctx.clip();
            }

            // 绘制图片
            ctx.drawImage(
                _img,
                imgPaddings.left,
                imgPaddings.top,
                realImgWidth,
                realImgHeight
            );

            ctx.restore();

            // 自动匹配logo
            if (logoConfig.enable && logoConfig.auto) {
                cameraBrands.forEach((brand) => {
                    if (brand.make && brand.make?.map(item => item.toUpperCase()).includes(exif.Make.toUpperCase())) {
                        logoConfig.name = brand.logo;
                    }
                });
            }

            config.value.draw(img, config.value, {
                ctx: ctx,
                canvas: canvas,
                rect1: rect1,
                rect2: rect2,
                exposureTime: exposureTime,
                focalLength: focalLength,
            });

            // 绘制辅助线
            if (auxiliaryLines.verticalCenter) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(canvas.width / 2, 0);
                ctx.lineTo(canvas.width / 2, canvas.height);
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#FF0000";
                ctx.stroke();
                ctx.restore();
            }
            if (auxiliaryLines.watermarkRange) {
                ctx.save();
                ctx.lineWidth = 10;
                ctx.strokeStyle = "#FF0000";
                ctx.strokeRect(rect1.x, rect1.y, rect2.x - rect1.x, rect2.y - rect1.y);
                ctx.restore();
            }
            if (auxiliaryLines.watermarkHorizontalCenter) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(rect1.x, rect1.y + (rect2.y - rect1.y) / 2);
                ctx.lineTo(rect2.x, rect1.y + (rect2.y - rect1.y) / 2);
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#FF0000";
                ctx.stroke();
                ctx.restore();
            }
        }
    }
}, 200)

function importConfig(val: number): void {
    // 获取对应的水印
    const watermark = watermarks.filter(item => item.index == val)

    // 导入
    let configPromise = null;
    switch (watermark[0].config) {
        case 'watermark1':
            configPromise = import('./configs/watermark1');
            break;
        // case 'watermark2':
        //     configPromise = import('./configs/watermark2');
        //     break;
        // case 'watermark3':
        //     configPromise = import('./configs/watermark3');
        //     break;
        case 'watermark4':
            configPromise = import('./configs/watermark4');
            break;
        // case 'watermark5':
        //     configPromise = import('./configs/watermark5');
        //     break;
        case 'watermark6':
            configPromise = import('./configs/watermark6');
            break;
        case 'watermark7':
            configPromise = import('./configs/watermark7');
            break;
        default:
            configPromise = import('./configs/default');
            break;
    }
    configPromise.then(res => {
        config.value = deepClone(<Config>res.default);
        ElMessage.success('配置导入成功~');
    }).catch(err => {
        ElNotification.error({
            title: '导入水印配置出错',
            message: err.message
        })
    })
}
</script>

<style lang='less' scoped>
.box {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
}

.config-box {
    padding: 10px 15px;
    width: 600px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    box-shadow: 0px 0px 15px gainsboro;
    border-radius: 10px 0 0 10px;
    overflow: hidden;

    .btns {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        padding: 10px 0px;
        height: 60px;
        background-color: #FFF;

    }

    .tabs-container {
        flex: 1;
        height: 100%;

        :deep(.el-tabs) {
            height: 100%;

            .el-tabs__content {
                overflow-y: auto;
                padding-bottom: 50px;

            }
        }
    }

    h3 {
        padding-bottom: 10px;
    }


    .img-list {
        padding: 5px 0px;
        gap: 5px;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: relative;
        // border: 2px dashed red;

        >* {
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 10%;
            width: 64px;
            height: 64px;

            &::before {
                content: attr(data-index);
                color: #FFF;
                position: absolute;
                font-size: 12px;
                padding: 0 5px;
                top: 0;
                left: 0;
                width: 20px;
                height: 20px;
            }

            &:hover {
                border: 2px solid gainsboro;
                transform: scale(1.1);
                z-index: 1;
                transition-duration: 0.5s;
            }
        }
    }
}

#canvasBox {
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    left: 0;
    background: rgb(255, 255, 255);
    z-index: 100;
    padding: 10px;
    max-height: 100vh;
    transition-duration: 1s;
    width: 100%;
    // border: 2px solid salmon;

    #imgCanvas {
        border: 1px solid gainsboro;
        max-width: 100%;
        box-sizing: border-box;
    }

}

.tips {
    color: gray;
    font-size: 12px;
    width: 100%;

    &::before {
        content: '* ';
        color: red;
    }
}

.config-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0px 10px;
}

.img-list {

    >* {
        width: 36px;
        height: 36px;
    }
}

@media screen and (max-width: 768px) {
    .box {
        gap: 5px;
    }

    #canvasBox {
        max-height: 300px;

    }

    .config-box {
        border-radius: 10px 10px 0 0;

    }

    .btns {
        justify-content: space-between;
    }
}
</style>