<template>
	<!-- :class="{ 'bg-primary rounded text-white': employee.id === id }"-->
	<div class="border bg-white rounded shadow-lg px-2 py-4">
		<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[1fr,1fr,3rem,2rem] font-semibold">
			<div class="px-1" title="Vorname">Vorname</div>
			<div class="px-1" title="Nachname">Nachname</div>
			<div class="text-center" title="Hauptamtlich?">HA?</div>
		</div>
		<ul class="">
			<li class="grid grid-cols-[1fr,1fr,3rem,2rem] grid-rows-[auto,auto]" v-for="employee in tempStaff" :key="employee.id">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<!-- EMPLOYEE INPUTS -->
				<PsalmInput v-if="editMode" type="text" v-model="employee.firstName" placeholder="Vorname" />
				<PsalmInput v-if="editMode" type="text" v-model="employee.lastName" placeholder="Nachname" />
				<PsalmInput v-if="editMode" type="checkbox" v-model="employee.fullTime" />
				<!-- EMPLOYEE LIST -->
				<div v-if="!editMode" class="px-1">{{ employee.firstName }}</div>
				<div v-if="!editMode" class="px-1">{{ employee.lastName }}</div>
				<PsalmInput v-if="!editMode" type="checkbox" state="disabled" disabled v-model="employee.fullTime" />

				<button class="place-self-center" title="Löschen" @click="triggerDeleteModal(employee)"><PsalmIcon name="trash" class="text-danger" /></button>
			</li>
			<!-- NO ENTRYS -->
			<li v-if="tempStaff.length === 0" class="text-center">
				<!-- HORIZONTAL DIVIDER -->
				<div class="w-full col-span-4 border-b border-gray-500"></div>
				<p>Keine Einträge</p>
			</li>
		</ul>
		<div class="flex justify-center">
			<PsalmButton icon="user-plus" class="bg-primary" @click="addEmployee" />
			<PsalmButton v-if="editMode" icon="save" class="bg-primary" @click="saveStaff" />
			<PsalmButton v-if="!editMode" icon="" class="bg-primary" @click="editMode = true">Edit</PsalmButton>
		</div>

		<!-- DELETE MODAL -->
		<div v-if="showDeleteModal === true" class="absolute top-0 left-0 bottom-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)]" @click="showDeleteModal = false">
			<div class="grid grid-cols-1 grid-rows-[repeat(3,auto)] gap-4 bg-white rounded shadow-lg p-4 z-50" @click.stop>
				<h2 class="bg-primary text-white font-semibold text-center rounded p-1">Achtung!</h2>
				<p class="col-span-2">
					Bist du sicher, dass du <span class="font-semibold">"{{ employeeToDelete.firstName }} {{ employeeToDelete.lastName }}"</span> löschen möchtest?
				</p>
				<div class="flex justify-center">
					<PsalmButton class="bg-danger" @click="deleteEmployee">Löschen</PsalmButton>
					<PsalmButton class="bg-primary" @click="showDeleteModal = false">Abrechnen</PsalmButton>
				</div>
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
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";

	@Component({
		name: "Staff",
		components: { PsalmButton, PsalmIcon, PsalmInput },
	})
	export default class Staff extends Vue {
		tempStaff: Array<Employee> = [];

		showDeleteModal = false;
		employeeToDelete = newEmployee();

		editMode = false;

		get staff(): Array<Employee> {
			// return store.getters.sortedStaff;
			return store.state.staff;
		}

		created(): void {
			this.tempStaff = JSON.parse(JSON.stringify(this.staff));
		}

		test(): void {
			window.alert("Hello world!");
		}

		updateCheckbox(nativeValue: boolean, value: boolean): void {
			nativeValue = value;
		}

		addEmployee(): void {
			this.editMode = true;
			this.tempStaff.push(newEmployee());
		}

		async saveStaff(): Promise<void> {
			//SORT TEMP-STAFF
			this.tempStaff.sort((e1, e2) => {
				return e1.lastName >= e2.lastName ? 1 : -1;
			});

			// PUSH TEMP-STAFF TO STORE
			store.commit("updateStaff", this.tempStaff);

			// DELETE JSON FILE
			if (await pathExists("data", "data\\staff.json")) {
				await removeFile("data/staff.json");
			}
			// WRITE JSON FILE
			await writeFile({ contents: JSON.stringify(store.state.staff), path: "data/staff.json" });

			this.editMode = false;
			console.log("Save complete");
		}

		triggerDeleteModal(employeeToDelete: Employee): void {
			this.showDeleteModal = true;
			this.employeeToDelete = employeeToDelete;
		}

		deleteEmployee(): void {
			this.tempStaff.splice(
				this.tempStaff.findIndex((element) => element.id === this.employeeToDelete.id),
				1,
			);

			this.saveStaff();
			this.showDeleteModal = false;
		}
	}
</script>
