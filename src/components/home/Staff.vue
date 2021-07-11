<template>
	<!-- bg-gradient-to-br from-[rgba(255,255,255,0.7)] to-[rgba(255,255,255,0.3)] backdrop-blur -->
	<div class="bg-white rounded shadow-lg px-2 py-4" :class="{ 'from-[rgba(245,170,170,0.5)]': editMode }">
		<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[1fr,1fr,3rem,2rem] font-semibold">
			<div class="px-1" title="Vorname">Vorname</div>
			<div class="px-1" title="Nachname">Nachname</div>
			<div class="text-center" title="Hauptamtlich?">HA?</div>
		</div>
		<ul>
			<li class="grid grid-cols-[1fr,1fr,3rem,2rem] grid-rows-[auto,auto]" v-for="employee in tempStaff" :key="employee.id">
				<!-- HORIZONTAL DIVIDER -->
				<hr class="h-[1px] w-full col-span-4 bg-gray-400 border-0" />
				<!-- EMPLOYEE INPUTS -->
				<PsalmInput v-if="editMode" class="mr-2" type="text" v-model="employee.firstName" placeholder="Vorname" />
				<PsalmInput v-if="editMode" type="text" v-model="employee.lastName" placeholder="Nachname" />
				<PsalmInput v-if="editMode" type="checkbox" v-model="employee.fullTime" />
				<!-- EMPLOYEE LIST -->
				<div v-if="!editMode" class="px-1">{{ employee.firstName }}</div>
				<div v-if="!editMode" class="px-1">{{ employee.lastName }}</div>
				<PsalmInput v-if="!editMode" type="checkbox" state="disabled" disabled v-model="employee.fullTime" />

				<button class="place-self-center filter hover:brightness-[0.8]" title="Löschen" @click="triggerDeleteModal(employee)"><PsalmIcon name="trash" class="text-danger" /></button>
			</li>
			<!-- NO ENTRYS -->
			<li v-if="tempStaff.length === 0" class="text-center">
				<!-- HORIZONTAL DIVIDER -->
				<hr class="h-[1px] w-full col-span-4 bg-gray-400 border-0" />
				<p>Keine Einträge</p>
			</li>
		</ul>
		<div class="flex justify-center">
			<PsalmButton title="Mitarbeiter hinzufügen" icon="user-plus" class="bg-primary" @click="addEmployee" />
			<PsalmButton v-if="editMode" title="Mitarbeiter speichern" icon="save" class="bg-primary" @click="saveStaff" />
			<PsalmButton v-if="!editMode" title="Mitarbeiter bearbeiten" icon="edit" class="bg-primary" @click="editMode = true" />
		</div>

		<!-- DELETE MODAL -->
		<DeleteModal v-if="showDeleteModal" type="employee" :object-to-delete="employeeToDelete" @confirm="deleteEmployee" @cancel="showDeleteModal = false" />
	</div>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, newEmployee } from "@/models/interfaces/Employee";
	import { pathExists } from "@/utils/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";
	import DeleteModal from "@/components/common/DeleteModal.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";

	@Component({
		name: "Staff",
		components: { DeleteModal, PsalmButton, PsalmIcon, PsalmInput },
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

		// updateCheckbox(nativeValue: boolean, value: boolean): void {
		// 	nativeValue = value;
		// }

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
			this.employeeToDelete = employeeToDelete;
			this.showDeleteModal = true;
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
