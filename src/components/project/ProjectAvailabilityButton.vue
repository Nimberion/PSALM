<template>
	<button class="flex justify-center text-white select-none m-1" :title="buttonTitle" @click="toggleEmployeeAvailability">
		<ProjectAvailabilityIcon
			class="text-primary text-2xl"
			:class="{
				'text-primary': currentAvailability === 'TRUE' && column === 'available',
				'text-danger': currentAvailability === 'INDISPOSED',
				'text-warning': currentAvailability === 'RESERVE',
				'text-success': currentAvailability === 'TRUE' && column !== 'available',
			}"
			:name="currentAvailability"
		/>
	</button>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import ProjectAvailabilityIcon from "@/components/project/ProjectAvailabilityIcon.vue";
	import { Available, Deployed, EmployeeAvailability, findEmployeeAvailability, ProjectDay } from "@/interfaces/Project";

	@Component({
		name: "ProjectAvailabilityButton",
		components: { ProjectAvailabilityIcon },
	})
	export default class ProjectAvailabilityButton extends Vue {
		@Prop({ required: true }) column!: string; //available or deployed
		@Prop({ required: true }) day!: ProjectDay; //INDISPOSED, RESERVE, TRUE, FALSE
		@Prop({ required: true }) employeeId!: string;

		tempStaffAvailability: Array<EmployeeAvailability> = this.day.staffAvailability;
		currentAvailability: Available | Deployed = Available.false;
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
			// this.$emit("update:title", this.buttonTitle);
		}

		toggleEmployeeAvailability(): void {
			switch (this.currentAvailability) {
				case "FALSE":
					this.currentAvailability = "TRUE" as Available | Deployed;
					break;
				case "TRUE":
					if (this.column === "available") {
						this.currentAvailability = Available.indisposed;
					} else {
						this.currentAvailability = Deployed.reserve;
					}
					break;
				case "INDISPOSED":
					this.currentAvailability = Available.false;
					break;
				case "RESERVE":
					this.currentAvailability = Deployed.false;
					break;
			}
			this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
			this.getTitle();
		}
	}
</script>
