<template>
	<button class="flex justify-center relative text-white select-none m-1" :title="buttonTitle" @click="toggleEmployeeAvailability">
		<ProjectAvailabilityIcon
			class="text-primary text-2xl z-10"
			:class="{
				'text-primary': currentAvailability === 'TRUE' && column === 'available',
				'text-danger': currentAvailability === 'INDISPOSED',
				'text-warning': currentAvailability === 'RESERVE',
				'text-success': currentAvailability === 'TRUE' && column !== 'available',
			}"
			:name="currentAvailability"
		/>
		<!-- CHECKBOX BG -->
		<span class="bg-white w-4 h-4 absolute z-0 top-1/2 bottom-1/2 my-auto" />
	</button>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import ProjectAvailabilityIcon from "@/components/project/ProjectAvailabilityIcon.vue";
	import { EmployeeAvailability, ProjectDay } from "@/models/interfaces/Project";
	import { Available } from "@/models/enums/Available";
	import { Deployed } from "@/models/enums/Deployed";
	import { findEmployeeAvailability } from "@/utils/projects";

	@Component({
		name: "ProjectAvailabilityButton",
		components: { ProjectAvailabilityIcon },
	})
	export default class ProjectAvailabilityButton extends Vue {
		@Prop({ required: true }) column!: string; //available or deployed
		@Prop({ required: true }) day!: ProjectDay; //INDISPOSED, RESERVE, TRUE, FALSE
		@Prop({ required: true }) employeeId!: string;

		tempStaffAvailability: Array<EmployeeAvailability> = this.day.staffAvailability;
		currentAvailability: Available | Deployed = Available.FALSE;
		buttonTitle = "";

		created(): void {
			if (this.column === "available") {
				this.currentAvailability = findEmployeeAvailability(this.tempStaffAvailability, this.employeeId)?.available as Available;
			} else {
				this.currentAvailability = findEmployeeAvailability(this.tempStaffAvailability, this.employeeId)?.deployed as Deployed;
			}
			this.getTitle();
		}

		getTitle(): void {
			switch (this.currentAvailability) {
				case "FALSE":
					if (this.column === "available") {
						this.buttonTitle = "Nicht verfügbar";
					} else {
						this.buttonTitle = "Nicht eingeteilt";
					}
					break;
				case "TRUE":
					if (this.column === "available") {
						this.buttonTitle = "Verfügbar";
					} else {
						this.buttonTitle = "Eingeteilt";
					}
					break;
				case "INDISPOSED":
					this.buttonTitle = "Abgesagt";
					break;
				case "RESERVE":
					this.buttonTitle = "Reserve";
					break;
			}
		}

		toggleEmployeeAvailability(): void {
			switch (this.currentAvailability) {
				case "FALSE":
					this.currentAvailability = "TRUE" as Available | Deployed;
					break;
				case "TRUE":
					if (this.column === "available") {
						this.currentAvailability = Available.INDISPOSED;
					} else {
						this.currentAvailability = Deployed.RESERVE;
					}
					break;
				case "INDISPOSED":
					this.currentAvailability = Available.FALSE;
					break;
				case "RESERVE":
					this.currentAvailability = Deployed.FALSE;
					break;
			}
			this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
			this.getTitle();
		}
	}
</script>
