<template>
	<PsalmCard class="py-4 min-w-[500px] max-w-[500px]">
		<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[1fr,1fr,3rem,2rem] font-semibold mx-2 lg:mr-6">
			<div class="px-1" title="Vorname">Vorname</div>
			<div class="px-1" title="Nachname">Nachname</div>
			<div class="text-center" title="Hauptamtlich?">HA?</div>
		</div>
		<div class="lg:overflow-y-scroll inner-scrollbar lg:max-h-[calc(100vh-11.25rem)] mx-2 lg:mr-0">
			<ul>
				<li class="grid grid-cols-[1fr,1fr,3rem,2rem] grid-rows-[auto,auto]" v-for="employee in tempStaff" :key="employee.id">
					<!-- HORIZONTAL DIVIDER -->
					<hr class="h-[1px] w-full col-span-4 bg-gray-400 border-0" />
					<!-- EMPLOYEE INPUTS -->
					<PsalmInput class="my-1 mr-2" type="text" v-model="employee.firstName" placeholder="Vorname" :title="employee.firstName" />
					<PsalmInput class="my-1" type="text" v-model="employee.lastName" placeholder="Nachname" :title="employee.lastName" />
					<PsalmInput type="checkbox" v-model="employee.fullTime" />

					<PsalmDeleteButton @click="triggerDeleteModal(employee)" />
				</li>
				<!-- NO ENTRYS -->
				<li v-if="tempStaff.length === 0" class="text-center">
					<!-- HORIZONTAL DIVIDER -->
					<hr class="h-[1px] w-full col-span-4 bg-gray-400 border-0" />
					<p>Keine Einträge</p>
				</li>
			</ul>
		</div>
		<div class="flex justify-center">
			<PsalmButton title="Mitarbeiter hinzufügen" icon="user-plus" class="bg-primary" @click="addEmployee" />
			<PsalmButton title="Mitarbeiter speichern" icon="save" class="bg-primary" @click="saveStaff" />
			<!-- <PsalmButton v-if="!editMode" title="Mitarbeiter bearbeiten" icon="edit" class="bg-primary" @click="editMode = true" /> -->
		</div>

		<!-- DELETE MODAL -->
		<PsalmDeleteModal v-if="showDeleteModal" type="employee" :object-to-delete="employeeToDelete" @confirm="deleteEmployee" @cancel="showDeleteModal = false" />
	</PsalmCard>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, newEmployee } from "@/models/interfaces/Employee";
	import { pathExists } from "@/utils/utils";
	import { removeFile, writeFile } from "@tauri-apps/api/fs";
	import PsalmDeleteModal from "@/components/common/PsalmDeleteModal.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmDeleteButton from "@/components/common/PsalmDeleteButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";

	@Component({
		name: "Staff",
		components: { PsalmDeleteModal, PsalmButton, PsalmDeleteButton, PsalmCard, PsalmIcon, PsalmInput },
	})
	export default class Staff extends Vue {
		tempStaff: Array<Employee> = [];

		showDeleteModal = false;
		employeeToDelete = newEmployee();

		get staff(): Array<Employee> {
			return store.state.staff;
		}

		created(): void {
			this.tempStaff = JSON.parse(JSON.stringify(this.staff));
		}

		addEmployee(): void {
			this.tempStaff.push(newEmployee());
		}

		async saveStaff(): Promise<void> {
			//SORT TEMP-STAFF
			this.tempStaff.sort((a, b) => {
				const lastNameSortingResult = a.lastName.localeCompare(b.lastName, "de", { ignorePunctuation: true, sensitivity: "base" });
				const firstNameSortingResult = a.firstName.localeCompare(b.firstName, "de", { ignorePunctuation: true, sensitivity: "base" });

				return lastNameSortingResult !== 0 ? lastNameSortingResult : firstNameSortingResult;
			});

			// PUSH TEMP-STAFF TO STORE
			store.commit("updateStaff", this.tempStaff);

			// DELETE JSON FILE
			if (await pathExists("data", "data\\staff.json")) {
				await removeFile("data/staff.json");
			}
			// WRITE JSON FILE
			await writeFile({ contents: JSON.stringify(store.state.staff), path: "data/staff.json" });

			// SHOW SAVED TOAST
			store.commit("showToast", "saved");
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
