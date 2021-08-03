<template>
	<button class="flex justify-center relative select-none focus:ring-secondary rounded-none focus:ring-1 focus:outline-none p-0" :title="buttonTitle" @click="toggleEmployeeAvailability" :disabled="disabled">
		<ProjectAvailabilityIcon
			class="text-2xl z-[1]"
			:class="{
				'text-primary': (currentAvailability === 'TRUE' && column === 'available') || currentAvailability === 'FALSE',
				'text-danger': currentAvailability === 'INDISPOSED',
				'text-warning': currentAvailability === 'RESERVE',
				'text-info-400': currentAvailability === 'HOSPITATION',
				'text-success': currentAvailability === 'TRUE' && column !== 'available',
				'text-gray-400 cursor-default': disabled,
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
	import store from "@/store";

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

		get enableHospitation(): boolean {
			return store.state.enableHospitation;
		}

		get disabled(): boolean {
			if (this.column === "available" || (findEmployeeAvailability(this.tempStaffAvailability, this.employeeId)?.available as Available) === Available.TRUE) {
				return false;
			} else {
				this.currentAvailability = Deployed.FALSE;
				this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
				return true;
			}
		}

		get buttonTitle(): string {
			if (this.disabled) {
				return "Nicht verfügbar";
			} else {
				switch (this.currentAvailability) {
					case "FALSE":
						if (this.column === "available") {
							return "Nicht verfügbar";
						} else {
							return "Nicht eingeteilt";
						}
					case "TRUE":
						if (this.column === "available") {
							return "Verfügbar";
						} else {
							return "Eingeteilt";
						}

					case "INDISPOSED":
						return "Abgesagt";

					case "RESERVE":
						return "Reserve";

					case "HOSPITATION":
						return "Honspitation";

					default:
						return "";
				}
			}
		}

		created(): void {
			if (this.column === "available") {
				this.currentAvailability = findEmployeeAvailability(this.tempStaffAvailability, this.employeeId)?.available as Available;
			} else {
				this.currentAvailability = findEmployeeAvailability(this.tempStaffAvailability, this.employeeId)?.deployed as Deployed;
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
					if (this.enableHospitation) {
						this.currentAvailability = Deployed.HOSPITATION;
					} else {
						this.currentAvailability = Deployed.FALSE;
					}
					break;
				case "HOSPITATION":
					this.currentAvailability = Deployed.FALSE;
					break;
			}
			this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
		}
	}
</script>
