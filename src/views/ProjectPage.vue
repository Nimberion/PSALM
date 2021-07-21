<template>
	<div class="flex flex-col place-items-center p-2 overflow-hidden">
		<!-- HEADER -->
		<PsalmCard class="flex place-items-center p-4 max-w-[calc(100vw-2rem)">
			<PsalmInput class="w-[300px] md:w-[400px] lg:w-[500px] xl:w-[600px] text-center text-xl font-semibold mr-2" type="text" v-model.trim="tempProject.title" placeholder="Titel" :title="tempProject.title" />
			<ProjectButton icon="calendar-plus" title="Veranstaltung hinzufügen" @click="addProjectDay" />
			<ProjectButton icon="users-cog" title="Mitarbeiterliste ein- und ausblenden" @click="projectStaffEditMode = !projectStaffEditMode" />
			<ProjectButton icon="save" title="Speichern" @click="saveProject" />
			<ProjectButton icon="pdf" title="PDF für jeden Mitarbeiter Exportieren" @click="writePdfForEachEmployee" />
		</PsalmCard>

		<!-- CONTENT -->
		<div class="flex">
			<!-- PROJECT-STAFF-EDITOR -->
			<!-- <transition name="slide"> -->
			<ProjectStaff v-if="projectStaffEditMode" :project-staff="tempProject.staff" @update="updateTempProjectStaff" />
			<!-- </transition> -->

			<!-- PROJECT TABLE -->
			<!-- transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1.0)]  -->
			<PsalmCard class="flex h-full max-h-[calc(100vh-6.875rem)] max-w-[calc(100vw-2rem)] pl-2 pr-0 pb-0 pt-4" :class="{ 'max-w-[calc(100vw-3rem-200px)] ': projectStaffEditMode }">
				<div class="overflow-scroll scrollbar-p-2">
					<table class="project-table">
						<thead>
							<tr>
								<!-- NEEDED STAFF -->
								<th colspan="4" rowspan="2" class="sticky left-0 z-30 br-3px">
									<div class="w-full h-full p-2">
										<span class="mr-2 lg:[show]">Benötigte Mitarbeiter:</span>
										<PsalmInput v-model.trim="tempProject.numberOfRequiredStaff" class="w-8 text-sm" type="number" />
									</div>
								</th>
								<!-- DATE & DELETE -->
								<th v-for="day in tempProject.projectDays" :key="`date-${day.id}`" colspan="2" class="br-3px z-10">
									<div class="flex m-1 mt-0">
										<VueDatePicker v-model="day.date" class="mr-1" format="DD.MM.YYYY" color="#33658A" :minDate="minDate" no-header no-calendar-icon>
											<template #activator="{ date }">
												<button class="w-full font-semibold rounded-none border border-[#6b7280] focus:border-secondary focus:outline-none" :title="date">{{ date }}</button>
											</template>
										</VueDatePicker>
										<PsalmDeleteButton class="h-[calc(1.25rem+2px)] px-0.5" title="Tag löschen" @click="triggerDeleteModal(day)" />
									</div>
								</th>
								<!-- EMPTY CELL FOR SECOND STAFF LIST -->
								<th rowspan="4" class="hidden lg:table-cell bl-3px sticky right-0 z-20 max-w-[150px] min-w-[150px]"></th>
							</tr>
							<tr>
								<!-- TIME -->
								<th v-for="day in tempProject.projectDays" :key="`time-${day.id}`" colspan="2" class="br-3px z-10">
									<PsalmInput type="text" v-model.trim="day.time" class="w-[6rem] text-sm text-center m-1 mt-0" placeholder="Uhrzeit" :title="day.time" />
								</th>
							</tr>
							<tr>
								<!-- EMPTY CELL FOR STAFF LIST -->
								<th rowspan="2" class="sticky left-0 z-30 min-w-[150px] max-w-[150px]">
									<div class="flex"><ProjectButton icon="copy" title="Angezeigte Mitarbeiter kopieren" @click="copyDisplayedStaff" /></div>
								</th>
								<th colspan="3" class="sticky left-[150px] z-30 br-3px bt-1px"><span class="font-semibold">Statistik</span></th>
								<!-- PARTICIPANTS -->
								<th v-for="day in tempProject.projectDays" :key="`participant-${day.id}`" colspan="2" class="br-3px z-10">
									<PsalmInput type="text" v-model.trim="day.participant" class="w-[6rem] text-sm text-center m-1 mt-0" placeholder="Teilnehmer" :title="day.participant" />
								</th>
							</tr>
							<tr>
								<!-- HEADER FOR STAFF STATISTICS -->
								<th class="max-w-[2rem] min-w-[2rem] text-xs sticky left-[150px] z-30">Kann</th>
								<th class="max-w-[2rem] min-w-[2rem] text-xs sticky left-[calc(150px+2rem)] z-30">Ist</th>
								<th class="max-w-[2rem] min-w-[2rem] text-xs sticky left-[calc(150px+4rem)] z-30 br-3px">Soll</th>
								<!-- HEADER FOR STAFF AVAILABILITIES AND DEPLOYMENTS -->
								<template v-for="day in tempProject.projectDays">
									<th :key="`available-header-${day.id}`" class="max-w-[3rem] min-w-[3rem] text-xs z-10">
										<ProjectFilterButton column="available" :day-id="day.id" :active-filter="activeFilter" @click="toggleFilter(day.id, 'available')" />
									</th>
									<th :key="`deployed-header-${day.id}`" class="max-w-[3rem] min-w-[3rem] text-xs br-3px z-10">
										<ProjectFilterButton column="deployed" :day-id="day.id" :active-filter="activeFilter" @click="toggleFilter(day.id, 'deployed')" />
									</th>
								</template>
							</tr>
						</thead>
						<tbody>
							<tr v-for="employee in staff" :key="employee.id" :class="{ fullTime: employee.fullTime }">
								<!-- STAFF LIST -->
								<td class="max-w-[150px] min-w-[150px] overflow-ellipsis overflow-hidden sticky left-0 z-10 bg-inherit text-left" :title="`${employee.firstName} ${employee.lastName}`">
									<span class="px-1">{{ employee.firstName }} {{ employee.lastName }}</span>
								</td>
								<!-- EMPLOYEE STATISTICS -->
								<td class="max-w-[2rem] min-w-[2rem] overflow-hidden sticky left-[150px] z-10 bg-inherit p-0">
									{{ getNumberOfAvailabilities(tempProject, employee.id) }}
								</td>
								<td class="max-w-[2rem] min-w-[2rem] overflow-hidden sticky left-[calc(150px+2rem)] z-10 bg-inherit">
									{{ getNumberOfDeployments(tempProject, employee.id) }}
								</td>
								<td class="max-w-[2rem] min-w-[2rem] overflow-hidden sticky left-[calc(150px+4rem)] z-10 bg-inherit">
									{{ getSetPointOfDeployments(tempProject, staff, employee) }}
								</td>
								<!-- EMPLOYEE AVAILABILITIES AND DEPLOYMENTS -->
								<template v-for="day in tempProject.projectDays">
									<td :key="`available-${day.id}`">
										<ProjectAvailabilityButton class="mx-auto" column="available" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
									</td>
									<td :key="`deployed-${day.id}`">
										<ProjectAvailabilityButton class="mx-auto" column="deployed" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
									</td>
								</template>
								<!-- SECOND STAFF LIST -->
								<td
									class="hidden lg:table-cell bl-3px sticky right-0 z-10 max-w-[150px] min-w-[150px] overflow-ellipsis overflow-hidden sticky left-0 z-10 bg-inherit text-left"
									:title="`${employee.firstName} ${employee.lastName}`"
								>
									<span class="px-1">{{ employee.firstName }} {{ employee.lastName }}</span>
								</td>
							</tr>
							<!-- NO EMPLOYEE SELECTED -->
							<tr v-if="staff.length === 0">
								<td :colspan="5 + tempProject.projectDays.length * 2">Keine Einträge</td>
							</tr>
						</tbody>
					</table>
				</div>
			</PsalmCard>
		</div>
		<PsalmDeleteModal v-if="showDeleteModal" type="projectDay" :object-to-delete="projectDayToDelete" @confirm="deleteProjectDay" @cancel="showDeleteModal = false" />
	</div>
