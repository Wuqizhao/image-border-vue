<template>
    <div class="container">
        <h2>图片分割工具</h2>

        <div class="main-content">
            <div class="left-panel">
                <div class="controls">
                    <el-button v-if="currentImage" @click="exportGrid" type="primary" :loading="exporting">
                        {{ splitMode === 'grid' ? '导出九宫格' : '导出三等分' }}
                    </el-button>

                    <router-link to="/">
                        <el-button>返回水印边框</el-button>
                    </router-link>
                </div>
                <div class="mode-selector">
                    <el-radio-group v-model="splitMode">
                        <el-radio label="grid">九宫格</el-radio>
                        <el-radio label="three">水平三等分</el-radio>
                    </el-radio-group>
                </div>

                <div class="upload-section">
                    <el-upload class="image-uploader" :auto-upload="false" :show-file-list="false"
                        :on-change="handleFileChange" :before-upload="beforeUpload" multiple accept="image/*" drag>
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            拖拽图片到此处或 <em>点击上传</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                支持多张图片上传
                            </div>
                        </template>
                    </el-upload>
                </div>

                <div v-if="imageList.length > 0" class="image-list">
                    <el-scrollbar>
                        <div class="image-list-inner">
                            <div v-for="(image, index) in imageList" :key="index" class="image-item"
                                :class="{ active: currentImageIndex === index }" @click="selectImage(index)">
                                <el-image :src="image.url" fit="cover" :title="image.file.name">
                                    <template #placeholder>
                                        <div class="image-slot">
                                            <el-icon class="is-loading">
                                                <loading />
                                            </el-icon>
                                        </div>
                                    </template>
                                    <template #error>
                                        <div class="image-slot">
                                            <el-icon><picture-filled /></el-icon>
                                        </div>
                                    </template>
                                </el-image>
                                <el-icon class="delete-icon" @click.stop="removeImage(index)">
                                    <delete />
                                </el-icon>
                            </div>
                        </div>
                    </el-scrollbar>
                </div>
            </div>

            <div class="right-panel">
                <div v-if="currentImage" class="preview-container">
                    <canvas ref="previewCanvas" :width="canvasWidth" :height="canvasHeight"
                        class="preview-canvas"></canvas>
                    <div class="preview-overlay" v-if="loading">
                        <el-icon class="is-loading">
                            <loading />
                        </el-icon>
                        <span class="loading-text">图片处理中...</span>
                    </div>
                </div>
                <div v-else class="empty-preview">
                    <el-icon><picture-filled /></el-icon>
                    <p>请选择或上传图片</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage, type UploadFile } from 'element-plus';
import { nextTick, ref, watch } from 'vue';
import { UploadFilled, PictureFilled, Delete, Loading } from '@element-plus/icons-vue';

interface ImageItem {
    file: File;
    url: string;
    image: HTMLImageElement;
}

// const inputRef = ref<HTMLInputElement | null>(null);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const imageList = ref<ImageItem[]>([]);
const currentImageIndex = ref(-1);
const currentImage = ref<HTMLImageElement | null>(null);

const canvasWidth = ref(0);
const canvasHeight = ref(0);
const scale = ref(1);
const splitMode = ref('grid');
const loading = ref(false);
const exporting = ref(false);

// 上传前检查
const beforeUpload = () => {
    return true;
};

// 处理文件选择
const handleFileChange = async (file: UploadFile) => {
    loading.value = true;
    try {
        const imageItem = await loadImage(file.raw!);
        imageList.value.push(imageItem);

        // 如果是第一张图片，自动选中
        // if (imageList.value.length === 1) {
        selectImage(0);
        // }

        ElMessage.success('图片添加成功');
    } catch (error) {
        ElMessage.error('图片加载失败，请重试');
    } finally {
        loading.value = false;
    }
};

// 加载图片
const loadImage = (file: File): Promise<ImageItem> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        const image = new Image();

        // 添加超时处理
        const timeout = setTimeout(() => {
            reject(new Error('图片加载超时'));
        }, 30000);

        reader.onload = () => {
            image.onload = () => {
                clearTimeout(timeout);
                resolve({
                    file,
                    url: reader.result as string,
                    image
                });
            };
            image.onerror = () => {
                clearTimeout(timeout);
                reject(new Error('图片加载失败'));
            };
            image.src = reader.result as string;
        };
        reader.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('文件读取失败'));
        };
        reader.readAsDataURL(file);
    });
};

