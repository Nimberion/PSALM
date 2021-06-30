<template>
	<input v-if="type === 'checkbox'" type="checkbox" :checked="value" class="place-self-center rounded text-primary focus:ring-primary focus:border-primary cursor-pointer" @change="update" />
	<input
		v-else-if="type === 'number'"
		type="number"
		:value="value"
		min="0"
		max="99"
		class="appearance rounded focus:ring-primary focus:ring-2 border-0 focus:border-0 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-input p-0"
		autocomplete="randomStuffToDisable"
		@focus="$event.target.select()"
		@change="update"
	/>
	<input
		v-else-if="type === 'text'"
		type="text"
		:value="value"
		class="rounded focus:ring-primary focus:ring-2 border-0 focus:border-0 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-input p-0 px-1"
		autocomplete="randomStuffToDisable"
		@change="update"
		@dblclick="$emit(dblclick)"
	/>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "PsalmInput",
	})
	export default class PsalmInput extends Vue {
		@Prop({ required: true }) type!: string;
		@Prop({ required: false }) dblclick!: string;
		@Prop({ required: true }) value!: string | boolean;

		update(e: { target: HTMLInputElement }): void {
			switch (this.type) {
				case "checkbox":
					this.$emit("input", e.target.checked as boolean);
					break;
				case "number":
					this.$emit("input", e.target.valueAsNumber);
					break;
				case "text":
					this.$emit("input", e.target.value);
					break;
			}
		}
	}
</script>

<style scoped>
	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}
</style>