</template>

<script lang="ts">
	import { EmployeeAvailability, newEmployeeAvailability, newProject, newProjectDay, Project, ProjectDay } from "@/models/interfaces/Project";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";
	import PsalmDeleteModal from "@/components/common/PsalmDeleteModal.vue";
	import ProjectAvailabilityButton from "@/components/project/ProjectAvailabilityButton.vue";
	import ProjectButton from "@/components/project/ProjectButton.vue";
	import ProjectFilterButton from "@/components/project/ProjectFilterButton.vue";
	import ProjectStaff from "@/components/project/ProjectStaff.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmDeleteButton from "@/components/common/PsalmDeleteButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { newID, pathExists } from "@/utils/utils";
	import { Employee } from "@/models/interfaces/Employee";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";
	import { writeText } from "@tauri-apps/api/clipboard";
	import { VueDatePicker } from "@mathieustan/vue-datepicker";
	import "@mathieustan/vue-datepicker/dist/vue-datepicker.min.css";
	import { Available } from "@/models/enums/Available";
	import { Deployed } from "@/models/enums/Deployed";
	import { findEmployeeAvailability, getNumberOfAvailabilities, getNumberOfDeployments, getSetPointOfDeployments, writePdfForEachEmployee } from "@/utils/projects";
	import { ActiveFilter, resetActiveFilter } from "@/models/interfaces/ActiveFilter";

	@Component({
		name: "ProjectPage",
		components: { PsalmDeleteButton, PsalmDeleteModal, ProjectAvailabilityButton, ProjectButton, ProjectFilterButton, ProjectStaff, PsalmButton, PsalmCard, PsalmIcon, PsalmInput, VueDatePicker },
	})
	export default class ProjectPage extends Vue {
		projectStaffEditMode = false;
		tempProject: Project = newProject(newID());
		projectDayToDelete: ProjectDay = newProjectDay([]);
		showSecondStaffList = false;
		showDeleteModal = false;
		minDate = new Date();
		activeFilter: ActiveFilter = resetActiveFilter();

		get project(): Project {
			return store.state.projects.get(this.$route.path.split("/")[2]) as Project;
		}

		get staff(): Array<Employee> {
			let availableStaff: Array<EmployeeAvailability> | undefined = [];

			const tempStaff = store.state.staff.filter((item) => this.tempProject.staff.includes(item.id));

			if (this.activeFilter.dayId === "") {
				return tempStaff;
			} else {
				if (this.activeFilter.column === "available") {
					availableStaff = this.tempProject.projectDays.find((e) => e.id === this.activeFilter.dayId)?.staffAvailability.filter((item) => item.available === Available.TRUE);

					return tempStaff.filter((item) => availableStaff?.map((e) => e.employeeId).includes(item.id));
				} else {
					availableStaff = this.tempProject.projectDays.find((e) => e.id === this.activeFilter.dayId)?.staffAvailability.filter((item) => item.deployed !== Deployed.FALSE);

					return tempStaff.filter((item) => availableStaff?.map((e) => e.employeeId).includes(item.id));
				}
			}
		}

		created(): void {
			this.tempProject = JSON.parse(JSON.stringify(this.project));

			this.minDate.setMonth(this.minDate.getMonth() - 12);

			if (this.tempProject.staff.length === 0) {
				this.projectStaffEditMode = true;
			}

			console.log(this.$route.path);
		}

		getNameById(id: string): string {
			const employee = this.staff.find((e) => e.id === id);
			return `${employee?.firstName} ${employee?.lastName}`;
		}

		addProjectDay(): void {
			this.tempProject.projectDays.push(newProjectDay(this.staff));
		}

		toggleFilter(id: string, column: string): void {
			if (id === this.activeFilter.dayId && column === this.activeFilter.column) {
				this.activeFilter = resetActiveFilter();
			} else {
				this.activeFilter.dayId = id;
				this.activeFilter.column = column;
			}
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
			//delete unused staffAvailabilitys?

			//SORT projectDays
			this.tempProject.projectDays.sort((a, b) => {
				if (a.date > b.date) return 1;
				if (a.date < b.date) return -1;

				if (a.time > b.time) return 1;
				if (a.time < b.time) return -1;

				return a.participant.localeCompare(b.participant, "de", { ignorePunctuation: true, sensitivity: "base" });
			});

			// UPDTAE tempProject IN STORE
			store.commit("updateProject", this.tempProject);

			// DELETE OLD JSON FILE
			if (await pathExists("data\\projects", `data\\projects\\${this.tempProject.id}.json`)) {
				await removeFile(`data/projects/${this.tempProject.id}.json`);
			}

			// WRITE JSON FILE
			await writeFile({ contents: JSON.stringify(this.tempProject), path: `data/projects/${this.tempProject.id}.json` });

			// SHOW SAVED TOAST
			store.commit("showToast", "saved");
		}

		triggerDeleteModal(projectDayToDelete: ProjectDay): void {
			this.projectDayToDelete = projectDayToDelete;
			this.showDeleteModal = true;
		}

		async deleteProjectDay(): Promise<void> {
			this.tempProject.projectDays.splice(
				this.tempProject.projectDays.findIndex((e) => e.id === this.projectDayToDelete.id),
				1,
			);

			await this.saveProject();
			store.commit("showToast", "deleted");
			this.showDeleteModal = false;
		}

		copyDisplayedStaff(): void {
			const currentStaff = this.staff.map((e) => `${e.firstName} ${e.lastName}`).join("\n");

			writeText(currentStaff);

			store.commit("showToast", "copied");
		}

		writePdfForEachEmployee(): void {
			writePdfForEachEmployee(this.tempProject);
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

	/* tbody BOLD BORDERS RIGHT  */
	.project-table tbody tr td:nth-child(n + 4):nth-of-type(even):not(:last-of-type) {
		--border-r: 3px;
	}

	/* thead REMOVING BOTTOM BORDER & PADDING */
	.project-table tr:nth-child(-n + 2) th:not(:empty) {
		--border-b: 0px;
	}

	/* REMOVING LAST RIGHT BORDER & PADDING */
	.project-table td:nth-last-child(2),
	.project-table tr:first-of-type th:nth-last-child(2),
	.project-table td:last-of-type,
	.project-table th:last-of-type {
		--border-r: 0px !important;
	}

	/* tbody REMOVING LAST BOTTOM BORDER & PADDING */
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

	/* TRANSITION */
	/* .slide-enter-active,
	.slide-leave-active {
		transition: all 0.5s ease, opacity 0.3s ease;
	}
	.slide-enter,
	.slide-leave-to {
		opacity: 0;
		width: 0;
		padding-right: 0;
		padding-left: 0;
		margin-right: 0;
		margin-left: 0;
	} */
</style>

<style>
	/* DATE-PICKER STYLING */
	.vd-picker,
	.vd-menu__content {
		/* background-color: gray; */
		box-shadow: 0 0 15px 1px rgba(0, 0, 0, 0.4);
		/* outline: 1px solid #f26419; */
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
