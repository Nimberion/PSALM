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
			<PsalmInput class="min-w-[300px] w-[calc(100%-2rem)] font-semibold mb-4 mx-4" type="text" v-model.trim="tempProject.title" placeholder="Titel" :title="tempProject.title" />
			<!-- LIST -->
			<div class="grid grid-cols-[160px,1fr,3rem] pl-4 pr-6 font-semibold">
				<p class="pl-1">Doodle Namen</p>
				<p>PSALM Mitarbeiter</p>
				<p class="text-center">OKs</p>
			</div>
			<div class="overflow-y-scroll scrollbar-p-2 max-h-[calc(100vh-13.75rem)] pl-4">
				<ul>
					<li v-for="(importedEmployeeData, index) in importedStaffData" :key="`staff-${index}`" class="grid grid-cols-[160px,1fr,3rem] items-center">
						<!-- HORIZONTAL DIVIDER -->
						<hr class="h-[1px] w-full col-span-3 bg-gray-400 border-0" />
						<div class="px-1" :title="importedEmployeeData[0]">{{ importedEmployeeData[0] }}</div>
						<!-- v-model="tempProjectStaff[index]" -->
						<!-- :selected="`${employee.firstName} ${employee.lastName}`.toLowerCase().includes(importedEmployeeData[0].toLowerCase())" -->
						<select v-model="tempProjectStaff[index]" class="focus:border-secondary focus:ring-0 p-0 px-1 my-1 scrollbar-p-0" @change="updateTempProjectStaff(index, $event)">
							<option value="-">-</option>
							<option v-for="(employee, index) in staff" :key="index" :value="employee.id">{{ employee.firstName }} {{ employee.lastName }}</option>
						</select>
						<div class="text-center">{{ importedEmployeeData.filter((e) => e === "OK").length }}</div>
					</li>
				</ul>
			</div>
			<div class="flex justify-center">
				<PsalmButton class="bg-primary" @click="formatDataToProject()">Importieren</PsalmButton>
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
	import { Available } from "@/models/enums/Available";

	@Component({
		name: "DoodleImportModal",
		components: { PsalmInput, PsalmButton, PsalmCard, PsalmIcon },
	})
	export default class DoodleImportModal extends Vue {
		scrollY = window.scrollY; // FOR Y-OFFSET

		rawData: Array<Array<string>> = [];

		tempProject: Project = newProject(newID());
		importedStaffData: Array<Array<string>> = [];
		tempProjectStaff: Array<string> = [];

		get staff(): Array<Employee> {
			return store.state.staff;
		}

		created(): void {
			document.body.classList.add("no-scroll");
			this.importDoddleList();
		}

		enableScrolling(): void {
			document.body.classList.remove("no-scroll");
		}

		updateTempProjectStaff(index: number, e: { target: HTMLInputElement }): void {
			this.tempProjectStaff[index] = e.target.value;
		}

		async importDoddleList(): Promise<void> {
			// OPEN DIALOG
			const path = await open({ filters: [{ name: "Doodle Export", extensions: ["xls", "xlsx"] }] });

			// READ FILE IF PICKED
			if (path) {
				invoke("read_excel_file", { path: path }).then((fileData) => {
					this.rawData = JSON.parse(fileData as string) as Array<Array<string>>;

					this.getDataForReview();
				});
			} else {
				this.$emit("cancel");
				this.enableScrolling();
			}
		}

		getDataForReview(): void {
			// GET TITLE
			this.tempProject.title = this.rawData[0][0].match(/"(.*)"/)?.[1] || "Keinen Titel gefunden";

			// GET STAFF DATA
			this.importedStaffData = this.rawData.slice(6, -1);

			// COMPARE DOODLE STAFF WITH PSALM STAFF
			for (let i = 0; i < this.importedStaffData.length; i++) {
				this.staff.forEach((employee) => {
					if (`${employee.firstName} ${employee.lastName}`.toLowerCase().includes(this.importedStaffData[i][0].toLowerCase())) {
						this.tempProjectStaff[i] = employee.id;
						// return;
					}
					// else {
					// 	this.tempProjectStaff[i] = "";
					// }
				});

				if (!this.tempProjectStaff[i]) {
					this.tempProjectStaff[i] = "-";
				}
			}
		}

		formatDataToProject(): void {
			// GET PROJECT STAFF
			this.tempProject.staff = this.tempProjectStaff.filter((item) => item !== "-");
			this.tempProject.projectDays = [];

			// GET PROJECT DAYS
			const dateMY = this.rawData[3];
			const dateDD = this.rawData[4];
			const time = this.rawData[5];

			const translateMonth = new Map();
			translateMonth.set("Januar", "January").set("Februar", "February").set("März", "March").set("Mai", "May").set("Juni", "June").set("Juli", "July").set("Oktober", "October").set("Dezember", "December");

			// LOOP FOR EACH PROJECT DAY
			for (let i = 1; i < dateMY.length; i++) {
				if (!dateMY[i]) {
					dateMY[i] = dateMY[i - 1];
				}

				// TRANSLATE GERMAN MONTHS TO ENGLISH
				dateMY[i] = dateMY[i].replace(/\b(?:Januar|Februar|März|Mai|Juni|Juli|Oktober|Dezember)\b/gi, (matched) => translateMonth.get(matched));

				const staffAvailability: Array<EmployeeAvailability> = [];
				// LOOP FOR EACH EMPLOYEE
				for (let j = 0; j < this.importedStaffData.length; j++) {
					console.log(this.tempProjectStaff[j]);
					if (this.tempProjectStaff[j] !== "-") {
						if (this.importedStaffData[j][i] === "OK") {
							staffAvailability.push(newEmployeeAvailability(this.tempProjectStaff[j], Available.TRUE));
						} else {
							staffAvailability.push(newEmployeeAvailability(this.tempProjectStaff[j], Available.FALSE));
						}
					}
				}

				this.tempProject.projectDays.push({
					id: newID(),
					date: new Date(`${dateDD[i].split(" ")[1]} ${dateMY[i]} 00:00:00 UTC`).toISOString().split("T")[0],
					time: time[i].replaceAll("–", "-"),
					participant: "",
					staffAvailability: staffAvailability,
				} as ProjectDay);
			}

			this.$emit("import", this.tempProject);
			this.enableScrolling();
		}
	}
</script>

<style>
	.no-scroll {
		overflow: hidden;
	}
</style>
