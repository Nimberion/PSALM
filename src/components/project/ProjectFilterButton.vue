<template>
	<button
		class="w-full flex justify-center place-items-center text-black select-none focus:ring-secondary rounded-none focus:ring-1 focus:outline-none p-0"
		:class="{
			stripes: (activeFilter.dayId !== dayId || activeFilter.column !== column) && activeFilter.dayId !== '',
		}"
		:title="updateTitle()"
		@click="toggleFilter"
	>
		<span class="text-xs mr-[0.125rem]">{{ columnTitle }}</span>

		<!-- FILTER ICON -->
		<svg
			class="text-gray-500 text-[0.9rem]"
			:class="{
				'text-secondary': activeFilter.dayId === dayId && activeFilter.column === column,
			}"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			focusable="false"
			height="1em"
			enable-background="new 0 0 24 24"
			viewBox="0 0 24 24"
			fill="currentColor"
		>
			<g>
				<path d="M0,0h24 M24,24H0" fill="none" />
				<path d="M3,4c2.01,2.59,7,9,7,9v7h4v-7c0,0,4.98-6.41,7-9H3z" />
				<path d="M0,0h24v24H0V0z" fill="none" />
			</g>
		</svg>
	</button>
</template>

<script lang="ts">
	import { ActiveFilter } from "@/models/interfaces/ActiveFilter";
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({
		name: "ProjectFilterButton",
		components: {},
	})
	export default class ProjectFilterButton extends Vue {
		@Prop({ required: true }) column!: string; //available or deployed
		@Prop({ required: true }) dayId!: string;
		@Prop({ required: true }) activeFilter!: ActiveFilter;

		columnTitle = "";

		created(): void {
			if (this.column === "available") {
				this.columnTitle = "Kann";
			} else {
				this.columnTitle = "Ist";
			}
		}

		updateTitle(): string {
			if (this.activeFilter.dayId === this.dayId && this.activeFilter.column === this.column) {
				return "Filter deaktivieren";
			} else {
				if (this.column === "available") {
					return "Nur verfügbare Mitarbeiter anzeigen";
				} else {
					return "Nur eingeteilte Mitarbeiter anzeigen";
				}
			}
		}

		toggleFilter(): void {
			this.$emit("click");
			this.updateTitle;
		}
	}
</script>

<style scoped>
	.stripes {
		background: repeating-linear-gradient(-45deg, #f8d3be, #f8d3be 1px, transparent 2px, transparent 5px) !important;
	}
</style>
