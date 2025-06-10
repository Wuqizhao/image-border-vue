<template>
    <div class="flex-space-between">
        <canvas ref="imgCanvas" width="1000" height="800"></canvas>

        <div>
        <p>{{ fabricCanvas }}</p>
            <el-button type="primary" size="default" @click="d">绘制</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Canvas, FabricImage, FabricText } from 'fabric';

const imgCanvas = ref<HTMLCanvasElement | null>(null);

const fabricCanvas = ref<Canvas | null>(null);
function d() {
    if (!imgCanvas.value) return;

    if (fabricCanvas.value == null) {
        fabricCanvas.value = new Canvas(imgCanvas.value, {
            backgroundColor: '#fff',
            selection: true  // 启用选择
        });
    }

    const img1 = FabricImage.fromURL('https://img-s.msn.cn/tenant/amp/entityid/BB1msB1Q?w=0&h=0&q=60&m=6&f=jpg&u=t', {
        crossOrigin: 'anonymous'
    });

    img1.then(img => {
        img.set({
            left: 0,
            top: 0,
            // width: 600,
            // height: 400,
            selectable: true,
            scaleX: 0.2,
            scaleY: 0.2,
            hasRotatingPoint: true,
            evented: true,
        });
        if (fabricCanvas.value) fabricCanvas.value.add(img);
    });


    const text = new FabricText('cnm中国男足', {
        backgroundColor: 'red',
        left: 150,
        top: 150,
        fontSize: 20,
        fill: '#fff',
    });
    const text2 = new FabricText("哈哈哈", {
        left: 20,
        top: 200,
        evented: true,
        selectable: true,
    });




    fabricCanvas.value.add(text);
    fabricCanvas.value.add(text2);

    // fabricCanvas.value.setActiveObject(text2);
    fabricCanvas.value.renderAll();

    console.log('fabricCanvas', (fabricCanvas.value));
}

onMounted(() => {
    d()
});
</script>

<style lang='less' scoped>
.flex-space-between {
    display: flex;
    justify-content: space-between;
}

canvas {
    border: 3px solid rgb(213, 213, 213);
    max-height: 100vh;
    max-width: 100%;
    padding: 2px;
}
</style>