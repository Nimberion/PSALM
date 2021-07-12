<template>
	<div class="flex flex-col place-items-center p-2">
		<!-- HEADER -->
		<PsalmCard class="flex place-items-center p-4">
			<h2 class="text-xl font-semibold border-r border-gray-400 pr-2">{{ project.title }}</h2>
			<button class="ml-2" title="Projekttag hinzufügen" @click="addProjectDay"><PsalmIcon name="calendar-plus" class="text-primary text-xl" /></button>
			<button class="ml-2" title="Mitarbeiter bearbeiten" @click="projectStaffEditMode = !projectStaffEditMode"><PsalmIcon name="users-cog" class="text-primary text-xl" /></button>
			<button class="ml-2" title="Speichern" @click="saveProject"><PsalmIcon name="save" class="text-primary text-xl" /></button>
		</PsalmCard>

		<!-- CONTENT -->
		<div class="flex">
			<!-- PROJECT-STAFF-EDITOR -->
			<ProjectStaff v-if="projectStaffEditMode" class="max-h-[calc(100vh-6.75rem)] px-2 py-4" :project-staff="tempProject.staff" @update="updateTempProjectStaff" />

			<!-- PROJECT TABLE -->
			<PsalmCard class="flex max-h-[calc(100vh-6.75rem)] max-w-[calc(100vw-2rem)] p-2 pt-4" :class="{ 'max-w-[calc(100vw-3rem-200px)]': projectStaffEditMode }">
				<div class="overflow-scroll">
					<table class="project-table">
						<thead>
							<tr>
								<th colspan="4" rowspan="2" class="sticky left-0 z-30 br-3px">
									<div class="w-full h-full p-2">
										<!-- #### -->
										<span class="mr-2 lg:[show]">Benötigte Mitarbeiter:</span>
										<input v-model="tempProject.numberOfRequiredStaff" class="w-8 text-sm text-center focus:border-secondary focus:ring-0" type="number" min="0" max="99" maxlength="2" @focus="$event.target.select()" />
									</div>
								</th>
								<th v-for="day in tempProject.projectDays" :key="`date-${day.id}`" colspan="2" class="br-3px z-10" :class="{ showSecondStaffList: showSecondStaffList }">
									<VueDatePicker v-model="day.date" class="border border-[#6b7280] active:border-secondary m-1 mt-0" format="DD.MM.YYYY" color="#33658A" no-header no-calendar-icon>
										<template #activator="{ date }">
											<span class="w-full font-semibold">{{ date }}</span>
										</template>
									</VueDatePicker>
								</th>
								<th v-if="showSecondStaffList" rowspan="4" class="bl-3px sticky right-0 z-20"></th>
							</tr>
							<tr>
								<!-- TIME -->
								<th v-for="day in tempProject.projectDays" :key="`time-${day.id}`" colspan="2" class="br-3px overflow-ellipsis overflow-hidden z-10">
									<input type="text" v-model="day.time" class="w-[6rem] text-sm text-center focus:border-secondary focus:ring-0 m-1 mt-0" placeholder="Zeitspanne" />
								</th>
							</tr>
							<tr>
								<th rowspan="2" class="sticky left-0 z-30 min-w-[150px] max-w-[150px]">
									<div class="w-full h-full flex p-2">
										<input type="checkbox" class="place-self-center text-black mr-2" @change="showSecondStaffList = !showSecondStaffList" />
										<div class="">2. Mitarbeiterliste</div>
									</div>
								</th>
								<th colspan="3" class="sticky left-[150px] z-30 br-3px bt-1px"><span class="font-semibold">Statistik</span></th>
								<!-- PARTICIPANTS -->
								<th v-for="day in tempProject.projectDays" :key="`participant-${day.id}`" colspan="2" class="br-3px overflow-ellipsis overflow-hidden z-10">
									<input type="text" v-model="day.participant" class="w-[6rem] text-sm text-center focus:border-secondary focus:ring-0 m-1 mt-0" placeholder="Teilnehmer" />
								</th>
							</tr>
							<tr>
								<th class="max-w-[2rem] min-w-[2rem] text-xs sticky left-[150px] z-30">Kann</th>
								<th class="max-w-[2rem] min-w-[2rem] text-xs sticky left-[calc(150px+2rem)] z-30">Ist</th>
								<th class="max-w-[2rem] min-w-[2rem] text-xs sticky left-[calc(150px+4rem)] z-30 br-3px">Soll</th>
								<template v-for="day in tempProject.projectDays">
									<th :key="`available-header-${day.id}`" class="max-w-[3rem] min-w-[3rem] text-xs z-10">Kann</th>
									<th :key="`deployed-header-${day.id}`" class="max-w-[3rem] min-w-[3rem] text-xs br-3px z-10">Ist</th>
								</template>
							</tr>
						</thead>
						<tbody>
							<tr v-for="employee in staff" :key="employee.id" :class="{ fullTime: employee.fullTime }">
								<td class="max-w-[150px] min-w-[150px] overflow-ellipsis overflow-hidden sticky left-0 z-10 bg-inherit text-left">
									<span class="px-1">{{ employee.firstName }} {{ employee.lastName }}</span>
								</td>
								<td class="max-w-[2rem] min-w-[2rem] overflow-hidden sticky left-[150px] z-10 bg-inherit p-0">
									{{ getNumberOfAvailabilities(tempProject, employee.id) }}
								</td>
								<td class="max-w-[2rem] min-w-[2rem] overflow-hidden sticky left-[calc(150px+2rem)] z-10 bg-inherit">
									{{ getNumberOfDeployments(tempProject, employee.id) }}
								</td>
								<td class="max-w-[2rem] min-w-[2rem] overflow-hidden sticky left-[calc(150px+4rem)] z-10 bg-inherit">
									{{ getSetPointOfDeployments(tempProject, staff, employee) }}
								</td>
								<template v-for="day in tempProject.projectDays">
									<td :key="`available-${day.id}`">
										<ProjectAvailabilityButton class="w-full" column="available" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
									</td>
									<td :key="`deployed-${day.id}`" :class="{ showSecondStaffList: showSecondStaffList }">
										<ProjectAvailabilityButton class="w-full" column="deployed" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
									</td>
								</template>
								<td v-if="showSecondStaffList" class="bl-3px sticky right-0 z-10 max-w-[150px] min-w-[150px] overflow-ellipsis overflow-hidden sticky left-0 z-10 bg-inherit text-left">
									<span class="px-1">{{ employee.firstName }} {{ employee.lastName }}</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</PsalmCard>
		</div>
	</div>
