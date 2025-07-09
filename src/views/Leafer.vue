<template>
	<div class="box">
		<canvas ref="canvas" width="5000px" height="3700px"></canvas>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
const canvas = ref(null);

onMounted(() => {
	if (!canvas.value) return;

	const ctx = canvas.value.getContext("2d");
	ctx.fillStyle = "red";
	ctx.fillRect(0, 0, 5000, 3700);
});
</script>

<style lang="less" scoped>
.box {
	display: flex;
	border: 3px solid salmon;
	max-width: 100%;
	max-height: 90vh;
	padding: 20px;

	canvas {
		max-width: 100%;
		max-height: 100%;
	}
}
</style>
