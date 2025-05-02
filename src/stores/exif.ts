import { defineStore } from "pinia";
import { ref } from "vue";

export const useExifStore = defineStore("exif", () => {
	const localExifList = ref(new WeakMap<String, any>());
	function addExif(file: File, exif: any) {
		// 生成一个唯一的key
		const key = generateId(file);
		localExifList.value.set(key, exif);
	}
	function getExif(file: File) {
		return localExifList.value.get(generateId(file));
	}

	// 生成id
	function generateId(file: File) {
		return file.name + file.lastModified;
	}

	return { localExifList, addExif, getExif };
});
