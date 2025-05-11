<template>
    <div class="container">
        <!-- 画布区域 -->
        <div class="canvas-wrapper">
            <canvas ref="canvas" :width="canvasWidth" :height="canvasHeight"></canvas>
        </div>

        <!-- 设置面板 -->
        <div class="settings-panel">
            <el-form label-width="70px">
                <!-- 文字内容 -->
                <el-card shadow="hover" class="settings-section">
                    <template #header>
                        <div class="settings-header">文字内容</div>
                    </template>
                    <el-input v-model="textContent" type="textarea" :rows="4" placeholder="请输入要练习的文字内容"></el-input>
                </el-card>

                <!-- 网格设置 -->
                <el-card shadow="hover" class="settings-section">
                    <template #header>
                        <div class="settings-header">网格设置</div>
                    </template>
                    <el-form-item label="网格类型">
                        <el-radio-group v-model="gridType">
                            <el-radio label="tian">田字格</el-radio>
                            <el-radio label="mi">米字格</el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="网格颜色">
                        <el-color-picker v-model="gridColor"></el-color-picker>
                    </el-form-item>

                    <el-form-item label="网格宽度">
                        <el-input-number v-model="gridLineWidth" :min="1" :max="10"></el-input-number>
                    </el-form-item>
                </el-card>

                <!-- 文字样式 -->
                <el-card shadow="hover" class="settings-section">
                    <template #header>
                        <div class="settings-header">文字样式</div>
                    </template>
                    <el-form-item label="字号">
                        <el-input-number v-model="fontSize" :min="10" :max="200"></el-input-number>
                    </el-form-item>

                    <el-form-item label="字体颜色">
                        <el-color-picker v-model="fontColor"></el-color-picker>
                    </el-form-item>

                    <el-form-item label="字体">
                        <el-select v-model="fontFamily">
                            <el-option v-for="font in fontList" :key="font" :label="font" :value="font"
                                :style="{ fontFamily: font }"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="字体粗细">
                        <el-radio-group v-model="fontWeight">
                            <el-radio label="normal">细体</el-radio>
                            <el-radio label="bold">粗体</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-card>
            </el-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'

// 响应式数据
const gridType = ref<'tian' | 'mi'>('tian')
const gridColor = ref('#CCCCCC')
const gridLineWidth = ref(1)
const textContent = ref('永和九年，岁在癸丑，暮春之初，会于会稽山阴之兰亭，修禊事也。')
const canvasWidth = ref(document.documentElement.clientWidth - 40)
const canvasHeight = ref(600)

// 计算画布高度
function calculateCanvasHeight() {
    // 固定高度为父容器高度
    const container = document.querySelector('.canvas-wrapper')
    if (container) {
        canvasHeight.value = container.clientHeight - 20 // 减去padding
    }
}

// 初始化绘制
onMounted(() => {
    calculateCanvasHeight()
    drawCanvas()
    window.addEventListener('resize', handleResize)
})

// 清理
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
const fontSize = ref(50)
const fontColor = ref('#000000')
const fontFamily = ref('楷体')
const fontWeight = ref('normal')

// 窗口resize处理函数
const handleResize = () => {
    calculateCanvasHeight()
    drawCanvas()
}
const canvas = ref<HTMLCanvasElement | null>(null)

// 可用字体列表
const fontList = ref([
    '楷体',
    '华文行楷',
    '微软雅黑',
    '宋体',
    '黑体',
    'Arial',
    'Times New Roman'
])

// 绘制函数
function drawCanvas() {
    if (!canvas.value) return

    const ctx = canvas.value.getContext('2d')
    if (!ctx) return

    // 清空画布
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)

    // 始终绘制网格
    drawGrid(ctx)

    // 有文字时才绘制文字
    if (textContent.value && textContent.value.trim().length > 0) {
        drawText(ctx)
    }
}

// 绘制虚线辅助函数
function drawDashedLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
    const dashLength = 5
    const dx = x2 - x1
    const dy = y2 - y1
    const distance = Math.sqrt(dx * dx + dy * dy)
    const dashCount = Math.floor(distance / dashLength)
    const xInc = dx / dashCount
    const yInc = dy / dashCount

    ctx.beginPath()
    for (let i = 0; i < dashCount; i += 2) {
        const startX = x1 + (xInc * i)
        const startY = y1 + (yInc * i)
        const endX = x1 + (xInc * (i + 1))
        const endY = y1 + (yInc * (i + 1))
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
    }
    ctx.stroke()
}

