<template>
	<PsalmCard class="py-4 min-w-[500px] max-w-[500px]">
		<h2 class="text-xl text-center font-semibold mb-4">Mitarbeiter</h2>
		<!-- LIST HEADER -->
		<div class="grid grid-cols-[1fr,1fr,3rem,2rem] font-semibold border-b border-gray-400 mx-2 lg:mr-6">
			<div class="px-1" title="Vorname">Vorname</div>
			<div class="px-1" title="Nachname">Nachname</div>
			<div class="text-center" title="Hauptamtlich?">HA?</div>
		</div>
		<div class="lg:overflow-y-scroll scrollbar-p-2 lg:max-h-[calc(100vh-11.3125rem)] mx-2 lg:mr-0">
			<ul>
				<li class="grid grid-cols-[1fr,1fr,3rem,2rem] grid-rows-[auto,auto] border-b border-gray-400 last:border-b-0" v-for="employee in tempStaff" :key="employee.id">
					<PsalmInput class="my-1 mr-2" type="text" v-model.trim="employee.firstName" placeholder="Vorname" :title="employee.firstName" />
					<PsalmInput class="my-1" type="text" v-model.trim="employee.lastName" placeholder="Nachname" :title="employee.lastName" />
					<PsalmInput type="checkbox" v-model="employee.fullTime" />

					<PsalmDeleteButton @click="triggerDeleteModal(employee)" />
				</li>
				<!-- NO ENTRYS -->
				<li v-if="tempStaff.length === 0" class="text-center">Keine Einträge</li>
			</ul>
		</div>
		<div class="flex justify-center">
			<PsalmButton title="Mitarbeiter hinzufügen" icon="user-plus" class="bg-primary" @click="addEmployee" />
			<PsalmButton title="Mitarbeiter speichern" icon="save" class="bg-primary" @click="saveStaff" />
			<PsalmButton title="Mitarbeiter importieren" icon="import" class="bg-primary" @click="showStaffImportModal = true" />
		</div>

		<!-- STAFF IMPORT MODAL -->
		<StaffImportModal v-if="showStaffImportModal" @import="importStaff" @cancel="showStaffImportModal = false" />
	</PsalmCard>
</template>

<script lang="ts">
	import { Component, Vue } from "vue-property-decorator";
	import store from "@/store/index";
	import { Employee, newEmployee } from "@/models/interfaces/Employee";
	import StaffImportModal from "@/components/home/StaffImportModal.vue";
	import PsalmModal from "@/components/common/PsalmModal.vue";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmDeleteButton from "@/components/common/PsalmDeleteButton.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import { ModalType } from "@/models/enums/ModalType";

	@Component({
		name: "Staff",
		components: { PsalmModal, PsalmButton, PsalmDeleteButton, PsalmCard, PsalmIcon, PsalmInput, StaffImportModal },
	})
	export default class Staff extends Vue {
		showStaffImportModal = false;

		get tempStaff(): Array<Employee> {
			return store.state.tempStaff;
		}

		addEmployee(): void {
			this.tempStaff.push(newEmployee());
		}

		async saveStaff(): Promise<void> {
			await store.dispatch("saveTempStatesToFiles");
		}

		triggerDeleteModal(employeeToDelete: Employee): void {
			store.commit("showModal", { type: ModalType.DELETE_EMPLOYEE, content: employeeToDelete });
		}

		async importStaff(staffToImport: Array<Employee>): Promise<void> {
			staffToImport.forEach((employee) => {
				this.tempStaff.push(employee);
			});

			await this.saveStaff();
			store.commit("showToast", "imported");

			this.showStaffImportModal = false;
		}
	}
</script>
