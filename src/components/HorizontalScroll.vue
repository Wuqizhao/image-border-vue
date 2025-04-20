<template>
    <div ref="container" class="horizontal-scroll">
        <slot></slot>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';

const container = ref<HTMLElement | null>(null);

onMounted(() => {
    if (!container.value) return;
    // 监听滚动事件
    container.value.addEventListener('wheel', (e) => {
        if(!container.value) return;
        e.preventDefault();
        container.value.scrollLeft += e.deltaY;
    });
});

onUnmounted(() => {
    if (!container.value) return;
    container.value.removeEventListener('wheel', () => {});
});
</script>

<style lang="less">
.horizontal-scroll {
    overflow: auto;
    white-space: nowrap;
    scroll-behavior: smooth;
    display: flex;

    &::-webkit-scrollbar {
        display: none;
    }

    &::-webkit-scrollbar-thumb {
        display: none;
    }
}
</style>