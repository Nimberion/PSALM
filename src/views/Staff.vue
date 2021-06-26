<template>
	<div class="">
		<div class="" v-for="employee in staff" :key="employee.id" @click="activeEmployee = employee">{{ employee.firstName }} {{ employee.lastName }}</div>
		<button @click="addEmployee">Mitarbeiter hinzufügen</button>

		<input type="text" v-model="activeEmployee.firstName" />
		<input type="text" v-model="activeEmployee.lastName" />
		<input type="checkbox" v-model="activeEmployee.fullTime" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, addEmployee } from "@/interfaces/Employee";

	@Component({
		name: "Staff",
	})
	export default class Staff extends Vue {
		activeEmployee: Employee = addEmployee();

		get staff(): Array<Employee> {
			return store.state.staff;
		}

		addEmployee(): void {
			addEmployee();
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	h3 {
		margin: 40px 0 0;
	}
	ul {
		list-style-type: none;
		padding: 0;
	}
	li {
		display: inline-block;
		margin: 0 10px;
	}
	a {
		color: #42b983;
	}
</style>
