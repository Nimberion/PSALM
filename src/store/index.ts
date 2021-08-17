import { Modal } from "@/models/interfaces/Modal";
import { Employee } from "@/models/interfaces/Employee";
import { Project, ProjectDay } from "@/models/interfaces/Project";
import { WindowManager } from "@tauri-apps/api/window";
import Vue from "vue";
import Vuex from "vuex";
import { Toast } from "@/models/interfaces/Toast";
import { ModalType } from "@/models/enums/ModalType";
import { pathExists, unequal } from "@/utils/utils";
import { removeFile, writeFile } from "@tauri-apps/api/fs";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		fileStaff: [] as Array<Employee>,
		tempStaff: [] as Array<Employee>,

		fileProjects: [] as Array<Project>,
		tempProjects: [] as Array<Project>,

		toast: { show: false, message: "" } as Toast,
		activeTimeout: -1,

		modal: { show: false, type: ModalType.ERROR, content: "" } as Modal,

		enableHospitation: false,
		unsavedChanges: false,
	},
	mutations: {
		// GENERELL
		showModal(currentState, { type, content }: { type: ModalType; content: Employee | Project | ProjectDay | string }): void {
			currentState.modal = { show: true, type: type, content: content };
		},

		resetModal(currentState): void {
			currentState.modal = { show: false, type: ModalType.ERROR, content: "" };
		},

		showToast(currentState, message): void {
			switch (message) {
				case "copied":
					currentState.toast.message = "Mitarbeiter kopiert!";
					break;
				case "deleted":
					currentState.toast.message = "Erfolgreich gelöscht!";
					break;
				case "imported":
					currentState.toast.message = "Erfolgreich Importiert!";
					break;
				case "saved":
					currentState.toast.message = "Erfolgreich gespeichert!";
					break;
				default:
					currentState.toast.message = "Error!";
					break;
			}

			// CLEAR TIMEOUT IF TOAST WAS ALREADY ACTIVE
			clearTimeout(currentState.activeTimeout);

			currentState.toast.show = true;

			currentState.activeTimeout = setTimeout(() => {
				currentState.toast.show = false;
			}, 2500);
		},

		toggleEnableHospitation(currentState) {
			currentState.enableHospitation = !currentState.enableHospitation;
		},

		// FILE STAFF
		updateFileStaff(currentState, newStaff: Array<Employee>) {
			currentState.fileStaff = JSON.parse(JSON.stringify(newStaff));
		},

		// FILE PROJECTS
		updateFileProjects(currentState, newProjects: Map<string, Project>) {
			currentState.fileProjects = JSON.parse(JSON.stringify(newProjects));
		},

		// TEMP STAFF
		updateTempStaff(currentState, newStaff: Array<Employee>) {
			currentState.tempStaff = JSON.parse(JSON.stringify(newStaff));
		},

		// TEMP PROJECTS
		updateTempProjects(currentState, newProjects: Map<string, Project>) {
			currentState.tempProjects = JSON.parse(JSON.stringify(newProjects));
		},

		updateProject(currentState, newProject) {
			currentState.fileProjects[
				currentState.fileProjects.findIndex((e) => {
					e.id === newProject.id;
				})
			] = JSON.parse(JSON.stringify(newProject));
		},

		updateUnsavedChanges(currentState, newState) {
			currentState.unsavedChanges = newState;
		},

		updateWindowTitle(currentState): void {
			const appTitle = "PSALM - Project Staff And Labor Management";
			let unsavedChanges = "";

			if (currentState.unsavedChanges) {
				unsavedChanges = " (ungespeicherte Änderungen)";
			}

			new WindowManager("main").setTitle(appTitle + unsavedChanges);
		},
	},
	actions: {
		async saveTempStatesToFiles({ state, commit }) {
			// SAVE PROJECTS
			state.tempProjects.sort((a, b) => {
				return a.title.localeCompare(b.title, "de", { ignorePunctuation: true, sensitivity: "base" });
			});

			// state.tempProjects.forEach(async (tempProject) => {
			// 	// DELETE DELETED EMPLOYEES FROM STAFF LIST
			// 	tempProject.staff.forEach((employeeId, index, projectStaff) => {
			// 		if (!state.fileStaff.find((e) => e.id === employeeId)) {
			// 			projectStaff.splice(index, 1);
			// 		}
			// 	});
			// });

			state.tempProjects.forEach(async (tempProject) => {
				// DELETE DELETED EMPLOYEES FROM STAFF LIST
				tempProject.staff.forEach((employeeId, index, projectStaff) => {
					if (!state.fileStaff.find((e) => e.id === employeeId)) {
						projectStaff.splice(index, 1);
					}
				});

				// SEARCH FOR EDITED PROJECTS
				if (unequal(tempProject, state.fileProjects.find((fileProject) => fileProject.id === tempProject.id) || {})) {
					//SORT projectDays
					tempProject.projectDays.sort((a, b) => {
						if (a.date > b.date) return 1;
						if (a.date < b.date) return -1;

						if (a.time > b.time) return 1;
						if (a.time < b.time) return -1;

						return a.participant.localeCompare(b.participant, "de", { ignorePunctuation: true, sensitivity: "base" });
					});

					// DELETE UNUSED staffAvailability
					tempProject.projectDays.forEach((day) => {
						day.staffAvailability.forEach((item, index, object) => {
							if (!tempProject.staff.includes(item.employeeId)) {
								object.splice(index, 1);
							}
						});
					});

					// DELETE OLD JSON FILE
					if (await pathExists("data\\projects", `data\\projects\\${tempProject.id}.json`)) {
						await removeFile(`data/projects/${tempProject.id}.json`);
					}

					// WRITE NEW JSON FILE
					await writeFile({ contents: JSON.stringify(tempProject), path: `data/projects/${tempProject.id}.json` });
				}
			});

			commit("updateFileProjects", state.tempProjects);

			// SAVE STAFF
			state.tempStaff.sort((a, b) => {
				const lastNameSortingResult = a.lastName.localeCompare(b.lastName, "de", { ignorePunctuation: true, sensitivity: "base" });
				const firstNameSortingResult = a.firstName.localeCompare(b.firstName, "de", { ignorePunctuation: true, sensitivity: "base" });

				return lastNameSortingResult !== 0 ? lastNameSortingResult : firstNameSortingResult;
			});

			if (unequal(state.fileStaff, state.tempStaff)) {
				// DELETE JSON FILE
				if (await pathExists("data", "data\\staff.json")) {
					await removeFile("data/staff.json");
				}
				// WRITE JSON FILE
				await writeFile({ contents: JSON.stringify(state.tempStaff), path: "data/staff.json" });

				// UPDATE FILE STAFF
				commit("updateFileStaff", state.tempStaff);
			}

			// SHOW SAVED TOAST
			commit("showToast", "saved");
		},
	},
	modules: {},
	getters: {},
});
