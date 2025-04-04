<template>
    <div class="container">
        <h2>九宫格分割工具</h2>

        <input type="file" ref="inputRef" accept="image/*" @change="handleImageUpload" class="upload-input">

        <div class="preview-container">
            <canvas ref="previewCanvas" :width="canvasWidth" :height="canvasHeight" class="preview-canvas"></canvas>
        </div>

        <div class="controls">
            <el-button @click="exportGrid" type="primary">导出九宫格</el-button>

            <router-link to="/">
                <el-button>返回水印边框</el-button>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, onMounted, watch } from 'vue';

const inputRef = ref<HTMLInputElement | null>(null);
const previewCanvas = ref<HTMLCanvasElement | null>(null);
const img = ref<HTMLImageElement | null>(null);

const canvasWidth = ref(0);
const canvasHeight = ref(0);
const scale = ref(1);

// 图片加载处理
const handleImageUpload = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];

    if (!file || !previewCanvas.value || !previewCanvas.value.getContext) return;

    const reader = new FileReader();
    reader.onload = () => {
        const image = new Image();
        image.onload = () => {
            img.value = image;
            calculateDimensions(image);
            drawImageWithGrid(image);
        };
        image.src = reader.result as string;
    };
    reader.readAsDataURL(file);
};

// 计算画布尺寸
const calculateDimensions = (image: HTMLImageElement) => {
    const maxWidth = 800;
    const maxHeight = 800;

    if (image.width > maxWidth || image.height > maxHeight) {
        const widthRatio = maxWidth / image.width;
        const heightRatio = maxHeight / image.height;
        scale.value = Math.min(widthRatio, heightRatio);
    } else {
        scale.value = 1;
    }

    canvasWidth.value = image.width * scale.value;
    canvasHeight.value = image.height * scale.value;
};

// 绘制图片和网格线
const drawImageWithGrid = (image: HTMLImageElement) => {
    if (!previewCanvas.value?.getContext('2d')) return;

    const ctx = previewCanvas.value.getContext('2d')!;
    ctx.clearRect(0, 0, canvasWidth.value, canvasHeight.value);
    ctx.drawImage(image, 0, 0, canvasWidth.value, canvasHeight.value);
    drawGridLines(ctx);
};

// 绘制网格线
const drawGridLines = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 3;

    // 垂直线
    const xStep = canvasWidth.value / 3;
    [1, 2].forEach(i => {
        ctx.beginPath();
        ctx.moveTo(xStep * i, 0);
        ctx.lineTo(xStep * i, canvasHeight.value);
        ctx.stroke();
    });

    // 水平线
    const yStep = canvasHeight.value / 3;
    [1, 2].forEach(i => {
        ctx.beginPath();
        ctx.moveTo(0, yStep * i);
        ctx.lineTo(canvasWidth.value, yStep * i);
        ctx.stroke();
    });
};

// 导出九宫格
const exportGrid = () => {
    if (!img.value) {
        ElMessage.error('请先选择图片再操作~');
        return;
    }

    const originalWidth = img.value.width;
    const originalHeight = img.value.height;
    const cellWidth = originalWidth / 3;
    const cellHeight = originalHeight / 3;

    Array.from({ length: 9 }).forEach((_, index) => {
        const row = Math.floor(index / 3);
        const col = index % 3;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = cellWidth;
        tempCanvas.height = cellHeight;
        const tempCtx = tempCanvas.getContext('2d')!;

        // 直接从原始图片裁剪，而不是从预览画布
        tempCtx.drawImage(
            img.value!,
            col * cellWidth, row * cellHeight, cellWidth, cellHeight,
            0, 0, cellWidth, cellHeight
        );

        const link = document.createElement('a');
        link.download = `grid_${row}_${col}.jpeg`;
        // 使用PNG格式并指定质量为1.0（最高质量）
        link.href = tempCanvas.toDataURL('image/jpeg', 0.97);
        link.click();
    });
};

// 生命周期钩子
onMounted(() => {
    inputRef.value?.addEventListener('change', handleImageUpload);
});

watch(scale, () => {
    drawImageWithGrid(img.value!);
});
</script>

<style lang="less" scoped>
.container {
    max-width: 1000px;
    margin: 1rem auto;
    // padding: 10px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.preview-container {
    position: relative;
    margin: 1.5rem 0;
    border: 1px solid #eee;
    overflow: hidden;
}

.preview-canvas {
    display: block;
    max-width: 100%;
    height: auto;
}

.upload-input {
    display: block;
    width: 100%;
    padding: 0.8rem;
    margin-bottom: 1.5rem;
    border: 2px dashed #ddd;
    border-radius: 4px;
    transition: border-color 0.3s ease;

    &:hover {
        border-color: #66afe9;
    }
}

.action-btn {
    padding: 0.6rem 1.2rem;
    background: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: opacity 0.3s ease;

    &:hover {
        opacity: 0.9;
    }
}

.controls {
    display: flex;
    gap: 10px;
}
</style>