// 选择图片
const selectImage = (index: number) => {
    if (index >= 0 && index < imageList.value.length) {
        loading.value = true;
        currentImageIndex.value = index;
        currentImage.value = imageList.value[index].image;
        calculateDimensions(currentImage.value);
        nextTick(()=>{
            drawImageWithGrid(currentImage.value!);
        })
        loading.value = false;
    }
};

// 移除图片
const removeImage = (index: number) => {
    imageList.value.splice(index, 1);
    if (currentImageIndex.value === index) {
        // 如果删除的是当前选中的图片，选择新的图片
        if (imageList.value.length > 0) {
            selectImage(Math.min(index, imageList.value.length - 1));
        } else {
            currentImageIndex.value = -1;
            currentImage.value = null;
        }
    } else if (currentImageIndex.value > index) {
        // 如果删除的图片在当前图片之前，更新索引
        currentImageIndex.value--;
    }
};

// 计算画布尺寸
const calculateDimensions = (image: HTMLImageElement) => {
    const maxWidth = 800;
    const maxHeight = 800;

    let targetWidth = image.width;
    let targetHeight = image.height;

    // 如果图片尺寸超过限制，按比例缩小
    if (image.width > maxWidth || image.height > maxHeight) {
        const widthRatio = maxWidth / image.width;
        const heightRatio = maxHeight / image.height;
        const ratio = Math.min(widthRatio, heightRatio);

        targetWidth = image.width * ratio;
        targetHeight = image.height * ratio;
    }

    // 确保尺寸为整数
    canvasWidth.value = Math.floor(targetWidth);
    canvasHeight.value = Math.floor(targetHeight);
    scale.value = canvasWidth.value / image.width;
};

// 绘制网格线
const drawGridLines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;

    if (splitMode.value === 'grid') {
        // 九宫格模式
        const xStep = canvasWidth.value / 3;
        const yStep = canvasHeight.value / 3;

        // 垂直线
        [1, 2].forEach(i => {
            ctx.beginPath();
            ctx.moveTo(xStep * i, 0);
            ctx.lineTo(xStep * i, canvasHeight.value);
            ctx.stroke();
        });

        // 水平线
        [1, 2].forEach(i => {
            ctx.beginPath();
            ctx.moveTo(0, yStep * i);
            ctx.lineTo(canvasWidth.value, yStep * i);
            ctx.stroke();
        });
    } else {
        // 水平三等分模式
        const yStep = canvasHeight.value / 3;
        [1, 2].forEach(i => {
            ctx.beginPath();
            ctx.moveTo(0, yStep * i);
            ctx.lineTo(canvasWidth.value, yStep * i);
            ctx.stroke();
        });
    }
};

// 绘制图片和网格线
const drawImageWithGrid = (image: HTMLImageElement) => {
    if (!previewCanvas.value?.getContext('2d')) return;

    const ctx = previewCanvas.value.getContext('2d')!;
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);

    // 使用 requestAnimationFrame 优化渲染性能
    requestAnimationFrame(() => {
        ctx.drawImage(image, 0, 0, canvasWidth.value, canvasHeight.value);
        drawGridLines(ctx);
    });
};

