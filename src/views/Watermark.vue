<template>
    <div class="box">
        <div id="canvasBox" @dragover.prevent @dragenter.prevent @drop="onDrop">
            <canvas ref="imgCanvas" id="imgCanvas" v-if="curFile" @click="preview">您的浏览器不支持Canvas!</canvas>
            <el-empty description="点击添加图片~" v-else @click="selectFile"></el-empty>
        </div>

        <div class="config-box">
            <div class="tabs-container">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="文件" name="info">
                        <HorizontalScroll class="img-list" v-if="fileList.length">
                            <el-button plain @click="selectFile(true)"
                                style="height: 64px;position: sticky;left: 0px;z-index:1;">添加</el-button>
                            <div class="img-item" v-for="(item, index) in enhancedFileList" :key="item.name">
                                <el-image fit="cover" :src="item.url" @click="changeCurFile(fileList[index])"
                                    :data-index="index + 1">
                                </el-image>
                                <el-icon class="delete-icon" @click="removeImg(index)">
                                    <delete />
                                </el-icon>
                            </div>
                        </HorizontalScroll>
                        <h3 style="margin-top: 10px;">样式</h3>
                        <el-form label-width="70px">
                            <el-form-item label="选择样式">
                                <el-select v-model="curWatermarkIndex" placeholder="请选择水印样式" v-if="!isMobile()"
                                    style="margin-bottom: 10px;">
                                    <el-option v-for="(item, index) in watermarks" :key="index" :value="index"
                                        :label="item.name">
                                        <div style="display: flex;align-items: center;justify-content: space-between;">
                                            <b>{{ item.name }}<small style="color:gray;">{{ item.is_local ? '[本地]' :
                                                '[内置]'
                                                    }}</small></b>
                                            <el-button v-if="item.is_local" type="danger" size="small" plain
                                                @click="deleteWatermark(item.name, $event)">删 除</el-button>
                                        </div>
                                    </el-option>
                                </el-select>

                                <el-button @click="showConfigDrawer = true" plain type="primary">模板(已选择：{{
                                    watermarks[curWatermarkIndex]['name'] }})</el-button>

                                <div style="padding-top: 5px;width: 100%;">
                                    <el-button @click="showConfigDialog">保存配置</el-button>
                                    <el-button plain @click="resetWatermark">重置样式</el-button>
                                    <el-button @click="handleDraw" :disabled="!curFile" plain>重绘</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="全局字体">
                                <el-select :filterable="!isMobile()" v-model="config.font" clearable>
                                    <el-option v-for="(item, index) in getSupportedFonts()" :key="index" :label="item"
                                        :value="item" :style="{ fontFamily: item }"></el-option>
                                </el-select>
                                <p class="tips">仅支持部分字体！</p>
                            </el-form-item>
                        </el-form>

                        <ImageInfo v-if="curFile" :img="img" />


                        <div v-if="isDev">
                            <h3>开发工具</h3>
                            <el-form-item label="辅助线">
                                <b style="margin-left: 20px;">水平中心线：</b>
                                <el-switch v-model="auxiliaryLines.horizontalCenter"></el-switch>
                                <b style="margin-left: 20px;">垂直中心线：</b>
                                <el-switch v-model="auxiliaryLines.verticalCenter"></el-switch>
                                <b style="margin-left: 20px;">水印范围：</b>
                                <el-switch v-model="auxiliaryLines.watermarkRange"></el-switch>
                                <b style="margin-left: 20px;">水印水平中心线：</b>
                                <el-switch v-model="auxiliaryLines.watermarkHorizontalCenter"></el-switch>
                                <el-button @click="print(config, img)" style="margin-left: 10px;">打印配置</el-button>
                            </el-form-item>
                        </div>

                        <div style="padding:10px 0px">
                            <router-link to="/grid">
                                <el-button>九宫格分割工具</el-button>
                            </router-link>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="调整" name="watermark">
                        <el-collapse accordion :collapse-transition="false">
                            <el-collapse-item v-if="config.logo.enable">
                                <template #title>
                                    <h3>图标</h3>
                                </template>
                                <LogoConfig />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.model.enable">
                                <template #title>
                                    <h3>型号</h3>
                                </template>
                                <ModelConfig />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.params.enable">
                                <template #title>
                                    <h3>参数</h3>
                                </template>
                                <ParamsConfig :text="img.paramsText" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.time.enable">
                                <template #title>
                                    <h3>时间</h3>
                                </template>
                                <TimeConfig :text="img.timeText" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.lens.enable">
                                <template #title>
                                    <h3>镜头</h3>
                                </template>
                                <LensConfig :text="img.lensText" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.divider.enable">
                                <template #title>
                                    <h3>分割线</h3>
                                </template>
                                <DividerConfig />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.location?.enable">
                                <template #title>
                                    <h3>地理位置</h3>
                                </template>
                                <LocationConfig :text="img.locationText" />
                            </el-collapse-item>
                            <el-collapse-item>
                                <template #title>
                                    <h3>自定义文本</h3>
                                </template>
                                <el-button @click="addCustomLabel">添加自定义文本</el-button>
                                <LabelsConfig v-for="label in config.labels" :config="label" :key="label.name"
                                    @remove="removeCustomLabel" />
                            </el-collapse-item>
                            <el-collapse-item>
                                <template #title>
                                    <h3>自定义图片</h3>
                                </template>
                                <el-button @click="addCustomImage">添加自定义图片</el-button>
                                <ImageConfig v-for="image in config?.images" :config="image" :key="image.title"
                                    @remove="removeCustomImage(image.title)"></ImageConfig>
                            </el-collapse-item>
                        </el-collapse>
                    </el-tab-pane>
                    <el-tab-pane label="图片" name="picture">
                        <RadiusConfig :radius="config.radius" />
                        <BlurConfig />
                        <ShadowConfig :shadow="config.shadow" />

                        <h3>水印背景</h3>
                        <el-form lable="80px">
                            <el-form-item label="背景颜色">
                                <el-color-picker v-model="config.watermark.bg" show-alpha></el-color-picker>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="边距" name="border">
                        <el-form label-width="70px">
                            <h3>水印高度</h3>
                            <el-form-item label="基础高度">
                                <el-slider :show-input="!isMobile()" :min="0" :max="0.5" :step="0.01"
                                    v-model="config.watermark.height"></el-slider>
                                <p class="tips">水印在左右：相对于图片宽度的倍数；水印在上下：相对于图片高度的倍数。影响底部水印绘制范围的大小。</p>
                            </el-form-item>
                        </el-form>
                        <PaddingConfig />
                    </el-tab-pane>
                    <el-tab-pane label="导出" name="export">
                        <h3>导出配置</h3>
                        <el-form label-width="80">
                            <el-form-item label="文件名">
                                <el-input v-model="img.export.name" :disabled="!curFile" placeholder="留空则由浏览器决定"
                                    clearable></el-input>
                            </el-form-item>
                            <el-form-item label="格式">
                                <el-radio-group v-model="img.export.ext">
                                    <el-radio value="jpeg">JPEG</el-radio>
                                    <el-radio value="png">PNG(支持透明背景)</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="导出质量">
                                <el-slider v-model="img.export.quality" :min="0.01" :max="1" :step="0.01" show-tooltip
                                    :format-tooltip="(val) => (val * 100).toFixed(0) + '%'" show-input></el-slider>
                                <p class="tips">推荐0.97，兼顾画质和文件大小。</p>
                            </el-form-item>
                            <el-form-item label="">
                                <el-button type="primary" plain
                                    @click="download(img.export.name, img.export.quality, img.export.ext)"
                                    :disabled="!curFile">导出当前图片</el-button>
                                <el-button v-show="fileList.length > 1" type="success" plain
                                    @click="batchExportVisible = true">批量导出</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </div>

            <el-backtop :right="10" :bottom="100" />
        </div>

        <!-- 批量导出 -->
        <el-dialog title="批量导出" v-model="batchExportVisible"
            style="max-width: 95%;width: fit-content;min-width: 300px;">
            <el-table :data="fileList" style="width: 100%;">
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="size" label="文件大小">
                    <template #default="scope">
                        {{ ((scope.row.size) / 1024 / 1024).toFixed(2) }}M
                    </template>
                </el-table-column>
            </el-table>

            <template #footer>
                <el-button type="primary" @click="batchExport">全部导出</el-button>
            </template>
        </el-dialog>

        <!-- 保存配置 -->
        <el-dialog title="保存配置" v-model="saveConfigDialog.show" style="width: 500px;max-width: 90%;">
            <el-form label-width="80px">
                <el-form-item label="配置名称">
                    <el-input v-model="saveConfigDialog.name" placeholder="请输入配置名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="配置描述">
                    <el-input v-model="saveConfigDialog.config" placeholder="请输入配置描述" disabled type="textarea"
                        :rows="20"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button type="primary" @click="saveConfig">保存</el-button>
            </template>
        </el-dialog>

        <!-- 选择模板抽屉 -->
        <el-drawer v-model="showConfigDrawer" :with-header="false" title="模板列表" :direction="isMobile() ? 'btt' : 'rtl'"
            size="50%">
            <h3 style="display: flex;justify-content: space-between;align-items: center;">
                <b>样式模板</b>
                <el-button :text="true" @click="showConfigDrawer = false" style="font-size: 1.5rem;">&times;</el-button>
            </h3>
            <HorizontalScroll style="gap:10px;">
                <div v-for="(item, index) in watermarks" :key="item.name"
                    style="display: flex;flex-direction: column;justify-content: space-between;align-items: center;margin-top: 1rem;gap: 20px;">
                    <el-image :width="240" :height="180" fit="cover" @click="curWatermarkIndex = index"
                        style="width: 240px;max-height: 180px;border: 1px solid #ccc;cursor: pointer;box-shadow: 1px 5px 10px rgba(0,0,0,0.3);"
                        :style="{ border: (index === curWatermarkIndex) ? '2px solid salmon' : '2px solid #ccc' }"
                        :src="item?.url">
                        <template #placeholder>
                            <el-icon>
                                <Loading style="width: 48px;height: 48px;animation: rotate 1s linear infinite;">加载中...
                                </Loading>
                            </el-icon>
                        </template>
                        <template #error>
                            <div class="flex-center" style="width: 240px;height: 180px;color: #ccc;">图片加载失败</div>
                        </template>
                    </el-image>

                    <b :style="{ color: (index === curWatermarkIndex) ? 'salmon' : 'black' }">{{ item.name }}</b>
                    <el-button :text="true" type="danger" v-if="item?.is_local"
                        @click="deleteWatermark(item.name, $event)">删除</el-button>
                </div>
            </HorizontalScroll>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, provide } from 'vue'
