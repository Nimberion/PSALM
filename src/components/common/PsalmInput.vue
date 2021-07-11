<template>
	<input
		v-if="type === 'checkbox'"
		type="checkbox"
		:checked="value"
		class="place-self-center rounded text-primary focus:ring-primary focus:border-primary cursor-pointer"
		:class="{ 'cursor-default text-gray-500': state === 'disabled' }"
		:disabled="state"
		@change="update"
	/>
	<input
		v-else-if="type === 'number'"
		type="number"
		:value="value"
		min="0"
		max="99"
		class="bg-info-200 border-0 focus:bg-highlight focus:ring-0 p-0 px-1"
		autocomplete="randomStuffToDisable"
		@focus="$event.target.select()"
		@change="update"
	/>
	<!-- <input
		v-else-if="type === 'text'"
		type="text"
		:value="value"
		class="rounded focus:ring-primary focus:ring-2 border-0 focus:border-0 focus:-translate-x-1 focus:-translate-y-1 focus:shadow-input p-0 px-1"
		autocomplete="randomStuffToDisable"
		@change="update"
	/> -->
	<!-- <div  class="relative w-full"> -->
	<input v-else-if="type === 'text'" type="text" :value="value" class="bg-transparent border-0 focus:ring-0 p-0 px-1 soft-edges" autocomplete="randomStuffToDisable" @change="update" spellcheck="false" />
	<!-- <div class="absolute h-full w-full left-0 top-0 blur-sm bg-info-200 bg-opacity-30 z-0"></div> -->
	<!-- </div> -->
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "PsalmInput",
	})
	export default class PsalmInput extends Vue {
		@Prop({ required: true }) type!: string;
		@Prop({ required: true }) value!: string | boolean;
		@Prop({ required: false }) state!: string;

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

	.soft-edges:focus {
		/* background: radial-gradient(circle at bottom left, whsite 0%, transparent 50%); */
		background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.4) 5%, transparent 100%);
	}
</style>
