import { Employee } from "@/models/interfaces/Employee";
import { Project } from "@/models/interfaces/Project";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		staff: [] as Array<Employee>,
		projects: new Map() as Map<string, Project>,
		savedToast: false,
	},
	mutations: {
		// GENERELL
		showSavedToast(currentState): void {
			currentState.savedToast = true;
			setTimeout(() => {
				currentState.savedToast = false;
			}, 2500);
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
