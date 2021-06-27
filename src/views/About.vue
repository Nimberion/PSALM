<template>
	<!-- :class="{ 'bg-[#33658A] rounded text-white': employee.id === id }"
	min-w von window = 500px-->
	<div class="w-[max-content] h-[max-content] border text-center bg-white rounded shadow-lg p-2 m-2">
		<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter</h2>
		<div class="grid grid-cols-[1fr,1fr,3rem,2rem] font-semibold">
			<div class="text-left px-1">Vorname</div>
			<div class="text-left px-1">Nachname</div>
			<div title="Hauptamtlich?">HA?</div>
		</div>
		<ul class="mb-4">
			<li class="grid grid-cols-[1fr,1fr,3rem,2rem] border-t border-black" v-for="employee in tempStaff" :key="employee.id">
				<input type="text" v-model="employee.firstName" class="p-0 focus:ring-0 rounded border border-transparent focus:border-black focus:-translate-x-1 focus:-translate-y-1 focus:shadow-lg px-1" />
				<input type="text" v-model="employee.lastName" class="p-0 focus:ring-0 rounded border border-transparent focus:border-black focus:-translate-x-1 focus:-translate-y-1 focus:shadow-lg px-1" />
				<input class="rounded place-self-center text-[#33658A] focus:ring-[#33658A] focus:border-[#33658A] cursor-pointer" type="checkbox" v-model="employee.fullTime" />
				<button class="place-self-center" @click="triggerDeleteModal(employee)"><img src="@/assets/trash-alt-solid.svg" class="h-4" /></button>
			</li>
			<li class="grid grid-cols-[1fr,1fr,3rem,2rem] border-t border-black" v-if="displayAddEmployee">
				<input type="text" placeholder="Vorname" v-model="newEmployee.firstName" class="p-0 focus:ring-0 rounded border border-transparent focus:border-black focus:-translate-x-1 focus:-translate-y-1 focus:shadow-lg px-1" />
				<input type="text" placeholder="Nachname" v-model="newEmployee.lastName" class="p-0 focus:ring-0 rounded border border-transparent focus:border-black focus:-translate-x-1 focus:-translate-y-1 focus:shadow-lg px-1" />
				<input class="rounded place-self-center text-[#33658A] focus:ring-[#33658A] focus:border-[#33658A] cursor-pointer" type="checkbox" v-model="newEmployee.fullTime" />
				<button class="place-self-center" @click="discardNewEmployee"><img src="@/assets/trash-alt-solid.svg" class="h-4" /></button>
			</li>
		</ul>
		<div class="flex justify-center">
			<button class="flex justify-center min-w-[4rem] bg-[#33658A] text-white rounded p-2 mr-4" @click="addEmployee"><img src="@/assets/user-plus-solid.svg" class="h-4" /></button>
			<button class="flex justify-center min-w-[4rem] bg-[#33658A] text-white rounded p-2 ml-4" @click="saveStaff"><img src="@/assets/save-solid.svg" class="h-4" /></button>
		</div>
	</div>
</template>

<script lang="ts">
	import { Employee, newEmployee } from "@/interfaces/Employee";
	import store from "@/store";
	import { Component, Vue } from "vue-property-decorator";

	@Component({
		name: "About",
	})
	export default class About extends Vue {
		displayAddEmployee = false;
		newEmployee = newEmployee();
		tempStaff: Array<Employee> = [];

		get staff(): Array<Employee> {
			return store.getters.sortedStaff;
		}

		created(): void {
			this.tempStaff = JSON.parse(JSON.stringify(this.staff));
		}

		addEmployee(): void {
			this.displayAddEmployee = true;
		}

		discardNewEmployee(): void {
			this.displayAddEmployee = false;
			this.newEmployee = newEmployee();
		}

		saveStaff(): void {
			//add mutation in store which sorts as well
			store.state.staff = this.tempStaff;
		}
	}
</script>
