<template>
    <div class="container flex">
        <div class="img" @mousemove="onMousemove">
            <img src="../../public/logos/avatar1.png" alt="" ref="img">
            <div ref="small" class="small"></div>
        </div>
        <div class="prev">
            <img src="../../public/logos/avatar1.png" alt="" ref="prevImg">
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const scale = ref(1);
const img = ref(null);
const small = ref(null);
const prevImg = ref(null);
const offsetX = ref(0);
const offsetY = ref(0);

function checkElements() {
    if (!img.value) throw new Error('找不到图片...');
    if (!small.value) throw new Error('找不到取景框...');
    if (!prevImg.value) throw new Error('找不到预览图...');
}

onMounted(() => {
    checkElements();
    const imgWidth = img.value.offsetWidth;
    const smallWidth = small.value.offsetWidth;

    scale.value = imgWidth / smallWidth;
    prevImg.value.style.transform = `scale(${scale.value})`;
})

function onMousemove(e) {
    checkElements();
    offsetX.value = Math.max(0, e.offsetX);
    offsetY.value = Math.max(0, e.offsetY);

    const imgWidth = img.value.offsetWidth;
    const imgHeight = img.value.offsetHeight;
    const smallWidth = small.value.offsetWidth;
    const smallHeight = small.value.offsetHeight;

    updatePrev({ offsetX: offsetX.value, offsetY: offsetY.value, imgWidth, imgHeight, smallWidth, smallHeight });
}

function updatePrev({ offsetX, offsetY, imgWidth, imgHeight, smallWidth, smallHeight }) {
    const position = {
        x: Math.max(0, Math.min(offsetX - smallWidth / 2, imgWidth - smallWidth)),
        y: Math.max(0, Math.min(offsetY - smallHeight / 2, imgHeight - smallHeight)),
    }

    small.value.style.transform = `translate(${position.x}px, ${position.y}px)`;
    prevImg.value.style.transform = `translate(${-(position.x - smallWidth) * scale.value}px, ${-(position.y - smallHeight) * scale.value}px) scale(${scale.value})`;
}
</script>

<style lang='less' scoped>
.container {
    width: 100%;
    height: 700px;
    display: flex;
    justify-content: center;
    border: 1px rgb(0, 0, 0) solid;
    flex-direction: column;
    align-items: center;
    gap: 10px;
}

img {
    width: 100%;
    vertical-align: bottom;
}

.img {
    width: 300px;
    height: 300px;
    border: 2px solid gray;
    position: relative;
    cursor: move;
    display: flex;


    .small {
        width: 100px;
        height: 100px;
        border: 1.5px solid rgba(127, 255, 212, 1);
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(127, 255, 212, 0.382);
        z-index: 10;
        pointer-events: none;
        box-sizing: border-box;
    }
}

.prev {
    width: 300px;
    height: 300px;
    border: 1.5px dashed gray;
    overflow: hidden;
    position: relative;
    display: flex;

    img {
        position: absolute;
        top: 0;
        right: 0;
    }
}
</style>