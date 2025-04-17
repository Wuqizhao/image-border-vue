<template>
    <div class="box">
        <div id="canvasBox" @dragover.prevent @dragenter.prevent @drop="onDrop">
            <canvas id="imgCanvas" v-if="curFile" @click="preview"></canvas>
            <el-empty description="点击添加图片~" v-else @click="selectFile"></el-empty>
        </div>

        <div class="config-box">
            <div class="tabs-container">
                <el-tabs v-model="activeName">
                    <el-tab-pane label="文件" name="info">
                        <HorizontalScroll class="img-list" v-if="fileList.length">
                            <el-image v-for="(item, index) in enhancedFileList" :key="item.name" fit="cover"
                                :src="item.url" @click="changeCurFile(fileList[index])" :data-index="index + 1">
                            </el-image>
                            <div class="btn-box">
                                <el-button @click="clearFileList" plain size="small">清空</el-button>
                                <el-button plain @click="selectFile(true)" size="small">添加</el-button>
                            </div>
                        </HorizontalScroll>

                        <h3>样式</h3>
                        <el-form label-width="80px">
                            <el-form-item label="选择样式">
                                <el-button @click="showConfigDrawer = true" plain type="primary">模板(已选择：{{
                                    watermarks[curWatermarkIndex]['name'] }})</el-button>
                                <!-- <el-select v-model="curWatermarkIndex" placeholder="请选择水印样式">
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
                                </el-select> -->

                                <div style="padding-top: 5px;width: 100%;">
                                    <el-button @click="showConfigDialog">保存配置</el-button>
                                    <el-button plain @click="resetWatermark">重置样式</el-button>
                                    <el-button @click="handleDraw" :disabled="!curFile" plain>重绘</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item label="基础高度">
                                <el-slider show-input :min="0" :max="1" :step="0.01"
                                    v-model="config.watermark.height"></el-slider>
                                <p class="tips">水印在左右：相对于图片宽度的倍数；水印在上下：相对于图片高度的倍数。影响底部水印绘制范围的大小。</p>
                            </el-form-item>
                            <el-form-item label="字体">
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
                                <LogoConfig :logo="config.logo" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.model.enable">
                                <template #title>
                                    <h3>型号</h3>
                                </template>
                                <ModelConfig :config="config.watermark.model" :params-config="config.watermark.params"
                                    :time-config="config.watermark.time" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.params.enable">
                                <template #title>
                                    <h3>参数</h3>
                                </template>
                                <ParamsConfig :params="config.watermark.params" :divider="config.divider"
                                    :text="img.paramsText" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.time.enable">
                                <template #title>
                                    <h3>时间</h3>
                                </template>
                                <TimeConfig :time="config.watermark.time" :text="img.timeText" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.watermark.lens.enable">
                                <template #title>
                                    <h3>镜头</h3>
                                </template>
                                <LensConfig :config="config.watermark.lens" :text="img.lensText" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.divider.enable">
                                <template #title>
                                    <h3>分割线</h3>
                                </template>
                                <DividerConfig :divider="config.divider" />
                            </el-collapse-item>
                            <el-collapse-item v-if="config.location?.enable">
                                <template #title>
                                    <h3>地理位置</h3>
                                </template>
                                <LocationConfig :loc="config.location" :text="img.locationText" />
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
                        <BlurConfig :blur="config.blur" :bg="config.watermark" />
                        <ShadowConfig :shadow="config.shadow" />
                    </el-tab-pane>
                    <el-tab-pane label="边距" name="border">
                        <PaddingConfig :paddings="config.paddings" :watermark="config.watermark" />
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

        <el-drawer v-model="showConfigDrawer" :with-header="false" title="模板列表" :direction="isMobile() ? 'btt' : 'rtl'"
            size="50%">
            <h3 style="display: flex;justify-content: space-between;align-items: center;">
                <b>样式模板</b>
                <el-button :text="true" @click="showConfigDrawer = false" style="font-size: 1.5rem;">&times;</el-button>
            </h3>
            <HorizontalScroll style="gap:10px;">
                <div v-for="(item, index) in watermarks" :key="item.name"
                    style="display: flex;flex-direction: column;justify-content: space-between;align-items: center;margin-top: 1rem;">
                    <el-image :width="240" :height="180" fit="cover" @click="curWatermarkIndex = index"
                        style="width: 240px;max-height: 180px;border: 1px solid #ccc;border-radius: 5px;"
                        :style="{ border: (index === curWatermarkIndex) ? '5px solid salmon' : '1px solid #ccc' }"
                        :src="item?.url" >
                    <template #error>
                        <div class="flex-center" style="width: 240px;height: 180px;color: #ccc;">图片加载失败</div>
                    </template>
                    </el-image>
                    
                    <b>{{ item.name }}</b>
                    <el-button :text="true" type="danger" v-if="item?.is_local"
                        @click="deleteWatermark(item.name, $event)">删除</el-button>
                </div>
            </HorizontalScroll>
        </el-drawer>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch, provide } from 'vue'
