<template>
	<label :name="lableName" :title="lable">
		<p class="text-left font-semibold">{{ lable }}:</p>
		<input class="w-full rounded p-1 px-2" type="text" :value="lastName" @input="$emit('change', 'lastName', $event)" autocomplete="anyrandomstring" />
	</label>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "TextInput",
	})
	export default class TextInput extends Vue {
		@Prop({ required: true }) label!: boolean;
		@Prop({ required: true }) lableName!: string;
		@Prop({ required: true }) inputEmit!: string;
	}
</script>
