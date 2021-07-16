<template>
	<button
		class="flex justify-center text-primary h-6 w-6 text-xl select-none place-self-center rounded-none hover:text-[#29516e] focus:ring-1 ring-offset-[2px] ring-secondary focus:outline-none ml-2"
		:title="title"
		@click="$emit('click')"
	>
		<PsalmIcon :name="icon" class="place-self-center" />
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
