<template>
	<div class="absolute left-0 bottom-0 right-0 top-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)] overflow-hidden z-50" :style="`top: ${scrollY}px;`">
		<PsalmCard class="py-4 min-w-[500px] max-w-[500px] relative">
			<button
				class="absolute top-0 right-0"
				@click="
					$emit('cancel');
					enableScrolling();
				"
			>
				<PsalmIcon name="close" class="text-[30px] p-[5px] hover:bg-danger hover:text-white" />
			</button>
			<h2 class="text-xl text-center font-semibold mb-4">PDF Export pro Mitarbeiter</h2>
			<!-- LIST -->
			<div class="grid grid-cols-[2rem,1fr,1fr,5rem] pl-4 pr-6 font-semibold items-center">
				<input
					type="checkbox"
					:indeterminate.prop="indeterminate"
					:checked="allSelected"
					class="h-[1.125rem] w-[1.125rem] border-2 border-primary place-self-center text-primary focus:ring-secondary focus:ring-1 cursor-pointer my-1"
					@change="toggleSelectAll"
				/>
				<!-- <PsalmInput type="checkbox" :value="allSelected" /> -->
				<!-- <input class="ml-1" type="checkbox" /> -->
				<p>Vorname</p>
				<p>Nachname</p>
				<p class="text-center">Einträge</p>
			</div>
			<div class="overflow-y-scroll scrollbar-p-2 max-h-[calc(100vh-13.75rem)] pl-4">
				<ul>
					<li v-for="employee in staff" :key="employee.id">
						<label class="cursor-pointer grid grid-cols-[2rem,1fr,1fr,5rem] items-center border-t border-gray-400">
							<input
								type="checkbox"
								v-model="selectedEmployeesForPdfExport"
								:value="employee.id"
								class="h-[1.125rem] w-[1.125rem] border-2 border-primary place-self-center text-primary focus:ring-secondary focus:ring-1 cursor-pointer my-1"
							/>
							<div class="overflow-ellipsis overflow-hidden whitespace-nowrap mx-1" :title="employee.firstName">{{ employee.firstName }}</div>
							<div class="overflow-ellipsis overflow-hidden whitespace-nowrap" :title="employee.lastName">{{ employee.lastName }}</div>
							<div class="text-center">{{ getNumberOfEntrys(employee.id) }}</div>
						</label>
					</li>
					<li class="text-danger font-semibold text-sm text-center mt-4">Achtung! Bereits vorhandene Dateien werden überschrieben.</li>

					<li v-if="staff.length === 0" class="text-center border-t border-gray-400">Keine Einträge</li>
				</ul>
			</div>
			<div class="flex justify-center">
				<PsalmButton
					class="bg-primary"
					:class="{ 'bg-gray-400 cursor-default hover:from-gray-400 hover:to-gray-400': selectedEmployeesForPdfExport.length === 0 }"
					:disabled="selectedEmployeesForPdfExport.length === 0"
					@click="exportPdfForEachEmployee"
				>
					Exportieren
				</PsalmButton>
				<PsalmButton
					class="bg-gray-500"
					@click="
						$emit('cancel');
						enableScrolling();
					"
					>Abbrechen</PsalmButton
				>
			</div>
		</PsalmCard>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { open } from "@tauri-apps/api/dialog";
	import { Employee } from "@/models/interfaces/Employee";
	import { Project } from "@/models/interfaces/Project";
	import store from "@/store";
	import { Deployed } from "@/models/enums/Deployed";
	import { unequal } from "@/utils/utils";
	import { writePdfForEachEmployee } from "@/utils/projects";

	@Component({
		name: "PdfDownloadModal",
		components: { PsalmInput, PsalmButton, PsalmCard, PsalmIcon },
	})
	export default class PdfDownloadModal extends Vue {
		@Prop({ required: true }) tempProject!: Project;

		scrollY = window.scrollY; // FOR Y-OFFSET

		projectId = this.$route.path.split("/")[2];
		selectedEmployeesForPdfExport: Array<string> = [];

		// allSelected = true;
		indeterminate = false;

		get allSelected(): boolean {
			if (
				!unequal(
					this.selectedEmployeesForPdfExport,
					this.staff.map((e) => e.id),
				)
			) {
				this.indeterminate = false;
				return true;
			} else if (this.selectedEmployeesForPdfExport.length > 0) {
				this.indeterminate = true;
				return false;
			} else {
				this.indeterminate = false;
				return false;
			}
		}

		get staff(): Array<Employee> {
			return store.state.fileStaff.filter((item) => this.tempProject.staff.includes(item.id) && this.getNumberOfEntrys(item.id) > 0);
		}

		created(): void {
			document.body.classList.add("no-scroll");
			this.selectedEmployeesForPdfExport = this.staff.map((e) => e.id);
		}

		enableScrolling(): void {
			document.body.classList.remove("no-scroll");
		}

		async exportPdfForEachEmployee(): Promise<void> {
			const path = (await open({ directory: true })) as string;

			if (path) {
				await writePdfForEachEmployee(this.tempProject, path, this.selectedEmployeesForPdfExport);

				this.enableScrolling();
				this.$emit("cancel");
			}
		}

		getNumberOfEntrys(employeeId: string): number {
			return this.tempProject.projectDays.reduce((accumulator, currentValue) => {
				if (currentValue.staffAvailability.filter((e) => e.employeeId === employeeId && e.deployed !== Deployed.FALSE).length > 0) {
					return accumulator + 1;
				} else {
					return accumulator;
				}
			}, 0);
		}

		toggleSelectAll(): void {
			if (this.allSelected) {
				this.selectedEmployeesForPdfExport = [];
			} else {
				this.selectedEmployeesForPdfExport = this.staff.map((e) => e.id);
			}
		}
	}
</script>
