<template>
	<button
		class="text-danger select-none place-self-center hover:text-[#941616] rounded-none focus:ring-1 ring-offset-[3px] ring-secondary focus:outline-none"
		:class="{ 'focus:ring-offset-0 ring-inset': defaultTitle === 'Tag löschen' }"
		:title="defaultTitle"
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
		defaultTitle = "Löschen";

		created(): void {
			if (this.title) {
				this.defaultTitle = this.title;
			}
		}
	}
</script>