import { print, getWatermarkList, getSupportedFonts, defaultLabelConfig, defaultImageConfig } from '../assets/tools'
import { download, convertExposureTime, getImageSrc, deepClone, isMobile, drawCustomLabelsAndImages, drawAuxiliaryLines, getLogoName, caculateCanvasSize, getLocationText, drawRoundedRect } from "../utils"
import { ElMessage, ElNotification } from 'element-plus'
import { Delete, Loading } from '@element-plus/icons-vue';
import type { Config, Img, LocalWaterMarkItem, WatermarkListItem } from '../types'
import { useDebounceFn, watchThrottled, formatDate, computedAsync } from '@vueuse/core'
import Exifr from "exifr";
import HorizontalScroll from '../components/HorizontalScroll.vue'
import { useStore } from '../stores';
import LensConfig from '../components/LensConfig.vue'
import ModelConfig from '../components/ModelConfig.vue'
import ParamsConfig from '../components/ParamsConfig.vue'
import TimeConfig from '../components/TimeConfig.vue'
import DividerConfig from '../components/DividerConfig.vue'
import LogoConfig from '../components/LogoConfig.vue'
import RadiusConfig from '../components/RadiusConfig.vue'
import BlurConfig from '../components/BlurConfig.vue'
import ShadowConfig from '../components/ShadowConfig.vue'
import PaddingConfig from '../components/PaddingConfig.vue'
import ImageInfo from '../components/ImageInfo.vue'
import LocationConfig from '../components/LocationConfig.vue'
import LabelsConfig from '../components/LabelsConfig.vue';
import ImageConfig from '../components/ImageConfig.vue'
const store = useStore();

