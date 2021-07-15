<template>
	<button class="text-primary text-xl select-none place-self-center filter hover:brightness-[0.8] ml-2" :title="title" @click="$emit('click')">
		<PsalmIcon :name="icon" />
	</button>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";

	@Component({
		name: "PsalmButton",
		components: { PsalmIcon },
	})
	export default class PsalmButton extends Vue {
		@Prop({ required: true }) icon!: string;
		@Prop({ required: true }) title!: string;
	}
</script>
