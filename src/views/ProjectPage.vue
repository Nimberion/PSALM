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
			<ProjectStaff v-if="projectStaffEditMode" :project-staff="tempProject.staff" @update="updateTempProjectStaff" />

			<!-- PROJECT TABLE -->
			<PsalmCard class="flex h-full max-h-[calc(100vh-6.875rem)] max-w-[calc(100vw-2rem)] pl-2 pr-0 pb-0 pt-4" :class="{ 'max-w-[calc(100vw-3rem-200px)] ': projectStaffEditMode }">
				<div class="overflow-scroll scrollbar-p-2">
					<table class="project-table table-fixed border-separate text-center whitespace-nowrap">
						<thead>
							<tr>
								<!-- STAFF HEADER -->
								<th class="relative min-w-[15rem] max-w-[15rem] sticky top-0 left-0 border-r-[3px] border-b border-gray-400 bg-white z-30 p-0 align-bottom">
									<div class="flex flex-col absolute top-0 h-full w-full justify-between">
										<!-- NEEDED STAFF -->
										<div class="text-center w-full">
											<span class="text-sm font-normal mr-2">Benötigte Mitarbeiter:</span>
											<PsalmInput v-model.trim="tempProject.numberOfRequiredStaff" class="w-8 text-sm" type="number" />
										</div>

										<div>
											<label class="cursor-pointer items-center">
												<input
													v-model="enableHospitation"
													type="checkbox"
													class="h-[0.875rem] w-[0.875rem] border-2 border-primary place-self-center text-primary focus:ring-secondary focus:ring-1 cursor-pointer mr-1 my-1"
													@change="toggleEnableHospitation"
												/>
												<span class="text-sm font-normal" title="Hospitation"> Hospitation</span>
											</label>
										</div>

										<div class="flex self-end">
											<!-- BUTTONS -->
											<div class="flex w-36 border-r border-gray-400"><ProjectButton icon="copy" title="Angezeigte Mitarbeiter kopieren" @click="copyDisplayedStaff" /> <button @click="test">Test</button></div>

											<!-- HEADER FOR STAFF STATISTICS -->
											<div>
												<div class="text-xs border-t border-gray-400 font-semibold">Statistik</div>
												<div class="flex">
													<div class="w-8 text-xs font-normal border-t border-r border-gray-400">Kann</div>
													<div class="w-8 text-xs font-normal border-t border-r border-gray-400">Ist</div>
													<div class="w-[1.8125rem] text-xs font-normal border-t border-gray-400">Soll</div>
												</div>
											</div>
										</div>
									</div>
								</th>

								<!-- HEADER PER DAY -->
								<th v-for="day in tempProject.projectDays" :key="`date-${day.id}`" class="sticky top-0 border-r-[3px] last:border-r-0 border-gray-400 text-sm p-0 m-0 bg-white z-10">
									<!-- DATE & DELETE -->
									<div class="flex m-1 mt-0">
										<VueDatePicker v-model="day.date" class="mr-1" format="DD.MM.YYYY" color="#33658A" :minDate="minDate" no-header no-calendar-icon>
											<template #activator="{ date }">
												<button class="w-full font-semibold rounded-none border border-[#6b7280] focus:border-secondary focus:outline-none" :title="date">{{ date }}</button>
											</template>
										</VueDatePicker>
										<PsalmDeleteButton title="Tag löschen" @click="triggerDeleteModal(day)" />
									</div>
									<!-- TIME -->

									<div class="m-1 mt-0">
										<PsalmInput type="text" v-model.trim="day.time" class="w-24 text-sm text-center" placeholder="Uhrzeit" :title="day.time" />
									</div>
									<!-- PARTICIPANTS -->
									<div class="m-1 mt-0">
										<PsalmInput type="text" v-model.trim="day.participant" class="w-24 text-sm text-center" placeholder="Teilnehmer" :title="day.participant" />
									</div>
									<!-- HEADER FOR STAFF AVAILABILITIES AND DEPLOYMENTS -->
									<div class="flex border-b border-t border-gray-400">
										<div class="w-1/2 border-r border-gray-400">
											<ProjectFilterButton column="available" :day-id="day.id" :active-filter="activeFilter" @click="toggleFilter(day.id, 'available')" />
										</div>
										<div class="w-1/2">
											<ProjectFilterButton column="deployed" :day-id="day.id" :active-filter="activeFilter" @click="toggleFilter(day.id, 'deployed')" />
										</div>
									</div>
								</th>
								<!-- EMPTY CELL FOR SECOND STAFF LIST -->
								<th class="hidden lg:table-cell sticky top-0 right-0 w-[9.5rem] bg-white border-l-[3px] border-b border-gray-400 z-20"></th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="employee in staff" :key="employee.id" class="bg-white hover:bg-[#f8d3be]" :class="{ 'bg-[#FFFFE0]': employee.fullTime, 'even:bg-gray-200': !employee.fullTime }">
								<!-- STAFF LIST -->
								<td class="sticky left-0 z-10 bg-inherit text-left p-0" :title="`${employee.firstName} ${employee.lastName}`">
									<div class="h-full flex justify-between">
										<span class="w-36 overflow-ellipsis overflow-hidden border-r border-b border-gray-400 px-1 py-1">{{ employee.firstName }} {{ employee.lastName }}</span>
										<!-- EMPLOYEE STATISTICS -->
										<div class="flex text-center">
											<div class="w-8 border-r border-b border-gray-400 py-1">{{ getNumberOfAvailabilities(tempProject, employee.id) }}</div>
											<div class="w-8 border-r border-b border-gray-400 text-xs">
												<div title="Eingeteilt">{{ getNumberOfDeployments(tempProject, employee.id) }}</div>
												<div title="Reserve">{{ getNumberOfReserves(tempProject, employee.id) }}</div>
											</div>
											<div class="w-8 border-r-[3px] border-b border-gray-400 text-xs" :class="{ 'text-base py-1': employee.fullTime || tempProject.numberOfRequiredStaff === 0 }">
												<div :title="employee.fullTime || tempProject.numberOfRequiredStaff === 0 ? '' : 'Eingesetzt'">{{ getSetPointOfDeployments(tempProject, staff, employee) }}</div>
												<div v-if="!(employee.fullTime || tempProject.numberOfRequiredStaff === 0)" title="Reserve">
													{{ getSetPointOfReserves(tempProject, staff, employee) }}
												</div>
											</div>
										</div>
									</div>
								</td>

								<!-- EMPLOYEE AVAILABILITIES AND DEPLOYMENTS -->
								<template v-for="day in tempProject.projectDays">
									<td :key="`${day.id}`" class="border-b border-r-[3px] border-gray-400 p-0">
										<div class="flex w-full">
											<div class="w-1/2 py-1 border-r border-gray-400">
												<ProjectAvailabilityButton class="mx-auto" column="available" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
											</div>
											<div class="w-1/2 py-1">
												<ProjectAvailabilityButton class="mx-auto" column="deployed" :day="day" :employee-id="employee.id" @change="updateEmployeeAvailability" />
											</div>
										</div>
									</td>
								</template>
								<!-- SECOND STAFF LIST -->
								<td
									class="hidden lg:table-cell sticky right-0 z-10 overflow-ellipsis overflow-hidden bg-inherit text-left border-l-[3px] border-b border-gray-400 min-w-[9.5rem] max-w-[9.5rem]"
									:title="`${employee.firstName} ${employee.lastName}`"
								>
									<span class="px-1">{{ employee.firstName }} {{ employee.lastName }}</span>
								</td>
							</tr>
							<!-- NO EMPLOYEE SELECTED -->
							<tr v-if="staff.length === 0">
								<td :colspan="2 + tempProject.projectDays.length * 2">Keine Einträge</td>
							</tr>
							<!-- TOTAL STATISTICS -->
							<tr v-if="staff.length > 0" class="font-semibold">
								<td class="overflow-ellipsis overflow-hidden sticky left-0 bottom-0 z-20 bg-white text-left border-r-[3px] border-gray-400">
									<span class="px-1 py-0.5">Gesamt</span>
								</td>
								<template v-for="day in tempProject.projectDays">
									<td :key="`total-${day.id}`" class="border-r-[3px] border-gray-400 p-0 sticky bottom-0 z-10">
										<div class="flex w-full">
											<div
												class="w-1/2 border-r border-gray-400 py-0.5"
												:class="{
													'bg-danger text-white': day.staffAvailability.filter((e) => e.available === 'TRUE').length < tempProject.numberOfRequiredStaff && tempProject.numberOfRequiredStaff !== 0,
													'bg-warning text-white': day.staffAvailability.filter((e) => e.available === 'TRUE').length === tempProject.numberOfRequiredStaff && tempProject.numberOfRequiredStaff !== 0,
													'bg-success text-white': day.staffAvailability.filter((e) => e.available === 'TRUE').length > tempProject.numberOfRequiredStaff && tempProject.numberOfRequiredStaff !== 0,
													'bg-white text-black': tempProject.numberOfRequiredStaff === 0,
												}"
											>
												{{ day.staffAvailability.filter((e) => e.available === "TRUE").length }}
											</div>
											<div
												class="w-1/2 py-0.5"
												:class="{
													'bg-danger text-white':
														(day.staffAvailability.filter((e) => e.deployed === 'TRUE').length !== tempProject.numberOfRequiredStaff || day.staffAvailability.filter((e) => e.deployed === 'RESERVE').length > 1) &&
														tempProject.numberOfRequiredStaff !== 0,
													'bg-warning text-white':
														day.staffAvailability.filter((e) => e.deployed === 'TRUE').length === tempProject.numberOfRequiredStaff &&
														day.staffAvailability.filter((e) => e.deployed === 'RESERVE').length === 0 &&
														tempProject.numberOfRequiredStaff !== 0,
													'bg-success text-white':
														day.staffAvailability.filter((e) => e.deployed === 'TRUE').length === tempProject.numberOfRequiredStaff &&
														day.staffAvailability.filter((e) => e.deployed === 'RESERVE').length === 1 &&
														tempProject.numberOfRequiredStaff !== 0,
													'bg-white text-black': tempProject.numberOfRequiredStaff === 0,
												}"
											>
												{{ day.staffAvailability.filter((e) => e.deployed === "TRUE" || e.deployed === "RESERVE").length }}
											</div>
										</div>
									</td>
								</template>
								<td class="hidden lg:table-cell sticky right-0 bottom-0 z-20 sticky left-0 z-10 bg-white text-left border-l-[3px] border-gray-400">
									<span class="px-1 py-0.5">Gesamt</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</PsalmCard>
		</div>
		<PsalmModal v-if="modal.show && modal.type === 'DELETE_PROJECT_DAY'" @confirm="deleteProjectDay" />
	</div>