import { useExifStore } from '../stores/exif'
const exifStore = useExifStore();


// 是否开发环境
const isDev = computed(() => import.meta.env.DEV)
// 画布
const imgCanvas = ref<HTMLCanvasElement | null>(null)
const showConfigDrawer = ref(false);
// 辅助线配置
const auxiliaryLines = reactive({
    verticalCenter: false, // 垂直中心线
    horizontalCenter: false, // 水平中心线
    watermarkHorizontalCenter: false, // 水印水平中心线
    watermarkRange: false, // 水印范围
})

const defaultImgValue: Img = {
    width: 0,
    height: 0,
    fileName: '',
    size: '',
    type: '',
    time: '',
    export: {
        name: '',
        quality: 0.97,
        ext: 'jpeg'
    },
    exif: {},
    modelText: '',
    paramsText: '',
    timeText: '',
    lensText: '',
    locationText: ''
};
const img = reactive<Img>({ ...defaultImgValue })
const curFile = ref<File | null>(null)
const fileList = ref<File[]>([]);
const config = (store.config);

const watermarks = ref<WatermarkListItem[]>(getWatermarkList())
const curWatermarkIndex = ref<number>(0)
const activeName = ref<string>('info')
const batchExportVisible = ref(false);
const saveConfigDialog = reactive({
    show: false,
    name: '',
    config: '',
})

