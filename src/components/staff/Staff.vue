<template>
	<!-- :class="{ 'bg-primary rounded text-white': employee.id === id }"
	min-w von window = 500px-->
	<div class="w-[max-content] h-[max-content] border text-center bg-white rounded shadow-lg p-2 m-2">
		<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter</h2>
		<div class="grid grid-cols-[1fr,1fr,3rem,2rem] font-semibold">
			<div class="text-left px-1">Vorname</div>
			<div class="text-left px-1">Nachname</div>
			<div title="Hauptamtlich?">HA?</div>
		</div>
		<ul class="">
			<li class="grid grid-cols-[1fr,1fr,3rem,2rem] grid-rows-[auto,auto]" v-for="employee in tempStaff" :key="employee.id">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<!-- EMPLOYEE INPUTS -->
				<TextInput type="text" v-model="employee.firstName" placeholder="Vorname" />
				<TextInput type="text" v-model="employee.lastName" placeholder="Nachname" />
				<Checkbox type="checkbox" v-model="employee.fullTime" />
				<button class="place-self-center" @click="triggerDeleteModal(employee)"><Icon name="trash" class="text-danger" /></button>
			</li>
		</ul>
		<div class="flex justify-center">
			<button class="flex justify-center min-w-[6rem] bg-primary text-white rounded p-2 m-4 mb-0" @click="addEmployee"><Icon name="user-plus" /></button>
			<button class="flex justify-center min-w-[6rem] bg-primary text-white rounded p-2 m-4 mb-0" @click="saveStaff">
				<Icon name="save" />
			</button>
		</div>

		<!-- DELETE MODAL -->
		<div v-if="showDeleteModal === true" class="absolute top-0 left-0 bottom-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)]" @click="showDeleteModal = false">
			<div class="grid grid-cols-2 grid-rows-[repeat(3,auto)] gap-4 bg-white rounded shadow-lg p-4 z-50" @click.stop>
				<h2 class="col-span-2 bg-[#33658A] text-white font-semibold text-center rounded p-1">Achtung!</h2>
				<p class="col-span-2">
					Bist du sicher, dass du <span class="font-semibold">"{{ employeeToDelete.firstName }} {{ employeeToDelete.lastName }}"</span> löschen möchtest?
				</p>
				<button class="max-w-max place-self-end bg-[#33658A] text-white rounded text-sm p-2 py-1" @click="deleteEmployee">Löschen</button>
				<button class="max-w-max place-self-start bg-[#D23833] text-white rounded text-sm p-2 py-1" @click="showDeleteModal = false">Abrechnen</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, newEmployee } from "@/interfaces/Employee";
	import { pathExists } from "@/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";

	import Checkbox from "@/components/common/Checkbox.vue";
	import Icon from "@/components/common/Icon.vue";
	import TextInput from "@/components/common/TextInput.vue";

	@Component({
		name: "Staff",
		components: { Checkbox, Icon, TextInput },
	})
	export default class Staff extends Vue {
		tempStaff: Array<Employee> = [];

		showDeleteModal = false;
		employeeToDelete = newEmployee();

		get staff(): Array<Employee> {
			return store.getters.sortedStaff;
		}

		created(): void {
			this.tempStaff = JSON.parse(JSON.stringify(this.staff));
		}

		updateCheckbox(nativeValue: boolean, value: boolean): void {
			nativeValue = value;
		}

		addEmployee(): void {
			this.tempStaff.push(newEmployee());
		}

		async saveStaff(): Promise<void> {
			store.commit("updateStaff", this.tempStaff);

			// DELETE JSON FILE
			if (await pathExists("data", "data\\staff.json")) {
				await removeFile("data/staff.json");
			}
			// WRITE JSON FILE
			await writeFile({ contents: JSON.stringify(store.state.staff), path: "data/staff.json" });
			console.log("Save complete");
		}

		triggerDeleteModal(employeeToDelete: Employee): void {
			this.showDeleteModal = true;
			this.employeeToDelete = employeeToDelete;
		}

		deleteEmployee(): void {
			console.log(this.employeeToDelete.id);
			this.showDeleteModal = false;
		}
	}
</script>