</template>

<script lang="ts">
	import { EmployeeAvailability, newEmployeeAvailability, newProjectDay, Project, ProjectDay } from "@/models/interfaces/Project";
	import store from "@/store";
	import { Component, Watch, Vue } from "vue-property-decorator";
	import PsalmModal from "@/components/common/PsalmModal.vue";
	import ProjectAvailabilityButton from "@/components/project/ProjectAvailabilityButton.vue";
	import ProjectButton from "@/components/project/ProjectButton.vue";
	import ProjectFilterButton from "@/components/project/ProjectFilterButton.vue";
	import ProjectStaff from "@/components/project/ProjectStaff.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmDeleteButton from "@/components/common/PsalmDeleteButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { unequal } from "@/utils/utils";
	import { Employee } from "@/models/interfaces/Employee";
	import { writeText } from "@tauri-apps/api/clipboard";
	import { VueDatePicker } from "@mathieustan/vue-datepicker";
	import "@mathieustan/vue-datepicker/dist/vue-datepicker.min.css";
	import { Available } from "@/models/enums/Available";
	import { Deployed } from "@/models/enums/Deployed";
	import { findEmployeeAvailability, getNumberOfAvailabilities, getNumberOfDeployments, getNumberOfReserves, getSetPointOfDeployments, getSetPointOfReserves, writePdfForEachEmployee } from "@/utils/projects";
	import { ActiveFilter, resetActiveFilter } from "@/models/interfaces/ActiveFilter";
	import { Modal } from "@/models/interfaces/Modal";
	import { ModalType } from "@/models/enums/ModalType";

	@Component({
		name: "ProjectPage",
		components: { PsalmDeleteButton, PsalmModal, ProjectAvailabilityButton, ProjectButton, ProjectFilterButton, ProjectStaff, PsalmButton, PsalmCard, PsalmIcon, PsalmInput, VueDatePicker },
	})
	export default class ProjectPage extends Vue {
		projectId = this.$route.path.split("/")[2];
		projectStaffEditMode = false;
		showSecondStaffList = false;
		minDate = new Date();
		activeFilter: ActiveFilter = resetActiveFilter();
		enableHospitation = store.state.enableHospitation;

		get tempProject(): Project {
			return store.state.tempProjects.find((e) => e.id === this.projectId) as Project;
		}

		get modal(): Modal {
			return store.state.modal;
		}

		get staff(): Array<Employee> {
			let availableStaff: Array<EmployeeAvailability> | undefined = [];

			const tempStaff = store.state.fileStaff.filter((item) => this.tempProject.staff.includes(item.id));

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

		get unsavedChanges(): boolean {
			return unequal(
				this.tempProject,
				store.state.fileProjects.find((e) => e.id === this.projectId),
			);
		}

		@Watch("unsavedChanges")
		updateWindowTitle(value: boolean): void {
			store.commit("updateUnsavedChanges", value);
			store.commit("updateWindowTitle");
		}

		test(): void {
			console.log(
				"unsavedChanges",
				unequal(
					this.tempProject,
					store.state.fileProjects.find((e) => e.id === this.projectId),
				),
			);

			console.log(this.unsavedChanges);
		}

		created(): void {
			this.minDate.setMonth(this.minDate.getMonth() - 12);

			if (this.tempProject.staff.length === 0) {
				this.projectStaffEditMode = true;
			}

			this.deleteRemovedData();

			console.log(this.$route.path);
			console.log(this.unsavedChanges);
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
			//DELETE UNUSED STAFFAVAILABILITYS
			this.deleteRemovedData();

			await store.dispatch("saveTempStatesToFiles");
		}

		triggerDeleteModal(projectDayToDelete: ProjectDay): void {
			store.commit("showModal", { type: ModalType.DELETE_PROJECT_DAY, content: projectDayToDelete });
		}

		async deleteProjectDay(): Promise<void> {
			const projectDayToDelete = store.state.modal.content as ProjectDay;

			this.tempProject.projectDays.splice(
				this.tempProject.projectDays.findIndex((e) => e.id === projectDayToDelete.id),
				1,
			);

			await this.saveProject();
			store.commit("showToast", "deleted");
			store.commit("resetModal");
		}

		deleteRemovedData(): void {
			// DELETE DELETED EMPLOYEES FROM STAFF LIST
			this.tempProject.staff.forEach((item, index, object) => {
				if (!store.state.fileStaff.find((e) => e.id === item)) {
					object.splice(index, 1);
				}
			});

			// DELETE UNUSED staffAvailability
			this.tempProject.projectDays.forEach((day) => {
				day.staffAvailability.forEach((item, index, object) => {
					if (!this.tempProject.staff.includes(item.employeeId)) {
						object.splice(index, 1);
					}
				});
			});
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

		getNumberOfReserves(project: Project, employeeId: string): number {
			return getNumberOfReserves(project, employeeId);
		}

		getSetPointOfDeployments(project: Project, staff: Array<Employee>, employee: Employee): number | string {
			return getSetPointOfDeployments(project, staff, employee);
		}

		getSetPointOfReserves(project: Project, staff: Array<Employee>, employee: Employee): number | string {
			return getSetPointOfReserves(project, staff, employee);
		}
		toggleEnableHospitation(): void {
			store.commit("toggleEnableHospitation");
		}
	}
</script>

<style scoped>
	.project-table {
		border-spacing: 0;
	}

	.project-table thead th:nth-last-child(2),
	.project-table tbody td:nth-last-child(2) {
		border-right: 0;
	}
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
		border-radius: 0.125rem;
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
