import { Modal } from "@/models/interfaces/Modal";
import { Employee } from "@/models/interfaces/Employee";
import { Project, ProjectDay } from "@/models/interfaces/Project";
import { WindowManager } from "@tauri-apps/api/window";
import Vue from "vue";
import Vuex from "vuex";
import { Toast } from "@/models/interfaces/Toast";
import { ModalType } from "@/models/enums/ModalType";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		staff: [] as Array<Employee>,
		projects: new Map() as Map<string, Project>,
		toast: { show: false, message: "" } as Toast,
		activeTimeout: -1,
		unsavedChanges: false,
		modal: { show: false, type: ModalType.ERROR, content: "" } as Modal,
		enableHospitation: false,
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

		// STAFF
		updateStaff(currentState, newStaff: Array<Employee>) {
			currentState.staff = JSON.parse(JSON.stringify(newStaff));
		},

		// PROJECTS
		updateProjects(currentState, newProjects: Map<string, Project>) {
			currentState.projects = new Map(JSON.parse(JSON.stringify(Array.from(newProjects))));
		},

		updateProject(currentState, newProject) {
			//JSON.parse & .stingify TO CREATE A DEEP COPY
			currentState.projects.set(newProject.id, JSON.parse(JSON.stringify(newProject)));
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

			new WindowManager().setTitle(appTitle + unsavedChanges);
		},
	},
	actions: {},
	modules: {},
	getters: {
		//move to updateStaff
		sortedStaff: (state) => {
			return state.staff.sort((e1, e2) => {
				return e1.lastName >= e2.lastName ? 1 : -1;
			});
		},
	},
});