provide('img', img)
function deleteWatermark(name: string, event: Event) {
    // 阻止事件冒泡
    event.stopPropagation();

    if (store.deleteLocalWatermark(name)) {
        watermarks.value = getWatermarkList();
        curWatermarkIndex.value = 0;
    }
}

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
const selectFile = (append = false) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.click();

    input.onchange = (e) => {
        const target = e.target as HTMLInputElement;
        if (target === null || !target.files) throw new Error('图片不存在...');
        const files = Array.from(target.files);

        // 追加
        if (append) {
            fileList.value = [...fileList.value, ...files];
        }
        else {
            fileList.value = files;
        }
        const file = fileList.value[0];
        if (file !== curFile.value) {
            changeCurFile(file);
        }
    }
}

const batchExport = () => {
    if (fileList.value.length === 0) {
        ElMessage.warning('请先选择图片~');
        return;
    }

    ElMessage.success('开发中...')
}

const enhancedFileList = computedAsync(async () => {
    return await Promise.all(fileList.value.map(async (file) => {
        return {
            ...file,
            url: getImageSrc(file)
        }
    }))
})

function changeCurFile(file: File | null) {
    if (!file) {
        curFile.value = null;
        return;
    };
    // 更新基本信息
    img.fileName = file.name;
    img.export.name = (img.export.name || "WM_" + file.name).split('.')[0];
    img.size = (file.size / 1024 / 1024).toFixed(2) + "MB";
    img.type = file.type;
    img.time = formatDate(new Date(file.lastModified), 'YYYY-MM-DD HH:mm:ss');
    curFile.value = file;
}

const resetWatermark = () => {
    importConfig(curWatermarkIndex.value);

    ElMessage.success({
        message: "已重置水印样式",
    });
}

const showConfigDialog = () => {
    // 弹出对话框
    saveConfigDialog.show = true;
    saveConfigDialog.name = '自定义配置' + new Date().getTime();
    saveConfigDialog.config = JSON.stringify(config, null, 4);
}

