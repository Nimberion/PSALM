<template>
	<button class="w-full flex justify-center place-items-center text-black select-none focus:ring-secondary rounded-none focus:ring-1 focus:outline-none p-0" :title="buttonTitle" @click="getTitle">
		<span class="text-xs mr-[0.125rem]">{{ prefix }}</span>
		<!-- FILTER ICON -->
		<!--'text-warning': currentAvailability === 'RESERVE',
			'text-success': currentAvailability === 'TRUE' && column !== 'available', -->

		<svg
			class="text-gray-500 text-[0.9rem]"
			:class="{
				'text-secondary': currentFilter === day.id,
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
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { ProjectDay } from "@/models/interfaces/Project";

	@Component({
		name: "ProjectFilterButton",
		components: {},
	})
	export default class ProjectFilterButton extends Vue {
		@Prop({ required: true }) column!: string; //available or deployed
		@Prop({ required: true }) day!: ProjectDay;
		@Prop({ required: true }) currentFilter!: string;

		buttonTitle = "";
		prefix = "";
		active = false;

		created(): void {
			if (this.column === "available") {
				this.prefix = "Kann";
			} else {
				this.prefix = "Ist";
			}

			this.active = this.currentFilter === this.day.id;
			this.getTitle();
		}

		getTitle(): void {
			if (this.active) {
				this.buttonTitle = "Filter deaktivieren";
			} else {
				if (this.column === "available") {
					this.buttonTitle = "Nur verfügbare Mitarbeiter anzeigen";
				} else {
					this.buttonTitle = "Nur eingeteilte Mitarbeiter anzeigen";
				}
			}
		}

		// toggleEmployeeAvailability(): void {
		// 	switch (this.currentAvailability) {
		// 		case "FALSE":
		// 			this.currentAvailability = "TRUE" as Available | Deployed;
		// 			break;
		// 		case "TRUE":
		// 			if (this.column === "available") {
		// 				this.currentAvailability = Available.INDISPOSED;
		// 			} else {
		// 				this.currentAvailability = Deployed.RESERVE;
		// 			}
		// 			break;
		// 		case "INDISPOSED":
		// 			this.currentAvailability = Available.FALSE;
		// 			break;
		// 		case "RESERVE":
		// 			this.currentAvailability = Deployed.FALSE;
		// 			break;
		// 	}
		// 	this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
		// 	this.getTitle();
		// }
	}
</script>