import { print, cameraBrands, getWatermarkList, getSupportedFonts, defaultLabelConfig, defaultImageConfig } from '../assets/tools'
import { download, convertExposureTime, compressImage, deepClone, isMobile, drawCustomLabelsAndImages } from "../utils"
import defaultWaterMark from '../configs/小米徕卡'
import { ElMessage, ElNotification } from 'element-plus'
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


// 是否开发环境
const isDev = computed(() => import.meta.env.DEV)
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
const config = ref<Config>(defaultWaterMark);

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

const clearFileList = () => {
    fileList.value = [];
    changeCurFile(null);

    const canvas = document.getElementById('imgCanvas') as HTMLCanvasElement;
    if (!canvas) return;
    // 清空画布
    const ctx = canvas.getContext('2d');
    if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ElMessage.success('已清空列表~')
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
    return await Promise.all(fileList.value.map(async (file) => ({
        ...file,
        url: compressImage(file)
    })))
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
    saveConfigDialog.config = JSON.stringify(config.value, null, 4);
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
            config_name: config.value.name,
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


// 监听
watch(curWatermarkIndex, (newIndex) => {
    importConfig(newIndex)
}, {
    immediate: true
})

watchThrottled([() => config, () => curFile, () => auxiliaryLines], () => {
    handleDraw();
}, { throttle: 250, deep: true })

const handleDraw = useDebounceFn(() => {
    const file = curFile.value;
    if (!file) return;

    const { watermark, paddings: imgPaddings, blur: blurConfig, shadow: shadowConfig, radius: radiusConfig, logo: logoConfig, location: locationConfig } = config.value;
    const {
        model,
        params: paramsConfig,
        time: timeConfig,
        paddings: watermarkPaddings,
        lens,
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
                // 从文件列表删除当前图片
                fileList.value = fileList.value.filter(item => item !== file);
                curFile.value = null;
                return;
            }

            img.exif = exif;
            img.modelText = model.text || img.exif?.Model;
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
                : img.paramsText.toLocaleLowerCase();

            img.timeText = timeConfig.text || formatDate(
                new Date(img.exif?.DateTimeOriginal as number),
                timeConfig.format
            );
            img.lensText = lens.text || exif?.LensModel;

            if (img.exif?.GPSLatitude && img.exif?.GPSLongitude) {
                img.locationText = locationConfig?.text || `${img.exif?.GPSLatitude[0]}°${img.exif?.GPSLatitude[1]
                    }'${(img.exif?.GPSLatitude[2]).toFixed(0)}''${img.exif?.GPSLatitudeRef} ${img.exif?.GPSLongitude[0]
                    }°${img.exif?.GPSLongitude[1]}'${(img.exif?.GPSLongitude[2]).toFixed(
                        0
                    )}''${img.exif?.GPSLongitudeRef}`;
            }

            const canvas = document.getElementById("imgCanvas") as HTMLCanvasElement;
            const ctx = canvas.getContext("2d");
            if (!ctx) {
                ElMessage.error("没有找到画布~");
                return;
            }

            const realImgWidth = img.width;
            const realImgHeight = img.height;

            // 修改画布大小
            canvas.width =
                realImgWidth + imgPaddings.left + imgPaddings.right;
            canvas.height =
                realImgHeight + imgPaddings.top + imgPaddings.bottom;

            const rect1 = { x: 0, y: 0 }; const rect2 = { x: 0, y: 0 };
            if (config.value.watermark.position === "left" || config.value.watermark.position === "right") {
                canvas.width += config.value.watermark.height * canvas.width + 2 * watermarkPaddings.lr;
                // 底部水印的坐标范围
                rect1.x = imgPaddings.left + realImgWidth;
                rect1.y = imgPaddings.top;
                rect2.x = canvas.width - imgPaddings.right;
                rect2.y = canvas.height - watermarkPaddings.tb - imgPaddings.bottom;
            }
            else {
                canvas.height += config.value.watermark.height * canvas.height + 2 * watermarkPaddings.tb;

                rect1.x = imgPaddings.left;
                rect1.y = realImgHeight +
                    imgPaddings.top +
                    imgPaddings.bottom +
                    watermarkPaddings.tb;
                rect2.x = canvas.width - imgPaddings.right;
                rect2.y = canvas.height - watermarkPaddings.tb;
            }

            // 绘制背景
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
            ctx.restore();

            // 绘制阴影
            if (radiusConfig.show) {
                const radius = radiusConfig.size;
                const x = imgPaddings.left + shadowConfig.x;
                const y = imgPaddings.top + shadowConfig.y;
                const width = img.width;
                const height = img.height;

                ctx.beginPath();
                ctx.moveTo(x + radius, y);
                ctx.quadraticCurveTo(x, y, x, y + radius);

                ctx.lineTo(x + width - radius, y);
                ctx.quadraticCurveTo(x + width, y, x + width, y + radius);

                ctx.lineTo(x + width, y + height - radius);
                ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);

                ctx.lineTo(x + radius, y + height);
                ctx.quadraticCurveTo(x, y + height, x, y + height - radius);

                ctx.closePath();
                ctx.fill();
                ctx.restore();
            } else {
                // 绘制直角矩形
                ctx.fillRect(
                    imgPaddings.left + shadowConfig.x,
                    imgPaddings.top + shadowConfig.y,
                    img.width,
                    img.height
                );
            }
            // 绘制阴影
            if (shadowConfig.show) {
                ctx.save();
                ctx.fillStyle = shadowConfig.color;
                ctx.filter = `blur(${shadowConfig.size}px)`;
                ctx.fillRect(
                    imgPaddings.left + shadowConfig.x,
                    imgPaddings.top + shadowConfig.y,
                    realImgWidth,
                    realImgHeight
                );
                ctx.restore();
            }


            // 绘制圆角图片区域
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


            drawCustomLabelsAndImages(ctx, config.value.labels, config.value.images);

            // 绘制辅助线
            if (auxiliaryLines.horizontalCenter) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#FF0000";
                ctx.stroke();

                ctx.restore();
            }
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
                ctx.strokeStyle = "#00FF00";
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
        default:
            configPromise = import("../configs/小米徕卡");
            break;
    }
    configPromise.then(res => {
        let config_value = deepClone(<Config>res.default);
        if (watermark.is_local) {
            let local_value = JSON.parse(watermark.config) as Config;
            // 合并对象
            config_value = Object.assign(config_value, local_value);
        }
        config.value = config_value;
        ElMessage.success(`配置【${watermark.name}】导入成功~`);
    }).catch(err => {
        ElNotification.error({
            title: '导入水印配置失败',
            message: err.message
        })
    })
}

