<template>
	<input type="text" class="rounded focus:ring-primary focus:ring-2 border-0 focus:border-0 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-input p-0 px-1" />
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "TextInput",
	})
	export default class TextInput extends Vue {
		// @Prop({ required: true }) type!: string;
		// @Prop({ required: true }) value!: string;
		// updateCheckbox(): void {
		// 	this.$emit("input", !this.value);
		// }
		// updateText(value: string): void {
		// 	console.log(value as string);
		// 	this.$emit("input", this.value as string);
		// }
	}
</script>
