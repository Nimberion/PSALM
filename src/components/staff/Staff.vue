<template>
	<div class="max-w-max md:grid md:grid-cols-[auto,auto] md:grid-rows-[auto,auto] bg-white rounded shadow-lg p-4">
		<h2 class="col-span-2 font-semibold text-center mb-4">Mitarbeiter</h2>
		<!-- STAFF LIST -->
		<ul class="w-[300px] h-[max-content] border text-center bg-white rounded shadow-lg mb-4 md:mb-0 md:mr-1 p-2">
			<li class="cursor-pointer p-1" :class="{ 'bg-[#33658A] rounded text-white': employee.id === id }" v-for="employee in staff" :key="employee.id" @click="setEmployee(employee)">
				<span>{{ employee.firstName }} {{ employee.lastName }}</span>
				<button class="text-sm font-extrabold text-red-700 ml-2" @click="triggerDeleteModal(employee)">X</button>
			</li>
		</ul>

		<EditStaffForm class="w-[300px] md:ml-1" :_first-name="firstName" :_last-name="lastName" :_full-time="fullTime" @add-employee="addEmployee" @save-employee="saveEmployee" @change="editEmployee" />
		<div v-if="showDeleteModal === true" class="absolute top-0 left-0 min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)]" @click="showDeleteModal = false">
			<div class="grid grid-cols-2 grid-rows-[repeat(3,auto)] gap-4 bg-white rounded p-4" @click.stop>
				<h2 class="col-span-2 font-semibold text-center">Achtung!</h2>
				<p class="col-span-2">
					Bist du sicher, dass du <span class="font-semibold">{{ employeeToDelete.firstName }} {{ employeeToDelete.lastName }}</span> löschen möchtest?
				</p>
				<button class="max-w-max place-self-end bg-[#33658A] text-white rounded text-sm p-2 py-1" @click="deleteEmployee">Fortfahren</button>
				<button class="max-w-max place-self-start bg-[#D23833] text-white rounded text-sm p-2 py-1" @click="showDeleteModal = false">Abrechnen</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, newEmployee } from "@/interfaces/Employee";
	import EditStaffForm from "@/components/staff/EditStaffForm.vue";
	import { newID, pathExists } from "@/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";

	@Component({
		name: "Staff",
		components: { EditStaffForm },
	})
	export default class Staff extends Vue {
		id = newID();
		firstName = "";
		lastName = "";
		fullTime = false;
		projects: Array<string> = [];

		showDeleteModal = false;
		employeeToDelete = newEmployee();

		get staff(): Array<Employee> {
			return store.getters.sortedStaff;
		}

		addEmployee(): void {
			this.setEmployee(newEmployee());
		}

		editEmployee(fieldName: string, event: InputEvent): void {
			const element = event.target as HTMLInputElement;

			switch (fieldName) {
				case "firstName":
					this.firstName = element.value;
					break;
				case "lastName":
					this.lastName = element.value;
					break;
				case "fullTime":
					this.fullTime = element.checked;
					break;
			}
		}

		setEmployee(employee: Employee): void {
			this.id = employee.id;
			this.firstName = employee.firstName;
			this.lastName = employee.lastName;
			this.fullTime = employee.fullTime;
			this.projects = employee.projects;
		}

		async saveEmployee(): Promise<void> {
			if (this.firstName !== "" && this.lastName !== "") {
				// ADD EMPLOYEE To STORE
				store.commit("saveEmployee", newEmployee(this.id, this.firstName, this.lastName, this.fullTime, this.projects));
			} else {
				console.log("Das Feld war leer. Fülle es aus!");
			}
			// DELETE JSON FILE
			if (await pathExists("data", "data\\staff.json")) {
				await removeFile("data/staff.json");
			}
			// WRITE JSON FILE
			await writeFile({ contents: JSON.stringify(store.state.staff), path: "data/staff.json" });
		}

		triggerDeleteModal(employeeToDelete: Employee): void {
			this.showDeleteModal = true;
			this.employeeToDelete = employeeToDelete;
		}

		deleteEmployee(): void {
			console.log(this.employeeToDelete.id);
		}
	}
</script>