const saveConfig = () => {
    if (saveConfigDialog.name.trim() === '') {
        ElMessage.error('请输入配置名称~');
        return;
    }

    try {
        const temp_config = JSON.parse(saveConfigDialog.config);

        const watermark: LocalWaterMarkItem = {
            name: saveConfigDialog.name,
            config: temp_config,
            config_name: config.name,
        };

        // 保存到pinia
        store.addWatermark(watermark);

        saveConfigDialog.show = false;
        ElMessage.success('保存成功~');
        watermarks.value = getWatermarkList();
    }
    catch (e) {
        ElMessage.error('保存失败:格式错误！' + e);
    }
}

function removeImg(index: number) {
    const isCurrentFile = fileList.value[index] == curFile.value;

    // 删除指定下标的图片文件
    fileList.value = fileList.value.filter((_, i) => i !== index);

    if (fileList.value.length === 0) {
        changeCurFile(null);
    }
    if (isCurrentFile) {
        changeCurFile(fileList.value[0]);
    }
}


// 监听
watch(curWatermarkIndex, (newIndex) => {
    importConfig(newIndex)
}, {
    immediate: true
})

watchThrottled([() => config, () => curFile, () => auxiliaryLines], () => {
    handleDraw();
}, { throttle: 250, deep: true })


