<template>
	<div class="flex justify-center">
		<!-- TRIGGER BUTTON -->
		<button :ref="buttonRef" class="flex justify-center relative select-none focus:ring-secondary rounded-none focus:ring-1 focus:outline-none p-0" :title="buttonTitle" :disabled="disabled" @click.stop="toggleMenu">
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
		<!-- MENU -->
		<div :ref="`${buttonRef}-menu`" v-if="projectMenu.show && projectMenu.id === buttonRef" class="rounded-sm bg-white text-sm shadow-card p-1 z-50">
			<button class="flex place-items-center w-full hover:ring-secondary hover:ring-1 focus:ring-secondary rounded-none focus:ring-1 focus:outline-none" @click="changeEmployeeAvailability('TRUE')">
				<ProjectAvailabilityIcon
					class="text-2xl z-[1]"
					:class="{
						'text-primary': column === 'available',
						'text-success': column !== 'available',
					}"
					name="TRUE"
				/>
				<span v-if="column === 'available'" class="mx-1">Verfügbar</span>
				<span v-else class="mx-1">Eingeteilt</span>
			</button>
			<button class="flex place-items-center w-full hover:ring-secondary hover:ring-1 focus:ring-secondary rounded-none focus:ring-1 focus:outline-none" @click="changeEmployeeAvailability('FALSE')">
				<ProjectAvailabilityIcon class="text-primary text-2xl z-[1]" name="FALSE" />
				<span v-if="column === 'available'" class="mx-1">Nicht verfügbar</span>
				<span v-else class="mx-1">Nicht eingeteilt</span>
			</button>
			<button v-if="column !== 'available'" class="flex place-items-center w-full hover:ring-secondary hover:ring-1 focus:ring-secondary rounded-none focus:ring-1 focus:outline-none" @click="changeEmployeeAvailability('RESERVE')">
				<ProjectAvailabilityIcon class="text-warning text-2xl z-[1]" name="RESERVE" />
				<span class="mx-1">Reserve</span>
			</button>
			<button v-if="column === 'available'" class="flex place-items-center w-full hover:ring-secondary hover:ring-1 focus:ring-secondary rounded-none focus:ring-1 focus:outline-none" @click="changeEmployeeAvailability('INDISPOSED')">
				<ProjectAvailabilityIcon class="text-danger text-2xl z-[1]" name="INDISPOSED" />
				<span class="mx-1">Abgesagt</span>
			</button>
			<button v-if="column !== 'available'" class="flex place-items-center w-full hover:ring-secondary hover:ring-1 focus:ring-secondary rounded-none focus:ring-1 focus:outline-none" @click="changeEmployeeAvailability('HOSPITATION')">
				<ProjectAvailabilityIcon class="text-info-400 text-2xl z-[1]" name="HOSPITATION" />
				<span class="mx-1">Hospitation</span>
			</button>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import ProjectAvailabilityIcon from "@/components/project/ProjectAvailabilityIcon.vue";
	import { EmployeeAvailability, ProjectDay } from "@/models/interfaces/Project";
	import { Available } from "@/models/enums/Available";
	import { Deployed } from "@/models/enums/Deployed";
	import { findEmployeeAvailability } from "@/utils/projects";
	import store from "@/store";
	import { createPopper } from "@popperjs/core";
	import { ProjectMenu } from "@/models/interfaces/ProjectMenu";

	@Component({
		name: "ProjectAvailabilityButton",
		components: { ProjectAvailabilityIcon },
	})
	export default class ProjectAvailabilityButton extends Vue {
		@Prop({ required: true }) column!: string; //available or deployed
		@Prop({ required: true }) day!: ProjectDay; //INDISPOSED, RESERVE, TRUE, FALSE, HOSPITATION
		@Prop({ required: true }) employeeId!: string;

		tempStaffAvailability: Array<EmployeeAvailability> = this.day.staffAvailability;
		currentAvailability: Available | Deployed = Available.FALSE;

		buttonRef = `${this.column}-${this.day.id}-${this.employeeId}`;

		get projectMenu(): ProjectMenu {
			return store.state.projectMenu;
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
						return "Hospitation";

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

		toggleMenu(): void {
			if (this.projectMenu.show && this.projectMenu.id === this.buttonRef) {
				store.commit("toggleProjectMenu", { show: false, id: "" });
			} else {
				store.commit("toggleProjectMenu", { show: true, id: this.buttonRef });
				this.$nextTick(function () {
					const button = this.$refs[this.buttonRef] as HTMLElement;
					const menu = this.$refs[`${this.buttonRef}-menu`] as HTMLElement;

					createPopper(button, menu, {
						placement: "bottom-start",
					});
					// document.body.addEventListener("click", this.closeMenu, { once: true });
					// this.tableWrapper.addEventListener("scroll", this.closeMenu, { once: true });
					// this.tableWrapper.onscroll = this.closeMenu;
				});
			}
		}

		closeMenu(): void {
			store.commit("toggleProjectMenu", { show: false, id: "" });
			console.log("closed");
		}

		changeEmployeeAvailability(type: string): void {
			switch (type) {
				case "FALSE":
					if (this.column === "available") {
						this.currentAvailability = Available.FALSE;
					} else {
						this.currentAvailability = Deployed.FALSE;
					}
					break;
				case "TRUE":
					if (this.column === "available") {
						this.currentAvailability = Available.TRUE;
					} else {
						this.currentAvailability = Deployed.TRUE;
					}
					break;
				case "INDISPOSED":
					this.currentAvailability = Available.INDISPOSED;
					break;
				case "RESERVE":
					this.currentAvailability = Deployed.RESERVE;
					break;
				case "HOSPITATION":
					this.currentAvailability = Deployed.HOSPITATION;
					break;
			}
			this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
			document.body.click();
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
		// 			if (this.enableHospitation) {
		// 				this.currentAvailability = Deployed.HOSPITATION;
		// 			} else {
		// 				this.currentAvailability = Deployed.FALSE;
		// 			}
		// 			break;
		// 		case "HOSPITATION":
		// 			this.currentAvailability = Deployed.FALSE;
		// 			break;
		// 	}
		// 	this.$emit("change", this.day, this.employeeId, this.column, this.currentAvailability);
		// }
	}
</script>
