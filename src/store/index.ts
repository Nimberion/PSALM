import { Employee } from "@/interfaces/Employee";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		staff: [] as Array<Employee>,
	},
	mutations: {
		updateStaff(currentState, newState: Array<Employee>) {
			currentState.staff = newState;
		},
		addEmployee(currentState, newEmployee: Employee) {
			currentState.staff.push(newEmployee);
		},
	},
	actions: {},
	modules: {},
});
