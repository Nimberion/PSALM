<template>
	<!-- in components auslagern -->
	<div class="flex min-w-screen">
		<ul class="border flex flex-col min-w-[50%] p-2 mr-1">
			<li class="cursor-pointer p-1" :class="{ 'bg-gray-400': employee.id === id }" v-for="employee in staff" :key="employee.id" @click="setActiveEmployee(employee)">{{ employee.firstName }} {{ employee.lastName }}</li>
		</ul>
		<div class="border flex flex-col min-w-[50%] p-2 ml-1">
			<button class="bg-gray-400 p-2 border border-gray-600 rounded mb-2" @click="addEmployee">Mitarbeiter hinzufügen</button>
			<div class="flex items-center text-left mb-2">
				<div class="font-semibold mr-2">Vorname:</div>
				<input class="w-full rounded p-1 px-2" type="text" v-model="firstName" />
			</div>
			<div class="flex items-center text-left mb-2">
				<div class="font-semibold mr-2">Nachname:</div>
				<input class="w-full rounded p-1 px-2" type="text" v-model="lastName" />
			</div>
			<div class="flex items-center text-left mb-2">
				<div class="font-semibold mr-2">Hauptamtlich?</div>
				<input class="rounded" type="checkbox" v-model="fullTime" />
			</div>
			<button class="bg-gray-400 p-2 border border-gray-600 rounded" @click="saveEmployee">Speichern</button>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, newEmployee } from "@/interfaces/Employee";
	import { newID } from "@/utils";

	@Component({
		name: "Staff",
	})
	export default class Staff extends Vue {
		id = newID();
		firstName = "";
		lastName = "";
		fullTime = false;
		projects: Array<string> = [];

		get staff(): Array<Employee> {
			return store.getters.sortedStaff;
		}

		addEmployee(): void {
			this.setActiveEmployee(newEmployee());
		}

		setActiveEmployee(employee: Employee): void {
			this.id = employee.id;
			this.firstName = employee.firstName;
			this.lastName = employee.lastName;
			this.fullTime = employee.fullTime;
			this.projects = employee.projects;
		}

		saveEmployee(): void {
			store.commit("saveEmployee", newEmployee(this.id, this.firstName, this.lastName, this.fullTime, this.projects));
			//add file save
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
