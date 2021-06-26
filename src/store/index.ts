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
		saveEmployee(currentState, employee) {
			const existingEmployee = currentState.staff.findIndex((element) => element.id === employee.id);

			if (existingEmployee > -1) {
				currentState.staff.splice(existingEmployee, 1, employee);
			} else {
				currentState.staff.push(employee);
			}
		},
	},
	actions: {},
	modules: {},
	getters: {
		sortedStaff: (state) => {
			return state.staff.sort((e1, e2) => {
				return e1.lastName >= e2.lastName ? 1 : -1;
			});
		},
	},
});