// 获取单元格大小（统一用于网格和文字）
function getCellSize() {
    return fontSize.value * 1.5
}

// 绘制网格
function drawGrid(ctx: CanvasRenderingContext2D) {
    if (!canvas.value) return
    
    const cellSize = getCellSize()
    const cols = Math.max(1, Math.floor(canvas.value.width / cellSize))
    const rows = Math.max(1, Math.floor(canvas.value.height / cellSize))

    // 调整画布尺寸为单元格的整数倍
    canvas.value.width = cols * cellSize
    canvas.value.height = rows * cellSize

    ctx.strokeStyle = gridColor.value
    ctx.lineWidth = gridLineWidth.value

    // 绘制田字格/米字格
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            const x = j * cellSize
            const y = i * cellSize

            // 单元格边框 - 实线
            ctx.strokeRect(x, y, cellSize, cellSize)

            if (gridType.value === 'tian') {
                // 田字格中心线 - 虚线
                drawDashedLine(ctx, x, y + cellSize / 2, x + cellSize, y + cellSize / 2)
                drawDashedLine(ctx, x + cellSize / 2, y, x + cellSize / 2, y + cellSize)
            } else {
                // 米字格对角线 - 虚线
                drawDashedLine(ctx, x, y, x + cellSize, y + cellSize)
                drawDashedLine(ctx, x, y + cellSize, x + cellSize, y)
                
                // 米字格中心线 - 虚线
                drawDashedLine(ctx, x, y + cellSize / 2, x + cellSize, y + cellSize / 2)
                drawDashedLine(ctx, x + cellSize / 2, y, x + cellSize / 2, y + cellSize)
            }
        }
    }
}

// 绘制文字
function drawText(ctx: CanvasRenderingContext2D) {
    if (!textContent.value || !canvas.value) return

    const cellSize = getCellSize()
    const cols = Math.floor(canvas.value.width / cellSize)
    const rows = Math.floor(canvas.value.height / cellSize)

    ctx.font = `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`
    ctx.fillStyle = fontColor.value
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const textArray = textContent.value.split('')
    let currentCol = 0
    let currentRow = 0

    for (const char of textArray) {
        // 自动换行
        if (currentCol >= cols) {
            currentCol = 0
            currentRow++
            
            // 超出画布高度则停止绘制
            if (currentRow >= rows) break
        }

        const x = currentCol * cellSize + cellSize / 2
        const y = currentRow * cellSize + cellSize / 2

        ctx.fillText(char, x, y)
        currentCol++
    }
}

// 监听变化重绘
watch([
    gridType, gridColor, gridLineWidth,
    textContent, fontSize, fontColor, fontFamily, fontWeight
], () => {
    calculateCanvasHeight()
    drawCanvas()
})

// 初始化绘制
onMounted(() => {
    calculateCanvasHeight()
    drawCanvas()
    window.addEventListener('resize', handleResize)
})

// 清理
onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.container {
    display: flex;
    height: calc(100vh - 40px);
    padding: 20px;
    gap: 20px;
}

.canvas-wrapper {
    flex: 1;
    border: 1px solid #eee;
    padding: 10px;
    background: white;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    overflow: auto;
    position: relative;
    min-height: 500px;

    canvas {
        background: white;
        display: block;
        /* position: absolute; */
        /* top: 50%; */
        /* left: 50%; */
        /* transform: translate(-50%, -50%); */
    }
}

.settings-panel {
    width: 380px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-right: 10px;
}

.settings-section {
    margin-bottom: 20px;
}

.settings-header {
    font-weight: 500;
    color: var(--el-text-color-primary);
}

@media (max-width: 992px) {
    .container {
        flex-direction: column;
        height: auto;
    }

    .canvas-wrapper {
        width: 100%;
        height: 500px;
    }

    .settings-panel {
        width: 100%;
    }
}
</style>