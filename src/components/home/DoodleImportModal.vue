<template>
	<div class="absolute left-0 bottom-0 right-0 top-0 h-full min-h-screen min-w-[100vw] grid place-items-center bg-[rgba(0,0,0,0.8)] overflow-hidden z-50" :style="`top: ${scrollY}px;`">
		<PsalmCard v-if="rawData.length > 0" class="py-4 min-w-[500px] max-w-[600px] relative">
			<button
				class="absolute top-0 right-0"
				@click="
					$emit('cancel');
					enableScrolling();
				"
			>
				<PsalmIcon name="close" class="text-[30px] p-[5px] hover:bg-danger hover:text-white" />
			</button>
			<h2 class="text-xl text-center font-semibold mb-4">Doodle Import</h2>
			<!-- TITLE -->
			<PsalmInput class="min-w-[300px] w-[calc(100%-2rem)] font-semibold mb-4 mx-4" type="text" v-model="importedProject.title" placeholder="Titel" :title="importedProject.title" />
			<!-- LIST -->
			<div class="pl-4">Header</div>
			<div class="overflow-y-scroll inner-scrollbar max-h-[calc(100vh-11.25rem)] pl-4">
				<ul>
					<li v-for="(importedEmployeeData, index) in importedStaffData" :key="`staff-${index}`" class="grid grid-cols-2 gap-4">
						<PsalmInput type="text" :value="importedEmployeeData[0]" class="my-1" />
						<select name="pets" id="pet-select" class="focus:border-secondary focus:ring-0 p-0 px-1 my-1">
							<option value="">-</option>
							<option v-for="(employee, index) in staff" :key="index" :value="employee.id">{{ employee.firstName }} {{ employee.lastName }}</option>
						</select>
					</li>
				</ul>
			</div>
			<div class="flex justify-center">
				<PsalmButton
					class="bg-primary"
					@click="
						$emit('import', importedProject);
						enableScrolling();
					"
					>Importieren</PsalmButton
				>
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
	import { Component, Vue } from "vue-property-decorator";
	import PsalmButton from "@/components/common/PsalmButton.vue";
	import PsalmCard from "@/components/common/PsalmCard.vue";
	import PsalmIcon from "@/components/common/PsalmIcon.vue";
	import PsalmInput from "@/components/common/PsalmInput.vue";
	import { EmployeeAvailability, newEmployeeAvailability, newProject, Project, ProjectDay } from "@/models/interfaces/Project";
	import { newID } from "@/utils/utils";
	import { invoke } from "@tauri-apps/api/tauri";
	import { open } from "@tauri-apps/api/dialog";
	import { Employee } from "@/models/interfaces/Employee";
	import store from "@/store";

	@Component({
		name: "DoodleImportModal",
		components: { PsalmInput, PsalmButton, PsalmCard, PsalmIcon },
	})
	export default class DoodleImportModal extends Vue {
		scrollY = window.scrollY; // FOR Y-OFFSET
		projectDayDateToDelete = "";

		rawData: Array<Array<string>> = [];

		importedProject: Project = newProject(newID());
		importedStaffData: Array<Array<string>> = [];

		get staff(): Array<Employee> {
			return store.state.staff;
		}

		get projectStaff(): Array<Employee> {
			return this.staff.filter((item) => this.importedProject.staff.includes(item.id));
		}

		created(): void {
			document.body.classList.add("no-scroll");
			this.importDoddleList();
		}

		enableScrolling(): void {
			document.body.classList.remove("no-scroll");
		}

		async importDoddleList(): Promise<void> {
			// OPEN DIALOG
			const path = await open({ filters: [{ name: "Doodle Export", extensions: ["xls", "xlsx"] }] });

			// READ FILE IF PICKED
			if (path) {
				invoke("read_excel_file", { path: path }).then((fileData) => {
					console.log(JSON.parse(fileData as string) as Array<Array<string>>);
					this.rawData = JSON.parse(fileData as string) as Array<Array<string>>;

					this.formatDataToProject(this.rawData, []);
				});
			} else {
				this.$emit("cancel");
			}
		}

		formatDataToProject(data: Array<Array<string>>, projectStaff: Array<Employee>): void {
			console.log(data);

			// GET TITLE
			this.importedProject.title = data[0][0].match(/"(.*)"/)?.[1] || "Keinen Titel gefunden";

			// GET PROJECT DAYS
			const projectDays = [];
			const dateMY = data[3];
			const dateDD = data[4];
			const time = data[5];

			this.importedStaffData = data.slice(6, -1);
			console.log("staff data", this.importedStaffData);

			for (let i = 1; i < dateMY.length; i++) {
				if (dateMY[i] === "") {
					dateMY[i] = dateMY[i - 1];
				}
				const staffAvailability: Array<EmployeeAvailability> = [];

				projectStaff.forEach((e) => staffAvailability.push(newEmployeeAvailability(e.id)));

				// projectDays.push(newProjectDay(projectStaff, newID(), new Date(`${dateDD[i]} ${dateMY[i]} 00:00 UTC`).toISOString().split("T")[0], time[i].replace("–", "-")));

				projectDays.push({ id: newID(), date: new Date(`${dateDD[i]} ${dateMY[i]} 00:00 UTC`).toISOString().split("T")[0], time: time[i].replace("–", "-"), participant: "", staffAvailability: staffAvailability } as ProjectDay);
			}

			console.log(projectDays);
		}
	}
</script>

<style>
	.no-scroll {
		overflow: hidden;
	}
</style>