</template>

<script lang="ts">
	import { EmployeeAvailability, newEmployeeAvailability, newProject, newProjectDay, Project, ProjectDay } from "@/models/interfaces/Project";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import ProjectAvailabilityButton from "@/components/project/ProjectAvailabilityButton.vue";
	import ProjectStaff from "@/components/project/ProjectStaff.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newID, pathExists } from "@/utils/utils";
	import { Employee } from "@/models/interfaces/Employee";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";
	import { VueDatePicker } from "@mathieustan/vue-datepicker";
	import "@mathieustan/vue-datepicker/dist/vue-datepicker.min.css";
	import { Available } from "@/models/enums/Available";
	import { Deployed } from "@/models/enums/Deployed";
	import { findEmployeeAvailability, getNumberOfAvailabilities, getNumberOfDeployments, getSetPointOfDeployments } from "@/utils/projects";

	@Component({
		name: "ProjectPage",
		components: { ProjectAvailabilityButton, ProjectStaff, PsalmButton, PsalmCard, PsalmIcon, PsalmInput, VueDatePicker },
	})
	export default class ProjectPage extends Vue {
		projectStaffEditMode = false;
		tempProject: Project = newProject(newID());
		showSecondStaffList = false;

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

			//temp
			console.log("Save complete");
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

<style scoped>
	.project-table input[type="number"],
	.project-table input[type="text"] {
		padding: 0 0.25rem;
	}

	input[type="number"]::-webkit-inner-spin-button,
	input[type="number"]::-webkit-outer-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	.project-table {
		--border-color: #adadad;
		--border-b: 1px;
		--border-r: 1px;

		border-collapse: collapse;
		white-space: nowrap;
		text-align: center;
	}

	.project-table thead th {
		--cell-padding: 0px;

		font-weight: normal;
		font-size: 0.875rem;
		line-height: 1.25rem;

		position: sticky;
		background-color: white;
		color: black;
	}

	.project-table tbody td {
		--cell-padding: 0.25rem;
	}

	.br-3px {
		--border-r: 3px;
	}

	.bt-1px {
		--border-t: 1px;
		box-shadow: inset 0 calc(var(--border-b) * -1) 0 var(--border-color), inset calc(var(--border-r) * -1) 0 0 var(--border-color), inset 0 calc(var(--border-t)) 0 var(--border-color) !important;
		border-top: var(--border-t);
	}

	.bl-3px {
		--border-l: 3px;
		box-shadow: inset 0 calc(var(--border-b) * -1) 0 var(--border-color), inset calc(var(--border-l)) 0 0 var(--border-color) !important;
		padding-top: var(--cell-padding);
		padding-left: calc(var(--cell-padding) + var(--border-l));
		padding-right: var(--cell-padding);
		padding-bottom: calc(var(--cell-padding) + var(--border-b));
	}

	/* thead SMALL TEXT IN LAST ROW */
	.project-table thead tr:last-child th {
		font-size: 0.75rem;
		line-height: 1rem;
	}

	/* tbody COLORING ROWS */
	.project-table tbody tr:nth-of-type(even) {
		background-color: #eeeeee;
	}
	.project-table tbody tr:nth-of-type(odd) {
		background-color: white;
	}
	.project-table tbody tr.fullTime {
		background-color: lightyellow;
	}
	.project-table tbody tr:hover {
		background-color: #f8d3be;
	}

	/* BORDERS & PADDING */
	.project-table th,
	.project-table td {
		box-shadow: inset 0 calc(var(--border-b) * -1) 0 var(--border-color), inset calc(var(--border-r) * -1) 0 0 var(--border-color);
		padding-top: var(--cell-padding);
		padding-left: var(--cell-padding);
		padding-right: calc(var(--cell-padding) + var(--border-r));
		padding-bottom: calc(var(--cell-padding) + var(--border-b));
	}

	/* BOLD BORDERS RIGHT tbody */
	.project-table tbody tr td:nth-child(n + 4):nth-of-type(even):not(:last-of-type) {
		--border-r: 3px;
	}

	/* REMOVING BOTTOM BORDER & PADDING ON thead */
	.project-table tr:nth-child(-n + 2) th:not(:empty) {
		--border-b: 0px;
	}

	/* REMOVING LAST RIGHT BORDER & PADDING */
	.project-table .showSecondStaffList:nth-last-child(2),
	.project-table td:last-of-type,
	.project-table th:last-of-type {
		--border-r: 0px !important;
	}

	/* REMOVING LAST BOTTOM BORDER & PADDING */
	.project-table tbody tr:last-of-type td {
		--border-b: 0px;
	}

	/* STICKY thead POSITIONS */
	.project-table thead tr:nth-child(1) th {
		top: 0;
	}
	.project-table thead tr:nth-child(2) th {
		top: calc(1.5rem + var(--border-b) +2px);
	}
	.project-table thead tr:nth-child(3) th {
		top: calc(((1.5rem + var(--border-b)) * 2) + 2px);
	}
	.project-table thead tr:nth-child(4) th {
		top: calc(((1.5rem + var(--border-b)) * 3) + 4px);
	}
</style>

<style>
	/* DATE-PICKER STYLING */
	.vd-picker,
	.vd-menu__content {
		/* background-color: gray; */
		box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.4);
		outline: 1px solid #f26419;
	}

	.vd-picker,
	.vd-menu__content,
	.vd-picker__table-day__effect,
	.vd-picker__table-day__current {
		border-radius: 0px;
	}

	.vd-picker__table-day__current {
		border-color: #6b7280;
	}

	.vd-icon,
	.vd-picker__controls-label button:not(:hover):not(:focus),
	.vd-picker__table-day__text,
	.vd-picker__months-button,
	.vd-picker__years-button {
		color: black;
	}

	/* .vd-picker__table-day__current {
		border: 1px solid white;
	}

	.vd-picker__months-button:hover,
	.vd-picker__years-button:hover {
		color: blue;
	}

	.vd-picker__table-weekday {
		color: lightgray;
	} */
</style>
