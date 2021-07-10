<template>
	<div class="flex flex-col place-items-center">
		<!-- <div class="h-screen w-screen grid grid-cols-1 grid-rows-[auto,1fr] place-items-center"> -->
		<!-- HEADER -->
		<div class="flex place-items-center border bg-white rounded shadow-lg m-2 p-2">
			<h2 class="text-xl font-semibold border-r border-gray-400 pr-2">{{ project.title }}</h2>
			<button class="ml-2" title="Projekttag hinzufügen" @click="addProjectDay"><PsalmIcon name="calendar-plus" class="text-primary text-xl" /></button>
			<button class="ml-2" title="Mitarbeiter bearbeiten" @click="projectStaffEditMode = !projectStaffEditMode"><PsalmIcon name="users-cog" class="text-primary text-xl" /></button>
			<button class="ml-2" title="Speichern" @click="saveProject"><PsalmIcon name="save" class="text-primary text-xl" /></button>
		</div>

		<div v-if="projectStaffEditMode" class="flex max-h-[calc(100vh-5.75rem-4px)] max-w-[calc(100vw-2rem-2px)] border bg-white rounded shadow-lg m-2 p-4">
			<ProjectStaff :project-staff="tempProject.staff" @update="updateTempProjectStaff" />
		</div>

		<!-- TABLE WRAPPER -->
		<div class="flex max-h-[calc(100vh-5.75rem-4px)] max-w-[calc(100vw-2rem-2px)] border bg-white rounded shadow-lg m-2 px-2 py-4">
			<!-- PROJECT-STAFF-EDITOR -->
			<!-- <ProjectStaff v-if="projectStaffEditMode" :project-staff="tempProject.staff" @update="updateTempProjectStaff" /> -->
			<!-- TABLE -->
			<section class="grid overflow-scroll" :style="`grid-template-columns: auto repeat(${tempProject.projectDays.length * 2},3rem) auto;`">
				<!-- TOP-LEFT CORNER -->
				<div class="flex flex-col justify-end items-end row-span-2 sticky top-0 left-0 bg-white border-gray-400 border-r-2 border-b-2 z-30">
					<div class="w-full h-full text-xs font-semibold">
						<span>Benötigte Mitarbeiter: </span>
						<PsalmInput class="w-6 text-center text-xs rounded" type="number" v-model="tempProject.numberOfRequiredStaff" />
					</div>
					<div class="w-24 text-xs text-center font-semibold">Statistik</div>
					<div class="flex text-xs text-center border-t border-gray-400">
						<div class="w-8 border-l border-gray-400">Kann</div>
						<div class="w-8 border-l border-gray-400">Ist</div>
						<div class="w-8 border-l border-gray-400">Soll</div>
					</div>
				</div>

				<!-- DAY HEADER LOOP -->
				<div
					v-for="day in tempProject.projectDays"
					:key="`data-${day.id}`"
					class="h-[calc(3.75rem+1px)] grid col-span-2 sticky top-0 bg-white border-gray-400 border-l border-b border-r px-1 text-sm overflow-ellipsis whitespace-nowrap text-center place-content-center z-20"
				>
					<!-- <p class="min-h-[1.25rem] font-semibold overflow-ellipsis overflow-hidden">{{ day.date }}</p> -->
					<!-- <input type="date" title="Datum bearbeiten" class="text-center font-semibold text-sm p-0 border-0 focus:border-0 focus:ring-0" v-model="day.date" /> -->
					<VueDatePicker v-model="day.date" format="DD.MM.YYYY" color="#be276b" no-header no-calendar-icon>
						<template #activator="{ date }">
							<p class="font-semibold">{{ date }}</p>
						</template>
					</VueDatePicker>
					<p class="min-h-[1.25rem] overflow-ellipsis overflow-hidden">{{ day.time }}</p>
					<p class="min-h-[1.25rem] overflow-ellipsis overflow-hidden">{{ day.participant }}</p>
				</div>

				<!-- TOP-RIGHT CORNER -->
				<div class="grid row-span-2 sticky top-0 right-0 bg-white border-gray-400 border-l-2 border-b-2 z-30"></div>

				<!-- "Kann" AND "Ist" LOOP -->
				<template v-for="day in tempProject.projectDays">
					<div :key="`available-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b-2 px-1 text-xs place-content-center z-20">Kann</div>
					<div :key="`deployed-header-${day.id}`" class="grid col-span-1 auto-cols-max sticky top-[calc(3.75rem+1px)] bg-white border-gray-400 border-l border-b-2 border-r px-1 text-xs place-content-center z-20">Ist</div>
				</template>

				<!-- ROWS LOOP -->
				<template v-for="(employee, index) in staff">
					<!-- STAFF LOOP -->
					<div
						:key="employee.id"
						class="flex justify-between items-center whitespace-nowrap sticky left-0 bg-white border-gray-400 border-r-2 border-t z-20"
						:class="{ 'bg-gray-200': index % 2 === 0, 'bg-highlight': employee.fullTime }"
					>
						<div class="px-1">{{ employee.firstName }} {{ employee.lastName }}</div>
						<!-- STATISTIC DATA -->
						<div class="h-full flex">
							<div class="w-8 grid place-items-center border-l border-gray-400">{{ getNumberOfAvailabilities(tempProject, employee.id) }}</div>
							<div class="w-8 grid place-items-center border-l border-gray-400">{{ getNumberOfDeployments(tempProject, employee.id) }}</div>
							<div class="w-8 grid place-items-center border-l border-gray-400">{{ getSetPointOfDeployments(tempProject, staff, employee) }}</div>
						</div>
					</div>
					<!-- PROJECT DAYS LOOP -->
					<template v-for="day in tempProject.projectDays">
						<div :key="`available-${day.id}-${employee.id}`" class="grid auto-cols-max border-gray-400 border-t border-l place-content-center" :class="{ 'bg-gray-200': index % 2 === 0, 'bg-highlight': employee.fullTime }">
							<ProjectAvailabilityButton column="available" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
						</div>
						<div
							:key="`deployed-${day.id}-${employee.id}`"
							class="grid auto-cols-max border-gray-400 border-t border-l border-r place-content-center"
							:class="{ 'bg-gray-200': index % 2 === 0, 'bg-highlight': employee.fullTime }"
						>
							<ProjectAvailabilityButton column="deployed" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
						</div>
					</template>
					<!-- RIGHT STAFF LIST -->
					<div
						:key="`left-side-${employee.id}`"
						class="flex items-center whitespace-nowrap sticky right-0 bg-white border-gray-400 border-l-2 border-t px-1 z-20"
						:class="{ 'bg-gray-200': index % 2 === 0, 'bg-highlight': employee.fullTime }"
					>
						{{ employee.firstName }} {{ employee.lastName }}
					</div>
				</template>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
	import {
		Available,
		Deployed,
		EmployeeAvailability,
		findEmployeeAvailability,
		getNumberOfAvailabilities,
		getNumberOfDeployments,
		getSetPointOfDeployments,
		newEmployeeAvailability,
		newProject,
		newProjectDay,
		Project,
		ProjectDay,
	} from "@/interfaces/Project";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import ProjectAvailabilityButton from "@/components/project/ProjectAvailabilityButton.vue";
	import ProjectStaff from "@/components/project/ProjectStaff.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newID, pathExists } from "@/utils";
	import { Employee } from "@/interfaces/Employee";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";
	import { VueDatePicker } from "@mathieustan/vue-datepicker";
	import "@mathieustan/vue-datepicker/dist/vue-datepicker.min.css";

	@Component({
		name: "ProjectPage",
		components: { ProjectAvailabilityButton, ProjectStaff, PsalmIcon, PsalmInput, VueDatePicker },
	})
	export default class ProjectPage extends Vue {
		projectStaffEditMode = false;
		tempProject: Project = newProject(newID());

		get project(): Project {
			return store.state.projects.get(this.$route.path.split("/")[2]) as Project;
		}

		get staff(): Array<Employee> {
			return store.state.staff.filter((item) => this.tempProject.staff.includes(item.id));
		}

		created(): void {
			this.tempProject = JSON.parse(JSON.stringify(this.project));
		}

		addProjectDay(): void {
			this.tempProject.projectDays.push(newProjectDay(this.staff));
		}

		getNameById(id: string): string {
			const employee = this.staff.find((e) => e.id === id);
			return `${employee?.firstName} ${employee?.lastName}`;
		}

		updateEmployeeAvailability(day: ProjectDay, employeeId: string, column: string, newAvailability: Available | Deployed): void {
			const oldAvailability = findEmployeeAvailability(day.staffAvailability, employeeId);

			if (oldAvailability) {
				if (column === "available") {
					oldAvailability.available = newAvailability as Available;
				} else {
					oldAvailability.deployed = newAvailability as Deployed;
				}
			}
		}

		updateTempProjectStaff(newTempProjectStaff: Array<string>): void {
			this.tempProject.staff = newTempProjectStaff;

			// UPDATE staffAvailability OF ALL PROJECT-DAYS
			this.tempProject.projectDays.forEach((day) => {
				const tempStaffAvailability: Array<EmployeeAvailability> = day.staffAvailability;

				this.tempProject.staff.forEach((employeeId) => {
					const exists = tempStaffAvailability.find((element) => element.employeeId === employeeId);
					if (!exists) {
						tempStaffAvailability.push(newEmployeeAvailability(employeeId));
						day.staffAvailability = tempStaffAvailability;
					}
				});
			});
		}

		async saveProject(): Promise<void> {
			//delete unused staffAvailabilitys

			// PUSH TEMP-PROJECTS TO STORE
			store.commit("updateProject", this.tempProject);

			// DELETE OLD JSON FILE
			if (await pathExists("data\\projects", `data\\projects\\${this.tempProject.id}.json`)) {
				await removeFile(`data/projects/${this.tempProject.id}.json`);
			}

			// WRITE JSON FILE
			await writeFile({ contents: JSON.stringify(this.tempProject), path: `data/projects/${this.tempProject.id}.json` });
			console.log("Save complete");

			//temp
			console.log("saved", this.tempProject);
		}

		getNumberOfAvailabilities(project: Project, employeeId: string): number {
			return getNumberOfAvailabilities(project, employeeId);
		}

		getNumberOfDeployments(project: Project, employeeId: string): number {
			return getNumberOfDeployments(project, employeeId);
		}

		getSetPointOfDeployments(project: Project, staff: Array<Employee>, employee: Employee): number | string {
			return getSetPointOfDeployments(project, staff, employee);
		}
	}
</script>

<style>
	/* DATE-PICKER STYLING */
	/* .vd-picker,
	.vd-menu__content {
		background-color: gray;
		border-radius: 2px;
	}

	.vd-picker__table-day__effect,
	.vd-picker__table-day__current {
		border-radius: 2px;
	}

	.vd-picker__table-day__current {
		border: 1px solid white;
	}

	.vd-icon,
	.vd-picker__controls-label button:not(:hover):not(:focus),
	.vd-picker__table-day__text,
	.vd-picker__months-button,
	.vd-picker__years-button {
		color: white;
	}

	.vd-picker__months-button:hover,
	.vd-picker__years-button:hover {
		color: blue;
	}

	.vd-picker__table-weekday {
		color: lightgray;
	} */
</style>
