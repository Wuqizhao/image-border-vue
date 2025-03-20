<template>
    <div class="horizontal-scroll">
        <slot></slot>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';

onMounted(() => {
    // 获取dom
    const container = document.querySelector('.horizontal-scroll');
    // 修改鼠标滚动事件为横向
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        container.scrollLeft += e.deltaY;

    });
});
</script>

<style lang="less">
.horizontal-scroll {
    overflow: auto;
    white-space: nowrap;
}
</style>