<template>
	<input :checked="value" class="place-self-center rounded text-primary focus:ring-primary focus:border-primary cursor-pointer" @change="updateCheckbox" />
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "Checkbox",
	})
	export default class Checkbox extends Vue {
		// @Prop({ required: true }) type!: string;
		@Prop({ required: true }) value!: boolean;

		updateCheckbox(e: { target: HTMLInputElement }): void {
			this.$emit("input", e.target.checked);
		}
	}
</script>