// 导出图片
const exportGrid = async () => {
    if (!currentImage.value) {
        ElMessage.error('请先选择图片再操作~');
        return;
    }

    exporting.value = true;
    try {
        const image = currentImage.value;
        const originalWidth = image.width;
        const originalHeight = image.height;

        if (splitMode.value === 'grid') {
            // 导出九宫格
            const cellWidth = originalWidth / 3;
            const cellHeight = originalHeight / 3;

            for (let i = 0; i < 9; i++) {
                const row = Math.floor(i / 3);
                const col = i % 3;

                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = cellWidth;
                tempCanvas.height = cellHeight;
                const tempCtx = tempCanvas.getContext('2d')!;

                tempCtx.drawImage(
                    image,
                    col * cellWidth, row * cellHeight, cellWidth, cellHeight,
                    0, 0, cellWidth, cellHeight
                );

                const link = document.createElement('a');
                link.download = `grid_${row}_${col}.jpeg`;
                link.href = tempCanvas.toDataURL('image/jpeg', 0.97);
                link.click();

                // 添加小延迟，避免浏览器下载限制
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } else {
            // 导出水平三等分
            const cellHeight = originalHeight / 3;

            for (let i = 0; i < 3; i++) {
                const tempCanvas = document.createElement('canvas');
                tempCanvas.width = originalWidth;
                tempCanvas.height = cellHeight;
                const tempCtx = tempCanvas.getContext('2d')!;

                tempCtx.drawImage(
                    image,
                    0, i * cellHeight, originalWidth, cellHeight,
                    0, 0, originalWidth, cellHeight
                );

                const link = document.createElement('a');
                link.download = `horizontal_${i + 1}.jpeg`;
                link.href = tempCanvas.toDataURL('image/jpeg', 0.97);
                link.click();

                // 添加小延迟，避免浏览器下载限制
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        ElMessage.success('导出完成');
    } catch (error) {
        ElMessage.error('导出失败，请重试');
    } finally {
        exporting.value = false;
    }
};

// 监听模式变化
watch([scale, splitMode], () => {
    if (currentImage.value) {
        drawImageWithGrid(currentImage.value);
    }
});
</script>

<style lang="less" scoped>
.container {
    max-width: 90%;
    margin: 0rem auto;
    padding: 1rem;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
}

.main-content {
    display: flex;
    gap: 2rem;
    justify-content: space-between;
    padding-bottom: 1rem;

    @media (max-width: 1024px) {
        flex-direction: column;
    }
}

.left-panel {
    flex: 0 0 400px;

    @media (max-width: 1024px) {
        flex: none;
        width: 100%;
    }
}

.right-panel {
    border: 5px solid gainsboro;
    border-radius: 5px;

    canvas {
        width: 100%;
    }
}

.upload-section {
    margin: 0.5rem 0;

    :deep(.el-upload-dragger) {
        width: 100%;
    }
}

.image-list {
    width: 100%;
    border: 1px solid #eee;
    border-radius: 4px;

    .image-list-inner {
        display: flex;
        gap: 1rem;
        padding: 0.5rem;
    }

    .image-item {
        position: relative;
        width: 64px;
        height: 64px;
        border-radius: 4px;
        overflow: hidden;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.3s ease;

        &:hover {
            border-color: #409eff;

            .delete-icon {
                opacity: 1;
            }
        }

        &.active {
            border-color: #409eff;
        }

        .el-image {
            width: 100%;
            height: 100%;
        }

        .delete-icon {
            position: absolute;
            top: 4px;
            right: 4px;
            padding: 4px;
            background: rgba(0, 0, 0, 0.5);
            border-radius: 50%;
            color: #fff;
            opacity: 0;
            transition: opacity 0.3s ease;

            &:hover {
                background: rgba(0, 0, 0, 0.7);
            }
        }
    }
}

.preview-container {
    position: relative;
    margin: 0;
    border: 1px solid #eee;
    border-radius: 4px;
    overflow: hidden;
    background: #f5f7fa;

    .preview-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 1rem;

        .el-icon {
            font-size: 2rem;
            color: #409eff;
        }

        .loading-text {
            color: #409eff;
            font-size: 1rem;
        }
    }
}

.empty-preview {
    height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #f5f7fa;
    border: 1px solid #eee;
    border-radius: 4px;
    color: #909399;

    .el-icon {
        font-size: 4rem;
        margin-bottom: 1rem;
    }

    p {
        margin: 0;
        font-size: 1rem;
    }
}

.preview-canvas {
    display: block;
    max-width: 100%;
    height: auto;
}

.mode-selector {
    margin: 1rem 0;
}

.controls {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.image-slot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background: #f5f7fa;
    color: #909399;

    .el-icon {
        font-size: 1.5rem;
    }
}
</style>