const _img = new Image();
const handleDraw = useDebounceFn(() => {
    try {
        const file = curFile.value;
        if (!file) return;

        const { watermark, paddings: imgPaddings, blur: blurConfig, shadow: shadowConfig, radius: radiusConfig, logo: logoConfig, location: locationConfig } = config;
        const { model, params: paramsConfig, time: timeConfig, lens, bgColor } = watermark;

        _img.src = getImageSrc(file);
        _img.onload = async () => {
            // 更新宽高
            img.width = _img.width;
            img.height = _img.height;

            // 读取exif信息
            const exif = exifStore.getExif(file) || await Exifr.parse(file);
            exifStore.addExif(file, exif);

            if (exif === undefined) {
                ElNotification({
                    title: '错误',
                    message: '未读取到Exif信息，请更换图片！(比如相机或者原相机拍摄的原图)',
                    type: 'error',
                });
                // 从文件列表删除当前图片
                fileList.value = fileList.value.filter(item => item !== file);
                curFile.value = null;
                return;
            }

            img.exif = exif;
            img.modelText = model.text || img.exif?.Model || '--';
            // 曝光时间
            const exposureTime = convertExposureTime(exif?.ExposureTime);
            // 焦距
            const focalLength = (paramsConfig.useEquivalentFocalLength
                ? exif?.FocalLengthIn35mmFormat
                : exif?.FocalLength) || exif?.FocalLength;
            img.paramsText = paramsConfig.text || `${exposureTime}s  f/${exif?.FNumber
                }  iso ${exif?.ISO}  ${focalLength}mm`;
            // 大写
            img.paramsText = paramsConfig.letterUpperCase
                ? img.paramsText.toUpperCase()
                : img.paramsText;

            img.timeText = timeConfig.text || formatDate(
                new Date(img.exif?.DateTimeOriginal as number),
                timeConfig.format
            );
            img.lensText = lens.text || exif?.LensModel;
            img.locationText = locationConfig?.text || getLocationText(img.exif);

            const canvas = imgCanvas.value;
            if (!canvas) {
                ElMessage.error("没有找到画布~");
                return;
            }
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                ElMessage.error("获取画布上下文失败~");
                return;
            }

            const realImgWidth = img.width;
            const realImgHeight = img.height;


            const { rect1, rect2, canvasWidth, canvasHeight } = caculateCanvasSize(config, img);
            // 修改画布大小
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;

            rect1.x += watermark.offsetX || 0;
            rect1.y += watermark.offsetY || 0;
            rect2.x += watermark.offsetX || 0;
            rect2.y += watermark.offsetY || 0;

            // 绘制背景
            if (blurConfig.enable) {
                ctx.save();
                ctx.filter = `blur(${blurConfig.size}px)`;
                ctx.drawImage(_img, 0, 0, canvas.width, canvas.height);
                ctx.restore();
            } else {
                ctx.fillStyle = bgColor || "#FFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.restore();

            // 绘制圆角和阴影
            ctx.save();
            let radius: number | number[] = 0;
            if (shadowConfig.show) {
                ctx.shadowBlur = shadowConfig.size;
                ctx.shadowColor = shadowConfig.color;
                ctx.shadowOffsetX = shadowConfig.x;
                ctx.shadowOffsetY = shadowConfig.y;
            }
            if (radiusConfig.show) {
                const rt = radiusConfig.uniform ? radiusConfig.size : radiusConfig.rt;
                const rb = radiusConfig.uniform ? radiusConfig.size : radiusConfig.rb;
                const lt = radiusConfig.uniform ? radiusConfig.size : radiusConfig.lt;
                const lb = radiusConfig.uniform ? radiusConfig.size : radiusConfig.lb;
                radius = radiusConfig.uniform ? radiusConfig.size : [rt, rb, lb, lt];
            }

            drawRoundedRect(ctx, imgPaddings.left, imgPaddings.top, realImgWidth, realImgHeight, radius);
            ctx.fill();
            ctx.restore();

            ctx.save();
            ctx.clip();
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
                logoConfig.name = getLogoName(exif?.Make);
            }


            // 执行绘制前的操作
            config.beforeDraw && config.beforeDraw(canvas);


            // 绘制水印范围的背景颜色
            if (watermark.position !== 'inner') {
                ctx.fillStyle = watermark.bg || "rgba(0,0,0,0)";
                ctx.fillRect(0, rect1.y - watermark.paddings.tb, canvas.width, rect2.y - rect1.y + 2 * watermark.paddings.tb);
            }

            // 执行模板的绘制函数
            config.draw(img, config, {
                ctx, canvas, rect1, rect2, exposureTime, focalLength,
            });


            // 绘制自定义的文本和图片
            drawCustomLabelsAndImages(ctx, config.labels, config.images);

            // 绘制辅助线
            drawAuxiliaryLines(canvas, auxiliaryLines, rect1, rect2);

            // 执行绘制结束后的操作
            config.afterDraw && config.afterDraw(ctx);

            // 释放图片
            URL.revokeObjectURL(_img.src);
        }
    } catch (e) {
        console.log('绘制发生错误：', e);
    }
}, 250)

function importConfig(val: number): void {
    // 获取对应的水印
    const watermark: WatermarkListItem | undefined = watermarks.value.filter(item => item.index == val).shift()

    if (watermark === undefined) {
        ElMessage.error('未找到匹配的水印配置！');
        return;
    }

    const filename = watermark.is_local ? watermark.config_name : watermark.config;
    let configPromise = null;
    switch (filename) {
        case "小米徕卡2":
            configPromise = import("../configs/小米徕卡2");
            break;
        case "默认样式":
            configPromise = import("../configs/默认样式");
            break;
        case "纯图标":
            configPromise = import("../configs/纯图标");
            break;
        case "经典模式":
            configPromise = import("../configs/经典模式");
            break;
        case "经典模糊":
            configPromise = import("../configs/经典模糊");
            break;
        case "印象毛玻璃":
            configPromise = import("../configs/印象毛玻璃");
            break;
        case "时间+型号":
            configPromise = import("../configs/时间+型号");
            break;
        case "蔡司水印":
            configPromise = import("../configs/蔡司水印");
            break;
        case "XMAGE":
            configPromise = import("../configs/XMAGE");
            break;
        case "Lumix":
            configPromise = import("../configs/Lumix");
            break;
        default:
            configPromise = import("../configs/小米徕卡");
            break;
    }
    configPromise.then(res => {
        let config_value = deepClone(res.default as Config);
        if (watermark.is_local) {
            let local_value = JSON.parse(watermark.config) as Config;
            // 合并对象
            config_value = Object.assign(config_value, local_value);
        }
        Object.assign(config, config_value);

        ElMessage.success(`配置【${watermark.name}】导入成功~`);
    }).catch(err => {
        ElNotification.error({
            title: '导入水印配置失败',
            message: err.message
        })
    })
}

