import { Employee } from "@/models/interfaces/Employee";
import { Project } from "@/models/interfaces/Project";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		staff: [] as Array<Employee>,
		projects: new Map() as Map<string, Project>,
		toast: { show: false, message: "" },
		timeouts: [] as Array<number>,
	},
	mutations: {
		// GENERELL
		showToast(currentState, message): void {
			switch (message) {
				case "copied":
					currentState.toast.message = "Mitarbeiter kopiert!";
					break;
				case "saved":
					currentState.toast.message = "Erfolgreich gespeichert!";
					break;
				default:
					currentState.toast.message = "Error!";
					break;
			}

			// CLEAR TIMEOUT IF TOAST WAS ALREADY ACTIVE
			clearTimeout(currentState.timeouts[0]);
			currentState.timeouts = [];

			currentState.toast.show = true;

			currentState.timeouts.push(
				setTimeout(() => {
					currentState.toast.show = false;
				}, 2500),
			);
		},

		// STAFF
		updateStaff(currentState, newState: Array<Employee>) {
			currentState.staff = newState;
		},

		// PROJECTS
		updateProjects(currentState, newState: Map<string, Project>) {
			currentState.projects = newState;
		},

		updateProject(currentState, newState) {
			currentState.projects.set(newState.id, newState);
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
