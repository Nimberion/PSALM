<template>
	<button
		class="text-danger select-none place-self-center filter hover:brightness-[0.8] rounded-none focus:ring-1 focus:ring-offset-[3px] ring-secondary focus:outline-none"
		:class="{ 'ring-offset-0 ring-inset': title === 'Tag löschen' }"
		:title="title"
		@click="$emit('click')"
	>
		<PsalmIcon name="trash" />
	</button>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";

	@Component({
		name: "PsalmDeleteButton",
		components: { PsalmIcon },
	})
	export default class PsalmDeleteButton extends Vue {
		@Prop({ required: false }) title!: string;

		created(): void {
			if (!this.title) {
				this.title = "Löschen";
			}
		}
	}
</script>
