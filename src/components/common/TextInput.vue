<template>
	<input :value="value" class="rounded focus:ring-primary focus:ring-2 border-0 focus:border-0 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-input p-0 px-1" @change="updateText" />
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "TextInput",
	})
	export default class TextInput extends Vue {
		@Prop({ required: true }) value!: string;

		updateText(e: { target: HTMLInputElement }): void {
			this.$emit("input", e.target.value);
		}
	}
</script>
