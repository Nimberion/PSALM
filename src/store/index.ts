import { Employee } from "@/interfaces/Employee";
import { Project } from "@/interfaces/Project";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		staff: [] as Array<Employee>,
		projectList: [] as Array<string>,
		projects: new Map() as Map<string, Project>,
	},
	mutations: {
		// STAFF
		addEmployee(currentState, newEmployee: Employee) {
			currentState.staff.push(newEmployee);
		},
		updateStaff(currentState, newState: Array<Employee>) {
			currentState.staff = newState;

			// Input sorting here
		},

		// PROJECTS

		//### themp
		updateProjectList(currentState, newState: Array<string>) {
			currentState.projectList = newState;

			// Input sorting here
		},
		//###

		updateProjects(currentState, newState: Map<string, Project>) {
			currentState.projects = newState;

			// projects sorting here
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