const preview = () => {
    const canvasBox = document.getElementById('canvasBox') as HTMLCanvasElement;
    if (!canvasBox) throw '未找到画布容器！';

    if (canvasBox.style.maxHeight === '65vh' && window.innerWidth <= 768) {
        canvasBox.style.maxHeight = '300px';
    } else {
        canvasBox.style.maxHeight = '65vh';
    }
}

function addCustomLabel() {
    config.labels = config?.labels || [];
    config?.labels?.unshift(JSON.parse(JSON.stringify(defaultLabelConfig)));
}

function removeCustomLabel(name: string) {
    config?.labels?.splice(config?.labels?.findIndex(item => item.name === name), 1);
}

function addCustomImage() {
    config.images = config?.images || [];
    config?.images?.unshift(JSON.parse(JSON.stringify(defaultImageConfig)));
}
function removeCustomImage(title: string) {
    config?.images?.splice(config?.images?.findIndex(item => item.title === title), 1);
}
</script>

<style lang='less' scoped>
.box {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    height: 100vh;
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
        overflow: hidden;

        .el-tabs {
            overflow: hidden;
            height: 100%;
            scrollbar-width: thin;
            scrollbar-color: transparent transparent;

            :deep(.el-tabs__content) {
                overflow-y: auto;
            }

            .el-tab-pane {
                height: auto;
            }
        }

    }

    h3 {
        padding-bottom: 10px;
    }
}

.img-list {
    padding: 0px;
    gap: 5px;
    display: flex;
    align-items: center;
    flex-shrink: 1;
    width: 100%;
    position: sticky;
    bottom: 0px;
    left: 0;
    z-index: 1;

    .el-image {
        cursor: pointer;
        border: 2px solid transparent;
        border-radius: 10%;
        min-width: 64px;
        width: 64px;
        height: 64px;

        &::before {
            content: attr(data-index);
            color: #FFF;
            position: absolute;
            font-size: 12px;
            padding: 0 5px;
            top: 8px;
            left: 0px;
            width: 20px;
            height: 20px;
        }

        &:hover {
            border: 2px solid gainsboro;
            transform: scale(1.1);
            transition-duration: 0.5s;
        }
    }

    .img-item {
        position: relative;
        vertical-align: center;
        line-height: 0;


        .delete-icon {
            position: absolute;
            top: 5px;
            right: 5px;
            color: #FFF;
            cursor: pointer;
            opacity: 0.7;
            font-size: 14px;

            &:hover {
                opacity: 1;
            }
        }
    }
}

#canvasBox {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 10px;
    justify-content: space-between;
    align-items: center;
    background: rgb(255, 255, 255);
    max-height: 100vh;
    transition-duration: 1s;
    width: 100%;
    padding: 5px 10px;

    canvas {
        border: 1px solid gainsboro;
        max-width: 100%;
        box-sizing: border-box;
        transition-duration: 1s;
        max-height: 100vh;
    }
}

@media screen and (max-width: 768px) {
    .box {
        gap: 5px;
        flex-direction: column;
    }

    #canvasBox {
        max-height: 300px;

        canvas {
            max-height: 100%;
        }
    }


    .config-box {
        width: 100%;
        background-color: #FFF;
        border-radius: 10px 10px 0px 0px;
        animation: flow 1s;

        .btns {
            justify-content: space-between;
        }
    }
}

@keyframes rotate {
    0% {
        transform: rotateZ(360deg);
    }
}

@keyframes flow {
    from {
        transform: translateY(50%);
    }
}
</style>