<template>
	<input
		v-if="type === 'checkbox'"
		type="checkbox"
		:checked="value"
		class="h-[1.125rem] w-[1.125rem] place-self-center border-2 border-primary text-primary focus:ring-secondary focus:ring-1 cursor-pointer"
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
		class="text-center focus:border-secondary focus:ring-0 overflow-ellipsis"
		autocomplete="randomStuffToDisable"
		@focus="$event.target.select()"
		@change="update"
	/>

	<input v-else-if="type === 'text'" type="text" :value="value" class="focus:border-secondary focus:ring-0 px-1 overflow-ellipsis" autocomplete="randomStuffToDisable" @change="update" spellcheck="false" />
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

	input[type="number"],
	input[type="text"] {
		padding: 0 0.25rem;
	}
</style>
