<template>
	<label :name="labelName" :title="label">
		<p class="text-left font-semibold">{{ label }}:</p>
		<input class="w-full rounded p-1 px-2" type="text" :value="value" @input="$emit('change', inputEmit, $event)" autocomplete="anyrandomstring" />
	</label>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "TextInput",
	})
	export default class TextInput extends Vue {
		@Prop({ required: true }) label!: boolean;
		@Prop({ required: true }) labelName!: string;
		@Prop({ required: true }) inputEmit!: string;
		@Prop({ required: true }) value!: string;
	}
</script>
