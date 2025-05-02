import { defineStore } from "pinia";
import { ref } from "vue";

export const useExifStore = defineStore("exif", () => {
	const localExifList = ref(new WeakMap<File, any>());
	function addExif(file: File, exif: any) {
		localExifList.value.set(file, exif);
	}
	function getExif(file: File) {
		return localExifList.value.get(file);
	}

	return { localExifList, addExif, getExif };
});