const preview = () => {
    // 获取dom
    const canvasBox = document.getElementById('canvasBox') as HTMLCanvasElement;
    if (!canvasBox) return;

    // 判断最大高度是不是100vh
    if (canvasBox.style.maxHeight === '100vh') {
        // 修改最大高度为100%
        canvasBox.style.maxHeight = window.innerWidth > 768 ? '100vh' : '300px';
    } else {
        // 修改最大高度为100vh
        canvasBox.style.maxHeight = '100vh';
    }
}

function addCustomLabel() {
    config.value?.labels?.unshift(JSON.parse(JSON.stringify(defaultLabelConfig)));
}

function removeCustomLabel(name: string) {
    // 根据name属性删除
    config.value?.labels?.splice(config.value?.labels?.findIndex(item => item.name === name), 1);
}

function addCustomImage() {
    config.value?.images?.unshift(JSON.parse(JSON.stringify(defaultImageConfig)));
}
function removeCustomImage(title: string) {
    // 根据title属性删除
    config.value?.images?.splice(config.value?.images?.findIndex(item => item.title === title), 1);
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


    .img-list {
        padding: 0px;
        gap: 5px;
        display: flex;
        align-items: center;
        flex-shrink: 1;
        position: relative;

        >.btn-box {
            display: flex;
            flex-direction: column;
            position: sticky;
            right: 0px;
            top: 0px;
            background: #FFF;
            z-index: 1;

            >.el-button {
                margin: 2px 0px 2px 2px;
            }
        }

        >.el-image {
            cursor: pointer;
            border: 2px solid transparent;
            border-radius: 10%;
            min-width: 48px;
            width: 48px;
            height: 48px;


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
                transition-duration: 0.5s;
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
    padding: 10px;
    max-height: 100vh;
    transition-duration: 1s;
    width: 100%;

    #imgCanvas {
        border: 1px solid gainsboro;
        max-width: 100%;
        box-sizing: border-box;
        max-height: 100%;
    }

}



@media screen and (max-width: 768px) {
    .box {
        gap: 5px;
        flex-direction: column;
    }

    #canvasBox {
        max-height: 300px;

        #imgCanvas {
            max-height: 100%;
        }
    }


    .config-box {
        width: 100%;
        background-color: #FFF;
        border-radius: 10px 10px 0px 0px;

        .btns {
            justify-content: space-between;
        }
    }
}
</style>